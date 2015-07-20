/*
  bir doneme ait tum kanun tekliflerini parse eder. girdi dosyasi olarak
  ktii/parse-all.js programi sonucu olusan json dosyasini kullanir. dest
  parametresinden belirtilen adrese json olarak kaydeder.

  node kkti/parse-all --file <input json> --dest <output json>
 */
'use strict';

var fs = require('fs');
var Promise = require('promise');
var parseKanunTasariPage = require('./parse-one');
var argv = require('minimist')(process.argv.slice(2));
var ktJSON = JSON.parse(fs.readFileSync(argv.file, 'utf8'));

var ktIds = Object.keys(ktJSON);
var sequence = Promise.resolve();

var ktDetayArray = [];
ktIds.forEach(function (id) {
  sequence = sequence.then(function() {
    return new Promise(function (success) {
      var path = argv.contentDir + id + '.html';
      parseKanunTasariPage(path).done(function (ktDetay) {
        ktDetay.id = id;
        ktDetayArray.push(ktDetay);
        success();
      });
    });
  });
});

sequence.then(function() {
  fs.writeFileSync(argv.dest, JSON.stringify(ktDetayArray), 'utf8');
});
