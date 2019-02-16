var publisherDB = require('../database/publisher');
var exec = require('child_process').exec;

module.exports = {

    exeiftoolAPI : function (filePath, callback) {
        exec('exiftool '+ filePath, function (err, stdout, stderr) {

            var test = stdout.split('\n');

            var temp = test[3].split(":");
            var File_Size = temp[1];

            temp = test[16].split(":");
            temp = temp[1]+temp[2]+temp[3]+temp[4]+temp[5]
            var Create_Date = temp;

            temp = test[18].split(":");
            temp = temp[1]+temp[2]+temp[3]
            var Duration = temp;

            console.log(File_Size)
            console.log(Create_Date);
            console.log(Duration);

            // 추후에 location 정보 수정
            var loc = "37.44976, 127.129637 ";

            var result = {File_Size : File_Size, Create_Date : Create_Date, Duration : Duration, Loc : loc};

            callback(result);
        })
}

}