var host = "localhost";
var port = "3000";
var socket;

var publisher = "0xec58179D7BD7CBEd4D1a76376A1c961C61548071";
var consumer = "0x22FA6ea1e3AfE958b06115291791d70f71377e64"
var content_name = "test";
var deposit = "100";
var id = 1001;

var previousTime;
var currentTime;
var initialTime;
var timeLate; // 시간 지연
// var state = 0; // 현재까지 진행한 거래 상태 저장
// var blockCount;
// var pricePerBlock;
// var rest;

// var requstAck = 0;  // 진행중인 요청 데이터
// var BP = 0;         // balanceProof

var index =0;
var jsonCurrentTime;
var jsonPreviousTime;
var jsonTimeDelay;
var splitSize;
var count;
var net = require('net');

var test = function (req, res) {
    console.log("/test접근");
    res.render("test.ejs");
}

var request = function (req, res){
    console.log("request 접근");

    var splitSize = req.body.splitSize;
    var count = req.body.count;

    var socket = net.connect({port:3000, host:'localhost'});

    socket.on('connect', function () {
        console.log("connected to client");

        var output = {splitSize : splitSize, from : consumer, deposit : deposit};

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

}

module.exports.test = test;
module.exports.request = request;