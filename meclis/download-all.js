/*
  belirtilen donem icin meclis/donem-parse.js sonucu olusturulan json dosyasindaki
  mimlletvekillerinin profile sayfalarini indirir. indirilen sayfalar
  sicil_no_donem.html olarak kaydedilir.

  kullanim: node meclis/download-all.js --file <json mv listesi> --donem <donem>
    --dest <kaydedilecek dizin>
 */
'use strict';

var fs = require('fs');
var saveUrl = require('../helpers/save-url');
var argv = require('minimist')(process.argv.slice(2));
var downloadURLTemplate = 'https://www.tbmm.gov.tr/develop/owa/milletvekillerimiz_sd.bilgi?p_donem={{donem}}&p_sicil={{sicil}}';
if (!argv.file || !argv.dest) {
  console.error('usage: --file <jsonMV> --donem <donem> --dest <dest folder>');
  return;
}

var mvJSON = JSON.parse(fs.readFileSync(argv.file, 'utf8'));
mvJSON = mvJSON.mvs;

mvJSON.forEach(function (mv) {
  var downloadUrl = downloadURLTemplate.replace('{{sicil}}', mv.id)
    .replace('{{donem}}', argv.donem);
  var saveDest = argv.dest + '' + mv.id + '_' + argv.donem + '.html';
  saveUrl(downloadUrl, saveDest);
});
