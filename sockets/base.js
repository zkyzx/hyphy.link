var functions = require("../functions");

module.exports = function(io) {
    var app = require('express');
    var router = app.Router();

	// On submit, generate new short link and emit value back to client to display.
	io.on('connection', function(socket){
	  socket.on('link submit', function(link){
	  // strip protocol from url string to make it easier to use response.redirect
		link = link.replace(/http:\/\/|https:\/\//i, '');
		functions.validateUrl(link, function(status){
		  if (!status.error){
			(function(){
			  shortLink =  functions.genRandomString();
			  originalLink = link;
			  global.Hlink.find({shortLink: shortLink}, function(err, docs){
				if (docs[0]){
				  console.log("Overwriting hlink" + docs[0].shortLink);
				};
			  });

			  functions.insertLink(shortLink, originalLink);
			  socket.emit('link ready', "hyphy.link/" + shortLink);
			  return false;
			})();
		  } else {
			  console.log("an error occured while attempting to connect to "+ link);
			  socket.emit('link error', "An error occured while attempting to shorten that url.");
			  return false;
			}
		});
	  });
	});

    return router;
}
