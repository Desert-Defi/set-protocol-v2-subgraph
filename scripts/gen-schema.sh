#!/bin/sh

npx ts-node ./scripts/generate-deployment.ts ${NETWORK_NAME}
npx graph codegen