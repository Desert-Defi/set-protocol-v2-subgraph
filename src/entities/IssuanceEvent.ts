import { IssuanceEvent } from '../../generated/schema';
import { BigInt, log } from '@graphprotocol/graph-ts';
import { getID } from '../utils/getID';
import { ensureTotalSupplyState } from './TotalSupplyState';
import { getSetToken } from './SetToken';

export function createIssuanceEvent(
  setID: string,
  txID: string,
  logIndex: BigInt,
  blockNumber: BigInt,
  timestamp: BigInt,
  quantity: BigInt
): IssuanceEvent {
  let set = getSetToken(setID);

  // update total supply
  let newSupply = set.totalSupply.plus(quantity);
  ensureTotalSupplyState(set.id, blockNumber, timestamp, newSupply);
  set.totalSupply = newSupply;
  set.save();

  let id = getID([txID, logIndex.toString()]);
  let i = new IssuanceEvent(id);
  i.setToken = setID;
  i.txID = txID;
  i.logIndex = logIndex;
  i.blockNumber = blockNumber;
  i.timestamp = timestamp;
  i.quantity = quantity;
  i.save();
  return i;
}

export function getIssuance(id: string): IssuanceEvent {
  let entity = IssuanceEvent.load(id);
  if (entity == null) log.critical('IssuanceEvent not found for {}', [id]);
  return entity as IssuanceEvent;
}
