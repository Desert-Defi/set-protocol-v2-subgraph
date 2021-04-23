import {
  FeeActualized,
  StreamingFeeUpdated
} from '../../generated/StreamingFeeModule/StreamingFeeModule';
import { getManager } from '../entities/Manager';
import { getSetToken } from '../entities/SetToken';
import { createFeePaymentEvent } from '../entities/FeePaymentEvent';

export function handleFeeActualized(event: FeeActualized): void {
  let set = getSetToken(event.params._setToken.toHexString());
  let manager = getManager(set.manager);
  createFeePaymentEvent(
    set.id,
    event.transaction.hash.toString(),
    event.logIndex,
    event.block.number,
    event.block.timestamp,
    'streaming',
    manager.id,
    null,
    event.params._managerFee
  );
}

export function handleStreamingFeeUpdated(event: StreamingFeeUpdated): void {
  let set = getSetToken(event.params._setToken.toHexString());
  set.streamingFee = event.params._newStreamingFee;
  set.save();
}
