#!/bin/sh

set -e

# Install node dependencies (note: into named Docker volume, not on bind mount to host)
npm install --include=dev typescript ts-node handlebars @graphprotocol/graph-cli @graphprotocol/graph-ts

# Wait for graph-node container
if [ "${DEPLOYMENT}" = "local" ]; then
    bash ./scripts/wait-for-it.sh ${GRAPH_NODE_IP} -t 180
fi

# Generate schema artifacts
sh ./scripts/gen-schema.sh

# Set access token param if provided
if [ -n "${ACCESS_TOKEN+1}" ]; then
    ACCESS_TOKEN_ARG="--access-token ${ACCESS_TOKEN}"
fi

if [ "${DEPLOYMENT}" = "local" ]; then
    # Create and deploy subgraph to local graph node
    echo "Create subgraph locally"
    # Note: DO NOT quote ACCESS_TOKEN_ARG
    npx graph create "${GITHUB_REPO}/${GRAPH_NAME}" --node "http://${GRAPH_NODE_IP}" ${ACCESS_TOKEN_ARG}
    echo "Deploy subgraph"
    npx graph deploy -l "${SUBGRAPH_VERSION}" "${GITHUB_REPO}/${GRAPH_NAME}" --ipfs "http://${IPFS_IP}" --node "http://${GRAPH_NODE_IP}" ${ACCESS_TOKEN_ARG}
    echo "Deployment complete (press Ctrl+C to stop)"
else
    # TO-DO: external deployments are untested
    # Authorize and deploy subgraph to Hosted Service
    npx graph auth "${GRAPH_NODE_IP}" "${ACCESS_TOKEN}"
    npx graph deploy --product hosted-service "${GITHUB_REPO}/${GRAPH_NAME}"
fi
