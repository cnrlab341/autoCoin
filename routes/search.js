var publisherDB = require('../database/publisher')
var consumerDB = require('../database/consumer')
var connection = require('../connection/connect');

var search = function (req, res) {
    console.log("search접근");
    var publishAccount = publisherDB.getAccounts();


    connection.DeliverItem(publishAccount[0].address, 0, function (result) {
        console.log("result:", result);

        var response ={ create : null, publisher : result._publisher, itemPrice : result._itemPrice, itemLocation : result._itemLocation, itemSize : result._itemSize, itemType : result._itemType, itemDuration : result._itemDuration, itemCreateTime : result._itemCreateTime, itemHash : result.__itemHash}

        res.render('search.ejs', {response : response});
    });
}

var buy = function (req, res){
    console.log("buy 접근");

    var consumerAccount = consumerDB.getAccounts();
    var deposit =  parseInt(req.body.depoit);
    consumerDB.setDeposit(deposit);
    console.log(typeof deposit);

    connection.createChannel(consumerAccount[0].address, deposit, 0, function (result) {
        console.log("result : ", result);

        var r = result[result.length-1];
        console.log("r :", r);

        var response = {create : 0};

        res.render('search.ejs', {response : "create"});

    });

}

module.exports.search = search;
module.exports.buy = buy;
