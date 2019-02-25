var host = "localhost";
var port = "3000";
var socket;

var publisher = "0xec58179D7BD7CBEd4D1a76376A1c961C61548071";
var consumer = "0x22FA6ea1e3AfE958b06115291791d70f71377e64"
var content_name = "test";
var deposit = "100";
var id = 1001;

var currentTime;
var initialTime;
var timeLate; // 시간 지연
// var state = 0; // 현재까지 진행한 거래 상태 저장
// var blockCount;
// var pricePerBlock;
// var rest;

// var requstAck = 0;  // 진행중인 요청 데이터
// var BP = 0;         // balanceProof

var index =0;
var jsonCurrentTime;
var jsonPreviousTime;
var jsonTimeDelay;
var splitSize;
var count;

// 문서 로딩 후 실행
$(function () {
    $.jsonRPC.setup({
        endPoint : 'http://127.0.0.1:3000/api',
        namespace : ''
    });
    // connectToServer();
});

// 서버에 연결하는 함수 정의
function connectToServer() {

    splitSize = $('#splitSize').val();
    count = $('#count').val();

    console.log('splitSize :' ,splitSize)
    console.log('count :' ,count)

    var options = {'forceNew' : true};
    var url = 'http://' + host + ':' + port;


    socket = io.connect(url, options);

    socket.on('connect', function () {
        // println('웹 소켓 서버에 연결되었습니다.', + url);

        var output = {splitSize : splitSize, from : consumer, deposit : deposit};

        // consumer쪽에서 block count와 priceperBlock 요구
        socket.emit('test_setting', output);
        currentTime = new Date();
        initialTime = Number(currentTime);
        // publisher에게 block count와 pricePerBlock 획득

    });
    socket.on('test_setting', function (result) {
        currentTime = new Date();
        jsonPreviousTime = Number(currentTime);
        // console.log('test_setting jsonPreviousTime : ' , jsonPreviousTime);

        var message = {blockCount : result.blockCount, pricePerBlock : result.pricePerBlock, rest : result.rest, id : id,  previousTime : initialTime, newTime : Number(currentTime)};

        setInitialState("setInitialState", message)
    });

    socket.on('test_submit', function (result) {
        // console.log("responseData : ", result);
        //
        // console.log('test_submit jsonPreviousTime : ' , jsonPreviousTime);
        // console.log('test_submit jsonCurrentTime : ' , jsonCurrentTime);
        // console.log('test_submit jsonTimeDelay : ' , jsonTimeDelay);

        currentTime = new Date();
        jsonPreviousTime = Number(currentTime);

        var message = {responseBlk : result.responseBlk, encryptionData: result.encryptionData, id: result.id, newTime : Number(currentTime), jsonTimeDelay : jsonTimeDelay};

        calState("calState", message);
    });

    socket.on('test_last', function (result) {
        // console.log("lastData : ", result);

        var message = {count: index, id: result.id};

        storeCsvFile("storeCsvFile", message);
    })

    socket.on('disconnect', function () {
        // println('웹 소켓 연결이 종료되었습니다.');
    });

};

function setInitialState(method, message) {
    $.jsonRPC.request(method, {
        id: id,
        params: [message],
        success: function(data) {
            console.log('정상 응답을 받았습니다.');
            console.log(data.result);

            jsonCurrentTime = Number(new Date());

            // id : id, , from : consumer
            if(socket == undefined){
                alert('Not connected to Publisher');
                return;
            }



            var output = {requestAck: data.result.requestAck, BP : data.result.BP, id : data.result.id, from : consumer};
            socket.emit('test_submit', output);
        },
        error: function(data) {
            console.log('에러 응답을 받았습니다.');
            console.dir(data);
        }
    });
}

function calState(method, message){
    $.jsonRPC.request(method, {
        id: message.id,
        params: [message],
        success: function(data) {
            console.log('정상 응답을 받았습니다.');
            console.log(data.result);

            jsonCurrentTime = Number(new Date());

            // console.log('calState jsonCurrentTime : ' , jsonCurrentTime);

            jsonTimeDelay = jsonCurrentTime - jsonPreviousTime;
            // console.log('setInitialState jsonCurrentTime : ' , jsonCurrentTime);

            if(socket == undefined){
                alert('Not connected to Publisher');
                return;
            }

            var output = {requestAck: data.result.requestAck, BP : data.result.BP, id : data.result.id, from : consumer};

            socket.emit('test_submit', output);

        },
        error: function(data) {
            console.log('에러 응답을 받았습니다.');
            console.dir(data);

        }
    });
}

function storeCsvFile(method, message){
    $.jsonRPC.request(method, {
        id: message.id,
        params: [message],
        success: function(data) {
            console.log('정상 응답을 받았습니다.');
            console.log(data.result);

            if(socket == undefined){
                alert('Not connected to Publisher');
                return;
            }


            if(index == count-1){
                console.log("완료");
            }else{
                console.log("반복횟수 : " + (count-1) - index + "남음");
                index ++;
                var output = {splitSize : splitSize, from : consumer, deposit : deposit};

                currentTime = new Date();
                initialTime = Number(currentTime);
                timeLate = 0;
                jsonCurrentTime = 0;
                jsonPreviousTime = 0;
                jsonTimeDelay = 0;

                socket.emit('test_setting', output);
            }

        },
        error: function(data) {
            console.log('에러 응답을 받았습니다.');
            console.dir(data);

        }
    });
}