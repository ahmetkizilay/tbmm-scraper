/*
  doneme ait tum milletvekilleri icin ilk imza sahibi teklifleri
  sayfalarini indirir.

  girdi json dosyasi olarak meclis/donem-parse.js sonucunu kullanir.

  kullanim: node ktii/download-all.js --file <json mv listesi> --donem <donem>
    --dest <kaydedilecek dizin>
 */
'use strict';
var fs = require('fs');
var saveUrl = require('../helpers/save-url');
var argv = require('minimist')(process.argv.slice(2));
var downloadURLTemplate = 'https://www.tbmm.gov.tr/develop/owa/kanun_teklifi_s_sd.uye_ilk_imza_sahibi_teklifleri?p_donem={{donem}}&p_sicil={{sicil}}';
if (!argv.file || !argv.donem || !argv.dest) {
  console.error('usage: --file <jsonMV> --donem <donem> --dest <dest folder>');
  return;
}

var mvJSON = JSON.parse(fs.readFileSync(argv.file, 'utf8'));

mvJSON.mvs.forEach(function (mv) {
  var downloadUrl = downloadURLTemplate.replace('{{donem}}', argv.donem)
    .replace('{{sicil}}', mv.id);
  var saveDest = argv.dest + '' + mv.id + '.html';
  saveUrl(downloadUrl, saveDest);
});
