var express = require('express');
var bodyParser = require('body-parser');
var functions = require("../functions.js");
var mongoose = require('mongoose');

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(8080, "127.0.0.1");


app.use(bodyParser.urlencoded({extended:false}));

var router = express.Router();

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

var Hlink = mongoose.model('links', HlinkSchema);


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
					Hlink.find({shortLink: shortLink}, function(err, docs){
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'hyphy.link' });
});


// redirect handler
router.get('/:url', function(req, res){
    url = req.url.replace('\/', '');
    Hlink.find({shortLink: url}, function(err, docs){
        targetUrl = docs[0].longLink;
        res.statusCode = 302;
        res.redirect("http://" +targetUrl);
        res.end();
    });
});


/*
router.get('/link', function(req, res){
    console.log( functions.genRandomString() );
});
router.get('/api/queryentries', function(req, res){
    Hlink.find({}, function(err, docs){
        res.json(docs)
    })
});

*/


module.exports = router;
