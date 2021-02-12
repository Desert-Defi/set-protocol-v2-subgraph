import { logCritical } from '../utils/logCritical';
import { Component } from '../../generated/schema';

export function useComponent(id: string): Component {
  let c = Component.load(id) as Component;
  if (c == null) logCritical('Component not found for {}', [id]);
  return c;
}
