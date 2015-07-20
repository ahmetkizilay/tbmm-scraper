/*
  kanun tasarisi detaylarini tbmm sitesinden sayfasindan parse eder.
  ornek adres: https://www.tbmm.gov.tr/develop/owa/tasari_teklif_sd.onerge_bilgileri?kanunlar_sira_no=92194

  Sirasiyla Kanun Teklifi Bilgileri, Kanun Teklifi Komisyon Bilgileri ve
  Kanun Teklifi Imza Sahipleri bilgileri kaydedilir.

  kullanim
  node kt-detay/parse-one.js --url <url ya da lokal dosya>

  ya da
  parseKanunTasariPage = require('./kt-detay/parse-one');
  parseKanunTasariPage(url).done(function (res){});

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

  parseKanunTasariPage(argUrl).done(function (res) {
    console.log(res);
  });
}
else {
  module.exports = parseKanunTasariPage;
}

function parseGenelBilgiler($, table, res) {
  var rows = $('tr', table);
  rows.each(function (i, tr) {
    switch (i) {
      case 1:
        res.tam_metin_adres = $('td a', tr).attr('href');
        break;
      case 3:
        res.donem_yasama_yili = $('td', tr).last().text();
        break;
      case 5:
        res.esas_no = $('td', tr).last().text();
        break;
      case 7:
        res.baskanliga_gelis_tarihi = $('td', tr).last().text();
        break;
      case 9:
        res.baslik = $('td', tr).last().text();
        break;
      case 11:
        res.ozet = $('td', tr).last().text();
        break;
      case 13:
        res.son_durum = $('td', tr).last().text();
        break;
    }
  });

  return res;
}

function parseImzaSahipleri ($, table, res) {
  res.ilkImza = [];
  res.digerImza = [];

  var rows = $('tr', table);
  rows.each(function(i, tr) {
    if (i !== 0) {
      var cells = $('td', tr);
      var imzaciLink = $('a', cells[0]).attr('href');
      var imzaciAd = $('a', cells[0]).text().trim();
      var imzaciSicil = imzaciLink.substring(imzaciLink.indexOf('p_sicil=') + 8);
      var ilkImza = $(cells[4]).text().indexOf('Sahibi') > -1;
      if (ilkImza) {
        res.ilkImza.push({
          sicil: imzaciSicil,
          ad: imzaciAd
        });
      }
      else {
        res.digerImza.push({
          sicil: imzaciSicil,
          ad: imzaciAd
        });
      }
    }
  });
}
function onDataReceived (content, success) {
  var $ = cheerio.load(content);
  var result = {};

  var konuBasliklari = $('.AltKonuBaslikB16Gri');
  konuBasliklari.each(function (i, span) {
    var header = $(span).text().trim();
    var table = $(span).next();
    switch (header) {
      case 'Kanun Teklifi İmza Sahipleri':
        parseImzaSahipleri($, table, result);
        break;
      case 'Kanun Teklifi Bilgileri':
        parseGenelBilgiler($, table, result);
        break;
      case 'Kanun Teklifi Komisyon Bilgileri':
        parseKomisyonBilgileri($, $(span).next().parent(), result);
        break;
    }
  });

  success(result);
}

function parseKomisyonBilgileri($, table, result) {
  result.komisyonlar = [];

  var rows = $('tr', table);
  rows.each(function (i, tr) {
    if (i !== 0) {
      var cells = $('td', tr);
      result.komisyonlar.push({
        tipi: $(cells[0]).text().trim(),
        adi: $(cells[1]).text().trim(),
        giris_tarihi: $(cells[2]).text().trim(),
        cikis_tarihi: $(cells[3]).text().trim(),
        islem: $(cells[4]).text().trim(),
        karar_tarihi: $(cells[5]).text().trim()
      });
    }
  });
}

function parseKanunTasariPage(url) {
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
