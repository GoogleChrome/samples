/**
 * @license
 * Copyright 2024 Google LLC
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
import { type DataConnect } from '../../api/DataConnect';
import { QueryRef, QueryResult } from '../../api/query';
import { SerializedRef, DataSource } from '../../api/Reference';
import { DataConnectCache } from '../../cache/Cache';
import { DataConnectTransport } from '../../network';
import { DataConnectExtensionWithMaxAge } from '../../network/transport';
import { OnCompleteSubscription, OnErrorSubscription, OnResultSubscription } from './subscribe';
export declare function getRefSerializer<Data, Variables>(queryRef: QueryRef<Data, Variables>, data: Data, source: DataSource, fetchTime: string): () => SerializedRef<Data, Variables>;
export declare class QueryManager {
    private transport;
    private dc;
    private cache?;
    preferCacheResults<Data, Variables>(queryRef: QueryRef<Data, Variables>, allowStale?: boolean): Promise<QueryResult<Data, Variables>>;
    private callbacks;
    private subscriptionCache;
    constructor(transport: DataConnectTransport, dc: DataConnect, cache?: DataConnectCache | undefined);
    private queue;
    waitForQueuedWrites(): Promise<void>;
    updateSSR<Data, Variables>(updatedData: QueryResult<Data, Variables>): void;
    updateCache<Data, Variables>(result: QueryResult<Data, Variables>, extensions?: DataConnectExtensionWithMaxAge[]): Promise<string[]>;
    addSubscription<Data, Variables>(queryRef: QueryRef<Data, Variables>, onResultCallback: OnResultSubscription<Data, Variables>, onCompleteCallback?: OnCompleteSubscription, onErrorCallback?: OnErrorSubscription, initialCache?: QueryResult<Data, Variables>): () => void;
    fetchServerResults<Data, Variables>(queryRef: QueryRef<Data, Variables>): Promise<QueryResult<Data, Variables>>;
    fetchCacheResults<Data, Variables>(queryRef: QueryRef<Data, Variables>, allowStale?: boolean): Promise<QueryResult<Data, Variables>>;
    publishErrorToSubscribers(key: string, err: unknown): void;
    getFromResultTreeCache<Data, Variables>(queryRef: QueryRef<Data, Variables>, allowStale?: boolean): Promise<QueryResult<Data, Variables> | null>;
    getFromSubscriberCache<Data, Variables>(queryRef: QueryRef<Data, Variables>): Promise<QueryResult<Data, Variables> | undefined>;
    publishDataToSubscribers(key: string, queryResult: QueryResult<unknown, unknown>): void;
    publishCacheResultsToSubscribers(impactedQueries: string[], fetchTime: string): Promise<void>;
    enableEmulator(host: string, port: number): void;
}
export declare function getMaxAgeFromExtensions(extensions: DataConnectExtensionWithMaxAge[] | undefined): number | undefined;
