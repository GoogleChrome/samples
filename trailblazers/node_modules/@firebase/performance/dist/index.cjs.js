'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var util = require('@firebase/util');
var logger$1 = require('@firebase/logger');
var attribution = require('web-vitals/attribution');
var app = require('@firebase/app');
var component = require('@firebase/component');
require('@firebase/installations');

const name = "@firebase/performance";
const version = "0.7.11";

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
const SDK_VERSION = version;
/** The prefix for start User Timing marks used for creating Traces. */
const TRACE_START_MARK_PREFIX = 'FB-PERF-TRACE-START';
/** The prefix for stop User Timing marks used for creating Traces. */
const TRACE_STOP_MARK_PREFIX = 'FB-PERF-TRACE-STOP';
/** The prefix for User Timing measure used for creating Traces. */
const TRACE_MEASURE_PREFIX = 'FB-PERF-TRACE-MEASURE';
/** The prefix for out of the box page load Trace name. */
const OOB_TRACE_PAGE_LOAD_PREFIX = '_wt_';
const FIRST_PAINT_COUNTER_NAME = '_fp';
const FIRST_CONTENTFUL_PAINT_COUNTER_NAME = '_fcp';
const FIRST_INPUT_DELAY_COUNTER_NAME = '_fid';
const LARGEST_CONTENTFUL_PAINT_METRIC_NAME = '_lcp';
const LARGEST_CONTENTFUL_PAINT_ATTRIBUTE_NAME = 'lcp_element';
const INTERACTION_TO_NEXT_PAINT_METRIC_NAME = '_inp';
const INTERACTION_TO_NEXT_PAINT_ATTRIBUTE_NAME = 'inp_interactionTarget';
const CUMULATIVE_LAYOUT_SHIFT_METRIC_NAME = '_cls';
const CUMULATIVE_LAYOUT_SHIFT_ATTRIBUTE_NAME = 'cls_largestShiftTarget';
const CONFIG_LOCAL_STORAGE_KEY = '@firebase/performance/config';
const CONFIG_EXPIRY_LOCAL_STORAGE_KEY = '@firebase/performance/configexpire';
const SERVICE = 'performance';
const SERVICE_NAME = 'Performance';

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
const ERROR_DESCRIPTION_MAP = {
    ["trace started" /* ErrorCode.TRACE_STARTED_BEFORE */]: 'Trace {$traceName} was started before.',
    ["trace stopped" /* ErrorCode.TRACE_STOPPED_BEFORE */]: 'Trace {$traceName} is not running.',
    ["nonpositive trace startTime" /* ErrorCode.NONPOSITIVE_TRACE_START_TIME */]: 'Trace {$traceName} startTime should be positive.',
    ["nonpositive trace duration" /* ErrorCode.NONPOSITIVE_TRACE_DURATION */]: 'Trace {$traceName} duration should be positive.',
    ["no window" /* ErrorCode.NO_WINDOW */]: 'Window is not available.',
    ["no app id" /* ErrorCode.NO_APP_ID */]: 'App id is not available.',
    ["no project id" /* ErrorCode.NO_PROJECT_ID */]: 'Project id is not available.',
    ["no api key" /* ErrorCode.NO_API_KEY */]: 'Api key is not available.',
    ["invalid cc log" /* ErrorCode.INVALID_CC_LOG */]: 'Attempted to queue invalid cc event',
    ["FB not default" /* ErrorCode.FB_NOT_DEFAULT */]: 'Performance can only start when Firebase app instance is the default one.',
    ["RC response not ok" /* ErrorCode.RC_NOT_OK */]: 'RC response is not ok',
    ["invalid attribute name" /* ErrorCode.INVALID_ATTRIBUTE_NAME */]: 'Attribute name {$attributeName} is invalid.',
    ["invalid attribute value" /* ErrorCode.INVALID_ATTRIBUTE_VALUE */]: 'Attribute value {$attributeValue} is invalid.',
    ["invalid custom metric name" /* ErrorCode.INVALID_CUSTOM_METRIC_NAME */]: 'Custom metric name {$customMetricName} is invalid',
    ["invalid String merger input" /* ErrorCode.INVALID_STRING_MERGER_PARAMETER */]: 'Input for String merger is invalid, contact support team to resolve.',
    ["already initialized" /* ErrorCode.ALREADY_INITIALIZED */]: 'initializePerformance() has already been called with ' +
        'different options. To avoid this error, call initializePerformance() with the ' +
        'same options as when it was originally called, or call getPerformance() to return the' +
        ' already initialized instance.'
};
const ERROR_FACTORY = new util.ErrorFactory(SERVICE, SERVICE_NAME, ERROR_DESCRIPTION_MAP);

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
const consoleLogger = new logger$1.Logger(SERVICE_NAME);
consoleLogger.logLevel = logger$1.LogLevel.INFO;

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
let apiInstance;
let windowInstance;
/**
 * This class holds a reference to various browser related objects injected by
 * set methods.
 */
