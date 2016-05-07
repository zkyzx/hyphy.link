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
		functions.validateUrl(link, function(status){
			if (!status.error){
				(function(){
					shortenLink =  functions.genRandomString();
					originalLink = link;
					functions.insertLink(shortenLink, originalLink);
					socket.emit('link ready', "hyphy.link/" + shortenLink);
					return false;
				})();
			} else {
			   console.log("an error occured while attempting to connect to "+ link);
			   socket.emit('link ready', "");
			   return false;
			}
		});
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'hyphy.link' });
});


router.get('/api/queryentries', function(req, res){
    Hlink.find({}, function(err, docs){
        res.json(docs)
    })
});


router.post('/api/newentry/', function(req, res){
    sl = functions.genRandomString();
    ll = req.query.ll;
    console.log({"sl":sl, "ll": ll});
    functions.insertLink(sl,ll);
    res.send({"generated":"hyphy.link/"+sl});
});



/*
router.get('/link', function(req, res){
    console.log( functions.genRandomString() );
});

router.get('/:q', function(req, res){
    functions.insertLink("short","long");
});
*/


module.exports = router;
