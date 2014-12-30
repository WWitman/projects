'use strict';

var request = require('request');
var http = require('http');
var _ = require('lodash');
var config = require('../../config/secrets').user;
var utils = require('./utils');

module.exports = {
  getTags: getTags,
  getTag: getTag,
  getCommits: getCommits
}

var base_url = "https://api.github.com/";

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


function getTags(req, res) {

  var account = req.swagger.params.account.value;
  var repo = req.swagger.params.repo.value;
  options.url = base_url + "repos/" + account + "/"  + repo + "/git/refs/tags";

  request(options, function (error, response, body) {
    if (error) {
       res.send(error);
    } else {
       var jsonData = JSON.parse(body)
       if (jsonData.length >0) {
          res.send(jsonData);
       } else {
          res.send("\nNO RELEASE TAGS FOUND IN THIS REPOSITORY: " + repo + "\n\n");
       }
    }
  });
};

function getTag(req, res) {

  var account = req.swagger.params.account.value;
  var repo = req.swagger.params.repo.value;
  var tag = req.swagger.params.tag.value;
  options.url = base_url + "repos/" + account + "/"  + repo + "/git/tags/" + tag;

  request(options, function (error, response, body) {
    if (error) {
       res.send(error);
    } else {
       var jsonData = JSON.parse(body)
       if (jsonData) {
          res.send(jsonData);
       } else {
          res.send("\nNO RELEASE TAG FOUND FOR: " + tag + "\n\n");
       }
    }
  });
};


// Gets commits between two tags.
function compareTags(i, jsonData,  tagIndex, account, repo, res)  {

   var depth=1;
   var data = "";

   if (i < depth) {
        var version_1 = utils.getVersionFromTag(jsonData, tagIndex);
        if (jsonData[tagIndex+1]) {
            var version_2 = utils.getVersionFromTag(jsonData, tagIndex+1);
           //Get release data between  two specified releases.
           options.url = base_url + "repos/" + account + "/"  + repo + "/compare/"+version_2+"..."+version_1+ "?per_page=100";

           request(options, function(error, response, body) {
               if (error) {
                   res.send(error);
               } else {
                  var jsonData2 = JSON.parse(body);
                  // Build up bulleted list of commits
//TODO: return string and move this formatting to the app
                  for (var y=0; y<jsonData2.commits.length; y++) {
                     data = data + "* " + utils.parseComments(jsonData2.commits[y].commit.message) + "\n";
                  }
                  res.write(data);
                  compareTags(i+1, jsonData, tagIndex+1, account, repo, res);
               }
            });
        } else {
           console.log("NOTHING LEFT TO COMPARE");
           res.end();
        }
    } else {
        console.log("FINISHED COMPARE");
        res.end();
    }
}
        

function getCommits(req, res) {

  var account = req.swagger.params.account.value;
  var repo = req.swagger.params.repo.value;
  var tag = req.swagger.params.tag.value;

  options.url = base_url + "repos/" + account + "/"  + repo + "/git/refs/tags/";

  request(options, function (error, response, body) {
    if (error) {
       res.send(error);
    } else {
       var jsonData = JSON.parse(body)
       jsonData.reverse();

       //find the index in the tags array of the version 
       var searchValue = {"ref": "refs/tags/" + tag};
       var tagIndex = _.findIndex(jsonData, searchValue); 

       // if we have release tags
       if (jsonData.length >0) {
          compareTags(0, jsonData, tagIndex, account, repo, res);
       } else {
          res.send("\nNO RELEASE TAGS DETECTED FOR REPOSITORY: " + repo + "\n\n");
       }
    }
  });
}

