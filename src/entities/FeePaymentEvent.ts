import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { FeePaymentEvent } from '../../generated/schema';
import { getID } from '../utils/getID';

export function createFeePaymentEvent(
  setID: string,
  txID: string,
  logIndex: BigInt,
  blockNumber: BigInt,
  timestamp: BigInt,
  kind: string,
  managerID: string,
  assetID: string | null,
  quantity: BigInt
): FeePaymentEvent {
  let id = getID([txID, logIndex.toString()]);
  let fp = new FeePaymentEvent(id);
  fp.setToken = setID;
  fp.txID = txID;
  fp.logIndex = logIndex;
  fp.blockNumber = blockNumber;
  fp.timestamp = timestamp;
  fp.kind = kind;
  fp.asset = assetID;
  fp.manager = managerID;
  fp.quantity = quantity;
  fp.save();
  return fp;
}
