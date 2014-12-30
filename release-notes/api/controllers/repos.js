'use strict';

var util = require('util');
var request = require('request');
var http = require('http');
var fs = require('fs');
var config = require('../../config/secrets').user;

module.exports = {
  getRepos: getRepos,
  getRepo: getRepo
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

// Gets a list of the repos associated with an account.
function getRepos(req, res) {

  var account = req.swagger.params.account.value;
  options.url = "https://api.github.com/users/" + account + "/repos";

  request(options, function (error, response, body) {
  var data = [];

    if (error) {
        res.send(error);
    } else {
        var jsonData = JSON.parse(body)
        for (var i=0; i<jsonData.length; i++) {
          data[i] = JSON.parse(body)[i].name;
        }
        res.send(data);
    }
  });
}

function getRepo(req, res) {
  var account = req.swagger.params.account.value;
  var repo = req.swagger.params.repo.value;

  options.url = "https://api.github.com/repos/" + account + "/" + repo;

  request(options, function (error, response, body) {

    if (error) {
        res.send(error);
    } else {
        res.send(JSON.parse(body));
    }
  });
}
