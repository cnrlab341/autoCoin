var consumerDB = require('../database/consumer.js');
var modulesTimeLate = require('../modules/calculateTimeLate');


var setInitialState = function(params, callback){
    // console.log("JSON-RPC setInitialSate 호출");
    // console.dir("request params : " +  params);
    // {blockCount, pricePerBlock, rest, id, previousTime, newTime}

    // setInitialState
    consumerDB.setInitialdata(params[0].blockCount, params[0].pricePerBlock, params[0].rest);
    var currentId = params[0].id; // id 값을 추가하여 json rpc 통신의 혼선을 없앤다.

    modulesTimeLate.setConsumerTimeLate(0, consumerDB.getClientTimeLate(), params[0].previousTime, params[0].newTime);

    var output = {requestAck : 0, BP : 0, id : currentId +1};

    callback(null, output);

    console.log("reqAck   : ", '0');
    console.log( '0' + " BP    : 0");
};

module.exports = setInitialState;