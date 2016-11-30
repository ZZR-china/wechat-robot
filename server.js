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
var server = require('http').createServer(app);

// global.ws = WebSocketServer;
var history = []; // entire message history
var clients = []; // list of currently connected clients (users)
// Helper function for escaping input strings
function htmlEntities(str) {
    return String(str).replace(/&/g, '&').replace(/</g, '<')
        .replace(/>/g, '>').replace(/"/g, '"');
}

var WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
    maxReceivedFrameSize: 64 * 1024 * 1024, // 64MiB
    maxReceivedMessageSize: 64 * 1024 * 1024, // 64MiB
});

var connection;

wsServer.on('request', function(request) {
    connection = request.accept('echo-protocol', request.origin);
    global.connection = connection;
    // accept connection - you should check 'request.origin'
    console.log((new Date()) + ' Connection from origin: ' + request.origin + '.');
    connection.send('success')
    var index = clients.push(connection) - 1;
    console.log('clients', clients);
    var userName = "soon!";
    if (history.length > 0) {
        // send back chat history
        connection.sendUTF(JSON.stringify({ type: 'history', data: history }));
    }
    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text ------ htmlEntities(message.utf8Data);
            console.log((new Date()) + ' Received Message from ' + userName + ': ' + message.utf8Data);
            // we want to keep history of all sent messages
            var obj = {
                time: (new Date()).getTime(),
                text: htmlEntities(message.utf8Data),
                author: userName
            };
            history.push(obj);
            // broadcast message to all connected clients
            var json = JSON.stringify({ type: 'message', data: obj });
            for (var i = 0; i < clients.length; i++) {
                clients[i].sendUTF(json);
            }
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
        clients.splice(index, 1); // remove user from the list of connected clients
    });
});

// 应用程序加载

require('./config/express')(app, config, wsServer);

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
