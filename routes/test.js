var echo = function (req, res) {
    console.log("/test/echo접근");
    res.render("test.ejs");
}

var socket = function (req, res){
    console.log("socket접근");
    res.render("socket.ejs")
}

module.exports.echo = echo;
module.exports.socket = socket;