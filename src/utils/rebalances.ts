import { RebalanceTrade } from "../../generated/schema";
import { ComponentExchanged as ComponentExchangedEvent } from "../../generated/templates/TradeModule/TradeModule";
import { sets } from "./";

export namespace rebalances {

  /**
   * Index new ComponentExchanged event to RebalanceTrade entity
   * 
   * @param event
   */
   export function addRebalanceTrade(event: ComponentExchangedEvent): void {
    let set = sets.getSetToken(event.params._setToken.toHexString());
    // Index the event
    let id = event.transaction.hash.toHexString();
    let trade = new RebalanceTrade(id);
    trade.timestamp = event.block.timestamp;
    trade.exchange = event.params._exchangeAdapter.toHexString();
    trade.sendToken = event.params._sendToken.toHexString();
    trade.receiveToken = event.params._receiveToken.toHexString();
    trade.totalSendAmount = event.params._totalSendAmount;
    trade.totalReceiveAmount = event.params._totalReceiveAmount;
    trade.fee = event.params._protocolFee;
    trade.setToken = set.id;
    trade.save();
  }

}
