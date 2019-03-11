var net = require('net');

var test2 = function (req,res) {
    var socket = net.connect({port:3000, host:'localhost'});

    console.log("asd")
    socket.on('connect', function () {
        console.log("connected to client");

        setInterval(function () {
            socket.write('asdasd');
        }, 1000);
    })

    socket.on('data', function (chunk) {
        console.log("recv : ", chunk);
    })

    socket.on('end', function () {
        console.log("disconnected");
    });

    socket.on('timeout', function () {
        console.log('connection timeout.')
    });
};

module.exports.test2 = test2;