import { ZERO_ADDRESS } from '../constants';
import {
  ManagerEdited,
  DefaultPositionUnitEdited,
  ExternalPositionUnitEdited,
  Transfer
} from '../../generated/templates/SetToken/SetToken';
import { ensureAsset } from '../entities/Asset';
import { ensureComponentState } from '../entities/ComponentState';
import { requireSetToken } from '../entities/SetToken';
import { ensureTotalSupplyState } from '../entities/TotalSupplyState';

export function handleManagerEdited(event: ManagerEdited): void {
  let set = requireSetToken(event.address.toHexString());
  set.manager = event.params._newManager.toHexString();
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
  // handle mint/burn events
  if (event.params.from == ZERO_ADDRESS) {
    let set = requireSetToken(event.address.toHexString());
    let newSupply = set.totalSupply.plus(event.params.value);
    ensureTotalSupplyState(set.id, event.block.timestamp, newSupply);
    set.totalSupply = newSupply;
    set.save();
  } else if (event.params.to == ZERO_ADDRESS) {
    let set = requireSetToken(event.address.toHexString());
    let newSupply = set.totalSupply.minus(event.params.value);
    ensureTotalSupplyState(set.id, event.block.timestamp, newSupply);
    set.totalSupply = newSupply;
    set.save();
  }
}
