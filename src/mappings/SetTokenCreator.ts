import { SetTokenCreated } from '../../generated/templates/SetTokenCreator/SetTokenCreator';
import { SetToken as SetTokenTemplate } from '../../generated/templates';
import { SetToken as SetTokenContract } from '../../generated/templates/SetToken/SetToken';
import { SetToken, Component } from '../../generated/schema';
import { useAsset } from '../entities/Asset';
import { BigInt } from '@graphprotocol/graph-ts';

export function handleSetTokenCreated(event: SetTokenCreated): void {
  let id = event.params._setToken.toHexString();
  let set = new SetToken(id);
  set.inception = event.block.timestamp;
  set.manager = event.params._manager.toHexString();
  set.name = event.params._name;
  set.symbol = event.params._symbol;
  set.address = id;
  set.totalSupply = BigInt.fromI32(0);

  // get initial components
  let contract = SetTokenContract.bind(event.params._setToken);
  let components = contract.getComponents();
  for (let i = 0; i < components.length; i++) {
    let asset = useAsset(components[i].toHexString());
    let comp = new Component(set.id + '/' + asset.id);
    comp.asset = asset.id;
    comp.units = contract.getTotalComponentRealUnits(components[i]);
    comp.setToken = set.id;
    comp.save();
  }

  set.save();

  // watch new SetToken contract
  SetTokenTemplate.create(event.params._setToken);
}
