var express = require('express');
var functions = require("../functions.js");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'hyphy.link' });
});

router.get('/query', function(req, res){
    functions.queryAll();
});

router.get('/:q', function(req, res){
    functions.updateLink("short","long");
});



module.exports = router;
