'use strict';

var pRetry = require('p-retry');
var googleAuthLibrary = require('google-auth-library');
var fs = require('fs');
var fs$1 = require('fs/promises');
var node_stream = require('node:stream');
var promises = require('node:stream/promises');
var path = require('path');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs$1);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class BaseModule {
}
function formatMap(templateString, valueMap) {
    // Use a regular expression to find all placeholders in the template string
    const regex = /\{([^}]+)\}/g;
    // Replace each placeholder with its corresponding value from the valueMap
    return templateString.replace(regex, (match, key) => {
        if (Object.prototype.hasOwnProperty.call(valueMap, key)) {
            const value = valueMap[key];
            // Convert the value to a string if it's not a string already
            return value !== undefined && value !== null ? String(value) : '';
        }
        else {
            // Handle missing keys
            throw new Error(`Key '${key}' not found in valueMap.`);
        }
    });
}
function setValueByPath(data, keys, value) {
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key.endsWith('[]')) {
            const keyName = key.slice(0, -2);
            if (!(keyName in data)) {
                if (Array.isArray(value)) {
                    data[keyName] = Array.from({ length: value.length }, () => ({}));
                }
                else {
                    throw new Error(`Value must be a list given an array path ${key}`);
                }
            }
            if (Array.isArray(data[keyName])) {
                const arrayData = data[keyName];
                if (Array.isArray(value)) {
                    for (let j = 0; j < arrayData.length; j++) {
                        const entry = arrayData[j];
                        setValueByPath(entry, keys.slice(i + 1), value[j]);
                    }
                }
                else {
                    for (const d of arrayData) {
                        setValueByPath(d, keys.slice(i + 1), value);
                    }
                }
            }
            return;
        }
        else if (key.endsWith('[0]')) {
            const keyName = key.slice(0, -3);
            if (!(keyName in data)) {
                data[keyName] = [{}];
            }
            const arrayData = data[keyName];
            setValueByPath(arrayData[0], keys.slice(i + 1), value);
            return;
        }
        if (!data[key] || typeof data[key] !== 'object') {
            data[key] = {};
        }
        data = data[key];
    }
    const keyToSet = keys[keys.length - 1];
    const existingData = data[keyToSet];
    if (existingData !== undefined) {
        if (!value ||
            (typeof value === 'object' && Object.keys(value).length === 0)) {
            return;
        }
        if (value === existingData) {
            return;
        }
        if (typeof existingData === 'object' &&
            typeof value === 'object' &&
            existingData !== null &&
            value !== null) {
            Object.assign(existingData, value);
        }
        else {
            throw new Error(`Cannot set value for an existing key. Key: ${keyToSet}`);
        }
    }
    else {
        if (keyToSet === '_self' &&
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)) {
            const valueAsRecord = value;
            Object.assign(data, valueAsRecord);
        }
        else {
            data[keyToSet] = value;
        }
    }
}
function getValueByPath(data, keys, defaultValue = undefined) {
    try {
        if (keys.length === 1 && keys[0] === '_self') {
            return data;
        }
        for (let i = 0; i < keys.length; i++) {
            if (typeof data !== 'object' || data === null) {
                return defaultValue;
            }
            const key = keys[i];
            if (key.endsWith('[]')) {
                const keyName = key.slice(0, -2);
                if (keyName in data) {
                    const arrayData = data[keyName];
                    if (!Array.isArray(arrayData)) {
                        return defaultValue;
                    }
                    return arrayData.map((d) => getValueByPath(d, keys.slice(i + 1), defaultValue));
                }
                else {
                    return defaultValue;
                }
            }
            else {
                data = data[key];
            }
        }
        return data;
    }
    catch (error) {
        if (error instanceof TypeError) {
            return defaultValue;
        }
        throw error;
    }
}
/**
 * Moves values from source paths to destination paths.
 *
 * Examples:
 *   moveValueByPath(
 *     {'requests': [{'content': v1}, {'content': v2}]},
 *     {'requests[].*': 'requests[].request.*'}
 *   )
 *     -> {'requests': [{'request': {'content': v1}}, {'request': {'content': v2}}]}
 */
function moveValueByPath(data, paths) {
    for (const [sourcePath, destPath] of Object.entries(paths)) {
        const sourceKeys = sourcePath.split('.');
        const destKeys = destPath.split('.');
        // Determine keys to exclude from wildcard to avoid cyclic references
        const excludeKeys = new Set();
        let wildcardIdx = -1;
        for (let i = 0; i < sourceKeys.length; i++) {
            if (sourceKeys[i] === '*') {
                wildcardIdx = i;
                break;
            }
        }
        if (wildcardIdx !== -1 && destKeys.length > wildcardIdx) {
            // Extract the intermediate key between source and dest paths
            // Example: source=['requests[]', '*'], dest=['requests[]', 'request', '*']
            // We want to exclude 'request'
            for (let i = wildcardIdx; i < destKeys.length; i++) {
                const key = destKeys[i];
                if (key !== '*' && !key.endsWith('[]') && !key.endsWith('[0]')) {
                    excludeKeys.add(key);
                }
            }
        }
        _moveValueRecursive(data, sourceKeys, destKeys, 0, excludeKeys);
    }
}
/**
 * Recursively moves values from source path to destination path.
 */
