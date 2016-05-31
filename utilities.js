var mongoose = require('mongoose');

exports.genRandomString = function() {
   // Generate random 5 character alphanumeric.
   return Math.random().toString(36).substr(2,5).toUpperCase();
}

exports.validateUrl = function(url, callback) {
  // ensure validation failure.
  if (url == '') {
    var url = 'sijsijpjw';
  }

  // make a http request to the url to determine if valid or not.
  var http = require('http'),
  req = http.request({method: 'HEAD', host: url, port: 80, path: '/'}, function(r) {
    callback({"error": false, "url": url});
  });

  req.on('error', function(err) {
    callback({"error" : true, "url": url});
  });

  req.end();
}
