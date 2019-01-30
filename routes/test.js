var echo = function (req, res) {
    console.log("/test/echo접근");
    res.render("test.ejs");

}

module.exports.echo = echo;