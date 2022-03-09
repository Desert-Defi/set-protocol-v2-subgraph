#!/bin/bash

set -e

if [ ! -d "set-protocol-v2" ]; then
    git clone -q https://github.com/SetProtocol/set-protocol-v2.git -b subgraph-dev
fi

cd set-protocol-v2

# Ensure we're in the correct branch
if [ $(git rev-parse --abbrev-ref HEAD) != "subgraph-dev" ]; then
    git checkout subgraph-dev
fi

# Set up default env vars as required
if [ ! -f ".env" ]; then
    cp .env.default .env
fi

# Deploy the network
yarn install
nohup yarn chain --hostname 0.0.0.0 &

# Wait for network deployment
bash /scripts/wait-for-it.sh "localhost:${HARDHAT_PORT}" -t 20

# Run set of mock tests for subgraph
yarn deploy-mock

# Wait indefinitely to keep node alive
tail -F /dev/null
