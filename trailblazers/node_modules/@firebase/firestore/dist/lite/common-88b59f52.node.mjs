import { FirebaseError, getDefaultEmulatorHostnameAndPort, isCloudWorkstation, pingServer, deepEqual, createMockUserToken, getModularInstance } from '@firebase/util';
import { randomBytes as randomBytes$1 } from 'crypto';
import { Logger, LogLevel } from '@firebase/logger';
import { inspect } from 'util';
import { Integer } from '@firebase/webchannel-wrapper/bloom-blob';
import { _getProvider, getApp, _removeServiceInstance, _isFirebaseServerApp } from '@firebase/app';

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Simple wrapper around a nullable UID. Mostly exists to make code more
 * readable.
 */
class User {
    constructor(uid) {
        this.uid = uid;
    }
    isAuthenticated() {
        return this.uid != null;
    }
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */
    toKey() {
        if (this.isAuthenticated()) {
            return 'uid:' + this.uid;
        }
        else {
            return 'anonymous-user';
        }
    }
    isEqual(otherUser) {
        return otherUser.uid === this.uid;
    }
}
/** A user with a null UID. */
User.UNAUTHENTICATED = new User(null);
// TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
User.GOOGLE_CREDENTIALS = new User('google-credentials-uid');
User.FIRST_PARTY = new User('first-party-uid');
User.MOCK_USER = new User('mock-user');

const version = "12.11.0";

/**
 * @license
 * Copyright 2017 Google LLC
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
let SDK_VERSION = version;
function setSDKVersion(version) {
    SDK_VERSION = version;
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
/** Formats an object as a JSON string, suitable for logging. */
function formatJSON(value) {
    // util.inspect() results in much more readable output than JSON.stringify()
    return inspect(value, { depth: 100 });
}

/**
 * @license
 * Copyright 2017 Google LLC
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
const logClient = new Logger('@firebase/firestore');
/**
 * Sets the verbosity of Cloud Firestore logs (debug, error, or silent).
 *
 * @param logLevel - The verbosity you set for activity and error logging. Can
 *   be any of the following values:
 *
 *   <ul>
 *     <li>`debug` for the most verbose logging level, primarily for
 *     debugging.</li>
 *     <li>`error` to log errors only.</li>
 *     <li><code>`silent` to turn off logging.</li>
 *   </ul>
 */
function setLogLevel(logLevel) {
    logClient.setLogLevel(logLevel);
}
function logDebug(msg, ...obj) {
    if (logClient.logLevel <= LogLevel.DEBUG) {
        const args = obj.map(argToString);
        logClient.debug(`Firestore (${SDK_VERSION}): ${msg}`, ...args);
    }
}
function logError(msg, ...obj) {
    if (logClient.logLevel <= LogLevel.ERROR) {
        const args = obj.map(argToString);
        logClient.error(`Firestore (${SDK_VERSION}): ${msg}`, ...args);
    }
}
/**
 * @internal
 */
function logWarn(msg, ...obj) {
    if (logClient.logLevel <= LogLevel.WARN) {
        const args = obj.map(argToString);
        logClient.warn(`Firestore (${SDK_VERSION}): ${msg}`, ...args);
    }
}
/**
 * Converts an additional log parameter to a string representation.
 */
