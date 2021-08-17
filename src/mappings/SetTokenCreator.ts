import { SetTokenCreated } from '../../generated/SetTokenCreator/SetTokenCreator';
import { SetToken as SetTokenTemplate } from '../../generated/templates';
// import { SetToken as SetTokenContract } from '../../generated/templates/SetToken/SetToken';
import { SetToken } from '../../generated/schema';
// import { ensureAsset } from '../entities/Asset';
// import { ensurePortfolioState } from '../entities/PortfolioState';
// import { ensureComponentState } from '../entities/ComponentState';
// import { BigInt } from '@graphprotocol/graph-ts';
// import { ensureTotalSupplyState } from '../entities/TotalSupplyState';
import { incrementSetTokenCount } from '../entities/SetTokenCount';
import { ensureManager } from '../entities/Manager';

export function handleSetTokenCreated(event: SetTokenCreated): void {
  let id = event.params._setToken.toHexString();
  let set = new SetToken(id);
  set.inception = event.block.timestamp;
  set.manager = ensureManager(event.params._manager.toHexString()).id;
  set.name = event.params._name;
  set.symbol = event.params._symbol;
  set.address = id;
  // set.portfolio = ensurePortfolioState(
  //   id,
  //   event.block.number,
  //   event.block.timestamp,
  //   []
  // ).id;
  // set.totalSupply = BigInt.fromI32(0);
  // ensureTotalSupplyState(
  //   id,
  //   event.block.number,
  //   event.block.timestamp,
  //   BigInt.fromI32(0)
  // );
  set.save();

  incrementSetTokenCount();

  // populate initial default positions
  // let contract = SetTokenContract.bind(event.params._setToken);
  // let components = contract.getComponents();
  // let componentStateIDs: string[] = [];
  // for (let i = 0; i < components.length; i++) {
  //   let asset = ensureAsset(components[i].toHexString());
  //   componentStateIDs.push(
  //     ensureComponentState(
  //       id,
  //       asset.id,
  //       event.block.number,
  //       event.block.timestamp,
  //       contract.getTotalComponentRealUnits(components[i])
  //     ).id
  //   );
  // }

  // watch new SetToken contract
  SetTokenTemplate.create(event.params._setToken);
}
