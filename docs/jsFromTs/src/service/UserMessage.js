import { env } from '../misc/env';
import { log } from '../misc/util';
import { userMessage as proto } from '../proto/index';
import { Service } from '../service/Service';
/**
 * Maximum size of the user message sent over `Channel` (without metadata).
 */
const MAX_USER_MSG_SIZE = 15000;
/**
 * Maximum message id number.
 */
const MAX_MSG_ID_SIZE = 65535;
const textEncoder = new env.TextEncoder();
const textDecoder = new env.TextDecoder();
/**
 * Message builder service is responsible to build messages to send them over the
 * `WebChannel` and treat messages received by the `WebChannel`. It also manage
 * big messages (more then 16ko) sent by users. Internal messages are always less
 * 16ko.
 */
export class UserMessage extends Service {
    constructor() {
        super(UserMessage.SERVICE_ID, proto.Message);
        this.buffers = new Map();
    }
    clean() {
        this.buffers.clear();
    }
    /**
     * Encode user message for sending over the network.
     */
    encodeUserMessage(data) {
        const { type, bytes } = this.userDataToType(data);
        const msg = { length: bytes.length, type };
        if (bytes.length <= MAX_USER_MSG_SIZE) {
            msg.full = bytes;
            return [super.encode(msg)];
        }
        else {
            msg.chunk = { id: Math.ceil(Math.random() * MAX_MSG_ID_SIZE) };
            const numberOfChunks = Math.ceil(bytes.length / MAX_USER_MSG_SIZE);
            const res = new Array(numberOfChunks);
            for (let i = 0; i < numberOfChunks; i++) {
                const length = Math.min(MAX_USER_MSG_SIZE, bytes.length - MAX_USER_MSG_SIZE * i);
                const begin = MAX_USER_MSG_SIZE * i;
                const end = begin + length;
                msg.chunk.nb = i;
                msg.chunk.content = new Uint8Array(bytes.slice(begin, end));
                res[i] = super.encode(msg);
            }
            return res;
        }
    }
    /**
     * Decode user message received from the network.
     */
    decodeUserMessage(bytes, senderId) {
        try {
            const { length, type, contentType, full, chunk } = super.decode(bytes);
            let result;
            switch (contentType) {
                case 'full': {
                    result = full;
                    break;
                }
                case 'chunk': {
                    let buffer = this.getBuffer(senderId, chunk.id);
                    if (buffer === undefined) {
                        buffer = new Buffer(length, chunk.content, chunk.nb);
                        this.setBuffer(senderId, chunk.id, buffer);
                        result = undefined;
                    }
                    else {
                        result = buffer.append(chunk.content, chunk.nb);
                    }
                    break;
                }
                default: {
                    throw new Error('Unknown message integrity');
                }
            }
            if (result !== undefined) {
                switch (type) {
                    case proto.Message.Type.U_INT_8_ARRAY:
                        return result;
                    case proto.Message.Type.STRING:
                        return textDecoder.decode(result);
                    default:
                        throw new Error('Unknown message type');
                }
            }
            return result;
        }
        catch (err) {
            log.warn('Decode user message error: ', err);
            return undefined;
        }
    }
    /**
     * Identify the user data type.
     */
    userDataToType(data) {
        if (data instanceof Uint8Array) {
            return { type: proto.Message.Type.U_INT_8_ARRAY, bytes: data };
        }
        else if (typeof data === 'string') {
            return { type: proto.Message.Type.STRING, bytes: textEncoder.encode(data) };
        }
        else if (data instanceof String) {
            return { type: proto.Message.Type.STRING, bytes: textEncoder.encode('' + data) };
        }
        else {
            throw new Error('Message neigther a string type or a Uint8Array type');
        }
    }
    getBuffer(peerId, msgId) {
        const buffers = this.buffers.get(peerId);
        if (buffers !== undefined) {
            return buffers.get(msgId);
        }
        return undefined;
    }
    setBuffer(peerId, msgId, buffer) {
        let buffers = this.buffers.get(peerId);
        if (buffers === undefined) {
            buffers = new Map();
        }
        buffers.set(msgId, buffer);
        this.buffers.set(peerId, buffers);
    }
}
UserMessage.SERVICE_ID = 743;
/**
 * Buffer class used when the user message exceeds the message size limit which
 * may be sent over a `Channel`. Each buffer is identified by `WebChannel` id,
 * peer id of the sender and message id (in case if the peer sent more then
 * 1 big message at a time).
 */
class Buffer {
    constructor(totalLength, data, chunkNb) {
        this.fullData = new Uint8Array(totalLength);
        this.currentLength = 0;
        this.append(data, chunkNb);
    }
    /**
     * Add a chunk of message to the buffer.
     */
    append(data, chunkNb) {
        let i = chunkNb * MAX_USER_MSG_SIZE;
        this.currentLength += data.length;
        for (const d of data) {
            this.fullData[i++] = d;
        }
        return this.currentLength === this.fullData.length ? this.fullData : undefined;
    }
}
