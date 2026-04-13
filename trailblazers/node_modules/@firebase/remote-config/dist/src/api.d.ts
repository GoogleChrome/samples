/**
 * @license
 * Copyright 2020 Google LLC
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
import { FirebaseApp } from '@firebase/app';
import { CustomSignals, LogLevel as RemoteConfigLogLevel, RemoteConfig, Value, RemoteConfigOptions, ConfigUpdateObserver, Unsubscribe } from './public_types';
/**
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance.
 * @param options - Optional. The {@link RemoteConfigOptions} with which to instantiate the
 *     Remote Config instance.
 * @returns A {@link RemoteConfig} instance.
 *
 * @public
 */
export declare function getRemoteConfig(app?: FirebaseApp, options?: RemoteConfigOptions): RemoteConfig;
/**
 * Makes the last fetched config available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns A `Promise` which resolves to true if the current call activated the fetched configs.
 * If the fetched configs were already activated, the `Promise` will resolve to false.
 *
 * @public
 */
export declare function activate(remoteConfig: RemoteConfig): Promise<boolean>;
/**
 * Ensures the last activated config are available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 *
 * @returns A `Promise` that resolves when the last activated config is available to the getters.
 * @public
 */
export declare function ensureInitialized(remoteConfig: RemoteConfig): Promise<void>;
/**
 * Fetches and caches configuration from the Remote Config service.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @public
 */
export declare function fetchConfig(remoteConfig: RemoteConfig): Promise<void>;
/**
 * Gets all config.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns All config.
 *
 * @public
 */
export declare function getAll(remoteConfig: RemoteConfig): Record<string, Value>;
/**
 * Gets the value for the given key as a boolean.
 *
 * Convenience method for calling <code>remoteConfig.getValue(key).asBoolean()</code>.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param key - The name of the parameter.
 *
 * @returns The value for the given key as a boolean.
 * @public
 */
export declare function getBoolean(remoteConfig: RemoteConfig, key: string): boolean;
/**
 * Gets the value for the given key as a number.
 *
 * Convenience method for calling <code>remoteConfig.getValue(key).asNumber()</code>.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param key - The name of the parameter.
 *
 * @returns The value for the given key as a number.
 *
 * @public
 */
export declare function getNumber(remoteConfig: RemoteConfig, key: string): number;
/**
 * Gets the value for the given key as a string.
 * Convenience method for calling <code>remoteConfig.getValue(key).asString()</code>.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param key - The name of the parameter.
 *
 * @returns The value for the given key as a string.
 *
 * @public
 */
export declare function getString(remoteConfig: RemoteConfig, key: string): string;
/**
 * Gets the {@link Value} for the given key.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param key - The name of the parameter.
 *
 * @returns The value for the given key.
 *
 * @public
 */
export declare function getValue(remoteConfig: RemoteConfig, key: string): Value;
/**
 * Defines the log level to use.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param logLevel - The log level to set.
 *
 * @public
 */
export declare function setLogLevel(remoteConfig: RemoteConfig, logLevel: RemoteConfigLogLevel): void;
/**
 * Sets the custom signals for the app instance.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param customSignals - Map (key, value) of the custom signals to be set for the app instance. If
 * a key already exists, the value is overwritten. Setting the value of a custom signal to null
 * unsets the signal. The signals will be persisted locally on the client.
 *
 * @public
 */
export declare function setCustomSignals(remoteConfig: RemoteConfig, customSignals: CustomSignals): Promise<void>;
/**
 * Starts listening for real-time config updates from the Remote Config backend and automatically
 * fetches updates from the Remote Config backend when they are available.
 *
 * @remarks
 * If a connection to the Remote Config backend is not already open, calling this method will
 * open it. Multiple listeners can be added by calling this method again, but subsequent calls
 * re-use the same connection to the backend.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param observer - The {@link ConfigUpdateObserver} to be notified of config updates.
 * @returns An {@link Unsubscribe} function to remove the listener.
 *
 * @public
 */
export declare function onConfigUpdate(remoteConfig: RemoteConfig, observer: ConfigUpdateObserver): Unsubscribe;
