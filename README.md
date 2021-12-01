# Set Protocol V2 Subgraph

Indexer of Set Protocol v2 events. Built on [The Graph](https://thegraph.com/).

## Setup

Requirements:

- Bash >= 5.0 [Mac](https://gist.github.com/Rican7/44081a9806595704fa7b289c32fcd62c) / [Win](https://nickjanetakis.com/blog/a-linux-dev-environment-on-windows-with-wsl-2-docker-desktop-and-more)
- [Node.js >= 14.0](https://nodejs.org/en/download/)
- Yarn 1.x (`npm install -g yarn`)
- [Docker >= 19.0](https://www.docker.com/get-started)

Steps:

1. `git clone https://github.com/SetProtocol/set-protocol-v2-subgraph.git && cd set-protocol-v2-subgraph`
2. `yarn install`
3. `yarn gen-deployment <NETWORK_NAME>` hardhat or mainnet
4. (If deploying to hosted service) `yarn graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>`
5. `graph deploy --product hosted-service justinkchen/set-protocol-v2-matic` (replace set-protocol-v2-matic with whatever graph is being deployed)

Current subgraphs:
- justinkchen/set-protocol-v2 (Ethereum Mainnet)
- justinkchen/set-protocol-v2-staging (Ethereum Mainnet)
- justinkchen/set-protocol-v2-matic (Matic)
- justinkchen/set-protocol-v2-matic-staging (Matic)
- justinkchen/set-protocol-v2-arbitrum (Arbitrum)
- justinkchen/set-protocol-v2-arbitrum-staging (Arbitrum)
- justinkchen/set-protocol-v2-avalanche (Avalanche)
- justinkchen/set-protocol-v2-avax-staging (Avalanche) 
- justinkchen/set-protocol-v2-optimism-staging (Optimism)

Using Graph Subgraph Studio (Future steps once Subgraph studio supports more networks):
1. `graph auth --studio <API KEY>` (see more at https://thegraph.com/studio/subgraph/set-protocol-v2/)
2. `yarn gen-deployment <NETWORK_NAME>` hardhat or mainnet or matic or staging-mainnet
3. `cp generated/addresses.ts .` Copy generated addresses file to root location
3. `graph codegen && graph build`
4. `graph deploy --studio set-protocol-v2` for mainnet or `graph deploy --studio set-protocol-v2-matic` for Matic/Polygon or `graph deploy --studio set-protocol-v2-staging` for staging mainnet


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

### Clone Set Protocol v2 fork

In separate directory:

1. `git clone https://github.com/jgrizzled/set-protocol-v2.git -b subgraph-dev && cd set-protocol-v2`
2. `cp .env.default .env`
3. `yarn install`

To run the hardhat node:

1. `yarn chain --hostname 0.0.0.0`
2. Wait for node to start
3. (in separate terminal) `yarn deploy-mock`

### Install Graph Node

In separate directory:

1. `git clone -q --depth=1 https://github.com/graphprotocol/graph-node.git && cd graph-node/docker`
2. Edit line 20 of docker-compose.yml to `ethereum: hardhat:http://host.docker.internal:8545` (May need to replace host.docker.internal with LAN IP)
3. Run with `sudo docker-compose up`

`rm -rf ./data` and restart containers if blockchain changes.

`sudo docker-compose build` if updated via `git pull`

### Deploy subgraph locally

From subgraph repo:

1. `yarn gen-deployment hardhat`
2. `yarn deploy-local`

Graph-node may take a few minutes to sync the subgraph.

Visit `http://localhost:8000/subgraphs/name/desert-defi/setprotocolv2/graphql` to view subgraph data

## Syncing to mainnet

Syncing the subgraph to mainnet requires an Ethereum archive node. We recommend [Turbogeth](https://github.com/ledgerwatch/turbo-geth) as it syncs fast and will fit on a 2TB SSD at present. Note that it takes a few hours for the subgraph to sync and re-deploying the subgraph will re-sync from scratch.

### Turbogeth

In separate directory:

1. `git clone -q --depth=1 https://github.com/ledgerwatch/turbo-geth.git && cd turbo-geth`
2. `sudo docker-compose build` (re-run if updated via `git pull`)
3. `sudo XDG_DATA_HOME=/preferred/data/folder docker-compose up -d`

Watch logs with:

`sudo docker logs $(sudo docker container ls | grep tg | cut -d' ' -f1) -f --since 10m`

### Graph Node

From graph-node repo:

Ensure `docker/docker-compose.yml` is configured for mainnet on line 20: `ethereum: mainnet:`

If you previously synced to hardhat, `rm -rf docker/data`.

Don't start Graph Node until Turbogeth is fully synced.

Start with:

1. `cd docker`
2. `sudo docker-compose up -d`

Watch logs with:

`sudo docker logs $(sudo docker container ls | grep graph-node | cut -d' ' -f1) -f --since 10m`

### Deploy to mainnet

From subgraph repo:

1. `yarn gen-deployment mainnet`
2. `yarn deploy-local` or `yarn deploy-to <IP>` if Graph Node on another machine.

Watch graph-node logs for sync status and errors. Subgraph URL same as above.

## Files

`schema.graphql` - Subgraph schema

`templates/subgraph.yaml` - configure watched contracts and events

`deployments.json` - configure deployed contract addresses

`src/` - [AssemblyScript](https://www.assemblyscript.org) code for subgraph handlers

`src/mappings/` - Event handlers

`src/entities/` - Entity helper functions

## Design

### Historical Entities

#### Events

Individual transaction log events referenced by TxID and log index. Can have multiple events of the same type with the same timestamp (IE same block). Ex TradeEvent.

#### States

Final state of an entity at the end of a block. Referenced by block number. Multiple events in the same block will be consolidated to one state update. Ex TotalSupplyState.

Events are better for tracking important actions while States are better for timeseries data in which multiple data points per timestamp would be inconveinent.

### Current Entities

Tracks the most recent state of a contract. Usually references the latest event or state update entity.

### Entity Helpers

Most of the logic regarding manipulation of entities should be in helper functions. Create helper functions based on the following nomenclature as needed.

Prefixes:

- create: create new entity
- get: lookup entity by ID and return entity or throw error
- update: update entity with new properties
- delete: remove entity from subgraph store
- ensure: create or update existing entity. Useful for states
- track: execute contract call and store result in new entity. Useful for data that is not provided via event logs.

### Event Handlers

Process event data and call entity helper functions to update the subgraph. Must register event handlers in `templates/subgraph.yaml`.

### Template spawners

Not all contract addresses are known at the time of subgraph deployment. To track contracts as they are deployed, use contract templates.
Tell the subgraph to watch a newly created contract by calling create() on imports from `generated/templates`. Ex the SetToken factory contract (SetTokenCreator) emits an event when a new SetToken is created, so we register that address as a new SetToken contract to watch. Templates are defined in `templates/subgraph.yaml`.

## Reference

[Discord: Index Co-op #set-subgraph](https://discord.gg/8FYPP7ebbw)

[Subgraph Outline Sheet](https://docs.google.com/spreadsheets/d/1I3sk1kvfCPnnrUUCiBa35DZneeTx0vtGk04B-rKCJVE/edit?usp=sharing)

[Subgraph notes doc](https://docs.google.com/document/d/1inFbQiskHoEKaNYdaHx69-quy8Y2xIva6N3673qw2jA/edit)

[TheGraph Docs](https://thegraph.com/docs/)

[Set Protocol V2 Docs](https://docs.tokensets.com/)

[Set Protocol V2 Contracts](https://github.com/SetProtocol/set-protocol-v2)

[Set Protocol System Diagram](https://drive.google.com/file/d/15ETEqxkjkR29GmWH4gg4ob_OW9lb_Nly/view)

[Hosted API](https://thegraph.com/explorer/subgraph/desert-defi/setprotocolv2)
