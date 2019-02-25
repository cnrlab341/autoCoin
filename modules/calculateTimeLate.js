var publisherDB = require('../database/publisher');
var consumerDB = require('../database/consumer');

module.exports = {
    setPublisherTimeLate : function (count, existingTimeLate, previousTime, newTime) {
        var alpha;
        if(count == 0){
            alpha = 1;
        }else{
            alpha = 0.2;
        }
        var temp = newTime - previousTime;

            var newTimeLate = alpha * temp + (1-alpha) * existingTimeLate;
        publisherDB.setPublisherTimeLate(newTimeLate);
        publisherDB.setPublisherPreviousTime(newTime);

        console.log("Publisher " + count + "번째 timeLate : " + newTimeLate + "ms");
    },

    setConsumerTimeLate : function (count, existingTimeLate, previousTime, newTime) {
        var alpha;
        if(count == 0){
            alpha = 1;
        }else{
            alpha = 0.2;
        }
        var temp = newTime - previousTime;

        var newTimeLate = alpha * temp + (1-alpha) * existingTimeLate;
        consumerDB.setClientTimeLate(newTimeLate);
        consumerDB.setClientPreviousTime(newTime);

        console.log("Consumer " + count + "번째 timeLate : " + newTimeLate + "ms");
    },

    setTestPublisherTimeLate : function (count, existingTimeLate, previousTime, newTime, callback) {
        var alpha;
        if(count == 0){
            alpha = 1;
        }else{
            alpha = 0.2;
        }
        var temp = newTime - previousTime;
        var csvFile = count + "\t" + temp + "\n";

        var newTimeLate = alpha * temp + (1-alpha) * existingTimeLate;

        publisherDB.setPublisherTimeLate(newTimeLate);
        publisherDB.setPublisherPreviousTime(newTime);

        console.log("Publisher " + count + "번째 timeLate : " + newTimeLate + "ms");

        callback(csvFile);
    },

};