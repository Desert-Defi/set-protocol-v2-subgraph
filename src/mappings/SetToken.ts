import { ManagerEdited } from '../../generated/templates/SetToken/SetToken';
import { getSetToken } from '../entities/SetToken';
import { ensureManager } from '../entities/Manager';

export function handleManagerEdited(event: ManagerEdited): void {
  let set = getSetToken(event.address.toHexString());
  set.manager = ensureManager(event.params._newManager.toHexString()).id;
  set.save();
}
