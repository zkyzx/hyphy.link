var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'hyphy.link | Simple URL Shortener' });
});

// redirect handler
router.get('/:url', function(req, res){
    // replace leading forward slash
    requestedUrl = req.url.replace('\/', '');
    // search mongo db for any entry matching the short link specified.
    // if a match is found, then redirect user to the respective long link.
    // if a match is not found, then trigger a 404.

    global.Hlink.find({shortLink: requestedUrl}, function(err, docs){
        if (docs[0]){
			originalLink = docs[0].longLink;
			res.statusCode = 302;
			res.redirect("http://" + originalLink);
        } else {
          res.statusCode = 404;
          res.render('error');
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
