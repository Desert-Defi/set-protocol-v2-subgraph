#!/bin/bash

set -e

if [ ! -d "set-protocol-v2" ]; then
    git clone -q https://github.com/SetProtocol/set-protocol-v2.git
fi

cd set-protocol-v2

# Set up default env vars as required
if [ ! -f ".env" ]; then
    cp .env.default .env
fi

# Install the dependencies
yarn install
