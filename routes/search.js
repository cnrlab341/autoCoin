var search = function (req, res) {
    console.log("search접근");
    res.render('search.ejs');
}

module.exports.search = search;