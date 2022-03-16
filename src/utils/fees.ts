import { 
  StreamingFeeAccrue,
  StreamingFeeUpdate,
  FeeRecipientUpdate
 } from "../../generated/schema";
 import {
  FeeActualized as FeeActualizedEvent,
  StreamingFeeUpdated as StreamingFeeUpdatedEvent,
  FeeRecipientUpdated as FeeRecipientUpdatedEvent
} from "../../generated/templates/StreamingFeeModule/StreamingFeeModule";
import { sets } from "./";

export namespace fees {

  /**
   * Index new FeeRecipientUpdated event to FeeRecipientUpdate entity
   * 
   * @param event
   */
  export function addFeeRecipientUpdate(event: FeeRecipientUpdatedEvent): void {
    let set = sets.getSetToken(event.params._setToken.toHexString());
    // Index the event
    let id = event.transaction.hash.toHexString();
    let recipient = new FeeRecipientUpdate(id);
    recipient.timestamp = event.block.timestamp;
    recipient.address = event.params._newFeeRecipient.toHexString();
    recipient.setToken = set.id;
    recipient.save();
  }

  /**
   * Index new FeeActualized event to StreamingFeeAccrue entity
   * 
   * @param event
   */
  export function addStreamingFeeAccrue(event: FeeActualizedEvent): void {
    let set = sets.getSetToken(event.params._setToken.toHexString());
    // Index the event
    let id = event.transaction.hash.toHexString();
    let accrue = new StreamingFeeAccrue(id);
    accrue.timestamp = event.block.timestamp;
    accrue.managerFee = event.params._managerFee;
    accrue.protocolFee = event.params._protocolFee;
    accrue.setToken = set.id;
    accrue.save();
  }

  /**
   * Index new StreamingFeeUpdated event to StreamingFeeUpdate entity
   * 
   * @param event
   */
  export function addStreamingFeeUpdate(event: StreamingFeeUpdatedEvent): void {
    let set = sets.getSetToken(event.params._setToken.toHexString());
    // Index the event
    let id = event.transaction.hash.toHexString();
    let fee = new StreamingFeeUpdate(id);
    fee.timestamp = event.block.timestamp;
    fee.fee = event.params._newStreamingFee;
    fee.setToken = set.id;
    fee.save();
  }

}
