/** 
 * GitHub README.md
 * https://github.com/etau/garmin-activities-recorder-gas/blob/main/README.md
 */



/**
 * 日付に関するオブジェクトを生成するクラス
 */
class Datetime {

  /**
   * @param {Date} date - Date オブジェクト 文字列型も可
   */
  constructor(date = new Date()) {
    this.date = date;
    this.string = Datetime.format(this.date);
  }

  /**
   * 文字列型の日付を生成するメソッド
   * @param {Date} d - Date オブジェクト 文字列型も可
   * @param {string} format - フォーマットする形式
   * @return {string} フォーマットされた文字列型の日付
   */
  static format(d = new Date(), format = 'yyyyMMdd_HHmm') {
    const date = new Date(d);
    const stringDate = Utilities.formatDate(date, 'JST', format);
    return stringDate;
  }

}

const DT = Object.freeze(new Datetime());



/**
 * プロパティ ストアに関するクラス
 */
class Properties {

  constructor() {
    this.props = PropertiesService.getScriptProperties();
    this.calendarId = this.props.getProperty('GARMIN_CALENDAR_ID');
    this.downloadFolderId = this.props.getProperty('DOWNLOAD_FOLDER_ID');
    this.archiveFolderId = this.props.getProperty('ARCHIVE_FOLDER_ID');
  }

  /**
   * プロパティ ストアにキーと値をセットするメソッド
   * @param {string} key - プロパティ ストアのキー
   * @param {stirng} value - プロパティ ストアの値
   */
  static setProperty(key, value) {
    this.props.setProperty(key, value);
  }

}

const PROPS = Object.freeze(new Properties());