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
interface VersionService {
    library: string;
    version: string;
}
interface PlatformLoggerService {
    getPlatformInfoString(): string;
}
interface HeartbeatService {
    /**
     * Called to report a heartbeat. The function will generate
     * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
     * to IndexedDB.
     * Note that we only store one heartbeat per day. So if a heartbeat for today is
     * already logged, subsequent calls to this function in the same day will be ignored.
     */
    triggerHeartbeat(): Promise<void>;
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     */
    getHeartbeatsHeader(): Promise<string>;
}

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

/**
 * A {@link @firebase/app#FirebaseApp} holds the initialization information for a collection of
 * services.
 *
 * Do not call this constructor directly. Instead, use
 * {@link (initializeApp:1) | initializeApp()} to create an app.
 *
 * @public
 */
interface FirebaseApp {
    /**
     * The (read-only) name for this app.
     *
     * The default app's name is `"[DEFAULT]"`.
     *
     * @example
     * ```javascript
     * // The default app's name is "[DEFAULT]"
     * const app = initializeApp(defaultAppConfig);
     * console.log(app.name);  // "[DEFAULT]"
     * ```
     *
     * @example
     * ```javascript
     * // A named app's name is what you provide to initializeApp()
     * const otherApp = initializeApp(otherAppConfig, "other");
     * console.log(otherApp.name);  // "other"
     * ```
     */
    readonly name: string;
    /**
     * The (read-only) configuration options for this app. These are the original
     * parameters given in {@link (initializeApp:1) | initializeApp()}.
     *
     * @example
     * ```javascript
     * const app = initializeApp(config);
     * console.log(app.options.databaseURL === config.databaseURL);  // true
     * ```
     */
    readonly options: FirebaseOptions;
    /**
     * The settable config flag for GDPR opt-in/opt-out
     */
    automaticDataCollectionEnabled: boolean;
}
/**
 * @public
 *
 * Firebase configuration object. Contains a set of parameters required by
 * services in order to successfully communicate with Firebase server APIs
 * and to associate client data with your Firebase project and
 * Firebase application. Typically this object is populated by the Firebase
 * console at project setup. See also:
 * {@link https://firebase.google.com/docs/web/setup#config-object | Learn about the Firebase config object}.
 */
interface FirebaseOptions {
    /**
     * An encrypted string used when calling certain APIs that don't need to
     * access private user data
     * (example value: `AIzaSyDOCAbC123dEf456GhI789jKl012-MnO`).
     */
    apiKey?: string;
    /**
     * Auth domain for the project ID.
     */
    authDomain?: string;
    /**
     * Default Realtime Database URL.
     */
    databaseURL?: string;
    /**
     * The unique identifier for the project across all of Firebase and
     * Google Cloud.
     */
    projectId?: string;
    /**
     * The default Cloud Storage bucket name.
     */
    storageBucket?: string;
    /**
     * Unique numerical value used to identify each sender that can send
     * Firebase Cloud Messaging messages to client apps.
     */
    messagingSenderId?: string;
    /**
     * Unique identifier for the app.
     */
    appId?: string;
    /**
     * An ID automatically created when you enable Analytics in your
     * Firebase project and register a web app. In versions 7.20.0
     * and higher, this parameter is optional.
     */
    measurementId?: string;
}
declare module '@firebase/component' {
    interface NameServiceMapping {
        'app': FirebaseApp;
        'app-version': VersionService;
        'heartbeat': HeartbeatService;
        'platform-logger': PlatformLoggerService;
    }
}

/**
 * An object that can be injected into the environment as __FIREBASE_DEFAULTS__,
 * either as a property of globalThis, a shell environment variable, or a
 * cookie.
 *
 * This object can be used to automatically configure and initialize
 * a Firebase app as well as any emulators.
 *
 * @public
 */
interface FirebaseDefaults {
    config?: Record<string, string>;
    emulatorHosts?: Record<string, string>;
    _authTokenSyncURL?: string;
    _authIdTokenMaxAge?: number;
    /**
     * Override Firebase's runtime environment detection and
     * force the SDK to act as if it were in the specified environment.
     */
    forceEnvironment?: 'browser' | 'node';
    [key: string]: unknown;
}
declare global {
    var __FIREBASE_DEFAULTS__: FirebaseDefaults | undefined;
}

declare class FirebaseError extends Error {
    /** The error code for this error. */
    readonly code: string;
    /** Custom data for this error. */
    customData?: Record<string, unknown> | undefined;
    /** The custom name for all FirebaseErrors. */
    readonly name: string;
    constructor(
    /** The error code for this error. */
    code: string, message: string, 
    /** Custom data for this error. */
    customData?: Record<string, unknown> | undefined);
}

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

/**
 * The Firebase Remote Config service interface.
 *
 * @public
 */
