var publisherCsvFile = "totalAck\t";
var consumerCsvFile = "totalAck\t";


module.exports ={
    setConsumerInitial : function (blockCount, consumerTimeDelay) {
        consumerCsvFile +=  blockCount + "\n\nAck\tconsumerTimeDelay\tBPTimeDelay\n0\t" + consumerTimeDelay + "\tx\n";
    },

    setConsumerDelay : function (ack, consumerTimeDelay, BPTimeDelay) {
        consumerCsvFile += ack + "\t" + consumerTimeDelay + "\t" + BPTimeDelay  + "\n";
    },

    getConsumerCsvFile : function () {
        return consumerCsvFile;
    },

    clearConsumerCsvFile : function () {
        consumerCsvFile = "";
    }
}