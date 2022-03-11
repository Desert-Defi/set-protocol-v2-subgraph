import { log } from "@graphprotocol/graph-ts";
import { SetTokenCreated as SetTokenCreatedEvent } from "../../generated/SetTokenCreator/SetTokenCreator";
import { constants, sets } from "../utils";
import { getProtocol } from "../utils/initializers";

// NOTE: These imports are deprecated and will be removed on new subgraph sync
import { SetTokenCount } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";
/**
 * Handler for SetTokenCreated event in SetToken contract
 * Indexes the new SetToken and updates the total absolute token count
 * 
 * @param event
 */
 export function handleSetTokenCreated(event: SetTokenCreatedEvent): void {
  sets.createSetToken(event);
  // TO-DO: The PROTOCOL_VERSION logic should come from the SetToken creation
  //        contract event if it's something we care about, instead of as a
  //        hard-coded constant.
  let protocol = getProtocol(constants.PROTOCOL_VERSION);
  protocol.setTokenCount += 1;
  protocol.save();

  // NOTE: This code is deprecated and will be removed on new subgraph sync
  // Provides minimal support for deprecated entity
  let setTokenCount = SetTokenCount.load("1");
  if (!setTokenCount) {
    setTokenCount = new SetTokenCount("1");
    setTokenCount.count = BigInt.fromI32(1);
  } else {
    setTokenCount.count += BigInt.fromI32(1);
  }
  setTokenCount.save();

}
