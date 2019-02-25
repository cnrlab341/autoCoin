var test = function (req, res) {
    console.log("/test접근");
    res.render("test.ejs");
}

var socket = function (req, res){
    console.log("socket접근");
    res.render("socket.ejs")
}

module.exports.test = test;
module.exports.socket = socket;