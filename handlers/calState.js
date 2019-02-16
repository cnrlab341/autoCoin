var connection = require('../connection/connect');
var consumerDB = require('../database/consumer')
var modulesTimeLate = require('../modules/calculateTimeLate');

var calState = function (params, callback) {
    // console.log("JSON-RPC calState 호출");
    // console.dir("request params : " +  params[0]);
    // {responseBlk : result.responseBlk, encryptionData: result.encryptionData, id: result.id, newTime : Number(currentTime)}

    var consumerAccount = consumerDB.getAccounts();
    var requestAck = consumerDB.getRequestAck();
    var blockCount = consumerDB.getBlockCount();
    var pricePerBlock = consumerDB.getPricePerBlock();
    var deposit = consumerDB.getDeposit();

    // 정상 처리되고 있을때
    if(requestAck == params[0].responseBlk) {

        if(params[0].responseBlk==0){
            consumerDB.setProofOfEncryption(params[0].encryptionData);
        }else {
            consumerDB.setEncryptionData(params[0].encryptionData);
        }
        requestAck +=1;
        var currentId = params[0].id;

        // 시간 지연 계산
        modulesTimeLate.setConsumerTimeLate(requestAck, consumerDB.getClientTimeLate(), consumerDB.getClientPreviousTime(), params[0].newTime);

        // balance를 추가했는데 deposit을 초과하면 deposit balance 까지만 준다
        var balance;
        var temp = pricePerBlock * requestAck;
        if(temp > deposit){
            balance = deposit;

            //balanceproof 생성
            connection.createBP(consumerAccount[0].address, deposit, function (BP) {
                var output = {requestAck : requestAck, BP : BP, id : currentId +1};

                consumerDB.setRequestAck(requestAck);
                consumerDB.setBalance(balance);
                callback(null, output);

                console.log("reqAck   : ", requestAck);
                console.log( requestAck + " BP    : " + deposit);
            })
        }
        else if(temp <= deposit){
            balance = pricePerBlock * requestAck;

            //balanceproof 생성
            connection.createBP(consumerAccount[0].address, balance, function (BP) {
                var output = {requestAck : requestAck, BP : BP, id : currentId +1};

                consumerDB.setRequestAck(requestAck);
                consumerDB.setBalance(balance);
                callback(null, output);

                console.log("reqAck   : ", requestAck);
                console.log( requestAck + " BP    : " + balance);
            })
        }
    }
    else if(requestAck > params[0].responseBlk){
        // comsumer는 전달했지만 publisher가 받지 못해 이전것을 다시 요청했을 때
        console.log("지연발생");
        callaback(error);
    }
};


module.exports = calState;