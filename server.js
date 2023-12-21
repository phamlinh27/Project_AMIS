var express = require('express');
var app = express();
var fs = require("fs");

app.get('/callback_received', function (req, res) {
	console.log('GET /')   
	res.end('{"status":200,"message":"This is test bro!"}')
})
app.post('/callback_received', function(req, res) {
	let data = '', date_time = formatDate(new Date())+".txt";
	console.log('POST /');
	req.on('data', chunk => {
	   data += chunk;
        });
	req.on('end', () => {
	  let jsonData = JSON.parse(data);
	  console.log('Received data:', jsonData);
	  if (!fs.existsSync(__dirname+'/logs/'+jsonData.app_id)) {
            fs.mkdirSync(__dirname+'/logs/'+jsonData.app_id);
	  } 
	  fs.appendFileSync(__dirname+'/logs/list.txt', jsonData.app_id+'/'+date_time+'\n','utf8', err => {
	    if (err) {
	      throw err;
	    }
	  });
	  fs.writeFileSync(__dirname+'/logs/'+jsonData.app_id+'/'+date_time,JSON.stringify(jsonData),'utf8');
	})
	res.writeHead(200, {'Content-Type': 'application/json'})
	res.end('{"status":200,"message":"Okay bro, I have received!"}')
})

var server = app.listen(8081, function () {
	 var host = server.address().address
	 var port = server.address().port
	 console.log("Listening at http://%s:%s", host, port)
})

function padTo2Digits(num) {
	return num.toString().padStart(2, '0');
}

function formatDate(date) {
	return (
	  [
	    date.getFullYear(),
	    padTo2Digits(date.getMonth() + 1),
	    padTo2Digits(date.getDate()),
	  ].join('-') +
	  '_' +
	  [
	    padTo2Digits(date.getHours()),
	    padTo2Digits(date.getMinutes()),
	    padTo2Digits(date.getSeconds()),
	  ].join(':')
	 );
}
