#!/usr/bin/env bash
# Downloads Set Protocol V2 contracts and generates ABI files
# Run from parent folder

wd="$(pwd)"

mkdir -p tmp

cd tmp

contract_wd="$(pwd)/set-protocol-v2"

if [[ ! -d "$contract_wd" ]]; then
  git clone -q --depth=1 https://github.com/SetProtocol/set-protocol-v2

  cd "$contract_wd"

  cp .env.default .env

  yarn

  yarn compile
else
  cd "$contract_wd"
fi

mkdir -p "$wd/abis"

cd artifacts

protocol_contracts=(
  Controller
  SetToken
  IntegrationRegistry
  SetTokenCreator
  PriceOracle
)

for c in "${protocol_contracts[@]}"; do
  cp "contracts/protocol/$c.sol/$c.json" "$wd/abis"
done

module_contracts=(
  BasicIssuanceModule
  StreamingFeeModule
  NAVIssuanceModule
  TradeModule
  WrapModule
  SingleIndexModule
)

for c in "${module_contracts[@]}"; do
  cp "contracts/protocol/modules/$c.sol/$c.json" "$wd/abis"
done

cp @openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json "$wd/abis"

rm -rf "$wd/tmp"