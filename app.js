const express = require('express')
    , http = require('http')
    , app = express()
    , port = 5000
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

    // crypto algorithm
    var crypto = require('crypto');
    algorithm = 'aes-256-cbc';


//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');

console.log('config.server_port : %d', config.server_port);
app.set('port', 5000);

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
            var fname =  basename + extention;
            callback(null, fname);

        }

    }
);
// 0x51d06583936251d91e170ec61c870657de2b3457600d5d59a3492a682d9b3c9a
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

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

    // 데이터베이스 초기화
    database.init(app, config);
    console.log("Express Listening at http://localhost:" + port);

});

var publisherDB = require('./database/publisher');
var consumerDB = require('./database/consumer.js');
var modulesTimeLate = require('./modules/calculateTimeLate');
var moduleAES = require('./modules/AES-256-cbc');

var login_ids = {};

var currentSpiltSize;
var csvFile;


// test

// model split : 1K
var model_1 = {
    'split' : 1,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0.0014648365974775513,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 100,
    'test_BP' : ""
}

// model split : 5K
var model_5 = {
    'split' : 5,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0.007323324789454412,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 100,
    'test_BP' : ""
}

// model split : 10K
var model_10 = {
    'split' : 10,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0.014645577035735208,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 100,
    'test_BP' : ""
}

// model split : 15K
var model_15 = {
    'split' : 15,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0.021963540522732264,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 100,
    'test_BP' : ""
}

// model split : 20K
var model_20 = {
    'split' : 20,
    'test_blockCount' : 0,
    'test_pricePerBlock' : 0.029282576866764276,
    'test_rest' : 0,
    'test_proofOfEncryption' : 0,
    'test_encryptionData' : new Array(),
    'test_deposit' : 100,
    'test_BP' : ""
}


var test = new Array();
test.push(model_1);
test.push(model_5);
test.push(model_10);
test.push(model_15);
test.push(model_20);


var keyhex = "8479768f48481eeb9c8304ce0a58481eeb9c8304ce0a5e3cb5e3cb58479768f4"; //length 32

var blockSize = 16;


function encryptAES(input) {
    try {
        var iv = require('crypto').randomBytes(16);
        // console.info('iv',iv);
        var data = new Buffer(input).toString('binary');
        // console.info('data',data);

        key = new Buffer(keyhex, "hex");
        //console.info(key);
        var cipher = require('crypto').createCipheriv('aes-256-cbc', key, iv);
        // UPDATE: crypto changed in v0.10

        // https://github.com/joyent/node/wiki/Api-changes-between-v0.8-and-v0.10

        var nodev = process.version.match(/^v(\d+)\.(\d+)/);

        var encrypted;

        if( nodev[1] === '0' && parseInt(nodev[2]) < 10) {
            encrypted = cipher.update(data, 'binary') + cipher.final('binary');
        } else {
            encrypted =  cipher.update(data, 'utf8', 'binary') +  cipher.final('binary');
        }

        var encoded = new Buffer(iv, 'binary').toString('hex') + new Buffer(encrypted, 'binary').toString('hex');

        return encoded;
    } catch (ex) {
        // handle error
        // most likely, entropy sources are drained
        console.error(ex);
    }
}

function decryptAES(encoded) {
    var combined = new Buffer(encoded, 'hex');

    key = new Buffer(keyhex, "hex");

    // Create iv
    var iv = new Buffer(16);

    combined.copy(iv, 0, 0, 16);
    edata = combined.slice(16).toString('binary');

    // Decipher encrypted data
    var decipher = require('crypto').createDecipheriv('aes-256-cbc', key, iv);

    // UPDATE: crypto changed in v0.10
    // https://github.com/joyent/node/wiki/Api-changes-between-v0.8-and-v0.10

    var nodev = process.version.match(/^v(\d+)\.(\d+)/);

    var decrypted, plaintext;
    if( nodev[1] === '0' && parseInt(nodev[2]) < 10) {
        decrypted = decipher.update(edata, 'binary') + decipher.final('binary');
        plaintext = new Buffer(decrypted, 'binary').toString('utf8');
    } else {
        plaintext = (decipher.update(edata, 'binary', 'utf8') + decipher.final('utf8'));
    }
    return plaintext;
}

function init(input, count, callback) {
    var first_data = input.toString('base64', 0, 12);
    // console.log(first_data.length) // 16, AAAAIGZ0eXBtcDQy
    // console.log(new Buffer(first_data))
    var last_data = input.toString('base64', 12, input.length);

    var temp = last_data.match(new RegExp('.{1,' + splitSize[count]+ '}', 'g'));
    console.log("=====" + splitSize[count] + "=====")
    test[count].test_blockCount = temp.length + 1;
    console.log("split length " + test[i].test_blockCount) // 4539

    var outPut = {first_data : first_data, last_data : temp};
    callback(outPut);
}

function encryption_for(count, first_data, last_data, callback) {
    var hw = new Array();

    for(var i=0;i<last_data.length;i++) {
        var temp =encryptAES(last_data[i]);
        hw.push(temp);
        test[count].test_encryptionData.push(temp);

        if(i==last_data.length-1){
            var proofOfEncryption = encryptAES(first_data);
            test[count].test_proofOfEncryption = proofOfEncryption
            console.log("proofOfEncryption : ", test[count].test_proofOfEncryption);

            var output = {hw : hw, proofOfEncryption : proofOfEncryption};

            // console.log(proofOfEncryption.length)
            console.log("encryption 1per size" + test[count].test_encryptionData[0].length)
            console.log("encryption  length" + test[count].test_encryptionData.length)
            callback(output);
        }
    }
}


var splitSize = [500, 2500, 5000, 7500, 10000];

// for (var i =0; i<5;i++){
//
//     var input = new Buffer(52428800);
//
//     init(input, i, function (result) {
//         encryption_for(i, result.first_data, result.last_data, function (result2) { // var output = {hw : hw, proofOfEncryption : proofOfEncryption};
//             console.log('성공');
//         })
//     })
// }
