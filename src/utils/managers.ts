import { log } from "@graphprotocol/graph-ts";
import { Manager, ManagerUpdate } from "../../generated/schema";
import { ManagerEdited as ManagerEditedEvent } from "../../generated/templates/SetToken/SetToken";
import { getProtocol } from "../utils/initializers";
import { constants, sets } from "./";

export namespace managers {

  /**
   * Get existing or index new Manager entity
   * 
   * @param id manager address
   * @returns
   */
  export function getManager(id: string): Manager {
    let manager = Manager.load(id);
    // Create manager if they don't exist
    if (!manager) {
      manager = createNewManager(id);
    }
    return manager as Manager;
  }

  function createNewManager(id: string): Manager {
    let manager = new Manager(id);
    manager.protocol = constants.PROTOCOL_VERSION;
    manager.save();
    // Increment protocol absolute manager count
    let protocol = getProtocol(constants.PROTOCOL_VERSION);
    protocol.managerCount += 1;
    protocol.save();
    return manager;
  }

  export function update(event: ManagerEditedEvent): void {
    let set = sets.getSetToken(event.address.toHexString());
    let manager = getManager(event.params._newManager.toHexString());
      
    // Index the event
    let id = manager.id + "#" + event.address.toHexString();
    let managerUpdate = new ManagerUpdate(id);
    managerUpdate.oldManager = set.manager; // old manager
    managerUpdate.newManager = manager.id; //  new manager
    managerUpdate.setToken = set.id;
    managerUpdate.save();

    // Save the new manager to the SetToken
    set.manager = manager.id;
    set.save();
  }
}