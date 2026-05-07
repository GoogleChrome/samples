import * as WS from 'ws';
import { NodeWebSocket } from "../../internal/ws-adapter-node.mjs";
import { ResponsesWSBase, type ResponsesWSBaseOptions } from "./ws-base.mjs";
import { OpenAI } from "../../client.mjs";
export type { ResponsesWSReconnectOptions } from "./ws-base.mjs";
export interface ResponsesWSClientOptions extends WS.ClientOptions, ResponsesWSBaseOptions {
}
export declare class ResponsesWS extends ResponsesWSBase<NodeWebSocket> {
    private _wsOptions;
    constructor(client: OpenAI, options?: ResponsesWSClientOptions | null | undefined);
    protected _createSocket(url: URL, authHeaders: Record<string, string>): NodeWebSocket;
}
//# sourceMappingURL=ws.d.mts.map