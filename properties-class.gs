/**
 * プロパティ ストアに関するクラス
 */
class Properties {

  /**
   * スクリプト プロパティに関するコンストラクタ
   * @constructor
   */
  constructor() {
    this.scriptProperties = PropertiesService.getScriptProperties();
    this.calendarId = this.scriptProperties.getProperty('GARMIN_CALENDAR_ID');
    this.downloadFolderId = this.scriptProperties.getProperty('DOWNLOAD_FOLDER_ID');
    this.archiveFolderId = this.scriptProperties.getProperty('ARCHIVE_FOLDER_ID');
  }

}