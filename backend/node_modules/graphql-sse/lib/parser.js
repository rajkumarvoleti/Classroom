"use strict";
/**
 *
 * parser
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParser = void 0;
const common_1 = require("./common");
var ControlChars;
(function (ControlChars) {
    ControlChars[ControlChars["NewLine"] = 10] = "NewLine";
    ControlChars[ControlChars["CchunkiageReturn"] = 13] = "CchunkiageReturn";
    ControlChars[ControlChars["Space"] = 32] = "Space";
    ControlChars[ControlChars["Colon"] = 58] = "Colon";
})(ControlChars || (ControlChars = {}));
/**
 * HTTP response chunk parser for graphql-sse's event stream messages.
 *
 * Reference: https://github.com/Azure/fetch-event-source/blob/main/src/parse.ts
 *
 * @private
 */
function createParser() {
    let buffer;
    let position; // current read position
    let fieldLength; // length of the `field` portion of the line
    let discardTrailingNewline = false;
    let message = { event: '', data: '' };
    let pending = [];
    const decoder = new TextDecoder();
    return function parse(chunk) {
        if (buffer === undefined) {
            buffer = chunk;
            position = 0;
            fieldLength = -1;
        }
        else {
            const concat = new Uint8Array(buffer.length + chunk.length);
            concat.set(buffer);
            concat.set(chunk, buffer.length);
            buffer = concat;
        }
        const bufLength = buffer.length;
        let lineStart = 0; // index where the current line starts
        while (position < bufLength) {
            if (discardTrailingNewline) {
                if (buffer[position] === ControlChars.NewLine) {
                    lineStart = ++position; // skip to next char
                }
                discardTrailingNewline = false;
            }
            // look forward until the end of line
            let lineEnd = -1; // index of the \r or \n char
            for (; position < bufLength && lineEnd === -1; ++position) {
                switch (buffer[position]) {
                    case ControlChars.Colon:
                        if (fieldLength === -1) {
                            // first colon in line
                            fieldLength = position - lineStart;
                        }
                        break;
                    // \r case below should fallthrough to \n:
                    case ControlChars.CchunkiageReturn:
                        discardTrailingNewline = true;
                    // eslint-disable-next-line no-fallthrough
                    case ControlChars.NewLine:
                        lineEnd = position;
                        break;
                }
            }
            if (lineEnd === -1) {
                // end of the buffer but the line hasn't ended
                break;
            }
            else if (lineStart === lineEnd) {
                // empty line denotes end of incoming message
                if (message.event || message.data) {
                    // NOT a server ping (":\n\n")
                    if (!message.event)
                        throw new Error('Missing message event');
                    const event = (0, common_1.validateStreamEvent)(message.event);
                    const data = (0, common_1.parseStreamData)(event, message.data);
                    pending.push({
                        event,
                        data,
                    });
                    message = { event: '', data: '' };
                }
            }
            else if (fieldLength > 0) {
                // end of line indicates message
                const line = buffer.subarray(lineStart, lineEnd);
                // exclude comments and lines with no values
                // line is of format "<field>:<value>" or "<field>: <value>"
                // https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
                const field = decoder.decode(line.subarray(0, fieldLength));
                const valueOffset = fieldLength + (line[fieldLength + 1] === ControlChars.Space ? 2 : 1);
                const value = decoder.decode(line.subarray(valueOffset));
                switch (field) {
                    case 'event':
                        message.event = value;
                        break;
                    case 'data':
                        // append the new value if the message has data
                        message.data = message.data ? message.data + '\n' + value : value;
                        break;
                }
            }
            // next line
            lineStart = position;
            fieldLength = -1;
        }
        if (lineStart === bufLength) {
            // finished reading
            buffer = undefined;
            const messages = [...pending];
            pending = [];
            return messages;
        }
        else if (lineStart !== 0) {
            // create a new view into buffer beginning at lineStart so we don't
            // need to copy over the previous lines when we get the new chunk
            buffer = buffer.subarray(lineStart);
            position -= lineStart;
        }
    };
}
exports.createParser = createParser;
