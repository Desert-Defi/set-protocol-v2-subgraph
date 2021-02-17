import { ComponentState } from '../../generated/schema';
import { BigInt, log } from '@graphprotocol/graph-ts';
import { getID } from '../utils/getID';
import { requireSetToken } from './SetToken';
import { ensurePortfolioState, requirePortfolioState } from './PortfolioState';

export function getComponentStateID(
  setID: string,
  assetID: string,
  timestamp: BigInt
): string {
  return getID([setID, assetID, timestamp.toString()]);
}

// create or update ComponentState
// will update PortfolioState
export function ensureComponentState(
  setID: string,
  assetID: string,
  timestamp: BigInt,
  defaultUnits: BigInt | null = null,
  externalUnits: BigInt | null = null
): ComponentState {
  let id = getComponentStateID(setID, assetID, timestamp);
  if (!defaultUnits && !externalUnits) {
    log.critical('No units provided for ComponentState {}', [id]);
  }
  let cs = ComponentState.load(id);
  if (!cs) {
    cs = new ComponentState(id);
    cs.asset = assetID;
    cs.setToken = setID;
    cs.timestamp = timestamp;
  }
  let set = requireSetToken(setID);

  // lookup previous ComponentState
  let prevPortfolioState = requirePortfolioState(set.portfolio);
  let prevComponents = prevPortfolioState.components.filter((c) => !!c); // required for compilation

  // replace old ComponentState with new
  let newComponents: string[] = [];
  let prevComponentState: ComponentState | null = null;
  for (let i = 0; i < prevComponents.length; i++) {
    let cID = prevComponents[i];
    let comp = requireComponentState(cID);
    if (comp.asset != assetID) newComponents.push(cID);
    else prevComponentState = requireComponentState(cID);
  }
  if (prevComponentState) {
    cs.externalUnits = prevComponentState.externalUnits;
    cs.defaultUnits = prevComponentState.defaultUnits;
  } else {
    cs.externalUnits = BigInt.fromI32(0);
    cs.defaultUnits = BigInt.fromI32(0);
  }

  if (defaultUnits) cs.defaultUnits = defaultUnits as BigInt;
  if (externalUnits) cs.externalUnits = externalUnits as BigInt;
  cs.totalUnits = cs.externalUnits.plus(cs.defaultUnits);
  cs.save();

  if (cs.totalUnits != BigInt.fromI32(0)) newComponents.push(id);

  let currPortfolioState = ensurePortfolioState(setID, timestamp, newComponents);
  set.portfolio = currPortfolioState.id;
  set.save();

  return cs as ComponentState;
}

export function requireComponentState(id: string): ComponentState {
  let entity = ComponentState.load(id) as ComponentState;
  if (entity == null) log.critical('ComponentState not found for {}', [id]);
  return entity;
}
