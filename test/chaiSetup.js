// chaiSetup.js

"use strict";

// chai library [Available at: https://github.com/chaijs/chai]
var chai = require('chai');
const BN = web3.utils.BN;

// chai BN library [Available at: https://github.com/OpenZeppelin/chai-bn]
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

//chai as promised [Available at: https://github.com/domenic/chai-as-promised]
var chaiAdPromised = require('chai-as-promised');
chai.use(chaiAdPromised);


module.exports = chai;
