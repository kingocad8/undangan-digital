/* RANCANG UNDANGAN — Backend "Ucapan & Doa" (GRATIS) */
function sheetUcapan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Ucapan");
  if (!sheet) {
    sheet = ss.insertSheet("Ucapan");
    sheet.appendRow(["Nama", "Pesan", "Waktu"]);
  }
  return sheet;
}
function doGet() {
  var data = sheetUcapan().getDataRange().getValues();
  var out = [];
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][0]) out.push({ nama: data[i][0], pesan: data[i][1] });
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var nama = String(d.nama || "").slice(0, 40);
    var pesan = String(d.pesan || "").slice(0, 220);
    if (nama && pesan) sheetUcapan().appendRow([nama, pesan, new Date()]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false })).setMimeType(ContentService.MimeType.JSON);
  }
}
