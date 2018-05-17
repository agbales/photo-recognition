const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
var io = require('socket.io').listen(server);
const request = require('request');
const config = require('./config.js')
const APP_ID = process.env.APP_ID || config.APP_ID;
const APP_KEY = process.env.APP_KEY || config.APP_KEY;

app.use(express.static(__dirname + '/public'));

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
      app_id: APP_ID,
      app_key: APP_KEY
    },
    json: true,
    body: params
  };

  request.post(options, function (error, response, body) {
    if (typeof body.images[0] != 'undefined' ) {

      var msg = {}
      msg.uploaded_image_url = params.image;
      msg.body = body;

      io.sockets.emit('data', msg);
    } else {
      io.sockets.emit('data', {err: "Sorry, no results found"});
    }
  });
}

process.on('uncaughtException', function (err) {
  console.log(err);
});
