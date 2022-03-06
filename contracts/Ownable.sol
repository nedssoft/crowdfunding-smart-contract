pragma solidity >=0.4.22 <0.9.0;

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