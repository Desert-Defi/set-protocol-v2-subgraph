#!/bin/bash

set -e

cd set-protocol-v2

if [ ! -f "/tmp/${TEST_SCRIPT}" ]; then
  echo "ERROR: Invalid test script."
  return -1
else
  mkdir -p ./test/subgraph
  cp "/tmp/${TEST_SCRIPT}" ./test/subgraph/
fi

yarn chain --hostname 0.0.0.0 &

# Wait for network deployment
bash /app/scripts/wait-for-it.sh "localhost:${HARDHAT_PORT}" -t 20

npx hardhat test --no-compile "./test/subgraph/${TEST_SCRIPT}" --network localhost

# Wait indefinitely to keep node alive
tail -F /dev/null

