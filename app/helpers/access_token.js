const request_http = require('request'),
    config = require('../../config/config'),
    request_get = require('../helpers/request_get'),
    request_post = require('../helpers/request_post'),
    accesstokenUrl = config.pos.url + '/accesstoken';

const testToken = () =>{
  return new Promise ((resolve, reject)=>{
    request_get.requestGet(accesstokenUrl)
               .then(result => {
                  resolve(result)
               })
  })
}

module.exports = exports
exports.testToken = testToken;