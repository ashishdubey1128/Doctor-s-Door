var mongoose = require("mongoose");
//var passportlocalmongoose = require("passport-local-mongoose");


var DocSchema = new mongoose.Schema({

	uname:String,
	docname:String,
	password:String

});
module.exports = mongoose.model("Doc",DocSchema);