# Set Protocol V2 Subgraph

Indexer of Set Protocol v2 events. Built on [The Graph](https://thegraph.com/).

## Setup

Requirements:

- [Node.js >= 14.0](https://nodejs.org/en/download/)
- [Yarn >= 1.22](https://yarnpkg.com)
- [Bash >= 5.0](https://gist.github.com/Rican7/44081a9806595704fa7b289c32fcd62c)
- [Docker >= 19.0](https://www.docker.com/get-started).

Steps:

1. `yarn install`
2. `yarn gen-deployment <NETWORK_NAME>` hardhat or mainnet
3. (If deploying to hosted service) `yarn graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>`

## Commands

Usage:

`yarn <COMMAND>`

Commands:

`build` - Compile subgraph

`codegen` - Generate types (if schema or ABI changed)

`deploy-local` - Deploy subgraph to localhost

`deploy-to <IP>` - Deploy subgraph to Graph Node by IP

`deploy-hosted` - Deploy subgraph to hosted service

`gen-abis` - Pull contract ABIs from Set Protocol V2 repo (only needed if changed)

`gen-deployment <NETWORK_NAME>` - Generate deployment-specific files

`lint` - Format code

## Local development (hardhat)

### Clone Set Protocol v2 fork (in separate directory)

1. `git clone https://github.com/jgrizzled/set-protocol-v2-contracts.git -b mock-deployment && cd set-protocol-v2-contracts`
2. `cp .env.default .env`
3. `yarn install`
4. `yarn chain`
5. `yarn deploy-mock`

Restart `yarn chain` if redeploying.

### Install Graph Node

1. `git clone -q --depth=1 https://github.com/graphprotocol/graph-node.git && cd graph-node/docker`
2. Edit line 20 of docker-compose.yml to `ethereum: hardhat:http://host.docker.internal:8545` (May need to replace host.docker.internal with local IP)
3. Run with `sudo docker-compose up`

`rm -rf ./data` and restart containers if hardhat chain changes.RE

### Deploy subgraph locally

1. `yarn gen-deployment hardhat`
2. `yarn deploy-local`

Graph-node may take a few minutes to sync the subgraph.

Visit `http://localhost:8000/subgraphs/name/desert-defi/setprotocolv2/graphql` to view subgraph data

## Reference

[Discord: Index Co-op #set-subgraph](https://discord.gg/8FYPP7ebbw)

[Subgraph Plan](https://docs.google.com/spreadsheets/d/1I3sk1kvfCPnnrUUCiBa35DZneeTx0vtGk04B-rKCJVE/edit#gid=0)

[Subgraph notes](https://docs.google.com/document/d/1c2-JrZFc4WJxm_6X7Uj5kNXKNkZ_ZAzsS08Mv7UfVaw/edit?usp=sharing)

[TheGraph Docs](https://thegraph.com/docs/)

[Set Protocol V2 Contracts](https://github.com/SetProtocol/set-protocol-v2-contracts)

[Set Protocol System Diagram](https://drive.google.com/file/d/15ETEqxkjkR29GmWH4gg4ob_OW9lb_Nly/view)

[Hosted API](https://thegraph.com/explorer/subgraph/desert-defi/setprotocolv2)