interface RemoteConfig {
    /**
     * The {@link @firebase/app#FirebaseApp} this `RemoteConfig` instance is associated with.
     */
    app: FirebaseApp;
    /**
     * Defines configuration for the Remote Config SDK.
     */
    settings: RemoteConfigSettings;
    /**
     * Object containing default values for configs.
     */
    defaultConfig: {
        [key: string]: string | number | boolean;
    };
    /**
     * The Unix timestamp in milliseconds of the last <i>successful</i> fetch, or negative one if
     * the {@link RemoteConfig} instance either hasn't fetched or initialization
     * is incomplete.
     */
    fetchTimeMillis: number;
    /**
     * The status of the last fetch <i>attempt</i>.
     */
    lastFetchStatus: FetchStatus;
}
/**
 * Defines a self-descriptive reference for config key-value pairs.
 *
 *  @public
 */
interface FirebaseRemoteConfigObject {
    [key: string]: string;
}
/**
 * Defines experiment and variant attached to a config parameter.
 *
 * @public
 */
interface FirebaseExperimentDescription {
    experimentId: string;
    variantId: string;
    experimentStartTime: string;
    triggerTimeoutMillis: string;
    timeToLiveMillis: string;
    affectedParameterKeys?: string[];
}
/**
 * Defines a successful response (200 or 304).
 *
 * <p>Modeled after the native `Response` interface, but simplified for Remote Config's
 * use case.
 *
 * @public
 */
interface FetchResponse {
    /**
     * The HTTP status, which is useful for differentiating success responses with data from
     * those without.
     *
     * <p>The Remote Config client is modeled after the native `Fetch` interface, so
     * HTTP status is first-class.
     *
     * <p>Disambiguation: the fetch response returns a legacy "state" value that is redundant with the
     * HTTP status code. The former is normalized into the latter.
     */
    status: number;
    /**
     * Defines the ETag response header value.
     *
     * <p>Only defined for 200 and 304 responses.
     */
    eTag?: string;
    /**
     * Defines the map of parameters returned as "entries" in the fetch response body.
     *
     * <p>Only defined for 200 responses.
     */
    config?: FirebaseRemoteConfigObject;
    /**
     * The version number of the config template fetched from the server.
     */
    templateVersion?: number;
    /**
     * Metadata for A/B testing and Remote Config Rollout experiments.
     *
     * @remarks Only defined for 200 responses.
     */
    experiments?: FirebaseExperimentDescription[];
}
/**
 * Options for Remote Config initialization.
 *
 * @public
 */
interface RemoteConfigOptions {
    /**
     * The ID of the template to use. If not provided, defaults to "firebase".
     */
    templateId?: string;
    /**
     * Hydrates the state with an initial fetch response.
     */
    initialFetchResponse?: FetchResponse;
}
/**
 * Indicates the source of a value.
 *
 * <ul>
 *   <li>"static" indicates the value was defined by a static constant.</li>
 *   <li>"default" indicates the value was defined by default config.</li>
 *   <li>"remote" indicates the value was defined by fetched config.</li>
 * </ul>
 *
 * @public
 */
type ValueSource = 'static' | 'default' | 'remote';
/**
 * Wraps a value with metadata and type-safe getters.
 *
 * @public
 */
interface Value {
    /**
     * Gets the value as a boolean.
     *
     * The following values (case-insensitive) are interpreted as true:
     * "1", "true", "t", "yes", "y", "on". Other values are interpreted as false.
     */
    asBoolean(): boolean;
    /**
     * Gets the value as a number. Comparable to calling <code>Number(value) || 0</code>.
     */
    asNumber(): number;
    /**
     * Gets the value as a string.
     */
    asString(): string;
    /**
     * Gets the {@link ValueSource} for the given key.
     */
    getSource(): ValueSource;
}
/**
 * Defines configuration options for the Remote Config SDK.
 *
 * @public
 */
interface RemoteConfigSettings {
    /**
     * Defines the maximum age in milliseconds of an entry in the config cache before
     * it is considered stale. Defaults to 43200000 (Twelve hours).
     */
    minimumFetchIntervalMillis: number;
    /**
     * Defines the maximum amount of milliseconds to wait for a response when fetching
     * configuration from the Remote Config server. Defaults to 60000 (One minute).
     */
    fetchTimeoutMillis: number;
}
/**
 * Summarizes the outcome of the last attempt to fetch config from the Firebase Remote Config server.
 *
 * <ul>
 *   <li>"no-fetch-yet" indicates the {@link RemoteConfig} instance has not yet attempted
 *       to fetch config, or that SDK initialization is incomplete.</li>
 *   <li>"success" indicates the last attempt succeeded.</li>
 *   <li>"failure" indicates the last attempt failed.</li>
 *   <li>"throttle" indicates the last attempt was rate-limited.</li>
 * </ul>
 *
 * @public
 */
type FetchStatus = 'no-fetch-yet' | 'success' | 'failure' | 'throttle';
/**
 * Defines levels of Remote Config logging.
 *
 * @public
 */
type LogLevel = 'debug' | 'error' | 'silent';
/**
 * Defines the type for representing custom signals and their values.
 *
 * <p>The values in CustomSignals must be one of the following types:
 *
 * <ul>
 *   <li><code>string</code>
 *   <li><code>number</code>
 *   <li><code>null</code>
 * </ul>
 *
 * @public
 */