function argToString(obj) {
    if (typeof obj === 'string') {
        return obj;
    }
    else {
        try {
            return formatJSON(obj);
        }
        catch (e) {
            // Converting to JSON failed, just log the object directly
            return obj;
        }
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
function fail(id, messageOrContext, context) {
    let message = 'Unexpected state';
    if (typeof messageOrContext === 'string') {
        message = messageOrContext;
    }
    else {
        context = messageOrContext;
    }
    _fail(id, message, context);
}
function _fail(id, failure, context) {
    // Log the failure in addition to throw an exception, just in case the
    // exception is swallowed.
    let message = `FIRESTORE (${SDK_VERSION}) INTERNAL ASSERTION FAILED: ${failure} (ID: ${id.toString(16)})`;
    if (context !== undefined) {
        try {
            const stringContext = JSON.stringify(context);
            message += ' CONTEXT: ' + stringContext;
        }
        catch (e) {
            message += ' CONTEXT: ' + context;
        }
    }
    logError(message);
    // NOTE: We don't use FirestoreError here because these are internal failures
    // that cannot be handled by the user. (Also it would create a circular
    // dependency between the error and assert modules which doesn't work.)
    throw new Error(message);
}
function hardAssert(assertion, id, messageOrContext, context) {
    let message = 'Unexpected state';
    if (typeof messageOrContext === 'string') {
        message = messageOrContext;
    }
    else {
        context = messageOrContext;
    }
    if (!assertion) {
        _fail(id, message, context);
    }
}
/**
 * Casts `obj` to `T`. In non-production builds, verifies that `obj` is an
 * instance of `T` before casting.
 */
function debugCast(obj, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
constructor) {
    return obj;
}

/**
 * @license
 * Copyright 2017 Google LLC
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
    // Causes are copied from:
    // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
    /** Not an error; returned on success. */
    OK: 'ok',
    /** The operation was cancelled (typically by the caller). */
    CANCELLED: 'cancelled',
    /** Unknown error or an error from a different error domain. */
    UNKNOWN: 'unknown',
    /**
     * Client specified an invalid argument. Note that this differs from
     * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
     * problematic regardless of the state of the system (e.g., a malformed file
     * name).
     */
    INVALID_ARGUMENT: 'invalid-argument',
    /**
     * Deadline expired before operation could complete. For operations that
     * change the state of the system, this error may be returned even if the
     * operation has completed successfully. For example, a successful response
     * from a server could have been delayed long enough for the deadline to
     * expire.
     */
    DEADLINE_EXCEEDED: 'deadline-exceeded',
    /** Some requested entity (e.g., file or directory) was not found. */
    NOT_FOUND: 'not-found',
    /**
     * Some entity that we attempted to create (e.g., file or directory) already
     * exists.
     */
    ALREADY_EXISTS: 'already-exists',
    /**
     * The caller does not have permission to execute the specified operation.
     * PERMISSION_DENIED must not be used for rejections caused by exhausting
     * some resource (use RESOURCE_EXHAUSTED instead for those errors).
     * PERMISSION_DENIED must not be used if the caller cannot be identified
     * (use UNAUTHENTICATED instead for those errors).
     */
    PERMISSION_DENIED: 'permission-denied',
    /**
     * The request does not have valid authentication credentials for the
     * operation.
     */
    UNAUTHENTICATED: 'unauthenticated',
    /**
     * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
     * entire file system is out of space.
     */
    RESOURCE_EXHAUSTED: 'resource-exhausted',
    /**
     * Operation was rejected because the system is not in a state required for
     * the operation's execution. For example, directory to be deleted may be
     * non-empty, an rmdir operation is applied to a non-directory, etc.
     *
     * A litmus test that may help a service implementor in deciding
     * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
     *  (a) Use UNAVAILABLE if the client can retry just the failing call.
     *  (b) Use ABORTED if the client should retry at a higher-level
     *      (e.g., restarting a read-modify-write sequence).
     *  (c) Use FAILED_PRECONDITION if the client should not retry until
     *      the system state has been explicitly fixed. E.g., if an "rmdir"
     *      fails because the directory is non-empty, FAILED_PRECONDITION
     *      should be returned since the client should not retry unless
     *      they have first fixed up the directory by deleting files from it.
     *  (d) Use FAILED_PRECONDITION if the client performs conditional
     *      REST Get/Update/Delete on a resource and the resource on the
     *      server does not match the condition. E.g., conflicting
     *      read-modify-write on the same resource.
     */
    FAILED_PRECONDITION: 'failed-precondition',
    /**
     * The operation was aborted, typically due to a concurrency issue like
     * sequencer check failures, transaction aborts, etc.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    ABORTED: 'aborted',
    /**
     * Operation was attempted past the valid range. E.g., seeking or reading
     * past end of file.
     *
     * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
     * if the system state changes. For example, a 32-bit file system will
     * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
     * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
     * an offset past the current file size.
     *
     * There is a fair bit of overlap between FAILED_PRECONDITION and
     * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
     * when it applies so that callers who are iterating through a space can
     * easily look for an OUT_OF_RANGE error to detect when they are done.
     */
    OUT_OF_RANGE: 'out-of-range',
    /** Operation is not implemented or not supported/enabled in this service. */
    UNIMPLEMENTED: 'unimplemented',
    /**
     * Internal errors. Means some invariants expected by underlying System has
     * been broken. If you see one of these errors, Something is very broken.
     */
    INTERNAL: 'internal',
    /**
     * The service is currently unavailable. This is a most likely a transient
     * condition and may be corrected by retrying with a backoff.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    UNAVAILABLE: 'unavailable',
    /** Unrecoverable data loss or corruption. */
    DATA_LOSS: 'data-loss'
};
/** An error returned by a Firestore operation. */
class FirestoreError extends FirebaseError {
    /** @hideconstructor */
    constructor(
    /**
     * The backend error code associated with this error.
     */
    code, 
    /**
     * A custom error description.
     */
    message) {
        super(code, message);
        this.code = code;
        this.message = message;
        // HACK: We write a toString property directly because Error is not a real
        // class and so inheritance does not work correctly. We could alternatively
        // do the same "back-door inheritance" trick that FirebaseError does.
        this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
class OAuthToken {
    constructor(value, user) {
        this.user = user;
        this.type = 'OAuth';
        this.headers = new Map();
        this.headers.set('Authorization', `Bearer ${value}`);
    }
}
/**
 * A CredentialsProvider that always yields an empty token.
 * @internal
 */
class EmptyAuthCredentialsProvider {
    getToken() {
        return Promise.resolve(null);
    }
    invalidateToken() { }
    start(asyncQueue, changeListener) {
        // Fire with initial user.
        asyncQueue.enqueueRetryable(() => changeListener(User.UNAUTHENTICATED));
    }
    shutdown() { }
}
/**
 * A CredentialsProvider that always returns a constant token. Used for
 * emulator token mocking.
 */
class EmulatorAuthCredentialsProvider {
    constructor(token) {
        this.token = token;
        /**
         * Stores the listener registered with setChangeListener()
         * This isn't actually necessary since the UID never changes, but we use this
         * to verify the listen contract is adhered to in tests.
         */
        this.changeListener = null;
    }
    getToken() {
        return Promise.resolve(this.token);
    }
    invalidateToken() { }
    start(asyncQueue, changeListener) {
        this.changeListener = changeListener;
        // Fire with initial user.
        asyncQueue.enqueueRetryable(() => changeListener(this.token.user));
    }
    shutdown() {
        this.changeListener = null;
    }
}
/** Credential provider for the Lite SDK. */
class LiteAuthCredentialsProvider {
    constructor(authProvider) {
        this.auth = null;
        authProvider.onInit(auth => {
            this.auth = auth;
        });
    }
    getToken() {
        if (!this.auth) {
            return Promise.resolve(null);
        }
        return this.auth.getToken().then(tokenData => {
            if (tokenData) {
                hardAssert(typeof tokenData.accessToken === 'string', 0xa539, { tokenData });
                return new OAuthToken(tokenData.accessToken, new User(this.auth.getUid()));
            }
            else {
                return null;
            }
        });
    }
    invalidateToken() { }
    start(asyncQueue, changeListener) { }
    shutdown() { }
}
/*
 * FirstPartyToken provides a fresh token each time its value
 * is requested, because if the token is too old, requests will be rejected.
 * Technically this may no longer be necessary since the SDK should gracefully
 * recover from unauthenticated errors (see b/33147818 for context), but it's
 * safer to keep the implementation as-is.
 */
class FirstPartyToken {
    constructor(sessionIndex, iamToken, authTokenFactory) {
        this.sessionIndex = sessionIndex;
        this.iamToken = iamToken;
        this.authTokenFactory = authTokenFactory;
        this.type = 'FirstParty';
        this.user = User.FIRST_PARTY;
        this._headers = new Map();
    }
    /**
     * Gets an authorization token, using a provided factory function, or return
     * null.
     */
    getAuthToken() {
        if (this.authTokenFactory) {
            return this.authTokenFactory();
        }
        else {
            return null;
        }
    }
    get headers() {
        this._headers.set('X-Goog-AuthUser', this.sessionIndex);
        // Use array notation to prevent minification
        const authHeaderTokenValue = this.getAuthToken();
        if (authHeaderTokenValue) {
            this._headers.set('Authorization', authHeaderTokenValue);
        }
        if (this.iamToken) {
            this._headers.set('X-Goog-Iam-Authorization-Token', this.iamToken);
        }
        return this._headers;
    }
}
/*
 * Provides user credentials required for the Firestore JavaScript SDK
 * to authenticate the user, using technique that is only available
 * to applications hosted by Google.
 */
class FirstPartyAuthCredentialsProvider {
    constructor(sessionIndex, iamToken, authTokenFactory) {
        this.sessionIndex = sessionIndex;
        this.iamToken = iamToken;
        this.authTokenFactory = authTokenFactory;
    }
    getToken() {
        return Promise.resolve(new FirstPartyToken(this.sessionIndex, this.iamToken, this.authTokenFactory));
    }
    start(asyncQueue, changeListener) {
        // Fire with initial uid.
        asyncQueue.enqueueRetryable(() => changeListener(User.FIRST_PARTY));
    }
    shutdown() { }
    invalidateToken() { }
}
class AppCheckToken {
    constructor(value) {
        this.value = value;
        this.type = 'AppCheck';
        this.headers = new Map();
        if (value && value.length > 0) {
            this.headers.set('x-firebase-appcheck', this.value);
        }
    }
}
/** AppCheck token provider for the Lite SDK. */
class LiteAppCheckTokenProvider {
    constructor(app, appCheckProvider) {
        this.appCheckProvider = appCheckProvider;
        this.appCheck = null;
        this.serverAppAppCheckToken = null;
        if (_isFirebaseServerApp(app) && app.settings.appCheckToken) {
            this.serverAppAppCheckToken = app.settings.appCheckToken;
        }
        appCheckProvider.onInit(appCheck => {
            this.appCheck = appCheck;
        });
    }
    getToken() {
        if (this.serverAppAppCheckToken) {
            return Promise.resolve(new AppCheckToken(this.serverAppAppCheckToken));
        }
        if (!this.appCheck) {
            return Promise.resolve(null);
        }
        return this.appCheck.getToken().then(tokenResult => {
            if (tokenResult) {
                hardAssert(typeof tokenResult.token === 'string', 0x0d8e, { tokenResult });
                return new AppCheckToken(tokenResult.token);
            }
            else {
                return null;
            }
        });
    }
    invalidateToken() { }
    start(asyncQueue, changeListener) { }
    shutdown() { }
}
/**
 * Builds a CredentialsProvider depending on the type of
 * the credentials passed in.
 */
function makeAuthCredentialsProvider(credentials) {
    if (!credentials) {
        return new EmptyAuthCredentialsProvider();
    }
    switch (credentials['type']) {
        case 'firstParty':
            return new FirstPartyAuthCredentialsProvider(credentials['sessionIndex'] || '0', credentials['iamToken'] || null, credentials['authTokenFactory'] || null);
        case 'provider':
            return credentials['client'];
        default:
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'makeAuthCredentialsProvider failed due to invalid credential type');
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
class DatabaseInfo {
    /**
     * Constructs a DatabaseInfo using the provided host, databaseId and
     * persistenceKey.
     *
     * @param databaseId - The database to use.
     * @param appId - The Firebase App Id.
     * @param persistenceKey - A unique identifier for this Firestore's local
     * storage (used in conjunction with the databaseId).
     * @param host - The Firestore backend host to connect to.
     * @param ssl - Whether to use SSL when connecting.
     * @param forceLongPolling - Whether to use the forceLongPolling option
     * when using WebChannel as the network transport.
     * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
     * option when using WebChannel as the network transport.
     * @param longPollingOptions - Options that configure long-polling.
     * @param useFetchStreams - Whether to use the Fetch API instead of
     * XMLHTTPRequest
     */
    constructor(databaseId, appId, persistenceKey, host, ssl, forceLongPolling, autoDetectLongPolling, longPollingOptions, useFetchStreams, isUsingEmulator, apiKey) {
        this.databaseId = databaseId;
        this.appId = appId;
        this.persistenceKey = persistenceKey;
        this.host = host;
        this.ssl = ssl;
        this.forceLongPolling = forceLongPolling;
        this.autoDetectLongPolling = autoDetectLongPolling;
        this.longPollingOptions = longPollingOptions;
        this.useFetchStreams = useFetchStreams;
        this.isUsingEmulator = isUsingEmulator;
        this.apiKey = apiKey;
    }
}
/** The default database name for a project. */
const DEFAULT_DATABASE_NAME = '(default)';
/**
 * Represents the database ID a Firestore client is associated with.
 * @internal
 */
class DatabaseId {
    constructor(projectId, database) {
        this.projectId = projectId;
        this.database = database ? database : DEFAULT_DATABASE_NAME;
    }
    static empty() {
        return new DatabaseId('', '');
    }
    get isDefaultDatabase() {
        return this.database === DEFAULT_DATABASE_NAME;
    }
    isEqual(other) {
        return (other instanceof DatabaseId &&
            other.projectId === this.projectId &&
            other.database === this.database);
    }
}
function databaseIdFromApp(app, database) {
    if (!Object.prototype.hasOwnProperty.apply(app.options, ['projectId'])) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
    }
    return new DatabaseId(app.options.projectId, database);
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
 * Generates `nBytes` of random bytes.
 *
 * If `nBytes < 0` , an error will be thrown.
 */
function randomBytes(nBytes) {
    return randomBytes$1(nBytes);
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * A utility class for generating unique alphanumeric IDs of a specified length.
 *
 * @internal
 * Exported internally for testing purposes.
 */
class AutoId {
    static newId() {
        // Alphanumeric characters
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        // The largest byte value that is a multiple of `char.length`.
        const maxMultiple = Math.floor(256 / chars.length) * chars.length;
        let autoId = '';
        const targetLength = 20;
        while (autoId.length < targetLength) {
            const bytes = randomBytes(40);
            for (let i = 0; i < bytes.length; ++i) {
                // Only accept values that are [0, maxMultiple), this ensures they can
                // be evenly mapped to indices of `chars` via a modulo operation.
                if (autoId.length < targetLength && bytes[i] < maxMultiple) {
                    autoId += chars.charAt(bytes[i] % chars.length);
                }
            }
        }
        return autoId;
    }
}
function primitiveComparator(left, right) {
    if (left < right) {
        return -1;
    }
    if (left > right) {
        return 1;
    }
    return 0;
}
/** Compare strings in UTF-8 encoded byte order */
function compareUtf8Strings(left, right) {
    // Find the first differing character (a.k.a. "UTF-16 code unit") in the two strings and,
    // if found, use that character to determine the relative ordering of the two strings as a
    // whole. Comparing UTF-16 strings in UTF-8 byte order can be done simply and efficiently by
    // comparing the UTF-16 code units (chars). This serendipitously works because of the way UTF-8
    // and UTF-16 happen to represent Unicode code points.
    //
    // After finding the first pair of differing characters, there are two cases:
    //
    // Case 1: Both characters are non-surrogates (code points less than or equal to 0xFFFF) or
    // both are surrogates from a surrogate pair (that collectively represent code points greater
    // than 0xFFFF). In this case their numeric order as UTF-16 code units is the same as the
    // lexicographical order of their corresponding UTF-8 byte sequences. A direct comparison is
    // sufficient.
    //
    // Case 2: One character is a surrogate and the other is not. In this case the surrogate-
    // containing string is always ordered after the non-surrogate. This is because surrogates are
    // used to represent code points greater than 0xFFFF which have 4-byte UTF-8 representations
    // and are lexicographically greater than the 1, 2, or 3-byte representations of code points
    // less than or equal to 0xFFFF.
    //
    // An example of why Case 2 is required is comparing the following two Unicode code points:
    //
    // |-----------------------|------------|---------------------|-----------------|
    // | Name                  | Code Point | UTF-8 Encoding      | UTF-16 Encoding |
    // |-----------------------|------------|---------------------|-----------------|
    // | Replacement Character | U+FFFD     | 0xEF 0xBF 0xBD      | 0xFFFD          |
    // | Grinning Face         | U+1F600    | 0xF0 0x9F 0x98 0x80 | 0xD83D 0xDE00   |
    // |-----------------------|------------|---------------------|-----------------|
    //
    // A lexicographical comparison of the UTF-8 encodings of these code points would order
    // "Replacement Character" _before_ "Grinning Face" because 0xEF is less than 0xF0. However, a
    // direct comparison of the UTF-16 code units, as would be done in case 1, would erroneously
    // produce the _opposite_ ordering, because 0xFFFD is _greater than_ 0xD83D. As it turns out,
    // this relative ordering holds for all comparisons of UTF-16 code points requiring a surrogate
    // pair with those that do not.
    const length = Math.min(left.length, right.length);
    for (let i = 0; i < length; i++) {
        const leftChar = left.charAt(i);
        const rightChar = right.charAt(i);
        if (leftChar !== rightChar) {
            return isSurrogate(leftChar) === isSurrogate(rightChar)
                ? primitiveComparator(leftChar, rightChar)
                : isSurrogate(leftChar)
                    ? 1
                    : -1;
        }
    }
    // Use the lengths of the strings to determine the overall comparison result since either the
    // strings were equal or one is a prefix of the other.
    return primitiveComparator(left.length, right.length);
}
const MIN_SURROGATE = 0xd800;
const MAX_SURROGATE = 0xdfff;
function isSurrogate(s) {
    const c = s.charCodeAt(0);
    return c >= MIN_SURROGATE && c <= MAX_SURROGATE;
}
/** Helper to compare arrays using isEqual(). */
function arrayEquals(left, right, comparator) {
    if (left.length !== right.length) {
        return false;
    }
    return left.every((value, index) => comparator(value, right[index]));
}

/**
 * @license
 * Copyright 2017 Google LLC
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
const DOCUMENT_KEY_NAME = '__name__';
/**
 * Path represents an ordered sequence of string segments.
 */
class BasePath {
    constructor(segments, offset, length) {
        if (offset === undefined) {
            offset = 0;
        }
        else if (offset > segments.length) {
            fail(0x027d, {
                offset,
                range: segments.length
            });
        }
        if (length === undefined) {
            length = segments.length - offset;
        }
        else if (length > segments.length - offset) {
            fail(0x06d2, {
                length,
                range: segments.length - offset
            });
        }
        this.segments = segments;
        this.offset = offset;
        this.len = length;
    }
    get length() {
        return this.len;
    }
    isEqual(other) {
        return BasePath.comparator(this, other) === 0;
    }
    child(nameOrPath) {
        const segments = this.segments.slice(this.offset, this.limit());
        if (nameOrPath instanceof BasePath) {
            nameOrPath.forEach(segment => {
                segments.push(segment);
            });
        }
        else {
            segments.push(nameOrPath);
        }
        return this.construct(segments);
    }
    /** The index of one past the last segment of the path. */
    limit() {
        return this.offset + this.length;
    }
    popFirst(size) {
        size = size === undefined ? 1 : size;
        return this.construct(this.segments, this.offset + size, this.length - size);
    }
    popLast() {
        return this.construct(this.segments, this.offset, this.length - 1);
    }
    firstSegment() {
        return this.segments[this.offset];
    }
    lastSegment() {
        return this.get(this.length - 1);
    }
    get(index) {
        return this.segments[this.offset + index];
    }
    isEmpty() {
        return this.length === 0;
    }
    isPrefixOf(other) {
        if (other.length < this.length) {
            return false;
        }
        for (let i = 0; i < this.length; i++) {
            if (this.get(i) !== other.get(i)) {
                return false;
            }
        }
        return true;
    }
    isImmediateParentOf(potentialChild) {
        if (this.length + 1 !== potentialChild.length) {
            return false;
        }
        for (let i = 0; i < this.length; i++) {
            if (this.get(i) !== potentialChild.get(i)) {
                return false;
            }
        }
        return true;
    }
    forEach(fn) {
        for (let i = this.offset, end = this.limit(); i < end; i++) {
            fn(this.segments[i]);
        }
    }
    toArray() {
        return this.segments.slice(this.offset, this.limit());
    }
    /**
     * Compare 2 paths segment by segment, prioritizing numeric IDs
     * (e.g., "__id123__") in numeric ascending order, followed by string
     * segments in lexicographical order.
     */
    static comparator(p1, p2) {
        const len = Math.min(p1.length, p2.length);
        for (let i = 0; i < len; i++) {
            const comparison = BasePath.compareSegments(p1.get(i), p2.get(i));
            if (comparison !== 0) {
                return comparison;
            }
        }
        return primitiveComparator(p1.length, p2.length);
    }
    static compareSegments(lhs, rhs) {
        const isLhsNumeric = BasePath.isNumericId(lhs);
        const isRhsNumeric = BasePath.isNumericId(rhs);
        if (isLhsNumeric && !isRhsNumeric) {
            // Only lhs is numeric
            return -1;
        }
        else if (!isLhsNumeric && isRhsNumeric) {
            // Only rhs is numeric
            return 1;
        }
        else if (isLhsNumeric && isRhsNumeric) {
            // both numeric
            return BasePath.extractNumericId(lhs).compare(BasePath.extractNumericId(rhs));
        }
        else {
            // both non-numeric
            return compareUtf8Strings(lhs, rhs);
        }
    }
    // Checks if a segment is a numeric ID (starts with "__id" and ends with "__").
    static isNumericId(segment) {
        return segment.startsWith('__id') && segment.endsWith('__');
    }
    static extractNumericId(segment) {
        return Integer.fromString(segment.substring(4, segment.length - 2));
    }
}
/**
 * A slash-separated path for navigating resources (documents and collections)
 * within Firestore.
 *
 * @internal
 */
class ResourcePath extends BasePath {
    construct(segments, offset, length) {
        return new ResourcePath(segments, offset, length);
    }
    canonicalString() {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        return this.toArray().join('/');
    }
    toString() {
        return this.canonicalString();
    }
    /**
     * Returns a string representation of this path
     * where each path segment has been encoded with
     * `encodeURIComponent`.
     */
    toUriEncodedString() {
        return this.toArray().map(encodeURIComponent).join('/');
    }
    /**
     * Creates a resource path from the given slash-delimited string. If multiple
     * arguments are provided, all components are combined. Leading and trailing
     * slashes from all components are ignored.
     */
    static fromString(...pathComponents) {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        const segments = [];
        for (const path of pathComponents) {
            if (path.indexOf('//') >= 0) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid segment (${path}). Paths must not contain // in them.`);
            }
            // Strip leading and trailing slashed.
            segments.push(...path.split('/').filter(segment => segment.length > 0));
        }
        return new ResourcePath(segments);
    }
    static emptyPath() {
        return new ResourcePath([]);
    }
}
const identifierRegExp = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
/**
 * A dot-separated path for navigating sub-objects within a document.
 * @internal
 */
class FieldPath$1 extends BasePath {
    construct(segments, offset, length) {
        return new FieldPath$1(segments, offset, length);
    }
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */
    static isValidIdentifier(segment) {
        return identifierRegExp.test(segment);
    }
    canonicalString() {
        return this.toArray()
            .map(str => {
            str = str.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
            if (!FieldPath$1.isValidIdentifier(str)) {
                str = '`' + str + '`';
            }
            return str;
        })
            .join('.');
    }
    toString() {
        return this.canonicalString();
    }
    /**
     * Returns true if this field references the key of a document.
     */
    isKeyField() {
        return this.length === 1 && this.get(0) === DOCUMENT_KEY_NAME;
    }
    /**
     * The field designating the key of a document.
     */
    static keyField() {
        return new FieldPath$1([DOCUMENT_KEY_NAME]);
    }
    /**
     * Parses a field string from the given server-formatted string.
     *
     * - Splitting the empty string is not allowed (for now at least).
     * - Empty segments within the string (e.g. if there are two consecutive
     *   separators) are not allowed.
     *
     * TODO(b/37244157): we should make this more strict. Right now, it allows
     * non-identifier path components, even if they aren't escaped.
     */
    static fromServerFormat(path) {
        const segments = [];
        let current = '';
        let i = 0;
        const addCurrentSegment = () => {
            if (current.length === 0) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid field path (${path}). Paths must not be empty, begin ` +
                    `with '.', end with '.', or contain '..'`);
            }
            segments.push(current);
            current = '';
        };
        let inBackticks = false;
        while (i < path.length) {
            const c = path[i];
            if (c === '\\') {
                if (i + 1 === path.length) {
                    throw new FirestoreError(Code.INVALID_ARGUMENT, 'Path has trailing escape character: ' + path);
                }
                const next = path[i + 1];
                if (!(next === '\\' || next === '.' || next === '`')) {
                    throw new FirestoreError(Code.INVALID_ARGUMENT, 'Path has invalid escape sequence: ' + path);
                }
                current += next;
                i += 2;
            }
            else if (c === '`') {
                inBackticks = !inBackticks;
                i++;
            }
            else if (c === '.' && !inBackticks) {
                addCurrentSegment();
                i++;
            }
            else {
                current += c;
                i++;
            }
        }
        addCurrentSegment();
        if (inBackticks) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Unterminated ` in path: ' + path);
        }
        return new FieldPath$1(segments);
    }
    static emptyPath() {
        return new FieldPath$1([]);
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 */
class DocumentKey {
    constructor(path) {
        this.path = path;
    }
    static fromPath(path) {
        return new DocumentKey(ResourcePath.fromString(path));
    }
    static fromName(name) {
        return new DocumentKey(ResourcePath.fromString(name).popFirst(5));
    }
    static empty() {
        return new DocumentKey(ResourcePath.emptyPath());
    }
    get collectionGroup() {
        return this.path.popLast().lastSegment();
    }
    /** Returns true if the document is in the specified collectionId. */
    hasCollectionId(collectionId) {
        return (this.path.length >= 2 &&
            this.path.get(this.path.length - 2) === collectionId);
    }
    /** Returns the collection group (i.e. the name of the parent collection) for this key. */
    getCollectionGroup() {
        return this.path.get(this.path.length - 2);
    }
    /** Returns the fully qualified path to the parent collection. */
    getCollectionPath() {
        return this.path.popLast();
    }
    isEqual(other) {
        return (other !== null && ResourcePath.comparator(this.path, other.path) === 0);
    }
    toString() {
        return this.path.toString();
    }
    static comparator(k1, k2) {
        return ResourcePath.comparator(k1.path, k2.path);
    }
    static isDocumentKey(path) {
        return path.length % 2 === 0;
    }
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */
    static fromSegments(segments) {
        return new DocumentKey(new ResourcePath(segments.slice()));
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
function validateNonEmptyArgument(functionName, argumentName, argument) {
    if (!argument) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `Function ${functionName}() cannot be called with an empty ${argumentName}.`);
    }
}
/**
 * Validates that two boolean options are not set at the same time.
 * @internal
 */
function validateIsNotUsedTogether(optionName1, argument1, optionName2, argument2) {
    if (argument1 === true && argument2 === true) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `${optionName1} and ${optionName2} cannot be used together.`);
    }
}
/**
 * Validates that `path` refers to a document (indicated by the fact it contains
 * an even numbers of segments).
 */
function validateDocumentPath(path) {
    if (!DocumentKey.isDocumentKey(path)) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${path} has ${path.length}.`);
    }
}
/**
 * Validates that `path` refers to a collection (indicated by the fact it
 * contains an odd numbers of segments).
 */
function validateCollectionPath(path) {
    if (DocumentKey.isDocumentKey(path)) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${path} has ${path.length}.`);
    }
}
/**
 * Returns true if it's a non-null object without a custom prototype
 * (i.e. excludes Array, Date, etc.).
 */
function isPlainObject(input) {
    return (typeof input === 'object' &&
        input !== null &&
        (Object.getPrototypeOf(input) === Object.prototype ||
            Object.getPrototypeOf(input) === null));
}
/** Returns a string describing the type / value of the provided input. */
function valueDescription(input) {
    if (input === undefined) {
        return 'undefined';
    }
    else if (input === null) {
        return 'null';
    }
    else if (typeof input === 'string') {
        if (input.length > 20) {
            input = `${input.substring(0, 20)}...`;
        }
        return JSON.stringify(input);
    }
    else if (typeof input === 'number' || typeof input === 'boolean') {
        return '' + input;
    }
    else if (typeof input === 'object') {
        if (input instanceof Array) {
            return 'an array';
        }
        else {
            const customObjectName = tryGetCustomObjectType(input);
            if (customObjectName) {
                return `a custom ${customObjectName} object`;
            }
            else {
                return 'an object';
            }
        }
    }
    else if (typeof input === 'function') {
        return 'a function';
    }
    else {
        return fail(0x3029, { type: typeof input });
    }
}
/** try to get the constructor name for an object. */
function tryGetCustomObjectType(input) {
    if (input.constructor) {
        return input.constructor.name;
    }
    return null;
}
/**
 * Casts `obj` to `T`, optionally unwrapping Compat types to expose the
 * underlying instance. Throws if  `obj` is not an instance of `T`.
 *
 * This cast is used in the Lite and Full SDK to verify instance types for
 * arguments passed to the public API.
 * @internal
 */
function cast(obj, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
constructor) {
    if ('_delegate' in obj) {
        // Unwrap Compat types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        obj = obj._delegate;
    }
    if (!(obj instanceof constructor)) {
        if (constructor.name === obj.constructor.name) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Type does not match the expected instance. Did you pass a ' +
                `reference from a different Firestore SDK?`);
        }
        else {
            const description = valueDescription(obj);
            throw new FirestoreError(Code.INVALID_ARGUMENT, `Expected type '${constructor.name}', but it was: ${description}`);
        }
    }
    return obj;
}
function validatePositiveNumber(functionName, n) {
    if (n <= 0) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `Function ${functionName}() requires a positive number, but it was: ${n}.`);
    }
}

/**
 * @license
 * Copyright 2023 Google LLC
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
 * Compares two `ExperimentalLongPollingOptions` objects for equality.
 */
function longPollingOptionsEqual(options1, options2) {
    return options1.timeoutSeconds === options2.timeoutSeconds;
}
/**
 * Creates and returns a new `ExperimentalLongPollingOptions` with the same
 * option values as the given instance.
 */
function cloneLongPollingOptions(options) {
    const clone = {};
    if (options.timeoutSeconds !== undefined) {
        clone.timeoutSeconds = options.timeoutSeconds;
    }
    return clone;
}

/**
 * @license
 * Copyright 2023 Google LLC
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
 * The value returned from the most recent invocation of
 * `generateUniqueDebugId()`, or null if it has never been invoked.
 */
let lastUniqueDebugId = null;
/**
 * Generates and returns an initial value for `lastUniqueDebugId`.
 *
 * The returned value is randomly selected from a range of integers that are
 * represented as 8 hexadecimal digits. This means that (within reason) any
 * numbers generated by incrementing the returned number by 1 will also be
 * represented by 8 hexadecimal digits. This leads to all "IDs" having the same
 * length when converted to a hexadecimal string, making reading logs containing
 * these IDs easier to follow. And since the return value is randomly selected
 * it will help to differentiate between logs from different executions.
 */
function generateInitialUniqueDebugId() {
    const minResult = 0x10000000;
    const maxResult = 0x90000000;
    const resultRange = maxResult - minResult;
    const resultOffset = Math.round(resultRange * Math.random());
    return minResult + resultOffset;
}
/**
 * Generates and returns a unique ID as a hexadecimal string.
 *
 * The returned ID is intended to be used in debug logging messages to help
 * correlate log messages that may be spatially separated in the logs, but
 * logically related. For example, a network connection could include the same
 * "debug ID" string in all of its log messages to help trace a specific
 * connection over time.
 *
 * @returns the 10-character generated ID (e.g. "0xa1b2c3d4").
 */
function generateUniqueDebugId() {
    if (lastUniqueDebugId === null) {
        lastUniqueDebugId = generateInitialUniqueDebugId();
    }
    else {
        lastUniqueDebugId++;
    }
    return '0x' + lastUniqueDebugId.toString(16);
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
const LOG_TAG$1 = 'RestConnection';
/**
 * Maps RPC names to the corresponding REST endpoint name.
 *
 * We use array notation to avoid mangling.
 */
const RPC_NAME_URL_MAPPING = {};
RPC_NAME_URL_MAPPING['BatchGetDocuments'] = 'batchGet';
RPC_NAME_URL_MAPPING['Commit'] = 'commit';
RPC_NAME_URL_MAPPING['RunQuery'] = 'runQuery';
RPC_NAME_URL_MAPPING['RunAggregationQuery'] = 'runAggregationQuery';
RPC_NAME_URL_MAPPING['ExecutePipeline'] = 'executePipeline';
const RPC_URL_VERSION = 'v1';
// SDK_VERSION is updated to different value at runtime depending on the entry point,
// so we need to get its value when we need it in a function.
function getGoogApiClientValue() {
    return 'gl-js/ fire/' + SDK_VERSION;
}
/**
 * Base class for all Rest-based connections to the backend (WebChannel and
 * HTTP).
 */
class RestConnection {
    get shouldResourcePathBeIncludedInRequest() {
        // Both `invokeRPC()` and `invokeStreamingRPC()` use their `path` arguments to determine
        // where to run the query, and expect the `request` to NOT specify the "path".
        return false;
    }
    constructor(databaseInfo) {
        this.databaseInfo = databaseInfo;
        this.databaseId = databaseInfo.databaseId;
        const proto = databaseInfo.ssl ? 'https' : 'http';
        const projectId = encodeURIComponent(this.databaseId.projectId);
        const databaseId = encodeURIComponent(this.databaseId.database);
        this.baseUrl = proto + '://' + databaseInfo.host;
        this.databasePath = `projects/${projectId}/databases/${databaseId}`;
        this.requestParams =
            this.databaseId.database === DEFAULT_DATABASE_NAME
                ? `project_id=${projectId}`
                : `project_id=${projectId}&database_id=${databaseId}`;
    }
    invokeRPC(rpcName, path, req, authToken, appCheckToken) {
        const streamId = generateUniqueDebugId();
        const url = this.makeUrl(rpcName, path.toUriEncodedString());
        logDebug(LOG_TAG$1, `Sending RPC '${rpcName}' ${streamId}:`, url, req);
        const headers = {
            'google-cloud-resource-prefix': this.databasePath,
            'x-goog-request-params': this.requestParams
        };
        this.modifyHeadersForRequest(headers, authToken, appCheckToken);
        const { host } = new URL(url);
        const forwardCredentials = isCloudWorkstation(host);
        return this.performRPCRequest(rpcName, url, headers, req, forwardCredentials).then(response => {
            logDebug(LOG_TAG$1, `Received RPC '${rpcName}' ${streamId}: `, response);
            return response;
        }, (err) => {
            logWarn(LOG_TAG$1, `RPC '${rpcName}' ${streamId} failed with error: `, err, 'url: ', url, 'request:', req);
            throw err;
        });
    }
    invokeStreamingRPC(rpcName, path, request, authToken, appCheckToken, expectedResponseCount) {
        // The REST API automatically aggregates all of the streamed results, so we
        // can just use the normal invoke() method.
        return this.invokeRPC(rpcName, path, request, authToken, appCheckToken);
    }
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */
    modifyHeadersForRequest(headers, authToken, appCheckToken) {
        headers['X-Goog-Api-Client'] = getGoogApiClientValue();
        // Content-Type: text/plain will avoid preflight requests which might
        // mess with CORS and redirects by proxies. If we add custom headers
        // we will need to change this code to potentially use the $httpOverwrite
        // parameter supported by ESF to avoid triggering preflight requests.
        headers['Content-Type'] = 'text/plain';
        if (this.databaseInfo.appId) {
            headers['X-Firebase-GMPID'] = this.databaseInfo.appId;
        }
        if (authToken) {
            authToken.headers.forEach((value, key) => (headers[key] = value));
        }
        if (appCheckToken) {
            appCheckToken.headers.forEach((value, key) => (headers[key] = value));
        }
    }
    makeUrl(rpcName, path) {
        const urlRpcName = RPC_NAME_URL_MAPPING[rpcName];
        let url = `${this.baseUrl}/${RPC_URL_VERSION}/${path}:${urlRpcName}`;
        if (this.databaseInfo.apiKey) {
            url = `${url}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`;
        }
        return url;
    }
    /**
     * Closes and cleans up any resources associated with the connection. This
     * implementation is a no-op because there are no resources associated
     * with the RestConnection that need to be cleaned up.
     */
    terminate() {
        // No-op
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Error Codes describing the different ways GRPC can fail. These are copied
 * directly from GRPC's sources here:
 *
 * https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
 *
 * Important! The names of these identifiers matter because the string forms
 * are used for reverse lookups from the webchannel stream. Do NOT change the
 * names of these identifiers or change this into a const enum.
 */
var RpcCode;
(function (RpcCode) {
    RpcCode[RpcCode["OK"] = 0] = "OK";
    RpcCode[RpcCode["CANCELLED"] = 1] = "CANCELLED";
    RpcCode[RpcCode["UNKNOWN"] = 2] = "UNKNOWN";
    RpcCode[RpcCode["INVALID_ARGUMENT"] = 3] = "INVALID_ARGUMENT";
    RpcCode[RpcCode["DEADLINE_EXCEEDED"] = 4] = "DEADLINE_EXCEEDED";
    RpcCode[RpcCode["NOT_FOUND"] = 5] = "NOT_FOUND";
    RpcCode[RpcCode["ALREADY_EXISTS"] = 6] = "ALREADY_EXISTS";
    RpcCode[RpcCode["PERMISSION_DENIED"] = 7] = "PERMISSION_DENIED";
    RpcCode[RpcCode["UNAUTHENTICATED"] = 16] = "UNAUTHENTICATED";
    RpcCode[RpcCode["RESOURCE_EXHAUSTED"] = 8] = "RESOURCE_EXHAUSTED";
    RpcCode[RpcCode["FAILED_PRECONDITION"] = 9] = "FAILED_PRECONDITION";
    RpcCode[RpcCode["ABORTED"] = 10] = "ABORTED";
    RpcCode[RpcCode["OUT_OF_RANGE"] = 11] = "OUT_OF_RANGE";
    RpcCode[RpcCode["UNIMPLEMENTED"] = 12] = "UNIMPLEMENTED";
    RpcCode[RpcCode["INTERNAL"] = 13] = "INTERNAL";
    RpcCode[RpcCode["UNAVAILABLE"] = 14] = "UNAVAILABLE";
    RpcCode[RpcCode["DATA_LOSS"] = 15] = "DATA_LOSS";
})(RpcCode || (RpcCode = {}));
/**
 * Determines whether an error code represents a permanent error when received
 * in response to a non-write operation.
 *
 * See isPermanentWriteError for classifying write errors.
 */
function isPermanentError(code) {
    switch (code) {
        case Code.OK:
            return fail(0xfdaa);
        case Code.CANCELLED:
        case Code.UNKNOWN:
        case Code.DEADLINE_EXCEEDED:
        case Code.RESOURCE_EXHAUSTED:
        case Code.INTERNAL:
        case Code.UNAVAILABLE:
        // Unauthenticated means something went wrong with our token and we need
        // to retry with new credentials which will happen automatically.
        case Code.UNAUTHENTICATED:
            return false;
        case Code.INVALID_ARGUMENT:
        case Code.NOT_FOUND:
        case Code.ALREADY_EXISTS:
        case Code.PERMISSION_DENIED:
        case Code.FAILED_PRECONDITION:
        // Aborted might be retried in some scenarios, but that is dependent on
        // the context and should handled individually by the calling code.
        // See https://cloud.google.com/apis/design/errors.
        case Code.ABORTED:
        case Code.OUT_OF_RANGE:
        case Code.UNIMPLEMENTED:
        case Code.DATA_LOSS:
            return true;
        default:
            return fail(0x3c6b, { code });
    }
}
/**
 * Converts an HTTP Status Code to the equivalent error code.
 *
 * @param status - An HTTP Status Code, like 200, 404, 503, etc.
 * @returns The equivalent Code. Unknown status codes are mapped to
 *     Code.UNKNOWN.
 */
function mapCodeFromHttpStatus(status) {
    if (status === undefined) {
        logError('RPC_ERROR', 'HTTP error has no status');
        return Code.UNKNOWN;
    }
    // The canonical error codes for Google APIs [1] specify mapping onto HTTP
    // status codes but the mapping is not bijective. In each case of ambiguity
    // this function chooses a primary error.
    //
    // [1]
    // https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    switch (status) {
        case 200: // OK
            return Code.OK;
        case 400: // Bad Request
            return Code.FAILED_PRECONDITION;
        // Other possibilities based on the forward mapping
        // return Code.INVALID_ARGUMENT;
        // return Code.OUT_OF_RANGE;
        case 401: // Unauthorized
            return Code.UNAUTHENTICATED;
        case 403: // Forbidden
            return Code.PERMISSION_DENIED;
        case 404: // Not Found
            return Code.NOT_FOUND;
        case 409: // Conflict
            return Code.ABORTED;
        // Other possibilities:
        // return Code.ALREADY_EXISTS;
        case 416: // Range Not Satisfiable
            return Code.OUT_OF_RANGE;
        case 429: // Too Many Requests
            return Code.RESOURCE_EXHAUSTED;
        case 499: // Client Closed Request
            return Code.CANCELLED;
        case 500: // Internal Server Error
            return Code.UNKNOWN;
        // Other possibilities:
        // return Code.INTERNAL;
        // return Code.DATA_LOSS;
        case 501: // Unimplemented
            return Code.UNIMPLEMENTED;
        case 503: // Service Unavailable
            return Code.UNAVAILABLE;
        case 504: // Gateway Timeout
            return Code.DEADLINE_EXCEEDED;
        default:
            if (status >= 200 && status < 300) {
                return Code.OK;
            }
            if (status >= 400 && status < 500) {
                return Code.FAILED_PRECONDITION;
            }
            if (status >= 500 && status < 600) {
                return Code.INTERNAL;
            }
            return Code.UNKNOWN;
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
 * A Rest-based connection that relies on the native HTTP stack
 * (e.g. `fetch` or a polyfill).
 */
class FetchConnection extends RestConnection {
    openStream(rpcName, token) {
        throw new Error('Not supported by FetchConnection');
    }
    async performRPCRequest(rpcName, url, headers, body, forwardCredentials) {
        const requestJson = JSON.stringify(body);
        let response;
        try {
            const fetchArgs = {
                method: 'POST',
                headers,
                body: requestJson
            };
            if (forwardCredentials) {
                fetchArgs.credentials = 'include';
            }
            response = await fetch(url, fetchArgs);
        }
        catch (e) {
            const err = e;
            throw new FirestoreError(mapCodeFromHttpStatus(err.status), 'Request failed with error: ' + err.statusText);
        }
        if (!response.ok) {
            let errorResponse = await response.json();
            if (Array.isArray(errorResponse)) {
                errorResponse = errorResponse[0];
            }
            const errorMessage = errorResponse?.error?.message;
            throw new FirestoreError(mapCodeFromHttpStatus(response.status), `Request failed with error: ${errorMessage ?? response.statusText}`);
        }
        return response.json();
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
/** Initializes the HTTP connection for the REST API. */
function newConnection(databaseInfo) {
    return new FetchConnection(databaseInfo);
}

/**
 * @license
 * Copyright 2017 Google LLC
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
function objectSize(obj) {
    let count = 0;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            count++;
        }
    }
    return count;
}
function forEach(obj, fn) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn(key, obj[key]);
        }
    }
}
function mapToArray(obj, fn) {
    const result = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result.push(fn(obj[key], key, obj));
        }
    }
    return result;
}
function isEmpty(obj) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Returns whether a variable is either undefined or null.
 */
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
/** Returns whether the value represents -0. */
function isNegativeZero(value) {
    // Detect if the value is -0.0. Based on polyfill from
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    return value === 0 && 1 / value === 1 / -0;
}
function isNumber(value) {
    return typeof value === 'number';
}
/**
 * Returns whether a value is an integer and in the safe integer range
 * @param value - The value to test for being an integer and in the safe range
 */
function isSafeInteger(value) {
    return (typeof value === 'number' &&
        Number.isInteger(value) &&
        !isNegativeZero(value) &&
        value <= Number.MAX_SAFE_INTEGER &&
        value >= Number.MIN_SAFE_INTEGER);
}
function isString(value) {
    return typeof value === 'string';
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
/** Converts a Base64 encoded string to a binary string. */
function decodeBase64(encoded) {
    // Note: We used to validate the base64 string here via a regular expression.
    // This was removed to improve the performance of indexing.
    return Buffer.from(encoded, 'base64').toString('binary');
}
/** Converts a binary string to a Base64 encoded string. */
function encodeBase64(raw) {
    return Buffer.from(raw, 'binary').toString('base64');
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
 * Immutable class that represents a "proto" byte string.
 *
 * Proto byte strings can either be Base64-encoded strings or Uint8Arrays when
 * sent on the wire. This class abstracts away this differentiation by holding
 * the proto byte string in a common class that must be converted into a string
 * before being sent as a proto.
 * @internal
 */
class ByteString {
    constructor(binaryString) {
        this.binaryString = binaryString;
    }
    static fromBase64String(base64) {
        const binaryString = decodeBase64(base64);
        return new ByteString(binaryString);
    }
    static fromUint8Array(array) {
        // TODO(indexing); Remove the copy of the byte string here as this method
        // is frequently called during indexing.
        const binaryString = binaryStringFromUint8Array(array);
        return new ByteString(binaryString);
    }
    [Symbol.iterator]() {
        let i = 0;
        return {
            next: () => {
                if (i < this.binaryString.length) {
                    return { value: this.binaryString.charCodeAt(i++), done: false };
                }
                else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
    toBase64() {
        return encodeBase64(this.binaryString);
    }
    toUint8Array() {
        return uint8ArrayFromBinaryString(this.binaryString);
    }
    approximateByteSize() {
        return this.binaryString.length * 2;
    }
    compareTo(other) {
        return primitiveComparator(this.binaryString, other.binaryString);
    }
    isEqual(other) {
        return this.binaryString === other.binaryString;
    }
}
ByteString.EMPTY_BYTE_STRING = new ByteString('');
/**
 * Helper function to convert an Uint8array to a binary string.
 */
function binaryStringFromUint8Array(array) {
    let binaryString = '';
    for (let i = 0; i < array.length; ++i) {
        binaryString += String.fromCharCode(array[i]);
    }
    return binaryString;
}
/**
 * Helper function to convert a binary string to an Uint8Array.
 */
function uint8ArrayFromBinaryString(binaryString) {
    const buffer = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        buffer[i] = binaryString.charCodeAt(i);
    }
    return buffer;
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
// A RegExp matching ISO 8601 UTC timestamps with optional fraction.
const ISO_TIMESTAMP_REG_EXP = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
/**
 * Converts the possible Proto values for a timestamp value into a "seconds and
 * nanos" representation.
 */
function normalizeTimestamp(date) {
    hardAssert(!!date, 0x986a);
    // The json interface (for the browser) will return an iso timestamp string,
    // while the proto js library (for node) will return a
    // google.protobuf.Timestamp instance.
    if (typeof date === 'string') {
        // The date string can have higher precision (nanos) than the Date class
        // (millis), so we do some custom parsing here.
        // Parse the nanos right out of the string.
        let nanos = 0;
        const fraction = ISO_TIMESTAMP_REG_EXP.exec(date);
        hardAssert(!!fraction, 0xb5de, {
            timestamp: date
        });
        if (fraction[1]) {
            // Pad the fraction out to 9 digits (nanos).
            let nanoStr = fraction[1];
            nanoStr = (nanoStr + '000000000').substr(0, 9);
            nanos = Number(nanoStr);
        }
        // Parse the date to get the seconds.
        const parsedDate = new Date(date);
        const seconds = Math.floor(parsedDate.getTime() / 1000);
        return { seconds, nanos };
    }
    else {
        // TODO(b/37282237): Use strings for Proto3 timestamps
        // assert(!this.options.useProto3Json,
        //   'The timestamp instance format requires Proto JS.');
        const seconds = normalizeNumber(date.seconds);
        const nanos = normalizeNumber(date.nanos);
        return { seconds, nanos };
    }
}
/**
 * Converts the possible Proto types for numbers into a JavaScript number.
 * Returns 0 if the value is not numeric.
 */
function normalizeNumber(value) {
    // TODO(bjornick): Handle int64 greater than 53 bits.
    if (typeof value === 'number') {
        return value;
    }
    else if (typeof value === 'string') {
        return Number(value);
    }
    else {
        return 0;
    }
}
/** Converts the possible Proto types for Blobs into a ByteString. */
function normalizeByteString(blob) {
    if (typeof blob === 'string') {
        return ByteString.fromBase64String(blob);
    }
    else {
        return ByteString.fromUint8Array(blob);
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
/**
 * Helper function to define a JSON schema {@link Property}.
 * @private
 * @internal
 */
function property(typeString, optionalValue) {
    const result = {
        typeString
    };
    if (optionalValue) {
        result.value = optionalValue;
    }
    return result;
}
/**
 * Validates the JSON object based on the provided schema, and narrows the type to the provided
 * JSON schema.
 * @private
 * @internal
 *
 * @param json - A JSON object to validate.
 * @param scheme - a {@link JsonSchema} that defines the properties to validate.
 * @returns true if the JSON schema exists within the object. Throws a FirestoreError otherwise.
 */
function validateJSON(json, schema) {
    if (!isPlainObject(json)) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, 'JSON must be an object');
    }
    let error = undefined;
    for (const key in schema) {
        if (schema[key]) {
            const typeString = schema[key].typeString;
            const value = 'value' in schema[key] ? { value: schema[key].value } : undefined;
            if (!(key in json)) {
                error = `JSON missing required field: '${key}'`;
                break;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fieldValue = json[key];
            if (typeString && typeof fieldValue !== typeString) {
                error = `JSON field '${key}' must be a ${typeString}.`;
                break;
            }
            else if (value !== undefined && fieldValue !== value.value) {
                error = `Expected '${key}' field to equal '${value.value}'`;
                break;
            }
        }
    }
    if (error) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, error);
    }
    return true;
}

/**
 * @license
 * Copyright 2017 Google LLC
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
// The earliest date supported by Firestore timestamps (0001-01-01T00:00:00Z).
const MIN_SECONDS = -62135596800;
// Number of nanoseconds in a millisecond.
const MS_TO_NANOS = 1e6;
/**
 * A `Timestamp` represents a point in time independent of any time zone or
 * calendar, represented as seconds and fractions of seconds at nanosecond
 * resolution in UTC Epoch time.
 *
 * It is encoded using the Proleptic Gregorian Calendar which extends the
 * Gregorian calendar backwards to year one. It is encoded assuming all minutes
 * are 60 seconds long, i.e. leap seconds are "smeared" so that no leap second
 * table is needed for interpretation. Range is from 0001-01-01T00:00:00Z to
 * 9999-12-31T23:59:59.999999999Z.
 *
 * For examples and further specifications, refer to the
 * {@link https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto | Timestamp definition}.
 */
class Timestamp {
    /**
     * Creates a new timestamp with the current date, with millisecond precision.
     *
     * @returns a new timestamp representing the current date.
     */
    static now() {
        return Timestamp.fromMillis(Date.now());
    }
    /**
     * Creates a new timestamp from the given date.
     *
     * @param date - The date to initialize the `Timestamp` from.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     date.
     */
    static fromDate(date) {
        return Timestamp.fromMillis(date.getTime());
    }
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */
    static fromMillis(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const nanos = Math.floor((milliseconds - seconds * 1000) * MS_TO_NANOS);
        return new Timestamp(seconds, nanos);
    }
    /**
     * Creates a new timestamp.
     *
     * @param seconds - The number of seconds of UTC time since Unix epoch
     *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
     *     9999-12-31T23:59:59Z inclusive.
     * @param nanoseconds - The non-negative fractions of a second at nanosecond
     *     resolution. Negative second values with fractions must still have
     *     non-negative nanoseconds values that count forward in time. Must be
     *     from 0 to 999,999,999 inclusive.
     */
    constructor(
    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    seconds, 
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    nanoseconds) {
        this.seconds = seconds;
        this.nanoseconds = nanoseconds;
        if (nanoseconds < 0) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Timestamp nanoseconds out of range: ' + nanoseconds);
        }
        if (nanoseconds >= 1e9) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Timestamp nanoseconds out of range: ' + nanoseconds);
        }
        if (seconds < MIN_SECONDS) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + seconds);
        }
        // This will break in the year 10,000.
        if (seconds >= 253402300800) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + seconds);
        }
    }
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */
    toDate() {
        return new Date(this.toMillis());
    }
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */
    toMillis() {
        return this.seconds * 1000 + this.nanoseconds / MS_TO_NANOS;
    }
    _compareTo(other) {
        if (this.seconds === other.seconds) {
            return primitiveComparator(this.nanoseconds, other.nanoseconds);
        }
        return primitiveComparator(this.seconds, other.seconds);
    }
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */
    isEqual(other) {
        return (other.seconds === this.seconds && other.nanoseconds === this.nanoseconds);
    }
    /** Returns a textual representation of this `Timestamp`. */
    toString() {
        return ('Timestamp(seconds=' +
            this.seconds +
            ', nanoseconds=' +
            this.nanoseconds +
            ')');
    }
    /**
     * Returns a JSON-serializable representation of this `Timestamp`.
     */
    toJSON() {
        return {
            type: Timestamp._jsonSchemaVersion,
            seconds: this.seconds,
            nanoseconds: this.nanoseconds
        };
    }
    /**
     * Builds a `Timestamp` instance from a JSON object created by {@link Timestamp.toJSON}.
     */
    static fromJSON(json) {
        if (validateJSON(json, Timestamp._jsonSchema)) {
            return new Timestamp(json.seconds, json.nanoseconds);
        }
    }
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */
    valueOf() {
        // This method returns a string of the form <seconds>.<nanoseconds> where
        // <seconds> is translated to have a non-negative value and both <seconds>
        // and <nanoseconds> are left-padded with zeroes to be a consistent length.
        // Strings with this format then have a lexicographical ordering that matches
        // the expected ordering. The <seconds> translation is done to avoid having
        // a leading negative sign (i.e. a leading '-' character) in its string
        // representation, which would affect its lexicographical ordering.
        const adjustedSeconds = this.seconds - MIN_SECONDS;
        // Note: Up to 12 decimal digits are required to represent all valid
        // 'seconds' values.
        const formattedSeconds = String(adjustedSeconds).padStart(12, '0');
        const formattedNanoseconds = String(this.nanoseconds).padStart(9, '0');
        return formattedSeconds + '.' + formattedNanoseconds;
    }
}
Timestamp._jsonSchemaVersion = 'firestore/timestamp/1.0';
Timestamp._jsonSchema = {
    type: property('string', Timestamp._jsonSchemaVersion),
    seconds: property('number'),
    nanoseconds: property('number')
};

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
 * Represents a locally-applied ServerTimestamp.
 *
 * Server Timestamps are backed by MapValues that contain an internal field
 * `__type__` with a value of `server_timestamp`. The previous value and local
 * write time are stored in its `__previous_value__` and `__local_write_time__`
 * fields respectively.
 *
 * Notes:
 * - ServerTimestampValue instances are created as the result of applying a
 *   transform. They can only exist in the local view of a document. Therefore
 *   they do not need to be parsed or serialized.
 * - When evaluated locally (e.g. for snapshot.data()), they by default
 *   evaluate to `null`. This behavior can be configured by passing custom
 *   FieldValueOptions to value().
 * - With respect to other ServerTimestampValues, they sort by their
 *   localWriteTime.
 */
const SERVER_TIMESTAMP_SENTINEL = 'server_timestamp';
const TYPE_KEY$1 = '__type__';
const PREVIOUS_VALUE_KEY = '__previous_value__';
const LOCAL_WRITE_TIME_KEY = '__local_write_time__';
function isServerTimestamp(value) {
    const type = (value?.mapValue?.fields || {})[TYPE_KEY$1]?.stringValue;
    return type === SERVER_TIMESTAMP_SENTINEL;
}
/**
 * Returns the value of the field before this ServerTimestamp was set.
 *
 * Preserving the previous values allows the user to display the last resoled
 * value until the backend responds with the timestamp.
 */
function getPreviousValue(value) {
    const previousValue = value.mapValue.fields[PREVIOUS_VALUE_KEY];
    if (isServerTimestamp(previousValue)) {
        return getPreviousValue(previousValue);
    }
    return previousValue;
}
/**
 * Returns the local time at which this timestamp was first set.
 */
function getLocalWriteTime(value) {
    const localWriteTime = normalizeTimestamp(value.mapValue.fields[LOCAL_WRITE_TIME_KEY].timestampValue);
    return new Timestamp(localWriteTime.seconds, localWriteTime.nanos);
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
const TYPE_KEY = '__type__';
const MAX_VALUE_TYPE = '__max__';
const MAX_VALUE = {
    mapValue: {
        fields: {
            '__type__': { stringValue: MAX_VALUE_TYPE }
        }
    }
};
const VECTOR_VALUE_SENTINEL = '__vector__';
const VECTOR_MAP_VECTORS_KEY = 'value';
/** Extracts the backend's type order for the provided value. */
function typeOrder(value) {
    if ('nullValue' in value) {
        return 0 /* TypeOrder.NullValue */;
    }
    else if ('booleanValue' in value) {
        return 1 /* TypeOrder.BooleanValue */;
    }
    else if ('integerValue' in value || 'doubleValue' in value) {
        return 2 /* TypeOrder.NumberValue */;
    }
    else if ('timestampValue' in value) {
        return 3 /* TypeOrder.TimestampValue */;
    }
    else if ('stringValue' in value) {
        return 5 /* TypeOrder.StringValue */;
    }
    else if ('bytesValue' in value) {
        return 6 /* TypeOrder.BlobValue */;
    }
    else if ('referenceValue' in value) {
        return 7 /* TypeOrder.RefValue */;
    }
    else if ('geoPointValue' in value) {
        return 8 /* TypeOrder.GeoPointValue */;
    }
    else if ('arrayValue' in value) {
        return 9 /* TypeOrder.ArrayValue */;
    }
    else if ('mapValue' in value) {
        if (isServerTimestamp(value)) {
            return 4 /* TypeOrder.ServerTimestampValue */;
        }
        else if (isMaxValue(value)) {
            return 9007199254740991 /* TypeOrder.MaxValue */;
        }
        else if (isVectorValue(value)) {
            return 10 /* TypeOrder.VectorValue */;
        }
        return 11 /* TypeOrder.ObjectValue */;
    }
    else {
        return fail(0x6e87, { value });
    }
}
/** Tests `left` and `right` for equality based on the backend semantics. */
function valueEquals(left, right) {
    if (left === right) {
        return true;
    }
    const leftType = typeOrder(left);
    const rightType = typeOrder(right);
    if (leftType !== rightType) {
        return false;
    }
    switch (leftType) {
        case 0 /* TypeOrder.NullValue */:
            return true;
        case 1 /* TypeOrder.BooleanValue */:
            return left.booleanValue === right.booleanValue;
        case 4 /* TypeOrder.ServerTimestampValue */:
            return getLocalWriteTime(left).isEqual(getLocalWriteTime(right));
        case 3 /* TypeOrder.TimestampValue */:
            return timestampEquals(left, right);
        case 5 /* TypeOrder.StringValue */:
            return left.stringValue === right.stringValue;
        case 6 /* TypeOrder.BlobValue */:
            return blobEquals(left, right);
        case 7 /* TypeOrder.RefValue */:
            return left.referenceValue === right.referenceValue;
        case 8 /* TypeOrder.GeoPointValue */:
            return geoPointEquals(left, right);
        case 2 /* TypeOrder.NumberValue */:
            return numberEquals(left, right);
        case 9 /* TypeOrder.ArrayValue */:
            return arrayEquals(left.arrayValue.values || [], right.arrayValue.values || [], valueEquals);
        case 10 /* TypeOrder.VectorValue */:
        case 11 /* TypeOrder.ObjectValue */:
            return objectEquals(left, right);
        case 9007199254740991 /* TypeOrder.MaxValue */:
            return true;
        default:
            return fail(0xcbf8, { left });
    }
}
function timestampEquals(left, right) {
    if (typeof left.timestampValue === 'string' &&
        typeof right.timestampValue === 'string' &&
        left.timestampValue.length === right.timestampValue.length) {
        // Use string equality for ISO 8601 timestamps
        return left.timestampValue === right.timestampValue;
    }
    const leftTimestamp = normalizeTimestamp(left.timestampValue);
    const rightTimestamp = normalizeTimestamp(right.timestampValue);
    return (leftTimestamp.seconds === rightTimestamp.seconds &&
        leftTimestamp.nanos === rightTimestamp.nanos);
}
function geoPointEquals(left, right) {
    return (normalizeNumber(left.geoPointValue.latitude) ===
        normalizeNumber(right.geoPointValue.latitude) &&
        normalizeNumber(left.geoPointValue.longitude) ===
            normalizeNumber(right.geoPointValue.longitude));
}
function blobEquals(left, right) {
    return normalizeByteString(left.bytesValue).isEqual(normalizeByteString(right.bytesValue));
}
function numberEquals(left, right) {
    if ('integerValue' in left && 'integerValue' in right) {
        return (normalizeNumber(left.integerValue) === normalizeNumber(right.integerValue));
    }
    else if ('doubleValue' in left && 'doubleValue' in right) {
        const n1 = normalizeNumber(left.doubleValue);
        const n2 = normalizeNumber(right.doubleValue);
        if (n1 === n2) {
            return isNegativeZero(n1) === isNegativeZero(n2);
        }
        else {
            return isNaN(n1) && isNaN(n2);
        }
    }
    return false;
}
function objectEquals(left, right) {
    const leftMap = left.mapValue.fields || {};
    const rightMap = right.mapValue.fields || {};
    if (objectSize(leftMap) !== objectSize(rightMap)) {
        return false;
    }
    for (const key in leftMap) {
        if (leftMap.hasOwnProperty(key)) {
            if (rightMap[key] === undefined ||
                !valueEquals(leftMap[key], rightMap[key])) {
                return false;
            }
        }
    }
    return true;
}
/** Returns true if the ArrayValue contains the specified element. */
function arrayValueContains(haystack, needle) {
    return ((haystack.values || []).find(v => valueEquals(v, needle)) !== undefined);
}
function valueCompare(left, right) {
    if (left === right) {
        return 0;
    }
    const leftType = typeOrder(left);
    const rightType = typeOrder(right);
    if (leftType !== rightType) {
        return primitiveComparator(leftType, rightType);
    }
    switch (leftType) {
        case 0 /* TypeOrder.NullValue */:
        case 9007199254740991 /* TypeOrder.MaxValue */:
            return 0;
        case 1 /* TypeOrder.BooleanValue */:
            return primitiveComparator(left.booleanValue, right.booleanValue);
        case 2 /* TypeOrder.NumberValue */:
            return compareNumbers(left, right);
        case 3 /* TypeOrder.TimestampValue */:
            return compareTimestamps(left.timestampValue, right.timestampValue);
        case 4 /* TypeOrder.ServerTimestampValue */:
            return compareTimestamps(getLocalWriteTime(left), getLocalWriteTime(right));
        case 5 /* TypeOrder.StringValue */:
            return compareUtf8Strings(left.stringValue, right.stringValue);
        case 6 /* TypeOrder.BlobValue */:
            return compareBlobs(left.bytesValue, right.bytesValue);
        case 7 /* TypeOrder.RefValue */:
            return compareReferences(left.referenceValue, right.referenceValue);
        case 8 /* TypeOrder.GeoPointValue */:
            return compareGeoPoints(left.geoPointValue, right.geoPointValue);
        case 9 /* TypeOrder.ArrayValue */:
            return compareArrays(left.arrayValue, right.arrayValue);
        case 10 /* TypeOrder.VectorValue */:
            return compareVectors(left.mapValue, right.mapValue);
        case 11 /* TypeOrder.ObjectValue */:
            return compareMaps(left.mapValue, right.mapValue);
        default:
            throw fail(0x5ae0, { leftType });
    }
}
function compareNumbers(left, right) {
    const leftNumber = normalizeNumber(left.integerValue || left.doubleValue);
    const rightNumber = normalizeNumber(right.integerValue || right.doubleValue);
    if (leftNumber < rightNumber) {
        return -1;
    }
    else if (leftNumber > rightNumber) {
        return 1;
    }
    else if (leftNumber === rightNumber) {
        return 0;
    }
    else {
        // one or both are NaN.
        if (isNaN(leftNumber)) {
            return isNaN(rightNumber) ? 0 : -1;
        }
        else {
            return 1;
        }
    }
}
function compareTimestamps(left, right) {
    if (typeof left === 'string' &&
        typeof right === 'string' &&
        left.length === right.length) {
        return primitiveComparator(left, right);
    }
    const leftTimestamp = normalizeTimestamp(left);
    const rightTimestamp = normalizeTimestamp(right);
    const comparison = primitiveComparator(leftTimestamp.seconds, rightTimestamp.seconds);
    if (comparison !== 0) {
        return comparison;
    }
    return primitiveComparator(leftTimestamp.nanos, rightTimestamp.nanos);
}
function compareReferences(leftPath, rightPath) {
    const leftSegments = leftPath.split('/');
    const rightSegments = rightPath.split('/');
    for (let i = 0; i < leftSegments.length && i < rightSegments.length; i++) {
        const comparison = primitiveComparator(leftSegments[i], rightSegments[i]);
        if (comparison !== 0) {
            return comparison;
        }
    }
    return primitiveComparator(leftSegments.length, rightSegments.length);
}
function compareGeoPoints(left, right) {
    const comparison = primitiveComparator(normalizeNumber(left.latitude), normalizeNumber(right.latitude));
    if (comparison !== 0) {
        return comparison;
    }
    return primitiveComparator(normalizeNumber(left.longitude), normalizeNumber(right.longitude));
}
function compareBlobs(left, right) {
    const leftBytes = normalizeByteString(left);
    const rightBytes = normalizeByteString(right);
    return leftBytes.compareTo(rightBytes);
}
function compareArrays(left, right) {
    const leftArray = left.values || [];
    const rightArray = right.values || [];
    for (let i = 0; i < leftArray.length && i < rightArray.length; ++i) {
        const compare = valueCompare(leftArray[i], rightArray[i]);
        if (compare) {
            return compare;
        }
    }
    return primitiveComparator(leftArray.length, rightArray.length);
}
function compareVectors(left, right) {
    const leftMap = left.fields || {};
    const rightMap = right.fields || {};
    // The vector is a map, but only vector value is compared.
    const leftArrayValue = leftMap[VECTOR_MAP_VECTORS_KEY]?.arrayValue;
    const rightArrayValue = rightMap[VECTOR_MAP_VECTORS_KEY]?.arrayValue;
    const lengthCompare = primitiveComparator(leftArrayValue?.values?.length || 0, rightArrayValue?.values?.length || 0);
    if (lengthCompare !== 0) {
        return lengthCompare;
    }
    return compareArrays(leftArrayValue, rightArrayValue);
}
function compareMaps(left, right) {
    if (left === MAX_VALUE.mapValue && right === MAX_VALUE.mapValue) {
        return 0;
    }
    else if (left === MAX_VALUE.mapValue) {
        return 1;
    }
    else if (right === MAX_VALUE.mapValue) {
        return -1;
    }
    const leftMap = left.fields || {};
    const leftKeys = Object.keys(leftMap);
    const rightMap = right.fields || {};
    const rightKeys = Object.keys(rightMap);
    // Even though MapValues are likely sorted correctly based on their insertion
    // order (e.g. when received from the backend), local modifications can bring
    // elements out of order. We need to re-sort the elements to ensure that
    // canonical IDs are independent of insertion order.
    leftKeys.sort();
    rightKeys.sort();
    for (let i = 0; i < leftKeys.length && i < rightKeys.length; ++i) {
        const keyCompare = compareUtf8Strings(leftKeys[i], rightKeys[i]);
        if (keyCompare !== 0) {
            return keyCompare;
        }
        const compare = valueCompare(leftMap[leftKeys[i]], rightMap[rightKeys[i]]);
        if (compare !== 0) {
            return compare;
        }
    }
    return primitiveComparator(leftKeys.length, rightKeys.length);
}
/** Returns a reference value for the provided database and key. */
function refValue(databaseId, key) {
    return {
        referenceValue: `projects/${databaseId.projectId}/databases/${databaseId.database}/documents/${key.path.canonicalString()}`
    };
}
/** Returns true if `value` is an ArrayValue. */
function isArray(value) {
    return !!value && 'arrayValue' in value;
}
/** Returns true if `value` is a NullValue. */
function isNullValue(value) {
    return !!value && 'nullValue' in value;
}
/** Returns true if `value` is NaN. */
function isNanValue(value) {
    return !!value && 'doubleValue' in value && isNaN(Number(value.doubleValue));
}
/** Returns true if `value` is a MapValue. */
function isMapValue(value) {
    return !!value && 'mapValue' in value;
}
/** Returns true if `value` is a VetorValue. */
function isVectorValue(value) {
    const type = (value?.mapValue?.fields || {})[TYPE_KEY]?.stringValue;
    return type === VECTOR_VALUE_SENTINEL;
}
/** Creates a deep copy of `source`. */
function deepClone(source) {
    if (source.geoPointValue) {
        return { geoPointValue: { ...source.geoPointValue } };
    }
    else if (source.timestampValue &&
        typeof source.timestampValue === 'object') {
        return { timestampValue: { ...source.timestampValue } };
    }
    else if (source.mapValue) {
        const target = { mapValue: { fields: {} } };
        forEach(source.mapValue.fields, (key, val) => (target.mapValue.fields[key] = deepClone(val)));
        return target;
    }
    else if (source.arrayValue) {
        const target = { arrayValue: { values: [] } };
        for (let i = 0; i < (source.arrayValue.values || []).length; ++i) {
            target.arrayValue.values[i] = deepClone(source.arrayValue.values[i]);
        }
        return target;
    }
    else {
        return { ...source };
    }
}
/** Returns true if the Value represents the canonical {@link #MAX_VALUE} . */
function isMaxValue(value) {
    return ((((value.mapValue || {}).fields || {})['__type__'] || {}).stringValue ===
        MAX_VALUE_TYPE);
}

/**
 * @license
 * Copyright 2022 Google LLC
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
 * Represents a bound of a query.
 *
 * The bound is specified with the given components representing a position and
 * whether it's just before or just after the position (relative to whatever the
 * query order is).
 *
 * The position represents a logical index position for a query. It's a prefix
 * of values for the (potentially implicit) order by clauses of a query.
 *
 * Bound provides a function to determine whether a document comes before or
 * after a bound. This is influenced by whether the position is just before or
 * just after the provided values.
 */
class Bound {
    constructor(position, inclusive) {
        this.position = position;
        this.inclusive = inclusive;
    }
}
function boundEquals(left, right) {
    if (left === null) {
        return right === null;
    }
    else if (right === null) {
        return false;
    }
    if (left.inclusive !== right.inclusive ||
        left.position.length !== right.position.length) {
        return false;
    }
    for (let i = 0; i < left.position.length; i++) {
        const leftPosition = left.position[i];
        const rightPosition = right.position[i];
        if (!valueEquals(leftPosition, rightPosition)) {
            return false;
        }
    }
    return true;
}

/**
 * @license
 * Copyright 2022 Google LLC
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
class Filter {
}
class FieldFilter extends Filter {
    constructor(field, op, value) {
        super();
        this.field = field;
        this.op = op;
        this.value = value;
    }
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(field, op, value) {
        if (field.isKeyField()) {
            if (op === "in" /* Operator.IN */ || op === "not-in" /* Operator.NOT_IN */) {
                return this.createKeyFieldInFilter(field, op, value);
            }
            else {
                return new KeyFieldFilter(field, op, value);
            }
        }
        else if (op === "array-contains" /* Operator.ARRAY_CONTAINS */) {
            return new ArrayContainsFilter(field, value);
        }
        else if (op === "in" /* Operator.IN */) {
            return new InFilter(field, value);
        }
        else if (op === "not-in" /* Operator.NOT_IN */) {
            return new NotInFilter(field, value);
        }
        else if (op === "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */) {
            return new ArrayContainsAnyFilter(field, value);
        }
        else {
            return new FieldFilter(field, op, value);
        }
    }
    static createKeyFieldInFilter(field, op, value) {
        return op === "in" /* Operator.IN */
            ? new KeyFieldInFilter(field, value)
            : new KeyFieldNotInFilter(field, value);
    }
    matches(doc) {
        const other = doc.data.field(this.field);
        // Types do not have to match in NOT_EQUAL filters.
        if (this.op === "!=" /* Operator.NOT_EQUAL */) {
            return (other !== null &&
                other.nullValue === undefined &&
                this.matchesComparison(valueCompare(other, this.value)));
        }
        // Only compare types with matching backend order (such as double and int).
        return (other !== null &&
            typeOrder(this.value) === typeOrder(other) &&
            this.matchesComparison(valueCompare(other, this.value)));
    }
    matchesComparison(comparison) {
        switch (this.op) {
            case "<" /* Operator.LESS_THAN */:
                return comparison < 0;
            case "<=" /* Operator.LESS_THAN_OR_EQUAL */:
                return comparison <= 0;
            case "==" /* Operator.EQUAL */:
                return comparison === 0;
            case "!=" /* Operator.NOT_EQUAL */:
                return comparison !== 0;
            case ">" /* Operator.GREATER_THAN */:
                return comparison > 0;
            case ">=" /* Operator.GREATER_THAN_OR_EQUAL */:
                return comparison >= 0;
            default:
                return fail(0xb8a2, {
                    operator: this.op
                });
        }
    }
    isInequality() {
        return ([
            "<" /* Operator.LESS_THAN */,
            "<=" /* Operator.LESS_THAN_OR_EQUAL */,
            ">" /* Operator.GREATER_THAN */,
            ">=" /* Operator.GREATER_THAN_OR_EQUAL */,
            "!=" /* Operator.NOT_EQUAL */,
            "not-in" /* Operator.NOT_IN */
        ].indexOf(this.op) >= 0);
    }
    getFlattenedFilters() {
        return [this];
    }
    getFilters() {
        return [this];
    }
}
class CompositeFilter extends Filter {
    constructor(filters, op) {
        super();
        this.filters = filters;
        this.op = op;
        this.memoizedFlattenedFilters = null;
    }
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(filters, op) {
        return new CompositeFilter(filters, op);
    }
    matches(doc) {
        if (compositeFilterIsConjunction(this)) {
            // For conjunctions, all filters must match, so return false if any filter doesn't match.
            return this.filters.find(filter => !filter.matches(doc)) === undefined;
        }
        else {
            // For disjunctions, at least one filter should match.
            return this.filters.find(filter => filter.matches(doc)) !== undefined;
        }
    }
    getFlattenedFilters() {
        if (this.memoizedFlattenedFilters !== null) {
            return this.memoizedFlattenedFilters;
        }
        this.memoizedFlattenedFilters = this.filters.reduce((result, subfilter) => {
            return result.concat(subfilter.getFlattenedFilters());
        }, []);
        return this.memoizedFlattenedFilters;
    }
    // Returns a mutable copy of `this.filters`
    getFilters() {
        return Object.assign([], this.filters);
    }
}
function compositeFilterIsConjunction(compositeFilter) {
    return compositeFilter.op === "and" /* CompositeOperator.AND */;
}
function filterEquals(f1, f2) {
    if (f1 instanceof FieldFilter) {
        return fieldFilterEquals(f1, f2);
    }
    else if (f1 instanceof CompositeFilter) {
        return compositeFilterEquals(f1, f2);
    }
    else {
        fail(0x4bef);
    }
}
function fieldFilterEquals(f1, f2) {
    return (f2 instanceof FieldFilter &&
        f1.op === f2.op &&
        f1.field.isEqual(f2.field) &&
        valueEquals(f1.value, f2.value));
}
function compositeFilterEquals(f1, f2) {
    if (f2 instanceof CompositeFilter &&
        f1.op === f2.op &&
        f1.filters.length === f2.filters.length) {
        const subFiltersMatch = f1.filters.reduce((result, f1Filter, index) => result && filterEquals(f1Filter, f2.filters[index]), true);
        return subFiltersMatch;
    }
    return false;
}
/** Filter that matches on key fields (i.e. '__name__'). */
class KeyFieldFilter extends FieldFilter {
    constructor(field, op, value) {
        super(field, op, value);
        this.key = DocumentKey.fromName(value.referenceValue);
    }
    matches(doc) {
        const comparison = DocumentKey.comparator(doc.key, this.key);
        return this.matchesComparison(comparison);
    }
}
/** Filter that matches on key fields within an array. */
class KeyFieldInFilter extends FieldFilter {
    constructor(field, value) {
        super(field, "in" /* Operator.IN */, value);
        this.keys = extractDocumentKeysFromArrayValue("in" /* Operator.IN */, value);
    }
    matches(doc) {
        return this.keys.some(key => key.isEqual(doc.key));
    }
}
/** Filter that matches on key fields not present within an array. */
class KeyFieldNotInFilter extends FieldFilter {
    constructor(field, value) {
        super(field, "not-in" /* Operator.NOT_IN */, value);
        this.keys = extractDocumentKeysFromArrayValue("not-in" /* Operator.NOT_IN */, value);
    }
    matches(doc) {
        return !this.keys.some(key => key.isEqual(doc.key));
    }
}
function extractDocumentKeysFromArrayValue(op, value) {
    return (value.arrayValue?.values || []).map(v => {
        return DocumentKey.fromName(v.referenceValue);
    });
}
/** A Filter that implements the array-contains operator. */
class ArrayContainsFilter extends FieldFilter {
    constructor(field, value) {
        super(field, "array-contains" /* Operator.ARRAY_CONTAINS */, value);
    }
    matches(doc) {
        const other = doc.data.field(this.field);
        return isArray(other) && arrayValueContains(other.arrayValue, this.value);
    }
}
/** A Filter that implements the IN operator. */
class InFilter extends FieldFilter {
    constructor(field, value) {
        super(field, "in" /* Operator.IN */, value);
    }
    matches(doc) {
        const other = doc.data.field(this.field);
        return other !== null && arrayValueContains(this.value.arrayValue, other);
    }
}
/** A Filter that implements the not-in operator. */
class NotInFilter extends FieldFilter {
    constructor(field, value) {
        super(field, "not-in" /* Operator.NOT_IN */, value);
    }
    matches(doc) {
        if (arrayValueContains(this.value.arrayValue, { nullValue: 'NULL_VALUE' })) {
            return false;
        }
        const other = doc.data.field(this.field);
        return (other !== null &&
            other.nullValue === undefined &&
            !arrayValueContains(this.value.arrayValue, other));
    }
}
/** A Filter that implements the array-contains-any operator. */
class ArrayContainsAnyFilter extends FieldFilter {
    constructor(field, value) {
        super(field, "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */, value);
    }
    matches(doc) {
        const other = doc.data.field(this.field);
        if (!isArray(other) || !other.arrayValue.values) {
            return false;
        }
        return other.arrayValue.values.some(val => arrayValueContains(this.value.arrayValue, val));
    }
}

/**
 * @license
 * Copyright 2022 Google LLC
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
 * An ordering on a field, in some Direction. Direction defaults to ASCENDING.
 */
class OrderBy {
    constructor(field, dir = "asc" /* Direction.ASCENDING */) {
        this.field = field;
        this.dir = dir;
    }
}
function orderByEquals(left, right) {
    return left.dir === right.dir && left.field.isEqual(right.field);
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * A version of a document in Firestore. This corresponds to the version
 * timestamp, such as update_time or read_time.
 */
class SnapshotVersion {
    static fromTimestamp(value) {
        return new SnapshotVersion(value);
    }
    static min() {
        return new SnapshotVersion(new Timestamp(0, 0));
    }
    static max() {
        return new SnapshotVersion(new Timestamp(253402300799, 1e9 - 1));
    }
    constructor(timestamp) {
        this.timestamp = timestamp;
    }
    compareTo(other) {
        return this.timestamp._compareTo(other.timestamp);
    }
    isEqual(other) {
        return this.timestamp.isEqual(other.timestamp);
    }
    /** Returns a number representation of the version for use in spec tests. */
    toMicroseconds() {
        // Convert to microseconds.
        return this.timestamp.seconds * 1e6 + this.timestamp.nanoseconds / 1000;
    }
    toString() {
        return 'SnapshotVersion(' + this.timestamp.toString() + ')';
    }
    toTimestamp() {
        return this.timestamp;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
// An immutable sorted map implementation, based on a Left-leaning Red-Black
// tree.
class SortedMap {
    constructor(comparator, root) {
        this.comparator = comparator;
        this.root = root ? root : LLRBNode.EMPTY;
    }
    // Returns a copy of the map, with the specified key/value added or replaced.
    insert(key, value) {
        return new SortedMap(this.comparator, this.root
            .insert(key, value, this.comparator)
            .copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns a copy of the map, with the specified key removed.
    remove(key) {
        return new SortedMap(this.comparator, this.root
            .remove(key, this.comparator)
            .copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns the value of the node with the given key, or null.
    get(key) {
        let node = this.root;
        while (!node.isEmpty()) {
            const cmp = this.comparator(key, node.key);
            if (cmp === 0) {
                return node.value;
            }
            else if (cmp < 0) {
                node = node.left;
            }
            else if (cmp > 0) {
                node = node.right;
            }
        }
        return null;
    }
    // Returns the index of the element in this sorted map, or -1 if it doesn't
    // exist.
    indexOf(key) {
        // Number of nodes that were pruned when descending right
        let prunedNodes = 0;
        let node = this.root;
        while (!node.isEmpty()) {
            const cmp = this.comparator(key, node.key);
            if (cmp === 0) {
                return prunedNodes + node.left.size;
            }
            else if (cmp < 0) {
                node = node.left;
            }
            else {
                // Count all nodes left of the node plus the node itself
                prunedNodes += node.left.size + 1;
                node = node.right;
            }
        }
        // Node not found
        return -1;
    }
    isEmpty() {
        return this.root.isEmpty();
    }
    // Returns the total number of nodes in the map.
    get size() {
        return this.root.size;
    }
    // Returns the minimum key in the map.
    minKey() {
        return this.root.minKey();
    }
    // Returns the maximum key in the map.
    maxKey() {
        return this.root.maxKey();
    }
    // Traverses the map in key order and calls the specified action function
    // for each key/value pair. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(action) {
        return this.root.inorderTraversal(action);
    }
    forEach(fn) {
        this.inorderTraversal((k, v) => {
            fn(k, v);
            return false;
        });
    }
    toString() {
        const descriptions = [];
        this.inorderTraversal((k, v) => {
            descriptions.push(`${k}:${v}`);
            return false;
        });
        return `{${descriptions.join(', ')}}`;
    }
    // Traverses the map in reverse key order and calls the specified action
    // function for each key/value pair. If action returns true, traversal is
    // aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(action) {
        return this.root.reverseTraversal(action);
    }
    // Returns an iterator over the SortedMap.
    getIterator() {
        return new SortedMapIterator(this.root, null, this.comparator, false);
    }
    getIteratorFrom(key) {
        return new SortedMapIterator(this.root, key, this.comparator, false);
    }
    getReverseIterator() {
        return new SortedMapIterator(this.root, null, this.comparator, true);
    }
    getReverseIteratorFrom(key) {
        return new SortedMapIterator(this.root, key, this.comparator, true);
    }
} // end SortedMap
// An iterator over an LLRBNode.
class SortedMapIterator {
    constructor(node, startKey, comparator, isReverse) {
        this.isReverse = isReverse;
        this.nodeStack = [];
        let cmp = 1;
        while (!node.isEmpty()) {
            cmp = startKey ? comparator(node.key, startKey) : 1;
            // flip the comparison if we're going in reverse
            if (startKey && isReverse) {
                cmp *= -1;
            }
            if (cmp < 0) {
                // This node is less than our start key. ignore it
                if (this.isReverse) {
                    node = node.left;
                }
                else {
                    node = node.right;
                }
            }
            else if (cmp === 0) {
                // This node is exactly equal to our start key. Push it on the stack,
                // but stop iterating;
                this.nodeStack.push(node);
                break;
            }
            else {
                // This node is greater than our start key, add it to the stack and move
                // to the next one
                this.nodeStack.push(node);
                if (this.isReverse) {
                    node = node.right;
                }
                else {
                    node = node.left;
                }
            }
        }
    }
    getNext() {
        let node = this.nodeStack.pop();
        const result = { key: node.key, value: node.value };
        if (this.isReverse) {
            node = node.left;
            while (!node.isEmpty()) {
                this.nodeStack.push(node);
                node = node.right;
            }
        }
        else {
            node = node.right;
            while (!node.isEmpty()) {
                this.nodeStack.push(node);
                node = node.left;
            }
        }
        return result;
    }
    hasNext() {
        return this.nodeStack.length > 0;
    }
    peek() {
        if (this.nodeStack.length === 0) {
            return null;
        }
        const node = this.nodeStack[this.nodeStack.length - 1];
        return { key: node.key, value: node.value };
    }
} // end SortedMapIterator
// Represents a node in a Left-leaning Red-Black tree.
class LLRBNode {
    constructor(key, value, color, left, right) {
        this.key = key;
        this.value = value;
        this.color = color != null ? color : LLRBNode.RED;
        this.left = left != null ? left : LLRBNode.EMPTY;
        this.right = right != null ? right : LLRBNode.EMPTY;
        this.size = this.left.size + 1 + this.right.size;
    }
    // Returns a copy of the current node, optionally replacing pieces of it.
    copy(key, value, color, left, right) {
        return new LLRBNode(key != null ? key : this.key, value != null ? value : this.value, color != null ? color : this.color, left != null ? left : this.left, right != null ? right : this.right);
    }
    isEmpty() {
        return false;
    }
    // Traverses the tree in key order and calls the specified action function
    // for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(action) {
        return (this.left.inorderTraversal(action) ||
            action(this.key, this.value) ||
            this.right.inorderTraversal(action));
    }
    // Traverses the tree in reverse key order and calls the specified action
    // function for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(action) {
        return (this.right.reverseTraversal(action) ||
            action(this.key, this.value) ||
            this.left.reverseTraversal(action));
    }
    // Returns the minimum node in the tree.
    min() {
        if (this.left.isEmpty()) {
            return this;
        }
        else {
            return this.left.min();
        }
    }
    // Returns the maximum key in the tree.
    minKey() {
        return this.min().key;
    }
    // Returns the maximum key in the tree.
    maxKey() {
        if (this.right.isEmpty()) {
            return this.key;
        }
        else {
            return this.right.maxKey();
        }
    }
    // Returns new tree, with the key/value added.
    insert(key, value, comparator) {
        let n = this;
        const cmp = comparator(key, n.key);
        if (cmp < 0) {
            n = n.copy(null, null, null, n.left.insert(key, value, comparator), null);
        }
        else if (cmp === 0) {
            n = n.copy(null, value, null, null, null);
        }
        else {
            n = n.copy(null, null, null, null, n.right.insert(key, value, comparator));
        }
        return n.fixUp();
    }
    removeMin() {
        if (this.left.isEmpty()) {
            return LLRBNode.EMPTY;
        }
        let n = this;
        if (!n.left.isRed() && !n.left.left.isRed()) {
            n = n.moveRedLeft();
        }
        n = n.copy(null, null, null, n.left.removeMin(), null);
        return n.fixUp();
    }
    // Returns new tree, with the specified item removed.
    remove(key, comparator) {
        let smallest;
        let n = this;
        if (comparator(key, n.key) < 0) {
            if (!n.left.isEmpty() && !n.left.isRed() && !n.left.left.isRed()) {
                n = n.moveRedLeft();
            }
            n = n.copy(null, null, null, n.left.remove(key, comparator), null);
        }
        else {
            if (n.left.isRed()) {
                n = n.rotateRight();
            }
            if (!n.right.isEmpty() && !n.right.isRed() && !n.right.left.isRed()) {
                n = n.moveRedRight();
            }
            if (comparator(key, n.key) === 0) {
                if (n.right.isEmpty()) {
                    return LLRBNode.EMPTY;
                }
                else {
                    smallest = n.right.min();
                    n = n.copy(smallest.key, smallest.value, null, null, n.right.removeMin());
                }
            }
            n = n.copy(null, null, null, null, n.right.remove(key, comparator));
        }
        return n.fixUp();
    }
    isRed() {
        return this.color;
    }
    // Returns new tree after performing any needed rotations.
    fixUp() {
        let n = this;
        if (n.right.isRed() && !n.left.isRed()) {
            n = n.rotateLeft();
        }
        if (n.left.isRed() && n.left.left.isRed()) {
            n = n.rotateRight();
        }
        if (n.left.isRed() && n.right.isRed()) {
            n = n.colorFlip();
        }
        return n;
    }
    moveRedLeft() {
        let n = this.colorFlip();
        if (n.right.left.isRed()) {
            n = n.copy(null, null, null, null, n.right.rotateRight());
            n = n.rotateLeft();
            n = n.colorFlip();
        }
        return n;
    }
    moveRedRight() {
        let n = this.colorFlip();
        if (n.left.left.isRed()) {
            n = n.rotateRight();
            n = n.colorFlip();
        }
        return n;
    }
    rotateLeft() {
        const nl = this.copy(null, null, LLRBNode.RED, null, this.right.left);
        return this.right.copy(null, null, this.color, nl, null);
    }
    rotateRight() {
        const nr = this.copy(null, null, LLRBNode.RED, this.left.right, null);
        return this.left.copy(null, null, this.color, null, nr);
    }
    colorFlip() {
        const left = this.left.copy(null, null, !this.left.color, null, null);
        const right = this.right.copy(null, null, !this.right.color, null, null);
        return this.copy(null, null, !this.color, left, right);
    }
    // For testing.
    checkMaxDepth() {
        const blackDepth = this.check();
        if (Math.pow(2.0, blackDepth) <= this.size + 1) {
            return true;
        }
        else {
            return false;
        }
    }
    // In a balanced RB tree, the black-depth (number of black nodes) from root to
    // leaves is equal on both sides.  This function verifies that or asserts.
    check() {
        if (this.isRed() && this.left.isRed()) {
            throw fail(0xaad2, {
                key: this.key,
                value: this.value
            });
        }
        if (this.right.isRed()) {
            throw fail(0x3721, {
                key: this.key,
                value: this.value
            });
        }
        const blackDepth = this.left.check();
        if (blackDepth !== this.right.check()) {
            throw fail(0x6d2d);
        }
        else {
            return blackDepth + (this.isRed() ? 0 : 1);
        }
    }
} // end LLRBNode
// Empty node is shared between all LLRB trees.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
LLRBNode.EMPTY = null;
LLRBNode.RED = true;
LLRBNode.BLACK = false;
// Represents an empty node (a leaf node in the Red-Black Tree).
class LLRBEmptyNode {
    constructor() {
        this.size = 0;
    }
    get key() {
        throw fail(0xe1a6);
    }
    get value() {
        throw fail(0x3f0d);
    }
    get color() {
        throw fail(0x4157);
    }
    get left() {
        throw fail(0x741e);
    }
    get right() {
        throw fail(0x901e);
    }
    // Returns a copy of the current node.
    copy(key, value, color, left, right) {
        return this;
    }
    // Returns a copy of the tree, with the specified key/value added.
    insert(key, value, comparator) {
        return new LLRBNode(key, value);
    }
    // Returns a copy of the tree, with the specified key removed.
    remove(key, comparator) {
        return this;
    }
    isEmpty() {
        return true;
    }
    inorderTraversal(action) {
        return false;
    }
    reverseTraversal(action) {
        return false;
    }
    minKey() {
        return null;
    }
    maxKey() {
        return null;
    }
    isRed() {
        return false;
    }
    // For testing.
    checkMaxDepth() {
        return true;
    }
    check() {
        return 0;
    }
} // end LLRBEmptyNode
LLRBNode.EMPTY = new LLRBEmptyNode();

/**
 * @license
 * Copyright 2017 Google LLC
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
 * SortedSet is an immutable (copy-on-write) collection that holds elements
 * in order specified by the provided comparator.
 *
 * NOTE: if provided comparator returns 0 for two elements, we consider them to
 * be equal!
 */
class SortedSet {
    constructor(comparator) {
        this.comparator = comparator;
        this.data = new SortedMap(this.comparator);
    }
    has(elem) {
        return this.data.get(elem) !== null;
    }
    first() {
        return this.data.minKey();
    }
    last() {
        return this.data.maxKey();
    }
    get size() {
        return this.data.size;
    }
    indexOf(elem) {
        return this.data.indexOf(elem);
    }
    /** Iterates elements in order defined by "comparator" */
    forEach(cb) {
        this.data.inorderTraversal((k, v) => {
            cb(k);
            return false;
        });
    }
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
    forEachInRange(range, cb) {
        const iter = this.data.getIteratorFrom(range[0]);
        while (iter.hasNext()) {
            const elem = iter.getNext();
            if (this.comparator(elem.key, range[1]) >= 0) {
                return;
            }
            cb(elem.key);
        }
    }
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */
    forEachWhile(cb, start) {
        let iter;
        if (start !== undefined) {
            iter = this.data.getIteratorFrom(start);
        }
        else {
            iter = this.data.getIterator();
        }
        while (iter.hasNext()) {
            const elem = iter.getNext();
            const result = cb(elem.key);
            if (!result) {
                return;
            }
        }
    }
    /** Finds the least element greater than or equal to `elem`. */
    firstAfterOrEqual(elem) {
        const iter = this.data.getIteratorFrom(elem);
        return iter.hasNext() ? iter.getNext().key : null;
    }
    getIterator() {
        return new SortedSetIterator(this.data.getIterator());
    }
    getIteratorFrom(key) {
        return new SortedSetIterator(this.data.getIteratorFrom(key));
    }
    /** Inserts or updates an element */
    add(elem) {
        return this.copy(this.data.remove(elem).insert(elem, true));
    }
    /** Deletes an element */
    delete(elem) {
        if (!this.has(elem)) {
            return this;
        }
        return this.copy(this.data.remove(elem));
    }
    isEmpty() {
        return this.data.isEmpty();
    }
    unionWith(other) {
        let result = this;
        // Make sure `result` always refers to the larger one of the two sets.
        if (result.size < other.size) {
            result = other;
            other = this;
        }
        other.forEach(elem => {
            result = result.add(elem);
        });
        return result;
    }
    isEqual(other) {
        if (!(other instanceof SortedSet)) {
            return false;
        }
        if (this.size !== other.size) {
            return false;
        }
        const thisIt = this.data.getIterator();
        const otherIt = other.data.getIterator();
        while (thisIt.hasNext()) {
            const thisElem = thisIt.getNext().key;
            const otherElem = otherIt.getNext().key;
            if (this.comparator(thisElem, otherElem) !== 0) {
                return false;
            }
        }
        return true;
    }
    toArray() {
        const res = [];
        this.forEach(targetId => {
            res.push(targetId);
        });
        return res;
    }
    toString() {
        const result = [];
        this.forEach(elem => result.push(elem));
        return 'SortedSet(' + result.toString() + ')';
    }
    copy(data) {
        const result = new SortedSet(this.comparator);
        result.data = data;
        return result;
    }
}
class SortedSetIterator {
    constructor(iter) {
        this.iter = iter;
    }
    getNext() {
        return this.iter.getNext().key;
    }
    hasNext() {
        return this.iter.hasNext();
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
 * Provides a set of fields that can be used to partially patch a document.
 * FieldMask is used in conjunction with ObjectValue.
 * Examples:
 *   foo - Overwrites foo entirely with the provided value. If foo is not
 *         present in the companion ObjectValue, the field is deleted.
 *   foo.bar - Overwrites only the field bar of the object foo.
 *             If foo is not an object, foo is replaced with an object
 *             containing foo
 */
class FieldMask {
    constructor(fields) {
        this.fields = fields;
        // TODO(dimond): validation of FieldMask
        // Sort the field mask to support `FieldMask.isEqual()` and assert below.
        fields.sort(FieldPath$1.comparator);
    }
    static empty() {
        return new FieldMask([]);
    }
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */
    unionWith(extraFields) {
        let mergedMaskSet = new SortedSet(FieldPath$1.comparator);
        for (const fieldPath of this.fields) {
            mergedMaskSet = mergedMaskSet.add(fieldPath);
        }
        for (const fieldPath of extraFields) {
            mergedMaskSet = mergedMaskSet.add(fieldPath);
        }
        return new FieldMask(mergedMaskSet.toArray());
    }
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */
    covers(fieldPath) {
        for (const fieldMaskPath of this.fields) {
            if (fieldMaskPath.isPrefixOf(fieldPath)) {
                return true;
            }
        }
        return false;
    }
    isEqual(other) {
        return arrayEquals(this.fields, other.fields, (l, r) => l.isEqual(r));
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * An ObjectValue represents a MapValue in the Firestore Proto and offers the
 * ability to add and remove fields (via the ObjectValueBuilder).
 */
class ObjectValue {
    constructor(value) {
        this.value = value;
    }
    static empty() {
        return new ObjectValue({ mapValue: {} });
    }
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */
    field(path) {
        if (path.isEmpty()) {
            return this.value;
        }
        else {
            let currentLevel = this.value;
            for (let i = 0; i < path.length - 1; ++i) {
                currentLevel = (currentLevel.mapValue.fields || {})[path.get(i)];
                if (!isMapValue(currentLevel)) {
                    return null;
                }
            }
            currentLevel = (currentLevel.mapValue.fields || {})[path.lastSegment()];
            return currentLevel || null;
        }
    }
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */
    set(path, value) {
        const fieldsMap = this.getFieldsMap(path.popLast());
        fieldsMap[path.lastSegment()] = deepClone(value);
    }
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */
    setAll(data) {
        let parent = FieldPath$1.emptyPath();
        let upserts = {};
        let deletes = [];
        data.forEach((value, path) => {
            if (!parent.isImmediateParentOf(path)) {
                // Insert the accumulated changes at this parent location
                const fieldsMap = this.getFieldsMap(parent);
                this.applyChanges(fieldsMap, upserts, deletes);
                upserts = {};
                deletes = [];
                parent = path.popLast();
            }
            if (value) {
                upserts[path.lastSegment()] = deepClone(value);
            }
            else {
                deletes.push(path.lastSegment());
            }
        });
        const fieldsMap = this.getFieldsMap(parent);
        this.applyChanges(fieldsMap, upserts, deletes);
    }
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */
    delete(path) {
        const nestedValue = this.field(path.popLast());
        if (isMapValue(nestedValue) && nestedValue.mapValue.fields) {
            delete nestedValue.mapValue.fields[path.lastSegment()];
        }
    }
    isEqual(other) {
        return valueEquals(this.value, other.value);
    }
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */
    getFieldsMap(path) {
        let current = this.value;
        if (!current.mapValue.fields) {
            current.mapValue = { fields: {} };
        }
        for (let i = 0; i < path.length; ++i) {
            let next = current.mapValue.fields[path.get(i)];
            if (!isMapValue(next) || !next.mapValue.fields) {
                next = { mapValue: { fields: {} } };
                current.mapValue.fields[path.get(i)] = next;
            }
            current = next;
        }
        return current.mapValue.fields;
    }
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */
    applyChanges(fieldsMap, inserts, deletes) {
        forEach(inserts, (key, val) => (fieldsMap[key] = val));
        for (const field of deletes) {
            delete fieldsMap[field];
        }
    }
    clone() {
        return new ObjectValue(deepClone(this.value));
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Represents a document in Firestore with a key, version, data and whether it
 * has local mutations applied to it.
 *
 * Documents can transition between states via `convertToFoundDocument()`,
 * `convertToNoDocument()` and `convertToUnknownDocument()`. If a document does
 * not transition to one of these states even after all mutations have been
 * applied, `isValidDocument()` returns false and the document should be removed
 * from all views.
 */
class MutableDocument {
    constructor(key, documentType, version, readTime, createTime, data, documentState) {
        this.key = key;
        this.documentType = documentType;
        this.version = version;
        this.readTime = readTime;
        this.createTime = createTime;
        this.data = data;
        this.documentState = documentState;
    }
    /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */
    static newInvalidDocument(documentKey) {
        return new MutableDocument(documentKey, 0 /* DocumentType.INVALID */, 
        /* version */ SnapshotVersion.min(), 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */
    static newFoundDocument(documentKey, version, createTime, value) {
        return new MutableDocument(documentKey, 1 /* DocumentType.FOUND_DOCUMENT */, 
        /* version */ version, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ createTime, value, 0 /* DocumentState.SYNCED */);
    }
    /** Creates a new document that is known to not exist at the given version. */
    static newNoDocument(documentKey, version) {
        return new MutableDocument(documentKey, 2 /* DocumentType.NO_DOCUMENT */, 
        /* version */ version, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */
    static newUnknownDocument(documentKey, version) {
        return new MutableDocument(documentKey, 3 /* DocumentType.UNKNOWN_DOCUMENT */, 
        /* version */ version, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */);
    }
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */
    convertToFoundDocument(version, value) {
        // If a document is switching state from being an invalid or deleted
        // document to a valid (FOUND_DOCUMENT) document, either due to receiving an
        // update from Watch or due to applying a local set mutation on top
        // of a deleted document, our best guess about its createTime would be the
        // version at which the document transitioned to a FOUND_DOCUMENT.
        if (this.createTime.isEqual(SnapshotVersion.min()) &&
            (this.documentType === 2 /* DocumentType.NO_DOCUMENT */ ||
                this.documentType === 0 /* DocumentType.INVALID */)) {
            this.createTime = version;
        }
        this.version = version;
        this.documentType = 1 /* DocumentType.FOUND_DOCUMENT */;
        this.data = value;
        this.documentState = 0 /* DocumentState.SYNCED */;
        return this;
    }
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */
    convertToNoDocument(version) {
        this.version = version;
        this.documentType = 2 /* DocumentType.NO_DOCUMENT */;
        this.data = ObjectValue.empty();
        this.documentState = 0 /* DocumentState.SYNCED */;
        return this;
    }
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */
    convertToUnknownDocument(version) {
        this.version = version;
        this.documentType = 3 /* DocumentType.UNKNOWN_DOCUMENT */;
        this.data = ObjectValue.empty();
        this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */;
        return this;
    }
    setHasCommittedMutations() {
        this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */;
        return this;
    }
    setHasLocalMutations() {
        this.documentState = 1 /* DocumentState.HAS_LOCAL_MUTATIONS */;
        this.version = SnapshotVersion.min();
        return this;
    }
    setReadTime(readTime) {
        this.readTime = readTime;
        return this;
    }
    get hasLocalMutations() {
        return this.documentState === 1 /* DocumentState.HAS_LOCAL_MUTATIONS */;
    }
    get hasCommittedMutations() {
        return this.documentState === 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */;
    }
    get hasPendingWrites() {
        return this.hasLocalMutations || this.hasCommittedMutations;
    }
    isValidDocument() {
        return this.documentType !== 0 /* DocumentType.INVALID */;
    }
    isFoundDocument() {
        return this.documentType === 1 /* DocumentType.FOUND_DOCUMENT */;
    }
    isNoDocument() {
        return this.documentType === 2 /* DocumentType.NO_DOCUMENT */;
    }
    isUnknownDocument() {
        return this.documentType === 3 /* DocumentType.UNKNOWN_DOCUMENT */;
    }
    isEqual(other) {
        return (other instanceof MutableDocument &&
            this.key.isEqual(other.key) &&
            this.version.isEqual(other.version) &&
            this.documentType === other.documentType &&
            this.documentState === other.documentState &&
            this.data.isEqual(other.data));
    }
    mutableCopy() {
        return new MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
    }
    toString() {
        return (`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, ` +
            `{createTime: ${this.createTime}}), ` +
            `{documentType: ${this.documentType}}), ` +
            `{documentState: ${this.documentState}})`);
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
// Visible for testing
class TargetImpl {
    constructor(path, collectionGroup = null, orderBy = [], filters = [], limit = null, startAt = null, endAt = null) {
        this.path = path;
        this.collectionGroup = collectionGroup;
        this.orderBy = orderBy;
        this.filters = filters;
        this.limit = limit;
        this.startAt = startAt;
        this.endAt = endAt;
        this.memoizedCanonicalId = null;
    }
}
/**
 * Initializes a Target with a path and optional additional query constraints.
 * Path must currently be empty if this is a collection group query.
 *
 * NOTE: you should always construct `Target` from `Query.toTarget` instead of
 * using this factory method, because `Query` provides an implicit `orderBy`
 * property.
 */
function newTarget(path, collectionGroup = null, orderBy = [], filters = [], limit = null, startAt = null, endAt = null) {
    return new TargetImpl(path, collectionGroup, orderBy, filters, limit, startAt, endAt);
}
function targetEquals(left, right) {
    if (left.limit !== right.limit) {
        return false;
    }
    if (left.orderBy.length !== right.orderBy.length) {
        return false;
    }
    for (let i = 0; i < left.orderBy.length; i++) {
        if (!orderByEquals(left.orderBy[i], right.orderBy[i])) {
            return false;
        }
    }
    if (left.filters.length !== right.filters.length) {
        return false;
    }
    for (let i = 0; i < left.filters.length; i++) {
        if (!filterEquals(left.filters[i], right.filters[i])) {
            return false;
        }
    }
    if (left.collectionGroup !== right.collectionGroup) {
        return false;
    }
    if (!left.path.isEqual(right.path)) {
        return false;
    }
    if (!boundEquals(left.startAt, right.startAt)) {
        return false;
    }
    return boundEquals(left.endAt, right.endAt);
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Query encapsulates all the query attributes we support in the SDK. It can
 * be run against the LocalStore, as well as be converted to a `Target` to
 * query the RemoteStore results.
 *
 * Visible for testing.
 */
class QueryImpl {
    /**
     * Initializes a Query with a path and optional additional query constraints.
     * Path must currently be empty if this is a collection group query.
     */
    constructor(path, collectionGroup = null, explicitOrderBy = [], filters = [], limit = null, limitType = "F" /* LimitType.First */, startAt = null, endAt = null) {
        this.path = path;
        this.collectionGroup = collectionGroup;
        this.explicitOrderBy = explicitOrderBy;
        this.filters = filters;
        this.limit = limit;
        this.limitType = limitType;
        this.startAt = startAt;
        this.endAt = endAt;
        this.memoizedNormalizedOrderBy = null;
        // The corresponding `Target` of this `Query` instance, for use with
        // non-aggregate queries.
        this.memoizedTarget = null;
        // The corresponding `Target` of this `Query` instance, for use with
        // aggregate queries. Unlike targets for non-aggregate queries,
        // aggregate query targets do not contain normalized order-bys, they only
        // contain explicit order-bys.
        this.memoizedAggregateTarget = null;
        if (this.startAt) ;
        if (this.endAt) ;
    }
}
/** Creates a new Query for a query that matches all documents at `path` */
function newQueryForPath(path) {
    return new QueryImpl(path);
}
// Returns the sorted set of inequality filter fields used in this query.
function getInequalityFilterFields(query) {
    let result = new SortedSet(FieldPath$1.comparator);
    query.filters.forEach((filter) => {
        const subFilters = filter.getFlattenedFilters();
        subFilters.forEach((filter) => {
            if (filter.isInequality()) {
                result = result.add(filter.field);
            }
        });
    });
    return result;
}
/**
 * Creates a new Query for a collection group query that matches all documents
 * within the provided collection group.
 */
function newQueryForCollectionGroup(collectionId) {
    return new QueryImpl(ResourcePath.emptyPath(), collectionId);
}
/**
 * Returns whether the query matches a single document by path (rather than a
 * collection).
 */
function isDocumentQuery(query) {
    return (DocumentKey.isDocumentKey(query.path) &&
        query.collectionGroup === null &&
        query.filters.length === 0);
}
/**
 * Returns whether the query matches a collection group rather than a specific
 * collection.
 */
function isCollectionGroupQuery(query) {
    return query.collectionGroup !== null;
}
/**
 * Returns the normalized order-by constraint that is used to execute the Query,
 * which can be different from the order-by constraints the user provided (e.g.
 * the SDK and backend always orders by `__name__`). The normalized order-by
 * includes implicit order-bys in addition to the explicit user provided
 * order-bys.
 */
function queryNormalizedOrderBy(query) {
    const queryImpl = debugCast(query);
    if (queryImpl.memoizedNormalizedOrderBy === null) {
        queryImpl.memoizedNormalizedOrderBy = [];
        const fieldsNormalized = new Set();
        // Any explicit order by fields should be added as is.
        for (const orderBy of queryImpl.explicitOrderBy) {
            queryImpl.memoizedNormalizedOrderBy.push(orderBy);
            fieldsNormalized.add(orderBy.field.canonicalString());
        }
        // The order of the implicit ordering always matches the last explicit order by.
        const lastDirection = queryImpl.explicitOrderBy.length > 0
            ? queryImpl.explicitOrderBy[queryImpl.explicitOrderBy.length - 1].dir
            : "asc" /* Direction.ASCENDING */;
        // Any inequality fields not explicitly ordered should be implicitly ordered in a lexicographical
        // order. When there are multiple inequality filters on the same field, the field should be added
        // only once.
        // Note: `SortedSet<FieldPath>` sorts the key field before other fields. However, we want the key
        // field to be sorted last.
        const inequalityFields = getInequalityFilterFields(queryImpl);
        inequalityFields.forEach(field => {
            if (!fieldsNormalized.has(field.canonicalString()) &&
                !field.isKeyField()) {
                queryImpl.memoizedNormalizedOrderBy.push(new OrderBy(field, lastDirection));
            }
        });
        // Add the document key field to the last if it is not explicitly ordered.
        if (!fieldsNormalized.has(FieldPath$1.keyField().canonicalString())) {
            queryImpl.memoizedNormalizedOrderBy.push(new OrderBy(FieldPath$1.keyField(), lastDirection));
        }
    }
    return queryImpl.memoizedNormalizedOrderBy;
}
/**
 * Converts this `Query` instance to its corresponding `Target` representation.
 */
function queryToTarget(query) {
    const queryImpl = debugCast(query);
    if (!queryImpl.memoizedTarget) {
        queryImpl.memoizedTarget = _queryToTarget(queryImpl, queryNormalizedOrderBy(query));
    }
    return queryImpl.memoizedTarget;
}
/**
 * Converts this `Query` instance to its corresponding `Target` representation,
 * for use within an aggregate query. Unlike targets for non-aggregate queries,
 * aggregate query targets do not contain normalized order-bys, they only
 * contain explicit order-bys.
 */
function queryToAggregateTarget(query) {
    const queryImpl = debugCast(query);
    if (!queryImpl.memoizedAggregateTarget) {
        // Do not include implicit order-bys for aggregate queries.
        queryImpl.memoizedAggregateTarget = _queryToTarget(queryImpl, query.explicitOrderBy);
    }
    return queryImpl.memoizedAggregateTarget;
}
function _queryToTarget(queryImpl, orderBys) {
    if (queryImpl.limitType === "F" /* LimitType.First */) {
        return newTarget(queryImpl.path, queryImpl.collectionGroup, orderBys, queryImpl.filters, queryImpl.limit, queryImpl.startAt, queryImpl.endAt);
    }
    else {
        // Flip the orderBy directions since we want the last results
        orderBys = orderBys.map(orderBy => {
            const dir = orderBy.dir === "desc" /* Direction.DESCENDING */
                ? "asc" /* Direction.ASCENDING */
                : "desc" /* Direction.DESCENDING */;
            return new OrderBy(orderBy.field, dir);
        });
        // We need to swap the cursors to match the now-flipped query ordering.
        const startAt = queryImpl.endAt
            ? new Bound(queryImpl.endAt.position, queryImpl.endAt.inclusive)
            : null;
        const endAt = queryImpl.startAt
            ? new Bound(queryImpl.startAt.position, queryImpl.startAt.inclusive)
            : null;
        // Now return as a LimitType.First query.
        return newTarget(queryImpl.path, queryImpl.collectionGroup, orderBys, queryImpl.filters, queryImpl.limit, startAt, endAt);
    }
}
function queryWithAddedFilter(query, filter) {
    const newFilters = query.filters.concat([filter]);
    return new QueryImpl(query.path, query.collectionGroup, query.explicitOrderBy.slice(), newFilters, query.limit, query.limitType, query.startAt, query.endAt);
}
function queryWithAddedOrderBy(query, orderBy) {
    // TODO(dimond): validate that orderBy does not list the same key twice.
    const newOrderBy = query.explicitOrderBy.concat([orderBy]);
    return new QueryImpl(query.path, query.collectionGroup, newOrderBy, query.filters.slice(), query.limit, query.limitType, query.startAt, query.endAt);
}
function queryWithLimit(query, limit, limitType) {
    return new QueryImpl(query.path, query.collectionGroup, query.explicitOrderBy.slice(), query.filters.slice(), limit, limitType, query.startAt, query.endAt);
}
function queryWithStartAt(query, bound) {
    return new QueryImpl(query.path, query.collectionGroup, query.explicitOrderBy.slice(), query.filters.slice(), query.limit, query.limitType, bound, query.endAt);
}
function queryWithEndAt(query, bound) {
    return new QueryImpl(query.path, query.collectionGroup, query.explicitOrderBy.slice(), query.filters.slice(), query.limit, query.limitType, query.startAt, bound);
}
function queryEquals(left, right) {
    return (targetEquals(queryToTarget(left), queryToTarget(right)) &&
        left.limitType === right.limitType);
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
 * Returns an DoubleValue for `value` that is encoded based the serializer's
 * `useProto3Json` setting.
 */
function toDouble(serializer, value) {
    if (serializer.useProto3Json) {
        if (isNaN(value)) {
            return { doubleValue: 'NaN' };
        }
        else if (value === Infinity) {
            return { doubleValue: 'Infinity' };
        }
        else if (value === -Infinity) {
            return { doubleValue: '-Infinity' };
        }
    }
    return { doubleValue: isNegativeZero(value) ? '-0' : value };
}
/**
 * Returns an IntegerValue for `value`.
 */
function toInteger(value) {
    return { integerValue: '' + value };
}
/**
 * Returns a value for a number that's appropriate to put into a proto.
 * The return value is an IntegerValue if it can safely represent the value,
 * otherwise a DoubleValue is returned.
 */
function toNumber(serializer, value) {
    return isSafeInteger(value) ? toInteger(value) : toDouble(serializer, value);
}

/**
 * @license
 * Copyright 2018 Google LLC
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
/** Used to represent a field transform on a mutation. */
class TransformOperation {
    constructor() {
        // Make sure that the structural type of `TransformOperation` is unique.
        // See https://github.com/microsoft/TypeScript/issues/5451
        this._ = undefined;
    }
}
/** Transforms a value into a server-generated timestamp. */
class ServerTimestampTransform extends TransformOperation {
}
/** Transforms an array value via a union operation. */
class ArrayUnionTransformOperation extends TransformOperation {
    constructor(elements) {
        super();
        this.elements = elements;
    }
}
/** Transforms an array value via a remove operation. */
class ArrayRemoveTransformOperation extends TransformOperation {
    constructor(elements) {
        super();
        this.elements = elements;
    }
}
/**
 * Implements the backend semantics for locally computed NUMERIC_ADD (increment)
 * transforms. Converts all field values to integers or doubles, but unlike the
 * backend does not cap integer values at 2^63. Instead, JavaScript number
 * arithmetic is used and precision loss can occur for values greater than 2^53.
 */
class NumericIncrementTransformOperation extends TransformOperation {
    constructor(serializer, operand) {
        super();
        this.serializer = serializer;
        this.operand = operand;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
/** A field path and the TransformOperation to perform upon it. */
class FieldTransform {
    constructor(field, transform) {
        this.field = field;
        this.transform = transform;
    }
}
/**
 * Encodes a precondition for a mutation. This follows the model that the
 * backend accepts with the special case of an explicit "empty" precondition
 * (meaning no precondition).
 */
class Precondition {
    constructor(updateTime, exists) {
        this.updateTime = updateTime;
        this.exists = exists;
    }
    /** Creates a new empty Precondition. */
    static none() {
        return new Precondition();
    }
    /** Creates a new Precondition with an exists flag. */
    static exists(exists) {
        return new Precondition(undefined, exists);
    }
    /** Creates a new Precondition based on a version a document exists at. */
    static updateTime(version) {
        return new Precondition(version);
    }
    /** Returns whether this Precondition is empty. */
    get isNone() {
        return this.updateTime === undefined && this.exists === undefined;
    }
    isEqual(other) {
        return (this.exists === other.exists &&
            (this.updateTime
                ? !!other.updateTime && this.updateTime.isEqual(other.updateTime)
                : !other.updateTime));
    }
}
/**
 * A mutation describes a self-contained change to a document. Mutations can
 * create, replace, delete, and update subsets of documents.
 *
 * Mutations not only act on the value of the document but also its version.
 *
 * For local mutations (mutations that haven't been committed yet), we preserve
 * the existing version for Set and Patch mutations. For Delete mutations, we
 * reset the version to 0.
 *
 * Here's the expected transition table.
 *
 * MUTATION           APPLIED TO            RESULTS IN
 *
 * SetMutation        Document(v3)          Document(v3)
 * SetMutation        NoDocument(v3)        Document(v0)
 * SetMutation        InvalidDocument(v0)   Document(v0)
 * PatchMutation      Document(v3)          Document(v3)
 * PatchMutation      NoDocument(v3)        NoDocument(v3)
 * PatchMutation      InvalidDocument(v0)   UnknownDocument(v3)
 * DeleteMutation     Document(v3)          NoDocument(v0)
 * DeleteMutation     NoDocument(v3)        NoDocument(v0)
 * DeleteMutation     InvalidDocument(v0)   NoDocument(v0)
 *
 * For acknowledged mutations, we use the updateTime of the WriteResponse as
 * the resulting version for Set and Patch mutations. As deletes have no
 * explicit update time, we use the commitTime of the WriteResponse for
 * Delete mutations.
 *
 * If a mutation is acknowledged by the backend but fails the precondition check
 * locally, we transition to an `UnknownDocument` and rely on Watch to send us
 * the updated version.
 *
 * Field transforms are used only with Patch and Set Mutations. We use the
 * `updateTransforms` message to store transforms, rather than the `transforms`s
 * messages.
 *
 * ## Subclassing Notes
 *
 * Every type of mutation needs to implement its own applyToRemoteDocument() and
 * applyToLocalView() to implement the actual behavior of applying the mutation
 * to some source document (see `setMutationApplyToRemoteDocument()` for an
 * example).
 */
class Mutation {
}
/**
 * A mutation that creates or replaces the document at the given key with the
 * object value contents.
 */
class SetMutation extends Mutation {
    constructor(key, value, precondition, fieldTransforms = []) {
        super();
        this.key = key;
        this.value = value;
        this.precondition = precondition;
        this.fieldTransforms = fieldTransforms;
        this.type = 0 /* MutationType.Set */;
    }
    getFieldMask() {
        return null;
    }
}
/**
 * A mutation that modifies fields of the document at the given key with the
 * given values. The values are applied through a field mask:
 *
 *  * When a field is in both the mask and the values, the corresponding field
 *    is updated.
 *  * When a field is in neither the mask nor the values, the corresponding
 *    field is unmodified.
 *  * When a field is in the mask but not in the values, the corresponding field
 *    is deleted.
 *  * When a field is not in the mask but is in the values, the values map is
 *    ignored.
 */
class PatchMutation extends Mutation {
    constructor(key, data, fieldMask, precondition, fieldTransforms = []) {
        super();
        this.key = key;
        this.data = data;
        this.fieldMask = fieldMask;
        this.precondition = precondition;
        this.fieldTransforms = fieldTransforms;
        this.type = 1 /* MutationType.Patch */;
    }
    getFieldMask() {
        return this.fieldMask;
    }
}
/** A mutation that deletes the document at the given key. */
class DeleteMutation extends Mutation {
    constructor(key, precondition) {
        super();
        this.key = key;
        this.precondition = precondition;
        this.type = 2 /* MutationType.Delete */;
        this.fieldTransforms = [];
    }
    getFieldMask() {
        return null;
    }
}
/**
 * A mutation that verifies the existence of the document at the given key with
 * the provided precondition.
 *
 * The `verify` operation is only used in Transactions, and this class serves
 * primarily to facilitate serialization into protos.
 */
class VerifyMutation extends Mutation {
    constructor(key, precondition) {
        super();
        this.key = key;
        this.precondition = precondition;
        this.type = 3 /* MutationType.Verify */;
        this.fieldTransforms = [];
    }
    getFieldMask() {
        return null;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
const DIRECTIONS = (() => {
    const dirs = {};
    dirs["asc" /* Direction.ASCENDING */] = 'ASCENDING';
    dirs["desc" /* Direction.DESCENDING */] = 'DESCENDING';
    return dirs;
})();
const OPERATORS = (() => {
    const ops = {};
    ops["<" /* Operator.LESS_THAN */] = 'LESS_THAN';
    ops["<=" /* Operator.LESS_THAN_OR_EQUAL */] = 'LESS_THAN_OR_EQUAL';
    ops[">" /* Operator.GREATER_THAN */] = 'GREATER_THAN';
    ops[">=" /* Operator.GREATER_THAN_OR_EQUAL */] = 'GREATER_THAN_OR_EQUAL';
    ops["==" /* Operator.EQUAL */] = 'EQUAL';
    ops["!=" /* Operator.NOT_EQUAL */] = 'NOT_EQUAL';
    ops["array-contains" /* Operator.ARRAY_CONTAINS */] = 'ARRAY_CONTAINS';
    ops["in" /* Operator.IN */] = 'IN';
    ops["not-in" /* Operator.NOT_IN */] = 'NOT_IN';
    ops["array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */] = 'ARRAY_CONTAINS_ANY';
    return ops;
})();
const COMPOSITE_OPERATORS = (() => {
    const ops = {};
    ops["and" /* CompositeOperator.AND */] = 'AND';
    ops["or" /* CompositeOperator.OR */] = 'OR';
    return ops;
})();
function assertPresent(value, description) {
}
/**
 * This class generates JsonObject values for the Datastore API suitable for
 * sending to either GRPC stub methods or via the JSON/HTTP REST API.
 *
 * The serializer supports both Protobuf.js and Proto3 JSON formats. By
 * setting `useProto3Json` to true, the serializer will use the Proto3 JSON
 * format.
 *
 * For a description of the Proto3 JSON format check
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 *
 * TODO(klimt): We can remove the databaseId argument if we keep the full
 * resource name in documents.
 */
class JsonProtoSerializer {
    constructor(databaseId, useProto3Json) {
        this.databaseId = databaseId;
        this.useProto3Json = useProto3Json;
    }
}
/**
 * Returns a value for a number (or null) that's appropriate to put into
 * a google.protobuf.Int32Value proto.
 * DO NOT USE THIS FOR ANYTHING ELSE.
 * This method cheats. It's typed as returning "number" because that's what
 * our generated proto interfaces say Int32Value must be. But GRPC actually
 * expects a { value: <number> } struct.
 */
function toInt32Proto(serializer, val) {
    if (serializer.useProto3Json || isNullOrUndefined(val)) {
        return val;
    }
    else {
        return { value: val };
    }
}
/**
 * Returns a value for a Date that's appropriate to put into a proto.
 */
function toTimestamp(serializer, timestamp) {
    if (serializer.useProto3Json) {
        // Serialize to ISO-8601 date format, but with full nano resolution.
        // Since JS Date has only millis, let's only use it for the seconds and
        // then manually add the fractions to the end.
        const jsDateStr = new Date(timestamp.seconds * 1000).toISOString();
        // Remove .xxx frac part and Z in the end.
        const strUntilSeconds = jsDateStr.replace(/\.\d*/, '').replace('Z', '');
        // Pad the fraction out to 9 digits (nanos).
        const nanoStr = ('000000000' + timestamp.nanoseconds).slice(-9);
        return `${strUntilSeconds}.${nanoStr}Z`;
    }
    else {
        return {
            seconds: '' + timestamp.seconds,
            nanos: timestamp.nanoseconds
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        };
    }
}
/**
 * Returns a Timestamp typed object given protobuf timestamp value.
 */
function fromTimestamp(date) {
    const timestamp = normalizeTimestamp(date);
    return new Timestamp(timestamp.seconds, timestamp.nanos);
}
/**
 * Returns a value for bytes that's appropriate to put in a proto.
 *
 * Visible for testing.
 */
function toBytes(serializer, bytes) {
    if (serializer.useProto3Json) {
        return bytes.toBase64();
    }
    else {
        return bytes.toUint8Array();
    }
}
function toVersion(serializer, version) {
    return toTimestamp(serializer, version.toTimestamp());
}
function fromVersion(version) {
    hardAssert(!!version, 0xc050);
    return SnapshotVersion.fromTimestamp(fromTimestamp(version));
}
function toResourceName(databaseId, path) {
    return toResourcePath(databaseId, path).canonicalString();
}
function toResourcePath(databaseId, path) {
    const resourcePath = fullyQualifiedPrefixPath(databaseId).child('documents');
    return path === undefined ? resourcePath : resourcePath.child(path);
}
function fromResourceName(name) {
    const resource = ResourcePath.fromString(name);
    hardAssert(isValidResourceName(resource), 0x27ce, { key: resource.toString() });
    return resource;
}
function toName(serializer, key) {
    return toResourceName(serializer.databaseId, key.path);
}
function fromName(serializer, name) {
    const resource = fromResourceName(name);
    if (resource.get(1) !== serializer.databaseId.projectId) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, 'Tried to deserialize key from different project: ' +
            resource.get(1) +
            ' vs ' +
            serializer.databaseId.projectId);
    }
    if (resource.get(3) !== serializer.databaseId.database) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, 'Tried to deserialize key from different database: ' +
            resource.get(3) +
            ' vs ' +
            serializer.databaseId.database);
    }
    return new DocumentKey(extractLocalPathFromResourceName(resource));
}
function toQueryPath(serializer, path) {
    return toResourceName(serializer.databaseId, path);
}
function getEncodedDatabaseId(serializer) {
    const path = new ResourcePath([
        'projects',
        serializer.databaseId.projectId,
        'databases',
        serializer.databaseId.database
    ]);
    return path.canonicalString();
}
function fullyQualifiedPrefixPath(databaseId) {
    return new ResourcePath([
        'projects',
        databaseId.projectId,
        'databases',
        databaseId.database
    ]);
}
function extractLocalPathFromResourceName(resourceName) {
    hardAssert(resourceName.length > 4 && resourceName.get(4) === 'documents', 0x71a3, { key: resourceName.toString() });
    return resourceName.popFirst(5);
}
/** Creates a Document proto from key and fields (but no create/update time) */
function toMutationDocument(serializer, key, fields) {
    return {
        name: toName(serializer, key),
        fields: fields.value.mapValue.fields
    };
}
function fromPipelineResponse(serializer, proto, document) {
    const output = {};
    if (proto.transaction?.length) {
        output.transaction = proto.transaction;
    }
    const executionTime = proto.executionTime
        ? fromVersion(proto.executionTime)
        : undefined;
    output.executionTime = executionTime;
    if (!!document) {
        output.key = document.name
            ? fromName(serializer, document.name)
            : undefined;
        output.fields = new ObjectValue({ mapValue: { fields: document.fields } });
        output.createTime = document.createTime
            ? fromVersion(document.createTime)
            : undefined;
        output.updateTime = document.updateTime
            ? fromVersion(document.updateTime)
            : undefined;
    }
    return output;
}
function fromDocument(serializer, document, hasCommittedMutations) {
    const key = fromName(serializer, document.name);
    const version = fromVersion(document.updateTime);
    // If we read a document from persistence that is missing createTime, it's due
    // to older SDK versions not storing this information. In such cases, we'll
    // set the createTime to zero. This can be removed in the long term.
    const createTime = document.createTime
        ? fromVersion(document.createTime)
        : SnapshotVersion.min();
    const data = new ObjectValue({ mapValue: { fields: document.fields } });
    const result = MutableDocument.newFoundDocument(key, version, createTime, data);
    if (hasCommittedMutations) {
        result.setHasCommittedMutations();
    }
    return hasCommittedMutations ? result.setHasCommittedMutations() : result;
}
function fromFound(serializer, doc) {
    hardAssert(!!doc.found, 0xaa33);
    assertPresent(doc.found.name);
    assertPresent(doc.found.updateTime);
    const key = fromName(serializer, doc.found.name);
    const version = fromVersion(doc.found.updateTime);
    const createTime = doc.found.createTime
        ? fromVersion(doc.found.createTime)
        : SnapshotVersion.min();
    const data = new ObjectValue({ mapValue: { fields: doc.found.fields } });
    return MutableDocument.newFoundDocument(key, version, createTime, data);
}
function fromMissing(serializer, result) {
    hardAssert(!!result.missing, 0x0f36);
    hardAssert(!!result.readTime, 0x5995);
    const key = fromName(serializer, result.missing);
    const version = fromVersion(result.readTime);
    return MutableDocument.newNoDocument(key, version);
}
function fromBatchGetDocumentsResponse(serializer, result) {
    if ('found' in result) {
        return fromFound(serializer, result);
    }
    else if ('missing' in result) {
        return fromMissing(serializer, result);
    }
    return fail(0x1c42, { result });
}
function toMutation(serializer, mutation) {
    let result;
    if (mutation instanceof SetMutation) {
        result = {
            update: toMutationDocument(serializer, mutation.key, mutation.value)
        };
    }
    else if (mutation instanceof DeleteMutation) {
        result = { delete: toName(serializer, mutation.key) };
    }
    else if (mutation instanceof PatchMutation) {
        result = {
            update: toMutationDocument(serializer, mutation.key, mutation.data),
            updateMask: toDocumentMask(mutation.fieldMask)
        };
    }
    else if (mutation instanceof VerifyMutation) {
        result = {
            verify: toName(serializer, mutation.key)
        };
    }
    else {
        return fail(0x40d7, {
            mutationType: mutation.type
        });
    }
    if (mutation.fieldTransforms.length > 0) {
        result.updateTransforms = mutation.fieldTransforms.map(transform => toFieldTransform(serializer, transform));
    }
    if (!mutation.precondition.isNone) {
        result.currentDocument = toPrecondition(serializer, mutation.precondition);
    }
    return result;
}
function toPrecondition(serializer, precondition) {
    if (precondition.updateTime !== undefined) {
        return {
            updateTime: toVersion(serializer, precondition.updateTime)
        };
    }
    else if (precondition.exists !== undefined) {
        return { exists: precondition.exists };
    }
    else {
        return fail(0x6b69);
    }
}
function toFieldTransform(serializer, fieldTransform) {
    const transform = fieldTransform.transform;
    if (transform instanceof ServerTimestampTransform) {
        return {
            fieldPath: fieldTransform.field.canonicalString(),
            setToServerValue: 'REQUEST_TIME'
        };
    }
    else if (transform instanceof ArrayUnionTransformOperation) {
        return {
            fieldPath: fieldTransform.field.canonicalString(),
            appendMissingElements: {
                values: transform.elements
            }
        };
    }
    else if (transform instanceof ArrayRemoveTransformOperation) {
        return {
            fieldPath: fieldTransform.field.canonicalString(),
            removeAllFromArray: {
                values: transform.elements
            }
        };
    }
    else if (transform instanceof NumericIncrementTransformOperation) {
        return {
            fieldPath: fieldTransform.field.canonicalString(),
            increment: transform.operand
        };
    }
    else {
        throw fail(0x51c2, {
            transform: fieldTransform.transform
        });
    }
}
function toQueryTarget(serializer, target) {
    // Dissect the path into parent, collectionId, and optional key filter.
    const queryTarget = { structuredQuery: {} };
    const path = target.path;
    let parent;
    if (target.collectionGroup !== null) {
        parent = path;
        queryTarget.structuredQuery.from = [
            {
                collectionId: target.collectionGroup,
                allDescendants: true
            }
        ];
    }
    else {
        parent = path.popLast();
        queryTarget.structuredQuery.from = [{ collectionId: path.lastSegment() }];
    }
    queryTarget.parent = toQueryPath(serializer, parent);
    const where = toFilters(target.filters);
    if (where) {
        queryTarget.structuredQuery.where = where;
    }
    const orderBy = toOrder(target.orderBy);
    if (orderBy) {
        queryTarget.structuredQuery.orderBy = orderBy;
    }
    const limit = toInt32Proto(serializer, target.limit);
    if (limit !== null) {
        queryTarget.structuredQuery.limit = limit;
    }
    if (target.startAt) {
        queryTarget.structuredQuery.startAt = toStartAtCursor(target.startAt);
    }
    if (target.endAt) {
        queryTarget.structuredQuery.endAt = toEndAtCursor(target.endAt);
    }
    return { queryTarget, parent };
}
function toRunAggregationQueryRequest(serializer, target, aggregates, skipAliasing) {
    const { queryTarget, parent } = toQueryTarget(serializer, target);
    const aliasMap = {};
    const aggregations = [];
    let aggregationNum = 0;
    aggregates.forEach(aggregate => {
        // Map all client-side aliases to a unique short-form
        // alias. This avoids issues with client-side aliases that
        // exceed the 1500-byte string size limit.
        const serverAlias = skipAliasing
            ? aggregate.alias
            : `aggregate_${aggregationNum++}`;
        aliasMap[serverAlias] = aggregate.alias;
        if (aggregate.aggregateType === 'count') {
            aggregations.push({
                alias: serverAlias,
                count: {}
            });
        }
        else if (aggregate.aggregateType === 'avg') {
            aggregations.push({
                alias: serverAlias,
                avg: {
                    field: toFieldPathReference(aggregate.fieldPath)
                }
            });
        }
        else if (aggregate.aggregateType === 'sum') {
            aggregations.push({
                alias: serverAlias,
                sum: {
                    field: toFieldPathReference(aggregate.fieldPath)
                }
            });
        }
    });
    return {
        request: {
            structuredAggregationQuery: {
                aggregations,
                structuredQuery: queryTarget.structuredQuery
            },
            parent: queryTarget.parent
        },
        aliasMap,
        parent
    };
}
function toFilters(filters) {
    if (filters.length === 0) {
        return;
    }
    return toFilter(CompositeFilter.create(filters, "and" /* CompositeOperator.AND */));
}
function toOrder(orderBys) {
    if (orderBys.length === 0) {
        return;
    }
    return orderBys.map(order => toPropertyOrder(order));
}
function toStartAtCursor(cursor) {
    return {
        before: cursor.inclusive,
        values: cursor.position
    };
}
function toEndAtCursor(cursor) {
    return {
        before: !cursor.inclusive,
        values: cursor.position
    };
}
// visible for testing
function toDirection(dir) {
    return DIRECTIONS[dir];
}
// visible for testing
function toOperatorName(op) {
    return OPERATORS[op];
}
function toCompositeOperatorName(op) {
    return COMPOSITE_OPERATORS[op];
}
function toFieldPathReference(path) {
    return { fieldPath: path.canonicalString() };
}
// visible for testing
function toPropertyOrder(orderBy) {
    return {
        field: toFieldPathReference(orderBy.field),
        direction: toDirection(orderBy.dir)
    };
}
// visible for testing
function toFilter(filter) {
    if (filter instanceof FieldFilter) {
        return toUnaryOrFieldFilter(filter);
    }
    else if (filter instanceof CompositeFilter) {
        return toCompositeFilter(filter);
    }
    else {
        return fail(0xd65d, { filter });
    }
}
function toCompositeFilter(filter) {
    const protos = filter.getFilters().map(filter => toFilter(filter));
    if (protos.length === 1) {
        return protos[0];
    }
    return {
        compositeFilter: {
            op: toCompositeOperatorName(filter.op),
            filters: protos
        }
    };
}
function toUnaryOrFieldFilter(filter) {
    if (filter.op === "==" /* Operator.EQUAL */) {
        if (isNanValue(filter.value)) {
            return {
                unaryFilter: {
                    field: toFieldPathReference(filter.field),
                    op: 'IS_NAN'
                }
            };
        }
        else if (isNullValue(filter.value)) {
            return {
                unaryFilter: {
                    field: toFieldPathReference(filter.field),
                    op: 'IS_NULL'
                }
            };
        }
    }
    else if (filter.op === "!=" /* Operator.NOT_EQUAL */) {
        if (isNanValue(filter.value)) {
            return {
                unaryFilter: {
                    field: toFieldPathReference(filter.field),
                    op: 'IS_NOT_NAN'
                }
            };
        }
        else if (isNullValue(filter.value)) {
            return {
                unaryFilter: {
                    field: toFieldPathReference(filter.field),
                    op: 'IS_NOT_NULL'
                }
            };
        }
    }
    return {
        fieldFilter: {
            field: toFieldPathReference(filter.field),
            op: toOperatorName(filter.op),
            value: filter.value
        }
    };
}
function toDocumentMask(fieldMask) {
    const canonicalFields = [];
    fieldMask.fields.forEach(field => canonicalFields.push(field.canonicalString()));
    return {
        fieldPaths: canonicalFields
    };
}
function isValidResourceName(path) {
    // Resource names have at least 4 components (project ID, database ID)
    return (path.length >= 4 &&
        path.get(0) === 'projects' &&
        path.get(2) === 'databases');
}
function isProtoValueSerializable(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
value) {
    return (!!value &&
        typeof value._toProto === 'function' &&
        value._protoValueType === 'ProtoValue');
}
function toMapValue(serializer, input) {
    const map = { fields: {} };
    input.forEach((exp, key) => {
        if (typeof key !== 'string') {
            throw new Error(`Cannot encode map with non-string key: ${key}`);
        }
        map.fields[key] = exp._toProto(serializer);
    });
    return {
        mapValue: map
    };
}
function toStringValue(value) {
    return { stringValue: value };
}
function toPipelineValue(value) {
    return { pipelineValue: value };
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
function newSerializer(databaseId) {
    return new JsonProtoSerializer(databaseId, /* useProto3Json= */ true);
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Datastore and its related methods are a wrapper around the external Google
 * Cloud Datastore grpc API, which provides an interface that is more convenient
 * for the rest of the client SDK architecture to consume.
 */
class Datastore {
}
/**
 * An implementation of Datastore that exposes additional state for internal
 * consumption.
 */
class DatastoreImpl extends Datastore {
    constructor(authCredentials, appCheckCredentials, connection, serializer) {
        super();
        this.authCredentials = authCredentials;
        this.appCheckCredentials = appCheckCredentials;
        this.connection = connection;
        this.serializer = serializer;
        this.terminated = false;
    }
    verifyInitialized() {
        if (this.terminated) {
            throw new FirestoreError(Code.FAILED_PRECONDITION, 'The client has already been terminated.');
        }
    }
    /** Invokes the provided RPC with auth and AppCheck tokens. */
    invokeRPC(rpcName, databaseId, resourcePath, request) {
        this.verifyInitialized();
        return Promise.all([
            this.authCredentials.getToken(),
            this.appCheckCredentials.getToken()
        ])
            .then(([authToken, appCheckToken]) => {
            return this.connection.invokeRPC(rpcName, toResourcePath(databaseId, resourcePath), request, authToken, appCheckToken);
        })
            .catch((error) => {
            if (error.name === 'FirebaseError') {
                if (error.code === Code.UNAUTHENTICATED) {
                    this.authCredentials.invalidateToken();
                    this.appCheckCredentials.invalidateToken();
                }
                throw error;
            }
            else {
                throw new FirestoreError(Code.UNKNOWN, error.toString());
            }
        });
    }
    /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
    invokeStreamingRPC(rpcName, databaseId, resourcePath, request, expectedResponseCount) {
        this.verifyInitialized();
        return Promise.all([
            this.authCredentials.getToken(),
            this.appCheckCredentials.getToken()
        ])
            .then(([authToken, appCheckToken]) => {
            return this.connection.invokeStreamingRPC(rpcName, toResourcePath(databaseId, resourcePath), request, authToken, appCheckToken, expectedResponseCount);
        })
            .catch((error) => {
            if (error.name === 'FirebaseError') {
                if (error.code === Code.UNAUTHENTICATED) {
                    this.authCredentials.invalidateToken();
                    this.appCheckCredentials.invalidateToken();
                }
                throw error;
            }
            else {
                throw new FirestoreError(Code.UNKNOWN, error.toString());
            }
        });
    }
    terminate() {
        this.terminated = true;
        this.connection.terminate();
    }
}
// TODO(firestorexp): Make sure there is only one Datastore instance per
// firestore-exp client.
function newDatastore(authCredentials, appCheckCredentials, connection, serializer) {
    return new DatastoreImpl(authCredentials, appCheckCredentials, connection, serializer);
}
async function invokeCommitRpc(datastore, mutations) {
    const datastoreImpl = debugCast(datastore);
    const request = {
        writes: mutations.map(m => toMutation(datastoreImpl.serializer, m))
    };
    await datastoreImpl.invokeRPC('Commit', datastoreImpl.serializer.databaseId, ResourcePath.emptyPath(), request);
}
async function invokeBatchGetDocumentsRpc(datastore, keys) {
    const datastoreImpl = debugCast(datastore);
    const request = {
        documents: keys.map(k => toName(datastoreImpl.serializer, k))
    };
    const response = await datastoreImpl.invokeStreamingRPC('BatchGetDocuments', datastoreImpl.serializer.databaseId, ResourcePath.emptyPath(), request, keys.length);
    const docs = new Map();
    response.forEach(proto => {
        const doc = fromBatchGetDocumentsResponse(datastoreImpl.serializer, proto);
        docs.set(doc.key.toString(), doc);
    });
    const result = [];
    keys.forEach(key => {
        const doc = docs.get(key.toString());
        hardAssert(!!doc, 0xd7c2, {
            key
        });
        result.push(doc);
    });
    return result;
}
async function invokeExecutePipeline(datastore, structuredPipeline) {
    const datastoreImpl = debugCast(datastore);
    const executePipelineRequest = {
        database: getEncodedDatabaseId(datastoreImpl.serializer),
        structuredPipeline: structuredPipeline._toProto(datastoreImpl.serializer)
    };
    const response = await datastoreImpl.invokeStreamingRPC('ExecutePipeline', datastoreImpl.serializer.databaseId, ResourcePath.emptyPath(), executePipelineRequest);
    const result = [];
    response.forEach(proto => {
        if (!proto.results || proto.results.length === 0) {
            result.push(fromPipelineResponse(datastoreImpl.serializer, proto));
        }
        else {
            return proto.results.forEach(document => result.push(fromPipelineResponse(datastoreImpl.serializer, proto, document)));
        }
    });
    return result;
}
async function invokeRunQueryRpc(datastore, query) {
    const datastoreImpl = debugCast(datastore);
    const { queryTarget, parent } = toQueryTarget(datastoreImpl.serializer, queryToTarget(query));
    const response = await datastoreImpl.invokeStreamingRPC('RunQuery', datastoreImpl.serializer.databaseId, parent, {
        structuredQuery: queryTarget.structuredQuery
    });
    return (response
        // Omit RunQueryResponses that only contain readTimes.
        .filter(proto => !!proto.document)
        .map(proto => fromDocument(datastoreImpl.serializer, proto.document, undefined)));
}
async function invokeRunAggregationQueryRpc(datastore, query, aggregates) {
    const datastoreImpl = debugCast(datastore);
    const { request, aliasMap, parent } = toRunAggregationQueryRequest(datastoreImpl.serializer, queryToAggregateTarget(query), aggregates);
    if (!datastoreImpl.connection.shouldResourcePathBeIncludedInRequest) {
        delete request.parent;
    }
    const response = await datastoreImpl.invokeStreamingRPC('RunAggregationQuery', datastoreImpl.serializer.databaseId, parent, request, 
    /*expectedResponseCount=*/ 1);
    // Omit RunAggregationQueryResponse that only contain readTimes.
    const filteredResult = response.filter(proto => !!proto.result);
    hardAssert(filteredResult.length === 1, 0xfcd7);
    // Remap the short-form aliases that were sent to the server
    // to the client-side aliases. Users will access the results
    // using the client-side alias.
    const unmappedAggregateFields = filteredResult[0].result?.aggregateFields;
    const remappedFields = Object.keys(unmappedAggregateFields).reduce((accumulator, key) => {
        accumulator[aliasMap[key]] = unmappedAggregateFields[key];
        return accumulator;
    }, {});
    return remappedFields;
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
const LOG_TAG = 'ComponentProvider';
/**
 * An instance map that ensures only one Datastore exists per Firestore
 * instance.
 */
const datastoreInstances = new Map();
/**
 * Returns an initialized and started Datastore for the given Firestore
 * instance. Callers must invoke removeComponents() when the Firestore
 * instance is terminated.
 */
function getDatastore(firestore) {
    if (firestore._terminated) {
        throw new FirestoreError(Code.FAILED_PRECONDITION, 'The client has already been terminated.');
    }
    if (!datastoreInstances.has(firestore)) {
        logDebug(LOG_TAG, 'Initializing Datastore');
        const databaseInfo = makeDatabaseInfo(firestore._databaseId, firestore.app.options.appId || '', firestore._persistenceKey, firestore.app.options.apiKey, firestore._freezeSettings());
        const connection = newConnection(databaseInfo);
        const serializer = newSerializer(firestore._databaseId);
        const datastore = newDatastore(firestore._authCredentials, firestore._appCheckCredentials, connection, serializer);
        datastoreInstances.set(firestore, datastore);
    }
    return datastoreInstances.get(firestore);
}
/**
 * Removes all components associated with the provided instance. Must be called
 * when the `Firestore` instance is terminated.
 */
function removeComponents(firestore) {
    const datastore = datastoreInstances.get(firestore);
    if (datastore) {
        logDebug(LOG_TAG, 'Removing Datastore');
        datastoreInstances.delete(firestore);
        datastore.terminate();
    }
}
function makeDatabaseInfo(databaseId, appId, persistenceKey, apiKey, settings) {
    return new DatabaseInfo(databaseId, appId, persistenceKey, settings.host, settings.ssl, settings.experimentalForceLongPolling, settings.experimentalAutoDetectLongPolling, cloneLongPollingOptions(settings.experimentalLongPollingOptions), settings.useFetchStreams, settings.isUsingEmulator, apiKey);
}

/**
 * @license
 * Copyright 2018 Google LLC
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
const LRU_COLLECTION_DISABLED = -1;
const LRU_DEFAULT_CACHE_SIZE_BYTES = 40 * 1024 * 1024;

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
const LRU_MINIMUM_CACHE_SIZE_BYTES = 1 * 1024 * 1024;

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
// settings() defaults:
const DEFAULT_HOST = 'firestore.googleapis.com';
const DEFAULT_SSL = true;
// The minimum long-polling timeout is hardcoded on the server. The value here
// should be kept in sync with the value used by the server, as the server will
// silently ignore a value below the minimum and fall back to the default.
// Googlers see b/266868871 for relevant discussion.
const MIN_LONG_POLLING_TIMEOUT_SECONDS = 5;
// No maximum long-polling timeout is configured in the server, and defaults to
// 30 seconds, which is what Watch appears to use.
// Googlers see b/266868871 for relevant discussion.
const MAX_LONG_POLLING_TIMEOUT_SECONDS = 30;
// Whether long-polling auto-detected is enabled by default.
const DEFAULT_AUTO_DETECT_LONG_POLLING = true;
/**
 * A concrete type describing all the values that can be applied via a
 * user-supplied `FirestoreSettings` object. This is a separate type so that
 * defaults can be supplied and the value can be checked for equality.
 */
class FirestoreSettingsImpl {
    constructor(settings) {
        if (settings.host === undefined) {
            if (settings.ssl !== undefined) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
            }
            this.host = DEFAULT_HOST;
            this.ssl = DEFAULT_SSL;
        }
        else {
            this.host = settings.host;
            this.ssl = settings.ssl ?? DEFAULT_SSL;
        }
        this.isUsingEmulator = settings.emulatorOptions !== undefined;
        this.credentials = settings.credentials;
        this.ignoreUndefinedProperties = !!settings.ignoreUndefinedProperties;
        this.localCache = settings.localCache;
        if (settings.cacheSizeBytes === undefined) {
            this.cacheSizeBytes = LRU_DEFAULT_CACHE_SIZE_BYTES;
        }
        else {
            if (settings.cacheSizeBytes !== LRU_COLLECTION_DISABLED &&
                settings.cacheSizeBytes < LRU_MINIMUM_CACHE_SIZE_BYTES) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, `cacheSizeBytes must be at least ${LRU_MINIMUM_CACHE_SIZE_BYTES}`);
            }
            else {
                this.cacheSizeBytes = settings.cacheSizeBytes;
            }
        }
        validateIsNotUsedTogether('experimentalForceLongPolling', settings.experimentalForceLongPolling, 'experimentalAutoDetectLongPolling', settings.experimentalAutoDetectLongPolling);
        this.experimentalForceLongPolling = !!settings.experimentalForceLongPolling;
        if (this.experimentalForceLongPolling) {
            this.experimentalAutoDetectLongPolling = false;
        }
        else if (settings.experimentalAutoDetectLongPolling === undefined) {
            this.experimentalAutoDetectLongPolling = DEFAULT_AUTO_DETECT_LONG_POLLING;
        }
        else {
            // For backwards compatibility, coerce the value to boolean even though
            // the TypeScript compiler has narrowed the type to boolean already.
            // noinspection PointlessBooleanExpressionJS
            this.experimentalAutoDetectLongPolling =
                !!settings.experimentalAutoDetectLongPolling;
        }
        this.experimentalLongPollingOptions = cloneLongPollingOptions(settings.experimentalLongPollingOptions ?? {});
        validateLongPollingOptions(this.experimentalLongPollingOptions);
        this.useFetchStreams = !!settings.useFetchStreams;
    }
    isEqual(other) {
        return (this.host === other.host &&
            this.ssl === other.ssl &&
            this.credentials === other.credentials &&
            this.cacheSizeBytes === other.cacheSizeBytes &&
            this.experimentalForceLongPolling ===
                other.experimentalForceLongPolling &&
            this.experimentalAutoDetectLongPolling ===
                other.experimentalAutoDetectLongPolling &&
            longPollingOptionsEqual(this.experimentalLongPollingOptions, other.experimentalLongPollingOptions) &&
            this.ignoreUndefinedProperties === other.ignoreUndefinedProperties &&
            this.useFetchStreams === other.useFetchStreams);
    }
}
function validateLongPollingOptions(options) {
    if (options.timeoutSeconds !== undefined) {
        if (isNaN(options.timeoutSeconds)) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, `invalid long polling timeout: ` +
                `${options.timeoutSeconds} (must not be NaN)`);
        }
        if (options.timeoutSeconds < MIN_LONG_POLLING_TIMEOUT_SECONDS) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, `invalid long polling timeout: ${options.timeoutSeconds} ` +
                `(minimum allowed value is ${MIN_LONG_POLLING_TIMEOUT_SECONDS})`);
        }
        if (options.timeoutSeconds > MAX_LONG_POLLING_TIMEOUT_SECONDS) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, `invalid long polling timeout: ${options.timeoutSeconds} ` +
                `(maximum allowed value is ${MAX_LONG_POLLING_TIMEOUT_SECONDS})`);
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
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */
class Firestore {
    /** @hideconstructor */
    constructor(_authCredentials, _appCheckCredentials, _databaseId, _app) {
        this._authCredentials = _authCredentials;
        this._appCheckCredentials = _appCheckCredentials;
        this._databaseId = _databaseId;
        this._app = _app;
        /**
         * Whether it's a Firestore or Firestore Lite instance.
         */
        this.type = 'firestore-lite';
        this._persistenceKey = '(lite)';
        this._settings = new FirestoreSettingsImpl({});
        this._settingsFrozen = false;
        this._emulatorOptions = {};
        // A task that is assigned when the terminate() is invoked and resolved when
        // all components have shut down. Otherwise, Firestore is not terminated,
        // which can mean either the FirestoreClient is in the process of starting,
        // or restarting.
        this._terminateTask = 'notTerminated';
    }
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */
    get app() {
        if (!this._app) {
            throw new FirestoreError(Code.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is " +
                'not available');
        }
        return this._app;
    }
    get _initialized() {
        return this._settingsFrozen;
    }
    get _terminated() {
        return this._terminateTask !== 'notTerminated';
    }
    _setSettings(settings) {
        if (this._settingsFrozen) {
            throw new FirestoreError(Code.FAILED_PRECONDITION, 'Firestore has already been started and its settings can no longer ' +
                'be changed. You can only modify settings before calling any other ' +
                'methods on a Firestore object.');
        }
        this._settings = new FirestoreSettingsImpl(settings);
        this._emulatorOptions = settings.emulatorOptions || {};
        if (settings.credentials !== undefined) {
            this._authCredentials = makeAuthCredentialsProvider(settings.credentials);
        }
    }
    _getSettings() {
        return this._settings;
    }
    _getEmulatorOptions() {
        return this._emulatorOptions;
    }
    _freezeSettings() {
        this._settingsFrozen = true;
        return this._settings;
    }
    _delete() {
        // The `_terminateTask` must be assigned future that completes when
        // terminate is complete. The existence of this future puts SDK in state
        // that will not accept further API interaction.
        if (this._terminateTask === 'notTerminated') {
            this._terminateTask = this._terminate();
        }
        return this._terminateTask;
    }
    async _restart() {
        // The `_terminateTask` must equal 'notTerminated' after restart to
        // signal that client is in a state that accepts API calls.
        if (this._terminateTask === 'notTerminated') {
            await this._terminate();
        }
        else {
            this._terminateTask = 'notTerminated';
        }
    }
    /** Returns a JSON-serializable representation of this `Firestore` instance. */
    toJSON() {
        return {
            app: this._app,
            databaseId: this._databaseId,
            settings: this._settings
        };
    }
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */
    _terminate() {
        removeComponents(this);
        return Promise.resolve();
    }
}
function initializeFirestore(app, settings, databaseId) {
    if (!databaseId) {
        databaseId = DEFAULT_DATABASE_NAME;
    }
    const provider = _getProvider(app, 'firestore/lite');
    if (provider.isInitialized(databaseId)) {
        throw new FirestoreError(Code.FAILED_PRECONDITION, 'Firestore can only be initialized once per app.');
    }
    return provider.initialize({
        options: settings,
        instanceIdentifier: databaseId
    });
}
function getFirestore(appOrDatabaseId, optionalDatabaseId) {
    const app = typeof appOrDatabaseId === 'object' ? appOrDatabaseId : getApp();
    const databaseId = typeof appOrDatabaseId === 'string'
        ? appOrDatabaseId
        : optionalDatabaseId || '(default)';
    const db = _getProvider(app, 'firestore/lite').getImmediate({
        identifier: databaseId
    });
    if (!db._initialized) {
        const emulator = getDefaultEmulatorHostnameAndPort('firestore');
        if (emulator) {
            connectFirestoreEmulator(db, ...emulator);
        }
    }
    return db;
}
/**
 * Modify this instance to communicate with the Cloud Firestore emulator.
 *
 * Note: This must be called before this instance has been used to do any
 * operations.
 *
 * @param firestore - The `Firestore` instance to configure to connect to the
 * emulator.
 * @param host - the emulator host (ex: localhost).
 * @param port - the emulator port (ex: 9000).
 * @param options.mockUserToken - the mock auth token to use for unit testing
 * Security Rules.
 */
function connectFirestoreEmulator(firestore, host, port, options = {}) {
    firestore = cast(firestore, Firestore);
    const useSsl = isCloudWorkstation(host);
    const settings = firestore._getSettings();
    const existingConfig = {
        ...settings,
        emulatorOptions: firestore._getEmulatorOptions()
    };
    const newHostSetting = `${host}:${port}`;
    if (useSsl) {
        void pingServer(`https://${newHostSetting}`);
    }
    if (settings.host !== DEFAULT_HOST && settings.host !== newHostSetting) {
        logWarn('Host has been set in both settings() and connectFirestoreEmulator(), emulator host ' +
            'will be used.');
    }
    const newConfig = {
        ...settings,
        host: newHostSetting,
        ssl: useSsl,
        emulatorOptions: options
    };
    // No-op if the new configuration matches the current configuration. This supports SSR
    // enviornments which might call `connectFirestoreEmulator` multiple times as a standard practice.
    if (deepEqual(newConfig, existingConfig)) {
        return;
    }
    firestore._setSettings(newConfig);
    if (options.mockUserToken) {
        let token;
        let user;
        if (typeof options.mockUserToken === 'string') {
            token = options.mockUserToken;
            user = User.MOCK_USER;
        }
        else {
            // Let createMockUserToken validate first (catches common mistakes like
            // invalid field "uid" and missing field "sub" / "user_id".)
            token = createMockUserToken(options.mockUserToken, firestore._app?.options.projectId);
            const uid = options.mockUserToken.sub || options.mockUserToken.user_id;
            if (!uid) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
            }
            user = new User(uid);
        }
        firestore._authCredentials = new EmulatorAuthCredentialsProvider(new OAuthToken(token, user));
    }
}
/**
 * Terminates the provided `Firestore` instance.
 *
 * After calling `terminate()` only the `clearIndexedDbPersistence()` functions
 * may be used. Any other function will throw a `FirestoreError`. Termination
 * does not cancel any pending writes, and any promises that are awaiting a
 * response from the server will not be resolved.
 *
 * To restart after termination, create a new instance of `Firestore` with
 * {@link (getFirestore:1)}.
 *
 * Note: Under normal circumstances, calling `terminate()` is not required. This
 * function is useful only when you want to force this instance to release all of
 * its resources or in combination with {@link clearIndexedDbPersistence} to
 * ensure that all local state is destroyed between test runs.
 *
 * @param firestore - The `Firestore` instance to terminate.
 * @returns A `Promise` that is resolved when the instance has been successfully
 * terminated.
 */
