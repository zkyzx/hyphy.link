var functions = require("../functions");

module.exports = function(io) {
  var app = require('express');
  var router = app.Router();

  // On submit, generate new short link and emit value back to client for display.
  io.on('connection', function(socket){
    socket.on('link submit', function(link){
    // Check if the link contains the protocol if not prepend the protocol in order for the
        // extraction of the urls root.
    if (link.indexOf("http") ==  -1 && link != ""){
        link = "http://" + link;
    }

    // extract the root
    pathArray = link.split( '/'  );root = pathArray[2];

    console.log(root);
    // Validate the url root by attempting to connect to it. Failed requests are considered invalid and will not be stored.
	  functions.validateUrl(root, function(status){
          // if the request to the target url succeeds.
	    if (!status.error){
		  (function generateNewEntry(){
			shortLink =  functions.genRandomString();
			originalLink = link;
			global.Hlink.find({shortLink: shortLink}, function(err, docs){
			  if (docs[0]){ // if shortlink already exists.
				console.log("entry:" + docs[0].shortLink + " found in db, attempting to generate an unique sl this time.");
                generateNewEntry();
			  } else {
                  // we have identified a unique shortlink and ready for insert.
			      functions.insertLink(shortLink, originalLink);
				  console.log("entry:" + shortLink + " is unique and will be used.");
			      socket.emit('link ready', "hyphy.link/" + shortLink);
              }
			});
		  })();

		} else {
			console.log("An error occured while attempting to connect to "+ link);
            // send signal back to client in order to display message to user that the url they specified is invalid.
			socket.emit('link error', "An error occured while attempting to shorten that url.");
		  }
	   });
	});
  });

  return router;
}
