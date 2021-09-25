'use strict'

/**
 * シートに関するオブジェクトを生成するクラス
 */
class Sheet {

  /**
   * シートに関するコンストラクタ
   * @constructor
   * @param {SpreadsheetApp.sheet} sheet - スプレッドシート オブジェクト
   */
  constructor(sheet = SpreadsheetApp.getActiveSheet()) {
    this.sheet = sheet;
  }

  /**
   * 過去のアクティビティログの日付を文字列で取得するメソッド
   * @return {Array.<string>} 文字列の日付の値
   */
  getStringDates() {
    const dicts = this._getDicts();
    const strDates = dicts.
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
   * @return {Array.<string>} ヘッダーの値
   */
  _getHeaders() {
    const headers = this._getDataRangeValues().
      filter((_, i) => i < 1)[0];
    return headers;
  }

  /**
   * 実データ部分を取得するメソッド
   * @return {Array.<Array.<number|string|Date|boolean>>} ヘッダー部分をのぞいた実データ
   */
  _getDataValues() {
    const dataValues = this._getDataRangeValues().
      filter((_, i) => i >= 1);
    return dataValues;
  }

  /**
   * シートの値すべて取得するメソッド 
   * @return {Array.<Array.<number|string|Date|boolean>>} シートの値
   */
  _getDataRangeValues() {
    const dataRangeValues = this.sheet.getDataRange().getValues();
    return dataRangeValues;
  }

  /**
   * 対象シートの操作 (行追加・ソート) をするメソッド
   * @param {Array.<Array.<number|string|Date|boolean>>} values - csv ファイルから取得した値
   */
  operate(values) {
    this._appendRows(values);
    this._sortDataRows();
  }

  /**
     * 最終行の下に値を貼り付けるメソッド
     * @param {Array.<Array.<number|string|Date|boolean>>} values - 貼り付ける値
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