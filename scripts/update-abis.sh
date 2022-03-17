#!/bin/bash

set -e

PROTOCOL_REPO_URL="https://github.com/SetProtocol/set-protocol-v2"
STRATEGIES_REPO_URL="https://github.com/SetProtocol/set-v2-strategies"

# Remove existing ABIs
if [ ! -z "$(ls -A /subgraph/abis)" ]; then
  echo "WARNING: Existing ABIs found. Removing..."
  rm -rf /subgraph/abis/*
fi

# Clone and compile the Set Protocol V2 contracts repo
cd /tmp
git clone -q --depth=1 "${PROTOCOL_REPO_URL}"
cd $(echo "${PROTOCOL_REPO_URL}" | rev | cut -d"/" -f1 | rev)
cp .env.default .env
yarn && yarn compile
cd artifacts

# Define the Set contracts of interest for the subgraph development
PROTOCOL_CONTRACTS=(
  SetToken
  SetTokenCreator
)

# Define the Set module contracts of interest for the subgraph development
MODULE_CONTRACTS=(
  StreamingFeeModule
  TradeModule
)

# Copy the contract ABI code into the bind mounted working directory
for c in "${PROTOCOL_CONTRACTS[@]}"; do
  cp "contracts/protocol/$c.sol/$c.json" "/subgraph/abis"
done
for c in "${MODULE_CONTRACTS[@]}"; do
  cp "contracts/protocol/modules/$c.sol/$c.json" "/subgraph/abis"
done

# Clone and compile the Set V2 Strategies contracts repo
cd /tmp
git clone -q --depth=1 "${STRATEGIES_REPO_URL}"
cd $(echo "${STRATEGIES_REPO_URL}" | rev | cut -d"/" -f1 | rev)
cp .env.default .env
yarn && yarn compile
cd artifacts

# Define the Set manager contracts of interest for the subgraph development
MANAGER_CONTRACTS=(
  DelegatedManager
)

# Copy the contract ABI code into the bind mounted working directory
for c in "${MANAGER_CONTRACTS[@]}"; do
  cp "contracts/manager/$c.sol/$c.json" "/subgraph/abis"
done