import { TotalSupplyState } from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';
import { getID } from '../utils/getID';

export function getTotalSupplyStateID(setID: string, blockNumber: BigInt): string {
  return getID([setID, blockNumber.toString()]);
}

export function ensureTotalSupplyState(
  setID: string,
  blockNumber: BigInt,
  timestamp: BigInt,
  quantity: BigInt
): TotalSupplyState {
  let id = getTotalSupplyStateID(setID, blockNumber);
  let ts = new TotalSupplyState(id);
  ts.setToken = setID;
  ts.blockNumber = blockNumber;
  ts.timestamp = timestamp;
  ts.quantity = quantity;
  ts.save();
  return ts;
}
