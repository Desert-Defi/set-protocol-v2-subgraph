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
import { getSetToken } from '../entities/SetToken';
import { ensureManager } from '../entities/Manager';
import { StreamingFeeModule as StreamingFeeModuleAddr } from '../../generated/addresses';
import { Address } from '@graphprotocol/graph-ts';
import { createIssuanceEvent } from '../entities/IssuanceEvent';
import { createRedemptionEvent } from '../entities/RedemptionEvent';

export function handleManagerEdited(event: ManagerEdited): void {
  let set = getSetToken(event.address.toHexString());
  set.manager = ensureManager(event.params._newManager.toHexString()).id;
  set.save();
}

export function handleDefaultPositionUnitEdited(event: DefaultPositionUnitEdited): void {
  let asset = ensureAsset(event.params._component.toHexString());

  ensureComponentState(
    event.address.toHexString(),
    asset.id,
    event.block.number,
    event.block.timestamp,
    event.params._realUnit
  );
}

export function handleExternalPositionUnitEdited(
  event: ExternalPositionUnitEdited
): void {
  let asset = ensureAsset(event.params._component.toHexString());

  ensureComponentState(
    event.address.toHexString(),
    asset.id,
    event.block.number,
    event.block.timestamp,
    null,
    event.params._realUnit
  );
}

export function handleTransfer(event: Transfer): void {
  if (event.params.from == ZERO_ADDRESS) {
    // handle mint
    createIssuanceEvent(
      event.address.toHexString(),
      event.transaction.hash.toString(),
      event.transactionLogIndex,
      event.block.number,
      event.block.timestamp,
      event.params.value
    );
  } else if (event.params.to == ZERO_ADDRESS) {
    // handle burn
    createRedemptionEvent(
      event.address.toHexString(),
      event.transaction.hash.toString(),
      event.transactionLogIndex,
      event.block.number,
      event.block.timestamp,
      event.params.value
    );
  }
}

// snoop on initialization calls
export function handleModuleInitialized(event: ModuleInitialized): void {
  let set = getSetToken(event.address.toHexString());

  // handle streaming fee
  let addr = Address.fromString(StreamingFeeModuleAddr);
  if (event.params._module == addr) {
    let module = StreamingFeeModule.bind(addr);
    set.maxStreamingFee = module.feeStates(Address.fromString(set.address)).value1;
    set.streamingFee = module.feeStates(Address.fromString(set.address)).value2;
    set.save();
  }
}
