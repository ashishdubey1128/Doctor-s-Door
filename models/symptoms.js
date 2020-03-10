var mongoose = require("mongoose");

var symptomSchema = new mongoose.Schema({

	userid:String,
	symptom:String,
	disease:String,
	specialisation:String,
	date:String

});
module.exports = mongoose.model("Symptom",symptomSchema);