function terminate(firestore) {
    firestore = cast(firestore, Firestore);
    _removeServiceInstance(firestore.app, 'firestore/lite');
    return firestore._delete();
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
 * A `Query` refers to a query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */
class Query {
    // This is the lite version of the Query class in the main SDK.
    /** @hideconstructor protected */
    constructor(firestore, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    converter, _query) {
        this.converter = converter;
        this._query = _query;
        /** The type of this Firestore reference. */
        this.type = 'query';
        this.firestore = firestore;
    }
    withConverter(converter) {
        return new Query(this.firestore, converter, this._query);
    }
}
/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */
class DocumentReference {
    /** @hideconstructor */
    constructor(firestore, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    converter, _key) {
        this.converter = converter;
        this._key = _key;
        /** The type of this Firestore reference. */
        this.type = 'document';
        this.firestore = firestore;
    }
    get _path() {
        return this._key.path;
    }
    /**
     * The document's identifier within its collection.
     */
    get id() {
        return this._key.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */
    get path() {
        return this._key.path.canonicalString();
    }
    /**
     * The collection this `DocumentReference` belongs to.
     */
    get parent() {
        return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
    }
    withConverter(converter) {
        return new DocumentReference(this.firestore, converter, this._key);
    }
    /**
     * Returns a JSON-serializable representation of this `DocumentReference` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON() {
        return {
            type: DocumentReference._jsonSchemaVersion,
            referencePath: this._key.toString()
        };
    }
    static fromJSON(firestore, json, converter) {
        if (validateJSON(json, DocumentReference._jsonSchema)) {
            return new DocumentReference(firestore, converter ? converter : null, new DocumentKey(ResourcePath.fromString(json.referencePath)));
        }
    }
}
DocumentReference._jsonSchemaVersion = 'firestore/documentReference/1.0';
DocumentReference._jsonSchema = {
    type: property('string', DocumentReference._jsonSchemaVersion),
    referencePath: property('string')
};
/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link (query:1)}).
 */
class CollectionReference extends Query {
    /** @hideconstructor */
    constructor(firestore, converter, _path) {
        super(firestore, converter, newQueryForPath(_path));
        this._path = _path;
        /** The type of this Firestore reference. */
        this.type = 'collection';
    }
    /** The collection's identifier. */
    get id() {
        return this._query.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */
    get path() {
        return this._query.path.canonicalString();
    }
    /**
     * A reference to the containing `DocumentReference` if this is a
     * subcollection. If this isn't a subcollection, the reference is null.
     */
    get parent() {
        const parentPath = this._path.popLast();
        if (parentPath.isEmpty()) {
            return null;
        }
        else {
            return new DocumentReference(this.firestore, 
            /* converter= */ null, new DocumentKey(parentPath));
        }
    }
    withConverter(converter) {
        return new CollectionReference(this.firestore, converter, this._path);
    }
}
function isCollectionReference(val) {
    return val instanceof CollectionReference;
}
function collection(parent, path, ...pathSegments) {
    parent = getModularInstance(parent);
    validateNonEmptyArgument('collection', 'path', path);
    if (parent instanceof Firestore) {
        const absolutePath = ResourcePath.fromString(path, ...pathSegments);
        validateCollectionPath(absolutePath);
        return new CollectionReference(parent, /* converter= */ null, absolutePath);
    }
    else {
        if (!(parent instanceof DocumentReference) &&
            !(parent instanceof CollectionReference)) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Expected first argument to collection() to be a CollectionReference, ' +
                'a DocumentReference or FirebaseFirestore');
        }
        const absolutePath = parent._path.child(ResourcePath.fromString(path, ...pathSegments));
        validateCollectionPath(absolutePath);
        return new CollectionReference(parent.firestore, 
        /* converter= */ null, absolutePath);
    }
}
// TODO(firestorelite): Consider using ErrorFactory -
// https://github.com/firebase/firebase-js-sdk/blob/0131e1f/packages/util/src/errors.ts#L106
/**
 * Creates and returns a new `Query` instance that includes all documents in the
 * database that are contained in a collection or subcollection with the
 * given `collectionId`.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionId - Identifies the collections to query over. Every
 * collection or subcollection with this ID as the last segment of its path
 * will be included. Cannot contain a slash.
 * @returns The created `Query`.
 */
function collectionGroup(firestore, collectionId) {
    firestore = cast(firestore, Firestore);
    validateNonEmptyArgument('collectionGroup', 'collection id', collectionId);
    if (collectionId.indexOf('/') >= 0) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid collection ID '${collectionId}' passed to function ` +
            `collectionGroup(). Collection IDs must not contain '/'.`);
    }
    return new Query(firestore, 
    /* converter= */ null, newQueryForCollectionGroup(collectionId));
}
function doc(parent, path, ...pathSegments) {
    parent = getModularInstance(parent);
    // We allow omission of 'pathString' but explicitly prohibit passing in both
    // 'undefined' and 'null'.
    if (arguments.length === 1) {
        path = AutoId.newId();
    }
    validateNonEmptyArgument('doc', 'path', path);
    if (parent instanceof Firestore) {
        const absolutePath = ResourcePath.fromString(path, ...pathSegments);
        validateDocumentPath(absolutePath);
        return new DocumentReference(parent, 
        /* converter= */ null, new DocumentKey(absolutePath));
    }
    else {
        if (!(parent instanceof DocumentReference) &&
            !(parent instanceof CollectionReference)) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Expected first argument to doc() to be a CollectionReference, ' +
                'a DocumentReference or FirebaseFirestore');
        }
        const absolutePath = parent._path.child(ResourcePath.fromString(path, ...pathSegments));
        validateDocumentPath(absolutePath);
        return new DocumentReference(parent.firestore, parent instanceof CollectionReference ? parent.converter : null, new DocumentKey(absolutePath));
    }
}
/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
function refEqual(left, right) {
    left = getModularInstance(left);
    right = getModularInstance(right);
    if ((left instanceof DocumentReference ||
        left instanceof CollectionReference) &&
        (right instanceof DocumentReference || right instanceof CollectionReference)) {
        return (left.firestore === right.firestore &&
            left.path === right.path &&
            left.converter === right.converter);
    }
    return false;
}
/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
function queryEqual(left, right) {
    left = getModularInstance(left);
    right = getModularInstance(right);
    if (left instanceof Query && right instanceof Query) {
        return (left.firestore === right.firestore &&
            queryEquals(left._query, right._query) &&
            left.converter === right.converter);
    }
    return false;
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
 * An immutable object representing an array of bytes.
 */
class Bytes {
    /** @hideconstructor */
    constructor(byteString) {
        this._byteString = byteString;
    }
    /**
     * Creates a new `Bytes` object from the given Base64 string, converting it to
     * bytes.
     *
     * @param base64 - The Base64 string used to create the `Bytes` object.
     */
    static fromBase64String(base64) {
        try {
            return new Bytes(ByteString.fromBase64String(base64));
        }
        catch (e) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Failed to construct data from Base64 string: ' + e);
        }
    }
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */
    static fromUint8Array(array) {
        return new Bytes(ByteString.fromUint8Array(array));
    }
    /**
     * Returns the underlying bytes as a Base64-encoded string.
     *
     * @returns The Base64-encoded string created from the `Bytes` object.
     */
    toBase64() {
        return this._byteString.toBase64();
    }
    /**
     * Returns the underlying bytes in a new `Uint8Array`.
     *
     * @returns The Uint8Array created from the `Bytes` object.
     */
    toUint8Array() {
        return this._byteString.toUint8Array();
    }
    /**
     * Returns a string representation of the `Bytes` object.
     *
     * @returns A string representation of the `Bytes` object.
     */
    toString() {
        return 'Bytes(base64: ' + this.toBase64() + ')';
    }
    /**
     * Returns true if this `Bytes` object is equal to the provided one.
     *
     * @param other - The `Bytes` object to compare against.
     * @returns true if this `Bytes` object is equal to the provided one.
     */
    isEqual(other) {
        return this._byteString.isEqual(other._byteString);
    }
    /**
     * Returns a JSON-serializable representation of this `Bytes` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON() {
        return {
            type: Bytes._jsonSchemaVersion,
            bytes: this.toBase64()
        };
    }
    /**
     * Builds a `Bytes` instance from a JSON object created by {@link Bytes.toJSON}.
     *
     * @param json - a JSON object represention of a `Bytes` instance
     * @returns an instance of {@link Bytes} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(json) {
        if (validateJSON(json, Bytes._jsonSchema)) {
            return Bytes.fromBase64String(json.bytes);
        }
    }
}
Bytes._jsonSchemaVersion = 'firestore/bytes/1.0';
Bytes._jsonSchema = {
    type: property('string', Bytes._jsonSchemaVersion),
    bytes: property('string')
};

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
 * A `FieldPath` refers to a field in a document. The path may consist of a
 * single field name (referring to a top-level field in the document), or a
 * list of field names (referring to a nested field in the document).
 *
 * Create a `FieldPath` by providing field names. If more than one field
 * name is provided, the path will point to a nested field in a document.
 */
class FieldPath {
    /**
     * Creates a `FieldPath` from the provided field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     * @param fieldNames - A list of field names.
     */
    constructor(...fieldNames) {
        for (let i = 0; i < fieldNames.length; ++i) {
            if (fieldNames[i].length === 0) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid field name at argument $(i + 1). ` +
                    'Field names must not be empty.');
            }
        }
        this._internalPath = new FieldPath$1(fieldNames);
    }
    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other - The `FieldPath` to compare against.
     * @returns true if this `FieldPath` is equal to the provided one.
     */
    isEqual(other) {
        return this._internalPath.isEqual(other._internalPath);
    }
}
/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */
function documentId() {
    return new FieldPath(DOCUMENT_KEY_NAME);
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
 * Sentinel values that can be used when writing document fields with `set()`
 * or `update()`.
 */
class FieldValue {
    /**
     * @param _methodName - The public API endpoint that returns this class.
     * @hideconstructor
     */
    constructor(_methodName) {
        this._methodName = _methodName;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
 * An immutable object representing a geographic location in Firestore. The
 * location is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90].
 * Longitude values are in the range of [-180, 180].
 */
class GeoPoint {
    /**
     * Creates a new immutable `GeoPoint` object with the provided latitude and
     * longitude values.
     * @param latitude - The latitude as number between -90 and 90.
     * @param longitude - The longitude as number between -180 and 180.
     */
    constructor(latitude, longitude) {
        if (!isFinite(latitude) || latitude < -90 || latitude > 90) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Latitude must be a number between -90 and 90, but was: ' + latitude);
        }
        if (!isFinite(longitude) || longitude < -180 || longitude > 180) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Longitude must be a number between -180 and 180, but was: ' + longitude);
        }
        this._lat = latitude;
        this._long = longitude;
    }
    /**
     * The latitude of this `GeoPoint` instance.
     */
    get latitude() {
        return this._lat;
    }
    /**
     * The longitude of this `GeoPoint` instance.
     */
    get longitude() {
        return this._long;
    }
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */
    isEqual(other) {
        return this._lat === other._lat && this._long === other._long;
    }
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */
    _compareTo(other) {
        return (primitiveComparator(this._lat, other._lat) ||
            primitiveComparator(this._long, other._long));
    }
    /**
     * Returns a JSON-serializable representation of this `GeoPoint` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON() {
        return {
            latitude: this._lat,
            longitude: this._long,
            type: GeoPoint._jsonSchemaVersion
        };
    }
    /**
     * Builds a `GeoPoint` instance from a JSON object created by {@link GeoPoint.toJSON}.
     *
     * @param json - a JSON object represention of a `GeoPoint` instance
     * @returns an instance of {@link GeoPoint} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(json) {
        if (validateJSON(json, GeoPoint._jsonSchema)) {
            return new GeoPoint(json.latitude, json.longitude);
        }
    }
}
GeoPoint._jsonSchemaVersion = 'firestore/geoPoint/1.0';
GeoPoint._jsonSchema = {
    type: property('string', GeoPoint._jsonSchemaVersion),
    latitude: property('number'),
    longitude: property('number')
};

/**
 * @license
 * Copyright 2017 Google LLC
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
 * Verifies equality for an array of primitives.
 *
 * @private
 * @internal
 * @param left - Array of primitives.
 * @param right - Array of primitives.
 * @returns True if arrays are equal.
 */
function isPrimitiveArrayEqual(left, right) {
    if (left.length !== right.length) {
        return false;
    }
    for (let i = 0; i < left.length; ++i) {
        if (left[i] !== right[i]) {
            return false;
        }
    }
    return true;
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
 * Represents a vector type in Firestore documents.
 * Create an instance with <code>{@link vector}</code>.
 */
class VectorValue {
    /**
     * @private
     * @internal
     */
    constructor(values) {
        // Making a copy of the parameter.
        this._values = (values || []).map(n => n);
    }
    /**
     * Returns a copy of the raw number array form of the vector.
     */
    toArray() {
        return this._values.map(n => n);
    }
    /**
     * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
     */
    isEqual(other) {
        return isPrimitiveArrayEqual(this._values, other._values);
    }
    /**
     * Returns a JSON-serializable representation of this `VectorValue` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON() {
        return {
            type: VectorValue._jsonSchemaVersion,
            vectorValues: this._values
        };
    }
    /**
     * Builds a `VectorValue` instance from a JSON object created by {@link VectorValue.toJSON}.
     *
     * @param json - a JSON object represention of a `VectorValue` instance.
     * @returns an instance of {@link VectorValue} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(json) {
        if (validateJSON(json, VectorValue._jsonSchema)) {
            if (Array.isArray(json.vectorValues) &&
                json.vectorValues.every(element => typeof element === 'number')) {
                return new VectorValue(json.vectorValues);
            }
            throw new FirestoreError(Code.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
        }
    }
}
VectorValue._jsonSchemaVersion = 'firestore/vectorValue/1.0';
VectorValue._jsonSchema = {
    type: property('string', VectorValue._jsonSchemaVersion),
    vectorValues: property('object')
};

/**
 * @license
 * Copyright 2017 Google LLC
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
const RESERVED_FIELD_REGEX = /^__.*__$/;
/** The result of parsing document data (e.g. for a setData call). */
class ParsedSetData {
    constructor(data, fieldMask, fieldTransforms) {
        this.data = data;
        this.fieldMask = fieldMask;
        this.fieldTransforms = fieldTransforms;
    }
    toMutation(key, precondition) {
        if (this.fieldMask !== null) {
            return new PatchMutation(key, this.data, this.fieldMask, precondition, this.fieldTransforms);
        }
        else {
            return new SetMutation(key, this.data, precondition, this.fieldTransforms);
        }
    }
}
/** The result of parsing "update" data (i.e. for an updateData call). */
class ParsedUpdateData {
    constructor(data, 
    // The fieldMask does not include document transforms.
    fieldMask, fieldTransforms) {
        this.data = data;
        this.fieldMask = fieldMask;
        this.fieldTransforms = fieldTransforms;
    }
    toMutation(key, precondition) {
        return new PatchMutation(key, this.data, this.fieldMask, precondition, this.fieldTransforms);
    }
}
function isWrite(dataSource) {
    switch (dataSource) {
        case 0 /* UserDataSource.Set */: // fall through
        case 2 /* UserDataSource.MergeSet */: // fall through
        case 1 /* UserDataSource.Update */:
            return true;
        case 3 /* UserDataSource.Argument */:
        case 4 /* UserDataSource.ArrayArgument */:
            return false;
        default:
            throw fail(0x9c4b, {
                dataSource
            });
    }
}
/** A "context" object passed around while parsing user data. */
class ParseContextImpl {
    /**
     * Initializes a ParseContext with the given source and path.
     *
     * @param settings - The settings for the parser.
     * @param databaseId - The database ID of the Firestore instance.
     * @param serializer - The serializer to use to generate the Value proto.
     * @param ignoreUndefinedProperties - Whether to ignore undefined properties
     * rather than throw.
     * @param fieldTransforms - A mutable list of field transforms encountered
     * while parsing the data.
     * @param fieldMask - A mutable list of field paths encountered while parsing
     * the data.
     *
     * TODO(b/34871131): We don't support array paths right now, so path can be
     * null to indicate the context represents any location within an array (in
     * which case certain features will not work and errors will be somewhat
     * compromised).
     */
    constructor(settings, databaseId, serializer, ignoreUndefinedProperties, fieldTransforms, fieldMask) {
        this.settings = settings;
        this.databaseId = databaseId;
        this.serializer = serializer;
        this.ignoreUndefinedProperties = ignoreUndefinedProperties;
        // Minor hack: If fieldTransforms is undefined, we assume this is an
        // external call and we need to validate the entire path.
        if (fieldTransforms === undefined) {
            this.validatePath();
        }
        this.fieldTransforms = fieldTransforms || [];
        this.fieldMask = fieldMask || [];
    }
    get path() {
        return this.settings.path;
    }
    get dataSource() {
        return this.settings.dataSource;
    }
    /** Returns a new context with the specified settings overwritten. */
    contextWith(configuration) {
        return new ParseContextImpl({ ...this.settings, ...configuration }, this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
    }
    childContextForField(field) {
        const childPath = this.path?.child(field);
        const context = this.contextWith({ path: childPath, arrayElement: false });
        context.validatePathSegment(field);
        return context;
    }
    childContextForFieldPath(field) {
        const childPath = this.path?.child(field);
        const context = this.contextWith({ path: childPath, arrayElement: false });
        context.validatePath();
        return context;
    }
    childContextForArray(index) {
        // TODO(b/34871131): We don't support array paths right now; so make path
        // undefined.
        return this.contextWith({ path: undefined, arrayElement: true });
    }
    createError(reason) {
        return createError(reason, this.settings.methodName, this.settings.hasConverter || false, this.path, this.settings.targetDoc);
    }
    /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
    contains(fieldPath) {
        return (this.fieldMask.find(field => fieldPath.isPrefixOf(field)) !== undefined ||
            this.fieldTransforms.find(transform => fieldPath.isPrefixOf(transform.field)) !== undefined);
    }
    validatePath() {
        // TODO(b/34871131): Remove null check once we have proper paths for fields
        // within arrays.
        if (!this.path) {
            return;
        }
        for (let i = 0; i < this.path.length; i++) {
            this.validatePathSegment(this.path.get(i));
        }
    }
    validatePathSegment(segment) {
        if (segment.length === 0) {
            throw this.createError('Document fields must not be empty');
        }
        if (isWrite(this.dataSource) && RESERVED_FIELD_REGEX.test(segment)) {
            throw this.createError('Document fields cannot begin and end with "__"');
        }
    }
}
/**
 * Helper for parsing raw user input (provided via the API) into internal model
 * classes.
 */
class UserDataReader {
    constructor(databaseId, ignoreUndefinedProperties, serializer) {
        this.databaseId = databaseId;
        this.ignoreUndefinedProperties = ignoreUndefinedProperties;
        this.serializer = serializer || newSerializer(databaseId);
    }
    /** Creates a new top-level parse context. */
    createContext(dataSource, methodName, targetDoc, hasConverter = false) {
        return new ParseContextImpl({
            dataSource,
            methodName,
            targetDoc,
            path: FieldPath$1.emptyPath(),
            arrayElement: false,
            hasConverter
        }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
    }
}
function newUserDataReader(firestore) {
    const settings = firestore._freezeSettings();
    const serializer = newSerializer(firestore._databaseId);
    return new UserDataReader(firestore._databaseId, !!settings.ignoreUndefinedProperties, serializer);
}
/** Parse document data from a set() call. */
function parseSetData(userDataReader, methodName, targetDoc, input, hasConverter, options = {}) {
    const context = userDataReader.createContext(options.merge || options.mergeFields
        ? 2 /* UserDataSource.MergeSet */
        : 0 /* UserDataSource.Set */, methodName, targetDoc, hasConverter);
    validatePlainObject('Data must be an object, but it was:', context, input);
    const updateData = parseObject(input, context);
    let fieldMask;
    let fieldTransforms;
    if (options.merge) {
        fieldMask = new FieldMask(context.fieldMask);
        fieldTransforms = context.fieldTransforms;
    }
    else if (options.mergeFields) {
        const validatedFieldPaths = [];
        for (const stringOrFieldPath of options.mergeFields) {
            const fieldPath = fieldPathFromArgument(methodName, stringOrFieldPath, targetDoc);
            if (!context.contains(fieldPath)) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, `Field '${fieldPath}' is specified in your field mask but missing from your input data.`);
            }
            if (!fieldMaskContains(validatedFieldPaths, fieldPath)) {
                validatedFieldPaths.push(fieldPath);
            }
        }
        fieldMask = new FieldMask(validatedFieldPaths);
        fieldTransforms = context.fieldTransforms.filter(transform => fieldMask.covers(transform.field));
    }
    else {
        fieldMask = null;
        fieldTransforms = context.fieldTransforms;
    }
    return new ParsedSetData(new ObjectValue(updateData), fieldMask, fieldTransforms);
}
class DeleteFieldValueImpl extends FieldValue {
    _toFieldTransform(context) {
        if (context.dataSource === 2 /* UserDataSource.MergeSet */) {
            // No transform to add for a delete, but we need to add it to our
            // fieldMask so it gets deleted.
            context.fieldMask.push(context.path);
        }
        else if (context.dataSource === 1 /* UserDataSource.Update */) {
            throw context.createError(`${this._methodName}() can only appear at the top level ` +
                'of your update data');
        }
        else {
            // We shouldn't encounter delete sentinels for queries or non-merge set() calls.
            throw context.createError(`${this._methodName}() cannot be used with set() unless you pass ` +
                '{merge:true}');
        }
        return null;
    }
    isEqual(other) {
        return other instanceof DeleteFieldValueImpl;
    }
}
/**
 * Creates a child context for parsing SerializableFieldValues.
 *
 * This is different than calling `ParseContext.contextWith` because it keeps
 * the fieldTransforms and fieldMask separate.
 *
 * The created context has its `dataSource` set to `UserDataSource.Argument`.
 * Although these values are used with writes, any elements in these FieldValues
 * are not considered writes since they cannot contain any FieldValue sentinels,
 * etc.
 *
 * @param fieldValue - The sentinel FieldValue for which to create a child
 *     context.
 * @param context - The parent context.
 * @param arrayElement - Whether or not the FieldValue has an array.
 */
function createSentinelChildContext(fieldValue, context, arrayElement) {
    return new ParseContextImpl({
        dataSource: 3 /* UserDataSource.Argument */,
        targetDoc: context.settings.targetDoc,
        methodName: fieldValue._methodName,
        arrayElement
    }, context.databaseId, context.serializer, context.ignoreUndefinedProperties);
}
class ServerTimestampFieldValueImpl extends FieldValue {
    _toFieldTransform(context) {
        return new FieldTransform(context.path, new ServerTimestampTransform());
    }
    isEqual(other) {
        return other instanceof ServerTimestampFieldValueImpl;
    }
}
class ArrayUnionFieldValueImpl extends FieldValue {
    constructor(methodName, _elements) {
        super(methodName);
        this._elements = _elements;
    }
    _toFieldTransform(context) {
        const parseContext = createSentinelChildContext(this, context, 
        /*array=*/ true);
        const parsedElements = this._elements.map(element => parseData(element, parseContext));
        const arrayUnion = new ArrayUnionTransformOperation(parsedElements);
        return new FieldTransform(context.path, arrayUnion);
    }
    isEqual(other) {
        return (other instanceof ArrayUnionFieldValueImpl &&
            deepEqual(this._elements, other._elements));
    }
}
class ArrayRemoveFieldValueImpl extends FieldValue {
    constructor(methodName, _elements) {
        super(methodName);
        this._elements = _elements;
    }
    _toFieldTransform(context) {
        const parseContext = createSentinelChildContext(this, context, 
        /*array=*/ true);
        const parsedElements = this._elements.map(element => parseData(element, parseContext));
        const arrayUnion = new ArrayRemoveTransformOperation(parsedElements);
        return new FieldTransform(context.path, arrayUnion);
    }
    isEqual(other) {
        return (other instanceof ArrayRemoveFieldValueImpl &&
            deepEqual(this._elements, other._elements));
    }
}
class NumericIncrementFieldValueImpl extends FieldValue {
    constructor(methodName, _operand) {
        super(methodName);
        this._operand = _operand;
    }
    _toFieldTransform(context) {
        const numericIncrement = new NumericIncrementTransformOperation(context.serializer, toNumber(context.serializer, this._operand));
        return new FieldTransform(context.path, numericIncrement);
    }
    isEqual(other) {
        return (other instanceof NumericIncrementFieldValueImpl &&
            this._operand === other._operand);
    }
}
/** Parse update data from an update() call. */
function parseUpdateData(userDataReader, methodName, targetDoc, input) {
    const context = userDataReader.createContext(1 /* UserDataSource.Update */, methodName, targetDoc);
    validatePlainObject('Data must be an object, but it was:', context, input);
    const fieldMaskPaths = [];
    const updateData = ObjectValue.empty();
    forEach(input, (key, value) => {
        const path = fieldPathFromDotSeparatedString(methodName, key, targetDoc);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
        value = getModularInstance(value);
        const childContext = context.childContextForFieldPath(path);
        if (value instanceof DeleteFieldValueImpl) {
            // Add it to the field mask, but don't add anything to updateData.
            fieldMaskPaths.push(path);
        }
        else {
            const parsedValue = parseData(value, childContext);
            if (parsedValue != null) {
                fieldMaskPaths.push(path);
                updateData.set(path, parsedValue);
            }
        }
    });
    const mask = new FieldMask(fieldMaskPaths);
    return new ParsedUpdateData(updateData, mask, context.fieldTransforms);
}
/** Parse update data from a list of field/value arguments. */
function parseUpdateVarargs(userDataReader, methodName, targetDoc, field, value, moreFieldsAndValues) {
    const context = userDataReader.createContext(1 /* UserDataSource.Update */, methodName, targetDoc);
    const keys = [fieldPathFromArgument(methodName, field, targetDoc)];
    const values = [value];
    if (moreFieldsAndValues.length % 2 !== 0) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `Function ${methodName}() needs to be called with an even number ` +
            'of arguments that alternate between field names and values.');
    }
    for (let i = 0; i < moreFieldsAndValues.length; i += 2) {
        keys.push(fieldPathFromArgument(methodName, moreFieldsAndValues[i]));
        values.push(moreFieldsAndValues[i + 1]);
    }
    const fieldMaskPaths = [];
    const updateData = ObjectValue.empty();
    // We iterate in reverse order to pick the last value for a field if the
    // user specified the field multiple times.
    for (let i = keys.length - 1; i >= 0; --i) {
        if (!fieldMaskContains(fieldMaskPaths, keys[i])) {
            const path = keys[i];
            let value = values[i];
            // For Compat types, we have to "extract" the underlying types before
            // performing validation.
            value = getModularInstance(value);
            const childContext = context.childContextForFieldPath(path);
            if (value instanceof DeleteFieldValueImpl) {
                // Add it to the field mask, but don't add anything to updateData.
                fieldMaskPaths.push(path);
            }
            else {
                const parsedValue = parseData(value, childContext);
                if (parsedValue != null) {
                    fieldMaskPaths.push(path);
                    updateData.set(path, parsedValue);
                }
            }
        }
    }
    const mask = new FieldMask(fieldMaskPaths);
    return new ParsedUpdateData(updateData, mask, context.fieldTransforms);
}
/**
 * Parse a "query value" (e.g. value in a where filter or a value in a cursor
 * bound).
 *
 * @param allowArrays - Whether the query value is an array that may directly
 * contain additional arrays (e.g. the operand of an `in` query).
 */
function parseQueryValue(userDataReader, methodName, input, allowArrays = false) {
    const context = userDataReader.createContext(allowArrays ? 4 /* UserDataSource.ArrayArgument */ : 3 /* UserDataSource.Argument */, methodName);
    const parsed = parseData(input, context);
    return parsed;
}
/**
 * Parses user data to Protobuf Values.
 *
 * @param input - Data to be parsed.
 * @param context - A context object representing the current path being parsed,
 * the source of the data being parsed, etc.
 * @returns The parsed value, or null if the value was a FieldValue sentinel
 * that should not be included in the resulting parsed data.
 */
function parseData(input, context) {
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    input = getModularInstance(input);
    if (looksLikeJsonObject(input)) {
        validatePlainObject('Unsupported field value:', context, input);
        return parseObject(input, context);
    }
    else if (input instanceof FieldValue) {
        // FieldValues usually parse into transforms (except deleteField())
        // in which case we do not want to include this field in our parsed data
        // (as doing so will overwrite the field directly prior to the transform
        // trying to transform it). So we don't add this location to
        // context.fieldMask and we return null as our parsing result.
        parseSentinelFieldValue(input, context);
        return null;
    }
    else if (input === undefined && context.ignoreUndefinedProperties) {
        // If the input is undefined it can never participate in the fieldMask, so
        // don't handle this below. If `ignoreUndefinedProperties` is false,
        // `parseScalarValue` will reject an undefined value.
        return null;
    }
    else {
        // If context.path is null we are inside an array and we don't support
        // field mask paths more granular than the top-level array.
        if (context.path) {
            context.fieldMask.push(context.path);
        }
        if (input instanceof Array) {
            // TODO(b/34871131): Include the path containing the array in the error
            // message.
            // In the case of IN queries, the parsed data is an array (representing
            // the set of values to be included for the IN query) that may directly
            // contain additional arrays (each representing an individual field
            // value), so we disable this validation.
            if (context.settings.arrayElement &&
                context.dataSource !== 4 /* UserDataSource.ArrayArgument */) {
                throw context.createError('Nested arrays are not supported');
            }
            return parseArray(input, context);
        }
        else {
            return parseScalarValue(input, context);
        }
    }
}
function parseObject(obj, context) {
    const fields = {};
    if (isEmpty(obj)) {
        // If we encounter an empty object, we explicitly add it to the update
        // mask to ensure that the server creates a map entry.
        if (context.path && context.path.length > 0) {
            context.fieldMask.push(context.path);
        }
    }
    else {
        forEach(obj, (key, val) => {
            const parsedValue = parseData(val, context.childContextForField(key));
            if (parsedValue != null) {
                fields[key] = parsedValue;
            }
        });
    }
    return { mapValue: { fields } };
}
function parseArray(array, context) {
    const values = [];
    let entryIndex = 0;
    for (const entry of array) {
        let parsedEntry = parseData(entry, context.childContextForArray(entryIndex));
        if (parsedEntry == null) {
            // Just include nulls in the array for fields being replaced with a
            // sentinel.
            parsedEntry = { nullValue: 'NULL_VALUE' };
        }
        values.push(parsedEntry);
        entryIndex++;
    }
    return { arrayValue: { values } };
}
/**
 * "Parses" the provided FieldValueImpl, adding any necessary transforms to
 * context.fieldTransforms.
 */
function parseSentinelFieldValue(value, context) {
    // Sentinels are only supported with writes, and not within arrays.
    if (!isWrite(context.dataSource)) {
        throw context.createError(`${value._methodName}() can only be used with update() and set()`);
    }
    if (!context.path) {
        throw context.createError(`${value._methodName}() is not currently supported inside arrays`);
    }
    const fieldTransform = value._toFieldTransform(context);
    if (fieldTransform) {
        context.fieldTransforms.push(fieldTransform);
    }
}
/**
 * Helper to parse a scalar value (i.e. not an Object, Array, or FieldValue)
 *
 * @returns The parsed value
 */
function parseScalarValue(value, context) {
    value = getModularInstance(value);
    if (value === null) {
        return { nullValue: 'NULL_VALUE' };
    }
    else if (typeof value === 'number') {
        return toNumber(context.serializer, value);
    }
    else if (typeof value === 'boolean') {
        return { booleanValue: value };
    }
    else if (typeof value === 'string') {
        return { stringValue: value };
    }
    else if (value instanceof Date) {
        const timestamp = Timestamp.fromDate(value);
        return {
            timestampValue: toTimestamp(context.serializer, timestamp)
        };
    }
    else if (value instanceof Timestamp) {
        // Firestore backend truncates precision down to microseconds. To ensure
        // offline mode works the same with regards to truncation, perform the
        // truncation immediately without waiting for the backend to do that.
        const timestamp = new Timestamp(value.seconds, Math.floor(value.nanoseconds / 1000) * 1000);
        return {
            timestampValue: toTimestamp(context.serializer, timestamp)
        };
    }
    else if (value instanceof GeoPoint) {
        return {
            geoPointValue: {
                latitude: value.latitude,
                longitude: value.longitude
            }
        };
    }
    else if (value instanceof Bytes) {
        return { bytesValue: toBytes(context.serializer, value._byteString) };
    }
    else if (value instanceof DocumentReference) {
        const thisDb = context.databaseId;
        const otherDb = value.firestore._databaseId;
        if (!otherDb.isEqual(thisDb)) {
            throw context.createError('Document reference is for database ' +
                `${otherDb.projectId}/${otherDb.database} but should be ` +
                `for database ${thisDb.projectId}/${thisDb.database}`);
        }
        return {
            referenceValue: toResourceName(value.firestore._databaseId || context.databaseId, value._key.path)
        };
    }
    else if (value instanceof VectorValue) {
        return parseVectorValue(value, context);
    }
    else if (isProtoValueSerializable(value)) {
        return value._toProto(context.serializer);
    }
    else {
        throw context.createError(`Unsupported field value: ${valueDescription(value)}`);
    }
}
/**
 * Creates a new VectorValue proto value (using the internal format).
 */
function parseVectorValue(value, context) {
    const values = value instanceof VectorValue ? value.toArray() : value;
    const mapValue = {
        fields: {
            [TYPE_KEY]: {
                stringValue: VECTOR_VALUE_SENTINEL
            },
            [VECTOR_MAP_VECTORS_KEY]: {
                arrayValue: {
                    values: values.map(value => {
                        if (typeof value !== 'number') {
                            throw context.createError('VectorValues must only contain numeric values.');
                        }
                        return toDouble(context.serializer, value);
                    })
                }
            }
        }
    };
    return { mapValue };
}
/**
 * Checks whether an object looks like a JSON object that should be converted
 * into a struct. Normal class/prototype instances are considered to look like
 * JSON objects since they should be converted to a struct value. Arrays, Dates,
 * GeoPoints, etc. are not considered to look like JSON objects since they map
 * to specific FieldValue types other than ObjectValue.
 */
function looksLikeJsonObject(input) {
    return (typeof input === 'object' &&
        input !== null &&
        !(input instanceof Array) &&
        !(input instanceof Date) &&
        !(input instanceof Timestamp) &&
        !(input instanceof GeoPoint) &&
        !(input instanceof Bytes) &&
        !(input instanceof DocumentReference) &&
        !(input instanceof FieldValue) &&
        !(input instanceof VectorValue) &&
        !isProtoValueSerializable(input));
}
function validatePlainObject(message, context, input) {
    if (!looksLikeJsonObject(input) || !isPlainObject(input)) {
        const description = valueDescription(input);
        if (description === 'an object') {
            // Massage the error if it was an object.
            throw context.createError(message + ' a custom object');
        }
        else {
            throw context.createError(message + ' ' + description);
        }
    }
}
/**
 * Helper that calls fromDotSeparatedString() but wraps any error thrown.
 */
function fieldPathFromArgument(methodName, path, targetDoc) {
    // If required, replace the FieldPath Compat class with the firestore-exp
    // FieldPath.
    path = getModularInstance(path);
    if (path instanceof FieldPath) {
        return path._internalPath;
    }
    else if (typeof path === 'string') {
        return fieldPathFromDotSeparatedString(methodName, path);
    }
    else {
        const message = 'Field path arguments must be of type string or ';
        throw createError(message, methodName, 
        /* hasConverter= */ false, 
        /* path= */ undefined, targetDoc);
    }
}
/**
 * Matches any characters in a field path string that are reserved.
 */
const FIELD_PATH_RESERVED = new RegExp('[~\\*/\\[\\]]');
/**
 * Wraps fromDotSeparatedString with an error message about the method that
 * was thrown.
 * @param methodName - The publicly visible method name
 * @param path - The dot-separated string form of a field path which will be
 * split on dots.
 * @param targetDoc - The document against which the field path will be
 * evaluated.
 */
function fieldPathFromDotSeparatedString(methodName, path, targetDoc) {
    const found = path.search(FIELD_PATH_RESERVED);
    if (found >= 0) {
        throw createError(`Invalid field path (${path}). Paths must not contain ` +
            `'~', '*', '/', '[', or ']'`, methodName, 
        /* hasConverter= */ false, 
        /* path= */ undefined, targetDoc);
    }
    try {
        return new FieldPath(...path.split('.'))._internalPath;
    }
    catch (e) {
        throw createError(`Invalid field path (${path}). Paths must not be empty, ` +
            `begin with '.', end with '.', or contain '..'`, methodName, 
        /* hasConverter= */ false, 
        /* path= */ undefined, targetDoc);
    }
}
function createError(reason, methodName, hasConverter, path, targetDoc) {
    const hasPath = path && !path.isEmpty();
    const hasDocument = targetDoc !== undefined;
    let message = `Function ${methodName}() called with invalid data`;
    if (hasConverter) {
        message += ' (via `toFirestore()`)';
    }
    message += '. ';
    let description = '';
    if (hasPath || hasDocument) {
        description += ' (found';
        if (hasPath) {
            description += ` in field ${path}`;
        }
        if (hasDocument) {
            description += ` in document ${targetDoc}`;
        }
        description += ')';
    }
    return new FirestoreError(Code.INVALID_ARGUMENT, message + reason + description);
}
/** Checks `haystack` if FieldPath `needle` is present. Runs in O(n). */
function fieldMaskContains(haystack, needle) {
    return haystack.some(v => v.isEqual(needle));
}
function isUserData(value) {
    return typeof value._readUserData === 'function';
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
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */
class DocumentSnapshot {
    // Note: This class is stripped down version of the DocumentSnapshot in
    // the legacy SDK. The changes are:
    // - No support for SnapshotMetadata.
    // - No support for SnapshotOptions.
    /** @hideconstructor protected */
    constructor(_firestore, _userDataWriter, _key, _document, _converter) {
        this._firestore = _firestore;
        this._userDataWriter = _userDataWriter;
        this._key = _key;
        this._document = _document;
        this._converter = _converter;
    }
    /** Property of the `DocumentSnapshot` that provides the document's ID. */
    get id() {
        return this._key.path.lastSegment();
    }
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */
    get ref() {
        return new DocumentReference(this._firestore, this._converter, this._key);
    }
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */
    exists() {
        return this._document !== null;
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */
    data() {
        if (!this._document) {
            return undefined;
        }
        else if (this._converter) {
            // We only want to use the converter and create a new DocumentSnapshot
            // if a converter has been provided.
            const snapshot = new QueryDocumentSnapshot(this._firestore, this._userDataWriter, this._key, this._document, 
            /* converter= */ null);
            return this._converter.fromFirestore(snapshot);
        }
        else {
            return this._userDataWriter.convertValue(this._document.data.value);
        }
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the document as a proto Value. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */
    _fieldsProto() {
        // Return a cloned value to prevent manipulation of the Snapshot's data
        return this._document?.data.clone().value.mapValue.fields ?? undefined;
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(fieldPath) {
        if (this._document) {
            const value = this._document.data.field(fieldPathFromArgument('DocumentSnapshot.get', fieldPath));
            if (value !== null) {
                return this._userDataWriter.convertValue(value);
            }
        }
        return undefined;
    }
}
/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */
class QueryDocumentSnapshot extends DocumentSnapshot {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * @override
     * @returns An `Object` containing all fields in the document.
     */
    data() {
        return super.data();
    }
}
/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
class QuerySnapshot {
    /** @hideconstructor */
    constructor(_query, _docs) {
        this._docs = _docs;
        this.query = _query;
    }
    /** An array of all the documents in the `QuerySnapshot`. */
    get docs() {
        return [...this._docs];
    }
    /** The number of documents in the `QuerySnapshot`. */
    get size() {
        return this.docs.length;
    }
    /** True if there are no documents in the `QuerySnapshot`. */
    get empty() {
        return this.docs.length === 0;
    }
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */
    forEach(callback, thisArg) {
        this._docs.forEach(callback, thisArg);
    }
}
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
function snapshotEqual(left, right) {
    left = getModularInstance(left);
    right = getModularInstance(right);
    if (left instanceof DocumentSnapshot && right instanceof DocumentSnapshot) {
        return (left._firestore === right._firestore &&
            left._key.isEqual(right._key) &&
            (left._document === null
                ? right._document === null
                : left._document.isEqual(right._document)) &&
            left._converter === right._converter);
    }
    else if (left instanceof QuerySnapshot && right instanceof QuerySnapshot) {
        return (queryEqual(left.query, right.query) &&
            arrayEquals(left.docs, right.docs, snapshotEqual));
    }
    return false;
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
function validateHasExplicitOrderByForLimitToLast(query) {
    if (query.limitType === "L" /* LimitType.Last */ &&
        query.explicitOrderBy.length === 0) {
        throw new FirestoreError(Code.UNIMPLEMENTED, 'limitToLast() queries require specifying at least one orderBy() clause');
    }
}
/**
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */
class AppliableConstraint {
}
/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */
class QueryConstraint extends AppliableConstraint {
}
function query(query, queryConstraint, ...additionalQueryConstraints) {
    let queryConstraints = [];
    if (queryConstraint instanceof AppliableConstraint) {
        queryConstraints.push(queryConstraint);
    }
    queryConstraints = queryConstraints.concat(additionalQueryConstraints);
    validateQueryConstraintArray(queryConstraints);
    for (const constraint of queryConstraints) {
        query = constraint._apply(query);
    }
    return query;
}
/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */
class QueryFieldFilterConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(_field, _op, _value) {
        super();
        this._field = _field;
        this._op = _op;
        this._value = _value;
        /** The type of this query constraint */
        this.type = 'where';
    }
    static _create(_field, _op, _value) {
        return new QueryFieldFilterConstraint(_field, _op, _value);
    }
    _apply(query) {
        const filter = this._parse(query);
        validateNewFieldFilter(query._query, filter);
        return new Query(query.firestore, query.converter, queryWithAddedFilter(query._query, filter));
    }
    _parse(query) {
        const reader = newUserDataReader(query.firestore);
        const filter = newQueryFilter(query._query, 'where', reader, query.firestore._databaseId, this._field, this._op, this._value);
        return filter;
    }
}
/**
 * Creates a {@link QueryFieldFilterConstraint} that enforces that documents
 * must contain the specified field and that the value should satisfy the
 * relation constraint provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created {@link QueryFieldFilterConstraint}.
 */
function where(fieldPath, opStr, value) {
    const op = opStr;
    const field = fieldPathFromArgument('where', fieldPath);
    return QueryFieldFilterConstraint._create(field, op, value);
}
/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */
class QueryCompositeFilterConstraint extends AppliableConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    type, _queryConstraints) {
        super();
        this.type = type;
        this._queryConstraints = _queryConstraints;
    }
    static _create(type, _queryConstraints) {
        return new QueryCompositeFilterConstraint(type, _queryConstraints);
    }
    _parse(query) {
        const parsedFilters = this._queryConstraints
            .map(queryConstraint => {
            return queryConstraint._parse(query);
        })
            .filter(parsedFilter => parsedFilter.getFilters().length > 0);
        if (parsedFilters.length === 1) {
            return parsedFilters[0];
        }
        return CompositeFilter.create(parsedFilters, this._getOperator());
    }
    _apply(query) {
        const parsedFilter = this._parse(query);
        if (parsedFilter.getFilters().length === 0) {
            // Return the existing query if not adding any more filters (e.g. an empty
            // composite filter).
            return query;
        }
        validateNewFilter(query._query, parsedFilter);
        return new Query(query.firestore, query.converter, queryWithAddedFilter(query._query, parsedFilter));
    }
    _getQueryConstraints() {
        return this._queryConstraints;
    }
    _getOperator() {
        return this.type === 'and' ? "and" /* CompositeOperator.AND */ : "or" /* CompositeOperator.OR */;
    }
}
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
function or(...queryConstraints) {
    // Only support QueryFilterConstraints
    queryConstraints.forEach(queryConstraint => validateQueryFilterConstraint('or', queryConstraint));
    return QueryCompositeFilterConstraint._create("or" /* CompositeOperator.OR */, queryConstraints);
}
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
function and(...queryConstraints) {
    // Only support QueryFilterConstraints
    queryConstraints.forEach(queryConstraint => validateQueryFilterConstraint('and', queryConstraint));
    return QueryCompositeFilterConstraint._create("and" /* CompositeOperator.AND */, queryConstraints);
}
/**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */
class QueryOrderByConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(_field, _direction) {
        super();
        this._field = _field;
        this._direction = _direction;
        /** The type of this query constraint */
        this.type = 'orderBy';
    }
    static _create(_field, _direction) {
        return new QueryOrderByConstraint(_field, _direction);
    }
    _apply(query) {
        const orderBy = newQueryOrderBy(query._query, this._field, this._direction);
        return new Query(query.firestore, query.converter, queryWithAddedOrderBy(query._query, orderBy));
    }
}
/**
 * Creates a {@link QueryOrderByConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * Note: Documents that do not contain the specified field will not be present
 * in the query result.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link QueryOrderByConstraint}.
 */
function orderBy(fieldPath, directionStr = 'asc') {
    const direction = directionStr;
    const path = fieldPathFromArgument('orderBy', fieldPath);
    return QueryOrderByConstraint._create(path, direction);
}
/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */
class QueryLimitConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    type, _limit, _limitType) {
        super();
        this.type = type;
        this._limit = _limit;
        this._limitType = _limitType;
    }
    static _create(type, _limit, _limitType) {
        return new QueryLimitConstraint(type, _limit, _limitType);
    }
    _apply(query) {
        return new Query(query.firestore, query.converter, queryWithLimit(query._query, this._limit, this._limitType));
    }
}
/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */
function limit(limit) {
    validatePositiveNumber('limit', limit);
    return QueryLimitConstraint._create('limit', limit, "F" /* LimitType.First */);
}
/**
 * Creates a {@link QueryLimitConstraint} that only returns the last matching
 * documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */
