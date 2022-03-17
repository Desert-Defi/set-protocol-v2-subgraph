#!/bin/sh

set -e

# External deployment requires ACCESS_TOKEN
if [ "${DEPLOYMENT}" = "hosted" ] && [ ! -n "${ACCESS_TOKEN}" ]; then
  echo "ERROR: Subgraph access token required for hosted deployments."
  exit 1
fi

# Get subgraph name from deployments.json if not user-provided
if [ -z "${SUBGRAPH_NAME}" ]; then
  echo "No SUBGRAPH_NAME specified, getting subgraph name from target graph network in deployments.json"
  export SUBGRAPH_NAME=$(jq --arg network "${NETWORK_NAME}" '.[$network].subgraphName' deployments.json)
  if [ -z "${SUBGRAPH_NAME}" ]; then
    echo "ERROR: No valid subgraph name found"
    exit 1
  fi
fi

# Install node dependencies (note: into named Docker volume, not on bind mount to host)
npm install --include=dev typescript ts-node handlebars @graphprotocol/graph-cli @graphprotocol/graph-ts

# Wait for graph-node container
if [ "${DEPLOYMENT}" = "local" ]; then
  bash ./scripts/wait-for-it.sh ${GRAPH_NODE_IP} -t 180 -s
fi

# Generate schema artifacts
sh ./scripts/gen-schema.sh
if [ $? != 0 ]; then
  exit 1
fi

if [ "${DEPLOYMENT}" = "local" ]; then
  # Create and deploy subgraph to local graph node
  echo "Create local subgraph ${GITHUB_REPO}/${SUBGRAPH_NAME}"
  # Set access token param if provided
  if [ -n "${ACCESS_TOKEN+1}" ]; then
    ACCESS_TOKEN_ARG="--access-token ${ACCESS_TOKEN}"
  fi
  # Note: DO NOT quote ACCESS_TOKEN_ARG
  npx graph create "${GITHUB_REPO}/${SUBGRAPH_NAME}" --node "http://${GRAPH_NODE_IP}" ${ACCESS_TOKEN_ARG}
  echo "Deploy local subgraph ${GITHUB_REPO}/${SUBGRAPH_NAME}"
  npx graph deploy -l "${SUBGRAPH_VERSION}" "${GITHUB_REPO}/${SUBGRAPH_NAME}" --ipfs "http://${IPFS_IP}" --node "http://${GRAPH_NODE_IP}" ${ACCESS_TOKEN_ARG}
  echo "Deployment complete (press Ctrl+C to stop)"
else
  echo "Deploy subgraph ${GITHUB_REPO}/${SUBGRAPH_NAME} to Hosted Service on network '${NETWORK_NAME}'"
  # Authorize and deploy subgraph to Hosted Service
  npx graph auth "${GRAPH_NODE_IP}" "${ACCESS_TOKEN}"
  npx graph deploy -l "${SUBGRAPH_VERSION}" --product hosted-service "${GITHUB_REPO}/${SUBGRAPH_NAME}"
  echo "Deployment complete"
fi
