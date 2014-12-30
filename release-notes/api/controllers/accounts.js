'use strict';

var accounts = require('../../config/config').accounts;

module.exports = {
  getAccounts: getAccounts,
  getAccount: getAccount
}

console.log("Accounts: " + accounts);

function getAccounts(req, res) {
    res.send(JSON.stringify(accounts));
};

function getAccount(req, res) {
    res.send("GOT AN ACCOUNT");
};
