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
import * as grpc from '@grpc/grpc-js';
import { Token } from '../../api/credentials';
import { DatabaseInfo } from '../../core/database_info';
import { ResourcePath } from '../../model/path';
import { Connection, Stream } from '../../remote/connection';
type GeneratedGrpcStub = any;
/**
 * A Connection implemented by GRPC-Node.
 */
export declare class GrpcConnection implements Connection {
    private databaseInfo;
    private readonly databasePath;
    private readonly firestore;
    private cachedStub;
    get shouldResourcePathBeIncludedInRequest(): boolean;
    constructor(protos: grpc.GrpcObject, databaseInfo: DatabaseInfo);
    /** made protected for testing */
    protected ensureActiveStub(): GeneratedGrpcStub;
    invokeRPC<Req, Resp>(rpcName: string, path: ResourcePath, request: Req, authToken: Token | null, appCheckToken: Token | null): Promise<Resp>;
    invokeStreamingRPC<Req, Resp>(rpcName: string, path: ResourcePath, request: Req, authToken: Token | null, appCheckToken: Token | null, expectedResponseCount?: number): Promise<Resp[]>;
    openStream<Req, Resp>(rpcName: string, authToken: Token | null, appCheckToken: Token | null): Stream<Req, Resp>;
    /**
     * Closes and cleans up any resources associated with the GrpcConnection.
     * If a gRPC client has been generated for this connection, the gRPC client
     * is closed. Failure to call terminate on a GrpcConnection can result
     * in leaked resources of the gRPC client.
     */
    terminate(): void;
}
export {};
