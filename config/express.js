'use strict';
var express = require('express'),
    timeout = require('connect-timeout'),
    compression = require('compression'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    AV = require('leanengine'),
    ejs = require('ejs'),
    async = require('async'),
    glob = require('glob'),
    http = require('http'),
    wechat_token = require('../app/helpers/TokenPojo.js');

var models,
    controllers;

module.exports = function(app, config) {
    app.engine('html', ejs.__express);
    app.set('views', config.root + '/app/view');
    app.set('view engine', 'html');

    app.use(express.static(config.root + '/app/view/static'));
    app.use(timeout('15s'));
    app.use(AV.express());
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    //define res success
    app.use(function(req, res, next){
        let result = {};
        res.success = function(data, code) {
            result.status = 1;
            result.code = code ? code : 200;
            result.data = data ? data : null;
            res.send(result);
        };
        res.fail = function(code, data){
            result.status = 0;
            result.code = code ? code : 500;
            result.data = data ? data : null;
            res.send(result);
        }
        next();
    })
    // Mongodb 预加载
    models = glob.sync(config.root + './app/models/*.js');
    async.each(models, function(model, callback) {
            console.log('Loading Mongodb model：' + model);
            require(model);
            callback();
        }, function(err) {
            if (err) {
                console.log('A model failed to process.');
            }
        })
    //mongo connect
    // var db = require('../app/helpers/mongoconn')
    app.use(function(req, res, next) {
        res.set({
            'Access-Control-Allow-Origin': '*',
        });
        next();
    });
    // load controller
    controllers = glob.sync(config.root + '/app/controller/*.js');
    async.each(controllers, function(controller, callback) {
        console.log('Loading Router：', controller);
        require(controller)(app);
        callback();
    }, function(err) {
        if (err) {
            console.log('A file failed to process.');
        }
    })

    var appId,
        appSecret;
    if (process.env.online === 1) {
        appId = process.env.testwechat_appId;
        appSecret = process.env.testwechat_appSecret;
    } else {
        var secret = require('./secret');
        appId = secret.testwechat.appId;
        appSecret = secret.testwechat.appSecret;
    }
    var token_url = config.wechat_api.token_url + '&appId=' + appId + '&secret=' + appSecret;
    global.token_url = token_url;

    app.use(function(req, res, next) {
        // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
        if (!res.headersSent) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    });

    // error handlers
    app.use(function(err, req, res, next) { // jshint ignore:line
        if (req.timedout && req.headers.upgrade === 'websocket') {
            // 忽略 websocket 的超时
            return;
        }
        var statusCode = err.status || 500;
        if (statusCode === 500) {
            console.error(err.stack || err);
        }
        if (req.timedout) {
            console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
        }
        res.status(statusCode);
        // 默认不输出异常详情
        var error = {}
        if (app.get('env') === 'development') {
            // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
            error = err;
        }
        res.render('error', {
            message: err.message,
            error: error
        });
    });
};
