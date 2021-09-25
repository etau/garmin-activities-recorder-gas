'use strict'

/**
 * 日付に関するオブジェクトを生成するクラス
 */
class Datetime {

  /**
   * 日付に関するコンストラクタ
   * @constructor
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