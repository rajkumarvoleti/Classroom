"use strict";
/**
 *
 * common
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStreamData = exports.validateStreamEvent = exports.TOKEN_QUERY_KEY = exports.TOKEN_HEADER_KEY = void 0;
/**
 * Header key through which the event stream token is transmitted
 * when using the client in "single connection mode".
 *
 * Read more: https://github.com/enisdenjo/graphql-sse/blob/master/PROTOCOL.md#single-connection-mode
 *
 * @category Common
 */
exports.TOKEN_HEADER_KEY = 'x-graphql-event-stream-token';
/**
 * URL query parameter key through which the event stream token is transmitted
 * when using the client in "single connection mode".
 *
 * Read more: https://github.com/enisdenjo/graphql-sse/blob/master/PROTOCOL.md#single-connection-mode
 *
 * @category Common
 */
exports.TOKEN_QUERY_KEY = 'token';
/** @category Common */
function validateStreamEvent(e) {
    e = e;
    if (e !== 'next' && e !== 'complete')
        throw new Error(`Invalid stream event "${e}"`);
    return e;
}
exports.validateStreamEvent = validateStreamEvent;
/** @category Common */
function parseStreamData(e, data) {
    if (data) {
        try {
            data = JSON.parse(data);
        }
        catch (_a) {
            throw new Error('Invalid stream data');
        }
    }
    if (e === 'next' && !data)
        throw new Error('Stream data must be an object for "next" events');
    return (data || null);
}
exports.parseStreamData = parseStreamData;
