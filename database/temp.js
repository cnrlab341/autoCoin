// 추후에 계정정보 DB처리
var accounts = new Array();

accounts.push({name : "test", address : "0xC1de081e01F1A341473E3F1c9Ff3962D0D6Bd9b2", key : "740b526ab7ebbe49735e446eb04ee01c954a9426b78acb76130d962ca5b3af1b"})

module.exports.set_accounts = function (name, address, key) {
    accounts.push({name : name, address : address, key : key})
}

module.exports.get_accounts = function () {
    return accounts;
}