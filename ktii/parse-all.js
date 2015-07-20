/*
  tum millet vekilleri icin ilk imzaladigi kanun tekliflerinin kismi
  bilgilerini indirir ve iidest parametresi ile belirtilen yere json formatinda
  saklar.

  girdi dosyasi olarak meclis/donem-parse.js sonucu hazirlanan json
  dosyasini kullanir. Islem tamamlandiginda json dosyasina ek olarak millet
  vekillerinin ilk imzasini tasidigi kanun teklifi listesini array olarak ekler.

  detayli bilgiler kt-detay dizini icinde indirilir.

  kullanim
  node ktii/parse-all.js --url <indirilecek url ya da path>
 */
'use strict';

var fs = require('fs');
var Promise = require('promise');
var parseIlkImza = require('./parse-one');
var argv = require('minimist')(process.argv.slice(2));
var downloadURLTemplate = 'https://www.tbmm.gov.tr/develop/owa/kanun_teklifi_s_sd.uye_ilk_imza_sahibi_teklifleri?p_donem={{donem}}&p_sicil={{sicil}}';
var mvJSON = JSON.parse(fs.readFileSync(argv.file, 'utf8'));
var iiJSON = {};

var sequence = Promise.resolve();

mvJSON.mvs.forEach(function (mv) {

  sequence = sequence.then(function() {
    return new Promise(function (success) {
      var downloadUrl = downloadURLTemplate.replace('{{donem}}', argv.donem)
        .replace('{{sicil}}', mv.id);

      parseIlkImza(downloadUrl).done(function (iis) {
        var ilkImzaArray = Object.keys(iis);
        ilkImzaArray.forEach(function (ii) {
          iiJSON[ii] = iis[ii];
        });
        mv.ilk_imza = ilkImzaArray;
        success();
      });
    });
  });
});

sequence.then(function() {
  fs.writeFileSync(argv.destII, JSON.stringify(iiJSON), 'utf8');
  fs.writeFileSync(argv.destMV, JSON.stringify(mvJSON), 'utf8');
});
