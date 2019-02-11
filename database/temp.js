// 추후에 계정정보 DB처리
var accounts = new Array();

accounts.push({privateKey : "0x13ba66f8bc43c7851249e742bd92ccc495b6aa75a6636fbc6e77176a5fdd3dfe", address : "0xec58179D7BD7CBEd4D1a76376A1c961C61548071", password : "1234"})
accounts.push({privateKey : "0xae950f323a3155496625b2936f84750513488cd85e0ecc1b887dcd2f35999e84", address : "0x22FA6ea1e3AfE958b06115291791d70f71377e64", password : "1234"})

module.exports.set_accounts = function (name, address, password) {
    accounts.push({name : name, address : address, password : password})
}

module.exports.get_accounts = function () {
    return accounts;
}


var blockCount;
var pricePerBlock;
var rest;
var proofOfEncryption;
var encryptionData;
var balance = 0;         // balanceProof
var requestAck = 0;  // 진행중인 요청 데이터
var BP;
var clientPreviousTime;
var publisherPreviousTime;
var clientTimeLate; // 시간 지연
var publisherTimeLate;
var deposit;

module.exports.setInitialdata = function (_blockCount, _pricePerBlock, _rest, _timeLate, _encryptionData, _balance, _requestAck, _previousTime) {
    blockCount = _blockCount;
    pricePerBlock = _pricePerBlock;
    rest = _rest;
    clientTimeLate= _timeLate;
    encryptionData = _encryptionData;
    balance = _balance;
    requestAck = _requestAck;
    clientPreviousTime = _previousTime;
}

module.exports.setProofOfEncryption = function (_proofOfEncryption) {
    proofOfEncryption = _proofOfEncryption;
}

module.exports.setEncryptionData = function (newEncryptionData) {
    encryptionData.push(newEncryptionData);
}

module.exports.setCalState = function (_requestAck, _balance, _timeLate){
    requestAck = _requestAck;
    balance = _balance;
    timeLate = _timeLate;
}

module.exports.setClientPreviousTime = function(newPreviousTime){
    clientPreviousTime = newPreviousTime;
}

module.exports.setClientTimeLate = function(newTimeLate){
    clientTimeLate = newTimeLate;
}

module.exports.setPublisherPreviousTime = function(newPreviousTime){
    publisherPreviousTime = newPreviousTime;
}

module.exports.setPublisherTimeLate = function(newTimeLate){
    publisherTimeLate = newTimeLate;
}

module.exports.setDeposit = function(_deposit){
    deposit = _deposit;
}

module.exports.getDeposit = function(){
    return deposit;
}

module.exports.getRequestAck = function () {
    return requestAck;
}

module.exports.getBlockCount = function () {
    return blockCount;
}

module.exports.getClientTimeLate = function () {
    return clientTimeLate;
}

module.exports.getClientPreviousTime = function () {
    return clientPreviousTime;
}

module.exports.getPublisherTimeLate = function () {
    return publisherTimeLate;
}

module.exports.getPublisherPreviousTime = function () {
    return publisherPreviousTime;
}

module.exports.getBalance = function () {
    return balance;
}

module.exports.getPricePerBlock = function () {
    return pricePerBlock;
}


