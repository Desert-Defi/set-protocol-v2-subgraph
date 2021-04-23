import { ComponentState } from '../../generated/schema';
import { BigInt, log, ethereum } from '@graphprotocol/graph-ts';
import { getID } from '../utils/getID';
import { getSetToken } from './SetToken';
import { ensurePortfolioState, getPortfolioState } from './PortfolioState';

export function getComponentStateID(
  setID: string,
  assetID: string,
  blockNumber: BigInt
): string {
  return getID([setID, assetID, blockNumber.toString()]);
}

// create or update ComponentState
// will create or update parent PortfolioState
export function ensureComponentState(
  setID: string,
  assetID: string,
  blockNumber: BigInt,
  timestamp: BigInt,
  defaultUnits: BigInt | null = null,
  externalUnits: BigInt | null = null
): ComponentState {
  let id = getComponentStateID(setID, assetID, blockNumber);
  if (!defaultUnits && !externalUnits) {
    log.critical('No units provided for ComponentState {}', [id]);
  }
  let cs = ComponentState.load(id);
  if (!cs) {
    cs = new ComponentState(id);
    cs.asset = assetID;
    cs.setToken = setID;
    cs.timestamp = timestamp;
    cs.blockNumber = blockNumber;
  }
  let set = getSetToken(setID);

  // lookup previous ComponentState
  let prevPortfolioState = getPortfolioState(set.portfolio);
  let prevComponents = prevPortfolioState.components.filter((c) => !!c); // required for compilation

  // replace old ComponentState with new
  let newComponents: string[] = [];
  let prevComponentState: ComponentState | null = null;
  for (let i = 0; i < prevComponents.length; i++) {
    let cID = prevComponents[i];
    let comp = getComponentState(cID);
    // populate newComponents array with unmodified assets
    if (comp.asset != assetID) newComponents.push(cID);
    // grab ComponentState to be replaced
    else prevComponentState = getComponentState(cID);
  }
  // initialize new ComponentState properties
  if (prevComponentState) {
    cs.externalUnits = prevComponentState.externalUnits;
    cs.defaultUnits = prevComponentState.defaultUnits;
  } else {
    cs.externalUnits = BigInt.fromI32(0);
    cs.defaultUnits = BigInt.fromI32(0);
  }
  // apply changes
  if (defaultUnits) cs.defaultUnits = defaultUnits as BigInt;
  if (externalUnits) cs.externalUnits = externalUnits as BigInt;
  cs.totalUnits = cs.externalUnits.plus(cs.defaultUnits);
  cs.save();
  // dont reference in PortfolioState if zero allocation
  if (cs.totalUnits != BigInt.fromI32(0)) newComponents.push(id);
  // create or update PortfolioState
  let currPortfolioState = ensurePortfolioState(
    setID,
    blockNumber,
    timestamp,
    newComponents
  );
  set.portfolio = currPortfolioState.id;
  set.save();

  return cs as ComponentState;
}

export function getComponentState(id: string): ComponentState {
  let entity = ComponentState.load(id);
  if (entity == null) log.critical('ComponentState not found for {}', [id]);
  return entity as ComponentState;
}
