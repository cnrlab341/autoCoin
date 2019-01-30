var exec = require('child_process').exec;
var accounts = require('../database/temp.js');
var crypto = require('crypto');
var algorithm = 'aes-256-cbc';
var fs = require('fs');

function encrypt(buffer, password){
    let cipher = crypto.createCipher(algorithm,password)
    let crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
    return crypted;
}

function decrypt(buffer, password){
    let decipher = crypto.createDecipher(algorithm,password)
    let dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
    return dec;
}

function encryptAndHash(path, password, callback) {

    fs.readFile(path, function (err, data) {
        let input = new Buffer(data).toString('base64');
        let hw = encrypt(new Buffer(input, "utf8"), password)
        console.log(Buffer.byteLength(hw, 'utf8'))
        console.log(hw)

        let hash = crypto.createHash('sha512').update(hw).digest('base64');
        console.log("hash:",hash)

        callback(hash);

        // 추후에 client가 data를 받고 decrypt
        // result = decrypt(hw, password).toString('utf8');
        // console.log(result)
        // fs.writeFile('./output.mp4',result, 'base64', function (err, data) {
        //     console.log(data)
        // })

    });
}

var detail = function (params, callaback) {
    console.log("JSON-RPC detail 호출");
    console.log(params);

    console.log(params[0].file_path)
    console.log(params[0].price)

    // 추후 DB처리
    var address = "0xC1de081e01F1A341473E3F1c9Ff3962D0D6Bd9b2";

    exec('exiftool '+ params[0].file_path, function (err, stdout, stderr) {

        var test = stdout.split('\n');

        var temp = test[3].split(":");
        var File_Size = temp[1];

        temp = test[16].split(":");
        temp = temp[1]+temp[2]+temp[3]+temp[4]+temp[5]
        var Create_Date = temp;

        temp = test[18].split(":");
        temp = temp[1]+temp[2]+temp[3]
        var Duration = temp;

        console.log(File_Size)
        console.log(Create_Date);
        console.log(Duration);

        // 추후에 location 정보 수정
        var loc = 10234;

        // 추후에 lgoin cession 유지
        var address = accounts.get_accounts();

        encryptAndHash(params[0].file_path, address[0].address, function (result) {
            params = {File_Size : File_Size, Create_Date : Create_Date, Duration : Duration, Price: params[0].price, Loc : loc, address : address[0].address, hash : result};
            callaback(null, params);
        });
    })
};
module.exports = detail;