import { log } from '@graphprotocol/graph-ts';
import { SetToken } from '../../generated/schema';

export function getSetToken(id: string): SetToken {
  let entity = SetToken.load(id);
  if (entity == null) log.critical('SetToken not found for {}', [id]);
  return entity as SetToken;
}
