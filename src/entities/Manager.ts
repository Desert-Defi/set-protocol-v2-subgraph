import { log } from '@graphprotocol/graph-ts';
import { Manager } from '../../generated/schema';

export function ensureManager(id: string): Manager {
  let m = Manager.load(id) as Manager;
  if (!m) {
    m = new Manager(id);
    m.address = id;
    m.save();
  }
  return m;
}

export function requireManager(id: string): Manager {
  let entity = Manager.load(id) as Manager;
  if (entity == null) log.critical('Manager not found for {}', [id]);
  return entity;
}
