/*
  kanun teklifi json dosyasini Graph Commons'a uygun import edilecek sekilde
  csv dosyasina cevirir. girdi dosyasi olarak kt-detay/parse-all.js sonucu
  olusan json dosyasini kullanir. dest parametresinde belirtilen adrese
  json dosyasini kaydeder.

  kullanim
  node kt-detay/jt-nodes.js --file <json> --dest <csv>
 */
'use strict';

var fs = require('fs');
var stringify = require('csv-stringify');

var argv = require('minimist')(process.argv.slice(2));
if (!argv.file || !argv.dest) {
  console.error('usage: --file <jsonMV> --dest <dest folder>');
  return;
}

var kts = JSON.parse(fs.readFileSync(argv.file, 'utf8'));

var output = '';
var stringifier = stringify({ delimiter: ',' });
stringifier.on('readable', function() {
  var row;
  while ((row = stringifier.read())) {
    output += row;
  }
});

stringifier.on('finish', function() {
  fs.writeFileSync(argv.dest, output, 'utf8');
});

stringifier.write([
  'Type',
  'Name',
  'Description',
  'Image',
  'Reference',
  'tam metin adresi',
  'donem ve yasama yili',
  'esas no',
  'baskanliga gelis tarihi',
  'baslik',
  'ozet',
  'son durum',
  'id'
]);

kts.forEach(function (kt) {
  stringifier.write([
    'Kanun Teklifi',
    'kt ' + kt.id,
    kt.ozet,
    '',
    'https://www.tbmm.gov.tr/develop/owa/tasari_teklif_sd.onerge_bilgileri?kanunlar_sira_no=' + kt.id,
    kt.tam_metin_adres,
    kt.donem_yasama_yili,
    kt.esas_no,
    kt.baskanliga_gelis_tarihi,
    kt.baslik,
    kt.ozet.replace(/(?:\r\n|\r|\n)/g, '<br />'),
    kt.son_durum,
    kt.id
  ]);
});

stringifier.end();
