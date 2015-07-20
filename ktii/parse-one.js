/*
  bir millet vekili icin ilk imzaladigi kanun tekliflerinin kismi
  bilgilerini indirir. tek basina ya da baska bir dosyadan cagirilarak
  kullanilabilir. parse-all.js bu dosyaya referans verir.

  detayli bilgiler kt-detay dizini icinde indirilir.

  kullanim
  node ktii/parse-one.js --url <indirilecek url ya da path>

  ya da
  var parseIlkImzaTable = require('./ktii/parse-one');
  parseIlkImzaTable(url).done(function (res)){}

 */
'use strict';

// flag to check if this file called directly from cli or
// required() by another file
var cliCall = require.main === module;

var fs = require('fs');
var cheerio = require('cheerio');
var Promise = require('promise');
var argv = require('minimist')(process.argv.slice(2));
var downloader = require('../helpers/download');

if (cliCall) {
  var argUrl = argv.url;
  if (!argUrl) {
    console.error('ERROR: pass --url <url>');
    return;
  }

  parseIlkImzaTable(argUrl).done(function (res) {
    console.log(res);
  });
}
else {
  module.exports = parseIlkImzaTable;
}

function onDataReceived (content, success) {
  var $ = cheerio.load(content);
  var items = $('body > div.container_16 > div.grid_12 > center > table tr');
  var results = {};
  items.each(function (i, tr) {
    if (i !== 0) {
      var cells = $('td', tr);
      var anchor = $('a', cells[0]);
      var urlKanun = anchor.attr('href');
      var kanunId = urlKanun.substring(urlKanun.indexOf('kanunlar_sira_no=') + 17);
      var tarih = $(cells[1]).text();
      var baslik_ozet = $(cells[2]).text();

      results[kanunId] = {
        id: kanunId,
        taksim_esas_no: anchor.text(),
        tarih: tarih,
        baslik_ozet: baslik_ozet
      };
    }
  });

  success(results);
}

function parseIlkImzaTable(url) {
  return new Promise(function (success, fail) {
    if (url.match(/^https?/)) {
      downloader(url).done(function (content) {
        onDataReceived(content, success);
      });
    }
    else { // just assuming that this is a file
      fs.readFile(url, 'utf8', function (err, content) {
        if (err) {
          fail();
          return;
        }
        else {
          onDataReceived(content, success);
        }
      });
    }
  });
}
