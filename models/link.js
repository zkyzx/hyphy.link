var mongoose = require('mongoose');

var Schema = mongoose.Schema;	
var LinksSchema = new Schema ({
	shortLink: String,
	longLink: String,
	created_at: Date
});

var Link = mongoose.model('Link', LinksSchema);

module.exports = Link;