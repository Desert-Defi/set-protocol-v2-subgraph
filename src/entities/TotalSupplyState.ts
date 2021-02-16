import { TotalSupplyState } from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';
import { getID } from '../utils/getID';

export function getTotalSupplyStateID(setID: string, timestamp: BigInt): string {
  return getID([setID, timestamp.toString()]);
}

export function ensureTotalSupplyState(
  setID: string,
  timestamp: BigInt,
  quantity: BigInt
): TotalSupplyState {
  let id = getTotalSupplyStateID(setID, timestamp);
  let ts = new TotalSupplyState(id);
  ts.setToken = setID;
  ts.timestamp = timestamp;
  ts.quantity = quantity;
  ts.save();
  return ts;
}
