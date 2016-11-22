'use strict';
var AV = require('leanengine');

var express,
    config,
    glob,
    app;

express = require('express');
config = require('./config/config');
glob = require('glob');

const request_get = require('./app/helpers/request_get.js');

AV.init({
    appId: process.env.LEANCLOUD_APP_ID,
    appKey: process.env.LEANCLOUD_APP_KEY,
    masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

// 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || 3000);
app = express();

var server = require('http').createServer(app),
    WebSocketServer = require('websocket').server;

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
    maxReceivedFrameSize: 64 * 1024 * 1024, // 64MiB
    maxReceivedMessageSize: 64 * 1024 * 1024, // 64MiB
});

const sendLogin = function(url, connection) {
    request_get.requestGet(url)
        .then(result => {
            const result1 = JSON.parse(result);
            console.log(typeof result1);
            console.log('result1', result1)
            let data = result1.data ? result1.data : { isLogin: false };
            console.log('data', data)
            let isLogin = data.isLogin ? data.isLogin : false;
            if (isLogin) {
                // connection.send({islogin: islogin})
                connection.send(JSON.stringify({ uid: data.uid, isLogin: isLogin }));
            } else {
                sendLogin(url, connection);
            }
        })
}

wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);
    let timeVal;
    connection.send("connect success");
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            // connection.sendUTF(message.utf8Data);
            const uidUrl = config.pos.url + '/uid/' + Number(message.utf8Data);
            timeVal = setInterval(function() {
                request_get.requestGet(uidUrl)
                    .then(result => {
                        let result1 = {};
                        if (typeof result !== undefined) {
                            result1 = JSON.parse(result);
                        } else {
                            result1 = {};
                        }
                        console.log('result1', result1)
                        console.log(result1);
                        let data = result1.data ? result1.data : { isLogin: false };
                        console.log('data', data)
                        let isLogin = data.isLogin ? data.isLogin : false;
                        if (isLogin === true) {
                            connection.send(JSON.stringify({ uid: data.uid, isLogin: isLogin }));
                            clearInterval(timeVal);
                        } else {
                            connection.send(JSON.stringify({ uid: data.uid, isLogin: isLogin }));

                        }

                    })
                    // connection.send(JSON.stringify({uid:message.utf8Data, data:'111'}));
            }, 2000)
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        clearInterval(timeVal);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

// 应用程序加载

require('./config/express')(app, config);

server.listen(PORT, function() {
    console.log('Node app is running, port:', PORT);

    // 注册全局未捕获异常处理器
    process.on('uncaughtException', function(err) {
        console.error("Caught exception:", err.stack);
    });
    process.on('unhandledRejection', function(reason, p) {
        console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
    });
});

// 应用程序启动 mongoose
require('./app/helpers/mongoconn');
