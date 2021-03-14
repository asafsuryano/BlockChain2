var Token = artifacts.require("DappToken");
module.exports = function(deployer) {
  deployer.deploy(Token);
};