interface CustomSignals {
    [key: string]: string | number | null;
}
/**
 * Contains information about which keys have been updated.
 *
 * @public
 */
interface ConfigUpdate {
    /**
     * Parameter keys whose values have been updated from the currently activated values.
     * Includes keys that are added, deleted, or whose value, value source, or metadata has changed.
     */
    getUpdatedKeys(): Set<string>;
}
/**
 * Observer interface for receiving real-time Remote Config update notifications.
 *
 * NOTE: Although an `complete` callback can be provided, it will
 * never be called because the ConfigUpdate stream is never-ending.
 *
 * @public
 */
interface ConfigUpdateObserver {
    /**
     * Called when a new ConfigUpdate is available.
     */
    next: (configUpdate: ConfigUpdate) => void;
    /**
     * Called if an error occurs during the stream.
     */
    error: (error: FirebaseError) => void;
    /**
     * Called when the stream is gracefully terminated.
     */
    complete: () => void;
}
/**
 * A function that unsubscribes from a real-time event stream.
 *
 * @public
 */
type Unsubscribe = () => void;
/**
 * Indicates the type of fetch request.
 *
 * <ul>
 *   <li>"BASE" indicates a standard fetch request.</li>
 *   <li>"REALTIME" indicates a fetch request triggered by a real-time update.</li>
 * </ul>
 *
 * @public
 */
type FetchType = 'BASE' | 'REALTIME';
declare module '@firebase/component' {
    interface NameServiceMapping {
        'remote-config': RemoteConfig;
    }
}

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

/**
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance.
 * @param options - Optional. The {@link RemoteConfigOptions} with which to instantiate the
 *     Remote Config instance.
 * @returns A {@link RemoteConfig} instance.
 *
 * @public
 */
declare function getRemoteConfig(app?: FirebaseApp, options?: RemoteConfigOptions): RemoteConfig;
/**
 * Makes the last fetched config available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns A `Promise` which resolves to true if the current call activated the fetched configs.
 * If the fetched configs were already activated, the `Promise` will resolve to false.
 *
 * @public
 */
declare function activate(remoteConfig: RemoteConfig): Promise<boolean>;
/**
 * Ensures the last activated config are available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 *
 * @returns A `Promise` that resolves when the last activated config is available to the getters.
 * @public
 */
declare function ensureInitialized(remoteConfig: RemoteConfig): Promise<void>;
/**
 * Fetches and caches configuration from the Remote Config service.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @public
 */
declare function fetchConfig(remoteConfig: RemoteConfig): Promise<void>;
/**
 * Gets all config.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns All config.
 *
 * @public
 */
declare function getAll(remoteConfig: RemoteConfig): Record<string, Value>;
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
declare function getBoolean(remoteConfig: RemoteConfig, key: string): boolean;
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
declare function getNumber(remoteConfig: RemoteConfig, key: string): number;
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
declare function getString(remoteConfig: RemoteConfig, key: string): string;
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
declare function getValue(remoteConfig: RemoteConfig, key: string): Value;
/**
 * Defines the log level to use.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param logLevel - The log level to set.
 *
 * @public
 */
declare function setLogLevel(remoteConfig: RemoteConfig, logLevel: LogLevel): void;
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
declare function setCustomSignals(remoteConfig: RemoteConfig, customSignals: CustomSignals): Promise<void>;
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
declare function onConfigUpdate(remoteConfig: RemoteConfig, observer: ConfigUpdateObserver): Unsubscribe;

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

/**
 *
 * Performs fetch and activate operations, as a convenience.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 *
 * @returns A `Promise` which resolves to true if the current call activated the fetched configs.
 * If the fetched configs were already activated, the `Promise` will resolve to false.
 *
 * @public
 */
declare function fetchAndActivate(remoteConfig: RemoteConfig): Promise<boolean>;
/**
 * This method provides two different checks:
 *
 * 1. Check if IndexedDB exists in the browser environment.
 * 2. Check if the current browser context allows IndexedDB `open()` calls.
 *
 * @returns A `Promise` which resolves to true if a {@link RemoteConfig} instance
 * can be initialized in this environment, or false if it cannot.
 * @public
 */
declare function isSupported(): Promise<boolean>;

/**
 * The Firebase Remote Config Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */
declare global {
    interface Window {
        FIREBASE_REMOTE_CONFIG_URL_BASE: string;
    }
}

export { ConfigUpdate, ConfigUpdateObserver, CustomSignals, FetchResponse, FetchStatus, FetchType, FirebaseExperimentDescription, FirebaseRemoteConfigObject, LogLevel, RemoteConfig, RemoteConfigOptions, RemoteConfigSettings, Unsubscribe, Value, ValueSource, activate, ensureInitialized, fetchAndActivate, fetchConfig, getAll, getBoolean, getNumber, getRemoteConfig, getString, getValue, isSupported, onConfigUpdate, setCustomSignals, setLogLevel };
