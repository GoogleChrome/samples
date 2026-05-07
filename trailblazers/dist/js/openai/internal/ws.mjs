import { concatBytes, encodeUTF8 } from "./utils/bytes.mjs";
function toUint8Array(view) {
    if (view instanceof Uint8Array)
        return view;
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
}
/**
 * Flatten `ArrayBufferView[]` fragments into a single `Uint8Array` so that
 * `ws.send()` transmits the correct bytes.
 */
export function flattenRawData(data) {
    if (Array.isArray(data))
        return concatBytes(data.map(toUint8Array));
    return data;
}
function snapshotRawData(data) {
    if (typeof data === 'string')
        return data;
    if (Array.isArray(data))
        return concatBytes(data.map(toUint8Array));
    if (ArrayBuffer.isView(data)) {
        const copy = new Uint8Array(data.byteLength);
        copy.set(toUint8Array(data));
        return copy;
    }
    return data.slice(0);
}
function rawByteLength(data) {
    if (typeof data === 'string')
        return encodeUTF8(data).byteLength;
    if (Array.isArray(data))
        return data.reduce((sum, buf) => sum + buf.byteLength, 0);
    if ('byteLength' in data)
        return data.byteLength;
    return 0;
}
/**
 * A bounded queue for outgoing WebSocket messages. JSON messages are
 * serialized on enqueue; raw messages are stored as-is. The queue enforces
 * a configurable byte-size limit and can return the original messages via
 * {@link drain} when the connection permanently closes.
 */
export class SendQueue {
    constructor(maxBytes = 1048576) {
        this._queue = [];
        this._bytes = 0;
        this._maxBytes = maxBytes;
    }
    /**
     * Serialize and enqueue a JSON message. Returns `true` if the message was
     * accepted, `false` if it would exceed the byte-size limit.
     */
    enqueue(event) {
        const data = JSON.stringify(event);
        const byteLength = encodeUTF8(data).byteLength;
        if (this._bytes + byteLength > this._maxBytes && this._queue.length > 0) {
            return false;
        }
        this._queue.push({ kind: 'json', data, byteLength });
        this._bytes += byteLength;
        return true;
    }
    /**
     * Enqueue raw data without serialization. Returns `true` if the data was
     * accepted, `false` if it would exceed the byte-size limit.
     */
    enqueueRaw(data) {
        const snapshot = snapshotRawData(data);
        const byteLength = rawByteLength(snapshot);
        if (this._bytes + byteLength > this._maxBytes && this._queue.length > 0) {
            return false;
        }
        this._queue.push({ kind: 'raw', data: snapshot, byteLength });
        this._bytes += byteLength;
        return true;
    }
    /**
     * Send every queued message via `send`. If `send` throws, the failing
     * message and all subsequent messages are re-queued and the error is
     * re-thrown so the caller can report it.
     */
    flush(send) {
        const pending = this._queue.splice(0);
        this._bytes = 0;
        for (let i = 0; i < pending.length; i++) {
            try {
                send(pending[i].data);
            }
            catch (err) {
                const remaining = pending.slice(i);
                this._queue = remaining.concat(this._queue);
                this._bytes = this._queue.reduce((sum, item) => sum + item.byteLength, 0);
                throw err;
            }
        }
    }
    /**
     * Drain the queue and return the unsent messages. JSON messages are
     * deserialized back to their original form. Resets byte tracking to zero.
     */
    drain() {
        const unsent = this._queue.map((entry) => {
            if (entry.kind === 'raw')
                return { type: 'raw', data: entry.data };
            return { type: 'message', message: JSON.parse(entry.data) };
        });
        this._queue = [];
        this._bytes = 0;
        return unsent;
    }
}
// RFC 6455 §7.4.1
export function isRecoverableClose(code) {
    switch (code) {
        case 1000:
            return false; // Normal closure
        case 1001:
            return true; // Going away (server shutting down)
        case 1002:
            return false; // Protocol error
        case 1003:
            return false; // Unsupported data
        case 1005:
            return true; // No status code (abnormal)
        case 1006:
            return true; // Abnormal closure (network drop)
        case 1007:
            return false; // Invalid payload
        case 1008:
            return false; // Policy violation
        case 1009:
            return false; // Message too big
        case 1010:
            return false; // Missing extension
        case 1011:
            return true; // Internal server error
        case 1012:
            return true; // Service restart
        case 1013:
            return true; // Try again later
        case 1015:
            return true; // TLS handshake failure
        default:
            return false;
    }
}
//# sourceMappingURL=ws.mjs.map