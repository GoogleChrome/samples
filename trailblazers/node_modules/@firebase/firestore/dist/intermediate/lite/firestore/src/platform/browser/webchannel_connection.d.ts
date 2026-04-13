/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { WebChannel, WebChannelTransport } from '@firebase/webchannel-wrapper/webchannel-blob';
import { Token } from '../../api/credentials';
import { DatabaseInfo } from '../../core/database_info';
import { Stream } from '../../remote/connection';
import { RestConnection } from '../../remote/rest_connection';
import { StringMap } from '../../util/types';
export declare class WebChannelConnection extends RestConnection {
    private readonly forceLongPolling;
    private readonly autoDetectLongPolling;
    private readonly useFetchStreams;
    private readonly longPollingOptions;
    /** A collection of open WebChannel instances */
    private openWebChannels;
    constructor(info: DatabaseInfo);
    /**
     * Track if the STAT_EVENT listener has been initialized.
     */
    static statEventListenerInitialized: boolean;
    /**
     * Initialize STAT_EVENT listener once. Subsequent calls are a no-op.
     * getStatEventTarget() returns the same target every time.
     */
    static ensureStatEventListenerInitialized(): void;
    protected performRPCRequest<Req, Resp>(rpcName: string, url: string, headers: StringMap, body: Req, _forwardCredentials: boolean): Promise<Resp>;
    openStream<Req, Resp>(rpcName: string, authToken: Token | null, appCheckToken: Token | null): Stream<Req, Resp>;
    /**
     * Closes and cleans up any resources associated with the connection.
     */
    terminate(): void;
    /**
     * Add a WebChannel instance to the collection of open instances.
     * @param webChannel
     */
    addOpenWebChannel(webChannel: WebChannel): void;
    /**
     * Remove a WebChannel instance from the collection of open instances.
     * @param webChannel
     */
    removeOpenWebChannel(webChannel: WebChannel): void;
    /**
     * Modifies the headers for a request, adding the api key if present,
     * and then calling super.modifyHeadersForRequest
     */
    protected modifyHeadersForRequest(headers: StringMap, authToken: Token | null, appCheckToken: Token | null): void;
    /**
     * Wrapped for mocking.
     * @protected
     */
    protected createWebChannelTransport(): WebChannelTransport;
}
