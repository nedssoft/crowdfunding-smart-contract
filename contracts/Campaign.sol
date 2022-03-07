pragma solidity 0.8.10;

//SPDX-License-Identifier: MIT

import "./CampaignManager.sol";

contract Campaign {

    string public campaignId;
    string public campaignName;
    address public ownerAddress;
    uint public index;
    CampaignManager parentContract;

    constructor(CampaignManager _parentContract, string memory _campaignId, string memory _campaignName, uint _index) {
        campaignId = _campaignId;
        campaignName = _campaignName;
        index = _index;
        ownerAddress = msg.sender;
        parentContract = _parentContract;
    }

    receive() external payable {
        (bool success, ) = address(parentContract).call{value:msg.value}(abi.encodeWithSignature("fundCampaign(address)", address(this)));
        require(success, "Payment failed");
    }

    fallback() external  {

    }
}