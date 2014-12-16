'use strict';

var util = require('util');
var request = require('request');
var http = require('http');

module.exports = {
  getNotes: getNotes
}


var repoList = ["a127","swagger-tools"];

for (var x=0; x<2; x++) {
    console.log("REPOLIST: " + repoList[x]);
}

var repo = "a127";
var owner = "apigee-127";
console.log("REPO: " + owner + "/" + repo);

function doCompare(i, jsonData, error) {
   if (i < jsonData.length-1) {

       var version_1 = jsonData[i].name;
       var version_2 = jsonData[i+1].name;

       var options2 = {
           url: "https://api.github.com/repos/" + owner + "/"  + repo + "/compare/"+version_2+"..."+version_1+ "?per_page=100",
           headers: {
             "User-Agent": "Wwitman"
           },
           auth: {
             'user': 'wwitman',
             'pass': 'Lenovo123',
             'sendImmediately': true
           }
        }
        request(options2, function(error, response, body) {
           if (!error && response.statusCode == 200) {
              var jsonData2 = JSON.parse(body)
              console.log("COMPARE URL: " + options2.url);
              console.log("VERSION: " + version_1 + " - DATE: " + jsonData2.base_commit.commit.author.date);
              console.log("COMMITS: " + jsonData2.commits.length);
              for (var y=0; y<jsonData2.commits.length; y++) {
                 console.log("MESSAGE: " + jsonData2.commits[y].commit.message);
              }

              console.log("\n");
              doCompare(i+1, jsonData, error);
           }
           else {

              console.log("ERROR: " + error);
              console.log("STATUS: " + response.statusCode);
              res.end();
           }
        });
}
        

function getTags(i, req, res, error) {

console.log("GETTING TAGS FOR: " + i);

   var options = {
     url: "https://api.github.com/repos/" + owner + "/"  + i + "/tags?per_page=100",
     headers: {
          "User-Agent": "Wwitman"
     },
     auth: {
        'user': 'wwitman',
        'pass': 'Lenovo123',
        'sendImmediately': true
     }
   }


     request(options, function (error, response, body) {
       if (!error && response.statusCode == 200) {
         var jsonData = JSON.parse(body)
         console.log("jsonData: " + jsonData.length);
         doCompare(0, jsonData, error)
         res.end();
        }
        else {
          console.log("ERROR: " + error);
          console.log("STATUS: " + response.statusCode);
          res.end();
        } 
        getTags(i+1);
    }
     
}

function getNotes(req, res) {
    getTags(0, req, res);
}
// for each repo in repoList
// get the tags for that repo
// do the compare on tags
// get the commits
// go to the next repo

