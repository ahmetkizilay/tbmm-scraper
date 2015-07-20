/*
  meclis/mv-parse-all.js tarafindan olusturan json dosyasini Graph Commons'a
  uygun formatta nodelari iceren csv dosyasina cevirir. dest parametresinde
  belirtilen adrese json dosyasini kaydeder. donem, donem_baslangic ve
  donem_bitis argumanlari ile donem bilgileri girilir.

  kullanim
  node meclis/meclis-nodes.js --file <json> --dest <csv> --donem <24>
    --donem_baslangic <26/06/2011> --donem_bitis <23/06/2015>
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
  'Type',
  'Name',
  'Description',
  'Image',
  'Reference',
  'baslangic',
  'bitis'
]);

obj.mvs.forEach(function (mv) {
  stringifier.write([
    'Milletvekili',
    mv.name + ' ' + mv.id, mv.bio.replace(/(?:\r\n|\r|\n)/g, '<br />'),
    mv.image,
    mv.reference,
    '',
    ''
  ]);
});

obj.cities.forEach(function (city) {
  stringifier.write([
    'Sehir',
    city,
    '',
    '',
    '',
    '',
    ''
  ]);
});

obj.parties.forEach(function (party) {
  stringifier.write([
    'Siyasi Parti',
    party,
    '',
    '',
    '',
    '',
    ''
  ]);
});

stringifier.write([
  'Donem',
  argv.donem + '. Donem',
  '',
  '',
  '',
  argv.donem_baslangic,
  argv.donem_bitis || ''
]);

stringifier.end();
