var database = require('../database/temp')
var connection = require('../connection/connect');


var mypage = function (req, res) {
    console.log("mypage접근")
    var accounts = database.get_accounts();

    connection.DeliverChannel(accounts[1].address, 0, function (result) {
        console.log("result : ", result)
        var response = {account : accounts[1].address, publisher : result._publisher, consumer : result._consumer, deposoit : result._deposit, duration : (result._duration/3600), createTime : result._CreateTime, ItemSerial : result._ItemSerial, proofOfEncryption : result._proofOfEncryption, deliveredItemHash : result._deliveredItemHash, tempBalanceProof : result._tempBalanceProof, encryptionKey : result._encryptionKey, state : result._state};

        res.render("mypage.ejs", {response : response});
    })
}

module.exports.mypage = mypage;

