var DAuction = artifacts.require("./DAuction.sol");
var DAuctions = artifacts.require("./DAuctions.sol");
var DDutchAuction = artifacts.require("./DDutchAuction.sol");


module.exports = function(deployer) {
  deployer.deploy(DAuction);

  deployer.link(DAuction, DDutchAuction);
  deployer.deploy(DDutchAuction);

  deployer.link(DAuction, DAuctions);
  deployer.link(DDutchAuction, DAuctions);
  deployer.deploy(DAuctions);
};
