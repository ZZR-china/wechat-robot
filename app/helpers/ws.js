wsServer.on('request', function(request) {
      var connection = request.accept('echo-protocol', request.origin);
      // console.log((new Date()) + ' Connection accepted.');
      //       function sendNumber() {
      //               var number = Math.round(Math.random() * 0xFFFFFF);
      //               connection.send(number.toString());
      //               setTimeout(sendNumber, 1000);
      //       }
      //       sendNumber();

        connection.send('asdsa');

      connection.on('message', function(message) {
          if (message.type === 'utf8') {
              console.log('Received Message: ' + message.utf8Data);
              connection.sendUTF(message.utf8Data);
          }
          else if (message.type === 'binary') {
              console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
              connection.sendBytes(message.binaryData);
          }
      });
      connection.on('close', function(reasonCode, description) {
          console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
      });
  });