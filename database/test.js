
// model split : 1K
var model_1 = {
    'split' : 1,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 0,
    'test_BP' : ""
}

// model split : 5K
var model_5 = {
    'split' : 5,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 0,
    'test_BP' : ""
}

// model split : 10K
var model_10 = {
    'split' : 10,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 0,
    'test_BP' : ""
}

// model split : 15K
var model_15 = {
    'split' : 15,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 0,
    'test_BP' : ""
}

// model split : 20K
var model_20 = {
    'split' : 20,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 0,
    'test_BP' : ""
}


var test = new Array();
test.push(model_1);
test.push(model_5);
test.push(model_10);
test.push(model_15);
test.push(model_20);


var keyhex = "8479768f48481eeb9c8304ce0a58481eeb9c8304ce0a5e3cb5e3cb58479768f4"; //length 32

var blockSize = 16;


function encryptAES(input) {
    try {
        var iv = require('crypto').randomBytes(16);
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
    }
}

function decryptAES(encoded) {
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
    return plaintext;
}

function init(input, count, callback) {
    var first_data = input.toString('base64', 0, 12);
    // console.log(first_data.length) // 16, AAAAIGZ0eXBtcDQy
    // console.log(new Buffer(first_data))
    var last_data = input.toString('base64', 12, input.length);

    var temp = last_data.match(new RegExp('.{1,' + splitSize[count]+ '}', 'g'));
    console.log("=====" + splitSize[count] + "=====")
    test[count].test_blockCount = temp.length + 1;
    console.log("split length " + test[i].test_blockCount) // 4539

    var outPut = {first_data : first_data, last_data : temp};
    callback(outPut);
}

function encryption_for(count, first_data, last_data, callback) {
    var hw = new Array();

    for(var i=0;i<last_data.length;i++) {
        var temp =encryptAES(last_data[i]);
        hw.push(temp);
        test[count].test_encryptionData.push(temp);

        if(i==last_data.length-1){
            var proofOfEncryption = encryptAES(first_data);
            test[count].test_proofOfEncryption = proofOfEncryption
            console.log("proofOfEncryption : ", test[count].test_proofOfEncryption);

            var output = {hw : hw, proofOfEncryption : proofOfEncryption};

            // console.log(proofOfEncryption.length)
            console.log("encryption 1per size" + test[count].test_encryptionData[0].length)
            console.log("encryption  length" + test[count].test_encryptionData.length)
            callback(output);
        }
    }
}


var splitSize = [1024, 5120, 10240, 15360, 20480];
for (var i =0; i<5;i++){

    var input = new Buffer(52428800);

    init(input, i, function (result) {
        encryption_for(i, result.first_data, result.last_data, function (result2) { // var output = {hw : hw, proofOfEncryption : proofOfEncryption};
            var result= decryptAES(result2.proofOfEncryption);
            for (var i=0;i<result2.hw.length;i++){
                var temp  =  decryptAES(result2.hw[i]);
                result += temp;
                // console.log(result);
                if(i== result2.hw.length-1){

                    // console.log("result : ", result.length)
                }
            };
        })
    })
}
