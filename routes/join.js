var web3_connection = require('../connection/connect.js');
var accounts = require('../database/consumer.js');
var join = function (req, res) {
    console.log("join 접근");
    res.render('join.ejs', {signal :""});
}


var add = function (req, res){
    console.log("join/add 접근");

    var name = req.body.name;
    var password = req.body.Password;

    web3_connection.create_account(password, function (address) {
        console.log("create_account address : ", address );

        // 계정 추가
        accounts.set_accounts(name, address, password);

        res.render('join.ejs',  {signal : "add", address : address});
    });
}
module.exports.join = join;
module.exports.add = add;

