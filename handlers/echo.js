var echo = function (params, callaback) {
    console.log("JSON-RPC echo 호출");
    console.dir(params);
    callaback(null, params);
};

module.exports = echo;