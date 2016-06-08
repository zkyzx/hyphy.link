var express = require('express');
var router = express.Router();

var Link = require("../models/link");
var accessRecord = require("../models/accessRecord");


// base route handler
router.get('/', function(req, res, next) {
  res.render('index', { title: 'hyphy.link | Simple URL Shortener' });
  req.flash('info', 'Flash is back!');
});

router.get('/:url', function(req, res) {
    // replace leading forward slash
    url = req.url.replace('\/', '');

    /* find the requested url, if it is found, redirect to the
       designated url, otherwise trigger a 404. 
    */

    Link.find({ shortLink: url }, function(err, links) {
      if (links[0]) {

        var newRecord = accessRecord({
            shortLink: url,
            access_time: new Date(),
        });

        newRecord.save(function(err) {
          if (err) throw err;
          console.log('logged access to .' + url);
          console.log(newRecord);
        });

        res.statusCode = 302;
	    res.redirect(links[0].longLink);

      } else {
          res.statusCode = 404;
          res.render('error');
      }
    });
});


module.exports = router;