function limitToLast(limit) {
    validatePositiveNumber('limitToLast', limit);
    return QueryLimitConstraint._create('limitToLast', limit, "L" /* LimitType.Last */);
}
/**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */
class QueryStartAtConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    type, _docOrFields, _inclusive) {
        super();
        this.type = type;
        this._docOrFields = _docOrFields;
        this._inclusive = _inclusive;
    }
    static _create(type, _docOrFields, _inclusive) {
        return new QueryStartAtConstraint(type, _docOrFields, _inclusive);
    }
    _apply(query) {
        const bound = newQueryBoundFromDocOrFields(query, this.type, this._docOrFields, this._inclusive);
        return new Query(query.firestore, query.converter, queryWithStartAt(query._query, bound));
    }
}
function startAt(...docOrFields) {
    return QueryStartAtConstraint._create('startAt', docOrFields, 
    /*inclusive=*/ true);
}
function startAfter(...docOrFields) {
    return QueryStartAtConstraint._create('startAfter', docOrFields, 
    /*inclusive=*/ false);
}
/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */
class QueryEndAtConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    type, _docOrFields, _inclusive) {
        super();
        this.type = type;
        this._docOrFields = _docOrFields;
        this._inclusive = _inclusive;
    }
    static _create(type, _docOrFields, _inclusive) {
        return new QueryEndAtConstraint(type, _docOrFields, _inclusive);
    }
    _apply(query) {
        const bound = newQueryBoundFromDocOrFields(query, this.type, this._docOrFields, this._inclusive);
        return new Query(query.firestore, query.converter, queryWithEndAt(query._query, bound));
    }
}
function endBefore(...docOrFields) {
    return QueryEndAtConstraint._create('endBefore', docOrFields, 
    /*inclusive=*/ false);
}
function endAt(...docOrFields) {
    return QueryEndAtConstraint._create('endAt', docOrFields, 
    /*inclusive=*/ true);
}
/** Helper function to create a bound from a document or fields */
function newQueryBoundFromDocOrFields(query, methodName, docOrFields, inclusive) {
    docOrFields[0] = getModularInstance(docOrFields[0]);
    if (docOrFields[0] instanceof DocumentSnapshot) {
        return newQueryBoundFromDocument(query._query, query.firestore._databaseId, methodName, docOrFields[0]._document, inclusive);
    }
    else {
        const reader = newUserDataReader(query.firestore);
        return newQueryBoundFromFields(query._query, query.firestore._databaseId, reader, methodName, docOrFields, inclusive);
    }
}
function newQueryFilter(query, methodName, dataReader, databaseId, fieldPath, op, value) {
    let fieldValue;
    if (fieldPath.isKeyField()) {
        if (op === "array-contains" /* Operator.ARRAY_CONTAINS */ || op === "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid Query. You can't perform '${op}' queries on documentId().`);
        }
        else if (op === "in" /* Operator.IN */ || op === "not-in" /* Operator.NOT_IN */) {
            validateDisjunctiveFilterElements(value, op);
            const referenceList = [];
            for (const arrayValue of value) {
                referenceList.push(parseDocumentIdValue(databaseId, query, arrayValue));
            }
            fieldValue = { arrayValue: { values: referenceList } };
        }
        else {
            fieldValue = parseDocumentIdValue(databaseId, query, value);
        }
    }
    else {
        if (op === "in" /* Operator.IN */ ||
            op === "not-in" /* Operator.NOT_IN */ ||
            op === "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */) {
            validateDisjunctiveFilterElements(value, op);
        }
        fieldValue = parseQueryValue(dataReader, methodName, value, 
        /* allowArrays= */ op === "in" /* Operator.IN */ || op === "not-in" /* Operator.NOT_IN */);
    }
    const filter = FieldFilter.create(fieldPath, op, fieldValue);
    return filter;
}
function newQueryOrderBy(query, fieldPath, direction) {
    if (query.startAt !== null) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, 'Invalid query. You must not call startAt() or startAfter() before ' +
            'calling orderBy().');
    }
    if (query.endAt !== null) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, 'Invalid query. You must not call endAt() or endBefore() before ' +
            'calling orderBy().');
    }
    const orderBy = new OrderBy(fieldPath, direction);
    return orderBy;
}
/**
 * Create a `Bound` from a query and a document.
 *
 * Note that the `Bound` will always include the key of the document
 * and so only the provided document will compare equal to the returned
 * position.
 *
 * Will throw if the document does not contain all fields of the order by
 * of the query or if any of the fields in the order by are an uncommitted
 * server timestamp.
 */
