/*
  milletvekili biyografilerinden cesitli bilgileri regex ile cekmek icin
  kullanilir.
  
 */
'use strict';

module.exports = {
  isMarried: parseMarried,
  getBirthday: parseBirthday,
  getFatherName: parseFatherName,
  getMotherName: parseMotherName,
  getNumberOfKids: parseKids
};

function parseMarried (bio) {
  return /evli/.test(bio);
}

function parseBirthday (bio) {
  var re = /([0-9]{1,2})\s*(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s*(19[0-9]{2})/;
  var output = re.exec(bio);
  if (output && output.length > 0) {
    return output[0];
  }
  else {
    return '';
  }
}

function parseFatherName (bio) {
  // check for patterns like baba adi ahmet ve anne adi...
  var re = /baba[^\s]*\sad[^\s]*\s([^,|^\\']*)(\sve)+/gi;
  var output = re.exec(bio);
  if (!output) {
    re = /baba[^\s]*\sad[^\s]*\s([^,|^\\']*)/gi;
    output = re.exec(bio);
  }
  if (!output) {
    re = /babas[^\s]\s([^,|^\\']*)/gi;
    output = re.exec(bio);
  }

  if (output && output.length > 1) {
    return output[1];
  }
  else {
    return '';
  }
}

function parseMotherName (bio) {
  var re = /anne[^\s]*\sad[^\s]*\s([^,|^\\']*)/gi;
  var output = re.exec(bio);
  if (output && output.length > 1) {
    return output[1];
  }
  else {
    re = /annesi(nin)?\s([^,|^\\']*)/gi;
    output = re.exec(bio);

    if (output) {
      return output[2];
    }
  }
  return '';
}

function parseKids (bio) {
  var re = /(\d{1,2})\sçocuk/gi;
  var output = re.exec(bio);
  if (output && output.length > 1) {
    return parseInt(output[1]);
  }
  else {
    return 0;
  }
}
