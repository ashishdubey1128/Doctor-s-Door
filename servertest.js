var express = require("express");

var app = express();

var bodyParser = require("body-parser");

var request = require("request");

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/doctors_door");

var passport = require("passport");

var localStrategy = require("passport-local");

// var passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/patient");
var Symptom = require("./models/symptoms");
var Patientdet = require("./models/patdet");
var Patientloc = require("./models/patloc");
var Doctor = require("./models/doctor");
var Doctors = require("./models/doctors");
var Appointment = require("./models/appointment");
var Doc = require("./models/doc");
var Predict = require("./models/predict");

app.use(require("express-session")({
	secret:"ASHISH is the best",
	resave:false,
	saveUninitialized:false
}));

app.use( express.static( "public" ) );

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//doc variables

var uid = "";
var dn="";

//

app.use(bodyParser.urlencoded({extended:true}));

//Date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!

var yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd;
} 
if (mm < 10) {
  mm = '0' + mm;
} 
var today = dd + '/' + mm + '/' + yyyy;
var dt = today.toString();




app.get("/",function (req,res) {

	res.render("landing.ejs");
	
	//res.render("homepage.ejs");
});

app.get("/pat",function(req,res){
	res.render("homepage.ejs");
});


app.get("/userpage",isLoggedIn,function(req,res)
{
	var x = req.user._id;
	x.toString();
	Symptom.find({userid:x},function(err,query)
		{
			if (err) {
				console.log(err);
			}
			Patientdet.find({userid:x},function(errr,det)
			{
				if(errr)
				{
					console.log(errr);
				}
				else
				{
					Appointment.find({uid:req.user._id},function(err,usr){
						if(err)
						{
							console.log(err);
						}
						else
						{
							res.render("userpage.ejs",{id:req.user._id,query:query,age:det,usr:usr});
						}
					});
				}
			});
		});
});

//=============
//AUTH ROUTES
//=============

app.get("/signup",function (req,res) {
	
	res.render("signup.ejs");
});

app.post("/signup",function (req,res) {
	var newuser = new User({username:req.body.username});
	User.register(newuser,req.body.password , function (err,user) {
		if(err)
		{
			console.log(err);
			return res.render("signup.ejs");
		}
		passport.authenticate('local')(req,res,function(){
			//res.redirect("/userpage");
		
		//================
		//location capture
		//================
	Patientdet.create({
		userid:req.user._id,
		name:req.body.names,
		state:req.body.state,
		pin:req.body.pin,
		dob:req.body.dob,
		dist:req.body.dist
	},function(err,user){
		if(err)
		{
			console.log(err);
		}
		res.redirect("/userpage");
	});
	});
	});
});
//===============
//LOGIN
//===============


app.get("/login",function (req,res) {
	res.render("login.ejs");
});

app.post("/login", passport.authenticate("local",{
	successRedirect:"/userpage",
	failureRedirect:"/login"
}),function (req,res) {
});

//========
//logout
//========
app.get("/logout",function (req,res) {
	req.logout();
	res.redirect("/");
});




app.get("/:id/removequery",function(req,res)
{
	Appointment.findOneAndDelete({uid:req.params.id},function(err,query)
	{
		if(err)
		{
			console.log(err);
		}
		res.redirect("/userpage");

	});
});



var sid;

