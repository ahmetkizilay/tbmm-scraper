/*
  url'deki icerigi belirtilen adrese kaydeder.

  kullanim
  node helpers/save-url --url <url> --dest <dest>

  ya da
  var saveUrl = require('./save-url');
  saveUrl(url, dest);
 */
'use strict';
var cliCall = require.main === module;
var downloader = require('./download');
var fs = require('fs');

if (cliCall) {
  var argv = require('minimist')(process.argv.slice(2));
  if (!argv.hasOwnProperty('url') || !argv.hasOwnProperty('dest')) {
    console.error('ERROR: pass file parameter with --url <url> --dest <dest path>');
    return;
  }

  saveUrl(argv.url, argv.dest);
}
else {
  module.exports = saveUrl;
}

function saveUrl(url, dest) {
  downloader(url).done(function (content) {
    fs.writeFileSync(dest, content, 'utf8');
  });
}
