import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Health Token and Marketplace contracts...");

  // Deploy HealthToken
  const HealthToken = await ethers.getContractFactory("HealthToken");
  const healthToken = await HealthToken.deploy();
  await healthToken.deployed();
  console.log("HealthToken deployed to:", healthToken.address);

  // Deploy HealthDataMarketplace
  const HealthDataMarketplace = await ethers.getContractFactory("HealthDataMarketplace");
  const marketplace = await HealthDataMarketplace.deploy(healthToken.address);
  await marketplace.deployed();
  console.log("HealthDataMarketplace deployed to:", marketplace.address);

  // Set marketplace address in token contract
  await healthToken.setMarketplace(marketplace.address);
  console.log("Marketplace address set in token contract");

  // Transfer some initial tokens to the marketplace
  const initialMarketplaceTokens = ethers.utils.parseEther("100000"); // 100,000 tokens
  await healthToken.transfer(marketplace.address, initialMarketplaceTokens);
  console.log("Transferred initial tokens to marketplace");

  console.log("\nDeployment complete! Contract addresses:");
  console.log("HealthToken:", healthToken.address);
  console.log("HealthDataMarketplace:", marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
