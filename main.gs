/**
 * Activities.csv の新しい情報をスプレッドシートに反映し、カレンダーに登録する関数
 */
function createGarminEventGoogleCalendar() {

  const csv = new Csv();
  const csvFile = csv.getCsvFile();
  if (!csvFile) return;
  csv.createBackup(csvFile);

  const sheet = new Sheet();
  const strDates = sheet.getStringDates();
  const csvValues = csv.getCsvValues(csvFile);
  const newValues = csvValues.filter(record => !strDates.includes(new Date(record[1]).toDateString()));
  if (!newValues.length) return;

  for (const record of newValues) {
    const activity = new Activity(record);
    activity.createActivityEvent();
  }

  sheet.operate(newValues);

}



/**
 * csv ファイルに関するオブジェクトを生成するクラス
 */
class Csv {

  /**
   * csv ファイルを取得するメソッド
   * @return {Object} csv ファイルがある場合はそのオブジェクトを、ない場合は null を返すメソッド
   */
  getCsvFile() {
    try {
      const folderId = PROPS.getProperty('DOWNLOAD_FOLDER_ID');
      const folder = DriveApp.getFolderById(folderId);
      const csvFile = folder.getFilesByType(MimeType.CSV).next();  // MEMO: csv ファイルがない場合の処理、try catch の対象
      return csvFile;
    } catch (e) { return null }
  }

  /**
   * csv ファイルを GAS_Garmin_Activities Archive フォルダに作成するメソッド
   * @param {Object} csvFile - csv ファイル 
   */
  createBackup(csvFile) {
    const folderId = PROPS.getProperty('ARCHIVE_FOLDER_ID');
    const archiveFolder = DriveApp.getFolderById(folderId);
    archiveFolder.createFile(csvFile.getBlob()).setName(Toolkit.fomatDate() + ' Activities.csv');
  }

  /**
   * csv ファイルから値部分を取得するメソッド
   * @param {Object} csv ファイル
   * @return {Object[][]} csv ファイルから取得した値
   */
  getCsvValues(csvFile) {
    const csvData = csvFile.getBlob().getDataAsString();
    const csvValues = Utilities.parseCsv(csvData);
    csvValues.shift();
    return csvValues;
  }

}



/**
 * シートに関するオブジェクトを生成するクラス
 */
class Sheet {

  /**
   * シートに関するコンストラクタ
   */
  constructor(sheet = SHEET) {
    this.sheet = sheet;
    this.dataValues = Toolkit.getDataValues(this.sheet);
  }

  /**
   * 過去のアクティビティログの日付を文字列で取得するメソッド
   * @return {Object[]} 文字列の日付の値
   */
  getStringDates() {
    return this.dataValues.map(record => record[1].toDateString());
  }

  /**
   * 対象シートの操作 (行追加・ソート) をするメソッド
   * @param {Object[][]} cavValues - csv ファイルから取得した値
   */
  operate(csvValues) {
    Toolkit.setValuesLastRowAfter(this.sheet, csvValues);
    Toolkit.sortDataRows(this.sheet, 2, false);
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
    return new Date(this.date);
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
    return { description: description };
  }

  /**
   * 新しく追加されたアクティビティをカレンダーに反映するメソッド
   */
  createActivityEvent() {
    const calendarId = PROPS.getProperty('GARMIN_CALENDAR_ID');
    const calendar = CalendarApp.getCalendarById(calendarId);
    calendar.createEvent(this.title, this._getStartTme(), this._getEndTime(), this._getOptions());
  }

}