var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;


router.post('/deploy', function(req, res, next) {
      _event = req.headers["x-github-event"];

      console.log("Pulling lastest master from remote.");
  
      if ( _event == "push"){ 
          exec("git status && git pull origin master", function(err, stdout, stderr){
            if(err){
              console.log(err);
              res.status(500);
              res.send();
            }

            else {
              console.log(stdout);
              res.status(200);
              res.send();
            }
          });
     }

});


module.exports = router;
