'use strict';

var util = require('util');
var request = require('request');
var http = require('http');
var fs = require('fs');
var config = require('../../config/secrets').user;
var utils = require('./utils');

module.exports = {
  getNotes: getNotes
}

var owner = "";
var repo = "";
var rnotes = "";
var save = "false";
var DEFAULT_DEPTH = "10";



var options = {
   url: "",
   headers: {
     "User-Agent": config.agent
   },
   auth: {
     'user': config.username,
     'pass': config.password,
     'sendImmediately': true
   }
}

// Uses the git compare api to get data for a release.
function doCompare(i, jsonData,  res, error)  {

   var data = "";
   if (i < jsonData.length) {
        var version_1 = jsonData[i].name;
        if (jsonData[i+1]) {
            var version_2 = jsonData[i+1].name;
        // Gets release data between  two specified releases.
           options.url = "https://api.github.com/repos/" + owner + "/"  + repo + "/compare/"+version_2+"..."+version_1+ "?per_page=100";
           request(options, function(error, response, body) {
               if (!error && response.statusCode == 200) {
                  var jsonData2 = JSON.parse(body)
                  console.log("VERSION: " + version_1 + " - DATE: " + utils.formatDate(jsonData2.base_commit.commit.author.date));
                  console.log("COMMITS: " + jsonData2.commits.length);

                   // Start with the version/date heading
                   data = "\n## " + version_1 + " - " + utils.formatDate(jsonData2.base_commit.commit.author.date) + "\n\n";

                  // Build up bulleted list of commits
                  for (var y=0; y<jsonData2.commits.length; y++) {
                     data = data + "* " + jsonData2.commits[y].commit.message + "\n";
                  }
                     if (save == "true") { 
                         res.write("Writing " + version_1 + " to release notes...\n\n");
                         fs.appendFile('./relnotes/RELEASE_NOTES-'+repo+'.md', data, function(err) {
                            if (err) throw err;
                         });
                     } else {
                         res.write(data);
                     }
                     doCompare(i+1, jsonData, res, error); 
               } else {

                  console.log("ERROR: " + error);
                  console.log("STATUS: " + response.statusCode);
               }
            });
        } else {
           console.log("NOTHING LEFT TO COMPARE");
           res.end();
        }
    }
}
        

// Main function (currently called from apigee-127)
function getNotes(req, res) {

  var depth = DEFAULT_DEPTH + 1; 
  save = "false";
  owner = req.swagger.params.owner.value;
  repo = req.swagger.params.repo.value;
  if (req.swagger.params.depth.value) {
      depth = parseInt(req.swagger.params.depth.value) + 1;
  }
  save = req.swagger.params.save.value
  console.log("Generating release notes for: " + owner + "/" + repo);
  
  // Gets all the tags associated with the repo.
  options.url = "https://api.github.com/repos/" + owner + "/"  + repo + "/tags?per_page=" + depth;
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonData = JSON.parse(body)
      console.log("jsonData: " + jsonData.length);
      if (save == "true") {
          fs.unlink('./relnotes/RELEASE_NOTES-'+repo+'.md', function (err) {
              if (err) {
                  console.log("file wasn't there");
              } else {
              console.log('successfully deleted ' + './relnotes/RELEASE_NOTES-'+repo+'.md');
              }
          });
          utils.writeTitle(owner, repo);
      }
      if (jsonData.length >0) {
          res.write("# " + owner + "/" + repo + "\n\n");
          doCompare(0, jsonData, res, error);
      } else {
          console.log("NO RELEASE TAGS DETECTED FOR: " + repo);  
          res.send("\nNO RELEASE TAGS DETECTED FOR REPOSITORY: " + repo + "\n\n");
          res.end();
      }

    }
    else {
       console.log("ERROR: " + error);
       console.log("STATUS: " + response.statusCode);
       res.end();
    }
  });
};
