import pRetry, { AbortError } from 'p-retry';

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let _defaultBaseGeminiUrl = undefined;
let _defaultBaseVertexUrl = undefined;
/**
 * Overrides the base URLs for the Gemini API and Vertex AI API.
 *
 * @remarks This function should be called before initializing the SDK. If the
 * base URLs are set after initializing the SDK, the base URLs will not be
 * updated. Base URLs provided in the HttpOptions will also take precedence over
 * URLs set here.
 *
 * @example
 * ```ts
 * import {GoogleGenAI, setDefaultBaseUrls} from '@google/genai';
 * // Override the base URL for the Gemini API.
 * setDefaultBaseUrls({geminiUrl:'https://gemini.google.com'});
 *
 * // Override the base URL for the Vertex AI API.
 * setDefaultBaseUrls({vertexUrl: 'https://vertexai.googleapis.com'});
 *
 * const ai = new GoogleGenAI({apiKey: 'GEMINI_API_KEY'});
 * ```
 */
function setDefaultBaseUrls(baseUrlParams) {
    _defaultBaseGeminiUrl = baseUrlParams.geminiUrl;
    _defaultBaseVertexUrl = baseUrlParams.vertexUrl;
}
/**
 * Returns the default base URLs for the Gemini API and Vertex AI API.
 */
function getDefaultBaseUrls() {
    return {
        geminiUrl: _defaultBaseGeminiUrl,
        vertexUrl: _defaultBaseVertexUrl,
    };
}
/**
 * Returns the default base URL based on the following priority:
 *   1. Base URLs set via HttpOptions.
 *   2. Base URLs set via the latest call to setDefaultBaseUrls.
 *   3. Base URLs set via environment variables.
 */
function getBaseUrl(httpOptions, vertexai, vertexBaseUrlFromEnv, geminiBaseUrlFromEnv) {
    var _a, _b;
    if (!(httpOptions === null || httpOptions === void 0 ? void 0 : httpOptions.baseUrl)) {
        const defaultBaseUrls = getDefaultBaseUrls();
        if (vertexai) {
            return (_a = defaultBaseUrls.vertexUrl) !== null && _a !== void 0 ? _a : vertexBaseUrlFromEnv;
        }
        else {
            return (_b = defaultBaseUrls.geminiUrl) !== null && _b !== void 0 ? _b : geminiBaseUrlFromEnv;
        }
    }
    return httpOptions.baseUrl;
}

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
function tBytes$1(fromBytes) {
    if (typeof fromBytes !== 'string') {
        throw new Error('fromImageBytes must be a string');
    }
    // TODO(b/389133914): Remove dummy bytes converter.
    return fromBytes;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Code generated by the Google Gen AI SDK generator DO NOT EDIT.
function fetchPredictOperationParametersToVertex(fromObject) {
    const toObject = {};
    const fromOperationName = getValueByPath(fromObject, [
        'operationName',
    ]);
    if (fromOperationName != null) {
        setValueByPath(toObject, ['operationName'], fromOperationName);
    }
    const fromResourceName = getValueByPath(fromObject, ['resourceName']);
    if (fromResourceName != null) {
        setValueByPath(toObject, ['_url', 'resourceName'], fromResourceName);
    }
    return toObject;
}
function generateVideosOperationFromMldev$1(fromObject) {
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
    const fromResponse = getValueByPath(fromObject, [
        'response',
        'generateVideoResponse',
    ]);
    if (fromResponse != null) {
        setValueByPath(toObject, ['response'], generateVideosResponseFromMldev$1(fromResponse));
    }
    return toObject;
}
function generateVideosOperationFromVertex$1(fromObject) {
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
        setValueByPath(toObject, ['response'], generateVideosResponseFromVertex$1(fromResponse));
    }
    return toObject;
}
function generateVideosResponseFromMldev$1(fromObject) {
    const toObject = {};
    const fromGeneratedVideos = getValueByPath(fromObject, [
        'generatedSamples',
    ]);
    if (fromGeneratedVideos != null) {
        let transformedList = fromGeneratedVideos;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedVideoFromMldev$1(item);
            });
        }
        setValueByPath(toObject, ['generatedVideos'], transformedList);
    }
    const fromRaiMediaFilteredCount = getValueByPath(fromObject, [
        'raiMediaFilteredCount',
    ]);
    if (fromRaiMediaFilteredCount != null) {
        setValueByPath(toObject, ['raiMediaFilteredCount'], fromRaiMediaFilteredCount);
    }
    const fromRaiMediaFilteredReasons = getValueByPath(fromObject, [
        'raiMediaFilteredReasons',
    ]);
    if (fromRaiMediaFilteredReasons != null) {
        setValueByPath(toObject, ['raiMediaFilteredReasons'], fromRaiMediaFilteredReasons);
    }
    return toObject;
}
function generateVideosResponseFromVertex$1(fromObject) {
    const toObject = {};
    const fromGeneratedVideos = getValueByPath(fromObject, ['videos']);
    if (fromGeneratedVideos != null) {
        let transformedList = fromGeneratedVideos;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedVideoFromVertex$1(item);
            });
        }
        setValueByPath(toObject, ['generatedVideos'], transformedList);
    }
    const fromRaiMediaFilteredCount = getValueByPath(fromObject, [
        'raiMediaFilteredCount',
    ]);
    if (fromRaiMediaFilteredCount != null) {
        setValueByPath(toObject, ['raiMediaFilteredCount'], fromRaiMediaFilteredCount);
    }
    const fromRaiMediaFilteredReasons = getValueByPath(fromObject, [
        'raiMediaFilteredReasons',
    ]);
    if (fromRaiMediaFilteredReasons != null) {
        setValueByPath(toObject, ['raiMediaFilteredReasons'], fromRaiMediaFilteredReasons);
    }
    return toObject;
}
function generatedVideoFromMldev$1(fromObject) {
    const toObject = {};
    const fromVideo = getValueByPath(fromObject, ['video']);
    if (fromVideo != null) {
        setValueByPath(toObject, ['video'], videoFromMldev$1(fromVideo));
    }
    return toObject;
}
function generatedVideoFromVertex$1(fromObject) {
    const toObject = {};
    const fromVideo = getValueByPath(fromObject, ['_self']);
    if (fromVideo != null) {
        setValueByPath(toObject, ['video'], videoFromVertex$1(fromVideo));
    }
    return toObject;
}
function getOperationParametersToMldev(fromObject) {
    const toObject = {};
    const fromOperationName = getValueByPath(fromObject, [
        'operationName',
    ]);
    if (fromOperationName != null) {
        setValueByPath(toObject, ['_url', 'operationName'], fromOperationName);
    }
    return toObject;
}
function getOperationParametersToVertex(fromObject) {
    const toObject = {};
    const fromOperationName = getValueByPath(fromObject, [
        'operationName',
    ]);
    if (fromOperationName != null) {
        setValueByPath(toObject, ['_url', 'operationName'], fromOperationName);
    }
    return toObject;
}
function importFileOperationFromMldev$1(fromObject) {
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
        setValueByPath(toObject, ['response'], importFileResponseFromMldev$1(fromResponse));
    }
    return toObject;
}
function importFileResponseFromMldev$1(fromObject) {
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
function videoFromMldev$1(fromObject) {
    const toObject = {};
    const fromUri = getValueByPath(fromObject, ['uri']);
    if (fromUri != null) {
        setValueByPath(toObject, ['uri'], fromUri);
    }
    const fromVideoBytes = getValueByPath(fromObject, ['encodedVideo']);
    if (fromVideoBytes != null) {
        setValueByPath(toObject, ['videoBytes'], tBytes$1(fromVideoBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['encoding']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function videoFromVertex$1(fromObject) {
    const toObject = {};
    const fromUri = getValueByPath(fromObject, ['gcsUri']);
    if (fromUri != null) {
        setValueByPath(toObject, ['uri'], fromUri);
    }
    const fromVideoBytes = getValueByPath(fromObject, [
        'bytesBase64Encoded',
    ]);
    if (fromVideoBytes != null) {
        setValueByPath(toObject, ['videoBytes'], tBytes$1(fromVideoBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
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
/** The output from a server-side `ToolCall` execution.

This message contains the results of a tool invocation that was initiated by a
`ToolCall` from the model. The client should pass this `ToolResponse` back to
the API in a subsequent turn within a `Content` message, along with the
corresponding `ToolCall`. */
class ToolResponse {
}
/** Raw media bytes for function response.

Text should not be sent as raw bytes, use the FunctionResponse.response
field. */
class FunctionResponseBlob {
}
/** URI based data for function response. */
class FunctionResponseFileData {
}
/** A datatype containing media that is part of a `FunctionResponse` message.

A `FunctionResponsePart` consists of data which has an associated datatype. A
`FunctionResponsePart` can only contain one of the accepted types in
`FunctionResponsePart.data`.

A `FunctionResponsePart` must have a fixed IANA MIME type identifying the
type and subtype of the media if the `inline_data` field is filled with raw
bytes. */
class FunctionResponsePart {
}
/**
 * Creates a `FunctionResponsePart` object from a `base64` encoded `string`.
 */
function createFunctionResponsePartFromBase64(data, mimeType) {
    return {
        inlineData: {
            data: data,
            mimeType: mimeType,
        },
    };
}
/**
 * Creates a `FunctionResponsePart` object from a `URI` string.
 */
function createFunctionResponsePartFromUri(uri, mimeType) {
    return {
        fileData: {
            fileUri: uri,
            mimeType: mimeType,
        },
    };
}
/** A function response. */
class FunctionResponse {
}
/**
 * Creates a `Part` object from a `URI` string.
 */
function createPartFromUri(uri, mimeType, mediaResolution) {
    return Object.assign({ fileData: {
            fileUri: uri,
            mimeType: mimeType,
        } }, (mediaResolution && { mediaResolution: { level: mediaResolution } }));
}
/**
 * Creates a `Part` object from a `text` string.
 */
function createPartFromText(text) {
    return {
        text: text,
    };
}
/**
 * Creates a `Part` object from a `FunctionCall` object.
 */
function createPartFromFunctionCall(name, args) {
    return {
        functionCall: {
            name: name,
            args: args,
        },
    };
}
/**
 * Creates a `Part` object from a `FunctionResponse` object.
 */
function createPartFromFunctionResponse(id, name, response, parts = []) {
    return {
        functionResponse: Object.assign({ id: id, name: name, response: response }, (parts.length > 0 && { parts })),
    };
}
/**
 * Creates a `Part` object from a `base64` encoded `string`.
 */
function createPartFromBase64(data, mimeType, mediaResolution) {
    return Object.assign({ inlineData: {
            data: data,
            mimeType: mimeType,
        } }, (mediaResolution && { mediaResolution: { level: mediaResolution } }));
}
/**
 * Creates a `Part` object from the `outcome` and `output` of a `CodeExecutionResult` object.
 */
function createPartFromCodeExecutionResult(outcome, output) {
    return {
        codeExecutionResult: {
            outcome: outcome,
            output: output,
        },
    };
}
/**
 * Creates a `Part` object from the `code` and `language` of an `ExecutableCode` object.
 */
function createPartFromExecutableCode(code, language) {
    return {
        executableCode: {
            code: code,
            language: language,
        },
    };
}
function _isPart(obj) {
    if (typeof obj === 'object' && obj !== null) {
        return ('fileData' in obj ||
            'text' in obj ||
            'functionCall' in obj ||
            'functionResponse' in obj ||
            'inlineData' in obj ||
            'videoMetadata' in obj ||
            'codeExecutionResult' in obj ||
            'executableCode' in obj);
    }
    return false;
}
function _toParts(partOrString) {
    const parts = [];
    if (typeof partOrString === 'string') {
        parts.push(createPartFromText(partOrString));
    }
    else if (_isPart(partOrString)) {
        parts.push(partOrString);
    }
    else if (Array.isArray(partOrString)) {
        if (partOrString.length === 0) {
            throw new Error('partOrString cannot be an empty array');
        }
        for (const part of partOrString) {
            if (typeof part === 'string') {
                parts.push(createPartFromText(part));
            }
            else if (_isPart(part)) {
                parts.push(part);
            }
            else {
                throw new Error('element in PartUnion must be a Part object or string');
            }
        }
    }
    else {
        throw new Error('partOrString must be a Part object, string, or array');
    }
    return parts;
}
/**
 * Creates a `Content` object with a user role from a `PartListUnion` object or `string`.
 */
function createUserContent(partOrString) {
    return {
        role: 'user',
        parts: _toParts(partOrString),
    };
}
/**
 * Creates a `Content` object with a model role from a `PartListUnion` object or `string`.
 */
function createModelContent(partOrString) {
    return {
        role: 'model',
        parts: _toParts(partOrString),
    };
}
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
/** Content filter results for a prompt sent in the request. Note: This is sent only in the first stream chunk and only if no candidates were generated due to content violations. */
class GenerateContentResponsePromptFeedback {
}
/** Usage metadata about the content generation request and response. This message provides a detailed breakdown of token usage and other relevant metrics. This data type is not supported in Gemini API. */
class GenerateContentResponseUsageMetadata {
}
/** Response message for PredictionService.GenerateContent. */
class GenerateContentResponse {
    /**
     * Returns the concatenation of all text parts from the first candidate in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the text from the first
     * one will be returned.
     * If there are non-text parts in the response, the concatenation of all text
     * parts will be returned, and a warning will be logged.
     * If there are thought parts in the response, the concatenation of all text
     * parts excluding the thought parts will be returned.
     *
     * @example
     * ```ts
     * const response = await ai.models.generateContent({
     *   model: 'gemini-2.0-flash',
     *   contents:
     *     'Why is the sky blue?',
     * });
     *
     * console.debug(response.text);
     * ```
     */
    get text() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) {
            return undefined;
        }
        if (this.candidates && this.candidates.length > 1) {
            console.warn('there are multiple candidates in the response, returning text from the first one.');
        }
        let text = '';
        let anyTextPartText = false;
        const nonTextParts = [];
        for (const part of (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) !== null && _h !== void 0 ? _h : []) {
            for (const [fieldName, fieldValue] of Object.entries(part)) {
                if (fieldName !== 'text' &&
                    fieldName !== 'thought' &&
                    fieldName !== 'thoughtSignature' &&
                    (fieldValue !== null || fieldValue !== undefined)) {
                    nonTextParts.push(fieldName);
                }
            }
            if (typeof part.text === 'string') {
                if (typeof part.thought === 'boolean' && part.thought) {
                    continue;
                }
                anyTextPartText = true;
                text += part.text;
            }
        }
        if (nonTextParts.length > 0) {
            console.warn(`there are non-text parts ${nonTextParts} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`);
        }
        // part.text === '' is different from part.text is null
        return anyTextPartText ? text : undefined;
    }
    /**
     * Returns the concatenation of all inline data parts from the first candidate
     * in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the inline data from the
     * first one will be returned. If there are non-inline data parts in the
     * response, the concatenation of all inline data parts will be returned, and
     * a warning will be logged.
     */
    get data() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) {
            return undefined;
        }
        if (this.candidates && this.candidates.length > 1) {
            console.warn('there are multiple candidates in the response, returning data from the first one.');
        }
        let data = '';
        const nonDataParts = [];
        for (const part of (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) !== null && _h !== void 0 ? _h : []) {
            for (const [fieldName, fieldValue] of Object.entries(part)) {
                if (fieldName !== 'inlineData' &&
                    (fieldValue !== null || fieldValue !== undefined)) {
                    nonDataParts.push(fieldName);
                }
            }
            if (part.inlineData && typeof part.inlineData.data === 'string') {
                data += atob(part.inlineData.data);
            }
        }
        if (nonDataParts.length > 0) {
            console.warn(`there are non-data parts ${nonDataParts} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`);
        }
        return data.length > 0 ? btoa(data) : undefined;
    }
    /**
     * Returns the function calls from the first candidate in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the function calls from
     * the first one will be returned.
     * If there are no function calls in the response, undefined will be returned.
     *
     * @example
     * ```ts
     * const controlLightFunctionDeclaration: FunctionDeclaration = {
     *   name: 'controlLight',
     *   parameters: {
     *   type: Type.OBJECT,
     *   description: 'Set the brightness and color temperature of a room light.',
     *   properties: {
     *     brightness: {
     *       type: Type.NUMBER,
     *       description:
     *         'Light level from 0 to 100. Zero is off and 100 is full brightness.',
     *     },
     *     colorTemperature: {
     *       type: Type.STRING,
     *       description:
     *         'Color temperature of the light fixture which can be `daylight`, `cool` or `warm`.',
     *     },
     *   },
     *   required: ['brightness', 'colorTemperature'],
     *  };
     *  const response = await ai.models.generateContent({
     *     model: 'gemini-2.0-flash',
     *     contents: 'Dim the lights so the room feels cozy and warm.',
     *     config: {
     *       tools: [{functionDeclarations: [controlLightFunctionDeclaration]}],
     *       toolConfig: {
     *         functionCallingConfig: {
     *           mode: FunctionCallingConfigMode.ANY,
     *           allowedFunctionNames: ['controlLight'],
     *         },
     *       },
     *     },
     *   });
     *  console.debug(JSON.stringify(response.functionCalls));
     * ```
     */
    get functionCalls() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) {
            return undefined;
        }
        if (this.candidates && this.candidates.length > 1) {
            console.warn('there are multiple candidates in the response, returning function calls from the first one.');
        }
        const functionCalls = (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) === null || _h === void 0 ? void 0 : _h.filter((part) => part.functionCall).map((part) => part.functionCall).filter((functionCall) => functionCall !== undefined);
        if ((functionCalls === null || functionCalls === void 0 ? void 0 : functionCalls.length) === 0) {
            return undefined;
        }
        return functionCalls;
    }
    /**
     * Returns the first executable code from the first candidate in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the executable code from
     * the first one will be returned.
     * If there are no executable code in the response, undefined will be
     * returned.
     *
     * @example
     * ```ts
     * const response = await ai.models.generateContent({
     *   model: 'gemini-2.0-flash',
     *   contents:
     *     'What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.'
     *   config: {
     *     tools: [{codeExecution: {}}],
     *   },
     * });
     *
     * console.debug(response.executableCode);
     * ```
     */
    get executableCode() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) {
            return undefined;
        }
        if (this.candidates && this.candidates.length > 1) {
            console.warn('there are multiple candidates in the response, returning executable code from the first one.');
        }
        const executableCode = (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) === null || _h === void 0 ? void 0 : _h.filter((part) => part.executableCode).map((part) => part.executableCode).filter((executableCode) => executableCode !== undefined);
        if ((executableCode === null || executableCode === void 0 ? void 0 : executableCode.length) === 0) {
            return undefined;
        }
        return (_j = executableCode === null || executableCode === void 0 ? void 0 : executableCode[0]) === null || _j === void 0 ? void 0 : _j.code;
    }
    /**
     * Returns the first code execution result from the first candidate in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the code execution result from
     * the first one will be returned.
     * If there are no code execution result in the response, undefined will be returned.
     *
     * @example
     * ```ts
     * const response = await ai.models.generateContent({
     *   model: 'gemini-2.0-flash',
     *   contents:
     *     'What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.'
     *   config: {
     *     tools: [{codeExecution: {}}],
     *   },
     * });
     *
     * console.debug(response.codeExecutionResult);
     * ```
     */
    get codeExecutionResult() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (((_d = (_c = (_b = (_a = this.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.length) === 0) {
            return undefined;
        }
        if (this.candidates && this.candidates.length > 1) {
            console.warn('there are multiple candidates in the response, returning code execution result from the first one.');
        }
        const codeExecutionResult = (_h = (_g = (_f = (_e = this.candidates) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.parts) === null || _h === void 0 ? void 0 : _h.filter((part) => part.codeExecutionResult).map((part) => part.codeExecutionResult).filter((codeExecutionResult) => codeExecutionResult !== undefined);
        if ((codeExecutionResult === null || codeExecutionResult === void 0 ? void 0 : codeExecutionResult.length) === 0) {
            return undefined;
        }
        return (_j = codeExecutionResult === null || codeExecutionResult === void 0 ? void 0 : codeExecutionResult[0]) === null || _j === void 0 ? void 0 : _j.output;
    }
}
/** Response for the embed_content method. */
class EmbedContentResponse {
}
/** The output images response. */
class GenerateImagesResponse {
}
/** Response for the request to edit an image. */
class EditImageResponse {
}
class UpscaleImageResponse {
}
/** The output images response. */
class RecontextImageResponse {
}
/** The output images response. */
class SegmentImageResponse {
}
class ListModelsResponse {
}
class DeleteModelResponse {
}
/** Response for counting tokens. */
class CountTokensResponse {
}
/** Response for computing tokens. */
class ComputeTokensResponse {
}
/** Response with generated videos. */
class GenerateVideosResponse {
}
/** A video generation operation. */
class GenerateVideosOperation {
    /**
     * Instantiates an Operation of the same type as the one being called with the fields set from the API response.
     */
    _fromAPIResponse({ apiResponse, _isVertexAI, }) {
        const operation = new GenerateVideosOperation();
        let response;
        const op = apiResponse;
        if (_isVertexAI) {
            response = generateVideosOperationFromVertex$1(op);
        }
        else {
            response = generateVideosOperationFromMldev$1(op);
        }
        Object.assign(operation, response);
        return operation;
    }
}
/** The results from an evaluation run performed by the EvaluationService. This data type is not supported in Gemini API. */
class EvaluateDatasetResponse {
}
/** Response for the list tuning jobs method. */
class ListTuningJobsResponse {
}
/** Empty response for tunings.cancel method. */
class CancelTuningJobResponse {
}
/** Empty response for caches.delete method. */
class DeleteCachedContentResponse {
}
class ListCachedContentsResponse {
}
/** Config for documents.list return value. */
class ListDocumentsResponse {
}
/** Config for file_search_stores.list return value. */
class ListFileSearchStoresResponse {
}
/** Response for the resumable upload method. */
class UploadToFileSearchStoreResumableResponse {
}
/** Response for ImportFile to import a File API file with a file search store. */
class ImportFileResponse {
}
/** Long-running operation for importing a file to a FileSearchStore. */
class ImportFileOperation {
    /**
     * Instantiates an Operation of the same type as the one being called with the fields set from the API response.
     */
    _fromAPIResponse({ apiResponse, _isVertexAI, }) {
        const operation = new ImportFileOperation();
        const op = apiResponse;
        const response = importFileOperationFromMldev$1(op);
        Object.assign(operation, response);
        return operation;
    }
}
/** Response for the list files method. */
class ListFilesResponse {
}
/** Response for the create file method. */
class CreateFileResponse {
}
/** Response for the delete file method. */
class DeleteFileResponse {
}
/** Response for the _register file method. */
class RegisterFilesResponse {
}
/** Config for `inlined_responses` parameter. */
class InlinedResponse {
}
/** Config for `response` parameter. */
class SingleEmbedContentResponse {
}
/** Config for `inlined_embedding_responses` parameter. */
class InlinedEmbedContentResponse {
}
/** Config for batches.list return value. */
class ListBatchJobsResponse {
}
/** Represents a single response in a replay. */
class ReplayResponse {
}
/** A raw reference image.

A raw reference image represents the base image to edit, provided by the user.
It can optionally be provided in addition to a mask reference image or
a style reference image. */
class RawReferenceImage {
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI() {
        const referenceImageAPI = {
            referenceType: 'REFERENCE_TYPE_RAW',
            referenceImage: this.referenceImage,
            referenceId: this.referenceId,
        };
        return referenceImageAPI;
    }
}
/** A mask reference image.

This encapsulates either a mask image provided by the user and configs for
the user provided mask, or only config parameters for the model to generate
a mask.

A mask image is an image whose non-zero values indicate where to edit the base
image. If the user provides a mask image, the mask must be in the same
dimensions as the raw image. */
class MaskReferenceImage {
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI() {
        const referenceImageAPI = {
            referenceType: 'REFERENCE_TYPE_MASK',
            referenceImage: this.referenceImage,
            referenceId: this.referenceId,
            maskImageConfig: this.config,
        };
        return referenceImageAPI;
    }
}
/** A control reference image.

The image of the control reference image is either a control image provided
by the user, or a regular image which the backend will use to generate a
control image of. In the case of the latter, the
enable_control_image_computation field in the config should be set to True.

A control image is an image that represents a sketch image of areas for the
model to fill in based on the prompt. */
class ControlReferenceImage {
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI() {
        const referenceImageAPI = {
            referenceType: 'REFERENCE_TYPE_CONTROL',
            referenceImage: this.referenceImage,
            referenceId: this.referenceId,
            controlImageConfig: this.config,
        };
        return referenceImageAPI;
    }
}
/** A style reference image.

This encapsulates a style reference image provided by the user, and
additionally optional config parameters for the style reference image.

A raw reference image can also be provided as a destination for the style to
be applied to. */
class StyleReferenceImage {
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI() {
        const referenceImageAPI = {
            referenceType: 'REFERENCE_TYPE_STYLE',
            referenceImage: this.referenceImage,
            referenceId: this.referenceId,
            styleImageConfig: this.config,
        };
        return referenceImageAPI;
    }
}
/** A subject reference image.

This encapsulates a subject reference image provided by the user, and
additionally optional config parameters for the subject reference image.

A raw reference image can also be provided as a destination for the subject to
be applied to. */
class SubjectReferenceImage {
    /* Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI() {
        const referenceImageAPI = {
            referenceType: 'REFERENCE_TYPE_SUBJECT',
            referenceImage: this.referenceImage,
            referenceId: this.referenceId,
            subjectImageConfig: this.config,
        };
        return referenceImageAPI;
    }
}
/** A content reference image.

A content reference image represents a subject to reference (ex. person,
product, animal) provided by the user. It can optionally be provided in
addition to a style reference image (ex. background, style reference). */
class ContentReferenceImage {
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI() {
        const referenceImageAPI = {
            referenceType: 'REFERENCE_TYPE_CONTENT',
            referenceImage: this.referenceImage,
            referenceId: this.referenceId,
        };
        return referenceImageAPI;
    }
}
/** Response message for API call. */
class LiveServerMessage {
    /**
     * Returns the concatenation of all text parts from the server content if present.
     *
     * @remarks
     * If there are non-text parts in the response, the concatenation of all text
     * parts will be returned, and a warning will be logged.
     */
    get text() {
        var _a, _b, _c;
        let text = '';
        let anyTextPartFound = false;
        const nonTextParts = [];
        for (const part of (_c = (_b = (_a = this.serverContent) === null || _a === void 0 ? void 0 : _a.modelTurn) === null || _b === void 0 ? void 0 : _b.parts) !== null && _c !== void 0 ? _c : []) {
            for (const [fieldName, fieldValue] of Object.entries(part)) {
                if (fieldName !== 'text' &&
                    fieldName !== 'thought' &&
                    fieldValue !== null) {
                    nonTextParts.push(fieldName);
                }
            }
            if (typeof part.text === 'string') {
                if (typeof part.thought === 'boolean' && part.thought) {
                    continue;
                }
                anyTextPartFound = true;
                text += part.text;
            }
        }
        if (nonTextParts.length > 0) {
            console.warn(`there are non-text parts ${nonTextParts} in the response, returning concatenation of all text parts. Please refer to the non text parts for a full response from model.`);
        }
        // part.text === '' is different from part.text is null
        return anyTextPartFound ? text : undefined;
    }
    /**
     * Returns the concatenation of all inline data parts from the server content if present.
     *
     * @remarks
     * If there are non-inline data parts in the
     * response, the concatenation of all inline data parts will be returned, and
     * a warning will be logged.
     */
    get data() {
        var _a, _b, _c;
        let data = '';
        const nonDataParts = [];
        for (const part of (_c = (_b = (_a = this.serverContent) === null || _a === void 0 ? void 0 : _a.modelTurn) === null || _b === void 0 ? void 0 : _b.parts) !== null && _c !== void 0 ? _c : []) {
            for (const [fieldName, fieldValue] of Object.entries(part)) {
                if (fieldName !== 'inlineData' && fieldValue !== null) {
                    nonDataParts.push(fieldName);
                }
            }
            if (part.inlineData && typeof part.inlineData.data === 'string') {
                data += atob(part.inlineData.data);
            }
        }
        if (nonDataParts.length > 0) {
            console.warn(`there are non-data parts ${nonDataParts} in the response, returning concatenation of all data parts. Please refer to the non data parts for a full response from model.`);
        }
        return data.length > 0 ? btoa(data) : undefined;
    }
}
/** Client generated response to a `ToolCall` received from the server.

Individual `FunctionResponse` objects are matched to the respective
`FunctionCall` objects by the `id` field.

Note that in the unary and server-streaming GenerateContent APIs function
calling happens by exchanging the `Content` parts, while in the bidi
GenerateContent APIs function calling happens over this dedicated set of
messages. */
class LiveClientToolResponse {
}
/** Parameters for sending tool responses to the live API. */
class LiveSendToolResponseParameters {
    constructor() {
        /** Tool responses to send to the session. */
        this.functionResponses = [];
    }
}
/** Response message for the LiveMusicClientMessage call. */
class LiveMusicServerMessage {
    /**
     * Returns the first audio chunk from the server content, if present.
     *
     * @remarks
     * If there are no audio chunks in the response, undefined will be returned.
     */
    get audioChunk() {
        if (this.serverContent &&
            this.serverContent.audioChunks &&
            this.serverContent.audioChunks.length > 0) {
            return this.serverContent.audioChunks[0];
        }
        return undefined;
    }
}
/** The response when long-running operation for uploading a file to a FileSearchStore complete. */
class UploadToFileSearchStoreResponse {
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
function tModel(apiClient, model) {
    if (!model || typeof model !== 'string') {
        throw new Error('model is required and must be a string');
    }
    if (model.includes('..') || model.includes('?') || model.includes('&')) {
        throw new Error('invalid model parameter');
    }
    if (apiClient.isVertexAI()) {
        if (model.startsWith('publishers/') ||
            model.startsWith('projects/') ||
            model.startsWith('models/')) {
            return model;
        }
        else if (model.indexOf('/') >= 0) {
            const parts = model.split('/', 2);
            return `publishers/${parts[0]}/models/${parts[1]}`;
        }
        else {
            return `publishers/google/models/${model}`;
        }
    }
    else {
        if (model.startsWith('models/') || model.startsWith('tunedModels/')) {
            return model;
        }
        else {
            return `models/${model}`;
        }
    }
}
function tCachesModel(apiClient, model) {
    const transformedModel = tModel(apiClient, model);
    if (!transformedModel) {
        return '';
    }
    if (transformedModel.startsWith('publishers/') && apiClient.isVertexAI()) {
        // vertex caches only support model name start with projects.
        return `projects/${apiClient.getProject()}/locations/${apiClient.getLocation()}/${transformedModel}`;
    }
    else if (transformedModel.startsWith('models/') && apiClient.isVertexAI()) {
        return `projects/${apiClient.getProject()}/locations/${apiClient.getLocation()}/publishers/google/${transformedModel}`;
    }
    else {
        return transformedModel;
    }
}
function tBlobs(blobs) {
    if (Array.isArray(blobs)) {
        return blobs.map((blob) => tBlob(blob));
    }
    else {
        return [tBlob(blobs)];
    }
}
function tBlob(blob) {
    if (typeof blob === 'object' && blob !== null) {
        return blob;
    }
    throw new Error(`Could not parse input as Blob. Unsupported blob type: ${typeof blob}`);
}
function tImageBlob(blob) {
    const transformedBlob = tBlob(blob);
    if (transformedBlob.mimeType &&
        transformedBlob.mimeType.startsWith('image/')) {
        return transformedBlob;
    }
    throw new Error(`Unsupported mime type: ${transformedBlob.mimeType}`);
}
function tAudioBlob(blob) {
    const transformedBlob = tBlob(blob);
    if (transformedBlob.mimeType &&
        transformedBlob.mimeType.startsWith('audio/')) {
        return transformedBlob;
    }
    throw new Error(`Unsupported mime type: ${transformedBlob.mimeType}`);
}
function tPart(origin) {
    if (origin === null || origin === undefined) {
        throw new Error('PartUnion is required');
    }
    if (typeof origin === 'object') {
        return origin;
    }
    if (typeof origin === 'string') {
        return { text: origin };
    }
    throw new Error(`Unsupported part type: ${typeof origin}`);
}
function tParts(origin) {
    if (origin === null ||
        origin === undefined ||
        (Array.isArray(origin) && origin.length === 0)) {
        throw new Error('PartListUnion is required');
    }
    if (Array.isArray(origin)) {
        return origin.map((item) => tPart(item));
    }
    return [tPart(origin)];
}
function _isContent(origin) {
    return (origin !== null &&
        origin !== undefined &&
        typeof origin === 'object' &&
        'parts' in origin &&
        Array.isArray(origin.parts));
}
function _isFunctionCallPart(origin) {
    return (origin !== null &&
        origin !== undefined &&
        typeof origin === 'object' &&
        'functionCall' in origin);
}
function _isFunctionResponsePart(origin) {
    return (origin !== null &&
        origin !== undefined &&
        typeof origin === 'object' &&
        'functionResponse' in origin);
}
function tContent(origin) {
    if (origin === null || origin === undefined) {
        throw new Error('ContentUnion is required');
    }
    if (_isContent(origin)) {
        // _isContent is a utility function that checks if the
        // origin is a Content.
        return origin;
    }
    return {
        role: 'user',
        parts: tParts(origin),
    };
}
function tContentsForEmbed(apiClient, origin) {
    if (!origin) {
        return [];
    }
    if (apiClient.isVertexAI() && Array.isArray(origin)) {
        return origin.flatMap((item) => {
            const content = tContent(item);
            if (content.parts &&
                content.parts.length > 0 &&
                content.parts[0].text !== undefined) {
                return [content.parts[0].text];
            }
            return [];
        });
    }
    else if (apiClient.isVertexAI()) {
        const content = tContent(origin);
        if (content.parts &&
            content.parts.length > 0 &&
            content.parts[0].text !== undefined) {
            return [content.parts[0].text];
        }
        return [];
    }
    if (Array.isArray(origin)) {
        return origin.map((item) => tContent(item));
    }
    return [tContent(origin)];
}
function tContents(origin) {
    if (origin === null ||
        origin === undefined ||
        (Array.isArray(origin) && origin.length === 0)) {
        throw new Error('contents are required');
    }
    if (!Array.isArray(origin)) {
        // If it's not an array, it's a single content or a single PartUnion.
        if (_isFunctionCallPart(origin) || _isFunctionResponsePart(origin)) {
            throw new Error('To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them');
        }
        return [tContent(origin)];
    }
    const result = [];
    const accumulatedParts = [];
    const isContentArray = _isContent(origin[0]);
    for (const item of origin) {
        const isContent = _isContent(item);
        if (isContent != isContentArray) {
            throw new Error('Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them');
        }
        if (isContent) {
            // `isContent` contains the result of _isContent, which is a utility
            // function that checks if the item is a Content.
            result.push(item);
        }
        else if (_isFunctionCallPart(item) || _isFunctionResponsePart(item)) {
            throw new Error('To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them');
        }
        else {
            accumulatedParts.push(item);
        }
    }
    if (!isContentArray) {
        result.push({ role: 'user', parts: tParts(accumulatedParts) });
    }
    return result;
}
/*
Transform the type field from an array of types to an array of anyOf fields.
Example:
  {type: ['STRING', 'NUMBER']}
will be transformed to
  {anyOf: [{type: 'STRING'}, {type: 'NUMBER'}]}
*/
function flattenTypeArrayToAnyOf(typeList, resultingSchema) {
    if (typeList.includes('null')) {
        resultingSchema['nullable'] = true;
    }
    const listWithoutNull = typeList.filter((type) => type !== 'null');
    if (listWithoutNull.length === 1) {
        resultingSchema['type'] = Object.values(Type).includes(listWithoutNull[0].toUpperCase())
            ? listWithoutNull[0].toUpperCase()
            : Type.TYPE_UNSPECIFIED;
    }
    else {
        resultingSchema['anyOf'] = [];
        for (const i of listWithoutNull) {
            resultingSchema['anyOf'].push({
                'type': Object.values(Type).includes(i.toUpperCase())
                    ? i.toUpperCase()
                    : Type.TYPE_UNSPECIFIED,
            });
        }
    }
}
function processJsonSchema(_jsonSchema) {
    const genAISchema = {};
    const schemaFieldNames = ['items'];
    const listSchemaFieldNames = ['anyOf'];
    const dictSchemaFieldNames = ['properties'];
    if (_jsonSchema['type'] && _jsonSchema['anyOf']) {
        throw new Error('type and anyOf cannot be both populated.');
    }
    /*
    This is to handle the nullable array or object. The _jsonSchema will
    be in the format of {anyOf: [{type: 'null'}, {type: 'object'}]}. The
    logic is to check if anyOf has 2 elements and one of the element is null,
    if so, the anyOf field is unnecessary, so we need to get rid of the anyOf
    field and make the schema nullable. Then use the other element as the new
    _jsonSchema for processing. This is because the backend doesn't have a null
    type.
    This has to be checked before we process any other fields.
    For example:
      const objectNullable = z.object({
        nullableArray: z.array(z.string()).nullable(),
      });
    Will have the raw _jsonSchema as:
    {
      type: 'OBJECT',
      properties: {
          nullableArray: {
             anyOf: [
                {type: 'null'},
                {
                  type: 'array',
                  items: {type: 'string'},
                },
              ],
          }
      },
      required: [ 'nullableArray' ],
    }
    Will result in following schema compatible with Gemini API:
      {
        type: 'OBJECT',
        properties: {
           nullableArray: {
              nullable: true,
              type: 'ARRAY',
              items: {type: 'string'},
           }
        },
        required: [ 'nullableArray' ],
      }
    */
    const incomingAnyOf = _jsonSchema['anyOf'];
    if (incomingAnyOf != null && incomingAnyOf.length == 2) {
        if (incomingAnyOf[0]['type'] === 'null') {
            genAISchema['nullable'] = true;
            _jsonSchema = incomingAnyOf[1];
        }
        else if (incomingAnyOf[1]['type'] === 'null') {
            genAISchema['nullable'] = true;
            _jsonSchema = incomingAnyOf[0];
        }
    }
    if (_jsonSchema['type'] instanceof Array) {
        flattenTypeArrayToAnyOf(_jsonSchema['type'], genAISchema);
    }
    for (const [fieldName, fieldValue] of Object.entries(_jsonSchema)) {
        // Skip if the fieldvalue is undefined or null.
        if (fieldValue == null) {
            continue;
        }
        if (fieldName == 'type') {
            if (fieldValue === 'null') {
                throw new Error('type: null can not be the only possible type for the field.');
            }
            if (fieldValue instanceof Array) {
                // we have already handled the type field with array of types in the
                // beginning of this function.
                continue;
            }
            genAISchema['type'] = Object.values(Type).includes(fieldValue.toUpperCase())
                ? fieldValue.toUpperCase()
                : Type.TYPE_UNSPECIFIED;
        }
        else if (schemaFieldNames.includes(fieldName)) {
            genAISchema[fieldName] =
                processJsonSchema(fieldValue);
        }
        else if (listSchemaFieldNames.includes(fieldName)) {
            const listSchemaFieldValue = [];
            for (const item of fieldValue) {
                if (item['type'] == 'null') {
                    genAISchema['nullable'] = true;
                    continue;
                }
                listSchemaFieldValue.push(processJsonSchema(item));
            }
            genAISchema[fieldName] =
                listSchemaFieldValue;
        }
        else if (dictSchemaFieldNames.includes(fieldName)) {
            const dictSchemaFieldValue = {};
            for (const [key, value] of Object.entries(fieldValue)) {
                dictSchemaFieldValue[key] = processJsonSchema(value);
            }
            genAISchema[fieldName] =
                dictSchemaFieldValue;
        }
        else {
            // additionalProperties is not included in JSONSchema, skipping it.
            if (fieldName === 'additionalProperties') {
                continue;
            }
            genAISchema[fieldName] = fieldValue;
        }
    }
    return genAISchema;
}
// we take the unknown in the schema field because we want enable user to pass
// the output of major schema declaration tools without casting. Tools such as
// zodToJsonSchema, typebox, zodToJsonSchema function can return JsonSchema7Type
// or object, see details in
// https://github.com/StefanTerdell/zod-to-json-schema/blob/70525efe555cd226691e093d171370a3b10921d1/src/zodToJsonSchema.ts#L7
// typebox can return unknown, see details in
// https://github.com/sinclairzx81/typebox/blob/5a5431439f7d5ca6b494d0d18fbfd7b1a356d67c/src/type/create/type.ts#L35
// Note: proper json schemas with the $schema field set never arrive to this
// transformer. Schemas with $schema are routed to the equivalent API json
// schema field.
function tSchema(schema) {
    return processJsonSchema(schema);
}
function tSpeechConfig(speechConfig) {
    if (typeof speechConfig === 'object') {
        return speechConfig;
    }
    else if (typeof speechConfig === 'string') {
        return {
            voiceConfig: {
                prebuiltVoiceConfig: {
                    voiceName: speechConfig,
                },
            },
        };
    }
    else {
        throw new Error(`Unsupported speechConfig type: ${typeof speechConfig}`);
    }
}
function tLiveSpeechConfig(speechConfig) {
    if ('multiSpeakerVoiceConfig' in speechConfig) {
        throw new Error('multiSpeakerVoiceConfig is not supported in the live API.');
    }
    return speechConfig;
}
function tTool(tool) {
    if (tool.functionDeclarations) {
        for (const functionDeclaration of tool.functionDeclarations) {
            if (functionDeclaration.parameters) {
                if (!Object.keys(functionDeclaration.parameters).includes('$schema')) {
                    functionDeclaration.parameters = processJsonSchema(functionDeclaration.parameters);
                }
                else {
                    if (!functionDeclaration.parametersJsonSchema) {
                        functionDeclaration.parametersJsonSchema =
                            functionDeclaration.parameters;
                        delete functionDeclaration.parameters;
                    }
                }
            }
            if (functionDeclaration.response) {
                if (!Object.keys(functionDeclaration.response).includes('$schema')) {
                    functionDeclaration.response = processJsonSchema(functionDeclaration.response);
                }
                else {
                    if (!functionDeclaration.responseJsonSchema) {
                        functionDeclaration.responseJsonSchema =
                            functionDeclaration.response;
                        delete functionDeclaration.response;
                    }
                }
            }
        }
    }
    return tool;
}
function tTools(tools) {
    // Check if the incoming type is defined.
    if (tools === undefined || tools === null) {
        throw new Error('tools is required');
    }
    if (!Array.isArray(tools)) {
        throw new Error('tools is required and must be an array of Tools');
    }
    const result = [];
    for (const tool of tools) {
        result.push(tool);
    }
    return result;
}
/**
 * Prepends resource name with project, location, resource_prefix if needed.
 *
 * @param client The API client.
 * @param resourceName The resource name.
 * @param resourcePrefix The resource prefix.
 * @param splitsAfterPrefix The number of splits after the prefix.
 * @returns The completed resource name.
 *
 * Examples:
 *
 * ```
 * resource_name = '123'
 * resource_prefix = 'cachedContents'
 * splits_after_prefix = 1
 * client.vertexai = True
 * client.project = 'bar'
 * client.location = 'us-west1'
 * _resource_name(client, resource_name, resource_prefix, splits_after_prefix)
 * returns: 'projects/bar/locations/us-west1/cachedContents/123'
 * ```
 *
 * ```
 * resource_name = 'projects/foo/locations/us-central1/cachedContents/123'
 * resource_prefix = 'cachedContents'
 * splits_after_prefix = 1
 * client.vertexai = True
 * client.project = 'bar'
 * client.location = 'us-west1'
 * _resource_name(client, resource_name, resource_prefix, splits_after_prefix)
 * returns: 'projects/foo/locations/us-central1/cachedContents/123'
 * ```
 *
 * ```
 * resource_name = '123'
 * resource_prefix = 'cachedContents'
 * splits_after_prefix = 1
 * client.vertexai = False
 * _resource_name(client, resource_name, resource_prefix, splits_after_prefix)
 * returns 'cachedContents/123'
 * ```
 *
 * ```
 * resource_name = 'some/wrong/cachedContents/resource/name/123'
 * resource_prefix = 'cachedContents'
 * splits_after_prefix = 1
 * client.vertexai = False
 * # client.vertexai = True
 * _resource_name(client, resource_name, resource_prefix, splits_after_prefix)
 * -> 'some/wrong/resource/name/123'
 * ```
 */
function resourceName(client, resourceName, resourcePrefix, splitsAfterPrefix = 1) {
    const shouldAppendPrefix = !resourceName.startsWith(`${resourcePrefix}/`) &&
        resourceName.split('/').length === splitsAfterPrefix;
    if (client.isVertexAI()) {
        if (resourceName.startsWith('projects/')) {
            return resourceName;
        }
        else if (resourceName.startsWith('locations/')) {
            return `projects/${client.getProject()}/${resourceName}`;
        }
        else if (resourceName.startsWith(`${resourcePrefix}/`)) {
            return `projects/${client.getProject()}/locations/${client.getLocation()}/${resourceName}`;
        }
        else if (shouldAppendPrefix) {
            return `projects/${client.getProject()}/locations/${client.getLocation()}/${resourcePrefix}/${resourceName}`;
        }
        else {
            return resourceName;
        }
    }
    if (shouldAppendPrefix) {
        return `${resourcePrefix}/${resourceName}`;
    }
    return resourceName;
}
function tCachedContentName(apiClient, name) {
    if (typeof name !== 'string') {
        throw new Error('name must be a string');
    }
    return resourceName(apiClient, name, 'cachedContents');
}
function tTuningJobStatus(status) {
    switch (status) {
        case 'STATE_UNSPECIFIED':
            return 'JOB_STATE_UNSPECIFIED';
        case 'CREATING':
            return 'JOB_STATE_RUNNING';
        case 'ACTIVE':
            return 'JOB_STATE_SUCCEEDED';
        case 'FAILED':
            return 'JOB_STATE_FAILED';
        default:
            return status;
    }
}
function tBytes(fromImageBytes) {
    return tBytes$1(fromImageBytes);
}
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
function tModelsUrl(apiClient, baseModels) {
    let res;
    if (apiClient.isVertexAI()) {
        res = baseModels ? 'publishers/google/models' : 'models';
    }
    else {
        res = baseModels ? 'models' : 'tunedModels';
    }
    return res;
}
function tExtractModels(response) {
    for (const key of ['models', 'tunedModels', 'publisherModels']) {
        if (hasField(response, key)) {
            return response[key];
        }
    }
    return [];
}
function hasField(data, fieldName) {
    return data !== null && typeof data === 'object' && fieldName in data;
}
function mcpToGeminiTool(mcpTool, config = {}) {
    const mcpToolSchema = mcpTool;
    const functionDeclaration = {
        name: mcpToolSchema['name'],
        description: mcpToolSchema['description'],
        parametersJsonSchema: mcpToolSchema['inputSchema'],
    };
    if (mcpToolSchema['outputSchema']) {
        functionDeclaration['responseJsonSchema'] = mcpToolSchema['outputSchema'];
    }
    if (config.behavior) {
        functionDeclaration['behavior'] = config.behavior;
    }
    const geminiTool = {
        functionDeclarations: [
            functionDeclaration,
        ],
    };
    return geminiTool;
}
/**
 * Converts a list of MCP tools to a single Gemini tool with a list of function
 * declarations.
 */
function mcpToolsToGeminiTool(mcpTools, config = {}) {
    const functionDeclarations = [];
    const toolNames = new Set();
    for (const mcpTool of mcpTools) {
        const mcpToolName = mcpTool.name;
        if (toolNames.has(mcpToolName)) {
            throw new Error(`Duplicate function name ${mcpToolName} found in MCP tools. Please ensure function names are unique.`);
        }
        toolNames.add(mcpToolName);
        const geminiTool = mcpToGeminiTool(mcpTool, config);
        if (geminiTool.functionDeclarations) {
            functionDeclarations.push(...geminiTool.functionDeclarations);
        }
    }
    return { functionDeclarations: functionDeclarations };
}
// Transforms a source input into a BatchJobSource object with validation.
function tBatchJobSource(client, src) {
    let sourceObj;
    if (typeof src === 'string') {
        if (client.isVertexAI()) {
            if (src.startsWith('gs://')) {
                sourceObj = { format: 'jsonl', gcsUri: [src] };
            }
            else if (src.startsWith('bq://')) {
                sourceObj = { format: 'bigquery', bigqueryUri: src };
            }
            else {
                throw new Error(`Unsupported string source for Vertex AI: ${src}`);
            }
        }
        else {
            // MLDEV
            if (src.startsWith('files/')) {
                sourceObj = { fileName: src }; // Default to fileName for string input
            }
            else {
                throw new Error(`Unsupported string source for Gemini API: ${src}`);
            }
        }
    }
    else if (Array.isArray(src)) {
        if (client.isVertexAI()) {
            throw new Error('InlinedRequest[] is not supported in Vertex AI.');
        }
        sourceObj = { inlinedRequests: src };
    }
    else {
        // It's already a BatchJobSource object
        sourceObj = src;
    }
    // Validation logic
    const vertexSourcesCount = [sourceObj.gcsUri, sourceObj.bigqueryUri].filter(Boolean).length;
    const mldevSourcesCount = [
        sourceObj.inlinedRequests,
        sourceObj.fileName,
    ].filter(Boolean).length;
    if (client.isVertexAI()) {
        if (mldevSourcesCount > 0 || vertexSourcesCount !== 1) {
            throw new Error('Exactly one of `gcsUri` or `bigqueryUri` must be set for Vertex AI.');
        }
    }
    else {
        // MLDEV
        if (vertexSourcesCount > 0 || mldevSourcesCount !== 1) {
            throw new Error('Exactly one of `inlinedRequests`, `fileName`, ' +
                'must be set for Gemini API.');
        }
    }
    return sourceObj;
}
function tBatchJobDestination(dest) {
    if (typeof dest !== 'string') {
        return dest;
    }
    const destString = dest;
    if (destString.startsWith('gs://')) {
        return {
            format: 'jsonl',
            gcsUri: destString,
        };
    }
    else if (destString.startsWith('bq://')) {
        return {
            format: 'bigquery',
            bigqueryUri: destString,
        };
    }
    else {
        throw new Error(`Unsupported destination: ${destString}`);
    }
}
function tRecvBatchJobDestination(dest) {
    // Ensure dest is a non-null object before proceeding.
    if (typeof dest !== 'object' || dest === null) {
        // If the input is not an object, it cannot be a valid BatchJobDestination
        // based on the operations performed. Return it cast, or handle as an error.
        // Casting an empty object might be a safe default.
        return {};
    }
    // Cast to Record<string, unknown> to allow string property access.
    const obj = dest;
    // Safely access nested properties.
    const inlineResponsesVal = obj['inlinedResponses'];
    if (typeof inlineResponsesVal !== 'object' || inlineResponsesVal === null) {
        return dest;
    }
    const inlineResponsesObj = inlineResponsesVal;
    const responsesArray = inlineResponsesObj['inlinedResponses'];
    if (!Array.isArray(responsesArray) || responsesArray.length === 0) {
        return dest;
    }
    // Check if any response has the 'embedding' property.
    let hasEmbedding = false;
    for (const responseItem of responsesArray) {
        if (typeof responseItem !== 'object' || responseItem === null) {
            continue;
        }
        const responseItemObj = responseItem;
        const responseVal = responseItemObj['response'];
        if (typeof responseVal !== 'object' || responseVal === null) {
            continue;
        }
        const responseObj = responseVal;
        // Check for the existence of the 'embedding' key.
        if (responseObj['embedding'] !== undefined) {
            hasEmbedding = true;
            break;
        }
    }
    // Perform the transformation if an embedding was found.
    if (hasEmbedding) {
        obj['inlinedEmbedContentResponses'] = obj['inlinedResponses'];
        delete obj['inlinedResponses'];
    }
    // Cast the (potentially) modified object to the target type.
    return dest;
}
function tBatchJobName(apiClient, name) {
    const nameString = name;
    if (!apiClient.isVertexAI()) {
        const mldevPattern = /batches\/[^/]+$/;
        if (mldevPattern.test(nameString)) {
            return nameString.split('/').pop();
        }
        else {
            throw new Error(`Invalid batch job name: ${nameString}.`);
        }
    }
    const vertexPattern = /^projects\/[^/]+\/locations\/[^/]+\/batchPredictionJobs\/[^/]+$/;
    if (vertexPattern.test(nameString)) {
        return nameString.split('/').pop();
    }
    else if (/^\d+$/.test(nameString)) {
        return nameString;
    }
    else {
        throw new Error(`Invalid batch job name: ${nameString}.`);
    }
}
function tJobState(state) {
    const stateString = state;
    if (stateString === 'BATCH_STATE_UNSPECIFIED') {
        return 'JOB_STATE_UNSPECIFIED';
    }
    else if (stateString === 'BATCH_STATE_PENDING') {
        return 'JOB_STATE_PENDING';
    }
    else if (stateString === 'BATCH_STATE_RUNNING') {
        return 'JOB_STATE_RUNNING';
    }
    else if (stateString === 'BATCH_STATE_SUCCEEDED') {
        return 'JOB_STATE_SUCCEEDED';
    }
    else if (stateString === 'BATCH_STATE_FAILED') {
        return 'JOB_STATE_FAILED';
    }
    else if (stateString === 'BATCH_STATE_CANCELLED') {
        return 'JOB_STATE_CANCELLED';
    }
    else if (stateString === 'BATCH_STATE_EXPIRED') {
        return 'JOB_STATE_EXPIRED';
    }
    else {
        return stateString;
    }
}
function tIsVertexEmbedContentModel(model) {
    return ((model.includes('gemini') && model !== 'gemini-embedding-001') ||
        model.includes('maas'));
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function authConfigToMldev$4(fromObject) {
    const toObject = {};
    const fromApiKey = getValueByPath(fromObject, ['apiKey']);
    if (fromApiKey != null) {
        setValueByPath(toObject, ['apiKey'], fromApiKey);
    }
    if (getValueByPath(fromObject, ['apiKeyConfig']) !== undefined) {
        throw new Error('apiKeyConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['authType']) !== undefined) {
        throw new Error('authType parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['googleServiceAccountConfig']) !==
        undefined) {
        throw new Error('googleServiceAccountConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['httpBasicAuthConfig']) !== undefined) {
        throw new Error('httpBasicAuthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oauthConfig']) !== undefined) {
        throw new Error('oauthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oidcConfig']) !== undefined) {
        throw new Error('oidcConfig parameter is not supported in Gemini API.');
    }
    return toObject;
}
function batchJobDestinationFromMldev(fromObject) {
    const toObject = {};
    const fromFileName = getValueByPath(fromObject, ['responsesFile']);
    if (fromFileName != null) {
        setValueByPath(toObject, ['fileName'], fromFileName);
    }
    const fromInlinedResponses = getValueByPath(fromObject, [
        'inlinedResponses',
        'inlinedResponses',
    ]);
    if (fromInlinedResponses != null) {
        let transformedList = fromInlinedResponses;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return inlinedResponseFromMldev(item);
            });
        }
        setValueByPath(toObject, ['inlinedResponses'], transformedList);
    }
    const fromInlinedEmbedContentResponses = getValueByPath(fromObject, [
        'inlinedEmbedContentResponses',
        'inlinedResponses',
    ]);
    if (fromInlinedEmbedContentResponses != null) {
        let transformedList = fromInlinedEmbedContentResponses;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['inlinedEmbedContentResponses'], transformedList);
    }
    return toObject;
}
function batchJobDestinationFromVertex(fromObject) {
    const toObject = {};
    const fromFormat = getValueByPath(fromObject, ['predictionsFormat']);
    if (fromFormat != null) {
        setValueByPath(toObject, ['format'], fromFormat);
    }
    const fromGcsUri = getValueByPath(fromObject, [
        'gcsDestination',
        'outputUriPrefix',
    ]);
    if (fromGcsUri != null) {
        setValueByPath(toObject, ['gcsUri'], fromGcsUri);
    }
    const fromBigqueryUri = getValueByPath(fromObject, [
        'bigqueryDestination',
        'outputUri',
    ]);
    if (fromBigqueryUri != null) {
        setValueByPath(toObject, ['bigqueryUri'], fromBigqueryUri);
    }
    return toObject;
}
function batchJobDestinationToVertex(fromObject) {
    const toObject = {};
    const fromFormat = getValueByPath(fromObject, ['format']);
    if (fromFormat != null) {
        setValueByPath(toObject, ['predictionsFormat'], fromFormat);
    }
    const fromGcsUri = getValueByPath(fromObject, ['gcsUri']);
    if (fromGcsUri != null) {
        setValueByPath(toObject, ['gcsDestination', 'outputUriPrefix'], fromGcsUri);
    }
    const fromBigqueryUri = getValueByPath(fromObject, ['bigqueryUri']);
    if (fromBigqueryUri != null) {
        setValueByPath(toObject, ['bigqueryDestination', 'outputUri'], fromBigqueryUri);
    }
    if (getValueByPath(fromObject, ['fileName']) !== undefined) {
        throw new Error('fileName parameter is not supported in Vertex AI.');
    }
    if (getValueByPath(fromObject, ['inlinedResponses']) !== undefined) {
        throw new Error('inlinedResponses parameter is not supported in Vertex AI.');
    }
    if (getValueByPath(fromObject, ['inlinedEmbedContentResponses']) !==
        undefined) {
        throw new Error('inlinedEmbedContentResponses parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function batchJobFromMldev(fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromDisplayName = getValueByPath(fromObject, [
        'metadata',
        'displayName',
    ]);
    if (fromDisplayName != null) {
        setValueByPath(toObject, ['displayName'], fromDisplayName);
    }
    const fromState = getValueByPath(fromObject, ['metadata', 'state']);
    if (fromState != null) {
        setValueByPath(toObject, ['state'], tJobState(fromState));
    }
    const fromCreateTime = getValueByPath(fromObject, [
        'metadata',
        'createTime',
    ]);
    if (fromCreateTime != null) {
        setValueByPath(toObject, ['createTime'], fromCreateTime);
    }
    const fromEndTime = getValueByPath(fromObject, [
        'metadata',
        'endTime',
    ]);
    if (fromEndTime != null) {
        setValueByPath(toObject, ['endTime'], fromEndTime);
    }
    const fromUpdateTime = getValueByPath(fromObject, [
        'metadata',
        'updateTime',
    ]);
    if (fromUpdateTime != null) {
        setValueByPath(toObject, ['updateTime'], fromUpdateTime);
    }
    const fromModel = getValueByPath(fromObject, ['metadata', 'model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['model'], fromModel);
    }
    const fromDest = getValueByPath(fromObject, ['metadata', 'output']);
    if (fromDest != null) {
        setValueByPath(toObject, ['dest'], batchJobDestinationFromMldev(tRecvBatchJobDestination(fromDest)));
    }
    return toObject;
}
function batchJobFromVertex(fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (fromDisplayName != null) {
        setValueByPath(toObject, ['displayName'], fromDisplayName);
    }
    const fromState = getValueByPath(fromObject, ['state']);
    if (fromState != null) {
        setValueByPath(toObject, ['state'], tJobState(fromState));
    }
    const fromError = getValueByPath(fromObject, ['error']);
    if (fromError != null) {
        setValueByPath(toObject, ['error'], fromError);
    }
    const fromCreateTime = getValueByPath(fromObject, ['createTime']);
    if (fromCreateTime != null) {
        setValueByPath(toObject, ['createTime'], fromCreateTime);
    }
    const fromStartTime = getValueByPath(fromObject, ['startTime']);
    if (fromStartTime != null) {
        setValueByPath(toObject, ['startTime'], fromStartTime);
    }
    const fromEndTime = getValueByPath(fromObject, ['endTime']);
    if (fromEndTime != null) {
        setValueByPath(toObject, ['endTime'], fromEndTime);
    }
    const fromUpdateTime = getValueByPath(fromObject, ['updateTime']);
    if (fromUpdateTime != null) {
        setValueByPath(toObject, ['updateTime'], fromUpdateTime);
    }
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['model'], fromModel);
    }
    const fromSrc = getValueByPath(fromObject, ['inputConfig']);
    if (fromSrc != null) {
        setValueByPath(toObject, ['src'], batchJobSourceFromVertex(fromSrc));
    }
    const fromDest = getValueByPath(fromObject, ['outputConfig']);
    if (fromDest != null) {
        setValueByPath(toObject, ['dest'], batchJobDestinationFromVertex(tRecvBatchJobDestination(fromDest)));
    }
    const fromCompletionStats = getValueByPath(fromObject, [
        'completionStats',
    ]);
    if (fromCompletionStats != null) {
        setValueByPath(toObject, ['completionStats'], fromCompletionStats);
    }
    return toObject;
}
function batchJobSourceFromVertex(fromObject) {
    const toObject = {};
    const fromFormat = getValueByPath(fromObject, ['instancesFormat']);
    if (fromFormat != null) {
        setValueByPath(toObject, ['format'], fromFormat);
    }
    const fromGcsUri = getValueByPath(fromObject, ['gcsSource', 'uris']);
    if (fromGcsUri != null) {
        setValueByPath(toObject, ['gcsUri'], fromGcsUri);
    }
    const fromBigqueryUri = getValueByPath(fromObject, [
        'bigquerySource',
        'inputUri',
    ]);
    if (fromBigqueryUri != null) {
        setValueByPath(toObject, ['bigqueryUri'], fromBigqueryUri);
    }
    return toObject;
}
function batchJobSourceToMldev(apiClient, fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['format']) !== undefined) {
        throw new Error('format parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['gcsUri']) !== undefined) {
        throw new Error('gcsUri parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['bigqueryUri']) !== undefined) {
        throw new Error('bigqueryUri parameter is not supported in Gemini API.');
    }
    const fromFileName = getValueByPath(fromObject, ['fileName']);
    if (fromFileName != null) {
        setValueByPath(toObject, ['fileName'], fromFileName);
    }
    const fromInlinedRequests = getValueByPath(fromObject, [
        'inlinedRequests',
    ]);
    if (fromInlinedRequests != null) {
        let transformedList = fromInlinedRequests;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return inlinedRequestToMldev(apiClient, item);
            });
        }
        setValueByPath(toObject, ['requests', 'requests'], transformedList);
    }
    return toObject;
}
function batchJobSourceToVertex(fromObject) {
    const toObject = {};
    const fromFormat = getValueByPath(fromObject, ['format']);
    if (fromFormat != null) {
        setValueByPath(toObject, ['instancesFormat'], fromFormat);
    }
    const fromGcsUri = getValueByPath(fromObject, ['gcsUri']);
    if (fromGcsUri != null) {
        setValueByPath(toObject, ['gcsSource', 'uris'], fromGcsUri);
    }
    const fromBigqueryUri = getValueByPath(fromObject, ['bigqueryUri']);
    if (fromBigqueryUri != null) {
        setValueByPath(toObject, ['bigquerySource', 'inputUri'], fromBigqueryUri);
    }
    if (getValueByPath(fromObject, ['fileName']) !== undefined) {
        throw new Error('fileName parameter is not supported in Vertex AI.');
    }
    if (getValueByPath(fromObject, ['inlinedRequests']) !== undefined) {
        throw new Error('inlinedRequests parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function blobToMldev$4(fromObject) {
    const toObject = {};
    const fromData = getValueByPath(fromObject, ['data']);
    if (fromData != null) {
        setValueByPath(toObject, ['data'], fromData);
    }
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function cancelBatchJobParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tBatchJobName(apiClient, fromName));
    }
    return toObject;
}
function cancelBatchJobParametersToVertex(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tBatchJobName(apiClient, fromName));
    }
    return toObject;
}
function candidateFromMldev$1(fromObject) {
    const toObject = {};
    const fromContent = getValueByPath(fromObject, ['content']);
    if (fromContent != null) {
        setValueByPath(toObject, ['content'], fromContent);
    }
    const fromCitationMetadata = getValueByPath(fromObject, [
        'citationMetadata',
    ]);
    if (fromCitationMetadata != null) {
        setValueByPath(toObject, ['citationMetadata'], citationMetadataFromMldev$1(fromCitationMetadata));
    }
    const fromTokenCount = getValueByPath(fromObject, ['tokenCount']);
    if (fromTokenCount != null) {
        setValueByPath(toObject, ['tokenCount'], fromTokenCount);
    }
    const fromFinishReason = getValueByPath(fromObject, ['finishReason']);
    if (fromFinishReason != null) {
        setValueByPath(toObject, ['finishReason'], fromFinishReason);
    }
    const fromGroundingMetadata = getValueByPath(fromObject, [
        'groundingMetadata',
    ]);
    if (fromGroundingMetadata != null) {
        setValueByPath(toObject, ['groundingMetadata'], fromGroundingMetadata);
    }
    const fromAvgLogprobs = getValueByPath(fromObject, ['avgLogprobs']);
    if (fromAvgLogprobs != null) {
        setValueByPath(toObject, ['avgLogprobs'], fromAvgLogprobs);
    }
    const fromIndex = getValueByPath(fromObject, ['index']);
    if (fromIndex != null) {
        setValueByPath(toObject, ['index'], fromIndex);
    }
    const fromLogprobsResult = getValueByPath(fromObject, [
        'logprobsResult',
    ]);
    if (fromLogprobsResult != null) {
        setValueByPath(toObject, ['logprobsResult'], fromLogprobsResult);
    }
    const fromSafetyRatings = getValueByPath(fromObject, [
        'safetyRatings',
    ]);
    if (fromSafetyRatings != null) {
        let transformedList = fromSafetyRatings;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['safetyRatings'], transformedList);
    }
    const fromUrlContextMetadata = getValueByPath(fromObject, [
        'urlContextMetadata',
    ]);
    if (fromUrlContextMetadata != null) {
        setValueByPath(toObject, ['urlContextMetadata'], fromUrlContextMetadata);
    }
    return toObject;
}
function citationMetadataFromMldev$1(fromObject) {
    const toObject = {};
    const fromCitations = getValueByPath(fromObject, ['citationSources']);
    if (fromCitations != null) {
        let transformedList = fromCitations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['citations'], transformedList);
    }
    return toObject;
}
function contentToMldev$4(fromObject) {
    const toObject = {};
    const fromParts = getValueByPath(fromObject, ['parts']);
    if (fromParts != null) {
        let transformedList = fromParts;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return partToMldev$4(item);
            });
        }
        setValueByPath(toObject, ['parts'], transformedList);
    }
    const fromRole = getValueByPath(fromObject, ['role']);
    if (fromRole != null) {
        setValueByPath(toObject, ['role'], fromRole);
    }
    return toObject;
}
function createBatchJobConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (parentObject !== undefined && fromDisplayName != null) {
        setValueByPath(parentObject, ['batch', 'displayName'], fromDisplayName);
    }
    if (getValueByPath(fromObject, ['dest']) !== undefined) {
        throw new Error('dest parameter is not supported in Gemini API.');
    }
    return toObject;
}
function createBatchJobConfigToVertex(fromObject, parentObject) {
    const toObject = {};
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (parentObject !== undefined && fromDisplayName != null) {
        setValueByPath(parentObject, ['displayName'], fromDisplayName);
    }
    const fromDest = getValueByPath(fromObject, ['dest']);
    if (parentObject !== undefined && fromDest != null) {
        setValueByPath(parentObject, ['outputConfig'], batchJobDestinationToVertex(tBatchJobDestination(fromDest)));
    }
    return toObject;
}
function createBatchJobParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromSrc = getValueByPath(fromObject, ['src']);
    if (fromSrc != null) {
        setValueByPath(toObject, ['batch', 'inputConfig'], batchJobSourceToMldev(apiClient, tBatchJobSource(apiClient, fromSrc)));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        createBatchJobConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function createBatchJobParametersToVertex(apiClient, fromObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['model'], tModel(apiClient, fromModel));
    }
    const fromSrc = getValueByPath(fromObject, ['src']);
    if (fromSrc != null) {
        setValueByPath(toObject, ['inputConfig'], batchJobSourceToVertex(tBatchJobSource(apiClient, fromSrc)));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        createBatchJobConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function createEmbeddingsBatchJobConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (parentObject !== undefined && fromDisplayName != null) {
        setValueByPath(parentObject, ['batch', 'displayName'], fromDisplayName);
    }
    return toObject;
}
function createEmbeddingsBatchJobParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromSrc = getValueByPath(fromObject, ['src']);
    if (fromSrc != null) {
        setValueByPath(toObject, ['batch', 'inputConfig'], embeddingsBatchJobSourceToMldev(apiClient, fromSrc));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        createEmbeddingsBatchJobConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function deleteBatchJobParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tBatchJobName(apiClient, fromName));
    }
    return toObject;
}
function deleteBatchJobParametersToVertex(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tBatchJobName(apiClient, fromName));
    }
    return toObject;
}
function deleteResourceJobFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromDone = getValueByPath(fromObject, ['done']);
    if (fromDone != null) {
        setValueByPath(toObject, ['done'], fromDone);
    }
    const fromError = getValueByPath(fromObject, ['error']);
    if (fromError != null) {
        setValueByPath(toObject, ['error'], fromError);
    }
    return toObject;
}
function deleteResourceJobFromVertex(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromDone = getValueByPath(fromObject, ['done']);
    if (fromDone != null) {
        setValueByPath(toObject, ['done'], fromDone);
    }
    const fromError = getValueByPath(fromObject, ['error']);
    if (fromError != null) {
        setValueByPath(toObject, ['error'], fromError);
    }
    return toObject;
}
function embedContentBatchToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (fromContents != null) {
        let transformedList = tContentsForEmbed(apiClient, fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['requests[]', 'request', 'content'], transformedList);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        setValueByPath(toObject, ['_self'], embedContentConfigToMldev$1(fromConfig, toObject));
        moveValueByPath(toObject, { 'requests[].*': 'requests[].request.*' });
    }
    return toObject;
}
function embedContentConfigToMldev$1(fromObject, parentObject) {
    const toObject = {};
    const fromTaskType = getValueByPath(fromObject, ['taskType']);
    if (parentObject !== undefined && fromTaskType != null) {
        setValueByPath(parentObject, ['requests[]', 'taskType'], fromTaskType);
    }
    const fromTitle = getValueByPath(fromObject, ['title']);
    if (parentObject !== undefined && fromTitle != null) {
        setValueByPath(parentObject, ['requests[]', 'title'], fromTitle);
    }
    const fromOutputDimensionality = getValueByPath(fromObject, [
        'outputDimensionality',
    ]);
    if (parentObject !== undefined && fromOutputDimensionality != null) {
        setValueByPath(parentObject, ['requests[]', 'outputDimensionality'], fromOutputDimensionality);
    }
    if (getValueByPath(fromObject, ['mimeType']) !== undefined) {
        throw new Error('mimeType parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['autoTruncate']) !== undefined) {
        throw new Error('autoTruncate parameter is not supported in Gemini API.');
    }
    return toObject;
}
function embeddingsBatchJobSourceToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromFileName = getValueByPath(fromObject, ['fileName']);
    if (fromFileName != null) {
        setValueByPath(toObject, ['file_name'], fromFileName);
    }
    const fromInlinedRequests = getValueByPath(fromObject, [
        'inlinedRequests',
    ]);
    if (fromInlinedRequests != null) {
        setValueByPath(toObject, ['requests'], embedContentBatchToMldev(apiClient, fromInlinedRequests));
    }
    return toObject;
}
function fileDataToMldev$4(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromFileUri = getValueByPath(fromObject, ['fileUri']);
    if (fromFileUri != null) {
        setValueByPath(toObject, ['fileUri'], fromFileUri);
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function functionCallToMldev$4(fromObject) {
    const toObject = {};
    const fromId = getValueByPath(fromObject, ['id']);
    if (fromId != null) {
        setValueByPath(toObject, ['id'], fromId);
    }
    const fromArgs = getValueByPath(fromObject, ['args']);
    if (fromArgs != null) {
        setValueByPath(toObject, ['args'], fromArgs);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    if (getValueByPath(fromObject, ['partialArgs']) !== undefined) {
        throw new Error('partialArgs parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['willContinue']) !== undefined) {
        throw new Error('willContinue parameter is not supported in Gemini API.');
    }
    return toObject;
}
function functionCallingConfigToMldev$2(fromObject) {
    const toObject = {};
    const fromAllowedFunctionNames = getValueByPath(fromObject, [
        'allowedFunctionNames',
    ]);
    if (fromAllowedFunctionNames != null) {
        setValueByPath(toObject, ['allowedFunctionNames'], fromAllowedFunctionNames);
    }
    const fromMode = getValueByPath(fromObject, ['mode']);
    if (fromMode != null) {
        setValueByPath(toObject, ['mode'], fromMode);
    }
    if (getValueByPath(fromObject, ['streamFunctionCallArguments']) !==
        undefined) {
        throw new Error('streamFunctionCallArguments parameter is not supported in Gemini API.');
    }
    return toObject;
}
function generateContentConfigToMldev$1(apiClient, fromObject, parentObject) {
    const toObject = {};
    const fromSystemInstruction = getValueByPath(fromObject, [
        'systemInstruction',
    ]);
    if (parentObject !== undefined && fromSystemInstruction != null) {
        setValueByPath(parentObject, ['systemInstruction'], contentToMldev$4(tContent(fromSystemInstruction)));
    }
    const fromTemperature = getValueByPath(fromObject, ['temperature']);
    if (fromTemperature != null) {
        setValueByPath(toObject, ['temperature'], fromTemperature);
    }
    const fromTopP = getValueByPath(fromObject, ['topP']);
    if (fromTopP != null) {
        setValueByPath(toObject, ['topP'], fromTopP);
    }
    const fromTopK = getValueByPath(fromObject, ['topK']);
    if (fromTopK != null) {
        setValueByPath(toObject, ['topK'], fromTopK);
    }
    const fromCandidateCount = getValueByPath(fromObject, [
        'candidateCount',
    ]);
    if (fromCandidateCount != null) {
        setValueByPath(toObject, ['candidateCount'], fromCandidateCount);
    }
    const fromMaxOutputTokens = getValueByPath(fromObject, [
        'maxOutputTokens',
    ]);
    if (fromMaxOutputTokens != null) {
        setValueByPath(toObject, ['maxOutputTokens'], fromMaxOutputTokens);
    }
    const fromStopSequences = getValueByPath(fromObject, [
        'stopSequences',
    ]);
    if (fromStopSequences != null) {
        setValueByPath(toObject, ['stopSequences'], fromStopSequences);
    }
    const fromResponseLogprobs = getValueByPath(fromObject, [
        'responseLogprobs',
    ]);
    if (fromResponseLogprobs != null) {
        setValueByPath(toObject, ['responseLogprobs'], fromResponseLogprobs);
    }
    const fromLogprobs = getValueByPath(fromObject, ['logprobs']);
    if (fromLogprobs != null) {
        setValueByPath(toObject, ['logprobs'], fromLogprobs);
    }
    const fromPresencePenalty = getValueByPath(fromObject, [
        'presencePenalty',
    ]);
    if (fromPresencePenalty != null) {
        setValueByPath(toObject, ['presencePenalty'], fromPresencePenalty);
    }
    const fromFrequencyPenalty = getValueByPath(fromObject, [
        'frequencyPenalty',
    ]);
    if (fromFrequencyPenalty != null) {
        setValueByPath(toObject, ['frequencyPenalty'], fromFrequencyPenalty);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (fromSeed != null) {
        setValueByPath(toObject, ['seed'], fromSeed);
    }
    const fromResponseMimeType = getValueByPath(fromObject, [
        'responseMimeType',
    ]);
    if (fromResponseMimeType != null) {
        setValueByPath(toObject, ['responseMimeType'], fromResponseMimeType);
    }
    const fromResponseSchema = getValueByPath(fromObject, [
        'responseSchema',
    ]);
    if (fromResponseSchema != null) {
        setValueByPath(toObject, ['responseSchema'], tSchema(fromResponseSchema));
    }
    const fromResponseJsonSchema = getValueByPath(fromObject, [
        'responseJsonSchema',
    ]);
    if (fromResponseJsonSchema != null) {
        setValueByPath(toObject, ['responseJsonSchema'], fromResponseJsonSchema);
    }
    if (getValueByPath(fromObject, ['routingConfig']) !== undefined) {
        throw new Error('routingConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['modelSelectionConfig']) !== undefined) {
        throw new Error('modelSelectionConfig parameter is not supported in Gemini API.');
    }
    const fromSafetySettings = getValueByPath(fromObject, [
        'safetySettings',
    ]);
    if (parentObject !== undefined && fromSafetySettings != null) {
        let transformedList = fromSafetySettings;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return safetySettingToMldev$1(item);
            });
        }
        setValueByPath(parentObject, ['safetySettings'], transformedList);
    }
    const fromTools = getValueByPath(fromObject, ['tools']);
    if (parentObject !== undefined && fromTools != null) {
        let transformedList = tTools(fromTools);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return toolToMldev$4(tTool(item));
            });
        }
        setValueByPath(parentObject, ['tools'], transformedList);
    }
    const fromToolConfig = getValueByPath(fromObject, ['toolConfig']);
    if (parentObject !== undefined && fromToolConfig != null) {
        setValueByPath(parentObject, ['toolConfig'], toolConfigToMldev$2(fromToolConfig));
    }
    if (getValueByPath(fromObject, ['labels']) !== undefined) {
        throw new Error('labels parameter is not supported in Gemini API.');
    }
    const fromCachedContent = getValueByPath(fromObject, [
        'cachedContent',
    ]);
    if (parentObject !== undefined && fromCachedContent != null) {
        setValueByPath(parentObject, ['cachedContent'], tCachedContentName(apiClient, fromCachedContent));
    }
    const fromResponseModalities = getValueByPath(fromObject, [
        'responseModalities',
    ]);
    if (fromResponseModalities != null) {
        setValueByPath(toObject, ['responseModalities'], fromResponseModalities);
    }
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromSpeechConfig = getValueByPath(fromObject, ['speechConfig']);
    if (fromSpeechConfig != null) {
        setValueByPath(toObject, ['speechConfig'], tSpeechConfig(fromSpeechConfig));
    }
    if (getValueByPath(fromObject, ['audioTimestamp']) !== undefined) {
        throw new Error('audioTimestamp parameter is not supported in Gemini API.');
    }
    const fromThinkingConfig = getValueByPath(fromObject, [
        'thinkingConfig',
    ]);
    if (fromThinkingConfig != null) {
        setValueByPath(toObject, ['thinkingConfig'], fromThinkingConfig);
    }
    const fromImageConfig = getValueByPath(fromObject, ['imageConfig']);
    if (fromImageConfig != null) {
        setValueByPath(toObject, ['imageConfig'], imageConfigToMldev$1(fromImageConfig));
    }
    const fromEnableEnhancedCivicAnswers = getValueByPath(fromObject, [
        'enableEnhancedCivicAnswers',
    ]);
    if (fromEnableEnhancedCivicAnswers != null) {
        setValueByPath(toObject, ['enableEnhancedCivicAnswers'], fromEnableEnhancedCivicAnswers);
    }
    if (getValueByPath(fromObject, ['modelArmorConfig']) !== undefined) {
        throw new Error('modelArmorConfig parameter is not supported in Gemini API.');
    }
    const fromServiceTier = getValueByPath(fromObject, ['serviceTier']);
    if (parentObject !== undefined && fromServiceTier != null) {
        setValueByPath(parentObject, ['serviceTier'], fromServiceTier);
    }
    return toObject;
}
function generateContentResponseFromMldev$1(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromCandidates = getValueByPath(fromObject, ['candidates']);
    if (fromCandidates != null) {
        let transformedList = fromCandidates;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return candidateFromMldev$1(item);
            });
        }
        setValueByPath(toObject, ['candidates'], transformedList);
    }
    const fromModelVersion = getValueByPath(fromObject, ['modelVersion']);
    if (fromModelVersion != null) {
        setValueByPath(toObject, ['modelVersion'], fromModelVersion);
    }
    const fromPromptFeedback = getValueByPath(fromObject, [
        'promptFeedback',
    ]);
    if (fromPromptFeedback != null) {
        setValueByPath(toObject, ['promptFeedback'], fromPromptFeedback);
    }
    const fromResponseId = getValueByPath(fromObject, ['responseId']);
    if (fromResponseId != null) {
        setValueByPath(toObject, ['responseId'], fromResponseId);
    }
    const fromUsageMetadata = getValueByPath(fromObject, [
        'usageMetadata',
    ]);
    if (fromUsageMetadata != null) {
        setValueByPath(toObject, ['usageMetadata'], fromUsageMetadata);
    }
    const fromModelStatus = getValueByPath(fromObject, ['modelStatus']);
    if (fromModelStatus != null) {
        setValueByPath(toObject, ['modelStatus'], fromModelStatus);
    }
    return toObject;
}
function getBatchJobParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tBatchJobName(apiClient, fromName));
    }
    return toObject;
}
function getBatchJobParametersToVertex(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tBatchJobName(apiClient, fromName));
    }
    return toObject;
}
function googleMapsToMldev$4(fromObject) {
    const toObject = {};
    const fromAuthConfig = getValueByPath(fromObject, ['authConfig']);
    if (fromAuthConfig != null) {
        setValueByPath(toObject, ['authConfig'], authConfigToMldev$4(fromAuthConfig));
    }
    const fromEnableWidget = getValueByPath(fromObject, ['enableWidget']);
    if (fromEnableWidget != null) {
        setValueByPath(toObject, ['enableWidget'], fromEnableWidget);
    }
    return toObject;
}
function googleSearchToMldev$4(fromObject) {
    const toObject = {};
    const fromSearchTypes = getValueByPath(fromObject, ['searchTypes']);
    if (fromSearchTypes != null) {
        setValueByPath(toObject, ['searchTypes'], fromSearchTypes);
    }
    if (getValueByPath(fromObject, ['blockingConfidence']) !== undefined) {
        throw new Error('blockingConfidence parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['excludeDomains']) !== undefined) {
        throw new Error('excludeDomains parameter is not supported in Gemini API.');
    }
    const fromTimeRangeFilter = getValueByPath(fromObject, [
        'timeRangeFilter',
    ]);
    if (fromTimeRangeFilter != null) {
        setValueByPath(toObject, ['timeRangeFilter'], fromTimeRangeFilter);
    }
    return toObject;
}
function imageConfigToMldev$1(fromObject) {
    const toObject = {};
    const fromAspectRatio = getValueByPath(fromObject, ['aspectRatio']);
    if (fromAspectRatio != null) {
        setValueByPath(toObject, ['aspectRatio'], fromAspectRatio);
    }
    const fromImageSize = getValueByPath(fromObject, ['imageSize']);
    if (fromImageSize != null) {
        setValueByPath(toObject, ['imageSize'], fromImageSize);
    }
    if (getValueByPath(fromObject, ['personGeneration']) !== undefined) {
        throw new Error('personGeneration parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['prominentPeople']) !== undefined) {
        throw new Error('prominentPeople parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['outputMimeType']) !== undefined) {
        throw new Error('outputMimeType parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['outputCompressionQuality']) !==
        undefined) {
        throw new Error('outputCompressionQuality parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['imageOutputOptions']) !== undefined) {
        throw new Error('imageOutputOptions parameter is not supported in Gemini API.');
    }
    return toObject;
}
function inlinedRequestToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['request', 'model'], tModel(apiClient, fromModel));
    }
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (fromContents != null) {
        let transformedList = tContents(fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return contentToMldev$4(item);
            });
        }
        setValueByPath(toObject, ['request', 'contents'], transformedList);
    }
    const fromMetadata = getValueByPath(fromObject, ['metadata']);
    if (fromMetadata != null) {
        setValueByPath(toObject, ['metadata'], fromMetadata);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        setValueByPath(toObject, ['request', 'generationConfig'], generateContentConfigToMldev$1(apiClient, fromConfig, getValueByPath(toObject, ['request'], {})));
    }
    return toObject;
}
function inlinedResponseFromMldev(fromObject) {
    const toObject = {};
    const fromResponse = getValueByPath(fromObject, ['response']);
    if (fromResponse != null) {
        setValueByPath(toObject, ['response'], generateContentResponseFromMldev$1(fromResponse));
    }
    const fromMetadata = getValueByPath(fromObject, ['metadata']);
    if (fromMetadata != null) {
        setValueByPath(toObject, ['metadata'], fromMetadata);
    }
    const fromError = getValueByPath(fromObject, ['error']);
    if (fromError != null) {
        setValueByPath(toObject, ['error'], fromError);
    }
    return toObject;
}
function listBatchJobsConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    if (getValueByPath(fromObject, ['filter']) !== undefined) {
        throw new Error('filter parameter is not supported in Gemini API.');
    }
    return toObject;
}
function listBatchJobsConfigToVertex(fromObject, parentObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    const fromFilter = getValueByPath(fromObject, ['filter']);
    if (parentObject !== undefined && fromFilter != null) {
        setValueByPath(parentObject, ['_query', 'filter'], fromFilter);
    }
    return toObject;
}
function listBatchJobsParametersToMldev(fromObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listBatchJobsConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function listBatchJobsParametersToVertex(fromObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listBatchJobsConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function listBatchJobsResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromBatchJobs = getValueByPath(fromObject, ['operations']);
    if (fromBatchJobs != null) {
        let transformedList = fromBatchJobs;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return batchJobFromMldev(item);
            });
        }
        setValueByPath(toObject, ['batchJobs'], transformedList);
    }
    return toObject;
}
function listBatchJobsResponseFromVertex(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromBatchJobs = getValueByPath(fromObject, [
        'batchPredictionJobs',
    ]);
    if (fromBatchJobs != null) {
        let transformedList = fromBatchJobs;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return batchJobFromVertex(item);
            });
        }
        setValueByPath(toObject, ['batchJobs'], transformedList);
    }
    return toObject;
}
function partToMldev$4(fromObject) {
    const toObject = {};
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromCodeExecutionResult = getValueByPath(fromObject, [
        'codeExecutionResult',
    ]);
    if (fromCodeExecutionResult != null) {
        setValueByPath(toObject, ['codeExecutionResult'], fromCodeExecutionResult);
    }
    const fromExecutableCode = getValueByPath(fromObject, [
        'executableCode',
    ]);
    if (fromExecutableCode != null) {
        setValueByPath(toObject, ['executableCode'], fromExecutableCode);
    }
    const fromFileData = getValueByPath(fromObject, ['fileData']);
    if (fromFileData != null) {
        setValueByPath(toObject, ['fileData'], fileDataToMldev$4(fromFileData));
    }
    const fromFunctionCall = getValueByPath(fromObject, ['functionCall']);
    if (fromFunctionCall != null) {
        setValueByPath(toObject, ['functionCall'], functionCallToMldev$4(fromFunctionCall));
    }
    const fromFunctionResponse = getValueByPath(fromObject, [
        'functionResponse',
    ]);
    if (fromFunctionResponse != null) {
        setValueByPath(toObject, ['functionResponse'], fromFunctionResponse);
    }
    const fromInlineData = getValueByPath(fromObject, ['inlineData']);
    if (fromInlineData != null) {
        setValueByPath(toObject, ['inlineData'], blobToMldev$4(fromInlineData));
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromThought = getValueByPath(fromObject, ['thought']);
    if (fromThought != null) {
        setValueByPath(toObject, ['thought'], fromThought);
    }
    const fromThoughtSignature = getValueByPath(fromObject, [
        'thoughtSignature',
    ]);
    if (fromThoughtSignature != null) {
        setValueByPath(toObject, ['thoughtSignature'], fromThoughtSignature);
    }
    const fromVideoMetadata = getValueByPath(fromObject, [
        'videoMetadata',
    ]);
    if (fromVideoMetadata != null) {
        setValueByPath(toObject, ['videoMetadata'], fromVideoMetadata);
    }
    const fromToolCall = getValueByPath(fromObject, ['toolCall']);
    if (fromToolCall != null) {
        setValueByPath(toObject, ['toolCall'], fromToolCall);
    }
    const fromToolResponse = getValueByPath(fromObject, ['toolResponse']);
    if (fromToolResponse != null) {
        setValueByPath(toObject, ['toolResponse'], fromToolResponse);
    }
    const fromPartMetadata = getValueByPath(fromObject, ['partMetadata']);
    if (fromPartMetadata != null) {
        setValueByPath(toObject, ['partMetadata'], fromPartMetadata);
    }
    return toObject;
}
function safetySettingToMldev$1(fromObject) {
    const toObject = {};
    const fromCategory = getValueByPath(fromObject, ['category']);
    if (fromCategory != null) {
        setValueByPath(toObject, ['category'], fromCategory);
    }
    if (getValueByPath(fromObject, ['method']) !== undefined) {
        throw new Error('method parameter is not supported in Gemini API.');
    }
    const fromThreshold = getValueByPath(fromObject, ['threshold']);
    if (fromThreshold != null) {
        setValueByPath(toObject, ['threshold'], fromThreshold);
    }
    return toObject;
}
function toolConfigToMldev$2(fromObject) {
    const toObject = {};
    const fromRetrievalConfig = getValueByPath(fromObject, [
        'retrievalConfig',
    ]);
    if (fromRetrievalConfig != null) {
        setValueByPath(toObject, ['retrievalConfig'], fromRetrievalConfig);
    }
    const fromFunctionCallingConfig = getValueByPath(fromObject, [
        'functionCallingConfig',
    ]);
    if (fromFunctionCallingConfig != null) {
        setValueByPath(toObject, ['functionCallingConfig'], functionCallingConfigToMldev$2(fromFunctionCallingConfig));
    }
    const fromIncludeServerSideToolInvocations = getValueByPath(fromObject, ['includeServerSideToolInvocations']);
    if (fromIncludeServerSideToolInvocations != null) {
        setValueByPath(toObject, ['includeServerSideToolInvocations'], fromIncludeServerSideToolInvocations);
    }
    return toObject;
}
function toolToMldev$4(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['retrieval']) !== undefined) {
        throw new Error('retrieval parameter is not supported in Gemini API.');
    }
    const fromComputerUse = getValueByPath(fromObject, ['computerUse']);
    if (fromComputerUse != null) {
        setValueByPath(toObject, ['computerUse'], fromComputerUse);
    }
    const fromFileSearch = getValueByPath(fromObject, ['fileSearch']);
    if (fromFileSearch != null) {
        setValueByPath(toObject, ['fileSearch'], fromFileSearch);
    }
    const fromGoogleSearch = getValueByPath(fromObject, ['googleSearch']);
    if (fromGoogleSearch != null) {
        setValueByPath(toObject, ['googleSearch'], googleSearchToMldev$4(fromGoogleSearch));
    }
    const fromGoogleMaps = getValueByPath(fromObject, ['googleMaps']);
    if (fromGoogleMaps != null) {
        setValueByPath(toObject, ['googleMaps'], googleMapsToMldev$4(fromGoogleMaps));
    }
    const fromCodeExecution = getValueByPath(fromObject, [
        'codeExecution',
    ]);
    if (fromCodeExecution != null) {
        setValueByPath(toObject, ['codeExecution'], fromCodeExecution);
    }
    if (getValueByPath(fromObject, ['enterpriseWebSearch']) !== undefined) {
        throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
    }
    const fromFunctionDeclarations = getValueByPath(fromObject, [
        'functionDeclarations',
    ]);
    if (fromFunctionDeclarations != null) {
        let transformedList = fromFunctionDeclarations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['functionDeclarations'], transformedList);
    }
    const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
        'googleSearchRetrieval',
    ]);
    if (fromGoogleSearchRetrieval != null) {
        setValueByPath(toObject, ['googleSearchRetrieval'], fromGoogleSearchRetrieval);
    }
    if (getValueByPath(fromObject, ['parallelAiSearch']) !== undefined) {
        throw new Error('parallelAiSearch parameter is not supported in Gemini API.');
    }
    const fromUrlContext = getValueByPath(fromObject, ['urlContext']);
    if (fromUrlContext != null) {
        setValueByPath(toObject, ['urlContext'], fromUrlContext);
    }
    const fromMcpServers = getValueByPath(fromObject, ['mcpServers']);
    if (fromMcpServers != null) {
        let transformedList = fromMcpServers;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['mcpServers'], transformedList);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var PagedItem;
(function (PagedItem) {
    PagedItem["PAGED_ITEM_BATCH_JOBS"] = "batchJobs";
    PagedItem["PAGED_ITEM_MODELS"] = "models";
    PagedItem["PAGED_ITEM_TUNING_JOBS"] = "tuningJobs";
    PagedItem["PAGED_ITEM_FILES"] = "files";
    PagedItem["PAGED_ITEM_CACHED_CONTENTS"] = "cachedContents";
    PagedItem["PAGED_ITEM_FILE_SEARCH_STORES"] = "fileSearchStores";
    PagedItem["PAGED_ITEM_DOCUMENTS"] = "documents";
})(PagedItem || (PagedItem = {}));
/**
 * Pager class for iterating through paginated results.
 */
class Pager {
    constructor(name, request, response, params) {
        this.pageInternal = [];
        this.paramsInternal = {};
        this.requestInternal = request;
        this.init(name, response, params);
    }
    init(name, response, params) {
        var _a, _b;
        this.nameInternal = name;
        this.pageInternal = response[this.nameInternal] || [];
        this.sdkHttpResponseInternal = response === null || response === void 0 ? void 0 : response.sdkHttpResponse;
        this.idxInternal = 0;
        let requestParams = { config: {} };
        if (!params || Object.keys(params).length === 0) {
            requestParams = { config: {} };
        }
        else if (typeof params === 'object') {
            requestParams = Object.assign({}, params);
        }
        else {
            requestParams = params;
        }
        if (requestParams['config']) {
            requestParams['config']['pageToken'] = response['nextPageToken'];
        }
        this.paramsInternal = requestParams;
        this.pageInternalSize =
            (_b = (_a = requestParams['config']) === null || _a === void 0 ? void 0 : _a['pageSize']) !== null && _b !== void 0 ? _b : this.pageInternal.length;
    }
    initNextPage(response) {
        this.init(this.nameInternal, response, this.paramsInternal);
    }
    /**
     * Returns the current page, which is a list of items.
     *
     * @remarks
     * The first page is retrieved when the pager is created. The returned list of
     * items could be a subset of the entire list.
     */
    get page() {
        return this.pageInternal;
    }
    /**
     * Returns the type of paged item (for example, ``batch_jobs``).
     */
    get name() {
        return this.nameInternal;
    }
    /**
     * Returns the length of the page fetched each time by this pager.
     *
     * @remarks
     * The number of items in the page is less than or equal to the page length.
     */
    get pageSize() {
        return this.pageInternalSize;
    }
    /**
     * Returns the headers of the API response.
     */
    get sdkHttpResponse() {
        return this.sdkHttpResponseInternal;
    }
    /**
     * Returns the parameters when making the API request for the next page.
     *
     * @remarks
     * Parameters contain a set of optional configs that can be
     * used to customize the API request. For example, the `pageToken` parameter
     * contains the token to request the next page.
     */
    get params() {
        return this.paramsInternal;
    }
    /**
     * Returns the total number of items in the current page.
     */
    get pageLength() {
        return this.pageInternal.length;
    }
    /**
     * Returns the item at the given index.
     */
    getItem(index) {
        return this.pageInternal[index];
    }
    /**
     * Returns an async iterator that support iterating through all items
     * retrieved from the API.
     *
     * @remarks
     * The iterator will automatically fetch the next page if there are more items
     * to fetch from the API.
     *
     * @example
     *
     * ```ts
     * const pager = await ai.files.list({config: {pageSize: 10}});
     * for await (const file of pager) {
     *   console.log(file.name);
     * }
     * ```
     */
    [Symbol.asyncIterator]() {
        return {
            next: async () => {
                if (this.idxInternal >= this.pageLength) {
                    if (this.hasNextPage()) {
                        await this.nextPage();
                    }
                    else {
                        return { value: undefined, done: true };
                    }
                }
                const item = this.getItem(this.idxInternal);
                this.idxInternal += 1;
                return { value: item, done: false };
            },
            return: async () => {
                return { value: undefined, done: true };
            },
        };
    }
    /**
     * Fetches the next page of items. This makes a new API request.
     *
     * @throws {Error} If there are no more pages to fetch.
     *
     * @example
     *
     * ```ts
     * const pager = await ai.files.list({config: {pageSize: 10}});
     * let page = pager.page;
     * while (true) {
     *   for (const file of page) {
     *     console.log(file.name);
     *   }
     *   if (!pager.hasNextPage()) {
     *     break;
     *   }
     *   page = await pager.nextPage();
     * }
     * ```
     */
    async nextPage() {
        if (!this.hasNextPage()) {
            throw new Error('No more pages to fetch.');
        }
        const response = await this.requestInternal(this.params);
        this.initNextPage(response);
        return this.page;
    }
    /**
     * Returns true if there are more pages to fetch from the API.
     */
    hasNextPage() {
        var _a;
        if (((_a = this.params['config']) === null || _a === void 0 ? void 0 : _a['pageToken']) !== undefined) {
            return true;
        }
        return false;
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Batches extends BaseModule {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
        /**
         * Lists batch jobs.
         *
         * @param params - The parameters for the list request.
         * @return - A pager of batch jobs.
         *
         * @example
         * ```ts
         * const batchJobs = await ai.batches.list({config: {'pageSize': 2}});
         * for await (const batchJob of batchJobs) {
         *   console.log(batchJob);
         * }
         * ```
         */
        this.list = async (params = {}) => {
            return new Pager(PagedItem.PAGED_ITEM_BATCH_JOBS, (x) => this.listInternal(x), await this.listInternal(params), params);
        };
        /**
         * Create batch job.
         *
         * @param params - The parameters for create batch job request.
         * @return The created batch job.
         *
         * @example
         * ```ts
         * const response = await ai.batches.create({
         *   model: 'gemini-2.0-flash',
         *   src: {gcsUri: 'gs://bucket/path/to/file.jsonl', format: 'jsonl'},
         *   config: {
         *     dest: {gcsUri: 'gs://bucket/path/output/directory', format: 'jsonl'},
         *   }
         * });
         * console.log(response);
         * ```
         */
        this.create = async (params) => {
            if (this.apiClient.isVertexAI()) {
                // Format destination if not provided
                // Cast params.src as Vertex AI path does not handle InlinedRequest[]
                params.config = this.formatDestination(params.src, params.config);
            }
            return this.createInternal(params);
        };
        /**
         * **Experimental** Creates an embedding batch job.
         *
         * @param params - The parameters for create embedding batch job request.
         * @return The created batch job.
         *
         * @example
         * ```ts
         * const response = await ai.batches.createEmbeddings({
         *   model: 'text-embedding-004',
         *   src: {fileName: 'files/my_embedding_input'},
         * });
         * console.log(response);
         * ```
         */
        this.createEmbeddings = async (params) => {
            console.warn('batches.createEmbeddings() is experimental and may change without notice.');
            if (this.apiClient.isVertexAI()) {
                throw new Error('Vertex AI does not support batches.createEmbeddings.');
            }
            return this.createEmbeddingsInternal(params);
        };
    }
    // Helper function to handle inlined generate content requests
    createInlinedGenerateContentRequest(params) {
        const body = createBatchJobParametersToMldev(this.apiClient, // Use instance apiClient
        params);
        const urlParams = body['_url'];
        const path = formatMap('{model}:batchGenerateContent', urlParams);
        const batch = body['batch'];
        const inputConfig = batch['inputConfig'];
        const requestsWrapper = inputConfig['requests'];
        const requests = requestsWrapper['requests'];
        const newRequests = [];
        for (const request of requests) {
            const requestDict = Object.assign({}, request); // Clone
            if (requestDict['systemInstruction']) {
                const systemInstructionValue = requestDict['systemInstruction'];
                delete requestDict['systemInstruction'];
                const requestContent = requestDict['request'];
                requestContent['systemInstruction'] = systemInstructionValue;
                requestDict['request'] = requestContent;
            }
            newRequests.push(requestDict);
        }
        requestsWrapper['requests'] = newRequests;
        delete body['config'];
        delete body['_url'];
        delete body['_query'];
        return { path, body };
    }
    // Helper function to get the first GCS URI
    getGcsUri(src) {
        if (typeof src === 'string') {
            return src.startsWith('gs://') ? src : undefined;
        }
        if (!Array.isArray(src) && src.gcsUri && src.gcsUri.length > 0) {
            return src.gcsUri[0];
        }
        return undefined;
    }
    // Helper function to get the BigQuery URI
    getBigqueryUri(src) {
        if (typeof src === 'string') {
            return src.startsWith('bq://') ? src : undefined;
        }
        if (!Array.isArray(src)) {
            return src.bigqueryUri;
        }
        return undefined;
    }
    // Function to format the destination configuration for Vertex AI
    formatDestination(src, config) {
        const newConfig = config ? Object.assign({}, config) : {};
        const timestampStr = Date.now().toString();
        if (!newConfig.displayName) {
            newConfig.displayName = `genaiBatchJob_${timestampStr}`;
        }
        if (newConfig.dest === undefined) {
            const gcsUri = this.getGcsUri(src);
            const bigqueryUri = this.getBigqueryUri(src);
            if (gcsUri) {
                if (gcsUri.endsWith('.jsonl')) {
                    // For .jsonl files, remove suffix and add /dest
                    newConfig.dest = `${gcsUri.slice(0, -6)}/dest`;
                }
                else {
                    // Fallback for other GCS URIs
                    newConfig.dest = `${gcsUri}_dest_${timestampStr}`;
                }
            }
            else if (bigqueryUri) {
                newConfig.dest = `${bigqueryUri}_dest_${timestampStr}`;
            }
            else {
                throw new Error('Unsupported source for Vertex AI: No GCS or BigQuery URI found.');
            }
        }
        return newConfig;
    }
    /**
     * Internal method to create batch job.
     *
     * @param params - The parameters for create batch job request.
     * @return The created batch job.
     *
     */
    async createInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = createBatchJobParametersToVertex(this.apiClient, params);
            path = formatMap('batchPredictionJobs', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = batchJobFromVertex(apiResponse);
                return resp;
            });
        }
        else {
            const body = createBatchJobParametersToMldev(this.apiClient, params);
            path = formatMap('{model}:batchGenerateContent', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = batchJobFromMldev(apiResponse);
                return resp;
            });
        }
    }
    /**
     * Internal method to create batch job.
     *
     * @param params - The parameters for create batch job request.
     * @return The created batch job.
     *
     */
    async createEmbeddingsInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = createEmbeddingsBatchJobParametersToMldev(this.apiClient, params);
            path = formatMap('{model}:asyncBatchEmbedContent', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = batchJobFromMldev(apiResponse);
                return resp;
            });
        }
    }
    /**
     * Gets batch job configurations.
     *
     * @param params - The parameters for the get request.
     * @return The batch job.
     *
     * @example
     * ```ts
     * await ai.batches.get({name: '...'}); // The server-generated resource name.
     * ```
     */
    async get(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = getBatchJobParametersToVertex(this.apiClient, params);
            path = formatMap('batchPredictionJobs/{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = batchJobFromVertex(apiResponse);
                return resp;
            });
        }
        else {
            const body = getBatchJobParametersToMldev(this.apiClient, params);
            path = formatMap('batches/{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = batchJobFromMldev(apiResponse);
                return resp;
            });
        }
    }
    /**
     * Cancels a batch job.
     *
     * @param params - The parameters for the cancel request.
     * @return The empty response returned by the API.
     *
     * @example
     * ```ts
     * await ai.batches.cancel({name: '...'}); // The server-generated resource name.
     * ```
     */
    async cancel(params) {
        var _a, _b, _c, _d;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = cancelBatchJobParametersToVertex(this.apiClient, params);
            path = formatMap('batchPredictionJobs/{name}:cancel', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            await this.apiClient.request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            });
        }
        else {
            const body = cancelBatchJobParametersToMldev(this.apiClient, params);
            path = formatMap('batches/{name}:cancel', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            await this.apiClient.request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            });
        }
    }
    async listInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = listBatchJobsParametersToVertex(params);
            path = formatMap('batchPredictionJobs', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = listBatchJobsResponseFromVertex(apiResponse);
                const typedResp = new ListBatchJobsResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = listBatchJobsParametersToMldev(params);
            path = formatMap('batches', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = listBatchJobsResponseFromMldev(apiResponse);
                const typedResp = new ListBatchJobsResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Deletes a batch job.
     *
     * @param params - The parameters for the delete request.
     * @return The empty response returned by the API.
     *
     * @example
     * ```ts
     * await ai.batches.delete({name: '...'}); // The server-generated resource name.
     * ```
     */
    async delete(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = deleteBatchJobParametersToVertex(this.apiClient, params);
            path = formatMap('batchPredictionJobs/{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'DELETE',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = deleteResourceJobFromVertex(apiResponse);
                return resp;
            });
        }
        else {
            const body = deleteBatchJobParametersToMldev(this.apiClient, params);
            path = formatMap('batches/{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'DELETE',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = deleteResourceJobFromMldev(apiResponse);
                return resp;
            });
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function authConfigToMldev$3(fromObject) {
    const toObject = {};
    const fromApiKey = getValueByPath(fromObject, ['apiKey']);
    if (fromApiKey != null) {
        setValueByPath(toObject, ['apiKey'], fromApiKey);
    }
    if (getValueByPath(fromObject, ['apiKeyConfig']) !== undefined) {
        throw new Error('apiKeyConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['authType']) !== undefined) {
        throw new Error('authType parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['googleServiceAccountConfig']) !==
        undefined) {
        throw new Error('googleServiceAccountConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['httpBasicAuthConfig']) !== undefined) {
        throw new Error('httpBasicAuthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oauthConfig']) !== undefined) {
        throw new Error('oauthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oidcConfig']) !== undefined) {
        throw new Error('oidcConfig parameter is not supported in Gemini API.');
    }
    return toObject;
}
function blobToMldev$3(fromObject) {
    const toObject = {};
    const fromData = getValueByPath(fromObject, ['data']);
    if (fromData != null) {
        setValueByPath(toObject, ['data'], fromData);
    }
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function contentToMldev$3(fromObject) {
    const toObject = {};
    const fromParts = getValueByPath(fromObject, ['parts']);
    if (fromParts != null) {
        let transformedList = fromParts;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return partToMldev$3(item);
            });
        }
        setValueByPath(toObject, ['parts'], transformedList);
    }
    const fromRole = getValueByPath(fromObject, ['role']);
    if (fromRole != null) {
        setValueByPath(toObject, ['role'], fromRole);
    }
    return toObject;
}
function contentToVertex$2(fromObject) {
    const toObject = {};
    const fromParts = getValueByPath(fromObject, ['parts']);
    if (fromParts != null) {
        let transformedList = fromParts;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return partToVertex$2(item);
            });
        }
        setValueByPath(toObject, ['parts'], transformedList);
    }
    const fromRole = getValueByPath(fromObject, ['role']);
    if (fromRole != null) {
        setValueByPath(toObject, ['role'], fromRole);
    }
    return toObject;
}
function createCachedContentConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromTtl = getValueByPath(fromObject, ['ttl']);
    if (parentObject !== undefined && fromTtl != null) {
        setValueByPath(parentObject, ['ttl'], fromTtl);
    }
    const fromExpireTime = getValueByPath(fromObject, ['expireTime']);
    if (parentObject !== undefined && fromExpireTime != null) {
        setValueByPath(parentObject, ['expireTime'], fromExpireTime);
    }
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (parentObject !== undefined && fromDisplayName != null) {
        setValueByPath(parentObject, ['displayName'], fromDisplayName);
    }
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (parentObject !== undefined && fromContents != null) {
        let transformedList = tContents(fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return contentToMldev$3(item);
            });
        }
        setValueByPath(parentObject, ['contents'], transformedList);
    }
    const fromSystemInstruction = getValueByPath(fromObject, [
        'systemInstruction',
    ]);
    if (parentObject !== undefined && fromSystemInstruction != null) {
        setValueByPath(parentObject, ['systemInstruction'], contentToMldev$3(tContent(fromSystemInstruction)));
    }
    const fromTools = getValueByPath(fromObject, ['tools']);
    if (parentObject !== undefined && fromTools != null) {
        let transformedList = fromTools;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return toolToMldev$3(item);
            });
        }
        setValueByPath(parentObject, ['tools'], transformedList);
    }
    const fromToolConfig = getValueByPath(fromObject, ['toolConfig']);
    if (parentObject !== undefined && fromToolConfig != null) {
        setValueByPath(parentObject, ['toolConfig'], toolConfigToMldev$1(fromToolConfig));
    }
    if (getValueByPath(fromObject, ['kmsKeyName']) !== undefined) {
        throw new Error('kmsKeyName parameter is not supported in Gemini API.');
    }
    return toObject;
}
function createCachedContentConfigToVertex(fromObject, parentObject) {
    const toObject = {};
    const fromTtl = getValueByPath(fromObject, ['ttl']);
    if (parentObject !== undefined && fromTtl != null) {
        setValueByPath(parentObject, ['ttl'], fromTtl);
    }
    const fromExpireTime = getValueByPath(fromObject, ['expireTime']);
    if (parentObject !== undefined && fromExpireTime != null) {
        setValueByPath(parentObject, ['expireTime'], fromExpireTime);
    }
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (parentObject !== undefined && fromDisplayName != null) {
        setValueByPath(parentObject, ['displayName'], fromDisplayName);
    }
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (parentObject !== undefined && fromContents != null) {
        let transformedList = tContents(fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return contentToVertex$2(item);
            });
        }
        setValueByPath(parentObject, ['contents'], transformedList);
    }
    const fromSystemInstruction = getValueByPath(fromObject, [
        'systemInstruction',
    ]);
    if (parentObject !== undefined && fromSystemInstruction != null) {
        setValueByPath(parentObject, ['systemInstruction'], contentToVertex$2(tContent(fromSystemInstruction)));
    }
    const fromTools = getValueByPath(fromObject, ['tools']);
    if (parentObject !== undefined && fromTools != null) {
        let transformedList = fromTools;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return toolToVertex$2(item);
            });
        }
        setValueByPath(parentObject, ['tools'], transformedList);
    }
    const fromToolConfig = getValueByPath(fromObject, ['toolConfig']);
    if (parentObject !== undefined && fromToolConfig != null) {
        setValueByPath(parentObject, ['toolConfig'], toolConfigToVertex$1(fromToolConfig));
    }
    const fromKmsKeyName = getValueByPath(fromObject, ['kmsKeyName']);
    if (parentObject !== undefined && fromKmsKeyName != null) {
        setValueByPath(parentObject, ['encryption_spec', 'kmsKeyName'], fromKmsKeyName);
    }
    return toObject;
}
function createCachedContentParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['model'], tCachesModel(apiClient, fromModel));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        createCachedContentConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function createCachedContentParametersToVertex(apiClient, fromObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['model'], tCachesModel(apiClient, fromModel));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        createCachedContentConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function deleteCachedContentParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tCachedContentName(apiClient, fromName));
    }
    return toObject;
}
function deleteCachedContentParametersToVertex(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tCachedContentName(apiClient, fromName));
    }
    return toObject;
}
function deleteCachedContentResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    return toObject;
}
function deleteCachedContentResponseFromVertex(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    return toObject;
}
function fileDataToMldev$3(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromFileUri = getValueByPath(fromObject, ['fileUri']);
    if (fromFileUri != null) {
        setValueByPath(toObject, ['fileUri'], fromFileUri);
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function functionCallToMldev$3(fromObject) {
    const toObject = {};
    const fromId = getValueByPath(fromObject, ['id']);
    if (fromId != null) {
        setValueByPath(toObject, ['id'], fromId);
    }
    const fromArgs = getValueByPath(fromObject, ['args']);
    if (fromArgs != null) {
        setValueByPath(toObject, ['args'], fromArgs);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    if (getValueByPath(fromObject, ['partialArgs']) !== undefined) {
        throw new Error('partialArgs parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['willContinue']) !== undefined) {
        throw new Error('willContinue parameter is not supported in Gemini API.');
    }
    return toObject;
}
function functionCallingConfigToMldev$1(fromObject) {
    const toObject = {};
    const fromAllowedFunctionNames = getValueByPath(fromObject, [
        'allowedFunctionNames',
    ]);
    if (fromAllowedFunctionNames != null) {
        setValueByPath(toObject, ['allowedFunctionNames'], fromAllowedFunctionNames);
    }
    const fromMode = getValueByPath(fromObject, ['mode']);
    if (fromMode != null) {
        setValueByPath(toObject, ['mode'], fromMode);
    }
    if (getValueByPath(fromObject, ['streamFunctionCallArguments']) !==
        undefined) {
        throw new Error('streamFunctionCallArguments parameter is not supported in Gemini API.');
    }
    return toObject;
}
function functionDeclarationToVertex$2(fromObject) {
    const toObject = {};
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (fromDescription != null) {
        setValueByPath(toObject, ['description'], fromDescription);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromParameters = getValueByPath(fromObject, ['parameters']);
    if (fromParameters != null) {
        setValueByPath(toObject, ['parameters'], fromParameters);
    }
    const fromParametersJsonSchema = getValueByPath(fromObject, [
        'parametersJsonSchema',
    ]);
    if (fromParametersJsonSchema != null) {
        setValueByPath(toObject, ['parametersJsonSchema'], fromParametersJsonSchema);
    }
    const fromResponse = getValueByPath(fromObject, ['response']);
    if (fromResponse != null) {
        setValueByPath(toObject, ['response'], fromResponse);
    }
    const fromResponseJsonSchema = getValueByPath(fromObject, [
        'responseJsonSchema',
    ]);
    if (fromResponseJsonSchema != null) {
        setValueByPath(toObject, ['responseJsonSchema'], fromResponseJsonSchema);
    }
    if (getValueByPath(fromObject, ['behavior']) !== undefined) {
        throw new Error('behavior parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function getCachedContentParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tCachedContentName(apiClient, fromName));
    }
    return toObject;
}
function getCachedContentParametersToVertex(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tCachedContentName(apiClient, fromName));
    }
    return toObject;
}
function googleMapsToMldev$3(fromObject) {
    const toObject = {};
    const fromAuthConfig = getValueByPath(fromObject, ['authConfig']);
    if (fromAuthConfig != null) {
        setValueByPath(toObject, ['authConfig'], authConfigToMldev$3(fromAuthConfig));
    }
    const fromEnableWidget = getValueByPath(fromObject, ['enableWidget']);
    if (fromEnableWidget != null) {
        setValueByPath(toObject, ['enableWidget'], fromEnableWidget);
    }
    return toObject;
}
function googleSearchToMldev$3(fromObject) {
    const toObject = {};
    const fromSearchTypes = getValueByPath(fromObject, ['searchTypes']);
    if (fromSearchTypes != null) {
        setValueByPath(toObject, ['searchTypes'], fromSearchTypes);
    }
    if (getValueByPath(fromObject, ['blockingConfidence']) !== undefined) {
        throw new Error('blockingConfidence parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['excludeDomains']) !== undefined) {
        throw new Error('excludeDomains parameter is not supported in Gemini API.');
    }
    const fromTimeRangeFilter = getValueByPath(fromObject, [
        'timeRangeFilter',
    ]);
    if (fromTimeRangeFilter != null) {
        setValueByPath(toObject, ['timeRangeFilter'], fromTimeRangeFilter);
    }
    return toObject;
}
function listCachedContentsConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    return toObject;
}
function listCachedContentsConfigToVertex(fromObject, parentObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    return toObject;
}
function listCachedContentsParametersToMldev(fromObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listCachedContentsConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function listCachedContentsParametersToVertex(fromObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listCachedContentsConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function listCachedContentsResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromCachedContents = getValueByPath(fromObject, [
        'cachedContents',
    ]);
    if (fromCachedContents != null) {
        let transformedList = fromCachedContents;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['cachedContents'], transformedList);
    }
    return toObject;
}
function listCachedContentsResponseFromVertex(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromCachedContents = getValueByPath(fromObject, [
        'cachedContents',
    ]);
    if (fromCachedContents != null) {
        let transformedList = fromCachedContents;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['cachedContents'], transformedList);
    }
    return toObject;
}
function partToMldev$3(fromObject) {
    const toObject = {};
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromCodeExecutionResult = getValueByPath(fromObject, [
        'codeExecutionResult',
    ]);
    if (fromCodeExecutionResult != null) {
        setValueByPath(toObject, ['codeExecutionResult'], fromCodeExecutionResult);
    }
    const fromExecutableCode = getValueByPath(fromObject, [
        'executableCode',
    ]);
    if (fromExecutableCode != null) {
        setValueByPath(toObject, ['executableCode'], fromExecutableCode);
    }
    const fromFileData = getValueByPath(fromObject, ['fileData']);
    if (fromFileData != null) {
        setValueByPath(toObject, ['fileData'], fileDataToMldev$3(fromFileData));
    }
    const fromFunctionCall = getValueByPath(fromObject, ['functionCall']);
    if (fromFunctionCall != null) {
        setValueByPath(toObject, ['functionCall'], functionCallToMldev$3(fromFunctionCall));
    }
    const fromFunctionResponse = getValueByPath(fromObject, [
        'functionResponse',
    ]);
    if (fromFunctionResponse != null) {
        setValueByPath(toObject, ['functionResponse'], fromFunctionResponse);
    }
    const fromInlineData = getValueByPath(fromObject, ['inlineData']);
    if (fromInlineData != null) {
        setValueByPath(toObject, ['inlineData'], blobToMldev$3(fromInlineData));
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromThought = getValueByPath(fromObject, ['thought']);
    if (fromThought != null) {
        setValueByPath(toObject, ['thought'], fromThought);
    }
    const fromThoughtSignature = getValueByPath(fromObject, [
        'thoughtSignature',
    ]);
    if (fromThoughtSignature != null) {
        setValueByPath(toObject, ['thoughtSignature'], fromThoughtSignature);
    }
    const fromVideoMetadata = getValueByPath(fromObject, [
        'videoMetadata',
    ]);
    if (fromVideoMetadata != null) {
        setValueByPath(toObject, ['videoMetadata'], fromVideoMetadata);
    }
    const fromToolCall = getValueByPath(fromObject, ['toolCall']);
    if (fromToolCall != null) {
        setValueByPath(toObject, ['toolCall'], fromToolCall);
    }
    const fromToolResponse = getValueByPath(fromObject, ['toolResponse']);
    if (fromToolResponse != null) {
        setValueByPath(toObject, ['toolResponse'], fromToolResponse);
    }
    const fromPartMetadata = getValueByPath(fromObject, ['partMetadata']);
    if (fromPartMetadata != null) {
        setValueByPath(toObject, ['partMetadata'], fromPartMetadata);
    }
    return toObject;
}
function partToVertex$2(fromObject) {
    const toObject = {};
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromCodeExecutionResult = getValueByPath(fromObject, [
        'codeExecutionResult',
    ]);
    if (fromCodeExecutionResult != null) {
        setValueByPath(toObject, ['codeExecutionResult'], fromCodeExecutionResult);
    }
    const fromExecutableCode = getValueByPath(fromObject, [
        'executableCode',
    ]);
    if (fromExecutableCode != null) {
        setValueByPath(toObject, ['executableCode'], fromExecutableCode);
    }
    const fromFileData = getValueByPath(fromObject, ['fileData']);
    if (fromFileData != null) {
        setValueByPath(toObject, ['fileData'], fromFileData);
    }
    const fromFunctionCall = getValueByPath(fromObject, ['functionCall']);
    if (fromFunctionCall != null) {
        setValueByPath(toObject, ['functionCall'], fromFunctionCall);
    }
    const fromFunctionResponse = getValueByPath(fromObject, [
        'functionResponse',
    ]);
    if (fromFunctionResponse != null) {
        setValueByPath(toObject, ['functionResponse'], fromFunctionResponse);
    }
    const fromInlineData = getValueByPath(fromObject, ['inlineData']);
    if (fromInlineData != null) {
        setValueByPath(toObject, ['inlineData'], fromInlineData);
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromThought = getValueByPath(fromObject, ['thought']);
    if (fromThought != null) {
        setValueByPath(toObject, ['thought'], fromThought);
    }
    const fromThoughtSignature = getValueByPath(fromObject, [
        'thoughtSignature',
    ]);
    if (fromThoughtSignature != null) {
        setValueByPath(toObject, ['thoughtSignature'], fromThoughtSignature);
    }
    const fromVideoMetadata = getValueByPath(fromObject, [
        'videoMetadata',
    ]);
    if (fromVideoMetadata != null) {
        setValueByPath(toObject, ['videoMetadata'], fromVideoMetadata);
    }
    if (getValueByPath(fromObject, ['toolCall']) !== undefined) {
        throw new Error('toolCall parameter is not supported in Vertex AI.');
    }
    if (getValueByPath(fromObject, ['toolResponse']) !== undefined) {
        throw new Error('toolResponse parameter is not supported in Vertex AI.');
    }
    if (getValueByPath(fromObject, ['partMetadata']) !== undefined) {
        throw new Error('partMetadata parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function toolConfigToMldev$1(fromObject) {
    const toObject = {};
    const fromRetrievalConfig = getValueByPath(fromObject, [
        'retrievalConfig',
    ]);
    if (fromRetrievalConfig != null) {
        setValueByPath(toObject, ['retrievalConfig'], fromRetrievalConfig);
    }
    const fromFunctionCallingConfig = getValueByPath(fromObject, [
        'functionCallingConfig',
    ]);
    if (fromFunctionCallingConfig != null) {
        setValueByPath(toObject, ['functionCallingConfig'], functionCallingConfigToMldev$1(fromFunctionCallingConfig));
    }
    const fromIncludeServerSideToolInvocations = getValueByPath(fromObject, ['includeServerSideToolInvocations']);
    if (fromIncludeServerSideToolInvocations != null) {
        setValueByPath(toObject, ['includeServerSideToolInvocations'], fromIncludeServerSideToolInvocations);
    }
    return toObject;
}
function toolConfigToVertex$1(fromObject) {
    const toObject = {};
    const fromRetrievalConfig = getValueByPath(fromObject, [
        'retrievalConfig',
    ]);
    if (fromRetrievalConfig != null) {
        setValueByPath(toObject, ['retrievalConfig'], fromRetrievalConfig);
    }
    const fromFunctionCallingConfig = getValueByPath(fromObject, [
        'functionCallingConfig',
    ]);
    if (fromFunctionCallingConfig != null) {
        setValueByPath(toObject, ['functionCallingConfig'], fromFunctionCallingConfig);
    }
    if (getValueByPath(fromObject, ['includeServerSideToolInvocations']) !==
        undefined) {
        throw new Error('includeServerSideToolInvocations parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function toolToMldev$3(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['retrieval']) !== undefined) {
        throw new Error('retrieval parameter is not supported in Gemini API.');
    }
    const fromComputerUse = getValueByPath(fromObject, ['computerUse']);
    if (fromComputerUse != null) {
        setValueByPath(toObject, ['computerUse'], fromComputerUse);
    }
    const fromFileSearch = getValueByPath(fromObject, ['fileSearch']);
    if (fromFileSearch != null) {
        setValueByPath(toObject, ['fileSearch'], fromFileSearch);
    }
    const fromGoogleSearch = getValueByPath(fromObject, ['googleSearch']);
    if (fromGoogleSearch != null) {
        setValueByPath(toObject, ['googleSearch'], googleSearchToMldev$3(fromGoogleSearch));
    }
    const fromGoogleMaps = getValueByPath(fromObject, ['googleMaps']);
    if (fromGoogleMaps != null) {
        setValueByPath(toObject, ['googleMaps'], googleMapsToMldev$3(fromGoogleMaps));
    }
    const fromCodeExecution = getValueByPath(fromObject, [
        'codeExecution',
    ]);
    if (fromCodeExecution != null) {
        setValueByPath(toObject, ['codeExecution'], fromCodeExecution);
    }
    if (getValueByPath(fromObject, ['enterpriseWebSearch']) !== undefined) {
        throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
    }
    const fromFunctionDeclarations = getValueByPath(fromObject, [
        'functionDeclarations',
    ]);
    if (fromFunctionDeclarations != null) {
        let transformedList = fromFunctionDeclarations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['functionDeclarations'], transformedList);
    }
    const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
        'googleSearchRetrieval',
    ]);
    if (fromGoogleSearchRetrieval != null) {
        setValueByPath(toObject, ['googleSearchRetrieval'], fromGoogleSearchRetrieval);
    }
    if (getValueByPath(fromObject, ['parallelAiSearch']) !== undefined) {
        throw new Error('parallelAiSearch parameter is not supported in Gemini API.');
    }
    const fromUrlContext = getValueByPath(fromObject, ['urlContext']);
    if (fromUrlContext != null) {
        setValueByPath(toObject, ['urlContext'], fromUrlContext);
    }
    const fromMcpServers = getValueByPath(fromObject, ['mcpServers']);
    if (fromMcpServers != null) {
        let transformedList = fromMcpServers;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['mcpServers'], transformedList);
    }
    return toObject;
}
function toolToVertex$2(fromObject) {
    const toObject = {};
    const fromRetrieval = getValueByPath(fromObject, ['retrieval']);
    if (fromRetrieval != null) {
        setValueByPath(toObject, ['retrieval'], fromRetrieval);
    }
    const fromComputerUse = getValueByPath(fromObject, ['computerUse']);
    if (fromComputerUse != null) {
        setValueByPath(toObject, ['computerUse'], fromComputerUse);
    }
    if (getValueByPath(fromObject, ['fileSearch']) !== undefined) {
        throw new Error('fileSearch parameter is not supported in Vertex AI.');
    }
    const fromGoogleSearch = getValueByPath(fromObject, ['googleSearch']);
    if (fromGoogleSearch != null) {
        setValueByPath(toObject, ['googleSearch'], fromGoogleSearch);
    }
    const fromGoogleMaps = getValueByPath(fromObject, ['googleMaps']);
    if (fromGoogleMaps != null) {
        setValueByPath(toObject, ['googleMaps'], fromGoogleMaps);
    }
    const fromCodeExecution = getValueByPath(fromObject, [
        'codeExecution',
    ]);
    if (fromCodeExecution != null) {
        setValueByPath(toObject, ['codeExecution'], fromCodeExecution);
    }
    const fromEnterpriseWebSearch = getValueByPath(fromObject, [
        'enterpriseWebSearch',
    ]);
    if (fromEnterpriseWebSearch != null) {
        setValueByPath(toObject, ['enterpriseWebSearch'], fromEnterpriseWebSearch);
    }
    const fromFunctionDeclarations = getValueByPath(fromObject, [
        'functionDeclarations',
    ]);
    if (fromFunctionDeclarations != null) {
        let transformedList = fromFunctionDeclarations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return functionDeclarationToVertex$2(item);
            });
        }
        setValueByPath(toObject, ['functionDeclarations'], transformedList);
    }
    const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
        'googleSearchRetrieval',
    ]);
    if (fromGoogleSearchRetrieval != null) {
        setValueByPath(toObject, ['googleSearchRetrieval'], fromGoogleSearchRetrieval);
    }
    const fromParallelAiSearch = getValueByPath(fromObject, [
        'parallelAiSearch',
    ]);
    if (fromParallelAiSearch != null) {
        setValueByPath(toObject, ['parallelAiSearch'], fromParallelAiSearch);
    }
    const fromUrlContext = getValueByPath(fromObject, ['urlContext']);
    if (fromUrlContext != null) {
        setValueByPath(toObject, ['urlContext'], fromUrlContext);
    }
    if (getValueByPath(fromObject, ['mcpServers']) !== undefined) {
        throw new Error('mcpServers parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function updateCachedContentConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromTtl = getValueByPath(fromObject, ['ttl']);
    if (parentObject !== undefined && fromTtl != null) {
        setValueByPath(parentObject, ['ttl'], fromTtl);
    }
    const fromExpireTime = getValueByPath(fromObject, ['expireTime']);
    if (parentObject !== undefined && fromExpireTime != null) {
        setValueByPath(parentObject, ['expireTime'], fromExpireTime);
    }
    return toObject;
}
function updateCachedContentConfigToVertex(fromObject, parentObject) {
    const toObject = {};
    const fromTtl = getValueByPath(fromObject, ['ttl']);
    if (parentObject !== undefined && fromTtl != null) {
        setValueByPath(parentObject, ['ttl'], fromTtl);
    }
    const fromExpireTime = getValueByPath(fromObject, ['expireTime']);
    if (parentObject !== undefined && fromExpireTime != null) {
        setValueByPath(parentObject, ['expireTime'], fromExpireTime);
    }
    return toObject;
}
function updateCachedContentParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tCachedContentName(apiClient, fromName));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        updateCachedContentConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function updateCachedContentParametersToVertex(apiClient, fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], tCachedContentName(apiClient, fromName));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        updateCachedContentConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Caches extends BaseModule {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
        /**
         * Lists cached contents.
         *
         * @param params - The parameters for the list request.
         * @return - A pager of cached contents.
         *
         * @example
         * ```ts
         * const cachedContents = await ai.caches.list({config: {'pageSize': 2}});
         * for await (const cachedContent of cachedContents) {
         *   console.log(cachedContent);
         * }
         * ```
         */
        this.list = async (params = {}) => {
            return new Pager(PagedItem.PAGED_ITEM_CACHED_CONTENTS, (x) => this.listInternal(x), await this.listInternal(params), params);
        };
    }
    /**
     * Creates a cached contents resource.
     *
     * @remarks
     * Context caching is only supported for specific models. See [Gemini
     * Developer API reference](https://ai.google.dev/gemini-api/docs/caching?lang=node/context-cac)
     * and [Vertex AI reference](https://cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-overview#supported_models)
     * for more information.
     *
     * @param params - The parameters for the create request.
     * @return The created cached content.
     *
     * @example
     * ```ts
     * const contents = ...; // Initialize the content to cache.
     * const response = await ai.caches.create({
     *   model: 'gemini-2.0-flash-001',
     *   config: {
     *    'contents': contents,
     *    'displayName': 'test cache',
     *    'systemInstruction': 'What is the sum of the two pdfs?',
     *    'ttl': '86400s',
     *  }
     * });
     * ```
     */
    async create(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = createCachedContentParametersToVertex(this.apiClient, params);
            path = formatMap('cachedContents', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
        else {
            const body = createCachedContentParametersToMldev(this.apiClient, params);
            path = formatMap('cachedContents', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
    }
    /**
     * Gets cached content configurations.
     *
     * @param params - The parameters for the get request.
     * @return The cached content.
     *
     * @example
     * ```ts
     * await ai.caches.get({name: '...'}); // The server-generated resource name.
     * ```
     */
    async get(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = getCachedContentParametersToVertex(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
        else {
            const body = getCachedContentParametersToMldev(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
    }
    /**
     * Deletes cached content.
     *
     * @param params - The parameters for the delete request.
     * @return The empty response returned by the API.
     *
     * @example
     * ```ts
     * await ai.caches.delete({name: '...'}); // The server-generated resource name.
     * ```
     */
    async delete(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = deleteCachedContentParametersToVertex(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'DELETE',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = deleteCachedContentResponseFromVertex(apiResponse);
                const typedResp = new DeleteCachedContentResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = deleteCachedContentParametersToMldev(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'DELETE',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = deleteCachedContentResponseFromMldev(apiResponse);
                const typedResp = new DeleteCachedContentResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Updates cached content configurations.
     *
     * @param params - The parameters for the update request.
     * @return The updated cached content.
     *
     * @example
     * ```ts
     * const response = await ai.caches.update({
     *   name: '...',  // The server-generated resource name.
     *   config: {'ttl': '7600s'}
     * });
     * ```
     */
    async update(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = updateCachedContentParametersToVertex(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'PATCH',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
        else {
            const body = updateCachedContentParametersToMldev(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'PATCH',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
    }
    async listInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = listCachedContentsParametersToVertex(params);
            path = formatMap('cachedContents', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = listCachedContentsResponseFromVertex(apiResponse);
                const typedResp = new ListCachedContentsResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = listCachedContentsParametersToMldev(params);
            path = formatMap('cachedContents', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = listCachedContentsResponseFromMldev(apiResponse);
                const typedResp = new ListCachedContentsResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
}

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


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

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

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
/**
 * Returns true if the response is valid, false otherwise.
 */
function isValidResponse(response) {
    var _a;
    if (response.candidates == undefined || response.candidates.length === 0) {
        return false;
    }
    const content = (_a = response.candidates[0]) === null || _a === void 0 ? void 0 : _a.content;
    if (content === undefined) {
        return false;
    }
    return isValidContent(content);
}
function isValidContent(content) {
    if (content.parts === undefined || content.parts.length === 0) {
        return false;
    }
    for (const part of content.parts) {
        if (part === undefined || Object.keys(part).length === 0) {
            return false;
        }
    }
    return true;
}
/**
 * Validates the history contains the correct roles.
 *
 * @throws Error if the history does not start with a user turn.
 * @throws Error if the history contains an invalid role.
 */
function validateHistory(history) {
    // Empty history is valid.
    if (history.length === 0) {
        return;
    }
    for (const content of history) {
        if (content.role !== 'user' && content.role !== 'model') {
            throw new Error(`Role must be user or model, but got ${content.role}.`);
        }
    }
}
/**
 * Extracts the curated (valid) history from a comprehensive history.
 *
 * @remarks
 * The model may sometimes generate invalid or empty contents(e.g., due to safty
 * filters or recitation). Extracting valid turns from the history
 * ensures that subsequent requests could be accpeted by the model.
 */
function extractCuratedHistory(comprehensiveHistory) {
    if (comprehensiveHistory === undefined || comprehensiveHistory.length === 0) {
        return [];
    }
    const curatedHistory = [];
    const length = comprehensiveHistory.length;
    let i = 0;
    while (i < length) {
        if (comprehensiveHistory[i].role === 'user') {
            curatedHistory.push(comprehensiveHistory[i]);
            i++;
        }
        else {
            const modelOutput = [];
            let isValid = true;
            while (i < length && comprehensiveHistory[i].role === 'model') {
                modelOutput.push(comprehensiveHistory[i]);
                if (isValid && !isValidContent(comprehensiveHistory[i])) {
                    isValid = false;
                }
                i++;
            }
            if (isValid) {
                curatedHistory.push(...modelOutput);
            }
            else {
                // Remove the last user input when model content is invalid.
                curatedHistory.pop();
            }
        }
    }
    return curatedHistory;
}
/**
 * A utility class to create a chat session.
 */
class Chats {
    constructor(modelsModule, apiClient) {
        this.modelsModule = modelsModule;
        this.apiClient = apiClient;
    }
    /**
     * Creates a new chat session.
     *
     * @remarks
     * The config in the params will be used for all requests within the chat
     * session unless overridden by a per-request `config` in
     * @see {@link types.SendMessageParameters#config}.
     *
     * @param params - Parameters for creating a chat session.
     * @returns A new chat session.
     *
     * @example
     * ```ts
     * const chat = ai.chats.create({
     *   model: 'gemini-2.0-flash'
     *   config: {
     *     temperature: 0.5,
     *     maxOutputTokens: 1024,
     *   }
     * });
     * ```
     */
    create(params) {
        return new Chat(this.apiClient, this.modelsModule, params.model, params.config, 
        // Deep copy the history to avoid mutating the history outside of the
        // chat session.
        structuredClone(params.history));
    }
}
/**
 * Chat session that enables sending messages to the model with previous
 * conversation context.
 *
 * @remarks
 * The session maintains all the turns between user and model.
 */
class Chat {
    constructor(apiClient, modelsModule, model, config = {}, history = []) {
        this.apiClient = apiClient;
        this.modelsModule = modelsModule;
        this.model = model;
        this.config = config;
        this.history = history;
        // A promise to represent the current state of the message being sent to the
        // model.
        this.sendPromise = Promise.resolve();
        validateHistory(history);
    }
    /**
     * Sends a message to the model and returns the response.
     *
     * @remarks
     * This method will wait for the previous message to be processed before
     * sending the next message.
     *
     * @see {@link Chat#sendMessageStream} for streaming method.
     * @param params - parameters for sending messages within a chat session.
     * @returns The model's response.
     *
     * @example
     * ```ts
     * const chat = ai.chats.create({model: 'gemini-2.0-flash'});
     * const response = await chat.sendMessage({
     *   message: 'Why is the sky blue?'
     * });
     * console.log(response.text);
     * ```
     */
    async sendMessage(params) {
        var _a;
        await this.sendPromise;
        const inputContent = tContent(params.message);
        const responsePromise = this.modelsModule.generateContent({
            model: this.model,
            contents: this.getHistory(true).concat(inputContent),
            config: (_a = params.config) !== null && _a !== void 0 ? _a : this.config,
        });
        this.sendPromise = (async () => {
            var _a, _b, _c;
            const response = await responsePromise;
            const outputContent = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content;
            // Because the AFC input contains the entire curated chat history in
            // addition to the new user input, we need to truncate the AFC history
            // to deduplicate the existing chat history.
            const fullAutomaticFunctionCallingHistory = response.automaticFunctionCallingHistory;
            const index = this.getHistory(true).length;
            let automaticFunctionCallingHistory = [];
            if (fullAutomaticFunctionCallingHistory != null) {
                automaticFunctionCallingHistory =
                    (_c = fullAutomaticFunctionCallingHistory.slice(index)) !== null && _c !== void 0 ? _c : [];
            }
            const modelOutput = outputContent ? [outputContent] : [];
            this.recordHistory(inputContent, modelOutput, automaticFunctionCallingHistory);
            return;
        })();
        await this.sendPromise.catch(() => {
            // Resets sendPromise to avoid subsequent calls failing
            this.sendPromise = Promise.resolve();
        });
        return responsePromise;
    }
    /**
     * Sends a message to the model and returns the response in chunks.
     *
     * @remarks
     * This method will wait for the previous message to be processed before
     * sending the next message.
     *
     * @see {@link Chat#sendMessage} for non-streaming method.
     * @param params - parameters for sending the message.
     * @return The model's response.
     *
     * @example
     * ```ts
     * const chat = ai.chats.create({model: 'gemini-2.0-flash'});
     * const response = await chat.sendMessageStream({
     *   message: 'Why is the sky blue?'
     * });
     * for await (const chunk of response) {
     *   console.log(chunk.text);
     * }
     * ```
     */
    async sendMessageStream(params) {
        var _a;
        await this.sendPromise;
        const inputContent = tContent(params.message);
        const streamResponse = this.modelsModule.generateContentStream({
            model: this.model,
            contents: this.getHistory(true).concat(inputContent),
            config: (_a = params.config) !== null && _a !== void 0 ? _a : this.config,
        });
        // Resolve the internal tracking of send completion promise - `sendPromise`
        // for both success and failure response. The actual failure is still
        // propagated by the `await streamResponse`.
        this.sendPromise = streamResponse
            .then(() => undefined)
            .catch(() => undefined);
        const response = await streamResponse;
        const result = this.processStreamResponse(response, inputContent);
        return result;
    }
    /**
     * Returns the chat history.
     *
     * @remarks
     * The history is a list of contents alternating between user and model.
     *
     * There are two types of history:
     * - The `curated history` contains only the valid turns between user and
     * model, which will be included in the subsequent requests sent to the model.
     * - The `comprehensive history` contains all turns, including invalid or
     *   empty model outputs, providing a complete record of the history.
     *
     * The history is updated after receiving the response from the model,
     * for streaming response, it means receiving the last chunk of the response.
     *
     * The `comprehensive history` is returned by default. To get the `curated
     * history`, set the `curated` parameter to `true`.
     *
     * @param curated - whether to return the curated history or the comprehensive
     *     history.
     * @return History contents alternating between user and model for the entire
     *     chat session.
     */
    getHistory(curated = false) {
        const history = curated
            ? extractCuratedHistory(this.history)
            : this.history;
        // Deep copy the history to avoid mutating the history outside of the
        // chat session.
        return structuredClone(history);
    }
    processStreamResponse(streamResponse, inputContent) {
        return __asyncGenerator(this, arguments, function* processStreamResponse_1() {
            var _a, e_1, _b, _c;
            var _d, _e;
            const outputContent = [];
            try {
                for (var _f = true, streamResponse_1 = __asyncValues(streamResponse), streamResponse_1_1; streamResponse_1_1 = yield __await(streamResponse_1.next()), _a = streamResponse_1_1.done, !_a; _f = true) {
                    _c = streamResponse_1_1.value;
                    _f = false;
                    const chunk = _c;
                    if (isValidResponse(chunk)) {
                        const content = (_e = (_d = chunk.candidates) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.content;
                        if (content !== undefined) {
                            outputContent.push(content);
                        }
                    }
                    yield yield __await(chunk);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = streamResponse_1.return)) yield __await(_b.call(streamResponse_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.recordHistory(inputContent, outputContent);
        });
    }
    recordHistory(userInput, modelOutput, automaticFunctionCallingHistory) {
        let outputContents = [];
        if (modelOutput.length > 0 &&
            modelOutput.every((content) => content.role !== undefined)) {
            outputContents = modelOutput;
        }
        else {
            // Appends an empty content when model returns empty response, so that the
            // history is always alternating between user and model.
            outputContents.push({
                role: 'model',
                parts: [],
            });
        }
        if (automaticFunctionCallingHistory &&
            automaticFunctionCallingHistory.length > 0) {
            this.history.push(...extractCuratedHistory(automaticFunctionCallingHistory));
        }
        else {
            this.history.push(userInput);
        }
        this.history.push(...outputContents);
    }
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
function createFileParametersToMldev(fromObject) {
    const toObject = {};
    const fromFile = getValueByPath(fromObject, ['file']);
    if (fromFile != null) {
        setValueByPath(toObject, ['file'], fromFile);
    }
    return toObject;
}
function createFileResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    return toObject;
}
function deleteFileParametersToMldev(fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'file'], tFileName(fromName));
    }
    return toObject;
}
function deleteFileResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    return toObject;
}
function getFileParametersToMldev(fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'file'], tFileName(fromName));
    }
    return toObject;
}
function internalRegisterFilesParametersToMldev(fromObject) {
    const toObject = {};
    const fromUris = getValueByPath(fromObject, ['uris']);
    if (fromUris != null) {
        setValueByPath(toObject, ['uris'], fromUris);
    }
    return toObject;
}
function listFilesConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    return toObject;
}
function listFilesParametersToMldev(fromObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listFilesConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function listFilesResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromFiles = getValueByPath(fromObject, ['files']);
    if (fromFiles != null) {
        let transformedList = fromFiles;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['files'], transformedList);
    }
    return toObject;
}
function registerFilesResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromFiles = getValueByPath(fromObject, ['files']);
    if (fromFiles != null) {
        let transformedList = fromFiles;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['files'], transformedList);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Files extends BaseModule {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
        /**
         * Lists files.
         *
         * @param params - The parameters for the list request.
         * @return - A pager of files.
         *
         * @example
         * ```ts
         * const files = await ai.files.list({config: {'pageSize': 2}});
         * for await (const file of files) {
         *   console.log(file);
         * }
         * ```
         */
        this.list = async (params = {}) => {
            return new Pager(PagedItem.PAGED_ITEM_FILES, (x) => this.listInternal(x), await this.listInternal(params), params);
        };
    }
    /**
     * Uploads a file asynchronously to the Gemini API.
     * This method is not available in Vertex AI.
     * Supported upload sources:
     * - Node.js: File path (string) or Blob object.
     * - Browser: Blob object (e.g., File).
     *
     * @remarks
     * The `mimeType` can be specified in the `config` parameter. If omitted:
     *  - For file path (string) inputs, the `mimeType` will be inferred from the
     *     file extension.
     *  - For Blob object inputs, the `mimeType` will be set to the Blob's `type`
     *     property.
     * Somex eamples for file extension to mimeType mapping:
     * .txt -> text/plain
     * .json -> application/json
     * .jpg  -> image/jpeg
     * .png -> image/png
     * .mp3 -> audio/mpeg
     * .mp4 -> video/mp4
     *
     * This section can contain multiple paragraphs and code examples.
     *
     * @param params - Optional parameters specified in the
     *        `types.UploadFileParameters` interface.
     *         @see {@link types.UploadFileParameters#config} for the optional
     *         config in the parameters.
     * @return A promise that resolves to a `types.File` object.
     * @throws An error if called on a Vertex AI client.
     * @throws An error if the `mimeType` is not provided and can not be inferred,
     * the `mimeType` can be provided in the `params.config` parameter.
     * @throws An error occurs if a suitable upload location cannot be established.
     *
     * @example
     * The following code uploads a file to Gemini API.
     *
     * ```ts
     * const file = await ai.files.upload({file: 'file.txt', config: {
     *   mimeType: 'text/plain',
     * }});
     * console.log(file.name);
     * ```
     */
    async upload(params) {
        if (this.apiClient.isVertexAI()) {
            throw new Error('Vertex AI does not support uploading files. You can share files through a GCS bucket.');
        }
        return this.apiClient
            .uploadFile(params.file, params.config)
            .then((resp) => {
            return resp;
        });
    }
    /**
     * Downloads a remotely stored file asynchronously to a location specified in
     * the `params` object. This method only works on Node environment, to
     * download files in the browser, use a browser compliant method like an <a>
     * tag.
     *
     * @param params - The parameters for the download request.
     *
     * @example
     * The following code downloads an example file named "files/mehozpxf877d" as
     * "file.txt".
     *
     * ```ts
     * await ai.files.download({file: file.name, downloadPath: 'file.txt'});
     * ```
     */
    async download(params) {
        await this.apiClient.downloadFile(params);
    }
    /**
     * Registers Google Cloud Storage files for use with the API.
     * This method is only available in Node.js environments.
     */
    async registerFiles(params) {
        throw new Error('registerFiles is only supported in Node.js environments.');
    }
    async _registerFiles(params) {
        return this.registerFilesInternal(params);
    }
    async listInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = listFilesParametersToMldev(params);
            path = formatMap('files', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = listFilesResponseFromMldev(apiResponse);
                const typedResp = new ListFilesResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    async createInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = createFileParametersToMldev(params);
            path = formatMap('upload/v1beta/files', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = createFileResponseFromMldev(apiResponse);
                const typedResp = new CreateFileResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Retrieves the file information from the service.
     *
     * @param params - The parameters for the get request
     * @return The Promise that resolves to the types.File object requested.
     *
     * @example
     * ```ts
     * const config: GetFileParameters = {
     *   name: fileName,
     * };
     * file = await ai.files.get(config);
     * console.log(file.name);
     * ```
     */
    async get(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = getFileParametersToMldev(params);
            path = formatMap('files/{file}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
    }
    /**
     * Deletes a remotely stored file.
     *
     * @param params - The parameters for the delete request.
     * @return The DeleteFileResponse, the response for the delete method.
     *
     * @example
     * The following code deletes an example file named "files/mehozpxf877d".
     *
     * ```ts
     * await ai.files.delete({name: file.name});
     * ```
     */
    async delete(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = deleteFileParametersToMldev(params);
            path = formatMap('files/{file}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'DELETE',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = deleteFileResponseFromMldev(apiResponse);
                const typedResp = new DeleteFileResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    async registerFilesInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = internalRegisterFilesParametersToMldev(params);
            path = formatMap('files:register', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = registerFilesResponseFromMldev(apiResponse);
                const typedResp = new RegisterFilesResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function audioTranscriptionConfigToMldev$1(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['languageCodes']) !== undefined) {
        throw new Error('languageCodes parameter is not supported in Gemini API.');
    }
    return toObject;
}
function authConfigToMldev$2(fromObject) {
    const toObject = {};
    const fromApiKey = getValueByPath(fromObject, ['apiKey']);
    if (fromApiKey != null) {
        setValueByPath(toObject, ['apiKey'], fromApiKey);
    }
    if (getValueByPath(fromObject, ['apiKeyConfig']) !== undefined) {
        throw new Error('apiKeyConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['authType']) !== undefined) {
        throw new Error('authType parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['googleServiceAccountConfig']) !==
        undefined) {
        throw new Error('googleServiceAccountConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['httpBasicAuthConfig']) !== undefined) {
        throw new Error('httpBasicAuthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oauthConfig']) !== undefined) {
        throw new Error('oauthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oidcConfig']) !== undefined) {
        throw new Error('oidcConfig parameter is not supported in Gemini API.');
    }
    return toObject;
}
function blobToMldev$2(fromObject) {
    const toObject = {};
    const fromData = getValueByPath(fromObject, ['data']);
    if (fromData != null) {
        setValueByPath(toObject, ['data'], fromData);
    }
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function contentToMldev$2(fromObject) {
    const toObject = {};
    const fromParts = getValueByPath(fromObject, ['parts']);
    if (fromParts != null) {
        let transformedList = fromParts;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return partToMldev$2(item);
            });
        }
        setValueByPath(toObject, ['parts'], transformedList);
    }
    const fromRole = getValueByPath(fromObject, ['role']);
    if (fromRole != null) {
        setValueByPath(toObject, ['role'], fromRole);
    }
    return toObject;
}
function contentToVertex$1(fromObject) {
    const toObject = {};
    const fromParts = getValueByPath(fromObject, ['parts']);
    if (fromParts != null) {
        let transformedList = fromParts;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return partToVertex$1(item);
            });
        }
        setValueByPath(toObject, ['parts'], transformedList);
    }
    const fromRole = getValueByPath(fromObject, ['role']);
    if (fromRole != null) {
        setValueByPath(toObject, ['role'], fromRole);
    }
    return toObject;
}
function fileDataToMldev$2(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromFileUri = getValueByPath(fromObject, ['fileUri']);
    if (fromFileUri != null) {
        setValueByPath(toObject, ['fileUri'], fromFileUri);
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function functionCallToMldev$2(fromObject) {
    const toObject = {};
    const fromId = getValueByPath(fromObject, ['id']);
    if (fromId != null) {
        setValueByPath(toObject, ['id'], fromId);
    }
    const fromArgs = getValueByPath(fromObject, ['args']);
    if (fromArgs != null) {
        setValueByPath(toObject, ['args'], fromArgs);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    if (getValueByPath(fromObject, ['partialArgs']) !== undefined) {
        throw new Error('partialArgs parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['willContinue']) !== undefined) {
        throw new Error('willContinue parameter is not supported in Gemini API.');
    }
    return toObject;
}
function functionDeclarationToVertex$1(fromObject) {
    const toObject = {};
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (fromDescription != null) {
        setValueByPath(toObject, ['description'], fromDescription);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromParameters = getValueByPath(fromObject, ['parameters']);
    if (fromParameters != null) {
        setValueByPath(toObject, ['parameters'], fromParameters);
    }
    const fromParametersJsonSchema = getValueByPath(fromObject, [
        'parametersJsonSchema',
    ]);
    if (fromParametersJsonSchema != null) {
        setValueByPath(toObject, ['parametersJsonSchema'], fromParametersJsonSchema);
    }
    const fromResponse = getValueByPath(fromObject, ['response']);
    if (fromResponse != null) {
        setValueByPath(toObject, ['response'], fromResponse);
    }
    const fromResponseJsonSchema = getValueByPath(fromObject, [
        'responseJsonSchema',
    ]);
    if (fromResponseJsonSchema != null) {
        setValueByPath(toObject, ['responseJsonSchema'], fromResponseJsonSchema);
    }
    if (getValueByPath(fromObject, ['behavior']) !== undefined) {
        throw new Error('behavior parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function generationConfigToVertex$1(fromObject) {
    const toObject = {};
    const fromModelSelectionConfig = getValueByPath(fromObject, [
        'modelSelectionConfig',
    ]);
    if (fromModelSelectionConfig != null) {
        setValueByPath(toObject, ['modelConfig'], fromModelSelectionConfig);
    }
    const fromResponseJsonSchema = getValueByPath(fromObject, [
        'responseJsonSchema',
    ]);
    if (fromResponseJsonSchema != null) {
        setValueByPath(toObject, ['responseJsonSchema'], fromResponseJsonSchema);
    }
    const fromAudioTimestamp = getValueByPath(fromObject, [
        'audioTimestamp',
    ]);
    if (fromAudioTimestamp != null) {
        setValueByPath(toObject, ['audioTimestamp'], fromAudioTimestamp);
    }
    const fromCandidateCount = getValueByPath(fromObject, [
        'candidateCount',
    ]);
    if (fromCandidateCount != null) {
        setValueByPath(toObject, ['candidateCount'], fromCandidateCount);
    }
    const fromEnableAffectiveDialog = getValueByPath(fromObject, [
        'enableAffectiveDialog',
    ]);
    if (fromEnableAffectiveDialog != null) {
        setValueByPath(toObject, ['enableAffectiveDialog'], fromEnableAffectiveDialog);
    }
    const fromFrequencyPenalty = getValueByPath(fromObject, [
        'frequencyPenalty',
    ]);
    if (fromFrequencyPenalty != null) {
        setValueByPath(toObject, ['frequencyPenalty'], fromFrequencyPenalty);
    }
    const fromLogprobs = getValueByPath(fromObject, ['logprobs']);
    if (fromLogprobs != null) {
        setValueByPath(toObject, ['logprobs'], fromLogprobs);
    }
    const fromMaxOutputTokens = getValueByPath(fromObject, [
        'maxOutputTokens',
    ]);
    if (fromMaxOutputTokens != null) {
        setValueByPath(toObject, ['maxOutputTokens'], fromMaxOutputTokens);
    }
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromPresencePenalty = getValueByPath(fromObject, [
        'presencePenalty',
    ]);
    if (fromPresencePenalty != null) {
        setValueByPath(toObject, ['presencePenalty'], fromPresencePenalty);
    }
    const fromResponseLogprobs = getValueByPath(fromObject, [
        'responseLogprobs',
    ]);
    if (fromResponseLogprobs != null) {
        setValueByPath(toObject, ['responseLogprobs'], fromResponseLogprobs);
    }
    const fromResponseMimeType = getValueByPath(fromObject, [
        'responseMimeType',
    ]);
    if (fromResponseMimeType != null) {
        setValueByPath(toObject, ['responseMimeType'], fromResponseMimeType);
    }
    const fromResponseModalities = getValueByPath(fromObject, [
        'responseModalities',
    ]);
    if (fromResponseModalities != null) {
        setValueByPath(toObject, ['responseModalities'], fromResponseModalities);
    }
    const fromResponseSchema = getValueByPath(fromObject, [
        'responseSchema',
    ]);
    if (fromResponseSchema != null) {
        setValueByPath(toObject, ['responseSchema'], fromResponseSchema);
    }
    const fromRoutingConfig = getValueByPath(fromObject, [
        'routingConfig',
    ]);
    if (fromRoutingConfig != null) {
        setValueByPath(toObject, ['routingConfig'], fromRoutingConfig);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (fromSeed != null) {
        setValueByPath(toObject, ['seed'], fromSeed);
    }
    const fromSpeechConfig = getValueByPath(fromObject, ['speechConfig']);
    if (fromSpeechConfig != null) {
        setValueByPath(toObject, ['speechConfig'], speechConfigToVertex$1(fromSpeechConfig));
    }
    const fromStopSequences = getValueByPath(fromObject, [
        'stopSequences',
    ]);
    if (fromStopSequences != null) {
        setValueByPath(toObject, ['stopSequences'], fromStopSequences);
    }
    const fromTemperature = getValueByPath(fromObject, ['temperature']);
    if (fromTemperature != null) {
        setValueByPath(toObject, ['temperature'], fromTemperature);
    }
    const fromThinkingConfig = getValueByPath(fromObject, [
        'thinkingConfig',
    ]);
    if (fromThinkingConfig != null) {
        setValueByPath(toObject, ['thinkingConfig'], fromThinkingConfig);
    }
    const fromTopK = getValueByPath(fromObject, ['topK']);
    if (fromTopK != null) {
        setValueByPath(toObject, ['topK'], fromTopK);
    }
    const fromTopP = getValueByPath(fromObject, ['topP']);
    if (fromTopP != null) {
        setValueByPath(toObject, ['topP'], fromTopP);
    }
    if (getValueByPath(fromObject, ['enableEnhancedCivicAnswers']) !==
        undefined) {
        throw new Error('enableEnhancedCivicAnswers parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function googleMapsToMldev$2(fromObject) {
    const toObject = {};
    const fromAuthConfig = getValueByPath(fromObject, ['authConfig']);
    if (fromAuthConfig != null) {
        setValueByPath(toObject, ['authConfig'], authConfigToMldev$2(fromAuthConfig));
    }
    const fromEnableWidget = getValueByPath(fromObject, ['enableWidget']);
    if (fromEnableWidget != null) {
        setValueByPath(toObject, ['enableWidget'], fromEnableWidget);
    }
    return toObject;
}
function googleSearchToMldev$2(fromObject) {
    const toObject = {};
    const fromSearchTypes = getValueByPath(fromObject, ['searchTypes']);
    if (fromSearchTypes != null) {
        setValueByPath(toObject, ['searchTypes'], fromSearchTypes);
    }
    if (getValueByPath(fromObject, ['blockingConfidence']) !== undefined) {
        throw new Error('blockingConfidence parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['excludeDomains']) !== undefined) {
        throw new Error('excludeDomains parameter is not supported in Gemini API.');
    }
    const fromTimeRangeFilter = getValueByPath(fromObject, [
        'timeRangeFilter',
    ]);
    if (fromTimeRangeFilter != null) {
        setValueByPath(toObject, ['timeRangeFilter'], fromTimeRangeFilter);
    }
    return toObject;
}
function liveConnectConfigToMldev$1(fromObject, parentObject) {
    const toObject = {};
    const fromGenerationConfig = getValueByPath(fromObject, [
        'generationConfig',
    ]);
    if (parentObject !== undefined && fromGenerationConfig != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig'], fromGenerationConfig);
    }
    const fromResponseModalities = getValueByPath(fromObject, [
        'responseModalities',
    ]);
    if (parentObject !== undefined && fromResponseModalities != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'responseModalities'], fromResponseModalities);
    }
    const fromTemperature = getValueByPath(fromObject, ['temperature']);
    if (parentObject !== undefined && fromTemperature != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'temperature'], fromTemperature);
    }
    const fromTopP = getValueByPath(fromObject, ['topP']);
    if (parentObject !== undefined && fromTopP != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'topP'], fromTopP);
    }
    const fromTopK = getValueByPath(fromObject, ['topK']);
    if (parentObject !== undefined && fromTopK != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'topK'], fromTopK);
    }
    const fromMaxOutputTokens = getValueByPath(fromObject, [
        'maxOutputTokens',
    ]);
    if (parentObject !== undefined && fromMaxOutputTokens != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'maxOutputTokens'], fromMaxOutputTokens);
    }
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (parentObject !== undefined && fromMediaResolution != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'mediaResolution'], fromMediaResolution);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (parentObject !== undefined && fromSeed != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'seed'], fromSeed);
    }
    const fromSpeechConfig = getValueByPath(fromObject, ['speechConfig']);
    if (parentObject !== undefined && fromSpeechConfig != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'speechConfig'], tLiveSpeechConfig(fromSpeechConfig));
    }
    const fromThinkingConfig = getValueByPath(fromObject, [
        'thinkingConfig',
    ]);
    if (parentObject !== undefined && fromThinkingConfig != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'thinkingConfig'], fromThinkingConfig);
    }
    const fromEnableAffectiveDialog = getValueByPath(fromObject, [
        'enableAffectiveDialog',
    ]);
    if (parentObject !== undefined && fromEnableAffectiveDialog != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'enableAffectiveDialog'], fromEnableAffectiveDialog);
    }
    const fromSystemInstruction = getValueByPath(fromObject, [
        'systemInstruction',
    ]);
    if (parentObject !== undefined && fromSystemInstruction != null) {
        setValueByPath(parentObject, ['setup', 'systemInstruction'], contentToMldev$2(tContent(fromSystemInstruction)));
    }
    const fromTools = getValueByPath(fromObject, ['tools']);
    if (parentObject !== undefined && fromTools != null) {
        let transformedList = tTools(fromTools);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return toolToMldev$2(tTool(item));
            });
        }
        setValueByPath(parentObject, ['setup', 'tools'], transformedList);
    }
    const fromSessionResumption = getValueByPath(fromObject, [
        'sessionResumption',
    ]);
    if (parentObject !== undefined && fromSessionResumption != null) {
        setValueByPath(parentObject, ['setup', 'sessionResumption'], sessionResumptionConfigToMldev$1(fromSessionResumption));
    }
    const fromInputAudioTranscription = getValueByPath(fromObject, [
        'inputAudioTranscription',
    ]);
    if (parentObject !== undefined && fromInputAudioTranscription != null) {
        setValueByPath(parentObject, ['setup', 'inputAudioTranscription'], audioTranscriptionConfigToMldev$1(fromInputAudioTranscription));
    }
    const fromOutputAudioTranscription = getValueByPath(fromObject, [
        'outputAudioTranscription',
    ]);
    if (parentObject !== undefined && fromOutputAudioTranscription != null) {
        setValueByPath(parentObject, ['setup', 'outputAudioTranscription'], audioTranscriptionConfigToMldev$1(fromOutputAudioTranscription));
    }
    const fromRealtimeInputConfig = getValueByPath(fromObject, [
        'realtimeInputConfig',
    ]);
    if (parentObject !== undefined && fromRealtimeInputConfig != null) {
        setValueByPath(parentObject, ['setup', 'realtimeInputConfig'], fromRealtimeInputConfig);
    }
    const fromContextWindowCompression = getValueByPath(fromObject, [
        'contextWindowCompression',
    ]);
    if (parentObject !== undefined && fromContextWindowCompression != null) {
        setValueByPath(parentObject, ['setup', 'contextWindowCompression'], fromContextWindowCompression);
    }
    const fromProactivity = getValueByPath(fromObject, ['proactivity']);
    if (parentObject !== undefined && fromProactivity != null) {
        setValueByPath(parentObject, ['setup', 'proactivity'], fromProactivity);
    }
    if (getValueByPath(fromObject, ['explicitVadSignal']) !== undefined) {
        throw new Error('explicitVadSignal parameter is not supported in Gemini API.');
    }
    return toObject;
}
function liveConnectConfigToVertex(fromObject, parentObject) {
    const toObject = {};
    const fromGenerationConfig = getValueByPath(fromObject, [
        'generationConfig',
    ]);
    if (parentObject !== undefined && fromGenerationConfig != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig'], generationConfigToVertex$1(fromGenerationConfig));
    }
    const fromResponseModalities = getValueByPath(fromObject, [
        'responseModalities',
    ]);
    if (parentObject !== undefined && fromResponseModalities != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'responseModalities'], fromResponseModalities);
    }
    const fromTemperature = getValueByPath(fromObject, ['temperature']);
    if (parentObject !== undefined && fromTemperature != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'temperature'], fromTemperature);
    }
    const fromTopP = getValueByPath(fromObject, ['topP']);
    if (parentObject !== undefined && fromTopP != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'topP'], fromTopP);
    }
    const fromTopK = getValueByPath(fromObject, ['topK']);
    if (parentObject !== undefined && fromTopK != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'topK'], fromTopK);
    }
    const fromMaxOutputTokens = getValueByPath(fromObject, [
        'maxOutputTokens',
    ]);
    if (parentObject !== undefined && fromMaxOutputTokens != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'maxOutputTokens'], fromMaxOutputTokens);
    }
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (parentObject !== undefined && fromMediaResolution != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'mediaResolution'], fromMediaResolution);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (parentObject !== undefined && fromSeed != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'seed'], fromSeed);
    }
    const fromSpeechConfig = getValueByPath(fromObject, ['speechConfig']);
    if (parentObject !== undefined && fromSpeechConfig != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'speechConfig'], speechConfigToVertex$1(tLiveSpeechConfig(fromSpeechConfig)));
    }
    const fromThinkingConfig = getValueByPath(fromObject, [
        'thinkingConfig',
    ]);
    if (parentObject !== undefined && fromThinkingConfig != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'thinkingConfig'], fromThinkingConfig);
    }
    const fromEnableAffectiveDialog = getValueByPath(fromObject, [
        'enableAffectiveDialog',
    ]);
    if (parentObject !== undefined && fromEnableAffectiveDialog != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'enableAffectiveDialog'], fromEnableAffectiveDialog);
    }
    const fromSystemInstruction = getValueByPath(fromObject, [
        'systemInstruction',
    ]);
    if (parentObject !== undefined && fromSystemInstruction != null) {
        setValueByPath(parentObject, ['setup', 'systemInstruction'], contentToVertex$1(tContent(fromSystemInstruction)));
    }
    const fromTools = getValueByPath(fromObject, ['tools']);
    if (parentObject !== undefined && fromTools != null) {
        let transformedList = tTools(fromTools);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return toolToVertex$1(tTool(item));
            });
        }
        setValueByPath(parentObject, ['setup', 'tools'], transformedList);
    }
    const fromSessionResumption = getValueByPath(fromObject, [
        'sessionResumption',
    ]);
    if (parentObject !== undefined && fromSessionResumption != null) {
        setValueByPath(parentObject, ['setup', 'sessionResumption'], fromSessionResumption);
    }
    const fromInputAudioTranscription = getValueByPath(fromObject, [
        'inputAudioTranscription',
    ]);
    if (parentObject !== undefined && fromInputAudioTranscription != null) {
        setValueByPath(parentObject, ['setup', 'inputAudioTranscription'], fromInputAudioTranscription);
    }
    const fromOutputAudioTranscription = getValueByPath(fromObject, [
        'outputAudioTranscription',
    ]);
    if (parentObject !== undefined && fromOutputAudioTranscription != null) {
        setValueByPath(parentObject, ['setup', 'outputAudioTranscription'], fromOutputAudioTranscription);
    }
    const fromRealtimeInputConfig = getValueByPath(fromObject, [
        'realtimeInputConfig',
    ]);
    if (parentObject !== undefined && fromRealtimeInputConfig != null) {
        setValueByPath(parentObject, ['setup', 'realtimeInputConfig'], fromRealtimeInputConfig);
    }
    const fromContextWindowCompression = getValueByPath(fromObject, [
        'contextWindowCompression',
    ]);
    if (parentObject !== undefined && fromContextWindowCompression != null) {
        setValueByPath(parentObject, ['setup', 'contextWindowCompression'], fromContextWindowCompression);
    }
    const fromProactivity = getValueByPath(fromObject, ['proactivity']);
    if (parentObject !== undefined && fromProactivity != null) {
        setValueByPath(parentObject, ['setup', 'proactivity'], fromProactivity);
    }
    const fromExplicitVadSignal = getValueByPath(fromObject, [
        'explicitVadSignal',
    ]);
    if (parentObject !== undefined && fromExplicitVadSignal != null) {
        setValueByPath(parentObject, ['setup', 'explicitVadSignal'], fromExplicitVadSignal);
    }
    return toObject;
}
function liveConnectParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['setup', 'model'], tModel(apiClient, fromModel));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        setValueByPath(toObject, ['config'], liveConnectConfigToMldev$1(fromConfig, toObject));
    }
    return toObject;
}
function liveConnectParametersToVertex(apiClient, fromObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['setup', 'model'], tModel(apiClient, fromModel));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        setValueByPath(toObject, ['config'], liveConnectConfigToVertex(fromConfig, toObject));
    }
    return toObject;
}
function liveMusicSetConfigParametersToMldev(fromObject) {
    const toObject = {};
    const fromMusicGenerationConfig = getValueByPath(fromObject, [
        'musicGenerationConfig',
    ]);
    if (fromMusicGenerationConfig != null) {
        setValueByPath(toObject, ['musicGenerationConfig'], fromMusicGenerationConfig);
    }
    return toObject;
}
function liveMusicSetWeightedPromptsParametersToMldev(fromObject) {
    const toObject = {};
    const fromWeightedPrompts = getValueByPath(fromObject, [
        'weightedPrompts',
    ]);
    if (fromWeightedPrompts != null) {
        let transformedList = fromWeightedPrompts;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['weightedPrompts'], transformedList);
    }
    return toObject;
}
function liveSendRealtimeInputParametersToMldev(fromObject) {
    const toObject = {};
    const fromMedia = getValueByPath(fromObject, ['media']);
    if (fromMedia != null) {
        let transformedList = tBlobs(fromMedia);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return blobToMldev$2(item);
            });
        }
        setValueByPath(toObject, ['mediaChunks'], transformedList);
    }
    const fromAudio = getValueByPath(fromObject, ['audio']);
    if (fromAudio != null) {
        setValueByPath(toObject, ['audio'], blobToMldev$2(tAudioBlob(fromAudio)));
    }
    const fromAudioStreamEnd = getValueByPath(fromObject, [
        'audioStreamEnd',
    ]);
    if (fromAudioStreamEnd != null) {
        setValueByPath(toObject, ['audioStreamEnd'], fromAudioStreamEnd);
    }
    const fromVideo = getValueByPath(fromObject, ['video']);
    if (fromVideo != null) {
        setValueByPath(toObject, ['video'], blobToMldev$2(tImageBlob(fromVideo)));
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromActivityStart = getValueByPath(fromObject, [
        'activityStart',
    ]);
    if (fromActivityStart != null) {
        setValueByPath(toObject, ['activityStart'], fromActivityStart);
    }
    const fromActivityEnd = getValueByPath(fromObject, ['activityEnd']);
    if (fromActivityEnd != null) {
        setValueByPath(toObject, ['activityEnd'], fromActivityEnd);
    }
    return toObject;
}
function liveSendRealtimeInputParametersToVertex(fromObject) {
    const toObject = {};
    const fromMedia = getValueByPath(fromObject, ['media']);
    if (fromMedia != null) {
        let transformedList = tBlobs(fromMedia);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['mediaChunks'], transformedList);
    }
    const fromAudio = getValueByPath(fromObject, ['audio']);
    if (fromAudio != null) {
        setValueByPath(toObject, ['audio'], tAudioBlob(fromAudio));
    }
    const fromAudioStreamEnd = getValueByPath(fromObject, [
        'audioStreamEnd',
    ]);
    if (fromAudioStreamEnd != null) {
        setValueByPath(toObject, ['audioStreamEnd'], fromAudioStreamEnd);
    }
    const fromVideo = getValueByPath(fromObject, ['video']);
    if (fromVideo != null) {
        setValueByPath(toObject, ['video'], tImageBlob(fromVideo));
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromActivityStart = getValueByPath(fromObject, [
        'activityStart',
    ]);
    if (fromActivityStart != null) {
        setValueByPath(toObject, ['activityStart'], fromActivityStart);
    }
    const fromActivityEnd = getValueByPath(fromObject, ['activityEnd']);
    if (fromActivityEnd != null) {
        setValueByPath(toObject, ['activityEnd'], fromActivityEnd);
    }
    return toObject;
}
function liveServerMessageFromVertex(fromObject) {
    const toObject = {};
    const fromSetupComplete = getValueByPath(fromObject, [
        'setupComplete',
    ]);
    if (fromSetupComplete != null) {
        setValueByPath(toObject, ['setupComplete'], fromSetupComplete);
    }
    const fromServerContent = getValueByPath(fromObject, [
        'serverContent',
    ]);
    if (fromServerContent != null) {
        setValueByPath(toObject, ['serverContent'], fromServerContent);
    }
    const fromToolCall = getValueByPath(fromObject, ['toolCall']);
    if (fromToolCall != null) {
        setValueByPath(toObject, ['toolCall'], fromToolCall);
    }
    const fromToolCallCancellation = getValueByPath(fromObject, [
        'toolCallCancellation',
    ]);
    if (fromToolCallCancellation != null) {
        setValueByPath(toObject, ['toolCallCancellation'], fromToolCallCancellation);
    }
    const fromUsageMetadata = getValueByPath(fromObject, [
        'usageMetadata',
    ]);
    if (fromUsageMetadata != null) {
        setValueByPath(toObject, ['usageMetadata'], usageMetadataFromVertex(fromUsageMetadata));
    }
    const fromGoAway = getValueByPath(fromObject, ['goAway']);
    if (fromGoAway != null) {
        setValueByPath(toObject, ['goAway'], fromGoAway);
    }
    const fromSessionResumptionUpdate = getValueByPath(fromObject, [
        'sessionResumptionUpdate',
    ]);
    if (fromSessionResumptionUpdate != null) {
        setValueByPath(toObject, ['sessionResumptionUpdate'], fromSessionResumptionUpdate);
    }
    const fromVoiceActivityDetectionSignal = getValueByPath(fromObject, [
        'voiceActivityDetectionSignal',
    ]);
    if (fromVoiceActivityDetectionSignal != null) {
        setValueByPath(toObject, ['voiceActivityDetectionSignal'], fromVoiceActivityDetectionSignal);
    }
    const fromVoiceActivity = getValueByPath(fromObject, [
        'voiceActivity',
    ]);
    if (fromVoiceActivity != null) {
        setValueByPath(toObject, ['voiceActivity'], voiceActivityFromVertex(fromVoiceActivity));
    }
    return toObject;
}
function multiSpeakerVoiceConfigToVertex$1(fromObject) {
    const toObject = {};
    const fromSpeakerVoiceConfigs = getValueByPath(fromObject, [
        'speakerVoiceConfigs',
    ]);
    if (fromSpeakerVoiceConfigs != null) {
        let transformedList = fromSpeakerVoiceConfigs;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return speakerVoiceConfigToVertex$1(item);
            });
        }
        setValueByPath(toObject, ['speakerVoiceConfigs'], transformedList);
    }
    return toObject;
}
function partToMldev$2(fromObject) {
    const toObject = {};
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromCodeExecutionResult = getValueByPath(fromObject, [
        'codeExecutionResult',
    ]);
    if (fromCodeExecutionResult != null) {
        setValueByPath(toObject, ['codeExecutionResult'], fromCodeExecutionResult);
    }
    const fromExecutableCode = getValueByPath(fromObject, [
        'executableCode',
    ]);
    if (fromExecutableCode != null) {
        setValueByPath(toObject, ['executableCode'], fromExecutableCode);
    }
    const fromFileData = getValueByPath(fromObject, ['fileData']);
    if (fromFileData != null) {
        setValueByPath(toObject, ['fileData'], fileDataToMldev$2(fromFileData));
    }
    const fromFunctionCall = getValueByPath(fromObject, ['functionCall']);
    if (fromFunctionCall != null) {
        setValueByPath(toObject, ['functionCall'], functionCallToMldev$2(fromFunctionCall));
    }
    const fromFunctionResponse = getValueByPath(fromObject, [
        'functionResponse',
    ]);
    if (fromFunctionResponse != null) {
        setValueByPath(toObject, ['functionResponse'], fromFunctionResponse);
    }
    const fromInlineData = getValueByPath(fromObject, ['inlineData']);
    if (fromInlineData != null) {
        setValueByPath(toObject, ['inlineData'], blobToMldev$2(fromInlineData));
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromThought = getValueByPath(fromObject, ['thought']);
    if (fromThought != null) {
        setValueByPath(toObject, ['thought'], fromThought);
    }
    const fromThoughtSignature = getValueByPath(fromObject, [
        'thoughtSignature',
    ]);
    if (fromThoughtSignature != null) {
        setValueByPath(toObject, ['thoughtSignature'], fromThoughtSignature);
    }
    const fromVideoMetadata = getValueByPath(fromObject, [
        'videoMetadata',
    ]);
    if (fromVideoMetadata != null) {
        setValueByPath(toObject, ['videoMetadata'], fromVideoMetadata);
    }
    const fromToolCall = getValueByPath(fromObject, ['toolCall']);
    if (fromToolCall != null) {
        setValueByPath(toObject, ['toolCall'], fromToolCall);
    }
    const fromToolResponse = getValueByPath(fromObject, ['toolResponse']);
    if (fromToolResponse != null) {
        setValueByPath(toObject, ['toolResponse'], fromToolResponse);
    }
    const fromPartMetadata = getValueByPath(fromObject, ['partMetadata']);
    if (fromPartMetadata != null) {
        setValueByPath(toObject, ['partMetadata'], fromPartMetadata);
    }
    return toObject;
}
function partToVertex$1(fromObject) {
    const toObject = {};
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromCodeExecutionResult = getValueByPath(fromObject, [
        'codeExecutionResult',
    ]);
    if (fromCodeExecutionResult != null) {
        setValueByPath(toObject, ['codeExecutionResult'], fromCodeExecutionResult);
    }
    const fromExecutableCode = getValueByPath(fromObject, [
        'executableCode',
    ]);
    if (fromExecutableCode != null) {
        setValueByPath(toObject, ['executableCode'], fromExecutableCode);
    }
    const fromFileData = getValueByPath(fromObject, ['fileData']);
    if (fromFileData != null) {
        setValueByPath(toObject, ['fileData'], fromFileData);
    }
    const fromFunctionCall = getValueByPath(fromObject, ['functionCall']);
    if (fromFunctionCall != null) {
        setValueByPath(toObject, ['functionCall'], fromFunctionCall);
    }
    const fromFunctionResponse = getValueByPath(fromObject, [
        'functionResponse',
    ]);
    if (fromFunctionResponse != null) {
        setValueByPath(toObject, ['functionResponse'], fromFunctionResponse);
    }
    const fromInlineData = getValueByPath(fromObject, ['inlineData']);
    if (fromInlineData != null) {
        setValueByPath(toObject, ['inlineData'], fromInlineData);
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromThought = getValueByPath(fromObject, ['thought']);
    if (fromThought != null) {
        setValueByPath(toObject, ['thought'], fromThought);
    }
    const fromThoughtSignature = getValueByPath(fromObject, [
        'thoughtSignature',
    ]);
    if (fromThoughtSignature != null) {
        setValueByPath(toObject, ['thoughtSignature'], fromThoughtSignature);
    }
    const fromVideoMetadata = getValueByPath(fromObject, [
        'videoMetadata',
    ]);
    if (fromVideoMetadata != null) {
        setValueByPath(toObject, ['videoMetadata'], fromVideoMetadata);
    }
    if (getValueByPath(fromObject, ['toolCall']) !== undefined) {
        throw new Error('toolCall parameter is not supported in Vertex AI.');
    }
    if (getValueByPath(fromObject, ['toolResponse']) !== undefined) {
        throw new Error('toolResponse parameter is not supported in Vertex AI.');
    }
    if (getValueByPath(fromObject, ['partMetadata']) !== undefined) {
        throw new Error('partMetadata parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function replicatedVoiceConfigToVertex$1(fromObject) {
    const toObject = {};
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    const fromVoiceSampleAudio = getValueByPath(fromObject, [
        'voiceSampleAudio',
    ]);
    if (fromVoiceSampleAudio != null) {
        setValueByPath(toObject, ['voiceSampleAudio'], fromVoiceSampleAudio);
    }
    return toObject;
}
function sessionResumptionConfigToMldev$1(fromObject) {
    const toObject = {};
    const fromHandle = getValueByPath(fromObject, ['handle']);
    if (fromHandle != null) {
        setValueByPath(toObject, ['handle'], fromHandle);
    }
    if (getValueByPath(fromObject, ['transparent']) !== undefined) {
        throw new Error('transparent parameter is not supported in Gemini API.');
    }
    return toObject;
}
function speakerVoiceConfigToVertex$1(fromObject) {
    const toObject = {};
    const fromSpeaker = getValueByPath(fromObject, ['speaker']);
    if (fromSpeaker != null) {
        setValueByPath(toObject, ['speaker'], fromSpeaker);
    }
    const fromVoiceConfig = getValueByPath(fromObject, ['voiceConfig']);
    if (fromVoiceConfig != null) {
        setValueByPath(toObject, ['voiceConfig'], voiceConfigToVertex$1(fromVoiceConfig));
    }
    return toObject;
}
function speechConfigToVertex$1(fromObject) {
    const toObject = {};
    const fromVoiceConfig = getValueByPath(fromObject, ['voiceConfig']);
    if (fromVoiceConfig != null) {
        setValueByPath(toObject, ['voiceConfig'], voiceConfigToVertex$1(fromVoiceConfig));
    }
    const fromLanguageCode = getValueByPath(fromObject, ['languageCode']);
    if (fromLanguageCode != null) {
        setValueByPath(toObject, ['languageCode'], fromLanguageCode);
    }
    const fromMultiSpeakerVoiceConfig = getValueByPath(fromObject, [
        'multiSpeakerVoiceConfig',
    ]);
    if (fromMultiSpeakerVoiceConfig != null) {
        setValueByPath(toObject, ['multiSpeakerVoiceConfig'], multiSpeakerVoiceConfigToVertex$1(fromMultiSpeakerVoiceConfig));
    }
    return toObject;
}
function toolToMldev$2(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['retrieval']) !== undefined) {
        throw new Error('retrieval parameter is not supported in Gemini API.');
    }
    const fromComputerUse = getValueByPath(fromObject, ['computerUse']);
    if (fromComputerUse != null) {
        setValueByPath(toObject, ['computerUse'], fromComputerUse);
    }
    const fromFileSearch = getValueByPath(fromObject, ['fileSearch']);
    if (fromFileSearch != null) {
        setValueByPath(toObject, ['fileSearch'], fromFileSearch);
    }
    const fromGoogleSearch = getValueByPath(fromObject, ['googleSearch']);
    if (fromGoogleSearch != null) {
        setValueByPath(toObject, ['googleSearch'], googleSearchToMldev$2(fromGoogleSearch));
    }
    const fromGoogleMaps = getValueByPath(fromObject, ['googleMaps']);
    if (fromGoogleMaps != null) {
        setValueByPath(toObject, ['googleMaps'], googleMapsToMldev$2(fromGoogleMaps));
    }
    const fromCodeExecution = getValueByPath(fromObject, [
        'codeExecution',
    ]);
    if (fromCodeExecution != null) {
        setValueByPath(toObject, ['codeExecution'], fromCodeExecution);
    }
    if (getValueByPath(fromObject, ['enterpriseWebSearch']) !== undefined) {
        throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
    }
    const fromFunctionDeclarations = getValueByPath(fromObject, [
        'functionDeclarations',
    ]);
    if (fromFunctionDeclarations != null) {
        let transformedList = fromFunctionDeclarations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['functionDeclarations'], transformedList);
    }
    const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
        'googleSearchRetrieval',
    ]);
    if (fromGoogleSearchRetrieval != null) {
        setValueByPath(toObject, ['googleSearchRetrieval'], fromGoogleSearchRetrieval);
    }
    if (getValueByPath(fromObject, ['parallelAiSearch']) !== undefined) {
        throw new Error('parallelAiSearch parameter is not supported in Gemini API.');
    }
    const fromUrlContext = getValueByPath(fromObject, ['urlContext']);
    if (fromUrlContext != null) {
        setValueByPath(toObject, ['urlContext'], fromUrlContext);
    }
    const fromMcpServers = getValueByPath(fromObject, ['mcpServers']);
    if (fromMcpServers != null) {
        let transformedList = fromMcpServers;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['mcpServers'], transformedList);
    }
    return toObject;
}
function toolToVertex$1(fromObject) {
    const toObject = {};
    const fromRetrieval = getValueByPath(fromObject, ['retrieval']);
    if (fromRetrieval != null) {
        setValueByPath(toObject, ['retrieval'], fromRetrieval);
    }
    const fromComputerUse = getValueByPath(fromObject, ['computerUse']);
    if (fromComputerUse != null) {
        setValueByPath(toObject, ['computerUse'], fromComputerUse);
    }
    if (getValueByPath(fromObject, ['fileSearch']) !== undefined) {
        throw new Error('fileSearch parameter is not supported in Vertex AI.');
    }
    const fromGoogleSearch = getValueByPath(fromObject, ['googleSearch']);
    if (fromGoogleSearch != null) {
        setValueByPath(toObject, ['googleSearch'], fromGoogleSearch);
    }
    const fromGoogleMaps = getValueByPath(fromObject, ['googleMaps']);
    if (fromGoogleMaps != null) {
        setValueByPath(toObject, ['googleMaps'], fromGoogleMaps);
    }
    const fromCodeExecution = getValueByPath(fromObject, [
        'codeExecution',
    ]);
    if (fromCodeExecution != null) {
        setValueByPath(toObject, ['codeExecution'], fromCodeExecution);
    }
    const fromEnterpriseWebSearch = getValueByPath(fromObject, [
        'enterpriseWebSearch',
    ]);
    if (fromEnterpriseWebSearch != null) {
        setValueByPath(toObject, ['enterpriseWebSearch'], fromEnterpriseWebSearch);
    }
    const fromFunctionDeclarations = getValueByPath(fromObject, [
        'functionDeclarations',
    ]);
    if (fromFunctionDeclarations != null) {
        let transformedList = fromFunctionDeclarations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return functionDeclarationToVertex$1(item);
            });
        }
        setValueByPath(toObject, ['functionDeclarations'], transformedList);
    }
    const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
        'googleSearchRetrieval',
    ]);
    if (fromGoogleSearchRetrieval != null) {
        setValueByPath(toObject, ['googleSearchRetrieval'], fromGoogleSearchRetrieval);
    }
    const fromParallelAiSearch = getValueByPath(fromObject, [
        'parallelAiSearch',
    ]);
    if (fromParallelAiSearch != null) {
        setValueByPath(toObject, ['parallelAiSearch'], fromParallelAiSearch);
    }
    const fromUrlContext = getValueByPath(fromObject, ['urlContext']);
    if (fromUrlContext != null) {
        setValueByPath(toObject, ['urlContext'], fromUrlContext);
    }
    if (getValueByPath(fromObject, ['mcpServers']) !== undefined) {
        throw new Error('mcpServers parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function usageMetadataFromVertex(fromObject) {
    const toObject = {};
    const fromPromptTokenCount = getValueByPath(fromObject, [
        'promptTokenCount',
    ]);
    if (fromPromptTokenCount != null) {
        setValueByPath(toObject, ['promptTokenCount'], fromPromptTokenCount);
    }
    const fromCachedContentTokenCount = getValueByPath(fromObject, [
        'cachedContentTokenCount',
    ]);
    if (fromCachedContentTokenCount != null) {
        setValueByPath(toObject, ['cachedContentTokenCount'], fromCachedContentTokenCount);
    }
    const fromResponseTokenCount = getValueByPath(fromObject, [
        'candidatesTokenCount',
    ]);
    if (fromResponseTokenCount != null) {
        setValueByPath(toObject, ['responseTokenCount'], fromResponseTokenCount);
    }
    const fromToolUsePromptTokenCount = getValueByPath(fromObject, [
        'toolUsePromptTokenCount',
    ]);
    if (fromToolUsePromptTokenCount != null) {
        setValueByPath(toObject, ['toolUsePromptTokenCount'], fromToolUsePromptTokenCount);
    }
    const fromThoughtsTokenCount = getValueByPath(fromObject, [
        'thoughtsTokenCount',
    ]);
    if (fromThoughtsTokenCount != null) {
        setValueByPath(toObject, ['thoughtsTokenCount'], fromThoughtsTokenCount);
    }
    const fromTotalTokenCount = getValueByPath(fromObject, [
        'totalTokenCount',
    ]);
    if (fromTotalTokenCount != null) {
        setValueByPath(toObject, ['totalTokenCount'], fromTotalTokenCount);
    }
    const fromPromptTokensDetails = getValueByPath(fromObject, [
        'promptTokensDetails',
    ]);
    if (fromPromptTokensDetails != null) {
        let transformedList = fromPromptTokensDetails;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['promptTokensDetails'], transformedList);
    }
    const fromCacheTokensDetails = getValueByPath(fromObject, [
        'cacheTokensDetails',
    ]);
    if (fromCacheTokensDetails != null) {
        let transformedList = fromCacheTokensDetails;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['cacheTokensDetails'], transformedList);
    }
    const fromResponseTokensDetails = getValueByPath(fromObject, [
        'candidatesTokensDetails',
    ]);
    if (fromResponseTokensDetails != null) {
        let transformedList = fromResponseTokensDetails;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['responseTokensDetails'], transformedList);
    }
    const fromToolUsePromptTokensDetails = getValueByPath(fromObject, [
        'toolUsePromptTokensDetails',
    ]);
    if (fromToolUsePromptTokensDetails != null) {
        let transformedList = fromToolUsePromptTokensDetails;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['toolUsePromptTokensDetails'], transformedList);
    }
    const fromTrafficType = getValueByPath(fromObject, ['trafficType']);
    if (fromTrafficType != null) {
        setValueByPath(toObject, ['trafficType'], fromTrafficType);
    }
    return toObject;
}
function voiceActivityFromVertex(fromObject) {
    const toObject = {};
    const fromVoiceActivityType = getValueByPath(fromObject, ['type']);
    if (fromVoiceActivityType != null) {
        setValueByPath(toObject, ['voiceActivityType'], fromVoiceActivityType);
    }
    return toObject;
}
function voiceConfigToVertex$1(fromObject) {
    const toObject = {};
    const fromReplicatedVoiceConfig = getValueByPath(fromObject, [
        'replicatedVoiceConfig',
    ]);
    if (fromReplicatedVoiceConfig != null) {
        setValueByPath(toObject, ['replicatedVoiceConfig'], replicatedVoiceConfigToVertex$1(fromReplicatedVoiceConfig));
    }
    const fromPrebuiltVoiceConfig = getValueByPath(fromObject, [
        'prebuiltVoiceConfig',
    ]);
    if (fromPrebuiltVoiceConfig != null) {
        setValueByPath(toObject, ['prebuiltVoiceConfig'], fromPrebuiltVoiceConfig);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function authConfigToMldev$1(fromObject, _rootObject) {
    const toObject = {};
    const fromApiKey = getValueByPath(fromObject, ['apiKey']);
    if (fromApiKey != null) {
        setValueByPath(toObject, ['apiKey'], fromApiKey);
    }
    if (getValueByPath(fromObject, ['apiKeyConfig']) !== undefined) {
        throw new Error('apiKeyConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['authType']) !== undefined) {
        throw new Error('authType parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['googleServiceAccountConfig']) !==
        undefined) {
        throw new Error('googleServiceAccountConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['httpBasicAuthConfig']) !== undefined) {
        throw new Error('httpBasicAuthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oauthConfig']) !== undefined) {
        throw new Error('oauthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oidcConfig']) !== undefined) {
        throw new Error('oidcConfig parameter is not supported in Gemini API.');
    }
    return toObject;
}
function blobToMldev$1(fromObject, _rootObject) {
    const toObject = {};
    const fromData = getValueByPath(fromObject, ['data']);
    if (fromData != null) {
        setValueByPath(toObject, ['data'], fromData);
    }
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function candidateFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromContent = getValueByPath(fromObject, ['content']);
    if (fromContent != null) {
        setValueByPath(toObject, ['content'], fromContent);
    }
    const fromCitationMetadata = getValueByPath(fromObject, [
        'citationMetadata',
    ]);
    if (fromCitationMetadata != null) {
        setValueByPath(toObject, ['citationMetadata'], citationMetadataFromMldev(fromCitationMetadata));
    }
    const fromTokenCount = getValueByPath(fromObject, ['tokenCount']);
    if (fromTokenCount != null) {
        setValueByPath(toObject, ['tokenCount'], fromTokenCount);
    }
    const fromFinishReason = getValueByPath(fromObject, ['finishReason']);
    if (fromFinishReason != null) {
        setValueByPath(toObject, ['finishReason'], fromFinishReason);
    }
    const fromGroundingMetadata = getValueByPath(fromObject, [
        'groundingMetadata',
    ]);
    if (fromGroundingMetadata != null) {
        setValueByPath(toObject, ['groundingMetadata'], fromGroundingMetadata);
    }
    const fromAvgLogprobs = getValueByPath(fromObject, ['avgLogprobs']);
    if (fromAvgLogprobs != null) {
        setValueByPath(toObject, ['avgLogprobs'], fromAvgLogprobs);
    }
    const fromIndex = getValueByPath(fromObject, ['index']);
    if (fromIndex != null) {
        setValueByPath(toObject, ['index'], fromIndex);
    }
    const fromLogprobsResult = getValueByPath(fromObject, [
        'logprobsResult',
    ]);
    if (fromLogprobsResult != null) {
        setValueByPath(toObject, ['logprobsResult'], fromLogprobsResult);
    }
    const fromSafetyRatings = getValueByPath(fromObject, [
        'safetyRatings',
    ]);
    if (fromSafetyRatings != null) {
        let transformedList = fromSafetyRatings;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['safetyRatings'], transformedList);
    }
    const fromUrlContextMetadata = getValueByPath(fromObject, [
        'urlContextMetadata',
    ]);
    if (fromUrlContextMetadata != null) {
        setValueByPath(toObject, ['urlContextMetadata'], fromUrlContextMetadata);
    }
    return toObject;
}
function citationMetadataFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromCitations = getValueByPath(fromObject, ['citationSources']);
    if (fromCitations != null) {
        let transformedList = fromCitations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['citations'], transformedList);
    }
    return toObject;
}
function computeTokensParametersToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (fromContents != null) {
        let transformedList = tContents(fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return contentToVertex(item);
            });
        }
        setValueByPath(toObject, ['contents'], transformedList);
    }
    return toObject;
}
function computeTokensResponseFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromTokensInfo = getValueByPath(fromObject, ['tokensInfo']);
    if (fromTokensInfo != null) {
        let transformedList = fromTokensInfo;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['tokensInfo'], transformedList);
    }
    return toObject;
}
function contentEmbeddingFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromValues = getValueByPath(fromObject, ['values']);
    if (fromValues != null) {
        setValueByPath(toObject, ['values'], fromValues);
    }
    const fromStatistics = getValueByPath(fromObject, ['statistics']);
    if (fromStatistics != null) {
        setValueByPath(toObject, ['statistics'], contentEmbeddingStatisticsFromVertex(fromStatistics));
    }
    return toObject;
}
function contentEmbeddingStatisticsFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromTruncated = getValueByPath(fromObject, ['truncated']);
    if (fromTruncated != null) {
        setValueByPath(toObject, ['truncated'], fromTruncated);
    }
    const fromTokenCount = getValueByPath(fromObject, ['token_count']);
    if (fromTokenCount != null) {
        setValueByPath(toObject, ['tokenCount'], fromTokenCount);
    }
    return toObject;
}
function contentToMldev$1(fromObject, rootObject) {
    const toObject = {};
    const fromParts = getValueByPath(fromObject, ['parts']);
    if (fromParts != null) {
        let transformedList = fromParts;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return partToMldev$1(item);
            });
        }
        setValueByPath(toObject, ['parts'], transformedList);
    }
    const fromRole = getValueByPath(fromObject, ['role']);
    if (fromRole != null) {
        setValueByPath(toObject, ['role'], fromRole);
    }
    return toObject;
}
function contentToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromParts = getValueByPath(fromObject, ['parts']);
    if (fromParts != null) {
        let transformedList = fromParts;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return partToVertex(item);
            });
        }
        setValueByPath(toObject, ['parts'], transformedList);
    }
    const fromRole = getValueByPath(fromObject, ['role']);
    if (fromRole != null) {
        setValueByPath(toObject, ['role'], fromRole);
    }
    return toObject;
}
function controlReferenceConfigToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromControlType = getValueByPath(fromObject, ['controlType']);
    if (fromControlType != null) {
        setValueByPath(toObject, ['controlType'], fromControlType);
    }
    const fromEnableControlImageComputation = getValueByPath(fromObject, [
        'enableControlImageComputation',
    ]);
    if (fromEnableControlImageComputation != null) {
        setValueByPath(toObject, ['computeControl'], fromEnableControlImageComputation);
    }
    return toObject;
}
function countTokensConfigToMldev(fromObject, _rootObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['systemInstruction']) !== undefined) {
        throw new Error('systemInstruction parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['tools']) !== undefined) {
        throw new Error('tools parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['generationConfig']) !== undefined) {
        throw new Error('generationConfig parameter is not supported in Gemini API.');
    }
    return toObject;
}
function countTokensConfigToVertex(fromObject, parentObject, rootObject) {
    const toObject = {};
    const fromSystemInstruction = getValueByPath(fromObject, [
        'systemInstruction',
    ]);
    if (parentObject !== undefined && fromSystemInstruction != null) {
        setValueByPath(parentObject, ['systemInstruction'], contentToVertex(tContent(fromSystemInstruction)));
    }
    const fromTools = getValueByPath(fromObject, ['tools']);
    if (parentObject !== undefined && fromTools != null) {
        let transformedList = fromTools;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return toolToVertex(item);
            });
        }
        setValueByPath(parentObject, ['tools'], transformedList);
    }
    const fromGenerationConfig = getValueByPath(fromObject, [
        'generationConfig',
    ]);
    if (parentObject !== undefined && fromGenerationConfig != null) {
        setValueByPath(parentObject, ['generationConfig'], generationConfigToVertex(fromGenerationConfig));
    }
    return toObject;
}
function countTokensParametersToMldev(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (fromContents != null) {
        let transformedList = tContents(fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return contentToMldev$1(item);
            });
        }
        setValueByPath(toObject, ['contents'], transformedList);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        countTokensConfigToMldev(fromConfig);
    }
    return toObject;
}
function countTokensParametersToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (fromContents != null) {
        let transformedList = tContents(fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return contentToVertex(item);
            });
        }
        setValueByPath(toObject, ['contents'], transformedList);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        countTokensConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function countTokensResponseFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromTotalTokens = getValueByPath(fromObject, ['totalTokens']);
    if (fromTotalTokens != null) {
        setValueByPath(toObject, ['totalTokens'], fromTotalTokens);
    }
    const fromCachedContentTokenCount = getValueByPath(fromObject, [
        'cachedContentTokenCount',
    ]);
    if (fromCachedContentTokenCount != null) {
        setValueByPath(toObject, ['cachedContentTokenCount'], fromCachedContentTokenCount);
    }
    return toObject;
}
function countTokensResponseFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromTotalTokens = getValueByPath(fromObject, ['totalTokens']);
    if (fromTotalTokens != null) {
        setValueByPath(toObject, ['totalTokens'], fromTotalTokens);
    }
    return toObject;
}
function deleteModelParametersToMldev(apiClient, fromObject, _rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'name'], tModel(apiClient, fromModel));
    }
    return toObject;
}
function deleteModelParametersToVertex(apiClient, fromObject, _rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'name'], tModel(apiClient, fromModel));
    }
    return toObject;
}
function deleteModelResponseFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    return toObject;
}
function deleteModelResponseFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    return toObject;
}
function editImageConfigToVertex(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromOutputGcsUri = getValueByPath(fromObject, ['outputGcsUri']);
    if (parentObject !== undefined && fromOutputGcsUri != null) {
        setValueByPath(parentObject, ['parameters', 'storageUri'], fromOutputGcsUri);
    }
    const fromNegativePrompt = getValueByPath(fromObject, [
        'negativePrompt',
    ]);
    if (parentObject !== undefined && fromNegativePrompt != null) {
        setValueByPath(parentObject, ['parameters', 'negativePrompt'], fromNegativePrompt);
    }
    const fromNumberOfImages = getValueByPath(fromObject, [
        'numberOfImages',
    ]);
    if (parentObject !== undefined && fromNumberOfImages != null) {
        setValueByPath(parentObject, ['parameters', 'sampleCount'], fromNumberOfImages);
    }
    const fromAspectRatio = getValueByPath(fromObject, ['aspectRatio']);
    if (parentObject !== undefined && fromAspectRatio != null) {
        setValueByPath(parentObject, ['parameters', 'aspectRatio'], fromAspectRatio);
    }
    const fromGuidanceScale = getValueByPath(fromObject, [
        'guidanceScale',
    ]);
    if (parentObject !== undefined && fromGuidanceScale != null) {
        setValueByPath(parentObject, ['parameters', 'guidanceScale'], fromGuidanceScale);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (parentObject !== undefined && fromSeed != null) {
        setValueByPath(parentObject, ['parameters', 'seed'], fromSeed);
    }
    const fromSafetyFilterLevel = getValueByPath(fromObject, [
        'safetyFilterLevel',
    ]);
    if (parentObject !== undefined && fromSafetyFilterLevel != null) {
        setValueByPath(parentObject, ['parameters', 'safetySetting'], fromSafetyFilterLevel);
    }
    const fromPersonGeneration = getValueByPath(fromObject, [
        'personGeneration',
    ]);
    if (parentObject !== undefined && fromPersonGeneration != null) {
        setValueByPath(parentObject, ['parameters', 'personGeneration'], fromPersonGeneration);
    }
    const fromIncludeSafetyAttributes = getValueByPath(fromObject, [
        'includeSafetyAttributes',
    ]);
    if (parentObject !== undefined && fromIncludeSafetyAttributes != null) {
        setValueByPath(parentObject, ['parameters', 'includeSafetyAttributes'], fromIncludeSafetyAttributes);
    }
    const fromIncludeRaiReason = getValueByPath(fromObject, [
        'includeRaiReason',
    ]);
    if (parentObject !== undefined && fromIncludeRaiReason != null) {
        setValueByPath(parentObject, ['parameters', 'includeRaiReason'], fromIncludeRaiReason);
    }
    const fromLanguage = getValueByPath(fromObject, ['language']);
    if (parentObject !== undefined && fromLanguage != null) {
        setValueByPath(parentObject, ['parameters', 'language'], fromLanguage);
    }
    const fromOutputMimeType = getValueByPath(fromObject, [
        'outputMimeType',
    ]);
    if (parentObject !== undefined && fromOutputMimeType != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'mimeType'], fromOutputMimeType);
    }
    const fromOutputCompressionQuality = getValueByPath(fromObject, [
        'outputCompressionQuality',
    ]);
    if (parentObject !== undefined && fromOutputCompressionQuality != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'compressionQuality'], fromOutputCompressionQuality);
    }
    const fromAddWatermark = getValueByPath(fromObject, ['addWatermark']);
    if (parentObject !== undefined && fromAddWatermark != null) {
        setValueByPath(parentObject, ['parameters', 'addWatermark'], fromAddWatermark);
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (parentObject !== undefined && fromLabels != null) {
        setValueByPath(parentObject, ['labels'], fromLabels);
    }
    const fromEditMode = getValueByPath(fromObject, ['editMode']);
    if (parentObject !== undefined && fromEditMode != null) {
        setValueByPath(parentObject, ['parameters', 'editMode'], fromEditMode);
    }
    const fromBaseSteps = getValueByPath(fromObject, ['baseSteps']);
    if (parentObject !== undefined && fromBaseSteps != null) {
        setValueByPath(parentObject, ['parameters', 'editConfig', 'baseSteps'], fromBaseSteps);
    }
    return toObject;
}
function editImageParametersInternalToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromPrompt = getValueByPath(fromObject, ['prompt']);
    if (fromPrompt != null) {
        setValueByPath(toObject, ['instances[0]', 'prompt'], fromPrompt);
    }
    const fromReferenceImages = getValueByPath(fromObject, [
        'referenceImages',
    ]);
    if (fromReferenceImages != null) {
        let transformedList = fromReferenceImages;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return referenceImageAPIInternalToVertex(item);
            });
        }
        setValueByPath(toObject, ['instances[0]', 'referenceImages'], transformedList);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        editImageConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function editImageResponseFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromGeneratedImages = getValueByPath(fromObject, [
        'predictions',
    ]);
    if (fromGeneratedImages != null) {
        let transformedList = fromGeneratedImages;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedImageFromVertex(item);
            });
        }
        setValueByPath(toObject, ['generatedImages'], transformedList);
    }
    return toObject;
}
function embedContentConfigToMldev(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromTaskType = getValueByPath(fromObject, ['taskType']);
    if (parentObject !== undefined && fromTaskType != null) {
        setValueByPath(parentObject, ['requests[]', 'taskType'], fromTaskType);
    }
    const fromTitle = getValueByPath(fromObject, ['title']);
    if (parentObject !== undefined && fromTitle != null) {
        setValueByPath(parentObject, ['requests[]', 'title'], fromTitle);
    }
    const fromOutputDimensionality = getValueByPath(fromObject, [
        'outputDimensionality',
    ]);
    if (parentObject !== undefined && fromOutputDimensionality != null) {
        setValueByPath(parentObject, ['requests[]', 'outputDimensionality'], fromOutputDimensionality);
    }
    if (getValueByPath(fromObject, ['mimeType']) !== undefined) {
        throw new Error('mimeType parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['autoTruncate']) !== undefined) {
        throw new Error('autoTruncate parameter is not supported in Gemini API.');
    }
    return toObject;
}
function embedContentConfigToVertex(fromObject, parentObject, rootObject) {
    const toObject = {};
    let discriminatorTaskType = getValueByPath(rootObject, [
        'embeddingApiType',
    ]);
    if (discriminatorTaskType === undefined) {
        discriminatorTaskType = 'PREDICT';
    }
    if (discriminatorTaskType === 'PREDICT') {
        const fromTaskType = getValueByPath(fromObject, ['taskType']);
        if (parentObject !== undefined && fromTaskType != null) {
            setValueByPath(parentObject, ['instances[]', 'task_type'], fromTaskType);
        }
    }
    else if (discriminatorTaskType === 'EMBED_CONTENT') {
        const fromTaskType = getValueByPath(fromObject, ['taskType']);
        if (parentObject !== undefined && fromTaskType != null) {
            setValueByPath(parentObject, ['taskType'], fromTaskType);
        }
    }
    let discriminatorTitle = getValueByPath(rootObject, [
        'embeddingApiType',
    ]);
    if (discriminatorTitle === undefined) {
        discriminatorTitle = 'PREDICT';
    }
    if (discriminatorTitle === 'PREDICT') {
        const fromTitle = getValueByPath(fromObject, ['title']);
        if (parentObject !== undefined && fromTitle != null) {
            setValueByPath(parentObject, ['instances[]', 'title'], fromTitle);
        }
    }
    else if (discriminatorTitle === 'EMBED_CONTENT') {
        const fromTitle = getValueByPath(fromObject, ['title']);
        if (parentObject !== undefined && fromTitle != null) {
            setValueByPath(parentObject, ['title'], fromTitle);
        }
    }
    let discriminatorOutputDimensionality = getValueByPath(rootObject, [
        'embeddingApiType',
    ]);
    if (discriminatorOutputDimensionality === undefined) {
        discriminatorOutputDimensionality = 'PREDICT';
    }
    if (discriminatorOutputDimensionality === 'PREDICT') {
        const fromOutputDimensionality = getValueByPath(fromObject, [
            'outputDimensionality',
        ]);
        if (parentObject !== undefined && fromOutputDimensionality != null) {
            setValueByPath(parentObject, ['parameters', 'outputDimensionality'], fromOutputDimensionality);
        }
    }
    else if (discriminatorOutputDimensionality === 'EMBED_CONTENT') {
        const fromOutputDimensionality = getValueByPath(fromObject, [
            'outputDimensionality',
        ]);
        if (parentObject !== undefined && fromOutputDimensionality != null) {
            setValueByPath(parentObject, ['outputDimensionality'], fromOutputDimensionality);
        }
    }
    let discriminatorMimeType = getValueByPath(rootObject, [
        'embeddingApiType',
    ]);
    if (discriminatorMimeType === undefined) {
        discriminatorMimeType = 'PREDICT';
    }
    if (discriminatorMimeType === 'PREDICT') {
        const fromMimeType = getValueByPath(fromObject, ['mimeType']);
        if (parentObject !== undefined && fromMimeType != null) {
            setValueByPath(parentObject, ['instances[]', 'mimeType'], fromMimeType);
        }
    }
    let discriminatorAutoTruncate = getValueByPath(rootObject, [
        'embeddingApiType',
    ]);
    if (discriminatorAutoTruncate === undefined) {
        discriminatorAutoTruncate = 'PREDICT';
    }
    if (discriminatorAutoTruncate === 'PREDICT') {
        const fromAutoTruncate = getValueByPath(fromObject, [
            'autoTruncate',
        ]);
        if (parentObject !== undefined && fromAutoTruncate != null) {
            setValueByPath(parentObject, ['parameters', 'autoTruncate'], fromAutoTruncate);
        }
    }
    else if (discriminatorAutoTruncate === 'EMBED_CONTENT') {
        const fromAutoTruncate = getValueByPath(fromObject, [
            'autoTruncate',
        ]);
        if (parentObject !== undefined && fromAutoTruncate != null) {
            setValueByPath(parentObject, ['autoTruncate'], fromAutoTruncate);
        }
    }
    return toObject;
}
function embedContentParametersPrivateToMldev(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (fromContents != null) {
        let transformedList = tContentsForEmbed(apiClient, fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['requests[]', 'content'], transformedList);
    }
    const fromContent = getValueByPath(fromObject, ['content']);
    if (fromContent != null) {
        contentToMldev$1(tContent(fromContent));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        embedContentConfigToMldev(fromConfig, toObject);
    }
    const fromModelForEmbedContent = getValueByPath(fromObject, ['model']);
    if (fromModelForEmbedContent !== undefined) {
        setValueByPath(toObject, ['requests[]', 'model'], tModel(apiClient, fromModelForEmbedContent));
    }
    return toObject;
}
function embedContentParametersPrivateToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    let discriminatorContents = getValueByPath(rootObject, [
        'embeddingApiType',
    ]);
    if (discriminatorContents === undefined) {
        discriminatorContents = 'PREDICT';
    }
    if (discriminatorContents === 'PREDICT') {
        const fromContents = getValueByPath(fromObject, ['contents']);
        if (fromContents != null) {
            let transformedList = tContentsForEmbed(apiClient, fromContents);
            if (Array.isArray(transformedList)) {
                transformedList = transformedList.map((item) => {
                    return item;
                });
            }
            setValueByPath(toObject, ['instances[]', 'content'], transformedList);
        }
    }
    let discriminatorContent = getValueByPath(rootObject, [
        'embeddingApiType',
    ]);
    if (discriminatorContent === undefined) {
        discriminatorContent = 'PREDICT';
    }
    if (discriminatorContent === 'EMBED_CONTENT') {
        const fromContent = getValueByPath(fromObject, ['content']);
        if (fromContent != null) {
            setValueByPath(toObject, ['content'], contentToVertex(tContent(fromContent)));
        }
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        embedContentConfigToVertex(fromConfig, toObject, rootObject);
    }
    return toObject;
}
function embedContentResponseFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromEmbeddings = getValueByPath(fromObject, ['embeddings']);
    if (fromEmbeddings != null) {
        let transformedList = fromEmbeddings;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['embeddings'], transformedList);
    }
    const fromMetadata = getValueByPath(fromObject, ['metadata']);
    if (fromMetadata != null) {
        setValueByPath(toObject, ['metadata'], fromMetadata);
    }
    return toObject;
}
function embedContentResponseFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromEmbeddings = getValueByPath(fromObject, [
        'predictions[]',
        'embeddings',
    ]);
    if (fromEmbeddings != null) {
        let transformedList = fromEmbeddings;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return contentEmbeddingFromVertex(item);
            });
        }
        setValueByPath(toObject, ['embeddings'], transformedList);
    }
    const fromMetadata = getValueByPath(fromObject, ['metadata']);
    if (fromMetadata != null) {
        setValueByPath(toObject, ['metadata'], fromMetadata);
    }
    if (rootObject &&
        getValueByPath(rootObject, ['embeddingApiType']) === 'EMBED_CONTENT') {
        const embedding = getValueByPath(fromObject, ['embedding']);
        const usageMetadata = getValueByPath(fromObject, ['usageMetadata']);
        const truncated = getValueByPath(fromObject, ['truncated']);
        if (embedding) {
            const stats = {};
            if (usageMetadata &&
                usageMetadata['promptTokenCount']) {
                stats.tokenCount = usageMetadata['promptTokenCount'];
            }
            if (truncated) {
                stats.truncated = truncated;
            }
            embedding.statistics = stats;
            setValueByPath(toObject, ['embeddings'], [embedding]);
        }
    }
    return toObject;
}
function endpointFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['endpoint']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromDeployedModelId = getValueByPath(fromObject, [
        'deployedModelId',
    ]);
    if (fromDeployedModelId != null) {
        setValueByPath(toObject, ['deployedModelId'], fromDeployedModelId);
    }
    return toObject;
}
function fileDataToMldev$1(fromObject, _rootObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromFileUri = getValueByPath(fromObject, ['fileUri']);
    if (fromFileUri != null) {
        setValueByPath(toObject, ['fileUri'], fromFileUri);
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function functionCallToMldev$1(fromObject, _rootObject) {
    const toObject = {};
    const fromId = getValueByPath(fromObject, ['id']);
    if (fromId != null) {
        setValueByPath(toObject, ['id'], fromId);
    }
    const fromArgs = getValueByPath(fromObject, ['args']);
    if (fromArgs != null) {
        setValueByPath(toObject, ['args'], fromArgs);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    if (getValueByPath(fromObject, ['partialArgs']) !== undefined) {
        throw new Error('partialArgs parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['willContinue']) !== undefined) {
        throw new Error('willContinue parameter is not supported in Gemini API.');
    }
    return toObject;
}
function functionCallingConfigToMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromAllowedFunctionNames = getValueByPath(fromObject, [
        'allowedFunctionNames',
    ]);
    if (fromAllowedFunctionNames != null) {
        setValueByPath(toObject, ['allowedFunctionNames'], fromAllowedFunctionNames);
    }
    const fromMode = getValueByPath(fromObject, ['mode']);
    if (fromMode != null) {
        setValueByPath(toObject, ['mode'], fromMode);
    }
    if (getValueByPath(fromObject, ['streamFunctionCallArguments']) !==
        undefined) {
        throw new Error('streamFunctionCallArguments parameter is not supported in Gemini API.');
    }
    return toObject;
}
function functionDeclarationToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (fromDescription != null) {
        setValueByPath(toObject, ['description'], fromDescription);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromParameters = getValueByPath(fromObject, ['parameters']);
    if (fromParameters != null) {
        setValueByPath(toObject, ['parameters'], fromParameters);
    }
    const fromParametersJsonSchema = getValueByPath(fromObject, [
        'parametersJsonSchema',
    ]);
    if (fromParametersJsonSchema != null) {
        setValueByPath(toObject, ['parametersJsonSchema'], fromParametersJsonSchema);
    }
    const fromResponse = getValueByPath(fromObject, ['response']);
    if (fromResponse != null) {
        setValueByPath(toObject, ['response'], fromResponse);
    }
    const fromResponseJsonSchema = getValueByPath(fromObject, [
        'responseJsonSchema',
    ]);
    if (fromResponseJsonSchema != null) {
        setValueByPath(toObject, ['responseJsonSchema'], fromResponseJsonSchema);
    }
    if (getValueByPath(fromObject, ['behavior']) !== undefined) {
        throw new Error('behavior parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function generateContentConfigToMldev(apiClient, fromObject, parentObject, rootObject) {
    const toObject = {};
    const fromSystemInstruction = getValueByPath(fromObject, [
        'systemInstruction',
    ]);
    if (parentObject !== undefined && fromSystemInstruction != null) {
        setValueByPath(parentObject, ['systemInstruction'], contentToMldev$1(tContent(fromSystemInstruction)));
    }
    const fromTemperature = getValueByPath(fromObject, ['temperature']);
    if (fromTemperature != null) {
        setValueByPath(toObject, ['temperature'], fromTemperature);
    }
    const fromTopP = getValueByPath(fromObject, ['topP']);
    if (fromTopP != null) {
        setValueByPath(toObject, ['topP'], fromTopP);
    }
    const fromTopK = getValueByPath(fromObject, ['topK']);
    if (fromTopK != null) {
        setValueByPath(toObject, ['topK'], fromTopK);
    }
    const fromCandidateCount = getValueByPath(fromObject, [
        'candidateCount',
    ]);
    if (fromCandidateCount != null) {
        setValueByPath(toObject, ['candidateCount'], fromCandidateCount);
    }
    const fromMaxOutputTokens = getValueByPath(fromObject, [
        'maxOutputTokens',
    ]);
    if (fromMaxOutputTokens != null) {
        setValueByPath(toObject, ['maxOutputTokens'], fromMaxOutputTokens);
    }
    const fromStopSequences = getValueByPath(fromObject, [
        'stopSequences',
    ]);
    if (fromStopSequences != null) {
        setValueByPath(toObject, ['stopSequences'], fromStopSequences);
    }
    const fromResponseLogprobs = getValueByPath(fromObject, [
        'responseLogprobs',
    ]);
    if (fromResponseLogprobs != null) {
        setValueByPath(toObject, ['responseLogprobs'], fromResponseLogprobs);
    }
    const fromLogprobs = getValueByPath(fromObject, ['logprobs']);
    if (fromLogprobs != null) {
        setValueByPath(toObject, ['logprobs'], fromLogprobs);
    }
    const fromPresencePenalty = getValueByPath(fromObject, [
        'presencePenalty',
    ]);
    if (fromPresencePenalty != null) {
        setValueByPath(toObject, ['presencePenalty'], fromPresencePenalty);
    }
    const fromFrequencyPenalty = getValueByPath(fromObject, [
        'frequencyPenalty',
    ]);
    if (fromFrequencyPenalty != null) {
        setValueByPath(toObject, ['frequencyPenalty'], fromFrequencyPenalty);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (fromSeed != null) {
        setValueByPath(toObject, ['seed'], fromSeed);
    }
    const fromResponseMimeType = getValueByPath(fromObject, [
        'responseMimeType',
    ]);
    if (fromResponseMimeType != null) {
        setValueByPath(toObject, ['responseMimeType'], fromResponseMimeType);
    }
    const fromResponseSchema = getValueByPath(fromObject, [
        'responseSchema',
    ]);
    if (fromResponseSchema != null) {
        setValueByPath(toObject, ['responseSchema'], tSchema(fromResponseSchema));
    }
    const fromResponseJsonSchema = getValueByPath(fromObject, [
        'responseJsonSchema',
    ]);
    if (fromResponseJsonSchema != null) {
        setValueByPath(toObject, ['responseJsonSchema'], fromResponseJsonSchema);
    }
    if (getValueByPath(fromObject, ['routingConfig']) !== undefined) {
        throw new Error('routingConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['modelSelectionConfig']) !== undefined) {
        throw new Error('modelSelectionConfig parameter is not supported in Gemini API.');
    }
    const fromSafetySettings = getValueByPath(fromObject, [
        'safetySettings',
    ]);
    if (parentObject !== undefined && fromSafetySettings != null) {
        let transformedList = fromSafetySettings;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return safetySettingToMldev(item);
            });
        }
        setValueByPath(parentObject, ['safetySettings'], transformedList);
    }
    const fromTools = getValueByPath(fromObject, ['tools']);
    if (parentObject !== undefined && fromTools != null) {
        let transformedList = tTools(fromTools);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return toolToMldev$1(tTool(item));
            });
        }
        setValueByPath(parentObject, ['tools'], transformedList);
    }
    const fromToolConfig = getValueByPath(fromObject, ['toolConfig']);
    if (parentObject !== undefined && fromToolConfig != null) {
        setValueByPath(parentObject, ['toolConfig'], toolConfigToMldev(fromToolConfig));
    }
    if (getValueByPath(fromObject, ['labels']) !== undefined) {
        throw new Error('labels parameter is not supported in Gemini API.');
    }
    const fromCachedContent = getValueByPath(fromObject, [
        'cachedContent',
    ]);
    if (parentObject !== undefined && fromCachedContent != null) {
        setValueByPath(parentObject, ['cachedContent'], tCachedContentName(apiClient, fromCachedContent));
    }
    const fromResponseModalities = getValueByPath(fromObject, [
        'responseModalities',
    ]);
    if (fromResponseModalities != null) {
        setValueByPath(toObject, ['responseModalities'], fromResponseModalities);
    }
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromSpeechConfig = getValueByPath(fromObject, ['speechConfig']);
    if (fromSpeechConfig != null) {
        setValueByPath(toObject, ['speechConfig'], tSpeechConfig(fromSpeechConfig));
    }
    if (getValueByPath(fromObject, ['audioTimestamp']) !== undefined) {
        throw new Error('audioTimestamp parameter is not supported in Gemini API.');
    }
    const fromThinkingConfig = getValueByPath(fromObject, [
        'thinkingConfig',
    ]);
    if (fromThinkingConfig != null) {
        setValueByPath(toObject, ['thinkingConfig'], fromThinkingConfig);
    }
    const fromImageConfig = getValueByPath(fromObject, ['imageConfig']);
    if (fromImageConfig != null) {
        setValueByPath(toObject, ['imageConfig'], imageConfigToMldev(fromImageConfig));
    }
    const fromEnableEnhancedCivicAnswers = getValueByPath(fromObject, [
        'enableEnhancedCivicAnswers',
    ]);
    if (fromEnableEnhancedCivicAnswers != null) {
        setValueByPath(toObject, ['enableEnhancedCivicAnswers'], fromEnableEnhancedCivicAnswers);
    }
    if (getValueByPath(fromObject, ['modelArmorConfig']) !== undefined) {
        throw new Error('modelArmorConfig parameter is not supported in Gemini API.');
    }
    const fromServiceTier = getValueByPath(fromObject, ['serviceTier']);
    if (parentObject !== undefined && fromServiceTier != null) {
        setValueByPath(parentObject, ['serviceTier'], fromServiceTier);
    }
    return toObject;
}
function generateContentConfigToVertex(apiClient, fromObject, parentObject, rootObject) {
    const toObject = {};
    const fromSystemInstruction = getValueByPath(fromObject, [
        'systemInstruction',
    ]);
    if (parentObject !== undefined && fromSystemInstruction != null) {
        setValueByPath(parentObject, ['systemInstruction'], contentToVertex(tContent(fromSystemInstruction)));
    }
    const fromTemperature = getValueByPath(fromObject, ['temperature']);
    if (fromTemperature != null) {
        setValueByPath(toObject, ['temperature'], fromTemperature);
    }
    const fromTopP = getValueByPath(fromObject, ['topP']);
    if (fromTopP != null) {
        setValueByPath(toObject, ['topP'], fromTopP);
    }
    const fromTopK = getValueByPath(fromObject, ['topK']);
    if (fromTopK != null) {
        setValueByPath(toObject, ['topK'], fromTopK);
    }
    const fromCandidateCount = getValueByPath(fromObject, [
        'candidateCount',
    ]);
    if (fromCandidateCount != null) {
        setValueByPath(toObject, ['candidateCount'], fromCandidateCount);
    }
    const fromMaxOutputTokens = getValueByPath(fromObject, [
        'maxOutputTokens',
    ]);
    if (fromMaxOutputTokens != null) {
        setValueByPath(toObject, ['maxOutputTokens'], fromMaxOutputTokens);
    }
    const fromStopSequences = getValueByPath(fromObject, [
        'stopSequences',
    ]);
    if (fromStopSequences != null) {
        setValueByPath(toObject, ['stopSequences'], fromStopSequences);
    }
    const fromResponseLogprobs = getValueByPath(fromObject, [
        'responseLogprobs',
    ]);
    if (fromResponseLogprobs != null) {
        setValueByPath(toObject, ['responseLogprobs'], fromResponseLogprobs);
    }
    const fromLogprobs = getValueByPath(fromObject, ['logprobs']);
    if (fromLogprobs != null) {
        setValueByPath(toObject, ['logprobs'], fromLogprobs);
    }
    const fromPresencePenalty = getValueByPath(fromObject, [
        'presencePenalty',
    ]);
    if (fromPresencePenalty != null) {
        setValueByPath(toObject, ['presencePenalty'], fromPresencePenalty);
    }
    const fromFrequencyPenalty = getValueByPath(fromObject, [
        'frequencyPenalty',
    ]);
    if (fromFrequencyPenalty != null) {
        setValueByPath(toObject, ['frequencyPenalty'], fromFrequencyPenalty);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (fromSeed != null) {
        setValueByPath(toObject, ['seed'], fromSeed);
    }
    const fromResponseMimeType = getValueByPath(fromObject, [
        'responseMimeType',
    ]);
    if (fromResponseMimeType != null) {
        setValueByPath(toObject, ['responseMimeType'], fromResponseMimeType);
    }
    const fromResponseSchema = getValueByPath(fromObject, [
        'responseSchema',
    ]);
    if (fromResponseSchema != null) {
        setValueByPath(toObject, ['responseSchema'], tSchema(fromResponseSchema));
    }
    const fromResponseJsonSchema = getValueByPath(fromObject, [
        'responseJsonSchema',
    ]);
    if (fromResponseJsonSchema != null) {
        setValueByPath(toObject, ['responseJsonSchema'], fromResponseJsonSchema);
    }
    const fromRoutingConfig = getValueByPath(fromObject, [
        'routingConfig',
    ]);
    if (fromRoutingConfig != null) {
        setValueByPath(toObject, ['routingConfig'], fromRoutingConfig);
    }
    const fromModelSelectionConfig = getValueByPath(fromObject, [
        'modelSelectionConfig',
    ]);
    if (fromModelSelectionConfig != null) {
        setValueByPath(toObject, ['modelConfig'], fromModelSelectionConfig);
    }
    const fromSafetySettings = getValueByPath(fromObject, [
        'safetySettings',
    ]);
    if (parentObject !== undefined && fromSafetySettings != null) {
        let transformedList = fromSafetySettings;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(parentObject, ['safetySettings'], transformedList);
    }
    const fromTools = getValueByPath(fromObject, ['tools']);
    if (parentObject !== undefined && fromTools != null) {
        let transformedList = tTools(fromTools);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return toolToVertex(tTool(item));
            });
        }
        setValueByPath(parentObject, ['tools'], transformedList);
    }
    const fromToolConfig = getValueByPath(fromObject, ['toolConfig']);
    if (parentObject !== undefined && fromToolConfig != null) {
        setValueByPath(parentObject, ['toolConfig'], toolConfigToVertex(fromToolConfig));
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (parentObject !== undefined && fromLabels != null) {
        setValueByPath(parentObject, ['labels'], fromLabels);
    }
    const fromCachedContent = getValueByPath(fromObject, [
        'cachedContent',
    ]);
    if (parentObject !== undefined && fromCachedContent != null) {
        setValueByPath(parentObject, ['cachedContent'], tCachedContentName(apiClient, fromCachedContent));
    }
    const fromResponseModalities = getValueByPath(fromObject, [
        'responseModalities',
    ]);
    if (fromResponseModalities != null) {
        setValueByPath(toObject, ['responseModalities'], fromResponseModalities);
    }
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromSpeechConfig = getValueByPath(fromObject, ['speechConfig']);
    if (fromSpeechConfig != null) {
        setValueByPath(toObject, ['speechConfig'], speechConfigToVertex(tSpeechConfig(fromSpeechConfig)));
    }
    const fromAudioTimestamp = getValueByPath(fromObject, [
        'audioTimestamp',
    ]);
    if (fromAudioTimestamp != null) {
        setValueByPath(toObject, ['audioTimestamp'], fromAudioTimestamp);
    }
    const fromThinkingConfig = getValueByPath(fromObject, [
        'thinkingConfig',
    ]);
    if (fromThinkingConfig != null) {
        setValueByPath(toObject, ['thinkingConfig'], fromThinkingConfig);
    }
    const fromImageConfig = getValueByPath(fromObject, ['imageConfig']);
    if (fromImageConfig != null) {
        setValueByPath(toObject, ['imageConfig'], imageConfigToVertex(fromImageConfig));
    }
    if (getValueByPath(fromObject, ['enableEnhancedCivicAnswers']) !==
        undefined) {
        throw new Error('enableEnhancedCivicAnswers parameter is not supported in Vertex AI.');
    }
    const fromModelArmorConfig = getValueByPath(fromObject, [
        'modelArmorConfig',
    ]);
    if (parentObject !== undefined && fromModelArmorConfig != null) {
        setValueByPath(parentObject, ['modelArmorConfig'], fromModelArmorConfig);
    }
    const fromServiceTier = getValueByPath(fromObject, ['serviceTier']);
    if (parentObject !== undefined && fromServiceTier != null) {
        setValueByPath(parentObject, ['serviceTier'], fromServiceTier);
    }
    return toObject;
}
function generateContentParametersToMldev(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (fromContents != null) {
        let transformedList = tContents(fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return contentToMldev$1(item);
            });
        }
        setValueByPath(toObject, ['contents'], transformedList);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        setValueByPath(toObject, ['generationConfig'], generateContentConfigToMldev(apiClient, fromConfig, toObject));
    }
    return toObject;
}
function generateContentParametersToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromContents = getValueByPath(fromObject, ['contents']);
    if (fromContents != null) {
        let transformedList = tContents(fromContents);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return contentToVertex(item);
            });
        }
        setValueByPath(toObject, ['contents'], transformedList);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        setValueByPath(toObject, ['generationConfig'], generateContentConfigToVertex(apiClient, fromConfig, toObject));
    }
    return toObject;
}
function generateContentResponseFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromCandidates = getValueByPath(fromObject, ['candidates']);
    if (fromCandidates != null) {
        let transformedList = fromCandidates;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return candidateFromMldev(item);
            });
        }
        setValueByPath(toObject, ['candidates'], transformedList);
    }
    const fromModelVersion = getValueByPath(fromObject, ['modelVersion']);
    if (fromModelVersion != null) {
        setValueByPath(toObject, ['modelVersion'], fromModelVersion);
    }
    const fromPromptFeedback = getValueByPath(fromObject, [
        'promptFeedback',
    ]);
    if (fromPromptFeedback != null) {
        setValueByPath(toObject, ['promptFeedback'], fromPromptFeedback);
    }
    const fromResponseId = getValueByPath(fromObject, ['responseId']);
    if (fromResponseId != null) {
        setValueByPath(toObject, ['responseId'], fromResponseId);
    }
    const fromUsageMetadata = getValueByPath(fromObject, [
        'usageMetadata',
    ]);
    if (fromUsageMetadata != null) {
        setValueByPath(toObject, ['usageMetadata'], fromUsageMetadata);
    }
    const fromModelStatus = getValueByPath(fromObject, ['modelStatus']);
    if (fromModelStatus != null) {
        setValueByPath(toObject, ['modelStatus'], fromModelStatus);
    }
    return toObject;
}
function generateContentResponseFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromCandidates = getValueByPath(fromObject, ['candidates']);
    if (fromCandidates != null) {
        let transformedList = fromCandidates;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['candidates'], transformedList);
    }
    const fromCreateTime = getValueByPath(fromObject, ['createTime']);
    if (fromCreateTime != null) {
        setValueByPath(toObject, ['createTime'], fromCreateTime);
    }
    const fromModelVersion = getValueByPath(fromObject, ['modelVersion']);
    if (fromModelVersion != null) {
        setValueByPath(toObject, ['modelVersion'], fromModelVersion);
    }
    const fromPromptFeedback = getValueByPath(fromObject, [
        'promptFeedback',
    ]);
    if (fromPromptFeedback != null) {
        setValueByPath(toObject, ['promptFeedback'], fromPromptFeedback);
    }
    const fromResponseId = getValueByPath(fromObject, ['responseId']);
    if (fromResponseId != null) {
        setValueByPath(toObject, ['responseId'], fromResponseId);
    }
    const fromUsageMetadata = getValueByPath(fromObject, [
        'usageMetadata',
    ]);
    if (fromUsageMetadata != null) {
        setValueByPath(toObject, ['usageMetadata'], fromUsageMetadata);
    }
    return toObject;
}
function generateImagesConfigToMldev(fromObject, parentObject, _rootObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['outputGcsUri']) !== undefined) {
        throw new Error('outputGcsUri parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['negativePrompt']) !== undefined) {
        throw new Error('negativePrompt parameter is not supported in Gemini API.');
    }
    const fromNumberOfImages = getValueByPath(fromObject, [
        'numberOfImages',
    ]);
    if (parentObject !== undefined && fromNumberOfImages != null) {
        setValueByPath(parentObject, ['parameters', 'sampleCount'], fromNumberOfImages);
    }
    const fromAspectRatio = getValueByPath(fromObject, ['aspectRatio']);
    if (parentObject !== undefined && fromAspectRatio != null) {
        setValueByPath(parentObject, ['parameters', 'aspectRatio'], fromAspectRatio);
    }
    const fromGuidanceScale = getValueByPath(fromObject, [
        'guidanceScale',
    ]);
    if (parentObject !== undefined && fromGuidanceScale != null) {
        setValueByPath(parentObject, ['parameters', 'guidanceScale'], fromGuidanceScale);
    }
    if (getValueByPath(fromObject, ['seed']) !== undefined) {
        throw new Error('seed parameter is not supported in Gemini API.');
    }
    const fromSafetyFilterLevel = getValueByPath(fromObject, [
        'safetyFilterLevel',
    ]);
    if (parentObject !== undefined && fromSafetyFilterLevel != null) {
        setValueByPath(parentObject, ['parameters', 'safetySetting'], fromSafetyFilterLevel);
    }
    const fromPersonGeneration = getValueByPath(fromObject, [
        'personGeneration',
    ]);
    if (parentObject !== undefined && fromPersonGeneration != null) {
        setValueByPath(parentObject, ['parameters', 'personGeneration'], fromPersonGeneration);
    }
    const fromIncludeSafetyAttributes = getValueByPath(fromObject, [
        'includeSafetyAttributes',
    ]);
    if (parentObject !== undefined && fromIncludeSafetyAttributes != null) {
        setValueByPath(parentObject, ['parameters', 'includeSafetyAttributes'], fromIncludeSafetyAttributes);
    }
    const fromIncludeRaiReason = getValueByPath(fromObject, [
        'includeRaiReason',
    ]);
    if (parentObject !== undefined && fromIncludeRaiReason != null) {
        setValueByPath(parentObject, ['parameters', 'includeRaiReason'], fromIncludeRaiReason);
    }
    const fromLanguage = getValueByPath(fromObject, ['language']);
    if (parentObject !== undefined && fromLanguage != null) {
        setValueByPath(parentObject, ['parameters', 'language'], fromLanguage);
    }
    const fromOutputMimeType = getValueByPath(fromObject, [
        'outputMimeType',
    ]);
    if (parentObject !== undefined && fromOutputMimeType != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'mimeType'], fromOutputMimeType);
    }
    const fromOutputCompressionQuality = getValueByPath(fromObject, [
        'outputCompressionQuality',
    ]);
    if (parentObject !== undefined && fromOutputCompressionQuality != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'compressionQuality'], fromOutputCompressionQuality);
    }
    if (getValueByPath(fromObject, ['addWatermark']) !== undefined) {
        throw new Error('addWatermark parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['labels']) !== undefined) {
        throw new Error('labels parameter is not supported in Gemini API.');
    }
    const fromImageSize = getValueByPath(fromObject, ['imageSize']);
    if (parentObject !== undefined && fromImageSize != null) {
        setValueByPath(parentObject, ['parameters', 'sampleImageSize'], fromImageSize);
    }
    if (getValueByPath(fromObject, ['enhancePrompt']) !== undefined) {
        throw new Error('enhancePrompt parameter is not supported in Gemini API.');
    }
    return toObject;
}
function generateImagesConfigToVertex(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromOutputGcsUri = getValueByPath(fromObject, ['outputGcsUri']);
    if (parentObject !== undefined && fromOutputGcsUri != null) {
        setValueByPath(parentObject, ['parameters', 'storageUri'], fromOutputGcsUri);
    }
    const fromNegativePrompt = getValueByPath(fromObject, [
        'negativePrompt',
    ]);
    if (parentObject !== undefined && fromNegativePrompt != null) {
        setValueByPath(parentObject, ['parameters', 'negativePrompt'], fromNegativePrompt);
    }
    const fromNumberOfImages = getValueByPath(fromObject, [
        'numberOfImages',
    ]);
    if (parentObject !== undefined && fromNumberOfImages != null) {
        setValueByPath(parentObject, ['parameters', 'sampleCount'], fromNumberOfImages);
    }
    const fromAspectRatio = getValueByPath(fromObject, ['aspectRatio']);
    if (parentObject !== undefined && fromAspectRatio != null) {
        setValueByPath(parentObject, ['parameters', 'aspectRatio'], fromAspectRatio);
    }
    const fromGuidanceScale = getValueByPath(fromObject, [
        'guidanceScale',
    ]);
    if (parentObject !== undefined && fromGuidanceScale != null) {
        setValueByPath(parentObject, ['parameters', 'guidanceScale'], fromGuidanceScale);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (parentObject !== undefined && fromSeed != null) {
        setValueByPath(parentObject, ['parameters', 'seed'], fromSeed);
    }
    const fromSafetyFilterLevel = getValueByPath(fromObject, [
        'safetyFilterLevel',
    ]);
    if (parentObject !== undefined && fromSafetyFilterLevel != null) {
        setValueByPath(parentObject, ['parameters', 'safetySetting'], fromSafetyFilterLevel);
    }
    const fromPersonGeneration = getValueByPath(fromObject, [
        'personGeneration',
    ]);
    if (parentObject !== undefined && fromPersonGeneration != null) {
        setValueByPath(parentObject, ['parameters', 'personGeneration'], fromPersonGeneration);
    }
    const fromIncludeSafetyAttributes = getValueByPath(fromObject, [
        'includeSafetyAttributes',
    ]);
    if (parentObject !== undefined && fromIncludeSafetyAttributes != null) {
        setValueByPath(parentObject, ['parameters', 'includeSafetyAttributes'], fromIncludeSafetyAttributes);
    }
    const fromIncludeRaiReason = getValueByPath(fromObject, [
        'includeRaiReason',
    ]);
    if (parentObject !== undefined && fromIncludeRaiReason != null) {
        setValueByPath(parentObject, ['parameters', 'includeRaiReason'], fromIncludeRaiReason);
    }
    const fromLanguage = getValueByPath(fromObject, ['language']);
    if (parentObject !== undefined && fromLanguage != null) {
        setValueByPath(parentObject, ['parameters', 'language'], fromLanguage);
    }
    const fromOutputMimeType = getValueByPath(fromObject, [
        'outputMimeType',
    ]);
    if (parentObject !== undefined && fromOutputMimeType != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'mimeType'], fromOutputMimeType);
    }
    const fromOutputCompressionQuality = getValueByPath(fromObject, [
        'outputCompressionQuality',
    ]);
    if (parentObject !== undefined && fromOutputCompressionQuality != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'compressionQuality'], fromOutputCompressionQuality);
    }
    const fromAddWatermark = getValueByPath(fromObject, ['addWatermark']);
    if (parentObject !== undefined && fromAddWatermark != null) {
        setValueByPath(parentObject, ['parameters', 'addWatermark'], fromAddWatermark);
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (parentObject !== undefined && fromLabels != null) {
        setValueByPath(parentObject, ['labels'], fromLabels);
    }
    const fromImageSize = getValueByPath(fromObject, ['imageSize']);
    if (parentObject !== undefined && fromImageSize != null) {
        setValueByPath(parentObject, ['parameters', 'sampleImageSize'], fromImageSize);
    }
    const fromEnhancePrompt = getValueByPath(fromObject, [
        'enhancePrompt',
    ]);
    if (parentObject !== undefined && fromEnhancePrompt != null) {
        setValueByPath(parentObject, ['parameters', 'enhancePrompt'], fromEnhancePrompt);
    }
    return toObject;
}
function generateImagesParametersToMldev(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromPrompt = getValueByPath(fromObject, ['prompt']);
    if (fromPrompt != null) {
        setValueByPath(toObject, ['instances[0]', 'prompt'], fromPrompt);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        generateImagesConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function generateImagesParametersToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromPrompt = getValueByPath(fromObject, ['prompt']);
    if (fromPrompt != null) {
        setValueByPath(toObject, ['instances[0]', 'prompt'], fromPrompt);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        generateImagesConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function generateImagesResponseFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromGeneratedImages = getValueByPath(fromObject, [
        'predictions',
    ]);
    if (fromGeneratedImages != null) {
        let transformedList = fromGeneratedImages;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedImageFromMldev(item);
            });
        }
        setValueByPath(toObject, ['generatedImages'], transformedList);
    }
    const fromPositivePromptSafetyAttributes = getValueByPath(fromObject, [
        'positivePromptSafetyAttributes',
    ]);
    if (fromPositivePromptSafetyAttributes != null) {
        setValueByPath(toObject, ['positivePromptSafetyAttributes'], safetyAttributesFromMldev(fromPositivePromptSafetyAttributes));
    }
    return toObject;
}
function generateImagesResponseFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromGeneratedImages = getValueByPath(fromObject, [
        'predictions',
    ]);
    if (fromGeneratedImages != null) {
        let transformedList = fromGeneratedImages;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedImageFromVertex(item);
            });
        }
        setValueByPath(toObject, ['generatedImages'], transformedList);
    }
    const fromPositivePromptSafetyAttributes = getValueByPath(fromObject, [
        'positivePromptSafetyAttributes',
    ]);
    if (fromPositivePromptSafetyAttributes != null) {
        setValueByPath(toObject, ['positivePromptSafetyAttributes'], safetyAttributesFromVertex(fromPositivePromptSafetyAttributes));
    }
    return toObject;
}
function generateVideosConfigToMldev(fromObject, parentObject, rootObject) {
    const toObject = {};
    const fromNumberOfVideos = getValueByPath(fromObject, [
        'numberOfVideos',
    ]);
    if (parentObject !== undefined && fromNumberOfVideos != null) {
        setValueByPath(parentObject, ['parameters', 'sampleCount'], fromNumberOfVideos);
    }
    if (getValueByPath(fromObject, ['outputGcsUri']) !== undefined) {
        throw new Error('outputGcsUri parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['fps']) !== undefined) {
        throw new Error('fps parameter is not supported in Gemini API.');
    }
    const fromDurationSeconds = getValueByPath(fromObject, [
        'durationSeconds',
    ]);
    if (parentObject !== undefined && fromDurationSeconds != null) {
        setValueByPath(parentObject, ['parameters', 'durationSeconds'], fromDurationSeconds);
    }
    if (getValueByPath(fromObject, ['seed']) !== undefined) {
        throw new Error('seed parameter is not supported in Gemini API.');
    }
    const fromAspectRatio = getValueByPath(fromObject, ['aspectRatio']);
    if (parentObject !== undefined && fromAspectRatio != null) {
        setValueByPath(parentObject, ['parameters', 'aspectRatio'], fromAspectRatio);
    }
    const fromResolution = getValueByPath(fromObject, ['resolution']);
    if (parentObject !== undefined && fromResolution != null) {
        setValueByPath(parentObject, ['parameters', 'resolution'], fromResolution);
    }
    const fromPersonGeneration = getValueByPath(fromObject, [
        'personGeneration',
    ]);
    if (parentObject !== undefined && fromPersonGeneration != null) {
        setValueByPath(parentObject, ['parameters', 'personGeneration'], fromPersonGeneration);
    }
    if (getValueByPath(fromObject, ['pubsubTopic']) !== undefined) {
        throw new Error('pubsubTopic parameter is not supported in Gemini API.');
    }
    const fromNegativePrompt = getValueByPath(fromObject, [
        'negativePrompt',
    ]);
    if (parentObject !== undefined && fromNegativePrompt != null) {
        setValueByPath(parentObject, ['parameters', 'negativePrompt'], fromNegativePrompt);
    }
    const fromEnhancePrompt = getValueByPath(fromObject, [
        'enhancePrompt',
    ]);
    if (parentObject !== undefined && fromEnhancePrompt != null) {
        setValueByPath(parentObject, ['parameters', 'enhancePrompt'], fromEnhancePrompt);
    }
    if (getValueByPath(fromObject, ['generateAudio']) !== undefined) {
        throw new Error('generateAudio parameter is not supported in Gemini API.');
    }
    const fromLastFrame = getValueByPath(fromObject, ['lastFrame']);
    if (parentObject !== undefined && fromLastFrame != null) {
        setValueByPath(parentObject, ['instances[0]', 'lastFrame'], imageToMldev(fromLastFrame));
    }
    const fromReferenceImages = getValueByPath(fromObject, [
        'referenceImages',
    ]);
    if (parentObject !== undefined && fromReferenceImages != null) {
        let transformedList = fromReferenceImages;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return videoGenerationReferenceImageToMldev(item);
            });
        }
        setValueByPath(parentObject, ['instances[0]', 'referenceImages'], transformedList);
    }
    if (getValueByPath(fromObject, ['mask']) !== undefined) {
        throw new Error('mask parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['compressionQuality']) !== undefined) {
        throw new Error('compressionQuality parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['labels']) !== undefined) {
        throw new Error('labels parameter is not supported in Gemini API.');
    }
    return toObject;
}
function generateVideosConfigToVertex(fromObject, parentObject, rootObject) {
    const toObject = {};
    const fromNumberOfVideos = getValueByPath(fromObject, [
        'numberOfVideos',
    ]);
    if (parentObject !== undefined && fromNumberOfVideos != null) {
        setValueByPath(parentObject, ['parameters', 'sampleCount'], fromNumberOfVideos);
    }
    const fromOutputGcsUri = getValueByPath(fromObject, ['outputGcsUri']);
    if (parentObject !== undefined && fromOutputGcsUri != null) {
        setValueByPath(parentObject, ['parameters', 'storageUri'], fromOutputGcsUri);
    }
    const fromFps = getValueByPath(fromObject, ['fps']);
    if (parentObject !== undefined && fromFps != null) {
        setValueByPath(parentObject, ['parameters', 'fps'], fromFps);
    }
    const fromDurationSeconds = getValueByPath(fromObject, [
        'durationSeconds',
    ]);
    if (parentObject !== undefined && fromDurationSeconds != null) {
        setValueByPath(parentObject, ['parameters', 'durationSeconds'], fromDurationSeconds);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (parentObject !== undefined && fromSeed != null) {
        setValueByPath(parentObject, ['parameters', 'seed'], fromSeed);
    }
    const fromAspectRatio = getValueByPath(fromObject, ['aspectRatio']);
    if (parentObject !== undefined && fromAspectRatio != null) {
        setValueByPath(parentObject, ['parameters', 'aspectRatio'], fromAspectRatio);
    }
    const fromResolution = getValueByPath(fromObject, ['resolution']);
    if (parentObject !== undefined && fromResolution != null) {
        setValueByPath(parentObject, ['parameters', 'resolution'], fromResolution);
    }
    const fromPersonGeneration = getValueByPath(fromObject, [
        'personGeneration',
    ]);
    if (parentObject !== undefined && fromPersonGeneration != null) {
        setValueByPath(parentObject, ['parameters', 'personGeneration'], fromPersonGeneration);
    }
    const fromPubsubTopic = getValueByPath(fromObject, ['pubsubTopic']);
    if (parentObject !== undefined && fromPubsubTopic != null) {
        setValueByPath(parentObject, ['parameters', 'pubsubTopic'], fromPubsubTopic);
    }
    const fromNegativePrompt = getValueByPath(fromObject, [
        'negativePrompt',
    ]);
    if (parentObject !== undefined && fromNegativePrompt != null) {
        setValueByPath(parentObject, ['parameters', 'negativePrompt'], fromNegativePrompt);
    }
    const fromEnhancePrompt = getValueByPath(fromObject, [
        'enhancePrompt',
    ]);
    if (parentObject !== undefined && fromEnhancePrompt != null) {
        setValueByPath(parentObject, ['parameters', 'enhancePrompt'], fromEnhancePrompt);
    }
    const fromGenerateAudio = getValueByPath(fromObject, [
        'generateAudio',
    ]);
    if (parentObject !== undefined && fromGenerateAudio != null) {
        setValueByPath(parentObject, ['parameters', 'generateAudio'], fromGenerateAudio);
    }
    const fromLastFrame = getValueByPath(fromObject, ['lastFrame']);
    if (parentObject !== undefined && fromLastFrame != null) {
        setValueByPath(parentObject, ['instances[0]', 'lastFrame'], imageToVertex(fromLastFrame));
    }
    const fromReferenceImages = getValueByPath(fromObject, [
        'referenceImages',
    ]);
    if (parentObject !== undefined && fromReferenceImages != null) {
        let transformedList = fromReferenceImages;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return videoGenerationReferenceImageToVertex(item);
            });
        }
        setValueByPath(parentObject, ['instances[0]', 'referenceImages'], transformedList);
    }
    const fromMask = getValueByPath(fromObject, ['mask']);
    if (parentObject !== undefined && fromMask != null) {
        setValueByPath(parentObject, ['instances[0]', 'mask'], videoGenerationMaskToVertex(fromMask));
    }
    const fromCompressionQuality = getValueByPath(fromObject, [
        'compressionQuality',
    ]);
    if (parentObject !== undefined && fromCompressionQuality != null) {
        setValueByPath(parentObject, ['parameters', 'compressionQuality'], fromCompressionQuality);
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (parentObject !== undefined && fromLabels != null) {
        setValueByPath(parentObject, ['labels'], fromLabels);
    }
    return toObject;
}
function generateVideosOperationFromMldev(fromObject, rootObject) {
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
    const fromResponse = getValueByPath(fromObject, [
        'response',
        'generateVideoResponse',
    ]);
    if (fromResponse != null) {
        setValueByPath(toObject, ['response'], generateVideosResponseFromMldev(fromResponse));
    }
    return toObject;
}
function generateVideosOperationFromVertex(fromObject, rootObject) {
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
        setValueByPath(toObject, ['response'], generateVideosResponseFromVertex(fromResponse));
    }
    return toObject;
}
function generateVideosParametersToMldev(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromPrompt = getValueByPath(fromObject, ['prompt']);
    if (fromPrompt != null) {
        setValueByPath(toObject, ['instances[0]', 'prompt'], fromPrompt);
    }
    const fromImage = getValueByPath(fromObject, ['image']);
    if (fromImage != null) {
        setValueByPath(toObject, ['instances[0]', 'image'], imageToMldev(fromImage));
    }
    const fromVideo = getValueByPath(fromObject, ['video']);
    if (fromVideo != null) {
        setValueByPath(toObject, ['instances[0]', 'video'], videoToMldev(fromVideo));
    }
    const fromSource = getValueByPath(fromObject, ['source']);
    if (fromSource != null) {
        generateVideosSourceToMldev(fromSource, toObject);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        generateVideosConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function generateVideosParametersToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromPrompt = getValueByPath(fromObject, ['prompt']);
    if (fromPrompt != null) {
        setValueByPath(toObject, ['instances[0]', 'prompt'], fromPrompt);
    }
    const fromImage = getValueByPath(fromObject, ['image']);
    if (fromImage != null) {
        setValueByPath(toObject, ['instances[0]', 'image'], imageToVertex(fromImage));
    }
    const fromVideo = getValueByPath(fromObject, ['video']);
    if (fromVideo != null) {
        setValueByPath(toObject, ['instances[0]', 'video'], videoToVertex(fromVideo));
    }
    const fromSource = getValueByPath(fromObject, ['source']);
    if (fromSource != null) {
        generateVideosSourceToVertex(fromSource, toObject);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        generateVideosConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function generateVideosResponseFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromGeneratedVideos = getValueByPath(fromObject, [
        'generatedSamples',
    ]);
    if (fromGeneratedVideos != null) {
        let transformedList = fromGeneratedVideos;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedVideoFromMldev(item);
            });
        }
        setValueByPath(toObject, ['generatedVideos'], transformedList);
    }
    const fromRaiMediaFilteredCount = getValueByPath(fromObject, [
        'raiMediaFilteredCount',
    ]);
    if (fromRaiMediaFilteredCount != null) {
        setValueByPath(toObject, ['raiMediaFilteredCount'], fromRaiMediaFilteredCount);
    }
    const fromRaiMediaFilteredReasons = getValueByPath(fromObject, [
        'raiMediaFilteredReasons',
    ]);
    if (fromRaiMediaFilteredReasons != null) {
        setValueByPath(toObject, ['raiMediaFilteredReasons'], fromRaiMediaFilteredReasons);
    }
    return toObject;
}
function generateVideosResponseFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromGeneratedVideos = getValueByPath(fromObject, ['videos']);
    if (fromGeneratedVideos != null) {
        let transformedList = fromGeneratedVideos;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedVideoFromVertex(item);
            });
        }
        setValueByPath(toObject, ['generatedVideos'], transformedList);
    }
    const fromRaiMediaFilteredCount = getValueByPath(fromObject, [
        'raiMediaFilteredCount',
    ]);
    if (fromRaiMediaFilteredCount != null) {
        setValueByPath(toObject, ['raiMediaFilteredCount'], fromRaiMediaFilteredCount);
    }
    const fromRaiMediaFilteredReasons = getValueByPath(fromObject, [
        'raiMediaFilteredReasons',
    ]);
    if (fromRaiMediaFilteredReasons != null) {
        setValueByPath(toObject, ['raiMediaFilteredReasons'], fromRaiMediaFilteredReasons);
    }
    return toObject;
}
function generateVideosSourceToMldev(fromObject, parentObject, rootObject) {
    const toObject = {};
    const fromPrompt = getValueByPath(fromObject, ['prompt']);
    if (parentObject !== undefined && fromPrompt != null) {
        setValueByPath(parentObject, ['instances[0]', 'prompt'], fromPrompt);
    }
    const fromImage = getValueByPath(fromObject, ['image']);
    if (parentObject !== undefined && fromImage != null) {
        setValueByPath(parentObject, ['instances[0]', 'image'], imageToMldev(fromImage));
    }
    const fromVideo = getValueByPath(fromObject, ['video']);
    if (parentObject !== undefined && fromVideo != null) {
        setValueByPath(parentObject, ['instances[0]', 'video'], videoToMldev(fromVideo));
    }
    return toObject;
}
function generateVideosSourceToVertex(fromObject, parentObject, rootObject) {
    const toObject = {};
    const fromPrompt = getValueByPath(fromObject, ['prompt']);
    if (parentObject !== undefined && fromPrompt != null) {
        setValueByPath(parentObject, ['instances[0]', 'prompt'], fromPrompt);
    }
    const fromImage = getValueByPath(fromObject, ['image']);
    if (parentObject !== undefined && fromImage != null) {
        setValueByPath(parentObject, ['instances[0]', 'image'], imageToVertex(fromImage));
    }
    const fromVideo = getValueByPath(fromObject, ['video']);
    if (parentObject !== undefined && fromVideo != null) {
        setValueByPath(parentObject, ['instances[0]', 'video'], videoToVertex(fromVideo));
    }
    return toObject;
}
function generatedImageFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromImage = getValueByPath(fromObject, ['_self']);
    if (fromImage != null) {
        setValueByPath(toObject, ['image'], imageFromMldev(fromImage));
    }
    const fromRaiFilteredReason = getValueByPath(fromObject, [
        'raiFilteredReason',
    ]);
    if (fromRaiFilteredReason != null) {
        setValueByPath(toObject, ['raiFilteredReason'], fromRaiFilteredReason);
    }
    const fromSafetyAttributes = getValueByPath(fromObject, ['_self']);
    if (fromSafetyAttributes != null) {
        setValueByPath(toObject, ['safetyAttributes'], safetyAttributesFromMldev(fromSafetyAttributes));
    }
    return toObject;
}
function generatedImageFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromImage = getValueByPath(fromObject, ['_self']);
    if (fromImage != null) {
        setValueByPath(toObject, ['image'], imageFromVertex(fromImage));
    }
    const fromRaiFilteredReason = getValueByPath(fromObject, [
        'raiFilteredReason',
    ]);
    if (fromRaiFilteredReason != null) {
        setValueByPath(toObject, ['raiFilteredReason'], fromRaiFilteredReason);
    }
    const fromSafetyAttributes = getValueByPath(fromObject, ['_self']);
    if (fromSafetyAttributes != null) {
        setValueByPath(toObject, ['safetyAttributes'], safetyAttributesFromVertex(fromSafetyAttributes));
    }
    const fromEnhancedPrompt = getValueByPath(fromObject, ['prompt']);
    if (fromEnhancedPrompt != null) {
        setValueByPath(toObject, ['enhancedPrompt'], fromEnhancedPrompt);
    }
    return toObject;
}
function generatedImageMaskFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromMask = getValueByPath(fromObject, ['_self']);
    if (fromMask != null) {
        setValueByPath(toObject, ['mask'], imageFromVertex(fromMask));
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (fromLabels != null) {
        let transformedList = fromLabels;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['labels'], transformedList);
    }
    return toObject;
}
function generatedVideoFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromVideo = getValueByPath(fromObject, ['video']);
    if (fromVideo != null) {
        setValueByPath(toObject, ['video'], videoFromMldev(fromVideo));
    }
    return toObject;
}
function generatedVideoFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromVideo = getValueByPath(fromObject, ['_self']);
    if (fromVideo != null) {
        setValueByPath(toObject, ['video'], videoFromVertex(fromVideo));
    }
    return toObject;
}
function generationConfigToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromModelSelectionConfig = getValueByPath(fromObject, [
        'modelSelectionConfig',
    ]);
    if (fromModelSelectionConfig != null) {
        setValueByPath(toObject, ['modelConfig'], fromModelSelectionConfig);
    }
    const fromResponseJsonSchema = getValueByPath(fromObject, [
        'responseJsonSchema',
    ]);
    if (fromResponseJsonSchema != null) {
        setValueByPath(toObject, ['responseJsonSchema'], fromResponseJsonSchema);
    }
    const fromAudioTimestamp = getValueByPath(fromObject, [
        'audioTimestamp',
    ]);
    if (fromAudioTimestamp != null) {
        setValueByPath(toObject, ['audioTimestamp'], fromAudioTimestamp);
    }
    const fromCandidateCount = getValueByPath(fromObject, [
        'candidateCount',
    ]);
    if (fromCandidateCount != null) {
        setValueByPath(toObject, ['candidateCount'], fromCandidateCount);
    }
    const fromEnableAffectiveDialog = getValueByPath(fromObject, [
        'enableAffectiveDialog',
    ]);
    if (fromEnableAffectiveDialog != null) {
        setValueByPath(toObject, ['enableAffectiveDialog'], fromEnableAffectiveDialog);
    }
    const fromFrequencyPenalty = getValueByPath(fromObject, [
        'frequencyPenalty',
    ]);
    if (fromFrequencyPenalty != null) {
        setValueByPath(toObject, ['frequencyPenalty'], fromFrequencyPenalty);
    }
    const fromLogprobs = getValueByPath(fromObject, ['logprobs']);
    if (fromLogprobs != null) {
        setValueByPath(toObject, ['logprobs'], fromLogprobs);
    }
    const fromMaxOutputTokens = getValueByPath(fromObject, [
        'maxOutputTokens',
    ]);
    if (fromMaxOutputTokens != null) {
        setValueByPath(toObject, ['maxOutputTokens'], fromMaxOutputTokens);
    }
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromPresencePenalty = getValueByPath(fromObject, [
        'presencePenalty',
    ]);
    if (fromPresencePenalty != null) {
        setValueByPath(toObject, ['presencePenalty'], fromPresencePenalty);
    }
    const fromResponseLogprobs = getValueByPath(fromObject, [
        'responseLogprobs',
    ]);
    if (fromResponseLogprobs != null) {
        setValueByPath(toObject, ['responseLogprobs'], fromResponseLogprobs);
    }
    const fromResponseMimeType = getValueByPath(fromObject, [
        'responseMimeType',
    ]);
    if (fromResponseMimeType != null) {
        setValueByPath(toObject, ['responseMimeType'], fromResponseMimeType);
    }
    const fromResponseModalities = getValueByPath(fromObject, [
        'responseModalities',
    ]);
    if (fromResponseModalities != null) {
        setValueByPath(toObject, ['responseModalities'], fromResponseModalities);
    }
    const fromResponseSchema = getValueByPath(fromObject, [
        'responseSchema',
    ]);
    if (fromResponseSchema != null) {
        setValueByPath(toObject, ['responseSchema'], fromResponseSchema);
    }
    const fromRoutingConfig = getValueByPath(fromObject, [
        'routingConfig',
    ]);
    if (fromRoutingConfig != null) {
        setValueByPath(toObject, ['routingConfig'], fromRoutingConfig);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (fromSeed != null) {
        setValueByPath(toObject, ['seed'], fromSeed);
    }
    const fromSpeechConfig = getValueByPath(fromObject, ['speechConfig']);
    if (fromSpeechConfig != null) {
        setValueByPath(toObject, ['speechConfig'], speechConfigToVertex(fromSpeechConfig));
    }
    const fromStopSequences = getValueByPath(fromObject, [
        'stopSequences',
    ]);
    if (fromStopSequences != null) {
        setValueByPath(toObject, ['stopSequences'], fromStopSequences);
    }
    const fromTemperature = getValueByPath(fromObject, ['temperature']);
    if (fromTemperature != null) {
        setValueByPath(toObject, ['temperature'], fromTemperature);
    }
    const fromThinkingConfig = getValueByPath(fromObject, [
        'thinkingConfig',
    ]);
    if (fromThinkingConfig != null) {
        setValueByPath(toObject, ['thinkingConfig'], fromThinkingConfig);
    }
    const fromTopK = getValueByPath(fromObject, ['topK']);
    if (fromTopK != null) {
        setValueByPath(toObject, ['topK'], fromTopK);
    }
    const fromTopP = getValueByPath(fromObject, ['topP']);
    if (fromTopP != null) {
        setValueByPath(toObject, ['topP'], fromTopP);
    }
    if (getValueByPath(fromObject, ['enableEnhancedCivicAnswers']) !==
        undefined) {
        throw new Error('enableEnhancedCivicAnswers parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function getModelParametersToMldev(apiClient, fromObject, _rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'name'], tModel(apiClient, fromModel));
    }
    return toObject;
}
function getModelParametersToVertex(apiClient, fromObject, _rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'name'], tModel(apiClient, fromModel));
    }
    return toObject;
}
function googleMapsToMldev$1(fromObject, rootObject) {
    const toObject = {};
    const fromAuthConfig = getValueByPath(fromObject, ['authConfig']);
    if (fromAuthConfig != null) {
        setValueByPath(toObject, ['authConfig'], authConfigToMldev$1(fromAuthConfig));
    }
    const fromEnableWidget = getValueByPath(fromObject, ['enableWidget']);
    if (fromEnableWidget != null) {
        setValueByPath(toObject, ['enableWidget'], fromEnableWidget);
    }
    return toObject;
}
function googleSearchToMldev$1(fromObject, _rootObject) {
    const toObject = {};
    const fromSearchTypes = getValueByPath(fromObject, ['searchTypes']);
    if (fromSearchTypes != null) {
        setValueByPath(toObject, ['searchTypes'], fromSearchTypes);
    }
    if (getValueByPath(fromObject, ['blockingConfidence']) !== undefined) {
        throw new Error('blockingConfidence parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['excludeDomains']) !== undefined) {
        throw new Error('excludeDomains parameter is not supported in Gemini API.');
    }
    const fromTimeRangeFilter = getValueByPath(fromObject, [
        'timeRangeFilter',
    ]);
    if (fromTimeRangeFilter != null) {
        setValueByPath(toObject, ['timeRangeFilter'], fromTimeRangeFilter);
    }
    return toObject;
}
function imageConfigToMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromAspectRatio = getValueByPath(fromObject, ['aspectRatio']);
    if (fromAspectRatio != null) {
        setValueByPath(toObject, ['aspectRatio'], fromAspectRatio);
    }
    const fromImageSize = getValueByPath(fromObject, ['imageSize']);
    if (fromImageSize != null) {
        setValueByPath(toObject, ['imageSize'], fromImageSize);
    }
    if (getValueByPath(fromObject, ['personGeneration']) !== undefined) {
        throw new Error('personGeneration parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['prominentPeople']) !== undefined) {
        throw new Error('prominentPeople parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['outputMimeType']) !== undefined) {
        throw new Error('outputMimeType parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['outputCompressionQuality']) !==
        undefined) {
        throw new Error('outputCompressionQuality parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['imageOutputOptions']) !== undefined) {
        throw new Error('imageOutputOptions parameter is not supported in Gemini API.');
    }
    return toObject;
}
function imageConfigToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromAspectRatio = getValueByPath(fromObject, ['aspectRatio']);
    if (fromAspectRatio != null) {
        setValueByPath(toObject, ['aspectRatio'], fromAspectRatio);
    }
    const fromImageSize = getValueByPath(fromObject, ['imageSize']);
    if (fromImageSize != null) {
        setValueByPath(toObject, ['imageSize'], fromImageSize);
    }
    const fromPersonGeneration = getValueByPath(fromObject, [
        'personGeneration',
    ]);
    if (fromPersonGeneration != null) {
        setValueByPath(toObject, ['personGeneration'], fromPersonGeneration);
    }
    const fromProminentPeople = getValueByPath(fromObject, [
        'prominentPeople',
    ]);
    if (fromProminentPeople != null) {
        setValueByPath(toObject, ['prominentPeople'], fromProminentPeople);
    }
    const fromOutputMimeType = getValueByPath(fromObject, [
        'outputMimeType',
    ]);
    if (fromOutputMimeType != null) {
        setValueByPath(toObject, ['imageOutputOptions', 'mimeType'], fromOutputMimeType);
    }
    const fromOutputCompressionQuality = getValueByPath(fromObject, [
        'outputCompressionQuality',
    ]);
    if (fromOutputCompressionQuality != null) {
        setValueByPath(toObject, ['imageOutputOptions', 'compressionQuality'], fromOutputCompressionQuality);
    }
    const fromImageOutputOptions = getValueByPath(fromObject, [
        'imageOutputOptions',
    ]);
    if (fromImageOutputOptions != null) {
        setValueByPath(toObject, ['imageOutputOptions'], fromImageOutputOptions);
    }
    return toObject;
}
function imageFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromImageBytes = getValueByPath(fromObject, [
        'bytesBase64Encoded',
    ]);
    if (fromImageBytes != null) {
        setValueByPath(toObject, ['imageBytes'], tBytes(fromImageBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function imageFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromGcsUri = getValueByPath(fromObject, ['gcsUri']);
    if (fromGcsUri != null) {
        setValueByPath(toObject, ['gcsUri'], fromGcsUri);
    }
    const fromImageBytes = getValueByPath(fromObject, [
        'bytesBase64Encoded',
    ]);
    if (fromImageBytes != null) {
        setValueByPath(toObject, ['imageBytes'], tBytes(fromImageBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function imageToMldev(fromObject, _rootObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['gcsUri']) !== undefined) {
        throw new Error('gcsUri parameter is not supported in Gemini API.');
    }
    const fromImageBytes = getValueByPath(fromObject, ['imageBytes']);
    if (fromImageBytes != null) {
        setValueByPath(toObject, ['bytesBase64Encoded'], tBytes(fromImageBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function imageToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromGcsUri = getValueByPath(fromObject, ['gcsUri']);
    if (fromGcsUri != null) {
        setValueByPath(toObject, ['gcsUri'], fromGcsUri);
    }
    const fromImageBytes = getValueByPath(fromObject, ['imageBytes']);
    if (fromImageBytes != null) {
        setValueByPath(toObject, ['bytesBase64Encoded'], tBytes(fromImageBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function listModelsConfigToMldev(apiClient, fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    const fromFilter = getValueByPath(fromObject, ['filter']);
    if (parentObject !== undefined && fromFilter != null) {
        setValueByPath(parentObject, ['_query', 'filter'], fromFilter);
    }
    const fromQueryBase = getValueByPath(fromObject, ['queryBase']);
    if (parentObject !== undefined && fromQueryBase != null) {
        setValueByPath(parentObject, ['_url', 'models_url'], tModelsUrl(apiClient, fromQueryBase));
    }
    return toObject;
}
function listModelsConfigToVertex(apiClient, fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    const fromFilter = getValueByPath(fromObject, ['filter']);
    if (parentObject !== undefined && fromFilter != null) {
        setValueByPath(parentObject, ['_query', 'filter'], fromFilter);
    }
    const fromQueryBase = getValueByPath(fromObject, ['queryBase']);
    if (parentObject !== undefined && fromQueryBase != null) {
        setValueByPath(parentObject, ['_url', 'models_url'], tModelsUrl(apiClient, fromQueryBase));
    }
    return toObject;
}
function listModelsParametersToMldev(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listModelsConfigToMldev(apiClient, fromConfig, toObject);
    }
    return toObject;
}
function listModelsParametersToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listModelsConfigToVertex(apiClient, fromConfig, toObject);
    }
    return toObject;
}
function listModelsResponseFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromModels = getValueByPath(fromObject, ['_self']);
    if (fromModels != null) {
        let transformedList = tExtractModels(fromModels);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return modelFromMldev(item);
            });
        }
        setValueByPath(toObject, ['models'], transformedList);
    }
    return toObject;
}
function listModelsResponseFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromModels = getValueByPath(fromObject, ['_self']);
    if (fromModels != null) {
        let transformedList = tExtractModels(fromModels);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return modelFromVertex(item);
            });
        }
        setValueByPath(toObject, ['models'], transformedList);
    }
    return toObject;
}
function maskReferenceConfigToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromMaskMode = getValueByPath(fromObject, ['maskMode']);
    if (fromMaskMode != null) {
        setValueByPath(toObject, ['maskMode'], fromMaskMode);
    }
    const fromSegmentationClasses = getValueByPath(fromObject, [
        'segmentationClasses',
    ]);
    if (fromSegmentationClasses != null) {
        setValueByPath(toObject, ['maskClasses'], fromSegmentationClasses);
    }
    const fromMaskDilation = getValueByPath(fromObject, ['maskDilation']);
    if (fromMaskDilation != null) {
        setValueByPath(toObject, ['dilation'], fromMaskDilation);
    }
    return toObject;
}
function modelFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (fromDisplayName != null) {
        setValueByPath(toObject, ['displayName'], fromDisplayName);
    }
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (fromDescription != null) {
        setValueByPath(toObject, ['description'], fromDescription);
    }
    const fromVersion = getValueByPath(fromObject, ['version']);
    if (fromVersion != null) {
        setValueByPath(toObject, ['version'], fromVersion);
    }
    const fromTunedModelInfo = getValueByPath(fromObject, ['_self']);
    if (fromTunedModelInfo != null) {
        setValueByPath(toObject, ['tunedModelInfo'], tunedModelInfoFromMldev(fromTunedModelInfo));
    }
    const fromInputTokenLimit = getValueByPath(fromObject, [
        'inputTokenLimit',
    ]);
    if (fromInputTokenLimit != null) {
        setValueByPath(toObject, ['inputTokenLimit'], fromInputTokenLimit);
    }
    const fromOutputTokenLimit = getValueByPath(fromObject, [
        'outputTokenLimit',
    ]);
    if (fromOutputTokenLimit != null) {
        setValueByPath(toObject, ['outputTokenLimit'], fromOutputTokenLimit);
    }
    const fromSupportedActions = getValueByPath(fromObject, [
        'supportedGenerationMethods',
    ]);
    if (fromSupportedActions != null) {
        setValueByPath(toObject, ['supportedActions'], fromSupportedActions);
    }
    const fromTemperature = getValueByPath(fromObject, ['temperature']);
    if (fromTemperature != null) {
        setValueByPath(toObject, ['temperature'], fromTemperature);
    }
    const fromMaxTemperature = getValueByPath(fromObject, [
        'maxTemperature',
    ]);
    if (fromMaxTemperature != null) {
        setValueByPath(toObject, ['maxTemperature'], fromMaxTemperature);
    }
    const fromTopP = getValueByPath(fromObject, ['topP']);
    if (fromTopP != null) {
        setValueByPath(toObject, ['topP'], fromTopP);
    }
    const fromTopK = getValueByPath(fromObject, ['topK']);
    if (fromTopK != null) {
        setValueByPath(toObject, ['topK'], fromTopK);
    }
    const fromThinking = getValueByPath(fromObject, ['thinking']);
    if (fromThinking != null) {
        setValueByPath(toObject, ['thinking'], fromThinking);
    }
    return toObject;
}
function modelFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (fromDisplayName != null) {
        setValueByPath(toObject, ['displayName'], fromDisplayName);
    }
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (fromDescription != null) {
        setValueByPath(toObject, ['description'], fromDescription);
    }
    const fromVersion = getValueByPath(fromObject, ['versionId']);
    if (fromVersion != null) {
        setValueByPath(toObject, ['version'], fromVersion);
    }
    const fromEndpoints = getValueByPath(fromObject, ['deployedModels']);
    if (fromEndpoints != null) {
        let transformedList = fromEndpoints;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return endpointFromVertex(item);
            });
        }
        setValueByPath(toObject, ['endpoints'], transformedList);
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (fromLabels != null) {
        setValueByPath(toObject, ['labels'], fromLabels);
    }
    const fromTunedModelInfo = getValueByPath(fromObject, ['_self']);
    if (fromTunedModelInfo != null) {
        setValueByPath(toObject, ['tunedModelInfo'], tunedModelInfoFromVertex(fromTunedModelInfo));
    }
    const fromDefaultCheckpointId = getValueByPath(fromObject, [
        'defaultCheckpointId',
    ]);
    if (fromDefaultCheckpointId != null) {
        setValueByPath(toObject, ['defaultCheckpointId'], fromDefaultCheckpointId);
    }
    const fromCheckpoints = getValueByPath(fromObject, ['checkpoints']);
    if (fromCheckpoints != null) {
        let transformedList = fromCheckpoints;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['checkpoints'], transformedList);
    }
    return toObject;
}
function multiSpeakerVoiceConfigToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromSpeakerVoiceConfigs = getValueByPath(fromObject, [
        'speakerVoiceConfigs',
    ]);
    if (fromSpeakerVoiceConfigs != null) {
        let transformedList = fromSpeakerVoiceConfigs;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return speakerVoiceConfigToVertex(item);
            });
        }
        setValueByPath(toObject, ['speakerVoiceConfigs'], transformedList);
    }
    return toObject;
}
function partToMldev$1(fromObject, rootObject) {
    const toObject = {};
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromCodeExecutionResult = getValueByPath(fromObject, [
        'codeExecutionResult',
    ]);
    if (fromCodeExecutionResult != null) {
        setValueByPath(toObject, ['codeExecutionResult'], fromCodeExecutionResult);
    }
    const fromExecutableCode = getValueByPath(fromObject, [
        'executableCode',
    ]);
    if (fromExecutableCode != null) {
        setValueByPath(toObject, ['executableCode'], fromExecutableCode);
    }
    const fromFileData = getValueByPath(fromObject, ['fileData']);
    if (fromFileData != null) {
        setValueByPath(toObject, ['fileData'], fileDataToMldev$1(fromFileData));
    }
    const fromFunctionCall = getValueByPath(fromObject, ['functionCall']);
    if (fromFunctionCall != null) {
        setValueByPath(toObject, ['functionCall'], functionCallToMldev$1(fromFunctionCall));
    }
    const fromFunctionResponse = getValueByPath(fromObject, [
        'functionResponse',
    ]);
    if (fromFunctionResponse != null) {
        setValueByPath(toObject, ['functionResponse'], fromFunctionResponse);
    }
    const fromInlineData = getValueByPath(fromObject, ['inlineData']);
    if (fromInlineData != null) {
        setValueByPath(toObject, ['inlineData'], blobToMldev$1(fromInlineData));
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromThought = getValueByPath(fromObject, ['thought']);
    if (fromThought != null) {
        setValueByPath(toObject, ['thought'], fromThought);
    }
    const fromThoughtSignature = getValueByPath(fromObject, [
        'thoughtSignature',
    ]);
    if (fromThoughtSignature != null) {
        setValueByPath(toObject, ['thoughtSignature'], fromThoughtSignature);
    }
    const fromVideoMetadata = getValueByPath(fromObject, [
        'videoMetadata',
    ]);
    if (fromVideoMetadata != null) {
        setValueByPath(toObject, ['videoMetadata'], fromVideoMetadata);
    }
    const fromToolCall = getValueByPath(fromObject, ['toolCall']);
    if (fromToolCall != null) {
        setValueByPath(toObject, ['toolCall'], fromToolCall);
    }
    const fromToolResponse = getValueByPath(fromObject, ['toolResponse']);
    if (fromToolResponse != null) {
        setValueByPath(toObject, ['toolResponse'], fromToolResponse);
    }
    const fromPartMetadata = getValueByPath(fromObject, ['partMetadata']);
    if (fromPartMetadata != null) {
        setValueByPath(toObject, ['partMetadata'], fromPartMetadata);
    }
    return toObject;
}
function partToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromCodeExecutionResult = getValueByPath(fromObject, [
        'codeExecutionResult',
    ]);
    if (fromCodeExecutionResult != null) {
        setValueByPath(toObject, ['codeExecutionResult'], fromCodeExecutionResult);
    }
    const fromExecutableCode = getValueByPath(fromObject, [
        'executableCode',
    ]);
    if (fromExecutableCode != null) {
        setValueByPath(toObject, ['executableCode'], fromExecutableCode);
    }
    const fromFileData = getValueByPath(fromObject, ['fileData']);
    if (fromFileData != null) {
        setValueByPath(toObject, ['fileData'], fromFileData);
    }
    const fromFunctionCall = getValueByPath(fromObject, ['functionCall']);
    if (fromFunctionCall != null) {
        setValueByPath(toObject, ['functionCall'], fromFunctionCall);
    }
    const fromFunctionResponse = getValueByPath(fromObject, [
        'functionResponse',
    ]);
    if (fromFunctionResponse != null) {
        setValueByPath(toObject, ['functionResponse'], fromFunctionResponse);
    }
    const fromInlineData = getValueByPath(fromObject, ['inlineData']);
    if (fromInlineData != null) {
        setValueByPath(toObject, ['inlineData'], fromInlineData);
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromThought = getValueByPath(fromObject, ['thought']);
    if (fromThought != null) {
        setValueByPath(toObject, ['thought'], fromThought);
    }
    const fromThoughtSignature = getValueByPath(fromObject, [
        'thoughtSignature',
    ]);
    if (fromThoughtSignature != null) {
        setValueByPath(toObject, ['thoughtSignature'], fromThoughtSignature);
    }
    const fromVideoMetadata = getValueByPath(fromObject, [
        'videoMetadata',
    ]);
    if (fromVideoMetadata != null) {
        setValueByPath(toObject, ['videoMetadata'], fromVideoMetadata);
    }
    if (getValueByPath(fromObject, ['toolCall']) !== undefined) {
        throw new Error('toolCall parameter is not supported in Vertex AI.');
    }
    if (getValueByPath(fromObject, ['toolResponse']) !== undefined) {
        throw new Error('toolResponse parameter is not supported in Vertex AI.');
    }
    if (getValueByPath(fromObject, ['partMetadata']) !== undefined) {
        throw new Error('partMetadata parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function productImageToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromProductImage = getValueByPath(fromObject, ['productImage']);
    if (fromProductImage != null) {
        setValueByPath(toObject, ['image'], imageToVertex(fromProductImage));
    }
    return toObject;
}
function recontextImageConfigToVertex(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromNumberOfImages = getValueByPath(fromObject, [
        'numberOfImages',
    ]);
    if (parentObject !== undefined && fromNumberOfImages != null) {
        setValueByPath(parentObject, ['parameters', 'sampleCount'], fromNumberOfImages);
    }
    const fromBaseSteps = getValueByPath(fromObject, ['baseSteps']);
    if (parentObject !== undefined && fromBaseSteps != null) {
        setValueByPath(parentObject, ['parameters', 'baseSteps'], fromBaseSteps);
    }
    const fromOutputGcsUri = getValueByPath(fromObject, ['outputGcsUri']);
    if (parentObject !== undefined && fromOutputGcsUri != null) {
        setValueByPath(parentObject, ['parameters', 'storageUri'], fromOutputGcsUri);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (parentObject !== undefined && fromSeed != null) {
        setValueByPath(parentObject, ['parameters', 'seed'], fromSeed);
    }
    const fromSafetyFilterLevel = getValueByPath(fromObject, [
        'safetyFilterLevel',
    ]);
    if (parentObject !== undefined && fromSafetyFilterLevel != null) {
        setValueByPath(parentObject, ['parameters', 'safetySetting'], fromSafetyFilterLevel);
    }
    const fromPersonGeneration = getValueByPath(fromObject, [
        'personGeneration',
    ]);
    if (parentObject !== undefined && fromPersonGeneration != null) {
        setValueByPath(parentObject, ['parameters', 'personGeneration'], fromPersonGeneration);
    }
    const fromAddWatermark = getValueByPath(fromObject, ['addWatermark']);
    if (parentObject !== undefined && fromAddWatermark != null) {
        setValueByPath(parentObject, ['parameters', 'addWatermark'], fromAddWatermark);
    }
    const fromOutputMimeType = getValueByPath(fromObject, [
        'outputMimeType',
    ]);
    if (parentObject !== undefined && fromOutputMimeType != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'mimeType'], fromOutputMimeType);
    }
    const fromOutputCompressionQuality = getValueByPath(fromObject, [
        'outputCompressionQuality',
    ]);
    if (parentObject !== undefined && fromOutputCompressionQuality != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'compressionQuality'], fromOutputCompressionQuality);
    }
    const fromEnhancePrompt = getValueByPath(fromObject, [
        'enhancePrompt',
    ]);
    if (parentObject !== undefined && fromEnhancePrompt != null) {
        setValueByPath(parentObject, ['parameters', 'enhancePrompt'], fromEnhancePrompt);
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (parentObject !== undefined && fromLabels != null) {
        setValueByPath(parentObject, ['labels'], fromLabels);
    }
    return toObject;
}
function recontextImageParametersToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromSource = getValueByPath(fromObject, ['source']);
    if (fromSource != null) {
        recontextImageSourceToVertex(fromSource, toObject);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        recontextImageConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function recontextImageResponseFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromGeneratedImages = getValueByPath(fromObject, [
        'predictions',
    ]);
    if (fromGeneratedImages != null) {
        let transformedList = fromGeneratedImages;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedImageFromVertex(item);
            });
        }
        setValueByPath(toObject, ['generatedImages'], transformedList);
    }
    return toObject;
}
function recontextImageSourceToVertex(fromObject, parentObject, rootObject) {
    const toObject = {};
    const fromPrompt = getValueByPath(fromObject, ['prompt']);
    if (parentObject !== undefined && fromPrompt != null) {
        setValueByPath(parentObject, ['instances[0]', 'prompt'], fromPrompt);
    }
    const fromPersonImage = getValueByPath(fromObject, ['personImage']);
    if (parentObject !== undefined && fromPersonImage != null) {
        setValueByPath(parentObject, ['instances[0]', 'personImage', 'image'], imageToVertex(fromPersonImage));
    }
    const fromProductImages = getValueByPath(fromObject, [
        'productImages',
    ]);
    if (parentObject !== undefined && fromProductImages != null) {
        let transformedList = fromProductImages;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return productImageToVertex(item);
            });
        }
        setValueByPath(parentObject, ['instances[0]', 'productImages'], transformedList);
    }
    return toObject;
}
function referenceImageAPIInternalToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromReferenceImage = getValueByPath(fromObject, [
        'referenceImage',
    ]);
    if (fromReferenceImage != null) {
        setValueByPath(toObject, ['referenceImage'], imageToVertex(fromReferenceImage));
    }
    const fromReferenceId = getValueByPath(fromObject, ['referenceId']);
    if (fromReferenceId != null) {
        setValueByPath(toObject, ['referenceId'], fromReferenceId);
    }
    const fromReferenceType = getValueByPath(fromObject, [
        'referenceType',
    ]);
    if (fromReferenceType != null) {
        setValueByPath(toObject, ['referenceType'], fromReferenceType);
    }
    const fromMaskImageConfig = getValueByPath(fromObject, [
        'maskImageConfig',
    ]);
    if (fromMaskImageConfig != null) {
        setValueByPath(toObject, ['maskImageConfig'], maskReferenceConfigToVertex(fromMaskImageConfig));
    }
    const fromControlImageConfig = getValueByPath(fromObject, [
        'controlImageConfig',
    ]);
    if (fromControlImageConfig != null) {
        setValueByPath(toObject, ['controlImageConfig'], controlReferenceConfigToVertex(fromControlImageConfig));
    }
    const fromStyleImageConfig = getValueByPath(fromObject, [
        'styleImageConfig',
    ]);
    if (fromStyleImageConfig != null) {
        setValueByPath(toObject, ['styleImageConfig'], fromStyleImageConfig);
    }
    const fromSubjectImageConfig = getValueByPath(fromObject, [
        'subjectImageConfig',
    ]);
    if (fromSubjectImageConfig != null) {
        setValueByPath(toObject, ['subjectImageConfig'], fromSubjectImageConfig);
    }
    return toObject;
}
function replicatedVoiceConfigToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    const fromVoiceSampleAudio = getValueByPath(fromObject, [
        'voiceSampleAudio',
    ]);
    if (fromVoiceSampleAudio != null) {
        setValueByPath(toObject, ['voiceSampleAudio'], fromVoiceSampleAudio);
    }
    return toObject;
}
function safetyAttributesFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromCategories = getValueByPath(fromObject, [
        'safetyAttributes',
        'categories',
    ]);
    if (fromCategories != null) {
        setValueByPath(toObject, ['categories'], fromCategories);
    }
    const fromScores = getValueByPath(fromObject, [
        'safetyAttributes',
        'scores',
    ]);
    if (fromScores != null) {
        setValueByPath(toObject, ['scores'], fromScores);
    }
    const fromContentType = getValueByPath(fromObject, ['contentType']);
    if (fromContentType != null) {
        setValueByPath(toObject, ['contentType'], fromContentType);
    }
    return toObject;
}
function safetyAttributesFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromCategories = getValueByPath(fromObject, [
        'safetyAttributes',
        'categories',
    ]);
    if (fromCategories != null) {
        setValueByPath(toObject, ['categories'], fromCategories);
    }
    const fromScores = getValueByPath(fromObject, [
        'safetyAttributes',
        'scores',
    ]);
    if (fromScores != null) {
        setValueByPath(toObject, ['scores'], fromScores);
    }
    const fromContentType = getValueByPath(fromObject, ['contentType']);
    if (fromContentType != null) {
        setValueByPath(toObject, ['contentType'], fromContentType);
    }
    return toObject;
}
function safetySettingToMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromCategory = getValueByPath(fromObject, ['category']);
    if (fromCategory != null) {
        setValueByPath(toObject, ['category'], fromCategory);
    }
    if (getValueByPath(fromObject, ['method']) !== undefined) {
        throw new Error('method parameter is not supported in Gemini API.');
    }
    const fromThreshold = getValueByPath(fromObject, ['threshold']);
    if (fromThreshold != null) {
        setValueByPath(toObject, ['threshold'], fromThreshold);
    }
    return toObject;
}
function scribbleImageToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromImage = getValueByPath(fromObject, ['image']);
    if (fromImage != null) {
        setValueByPath(toObject, ['image'], imageToVertex(fromImage));
    }
    return toObject;
}
function segmentImageConfigToVertex(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromMode = getValueByPath(fromObject, ['mode']);
    if (parentObject !== undefined && fromMode != null) {
        setValueByPath(parentObject, ['parameters', 'mode'], fromMode);
    }
    const fromMaxPredictions = getValueByPath(fromObject, [
        'maxPredictions',
    ]);
    if (parentObject !== undefined && fromMaxPredictions != null) {
        setValueByPath(parentObject, ['parameters', 'maxPredictions'], fromMaxPredictions);
    }
    const fromConfidenceThreshold = getValueByPath(fromObject, [
        'confidenceThreshold',
    ]);
    if (parentObject !== undefined && fromConfidenceThreshold != null) {
        setValueByPath(parentObject, ['parameters', 'confidenceThreshold'], fromConfidenceThreshold);
    }
    const fromMaskDilation = getValueByPath(fromObject, ['maskDilation']);
    if (parentObject !== undefined && fromMaskDilation != null) {
        setValueByPath(parentObject, ['parameters', 'maskDilation'], fromMaskDilation);
    }
    const fromBinaryColorThreshold = getValueByPath(fromObject, [
        'binaryColorThreshold',
    ]);
    if (parentObject !== undefined && fromBinaryColorThreshold != null) {
        setValueByPath(parentObject, ['parameters', 'binaryColorThreshold'], fromBinaryColorThreshold);
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (parentObject !== undefined && fromLabels != null) {
        setValueByPath(parentObject, ['labels'], fromLabels);
    }
    return toObject;
}
function segmentImageParametersToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromSource = getValueByPath(fromObject, ['source']);
    if (fromSource != null) {
        segmentImageSourceToVertex(fromSource, toObject);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        segmentImageConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function segmentImageResponseFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromGeneratedMasks = getValueByPath(fromObject, ['predictions']);
    if (fromGeneratedMasks != null) {
        let transformedList = fromGeneratedMasks;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedImageMaskFromVertex(item);
            });
        }
        setValueByPath(toObject, ['generatedMasks'], transformedList);
    }
    return toObject;
}
function segmentImageSourceToVertex(fromObject, parentObject, rootObject) {
    const toObject = {};
    const fromPrompt = getValueByPath(fromObject, ['prompt']);
    if (parentObject !== undefined && fromPrompt != null) {
        setValueByPath(parentObject, ['instances[0]', 'prompt'], fromPrompt);
    }
    const fromImage = getValueByPath(fromObject, ['image']);
    if (parentObject !== undefined && fromImage != null) {
        setValueByPath(parentObject, ['instances[0]', 'image'], imageToVertex(fromImage));
    }
    const fromScribbleImage = getValueByPath(fromObject, [
        'scribbleImage',
    ]);
    if (parentObject !== undefined && fromScribbleImage != null) {
        setValueByPath(parentObject, ['instances[0]', 'scribble'], scribbleImageToVertex(fromScribbleImage));
    }
    return toObject;
}
function speakerVoiceConfigToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromSpeaker = getValueByPath(fromObject, ['speaker']);
    if (fromSpeaker != null) {
        setValueByPath(toObject, ['speaker'], fromSpeaker);
    }
    const fromVoiceConfig = getValueByPath(fromObject, ['voiceConfig']);
    if (fromVoiceConfig != null) {
        setValueByPath(toObject, ['voiceConfig'], voiceConfigToVertex(fromVoiceConfig));
    }
    return toObject;
}
function speechConfigToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromVoiceConfig = getValueByPath(fromObject, ['voiceConfig']);
    if (fromVoiceConfig != null) {
        setValueByPath(toObject, ['voiceConfig'], voiceConfigToVertex(fromVoiceConfig));
    }
    const fromLanguageCode = getValueByPath(fromObject, ['languageCode']);
    if (fromLanguageCode != null) {
        setValueByPath(toObject, ['languageCode'], fromLanguageCode);
    }
    const fromMultiSpeakerVoiceConfig = getValueByPath(fromObject, [
        'multiSpeakerVoiceConfig',
    ]);
    if (fromMultiSpeakerVoiceConfig != null) {
        setValueByPath(toObject, ['multiSpeakerVoiceConfig'], multiSpeakerVoiceConfigToVertex(fromMultiSpeakerVoiceConfig));
    }
    return toObject;
}
function toolConfigToMldev(fromObject, rootObject) {
    const toObject = {};
    const fromRetrievalConfig = getValueByPath(fromObject, [
        'retrievalConfig',
    ]);
    if (fromRetrievalConfig != null) {
        setValueByPath(toObject, ['retrievalConfig'], fromRetrievalConfig);
    }
    const fromFunctionCallingConfig = getValueByPath(fromObject, [
        'functionCallingConfig',
    ]);
    if (fromFunctionCallingConfig != null) {
        setValueByPath(toObject, ['functionCallingConfig'], functionCallingConfigToMldev(fromFunctionCallingConfig));
    }
    const fromIncludeServerSideToolInvocations = getValueByPath(fromObject, ['includeServerSideToolInvocations']);
    if (fromIncludeServerSideToolInvocations != null) {
        setValueByPath(toObject, ['includeServerSideToolInvocations'], fromIncludeServerSideToolInvocations);
    }
    return toObject;
}
function toolConfigToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromRetrievalConfig = getValueByPath(fromObject, [
        'retrievalConfig',
    ]);
    if (fromRetrievalConfig != null) {
        setValueByPath(toObject, ['retrievalConfig'], fromRetrievalConfig);
    }
    const fromFunctionCallingConfig = getValueByPath(fromObject, [
        'functionCallingConfig',
    ]);
    if (fromFunctionCallingConfig != null) {
        setValueByPath(toObject, ['functionCallingConfig'], fromFunctionCallingConfig);
    }
    if (getValueByPath(fromObject, ['includeServerSideToolInvocations']) !==
        undefined) {
        throw new Error('includeServerSideToolInvocations parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function toolToMldev$1(fromObject, rootObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['retrieval']) !== undefined) {
        throw new Error('retrieval parameter is not supported in Gemini API.');
    }
    const fromComputerUse = getValueByPath(fromObject, ['computerUse']);
    if (fromComputerUse != null) {
        setValueByPath(toObject, ['computerUse'], fromComputerUse);
    }
    const fromFileSearch = getValueByPath(fromObject, ['fileSearch']);
    if (fromFileSearch != null) {
        setValueByPath(toObject, ['fileSearch'], fromFileSearch);
    }
    const fromGoogleSearch = getValueByPath(fromObject, ['googleSearch']);
    if (fromGoogleSearch != null) {
        setValueByPath(toObject, ['googleSearch'], googleSearchToMldev$1(fromGoogleSearch));
    }
    const fromGoogleMaps = getValueByPath(fromObject, ['googleMaps']);
    if (fromGoogleMaps != null) {
        setValueByPath(toObject, ['googleMaps'], googleMapsToMldev$1(fromGoogleMaps));
    }
    const fromCodeExecution = getValueByPath(fromObject, [
        'codeExecution',
    ]);
    if (fromCodeExecution != null) {
        setValueByPath(toObject, ['codeExecution'], fromCodeExecution);
    }
    if (getValueByPath(fromObject, ['enterpriseWebSearch']) !== undefined) {
        throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
    }
    const fromFunctionDeclarations = getValueByPath(fromObject, [
        'functionDeclarations',
    ]);
    if (fromFunctionDeclarations != null) {
        let transformedList = fromFunctionDeclarations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['functionDeclarations'], transformedList);
    }
    const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
        'googleSearchRetrieval',
    ]);
    if (fromGoogleSearchRetrieval != null) {
        setValueByPath(toObject, ['googleSearchRetrieval'], fromGoogleSearchRetrieval);
    }
    if (getValueByPath(fromObject, ['parallelAiSearch']) !== undefined) {
        throw new Error('parallelAiSearch parameter is not supported in Gemini API.');
    }
    const fromUrlContext = getValueByPath(fromObject, ['urlContext']);
    if (fromUrlContext != null) {
        setValueByPath(toObject, ['urlContext'], fromUrlContext);
    }
    const fromMcpServers = getValueByPath(fromObject, ['mcpServers']);
    if (fromMcpServers != null) {
        let transformedList = fromMcpServers;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['mcpServers'], transformedList);
    }
    return toObject;
}
function toolToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromRetrieval = getValueByPath(fromObject, ['retrieval']);
    if (fromRetrieval != null) {
        setValueByPath(toObject, ['retrieval'], fromRetrieval);
    }
    const fromComputerUse = getValueByPath(fromObject, ['computerUse']);
    if (fromComputerUse != null) {
        setValueByPath(toObject, ['computerUse'], fromComputerUse);
    }
    if (getValueByPath(fromObject, ['fileSearch']) !== undefined) {
        throw new Error('fileSearch parameter is not supported in Vertex AI.');
    }
    const fromGoogleSearch = getValueByPath(fromObject, ['googleSearch']);
    if (fromGoogleSearch != null) {
        setValueByPath(toObject, ['googleSearch'], fromGoogleSearch);
    }
    const fromGoogleMaps = getValueByPath(fromObject, ['googleMaps']);
    if (fromGoogleMaps != null) {
        setValueByPath(toObject, ['googleMaps'], fromGoogleMaps);
    }
    const fromCodeExecution = getValueByPath(fromObject, [
        'codeExecution',
    ]);
    if (fromCodeExecution != null) {
        setValueByPath(toObject, ['codeExecution'], fromCodeExecution);
    }
    const fromEnterpriseWebSearch = getValueByPath(fromObject, [
        'enterpriseWebSearch',
    ]);
    if (fromEnterpriseWebSearch != null) {
        setValueByPath(toObject, ['enterpriseWebSearch'], fromEnterpriseWebSearch);
    }
    const fromFunctionDeclarations = getValueByPath(fromObject, [
        'functionDeclarations',
    ]);
    if (fromFunctionDeclarations != null) {
        let transformedList = fromFunctionDeclarations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return functionDeclarationToVertex(item);
            });
        }
        setValueByPath(toObject, ['functionDeclarations'], transformedList);
    }
    const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
        'googleSearchRetrieval',
    ]);
    if (fromGoogleSearchRetrieval != null) {
        setValueByPath(toObject, ['googleSearchRetrieval'], fromGoogleSearchRetrieval);
    }
    const fromParallelAiSearch = getValueByPath(fromObject, [
        'parallelAiSearch',
    ]);
    if (fromParallelAiSearch != null) {
        setValueByPath(toObject, ['parallelAiSearch'], fromParallelAiSearch);
    }
    const fromUrlContext = getValueByPath(fromObject, ['urlContext']);
    if (fromUrlContext != null) {
        setValueByPath(toObject, ['urlContext'], fromUrlContext);
    }
    if (getValueByPath(fromObject, ['mcpServers']) !== undefined) {
        throw new Error('mcpServers parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function tunedModelInfoFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromBaseModel = getValueByPath(fromObject, ['baseModel']);
    if (fromBaseModel != null) {
        setValueByPath(toObject, ['baseModel'], fromBaseModel);
    }
    const fromCreateTime = getValueByPath(fromObject, ['createTime']);
    if (fromCreateTime != null) {
        setValueByPath(toObject, ['createTime'], fromCreateTime);
    }
    const fromUpdateTime = getValueByPath(fromObject, ['updateTime']);
    if (fromUpdateTime != null) {
        setValueByPath(toObject, ['updateTime'], fromUpdateTime);
    }
    return toObject;
}
function tunedModelInfoFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromBaseModel = getValueByPath(fromObject, [
        'labels',
        'google-vertex-llm-tuning-base-model-id',
    ]);
    if (fromBaseModel != null) {
        setValueByPath(toObject, ['baseModel'], fromBaseModel);
    }
    const fromCreateTime = getValueByPath(fromObject, ['createTime']);
    if (fromCreateTime != null) {
        setValueByPath(toObject, ['createTime'], fromCreateTime);
    }
    const fromUpdateTime = getValueByPath(fromObject, ['updateTime']);
    if (fromUpdateTime != null) {
        setValueByPath(toObject, ['updateTime'], fromUpdateTime);
    }
    return toObject;
}
function updateModelConfigToMldev(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (parentObject !== undefined && fromDisplayName != null) {
        setValueByPath(parentObject, ['displayName'], fromDisplayName);
    }
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (parentObject !== undefined && fromDescription != null) {
        setValueByPath(parentObject, ['description'], fromDescription);
    }
    const fromDefaultCheckpointId = getValueByPath(fromObject, [
        'defaultCheckpointId',
    ]);
    if (parentObject !== undefined && fromDefaultCheckpointId != null) {
        setValueByPath(parentObject, ['defaultCheckpointId'], fromDefaultCheckpointId);
    }
    return toObject;
}
function updateModelConfigToVertex(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (parentObject !== undefined && fromDisplayName != null) {
        setValueByPath(parentObject, ['displayName'], fromDisplayName);
    }
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (parentObject !== undefined && fromDescription != null) {
        setValueByPath(parentObject, ['description'], fromDescription);
    }
    const fromDefaultCheckpointId = getValueByPath(fromObject, [
        'defaultCheckpointId',
    ]);
    if (parentObject !== undefined && fromDefaultCheckpointId != null) {
        setValueByPath(parentObject, ['defaultCheckpointId'], fromDefaultCheckpointId);
    }
    return toObject;
}
function updateModelParametersToMldev(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'name'], tModel(apiClient, fromModel));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        updateModelConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function updateModelParametersToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        updateModelConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function upscaleImageAPIConfigInternalToVertex(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromOutputGcsUri = getValueByPath(fromObject, ['outputGcsUri']);
    if (parentObject !== undefined && fromOutputGcsUri != null) {
        setValueByPath(parentObject, ['parameters', 'storageUri'], fromOutputGcsUri);
    }
    const fromSafetyFilterLevel = getValueByPath(fromObject, [
        'safetyFilterLevel',
    ]);
    if (parentObject !== undefined && fromSafetyFilterLevel != null) {
        setValueByPath(parentObject, ['parameters', 'safetySetting'], fromSafetyFilterLevel);
    }
    const fromPersonGeneration = getValueByPath(fromObject, [
        'personGeneration',
    ]);
    if (parentObject !== undefined && fromPersonGeneration != null) {
        setValueByPath(parentObject, ['parameters', 'personGeneration'], fromPersonGeneration);
    }
    const fromIncludeRaiReason = getValueByPath(fromObject, [
        'includeRaiReason',
    ]);
    if (parentObject !== undefined && fromIncludeRaiReason != null) {
        setValueByPath(parentObject, ['parameters', 'includeRaiReason'], fromIncludeRaiReason);
    }
    const fromOutputMimeType = getValueByPath(fromObject, [
        'outputMimeType',
    ]);
    if (parentObject !== undefined && fromOutputMimeType != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'mimeType'], fromOutputMimeType);
    }
    const fromOutputCompressionQuality = getValueByPath(fromObject, [
        'outputCompressionQuality',
    ]);
    if (parentObject !== undefined && fromOutputCompressionQuality != null) {
        setValueByPath(parentObject, ['parameters', 'outputOptions', 'compressionQuality'], fromOutputCompressionQuality);
    }
    const fromEnhanceInputImage = getValueByPath(fromObject, [
        'enhanceInputImage',
    ]);
    if (parentObject !== undefined && fromEnhanceInputImage != null) {
        setValueByPath(parentObject, ['parameters', 'upscaleConfig', 'enhanceInputImage'], fromEnhanceInputImage);
    }
    const fromImagePreservationFactor = getValueByPath(fromObject, [
        'imagePreservationFactor',
    ]);
    if (parentObject !== undefined && fromImagePreservationFactor != null) {
        setValueByPath(parentObject, ['parameters', 'upscaleConfig', 'imagePreservationFactor'], fromImagePreservationFactor);
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (parentObject !== undefined && fromLabels != null) {
        setValueByPath(parentObject, ['labels'], fromLabels);
    }
    const fromNumberOfImages = getValueByPath(fromObject, [
        'numberOfImages',
    ]);
    if (parentObject !== undefined && fromNumberOfImages != null) {
        setValueByPath(parentObject, ['parameters', 'sampleCount'], fromNumberOfImages);
    }
    const fromMode = getValueByPath(fromObject, ['mode']);
    if (parentObject !== undefined && fromMode != null) {
        setValueByPath(parentObject, ['parameters', 'mode'], fromMode);
    }
    return toObject;
}
function upscaleImageAPIParametersInternalToVertex(apiClient, fromObject, rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['_url', 'model'], tModel(apiClient, fromModel));
    }
    const fromImage = getValueByPath(fromObject, ['image']);
    if (fromImage != null) {
        setValueByPath(toObject, ['instances[0]', 'image'], imageToVertex(fromImage));
    }
    const fromUpscaleFactor = getValueByPath(fromObject, [
        'upscaleFactor',
    ]);
    if (fromUpscaleFactor != null) {
        setValueByPath(toObject, ['parameters', 'upscaleConfig', 'upscaleFactor'], fromUpscaleFactor);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        upscaleImageAPIConfigInternalToVertex(fromConfig, toObject);
    }
    return toObject;
}
function upscaleImageResponseFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromGeneratedImages = getValueByPath(fromObject, [
        'predictions',
    ]);
    if (fromGeneratedImages != null) {
        let transformedList = fromGeneratedImages;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return generatedImageFromVertex(item);
            });
        }
        setValueByPath(toObject, ['generatedImages'], transformedList);
    }
    return toObject;
}
function videoFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromUri = getValueByPath(fromObject, ['uri']);
    if (fromUri != null) {
        setValueByPath(toObject, ['uri'], fromUri);
    }
    const fromVideoBytes = getValueByPath(fromObject, ['encodedVideo']);
    if (fromVideoBytes != null) {
        setValueByPath(toObject, ['videoBytes'], tBytes(fromVideoBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['encoding']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function videoFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromUri = getValueByPath(fromObject, ['gcsUri']);
    if (fromUri != null) {
        setValueByPath(toObject, ['uri'], fromUri);
    }
    const fromVideoBytes = getValueByPath(fromObject, [
        'bytesBase64Encoded',
    ]);
    if (fromVideoBytes != null) {
        setValueByPath(toObject, ['videoBytes'], tBytes(fromVideoBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function videoGenerationMaskToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromImage = getValueByPath(fromObject, ['image']);
    if (fromImage != null) {
        setValueByPath(toObject, ['_self'], imageToVertex(fromImage));
    }
    const fromMaskMode = getValueByPath(fromObject, ['maskMode']);
    if (fromMaskMode != null) {
        setValueByPath(toObject, ['maskMode'], fromMaskMode);
    }
    return toObject;
}
function videoGenerationReferenceImageToMldev(fromObject, rootObject) {
    const toObject = {};
    const fromImage = getValueByPath(fromObject, ['image']);
    if (fromImage != null) {
        setValueByPath(toObject, ['image'], imageToMldev(fromImage));
    }
    const fromReferenceType = getValueByPath(fromObject, [
        'referenceType',
    ]);
    if (fromReferenceType != null) {
        setValueByPath(toObject, ['referenceType'], fromReferenceType);
    }
    return toObject;
}
function videoGenerationReferenceImageToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromImage = getValueByPath(fromObject, ['image']);
    if (fromImage != null) {
        setValueByPath(toObject, ['image'], imageToVertex(fromImage));
    }
    const fromReferenceType = getValueByPath(fromObject, [
        'referenceType',
    ]);
    if (fromReferenceType != null) {
        setValueByPath(toObject, ['referenceType'], fromReferenceType);
    }
    return toObject;
}
function videoToMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromUri = getValueByPath(fromObject, ['uri']);
    if (fromUri != null) {
        setValueByPath(toObject, ['uri'], fromUri);
    }
    const fromVideoBytes = getValueByPath(fromObject, ['videoBytes']);
    if (fromVideoBytes != null) {
        setValueByPath(toObject, ['encodedVideo'], tBytes(fromVideoBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['encoding'], fromMimeType);
    }
    return toObject;
}
function videoToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromUri = getValueByPath(fromObject, ['uri']);
    if (fromUri != null) {
        setValueByPath(toObject, ['gcsUri'], fromUri);
    }
    const fromVideoBytes = getValueByPath(fromObject, ['videoBytes']);
    if (fromVideoBytes != null) {
        setValueByPath(toObject, ['bytesBase64Encoded'], tBytes(fromVideoBytes));
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function voiceConfigToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromReplicatedVoiceConfig = getValueByPath(fromObject, [
        'replicatedVoiceConfig',
    ]);
    if (fromReplicatedVoiceConfig != null) {
        setValueByPath(toObject, ['replicatedVoiceConfig'], replicatedVoiceConfigToVertex(fromReplicatedVoiceConfig));
    }
    const fromPrebuiltVoiceConfig = getValueByPath(fromObject, [
        'prebuiltVoiceConfig',
    ]);
    if (fromPrebuiltVoiceConfig != null) {
        setValueByPath(toObject, ['prebuiltVoiceConfig'], fromPrebuiltVoiceConfig);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Code generated by the Google Gen AI SDK generator DO NOT EDIT.
function createFileSearchStoreConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromDisplayName = getValueByPath(fromObject, ['displayName']);
    if (parentObject !== undefined && fromDisplayName != null) {
        setValueByPath(parentObject, ['displayName'], fromDisplayName);
    }
    return toObject;
}
function createFileSearchStoreParametersToMldev(fromObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        createFileSearchStoreConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function deleteFileSearchStoreConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromForce = getValueByPath(fromObject, ['force']);
    if (parentObject !== undefined && fromForce != null) {
        setValueByPath(parentObject, ['_query', 'force'], fromForce);
    }
    return toObject;
}
function deleteFileSearchStoreParametersToMldev(fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], fromName);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        deleteFileSearchStoreConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function getFileSearchStoreParametersToMldev(fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], fromName);
    }
    return toObject;
}
function importFileConfigToMldev(fromObject, parentObject) {
    const toObject = {};
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
function importFileOperationFromMldev(fromObject) {
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
        setValueByPath(toObject, ['response'], importFileResponseFromMldev(fromResponse));
    }
    return toObject;
}
function importFileParametersToMldev(fromObject) {
    const toObject = {};
    const fromFileSearchStoreName = getValueByPath(fromObject, [
        'fileSearchStoreName',
    ]);
    if (fromFileSearchStoreName != null) {
        setValueByPath(toObject, ['_url', 'file_search_store_name'], fromFileSearchStoreName);
    }
    const fromFileName = getValueByPath(fromObject, ['fileName']);
    if (fromFileName != null) {
        setValueByPath(toObject, ['fileName'], fromFileName);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        importFileConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function importFileResponseFromMldev(fromObject) {
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
function listFileSearchStoresConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    return toObject;
}
function listFileSearchStoresParametersToMldev(fromObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listFileSearchStoresConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function listFileSearchStoresResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromFileSearchStores = getValueByPath(fromObject, [
        'fileSearchStores',
    ]);
    if (fromFileSearchStores != null) {
        let transformedList = fromFileSearchStores;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['fileSearchStores'], transformedList);
    }
    return toObject;
}
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
function uploadToFileSearchStoreParametersToMldev(fromObject) {
    const toObject = {};
    const fromFileSearchStoreName = getValueByPath(fromObject, [
        'fileSearchStoreName',
    ]);
    if (fromFileSearchStoreName != null) {
        setValueByPath(toObject, ['_url', 'file_search_store_name'], fromFileSearchStoreName);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        uploadToFileSearchStoreConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function uploadToFileSearchStoreResumableResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    return toObject;
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
            throw new AbortError(`Non-retryable exception ${response.statusText} sending request`);
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
// TODO: b/416041229 - Determine how to retrieve the MCP package version.
const MCP_LABEL = 'mcp_used/unknown';
// Whether MCP tool usage is detected from mcpToTool. This is used for
// telemetry.
let hasMcpToolUsageFromMcpToTool = false;
// Checks whether the list of tools contains any MCP tools.
function hasMcpToolUsage(tools) {
    for (const tool of tools) {
        if (isMcpCallableTool(tool)) {
            return true;
        }
        if (typeof tool === 'object' && 'inputSchema' in tool) {
            return true;
        }
    }
    return hasMcpToolUsageFromMcpToTool;
}
// Sets the MCP version label in the Google API client header.
function setMcpUsageHeader(headers) {
    var _a;
    const existingHeader = (_a = headers[GOOGLE_API_CLIENT_HEADER]) !== null && _a !== void 0 ? _a : '';
    headers[GOOGLE_API_CLIENT_HEADER] = (existingHeader + ` ${MCP_LABEL}`).trimStart();
}
// Returns true if the object is a MCP CallableTool, otherwise false.
function isMcpCallableTool(object) {
    return (object !== null &&
        typeof object === 'object' &&
        object instanceof McpCallableTool);
}
// List all tools from the MCP client.
function listAllTools(mcpClient_1) {
    return __asyncGenerator(this, arguments, function* listAllTools_1(mcpClient, maxTools = 100) {
        let cursor = undefined;
        let numTools = 0;
        while (numTools < maxTools) {
            const t = yield __await(mcpClient.listTools({ cursor }));
            for (const tool of t.tools) {
                yield yield __await(tool);
                numTools++;
            }
            if (!t.nextCursor) {
                break;
            }
            cursor = t.nextCursor;
        }
    });
}
/**
 * McpCallableTool can be used for model inference and invoking MCP clients with
 * given function call arguments.
 *
 * @experimental Built-in MCP support is an experimental feature, may change in future
 * versions.
 */
class McpCallableTool {
    constructor(mcpClients = [], config) {
        this.mcpTools = [];
        this.functionNameToMcpClient = {};
        this.mcpClients = mcpClients;
        this.config = config;
    }
    /**
     * Creates a McpCallableTool.
     */
    static create(mcpClients, config) {
        return new McpCallableTool(mcpClients, config);
    }
    /**
     * Validates the function names are not duplicate and initialize the function
     * name to MCP client mapping.
     *
     * @throws {Error} if the MCP tools from the MCP clients have duplicate tool
     *     names.
     */
    async initialize() {
        var _a, e_1, _b, _c;
        if (this.mcpTools.length > 0) {
            return;
        }
        const functionMap = {};
        const mcpTools = [];
        for (const mcpClient of this.mcpClients) {
            try {
                for (var _d = true, _e = (e_1 = void 0, __asyncValues(listAllTools(mcpClient))), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const mcpTool = _c;
                    mcpTools.push(mcpTool);
                    const mcpToolName = mcpTool.name;
                    if (functionMap[mcpToolName]) {
                        throw new Error(`Duplicate function name ${mcpToolName} found in MCP tools. Please ensure function names are unique.`);
                    }
                    functionMap[mcpToolName] = mcpClient;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        this.mcpTools = mcpTools;
        this.functionNameToMcpClient = functionMap;
    }
    async tool() {
        await this.initialize();
        return mcpToolsToGeminiTool(this.mcpTools, this.config);
    }
    async callTool(functionCalls) {
        await this.initialize();
        const functionCallResponseParts = [];
        for (const functionCall of functionCalls) {
            if (functionCall.name in this.functionNameToMcpClient) {
                const mcpClient = this.functionNameToMcpClient[functionCall.name];
                let requestOptions = undefined;
                // TODO: b/424238654 - Add support for finer grained timeout control.
                if (this.config.timeout) {
                    requestOptions = {
                        timeout: this.config.timeout,
                    };
                }
                const callToolResponse = await mcpClient.callTool({
                    name: functionCall.name,
                    arguments: functionCall.args,
                }, 
                // Set the result schema to undefined to allow MCP to rely on the
                // default schema.
                undefined, requestOptions);
                functionCallResponseParts.push({
                    functionResponse: {
                        name: functionCall.name,
                        response: callToolResponse.isError
                            ? { error: callToolResponse }
                            : callToolResponse,
                    },
                });
            }
        }
        return functionCallResponseParts;
    }
}
function isMcpClient(client) {
    return (client !== null &&
        typeof client === 'object' &&
        'listTools' in client &&
        typeof client.listTools === 'function');
}
/**
 * Creates a McpCallableTool from MCP clients and an optional config.
 *
 * The callable tool can invoke the MCP clients with given function call
 * arguments. (often for automatic function calling).
 * Use the config to modify tool parameters such as behavior.
 *
 * @experimental Built-in MCP support is an experimental feature, may change in future
 * versions.
 */
function mcpToTool(...args) {
    // Set MCP usage for telemetry.
    hasMcpToolUsageFromMcpToTool = true;
    if (args.length === 0) {
        throw new Error('No MCP clients provided');
    }
    const maybeConfig = args[args.length - 1];
    if (isMcpClient(maybeConfig)) {
        return McpCallableTool.create(args, {});
    }
    return McpCallableTool.create(args.slice(0, args.length - 1), maybeConfig);
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Handles incoming messages from the WebSocket.
 *
 * @remarks
 * This function is responsible for parsing incoming messages, transforming them
 * into LiveMusicServerMessage, and then calling the onmessage callback.
 * Note that the first message which is received from the server is a
 * setupComplete message.
 *
 * @param apiClient The ApiClient instance.
 * @param onmessage The user-provided onmessage callback (if any).
 * @param event The MessageEvent from the WebSocket.
 */
async function handleWebSocketMessage$1(apiClient, onmessage, event) {
    const serverMessage = new LiveMusicServerMessage();
    let data;
    if (event.data instanceof Blob) {
        data = JSON.parse(await event.data.text());
    }
    else {
        data = JSON.parse(event.data);
    }
    Object.assign(serverMessage, data);
    onmessage(serverMessage);
}
/**
   LiveMusic class encapsulates the configuration for live music
   generation via Lyria Live models.

   @experimental
  */
class LiveMusic {
    constructor(apiClient, auth, webSocketFactory) {
        this.apiClient = apiClient;
        this.auth = auth;
        this.webSocketFactory = webSocketFactory;
    }
    /**
       Establishes a connection to the specified model and returns a
       LiveMusicSession object representing that connection.
  
       @experimental
  
       @remarks
  
       @param params - The parameters for establishing a connection to the model.
       @return A live session.
  
       @example
       ```ts
       let model = 'models/lyria-realtime-exp';
       const session = await ai.live.music.connect({
         model: model,
         callbacks: {
           onmessage: (e: MessageEvent) => {
             console.log('Received message from the server: %s\n', debug(e.data));
           },
           onerror: (e: ErrorEvent) => {
             console.log('Error occurred: %s\n', debug(e.error));
           },
           onclose: (e: CloseEvent) => {
             console.log('Connection closed.');
           },
         },
       });
       ```
      */
    async connect(params) {
        var _a, _b;
        if (this.apiClient.isVertexAI()) {
            throw new Error('Live music is not supported for Vertex AI.');
        }
        console.warn('Live music generation is experimental and may change in future versions.');
        const websocketBaseUrl = this.apiClient.getWebsocketBaseUrl();
        const apiVersion = this.apiClient.getApiVersion();
        const headers = mapToHeaders$1(this.apiClient.getDefaultHeaders());
        const apiKey = this.apiClient.getApiKey();
        const url = `${websocketBaseUrl}/ws/google.ai.generativelanguage.${apiVersion}.GenerativeService.BidiGenerateMusic?key=${apiKey}`;
        let onopenResolve = () => { };
        const onopenPromise = new Promise((resolve) => {
            onopenResolve = resolve;
        });
        const callbacks = params.callbacks;
        const onopenAwaitedCallback = function () {
            onopenResolve({});
        };
        const apiClient = this.apiClient;
        const websocketCallbacks = {
            onopen: onopenAwaitedCallback,
            onmessage: (event) => {
                void handleWebSocketMessage$1(apiClient, callbacks.onmessage, event);
            },
            onerror: (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onerror) !== null && _a !== void 0 ? _a : function (e) {
            },
            onclose: (_b = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onclose) !== null && _b !== void 0 ? _b : function (e) {
            },
        };
        const conn = this.webSocketFactory.create(url, headersToMap$1(headers), websocketCallbacks);
        conn.connect();
        // Wait for the websocket to open before sending requests.
        await onopenPromise;
        const model = tModel(this.apiClient, params.model);
        const setup = { model };
        const clientMessage = { setup };
        conn.send(JSON.stringify(clientMessage));
        return new LiveMusicSession(conn, this.apiClient);
    }
}
/**
   Represents a connection to the API.

   @experimental
  */
class LiveMusicSession {
    constructor(conn, apiClient) {
        this.conn = conn;
        this.apiClient = apiClient;
    }
    /**
      Sets inputs to steer music generation. Updates the session's current
      weighted prompts.
  
      @param params - Contains one property, `weightedPrompts`.
  
        - `weightedPrompts` to send to the model; weights are normalized to
          sum to 1.0.
  
      @experimental
     */
    async setWeightedPrompts(params) {
        if (!params.weightedPrompts ||
            Object.keys(params.weightedPrompts).length === 0) {
            throw new Error('Weighted prompts must be set and contain at least one entry.');
        }
        const clientContent = liveMusicSetWeightedPromptsParametersToMldev(params);
        this.conn.send(JSON.stringify({ clientContent }));
    }
    /**
      Sets a configuration to the model. Updates the session's current
      music generation config.
  
      @param params - Contains one property, `musicGenerationConfig`.
  
        - `musicGenerationConfig` to set in the model. Passing an empty or
      undefined config to the model will reset the config to defaults.
  
      @experimental
     */
    async setMusicGenerationConfig(params) {
        if (!params.musicGenerationConfig) {
            params.musicGenerationConfig = {};
        }
        const setConfigParameters = liveMusicSetConfigParametersToMldev(params);
        this.conn.send(JSON.stringify(setConfigParameters));
    }
    sendPlaybackControl(playbackControl) {
        const clientMessage = { playbackControl };
        this.conn.send(JSON.stringify(clientMessage));
    }
    /**
     * Start the music stream.
     *
     * @experimental
     */
    play() {
        this.sendPlaybackControl(LiveMusicPlaybackControl.PLAY);
    }
    /**
     * Temporarily halt the music stream. Use `play` to resume from the current
     * position.
     *
     * @experimental
     */
    pause() {
        this.sendPlaybackControl(LiveMusicPlaybackControl.PAUSE);
    }
    /**
     * Stop the music stream and reset the state. Retains the current prompts
     * and config.
     *
     * @experimental
     */
    stop() {
        this.sendPlaybackControl(LiveMusicPlaybackControl.STOP);
    }
    /**
     * Resets the context of the music generation without stopping it.
     * Retains the current prompts and config.
     *
     * @experimental
     */
    resetContext() {
        this.sendPlaybackControl(LiveMusicPlaybackControl.RESET_CONTEXT);
    }
    /**
       Terminates the WebSocket connection.
  
       @experimental
     */
    close() {
        this.conn.close();
    }
}
// Converts an headers object to a "map" object as expected by the WebSocket
// constructor. We use this as the Auth interface works with Headers objects
// while the WebSocket constructor takes a map.
function headersToMap$1(headers) {
    const headerMap = {};
    headers.forEach((value, key) => {
        headerMap[key] = value;
    });
    return headerMap;
}
// Converts a "map" object to a headers object. We use this as the Auth
// interface works with Headers objects while the API client default headers
// returns a map.
function mapToHeaders$1(map) {
    const headers = new Headers();
    for (const [key, value] of Object.entries(map)) {
        headers.append(key, value);
    }
    return headers;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const FUNCTION_RESPONSE_REQUIRES_ID = 'FunctionResponse request must have an `id` field from the response of a ToolCall.FunctionalCalls in Google AI.';
/**
 * Handles incoming messages from the WebSocket.
 *
 * @remarks
 * This function is responsible for parsing incoming messages, transforming them
 * into LiveServerMessages, and then calling the onmessage callback. Note that
 * the first message which is received from the server is a setupComplete
 * message.
 *
 * @param apiClient The ApiClient instance.
 * @param onmessage The user-provided onmessage callback (if any).
 * @param event The MessageEvent from the WebSocket.
 */
async function handleWebSocketMessage(apiClient, onmessage, event) {
    const serverMessage = new LiveServerMessage();
    let jsonData;
    if (event.data instanceof Blob) {
        jsonData = await event.data.text();
    }
    else if (event.data instanceof ArrayBuffer) {
        jsonData = new TextDecoder().decode(event.data);
    }
    else {
        jsonData = event.data;
    }
    const data = JSON.parse(jsonData);
    if (apiClient.isVertexAI()) {
        const resp = liveServerMessageFromVertex(data);
        Object.assign(serverMessage, resp);
    }
    else {
        const resp = data;
        Object.assign(serverMessage, resp);
    }
    onmessage(serverMessage);
}
/**
   Live class encapsulates the configuration for live interaction with the
   Generative Language API. It embeds ApiClient for general API settings.

   @experimental
  */
class Live {
    constructor(apiClient, auth, webSocketFactory) {
        this.apiClient = apiClient;
        this.auth = auth;
        this.webSocketFactory = webSocketFactory;
        this.music = new LiveMusic(this.apiClient, this.auth, this.webSocketFactory);
    }
    /**
       Establishes a connection to the specified model with the given
       configuration and returns a Session object representing that connection.
  
       @experimental Built-in MCP support is an experimental feature, may change in
       future versions.
  
       @remarks
  
       @param params - The parameters for establishing a connection to the model.
       @return A live session.
  
       @example
       ```ts
       let model: string;
       if (GOOGLE_GENAI_USE_VERTEXAI) {
         model = 'gemini-2.0-flash-live-preview-04-09';
       } else {
         model = 'gemini-live-2.5-flash-preview';
       }
       const session = await ai.live.connect({
         model: model,
         config: {
           responseModalities: [Modality.AUDIO],
         },
         callbacks: {
           onopen: () => {
             console.log('Connected to the socket.');
           },
           onmessage: (e: MessageEvent) => {
             console.log('Received message from the server: %s\n', debug(e.data));
           },
           onerror: (e: ErrorEvent) => {
             console.log('Error occurred: %s\n', debug(e.error));
           },
           onclose: (e: CloseEvent) => {
             console.log('Connection closed.');
           },
         },
       });
       ```
      */
    async connect(params) {
        var _a, _b, _c, _d, _e, _f;
        // TODO: b/404946746 - Support per request HTTP options.
        if (params.config && params.config.httpOptions) {
            throw new Error('The Live module does not support httpOptions at request-level in' +
                ' LiveConnectConfig yet. Please use the client-level httpOptions' +
                ' configuration instead.');
        }
        const websocketBaseUrl = this.apiClient.getWebsocketBaseUrl();
        const apiVersion = this.apiClient.getApiVersion();
        let url;
        const clientHeaders = this.apiClient.getHeaders();
        if (params.config &&
            params.config.tools &&
            hasMcpToolUsage(params.config.tools)) {
            setMcpUsageHeader(clientHeaders);
        }
        const headers = mapToHeaders(clientHeaders);
        if (this.apiClient.isVertexAI()) {
            const project = this.apiClient.getProject();
            const location = this.apiClient.getLocation();
            const apiKey = this.apiClient.getApiKey();
            const hasStandardAuth = (!!project && !!location) || !!apiKey;
            if (this.apiClient.getCustomBaseUrl() && !hasStandardAuth) {
                // Custom base URL without standard auth (e.g., proxy).
                url = websocketBaseUrl;
                // Auth headers are assumed to be in `clientHeaders` from httpOptions.
            }
            else {
                url = `${websocketBaseUrl}/ws/google.cloud.aiplatform.${apiVersion}.LlmBidiService/BidiGenerateContent`;
                await this.auth.addAuthHeaders(headers, url);
            }
        }
        else {
            const apiKey = this.apiClient.getApiKey();
            let method = 'BidiGenerateContent';
            let keyName = 'key';
            if (apiKey === null || apiKey === void 0 ? void 0 : apiKey.startsWith('auth_tokens/')) {
                console.warn('Warning: Ephemeral token support is experimental and may change in future versions.');
                if (apiVersion !== 'v1alpha') {
                    console.warn("Warning: The SDK's ephemeral token support is in v1alpha only. Please use const ai = new GoogleGenAI({apiKey: token.name, httpOptions: { apiVersion: 'v1alpha' }}); before session connection.");
                }
                method = 'BidiGenerateContentConstrained';
                keyName = 'access_token';
            }
            url = `${websocketBaseUrl}/ws/google.ai.generativelanguage.${apiVersion}.GenerativeService.${method}?${keyName}=${apiKey}`;
        }
        let onopenResolve = () => { };
        const onopenPromise = new Promise((resolve) => {
            onopenResolve = resolve;
        });
        const callbacks = params.callbacks;
        const onopenAwaitedCallback = function () {
            var _a;
            (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onopen) === null || _a === void 0 ? void 0 : _a.call(callbacks);
            onopenResolve({});
        };
        const apiClient = this.apiClient;
        const websocketCallbacks = {
            onopen: onopenAwaitedCallback,
            onmessage: (event) => {
                void handleWebSocketMessage(apiClient, callbacks.onmessage, event);
            },
            onerror: (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onerror) !== null && _a !== void 0 ? _a : function (e) {
            },
            onclose: (_b = callbacks === null || callbacks === void 0 ? void 0 : callbacks.onclose) !== null && _b !== void 0 ? _b : function (e) {
            },
        };
        const conn = this.webSocketFactory.create(url, headersToMap(headers), websocketCallbacks);
        conn.connect();
        // Wait for the websocket to open before sending requests.
        await onopenPromise;
        let transformedModel = tModel(this.apiClient, params.model);
        if (this.apiClient.isVertexAI() &&
            transformedModel.startsWith('publishers/')) {
            const project = this.apiClient.getProject();
            const location = this.apiClient.getLocation();
            if (project && location) {
                transformedModel =
                    `projects/${project}/locations/${location}/` + transformedModel;
            }
        }
        let clientMessage = {};
        if (this.apiClient.isVertexAI() &&
            ((_c = params.config) === null || _c === void 0 ? void 0 : _c.responseModalities) === undefined) {
            // Set default to AUDIO to align with MLDev API.
            if (params.config === undefined) {
                params.config = { responseModalities: [Modality.AUDIO] };
            }
            else {
                params.config.responseModalities = [Modality.AUDIO];
            }
        }
        if ((_d = params.config) === null || _d === void 0 ? void 0 : _d.generationConfig) {
            // Raise deprecation warning for generationConfig.
            console.warn('Setting `LiveConnectConfig.generation_config` is deprecated, please set the fields on `LiveConnectConfig` directly. This will become an error in a future version (not before Q3 2025).');
        }
        const inputTools = (_f = (_e = params.config) === null || _e === void 0 ? void 0 : _e.tools) !== null && _f !== void 0 ? _f : [];
        const convertedTools = [];
        for (const tool of inputTools) {
            if (this.isCallableTool(tool)) {
                const callableTool = tool;
                convertedTools.push(await callableTool.tool());
            }
            else {
                convertedTools.push(tool);
            }
        }
        if (convertedTools.length > 0) {
            params.config.tools = convertedTools;
        }
        const liveConnectParameters = {
            model: transformedModel,
            config: params.config,
            callbacks: params.callbacks,
        };
        if (this.apiClient.isVertexAI()) {
            clientMessage = liveConnectParametersToVertex(this.apiClient, liveConnectParameters);
        }
        else {
            clientMessage = liveConnectParametersToMldev(this.apiClient, liveConnectParameters);
        }
        delete clientMessage['config'];
        conn.send(JSON.stringify(clientMessage));
        return new Session(conn, this.apiClient);
    }
    // TODO: b/416041229 - Abstract this method to a common place.
    isCallableTool(tool) {
        return 'callTool' in tool && typeof tool.callTool === 'function';
    }
}
const defaultLiveSendClientContentParamerters = {
    turnComplete: true,
};
/**
   Represents a connection to the API.

   @experimental
  */
class Session {
    constructor(conn, apiClient) {
        this.conn = conn;
        this.apiClient = apiClient;
    }
    tLiveClientContent(apiClient, params) {
        if (params.turns !== null && params.turns !== undefined) {
            let contents = [];
            try {
                contents = tContents(params.turns);
                if (!apiClient.isVertexAI()) {
                    contents = contents.map((item) => contentToMldev$1(item));
                }
            }
            catch (_a) {
                throw new Error(`Failed to parse client content "turns", type: '${typeof params.turns}'`);
            }
            return {
                clientContent: { turns: contents, turnComplete: params.turnComplete },
            };
        }
        return {
            clientContent: { turnComplete: params.turnComplete },
        };
    }
    tLiveClienttToolResponse(apiClient, params) {
        let functionResponses = [];
        if (params.functionResponses == null) {
            throw new Error('functionResponses is required.');
        }
        if (!Array.isArray(params.functionResponses)) {
            functionResponses = [params.functionResponses];
        }
        else {
            functionResponses = params.functionResponses;
        }
        if (functionResponses.length === 0) {
            throw new Error('functionResponses is required.');
        }
        for (const functionResponse of functionResponses) {
            if (typeof functionResponse !== 'object' ||
                functionResponse === null ||
                !('name' in functionResponse) ||
                !('response' in functionResponse)) {
                throw new Error(`Could not parse function response, type '${typeof functionResponse}'.`);
            }
            if (!apiClient.isVertexAI() && !('id' in functionResponse)) {
                throw new Error(FUNCTION_RESPONSE_REQUIRES_ID);
            }
        }
        const clientMessage = {
            toolResponse: { 'functionResponses': functionResponses },
        };
        return clientMessage;
    }
    /**
      Send a message over the established connection.
  
      @param params - Contains two **optional** properties, `turns` and
          `turnComplete`.
  
        - `turns` will be converted to a `Content[]`
        - `turnComplete: true` [default] indicates that you are done sending
          content and expect a response. If `turnComplete: false`, the server
          will wait for additional messages before starting generation.
  
      @experimental
  
      @remarks
      There are two ways to send messages to the live API:
      `sendClientContent` and `sendRealtimeInput`.
  
      `sendClientContent` messages are added to the model context **in order**.
      Having a conversation using `sendClientContent` messages is roughly
      equivalent to using the `Chat.sendMessageStream`, except that the state of
      the `chat` history is stored on the API server instead of locally.
  
      Because of `sendClientContent`'s order guarantee, the model cannot respons
      as quickly to `sendClientContent` messages as to `sendRealtimeInput`
      messages. This makes the biggest difference when sending objects that have
      significant preprocessing time (typically images).
  
      The `sendClientContent` message sends a `Content[]`
      which has more options than the `Blob` sent by `sendRealtimeInput`.
  
      So the main use-cases for `sendClientContent` over `sendRealtimeInput` are:
  
      - Sending anything that can't be represented as a `Blob` (text,
      `sendClientContent({turns="Hello?"}`)).
      - Managing turns when not using audio input and voice activity detection.
        (`sendClientContent({turnComplete:true})` or the short form
      `sendClientContent()`)
      - Prefilling a conversation context
        ```
        sendClientContent({
            turns: [
              Content({role:user, parts:...}),
              Content({role:user, parts:...}),
              ...
            ]
        })
        ```
      @experimental
     */
    sendClientContent(params) {
        params = Object.assign(Object.assign({}, defaultLiveSendClientContentParamerters), params);
        const clientMessage = this.tLiveClientContent(this.apiClient, params);
        this.conn.send(JSON.stringify(clientMessage));
    }
    /**
      Send a realtime message over the established connection.
  
      @param params - Contains one property, `media`.
  
        - `media` will be converted to a `Blob`
  
      @experimental
  
      @remarks
      Use `sendRealtimeInput` for realtime audio chunks and video frames (images).
  
      With `sendRealtimeInput` the api will respond to audio automatically
      based on voice activity detection (VAD).
  
      `sendRealtimeInput` is optimized for responsivness at the expense of
      deterministic ordering guarantees. Audio and video tokens are to the
      context when they become available.
  
      Note: The Call signature expects a `Blob` object, but only a subset
      of audio and image mimetypes are allowed.
     */
    sendRealtimeInput(params) {
        let clientMessage = {};
        if (this.apiClient.isVertexAI()) {
            clientMessage = {
                'realtimeInput': liveSendRealtimeInputParametersToVertex(params),
            };
        }
        else {
            clientMessage = {
                'realtimeInput': liveSendRealtimeInputParametersToMldev(params),
            };
        }
        this.conn.send(JSON.stringify(clientMessage));
    }
    /**
      Send a function response message over the established connection.
  
      @param params - Contains property `functionResponses`.
  
        - `functionResponses` will be converted to a `functionResponses[]`
  
      @remarks
      Use `sendFunctionResponse` to reply to `LiveServerToolCall` from the server.
  
      Use {@link types.LiveConnectConfig#tools} to configure the callable functions.
  
      @experimental
     */
    sendToolResponse(params) {
        if (params.functionResponses == null) {
            throw new Error('Tool response parameters are required.');
        }
        const clientMessage = this.tLiveClienttToolResponse(this.apiClient, params);
        this.conn.send(JSON.stringify(clientMessage));
    }
    /**
       Terminates the WebSocket connection.
  
       @experimental
  
       @example
       ```ts
       let model: string;
       if (GOOGLE_GENAI_USE_VERTEXAI) {
         model = 'gemini-2.0-flash-live-preview-04-09';
       } else {
         model = 'gemini-live-2.5-flash-preview';
       }
       const session = await ai.live.connect({
         model: model,
         config: {
           responseModalities: [Modality.AUDIO],
         }
       });
  
       session.close();
       ```
     */
    close() {
        this.conn.close();
    }
}
// Converts an headers object to a "map" object as expected by the WebSocket
// constructor. We use this as the Auth interface works with Headers objects
// while the WebSocket constructor takes a map.
function headersToMap(headers) {
    const headerMap = {};
    headers.forEach((value, key) => {
        headerMap[key] = value;
    });
    return headerMap;
}
// Converts a "map" object to a headers object. We use this as the Auth
// interface works with Headers objects while the API client default headers
// returns a map.
function mapToHeaders(map) {
    const headers = new Headers();
    for (const [key, value] of Object.entries(map)) {
        headers.append(key, value);
    }
    return headers;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const DEFAULT_MAX_REMOTE_CALLS = 10;
/** Returns whether automatic function calling is disabled. */
function shouldDisableAfc(config) {
    var _a, _b, _c;
    if ((_a = config === null || config === void 0 ? void 0 : config.automaticFunctionCalling) === null || _a === void 0 ? void 0 : _a.disable) {
        return true;
    }
    let callableToolsPresent = false;
    for (const tool of (_b = config === null || config === void 0 ? void 0 : config.tools) !== null && _b !== void 0 ? _b : []) {
        if (isCallableTool(tool)) {
            callableToolsPresent = true;
            break;
        }
    }
    if (!callableToolsPresent) {
        return true;
    }
    const maxCalls = (_c = config === null || config === void 0 ? void 0 : config.automaticFunctionCalling) === null || _c === void 0 ? void 0 : _c.maximumRemoteCalls;
    if ((maxCalls && (maxCalls < 0 || !Number.isInteger(maxCalls))) ||
        maxCalls == 0) {
        console.warn('Invalid maximumRemoteCalls value provided for automatic function calling. Disabled automatic function calling. Please provide a valid integer value greater than 0. maximumRemoteCalls provided:', maxCalls);
        return true;
    }
    return false;
}
function isCallableTool(tool) {
    return 'callTool' in tool && typeof tool.callTool === 'function';
}
// Checks whether the list of tools contains any CallableTools. Will return true
// if there is at least one CallableTool.
function hasCallableTools(params) {
    var _a, _b, _c;
    return (_c = (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.tools) === null || _b === void 0 ? void 0 : _b.some((tool) => isCallableTool(tool))) !== null && _c !== void 0 ? _c : false;
}
/**
 * Returns the indexes of the tools that are not compatible with AFC.
 */
function findAfcIncompatibleToolIndexes(params) {
    var _a;
    // Use number[] for an array of numbers in TypeScript
    const afcIncompatibleToolIndexes = [];
    if (!((_a = params === null || params === void 0 ? void 0 : params.config) === null || _a === void 0 ? void 0 : _a.tools)) {
        return afcIncompatibleToolIndexes;
    }
    params.config.tools.forEach((tool, index) => {
        if (isCallableTool(tool)) {
            return;
        }
        const geminiTool = tool;
        if (geminiTool.functionDeclarations &&
            geminiTool.functionDeclarations.length > 0) {
            afcIncompatibleToolIndexes.push(index);
        }
    });
    return afcIncompatibleToolIndexes;
}
/**
 * Returns whether to append automatic function calling history to the
 * response.
 */
function shouldAppendAfcHistory(config) {
    var _a;
    return !((_a = config === null || config === void 0 ? void 0 : config.automaticFunctionCalling) === null || _a === void 0 ? void 0 : _a.ignoreCallHistory);
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Models extends BaseModule {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
        /**
         * Calculates embeddings for the given contents.
         *
         * @param params - The parameters for embedding contents.
         * @return The response from the API.
         *
         * @example
         * ```ts
         * const response = await ai.models.embedContent({
         *  model: 'text-embedding-004',
         *  contents: [
         *    'What is your name?',
         *    'What is your favorite color?',
         *  ],
         *  config: {
         *    outputDimensionality: 64,
         *  },
         * });
         * console.log(response);
         * ```
         */
        this.embedContent = async (params) => {
            if (!this.apiClient.isVertexAI()) {
                return await this.embedContentInternal(params);
            }
            const isVertexEmbedContentModel = (params.model.includes('gemini') &&
                params.model !== 'gemini-embedding-001') ||
                params.model.includes('maas');
            if (isVertexEmbedContentModel) {
                const contents = tContents(params.contents);
                if (contents.length > 1) {
                    throw new Error('The embedContent API for this model only supports one content at a time.');
                }
                const paramsPrivate = Object.assign(Object.assign({}, params), { content: contents[0], embeddingApiType: EmbeddingApiType.EMBED_CONTENT });
                return await this.embedContentInternal(paramsPrivate);
            }
            else {
                const paramsPrivate = Object.assign(Object.assign({}, params), { embeddingApiType: EmbeddingApiType.PREDICT });
                return await this.embedContentInternal(paramsPrivate);
            }
        };
        /**
         * Makes an API request to generate content with a given model.
         *
         * For the `model` parameter, supported formats for Vertex AI API include:
         * - The Gemini model ID, for example: 'gemini-2.0-flash'
         * - The full resource name starts with 'projects/', for example:
         *  'projects/my-project-id/locations/us-central1/publishers/google/models/gemini-2.0-flash'
         * - The partial resource name with 'publishers/', for example:
         *  'publishers/google/models/gemini-2.0-flash' or
         *  'publishers/meta/models/llama-3.1-405b-instruct-maas'
         * - `/` separated publisher and model name, for example:
         * 'google/gemini-2.0-flash' or 'meta/llama-3.1-405b-instruct-maas'
         *
         * For the `model` parameter, supported formats for Gemini API include:
         * - The Gemini model ID, for example: 'gemini-2.0-flash'
         * - The model name starts with 'models/', for example:
         *  'models/gemini-2.0-flash'
         * - For tuned models, the model name starts with 'tunedModels/',
         * for example:
         * 'tunedModels/1234567890123456789'
         *
         * Some models support multimodal input and output.
         *
         * @param params - The parameters for generating content.
         * @return The response from generating content.
         *
         * @example
         * ```ts
         * const response = await ai.models.generateContent({
         *   model: 'gemini-2.0-flash',
         *   contents: 'why is the sky blue?',
         *   config: {
         *     candidateCount: 2,
         *   }
         * });
         * console.log(response);
         * ```
         */
        this.generateContent = async (params) => {
            var _a, _b, _c, _d, _e;
            const transformedParams = await this.processParamsMaybeAddMcpUsage(params);
            this.maybeMoveToResponseJsonSchem(params);
            if (!hasCallableTools(params) || shouldDisableAfc(params.config)) {
                return await this.generateContentInternal(transformedParams);
            }
            const incompatibleToolIndexes = findAfcIncompatibleToolIndexes(params);
            if (incompatibleToolIndexes.length > 0) {
                const formattedIndexes = incompatibleToolIndexes
                    .map((index) => `tools[${index}]`)
                    .join(', ');
                throw new Error(`Automatic function calling with CallableTools (or MCP objects) and basic FunctionDeclarations is not yet supported. Incompatible tools found at ${formattedIndexes}.`);
            }
            let response;
            let functionResponseContent;
            const automaticFunctionCallingHistory = tContents(transformedParams.contents);
            const maxRemoteCalls = (_c = (_b = (_a = transformedParams.config) === null || _a === void 0 ? void 0 : _a.automaticFunctionCalling) === null || _b === void 0 ? void 0 : _b.maximumRemoteCalls) !== null && _c !== void 0 ? _c : DEFAULT_MAX_REMOTE_CALLS;
            let remoteCalls = 0;
            while (remoteCalls < maxRemoteCalls) {
                response = await this.generateContentInternal(transformedParams);
                if (!response.functionCalls || response.functionCalls.length === 0) {
                    break;
                }
                const responseContent = response.candidates[0].content;
                const functionResponseParts = [];
                for (const tool of (_e = (_d = params.config) === null || _d === void 0 ? void 0 : _d.tools) !== null && _e !== void 0 ? _e : []) {
                    if (isCallableTool(tool)) {
                        const callableTool = tool;
                        const parts = await callableTool.callTool(response.functionCalls);
                        functionResponseParts.push(...parts);
                    }
                }
                remoteCalls++;
                functionResponseContent = {
                    role: 'user',
                    parts: functionResponseParts,
                };
                transformedParams.contents = tContents(transformedParams.contents);
                transformedParams.contents.push(responseContent);
                transformedParams.contents.push(functionResponseContent);
                if (shouldAppendAfcHistory(transformedParams.config)) {
                    automaticFunctionCallingHistory.push(responseContent);
                    automaticFunctionCallingHistory.push(functionResponseContent);
                }
            }
            if (shouldAppendAfcHistory(transformedParams.config)) {
                response.automaticFunctionCallingHistory =
                    automaticFunctionCallingHistory;
            }
            return response;
        };
        /**
         * Makes an API request to generate content with a given model and yields the
         * response in chunks.
         *
         * For the `model` parameter, supported formats for Vertex AI API include:
         * - The Gemini model ID, for example: 'gemini-2.0-flash'
         * - The full resource name starts with 'projects/', for example:
         *  'projects/my-project-id/locations/us-central1/publishers/google/models/gemini-2.0-flash'
         * - The partial resource name with 'publishers/', for example:
         *  'publishers/google/models/gemini-2.0-flash' or
         *  'publishers/meta/models/llama-3.1-405b-instruct-maas'
         * - `/` separated publisher and model name, for example:
         * 'google/gemini-2.0-flash' or 'meta/llama-3.1-405b-instruct-maas'
         *
         * For the `model` parameter, supported formats for Gemini API include:
         * - The Gemini model ID, for example: 'gemini-2.0-flash'
         * - The model name starts with 'models/', for example:
         *  'models/gemini-2.0-flash'
         * - For tuned models, the model name starts with 'tunedModels/',
         * for example:
         *  'tunedModels/1234567890123456789'
         *
         * Some models support multimodal input and output.
         *
         * @param params - The parameters for generating content with streaming response.
         * @return The response from generating content.
         *
         * @example
         * ```ts
         * const response = await ai.models.generateContentStream({
         *   model: 'gemini-2.0-flash',
         *   contents: 'why is the sky blue?',
         *   config: {
         *     maxOutputTokens: 200,
         *   }
         * });
         * for await (const chunk of response) {
         *   console.log(chunk);
         * }
         * ```
         */
        this.generateContentStream = async (params) => {
            var _a, _b, _c, _d, _e;
            this.maybeMoveToResponseJsonSchem(params);
            if (shouldDisableAfc(params.config)) {
                const transformedParams = await this.processParamsMaybeAddMcpUsage(params);
                return await this.generateContentStreamInternal(transformedParams);
            }
            const incompatibleToolIndexes = findAfcIncompatibleToolIndexes(params);
            if (incompatibleToolIndexes.length > 0) {
                const formattedIndexes = incompatibleToolIndexes
                    .map((index) => `tools[${index}]`)
                    .join(', ');
                throw new Error(`Incompatible tools found at ${formattedIndexes}. Automatic function calling with CallableTools (or MCP objects) and basic FunctionDeclarations" is not yet supported.`);
            }
            // With tool compatibility confirmed, validate that the configuration are
            // compatible with each other and raise an error if invalid.
            const streamFunctionCall = (_c = (_b = (_a = params === null || params === void 0 ? void 0 : params.config) === null || _a === void 0 ? void 0 : _a.toolConfig) === null || _b === void 0 ? void 0 : _b.functionCallingConfig) === null || _c === void 0 ? void 0 : _c.streamFunctionCallArguments;
            const disableAfc = (_e = (_d = params === null || params === void 0 ? void 0 : params.config) === null || _d === void 0 ? void 0 : _d.automaticFunctionCalling) === null || _e === void 0 ? void 0 : _e.disable;
            if (streamFunctionCall && !disableAfc) {
                throw new Error("Running in streaming mode with 'streamFunctionCallArguments' enabled, " +
                    'this feature is not compatible with automatic function calling (AFC). ' +
                    "Please set 'config.automaticFunctionCalling.disable' to true to disable AFC " +
                    "or leave 'config.toolConfig.functionCallingConfig.streamFunctionCallArguments' " +
                    'to be undefined or set to false to disable streaming function call arguments feature.');
            }
            return await this.processAfcStream(params);
        };
        /**
         * Generates an image based on a text description and configuration.
         *
         * @param params - The parameters for generating images.
         * @return The response from the API.
         *
         * @example
         * ```ts
         * const response = await client.models.generateImages({
         *  model: 'imagen-4.0-generate-001',
         *  prompt: 'Robot holding a red skateboard',
         *  config: {
         *    numberOfImages: 1,
         *    includeRaiReason: true,
         *  },
         * });
         * console.log(response?.generatedImages?.[0]?.image?.imageBytes);
         * ```
         */
        this.generateImages = async (params) => {
            return await this.generateImagesInternal(params).then((apiResponse) => {
                var _a;
                let positivePromptSafetyAttributes;
                const generatedImages = [];
                if (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.generatedImages) {
                    for (const generatedImage of apiResponse.generatedImages) {
                        if (generatedImage &&
                            (generatedImage === null || generatedImage === void 0 ? void 0 : generatedImage.safetyAttributes) &&
                            ((_a = generatedImage === null || generatedImage === void 0 ? void 0 : generatedImage.safetyAttributes) === null || _a === void 0 ? void 0 : _a.contentType) === 'Positive Prompt') {
                            positivePromptSafetyAttributes = generatedImage === null || generatedImage === void 0 ? void 0 : generatedImage.safetyAttributes;
                        }
                        else {
                            generatedImages.push(generatedImage);
                        }
                    }
                }
                let response;
                if (positivePromptSafetyAttributes) {
                    response = {
                        generatedImages: generatedImages,
                        positivePromptSafetyAttributes: positivePromptSafetyAttributes,
                        sdkHttpResponse: apiResponse.sdkHttpResponse,
                    };
                }
                else {
                    response = {
                        generatedImages: generatedImages,
                        sdkHttpResponse: apiResponse.sdkHttpResponse,
                    };
                }
                return response;
            });
        };
        this.list = async (params) => {
            var _a;
            const defaultConfig = {
                queryBase: true,
            };
            const actualConfig = Object.assign(Object.assign({}, defaultConfig), params === null || params === void 0 ? void 0 : params.config);
            const actualParams = {
                config: actualConfig,
            };
            if (this.apiClient.isVertexAI()) {
                if (!actualParams.config.queryBase) {
                    if ((_a = actualParams.config) === null || _a === void 0 ? void 0 : _a.filter) {
                        throw new Error('Filtering tuned models list for Vertex AI is not currently supported');
                    }
                    else {
                        actualParams.config.filter = 'labels.tune-type:*';
                    }
                }
            }
            return new Pager(PagedItem.PAGED_ITEM_MODELS, (x) => this.listInternal(x), await this.listInternal(actualParams), actualParams);
        };
        /**
         * Edits an image based on a prompt, list of reference images, and configuration.
         *
         * @param params - The parameters for editing an image.
         * @return The response from the API.
         *
         * @example
         * ```ts
         * const response = await client.models.editImage({
         *  model: 'imagen-3.0-capability-001',
         *  prompt: 'Generate an image containing a mug with the product logo [1] visible on the side of the mug.',
         *  referenceImages: [subjectReferenceImage]
         *  config: {
         *    numberOfImages: 1,
         *    includeRaiReason: true,
         *  },
         * });
         * console.log(response?.generatedImages?.[0]?.image?.imageBytes);
         * ```
         */
        this.editImage = async (params) => {
            const paramsInternal = {
                model: params.model,
                prompt: params.prompt,
                referenceImages: [],
                config: params.config,
            };
            if (params.referenceImages) {
                if (params.referenceImages) {
                    paramsInternal.referenceImages = params.referenceImages.map((img) => img.toReferenceImageAPI());
                }
            }
            return await this.editImageInternal(paramsInternal);
        };
        /**
         * Upscales an image based on an image, upscale factor, and configuration.
         * Only supported in Vertex AI currently.
         *
         * @param params - The parameters for upscaling an image.
         * @return The response from the API.
         *
         * @example
         * ```ts
         * const response = await client.models.upscaleImage({
         *  model: 'imagen-4.0-upscale-preview',
         *  image: image,
         *  upscaleFactor: 'x2',
         *  config: {
         *    includeRaiReason: true,
         *  },
         * });
         * console.log(response?.generatedImages?.[0]?.image?.imageBytes);
         * ```
         */
        this.upscaleImage = async (params) => {
            let apiConfig = {
                numberOfImages: 1,
                mode: 'upscale',
            };
            if (params.config) {
                apiConfig = Object.assign(Object.assign({}, apiConfig), params.config);
            }
            const apiParams = {
                model: params.model,
                image: params.image,
                upscaleFactor: params.upscaleFactor,
                config: apiConfig,
            };
            return await this.upscaleImageInternal(apiParams);
        };
        /**
         *  Generates videos based on a text description and configuration.
         *
         * @param params - The parameters for generating videos.
         * @return A Promise<GenerateVideosOperation> which allows you to track the progress and eventually retrieve the generated videos using the operations.get method.
         *
         * @example
         * ```ts
         * const operation = await ai.models.generateVideos({
         *  model: 'veo-2.0-generate-001',
         *  source: {
         *    prompt: 'A neon hologram of a cat driving at top speed',
         *  },
         *  config: {
         *    numberOfVideos: 1
         * });
         *
         * while (!operation.done) {
         *   await new Promise(resolve => setTimeout(resolve, 10000));
         *   operation = await ai.operations.getVideosOperation({operation: operation});
         * }
         *
         * console.log(operation.response?.generatedVideos?.[0]?.video?.uri);
         * ```
         */
        this.generateVideos = async (params) => {
            var _a, _b, _c, _d, _e, _f;
            if ((params.prompt || params.image || params.video) && params.source) {
                throw new Error('Source and prompt/image/video are mutually exclusive. Please only use source.');
            }
            // Gemini API does not support video bytes.
            if (!this.apiClient.isVertexAI()) {
                if (((_a = params.video) === null || _a === void 0 ? void 0 : _a.uri) && ((_b = params.video) === null || _b === void 0 ? void 0 : _b.videoBytes)) {
                    params.video = {
                        uri: params.video.uri,
                        mimeType: params.video.mimeType,
                    };
                }
                else if (((_d = (_c = params.source) === null || _c === void 0 ? void 0 : _c.video) === null || _d === void 0 ? void 0 : _d.uri) &&
                    ((_f = (_e = params.source) === null || _e === void 0 ? void 0 : _e.video) === null || _f === void 0 ? void 0 : _f.videoBytes)) {
                    params.source.video = {
                        uri: params.source.video.uri,
                        mimeType: params.source.video.mimeType,
                    };
                }
            }
            return await this.generateVideosInternal(params);
        };
    }
    /**
     * This logic is needed for GenerateContentConfig only.
     * Previously we made GenerateContentConfig.responseSchema field to accept
     * unknown. Since v1.9.0, we switch to use backend JSON schema support.
     * To maintain backward compatibility, we move the data that was treated as
     * JSON schema from the responseSchema field to the responseJsonSchema field.
     */
    maybeMoveToResponseJsonSchem(params) {
        if (params.config && params.config.responseSchema) {
            if (!params.config.responseJsonSchema) {
                if (Object.keys(params.config.responseSchema).includes('$schema')) {
                    params.config.responseJsonSchema = params.config.responseSchema;
                    delete params.config.responseSchema;
                }
            }
        }
        return;
    }
    /**
     * Transforms the CallableTools in the parameters to be simply Tools, it
     * copies the params into a new object and replaces the tools, it does not
     * modify the original params. Also sets the MCP usage header if there are
     * MCP tools in the parameters.
     */
    async processParamsMaybeAddMcpUsage(params) {
        var _a, _b, _c;
        const tools = (_a = params.config) === null || _a === void 0 ? void 0 : _a.tools;
        if (!tools) {
            return params;
        }
        const transformedTools = await Promise.all(tools.map(async (tool) => {
            if (isCallableTool(tool)) {
                const callableTool = tool;
                return await callableTool.tool();
            }
            return tool;
        }));
        const newParams = {
            model: params.model,
            contents: params.contents,
            config: Object.assign(Object.assign({}, params.config), { tools: transformedTools }),
        };
        newParams.config.tools = transformedTools;
        if (params.config &&
            params.config.tools &&
            hasMcpToolUsage(params.config.tools)) {
            const headers = (_c = (_b = params.config.httpOptions) === null || _b === void 0 ? void 0 : _b.headers) !== null && _c !== void 0 ? _c : {};
            let newHeaders = Object.assign({}, headers);
            if (Object.keys(newHeaders).length === 0) {
                newHeaders = this.apiClient.getDefaultHeaders();
            }
            setMcpUsageHeader(newHeaders);
            newParams.config.httpOptions = Object.assign(Object.assign({}, params.config.httpOptions), { headers: newHeaders });
        }
        return newParams;
    }
    async initAfcToolsMap(params) {
        var _a, _b, _c;
        const afcTools = new Map();
        for (const tool of (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.tools) !== null && _b !== void 0 ? _b : []) {
            if (isCallableTool(tool)) {
                const callableTool = tool;
                const toolDeclaration = await callableTool.tool();
                for (const declaration of (_c = toolDeclaration.functionDeclarations) !== null && _c !== void 0 ? _c : []) {
                    if (!declaration.name) {
                        throw new Error('Function declaration name is required.');
                    }
                    if (afcTools.has(declaration.name)) {
                        throw new Error(`Duplicate tool declaration name: ${declaration.name}`);
                    }
                    afcTools.set(declaration.name, callableTool);
                }
            }
        }
        return afcTools;
    }
    async processAfcStream(params) {
        var _a, _b, _c;
        const maxRemoteCalls = (_c = (_b = (_a = params.config) === null || _a === void 0 ? void 0 : _a.automaticFunctionCalling) === null || _b === void 0 ? void 0 : _b.maximumRemoteCalls) !== null && _c !== void 0 ? _c : DEFAULT_MAX_REMOTE_CALLS;
        let wereFunctionsCalled = false;
        let remoteCallCount = 0;
        const afcToolsMap = await this.initAfcToolsMap(params);
        return (function (models, afcTools, params) {
            return __asyncGenerator(this, arguments, function* () {
                var _a, e_1, _b, _c;
                var _d, _e;
                while (remoteCallCount < maxRemoteCalls) {
                    if (wereFunctionsCalled) {
                        remoteCallCount++;
                        wereFunctionsCalled = false;
                    }
                    const transformedParams = yield __await(models.processParamsMaybeAddMcpUsage(params));
                    const response = yield __await(models.generateContentStreamInternal(transformedParams));
                    const functionResponses = [];
                    const responseContents = [];
                    try {
                        for (var _f = true, response_1 = (e_1 = void 0, __asyncValues(response)), response_1_1; response_1_1 = yield __await(response_1.next()), _a = response_1_1.done, !_a; _f = true) {
                            _c = response_1_1.value;
                            _f = false;
                            const chunk = _c;
                            yield yield __await(chunk);
                            if (chunk.candidates && ((_d = chunk.candidates[0]) === null || _d === void 0 ? void 0 : _d.content)) {
                                responseContents.push(chunk.candidates[0].content);
                                for (const part of (_e = chunk.candidates[0].content.parts) !== null && _e !== void 0 ? _e : []) {
                                    if (remoteCallCount < maxRemoteCalls && part.functionCall) {
                                        if (!part.functionCall.name) {
                                            throw new Error('Function call name was not returned by the model.');
                                        }
                                        if (!afcTools.has(part.functionCall.name)) {
                                            throw new Error(`Automatic function calling was requested, but not all the tools the model used implement the CallableTool interface. Available tools: ${afcTools.keys()}, mising tool: ${part.functionCall.name}`);
                                        }
                                        else {
                                            const responseParts = yield __await(afcTools
                                                .get(part.functionCall.name)
                                                .callTool([part.functionCall]));
                                            functionResponses.push(...responseParts);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_f && !_a && (_b = response_1.return)) yield __await(_b.call(response_1));
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (functionResponses.length > 0) {
                        wereFunctionsCalled = true;
                        const typedResponseChunk = new GenerateContentResponse();
                        typedResponseChunk.candidates = [
                            {
                                content: {
                                    role: 'user',
                                    parts: functionResponses,
                                },
                            },
                        ];
                        yield yield __await(typedResponseChunk);
                        const newContents = [];
                        newContents.push(...responseContents);
                        newContents.push({
                            role: 'user',
                            parts: functionResponses,
                        });
                        const updatedContents = tContents(params.contents).concat(newContents);
                        params.contents = updatedContents;
                    }
                    else {
                        break;
                    }
                }
            });
        })(this, afcToolsMap, params);
    }
    async generateContentInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = generateContentParametersToVertex(this.apiClient, params);
            path = formatMap('{model}:generateContent', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = generateContentResponseFromVertex(apiResponse);
                const typedResp = new GenerateContentResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = generateContentParametersToMldev(this.apiClient, params);
            path = formatMap('{model}:generateContent', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = generateContentResponseFromMldev(apiResponse);
                const typedResp = new GenerateContentResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    async generateContentStreamInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = generateContentParametersToVertex(this.apiClient, params);
            path = formatMap('{model}:streamGenerateContent?alt=sse', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            const apiClient = this.apiClient;
            response = apiClient.requestStream({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            });
            return response.then(function (apiResponse) {
                return __asyncGenerator(this, arguments, function* () {
                    var _a, e_2, _b, _c;
                    try {
                        for (var _d = true, apiResponse_1 = __asyncValues(apiResponse), apiResponse_1_1; apiResponse_1_1 = yield __await(apiResponse_1.next()), _a = apiResponse_1_1.done, !_a; _d = true) {
                            _c = apiResponse_1_1.value;
                            _d = false;
                            const chunk = _c;
                            const resp = generateContentResponseFromVertex((yield __await(chunk.json())), params);
                            resp['sdkHttpResponse'] = {
                                headers: chunk.headers,
                            };
                            const typedResp = new GenerateContentResponse();
                            Object.assign(typedResp, resp);
                            yield yield __await(typedResp);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = apiResponse_1.return)) yield __await(_b.call(apiResponse_1));
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                });
            });
        }
        else {
            const body = generateContentParametersToMldev(this.apiClient, params);
            path = formatMap('{model}:streamGenerateContent?alt=sse', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            const apiClient = this.apiClient;
            response = apiClient.requestStream({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            });
            return response.then(function (apiResponse) {
                return __asyncGenerator(this, arguments, function* () {
                    var _a, e_3, _b, _c;
                    try {
                        for (var _d = true, apiResponse_2 = __asyncValues(apiResponse), apiResponse_2_1; apiResponse_2_1 = yield __await(apiResponse_2.next()), _a = apiResponse_2_1.done, !_a; _d = true) {
                            _c = apiResponse_2_1.value;
                            _d = false;
                            const chunk = _c;
                            const resp = generateContentResponseFromMldev((yield __await(chunk.json())), params);
                            resp['sdkHttpResponse'] = {
                                headers: chunk.headers,
                            };
                            const typedResp = new GenerateContentResponse();
                            Object.assign(typedResp, resp);
                            yield yield __await(typedResp);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = apiResponse_2.return)) yield __await(_b.call(apiResponse_2));
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                });
            });
        }
    }
    /**
     * Calculates embeddings for the given contents. Only text is supported.
     *
     * @param params - The parameters for embedding contents.
     * @return The response from the API.
     *
     * @example
     * ```ts
     * const response = await ai.models.embedContent({
     *  model: 'text-embedding-004',
     *  contents: [
     *    'What is your name?',
     *    'What is your favorite color?',
     *  ],
     *  config: {
     *    outputDimensionality: 64,
     *  },
     * });
     * console.log(response);
     * ```
     */
    async embedContentInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = embedContentParametersPrivateToVertex(this.apiClient, params, params);
            const endpointUrl = tIsVertexEmbedContentModel(params.model)
                ? '{model}:embedContent'
                : '{model}:predict';
            path = formatMap(endpointUrl, body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = embedContentResponseFromVertex(apiResponse, params);
                const typedResp = new EmbedContentResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = embedContentParametersPrivateToMldev(this.apiClient, params);
            path = formatMap('{model}:batchEmbedContents', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = embedContentResponseFromMldev(apiResponse);
                const typedResp = new EmbedContentResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Private method for generating images.
     */
    async generateImagesInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = generateImagesParametersToVertex(this.apiClient, params);
            path = formatMap('{model}:predict', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = generateImagesResponseFromVertex(apiResponse);
                const typedResp = new GenerateImagesResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = generateImagesParametersToMldev(this.apiClient, params);
            path = formatMap('{model}:predict', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = generateImagesResponseFromMldev(apiResponse);
                const typedResp = new GenerateImagesResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Private method for editing an image.
     */
    async editImageInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = editImageParametersInternalToVertex(this.apiClient, params);
            path = formatMap('{model}:predict', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = editImageResponseFromVertex(apiResponse);
                const typedResp = new EditImageResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            throw new Error('This method is only supported by the Vertex AI.');
        }
    }
    /**
     * Private method for upscaling an image.
     */
    async upscaleImageInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = upscaleImageAPIParametersInternalToVertex(this.apiClient, params);
            path = formatMap('{model}:predict', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = upscaleImageResponseFromVertex(apiResponse);
                const typedResp = new UpscaleImageResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            throw new Error('This method is only supported by the Vertex AI.');
        }
    }
    /**
     * Recontextualizes an image.
     *
     * There are two types of recontextualization currently supported:
     * 1) Imagen Product Recontext - Generate images of products in new scenes
     *    and contexts.
     * 2) Virtual Try-On: Generate images of persons modeling fashion products.
     *
     * @param params - The parameters for recontextualizing an image.
     * @return The response from the API.
     *
     * @example
     * ```ts
     * const response1 = await ai.models.recontextImage({
     *  model: 'imagen-product-recontext-preview-06-30',
     *  source: {
     *    prompt: 'In a modern kitchen setting.',
     *    productImages: [productImage],
     *  },
     *  config: {
     *    numberOfImages: 1,
     *  },
     * });
     * console.log(response1?.generatedImages?.[0]?.image?.imageBytes);
     *
     * const response2 = await ai.models.recontextImage({
     *  model: 'virtual-try-on-001',
     *  source: {
     *    personImage: personImage,
     *    productImages: [productImage],
     *  },
     *  config: {
     *    numberOfImages: 1,
     *  },
     * });
     * console.log(response2?.generatedImages?.[0]?.image?.imageBytes);
     * ```
     */
    async recontextImage(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = recontextImageParametersToVertex(this.apiClient, params);
            path = formatMap('{model}:predict', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = recontextImageResponseFromVertex(apiResponse);
                const typedResp = new RecontextImageResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            throw new Error('This method is only supported by the Vertex AI.');
        }
    }
    /**
     * Segments an image, creating a mask of a specified area.
     *
     * @param params - The parameters for segmenting an image.
     * @return The response from the API.
     *
     * @example
     * ```ts
     * const response = await ai.models.segmentImage({
     *  model: 'image-segmentation-001',
     *  source: {
     *    image: image,
     *  },
     *  config: {
     *    mode: 'foreground',
     *  },
     * });
     * console.log(response?.generatedMasks?.[0]?.mask?.imageBytes);
     * ```
     */
    async segmentImage(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = segmentImageParametersToVertex(this.apiClient, params);
            path = formatMap('{model}:predict', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = segmentImageResponseFromVertex(apiResponse);
                const typedResp = new SegmentImageResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            throw new Error('This method is only supported by the Vertex AI.');
        }
    }
    /**
     * Fetches information about a model by name.
     *
     * @example
     * ```ts
     * const modelInfo = await ai.models.get({model: 'gemini-2.0-flash'});
     * ```
     */
    async get(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = getModelParametersToVertex(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = modelFromVertex(apiResponse);
                return resp;
            });
        }
        else {
            const body = getModelParametersToMldev(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = modelFromMldev(apiResponse);
                return resp;
            });
        }
    }
    async listInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = listModelsParametersToVertex(this.apiClient, params);
            path = formatMap('{models_url}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = listModelsResponseFromVertex(apiResponse);
                const typedResp = new ListModelsResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = listModelsParametersToMldev(this.apiClient, params);
            path = formatMap('{models_url}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = listModelsResponseFromMldev(apiResponse);
                const typedResp = new ListModelsResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Updates a tuned model by its name.
     *
     * @param params - The parameters for updating the model.
     * @return The response from the API.
     *
     * @example
     * ```ts
     * const response = await ai.models.update({
     *   model: 'tuned-model-name',
     *   config: {
     *     displayName: 'New display name',
     *     description: 'New description',
     *   },
     * });
     * ```
     */
    async update(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = updateModelParametersToVertex(this.apiClient, params);
            path = formatMap('{model}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'PATCH',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = modelFromVertex(apiResponse);
                return resp;
            });
        }
        else {
            const body = updateModelParametersToMldev(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'PATCH',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = modelFromMldev(apiResponse);
                return resp;
            });
        }
    }
    /**
     * Deletes a tuned model by its name.
     *
     * @param params - The parameters for deleting the model.
     * @return The response from the API.
     *
     * @example
     * ```ts
     * const response = await ai.models.delete({model: 'tuned-model-name'});
     * ```
     */
    async delete(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = deleteModelParametersToVertex(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'DELETE',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = deleteModelResponseFromVertex(apiResponse);
                const typedResp = new DeleteModelResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = deleteModelParametersToMldev(this.apiClient, params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'DELETE',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = deleteModelResponseFromMldev(apiResponse);
                const typedResp = new DeleteModelResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Counts the number of tokens in the given contents. Multimodal input is
     * supported for Gemini models.
     *
     * @param params - The parameters for counting tokens.
     * @return The response from the API.
     *
     * @example
     * ```ts
     * const response = await ai.models.countTokens({
     *  model: 'gemini-2.0-flash',
     *  contents: 'The quick brown fox jumps over the lazy dog.'
     * });
     * console.log(response);
     * ```
     */
    async countTokens(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = countTokensParametersToVertex(this.apiClient, params);
            path = formatMap('{model}:countTokens', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = countTokensResponseFromVertex(apiResponse);
                const typedResp = new CountTokensResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = countTokensParametersToMldev(this.apiClient, params);
            path = formatMap('{model}:countTokens', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = countTokensResponseFromMldev(apiResponse);
                const typedResp = new CountTokensResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Given a list of contents, returns a corresponding TokensInfo containing
     * the list of tokens and list of token ids.
     *
     * This method is not supported by the Gemini Developer API.
     *
     * @param params - The parameters for computing tokens.
     * @return The response from the API.
     *
     * @example
     * ```ts
     * const response = await ai.models.computeTokens({
     *  model: 'gemini-2.0-flash',
     *  contents: 'What is your name?'
     * });
     * console.log(response);
     * ```
     */
    async computeTokens(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = computeTokensParametersToVertex(this.apiClient, params);
            path = formatMap('{model}:computeTokens', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = computeTokensResponseFromVertex(apiResponse);
                const typedResp = new ComputeTokensResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            throw new Error('This method is only supported by the Vertex AI.');
        }
    }
    /**
     * Private method for generating videos.
     */
    async generateVideosInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = generateVideosParametersToVertex(this.apiClient, params);
            path = formatMap('{model}:predictLongRunning', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = generateVideosOperationFromVertex(apiResponse);
                const typedResp = new GenerateVideosOperation();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = generateVideosParametersToMldev(this.apiClient, params);
            path = formatMap('{model}:predictLongRunning', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = generateVideosOperationFromMldev(apiResponse);
                const typedResp = new GenerateVideosOperation();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Operations extends BaseModule {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
    }
    /**
     * Gets the status of a long-running operation.
     *
     * @param parameters The parameters for the get operation request.
     * @return The updated Operation object, with the latest status or result.
     */
    async getVideosOperation(parameters) {
        const operation = parameters.operation;
        const config = parameters.config;
        if (operation.name === undefined || operation.name === '') {
            throw new Error('Operation name is required.');
        }
        if (this.apiClient.isVertexAI()) {
            const resourceName = operation.name.split('/operations/')[0];
            let httpOptions = undefined;
            if (config && 'httpOptions' in config) {
                httpOptions = config.httpOptions;
            }
            const rawOperation = await this.fetchPredictVideosOperationInternal({
                operationName: operation.name,
                resourceName: resourceName,
                config: { httpOptions: httpOptions },
            });
            return operation._fromAPIResponse({
                apiResponse: rawOperation,
                _isVertexAI: true,
            });
        }
        else {
            const rawOperation = await this.getVideosOperationInternal({
                operationName: operation.name,
                config: config,
            });
            return operation._fromAPIResponse({
                apiResponse: rawOperation,
                _isVertexAI: false,
            });
        }
    }
    /**
     * Gets the status of a long-running operation.
     *
     * @param parameters The parameters for the get operation request.
     * @return The updated Operation object, with the latest status or result.
     */
    async get(parameters) {
        const operation = parameters.operation;
        const config = parameters.config;
        if (operation.name === undefined || operation.name === '') {
            throw new Error('Operation name is required.');
        }
        if (this.apiClient.isVertexAI()) {
            const resourceName = operation.name.split('/operations/')[0];
            let httpOptions = undefined;
            if (config && 'httpOptions' in config) {
                httpOptions = config.httpOptions;
            }
            const rawOperation = await this.fetchPredictVideosOperationInternal({
                operationName: operation.name,
                resourceName: resourceName,
                config: { httpOptions: httpOptions },
            });
            return operation._fromAPIResponse({
                apiResponse: rawOperation,
                _isVertexAI: true,
            });
        }
        else {
            const rawOperation = await this.getVideosOperationInternal({
                operationName: operation.name,
                config: config,
            });
            return operation._fromAPIResponse({
                apiResponse: rawOperation,
                _isVertexAI: false,
            });
        }
    }
    async getVideosOperationInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = getOperationParametersToVertex(params);
            path = formatMap('{operationName}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response;
        }
        else {
            const body = getOperationParametersToMldev(params);
            path = formatMap('{operationName}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response;
        }
    }
    async fetchPredictVideosOperationInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = fetchPredictOperationParametersToVertex(params);
            path = formatMap('{resourceName}:fetchPredictOperation', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response;
        }
        else {
            throw new Error('This method is only supported by the Vertex AI.');
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function audioTranscriptionConfigToMldev(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['languageCodes']) !== undefined) {
        throw new Error('languageCodes parameter is not supported in Gemini API.');
    }
    return toObject;
}
function authConfigToMldev(fromObject) {
    const toObject = {};
    const fromApiKey = getValueByPath(fromObject, ['apiKey']);
    if (fromApiKey != null) {
        setValueByPath(toObject, ['apiKey'], fromApiKey);
    }
    if (getValueByPath(fromObject, ['apiKeyConfig']) !== undefined) {
        throw new Error('apiKeyConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['authType']) !== undefined) {
        throw new Error('authType parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['googleServiceAccountConfig']) !==
        undefined) {
        throw new Error('googleServiceAccountConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['httpBasicAuthConfig']) !== undefined) {
        throw new Error('httpBasicAuthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oauthConfig']) !== undefined) {
        throw new Error('oauthConfig parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['oidcConfig']) !== undefined) {
        throw new Error('oidcConfig parameter is not supported in Gemini API.');
    }
    return toObject;
}
function blobToMldev(fromObject) {
    const toObject = {};
    const fromData = getValueByPath(fromObject, ['data']);
    if (fromData != null) {
        setValueByPath(toObject, ['data'], fromData);
    }
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function contentToMldev(fromObject) {
    const toObject = {};
    const fromParts = getValueByPath(fromObject, ['parts']);
    if (fromParts != null) {
        let transformedList = fromParts;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return partToMldev(item);
            });
        }
        setValueByPath(toObject, ['parts'], transformedList);
    }
    const fromRole = getValueByPath(fromObject, ['role']);
    if (fromRole != null) {
        setValueByPath(toObject, ['role'], fromRole);
    }
    return toObject;
}
function createAuthTokenConfigToMldev(apiClient, fromObject, parentObject) {
    const toObject = {};
    const fromExpireTime = getValueByPath(fromObject, ['expireTime']);
    if (parentObject !== undefined && fromExpireTime != null) {
        setValueByPath(parentObject, ['expireTime'], fromExpireTime);
    }
    const fromNewSessionExpireTime = getValueByPath(fromObject, [
        'newSessionExpireTime',
    ]);
    if (parentObject !== undefined && fromNewSessionExpireTime != null) {
        setValueByPath(parentObject, ['newSessionExpireTime'], fromNewSessionExpireTime);
    }
    const fromUses = getValueByPath(fromObject, ['uses']);
    if (parentObject !== undefined && fromUses != null) {
        setValueByPath(parentObject, ['uses'], fromUses);
    }
    const fromLiveConnectConstraints = getValueByPath(fromObject, [
        'liveConnectConstraints',
    ]);
    if (parentObject !== undefined && fromLiveConnectConstraints != null) {
        setValueByPath(parentObject, ['bidiGenerateContentSetup'], liveConnectConstraintsToMldev(apiClient, fromLiveConnectConstraints));
    }
    const fromLockAdditionalFields = getValueByPath(fromObject, [
        'lockAdditionalFields',
    ]);
    if (parentObject !== undefined && fromLockAdditionalFields != null) {
        setValueByPath(parentObject, ['fieldMask'], fromLockAdditionalFields);
    }
    return toObject;
}
function createAuthTokenParametersToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        setValueByPath(toObject, ['config'], createAuthTokenConfigToMldev(apiClient, fromConfig, toObject));
    }
    return toObject;
}
function fileDataToMldev(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['displayName']) !== undefined) {
        throw new Error('displayName parameter is not supported in Gemini API.');
    }
    const fromFileUri = getValueByPath(fromObject, ['fileUri']);
    if (fromFileUri != null) {
        setValueByPath(toObject, ['fileUri'], fromFileUri);
    }
    const fromMimeType = getValueByPath(fromObject, ['mimeType']);
    if (fromMimeType != null) {
        setValueByPath(toObject, ['mimeType'], fromMimeType);
    }
    return toObject;
}
function functionCallToMldev(fromObject) {
    const toObject = {};
    const fromId = getValueByPath(fromObject, ['id']);
    if (fromId != null) {
        setValueByPath(toObject, ['id'], fromId);
    }
    const fromArgs = getValueByPath(fromObject, ['args']);
    if (fromArgs != null) {
        setValueByPath(toObject, ['args'], fromArgs);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    if (getValueByPath(fromObject, ['partialArgs']) !== undefined) {
        throw new Error('partialArgs parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['willContinue']) !== undefined) {
        throw new Error('willContinue parameter is not supported in Gemini API.');
    }
    return toObject;
}
function googleMapsToMldev(fromObject) {
    const toObject = {};
    const fromAuthConfig = getValueByPath(fromObject, ['authConfig']);
    if (fromAuthConfig != null) {
        setValueByPath(toObject, ['authConfig'], authConfigToMldev(fromAuthConfig));
    }
    const fromEnableWidget = getValueByPath(fromObject, ['enableWidget']);
    if (fromEnableWidget != null) {
        setValueByPath(toObject, ['enableWidget'], fromEnableWidget);
    }
    return toObject;
}
function googleSearchToMldev(fromObject) {
    const toObject = {};
    const fromSearchTypes = getValueByPath(fromObject, ['searchTypes']);
    if (fromSearchTypes != null) {
        setValueByPath(toObject, ['searchTypes'], fromSearchTypes);
    }
    if (getValueByPath(fromObject, ['blockingConfidence']) !== undefined) {
        throw new Error('blockingConfidence parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['excludeDomains']) !== undefined) {
        throw new Error('excludeDomains parameter is not supported in Gemini API.');
    }
    const fromTimeRangeFilter = getValueByPath(fromObject, [
        'timeRangeFilter',
    ]);
    if (fromTimeRangeFilter != null) {
        setValueByPath(toObject, ['timeRangeFilter'], fromTimeRangeFilter);
    }
    return toObject;
}
function liveConnectConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromGenerationConfig = getValueByPath(fromObject, [
        'generationConfig',
    ]);
    if (parentObject !== undefined && fromGenerationConfig != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig'], fromGenerationConfig);
    }
    const fromResponseModalities = getValueByPath(fromObject, [
        'responseModalities',
    ]);
    if (parentObject !== undefined && fromResponseModalities != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'responseModalities'], fromResponseModalities);
    }
    const fromTemperature = getValueByPath(fromObject, ['temperature']);
    if (parentObject !== undefined && fromTemperature != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'temperature'], fromTemperature);
    }
    const fromTopP = getValueByPath(fromObject, ['topP']);
    if (parentObject !== undefined && fromTopP != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'topP'], fromTopP);
    }
    const fromTopK = getValueByPath(fromObject, ['topK']);
    if (parentObject !== undefined && fromTopK != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'topK'], fromTopK);
    }
    const fromMaxOutputTokens = getValueByPath(fromObject, [
        'maxOutputTokens',
    ]);
    if (parentObject !== undefined && fromMaxOutputTokens != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'maxOutputTokens'], fromMaxOutputTokens);
    }
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (parentObject !== undefined && fromMediaResolution != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'mediaResolution'], fromMediaResolution);
    }
    const fromSeed = getValueByPath(fromObject, ['seed']);
    if (parentObject !== undefined && fromSeed != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'seed'], fromSeed);
    }
    const fromSpeechConfig = getValueByPath(fromObject, ['speechConfig']);
    if (parentObject !== undefined && fromSpeechConfig != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'speechConfig'], tLiveSpeechConfig(fromSpeechConfig));
    }
    const fromThinkingConfig = getValueByPath(fromObject, [
        'thinkingConfig',
    ]);
    if (parentObject !== undefined && fromThinkingConfig != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'thinkingConfig'], fromThinkingConfig);
    }
    const fromEnableAffectiveDialog = getValueByPath(fromObject, [
        'enableAffectiveDialog',
    ]);
    if (parentObject !== undefined && fromEnableAffectiveDialog != null) {
        setValueByPath(parentObject, ['setup', 'generationConfig', 'enableAffectiveDialog'], fromEnableAffectiveDialog);
    }
    const fromSystemInstruction = getValueByPath(fromObject, [
        'systemInstruction',
    ]);
    if (parentObject !== undefined && fromSystemInstruction != null) {
        setValueByPath(parentObject, ['setup', 'systemInstruction'], contentToMldev(tContent(fromSystemInstruction)));
    }
    const fromTools = getValueByPath(fromObject, ['tools']);
    if (parentObject !== undefined && fromTools != null) {
        let transformedList = tTools(fromTools);
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return toolToMldev(tTool(item));
            });
        }
        setValueByPath(parentObject, ['setup', 'tools'], transformedList);
    }
    const fromSessionResumption = getValueByPath(fromObject, [
        'sessionResumption',
    ]);
    if (parentObject !== undefined && fromSessionResumption != null) {
        setValueByPath(parentObject, ['setup', 'sessionResumption'], sessionResumptionConfigToMldev(fromSessionResumption));
    }
    const fromInputAudioTranscription = getValueByPath(fromObject, [
        'inputAudioTranscription',
    ]);
    if (parentObject !== undefined && fromInputAudioTranscription != null) {
        setValueByPath(parentObject, ['setup', 'inputAudioTranscription'], audioTranscriptionConfigToMldev(fromInputAudioTranscription));
    }
    const fromOutputAudioTranscription = getValueByPath(fromObject, [
        'outputAudioTranscription',
    ]);
    if (parentObject !== undefined && fromOutputAudioTranscription != null) {
        setValueByPath(parentObject, ['setup', 'outputAudioTranscription'], audioTranscriptionConfigToMldev(fromOutputAudioTranscription));
    }
    const fromRealtimeInputConfig = getValueByPath(fromObject, [
        'realtimeInputConfig',
    ]);
    if (parentObject !== undefined && fromRealtimeInputConfig != null) {
        setValueByPath(parentObject, ['setup', 'realtimeInputConfig'], fromRealtimeInputConfig);
    }
    const fromContextWindowCompression = getValueByPath(fromObject, [
        'contextWindowCompression',
    ]);
    if (parentObject !== undefined && fromContextWindowCompression != null) {
        setValueByPath(parentObject, ['setup', 'contextWindowCompression'], fromContextWindowCompression);
    }
    const fromProactivity = getValueByPath(fromObject, ['proactivity']);
    if (parentObject !== undefined && fromProactivity != null) {
        setValueByPath(parentObject, ['setup', 'proactivity'], fromProactivity);
    }
    if (getValueByPath(fromObject, ['explicitVadSignal']) !== undefined) {
        throw new Error('explicitVadSignal parameter is not supported in Gemini API.');
    }
    return toObject;
}
function liveConnectConstraintsToMldev(apiClient, fromObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['model']);
    if (fromModel != null) {
        setValueByPath(toObject, ['setup', 'model'], tModel(apiClient, fromModel));
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        setValueByPath(toObject, ['config'], liveConnectConfigToMldev(fromConfig, toObject));
    }
    return toObject;
}
function partToMldev(fromObject) {
    const toObject = {};
    const fromMediaResolution = getValueByPath(fromObject, [
        'mediaResolution',
    ]);
    if (fromMediaResolution != null) {
        setValueByPath(toObject, ['mediaResolution'], fromMediaResolution);
    }
    const fromCodeExecutionResult = getValueByPath(fromObject, [
        'codeExecutionResult',
    ]);
    if (fromCodeExecutionResult != null) {
        setValueByPath(toObject, ['codeExecutionResult'], fromCodeExecutionResult);
    }
    const fromExecutableCode = getValueByPath(fromObject, [
        'executableCode',
    ]);
    if (fromExecutableCode != null) {
        setValueByPath(toObject, ['executableCode'], fromExecutableCode);
    }
    const fromFileData = getValueByPath(fromObject, ['fileData']);
    if (fromFileData != null) {
        setValueByPath(toObject, ['fileData'], fileDataToMldev(fromFileData));
    }
    const fromFunctionCall = getValueByPath(fromObject, ['functionCall']);
    if (fromFunctionCall != null) {
        setValueByPath(toObject, ['functionCall'], functionCallToMldev(fromFunctionCall));
    }
    const fromFunctionResponse = getValueByPath(fromObject, [
        'functionResponse',
    ]);
    if (fromFunctionResponse != null) {
        setValueByPath(toObject, ['functionResponse'], fromFunctionResponse);
    }
    const fromInlineData = getValueByPath(fromObject, ['inlineData']);
    if (fromInlineData != null) {
        setValueByPath(toObject, ['inlineData'], blobToMldev(fromInlineData));
    }
    const fromText = getValueByPath(fromObject, ['text']);
    if (fromText != null) {
        setValueByPath(toObject, ['text'], fromText);
    }
    const fromThought = getValueByPath(fromObject, ['thought']);
    if (fromThought != null) {
        setValueByPath(toObject, ['thought'], fromThought);
    }
    const fromThoughtSignature = getValueByPath(fromObject, [
        'thoughtSignature',
    ]);
    if (fromThoughtSignature != null) {
        setValueByPath(toObject, ['thoughtSignature'], fromThoughtSignature);
    }
    const fromVideoMetadata = getValueByPath(fromObject, [
        'videoMetadata',
    ]);
    if (fromVideoMetadata != null) {
        setValueByPath(toObject, ['videoMetadata'], fromVideoMetadata);
    }
    const fromToolCall = getValueByPath(fromObject, ['toolCall']);
    if (fromToolCall != null) {
        setValueByPath(toObject, ['toolCall'], fromToolCall);
    }
    const fromToolResponse = getValueByPath(fromObject, ['toolResponse']);
    if (fromToolResponse != null) {
        setValueByPath(toObject, ['toolResponse'], fromToolResponse);
    }
    const fromPartMetadata = getValueByPath(fromObject, ['partMetadata']);
    if (fromPartMetadata != null) {
        setValueByPath(toObject, ['partMetadata'], fromPartMetadata);
    }
    return toObject;
}
function sessionResumptionConfigToMldev(fromObject) {
    const toObject = {};
    const fromHandle = getValueByPath(fromObject, ['handle']);
    if (fromHandle != null) {
        setValueByPath(toObject, ['handle'], fromHandle);
    }
    if (getValueByPath(fromObject, ['transparent']) !== undefined) {
        throw new Error('transparent parameter is not supported in Gemini API.');
    }
    return toObject;
}
function toolToMldev(fromObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['retrieval']) !== undefined) {
        throw new Error('retrieval parameter is not supported in Gemini API.');
    }
    const fromComputerUse = getValueByPath(fromObject, ['computerUse']);
    if (fromComputerUse != null) {
        setValueByPath(toObject, ['computerUse'], fromComputerUse);
    }
    const fromFileSearch = getValueByPath(fromObject, ['fileSearch']);
    if (fromFileSearch != null) {
        setValueByPath(toObject, ['fileSearch'], fromFileSearch);
    }
    const fromGoogleSearch = getValueByPath(fromObject, ['googleSearch']);
    if (fromGoogleSearch != null) {
        setValueByPath(toObject, ['googleSearch'], googleSearchToMldev(fromGoogleSearch));
    }
    const fromGoogleMaps = getValueByPath(fromObject, ['googleMaps']);
    if (fromGoogleMaps != null) {
        setValueByPath(toObject, ['googleMaps'], googleMapsToMldev(fromGoogleMaps));
    }
    const fromCodeExecution = getValueByPath(fromObject, [
        'codeExecution',
    ]);
    if (fromCodeExecution != null) {
        setValueByPath(toObject, ['codeExecution'], fromCodeExecution);
    }
    if (getValueByPath(fromObject, ['enterpriseWebSearch']) !== undefined) {
        throw new Error('enterpriseWebSearch parameter is not supported in Gemini API.');
    }
    const fromFunctionDeclarations = getValueByPath(fromObject, [
        'functionDeclarations',
    ]);
    if (fromFunctionDeclarations != null) {
        let transformedList = fromFunctionDeclarations;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['functionDeclarations'], transformedList);
    }
    const fromGoogleSearchRetrieval = getValueByPath(fromObject, [
        'googleSearchRetrieval',
    ]);
    if (fromGoogleSearchRetrieval != null) {
        setValueByPath(toObject, ['googleSearchRetrieval'], fromGoogleSearchRetrieval);
    }
    if (getValueByPath(fromObject, ['parallelAiSearch']) !== undefined) {
        throw new Error('parallelAiSearch parameter is not supported in Gemini API.');
    }
    const fromUrlContext = getValueByPath(fromObject, ['urlContext']);
    if (fromUrlContext != null) {
        setValueByPath(toObject, ['urlContext'], fromUrlContext);
    }
    const fromMcpServers = getValueByPath(fromObject, ['mcpServers']);
    if (fromMcpServers != null) {
        let transformedList = fromMcpServers;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['mcpServers'], transformedList);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Returns a comma-separated list of field masks from a given object.
 *
 * @param setup The object to extract field masks from.
 * @return A comma-separated list of field masks.
 */
function getFieldMasks(setup) {
    const fields = [];
    for (const key in setup) {
        if (Object.prototype.hasOwnProperty.call(setup, key)) {
            const value = setup[key];
            // 2nd layer, recursively get field masks see TODO(b/418290100)
            if (typeof value === 'object' &&
                value != null &&
                Object.keys(value).length > 0) {
                const field = Object.keys(value).map((kk) => `${key}.${kk}`);
                fields.push(...field);
            }
            else {
                fields.push(key); // 1st layer
            }
        }
    }
    return fields.join(',');
}
/**
 * Converts bidiGenerateContentSetup.
 * @param requestDict - The request dictionary.
 * @param config - The configuration object.
 * @return - The modified request dictionary.
 */
function convertBidiSetupToTokenSetup(requestDict, config) {
    // Convert bidiGenerateContentSetup from bidiGenerateContentSetup.setup.
    let setupForMaskGeneration = null;
    const bidiGenerateContentSetupValue = requestDict['bidiGenerateContentSetup'];
    if (typeof bidiGenerateContentSetupValue === 'object' &&
        bidiGenerateContentSetupValue !== null &&
        'setup' in bidiGenerateContentSetupValue) {
        // Now we know bidiGenerateContentSetupValue is an object and has a 'setup'
        // property.
        const innerSetup = bidiGenerateContentSetupValue
            .setup;
        if (typeof innerSetup === 'object' && innerSetup !== null) {
            // Valid inner setup found.
            requestDict['bidiGenerateContentSetup'] = innerSetup;
            setupForMaskGeneration = innerSetup;
        }
        else {
            // `bidiGenerateContentSetupValue.setup` is not a valid object; treat as
            // if bidiGenerateContentSetup is invalid.
            delete requestDict['bidiGenerateContentSetup'];
        }
    }
    else if (bidiGenerateContentSetupValue !== undefined) {
        // `bidiGenerateContentSetup` exists but not in the expected
        // shape {setup: {...}}; treat as invalid.
        delete requestDict['bidiGenerateContentSetup'];
    }
    const preExistingFieldMask = requestDict['fieldMask'];
    // Handle mask generation setup.
    if (setupForMaskGeneration) {
        const generatedMaskFromBidi = getFieldMasks(setupForMaskGeneration);
        if (Array.isArray(config === null || config === void 0 ? void 0 : config.lockAdditionalFields) &&
            (config === null || config === void 0 ? void 0 : config.lockAdditionalFields.length) === 0) {
            // Case 1: lockAdditionalFields is an empty array. Lock only fields from
            // bidi setup.
            if (generatedMaskFromBidi) {
                // Only assign if mask is not empty
                requestDict['fieldMask'] = generatedMaskFromBidi;
            }
            else {
                delete requestDict['fieldMask']; // If mask is empty, effectively no
                // specific fields locked by bidi
            }
        }
        else if ((config === null || config === void 0 ? void 0 : config.lockAdditionalFields) &&
            config.lockAdditionalFields.length > 0 &&
            preExistingFieldMask !== null &&
            Array.isArray(preExistingFieldMask) &&
            preExistingFieldMask.length > 0) {
            // Case 2: Lock fields from bidi setup + additional fields
            // (preExistingFieldMask).
            const generationConfigFields = [
                'temperature',
                'topK',
                'topP',
                'maxOutputTokens',
                'responseModalities',
                'seed',
                'speechConfig',
            ];
            let mappedFieldsFromPreExisting = [];
            if (preExistingFieldMask.length > 0) {
                mappedFieldsFromPreExisting = preExistingFieldMask.map((field) => {
                    if (generationConfigFields.includes(field)) {
                        return `generationConfig.${field}`;
                    }
                    return field; // Keep original field name if not in
                    // generationConfigFields
                });
            }
            const finalMaskParts = [];
            if (generatedMaskFromBidi) {
                finalMaskParts.push(generatedMaskFromBidi);
            }
            if (mappedFieldsFromPreExisting.length > 0) {
                finalMaskParts.push(...mappedFieldsFromPreExisting);
            }
            if (finalMaskParts.length > 0) {
                requestDict['fieldMask'] = finalMaskParts.join(',');
            }
            else {
                // If no fields from bidi and no valid additional fields from
                // pre-existing mask.
                delete requestDict['fieldMask'];
            }
        }
        else {
            // Case 3: "Lock all fields" (meaning, don't send a field_mask, let server
            // defaults apply or all are mutable). This is hit if:
            //  - `config.lockAdditionalFields` is undefined.
            //  - `config.lockAdditionalFields` is non-empty, BUT
            //  `preExistingFieldMask` is null, not a string, or an empty string.
            delete requestDict['fieldMask'];
        }
    }
    else {
        // No valid `bidiGenerateContentSetup` was found or extracted.
        // "Lock additional null fields if any".
        if (preExistingFieldMask !== null &&
            Array.isArray(preExistingFieldMask) &&
            preExistingFieldMask.length > 0) {
            // If there's a pre-existing field mask, it's a string, and it's not
            // empty, then we should lock all fields.
            requestDict['fieldMask'] = preExistingFieldMask.join(',');
        }
        else {
            delete requestDict['fieldMask'];
        }
    }
    return requestDict;
}
class Tokens extends BaseModule {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
    }
    /**
     * Creates an ephemeral auth token resource.
     *
     * @experimental
     *
     * @remarks
     * Ephemeral auth tokens is only supported in the Gemini Developer API.
     * It can be used for the session connection to the Live constrained API.
     * Support in v1alpha only.
     *
     * @param params - The parameters for the create request.
     * @return The created auth token.
     *
     * @example
     * ```ts
     * const ai = new GoogleGenAI({
     *     apiKey: token.name,
     *     httpOptions: { apiVersion: 'v1alpha' }  // Support in v1alpha only.
     * });
     *
     * // Case 1: If LiveEphemeralParameters is unset, unlock LiveConnectConfig
     * // when using the token in Live API sessions. Each session connection can
     * // use a different configuration.
     * const config: CreateAuthTokenConfig = {
     *     uses: 3,
     *     expireTime: '2025-05-01T00:00:00Z',
     * }
     * const token = await ai.tokens.create(config);
     *
     * // Case 2: If LiveEphemeralParameters is set, lock all fields in
     * // LiveConnectConfig when using the token in Live API sessions. For
     * // example, changing `outputAudioTranscription` in the Live API
     * // connection will be ignored by the API.
     * const config: CreateAuthTokenConfig =
     *     uses: 3,
     *     expireTime: '2025-05-01T00:00:00Z',
     *     LiveEphemeralParameters: {
     *        model: 'gemini-2.0-flash-001',
     *        config: {
     *           'responseModalities': ['AUDIO'],
     *           'systemInstruction': 'Always answer in English.',
     *        }
     *     }
     * }
     * const token = await ai.tokens.create(config);
     *
     * // Case 3: If LiveEphemeralParameters is set and lockAdditionalFields is
     * // set, lock LiveConnectConfig with set and additional fields (e.g.
     * // responseModalities, systemInstruction, temperature in this example) when
     * // using the token in Live API sessions.
     * const config: CreateAuthTokenConfig =
     *     uses: 3,
     *     expireTime: '2025-05-01T00:00:00Z',
     *     LiveEphemeralParameters: {
     *        model: 'gemini-2.0-flash-001',
     *        config: {
     *           'responseModalities': ['AUDIO'],
     *           'systemInstruction': 'Always answer in English.',
     *        }
     *     },
     *     lockAdditionalFields: ['temperature'],
     * }
     * const token = await ai.tokens.create(config);
     *
     * // Case 4: If LiveEphemeralParameters is set and lockAdditionalFields is
     * // empty array, lock LiveConnectConfig with set fields (e.g.
     * // responseModalities, systemInstruction in this example) when using the
     * // token in Live API sessions.
     * const config: CreateAuthTokenConfig =
     *     uses: 3,
     *     expireTime: '2025-05-01T00:00:00Z',
     *     LiveEphemeralParameters: {
     *        model: 'gemini-2.0-flash-001',
     *        config: {
     *           'responseModalities': ['AUDIO'],
     *           'systemInstruction': 'Always answer in English.',
     *        }
     *     },
     *     lockAdditionalFields: [],
     * }
     * const token = await ai.tokens.create(config);
     * ```
     */
    async create(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('The client.tokens.create method is only supported by the Gemini Developer API.');
        }
        else {
            const body = createAuthTokenParametersToMldev(this.apiClient, params);
            path = formatMap('auth_tokens', body['_url']);
            queryParams = body['_query'];
            delete body['config'];
            delete body['_url'];
            delete body['_query'];
            const transformedBody = convertBidiSetupToTokenSetup(body, params.config);
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(transformedBody),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Code generated by the Google Gen AI SDK generator DO NOT EDIT.
function deleteDocumentConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromForce = getValueByPath(fromObject, ['force']);
    if (parentObject !== undefined && fromForce != null) {
        setValueByPath(parentObject, ['_query', 'force'], fromForce);
    }
    return toObject;
}
function deleteDocumentParametersToMldev(fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], fromName);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        deleteDocumentConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function getDocumentParametersToMldev(fromObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], fromName);
    }
    return toObject;
}
function listDocumentsConfigToMldev(fromObject, parentObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    return toObject;
}
function listDocumentsParametersToMldev(fromObject) {
    const toObject = {};
    const fromParent = getValueByPath(fromObject, ['parent']);
    if (fromParent != null) {
        setValueByPath(toObject, ['_url', 'parent'], fromParent);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listDocumentsConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function listDocumentsResponseFromMldev(fromObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromDocuments = getValueByPath(fromObject, ['documents']);
    if (fromDocuments != null) {
        let transformedList = fromDocuments;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['documents'], transformedList);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Documents extends BaseModule {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
        /**
         * Lists documents.
         *
         * @param params - The parameters for the list request.
         * @return - A pager of documents.
         *
         * @example
         * ```ts
         * const documents = await ai.documents.list({parent:'rag_store_name', config: {'pageSize': 2}});
         * for await (const document of documents) {
         *   console.log(document);
         * }
         * ```
         */
        this.list = async (params) => {
            return new Pager(PagedItem.PAGED_ITEM_DOCUMENTS, (x) => this.listInternal({ parent: params.parent, config: x.config }), await this.listInternal(params), params);
        };
    }
    /**
     * Gets a Document.
     *
     * @param params - The parameters for getting a document.
     * @return Document.
     */
    async get(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = getDocumentParametersToMldev(params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
    }
    /**
     * Deletes a Document.
     *
     * @param params - The parameters for deleting a document.
     */
    async delete(params) {
        var _a, _b;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = deleteDocumentParametersToMldev(params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            await this.apiClient.request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'DELETE',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            });
        }
    }
    async listInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = listDocumentsParametersToMldev(params);
            path = formatMap('{parent}/documents', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = listDocumentsResponseFromMldev(apiResponse);
                const typedResp = new ListDocumentsResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class FileSearchStores extends BaseModule {
    constructor(apiClient, documents = new Documents(apiClient)) {
        super();
        this.apiClient = apiClient;
        this.documents = documents;
        /**
         * Lists file search stores.
         *
         * @param params - The parameters for the list request.
         * @return - A pager of file search stores.
         *
         * @example
         * ```ts
         * const fileSearchStores = await ai.fileSearchStores.list({config: {'pageSize': 2}});
         * for await (const fileSearchStore of fileSearchStores) {
         *   console.log(fileSearchStore);
         * }
         * ```
         */
        this.list = async (params = {}) => {
            return new Pager(PagedItem.PAGED_ITEM_FILE_SEARCH_STORES, (x) => this.listInternal(x), await this.listInternal(params), params);
        };
    }
    /**
     * Uploads a file asynchronously to a given File Search Store.
     * This method is not available in Vertex AI.
     * Supported upload sources:
     * - Node.js: File path (string) or Blob object.
     * - Browser: Blob object (e.g., File).
     *
     * @remarks
     * The `mimeType` can be specified in the `config` parameter. If omitted:
     *  - For file path (string) inputs, the `mimeType` will be inferred from the
     *     file extension.
     *  - For Blob object inputs, the `mimeType` will be set to the Blob's `type`
     *     property.
     *
     * This section can contain multiple paragraphs and code examples.
     *
     * @param params - Optional parameters specified in the
     *        `types.UploadToFileSearchStoreParameters` interface.
     *         @see {@link types.UploadToFileSearchStoreParameters#config} for the optional
     *         config in the parameters.
     * @return A promise that resolves to a long running operation.
     * @throws An error if called on a Vertex AI client.
     * @throws An error if the `mimeType` is not provided and can not be inferred,
     * the `mimeType` can be provided in the `params.config` parameter.
     * @throws An error occurs if a suitable upload location cannot be established.
     *
     * @example
     * The following code uploads a file to a given file search store.
     *
     * ```ts
     * const operation = await ai.fileSearchStores.upload({fileSearchStoreName: 'fileSearchStores/foo-bar', file: 'file.txt', config: {
     *   mimeType: 'text/plain',
     * }});
     * console.log(operation.name);
     * ```
     */
    async uploadToFileSearchStore(params) {
        if (this.apiClient.isVertexAI()) {
            throw new Error('Vertex AI does not support uploading files to a file search store.');
        }
        return this.apiClient.uploadFileToFileSearchStore(params.fileSearchStoreName, params.file, params.config);
    }
    /**
     * Creates a File Search Store.
     *
     * @param params - The parameters for creating a File Search Store.
     * @return FileSearchStore.
     */
    async create(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = createFileSearchStoreParametersToMldev(params);
            path = formatMap('fileSearchStores', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
    }
    /**
     * Gets a File Search Store.
     *
     * @param params - The parameters for getting a File Search Store.
     * @return FileSearchStore.
     */
    async get(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = getFileSearchStoreParametersToMldev(params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((resp) => {
                return resp;
            });
        }
    }
    /**
     * Deletes a File Search Store.
     *
     * @param params - The parameters for deleting a File Search Store.
     */
    async delete(params) {
        var _a, _b;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = deleteFileSearchStoreParametersToMldev(params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            await this.apiClient.request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'DELETE',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            });
        }
    }
    async listInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = listFileSearchStoresParametersToMldev(params);
            path = formatMap('fileSearchStores', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = listFileSearchStoresResponseFromMldev(apiResponse);
                const typedResp = new ListFileSearchStoresResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    async uploadToFileSearchStoreInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = uploadToFileSearchStoreParametersToMldev(params);
            path = formatMap('upload/v1beta/{file_search_store_name}:uploadToFileSearchStore', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = uploadToFileSearchStoreResumableResponseFromMldev(apiResponse);
                const typedResp = new UploadToFileSearchStoreResumableResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Imports a File from File Service to a FileSearchStore.
     *
     * This is a long-running operation, see aip.dev/151
     *
     * @param params - The parameters for importing a file to a file search store.
     * @return ImportFileOperation.
     */
    async importFile(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = importFileParametersToMldev(params);
            path = formatMap('{file_search_store_name}:importFile', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json();
            });
            return response.then((apiResponse) => {
                const resp = importFileOperationFromMldev(apiResponse);
                const typedResp = new ImportFileOperation();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
/**
 * https://stackoverflow.com/a/2117523
 */
let uuid4Internal = function () {
    const { crypto } = globalThis;
    if (crypto === null || crypto === void 0 ? void 0 : crypto.randomUUID) {
        uuid4Internal = crypto.randomUUID.bind(crypto);
        return crypto.randomUUID();
    }
    const u8 = new Uint8Array(1);
    const randomByte = crypto ? () => crypto.getRandomValues(u8)[0] : () => (Math.random() * 0xff) & 0xff;
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => (+c ^ (randomByte() & (15 >> (+c / 4)))).toString(16));
};
const uuid4 = () => uuid4Internal();

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
function isAbortError(err) {
    return (typeof err === 'object' &&
        err !== null &&
        // Spec-compliant fetch implementations
        (('name' in err && err.name === 'AbortError') ||
            // Expo fetch
            ('message' in err && String(err.message).includes('FetchRequestCanceledException'))));
}
const castToError = (err) => {
    if (err instanceof Error)
        return err;
    if (typeof err === 'object' && err !== null) {
        try {
            if (Object.prototype.toString.call(err) === '[object Error]') {
                // @ts-ignore - not all envs have native support for cause yet
                const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
                if (err.stack)
                    error.stack = err.stack;
                // @ts-ignore - not all envs have native support for cause yet
                if (err.cause && !error.cause)
                    error.cause = err.cause;
                if (err.name)
                    error.name = err.name;
                return error;
            }
        }
        catch (_a) { }
        try {
            return new Error(JSON.stringify(err));
        }
        catch (_b) { }
    }
    return new Error(err);
};

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
class GeminiNextGenAPIClientError extends Error {
}
class APIError extends GeminiNextGenAPIClientError {
    constructor(status, error, message, headers) {
        super(`${APIError.makeMessage(status, error, message)}`);
        this.status = status;
        this.headers = headers;
        this.error = error;
    }
    static makeMessage(status, error, message) {
        const msg = (error === null || error === void 0 ? void 0 : error.message) ?
            typeof error.message === 'string' ?
                error.message
                : JSON.stringify(error.message)
            : error ? JSON.stringify(error)
                : message;
        if (status && msg) {
            return `${status} ${msg}`;
        }
        if (status) {
            return `${status} status code (no body)`;
        }
        if (msg) {
            return msg;
        }
        return '(no status code or body)';
    }
    static generate(status, errorResponse, message, headers) {
        if (!status || !headers) {
            return new APIConnectionError({ message, cause: castToError(errorResponse) });
        }
        const error = errorResponse;
        if (status === 400) {
            return new BadRequestError(status, error, message, headers);
        }
        if (status === 401) {
            return new AuthenticationError(status, error, message, headers);
        }
        if (status === 403) {
            return new PermissionDeniedError(status, error, message, headers);
        }
        if (status === 404) {
            return new NotFoundError(status, error, message, headers);
        }
        if (status === 409) {
            return new ConflictError(status, error, message, headers);
        }
        if (status === 422) {
            return new UnprocessableEntityError(status, error, message, headers);
        }
        if (status === 429) {
            return new RateLimitError(status, error, message, headers);
        }
        if (status >= 500) {
            return new InternalServerError(status, error, message, headers);
        }
        return new APIError(status, error, message, headers);
    }
}
class APIUserAbortError extends APIError {
    constructor({ message } = {}) {
        super(undefined, undefined, message || 'Request was aborted.', undefined);
    }
}
class APIConnectionError extends APIError {
    constructor({ message, cause }) {
        super(undefined, undefined, message || 'Connection error.', undefined);
        // in some environments the 'cause' property is already declared
        // @ts-ignore
        if (cause)
            this.cause = cause;
    }
}
class APIConnectionTimeoutError extends APIConnectionError {
    constructor({ message } = {}) {
        super({ message: message !== null && message !== void 0 ? message : 'Request timed out.' });
    }
}
class BadRequestError extends APIError {
}
class AuthenticationError extends APIError {
}
class PermissionDeniedError extends APIError {
}
class NotFoundError extends APIError {
}
class ConflictError extends APIError {
}
class UnprocessableEntityError extends APIError {
}
class RateLimitError extends APIError {
}
class InternalServerError extends APIError {
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
// https://url.spec.whatwg.org/#url-scheme-string
const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
const isAbsoluteURL = (url) => {
    return startsWithSchemeRegexp.test(url);
};
let isArrayInternal = (val) => ((isArrayInternal = Array.isArray), isArrayInternal(val));
const isArray = isArrayInternal;
let isReadonlyArrayInternal = isArray;
const isReadonlyArray = isReadonlyArrayInternal;
// https://stackoverflow.com/a/34491287
function isEmptyObj(obj) {
    if (!obj)
        return true;
    for (const _k in obj)
        return false;
    return true;
}
// https://eslint.org/docs/latest/rules/no-prototype-builtins
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
const validatePositiveInteger = (name, n) => {
    if (typeof n !== 'number' || !Number.isInteger(n)) {
        throw new GeminiNextGenAPIClientError(`${name} must be an integer`);
    }
    if (n < 0) {
        throw new GeminiNextGenAPIClientError(`${name} must be a positive integer`);
    }
    return n;
};
const safeJSON = (text) => {
    try {
        return JSON.parse(text);
    }
    catch (err) {
        return undefined;
    }
};

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
const sleep$1 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function getDefaultFetch() {
    if (typeof fetch !== 'undefined') {
        return fetch;
    }
    throw new Error('`fetch` is not defined as a global; Either pass `fetch` to the client, `new GeminiNextGenAPIClient({ fetch })` or polyfill the global, `globalThis.fetch = fetch`');
}
function makeReadableStream(...args) {
    const ReadableStream = globalThis.ReadableStream;
    if (typeof ReadableStream === 'undefined') {
        // Note: All of the platforms / runtimes we officially support already define
        // `ReadableStream` as a global, so this should only ever be hit on unsupported runtimes.
        throw new Error('`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`');
    }
    return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
    let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
    return makeReadableStream({
        start() { },
        async pull(controller) {
            const { done, value } = await iter.next();
            if (done) {
                controller.close();
            }
            else {
                controller.enqueue(value);
            }
        },
        async cancel() {
            var _a;
            await ((_a = iter.return) === null || _a === void 0 ? void 0 : _a.call(iter));
        },
    });
}
/**
 * Most browsers don't yet have async iterable support for ReadableStream,
 * and Node has a very different way of reading bytes from its "ReadableStream".
 *
 * This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
 */
function ReadableStreamToAsyncIterable(stream) {
    if (stream[Symbol.asyncIterator])
        return stream;
    const reader = stream.getReader();
    return {
        async next() {
            try {
                const result = await reader.read();
                if (result === null || result === void 0 ? void 0 : result.done)
                    reader.releaseLock(); // release lock when stream becomes closed
                return result;
            }
            catch (e) {
                reader.releaseLock(); // release lock when stream becomes errored
                throw e;
            }
        },
        async return() {
            const cancelPromise = reader.cancel();
            reader.releaseLock();
            await cancelPromise;
            return { done: true, value: undefined };
        },
        [Symbol.asyncIterator]() {
            return this;
        },
    };
}
/**
 * Cancels a ReadableStream we don't need to consume.
 * See https://undici.nodejs.org/#/?id=garbage-collection
 */
async function CancelReadableStream(stream) {
    var _a, _b;
    if (stream === null || typeof stream !== 'object')
        return;
    if (stream[Symbol.asyncIterator]) {
        await ((_b = (_a = stream[Symbol.asyncIterator]()).return) === null || _b === void 0 ? void 0 : _b.call(_a));
        return;
    }
    const reader = stream.getReader();
    const cancelPromise = reader.cancel();
    reader.releaseLock();
    await cancelPromise;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const FallbackEncoder = ({ headers, body }) => {
    return {
        bodyHeaders: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(body),
    };
};

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
/**
 * Basic re-implementation of `qs.stringify` for primitive types.
 */
function stringifyQuery(query) {
    return Object.entries(query)
        .filter(([_, value]) => typeof value !== 'undefined')
        .map(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        if (value === null) {
            return `${encodeURIComponent(key)}=`;
        }
        throw new GeminiNextGenAPIClientError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
    })
        .join('&');
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const VERSION = '0.0.1';

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const checkFileSupport = () => {
    var _a;
    if (typeof File === 'undefined') {
        const { process } = globalThis;
        const isOldNode = typeof ((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node) === 'string' && parseInt(process.versions.node.split('.')) < 20;
        throw new Error('`File` is not defined as a global, which is required for file uploads.' +
            (isOldNode ?
                " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`."
                : ''));
    }
};
/**
 * Construct a `File` instance. This is used to ensure a helpful error is thrown
 * for environments that don't define a global `File` yet.
 */
function makeFile(fileBits, fileName, options) {
    checkFileSupport();
    return new File(fileBits, fileName !== null && fileName !== void 0 ? fileName : 'unknown_file', options);
}
function getName(value) {
    return (((typeof value === 'object' &&
        value !== null &&
        (('name' in value && value.name && String(value.name)) ||
            ('url' in value && value.url && String(value.url)) ||
            ('filename' in value && value.filename && String(value.filename)) ||
            ('path' in value && value.path && String(value.path)))) ||
        '')
        .split(/[\\/]/)
        .pop() || undefined);
}
const isAsyncIterable = (value) => value != null && typeof value === 'object' && typeof value[Symbol.asyncIterator] === 'function';

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * This check adds the arrayBuffer() method type because it is available and used at runtime
 */
const isBlobLike = (value) => value != null &&
    typeof value === 'object' &&
    typeof value.size === 'number' &&
    typeof value.type === 'string' &&
    typeof value.text === 'function' &&
    typeof value.slice === 'function' &&
    typeof value.arrayBuffer === 'function';
/**
 * This check adds the arrayBuffer() method type because it is available and used at runtime
 */
const isFileLike = (value) => value != null &&
    typeof value === 'object' &&
    typeof value.name === 'string' &&
    typeof value.lastModified === 'number' &&
    isBlobLike(value);
const isResponseLike = (value) => value != null &&
    typeof value === 'object' &&
    typeof value.url === 'string' &&
    typeof value.blob === 'function';
/**
 * Helper for creating a {@link File} to pass to an SDK upload method from a variety of different data formats
 * @param value the raw content of the file. Can be an {@link Uploadable}, BlobLikePart, or AsyncIterable of BlobLikeParts
 * @param {string=} name the name of the file. If omitted, toFile will try to determine a file name from bits if possible
 * @param {Object=} options additional properties
 * @param {string=} options.type the MIME type of the content
 * @param {number=} options.lastModified the last modified timestamp
 * @returns a {@link File} with the given properties
 */
async function toFile(value, name, options) {
    checkFileSupport();
    // If it's a promise, resolve it.
    value = await value;
    // If we've been given a `File` we don't need to do anything
    if (isFileLike(value)) {
        if (value instanceof File) {
            return value;
        }
        return makeFile([await value.arrayBuffer()], value.name);
    }
    if (isResponseLike(value)) {
        const blob = await value.blob();
        name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
        return makeFile(await getBytes(blob), name, options);
    }
    const parts = await getBytes(value);
    name || (name = getName(value));
    if (!(options === null || options === void 0 ? void 0 : options.type)) {
        const type = parts.find((part) => typeof part === 'object' && 'type' in part && part.type);
        if (typeof type === 'string') {
            options = Object.assign(Object.assign({}, options), { type });
        }
    }
    return makeFile(parts, name, options);
}
async function getBytes(value) {
    var _a, e_1, _b, _c;
    var _d;
    let parts = [];
    if (typeof value === 'string' ||
        ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
        value instanceof ArrayBuffer) {
        parts.push(value);
    }
    else if (isBlobLike(value)) {
        parts.push(value instanceof Blob ? value : await value.arrayBuffer());
    }
    else if (isAsyncIterable(value) // includes Readable, ReadableStream, etc.
    ) {
        try {
            for (var _e = true, value_1 = __asyncValues(value), value_1_1; value_1_1 = await value_1.next(), _a = value_1_1.done, !_a; _e = true) {
                _c = value_1_1.value;
                _e = false;
                const chunk = _c;
                parts.push(...(await getBytes(chunk))); // TODO, consider validating?
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = value_1.return)) await _b.call(value_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    else {
        const constructor = (_d = value === null || value === void 0 ? void 0 : value.constructor) === null || _d === void 0 ? void 0 : _d.name;
        throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ''}${propsForError(value)}`);
    }
    return parts;
}
function propsForError(value) {
    if (typeof value !== 'object' || value === null)
        return '';
    const props = Object.getOwnPropertyNames(value);
    return `; props: [${props.map((p) => `"${p}"`).join(', ')}]`;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class APIResource {
    constructor(client) {
        this._client = client;
    }
}
/**
 * The key path from the client. For example, a resource accessible as `client.resource.subresource` would
 * have a property `static override readonly _key = Object.freeze(['resource', 'subresource'] as const);`.
 */
APIResource._key = [];

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Percent-encode everything that isn't safe to have in a path without encoding safe chars.
 *
 * Taken from https://datatracker.ietf.org/doc/html/rfc3986#section-3.3:
 * > unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
 * > sub-delims  = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
 * > pchar       = unreserved / pct-encoded / sub-delims / ":" / "@"
 */
function encodeURIPath(str) {
    return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
const EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
const createPathTagFunction = (pathEncoder = encodeURIPath) => (function path(statics, ...params) {
    // If there are no params, no processing is needed.
    if (statics.length === 1)
        return statics[0];
    let postPath = false;
    const invalidSegments = [];
    const path = statics.reduce((previousValue, currentValue, index) => {
        var _a, _b, _c;
        if (/[?#]/.test(currentValue)) {
            postPath = true;
        }
        const value = params[index];
        let encoded = (postPath ? encodeURIComponent : pathEncoder)('' + value);
        if (index !== params.length &&
            (value == null ||
                (typeof value === 'object' &&
                    // handle values from other realms
                    value.toString ===
                        ((_c = Object.getPrototypeOf((_b = Object.getPrototypeOf((_a = value.hasOwnProperty) !== null && _a !== void 0 ? _a : EMPTY)) !== null && _b !== void 0 ? _b : EMPTY)) === null || _c === void 0 ? void 0 : _c.toString)))) {
            encoded = value + '';
            invalidSegments.push({
                start: previousValue.length + currentValue.length,
                length: encoded.length,
                error: `Value of type ${Object.prototype.toString
                    .call(value)
                    .slice(8, -1)} is not a valid path parameter`,
            });
        }
        return previousValue + currentValue + (index === params.length ? '' : encoded);
    }, '');
    const pathOnly = path.split(/[?#]/, 1)[0];
    const invalidSegmentPattern = /(^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
    let match;
    // Find all invalid segments
    while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) {
        const hasLeadingSlash = match[0].startsWith('/');
        const offset = hasLeadingSlash ? 1 : 0;
        const cleanMatch = hasLeadingSlash ? match[0].slice(1) : match[0];
        invalidSegments.push({
            start: match.index + offset,
            length: cleanMatch.length,
            error: `Value "${cleanMatch}" can\'t be safely passed as a path parameter`,
        });
    }
    invalidSegments.sort((a, b) => a.start - b.start);
    if (invalidSegments.length > 0) {
        let lastEnd = 0;
        const underline = invalidSegments.reduce((acc, segment) => {
            const spaces = ' '.repeat(segment.start - lastEnd);
            const arrows = '^'.repeat(segment.length);
            lastEnd = segment.start + segment.length;
            return acc + spaces + arrows;
        }, '');
        throw new GeminiNextGenAPIClientError(`Path parameters result in path with invalid segments:\n${invalidSegments
            .map((e) => e.error)
            .join('\n')}\n${path}\n${underline}`);
    }
    return path;
});
/**
 * URI-encodes path params and ensures no unsafe /./ or /../ path segments are introduced.
 */
const path = /* @__PURE__ */ createPathTagFunction(encodeURIPath);

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class BaseInteractions extends APIResource {
    create(params, options) {
        var _a;
        const { api_version = this._client.apiVersion } = params, body = __rest(params, ["api_version"]);
        if ('model' in body && 'agent_config' in body) {
            throw new GeminiNextGenAPIClientError(`Invalid request: specified \`model\` and \`agent_config\`. If specifying \`model\`, use \`generation_config\`.`);
        }
        if ('agent' in body && 'generation_config' in body) {
            throw new GeminiNextGenAPIClientError(`Invalid request: specified \`agent\` and \`generation_config\`. If specifying \`agent\`, use \`agent_config\`.`);
        }
        return this._client.post(path `/${api_version}/interactions`, Object.assign(Object.assign({ body }, options), { stream: (_a = params.stream) !== null && _a !== void 0 ? _a : false }));
    }
    /**
     * Deletes the interaction by id.
     *
     * @example
     * ```ts
     * const interaction = await client.interactions.delete('id', {
     *   api_version: 'api_version',
     * });
     * ```
     */
    delete(id, params = {}, options) {
        const { api_version = this._client.apiVersion } = params !== null && params !== void 0 ? params : {};
        return this._client.delete(path `/${api_version}/interactions/${id}`, options);
    }
    /**
     * Cancels an interaction by id. This only applies to background interactions that are still running.
     *
     * @example
     * ```ts
     * const interaction = await client.interactions.cancel('id', {
     *   api_version: 'api_version',
     * });
     * ```
     */
    cancel(id, params = {}, options) {
        const { api_version = this._client.apiVersion } = params !== null && params !== void 0 ? params : {};
        return this._client.post(path `/${api_version}/interactions/${id}/cancel`, options);
    }
    get(id, params = {}, options) {
        var _a;
        const _b = params !== null && params !== void 0 ? params : {}, { api_version = this._client.apiVersion } = _b, query = __rest(_b, ["api_version"]);
        return this._client.get(path `/${api_version}/interactions/${id}`, Object.assign(Object.assign({ query }, options), { stream: (_a = params === null || params === void 0 ? void 0 : params.stream) !== null && _a !== void 0 ? _a : false }));
    }
}
BaseInteractions._key = Object.freeze(['interactions']);
class Interactions extends BaseInteractions {
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function concatBytes(buffers) {
    let length = 0;
    for (const buffer of buffers) {
        length += buffer.length;
    }
    const output = new Uint8Array(length);
    let index = 0;
    for (const buffer of buffers) {
        output.set(buffer, index);
        index += buffer.length;
    }
    return output;
}
let encodeUTF8_;
function encodeUTF8(str) {
    let encoder;
    return (encodeUTF8_ !== null && encodeUTF8_ !== void 0 ? encodeUTF8_ : ((encoder = new globalThis.TextEncoder()), (encodeUTF8_ = encoder.encode.bind(encoder))))(str);
}
let decodeUTF8_;
function decodeUTF8(bytes) {
    let decoder;
    return (decodeUTF8_ !== null && decodeUTF8_ !== void 0 ? decodeUTF8_ : ((decoder = new globalThis.TextDecoder()), (decodeUTF8_ = decoder.decode.bind(decoder))))(bytes);
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A re-implementation of httpx's `LineDecoder` in Python that handles incrementally
 * reading lines from text.
 *
 * https://github.com/encode/httpx/blob/920333ea98118e9cf617f246905d7b202510941c/httpx/_decoders.py#L258
 */
class LineDecoder {
    constructor() {
        this.buffer = new Uint8Array();
        this.carriageReturnIndex = null;
        this.searchIndex = 0;
    }
    decode(chunk) {
        var _a;
        if (chunk == null) {
            return [];
        }
        const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk)
            : typeof chunk === 'string' ? encodeUTF8(chunk)
                : chunk;
        this.buffer = concatBytes([this.buffer, binaryChunk]);
        const lines = [];
        let patternIndex;
        while ((patternIndex = findNewlineIndex(this.buffer, (_a = this.carriageReturnIndex) !== null && _a !== void 0 ? _a : this.searchIndex)) != null) {
            if (patternIndex.carriage && this.carriageReturnIndex == null) {
                // skip until we either get a corresponding `\n`, a new `\r` or nothing
                this.carriageReturnIndex = patternIndex.index;
                continue;
            }
            // we got double \r or \rtext\n
            if (this.carriageReturnIndex != null &&
                (patternIndex.index !== this.carriageReturnIndex + 1 || patternIndex.carriage)) {
                lines.push(decodeUTF8(this.buffer.subarray(0, this.carriageReturnIndex - 1)));
                this.buffer = this.buffer.subarray(this.carriageReturnIndex);
                this.carriageReturnIndex = null;
                this.searchIndex = 0;
                continue;
            }
            const endIndex = this.carriageReturnIndex !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
            const line = decodeUTF8(this.buffer.subarray(0, endIndex));
            lines.push(line);
            this.buffer = this.buffer.subarray(patternIndex.index);
            this.carriageReturnIndex = null;
            this.searchIndex = 0;
        }
        this.searchIndex = Math.max(0, this.buffer.length - 1);
        return lines;
    }
    flush() {
        if (!this.buffer.length) {
            return [];
        }
        return this.decode('\n');
    }
}
// prettier-ignore
LineDecoder.NEWLINE_CHARS = new Set(['\n', '\r']);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
/**
 * This function searches the buffer for the end patterns, (\r or \n)
 * and returns an object with the index preceding the matched newline and the
 * index after the newline char. `null` is returned if no new line is found.
 *
 * ```ts
 * findNewLineIndex('abc\ndef') -> { preceding: 2, index: 3 }
 * ```
 */
function findNewlineIndex(buffer, startIndex) {
    const newline = 0x0a; // \n
    const carriage = 0x0d; // \r
    const start = startIndex !== null && startIndex !== void 0 ? startIndex : 0;
    const nextNewline = buffer.indexOf(newline, start);
    const nextCarriage = buffer.indexOf(carriage, start);
    if (nextNewline === -1 && nextCarriage === -1) {
        return null;
    }
    let i;
    if (nextNewline !== -1 && nextCarriage !== -1) {
        i = Math.min(nextNewline, nextCarriage);
    }
    else {
        i = nextNewline !== -1 ? nextNewline : nextCarriage;
    }
    if (buffer[i] === newline) {
        return { preceding: i, index: i + 1, carriage: false };
    }
    return { preceding: i, index: i + 1, carriage: true };
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
const levelNumbers = {
    off: 0,
    error: 200,
    warn: 300,
    info: 400,
    debug: 500,
};
const parseLogLevel = (maybeLevel, sourceName, client) => {
    if (!maybeLevel) {
        return undefined;
    }
    if (hasOwn(levelNumbers, maybeLevel)) {
        return maybeLevel;
    }
    loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
    return undefined;
};
function noop() { }
function makeLogFn(fnLevel, logger, logLevel) {
    if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) {
        return noop;
    }
    else {
        // Don't wrap logger functions, we want the stacktrace intact!
        return logger[fnLevel].bind(logger);
    }
}
const noopLogger = {
    error: noop,
    warn: noop,
    info: noop,
    debug: noop,
};
let cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
    var _a;
    const logger = client.logger;
    const logLevel = (_a = client.logLevel) !== null && _a !== void 0 ? _a : 'off';
    if (!logger) {
        return noopLogger;
    }
    const cachedLogger = cachedLoggers.get(logger);
    if (cachedLogger && cachedLogger[0] === logLevel) {
        return cachedLogger[1];
    }
    const levelLogger = {
        error: makeLogFn('error', logger, logLevel),
        warn: makeLogFn('warn', logger, logLevel),
        info: makeLogFn('info', logger, logLevel),
        debug: makeLogFn('debug', logger, logLevel),
    };
    cachedLoggers.set(logger, [logLevel, levelLogger]);
    return levelLogger;
}
const formatRequestDetails = (details) => {
    if (details.options) {
        details.options = Object.assign({}, details.options);
        delete details.options['headers']; // redundant + leaks internals
    }
    if (details.headers) {
        details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [
            name,
            (name.toLowerCase() === 'x-goog-api-key' ||
                name.toLowerCase() === 'authorization' ||
                name.toLowerCase() === 'cookie' ||
                name.toLowerCase() === 'set-cookie') ?
                '***'
                : value,
        ]));
    }
    if ('retryOfRequestLogID' in details) {
        if (details.retryOfRequestLogID) {
            details.retryOf = details.retryOfRequestLogID;
        }
        delete details.retryOfRequestLogID;
    }
    return details;
};

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Stream {
    constructor(iterator, controller, client) {
        this.iterator = iterator;
        this.controller = controller;
        this.client = client;
    }
    static fromSSEResponse(response, controller, client) {
        let consumed = false;
        const logger = client ? loggerFor(client) : console;
        function iterator() {
            return __asyncGenerator(this, arguments, function* iterator_1() {
                var _a, e_1, _b, _c;
                if (consumed) {
                    throw new GeminiNextGenAPIClientError('Cannot iterate over a consumed stream, use `.tee()` to split the stream.');
                }
                consumed = true;
                let done = false;
                try {
                    try {
                        for (var _d = true, _e = __asyncValues(_iterSSEMessages(response, controller)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
                            _c = _f.value;
                            _d = false;
                            const sse = _c;
                            if (done)
                                continue;
                            if (sse.data.startsWith('[DONE]')) {
                                done = true;
                                continue;
                            }
                            else {
                                try {
                                    // @ts-ignore
                                    yield yield __await(JSON.parse(sse.data));
                                }
                                catch (e) {
                                    logger.error(`Could not parse message into JSON:`, sse.data);
                                    logger.error(`From chunk:`, sse.raw);
                                    throw e;
                                }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    done = true;
                }
                catch (e) {
                    // If the user calls `stream.controller.abort()`, we should exit without throwing.
                    if (isAbortError(e))
                        return yield __await(void 0);
                    throw e;
                }
                finally {
                    // If the user `break`s, abort the ongoing request.
                    if (!done)
                        controller.abort();
                }
            });
        }
        return new Stream(iterator, controller, client);
    }
    /**
     * Generates a Stream from a newline-separated ReadableStream
     * where each item is a JSON value.
     */
    static fromReadableStream(readableStream, controller, client) {
        let consumed = false;
        function iterLines() {
            return __asyncGenerator(this, arguments, function* iterLines_1() {
                var _a, e_2, _b, _c;
                const lineDecoder = new LineDecoder();
                const iter = ReadableStreamToAsyncIterable(readableStream);
                try {
                    for (var _d = true, iter_1 = __asyncValues(iter), iter_1_1; iter_1_1 = yield __await(iter_1.next()), _a = iter_1_1.done, !_a; _d = true) {
                        _c = iter_1_1.value;
                        _d = false;
                        const chunk = _c;
                        for (const line of lineDecoder.decode(chunk)) {
                            yield yield __await(line);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = iter_1.return)) yield __await(_b.call(iter_1));
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                for (const line of lineDecoder.flush()) {
                    yield yield __await(line);
                }
            });
        }
        function iterator() {
            return __asyncGenerator(this, arguments, function* iterator_2() {
                var _a, e_3, _b, _c;
                if (consumed) {
                    throw new GeminiNextGenAPIClientError('Cannot iterate over a consumed stream, use `.tee()` to split the stream.');
                }
                consumed = true;
                let done = false;
                try {
                    try {
                        for (var _d = true, _e = __asyncValues(iterLines()), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
                            _c = _f.value;
                            _d = false;
                            const line = _c;
                            if (done)
                                continue;
                            // @ts-ignore
                            if (line)
                                yield yield __await(JSON.parse(line));
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    done = true;
                }
                catch (e) {
                    // If the user calls `stream.controller.abort()`, we should exit without throwing.
                    if (isAbortError(e))
                        return yield __await(void 0);
                    throw e;
                }
                finally {
                    // If the user `break`s, abort the ongoing request.
                    if (!done)
                        controller.abort();
                }
            });
        }
        return new Stream(iterator, controller, client);
    }
    [Symbol.asyncIterator]() {
        return this.iterator();
    }
    /**
     * Splits the stream into two streams which can be
     * independently read from at different speeds.
     */
    tee() {
        const left = [];
        const right = [];
        const iterator = this.iterator();
        const teeIterator = (queue) => {
            return {
                next: () => {
                    if (queue.length === 0) {
                        const result = iterator.next();
                        left.push(result);
                        right.push(result);
                    }
                    return queue.shift();
                },
            };
        };
        return [
            new Stream(() => teeIterator(left), this.controller, this.client),
            new Stream(() => teeIterator(right), this.controller, this.client),
        ];
    }
    /**
     * Converts this stream to a newline-separated ReadableStream of
     * JSON stringified values in the stream
     * which can be turned back into a Stream with `Stream.fromReadableStream()`.
     */
    toReadableStream() {
        const self = this;
        let iter;
        return makeReadableStream({
            async start() {
                iter = self[Symbol.asyncIterator]();
            },
            async pull(ctrl) {
                try {
                    const { value, done } = await iter.next();
                    if (done)
                        return ctrl.close();
                    const bytes = encodeUTF8(JSON.stringify(value) + '\n');
                    ctrl.enqueue(bytes);
                }
                catch (err) {
                    ctrl.error(err);
                }
            },
            async cancel() {
                var _a;
                await ((_a = iter.return) === null || _a === void 0 ? void 0 : _a.call(iter));
            },
        });
    }
}
function _iterSSEMessages(response, controller) {
    return __asyncGenerator(this, arguments, function* _iterSSEMessages_1() {
        var _a, e_4, _b, _c;
        if (!response.body) {
            controller.abort();
            if (typeof globalThis.navigator !== 'undefined' &&
                globalThis.navigator.product === 'ReactNative') {
                throw new GeminiNextGenAPIClientError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
            }
            throw new GeminiNextGenAPIClientError(`Attempted to iterate over a response with no body`);
        }
        const sseDecoder = new SSEDecoder();
        const lineDecoder = new LineDecoder();
        const iter = ReadableStreamToAsyncIterable(response.body);
        try {
            for (var _d = true, _e = __asyncValues(iterBinaryChunks(iter)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const sseChunk = _c;
                for (const line of lineDecoder.decode(sseChunk)) {
                    const sse = sseDecoder.decode(line);
                    if (sse)
                        yield yield __await(sse);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
            }
            finally { if (e_4) throw e_4.error; }
        }
        for (const line of lineDecoder.flush()) {
            const sse = sseDecoder.decode(line);
            if (sse)
                yield yield __await(sse);
        }
    });
}
/**
 * Given an async iterable iterator, normalizes each chunk to a
 * Uint8Array and yields it.
 */
function iterBinaryChunks(iterator) {
    return __asyncGenerator(this, arguments, function* iterBinaryChunks_1() {
        var _a, e_5, _b, _c;
        try {
            for (var _d = true, iterator_3 = __asyncValues(iterator), iterator_3_1; iterator_3_1 = yield __await(iterator_3.next()), _a = iterator_3_1.done, !_a; _d = true) {
                _c = iterator_3_1.value;
                _d = false;
                const chunk = _c;
                if (chunk == null) {
                    continue;
                }
                const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk)
                    : typeof chunk === 'string' ? encodeUTF8(chunk)
                        : chunk;
                yield yield __await(binaryChunk);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = iterator_3.return)) yield __await(_b.call(iterator_3));
            }
            finally { if (e_5) throw e_5.error; }
        }
    });
}
class SSEDecoder {
    constructor() {
        this.event = null;
        this.data = [];
        this.chunks = [];
    }
    decode(line) {
        if (line.endsWith('\r')) {
            line = line.substring(0, line.length - 1);
        }
        if (!line) {
            // empty line and we didn't previously encounter any messages
            if (!this.event && !this.data.length)
                return null;
            const sse = {
                event: this.event,
                data: this.data.join('\n'),
                raw: this.chunks,
            };
            this.event = null;
            this.data = [];
            this.chunks = [];
            return sse;
        }
        this.chunks.push(line);
        if (line.startsWith(':')) {
            return null;
        }
        let [fieldname, _, value] = partition(line, ':');
        if (value.startsWith(' ')) {
            value = value.substring(1);
        }
        if (fieldname === 'event') {
            this.event = value;
        }
        else if (fieldname === 'data') {
            this.data.push(value);
        }
        return null;
    }
}
function partition(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
        return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
    }
    return [str, '', ''];
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
async function defaultParseResponse(client, props) {
    const { response, requestLogID, retryOfRequestLogID, startTime } = props;
    const body = await (async () => {
        var _a;
        if (props.options.stream) {
            loggerFor(client).debug('response', response.status, response.url, response.headers, response.body);
            // Note: there is an invariant here that isn't represented in the type system
            // that if you set `stream: true` the response type must also be `Stream<T>`
            if (props.options.__streamClass) {
                return props.options.__streamClass.fromSSEResponse(response, props.controller, client);
            }
            return Stream.fromSSEResponse(response, props.controller, client);
        }
        // fetch refuses to read the body when the status code is 204.
        if (response.status === 204) {
            return null;
        }
        if (props.options.__binaryResponse) {
            return response;
        }
        const contentType = response.headers.get('content-type');
        const mediaType = (_a = contentType === null || contentType === void 0 ? void 0 : contentType.split(';')[0]) === null || _a === void 0 ? void 0 : _a.trim();
        const isJSON = (mediaType === null || mediaType === void 0 ? void 0 : mediaType.includes('application/json')) || (mediaType === null || mediaType === void 0 ? void 0 : mediaType.endsWith('+json'));
        if (isJSON) {
            const contentLength = response.headers.get('content-length');
            if (contentLength === '0') {
                // if there is no content we can't do anything
                return undefined;
            }
            const json = await response.json();
            return json;
        }
        const text = await response.text();
        return text;
    })();
    loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        body,
        durationMs: Date.now() - startTime,
    }));
    return body;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A subclass of `Promise` providing additional helper methods
 * for interacting with the SDK.
 */
class APIPromise extends Promise {
    constructor(client, responsePromise, parseResponse = defaultParseResponse) {
        super((resolve) => {
            // this is maybe a bit weird but this has to be a no-op to not implicitly
            // parse the response body; instead .then, .catch, .finally are overridden
            // to parse the response
            resolve(null);
        });
        this.responsePromise = responsePromise;
        this.parseResponse = parseResponse;
        this.client = client;
    }
    _thenUnwrap(transform) {
        return new APIPromise(this.client, this.responsePromise, async (client, props) => transform(await this.parseResponse(client, props), props));
    }
    /**
     * Gets the raw `Response` instance instead of parsing the response
     * data.
     *
     * If you want to parse the response body but still get the `Response`
     * instance, you can use {@link withResponse()}.
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
     * to your `tsconfig.json`.
     */
    asResponse() {
        return this.responsePromise.then((p) => p.response);
    }
    /**
     * Gets the parsed response data and the raw `Response` instance.
     *
     * If you just want to get the raw `Response` instance without parsing it,
     * you can use {@link asResponse()}.
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
     * to your `tsconfig.json`.
     */
    async withResponse() {
        const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
        return { data, response };
    }
    parse() {
        if (!this.parsedPromise) {
            this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(this.client, data));
        }
        return this.parsedPromise;
    }
    then(onfulfilled, onrejected) {
        return this.parse().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.parse().catch(onrejected);
    }
    finally(onfinally) {
        return this.parse().finally(onfinally);
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
const brand_privateNullableHeaders = /* @__PURE__ */ Symbol('brand.privateNullableHeaders');
function* iterateHeaders(headers) {
    if (!headers)
        return;
    if (brand_privateNullableHeaders in headers) {
        const { values, nulls } = headers;
        yield* values.entries();
        for (const name of nulls) {
            yield [name, null];
        }
        return;
    }
    let shouldClear = false;
    let iter;
    if (headers instanceof Headers) {
        iter = headers.entries();
    }
    else if (isReadonlyArray(headers)) {
        iter = headers;
    }
    else {
        shouldClear = true;
        iter = Object.entries(headers !== null && headers !== void 0 ? headers : {});
    }
    for (let row of iter) {
        const name = row[0];
        if (typeof name !== 'string')
            throw new TypeError('expected header name to be a string');
        const values = isReadonlyArray(row[1]) ? row[1] : [row[1]];
        let didClear = false;
        for (const value of values) {
            if (value === undefined)
                continue;
            // Objects keys always overwrite older headers, they never append.
            // Yield a null to clear the header before adding the new values.
            if (shouldClear && !didClear) {
                didClear = true;
                yield [name, null];
            }
            yield [name, value];
        }
    }
}
const buildHeaders = (newHeaders) => {
    const targetHeaders = new Headers();
    const nullHeaders = new Set();
    for (const headers of newHeaders) {
        const seenHeaders = new Set();
        for (const [name, value] of iterateHeaders(headers)) {
            const lowerName = name.toLowerCase();
            if (!seenHeaders.has(lowerName)) {
                targetHeaders.delete(name);
                seenHeaders.add(lowerName);
            }
            if (value === null) {
                targetHeaders.delete(name);
                nullHeaders.add(lowerName);
            }
            else {
                targetHeaders.append(name, value);
                nullHeaders.delete(lowerName);
            }
        }
    }
    return { [brand_privateNullableHeaders]: true, values: targetHeaders, nulls: nullHeaders };
};

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
/**
 * Read an environment variable.
 *
 * Trims beginning and trailing whitespace.
 *
 * Will return undefined if the environment variable doesn't exist or cannot be accessed.
 */
const readEnv = (env) => {
    var _a, _b, _c, _d, _e, _f;
    if (typeof globalThis.process !== 'undefined') {
        return (_c = (_b = (_a = globalThis.process.env) === null || _a === void 0 ? void 0 : _a[env]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : undefined;
    }
    if (typeof globalThis.Deno !== 'undefined') {
        return (_f = (_e = (_d = globalThis.Deno.env) === null || _d === void 0 ? void 0 : _d.get) === null || _e === void 0 ? void 0 : _e.call(_d, env)) === null || _f === void 0 ? void 0 : _f.trim();
    }
    return undefined;
};

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var _a;
/**
 * Base class for Gemini Next Gen API API clients.
 */
class BaseGeminiNextGenAPIClient {
    /**
     * API Client for interfacing with the Gemini Next Gen API API.
     *
     * @param {string | null | undefined} [opts.apiKey=process.env['GEMINI_API_KEY'] ?? null]
     * @param {string | undefined} [opts.apiVersion=v1beta]
     * @param {string} [opts.baseURL=process.env['GEMINI_NEXT_GEN_API_BASE_URL'] ?? https://generativelanguage.googleapis.com] - Override the default base URL for the API.
     * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
     * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
     * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
     * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
     * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
     * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
     */
    constructor(_b) {
        var _c, _d, _e, _f, _g, _h, _j;
        var { baseURL = readEnv('GEMINI_NEXT_GEN_API_BASE_URL'), apiKey = (_c = readEnv('GEMINI_API_KEY')) !== null && _c !== void 0 ? _c : null, apiVersion = 'v1beta' } = _b, opts = __rest(_b, ["baseURL", "apiKey", "apiVersion"]);
        const options = Object.assign(Object.assign({ apiKey,
            apiVersion }, opts), { baseURL: baseURL || `https://generativelanguage.googleapis.com` });
        this.baseURL = options.baseURL;
        this.timeout = (_d = options.timeout) !== null && _d !== void 0 ? _d : BaseGeminiNextGenAPIClient.DEFAULT_TIMEOUT /* 1 minute */;
        this.logger = (_e = options.logger) !== null && _e !== void 0 ? _e : console;
        const defaultLogLevel = 'warn';
        // Set default logLevel early so that we can log a warning in parseLogLevel.
        this.logLevel = defaultLogLevel;
        this.logLevel =
            (_g = (_f = parseLogLevel(options.logLevel, 'ClientOptions.logLevel', this)) !== null && _f !== void 0 ? _f : parseLogLevel(readEnv('GEMINI_NEXT_GEN_API_LOG'), "process.env['GEMINI_NEXT_GEN_API_LOG']", this)) !== null && _g !== void 0 ? _g : defaultLogLevel;
        this.fetchOptions = options.fetchOptions;
        this.maxRetries = (_h = options.maxRetries) !== null && _h !== void 0 ? _h : 2;
        this.fetch = (_j = options.fetch) !== null && _j !== void 0 ? _j : getDefaultFetch();
        this.encoder = FallbackEncoder;
        this._options = options;
        this.apiKey = apiKey;
        this.apiVersion = apiVersion;
        this.clientAdapter = options.clientAdapter;
    }
    /**
     * Create a new client instance re-using the same options given to the current client with optional overriding.
     */
    withOptions(options) {
        const client = new this.constructor(Object.assign(Object.assign(Object.assign({}, this._options), { baseURL: this.baseURL, maxRetries: this.maxRetries, timeout: this.timeout, logger: this.logger, logLevel: this.logLevel, fetch: this.fetch, fetchOptions: this.fetchOptions, apiKey: this.apiKey, apiVersion: this.apiVersion }), options));
        return client;
    }
    /**
     * Check whether the base URL is set to its default.
     */
    baseURLOverridden() {
        return this.baseURL !== 'https://generativelanguage.googleapis.com';
    }
    defaultQuery() {
        return this._options.defaultQuery;
    }
    validateHeaders({ values, nulls }) {
        // The headers object handles case insensitivity.
        if (values.has('authorization') || values.has('x-goog-api-key')) {
            return;
        }
        if (this.apiKey && values.get('x-goog-api-key')) {
            return;
        }
        if (nulls.has('x-goog-api-key')) {
            return;
        }
        throw new Error('Could not resolve authentication method. Expected the apiKey to be set. Or for the "x-goog-api-key" headers to be explicitly omitted');
    }
    async authHeaders(opts) {
        const existingHeaders = buildHeaders([opts.headers]);
        if (existingHeaders.values.has('authorization') || existingHeaders.values.has('x-goog-api-key')) {
            return undefined;
        }
        if (this.apiKey) {
            return buildHeaders([{ 'x-goog-api-key': this.apiKey }]);
        }
        if (this.clientAdapter.isVertexAI()) {
            return buildHeaders([await this.clientAdapter.getAuthHeaders()]);
        }
        return undefined;
    }
    /**
     * Basic re-implementation of `qs.stringify` for primitive types.
     */
    stringifyQuery(query) {
        return stringifyQuery(query);
    }
    getUserAgent() {
        return `${this.constructor.name}/JS ${VERSION}`;
    }
    defaultIdempotencyKey() {
        return `stainless-node-retry-${uuid4()}`;
    }
    makeStatusError(status, error, message, headers) {
        return APIError.generate(status, error, message, headers);
    }
    buildURL(path, query, defaultBaseURL) {
        const baseURL = (!this.baseURLOverridden() && defaultBaseURL) || this.baseURL;
        const url = isAbsoluteURL(path) ?
            new URL(path)
            : new URL(baseURL + (baseURL.endsWith('/') && path.startsWith('/') ? path.slice(1) : path));
        const defaultQuery = this.defaultQuery();
        const pathQuery = Object.fromEntries(url.searchParams);
        if (!isEmptyObj(defaultQuery) || !isEmptyObj(pathQuery)) {
            query = Object.assign(Object.assign(Object.assign({}, pathQuery), defaultQuery), query);
        }
        if (typeof query === 'object' && query && !Array.isArray(query)) {
            url.search = this.stringifyQuery(query);
        }
        return url.toString();
    }
    /**
     * Used as a callback for mutating the given `FinalRequestOptions` object.
  
     */
    async prepareOptions(options) {
        if (this.clientAdapter &&
            this.clientAdapter.isVertexAI() &&
            !options.path.startsWith(`/${this.apiVersion}/projects/`)) {
            const oldPath = options.path.slice(this.apiVersion.length + 1);
            options.path = `/${this.apiVersion}/projects/${this.clientAdapter.getProject()}/locations/${this.clientAdapter.getLocation()}${oldPath}`;
        }
    }
    /**
     * Used as a callback for mutating the given `RequestInit` object.
     *
     * This is useful for cases where you want to add certain headers based off of
     * the request properties, e.g. `method` or `url`.
     */
    async prepareRequest(request, { url, options }) { }
    get(path, opts) {
        return this.methodRequest('get', path, opts);
    }
    post(path, opts) {
        return this.methodRequest('post', path, opts);
    }
    patch(path, opts) {
        return this.methodRequest('patch', path, opts);
    }
    put(path, opts) {
        return this.methodRequest('put', path, opts);
    }
    delete(path, opts) {
        return this.methodRequest('delete', path, opts);
    }
    methodRequest(method, path, opts) {
        return this.request(Promise.resolve(opts).then((opts) => {
            return Object.assign({ method, path }, opts);
        }));
    }
    request(options, remainingRetries = null) {
        return new APIPromise(this, this.makeRequest(options, remainingRetries, undefined));
    }
    async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
        var _b, _c, _d;
        const options = await optionsInput;
        const maxRetries = (_b = options.maxRetries) !== null && _b !== void 0 ? _b : this.maxRetries;
        if (retriesRemaining == null) {
            retriesRemaining = maxRetries;
        }
        await this.prepareOptions(options);
        const { req, url, timeout } = await this.buildRequest(options, {
            retryCount: maxRetries - retriesRemaining,
        });
        await this.prepareRequest(req, { url, options });
        /** Not an API request ID, just for correlating local log entries. */
        const requestLogID = 'log_' + ((Math.random() * (1 << 24)) | 0).toString(16).padStart(6, '0');
        const retryLogStr = retryOfRequestLogID === undefined ? '' : `, retryOf: ${retryOfRequestLogID}`;
        const startTime = Date.now();
        loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
            retryOfRequestLogID,
            method: options.method,
            url,
            options,
            headers: req.headers,
        }));
        if ((_c = options.signal) === null || _c === void 0 ? void 0 : _c.aborted) {
            throw new APIUserAbortError();
        }
        const controller = new AbortController();
        const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
        const headersTime = Date.now();
        if (response instanceof globalThis.Error) {
            const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
            if ((_d = options.signal) === null || _d === void 0 ? void 0 : _d.aborted) {
                throw new APIUserAbortError();
            }
            // detect native connection timeout errors
            // deno throws "TypeError: error sending request for url (https://example/): client error (Connect): tcp connect error: Operation timed out (os error 60): Operation timed out (os error 60)"
            // undici throws "TypeError: fetch failed" with cause "ConnectTimeoutError: Connect Timeout Error (attempted address: example:443, timeout: 1ms)"
            // others do not provide enough information to distinguish timeouts from other connection errors
            const isTimeout = isAbortError(response) ||
                /timed? ?out/i.test(String(response) + ('cause' in response ? String(response.cause) : ''));
            if (retriesRemaining) {
                loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - ${retryMessage}`);
                loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (${retryMessage})`, formatRequestDetails({
                    retryOfRequestLogID,
                    url,
                    durationMs: headersTime - startTime,
                    message: response.message,
                }));
                return this.retryRequest(options, retriesRemaining, retryOfRequestLogID !== null && retryOfRequestLogID !== void 0 ? retryOfRequestLogID : requestLogID);
            }
            loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - error; no more retries left`);
            loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (error; no more retries left)`, formatRequestDetails({
                retryOfRequestLogID,
                url,
                durationMs: headersTime - startTime,
                message: response.message,
            }));
            if (isTimeout) {
                throw new APIConnectionTimeoutError();
            }
            throw new APIConnectionError({ cause: response });
        }
        const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${response.ok ? 'succeeded' : 'failed'} with status ${response.status} in ${headersTime - startTime}ms`;
        if (!response.ok) {
            const shouldRetry = await this.shouldRetry(response);
            if (retriesRemaining && shouldRetry) {
                const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
                // We don't need the body of this response.
                await CancelReadableStream(response.body);
                loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
                loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
                    retryOfRequestLogID,
                    url: response.url,
                    status: response.status,
                    headers: response.headers,
                    durationMs: headersTime - startTime,
                }));
                return this.retryRequest(options, retriesRemaining, retryOfRequestLogID !== null && retryOfRequestLogID !== void 0 ? retryOfRequestLogID : requestLogID, response.headers);
            }
            const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
            loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
            const errText = await response.text().catch((err) => castToError(err).message);
            const errJSON = safeJSON(errText);
            const errMessage = errJSON ? undefined : errText;
            loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
                retryOfRequestLogID,
                url: response.url,
                status: response.status,
                headers: response.headers,
                message: errMessage,
                durationMs: Date.now() - startTime,
            }));
            // @ts-ignore
            const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
            throw err;
        }
        loggerFor(this).info(responseInfo);
        loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
            retryOfRequestLogID,
            url: response.url,
            status: response.status,
            headers: response.headers,
            durationMs: headersTime - startTime,
        }));
        return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
    }
    async fetchWithTimeout(url, init, ms, controller) {
        const _b = init || {}, { signal, method } = _b, options = __rest(_b, ["signal", "method"]);
        const abort = this._makeAbort(controller);
        if (signal)
            signal.addEventListener('abort', abort, { once: true });
        const timeout = setTimeout(abort, ms);
        const isReadableBody = (globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream) ||
            (typeof options.body === 'object' && options.body !== null && Symbol.asyncIterator in options.body);
        const fetchOptions = Object.assign(Object.assign(Object.assign({ signal: controller.signal }, (isReadableBody ? { duplex: 'half' } : {})), { method: 'GET' }), options);
        if (method) {
            // Custom methods like 'patch' need to be uppercased
            // See https://github.com/nodejs/undici/issues/2294
            fetchOptions.method = method.toUpperCase();
        }
        try {
            // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
            return await this.fetch.call(undefined, url, fetchOptions);
        }
        finally {
            clearTimeout(timeout);
        }
    }
    async shouldRetry(response) {
        // Note this is not a standard header.
        const shouldRetryHeader = response.headers.get('x-should-retry');
        // If the server explicitly says whether or not to retry, obey.
        if (shouldRetryHeader === 'true')
            return true;
        if (shouldRetryHeader === 'false')
            return false;
        // Retry on request timeouts.
        if (response.status === 408)
            return true;
        // Retry on lock timeouts.
        if (response.status === 409)
            return true;
        // Retry on rate limits.
        if (response.status === 429)
            return true;
        // Retry internal errors.
        if (response.status >= 500)
            return true;
        return false;
    }
    async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
        var _b;
        let timeoutMillis;
        // Note the `retry-after-ms` header may not be standard, but is a good idea and we'd like proactive support for it.
        const retryAfterMillisHeader = responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get('retry-after-ms');
        if (retryAfterMillisHeader) {
            const timeoutMs = parseFloat(retryAfterMillisHeader);
            if (!Number.isNaN(timeoutMs)) {
                timeoutMillis = timeoutMs;
            }
        }
        // About the Retry-After header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
        const retryAfterHeader = responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get('retry-after');
        if (retryAfterHeader && !timeoutMillis) {
            const timeoutSeconds = parseFloat(retryAfterHeader);
            if (!Number.isNaN(timeoutSeconds)) {
                timeoutMillis = timeoutSeconds * 1000;
            }
            else {
                timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
            }
        }
        // If the API asks us to wait a certain amount of time, just do what it
        // says, but otherwise calculate a default
        if (timeoutMillis === undefined) {
            const maxRetries = (_b = options.maxRetries) !== null && _b !== void 0 ? _b : this.maxRetries;
            timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
        }
        await sleep$1(timeoutMillis);
        return this.makeRequest(options, retriesRemaining - 1, requestLogID);
    }
    calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
        const initialRetryDelay = 0.5;
        const maxRetryDelay = 8.0;
        const numRetries = maxRetries - retriesRemaining;
        // Apply exponential backoff, but not more than the max.
        const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
        // Apply some jitter, take up to at most 25 percent of the retry time.
        const jitter = 1 - Math.random() * 0.25;
        return sleepSeconds * jitter * 1000;
    }
    async buildRequest(inputOptions, { retryCount = 0 } = {}) {
        var _b, _c, _d;
        const options = Object.assign({}, inputOptions);
        const { method, path, query, defaultBaseURL } = options;
        const url = this.buildURL(path, query, defaultBaseURL);
        if ('timeout' in options)
            validatePositiveInteger('timeout', options.timeout);
        options.timeout = (_b = options.timeout) !== null && _b !== void 0 ? _b : this.timeout;
        const { bodyHeaders, body } = this.buildBody({ options });
        const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });
        const req = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ method, headers: reqHeaders }, (options.signal && { signal: options.signal })), (globalThis.ReadableStream &&
            body instanceof globalThis.ReadableStream && { duplex: 'half' })), (body && { body })), ((_c = this.fetchOptions) !== null && _c !== void 0 ? _c : {})), ((_d = options.fetchOptions) !== null && _d !== void 0 ? _d : {}));
        return { req, url, timeout: options.timeout };
    }
    async buildHeaders({ options, method, bodyHeaders, retryCount, }) {
        let idempotencyHeaders = {};
        if (this.idempotencyHeader && method !== 'get') {
            if (!options.idempotencyKey)
                options.idempotencyKey = this.defaultIdempotencyKey();
            idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
        }
        const authHeaders = await this.authHeaders(options);
        let headers = buildHeaders([
            idempotencyHeaders,
            { Accept: 'application/json', 'User-Agent': this.getUserAgent() },
            this._options.defaultHeaders,
            bodyHeaders,
            options.headers,
            authHeaders,
        ]);
        this.validateHeaders(headers);
        return headers.values;
    }
    _makeAbort(controller) {
        // note: we can't just inline this method inside `fetchWithTimeout()` because then the closure
        //       would capture all request options, and cause a memory leak.
        return () => controller.abort();
    }
    buildBody({ options: { body, headers: rawHeaders } }) {
        if (!body) {
            return { bodyHeaders: undefined, body: undefined };
        }
        const headers = buildHeaders([rawHeaders]);
        if (
        // Pass raw type verbatim
        ArrayBuffer.isView(body) ||
            body instanceof ArrayBuffer ||
            body instanceof DataView ||
            (typeof body === 'string' &&
                // Preserve legacy string encoding behavior for now
                headers.values.has('content-type')) ||
            // `Blob` is superset of `File`
            (globalThis.Blob && body instanceof globalThis.Blob) ||
            // `FormData` -> `multipart/form-data`
            body instanceof FormData ||
            // `URLSearchParams` -> `application/x-www-form-urlencoded`
            body instanceof URLSearchParams ||
            // Send chunked stream (each chunk has own `length`)
            (globalThis.ReadableStream && body instanceof globalThis.ReadableStream)) {
            return { bodyHeaders: undefined, body: body };
        }
        else if (typeof body === 'object' &&
            (Symbol.asyncIterator in body ||
                (Symbol.iterator in body && 'next' in body && typeof body.next === 'function'))) {
            return { bodyHeaders: undefined, body: ReadableStreamFrom(body) };
        }
        else if (typeof body === 'object' &&
            headers.values.get('content-type') === 'application/x-www-form-urlencoded') {
            return {
                bodyHeaders: { 'content-type': 'application/x-www-form-urlencoded' },
                body: this.stringifyQuery(body),
            };
        }
        else {
            return this.encoder({ body, headers });
        }
    }
}
BaseGeminiNextGenAPIClient.DEFAULT_TIMEOUT = 60000; // 1 minute
/**
 * API Client for interfacing with the Gemini Next Gen API API.
 */
class GeminiNextGenAPIClient extends BaseGeminiNextGenAPIClient {
    constructor() {
        super(...arguments);
        this.interactions = new Interactions(this);
    }
}
_a = GeminiNextGenAPIClient;
GeminiNextGenAPIClient.GeminiNextGenAPIClient = _a;
GeminiNextGenAPIClient.GeminiNextGenAPIClientError = GeminiNextGenAPIClientError;
GeminiNextGenAPIClient.APIError = APIError;
GeminiNextGenAPIClient.APIConnectionError = APIConnectionError;
GeminiNextGenAPIClient.APIConnectionTimeoutError = APIConnectionTimeoutError;
GeminiNextGenAPIClient.APIUserAbortError = APIUserAbortError;
GeminiNextGenAPIClient.NotFoundError = NotFoundError;
GeminiNextGenAPIClient.ConflictError = ConflictError;
GeminiNextGenAPIClient.RateLimitError = RateLimitError;
GeminiNextGenAPIClient.BadRequestError = BadRequestError;
GeminiNextGenAPIClient.AuthenticationError = AuthenticationError;
GeminiNextGenAPIClient.InternalServerError = InternalServerError;
GeminiNextGenAPIClient.PermissionDeniedError = PermissionDeniedError;
GeminiNextGenAPIClient.UnprocessableEntityError = UnprocessableEntityError;
GeminiNextGenAPIClient.toFile = toFile;
GeminiNextGenAPIClient.Interactions = Interactions;

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Code generated by the Google Gen AI SDK generator DO NOT EDIT.
function cancelTuningJobParametersToMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], fromName);
    }
    return toObject;
}
function cancelTuningJobParametersToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], fromName);
    }
    return toObject;
}
function cancelTuningJobResponseFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    return toObject;
}
function cancelTuningJobResponseFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    return toObject;
}
function createTuningJobConfigToMldev(fromObject, parentObject, _rootObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['validationDataset']) !== undefined) {
        throw new Error('validationDataset parameter is not supported in Gemini API.');
    }
    const fromTunedModelDisplayName = getValueByPath(fromObject, [
        'tunedModelDisplayName',
    ]);
    if (parentObject !== undefined && fromTunedModelDisplayName != null) {
        setValueByPath(parentObject, ['displayName'], fromTunedModelDisplayName);
    }
    if (getValueByPath(fromObject, ['description']) !== undefined) {
        throw new Error('description parameter is not supported in Gemini API.');
    }
    const fromEpochCount = getValueByPath(fromObject, ['epochCount']);
    if (parentObject !== undefined && fromEpochCount != null) {
        setValueByPath(parentObject, ['tuningTask', 'hyperparameters', 'epochCount'], fromEpochCount);
    }
    const fromLearningRateMultiplier = getValueByPath(fromObject, [
        'learningRateMultiplier',
    ]);
    if (fromLearningRateMultiplier != null) {
        setValueByPath(toObject, ['tuningTask', 'hyperparameters', 'learningRateMultiplier'], fromLearningRateMultiplier);
    }
    if (getValueByPath(fromObject, ['exportLastCheckpointOnly']) !==
        undefined) {
        throw new Error('exportLastCheckpointOnly parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['preTunedModelCheckpointId']) !==
        undefined) {
        throw new Error('preTunedModelCheckpointId parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['adapterSize']) !== undefined) {
        throw new Error('adapterSize parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['tuningMode']) !== undefined) {
        throw new Error('tuningMode parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['customBaseModel']) !== undefined) {
        throw new Error('customBaseModel parameter is not supported in Gemini API.');
    }
    const fromBatchSize = getValueByPath(fromObject, ['batchSize']);
    if (parentObject !== undefined && fromBatchSize != null) {
        setValueByPath(parentObject, ['tuningTask', 'hyperparameters', 'batchSize'], fromBatchSize);
    }
    const fromLearningRate = getValueByPath(fromObject, ['learningRate']);
    if (parentObject !== undefined && fromLearningRate != null) {
        setValueByPath(parentObject, ['tuningTask', 'hyperparameters', 'learningRate'], fromLearningRate);
    }
    if (getValueByPath(fromObject, ['labels']) !== undefined) {
        throw new Error('labels parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['beta']) !== undefined) {
        throw new Error('beta parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['baseTeacherModel']) !== undefined) {
        throw new Error('baseTeacherModel parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['tunedTeacherModelSource']) !== undefined) {
        throw new Error('tunedTeacherModelSource parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['sftLossWeightMultiplier']) !== undefined) {
        throw new Error('sftLossWeightMultiplier parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['outputUri']) !== undefined) {
        throw new Error('outputUri parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['encryptionSpec']) !== undefined) {
        throw new Error('encryptionSpec parameter is not supported in Gemini API.');
    }
    return toObject;
}
function createTuningJobConfigToVertex(fromObject, parentObject, rootObject) {
    const toObject = {};
    let discriminatorValidationDataset = getValueByPath(rootObject, [
        'config',
        'method',
    ]);
    if (discriminatorValidationDataset === undefined) {
        discriminatorValidationDataset = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorValidationDataset === 'SUPERVISED_FINE_TUNING') {
        const fromValidationDataset = getValueByPath(fromObject, [
            'validationDataset',
        ]);
        if (parentObject !== undefined && fromValidationDataset != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec'], tuningValidationDatasetToVertex(fromValidationDataset));
        }
    }
    else if (discriminatorValidationDataset === 'PREFERENCE_TUNING') {
        const fromValidationDataset = getValueByPath(fromObject, [
            'validationDataset',
        ]);
        if (parentObject !== undefined && fromValidationDataset != null) {
            setValueByPath(parentObject, ['preferenceOptimizationSpec'], tuningValidationDatasetToVertex(fromValidationDataset));
        }
    }
    else if (discriminatorValidationDataset === 'DISTILLATION') {
        const fromValidationDataset = getValueByPath(fromObject, [
            'validationDataset',
        ]);
        if (parentObject !== undefined && fromValidationDataset != null) {
            setValueByPath(parentObject, ['distillationSpec'], tuningValidationDatasetToVertex(fromValidationDataset));
        }
    }
    const fromTunedModelDisplayName = getValueByPath(fromObject, [
        'tunedModelDisplayName',
    ]);
    if (parentObject !== undefined && fromTunedModelDisplayName != null) {
        setValueByPath(parentObject, ['tunedModelDisplayName'], fromTunedModelDisplayName);
    }
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (parentObject !== undefined && fromDescription != null) {
        setValueByPath(parentObject, ['description'], fromDescription);
    }
    let discriminatorEpochCount = getValueByPath(rootObject, [
        'config',
        'method',
    ]);
    if (discriminatorEpochCount === undefined) {
        discriminatorEpochCount = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorEpochCount === 'SUPERVISED_FINE_TUNING') {
        const fromEpochCount = getValueByPath(fromObject, ['epochCount']);
        if (parentObject !== undefined && fromEpochCount != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec', 'hyperParameters', 'epochCount'], fromEpochCount);
        }
    }
    else if (discriminatorEpochCount === 'PREFERENCE_TUNING') {
        const fromEpochCount = getValueByPath(fromObject, ['epochCount']);
        if (parentObject !== undefined && fromEpochCount != null) {
            setValueByPath(parentObject, ['preferenceOptimizationSpec', 'hyperParameters', 'epochCount'], fromEpochCount);
        }
    }
    else if (discriminatorEpochCount === 'DISTILLATION') {
        const fromEpochCount = getValueByPath(fromObject, ['epochCount']);
        if (parentObject !== undefined && fromEpochCount != null) {
            setValueByPath(parentObject, ['distillationSpec', 'hyperParameters', 'epochCount'], fromEpochCount);
        }
    }
    let discriminatorLearningRateMultiplier = getValueByPath(rootObject, [
        'config',
        'method',
    ]);
    if (discriminatorLearningRateMultiplier === undefined) {
        discriminatorLearningRateMultiplier = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorLearningRateMultiplier === 'SUPERVISED_FINE_TUNING') {
        const fromLearningRateMultiplier = getValueByPath(fromObject, [
            'learningRateMultiplier',
        ]);
        if (parentObject !== undefined && fromLearningRateMultiplier != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec', 'hyperParameters', 'learningRateMultiplier'], fromLearningRateMultiplier);
        }
    }
    else if (discriminatorLearningRateMultiplier === 'PREFERENCE_TUNING') {
        const fromLearningRateMultiplier = getValueByPath(fromObject, [
            'learningRateMultiplier',
        ]);
        if (parentObject !== undefined && fromLearningRateMultiplier != null) {
            setValueByPath(parentObject, [
                'preferenceOptimizationSpec',
                'hyperParameters',
                'learningRateMultiplier',
            ], fromLearningRateMultiplier);
        }
    }
    else if (discriminatorLearningRateMultiplier === 'DISTILLATION') {
        const fromLearningRateMultiplier = getValueByPath(fromObject, [
            'learningRateMultiplier',
        ]);
        if (parentObject !== undefined && fromLearningRateMultiplier != null) {
            setValueByPath(parentObject, ['distillationSpec', 'hyperParameters', 'learningRateMultiplier'], fromLearningRateMultiplier);
        }
    }
    let discriminatorExportLastCheckpointOnly = getValueByPath(rootObject, ['config', 'method']);
    if (discriminatorExportLastCheckpointOnly === undefined) {
        discriminatorExportLastCheckpointOnly = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorExportLastCheckpointOnly === 'SUPERVISED_FINE_TUNING') {
        const fromExportLastCheckpointOnly = getValueByPath(fromObject, [
            'exportLastCheckpointOnly',
        ]);
        if (parentObject !== undefined && fromExportLastCheckpointOnly != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec', 'exportLastCheckpointOnly'], fromExportLastCheckpointOnly);
        }
    }
    else if (discriminatorExportLastCheckpointOnly === 'PREFERENCE_TUNING') {
        const fromExportLastCheckpointOnly = getValueByPath(fromObject, [
            'exportLastCheckpointOnly',
        ]);
        if (parentObject !== undefined && fromExportLastCheckpointOnly != null) {
            setValueByPath(parentObject, ['preferenceOptimizationSpec', 'exportLastCheckpointOnly'], fromExportLastCheckpointOnly);
        }
    }
    else if (discriminatorExportLastCheckpointOnly === 'DISTILLATION') {
        const fromExportLastCheckpointOnly = getValueByPath(fromObject, [
            'exportLastCheckpointOnly',
        ]);
        if (parentObject !== undefined && fromExportLastCheckpointOnly != null) {
            setValueByPath(parentObject, ['distillationSpec', 'exportLastCheckpointOnly'], fromExportLastCheckpointOnly);
        }
    }
    let discriminatorAdapterSize = getValueByPath(rootObject, [
        'config',
        'method',
    ]);
    if (discriminatorAdapterSize === undefined) {
        discriminatorAdapterSize = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorAdapterSize === 'SUPERVISED_FINE_TUNING') {
        const fromAdapterSize = getValueByPath(fromObject, ['adapterSize']);
        if (parentObject !== undefined && fromAdapterSize != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec', 'hyperParameters', 'adapterSize'], fromAdapterSize);
        }
    }
    else if (discriminatorAdapterSize === 'PREFERENCE_TUNING') {
        const fromAdapterSize = getValueByPath(fromObject, ['adapterSize']);
        if (parentObject !== undefined && fromAdapterSize != null) {
            setValueByPath(parentObject, ['preferenceOptimizationSpec', 'hyperParameters', 'adapterSize'], fromAdapterSize);
        }
    }
    else if (discriminatorAdapterSize === 'DISTILLATION') {
        const fromAdapterSize = getValueByPath(fromObject, ['adapterSize']);
        if (parentObject !== undefined && fromAdapterSize != null) {
            setValueByPath(parentObject, ['distillationSpec', 'hyperParameters', 'adapterSize'], fromAdapterSize);
        }
    }
    let discriminatorTuningMode = getValueByPath(rootObject, [
        'config',
        'method',
    ]);
    if (discriminatorTuningMode === undefined) {
        discriminatorTuningMode = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorTuningMode === 'SUPERVISED_FINE_TUNING') {
        const fromTuningMode = getValueByPath(fromObject, ['tuningMode']);
        if (parentObject !== undefined && fromTuningMode != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec', 'tuningMode'], fromTuningMode);
        }
    }
    else if (discriminatorTuningMode === 'DISTILLATION') {
        const fromTuningMode = getValueByPath(fromObject, ['tuningMode']);
        if (parentObject !== undefined && fromTuningMode != null) {
            setValueByPath(parentObject, ['distillationSpec', 'tuningMode'], fromTuningMode);
        }
    }
    const fromCustomBaseModel = getValueByPath(fromObject, [
        'customBaseModel',
    ]);
    if (parentObject !== undefined && fromCustomBaseModel != null) {
        setValueByPath(parentObject, ['customBaseModel'], fromCustomBaseModel);
    }
    let discriminatorBatchSize = getValueByPath(rootObject, [
        'config',
        'method',
    ]);
    if (discriminatorBatchSize === undefined) {
        discriminatorBatchSize = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorBatchSize === 'SUPERVISED_FINE_TUNING') {
        const fromBatchSize = getValueByPath(fromObject, ['batchSize']);
        if (parentObject !== undefined && fromBatchSize != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec', 'hyperParameters', 'batchSize'], fromBatchSize);
        }
    }
    else if (discriminatorBatchSize === 'DISTILLATION') {
        const fromBatchSize = getValueByPath(fromObject, ['batchSize']);
        if (parentObject !== undefined && fromBatchSize != null) {
            setValueByPath(parentObject, ['distillationSpec', 'hyperParameters', 'batchSize'], fromBatchSize);
        }
    }
    let discriminatorLearningRate = getValueByPath(rootObject, [
        'config',
        'method',
    ]);
    if (discriminatorLearningRate === undefined) {
        discriminatorLearningRate = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorLearningRate === 'SUPERVISED_FINE_TUNING') {
        const fromLearningRate = getValueByPath(fromObject, [
            'learningRate',
        ]);
        if (parentObject !== undefined && fromLearningRate != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec', 'hyperParameters', 'learningRate'], fromLearningRate);
        }
    }
    else if (discriminatorLearningRate === 'DISTILLATION') {
        const fromLearningRate = getValueByPath(fromObject, [
            'learningRate',
        ]);
        if (parentObject !== undefined && fromLearningRate != null) {
            setValueByPath(parentObject, ['distillationSpec', 'hyperParameters', 'learningRate'], fromLearningRate);
        }
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (parentObject !== undefined && fromLabels != null) {
        setValueByPath(parentObject, ['labels'], fromLabels);
    }
    const fromBeta = getValueByPath(fromObject, ['beta']);
    if (parentObject !== undefined && fromBeta != null) {
        setValueByPath(parentObject, ['preferenceOptimizationSpec', 'hyperParameters', 'beta'], fromBeta);
    }
    const fromBaseTeacherModel = getValueByPath(fromObject, [
        'baseTeacherModel',
    ]);
    if (parentObject !== undefined && fromBaseTeacherModel != null) {
        setValueByPath(parentObject, ['distillationSpec', 'baseTeacherModel'], fromBaseTeacherModel);
    }
    const fromTunedTeacherModelSource = getValueByPath(fromObject, [
        'tunedTeacherModelSource',
    ]);
    if (parentObject !== undefined && fromTunedTeacherModelSource != null) {
        setValueByPath(parentObject, ['distillationSpec', 'tunedTeacherModelSource'], fromTunedTeacherModelSource);
    }
    const fromSftLossWeightMultiplier = getValueByPath(fromObject, [
        'sftLossWeightMultiplier',
    ]);
    if (parentObject !== undefined && fromSftLossWeightMultiplier != null) {
        setValueByPath(parentObject, ['distillationSpec', 'hyperParameters', 'sftLossWeightMultiplier'], fromSftLossWeightMultiplier);
    }
    const fromOutputUri = getValueByPath(fromObject, ['outputUri']);
    if (parentObject !== undefined && fromOutputUri != null) {
        setValueByPath(parentObject, ['outputUri'], fromOutputUri);
    }
    const fromEncryptionSpec = getValueByPath(fromObject, [
        'encryptionSpec',
    ]);
    if (parentObject !== undefined && fromEncryptionSpec != null) {
        setValueByPath(parentObject, ['encryptionSpec'], fromEncryptionSpec);
    }
    return toObject;
}
function createTuningJobParametersPrivateToMldev(fromObject, rootObject) {
    const toObject = {};
    const fromBaseModel = getValueByPath(fromObject, ['baseModel']);
    if (fromBaseModel != null) {
        setValueByPath(toObject, ['baseModel'], fromBaseModel);
    }
    const fromPreTunedModel = getValueByPath(fromObject, [
        'preTunedModel',
    ]);
    if (fromPreTunedModel != null) {
        setValueByPath(toObject, ['preTunedModel'], fromPreTunedModel);
    }
    const fromTrainingDataset = getValueByPath(fromObject, [
        'trainingDataset',
    ]);
    if (fromTrainingDataset != null) {
        tuningDatasetToMldev(fromTrainingDataset);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        createTuningJobConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function createTuningJobParametersPrivateToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromBaseModel = getValueByPath(fromObject, ['baseModel']);
    if (fromBaseModel != null) {
        setValueByPath(toObject, ['baseModel'], fromBaseModel);
    }
    const fromPreTunedModel = getValueByPath(fromObject, [
        'preTunedModel',
    ]);
    if (fromPreTunedModel != null) {
        setValueByPath(toObject, ['preTunedModel'], fromPreTunedModel);
    }
    const fromTrainingDataset = getValueByPath(fromObject, [
        'trainingDataset',
    ]);
    if (fromTrainingDataset != null) {
        tuningDatasetToVertex(fromTrainingDataset, toObject, rootObject);
    }
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        createTuningJobConfigToVertex(fromConfig, toObject, rootObject);
    }
    return toObject;
}
function getTuningJobParametersToMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], fromName);
    }
    return toObject;
}
function getTuningJobParametersToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['_url', 'name'], fromName);
    }
    return toObject;
}
function listTuningJobsConfigToMldev(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    const fromFilter = getValueByPath(fromObject, ['filter']);
    if (parentObject !== undefined && fromFilter != null) {
        setValueByPath(parentObject, ['_query', 'filter'], fromFilter);
    }
    return toObject;
}
function listTuningJobsConfigToVertex(fromObject, parentObject, _rootObject) {
    const toObject = {};
    const fromPageSize = getValueByPath(fromObject, ['pageSize']);
    if (parentObject !== undefined && fromPageSize != null) {
        setValueByPath(parentObject, ['_query', 'pageSize'], fromPageSize);
    }
    const fromPageToken = getValueByPath(fromObject, ['pageToken']);
    if (parentObject !== undefined && fromPageToken != null) {
        setValueByPath(parentObject, ['_query', 'pageToken'], fromPageToken);
    }
    const fromFilter = getValueByPath(fromObject, ['filter']);
    if (parentObject !== undefined && fromFilter != null) {
        setValueByPath(parentObject, ['_query', 'filter'], fromFilter);
    }
    return toObject;
}
function listTuningJobsParametersToMldev(fromObject, rootObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listTuningJobsConfigToMldev(fromConfig, toObject);
    }
    return toObject;
}
function listTuningJobsParametersToVertex(fromObject, rootObject) {
    const toObject = {};
    const fromConfig = getValueByPath(fromObject, ['config']);
    if (fromConfig != null) {
        listTuningJobsConfigToVertex(fromConfig, toObject);
    }
    return toObject;
}
function listTuningJobsResponseFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromTuningJobs = getValueByPath(fromObject, ['tunedModels']);
    if (fromTuningJobs != null) {
        let transformedList = fromTuningJobs;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return tuningJobFromMldev(item);
            });
        }
        setValueByPath(toObject, ['tuningJobs'], transformedList);
    }
    return toObject;
}
function listTuningJobsResponseFromVertex(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromNextPageToken = getValueByPath(fromObject, [
        'nextPageToken',
    ]);
    if (fromNextPageToken != null) {
        setValueByPath(toObject, ['nextPageToken'], fromNextPageToken);
    }
    const fromTuningJobs = getValueByPath(fromObject, ['tuningJobs']);
    if (fromTuningJobs != null) {
        let transformedList = fromTuningJobs;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return tuningJobFromVertex(item);
            });
        }
        setValueByPath(toObject, ['tuningJobs'], transformedList);
    }
    return toObject;
}
function tunedModelFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromModel = getValueByPath(fromObject, ['name']);
    if (fromModel != null) {
        setValueByPath(toObject, ['model'], fromModel);
    }
    const fromEndpoint = getValueByPath(fromObject, ['name']);
    if (fromEndpoint != null) {
        setValueByPath(toObject, ['endpoint'], fromEndpoint);
    }
    return toObject;
}
function tuningDatasetToMldev(fromObject, _rootObject) {
    const toObject = {};
    if (getValueByPath(fromObject, ['gcsUri']) !== undefined) {
        throw new Error('gcsUri parameter is not supported in Gemini API.');
    }
    if (getValueByPath(fromObject, ['vertexDatasetResource']) !== undefined) {
        throw new Error('vertexDatasetResource parameter is not supported in Gemini API.');
    }
    const fromExamples = getValueByPath(fromObject, ['examples']);
    if (fromExamples != null) {
        let transformedList = fromExamples;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['examples', 'examples'], transformedList);
    }
    return toObject;
}
function tuningDatasetToVertex(fromObject, parentObject, rootObject) {
    const toObject = {};
    let discriminatorGcsUri = getValueByPath(rootObject, [
        'config',
        'method',
    ]);
    if (discriminatorGcsUri === undefined) {
        discriminatorGcsUri = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorGcsUri === 'SUPERVISED_FINE_TUNING') {
        const fromGcsUri = getValueByPath(fromObject, ['gcsUri']);
        if (parentObject !== undefined && fromGcsUri != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec', 'trainingDatasetUri'], fromGcsUri);
        }
    }
    else if (discriminatorGcsUri === 'PREFERENCE_TUNING') {
        const fromGcsUri = getValueByPath(fromObject, ['gcsUri']);
        if (parentObject !== undefined && fromGcsUri != null) {
            setValueByPath(parentObject, ['preferenceOptimizationSpec', 'trainingDatasetUri'], fromGcsUri);
        }
    }
    else if (discriminatorGcsUri === 'DISTILLATION') {
        const fromGcsUri = getValueByPath(fromObject, ['gcsUri']);
        if (parentObject !== undefined && fromGcsUri != null) {
            setValueByPath(parentObject, ['distillationSpec', 'promptDatasetUri'], fromGcsUri);
        }
    }
    let discriminatorVertexDatasetResource = getValueByPath(rootObject, [
        'config',
        'method',
    ]);
    if (discriminatorVertexDatasetResource === undefined) {
        discriminatorVertexDatasetResource = 'SUPERVISED_FINE_TUNING';
    }
    if (discriminatorVertexDatasetResource === 'SUPERVISED_FINE_TUNING') {
        const fromVertexDatasetResource = getValueByPath(fromObject, [
            'vertexDatasetResource',
        ]);
        if (parentObject !== undefined && fromVertexDatasetResource != null) {
            setValueByPath(parentObject, ['supervisedTuningSpec', 'trainingDatasetUri'], fromVertexDatasetResource);
        }
    }
    else if (discriminatorVertexDatasetResource === 'PREFERENCE_TUNING') {
        const fromVertexDatasetResource = getValueByPath(fromObject, [
            'vertexDatasetResource',
        ]);
        if (parentObject !== undefined && fromVertexDatasetResource != null) {
            setValueByPath(parentObject, ['preferenceOptimizationSpec', 'trainingDatasetUri'], fromVertexDatasetResource);
        }
    }
    else if (discriminatorVertexDatasetResource === 'DISTILLATION') {
        const fromVertexDatasetResource = getValueByPath(fromObject, [
            'vertexDatasetResource',
        ]);
        if (parentObject !== undefined && fromVertexDatasetResource != null) {
            setValueByPath(parentObject, ['distillationSpec', 'promptDatasetUri'], fromVertexDatasetResource);
        }
    }
    if (getValueByPath(fromObject, ['examples']) !== undefined) {
        throw new Error('examples parameter is not supported in Vertex AI.');
    }
    return toObject;
}
function tuningJobFromMldev(fromObject, rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromState = getValueByPath(fromObject, ['state']);
    if (fromState != null) {
        setValueByPath(toObject, ['state'], tTuningJobStatus(fromState));
    }
    const fromCreateTime = getValueByPath(fromObject, ['createTime']);
    if (fromCreateTime != null) {
        setValueByPath(toObject, ['createTime'], fromCreateTime);
    }
    const fromStartTime = getValueByPath(fromObject, [
        'tuningTask',
        'startTime',
    ]);
    if (fromStartTime != null) {
        setValueByPath(toObject, ['startTime'], fromStartTime);
    }
    const fromEndTime = getValueByPath(fromObject, [
        'tuningTask',
        'completeTime',
    ]);
    if (fromEndTime != null) {
        setValueByPath(toObject, ['endTime'], fromEndTime);
    }
    const fromUpdateTime = getValueByPath(fromObject, ['updateTime']);
    if (fromUpdateTime != null) {
        setValueByPath(toObject, ['updateTime'], fromUpdateTime);
    }
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (fromDescription != null) {
        setValueByPath(toObject, ['description'], fromDescription);
    }
    const fromBaseModel = getValueByPath(fromObject, ['baseModel']);
    if (fromBaseModel != null) {
        setValueByPath(toObject, ['baseModel'], fromBaseModel);
    }
    const fromTunedModel = getValueByPath(fromObject, ['_self']);
    if (fromTunedModel != null) {
        setValueByPath(toObject, ['tunedModel'], tunedModelFromMldev(fromTunedModel));
    }
    return toObject;
}
function tuningJobFromVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
    const fromName = getValueByPath(fromObject, ['name']);
    if (fromName != null) {
        setValueByPath(toObject, ['name'], fromName);
    }
    const fromState = getValueByPath(fromObject, ['state']);
    if (fromState != null) {
        setValueByPath(toObject, ['state'], tTuningJobStatus(fromState));
    }
    const fromCreateTime = getValueByPath(fromObject, ['createTime']);
    if (fromCreateTime != null) {
        setValueByPath(toObject, ['createTime'], fromCreateTime);
    }
    const fromStartTime = getValueByPath(fromObject, ['startTime']);
    if (fromStartTime != null) {
        setValueByPath(toObject, ['startTime'], fromStartTime);
    }
    const fromEndTime = getValueByPath(fromObject, ['endTime']);
    if (fromEndTime != null) {
        setValueByPath(toObject, ['endTime'], fromEndTime);
    }
    const fromUpdateTime = getValueByPath(fromObject, ['updateTime']);
    if (fromUpdateTime != null) {
        setValueByPath(toObject, ['updateTime'], fromUpdateTime);
    }
    const fromError = getValueByPath(fromObject, ['error']);
    if (fromError != null) {
        setValueByPath(toObject, ['error'], fromError);
    }
    const fromDescription = getValueByPath(fromObject, ['description']);
    if (fromDescription != null) {
        setValueByPath(toObject, ['description'], fromDescription);
    }
    const fromBaseModel = getValueByPath(fromObject, ['baseModel']);
    if (fromBaseModel != null) {
        setValueByPath(toObject, ['baseModel'], fromBaseModel);
    }
    const fromTunedModel = getValueByPath(fromObject, ['tunedModel']);
    if (fromTunedModel != null) {
        setValueByPath(toObject, ['tunedModel'], fromTunedModel);
    }
    const fromPreTunedModel = getValueByPath(fromObject, [
        'preTunedModel',
    ]);
    if (fromPreTunedModel != null) {
        setValueByPath(toObject, ['preTunedModel'], fromPreTunedModel);
    }
    const fromSupervisedTuningSpec = getValueByPath(fromObject, [
        'supervisedTuningSpec',
    ]);
    if (fromSupervisedTuningSpec != null) {
        setValueByPath(toObject, ['supervisedTuningSpec'], fromSupervisedTuningSpec);
    }
    const fromPreferenceOptimizationSpec = getValueByPath(fromObject, [
        'preferenceOptimizationSpec',
    ]);
    if (fromPreferenceOptimizationSpec != null) {
        setValueByPath(toObject, ['preferenceOptimizationSpec'], fromPreferenceOptimizationSpec);
    }
    const fromDistillationSpec = getValueByPath(fromObject, [
        'distillationSpec',
    ]);
    if (fromDistillationSpec != null) {
        setValueByPath(toObject, ['distillationSpec'], fromDistillationSpec);
    }
    const fromTuningDataStats = getValueByPath(fromObject, [
        'tuningDataStats',
    ]);
    if (fromTuningDataStats != null) {
        setValueByPath(toObject, ['tuningDataStats'], fromTuningDataStats);
    }
    const fromEncryptionSpec = getValueByPath(fromObject, [
        'encryptionSpec',
    ]);
    if (fromEncryptionSpec != null) {
        setValueByPath(toObject, ['encryptionSpec'], fromEncryptionSpec);
    }
    const fromPartnerModelTuningSpec = getValueByPath(fromObject, [
        'partnerModelTuningSpec',
    ]);
    if (fromPartnerModelTuningSpec != null) {
        setValueByPath(toObject, ['partnerModelTuningSpec'], fromPartnerModelTuningSpec);
    }
    const fromCustomBaseModel = getValueByPath(fromObject, [
        'customBaseModel',
    ]);
    if (fromCustomBaseModel != null) {
        setValueByPath(toObject, ['customBaseModel'], fromCustomBaseModel);
    }
    const fromEvaluateDatasetRuns = getValueByPath(fromObject, [
        'evaluateDatasetRuns',
    ]);
    if (fromEvaluateDatasetRuns != null) {
        let transformedList = fromEvaluateDatasetRuns;
        if (Array.isArray(transformedList)) {
            transformedList = transformedList.map((item) => {
                return item;
            });
        }
        setValueByPath(toObject, ['evaluateDatasetRuns'], transformedList);
    }
    const fromExperiment = getValueByPath(fromObject, ['experiment']);
    if (fromExperiment != null) {
        setValueByPath(toObject, ['experiment'], fromExperiment);
    }
    const fromFullFineTuningSpec = getValueByPath(fromObject, [
        'fullFineTuningSpec',
    ]);
    if (fromFullFineTuningSpec != null) {
        setValueByPath(toObject, ['fullFineTuningSpec'], fromFullFineTuningSpec);
    }
    const fromLabels = getValueByPath(fromObject, ['labels']);
    if (fromLabels != null) {
        setValueByPath(toObject, ['labels'], fromLabels);
    }
    const fromOutputUri = getValueByPath(fromObject, ['outputUri']);
    if (fromOutputUri != null) {
        setValueByPath(toObject, ['outputUri'], fromOutputUri);
    }
    const fromPipelineJob = getValueByPath(fromObject, ['pipelineJob']);
    if (fromPipelineJob != null) {
        setValueByPath(toObject, ['pipelineJob'], fromPipelineJob);
    }
    const fromServiceAccount = getValueByPath(fromObject, [
        'serviceAccount',
    ]);
    if (fromServiceAccount != null) {
        setValueByPath(toObject, ['serviceAccount'], fromServiceAccount);
    }
    const fromTunedModelDisplayName = getValueByPath(fromObject, [
        'tunedModelDisplayName',
    ]);
    if (fromTunedModelDisplayName != null) {
        setValueByPath(toObject, ['tunedModelDisplayName'], fromTunedModelDisplayName);
    }
    const fromTuningJobState = getValueByPath(fromObject, [
        'tuningJobState',
    ]);
    if (fromTuningJobState != null) {
        setValueByPath(toObject, ['tuningJobState'], fromTuningJobState);
    }
    const fromVeoTuningSpec = getValueByPath(fromObject, [
        'veoTuningSpec',
    ]);
    if (fromVeoTuningSpec != null) {
        setValueByPath(toObject, ['veoTuningSpec'], fromVeoTuningSpec);
    }
    const fromDistillationSamplingSpec = getValueByPath(fromObject, [
        'distillationSamplingSpec',
    ]);
    if (fromDistillationSamplingSpec != null) {
        setValueByPath(toObject, ['distillationSamplingSpec'], fromDistillationSamplingSpec);
    }
    const fromTuningJobMetadata = getValueByPath(fromObject, [
        'tuningJobMetadata',
    ]);
    if (fromTuningJobMetadata != null) {
        setValueByPath(toObject, ['tuningJobMetadata'], fromTuningJobMetadata);
    }
    return toObject;
}
function tuningOperationFromMldev(fromObject, _rootObject) {
    const toObject = {};
    const fromSdkHttpResponse = getValueByPath(fromObject, [
        'sdkHttpResponse',
    ]);
    if (fromSdkHttpResponse != null) {
        setValueByPath(toObject, ['sdkHttpResponse'], fromSdkHttpResponse);
    }
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
    return toObject;
}
function tuningValidationDatasetToVertex(fromObject, _rootObject) {
    const toObject = {};
    const fromGcsUri = getValueByPath(fromObject, ['gcsUri']);
    if (fromGcsUri != null) {
        setValueByPath(toObject, ['validationDatasetUri'], fromGcsUri);
    }
    const fromVertexDatasetResource = getValueByPath(fromObject, [
        'vertexDatasetResource',
    ]);
    if (fromVertexDatasetResource != null) {
        setValueByPath(toObject, ['validationDatasetUri'], fromVertexDatasetResource);
    }
    return toObject;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Tunings extends BaseModule {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
        /**
         * Lists tuning jobs.
         *
         * @param params - The parameters for the list request.
         * @return - A pager of tuning jobs.
         *
         * @example
         * ```ts
         * const tuningJobs = await ai.tunings.list({config: {'pageSize': 2}});
         * for await (const tuningJob of tuningJobs) {
         *   console.log(tuningJob);
         * }
         * ```
         */
        this.list = async (params = {}) => {
            return new Pager(PagedItem.PAGED_ITEM_TUNING_JOBS, (x) => this.listInternal(x), await this.listInternal(params), params);
        };
        /**
         * Gets a TuningJob.
         *
         * @param name - The resource name of the tuning job.
         * @return - A TuningJob object.
         *
         * @experimental - The SDK's tuning implementation is experimental, and may
         * change in future versions.
         */
        this.get = async (params) => {
            return await this.getInternal(params);
        };
        /**
         * Creates a supervised fine-tuning job.
         *
         * @param params - The parameters for the tuning job.
         * @return - A TuningJob operation.
         *
         * @experimental - The SDK's tuning implementation is experimental, and may
         * change in future versions.
         */
        this.tune = async (params) => {
            var _a;
            if (this.apiClient.isVertexAI()) {
                if (params.baseModel.startsWith('projects/')) {
                    const preTunedModel = {
                        tunedModelName: params.baseModel,
                    };
                    if ((_a = params.config) === null || _a === void 0 ? void 0 : _a.preTunedModelCheckpointId) {
                        preTunedModel.checkpointId = params.config.preTunedModelCheckpointId;
                    }
                    const paramsPrivate = Object.assign(Object.assign({}, params), { preTunedModel: preTunedModel });
                    paramsPrivate.baseModel = undefined;
                    return await this.tuneInternal(paramsPrivate);
                }
                else {
                    const paramsPrivate = Object.assign({}, params);
                    return await this.tuneInternal(paramsPrivate);
                }
            }
            else {
                const paramsPrivate = Object.assign({}, params);
                const operation = await this.tuneMldevInternal(paramsPrivate);
                let tunedModelName = '';
                if (operation['metadata'] !== undefined &&
                    operation['metadata']['tunedModel'] !== undefined) {
                    tunedModelName = operation['metadata']['tunedModel'];
                }
                else if (operation['name'] !== undefined &&
                    operation['name'].includes('/operations/')) {
                    tunedModelName = operation['name'].split('/operations/')[0];
                }
                const tuningJob = {
                    name: tunedModelName,
                    state: JobState.JOB_STATE_QUEUED,
                };
                return tuningJob;
            }
        };
    }
    async getInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = getTuningJobParametersToVertex(params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = tuningJobFromVertex(apiResponse);
                return resp;
            });
        }
        else {
            const body = getTuningJobParametersToMldev(params);
            path = formatMap('{name}', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = tuningJobFromMldev(apiResponse);
                return resp;
            });
        }
    }
    async listInternal(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = listTuningJobsParametersToVertex(params);
            path = formatMap('tuningJobs', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = listTuningJobsResponseFromVertex(apiResponse);
                const typedResp = new ListTuningJobsResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = listTuningJobsParametersToMldev(params);
            path = formatMap('tunedModels', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'GET',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = listTuningJobsResponseFromMldev(apiResponse);
                const typedResp = new ListTuningJobsResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    /**
     * Cancels a tuning job.
     *
     * @param params - The parameters for the cancel request.
     * @return The empty response returned by the API.
     *
     * @example
     * ```ts
     * await ai.tunings.cancel({name: '...'}); // The server-generated resource name.
     * ```
     */
    async cancel(params) {
        var _a, _b, _c, _d;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = cancelTuningJobParametersToVertex(params);
            path = formatMap('{name}:cancel', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = cancelTuningJobResponseFromVertex(apiResponse);
                const typedResp = new CancelTuningJobResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
        else {
            const body = cancelTuningJobParametersToMldev(params);
            path = formatMap('{name}:cancel', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_c = params.config) === null || _c === void 0 ? void 0 : _c.httpOptions,
                abortSignal: (_d = params.config) === null || _d === void 0 ? void 0 : _d.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = cancelTuningJobResponseFromMldev(apiResponse);
                const typedResp = new CancelTuningJobResponse();
                Object.assign(typedResp, resp);
                return typedResp;
            });
        }
    }
    async tuneInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            const body = createTuningJobParametersPrivateToVertex(params, params);
            path = formatMap('tuningJobs', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = tuningJobFromVertex(apiResponse);
                return resp;
            });
        }
        else {
            throw new Error('This method is only supported by the Vertex AI.');
        }
    }
    async tuneMldevInternal(params) {
        var _a, _b;
        let response;
        let path = '';
        let queryParams = {};
        if (this.apiClient.isVertexAI()) {
            throw new Error('This method is only supported by the Gemini Developer API.');
        }
        else {
            const body = createTuningJobParametersPrivateToMldev(params);
            path = formatMap('tunedModels', body['_url']);
            queryParams = body['_query'];
            delete body['_url'];
            delete body['_query'];
            response = this.apiClient
                .request({
                path: path,
                queryParams: queryParams,
                body: JSON.stringify(body),
                httpMethod: 'POST',
                httpOptions: (_a = params.config) === null || _a === void 0 ? void 0 : _a.httpOptions,
                abortSignal: (_b = params.config) === null || _b === void 0 ? void 0 : _b.abortSignal,
            })
                .then((httpResponse) => {
                return httpResponse.json().then((jsonResponse) => {
                    const response = jsonResponse;
                    response.sdkHttpResponse = {
                        headers: httpResponse.headers,
                    };
                    return response;
                });
            });
            return response.then((apiResponse) => {
                const resp = tuningOperationFromMldev(apiResponse);
                return resp;
            });
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class BrowserDownloader {
    async download(_params, _apiClient) {
        throw new Error('Download to file is not supported in the browser, please use a browser compliant download like an <a> tag.');
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

class BrowserUploader {
    async upload(file, uploadUrl, apiClient, httpOptions) {
        if (typeof file === 'string') {
            throw new Error('File path is not supported in browser uploader.');
        }
        return await uploadBlob(file, uploadUrl, apiClient, httpOptions);
    }
    async uploadToFileSearchStore(file, uploadUrl, apiClient, httpOptions) {
        if (typeof file === 'string') {
            throw new Error('File path is not supported in browser uploader.');
        }
        return await uploadBlobToFileSearchStore(file, uploadUrl, apiClient, httpOptions);
    }
    async stat(file) {
        if (typeof file === 'string') {
            throw new Error('File path is not supported in browser uploader.');
        }
        else {
            return await getBlobStat(file);
        }
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class BrowserWebSocketFactory {
    create(url, headers, callbacks) {
        return new BrowserWebSocket(url, headers, callbacks);
    }
}
class BrowserWebSocket {
    constructor(url, headers, callbacks) {
        this.url = url;
        this.headers = headers;
        this.callbacks = callbacks;
    }
    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = this.callbacks.onopen;
        this.ws.onerror = this.callbacks.onerror;
        this.ws.onclose = this.callbacks.onclose;
        this.ws.onmessage = this.callbacks.onmessage;
    }
    send(message) {
        if (this.ws === undefined) {
            throw new Error('WebSocket is not connected');
        }
        this.ws.send(message);
    }
    close() {
        if (this.ws === undefined) {
            throw new Error('WebSocket is not connected');
        }
        this.ws.close();
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const GOOGLE_API_KEY_HEADER = 'x-goog-api-key';
// TODO(b/395122533): We need a secure client side authentication mechanism.
class WebAuth {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async addAuthHeaders(headers, url) {
        if (headers.get(GOOGLE_API_KEY_HEADER) !== null) {
            return;
        }
        if (this.apiKey.startsWith('auth_tokens/')) {
            throw new Error('Ephemeral tokens are only supported by the live API.');
        }
        // Check if API key is empty or null
        if (!this.apiKey) {
            throw new Error('API key is missing. Please provide a valid API key.');
        }
        headers.append(GOOGLE_API_KEY_HEADER, this.apiKey);
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const LANGUAGE_LABEL_PREFIX = 'gl-node/';
/**
 * The Google GenAI SDK.
 *
 * @remarks
 * Provides access to the GenAI features through either the {@link
 * https://cloud.google.com/vertex-ai/docs/reference/rest | Gemini API} or
 * the {@link https://cloud.google.com/vertex-ai/docs/reference/rest | Vertex AI
 * API}.
 *
 * The {@link GoogleGenAIOptions.vertexai} value determines which of the API
 * services to use.
 *
 * When using the Gemini API, a {@link GoogleGenAIOptions.apiKey} must also be
 * set. When using Vertex AI, currently only {@link GoogleGenAIOptions.apiKey}
 * is supported via Express mode. {@link GoogleGenAIOptions.project} and {@link
 * GoogleGenAIOptions.location} should not be set.
 *
 * @example
 * Initializing the SDK for using the Gemini API:
 * ```ts
 * import {GoogleGenAI} from '@google/genai';
 * const ai = new GoogleGenAI({apiKey: 'GEMINI_API_KEY'});
 * ```
 *
 * @example
 * Initializing the SDK for using the Vertex AI API:
 * ```ts
 * import {GoogleGenAI} from '@google/genai';
 * const ai = new GoogleGenAI({
 *   vertexai: true,
 *   project: 'PROJECT_ID',
 *   location: 'PROJECT_LOCATION'
 * });
 * ```
 *
 */
class GoogleGenAI {
    get interactions() {
        var _a;
        if (this._interactions !== undefined) {
            return this._interactions;
        }
        console.warn('GoogleGenAI.interactions: Interactions usage is experimental and may change in future versions.');
        const httpOpts = this.httpOptions;
        // Unsupported Options Warnings
        if (httpOpts === null || httpOpts === void 0 ? void 0 : httpOpts.extraBody) {
            console.warn('GoogleGenAI.interactions: Client level httpOptions.extraBody is not supported by the interactions client and will be ignored.');
        }
        const nextGenClient = new GeminiNextGenAPIClient({
            baseURL: this.apiClient.getBaseUrl(),
            apiKey: this.apiKey,
            apiVersion: this.apiClient.getApiVersion(),
            clientAdapter: this.apiClient,
            defaultHeaders: this.apiClient.getDefaultHeaders(),
            timeout: httpOpts === null || httpOpts === void 0 ? void 0 : httpOpts.timeout,
            maxRetries: (_a = httpOpts === null || httpOpts === void 0 ? void 0 : httpOpts.retryOptions) === null || _a === void 0 ? void 0 : _a.attempts,
        });
        this._interactions = nextGenClient.interactions;
        return this._interactions;
    }
    constructor(options) {
        var _a;
        if (options.apiKey == null) {
            throw new Error('An API Key must be set when running in a browser');
        }
        // Web client only supports API key mode for Vertex AI.
        if (options.project || options.location) {
            throw new Error('Vertex AI project based authentication is not supported on browser runtimes. Please do not provide a project or location.');
        }
        this.vertexai = (_a = options.vertexai) !== null && _a !== void 0 ? _a : false;
        this.apiKey = options.apiKey;
        const baseUrl = getBaseUrl(options.httpOptions, options.vertexai, 
        /*vertexBaseUrlFromEnv*/ undefined, 
        /*geminiBaseUrlFromEnv*/ undefined);
        if (baseUrl) {
            if (options.httpOptions) {
                options.httpOptions.baseUrl = baseUrl;
            }
            else {
                options.httpOptions = { baseUrl: baseUrl };
            }
        }
        this.apiVersion = options.apiVersion;
        this.httpOptions = options.httpOptions;
        const auth = new WebAuth(this.apiKey);
        this.apiClient = new ApiClient({
            auth: auth,
            apiVersion: this.apiVersion,
            apiKey: this.apiKey,
            vertexai: this.vertexai,
            httpOptions: this.httpOptions,
            userAgentExtra: LANGUAGE_LABEL_PREFIX + 'web',
            uploader: new BrowserUploader(),
            downloader: new BrowserDownloader(),
        });
        this.models = new Models(this.apiClient);
        this.live = new Live(this.apiClient, auth, new BrowserWebSocketFactory());
        this.batches = new Batches(this.apiClient);
        this.chats = new Chats(this.models, this.apiClient);
        this.caches = new Caches(this.apiClient);
        this.files = new Files(this.apiClient);
        this.operations = new Operations(this.apiClient);
        this.authTokens = new Tokens(this.apiClient);
        this.tunings = new Tunings(this.apiClient);
        this.fileSearchStores = new FileSearchStores(this.apiClient);
    }
}

export { ActivityHandling, AdapterSize, AggregationMetric, ApiError, ApiSpec, AuthType, Batches, Behavior, BlockedReason, Caches, CancelTuningJobResponse, Chat, Chats, ComputeTokensResponse, ContentReferenceImage, ControlReferenceImage, ControlReferenceType, CountTokensResponse, CreateFileResponse, DeleteCachedContentResponse, DeleteFileResponse, DeleteModelResponse, DocumentState, DynamicRetrievalConfigMode, EditImageResponse, EditMode, EmbedContentResponse, EmbeddingApiType, EndSensitivity, Environment, EvaluateDatasetResponse, FeatureSelectionPreference, FileSource, FileState, Files, FinishReason, FunctionCallingConfigMode, FunctionResponse, FunctionResponseBlob, FunctionResponseFileData, FunctionResponsePart, FunctionResponseScheduling, GenerateContentResponse, GenerateContentResponsePromptFeedback, GenerateContentResponseUsageMetadata, GenerateImagesResponse, GenerateVideosOperation, GenerateVideosResponse, GoogleGenAI, HarmBlockMethod, HarmBlockThreshold, HarmCategory, HarmProbability, HarmSeverity, HttpElementLocation, HttpResponse, ImagePromptLanguage, ImportFileOperation, ImportFileResponse, InlinedEmbedContentResponse, InlinedResponse, JobState, Language, ListBatchJobsResponse, ListCachedContentsResponse, ListDocumentsResponse, ListFileSearchStoresResponse, ListFilesResponse, ListModelsResponse, ListTuningJobsResponse, Live, LiveClientToolResponse, LiveMusicPlaybackControl, LiveMusicServerMessage, LiveSendToolResponseParameters, LiveServerMessage, MaskReferenceImage, MaskReferenceMode, MediaModality, MediaResolution, Modality, ModelStage, Models, MusicGenerationMode, Operations, Outcome, PagedItem, Pager, PairwiseChoice, PartMediaResolutionLevel, PersonGeneration, PhishBlockThreshold, ProminentPeople, RawReferenceImage, RecontextImageResponse, RegisterFilesResponse, ReplayResponse, ResourceScope, SafetyFilterLevel, Scale, SegmentImageResponse, SegmentMode, ServiceTier, Session, SingleEmbedContentResponse, StartSensitivity, StyleReferenceImage, SubjectReferenceImage, SubjectReferenceType, ThinkingLevel, Tokens, ToolResponse, ToolType, TrafficType, TuningJobState, TuningMethod, TuningMode, TuningTask, TurnCompleteReason, TurnCoverage, Type, UploadToFileSearchStoreOperation, UploadToFileSearchStoreResponse, UploadToFileSearchStoreResumableResponse, UpscaleImageResponse, UrlRetrievalStatus, VadSignalType, VideoCompressionQuality, VideoGenerationMaskMode, VideoGenerationReferenceType, VoiceActivityType, createFunctionResponsePartFromBase64, createFunctionResponsePartFromUri, createModelContent, createPartFromBase64, createPartFromCodeExecutionResult, createPartFromExecutableCode, createPartFromFunctionCall, createPartFromFunctionResponse, createPartFromText, createPartFromUri, createUserContent, mcpToTool, setDefaultBaseUrls };
//# sourceMappingURL=index.mjs.map
