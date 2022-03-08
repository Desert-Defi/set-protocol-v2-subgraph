import {
  FeeActualized as FeeActualizedEvent,
  StreamingFeeUpdated as StreamingFeeUpdatedEvent,
  FeeRecipientUpdated as FeeRecipientUpdatedEvent
} from '../../generated/templates/StreamingFeeModule/StreamingFeeModule';
import { fees } from "../utils";

/**
 * Indexes the fee accrue event
 * 
 * @param event 
 */
export function handleFeeActualized(event: FeeActualizedEvent): void {
  fees.addStreamingFeeAccrue(event);
}

/**
 * Indexes the streaming fee update event
 * 
 * @param event 
 */
 export function handleStreamingFeeUpdated(event: StreamingFeeUpdatedEvent): void {
  fees.addStreamingFeeUpdate(event);
}

/**
 * Indexes the fee recipient update event
 * 
 * @param event 
 */
 export function handleFeeRecipientUpdated(event: FeeRecipientUpdatedEvent): void {
  fees.addFeeRecipientUpdate(event);
}
