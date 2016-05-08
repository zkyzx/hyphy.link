var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var functions = require("./functions.js");

var mongoose = require('mongoose');
var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

global.Hlink = functions.mongooseConnection();
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.use(function(req,res,next){
  res.io = io;
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server.listen(3000);
module.exports = {app:app, server:server};
