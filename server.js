// server express
var express = require('express'),
	app     = express(),
	server  = require("http").createServer(app);
// express public
app.use(express.static(__dirname + '/public'));
// camara-feed
require("dronestream").listen(3001);
// server soket.io
var io = require('socket.io').listen(3002);
io.set('log level', 1);
// socket.io events
io.sockets.on('connection', function (socket) {
    var arDrone = require('ar-drone');
    var client = arDrone.createClient();

    setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },1000);

    socket.on('event', function (data) {
        if(data.name=="takeoff"){
            console.log("Browser asked Ar Drone to Take Off");
            client.takeoff();
        }
        if(data.name=="spin"){
            console.log("Browser asked Ar Drone to Start Spinning");
            client.clockwise(1);
        }
        if(data.name=="stop"){
            console.log("Browser asked Ar Drone to Stay and Hover");
            client.stop();
        }
        if(data.name=="land"){
            console.log("Browser asked Ar Drone to Land");
            client.land();
        }

    });
});
// start http server
app.listen(3000);


