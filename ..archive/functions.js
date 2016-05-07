var mongodb = require('mongodb');

mongoConnect = function(callback){
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/hldb';

    MongoClient.connect(url, function(err, db){
        if (err){
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log("Connection established to", url);
            callback(db);
        }
    });
};


exports = module.exports.updateLink = function(shortLink, originalLink){
    mongoConnect(function(db){
        db.collection("links").save(
            {"shortlink":shortLink},
            {"originalLink": originalLink},
            function(err, data){
                if(err){
                    console.log(err);
                    db.close();
                }else{
                    console.log("new link upserted successfully");
                    db.close();
                }
            }
        );
    });
};


exports = module.exports.queryAll = function(){
    mongoConnect(function(db){
        cursor = db.collection("links").find(  );
        cursor.each(function(err, doc){
            if (err){
                console.log(err);
                db.close();
            } else if (doc != null){
                console.dir(doc);
                db.close();
            } else {
                console.log("no data found");
                db.close();
            }
        });
    });
}
