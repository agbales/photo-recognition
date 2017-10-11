const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
var io = require('socket.io').listen(server);
const request = require('request');
const config = require('./config.js')

app.use(express.static('public'));

io.sockets.on('connection', function(socket) {
  console.log('Client connected: ' + socket.id);
  socket.on('url submit', function(url){
    var data = {
      "image": url,
      "selector": "ROLL"
    }
    console.log('url submitted');
    kairosDetect(data);
  });
  socket.on('disconnect', function() {
    console.log('Client disconnected.');
  });
});

function kairosDetect(params){

  var options = {
    url: 'http://api.kairos.com/detect',
    dataType: "application/json",
    headers: {
      app_id: config.app_id,
      app_key: config.app_key
    },
    json: true,
    body: params
  };

  request.post(options, function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    if (body.images[0]) {
      console.log('body:', body.images[0].faces);
      console.log('gender:', body.images[0].faces[0].attributes.gender);
      io.sockets.emit('data', body);
    }
  });
}

process.on('uncaughtException', function (err) {
  console.log(err);
});
