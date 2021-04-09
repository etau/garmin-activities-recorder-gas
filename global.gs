/** 
 * GitHub README.md
 * https://github.com/etau/garmin-activities-recorder-gas/blob/main/README.md
 */



/**
 * グローバル定数宣言
 */
const D = new Date();
const SHEET = SpreadsheetApp.getActiveSheet();
const PROPS = PropertiesService.getScriptProperties();



/**
 * ツールをまとめたクラス
 */
class Toolkit {

  /**
   * シートのヘッダーを削除した値のみを返すメソッド
   * @return {Object[][]} values - ヘッダーを削除した値
   */
  static getDataValues(sheet) {
    const values = sheet.getDataRange().getValues();
    values.shift();
    return values;
  }

  /**
   * 日付をフォーマットするメソッド
   * @param {Object} d - Date オブジェクト
   * @param {string} format - 日付のフォーマット
   * @return {string} 指定のフォーマットに変更した文字列型の日付
   */
  static fomatDate(d = D, format = 'yyyyMMdd_HHmm') {
    const date = new Date(d);
    return Utilities.formatDate(date, 'JST', format);
  }

  /**
   * 最終行の下に値を貼り付けるメソッド
   * @param {Object} sheet - 値を貼り付けるシート
   * @param {Object[][]} values - 貼り付ける値
   */
  static appendValues(sheet, values) {
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
  }

  /**
   * 2 行目以降でソートするメソッド
   * @param {Object} sheet - 値を貼り付けるシート
   * @param {number} column - ソート対象となる列
   * @param {boolean} ascending - 昇順か降順か
  */
  static sortDataRows(sheet, column = 1, ascending = true) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).sort({ column: column, ascending: ascending });
  }

}