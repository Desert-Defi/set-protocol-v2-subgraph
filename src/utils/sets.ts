import { log } from "@graphprotocol/graph-ts";
import { SetToken } from "../../generated/schema";
import { SetToken as SetTokenTemplate } from "../../generated/templates";
import { ModuleInitialized as ModuleInitializedEvent } from "../../generated/templates/SetToken/SetToken";
import { SetTokenCreated as SetTokenCreatedEvent } from "../../generated/SetTokenCreator/SetTokenCreator";
import {
  StreamingFeeModule as StreamingFeeModuleTemplate,
  TradeModule as TradeModuleTemplate
} from "../../generated/templates";
import { constants, managers } from "./";

export namespace sets {

  /**
   * Create new module templates on ModuleInitialized event trigger
   * 
   * @param event
   */
   export function initModule(event: ModuleInitializedEvent): void {
    // TO-DO: This should only trigger the appropriate template creation based
    //        on the module being initialised; currently triggers all
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
    set.inception = event.block.timestamp;
    set.manager = managers.getManager(event.params._manager.toHexString()).id;
    set.name = event.params._name;
    set.symbol = event.params._symbol;
    set.save();

    SetTokenTemplate.create(event.params._setToken);
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