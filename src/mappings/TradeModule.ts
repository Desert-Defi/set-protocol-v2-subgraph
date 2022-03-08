import { ComponentExchanged as ComponentExchangedEvent } from '../../generated/templates/TradeModule/TradeModule';
import { rebalances } from "../utils";

/**
 * Handler for ComponentExchanged event
 * Indexes the rebalance trade event
 * 
 * @param event 
 */
 export function handleComponentExchanged(event: ComponentExchangedEvent): void {
  rebalances.addRebalanceTrade(event);
}