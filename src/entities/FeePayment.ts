import { BigInt } from '@graphprotocol/graph-ts';
import { FeePayment } from '../../generated/schema';
import { getID } from '../utils/getID';

export function getFeePaymentID(
  setID: string,
  kind: string,
  assetID: string | null,
  timestamp: BigInt
): string {
  if (!assetID) return getID([setID, kind, 'null', timestamp.toString()]);
  return getID([setID, kind, assetID, timestamp.toString()]);
}

export function ensureFeePayment(
  setID: string,
  timestamp: BigInt,
  kind: string,
  managerID: string,
  assetID: string | null,
  quantity: BigInt
): FeePayment {
  let id = getFeePaymentID(setID, kind, assetID, timestamp);
  let fp = FeePayment.load(id) as FeePayment;
  if (!fp) {
    fp = new FeePayment(id);
    fp.setToken = setID;
    fp.timestamp = timestamp;
    fp.kind = kind;
    fp.asset = assetID;
    fp.manager = managerID;
    fp.quantity = quantity;
  } else {
    fp.quantity = fp.quantity.plus(quantity);
  }
  fp.save();
  return fp;
}
