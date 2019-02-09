var currentTime;
var previousTime;
var timeLate; // 시간 지연
var state = 0; // 현재까지 진행한 거래 상태 저장
var blockCount;
var pricePerBlock;
var rest;
var requstAck = 0;  // 진행중인 요청 데이터
var BP = 0;         // balanceProof

var proofOfEncryption;

var setInitialState = function(params, callback){
    console.log("JSON-RPC setInitialSate 호출");
    console.dir("request params : ", params); //   var message = {blockCount : result.blockCount, pricePerBlock : result.pricePerBlock, rest : result.rest, id : id}

    // setInitialState
    blockCount = params[0].blockCount;
    pricePerBlock = params[0].pricePerBlock;
    rest = params[0].rest;
    timeLate = params[0].timeLate;
    var currentId = params[0].id; // id 값을 추가하여 json rpc 통신의 혼선을 없앤다.

    var output = {requstAck : requstAck, BP : BP, id : currentId +1};
    requstAck +=1;
    BP + pricePerBlock;

    callback(null, output);
}

var calState = function (params, callaback) {
    console.log("JSON-RPC calState 호출");
    console.dir("request params : ", params); //    {responseBlk : result.responseBlk, encryptionData: result.encryptionData, id: result.id, newTime : Number(currentTime)}

    proofOfEncryption = params[0].encryptionData;
    var currentId = params[0].id;

    if(requstAck == params[0].responseBlk) {
        // 정상 처리되고 있을때
        requstAck +=1;
        // 시간 지연 계산
        calTimeLate(timeLate, params[0].newTime);

        //balanceproof 생성




    }else if(requstAck > params[0].responseBlk){
        // comsumer는 전달했지만 publisher가 받지 못해 이전것을 다시 요청했을 때
        console.log("지연발생");
    }


    // callaback(null, params);


};

// 시간 지연 계산
function calTimeLate(existingTime, newTime) {
    var alpha = 0.2;
    timeLate = alpha * newTime + (1-alpha) * existingTime;

}


// 시간 지연 체크
function checkTimeLate(){

}

module.exports = calState;
module.exports = setInitialState;