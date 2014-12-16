
'use strict';

var fs = require('fs');
var config = require('../../config/secrets').user;
//var repo = require('../../config/repo').repository.name;

module.exports = {
  formatDate: formatDate,
  writeTitle: writeTitle
}


function formatDate(datestr, err) {
   if(!err) {
       var date = new Date(datestr);
       return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
   } else {
       console.log(err);
       throw err;
   }
}

function writeTitle(owner, repo) {
    var heading = "# " + owner + "/" + repo + "\n\n";
    fs.appendFile('./relnotes/RELEASE_NOTES-'+repo+'.md', heading, function(err) {
       if (err) throw err;
    });
}

