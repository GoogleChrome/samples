import type { WebSocketLike } from "./ws-adapter.mjs";
/** A generic event listener callback. */
type Listener = (...args: any[]) => void;
/** A DOM-style event handler passed to addEventListener/removeEventListener. */
type DOMEventHandler = (ev: any) => void;
declare class WebSocket {
    readonly readyState: number;
    binaryType: string;
    send(data: string | ArrayBufferLike | ArrayBufferView): void;
    close(code?: number, reason?: string): void;
    addEventListener(type: string, listener: DOMEventHandler): void;
    removeEventListener(type: string, listener: DOMEventHandler): void;
}
export declare class BrowserWebSocket implements WebSocketLike {
    private _ws;
    private _listenerMap;
    constructor(ws: WebSocket);
    /** The underlying platform-specific socket. Code that accesses this will not be isomorphic across server and browser environments. */
    get platformSocket(): WebSocket;
    get readyState(): number;
    send(data: string | ArrayBufferLike | ArrayBufferView): void;
    close(code?: number, reason?: string): void;
    on(event: string, listener: Listener): void;
    off(event: string, listener: Listener): void;
    once(event: string, listener: Listener): void;
    private _listenersFor;
    /**
     * Converts browser event objects to positional arguments matching the
     * {@link WebSocketLike} interface.
     */
    private _wrapListener;
}
export {};
//# sourceMappingURL=ws-adapter-browser.d.mts.map