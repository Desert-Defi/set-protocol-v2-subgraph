import { ManagerEdited as ManagerEditedEvent } from '../../generated/templates/SetToken/SetToken';
import { managers } from "../utils";

/**
 * Handler for ManagerEdited event
 * Indexes the event and updates the manager on the given SetToken
 * 
 * @param event 
 */
export function handleManagerEdited(event: ManagerEditedEvent): void {
  managers.update(event);
}
