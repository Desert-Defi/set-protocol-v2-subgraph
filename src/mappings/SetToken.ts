import { ZERO_ADDRESS } from '../constants';
import {
  ManagerEdited,
  DefaultPositionUnitEdited,
  ExternalPositionUnitEdited,
  Transfer,
  ModuleInitialized
} from '../../generated/templates/SetToken/SetToken';
import { StreamingFeeModule } from '../../generated/StreamingFeeModule/StreamingFeeModule';
import { ensureAsset } from '../entities/Asset';
import { ensureComponentState } from '../entities/ComponentState';
import { requireSetToken } from '../entities/SetToken';
import { ensureTotalSupplyState } from '../entities/TotalSupplyState';
import { ensureManager } from '../entities/Manager';
import { StreamingFeeModule as StreamingFeeModuleAddr } from '../../generated/addresses';
import { Address, log } from '@graphprotocol/graph-ts';

export function handleManagerEdited(event: ManagerEdited): void {
  let set = requireSetToken(event.address.toHexString());
  set.manager = ensureManager(event.params._newManager.toHexString()).id;
  set.save();
}

export function handleDefaultPositionUnitEdited(event: DefaultPositionUnitEdited): void {
  let set = requireSetToken(event.address.toHexString());
  let asset = ensureAsset(event.params._component.toHexString());

  ensureComponentState(set.id, asset.id, event.block.timestamp, event.params._realUnit);
}

export function handleExternalPositionUnitEdited(
  event: ExternalPositionUnitEdited
): void {
  let set = requireSetToken(event.address.toHexString());
  let asset = ensureAsset(event.params._component.toHexString());

  ensureComponentState(
    set.id,
    asset.id,
    event.block.timestamp,
    null,
    event.params._realUnit
  );
}

export function handleTransfer(event: Transfer): void {
  if (event.params.from == ZERO_ADDRESS) {
    // handle mint
    let set = requireSetToken(event.address.toHexString());
    let newSupply = set.totalSupply.plus(event.params.value);
    ensureTotalSupplyState(set.id, event.block.timestamp, newSupply);
    set.totalSupply = newSupply;
    set.save();
  } else if (event.params.to == ZERO_ADDRESS) {
    // handle burn
    let set = requireSetToken(event.address.toHexString());
    let newSupply = set.totalSupply.minus(event.params.value);
    ensureTotalSupplyState(set.id, event.block.timestamp, newSupply);
    set.totalSupply = newSupply;
    set.save();
  }
}

// snoop on initialization calls
export function handleModuleInitialized(event: ModuleInitialized): void {
  let set = requireSetToken(event.address.toHexString());

  // handle streaming fee
  let addr = Address.fromString(StreamingFeeModuleAddr);
  if (event.params._module == addr) {
    let module = StreamingFeeModule.bind(addr);
    set.maxStreamingFee = module.feeStates(Address.fromString(set.address)).value1;
    set.streamingFee = module.feeStates(Address.fromString(set.address)).value2;
    set.save();
  }
}
