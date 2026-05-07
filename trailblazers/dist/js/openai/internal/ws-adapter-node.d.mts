import type * as WS from 'ws';
import type { WebSocketLike } from "./ws-adapter.mjs";
/** A generic event listener callback. */
type Listener = (...args: any[]) => void;
export declare class NodeWebSocket implements WebSocketLike {
    private _ws;
    /** Maps `(event, originalListener)` -> wrapped listener for correct `off()` removal. */
    private _listenerMap;
    constructor(ws: WS.WebSocket);
    /** The underlying platform-specific socket. Code that accesses this will not be isomorphic across server and browser environments. */
    get platformSocket(): WS.WebSocket;
    get readyState(): number;
    send(data: string | ArrayBufferLike | ArrayBufferView): void;
    close(code?: number, reason?: string): void;
    on(event: string, listener: Listener): void;
    off(event: string, listener: Listener): void;
    once(event: string, listener: Listener): void;
    private _listenersFor;
    /**
     * Normalizes `ws` message payloads: text frames become strings,
     * binary frames stay as `Buffer`, and fragmented frames are merged.
     */
    private static _normalizeMessageData;
    private _wrapListener;
}
export {};
//# sourceMappingURL=ws-adapter-node.d.mts.map