var state = 0; // 현재까지 진행한 거래 상태 저장
var connection = require('../connection/connect');
var database = require('../database/temp')

var calState = function (params, callback) {
    // console.log("JSON-RPC calState 호출");
    // console.dir("request params : " +  params[0]); //    {responseBlk : result.responseBlk, encryptionData: result.encryptionData, id: result.id, newTime : Number(currentTime)}

     var requestAck = database.getRequestAck();
     var blockCount = database.getBlockCount();
     var pricePerBlock = database.getPricePerBlock();

    if(requestAck == params[0].responseBlk) {
        // 정상 처리되고 있을때
        if(requestAck==0){
            database.setProofOfEncryption(params[0].encryptionData);

        }else {
            database.setEncryptionData(params[0].encryptionData);

            if(requestAck == blockCount-1){
                // decreption하고 hash값 올리고 proofOfEncrytion 등록
            }
        }

        // requstAck, balance, timeLate, get Balance, timeLate
        var balance = database.getBalance();
        var timeLate = database.getClientTimeLate();
        var previousTime = database.getClientPreviousTime();

        var currentId = params[0].id;
        requestAck +=1;
        balance += pricePerBlock * requestAck;

        console.log("reqAck   : ", requestAck);
        console.log( requestAck + " BP    : " + balance);

        // 시간 지연 계산
        calTimeLate(timeLate, previousTime, params[0].newTime);


        // rest 처리
        var deposit = database.getDeposit();
        var accounts = database.get_accounts();

        if(balance > deposit){
            //balanceproof 생성
            connection.createBP(accounts[1].address, deposit, function (BP) {
                var output = {requestAck : requestAck, BP : BP, id : currentId +1};

                // set requestAck, balance, timeLate
                database.setCalState(requestAck, balance, timeLate);
                // console.log("output : ", output)
                callback(null, output);
            })
        }
        else if(balance <= deposit){
            //balanceproof 생성
            connection.createBP(accounts[1].address, balance, function (BP) {
                var output = {requestAck : requestAck, BP : BP, id : currentId +1};

                // set requestAck, balance, timeLate
                database.setCalState(requestAck, balance, timeLate);
                // console.log("output : ", output)
                callback(null, output);
            })
        }
    }
    else if(requestAck > params[0].responseBlk){
        // comsumer는 전달했지만 publisher가 받지 못해 이전것을 다시 요청했을 때
        console.log("지연발생");
        callaback(error);
    }
};

// 시간 지연 계산
var count = 2;
function calTimeLate(existingTime, previousTime, newTime) {
    var alpha = 0.2;
    var temp = newTime - previousTime;

    var newTimeLate = alpha * temp + (1-alpha) * existingTime;
    database.setClientTimeLate(newTimeLate);
    database.setClientPreviousTime(newTime);

    console.log("Consumer  " + count + "번째 timeLate : " + newTimeLate + "ms");
    count ++;
}

// 시간 지연 체크
function checkTimeLate(){

}

module.exports = calState;