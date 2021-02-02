import { BigInt, log, store } from '@graphprotocol/graph-ts';
import {
  ComponentAdded,
  ComponentRemoved
} from '../../generated/templates/SetToken/SetToken';
import { SetToken, Component } from '../../generated/schema';
import { useAsset } from '../entities/Asset';

export function handleComponentAdded(event: ComponentAdded): void {
  let st = SetToken.load(event.address.toString());
  if (st == null) {
    log.warning('SetToken not found for {}', [event.address.toString()]);
    return;
  }
  let asset = useAsset(event.params._component.toString());
  let c = new Component(st.id + '/' + asset.id);
  c.asset = asset.id;
  c.setToken = st.id;
  c.units = BigInt.fromI32(0);
  c.save();
}

export function handleComponentRemoved(event: ComponentRemoved): void {
  let st = SetToken.load(event.address.toString());
  if (st == null) {
    log.warning('SetToken not found for {}', [event.address.toString()]);
    return;
  }
  let id = st.id + '/' + event.params._component.toString();
  let c = Component.load(id);
  if (c == null) {
    log.warning('Component not found for {}', [id]);
    return;
  }
  store.remove('Component', id);
}
