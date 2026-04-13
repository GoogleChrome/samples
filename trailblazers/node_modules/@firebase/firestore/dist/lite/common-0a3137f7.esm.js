import { FirebaseError, getDefaultEmulatorHostnameAndPort, isCloudWorkstation, pingServer, deepEqual, createMockUserToken, getModularInstance } from '@firebase/util';
import { Logger, LogLevel } from '@firebase/logger';
import { Integer } from '@firebase/webchannel-wrapper/bloom-blob';
import { _isFirebaseServerApp, _getProvider, getApp, _removeServiceInstance } from '@firebase/app';

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
 */ class User {
    constructor(e) {
        this.uid = e;
    }
    isAuthenticated() {
        return null != this.uid;
    }
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */    toKey() {
        return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
    isEqual(e) {
        return e.uid === this.uid;
    }
}

/** A user with a null UID. */ User.UNAUTHENTICATED = new User(null), 
// TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), 
User.MOCK_USER = new User("mock-user");

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
let f = "12.11.0";

function __PRIVATE_setSDKVersion(e) {
    f = e;
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
const d = new Logger("@firebase/firestore");

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
 */ function setLogLevel(e) {
    d.setLogLevel(e);
}

function __PRIVATE_logDebug(e, ...t) {
    if (d.logLevel <= LogLevel.DEBUG) {
        const r = t.map(__PRIVATE_argToString);
        d.debug(`Firestore (${f}): ${e}`, ...r);
    }
}

function __PRIVATE_logError(e, ...t) {
    if (d.logLevel <= LogLevel.ERROR) {
        const r = t.map(__PRIVATE_argToString);
        d.error(`Firestore (${f}): ${e}`, ...r);
    }
}

/**
 * @internal
 */ function __PRIVATE_logWarn(e, ...t) {
    if (d.logLevel <= LogLevel.WARN) {
        const r = t.map(__PRIVATE_argToString);
        d.warn(`Firestore (${f}): ${e}`, ...r);
    }
}

/**
 * Converts an additional log parameter to a string representation.
 */ function __PRIVATE_argToString(e) {
    if ("string" == typeof e) return e;
    try {
        return function __PRIVATE_formatJSON(e) {
            return JSON.stringify(e);
        }(e);
    } catch (t) {
        // Converting to JSON failed, just log the object directly
        return e;
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
 */ function fail(e, t, r) {
    let n = "Unexpected state";
    "string" == typeof t ? n = t : r = t, __PRIVATE__fail(e, n, r);
}

function __PRIVATE__fail(e, t, r) {
    // Log the failure in addition to throw an exception, just in case the
    // exception is swallowed.
    let n = `FIRESTORE (${f}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;
    if (void 0 !== r) try {
        n += " CONTEXT: " + JSON.stringify(r);
    } catch (e) {
        n += " CONTEXT: " + r;
    }
    // NOTE: We don't use FirestoreError here because these are internal failures
    // that cannot be handled by the user. (Also it would create a circular
    // dependency between the error and assert modules which doesn't work.)
    throw __PRIVATE_logError(n), new Error(n);
}

function __PRIVATE_hardAssert(e, t, r, n) {
    let i = "Unexpected state";
    "string" == typeof r ? i = r : n = r, e || __PRIVATE__fail(t, i, n);
}

/**
 * Casts `obj` to `T`. In non-production builds, verifies that `obj` is an
 * instance of `T` before casting.
 */ function __PRIVATE_debugCast(e, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
t) {
    return e;
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
 */ const E = {
    // Causes are copied from:
    // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
    /** Not an error; returned on success. */
    OK: "ok",
    /** The operation was cancelled (typically by the caller). */
    CANCELLED: "cancelled",
    /** Unknown error or an error from a different error domain. */
    UNKNOWN: "unknown",
    /**
     * Client specified an invalid argument. Note that this differs from
     * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
     * problematic regardless of the state of the system (e.g., a malformed file
     * name).
     */
    INVALID_ARGUMENT: "invalid-argument",
    /**
     * Deadline expired before operation could complete. For operations that
     * change the state of the system, this error may be returned even if the
     * operation has completed successfully. For example, a successful response
     * from a server could have been delayed long enough for the deadline to
     * expire.
     */
    DEADLINE_EXCEEDED: "deadline-exceeded",
    /** Some requested entity (e.g., file or directory) was not found. */
    NOT_FOUND: "not-found",
    /**
     * Some entity that we attempted to create (e.g., file or directory) already
     * exists.
     */
    ALREADY_EXISTS: "already-exists",
    /**
     * The caller does not have permission to execute the specified operation.
     * PERMISSION_DENIED must not be used for rejections caused by exhausting
     * some resource (use RESOURCE_EXHAUSTED instead for those errors).
     * PERMISSION_DENIED must not be used if the caller cannot be identified
     * (use UNAUTHENTICATED instead for those errors).
     */
    PERMISSION_DENIED: "permission-denied",
    /**
     * The request does not have valid authentication credentials for the
     * operation.
     */
    UNAUTHENTICATED: "unauthenticated",
    /**
     * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
     * entire file system is out of space.
     */
    RESOURCE_EXHAUSTED: "resource-exhausted",
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
    FAILED_PRECONDITION: "failed-precondition",
    /**
     * The operation was aborted, typically due to a concurrency issue like
     * sequencer check failures, transaction aborts, etc.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    ABORTED: "aborted",
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
    OUT_OF_RANGE: "out-of-range",
    /** Operation is not implemented or not supported/enabled in this service. */
    UNIMPLEMENTED: "unimplemented",
    /**
     * Internal errors. Means some invariants expected by underlying System has
     * been broken. If you see one of these errors, Something is very broken.
     */
    INTERNAL: "internal",
    /**
     * The service is currently unavailable. This is a most likely a transient
     * condition and may be corrected by retrying with a backoff.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
     * and UNAVAILABLE.
     */
    UNAVAILABLE: "unavailable",
    /** Unrecoverable data loss or corruption. */
    DATA_LOSS: "data-loss"
};

/** An error returned by a Firestore operation. */ class FirestoreError extends FirebaseError {
    /** @hideconstructor */
    constructor(
    /**
     * The backend error code associated with this error.
     */
    e, 
    /**
     * A custom error description.
     */
    t) {
        super(e, t), this.code = e, this.message = t, 
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
 */ class __PRIVATE_OAuthToken {
    constructor(e, t) {
        this.user = t, this.type = "OAuth", this.headers = new Map, this.headers.set("Authorization", `Bearer ${e}`);
    }
}

/**
 * A CredentialsProvider that always yields an empty token.
 * @internal
 */ class __PRIVATE_EmptyAuthCredentialsProvider {
    getToken() {
        return Promise.resolve(null);
    }
    invalidateToken() {}
    start(e, t) {
        // Fire with initial user.
        e.enqueueRetryable((() => t(User.UNAUTHENTICATED)));
    }
    shutdown() {}
}

/**
 * A CredentialsProvider that always returns a constant token. Used for
 * emulator token mocking.
 */ class __PRIVATE_EmulatorAuthCredentialsProvider {
    constructor(e) {
        this.token = e, 
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
    invalidateToken() {}
    start(e, t) {
        this.changeListener = t, 
        // Fire with initial user.
        e.enqueueRetryable((() => t(this.token.user)));
    }
    shutdown() {
        this.changeListener = null;
    }
}

/** Credential provider for the Lite SDK. */ class __PRIVATE_LiteAuthCredentialsProvider {
    constructor(e) {
        this.auth = null, e.onInit((e => {
            this.auth = e;
        }));
    }
    getToken() {
        return this.auth ? this.auth.getToken().then((e => e ? (__PRIVATE_hardAssert("string" == typeof e.accessToken, 42297, {
            t: e
        }), new __PRIVATE_OAuthToken(e.accessToken, new User(this.auth.getUid()))) : null)) : Promise.resolve(null);
    }
    invalidateToken() {}
    start(e, t) {}
    shutdown() {}
}

/*
 * FirstPartyToken provides a fresh token each time its value
 * is requested, because if the token is too old, requests will be rejected.
 * Technically this may no longer be necessary since the SDK should gracefully
 * recover from unauthenticated errors (see b/33147818 for context), but it's
 * safer to keep the implementation as-is.
 */ class __PRIVATE_FirstPartyToken {
    constructor(e, t, r) {
        this.i = e, this.o = t, this.u = r, this.type = "FirstParty", this.user = User.FIRST_PARTY, 
        this.l = new Map;
    }
    /**
     * Gets an authorization token, using a provided factory function, or return
     * null.
     */    h() {
        return this.u ? this.u() : null;
    }
    get headers() {
        this.l.set("X-Goog-AuthUser", this.i);
        // Use array notation to prevent minification
        const e = this.h();
        return e && this.l.set("Authorization", e), this.o && this.l.set("X-Goog-Iam-Authorization-Token", this.o), 
        this.l;
    }
}

/*
 * Provides user credentials required for the Firestore JavaScript SDK
 * to authenticate the user, using technique that is only available
 * to applications hosted by Google.
 */ class __PRIVATE_FirstPartyAuthCredentialsProvider {
    constructor(e, t, r) {
        this.i = e, this.o = t, this.u = r;
    }
    getToken() {
        return Promise.resolve(new __PRIVATE_FirstPartyToken(this.i, this.o, this.u));
    }
    start(e, t) {
        // Fire with initial uid.
        e.enqueueRetryable((() => t(User.FIRST_PARTY)));
    }
    shutdown() {}
    invalidateToken() {}
}

class AppCheckToken {
    constructor(e) {
        this.value = e, this.type = "AppCheck", this.headers = new Map, e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
    }
}

/** AppCheck token provider for the Lite SDK. */ class __PRIVATE_LiteAppCheckTokenProvider {
    constructor(e, t) {
        this.m = t, this.appCheck = null, this.P = null, _isFirebaseServerApp(e) && e.settings.appCheckToken && (this.P = e.settings.appCheckToken), 
        t.onInit((e => {
            this.appCheck = e;
        }));
    }
    getToken() {
        return this.P ? Promise.resolve(new AppCheckToken(this.P)) : this.appCheck ? this.appCheck.getToken().then((e => e ? (__PRIVATE_hardAssert("string" == typeof e.token, 3470, {
            tokenResult: e
        }), new AppCheckToken(e.token)) : null)) : Promise.resolve(null);
    }
    invalidateToken() {}
    start(e, t) {}
    shutdown() {}
}

/**
 * Builds a CredentialsProvider depending on the type of
 * the credentials passed in.
 */
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
    constructor(e, t, r, n, i, s, o, a, u, _, c) {
        this.databaseId = e, this.appId = t, this.persistenceKey = r, this.host = n, this.ssl = i, 
        this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = a, 
        this.useFetchStreams = u, this.isUsingEmulator = _, this.apiKey = c;
    }
}

/** The default database name for a project. */ const m = "(default)";

/**
 * Represents the database ID a Firestore client is associated with.
 * @internal
 */ class DatabaseId {
    constructor(e, t) {
        this.projectId = e, this.database = t || m;
    }
    static empty() {
        return new DatabaseId("", "");
    }
    get isDefaultDatabase() {
        return this.database === m;
    }
    isEqual(e) {
        return e instanceof DatabaseId && e.projectId === this.projectId && e.database === this.database;
    }
}

function __PRIVATE_databaseIdFromApp(e, t) {
    if (!Object.prototype.hasOwnProperty.apply(e.options, [ "projectId" ])) throw new FirestoreError(E.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
    return new DatabaseId(e.options.projectId, t);
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
 */ function __PRIVATE_randomBytes(e) {
    // Polyfills for IE and WebWorker by using `self` and `msCrypto` when `crypto` is not available.
    const t = 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "undefined" != typeof self && (self.crypto || self.msCrypto), r = new Uint8Array(e);
    if (t && "function" == typeof t.getRandomValues) t.getRandomValues(r); else 
    // Falls back to Math.random
    for (let t = 0; t < e; t++) r[t] = Math.floor(256 * Math.random());
    return r;
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
 */ class __PRIVATE_AutoId {
    static newId() {
        // Alphanumeric characters
        const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = 62 * Math.floor(256 / 62);
        // The largest byte value that is a multiple of `char.length`.
                let r = "";
        for (;r.length < 20; ) {
            const n = __PRIVATE_randomBytes(40);
            for (let i = 0; i < n.length; ++i) 
            // Only accept values that are [0, maxMultiple), this ensures they can
            // be evenly mapped to indices of `chars` via a modulo operation.
            r.length < 20 && n[i] < t && (r += e.charAt(n[i] % 62));
        }
        return r;
    }
}

function __PRIVATE_primitiveComparator(e, t) {
    return e < t ? -1 : e > t ? 1 : 0;
}

/** Compare strings in UTF-8 encoded byte order */ function __PRIVATE_compareUtf8Strings(e, t) {
    // Find the first differing character (a.k.a. "UTF-16 code unit") in the two strings and,
    // if found, use that character to determine the relative ordering of the two strings as a
    // whole. Comparing UTF-16 strings in UTF-8 byte order can be done simply and efficiently by
    // comparing the UTF-16 code units (chars). This serendipitously works because of the way UTF-8
    // and UTF-16 happen to represent Unicode code points.
    // After finding the first pair of differing characters, there are two cases:
    // Case 1: Both characters are non-surrogates (code points less than or equal to 0xFFFF) or
    // both are surrogates from a surrogate pair (that collectively represent code points greater
    // than 0xFFFF). In this case their numeric order as UTF-16 code units is the same as the
    // lexicographical order of their corresponding UTF-8 byte sequences. A direct comparison is
    // sufficient.
    // Case 2: One character is a surrogate and the other is not. In this case the surrogate-
    // containing string is always ordered after the non-surrogate. This is because surrogates are
    // used to represent code points greater than 0xFFFF which have 4-byte UTF-8 representations
    // and are lexicographically greater than the 1, 2, or 3-byte representations of code points
    // less than or equal to 0xFFFF.
    // An example of why Case 2 is required is comparing the following two Unicode code points:
    // |-----------------------|------------|---------------------|-----------------|
    // | Name                  | Code Point | UTF-8 Encoding      | UTF-16 Encoding |
    // |-----------------------|------------|---------------------|-----------------|
    // | Replacement Character | U+FFFD     | 0xEF 0xBF 0xBD      | 0xFFFD          |
    // | Grinning Face         | U+1F600    | 0xF0 0x9F 0x98 0x80 | 0xD83D 0xDE00   |
    // |-----------------------|------------|---------------------|-----------------|
    // A lexicographical comparison of the UTF-8 encodings of these code points would order
    // "Replacement Character" _before_ "Grinning Face" because 0xEF is less than 0xF0. However, a
    // direct comparison of the UTF-16 code units, as would be done in case 1, would erroneously
    // produce the _opposite_ ordering, because 0xFFFD is _greater than_ 0xD83D. As it turns out,
    // this relative ordering holds for all comparisons of UTF-16 code points requiring a surrogate
    // pair with those that do not.
    const r = Math.min(e.length, t.length);
    for (let n = 0; n < r; n++) {
        const r = e.charAt(n), i = t.charAt(n);
        if (r !== i) return __PRIVATE_isSurrogate(r) === __PRIVATE_isSurrogate(i) ? __PRIVATE_primitiveComparator(r, i) : __PRIVATE_isSurrogate(r) ? 1 : -1;
    }
    // Use the lengths of the strings to determine the overall comparison result since either the
    // strings were equal or one is a prefix of the other.
        return __PRIVATE_primitiveComparator(e.length, t.length);
}

const P = 55296, T = 57343;

function __PRIVATE_isSurrogate(e) {
    const t = e.charCodeAt(0);
    return t >= P && t <= T;
}

/** Helper to compare arrays using isEqual(). */ function __PRIVATE_arrayEquals(e, t, r) {
    return e.length === t.length && e.every(((e, n) => r(e, t[n])));
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
 */ const R = "__name__";

/**
 * Path represents an ordered sequence of string segments.
 */ class BasePath {
    constructor(e, t, r) {
        void 0 === t ? t = 0 : t > e.length && fail(637, {
            offset: t,
            range: e.length
        }), void 0 === r ? r = e.length - t : r > e.length - t && fail(1746, {
            length: r,
            range: e.length - t
        }), this.segments = e, this.offset = t, this.len = r;
    }
    get length() {
        return this.len;
    }
    isEqual(e) {
        return 0 === BasePath.comparator(this, e);
    }
    child(e) {
        const t = this.segments.slice(this.offset, this.limit());
        return e instanceof BasePath ? e.forEach((e => {
            t.push(e);
        })) : t.push(e), this.construct(t);
    }
    /** The index of one past the last segment of the path. */    limit() {
        return this.offset + this.length;
    }
    popFirst(e) {
        return e = void 0 === e ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
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
    get(e) {
        return this.segments[this.offset + e];
    }
    isEmpty() {
        return 0 === this.length;
    }
    isPrefixOf(e) {
        if (e.length < this.length) return !1;
        for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
        return !0;
    }
    isImmediateParentOf(e) {
        if (this.length + 1 !== e.length) return !1;
        for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
        return !0;
    }
    forEach(e) {
        for (let t = this.offset, r = this.limit(); t < r; t++) e(this.segments[t]);
    }
    toArray() {
        return this.segments.slice(this.offset, this.limit());
    }
    /**
     * Compare 2 paths segment by segment, prioritizing numeric IDs
     * (e.g., "__id123__") in numeric ascending order, followed by string
     * segments in lexicographical order.
     */    static comparator(e, t) {
        const r = Math.min(e.length, t.length);
        for (let n = 0; n < r; n++) {
            const r = BasePath.compareSegments(e.get(n), t.get(n));
            if (0 !== r) return r;
        }
        return __PRIVATE_primitiveComparator(e.length, t.length);
    }
    static compareSegments(e, t) {
        const r = BasePath.isNumericId(e), n = BasePath.isNumericId(t);
        return r && !n ? -1 : !r && n ? 1 : r && n ? BasePath.extractNumericId(e).compare(BasePath.extractNumericId(t)) : __PRIVATE_compareUtf8Strings(e, t);
    }
    // Checks if a segment is a numeric ID (starts with "__id" and ends with "__").
    static isNumericId(e) {
        return e.startsWith("__id") && e.endsWith("__");
    }
    static extractNumericId(e) {
        return Integer.fromString(e.substring(4, e.length - 2));
    }
}

/**
 * A slash-separated path for navigating resources (documents and collections)
 * within Firestore.
 *
 * @internal
 */ class ResourcePath extends BasePath {
    construct(e, t, r) {
        return new ResourcePath(e, t, r);
    }
    canonicalString() {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        return this.toArray().join("/");
    }
    toString() {
        return this.canonicalString();
    }
    /**
     * Returns a string representation of this path
     * where each path segment has been encoded with
     * `encodeURIComponent`.
     */    toUriEncodedString() {
        return this.toArray().map(encodeURIComponent).join("/");
    }
    /**
     * Creates a resource path from the given slash-delimited string. If multiple
     * arguments are provided, all components are combined. Leading and trailing
     * slashes from all components are ignored.
     */    static fromString(...e) {
        // NOTE: The client is ignorant of any path segments containing escape
        // sequences (e.g. __id123__) and just passes them through raw (they exist
        // for legacy reasons and should not be used frequently).
        const t = [];
        for (const r of e) {
            if (r.indexOf("//") >= 0) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid segment (${r}). Paths must not contain // in them.`);
            // Strip leading and trailing slashed.
                        t.push(...r.split("/").filter((e => e.length > 0)));
        }
        return new ResourcePath(t);
    }
    static emptyPath() {
        return new ResourcePath([]);
    }
}

const V = /^[_a-zA-Z][_a-zA-Z0-9]*$/;

/**
 * A dot-separated path for navigating sub-objects within a document.
 * @internal
 */ class FieldPath$1 extends BasePath {
    construct(e, t, r) {
        return new FieldPath$1(e, t, r);
    }
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */    static isValidIdentifier(e) {
        return V.test(e);
    }
    canonicalString() {
        return this.toArray().map((e => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), 
        FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e))).join(".");
    }
    toString() {
        return this.canonicalString();
    }
    /**
     * Returns true if this field references the key of a document.
     */    isKeyField() {
        return 1 === this.length && this.get(0) === R;
    }
    /**
     * The field designating the key of a document.
     */    static keyField() {
        return new FieldPath$1([ R ]);
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
     */    static fromServerFormat(e) {
        const t = [];
        let r = "", n = 0;
        const __PRIVATE_addCurrentSegment = () => {
            if (0 === r.length) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
            t.push(r), r = "";
        };
        let i = !1;
        for (;n < e.length; ) {
            const t = e[n];
            if ("\\" === t) {
                if (n + 1 === e.length) throw new FirestoreError(E.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
                const t = e[n + 1];
                if ("\\" !== t && "." !== t && "`" !== t) throw new FirestoreError(E.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
                r += t, n += 2;
            } else "`" === t ? (i = !i, n++) : "." !== t || i ? (r += t, n++) : (__PRIVATE_addCurrentSegment(), 
            n++);
        }
        if (__PRIVATE_addCurrentSegment(), i) throw new FirestoreError(E.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
        return new FieldPath$1(t);
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
 */ class DocumentKey {
    constructor(e) {
        this.path = e;
    }
    static fromPath(e) {
        return new DocumentKey(ResourcePath.fromString(e));
    }
    static fromName(e) {
        return new DocumentKey(ResourcePath.fromString(e).popFirst(5));
    }
    static empty() {
        return new DocumentKey(ResourcePath.emptyPath());
    }
    get collectionGroup() {
        return this.path.popLast().lastSegment();
    }
    /** Returns true if the document is in the specified collectionId. */    hasCollectionId(e) {
        return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
    }
    /** Returns the collection group (i.e. the name of the parent collection) for this key. */    getCollectionGroup() {
        return this.path.get(this.path.length - 2);
    }
    /** Returns the fully qualified path to the parent collection. */    getCollectionPath() {
        return this.path.popLast();
    }
    isEqual(e) {
        return null !== e && 0 === ResourcePath.comparator(this.path, e.path);
    }
    toString() {
        return this.path.toString();
    }
    static comparator(e, t) {
        return ResourcePath.comparator(e.path, t.path);
    }
    static isDocumentKey(e) {
        return e.length % 2 == 0;
    }
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */    static fromSegments(e) {
        return new DocumentKey(new ResourcePath(e.slice()));
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
 */ function __PRIVATE_validateNonEmptyArgument(e, t, r) {
    if (!r) throw new FirestoreError(E.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
}

/**
 * Validates that two boolean options are not set at the same time.
 * @internal
 */
/**
 * Validates that `path` refers to a document (indicated by the fact it contains
 * an even numbers of segments).
 */
function __PRIVATE_validateDocumentPath(e) {
    if (!DocumentKey.isDocumentKey(e)) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
}

/**
 * Validates that `path` refers to a collection (indicated by the fact it
 * contains an odd numbers of segments).
 */ function __PRIVATE_validateCollectionPath(e) {
    if (DocumentKey.isDocumentKey(e)) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
}

/**
 * Returns true if it's a non-null object without a custom prototype
 * (i.e. excludes Array, Date, etc.).
 */ function __PRIVATE_isPlainObject(e) {
    return "object" == typeof e && null !== e && (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e));
}

/** Returns a string describing the type / value of the provided input. */ function __PRIVATE_valueDescription(e) {
    if (void 0 === e) return "undefined";
    if (null === e) return "null";
    if ("string" == typeof e) return e.length > 20 && (e = `${e.substring(0, 20)}...`), 
    JSON.stringify(e);
    if ("number" == typeof e || "boolean" == typeof e) return "" + e;
    if ("object" == typeof e) {
        if (e instanceof Array) return "an array";
        {
            const t = 
            /** try to get the constructor name for an object. */
            function __PRIVATE_tryGetCustomObjectType(e) {
                if (e.constructor) return e.constructor.name;
                return null;
            }
            /**
 * Casts `obj` to `T`, optionally unwrapping Compat types to expose the
 * underlying instance. Throws if  `obj` is not an instance of `T`.
 *
 * This cast is used in the Lite and Full SDK to verify instance types for
 * arguments passed to the public API.
 * @internal
 */ (e);
            return t ? `a custom ${t} object` : "an object";
        }
    }
    return "function" == typeof e ? "a function" : fail(12329, {
        type: typeof e
    });
}

function __PRIVATE_cast(e, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
t) {
    if ("_delegate" in e && (
    // Unwrap Compat types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    e = e._delegate), !(e instanceof t)) {
        if (t.name === e.constructor.name) throw new FirestoreError(E.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
        {
            const r = __PRIVATE_valueDescription(e);
            throw new FirestoreError(E.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${r}`);
        }
    }
    return e;
}

function __PRIVATE_validatePositiveNumber(e, t) {
    if (t <= 0) throw new FirestoreError(E.INVALID_ARGUMENT, `Function ${e}() requires a positive number, but it was: ${t}.`);
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
/**
 * Creates and returns a new `ExperimentalLongPollingOptions` with the same
 * option values as the given instance.
 */
function __PRIVATE_cloneLongPollingOptions(e) {
    const t = {};
    return void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t;
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
 */ let A = null;

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
function __PRIVATE_generateUniqueDebugId() {
    return null === A ? A = function __PRIVATE_generateInitialUniqueDebugId() {
        return 268435456 + Math.round(2147483648 * Math.random());
    }() : A++, "0x" + A.toString(16);
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
 */ function __PRIVATE_isNullOrUndefined(e) {
    return null == e;
}

/** Returns whether the value represents -0. */ function __PRIVATE_isNegativeZero(e) {
    // Detect if the value is -0.0. Based on polyfill from
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    return 0 === e && 1 / e == -1 / 0;
}

function __PRIVATE_isNumber(e) {
    return "number" == typeof e;
}

/**
 * Returns whether a value is an integer and in the safe integer range
 * @param value - The value to test for being an integer and in the safe range
 */ function __PRIVATE_isString(e) {
    return "string" == typeof e;
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
 */ const I = "RestConnection", p = {
    BatchGetDocuments: "batchGet",
    Commit: "commit",
    RunQuery: "runQuery",
    RunAggregationQuery: "runAggregationQuery",
    ExecutePipeline: "executePipeline"
};

/**
 * Maps RPC names to the corresponding REST endpoint name.
 *
 * We use array notation to avoid mangling.
 */
/**
 * Base class for all Rest-based connections to the backend (WebChannel and
 * HTTP).
 */
class __PRIVATE_RestConnection {
    get T() {
        // Both `invokeRPC()` and `invokeStreamingRPC()` use their `path` arguments to determine
        // where to run the query, and expect the `request` to NOT specify the "path".
        return !1;
    }
    constructor(e) {
        this.databaseInfo = e, this.databaseId = e.databaseId;
        const t = e.ssl ? "https" : "http", r = encodeURIComponent(this.databaseId.projectId), n = encodeURIComponent(this.databaseId.database);
        this.R = t + "://" + e.host, this.V = `projects/${r}/databases/${n}`, this.A = this.databaseId.database === m ? `project_id=${r}` : `project_id=${r}&database_id=${n}`;
    }
    I(e, r, n, i, s) {
        const o = __PRIVATE_generateUniqueDebugId(), a = this.p(e, r.toUriEncodedString());
        __PRIVATE_logDebug(I, `Sending RPC '${e}' ${o}:`, a, n);
        const u = {
            "google-cloud-resource-prefix": this.V,
            "x-goog-request-params": this.A
        };
        this.F(u, i, s);
        const {host: _} = new URL(a), c = isCloudWorkstation(_);
        return this.v(e, a, u, n, c).then((t => (__PRIVATE_logDebug(I, `Received RPC '${e}' ${o}: `, t), 
        t)), (t => {
            throw __PRIVATE_logWarn(I, `RPC '${e}' ${o} failed with error: `, t, "url: ", a, "request:", n), 
            t;
        }));
    }
    D(e, t, r, n, i, s) {
        // The REST API automatically aggregates all of the streamed results, so we
        // can just use the normal invoke() method.
        return this.I(e, t, r, n, i);
    }
    /**
     * Modifies the headers for a request, adding any authorization token if
     * present and any additional headers for the request.
     */    F(e, t, r) {
        e["X-Goog-Api-Client"] = 
        // SDK_VERSION is updated to different value at runtime depending on the entry point,
        // so we need to get its value when we need it in a function.
        function __PRIVATE_getGoogApiClientValue() {
            return "gl-js/ fire/" + f;
        }(), 
        // Content-Type: text/plain will avoid preflight requests which might
        // mess with CORS and redirects by proxies. If we add custom headers
        // we will need to change this code to potentially use the $httpOverwrite
        // parameter supported by ESF to avoid triggering preflight requests.
        e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), 
        t && t.headers.forEach(((t, r) => e[r] = t)), r && r.headers.forEach(((t, r) => e[r] = t));
    }
    p(e, t) {
        const r = p[e];
        let n = `${this.R}/v1/${t}:${r}`;
        return this.databaseInfo.apiKey && (n = `${n}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`), 
        n;
    }
    /**
     * Closes and cleans up any resources associated with the connection. This
     * implementation is a no-op because there are no resources associated
     * with the RestConnection that need to be cleaned up.
     */    terminate() {
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
 */ var y, w;

/**
 * Determines whether an error code represents a permanent error when received
 * in response to a non-write operation.
 *
 * See isPermanentWriteError for classifying write errors.
 */
function __PRIVATE_isPermanentError(e) {
    switch (e) {
      case E.OK:
        return fail(64938);

      case E.CANCELLED:
      case E.UNKNOWN:
      case E.DEADLINE_EXCEEDED:
      case E.RESOURCE_EXHAUSTED:
      case E.INTERNAL:
      case E.UNAVAILABLE:
 // Unauthenticated means something went wrong with our token and we need
        // to retry with new credentials which will happen automatically.
              case E.UNAUTHENTICATED:
        return !1;

      case E.INVALID_ARGUMENT:
      case E.NOT_FOUND:
      case E.ALREADY_EXISTS:
      case E.PERMISSION_DENIED:
      case E.FAILED_PRECONDITION:
 // Aborted might be retried in some scenarios, but that is dependent on
        // the context and should handled individually by the calling code.
        // See https://cloud.google.com/apis/design/errors.
              case E.ABORTED:
      case E.OUT_OF_RANGE:
      case E.UNIMPLEMENTED:
      case E.DATA_LOSS:
        return !0;

      default:
        return fail(15467, {
            code: e
        });
    }
}

/**
 * Converts an HTTP Status Code to the equivalent error code.
 *
 * @param status - An HTTP Status Code, like 200, 404, 503, etc.
 * @returns The equivalent Code. Unknown status codes are mapped to
 *     Code.UNKNOWN.
 */ function __PRIVATE_mapCodeFromHttpStatus(e) {
    if (void 0 === e) return __PRIVATE_logError("RPC_ERROR", "HTTP error has no status"), 
    E.UNKNOWN;
    // The canonical error codes for Google APIs [1] specify mapping onto HTTP
    // status codes but the mapping is not bijective. In each case of ambiguity
    // this function chooses a primary error.
    
    // [1]
    // https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
        switch (e) {
      case 200:
        // OK
        return E.OK;

      case 400:
        // Bad Request
        return E.FAILED_PRECONDITION;

        // Other possibilities based on the forward mapping
        // return Code.INVALID_ARGUMENT;
        // return Code.OUT_OF_RANGE;
              case 401:
        // Unauthorized
        return E.UNAUTHENTICATED;

      case 403:
        // Forbidden
        return E.PERMISSION_DENIED;

      case 404:
        // Not Found
        return E.NOT_FOUND;

      case 409:
        // Conflict
        return E.ABORTED;

        // Other possibilities:
        // return Code.ALREADY_EXISTS;
              case 416:
        // Range Not Satisfiable
        return E.OUT_OF_RANGE;

      case 429:
        // Too Many Requests
        return E.RESOURCE_EXHAUSTED;

      case 499:
        // Client Closed Request
        return E.CANCELLED;

      case 500:
        // Internal Server Error
        return E.UNKNOWN;

        // Other possibilities:
        // return Code.INTERNAL;
        // return Code.DATA_LOSS;
              case 501:
        // Unimplemented
        return E.UNIMPLEMENTED;

      case 503:
        // Service Unavailable
        return E.UNAVAILABLE;

      case 504:
        // Gateway Timeout
        return E.DEADLINE_EXCEEDED;

      default:
        return e >= 200 && e < 300 ? E.OK : e >= 400 && e < 500 ? E.FAILED_PRECONDITION : e >= 500 && e < 600 ? E.INTERNAL : E.UNKNOWN;
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
 */ (w = y || (y = {}))[w.OK = 0] = "OK", w[w.CANCELLED = 1] = "CANCELLED", w[w.UNKNOWN = 2] = "UNKNOWN", 
w[w.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", w[w.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", 
w[w.NOT_FOUND = 5] = "NOT_FOUND", w[w.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", w[w.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", 
w[w.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", w[w.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", 
w[w.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", w[w.ABORTED = 10] = "ABORTED", 
w[w.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", w[w.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", 
w[w.INTERNAL = 13] = "INTERNAL", w[w.UNAVAILABLE = 14] = "UNAVAILABLE", w[w.DATA_LOSS = 15] = "DATA_LOSS";

class __PRIVATE_FetchConnection extends __PRIVATE_RestConnection {
    S(e, t) {
        throw new Error("Not supported by FetchConnection");
    }
    async v(e, t, r, n, i) {
        const s = JSON.stringify(n);
        let o;
        try {
            const e = {
                method: "POST",
                headers: r,
                body: s
            };
            i && (e.credentials = "include"), o = await fetch(t, e);
        } catch (e) {
            const t = e;
            throw new FirestoreError(__PRIVATE_mapCodeFromHttpStatus(t.status), "Request failed with error: " + t.statusText);
        }
        if (!o.ok) {
            let e = await o.json();
            Array.isArray(e) && (e = e[0]);
            const t = e?.error?.message;
            throw new FirestoreError(__PRIVATE_mapCodeFromHttpStatus(o.status), `Request failed with error: ${t ?? o.statusText}`);
        }
        return o.json();
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
function __PRIVATE_objectSize(e) {
    let t = 0;
    for (const r in e) Object.prototype.hasOwnProperty.call(e, r) && t++;
    return t;
}

function forEach(e, t) {
    for (const r in e) Object.prototype.hasOwnProperty.call(e, r) && t(r, e[r]);
}

function __PRIVATE_mapToArray(e, t) {
    const r = [];
    for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && r.push(t(e[n], n, e));
    return r;
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
 * An error encountered while decoding base64 string.
 */
class __PRIVATE_Base64DecodeError extends Error {
    constructor() {
        super(...arguments), this.name = "Base64DecodeError";
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
/** Converts a Base64 encoded string to a binary string. */
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
    constructor(e) {
        this.binaryString = e;
    }
    static fromBase64String(e) {
        const t = function __PRIVATE_decodeBase64(e) {
            try {
                return atob(e);
            } catch (e) {
                // Check that `DOMException` is defined before using it to avoid
                // "ReferenceError: Property 'DOMException' doesn't exist" in react-native.
                // (https://github.com/firebase/firebase-js-sdk/issues/7115)
                throw "undefined" != typeof DOMException && e instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e) : e;
            }
        }
        /** Converts a binary string to a Base64 encoded string. */ (e);
        return new ByteString(t);
    }
    static fromUint8Array(e) {
        // TODO(indexing); Remove the copy of the byte string here as this method
        // is frequently called during indexing.
        const t = 
        /**
 * Helper function to convert an Uint8array to a binary string.
 */
        function __PRIVATE_binaryStringFromUint8Array(e) {
            let t = "";
            for (let r = 0; r < e.length; ++r) t += String.fromCharCode(e[r]);
            return t;
        }
        /**
 * Helper function to convert a binary string to an Uint8Array.
 */ (e);
        return new ByteString(t);
    }
    [Symbol.iterator]() {
        let e = 0;
        return {
            next: () => e < this.binaryString.length ? {
                value: this.binaryString.charCodeAt(e++),
                done: !1
            } : {
                value: void 0,
                done: !0
            }
        };
    }
    toBase64() {
        return function __PRIVATE_encodeBase64(e) {
            return btoa(e);
        }(this.binaryString);
    }
    toUint8Array() {
        return function __PRIVATE_uint8ArrayFromBinaryString(e) {
            const t = new Uint8Array(e.length);
            for (let r = 0; r < e.length; r++) t[r] = e.charCodeAt(r);
            return t;
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
        (this.binaryString);
    }
    approximateByteSize() {
        return 2 * this.binaryString.length;
    }
    compareTo(e) {
        return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
    }
    isEqual(e) {
        return this.binaryString === e.binaryString;
    }
}

ByteString.EMPTY_BYTE_STRING = new ByteString("");

const g = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);

/**
 * Converts the possible Proto values for a timestamp value into a "seconds and
 * nanos" representation.
 */ function __PRIVATE_normalizeTimestamp(e) {
    // The json interface (for the browser) will return an iso timestamp string,
    // while the proto js library (for node) will return a
    // google.protobuf.Timestamp instance.
    if (__PRIVATE_hardAssert(!!e, 39018), "string" == typeof e) {
        // The date string can have higher precision (nanos) than the Date class
        // (millis), so we do some custom parsing here.
        // Parse the nanos right out of the string.
        let t = 0;
        const r = g.exec(e);
        if (__PRIVATE_hardAssert(!!r, 46558, {
            timestamp: e
        }), r[1]) {
            // Pad the fraction out to 9 digits (nanos).
            let e = r[1];
            e = (e + "000000000").substr(0, 9), t = Number(e);
        }
        // Parse the date to get the seconds.
                const n = new Date(e);
        return {
            seconds: Math.floor(n.getTime() / 1e3),
            nanos: t
        };
    }
    return {
        seconds: __PRIVATE_normalizeNumber(e.seconds),
        nanos: __PRIVATE_normalizeNumber(e.nanos)
    };
}

/**
 * Converts the possible Proto types for numbers into a JavaScript number.
 * Returns 0 if the value is not numeric.
 */ function __PRIVATE_normalizeNumber(e) {
    // TODO(bjornick): Handle int64 greater than 53 bits.
    return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
}

/** Converts the possible Proto types for Blobs into a ByteString. */ function __PRIVATE_normalizeByteString(e) {
    return "string" == typeof e ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
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
 */ function property(e, t) {
    const r = {
        typeString: e
    };
    return t && (r.value = t), r;
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
 */ function __PRIVATE_validateJSON(e, t) {
    if (!__PRIVATE_isPlainObject(e)) throw new FirestoreError(E.INVALID_ARGUMENT, "JSON must be an object");
    let r;
    for (const n in t) if (t[n]) {
        const i = t[n].typeString, s = "value" in t[n] ? {
            value: t[n].value
        } : void 0;
        if (!(n in e)) {
            r = `JSON missing required field: '${n}'`;
            break;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const o = e[n];
        if (i && typeof o !== i) {
            r = `JSON field '${n}' must be a ${i}.`;
            break;
        }
        if (void 0 !== s && o !== s.value) {
            r = `Expected '${n}' field to equal '${s.value}'`;
            break;
        }
    }
    if (r) throw new FirestoreError(E.INVALID_ARGUMENT, r);
    return !0;
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
const F = -62135596800, v = 1e6;

// Number of nanoseconds in a millisecond.
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
     */    static fromDate(e) {
        return Timestamp.fromMillis(e.getTime());
    }
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */    static fromMillis(e) {
        const t = Math.floor(e / 1e3), r = Math.floor((e - 1e3 * t) * v);
        return new Timestamp(t, r);
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
     */    constructor(
    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    e, 
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    t) {
        if (this.seconds = e, this.nanoseconds = t, t < 0) throw new FirestoreError(E.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
        if (t >= 1e9) throw new FirestoreError(E.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
        if (e < F) throw new FirestoreError(E.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
        // This will break in the year 10,000.
                if (e >= 253402300800) throw new FirestoreError(E.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    }
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */    toDate() {
        return new Date(this.toMillis());
    }
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */    toMillis() {
        return 1e3 * this.seconds + this.nanoseconds / v;
    }
    _compareTo(e) {
        return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
    }
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */    isEqual(e) {
        return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
    }
    /** Returns a textual representation of this `Timestamp`. */    toString() {
        return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
    }
    /**
     * Returns a JSON-serializable representation of this `Timestamp`.
     */    toJSON() {
        return {
            type: Timestamp._jsonSchemaVersion,
            seconds: this.seconds,
            nanoseconds: this.nanoseconds
        };
    }
    /**
     * Builds a `Timestamp` instance from a JSON object created by {@link Timestamp.toJSON}.
     */    static fromJSON(e) {
        if (__PRIVATE_validateJSON(e, Timestamp._jsonSchema)) return new Timestamp(e.seconds, e.nanoseconds);
    }
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */    valueOf() {
        // This method returns a string of the form <seconds>.<nanoseconds> where
        // <seconds> is translated to have a non-negative value and both <seconds>
        // and <nanoseconds> are left-padded with zeroes to be a consistent length.
        // Strings with this format then have a lexicographical ordering that matches
        // the expected ordering. The <seconds> translation is done to avoid having
        // a leading negative sign (i.e. a leading '-' character) in its string
        // representation, which would affect its lexicographical ordering.
        const e = this.seconds - F;
        // Note: Up to 12 decimal digits are required to represent all valid
        // 'seconds' values.
                return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
    }
}

Timestamp._jsonSchemaVersion = "firestore/timestamp/1.0", Timestamp._jsonSchema = {
    type: property("string", Timestamp._jsonSchemaVersion),
    seconds: property("number"),
    nanoseconds: property("number")
};

function __PRIVATE_isServerTimestamp(e) {
    const t = (e?.mapValue?.fields || {}).__type__?.stringValue;
    return "server_timestamp" === t;
}

/**
 * Returns the value of the field before this ServerTimestamp was set.
 *
 * Preserving the previous values allows the user to display the last resoled
 * value until the backend responds with the timestamp.
 */ function __PRIVATE_getPreviousValue(e) {
    const t = e.mapValue.fields.__previous_value__;
    return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
}

/**
 * Returns the local time at which this timestamp was first set.
 */ function __PRIVATE_getLocalWriteTime(e) {
    const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields.__local_write_time__.timestampValue);
    return new Timestamp(t.seconds, t.nanos);
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
 */ const b = "__type__", D = "__max__", S = {
    fields: {
        __type__: {
            stringValue: D
        }
    }
}, C = "__vector__", N = "value";

/** Extracts the backend's type order for the provided value. */
function __PRIVATE_typeOrder(e) {
    return "nullValue" in e ? 0 /* TypeOrder.NullValue */ : "booleanValue" in e ? 1 /* TypeOrder.BooleanValue */ : "integerValue" in e || "doubleValue" in e ? 2 /* TypeOrder.NumberValue */ : "timestampValue" in e ? 3 /* TypeOrder.TimestampValue */ : "stringValue" in e ? 5 /* TypeOrder.StringValue */ : "bytesValue" in e ? 6 /* TypeOrder.BlobValue */ : "referenceValue" in e ? 7 /* TypeOrder.RefValue */ : "geoPointValue" in e ? 8 /* TypeOrder.GeoPointValue */ : "arrayValue" in e ? 9 /* TypeOrder.ArrayValue */ : "mapValue" in e ? __PRIVATE_isServerTimestamp(e) ? 4 /* TypeOrder.ServerTimestampValue */ : 
    /** Returns true if the Value represents the canonical {@link #MAX_VALUE} . */
    function __PRIVATE_isMaxValue(e) {
        return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === D;
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
 */ (e) ? 9007199254740991 /* TypeOrder.MaxValue */ : 
    /** Returns true if `value` is a VetorValue. */
    function __PRIVATE_isVectorValue(e) {
        const t = (e?.mapValue?.fields || {})[b]?.stringValue;
        return t === C;
    }
    /** Creates a deep copy of `source`. */ (e) ? 10 /* TypeOrder.VectorValue */ : 11 /* TypeOrder.ObjectValue */ : fail(28295, {
        value: e
    });
}

/** Tests `left` and `right` for equality based on the backend semantics. */ function __PRIVATE_valueEquals(e, t) {
    if (e === t) return !0;
    const r = __PRIVATE_typeOrder(e);
    if (r !== __PRIVATE_typeOrder(t)) return !1;
    switch (r) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return !0;

      case 1 /* TypeOrder.BooleanValue */ :
        return e.booleanValue === t.booleanValue;

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));

      case 3 /* TypeOrder.TimestampValue */ :
        return function __PRIVATE_timestampEquals(e, t) {
            if ("string" == typeof e.timestampValue && "string" == typeof t.timestampValue && e.timestampValue.length === t.timestampValue.length) 
            // Use string equality for ISO 8601 timestamps
            return e.timestampValue === t.timestampValue;
            const r = __PRIVATE_normalizeTimestamp(e.timestampValue), n = __PRIVATE_normalizeTimestamp(t.timestampValue);
            return r.seconds === n.seconds && r.nanos === n.nanos;
        }(e, t);

      case 5 /* TypeOrder.StringValue */ :
        return e.stringValue === t.stringValue;

      case 6 /* TypeOrder.BlobValue */ :
        return function __PRIVATE_blobEquals(e, t) {
            return __PRIVATE_normalizeByteString(e.bytesValue).isEqual(__PRIVATE_normalizeByteString(t.bytesValue));
        }(e, t);

      case 7 /* TypeOrder.RefValue */ :
        return e.referenceValue === t.referenceValue;

      case 8 /* TypeOrder.GeoPointValue */ :
        return function __PRIVATE_geoPointEquals(e, t) {
            return __PRIVATE_normalizeNumber(e.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t.geoPointValue.longitude);
        }(e, t);

      case 2 /* TypeOrder.NumberValue */ :
        return function __PRIVATE_numberEquals(e, t) {
            if ("integerValue" in e && "integerValue" in t) return __PRIVATE_normalizeNumber(e.integerValue) === __PRIVATE_normalizeNumber(t.integerValue);
            if ("doubleValue" in e && "doubleValue" in t) {
                const r = __PRIVATE_normalizeNumber(e.doubleValue), n = __PRIVATE_normalizeNumber(t.doubleValue);
                return r === n ? __PRIVATE_isNegativeZero(r) === __PRIVATE_isNegativeZero(n) : isNaN(r) && isNaN(n);
            }
            return !1;
        }(e, t);

      case 9 /* TypeOrder.ArrayValue */ :
        return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], __PRIVATE_valueEquals);

      case 10 /* TypeOrder.VectorValue */ :
      case 11 /* TypeOrder.ObjectValue */ :
        return function __PRIVATE_objectEquals(e, t) {
            const r = e.mapValue.fields || {}, n = t.mapValue.fields || {};
            if (__PRIVATE_objectSize(r) !== __PRIVATE_objectSize(n)) return !1;
            for (const e in r) if (r.hasOwnProperty(e) && (void 0 === n[e] || !__PRIVATE_valueEquals(r[e], n[e]))) return !1;
            return !0;
        }
        /** Returns true if the ArrayValue contains the specified element. */ (e, t);

      default:
        return fail(52216, {
            left: e
        });
    }
}

function __PRIVATE_arrayValueContains(e, t) {
    return void 0 !== (e.values || []).find((e => __PRIVATE_valueEquals(e, t)));
}

function __PRIVATE_valueCompare(e, t) {
    if (e === t) return 0;
    const r = __PRIVATE_typeOrder(e), n = __PRIVATE_typeOrder(t);
    if (r !== n) return __PRIVATE_primitiveComparator(r, n);
    switch (r) {
      case 0 /* TypeOrder.NullValue */ :
      case 9007199254740991 /* TypeOrder.MaxValue */ :
        return 0;

      case 1 /* TypeOrder.BooleanValue */ :
        return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);

      case 2 /* TypeOrder.NumberValue */ :
        return function __PRIVATE_compareNumbers(e, t) {
            const r = __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue), n = __PRIVATE_normalizeNumber(t.integerValue || t.doubleValue);
            return r < n ? -1 : r > n ? 1 : r === n ? 0 : 
            // one or both are NaN.
            isNaN(r) ? isNaN(n) ? 0 : -1 : 1;
        }(e, t);

      case 3 /* TypeOrder.TimestampValue */ :
        return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);

      case 4 /* TypeOrder.ServerTimestampValue */ :
        return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));

      case 5 /* TypeOrder.StringValue */ :
        return __PRIVATE_compareUtf8Strings(e.stringValue, t.stringValue);

      case 6 /* TypeOrder.BlobValue */ :
        return function __PRIVATE_compareBlobs(e, t) {
            const r = __PRIVATE_normalizeByteString(e), n = __PRIVATE_normalizeByteString(t);
            return r.compareTo(n);
        }(e.bytesValue, t.bytesValue);

      case 7 /* TypeOrder.RefValue */ :
        return function __PRIVATE_compareReferences(e, t) {
            const r = e.split("/"), n = t.split("/");
            for (let e = 0; e < r.length && e < n.length; e++) {
                const t = __PRIVATE_primitiveComparator(r[e], n[e]);
                if (0 !== t) return t;
            }
            return __PRIVATE_primitiveComparator(r.length, n.length);
        }(e.referenceValue, t.referenceValue);

      case 8 /* TypeOrder.GeoPointValue */ :
        return function __PRIVATE_compareGeoPoints(e, t) {
            const r = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(t.latitude));
            if (0 !== r) return r;
            return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e.longitude), __PRIVATE_normalizeNumber(t.longitude));
        }(e.geoPointValue, t.geoPointValue);

      case 9 /* TypeOrder.ArrayValue */ :
        return __PRIVATE_compareArrays(e.arrayValue, t.arrayValue);

      case 10 /* TypeOrder.VectorValue */ :
        return function __PRIVATE_compareVectors(e, t) {
            const r = e.fields || {}, n = t.fields || {}, i = r[N]?.arrayValue, s = n[N]?.arrayValue, o = __PRIVATE_primitiveComparator(i?.values?.length || 0, s?.values?.length || 0);
            if (0 !== o) return o;
            return __PRIVATE_compareArrays(i, s);
        }(e.mapValue, t.mapValue);

      case 11 /* TypeOrder.ObjectValue */ :
        return function __PRIVATE_compareMaps(e, t) {
            if (e === S && t === S) return 0;
            if (e === S) return 1;
            if (t === S) return -1;
            const r = e.fields || {}, n = Object.keys(r), i = t.fields || {}, s = Object.keys(i);
            // Even though MapValues are likely sorted correctly based on their insertion
            // order (e.g. when received from the backend), local modifications can bring
            // elements out of order. We need to re-sort the elements to ensure that
            // canonical IDs are independent of insertion order.
            n.sort(), s.sort();
            for (let e = 0; e < n.length && e < s.length; ++e) {
                const t = __PRIVATE_compareUtf8Strings(n[e], s[e]);
                if (0 !== t) return t;
                const o = __PRIVATE_valueCompare(r[n[e]], i[s[e]]);
                if (0 !== o) return o;
            }
            return __PRIVATE_primitiveComparator(n.length, s.length);
        }
        /** Returns a reference value for the provided database and key. */ (e.mapValue, t.mapValue);

      default:
        throw fail(23264, {
            C: r
        });
    }
}

function __PRIVATE_compareTimestamps(e, t) {
    if ("string" == typeof e && "string" == typeof t && e.length === t.length) return __PRIVATE_primitiveComparator(e, t);
    const r = __PRIVATE_normalizeTimestamp(e), n = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(r.seconds, n.seconds);
    return 0 !== i ? i : __PRIVATE_primitiveComparator(r.nanos, n.nanos);
}

function __PRIVATE_compareArrays(e, t) {
    const r = e.values || [], n = t.values || [];
    for (let e = 0; e < r.length && e < n.length; ++e) {
        const t = __PRIVATE_valueCompare(r[e], n[e]);
        if (t) return t;
    }
    return __PRIVATE_primitiveComparator(r.length, n.length);
}

function __PRIVATE_refValue(e, t) {
    return {
        referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`
    };
}

/** Returns true if `value` is an ArrayValue. */ function isArray(e) {
    return !!e && "arrayValue" in e;
}

/** Returns true if `value` is a NullValue. */ function __PRIVATE_isNullValue(e) {
    return !!e && "nullValue" in e;
}

/** Returns true if `value` is NaN. */ function __PRIVATE_isNanValue(e) {
    return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
}

/** Returns true if `value` is a MapValue. */ function __PRIVATE_isMapValue(e) {
    return !!e && "mapValue" in e;
}

function __PRIVATE_deepClone(e) {
    if (e.geoPointValue) return {
        geoPointValue: {
            ...e.geoPointValue
        }
    };
    if (e.timestampValue && "object" == typeof e.timestampValue) return {
        timestampValue: {
            ...e.timestampValue
        }
    };
    if (e.mapValue) {
        const t = {
            mapValue: {
                fields: {}
            }
        };
        return forEach(e.mapValue.fields, ((e, r) => t.mapValue.fields[e] = __PRIVATE_deepClone(r))), 
        t;
    }
    if (e.arrayValue) {
        const t = {
            arrayValue: {
                values: []
            }
        };
        for (let r = 0; r < (e.arrayValue.values || []).length; ++r) t.arrayValue.values[r] = __PRIVATE_deepClone(e.arrayValue.values[r]);
        return t;
    }
    return {
        ...e
    };
}

class Bound {
    constructor(e, t) {
        this.position = e, this.inclusive = t;
    }
}

function __PRIVATE_boundEquals(e, t) {
    if (null === e) return null === t;
    if (null === t) return !1;
    if (e.inclusive !== t.inclusive || e.position.length !== t.position.length) return !1;
    for (let r = 0; r < e.position.length; r++) {
        if (!__PRIVATE_valueEquals(e.position[r], t.position[r])) return !1;
    }
    return !0;
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
 */ class Filter {}

class FieldFilter extends Filter {
    constructor(e, t, r) {
        super(), this.field = e, this.op = t, this.value = r;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    static create(e, t, r) {
        return e.isKeyField() ? "in" /* Operator.IN */ === t || "not-in" /* Operator.NOT_IN */ === t ? this.createKeyFieldInFilter(e, t, r) : new __PRIVATE_KeyFieldFilter(e, t, r) : "array-contains" /* Operator.ARRAY_CONTAINS */ === t ? new __PRIVATE_ArrayContainsFilter(e, r) : "in" /* Operator.IN */ === t ? new __PRIVATE_InFilter(e, r) : "not-in" /* Operator.NOT_IN */ === t ? new __PRIVATE_NotInFilter(e, r) : "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === t ? new __PRIVATE_ArrayContainsAnyFilter(e, r) : new FieldFilter(e, t, r);
    }
    static createKeyFieldInFilter(e, t, r) {
        return "in" /* Operator.IN */ === t ? new __PRIVATE_KeyFieldInFilter(e, r) : new __PRIVATE_KeyFieldNotInFilter(e, r);
    }
    matches(e) {
        const t = e.data.field(this.field);
        // Types do not have to match in NOT_EQUAL filters.
                return "!=" /* Operator.NOT_EQUAL */ === this.op ? null !== t && void 0 === t.nullValue && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : null !== t && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
        // Only compare types with matching backend order (such as double and int).
        }
    matchesComparison(e) {
        switch (this.op) {
          case "<" /* Operator.LESS_THAN */ :
            return e < 0;

          case "<=" /* Operator.LESS_THAN_OR_EQUAL */ :
            return e <= 0;

          case "==" /* Operator.EQUAL */ :
            return 0 === e;

          case "!=" /* Operator.NOT_EQUAL */ :
            return 0 !== e;

          case ">" /* Operator.GREATER_THAN */ :
            return e > 0;

          case ">=" /* Operator.GREATER_THAN_OR_EQUAL */ :
            return e >= 0;

          default:
            return fail(47266, {
                operator: this.op
            });
        }
    }
    isInequality() {
        return [ "<" /* Operator.LESS_THAN */ , "<=" /* Operator.LESS_THAN_OR_EQUAL */ , ">" /* Operator.GREATER_THAN */ , ">=" /* Operator.GREATER_THAN_OR_EQUAL */ , "!=" /* Operator.NOT_EQUAL */ , "not-in" /* Operator.NOT_IN */ ].indexOf(this.op) >= 0;
    }
    getFlattenedFilters() {
        return [ this ];
    }
    getFilters() {
        return [ this ];
    }
}

class CompositeFilter extends Filter {
    constructor(e, t) {
        super(), this.filters = e, this.op = t, this.N = null;
    }
    /**
     * Creates a filter based on the provided arguments.
     */    static create(e, t) {
        return new CompositeFilter(e, t);
    }
    matches(e) {
        return function __PRIVATE_compositeFilterIsConjunction(e) {
            return "and" /* CompositeOperator.AND */ === e.op;
        }(this) ? void 0 === this.filters.find((t => !t.matches(e))) : void 0 !== this.filters.find((t => t.matches(e)));
    }
    getFlattenedFilters() {
        return null !== this.N || (this.N = this.filters.reduce(((e, t) => e.concat(t.getFlattenedFilters())), [])), 
        this.N;
    }
    // Returns a mutable copy of `this.filters`
    getFilters() {
        return Object.assign([], this.filters);
    }
}

function __PRIVATE_filterEquals(e, t) {
    return e instanceof FieldFilter ? function __PRIVATE_fieldFilterEquals(e, t) {
        return t instanceof FieldFilter && e.op === t.op && e.field.isEqual(t.field) && __PRIVATE_valueEquals(e.value, t.value);
    }(e, t) : e instanceof CompositeFilter ? function __PRIVATE_compositeFilterEquals(e, t) {
        if (t instanceof CompositeFilter && e.op === t.op && e.filters.length === t.filters.length) {
            return e.filters.reduce(((e, r, n) => e && __PRIVATE_filterEquals(r, t.filters[n])), !0);
        }
        return !1;
    }
    /** Filter that matches on key fields (i.e. '__name__'). */ (e, t) : void fail(19439);
}

class __PRIVATE_KeyFieldFilter extends FieldFilter {
    constructor(e, t, r) {
        super(e, t, r), this.key = DocumentKey.fromName(r.referenceValue);
    }
    matches(e) {
        const t = DocumentKey.comparator(e.key, this.key);
        return this.matchesComparison(t);
    }
}

/** Filter that matches on key fields within an array. */ class __PRIVATE_KeyFieldInFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "in" /* Operator.IN */ , t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in" /* Operator.IN */ , t);
    }
    matches(e) {
        return this.keys.some((t => t.isEqual(e.key)));
    }
}

/** Filter that matches on key fields not present within an array. */ class __PRIVATE_KeyFieldNotInFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "not-in" /* Operator.NOT_IN */ , t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in" /* Operator.NOT_IN */ , t);
    }
    matches(e) {
        return !this.keys.some((t => t.isEqual(e.key)));
    }
}

function __PRIVATE_extractDocumentKeysFromArrayValue(e, t) {
    return (t.arrayValue?.values || []).map((e => DocumentKey.fromName(e.referenceValue)));
}

/** A Filter that implements the array-contains operator. */ class __PRIVATE_ArrayContainsFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "array-contains" /* Operator.ARRAY_CONTAINS */ , t);
    }
    matches(e) {
        const t = e.data.field(this.field);
        return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
    }
}

/** A Filter that implements the IN operator. */ class __PRIVATE_InFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "in" /* Operator.IN */ , t);
    }
    matches(e) {
        const t = e.data.field(this.field);
        return null !== t && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
    }
}

/** A Filter that implements the not-in operator. */ class __PRIVATE_NotInFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "not-in" /* Operator.NOT_IN */ , t);
    }
    matches(e) {
        if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
            nullValue: "NULL_VALUE"
        })) return !1;
        const t = e.data.field(this.field);
        return null !== t && void 0 === t.nullValue && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
    }
}

