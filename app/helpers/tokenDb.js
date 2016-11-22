/*
 * Author: Billy · Chan <billy@foowala.com>
 * Module description: 令牌模块（data）
 */

var token_mongo = require('../models/token');

function getToken (callback) {
  token_mongo.findOne({ expires_in: 7200}, function(err, token) {
    if (err) {
      err.err = 1;
      err.errmsg = "ERROR unable to retrieve WeChat Token from DB. Please alert administrators: " + err.message;
      console.error('ERROR: tokenDb.getToken function experienced an error:');
      console.error(err);
      return callback(err, null);
    }
    if (!token) {
      var err = new Error('ERROR retrieving WeChat Token');
      err.err = 1;
      err.errmsg = 'ERROR unable to retrieve WeChat Token from DB. Please alert administrators';
      console.error('ERROR: tokenDb.getToken function experienced an error:');
      console.error(err);
      return callback(err, null);
    } else {
      return callback(null, token.access_token);
    }
  });
}

function getTicket (callback) {
  token_mongo.findOne({ _id: 2}, function(err, token) {
    if (err) {
      err.err = 1;
      err.errmsg = "ERROR unable to retrieve jsapi ticket from DB. Please alert administrators: " + err.message;
      console.error('ERROR: tokenDb.getTicket function experienced an error:');
      console.error(err);
      return callback(err, null);
    }
    if (token){
      var err = new Error('ERROR retrieving jsapi ticket');
      err.err = 1;
      err.errmsg = "ERROR unable to retrieve jsapi ticket from DB. Please alert administrators: " + err.message;
      console.error('ERROR: tokenDb.getTicket function experienced an error:');
      console.error(err);
      return callback(err, null);
    } else {
      return callback(null, token.ticket);
    }
  });
}

module.exports.getTicket = getTicket;
module.exports.getToken  = getToken;
