var mongoose = require("mongoose");

var predictSchema = new mongoose.Schema({

	symptom:String,
	disease:[String],
	specialisation:String

});
module.exports = mongoose.model("Predict",predictSchema);



//db.predicts.insertOne({symptom:"Chills",disease:["Flu","Acute inflammation of lung"],specialisation:"General practice"})