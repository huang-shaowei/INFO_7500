var EventRegistration = artifacts.require("./EventRegistration.sol");

module.exports = function(deployer) {
  deployer.deploy(EventRegistration, 100, 10);
};
