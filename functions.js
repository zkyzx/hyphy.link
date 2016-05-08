var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

exports = module.exports.genRandomString = function(){
   // Generate random 5 character alphanumeric.
   return Math.random().toString(36).substr(2,5).toUpperCase();
}


exports = module.exports.insertLink = function(shortLink, origLink){
    var url = 'mongodb://localhost:27017/hldb';

    MongoClient.connect(url, function(err,db){
        if (err) throw err;
        console.log("connected to Database");
        // new entry
        var document = {"shortLink": shortLink, "longLink": origLink};

        db.collection('links').insert(document, function(err, records){
            if (err) throw err;
            console.log(records);
        });
    });
};


exports = module.exports.queryAll = function(){
    mongoConnect(function(db){
        cursor = db.collection("links").find(  );
        cursor.each(function(err, doc){
            if (err){
                console.log(err);
                db.close();
            } else if (doc != null){
                console.dir(doc);
                db.close();
            } else {
                console.log("no data found");
                db.close();
            }
        });
    });
}


exports = module.exports.validateUrl = function(url, callback){
     if (url == ''){
	   callback({"error": false, "url": url});
     }
	// Validate if the target url is active or not.
	  var http = require('http'),
		options = {method: 'HEAD', host: url, port: 80, path: '/'},
		req = http.request(options, function(r){
		  callback({"error": false, "url": url});
	    });

        req.end();

		req.on('error', function(err){
			callback({"error" : true, "url": url});
		})
}

exports = module.exports.mongooseConnection = function(){
	mongoose.connect('mongodb://127.0.0.1:27017/hldb', function(error){
		if (error){
			console.log(error);
		}
	});

	var Schema = mongoose.Schema;
	var HlinkSchema = new Schema(({
		shortLink: String,
		longLink: String
	}))

	return  mongoose.model('links', HlinkSchema);
}
