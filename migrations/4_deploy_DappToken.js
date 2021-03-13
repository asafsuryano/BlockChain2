var Token = artifacts.require("./Dapp_token.sol");
module.exports = function(deployer) {
  deployer.deploy(Token);
};
