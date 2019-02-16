var connection = require('../connection/connect');
var consumerDB = require('../database/consumer')
var modulesTimeLate = require('../modules/calculateTimeLate');

var last = function (params, callback) {
    var consumerAccount = consumerDB.getAccounts();
    var requestAck = consumerDB.getRequestAck();
    var blockCount = consumerDB.getBlockCount();
    var pricePerBlock = consumerDB.getPricePerBlock();
    var deposit = consumerDB.getDeposit();
    var balance = consumerDB.getBalance();

    if (params[0].responseBlk == requestAck && params[0].responseBlk == blockCount-1){
        console.log("last 조건 만족");

        consumerDB.setEncryptionData(params[0].encryptionData);

        // 시간 지연 계산
        modulesTimeLate.setConsumerTimeLate(requestAck, consumerDB.getClientTimeLate(), consumerDB.getClientPreviousTime(), params[0].newTime);

        // block chain function exe
        var remainingData = consumerDB.getEncryptionData();
        var proofOfEncryption = consumerDB.getProofOfEncryption();
        console.log("proofOfEncrytion : " + proofOfEncryption);
        console.log("encryptionData Length : ", remainingData.length);

        var encryptionData = proofOfEncryption;
        for(var i=0;i<remainingData.length;i++){
            encryptionData += remainingData[i];
            if(i == remainingData.length-1){
                 connection.saveReceivedContent(consumerAccount[0].address, proofOfEncryption, encryptionData, 0, function (result) {
                    if(result ==true){
                        console.log("saveReceivedContent 완료");
                    }else{
                        console.log("saveReceivedContent 실패");
                    }
                    // BP가 deposit보다 작을때 (cause rest)
                    if(deposit>balance){
                        connection.createBP(consumerAccount[0].address, deposit, function (BP) {
                            var output = {BP : BP};
                            consumerDB.setBalance(deposit);

                            callback(null, output);
                        })
                    }

                    var output = {BP : undefined};

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

module.exports = last;