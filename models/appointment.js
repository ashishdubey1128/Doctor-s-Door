var mongoose = require("mongoose");

var appointSchema = new mongoose.Schema({

	uid:String,
	did:String,
	dname:String,
	hid:String,
	hname:String,
	date:String,
	time:String,
	count:Number

});
module.exports = mongoose.model('Appointment',appointSchema);