import { _getProvider, getApp, _registerComponent, registerVersion, SDK_VERSION } from '@firebase/app';
import { ErrorFactory, FirebaseError, getModularInstance, deepEqual, calculateBackoffMillis, assert, isIndexedDBAvailable, validateIndexedDBOpenable } from '@firebase/util';
import { Component } from '@firebase/component';
import { LogLevel, Logger } from '@firebase/logger';
import '@firebase/installations';

const name = "@firebase/remote-config";
const version = "0.8.2";

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
/**
 * Shims a minimal AbortSignal.
 *
 * <p>AbortController's AbortSignal conveniently decouples fetch timeout logic from other aspects
 * of networking, such as retries. Firebase doesn't use AbortController enough to justify a
 * polyfill recommendation, like we do with the Fetch API, but this minimal shim can easily be
 * swapped out if/when we do.
 */
class RemoteConfigAbortSignal {
    constructor() {
        this.listeners = [];
    }
    addEventListener(listener) {
        this.listeners.push(listener);
    }
    abort() {
        this.listeners.forEach(listener => listener());
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
const RC_COMPONENT_NAME = 'remote-config';
const RC_CUSTOM_SIGNAL_MAX_ALLOWED_SIGNALS = 100;
const RC_CUSTOM_SIGNAL_KEY_MAX_LENGTH = 250;
const RC_CUSTOM_SIGNAL_VALUE_MAX_LENGTH = 500;

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
const ERROR_DESCRIPTION_MAP = {
    ["already-initialized" /* ErrorCode.ALREADY_INITIALIZED */]: 'Remote Config already initialized',
    ["registration-window" /* ErrorCode.REGISTRATION_WINDOW */]: 'Undefined window object. This SDK only supports usage in a browser environment.',
    ["registration-project-id" /* ErrorCode.REGISTRATION_PROJECT_ID */]: 'Undefined project identifier. Check Firebase app initialization.',
    ["registration-api-key" /* ErrorCode.REGISTRATION_API_KEY */]: 'Undefined API key. Check Firebase app initialization.',
    ["registration-app-id" /* ErrorCode.REGISTRATION_APP_ID */]: 'Undefined app identifier. Check Firebase app initialization.',
    ["storage-open" /* ErrorCode.STORAGE_OPEN */]: 'Error thrown when opening storage. Original error: {$originalErrorMessage}.',
    ["storage-get" /* ErrorCode.STORAGE_GET */]: 'Error thrown when reading from storage. Original error: {$originalErrorMessage}.',
    ["storage-set" /* ErrorCode.STORAGE_SET */]: 'Error thrown when writing to storage. Original error: {$originalErrorMessage}.',
    ["storage-delete" /* ErrorCode.STORAGE_DELETE */]: 'Error thrown when deleting from storage. Original error: {$originalErrorMessage}.',
    ["fetch-client-network" /* ErrorCode.FETCH_NETWORK */]: 'Fetch client failed to connect to a network. Check Internet connection.' +
        ' Original error: {$originalErrorMessage}.',
    ["fetch-timeout" /* ErrorCode.FETCH_TIMEOUT */]: 'The config fetch request timed out. ' +
        ' Configure timeout using "fetchTimeoutMillis" SDK setting.',
    ["fetch-throttle" /* ErrorCode.FETCH_THROTTLE */]: 'The config fetch request timed out while in an exponential backoff state.' +
        ' Configure timeout using "fetchTimeoutMillis" SDK setting.' +
        ' Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.',
    ["fetch-client-parse" /* ErrorCode.FETCH_PARSE */]: 'Fetch client could not parse response.' +
        ' Original error: {$originalErrorMessage}.',
    ["fetch-status" /* ErrorCode.FETCH_STATUS */]: 'Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.',
    ["indexed-db-unavailable" /* ErrorCode.INDEXED_DB_UNAVAILABLE */]: 'Indexed DB is not supported by current browser',
    ["custom-signal-max-allowed-signals" /* ErrorCode.CUSTOM_SIGNAL_MAX_ALLOWED_SIGNALS */]: 'Setting more than {$maxSignals} custom signals is not supported.',
    ["stream-error" /* ErrorCode.CONFIG_UPDATE_STREAM_ERROR */]: 'The stream was not able to connect to the backend: {$originalErrorMessage}.',
    ["realtime-unavailable" /* ErrorCode.CONFIG_UPDATE_UNAVAILABLE */]: 'The Realtime service is unavailable: {$originalErrorMessage}',
    ["update-message-invalid" /* ErrorCode.CONFIG_UPDATE_MESSAGE_INVALID */]: 'The stream invalidation message was unparsable: {$originalErrorMessage}',
    ["update-not-fetched" /* ErrorCode.CONFIG_UPDATE_NOT_FETCHED */]: 'Unable to fetch the latest config: {$originalErrorMessage}',
    ["analytics-unavailable" /* ErrorCode.ANALYTICS_UNAVAILABLE */]: 'Connection to Firebase Analytics failed: {$originalErrorMessage}'
};
const ERROR_FACTORY = new ErrorFactory('remoteconfig' /* service */, 'Remote Config' /* service name */, ERROR_DESCRIPTION_MAP);
// Note how this is like typeof/instanceof, but for ErrorCode.
function hasErrorCode(e, errorCode) {
    return e instanceof FirebaseError && e.code.indexOf(errorCode) !== -1;
}

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
const DEFAULT_VALUE_FOR_BOOLEAN = false;
const DEFAULT_VALUE_FOR_STRING = '';
const DEFAULT_VALUE_FOR_NUMBER = 0;
const BOOLEAN_TRUTHY_VALUES = ['1', 'true', 't', 'yes', 'y', 'on'];
class Value {
    constructor(_source, _value = DEFAULT_VALUE_FOR_STRING) {
        this._source = _source;
        this._value = _value;
    }
    asString() {
        return this._value;
    }
    asBoolean() {
        if (this._source === 'static') {
            return DEFAULT_VALUE_FOR_BOOLEAN;
        }
        return BOOLEAN_TRUTHY_VALUES.indexOf(this._value.toLowerCase()) >= 0;
    }
    asNumber() {
        if (this._source === 'static') {
            return DEFAULT_VALUE_FOR_NUMBER;
        }
        let num = Number(this._value);
        if (isNaN(num)) {
            num = DEFAULT_VALUE_FOR_NUMBER;
        }
        return num;
    }
    getSource() {
        return this._source;
    }
}

class Experiment {
    constructor(rc) {
        this.storage = rc._storage;
        this.logger = rc._logger;
        this.analyticsProvider = rc._analyticsProvider;
    }
    async updateActiveExperiments(latestExperiments) {
        const currentActiveExperiments = (await this.storage.getActiveExperiments()) || new Set();
        const experimentInfoMap = this.createExperimentInfoMap(latestExperiments);
        this.addActiveExperiments(experimentInfoMap);
        this.removeInactiveExperiments(currentActiveExperiments, experimentInfoMap);
        return this.storage.setActiveExperiments(new Set(experimentInfoMap.keys()));
    }
    createExperimentInfoMap(latestExperiments) {
        const experimentInfoMap = new Map();
        for (const experiment of latestExperiments) {
            experimentInfoMap.set(experiment.experimentId, experiment);
        }
        return experimentInfoMap;
    }
    addActiveExperiments(experimentInfoMap) {
        const customProperty = {};
        for (const [experimentId, experimentInfo] of experimentInfoMap.entries()) {
            customProperty[`firebase${experimentId}`] = experimentInfo.variantId;
        }
        this.addExperimentToAnalytics(customProperty);
    }
    removeInactiveExperiments(currentActiveExperiments, experimentInfoMap) {
        const customProperty = {};
        for (const experimentId of currentActiveExperiments) {
            if (!experimentInfoMap.has(experimentId)) {
                customProperty[`firebase${experimentId}`] = null;
            }
        }
        this.addExperimentToAnalytics(customProperty);
    }
    addExperimentToAnalytics(customProperty) {
        if (Object.keys(customProperty).length === 0) {
            return;
        }
        try {
            const analytics = this.analyticsProvider.getImmediate({ optional: true });
            if (analytics) {
                analytics.setUserProperties(customProperty);
                analytics.logEvent(`set_firebase_experiment_state`);
            }
            else {
                this.logger.warn(`Analytics import failed. Verify if you have imported Firebase Analytics in your app code.`);
            }
        }
        catch (error) {
            throw ERROR_FACTORY.create("analytics-unavailable" /* ErrorCode.ANALYTICS_UNAVAILABLE */, {
                originalErrorMessage: error?.message
            });
        }
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
function getRemoteConfig(app = getApp(), options = {}) {
    app = getModularInstance(app);
    const rcProvider = _getProvider(app, RC_COMPONENT_NAME);
    if (rcProvider.isInitialized()) {
        const initialOptions = rcProvider.getOptions();
        if (deepEqual(initialOptions, options)) {
            return rcProvider.getImmediate();
        }
        throw ERROR_FACTORY.create("already-initialized" /* ErrorCode.ALREADY_INITIALIZED */);
    }
    rcProvider.initialize({ options });
    const rc = rcProvider.getImmediate();
    if (options.initialFetchResponse) {
        // We use these initial writes as the initialization promise since they will hydrate the same
        // fields that `storageCache.loadFromStorage` would set.
        rc._initializePromise = Promise.all([
            rc._storage.setLastSuccessfulFetchResponse(options.initialFetchResponse),
            rc._storage.setActiveConfigEtag(options.initialFetchResponse?.eTag || ''),
            rc._storage.setActiveConfigTemplateVersion(options.initialFetchResponse.templateVersion || 0),
            rc._storageCache.setLastSuccessfulFetchTimestampMillis(Date.now()),
            rc._storageCache.setLastFetchStatus('success'),
            rc._storageCache.setActiveConfig(options.initialFetchResponse?.config || {})
        ]).then();
        // The `storageCache` methods above set their in-memory fields synchronously, so it's
        // safe to declare our initialization complete at this point.
        rc._isInitializationComplete = true;
    }
    return rc;
}
/**
 * Makes the last fetched config available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns A `Promise` which resolves to true if the current call activated the fetched configs.
 * If the fetched configs were already activated, the `Promise` will resolve to false.
 *
 * @public
 */
async function activate(remoteConfig) {
    const rc = getModularInstance(remoteConfig);
    const [lastSuccessfulFetchResponse, activeConfigEtag] = await Promise.all([
        rc._storage.getLastSuccessfulFetchResponse(),
        rc._storage.getActiveConfigEtag()
    ]);
    if (!lastSuccessfulFetchResponse ||
        !lastSuccessfulFetchResponse.config ||
        !lastSuccessfulFetchResponse.eTag ||
        !lastSuccessfulFetchResponse.templateVersion ||
        lastSuccessfulFetchResponse.eTag === activeConfigEtag) {
        // Either there is no successful fetched config, or is the same as current active
        // config.
        return false;
    }
    const experiment = new Experiment(rc);
    const updateActiveExperiments = lastSuccessfulFetchResponse.experiments
        ? experiment.updateActiveExperiments(lastSuccessfulFetchResponse.experiments)
        : Promise.resolve();
    await Promise.all([
        rc._storageCache.setActiveConfig(lastSuccessfulFetchResponse.config),
        rc._storage.setActiveConfigEtag(lastSuccessfulFetchResponse.eTag),
        rc._storage.setActiveConfigTemplateVersion(lastSuccessfulFetchResponse.templateVersion),
        updateActiveExperiments
    ]);
    return true;
}
/**
 * Ensures the last activated config are available to the getters.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 *
 * @returns A `Promise` that resolves when the last activated config is available to the getters.
 * @public
 */
function ensureInitialized(remoteConfig) {
    const rc = getModularInstance(remoteConfig);
    if (!rc._initializePromise) {
        rc._initializePromise = rc._storageCache.loadFromStorage().then(() => {
            rc._isInitializationComplete = true;
        });
    }
    return rc._initializePromise;
}
/**
 * Fetches and caches configuration from the Remote Config service.
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @public
 */
async function fetchConfig(remoteConfig) {
    const rc = getModularInstance(remoteConfig);
    // Aborts the request after the given timeout, causing the fetch call to
    // reject with an `AbortError`.
    //
    // <p>Aborting after the request completes is a no-op, so we don't need a
    // corresponding `clearTimeout`.
    //
    // Locating abort logic here because:
    // * it uses a developer setting (timeout)
    // * it applies to all retries (like curl's max-time arg)
    // * it is consistent with the Fetch API's signal input
    const abortSignal = new RemoteConfigAbortSignal();
    setTimeout(async () => {
        // Note a very low delay, eg < 10ms, can elapse before listeners are initialized.
        abortSignal.abort();
    }, rc.settings.fetchTimeoutMillis);
    const customSignals = rc._storageCache.getCustomSignals();
    if (customSignals) {
        rc._logger.debug(`Fetching config with custom signals: ${JSON.stringify(customSignals)}`);
    }
    // Catches *all* errors thrown by client so status can be set consistently.
    try {
        await rc._client.fetch({
            cacheMaxAgeMillis: rc.settings.minimumFetchIntervalMillis,
            signal: abortSignal,
            customSignals
        });
        await rc._storageCache.setLastFetchStatus('success');
    }
    catch (e) {
        const lastFetchStatus = hasErrorCode(e, "fetch-throttle" /* ErrorCode.FETCH_THROTTLE */)
            ? 'throttle'
            : 'failure';
        await rc._storageCache.setLastFetchStatus(lastFetchStatus);
        throw e;
    }
}
/**
 * Gets all config.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @returns All config.
 *
 * @public
 */
function getAll(remoteConfig) {
    const rc = getModularInstance(remoteConfig);
    return getAllKeys(rc._storageCache.getActiveConfig(), rc.defaultConfig).reduce((allConfigs, key) => {
        allConfigs[key] = getValue(remoteConfig, key);
        return allConfigs;
    }, {});
}
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
function getBoolean(remoteConfig, key) {
    return getValue(getModularInstance(remoteConfig), key).asBoolean();
}
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
function getNumber(remoteConfig, key) {
    return getValue(getModularInstance(remoteConfig), key).asNumber();
}
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
function getString(remoteConfig, key) {
    return getValue(getModularInstance(remoteConfig), key).asString();
}
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
function getValue(remoteConfig, key) {
    const rc = getModularInstance(remoteConfig);
    if (!rc._isInitializationComplete) {
        rc._logger.debug(`A value was requested for key "${key}" before SDK initialization completed.` +
            ' Await on ensureInitialized if the intent was to get a previously activated value.');
    }
    const activeConfig = rc._storageCache.getActiveConfig();
    if (activeConfig && activeConfig[key] !== undefined) {
        return new Value('remote', activeConfig[key]);
    }
    else if (rc.defaultConfig && rc.defaultConfig[key] !== undefined) {
        return new Value('default', String(rc.defaultConfig[key]));
    }
    rc._logger.debug(`Returning static value for key "${key}".` +
        ' Define a default or remote value if this is unintentional.');
    return new Value('static');
}
/**
 * Defines the log level to use.
 *
 * @param remoteConfig - The {@link RemoteConfig} instance.
 * @param logLevel - The log level to set.
 *
 * @public
 */
function setLogLevel(remoteConfig, logLevel) {
    const rc = getModularInstance(remoteConfig);
    switch (logLevel) {
        case 'debug':
            rc._logger.logLevel = LogLevel.DEBUG;
            break;
        case 'silent':
            rc._logger.logLevel = LogLevel.SILENT;
            break;
        default:
            rc._logger.logLevel = LogLevel.ERROR;
    }
}
/**
 * Dedupes and returns an array of all the keys of the received objects.
 */
function getAllKeys(obj1 = {}, obj2 = {}) {
    return Object.keys({ ...obj1, ...obj2 });
}
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
async function setCustomSignals(remoteConfig, customSignals) {
    const rc = getModularInstance(remoteConfig);
    if (Object.keys(customSignals).length === 0) {
        return;
    }
    // eslint-disable-next-line guard-for-in
    for (const key in customSignals) {
        if (key.length > RC_CUSTOM_SIGNAL_KEY_MAX_LENGTH) {
            rc._logger.error(`Custom signal key ${key} is too long, max allowed length is ${RC_CUSTOM_SIGNAL_KEY_MAX_LENGTH}.`);
            return;
        }
        const value = customSignals[key];
        if (typeof value === 'string' &&
            value.length > RC_CUSTOM_SIGNAL_VALUE_MAX_LENGTH) {
            rc._logger.error(`Value supplied for custom signal ${key} is too long, max allowed length is ${RC_CUSTOM_SIGNAL_VALUE_MAX_LENGTH}.`);
            return;
        }
    }
    try {
        await rc._storageCache.setCustomSignals(customSignals);
    }
    catch (error) {
        rc._logger.error(`Error encountered while setting custom signals: ${error}`);
    }
}
// TODO: Add public document for the Remote Config Realtime API guide on the Web Platform.
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
function onConfigUpdate(remoteConfig, observer) {
    const rc = getModularInstance(remoteConfig);
    rc._realtimeHandler.addObserver(observer);
    return () => {
        rc._realtimeHandler.removeObserver(observer);
    };
}

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
/**
 * Implements the {@link RemoteConfigClient} abstraction with success response caching.
 *
 * <p>Comparable to the browser's Cache API for responses, but the Cache API requires a Service
 * Worker, which requires HTTPS, which would significantly complicate SDK installation. Also, the
 * Cache API doesn't support matching entries by time.
 */
class CachingClient {
    constructor(client, storage, storageCache, logger) {
        this.client = client;
        this.storage = storage;
        this.storageCache = storageCache;
        this.logger = logger;
    }
    /**
     * Returns true if the age of the cached fetched configs is less than or equal to
     * {@link Settings#minimumFetchIntervalInSeconds}.
     *
     * <p>This is comparable to passing `headers = { 'Cache-Control': max-age <maxAge> }` to the
     * native Fetch API.
     *
     * <p>Visible for testing.
     */
    isCachedDataFresh(cacheMaxAgeMillis, lastSuccessfulFetchTimestampMillis) {
        // Cache can only be fresh if it's populated.
        if (!lastSuccessfulFetchTimestampMillis) {
            this.logger.debug('Config fetch cache check. Cache unpopulated.');
            return false;
        }
        // Calculates age of cache entry.
        const cacheAgeMillis = Date.now() - lastSuccessfulFetchTimestampMillis;
        const isCachedDataFresh = cacheAgeMillis <= cacheMaxAgeMillis;
        this.logger.debug('Config fetch cache check.' +
            ` Cache age millis: ${cacheAgeMillis}.` +
            ` Cache max age millis (minimumFetchIntervalMillis setting): ${cacheMaxAgeMillis}.` +
            ` Is cache hit: ${isCachedDataFresh}.`);
        return isCachedDataFresh;
    }
    async fetch(request) {
        // Reads from persisted storage to avoid cache miss if callers don't wait on initialization.
        const [lastSuccessfulFetchTimestampMillis, lastSuccessfulFetchResponse] = await Promise.all([
            this.storage.getLastSuccessfulFetchTimestampMillis(),
            this.storage.getLastSuccessfulFetchResponse()
        ]);
        // Exits early on cache hit.
        if (lastSuccessfulFetchResponse &&
            this.isCachedDataFresh(request.cacheMaxAgeMillis, lastSuccessfulFetchTimestampMillis)) {
            return lastSuccessfulFetchResponse;
        }
        // Deviates from pure decorator by not honoring a passed ETag since we don't have a public API
        // that allows the caller to pass an ETag.
        request.eTag =
            lastSuccessfulFetchResponse && lastSuccessfulFetchResponse.eTag;
        // Falls back to service on cache miss.
        const response = await this.client.fetch(request);
        // Fetch throws for non-success responses, so success is guaranteed here.
        const storageOperations = [
            // Uses write-through cache for consistency with synchronous public API.
            this.storageCache.setLastSuccessfulFetchTimestampMillis(Date.now())
        ];
        if (response.status === 200) {
            // Caches response only if it has changed, ie non-304 responses.
            storageOperations.push(this.storage.setLastSuccessfulFetchResponse(response));
        }
        await Promise.all(storageOperations);
        return response;
    }
}

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
/**
 * Attempts to get the most accurate browser language setting.
 *
 * <p>Adapted from getUserLanguage in packages/auth/src/utils.js for TypeScript.
 *
 * <p>Defers default language specification to server logic for consistency.
 *
 * @param navigatorLanguage Enables tests to override read-only {@link NavigatorLanguage}.
 */
function getUserLanguage(navigatorLanguage = navigator) {
    return (
    // Most reliable, but only supported in Chrome/Firefox.
    (navigatorLanguage.languages && navigatorLanguage.languages[0]) ||
        // Supported in most browsers, but returns the language of the browser
        // UI, not the language set in browser settings.
        navigatorLanguage.language
    // Polyfill otherwise.
    );
}

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
/**
 * Implements the Client abstraction for the Remote Config REST API.
 */
class RestClient {
    constructor(firebaseInstallations, sdkVersion, namespace, projectId, apiKey, appId) {
        this.firebaseInstallations = firebaseInstallations;
        this.sdkVersion = sdkVersion;
        this.namespace = namespace;
        this.projectId = projectId;
        this.apiKey = apiKey;
        this.appId = appId;
    }
    /**
     * Fetches from the Remote Config REST API.
     *
     * @throws a {@link ErrorCode.FETCH_NETWORK} error if {@link GlobalFetch#fetch} can't
     * connect to the network.
     * @throws a {@link ErrorCode.FETCH_PARSE} error if {@link Response#json} can't parse the
     * fetch response.
     * @throws a {@link ErrorCode.FETCH_STATUS} error if the service returns an HTTP error status.
     */
    async fetch(request) {
        const [installationId, installationToken] = await Promise.all([
            this.firebaseInstallations.getId(),
            this.firebaseInstallations.getToken()
        ]);
        const urlBase = window.FIREBASE_REMOTE_CONFIG_URL_BASE ||
            'https://firebaseremoteconfig.googleapis.com';
        const url = `${urlBase}/v1/projects/${this.projectId}/namespaces/${this.namespace}:fetch?key=${this.apiKey}`;
        const headers = {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip',
            // Deviates from pure decorator by not passing max-age header since we don't currently have
            // service behavior using that header.
            'If-None-Match': request.eTag || '*'
            // TODO: Add this header once CORS error is fixed internally.
            //'X-Firebase-RC-Fetch-Type': `${fetchType}/${fetchAttempt}`
        };
        const requestBody = {
            /* eslint-disable camelcase */
            sdk_version: this.sdkVersion,
            app_instance_id: installationId,
            app_instance_id_token: installationToken,
            app_id: this.appId,
            language_code: getUserLanguage(),
            custom_signals: request.customSignals
            /* eslint-enable camelcase */
        };
        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
        };
        // This logic isn't REST-specific, but shimming abort logic isn't worth another decorator.
        const fetchPromise = fetch(url, options);
        const timeoutPromise = new Promise((_resolve, reject) => {
            // Maps async event listener to Promise API.
            request.signal.addEventListener(() => {
                // Emulates https://heycam.github.io/webidl/#aborterror
                const error = new Error('The operation was aborted.');
                error.name = 'AbortError';
                reject(error);
            });
        });
        let response;
        try {
            await Promise.race([fetchPromise, timeoutPromise]);
            response = await fetchPromise;
        }
        catch (originalError) {
            let errorCode = "fetch-client-network" /* ErrorCode.FETCH_NETWORK */;
            if (originalError?.name === 'AbortError') {
                errorCode = "fetch-timeout" /* ErrorCode.FETCH_TIMEOUT */;
            }
            throw ERROR_FACTORY.create(errorCode, {
                originalErrorMessage: originalError?.message
            });
        }
        let status = response.status;
        // Normalizes nullable header to optional.
        const responseEtag = response.headers.get('ETag') || undefined;
        let config;
        let state;
        let templateVersion;
        let experiments;
        // JSON parsing throws SyntaxError if the response body isn't a JSON string.
        // Requesting application/json and checking for a 200 ensures there's JSON data.
        if (response.status === 200) {
            let responseBody;
            try {
                responseBody = await response.json();
            }
            catch (originalError) {
                throw ERROR_FACTORY.create("fetch-client-parse" /* ErrorCode.FETCH_PARSE */, {
                    originalErrorMessage: originalError?.message
                });
            }
            config = responseBody['entries'];
            state = responseBody['state'];
            templateVersion = responseBody['templateVersion'];
            experiments = responseBody['experimentDescriptions'];
        }
        // Normalizes based on legacy state.
        if (state === 'INSTANCE_STATE_UNSPECIFIED') {
            status = 500;
        }
        else if (state === 'NO_CHANGE') {
            status = 304;
        }
        else if (state === 'NO_TEMPLATE' || state === 'EMPTY_CONFIG') {
            // These cases can be fixed remotely, so normalize to safe value.
            config = {};
            experiments = [];
        }
        // Normalize to exception-based control flow for non-success cases.
        // Encapsulates HTTP specifics in this class as much as possible. Status is still the best for
        // differentiating success states (200 from 304; the state body param is undefined in a
        // standard 304).
        if (status !== 304 && status !== 200) {
            throw ERROR_FACTORY.create("fetch-status" /* ErrorCode.FETCH_STATUS */, {
                httpStatus: status
            });
        }
        return { status, eTag: responseEtag, config, templateVersion, experiments };
    }
}

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
/**
 * Supports waiting on a backoff by:
 *
 * <ul>
 *   <li>Promisifying setTimeout, so we can set a timeout in our Promise chain</li>
 *   <li>Listening on a signal bus for abort events, just like the Fetch API</li>
 *   <li>Failing in the same way the Fetch API fails, so timing out a live request and a throttled
 *       request appear the same.</li>
 * </ul>
 *
 * <p>Visible for testing.
 */
function setAbortableTimeout(signal, throttleEndTimeMillis) {
    return new Promise((resolve, reject) => {
        // Derives backoff from given end time, normalizing negative numbers to zero.
        const backoffMillis = Math.max(throttleEndTimeMillis - Date.now(), 0);
        const timeout = setTimeout(resolve, backoffMillis);
        // Adds listener, rather than sets onabort, because signal is a shared object.
        signal.addEventListener(() => {
            clearTimeout(timeout);
            // If the request completes before this timeout, the rejection has no effect.
            reject(ERROR_FACTORY.create("fetch-throttle" /* ErrorCode.FETCH_THROTTLE */, {
                throttleEndTimeMillis
            }));
        });
    });
}
/**
 * Returns true if the {@link Error} indicates a fetch request may succeed later.
 */
function isRetriableError(e) {
    if (!(e instanceof FirebaseError) || !e.customData) {
        return false;
    }
    // Uses string index defined by ErrorData, which FirebaseError implements.
    const httpStatus = Number(e.customData['httpStatus']);
    return (httpStatus === 429 ||
        httpStatus === 500 ||
        httpStatus === 503 ||
        httpStatus === 504);
}
/**
 * Decorates a Client with retry logic.
 *
 * <p>Comparable to CachingClient, but uses backoff logic instead of cache max age and doesn't cache
 * responses (because the SDK has no use for error responses).
 */
class RetryingClient {
    constructor(client, storage) {
        this.client = client;
        this.storage = storage;
    }
    async fetch(request) {
        const throttleMetadata = (await this.storage.getThrottleMetadata()) || {
            backoffCount: 0,
            throttleEndTimeMillis: Date.now()
        };
        return this.attemptFetch(request, throttleMetadata);
    }
    /**
     * A recursive helper for attempting a fetch request repeatedly.
     *
     * @throws any non-retriable errors.
     */
    async attemptFetch(request, { throttleEndTimeMillis, backoffCount }) {
        // Starts with a (potentially zero) timeout to support resumption from stored state.
        // Ensures the throttle end time is honored if the last attempt timed out.
        // Note the SDK will never make a request if the fetch timeout expires at this point.
        await setAbortableTimeout(request.signal, throttleEndTimeMillis);
        try {
            const response = await this.client.fetch(request);
            // Note the SDK only clears throttle state if response is success or non-retriable.
            await this.storage.deleteThrottleMetadata();
            return response;
        }
        catch (e) {
            if (!isRetriableError(e)) {
                throw e;
            }
            // Increments backoff state.
            const throttleMetadata = {
                throttleEndTimeMillis: Date.now() + calculateBackoffMillis(backoffCount),
                backoffCount: backoffCount + 1
            };
            // Persists state.
            await this.storage.setThrottleMetadata(throttleMetadata);
            return this.attemptFetch(request, throttleMetadata);
        }
    }
}

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
const DEFAULT_FETCH_TIMEOUT_MILLIS = 60 * 1000; // One minute
const DEFAULT_CACHE_MAX_AGE_MILLIS = 12 * 60 * 60 * 1000; // Twelve hours.
/**
 * Encapsulates business logic mapping network and storage dependencies to the public SDK API.
 *
 * See {@link https://github.com/firebase/firebase-js-sdk/blob/main/packages/firebase/compat/index.d.ts|interface documentation} for method descriptions.
 */
class RemoteConfig {
    get fetchTimeMillis() {
        return this._storageCache.getLastSuccessfulFetchTimestampMillis() || -1;
    }
    get lastFetchStatus() {
        return this._storageCache.getLastFetchStatus() || 'no-fetch-yet';
    }
    constructor(
    // Required by FirebaseServiceFactory interface.
    app, 
    // JS doesn't support private yet
    // (https://github.com/tc39/proposal-class-fields#private-fields), so we hint using an
    // underscore prefix.
    /**
     * @internal
     */
    _client, 
    /**
     * @internal
     */
    _storageCache, 
    /**
     * @internal
     */
    _storage, 
    /**
     * @internal
     */
    _logger, 
    /**
     * @internal
     */
    _realtimeHandler, 
    /**
     * @internal
     */
    _analyticsProvider) {
        this.app = app;
        this._client = _client;
        this._storageCache = _storageCache;
        this._storage = _storage;
        this._logger = _logger;
        this._realtimeHandler = _realtimeHandler;
        this._analyticsProvider = _analyticsProvider;
        /**
         * Tracks completion of initialization promise.
         * @internal
         */
        this._isInitializationComplete = false;
        this.settings = {
            fetchTimeoutMillis: DEFAULT_FETCH_TIMEOUT_MILLIS,
            minimumFetchIntervalMillis: DEFAULT_CACHE_MAX_AGE_MILLIS
        };
        this.defaultConfig = {};
    }
}

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
/**
 * Converts an error event associated with a {@link IDBRequest} to a {@link FirebaseError}.
 */
function toFirebaseError(event, errorCode) {
    const originalError = event.target.error || undefined;
    return ERROR_FACTORY.create(errorCode, {
        originalErrorMessage: originalError && originalError?.message
    });
}
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
const APP_NAMESPACE_STORE = 'app_namespace_store';
const DB_NAME = 'firebase_remote_config';
const DB_VERSION = 1;
// Visible for testing.
function openDatabase() {
    return new Promise((resolve, reject) => {
        try {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = event => {
                reject(toFirebaseError(event, "storage-open" /* ErrorCode.STORAGE_OPEN */));
            };
            request.onsuccess = event => {
                resolve(event.target.result);
            };
            request.onupgradeneeded = event => {
                const db = event.target.result;
                // We don't use 'break' in this switch statement, the fall-through
                // behavior is what we want, because if there are multiple versions between
                // the old version and the current version, we want ALL the migrations
                // that correspond to those versions to run, not only the last one.
                // eslint-disable-next-line default-case
                switch (event.oldVersion) {
                    case 0:
                        db.createObjectStore(APP_NAMESPACE_STORE, {
                            keyPath: 'compositeKey'
                        });
                }
            };
        }
        catch (error) {
            reject(ERROR_FACTORY.create("storage-open" /* ErrorCode.STORAGE_OPEN */, {
                originalErrorMessage: error?.message
            }));
        }
    });
}
/**
 * Abstracts data persistence.
 */
class Storage {
    getLastFetchStatus() {
        return this.get('last_fetch_status');
    }
    setLastFetchStatus(status) {
        return this.set('last_fetch_status', status);
    }
    // This is comparable to a cache entry timestamp. If we need to expire other data, we could
    // consider adding timestamp to all storage records and an optional max age arg to getters.
    getLastSuccessfulFetchTimestampMillis() {
        return this.get('last_successful_fetch_timestamp_millis');
    }
    setLastSuccessfulFetchTimestampMillis(timestamp) {
        return this.set('last_successful_fetch_timestamp_millis', timestamp);
    }
    getLastSuccessfulFetchResponse() {
        return this.get('last_successful_fetch_response');
    }
    setLastSuccessfulFetchResponse(response) {
        return this.set('last_successful_fetch_response', response);
    }
    getActiveConfig() {
        return this.get('active_config');
    }
    setActiveConfig(config) {
        return this.set('active_config', config);
    }
    getActiveConfigEtag() {
        return this.get('active_config_etag');
    }
    setActiveConfigEtag(etag) {
        return this.set('active_config_etag', etag);
    }
    getActiveExperiments() {
        return this.get('active_experiments');
    }
    setActiveExperiments(experiments) {
        return this.set('active_experiments', experiments);
    }
    getThrottleMetadata() {
        return this.get('throttle_metadata');
    }
    setThrottleMetadata(metadata) {
        return this.set('throttle_metadata', metadata);
    }
    deleteThrottleMetadata() {
        return this.delete('throttle_metadata');
    }
    getCustomSignals() {
        return this.get('custom_signals');
    }
    getRealtimeBackoffMetadata() {
        return this.get('realtime_backoff_metadata');
    }
    setRealtimeBackoffMetadata(realtimeMetadata) {
        return this.set('realtime_backoff_metadata', realtimeMetadata);
    }
    getActiveConfigTemplateVersion() {
        return this.get('last_known_template_version');
    }
    setActiveConfigTemplateVersion(version) {
        return this.set('last_known_template_version', version);
    }
}
class IndexedDbStorage extends Storage {
    /**
     * @param appId enables storage segmentation by app (ID + name).
     * @param appName enables storage segmentation by app (ID + name).
     * @param namespace enables storage segmentation by namespace.
     */
    constructor(appId, appName, namespace, openDbPromise = openDatabase()) {
        super();
        this.appId = appId;
        this.appName = appName;
        this.namespace = namespace;
        this.openDbPromise = openDbPromise;
    }
    async setCustomSignals(customSignals) {
        const db = await this.openDbPromise;
        const transaction = db.transaction([APP_NAMESPACE_STORE], 'readwrite');
        const storedSignals = await this.getWithTransaction('custom_signals', transaction);
        const updatedSignals = mergeCustomSignals(customSignals, storedSignals || {});
        await this.setWithTransaction('custom_signals', updatedSignals, transaction);
        return updatedSignals;
    }
    /**
     * Gets a value from the database using the provided transaction.
     *
     * @param key The key of the value to get.
     * @param transaction The transaction to use for the operation.
     * @returns The value associated with the key, or undefined if no such value exists.
     */
    async getWithTransaction(key, transaction) {
        return new Promise((resolve, reject) => {
            const objectStore = transaction.objectStore(APP_NAMESPACE_STORE);
            const compositeKey = this.createCompositeKey(key);
            try {
                const request = objectStore.get(compositeKey);
                request.onerror = event => {
                    reject(toFirebaseError(event, "storage-get" /* ErrorCode.STORAGE_GET */));
                };
                request.onsuccess = event => {
                    const result = event.target.result;
                    if (result) {
                        resolve(result.value);
                    }
                    else {
                        resolve(undefined);
                    }
                };
            }
            catch (e) {
                reject(ERROR_FACTORY.create("storage-get" /* ErrorCode.STORAGE_GET */, {
                    originalErrorMessage: e?.message
                }));
            }
        });
    }
    /**
     * Sets a value in the database using the provided transaction.
     *
     * @param key The key of the value to set.
     * @param value The value to set.
     * @param transaction The transaction to use for the operation.
     * @returns A promise that resolves when the operation is complete.
     */
    async setWithTransaction(key, value, transaction) {
        return new Promise((resolve, reject) => {
            const objectStore = transaction.objectStore(APP_NAMESPACE_STORE);
            const compositeKey = this.createCompositeKey(key);
            try {
                const request = objectStore.put({
                    compositeKey,
                    value
                });
                request.onerror = (event) => {
                    reject(toFirebaseError(event, "storage-set" /* ErrorCode.STORAGE_SET */));
                };
                request.onsuccess = () => {
                    resolve();
                };
            }
            catch (e) {
                reject(ERROR_FACTORY.create("storage-set" /* ErrorCode.STORAGE_SET */, {
                    originalErrorMessage: e?.message
                }));
            }
        });
    }
    async get(key) {
        const db = await this.openDbPromise;
        const transaction = db.transaction([APP_NAMESPACE_STORE], 'readonly');
        return this.getWithTransaction(key, transaction);
    }
    async set(key, value) {
        const db = await this.openDbPromise;
        const transaction = db.transaction([APP_NAMESPACE_STORE], 'readwrite');
        return this.setWithTransaction(key, value, transaction);
    }
    async delete(key) {
        const db = await this.openDbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([APP_NAMESPACE_STORE], 'readwrite');
            const objectStore = transaction.objectStore(APP_NAMESPACE_STORE);
            const compositeKey = this.createCompositeKey(key);
            try {
                const request = objectStore.delete(compositeKey);
                request.onerror = (event) => {
                    reject(toFirebaseError(event, "storage-delete" /* ErrorCode.STORAGE_DELETE */));
                };
                request.onsuccess = () => {
                    resolve();
                };
            }
            catch (e) {
                reject(ERROR_FACTORY.create("storage-delete" /* ErrorCode.STORAGE_DELETE */, {
                    originalErrorMessage: e?.message
                }));
            }
        });
    }
    // Facilitates composite key functionality (which is unsupported in IE).
    createCompositeKey(key) {
        return [this.appId, this.appName, this.namespace, key].join();
    }
}
class InMemoryStorage extends Storage {
    constructor() {
        super(...arguments);
        this.storage = {};
    }
    async get(key) {
        return Promise.resolve(this.storage[key]);
    }
    async set(key, value) {
        this.storage[key] = value;
        return Promise.resolve(undefined);
    }
    async delete(key) {
        this.storage[key] = undefined;
        return Promise.resolve();
    }
    async setCustomSignals(customSignals) {
        const storedSignals = (this.storage['custom_signals'] ||
            {});
        this.storage['custom_signals'] = mergeCustomSignals(customSignals, storedSignals);
        return Promise.resolve(this.storage['custom_signals']);
    }
}
function mergeCustomSignals(customSignals, storedSignals) {
    const combinedSignals = {
        ...storedSignals,
        ...customSignals
    };
    // Filter out key-value assignments with null values since they are signals being unset
    const updatedSignals = Object.fromEntries(Object.entries(combinedSignals)
        .filter(([_, v]) => v !== null)
        .map(([k, v]) => {
        // Stringify numbers to store a map of string keys and values which can be sent
        // as-is in a fetch call.
        if (typeof v === 'number') {
            return [k, v.toString()];
        }
        return [k, v];
    }));
    // Throw an error if the number of custom signals to be stored exceeds the limit
    if (Object.keys(updatedSignals).length > RC_CUSTOM_SIGNAL_MAX_ALLOWED_SIGNALS) {
        throw ERROR_FACTORY.create("custom-signal-max-allowed-signals" /* ErrorCode.CUSTOM_SIGNAL_MAX_ALLOWED_SIGNALS */, {
            maxSignals: RC_CUSTOM_SIGNAL_MAX_ALLOWED_SIGNALS
        });
    }
    return updatedSignals;
}

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
/**
 * A memory cache layer over storage to support the SDK's synchronous read requirements.
 */
class StorageCache {
    constructor(storage) {
        this.storage = storage;
    }
    /**
     * Memory-only getters
     */
    getLastFetchStatus() {
        return this.lastFetchStatus;
    }
    getLastSuccessfulFetchTimestampMillis() {
        return this.lastSuccessfulFetchTimestampMillis;
    }
    getActiveConfig() {
        return this.activeConfig;
    }
    getCustomSignals() {
        return this.customSignals;
    }
    /**
     * Read-ahead getter
     */
    async loadFromStorage() {
        const lastFetchStatusPromise = this.storage.getLastFetchStatus();
        const lastSuccessfulFetchTimestampMillisPromise = this.storage.getLastSuccessfulFetchTimestampMillis();
        const activeConfigPromise = this.storage.getActiveConfig();
        const customSignalsPromise = this.storage.getCustomSignals();
        // Note:
        // 1. we consistently check for undefined to avoid clobbering defined values
        //   in memory
        // 2. we defer awaiting to improve readability, as opposed to destructuring
        //   a Promise.all result, for example
        const lastFetchStatus = await lastFetchStatusPromise;
        if (lastFetchStatus) {
            this.lastFetchStatus = lastFetchStatus;
        }
        const lastSuccessfulFetchTimestampMillis = await lastSuccessfulFetchTimestampMillisPromise;
        if (lastSuccessfulFetchTimestampMillis) {
            this.lastSuccessfulFetchTimestampMillis =
                lastSuccessfulFetchTimestampMillis;
        }
        const activeConfig = await activeConfigPromise;
        if (activeConfig) {
            this.activeConfig = activeConfig;
        }
        const customSignals = await customSignalsPromise;
        if (customSignals) {
            this.customSignals = customSignals;
        }
    }
    /**
     * Write-through setters
     */
    setLastFetchStatus(status) {
        this.lastFetchStatus = status;
        return this.storage.setLastFetchStatus(status);
    }
    setLastSuccessfulFetchTimestampMillis(timestampMillis) {
        this.lastSuccessfulFetchTimestampMillis = timestampMillis;
        return this.storage.setLastSuccessfulFetchTimestampMillis(timestampMillis);
    }
    setActiveConfig(activeConfig) {
        this.activeConfig = activeConfig;
        return this.storage.setActiveConfig(activeConfig);
    }
    async setCustomSignals(customSignals) {
        this.customSignals = await this.storage.setCustomSignals(customSignals);
    }
}

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
// TODO: Consolidate the Visibility monitoring API code into a shared utility function in firebase/util to be used by both packages/database and packages/remote-config.
/**
 * Base class to be used if you want to emit events. Call the constructor with
 * the set of allowed event names.
 */
class EventEmitter {
    constructor(allowedEvents_) {
        this.allowedEvents_ = allowedEvents_;
        this.listeners_ = {};
        assert(Array.isArray(allowedEvents_) && allowedEvents_.length > 0, 'Requires a non-empty array');
    }
    /**
     * To be called by derived classes to trigger events.
     */
    trigger(eventType, ...varArgs) {
        if (Array.isArray(this.listeners_[eventType])) {
            // Clone the list, since callbacks could add/remove listeners.
            const listeners = [...this.listeners_[eventType]];
            for (let i = 0; i < listeners.length; i++) {
                listeners[i].callback.apply(listeners[i].context, varArgs);
            }
        }
    }
    on(eventType, callback, context) {
        this.validateEventType_(eventType);
        this.listeners_[eventType] = this.listeners_[eventType] || [];
        this.listeners_[eventType].push({ callback, context });
        const eventData = this.getInitialEvent(eventType);
        if (eventData) {
            //@ts-ignore
            callback.apply(context, eventData);
        }
    }
    off(eventType, callback, context) {
        this.validateEventType_(eventType);
        const listeners = this.listeners_[eventType] || [];
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i].callback === callback &&
                (!context || context === listeners[i].context)) {
                listeners.splice(i, 1);
                return;
            }
        }
    }
    validateEventType_(eventType) {
        assert(this.allowedEvents_.find(et => {
            return et === eventType;
        }), 'Unknown event: ' + eventType);
    }
}

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
// TODO: Consolidate the Visibility monitoring API code into a shared utility function in firebase/util to be used by both packages/database and packages/remote-config.
class VisibilityMonitor extends EventEmitter {
    static getInstance() {
        return new VisibilityMonitor();
    }
    constructor() {
        super(['visible']);
        let hidden;
        let visibilityChange;
        if (typeof document !== 'undefined' &&
            typeof document.addEventListener !== 'undefined') {
            if (typeof document['hidden'] !== 'undefined') {
                // Opera 12.10 and Firefox 18 and later support
                visibilityChange = 'visibilitychange';
                hidden = 'hidden';
            } // @ts-ignore
            else if (typeof document['mozHidden'] !== 'undefined') {
                visibilityChange = 'mozvisibilitychange';
                hidden = 'mozHidden';
            } // @ts-ignore
            else if (typeof document['msHidden'] !== 'undefined') {
                visibilityChange = 'msvisibilitychange';
                hidden = 'msHidden';
            } // @ts-ignore
            else if (typeof document['webkitHidden'] !== 'undefined') {
                visibilityChange = 'webkitvisibilitychange';
                hidden = 'webkitHidden';
            }
        }
        // Initially, we always assume we are visible. This ensures that in browsers
        // without page visibility support or in cases where we are never visible
        // (e.g. chrome extension), we act as if we are visible, i.e. don't delay
        // reconnects
        this.visible_ = true;
        // @ts-ignore
        if (visibilityChange) {
            document.addEventListener(visibilityChange, () => {
                // @ts-ignore
                const visible = !document[hidden];
                if (visible !== this.visible_) {
                    this.visible_ = visible;
                    this.trigger('visible', visible);
                }
            }, false);
        }
    }
    getInitialEvent(eventType) {
        assert(eventType === 'visible', 'Unknown event type: ' + eventType);
        return [this.visible_];
    }
}

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
const API_KEY_HEADER = 'X-Goog-Api-Key';
const INSTALLATIONS_AUTH_TOKEN_HEADER = 'X-Goog-Firebase-Installations-Auth';
const ORIGINAL_RETRIES = 8;
const MAXIMUM_FETCH_ATTEMPTS = 3;
const NO_BACKOFF_TIME_IN_MILLIS = -1;
const NO_FAILED_REALTIME_STREAMS = 0;
const REALTIME_DISABLED_KEY = 'featureDisabled';
const REALTIME_RETRY_INTERVAL = 'retryIntervalSeconds';
const TEMPLATE_VERSION_KEY = 'latestTemplateVersionNumber';
class RealtimeHandler {
    constructor(firebaseInstallations, storage, sdkVersion, namespace, projectId, apiKey, appId, logger, storageCache, cachingClient) {
        this.firebaseInstallations = firebaseInstallations;
        this.storage = storage;
        this.sdkVersion = sdkVersion;
        this.namespace = namespace;
        this.projectId = projectId;
        this.apiKey = apiKey;
        this.appId = appId;
        this.logger = logger;
        this.storageCache = storageCache;
        this.cachingClient = cachingClient;
        this.observers = new Set();
        this.isConnectionActive = false;
        this.isRealtimeDisabled = false;
        this.httpRetriesRemaining = ORIGINAL_RETRIES;
        this.isInBackground = false;
        this.decoder = new TextDecoder('utf-8');
        this.isClosingConnection = false;
        this.propagateError = (e) => this.observers.forEach(o => o.error?.(e));
        /**
         * HTTP status code that the Realtime client should retry on.
         */
        this.isStatusCodeRetryable = (statusCode) => {
            const retryableStatusCodes = [
                408, // Request Timeout
                429, // Too Many Requests
                502, // Bad Gateway
                503, // Service Unavailable
                504 // Gateway Timeout
            ];
            return !statusCode || retryableStatusCodes.includes(statusCode);
        };
        void this.setRetriesRemaining();
        void VisibilityMonitor.getInstance().on('visible', this.onVisibilityChange, this);
    }
    async setRetriesRemaining() {
        // Retrieve number of remaining retries from last session. The minimum retry count being one.
        const metadata = await this.storage.getRealtimeBackoffMetadata();
        const numFailedStreams = metadata?.numFailedStreams || 0;
        this.httpRetriesRemaining = Math.max(ORIGINAL_RETRIES - numFailedStreams, 1);
    }
    /**
     * Increment the number of failed stream attempts, increase the backoff duration, set the backoff
     * end time to "backoff duration" after `lastFailedStreamTime` and persist the new
     * values to storage metadata.
     */
    async updateBackoffMetadataWithLastFailedStreamConnectionTime(lastFailedStreamTime) {
        const numFailedStreams = ((await this.storage.getRealtimeBackoffMetadata())?.numFailedStreams ||
            0) + 1;
        const backoffMillis = calculateBackoffMillis(numFailedStreams, 60000, 2);
        await this.storage.setRealtimeBackoffMetadata({
            backoffEndTimeMillis: new Date(lastFailedStreamTime.getTime() + backoffMillis),
            numFailedStreams
        });
    }
    /**
     * Increase the backoff duration with a new end time based on Retry Interval.
     */
    async updateBackoffMetadataWithRetryInterval(retryIntervalSeconds) {
        const currentTime = Date.now();
        const backoffDurationInMillis = retryIntervalSeconds * 1000;
        const backoffEndTime = new Date(currentTime + backoffDurationInMillis);
        const numFailedStreams = 0;
        await this.storage.setRealtimeBackoffMetadata({
            backoffEndTimeMillis: backoffEndTime,
            numFailedStreams
        });
        await this.retryHttpConnectionWhenBackoffEnds();
    }
    /**
     * Closes the realtime HTTP connection.
     * Note: This method is designed to be called only once at a time.
     * If a call is already in progress, subsequent calls will be ignored.
     */
    async closeRealtimeHttpConnection() {
        if (this.isClosingConnection) {
            return;
        }
        this.isClosingConnection = true;
        try {
            if (this.reader) {
                await this.reader.cancel();
            }
        }
        catch (e) {
            // The network connection was lost, so cancel() failed.
            // This is expected in a disconnected state, so we can safely ignore the error.
            this.logger.debug('Failed to cancel the reader, connection was lost.');
        }
        finally {
            this.reader = undefined;
        }
        if (this.controller) {
            await this.controller.abort();
            this.controller = undefined;
        }
        this.isClosingConnection = false;
    }
    async resetRealtimeBackoff() {
        await this.storage.setRealtimeBackoffMetadata({
            backoffEndTimeMillis: new Date(-1),
            numFailedStreams: 0
        });
    }
    resetRetryCount() {
        this.httpRetriesRemaining = ORIGINAL_RETRIES;
    }
    /**
     * Assembles the request headers and body and executes the fetch request to
     * establish the real-time streaming connection. This is the "worker" method
     * that performs the actual network communication.
     */
    async establishRealtimeConnection(url, installationId, installationTokenResult, signal) {
        const eTagValue = await this.storage.getActiveConfigEtag();
        const lastKnownVersionNumber = await this.storage.getActiveConfigTemplateVersion();
        const headers = {
            [API_KEY_HEADER]: this.apiKey,
            [INSTALLATIONS_AUTH_TOKEN_HEADER]: installationTokenResult,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'If-None-Match': eTagValue || '*',
            'Content-Encoding': 'gzip'
        };
        const requestBody = {
            project: this.projectId,
            namespace: this.namespace,
            lastKnownVersionNumber,
            appId: this.appId,
            sdkVersion: this.sdkVersion,
            appInstanceId: installationId
        };
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
            signal
        });
        return response;
    }
    getRealtimeUrl() {
        const urlBase = window.FIREBASE_REMOTE_CONFIG_URL_BASE ||
            'https://firebaseremoteconfigrealtime.googleapis.com';
        const urlString = `${urlBase}/v1/projects/${this.projectId}/namespaces/${this.namespace}:streamFetchInvalidations?key=${this.apiKey}`;
        return new URL(urlString);
    }
    async createRealtimeConnection() {
        const [installationId, installationTokenResult] = await Promise.all([
            this.firebaseInstallations.getId(),
            this.firebaseInstallations.getToken(false)
        ]);
        this.controller = new AbortController();
        const url = this.getRealtimeUrl();
        const realtimeConnection = await this.establishRealtimeConnection(url, installationId, installationTokenResult, this.controller.signal);
        return realtimeConnection;
    }
    /**
     * Retries HTTP stream connection asyncly in random time intervals.
     */
    async retryHttpConnectionWhenBackoffEnds() {
        let backoffMetadata = await this.storage.getRealtimeBackoffMetadata();
        if (!backoffMetadata) {
            backoffMetadata = {
                backoffEndTimeMillis: new Date(NO_BACKOFF_TIME_IN_MILLIS),
                numFailedStreams: NO_FAILED_REALTIME_STREAMS
            };
        }
        const backoffEndTime = new Date(backoffMetadata.backoffEndTimeMillis).getTime();
        const currentTime = Date.now();
        const retryMillis = Math.max(0, backoffEndTime - currentTime);
        await this.makeRealtimeHttpConnection(retryMillis);
    }
    setIsHttpConnectionRunning(connectionRunning) {
        this.isConnectionActive = connectionRunning;
    }
    /**
     * Combines the check and set operations to prevent multiple asynchronous
     * calls from redundantly starting an HTTP connection. This ensures that
     * only one attempt is made at a time.
     */
    checkAndSetHttpConnectionFlagIfNotRunning() {
        const canMakeConnection = this.canEstablishStreamConnection();
        if (canMakeConnection) {
            this.setIsHttpConnectionRunning(true);
        }
        return canMakeConnection;
    }
    fetchResponseIsUpToDate(fetchResponse, lastKnownVersion) {
        // If there is a config, make sure its version is >= the last known version.
        if (fetchResponse.config != null && fetchResponse.templateVersion) {
            return fetchResponse.templateVersion >= lastKnownVersion;
        }
        // If there isn't a config, return true if the fetch was successful and backend had no update.
        // Else, it returned an out of date config.
        return this.storageCache.getLastFetchStatus() === 'success';
    }
    parseAndValidateConfigUpdateMessage(message) {
        const left = message.indexOf('{');
        const right = message.indexOf('}', left);
        if (left < 0 || right < 0) {
            return '';
        }
        return left >= right ? '' : message.substring(left, right + 1);
    }
    isEventListenersEmpty() {
        return this.observers.size === 0;
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    executeAllListenerCallbacks(configUpdate) {
        this.observers.forEach(observer => observer.next(configUpdate));
    }
    /**
     * Compares two configuration objects and returns a set of keys that have changed.
     * A key is considered changed if it's new, removed, or has a different value.
     */
    getChangedParams(newConfig, oldConfig) {
        const changedKeys = new Set();
        const newKeys = new Set(Object.keys(newConfig || {}));
        const oldKeys = new Set(Object.keys(oldConfig || {}));
        for (const key of newKeys) {
            if (!oldKeys.has(key) || newConfig[key] !== oldConfig[key]) {
                changedKeys.add(key);
            }
        }
        for (const key of oldKeys) {
            if (!newKeys.has(key)) {
                changedKeys.add(key);
            }
        }
        return changedKeys;
    }
    async fetchLatestConfig(remainingAttempts, targetVersion) {
        const remainingAttemptsAfterFetch = remainingAttempts - 1;
        const currentAttempt = MAXIMUM_FETCH_ATTEMPTS - remainingAttemptsAfterFetch;
        const customSignals = this.storageCache.getCustomSignals();
        if (customSignals) {
            this.logger.debug(`Fetching config with custom signals: ${JSON.stringify(customSignals)}`);
        }
        const abortSignal = new RemoteConfigAbortSignal();
        try {
            const fetchRequest = {
                cacheMaxAgeMillis: 0,
                signal: abortSignal,
                customSignals,
                fetchType: 'REALTIME',
                fetchAttempt: currentAttempt
            };
            const fetchResponse = await this.cachingClient.fetch(fetchRequest);
            let activatedConfigs = await this.storage.getActiveConfig();
            if (!this.fetchResponseIsUpToDate(fetchResponse, targetVersion)) {
                this.logger.debug("Fetched template version is the same as SDK's current version." +
                    ' Retrying fetch.');
                // Continue fetching until template version number is greater than current.
                await this.autoFetch(remainingAttemptsAfterFetch, targetVersion);
                return;
            }
            if (fetchResponse.config == null) {
                this.logger.debug('The fetch succeeded, but the backend had no updates.');
                return;
            }
            if (activatedConfigs == null) {
                activatedConfigs = {};
            }
            const updatedKeys = this.getChangedParams(fetchResponse.config, activatedConfigs);
            if (updatedKeys.size === 0) {
                this.logger.debug('Config was fetched, but no params changed.');
                return;
            }
            const configUpdate = {
                getUpdatedKeys() {
                    return new Set(updatedKeys);
                }
            };
            this.executeAllListenerCallbacks(configUpdate);
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            const error = ERROR_FACTORY.create("update-not-fetched" /* ErrorCode.CONFIG_UPDATE_NOT_FETCHED */, {
                originalErrorMessage: `Failed to auto-fetch config update: ${errorMessage}`
            });
            this.propagateError(error);
        }
    }
    async autoFetch(remainingAttempts, targetVersion) {
        if (remainingAttempts === 0) {
            const error = ERROR_FACTORY.create("update-not-fetched" /* ErrorCode.CONFIG_UPDATE_NOT_FETCHED */, {
                originalErrorMessage: 'Unable to fetch the latest version of the template.'
            });
            this.propagateError(error);
            return;
        }
        const timeTillFetchSeconds = this.getRandomInt(4);
        const timeTillFetchInMiliseconds = timeTillFetchSeconds * 1000;
        await new Promise(resolve => setTimeout(resolve, timeTillFetchInMiliseconds));
        await this.fetchLatestConfig(remainingAttempts, targetVersion);
    }
    /**
     * Processes a stream of real-time messages for configuration updates.
     * This method reassembles fragmented messages, validates and parses the JSON,
     * and automatically fetches a new config if a newer template version is available.
     * It also handles server-specified retry intervals and propagates errors for
     * invalid messages or when real-time updates are disabled.
     */
    async handleNotifications(reader) {
        let partialConfigUpdateMessage;
        let currentConfigUpdateMessage = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            partialConfigUpdateMessage = this.decoder.decode(value, { stream: true });
            currentConfigUpdateMessage += partialConfigUpdateMessage;
            if (partialConfigUpdateMessage.includes('}')) {
                currentConfigUpdateMessage = this.parseAndValidateConfigUpdateMessage(currentConfigUpdateMessage);
                if (currentConfigUpdateMessage.length === 0) {
                    continue;
                }
                try {
                    const jsonObject = JSON.parse(currentConfigUpdateMessage);
                    if (this.isEventListenersEmpty()) {
                        break;
                    }
                    if (REALTIME_DISABLED_KEY in jsonObject &&
                        jsonObject[REALTIME_DISABLED_KEY] === true) {
                        const error = ERROR_FACTORY.create("realtime-unavailable" /* ErrorCode.CONFIG_UPDATE_UNAVAILABLE */, {
                            originalErrorMessage: 'The server is temporarily unavailable. Try again in a few minutes.'
                        });
                        this.propagateError(error);
                        break;
                    }
                    if (TEMPLATE_VERSION_KEY in jsonObject) {
                        const oldTemplateVersion = await this.storage.getActiveConfigTemplateVersion();
                        const targetTemplateVersion = Number(jsonObject[TEMPLATE_VERSION_KEY]);
                        if (oldTemplateVersion &&
                            targetTemplateVersion > oldTemplateVersion) {
                            await this.autoFetch(MAXIMUM_FETCH_ATTEMPTS, targetTemplateVersion);
                        }
                    }
                    // This field in the response indicates that the realtime request should retry after the
                    // specified interval to establish a long-lived connection. This interval extends the
                    // backoff duration without affecting the number of retries, so it will not enter an
                    // exponential backoff state.
                    if (REALTIME_RETRY_INTERVAL in jsonObject) {
                        const retryIntervalSeconds = Number(jsonObject[REALTIME_RETRY_INTERVAL]);
                        await this.updateBackoffMetadataWithRetryInterval(retryIntervalSeconds);
                    }
                }
                catch (e) {
                    this.logger.debug('Unable to parse latest config update message.', e);
                    const errorMessage = e instanceof Error ? e.message : String(e);
                    this.propagateError(ERROR_FACTORY.create("update-message-invalid" /* ErrorCode.CONFIG_UPDATE_MESSAGE_INVALID */, {
                        originalErrorMessage: errorMessage
                    }));
                }
                currentConfigUpdateMessage = '';
            }
        }
    }
    async listenForNotifications(reader) {
        try {
            await this.handleNotifications(reader);
        }
        catch (e) {
            // If the real-time connection is at an unexpected lifecycle state when the app is
            // backgrounded, it's expected closing the connection will throw an exception.
            if (!this.isInBackground) {
                // Otherwise, the real-time server connection was closed due to a transient issue.
                this.logger.debug('Real-time connection was closed due to an exception.');
            }
        }
    }
    /**
     * Open the real-time connection, begin listening for updates, and auto-fetch when an update is
     * received.
     *
     * If the connection is successful, this method will block on its thread while it reads the
     * chunk-encoded HTTP body. When the connection closes, it attempts to reestablish the stream.
     */
    async prepareAndBeginRealtimeHttpStream() {
        if (!this.checkAndSetHttpConnectionFlagIfNotRunning()) {
            return;
        }
        let backoffMetadata = await this.storage.getRealtimeBackoffMetadata();
        if (!backoffMetadata) {
            backoffMetadata = {
                backoffEndTimeMillis: new Date(NO_BACKOFF_TIME_IN_MILLIS),
                numFailedStreams: NO_FAILED_REALTIME_STREAMS
            };
        }
        const backoffEndTime = backoffMetadata.backoffEndTimeMillis.getTime();
        if (Date.now() < backoffEndTime) {
            await this.retryHttpConnectionWhenBackoffEnds();
            return;
        }
        let response;
        let responseCode;
        try {
            response = await this.createRealtimeConnection();
            responseCode = response.status;
            if (response.ok && response.body) {
                this.resetRetryCount();
                await this.resetRealtimeBackoff();
                const reader = response.body.getReader();
                this.reader = reader;
                // Start listening for realtime notifications.
                await this.listenForNotifications(reader);
            }
        }
        catch (error) {
            if (this.isInBackground) {
                // It's possible the app was backgrounded while the connection was open, which
                // threw an exception trying to read the response. No real error here, so treat
                // this as a success, even if we haven't read a 200 response code yet.
                this.resetRetryCount();
            }
            else {
                //there might have been a transient error so the client will retry the connection.
                this.logger.debug('Exception connecting to real-time RC backend. Retrying the connection...:', error);
            }
        }
        finally {
            // Close HTTP connection and associated streams.
            await this.closeRealtimeHttpConnection();
            this.setIsHttpConnectionRunning(false);
            // Update backoff metadata if the connection failed in the foreground.
            const connectionFailed = !this.isInBackground &&
                (responseCode === undefined ||
                    this.isStatusCodeRetryable(responseCode));
            if (connectionFailed) {
                await this.updateBackoffMetadataWithLastFailedStreamConnectionTime(new Date());
            }
            // If responseCode is null then no connection was made to server and the SDK should still retry.
            if (connectionFailed || response?.ok) {
                await this.retryHttpConnectionWhenBackoffEnds();
            }
            else {
                const errorMessage = `Unable to connect to the server. HTTP status code: ${responseCode}`;
                const firebaseError = ERROR_FACTORY.create("stream-error" /* ErrorCode.CONFIG_UPDATE_STREAM_ERROR */, {
                    originalErrorMessage: errorMessage
                });
                this.propagateError(firebaseError);
            }
        }
    }
    /**
     * Checks whether connection can be made or not based on some conditions
     * @returns booelean
     */
    canEstablishStreamConnection() {
        const hasActiveListeners = this.observers.size > 0;
        const isNotDisabled = !this.isRealtimeDisabled;
        const isNoConnectionActive = !this.isConnectionActive;
        const inForeground = !this.isInBackground;
        return (hasActiveListeners &&
            isNotDisabled &&
            isNoConnectionActive &&
            inForeground);
    }
    async makeRealtimeHttpConnection(delayMillis) {
        if (!this.canEstablishStreamConnection()) {
            return;
        }
        if (this.httpRetriesRemaining > 0) {
            this.httpRetriesRemaining--;
            await new Promise(resolve => setTimeout(resolve, delayMillis));
            void this.prepareAndBeginRealtimeHttpStream();
        }
        else if (!this.isInBackground) {
            const error = ERROR_FACTORY.create("stream-error" /* ErrorCode.CONFIG_UPDATE_STREAM_ERROR */, {
                originalErrorMessage: 'Unable to connect to the server. Check your connection and try again.'
            });
            this.propagateError(error);
        }
    }
    async beginRealtime() {
        if (this.observers.size > 0) {
            await this.makeRealtimeHttpConnection(0);
        }
    }
    /**
     * Adds an observer to the realtime updates.
     * @param observer The observer to add.
     */
    addObserver(observer) {
        this.observers.add(observer);
        void this.beginRealtime();
    }
    /**
     * Removes an observer from the realtime updates.
     * @param observer The observer to remove.
     */
    removeObserver(observer) {
        if (this.observers.has(observer)) {
            this.observers.delete(observer);
        }
    }
    /**
     * Handles changes to the application's visibility state, managing the real-time connection.
     *
     * When the application is moved to the background, this method closes the existing
     * real-time connection to save resources. When the application returns to the
     * foreground, it attempts to re-establish the connection.
     */
    async onVisibilityChange(visible) {
        this.isInBackground = !visible;
        if (!visible) {
            await this.closeRealtimeHttpConnection();
        }
        else if (visible) {
            await this.beginRealtime();
        }
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
function registerRemoteConfig() {
    _registerComponent(new Component(RC_COMPONENT_NAME, remoteConfigFactory, "PUBLIC" /* ComponentType.PUBLIC */).setMultipleInstances(true));
    registerVersion(name, version);
    // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
    registerVersion(name, version, 'esm2020');
    function remoteConfigFactory(container, { options }) {
        /* Dependencies */
        // getImmediate for FirebaseApp will always succeed
        const app = container.getProvider('app').getImmediate();
        // The following call will always succeed because rc has `import '@firebase/installations'`
        const installations = container
            .getProvider('installations-internal')
            .getImmediate();
        const analyticsProvider = container.getProvider('analytics-internal');
        // Normalizes optional inputs.
        const { projectId, apiKey, appId } = app.options;
        if (!projectId) {
            throw ERROR_FACTORY.create("registration-project-id" /* ErrorCode.REGISTRATION_PROJECT_ID */);
        }
        if (!apiKey) {
            throw ERROR_FACTORY.create("registration-api-key" /* ErrorCode.REGISTRATION_API_KEY */);
        }
        if (!appId) {
            throw ERROR_FACTORY.create("registration-app-id" /* ErrorCode.REGISTRATION_APP_ID */);
        }
        const namespace = options?.templateId || 'firebase';
        const storage = isIndexedDBAvailable()
            ? new IndexedDbStorage(appId, app.name, namespace)
            : new InMemoryStorage();
        const storageCache = new StorageCache(storage);
        const logger = new Logger(name);
        // Sets ERROR as the default log level.
        // See RemoteConfig#setLogLevel for corresponding normalization to ERROR log level.
        logger.logLevel = LogLevel.ERROR;
        const restClient = new RestClient(installations, 
        // Uses the JS SDK version, by which the RC package version can be deduced, if necessary.
        SDK_VERSION, namespace, projectId, apiKey, appId);
        const retryingClient = new RetryingClient(restClient, storage);
        const cachingClient = new CachingClient(retryingClient, storage, storageCache, logger);
        const realtimeHandler = new RealtimeHandler(installations, storage, SDK_VERSION, namespace, projectId, apiKey, appId, logger, storageCache, cachingClient);
        const remoteConfigInstance = new RemoteConfig(app, cachingClient, storageCache, storage, logger, realtimeHandler, analyticsProvider);
        // Starts warming cache.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        ensureInitialized(remoteConfigInstance);
        return remoteConfigInstance;
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
// This API is put in a separate file, so we can stub fetchConfig and activate in tests.
// It's not possible to stub standalone functions from the same module.
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
async function fetchAndActivate(remoteConfig) {
    remoteConfig = getModularInstance(remoteConfig);
    await fetchConfig(remoteConfig);
    return activate(remoteConfig);
}
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
async function isSupported() {
    if (!isIndexedDBAvailable()) {
        return false;
    }
    try {
        const isDBOpenable = await validateIndexedDBOpenable();
        return isDBOpenable;
    }
    catch (error) {
        return false;
    }
}

/**
 * The Firebase Remote Config Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */
/** register component and version */
registerRemoteConfig();

export { activate, ensureInitialized, fetchAndActivate, fetchConfig, getAll, getBoolean, getNumber, getRemoteConfig, getString, getValue, isSupported, onConfigUpdate, setCustomSignals, setLogLevel };
//# sourceMappingURL=index.esm.js.map
