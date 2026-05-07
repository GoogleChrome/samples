/** Reconnection event passed to the `onReconnecting` handler and event listeners. */
export interface ReconnectingEvent<Parameters = Record<string, unknown>> {
    /** Which retry attempt this is (1-based). */
    readonly attempt: number;
    /** Total attempts that will be made. */
    readonly maxAttempts: number;
    /** Delay in ms before this attempt connects. */
    readonly delay: number;
    /** The WebSocket close code that triggered reconnection. */
    readonly closeCode: number;
    /** The current query parameters. */
    readonly parameters: (Parameters & Record<string, unknown>) | undefined;
}
/**
 * Optional overrides returned from the `onReconnecting` handler
 * to customize the next reconnection attempt.
 */
export type ReconnectingOverrides<Parameters = Record<string, unknown>> = {
    /**
     * If provided, assigns the query parameters for the next connection.
     * Set to `undefined` to clear all query parameters.
     */
    parameters?: (Parameters & Record<string, unknown>) | undefined;
} | {
    /**
     * If set, will stop attempting to reconnect.
     */
    abort: true;
};
/**
 * Raw data types that can be sent over a WebSocket without serialization.
 */
export type RawWebSocketData = string | ArrayBufferLike | ArrayBufferView | ArrayBufferView[];
export type UnsentMessage<T> = {
    type: 'message';
    message: T;
} | {
    type: 'raw';
    data: RawWebSocketData;
};
/**
 * Flatten `ArrayBufferView[]` fragments into a single `Uint8Array` so that
 * `ws.send()` transmits the correct bytes.
 */
export declare function flattenRawData(data: RawWebSocketData): Exclude<RawWebSocketData, ArrayBufferView[]>;
/**
 * A bounded queue for outgoing WebSocket messages. JSON messages are
 * serialized on enqueue; raw messages are stored as-is. The queue enforces
 * a configurable byte-size limit and can return the original messages via
 * {@link drain} when the connection permanently closes.
 */
export declare class SendQueue<T = unknown> {
    private _queue;
    private _bytes;
    private _maxBytes;
    constructor(maxBytes?: number);
    /**
     * Serialize and enqueue a JSON message. Returns `true` if the message was
     * accepted, `false` if it would exceed the byte-size limit.
     */
    enqueue(event: T): boolean;
    /**
     * Enqueue raw data without serialization. Returns `true` if the data was
     * accepted, `false` if it would exceed the byte-size limit.
     */
    enqueueRaw(data: RawWebSocketData): boolean;
    /**
     * Send every queued message via `send`. If `send` throws, the failing
     * message and all subsequent messages are re-queued and the error is
     * re-thrown so the caller can report it.
     */
    flush(send: (data: RawWebSocketData) => void): void;
    /**
     * Drain the queue and return the unsent messages. JSON messages are
     * deserialized back to their original form. Resets byte tracking to zero.
     */
    drain(): UnsentMessage<T>[];
}
export declare function isRecoverableClose(code: number): boolean;
//# sourceMappingURL=ws.d.mts.map