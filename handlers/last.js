var connection = require('../connection/connect');
var database = require('../database/temp')

var last = function (params, callback) {
    var requestAck = database.getRequestAck();
    var blockCount = database.getBlockCount();
    var pricePerBlock = database.getPricePerBlock();
    var deposit = database.getDeposit();

    if (params[0].responseBlk == requestAck && params[0].responseBlk == blockCount-1){
        console.log("last 조건 만족");

        database.setEncryptionData(params[0].encryptionData);
        console.log("EncrytionData result length : " + database.getEncryptionData().length);

        var timeLate = database.getClientTimeLate();
        var previousTime = database.getClientPreviousTime();
        var balance = database.getBalance();
        var deposit = database.getDeposit();

        // 시간 지연 계산
        calTimeLate(timeLate, previousTime, params[0].newTime);

        var accounts = database.get_accounts();

        // block chain function exe
        console.log("proofOfEncrytion : " + database.getProofOfEncryption());
        console.log("encryptionData Length : ", database.getEncryptionData().length);

        var remainingData = database.getEncryptionData();
        var encryptionData = database.getProofOfEncryption();
        for(var i=0;i<remainingData.length;i++){
            encryptionData += remainingData[i];
            if(i == remainingData.length-1){
                // console.log("encryption Data : ", encryptionData);
                // address, proofOfEncryption, item, channelSerial, callback
                connection.saveReceivedContent(accounts[1].address, database.getProofOfEncryption(), encryptionData, 0, function (result) {
                    if(result ==true){
                        console.log("saveReceivedContent 완료");
                    }else{
                        console.log("saveReceivedContent 실패");
                    }
                    // BP가 deposit보다 작을때 (cause rest)
                    if(deposit>balance){
                        connection.createBP(accounts[1].address, deposit, function (BP) {
                            var output = {BP : BP};
                            database.setBalance(deposit);

                            callback(null, output);
                        })
                    }

                    var output = {BP : ""};

                    callback(null, output);
                })
            }
        }
    }
    else {
        console.log("last 조건 불만족");
        callback(error);
    }
};

// 시간 지연 계산
function calTimeLate(existingTime, previousTime, newTime) {
    var alpha = 0.2;
    var temp = newTime - previousTime;

    var newTimeLate = alpha * temp + (1-alpha) * existingTime;
    database.setClientTimeLate(newTimeLate);
    database.setClientPreviousTime(newTime);

    console.log("Consumer  " + "최종 timeLate : " + newTimeLate + "ms");
}

// 시간 지연 체크
function checkTimeLate(){

}


module.exports = last;