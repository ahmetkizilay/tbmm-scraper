/*
  kanun teklifijson dosyasini kullanarak Graph Commons'a import edilecek sekilde
  iliskiler csv dosyasini hazirlar. Girdi dosyasi olarak kt-detay/parse-all.js
  sonucu olusan json dosyasini kullanir. millet vekilleri adi meclis-nodes.csv
  dosyasinda oldugu gibi ad + sicil no olarak kullanilir. donem, donem_baslangic
  ve donem_bitis argumanlari ile donem bilgileri girilir. dest parametresinde
  belirtilen adrese json dosyasini kaydeder.

  kullanim
  node kt-detay/kt-rels.js --file <json> --dest <csv> --donem <24>
    --donem_baslangic <26/06/2011> --donem_bitis <23/06/2015>

  olusturdugu iliskiler
  (Kanun Teklifi)-[SUNULDUGU_DONEM] -> (Donem)
  (MV)-[IMZALADI]->(Kanun Teklifi)
  (Komisyon)-[INCELEDI]->(Kanun Teklifi)
 */
 'use strict';

var fs = require('fs');
var stringify = require('csv-stringify');
var argv = require('minimist')(process.argv.slice(2));
if (!argv.file || !argv.donem || !argv.dest) {
  console.error('usage: --file <jsonMV> --donem <donem> --dest <dest folder>');
  return;
}

var ktArray = JSON.parse(fs.readFileSync(argv.file, 'utf8'));

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
  'NODE TYPE',
  'NODE NAME',
  'EDGE TYPE',
  'NODE TYPE',
  'NODE NAME',
  'Weight',
  'tipi',
  'islem',
  'giris tarihi',
  'cikis tarihi',
  'karar tarihi',
  'ilk imzaci'
]);

ktArray.forEach(function (kt) {
  stringifier.write([
    'Kanun Teklifi',
    'Kanun Teklifi - ' + kt.esas_no + ' - ' + argv.donem,
    'SUNULDUGU DONEM',
    'Donem',
    argv.donem + '. Donem',
    1,
    '',
    '',
    '',
    '',
    '',
    ''
  ]);

  kt.ilkImza.forEach(function (imzaci) {
    stringifier.write([
      'Milletvekili',
      imzaci.ad + ' ' + imzaci.sicil,
      'IMZALADI',
      'Kanun Teklifi',
      'Kanun Teklifi - ' + kt.esas_no + ' - ' + argv.donem,
      1,
      '',
      '',
      '',
      '',
      '',
      'true'
    ]);
  });

  kt.digerImza.forEach(function (imzaci) {
    stringifier.write([
      'Milletvekili',
      imzaci.ad + ' ' + imzaci.sicil,
      'IMZALADI',
      'Kanun Teklifi',
      'Kanun Teklifi - ' + kt.esas_no + ' - ' + argv.donem,
      1,
      '',
      '',
      '',
      '',
      '',
      ''
    ]);
  });

  kt.komisyonlar.forEach(function (komisyon) {
    stringifier.write([
      'Komisyon',
      komisyon.adi,
      'INCELEDI',
      'Kanun Teklifi',
      'Kanun Teklifi - ' + kt.esas_no + ' - ' + argv.donem,
      1,
      komisyon.tipi,
      komisyon.islem,
      komisyon.giris_tarihi,
      komisyon.cikis_tarihi,
      komisyon.karar_tarihi,
      ''
    ]);
  });
});

stringifier.end();
