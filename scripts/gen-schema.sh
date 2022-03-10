#!/bin/sh

if [ -d "./build" ]; then
  rm -rf ./build
fi

if [ -d "./generated" ]; then
  rm -rf ./generated
fi

# Instantiate the environment based on target network (e.g., hardhat, hosted)
npx ts-node ./scripts/generate-deployment.ts ${NETWORK_NAME}

# Run graph codegen to produce intermediate artifacts for development
npx graph codegen
