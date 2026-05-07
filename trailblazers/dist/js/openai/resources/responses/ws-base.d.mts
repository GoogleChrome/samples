import { ResponsesEmitter, ResponsesStreamMessage } from "./internal-base.mjs";
import { type WebSocketLike } from "../../internal/ws-adapter.mjs";
import { type RawWebSocketData, type ReconnectingEvent, type ReconnectingOverrides } from "../../internal/ws.mjs";
import * as ResponsesAPI from "./responses.mjs";
import { OpenAI } from "../../client.mjs";
export interface ResponsesWSReconnectOptions {
    /**
     * Called before each reconnect attempt. Return an object with
     * `parameters` to override query parameters for the next connection.
     */
    onReconnecting(event: ReconnectingEvent<Record<string, unknown>>): ReconnectingOverrides<Record<string, unknown>> | void;
    /**
     * Maximum number of reconnection attempts. Default: 5.
     * Set to 0 to disable reconnection entirely.
     */
    maxRetries?: number;
    /**
     * Initial backoff delay in milliseconds. Default: 500.
     */
    initialDelay?: number;
    /**
     * Maximum backoff delay in milliseconds. Default: 8000.
     */
    maxDelay?: number;
}
export interface ResponsesWSBaseOptions {
    /**
     * Options for automatic reconnection on recoverable close codes.
     * Automatic reconnection is only enabled when this has a non-null value.
     */
    reconnect?: ResponsesWSReconnectOptions | null | undefined;
    /**
     * Maximum size of the outgoing message queue in bytes.
     * Messages queued while the socket is connecting or reconnecting are held
     * in memory up to this limit. Once the limit is reached, new messages are
     * discarded and an `error` event is emitted.
     * Default: 1 MB
     */
    maxQueueSize?: number | undefined;
}
export declare abstract class ResponsesWSBase<TSocket extends WebSocketLike> extends ResponsesEmitter {
    url: URL;
    socket: TSocket;
    protected _client: OpenAI;
    protected _parameters: Record<string, unknown> | null | undefined;
    private _reconnectOptions;
    private _sendQueue;
    private _isReconnecting;
    private _intentionallyClosed;
    private _closeCode;
    private _closeReason;
    private _lastCloseCode;
    private _lastCloseReason;
    private _internalEvents;
    constructor(client: OpenAI, options?: ResponsesWSBaseOptions | undefined);
    /** Establishes the initial WebSocket connection. */
    protected _connectInitial(): void;
    /** Creates a platform-specific WebSocket for the given URL and auth headers. */
    protected abstract _createSocket(url: URL, authHeaders: Record<string, string>): TSocket;
    send(event: ResponsesAPI.ResponsesClientEvent): void;
    sendRaw(data: RawWebSocketData): void;
    close(props?: {
        code: number;
        reason: string;
    }): void;
    /**
     * Returns an async iterator over WebSocket lifecycle and message events,
     * providing an alternative to the event-based `.on()` API.
     * The iterator will exit if the socket closes but exiting the iterator
     * does not close the socket.
     *
     * @example
     * ```ts
     * for await (const event of client.stream()) {
     *   switch (event.type) {
     *     case 'message':
     *       console.log('received:', event.message);
     *       break;
     *     case 'error':
     *       console.error(event.error);
     *       break;
     *     case 'close':
     *       console.log('connection closed');
     *       break;
     *   }
     * }
     * ```
     */
    stream(): AsyncIterableIterator<ResponsesStreamMessage>;
    [Symbol.asyncIterator](): AsyncIterableIterator<ResponsesStreamMessage>;
    private _connect;
    private _canReconnect;
    private _reconnect;
    /**
     * Resolves once the socket is open, rejects if it errors or closes first
     */
    private _awaitOpen;
    private _flushSendQueue;
    /**
     * Emits the public `close` event with unsent messages and the internal
     * `close` event used by the async iterator.
     */
    private _emitPermanentClose;
    protected _authHeaders(): Record<string, string>;
}
//# sourceMappingURL=ws-base.d.mts.map