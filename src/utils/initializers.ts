import { Protocol } from "../../generated/schema";

/**
 * Get existing or index new Protocol entity
 * 
 * @param id    Protocol version
 */
export function getProtocol(id: string): Protocol {
    let protocol = Protocol.load(id);
    // Create protocol if it doesn't exist
    if (!protocol) {
        protocol = new Protocol(id);
        protocol.managerCount = 0;
        protocol.setTokenCount = 0;
        protocol.save();
    }
    return protocol;
}
