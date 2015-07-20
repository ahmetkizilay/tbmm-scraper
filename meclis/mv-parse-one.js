/*
  belirtilen doneme ait milletvekili profilindeki biyografi alanini kaydeder.

  kullanim
  node meclis/mv-parse-one.js --donem <24> --sicil <2891>

  ya da
  parseBio = require('./meclis/parse-one');
  parseBio(donem, sicil).done(function (res){});

 */
 'use strict';

var cliCall = require.main === module;
var cheerio = require('cheerio');
var Promise = require('promise');
var argv = require('minimist')(process.argv.slice(2));
var downloader = require('../helpers/download');
var bioParser = require('../helpers/bio-parser');
var urlTemplate = 'https://www.tbmm.gov.tr/develop/owa/milletvekillerimiz_sd.bilgi?p_donem={{donem}}&p_sicil={{sicil}}';

if (cliCall) {

  if (!argv.donem || !argv.sicil) {
    console.error('ERROR: pass --url <url>');
    return;
  }
  parseBio(argv.sicil, argv.donem).done(function (res) {
    console.log(res);
  });
}
else {
  module.exports = parseBio;
}

function parseBio(sicil, donem) {
  return new Promise(function (success) {
    var url = urlTemplate.replace('{{donem}}', donem)
      .replace('{{sicil}}', sicil);
    downloader(url).done(function (content) {
      var $ = cheerio.load(content);
      var bio = $('div#ozgecmis_icerik').first().text().trim();

      // console.log(bio);
      // console.log('married', bioParser.isMarried(bio));
      // console.log('birthday', bioParser.getBirthday(bio));
      // console.log('father', bioParser.getFatherName(bio));
      // console.log('mother', bioParser.getMotherName(bio));
      // console.log('kids', bioParser.getNumberOfKids(bio));
      success({
        bio: bio
      });
    });
  });
}
