import { Address } from "@graphprotocol/graph-ts";

export namespace constants {

  export let PROTOCOL_VERSION = "2";

  export let ZERO_ADDRESS = Address.fromString(
    '0x0000000000000000000000000000000000000000'
  );

}
