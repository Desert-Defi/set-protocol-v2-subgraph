import { RedemptionEvent } from '../../generated/schema';
import { BigInt, log } from '@graphprotocol/graph-ts';
import { getID } from '../utils/getID';
import { getSetToken } from './SetToken';
import { ensureTotalSupplyState } from './TotalSupplyState';

// create or update Redemption
export function createRedemptionEvent(
  setID: string,
  txID: string,
  logIndex: BigInt,
  blockNumber: BigInt,
  timestamp: BigInt,
  quantity: BigInt
): RedemptionEvent {
  let set = getSetToken(setID);

  // update total supply
  let newSupply = set.totalSupply.minus(quantity);
  ensureTotalSupplyState(set.id, blockNumber, timestamp, newSupply);
  set.totalSupply = newSupply;
  set.save();

  let id = getID([txID, logIndex.toString()]);
  let i = new RedemptionEvent(id);
  i.setToken = setID;
  i.txID = txID;
  i.logIndex = logIndex;
  i.blockNumber = blockNumber;
  i.timestamp = timestamp;
  i.quantity = quantity;
  i.save();
  return i;
}

export function getRedemptionEvent(id: string): RedemptionEvent {
  let entity = RedemptionEvent.load(id);
  if (entity == null) log.critical('Redemption not found for {}', [id]);
  return entity as RedemptionEvent;
}
