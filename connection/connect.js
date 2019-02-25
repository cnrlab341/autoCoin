let fs = require("fs");
let Web3 = require('web3');
// import {Shh} from 'web3-shh';
// let Shh = require('web3-shh')
// const shh = new Shh('http://localhost:8545');

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const abi = fs.readFileSync(__dirname + '/autocoin.json');
const bytecode = fs.readFileSync(__dirname + '/AutoCoin.txt', 'utf8').toString();

var contract_address = "0x65275e7e40d123563de2b6658c701e9bee3bc5c2";
// coinbase : defaultAccount : from address ( contract를 배포할 address)

// autoCoin Setting
const autoCoin = new web3.eth.Contract(JSON.parse(abi));// abi (json)형식으로 가져와야한다.

// The transaction does not require a fee.
autoCoin.options.gasPrice = 0;
autoCoin.options.address = contract_address;            // contract 주소
// autoCoin.options.gasPrice = "";                      // 가스 price
// autoCoin.options.gas = "";                           // 가스 limit

module.exports = {

    hasher : function(data){
        console.log('hasher 접근');
        let messagetoSign = web3.utils.sha3(data);
        console.log(messagetoSign);

        return messagetoSign;
    },

    create_account : function(password, callback){
        console.log('web3, create_account 접근');

        web3.eth.personal.newAccount(password, function (err, result) {
            console.log(result)
            callback(result);
        })
    },

    // create SmartContract
    deploy : function(address, password){
        unlock_account(address, password)
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
        console.log('web3, registerItem 접근');
        autoCoin.setProvider(web3.currentProvider);
        var transfer = autoCoin.methods.registerItem(parseInt(__itemPrice), __itemLoc, __itemSize, __itemType, parseInt(__itemDuration), parseInt(__itemCreateTime), __itemHash);
        var encodedABI = transfer.encodeABI();

        var tx = {
            from : address,
            to : contract_address,
            gas : 6721975,
            data : encodedABI
        };

        web3.eth.accounts.signTransaction(tx, "0x13ba66f8bc43c7851249e742bd92ccc495b6aa75a6636fbc6e77176a5fdd3dfe").then(signed => {
            var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
            tran.on('confirmation', (confirmationNumber, receipt) => {
                console.log('confirmation: ' + confirmationNumber);
            });

            tran.on('transactionHash', hash => {
                console.log('hash');
                console.log(hash);
            });

            tran.on('receipt', receipt => {
                console.log('reciept');
                console.log(receipt);
                deliverOwnItem(address, function (result) {
                    callback(result);
                })
            });
        });
    },

    DeliverItem : function (address, __itemSerial, callback) {
        console.log('web3, DeliverItem 접근');
        autoCoin.setProvider(web3.currentProvider);

        autoCoin.methods.deliverItem(__itemSerial).call({
            from : address
        }, function (err, result) {
            if(err) console.log(err);
            else {
                console.log('APP : ', result)
                callback(result)
            }
        })
    },

    createChannel : function (address, __deposit, __itemSerial, callback) {
        console.log("web3, createChannel 접근");
        console.log(__deposit);
        console.log(address)
        console.log(__itemSerial)
        autoCoin.setProvider(web3.currentProvider);

        var transfer = autoCoin.methods.createChannel(__deposit, __itemSerial);
        var encodedABI = transfer.encodeABI();

        var tx = {
            from: address,
            to: contract_address,
            gas: 6721975,
            data: encodedABI
        };

        web3.eth.accounts.signTransaction(tx, "0xae950f323a3155496625b2936f84750513488cd85e0ecc1b887dcd2f35999e84").then(signed => {
            var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

            tran.catch(function (error) {
                console.log(error)
            })
            tran.on('confirmation', (confirmationNumber, receipt) => {
                console.log('confirmation: ' + confirmationNumber);
            });

            tran.on('transactionHash', hash => {
                console.log('hash');
                console.log(hash);
            });

            tran.on('receipt', receipt => {
                console.log('reciept');
                console.log(receipt);
                deliverOwnChannel(address, function (result) {
                    callback(result);
                })
            });
        });
    },

    DeliverChannel : function (address, __channelSerial, callback) {
        console.log('web3, DeliverChannel 접근');
        autoCoin.setProvider(web3.currentProvider);

        autoCoin.methods.DeliverChannel(__channelSerial).call({
            from : address
        }, function (err, result) {
            if(err) {
                console.log(err);
                callback(error)
            }
            else {
                console.log('APP : ', result)
                callback(result)
            }
        })
    },

    createBP : function(address, balance, callback) {
        // console.log("createBP접근");
        // console.log(address, balance)
        var balanceString = balance.toString();

        var BP = web3.eth.accounts.sign(balanceString, "0xae950f323a3155496625b2936f84750513488cd85e0ecc1b887dcd2f35999e84");
        callback(BP);
    },

    saveReceivedContent : function (address, proofOfEncryption, item, channelSerial, callback) {
        console.log("web3//saveReceivedContent 접근");

        autoCoin.setProvider(web3.currentProvider);

        var itemHash = web3.utils.sha3(item);
        console.log("hash : ", itemHash)
        var transfer = autoCoin.methods.saveReceivedContent(proofOfEncryption, itemHash, channelSerial);
        var encodedABI = transfer.encodeABI();

        var tx = {
            from: address,
            to: contract_address,
            gas: 6721975,
            data: encodedABI
        };

        web3.eth.accounts.signTransaction(tx, "0xae950f323a3155496625b2936f84750513488cd85e0ecc1b887dcd2f35999e84").then(signed => {
            var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

            tran.catch(function (error) {
                console.log(error)
                callback(error)
            })
            tran.on('confirmation', (confirmationNumber, receipt) => {
                console.log('confirmation: ' + confirmationNumber);
            });

            tran.on('transactionHash', hash => {
                // console.log('hash');
                console.log(hash);
            });

            tran.on('receipt', receipt => {
                // console.log('reciept');
                console.log(receipt);
                callback(true);
            });
        });
    },

    completeChannel : function (address, channelSerial, encryptionKey, BP, v, r, s, balance, callback) {
        console.log("comleteChannel 접근");
        autoCoin.setProvider(web3.currentProvider);


        var transfer = autoCoin.methods.completeChannel(channelSerial, encryptionKey, BP, v, r, s, balance);
        var encodedABI = transfer.encodeABI();

        var tx = {
            from: address,
            to: contract_address,
            gas: 6721975,
            data: encodedABI
        };

        web3.eth.accounts.signTransaction(tx, "0x13ba66f8bc43c7851249e742bd92ccc495b6aa75a6636fbc6e77176a5fdd3dfe").then(signed => {
            var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

            tran.catch(function (error) {
                console.log(error)
                callback(error)
            })
            tran.on('confirmation', (confirmationNumber, receipt) => {
                console.log('confirmation: ' + confirmationNumber);
            });

            tran.on('transactionHash', hash => {
                console.log('hash');
                console.log(hash);
            });

            tran.on('receipt', receipt => {
                console.log('reciept');
                console.log(receipt);
                callback(true);
            });
        });
    }
}

