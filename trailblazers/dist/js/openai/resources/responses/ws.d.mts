import * as WS from 'ws';
import { ResponsesEmitter } from "./internal-base.mjs";
import * as ResponsesAPI from "./responses.mjs";
import { OpenAI } from "../../client.mjs";
export declare class ResponsesWS extends ResponsesEmitter {
    url: URL;
    socket: WS.WebSocket;
    private client;
    constructor(client: OpenAI, options?: WS.ClientOptions | null | undefined);
    send(event: ResponsesAPI.ResponsesClientEvent): void;
    close(props?: {
        code: number;
        reason: string;
    }): void;
    private authHeaders;
}
//# sourceMappingURL=ws.d.mts.map