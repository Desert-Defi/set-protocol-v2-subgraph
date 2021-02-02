import { SetTokenCreated } from '../../generated/templates/SetTokenCreator/SetTokenCreator';
import { SetToken as SetTokenTemplate } from '../../generated/templates';
import { SetToken } from '../../generated/schema';

export function handleSetTokenCreated(event: SetTokenCreated): void {
  SetTokenTemplate.create(event.address);
  let id = event.params._setToken.toString();
  let st = new SetToken(id);
  st.inception = event.block.timestamp;
  st.manager = event.params._manager.toString();
  st.name = event.params._name;
  st.symbol = event.params._symbol;
  st.address = event.params._setToken.toString();
  st.save();
}
