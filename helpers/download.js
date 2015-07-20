/*
 * tbmm.gov.tr adresinden iso-8859-9 encoding'li sayfalari indirmek
 * icin kullanilir.
 *
 */
'use strict';
var https = require('https');
var Promise = require('promise');
var encoding = require('encoding');

function download(url) {
  return new Promise(function (success, fail) {
    https.get(url, function (res) {
      var data = '';
      res.setEncoding('binary');

      res.on('data', function (chunk) {
        data += encoding.convert(chunk, 'utf-8', 'iso-8859-9');
      });

      res.on('end', function() {
        success(data);
      });
    }).on('error', function (err) {
      fail(err);
    });
  });
}

module.exports = download;
