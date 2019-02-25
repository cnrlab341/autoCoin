// 추후에 계정정보 DB처리
var consumerAccounts = new Array();
var blockCount =0;
var pricePerBlock =0;
var rest =0;
var proofOfEncryption ="";
var encryptionData = new Array();
var balance = 0;         // balanceProof
var requestAck = 0;  // 진행중인 요청 데이터
var clientPreviousTime =0;
var clientTimeLate =0; // 시간 지연
var deposit =100;

module.exports.clear = function () {
    blockCount = 0;
    pricePerBlock = 0;
    rest =0;
    proofOfEncryption ="";
    encryptionData = new Array();
    balance = 0;         // balanceProof
    requestAck = 0;  // 진행중인 요청 데이터
    clientPreviousTime =0;
    clientTimeLate =0; // 시간 지연
    deposit =100;
};

// accounts.push({privateKey : "0x13ba66f8bc43c7851249e742bd92ccc495b6aa75a6636fbc6e77176a5fdd3dfe", address : "0xec58179D7BD7CBEd4D1a76376A1c961C61548071", password : "1234"});
consumerAccounts.push({privateKey : "0xae950f323a3155496625b2936f84750513488cd85e0ecc1b887dcd2f35999e84", address : "0x22FA6ea1e3AfE958b06115291791d70f71377e64", password : "1234"});


module.exports.setAccounts = function (name, address, password) {
    consumerAccounts.push({name : name, address : address, password : password})
};

module.exports.getAccounts = function () {
    return consumerAccounts;
};

// module.exports.setInitailCsvFile = function (content) {
//     csvFile += content + "\n\nAck\tconsumerTimeDelay\tBPTimeDelay\tjson-RPCTimeDelay\n";
// };
//
// module.exports.setCsvFile = function (content) {
//
// };
//
// module.exports.getCsvFile = function () {
//     return csvFile;
// };

module.exports.setInitialdata = function (_blockCount, _pricePerBlock, _rest) {
    blockCount = _blockCount;
    pricePerBlock = _pricePerBlock;
    rest = _rest;
};

module.exports.setRequestAck = function(newRequestAck) {
    requestAck = newRequestAck;
}

module.exports.setProofOfEncryption = function (_proofOfEncryption) {
    proofOfEncryption = _proofOfEncryption;
};

module.exports.setEncryptionData = function (newEncryptionData) {
    encryptionData.push(newEncryptionData);
};

module.exports.setCalState = function (_requestAck, _balance, _timeLate){
    requestAck = _requestAck;
    balance = _balance;
    timeLate = _timeLate;
};

module.exports.setClientPreviousTime = function(newPreviousTime){
    clientPreviousTime = newPreviousTime;
};

module.exports.setClientTimeLate = function(newTimeLate){
    clientTimeLate = newTimeLate;
};

module.exports.setDeposit = function(_deposit){
    deposit = _deposit;
};

module.exports.setBalance = function(_balance){
    balance = _balance;
};

module.exports.getDeposit = function(){
    return deposit;
};

module.exports.getRequestAck = function () {
    return requestAck;
};

module.exports.getBlockCount = function () {
    return blockCount;
};

module.exports.getClientTimeLate = function () {
    return clientTimeLate;
};

module.exports.getClientPreviousTime = function () {
    return clientPreviousTime;
};

module.exports.getBalance = function () {
    return balance;
};

module.exports.getPricePerBlock = function () {
    return pricePerBlock;
};

module.exports.getEncryptionData = function () {
    return encryptionData;
};

module.exports.getProofOfEncryption = function () {
    return proofOfEncryption;
};

