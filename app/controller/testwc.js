var router = require('express').Router();
// 引用 wechat 库，详细请查看 https://github.com/node-webot/wechat
var wechat = require('wechat');
var weAuth = require('../helpers/weAuth');
var config = require('../../config/config');

router.route('/testwc')
      .get(function(req, res, next) {
        weAuth(req, res)
      })

module.exports = function(app) {
    app.use('/', router);
};