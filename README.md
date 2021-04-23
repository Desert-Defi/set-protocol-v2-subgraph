# Set Protocol V2 Subgraph

Indexer of Set Protocol v2 events. Built on [The Graph](https://thegraph.com/).

## Setup

Requirements:

- [Bash >= 5.0](https://gist.github.com/Rican7/44081a9806595704fa7b289c32fcd62c)
- [Node.js >= 14.0](https://nodejs.org/en/download/)
- [Yarn >= 1.22](https://yarnpkg.com)
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

1. `git clone https://github.com/jgrizzled/set-protocol-v2.git -b subgraph-dev && cd set-protocol-v2`
2. `cp .env.default .env`
3. `yarn install`
4. `yarn chain`
5. `yarn deploy-mock`

Restart `yarn chain` if redeploying.

### Install Graph Node

1. `git clone -q --depth=1 https://github.com/graphprotocol/graph-node.git && cd graph-node/docker`
2. Edit line 20 of docker-compose.yml to `ethereum: hardhat:http://host.docker.internal:8545` (May need to replace host.docker.internal with local IP)
3. Run with `sudo docker-compose up`

`rm -rf ./data` and restart containers if hardhat chain changes

`sudo docker-compose build` if updated via `git pull`

### Deploy subgraph locally

1. `yarn gen-deployment hardhat`
2. `yarn deploy-local`

Graph-node may take a few minutes to sync the subgraph.

Visit `http://localhost:8000/subgraphs/name/desert-defi/setprotocolv2/graphql` to view subgraph data

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

[Subgraph notes](https://docs.google.com/document/d/1inFbQiskHoEKaNYdaHx69-quy8Y2xIva6N3673qw2jA/edit)

[TheGraph Docs](https://thegraph.com/docs/)

[Set Protocol V2 Docs](https://docs.tokensets.com/)

[Set Protocol V2 Contracts](https://github.com/SetProtocol/set-protocol-v2-contracts)

[Set Protocol System Diagram](https://drive.google.com/file/d/15ETEqxkjkR29GmWH4gg4ob_OW9lb_Nly/view)

[Hosted API](https://thegraph.com/explorer/subgraph/desert-defi/setprotocolv2)
