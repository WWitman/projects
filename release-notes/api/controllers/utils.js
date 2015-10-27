
'use strict';

var fs = require('fs');
var config = require('../../config/secrets').user;

module.exports = {
  formatDate: formatDate,
  writeTitle: writeTitle,
  clean: clean,
  parseComments: parseComments,
  getVersionFromTag: getVersionFromTag
}


function formatDate(datestr) {
    var date = new Date(datestr);
    var month = date.getMonth() + 1;
    return month + "-" + date.getDate() + "-" + date.getFullYear();
}

function writeTitle(owner, repo, callback) {
    var heading = "# " + owner + "/" + repo + "\n\n";
    var file = './relnotes/RELEASE_NOTES-'+repo+'.md';
    fs.appendFile(file, heading, function(err) {
       if (err) {
           callback(err)
       } else {
           callback(null, "Title was written to file: " + file + "\n");
       }
    });

}

function clean(file, callback) {
   fs.unlink(file, function (err) {
      if (err) {
           callback("Nothing to clean up: Release note file: " + file + " does not exist.\n");
      } else {
           callback(null, 'Successfully deleted release note file: ' + file + "\n");
      }
  });
}

function parseComments(data) {
   data = data.replace(/\*/g, "");
   data = data.trim();
   var pattern = /\n\n/g;
   var res = data.replace(pattern, "\n    >");
   return res;
}

function getVersionFromTag(data, index) {
console.log("REF: " + typeof data[index] != 'undefined');
     if (typeof data[index] != 'undefined') {
         var version = data[index].ref;
         var s = version.split("/");
         version = s[s.length-1];
         return version;
     } else {
         return "No Release";
     }
}
