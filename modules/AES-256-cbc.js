var database = require('../database/temp');
var fs = require('fs');
var keyhex = "8479768f48481eeb9c8304ce0a58481eeb9c8304ce0a5e3cb5e3cb58479768f4"; //length 32 추후에 publisher에게 등록하게끔
var iv;

module.exports = {

    dataEncryption : function(path, callback) {
        fs.readFile(path, function (err, data) {
            var input = new Buffer(data);
            splitData(input, function (firstData, remainingData) {
                console.log('firstData : ' + firstData);

                var proofOfEncryption = encryptAES(firstData);
                database.setProofOfEncryption(proofOfEncryption);

                var encryptionData;
                for(var i=0;i<remainingData.length;i++){
                    encryptAES(remainingData[i]);
                        encryptionData +=result;

                        if(i==remainingData.length-1){
                            encryptAES(proofOfEncryption);
                                var last = result2 + encryptionData;
                                last = connect.hasher(last);
                                console.log("hash : ", last);
                                callback(last);
                            }
                    }
            })
        });
    }
};

function encryptAES(input) {
    try {
        // var iv = require('crypto').randomBytes(16);
        iv = require('crypto').randomBytes(16);
        // console.info('iv',iv);
        var data = new Buffer(input).toString('binary');
        // console.info('data',data);

        key = new Buffer(keyhex, "hex");
        //console.info(key);
        var cipher = require('crypto').createCipheriv('aes-256-cbc', key, iv);
        // UPDATE: crypto changed in v0.10

        // https://github.com/joyent/node/wiki/Api-changes-between-v0.8-and-v0.10

        var nodev = process.version.match(/^v(\d+)\.(\d+)/);

        var encrypted;

        if( nodev[1] === '0' && parseInt(nodev[2]) < 10) {
            encrypted = cipher.update(data, 'binary') + cipher.final('binary');
        } else {
            encrypted =  cipher.update(data, 'utf8', 'binary') +  cipher.final('binary');
        }

        var encoded = new Buffer(iv, 'binary').toString('hex') + new Buffer(encrypted, 'binary').toString('hex');

        return encoded;
    } catch (ex) {
        // handle error
        // most likely, entropy sources are drained
        console.error(ex);
        return ex;
    }
}

function splitData(input, callback) {
    var firstData = input.toString('base64', 0, 12);

    var temp = input.toString('base64', 12, input.length);
    // console.log(remainingData)

    // // 데이터 원하는 byte크기로 자르기
    var remainingData = temp.match(new RegExp('.{1,' + 10000+ '}', 'g'));

    callback(firstData, remainingData);
}