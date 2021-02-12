import { log } from '@graphprotocol/graph-ts';

// bug in log.critical() kills the subgraph before its message prints
// Use this instead so we can see the error msg
export function logCritical(msg: string, params: string[]): void {
  log.error(msg, params);
  log.critical(msg, params);
}
