let fs = require("fs");
let personal = require('web3-eth-personal');
let Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const abi = fs.readFileSync(__dirname + '/autocoin.json');
const bytecode = fs.readFileSync(__dirname + '/AutoCoin.txt', 'utf8').toString();

const contract_address = "0x15F6cf73931095d7d5D271Da2D8Ffbb7ed77FEC6";

web3.eth.defaultAccount = "0xC1de081e01F1A341473E3F1c9Ff3962D0D6Bd9b2";
// coinbase : defaultAccount : from address ( contract를 배포할 address)

// autoCoin Setting
const autoCoin = new web3.eth.Contract(JSON.parse(abi));// abi (json)형식으로 가져와야한다.

// The transaction does not require a fee.
autoCoin.options.gasPrice = 0;
autoCoin.options.address = contract_address;            // contract 주소
// autoCoin.options.gasPrice = "";                      // 가스 price
// autoCoin.options.gas = "";                           // 가스 limit

module.exports = {
    create_account : function(password, callback){
        console.log('web3, create_account 접근');

        var newAccount = web3.eth.accounts.create(password);
        callback(newAccount.address, newAccount.privateKey);
    },

    // create SmartContract
    deploy : function(){
        autoCoin.deploy({
        data : bytecode,
        }).send({
            from : address,
            gas : 6721975
        }).then(function (newContractInstance) {
            console.log(newContractInstance.options.address);
            smartcontract_address = newContractInstance;
        })
    },

    registerItem : function (
        address,
        __itemPrice,
        __itemLoc,
        __itemSize,
        __itemType,
        __itemDuration,
        __itemCreateTime,
        __itemHash,
        callback) {
        console.log("/web3, registItem 접근");
        autoCoin.setProvider(web3.currentProvider);

        autoCoin.methods.registerItem(__itemPrice, __itemLoc, __itemSize, __itemType, __itemDuration, __itemCreateTime, __item16Byte).send({
            from : address,
            gas : 6721975
        }, function (err, result) {
            if (err) console.log(err);
            else
                console.log("registerItem_result : ", result);
            return callback(result);
        })
    }
}
 web3.eth.personal.newAccount("123");


// console.log(newAccount)
// autoCoin.deploy({
//     data : bytecode,
// }).send({
//     from : newAccount.address,
//     gas : 6721975
// }).then(function (newContractInstance) {
//     console.log(newContractInstance.options.address);
//     smartcontract_address = newContractInstance;
// })


// 개인키로 부터 wallet 생성
// var wallet1 = etherWallet.fromPrivateKey(Buffer.from('740b526ab7ebbe49735e446eb04ee01c954a9426b78acb76130d962ca5b3af1b', 'hex'));
// console.log('address1: ' + wallet1.getAddressString());
// console.log('private key1: ' + wallet1.getPrivateKeyString());
// console.log('public key1: ' + wallet1.getPublicKeyString());



// web3.util.sha3(data) 함수를 통해서 서명할 데이터의 hash값을 얻어 낸다.
// web3.eth.accounts.sign(hash, privatekey) 함수를 통해서 데이터를 서명한다.
// const messagetoSign = web3.utils.sha3('message');
//
// // web3.eth.accounts.sign()을 통해 v,r,s 값을 포함한 객체값을 전달받는다.
// var signatureData = web3.eth.accounts.sign(messagetoSign, wallet1.getPrivateKeyString());
//
// let signature = signatureData.signature;
// // r,s : ECDSA(타원 곡선형 전자서명 알고리즘)의 signature
// // 자세한 설명 https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v
// let v = signatureData.v;
// let r = signatureData.r;
// let s = signatureData.s;
//
// console.log("messagetoSign : " , messagetoSign);
// console.log("signature : ", signature);
// console.log("v : ", v );
// console.log("r : ", r );
// console.log("s : ", s );


