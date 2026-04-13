/**
 * @license
 * Copyright 2025 Google LLC
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
import { CacheProvider, CacheSettings, type ConnectorConfig } from '../api/DataConnect';
import { type AuthTokenProvider } from '../core/FirebaseAuthProvider';
import { InternalCacheProvider } from './CacheProvider';
import { InMemoryCacheProvider } from './InMemoryCacheProvider';
import { ResultTree } from './ResultTree';
export declare const Memory = "memory";
export type DataConnectStorage = typeof Memory;
/**
 * ServerValues
 */
export interface ServerValues extends Record<string, unknown> {
    maxAge?: number;
}
export declare class DataConnectCache {
    private authProvider;
    private projectId;
    private connectorConfig;
    private host;
    cacheSettings: CacheSettings;
    private cacheProvider;
    private uid;
    constructor(authProvider: AuthTokenProvider, projectId: string, connectorConfig: ConnectorConfig, host: string, cacheSettings: CacheSettings);
    initialize(): Promise<void>;
    getIdentifier(uid: string | null): Promise<string>;
    initializeNewProviders(identifier: string): InternalCacheProvider;
    containsResultTree(queryId: string): Promise<boolean>;
    getResultTree(queryId: string): Promise<ResultTree | undefined>;
    getResultJSON(queryId: string): Promise<Record<string, unknown>>;
    update(queryId: string, serverValues: ServerValues, entityIds: Record<string, unknown>): Promise<string[]>;
}
export declare class MemoryStub implements CacheProvider<'MEMORY'> {
    type: 'MEMORY';
    /**
     * @internal
     */
    initialize(cacheId: string): InMemoryCacheProvider;
}
