"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsesWS = void 0;
const tslib_1 = require("../../internal/tslib.js");
const WS = tslib_1.__importStar(require("ws"));
const internal_base_1 = require("./internal-base.js");
class ResponsesWS extends internal_base_1.ResponsesEmitter {
    constructor(client, options) {
        super();
        this.client = client;
        this.url = (0, internal_base_1.buildURL)(client, {});
        this.socket = new WS.WebSocket(this.url, {
            ...options,
            headers: {
                ...this.authHeaders(),
                ...options?.headers,
            },
        });
        this.socket.on('message', (wsEvent) => {
            const event = (() => {
                try {
                    return JSON.parse(wsEvent.toString());
                }
                catch (err) {
                    this._onError(null, 'could not parse websocket event', err);
                    return null;
                }
            })();
            if (event) {
                this._emit('event', event);
                if (event.type === 'error') {
                    this._onError(event);
                }
                else {
                    // @ts-ignore TS isn't smart enough to get the relationship right here
                    this._emit(event.type, event);
                }
            }
        });
        this.socket.on('error', (err) => {
            this._onError(null, err.message, err);
        });
    }
    send(event) {
        try {
            this.socket.send(JSON.stringify(event));
        }
        catch (err) {
            this._onError(null, 'could not send data', err);
        }
    }
    close(props) {
        try {
            this.socket.close(props?.code ?? 1000, props?.reason ?? 'OK');
        }
        catch (err) {
            this._onError(null, 'could not close the connection', err);
        }
    }
    authHeaders() {
        return { Authorization: `Bearer ${this.client.apiKey}` };
        return {};
    }
}
exports.ResponsesWS = ResponsesWS;
//# sourceMappingURL=ws.js.map