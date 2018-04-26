module.exports = function(deployer) {
  deployer.deploy(DAuction);
  deployer.deploy(DAuctions);
  deployer.deploy(DDutchAuction);
  deployer.deploy(DVickreyAuction);
  deployer.deploy(DEnglishAuction);
  deployer.autolink();
};
