/*
 * json formatindaki bir dosyadan csv uretmek icin kullanilir.
 * json dosyasinin duzgun formatlandigini varsayar ve ilk siradaki array
 * elemaninin key degerlerine gore csv header'larini olusturur.
 *
 * key parametresi ile json icinden ozellikle bir key belirlenebilir.
 * {one: {}, two: [], three: []} gibi bir yapida --key two vererek two
 * altindaki array'in csv'ye cevrilmesi saglanir.
 *
 * kullanim
 * node helpers/json2csv --file <json dosyasi> --dest <uretilecek csv>
 *    --key <json icinde aranacak key>
 */
'use strict';

var fs = require('fs');
var stringify = require('csv-stringify');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.hasOwnProperty('file')) {
  console.error('ERROR: pass file parameter with --file <file path>');
  return;
}

var destPath = argv.dest;
var filePath = argv.file;
var jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

if (argv.key) {
  var destKey = argv.key.split('.');
  for (var i = 0; i < destKey.length; i += 1) {
    jsonData = jsonData[destKey[i]];
  }
}

// assuming object data is well formatted
var headers = Object.keys(jsonData[0]);

var output = '';
var stringifier = stringify({ delimiter: ',' });
stringifier.on('readable', function() {
  var row;
  while ((row = stringifier.read())) {
    output += row;
  }
});

stringifier.on('finish', function() {
  if (destPath) {
    fs.writeFileSync(destPath, output, 'utf8');
  }
  else {
    console.log(output);
  }
});

stringifier.write(headers);

jsonData.forEach(function (item) {
  var line = [];

  headers.forEach(function (h) {
    line.push(item[h] || '');
  });

  stringifier.write(line);
});

stringifier.end();
