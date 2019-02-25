var fs = require('fs');
var csvFile = require('../database/csvFile');

var storeCsvFile = function(params, callback) {
    console.log("JSON-RPC storeCsvFile 호출");
    console.log(params);

    var consumerCsvFile = csvFile.getConsumerCsvFile();
    var count = params[0].count;

    var output = {};

    var filePath = './' + count + '요청 consumerTimeDelay.csv';
    fs.writeFile(filePath, consumerCsvFile, 'utf8', function (err, result) {
        if (err){
            console.log("File err : ", err)
        } else{
            console.log("File result :", result);
            csvFile.clearConsumerCsvFile();
            output.state = true;
            callback(null, output);
        }
    });


}

module.exports = storeCsvFile;