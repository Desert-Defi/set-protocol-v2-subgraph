# Set Protocol V2 Subgraph

## Install

1. `yarn install`
2. `yarn codegen`
3. (If deploying to hosted service) `yarn graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>`
4. (If Set Protocol contract ABI changed) `yarn generate-abis`

## Commands

Generate types (if schema or ABI changed):

`yarn codegen`

Compile subgraph:

`yarn build`

Deploy to hosted service:

`yarn deploy`

Deploy to localhost Graph node:

`yarn create-local` if first time, then:

`yarn deploy-local`

Deploy to Graph node by IP:

`yarn deploy-to <IP>`

Format code:

`yarn lint`

Pull contract ABIs from Set Protocol V2 repo (only needed if changed):

`yarn generate-abis`

## Reference

[Discord: Index Co-op #set-subgraph](https://discord.gg/8FYPP7ebbw)

[Subgraph Plan](https://docs.google.com/spreadsheets/d/1I3sk1kvfCPnnrUUCiBa35DZneeTx0vtGk04B-rKCJVE/edit#gid=0)

[Subgraph notes](https://docs.google.com/document/d/1c2-JrZFc4WJxm_6X7Uj5kNXKNkZ_ZAzsS08Mv7UfVaw/edit?usp=sharing)

[TheGraph Docs](https://thegraph.com/docs/)

[Set Protocol V2 Contracts](https://github.com/SetProtocol/set-protocol-v2-contracts)

[Set Protocol System Diagram](https://drive.google.com/file/d/15ETEqxkjkR29GmWH4gg4ob_OW9lb_Nly/view)

[Hosted API](https://thegraph.com/explorer/subgraph/desert-defi/setprotocolv2)

## Development

### Local Graph Node

Set up Turbogeth (min 1.5TB SSD free space):

1. `git clone -q --depth=1 https://github.com/ledgerwatch/turbo-geth.git && cd turbo-geth`
2. `sudo docker-compose build`
3. `sudo XDG_DATA_HOME=/preferred/data/folder docker-compose up -d`

Set up Graph Node

1. `git clone -q --depth=1 https://github.com/graphprotocol/graph-node.git && cd graph-node/docker`
2. `sudo bash setup.sh`
3. `sudo docker-compose up -d`

Watch logs:

`sudo docker logs $(sudo docker container ls | grep graph-node | cut -d' ' -f1) -f --since 10m`
