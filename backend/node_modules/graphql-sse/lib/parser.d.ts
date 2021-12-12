/**
 *
 * parser
 *
 */
import { StreamMessage } from './common';
/**
 * HTTP response chunk parser for graphql-sse's event stream messages.
 *
 * Reference: https://github.com/Azure/fetch-event-source/blob/main/src/parse.ts
 *
 * @private
 */
export declare function createParser(): (chunk: Uint8Array) => (StreamMessage<false> | StreamMessage<true>)[] | void;