// deploy contract address
//
// var transfer = autoCoin.deploy({
//     data : "0x" + bytecode,
// });
//
// var encodedABI = transfer.encodeABI();
//
// var tx = {
//     from: '0x22FA6ea1e3AfE958b06115291791d70f71377e64',
//     gas: 6721975,
//     data: encodedABI
// };
//
// web3.eth.accounts.signTransaction(tx, "0xae950f323a3155496625b2936f84750513488cd85e0ecc1b887dcd2f35999e84").then(signed => {
//     var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
//     // console.log("tran : ", tran.)
//     tran.catch(function (error) {
//         console.log(error)
//     })
//     //
//     tran.on('receipt', receipt => {
//         console.log('contractAddress : ' + receipt.contractAddress);
//     });
// });

// 실행하시오!!
// autoCoin.deploy({
//     data : bytecode,
// }).send({
//     from : "0x5b7C0779F2241bdf429803F0aB63F6948B5aD095",
//     gas : 6721975
// }).then(function (newContractInstance) {
//     console.log(newContractInstance.options.address);
//     contract_address = newContractInstance;
// })
// 100토큰 전달
// autoCoin.methods.transfer("0x22FA6ea1e3AfE958b06115291791d70f71377e64", 100).send({
//     from: "0x5b7C0779F2241bdf429803F0aB63F6948B5aD095",
//     gas: 6721975
// },function (err, result) {
//     if(err) console.log('error', err)
//     else{
//         console.log("destory",result);
//     }
// });
// autoCoin.methods.balanceOf("0x22FA6ea1e3AfE958b06115291791d70f71377e64").call({
//     from : "0x22FA6ea1e3AfE958b06115291791d70f71377e64"
// }, function (err, result) {
//     if(err) console.log(err);
//     else {
//         console.log('APP : ', result)
//     }
// });