function newQueryBoundFromDocument(query, databaseId, methodName, doc, inclusive) {
    if (!doc) {
        throw new FirestoreError(Code.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ` +
            `${methodName}().`);
    }
    const components = [];
    // Because people expect to continue/end a query at the exact document
    // provided, we need to use the implicit sort order rather than the explicit
    // sort order, because it's guaranteed to contain the document key. That way
    // the position becomes unambiguous and the query continues/ends exactly at
    // the provided document. Without the key (by using the explicit sort
    // orders), multiple documents could match the position, yielding duplicate
    // results.
    for (const orderBy of queryNormalizedOrderBy(query)) {
        if (orderBy.field.isKeyField()) {
            components.push(refValue(databaseId, doc.key));
        }
        else {
            const value = doc.data.field(orderBy.field);
            if (isServerTimestamp(value)) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a ' +
                    'document for which the field "' +
                    orderBy.field +
                    '" is an uncommitted server timestamp. (Since the value of ' +
                    'this field is unknown, you cannot start/end a query with it.)');
            }
            else if (value !== null) {
                components.push(value);
            }
            else {
                const field = orderBy.field.canonicalString();
                throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a ` +
                    `document for which the field '${field}' (used as the ` +
                    `orderBy) does not exist.`);
            }
        }
    }
    return new Bound(components, inclusive);
}
/**
 * Converts a list of field values to a `Bound` for the given query.
 */
