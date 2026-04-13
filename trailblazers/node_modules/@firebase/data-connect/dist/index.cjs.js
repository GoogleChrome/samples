'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var app = require('@firebase/app');
var component = require('@firebase/component');
var util = require('@firebase/util');
var logger$1 = require('@firebase/logger');

const name = "@firebase/data-connect";
const version = "0.5.0";

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
/** The semver (www.semver.org) version of the SDK. */
let SDK_VERSION = '';
/**
 * SDK_VERSION should be set before any database instance is created
 * @internal
 */
function setSDKVersion(version) {
    SDK_VERSION = version;
}

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
const Code = {
    OTHER: 'other',
    ALREADY_INITIALIZED: 'already-initialized',
    NOT_INITIALIZED: 'not-initialized',
    NOT_SUPPORTED: 'not-supported',
    INVALID_ARGUMENT: 'invalid-argument',
    PARTIAL_ERROR: 'partial-error',
    UNAUTHORIZED: 'unauthorized'
};
/** An error returned by a DataConnect operation. */
class DataConnectError extends util.FirebaseError {
    constructor(code, message) {
        super(code, message);
        /** @internal */
        this.name = 'DataConnectError';
        // Ensure the instanceof operator works as expected on subclasses of Error.
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
        // and https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
        Object.setPrototypeOf(this, DataConnectError.prototype);
    }
    /** @internal */
    toString() {
        return `${this.name}[code=${this.code}]: ${this.message}`;
    }
}
/** An error returned by a DataConnect operation. */
class DataConnectOperationError extends DataConnectError {
    /** @hideconstructor */
    constructor(message, response) {
        super(Code.PARTIAL_ERROR, message);
        /** @internal */
        this.name = 'DataConnectOperationError';
        this.response = response;
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
class EntityDataObject {
    getServerValue(key) {
        return this.serverValues[key];
    }
    constructor(globalID) {
        this.globalID = globalID;
        this.serverValues = {};
        this.referencedFrom = new Set();
    }
    getServerValues() {
        return this.serverValues;
    }
    toJSON() {
        return {
            globalID: this.globalID,
            map: this.serverValues,
            referencedFrom: Array.from(this.referencedFrom)
        };
    }
    static fromJSON(json) {
        const edo = new EntityDataObject(json.globalID);
        edo.serverValues = json.map;
        edo.referencedFrom = new Set(json.referencedFrom);
        return edo;
    }
    updateServerValue(key, value, requestedFrom) {
        this.serverValues[key] = value;
        this.referencedFrom.add(requestedFrom);
        return Array.from(this.referencedFrom);
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
class InMemoryCacheProvider {
    constructor(_keyId) {
        this._keyId = _keyId;
        this.edos = new Map();
        this.resultTrees = new Map();
    }
    async setResultTree(queryId, rt) {
        this.resultTrees.set(queryId, rt);
    }
    async getResultTree(queryId) {
        return this.resultTrees.get(queryId);
    }
    async updateEntityData(entityData) {
        this.edos.set(entityData.globalID, entityData);
    }
    async getEntityData(globalId) {
        if (!this.edos.has(globalId)) {
            this.edos.set(globalId, new EntityDataObject(globalId));
        }
        // Because of the above, we can guarantee that there will be an EDO at the globalId.
        return this.edos.get(globalId);
    }
    close() {
        // No-op
        return Promise.resolve();
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
const GLOBAL_ID_KEY = '_id';
const OBJECT_LISTS_KEY = '_objectLists';
const REFERENCES_KEY = '_references';
const SCALARS_KEY = '_scalars';
const ENTITY_DATA_KEYS_KEY = '_entity_data_keys';
class EntityNode {
    constructor() {
        this.scalars = {};
        this.references = {};
        this.objectLists = {};
        this.entityDataKeys = new Set();
    }
    async loadData(queryId, values, entityIds, acc, cacheProvider) {
        if (values === undefined) {
            return;
        }
        if (typeof values !== 'object' || Array.isArray(values)) {
            throw new DataConnectError(Code.INVALID_ARGUMENT, 'EntityNode initialized with non-object value');
        }
        if (values === null) {
            return;
        }
        if (typeof values === 'object' &&
            entityIds &&
            entityIds[GLOBAL_ID_KEY] &&
            typeof entityIds[GLOBAL_ID_KEY] === 'string') {
            this.globalId = entityIds[GLOBAL_ID_KEY];
            this.entityData = await cacheProvider.getEntityData(this.globalId);
        }
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                if (typeof values[key] === 'object') {
                    if (Array.isArray(values[key])) {
                        const ids = entityIds && entityIds[key];
                        const objArray = [];
                        const scalarArray = [];
                        for (const [index, value] of values[key].entries()) {
                            if (typeof value === 'object') {
                                if (Array.isArray(value)) ;
                                else {
                                    const entityNode = new EntityNode();
                                    await entityNode.loadData(queryId, value, ids && ids[index], acc, cacheProvider);
                                    objArray.push(entityNode);
                                }
                            }
                            else {
                                scalarArray.push(value);
                            }
                        }
                        if (scalarArray.length > 0 && objArray.length > 0) {
                            this.scalars[key] = values[key];
                        }
                        else if (scalarArray.length > 0) {
                            if (this.entityData) {
                                const impactedRefs = this.entityData.updateServerValue(key, scalarArray, queryId);
                                this.entityDataKeys.add(key);
                                acc.add(impactedRefs);
                            }
                            else {
                                this.scalars[key] = scalarArray;
                            }
                        }
                        else if (objArray.length > 0) {
                            this.objectLists[key] = objArray;
                        }
                        else {
                            this.scalars[key] = [];
                        }
                    }
                    else {
                        if (values[key] === null) {
                            this.scalars[key] = null;
                            continue;
                        }
                        const entityNode = new EntityNode();
                        // TODO: Load Data might need to be pushed into ResultTreeProcessor instead.
                        await entityNode.loadData(queryId, values[key], entityIds && entityIds[key], acc, cacheProvider);
                        this.references[key] = entityNode;
                    }
                }
                else {
                    if (this.entityData) {
                        const impactedRefs = this.entityData.updateServerValue(key, values[key], queryId);
                        this.entityDataKeys.add(key);
                        acc.add(impactedRefs);
                    }
                    else {
                        this.scalars[key] = values[key];
                    }
                }
            }
        }
        if (this.entityData) {
            await cacheProvider.updateEntityData(this.entityData);
        }
    }
    toJSON(mode) {
        const resultObject = {};
        if (mode === EncodingMode.hydrated) {
            if (this.entityData) {
                for (const key of this.entityDataKeys) {
                    resultObject[key] = this.entityData.getServerValue(key);
                }
            }
            if (this.scalars) {
                Object.assign(resultObject, this.scalars);
            }
            if (this.references) {
                for (const key in this.references) {
                    if (this.references.hasOwnProperty(key)) {
                        resultObject[key] = this.references[key].toJSON(mode);
                    }
                }
            }
            if (this.objectLists) {
                for (const key in this.objectLists) {
                    if (this.objectLists.hasOwnProperty(key)) {
                        resultObject[key] = this.objectLists[key].map(obj => obj.toJSON(mode));
                    }
                }
            }
            return resultObject;
        }
        else {
            // Get JSON representation of dehydrated list
            if (this.entityData) {
                resultObject[GLOBAL_ID_KEY] = this.entityData.globalID;
            }
            resultObject[ENTITY_DATA_KEYS_KEY] = Array.from(this.entityDataKeys);
            if (this.scalars) {
                resultObject[SCALARS_KEY] = this.scalars;
            }
            if (this.references) {
                const references = {};
                for (const key in this.references) {
                    if (this.references.hasOwnProperty(key)) {
                        references[key] = this.references[key].toJSON(mode);
                    }
                }
                resultObject[REFERENCES_KEY] = references;
            }
            if (this.objectLists) {
                const objectLists = {};
                for (const key in this.objectLists) {
                    if (this.objectLists.hasOwnProperty(key)) {
                        objectLists[key] = this.objectLists[key].map(obj => obj.toJSON(mode));
                    }
                }
                resultObject[OBJECT_LISTS_KEY] = objectLists;
            }
        }
        return resultObject;
    }
    static fromJson(obj) {
        const sdo = new EntityNode();
        if (obj.backingData) {
            sdo.entityData = EntityDataObject.fromJSON(obj.backingData);
        }
        sdo.globalId = obj.globalID;
        sdo.scalars = obj.scalars;
        if (obj.references) {
            const references = {};
            for (const key in obj.references) {
                if (obj.references.hasOwnProperty(key)) {
                    references[key] = EntityNode.fromJson(obj.references[key]);
                }
            }
            sdo.references = references;
        }
        if (obj.objectLists) {
            const objectLists = {};
            for (const key in obj.objectLists) {
                if (obj.objectLists.hasOwnProperty(key)) {
                    objectLists[key] = obj.objectLists[key].map(obj => EntityNode.fromJson(obj));
                }
            }
            sdo.objectLists = objectLists;
        }
        return sdo;
    }
}
// Helpful for storing in persistent cache, which is not available yet.
var EncodingMode;
(function (EncodingMode) {
    EncodingMode[EncodingMode["hydrated"] = 0] = "hydrated";
    EncodingMode[EncodingMode["dehydrated"] = 1] = "dehydrated";
})(EncodingMode || (EncodingMode = {}));

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
class ResultTree {
    /**
     * Create a {@link ResultTree} from a dehydrated JSON object.
     * @param value The dehydrated JSON object.
     * @returns The {@link ResultTree}.
     */
    static fromJson(value) {
        return new ResultTree(EntityNode.fromJson(value.rootStub), value.maxAge, value.cachedAt, value.lastAccessed);
    }
    constructor(rootStub, maxAge = 0, cachedAt, _lastAccessed) {
        this.rootStub = rootStub;
        this.maxAge = maxAge;
        this.cachedAt = cachedAt;
        this._lastAccessed = _lastAccessed;
    }
    isStale() {
        return (Date.now() - new Date(this.cachedAt.getTime()).getTime() >
            this.maxAge * 1000);
    }
    updateMaxAge(maxAgeInSeconds) {
        this.maxAge = maxAgeInSeconds;
    }
    updateAccessed() {
        this._lastAccessed = new Date();
    }
    get lastAccessed() {
        return this._lastAccessed;
    }
    getRootStub() {
        return this.rootStub;
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
class ImpactedQueryRefsAccumulator {
    constructor(queryId) {
        this.queryId = queryId;
        this.impacted = new Set();
    }
    add(impacted) {
        impacted
            .filter(ref => ref !== this.queryId)
            .forEach(ref => this.impacted.add(ref));
    }
    consumeEvents() {
        const events = Array.from(this.impacted);
        this.impacted.clear();
        return events;
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
class ResultTreeProcessor {
    /**
     * Hydrate the EntityNode into a JSON object so that it can be returned to the user.
     * @param rootStubObject
     * @returns {string}
     */
    hydrateResults(rootStubObject) {
        return rootStubObject.toJSON(EncodingMode.hydrated);
    }
    /**
     * Dehydrate results so that they can be stored in the cache.
     * @param json
     * @param entityIds
     * @param cacheProvider
     * @param queryId
     * @returns {Promise<DehydratedResults>}
     */
    async dehydrateResults(json, entityIds, cacheProvider, queryId) {
        const acc = new ImpactedQueryRefsAccumulator(queryId);
        const entityNode = new EntityNode();
        await entityNode.loadData(queryId, json, entityIds, acc, cacheProvider);
        return {
            entityNode,
            impacted: acc.consumeEvents()
        };
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
class DataConnectCache {
    constructor(authProvider, projectId, connectorConfig, host, cacheSettings) {
        this.authProvider = authProvider;
        this.projectId = projectId;
        this.connectorConfig = connectorConfig;
        this.host = host;
        this.cacheSettings = cacheSettings;
        this.cacheProvider = null;
        this.uid = null;
        this.authProvider.addTokenChangeListener(async (_) => {
            const newUid = this.authProvider.getAuth().getUid();
            // We should only close if the token changes and so does the new UID
            if (this.uid !== newUid) {
                this.cacheProvider?.close();
                this.uid = newUid;
                const identifier = await this.getIdentifier(this.uid);
                this.cacheProvider = this.initializeNewProviders(identifier);
            }
        });
    }
    async initialize() {
        if (!this.cacheProvider) {
            const identifier = await this.getIdentifier(this.uid);
            this.cacheProvider = this.initializeNewProviders(identifier);
        }
    }
    async getIdentifier(uid) {
        const identifier = `${'memory' // TODO: replace this with indexeddb when persistence is available.
        }-${this.projectId}-${this.connectorConfig.service}-${this.connectorConfig.connector}-${this.connectorConfig.location}-${uid}-${this.host}`;
        const sha256 = await util.generateSHA256Hash(identifier);
        return sha256;
    }
    initializeNewProviders(identifier) {
        return this.cacheSettings.cacheProvider.initialize(identifier);
    }
    async containsResultTree(queryId) {
        await this.initialize();
        const resultTree = await this.cacheProvider.getResultTree(queryId);
        return resultTree !== undefined;
    }
    async getResultTree(queryId) {
        await this.initialize();
        return this.cacheProvider.getResultTree(queryId);
    }
    async getResultJSON(queryId) {
        await this.initialize();
        const processor = new ResultTreeProcessor();
        const cacheProvider = this.cacheProvider;
        const resultTree = await cacheProvider.getResultTree(queryId);
        if (!resultTree) {
            throw new DataConnectError(Code.INVALID_ARGUMENT, `${queryId} not found in cache. Call "update()" first.`);
        }
        return processor.hydrateResults(resultTree.getRootStub());
    }
    async update(queryId, serverValues, entityIds) {
        await this.initialize();
        const processor = new ResultTreeProcessor();
        const cacheProvider = this.cacheProvider;
        const { entityNode: stubDataObject, impacted } = await processor.dehydrateResults(serverValues, entityIds, cacheProvider, queryId);
        const now = new Date();
        await cacheProvider.setResultTree(queryId, new ResultTree(stubDataObject, serverValues.maxAge || this.cacheSettings.maxAgeSeconds, now, now));
        return impacted;
    }
}
class MemoryStub {
    constructor() {
        this.type = 'MEMORY';
    }
    /**
     * @internal
     */
    initialize(cacheId) {
        return new InMemoryCacheProvider(cacheId);
    }
}

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
/**
 * @internal
 * Abstraction around AppCheck's token fetching capabilities.
 */
class AppCheckTokenProvider {
    constructor(app$1, appCheckProvider) {
        this.appCheckProvider = appCheckProvider;
        if (app._isFirebaseServerApp(app$1) && app$1.settings.appCheckToken) {
            this.serverAppAppCheckToken = app$1.settings.appCheckToken;
        }
        this.appCheck = appCheckProvider?.getImmediate({ optional: true });
        if (!this.appCheck) {
            void appCheckProvider
                ?.get()
                .then(appCheck => (this.appCheck = appCheck))
                .catch();
        }
    }
    getToken() {
        if (this.serverAppAppCheckToken) {
            return Promise.resolve({ token: this.serverAppAppCheckToken });
        }
        if (!this.appCheck) {
            return new Promise((resolve, reject) => {
                // Support delayed initialization of FirebaseAppCheck. This allows our
                // customers to initialize the RTDB SDK before initializing Firebase
                // AppCheck and ensures that all requests are authenticated if a token
                // becomes available before the timoeout below expires.
                setTimeout(() => {
                    if (this.appCheck) {
                        this.getToken().then(resolve, reject);
                    }
                    else {
                        resolve(null);
                    }
                }, 0);
            });
        }
        return this.appCheck.getToken();
    }
    addTokenChangeListener(listener) {
        void this.appCheckProvider
            ?.get()
            .then(appCheck => appCheck.addTokenListener(listener));
    }
}

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
const logger = new logger$1.Logger('@firebase/data-connect');
function setLogLevel(logLevel) {
    logger.setLogLevel(logLevel);
}
function logDebug(msg) {
    logger.debug(`DataConnect (${SDK_VERSION}): ${msg}`);
}
function logError(msg) {
    logger.error(`DataConnect (${SDK_VERSION}): ${msg}`);
}

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
// @internal
class FirebaseAuthProvider {
    constructor(_appName, _options, _authProvider) {
        this._appName = _appName;
        this._options = _options;
        this._authProvider = _authProvider;
        this._auth = _authProvider.getImmediate({ optional: true });
        if (!this._auth) {
            _authProvider.onInit(auth => (this._auth = auth));
        }
    }
    getAuth() {
        return this._auth;
    }
    getToken(forceRefresh) {
        if (!this._auth) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (this._auth) {
                        this.getToken(forceRefresh).then(resolve, reject);
                    }
                    else {
                        resolve(null);
                    }
                }, 0);
            });
        }
        return this._auth.getToken(forceRefresh).catch(error => {
            if (error && error.code === 'auth/token-not-initialized') {
                logDebug('Got auth/token-not-initialized error.  Treating as null token.');
                return null;
            }
            else {
                logError('Error received when attempting to retrieve token: ' +
                    JSON.stringify(error));
                return Promise.reject(error);
            }
        });
    }
    addTokenChangeListener(listener) {
        this._auth?.addAuthTokenListener(listener);
    }
    removeTokenChangeListener(listener) {
        this._authProvider
            .get()
            .then(auth => auth.removeAuthTokenListener(listener))
            .catch(err => logError(err));
    }
}

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
const QUERY_STR = 'query';
const MUTATION_STR = 'mutation';
const SOURCE_SERVER = 'SERVER';
const SOURCE_CACHE = 'CACHE';

/**
 * @license
 * Copyright 2026 Google LLC
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
function parseEntityIds(result) {
    // Iterate through extensions.dataConnect
    const dataConnectExtensions = result.extensions?.dataConnect;
    const dataCopy = Object.assign(result);
    if (!dataConnectExtensions) {
        return dataCopy;
    }
    const ret = {};
    for (const extension of dataConnectExtensions) {
        const { path } = extension;
        populatePath(path, ret, extension);
    }
    return ret;
}
// mutates the object to update the path
function populatePath(path, toUpdate, extension) {
    let curObj = toUpdate;
    for (const slice of path) {
        if (typeof curObj[slice] !== 'object') {
            curObj[slice] = {};
        }
        curObj = curObj[slice];
    }
    if ('entityId' in extension && extension.entityId) {
        curObj['_id'] = extension.entityId;
    }
    else if ('entityIds' in extension) {
        const entityArr = extension.entityIds;
        for (let i = 0; i < entityArr.length; i++) {
            const entityId = entityArr[i];
            if (typeof curObj[i] === 'undefined') {
                curObj[i] = {};
            }
            curObj[i]._id = entityId;
        }
    }
}

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
let encoderImpl;
let decoderImpl;
function setEncoder(encoder) {
    encoderImpl = encoder;
}
function setDecoder(decoder) {
    decoderImpl = decoder;
}
function sortKeysForObj(o) {
    return Object.keys(o)
        .sort()
        .reduce((accumulator, currentKey) => {
        accumulator[currentKey] = o[currentKey];
        return accumulator;
    }, {});
}
setEncoder((o) => JSON.stringify(sortKeysForObj(o)));
setDecoder(s => sortKeysForObj(JSON.parse(s)));

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
function getRefSerializer(queryRef, data, source, fetchTime) {
    return function toJSON() {
        return {
            data,
            refInfo: {
                name: queryRef.name,
                variables: queryRef.variables,
                connectorConfig: {
                    projectId: queryRef.dataConnect.app.options.projectId,
                    ...queryRef.dataConnect.getSettings()
                }
            },
            fetchTime,
            source
        };
    };
}
class QueryManager {
    async preferCacheResults(queryRef, allowStale = false) {
        let cacheResult;
        try {
            cacheResult = await this.fetchCacheResults(queryRef, allowStale);
        }
        catch (e) {
            // Ignore the error and try to fetch from the server.
        }
        if (cacheResult) {
            return cacheResult;
        }
        return this.fetchServerResults(queryRef);
    }
    constructor(transport, dc, cache) {
        this.transport = transport;
        this.dc = dc;
        this.cache = cache;
        this.callbacks = new Map();
        this.subscriptionCache = new Map();
        this.queue = [];
    }
    async waitForQueuedWrites() {
        for (const promise of this.queue) {
            await promise;
        }
        this.queue = [];
    }
    updateSSR(updatedData) {
        this.queue.push(this.updateCache(updatedData).then(async (result) => this.publishCacheResultsToSubscribers(result, updatedData.fetchTime)));
    }
    async updateCache(result, extensions) {
        await this.waitForQueuedWrites();
        if (this.cache) {
            const entityIds = parseEntityIds(result);
            const updatedMaxAge = getMaxAgeFromExtensions(extensions);
            if (updatedMaxAge !== undefined) {
                this.cache.cacheSettings.maxAgeSeconds = updatedMaxAge;
            }
            return this.cache.update(encoderImpl({
                name: result.ref.name,
                variables: result.ref.variables,
                refType: QUERY_STR
            }), result.data, entityIds);
        }
        else {
            const key = encoderImpl({
                name: result.ref.name,
                variables: result.ref.variables,
                refType: QUERY_STR
            });
            this.subscriptionCache.set(key, result);
            return [key];
        }
    }
    addSubscription(queryRef, onResultCallback, onCompleteCallback, onErrorCallback, initialCache) {
        const key = encoderImpl({
            name: queryRef.name,
            variables: queryRef.variables,
            refType: QUERY_STR
        });
        const unsubscribe = () => {
            if (this.callbacks.has(key)) {
                const callbackList = this.callbacks.get(key);
                this.callbacks.set(key, callbackList.filter(callback => callback !== subscription));
                onCompleteCallback?.();
            }
        };
        const subscription = {
            userCallback: onResultCallback,
            errCallback: onErrorCallback,
            unsubscribe
        };
        if (initialCache) {
            this.updateSSR(initialCache);
        }
        const promise = this.preferCacheResults(queryRef, /*allowStale=*/ true);
        // We want to ignore the error and let subscriptions handle it
        promise.then(undefined, err => { });
        if (!this.callbacks.has(key)) {
            this.callbacks.set(key, []);
        }
        this.callbacks
            .get(key)
            .push(subscription);
        return unsubscribe;
    }
    async fetchServerResults(queryRef) {
        await this.waitForQueuedWrites();
        const key = encoderImpl({
            name: queryRef.name,
            variables: queryRef.variables,
            refType: QUERY_STR
        });
        try {
            const result = await this.transport.invokeQuery(queryRef.name, queryRef.variables);
            const fetchTime = Date.now().toString();
            const originalExtensions = result.extensions;
            const queryResult = {
                ...result,
                ref: queryRef,
                source: SOURCE_SERVER,
                fetchTime,
                data: result.data,
                extensions: getDataConnectExtensionsWithoutMaxAge(originalExtensions),
                toJSON: getRefSerializer(queryRef, result.data, SOURCE_SERVER, fetchTime)
            };
            let updatedKeys = [];
            updatedKeys = await this.updateCache(queryResult, originalExtensions?.dataConnect);
            this.publishDataToSubscribers(key, queryResult);
            if (this.cache) {
                await this.publishCacheResultsToSubscribers(updatedKeys, fetchTime);
            }
            else {
                this.subscriptionCache.set(key, queryResult);
            }
            return queryResult;
        }
        catch (e) {
            this.publishErrorToSubscribers(key, e);
            throw e;
        }
    }
    async fetchCacheResults(queryRef, allowStale = false) {
        await this.waitForQueuedWrites();
        let result;
        if (!this.cache) {
            result = await this.getFromSubscriberCache(queryRef);
        }
        else {
            result = await this.getFromResultTreeCache(queryRef, allowStale);
        }
        if (!result) {
            throw new DataConnectError(Code.OTHER, 'No cache entry found for query: ' + queryRef.name);
        }
        const fetchTime = Date.now().toString();
        const queryResult = {
            ...result,
            ref: queryRef,
            source: SOURCE_CACHE,
            fetchTime,
            data: result.data,
            extensions: result.extensions,
            toJSON: getRefSerializer(queryRef, result.data, SOURCE_CACHE, fetchTime)
        };
        if (this.cache) {
            const key = encoderImpl({
                name: queryRef.name,
                variables: queryRef.variables,
                refType: QUERY_STR
            });
            await this.publishCacheResultsToSubscribers([key], fetchTime);
        }
        else {
            const key = encoderImpl({
                name: queryRef.name,
                variables: queryRef.variables,
                refType: QUERY_STR
            });
            this.subscriptionCache.set(key, queryResult);
            this.publishDataToSubscribers(key, queryResult);
        }
        return queryResult;
    }
    publishErrorToSubscribers(key, err) {
        this.callbacks.get(key)?.forEach(subscription => {
            if (subscription.errCallback) {
                subscription.errCallback(err);
            }
        });
    }
    async getFromResultTreeCache(queryRef, allowStale = false) {
        const key = encoderImpl({
            name: queryRef.name,
            variables: queryRef.variables,
            refType: QUERY_STR
        });
        if (!this.cache || !(await this.cache.containsResultTree(key))) {
            return null;
        }
        const cacheResult = (await this.cache.getResultJSON(key));
        const resultTree = await this.cache.getResultTree(key);
        if (!allowStale && resultTree.isStale()) {
            return null;
        }
        const result = {
            source: SOURCE_CACHE,
            ref: queryRef,
            data: cacheResult,
            toJSON: getRefSerializer(queryRef, cacheResult, SOURCE_CACHE, resultTree.cachedAt.toString()),
            fetchTime: resultTree.cachedAt.toString()
        };
        (await this.cache.getResultTree(key)).updateAccessed();
        return result;
    }
    async getFromSubscriberCache(queryRef) {
        const key = encoderImpl({
            name: queryRef.name,
            variables: queryRef.variables,
            refType: QUERY_STR
        });
        if (!this.subscriptionCache.has(key)) {
            return;
        }
        const result = this.subscriptionCache.get(key);
        result.source = SOURCE_CACHE;
        result.toJSON = getRefSerializer(result.ref, result.data, SOURCE_CACHE, result.fetchTime);
        return result;
    }
    publishDataToSubscribers(key, queryResult) {
        if (!this.callbacks.has(key)) {
            return;
        }
        const subscribers = this.callbacks.get(key);
        subscribers.forEach(callback => {
            callback.userCallback(queryResult);
        });
    }
    async publishCacheResultsToSubscribers(impactedQueries, fetchTime) {
        if (!this.cache) {
            return;
        }
        for (const query of impactedQueries) {
            const callbacks = this.callbacks.get(query);
            if (!callbacks) {
                continue;
            }
            const newJson = (await this.cache.getResultTree(query))
                .getRootStub()
                .toJSON(EncodingMode.hydrated);
            const { name, variables } = decoderImpl(query);
            const queryRef = {
                dataConnect: this.dc,
                refType: QUERY_STR,
                name,
                variables
            };
            this.publishDataToSubscribers(query, {
                data: newJson,
                fetchTime,
                ref: queryRef,
                source: SOURCE_CACHE,
                toJSON: getRefSerializer(queryRef, newJson, SOURCE_CACHE, fetchTime)
            });
        }
    }
    enableEmulator(host, port) {
        this.transport.useEmulator(host, port);
    }
}
function getMaxAgeFromExtensions(extensions) {
    if (!extensions) {
        return;
    }
    for (const extension of extensions) {
        if ('maxAge' in extension &&
            extension.maxAge !== undefined &&
            extension.maxAge !== null) {
            if (extension.maxAge.endsWith('s')) {
                return Number(extension.maxAge.substring(0, extension.maxAge.length - 1));
            }
        }
    }
}
function getDataConnectExtensionsWithoutMaxAge(extensions) {
    return {
        dataConnect: extensions.dataConnect?.filter(extension => 'entityId' in extension || 'entityIds' in extension)
    };
}

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
const CallerSdkTypeEnum = {
    Base: 'Base', // Core JS SDK
    Generated: 'Generated', // Generated JS SDK
    TanstackReactCore: 'TanstackReactCore', // Tanstack non-generated React SDK
    GeneratedReact: 'GeneratedReact', // Tanstack non-generated Angular SDK
    TanstackAngularCore: 'TanstackAngularCore', // Tanstack non-generated Angular SDK
    GeneratedAngular: 'GeneratedAngular' // Generated Angular SDK
};

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
const PROD_HOST = 'firebasedataconnect.googleapis.com';
function urlBuilder(projectConfig, transportOptions) {
    const { connector, location, projectId: project, service } = projectConfig;
    const { host, sslEnabled, port } = transportOptions;
    const protocol = sslEnabled ? 'https' : 'http';
    const realHost = host || PROD_HOST;
    let baseUrl = `${protocol}://${realHost}`;
    if (typeof port === 'number') {
        baseUrl += `:${port}`;
    }
    else if (typeof port !== 'undefined') {
        logError('Port type is of an invalid type');
        throw new DataConnectError(Code.INVALID_ARGUMENT, 'Incorrect type for port passed in!');
    }
    return `${baseUrl}/v1/projects/${project}/locations/${location}/services/${service}/connectors/${connector}`;
}
function addToken(url, apiKey) {
    if (!apiKey) {
        return url;
    }
    const newUrl = new URL(url);
    newUrl.searchParams.append('key', apiKey);
    return newUrl.toString();
}

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
let connectFetch = globalThis.fetch;
function getGoogApiClientValue(_isUsingGen, _callerSdkType) {
    let str = 'gl-js/ fire/' + SDK_VERSION;
    if (_callerSdkType !== CallerSdkTypeEnum.Base &&
        _callerSdkType !== CallerSdkTypeEnum.Generated) {
        str += ' js/' + _callerSdkType.toLowerCase();
    }
    else if (_isUsingGen || _callerSdkType === CallerSdkTypeEnum.Generated) {
        str += ' js/gen';
    }
    return str;
}
async function dcFetch(url, body, { signal }, appId, accessToken, appCheckToken, _isUsingGen, _callerSdkType, _isUsingEmulator) {
    if (!connectFetch) {
        throw new DataConnectError(Code.OTHER, 'No Fetch Implementation detected!');
    }
    const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Client': getGoogApiClientValue(_isUsingGen, _callerSdkType)
    };
    if (accessToken) {
        headers['X-Firebase-Auth-Token'] = accessToken;
    }
    if (appId) {
        headers['x-firebase-gmpid'] = appId;
    }
    if (appCheckToken) {
        headers['X-Firebase-AppCheck'] = appCheckToken;
    }
    const bodyStr = JSON.stringify(body);
    const fetchOptions = {
        body: bodyStr,
        method: 'POST',
        headers,
        signal
    };
    if (util.isCloudWorkstation(url) && _isUsingEmulator) {
        fetchOptions.credentials = 'include';
    }
    let response;
    try {
        response = await connectFetch(url, fetchOptions);
    }
    catch (err) {
        throw new DataConnectError(Code.OTHER, 'Failed to fetch: ' + JSON.stringify(err));
    }
    let jsonResponse;
    try {
        jsonResponse = await response.json();
    }
    catch (e) {
        throw new DataConnectError(Code.OTHER, JSON.stringify(e));
    }
    const message = getErrorMessage(jsonResponse);
    if (response.status >= 400) {
        logError('Error while performing request: ' + JSON.stringify(jsonResponse));
        if (response.status === 401) {
            throw new DataConnectError(Code.UNAUTHORIZED, message);
        }
        throw new DataConnectError(Code.OTHER, message);
    }
    if (jsonResponse.errors && jsonResponse.errors.length) {
        const stringified = JSON.stringify(jsonResponse.errors);
        const failureResponse = {
            errors: jsonResponse.errors,
            data: jsonResponse.data
        };
        throw new DataConnectOperationError('DataConnect error while performing request: ' + stringified, failureResponse);
    }
    if (!jsonResponse.extensions) {
        jsonResponse.extensions = {
            dataConnect: []
        };
    }
    return jsonResponse;
}
function getErrorMessage(obj) {
    if ('message' in obj && obj.message) {
        return obj.message;
    }
    return JSON.stringify(obj);
}

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
class RESTTransport {
    constructor(options, apiKey, appId, authProvider, appCheckProvider, transportOptions, _isUsingGen = false, _callerSdkType = CallerSdkTypeEnum.Base) {
        this.apiKey = apiKey;
        this.appId = appId;
        this.authProvider = authProvider;
        this.appCheckProvider = appCheckProvider;
        this._isUsingGen = _isUsingGen;
        this._callerSdkType = _callerSdkType;
        this._host = '';
        this._location = 'l';
        this._connectorName = '';
        this._secure = true;
        this._project = 'p';
        this._accessToken = null;
        this._appCheckToken = null;
        this._lastToken = null;
        this._isUsingEmulator = false;
        // TODO(mtewani): Update U to include shape of body defined in line 13.
        this.invokeQuery = (queryName, body) => {
            const abortController = new AbortController();
            // TODO(mtewani): Update to proper value
            const withAuth = this.withRetry(() => dcFetch(addToken(`${this.endpointUrl}:executeQuery`, this.apiKey), {
                name: `projects/${this._project}/locations/${this._location}/services/${this._serviceName}/connectors/${this._connectorName}`,
                operationName: queryName,
                variables: body
            }, abortController, this.appId, this._accessToken, this._appCheckToken, this._isUsingGen, this._callerSdkType, this._isUsingEmulator));
            return withAuth;
        };
        this.invokeMutation = (mutationName, body) => {
            const abortController = new AbortController();
            const taskResult = this.withRetry(() => {
                return dcFetch(addToken(`${this.endpointUrl}:executeMutation`, this.apiKey), {
                    name: `projects/${this._project}/locations/${this._location}/services/${this._serviceName}/connectors/${this._connectorName}`,
                    operationName: mutationName,
                    variables: body
                }, abortController, this.appId, this._accessToken, this._appCheckToken, this._isUsingGen, this._callerSdkType, this._isUsingEmulator);
            });
            return taskResult;
        };
        if (transportOptions) {
            if (typeof transportOptions.port === 'number') {
                this._port = transportOptions.port;
            }
            if (typeof transportOptions.sslEnabled !== 'undefined') {
                this._secure = transportOptions.sslEnabled;
            }
            this._host = transportOptions.host;
        }
        const { location, projectId: project, connector, service } = options;
        if (location) {
            this._location = location;
        }
        if (project) {
            this._project = project;
        }
        this._serviceName = service;
        if (!connector) {
            throw new DataConnectError(Code.INVALID_ARGUMENT, 'Connector Name required!');
        }
        this._connectorName = connector;
        this.authProvider?.addTokenChangeListener(token => {
            logDebug(`New Token Available: ${token}`);
            this._accessToken = token;
        });
        this.appCheckProvider?.addTokenChangeListener(result => {
            const { token } = result;
            logDebug(`New App Check Token Available: ${token}`);
            this._appCheckToken = token;
        });
    }
    get endpointUrl() {
        return urlBuilder({
            connector: this._connectorName,
            location: this._location,
            projectId: this._project,
            service: this._serviceName
        }, { host: this._host, sslEnabled: this._secure, port: this._port });
    }
    useEmulator(host, port, isSecure) {
        this._host = host;
        this._isUsingEmulator = true;
        if (typeof port === 'number') {
            this._port = port;
        }
        if (typeof isSecure !== 'undefined') {
            this._secure = isSecure;
        }
    }
    onTokenChanged(newToken) {
        this._accessToken = newToken;
    }
    async getWithAuth(forceToken = false) {
        let starterPromise = new Promise(resolve => resolve(this._accessToken));
        if (this.appCheckProvider) {
            const appCheckToken = await this.appCheckProvider.getToken();
            if (appCheckToken) {
                this._appCheckToken = appCheckToken.token;
            }
        }
        if (this.authProvider) {
            starterPromise = this.authProvider
                .getToken(/*forceToken=*/ forceToken)
                .then(data => {
                if (!data) {
                    return null;
                }
                this._accessToken = data.accessToken;
                return this._accessToken;
            });
        }
        else {
            starterPromise = new Promise(resolve => resolve(''));
        }
        return starterPromise;
    }
    _setLastToken(lastToken) {
        this._lastToken = lastToken;
    }
    withRetry(promiseFactory, retry = false) {
        let isNewToken = false;
        return this.getWithAuth(retry)
            .then(res => {
            isNewToken = this._lastToken !== res;
            this._lastToken = res;
            return res;
        })
            .then(promiseFactory)
            .catch(err => {
            // Only retry if the result is unauthorized and the last token isn't the same as the new one.
            if ('code' in err &&
                err.code === Code.UNAUTHORIZED &&
                !retry &&
                isNewToken) {
                logDebug('Retrying due to unauthorized');
                return this.withRetry(promiseFactory, true);
            }
            throw err;
        });
    }
    _setCallerSdkType(callerSdkType) {
        this._callerSdkType = callerSdkType;
    }
}

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
/**
 *
 * @param dcInstance Data Connect instance
 * @param mutationName name of mutation
 * @param variables variables to send with mutation
 * @returns `MutationRef`
 */
function mutationRef(dcInstance, mutationName, variables) {
    dcInstance.setInitialized();
    const ref = {
        dataConnect: dcInstance,
        name: mutationName,
        refType: MUTATION_STR,
        variables: variables
    };
    return ref;
}
/**
 * @internal
 */
class MutationManager {
    constructor(_transport) {
        this._transport = _transport;
        this._inflight = [];
    }
    executeMutation(mutationRef) {
        const result = this._transport.invokeMutation(mutationRef.name, mutationRef.variables);
        const withRefPromise = result.then(res => {
            const obj = {
                ...res, // Double check that the result is result.data, not just result
                source: SOURCE_SERVER,
                ref: mutationRef,
                fetchTime: Date.now().toLocaleString()
            };
            return obj;
        });
        this._inflight.push(result);
        const removePromise = () => (this._inflight = this._inflight.filter(promise => promise !== result));
        result.then(removePromise, removePromise);
        return withRefPromise;
    }
}
/**
 * Execute Mutation
 * @param mutationRef mutation to execute
 * @returns `MutationRef`
 */
function executeMutation(mutationRef) {
    return mutationRef.dataConnect._mutationManager.executeMutation(mutationRef);
}

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
const FIREBASE_DATA_CONNECT_EMULATOR_HOST_VAR = 'FIREBASE_DATA_CONNECT_EMULATOR_HOST';
/**
 *
 * @param fullHost
 * @returns TransportOptions
 * @internal
 */
function parseOptions(fullHost) {
    const [protocol, hostName] = fullHost.split('://');
    const isSecure = protocol === 'https';
    const [host, portAsString] = hostName.split(':');
    const port = Number(portAsString);
    return { host, port, sslEnabled: isSecure };
}
/**
 * Class representing Firebase Data Connect
 */
class DataConnect {
    // @internal
    constructor(app, 
    // TODO(mtewani): Replace with _dataConnectOptions in the future
    dataConnectOptions, _authProvider, _appCheckProvider) {
        this.app = app;
        this.dataConnectOptions = dataConnectOptions;
        this._authProvider = _authProvider;
        this._appCheckProvider = _appCheckProvider;
        this.isEmulator = false;
        this._initialized = false;
        this._isUsingGeneratedSdk = false;
        this._callerSdkType = CallerSdkTypeEnum.Base;
        if (typeof process !== 'undefined' && process.env) {
            const host = process.env[FIREBASE_DATA_CONNECT_EMULATOR_HOST_VAR];
            if (host) {
                logDebug('Found custom host. Using emulator');
                this.isEmulator = true;
                this._transportOptions = parseOptions(host);
            }
        }
    }
    /**
     * @internal
     */
    getCache() {
        return this.cache;
    }
    // @internal
    _useGeneratedSdk() {
        if (!this._isUsingGeneratedSdk) {
            this._isUsingGeneratedSdk = true;
        }
    }
    _setCallerSdkType(callerSdkType) {
        this._callerSdkType = callerSdkType;
        if (this._initialized) {
            this._transport._setCallerSdkType(callerSdkType);
        }
    }
    _delete() {
        app._removeServiceInstance(this.app, 'data-connect', JSON.stringify(this.getSettings()));
        return Promise.resolve();
    }
    // @internal
    getSettings() {
        const copy = JSON.parse(JSON.stringify(this.dataConnectOptions));
        delete copy.projectId;
        return copy;
    }
    /**
     * @internal
     */
    setCacheSettings(cacheSettings) {
        this._cacheSettings = cacheSettings;
    }
    // @internal
    setInitialized() {
        if (this._initialized) {
            return;
        }
        if (this._transportClass === undefined) {
            logDebug('transportClass not provided. Defaulting to RESTTransport.');
            this._transportClass = RESTTransport;
        }
        this._authTokenProvider = new FirebaseAuthProvider(this.app.name, this.app.options, this._authProvider);
        const connectorConfig = {
            connector: this.dataConnectOptions.connector,
            service: this.dataConnectOptions.service,
            location: this.dataConnectOptions.location
        };
        if (this._cacheSettings) {
            this.cache = new DataConnectCache(this._authTokenProvider, this.app.options.projectId, connectorConfig, this._transportOptions?.host || PROD_HOST, this._cacheSettings);
        }
        if (this._appCheckProvider) {
            this._appCheckTokenProvider = new AppCheckTokenProvider(this.app, this._appCheckProvider);
        }
        this._transport = new this._transportClass(this.dataConnectOptions, this.app.options.apiKey, this.app.options.appId, this._authTokenProvider, this._appCheckTokenProvider, undefined, this._isUsingGeneratedSdk, this._callerSdkType);
        if (this._transportOptions) {
            this._transport.useEmulator(this._transportOptions.host, this._transportOptions.port, this._transportOptions.sslEnabled);
        }
        this._queryManager = new QueryManager(this._transport, this, this.cache);
        this._mutationManager = new MutationManager(this._transport);
        this._initialized = true;
    }
    // @internal
    enableEmulator(transportOptions) {
        if (this._transportOptions &&
            this._initialized &&
            !areTransportOptionsEqual(this._transportOptions, transportOptions)) {
            logError('enableEmulator called after initialization');
            throw new DataConnectError(Code.ALREADY_INITIALIZED, 'DataConnect instance already initialized!');
        }
        this._transportOptions = transportOptions;
        this.isEmulator = true;
    }
}
/**
 * @internal
 * @param transportOptions1
 * @param transportOptions2
 * @returns
 */
function areTransportOptionsEqual(transportOptions1, transportOptions2) {
    return (transportOptions1.host === transportOptions2.host &&
        transportOptions1.port === transportOptions2.port &&
        transportOptions1.sslEnabled === transportOptions2.sslEnabled);
}
/**
 * Connect to the DataConnect Emulator
 * @param dc Data Connect instance
 * @param host host of emulator server
 * @param port port of emulator server
 * @param sslEnabled use https
 */
function connectDataConnectEmulator(dc, host, port, sslEnabled = false) {
    // Workaround to get cookies in Firebase Studio
    if (util.isCloudWorkstation(host)) {
        void util.pingServer(`https://${host}${port ? `:${port}` : ''}`);
    }
    dc.enableEmulator({ host, port, sslEnabled });
}
function getDataConnect(appOrConnectorConfig, settingsOrConnectorConfig, settings) {
    let app$1;
    let connectorConfig;
    let realSettings;
    if ('location' in appOrConnectorConfig) {
        connectorConfig = appOrConnectorConfig;
        app$1 = app.getApp();
        realSettings = settingsOrConnectorConfig;
    }
    else {
        app$1 = appOrConnectorConfig;
        connectorConfig = settingsOrConnectorConfig;
        realSettings = settings;
    }
    if (!app$1 || Object.keys(app$1).length === 0) {
        app$1 = app.getApp();
    }
    // Options to store in Firebase Component Provider.
    const serializedOptions = {
        ...connectorConfig,
        projectId: app$1.options.projectId
    };
    // We should sort the keys before initialization.
    const sortedSerialized = Object.fromEntries(Object.entries(serializedOptions).sort());
    const provider = app._getProvider(app$1, 'data-connect');
    const identifier = JSON.stringify(sortedSerialized);
    if (provider.isInitialized(identifier)) {
        const dcInstance = provider.getImmediate({ identifier });
        const options = provider.getOptions(identifier);
        const optionsValid = Object.keys(options).length > 0;
        if (optionsValid) {
            logDebug('Re-using cached instance');
            return dcInstance;
        }
    }
    validateDCOptions(connectorConfig);
    logDebug('Creating new DataConnect instance');
    // Initialize with options.
    const dataConnect = provider.initialize({
        instanceIdentifier: identifier,
        options: Object.fromEntries(Object.entries({
            ...sortedSerialized
        }).sort())
    });
    if (realSettings?.cacheSettings) {
        dataConnect.setCacheSettings(realSettings.cacheSettings);
    }
    return dataConnect;
}
/**
 *
 * @param dcOptions
 * @returns {void}
 * @internal
 */
function validateDCOptions(dcOptions) {
    const fields = ['connector', 'location', 'service'];
    if (!dcOptions) {
        throw new DataConnectError(Code.INVALID_ARGUMENT, 'DC Option Required');
    }
    fields.forEach(field => {
        if (dcOptions[field] === null ||
            dcOptions[field] === undefined) {
            throw new DataConnectError(Code.INVALID_ARGUMENT, `${field} Required`);
        }
    });
    return true;
}
/**
 * Delete DataConnect instance
 * @param dataConnect DataConnect instance
 * @returns
 */
function terminate(dataConnect) {
    return dataConnect._delete();
    // TODO(mtewani): Stop pending tasks
}
const StorageType = {
    MEMORY: 'MEMORY'
};
function makeMemoryCacheProvider() {
    return new MemoryStub();
}

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
function registerDataConnect(variant) {
    setSDKVersion(app.SDK_VERSION);
    app._registerComponent(new component.Component('data-connect', (container, { instanceIdentifier: connectorConfigStr, options }) => {
        const app = container.getProvider('app').getImmediate();
        const authProvider = container.getProvider('auth-internal');
        const appCheckProvider = container.getProvider('app-check-internal');
        let newOpts = options;
        if (connectorConfigStr) {
            newOpts = {
                ...JSON.parse(connectorConfigStr),
                ...newOpts
            };
        }
        if (!app.options.projectId) {
            throw new DataConnectError(Code.INVALID_ARGUMENT, 'Project ID must be provided. Did you pass in a proper projectId to initializeApp?');
        }
        return new DataConnect(app, { ...newOpts, projectId: app.options.projectId }, authProvider, appCheckProvider);
    }, "PUBLIC" /* ComponentType.PUBLIC */).setMultipleInstances(true));
    app.registerVersion(name, version, variant);
    // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
    app.registerVersion(name, version, 'cjs2020');
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
const QueryFetchPolicy = {
    PREFER_CACHE: 'PREFER_CACHE',
    CACHE_ONLY: 'CACHE_ONLY',
    SERVER_ONLY: 'SERVER_ONLY'
};

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
/**
 * Execute Query
 * @param queryRef query to execute.
 * @returns `QueryPromise`
 */
function executeQuery(queryRef, options) {
    if (queryRef.refType !== QUERY_STR) {
        return Promise.reject(new DataConnectError(Code.INVALID_ARGUMENT, `ExecuteQuery can only execute query operations`));
    }
    const queryManager = queryRef.dataConnect._queryManager;
    const fetchPolicy = options?.fetchPolicy ?? QueryFetchPolicy.PREFER_CACHE;
    switch (fetchPolicy) {
        case QueryFetchPolicy.SERVER_ONLY:
            return queryManager.fetchServerResults(queryRef);
        case QueryFetchPolicy.CACHE_ONLY:
            return queryManager.fetchCacheResults(queryRef, true);
        case QueryFetchPolicy.PREFER_CACHE:
            return queryManager.preferCacheResults(queryRef, false);
        default:
            throw new DataConnectError(Code.INVALID_ARGUMENT, `Invalid fetch policy: ${fetchPolicy}`);
    }
}
/**
 * Execute Query
 * @param dcInstance Data Connect instance to use.
 * @param queryName Query to execute
 * @param variables Variables to execute with
 * @param initialCache initial cache to use for client hydration
 * @returns `QueryRef`
 */
function queryRef(dcInstance, queryName, variables, initialCache) {
    dcInstance.setInitialized();
    if (initialCache !== undefined) {
        dcInstance._queryManager.updateSSR(initialCache);
    }
    return {
        dataConnect: dcInstance,
        refType: QUERY_STR,
        name: queryName,
        variables: variables
    };
}
/**
 * Converts serialized ref to query ref
 * @param serializedRef ref to convert to `QueryRef`
 * @returns `QueryRef`
 */
function toQueryRef(serializedRef) {
    const { refInfo: { name, variables, connectorConfig } } = serializedRef;
    return queryRef(getDataConnect(connectorConfig), name, variables);
}

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
/**
 * The generated SDK will allow the user to pass in either the variables or the data connect instance
 * with the variables. This function validates the variables and returns back the DataConnect instance
 * and variables based on the arguments passed in.
 *
 * Generated SDKs generated from versions 3.2.0 and lower of the Data Connect emulator binary are
 * NOT concerned with options, and will use this function to validate arguments.
 *
 * @param connectorConfig
 * @param dcOrVars
 * @param vars
 * @param variablesRequired
 * @returns {DataConnect} and {Variables} instance
 * @internal
 */
function validateArgs(connectorConfig, dcOrVars, vars, variablesRequired) {
    let dcInstance;
    let realVars;
    const dcFirstArg = dcOrVars && 'enableEmulator' in dcOrVars;
    if (dcFirstArg) {
        dcInstance = dcOrVars;
        realVars = vars;
    }
    else {
        dcInstance = getDataConnect(connectorConfig);
        realVars = dcOrVars;
    }
    if (!dcInstance || (!realVars && variablesRequired)) {
        throw new DataConnectError(Code.INVALID_ARGUMENT, 'Variables required.');
    }
    return { dc: dcInstance, vars: realVars };
}
/**
 * The generated SDK will allow the user to pass in either the variables or the data connect instance
 * with the variables, and/or options. This function validates the variables and returns back the
 * DataConnect instance and variables, and potentially options, based on the arguments passed in.
 *
 * Generated SDKs generated from versions 3.2.0 and higher of the Data Connect emulator binary are
 * in fact concerned with options, and will use this function to validate arguments.
 *
 * @param connectorConfig
 * @param dcOrVarsOrOptions
 * @param varsOrOptions
 * @param variablesRequired
 * @param options
 * @returns {DataConnect} and {Variables} instance, and optionally {ExecuteQueryOptions}
 * @internal
 */
function validateArgsWithOptions(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, hasVars, variablesRequired) {
    let dcInstance;
    let realVars;
    let realOptions;
    const dcFirstArg = dcOrVarsOrOptions && 'enableEmulator' in dcOrVarsOrOptions;
    if (dcFirstArg) {
        dcInstance = dcOrVarsOrOptions;
        if (hasVars) {
            realVars = varsOrOptions;
            realOptions = options;
        }
        else {
            realVars = undefined;
            realOptions = varsOrOptions;
        }
    }
    else {
        dcInstance = getDataConnect(connectorConfig);
        if (hasVars) {
            realVars = dcOrVarsOrOptions;
            realOptions = varsOrOptions;
        }
        else {
            realVars = undefined;
            realOptions = dcOrVarsOrOptions;
        }
    }
    if (!dcInstance || (!realVars && variablesRequired)) {
        throw new DataConnectError(Code.INVALID_ARGUMENT, 'Variables required.');
    }
    return { dc: dcInstance, vars: realVars, options: realOptions };
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
/**
 * Subscribe to a `QueryRef`
 * @param queryRefOrSerializedResult query ref or serialized result.
 * @param observerOrOnNext observer object or next function.
 * @param onError Callback to call when error gets thrown.
 * @param onComplete Called when subscription completes.
 * @returns `SubscriptionOptions`
 */
function subscribe(queryRefOrSerializedResult, observerOrOnNext, onError, onComplete) {
    let ref;
    let initialCache;
    if ('refInfo' in queryRefOrSerializedResult) {
        const serializedRef = queryRefOrSerializedResult;
        const { data, source, fetchTime } = serializedRef;
        ref = toQueryRef(serializedRef);
        initialCache = {
            data,
            source,
            fetchTime,
            ref,
            toJSON: getRefSerializer(ref, data, source, fetchTime)
        };
    }
    else {
        ref = queryRefOrSerializedResult;
    }
    let onResult = undefined;
    if (typeof observerOrOnNext === 'function') {
        onResult = observerOrOnNext;
    }
    else {
        onResult = observerOrOnNext.onNext;
        onError = observerOrOnNext.onErr;
        onComplete = observerOrOnNext.onComplete;
    }
    if (!onResult) {
        throw new DataConnectError(Code.INVALID_ARGUMENT, 'Must provide onNext');
    }
    return ref.dataConnect._queryManager.addSubscription(ref, onResult, onComplete, onError, initialCache);
}

/**
 * Firebase Data Connect
 *
 * @packageDocumentation
 */
registerDataConnect();

exports.CallerSdkTypeEnum = CallerSdkTypeEnum;
exports.Code = Code;
exports.DataConnect = DataConnect;
exports.DataConnectError = DataConnectError;
exports.DataConnectOperationError = DataConnectOperationError;
exports.MUTATION_STR = MUTATION_STR;
exports.MutationManager = MutationManager;
exports.QUERY_STR = QUERY_STR;
exports.QueryFetchPolicy = QueryFetchPolicy;
exports.SOURCE_CACHE = SOURCE_CACHE;
exports.SOURCE_SERVER = SOURCE_SERVER;
exports.StorageType = StorageType;
exports.areTransportOptionsEqual = areTransportOptionsEqual;
exports.connectDataConnectEmulator = connectDataConnectEmulator;
exports.executeMutation = executeMutation;
exports.executeQuery = executeQuery;
exports.getDataConnect = getDataConnect;
exports.makeMemoryCacheProvider = makeMemoryCacheProvider;
exports.mutationRef = mutationRef;
exports.parseOptions = parseOptions;
exports.queryRef = queryRef;
exports.setLogLevel = setLogLevel;
exports.subscribe = subscribe;
exports.terminate = terminate;
exports.toQueryRef = toQueryRef;
exports.validateArgs = validateArgs;
exports.validateArgsWithOptions = validateArgsWithOptions;
exports.validateDCOptions = validateDCOptions;
//# sourceMappingURL=index.cjs.js.map
