// server express
var arDrone = require('ar-drone'),
    express = require('express'),
    app     = express(),
	server  = require("http").createServer(app),
    io      = require('socket.io').listen(3002).set('log level', 1),
    dStream = require("dronestream");

// camara-feed
dStream.listen(3001);

var actions = {
    11: 'stop',
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

// socket.io events
io.sockets.on('connection', function (socket) {
    var client = arDrone.createClient();

    // emit battery event
    setInterval(function(){
        var batteryLevel = client.battery();
        socket.emit('event', { name: 'battery',value: batteryLevel});
    },1000);

    // events
    socket.on('event', function(keys){

        function stopDrone(client){
            client.after(250, function() {
                this[actions[11]]();
            });
        }

        for(var key in keys){
            if(key === "48" || key === "57"){
                client[actions[key]]();
                if(key === "48"){ client.calibrate(0); }
            } else {
                client[actions[key]](1);
                stopDrone(client);
            }
        }

    });
});

// start http server
app.listen(3000);