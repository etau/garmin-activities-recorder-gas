/** 
 * GitHub README.md
 * https://github.com/etau/garmin-activities-recorder-gas/blob/main/README.md
 */



/**
 * 頻出ツールをまとめた静的クラス
 */
class Toolkit {

  /**
   * 日付をフォーマットするメソッド
   * @param {Object} d - Date オブジェクト
   * @param {string} format - 日付のフォーマット
   * @return {string} 指定のフォーマットに変更した文字列型の日付
   */
  static fomatDate(d = this.date, format = 'yyyyMMdd_HHmm') {
    const date = new Date(d);
    const strDate = Utilities.formatDate(date, 'JST', format);
    return strDate;
  }

}

Toolkit.date = new Date();
Toolkit.props = PropertiesService.getScriptProperties();