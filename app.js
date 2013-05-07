var express = require('express')
, path = require('path')
, app = express()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);

//configure sockets
server.listen(process.env.PORT || 3000);
//configure express
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//support for hosting the app online at heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});



app.get('/', function (req, res) { //when you visit the homepage
  res.render('client.hbs',{messages:messages}); //display the client.hbs file (no variables passed in) 
});

var messages = [];

io.sockets.on('connection', function (socket) { //new socket connection established
  console.log("socket connected");
  socket.on('message',function(info){
  	socket.get("name",function(err,name){
  	if(!name){
  		socket.set("name",info.message);
  	}else{
      console.log(messages);
    messages.push({name: name, message: info.message});
  	io.sockets.emit('message',{message: info.message,name: name});
  	}
  	});
  });
});