var publisherDB = require('../database/publisher.js');
var connect = require('../connection/connect');
var moduleDetail = require('../modules/detail');
var moduleAES = require('../modules/AES-256-cbc');

var detail = function (params, callaback) {
    console.log("JSON-RPC detail 호출");
    console.log(params);

    console.log(params[0].file_path)
    console.log(params[0].price)
    publisherDB.setDeposit(params[0].price);

    var publisherAddress = publisherDB.getAccounts();

    moduleDetail.exeiftoolAPI(params[0].file_path, function (result) { //{File_Size : File_Size, Create_Date : Create_Date, Duration : Duration, Price: params[0].price, Loc : loc}
        result.address = publisherAddress[0].address;
        result.Price = params[0].price;

        moduleAES.dataEncryption(params[0].file_path, function (Hash) {
            result.hash = Hash;
            callaback(null, result);

        })
    })
};
module.exports = detail;