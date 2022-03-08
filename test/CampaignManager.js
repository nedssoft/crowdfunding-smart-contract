const CampaignManager = artifacts.require('CampaignManager');

const chai = require('./chaiSetup');
const BN = web3.utils.BN;
const expect = chai.expect;

contract('CampaignManager Test', async (accounts) => {
  const [owner, account1, account2] = accounts;

  let managerInstance;

  beforeEach(async () => {
    managerInstance = await CampaignManager.deployed();
  });

  const campaign = {
    id: 'AA22BT',
    name: 'Good Samaritan Fund',
  };


  it('should allow only contract owner to create a campaign ', async () => {
    
    try {
      await managerInstance.createCampaign(
        campaign.id,
        campaign.name,
        {
          from: account1,
        },
      );
    } catch (err) {
      expect(err.reason).equal(
        'Only Contract Owner can authorize this operation',
      );
    }
  });
  it('should create a campaign', async () => {
    const result = managerInstance.createCampaign(campaign.id, campaign.name, {
      from: owner,
    });

    const args = (await result).logs[0].args;
    expect(result).to.eventually.be.fulfilled;
    expect(web3.utils.isAddress(args.campaignAddress)).equal(true);
    expect(args.campaignIndex).to.be.bignumber.equal(new BN(1));
  });

  it('should fund a campaign', async () => {
    const result = await managerInstance.createCampaign(
      campaign.id,
      campaign.name,
      {
        from: owner,
      },
    );

    const args = result.logs[0].args;
    const amountToDonate = 20000;
    const fundResponse = managerInstance.fundCampaign(args.campaignAddress, {
      from: account1,
      value: amountToDonate,
    });

    expect(fundResponse).to.eventually.be.fulfilled;
    const fundResultArgs = (await fundResponse).logs[0].args;

    const campaignStruct = await managerInstance.campaigns(
      fundResultArgs.campaignAddress,
    );
    expect(campaignStruct.campaign).equal(fundResultArgs.campaignAddress);
    expect(campaignStruct.balance).to.be.a.bignumber.equal(
      new BN(amountToDonate),
    );
  });

  it('should fail to withdraw if the sender is not the owner ', async () => {
    const result = await managerInstance.createCampaign(
      campaign.id,
      campaign.name,
      {
        from: owner,
      },
    );

    const args = result.logs[0].args;
    const amountToDonate = 20000;
    const fundResponse = await managerInstance.fundCampaign(
      args.campaignAddress,
      { from: account1, value: amountToDonate },
    );

    const fundResultArgs = fundResponse.logs[0].args;

    try {
      await managerInstance.withdrawCampaignFunds(
        fundResultArgs.campaignAddress,
        account2,
        10000,
        { from: account1 },
      );
    } catch (err) {
      expect(err.reason).equal(
        'Only Contract Owner can authorize this operation',
      );
    }
  });
  it('should not withdraw more than the balance', async () => {
    const result = await managerInstance.createCampaign(
      campaign.id,
      campaign.name,
      {
        from: owner,
      },
    );

    const args = result.logs[0].args;
    const amountToDonate = 20000;
    const fundResponse = await managerInstance.fundCampaign(
      args.campaignAddress,
      { from: account1, value: amountToDonate },
    );

    const fundResultArgs = fundResponse.logs[0].args;

    try {
      await managerInstance.withdrawCampaignFunds(
        fundResultArgs.campaignAddress,
        account2,
        amountToDonate + 1,
        { from: owner },
      );
    } catch (err) {
      expect(err.reason).equal('Insufficient funds');
    }
  });
  it('should successfully withdraw campaign funds', async () => {
    const result = await managerInstance.createCampaign(
      campaign.id,
      campaign.name,
      {
        from: owner,
      },
    );

    const args = result.logs[0].args;
    const amountToDonate = 20000;
    const fundResponse = await managerInstance.fundCampaign(
      args.campaignAddress,
      { from: account1, value: amountToDonate },
    );

    const fundResultArgs = fundResponse.logs[0].args;

    const recipientBalanceBefore = await web3.eth.getBalance(account2);

    const withdrawResponse = managerInstance.withdrawCampaignFunds(
      fundResultArgs.campaignAddress,
      account2,
      amountToDonate,
      { from: owner },
    );
    expect(withdrawResponse).to.eventually.fulfilled;

    const withdrawResponseArgs = (await withdrawResponse).logs[0].args;

    expect(withdrawResponseArgs.amount).to.be.a.bignumber.equal(
      new BN(amountToDonate),
    );
    expect(withdrawResponseArgs.toAddress).equal(account2);
    const campaignBalance = await managerInstance.campaigns(
      args.campaignAddress,
    );

    expect(campaignBalance.balance).to.be.a.bignumber.equal(new BN(0));
    const recipientBalanceAfter = await web3.eth.getBalance(account2);
    expect(Number(recipientBalanceAfter)).equal(
      Number(recipientBalanceBefore) + Number(amountToDonate),
    );
  });
});
