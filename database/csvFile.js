var publisherCsvFile = "totalAck\t";
var consumerCsvFile = "totalAck\t";


module.exports ={
    setConsumerInitial : function (blockCount, consumerTimeDelay) {
        consumerCsvFile +=  blockCount + "\n\nAck\tconsumerTimeDelay\tBPTimeDelay\tjsonRPCTimeDelay\n0\t" + consumerTimeDelay + "\tx\tx\n";
    },

    setConsumerDelay : function (ack, consumerTimeDelay, BPTimeDelay, jsonTimeDelay) {
        consumerCsvFile += ack + "\t" + consumerTimeDelay + "\t" + BPTimeDelay + "\t" + jsonTimeDelay + "\n";
    },

    getConsumerCsvFile : function () {
        return consumerCsvFile;
    },

    clearConsumerCsvFile : function () {
        consumerCsvFile = "";
    }
}