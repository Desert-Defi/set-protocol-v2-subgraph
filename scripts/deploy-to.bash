#!/usr/bin/env bash
# Deploys to supplied IP address

IP="${1:?ERROR - missing IP}"

yarn run graph create desert-defi/setprotocolv2 --node http://$IP:8020
yarn run graph deploy desert-defi/setprotocolv2 --ipfs http://$IP:5001 --node http://$IP:8020