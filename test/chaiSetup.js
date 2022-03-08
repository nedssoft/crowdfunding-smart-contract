"use strict";

var chai = require('chai');
const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);
var chaiAdPromised = require('chai-as-promised');
chai.use(chaiAdPromised);


module.exports = chai;
