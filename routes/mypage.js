var consumerDB = require('../database/consumer');
var publisherDB = require('../database/publisher');
var connection = require('../connection/connect');
var modulesAES = require('../modules/AES-256-cbc');

var mypage = function (req, res) {
    console.log("mypage접근");
    var consumerAddress = consumerDB.getAccounts();

    connection.DeliverChannel(consumerAddress[0].address, 0, function (result) {
        console.log("result : ", result)
        var response = {account : consumerAddress[0].address, publisher : result._publisher, consumer : result._consumer, deposoit : result._deposit, duration : (result._duration/3600), createTime : result._CreateTime, ItemSerial : result._ItemSerial, proofOfEncryption : result._proofOfEncryption, deliveredItemHash : result._deliveredItemHash, tempBalanceProof : result._tempBalanceProof, encryptionKey : result._encryptionKey, state : result._state};

        res.render("mypage.ejs", {response : response});
    })
};

var completeChannel = function(rqe, res){
    console.log("completeChannel 접근");

    // 추후수정
    var encryptionKey = publisherDB.getEncryptionKey();
    var BP = publisherDB.getBP();
    console.log("bp", BP)

    var publisherAccount = publisherDB.getAccounts();
    var balance = Number(BP.message);
    var v = BP.v;
    var r = BP.r;
    var s = BP.s;
    var messageHash = BP.messageHash;

    console.log('balance', typeof balance);
    console.log('v', v);
    console.log('r', r);
    console.log('s', s);
    console.log('messageHash', messageHash);

    // connection
    connection.completeChannel(publisherAccount[0].address, 0, encryptionKey , messageHash, v, r, s, balance, function (result) {
        if(result==true){
            console.log("등록 : 완료");
            connection.DeliverChannel(consumerAddress[0].address, 0, function (result) {
                console.log("result : ", result)
                var response = {account : consumerAddress[0].address, publisher : result._publisher, consumer : result._consumer, deposoit : result._deposit, duration : (result._duration/3600), createTime : result._CreateTime, ItemSerial : result._ItemSerial, proofOfEncryption : result._proofOfEncryption, deliveredItemHash : result._deliveredItemHash, tempBalanceProof : result._tempBalanceProof, encryptionKey : result._encryptionKey, state : result._state};

                res.render("mypage.ejs", {response : response});
            })
        }
    });
};

var decryptionContent = function(req, res){
    console.log("decryptionContent접근");

    var proofOfEncryption = consumerDB.getProofOfEncryption();
    var encryptionData = consumerDB.getEncryptionData();
    var consumerAddress = consumerDB.getAccounts();

    modulesAES.dataDecryption(proofOfEncryption, encryptionData, function (result) {
        if(result ==true){
            console.log("쓰기 완료");
            connection.DeliverChannel(consumerAddress[0].address, 0, function (result) {
                console.log("result : ", result)
                var response = {account : consumerAddress[0].address, publisher : result._publisher, consumer : result._consumer, deposoit : result._deposit, duration : (result._duration/3600), createTime : result._CreateTime, ItemSerial : result._ItemSerial, proofOfEncryption : result._proofOfEncryption, deliveredItemHash : result._deliveredItemHash, tempBalanceProof : result._tempBalanceProof, encryptionKey : result._encryptionKey, state : result._state};

                res.render("mypage.ejs", {response : response});
            })
        }
    })
}

module.exports.mypage = mypage;
module.exports.completeChannel= completeChannel;
module.exports.decryptionContent = decryptionContent;
