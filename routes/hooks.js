var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;


router.post('/deploy', function(req, res, next) {
   var body = req.body;
   var _event = body.hook.events[0];
   var _sender = body.sender.login;

   if (_event == "push"){
      console.log("Pulling lastest master from remote.");

      exec("git status && git  pull origin master", function(err, stdout, stderr){
         if(err){
              console.log(err);
         }

         else {
             console.log(stdout);
         }
      });
   }

   res.status(200);
   res.send();
});


module.exports = router;
