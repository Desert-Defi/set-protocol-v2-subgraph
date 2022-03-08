import { log } from '@graphprotocol/graph-ts';
import { SetToken } from "../../generated/schema";
import { SetToken as SetTokenTemplate } from '../../generated/templates';
import { SetTokenCreated as SetTokenCreatedEvent } from '../../generated/SetTokenCreator/SetTokenCreator';
import { constants, managers } from "./";

export namespace sets {

  export function createSetToken(event: SetTokenCreatedEvent): void {
    let id = event.params._setToken.toHexString();
    let set = new SetToken(id);
    set.protocol = constants.PROTOCOL_VERSION;
    set.inception = event.block.timestamp;
    set.manager = managers.getManager(event.params._manager.toHexString()).id;
    set.name = event.params._name;
    set.symbol = event.params._symbol;
    set.save();

    SetTokenTemplate.create(event.params._setToken);
  }

  export function getSetToken(id: string): SetToken {
    let set = SetToken.load(id);
    if (!set) log.critical('SetToken not found for {}', [id]);
    return set as SetToken;
  }

}