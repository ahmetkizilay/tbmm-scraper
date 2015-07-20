/*
  kanun tasari sayfalarinin tumunu sirayla indirir.
  kullanilacak girdi json dosyasi olarak kkti/parse-all.js kodunun sonucunu
  kullanir. indirilen dosyalari dest argumanindaki adrese kanun teklifi kayit
  numarasina gore kaydeder.

  node kt-detay/download-all.js --file <ii json> --dest <dizin>

 */
'use strict';
var fs = require('fs');
var saveUrl = require('../helpers/save-url');
var argv = require('minimist')(process.argv.slice(2));
var downloadURLTemplate = 'https://www.tbmm.gov.tr/develop/owa/tasari_teklif_sd.onerge_bilgileri?kanunlar_sira_no={{id}}';
if (!argv.file || !argv.dest) {
  console.error('usage: --file <jsonMV> --donem <donem> --dest <dest folder>');
  return;
}

var ktJSON = JSON.parse(fs.readFileSync(argv.file, 'utf8'));
var ktIds = Object.keys(ktJSON);

ktIds.forEach(function (id) {
  var downloadUrl = downloadURLTemplate.replace('{{id}}', id);
  var saveDest = argv.dest + '' + id + '.html';
  saveUrl(downloadUrl, saveDest);
});
