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
var splitSize;
var count;
var net = require('net');
var connection = require('../connection/connect');
var consumerDB = require('../database/consumer.js');
var modulesTimeLate = require('../modules/calculateTimeLate');
var csvFile = require('../database/csvFile');
var fs = require('fs');

var test = function (req, res) {
    console.log("/test접근");
    res.render("test.ejs");
}

var request = function (req, res){
    console.log("request 접근");

    var splitSize = req.body.splitSize;
    count = req.body.count;

    var socket = net.connect({port:3000, host:'localhost'});

    socket.setEncoding('utf8');

    socket.on('connect', function () {
        console.log("connected to client");

        var output = {splitSize : splitSize, from : consumer, deposit : deposit};
        var data = {actionType : "test_setting", submitData : output};
        var buf = Buffer.from(JSON.stringify(data));

        initialTime = Number(Date.now());

        socket.write(buf);
    })

    socket.on('data', function (data) {
        currentTime = Number(Date.now());

        var temp = JSON.parse(data.toString());

        var actionType = temp.actionType;
        var submitData = temp.submitData;

        console.log("actionType : ", actionType);
        console.log("submitData : ", submitData);

        if(actionType == 'test_setting'){
            console.log("test_setting 접근");

            consumerDB.clear();

            console.log("blockCount : ", submitData.blockCount);
            console.log("pricePerBlock : ", submitData.pricePerBlock);
            console.log("rest: ", submitData.rest);

            consumerDB.setInitialdata(submitData.blockCount, submitData.pricePerBlock, submitData.rest);

            modulesTimeLate.setConsumerTimeLate(0, consumerDB.getClientTimeLate(), initialTime, currentTime);

            var timeDelay = currentTime - initialTime;
            csvFile.setConsumerInitial(submitData.blockCount, timeDelay);

            var output = {requestAck : 0, BP : 0, from : consumer};
            var data = {actionType : "test_submit", submitData : output};
            var buf = Buffer.from(JSON.stringify(data));

            previousTime = Number(Date.now());

            socket.write(buf);
        }
        else if(actionType == 'test_submit'){

            //  var message = {responseBlk : result.responseBlk, encryptionData: result.encryptionData, id: result.id, previousTime : previousTime, newTime : Number(currentTime), jsonTimeDelay : jsonTimeDelay};
            var consumerAccount = consumerDB.getAccounts();
            var requestAck = consumerDB.getRequestAck();
            var blockCount = consumerDB.getBlockCount();
            var pricePerBlock = consumerDB.getPricePerBlock();
            var deposit = consumerDB.getDeposit();

            // 정상 처리되고 있을때
            if(requestAck == submitData.responseBlk) {

                if(submitData.responseBlk==0){
                    consumerDB.setProofOfEncryption(submitData.encryptionData);
                }else {
                    consumerDB.setEncryptionData(submitData.encryptionData);
                }
                requestAck +=1;
                // test
                var consumerTimeDelay = currentTime - previousTime;
                console.log(requestAck + "test consumer TimeLate : ", consumerTimeDelay);

                // 시간 지연 계산
                modulesTimeLate.setConsumerTimeLate(requestAck, consumerDB.getClientTimeLate(), consumerDB.getClientPreviousTime(), currentTime);

                // balance를 추가했는데 deposit을 초과하면 deposit balance 까지만 준다
                var balance;
                var temp = pricePerBlock * requestAck;
                if(temp > deposit){
                    balance = deposit;

                    //balanceproof 생성   `
                    var BPPreviousTime = Number(Date.now());
                    connection.createBP(consumerAccount[0].address, deposit, function (BP) {
                        var BPNewTime = Number(Date.now());

                        var BPTimeDelay = BPNewTime - BPPreviousTime;
                        csvFile.setConsumerDelay(requestAck, consumerTimeDelay, BPTimeDelay);

                        var output = {requestAck : requestAck, BP : BP, from : consumer};

                        consumerDB.setRequestAck(requestAck);
                        consumerDB.setBalance(balance);
                        console.log("reqAck   : ", requestAck);
                        console.log( requestAck + " BP    : " + deposit);

                        var data = {actionType : "test_submit", submitData : output};
                        var buf = Buffer.from(JSON.stringify(data));

                        previousTime = Number(Date.now());

                        socket.write(buf);
                    })
                }
                else if(temp <= deposit){
                    balance = pricePerBlock * requestAck;
                    //balanceproof 생성
                    var BPPreviousTime = Number(Date.now());
                    connection.createBP(consumerAccount[0].address, balance, function (BP) {
                        var BPNewTime = Number(Date.now());

                        var BPTimeDelay = BPNewTime - BPPreviousTime;

                        csvFile.setConsumerDelay(requestAck, consumerTimeDelay, BPTimeDelay);

                        var output = {requestAck : requestAck, BP : BP, from : consumer};

                        consumerDB.setRequestAck(requestAck);
                        consumerDB.setBalance(balance);
                        console.log("reqAck   : ", requestAck);
                        console.log( requestAck + " BP    : " + deposit);

                        var data = {actionType : "test_submit", submitData : output};
                        var buf = Buffer.from(JSON.stringify(data));

                        previousTime = Number(Date.now());

                        socket.write(buf);
                    })
                }
            }
        }
        else if(actionType == 'test_last') {
            console.log("test_last접근");

            var consumerCsvFile = csvFile.getConsumerCsvFile();
            var _count = count;

            var output = {};

            var filePath = './' + index  + '요청 consumerTimeDelay.csv';
            fs.writeFile(filePath, consumerCsvFile, 'utf8', function (err, result) {
                if (err){
                    console.log("File err : ", err)
                } else{
                    console.log("File result :", result);
                    csvFile.clearConsumerCsvFile();

                    if(index == _count-1){
                        console.log("완료");
                    }else{
                        console.log("반복횟수 : " + (_count-1) - index + "남음");
                        index ++;

                        initialTime = Number(Date.now());
                        timeLate = 0;

                        var output = {splitSize : splitSize, from : consumer, deposit : deposit};
                        var data = {actionType : "test_setting", submitData : output};
                        var buf = Buffer.from(JSON.stringify(data));
                        socket.write(buf);
                    }

                }
            });
        }
    });

    socket.on('end', function () {
        console.log("disconnected");
    });

    socket.on('timeout', function () {
        console.log('connection timeout.')
    });

}

module.exports.test = test;
module.exports.request = request;