function newQueryBoundFromFields(query, databaseId, dataReader, methodName, values, inclusive) {
    // Use explicit order by's because it has to match the query the user made
    const orderBy = query.explicitOrderBy;
    if (values.length > orderBy.length) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `Too many arguments provided to ${methodName}(). ` +
            `The number of arguments must be less than or equal to the ` +
            `number of orderBy() clauses`);
    }
    const components = [];
    for (let i = 0; i < values.length; i++) {
        const rawValue = values[i];
        const orderByComponent = orderBy[i];
        if (orderByComponent.field.isKeyField()) {
            if (typeof rawValue !== 'string') {
                throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ` +
                    `${methodName}(), but got a ${typeof rawValue}`);
            }
            if (!isCollectionGroupQuery(query) && rawValue.indexOf('/') !== -1) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by documentId(), ` +
                    `the value passed to ${methodName}() must be a plain document ID, but ` +
                    `'${rawValue}' contains a slash.`);
            }
            const path = query.path.child(ResourcePath.fromString(rawValue));
            if (!DocumentKey.isDocumentKey(path)) {
                throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by ` +
                    `documentId(), the value passed to ${methodName}() must result in a ` +
                    `valid document path, but '${path}' is not because it contains an odd number ` +
                    `of segments.`);
            }
            const key = new DocumentKey(path);
            components.push(refValue(databaseId, key));
        }
        else {
            const wrapped = parseQueryValue(dataReader, methodName, rawValue);
            components.push(wrapped);
        }
    }
    return new Bound(components, inclusive);
}
/**
 * Parses the given `documentIdValue` into a `ReferenceValue`, throwing
 * appropriate errors if the value is anything other than a `DocumentReference`
 * or `string`, or if the string is malformed.
 */
function parseDocumentIdValue(databaseId, query, documentIdValue) {
    documentIdValue = getModularInstance(documentIdValue);
    if (typeof documentIdValue === 'string') {
        if (documentIdValue === '') {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Invalid query. When querying with documentId(), you ' +
                'must provide a valid document ID, but it was an empty string.');
        }
        if (!isCollectionGroupQuery(query) && documentIdValue.indexOf('/') !== -1) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid query. When querying a collection by ` +
                `documentId(), you must provide a plain document ID, but ` +
                `'${documentIdValue}' contains a '/' character.`);
        }
        const path = query.path.child(ResourcePath.fromString(documentIdValue));
        if (!DocumentKey.isDocumentKey(path)) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid query. When querying a collection group by ` +
                `documentId(), the value provided must result in a valid document path, ` +
                `but '${path}' is not because it has an odd number of segments (${path.length}).`);
        }
        return refValue(databaseId, new DocumentKey(path));
    }
    else if (documentIdValue instanceof DocumentReference) {
        return refValue(databaseId, documentIdValue._key);
    }
    else {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid ` +
            `string or a DocumentReference, but it was: ` +
            `${valueDescription(documentIdValue)}.`);
    }
}
/**
 * Validates that the value passed into a disjunctive filter satisfies all
 * array requirements.
 */
