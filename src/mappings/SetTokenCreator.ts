import { log } from "@graphprotocol/graph-ts";
import { SetTokenCreated as SetTokenCreatedEvent } from '../../generated/SetTokenCreator/SetTokenCreator';
import { constants, sets } from "../utils";

import { getProtocol } from "../utils/initializers";

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
}