function _moveValueRecursive(data, sourceKeys, destKeys, keyIdx, excludeKeys) {
    if (keyIdx >= sourceKeys.length) {
        return;
    }
    if (typeof data !== 'object' || data === null) {
        return;
    }
    const key = sourceKeys[keyIdx];
    if (key.endsWith('[]')) {
        const keyName = key.slice(0, -2);
        const dataRecord = data;
        if (keyName in dataRecord && Array.isArray(dataRecord[keyName])) {
            for (const item of dataRecord[keyName]) {
                _moveValueRecursive(item, sourceKeys, destKeys, keyIdx + 1, excludeKeys);
            }
        }
    }
    else if (key === '*') {
        // wildcard - move all fields
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
            const dataRecord = data;
            const keysToMove = Object.keys(dataRecord).filter((k) => !k.startsWith('_') && !excludeKeys.has(k));
            const valuesToMove = {};
            for (const k of keysToMove) {
                valuesToMove[k] = dataRecord[k];
            }
            // Set values at destination
            for (const [k, v] of Object.entries(valuesToMove)) {
                const newDestKeys = [];
                for (const dk of destKeys.slice(keyIdx)) {
                    if (dk === '*') {
                        newDestKeys.push(k);
                    }
                    else {
                        newDestKeys.push(dk);
                    }
                }
                setValueByPath(dataRecord, newDestKeys, v);
            }
            for (const k of keysToMove) {
                delete dataRecord[k];
            }
        }
    }
    else {
        // Navigate to next level
        const dataRecord = data;
        if (key in dataRecord) {
            _moveValueRecursive(dataRecord[key], sourceKeys, destKeys, keyIdx + 1, excludeKeys);
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Code generated by the Google Gen AI SDK generator DO NOT EDIT.
function uploadToFileSearchStoreConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (parentObject !== undefined && fromMimeType != null) {
        setValueByPath(parentObject, ['mimeType'], fromMimeType);
    }
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (parentObject !== undefined && fromDisplayName != null) {
        setValueByPath(parentObject, ['displayName'], fromDisplayName);
    }
    const fromCustomMetadata = getValueByPath(fromObject, [
        'customMetadata',
    ]);
    if (parentObject !== undefined && fromCustomMetadata != null) {
        let transformedList = fromCustomMetadata;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(parentObject, ['customMetadata'], transformedList);
    }
    const fromChunkingConfig = getValueByPath(fromObject, [
        'chunkingConfig',
    ]);
    if (parentObject !== undefined && fromChunkingConfig != null) {
        setValueByPath(parentObject, ['chunkingConfig'], fromChunkingConfig);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * API errors raised by the GenAI API.
 */
class ApiError extends Error {
    constructor(options) {
        super(options.message);
        this.name = 'ApiError';
        this.status = options.status;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Code generated by the Google Gen AI SDK generator DO NOT EDIT.
function uploadToFileSearchStoreOperationFromMldev(fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromMetadata = getValueByPath(fromObject, ['metadata']);
    if (fromMetadata != null) {
        setValueByPath(toObject, ['metadata'], fromMetadata);
    }
    const fromDone = getValueByPath(fromObject, ['done']);
    if (fromDone != null) {
        setValueByPath(toObject, ['done'], fromDone);
    }
    const fromError = getValueByPath(fromObject, ['error']);
    if (fromError != null) {
        setValueByPath(toObject, ['error'], fromError);
    }
    const fromResponse = getValueByPath(fromObject, ['response']);
    if (fromResponse != null) {
        setValueByPath(toObject, ['response'], uploadToFileSearchStoreResponseFromMldev(fromResponse));
    }
    return toObject;
}
function uploadToFileSearchStoreResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromParent = getValueByPath(fromObject, ['parent']);
    if (fromParent != null) {
        setValueByPath(toObject, ['parent'], fromParent);
    }
    const fromDocumentName = getValueByPath(fromObject, ['documentName']);
    if (fromDocumentName != null) {
        setValueByPath(toObject, ['documentName'], fromDocumentName);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** Programming language of the `code`. */
var Language;
(function (Language) {
    /**
     * Unspecified language. This value should not be used.
     */
    Language["LANGUAGE_UNSPECIFIED"] = "LANGUAGE_UNSPECIFIED";
    /**
     * Python >= 3.10, with numpy and simpy available.
     */
    Language["PYTHON"] = "PYTHON";
})(Language || (Language = {}));
/** Outcome of the code execution. */
var Outcome;
(function (Outcome) {
    /**
     * Unspecified status. This value should not be used.
     */
    Outcome["OUTCOME_UNSPECIFIED"] = "OUTCOME_UNSPECIFIED";
    /**
     * Code execution completed successfully.
     */
    Outcome["OUTCOME_OK"] = "OUTCOME_OK";
    /**
     * Code execution finished but with a failure. `stderr` should contain the reason.
     */
    Outcome["OUTCOME_FAILED"] = "OUTCOME_FAILED";
    /**
     * Code execution ran for too long, and was cancelled. There may or may not be a partial output present.
     */
    Outcome["OUTCOME_DEADLINE_EXCEEDED"] = "OUTCOME_DEADLINE_EXCEEDED";
})(Outcome || (Outcome = {}));
/** Specifies how the response should be scheduled in the conversation. */
var FunctionResponseScheduling;
(function (FunctionResponseScheduling) {
    /**
     * This value is unused.
     */
    FunctionResponseScheduling["SCHEDULING_UNSPECIFIED"] = "SCHEDULING_UNSPECIFIED";
    /**
     * Only add the result to the conversation context, do not interrupt or trigger generation.
     */
    FunctionResponseScheduling["SILENT"] = "SILENT";
    /**
     * Add the result to the conversation context, and prompt to generate output without interrupting ongoing generation.
     */
    FunctionResponseScheduling["WHEN_IDLE"] = "WHEN_IDLE";
    /**
     * Add the result to the conversation context, interrupt ongoing generation and prompt to generate output.
     */
    FunctionResponseScheduling["INTERRUPT"] = "INTERRUPT";
})(FunctionResponseScheduling || (FunctionResponseScheduling = {}));
/** Data type of the schema field. */
var Type;
(function (Type) {
    /**
     * Not specified, should not be used.
     */
    Type["TYPE_UNSPECIFIED"] = "TYPE_UNSPECIFIED";
    /**
     * OpenAPI string type
     */
    Type["STRING"] = "STRING";
    /**
     * OpenAPI number type
     */
    Type["NUMBER"] = "NUMBER";
    /**
     * OpenAPI integer type
     */
    Type["INTEGER"] = "INTEGER";
    /**
     * OpenAPI boolean type
     */
    Type["BOOLEAN"] = "BOOLEAN";
    /**
     * OpenAPI array type
     */
    Type["ARRAY"] = "ARRAY";
    /**
     * OpenAPI object type
     */
    Type["OBJECT"] = "OBJECT";
    /**
     * Null type
     */
    Type["NULL"] = "NULL";
})(Type || (Type = {}));
/** The environment being operated. */
var Environment;
(function (Environment) {
    /**
     * Defaults to browser.
     */
    Environment["ENVIRONMENT_UNSPECIFIED"] = "ENVIRONMENT_UNSPECIFIED";
    /**
     * Operates in a web browser.
     */
    Environment["ENVIRONMENT_BROWSER"] = "ENVIRONMENT_BROWSER";
})(Environment || (Environment = {}));
/** Type of auth scheme. This enum is not supported in Gemini API. */
var AuthType;
(function (AuthType) {
    AuthType["AUTH_TYPE_UNSPECIFIED"] = "AUTH_TYPE_UNSPECIFIED";
    /**
     * No Auth.
     */
    AuthType["NO_AUTH"] = "NO_AUTH";
    /**
     * API Key Auth.
     */
    AuthType["API_KEY_AUTH"] = "API_KEY_AUTH";
    /**
     * HTTP Basic Auth.
     */
    AuthType["HTTP_BASIC_AUTH"] = "HTTP_BASIC_AUTH";
    /**
     * Google Service Account Auth.
     */
    AuthType["GOOGLE_SERVICE_ACCOUNT_AUTH"] = "GOOGLE_SERVICE_ACCOUNT_AUTH";
    /**
     * OAuth auth.
     */
    AuthType["OAUTH"] = "OAUTH";
    /**
     * OpenID Connect (OIDC) Auth.
     */
    AuthType["OIDC_AUTH"] = "OIDC_AUTH";
})(AuthType || (AuthType = {}));
/** The location of the API key. This enum is not supported in Gemini API. */
var HttpElementLocation;
(function (HttpElementLocation) {
    HttpElementLocation["HTTP_IN_UNSPECIFIED"] = "HTTP_IN_UNSPECIFIED";
    /**
     * Element is in the HTTP request query.
     */
    HttpElementLocation["HTTP_IN_QUERY"] = "HTTP_IN_QUERY";
    /**
     * Element is in the HTTP request header.
     */
    HttpElementLocation["HTTP_IN_HEADER"] = "HTTP_IN_HEADER";
    /**
     * Element is in the HTTP request path.
     */
    HttpElementLocation["HTTP_IN_PATH"] = "HTTP_IN_PATH";
    /**
     * Element is in the HTTP request body.
     */
    HttpElementLocation["HTTP_IN_BODY"] = "HTTP_IN_BODY";
    /**
     * Element is in the HTTP request cookie.
     */
    HttpElementLocation["HTTP_IN_COOKIE"] = "HTTP_IN_COOKIE";
})(HttpElementLocation || (HttpElementLocation = {}));
/** The API spec that the external API implements. This enum is not supported in Gemini API. */
var ApiSpec;
(function (ApiSpec) {
    /**
     * Unspecified API spec. This value should not be used.
     */
    ApiSpec["API_SPEC_UNSPECIFIED"] = "API_SPEC_UNSPECIFIED";
    /**
     * Simple search API spec.
     */
    ApiSpec["SIMPLE_SEARCH"] = "SIMPLE_SEARCH";
    /**
     * Elastic search API spec.
     */
    ApiSpec["ELASTIC_SEARCH"] = "ELASTIC_SEARCH";
})(ApiSpec || (ApiSpec = {}));
/** Sites with confidence level chosen & above this value will be blocked from the search results. This enum is not supported in Gemini API. */
var PhishBlockThreshold;
(function (PhishBlockThreshold) {
    /**
     * Defaults to unspecified.
     */
    PhishBlockThreshold["PHISH_BLOCK_THRESHOLD_UNSPECIFIED"] = "PHISH_BLOCK_THRESHOLD_UNSPECIFIED";
    /**
     * Blocks Low and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    /**
     * Blocks Medium and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    /**
     * Blocks High and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_HIGH_AND_ABOVE"] = "BLOCK_HIGH_AND_ABOVE";
    /**
     * Blocks Higher and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_HIGHER_AND_ABOVE"] = "BLOCK_HIGHER_AND_ABOVE";
    /**
     * Blocks Very high and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_VERY_HIGH_AND_ABOVE"] = "BLOCK_VERY_HIGH_AND_ABOVE";
    /**
     * Blocks Extremely high confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_ONLY_EXTREMELY_HIGH"] = "BLOCK_ONLY_EXTREMELY_HIGH";
})(PhishBlockThreshold || (PhishBlockThreshold = {}));
/** Specifies the function Behavior. Currently only supported by the BidiGenerateContent method. This enum is not supported in Vertex AI. */
var Behavior;
(function (Behavior) {
    /**
     * This value is unused.
     */
    Behavior["UNSPECIFIED"] = "UNSPECIFIED";
    /**
     * If set, the system will wait to receive the function response before continuing the conversation.
     */
    Behavior["BLOCKING"] = "BLOCKING";
    /**
     * If set, the system will not wait to receive the function response. Instead, it will attempt to handle function responses as they become available while maintaining the conversation between the user and the model.
     */
    Behavior["NON_BLOCKING"] = "NON_BLOCKING";
})(Behavior || (Behavior = {}));
/** The mode of the predictor to be used in dynamic retrieval. */
var DynamicRetrievalConfigMode;
(function (DynamicRetrievalConfigMode) {
    /**
     * Always trigger retrieval.
     */
    DynamicRetrievalConfigMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    /**
     * Run retrieval only when system decides it is necessary.
     */
    DynamicRetrievalConfigMode["MODE_DYNAMIC"] = "MODE_DYNAMIC";
})(DynamicRetrievalConfigMode || (DynamicRetrievalConfigMode = {}));
/** Function calling mode. */
var FunctionCallingConfigMode;
(function (FunctionCallingConfigMode) {
    /**
     * Unspecified function calling mode. This value should not be used.
     */
    FunctionCallingConfigMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    /**
     * Default model behavior, model decides to predict either function calls or natural language response.
     */
    FunctionCallingConfigMode["AUTO"] = "AUTO";
    /**
     * Model is constrained to always predicting function calls only. If "allowed_function_names" are set, the predicted function calls will be limited to any one of "allowed_function_names", else the predicted function calls will be any one of the provided "function_declarations".
     */
    FunctionCallingConfigMode["ANY"] = "ANY";
    /**
     * Model will not predict any function calls. Model behavior is same as when not passing any function declarations.
     */
    FunctionCallingConfigMode["NONE"] = "NONE";
    /**
     * Model is constrained to predict either function calls or natural language response. If "allowed_function_names" are set, the predicted function calls will be limited to any one of "allowed_function_names", else the predicted function calls will be any one of the provided "function_declarations".
     */
    FunctionCallingConfigMode["VALIDATED"] = "VALIDATED";
})(FunctionCallingConfigMode || (FunctionCallingConfigMode = {}));
/** The number of thoughts tokens that the model should generate. */
var ThinkingLevel;
(function (ThinkingLevel) {
    /**
     * Unspecified thinking level.
     */
    ThinkingLevel["THINKING_LEVEL_UNSPECIFIED"] = "THINKING_LEVEL_UNSPECIFIED";
    /**
     * MINIMAL thinking level.
     */
    ThinkingLevel["MINIMAL"] = "MINIMAL";
    /**
     * Low thinking level.
     */
    ThinkingLevel["LOW"] = "LOW";
    /**
     * Medium thinking level.
     */
    ThinkingLevel["MEDIUM"] = "MEDIUM";
    /**
     * High thinking level.
     */
    ThinkingLevel["HIGH"] = "HIGH";
})(ThinkingLevel || (ThinkingLevel = {}));
/** Enum that controls the generation of people. */
var PersonGeneration;
(function (PersonGeneration) {
    /**
     * Block generation of images of people.
     */
    PersonGeneration["DONT_ALLOW"] = "DONT_ALLOW";
    /**
     * Generate images of adults, but not children.
     */
    PersonGeneration["ALLOW_ADULT"] = "ALLOW_ADULT";
    /**
     * Generate images that include adults and children.
     */
    PersonGeneration["ALLOW_ALL"] = "ALLOW_ALL";
})(PersonGeneration || (PersonGeneration = {}));
/** Controls whether prominent people (celebrities) generation is allowed. If used with personGeneration, personGeneration enum would take precedence. For instance, if ALLOW_NONE is set, all person generation would be blocked. If this field is unspecified, the default behavior is to allow prominent people. This enum is not supported in Gemini API. */
var ProminentPeople;
(function (ProminentPeople) {
    /**
     * Unspecified value. The model will proceed with the default behavior, which is to allow generation of prominent people.
     */
    ProminentPeople["PROMINENT_PEOPLE_UNSPECIFIED"] = "PROMINENT_PEOPLE_UNSPECIFIED";
    /**
     * Allows the model to generate images of prominent people.
     */
    ProminentPeople["ALLOW_PROMINENT_PEOPLE"] = "ALLOW_PROMINENT_PEOPLE";
    /**
     * Prevents the model from generating images of prominent people.
     */
    ProminentPeople["BLOCK_PROMINENT_PEOPLE"] = "BLOCK_PROMINENT_PEOPLE";
})(ProminentPeople || (ProminentPeople = {}));
/** The harm category to be blocked. */
var HarmCategory;
(function (HarmCategory) {
    /**
     * Default value. This value is unused.
     */
    HarmCategory["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
    /**
     * Abusive, threatening, or content intended to bully, torment, or ridicule.
     */
    HarmCategory["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
    /**
     * Content that promotes violence or incites hatred against individuals or groups based on certain attributes.
     */
    HarmCategory["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
    /**
     * Content that contains sexually explicit material.
     */
    HarmCategory["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
    /**
     * Content that promotes, facilitates, or enables dangerous activities.
     */
    HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
    /**
     * Deprecated: Election filter is not longer supported. The harm category is civic integrity.
     */
    HarmCategory["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";
    /**
     * Images that contain hate speech. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_IMAGE_HATE"] = "HARM_CATEGORY_IMAGE_HATE";
    /**
     * Images that contain dangerous content. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT"] = "HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT";
    /**
     * Images that contain harassment. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_IMAGE_HARASSMENT"] = "HARM_CATEGORY_IMAGE_HARASSMENT";
    /**
     * Images that contain sexually explicit content. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT";
    /**
     * Prompts designed to bypass safety filters. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_JAILBREAK"] = "HARM_CATEGORY_JAILBREAK";
})(HarmCategory || (HarmCategory = {}));
/** The method for blocking content. If not specified, the default behavior is to use the probability score. This enum is not supported in Gemini API. */
var HarmBlockMethod;
(function (HarmBlockMethod) {
    /**
     * The harm block method is unspecified.
     */
    HarmBlockMethod["HARM_BLOCK_METHOD_UNSPECIFIED"] = "HARM_BLOCK_METHOD_UNSPECIFIED";
    /**
     * The harm block method uses both probability and severity scores.
     */
    HarmBlockMethod["SEVERITY"] = "SEVERITY";
    /**
     * The harm block method uses the probability score.
     */
    HarmBlockMethod["PROBABILITY"] = "PROBABILITY";
})(HarmBlockMethod || (HarmBlockMethod = {}));
/** The threshold for blocking content. If the harm probability exceeds this threshold, the content will be blocked. */
var HarmBlockThreshold;
(function (HarmBlockThreshold) {
    /**
     * The harm block threshold is unspecified.
     */
    HarmBlockThreshold["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
    /**
     * Block content with a low harm probability or higher.
     */
    HarmBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    /**
     * Block content with a medium harm probability or higher.
     */
    HarmBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    /**
     * Block content with a high harm probability.
     */
    HarmBlockThreshold["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
    /**
     * Do not block any content, regardless of its harm probability.
     */
    HarmBlockThreshold["BLOCK_NONE"] = "BLOCK_NONE";
    /**
     * Turn off the safety filter entirely.
     */
    HarmBlockThreshold["OFF"] = "OFF";
})(HarmBlockThreshold || (HarmBlockThreshold = {}));
/** Output only. The reason why the model stopped generating tokens.

If empty, the model has not stopped generating the tokens. */
var FinishReason;
(function (FinishReason) {
    /**
     * The finish reason is unspecified.
     */
    FinishReason["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
    /**
     * Token generation reached a natural stopping point or a configured stop sequence.
     */
    FinishReason["STOP"] = "STOP";
    /**
     * Token generation reached the configured maximum output tokens.
     */
    FinishReason["MAX_TOKENS"] = "MAX_TOKENS";
    /**
     * Token generation stopped because the content potentially contains safety violations. NOTE: When streaming, [content][] is empty if content filters blocks the output.
     */
    FinishReason["SAFETY"] = "SAFETY";
    /**
     * The token generation stopped because of potential recitation.
     */
    FinishReason["RECITATION"] = "RECITATION";
    /**
     * The token generation stopped because of using an unsupported language.
     */
    FinishReason["LANGUAGE"] = "LANGUAGE";
    /**
     * All other reasons that stopped the token generation.
     */
    FinishReason["OTHER"] = "OTHER";
    /**
     * Token generation stopped because the content contains forbidden terms.
     */
    FinishReason["BLOCKLIST"] = "BLOCKLIST";
    /**
     * Token generation stopped for potentially containing prohibited content.
     */
    FinishReason["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
    /**
     * Token generation stopped because the content potentially contains Sensitive Personally Identifiable Information (SPII).
     */
    FinishReason["SPII"] = "SPII";
    /**
     * The function call generated by the model is invalid.
     */
    FinishReason["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
    /**
     * Token generation stopped because generated images have safety violations.
     */
    FinishReason["IMAGE_SAFETY"] = "IMAGE_SAFETY";
    /**
     * The tool call generated by the model is invalid.
     */
    FinishReason["UNEXPECTED_TOOL_CALL"] = "UNEXPECTED_TOOL_CALL";
    /**
     * Image generation stopped because the generated images have prohibited content.
     */
    FinishReason["IMAGE_PROHIBITED_CONTENT"] = "IMAGE_PROHIBITED_CONTENT";
    /**
     * The model was expected to generate an image, but none was generated.
     */
    FinishReason["NO_IMAGE"] = "NO_IMAGE";
    /**
     * Image generation stopped because the generated image may be a recitation from a source.
     */
    FinishReason["IMAGE_RECITATION"] = "IMAGE_RECITATION";
    /**
     * Image generation stopped for a reason not otherwise specified.
     */
    FinishReason["IMAGE_OTHER"] = "IMAGE_OTHER";
})(FinishReason || (FinishReason = {}));
/** Output only. The probability of harm for this category. */
var HarmProbability;
(function (HarmProbability) {
    /**
     * The harm probability is unspecified.
     */
    HarmProbability["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
    /**
     * The harm probability is negligible.
     */
    HarmProbability["NEGLIGIBLE"] = "NEGLIGIBLE";
    /**
     * The harm probability is low.
     */
    HarmProbability["LOW"] = "LOW";
    /**
     * The harm probability is medium.
     */
    HarmProbability["MEDIUM"] = "MEDIUM";
    /**
     * The harm probability is high.
     */
    HarmProbability["HIGH"] = "HIGH";
})(HarmProbability || (HarmProbability = {}));
/** Output only. The severity of harm for this category. This enum is not supported in Gemini API. */
var HarmSeverity;
(function (HarmSeverity) {
    /**
     * The harm severity is unspecified.
     */
    HarmSeverity["HARM_SEVERITY_UNSPECIFIED"] = "HARM_SEVERITY_UNSPECIFIED";
    /**
     * The harm severity is negligible.
     */
    HarmSeverity["HARM_SEVERITY_NEGLIGIBLE"] = "HARM_SEVERITY_NEGLIGIBLE";
    /**
     * The harm severity is low.
     */
    HarmSeverity["HARM_SEVERITY_LOW"] = "HARM_SEVERITY_LOW";
    /**
     * The harm severity is medium.
     */
    HarmSeverity["HARM_SEVERITY_MEDIUM"] = "HARM_SEVERITY_MEDIUM";
    /**
     * The harm severity is high.
     */
    HarmSeverity["HARM_SEVERITY_HIGH"] = "HARM_SEVERITY_HIGH";
})(HarmSeverity || (HarmSeverity = {}));
/** The status of the URL retrieval. */
var UrlRetrievalStatus;
(function (UrlRetrievalStatus) {
    /**
     * Default value. This value is unused.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_UNSPECIFIED"] = "URL_RETRIEVAL_STATUS_UNSPECIFIED";
    /**
     * The URL was retrieved successfully.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_SUCCESS"] = "URL_RETRIEVAL_STATUS_SUCCESS";
    /**
     * The URL retrieval failed.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_ERROR"] = "URL_RETRIEVAL_STATUS_ERROR";
    /**
     * Url retrieval is failed because the content is behind paywall. This enum value is not supported in Vertex AI.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_PAYWALL"] = "URL_RETRIEVAL_STATUS_PAYWALL";
    /**
     * Url retrieval is failed because the content is unsafe. This enum value is not supported in Vertex AI.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_UNSAFE"] = "URL_RETRIEVAL_STATUS_UNSAFE";
})(UrlRetrievalStatus || (UrlRetrievalStatus = {}));
/** Output only. The reason why the prompt was blocked. */
var BlockedReason;
(function (BlockedReason) {
    /**
     * The blocked reason is unspecified.
     */
    BlockedReason["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
    /**
     * The prompt was blocked for safety reasons.
     */
    BlockedReason["SAFETY"] = "SAFETY";
    /**
     * The prompt was blocked for other reasons. For example, it may be due to the prompt's language, or because it contains other harmful content.
     */
    BlockedReason["OTHER"] = "OTHER";
    /**
     * The prompt was blocked because it contains a term from the terminology blocklist.
     */
    BlockedReason["BLOCKLIST"] = "BLOCKLIST";
    /**
     * The prompt was blocked because it contains prohibited content.
     */
    BlockedReason["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
    /**
     * The prompt was blocked because it contains content that is unsafe for image generation.
     */
    BlockedReason["IMAGE_SAFETY"] = "IMAGE_SAFETY";
    /**
     * The prompt was blocked by Model Armor. This enum value is not supported in Gemini API.
     */
    BlockedReason["MODEL_ARMOR"] = "MODEL_ARMOR";
    /**
     * The prompt was blocked as a jailbreak attempt. This enum value is not supported in Gemini API.
     */
    BlockedReason["JAILBREAK"] = "JAILBREAK";
})(BlockedReason || (BlockedReason = {}));
/** Output only. The traffic type for this request. This enum is not supported in Gemini API. */
var TrafficType;
(function (TrafficType) {
    /**
     * Unspecified request traffic type.
     */
    TrafficType["TRAFFIC_TYPE_UNSPECIFIED"] = "TRAFFIC_TYPE_UNSPECIFIED";
    /**
     * The request was processed using Pay-As-You-Go quota.
     */
    TrafficType["ON_DEMAND"] = "ON_DEMAND";
    /**
     * Type for Priority Pay-As-You-Go traffic.
     */
    TrafficType["ON_DEMAND_PRIORITY"] = "ON_DEMAND_PRIORITY";
    /**
     * Type for Flex traffic.
     */
    TrafficType["ON_DEMAND_FLEX"] = "ON_DEMAND_FLEX";
    /**
     * Type for Provisioned Throughput traffic.
     */
    TrafficType["PROVISIONED_THROUGHPUT"] = "PROVISIONED_THROUGHPUT";
})(TrafficType || (TrafficType = {}));
/** Server content modalities. */
var Modality;
(function (Modality) {
    /**
     * The modality is unspecified.
     */
    Modality["MODALITY_UNSPECIFIED"] = "MODALITY_UNSPECIFIED";
    /**
     * Indicates the model should return text
     */
    Modality["TEXT"] = "TEXT";
    /**
     * Indicates the model should return images.
     */
    Modality["IMAGE"] = "IMAGE";
    /**
     * Indicates the model should return audio.
     */
    Modality["AUDIO"] = "AUDIO";
})(Modality || (Modality = {}));
/** The stage of the underlying model. This enum is not supported in Vertex AI. */
var ModelStage;
(function (ModelStage) {
    /**
     * Unspecified model stage.
     */
    ModelStage["MODEL_STAGE_UNSPECIFIED"] = "MODEL_STAGE_UNSPECIFIED";
    /**
     * The underlying model is subject to lots of tunings.
     */
    ModelStage["UNSTABLE_EXPERIMENTAL"] = "UNSTABLE_EXPERIMENTAL";
    /**
     * Models in this stage are for experimental purposes only.
     */
    ModelStage["EXPERIMENTAL"] = "EXPERIMENTAL";
    /**
     * Models in this stage are more mature than experimental models.
     */
    ModelStage["PREVIEW"] = "PREVIEW";
    /**
     * Models in this stage are considered stable and ready for production use.
     */
    ModelStage["STABLE"] = "STABLE";
    /**
     * If the model is on this stage, it means that this model is on the path to deprecation in near future. Only existing customers can use this model.
     */
    ModelStage["LEGACY"] = "LEGACY";
    /**
     * Models in this stage are deprecated. These models cannot be used.
     */
    ModelStage["DEPRECATED"] = "DEPRECATED";
    /**
     * Models in this stage are retired. These models cannot be used.
     */
    ModelStage["RETIRED"] = "RETIRED";
})(ModelStage || (ModelStage = {}));
/** The media resolution to use. */
var MediaResolution;
(function (MediaResolution) {
    /**
     * Media resolution has not been set
     */
    MediaResolution["MEDIA_RESOLUTION_UNSPECIFIED"] = "MEDIA_RESOLUTION_UNSPECIFIED";
    /**
     * Media resolution set to low (64 tokens).
     */
    MediaResolution["MEDIA_RESOLUTION_LOW"] = "MEDIA_RESOLUTION_LOW";
    /**
     * Media resolution set to medium (256 tokens).
     */
    MediaResolution["MEDIA_RESOLUTION_MEDIUM"] = "MEDIA_RESOLUTION_MEDIUM";
    /**
     * Media resolution set to high (zoomed reframing with 256 tokens).
     */
    MediaResolution["MEDIA_RESOLUTION_HIGH"] = "MEDIA_RESOLUTION_HIGH";
})(MediaResolution || (MediaResolution = {}));
/** Tuning mode. This enum is not supported in Gemini API. */
var TuningMode;
(function (TuningMode) {
    /**
     * Tuning mode is unspecified.
     */
    TuningMode["TUNING_MODE_UNSPECIFIED"] = "TUNING_MODE_UNSPECIFIED";
    /**
     * Full fine-tuning mode.
     */
    TuningMode["TUNING_MODE_FULL"] = "TUNING_MODE_FULL";
    /**
     * PEFT adapter tuning mode.
     */
    TuningMode["TUNING_MODE_PEFT_ADAPTER"] = "TUNING_MODE_PEFT_ADAPTER";
})(TuningMode || (TuningMode = {}));
/** Adapter size for tuning. This enum is not supported in Gemini API. */
var AdapterSize;
(function (AdapterSize) {
    /**
     * Adapter size is unspecified.
     */
    AdapterSize["ADAPTER_SIZE_UNSPECIFIED"] = "ADAPTER_SIZE_UNSPECIFIED";
    /**
     * Adapter size 1.
     */
    AdapterSize["ADAPTER_SIZE_ONE"] = "ADAPTER_SIZE_ONE";
    /**
     * Adapter size 2.
     */
    AdapterSize["ADAPTER_SIZE_TWO"] = "ADAPTER_SIZE_TWO";
    /**
     * Adapter size 4.
     */
    AdapterSize["ADAPTER_SIZE_FOUR"] = "ADAPTER_SIZE_FOUR";
    /**
     * Adapter size 8.
     */
    AdapterSize["ADAPTER_SIZE_EIGHT"] = "ADAPTER_SIZE_EIGHT";
    /**
     * Adapter size 16.
     */
    AdapterSize["ADAPTER_SIZE_SIXTEEN"] = "ADAPTER_SIZE_SIXTEEN";
    /**
     * Adapter size 32.
     */
    AdapterSize["ADAPTER_SIZE_THIRTY_TWO"] = "ADAPTER_SIZE_THIRTY_TWO";
})(AdapterSize || (AdapterSize = {}));
/** Job state. */
var JobState;
(function (JobState) {
    /**
     * The job state is unspecified.
     */
    JobState["JOB_STATE_UNSPECIFIED"] = "JOB_STATE_UNSPECIFIED";
    /**
     * The job has been just created or resumed and processing has not yet begun.
     */
    JobState["JOB_STATE_QUEUED"] = "JOB_STATE_QUEUED";
    /**
     * The service is preparing to run the job.
     */
    JobState["JOB_STATE_PENDING"] = "JOB_STATE_PENDING";
    /**
     * The job is in progress.
     */
    JobState["JOB_STATE_RUNNING"] = "JOB_STATE_RUNNING";
    /**
     * The job completed successfully.
     */
    JobState["JOB_STATE_SUCCEEDED"] = "JOB_STATE_SUCCEEDED";
    /**
     * The job failed.
     */
    JobState["JOB_STATE_FAILED"] = "JOB_STATE_FAILED";
    /**
     * The job is being cancelled. From this state the job may only go to either `JOB_STATE_SUCCEEDED`, `JOB_STATE_FAILED` or `JOB_STATE_CANCELLED`.
     */
    JobState["JOB_STATE_CANCELLING"] = "JOB_STATE_CANCELLING";
    /**
     * The job has been cancelled.
     */
    JobState["JOB_STATE_CANCELLED"] = "JOB_STATE_CANCELLED";
    /**
     * The job has been stopped, and can be resumed.
     */
    JobState["JOB_STATE_PAUSED"] = "JOB_STATE_PAUSED";
    /**
     * The job has expired.
     */
    JobState["JOB_STATE_EXPIRED"] = "JOB_STATE_EXPIRED";
    /**
     * The job is being updated. Only jobs in the `JOB_STATE_RUNNING` state can be updated. After updating, the job goes back to the `JOB_STATE_RUNNING` state.
     */
    JobState["JOB_STATE_UPDATING"] = "JOB_STATE_UPDATING";
    /**
     * The job is partially succeeded, some results may be missing due to errors.
     */
    JobState["JOB_STATE_PARTIALLY_SUCCEEDED"] = "JOB_STATE_PARTIALLY_SUCCEEDED";
})(JobState || (JobState = {}));
/** Output only. The detail state of the tuning job (while the overall `JobState` is running). This enum is not supported in Gemini API. */
var TuningJobState;
(function (TuningJobState) {
    /**
     * Default tuning job state.
     */
    TuningJobState["TUNING_JOB_STATE_UNSPECIFIED"] = "TUNING_JOB_STATE_UNSPECIFIED";
    /**
     * Tuning job is waiting for job quota.
     */
    TuningJobState["TUNING_JOB_STATE_WAITING_FOR_QUOTA"] = "TUNING_JOB_STATE_WAITING_FOR_QUOTA";
    /**
     * Tuning job is validating the dataset.
     */
    TuningJobState["TUNING_JOB_STATE_PROCESSING_DATASET"] = "TUNING_JOB_STATE_PROCESSING_DATASET";
    /**
     * Tuning job is waiting for hardware capacity.
     */
    TuningJobState["TUNING_JOB_STATE_WAITING_FOR_CAPACITY"] = "TUNING_JOB_STATE_WAITING_FOR_CAPACITY";
    /**
     * Tuning job is running.
     */
    TuningJobState["TUNING_JOB_STATE_TUNING"] = "TUNING_JOB_STATE_TUNING";
    /**
     * Tuning job is doing some post processing steps.
     */
    TuningJobState["TUNING_JOB_STATE_POST_PROCESSING"] = "TUNING_JOB_STATE_POST_PROCESSING";
})(TuningJobState || (TuningJobState = {}));
/** Aggregation metric. This enum is not supported in Gemini API. */
var AggregationMetric;
(function (AggregationMetric) {
    /**
     * Unspecified aggregation metric.
     */
    AggregationMetric["AGGREGATION_METRIC_UNSPECIFIED"] = "AGGREGATION_METRIC_UNSPECIFIED";
    /**
     * Average aggregation metric. Not supported for Pairwise metric.
     */
    AggregationMetric["AVERAGE"] = "AVERAGE";
    /**
     * Mode aggregation metric.
     */
    AggregationMetric["MODE"] = "MODE";
    /**
     * Standard deviation aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["STANDARD_DEVIATION"] = "STANDARD_DEVIATION";
    /**
     * Variance aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["VARIANCE"] = "VARIANCE";
    /**
     * Minimum aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["MINIMUM"] = "MINIMUM";
    /**
     * Maximum aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["MAXIMUM"] = "MAXIMUM";
    /**
     * Median aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["MEDIAN"] = "MEDIAN";
    /**
     * 90th percentile aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["PERCENTILE_P90"] = "PERCENTILE_P90";
    /**
     * 95th percentile aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["PERCENTILE_P95"] = "PERCENTILE_P95";
    /**
     * 99th percentile aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["PERCENTILE_P99"] = "PERCENTILE_P99";
})(AggregationMetric || (AggregationMetric = {}));
/** Output only. Pairwise metric choice. This enum is not supported in Gemini API. */
var PairwiseChoice;
(function (PairwiseChoice) {
    /**
     * Unspecified prediction choice.
     */
    PairwiseChoice["PAIRWISE_CHOICE_UNSPECIFIED"] = "PAIRWISE_CHOICE_UNSPECIFIED";
    /**
     * Baseline prediction wins
     */
    PairwiseChoice["BASELINE"] = "BASELINE";
    /**
     * Candidate prediction wins
     */
    PairwiseChoice["CANDIDATE"] = "CANDIDATE";
    /**
     * Winner cannot be determined
     */
    PairwiseChoice["TIE"] = "TIE";
})(PairwiseChoice || (PairwiseChoice = {}));
/** The tuning task. Either I2V or T2V. This enum is not supported in Gemini API. */
var TuningTask;
(function (TuningTask) {
    /**
     * Default value. This value is unused.
     */
    TuningTask["TUNING_TASK_UNSPECIFIED"] = "TUNING_TASK_UNSPECIFIED";
    /**
     * Tuning task for image to video.
     */
    TuningTask["TUNING_TASK_I2V"] = "TUNING_TASK_I2V";
    /**
     * Tuning task for text to video.
     */
    TuningTask["TUNING_TASK_T2V"] = "TUNING_TASK_T2V";
    /**
     * Tuning task for reference to video.
     */
    TuningTask["TUNING_TASK_R2V"] = "TUNING_TASK_R2V";
})(TuningTask || (TuningTask = {}));
/** Output only. Current state of the `Document`. This enum is not supported in Vertex AI. */
var DocumentState;
(function (DocumentState) {
    /**
     * The default value. This value is used if the state is omitted.
     */
    DocumentState["STATE_UNSPECIFIED"] = "STATE_UNSPECIFIED";
    /**
     * Some `Chunks` of the `Document` are being processed (embedding and vector storage).
     */
    DocumentState["STATE_PENDING"] = "STATE_PENDING";
    /**
     * All `Chunks` of the `Document` is processed and available for querying.
     */
    DocumentState["STATE_ACTIVE"] = "STATE_ACTIVE";
    /**
     * Some `Chunks` of the `Document` failed processing.
     */
    DocumentState["STATE_FAILED"] = "STATE_FAILED";
})(DocumentState || (DocumentState = {}));
/** The tokenization quality used for given media. */
var PartMediaResolutionLevel;
(function (PartMediaResolutionLevel) {
    /**
     * Media resolution has not been set.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_UNSPECIFIED"] = "MEDIA_RESOLUTION_UNSPECIFIED";
    /**
     * Media resolution set to low.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_LOW"] = "MEDIA_RESOLUTION_LOW";
    /**
     * Media resolution set to medium.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_MEDIUM"] = "MEDIA_RESOLUTION_MEDIUM";
    /**
     * Media resolution set to high.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_HIGH"] = "MEDIA_RESOLUTION_HIGH";
    /**
     * Media resolution set to ultra high.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_ULTRA_HIGH"] = "MEDIA_RESOLUTION_ULTRA_HIGH";
})(PartMediaResolutionLevel || (PartMediaResolutionLevel = {}));
/** The type of tool in the function call. */
var ToolType;
(function (ToolType) {
    /**
     * Unspecified tool type.
     */
    ToolType["TOOL_TYPE_UNSPECIFIED"] = "TOOL_TYPE_UNSPECIFIED";
    /**
     * Google search tool, maps to Tool.google_search.search_types.web_search.
     */
    ToolType["GOOGLE_SEARCH_WEB"] = "GOOGLE_SEARCH_WEB";
    /**
     * Image search tool, maps to Tool.google_search.search_types.image_search.
     */
    ToolType["GOOGLE_SEARCH_IMAGE"] = "GOOGLE_SEARCH_IMAGE";
    /**
     * URL context tool, maps to Tool.url_context.
     */
    ToolType["URL_CONTEXT"] = "URL_CONTEXT";
    /**
     * Google maps tool, maps to Tool.google_maps.
     */
    ToolType["GOOGLE_MAPS"] = "GOOGLE_MAPS";
    /**
     * File search tool, maps to Tool.file_search.
     */
    ToolType["FILE_SEARCH"] = "FILE_SEARCH";
})(ToolType || (ToolType = {}));
/** Resource scope. */
var ResourceScope;
(function (ResourceScope) {
    /**
     * When setting base_url, this value configures resource scope to be the collection.
        The resource name will not include api version, project, or location.
        For example, if base_url is set to "https://aiplatform.googleapis.com",
        then the resource name for a Model would be
        "https://aiplatform.googleapis.com/publishers/google/models/gemini-3-pro-preview
     */
    ResourceScope["COLLECTION"] = "COLLECTION";
})(ResourceScope || (ResourceScope = {}));
/** Pricing and performance service tier. */
var ServiceTier;
(function (ServiceTier) {
    /**
     * Default service tier, which is standard.
     */
    ServiceTier["UNSPECIFIED"] = "unspecified";
    /**
     * Flex service tier.
     */
    ServiceTier["FLEX"] = "flex";
    /**
     * Standard service tier.
     */
    ServiceTier["STANDARD"] = "standard";
    /**
     * Priority service tier.
     */
    ServiceTier["PRIORITY"] = "priority";
})(ServiceTier || (ServiceTier = {}));
/** Options for feature selection preference. */
var FeatureSelectionPreference;
(function (FeatureSelectionPreference) {
    FeatureSelectionPreference["FEATURE_SELECTION_PREFERENCE_UNSPECIFIED"] = "FEATURE_SELECTION_PREFERENCE_UNSPECIFIED";
    FeatureSelectionPreference["PRIORITIZE_QUALITY"] = "PRIORITIZE_QUALITY";
    FeatureSelectionPreference["BALANCED"] = "BALANCED";
    FeatureSelectionPreference["PRIORITIZE_COST"] = "PRIORITIZE_COST";
})(FeatureSelectionPreference || (FeatureSelectionPreference = {}));
/** Enum representing the Vertex embedding API to use. */
var EmbeddingApiType;
(function (EmbeddingApiType) {
    /**
     * predict API endpoint (default)
     */
    EmbeddingApiType["PREDICT"] = "PREDICT";
    /**
     * embedContent API Endpoint
     */
    EmbeddingApiType["EMBED_CONTENT"] = "EMBED_CONTENT";
})(EmbeddingApiType || (EmbeddingApiType = {}));
/** Enum that controls the safety filter level for objectionable content. */
var SafetyFilterLevel;
(function (SafetyFilterLevel) {
    SafetyFilterLevel["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    SafetyFilterLevel["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    SafetyFilterLevel["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
    SafetyFilterLevel["BLOCK_NONE"] = "BLOCK_NONE";
})(SafetyFilterLevel || (SafetyFilterLevel = {}));
/** Enum that specifies the language of the text in the prompt. */
var ImagePromptLanguage;
(function (ImagePromptLanguage) {
    /**
     * Auto-detect the language.
     */
    ImagePromptLanguage["auto"] = "auto";
    /**
     * English
     */
    ImagePromptLanguage["en"] = "en";
    /**
     * Japanese
     */
    ImagePromptLanguage["ja"] = "ja";
    /**
     * Korean
     */
    ImagePromptLanguage["ko"] = "ko";
    /**
     * Hindi
     */
    ImagePromptLanguage["hi"] = "hi";
    /**
     * Chinese
     */
    ImagePromptLanguage["zh"] = "zh";
    /**
     * Portuguese
     */
    ImagePromptLanguage["pt"] = "pt";
    /**
     * Spanish
     */
    ImagePromptLanguage["es"] = "es";
})(ImagePromptLanguage || (ImagePromptLanguage = {}));
/** Enum representing the mask mode of a mask reference image. */
var MaskReferenceMode;
(function (MaskReferenceMode) {
    MaskReferenceMode["MASK_MODE_DEFAULT"] = "MASK_MODE_DEFAULT";
    MaskReferenceMode["MASK_MODE_USER_PROVIDED"] = "MASK_MODE_USER_PROVIDED";
    MaskReferenceMode["MASK_MODE_BACKGROUND"] = "MASK_MODE_BACKGROUND";
    MaskReferenceMode["MASK_MODE_FOREGROUND"] = "MASK_MODE_FOREGROUND";
    MaskReferenceMode["MASK_MODE_SEMANTIC"] = "MASK_MODE_SEMANTIC";
})(MaskReferenceMode || (MaskReferenceMode = {}));
/** Enum representing the control type of a control reference image. */
var ControlReferenceType;
(function (ControlReferenceType) {
    ControlReferenceType["CONTROL_TYPE_DEFAULT"] = "CONTROL_TYPE_DEFAULT";
    ControlReferenceType["CONTROL_TYPE_CANNY"] = "CONTROL_TYPE_CANNY";
    ControlReferenceType["CONTROL_TYPE_SCRIBBLE"] = "CONTROL_TYPE_SCRIBBLE";
    ControlReferenceType["CONTROL_TYPE_FACE_MESH"] = "CONTROL_TYPE_FACE_MESH";
})(ControlReferenceType || (ControlReferenceType = {}));
/** Enum representing the subject type of a subject reference image. */
var SubjectReferenceType;
(function (SubjectReferenceType) {
    SubjectReferenceType["SUBJECT_TYPE_DEFAULT"] = "SUBJECT_TYPE_DEFAULT";
    SubjectReferenceType["SUBJECT_TYPE_PERSON"] = "SUBJECT_TYPE_PERSON";
    SubjectReferenceType["SUBJECT_TYPE_ANIMAL"] = "SUBJECT_TYPE_ANIMAL";
    SubjectReferenceType["SUBJECT_TYPE_PRODUCT"] = "SUBJECT_TYPE_PRODUCT";
})(SubjectReferenceType || (SubjectReferenceType = {}));
/** Enum representing the editing mode. */
var EditMode;
(function (EditMode) {
    EditMode["EDIT_MODE_DEFAULT"] = "EDIT_MODE_DEFAULT";
    EditMode["EDIT_MODE_INPAINT_REMOVAL"] = "EDIT_MODE_INPAINT_REMOVAL";
    EditMode["EDIT_MODE_INPAINT_INSERTION"] = "EDIT_MODE_INPAINT_INSERTION";
    EditMode["EDIT_MODE_OUTPAINT"] = "EDIT_MODE_OUTPAINT";
    EditMode["EDIT_MODE_CONTROLLED_EDITING"] = "EDIT_MODE_CONTROLLED_EDITING";
    EditMode["EDIT_MODE_STYLE"] = "EDIT_MODE_STYLE";
    EditMode["EDIT_MODE_BGSWAP"] = "EDIT_MODE_BGSWAP";
    EditMode["EDIT_MODE_PRODUCT_IMAGE"] = "EDIT_MODE_PRODUCT_IMAGE";
})(EditMode || (EditMode = {}));
/** Enum that represents the segmentation mode. */
var SegmentMode;
(function (SegmentMode) {
    SegmentMode["FOREGROUND"] = "FOREGROUND";
    SegmentMode["BACKGROUND"] = "BACKGROUND";
    SegmentMode["PROMPT"] = "PROMPT";
    SegmentMode["SEMANTIC"] = "SEMANTIC";
    SegmentMode["INTERACTIVE"] = "INTERACTIVE";
})(SegmentMode || (SegmentMode = {}));
/** Enum for the reference type of a video generation reference image. */
var VideoGenerationReferenceType;
(function (VideoGenerationReferenceType) {
    /**
     * A reference image that provides assets to the generated video,
        such as the scene, an object, a character, etc.
     */
    VideoGenerationReferenceType["ASSET"] = "ASSET";
    /**
     * A reference image that provides aesthetics including colors,
        lighting, texture, etc., to be used as the style of the generated video,
        such as 'anime', 'photography', 'origami', etc.
     */
    VideoGenerationReferenceType["STYLE"] = "STYLE";
})(VideoGenerationReferenceType || (VideoGenerationReferenceType = {}));
/** Enum for the mask mode of a video generation mask. */
var VideoGenerationMaskMode;
(function (VideoGenerationMaskMode) {
    /**
     * The image mask contains a masked rectangular region which is
        applied on the first frame of the input video. The object described in
        the prompt is inserted into this region and will appear in subsequent
        frames.
     */
    VideoGenerationMaskMode["INSERT"] = "INSERT";
    /**
     * The image mask is used to determine an object in the
        first video frame to track. This object is removed from the video.
     */
    VideoGenerationMaskMode["REMOVE"] = "REMOVE";
    /**
     * The image mask is used to determine a region in the
        video. Objects in this region will be removed.
     */
    VideoGenerationMaskMode["REMOVE_STATIC"] = "REMOVE_STATIC";
    /**
     * The image mask contains a masked rectangular region where
        the input video will go. The remaining area will be generated. Video
        masks are not supported.
     */
    VideoGenerationMaskMode["OUTPAINT"] = "OUTPAINT";
})(VideoGenerationMaskMode || (VideoGenerationMaskMode = {}));
/** Enum that controls the compression quality of the generated videos. */
var VideoCompressionQuality;
(function (VideoCompressionQuality) {
    /**
     * Optimized video compression quality. This will produce videos
        with a compressed, smaller file size.
     */
    VideoCompressionQuality["OPTIMIZED"] = "OPTIMIZED";
    /**
     * Lossless video compression quality. This will produce videos
        with a larger file size.
     */
    VideoCompressionQuality["LOSSLESS"] = "LOSSLESS";
})(VideoCompressionQuality || (VideoCompressionQuality = {}));
/** Enum representing the tuning method. */
var TuningMethod;
(function (TuningMethod) {
    /**
     * Supervised fine tuning.
     */
    TuningMethod["SUPERVISED_FINE_TUNING"] = "SUPERVISED_FINE_TUNING";
    /**
     * Preference optimization tuning.
     */
    TuningMethod["PREFERENCE_TUNING"] = "PREFERENCE_TUNING";
    /**
     * Distillation tuning.
     */
    TuningMethod["DISTILLATION"] = "DISTILLATION";
})(TuningMethod || (TuningMethod = {}));
/** State for the lifecycle of a File. */
var FileState;
(function (FileState) {
    FileState["STATE_UNSPECIFIED"] = "STATE_UNSPECIFIED";
    FileState["PROCESSING"] = "PROCESSING";
    FileState["ACTIVE"] = "ACTIVE";
    FileState["FAILED"] = "FAILED";
})(FileState || (FileState = {}));
/** Source of the File. */
var FileSource;
(function (FileSource) {
    FileSource["SOURCE_UNSPECIFIED"] = "SOURCE_UNSPECIFIED";
    FileSource["UPLOADED"] = "UPLOADED";
    FileSource["GENERATED"] = "GENERATED";
    FileSource["REGISTERED"] = "REGISTERED";
})(FileSource || (FileSource = {}));
/** The reason why the turn is complete. */
var TurnCompleteReason;
(function (TurnCompleteReason) {
    /**
     * Default value. Reason is unspecified.
     */
    TurnCompleteReason["TURN_COMPLETE_REASON_UNSPECIFIED"] = "TURN_COMPLETE_REASON_UNSPECIFIED";
    /**
     * The function call generated by the model is invalid.
     */
    TurnCompleteReason["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
    /**
     * The response is rejected by the model.
     */
    TurnCompleteReason["RESPONSE_REJECTED"] = "RESPONSE_REJECTED";
    /**
     * Needs more input from the user.
     */
    TurnCompleteReason["NEED_MORE_INPUT"] = "NEED_MORE_INPUT";
})(TurnCompleteReason || (TurnCompleteReason = {}));
/** Server content modalities. */
var MediaModality;
(function (MediaModality) {
    /**
     * The modality is unspecified.
     */
    MediaModality["MODALITY_UNSPECIFIED"] = "MODALITY_UNSPECIFIED";
    /**
     * Plain text.
     */
    MediaModality["TEXT"] = "TEXT";
    /**
     * Images.
     */
    MediaModality["IMAGE"] = "IMAGE";
    /**
     * Video.
     */
    MediaModality["VIDEO"] = "VIDEO";
    /**
     * Audio.
     */
    MediaModality["AUDIO"] = "AUDIO";
    /**
     * Document, e.g. PDF.
     */
    MediaModality["DOCUMENT"] = "DOCUMENT";
})(MediaModality || (MediaModality = {}));
/** The type of the VAD signal. */
var VadSignalType;
(function (VadSignalType) {
    /**
     * The default is VAD_SIGNAL_TYPE_UNSPECIFIED.
     */
    VadSignalType["VAD_SIGNAL_TYPE_UNSPECIFIED"] = "VAD_SIGNAL_TYPE_UNSPECIFIED";
    /**
     * Start of sentence signal.
     */
    VadSignalType["VAD_SIGNAL_TYPE_SOS"] = "VAD_SIGNAL_TYPE_SOS";
    /**
     * End of sentence signal.
     */
    VadSignalType["VAD_SIGNAL_TYPE_EOS"] = "VAD_SIGNAL_TYPE_EOS";
})(VadSignalType || (VadSignalType = {}));
/** The type of the voice activity signal. */
var VoiceActivityType;
(function (VoiceActivityType) {
    /**
     * The default is VOICE_ACTIVITY_TYPE_UNSPECIFIED.
     */
    VoiceActivityType["TYPE_UNSPECIFIED"] = "TYPE_UNSPECIFIED";
    /**
     * Start of sentence signal.
     */
    VoiceActivityType["ACTIVITY_START"] = "ACTIVITY_START";
    /**
     * End of sentence signal.
     */
    VoiceActivityType["ACTIVITY_END"] = "ACTIVITY_END";
})(VoiceActivityType || (VoiceActivityType = {}));
/** Start of speech sensitivity. */
var StartSensitivity;
(function (StartSensitivity) {
    /**
     * The default is START_SENSITIVITY_LOW.
     */
    StartSensitivity["START_SENSITIVITY_UNSPECIFIED"] = "START_SENSITIVITY_UNSPECIFIED";
    /**
     * Automatic detection will detect the start of speech more often.
     */
    StartSensitivity["START_SENSITIVITY_HIGH"] = "START_SENSITIVITY_HIGH";
    /**
     * Automatic detection will detect the start of speech less often.
     */
    StartSensitivity["START_SENSITIVITY_LOW"] = "START_SENSITIVITY_LOW";
})(StartSensitivity || (StartSensitivity = {}));
/** End of speech sensitivity. */
var EndSensitivity;
(function (EndSensitivity) {
    /**
     * The default is END_SENSITIVITY_LOW.
     */
    EndSensitivity["END_SENSITIVITY_UNSPECIFIED"] = "END_SENSITIVITY_UNSPECIFIED";
    /**
     * Automatic detection ends speech more often.
     */
    EndSensitivity["END_SENSITIVITY_HIGH"] = "END_SENSITIVITY_HIGH";
    /**
     * Automatic detection ends speech less often.
     */
    EndSensitivity["END_SENSITIVITY_LOW"] = "END_SENSITIVITY_LOW";
})(EndSensitivity || (EndSensitivity = {}));
/** The different ways of handling user activity. */
var ActivityHandling;
(function (ActivityHandling) {
    /**
     * If unspecified, the default behavior is `START_OF_ACTIVITY_INTERRUPTS`.
     */
    ActivityHandling["ACTIVITY_HANDLING_UNSPECIFIED"] = "ACTIVITY_HANDLING_UNSPECIFIED";
    /**
     * If true, start of activity will interrupt the model's response (also called "barge in"). The model's current response will be cut-off in the moment of the interruption. This is the default behavior.
     */
    ActivityHandling["START_OF_ACTIVITY_INTERRUPTS"] = "START_OF_ACTIVITY_INTERRUPTS";
    /**
     * The model's response will not be interrupted.
     */
    ActivityHandling["NO_INTERRUPTION"] = "NO_INTERRUPTION";
})(ActivityHandling || (ActivityHandling = {}));
/** Options about which input is included in the user's turn. */
var TurnCoverage;
(function (TurnCoverage) {
    /**
     * If unspecified, the default behavior is `TURN_INCLUDES_ONLY_ACTIVITY`.
     */
    TurnCoverage["TURN_COVERAGE_UNSPECIFIED"] = "TURN_COVERAGE_UNSPECIFIED";
    /**
     * The users turn only includes activity since the last turn, excluding inactivity (e.g. silence on the audio stream). This is the default behavior.
     */
    TurnCoverage["TURN_INCLUDES_ONLY_ACTIVITY"] = "TURN_INCLUDES_ONLY_ACTIVITY";
    /**
     * The users turn includes all realtime input since the last turn, including inactivity (e.g. silence on the audio stream).
     */
    TurnCoverage["TURN_INCLUDES_ALL_INPUT"] = "TURN_INCLUDES_ALL_INPUT";
    /**
     * Includes audio activity and all video since the last turn. With automatic activity detection, audio activity means speech and excludes silence.
     */
    TurnCoverage["TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO"] = "TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO";
})(TurnCoverage || (TurnCoverage = {}));
/** Scale of the generated music. */
var Scale;
(function (Scale) {
    /**
     * Default value. This value is unused.
     */
    Scale["SCALE_UNSPECIFIED"] = "SCALE_UNSPECIFIED";
    /**
     * C major or A minor.
     */
    Scale["C_MAJOR_A_MINOR"] = "C_MAJOR_A_MINOR";
    /**
     * Db major or Bb minor.
     */
    Scale["D_FLAT_MAJOR_B_FLAT_MINOR"] = "D_FLAT_MAJOR_B_FLAT_MINOR";
    /**
     * D major or B minor.
     */
    Scale["D_MAJOR_B_MINOR"] = "D_MAJOR_B_MINOR";
    /**
     * Eb major or C minor
     */
    Scale["E_FLAT_MAJOR_C_MINOR"] = "E_FLAT_MAJOR_C_MINOR";
    /**
     * E major or Db minor.
     */
    Scale["E_MAJOR_D_FLAT_MINOR"] = "E_MAJOR_D_FLAT_MINOR";
    /**
     * F major or D minor.
     */
    Scale["F_MAJOR_D_MINOR"] = "F_MAJOR_D_MINOR";
    /**
     * Gb major or Eb minor.
     */
    Scale["G_FLAT_MAJOR_E_FLAT_MINOR"] = "G_FLAT_MAJOR_E_FLAT_MINOR";
    /**
     * G major or E minor.
     */
    Scale["G_MAJOR_E_MINOR"] = "G_MAJOR_E_MINOR";
    /**
     * Ab major or F minor.
     */
    Scale["A_FLAT_MAJOR_F_MINOR"] = "A_FLAT_MAJOR_F_MINOR";
    /**
     * A major or Gb minor.
     */
    Scale["A_MAJOR_G_FLAT_MINOR"] = "A_MAJOR_G_FLAT_MINOR";
    /**
     * Bb major or G minor.
     */
    Scale["B_FLAT_MAJOR_G_MINOR"] = "B_FLAT_MAJOR_G_MINOR";
    /**
     * B major or Ab minor.
     */
    Scale["B_MAJOR_A_FLAT_MINOR"] = "B_MAJOR_A_FLAT_MINOR";
})(Scale || (Scale = {}));
/** The mode of music generation. */
var MusicGenerationMode;
(function (MusicGenerationMode) {
    /**
     * Rely on the server default generation mode.
     */
    MusicGenerationMode["MUSIC_GENERATION_MODE_UNSPECIFIED"] = "MUSIC_GENERATION_MODE_UNSPECIFIED";
    /**
     * Steer text prompts to regions of latent space with higher quality
        music.
     */
    MusicGenerationMode["QUALITY"] = "QUALITY";
    /**
     * Steer text prompts to regions of latent space with a larger
        diversity of music.
     */
    MusicGenerationMode["DIVERSITY"] = "DIVERSITY";
    /**
     * Steer text prompts to regions of latent space more likely to
        generate music with vocals.
     */
    MusicGenerationMode["VOCALIZATION"] = "VOCALIZATION";
})(MusicGenerationMode || (MusicGenerationMode = {}));
/** The playback control signal to apply to the music generation. */
var LiveMusicPlaybackControl;
(function (LiveMusicPlaybackControl) {
    /**
     * This value is unused.
     */
    LiveMusicPlaybackControl["PLAYBACK_CONTROL_UNSPECIFIED"] = "PLAYBACK_CONTROL_UNSPECIFIED";
    /**
     * Start generating the music.
     */
    LiveMusicPlaybackControl["PLAY"] = "PLAY";
    /**
     * Hold the music generation. Use PLAY to resume from the current position.
     */
    LiveMusicPlaybackControl["PAUSE"] = "PAUSE";
    /**
     * Stop the music generation and reset the context (prompts retained).
        Use PLAY to restart the music generation.
     */
    LiveMusicPlaybackControl["STOP"] = "STOP";
    /**
     * Reset the context of the music generation without stopping it.
        Retains the current prompts and config.
     */
    LiveMusicPlaybackControl["RESET_CONTEXT"] = "RESET_CONTEXT";
})(LiveMusicPlaybackControl || (LiveMusicPlaybackControl = {}));
/** A wrapper class for the http response. */
class HttpResponse {
    constructor(response) {
        // Process the headers.
        const headers = {};
        for (const pair of response.headers.entries()) {
            headers[pair[0]] = pair[1];
        }
        this.headers = headers;
        // Keep the original response.
        this.responseInternal = response;
    }
    json() {
        return this.responseInternal.json();
    }
}
/** Long-running operation for uploading a file to a FileSearchStore. */
class UploadToFileSearchStoreOperation {
    /**
     * Instantiates an Operation of the same type as the one being called with the fields set from the API response.
     */
    _fromAPIResponse({ apiResponse, _isVertexAI, }) {
        const operation = new UploadToFileSearchStoreOperation();
        const op = apiResponse;
        const response = uploadToFileSearchStoreOperationFromMldev(op);
        Object.assign(operation, response);
        return operation;
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const CONTENT_TYPE_HEADER = 'Content-Type';
const SERVER_TIMEOUT_HEADER = 'X-Server-Timeout';
const USER_AGENT_HEADER = 'User-Agent';
const GOOGLE_API_CLIENT_HEADER = 'x-goog-api-client';
const SDK_VERSION = '1.48.0'; // x-release-please-version
const LIBRARY_LABEL = `google-genai-sdk/${SDK_VERSION}`;
const VERTEX_AI_API_DEFAULT_VERSION = 'v1beta1';
const GOOGLE_AI_API_DEFAULT_VERSION = 'v1beta';
// Default retry options.
// The config is based on https://cloud.google.com/storage/docs/retry-strategy.
const DEFAULT_RETRY_ATTEMPTS = 5; // Including the initial call
// LINT.IfChange
const DEFAULT_RETRY_HTTP_STATUS_CODES = [
    408, // Request timeout
    429, // Too many requests
    500, // Internal server error
    502, // Bad gateway
    503, // Service unavailable
    504, // Gateway timeout
];
/**
 * The ApiClient class is used to send requests to the Gemini API or Vertex AI
 * endpoints.
 *
 * WARNING: This is an internal API and may change without notice. Direct usage
 * is not supported and may break your application.
 */
class ApiClient {
    constructor(opts) {
        var _a, _b, _c;
        this.clientOptions = Object.assign({}, opts);
        this.customBaseUrl = (_a = opts.httpOptions) === null || _a === void 0 ? void 0 : _a.baseUrl;
        if (this.clientOptions.vertexai) {
            if (this.clientOptions.project && this.clientOptions.location) {
                this.clientOptions.apiKey = undefined;
            }
            else if (this.clientOptions.apiKey) {
                this.clientOptions.project = undefined;
                this.clientOptions.location = undefined;
            }
        }
        const initHttpOptions = {};
        if (this.clientOptions.vertexai) {
            if (!this.clientOptions.location &&
                !this.clientOptions.apiKey &&
                !this.customBaseUrl) {
                this.clientOptions.location = 'global';
            }
            const hasSufficientAuth = (this.clientOptions.project && this.clientOptions.location) ||
                this.clientOptions.apiKey;
            if (!hasSufficientAuth && !this.customBaseUrl) {
                throw new Error('Authentication is not set up. Please provide either a project and location, or an API key, or a custom base URL.');
            }
            const hasConstructorAuth = (opts.project && opts.location) || !!opts.apiKey;
            if (this.customBaseUrl && !hasConstructorAuth) {
                initHttpOptions.baseUrl = this.customBaseUrl;
                this.clientOptions.project = undefined;
                this.clientOptions.location = undefined;
            }
            else if (this.clientOptions.apiKey ||
                this.clientOptions.location === 'global') {
                // Vertex Express or global endpoint case.
                initHttpOptions.baseUrl = 'https://aiplatform.googleapis.com/';
            }
            else if (this.clientOptions.project &&
                this.clientOptions.location &&
                this.clientOptions.location === 'us') {
                initHttpOptions.baseUrl = `https://aiplatform.${this.clientOptions.location}.rep.googleapis.com/`;
            }
            else if (this.clientOptions.project && this.clientOptions.location) {
                initHttpOptions.baseUrl = `https://${this.clientOptions.location}-aiplatform.googleapis.com/`;
            }
            initHttpOptions.apiVersion =
                (_b = this.clientOptions.apiVersion) !== null && _b !== void 0 ? _b : VERTEX_AI_API_DEFAULT_VERSION;
        }
        else {
            // Gemini API
            if (!this.clientOptions.apiKey) {
                console.warn('API key should be set when using the Gemini API.');
            }
            initHttpOptions.apiVersion =
                (_c = this.clientOptions.apiVersion) !== null && _c !== void 0 ? _c : GOOGLE_AI_API_DEFAULT_VERSION;
            initHttpOptions.baseUrl = `https://generativelanguage.googleapis.com/`;
        }
        initHttpOptions.headers = this.getDefaultHeaders();
        this.clientOptions.httpOptions = initHttpOptions;
        if (opts.httpOptions) {
            this.clientOptions.httpOptions = this.patchHttpOptions(initHttpOptions, opts.httpOptions);
        }
    }
    isVertexAI() {
        var _a;
        return (_a = this.clientOptions.vertexai) !== null && _a !== void 0 ? _a : false;
    }
    getProject() {
        return this.clientOptions.project;
    }
    getLocation() {
        return this.clientOptions.location;
    }
    getCustomBaseUrl() {
        return this.customBaseUrl;
    }
    async getAuthHeaders() {
        const headers = new Headers();
        await this.clientOptions.auth.addAuthHeaders(headers);
        return headers;
    }
    getApiVersion() {
        if (this.clientOptions.httpOptions &&
            this.clientOptions.httpOptions.apiVersion !== undefined) {
            return this.clientOptions.httpOptions.apiVersion;
        }
        throw new Error('API version is not set.');
    }
    getBaseUrl() {
        if (this.clientOptions.httpOptions &&
            this.clientOptions.httpOptions.baseUrl !== undefined) {
            return this.clientOptions.httpOptions.baseUrl;
        }
        throw new Error('Base URL is not set.');
    }
    getRequestUrl() {
        return this.getRequestUrlInternal(this.clientOptions.httpOptions);
    }
    getHeaders() {
        if (this.clientOptions.httpOptions &&
            this.clientOptions.httpOptions.headers !== undefined) {
            return this.clientOptions.httpOptions.headers;
        }
        else {
            throw new Error('Headers are not set.');
        }
    }
    getRequestUrlInternal(httpOptions) {
        if (!httpOptions ||
            httpOptions.baseUrl === undefined ||
            httpOptions.apiVersion === undefined) {
            throw new Error('HTTP options are not correctly set.');
        }
        const baseUrl = httpOptions.baseUrl.endsWith('/')
            ? httpOptions.baseUrl.slice(0, -1)
            : httpOptions.baseUrl;
        const urlElement = [baseUrl];
        if (httpOptions.apiVersion && httpOptions.apiVersion !== '') {
            urlElement.push(httpOptions.apiVersion);
        }
        return urlElement.join('/');
    }
    getBaseResourcePath() {
        return `projects/${this.clientOptions.project}/locations/${this.clientOptions.location}`;
    }
    getApiKey() {
        return this.clientOptions.apiKey;
    }
    getWebsocketBaseUrl() {
        const baseUrl = this.getBaseUrl();
        const urlParts = new URL(baseUrl);
        urlParts.protocol = urlParts.protocol == 'http:' ? 'ws' : 'wss';
        return urlParts.toString();
    }
    setBaseUrl(url) {
        if (this.clientOptions.httpOptions) {
            this.clientOptions.httpOptions.baseUrl = url;
        }
        else {
            throw new Error('HTTP options are not correctly set.');
        }
    }
    constructUrl(path, httpOptions, prependProjectLocation) {
        const urlElement = [this.getRequestUrlInternal(httpOptions)];
        if (prependProjectLocation) {
            urlElement.push(this.getBaseResourcePath());
        }
        if (path !== '') {
            urlElement.push(path);
        }
        const url = new URL(`${urlElement.join('/')}`);
        return url;
    }
    shouldPrependVertexProjectPath(request, httpOptions) {
        if (httpOptions.baseUrl &&
            httpOptions.baseUrlResourceScope === ResourceScope.COLLECTION) {
            return false;
        }
        if (this.clientOptions.apiKey) {
            return false;
        }
        if (!this.clientOptions.vertexai) {
            return false;
        }
        if (request.path.startsWith('projects/')) {
            // Assume the path already starts with
            // `projects/<project>/location/<location>`.
            return false;
        }
        if (request.httpMethod === 'GET' &&
            request.path.startsWith('publishers/google/models')) {
            // These paths are used by Vertex's models.get and models.list
            // calls. For base models Vertex does not accept a project/location
            // prefix (for tuned model the prefix is required).
            return false;
        }
        return true;
    }
    async request(request) {
        let patchedHttpOptions = this.clientOptions.httpOptions;
        if (request.httpOptions) {
            patchedHttpOptions = this.patchHttpOptions(this.clientOptions.httpOptions, request.httpOptions);
        }
        const prependProjectLocation = this.shouldPrependVertexProjectPath(request, patchedHttpOptions);
        const url = this.constructUrl(request.path, patchedHttpOptions, prependProjectLocation);
        if (request.queryParams) {
            for (const [key, value] of Object.entries(request.queryParams)) {
                url.searchParams.append(key, String(value));
            }
        }
        let requestInit = {};
        if (request.httpMethod === 'GET') {
            if (request.body && request.body !== '{}') {
                throw new Error('Request body should be empty for GET request, but got non empty request body');
            }
        }
        else {
            requestInit.body = request.body;
        }
        requestInit = await this.includeExtraHttpOptionsToRequestInit(requestInit, patchedHttpOptions, url.toString(), request.abortSignal);
        return this.unaryApiCall(url, requestInit, request.httpMethod);
    }
    patchHttpOptions(baseHttpOptions, requestHttpOptions) {
        const patchedHttpOptions = JSON.parse(JSON.stringify(baseHttpOptions));
        for (const [key, value] of Object.entries(requestHttpOptions)) {
            // Records compile to objects.
            if (typeof value === 'object') {
                // @ts-expect-error TS2345TS7053: Element implicitly has an 'any' type
                // because expression of type 'string' can't be used to index type
                // 'HttpOptions'.
                patchedHttpOptions[key] = Object.assign(Object.assign({}, patchedHttpOptions[key]), value);
            }
            else if (value !== undefined) {
                // @ts-expect-error TS2345TS7053: Element implicitly has an 'any' type
                // because expression of type 'string' can't be used to index type
                // 'HttpOptions'.
                patchedHttpOptions[key] = value;
            }
        }
        return patchedHttpOptions;
    }
    async requestStream(request) {
        let patchedHttpOptions = this.clientOptions.httpOptions;
        if (request.httpOptions) {
            patchedHttpOptions = this.patchHttpOptions(this.clientOptions.httpOptions, request.httpOptions);
        }
        const prependProjectLocation = this.shouldPrependVertexProjectPath(request, patchedHttpOptions);
        const url = this.constructUrl(request.path, patchedHttpOptions, prependProjectLocation);
        if (!url.searchParams.has('alt') || url.searchParams.get('alt') !== 'sse') {
            url.searchParams.set('alt', 'sse');
        }
        let requestInit = {};
        requestInit.body = request.body;
        requestInit = await this.includeExtraHttpOptionsToRequestInit(requestInit, patchedHttpOptions, url.toString(), request.abortSignal);
        return this.streamApiCall(url, requestInit, request.httpMethod);
    }
    async includeExtraHttpOptionsToRequestInit(requestInit, httpOptions, url, abortSignal) {
        if ((httpOptions && httpOptions.timeout) || abortSignal) {
            const abortController = new AbortController();
            const signal = abortController.signal;
            if (httpOptions.timeout && (httpOptions === null || httpOptions === void 0 ? void 0 : httpOptions.timeout) > 0) {
                const timeoutHandle = setTimeout(() => abortController.abort(), httpOptions.timeout);
                if (timeoutHandle &&
                    typeof timeoutHandle.unref ===
                        'function') {
                    // call unref to prevent nodejs process from hanging, see
                    // https://nodejs.org/api/timers.html#timeoutunref
                    timeoutHandle.unref();
                }
            }
            if (abortSignal) {
                abortSignal.addEventListener('abort', () => {
                    abortController.abort();
                });
            }
            requestInit.signal = signal;
        }
        if (httpOptions && httpOptions.extraBody !== null) {
            includeExtraBodyToRequestInit(requestInit, httpOptions.extraBody);
        }
        requestInit.headers = await this.getHeadersInternal(httpOptions, url);
        return requestInit;
    }
    async unaryApiCall(url, requestInit, httpMethod) {
        return this.apiCall(url.toString(), Object.assign(Object.assign({}, requestInit), { method: httpMethod }))
            .then(async (response) => {
            await throwErrorIfNotOK(response);
            return new HttpResponse(response);
        })
            .catch((e) => {
            if (e instanceof Error) {
                throw e;
            }
            else {
                throw new Error(JSON.stringify(e));
            }
        });
    }
    async streamApiCall(url, requestInit, httpMethod) {
        return this.apiCall(url.toString(), Object.assign(Object.assign({}, requestInit), { method: httpMethod }))
            .then(async (response) => {
            await throwErrorIfNotOK(response);
            return this.processStreamResponse(response);
        })
            .catch((e) => {
            if (e instanceof Error) {
                throw e;
            }
            else {
                throw new Error(JSON.stringify(e));
            }
        });
    }
    processStreamResponse(response) {
        return __asyncGenerator(this, arguments, function* processStreamResponse_1() {
            var _a;
            const reader = (_a = response === null || response === void 0 ? void 0 : response.body) === null || _a === void 0 ? void 0 : _a.getReader();
            const decoder = new TextDecoder('utf-8');
            if (!reader) {
                throw new Error('Response body is empty');
            }
            try {
                let buffer = '';
                const dataPrefix = 'data:';
                const delimiters = ['\n\n', '\r\r', '\r\n\r\n'];
                while (true) {
                    const { done, value } = yield __await(reader.read());
                    if (done) {
                        if (buffer.trim().length > 0) {
                            throw new Error('Incomplete JSON segment at the end');
                        }
                        break;
                    }
                    const chunkString = decoder.decode(value, { stream: true });
                    // Parse and throw an error if the chunk contains an error.
                    try {
                        const chunkJson = JSON.parse(chunkString);
                        if ('error' in chunkJson) {
                            const errorJson = JSON.parse(JSON.stringify(chunkJson['error']));
                            const status = errorJson['status'];
                            const code = errorJson['code'];
                            const errorMessage = `got status: ${status}. ${JSON.stringify(chunkJson)}`;
                            if (code >= 400 && code < 600) {
                                const apiError = new ApiError({
                                    message: errorMessage,
                                    status: code,
                                });
                                throw apiError;
                            }
                        }
                    }
                    catch (e) {
                        const error = e;
                        if (error.name === 'ApiError') {
                            throw e;
                        }
                    }
                    buffer += chunkString;
                    let delimiterIndex = -1;
                    let delimiterLength = 0;
                    while (true) {
                        delimiterIndex = -1;
                        delimiterLength = 0;
                        for (const delimiter of delimiters) {
                            const index = buffer.indexOf(delimiter);
                            if (index !== -1 &&
                                (delimiterIndex === -1 || index < delimiterIndex)) {
                                delimiterIndex = index;
                                delimiterLength = delimiter.length;
                            }
                        }
                        if (delimiterIndex === -1) {
                            break; // No complete event in buffer
                        }
                        const eventString = buffer.substring(0, delimiterIndex);
                        buffer = buffer.substring(delimiterIndex + delimiterLength);
                        const trimmedEvent = eventString.trim();
                        if (trimmedEvent.startsWith(dataPrefix)) {
                            const processedChunkString = trimmedEvent
                                .substring(dataPrefix.length)
                                .trim();
                            try {
                                const partialResponse = new Response(processedChunkString, {
                                    headers: response === null || response === void 0 ? void 0 : response.headers,
                                    status: response === null || response === void 0 ? void 0 : response.status,
                                    statusText: response === null || response === void 0 ? void 0 : response.statusText,
                                });
                                yield yield __await(new HttpResponse(partialResponse));
                            }
                            catch (e) {
                                throw new Error(`exception parsing stream chunk ${processedChunkString}. ${e}`);
                            }
                        }
                    }
                }
            }
            finally {
                reader.releaseLock();
            }
        });
    }
    async apiCall(url, requestInit) {
        var _a;
        if (!this.clientOptions.httpOptions ||
            !this.clientOptions.httpOptions.retryOptions) {
            return fetch(url, requestInit);
        }
        const retryOptions = this.clientOptions.httpOptions.retryOptions;
        const runFetch = async () => {
            const response = await fetch(url, requestInit);
            if (response.ok) {
                return response;
            }
            if (DEFAULT_RETRY_HTTP_STATUS_CODES.includes(response.status)) {
                throw new Error(`Retryable HTTP Error: ${response.statusText}`);
            }
            throw new pRetry.AbortError(`Non-retryable exception ${response.statusText} sending request`);
        };
        return pRetry(runFetch, {
            // Retry attempts is one less than the number of total attempts.
            retries: ((_a = retryOptions.attempts) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_ATTEMPTS) - 1,
        });
    }
    getDefaultHeaders() {
        const headers = {};
        const versionHeaderValue = LIBRARY_LABEL + ' ' + this.clientOptions.userAgentExtra;
        headers[USER_AGENT_HEADER] = versionHeaderValue;
        headers[GOOGLE_API_CLIENT_HEADER] = versionHeaderValue;
        headers[CONTENT_TYPE_HEADER] = 'application/json';
        return headers;
    }
    async getHeadersInternal(httpOptions, url) {
        const headers = new Headers();
        if (httpOptions && httpOptions.headers) {
            for (const [key, value] of Object.entries(httpOptions.headers)) {
                headers.append(key, value);
            }
            // Append a timeout header if it is set, note that the timeout option is
            // in milliseconds but the header is in seconds.
            if (httpOptions.timeout && httpOptions.timeout > 0) {
                headers.append(SERVER_TIMEOUT_HEADER, String(Math.ceil(httpOptions.timeout / 1000)));
            }
        }
        await this.clientOptions.auth.addAuthHeaders(headers, url);
        return headers;
    }
    getFileName(file) {
        var _a;
        let fileName = '';
        if (typeof file === 'string') {
            fileName = file.replace(/[/\\]+$/, '');
            fileName = (_a = fileName.split(/[/\\]/).pop()) !== null && _a !== void 0 ? _a : '';
        }
        return fileName;
    }
    /**
     * Uploads a file asynchronously using Gemini API only, this is not supported
     * in Vertex AI.
     *
     * @param file The string path to the file to be uploaded or a Blob object.
     * @param config Optional parameters specified in the `UploadFileConfig`
     *     interface. @see {@link types.UploadFileConfig}
     * @return A promise that resolves to a `File` object.
     * @throws An error if called on a Vertex AI client.
     * @throws An error if the `mimeType` is not provided and can not be inferred,
     */
    async uploadFile(file, config) {
        var _a;
        const fileToUpload = {};
        if (config != null) {
            fileToUpload.mimeType = config.mimeType;
            fileToUpload.name = config.name;
            fileToUpload.displayName = config.displayName;
        }
        if (fileToUpload.name && !fileToUpload.name.startsWith('files/')) {
            fileToUpload.name = `files/${fileToUpload.name}`;
        }
        const uploader = this.clientOptions.uploader;
        const fileStat = await uploader.stat(file);
        fileToUpload.sizeBytes = String(fileStat.size);
        const mimeType = (_a = config === null || config === void 0 ? void 0 : config.mimeType) !== null && _a !== void 0 ? _a : fileStat.type;
        if (mimeType === undefined || mimeType === '') {
            throw new Error('Can not determine mimeType. Please provide mimeType in the config.');
        }
        fileToUpload.mimeType = mimeType;
        const body = {
            file: fileToUpload,
        };
        const fileName = this.getFileName(file);
        const path = formatMap('upload/v1beta/files', body['_url']);
        const uploadUrl = await this.fetchUploadUrl(path, fileToUpload.sizeBytes, fileToUpload.mimeType, fileName, body, config === null || config === void 0 ? void 0 : config.httpOptions);
        return uploader.upload(file, uploadUrl, this);
    }
    /**
     * Uploads a file to a given file search store asynchronously using Gemini API only, this is not supported
     * in Vertex AI.
     *
     * @param fileSearchStoreName The name of the file search store to upload the file to.
     * @param file The string path to the file to be uploaded or a Blob object.
     * @param config Optional parameters specified in the `UploadFileConfig`
     *     interface. @see {@link UploadFileConfig}
     * @return A promise that resolves to a `File` object.
     * @throws An error if called on a Vertex AI client.
     * @throws An error if the `mimeType` is not provided and can not be inferred,
     */
    async uploadFileToFileSearchStore(fileSearchStoreName, file, config) {
        var _a;
        const uploader = this.clientOptions.uploader;
        const fileStat = await uploader.stat(file);
        const sizeBytes = String(fileStat.size);
        const mimeType = (_a = config === null || config === void 0 ? void 0 : config.mimeType) !== null && _a !== void 0 ? _a : fileStat.type;
        if (mimeType === undefined || mimeType === '') {
            throw new Error('Can not determine mimeType. Please provide mimeType in the config.');
        }
        const path = `upload/v1beta/${fileSearchStoreName}:uploadToFileSearchStore`;
        const fileName = this.getFileName(file);
        const body = {};
        if (config != null) {
            uploadToFileSearchStoreConfigToMldev(config, body);
        }
        const uploadUrl = await this.fetchUploadUrl(path, sizeBytes, mimeType, fileName, body, config === null || config === void 0 ? void 0 : config.httpOptions);
        return uploader.uploadToFileSearchStore(file, uploadUrl, this);
    }
    /**
     * Downloads a file asynchronously to the specified path.
     *
     * @params params - The parameters for the download request, see {@link
     * types.DownloadFileParameters}
     */
    async downloadFile(params) {
        const downloader = this.clientOptions.downloader;
        await downloader.download(params, this);
    }
    async fetchUploadUrl(path, sizeBytes, mimeType, fileName, body, configHttpOptions) {
        var _a;
        let httpOptions = {};
        if (configHttpOptions) {
            httpOptions = configHttpOptions;
        }
        else {
            httpOptions = {
                apiVersion: '', // api-version is set in the path.
                headers: Object.assign({ 'Content-Type': 'application/json', 'X-Goog-Upload-Protocol': 'resumable', 'X-Goog-Upload-Command': 'start', 'X-Goog-Upload-Header-Content-Length': `${sizeBytes}`, 'X-Goog-Upload-Header-Content-Type': `${mimeType}` }, (fileName ? { 'X-Goog-Upload-File-Name': fileName } : {})),
            };
        }
        const httpResponse = await this.request({
            path,
            body: JSON.stringify(body),
            httpMethod: 'POST',
            httpOptions,
        });
        if (!httpResponse || !(httpResponse === null || httpResponse === void 0 ? void 0 : httpResponse.headers)) {
            throw new Error('Server did not return an HttpResponse or the returned HttpResponse did not have headers.');
        }
        const uploadUrl = (_a = httpResponse === null || httpResponse === void 0 ? void 0 : httpResponse.headers) === null || _a === void 0 ? void 0 : _a['x-goog-upload-url'];
        if (uploadUrl === undefined) {
            throw new Error('Failed to get upload url. Server did not return the x-google-upload-url in the headers');
        }
        return uploadUrl;
    }
}
async function throwErrorIfNotOK(response) {
    var _a;
    if (response === undefined) {
        throw new Error('response is undefined');
    }
    if (!response.ok) {
        const status = response.status;
        let errorBody;
        if ((_a = response.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('application/json')) {
            errorBody = await response.json();
        }
        else {
            errorBody = {
                error: {
                    message: await response.text(),
                    code: response.status,
                    status: response.statusText,
                },
            };
        }
        const errorMessage = JSON.stringify(errorBody);
        if (status >= 400 && status < 600) {
            const apiError = new ApiError({
                message: errorMessage,
                status: status,
            });
            throw apiError;
        }
        throw new Error(errorMessage);
    }
}
/**
 * Recursively updates the `requestInit.body` with values from an `extraBody` object.
 *
 * If `requestInit.body` is a string, it's assumed to be JSON and will be parsed.
 * The `extraBody` is then deeply merged into this parsed object.
 * If `requestInit.body` is a Blob, `extraBody` will be ignored, and a warning logged,
 * as merging structured data into an opaque Blob is not supported.
 *
 * The function does not enforce that updated values from `extraBody` have the
 * same type as existing values in `requestInit.body`. Type mismatches during
 * the merge will result in a warning, but the value from `extraBody` will overwrite
 * the original. `extraBody` users are responsible for ensuring `extraBody` has the correct structure.
 *
 * @param requestInit The RequestInit object whose body will be updated.
 * @param extraBody The object containing updates to be merged into `requestInit.body`.
 */
function includeExtraBodyToRequestInit(requestInit, extraBody) {
    if (!extraBody || Object.keys(extraBody).length === 0) {
        return;
    }
    if (requestInit.body instanceof Blob) {
        console.warn('includeExtraBodyToRequestInit: extraBody provided but current request body is a Blob. extraBody will be ignored as merging is not supported for Blob bodies.');
        return;
    }
    let currentBodyObject = {};
    // If adding new type to HttpRequest.body, please check the code below to
    // see if we need to update the logic.
    if (typeof requestInit.body === 'string' && requestInit.body.length > 0) {
        try {
            const parsedBody = JSON.parse(requestInit.body);
            if (typeof parsedBody === 'object' &&
                parsedBody !== null &&
                !Array.isArray(parsedBody)) {
                currentBodyObject = parsedBody;
            }
            else {
                console.warn('includeExtraBodyToRequestInit: Original request body is valid JSON but not a non-array object. Skip applying extraBody to the request body.');
                return;
            }
            /*  eslint-disable-next-line @typescript-eslint/no-unused-vars */
        }
        catch (e) {
            console.warn('includeExtraBodyToRequestInit: Original request body is not valid JSON. Skip applying extraBody to the request body.');
            return;
        }
    }
    function deepMerge(target, source) {
        const output = Object.assign({}, target);
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceValue = source[key];
                const targetValue = output[key];
                if (sourceValue &&
                    typeof sourceValue === 'object' &&
                    !Array.isArray(sourceValue) &&
                    targetValue &&
                    typeof targetValue === 'object' &&
                    !Array.isArray(targetValue)) {
                    output[key] = deepMerge(targetValue, sourceValue);
                }
                else {
                    if (targetValue &&
                        sourceValue &&
                        typeof targetValue !== typeof sourceValue) {
                        console.warn(`includeExtraBodyToRequestInit:deepMerge: Type mismatch for key "${key}". Original type: ${typeof targetValue}, New type: ${typeof sourceValue}. Overwriting.`);
                    }
                    output[key] = sourceValue;
                }
            }
        }
        return output;
    }
    const mergedBody = deepMerge(currentBodyObject, extraBody);
    requestInit.body = JSON.stringify(mergedBody);
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const GOOGLE_API_KEY_HEADER = 'x-goog-api-key';
const REQUIRED_VERTEX_AI_SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
class NodeAuth {
    constructor(opts) {
        if (opts.apiKey !== undefined) {
            this.apiKey = opts.apiKey;
            return;
        }
        const vertexAuthOptions = buildGoogleAuthOptions(opts.googleAuthOptions);
        this.googleAuth = new googleAuthLibrary.GoogleAuth(vertexAuthOptions);
    }
    async addAuthHeaders(headers, url) {
        if (this.apiKey !== undefined) {
            if (this.apiKey.startsWith('auth_tokens/')) {
                throw new Error('Ephemeral tokens are only supported by the live API.');
            }
            this.addKeyHeader(headers);
            return;
        }
        return this.addGoogleAuthHeaders(headers, url);
    }
    addKeyHeader(headers) {
        if (headers.get(GOOGLE_API_KEY_HEADER) !== null) {
            return;
        }
        if (this.apiKey === undefined) {
            // This should never happen, this method is only called
            // when apiKey is set.
            throw new Error('Trying to set API key header but apiKey is not set');
        }
        headers.append(GOOGLE_API_KEY_HEADER, this.apiKey);
    }
    async addGoogleAuthHeaders(headers, url) {
        if (this.googleAuth === undefined) {
            // This should never happen, addGoogleAuthHeaders should only be
            // called when there is no apiKey set and in these cases googleAuth
            // is set.
            throw new Error('Trying to set google-auth headers but googleAuth is unset');
        }
        const authHeaders = await this.googleAuth.getRequestHeaders(url);
        for (const [key, value] of authHeaders) {
            if (headers.get(key) !== null) {
                continue;
            }
            headers.append(key, value);
        }
    }
}
function buildGoogleAuthOptions(googleAuthOptions) {
    let authOptions;
    if (!googleAuthOptions) {
        authOptions = {
            scopes: [REQUIRED_VERTEX_AI_SCOPE],
        };
        return authOptions;
    }
    else {
        authOptions = googleAuthOptions;
        if (!authOptions.scopes) {
            authOptions.scopes = [REQUIRED_VERTEX_AI_SCOPE];
            return authOptions;
        }
        else if ((typeof authOptions.scopes === 'string' &&
            authOptions.scopes !== REQUIRED_VERTEX_AI_SCOPE) ||
            (Array.isArray(authOptions.scopes) &&
                authOptions.scopes.indexOf(REQUIRED_VERTEX_AI_SCOPE) < 0)) {
            throw new Error(`Invalid auth scopes. Scopes must include: ${REQUIRED_VERTEX_AI_SCOPE}`);
        }
        return authOptions;
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function _isFile(origin) {
    return (origin !== null &&
        origin !== undefined &&
        typeof origin === 'object' &&
        'name' in origin);
}
function isGeneratedVideo(origin) {
    return (origin !== null &&
        origin !== undefined &&
        typeof origin === 'object' &&
        'video' in origin);
}
function isVideo(origin) {
    return (origin !== null &&
        origin !== undefined &&
        typeof origin === 'object' &&
        'uri' in origin);
}
function tFileName(fromName) {
    var _a;
    let name;
    if (_isFile(fromName)) {
        name = fromName.name;
    }
    if (isVideo(fromName)) {
        name = fromName.uri;
        if (name === undefined) {
            return undefined;
        }
    }
    if (isGeneratedVideo(fromName)) {
        name = (_a = fromName.video) === null || _a === void 0 ? void 0 : _a.uri;
        if (name === undefined) {
            return undefined;
        }
    }
    if (typeof fromName === 'string') {
        name = fromName;
    }
    if (name === undefined) {
        throw new Error('Could not extract file name from the provided input.');
    }
    if (name.startsWith('https://')) {
        const suffix = name.split('files/')[1];
        const match = suffix.match(/[a-z0-9]+/);
        if (match === null) {
            throw new Error(`Could not extract file name from URI ${name}`);
        }
        name = match[0];
    }
    else if (name.startsWith('files/')) {
        name = name.split('files/')[1];
    }
    return name;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class NodeDownloader {
    async download(params, apiClient) {
        if (params.downloadPath) {
            const response = await downloadFile(params, apiClient);
            if (response instanceof HttpResponse) {
                const writer = fs.createWriteStream(params.downloadPath);
                const body = node_stream.Readable.fromWeb(response.responseInternal.body);
                body.pipe(writer);
                await promises.finished(writer);
            }
            else {
                try {
                    await fs$1.writeFile(params.downloadPath, response, {
                        encoding: 'base64',
                    });
                }
                catch (error) {
                    throw new Error(`Failed to write file to ${params.downloadPath}: ${error}`);
                }
            }
        }
    }
}
async function downloadFile(params, apiClient) {
    var _a, _b, _c;
    const name = tFileName(params.file);
    if (name !== undefined) {
        return await apiClient.request({
            path: `files/${name}:download`,
            httpMethod: 'GET',
            queryParams: {
                'alt': 'media',
            },
            httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
            abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
        });
    }
    else if (isGeneratedVideo(params.file)) {
        const videoBytes = (_c = params.file.video) === null || _c === void 0 ? void 0 : _c.videoBytes;
        if (typeof videoBytes === 'string') {
            return videoBytes;
        }
        else {
            throw new Error('Failed to download generated video, Uri or videoBytes not found.');
        }
    }
    else if (isVideo(params.file)) {
        const videoBytes = params.file.videoBytes;
        if (typeof videoBytes === 'string') {
            return videoBytes;
        }
        else {
            throw new Error('Failed to download video, Uri or videoBytes not found.');
        }
    }
    else {
        throw new Error('Unsupported file type');
    }
}

const MAX_CHUNK_SIZE = 1024 * 1024 * 8; // bytes
const MAX_RETRY_COUNT = 3;
const INITIAL_RETRY_DELAY_MS = 1000;
const DELAY_MULTIPLIER = 2;
const X_GOOG_UPLOAD_STATUS_HEADER_FIELD = 'x-goog-upload-status';
async function uploadBlob(file, uploadUrl, apiClient, httpOptions) {
    var _a;
    const response = await uploadBlobInternal(file, uploadUrl, apiClient, httpOptions);
    const responseJson = (await (response === null || response === void 0 ? void 0 : response.json()));
    if (((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) !== 'final') {
        throw new Error('Failed to upload file: Upload status is not finalized.');
    }
    return responseJson['file'];
}
async function uploadBlobToFileSearchStore(file, uploadUrl, apiClient, httpOptions) {
    var _a;
    const response = await uploadBlobInternal(file, uploadUrl, apiClient, httpOptions);
    const responseJson = (await (response === null || response === void 0 ? void 0 : response.json()));
    if (((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) !== 'final') {
        throw new Error('Failed to upload file: Upload status is not finalized.');
    }
    const resp = uploadToFileSearchStoreOperationFromMldev(responseJson);
    const typedResp = new UploadToFileSearchStoreOperation();
    Object.assign(typedResp, resp);
    return typedResp;
}
async function uploadBlobInternal(file, uploadUrl, apiClient, httpOptions) {
    var _a, _b, _c;
    let finalUrl = uploadUrl;
    const effectiveBaseUrl = (httpOptions === null || httpOptions === void 0 ? void 0 : httpOptions.baseUrl) || ((_a = apiClient.clientOptions.httpOptions) === null || _a === void 0 ? void 0 : _a.baseUrl);
    if (effectiveBaseUrl) {
        const baseUri = new URL(effectiveBaseUrl);
        const uploadUri = new URL(uploadUrl);
        uploadUri.protocol = baseUri.protocol;
        uploadUri.host = baseUri.host;
        uploadUri.port = baseUri.port;
        finalUrl = uploadUri.toString();
    }
    let fileSize = 0;
    let offset = 0;
    let response = new HttpResponse(new Response());
    let uploadCommand = 'upload';
    fileSize = file.size;
    while (offset < fileSize) {
        const chunkSize = Math.min(MAX_CHUNK_SIZE, fileSize - offset);
        const chunk = file.slice(offset, offset + chunkSize);
        if (offset + chunkSize >= fileSize) {
            uploadCommand += ', finalize';
        }
        let retryCount = 0;
        let currentDelayMs = INITIAL_RETRY_DELAY_MS;
        while (retryCount < MAX_RETRY_COUNT) {
            const mergedHeaders = Object.assign(Object.assign({}, ((httpOptions === null || httpOptions === void 0 ? void 0 : httpOptions.headers) || {})), { 'X-Goog-Upload-Command': uploadCommand, 'X-Goog-Upload-Offset': String(offset), 'Content-Length': String(chunkSize) });
            response = await apiClient.request({
                path: '',
                body: chunk,
                httpMethod: 'POST',
                httpOptions: Object.assign(Object.assign({}, httpOptions), { apiVersion: '', baseUrl: finalUrl, headers: mergedHeaders }),
            });
            if ((_b = response === null || response === void 0 ? void 0 : response.headers) === null || _b === void 0 ? void 0 : _b[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) {
                break;
            }
            retryCount++;
            await sleep(currentDelayMs);
            currentDelayMs = currentDelayMs * DELAY_MULTIPLIER;
        }
        offset += chunkSize;
        // The `x-goog-upload-status` header field can be `active`, `final` and
        //`cancelled` in resposne.
        if (((_c = response === null || response === void 0 ? void 0 : response.headers) === null || _c === void 0 ? void 0 : _c[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) !== 'active') {
            break;
        }
        // TODO(b/401391430) Investigate why the upload status is not finalized
        // even though all content has been uploaded.
        if (fileSize <= offset) {
            throw new Error('All content has been uploaded, but the upload status is not finalized.');
        }
    }
    return response;
}
async function getBlobStat(file) {
    const fileStat = { size: file.size, type: file.type };
    return fileStat;
}
function sleep(ms) {
    return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class NodeUploader {
    async stat(file) {
        const fileStat = { size: 0, type: undefined };
        if (typeof file === 'string') {
            const originalStat = await fs__namespace.stat(file);
            fileStat.size = originalStat.size;
            fileStat.type = this.inferMimeType(file);
            return fileStat;
        }
        else {
            return await getBlobStat(file);
        }
    }
    async upload(file, uploadUrl, apiClient, httpOptions) {
        if (typeof file === 'string') {
            return await this.uploadFileFromPath(file, uploadUrl, apiClient, httpOptions);
        }
        else {
            return uploadBlob(file, uploadUrl, apiClient, httpOptions);
        }
    }
    async uploadToFileSearchStore(file, uploadUrl, apiClient, httpOptions) {
        if (typeof file === 'string') {
            return await this.uploadFileToFileSearchStoreFromPath(file, uploadUrl, apiClient, httpOptions);
        }
        else {
            return uploadBlobToFileSearchStore(file, uploadUrl, apiClient, httpOptions);
        }
    }
    /**
     * Infers the MIME type of a file based on its extension.
     *
     * @param filePath The path to the file.
     * @returns The MIME type of the file, or undefined if it cannot be inferred.
     */
    inferMimeType(filePath) {
        // Get the file extension.
        const fileExtension = filePath.slice(filePath.lastIndexOf('.') + 1);
        // Create a map of file extensions to MIME types.
        const mimeTypes = {
            'aac': 'audio/aac',
            'abw': 'application/x-abiword',
            'arc': 'application/x-freearc',
            'avi': 'video/x-msvideo',
            'azw': 'application/vnd.amazon.ebook',
            'bin': 'application/octet-stream',
            'bmp': 'image/bmp',
            'bz': 'application/x-bzip',
            'bz2': 'application/x-bzip2',
            'csh': 'application/x-csh',
            'css': 'text/css',
            'csv': 'text/csv',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'eot': 'application/vnd.ms-fontobject',
            'epub': 'application/epub+zip',
            'gz': 'application/gzip',
            'gif': 'image/gif',
            'htm': 'text/html',
            'html': 'text/html',
            'ico': 'image/vnd.microsoft.icon',
            'ics': 'text/calendar',
            'jar': 'application/java-archive',
            'jpeg': 'image/jpeg',
            'jpg': 'image/jpeg',
            'js': 'text/javascript',
            'json': 'application/json',
            'jsonld': 'application/ld+json',
            'kml': 'application/vnd.google-earth.kml+xml',
            'kmz': 'application/vnd.google-earth.kmz+xml',
            'mjs': 'text/javascript',
            'mp3': 'audio/mpeg',
            'mp4': 'video/mp4',
            'mpeg': 'video/mpeg',
            'mpkg': 'application/vnd.apple.installer+xml',
            'odt': 'application/vnd.oasis.opendocument.text',
            'oga': 'audio/ogg',
            'ogv': 'video/ogg',
            'ogx': 'application/ogg',
            'opus': 'audio/opus',
            'otf': 'font/otf',
            'png': 'image/png',
            'pdf': 'application/pdf',
            'php': 'application/x-httpd-php',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'rar': 'application/vnd.rar',
            'rtf': 'application/rtf',
            'sh': 'application/x-sh',
            'svg': 'image/svg+xml',
            'swf': 'application/x-shockwave-flash',
            'tar': 'application/x-tar',
            'tif': 'image/tiff',
            'tiff': 'image/tiff',
            'ts': 'video/mp2t',
            'ttf': 'font/ttf',
            'txt': 'text/plain',
            'vsd': 'application/vnd.visio',
            'wav': 'audio/wav',
            'weba': 'audio/webm',
            'webm': 'video/webm',
            'webp': 'image/webp',
            'woff': 'font/woff',
            'woff2': 'font/woff2',
            'xhtml': 'application/xhtml+xml',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xml': 'application/xml',
            'xul': 'application/vnd.mozilla.xul+xml',
            'zip': 'application/zip',
            '3gp': 'video/3gpp',
            '3g2': 'video/3gpp2',
            '7z': 'application/x-7z-compressed',
        };
        // Look up the MIME type based on the file extension.
        const mimeType = mimeTypes[fileExtension.toLowerCase()];
        // Return the MIME type.
        return mimeType;
    }
    async uploadFileFromPath(file, uploadUrl, apiClient, httpOptions) {
        var _a;
        const response = await this.uploadFileFromPathInternal(file, uploadUrl, apiClient, httpOptions);
        const responseJson = (await (response === null || response === void 0 ? void 0 : response.json()));
        if (((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) !== 'final') {
            throw new Error('Failed to upload file: Upload status is not finalized.');
        }
        return responseJson['file'];
    }
    async uploadFileToFileSearchStoreFromPath(file, uploadUrl, apiClient, httpOptions) {
        var _a;
        const response = await this.uploadFileFromPathInternal(file, uploadUrl, apiClient, httpOptions);
        const responseJson = (await (response === null || response === void 0 ? void 0 : response.json()));
        if (((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) !== 'final') {
            throw new Error('Failed to upload file: Upload status is not finalized.');
        }
        const resp = uploadToFileSearchStoreOperationFromMldev(responseJson);
        const typedResp = new UploadToFileSearchStoreOperation();
        Object.assign(typedResp, resp);
        return typedResp;
    }
    async uploadFileFromPathInternal(file, uploadUrl, apiClient, httpOptions) {
        var _a, _b, _c;
        let finalUrl = uploadUrl;
        const effectiveBaseUrl = (httpOptions === null || httpOptions === void 0 ? void 0 : httpOptions.baseUrl) || ((_a = apiClient.clientOptions.httpOptions) === null || _a === void 0 ? void 0 : _a.baseUrl);
        if (effectiveBaseUrl) {
            const baseUri = new URL(effectiveBaseUrl);
            const uploadUri = new URL(uploadUrl);
            uploadUri.protocol = baseUri.protocol;
            uploadUri.host = baseUri.host;
            uploadUri.port = baseUri.port;
            finalUrl = uploadUri.toString();
        }
        let fileSize = 0;
        let offset = 0;
        let response = new HttpResponse(new Response());
        let uploadCommand = 'upload';
        let fileHandle;
        const fileName = path__namespace.basename(file);
        try {
            fileHandle = await fs__namespace.open(file, 'r');
            if (!fileHandle) {
                throw new Error(`Failed to open file`);
            }
            fileSize = (await fileHandle.stat()).size;
            while (offset < fileSize) {
                const chunkSize = Math.min(MAX_CHUNK_SIZE, fileSize - offset);
                if (offset + chunkSize >= fileSize) {
                    uploadCommand += ', finalize';
                }
                const buffer = new Uint8Array(chunkSize);
                const { bytesRead: bytesRead } = await fileHandle.read(buffer, 0, chunkSize, offset);
                if (bytesRead !== chunkSize) {
                    throw new Error(`Failed to read ${chunkSize} bytes from file at offset ${offset}. bytes actually read: ${bytesRead}`);
                }
                const chunk = new Blob([buffer]);
                let retryCount = 0;
                let currentDelayMs = INITIAL_RETRY_DELAY_MS;
                while (retryCount < MAX_RETRY_COUNT) {
                    const mergedHeaders = Object.assign(Object.assign({}, ((httpOptions === null || httpOptions === void 0 ? void 0 : httpOptions.headers) || {})), { 'X-Goog-Upload-Command': uploadCommand, 'X-Goog-Upload-Offset': String(offset), 'Content-Length': String(bytesRead), 'X-Goog-Upload-File-Name': fileName });
                    response = await apiClient.request({
                        path: '',
                        body: chunk,
                        httpMethod: 'POST',
                        httpOptions: Object.assign(Object.assign({}, httpOptions), { apiVersion: '', baseUrl: finalUrl, headers: mergedHeaders }),
                    });
                    if ((_b = response === null || response === void 0 ? void 0 : response.headers) === null || _b === void 0 ? void 0 : _b[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) {
                        break;
                    }
                    retryCount++;
                    await sleep(currentDelayMs);
                    currentDelayMs = currentDelayMs * DELAY_MULTIPLIER;
                }
                offset += bytesRead;
                // The `x-goog-upload-status` header field can be `active`, `final` and
                //`cancelled` in resposne.
                if (((_c = response === null || response === void 0 ? void 0 : response.headers) === null || _c === void 0 ? void 0 : _c[X_GOOG_UPLOAD_STATUS_HEADER_FIELD]) !== 'active') {
                    break;
                }
                if (fileSize <= offset) {
                    throw new Error('All content has been uploaded, but the upload status is not finalized.');
                }
            }
            return response;
        }
        finally {
            // Ensure the file handle is always closed
            if (fileHandle) {
                await fileHandle.close();
            }
        }
    }
}

exports.ApiClient = ApiClient;
exports.BaseModule = BaseModule;
exports.NodeAuth = NodeAuth;
exports.NodeDownloader = NodeDownloader;
exports.NodeUploader = NodeUploader;
exports.formatMap = formatMap;
exports.getValueByPath = getValueByPath;
exports.moveValueByPath = moveValueByPath;
exports.setValueByPath = setValueByPath;
//# sourceMappingURL=index.cjs.map