app.post("/doctor/:id",function(req,res){
Patientloc.create({
		userid:req.user._id,
		lat:req.body.lat,
		lon:req.body.lon
	},function(err,loc){
		if(err)
		{
			console.log(err);
		}
	});
if(req.body.symp!="")
	{
	Symptom.create({
		userid:req.params.id,
		symptom:req.body.symp,
		date:dt
	},function(err,query){
		if(err){
		console.log(err);
	}
	sid = query._id;
	console.log(sid);
	});
}
else
{
	res.redirect("/userpage");
}


var y = req.body.symp;
var yob = req.body.age;
var sex = req.body.sex;
console.log(y);
console.log(yob);
console.log(sex);
var id;
// var ur = 'https://sandbox-healthservice.priaid.ch/symptoms?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFzaGlzaGR1YmV5MTEyOEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjQxODUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMTgtMTEtMDMiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU4OTkyNjI0OCwibmJmIjoxNTg5OTE5MDQ4fQ.-ldtq5CC_F0tfcS-s1c3HNv8uhLQcWbLkeR_NtPoeko&format=json&language=en-gb';
// request(ur, function (error, response, body) {
// 	if(!error && response.statusCode==200)
// 	{		
// 		var parseddata =JSON.parse(body);
// 		parseddata.forEach(function(x){
// 			if(x.Name===y)
// 			{
// 				id = x.ID;
// 			}
		
// 			/*if(parseddata.data[i].specialties[0].uid=='cardiologist')
// 			{
// 				console.log(parseddata.data[i].practices[i].name);
// 			}*/
// 		});
// 		console.log(id);
// 		var id1=String(id);

// 		var url="https://sandbox-healthservice.priaid.ch/diagnosis?symptoms=["+id1+"]&gender="+sex+"&year_of_birth="+yob+"&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFzaGlzaGR1YmV5MTEyOEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjQxODUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMTgtMTEtMDMiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU4OTkyNjMzNSwibmJmIjoxNTg5OTE5MTM1fQ.6bc6gV9gapL6JzW-2qM5l4MKMIH1kQj_kz9jE1Cc2L8&format=json&language=en-gb";
// 		request(url, function (error, response, body) {
// 			var parsedsymptoms = JSON.parse(body);
// 			//console.log(parsedsymptoms[0].Issue.Name);
// 			var sname = parsedsymptoms[0].Specialisation[0].Name;
// 			console.log(sname);
// 			//var url = "https://api.betterdoctor.com/2016-03-01/doctors?query="+y+"&location=37.773%2C-122.413%2C1000&user_location=37.773%2C-122.413&skip=0&limit=10&user_key=1a11f80f6c067202af0e8481625be2d9";
// 			//request(url,function(error,response,body){
// 			//if(!error && response.statusCode==200)
// 			//{		

			Predict.findOne({symptom:y},function(er,parsedsymptoms)
			{
				if(er)
				{
					console.log(er);
					res.redirect("/userpage");
				}
				console.log(parsedsymptoms.disease[0]);
				Patientdet.findOne({userid:req.params.id},function(err,pat){
					if(err)
					{
						console.log(err);
					}
					else{
						Doctor.find({District:pat.dist},function(er,pati){
						if(er)
						{
							console.log(er);
						}
						else
						{		
							//var parseddata =JSON.parse(body);
							//var x = parseddata.data[0].practices[0].name;
							//var z = parseddata.data[0].specialties[0].uid;
							//var lat = parseddata.data[0].practices[0].lat;
							//var lon = parseddata.data[0].practices[0].lon;
							//var map = "https://www.google.co.in/maps/@"+lat+","+lon+",17z?hl=en"
							Symptom.findOneAndUpdate({_id:sid},{$set:{specialisation:parsedsymptoms.specialisation}},function(err,sym)
							{
								if(err)
								{
									console.log(err);
								}
								else
								{
									// var k = [];
									// parsedsymptoms.forEach(function(symptom){
									// k.push(symptom.Issue.Name);
									// });
									res.render("home1.ejs",{diseases:parsedsymptoms.disease,di:parsedsymptoms,det:pati});
								}
							});
							
							
						}
					});			
				}
			});
	});
});
// else
// {
// console.log("Token Expired!!");
// }

// });
// });


app.get("/map/:la/:lo",function(req,res)
{
	res.render("gmaps.ejs",{lat:req.params.la,lon:req.params.lo})
});


//Hospital appointment

app.get("/hosp/:id/:la/:lo",function(req,res)
{
	Doctor.findOne({_id:req.params.id},function(err,hos)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/userpage");
		}
		else
		{
			Symptom.findOne({_id:sid},function(err,symp)
			{
				if(err)
				{
					console.log(err);
					res.redirect("/hosp/"+req.params.id);
				}
				else
				{
					var spe = symp.specialisation.slice(0,5);
					Doctors.find({Specialty:{$regex: spe , $options: 'i'}},function(err,doc)
					{
						if (err) {console.log(err);}
						else
						{
							res.render("appoint.ejs",{hos:hos,symp:symp,doc:doc,la:req.params.la,lo:req.params.lo});
						}
					});
				}
			});
		}
	});
	
});



