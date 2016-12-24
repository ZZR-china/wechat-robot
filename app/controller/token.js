'use strict';
var router = require('express').Router(),
    Promise = require("bluebird"),
    readFileAsync = Promise.promisify(require("fs").readFile),
    writeFileAsync = Promise.promisify(require("fs").writeFile),
    request_get = Promise.promisify(require('request').get);

let wxtoken = {};
wxtoken.access_token = "gBG4z2UozAagOoQwU0TwAOEqGzQXhds1fHzQmuZkSP2UIUDDMXxbdAqgdErRXDjQ2EisBpI-vF4IWaOnPiS1l8fGBhS9SnMtWGLMO-QCoWoHCGgABAMHL";
wxtoken.expires_in = 7200;
wxtoken.iao = 1480935750000;
wxtoken.data = "gBG4z2UozAagOoQwU0TwAOEqGzQXhds1fHzQmuZkSP2UIUDDMXxbdAqgdErRXDjQ2EisBpI-vF4IWaOnPiS1l8fGBhS9SnMtWGLMO-QCoWoHCGgABAMHL";

router.route('/accesstoken')
    .get((req, res) => {
        const token = wxtoken;
        const token_url = global.token_url;
        const iao = token.iao;
        const now_time = (new Date()).getTime();
        if (now_time >= iao) {
            return request_get(token_url)
                .then(result => {
                    if (result && Array.isArray(result)) {
                        let body = result[0].body;
                        body = JSON.parse(body);
                        let token_iao = new Date();
                        body.iao = token_iao.setSeconds(token_iao.getSeconds() + body.expires_in, 0);
                        body.data = body.access_token;
                        wxtoken = body;
                        res.send(wxtoken);
                    } else {
                        res.send(wxtoken);
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            return res.send(wxtoken);
        }
    })

module.exports = function(app) {
    app.use('/', router)
};
