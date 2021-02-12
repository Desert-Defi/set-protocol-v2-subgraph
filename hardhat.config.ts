import 'dotenv/config';
import type { HardhatUserConfig } from 'hardhat/types';

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.ETHEREUM_NODE_URL || 'http://localhost:8545',
        blockNumber: 11180400 // Nov 2, 2020
      },
      chainId: 5777
    }
  }
};

export default config;
