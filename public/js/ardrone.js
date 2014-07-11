$(function () {
    function startArDRoneStream() {
        new NodecopterStream(document.getElementById("placeholder"), {port: 3001});
    }

    function startCameraFeed() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        var constraints = {audio: false, video: true};
        var video = document.querySelector("video");

        function successCallback(stream) {
            window.stream = stream; // stream available to console
            if (window.URL) {
                video.src = window.URL.createObjectURL(stream);
            } else {
                video.src = stream;
            }
            video.play();
        }

        function errorCallback(error){
            console.log("navigator.getUserMedia error: ", error);
        }

        navigator.getUserMedia(constraints, successCallback, errorCallback);

    }
    function startArDroneController(){
        var socket = io.connect('http://localhost:3002');
        socket.on('connect', function () { // TIP: you can avoid listening on `connect` and listen on events directly too!
            console.log("Connection Successful");

        });

        socket.on('event', function (data) {

            if(data.name=="battery"){
                $("#battery-indicator").css('width',data.value+'%');
                $("#battery-value").html(data.value+'%');
            }
        });

        $("#takeoff").click(function(){
            console.log("Asking Server to send takeoff command to Ar Drone");
            socket.emit('event',{name:"takeoff"});
        });
        $("#spin").click(function(){
            console.log("Asking Server to send spin command to Ar Drone");
            socket.emit('event',{name:"spin"});
        });
        $("#stop").click(function(){
            console.log("Asking Server to send stop command to Ar Drone");
            socket.emit('event',{name:"stop"});
        });
        $("#land").click(function(){
            console.log("Asking Server to send land command to Ar Drone");
            socket.emit('event',{name:"land"});
        });

    }
    startArDRoneStream();
    startCameraFeed();
    startArDroneController();

});