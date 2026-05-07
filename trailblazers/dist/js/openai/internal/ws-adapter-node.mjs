export class NodeWebSocket {
    constructor(ws) {
        /** Maps `(event, originalListener)` -> wrapped listener for correct `off()` removal. */
        this._listenerMap = new Map();
        this._ws = ws;
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
        this._ws.on(event, wrapped);
    }
    off(event, listener) {
        const byListener = this._listenerMap.get(event);
        if (!byListener)
            return;
        const wrapped = byListener.get(listener);
        if (wrapped) {
            byListener.delete(listener);
            this._ws.removeListener(event, wrapped);
        }
    }
    once(event, listener) {
        const onceListener = (...args) => {
            this.off(event, listener);
            listener(...args);
        };
        const wrapped = this._wrapListener(event, onceListener);
        this._listenersFor(event).set(listener, wrapped);
        this._ws.on(event, wrapped);
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
     * Normalizes `ws` message payloads: text frames become strings,
     * binary frames stay as `Buffer`, and fragmented frames are merged.
     */
    static _normalizeMessageData(data, isBinary) {
        if (!isBinary) {
            if (Array.isArray(data))
                return Buffer.concat(data).toString();
            if (data instanceof ArrayBuffer)
                return Buffer.from(data).toString();
            return data.toString();
        }
        if (Array.isArray(data))
            return Buffer.concat(data);
        if (data instanceof ArrayBuffer)
            return Buffer.from(data);
        return data;
    }
    _wrapListener(event, listener) {
        switch (event) {
            case 'message':
                return (data, isBinary) => {
                    listener(NodeWebSocket._normalizeMessageData(data, isBinary), isBinary);
                };
            case 'close':
                return (code, reason) => {
                    listener(code, reason.toString());
                };
            // 'open' and 'error' pass through unchanged
            default:
                return listener;
        }
    }
}
//# sourceMappingURL=ws-adapter-node.mjs.map