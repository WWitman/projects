'use strict';

var util = require('util');
var request = require('request');

module.exports = {
  getForecast: getForecast 
}

function getForecast(req, res) {
  var w = req.swagger.params.w.value;
  var url = "https://weather.yahooapis.com/forecastrss?w="+w;
  console.log("Making request to: " + url);
  var result = request.get(url);
  request.get(url).pipe(res);
}