/** A Filter that implements the array-contains-any operator. */ class __PRIVATE_ArrayContainsAnyFilter extends FieldFilter {
    constructor(e, t) {
        super(e, "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ , t);
    }
    matches(e) {
        const t = e.data.field(this.field);
        return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some((e => __PRIVATE_arrayValueContains(this.value.arrayValue, e)));
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
 */ class OrderBy {
    constructor(e, t = "asc" /* Direction.ASCENDING */) {
        this.field = e, this.dir = t;
    }
}

function __PRIVATE_orderByEquals(e, t) {
    return e.dir === t.dir && e.field.isEqual(t.field);
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
 */ class SnapshotVersion {
    static fromTimestamp(e) {
        return new SnapshotVersion(e);
    }
    static min() {
        return new SnapshotVersion(new Timestamp(0, 0));
    }
    static max() {
        return new SnapshotVersion(new Timestamp(253402300799, 999999999));
    }
    constructor(e) {
        this.timestamp = e;
    }
    compareTo(e) {
        return this.timestamp._compareTo(e.timestamp);
    }
    isEqual(e) {
        return this.timestamp.isEqual(e.timestamp);
    }
    /** Returns a number representation of the version for use in spec tests. */    toMicroseconds() {
        // Convert to microseconds.
        return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
    }
    toString() {
        return "SnapshotVersion(" + this.timestamp.toString() + ")";
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
    constructor(e, t) {
        this.comparator = e, this.root = t || LLRBNode.EMPTY;
    }
    // Returns a copy of the map, with the specified key/value added or replaced.
    insert(e, t) {
        return new SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns a copy of the map, with the specified key removed.
    remove(e) {
        return new SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
    }
    // Returns the value of the node with the given key, or null.
    get(e) {
        let t = this.root;
        for (;!t.isEmpty(); ) {
            const r = this.comparator(e, t.key);
            if (0 === r) return t.value;
            r < 0 ? t = t.left : r > 0 && (t = t.right);
        }
        return null;
    }
    // Returns the index of the element in this sorted map, or -1 if it doesn't
    // exist.
    indexOf(e) {
        // Number of nodes that were pruned when descending right
        let t = 0, r = this.root;
        for (;!r.isEmpty(); ) {
            const n = this.comparator(e, r.key);
            if (0 === n) return t + r.left.size;
            n < 0 ? r = r.left : (
            // Count all nodes left of the node plus the node itself
            t += r.left.size + 1, r = r.right);
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
    inorderTraversal(e) {
        return this.root.inorderTraversal(e);
    }
    forEach(e) {
        this.inorderTraversal(((t, r) => (e(t, r), !1)));
    }
    toString() {
        const e = [];
        return this.inorderTraversal(((t, r) => (e.push(`${t}:${r}`), !1))), `{${e.join(", ")}}`;
    }
    // Traverses the map in reverse key order and calls the specified action
    // function for each key/value pair. If action returns true, traversal is
    // aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(e) {
        return this.root.reverseTraversal(e);
    }
    // Returns an iterator over the SortedMap.
    getIterator() {
        return new SortedMapIterator(this.root, null, this.comparator, !1);
    }
    getIteratorFrom(e) {
        return new SortedMapIterator(this.root, e, this.comparator, !1);
    }
    getReverseIterator() {
        return new SortedMapIterator(this.root, null, this.comparator, !0);
    }
    getReverseIteratorFrom(e) {
        return new SortedMapIterator(this.root, e, this.comparator, !0);
    }
}

 // end SortedMap
// An iterator over an LLRBNode.
class SortedMapIterator {
    constructor(e, t, r, n) {
        this.isReverse = n, this.nodeStack = [];
        let i = 1;
        for (;!e.isEmpty(); ) if (i = t ? r(e.key, t) : 1, 
        // flip the comparison if we're going in reverse
        t && n && (i *= -1), i < 0) 
        // This node is less than our start key. ignore it
        e = this.isReverse ? e.left : e.right; else {
            if (0 === i) {
                // This node is exactly equal to our start key. Push it on the stack,
                // but stop iterating;
                this.nodeStack.push(e);
                break;
            }
            // This node is greater than our start key, add it to the stack and move
            // to the next one
            this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
        }
    }
    getNext() {
        let e = this.nodeStack.pop();
        const t = {
            key: e.key,
            value: e.value
        };
        if (this.isReverse) for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), e = e.right; else for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), 
        e = e.left;
        return t;
    }
    hasNext() {
        return this.nodeStack.length > 0;
    }
    peek() {
        if (0 === this.nodeStack.length) return null;
        const e = this.nodeStack[this.nodeStack.length - 1];
        return {
            key: e.key,
            value: e.value
        };
    }
}

 // end SortedMapIterator
// Represents a node in a Left-leaning Red-Black tree.
class LLRBNode {
    constructor(e, t, r, n, i) {
        this.key = e, this.value = t, this.color = null != r ? r : LLRBNode.RED, this.left = null != n ? n : LLRBNode.EMPTY, 
        this.right = null != i ? i : LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
    }
    // Returns a copy of the current node, optionally replacing pieces of it.
    copy(e, t, r, n, i) {
        return new LLRBNode(null != e ? e : this.key, null != t ? t : this.value, null != r ? r : this.color, null != n ? n : this.left, null != i ? i : this.right);
    }
    isEmpty() {
        return !1;
    }
    // Traverses the tree in key order and calls the specified action function
    // for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    inorderTraversal(e) {
        return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
    }
    // Traverses the tree in reverse key order and calls the specified action
    // function for each node. If action returns true, traversal is aborted.
    // Returns the first truthy value returned by action, or the last falsey
    // value returned by action.
    reverseTraversal(e) {
        return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
    }
    // Returns the minimum node in the tree.
    min() {
        return this.left.isEmpty() ? this : this.left.min();
    }
    // Returns the maximum key in the tree.
    minKey() {
        return this.min().key;
    }
    // Returns the maximum key in the tree.
    maxKey() {
        return this.right.isEmpty() ? this.key : this.right.maxKey();
    }
    // Returns new tree, with the key/value added.
    insert(e, t, r) {
        let n = this;
        const i = r(e, n.key);
        return n = i < 0 ? n.copy(null, null, null, n.left.insert(e, t, r), null) : 0 === i ? n.copy(null, t, null, null, null) : n.copy(null, null, null, null, n.right.insert(e, t, r)), 
        n.fixUp();
    }
    removeMin() {
        if (this.left.isEmpty()) return LLRBNode.EMPTY;
        let e = this;
        return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), 
        e.fixUp();
    }
    // Returns new tree, with the specified item removed.
    remove(e, t) {
        let r, n = this;
        if (t(e, n.key) < 0) n.left.isEmpty() || n.left.isRed() || n.left.left.isRed() || (n = n.moveRedLeft()), 
        n = n.copy(null, null, null, n.left.remove(e, t), null); else {
            if (n.left.isRed() && (n = n.rotateRight()), n.right.isEmpty() || n.right.isRed() || n.right.left.isRed() || (n = n.moveRedRight()), 
            0 === t(e, n.key)) {
                if (n.right.isEmpty()) return LLRBNode.EMPTY;
                r = n.right.min(), n = n.copy(r.key, r.value, null, null, n.right.removeMin());
            }
            n = n.copy(null, null, null, null, n.right.remove(e, t));
        }
        return n.fixUp();
    }
    isRed() {
        return this.color;
    }
    // Returns new tree after performing any needed rotations.
    fixUp() {
        let e = this;
        return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), 
        e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
    }
    moveRedLeft() {
        let e = this.colorFlip();
        return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), 
        e = e.rotateLeft(), e = e.colorFlip()), e;
    }
    moveRedRight() {
        let e = this.colorFlip();
        return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
    }
    rotateLeft() {
        const e = this.copy(null, null, LLRBNode.RED, null, this.right.left);
        return this.right.copy(null, null, this.color, e, null);
    }
    rotateRight() {
        const e = this.copy(null, null, LLRBNode.RED, this.left.right, null);
        return this.left.copy(null, null, this.color, null, e);
    }
    colorFlip() {
        const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
        return this.copy(null, null, !this.color, e, t);
    }
    // For testing.
    checkMaxDepth() {
        const e = this.check();
        return Math.pow(2, e) <= this.size + 1;
    }
    // In a balanced RB tree, the black-depth (number of black nodes) from root to
    // leaves is equal on both sides.  This function verifies that or asserts.
    check() {
        if (this.isRed() && this.left.isRed()) throw fail(43730, {
            key: this.key,
            value: this.value
        });
        if (this.right.isRed()) throw fail(14113, {
            key: this.key,
            value: this.value
        });
        const e = this.left.check();
        if (e !== this.right.check()) throw fail(27949);
        return e + (this.isRed() ? 0 : 1);
    }
}

 // end LLRBNode
