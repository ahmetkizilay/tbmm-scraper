/*
  tbmm sitesinde doneme ait milletvekili listesini kaydeder. doneme ait
  milletvekili, sehir ve parti bilgilerini iceren json dosyasini hazirlar.

  sonuc json formati
  {
      cities: {},
      mvs: [],
      parties: []
  }

  milletvekili biyografisi daha sonra meclis/mv-parse-one.js ya da
  meclis/mv-parse-all.js ile doldurulur.

  kullanim
  node meclis/donem-parser.js --donem <24> --dest <json>
 */
'use strict';

var fs = require('fs');
var downloader = require('../helpers/download');
var cheerio = require('cheerio');

var urlTemplate = 'https://www.tbmm.gov.tr/develop/owa/milletvekillerimiz_sd.mv_liste_eskiler?p_donem_kodu={{donem}}';
var argv = require('minimist')(process.argv.slice(2));

if (!argv.donem) {
  console.error('usage: --donem <donem> --dest <path>');
  return;
}

var url = urlTemplate.replace('{{donem}}', argv.donem);
downloader(url).done(function (content) {
  var $ = cheerio.load(content);

  var latestCity;
  var mvJSON = {
    cities: [],
    mvs: [],
    parties: {}
  };
  $('table tr').each(function (i, row) {
      var $row = $(row);
      var bgColor = $row.attr('bgcolor');

      if (bgColor === '#FFFFFF') {
        var aMV = $row.find('td a');
        var urlMV = aMV.attr('href');
        var id = urlMV.substr(urlMV.indexOf('p_sicil') + 8);
        var party = $row.find('td:last-child').text();

        mvJSON.mvs.push({
          name: aMV.text(),
          city: latestCity,
          party: party,
          id: id,
          reference: urlMV,
          image: 'https://www.tbmm.gov.tr/mv_resim/' + id + '.jpg'
        });

        mvJSON.parties[party] = party;
      }
      else if (bgColor === '#cccccc') {
        latestCity = $row.find('td b span').text();
        mvJSON.cities.push(latestCity);
      }
      else {
        console.log('dont know', bgColor);
      }
  });

  mvJSON.parties = Object.keys(mvJSON.parties);

  if (argv.dest) {
    fs.writeFileSync(argv.dest, JSON.stringify(mvJSON), 'utf8');
  }
  else {
    console.log(JSON.stringify(mvJSON));
  }
});
