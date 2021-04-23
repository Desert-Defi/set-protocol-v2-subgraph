import { PortfolioState } from '../../generated/schema';
import { BigInt, log } from '@graphprotocol/graph-ts';
import { getID } from '../utils/getID';

export function getPortfolioStateID(setID: string, blockNumber: BigInt): string {
  return getID([setID, blockNumber.toString()]);
}

// create or update PortfolioState
// components array will be replaced
export function ensurePortfolioState(
  setID: string,
  blockNumber: BigInt,
  timestamp: BigInt,
  componentStateIDs: string[]
): PortfolioState {
  let id = getPortfolioStateID(setID, timestamp);
  let ps = PortfolioState.load(id);
  if (!ps) {
    ps = new PortfolioState(id);
    ps.setToken = setID;
    ps.blockNumber = blockNumber;
    ps.timestamp = timestamp;
  }
  ps.components = componentStateIDs;
  ps.save();
  return ps as PortfolioState;
}

export function getPortfolioState(id: string): PortfolioState {
  let entity = PortfolioState.load(id);
  if (entity == null) log.critical('PortfolioState not found for {}', [id]);
  return entity as PortfolioState;
}
