var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'hyphy.link | Simple URL Shortener' });
});


// redirect handler
router.get('/:url', function(req, res){
    url = req.url.replace('\/', '');
    global.Hlink.find({shortLink: url}, function(err, docs){
        if (docs[0]){
			targetUrl = docs[0].longLink;
			res.statusCode = 302;
			res.redirect("http://" +targetUrl);
        } else {
console.log("test");
          res.render('error', {message: 'test'});
        }
    });
});


/*
router.get('/link', function(req, res){
    console.log( functions.genRandomString() );
});
router.get('/api/queryentries', function(req, res){
    global.Hlink.find({}, function(err, docs){
        res.json(docs)
    })
});

*/


module.exports = router;
