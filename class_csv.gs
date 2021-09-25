'use strict'

/**
 * csv ファイルに関するオブジェクトを生成するクラス
 */
class Csv {

  /**
   * csv ファイルに関するコンストラクタ
   * @constructor
   */
  constructor() {
    this.file = this.getFile();
  }

  /**
   * csv ファイルを取得するメソッド
   * @return {Object} csv ファイルがある場合はそのオブジェクトを、ない場合は null を返すメソッド
   */
  getFile() {
    try {
      const folder = DriveApp.getFolderById(PS.getProperty('DOWNLOAD_FOLDER_ID'));
      const csvFile = folder.getFilesByType(MimeType.CSV).next();
      return csvFile;
    } catch (e) { return null; }
  }

  /**
   * csv ファイルがあるかどうかを確認するメソッド
   * @return {boolean} csv ファイルの有無
   */
  exists() {
    return Boolean(this.file);
  }

  /**
   * csv ファイルを GAS_Garmin_Activities Archive フォルダに作成するメソッド
   * @param {DriveApp.File} csvFile - csv ファイル 
   */
  createBackupFile(csvFile = this.file) {
    const archiveFolder = DriveApp.getFolderById(PS.getProperty('ARCHIVE_FOLDER_ID'));
    const fileName = DT.toString() + ' Activities.csv';
    archiveFolder.
      createFile(csvFile.getBlob()).
      setName(fileName);
  }

  /**
   * csv ファイルから値部分を取得するメソッド
   * @param {DriveApp.File} csv ファイル
   * @return {Array.<Array<number|string>>} csv ファイルから取得した値
   */
  getValues(csvFile = this.file) {
    const csvData = csvFile.getBlob().getDataAsString();
    const csvValues = Utilities.parseCsv(csvData);
    const csvDataValues = csvValues.filter((_, i) => i >= 1);
    return csvDataValues;
  }

  /**
   * 新規レコードのみを取得するメソッド
   * @param {Array.<string>} strDates - 文字列型の日付を要素とする配列
   * @return {Array.<Array.<number|string>>} 新規レコード
   */
  getNewRecords(strDates) {
    const csvValues = this.getValues();
    const newRecords = csvValues.
      filter(record => !strDates.includes(new Date(record[/* B 列: 日付 */ 1]).toDateString()));
    return newRecords;
  }

  /**
   * レコードを含んだ配列かどうか判定するメソッド
   * @param {Array.<Array.<number|string>>} values - 判定用の 2 次元配列
   * @return {boolean} 値があるかどうかの bool 値
   */
  hasRecords(values) {
    return Boolean(values.length);
  }

}