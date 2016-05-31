var sockethandlers = require("./sockethandlers");

module.exports = function(io) {
  var app = require('express');
  var router = app.Router();

  // On submit, generate new short link and emit value back to client for display.
  io.on('connection', function(socket){
    sockethandlers.on_linkSubmit(socket); 
  });
  
  return router;
}
