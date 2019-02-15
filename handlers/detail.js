var accounts = require('../database/temp.js');
var connect = require('../connection/connect');
var moduleDetail = require('../modules/detail');
var moduleAES = require('../modules/AES-256-cbc');

var detail = function (params, callaback) {
    console.log("JSON-RPC detail 호출");
    console.log(params);

    console.log(params[0].file_path)
    console.log(params[0].price)

    // 추후 DB처리
    var address = accounts.get_accounts();

    moduleDetail.exeiftoolAPI(params[0].file_path, function (result) { //{File_Size : File_Size, Create_Date : Create_Date, Duration : Duration, Price: params[0].price, Loc : loc}
        result.address = address[0].address;
        callaback(null, result);
    })
        encryptAndHash(params[0].file_path, function (result) {
            params = {File_Size : File_Size, Create_Date : Create_Date, Duration : Duration, Price: params[0].price, Loc : loc, address : address[0].address, hash : result};
        });
};
module.exports = detail;