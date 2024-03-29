pragma solidity 0.8.10;

//SPDX-License-Identifier: MIT

/**
* @source https://github.com/OpenZeppelin/openzeppelin-contracts
* Openzeppelin library
*/
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Campaign.sol";
import "./Ownable.sol";

contract CampaignManager is Ownable { 

    using SafeMath for uint;
    
    struct S_Campaign {
        Campaign campaign;
        uint balance;
    }
    mapping(address => S_Campaign) public campaigns;
    mapping(address => mapping(address => uint)) public donors;

    uint index = 1;
    event CampaignCreated(uint indexed campaignIndex, address campaignAddress);
    event CampaignFunded(address campaignAddress, address donorAddress, uint amount, uint totalReceived);
    event CampaignFundWithdrawn(address campaignAddress, address toAddress, uint amount, uint balance);

    function createCampaign(string memory _campaignId,  string memory _campaignName) public onlyOwner  {
        Campaign newCampaign = new Campaign(this, _campaignId, _campaignName, index);
        address  _addr = address(newCampaign);
        S_Campaign  memory _sCampaign = S_Campaign({ campaign: newCampaign,  balance: uint(0)});
        campaigns[_addr] = _sCampaign;
        emit CampaignCreated(index, _addr);
        index++;
    }

    function fundCampaign(address campaignAddres) public payable {
        campaigns[campaignAddres].balance = campaigns[campaignAddres].balance.add(msg.value);
        donors[campaignAddres][msg.sender] = msg.value;
        emit CampaignFunded(campaignAddres, msg.sender, msg.value, campaigns[campaignAddres].balance);
    }

    function withdrawCampaignFunds(address campaignAddres, address payable _toAddress, uint amount) public onlyOwner {
        require(address(campaigns[campaignAddres].campaign) != address(0), "The campaign address supplied does not exist");
        S_Campaign memory campaign = campaigns[campaignAddres];
        require(campaign.balance >= amount, "Insufficient funds");
        _toAddress.transfer(amount);
        campaigns[campaignAddres].balance = campaign.balance.sub(amount);
        emit CampaignFundWithdrawn(campaignAddres, _toAddress, amount, campaigns[campaignAddres].balance);
    }
    
}