function validateDisjunctiveFilterElements(value, operator) {
    if (!Array.isArray(value) || value.length === 0) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, 'Invalid Query. A non-empty array is required for ' +
            `'${operator.toString()}' filters.`);
    }
}
/**
 * Given an operator, returns the set of operators that cannot be used with it.
 *
 * This is not a comprehensive check, and this function should be removed in the
 * long term. Validations should occur in the Firestore backend.
 *
 * Operators in a query must adhere to the following set of rules:
 * 1. Only one inequality per query.
 * 2. `NOT_IN` cannot be used with array, disjunctive, or `NOT_EQUAL` operators.
 */
function conflictingOps(op) {
    switch (op) {
        case "!=" /* Operator.NOT_EQUAL */:
            return ["!=" /* Operator.NOT_EQUAL */, "not-in" /* Operator.NOT_IN */];
        case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */:
        case "in" /* Operator.IN */:
            return ["not-in" /* Operator.NOT_IN */];
        case "not-in" /* Operator.NOT_IN */:
            return [
                "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */,
                "in" /* Operator.IN */,
                "not-in" /* Operator.NOT_IN */,
                "!=" /* Operator.NOT_EQUAL */
            ];
        default:
            return [];
    }
}
function validateNewFieldFilter(query, fieldFilter) {
    const conflictingOp = findOpInsideFilters(query.filters, conflictingOps(fieldFilter.op));
    if (conflictingOp !== null) {
        // Special case when it's a duplicate op to give a slightly clearer error message.
        if (conflictingOp === fieldFilter.op) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, 'Invalid query. You cannot use more than one ' +
                `'${fieldFilter.op.toString()}' filter.`);
        }
        else {
            throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid query. You cannot use '${fieldFilter.op.toString()}' filters ` +
                `with '${conflictingOp.toString()}' filters.`);
        }
    }
}
function validateNewFilter(query, filter) {
    let testQuery = query;
    const subFilters = filter.getFlattenedFilters();
    for (const subFilter of subFilters) {
        validateNewFieldFilter(testQuery, subFilter);
        testQuery = queryWithAddedFilter(testQuery, subFilter);
    }
}
// Checks if any of the provided filter operators are included in the given list of filters and
// returns the first one that is, or null if none are.
function findOpInsideFilters(filters, operators) {
    for (const filter of filters) {
        for (const fieldFilter of filter.getFlattenedFilters()) {
            if (operators.indexOf(fieldFilter.op) >= 0) {
                return fieldFilter.op;
            }
        }
    }
    return null;
}
function validateQueryFilterConstraint(functionName, queryConstraint) {
    if (!(queryConstraint instanceof QueryFieldFilterConstraint) &&
        !(queryConstraint instanceof QueryCompositeFilterConstraint)) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, `Function ${functionName}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`);
    }
}
function validateQueryConstraintArray(queryConstraint) {
    const compositeFilterCount = queryConstraint.filter(filter => filter instanceof QueryCompositeFilterConstraint).length;
    const fieldFilterCount = queryConstraint.filter(filter => filter instanceof QueryFieldFilterConstraint).length;
    if (compositeFilterCount > 1 ||
        (compositeFilterCount > 0 && fieldFilterCount > 0)) {
        throw new FirestoreError(Code.INVALID_ARGUMENT, 'InvalidQuery. When using composite filters, you cannot use ' +
            'more than one filter at the top level. Consider nesting the multiple ' +
            'filters within an `and(...)` statement. For example: ' +
            'change `query(query, where(...), or(...))` to ' +
            '`query(query, and(where(...), or(...)))`.');
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
 * Converts Firestore's internal types to the JavaScript types that we expose
 * to the user.
 *
 * @internal
 */
class AbstractUserDataWriter {
    convertValue(value, serverTimestampBehavior = 'none') {
        switch (typeOrder(value)) {
            case 0 /* TypeOrder.NullValue */:
                return null;
            case 1 /* TypeOrder.BooleanValue */:
                return value.booleanValue;
            case 2 /* TypeOrder.NumberValue */:
                return normalizeNumber(value.integerValue || value.doubleValue);
            case 3 /* TypeOrder.TimestampValue */:
                return this.convertTimestamp(value.timestampValue);
            case 4 /* TypeOrder.ServerTimestampValue */:
                return this.convertServerTimestamp(value, serverTimestampBehavior);
            case 5 /* TypeOrder.StringValue */:
                return value.stringValue;
            case 6 /* TypeOrder.BlobValue */:
                return this.convertBytes(normalizeByteString(value.bytesValue));
            case 7 /* TypeOrder.RefValue */:
                return this.convertReference(value.referenceValue);
            case 8 /* TypeOrder.GeoPointValue */:
                return this.convertGeoPoint(value.geoPointValue);
            case 9 /* TypeOrder.ArrayValue */:
                return this.convertArray(value.arrayValue, serverTimestampBehavior);
            case 11 /* TypeOrder.ObjectValue */:
                return this.convertObject(value.mapValue, serverTimestampBehavior);
            case 10 /* TypeOrder.VectorValue */:
                return this.convertVectorValue(value.mapValue);
            default:
                throw fail(0xf2a2, {
                    value
                });
        }
    }
    convertObject(mapValue, serverTimestampBehavior) {
        return this.convertObjectMap(mapValue.fields, serverTimestampBehavior);
    }
    /**
     * @internal
     */
    convertObjectMap(fields, serverTimestampBehavior = 'none') {
        const result = {};
        forEach(fields, (key, value) => {
            result[key] = this.convertValue(value, serverTimestampBehavior);
        });
        return result;
    }
    /**
     * @internal
     */
    convertVectorValue(mapValue) {
        const values = mapValue.fields?.[VECTOR_MAP_VECTORS_KEY].arrayValue?.values?.map(value => {
            return normalizeNumber(value.doubleValue);
        });
        return new VectorValue(values);
    }
    convertGeoPoint(value) {
        return new GeoPoint(normalizeNumber(value.latitude), normalizeNumber(value.longitude));
    }
    convertArray(arrayValue, serverTimestampBehavior) {
        return (arrayValue.values || []).map(value => this.convertValue(value, serverTimestampBehavior));
    }
    convertServerTimestamp(value, serverTimestampBehavior) {
        switch (serverTimestampBehavior) {
            case 'previous':
                const previousValue = getPreviousValue(value);
                if (previousValue == null) {
                    return null;
                }
                return this.convertValue(previousValue, serverTimestampBehavior);
            case 'estimate':
                return this.convertTimestamp(getLocalWriteTime(value));
            default:
                return null;
        }
    }
    convertTimestamp(value) {
        const normalizedValue = normalizeTimestamp(value);
        return new Timestamp(normalizedValue.seconds, normalizedValue.nanos);
    }
    convertDocumentKey(name, expectedDatabaseId) {
        const resourcePath = ResourcePath.fromString(name);
        hardAssert(isValidResourceName(resourcePath), 0x25d8, { name });
        const databaseId = new DatabaseId(resourcePath.get(1), resourcePath.get(3));
        const key = new DocumentKey(resourcePath.popFirst(5));
        if (!databaseId.isEqual(expectedDatabaseId)) {
            // TODO(b/64130202): Somehow support foreign references.
            logError(`Document ${key} contains a document ` +
                `reference within a different database (` +
                `${databaseId.projectId}/${databaseId.database}) which is not ` +
                `supported. It will be treated as a reference in the current ` +
                `database (${expectedDatabaseId.projectId}/${expectedDatabaseId.database}) ` +
                `instead.`);
        }
        return key;
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
 * Converts custom model object of type T into `DocumentData` by applying the
 * converter if it exists.
 *
 * This function is used when converting user objects to `DocumentData`
 * because we want to provide the user with a more specific error message if
 * their `set()` or fails due to invalid data originating from a `toFirestore()`
 * call.
 */
function applyFirestoreDataConverter(converter, value, options) {
    let convertedValue;
    if (converter) {
        if (options && (options.merge || options.mergeFields)) {
            // Cast to `any` in order to satisfy the union type constraint on
            // toFirestore().
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            convertedValue = converter.toFirestore(value, options);
        }
        else {
            convertedValue = converter.toFirestore(value);
        }
    }
    else {
        convertedValue = value;
    }
    return convertedValue;
}
class LiteUserDataWriter extends AbstractUserDataWriter {
    constructor(firestore) {
        super();
        this.firestore = firestore;
    }
    convertBytes(bytes) {
        return new Bytes(bytes);
    }
    convertReference(name) {
        const key = this.convertDocumentKey(name, this.firestore._databaseId);
        return new DocumentReference(this.firestore, /* converter= */ null, key);
    }
}
/**
 * Reads the document referred to by the specified document reference.
 *
 * All documents are directly fetched from the server, even if the document was
 * previously read or modified. Recent modifications are only reflected in the
 * retrieved `DocumentSnapshot` if they have already been applied by the
 * backend. If the client is offline, the read fails. If you like to use
 * caching or see local modifications, please use the full Firestore SDK.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A Promise resolved with a `DocumentSnapshot` containing the current
 * document contents.
 */
function getDoc(reference) {
    reference = cast(reference, DocumentReference);
    const datastore = getDatastore(reference.firestore);
    const userDataWriter = new LiteUserDataWriter(reference.firestore);
    return invokeBatchGetDocumentsRpc(datastore, [reference._key]).then(result => {
        hardAssert(result.length === 1, 0x3d02);
        const document = result[0];
        return new DocumentSnapshot(reference.firestore, userDataWriter, reference._key, document.isFoundDocument() ? document : null, reference.converter);
    });
}
/**
 * Executes the query and returns the results as a {@link QuerySnapshot}.
 *
 * All queries are executed directly by the server, even if the query was
 * previously executed. Recent modifications are only reflected in the retrieved
 * results if they have already been applied by the backend. If the client is
 * offline, the operation fails. To see previously cached result and local
 * modifications, use the full Firestore SDK.
 *
 * @param query - The `Query` to execute.
 * @returns A Promise that will be resolved with the results of the query.
 */
function getDocs(query) {
    query = cast(query, Query);
    validateHasExplicitOrderByForLimitToLast(query._query);
    const datastore = getDatastore(query.firestore);
    const userDataWriter = new LiteUserDataWriter(query.firestore);
    return invokeRunQueryRpc(datastore, query._query).then(result => {
        const docs = result.map(doc => new QueryDocumentSnapshot(query.firestore, userDataWriter, doc.key, doc, query.converter));
        if (query._query.limitType === "L" /* LimitType.Last */) {
            // Limit to last queries reverse the orderBy constraint that was
            // specified by the user. As such, we need to reverse the order of the
            // results to return the documents in the expected order.
            docs.reverse();
        }
        return new QuerySnapshot(query, docs);
    });
}
function setDoc(reference, data, options) {
    reference = cast(reference, DocumentReference);
    const convertedValue = applyFirestoreDataConverter(reference.converter, data, options);
    const dataReader = newUserDataReader(reference.firestore);
    const parsed = parseSetData(dataReader, 'setDoc', reference._key, convertedValue, reference.converter !== null, options);
    const datastore = getDatastore(reference.firestore);
    return invokeCommitRpc(datastore, [
        parsed.toMutation(reference._key, Precondition.none())
    ]);
}
function updateDoc(reference, fieldOrUpdateData, value, ...moreFieldsAndValues) {
    reference = cast(reference, DocumentReference);
    const dataReader = newUserDataReader(reference.firestore);
    // For Compat types, we have to "extract" the underlying types before
    // performing validation.
    fieldOrUpdateData = getModularInstance(fieldOrUpdateData);
    let parsed;
    if (typeof fieldOrUpdateData === 'string' ||
        fieldOrUpdateData instanceof FieldPath) {
        parsed = parseUpdateVarargs(dataReader, 'updateDoc', reference._key, fieldOrUpdateData, value, moreFieldsAndValues);
    }
    else {
        parsed = parseUpdateData(dataReader, 'updateDoc', reference._key, fieldOrUpdateData);
    }
    const datastore = getDatastore(reference.firestore);
    return invokeCommitRpc(datastore, [
        parsed.toMutation(reference._key, Precondition.exists(true))
    ]);
}
/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * The deletion will only be reflected in document reads that occur after the
 * returned promise resolves. If the client is offline, the
 * delete fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the document to delete.
 * @returns A `Promise` resolved once the document has been successfully
 * deleted from the backend.
 */
function deleteDoc(reference) {
    reference = cast(reference, DocumentReference);
    const datastore = getDatastore(reference.firestore);
    return invokeCommitRpc(datastore, [
        new DeleteMutation(reference._key, Precondition.none())
    ]);
}
/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * The result of this write will only be reflected in document reads that occur
 * after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @throws Error - If the provided input is not a valid Firestore document.
 * @returns A `Promise` resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend.
 */
function addDoc(reference, data) {
    reference = cast(reference, CollectionReference);
    const docRef = doc(reference);
    const convertedValue = applyFirestoreDataConverter(reference.converter, data);
    const dataReader = newUserDataReader(reference.firestore);
    const parsed = parseSetData(dataReader, 'addDoc', docRef._key, convertedValue, docRef.converter !== null, {});
    const datastore = getDatastore(reference.firestore);
    return invokeCommitRpc(datastore, [
        parsed.toMutation(docRef._key, Precondition.exists(false))
    ]).then(() => docRef);
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
 * Returns a sentinel for use with {@link @firebase/firestore/lite#(updateDoc:1)} or
 * {@link @firebase/firestore/lite#(setDoc:1)} with `{merge: true}` to mark a field for deletion.
 */
function deleteField() {
    return new DeleteFieldValueImpl('deleteField');
}
/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */
function serverTimestamp() {
    return new ServerTimestampFieldValueImpl('serverTimestamp');
}
/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to union the given elements with any array
 * value that already exists on the server. Each specified element that doesn't
 * already exist in the array will be added to the end. If the field being
 * modified is not already an array it will be overwritten with an array
 * containing exactly the specified elements.
 *
 * @param elements - The elements to union into the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`.
 */
function arrayUnion(...elements) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new ArrayUnionFieldValueImpl('arrayUnion', elements);
}
/**
 * Returns a special value that can be used with {@link (setDoc:1)} or {@link
 * updateDoc:1} that tells the server to remove the given elements from any
 * array value that already exists on the server. All instances of each element
 * specified will be removed from the array. If the field being modified is not
 * already an array it will be overwritten with an empty array.
 *
 * @param elements - The elements to remove from the array.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */
