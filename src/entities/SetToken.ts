import { logCritical } from '../utils/logCritical';
import { SetToken } from '../../generated/schema';

export function useSetToken(id: string): SetToken {
  let set = SetToken.load(id) as SetToken;
  if (set == null) logCritical('SetToken not found for {}', [id]);
  return set;
}
