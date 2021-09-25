'use strict'

/**
 * 日付に関するオブジェクトを生成するクラス
 */
class Datetime {

  /**
   * 日付に関するコンストラクタ
   * @constructor
   * @param {Date} date - Date オブジェクト
   */
  constructor(date = new Date()) {
    new Type(date, TYPE.DATE);
    this.date = date;
  }

  /**
   * コンストラクタの date オブジェクトを指定のフォーマットで文字列化するメソッド
   * @param {string} format - 日付を文字列化するための指定のフォーマット
   * @return {string}  日付を文字列化したもの
   */
  toString(format = 'yyyy/MM/dd') {
    new Type(format, TYPE.STRING);
    const strDate = Datetime.format(this.date, format);
    return strDate;
  }

  /**
   * 文字列型の日付を生成するメソッド
   * @param {Date} d - Date オブジェクト 文字列型も可
   * @param {string} format - フォーマットする形式
   * @return {string} フォーマットされた文字列型の日付
   */
  static format(d = new Date(), format = 'yyyyMMdd_HHmm') {
    new Type(date, TYPE.DATE); new Type(format, TYPE.STRING);
    const date = new Date(d);
    const stringDate = Utilities.formatDate(date, 'JST', format);
    return stringDate;
  }

}