import { PortfolioState } from '../../generated/schema';
import { requireComponentState } from '../entities/ComponentState';
import { BigInt, log } from '@graphprotocol/graph-ts';
import { getID } from '../utils/getID';

export function getPortfolioStateID(setID: string, timestamp: BigInt): string {
  return getID([setID, timestamp.toString()]);
}

// create or update PortfolioState
// components array will be replaced
export function ensurePortfolioState(
  setID: string,
  timestamp: BigInt,
  componentStateIDs: string[]
): PortfolioState {
  let id = getPortfolioStateID(setID, timestamp);
  let ps = PortfolioState.load(id);
  if (!ps) {
    ps = new PortfolioState(id);
    ps.setToken = setID;
    ps.timestamp = timestamp;
  }
  ps.components = componentStateIDs;
  ps.save();
  return ps as PortfolioState;
}

export function requirePortfolioState(id: string): PortfolioState {
  let entity = PortfolioState.load(id) as PortfolioState;
  if (entity == null) log.critical('PortfolioState not found for {}', [id]);
  return entity;
}

export function removeComponentFromPortfolio(
  portfolioStateID: string,
  componentStateID: string
): void {
  let ps = requirePortfolioState(portfolioStateID);

  ps.components = ps.components.filter((cs) => {
    let comp = requireComponentState(cs);
    return comp.id != componentStateID;
  });

  ps.save();
}
