var host = "localhost";
var port = "3000";
var socket;

var publisher = "0xec58179D7BD7CBEd4D1a76376A1c961C61548071";
var consumer = "0x22FA6ea1e3AfE958b06115291791d70f71377e64"
var content_name = "test";
var deposit = "100";
var id = 1001;

var currentTime;
var previousTime;
var timeLate; // 시간 지연
// var state = 0; // 현재까지 진행한 거래 상태 저장
// var blockCount;
// var pricePerBlock;
// var rest;

// var requstAck = 0;  // 진행중인 요청 데이터
// var BP = 0;         // balanceProof


// 문서 로딩 후 실행
$(function () {
    $.jsonRPC.setup({
        endPoint : 'http://localhost:3000/api',
        namespace : ''
    });
    connectToServer();
});

// 서버에 연결하는 함수 정의
function connectToServer() {
    var options = {'forceNew' : true};
    var url = 'http://' + host + ':' + port;
    var setting_parameter = publisher + "//" + content_name;

    socket = io.connect(url, options);
    socket.on('connect', function () {
        // println('웹 소켓 서버에 연결되었습니다.', + url);

        var output = { setting_parameter : setting_parameter, from : consumer, deposit : deposit};

        // consumer쪽에서 block count와 priceperBlock 요구
        socket.emit('setting', output);
        currentTime = new Date();
        previousTime = Number(currentTime);
        // publisher에게 block count와 pricePerBlock 획득

    });
    socket.on('setting', function (result) {
        currentTime = new Date();
        timeLate = Number(currentTime) - previousTime;
        console.log("1번째 timelate : ", timeLate + "ms")

        var message = {blockCount : result.blockCount, pricePerBlock : result.pricePerBlock, rest : result.rest, id : id,  timeLate : timeLate};

        setInitialState("setInitialState", message)
    });

    socket.on('submit', function (result) {
        console.log("responseData : ", result);

        currentTime = new Date();
        var message = {responseBlk : result.responseBlk, encryptionData: result.encryptionData, id: result.id, newTime : Number(currentTime)};

        calState("calState", message);
    })

    socket.on('disconnect', function () {
        // println('웹 소켓 연결이 종료되었습니다.');
    });

};

function setTimeLate(existingTime, newTime, callback) {
    var alpha = 0.2;
    var result = alpha * parseInt(newTime)+ (1-alpha) * parseInt(existingTime);
    callback(result);
}

function setInitialState(method, message) {
    $.jsonRPC.request(method, {
        id: id,
        params: [message],
        success: function(data) {
            console.log('정상 응답을 받았습니다.');
            console.log(data.result);
            // id : id, , from : consumer
            if(socket == undefined){
                alert('Not connected to Publisher');
                return;
            }

            var output = {requestAck: data.result.requestAck, BP : data.result.BP, id : data.result.id, from : consumer};

            socket.emit('submit', output);
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

            address = data.result.address;
            itemprice = data.result.Price;
            loc = data.result.Loc;
            size = data.result.File_Size;
            duration = data.result.Duration;
            createTime = data.result.Create_Date;
            hash = data.result.hash;

            address = data.result.address;
        },
        error: function(data) {
            console.log('에러 응답을 받았습니다.');
            console.dir(data);

        }
    });
}