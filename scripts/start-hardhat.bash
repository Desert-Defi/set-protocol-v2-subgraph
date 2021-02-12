#!/usr/bin/env bash
# Starts Hardhat node with auto-restart if crashed
# Run from parent folder

URL="${1:?ERROR - missing Ethereum node RPC URL}"

node() {
  ETHEREUM_NODE_URL=$URL yarn hardhat node --port 8546
}

until node; do
    echo "Hardhat crashed with exit code $?.  Respawning.." >&2
    sleep 1
done