# Set Protocol V2 Subgraph

Indexer of Set Protocol v2 events. Built on [The Graph](https://thegraph.com/).

## **Setup**
---

### **Requirements:**

- Docker >= 20.10

---
### **Local Deployment (hardhat)**

#### **Step 0:** Deploy the hardhat network and graph node
---

> **NOTE**  This step will eventually be wrapped into a containerized deployment process, thus the naming convention of _Step 0_.

_**Clone Set Protocol v2 fork**_

In separate directory, clone the subgraph branch of the Set Protocol V2 repo:

1. `git clone https://github.com/SetProtocol/set-protocol-v2.git -b subgraph-dev && cd set-protocol-v2`
2. `cp .env.default .env`
3. `yarn install`

Run the hardhat node then deploy mock tests to execute a minimal set of events:

1. `yarn chain --hostname 0.0.0.0`
2. Wait for node to start
3. (in separate terminal) `yarn deploy-mock`

_**Install Graph Node**_

In separate directory:

1. `git clone -q --depth=1 https://github.com/graphprotocol/graph-node.git && cd graph-node/docker`
2. Edit line 20 of docker-compose.yml to `ethereum: hardhat:http://host.docker.internal:8545` (May need to replace host.docker.internal with LAN IP on some Linux distros; Mac users should be okay.)
3. Run with `docker-compose up` (or use `sudo` if your user does not have docker group access)

Run `rm -rf ./data` and restart containers if blockchain changes or you want to re-load the subgraph from scratch.

Run `docker-compose build` if updated via `git pull`.


#### **Step 1:** Clone the subgraph repo
---

```sh
git clone https://github.com/SetProtocol/set-protocol-v2-subgraph.git
cd set-protocol-v2-subgraph
cp subgraph.env.default subgraph.env
```

> **NOTE:**  Edit `subgraph.env` to target specific versions of node, network endpoints, etc., as required for your deployment.

#### **Step 2:** Build the Docker subgraph image
---

The following command builds a local Docker image tagged `setprotocol/subgraph:node-<NODE_VER>` where the `NODE_VER` is defined in `subgraph.env`.

```sh
task docker-build
```

#### **Step 3:** Pull, compile, and copy the Set Protocol ABIs
---

The following command runs a temp container to clone the Set Protocol V2 repo, compile the contracts, and extract a set of target ABIs (defined in `scripts/update-abis.sh`) into an `abi/` folder in the root directory.

```sh
task gen-abi
```

> **NOTE:**  The Set Protocol V2 repo only compiles against node versions 16 and below at this time.

#### **Step 4:** Create and deploy the subgraph
---

The following command will install node dependencies into a named Docker volume, build the subgraph mappings, create the subgraph, then deploy it to the target graph node and IPFS databse. Not that consecutive runs of this command will use the existing named volume for the node_modules unless it is manually removed.

```sh
task deploy-local
```

You can remove the named volume using:

```sh
docker volume rm docker_setprotocol-subgraph-node_modules
```

---
## **Key Files**

`subgraph.env` - environment variables defining the runtime parameters

`schema.graphql` - Subgraph schema

`templates/subgraph.yaml` - configure watched contracts and events

`deployments.json` - configure deployed contract addresses

`src/` - [AssemblyScript](https://www.assemblyscript.org) code for subgraph handlers

`src/mappings/` - Event handlers

`src/entities/` - Entity helper functions

---
## **Design**

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
