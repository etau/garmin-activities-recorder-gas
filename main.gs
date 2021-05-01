/**
 * Activities.csv の新しい情報をスプレッドシートに反映し、カレンダーに登録する関数
 */
function createGarminEventGoogleCalendar() {

  const csv = new Csv();
  if (!csv.exists()) return;
  csv.createBackupFile();

  const sheet = new Sheet();
  const strDates = sheet.getStringDates();
  const newRecords = csv.getNewRecords(strDates);
  if (!csv.hasRecords(newRecords)) return;

  for (const record of newRecords) {
    const activity = new Activity(record);
    activity.createGoogleCalendarEvent();
  }

  sheet.operate(newRecords);

}



/**
 * csv ファイルに関するオブジェクトを生成するクラス
 */
class Csv {

  constructor() {
    this.file = this._getFile();
  }

  /**
   * csv ファイルを取得するメソッド
   * @return {Object} csv ファイルがある場合はそのオブジェクトを、ない場合は null を返すメソッド
   */
  _getFile() {
    try {
      const folder = DriveApp.getFolderById(PROPS.downloadFolderId);
      const csvFile = folder.getFilesByType(MimeType.CSV).next();  // MEMO: csv ファイルがない場合の処理、try catch の対象
      return csvFile;
    } catch (e) { return null }
  }

  /**
   * csv ファイルがあるかどうかを確認するメソッド
   * @return {boolean} csv ファイルの有無
   */
  exists() {
    return !!this.file;
  }

  /**
   * csv ファイルを GAS_Garmin_Activities Archive フォルダに作成するメソッド
   * @param {Object} csvFile - csv ファイル 
   */
  createBackupFile(csvFile = this.file) {
    const archiveFolder = DriveApp.getFolderById(PROPS.archiveFolderId);
    const fileName = DT.string + ' Activities.csv';
    archiveFolder.
      createFile(csvFile.getBlob()).
      setName(fileName);
  }

  /**
   * csv ファイルから値部分を取得するメソッド
   * @param {Object} csv ファイル
   * @return {Object[][]} csv ファイルから取得した値
   */
  _getValues(csvFile = this.file) {
    const csvData = csvFile.getBlob().getDataAsString();
    const csvValues = Utilities.parseCsv(csvData);
    const csvDataValues = csvValues.
      filter((_, i) => i >= 1);
    return csvDataValues;
  }

  /**
   * 新規レコードのみを取得するメソッド
   * @param {string[]} strDates - 文字列型の日付を要素とする配列
   * @return {Object[][]} 新規レコード
   */
  getNewRecords(strDates) {
    const csvValues = this._getValues();
    const newRecords = csvValues.
      filter(record => !strDates.includes(new Date(record[1]).toDateString()));
    return newRecords;
  }

  /**
   * レコードを含んだ配列かどうか判定するメソッド
   * @param {Object[][]} values - 判定用の 2 次元配列
   */
  hasRecords(values) {
    return !!values.length;
  }

}



/**
 * シートに関するオブジェクトを生成するクラス
 */
class Sheet {

  /**
   * シートに関するコンストラクタ
   */
  constructor(sheet = SpreadsheetApp.getActiveSheet()) {
    this.sheet = sheet;
    this.values = sheet.getDataRange().getValues();
  }

  /**
   * 過去のアクティビティログの日付を文字列で取得するメソッド
   * @return {string[]} 文字列の日付の値
   */
  getStringDates() {
    const maps = this._getDicts();
    const strDates = maps.
      map(map => map.get('日付').toDateString());
    return strDates;
  }

  /**
   * ヘッダーをキーとした Map の配列を作成するメソッド
   * @return {Map[]} ヘッダーをキーとした Map
   */
  _getDicts() {
    const headers = this._getHeaders();
    const values = this._getDataValues();
    const dicts = values.
      map(record => record.
        reduce((acc, cur, i) => acc.set(headers[i], cur), new Map()));
    return dicts;
  }

  /**
   * ヘッダーを取得するメソッド
   * @return {string[]} ヘッダーの値
   */
  _getHeaders() {
    const headers = this.values.
      filter((_, i) => i < 1)[0];
    return headers;
  }

  /**
   * 実データ部分を取得するメソッド
   * @return {Object[][]} ヘッダー部分をのぞいた実データ
   */
  _getDataValues() {
    const dataValues = this.values.
      filter((_, i) => i >= 1);
    return dataValues;
  }

  /**
   * 対象シートの操作 (行追加・ソート) をするメソッド
   * @param {Object[][]} values - csv ファイルから取得した値
   */
  operate(values) {
    this._appendRows(values);
    this._sortDataRows();
  }

  /**
     * 最終行の下に値を貼り付けるメソッド
     * @param {Object[][]} values - 貼り付ける値
     */
  _appendRows(values) {
    this.sheet.
      getRange(this.sheet.getLastRow() + 1, 1, values.length, values[0].length).
      setValues(values);
  }

  /**
   * 値範囲でソートするメソッド
   */
  _sortDataRows() {
    this.sheet.
      getRange(2, 1, this.sheet.getLastRow() - 1, this.sheet.getLastColumn()).
      sort({ column: 2, ascending: false });
  }

}



/**
 * アクティビティに関するオブジェクトを生成するクラス
 */
class Activity {

  /**
   * アクティビティに関するコンストラクタ
   * @param {Object[]} record - オブジェクトを生成する行
   */
  constructor(record) {
    [
      this.type,
      this.date,
      this.isFavorite,
      this.title,
      this.distance,
      this.kilocalories,
      this.time,
      this.heartRate
    ] = record;
  }

  /**
   * 開始時間を生成するメソッド
   * @return {Object} Date オブジェクト
   */
  _getStartTme() {
    const startTime = new Date(this.date);
    return startTime;
  }

  /**
   * 終了時間を生成するメソッド
   * @return {Object} Date オブジェクト
   */
  _getEndTime() {
    const endTime = new Date(this.date);
    const [hh, mm, ss] = this.time.split(':');
    endTime.setHours(endTime.getHours() + Number(hh));
    endTime.setMinutes(endTime.getMinutes() + Number(mm));
    endTime.setSeconds(endTime.getSeconds() + Number(ss));
    return endTime;
  }

  /**
   * カレンダーに反映する description 部分をオブジェクトとして生成するメソッド
   * @return {Object} Calendar サービスの createEvent メソッドに利用する options 
   */
  _getOptions() {
    const description =
      'アクティビティタイプ: ' + this.type + '\n' +
      '距離: ' + this.distance + ' km\n' +
      'カロリー: ' + this.kilocalories + ' kcal\n' +
      'タイム: ' + this.time + '\n' +
      '平均心拍数:' + this.heartRate;
    const options = {
      description: description
    };
    return options;
  }

  /**
   * 新しく追加されたアクティビティをカレンダーに反映するメソッド
   */
  createGoogleCalendarEvent() {
    const calendar = CalendarApp.getCalendarById(PROPS.calendarId);
    calendar.createEvent(
      this.title,
      this._getStartTme(),
      this._getEndTime(),
      this._getOptions()
    );
  }

}