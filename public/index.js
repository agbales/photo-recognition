$(document).ready(function(){
  var socket = io.connect();

  socket.on('data', function(msg) {
    console.log('got data message...', msg);

    $('#info').html('<img src="' + msg.uploaded_image_url + '" width="300px">');

    var attributes = msg.images[0].faces[0].attributes;
    for (var prop in attributes) {
      if (prop == "gender") {
        var g = attributes[prop];
        $('#info').append($('<div>').text("Gender: " + g.type + "(female confidence: " + g.femaleConfidence  + ", male confidence: " + g.maleConfidence + ")"));
      } else {
        var info = prop + ": " + attributes[prop];
        $('#info').append($('<div>').text(info));
      }
    }

  });

  $('#url-submit-form').submit(function() {
    socket.emit('url submit', $('#input').val());
    return false;
  });
});
