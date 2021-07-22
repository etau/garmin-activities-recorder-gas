/**
 * Activities.csv の新しい情報をスプレッドシートに反映し、カレンダーに登録する関数
 */
function createGarminEventGoogleCalendar() {

  const csv = new Csv();
  if (!csv.exists()) return;
  csv.createBackupFile();

  const sheet = new Sheet();
  const strDates = sheet.getStringDates();
  const newRecords = csv.getNewRecords(strDates);
  if (!csv.hasRecords(newRecords)) return;

  newRecords.
    map(newRecord => new Activity(newRecord)).
    forEach(activity => activity.createGoogleCalendarEvent());

  sheet.operate(newRecords);

}