# Set Protocol V2 Subgraph

Indexer of Set Protocol v2 events. Built on [The Graph](https://thegraph.com/).

<!--
[TO-DO] CONTENTS (herein or external):
- Tutorials
    - Deploy a local subgraph
    - Deploy a subgraph to Hosted Service
    - Deploy a subgraph to Subgraph Studio
- How-To Guides
    - Update the subgraph schema
    - Update the subgraph mappings
    - Test the subgraph locally
    - Set up a Postman query
- Technical Reference
    - Docker compose usage
    - Task usage
- Background Information
    - Schema structure
    - Query structure
-->

## SETUP

### Requirements:

- Docker >= 20.10

### Local Deployment (Hardhat)

1. Build the Set Protocol Docker base and hardhat images

    `task docker-build`

1. Deploy a Hardhat node and custom script to the network

    `task deploy-hardhat -- /full/path/to/test/script.ts`

    e.g., deploy the subgraph test state setup script with

    `task deploy-hardhat -- $(pwd)/test/deploy-state.ts`

1. Monitor the Hardhat node until fully deployed and tests are executed

1. In a new terminal, compile the Set Protocol ABIs

    `task gen-abi`

1. Deploy local subgraph

    `task deploy-local`

1. Once deployed, query the subgraph in the browser at (by default) http://127.0.0.1:8000/subgraphs/name/SetProtocol/set-protocol-v2

    Example query to run can be found in `test/sample-query.txt`

### External Deployment to Hosted Service

1. Build the Set Protocol Docker base and hardhat images

    `task docker-build`

1. Deploy hosted subgraph to network specified by the `NETWORK_HOSTED` environment variable in dotenv

    `task deploy-hosted [-- SUBGRAPH_ACCESS_TOKEN]`

### [TO-DO] External Deployment to Subgraph Studio

TBD

## USAGE

Available tasks for this project:

| COMMAND [OPTS]                             | DESCRIPTION |
|--------------------------------------------|---------------------------------------------------------------------------------|
| `clean [-- all\|subgraph\|hardhat]`        | Clean up local subgraph deployment; `all` arg additionally removes all volumes and the Hardhat node. |
| `deploy-hardhat -- /path/to/file.ts`       | Deploy a local Hardhat node and run a test script. Must specify full path to file as task input argument. |
| `deploy-hosted [-- SUBGRAPH_ACCESS_TOKEN]` | Build and deploy subgraph on Hosted Service. `SUBGRAPH_ACCESS_TOKEN` must be provided or defined in a private dotenv. |
| `deploy-local [-- detach]`                 | Build and deploy subgraph on local network; `detach` runs container detached. |
| `docker-build`                             | Build subgraph Docker image on defined node version base (default: 16-slim). |
| `gen-abi`                                  | Pull latest Set Protocol ABIs into the build environment. |
| `gen-schema [-- hosted]`                   | Compile the subgraph schema but do not deploy the subgraph; default target subgraph network is hardhat. |

## [TO-DO] ADVANCED DEPLOYMENT GUIDES

TBD: Ideas to be covered in this section

- custom override of args (requires custom untracked .env configs or CLI arg overrides)
- the [Set Protocol V2 repo](https://github.com/SetProtocol/set-protocol-v2.git) currently requires node <= 16; therefore, Node 16 is the default target base image used in the Subgraph Docker image.
- node dependencies installation into a named Docker volume, build the subgraph mappings, create the subgraph, then deploy it to the target graph node and IPFS database. Not that consecutive runs of this command will use the existing named volume for the `node_modules` unless it is manually removed.
- the subgraph is deployed to the local graph-node and IPFS containers defined in the `subgraph.env` file. The subgraph endpoints given by the deployment are relative to the Docker container and not accessible externally as given. To access the subgraph, instead navigate to: http://127.0.0.1:8000/subgraphs/name/SetProtocol/setprotocolv2.

## [TO-DO] SUBGRAPH DEVELOPMENT

### [TEMP] Dev Notes

- Each named dataSource or template entry should be in its own mappings/<entity>.ts file
- Entity names cannot end with "s" due to conflict with query API (not currently documented)
- Use `setToken` for schema fields, not `set` as will conflict will built-in callers
- Templates must be initialized appropriately (see `ModuleInitialize` event handler for example)


`ModuleInitialized` Event Notes
- `event.address` - `ModuleInitialized` module contract address
- `event.transaction.hash` - hash of the call transaction that triggered the event
- `event.params._module` - the initialized module contract address


### Reference Guide

To Be Completed

#### Key Files

`schema.graphql` - Subgraph schema

`templates/subgraph.yaml` - configure watched contracts and events

`deployments.json` - configure deployed contract addresses

`src/` - [AssemblyScript](https://www.assemblyscript.org) code for subgraph handlers

`src/mappings/` - Event handlers

`src/utils/` - Entity helper functions and other utilities

#### Historical Entities

##### Events

Individual transaction log events referenced by TxID and log index. Can have multiple events of the same type with the same timestamp (IE same block). Ex TradeEvent.

##### States

Final state of an entity at the end of a block. Referenced by block number. Multiple events in the same block will be consolidated to one state update. Ex TotalSupplyState.

Events are better for tracking important actions while States are better for timeseries data in which multiple data points per timestamp would be inconveinent.

##### Current Entities

Tracks the most recent state of a contract. Usually references the latest event or state update entity.

##### Entity Helpers

Most of the logic regarding manipulation of entities should be in helper functions. Create helper functions based on the following nomenclature as needed.

Prefixes:

- create: create new entity
- get: lookup entity by ID and return entity or throw error
- update: update entity with new properties
- delete: remove entity from subgraph store
- ensure: create or update existing entity. Useful for states
- track: execute contract call and store result in new entity. Useful for data that is not provided via event logs.

#### Event/Call/Block Handlers

Process events, smart contract function calls, and block data to update the subgraph. Must register handlers in `templates/subgraph.yaml`.

#### Template spawners

Not all contract addresses are known at the time of subgraph deployment. To track contracts as they are deployed, use contract templates.
Tell the subgraph to watch a newly created contract by calling `create()` on imports from `generated/templates`. For example, the SetToken factory contract (SetTokenCreator) emits an event when a new SetToken is created, so we register that address as a new SetToken contract to watch. Templates are defined in `templates/subgraph.yaml`.

## References

[Discord: Index Co-op #set-subgraph](https://discord.gg/8FYPP7ebbw)

[Subgraph Outline Sheet](https://docs.google.com/spreadsheets/d/1I3sk1kvfCPnnrUUCiBa35DZneeTx0vtGk04B-rKCJVE/edit?usp=sharing)

[Subgraph notes doc](https://docs.google.com/document/d/1inFbQiskHoEKaNYdaHx69-quy8Y2xIva6N3673qw2jA/edit)

[TheGraph Docs](https://thegraph.com/docs/)

[Set Protocol V2 Docs](https://docs.tokensets.com/)

[Set Protocol V2 Contracts](https://github.com/SetProtocol/set-protocol-v2)

[Set Protocol System Diagram](https://drive.google.com/file/d/15ETEqxkjkR29GmWH4gg4ob_OW9lb_Nly/view)

[Hosted API](https://thegraph.com/explorer/subgraph/desert-defi/setprotocolv2)
