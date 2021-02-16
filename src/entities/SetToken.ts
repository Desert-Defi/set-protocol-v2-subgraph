import { log } from '@graphprotocol/graph-ts';
import { SetToken } from '../../generated/schema';

export function requireSetToken(id: string): SetToken {
  let entity = SetToken.load(id) as SetToken;
  if (entity == null) log.critical('SetToken not found for {}', [id]);
  return entity;
}
