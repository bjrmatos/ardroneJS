// server express
var express = require('express'),
	app     = express(),
	server  = require("http").createServer(app);
// express public
app.use(express.static(__dirname + '/public'));
// // camara-feed
// require("dronestream").listen(3001);
// server soket.io
var io = require('socket.io').listen(3002);
io.set('log level', 1);
// socket.io events
io.sockets.on('connection', function (socket) {
    var arDrone = require('ar-drone');
    var client = arDrone.createClient();
    // emit battery event
    setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },1000);
    // events
    socket.on('event', function (keys) {
        if (keys[48]){ client.takeoff(); }
        if (keys[57]){ client.land(); }
        if (keys[87]){ client.front(0.5); } else { client.front(0); }
        if (keys[83]){ client.back(0.5); } else { client.back(0); }
        if (keys[68]){ client.left(0.5); } else {client.left(0); }
        if (keys[65]){ client.right(0.5); } else {client.right(0); }
        if (keys[50]){ client.clockwise(0.5); } else { client.clockwise(0); }
        if (keys[52]){ client.counterClockwise(0.5); } else {client.counterClockwise(0); }
        if (keys[49]){ client.up(0.5); } else {client.up(0); }
        if (keys[51]){ client.down(0.5); } else {client.down(0); }
        if (keys[56]){ client.stop(); }
    });
});
// start http server
app.listen(3000);