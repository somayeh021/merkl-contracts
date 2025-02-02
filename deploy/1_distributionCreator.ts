import { DeployFunction } from 'hardhat-deploy/types';
import yargs from 'yargs';

import { DistributionCreator, DistributionCreator__factory } from '../typechain';
import { parseAmount } from '../utils/bignumber';
const argv = yargs.env('').boolean('ci').parseSync();

const func: DeployFunction = async ({ deployments, ethers, network }) => {
  const { deploy } = deployments;
  const { deployer } = await ethers.getNamedSigners();

  let core: string;
  // TODO: change the coreMerkl address to that of the desired chain
  core = '0x3E399AE5B4D8bc0021e53b51c8BCdD66DD62c03b';
  /*
  if (!network.live) {
    // If we're in mainnet fork, we're using the `CoreBorrow` address from mainnet
    core = registry(ChainId.MAINNET)?.Merkl?.CoreMerkl!;
  } else {
    // Otherwise, we're using the proxy admin address from the desired network
    core = registry(network.config.chainId as ChainId)?.Merkl?.CoreMerkl!;
  }
  */

  console.log(deployer.address);
  console.log('Now deploying DistributionCreator');
  console.log('Starting with the implementation');
  console.log('deployer ', await deployer.getBalance());
  await deploy('DistributionCreator_Implementation_V2_0', {
    contract: 'DistributionCreator',
    from: deployer.address,
    log: !argv.ci,
  });

  const implementationAddress = (await ethers.getContract('DistributionCreator_Implementation_V2_0')).address;

  console.log(`Successfully deployed the implementation for DistributionCreator at ${implementationAddress}`);
  console.log('');
  /*
  const distributor = (await deployments.get('Distributor')).address;
  console.log('Now deploying the Proxy');

  await deploy('DistributionCreator', {
    contract: 'ERC1967Proxy',
    from: deployer.address,
    args: [implementationAddress, '0x'],
    log: !argv.ci,
  });

  const manager = (await deployments.get('DistributionCreator')).address;
  console.log(`Successfully deployed contract at the address ${manager}`);
  console.log('Initializing the contract');
  const contract = new ethers.Contract(
    manager,
    DistributionCreator__factory.createInterface(),
    deployer,
  ) as DistributionCreator;

  await (await contract.connect(deployer).initialize(core, distributor, parseAmount.gwei('0.03'))).wait();
  console.log('Contract successfully initialized');
  console.log('');
  console.log(await contract.core());
  */

  /* Once good some functions need to be called to have everything setup.

  In the `DistributionCreator` contract:
  - `toggleTokenWhitelist` -> for agEUR and stEUR
  - `setRewardTokenMinAmounts`
  - `setFeeRecipient -> angleLabs
  - `setMessage` ->

  In the Distributor contract:
  - `toggleTrusted` -> keeper bot updating
  - `setDisputeToken` -> should we activate dispute periods
  - `setDisputePeriod`
  - `setDisputeAmount`
  */
};

func.tags = ['distributionCreator'];
func.dependencies = ['distributor'];
export default func;
