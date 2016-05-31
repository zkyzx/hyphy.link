var mongoose = require('mongoose');

var Schema = mongoose.Schema;	

var accessRecordSchema = new Schema ({
	shortLink: String,
	access_time: Date
});

var accessRecord = mongoose.model('accessRecord', accessRecordSchema);

module.exports = accessRecord;