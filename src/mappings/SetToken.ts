import { BigInt, log, store } from '@graphprotocol/graph-ts';
import {
  ComponentAdded,
  ComponentRemoved
} from '../../generated/templates/SetToken/SetToken';
import { Asset, SetToken, Component } from '../../generated/schema';
import { useAsset } from '../entities/Asset';

export function handleComponentAdded(event: ComponentAdded) {
  const st = SetToken.load(event.address.toString());
  if (st == null) {
    log.warning('SetToken not found for {}', [event.address.toString()]);
    return;
  }
  const asset = useAsset(event.params._component.toString());
  const c = new Component(st.id + '/' + asset.id);
  c.asset = asset.id;
  c.setToken = st.id;
  c.units = BigInt.fromI32(0);
  c.save();
}

export function handleComponentRemoved(event: ComponentRemoved) {
  const st = SetToken.load(event.address.toString());
  if (st == null) {
    log.warning('SetToken not found for {}', [event.address.toString()]);
    return;
  }
  const id = st.id + '/' + event.params._component.toString();
  const c = Component.load(id);
  if (c == null) {
    log.warning('Component not found for {}', [id]);
    return;
  }
  store.remove('Component', id);
}
