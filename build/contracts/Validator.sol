pragma solidity ^0.5.1;

contract Validator{
    function recoverAddress(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) internal pure returns(address) {

        return ecrecover(msgHash, v, r, s);
    }

    // check BalanceProof
    function checkBalanceProof(address addr, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) internal pure returns(bool){
        return addr == recoverAddress(msgHash, v, r, s);
    }
}