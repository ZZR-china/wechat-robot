"use strict";

process.title = 'node-chat';

var wsPort = 81;
var webSocketServer = require('websocket').server;
var http = require('http');
var history = []; // entire message history
var clients = []; // list of currently connected clients (users)

// Helper function for escaping input strings
function htmlEntities(str) {
    return String(str).replace(/&/g, '&').replace(/</g, '<')
        .replace(/>/g, '>').replace(/"/g, '"');
}

// HTTP server
var server = http.createServer(function(request, response) {});
server.listen(wsPort, function() { console.log((new Date()) + " Server is listening on port " + wsPort); });
// WebSocket server
var wsServer = new webSocketServer({ httpServer: server });

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin: ' + request.origin + '.'); // accept connection - you should check 'request.origin'
    var connection = request.accept(null, request.origin);
    var index = clients.push(connection) - 1;
    var userName = "soon!";

    if (history.length > 0) {
        connection.sendUTF(JSON.stringify({ type: 'history', data: history })); // send back chat history
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
