// server express
var express = require('express'),
	app     = express(),
	server  = require("http").createServer(app);

var controlKeys = {87:0,83:0,68:0,65:0,50:0,52:0,49:0,51:0,56:0};

var actions = {
    48: 'takeoff',
    57: 'land',
    38: 'front',
    40: 'back',
    37: 'left',
    39: 'right',
    50: 'clockwise',
    52: 'counterClockwise',
    49: 'up',
    51: 'down',
};

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

    // emit battery event
    setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },1000);

    // events
    socket.on('event', function(control){

        for(var key in control.keys){
            // debugger;
            if(key === "48" || key === "57"){
                client[actions[key]]();
            } else {
                if(control.state == 'on'){
                    client[actions[key]](1);
                } else if(control.state == 'off'){
                    client[actions[key]](0);
                }
            }
        }
    });
});

// start http server
app.listen(3000);