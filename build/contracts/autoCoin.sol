pragma solidity ^0.5.1;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./Ownable.sol";
import "./Validator.sol";

contract autoCoin is ERC20, ERC20Detailed, Ownable, Validator{

    // Item MetaData struct
    struct ItemMetaData {
        address publisher;
        uint256 itemPrice;
        string itemLoc;
        string itemSize;
        string itemType;
        uint256 itemDuration;
        uint256 itemCreateTime;
        bytes32 itemHash;
        bytes32[] cosigners;     // witness
        bool isRegistered;
    }

    // Channel struct
    struct Channel{
        address publisher;
        address consumer;
        uint256 deposit;
        uint256 duration;
        uint256 CreateTime;
        uint256 ItemSerial;
        bytes32 consumerSideContent;
        bytes32 consumerSideitemHash;
        uint256 tempBalanceproof;
        bytes32 evidenceOfEncryptioney;
        uint256 state;                  // 0 : ongoing, 1: rescission, 2: completion
        bool isRegistered;
    }

    // Check ongoing Channel
    modifier ongoingChannel(uint256 __channelSerial){
        require(registeredChannel[__channelSerial].isRegistered == true);
        require(registeredChannel[__channelSerial].state == 0);
        require(registeredChannel[__channelSerial].CreateTime + registeredChannel[__channelSerial].duration > now);
        _;
    }

    // Check exceeded Channel
    modifier exceededChannel(uint256 __channelSerial){
        require(registeredChannel[__channelSerial].isRegistered == true);
        require(registeredChannel[__channelSerial].state == 0);
        require(registeredChannel[__channelSerial].CreateTime + registeredChannel[__channelSerial].duration < now);
        _;
    }

    // Check publisher
    modifier publisher(uint256 __channelSerial){
        require(registeredChannel[__channelSerial].publisher == msg.sender);
        _;
    }

    // Check consumer
    modifier consumer(uint256 __channelSerial){
        require(registeredChannel[__channelSerial].consumer == msg.sender);
        _;
    }

    uint256 private fee = 5;            // 5%
    uint256 private duration = 1 days;
    uint256 private itemSerial;
    uint256 private channelSerial;

    mapping(uint256 /*itemSerial*/ => ItemMetaData) private registeredItemMetaData;
    mapping(uint256 /*channelSerial*/ => Channel) private registeredChannel;

    string private _name = "autoCoin";
    string private _symbol = "ATO";
    uint8 private _decimals = 2;

    // create Token
    constructor() ERC20Detailed(_name, _symbol, _decimals) public {
        _mint(owner(), 100000 /*totalSupply*/ * 10**uint256(_decimals));
    }

    // [PUBLISHER]
    function registerItem(
        uint256 __itemPrice,
        string memory __itemLoc,
        string memory __itemSize,
        string memory __itemType,
        uint256 __itemDuration,
        uint256 __itemCreateTime,
        bytes32 __itemHash) public returns(uint256){
        uint256  __itemSerial = itemSerial++;
        require(registeredItemMetaData[__itemSerial].isRegistered == false);

        registeredItemMetaData[__itemSerial].publisher = msg.sender;
        registeredItemMetaData[__itemSerial].itemPrice = __itemPrice;
        registeredItemMetaData[__itemSerial].itemLoc = __itemLoc;
        registeredItemMetaData[__itemSerial].itemSize = __itemSize;
        registeredItemMetaData[__itemSerial].itemType = __itemType;
        registeredItemMetaData[__itemSerial].itemDuration = __itemDuration;
        registeredItemMetaData[__itemSerial].itemCreateTime = __itemCreateTime;
        registeredItemMetaData[__itemSerial].itemHash = __itemHash;
        registeredItemMetaData[__itemSerial].isRegistered = true;

        return __itemSerial;
    }

    // item Information
    function DeliverItem(uint256 __itemSerial) public view returns (
        address _publisher,
        uint256 _itemPrice,
        string memory _itemLoc,
        string memory _itemSize,
        string memory _itemType,
        uint256 _itemDuration,
        uint256 _itemCreateTime,
        bytes32 __itemHash,
    // string[] memory __cosigners,
        bool _isRegistered){
        require(registeredItemMetaData[__itemSerial].isRegistered == true);

        ItemMetaData memory temp = registeredItemMetaData[__itemSerial];
        return(
        temp.publisher,
        temp.itemPrice,
        temp.itemLoc,
        temp.itemSize,
        temp.itemType,
        temp.itemDuration,
        temp.itemCreateTime,
        temp.itemHash,
        // temp.cosigners,
        temp.isRegistered);
    }

    // [Consumer] - channel Create
    function createChannel(
        uint256 __deposit,
        uint256 __itemSerial) public returns(uint256){
        uint256 __channelSerial = channelSerial++;
        require(registeredItemMetaData[__itemSerial].isRegistered == true);
        require(registeredItemMetaData[__itemSerial].itemPrice == __deposit);

        // deposit
        deposit(msg.sender, __deposit);

        registeredChannel[__channelSerial].publisher = registeredItemMetaData[__itemSerial].publisher;
        registeredChannel[__channelSerial].consumer = msg.sender;
        registeredChannel[__channelSerial].deposit = __deposit;
        registeredChannel[__channelSerial].duration = duration;         // 1 days (fixed)
        registeredChannel[__channelSerial].CreateTime = now;
        registeredChannel[__channelSerial].ItemSerial = __itemSerial;
        registeredChannel[__channelSerial].state = 0;
        registeredChannel[__channelSerial].isRegistered = true;

        return __channelSerial;
    }

    // channel Information
    function DeliverChannel(uint256 __channelSerial) public view returns(
        address _publisher,
        address _consumer,
        uint256 _deposit,
        uint256 _duration,
        uint256 _CreateTime,
        uint256 _ItemSerial,
        bytes32 __cosumerSideContent,
        bytes32 __consumerSideitemHash,
        uint256 __tempBalanceproof,
        bytes32 _evidenceOfEncryptionKey,
        uint256 _state,
        bool _isRegistered){
        require(registeredChannel[__channelSerial].isRegistered == true);

        Channel memory temp = registeredChannel[__channelSerial];

        return (
        temp.publisher,
        temp.consumer,
        temp.deposit,
        temp.duration,
        temp.CreateTime,
        temp.ItemSerial,
        temp.consumerSideContent,
        temp.consumerSideitemHash,
        temp.tempBalanceproof,
        temp.evidenceOfEncryptioney,
        temp.state,
        temp.isRegistered);
    }

    // DeliverItemSerial
    function getItemSerial(uint256 __channelSerial) internal view returns(uint256){
        return(registeredChannel[__channelSerial].ItemSerial);
    }

    // [Consumer] Save the first received content block
    function saveReceivedContent (bytes32 __consumerSideContent, uint256 __channelSerial) public
    ongoingChannel(__channelSerial)
    consumer(__channelSerial) returns(bool){
        registeredChannel[__channelSerial].consumerSideContent = __consumerSideContent;

        return true;
    }

    // [Consumer] unwarranted Publisher Penelty
    function consumerCancelChannel(uint256 __channelSerial) public
    exceededChannel(__channelSerial)
    consumer(__channelSerial)
    returns (uint state){
        require(registeredChannel[__channelSerial].deposit > registeredChannel[__channelSerial].tempBalanceproof);

        uint256 __fee = (fee * registeredChannel[__channelSerial].tempBalanceproof)/100;

        // deposit token refund
        Penelty(registeredChannel[__channelSerial].consumer, msg.sender, registeredChannel[__channelSerial].deposit, __fee);

        registeredChannel[__channelSerial].state = 1;

        return registeredChannel[__channelSerial].state;
    }

    // [Consumer] Save the received itemHash
    function saveItemHash(uint256 __channelSerial, bytes32 __itemHash) public
    ongoingChannel(__channelSerial)
    consumer(__channelSerial)
    returns(bool){
        registeredChannel[__channelSerial].consumerSideitemHash = __itemHash;

        return true;
    }

    // [Publisher] Save balanceProof for disconnected consumer
    function saveBalanceProof(uint256 __channelSerial, bytes32 __balanceProof, uint8 v, bytes32 r, bytes32 s, uint256 __balance) public
    ongoingChannel(__channelSerial) publisher(__channelSerial) returns(bool){
        require(registeredChannel[__channelSerial].deposit > __balance);
        require(checkBalanceProof(registeredChannel[__channelSerial].consumer, __balanceProof, v, r, s));

        registeredChannel[__channelSerial].tempBalanceproof = __balance;

        return true;
    }

    // [Publisher] unwarranted consumer Penelty
    function publisherSideCancelChannel (uint256 __channelSerial, bytes32 __balanceProof, uint8 v, bytes32 r, bytes32 s, uint256 __balance) public exceededChannel(__channelSerial) publisher(__channelSerial) returns (uint state){
        require(registeredChannel[__channelSerial].deposit > __balance);
        require(checkBalanceProof(registeredChannel[__channelSerial].consumer, __balanceProof, v, r, s));

        uint256 __fee = (fee * __balance)/100;

        // deposit token refund
        Penelty(registeredChannel[__channelSerial].consumer, msg.sender, registeredChannel[__channelSerial].deposit, __fee);

        registeredChannel[__channelSerial].state = 1;

        return registeredChannel[__channelSerial].state;
    }

    // item comparison
    function comparisonContent(uint256 __itemSerial, bytes32 __itemHash) internal view returns(bool){
        if(registeredItemMetaData[__itemSerial].itemHash == __itemHash){
            return true;
        }
        else return false;
    }

    // [Publisher] - complete channel
    // consumerSideContent is handled by the app
    function completeChannel(uint256 __channelSerial, bytes32 __evidenceOfEncryptionKey, bytes32 __balanceProof, uint8 v, bytes32 r, bytes32 s, uint256 __balance) public
    ongoingChannel(__channelSerial)
    publisher(__channelSerial)
    returns (uint state){
        require(comparisonContent(getItemSerial(__channelSerial), registeredChannel[__channelSerial].consumerSideitemHash));
        require(checkBalanceProof(registeredChannel[__channelSerial].consumer, __balanceProof, v, r, s));     // check balanceproof
        require(registeredChannel[__channelSerial].deposit == __balance);

        // deposit token refund
        complete(msg.sender, registeredChannel[__channelSerial].deposit);

        registeredChannel[__channelSerial].evidenceOfEncryptioney = __evidenceOfEncryptionKey;
        registeredChannel[__channelSerial].state = 2;

        return registeredChannel[__channelSerial].state;
    }
}
