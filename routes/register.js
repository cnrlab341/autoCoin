var connection = require('../connection/connect');
var database = require('../database/temp')

var register = function (req, res) {
    console.log("register 접근");
    res.render('register.ejs', {signal:null});
}

var blockchain = function(req, res){
    console.log("blockchain 접근");

    var address = req.body.address;
    var itemprice = req.body.itemprice;
    var loc = req.body.loc;
    var size = req.body.size;
    var type = req.body.type;
    var duration = req.body.duration;
    var createTime = req.body.createTime;
    var hash = req.body.hash;


    connection.registerItem(address, itemprice, loc, size, type, duration, createTime, hash, function (result) {
        console.log("result : ", result);

        var r = result[result.length-1];
        console.log("r", r)
        res.render('register.ejs', {signal:"complete", result : r});
    })
}

module.exports.register = register;
module.exports.blockchain= blockchain;