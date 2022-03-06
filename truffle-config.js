const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config({ path: './.env' });
const Mnemonic = process.env.MNEMONIC;
const accountIndex = 0;
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
  networks: {
    development: {
      host: '127.0.0.1',
      network_id: 5777,
      port: 7545,
    },
    ganache_local: {
      provider: function () {
        return new HDWalletProvider(
          Mnemonic,
          'http://127.0.0.1:7545',
          accountIndex,
        );
      },
      network_id: 5777,
    },
    goerli_infura: {
      provider: function () {
        return new HDWalletProvider(
          Mnemonic,
          process.env.goerli_URL,
          accountIndex,
        );
      },
      network_id: 5
    },
    ropsten_infura: {
      provider: function () {
        return new HDWalletProvider(
          Mnemonic,
          process.env.ropsten_URL,
          accountIndex,
        );
      },
      network_id: 3,
    },
  },
  compilers: {
    solc: {
      version: '0.8.1',
    },
  },
};
