#!/bin/sh

# Install node dependencies (note: into named Docker volume, not on bind mount to host)
npm install --include=dev typescript ts-node handlebars @graphprotocol/graph-cli @graphprotocol/graph-ts

# Instantiate the environment based on target network (e.g., hardhat, hosted)
npx ts-node ./scripts/generate-deployment.ts $NETWORK

# Run graph codegen to produce intermediate artifacts for development
npx graph codegen

# Set access token param if provided
if [ -n "${ACCESS_TOKEN+1}" ]; then
    ACCESS_TOKEN="--access-token $ACCESS_TOKEN"
fi

# TO-DO:
#   - consider paramterizing <repo/graphname> below

echo "Create subgraph"
npx graph create SetProtocol/setprotocolv2 --node ${NODE_IP} ${ACCESS_TOKEN}

echo "Deploy subgraph"
npx graph deploy -l ${SUBGRAPH_VER_LABEL} SetProtocol/setprotocolv2 --ipfs ${IPFS_IP} --node ${NODE_IP} ${ACCESS_TOKEN}
