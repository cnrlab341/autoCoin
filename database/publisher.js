// 추후에 계정정보 DB처리

var publisherAccounts = new Array();
var blockCount =0;
var pricePerBlock =0;
var rest=0;
var proofOfEncryption="";              // modules/AES-256-cbc 설정
var encryptionData = new Array();   // modules/AES-256-cbc 설정
var deposit=0;                        // modules/detail 설정
var BP="";
var publisherPreviousTime = 0;
var publisherTimeLate=0;
var encryptionKey = "8479768f48481eeb9c8304ce0a58481eeb9c8304ce0a5e3cb5e3cb58479768f4";

publisherAccounts.push({privateKey : "0x13ba66f8bc43c7851249e742bd92ccc495b6aa75a6636fbc6e77176a5fdd3dfe", address : "0xec58179D7BD7CBEd4D1a76376A1c961C61548071", password : "1234"});


module.exports = {

    //setter

    setAccounts: function (name, address, password) {
        publisherAccounts.push({name: name, address: address, password: password});
    },

    setBlockCount: function (newBlockCount) {
        blockCount = newBlockCount;
    },

    setPricePerBlock: function (newPricePerBlock) {
        pricePerBlock = newPricePerBlock;
    },

    setRest: function (newRest) {
        rest = newRest;
    },

    setProofOfEncryption: function (newProofOfEncryption) {
        proofOfEncryption = newProofOfEncryption;
    },

    setEncryptionData: function (newEncryptionData) {
        encryptionData.push(newEncryptionData);
    },

    setBP: function (newBP) {
        BP = newBP;
    },

    setPublisherPreviousTime: function (newPublisherPreviousTime) {
        publisherPreviousTime = newPublisherPreviousTime;
    },

    setPublisherTimeLate: function (newPublisherTimeLate) {
        publisherTimeLate = newPublisherTimeLate;
    },

    setDeposit: function (newDepsit) {
        deposit = newDepsit;
    },


    //getter

    getAccounts: function () {
        return publisherAccounts;
    },

    getBlockCount: function () {
        return blockCount;
    },

    getPricePerBlock: function () {
        return pricePerBlock;
    },

    getRest: function () {
        return rest;
    },

    getProofOfEncryption: function () {
        return proofOfEncryption;
    },

    getEncryptionData: function () {
        return encryptionData;
    },

    getBP: function () {
        return BP;
    },

    getPublisherPreviousTime: function () {
        return publisherPreviousTime;
    },

    getPublisherTimeLate: function () {
        return publisherTimeLate;
    },

    getDeposit: function () {
        return deposit;
    },

    getEncryptionKey : function () {
        return encryptionKey;
    }
};