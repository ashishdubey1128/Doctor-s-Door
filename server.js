var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var readline = require("readline");
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get("/",function(req,res){
res.render("home.ejs");
});
app.post("/doctor",function(req,res){
var y = req.body.symp;
var yob = req.body.age;
var sex = req.body.sex;
console.log(y);
console.log(yob);
console.log(sex);
var id;
request('https://sandbox-healthservice.priaid.ch/symptoms?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFzaGlzaGR1YmV5MTEyOEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjQxODUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMTgtMTEtMDMiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU0NDk1MzkwOCwibmJmIjoxNTQ0OTQ2NzA4fQ.ybtKJtjmQ6SML0BiR0uDtN03QJzDZKJJTKP6bTQv5XQ&format=json&language=en-gb', function (error, response, body) {
	if(!error && response.statusCode==200)
	{		
		var parseddata =JSON.parse(body);
		parseddata.forEach(function(x){
			if(x.Name===y)
			{
				id = x.ID;
			}
		
			/*if(parseddata.data[i].specialties[0].uid=='cardiologist')
			{
				console.log(parseddata.data[i].practices[i].name);
			}*/
		});
		console.log(id);
		var id1=String(id);

		var url="https://sandbox-healthservice.priaid.ch/diagnosis?symptoms=["+id1+"]&gender="+sex+"&year_of_birth="+yob+"&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFzaGlzaGR1YmV5MTEyOEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjQxODUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMTgtMTEtMDMiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU0NDk1Mzk1NCwibmJmIjoxNTQ0OTQ2NzU0fQ.QiyYLwdBzbjp8LtDCUgem7-a1JsKgN1TlP-Oj_i1kKk&format=json&language=en-gb";
		request(url, function (error, response, body) {
			var parsedsymptoms = JSON.parse(body);
			//console.log(parsedsymptoms[0].Issue.Name);
			var sname = parsedsymptoms[0].Specialisation[0].Name;
			var url = "https://api.betterdoctor.com/2016-03-01/doctors?query="+y+"&location=37.773%2C-122.413%2C1000&user_location=37.773%2C-122.413&skip=0&limit=20&user_key=1a11f80f6c067202af0e8481625be2d9"
			request(url,function(error,response,body){
			if(!error && response.statusCode==200)
					{		
						var parseddata =JSON.parse(body);
						for(var i=0;i<10;i++)
						{
							var x = parseddata.data[i].practices[0].name;
							var z = parseddata.data[i].specialties[0].uid;
							var k = [];
							parsedsymptoms.forEach(function(symptom){
								k.push(symptom.Issue.Name);
							});
							res.render("home1.ejs",{diseases:k,doctype:z,add:x});
						}
					}
			});
			
	});
}
else
{
console.log("efre");
}

});
});









/*
//var api_key = '1a11f80f6c067202af0e8481625be2d9';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the Symptoms', (answer) => {
{
request('https://sandbox-healthservice.priaid.ch/symptoms?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFzaGlzaGR1YmV5MTEyOEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjQxODUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMTgtMTEtMDMiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU0MTMxMDIyNywibmJmIjoxNTQxMzAzMDI3fQ.xEYdT7xyN7ZRkd7e8ZwByW0IgA-c8y1QhMeAbwC4SZk&format=json&language=en-gb', function (error, response, body) {
	if(!error && response.statusCode==200)
	{		
		var parseddata =JSON.parse(body);
		for(var i=0;i<50;i++)
		{
			if(parseddata[i].Name===answer)
			{
				var id = parseddata[i].ID;
			}
		
			/*if(parseddata.data[i].specialties[0].uid=='cardiologist')
			{
				console.log(parseddata.data[i].practices[i].name);
			}*/
		/*}
		console.log(id);
		var id1=String(id);

		var url="https://sandbox-healthservice.priaid.ch/diagnosis?symptoms=["+id1+"]&gender=male&year_of_birth=1998&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFzaGlzaGR1YmV5MTEyOEBnbWFpbC5jb20iLCJyb2xlIjoiVXNlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjQxODUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIyMDAiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL2xpbWl0IjoiOTk5OTk5OTk5IiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9tZW1iZXJzaGlwIjoiUHJlbWl1bSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGFuZ3VhZ2UiOiJlbi1nYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwOTktMTItMzEiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXBzdGFydCI6IjIwMTgtMTEtMDMiLCJpc3MiOiJodHRwczovL3NhbmRib3gtYXV0aHNlcnZpY2UucHJpYWlkLmNoIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGhzZXJ2aWNlLnByaWFpZC5jaCIsImV4cCI6MTU0MTMxMDI5MCwibmJmIjoxNTQxMzAzMDkwfQ.HOiSTrsPSDpN_X6bfEWeyUXOvGi_72DuEJcVPlG5M2s&format=json&language=en-gb";
		request(url, function (error, response, body) {
			var parsedsymptoms = JSON.parse(body);
			parsedsymptoms.forEach(function(symptom){
console.log(symptom.Issue.Name);
});
			//console.log(parsedsymptoms[0].Issue.Name);
			var sname = parsedsymptoms[0].Specialisation[0].Name;

			if(sname==="General practice")
			{
				request('https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&skip=2&limit=10&user_key=1a11f80f6c067202af0e8481625be2d9', function (error, response, body) {
					if(!error && response.statusCode==200)
					{		
						var parseddata =JSON.parse(body);
						for(var i=0;i<10;i++)
						{
							if(parseddata.data[i].specialties[0].uid==="general-surgeon");
							{
								var x = parseddata.data[i].practices[0].name;
							}
		
						}
						console.log("You need to refer a General-Surgeon");
						console.log("Suggested health centre :");
						console.log(x);
					}	
				});
			}
			else if(sname==="Gastroenterology")
			{
				request('https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&skip=2&limit=10&user_key=1a11f80f6c067202af0e8481625be2d9', function (error, response, body) {
					if(!error && response.statusCode==200)
					{		
						var parseddata =JSON.parse(body);
						for(var i=0;i<10;i++)
						{
							if(parseddata.data[i].specialties[0].uid==="gastroenterologist");
							{
								var x = parseddata.data[i].practices[0].name;
							}
		
						}
						console.log("You need to refer a Gastroenterologist");
						console.log("Suggested health centre :");
						console.log(x);
					}	
				});
			}
			else if(sname==="Cardiology")
			{
				request('https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&skip=2&limit=10&user_key=1a11f80f6c067202af0e8481625be2d9', function (error, response, body) {
					if(!error && response.statusCode==200)
					{		
						var parseddata =JSON.parse(body);
						for(var i=0;i<10;i++)
						{
							if(parseddata.data[i].specialties[0].uid==="cardiologist");
							{
								var x = parseddata.data[i].practices[0].name;
							}
		
						}
						console.log("You need to refer a Cardiologist");
						console.log("Suggested health centre :");
						console.log(x);
					}	
				});
			}
			else if(sname==="Internal medicine")
			{
				request('https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&skip=2&limit=10&user_key=1a11f80f6c067202af0e8481625be2d9', function (error, response, body) {
					if(!error && response.statusCode==200)
					{		
						var parseddata =JSON.parse(body);
						for(var i=0;i<10;i++)
						{
							if(parseddata.data[i].specialties[0].uid==="internist");
							{
								var x = parseddata.data[i].practices[0].name;
							}
		
						}
						console.log("You need to refer a Internist");
						console.log("Suggested health centre :");
						console.log(x);
					}	
				});
			}	
		});
	}
else
{
console.log("efre");
}

});
}
rl.close();
});

*/




var port = 3000||process.env.port;
app.listen(port,function(){console.log ("Listening")});
