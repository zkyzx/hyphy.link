module.exports = function(server){
  var io = require('socket.io')(server);

  // catch errors
  io.on('error', function(err){
    throw err;
  })

  // Set Socket.io listeners by creating a socket.io middleware
  // attachEventlisteners would live in `/controllers`
  io.use(attachEventlisteners);

  io.on('connection', function (socket) {

   console.log("socket io connected"); 

  });

  return io; // so it can be used in app.js ( if need be )
}
