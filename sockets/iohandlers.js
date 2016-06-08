var utilities = require("../utilities");

exports.on_linkSubmit = function(socket) {
  var Link = require("../models/link");
  var targetLink;

  // User submits new link
  socket.on('link submit', function(targetLink) {
    // Check if the link contains the protocol if not prepend the protocol.
    if (targetLink.indexOf("http") ==  -1 && targetLink != "") {
      targetLink = "http://" + targetLink;
    }

    // extract the base url
    pathArray = targetLink.split( '/'  ); 
    rootPath = pathArray[2];

    // `guarantee` urls without proper format fail validation.
    if (!rootPath) {
      rootPath = "jdijdidpi";
    }

    utilities.validateUrl(rootPath, function(status) {
      if (!status.error) { 
        // Link passes validation
		shortLink = utilities.genRandomString();
		Link.find({shortLink: shortLink }, function(err, links) {
		  if (links[0]) { 
            // if short link already exists in db.
			console.log(docs[0].shortLink + " found, will retry short name generation. ");
            generateNewEntry();
		  } else {  // generated a unique shortLink, lets use it.

            var newLink = Link ({ shortLink : shortLink, longLink: targetLink, created_at: new Date() });

            // save the link to the database
            newLink.save(function(err) {
              if (err) throw err;
              console.log('Link created!');
            });

            // link saved, emit 'link ready' status to client
			socket.emit('link ready', "hyphy.link/" + shortLink);
		  }
		});
			        
      } else {
	      console.log("An error occured while attempting to connect to "+ targetLink);
          /* 
            emit back to client in order to display 
            message to user that the url they specified is invalid.
          */ 

		  socket.emit('link error', "An error occured while attempting to shorten that url.");
      }
    });
  });
};