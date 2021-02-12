import { Address, BigInt, log, store } from '@graphprotocol/graph-ts';
import { ZERO_ADDRESS } from '../utils/constants';
import {
  ComponentAdded,
  ComponentRemoved,
  ManagerEdited,
  DefaultPositionUnitEdited,
  ExternalPositionUnitEdited,
  Transfer
} from '../../generated/templates/SetToken/SetToken';
import { useAsset } from '../entities/Asset';
import { useSetToken } from '../entities/SetToken';
import { Component } from '../../generated/schema';

export function handleComponentAdded(event: ComponentAdded): void {
  let set = useSetToken(event.address.toHexString());
  let asset = useAsset(event.params._component.toHexString());
  let c = new Component(set.id + '/' + asset.id);
  c.asset = asset.id;
  c.setToken = set.id;
  c.units = BigInt.fromI32(0);
  c.save();
}

export function handleComponentRemoved(event: ComponentRemoved): void {
  let set = useSetToken(event.address.toHexString());
  let id = set.id + '/' + event.params._component.toHexString();
  store.remove('Component', id);
}

export function handleManagerEdited(event: ManagerEdited): void {
  let set = useSetToken(event.address.toHexString());
  set.manager = event.params._newManager.toHexString();
  set.save();
}

export function handleDefaultPositionUnitEdited(event: DefaultPositionUnitEdited): void {
  let set = useSetToken(event.address.toHexString());
  let id = set.id + '/' + event.params._component.toHexString();
  let component = Component.load(id);
  if (component == null) {
    log.warning('Component not found for {}', [id]);
    return;
  }
  component.units = event.params._realUnit;
  component.save();
}

export function handleExternalPositionUnitEdited(
  event: ExternalPositionUnitEdited
): void {
  let set = useSetToken(event.address.toHexString());
  let id = set.id + '/' + event.params._component.toHexString();
  let component = Component.load(id);
  if (component == null) {
    log.warning('Component not found for {}', [id]);
    return;
  }
  component.units = event.params._realUnit;
  component.save();
}

export function handleTransfer(event: Transfer): void {
  // handle mint/burn events
  if (event.params.from == ZERO_ADDRESS) {
    let set = useSetToken(event.address.toHexString());
    set.totalSupply = set.totalSupply.plus(event.params.value);
    set.save();
  } else if (event.params.to == ZERO_ADDRESS) {
    let set = useSetToken(event.address.toHexString());
    set.totalSupply = set.totalSupply.minus(event.params.value);
    set.save();
  }
}
