#!/bin/bash

set -e

REPO_URL="https://github.com/SetProtocol/set-protocol-v2"

# Remove existing ABIs
if [ ! -z "$(ls -A /subgraph/abis)" ]; then
  echo "WARNING: Existing ABIs found. Removing..."
  rm -rf /subgraph/abis/*
fi

# Clone and compile the Set Protocol V2 contracts repo
cd /tmp
git clone -q --depth=1 "${REPO_URL}"
cd $(echo "${REPO_URL}" | rev | cut -d"/" -f1 | rev)
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