// Empty node is shared between all LLRB trees.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
LLRBNode.EMPTY = null, LLRBNode.RED = !0, LLRBNode.BLACK = !1;

// end LLRBEmptyNode
LLRBNode.EMPTY = new 
// Represents an empty node (a leaf node in the Red-Black Tree).
class LLRBEmptyNode {
    constructor() {
        this.size = 0;
    }
    get key() {
        throw fail(57766);
    }
    get value() {
        throw fail(16141);
    }
    get color() {
        throw fail(16727);
    }
    get left() {
        throw fail(29726);
    }
    get right() {
        throw fail(36894);
    }
    // Returns a copy of the current node.
    copy(e, t, r, n, i) {
        return this;
    }
    // Returns a copy of the tree, with the specified key/value added.
    insert(e, t, r) {
        return new LLRBNode(e, t);
    }
    // Returns a copy of the tree, with the specified key removed.
    remove(e, t) {
        return this;
    }
    isEmpty() {
        return !0;
    }
    inorderTraversal(e) {
        return !1;
    }
    reverseTraversal(e) {
        return !1;
    }
    minKey() {
        return null;
    }
    maxKey() {
        return null;
    }
    isRed() {
        return !1;
    }
    // For testing.
    checkMaxDepth() {
        return !0;
    }
    check() {
        return 0;
    }
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
 * SortedSet is an immutable (copy-on-write) collection that holds elements
 * in order specified by the provided comparator.
 *
 * NOTE: if provided comparator returns 0 for two elements, we consider them to
 * be equal!
 */
class SortedSet {
    constructor(e) {
        this.comparator = e, this.data = new SortedMap(this.comparator);
    }
    has(e) {
        return null !== this.data.get(e);
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
    indexOf(e) {
        return this.data.indexOf(e);
    }
    /** Iterates elements in order defined by "comparator" */    forEach(e) {
        this.data.inorderTraversal(((t, r) => (e(t), !1)));
    }
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */    forEachInRange(e, t) {
        const r = this.data.getIteratorFrom(e[0]);
        for (;r.hasNext(); ) {
            const n = r.getNext();
            if (this.comparator(n.key, e[1]) >= 0) return;
            t(n.key);
        }
    }
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */    forEachWhile(e, t) {
        let r;
        for (r = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); r.hasNext(); ) {
            if (!e(r.getNext().key)) return;
        }
    }
    /** Finds the least element greater than or equal to `elem`. */    firstAfterOrEqual(e) {
        const t = this.data.getIteratorFrom(e);
        return t.hasNext() ? t.getNext().key : null;
    }
    getIterator() {
        return new SortedSetIterator(this.data.getIterator());
    }
    getIteratorFrom(e) {
        return new SortedSetIterator(this.data.getIteratorFrom(e));
    }
    /** Inserts or updates an element */    add(e) {
        return this.copy(this.data.remove(e).insert(e, !0));
    }
    /** Deletes an element */    delete(e) {
        return this.has(e) ? this.copy(this.data.remove(e)) : this;
    }
    isEmpty() {
        return this.data.isEmpty();
    }
    unionWith(e) {
        let t = this;
        // Make sure `result` always refers to the larger one of the two sets.
                return t.size < e.size && (t = e, e = this), e.forEach((e => {
            t = t.add(e);
        })), t;
    }
    isEqual(e) {
        if (!(e instanceof SortedSet)) return !1;
        if (this.size !== e.size) return !1;
        const t = this.data.getIterator(), r = e.data.getIterator();
        for (;t.hasNext(); ) {
            const e = t.getNext().key, n = r.getNext().key;
            if (0 !== this.comparator(e, n)) return !1;
        }
        return !0;
    }
    toArray() {
        const e = [];
        return this.forEach((t => {
            e.push(t);
        })), e;
    }
    toString() {
        const e = [];
        return this.forEach((t => e.push(t))), "SortedSet(" + e.toString() + ")";
    }
    copy(e) {
        const t = new SortedSet(this.comparator);
        return t.data = e, t;
    }
}

class SortedSetIterator {
    constructor(e) {
        this.iter = e;
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
 */ class FieldMask {
    constructor(e) {
        this.fields = e, 
        // TODO(dimond): validation of FieldMask
        // Sort the field mask to support `FieldMask.isEqual()` and assert below.
        e.sort(FieldPath$1.comparator);
    }
    static empty() {
        return new FieldMask([]);
    }
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */    unionWith(e) {
        let t = new SortedSet(FieldPath$1.comparator);
        for (const e of this.fields) t = t.add(e);
        for (const r of e) t = t.add(r);
        return new FieldMask(t.toArray());
    }
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */    covers(e) {
        for (const t of this.fields) if (t.isPrefixOf(e)) return !0;
        return !1;
    }
    isEqual(e) {
        return __PRIVATE_arrayEquals(this.fields, e.fields, ((e, t) => e.isEqual(t)));
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
 */ class ObjectValue {
    constructor(e) {
        this.value = e;
    }
    static empty() {
        return new ObjectValue({
            mapValue: {}
        });
    }
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */    field(e) {
        if (e.isEmpty()) return this.value;
        {
            let t = this.value;
            for (let r = 0; r < e.length - 1; ++r) if (t = (t.mapValue.fields || {})[e.get(r)], 
            !__PRIVATE_isMapValue(t)) return null;
            return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
        }
    }
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */    set(e, t) {
        this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
    }
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */    setAll(e) {
        let t = FieldPath$1.emptyPath(), r = {}, n = [];
        e.forEach(((e, i) => {
            if (!t.isImmediateParentOf(i)) {
                // Insert the accumulated changes at this parent location
                const e = this.getFieldsMap(t);
                this.applyChanges(e, r, n), r = {}, n = [], t = i.popLast();
            }
            e ? r[i.lastSegment()] = __PRIVATE_deepClone(e) : n.push(i.lastSegment());
        }));
        const i = this.getFieldsMap(t);
        this.applyChanges(i, r, n);
    }
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */    delete(e) {
        const t = this.field(e.popLast());
        __PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
    }
    isEqual(e) {
        return __PRIVATE_valueEquals(this.value, e.value);
    }
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */    getFieldsMap(e) {
        let t = this.value;
        t.mapValue.fields || (t.mapValue = {
            fields: {}
        });
        for (let r = 0; r < e.length; ++r) {
            let n = t.mapValue.fields[e.get(r)];
            __PRIVATE_isMapValue(n) && n.mapValue.fields || (n = {
                mapValue: {
                    fields: {}
                }
            }, t.mapValue.fields[e.get(r)] = n), t = n;
        }
        return t.mapValue.fields;
    }
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */    applyChanges(e, t, r) {
        forEach(t, ((t, r) => e[t] = r));
        for (const t of r) delete e[t];
    }
    clone() {
        return new ObjectValue(__PRIVATE_deepClone(this.value));
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
 */ class MutableDocument {
    constructor(e, t, r, n, i, s, o) {
        this.key = e, this.documentType = t, this.version = r, this.readTime = n, this.createTime = i, 
        this.data = s, this.documentState = o;
    }
    /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */    static newInvalidDocument(e) {
        return new MutableDocument(e, 0 /* DocumentType.INVALID */ , 
        /* version */ SnapshotVersion.min(), 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */    static newFoundDocument(e, t, r, n) {
        return new MutableDocument(e, 1 /* DocumentType.FOUND_DOCUMENT */ , 
        /* version */ t, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ r, n, 0 /* DocumentState.SYNCED */);
    }
    /** Creates a new document that is known to not exist at the given version. */    static newNoDocument(e, t) {
        return new MutableDocument(e, 2 /* DocumentType.NO_DOCUMENT */ , 
        /* version */ t, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 0 /* DocumentState.SYNCED */);
    }
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */    static newUnknownDocument(e, t) {
        return new MutableDocument(e, 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
        /* version */ t, 
        /* readTime */ SnapshotVersion.min(), 
        /* createTime */ SnapshotVersion.min(), ObjectValue.empty(), 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */);
    }
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */    convertToFoundDocument(e, t) {
        // If a document is switching state from being an invalid or deleted
        // document to a valid (FOUND_DOCUMENT) document, either due to receiving an
        // update from Watch or due to applying a local set mutation on top
        // of a deleted document, our best guess about its createTime would be the
        // version at which the document transitioned to a FOUND_DOCUMENT.
        return !this.createTime.isEqual(SnapshotVersion.min()) || 2 /* DocumentType.NO_DOCUMENT */ !== this.documentType && 0 /* DocumentType.INVALID */ !== this.documentType || (this.createTime = e), 
        this.version = e, this.documentType = 1 /* DocumentType.FOUND_DOCUMENT */ , this.data = t, 
        this.documentState = 0 /* DocumentState.SYNCED */ , this;
    }
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */    convertToNoDocument(e) {
        return this.version = e, this.documentType = 2 /* DocumentType.NO_DOCUMENT */ , 
        this.data = ObjectValue.empty(), this.documentState = 0 /* DocumentState.SYNCED */ , 
        this;
    }
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */    convertToUnknownDocument(e) {
        return this.version = e, this.documentType = 3 /* DocumentType.UNKNOWN_DOCUMENT */ , 
        this.data = ObjectValue.empty(), this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ , 
        this;
    }
    setHasCommittedMutations() {
        return this.documentState = 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ , this;
    }
    setHasLocalMutations() {
        return this.documentState = 1 /* DocumentState.HAS_LOCAL_MUTATIONS */ , this.version = SnapshotVersion.min(), 
        this;
    }
    setReadTime(e) {
        return this.readTime = e, this;
    }
    get hasLocalMutations() {
        return 1 /* DocumentState.HAS_LOCAL_MUTATIONS */ === this.documentState;
    }
    get hasCommittedMutations() {
        return 2 /* DocumentState.HAS_COMMITTED_MUTATIONS */ === this.documentState;
    }
    get hasPendingWrites() {
        return this.hasLocalMutations || this.hasCommittedMutations;
    }
    isValidDocument() {
        return 0 /* DocumentType.INVALID */ !== this.documentType;
    }
    isFoundDocument() {
        return 1 /* DocumentType.FOUND_DOCUMENT */ === this.documentType;
    }
    isNoDocument() {
        return 2 /* DocumentType.NO_DOCUMENT */ === this.documentType;
    }
    isUnknownDocument() {
        return 3 /* DocumentType.UNKNOWN_DOCUMENT */ === this.documentType;
    }
    isEqual(e) {
        return e instanceof MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
    }
    mutableCopy() {
        return new MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
    }
    toString() {
        return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
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
class __PRIVATE_TargetImpl {
    constructor(e, t = null, r = [], n = [], i = null, s = null, o = null) {
        this.path = e, this.collectionGroup = t, this.orderBy = r, this.filters = n, this.limit = i, 
        this.startAt = s, this.endAt = o, this.O = null;
    }
}

/**
 * Initializes a Target with a path and optional additional query constraints.
 * Path must currently be empty if this is a collection group query.
 *
 * NOTE: you should always construct `Target` from `Query.toTarget` instead of
 * using this factory method, because `Query` provides an implicit `orderBy`
 * property.
 */ function __PRIVATE_newTarget(e, t = null, r = [], n = [], i = null, s = null, o = null) {
    return new __PRIVATE_TargetImpl(e, t, r, n, i, s, o);
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
class __PRIVATE_QueryImpl {
    /**
     * Initializes a Query with a path and optional additional query constraints.
     * Path must currently be empty if this is a collection group query.
     */
    constructor(e, t = null, r = [], n = [], i = null, s = "F" /* LimitType.First */ , o = null, a = null) {
        this.path = e, this.collectionGroup = t, this.explicitOrderBy = r, this.filters = n, 
        this.limit = i, this.limitType = s, this.startAt = o, this.endAt = a, this.q = null, 
        // The corresponding `Target` of this `Query` instance, for use with
        // non-aggregate queries.
        this.L = null, 
        // The corresponding `Target` of this `Query` instance, for use with
        // aggregate queries. Unlike targets for non-aggregate queries,
        // aggregate query targets do not contain normalized order-bys, they only
        // contain explicit order-bys.
        this.B = null, this.startAt, this.endAt;
    }
}

/** Creates a new Query for a query that matches all documents at `path` */
/**
 * Returns whether the query matches a single document by path (rather than a
 * collection).
 */
function __PRIVATE_isDocumentQuery(e) {
    return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}

/**
 * Returns whether the query matches a collection group rather than a specific
 * collection.
 */ function __PRIVATE_isCollectionGroupQuery(e) {
    return null !== e.collectionGroup;
}

/**
 * Returns the normalized order-by constraint that is used to execute the Query,
 * which can be different from the order-by constraints the user provided (e.g.
 * the SDK and backend always orders by `__name__`). The normalized order-by
 * includes implicit order-bys in addition to the explicit user provided
 * order-bys.
 */ function __PRIVATE_queryNormalizedOrderBy(e) {
    const t = __PRIVATE_debugCast(e);
    if (null === t.q) {
        t.q = [];
        const e = new Set;
        // Any explicit order by fields should be added as is.
                for (const r of t.explicitOrderBy) t.q.push(r), e.add(r.field.canonicalString());
        // The order of the implicit ordering always matches the last explicit order by.
                const r = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc" /* Direction.ASCENDING */ , n = 
        // Returns the sorted set of inequality filter fields used in this query.
        function __PRIVATE_getInequalityFilterFields(e) {
            let t = new SortedSet(FieldPath$1.comparator);
            return e.filters.forEach((e => {
                e.getFlattenedFilters().forEach((e => {
                    e.isInequality() && (t = t.add(e.field));
                }));
            })), t;
        }
        /**
 * Creates a new Query for a collection group query that matches all documents
 * within the provided collection group.
 */ (t);
        // Any inequality fields not explicitly ordered should be implicitly ordered in a lexicographical
        // order. When there are multiple inequality filters on the same field, the field should be added
        // only once.
        // Note: `SortedSet<FieldPath>` sorts the key field before other fields. However, we want the key
        // field to be sorted last.
                n.forEach((n => {
            e.has(n.canonicalString()) || n.isKeyField() || t.q.push(new OrderBy(n, r));
        })), 
        // Add the document key field to the last if it is not explicitly ordered.
        e.has(FieldPath$1.keyField().canonicalString()) || t.q.push(new OrderBy(FieldPath$1.keyField(), r));
    }
    return t.q;
}

/**
 * Converts this `Query` instance to its corresponding `Target` representation.
 */ function __PRIVATE_queryToTarget(e) {
    const t = __PRIVATE_debugCast(e);
    return t.L || (t.L = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), 
    t.L;
}

/**
 * Converts this `Query` instance to its corresponding `Target` representation,
 * for use within an aggregate query. Unlike targets for non-aggregate queries,
 * aggregate query targets do not contain normalized order-bys, they only
 * contain explicit order-bys.
 */ function __PRIVATE__queryToTarget(e, t) {
    if ("F" /* LimitType.First */ === e.limitType) return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
    {
        // Flip the orderBy directions since we want the last results
        t = t.map((e => {
            const t = "desc" /* Direction.DESCENDING */ === e.dir ? "asc" /* Direction.ASCENDING */ : "desc" /* Direction.DESCENDING */;
            return new OrderBy(e.field, t);
        }));
        // We need to swap the cursors to match the now-flipped query ordering.
        const r = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, n = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
        // Now return as a LimitType.First query.
        return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, r, n);
    }
}

function __PRIVATE_queryWithAddedFilter(e, t) {
    const r = e.filters.concat([ t ]);
    return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), r, e.limit, e.limitType, e.startAt, e.endAt);
}

function __PRIVATE_queryEquals(e, t) {
    return function __PRIVATE_targetEquals(e, t) {
        if (e.limit !== t.limit) return !1;
        if (e.orderBy.length !== t.orderBy.length) return !1;
        for (let r = 0; r < e.orderBy.length; r++) if (!__PRIVATE_orderByEquals(e.orderBy[r], t.orderBy[r])) return !1;
        if (e.filters.length !== t.filters.length) return !1;
        for (let r = 0; r < e.filters.length; r++) if (!__PRIVATE_filterEquals(e.filters[r], t.filters[r])) return !1;
        return e.collectionGroup === t.collectionGroup && !!e.path.isEqual(t.path) && !!__PRIVATE_boundEquals(e.startAt, t.startAt) && __PRIVATE_boundEquals(e.endAt, t.endAt);
    }(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t)) && e.limitType === t.limitType;
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
 */ function __PRIVATE_toDouble(e, t) {
    if (e.useProto3Json) {
        if (isNaN(t)) return {
            doubleValue: "NaN"
        };
        if (t === 1 / 0) return {
            doubleValue: "Infinity"
        };
        if (t === -1 / 0) return {
            doubleValue: "-Infinity"
        };
    }
    return {
        doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t
    };
}

/**
 * Returns an IntegerValue for `value`.
 */
/**
 * Returns a value for a number that's appropriate to put into a proto.
 * The return value is an IntegerValue if it can safely represent the value,
 * otherwise a DoubleValue is returned.
 */
function toNumber(e, t) {
    return function isSafeInteger(e) {
        return "number" == typeof e && Number.isInteger(e) && !__PRIVATE_isNegativeZero(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER;
    }(t) ? function __PRIVATE_toInteger(e) {
        return {
            integerValue: "" + e
        };
    }(t) : __PRIVATE_toDouble(e, t);
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
/** Used to represent a field transform on a mutation. */ class TransformOperation {
    constructor() {
        // Make sure that the structural type of `TransformOperation` is unique.
        // See https://github.com/microsoft/TypeScript/issues/5451
        this._ = void 0;
    }
}

/** Transforms a value into a server-generated timestamp. */ class __PRIVATE_ServerTimestampTransform extends TransformOperation {}

/** Transforms an array value via a union operation. */ class __PRIVATE_ArrayUnionTransformOperation extends TransformOperation {
    constructor(e) {
        super(), this.elements = e;
    }
}

/** Transforms an array value via a remove operation. */ class __PRIVATE_ArrayRemoveTransformOperation extends TransformOperation {
    constructor(e) {
        super(), this.elements = e;
    }
}

/**
 * Implements the backend semantics for locally computed NUMERIC_ADD (increment)
 * transforms. Converts all field values to integers or doubles, but unlike the
 * backend does not cap integer values at 2^63. Instead, JavaScript number
 * arithmetic is used and precision loss can occur for values greater than 2^53.
 */ class __PRIVATE_NumericIncrementTransformOperation extends TransformOperation {
    constructor(e, t) {
        super(), this.serializer = e, this.$ = t;
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
/** A field path and the TransformOperation to perform upon it. */ class FieldTransform {
    constructor(e, t) {
        this.field = e, this.transform = t;
    }
}

/**
 * Encodes a precondition for a mutation. This follows the model that the
 * backend accepts with the special case of an explicit "empty" precondition
 * (meaning no precondition).
 */ class Precondition {
    constructor(e, t) {
        this.updateTime = e, this.exists = t;
    }
    /** Creates a new empty Precondition. */    static none() {
        return new Precondition;
    }
    /** Creates a new Precondition with an exists flag. */    static exists(e) {
        return new Precondition(void 0, e);
    }
    /** Creates a new Precondition based on a version a document exists at. */    static updateTime(e) {
        return new Precondition(e);
    }
    /** Returns whether this Precondition is empty. */    get isNone() {
        return void 0 === this.updateTime && void 0 === this.exists;
    }
    isEqual(e) {
        return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
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
 */ class Mutation {}

/**
 * A mutation that creates or replaces the document at the given key with the
 * object value contents.
 */ class __PRIVATE_SetMutation extends Mutation {
    constructor(e, t, r, n = []) {
        super(), this.key = e, this.value = t, this.precondition = r, this.fieldTransforms = n, 
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
 */ class __PRIVATE_PatchMutation extends Mutation {
    constructor(e, t, r, n, i = []) {
        super(), this.key = e, this.data = t, this.fieldMask = r, this.precondition = n, 
        this.fieldTransforms = i, this.type = 1 /* MutationType.Patch */;
    }
    getFieldMask() {
        return this.fieldMask;
    }
}

/** A mutation that deletes the document at the given key. */ class __PRIVATE_DeleteMutation extends Mutation {
    constructor(e, t) {
        super(), this.key = e, this.precondition = t, this.type = 2 /* MutationType.Delete */ , 
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
 */ class __PRIVATE_VerifyMutation extends Mutation {
    constructor(e, t) {
        super(), this.key = e, this.precondition = t, this.type = 3 /* MutationType.Verify */ , 
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
 */ const O = (() => {
    const e = {
        asc: "ASCENDING",
        desc: "DESCENDING"
    };
    return e;
})(), q = (() => {
    const e = {
        "<": "LESS_THAN",
        "<=": "LESS_THAN_OR_EQUAL",
        ">": "GREATER_THAN",
        ">=": "GREATER_THAN_OR_EQUAL",
        "==": "EQUAL",
        "!=": "NOT_EQUAL",
        "array-contains": "ARRAY_CONTAINS",
        in: "IN",
        "not-in": "NOT_IN",
        "array-contains-any": "ARRAY_CONTAINS_ANY"
    };
    return e;
})(), L = (() => {
    const e = {
        and: "AND",
        or: "OR"
    };
    return e;
})();

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
    constructor(e, t) {
        this.databaseId = e, this.useProto3Json = t;
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
/**
 * Returns a value for a Date that's appropriate to put into a proto.
 */
function toTimestamp(e, t) {
    if (e.useProto3Json) {
        return `${new Date(1e3 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
    }
    return {
        seconds: "" + t.seconds,
        nanos: t.nanoseconds
    };
}

/**
 * Returns a Timestamp typed object given protobuf timestamp value.
 */
/**
 * Returns a value for bytes that's appropriate to put in a proto.
 *
 * Visible for testing.
 */
function __PRIVATE_toBytes(e, t) {
    return e.useProto3Json ? t.toBase64() : t.toUint8Array();
}

function __PRIVATE_toVersion(e, t) {
    return toTimestamp(e, t.toTimestamp());
}

function __PRIVATE_fromVersion(e) {
    return __PRIVATE_hardAssert(!!e, 49232), SnapshotVersion.fromTimestamp(function fromTimestamp(e) {
        const t = __PRIVATE_normalizeTimestamp(e);
        return new Timestamp(t.seconds, t.nanos);
    }(e));
}

function __PRIVATE_toResourceName(e, t) {
    return __PRIVATE_toResourcePath(e, t).canonicalString();
}

function __PRIVATE_toResourcePath(e, t) {
    const r = function __PRIVATE_fullyQualifiedPrefixPath(e) {
        return new ResourcePath([ "projects", e.projectId, "databases", e.database ]);
    }(e).child("documents");
    return void 0 === t ? r : r.child(t);
}

function __PRIVATE_toName(e, t) {
    return __PRIVATE_toResourceName(e.databaseId, t.path);
}

function fromName(e, t) {
    const r = function __PRIVATE_fromResourceName(e) {
        const t = ResourcePath.fromString(e);
        return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t), 10190, {
            key: t.toString()
        }), t;
    }(t);
    if (r.get(1) !== e.databaseId.projectId) throw new FirestoreError(E.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + r.get(1) + " vs " + e.databaseId.projectId);
    if (r.get(3) !== e.databaseId.database) throw new FirestoreError(E.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + r.get(3) + " vs " + e.databaseId.database);
    return new DocumentKey(function __PRIVATE_extractLocalPathFromResourceName(e) {
        return __PRIVATE_hardAssert(e.length > 4 && "documents" === e.get(4), 29091, {
            key: e.toString()
        }), e.popFirst(5);
    }
    /** Creates a Document proto from key and fields (but no create/update time) */ (r));
}

function __PRIVATE_toMutationDocument(e, t, r) {
    return {
        name: __PRIVATE_toName(e, t),
        fields: r.value.mapValue.fields
    };
}

function __PRIVATE_fromPipelineResponse(e, t, r) {
    const n = {};
    t.transaction?.length && (n.transaction = t.transaction);
    const i = t.executionTime ? __PRIVATE_fromVersion(t.executionTime) : void 0;
    return n.executionTime = i, r && (n.key = r.name ? fromName(e, r.name) : void 0, 
    n.fields = new ObjectValue({
        mapValue: {
            fields: r.fields
        }
    }), n.createTime = r.createTime ? __PRIVATE_fromVersion(r.createTime) : void 0, 
    n.updateTime = r.updateTime ? __PRIVATE_fromVersion(r.updateTime) : void 0), n;
}

function __PRIVATE_fromBatchGetDocumentsResponse(e, t) {
    return "found" in t ? function __PRIVATE_fromFound(e, t) {
        __PRIVATE_hardAssert(!!t.found, 43571), t.found.name, t.found.updateTime;
        const r = fromName(e, t.found.name), n = __PRIVATE_fromVersion(t.found.updateTime), i = t.found.createTime ? __PRIVATE_fromVersion(t.found.createTime) : SnapshotVersion.min(), s = new ObjectValue({
            mapValue: {
                fields: t.found.fields
            }
        });
        return MutableDocument.newFoundDocument(r, n, i, s);
    }(e, t) : "missing" in t ? function __PRIVATE_fromMissing(e, t) {
        __PRIVATE_hardAssert(!!t.missing, 3894), __PRIVATE_hardAssert(!!t.readTime, 22933);
        const r = fromName(e, t.missing), n = __PRIVATE_fromVersion(t.readTime);
        return MutableDocument.newNoDocument(r, n);
    }(e, t) : fail(7234, {
        result: t
    });
}

function toMutation(e, t) {
    let r;
    if (t instanceof __PRIVATE_SetMutation) r = {
        update: __PRIVATE_toMutationDocument(e, t.key, t.value)
    }; else if (t instanceof __PRIVATE_DeleteMutation) r = {
        delete: __PRIVATE_toName(e, t.key)
    }; else if (t instanceof __PRIVATE_PatchMutation) r = {
        update: __PRIVATE_toMutationDocument(e, t.key, t.data),
        updateMask: __PRIVATE_toDocumentMask(t.fieldMask)
    }; else {
        if (!(t instanceof __PRIVATE_VerifyMutation)) return fail(16599, {
            U: t.type
        });
        r = {
            verify: __PRIVATE_toName(e, t.key)
        };
    }
    return t.fieldTransforms.length > 0 && (r.updateTransforms = t.fieldTransforms.map((e => function __PRIVATE_toFieldTransform(e, t) {
        const r = t.transform;
        if (r instanceof __PRIVATE_ServerTimestampTransform) return {
            fieldPath: t.field.canonicalString(),
            setToServerValue: "REQUEST_TIME"
        };
        if (r instanceof __PRIVATE_ArrayUnionTransformOperation) return {
            fieldPath: t.field.canonicalString(),
            appendMissingElements: {
                values: r.elements
            }
        };
        if (r instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
            fieldPath: t.field.canonicalString(),
            removeAllFromArray: {
                values: r.elements
            }
        };
        if (r instanceof __PRIVATE_NumericIncrementTransformOperation) return {
            fieldPath: t.field.canonicalString(),
            increment: r.$
        };
        throw fail(20930, {
            transform: t.transform
        });
    }(0, e)))), t.precondition.isNone || (r.currentDocument = function __PRIVATE_toPrecondition(e, t) {
        return void 0 !== t.updateTime ? {
            updateTime: __PRIVATE_toVersion(e, t.updateTime)
        } : void 0 !== t.exists ? {
            exists: t.exists
        } : fail(27497);
    }(e, t.precondition)), r;
}

function __PRIVATE_toQueryTarget(e, t) {
    // Dissect the path into parent, collectionId, and optional key filter.
    const r = {
        structuredQuery: {}
    }, n = t.path;
    let i;
    null !== t.collectionGroup ? (i = n, r.structuredQuery.from = [ {
        collectionId: t.collectionGroup,
        allDescendants: !0
    } ]) : (i = n.popLast(), r.structuredQuery.from = [ {
        collectionId: n.lastSegment()
    } ]), r.parent = function __PRIVATE_toQueryPath(e, t) {
        return __PRIVATE_toResourceName(e.databaseId, t);
    }(e, i);
    const s = function __PRIVATE_toFilters(e) {
        if (0 === e.length) return;
        return __PRIVATE_toFilter(CompositeFilter.create(e, "and" /* CompositeOperator.AND */));
    }(t.filters);
    s && (r.structuredQuery.where = s);
    const o = function __PRIVATE_toOrder(e) {
        if (0 === e.length) return;
        return e.map((e => 
        // visible for testing
        function __PRIVATE_toPropertyOrder(e) {
            return {
                field: __PRIVATE_toFieldPathReference(e.field),
                direction: __PRIVATE_toDirection(e.dir)
            };
        }
        // visible for testing
        (e)));
    }(t.orderBy);
    o && (r.structuredQuery.orderBy = o);
    const a = function __PRIVATE_toInt32Proto(e, t) {
        return e.useProto3Json || __PRIVATE_isNullOrUndefined(t) ? t : {
            value: t
        };
    }(e, t.limit);
    return null !== a && (r.structuredQuery.limit = a), t.startAt && (r.structuredQuery.startAt = function __PRIVATE_toStartAtCursor(e) {
        return {
            before: e.inclusive,
            values: e.position
        };
    }(t.startAt)), t.endAt && (r.structuredQuery.endAt = function __PRIVATE_toEndAtCursor(e) {
        return {
            before: !e.inclusive,
            values: e.position
        };
    }
    // visible for testing
    (t.endAt)), {
        M: r,
        parent: i
    };
}

function __PRIVATE_toDirection(e) {
    return O[e];
}

// visible for testing
function __PRIVATE_toOperatorName(e) {
    return q[e];
}

function __PRIVATE_toCompositeOperatorName(e) {
    return L[e];
}

function __PRIVATE_toFieldPathReference(e) {
    return {
        fieldPath: e.canonicalString()
    };
}

function __PRIVATE_toFilter(e) {
    return e instanceof FieldFilter ? function __PRIVATE_toUnaryOrFieldFilter(e) {
        if ("==" /* Operator.EQUAL */ === e.op) {
            if (__PRIVATE_isNanValue(e.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(e.field),
                    op: "IS_NAN"
                }
            };
            if (__PRIVATE_isNullValue(e.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(e.field),
                    op: "IS_NULL"
                }
            };
        } else if ("!=" /* Operator.NOT_EQUAL */ === e.op) {
            if (__PRIVATE_isNanValue(e.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(e.field),
                    op: "IS_NOT_NAN"
                }
            };
            if (__PRIVATE_isNullValue(e.value)) return {
                unaryFilter: {
                    field: __PRIVATE_toFieldPathReference(e.field),
                    op: "IS_NOT_NULL"
                }
            };
        }
        return {
            fieldFilter: {
                field: __PRIVATE_toFieldPathReference(e.field),
                op: __PRIVATE_toOperatorName(e.op),
                value: e.value
            }
        };
    }(e) : e instanceof CompositeFilter ? function __PRIVATE_toCompositeFilter(e) {
        const t = e.getFilters().map((e => __PRIVATE_toFilter(e)));
        if (1 === t.length) return t[0];
        return {
            compositeFilter: {
                op: __PRIVATE_toCompositeOperatorName(e.op),
                filters: t
            }
        };
    }(e) : fail(54877, {
        filter: e
    });
}

function __PRIVATE_toDocumentMask(e) {
    const t = [];
    return e.fields.forEach((e => t.push(e.canonicalString()))), {
        fieldPaths: t
    };
}

function __PRIVATE_isValidResourceName(e) {
    // Resource names have at least 4 components (project ID, database ID)
    return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
}

function __PRIVATE_isProtoValueSerializable(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
e) {
    return !!e && "function" == typeof e._toProto && "ProtoValue" === e._protoValueType;
}

function __PRIVATE_toMapValue(e, t) {
    const r = {
        fields: {}
    };
    return t.forEach(((t, n) => {
        if ("string" != typeof n) throw new Error(`Cannot encode map with non-string key: ${n}`);
        r.fields[n] = t._toProto(e);
    })), {
        mapValue: r
    };
}

function __PRIVATE_toStringValue(e) {
    return {
        stringValue: e
    };
}

function __PRIVATE_toPipelineValue(e) {
    return {
        pipelineValue: e
    };
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
 */ function __PRIVATE_newSerializer(e) {
    return new JsonProtoSerializer(e, /* useProto3Json= */ !0);
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
 */ class Datastore {}

/**
 * An implementation of Datastore that exposes additional state for internal
 * consumption.
 */ class __PRIVATE_DatastoreImpl extends Datastore {
    constructor(e, t, r, n) {
        super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = r, 
        this.serializer = n, this.k = !1;
    }
    j() {
        if (this.k) throw new FirestoreError(E.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    /** Invokes the provided RPC with auth and AppCheck tokens. */    I(e, t, r, n) {
        return this.j(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((([i, s]) => this.connection.I(e, __PRIVATE_toResourcePath(t, r), n, i, s))).catch((e => {
            throw "FirebaseError" === e.name ? (e.code === E.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), 
            this.appCheckCredentials.invalidateToken()), e) : new FirestoreError(E.UNKNOWN, e.toString());
        }));
    }
    /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */    D(e, t, r, n, i) {
        return this.j(), Promise.all([ this.authCredentials.getToken(), this.appCheckCredentials.getToken() ]).then((([s, o]) => this.connection.D(e, __PRIVATE_toResourcePath(t, r), n, s, o, i))).catch((e => {
            throw "FirebaseError" === e.name ? (e.code === E.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), 
            this.appCheckCredentials.invalidateToken()), e) : new FirestoreError(E.UNKNOWN, e.toString());
        }));
    }
    terminate() {
        this.k = !0, this.connection.terminate();
    }
}

// TODO(firestorexp): Make sure there is only one Datastore instance per
// firestore-exp client.
async function __PRIVATE_invokeCommitRpc(e, t) {
    const r = __PRIVATE_debugCast(e), n = {
        writes: t.map((e => toMutation(r.serializer, e)))
    };
    await r.I("Commit", r.serializer.databaseId, ResourcePath.emptyPath(), n);
}

async function __PRIVATE_invokeBatchGetDocumentsRpc(e, t) {
    const r = __PRIVATE_debugCast(e), n = {
        documents: t.map((e => __PRIVATE_toName(r.serializer, e)))
    }, i = await r.D("BatchGetDocuments", r.serializer.databaseId, ResourcePath.emptyPath(), n, t.length), s = new Map;
    i.forEach((e => {
        const t = __PRIVATE_fromBatchGetDocumentsResponse(r.serializer, e);
        s.set(t.key.toString(), t);
    }));
    const o = [];
    return t.forEach((e => {
        const t = s.get(e.toString());
        __PRIVATE_hardAssert(!!t, 55234, {
            key: e
        }), o.push(t);
    })), o;
}

async function __PRIVATE_invokeExecutePipeline(e, t) {
    const r = __PRIVATE_debugCast(e), n = {
        database: (i = r.serializer, new ResourcePath([ "projects", i.databaseId.projectId, "databases", i.databaseId.database ]).canonicalString()),
        structuredPipeline: t._toProto(r.serializer)
    };
    var i;
    const s = await r.D("ExecutePipeline", r.serializer.databaseId, ResourcePath.emptyPath(), n), o = [];
    return s.forEach((e => {
        if (e.results && 0 !== e.results.length) return e.results.forEach((t => o.push(__PRIVATE_fromPipelineResponse(r.serializer, e, t))));
        o.push(__PRIVATE_fromPipelineResponse(r.serializer, e));
    })), o;
}

async function __PRIVATE_invokeRunQueryRpc(e, t) {
    const r = __PRIVATE_debugCast(e), {M: n, parent: i} = __PRIVATE_toQueryTarget(r.serializer, __PRIVATE_queryToTarget(t));
    return (await r.D("RunQuery", r.serializer.databaseId, i, {
        structuredQuery: n.structuredQuery
    })).filter((e => !!e.document)).map((e => function __PRIVATE_fromDocument(e, t, r) {
        const n = fromName(e, t.name), i = __PRIVATE_fromVersion(t.updateTime), s = t.createTime ? __PRIVATE_fromVersion(t.createTime) : SnapshotVersion.min(), o = new ObjectValue({
            mapValue: {
                fields: t.fields
            }
        }), a = MutableDocument.newFoundDocument(n, i, s, o);
        return r && a.setHasCommittedMutations(), r ? a.setHasCommittedMutations() : a;
    }(r.serializer, e.document, void 0)));
}

async function __PRIVATE_invokeRunAggregationQueryRpc(e, t, r) {
    const n = __PRIVATE_debugCast(e), {request: i, K: s, parent: o} = function __PRIVATE_toRunAggregationQueryRequest(e, t, r, n) {
        const {M: i, parent: s} = __PRIVATE_toQueryTarget(e, t), o = {}, a = [];
        let u = 0;
        return r.forEach((e => {
            // Map all client-side aliases to a unique short-form
            // alias. This avoids issues with client-side aliases that
            // exceed the 1500-byte string size limit.
            const t = n ? e.alias : "aggregate_" + u++;
            o[t] = e.alias, "count" === e.aggregateType ? a.push({
                alias: t,
                count: {}
            }) : "avg" === e.aggregateType ? a.push({
                alias: t,
                avg: {
                    field: __PRIVATE_toFieldPathReference(e.fieldPath)
                }
            }) : "sum" === e.aggregateType && a.push({
                alias: t,
                sum: {
                    field: __PRIVATE_toFieldPathReference(e.fieldPath)
                }
            });
        })), {
            request: {
                structuredAggregationQuery: {
                    aggregations: a,
                    structuredQuery: i.structuredQuery
                },
                parent: i.parent
            },
            K: o,
            parent: s
        };
    }(n.serializer, function __PRIVATE_queryToAggregateTarget(e) {
        const t = __PRIVATE_debugCast(e);
        return t.B || (
        // Do not include implicit order-bys for aggregate queries.
        t.B = __PRIVATE__queryToTarget(t, e.explicitOrderBy)), t.B;
    }(t), r);
    n.connection.T || delete i.parent;
    const a = (await n.D("RunAggregationQuery", n.serializer.databaseId, o, i, 
    /*expectedResponseCount=*/ 1)).filter((e => !!e.result));
    // Omit RunAggregationQueryResponse that only contain readTimes.
        __PRIVATE_hardAssert(1 === a.length, 64727);
    // Remap the short-form aliases that were sent to the server
    // to the client-side aliases. Users will access the results
    // using the client-side alias.
    const u = a[0].result?.aggregateFields;
    return Object.keys(u).reduce(((e, t) => (e[s[t]] = u[t], e)), {});
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
 */ const B = "ComponentProvider", $ = new Map;

/**
 * An instance map that ensures only one Datastore exists per Firestore
 * instance.
 */
/**
 * Returns an initialized and started Datastore for the given Firestore
 * instance. Callers must invoke removeComponents() when the Firestore
 * instance is terminated.
 */
function __PRIVATE_getDatastore(e) {
    if (e._terminated) throw new FirestoreError(E.FAILED_PRECONDITION, "The client has already been terminated.");
    if (!$.has(e)) {
        __PRIVATE_logDebug(B, "Initializing Datastore");
        const t = function __PRIVATE_newConnection(e) {
            return new __PRIVATE_FetchConnection(e);
        }(function __PRIVATE_makeDatabaseInfo(e, t, r, n, i) {
            return new DatabaseInfo(e, t, r, i.host, i.ssl, i.experimentalForceLongPolling, i.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(i.experimentalLongPollingOptions), i.useFetchStreams, i.isUsingEmulator, n);
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
 */ (e._databaseId, e.app.options.appId || "", e._persistenceKey, e.app.options.apiKey, e._freezeSettings())), r = __PRIVATE_newSerializer(e._databaseId), n = function __PRIVATE_newDatastore(e, t, r, n) {
            return new __PRIVATE_DatastoreImpl(e, t, r, n);
        }(e._authCredentials, e._appCheckCredentials, t, r);
        $.set(e, n);
    }
    return $.get(e);
}

/**
 * Removes all components associated with the provided instance. Must be called
 * when the `Firestore` instance is terminated.
 */ const Q = 1048576, U = "firestore.googleapis.com", M = !0;

/**
 * A concrete type describing all the values that can be applied via a
 * user-supplied `FirestoreSettings` object. This is a separate type so that
 * defaults can be supplied and the value can be checked for equality.
 */
class FirestoreSettingsImpl {
    constructor(e) {
        if (void 0 === e.host) {
            if (void 0 !== e.ssl) throw new FirestoreError(E.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
            this.host = U, this.ssl = M;
        } else this.host = e.host, this.ssl = e.ssl ?? M;
        if (this.isUsingEmulator = void 0 !== e.emulatorOptions, this.credentials = e.credentials, 
        this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, 
        void 0 === e.cacheSizeBytes) this.cacheSizeBytes = 41943040; else {
            if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < Q) throw new FirestoreError(E.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
            this.cacheSizeBytes = e.cacheSizeBytes;
        }
        !function __PRIVATE_validateIsNotUsedTogether(e, t, r, n) {
            if (!0 === t && !0 === n) throw new FirestoreError(E.INVALID_ARGUMENT, `${e} and ${r} cannot be used together.`);
        }("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), 
        this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = !1 : void 0 === e.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : 
        // For backwards compatibility, coerce the value to boolean even though
        // the TypeScript compiler has narrowed the type to boolean already.
        // noinspection PointlessBooleanExpressionJS
        this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling, 
        this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(e.experimentalLongPollingOptions ?? {}), 
        function __PRIVATE_validateLongPollingOptions(e) {
            if (void 0 !== e.timeoutSeconds) {
                if (isNaN(e.timeoutSeconds)) throw new FirestoreError(E.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);
                if (e.timeoutSeconds < 5) throw new FirestoreError(E.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);
                if (e.timeoutSeconds > 30) throw new FirestoreError(E.INVALID_ARGUMENT, `invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`);
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
 */ (this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
    }
    isEqual(e) {
        return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(e, t) {
            return e.timeoutSeconds === t.timeoutSeconds;
        }(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
    }
}

class Firestore {
    /** @hideconstructor */
    constructor(e, t, r, n) {
        this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = r, 
        this._app = n, 
        /**
         * Whether it's a Firestore or Firestore Lite instance.
         */
        this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), 
        this._settingsFrozen = !1, this._emulatorOptions = {}, 
        // A task that is assigned when the terminate() is invoked and resolved when
        // all components have shut down. Otherwise, Firestore is not terminated,
        // which can mean either the FirestoreClient is in the process of starting,
        // or restarting.
        this._terminateTask = "notTerminated";
    }
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */    get app() {
        if (!this._app) throw new FirestoreError(E.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
        return this._app;
    }
    get _initialized() {
        return this._settingsFrozen;
    }
    get _terminated() {
        return "notTerminated" !== this._terminateTask;
    }
    _setSettings(e) {
        if (this._settingsFrozen) throw new FirestoreError(E.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
        this._settings = new FirestoreSettingsImpl(e), this._emulatorOptions = e.emulatorOptions || {}, 
        void 0 !== e.credentials && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(e) {
            if (!e) return new __PRIVATE_EmptyAuthCredentialsProvider;
            switch (e.type) {
              case "firstParty":
                return new __PRIVATE_FirstPartyAuthCredentialsProvider(e.sessionIndex || "0", e.iamToken || null, e.authTokenFactory || null);

              case "provider":
                return e.client;

              default:
                throw new FirestoreError(E.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
            }
        }(e.credentials));
    }
    _getSettings() {
        return this._settings;
    }
    _getEmulatorOptions() {
        return this._emulatorOptions;
    }
    _freezeSettings() {
        return this._settingsFrozen = !0, this._settings;
    }
    _delete() {
        // The `_terminateTask` must be assigned future that completes when
        // terminate is complete. The existence of this future puts SDK in state
        // that will not accept further API interaction.
        return "notTerminated" === this._terminateTask && (this._terminateTask = this._terminate()), 
        this._terminateTask;
    }
    async _restart() {
        // The `_terminateTask` must equal 'notTerminated' after restart to
        // signal that client is in a state that accepts API calls.
        "notTerminated" === this._terminateTask ? await this._terminate() : this._terminateTask = "notTerminated";
    }
    /** Returns a JSON-serializable representation of this `Firestore` instance. */    toJSON() {
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
     */    _terminate() {
        return function __PRIVATE_removeComponents(e) {
            const t = $.get(e);
            t && (__PRIVATE_logDebug(B, "Removing Datastore"), $.delete(e), t.terminate());
        }(this), Promise.resolve();
    }
}

function initializeFirestore(e, t, r) {
    r || (r = m);
    const n = _getProvider(e, "firestore/lite");
    if (n.isInitialized(r)) throw new FirestoreError(E.FAILED_PRECONDITION, "Firestore can only be initialized once per app.");
    return n.initialize({
        options: t,
        instanceIdentifier: r
    });
}

function getFirestore(e, t) {
    const n = "object" == typeof e ? e : getApp(), i = "string" == typeof e ? e : t || "(default)", s = _getProvider(n, "firestore/lite").getImmediate({
        identifier: i
    });
    if (!s._initialized) {
        const e = getDefaultEmulatorHostnameAndPort("firestore");
        e && connectFirestoreEmulator(s, ...e);
    }
    return s;
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
 */ function connectFirestoreEmulator(e, r, o, a = {}) {
    e = __PRIVATE_cast(e, Firestore);
    const u = isCloudWorkstation(r), _ = e._getSettings(), c = {
        ..._,
        emulatorOptions: e._getEmulatorOptions()
    }, l = `${r}:${o}`;
    u && pingServer(`https://${l}`), _.host !== U && _.host !== l && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
    const h = {
        ..._,
        host: l,
        ssl: u,
        emulatorOptions: a
    };
    // No-op if the new configuration matches the current configuration. This supports SSR
    // enviornments which might call `connectFirestoreEmulator` multiple times as a standard practice.
        if (!deepEqual(h, c) && (e._setSettings(h), a.mockUserToken)) {
        let t, r;
        if ("string" == typeof a.mockUserToken) t = a.mockUserToken, r = User.MOCK_USER; else {
            // Let createMockUserToken validate first (catches common mistakes like
            // invalid field "uid" and missing field "sub" / "user_id".)
            t = createMockUserToken(a.mockUserToken, e._app?.options.projectId);
            const n = a.mockUserToken.sub || a.mockUserToken.user_id;
            if (!n) throw new FirestoreError(E.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
            r = new User(n);
        }
        e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t, r));
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
 */ function terminate(e) {
    return e = __PRIVATE_cast(e, Firestore), _removeServiceInstance(e.app, "firestore/lite"), e._delete();
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
 */ class Query {
    // This is the lite version of the Query class in the main SDK.
    /** @hideconstructor protected */
    constructor(e, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    t, r) {
        this.converter = t, this._query = r, 
        /** The type of this Firestore reference. */
        this.type = "query", this.firestore = e;
    }
    withConverter(e) {
        return new Query(this.firestore, e, this._query);
    }
}

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */ class DocumentReference {
    /** @hideconstructor */
    constructor(e, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    t, r) {
        this.converter = t, this._key = r, 
        /** The type of this Firestore reference. */
        this.type = "document", this.firestore = e;
    }
    get _path() {
        return this._key.path;
    }
    /**
     * The document's identifier within its collection.
     */    get id() {
        return this._key.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */    get path() {
        return this._key.path.canonicalString();
    }
    /**
     * The collection this `DocumentReference` belongs to.
     */    get parent() {
        return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
    }
    withConverter(e) {
        return new DocumentReference(this.firestore, e, this._key);
    }
    /**
     * Returns a JSON-serializable representation of this `DocumentReference` instance.
     *
     * @returns a JSON representation of this object.
     */    toJSON() {
        return {
            type: DocumentReference._jsonSchemaVersion,
            referencePath: this._key.toString()
        };
    }
    static fromJSON(e, t, r) {
        if (__PRIVATE_validateJSON(t, DocumentReference._jsonSchema)) return new DocumentReference(e, r || null, new DocumentKey(ResourcePath.fromString(t.referencePath)));
    }
}

DocumentReference._jsonSchemaVersion = "firestore/documentReference/1.0", DocumentReference._jsonSchema = {
    type: property("string", DocumentReference._jsonSchemaVersion),
    referencePath: property("string")
};

/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link (query:1)}).
 */
class CollectionReference extends Query {
    /** @hideconstructor */
    constructor(e, t, r) {
        super(e, t, function __PRIVATE_newQueryForPath(e) {
            return new __PRIVATE_QueryImpl(e);
        }(r)), this._path = r, 
        /** The type of this Firestore reference. */
        this.type = "collection";
    }
    /** The collection's identifier. */    get id() {
        return this._query.path.lastSegment();
    }
    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */    get path() {
        return this._query.path.canonicalString();
    }
    /**
     * A reference to the containing `DocumentReference` if this is a
     * subcollection. If this isn't a subcollection, the reference is null.
     */    get parent() {
        const e = this._path.popLast();
        return e.isEmpty() ? null : new DocumentReference(this.firestore, 
        /* converter= */ null, new DocumentKey(e));
    }
    withConverter(e) {
        return new CollectionReference(this.firestore, e, this._path);
    }
}

function __PRIVATE_isCollectionReference(e) {
    return e instanceof CollectionReference;
}

function collection(e, t, ...r) {
    if (e = getModularInstance(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t), e instanceof Firestore) {
        const n = ResourcePath.fromString(t, ...r);
        return __PRIVATE_validateCollectionPath(n), new CollectionReference(e, /* converter= */ null, n);
    }
    {
        if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(E.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const n = e._path.child(ResourcePath.fromString(t, ...r));
        return __PRIVATE_validateCollectionPath(n), new CollectionReference(e.firestore, 
        /* converter= */ null, n);
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
 */ function collectionGroup(e, t) {
    if (e = __PRIVATE_cast(e, Firestore), __PRIVATE_validateNonEmptyArgument("collectionGroup", "collection id", t), 
    t.indexOf("/") >= 0) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
    return new Query(e, 
    /* converter= */ null, function __PRIVATE_newQueryForCollectionGroup(e) {
        return new __PRIVATE_QueryImpl(ResourcePath.emptyPath(), e);
    }(t));
}

function doc(e, t, ...r) {
    if (e = getModularInstance(e), 
    // We allow omission of 'pathString' but explicitly prohibit passing in both
    // 'undefined' and 'null'.
    1 === arguments.length && (t = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t), 
    e instanceof Firestore) {
        const n = ResourcePath.fromString(t, ...r);
        return __PRIVATE_validateDocumentPath(n), new DocumentReference(e, 
        /* converter= */ null, new DocumentKey(n));
    }
    {
        if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(E.INVALID_ARGUMENT, "Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const n = e._path.child(ResourcePath.fromString(t, ...r));
        return __PRIVATE_validateDocumentPath(n), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new DocumentKey(n));
    }
}

/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */ function refEqual(e, t) {
    return e = getModularInstance(e), t = getModularInstance(t), (e instanceof DocumentReference || e instanceof CollectionReference) && (t instanceof DocumentReference || t instanceof CollectionReference) && (e.firestore === t.firestore && e.path === t.path && e.converter === t.converter);
}

/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */ function queryEqual(e, t) {
    return e = getModularInstance(e), t = getModularInstance(t), e instanceof Query && t instanceof Query && (e.firestore === t.firestore && __PRIVATE_queryEquals(e._query, t._query) && e.converter === t.converter);
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
 */ class Bytes {
    /** @hideconstructor */
    constructor(e) {
        this._byteString = e;
    }
    /**
     * Creates a new `Bytes` object from the given Base64 string, converting it to
     * bytes.
     *
     * @param base64 - The Base64 string used to create the `Bytes` object.
     */    static fromBase64String(e) {
        try {
            return new Bytes(ByteString.fromBase64String(e));
        } catch (e) {
            throw new FirestoreError(E.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e);
        }
    }
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */    static fromUint8Array(e) {
        return new Bytes(ByteString.fromUint8Array(e));
    }
    /**
     * Returns the underlying bytes as a Base64-encoded string.
     *
     * @returns The Base64-encoded string created from the `Bytes` object.
     */    toBase64() {
        return this._byteString.toBase64();
    }
    /**
     * Returns the underlying bytes in a new `Uint8Array`.
     *
     * @returns The Uint8Array created from the `Bytes` object.
     */    toUint8Array() {
        return this._byteString.toUint8Array();
    }
    /**
     * Returns a string representation of the `Bytes` object.
     *
     * @returns A string representation of the `Bytes` object.
     */    toString() {
        return "Bytes(base64: " + this.toBase64() + ")";
    }
    /**
     * Returns true if this `Bytes` object is equal to the provided one.
     *
     * @param other - The `Bytes` object to compare against.
     * @returns true if this `Bytes` object is equal to the provided one.
     */    isEqual(e) {
        return this._byteString.isEqual(e._byteString);
    }
    /**
     * Returns a JSON-serializable representation of this `Bytes` instance.
     *
     * @returns a JSON representation of this object.
     */    toJSON() {
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
     */    static fromJSON(e) {
        if (__PRIVATE_validateJSON(e, Bytes._jsonSchema)) return Bytes.fromBase64String(e.bytes);
    }
}

Bytes._jsonSchemaVersion = "firestore/bytes/1.0", Bytes._jsonSchema = {
    type: property("string", Bytes._jsonSchemaVersion),
    bytes: property("string")
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
    constructor(...e) {
        for (let t = 0; t < e.length; ++t) if (0 === e[t].length) throw new FirestoreError(E.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
        this._internalPath = new FieldPath$1(e);
    }
    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other - The `FieldPath` to compare against.
     * @returns true if this `FieldPath` is equal to the provided one.
     */    isEqual(e) {
        return this._internalPath.isEqual(e._internalPath);
    }
}

/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */ function documentId() {
    return new FieldPath(R);
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
 */ class FieldValue {
    /**
     * @param _methodName - The public API endpoint that returns this class.
     * @hideconstructor
     */
    constructor(e) {
        this._methodName = e;
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
 */ class GeoPoint {
    /**
     * Creates a new immutable `GeoPoint` object with the provided latitude and
     * longitude values.
     * @param latitude - The latitude as number between -90 and 90.
     * @param longitude - The longitude as number between -180 and 180.
     */
    constructor(e, t) {
        if (!isFinite(e) || e < -90 || e > 90) throw new FirestoreError(E.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
        if (!isFinite(t) || t < -180 || t > 180) throw new FirestoreError(E.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
        this._lat = e, this._long = t;
    }
    /**
     * The latitude of this `GeoPoint` instance.
     */    get latitude() {
        return this._lat;
    }
    /**
     * The longitude of this `GeoPoint` instance.
     */    get longitude() {
        return this._long;
    }
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */    isEqual(e) {
        return this._lat === e._lat && this._long === e._long;
    }
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */    _compareTo(e) {
        return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
    }
    /**
     * Returns a JSON-serializable representation of this `GeoPoint` instance.
     *
     * @returns a JSON representation of this object.
     */    toJSON() {
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
     */    static fromJSON(e) {
        if (__PRIVATE_validateJSON(e, GeoPoint._jsonSchema)) return new GeoPoint(e.latitude, e.longitude);
    }
}

GeoPoint._jsonSchemaVersion = "firestore/geoPoint/1.0", GeoPoint._jsonSchema = {
    type: property("string", GeoPoint._jsonSchemaVersion),
    latitude: property("number"),
    longitude: property("number")
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
 * Represents a vector type in Firestore documents.
 * Create an instance with <code>{@link vector}</code>.
 */
class VectorValue {
    /**
     * @private
     * @internal
     */
    constructor(e) {
        // Making a copy of the parameter.
        this._values = (e || []).map((e => e));
    }
    /**
     * Returns a copy of the raw number array form of the vector.
     */    toArray() {
        return this._values.map((e => e));
    }
    /**
     * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
     */    isEqual(e) {
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
        return function __PRIVATE_isPrimitiveArrayEqual(e, t) {
            if (e.length !== t.length) return !1;
            for (let r = 0; r < e.length; ++r) if (e[r] !== t[r]) return !1;
            return !0;
        }(this._values, e._values);
    }
    /**
     * Returns a JSON-serializable representation of this `VectorValue` instance.
     *
     * @returns a JSON representation of this object.
     */    toJSON() {
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
     */    static fromJSON(e) {
        if (__PRIVATE_validateJSON(e, VectorValue._jsonSchema)) {
            if (Array.isArray(e.vectorValues) && e.vectorValues.every((e => "number" == typeof e))) return new VectorValue(e.vectorValues);
            throw new FirestoreError(E.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
        }
    }
}

VectorValue._jsonSchemaVersion = "firestore/vectorValue/1.0", VectorValue._jsonSchema = {
    type: property("string", VectorValue._jsonSchemaVersion),
    vectorValues: property("object")
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
const x = /^__.*__$/;

/** The result of parsing document data (e.g. for a setData call). */ class ParsedSetData {
    constructor(e, t, r) {
        this.data = e, this.fieldMask = t, this.fieldTransforms = r;
    }
    toMutation(e, t) {
        return null !== this.fieldMask ? new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms) : new __PRIVATE_SetMutation(e, this.data, t, this.fieldTransforms);
    }
}

/** The result of parsing "update" data (i.e. for an updateData call). */ class ParsedUpdateData {
    constructor(e, 
    // The fieldMask does not include document transforms.
    t, r) {
        this.data = e, this.fieldMask = t, this.fieldTransforms = r;
    }
    toMutation(e, t) {
        return new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms);
    }
}

function __PRIVATE_isWrite(e) {
    switch (e) {
      case 0 /* UserDataSource.Set */ :
 // fall through
              case 2 /* UserDataSource.MergeSet */ :
 // fall through
              case 1 /* UserDataSource.Update */ :
        return !0;

      case 3 /* UserDataSource.Argument */ :
      case 4 /* UserDataSource.ArrayArgument */ :
        return !1;

      default:
        throw fail(40011, {
            dataSource: e
        });
    }
}

/** A "context" object passed around while parsing user data. */ class __PRIVATE_ParseContextImpl {
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
    constructor(e, t, r, n, i, s) {
        this.settings = e, this.databaseId = t, this.serializer = r, this.ignoreUndefinedProperties = n, 
        // Minor hack: If fieldTransforms is undefined, we assume this is an
        // external call and we need to validate the entire path.
        void 0 === i && this.G(), this.fieldTransforms = i || [], this.fieldMask = s || [];
    }
    get path() {
        return this.settings.path;
    }
    get dataSource() {
        return this.settings.dataSource;
    }
    /** Returns a new context with the specified settings overwritten. */    te(e) {
        return new __PRIVATE_ParseContextImpl({
            ...this.settings,
            ...e
        }, this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
    }
    J(e) {
        const t = this.path?.child(e), r = this.te({
            path: t,
            arrayElement: !1
        });
        return r.H(e), r;
    }
    Y(e) {
        const t = this.path?.child(e), r = this.te({
            path: t,
            arrayElement: !1
        });
        return r.G(), r;
    }
    X(e) {
        // TODO(b/34871131): We don't support array paths right now; so make path
        // undefined.
        return this.te({
            path: void 0,
            arrayElement: !0
        });
    }
    Z(e) {
        return __PRIVATE_createError(e, this.settings.methodName, this.settings.hasConverter || !1, this.path, this.settings.targetDoc);
    }
    /** Returns 'true' if 'fieldPath' was traversed when creating this context. */    contains(e) {
        return void 0 !== this.fieldMask.find((t => e.isPrefixOf(t))) || void 0 !== this.fieldTransforms.find((t => e.isPrefixOf(t.field)));
    }
    G() {
        // TODO(b/34871131): Remove null check once we have proper paths for fields
        // within arrays.
        if (this.path) for (let e = 0; e < this.path.length; e++) this.H(this.path.get(e));
    }
    H(e) {
        if (0 === e.length) throw this.Z("Document fields must not be empty");
        if (__PRIVATE_isWrite(this.dataSource) && x.test(e)) throw this.Z('Document fields cannot begin and end with "__"');
    }
}

/**
 * Helper for parsing raw user input (provided via the API) into internal model
 * classes.
 */ class __PRIVATE_UserDataReader {
    constructor(e, t, r) {
        this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = r || __PRIVATE_newSerializer(e);
    }
    /** Creates a new top-level parse context. */    ue(e, t, r, n = !1) {
        return new __PRIVATE_ParseContextImpl({
            dataSource: e,
            methodName: t,
            targetDoc: r,
            path: FieldPath$1.emptyPath(),
            arrayElement: !1,
            hasConverter: n
        }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
    }
}

function __PRIVATE_newUserDataReader(e) {
    const t = e._freezeSettings(), r = __PRIVATE_newSerializer(e._databaseId);
    return new __PRIVATE_UserDataReader(e._databaseId, !!t.ignoreUndefinedProperties, r);
}

/** Parse document data from a set() call. */ function __PRIVATE_parseSetData(e, t, r, n, i, s = {}) {
    const o = e.ue(s.merge || s.mergeFields ? 2 /* UserDataSource.MergeSet */ : 0 /* UserDataSource.Set */ , t, r, i);
    __PRIVATE_validatePlainObject("Data must be an object, but it was:", o, n);
    const a = __PRIVATE_parseObject(n, o);
    let u, _;
    if (s.merge) u = new FieldMask(o.fieldMask), _ = o.fieldTransforms; else if (s.mergeFields) {
        const e = [];
        for (const n of s.mergeFields) {
            const i = __PRIVATE_fieldPathFromArgument(t, n, r);
            if (!o.contains(i)) throw new FirestoreError(E.INVALID_ARGUMENT, `Field '${i}' is specified in your field mask but missing from your input data.`);
            __PRIVATE_fieldMaskContains(e, i) || e.push(i);
        }
        u = new FieldMask(e), _ = o.fieldTransforms.filter((e => u.covers(e.field)));
    } else u = null, _ = o.fieldTransforms;
    return new ParsedSetData(new ObjectValue(a), u, _);
}

class __PRIVATE_DeleteFieldValueImpl extends FieldValue {
    _toFieldTransform(e) {
        if (2 /* UserDataSource.MergeSet */ !== e.dataSource) throw 1 /* UserDataSource.Update */ === e.dataSource ? e.Z(`${this._methodName}() can only appear at the top level of your update data`) : e.Z(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
        // No transform to add for a delete, but we need to add it to our
        // fieldMask so it gets deleted.
        return e.fieldMask.push(e.path), null;
    }
    isEqual(e) {
        return e instanceof __PRIVATE_DeleteFieldValueImpl;
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
 */ function __PRIVATE_createSentinelChildContext(e, t, r) {
    return new __PRIVATE_ParseContextImpl({
        dataSource: 3 /* UserDataSource.Argument */ ,
        targetDoc: t.settings.targetDoc,
        methodName: e._methodName,
        arrayElement: r
    }, t.databaseId, t.serializer, t.ignoreUndefinedProperties);
}

class __PRIVATE_ServerTimestampFieldValueImpl extends FieldValue {
    _toFieldTransform(e) {
        return new FieldTransform(e.path, new __PRIVATE_ServerTimestampTransform);
    }
    isEqual(e) {
        return e instanceof __PRIVATE_ServerTimestampFieldValueImpl;
    }
}

class __PRIVATE_ArrayUnionFieldValueImpl extends FieldValue {
    constructor(e, t) {
        super(e), this.te = t;
    }
    _toFieldTransform(e) {
        const t = __PRIVATE_createSentinelChildContext(this, e, 
        /*array=*/ !0), r = this.te.map((e => __PRIVATE_parseData(e, t))), n = new __PRIVATE_ArrayUnionTransformOperation(r);
        return new FieldTransform(e.path, n);
    }
    isEqual(e) {
        return e instanceof __PRIVATE_ArrayUnionFieldValueImpl && deepEqual(this.te, e.te);
    }
}

class __PRIVATE_ArrayRemoveFieldValueImpl extends FieldValue {
    constructor(e, t) {
        super(e), this.te = t;
    }
    _toFieldTransform(e) {
        const t = __PRIVATE_createSentinelChildContext(this, e, 
        /*array=*/ !0), r = this.te.map((e => __PRIVATE_parseData(e, t))), n = new __PRIVATE_ArrayRemoveTransformOperation(r);
        return new FieldTransform(e.path, n);
    }
    isEqual(e) {
        return e instanceof __PRIVATE_ArrayRemoveFieldValueImpl && deepEqual(this.te, e.te);
    }
}

class __PRIVATE_NumericIncrementFieldValueImpl extends FieldValue {
    constructor(e, t) {
        super(e), this.re = t;
    }
    _toFieldTransform(e) {
        const t = new __PRIVATE_NumericIncrementTransformOperation(e.serializer, toNumber(e.serializer, this.re));
        return new FieldTransform(e.path, t);
    }
    isEqual(e) {
        return e instanceof __PRIVATE_NumericIncrementFieldValueImpl && this.re === e.re;
    }
}

/** Parse update data from an update() call. */ function __PRIVATE_parseUpdateData(e, t, r, n) {
    const i = e.ue(1 /* UserDataSource.Update */ , t, r);
    __PRIVATE_validatePlainObject("Data must be an object, but it was:", i, n);
    const s = [], a = ObjectValue.empty();
    forEach(n, ((e, n) => {
        const u = __PRIVATE_fieldPathFromDotSeparatedString(t, e, r);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                n = getModularInstance(n);
        const _ = i.Y(u);
        if (n instanceof __PRIVATE_DeleteFieldValueImpl) 
        // Add it to the field mask, but don't add anything to updateData.
        s.push(u); else {
            const e = __PRIVATE_parseData(n, _);
            null != e && (s.push(u), a.set(u, e));
        }
    }));
    const u = new FieldMask(s);
    return new ParsedUpdateData(a, u, i.fieldTransforms);
}

/** Parse update data from a list of field/value arguments. */ function __PRIVATE_parseUpdateVarargs(e, t, r, n, i, s) {
    const a = e.ue(1 /* UserDataSource.Update */ , t, r), u = [ __PRIVATE_fieldPathFromArgument(t, n, r) ], _ = [ i ];
    if (s.length % 2 != 0) throw new FirestoreError(E.INVALID_ARGUMENT, `Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);
    for (let e = 0; e < s.length; e += 2) u.push(__PRIVATE_fieldPathFromArgument(t, s[e])), 
    _.push(s[e + 1]);
    const c = [], l = ObjectValue.empty();
    // We iterate in reverse order to pick the last value for a field if the
    // user specified the field multiple times.
    for (let e = u.length - 1; e >= 0; --e) if (!__PRIVATE_fieldMaskContains(c, u[e])) {
        const t = u[e];
        let r = _[e];
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                r = getModularInstance(r);
        const n = a.Y(t);
        if (r instanceof __PRIVATE_DeleteFieldValueImpl) 
        // Add it to the field mask, but don't add anything to updateData.
        c.push(t); else {
            const e = __PRIVATE_parseData(r, n);
            null != e && (c.push(t), l.set(t, e));
        }
    }
    const h = new FieldMask(c);
    return new ParsedUpdateData(l, h, a.fieldTransforms);
}

/**
 * Parse a "query value" (e.g. value in a where filter or a value in a cursor
 * bound).
 *
 * @param allowArrays - Whether the query value is an array that may directly
 * contain additional arrays (e.g. the operand of an `in` query).
 */ function __PRIVATE_parseQueryValue(e, t, r, n = !1) {
    return __PRIVATE_parseData(r, e.ue(n ? 4 /* UserDataSource.ArrayArgument */ : 3 /* UserDataSource.Argument */ , t));
}

/**
 * Parses user data to Protobuf Values.
 *
 * @param input - Data to be parsed.
 * @param context - A context object representing the current path being parsed,
 * the source of the data being parsed, etc.
 * @returns The parsed value, or null if the value was a FieldValue sentinel
 * that should not be included in the resulting parsed data.
 */ function __PRIVATE_parseData(e, t) {
    if (__PRIVATE_looksLikeJsonObject(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    e = getModularInstance(e))) return __PRIVATE_validatePlainObject("Unsupported field value:", t, e), 
    __PRIVATE_parseObject(e, t);
    if (e instanceof FieldValue) 
    // FieldValues usually parse into transforms (except deleteField())
    // in which case we do not want to include this field in our parsed data
    // (as doing so will overwrite the field directly prior to the transform
    // trying to transform it). So we don't add this location to
    // context.fieldMask and we return null as our parsing result.
    /**
 * "Parses" the provided FieldValueImpl, adding any necessary transforms to
 * context.fieldTransforms.
 */
    return function __PRIVATE_parseSentinelFieldValue(e, t) {
        // Sentinels are only supported with writes, and not within arrays.
        if (!__PRIVATE_isWrite(t.dataSource)) throw t.Z(`${e._methodName}() can only be used with update() and set()`);
        if (!t.path) throw t.Z(`${e._methodName}() is not currently supported inside arrays`);
        const r = e._toFieldTransform(t);
        r && t.fieldTransforms.push(r);
    }
    /**
 * Helper to parse a scalar value (i.e. not an Object, Array, or FieldValue)
 *
 * @returns The parsed value
 */ (e, t), null;
    if (void 0 === e && t.ignoreUndefinedProperties) 
    // If the input is undefined it can never participate in the fieldMask, so
    // don't handle this below. If `ignoreUndefinedProperties` is false,
    // `parseScalarValue` will reject an undefined value.
    return null;
    if (
    // If context.path is null we are inside an array and we don't support
    // field mask paths more granular than the top-level array.
    t.path && t.fieldMask.push(t.path), e instanceof Array) {
        // TODO(b/34871131): Include the path containing the array in the error
        // message.
        // In the case of IN queries, the parsed data is an array (representing
        // the set of values to be included for the IN query) that may directly
        // contain additional arrays (each representing an individual field
        // value), so we disable this validation.
        if (t.settings.arrayElement && 4 /* UserDataSource.ArrayArgument */ !== t.dataSource) throw t.Z("Nested arrays are not supported");
        return function __PRIVATE_parseArray(e, t) {
            const r = [];
            let n = 0;
            for (const i of e) {
                let e = __PRIVATE_parseData(i, t.X(n));
                null == e && (
                // Just include nulls in the array for fields being replaced with a
                // sentinel.
                e = {
                    nullValue: "NULL_VALUE"
                }), r.push(e), n++;
            }
            return {
                arrayValue: {
                    values: r
                }
            };
        }(e, t);
    }
    return function __PRIVATE_parseScalarValue(e, t) {
        if (null === (e = getModularInstance(e))) return {
            nullValue: "NULL_VALUE"
        };
        if ("number" == typeof e) return toNumber(t.serializer, e);
        if ("boolean" == typeof e) return {
            booleanValue: e
        };
        if ("string" == typeof e) return {
            stringValue: e
        };
        if (e instanceof Date) {
            const r = Timestamp.fromDate(e);
            return {
                timestampValue: toTimestamp(t.serializer, r)
            };
        }
        if (e instanceof Timestamp) {
            // Firestore backend truncates precision down to microseconds. To ensure
            // offline mode works the same with regards to truncation, perform the
            // truncation immediately without waiting for the backend to do that.
            const r = new Timestamp(e.seconds, 1e3 * Math.floor(e.nanoseconds / 1e3));
            return {
                timestampValue: toTimestamp(t.serializer, r)
            };
        }
        if (e instanceof GeoPoint) return {
            geoPointValue: {
                latitude: e.latitude,
                longitude: e.longitude
            }
        };
        if (e instanceof Bytes) return {
            bytesValue: __PRIVATE_toBytes(t.serializer, e._byteString)
        };
        if (e instanceof DocumentReference) {
            const r = t.databaseId, n = e.firestore._databaseId;
            if (!n.isEqual(r)) throw t.Z(`Document reference is for database ${n.projectId}/${n.database} but should be for database ${r.projectId}/${r.database}`);
            return {
                referenceValue: __PRIVATE_toResourceName(e.firestore._databaseId || t.databaseId, e._key.path)
            };
        }
        if (e instanceof VectorValue) 
        /**
 * Creates a new VectorValue proto value (using the internal format).
 */
        return function __PRIVATE_parseVectorValue(e, t) {
            const r = e instanceof VectorValue ? e.toArray() : e, n = {
                fields: {
                    [b]: {
                        stringValue: C
                    },
                    [N]: {
                        arrayValue: {
                            values: r.map((e => {
                                if ("number" != typeof e) throw t.Z("VectorValues must only contain numeric values.");
                                return __PRIVATE_toDouble(t.serializer, e);
                            }))
                        }
                    }
                }
            };
            return {
                mapValue: n
            };
        }
        /**
 * Checks whether an object looks like a JSON object that should be converted
 * into a struct. Normal class/prototype instances are considered to look like
 * JSON objects since they should be converted to a struct value. Arrays, Dates,
 * GeoPoints, etc. are not considered to look like JSON objects since they map
 * to specific FieldValue types other than ObjectValue.
 */ (e, t);
        if (__PRIVATE_isProtoValueSerializable(e)) return e._toProto(t.serializer);
        throw t.Z(`Unsupported field value: ${__PRIVATE_valueDescription(e)}`);
    }(e, t);
}

function __PRIVATE_parseObject(e, t) {
    const r = {};
    return !function isEmpty(e) {
        for (const t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
        return !0;
    }(e) ? forEach(e, ((e, n) => {
        const i = __PRIVATE_parseData(n, t.J(e));
        null != i && (r[e] = i);
    })) : 
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    t.path && t.path.length > 0 && t.fieldMask.push(t.path), {
        mapValue: {
            fields: r
        }
    };
}

function __PRIVATE_looksLikeJsonObject(e) {
    return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof Timestamp || e instanceof GeoPoint || e instanceof Bytes || e instanceof DocumentReference || e instanceof FieldValue || e instanceof VectorValue || __PRIVATE_isProtoValueSerializable(e));
}

function __PRIVATE_validatePlainObject(e, t, r) {
    if (!__PRIVATE_looksLikeJsonObject(r) || !__PRIVATE_isPlainObject(r)) {
        const n = __PRIVATE_valueDescription(r);
        throw "an object" === n ? t.Z(e + " a custom object") : t.Z(e + " " + n);
    }
}

/**
 * Helper that calls fromDotSeparatedString() but wraps any error thrown.
 */ function __PRIVATE_fieldPathFromArgument(e, t, r) {
    if ((
    // If required, replace the FieldPath Compat class with the firestore-exp
    // FieldPath.
    t = getModularInstance(t)) instanceof FieldPath) return t._internalPath;
    if ("string" == typeof t) return __PRIVATE_fieldPathFromDotSeparatedString(e, t);
    throw __PRIVATE_createError("Field path arguments must be of type string or ", e, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, r);
}

/**
 * Matches any characters in a field path string that are reserved.
 */ const k = new RegExp("[~\\*/\\[\\]]");

/**
 * Wraps fromDotSeparatedString with an error message about the method that
 * was thrown.
 * @param methodName - The publicly visible method name
 * @param path - The dot-separated string form of a field path which will be
 * split on dots.
 * @param targetDoc - The document against which the field path will be
 * evaluated.
 */ function __PRIVATE_fieldPathFromDotSeparatedString(e, t, r) {
    if (t.search(k) >= 0) throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`, e, 
    /* hasConverter= */ !1, 
    /* path= */ void 0, r);
    try {
        return new FieldPath(...t.split("."))._internalPath;
    } catch (n) {
        throw __PRIVATE_createError(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, e, 
        /* hasConverter= */ !1, 
        /* path= */ void 0, r);
    }
}

function __PRIVATE_createError(e, t, r, n, i) {
    const s = n && !n.isEmpty(), o = void 0 !== i;
    let a = `Function ${t}() called with invalid data`;
    r && (a += " (via `toFirestore()`)"), a += ". ";
    let u = "";
    return (s || o) && (u += " (found", s && (u += ` in field ${n}`), o && (u += ` in document ${i}`), 
    u += ")"), new FirestoreError(E.INVALID_ARGUMENT, a + e + u);
}

/** Checks `haystack` if FieldPath `needle` is present. Runs in O(n). */ function __PRIVATE_fieldMaskContains(e, t) {
    return e.some((e => e.isEqual(t)));
}

function __PRIVATE_isUserData(e) {
    return "function" == typeof e._readUserData;
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
 */ class DocumentSnapshot {
    // Note: This class is stripped down version of the DocumentSnapshot in
    // the legacy SDK. The changes are:
    // - No support for SnapshotMetadata.
    // - No support for SnapshotOptions.
    /** @hideconstructor protected */
    constructor(e, t, r, n, i) {
        this._firestore = e, this._userDataWriter = t, this._key = r, this._document = n, 
        this._converter = i;
    }
    /** Property of the `DocumentSnapshot` that provides the document's ID. */    get id() {
        return this._key.path.lastSegment();
    }
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */    get ref() {
        return new DocumentReference(this._firestore, this._converter, this._key);
    }
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */    exists() {
        return null !== this._document;
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */    data() {
        if (this._document) {
            if (this._converter) {
                // We only want to use the converter and create a new DocumentSnapshot
                // if a converter has been provided.
                const e = new QueryDocumentSnapshot(this._firestore, this._userDataWriter, this._key, this._document, 
                /* converter= */ null);
                return this._converter.fromFirestore(e);
            }
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
     */    _fieldsProto() {
        // Return a cloned value to prevent manipulation of the Snapshot's data
        return this._document?.data.clone().value.mapValue.fields ?? void 0;
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
    get(e) {
        if (this._document) {
            const t = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
            if (null !== t) return this._userDataWriter.convertValue(t);
        }
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
 */ class QueryDocumentSnapshot extends DocumentSnapshot {
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
 */ class QuerySnapshot {
    /** @hideconstructor */
    constructor(e, t) {
        this._docs = t, this.query = e;
    }
    /** An array of all the documents in the `QuerySnapshot`. */    get docs() {
        return [ ...this._docs ];
    }
    /** The number of documents in the `QuerySnapshot`. */    get size() {
        return this.docs.length;
    }
    /** True if there are no documents in the `QuerySnapshot`. */    get empty() {
        return 0 === this.docs.length;
    }
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */    forEach(e, t) {
        this._docs.forEach(e, t);
    }
}

/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */ function snapshotEqual(e, t) {
    return e = getModularInstance(e), t = getModularInstance(t), e instanceof DocumentSnapshot && t instanceof DocumentSnapshot ? e._firestore === t._firestore && e._key.isEqual(t._key) && (null === e._document ? null === t._document : e._document.isEqual(t._document)) && e._converter === t._converter : e instanceof QuerySnapshot && t instanceof QuerySnapshot && (queryEqual(e.query, t.query) && __PRIVATE_arrayEquals(e.docs, t.docs, snapshotEqual));
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
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */
class AppliableConstraint {}

/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */ class QueryConstraint extends AppliableConstraint {}

function query(e, t, ...r) {
    let n = [];
    t instanceof AppliableConstraint && n.push(t), n = n.concat(r), function __PRIVATE_validateQueryConstraintArray(e) {
        const t = e.filter((e => e instanceof QueryCompositeFilterConstraint)).length, r = e.filter((e => e instanceof QueryFieldFilterConstraint)).length;
        if (t > 1 || t > 0 && r > 0) throw new FirestoreError(E.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
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
 */ (n);
    for (const t of n) e = t._apply(e);
    return e;
}

/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */ class QueryFieldFilterConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(e, t, r) {
        super(), this._field = e, this._op = t, this._value = r, 
        /** The type of this query constraint */
        this.type = "where";
    }
    static _create(e, t, r) {
        return new QueryFieldFilterConstraint(e, t, r);
    }
    _apply(e) {
        const t = this._parse(e);
        return __PRIVATE_validateNewFieldFilter(e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t));
    }
    _parse(e) {
        const t = __PRIVATE_newUserDataReader(e.firestore), r = function __PRIVATE_newQueryFilter(e, t, r, n, i, s, o) {
            let a;
            if (i.isKeyField()) {
                if ("array-contains" /* Operator.ARRAY_CONTAINS */ === s || "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ === s) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid Query. You can't perform '${s}' queries on documentId().`);
                if ("in" /* Operator.IN */ === s || "not-in" /* Operator.NOT_IN */ === s) {
                    __PRIVATE_validateDisjunctiveFilterElements(o, s);
                    const t = [];
                    for (const r of o) t.push(__PRIVATE_parseDocumentIdValue(n, e, r));
                    a = {
                        arrayValue: {
                            values: t
                        }
                    };
                } else a = __PRIVATE_parseDocumentIdValue(n, e, o);
            } else "in" /* Operator.IN */ !== s && "not-in" /* Operator.NOT_IN */ !== s && "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ !== s || __PRIVATE_validateDisjunctiveFilterElements(o, s), 
            a = __PRIVATE_parseQueryValue(r, t, o, 
            /* allowArrays= */ "in" /* Operator.IN */ === s || "not-in" /* Operator.NOT_IN */ === s);
            const u = FieldFilter.create(i, s, a);
            return u;
        }(e._query, "where", t, e.firestore._databaseId, this._field, this._op, this._value);
        return r;
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
 */ function where(e, t, r) {
    const n = t, i = __PRIVATE_fieldPathFromArgument("where", e);
    return QueryFieldFilterConstraint._create(i, n, r);
}

/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */ class QueryCompositeFilterConstraint extends AppliableConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    e, t) {
        super(), this.type = e, this._queryConstraints = t;
    }
    static _create(e, t) {
        return new QueryCompositeFilterConstraint(e, t);
    }
    _parse(e) {
        const t = this._queryConstraints.map((t => t._parse(e))).filter((e => e.getFilters().length > 0));
        return 1 === t.length ? t[0] : CompositeFilter.create(t, this._getOperator());
    }
    _apply(e) {
        const t = this._parse(e);
        return 0 === t.getFilters().length ? e : (function __PRIVATE_validateNewFilter(e, t) {
            let r = e;
            const n = t.getFlattenedFilters();
            for (const e of n) __PRIVATE_validateNewFieldFilter(r, e), r = __PRIVATE_queryWithAddedFilter(r, e);
        }
        // Checks if any of the provided filter operators are included in the given list of filters and
        // returns the first one that is, or null if none are.
        (e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t)));
    }
    _getQueryConstraints() {
        return this._queryConstraints;
    }
    _getOperator() {
        return "and" === this.type ? "and" /* CompositeOperator.AND */ : "or" /* CompositeOperator.OR */;
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
 */ function or(...e) {
    // Only support QueryFilterConstraints
    return e.forEach((e => __PRIVATE_validateQueryFilterConstraint("or", e))), QueryCompositeFilterConstraint._create("or" /* CompositeOperator.OR */ , e);
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
 */ function and(...e) {
    // Only support QueryFilterConstraints
    return e.forEach((e => __PRIVATE_validateQueryFilterConstraint("and", e))), QueryCompositeFilterConstraint._create("and" /* CompositeOperator.AND */ , e);
}

/**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */ class QueryOrderByConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(e, t) {
        super(), this._field = e, this._direction = t, 
        /** The type of this query constraint */
        this.type = "orderBy";
    }
    static _create(e, t) {
        return new QueryOrderByConstraint(e, t);
    }
    _apply(e) {
        const t = function __PRIVATE_newQueryOrderBy(e, t, r) {
            if (null !== e.startAt) throw new FirestoreError(E.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
            if (null !== e.endAt) throw new FirestoreError(E.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
            const n = new OrderBy(t, r);
            return n;
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
 */ (e._query, this._field, this._direction);
        return new Query(e.firestore, e.converter, function __PRIVATE_queryWithAddedOrderBy(e, t) {
            // TODO(dimond): validate that orderBy does not list the same key twice.
            const r = e.explicitOrderBy.concat([ t ]);
            return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, r, e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
        }(e._query, t));
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
 */ function orderBy(e, t = "asc") {
    const r = t, n = __PRIVATE_fieldPathFromArgument("orderBy", e);
    return QueryOrderByConstraint._create(n, r);
}

/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */ class QueryLimitConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    e, t, r) {
        super(), this.type = e, this._limit = t, this._limitType = r;
    }
    static _create(e, t, r) {
        return new QueryLimitConstraint(e, t, r);
    }
    _apply(e) {
        return new Query(e.firestore, e.converter, function __PRIVATE_queryWithLimit(e, t, r) {
            return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, r, e.startAt, e.endAt);
        }(e._query, this._limit, this._limitType));
    }
}

/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */ function limit(e) {
    return __PRIVATE_validatePositiveNumber("limit", e), QueryLimitConstraint._create("limit", e, "F" /* LimitType.First */);
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
 */ function limitToLast(e) {
    return __PRIVATE_validatePositiveNumber("limitToLast", e), QueryLimitConstraint._create("limitToLast", e, "L" /* LimitType.Last */);
}

/**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */ class QueryStartAtConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    e, t, r) {
        super(), this.type = e, this._docOrFields = t, this._inclusive = r;
    }
    static _create(e, t, r) {
        return new QueryStartAtConstraint(e, t, r);
    }
    _apply(e) {
        const t = __PRIVATE_newQueryBoundFromDocOrFields(e, this.type, this._docOrFields, this._inclusive);
        return new Query(e.firestore, e.converter, function __PRIVATE_queryWithStartAt(e, t) {
            return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, t, e.endAt);
        }(e._query, t));
    }
}

function startAt(...e) {
    return QueryStartAtConstraint._create("startAt", e, 
    /*inclusive=*/ !0);
}

function startAfter(...e) {
    return QueryStartAtConstraint._create("startAfter", e, 
    /*inclusive=*/ !1);
}

/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */ class QueryEndAtConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    e, t, r) {
        super(), this.type = e, this._docOrFields = t, this._inclusive = r;
    }
    static _create(e, t, r) {
        return new QueryEndAtConstraint(e, t, r);
    }
    _apply(e) {
        const t = __PRIVATE_newQueryBoundFromDocOrFields(e, this.type, this._docOrFields, this._inclusive);
        return new Query(e.firestore, e.converter, function __PRIVATE_queryWithEndAt(e, t) {
            return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), e.limit, e.limitType, e.startAt, t);
        }(e._query, t));
    }
}

function endBefore(...e) {
    return QueryEndAtConstraint._create("endBefore", e, 
    /*inclusive=*/ !1);
}

function endAt(...e) {
    return QueryEndAtConstraint._create("endAt", e, 
    /*inclusive=*/ !0);
}

/** Helper function to create a bound from a document or fields */ function __PRIVATE_newQueryBoundFromDocOrFields(e, t, r, n) {
    if (r[0] = getModularInstance(r[0]), r[0] instanceof DocumentSnapshot) return function __PRIVATE_newQueryBoundFromDocument(e, t, r, n, i) {
        if (!n) throw new FirestoreError(E.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ${r}().`);
        const s = [];
        // Because people expect to continue/end a query at the exact document
        // provided, we need to use the implicit sort order rather than the explicit
        // sort order, because it's guaranteed to contain the document key. That way
        // the position becomes unambiguous and the query continues/ends exactly at
        // the provided document. Without the key (by using the explicit sort
        // orders), multiple documents could match the position, yielding duplicate
        // results.
                for (const r of __PRIVATE_queryNormalizedOrderBy(e)) if (r.field.isKeyField()) s.push(__PRIVATE_refValue(t, n.key)); else {
            const e = n.data.field(r.field);
            if (__PRIVATE_isServerTimestamp(e)) throw new FirestoreError(E.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a document for which the field "' + r.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
            if (null === e) {
                const e = r.field.canonicalString();
                throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`);
            }
            s.push(e);
        }
        return new Bound(s, i);
    }
    /**
 * Converts a list of field values to a `Bound` for the given query.
 */ (e._query, e.firestore._databaseId, t, r[0]._document, n);
    {
        const i = __PRIVATE_newUserDataReader(e.firestore);
        return function __PRIVATE_newQueryBoundFromFields(e, t, r, n, i, s) {
            // Use explicit order by's because it has to match the query the user made
            const o = e.explicitOrderBy;
            if (i.length > o.length) throw new FirestoreError(E.INVALID_ARGUMENT, `Too many arguments provided to ${n}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
            const a = [];
            for (let s = 0; s < i.length; s++) {
                const u = i[s];
                if (o[s].field.isKeyField()) {
                    if ("string" != typeof u) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ${n}(), but got a ${typeof u}`);
                    if (!__PRIVATE_isCollectionGroupQuery(e) && -1 !== u.indexOf("/")) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by documentId(), the value passed to ${n}() must be a plain document ID, but '${u}' contains a slash.`);
                    const r = e.path.child(ResourcePath.fromString(u));
                    if (!DocumentKey.isDocumentKey(r)) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${n}() must result in a valid document path, but '${r}' is not because it contains an odd number of segments.`);
                    const i = new DocumentKey(r);
                    a.push(__PRIVATE_refValue(t, i));
                } else {
                    const e = __PRIVATE_parseQueryValue(r, n, u);
                    a.push(e);
                }
            }
            return new Bound(a, s);
        }
        /**
 * Parses the given `documentIdValue` into a `ReferenceValue`, throwing
 * appropriate errors if the value is anything other than a `DocumentReference`
 * or `string`, or if the string is malformed.
 */ (e._query, e.firestore._databaseId, i, t, r, n);
    }
}

function __PRIVATE_parseDocumentIdValue(e, t, r) {
    if ("string" == typeof (r = getModularInstance(r))) {
        if ("" === r) throw new FirestoreError(E.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
        if (!__PRIVATE_isCollectionGroupQuery(t) && -1 !== r.indexOf("/")) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${r}' contains a '/' character.`);
        const n = t.path.child(ResourcePath.fromString(r));
        if (!DocumentKey.isDocumentKey(n)) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);
        return __PRIVATE_refValue(e, new DocumentKey(n));
    }
    if (r instanceof DocumentReference) return __PRIVATE_refValue(e, r._key);
    throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${__PRIVATE_valueDescription(r)}.`);
}

/**
 * Validates that the value passed into a disjunctive filter satisfies all
 * array requirements.
 */ function __PRIVATE_validateDisjunctiveFilterElements(e, t) {
    if (!Array.isArray(e) || 0 === e.length) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${t.toString()}' filters.`);
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
 */ function __PRIVATE_validateNewFieldFilter(e, t) {
    const r = function __PRIVATE_findOpInsideFilters(e, t) {
        for (const r of e) for (const e of r.getFlattenedFilters()) if (t.indexOf(e.op) >= 0) return e.op;
        return null;
    }(e.filters, function __PRIVATE_conflictingOps(e) {
        switch (e) {
          case "!=" /* Operator.NOT_EQUAL */ :
            return [ "!=" /* Operator.NOT_EQUAL */ , "not-in" /* Operator.NOT_IN */ ];

          case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ :
          case "in" /* Operator.IN */ :
            return [ "not-in" /* Operator.NOT_IN */ ];

          case "not-in" /* Operator.NOT_IN */ :
            return [ "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ , "in" /* Operator.IN */ , "not-in" /* Operator.NOT_IN */ , "!=" /* Operator.NOT_EQUAL */ ];

          default:
            return [];
        }
    }(t.op));
    if (null !== r) 
    // Special case when it's a duplicate op to give a slightly clearer error message.
    throw r === t.op ? new FirestoreError(E.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${t.op.toString()}' filter.`) : new FirestoreError(E.INVALID_ARGUMENT, `Invalid query. You cannot use '${t.op.toString()}' filters with '${r.toString()}' filters.`);
}

function __PRIVATE_validateQueryFilterConstraint(e, t) {
    if (!(t instanceof QueryFieldFilterConstraint || t instanceof QueryCompositeFilterConstraint)) throw new FirestoreError(E.INVALID_ARGUMENT, `Function ${e}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`);
}

class AbstractUserDataWriter {
    convertValue(e, t = "none") {
        switch (__PRIVATE_typeOrder(e)) {
          case 0 /* TypeOrder.NullValue */ :
            return null;

          case 1 /* TypeOrder.BooleanValue */ :
            return e.booleanValue;

          case 2 /* TypeOrder.NumberValue */ :
            return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);

          case 3 /* TypeOrder.TimestampValue */ :
            return this.convertTimestamp(e.timestampValue);

          case 4 /* TypeOrder.ServerTimestampValue */ :
            return this.convertServerTimestamp(e, t);

          case 5 /* TypeOrder.StringValue */ :
            return e.stringValue;

          case 6 /* TypeOrder.BlobValue */ :
            return this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue));

          case 7 /* TypeOrder.RefValue */ :
            return this.convertReference(e.referenceValue);

          case 8 /* TypeOrder.GeoPointValue */ :
            return this.convertGeoPoint(e.geoPointValue);

          case 9 /* TypeOrder.ArrayValue */ :
            return this.convertArray(e.arrayValue, t);

          case 11 /* TypeOrder.ObjectValue */ :
            return this.convertObject(e.mapValue, t);

          case 10 /* TypeOrder.VectorValue */ :
            return this.convertVectorValue(e.mapValue);

          default:
            throw fail(62114, {
                value: e
            });
        }
    }
    convertObject(e, t) {
        return this.convertObjectMap(e.fields, t);
    }
    /**
     * @internal
     */    convertObjectMap(e, t = "none") {
        const r = {};
        return forEach(e, ((e, n) => {
            r[e] = this.convertValue(n, t);
        })), r;
    }
    /**
     * @internal
     */    convertVectorValue(e) {
        const t = e.fields?.[N].arrayValue?.values?.map((e => __PRIVATE_normalizeNumber(e.doubleValue)));
        return new VectorValue(t);
    }
    convertGeoPoint(e) {
        return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
    }
    convertArray(e, t) {
        return (e.values || []).map((e => this.convertValue(e, t)));
    }
    convertServerTimestamp(e, t) {
        switch (t) {
          case "previous":
            const r = __PRIVATE_getPreviousValue(e);
            return null == r ? null : this.convertValue(r, t);

          case "estimate":
            return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));

          default:
            return null;
        }
    }
    convertTimestamp(e) {
        const t = __PRIVATE_normalizeTimestamp(e);
        return new Timestamp(t.seconds, t.nanos);
    }
    convertDocumentKey(e, t) {
        const r = ResourcePath.fromString(e);
        __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(r), 9688, {
            name: e
        });
        const n = new DatabaseId(r.get(1), r.get(3)), i = new DocumentKey(r.popFirst(5));
        return n.isEqual(t) || 
        // TODO(b/64130202): Somehow support foreign references.
        __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${n.projectId}/${n.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), 
        i;
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
 */ function __PRIVATE_applyFirestoreDataConverter(e, t, r) {
    let n;
    // Cast to `any` in order to satisfy the union type constraint on
    // toFirestore().
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return n = e ? r && (r.merge || r.mergeFields) ? e.toFirestore(t, r) : e.toFirestore(t) : t, 
    n;
}

class __PRIVATE_LiteUserDataWriter extends AbstractUserDataWriter {
    constructor(e) {
        super(), this.firestore = e;
    }
    convertBytes(e) {
        return new Bytes(e);
    }
    convertReference(e) {
        const t = this.convertDocumentKey(e, this.firestore._databaseId);
        return new DocumentReference(this.firestore, /* converter= */ null, t);
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
 */ function getDoc(e) {
    const t = __PRIVATE_getDatastore((e = __PRIVATE_cast(e, DocumentReference)).firestore), r = new __PRIVATE_LiteUserDataWriter(e.firestore);
    return __PRIVATE_invokeBatchGetDocumentsRpc(t, [ e._key ]).then((t => {
        __PRIVATE_hardAssert(1 === t.length, 15618);
        const n = t[0];
        return new DocumentSnapshot(e.firestore, r, e._key, n.isFoundDocument() ? n : null, e.converter);
    }));
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
 */ function getDocs(e) {
    (function __PRIVATE_validateHasExplicitOrderByForLimitToLast(e) {
        if ("L" /* LimitType.Last */ === e.limitType && 0 === e.explicitOrderBy.length) throw new FirestoreError(E.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
    })((e = __PRIVATE_cast(e, Query))._query);
    const t = __PRIVATE_getDatastore(e.firestore), r = new __PRIVATE_LiteUserDataWriter(e.firestore);
    return __PRIVATE_invokeRunQueryRpc(t, e._query).then((t => {
        const n = t.map((t => new QueryDocumentSnapshot(e.firestore, r, t.key, t, e.converter)));
        return "L" /* LimitType.Last */ === e._query.limitType && 
        // Limit to last queries reverse the orderBy constraint that was
        // specified by the user. As such, we need to reverse the order of the
        // results to return the documents in the expected order.
        n.reverse(), new QuerySnapshot(e, n);
    }));
}

function setDoc(e, t, r) {
    const n = __PRIVATE_applyFirestoreDataConverter((e = __PRIVATE_cast(e, DocumentReference)).converter, t, r), i = __PRIVATE_parseSetData(__PRIVATE_newUserDataReader(e.firestore), "setDoc", e._key, n, null !== e.converter, r);
    return __PRIVATE_invokeCommitRpc(__PRIVATE_getDatastore(e.firestore), [ i.toMutation(e._key, Precondition.none()) ]);
}

function updateDoc(e, t, r, ...n) {
    const i = __PRIVATE_newUserDataReader((e = __PRIVATE_cast(e, DocumentReference)).firestore);
    // For Compat types, we have to "extract" the underlying types before
    // performing validation.
        let s;
    s = "string" == typeof (t = getModularInstance(t)) || t instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(i, "updateDoc", e._key, t, r, n) : __PRIVATE_parseUpdateData(i, "updateDoc", e._key, t);
    return __PRIVATE_invokeCommitRpc(__PRIVATE_getDatastore(e.firestore), [ s.toMutation(e._key, Precondition.exists(!0)) ]);
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
 */ function deleteDoc(e) {
    return __PRIVATE_invokeCommitRpc(__PRIVATE_getDatastore((e = __PRIVATE_cast(e, DocumentReference)).firestore), [ new __PRIVATE_DeleteMutation(e._key, Precondition.none()) ]);
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
 */ function addDoc(e, t) {
    const r = doc(e = __PRIVATE_cast(e, CollectionReference)), n = __PRIVATE_applyFirestoreDataConverter(e.converter, t), i = __PRIVATE_parseSetData(__PRIVATE_newUserDataReader(e.firestore), "addDoc", r._key, n, null !== r.converter, {});
    return __PRIVATE_invokeCommitRpc(__PRIVATE_getDatastore(e.firestore), [ i.toMutation(r._key, Precondition.exists(!1)) ]).then((() => r));
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
 */ function deleteField() {
    return new __PRIVATE_DeleteFieldValueImpl("deleteField");
}

/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */ function serverTimestamp() {
    return new __PRIVATE_ServerTimestampFieldValueImpl("serverTimestamp");
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
 */ function arrayUnion(...e) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new __PRIVATE_ArrayUnionFieldValueImpl("arrayUnion", e);
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
 */ function arrayRemove(...e) {
    // NOTE: We don't actually parse the data until it's used in set() or
    // update() since we'd need the Firestore instance to do this.
    return new __PRIVATE_ArrayRemoveFieldValueImpl("arrayRemove", e);
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
 */ function increment(e) {
    return new __PRIVATE_NumericIncrementFieldValueImpl("increment", e);
}

/**
 * Creates a new `VectorValue` constructed with a copy of the given array of numbers.
 *
 * @param values - Create a `VectorValue` instance with a copy of this array of numbers.
 *
 * @returns A new `VectorValue` constructed with a copy of the given array of numbers.
 */ function vector(e) {
    return new VectorValue(e);
}

export { arrayRemove as $, __PRIVATE_VerifyMutation as A, Bytes as B, CollectionReference as C, DocumentSnapshot as D, E, Firestore as F, DocumentReference as G, FieldValue as H, GeoPoint as I, QueryCompositeFilterConstraint as J, QueryConstraint as K, QueryDocumentSnapshot as L, QueryEndAtConstraint as M, QueryFieldFilterConstraint as N, ObjectValue as O, Precondition as P, Query as Q, QueryLimitConstraint as R, SnapshotVersion as S, QueryOrderByConstraint as T, QuerySnapshot as U, QueryStartAtConstraint as V, Timestamp as W, VectorValue as X, addDoc as Y, and as Z, __PRIVATE_setSDKVersion as _, __PRIVATE_LiteAuthCredentialsProvider as a, arrayUnion as a0, collection as a1, collectionGroup as a2, connectFirestoreEmulator as a3, deleteDoc as a4, deleteField as a5, doc as a6, documentId as a7, endAt as a8, endBefore as a9, __PRIVATE_isCollectionReference as aA, __PRIVATE_isNumber as aB, __PRIVATE_isPlainObject as aC, __PRIVATE_invokeExecutePipeline as aD, __PRIVATE_toMapValue as aE, __PRIVATE_isCollectionGroupQuery as aF, __PRIVATE_isDocumentQuery as aG, __PRIVATE_queryNormalizedOrderBy as aH, toNumber as aI, __PRIVATE_toPipelineValue as aJ, __PRIVATE_isUserData as aK, FieldPath$1 as aL, FieldFilter as aM, CompositeFilter as aN, getDoc as aa, getDocs as ab, getFirestore as ac, increment as ad, initializeFirestore as ae, limit as af, limitToLast as ag, or as ah, orderBy as ai, query as aj, refEqual as ak, serverTimestamp as al, setDoc as am, setLogLevel as an, snapshotEqual as ao, startAfter as ap, startAt as aq, terminate as ar, updateDoc as as, vector as at, where as au, __PRIVATE_isString as av, R as aw, __PRIVATE_hardAssert as ax, __PRIVATE_parseData as ay, __PRIVATE_toStringValue as az, __PRIVATE_LiteAppCheckTokenProvider as b, __PRIVATE_databaseIdFromApp as c, __PRIVATE_cast as d, __PRIVATE_getDatastore as e, __PRIVATE_mapToArray as f, __PRIVATE_invokeRunAggregationQueryRpc as g, __PRIVATE_LiteUserDataWriter as h, __PRIVATE_fieldPathFromArgument as i, __PRIVATE_newUserDataReader as j, __PRIVATE_applyFirestoreDataConverter as k, __PRIVATE_parseSetData as l, FieldPath as m, __PRIVATE_parseUpdateVarargs as n, __PRIVATE_parseUpdateData as o, __PRIVATE_DeleteMutation as p, queryEqual as q, FirestoreError as r, __PRIVATE_invokeCommitRpc as s, fail as t, __PRIVATE_isNullOrUndefined as u, __PRIVATE_isPermanentError as v, __PRIVATE_logDebug as w, __PRIVATE_logError as x, __PRIVATE_invokeBatchGetDocumentsRpc as y, DocumentKey as z };
//# sourceMappingURL=common-0a3137f7.esm.js.map
