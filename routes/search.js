var database = require('../database/temp')
var connection = require('../connection/connect');

var search = function (req, res) {
    console.log("search접근");
    var accounts = database.get_accounts();


    connection.DeliverItem(accounts[0].address, 0, function (result) {
        console.log("result:", result);

        var response ={publisher : result._publisher, itemPrice : result._itemPrice, itemLocation : result._itemLocation, itemSize : result._itemSize, itemType : result._itemType, itemDuration : result._itemDuration, itemCreateTime : result._itemCreateTime, itemHash : result.__itemHash}

        res.render('search.ejs', {response : response});
    });
}

module.exports.search = search;