'use strict'

/**
 * アクティビティに関するオブジェクトを生成するクラス
 */
class Activity {

  /**
   * アクティビティに関するコンストラクタ
   * @constructor
   * @param {Array.<number|string|Date|boolean>} record - オブジェクトを生成する行
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
    const startTime = new Date(this.date);
    return startTime;
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
    const options = {
      description: description
    };
    return options;
  }

  /**
   * 新しく追加されたアクティビティをカレンダーに反映するメソッド
   */
  createGoogleCalendarEvent() {
    const calendar = CalendarApp.getCalendarById(PROPS.calendarId);
    calendar.createEvent(
      this.title,
      this._getStartTme(),
      this._getEndTime(),
      this._getOptions()
    );
  }

}