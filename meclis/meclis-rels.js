/*
  meclis/mv-parse-all.js tarafindan olusturan json dosyasini Graph Commons'a
  uygun formatta iliskileri iceren csv dosyasina cevirir. dest parametresinde
  belirtilen adrese json dosyasini kaydeder. donem, donem_baslangic ve
  donem_bitis argumanlari ile donem bilgileri girilir.

  kullanim
  node meclis/meclis-rels.js --file <json> --dest <csv> --donem <24>
    --donem_baslangic <26/06/2011> --donem_bitis <23/06/2015>

  olusturdugu iliskiler
  (MV) -[SECILDIGI_BOLGE] -> (Sehir)
  (MV) -[MENSUBU] -> (Siyasi Parti)
  (MV) -[HIZMET_DONEMI] -> (Donem)
  (Siyasi Parti) -[MECLISTE_YER_ALIR] -> (Donem)
 */
'use strict';

var fs = require('fs');
var stringify = require('csv-stringify');
var argv = require('minimist')(process.argv.slice(2));
if (!argv.file || !argv.donem || !argv.dest) {
  console.error('usage: --file <jsonMV> --donem <donem> --dest <dest folder>');
  return;
}

var obj = JSON.parse(fs.readFileSync(argv.file, 'utf8'));

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
  'donem',
  'baslama',
  'bitis'
]);

obj.mvs.forEach(function (mv) {
  stringifier.write([
    'Milletvekili',
    mv.name + ' ' + mv.id,
    argv.donem + '. DONEM TEMSIL ETTI',
    'Sehir',
    mv.city,
    1,
    argv.donem,
    argv.donem_baslangic || '',
    argv.donem_bitis || ''
  ]);

  stringifier.write([
    'Milletvekili',
    mv.name + ' ' + mv.id,
    argv.donem + '. DONEM MENSUBU',
    'Siyasi Parti',
    mv.party,
    1,
    argv.donem,
    argv.donem_baslangic || '',
    argv.donem_bitis || ''
  ]);

  stringifier.write([
    'Milletvekili',
    mv.name + ' ' + mv.id,
    'HIZMET DONEMI',
    'Donem',
    argv.donem + '. Donem',
    1,
    argv.donem,
    argv.donem_baslangic || '',
    argv.donem_bitis || ''
  ]);
});

obj.parties.forEach(function (parti) {
  stringifier.write([
    'Siyasi Parti',
    parti,
    'MECLISTE YER ALDI',
    'Donem',
    argv.donem + '. Donem',
    1,
    argv.donem,
    argv.donem_baslangic || '',
    argv.donem_bitis || ''
  ]);
});

stringifier.end();
