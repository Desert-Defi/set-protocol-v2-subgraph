import { Address } from "@graphprotocol/graph-ts";

export namespace constants {

  // Set Protocol version
  // TO-DO: This should be dynamically defined from the subgraph queries, e.g.,
  //        indexed from a parameter during SetTokenCreated event
  //        Requires a reference to protocol version in the smart contracts
  export const PROTOCOL_VERSION = "2";

  export const ZERO_ADDRESS = Address.fromString(
    '0x0000000000000000000000000000000000000000'
  );

}