class Api {
    constructor(window) {
        this.window = window;
        if (!window) {
            throw ERROR_FACTORY.create("no window" /* ErrorCode.NO_WINDOW */);
        }
        this.performance = window.performance;
        this.PerformanceObserver = window.PerformanceObserver;
        this.windowLocation = window.location;
        this.navigator = window.navigator;
        this.document = window.document;
        if (this.navigator && this.navigator.cookieEnabled) {
            // If user blocks cookies on the browser, accessing localStorage will
            // throw an exception.
            this.localStorage = window.localStorage;
        }
        if (window.perfMetrics && window.perfMetrics.onFirstInputDelay) {
            this.onFirstInputDelay = window.perfMetrics.onFirstInputDelay;
        }
        this.onLCP = attribution.onLCP;
        this.onINP = attribution.onINP;
        this.onCLS = attribution.onCLS;
    }
    getUrl() {
        // Do not capture the string query part of url.
        return this.windowLocation.href.split('?')[0];
    }
    mark(name) {
        if (!this.performance || !this.performance.mark) {
            return;
        }
        this.performance.mark(name);
    }
    measure(measureName, mark1, mark2) {
        if (!this.performance || !this.performance.measure) {
            return;
        }
        this.performance.measure(measureName, mark1, mark2);
    }
    getEntriesByType(type) {
        if (!this.performance || !this.performance.getEntriesByType) {
            return [];
        }
        return this.performance.getEntriesByType(type);
    }
    getEntriesByName(name) {
        if (!this.performance || !this.performance.getEntriesByName) {
            return [];
        }
        return this.performance.getEntriesByName(name);
    }
    getTimeOrigin() {
        // Polyfill the time origin with performance.timing.navigationStart.
        return (this.performance &&
            (this.performance.timeOrigin || this.performance.timing.navigationStart));
    }
    requiredApisAvailable() {
        if (!fetch || !Promise || !util.areCookiesEnabled()) {
            consoleLogger.info('Firebase Performance cannot start if browser does not support fetch and Promise or cookie is disabled.');
            return false;
        }
        if (!util.isIndexedDBAvailable()) {
            consoleLogger.info('IndexedDB is not supported by current browser');
            return false;
        }
        return true;
    }
    setupObserver(entryType, callback) {
        if (!this.PerformanceObserver) {
            return;
        }
        const observer = new this.PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
                // `entry` is a PerformanceEntry instance.
                callback(entry);
            }
        });
        // Start observing the entry types you care about.
        observer.observe({ entryTypes: [entryType] });
    }
    static getInstance() {
        if (apiInstance === undefined) {
            apiInstance = new Api(windowInstance);
        }
        return apiInstance;
    }
}
function setupApi(window) {
    windowInstance = window;
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
let iid;
function getIidPromise(installationsService) {
    const iidPromise = installationsService.getId();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    iidPromise.then((iidVal) => {
        iid = iidVal;
    });
    return iidPromise;
}
// This method should be used after the iid is retrieved by getIidPromise method.
function getIid() {
    return iid;
}
function getAuthTokenPromise(installationsService) {
    const authTokenPromise = installationsService.getToken();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    authTokenPromise.then((authTokenVal) => {
    });
    return authTokenPromise;
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
function mergeStrings(part1, part2) {
    const sizeDiff = part1.length - part2.length;
    if (sizeDiff < 0 || sizeDiff > 1) {
        throw ERROR_FACTORY.create("invalid String merger input" /* ErrorCode.INVALID_STRING_MERGER_PARAMETER */);
    }
    const resultArray = [];
    for (let i = 0; i < part1.length; i++) {
        resultArray.push(part1.charAt(i));
        if (part2.length > i) {
            resultArray.push(part2.charAt(i));
        }
    }
    return resultArray.join('');
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
let settingsServiceInstance;
class SettingsService {
    constructor() {
        // The variable which controls logging of automatic traces and HTTP/S network monitoring.
        this.instrumentationEnabled = true;
        // The variable which controls logging of custom traces.
        this.dataCollectionEnabled = true;
        // Configuration flags set through remote config.
        this.loggingEnabled = false;
        // Sampling rate between 0 and 1.
        this.tracesSamplingRate = 1;
        this.networkRequestsSamplingRate = 1;
        // Address of logging service.
        this.logEndPointUrl = 'https://firebaselogging.googleapis.com/v0cc/log?format=json_proto';
        // Performance event transport endpoint URL which should be compatible with proto3.
        // New Address for transport service, not configurable via Remote Config.
        this.flTransportEndpointUrl = mergeStrings('hts/frbslgigp.ogepscmv/ieo/eaylg', 'tp:/ieaeogn-agolai.o/1frlglgc/o');
        this.transportKey = mergeStrings('AzSC8r6ReiGqFMyfvgow', 'Iayx0u-XT3vksVM-pIV');
        // Source type for performance event logs.
        this.logSource = 462;
        // Flags which control per session logging of traces and network requests.
        this.logTraceAfterSampling = false;
        this.logNetworkAfterSampling = false;
        // TTL of config retrieved from remote config in hours.
        this.configTimeToLive = 12;
        // The max number of events to send during a flush. This number is kept low to since Chrome has a
        // shared payload limit for all sendBeacon calls in the same nav context.
        this.logMaxFlushSize = 40;
    }
    getFlTransportFullUrl() {
        return this.flTransportEndpointUrl.concat('?key=', this.transportKey);
    }
    static getInstance() {
        if (settingsServiceInstance === undefined) {
            settingsServiceInstance = new SettingsService();
        }
        return settingsServiceInstance;
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
var VisibilityState;
(function (VisibilityState) {
    VisibilityState[VisibilityState["UNKNOWN"] = 0] = "UNKNOWN";
    VisibilityState[VisibilityState["VISIBLE"] = 1] = "VISIBLE";
    VisibilityState[VisibilityState["HIDDEN"] = 2] = "HIDDEN";
})(VisibilityState || (VisibilityState = {}));
const RESERVED_ATTRIBUTE_PREFIXES = ['firebase_', 'google_', 'ga_'];
const ATTRIBUTE_FORMAT_REGEX = new RegExp('^[a-zA-Z]\\w*$');
const MAX_ATTRIBUTE_NAME_LENGTH = 40;
const MAX_ATTRIBUTE_VALUE_LENGTH = 100;
function getServiceWorkerStatus() {
    const navigator = Api.getInstance().navigator;
    if (navigator?.serviceWorker) {
        if (navigator.serviceWorker.controller) {
            return 2 /* ServiceWorkerStatus.CONTROLLED */;
        }
        else {
            return 3 /* ServiceWorkerStatus.UNCONTROLLED */;
        }
    }
    else {
        return 1 /* ServiceWorkerStatus.UNSUPPORTED */;
    }
}
function getVisibilityState() {
    const document = Api.getInstance().document;
    const visibilityState = document.visibilityState;
    switch (visibilityState) {
        case 'visible':
            return VisibilityState.VISIBLE;
        case 'hidden':
            return VisibilityState.HIDDEN;
        default:
            return VisibilityState.UNKNOWN;
    }
}
function getEffectiveConnectionType() {
    const navigator = Api.getInstance().navigator;
    const navigatorConnection = navigator.connection;
    const effectiveType = navigatorConnection && navigatorConnection.effectiveType;
    switch (effectiveType) {
        case 'slow-2g':
            return 1 /* EffectiveConnectionType.CONNECTION_SLOW_2G */;
        case '2g':
            return 2 /* EffectiveConnectionType.CONNECTION_2G */;
        case '3g':
            return 3 /* EffectiveConnectionType.CONNECTION_3G */;
        case '4g':
            return 4 /* EffectiveConnectionType.CONNECTION_4G */;
        default:
            return 0 /* EffectiveConnectionType.UNKNOWN */;
    }
}
function isValidCustomAttributeName(name) {
    if (name.length === 0 || name.length > MAX_ATTRIBUTE_NAME_LENGTH) {
        return false;
    }
    const matchesReservedPrefix = RESERVED_ATTRIBUTE_PREFIXES.some(prefix => name.startsWith(prefix));
    return !matchesReservedPrefix && !!name.match(ATTRIBUTE_FORMAT_REGEX);
}
function isValidCustomAttributeValue(value) {
    return value.length !== 0 && value.length <= MAX_ATTRIBUTE_VALUE_LENGTH;
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
function getAppId(firebaseApp) {
    const appId = firebaseApp.options?.appId;
    if (!appId) {
        throw ERROR_FACTORY.create("no app id" /* ErrorCode.NO_APP_ID */);
    }
    return appId;
}
function getProjectId(firebaseApp) {
    const projectId = firebaseApp.options?.projectId;
    if (!projectId) {
        throw ERROR_FACTORY.create("no project id" /* ErrorCode.NO_PROJECT_ID */);
    }
    return projectId;
}
function getApiKey(firebaseApp) {
    const apiKey = firebaseApp.options?.apiKey;
    if (!apiKey) {
        throw ERROR_FACTORY.create("no api key" /* ErrorCode.NO_API_KEY */);
    }
    return apiKey;
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
const REMOTE_CONFIG_SDK_VERSION = '0.0.1';
// These values will be used if the remote config object is successfully
// retrieved, but the template does not have these fields.
const DEFAULT_CONFIGS = {
    loggingEnabled: true
};
const FIS_AUTH_PREFIX = 'FIREBASE_INSTALLATIONS_AUTH';
function getConfig(performanceController, iid) {
    const config = getStoredConfig();
    if (config) {
        processConfig(config);
        return Promise.resolve();
    }
    return getRemoteConfig(performanceController, iid)
        .then(processConfig)
        .then(config => storeConfig(config), 
    /** Do nothing for error, use defaults set in settings service. */
    () => { });
}
function getStoredConfig() {
    const localStorage = Api.getInstance().localStorage;
    if (!localStorage) {
        return;
    }
    const expiryString = localStorage.getItem(CONFIG_EXPIRY_LOCAL_STORAGE_KEY);
    if (!expiryString || !configValid(expiryString)) {
        return;
    }
    const configStringified = localStorage.getItem(CONFIG_LOCAL_STORAGE_KEY);
    if (!configStringified) {
        return;
    }
    try {
        const configResponse = JSON.parse(configStringified);
        return configResponse;
    }
    catch {
        return;
    }
}
function storeConfig(config) {
    const localStorage = Api.getInstance().localStorage;
    if (!config || !localStorage) {
        return;
    }
    localStorage.setItem(CONFIG_LOCAL_STORAGE_KEY, JSON.stringify(config));
    localStorage.setItem(CONFIG_EXPIRY_LOCAL_STORAGE_KEY, String(Date.now() +
        SettingsService.getInstance().configTimeToLive * 60 * 60 * 1000));
}
const COULD_NOT_GET_CONFIG_MSG = 'Could not fetch config, will use default configs';
function getRemoteConfig(performanceController, iid) {
    // Perf needs auth token only to retrieve remote config.
    return getAuthTokenPromise(performanceController.installations)
        .then(authToken => {
        const projectId = getProjectId(performanceController.app);
        const apiKey = getApiKey(performanceController.app);
        const configEndPoint = `https://firebaseremoteconfig.googleapis.com/v1/projects/${projectId}/namespaces/fireperf:fetch?key=${apiKey}`;
        const request = new Request(configEndPoint, {
            method: 'POST',
            headers: { Authorization: `${FIS_AUTH_PREFIX} ${authToken}` },
            /* eslint-disable camelcase */
            body: JSON.stringify({
                app_instance_id: iid,
                app_instance_id_token: authToken,
                app_id: getAppId(performanceController.app),
                app_version: SDK_VERSION,
                sdk_version: REMOTE_CONFIG_SDK_VERSION
            })
            /* eslint-enable camelcase */
        });
        return fetch(request).then(response => {
            if (response.ok) {
                return response.json();
            }
            // In case response is not ok. This will be caught by catch.
            throw ERROR_FACTORY.create("RC response not ok" /* ErrorCode.RC_NOT_OK */);
        });
    })
        .catch(() => {
        consoleLogger.info(COULD_NOT_GET_CONFIG_MSG);
        return undefined;
    });
}
/**
 * Processes config coming either from calling RC or from local storage.
 * This method only runs if call is successful or config in storage
 * is valid.
 */
function processConfig(config) {
    if (!config) {
        return config;
    }
    const settingsServiceInstance = SettingsService.getInstance();
    const entries = config.entries || {};
    if (entries.fpr_enabled !== undefined) {
        // TODO: Change the assignment of loggingEnabled once the received type is
        // known.
        settingsServiceInstance.loggingEnabled =
            String(entries.fpr_enabled) === 'true';
    }
    else {
        // Config retrieved successfully, but there is no fpr_enabled in template.
        // Use secondary configs value.
        settingsServiceInstance.loggingEnabled = DEFAULT_CONFIGS.loggingEnabled;
    }
    if (entries.fpr_log_source) {
        settingsServiceInstance.logSource = Number(entries.fpr_log_source);
    }
    else if (DEFAULT_CONFIGS.logSource) {
        settingsServiceInstance.logSource = DEFAULT_CONFIGS.logSource;
    }
    if (entries.fpr_log_endpoint_url) {
        settingsServiceInstance.logEndPointUrl = entries.fpr_log_endpoint_url;
    }
    else if (DEFAULT_CONFIGS.logEndPointUrl) {
        settingsServiceInstance.logEndPointUrl = DEFAULT_CONFIGS.logEndPointUrl;
    }
    // Key from Remote Config has to be non-empty string, otherwise use local value.
    if (entries.fpr_log_transport_key) {
        settingsServiceInstance.transportKey = entries.fpr_log_transport_key;
    }
    else if (DEFAULT_CONFIGS.transportKey) {
        settingsServiceInstance.transportKey = DEFAULT_CONFIGS.transportKey;
    }
    if (entries.fpr_vc_network_request_sampling_rate !== undefined) {
        settingsServiceInstance.networkRequestsSamplingRate = Number(entries.fpr_vc_network_request_sampling_rate);
    }
    else if (DEFAULT_CONFIGS.networkRequestsSamplingRate !== undefined) {
        settingsServiceInstance.networkRequestsSamplingRate =
            DEFAULT_CONFIGS.networkRequestsSamplingRate;
    }
    if (entries.fpr_vc_trace_sampling_rate !== undefined) {
        settingsServiceInstance.tracesSamplingRate = Number(entries.fpr_vc_trace_sampling_rate);
    }
    else if (DEFAULT_CONFIGS.tracesSamplingRate !== undefined) {
        settingsServiceInstance.tracesSamplingRate =
            DEFAULT_CONFIGS.tracesSamplingRate;
    }
    if (entries.fpr_log_max_flush_size) {
        settingsServiceInstance.logMaxFlushSize = Number(entries.fpr_log_max_flush_size);
    }
    else if (DEFAULT_CONFIGS.logMaxFlushSize) {
        settingsServiceInstance.logMaxFlushSize = DEFAULT_CONFIGS.logMaxFlushSize;
    }
    // Set the per session trace and network logging flags.
    settingsServiceInstance.logTraceAfterSampling = shouldLogAfterSampling(settingsServiceInstance.tracesSamplingRate);
    settingsServiceInstance.logNetworkAfterSampling = shouldLogAfterSampling(settingsServiceInstance.networkRequestsSamplingRate);
    return config;
}
function configValid(expiry) {
    return Number(expiry) > Date.now();
}
function shouldLogAfterSampling(samplingRate) {
    return Math.random() <= samplingRate;
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
let initializationStatus = 1 /* InitializationStatus.notInitialized */;
let initializationPromise;
function getInitializationPromise(performanceController) {
    initializationStatus = 2 /* InitializationStatus.initializationPending */;
    initializationPromise =
        initializationPromise || initializePerf(performanceController);
    return initializationPromise;
}
function isPerfInitialized() {
    return initializationStatus === 3 /* InitializationStatus.initialized */;
}
function initializePerf(performanceController) {
    return getDocumentReadyComplete()
        .then(() => getIidPromise(performanceController.installations))
        .then(iid => getConfig(performanceController, iid))
        .then(() => changeInitializationStatus(), () => changeInitializationStatus());
}
/**
 * Returns a promise which resolves whenever the document readystate is complete or
 * immediately if it is called after page load complete.
 */
function getDocumentReadyComplete() {
    const document = Api.getInstance().document;
    return new Promise(resolve => {
        if (document && document.readyState !== 'complete') {
            const handler = () => {
                if (document.readyState === 'complete') {
                    document.removeEventListener('readystatechange', handler);
                    resolve();
                }
            };
            document.addEventListener('readystatechange', handler);
        }
        else {
            resolve();
        }
    });
}
function changeInitializationStatus() {
    initializationStatus = 3 /* InitializationStatus.initialized */;
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
const DEFAULT_SEND_INTERVAL_MS = 10 * 1000;
const INITIAL_SEND_TIME_DELAY_MS = 5.5 * 1000;
const MAX_EVENT_COUNT_PER_REQUEST = 1000;
const DEFAULT_REMAINING_TRIES = 3;
// Most browsers have a max payload of 64KB for sendbeacon/keep alive payload.
const MAX_SEND_BEACON_PAYLOAD_SIZE = 65536;
const TEXT_ENCODER = new TextEncoder();
let remainingTries = DEFAULT_REMAINING_TRIES;
/* eslint-enable camelcase */
let queue = [];
let isTransportSetup = false;
function setupTransportService() {
    if (!isTransportSetup) {
        processQueue(INITIAL_SEND_TIME_DELAY_MS);
        isTransportSetup = true;
    }
}
function processQueue(timeOffset) {
    setTimeout(() => {
        // If there is no remainingTries left, stop retrying.
        if (remainingTries <= 0) {
            return;
        }
        if (queue.length > 0) {
            dispatchQueueEvents();
        }
        processQueue(DEFAULT_SEND_INTERVAL_MS);
    }, timeOffset);
}
function dispatchQueueEvents() {
    // Extract events up to the maximum cap of single logRequest from top of "official queue".
    // The staged events will be used for current logRequest attempt, remaining events will be kept
    // for next attempt.
    const staged = queue.splice(0, MAX_EVENT_COUNT_PER_REQUEST);
    const data = buildPayload(staged);
    postToFlEndpoint(data)
        .then(() => {
        remainingTries = DEFAULT_REMAINING_TRIES;
    })
        .catch(() => {
        // If the request fails for some reason, add the events that were attempted
        // back to the primary queue to retry later.
        queue = [...staged, ...queue];
        remainingTries--;
        consoleLogger.info(`Tries left: ${remainingTries}.`);
        processQueue(DEFAULT_SEND_INTERVAL_MS);
    });
}
function buildPayload(events) {
    /* eslint-disable camelcase */
    // We will pass the JSON serialized event to the backend.
    const log_event = events.map(evt => ({
        source_extension_json_proto3: evt.message,
        event_time_ms: String(evt.eventTime)
    }));
    const transportBatchLog = {
        request_time_ms: String(Date.now()),
        client_info: {
            client_type: 1, // 1 is JS
            js_client_info: {}
        },
        log_source: SettingsService.getInstance().logSource,
        log_event
    };
    /* eslint-enable camelcase */
    return JSON.stringify(transportBatchLog);
}
/** Sends to Firelog. Atempts to use sendBeacon otherwsise uses fetch. */
function postToFlEndpoint(body) {
    const flTransportFullUrl = SettingsService.getInstance().getFlTransportFullUrl();
    const size = TEXT_ENCODER.encode(body).length;
    if (size <= MAX_SEND_BEACON_PAYLOAD_SIZE &&
        navigator.sendBeacon &&
        navigator.sendBeacon(flTransportFullUrl, body)) {
        return Promise.resolve();
    }
    else {
        return fetch(flTransportFullUrl, {
            method: 'POST',
            body
        });
    }
}
function addToQueue(evt) {
    if (!evt.eventTime || !evt.message) {
        throw ERROR_FACTORY.create("invalid cc log" /* ErrorCode.INVALID_CC_LOG */);
    }
    // Add the new event to the queue.
    queue = [...queue, evt];
}
/** Log handler for cc service to send the performance logs to the server. */
function transportHandler(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
serializer) {
    return (...args) => {
        const message = serializer(...args);
        addToQueue({
            message,
            eventTime: Date.now()
        });
    };
}
/**
 * Force flush the queued events. Useful at page unload time to ensure all events are uploaded.
 * Flush will attempt to use sendBeacon to send events async and defaults back to fetch as soon as a
 * sendBeacon fails. Firefox
 */
function flushQueuedEvents() {
    const flTransportFullUrl = SettingsService.getInstance().getFlTransportFullUrl();
    while (queue.length > 0) {
        // Send the last events first to prioritize page load traces
        const staged = queue.splice(-SettingsService.getInstance().logMaxFlushSize);
        const body = buildPayload(staged);
        if (navigator.sendBeacon &&
            navigator.sendBeacon(flTransportFullUrl, body)) {
            continue;
        }
        else {
            queue = [...queue, ...staged];
            break;
        }
    }
    if (queue.length > 0) {
        const body = buildPayload(queue);
        fetch(flTransportFullUrl, {
            method: 'POST',
            body
        }).catch(() => {
            consoleLogger.info(`Failed flushing queued events.`);
        });
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
let logger;
//
// This method is not called before initialization.
function sendLog(resource, resourceType) {
    if (!logger) {
        logger = {
            send: transportHandler(serializer),
            flush: flushQueuedEvents
        };
    }
    logger.send(resource, resourceType);
}
function logTrace(trace) {
    const settingsService = SettingsService.getInstance();
    // Do not log if trace is auto generated and instrumentation is disabled.
    if (!settingsService.instrumentationEnabled && trace.isAuto) {
        return;
    }
    // Do not log if trace is custom and data collection is disabled.
    if (!settingsService.dataCollectionEnabled && !trace.isAuto) {
        return;
    }
    // Do not log if required apis are not available.
    if (!Api.getInstance().requiredApisAvailable()) {
        return;
    }
    if (isPerfInitialized()) {
        sendTraceLog(trace);
    }
    else {
        // Custom traces can be used before the initialization but logging
        // should wait until after.
        getInitializationPromise(trace.performanceController).then(() => sendTraceLog(trace), () => sendTraceLog(trace));
    }
}
function flushLogs() {
    if (logger) {
        logger.flush();
    }
}
function sendTraceLog(trace) {
    if (!getIid()) {
        return;
    }
    const settingsService = SettingsService.getInstance();
    if (!settingsService.loggingEnabled ||
        !settingsService.logTraceAfterSampling) {
        return;
    }
    sendLog(trace, 1 /* ResourceType.Trace */);
}
function logNetworkRequest(networkRequest) {
    const settingsService = SettingsService.getInstance();
    // Do not log network requests if instrumentation is disabled.
    if (!settingsService.instrumentationEnabled) {
        return;
    }
    // Do not log the js sdk's call to transport service domain to avoid unnecessary cycle.
    // Need to blacklist both old and new endpoints to avoid migration gap.
    const networkRequestUrl = networkRequest.url;
    // Blacklist old log endpoint and new transport endpoint.
    // Because Performance SDK doesn't instrument requests sent from SDK itself.
    const logEndpointUrl = settingsService.logEndPointUrl.split('?')[0];
    const flEndpointUrl = settingsService.flTransportEndpointUrl.split('?')[0];
    if (networkRequestUrl === logEndpointUrl ||
        networkRequestUrl === flEndpointUrl) {
        return;
    }
    if (!settingsService.loggingEnabled ||
        !settingsService.logNetworkAfterSampling) {
        return;
    }
    sendLog(networkRequest, 0 /* ResourceType.NetworkRequest */);
}
function serializer(resource, resourceType) {
    if (resourceType === 0 /* ResourceType.NetworkRequest */) {
        return serializeNetworkRequest(resource);
    }
    return serializeTrace(resource);
}
function serializeNetworkRequest(networkRequest) {
    const networkRequestMetric = {
        url: networkRequest.url,
        http_method: networkRequest.httpMethod || 0,
        http_response_code: 200,
        response_payload_bytes: networkRequest.responsePayloadBytes,
        client_start_time_us: networkRequest.startTimeUs,
        time_to_response_initiated_us: networkRequest.timeToResponseInitiatedUs,
        time_to_response_completed_us: networkRequest.timeToResponseCompletedUs
    };
    const perfMetric = {
        application_info: getApplicationInfo(networkRequest.performanceController.app),
        network_request_metric: networkRequestMetric
    };
    return JSON.stringify(perfMetric);
}
function serializeTrace(trace) {
    const traceMetric = {
        name: trace.name,
        is_auto: trace.isAuto,
        client_start_time_us: trace.startTimeUs,
        duration_us: trace.durationUs
    };
    if (Object.keys(trace.counters).length !== 0) {
        traceMetric.counters = trace.counters;
    }
    const customAttributes = trace.getAttributes();
    if (Object.keys(customAttributes).length !== 0) {
        traceMetric.custom_attributes = customAttributes;
    }
    const perfMetric = {
        application_info: getApplicationInfo(trace.performanceController.app),
        trace_metric: traceMetric
    };
    return JSON.stringify(perfMetric);
}
function getApplicationInfo(firebaseApp) {
    return {
        google_app_id: getAppId(firebaseApp),
        app_instance_id: getIid(),
        web_app_info: {
            sdk_version: SDK_VERSION,
            page_url: Api.getInstance().getUrl(),
            service_worker_status: getServiceWorkerStatus(),
            visibility_state: getVisibilityState(),
            effective_connection_type: getEffectiveConnectionType()
        },
        application_process_state: 0
    };
}
/* eslint-enable camelcase */

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
function createNetworkRequestEntry(performanceController, entry) {
    const performanceEntry = entry;
    if (!performanceEntry || performanceEntry.responseStart === undefined) {
        return;
    }
    const timeOrigin = Api.getInstance().getTimeOrigin();
    const startTimeUs = Math.floor((performanceEntry.startTime + timeOrigin) * 1000);
    const timeToResponseInitiatedUs = performanceEntry.responseStart
        ? Math.floor((performanceEntry.responseStart - performanceEntry.startTime) * 1000)
        : undefined;
    const timeToResponseCompletedUs = Math.floor((performanceEntry.responseEnd - performanceEntry.startTime) * 1000);
    // Remove the query params from logged network request url.
    const url = performanceEntry.name && performanceEntry.name.split('?')[0];
    const networkRequest = {
        performanceController,
        url,
        responsePayloadBytes: performanceEntry.transferSize,
        startTimeUs,
        timeToResponseInitiatedUs,
        timeToResponseCompletedUs
    };
    logNetworkRequest(networkRequest);
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
const MAX_METRIC_NAME_LENGTH = 100;
const RESERVED_AUTO_PREFIX = '_';
const oobMetrics = [
    FIRST_PAINT_COUNTER_NAME,
    FIRST_CONTENTFUL_PAINT_COUNTER_NAME,
    FIRST_INPUT_DELAY_COUNTER_NAME,
    LARGEST_CONTENTFUL_PAINT_METRIC_NAME,
    CUMULATIVE_LAYOUT_SHIFT_METRIC_NAME,
    INTERACTION_TO_NEXT_PAINT_METRIC_NAME
];
/**
 * Returns true if the metric is custom and does not start with reserved prefix, or if
 * the metric is one of out of the box page load trace metrics.
 */
function isValidMetricName(name, traceName) {
    if (name.length === 0 || name.length > MAX_METRIC_NAME_LENGTH) {
        return false;
    }
    return ((traceName &&
        traceName.startsWith(OOB_TRACE_PAGE_LOAD_PREFIX) &&
        oobMetrics.indexOf(name) > -1) ||
        !name.startsWith(RESERVED_AUTO_PREFIX));
}
/**
 * Converts the provided value to an integer value to be used in case of a metric.
 * @param providedValue Provided number value of the metric that needs to be converted to an integer.
 *
 * @returns Converted integer number to be set for the metric.
 */
function convertMetricValueToInteger(providedValue) {
    const valueAsInteger = Math.floor(providedValue);
    if (valueAsInteger < providedValue) {
        consoleLogger.info(`Metric value should be an Integer, setting the value as : ${valueAsInteger}.`);
    }
    return valueAsInteger;
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
class Trace {
    /**
     * @param performanceController The performance controller running.
     * @param name The name of the trace.
     * @param isAuto If the trace is auto-instrumented.
     * @param traceMeasureName The name of the measure marker in user timing specification. This field
     * is only set when the trace is built for logging when the user directly uses the user timing
     * api (performance.mark and performance.measure).
     */
    constructor(performanceController, name, isAuto = false, traceMeasureName) {
        this.performanceController = performanceController;
        this.name = name;
        this.isAuto = isAuto;
        this.state = 1 /* TraceState.UNINITIALIZED */;
        this.customAttributes = {};
        this.counters = {};
        this.api = Api.getInstance();
        this.randomId = Math.floor(Math.random() * 1000000);
        if (!this.isAuto) {
            this.traceStartMark = `${TRACE_START_MARK_PREFIX}-${this.randomId}-${this.name}`;
            this.traceStopMark = `${TRACE_STOP_MARK_PREFIX}-${this.randomId}-${this.name}`;
            this.traceMeasure =
                traceMeasureName ||
                    `${TRACE_MEASURE_PREFIX}-${this.randomId}-${this.name}`;
            if (traceMeasureName) {
                // For the case of direct user timing traces, no start stop will happen. The measure object
                // is already available.
                this.calculateTraceMetrics();
            }
        }
    }
    /**
     * Starts a trace. The measurement of the duration starts at this point.
     */
    start() {
        if (this.state !== 1 /* TraceState.UNINITIALIZED */) {
            throw ERROR_FACTORY.create("trace started" /* ErrorCode.TRACE_STARTED_BEFORE */, {
                traceName: this.name
            });
        }
        this.api.mark(this.traceStartMark);
        this.state = 2 /* TraceState.RUNNING */;
    }
    /**
     * Stops the trace. The measurement of the duration of the trace stops at this point and trace
     * is logged.
     */
    stop() {
        if (this.state !== 2 /* TraceState.RUNNING */) {
            throw ERROR_FACTORY.create("trace stopped" /* ErrorCode.TRACE_STOPPED_BEFORE */, {
                traceName: this.name
            });
        }
        this.state = 3 /* TraceState.TERMINATED */;
        this.api.mark(this.traceStopMark);
        this.api.measure(this.traceMeasure, this.traceStartMark, this.traceStopMark);
        this.calculateTraceMetrics();
        logTrace(this);
    }
    /**
     * Records a trace with predetermined values. If this method is used a trace is created and logged
     * directly. No need to use start and stop methods.
     * @param startTime Trace start time since epoch in millisec
     * @param duration The duration of the trace in millisec
     * @param options An object which can optionally hold maps of custom metrics and custom attributes
     */
    record(startTime, duration, options) {
        if (startTime <= 0) {
            throw ERROR_FACTORY.create("nonpositive trace startTime" /* ErrorCode.NONPOSITIVE_TRACE_START_TIME */, {
                traceName: this.name
            });
        }
        if (duration <= 0) {
            throw ERROR_FACTORY.create("nonpositive trace duration" /* ErrorCode.NONPOSITIVE_TRACE_DURATION */, {
                traceName: this.name
            });
        }
        this.durationUs = Math.floor(duration * 1000);
        this.startTimeUs = Math.floor(startTime * 1000);
        if (options && options.attributes) {
            this.customAttributes = { ...options.attributes };
        }
        if (options && options.metrics) {
            for (const metricName of Object.keys(options.metrics)) {
                if (!isNaN(Number(options.metrics[metricName]))) {
                    this.counters[metricName] = Math.floor(Number(options.metrics[metricName]));
                }
            }
        }
        logTrace(this);
    }
    /**
     * Increments a custom metric by a certain number or 1 if number not specified. Will create a new
     * custom metric if one with the given name does not exist. The value will be floored down to an
     * integer.
     * @param counter Name of the custom metric
     * @param numAsInteger Increment by value
     */
    incrementMetric(counter, numAsInteger = 1) {
        if (this.counters[counter] === undefined) {
            this.putMetric(counter, numAsInteger);
        }
        else {
            this.putMetric(counter, this.counters[counter] + numAsInteger);
        }
    }
    /**
     * Sets a custom metric to a specified value. Will create a new custom metric if one with the
     * given name does not exist. The value will be floored down to an integer.
     * @param counter Name of the custom metric
     * @param numAsInteger Set custom metric to this value
     */
    putMetric(counter, numAsInteger) {
        if (isValidMetricName(counter, this.name)) {
            this.counters[counter] = convertMetricValueToInteger(numAsInteger ?? 0);
        }
        else {
            throw ERROR_FACTORY.create("invalid custom metric name" /* ErrorCode.INVALID_CUSTOM_METRIC_NAME */, {
                customMetricName: counter
            });
        }
    }
    /**
     * Returns the value of the custom metric by that name. If a custom metric with that name does
     * not exist will return zero.
     * @param counter
     */
    getMetric(counter) {
        return this.counters[counter] || 0;
    }
    /**
     * Sets a custom attribute of a trace to a certain value.
     * @param attr
     * @param value
     */
    putAttribute(attr, value) {
        const isValidName = isValidCustomAttributeName(attr);
        const isValidValue = isValidCustomAttributeValue(value);
        if (isValidName && isValidValue) {
            this.customAttributes[attr] = value;
            return;
        }
        // Throw appropriate error when the attribute name or value is invalid.
        if (!isValidName) {
            throw ERROR_FACTORY.create("invalid attribute name" /* ErrorCode.INVALID_ATTRIBUTE_NAME */, {
                attributeName: attr
            });
        }
        if (!isValidValue) {
            throw ERROR_FACTORY.create("invalid attribute value" /* ErrorCode.INVALID_ATTRIBUTE_VALUE */, {
                attributeValue: value
            });
        }
    }
    /**
     * Retrieves the value a custom attribute of a trace is set to.
     * @param attr
     */
    getAttribute(attr) {
        return this.customAttributes[attr];
    }
    removeAttribute(attr) {
        if (this.customAttributes[attr] === undefined) {
            return;
        }
        delete this.customAttributes[attr];
    }
    getAttributes() {
        return { ...this.customAttributes };
    }
    setStartTime(startTime) {
        this.startTimeUs = startTime;
    }
    setDuration(duration) {
        this.durationUs = duration;
    }
    /**
     * Calculates and assigns the duration and start time of the trace using the measure performance
     * entry.
     */
    calculateTraceMetrics() {
        const perfMeasureEntries = this.api.getEntriesByName(this.traceMeasure);
        const perfMeasureEntry = perfMeasureEntries && perfMeasureEntries[0];
        if (perfMeasureEntry) {
            this.durationUs = Math.floor(perfMeasureEntry.duration * 1000);
            this.startTimeUs = Math.floor((perfMeasureEntry.startTime + this.api.getTimeOrigin()) * 1000);
        }
    }
    /**
     * @param navigationTimings A single element array which contains the navigationTIming object of
     * the page load
     * @param paintTimings A array which contains paintTiming object of the page load
     * @param firstInputDelay First input delay in millisec
     */
    static createOobTrace(performanceController, navigationTimings, paintTimings, webVitalMetrics, firstInputDelay) {
        const route = Api.getInstance().getUrl();
        if (!route) {
            return;
        }
        const trace = new Trace(performanceController, OOB_TRACE_PAGE_LOAD_PREFIX + route, true);
        const timeOriginUs = Math.floor(Api.getInstance().getTimeOrigin() * 1000);
        trace.setStartTime(timeOriginUs);
        // navigationTimings includes only one element.
        if (navigationTimings && navigationTimings[0]) {
            trace.setDuration(Math.floor(navigationTimings[0].duration * 1000));
            trace.putMetric('domInteractive', Math.floor(navigationTimings[0].domInteractive * 1000));
            trace.putMetric('domContentLoadedEventEnd', Math.floor(navigationTimings[0].domContentLoadedEventEnd * 1000));
            trace.putMetric('loadEventEnd', Math.floor(navigationTimings[0].loadEventEnd * 1000));
        }
        const FIRST_PAINT = 'first-paint';
        const FIRST_CONTENTFUL_PAINT = 'first-contentful-paint';
        if (paintTimings) {
            const firstPaint = paintTimings.find(paintObject => paintObject.name === FIRST_PAINT);
            if (firstPaint && firstPaint.startTime) {
                trace.putMetric(FIRST_PAINT_COUNTER_NAME, Math.floor(firstPaint.startTime * 1000));
            }
            const firstContentfulPaint = paintTimings.find(paintObject => paintObject.name === FIRST_CONTENTFUL_PAINT);
            if (firstContentfulPaint && firstContentfulPaint.startTime) {
                trace.putMetric(FIRST_CONTENTFUL_PAINT_COUNTER_NAME, Math.floor(firstContentfulPaint.startTime * 1000));
            }
            if (firstInputDelay) {
                trace.putMetric(FIRST_INPUT_DELAY_COUNTER_NAME, Math.floor(firstInputDelay * 1000));
            }
        }
        this.addWebVitalMetric(trace, LARGEST_CONTENTFUL_PAINT_METRIC_NAME, LARGEST_CONTENTFUL_PAINT_ATTRIBUTE_NAME, webVitalMetrics.lcp);
        this.addWebVitalMetric(trace, CUMULATIVE_LAYOUT_SHIFT_METRIC_NAME, CUMULATIVE_LAYOUT_SHIFT_ATTRIBUTE_NAME, webVitalMetrics.cls);
        this.addWebVitalMetric(trace, INTERACTION_TO_NEXT_PAINT_METRIC_NAME, INTERACTION_TO_NEXT_PAINT_ATTRIBUTE_NAME, webVitalMetrics.inp);
        // Page load logs are sent at unload time and so should be logged and
        // flushed immediately.
        logTrace(trace);
        flushLogs();
    }
    static addWebVitalMetric(trace, metricKey, attributeKey, metric) {
        if (metric) {
            trace.putMetric(metricKey, Math.floor(metric.value * 1000));
            if (metric.elementAttribution) {
                if (metric.elementAttribution.length > MAX_ATTRIBUTE_VALUE_LENGTH) {
                    trace.putAttribute(attributeKey, metric.elementAttribution.substring(0, MAX_ATTRIBUTE_VALUE_LENGTH));
                }
                else {
                    trace.putAttribute(attributeKey, metric.elementAttribution);
                }
            }
        }
    }
    static createUserTimingTrace(performanceController, measureName) {
        const trace = new Trace(performanceController, measureName, false, measureName);
        logTrace(trace);
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
let webVitalMetrics = {};
let sentPageLoadTrace = false;
let firstInputDelay;
function setupOobResources(performanceController) {
    // Do not initialize unless iid is available.
    if (!getIid()) {
        return;
    }
    // The load event might not have fired yet, and that means performance
    // navigation timing object has a duration of 0. The setup should run after
    // all current tasks in js queue.
    setTimeout(() => setupOobTraces(performanceController), 0);
    setTimeout(() => setupNetworkRequests(performanceController), 0);
    setTimeout(() => setupUserTimingTraces(performanceController), 0);
}
function setupNetworkRequests(performanceController) {
    const api = Api.getInstance();
    const resources = api.getEntriesByType('resource');
    for (const resource of resources) {
        createNetworkRequestEntry(performanceController, resource);
    }
    api.setupObserver('resource', entry => createNetworkRequestEntry(performanceController, entry));
}
function setupOobTraces(performanceController) {
    const api = Api.getInstance();
    // Better support for Safari
    if ('onpagehide' in window) {
        api.document.addEventListener('pagehide', () => sendOobTrace(performanceController));
    }
    else {
        api.document.addEventListener('unload', () => sendOobTrace(performanceController));
    }
    api.document.addEventListener('visibilitychange', () => {
        if (api.document.visibilityState === 'hidden') {
            sendOobTrace(performanceController);
        }
    });
    if (api.onFirstInputDelay) {
        api.onFirstInputDelay((fid) => {
            firstInputDelay = fid;
        });
    }
    api.onLCP((metric) => {
        webVitalMetrics.lcp = {
            value: metric.value,
            elementAttribution: metric.attribution?.element
        };
    });
    api.onCLS((metric) => {
        webVitalMetrics.cls = {
            value: metric.value,
            elementAttribution: metric.attribution?.largestShiftTarget
        };
    });
    api.onINP((metric) => {
        webVitalMetrics.inp = {
            value: metric.value,
            elementAttribution: metric.attribution?.interactionTarget
        };
    });
}
function setupUserTimingTraces(performanceController) {
    const api = Api.getInstance();
    // Run through the measure performance entries collected up to this point.
    const measures = api.getEntriesByType('measure');
    for (const measure of measures) {
        createUserTimingTrace(performanceController, measure);
    }
    // Setup an observer to capture the measures from this point on.
    api.setupObserver('measure', entry => createUserTimingTrace(performanceController, entry));
}
function createUserTimingTrace(performanceController, measure) {
    const measureName = measure.name;
    // Do not create a trace, if the user timing marks and measures are created by
    // the sdk itself.
    if (measureName.substring(0, TRACE_MEASURE_PREFIX.length) ===
        TRACE_MEASURE_PREFIX) {
        return;
    }
    Trace.createUserTimingTrace(performanceController, measureName);
}
function sendOobTrace(performanceController) {
    if (!sentPageLoadTrace) {
        sentPageLoadTrace = true;
        const api = Api.getInstance();
        const navigationTimings = api.getEntriesByType('navigation');
        const paintTimings = api.getEntriesByType('paint');
        // On page unload web vitals may be updated so queue the oob trace creation
        // so that these updates have time to be included.
        setTimeout(() => {
            Trace.createOobTrace(performanceController, navigationTimings, paintTimings, webVitalMetrics, firstInputDelay);
        }, 0);
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
class PerformanceController {
    constructor(app, installations) {
        this.app = app;
        this.installations = installations;
        this.initialized = false;
    }
    /**
     * This method *must* be called internally as part of creating a
     * PerformanceController instance.
     *
     * Currently it's not possible to pass the settings object through the
     * constructor using Components, so this method exists to be called with the
     * desired settings, to ensure nothing is collected without the user's
     * consent.
     */
    _init(settings) {
        if (this.initialized) {
            return;
        }
        if (settings?.dataCollectionEnabled !== undefined) {
            this.dataCollectionEnabled = settings.dataCollectionEnabled;
        }
        if (settings?.instrumentationEnabled !== undefined) {
            this.instrumentationEnabled = settings.instrumentationEnabled;
        }
        if (Api.getInstance().requiredApisAvailable()) {
            util.validateIndexedDBOpenable()
                .then(isAvailable => {
                if (isAvailable) {
                    setupTransportService();
                    getInitializationPromise(this).then(() => setupOobResources(this), () => setupOobResources(this));
                    this.initialized = true;
                }
            })
                .catch(error => {
                consoleLogger.info(`Environment doesn't support IndexedDB: ${error}`);
            });
        }
        else {
            consoleLogger.info('Firebase Performance cannot start if the browser does not support ' +
                '"Fetch" and "Promise", or cookies are disabled.');
        }
    }
    set instrumentationEnabled(val) {
        SettingsService.getInstance().instrumentationEnabled = val;
    }
    get instrumentationEnabled() {
        return SettingsService.getInstance().instrumentationEnabled;
    }
    set dataCollectionEnabled(val) {
        SettingsService.getInstance().dataCollectionEnabled = val;
    }
    get dataCollectionEnabled() {
        return SettingsService.getInstance().dataCollectionEnabled;
    }
}

/**
 * The Firebase Performance Monitoring Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */
const DEFAULT_ENTRY_NAME = '[DEFAULT]';
/**
 * Returns a {@link FirebasePerformance} instance for the given app.
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @public
 */
function getPerformance(app$1 = app.getApp()) {
    app$1 = util.getModularInstance(app$1);
    const provider = app._getProvider(app$1, 'performance');
    const perfInstance = provider.getImmediate();
    return perfInstance;
}
/**
 * Returns a {@link FirebasePerformance} instance for the given app. Can only be called once.
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param settings - Optional settings for the {@link FirebasePerformance} instance.
 * @public
 */
function initializePerformance(app$1, settings) {
    app$1 = util.getModularInstance(app$1);
    const provider = app._getProvider(app$1, 'performance');
    // throw if an instance was already created.
    // It could happen if initializePerformance() is called more than once, or getPerformance() is called first.
    if (provider.isInitialized()) {
        const existingInstance = provider.getImmediate();
        const initialSettings = provider.getOptions();
        if (util.deepEqual(initialSettings, settings ?? {})) {
            return existingInstance;
        }
        else {
            throw ERROR_FACTORY.create("already initialized" /* ErrorCode.ALREADY_INITIALIZED */);
        }
    }
    const perfInstance = provider.initialize({
        options: settings
    });
    return perfInstance;
}
/**
 * Returns a new `PerformanceTrace` instance.
 * @param performance - The {@link FirebasePerformance} instance to use.
 * @param name - The name of the trace.
 * @public
 */
function trace(performance, name) {
    performance = util.getModularInstance(performance);
    return new Trace(performance, name);
}
const factory = (container, { options: settings }) => {
    // Dependencies
    const app = container.getProvider('app').getImmediate();
    const installations = container
        .getProvider('installations-internal')
        .getImmediate();
    if (app.name !== DEFAULT_ENTRY_NAME) {
        throw ERROR_FACTORY.create("FB not default" /* ErrorCode.FB_NOT_DEFAULT */);
    }
    if (typeof window === 'undefined') {
        throw ERROR_FACTORY.create("no window" /* ErrorCode.NO_WINDOW */);
    }
    setupApi(window);
    const perfInstance = new PerformanceController(app, installations);
    perfInstance._init(settings);
    return perfInstance;
};
function registerPerformance() {
    app._registerComponent(new component.Component('performance', factory, "PUBLIC" /* ComponentType.PUBLIC */));
    app.registerVersion(name, version);
    // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
    app.registerVersion(name, version, 'cjs2020');
}
registerPerformance();

exports.getPerformance = getPerformance;
exports.initializePerformance = initializePerformance;
exports.trace = trace;
//# sourceMappingURL=index.cjs.js.map
