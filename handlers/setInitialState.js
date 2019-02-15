var submitData = require('../database/temp.js');
var blockCount;
var pricePerBlock;
var rest;
var proofOfEncryption;
var timeLate; // 시간 지연
var encryptionData;
var balance = 0;         // balanceProof
var requestAck = 0;  // 진행중인 요청 데이터
var previousTime;

var setInitialState = function(params, callback){
    // console.log("JSON-RPC setInitialSate 호출");
    // console.dir("request params : " +  params); //   var message = {blockCount : result.blockCount, pricePerBlock : result.pricePerBlock, rest : result.rest, id : id}
    console.log("Consumer " , "0번째 timelate : ", params[0].timeLate + "ms")

    // setInitialState
    blockCount = params[0].blockCount;
    pricePerBlock = params[0].pricePerBlock;
    rest = params[0].rest;
    timeLate = params[0].timeLate;
    previousTime = params[0].previousTime;
    var currentId = params[0].id; // id 값을 추가하여 json rpc 통신의 혼선을 없앤다.

    var output = {requestAck : requestAck, BP : balance, id : currentId +1};
    balance + pricePerBlock;

    //_blockCount, _pricePerBlock, _rest, _timeLate, _encryptionData, _balance, _requestAck
    submitData.setInitialdata(blockCount, pricePerBlock, rest, timeLate, balance, requestAck, previousTime);

    callback(null, output);
    console.log("reqAck   : ", requestAck);
    console.log( requestAck + " BP    : 0");
};

module.exports = setInitialState;