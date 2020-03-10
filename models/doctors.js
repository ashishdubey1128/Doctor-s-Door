var mongoose = require("mongoose");

var doctorsSchema = new mongoose.Schema({

	Name: String,
	Specialty:String

});
module.exports = mongoose.model('Doctors',doctorsSchema);