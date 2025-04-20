const NFTAuction = artifacts.require("NFTAuction");

module.exports = async function(deployer) {
  await deployer.deploy(NFTAuction);
};