function arrayRemove(...elements) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new ArrayRemoveFieldValueImpl('arrayRemove', elements);
}
/**
 * Returns a special value that can be used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link
 * @firebase/firestore/lite#(updateDoc:1)} that tells the server to increment the field's current value by
 * the given value.
 *
 * If either the operand or the current field value uses floating point
 * precision, all arithmetic follows IEEE 754 semantics. If both values are
 * integers, values outside of JavaScript's safe number range
 * (`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`) are also subject to
 * precision loss. Furthermore, once processed by the Firestore backend, all
 * integer operations are capped between -2^63 and 2^63-1.
 *
 * If the current field value is not of type `number`, or if the field does not
 * yet exist, the transformation sets the field to the given value.
 *
 * @param n - The value to increment by.
 * @returns The `FieldValue` sentinel for use in a call to `setDoc()` or
 * `updateDoc()`
 */
function increment(n) {
    return new NumericIncrementFieldValueImpl('increment', n);
}
/**
 * Creates a new `VectorValue` constructed with a copy of the given array of numbers.
 *
 * @param values - Create a `VectorValue` instance with a copy of this array of numbers.
 *
 * @returns A new `VectorValue` constructed with a copy of the given array of numbers.
 */
function vector(values) {
    return new VectorValue(values);
}

export { arrayRemove as $, CollectionReference as A, Bytes as B, Code as C, DeleteMutation as D, DocumentReference as E, Firestore as F, FieldValue as G, GeoPoint as H, QueryCompositeFilterConstraint as I, QueryConstraint as J, QueryDocumentSnapshot as K, LiteAuthCredentialsProvider as L, QueryEndAtConstraint as M, QueryFieldFilterConstraint as N, ObjectValue as O, Precondition as P, Query as Q, QueryLimitConstraint as R, SnapshotVersion as S, QueryOrderByConstraint as T, QuerySnapshot as U, VerifyMutation as V, QueryStartAtConstraint as W, Timestamp as X, VectorValue as Y, addDoc as Z, and as _, LiteAppCheckTokenProvider as a, arrayUnion as a0, collection as a1, collectionGroup as a2, connectFirestoreEmulator as a3, deleteDoc as a4, deleteField as a5, doc as a6, documentId as a7, endAt as a8, endBefore as a9, isCollectionReference as aA, isNumber as aB, isPlainObject as aC, invokeExecutePipeline as aD, isCollectionGroupQuery as aE, isDocumentQuery as aF, queryNormalizedOrderBy as aG, toMapValue as aH, toNumber as aI, toPipelineValue as aJ, isUserData as aK, FieldPath$1 as aL, FieldFilter as aM, CompositeFilter as aN, getDoc as aa, getDocs as ab, getFirestore as ac, increment as ad, initializeFirestore as ae, limit as af, limitToLast as ag, or as ah, orderBy as ai, query as aj, refEqual as ak, serverTimestamp as al, setDoc as am, setLogLevel as an, snapshotEqual as ao, startAfter as ap, startAt as aq, terminate as ar, updateDoc as as, vector as at, where as au, isString as av, DOCUMENT_KEY_NAME as aw, hardAssert as ax, parseData as ay, toStringValue as az, LiteUserDataWriter as b, cast as c, databaseIdFromApp as d, applyFirestoreDataConverter as e, fieldPathFromArgument as f, getDatastore as g, FieldPath as h, invokeRunAggregationQueryRpc as i, parseUpdateVarargs as j, parseUpdateData as k, FirestoreError as l, mapToArray as m, newUserDataReader as n, invokeCommitRpc as o, parseSetData as p, queryEqual as q, fail as r, setSDKVersion as s, DocumentSnapshot as t, isNullOrUndefined as u, isPermanentError as v, logDebug as w, invokeBatchGetDocumentsRpc as x, DocumentKey as y, logError as z };
//# sourceMappingURL=common-88b59f52.node.mjs.map
