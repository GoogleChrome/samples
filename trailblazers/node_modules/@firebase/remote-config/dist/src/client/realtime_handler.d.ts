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
import { _FirebaseInstallationsInternal } from '@firebase/installations';
import { Logger } from '@firebase/logger';
import { ConfigUpdateObserver } from '../public_types';
import { Storage } from '../storage/storage';
import { StorageCache } from '../storage/storage_cache';
import { CachingClient } from './caching_client';
export declare class RealtimeHandler {
    private readonly firebaseInstallations;
    private readonly storage;
    private readonly sdkVersion;
    private readonly namespace;
    private readonly projectId;
    private readonly apiKey;
    private readonly appId;
    private readonly logger;
    private readonly storageCache;
    private readonly cachingClient;
    constructor(firebaseInstallations: _FirebaseInstallationsInternal, storage: Storage, sdkVersion: string, namespace: string, projectId: string, apiKey: string, appId: string, logger: Logger, storageCache: StorageCache, cachingClient: CachingClient);
    private observers;
    private isConnectionActive;
    private isRealtimeDisabled;
    private controller?;
    private reader;
    private httpRetriesRemaining;
    private isInBackground;
    private readonly decoder;
    private isClosingConnection;
    private setRetriesRemaining;
    private propagateError;
    /**
     * Increment the number of failed stream attempts, increase the backoff duration, set the backoff
     * end time to "backoff duration" after `lastFailedStreamTime` and persist the new
     * values to storage metadata.
     */
    private updateBackoffMetadataWithLastFailedStreamConnectionTime;
    /**
     * Increase the backoff duration with a new end time based on Retry Interval.
     */
    private updateBackoffMetadataWithRetryInterval;
    /**
     * HTTP status code that the Realtime client should retry on.
     */
    private isStatusCodeRetryable;
    /**
     * Closes the realtime HTTP connection.
     * Note: This method is designed to be called only once at a time.
     * If a call is already in progress, subsequent calls will be ignored.
     */
    private closeRealtimeHttpConnection;
    private resetRealtimeBackoff;
    private resetRetryCount;
    /**
     * Assembles the request headers and body and executes the fetch request to
     * establish the real-time streaming connection. This is the "worker" method
     * that performs the actual network communication.
     */
    private establishRealtimeConnection;
    private getRealtimeUrl;
    private createRealtimeConnection;
    /**
     * Retries HTTP stream connection asyncly in random time intervals.
     */
    private retryHttpConnectionWhenBackoffEnds;
    private setIsHttpConnectionRunning;
    /**
     * Combines the check and set operations to prevent multiple asynchronous
     * calls from redundantly starting an HTTP connection. This ensures that
     * only one attempt is made at a time.
     */
    private checkAndSetHttpConnectionFlagIfNotRunning;
    private fetchResponseIsUpToDate;
    private parseAndValidateConfigUpdateMessage;
    private isEventListenersEmpty;
    private getRandomInt;
    private executeAllListenerCallbacks;
    /**
     * Compares two configuration objects and returns a set of keys that have changed.
     * A key is considered changed if it's new, removed, or has a different value.
     */
    private getChangedParams;
    private fetchLatestConfig;
    private autoFetch;
    /**
     * Processes a stream of real-time messages for configuration updates.
     * This method reassembles fragmented messages, validates and parses the JSON,
     * and automatically fetches a new config if a newer template version is available.
     * It also handles server-specified retry intervals and propagates errors for
     * invalid messages or when real-time updates are disabled.
     */
    private handleNotifications;
    private listenForNotifications;
    /**
     * Open the real-time connection, begin listening for updates, and auto-fetch when an update is
     * received.
     *
     * If the connection is successful, this method will block on its thread while it reads the
     * chunk-encoded HTTP body. When the connection closes, it attempts to reestablish the stream.
     */
    private prepareAndBeginRealtimeHttpStream;
    /**
     * Checks whether connection can be made or not based on some conditions
     * @returns booelean
     */
    private canEstablishStreamConnection;
    private makeRealtimeHttpConnection;
    private beginRealtime;
    /**
     * Adds an observer to the realtime updates.
     * @param observer The observer to add.
     */
    addObserver(observer: ConfigUpdateObserver): void;
    /**
     * Removes an observer from the realtime updates.
     * @param observer The observer to remove.
     */
    removeObserver(observer: ConfigUpdateObserver): void;
    /**
     * Handles changes to the application's visibility state, managing the real-time connection.
     *
     * When the application is moved to the background, this method closes the existing
     * real-time connection to save resources. When the application returns to the
     * foreground, it attempts to re-establish the connection.
     */
    private onVisibilityChange;
}
