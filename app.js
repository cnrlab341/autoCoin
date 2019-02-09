const express = require('express')
    , http = require('http')
    , app = express()
    , port = 3000 || process.env.PORT
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , static = require('serve-static')
    , path = require('path')

    // 에러 핸들러 모듈 사용
    , expressErrorHandler = require('express-error-handler')

    // Session 미들웨어 불러오기
    , expressSession = require('express-session')

    //===== Passport 사용 =====//
    , passport = require('passport')
    , flash = require('connect-flash')

    // 모듈로 분리한 설정 파일 불러오기
    , config = require('./config')

    // 모듈로 분리한 데이터베이스 파일 불러오기
    , database = require('./database/database')

    // 모듈로 분리한 라우팅 파일 불러오기
    , route_loader = require('./routes/route_loader')

    // JSON-RPC 처리
    , handler_loader = require('./handlers/handler_loader')
    , jayson = require('jayson');

    //파일 업로드하기 위한 모듈
    var multer = require('multer');
    var fs = require('fs');

    // Socket.io 모듈 지원
    var socketio = require('socket.io');

    //클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
    var cors = require('cors');


//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');

console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// public,uploads 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads',static(path.join(__dirname, 'uploads')));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


//다중 접속을 위한 미들웨어
app.use(cors());

//===== Passport 사용 설정 =====//
// Passport의 세션을 사용할 때는 그 전에 Express의 세션을 사용하는 코드가 있어야 함
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// JSON-RPC 핸들러 정보를 읽어 들여 핸들러 경로 설정
var jsonrpc_api_path = config.jsonrpc_api_path || '/api';
handler_loader.init(jayson, app, jsonrpc_api_path);
console.log("JSON-RPC를 [" + jsonrpc_api_path + " ] 패스에서 사용하도록 설정함.");


//라우팅 정보를 읽어 들여 라우팅 설정
var router = express.Router();
route_loader.init(app, router);

//==== 파일 업로드 ====//
var fileStorage =  multer.diskStorage(
    {
        destination: function (req,file, callback)
        {
            callback(null, 'uploads');      //목적지 폴더 지정 : 'uploads' 를 목적지로 정한다(이쪽으로 파일이 오게됨)
        },
        filename: function (req, file, callback)
        {
            //올린 파일명이 기존과 같으면 덮어씌워짐으로 시간을 기준으로 다른 파일로 저장되게끔 처리한다

            var extention = path.extname(file.originalname);
            var basename = path.basename(file.originalname, extention);        //확장자 .jpg 만 빠진 파일명을 얻어온다
            var fname =  "0xC1de081e01F1A341473E3F1c9Ff3962D0D6Bd9b2_" + basename + extention;
            callback(null, fname);

        }

    }
);

var upload = multer(
    {
        storage: fileStorage,
        limits:
            {
                files: 10,                      //10개까지
                fileSize: 1024 * 1024 * 1024    //한번 업로드 할때 최대 사이즈
            }
    }
);

// 경로를 추후에 DB처리 해야함
var content_path = {
    "0xC1de081e01F1A341473E3F1c9Ff3962D0D6Bd9b2" : "192.0.1"
};

// upload.single('img') -> req.file
// upload.array('key', 최대파일개수) -> req.files
router.route('/register/upload').post(upload.array('photo',1),
    function (req, res)
    {
        console.log("file", req.files);
        console.log('/register/upload 접근');
        var file = req.files;
        if (file.length > 0)
        {
            console.dir(file[0]);
        }
        else
        {
            console.log('파일이 없음');
        }

        // 추후에 DB에 저장 (타입, 이름, 경로, 사이즈)
        var type = file[0].mimetype;
        var name = file[0].filename;
        var path = file[0].path;
        var size = file[0].size;

        var file_info = {File_Type:type, File_Name:name, File_Path:path, File_Size:size};

        res.render('register.ejs', {signal : 'upload', file_info : file_info});


    }
);


//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
    console.log('uncaughtException 발생함 : ' + err);
    console.log('서버 프로세스 종료하지 않고 유지함.');

    console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
    console.log("Express 서버 객체가 종료됩니다.");
    if (database.db) {
        database.db.close();
    }
});

// 시작된 서버 객체를 리턴받도록 합니다.
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

    // 데이터베이스 초기화
    database.init(app, config);
    console.log("Express Listening at http://localhost:" + port);

});
var currentTime;
var previousTime;
var timeLate; // 시간 지연

var login_ids = {};
var proofOfEncryption;
var remainingData;
var blockCount;
var pricePerBlock;
var rest;
// socket.io 서버를 시작합니다.
var io = socketio.listen(server);
console.log('socket.ejs.io 요청을 받아들일 준비가 됬습니다.');

// 클라이언트가 연결했을 때의 이벤트 처리
io.sockets.on('connection', function (socket) {
    console.log("connection info : ", socket.request.connection._peername);

    // 소켓 객체에 클라이언트 Host, Port 정보 속성으로 추가
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;

    socket.on('setting', function (message) {
        console.log("setting socket 접근");
        console.log(message);

        login_ids[message.from] = socket.id;
        socket.login_id = message.from;

        console.log("접속한 클라이언트 ID 개수 : %d", Object.keys(login_ids).length);

        // block count 블록당 가격 체크
        setting(message.deposit, function (blockCount, pricePerBlock, rest) {
            console.log("setting 변수 : ", blockCount, pricePerBlock, rest);

            blockCount = blockCount;
            pricePerBlock = pricePerBlock;
            rest = rest;

            var output = {blockCount : blockCount, pricePerBlock : pricePerBlock, rest, rest}

            io.sockets.connected[login_ids[message.from]].emit('setting', output);
            currentTime = Date.now();
            previousTime = Number(currentTime);
            console.log("Publisher URI request Time " + currentTime)
        });
        // sendResponse(socket, "setting", '200');

    })
});

function sendResponse(socket, command, code) {
    var obj = {command : command, code : code};
    socket.emit('setting', obj);
}

function setting(deposit, callback) {
   var path = 'uploads/0xC1de081e01F1A341473E3F1c9Ff3962D0D6Bd9b2_test.mp4';
    fs.readFile(path, function (err, data) {
        input = new Buffer(data);
        // console.log(typeof (input))

        proofOfEncryption = input.toString('base64', 0, 12);
        console.log(proofOfEncryption) // 16, AAAAIGZ0eXBtcDQy

        var temp = input.toString('base64', 12, input.length);
        // console.log(remainingData)

        // // 데이터 원하는 byte크기로 자르기
        remainingData = temp.match(new RegExp('.{1,' + 16+ '}', 'g'));
        console.log(remainingData.length)

        var blockCount = remainingData.length + 1; // blockcount
        var pricePerBlock = parseInt(deposit / remainingData.length); // 몫
        var rest = deposit%remainingData.length; // 나머지
        callback(blockCount, pricePerBlock, rest);

    })
}