function unlock_account(account, password) {
    console.log('web3, unlock_account 접근');

    web3.eth.personal.unlockAccount(account, password, 600, function(err, result) {
        if (err) {
            console.log('비밀번호가 틀렸습니다 !');
        } else {
            console.log('Account Unlock 성공 !');
        }
    });
}

function deliverOwnItem(address, callback) {
    console.log("deliverOwnItem 접근")
    autoCoin.setProvider(web3.currentProvider);
    autoCoin.methods.deliverOwnItem().call({
        from : address
    }, function (err, result) {
        if(err) console.log(err);
        else {
            console.log('APP : ', result)
            callback(result)
        }
    })
}

function deliverOwnChannel(address, callback) {
    console.log("deliverOwnChannel 접근")
    autoCoin.setProvider(web3.currentProvider);
    autoCoin.methods.deliverOwnChannel().call({
        from : address
    }, function (err, result) {
        if(err) console.log(err);
        else {
            console.log('APP : ', result)
            callback(result)
        }
    })
}






// { address: '0xB5F452Fd25E06f50d75c93C5967caAafB3A4dd56',
//     privateKey:
//     '0x706524b69997102fe4f505f8dae20de87a50f8bc0ada66d10dcda25c781be591',

// var msg = "100"
// // var temp = "\x19Ethereum Signed Message:\n" + msg.length + msg;
// console.log(web3.utils.sha3(msg))
// var signatureData = web3.eth.accounts.sign(msg, "0x706524b69997102fe4f505f8dae20de87a50f8bc0ada66d10dcda25c781be591");
// console.log(signatureData)
// console.log(web3.eth.accounts.recover("0xba463f38d2d1b6be660b783eceb51b835e336e7e2844402930bc83b58866cf56", "0x1c", "0x8e537f1fdfa2b42ffe6d6670b1b378541f41a99f2633cfe4220174cedc863cd4", "0x5454798c684bc1acaa8582f81483e73b49e212de7029718bbefc9976dd72b290"))
// console.log(web3.eth.accounts.privateKeyToAccount("b99569fdff463634cfbef9606415139f7eab3a75aa751c26def391fcfe94fce2"))
// var account = "0x5b7C0779F2241bdf429803F0aB63F6948B5aD095";
// var sig = web3.eth.personal.sign(msg, account, )
// var r = sig.substr(0,66)
// var s = "0x" + sig.substr(66,64)
// var v = 28


// unlock_account(address, "1234");
//
// autoCoin.methods.registerItem(100, "123", "123", "123", 100, 100, "0xd898deb6b660a4d819b76775623f5fbb3c2d466422df5b6162e5c2c134aa9658").send({
//     from : address,
//     gas : 6721975
// }).on('confirmation', function(confirmationNumber, receipt){
//     console.log(confirmationNumber)
// })

// 개인키로 부터 wallet 생성
// var wallet1 = etherWallet.fromPrivateKey(Buffer.from('740b526ab7ebbe49735e446eb04ee01c954a9426b78acb76130d962ca5b3af1b', 'hex'));
// console.log('address1: ' + wallet1.getAddressString());
// console.log('private key1: ' + wallet1.getPrivateKeyString());
// console.log('public key1: ' + wallet1.getPublicKeyString());



// web3.util.sha3(data) 함수를 통해서 서명할 데이터의 hash값을 얻어 낸다.
// web3.eth.accounts.sign(hash, privatekey) 함수를 통해서 데이터를 서명한다.
//const messagetoSign = web3.utils.sha3('message');
//console.log(messagetoSign)
//
// // web3.eth.accounts.sign()을 통해 v,r,s 값을 포함한 객체값을 전달받는다.
// var signatureData = web3.eth.accounts.sign(messagetoSign, wallet1.getPrivateKeyString());
// var signatureData = web3.eth.accounts.sign("asd", wallet1.getPrivateKeyString());
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