app.post("/appoint/:id",function(req,res)
{
	Appointment.findOne({uid:req.user._id,hid:req.params.id,did:req.body.docid,date:req.body.date},function(err,usr)
	{
		if(usr)
		{
			res.render("failure.ejs",{msg:"Appointment already Booked",id:req.params.id})
		}
		else
		{
			Appointment.findOne({did:req.body.docid,date:req.body.date},function(err,details)
	{
		if(details)
		{
			console.log(details.count);
			if(details.count>0)
			{
				var c = details.count-1;
				Doctor.findOne({_id:req.params.id},function(err,usr1){
								if(err)
								{
									console.log(err);
								}
								else
								{
									console.log(usr1.Hospital_Name);
									Doctors.findOne({_id:req.body.docid},function(err,usr2)
									{
										if(err)
										{
											console.log(err);
										}
										Appointment.create({
											uid:req.user._id,
											did:req.body.docid,
											dname:usr2.Name,
											hid:req.params.id,
											hname:usr1.Hospital_Name,
											date:req.body.date,
											time:req.body.time,
											count:c
										},function(err,query){
										if(err){
										console.log(err);
										}
										else
										{
											res.render("success.ejs");
											console.log(query);
										}
									});
									});
								}
							});
		}
		else
		{
			res.render("failure.ejs",{msg:"Doctor busy on given date. Choose other date",id:req.params.id});
		}
	}
	else
	{
		Doctor.findOne({_id:req.params.id},function(err,usr1){
								if(err)
								{
									console.log(err);
								}
								else
								{
									console.log(usr1.Hospital_Name);
									Doctors.findOne({_id:req.body.docid},function(err,usr2)
									{
										if(err)
										{
											console.log(err);
										}
										Appointment.create({
											uid:req.user._id,
											did:req.body.docid,
											dname:usr2.Name,
											hid:req.params.id,
											hname:usr1.Hospital_Name,
											date:req.body.date,
											time:req.body.time,
											count:9
										},function(err,query){
										if(err){
										console.log(err);
										}
										else
										{
											res.render("success.ejs");
											console.log(query);
										}
									});
									});
								}
							});
	}
	});
		}
	});
});



///////////////////
//Doc routes
//////////////////


app.get("/doc",function(req,res){
	res.render("dochome.ejs");
});


app.get("/docsignup",function(req,res)
{
	res.render("dsignup.ejs");
});


app.post("/docsignup",function(req,res)
{
	Doc.create({
		uname:req.body.username,
		password:req.body.password,
		docname:req.body.names
	},function(err,scc)
	{
		if(err)
		{
			res.redirect("/docsignup");
			console.log(err);
		}
		else
		{
			uid = req.body.username;
			dn=req.body.names;
			res.redirect("/docpage");
		}
	});
});


app.get("/doclogin",function(req,res)
{
	res.render("dlogin.ejs");
});

app.post("/doclogin",function(req,res)
{
	Doc.findOne({uname:req.body.username,password:req.body.password},function(err,usr)
	{
		if(err)
		{
			res.redirect("/doclogin");
		}
		else
		{
			console.log(usr);
			uid = req.body.username;
			dn=usr.docname;
			console.log(dn);
			res.redirect("/docpage");
		}
	});
});


//doc page

app.get("/docpage",function(req,res)
{
	Doc.findOne({uname:uid},function(err,user)
	{
		if(err)
		{
			res.redirect("/doclogin");
		}
		else
		{
			Appointment.find({dname:dn},function(err,usr){
						if(err)
						{
							console.log(err);
						}
						else
						{
							console.log(usr)
							res.render("docUserpage.ejs",{id:user.docname,usr:usr,user:user});
						}
					});
		}
	});
});



app.get("/:id/removequery/doc",function(req,res)
{
	Appointment.findOneAndDelete({dname:req.params.id},function(err,query)
	{
		if(err)
		{
			console.log(err);
		}
		res.redirect("/docpage");

	});
});


app.post("/symp/doctor",function(req,res)
{


var y = req.body.symp;
var yob = req.body.age;
var sex = req.body.sex;
console.log(y);
console.log(yob);
console.log(sex);
var id;
Predict.findOne({symptom:y},function(er,parsedsymptoms)
			{
				if(er)
				{
					console.log(er);
					res.redirect("/userpage");
				}
				console.log(parsedsymptoms.disease[0]);
									res.render("docsymp.ejs",{diseases:parsedsymptoms.disease,di:parsedsymptoms});
				});
});


function isLoggedIn(req,res,next) {
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/login");
}



var port = 3000||process.env.port;
app.listen(port,function(){console.log ("Listening")});
