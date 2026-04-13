/**
 * @license
 * Copyright 2019 Google LLC
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
import { FetchStatus, CustomSignals } from '@firebase/remote-config-types';
import { FetchResponse, FirebaseRemoteConfigObject } from '../public_types';
/**
 * A general-purpose store keyed by app + namespace + {@link
 * ProjectNamespaceKeyFieldValue}.
 *
 * <p>The Remote Config SDK can be used with multiple app installations, and each app can interact
 * with multiple namespaces, so this store uses app (ID + name) and namespace as common parent keys
 * for a set of key-value pairs. See {@link Storage#createCompositeKey}.
 *
 * <p>Visible for testing.
 */
export declare const APP_NAMESPACE_STORE = "app_namespace_store";
/**
 * Encapsulates metadata concerning throttled fetch requests.
 */
export interface ThrottleMetadata {
    backoffCount: number;
    throttleEndTimeMillis: number;
}
export interface RealtimeBackoffMetadata {
    numFailedStreams: number;
    backoffEndTimeMillis: Date;
}
/**
 * Provides type-safety for the "key" field used by {@link APP_NAMESPACE_STORE}.
 *
 * <p>This seems like a small price to avoid potentially subtle bugs caused by a typo.
 */
type ProjectNamespaceKeyFieldValue = 'active_config' | 'active_config_etag' | 'active_experiments' | 'last_fetch_status' | 'last_successful_fetch_timestamp_millis' | 'last_successful_fetch_response' | 'settings' | 'throttle_metadata' | 'custom_signals' | 'realtime_backoff_metadata' | 'last_known_template_version';
export declare function openDatabase(): Promise<IDBDatabase>;
/**
 * Abstracts data persistence.
 */
export declare abstract class Storage {
    getLastFetchStatus(): Promise<FetchStatus | undefined>;
    setLastFetchStatus(status: FetchStatus): Promise<void>;
    getLastSuccessfulFetchTimestampMillis(): Promise<number | undefined>;
    setLastSuccessfulFetchTimestampMillis(timestamp: number): Promise<void>;
    getLastSuccessfulFetchResponse(): Promise<FetchResponse | undefined>;
    setLastSuccessfulFetchResponse(response: FetchResponse): Promise<void>;
    getActiveConfig(): Promise<FirebaseRemoteConfigObject | undefined>;
    setActiveConfig(config: FirebaseRemoteConfigObject): Promise<void>;
    getActiveConfigEtag(): Promise<string | undefined>;
    setActiveConfigEtag(etag: string): Promise<void>;
    getActiveExperiments(): Promise<Set<string> | undefined>;
    setActiveExperiments(experiments: Set<string>): Promise<void>;
    getThrottleMetadata(): Promise<ThrottleMetadata | undefined>;
    setThrottleMetadata(metadata: ThrottleMetadata): Promise<void>;
    deleteThrottleMetadata(): Promise<void>;
    getCustomSignals(): Promise<CustomSignals | undefined>;
    abstract setCustomSignals(customSignals: CustomSignals): Promise<CustomSignals>;
    abstract get<T>(key: ProjectNamespaceKeyFieldValue): Promise<T | undefined>;
    abstract set<T>(key: ProjectNamespaceKeyFieldValue, value: T): Promise<void>;
    abstract delete(key: ProjectNamespaceKeyFieldValue): Promise<void>;
    getRealtimeBackoffMetadata(): Promise<RealtimeBackoffMetadata | undefined>;
    setRealtimeBackoffMetadata(realtimeMetadata: RealtimeBackoffMetadata): Promise<void>;
    getActiveConfigTemplateVersion(): Promise<number | undefined>;
    setActiveConfigTemplateVersion(version: number): Promise<void>;
}
export declare class IndexedDbStorage extends Storage {
    private readonly appId;
    private readonly appName;
    private readonly namespace;
    private readonly openDbPromise;
    /**
     * @param appId enables storage segmentation by app (ID + name).
     * @param appName enables storage segmentation by app (ID + name).
     * @param namespace enables storage segmentation by namespace.
     */
    constructor(appId: string, appName: string, namespace: string, openDbPromise?: Promise<IDBDatabase>);
    setCustomSignals(customSignals: CustomSignals): Promise<CustomSignals>;
    /**
     * Gets a value from the database using the provided transaction.
     *
     * @param key The key of the value to get.
     * @param transaction The transaction to use for the operation.
     * @returns The value associated with the key, or undefined if no such value exists.
     */
    getWithTransaction<T>(key: ProjectNamespaceKeyFieldValue, transaction: IDBTransaction): Promise<T | undefined>;
    /**
     * Sets a value in the database using the provided transaction.
     *
     * @param key The key of the value to set.
     * @param value The value to set.
     * @param transaction The transaction to use for the operation.
     * @returns A promise that resolves when the operation is complete.
     */
    setWithTransaction<T>(key: ProjectNamespaceKeyFieldValue, value: T, transaction: IDBTransaction): Promise<void>;
    get<T>(key: ProjectNamespaceKeyFieldValue): Promise<T | undefined>;
    set<T>(key: ProjectNamespaceKeyFieldValue, value: T): Promise<void>;
    delete(key: ProjectNamespaceKeyFieldValue): Promise<void>;
    createCompositeKey(key: ProjectNamespaceKeyFieldValue): string;
}
export declare class InMemoryStorage extends Storage {
    private storage;
    get<T>(key: ProjectNamespaceKeyFieldValue): Promise<T>;
    set<T>(key: ProjectNamespaceKeyFieldValue, value: T): Promise<void>;
    delete(key: ProjectNamespaceKeyFieldValue): Promise<void>;
    setCustomSignals(customSignals: CustomSignals): Promise<CustomSignals>;
}
export {};
