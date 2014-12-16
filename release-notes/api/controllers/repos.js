'use strict';

var util = require('util');
var request = require('request');
var http = require('http');
var fs = require('fs');
var config = require('../../config/secrets').user;

module.exports = {
  getRepos: getRepos
}



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


// Gets a list of the repos associated with the owner. (not used currently)
function getRepos(req, res) {

  var outerData = "";
  var owner = req.swagger.params.owner.value;

  // Gets all the repos associated with an owner.
  options.url = "https://api.github.com/users/" + owner + "/repos?per_page=100";

  request(options, function (error, response, body) {
    var data = {};
    if (!error && response.statusCode == 200) {
      var jsonData = JSON.parse(body)
      for (var i=0; i<jsonData.length-1; i++) {
          data[i] = jsonData[i].full_name;
      }
      res.send(data);
      res.end();
      outerData = data;
      }
    else {
       console.log("ERROR: " + error);
       console.log("STATUS: " + response.statusCode);
       res.end();
    }
  });
  return outerData;
};

