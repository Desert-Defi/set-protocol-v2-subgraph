import {
  FeeActualized,
  StreamingFeeUpdated
} from '../../generated/StreamingFeeModule/StreamingFeeModule';
import { requireManager } from '../entities/Manager';
import { requireSetToken } from '../entities/SetToken';
import { ensureFeePayment } from '../entities/FeePayment';

export function handleFeeActualized(event: FeeActualized): void {
  let set = requireSetToken(event.params._setToken.toHexString());
  let manager = requireManager(set.manager);
  ensureFeePayment(
    set.id,
    event.block.timestamp,
    'streaming',
    manager.id,
    null,
    event.params._managerFee
  );
}

export function handleStreamingFeeUpdated(event: StreamingFeeUpdated): void {
  let set = requireSetToken(event.params._setToken.toHexString());
  set.streamingFee = event.params._newStreamingFee;
  set.save();
}
