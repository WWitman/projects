'use strict';

var request = require('request');
var http = require('http');
var _ = require('lodash');
var config = require('../../config/secrets').user;
var utils = require('./utils');
var a127_deps = require('../../config/dependencies').a127_deps;

module.exports = {
  getDependencies: getDependencies
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



function getDependencies(req, res) {

  var account = req.swagger.params.account.value;
  var repo = req.swagger.params.repo.value;
  var tag = req.swagger.params.tag.value;

  if (typeof tag !== "undefined") {
      options.url = "https://api.github.com/repos/" + account + "/" + repo + "/contents/package.json?ref="+ tag;
   }  else {
      options.url = "https://api.github.com/repos/" + account + "/" + repo + "/contents/package.json";
   }

  options.headers = {
     "User-Agent": config.agent,
     "Accept" : "application/vnd.github.v3.raw"
  };

  request(options, function (error, response, body) {

    var deps = "";
    if (error) {
       res.send(error);
    } else {
      var result = JSON.parse(body);
      result = result.dependencies;
      res.send(result);
     
    }
  });
}
