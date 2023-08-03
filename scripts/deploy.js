const { ethers, upgrades } = require("hardhat");

async function main() {
  // Deploy RenewableEnergyCreditTrading contract
  const RenewableEnergyCreditTrading = await ethers.getContractFactory("RenewableEnergyCreditTrading");
  const renewableEnergyCreditTrading = await upgrades.deployProxy(RenewableEnergyCreditTrading);
  await renewableEnergyCreditTrading.deployed();

  // Deploy RenewableEnergyRegistry contract
  const RenewableEnergyRegistry = await ethers.getContractFactory("RenewableEnergyRegistry");
  const renewableEnergyRegistry = await upgrades.deployProxy(RenewableEnergyRegistry);
  await renewableEnergyRegistry.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
