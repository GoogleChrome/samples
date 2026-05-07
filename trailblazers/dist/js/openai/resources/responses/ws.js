"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsesWS = void 0;
const tslib_1 = require("../../internal/tslib.js");
const WS = tslib_1.__importStar(require("ws"));
const ws_adapter_node_1 = require("../../internal/ws-adapter-node.js");
const ws_base_1 = require("./ws-base.js");
class ResponsesWS extends ws_base_1.ResponsesWSBase {
    constructor(client, options) {
        if (!WS?.WebSocket) {
            throw new Error('ResponsesWS from "openai/resources/responses/ws" requires the "ws" package but it could not be loaded.');
        }
        const { reconnect, maxQueueSize, ...wsOptions } = options ?? {};
        super(client, { reconnect, maxQueueSize });
        this._wsOptions = wsOptions;
        this._connectInitial();
    }
    _createSocket(url, authHeaders) {
        const ws = new WS.WebSocket(url, {
            ...this._wsOptions,
            headers: {
                ...authHeaders,
                ...this._wsOptions?.headers,
            },
        });
        return new ws_adapter_node_1.NodeWebSocket(ws);
    }
}
exports.ResponsesWS = ResponsesWS;
//# sourceMappingURL=ws.js.map