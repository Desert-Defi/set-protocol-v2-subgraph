import { log } from '@graphprotocol/graph-ts';
import { Manager } from '../../generated/schema';

export function ensureManager(id: string): Manager {
  let m = Manager.load(id);
  if (!m) {
    m = new Manager(id);
    m.address = id;
    m.save();
  }
  return m as Manager;
}

export function getManager(id: string): Manager {
  let entity = Manager.load(id);
  if (entity == null) log.critical('Manager not found for {}', [id]);
  return entity as Manager;
}
