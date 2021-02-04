import { Asset } from '../../generated/schema';
import { log, Address } from '@graphprotocol/graph-ts';
import { ERC20 } from '../../generated/templates/SetToken/ERC20';
import { ERC20_bytes32 } from '../../generated/templates/SetToken/ERC20_bytes32';

export function useAsset(address: string): Asset {
  let asset = Asset.load(address) as Asset;
  if (asset != null) {
    return asset;
  }

  let contract = ERC20.bind(Address.fromString(address));
  let name = '';
  let symbol = '';
  let decimals = 18;

  let decimalsCall = contract.try_decimals();
  if (decimalsCall.reverted) log.warning('decimals() call reverted for {}', [address]);
  decimals = decimalsCall.value;

  let nameCall = contract.try_name();
  if (nameCall.reverted) {
    // try bytes32 ERC20
    let contract2 = ERC20_bytes32.bind(Address.fromString(address));
    let nameCall2 = contract2.try_name();
    if (nameCall2.reverted) log.warning('name() call reverted for {}', [address]);
    name = nameCall2.value.toString();
    let symbolCall = contract2.try_symbol();
    if (symbolCall.reverted) log.warning('symbol() call reverted for {}', [address]);
    symbol = symbolCall.value.toString();
  } else {
    name = nameCall.value;
    let symbolCall = contract.try_symbol();
    if (symbolCall.reverted) log.warning('symbol() call reverted for {}', [address]);
    symbol = symbolCall.value;
  }

  let a = new Asset(address);
  a.address = address;
  a.decimals = decimals;
  a.name = name;
  a.symbol = symbol;
  a.save();
  return a;
}
