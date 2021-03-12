var Gambller = artifacts.require("./NBA_gembller.sol");
console.log();
module.exports = function(deployer) {
  deployer.deploy(Gambller);
};
