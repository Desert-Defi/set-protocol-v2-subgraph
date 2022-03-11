import {
  ModuleInitialized as ModuleInitializedEvent,
  ManagerEdited as ManagerEditedEvent
} from "../../generated/templates/SetToken/SetToken";
import { managers, sets } from "../utils";

/**
 * Handler for ModuleInitialized event
 * Initializes module templates on a SetToken
 * 
 * @param event 
 */
 export function handleModuleInitialized(event: ModuleInitializedEvent): void {
  sets.initModule(event);
}

/**
 * Handler for ManagerEdited event
 * Indexes the event and updates the manager on the given SetToken
 * 
 * @param event 
 */
export function handleManagerEdited(event: ManagerEditedEvent): void {
  managers.update(event);
}
