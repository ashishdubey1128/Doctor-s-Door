var mongoose = require("mongoose");

var doctorSchema = new mongoose.Schema({

	Location_Coordinates:String,
	Hospital_Name:String,
	State:String,
	District:String,
	Pincode:Number

});
module.exports = mongoose.model('Doctor',doctorSchema,'doctor');