import { log } from "@graphprotocol/graph-ts";
import { SetToken } from "../../generated/schema";
import {
  StreamingFeeModule as StreamingFeeModuleTemplate,
  TradeModule as TradeModuleTemplate
} from "../../generated/templates";
import { ModuleInitialized as ModuleInitializedEvent } from "../../generated/templates/SetToken/SetToken";
import { SetTokenCreated as SetTokenCreatedEvent } from "../../generated/SetTokenCreator/SetTokenCreator";
import { constants, managers } from "./";

export namespace sets {

  /**
   * Create new module template on ModuleInitialized event trigger
   * 
   * @param event
   */
   export function createModuleTemplate(event: ModuleInitializedEvent): void {
    // NOTE: Ideally, this would only trigger the appropriate template creation
    //       based on the module being initialised; however, as we cannot
    //       fingerprint the calling module from within the subgraph, it
    //       currently triggers for all modules, creating templates never used
    TradeModuleTemplate.create(event.params._module);
    StreamingFeeModuleTemplate.create(event.params._module);
  }

  /**
   * Index new SetTokenCreated event to SetToken entity
   * 
   * @param event
   */
   export function createSetToken(event: SetTokenCreatedEvent): void {
    let id = event.params._setToken.toHexString();
    let set = new SetToken(id);
    set.protocol = constants.PROTOCOL_VERSION;
    set.address = id; // NOTE: The set.address field will be deprecated on new subgraph sync
    set.inception = event.block.timestamp;
    set.manager = managers.getManager(event.params._manager.toHexString()).id;
    set.name = event.params._name;
    set.symbol = event.params._symbol;
    set.save();
  }

  /**
   * Find an existing SetToken by id
   * 
   * @param id  SetToken address
   * @returns   SetToken entity
   */
   export function getSetToken(id: string): SetToken {
    let set = SetToken.load(id);
    // TO-DO: Does this need better failure logic?
    if (!set) log.critical("SetToken not found for {}", [id]);
    return set as SetToken;
  }

}