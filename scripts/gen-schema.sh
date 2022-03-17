#!/bin/sh

if [ -d "./build" ]; then
  rm -rf ./build
fi

if [ -d "./generated" ]; then
  rm -rf ./generated
fi

# Instantiate the environment based on target network (e.g., hardhat, hosted)
npx ts-node ./scripts/generate-deployment.ts ${NETWORK_NAME}

if [ $? != 0 ]; then
  echo "ERROR: Failed to generate deployment"
  exit 1
fi

# Run graph codegen to produce intermediate artifacts for development
npx graph codegen
