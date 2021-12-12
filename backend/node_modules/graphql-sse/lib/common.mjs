/**
 *
 * common
 *
 */
/**
 * Header key through which the event stream token is transmitted
 * when using the client in "single connection mode".
 *
 * Read more: https://github.com/enisdenjo/graphql-sse/blob/master/PROTOCOL.md#single-connection-mode
 *
 * @category Common
 */
export const TOKEN_HEADER_KEY = 'x-graphql-event-stream-token';
/**
 * URL query parameter key through which the event stream token is transmitted
 * when using the client in "single connection mode".
 *
 * Read more: https://github.com/enisdenjo/graphql-sse/blob/master/PROTOCOL.md#single-connection-mode
 *
 * @category Common
 */
export const TOKEN_QUERY_KEY = 'token';
/** @category Common */
export function validateStreamEvent(e) {
    e = e;
    if (e !== 'next' && e !== 'complete')
        throw new Error(`Invalid stream event "${e}"`);
    return e;
}
/** @category Common */
export function parseStreamData(e, data) {
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
