var database = require('../database/consumer')
var connection = require('../connection/connect');


var mypage = function (req, res) {
    console.log("mypage접근");
    var accounts = database.get_accounts();

    connection.DeliverChannel(accounts[1].address, 0, function (result) {
        console.log("result : ", result)
        var response = {account : accounts[1].address, publisher : result._publisher, consumer : result._consumer, deposoit : result._deposit, duration : (result._duration/3600), createTime : result._CreateTime, ItemSerial : result._ItemSerial, proofOfEncryption : result._proofOfEncryption, deliveredItemHash : result._deliveredItemHash, tempBalanceProof : result._tempBalanceProof, encryptionKey : result._encryptionKey, state : result._state};

        res.render("mypage.ejs", {response : response});
    })
};

var completeChannel = function(rqe, res){
    console.log("completeChannel 접근");

    // 추후수정
    var encryptionKey = "8479768f48481eeb9c8304ce0a58481eeb9c8304ce0a5e3cb5e3cb58479768f4";
    var BP = database.getBP();
    console.log("bp", BP)
    var balance = BP.message;
    var v = BP.v;
    var r = BP.r;
    var s = BP.s;
    var messageHash = BP.messageHash;
    var accounts = database.get_accounts();
    console.log('balance', balance);
    console.log('v', v);
    console.log('r', r);
    console.log('s', s);
    console.log('messageHash', messageHash);
    // connection
    connection.completeChannel(accounts[0].address, 0, encryptionKey , messageHash, v, r, s, balance, function (result) {
        if(result==true){
            console.log("완료");
            res.render('register.ejs');
        }
    });
};

module.exports.mypage = mypage;
module.exports.completeChannel= completeChannel;
