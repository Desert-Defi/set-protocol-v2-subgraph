import { SetTokenCreator } from '../../generated/templates';
import { FactoryAdded, FactoryRemoved } from '../../generated/Controller/Controller';

export function handleFactoryAdded(event: FactoryAdded): void {
  SetTokenCreator.create(event.address);
}

export function handleFactoryRemoved(event: FactoryRemoved): void {
  // Should we expect factories to be removed?
  // If so, do we need to remove the factory from datasources?
}
