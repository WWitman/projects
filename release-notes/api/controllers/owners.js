'use strict';

var owners = require('../../config/repo').owners;

module.exports = {
  getOwners: getOwners
}

function getOwners(req, res) {
    res.send(JSON.stringify(owners));
    res.end();
};

