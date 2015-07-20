/*
  meclis/donem-parse.js tarafindan olusturulan json dosyasini kullanarak her
  millet vekilinin biyografi alanini doldurur. dest parametresi ile belirtilen
  adrese yeni json'u kaydeder.
  
  node meclis/mv-parse-all --file data/mvlist.24.json --donem <24> --dest <path>
 */
'use strict';

var fs = require('fs');
var Promise = require('promise');
var parseBio = require('./mv-parse-one');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.file) {
  console.error('usage --file <source> --dest <dest>');
  return;
}

var mvJSON = JSON.parse(fs.readFileSync(argv.file, 'utf8'));

var sequence = Promise.resolve();

mvJSON.mvs.forEach(function (mv) {

  sequence = sequence.then(function() {
    return new Promise(function (success) {

      parseBio(mv.id, argv.donem).done(function (res) {
        mv.bio = res.bio;
        success();
      });

    });
  });
});

sequence.then(function() {
  fs.writeFileSync(argv.dest, JSON.stringify(mvJSON), 'utf8');
});
