export class BrowserWebSocket {
    constructor(ws) {
        this._listenerMap = new Map();
        this._ws = ws;
        this._ws.binaryType = 'arraybuffer';
    }
    /** The underlying platform-specific socket. Code that accesses this will not be isomorphic across server and browser environments. */
    get platformSocket() {
        return this._ws;
    }
    get readyState() {
        return this._ws.readyState;
    }
    send(data) {
        this._ws.send(data);
    }
    close(code, reason) {
        this._ws.close(code, reason);
    }
    on(event, listener) {
        const wrapped = this._wrapListener(event, listener);
        this._listenersFor(event).set(listener, wrapped);
        this._ws.addEventListener(event, wrapped);
    }
    off(event, listener) {
        const byListener = this._listenerMap.get(event);
        if (!byListener)
            return;
        const wrapped = byListener.get(listener);
        if (wrapped) {
            byListener.delete(listener);
            this._ws.removeEventListener(event, wrapped);
        }
    }
    once(event, listener) {
        const onceListener = (...args) => {
            this.off(event, listener);
            listener(...args);
        };
        const wrapped = this._wrapListener(event, onceListener);
        this._listenersFor(event).set(listener, wrapped);
        this._ws.addEventListener(event, wrapped);
    }
    _listenersFor(event) {
        let map = this._listenerMap.get(event);
        if (!map) {
            map = new Map();
            this._listenerMap.set(event, map);
        }
        return map;
    }
    /**
     * Converts browser event objects to positional arguments matching the
     * {@link WebSocketLike} interface.
     */
    _wrapListener(event, listener) {
        switch (event) {
            case 'message':
                return (ev) => {
                    const isBinary = typeof ev.data !== 'string';
                    listener(ev.data, isBinary);
                };
            case 'close':
                return (ev) => {
                    listener(ev.code, ev.reason);
                };
            case 'error':
                return (ev) => {
                    // Some environments provide an ErrorEvent with a `.message`;
                    // fall back to a generic message when the event carries nothing.
                    const message = ev?.message || ev?.error?.message || 'WebSocket error';
                    const err = new Error(message);
                    if (ev?.error) {
                        err.cause = ev.error;
                    }
                    listener(err);
                };
            case 'open':
            default:
                return listener;
        }
    }
}
//# sourceMappingURL=ws-adapter-browser.mjs.map