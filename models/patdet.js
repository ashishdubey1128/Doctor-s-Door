var mongoose = require("mongoose");

var patientDetSchema = new mongoose.Schema({

	userid:String,
	name:String,
	state:String,
	pin:String,
	dob:String,
	dist:String

});
module.exports = mongoose.model("Patientdet",patientDetSchema);