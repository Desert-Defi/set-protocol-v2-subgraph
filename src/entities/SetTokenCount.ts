import { SetTokenCount } from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';

export const incrementSetTokenCount = (): SetTokenCount => {
  let c = SetTokenCount.load('1');
  if (!c) {
    c = new SetTokenCount('1');
    c.count = BigInt.fromI32(1);
  } else {
    c.count = BigInt.fromI32(c.count.toI32() + 1);
  }
  c.save();
  return c as SetTokenCount;
};
