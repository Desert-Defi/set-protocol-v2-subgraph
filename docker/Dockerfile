# Build SetProtocol Subgraph Image
#
# Builds a minimal image with dependencies required for The Graph deployments.
# Expectation is to build in the repo root directory by running, e.g.,
#
#   docker build -t setprotocol/subgraph:${NODE_VER}-slim -f docker/Dockerfile .
#
# This is handled by the task `docker-build` in the Taskfile.

ARG NODE_VER=16

FROM node:${NODE_VER}-slim as base

RUN apt update \
    && apt install -y python3 make gcc g++ openssl git libsecret-1-dev \
    && rm -rf /var/lib/apt/lists/* /tmp/*
