/*
 * Author: Magic · Zhang <Magic@foowala.com>
 * Module description: token persistence 令牌持久化
 */

var token_mongo = require('../models/token'),
    config = require('../../config/config'),
    request_https = require('request');

function getToken(url) {
    return new Promise((resolve, reject) => {
        request_https(url, (error, response, body) => {
            console.log(typeof body)
            console.log(body)
            resolve(body);
        })
    })
}

function saveTokenIndb(url) {
    getToken(url)
        .then(token => {
            var tokenJson = JSON.parse(token);
            switch (tokenJson.errcode) {
                case 45009:
                    console.log(data);
                    break;
                case null:
                    var token_data = {
                        access_token: token.access_token,
                        expires_in: token.expires_in
                    }
                    token_mongo.findOneAndUpdate({ "expires_in": 7200 }, token_data, (err, data) => {
                        // console.log(data);
                    });
                    break;
                default:
                    console.log('something happen', errcode);
                    break;
            }
        })
        .catch(err => {
            console.error(err);
        })
}

exports.saveToken = function(url) {
    setInterval(function() {
        saveTokenIndb(url);
    }, 900000)
}
