pragma solidity 0.8.10;

//SPDX-License-Identifier: MIT


contract Ownable {

    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwnerCanWithdraw() {
        require(msg.sender == owner, "Only Contract Owner can authorize widthdrawal");
        _;
    }
}