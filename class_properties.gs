'use strict'

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
  }

  /** 
   * プロパティストアの内容をすべてログする
   */
  log() {
    const properties = this.scriptProperties.getProperties();
    console.log(properties);
  }

}