import { Asset } from '../../generated/schema';
import { log, Address } from '@graphprotocol/graph-ts';
import { ERC20 } from '../../generated/templates/SetToken/ERC20';
import { ERC20_bytes32 } from '../../generated/templates/SetToken/ERC20_bytes32';

export function useAsset(address: string): Asset {
  const asset = Asset.load(address.toString()) as Asset;
  if (asset != null) {
    return asset;
  }

  const contract = ERC20.bind(Address.fromString(address));
  let name = '';
  let symbol = '';
  let decimals = 18;

  const decimalsCall = contract.try_decimals();
  if (decimalsCall.reverted) log.warning('decimals() call reverted for {}', [address]);
  decimals = decimalsCall.value;

  const nameCall = contract.try_name();
  if (nameCall.reverted) {
    // try bytes32 ERC20
    const contract2 = ERC20_bytes32.bind(Address.fromString(address));
    const nameCall2 = contract.try_name();
    if (nameCall2.reverted) log.warning('name() call reverted for {}', [address]);
    name = nameCall2.value.toString();
    const symbolCall = contract2.try_symbol();
    if (symbolCall.reverted) log.warning('symbol() call reverted for {}', [address]);
    symbol = symbolCall.value.toString();
  } else {
    name = nameCall.value;
    const symbolCall = contract.try_symbol();
    if (symbolCall.reverted) log.warning('symbol() call reverted for {}', [address]);
    symbol = symbolCall.value;
  }

  const a = new Asset(address);
  a.address = address;
  a.decimals = decimals;
  a.name = name;
  a.symbol = symbol;
  a.save();
  return a;
}
