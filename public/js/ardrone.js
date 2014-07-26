$(function () {

    function startArDRoneStream() {
        new NodecopterStream(document.getElementById("placeholder"), {port: 3001});
    }

    function startArDroneController(){
        var socket = io.connect('http://localhost:3002');
        socket.on('connect', function () {
            console.log("Connection Successful");

        });

        socket.on('event', function (data) {

            if(data.name=="battery"){
                $("#battery-indicator").css('width',data.value+'%');
            }
        });

        var keys   = {};
        var keyoff = {};

        $(document).keydown(function(event){
            keys[event.which] = true;
            socket.emit('event',keys);
        });

        $(document).keyup(function(event){
            delete keys[event.which];
        });

    }
    
    startArDRoneStream();
    startArDroneController();

});