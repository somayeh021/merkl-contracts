import { deployments, ethers } from 'hardhat';

import { DistributionCreator, DistributionCreator__factory } from '../typechain';

async function main() {
  const { deployer } = await ethers.getNamedSigners();
  const managerAddress = (await deployments.get('DistributionCreator')).address;
  const manager: DistributionCreator = new ethers.Contract(
    managerAddress,
    DistributionCreator__factory.createInterface(),
    deployer,
  ) as DistributionCreator;

  console.log('Toggling signature whitelist');
  console.log(await manager.message());
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
