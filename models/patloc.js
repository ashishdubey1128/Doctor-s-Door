var mongoose = require("mongoose");

var patientLocSchema = new mongoose.Schema({

	userid:String,
	lat:String,
	lon:String

});
module.exports = mongoose.model("Patloc",patientLocSchema);