var currentTime;
var previousTime;
var timeLate; // 시간 지연
var state = 0; // 현재까지 진행한 거래 상태 저장
var blockCount;
var pricePerBlock;
var res;

var calState = function (id, callaback) {
    console.log("JSON-RPC calState 호출");
    console.dir("request Id : ", id);



    callaback(null, params);


};

module.exports = calState;