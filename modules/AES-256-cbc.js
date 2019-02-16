var publisherDB = require('../database/publisher');
var connect = require('../connection/connect');
var fs = require('fs');
var keyhex = publisherDB.getEncryptionKey(); //length 32 추후에 publisher에게 등록하게끔
var iv;
var blockSize = 16;

module.exports = {

    dataEncryption : function(path, callback) {
        fs.readFile(path, function (err, data) {
            var input = new Buffer(data);
            splitData(input, function (firstData, remainingData) {

                var proofOfEncryption = encryptAES(firstData);
                publisherDB.setProofOfEncryption(proofOfEncryption);

                var encryptionData = "";
                for(var i=0;i<remainingData.length;i++){
                    var temp = encryptAES(remainingData[i]);
                    publisherDB.setEncryptionData(temp);
                    encryptionData += temp;

                        if(i==remainingData.length-1){
                            (console.log("EncryptionData Length : ", publisherDB.getEncryptionData().length));

                            var last = proofOfEncryption + encryptionData;
                            last = connect.hasher(last);
                            console.log("hash : ", last);
                            callback(last);
                        }
                }
            })
        });
    },

    dataDecryption : function (proofOfEncryption, remainingEncryptionData, callback) {
         var result;
        decryptAES(proofOfEncryption, function (firsitData) {
            result = firsitData;
            for(var i=0; i<remainingEncryptionData.length;i++){
                decryptAES(remainingEncryptionData[i], function (remainingData) {
                    result +=remainingData;

                    if(i==remainingEncryptionData.length-1){
                        fs.writeFile('./outPut.mp4',result, 'base64', function (err, data) {
                            callback(true);
                        })
                    }
                })
            }
        })
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


function decryptAES(encoded, callback) {
    var combined = new Buffer(encoded, 'hex');

    key = new Buffer(keyhex, "hex");

    // Create iv
    var iv = new Buffer(16);

    combined.copy(iv, 0, 0, 16);
    edata = combined.slice(16).toString('binary');

    // Decipher encrypted data
    var decipher = require('crypto').createDecipheriv('aes-256-cbc', key, iv);

    // UPDATE: crypto changed in v0.10
    // https://github.com/joyent/node/wiki/Api-changes-between-v0.8-and-v0.10

    var nodev = process.version.match(/^v(\d+)\.(\d+)/);

    var decrypted, plaintext;
    if( nodev[1] === '0' && parseInt(nodev[2]) < 10) {
        decrypted = decipher.update(edata, 'binary') + decipher.final('binary');
        plaintext = new Buffer(decrypted, 'binary').toString('utf8');
    } else {
        plaintext = (decipher.update(edata, 'binary', 'utf8') + decipher.final('utf8'));
    }
    callback(plaintext);
}

function splitData(input, callback) {
    var firstData = input.toString('base64', 0, 12);

    var temp = input.toString('base64', 12, input.length);
    // console.log(remainingData)

    // // 데이터 원하는 byte크기로 자르기
    var remainingData = temp.match(new RegExp('.{1,' + 10000+ '}', 'g'));

    var blockCount = remainingData.length + 1;
    var pricePerBlock = publisherDB.getDeposit() / (blockCount-1); // 몫
    var rest = publisherDB.getDeposit() - (blockCount-1) * pricePerBlock;

    console.log('firstData : ' + firstData);
    console.log("blockCount : ", blockCount);
    console.log("pricePerBlock : ", pricePerBlock);
    console.log("rest : ", rest);

    publisherDB.setBlockCount(blockCount);
    publisherDB.setPricePerBlock(pricePerBlock);
    publisherDB.setRest(rest);

    callback(firstData, remainingData);
}