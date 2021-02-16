/* eslint-disable */
import { Address } from '@graphprotocol/graph-ts';
export let deployment = {
  core: {
    Controller: Address.fromString('{{Controller}}'),
    SetTokenCreator: Address.fromString('{{SetTokenCreator}}'),
    IntegrationRegistry: Address.fromString('{{IntegrationRegistry}}'),
    PriceOracle: Address.fromString('{{PriceOracle}}'),
    SetValuer: Address.fromString('{{SetValuer}}')
  },
  modules: {
    BasicIssuanceModule: Address.fromString('{{BasicIssuanceModule}}'),
    StreamingFeeModule: Address.fromString('{{StreamingFeeModule}}'),
    NavIssuanceModule: Address.fromString('{{NavIssuanceModule}}'),
    TradeModule: Address.fromString('{{TradeModule}}'),
    WrapModule: Address.fromString('{{WrapModule}}'),
    SingleIndexModuleDPI: Address.fromString('{{SingleIndexModuleDPI}}'),
    GovernanceModule: Address.fromString('{{GovernanceModule}}')
  }
};
