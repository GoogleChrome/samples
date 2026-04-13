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
/**
 * @internal
 */
interface _FirebaseService {
    app: FirebaseApp;
    /**
     * Delete the service and free it's resources - called from
     * {@link @firebase/app#deleteApp | deleteApp()}
     */
    _delete(): Promise<void>;
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
type LogLevelString = 'debug' | 'verbose' | 'info' | 'warn' | 'error' | 'silent';

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

/**
 * @license
 * Copyright 2021 Google LLC
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
type FirebaseSignInProvider = 'custom' | 'email' | 'password' | 'phone' | 'anonymous' | 'google.com' | 'facebook.com' | 'github.com' | 'twitter.com' | 'microsoft.com' | 'apple.com';
interface FirebaseIdToken {
    iss: string;
    aud: string;
    sub: string;
    iat: number;
    exp: number;
    user_id: string;
    auth_time: number;
    provider_id?: 'anonymous';
    email?: string;
    email_verified?: boolean;
    phone_number?: string;
    name?: string;
    picture?: string;
    firebase: {
        sign_in_provider: FirebaseSignInProvider;
        identities?: {
            [provider in FirebaseSignInProvider]?: string[];
        };
    };
    [claim: string]: unknown;
    uid?: never;
}
type EmulatorMockTokenOptions = ({
    user_id: string;
} | {
    sub: string;
}) & Partial<FirebaseIdToken>;

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
 * Options that configure the SDK’s underlying network transport (WebChannel)
 * when long-polling is used.
 *
 * Note: This interface is "experimental" and is subject to change.
 *
 * See `FirestoreSettings.experimentalAutoDetectLongPolling`,
 * `FirestoreSettings.experimentalForceLongPolling`, and
 * `FirestoreSettings.experimentalLongPollingOptions`.
 */
interface ExperimentalLongPollingOptions {
    /**
     * The desired maximum timeout interval, in seconds, to complete a
     * long-polling GET response. Valid values are between 5 and 30, inclusive.
     * Floating point values are allowed and will be rounded to the nearest
     * millisecond.
     *
     * By default, when long-polling is used the "hanging GET" request sent by
     * the client times out after 30 seconds. To request a different timeout
     * from the server, set this setting with the desired timeout.
     *
     * Changing the default timeout may be useful, for example, if the buffering
     * proxy that necessitated enabling long-polling in the first place has a
     * shorter timeout for hanging GET requests, in which case setting the
     * long-polling timeout to a shorter value, such as 25 seconds, may fix
     * prematurely-closed hanging GET requests.
     * For example, see https://github.com/firebase/firebase-js-sdk/issues/6987.
     */
    timeoutSeconds?: number;
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
declare class DatabaseInfo {
    readonly databaseId: DatabaseId;
    readonly appId: string;
    readonly persistenceKey: string;
    readonly host: string;
    readonly ssl: boolean;
    readonly forceLongPolling: boolean;
    readonly autoDetectLongPolling: boolean;
    readonly longPollingOptions: ExperimentalLongPollingOptions;
    readonly useFetchStreams: boolean;
    readonly isUsingEmulator: boolean;
    readonly apiKey: string | undefined;
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
    constructor(databaseId: DatabaseId, appId: string, persistenceKey: string, host: string, ssl: boolean, forceLongPolling: boolean, autoDetectLongPolling: boolean, longPollingOptions: ExperimentalLongPollingOptions, useFetchStreams: boolean, isUsingEmulator: boolean, apiKey: string | undefined);
}
/**
 * Represents the database ID a Firestore client is associated with.
 * @internal
 */
declare class DatabaseId {
    readonly projectId: string;
    readonly database: string;
    constructor(projectId: string, database?: string);
    static empty(): DatabaseId;
    get isDefaultDatabase(): boolean;
    isEqual(other: {}): boolean;
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


type DocumentData$1 = { [field: string]: any };

type UpdateData$1 = { [fieldPath: string]: any };

interface Settings {
  host?: string;
  ssl?: boolean;
  cacheSizeBytes?: number;
  experimentalForceLongPolling?: boolean;
  experimentalAutoDetectLongPolling?: boolean;
  ignoreUndefinedProperties?: boolean;
  merge?: boolean;
}

interface PersistenceSettings$1 {
  synchronizeTabs?: boolean;
  experimentalTabSynchronization?: boolean;
  experimentalForceOwningTab?: boolean;
}

interface FirestoreDataConverter$2<T> {
  toFirestore(modelObject: T): DocumentData$1;
  toFirestore(modelObject: Partial<T>, options: SetOptions$1): DocumentData$1;

  fromFirestore(snapshot: QueryDocumentSnapshot$2, options: SnapshotOptions$1): T;
}

declare class FirebaseFirestore {
  private constructor();

  settings(settings: Settings): void;

  useEmulator(
    host: string,
    port: number,
    options?: {
      mockUserToken?: EmulatorMockTokenOptions | string;
    }
  ): void;

  enablePersistence(settings?: PersistenceSettings$1): Promise<void>;

  collection(collectionPath: string): CollectionReference$1<DocumentData$1>;

  doc(documentPath: string): DocumentReference$1<DocumentData$1>;

  collectionGroup(collectionId: string): Query$2<DocumentData$1>;

  runTransaction<T>(
    updateFunction: (transaction: Transaction$3) => Promise<T>
  ): Promise<T>;

  batch(): WriteBatch$1;

  app: any;

  clearPersistence(): Promise<void>;

  enableNetwork(): Promise<void>;

  disableNetwork(): Promise<void>;

  waitForPendingWrites(): Promise<void>;

  onSnapshotsInSync(observer: {
    next?: (value: void) => void;
    error?: (error: FirestoreError$1) => void;
    complete?: () => void;
  }): () => void;
  onSnapshotsInSync(onSync: () => void): () => void;

  terminate(): Promise<void>;

  loadBundle(
    bundleData: ArrayBuffer | ReadableStream<Uint8Array> | string
  ): LoadBundleTask$1;

  namedQuery(name: string): Promise<Query$2<DocumentData$1> | null>;

  INTERNAL: { delete: () => Promise<void> };
}

interface LoadBundleTask$1 extends PromiseLike<LoadBundleTaskProgress$1> {
  onProgress(
    next?: (progress: LoadBundleTaskProgress$1) => any,
    error?: (error: Error) => any,
    complete?: () => void
  ): void;

  then<T, R>(
    onFulfilled?: (a: LoadBundleTaskProgress$1) => T | PromiseLike<T>,
    onRejected?: (a: Error) => R | PromiseLike<R>
  ): Promise<T | R>;

  catch<R>(
    onRejected: (a: Error) => R | PromiseLike<R>
  ): Promise<R | LoadBundleTaskProgress$1>;
}

interface LoadBundleTaskProgress$1 {
  documentsLoaded: number;
  totalDocuments: number;
  bytesLoaded: number;
  totalBytes: number;
  taskState: TaskState$1;
}

type TaskState$1 = 'Error' | 'Running' | 'Success';

declare class Transaction$3 {
  private constructor();

  get<T>(documentRef: DocumentReference$1<T>): Promise<DocumentSnapshot$2<T>>;

  set<T>(
    documentRef: DocumentReference$1<T>,
    data: Partial<T>,
    options: SetOptions$1
  ): Transaction$3;
  set<T>(documentRef: DocumentReference$1<T>, data: T): Transaction$3;

  update(documentRef: DocumentReference$1<any>, data: UpdateData$1): Transaction$3;
  update(
    documentRef: DocumentReference$1<any>,
    field: string | FieldPath$2,
    value: any,
    ...moreFieldsAndValues: any[]
  ): Transaction$3;

  delete(documentRef: DocumentReference$1<any>): Transaction$3;
}

declare class WriteBatch$1 {
  private constructor();

  set<T>(
    documentRef: DocumentReference$1<T>,
    data: Partial<T>,
    options: SetOptions$1
  ): WriteBatch$1;
  set<T>(documentRef: DocumentReference$1<T>, data: T): WriteBatch$1;

  update(documentRef: DocumentReference$1<any>, data: UpdateData$1): WriteBatch$1;
  update(
    documentRef: DocumentReference$1<any>,
    field: string | FieldPath$2,
    value: any,
    ...moreFieldsAndValues: any[]
  ): WriteBatch$1;

  delete(documentRef: DocumentReference$1<any>): WriteBatch$1;

  commit(): Promise<void>;
}

interface SnapshotListenOptions$1 {
  readonly includeMetadataChanges?: boolean;
}

interface SetOptions$1 {
  readonly merge?: boolean;
  readonly mergeFields?: (string | FieldPath$2)[];
}

interface GetOptions {
  readonly source?: 'default' | 'server' | 'cache';
}

declare class DocumentReference$1<
  T = DocumentData$1,
  T2 extends DocumentData$1 = DocumentData$1
> {
  private constructor();

  readonly id: string;
  readonly firestore: FirebaseFirestore;
  readonly parent: CollectionReference$1<T>;
  readonly path: string;

  collection(collectionPath: string): CollectionReference$1<DocumentData$1>;

  isEqual(other: DocumentReference$1<T>): boolean;

  set(data: Partial<T>, options: SetOptions$1): Promise<void>;
  set(data: T): Promise<void>;

  update(data: UpdateData$1): Promise<void>;
  update(
    field: string | FieldPath$2,
    value: any,
    ...moreFieldsAndValues: any[]
  ): Promise<void>;

  delete(): Promise<void>;

  get(options?: GetOptions): Promise<DocumentSnapshot$2<T>>;

  onSnapshot(observer: {
    next?: (snapshot: DocumentSnapshot$2<T>) => void;
    error?: (error: FirestoreError$1) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: SnapshotListenOptions$1,
    observer: {
      next?: (snapshot: DocumentSnapshot$2<T>) => void;
      error?: (error: FirestoreError$1) => void;
      complete?: () => void;
    }
  ): () => void;
  onSnapshot(
    onNext: (snapshot: DocumentSnapshot$2<T>) => void,
    onError?: (error: FirestoreError$1) => void,
    onCompletion?: () => void
  ): () => void;
  onSnapshot(
    options: SnapshotListenOptions$1,
    onNext: (snapshot: DocumentSnapshot$2<T>) => void,
    onError?: (error: FirestoreError$1) => void,
    onCompletion?: () => void
  ): () => void;

  withConverter(converter: null): DocumentReference$1<DocumentData$1>;
  withConverter<U>(converter: FirestoreDataConverter$2<U>): DocumentReference$1<U>;
}

interface SnapshotOptions$1 {
  readonly serverTimestamps?: 'estimate' | 'previous' | 'none';
}

interface SnapshotMetadata$1 {
  readonly hasPendingWrites: boolean;
  readonly fromCache: boolean;

  isEqual(other: SnapshotMetadata$1): boolean;
}

declare class DocumentSnapshot$2<
  T = DocumentData$1,
  T2 extends DocumentData$1 = DocumentData$1
> {
  protected constructor();

  readonly exists: boolean;
  readonly ref: DocumentReference$1<T>;
  readonly id: string;
  readonly metadata: SnapshotMetadata$1;

  data(options?: SnapshotOptions$1): T | undefined;

  get(fieldPath: string | FieldPath$2, options?: SnapshotOptions$1): any;

  isEqual(other: DocumentSnapshot$2<T>): boolean;
}

declare class QueryDocumentSnapshot$2<
  T = DocumentData$1,
  T2 extends DocumentData$1 = DocumentData$1
> extends DocumentSnapshot$2<T, T2> {
  private constructor();

  data(options?: SnapshotOptions$1): T;
}

type OrderByDirection$1 = 'desc' | 'asc';

type WhereFilterOp$1 =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in';

declare class Query$2<T = DocumentData$1, T2 extends DocumentData$1 = DocumentData$1> {
  protected constructor();

  readonly firestore: FirebaseFirestore;

  where(
    fieldPath: string | FieldPath$2,
    opStr: WhereFilterOp$1,
    value: any
  ): Query$2<T>;

  orderBy(
    fieldPath: string | FieldPath$2,
    directionStr?: OrderByDirection$1
  ): Query$2<T>;

  limit(limit: number): Query$2<T>;

  limitToLast(limit: number): Query$2<T>;

  startAt(snapshot: DocumentSnapshot$2<any>): Query$2<T>;
  startAt(...fieldValues: any[]): Query$2<T>;

  startAfter(snapshot: DocumentSnapshot$2<any>): Query$2<T>;
  startAfter(...fieldValues: any[]): Query$2<T>;

  endBefore(snapshot: DocumentSnapshot$2<any>): Query$2<T>;
  endBefore(...fieldValues: any[]): Query$2<T>;

  endAt(snapshot: DocumentSnapshot$2<any>): Query$2<T>;
  endAt(...fieldValues: any[]): Query$2<T>;

  isEqual(other: Query$2<T>): boolean;

  get(options?: GetOptions): Promise<QuerySnapshot$1<T>>;

  onSnapshot(observer: {
    next?: (snapshot: QuerySnapshot$1<T>) => void;
    error?: (error: FirestoreError$1) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: SnapshotListenOptions$1,
    observer: {
      next?: (snapshot: QuerySnapshot$1<T>) => void;
      error?: (error: FirestoreError$1) => void;
      complete?: () => void;
    }
  ): () => void;
  onSnapshot(
    onNext: (snapshot: QuerySnapshot$1<T>) => void,
    onError?: (error: FirestoreError$1) => void,
    onCompletion?: () => void
  ): () => void;
  onSnapshot(
    options: SnapshotListenOptions$1,
    onNext: (snapshot: QuerySnapshot$1<T>) => void,
    onError?: (error: FirestoreError$1) => void,
    onCompletion?: () => void
  ): () => void;

  withConverter(converter: null): Query$2<DocumentData$1>;
  withConverter<U>(converter: FirestoreDataConverter$2<U>): Query$2<U>;
}

declare class QuerySnapshot$1<
  T = DocumentData$1,
  T2 extends DocumentData$1 = DocumentData$1
> {
  private constructor();

  readonly query: Query$2<T>;
  readonly metadata: SnapshotMetadata$1;
  readonly docs: Array<QueryDocumentSnapshot$2<T>>;
  readonly size: number;
  readonly empty: boolean;

  docChanges(options?: SnapshotListenOptions$1): Array<DocumentChange$1<T>>;

  forEach(
    callback: (result: QueryDocumentSnapshot$2<T>) => void,
    thisArg?: any
  ): void;

  isEqual(other: QuerySnapshot$1<T>): boolean;
}

type DocumentChangeType$1 = 'added' | 'removed' | 'modified';

interface DocumentChange$1<
  T = DocumentData$1,
  T2 extends DocumentData$1 = DocumentData$1
> {
  readonly type: DocumentChangeType$1;
  readonly doc: QueryDocumentSnapshot$2<T>;
  readonly oldIndex: number;
  readonly newIndex: number;
}

declare class CollectionReference$1<
  T = DocumentData$1,
  T2 extends DocumentData$1 = DocumentData$1
> extends Query$2<T, T2> {
  private constructor();

  readonly id: string;
  readonly parent: DocumentReference$1<DocumentData$1> | null;
  readonly path: string;

  doc(documentPath?: string): DocumentReference$1<T>;

  add(data: T): Promise<DocumentReference$1<T>>;

  isEqual(other: CollectionReference$1<T>): boolean;

  withConverter(converter: null): CollectionReference$1<DocumentData$1>;
  withConverter<U>(
    converter: FirestoreDataConverter$2<U>
  ): CollectionReference$1<U>;
}

declare class FieldPath$2 {
  constructor(...fieldNames: string[]);

  static documentId(): FieldPath$2;

  isEqual(other: FieldPath$2): boolean;
}

type FirestoreErrorCode$1 =
  | 'cancelled'
  | 'unknown'
  | 'invalid-argument'
  | 'deadline-exceeded'
  | 'not-found'
  | 'already-exists'
  | 'permission-denied'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'unavailable'
  | 'data-loss'
  | 'unauthenticated';

interface FirestoreError$1 {
  code: FirestoreErrorCode$1;
  message: string;
  name: string;
  stack?: string;
}

declare module '@firebase/component' {
  interface NameServiceMapping {
    'firestore-compat': FirebaseFirestore;
  }
}

/**
 * Path represents an ordered sequence of string segments.
 */
declare abstract class BasePath<B extends BasePath<B>> {
    private segments;
    private offset;
    private len;
    constructor(segments: string[], offset?: number, length?: number);
    /**
     * Abstract constructor method to construct an instance of B with the given
     * parameters.
     */
    protected abstract construct(segments: string[], offset?: number, length?: number): B;
    /**
     * Returns a String representation.
     *
     * Implementing classes are required to provide deterministic implementations as
     * the String representation is used to obtain canonical Query IDs.
     */
    abstract toString(): string;
    get length(): number;
    isEqual(other: B): boolean;
    child(nameOrPath: string | B): B;
    /** The index of one past the last segment of the path. */
    private limit;
    popFirst(size?: number): B;
    popLast(): B;
    firstSegment(): string;
    lastSegment(): string;
    get(index: number): string;
    isEmpty(): boolean;
    isPrefixOf(other: this): boolean;
    isImmediateParentOf(potentialChild: this): boolean;
    forEach(fn: (segment: string) => void): void;
    toArray(): string[];
    /**
     * Compare 2 paths segment by segment, prioritizing numeric IDs
     * (e.g., "__id123__") in numeric ascending order, followed by string
     * segments in lexicographical order.
     */
    static comparator<T extends BasePath<T>>(p1: BasePath<T>, p2: BasePath<T>): number;
    private static compareSegments;
    private static isNumericId;
    private static extractNumericId;
}
/**
 * A slash-separated path for navigating resources (documents and collections)
 * within Firestore.
 *
 * @internal
 */
declare class ResourcePath extends BasePath<ResourcePath> {
    protected construct(segments: string[], offset?: number, length?: number): ResourcePath;
    canonicalString(): string;
    toString(): string;
    /**
     * Returns a string representation of this path
     * where each path segment has been encoded with
     * `encodeURIComponent`.
     */
    toUriEncodedString(): string;
    /**
     * Creates a resource path from the given slash-delimited string. If multiple
     * arguments are provided, all components are combined. Leading and trailing
     * slashes from all components are ignored.
     */
    static fromString(...pathComponents: string[]): ResourcePath;
    static emptyPath(): ResourcePath;
}
/**
 * A dot-separated path for navigating sub-objects within a document.
 * @internal
 */
declare class FieldPath$1 extends BasePath<FieldPath$1> {
    protected construct(segments: string[], offset?: number, length?: number): FieldPath$1;
    /**
     * Returns true if the string could be used as a segment in a field path
     * without escaping.
     */
    private static isValidIdentifier;
    canonicalString(): string;
    toString(): string;
    /**
     * Returns true if this field references the key of a document.
     */
    isKeyField(): boolean;
    /**
     * The field designating the key of a document.
     */
    static keyField(): FieldPath$1;
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
    static fromServerFormat(path: string): FieldPath$1;
    static emptyPath(): FieldPath$1;
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
declare class DocumentKey {
    readonly path: ResourcePath;
    constructor(path: ResourcePath);
    static fromPath(path: string): DocumentKey;
    static fromName(name: string): DocumentKey;
    static empty(): DocumentKey;
    get collectionGroup(): string;
    /** Returns true if the document is in the specified collectionId. */
    hasCollectionId(collectionId: string): boolean;
    /** Returns the collection group (i.e. the name of the parent collection) for this key. */
    getCollectionGroup(): string;
    /** Returns the fully qualified path to the parent collection. */
    getCollectionPath(): ResourcePath;
    isEqual(other: DocumentKey | null): boolean;
    toString(): string;
    static comparator(k1: DocumentKey, k2: DocumentKey): number;
    static isDocumentKey(path: ResourcePath): boolean;
    /**
     * Creates and returns a new document key with the given segments.
     *
     * @param segments - The segments of the path to the document
     * @returns A new instance of DocumentKey
     */
    static fromSegments(segments: string[]): DocumentKey;
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
declare class FieldMask {
    readonly fields: FieldPath$1[];
    constructor(fields: FieldPath$1[]);
    static empty(): FieldMask;
    /**
     * Returns a new FieldMask object that is the result of adding all the given
     * fields paths to this field mask.
     */
    unionWith(extraFields: FieldPath$1[]): FieldMask;
    /**
     * Verifies that `fieldPath` is included by at least one field in this field
     * mask.
     *
     * This is an O(n) operation, where `n` is the size of the field mask.
     */
    covers(fieldPath: FieldPath$1): boolean;
    isEqual(other: FieldMask): boolean;
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
 * A list of data types Firestore objects may serialize in their toJSON implemenetations.
 * @private
 * @internal
 */
type JsonTypeDesc = 'object' | 'string' | 'number' | 'boolean' | 'null' | 'undefined';
/**
 * An association of JsonTypeDesc values to their native types.
 * @private
 * @internal
 */
type TSType<T extends JsonTypeDesc> = T extends 'object' ? object : T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : T extends 'null' ? null : T extends 'undefined' ? undefined : never;
/**
 * The representation of a JSON object property name and its type value.
 * @private
 * @internal
 */
interface Property<T extends JsonTypeDesc> {
    value?: TSType<T>;
    typeString: JsonTypeDesc;
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
declare class Timestamp$1 {
    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    readonly seconds: number;
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    readonly nanoseconds: number;
    /**
     * Creates a new timestamp with the current date, with millisecond precision.
     *
     * @returns a new timestamp representing the current date.
     */
    static now(): Timestamp$1;
    /**
     * Creates a new timestamp from the given date.
     *
     * @param date - The date to initialize the `Timestamp` from.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     date.
     */
    static fromDate(date: Date): Timestamp$1;
    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds - Number of milliseconds since Unix epoch
     *     1970-01-01T00:00:00Z.
     * @returns A new `Timestamp` representing the same point in time as the given
     *     number of milliseconds.
     */
    static fromMillis(milliseconds: number): Timestamp$1;
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
    seconds: number, 
    /**
     * The fractions of a second at nanosecond resolution.*
     */
    nanoseconds: number);
    /**
     * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
     * causes a loss of precision since `Date` objects only support millisecond
     * precision.
     *
     * @returns JavaScript `Date` object representing the same point in time as
     *     this `Timestamp`, with millisecond precision.
     */
    toDate(): Date;
    /**
     * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
     * epoch). This operation causes a loss of precision.
     *
     * @returns The point in time corresponding to this timestamp, represented as
     *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */
    toMillis(): number;
    _compareTo(other: Timestamp$1): number;
    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other - The `Timestamp` to compare against.
     * @returns true if this `Timestamp` is equal to the provided one.
     */
    isEqual(other: Timestamp$1): boolean;
    /** Returns a textual representation of this `Timestamp`. */
    toString(): string;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        seconds: Property<"number">;
        nanoseconds: Property<"number">;
    };
    /**
     * Returns a JSON-serializable representation of this `Timestamp`.
     */
    toJSON(): {
        seconds: number;
        nanoseconds: number;
        type: string;
    };
    /**
     * Builds a `Timestamp` instance from a JSON object created by {@link Timestamp.toJSON}.
     */
    static fromJSON(json: object): Timestamp$1;
    /**
     * Converts this object to a primitive string, which allows `Timestamp` objects
     * to be compared using the `>`, `<=`, `>=` and `>` operators.
     */
    valueOf(): string;
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
declare class SnapshotVersion {
    private timestamp;
    static fromTimestamp(value: Timestamp$1): SnapshotVersion;
    static min(): SnapshotVersion;
    static max(): SnapshotVersion;
    private constructor();
    compareTo(other: SnapshotVersion): number;
    isEqual(other: SnapshotVersion): boolean;
    /** Returns a number representation of the version for use in spec tests. */
    toMicroseconds(): number;
    toString(): string;
    toTimestamp(): Timestamp$1;
}

interface ApiClientObjectMap<T> {
    [k: string]: T;
}
declare type Timestamp = string | {
    seconds?: string | number;
    nanos?: number;
};
declare type CompositeFilterOp = 'OPERATOR_UNSPECIFIED' | 'AND' | 'OR';
declare type FieldFilterOp = 'OPERATOR_UNSPECIFIED' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL' | 'EQUAL' | 'NOT_EQUAL' | 'ARRAY_CONTAINS' | 'IN' | 'ARRAY_CONTAINS_ANY' | 'NOT_IN';
declare type FieldTransformSetToServerValue = 'SERVER_VALUE_UNSPECIFIED' | 'REQUEST_TIME';
declare type IndexFieldMode = 'MODE_UNSPECIFIED' | 'ASCENDING' | 'DESCENDING';
declare type IndexState$1 = 'STATE_UNSPECIFIED' | 'CREATING' | 'READY' | 'ERROR';
declare type OrderDirection = 'DIRECTION_UNSPECIFIED' | 'ASCENDING' | 'DESCENDING';
declare type TargetChangeTargetChangeType = 'NO_CHANGE' | 'ADD' | 'REMOVE' | 'CURRENT' | 'RESET';
declare type UnaryFilterOp = 'OPERATOR_UNSPECIFIED' | 'IS_NAN' | 'IS_NULL' | 'IS_NOT_NAN' | 'IS_NOT_NULL';
declare type ValueNullValue = 'NULL_VALUE';
declare namespace firestoreV1ApiClientInterfaces {
    interface Aggregation {
        count?: Count;
        sum?: Sum;
        avg?: Avg;
        alias?: string;
    }
    interface AggregationResult {
        aggregateFields?: ApiClientObjectMap<Value>;
    }
    interface ArrayValue {
        values?: Value[];
    }
    interface Avg {
        field?: FieldReference;
    }
    interface BatchGetDocumentsRequest {
        database?: string;
        documents?: string[];
        mask?: DocumentMask;
        transaction?: string;
        newTransaction?: TransactionOptions;
        readTime?: string;
    }
    interface BatchGetDocumentsResponse {
        found?: Document;
        missing?: string;
        transaction?: string;
        readTime?: string;
    }
    interface BeginTransactionRequest {
        options?: TransactionOptions;
    }
    interface BeginTransactionResponse {
        transaction?: string;
    }
    interface BitSequence {
        bitmap?: string | Uint8Array;
        padding?: number;
    }
    interface BloomFilter {
        bits?: BitSequence;
        hashCount?: number;
    }
    interface CollectionSelector {
        collectionId?: string;
        allDescendants?: boolean;
    }
    interface CommitRequest {
        database?: string;
        writes?: Write[];
        transaction?: string;
    }
    interface CommitResponse {
        writeResults?: WriteResult[];
        commitTime?: string;
    }
    interface CompositeFilter {
        op?: CompositeFilterOp;
        filters?: Filter[];
    }
    interface Count {
        upTo?: number;
    }
    interface Cursor {
        values?: Value[];
        before?: boolean;
    }
    interface Document {
        name?: string;
        fields?: ApiClientObjectMap<Value>;
        createTime?: Timestamp;
        updateTime?: Timestamp;
    }
    interface DocumentChange {
        document?: Document;
        targetIds?: number[];
        removedTargetIds?: number[];
    }
    interface DocumentDelete {
        document?: string;
        removedTargetIds?: number[];
        readTime?: Timestamp;
    }
    interface DocumentMask {
        fieldPaths?: string[];
    }
    interface DocumentRemove {
        document?: string;
        removedTargetIds?: number[];
        readTime?: string;
    }
    interface DocumentTransform {
        document?: string;
        fieldTransforms?: FieldTransform[];
    }
    interface DocumentsTarget {
        documents?: string[];
    }
    interface Empty {
    }
    interface ExecutePipelineRequest {
        database?: string;
        structuredPipeline?: StructuredPipeline;
        transaction?: string;
        newTransaction?: TransactionOptions;
        readTime?: string;
    }
    interface ExecutePipelineResponse {
        transaction?: string;
        results?: Document[];
        executionTime?: string;
    }
    interface ExistenceFilter {
        targetId?: number;
        count?: number;
        unchangedNames?: BloomFilter;
    }
    interface FieldFilter {
        field?: FieldReference;
        op?: FieldFilterOp;
        value?: Value;
    }
    interface FieldReference {
        fieldPath?: string;
    }
    interface FieldTransform {
        fieldPath?: string;
        setToServerValue?: FieldTransformSetToServerValue;
        appendMissingElements?: ArrayValue;
        removeAllFromArray?: ArrayValue;
        increment?: Value;
    }
    interface Filter {
        compositeFilter?: CompositeFilter;
        fieldFilter?: FieldFilter;
        unaryFilter?: UnaryFilter;
    }
    interface Function {
        name?: string;
        args?: Value[];
        options?: ApiClientObjectMap<Value>;
    }
    interface Index {
        name?: string;
        collectionId?: string;
        fields?: IndexField[];
        state?: IndexState$1;
    }
    interface IndexField {
        fieldPath?: string;
        mode?: IndexFieldMode;
    }
    interface LatLng {
        latitude?: number;
        longitude?: number;
    }
    interface ListCollectionIdsRequest {
        pageSize?: number;
        pageToken?: string;
    }
    interface ListCollectionIdsResponse {
        collectionIds?: string[];
        nextPageToken?: string;
    }
    interface ListDocumentsResponse {
        documents?: Document[];
        nextPageToken?: string;
    }
    interface ListIndexesResponse {
        indexes?: Index[];
        nextPageToken?: string;
    }
    interface ListenRequest {
        addTarget?: Target;
        removeTarget?: number;
        labels?: ApiClientObjectMap<string>;
    }
    interface ListenResponse {
        targetChange?: TargetChange;
        documentChange?: DocumentChange;
        documentDelete?: DocumentDelete;
        documentRemove?: DocumentRemove;
        filter?: ExistenceFilter;
    }
    interface MapValue {
        fields?: ApiClientObjectMap<Value>;
    }
    interface Operation {
        name?: string;
        metadata?: ApiClientObjectMap<any>;
        done?: boolean;
        error?: Status;
        response?: ApiClientObjectMap<any>;
    }
    interface Order {
        field?: FieldReference;
        direction?: OrderDirection;
    }
    interface Pipeline {
        stages?: Stage[];
    }
    interface Precondition {
        exists?: boolean;
        updateTime?: Timestamp;
    }
    interface Projection {
        fields?: FieldReference[];
    }
    interface QueryTarget {
        parent?: string;
        structuredQuery?: StructuredQuery;
    }
    interface ReadOnly {
        readTime?: string;
    }
    interface ReadWrite {
        retryTransaction?: string;
    }
    interface RollbackRequest {
        transaction?: string;
    }
    interface RunQueryRequest {
        parent?: string;
        structuredQuery?: StructuredQuery;
        transaction?: string;
        newTransaction?: TransactionOptions;
        readTime?: string;
    }
    interface RunQueryResponse {
        transaction?: string;
        document?: Document;
        readTime?: string;
        skippedResults?: number;
    }
    interface RunAggregationQueryRequest {
        parent?: string;
        structuredAggregationQuery?: StructuredAggregationQuery;
        transaction?: string;
        newTransaction?: TransactionOptions;
        readTime?: string;
    }
    interface RunAggregationQueryResponse {
        result?: AggregationResult;
        transaction?: string;
        readTime?: string;
    }
    interface StructuredAggregationQuery {
        structuredQuery?: StructuredQuery;
        aggregations?: Aggregation[];
    }
    interface Stage {
        name?: string;
        args?: Value[];
        options?: ApiClientObjectMap<Value>;
    }
    interface Status {
        code?: number;
        message?: string;
        details?: Array<ApiClientObjectMap<any>>;
    }
    interface StructuredPipeline {
        pipeline?: Pipeline;
        options?: ApiClientObjectMap<Value>;
    }
    interface StructuredQuery {
        select?: Projection;
        from?: CollectionSelector[];
        where?: Filter;
        orderBy?: Order[];
        startAt?: Cursor;
        endAt?: Cursor;
        offset?: number;
        limit?: number | {
            value: number;
        };
    }
    interface Sum {
        field?: FieldReference;
    }
    interface Target {
        query?: QueryTarget;
        documents?: DocumentsTarget;
        resumeToken?: string | Uint8Array;
        readTime?: Timestamp;
        targetId?: number;
        once?: boolean;
        expectedCount?: number | {
            value: number;
        };
    }
    interface TargetChange {
        targetChangeType?: TargetChangeTargetChangeType;
        targetIds?: number[];
        cause?: Status;
        resumeToken?: string | Uint8Array;
        readTime?: Timestamp;
    }
    interface TransactionOptions {
        readOnly?: ReadOnly;
        readWrite?: ReadWrite;
    }
    interface UnaryFilter {
        op?: UnaryFilterOp;
        field?: FieldReference;
    }
    interface Value {
        nullValue?: ValueNullValue;
        booleanValue?: boolean;
        integerValue?: string | number;
        doubleValue?: string | number;
        timestampValue?: Timestamp;
        stringValue?: string;
        bytesValue?: string | Uint8Array;
        referenceValue?: string;
        geoPointValue?: LatLng;
        arrayValue?: ArrayValue;
        mapValue?: MapValue;
        fieldReferenceValue?: string;
        functionValue?: Function;
        pipelineValue?: Pipeline;
    }
    interface Write {
        update?: Document;
        delete?: string;
        verify?: string;
        transform?: DocumentTransform;
        updateMask?: DocumentMask;
        updateTransforms?: FieldTransform[];
        currentDocument?: Precondition;
    }
    interface WriteRequest {
        streamId?: string;
        writes?: Write[];
        streamToken?: string | Uint8Array;
        labels?: ApiClientObjectMap<string>;
    }
    interface WriteResponse {
        streamId?: string;
        streamToken?: string | Uint8Array;
        writeResults?: WriteResult[];
        commitTime?: Timestamp;
    }
    interface WriteResult {
        updateTime?: Timestamp;
        transformResults?: Value[];
    }
}
declare type MapValue = firestoreV1ApiClientInterfaces.MapValue;
declare type Pipeline$2 = firestoreV1ApiClientInterfaces.Pipeline;
declare type Stage$1 = firestoreV1ApiClientInterfaces.Stage;
declare type StructuredQuery = firestoreV1ApiClientInterfaces.StructuredQuery;
declare type Value = firestoreV1ApiClientInterfaces.Value;

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
declare class ObjectValue {
    readonly value: {
        mapValue: MapValue;
    };
    constructor(value: {
        mapValue: MapValue;
    });
    static empty(): ObjectValue;
    /**
     * Returns the value at the given path or null.
     *
     * @param path - the path to search
     * @returns The value at the path or null if the path is not set.
     */
    field(path: FieldPath$1): Value | null;
    /**
     * Sets the field to the provided value.
     *
     * @param path - The field path to set.
     * @param value - The value to set.
     */
    set(path: FieldPath$1, value: Value): void;
    /**
     * Sets the provided fields to the provided values.
     *
     * @param data - A map of fields to values (or null for deletes).
     */
    setAll(data: Map<FieldPath$1, Value | null>): void;
    /**
     * Removes the field at the specified path. If there is no field at the
     * specified path, nothing is changed.
     *
     * @param path - The field path to remove.
     */
    delete(path: FieldPath$1): void;
    isEqual(other: ObjectValue): boolean;
    /**
     * Returns the map that contains the leaf element of `path`. If the parent
     * entry does not yet exist, or if it is not a map, a new map will be created.
     */
    private getFieldsMap;
    /**
     * Modifies `fieldsMap` by adding, replacing or deleting the specified
     * entries.
     */
    private applyChanges;
    clone(): ObjectValue;
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
 * Represents a document in Firestore with a key, version, data and whether the
 * data has local mutations applied to it.
 */
interface Document {
    /** The key for this document */
    readonly key: DocumentKey;
    /**
     * The version of this document if it exists or a version at which this
     * document was guaranteed to not exist.
     */
    readonly version: SnapshotVersion;
    /**
     * The timestamp at which this document was read from the remote server. Uses
     * `SnapshotVersion.min()` for documents created by the user.
     */
    readonly readTime: SnapshotVersion;
    /**
     * The timestamp at which the document was created. This value increases
     * monotonically when a document is deleted then recreated. It can also be
     * compared to `createTime` of other documents and the `readTime` of a query.
     */
    readonly createTime: SnapshotVersion;
    /** The underlying data of this document or an empty value if no data exists. */
    readonly data: ObjectValue;
    /** Returns whether local mutations were applied via the mutation queue. */
    readonly hasLocalMutations: boolean;
    /** Returns whether mutations were applied based on a write acknowledgment. */
    readonly hasCommittedMutations: boolean;
    /**
     * Whether this document had a local mutation applied that has not yet been
     * acknowledged by Watch.
     */
    readonly hasPendingWrites: boolean;
    /**
     * Returns whether this document is valid (i.e. it is an entry in the
     * RemoteDocumentCache, was created by a mutation or read from the backend).
     */
    isValidDocument(): boolean;
    /**
     * Returns whether the document exists and its data is known at the current
     * version.
     */
    isFoundDocument(): boolean;
    /**
     * Returns whether the document is known to not exist at the current version.
     */
    isNoDocument(): boolean;
    /**
     * Returns whether the document exists and its data is unknown at the current
     * version.
     */
    isUnknownDocument(): boolean;
    isEqual(other: Document | null | undefined): boolean;
    /** Creates a mutable copy of this document. */
    mutableCopy(): MutableDocument;
    toString(): string;
}
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
declare class MutableDocument implements Document {
    readonly key: DocumentKey;
    private documentType;
    version: SnapshotVersion;
    readTime: SnapshotVersion;
    createTime: SnapshotVersion;
    data: ObjectValue;
    private documentState;
    private constructor();
    /**
     * Creates a document with no known version or data, but which can serve as
     * base document for mutations.
     */
    static newInvalidDocument(documentKey: DocumentKey): MutableDocument;
    /**
     * Creates a new document that is known to exist with the given data at the
     * given version.
     */
    static newFoundDocument(documentKey: DocumentKey, version: SnapshotVersion, createTime: SnapshotVersion, value: ObjectValue): MutableDocument;
    /** Creates a new document that is known to not exist at the given version. */
    static newNoDocument(documentKey: DocumentKey, version: SnapshotVersion): MutableDocument;
    /**
     * Creates a new document that is known to exist at the given version but
     * whose data is not known (e.g. a document that was updated without a known
     * base document).
     */
    static newUnknownDocument(documentKey: DocumentKey, version: SnapshotVersion): MutableDocument;
    /**
     * Changes the document type to indicate that it exists and that its version
     * and data are known.
     */
    convertToFoundDocument(version: SnapshotVersion, value: ObjectValue): MutableDocument;
    /**
     * Changes the document type to indicate that it doesn't exist at the given
     * version.
     */
    convertToNoDocument(version: SnapshotVersion): MutableDocument;
    /**
     * Changes the document type to indicate that it exists at a given version but
     * that its data is not known (e.g. a document that was updated without a known
     * base document).
     */
    convertToUnknownDocument(version: SnapshotVersion): MutableDocument;
    setHasCommittedMutations(): MutableDocument;
    setHasLocalMutations(): MutableDocument;
    setReadTime(readTime: SnapshotVersion): MutableDocument;
    get hasLocalMutations(): boolean;
    get hasCommittedMutations(): boolean;
    get hasPendingWrites(): boolean;
    isValidDocument(): boolean;
    isFoundDocument(): boolean;
    isNoDocument(): boolean;
    isUnknownDocument(): boolean;
    isEqual(other: Document | null | undefined): boolean;
    mutableCopy(): MutableDocument;
    toString(): string;
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

/** Base interface for the Serializer implementation. */
interface Serializer {
    readonly useProto3Json: boolean;
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
declare class TransformOperation {
    private _;
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
declare class FieldTransform {
    readonly field: FieldPath$1;
    readonly transform: TransformOperation;
    constructor(field: FieldPath$1, transform: TransformOperation);
}
/** The result of successfully applying a mutation to the backend. */
declare class MutationResult {
    /**
     * The version at which the mutation was committed:
     *
     * - For most operations, this is the updateTime in the WriteResult.
     * - For deletes, the commitTime of the WriteResponse (because deletes are
     *   not stored and have no updateTime).
     *
     * Note that these versions can be different: No-op writes will not change
     * the updateTime even though the commitTime advances.
     */
    readonly version: SnapshotVersion;
    /**
     * The resulting fields returned from the backend after a mutation
     * containing field transforms has been committed. Contains one FieldValue
     * for each FieldTransform that was in the mutation.
     *
     * Will be empty if the mutation did not contain any field transforms.
     */
    readonly transformResults: Array<Value | null>;
    constructor(
    /**
     * The version at which the mutation was committed:
     *
     * - For most operations, this is the updateTime in the WriteResult.
     * - For deletes, the commitTime of the WriteResponse (because deletes are
     *   not stored and have no updateTime).
     *
     * Note that these versions can be different: No-op writes will not change
     * the updateTime even though the commitTime advances.
     */
    version: SnapshotVersion, 
    /**
     * The resulting fields returned from the backend after a mutation
     * containing field transforms has been committed. Contains one FieldValue
     * for each FieldTransform that was in the mutation.
     *
     * Will be empty if the mutation did not contain any field transforms.
     */
    transformResults: Array<Value | null>);
}
declare const enum MutationType {
    Set = 0,
    Patch = 1,
    Delete = 2,
    Verify = 3
}
/**
 * Encodes a precondition for a mutation. This follows the model that the
 * backend accepts with the special case of an explicit "empty" precondition
 * (meaning no precondition).
 */
declare class Precondition {
    readonly updateTime?: SnapshotVersion | undefined;
    readonly exists?: boolean | undefined;
    private constructor();
    /** Creates a new empty Precondition. */
    static none(): Precondition;
    /** Creates a new Precondition with an exists flag. */
    static exists(exists: boolean): Precondition;
    /** Creates a new Precondition based on a version a document exists at. */
    static updateTime(version: SnapshotVersion): Precondition;
    /** Returns whether this Precondition is empty. */
    get isNone(): boolean;
    isEqual(other: Precondition): boolean;
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
declare abstract class Mutation {
    abstract readonly type: MutationType;
    abstract readonly key: DocumentKey;
    abstract readonly precondition: Precondition;
    abstract readonly fieldTransforms: FieldTransform[];
    /**
     * Returns a `FieldMask` representing the fields that will be changed by
     * applying this mutation. Returns `null` if the mutation will overwrite the
     * entire document.
     */
    abstract getFieldMask(): FieldMask | null;
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
 * Union type representing the aggregate type to be performed.
 */
type AggregateType = 'count' | 'avg' | 'sum';

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

declare const enum Operator {
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
    EQUAL = "==",
    NOT_EQUAL = "!=",
    GREATER_THAN = ">",
    GREATER_THAN_OR_EQUAL = ">=",
    ARRAY_CONTAINS = "array-contains",
    IN = "in",
    NOT_IN = "not-in",
    ARRAY_CONTAINS_ANY = "array-contains-any"
}
declare const enum CompositeOperator {
    OR = "or",
    AND = "and"
}
declare abstract class Filter {
    abstract matches(doc: Document): boolean;
    abstract getFlattenedFilters(): readonly FieldFilter[];
    abstract getFilters(): Filter[];
}
declare class FieldFilter extends Filter {
    readonly field: FieldPath$1;
    readonly op: Operator;
    readonly value: Value;
    protected constructor(field: FieldPath$1, op: Operator, value: Value);
    /**
     * Creates a filter based on the provided arguments.
     */
    static create(field: FieldPath$1, op: Operator, value: Value): FieldFilter;
    private static createKeyFieldInFilter;
    matches(doc: Document): boolean;
    protected matchesComparison(comparison: number): boolean;
    isInequality(): boolean;
    getFlattenedFilters(): readonly FieldFilter[];
    getFilters(): Filter[];
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
 * The direction of sorting in an order by.
 */
declare const enum Direction {
    ASCENDING = "asc",
    DESCENDING = "desc"
}
/**
 * An ordering on a field, in some Direction. Direction defaults to ASCENDING.
 */
declare class OrderBy {
    readonly field: FieldPath$1;
    readonly dir: Direction;
    constructor(field: FieldPath$1, dir?: Direction);
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
type Comparator<K> = (key1: K, key2: K) => number;
interface Entry<K, V> {
    key: K;
    value: V;
}
declare class SortedMap<K, V> {
    comparator: Comparator<K>;
    root: LLRBNode<K, V> | LLRBEmptyNode<K, V>;
    constructor(comparator: Comparator<K>, root?: LLRBNode<K, V> | LLRBEmptyNode<K, V>);
    insert(key: K, value: V): SortedMap<K, V>;
    remove(key: K): SortedMap<K, V>;
    get(key: K): V | null;
    indexOf(key: K): number;
    isEmpty(): boolean;
    get size(): number;
    minKey(): K | null;
    maxKey(): K | null;
    inorderTraversal<T>(action: (k: K, v: V) => T): T;
    forEach(fn: (k: K, v: V) => void): void;
    toString(): string;
    reverseTraversal<T>(action: (k: K, v: V) => T): T;
    getIterator(): SortedMapIterator<K, V>;
    getIteratorFrom(key: K): SortedMapIterator<K, V>;
    getReverseIterator(): SortedMapIterator<K, V>;
    getReverseIteratorFrom(key: K): SortedMapIterator<K, V>;
}
declare class SortedMapIterator<K, V> {
    private isReverse;
    private nodeStack;
    constructor(node: LLRBNode<K, V> | LLRBEmptyNode<K, V>, startKey: K | null, comparator: Comparator<K>, isReverse: boolean);
    getNext(): Entry<K, V>;
    hasNext(): boolean;
    peek(): Entry<K, V> | null;
}
declare class LLRBNode<K, V> {
    key: K;
    value: V;
    readonly color: boolean;
    readonly left: LLRBNode<K, V> | LLRBEmptyNode<K, V>;
    readonly right: LLRBNode<K, V> | LLRBEmptyNode<K, V>;
    readonly size: number;
    static EMPTY: LLRBEmptyNode<any, any>;
    static RED: boolean;
    static BLACK: boolean;
    constructor(key: K, value: V, color?: boolean, left?: LLRBNode<K, V> | LLRBEmptyNode<K, V>, right?: LLRBNode<K, V> | LLRBEmptyNode<K, V>);
    copy(key: K | null, value: V | null, color: boolean | null, left: LLRBNode<K, V> | LLRBEmptyNode<K, V> | null, right: LLRBNode<K, V> | LLRBEmptyNode<K, V> | null): LLRBNode<K, V>;
    isEmpty(): boolean;
    inorderTraversal<T>(action: (k: K, v: V) => T): T;
    reverseTraversal<T>(action: (k: K, v: V) => T): T;
    private min;
    minKey(): K | null;
    maxKey(): K | null;
    insert(key: K, value: V, comparator: Comparator<K>): LLRBNode<K, V>;
    private removeMin;
    remove(key: K, comparator: Comparator<K>): LLRBNode<K, V> | LLRBEmptyNode<K, V>;
    isRed(): boolean;
    private fixUp;
    private moveRedLeft;
    private moveRedRight;
    private rotateLeft;
    private rotateRight;
    private colorFlip;
    checkMaxDepth(): boolean;
    protected check(): number;
}
declare class LLRBEmptyNode<K, V> {
    get key(): never;
    get value(): never;
    get color(): never;
    get left(): never;
    get right(): never;
    size: number;
    copy(key: K | null, value: V | null, color: boolean | null, left: LLRBNode<K, V> | LLRBEmptyNode<K, V> | null, right: LLRBNode<K, V> | LLRBEmptyNode<K, V> | null): LLRBEmptyNode<K, V>;
    insert(key: K, value: V, comparator: Comparator<K>): LLRBNode<K, V>;
    remove(key: K, comparator: Comparator<K>): LLRBEmptyNode<K, V>;
    isEmpty(): boolean;
    inorderTraversal(action: (k: K, v: V) => boolean): boolean;
    reverseTraversal(action: (k: K, v: V) => boolean): boolean;
    minKey(): K | null;
    maxKey(): K | null;
    isRed(): boolean;
    checkMaxDepth(): boolean;
    protected check(): 0;
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
 * SortedSet is an immutable (copy-on-write) collection that holds elements
 * in order specified by the provided comparator.
 *
 * NOTE: if provided comparator returns 0 for two elements, we consider them to
 * be equal!
 */
declare class SortedSet<T> {
    private comparator;
    private data;
    constructor(comparator: (left: T, right: T) => number);
    has(elem: T): boolean;
    first(): T | null;
    last(): T | null;
    get size(): number;
    indexOf(elem: T): number;
    /** Iterates elements in order defined by "comparator" */
    forEach(cb: (elem: T) => void): void;
    /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
    forEachInRange(range: [T, T], cb: (elem: T) => void): void;
    /**
     * Iterates over `elem`s such that: start &lt;= elem until false is returned.
     */
    forEachWhile(cb: (elem: T) => boolean, start?: T): void;
    /** Finds the least element greater than or equal to `elem`. */
    firstAfterOrEqual(elem: T): T | null;
    getIterator(): SortedSetIterator<T>;
    getIteratorFrom(key: T): SortedSetIterator<T>;
    /** Inserts or updates an element */
    add(elem: T): SortedSet<T>;
    /** Deletes an element */
    delete(elem: T): SortedSet<T>;
    isEmpty(): boolean;
    unionWith(other: SortedSet<T>): SortedSet<T>;
    isEqual(other: SortedSet<T>): boolean;
    toArray(): T[];
    toString(): string;
    private copy;
}
declare class SortedSetIterator<T> {
    private iter;
    constructor(iter: SortedMapIterator<T, boolean>);
    getNext(): T;
    hasNext(): boolean;
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
declare class Bound {
    readonly position: Value[];
    readonly inclusive: boolean;
    constructor(position: Value[], inclusive: boolean);
}

/**
 * @license
 * Copyright 2021 Google LLC
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
 * An index definition for field indexes in Firestore.
 *
 * Every index is associated with a collection. The definition contains a list
 * of fields and their index kind (which can be `ASCENDING`, `DESCENDING` or
 * `CONTAINS` for ArrayContains/ArrayContainsAny queries).
 *
 * Unlike the backend, the SDK does not differentiate between collection or
 * collection group-scoped indices. Every index can be used for both single
 * collection and collection group queries.
 */
declare class FieldIndex {
    /**
     * The index ID. Returns -1 if the index ID is not available (e.g. the index
     * has not yet been persisted).
     */
    readonly indexId: number;
    /** The collection ID this index applies to. */
    readonly collectionGroup: string;
    /** The field segments for this index. */
    readonly fields: IndexSegment[];
    /** Shows how up-to-date the index is for the current user. */
    readonly indexState: IndexState;
    /** An ID for an index that has not yet been added to persistence.  */
    static UNKNOWN_ID: number;
    constructor(
    /**
     * The index ID. Returns -1 if the index ID is not available (e.g. the index
     * has not yet been persisted).
     */
    indexId: number, 
    /** The collection ID this index applies to. */
    collectionGroup: string, 
    /** The field segments for this index. */
    fields: IndexSegment[], 
    /** Shows how up-to-date the index is for the current user. */
    indexState: IndexState);
}
/** The type of the index, e.g. for which type of query it can be used. */
declare const enum IndexKind {
    /**
     * Ordered index. Can be used for <, <=, ==, >=, >, !=, IN and NOT IN queries.
     */
    ASCENDING = 0,
    /**
     * Ordered index. Can be used for <, <=, ==, >=, >, !=, IN and NOT IN queries.
     */
    DESCENDING = 1,
    /** Contains index. Can be used for ArrayContains and ArrayContainsAny. */
    CONTAINS = 2
}
/** An index component consisting of field path and index type.  */
declare class IndexSegment {
    /** The field path of the component. */
    readonly fieldPath: FieldPath$1;
    /** The fields sorting order. */
    readonly kind: IndexKind;
    constructor(
    /** The field path of the component. */
    fieldPath: FieldPath$1, 
    /** The fields sorting order. */
    kind: IndexKind);
}
/**
 * Stores the "high water mark" that indicates how updated the Index is for the
 * current user.
 */
declare class IndexState {
    /**
     * Indicates when the index was last updated (relative to other indexes).
     */
    readonly sequenceNumber: number;
    /** The the latest indexed read time, document and batch id. */
    readonly offset: IndexOffset;
    constructor(
    /**
     * Indicates when the index was last updated (relative to other indexes).
     */
    sequenceNumber: number, 
    /** The the latest indexed read time, document and batch id. */
    offset: IndexOffset);
    /** The state of an index that has not yet been backfilled. */
    static empty(): IndexState;
}
/**
 * Stores the latest read time, document and batch ID that were processed for an
 * index.
 */
declare class IndexOffset {
    /**
     * The latest read time version that has been indexed by Firestore for this
     * field index.
     */
    readonly readTime: SnapshotVersion;
    /**
     * The key of the last document that was indexed for this query. Use
     * `DocumentKey.empty()` if no document has been indexed.
     */
    readonly documentKey: DocumentKey;
    readonly largestBatchId: number;
    constructor(
    /**
     * The latest read time version that has been indexed by Firestore for this
     * field index.
     */
    readTime: SnapshotVersion, 
    /**
     * The key of the last document that was indexed for this query. Use
     * `DocumentKey.empty()` if no document has been indexed.
     */
    documentKey: DocumentKey, largestBatchId: number);
    /** Returns an offset that sorts before all regular offsets. */
    static min(): IndexOffset;
    /** Returns an offset that sorts after all regular offsets. */
    static max(): IndexOffset;
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
 * A Target represents the WatchTarget representation of a Query, which is used
 * by the LocalStore and the RemoteStore to keep track of and to execute
 * backend queries. While a Query can represent multiple Targets, each Targets
 * maps to a single WatchTarget in RemoteStore and a single TargetData entry
 * in persistence.
 */
interface Target {
    readonly path: ResourcePath;
    readonly collectionGroup: string | null;
    readonly orderBy: OrderBy[];
    readonly filters: Filter[];
    readonly limit: number | null;
    readonly startAt: Bound | null;
    readonly endAt: Bound | null;
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

declare const enum LimitType$1 {
    First = "F",
    Last = "L"
}
/**
 * The Query interface defines all external properties of a query.
 *
 * QueryImpl implements this interface to provide memoization for `queryNormalizedOrderBy`
 * and `queryToTarget`.
 */
interface Query$1 {
    readonly path: ResourcePath;
    readonly collectionGroup: string | null;
    readonly explicitOrderBy: OrderBy[];
    readonly filters: Filter[];
    readonly limit: number | null;
    readonly limitType: LimitType$1;
    readonly startAt: Bound | null;
    readonly endAt: Bound | null;
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
declare class ByteString {
    private readonly binaryString;
    static readonly EMPTY_BYTE_STRING: ByteString;
    private constructor();
    static fromBase64String(base64: string): ByteString;
    static fromUint8Array(array: Uint8Array): ByteString;
    [Symbol.iterator](): Iterator<number>;
    toBase64(): string;
    toUint8Array(): Uint8Array;
    approximateByteSize(): number;
    compareTo(other: ByteString): number;
    isEqual(other: ByteString): boolean;
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
declare class Bytes {
    _byteString: ByteString;
    /** @hideconstructor */
    constructor(byteString: ByteString);
    /**
     * Creates a new `Bytes` object from the given Base64 string, converting it to
     * bytes.
     *
     * @param base64 - The Base64 string used to create the `Bytes` object.
     */
    static fromBase64String(base64: string): Bytes;
    /**
     * Creates a new `Bytes` object from the given Uint8Array.
     *
     * @param array - The Uint8Array used to create the `Bytes` object.
     */
    static fromUint8Array(array: Uint8Array): Bytes;
    /**
     * Returns the underlying bytes as a Base64-encoded string.
     *
     * @returns The Base64-encoded string created from the `Bytes` object.
     */
    toBase64(): string;
    /**
     * Returns the underlying bytes in a new `Uint8Array`.
     *
     * @returns The Uint8Array created from the `Bytes` object.
     */
    toUint8Array(): Uint8Array;
    /**
     * Returns a string representation of the `Bytes` object.
     *
     * @returns A string representation of the `Bytes` object.
     */
    toString(): string;
    /**
     * Returns true if this `Bytes` object is equal to the provided one.
     *
     * @param other - The `Bytes` object to compare against.
     * @returns true if this `Bytes` object is equal to the provided one.
     */
    isEqual(other: Bytes): boolean;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        bytes: Property<"string">;
    };
    /**
     * Returns a JSON-serializable representation of this `Bytes` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON(): object;
    /**
     * Builds a `Bytes` instance from a JSON object created by {@link Bytes.toJSON}.
     *
     * @param json - a JSON object represention of a `Bytes` instance
     * @returns an instance of {@link Bytes} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(json: object): Bytes;
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
declare class GeoPoint {
    private _lat;
    private _long;
    /**
     * Creates a new immutable `GeoPoint` object with the provided latitude and
     * longitude values.
     * @param latitude - The latitude as number between -90 and 90.
     * @param longitude - The longitude as number between -180 and 180.
     */
    constructor(latitude: number, longitude: number);
    /**
     * The latitude of this `GeoPoint` instance.
     */
    get latitude(): number;
    /**
     * The longitude of this `GeoPoint` instance.
     */
    get longitude(): number;
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */
    isEqual(other: GeoPoint): boolean;
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */
    _compareTo(other: GeoPoint): number;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        latitude: Property<"number">;
        longitude: Property<"number">;
    };
    /**
     * Returns a JSON-serializable representation of this `GeoPoint` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON(): {
        latitude: number;
        longitude: number;
        type: string;
    };
    /**
     * Builds a `GeoPoint` instance from a JSON object created by {@link GeoPoint.toJSON}.
     *
     * @param json - a JSON object represention of a `GeoPoint` instance
     * @returns an instance of {@link GeoPoint} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(json: object): GeoPoint;
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
 * BatchID is a locally assigned ID for a batch of mutations that have been
 * applied.
 */
type BatchId = number;
/**
 * A locally-assigned ID used to refer to a target being watched via the
 * Watch service.
 */
type TargetId = number;
type ListenSequenceNumber = number;
/**
 * Describes the online state of the Firestore client. Note that this does not
 * indicate whether or not the remote store is trying to connect or not. This is
 * primarily used by the View / EventManager code to change their behavior while
 * offline (e.g. get() calls shouldn't wait for data from the server and
 * snapshot events should set metadata.isFromCache=true).
 *
 * The string values should not be changed since they are persisted in
 * WebStorage.
 */
declare const enum OnlineState {
    /**
     * The Firestore client is in an unknown online state. This means the client
     * is either not actively trying to establish a connection or it is currently
     * trying to establish a connection, but it has not succeeded or failed yet.
     * Higher-level components should not operate in offline mode.
     */
    Unknown = "Unknown",
    /**
     * The client is connected and the connections are healthy. This state is
     * reached after a successful connection and there has been at least one
     * successful message received from the backends.
     */
    Online = "Online",
    /**
     * The client is either trying to establish a connection but failing, or it
     * has been explicitly marked offline via a call to disableNetwork().
     * Higher-level components should operate in offline mode.
     */
    Offline = "Offline"
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

/** An enumeration of the different purposes we have for targets. */
declare const enum TargetPurpose {
    /** A regular, normal query target. */
    Listen = "TargetPurposeListen",
    /**
     * The query target was used to refill a query after an existence filter
     * mismatch.
     */
    ExistenceFilterMismatch = "TargetPurposeExistenceFilterMismatch",
    /**
     * The query target was used if the query is the result of a false positive in
     * the bloom filter.
     */
    ExistenceFilterMismatchBloom = "TargetPurposeExistenceFilterMismatchBloom",
    /** The query target was used to resolve a limbo document. */
    LimboResolution = "TargetPurposeLimboResolution"
}
/**
 * An immutable set of metadata that the local store tracks for each target.
 */
declare class TargetData {
    /** The target being listened to. */
    readonly target: Target;
    /**
     * The target ID to which the target corresponds; Assigned by the
     * LocalStore for user listens and by the SyncEngine for limbo watches.
     */
    readonly targetId: TargetId;
    /** The purpose of the target. */
    readonly purpose: TargetPurpose;
    /**
     * The sequence number of the last transaction during which this target data
     * was modified.
     */
    readonly sequenceNumber: ListenSequenceNumber;
    /** The latest snapshot version seen for this target. */
    readonly snapshotVersion: SnapshotVersion;
    /**
     * The maximum snapshot version at which the associated view
     * contained no limbo documents.
     */
    readonly lastLimboFreeSnapshotVersion: SnapshotVersion;
    /**
     * An opaque, server-assigned token that allows watching a target to be
     * resumed after disconnecting without retransmitting all the data that
     * matches the target. The resume token essentially identifies a point in
     * time from which the server should resume sending results.
     */
    readonly resumeToken: ByteString;
    /**
     * The number of documents that last matched the query at the resume token or
     * read time. Documents are counted only when making a listen request with
     * resume token or read time, otherwise, keep it null.
     */
    readonly expectedCount: number | null;
    constructor(
    /** The target being listened to. */
    target: Target, 
    /**
     * The target ID to which the target corresponds; Assigned by the
     * LocalStore for user listens and by the SyncEngine for limbo watches.
     */
    targetId: TargetId, 
    /** The purpose of the target. */
    purpose: TargetPurpose, 
    /**
     * The sequence number of the last transaction during which this target data
     * was modified.
     */
    sequenceNumber: ListenSequenceNumber, 
    /** The latest snapshot version seen for this target. */
    snapshotVersion?: SnapshotVersion, 
    /**
     * The maximum snapshot version at which the associated view
     * contained no limbo documents.
     */
    lastLimboFreeSnapshotVersion?: SnapshotVersion, 
    /**
     * An opaque, server-assigned token that allows watching a target to be
     * resumed after disconnecting without retransmitting all the data that
     * matches the target. The resume token essentially identifies a point in
     * time from which the server should resume sending results.
     */
    resumeToken?: ByteString, 
    /**
     * The number of documents that last matched the query at the resume token or
     * read time. Documents are counted only when making a listen request with
     * resume token or read time, otherwise, keep it null.
     */
    expectedCount?: number | null);
    /** Creates a new target data instance with an updated sequence number. */
    withSequenceNumber(sequenceNumber: number): TargetData;
    /**
     * Creates a new target data instance with an updated resume token and
     * snapshot version.
     */
    withResumeToken(resumeToken: ByteString, snapshotVersion: SnapshotVersion): TargetData;
    /**
     * Creates a new target data instance with an updated expected count.
     */
    withExpectedCount(expectedCount: number): TargetData;
    /**
     * Creates a new target data instance with an updated last limbo free
     * snapshot version number.
     */
    withLastLimboFreeSnapshotVersion(lastLimboFreeSnapshotVersion: SnapshotVersion): TargetData;
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
 * Represents a local view (overlay) of a document, and the fields that are
 * locally mutated.
 */
declare class OverlayedDocument {
    readonly overlayedDocument: Document;
    /**
     * The fields that are locally mutated by patch mutations.
     *
     * If the overlayed	document is from set or delete mutations, this is `null`.
     * If there is no overlay (mutation) for the document, this is an empty `FieldMask`.
     */
    readonly mutatedFields: FieldMask | null;
    constructor(overlayedDocument: Document, 
    /**
     * The fields that are locally mutated by patch mutations.
     *
     * If the overlayed	document is from set or delete mutations, this is `null`.
     * If there is no overlay (mutation) for the document, this is an empty `FieldMask`.
     */
    mutatedFields: FieldMask | null);
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
 * A map implementation that uses objects as keys. Objects must have an
 * associated equals function and must be immutable. Entries in the map are
 * stored together with the key being produced from the mapKeyFn. This map
 * automatically handles collisions of keys.
 */
declare class ObjectMap<KeyType, ValueType> {
    private mapKeyFn;
    private equalsFn;
    /**
     * The inner map for a key/value pair. Due to the possibility of collisions we
     * keep a list of entries that we do a linear search through to find an actual
     * match. Note that collisions should be rare, so we still expect near
     * constant time lookups in practice.
     */
    private inner;
    /** The number of entries stored in the map */
    private innerSize;
    constructor(mapKeyFn: (key: KeyType) => string, equalsFn: (l: KeyType, r: KeyType) => boolean);
    /** Get a value for this key, or undefined if it does not exist. */
    get(key: KeyType): ValueType | undefined;
    has(key: KeyType): boolean;
    /** Put this key and value in the map. */
    set(key: KeyType, value: ValueType): void;
    /**
     * Remove this key from the map. Returns a boolean if anything was deleted.
     */
    delete(key: KeyType): boolean;
    forEach(fn: (key: KeyType, val: ValueType) => void): void;
    isEmpty(): boolean;
    size(): number;
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
 * Representation of an overlay computed by Firestore.
 *
 * Holds information about a mutation and the largest batch id in Firestore when
 * the mutation was created.
 */
declare class Overlay {
    readonly largestBatchId: number;
    readonly mutation: Mutation;
    constructor(largestBatchId: number, mutation: Mutation);
    getKey(): DocumentKey;
    isEqual(other: Overlay | null): boolean;
    toString(): string;
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

/** Miscellaneous collection types / constants. */
type MutableDocumentMap = SortedMap<DocumentKey, MutableDocument>;
type DocumentMap = SortedMap<DocumentKey, Document>;
type OverlayedDocumentMap = DocumentKeyMap<OverlayedDocument>;
type OverlayMap = DocumentKeyMap<Overlay>;
type MutationMap = DocumentKeyMap<Mutation>;
type DocumentKeyMap<T> = ObjectMap<DocumentKey, T>;
type DocumentVersionMap = SortedMap<DocumentKey, SnapshotVersion>;
type DocumentKeySet = SortedSet<DocumentKey>;

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
 * The set of Firestore status codes. The codes are the same at the ones
 * exposed by gRPC here:
 * https://github.com/grpc/grpc/blob/master/doc/statuscodes.md
 *
 * Possible values:
 * - 'cancelled': The operation was cancelled (typically by the caller).
 * - 'unknown': Unknown error or an error from a different error domain.
 * - 'invalid-argument': Client specified an invalid argument. Note that this
 *   differs from 'failed-precondition'. 'invalid-argument' indicates
 *   arguments that are problematic regardless of the state of the system
 *   (e.g. an invalid field name).
 * - 'deadline-exceeded': Deadline expired before operation could complete.
 *   For operations that change the state of the system, this error may be
 *   returned even if the operation has completed successfully. For example,
 *   a successful response from a server could have been delayed long enough
 *   for the deadline to expire.
 * - 'not-found': Some requested document was not found.
 * - 'already-exists': Some document that we attempted to create already
 *   exists.
 * - 'permission-denied': The caller does not have permission to execute the
 *   specified operation.
 * - 'resource-exhausted': Some resource has been exhausted, perhaps a
 *   per-user quota, or perhaps the entire file system is out of space.
 * - 'failed-precondition': Operation was rejected because the system is not
 *   in a state required for the operation's execution.
 * - 'aborted': The operation was aborted, typically due to a concurrency
 *   issue like transaction aborts, etc.
 * - 'out-of-range': Operation was attempted past the valid range.
 * - 'unimplemented': Operation is not implemented or not supported/enabled.
 * - 'internal': Internal errors. Means some invariants expected by
 *   underlying system has been broken. If you see one of these errors,
 *   something is very broken.
 * - 'unavailable': The service is currently unavailable. This is most likely
 *   a transient condition and may be corrected by retrying with a backoff.
 * - 'data-loss': Unrecoverable data loss or corruption.
 * - 'unauthenticated': The request does not have valid authentication
 *   credentials for the operation.
 */
type FirestoreErrorCode = 'cancelled' | 'unknown' | 'invalid-argument' | 'deadline-exceeded' | 'not-found' | 'already-exists' | 'permission-denied' | 'resource-exhausted' | 'failed-precondition' | 'aborted' | 'out-of-range' | 'unimplemented' | 'internal' | 'unavailable' | 'data-loss' | 'unauthenticated';
/** An error returned by a Firestore operation. */
declare class FirestoreError extends FirebaseError {
    /**
     * The backend error code associated with this error.
     */
    readonly code: FirestoreErrorCode;
    /**
     * A custom error description.
     */
    readonly message: string;
    /** The stack of the error. */
    readonly stack?: string;
    /** @hideconstructor */
    constructor(
    /**
     * The backend error code associated with this error.
     */
    code: FirestoreErrorCode, 
    /**
     * A custom error description.
     */
    message: string);
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
 * An event from the RemoteStore. It is split into targetChanges (changes to the
 * state or the set of documents in our watched targets) and documentUpdates
 * (changes to the actual documents).
 */
declare class RemoteEvent {
    /**
     * The snapshot version this event brings us up to, or MIN if not set.
     */
    readonly snapshotVersion: SnapshotVersion;
    /**
     * A map from target to changes to the target. See TargetChange.
     */
    readonly targetChanges: Map<TargetId, TargetChange>;
    /**
     * A map of targets that is known to be inconsistent, and the purpose for
     * re-listening. Listens for these targets should be re-established without
     * resume tokens.
     */
    readonly targetMismatches: SortedMap<TargetId, TargetPurpose>;
    /**
     * A set of which documents have changed or been deleted, along with the
     * doc's new values (if not deleted).
     */
    readonly documentUpdates: MutableDocumentMap;
    /**
     * A set of which document updates are due only to limbo resolution targets.
     */
    readonly resolvedLimboDocuments: DocumentKeySet;
    constructor(
    /**
     * The snapshot version this event brings us up to, or MIN if not set.
     */
    snapshotVersion: SnapshotVersion, 
    /**
     * A map from target to changes to the target. See TargetChange.
     */
    targetChanges: Map<TargetId, TargetChange>, 
    /**
     * A map of targets that is known to be inconsistent, and the purpose for
     * re-listening. Listens for these targets should be re-established without
     * resume tokens.
     */
    targetMismatches: SortedMap<TargetId, TargetPurpose>, 
    /**
     * A set of which documents have changed or been deleted, along with the
     * doc's new values (if not deleted).
     */
    documentUpdates: MutableDocumentMap, 
    /**
     * A set of which document updates are due only to limbo resolution targets.
     */
    resolvedLimboDocuments: DocumentKeySet);
    /**
     * HACK: Views require RemoteEvents in order to determine whether the view is
     * CURRENT, but secondary tabs don't receive remote events. So this method is
     * used to create a synthesized RemoteEvent that can be used to apply a
     * CURRENT status change to a View, for queries executed in a different tab.
     */
    static createSynthesizedRemoteEventForCurrentChange(targetId: TargetId, current: boolean, resumeToken: ByteString): RemoteEvent;
}
/**
 * A TargetChange specifies the set of changes for a specific target as part of
 * a RemoteEvent. These changes track which documents are added, modified or
 * removed, as well as the target's resume token and whether the target is
 * marked CURRENT.
 * The actual changes *to* documents are not part of the TargetChange since
 * documents may be part of multiple targets.
 */
declare class TargetChange {
    /**
     * An opaque, server-assigned token that allows watching a query to be resumed
     * after disconnecting without retransmitting all the data that matches the
     * query. The resume token essentially identifies a point in time from which
     * the server should resume sending results.
     */
    readonly resumeToken: ByteString;
    /**
     * The "current" (synced) status of this target. Note that "current"
     * has special meaning in the RPC protocol that implies that a target is
     * both up-to-date and consistent with the rest of the watch stream.
     */
    readonly current: boolean;
    /**
     * The set of documents that were newly assigned to this target as part of
     * this remote event.
     */
    readonly addedDocuments: DocumentKeySet;
    /**
     * The set of documents that were already assigned to this target but received
     * an update during this remote event.
     */
    readonly modifiedDocuments: DocumentKeySet;
    /**
     * The set of documents that were removed from this target as part of this
     * remote event.
     */
    readonly removedDocuments: DocumentKeySet;
    constructor(
    /**
     * An opaque, server-assigned token that allows watching a query to be resumed
     * after disconnecting without retransmitting all the data that matches the
     * query. The resume token essentially identifies a point in time from which
     * the server should resume sending results.
     */
    resumeToken: ByteString, 
    /**
     * The "current" (synced) status of this target. Note that "current"
     * has special meaning in the RPC protocol that implies that a target is
     * both up-to-date and consistent with the rest of the watch stream.
     */
    current: boolean, 
    /**
     * The set of documents that were newly assigned to this target as part of
     * this remote event.
     */
    addedDocuments: DocumentKeySet, 
    /**
     * The set of documents that were already assigned to this target but received
     * an update during this remote event.
     */
    modifiedDocuments: DocumentKeySet, 
    /**
     * The set of documents that were removed from this target as part of this
     * remote event.
     */
    removedDocuments: DocumentKeySet);
    /**
     * This method is used to create a synthesized TargetChanges that can be used to
     * apply a CURRENT status change to a View (for queries executed in a different
     * tab) or for new queries (to raise snapshots with correct CURRENT status).
     */
    static createSynthesizedTargetChangeForCurrentChange(targetId: TargetId, current: boolean, resumeToken: ByteString): TargetChange;
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
declare class JsonProtoSerializer implements Serializer {
    readonly databaseId: DatabaseId;
    readonly useProto3Json: boolean;
    constructor(databaseId: DatabaseId, useProto3Json: boolean);
}
interface ProtoSerializable<ProtoType> {
    _toProto(serializer: JsonProtoSerializer): ProtoType;
}
interface ProtoValueSerializable extends ProtoSerializable<Value> {
    _protoValueType: 'ProtoValue';
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

interface FirebaseAppCheckInternal {
  // Get the current AttestationToken. Attaches to the most recent in-flight request if one
  // is present. Returns null if no token is present and no token requests are in-flight.
  getToken(forceRefresh?: boolean): Promise<AppCheckTokenResult>;

  // Always returns a fresh limited-use token suitable for Replay Protection.
  // The returned token must be used and consumed as soon as possible.
  getLimitedUseToken(): Promise<AppCheckTokenResult>;

  // Registers a listener to changes in the token state. There can be more than one listener
  // registered at the same time for one or more FirebaseAppAttestation instances. The
  // listeners call back on the UI thread whenever the current token associated with this
  // FirebaseAppAttestation changes.
  addTokenListener(listener: AppCheckTokenListener): void;

  // Unregisters a listener to changes in the token state.
  removeTokenListener(listener: AppCheckTokenListener): void;
}

type AppCheckTokenListener = (token: AppCheckTokenResult) => void;

// If the error field is defined, the token field will be populated with a dummy token
interface AppCheckTokenResult {
  readonly token: string;
  readonly error?: Error;
}

declare module '@firebase/component' {
  interface NameServiceMapping {
    'app-check-internal': FirebaseAppCheckInternal;
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

interface FirebaseAuthTokenData {
  accessToken: string;
}

interface FirebaseAuthInternal {
  getToken(refreshToken?: boolean): Promise<FirebaseAuthTokenData | null>;
  getUid(): string | null;
  addAuthTokenListener(fn: (token: string | null) => void): void;
  removeAuthTokenListener(fn: (token: string | null) => void): void;
}

declare module '@firebase/component' {
  interface NameServiceMapping {
    'auth-internal': FirebaseAuthInternal;
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
 * Simple wrapper around a nullable UID. Mostly exists to make code more
 * readable.
 */
declare class User {
    readonly uid: string | null;
    /** A user with a null UID. */
    static readonly UNAUTHENTICATED: User;
    static readonly GOOGLE_CREDENTIALS: User;
    static readonly FIRST_PARTY: User;
    static readonly MOCK_USER: User;
    constructor(uid: string | null);
    isAuthenticated(): boolean;
    /**
     * Returns a key representing this user, suitable for inclusion in a
     * dictionary.
     */
    toKey(): string;
    isEqual(otherUser: User): boolean;
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
 * Wellknown "timer" IDs used when scheduling delayed operations on the
 * AsyncQueue. These IDs can then be used from tests to check for the presence
 * of operations or to run them early.
 *
 * The string values are used when encoding these timer IDs in JSON spec tests.
 */
declare const enum TimerId {
    /** All can be used with runDelayedOperationsEarly() to run all timers. */
    All = "all",
    /**
     * The following 5 timers are used in persistent_stream.ts for the listen and
     * write streams. The "Idle" timer is used to close the stream due to
     * inactivity. The "ConnectionBackoff" timer is used to restart a stream once
     * the appropriate backoff delay has elapsed. The health check is used to mark
     * a stream healthy if it has not received an error during its initial setup.
     */
    ListenStreamIdle = "listen_stream_idle",
    ListenStreamConnectionBackoff = "listen_stream_connection_backoff",
    WriteStreamIdle = "write_stream_idle",
    WriteStreamConnectionBackoff = "write_stream_connection_backoff",
    HealthCheckTimeout = "health_check_timeout",
    /**
     * A timer used in online_state_tracker.ts to transition from
     * OnlineState.Unknown to Offline after a set timeout, rather than waiting
     * indefinitely for success or failure.
     */
    OnlineStateTimeout = "online_state_timeout",
    /**
     * A timer used to update the client metadata in IndexedDb, which is used
     * to determine the primary leaseholder.
     */
    ClientMetadataRefresh = "client_metadata_refresh",
    /** A timer used to periodically attempt LRU Garbage collection */
    LruGarbageCollection = "lru_garbage_collection",
    /**
     * A timer used to retry transactions. Since there can be multiple concurrent
     * transactions, multiple of these may be in the queue at a given time.
     */
    TransactionRetry = "transaction_retry",
    /**
     * A timer used to retry operations scheduled via retryable AsyncQueue
     * operations.
     */
    AsyncQueueRetry = "async_queue_retry",
    /**
     *  A timer used to periodically attempt index backfill.
     */
    IndexBackfill = "index_backfill"
}
/**
 * Represents an operation scheduled to be run in the future on an AsyncQueue.
 *
 * It is created via DelayedOperation.createAndSchedule().
 *
 * Supports cancellation (via cancel()) and early execution (via skipDelay()).
 *
 * Note: We implement `PromiseLike` instead of `Promise`, as the `Promise` type
 * in newer versions of TypeScript defines `finally`, which is not available in
 * IE.
 */
declare class DelayedOperation<T extends unknown> implements PromiseLike<T> {
    private readonly asyncQueue;
    readonly timerId: TimerId;
    readonly targetTimeMs: number;
    private readonly op;
    private readonly removalCallback;
    private timerHandle;
    private readonly deferred;
    private constructor();
    get promise(): Promise<T>;
    /**
     * Creates and returns a DelayedOperation that has been scheduled to be
     * executed on the provided asyncQueue after the provided delayMs.
     *
     * @param asyncQueue - The queue to schedule the operation on.
     * @param id - A Timer ID identifying the type of operation this is.
     * @param delayMs - The delay (ms) before the operation should be scheduled.
     * @param op - The operation to run.
     * @param removalCallback - A callback to be called synchronously once the
     *   operation is executed or canceled, notifying the AsyncQueue to remove it
     *   from its delayedOperations list.
     *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
     *   the DelayedOperation class public.
     */
    static createAndSchedule<R extends unknown>(asyncQueue: AsyncQueue, timerId: TimerId, delayMs: number, op: () => Promise<R>, removalCallback: (op: DelayedOperation<R>) => void): DelayedOperation<R>;
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */
    private start;
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */
    skipDelay(): void;
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */
    cancel(reason?: string): void;
    then: <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined) => Promise<TResult1 | TResult2>;
    private handleDelayElapsed;
    private clearTimeout;
}
interface AsyncQueue {
    readonly isShuttingDown: boolean;
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */
    enqueueAndForget<T extends unknown>(op: () => Promise<T>): void;
    /**
     * Regardless if the queue has initialized shutdown, adds a new operation to the
     * queue without waiting for it to complete (i.e. we ignore the Promise result).
     */
    enqueueAndForgetEvenWhileRestricted<T extends unknown>(op: () => Promise<T>): void;
    /**
     * Initialize the shutdown of this queue. Once this method is called, the
     * only possible way to request running an operation is through
     * `enqueueEvenWhileRestricted()`.
     *
     * @param purgeExistingTasks - Whether already enqueued tasked should be
     * rejected (unless enqueued with `enqueueEvenWhileRestricted()`). Defaults
     * to false.
     */
    enterRestrictedMode(purgeExistingTasks?: boolean): void;
    /**
     * Adds a new operation to the queue. Returns a promise that will be resolved
     * when the promise returned by the new operation is (with its value).
     */
    enqueue<T extends unknown>(op: () => Promise<T>): Promise<T>;
    /**
     * Enqueue a retryable operation.
     *
     * A retryable operation is rescheduled with backoff if it fails with a
     * IndexedDbTransactionError (the error type used by SimpleDb). All
     * retryable operations are executed in order and only run if all prior
     * operations were retried successfully.
     */
    enqueueRetryable(op: () => Promise<void>): void;
    /**
     * Schedules an operation to be queued on the AsyncQueue once the specified
     * `delayMs` has elapsed. The returned DelayedOperation can be used to cancel
     * or fast-forward the operation prior to its running.
     */
    enqueueAfterDelay<T extends unknown>(timerId: TimerId, delayMs: number, op: () => Promise<T>): DelayedOperation<T>;
    /**
     * Verifies there's an operation currently in-progress on the AsyncQueue.
     * Unfortunately we can't verify that the running code is in the promise chain
     * of that operation, so this isn't a foolproof check, but it should be enough
     * to catch some bugs.
     */
    verifyOperationInProgress(): void;
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
type AuthTokenFactory = () => string;
/**
 * @internal
 */
interface FirstPartyCredentialsSettings {
    ['type']: 'firstParty';
    ['sessionIndex']: string;
    ['iamToken']: string | null;
    ['authTokenFactory']: AuthTokenFactory | null;
}
interface ProviderCredentialsSettings {
    ['type']: 'provider';
    ['client']: CredentialsProvider<User>;
}
/** Settings for private credentials */
type CredentialsSettings = FirstPartyCredentialsSettings | ProviderCredentialsSettings;
type TokenType = 'OAuth' | 'FirstParty' | 'AppCheck';
interface Token {
    /** Type of token. */
    type: TokenType;
    /**
     * The user with which the token is associated (used for persisting user
     * state on disk, etc.).
     * This will be null for Tokens of the type 'AppCheck'.
     */
    user?: User;
    /** Header values to set for this token */
    headers: Map<string, string>;
}
/**
 * A Listener for credential change events. The listener should fetch a new
 * token and may need to invalidate other state if the current user has also
 * changed.
 */
type CredentialChangeListener<T> = (credential: T) => Promise<void>;
/**
 * Provides methods for getting the uid and token for the current user and
 * listening for changes.
 */
interface CredentialsProvider<T> {
    /**
     * Starts the credentials provider and specifies a listener to be notified of
     * credential changes (sign-in / sign-out, token changes). It is immediately
     * called once with the initial user.
     *
     * The change listener is invoked on the provided AsyncQueue.
     */
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<T>): void;
    /** Requests a token for the current user. */
    getToken(): Promise<Token | null>;
    /**
     * Marks the last retrieved token as invalid, making the next GetToken request
     * force-refresh the token.
     */
    invalidateToken(): void;
    shutdown(): void;
}
/**
 * A CredentialsProvider that always yields an empty token.
 * @internal
 */
declare class EmptyAuthCredentialsProvider implements CredentialsProvider<User> {
    getToken(): Promise<Token | null>;
    invalidateToken(): void;
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<User>): void;
    shutdown(): void;
}
/**
 * An AppCheck token provider that always yields an empty token.
 * @internal
 */
declare class EmptyAppCheckTokenProvider implements CredentialsProvider<string> {
    getToken(): Promise<Token | null>;
    invalidateToken(): void;
    start(asyncQueue: AsyncQueue, changeListener: CredentialChangeListener<string>): void;
    shutdown(): void;
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

type OptionsDefinitions = Record<string, OptionDefinition>;
interface OptionDefinition {
    serverName: string;
    nestedOptions?: OptionsDefinitions;
}
declare class OptionsUtil {
    private optionDefinitions;
    constructor(optionDefinitions: OptionsDefinitions);
    private _getKnownOptions;
    getOptionsProto(context: ParseContext, knownOptions: Record<string, unknown>, optionsOverride?: Record<string, unknown>): ApiClientObjectMap<Value> | undefined;
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
declare abstract class Datastore {
    abstract terminate(): void;
    abstract serializer: JsonProtoSerializer;
}

/**
 * @beta
 * Utility type to create an type that only allows one
 * property of the Type param T to be set.
 *
 * @example
 * ```
 * type XorY = OneOf<{ x: unknown, y: unknown }>
 * let a = { x: "foo" }           // OK
 * let b = { y: "foo" }           // OK
 * let c = { a: "foo", y: "foo" } // Not OK
 * ```
 */
type OneOf<T> = {
    [K in keyof T]: Pick<T, K> & {
        [P in Exclude<keyof T, K>]?: undefined;
    };
}[keyof T];

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

/** Properties of a BundledQuery. */
interface BundledQuery {
    /** BundledQuery parent */
    parent?: string | null;
    /** BundledQuery structuredQuery */
    structuredQuery?: StructuredQuery | null;
    /** BundledQuery limitType */
    limitType?: LimitType | null;
}
/** LimitType enum. */
type LimitType = 'FIRST' | 'LAST';
/** Properties of a NamedQuery. */
interface NamedQuery$1 {
    /** NamedQuery name */
    name?: string | null;
    /** NamedQuery bundledQuery */
    bundledQuery?: BundledQuery | null;
    /** NamedQuery readTime */
    readTime?: Timestamp | null;
}
/** Properties of a BundleMetadata. */
interface BundleMetadata$1 {
    /** BundleMetadata id */
    id?: string | null;
    /** BundleMetadata createTime */
    createTime?: Timestamp | null;
    /** BundleMetadata version */
    version?: number | null;
    /** BundleMetadata totalDocuments */
    totalDocuments?: number | null;
    /** BundleMetadata totalBytes */
    totalBytes?: number | null;
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
 * Represents a Firestore bundle saved by the SDK in its local storage.
 */
interface BundleMetadata {
    /**
     * Id of the bundle. It is used together with `createTime` to determine if a
     * bundle has been loaded by the SDK.
     */
    readonly id: string;
    /** Schema version of the bundle. */
    readonly version: number;
    /**
     * Set to the snapshot version of the bundle if created by the Server SDKs.
     * Otherwise set to SnapshotVersion.MIN.
     */
    readonly createTime: SnapshotVersion;
}
/**
 * Represents a Query saved by the SDK in its local storage.
 */
interface NamedQuery {
    /** The name of the query. */
    readonly name: string;
    /** The underlying query associated with `name`. */
    readonly query: Query$1;
    /** The time at which the results for this query were read. */
    readonly readTime: SnapshotVersion;
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
type FulfilledHandler<T, R> = ((result: T) => R | PersistencePromise<R>) | null;
type RejectedHandler<R> = ((reason: Error) => R | PersistencePromise<R>) | null;
type Resolver<T> = (value?: T) => void;
type Rejector = (error: Error) => void;
/**
 * PersistencePromise is essentially a re-implementation of Promise except
 * it has a .next() method instead of .then() and .next() and .catch() callbacks
 * are executed synchronously when a PersistencePromise resolves rather than
 * asynchronously (Promise implementations use setImmediate() or similar).
 *
 * This is necessary to interoperate with IndexedDB which will automatically
 * commit transactions if control is returned to the event loop without
 * synchronously initiating another operation on the transaction.
 *
 * NOTE: .then() and .catch() only allow a single consumer, unlike normal
 * Promises.
 */
declare class PersistencePromise<T> {
    private nextCallback;
    private catchCallback;
    private result;
    private error;
    private isDone;
    private callbackAttached;
    constructor(callback: (resolve: Resolver<T>, reject: Rejector) => void);
    catch<R>(fn: (error: Error) => R | PersistencePromise<R>): PersistencePromise<R>;
    next<R>(nextFn?: FulfilledHandler<T, R>, catchFn?: RejectedHandler<R>): PersistencePromise<R>;
    toPromise(): Promise<T>;
    private wrapUserFunction;
    private wrapSuccess;
    private wrapFailure;
    static resolve(): PersistencePromise<void>;
    static resolve<R>(result: R): PersistencePromise<R>;
    static reject<R>(error: Error): PersistencePromise<R>;
    static waitFor(all: {
        forEach: (cb: (el: PersistencePromise<any>) => void) => void;
    }): PersistencePromise<void>;
    /**
     * Given an array of predicate functions that asynchronously evaluate to a
     * boolean, implements a short-circuiting `or` between the results. Predicates
     * will be evaluated until one of them returns `true`, then stop. The final
     * result will be whether any of them returned `true`.
     */
    static or(predicates: Array<() => PersistencePromise<boolean>>): PersistencePromise<boolean>;
    /**
     * Given an iterable, call the given function on each element in the
     * collection and wait for all of the resulting concurrent PersistencePromises
     * to resolve.
     */
    static forEach<R, S>(collection: {
        forEach: (cb: (r: R, s: S) => void) => void;
    }, f: ((r: R, s: S) => PersistencePromise<void>) | ((r: R) => PersistencePromise<void>)): PersistencePromise<void>;
    static forEach<R>(collection: {
        forEach: (cb: (r: R) => void) => void;
    }, f: (r: R) => PersistencePromise<void>): PersistencePromise<void>;
    /**
     * Concurrently map all array elements through asynchronous function.
     */
    static mapArray<T, U>(array: T[], f: (t: T) => PersistencePromise<U>): PersistencePromise<U[]>;
    /**
     * An alternative to recursive PersistencePromise calls, that avoids
     * potential memory problems from unbounded chains of promises.
     *
     * The `action` will be called repeatedly while `condition` is true.
     */
    static doWhile(condition: () => boolean, action: () => PersistencePromise<void>): PersistencePromise<void>;
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

/** The different modes supported by `Persistence.runTransaction()`. */
type PersistenceTransactionMode = 'readonly' | 'readwrite' | 'readwrite-primary';
/**
 * A base class representing a persistence transaction, encapsulating both the
 * transaction's sequence numbers as well as a list of onCommitted listeners.
 *
 * When you call Persistence.runTransaction(), it will create a transaction and
 * pass it to your callback. You then pass it to any method that operates
 * on persistence.
 */
declare abstract class PersistenceTransaction {
    private readonly onCommittedListeners;
    abstract readonly currentSequenceNumber: ListenSequenceNumber;
    addOnCommittedListener(listener: () => void): void;
    raiseOnCommittedEvent(): void;
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
 * Provides interfaces to save and read Firestore bundles.
 */
interface BundleCache {
    /**
     * Gets the saved `BundleMetadata` for a given `bundleId`, returns undefined
     * if no bundle metadata is found under the given id.
     */
    getBundleMetadata(transaction: PersistenceTransaction, bundleId: string): PersistencePromise<BundleMetadata | undefined>;
    /**
     * Saves a `BundleMetadata` from a bundle into local storage, using its id as
     * the persistent key.
     */
    saveBundleMetadata(transaction: PersistenceTransaction, metadata: BundleMetadata$1): PersistencePromise<void>;
    /**
     * Gets a saved `NamedQuery` for the given query name. Returns undefined if
     * no queries are found under the given name.
     */
    getNamedQuery(transaction: PersistenceTransaction, queryName: string): PersistencePromise<NamedQuery | undefined>;
    /**
     * Saves a `NamedQuery` from a bundle, using its name as the persistent key.
     */
    saveNamedQuery(transaction: PersistenceTransaction, query: NamedQuery$1): PersistencePromise<void>;
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
 * Provides methods to read and write document overlays.
 *
 * An overlay is a saved mutation, that gives a local view of a document when
 * applied to the remote version of the document.
 *
 * Each overlay stores the largest batch ID that is included in the overlay,
 * which allows us to remove the overlay once all batches leading up to it have
 * been acknowledged.
 */
interface DocumentOverlayCache {
    /**
     * Gets the saved overlay mutation for the given document key.
     * Returns null if there is no overlay for that key.
     */
    getOverlay(transaction: PersistenceTransaction, key: DocumentKey): PersistencePromise<Overlay | null>;
    /**
     * Gets the saved overlay mutation for the given document keys. Skips keys for
     * which there are no overlays.
     */
    getOverlays(transaction: PersistenceTransaction, keys: DocumentKey[]): PersistencePromise<OverlayMap>;
    /**
     * Saves the given document mutation map to persistence as overlays.
     * All overlays will have their largest batch id set to `largestBatchId`.
     */
    saveOverlays(transaction: PersistenceTransaction, largestBatchId: number, overlays: MutationMap): PersistencePromise<void>;
    /** Removes overlays for the given document keys and batch ID. */
    removeOverlaysForBatchId(transaction: PersistenceTransaction, documentKeys: DocumentKeySet, batchId: number): PersistencePromise<void>;
    /**
     * Returns all saved overlays for the given collection.
     *
     * @param transaction - The persistence transaction to use for this operation.
     * @param collection - The collection path to get the overlays for.
     * @param sinceBatchId - The minimum batch ID to filter by (exclusive).
     * Only overlays that contain a change past `sinceBatchId` are returned.
     * @returns Mapping of each document key in the collection to its overlay.
     */
    getOverlaysForCollection(transaction: PersistenceTransaction, collection: ResourcePath, sinceBatchId: number): PersistencePromise<OverlayMap>;
    /**
     * Returns `count` overlays with a batch ID higher than `sinceBatchId` for the
     * provided collection group, processed by ascending batch ID. The method
     * always returns all overlays for a batch even if the last batch contains
     * more documents than the remaining limit.
     *
     * @param transaction - The persistence transaction used for this operation.
     * @param collectionGroup - The collection group to get the overlays for.
     * @param sinceBatchId - The minimum batch ID to filter by (exclusive).
     * Only overlays that contain a change past `sinceBatchId` are returned.
     * @param count - The number of overlays to return. Can be exceeded if the last
     * batch contains more entries.
     * @returns Mapping of each document key in the collection group to its overlay.
     */
    getOverlaysForCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string, sinceBatchId: number, count: number): PersistencePromise<OverlayMap>;
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
 * General purpose cache for global values.
 *
 * Global state that cuts across components should be saved here. Following are contained herein:
 *
 * `sessionToken` tracks server interaction across Listen and Write streams. This facilitates cache
 * synchronization and invalidation.
 */
interface GlobalsCache {
    /**
     * Gets session token.
     */
    getSessionToken(transaction: PersistenceTransaction): PersistencePromise<ByteString>;
    /**
     * Sets session token.
     *
     * @param sessionToken - The new session token.
     */
    setSessionToken(transaction: PersistenceTransaction, sessionToken: ByteString): PersistencePromise<void>;
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

/** Represents the index state as it relates to a particular target. */
declare const enum IndexType {
    /** Indicates that no index could be found for serving the target. */
    NONE = 0,
    /**
     * Indicates that only a "partial index" could be found for serving the
     * target. A partial index is one which does not have a segment for every
     * filter/orderBy in the target.
     */
    PARTIAL = 1,
    /**
     * Indicates that a "full index" could be found for serving the target. A full
     * index is one which has a segment for every filter/orderBy in the target.
     */
    FULL = 2
}
/**
 * Represents a set of indexes that are used to execute queries efficiently.
 *
 * Currently the only index is a [collection id] =&gt; [parent path] index, used
 * to execute Collection Group queries.
 */
interface IndexManager {
    /**
     * Creates an index entry mapping the collectionId (last segment of the path)
     * to the parent path (either the containing document location or the empty
     * path for root-level collections). Index entries can be retrieved via
     * getCollectionParents().
     *
     * NOTE: Currently we don't remove index entries. If this ends up being an
     * issue we can devise some sort of GC strategy.
     */
    addToCollectionParentIndex(transaction: PersistenceTransaction, collectionPath: ResourcePath): PersistencePromise<void>;
    /**
     * Retrieves all parent locations containing the given collectionId, as a
     * list of paths (each path being either a document location or the empty
     * path for a root-level collection).
     */
    getCollectionParents(transaction: PersistenceTransaction, collectionId: string): PersistencePromise<ResourcePath[]>;
    /**
     * Adds a field path index.
     *
     * Values for this index are persisted via the index backfill, which runs
     * asynchronously in the background. Once the first values are written,
     * an index can be used to serve partial results for any matching queries.
     * Any unindexed portion of the database will continue to be served via
     * collection scons.
     */
    addFieldIndex(transaction: PersistenceTransaction, index: FieldIndex): PersistencePromise<void>;
    /** Removes the given field index and deletes all index values. */
    deleteFieldIndex(transaction: PersistenceTransaction, index: FieldIndex): PersistencePromise<void>;
    /** Removes all field indexes and deletes all index values. */
    deleteAllFieldIndexes(transaction: PersistenceTransaction): PersistencePromise<void>;
    /** Creates a full matched field index which serves the given target. */
    createTargetIndexes(transaction: PersistenceTransaction, target: Target): PersistencePromise<void>;
    /**
     * Returns a list of field indexes that correspond to the specified collection
     * group.
     *
     * @param collectionGroup - The collection group to get matching field indexes
     * for.
     * @returns A collection of field indexes for the specified collection group.
     */
    getFieldIndexes(transaction: PersistenceTransaction, collectionGroup: string): PersistencePromise<FieldIndex[]>;
    /** Returns all configured field indexes. */
    getFieldIndexes(transaction: PersistenceTransaction): PersistencePromise<FieldIndex[]>;
    /**
     * Returns the type of index (if any) that can be used to serve the given
     * target.
     */
    getIndexType(transaction: PersistenceTransaction, target: Target): PersistencePromise<IndexType>;
    /**
     * Returns the documents that match the given target based on the provided
     * index or `null` if the target does not have a matching index.
     */
    getDocumentsMatchingTarget(transaction: PersistenceTransaction, target: Target): PersistencePromise<DocumentKey[] | null>;
    /**
     * Returns the next collection group to update. Returns `null` if no group
     * exists.
     */
    getNextCollectionGroupToUpdate(transaction: PersistenceTransaction): PersistencePromise<string | null>;
    /**
     * Sets the collection group's latest read time.
     *
     * This method updates the index offset for all field indices for the
     * collection group and increments their sequence number. Subsequent calls to
     * `getNextCollectionGroupToUpdate()` will return a different collection group
     * (unless only one collection group is configured).
     */
    updateCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string, offset: IndexOffset): PersistencePromise<void>;
    /** Updates the index entries for the provided documents. */
    updateIndexEntries(transaction: PersistenceTransaction, documents: DocumentMap): PersistencePromise<void>;
    /**
     * Iterates over all field indexes that are used to serve the given target,
     * and returns the minimum offset of them all.
     */
    getMinOffset(transaction: PersistenceTransaction, target: Target): PersistencePromise<IndexOffset>;
    /** Returns the minimum offset for the given collection group. */
    getMinOffsetFromCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string): PersistencePromise<IndexOffset>;
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

/**
 * Describes a map whose keys are active target ids. We do not care about the type of the
 * values.
 */
type ActiveTargets = SortedMap<TargetId, unknown>;
declare class LruParams {
    readonly cacheSizeCollectionThreshold: number;
    readonly percentileToCollect: number;
    readonly maximumSequenceNumbersToCollect: number;
    private static readonly DEFAULT_COLLECTION_PERCENTILE;
    private static readonly DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT;
    static withCacheSize(cacheSize: number): LruParams;
    static readonly DEFAULT: LruParams;
    static readonly DISABLED: LruParams;
    constructor(cacheSizeCollectionThreshold: number, percentileToCollect: number, maximumSequenceNumbersToCollect: number);
}
interface LruGarbageCollector {
    readonly params: LruParams;
    collect(txn: PersistenceTransaction, activeTargetIds: ActiveTargets): PersistencePromise<LruResults>;
    /** Given a percentile of target to collect, returns the number of targets to collect. */
    calculateTargetCount(txn: PersistenceTransaction, percentile: number): PersistencePromise<number>;
    /** Returns the nth sequence number, counting in order from the smallest. */
    nthSequenceNumber(txn: PersistenceTransaction, n: number): PersistencePromise<number>;
    /**
     * Removes documents that have a sequence number equal to or less than the
     * upper bound and are not otherwise pinned.
     */
    removeOrphanedDocuments(txn: PersistenceTransaction, upperBound: ListenSequenceNumber): PersistencePromise<number>;
    getCacheSize(txn: PersistenceTransaction): PersistencePromise<number>;
    /**
     * Removes targets with a sequence number equal to or less than the given
     * upper bound, and removes document associations with those targets.
     */
    removeTargets(txn: PersistenceTransaction, upperBound: ListenSequenceNumber, activeTargetIds: ActiveTargets): PersistencePromise<number>;
}
/**
 * Describes the results of a garbage collection run. `didRun` will be set to
 * `false` if collection was skipped (either it is disabled or the cache size
 * has not hit the threshold). If collection ran, the other fields will be
 * filled in with the details of the results.
 */
interface LruResults {
    readonly didRun: boolean;
    readonly sequenceNumbersCollected: number;
    readonly targetsRemoved: number;
    readonly documentsRemoved: number;
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
 * A batch of mutations that will be sent as one unit to the backend.
 */
declare class MutationBatch {
    batchId: BatchId;
    localWriteTime: Timestamp$1;
    baseMutations: Mutation[];
    mutations: Mutation[];
    /**
     * @param batchId - The unique ID of this mutation batch.
     * @param localWriteTime - The original write time of this mutation.
     * @param baseMutations - Mutations that are used to populate the base
     * values when this mutation is applied locally. This can be used to locally
     * overwrite values that are persisted in the remote document cache. Base
     * mutations are never sent to the backend.
     * @param mutations - The user-provided mutations in this mutation batch.
     * User-provided mutations are applied both locally and remotely on the
     * backend.
     */
    constructor(batchId: BatchId, localWriteTime: Timestamp$1, baseMutations: Mutation[], mutations: Mutation[]);
    /**
     * Applies all the mutations in this MutationBatch to the specified document
     * to compute the state of the remote document
     *
     * @param document - The document to apply mutations to.
     * @param batchResult - The result of applying the MutationBatch to the
     * backend.
     */
    applyToRemoteDocument(document: MutableDocument, batchResult: MutationBatchResult): void;
    /**
     * Computes the local view of a document given all the mutations in this
     * batch.
     *
     * @param document - The document to apply mutations to.
     * @param mutatedFields - Fields that have been updated before applying this mutation batch.
     * @returns A `FieldMask` representing all the fields that are mutated.
     */
    applyToLocalView(document: MutableDocument, mutatedFields: FieldMask | null): FieldMask | null;
    /**
     * Computes the local view for all provided documents given the mutations in
     * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
     * replace all the mutation applications.
     */
    applyToLocalDocumentSet(documentMap: OverlayedDocumentMap, documentsWithoutRemoteVersion: DocumentKeySet): MutationMap;
    keys(): DocumentKeySet;
    isEqual(other: MutationBatch): boolean;
}
/** The result of applying a mutation batch to the backend. */
declare class MutationBatchResult {
    readonly batch: MutationBatch;
    readonly commitVersion: SnapshotVersion;
    readonly mutationResults: MutationResult[];
    /**
     * A pre-computed mapping from each mutated document to the resulting
     * version.
     */
    readonly docVersions: DocumentVersionMap;
    private constructor();
    /**
     * Creates a new MutationBatchResult for the given batch and results. There
     * must be one result for each mutation in the batch. This static factory
     * caches a document=&gt;version mapping (docVersions).
     */
    static from(batch: MutationBatch, commitVersion: SnapshotVersion, results: MutationResult[]): MutationBatchResult;
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

/** A queue of mutations to apply to the remote store. */
interface MutationQueue {
    /** Returns true if this queue contains no mutation batches. */
    checkEmpty(transaction: PersistenceTransaction): PersistencePromise<boolean>;
    /**
     * Creates a new mutation batch and adds it to this mutation queue.
     *
     * @param transaction - The transaction this operation is scoped to.
     * @param localWriteTime - The original write time of this mutation.
     * @param baseMutations - Mutations that are used to populate the base values
     * when this mutation is applied locally. These mutations are used to locally
     * overwrite values that are persisted in the remote document cache.
     * @param mutations - The user-provided mutations in this mutation batch.
     */
    addMutationBatch(transaction: PersistenceTransaction, localWriteTime: Timestamp$1, baseMutations: Mutation[], mutations: Mutation[]): PersistencePromise<MutationBatch>;
    /**
     * Loads the mutation batch with the given batchId.
     */
    lookupMutationBatch(transaction: PersistenceTransaction, batchId: BatchId): PersistencePromise<MutationBatch | null>;
    /**
     * Gets the first unacknowledged mutation batch after the passed in batchId
     * in the mutation queue or null if empty.
     *
     * @param batchId - The batch to search after, or BATCHID_UNKNOWN for the
     * first mutation in the queue.
     *
     * @returns the next mutation or null if there wasn't one.
     */
    getNextMutationBatchAfterBatchId(transaction: PersistenceTransaction, batchId: BatchId): PersistencePromise<MutationBatch | null>;
    /**
     * Gets the largest (latest) batch id in mutation queue for the current user
     * that is pending server response, returns `BATCHID_UNKNOWN` if the queue is
     * empty.
     *
     * @returns the largest batch id in the mutation queue that is not
     * acknowledged.
     */
    getHighestUnacknowledgedBatchId(transaction: PersistenceTransaction): PersistencePromise<BatchId>;
    /** Gets all mutation batches in the mutation queue. */
    getAllMutationBatches(transaction: PersistenceTransaction): PersistencePromise<MutationBatch[]>;
    /**
     * Finds all mutation batches that could possibly affect the given
     * document key. Not all mutations in a batch will necessarily affect the
     * document key, so when looping through the batch you'll need to check that
     * the mutation itself matches the key.
     *
     * Batches are guaranteed to be in sorted order.
     *
     * Note that because of this requirement implementations are free to return
     * mutation batches that don't contain the document key at all if it's
     * convenient.
     */
    getAllMutationBatchesAffectingDocumentKey(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<MutationBatch[]>;
    /**
     * Finds all mutation batches that could possibly affect the given set of
     * document keys. Not all mutations in a batch will necessarily affect each
     * key, so when looping through the batch you'll need to check that the
     * mutation itself matches the key.
     *
     * Batches are guaranteed to be in sorted order.
     *
     * Note that because of this requirement implementations are free to return
     * mutation batches that don't contain any of the document keys at all if it's
     * convenient.
     */
    getAllMutationBatchesAffectingDocumentKeys(transaction: PersistenceTransaction, documentKeys: SortedMap<DocumentKey, unknown>): PersistencePromise<MutationBatch[]>;
    /**
     * Finds all mutation batches that could affect the results for the given
     * query. Not all mutations in a batch will necessarily affect the query, so
     * when looping through the batch you'll need to check that the mutation
     * itself matches the query.
     *
     * Batches are guaranteed to be in sorted order.
     *
     * Note that because of this requirement implementations are free to return
     * mutation batches that don't match the query at all if it's convenient.
     *
     * NOTE: A PatchMutation does not need to include all fields in the query
     * filter criteria in order to be a match (but any fields it does contain do
     * need to match).
     */
    getAllMutationBatchesAffectingQuery(transaction: PersistenceTransaction, query: Query$1): PersistencePromise<MutationBatch[]>;
    /**
     * Removes the given mutation batch from the queue. This is useful in two
     * circumstances:
     *
     * + Removing an applied mutation from the head of the queue
     * + Removing a rejected mutation from anywhere in the queue
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    removeMutationBatch(transaction: PersistenceTransaction, batch: MutationBatch): PersistencePromise<void>;
    /**
     * Performs a consistency check, examining the mutation queue for any
     * leaks, if possible.
     */
    performConsistencyCheck(transaction: PersistenceTransaction): PersistencePromise<void>;
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
 * A tracker to keep a record of important details during database local query
 * execution.
 */
declare class QueryContext {
    /**
     * Counts the number of documents passed through during local query execution.
     */
    private _documentReadCount;
    get documentReadCount(): number;
    incrementDocumentReadCount(amount: number): void;
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
 * An in-memory buffer of entries to be written to a RemoteDocumentCache.
 * It can be used to batch up a set of changes to be written to the cache, but
 * additionally supports reading entries back with the `getEntry()` method,
 * falling back to the underlying RemoteDocumentCache if no entry is
 * buffered.
 *
 * Entries added to the cache *must* be read first. This is to facilitate
 * calculating the size delta of the pending changes.
 *
 * PORTING NOTE: This class was implemented then removed from other platforms.
 * If byte-counting ends up being needed on the other platforms, consider
 * porting this class as part of that implementation work.
 */
declare abstract class RemoteDocumentChangeBuffer {
    protected changes: ObjectMap<DocumentKey, MutableDocument>;
    private changesApplied;
    protected abstract getFromCache(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<MutableDocument>;
    protected abstract getAllFromCache(transaction: PersistenceTransaction, documentKeys: DocumentKeySet): PersistencePromise<MutableDocumentMap>;
    protected abstract applyChanges(transaction: PersistenceTransaction): PersistencePromise<void>;
    /**
     * Buffers a `RemoteDocumentCache.addEntry()` call.
     *
     * You can only modify documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */
    addEntry(document: MutableDocument): void;
    /**
     * Buffers a `RemoteDocumentCache.removeEntry()` call.
     *
     * You can only remove documents that have already been retrieved via
     * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
     */
    removeEntry(key: DocumentKey, readTime: SnapshotVersion): void;
    /**
     * Looks up an entry in the cache. The buffered changes will first be checked,
     * and if no buffered change applies, this will forward to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKey - The key of the entry to look up.
     * @returns The cached document or an invalid document if we have nothing
     * cached.
     */
    getEntry(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<MutableDocument>;
    /**
     * Looks up several entries in the cache, forwarding to
     * `RemoteDocumentCache.getEntry()`.
     *
     * @param transaction - The transaction in which to perform any persistence
     *     operations.
     * @param documentKeys - The keys of the entries to look up.
     * @returns A map of cached documents, indexed by key. If an entry cannot be
     *     found, the corresponding key will be mapped to an invalid document.
     */
    getEntries(transaction: PersistenceTransaction, documentKeys: DocumentKeySet): PersistencePromise<MutableDocumentMap>;
    /**
     * Applies buffered changes to the underlying RemoteDocumentCache, using
     * the provided transaction.
     */
    apply(transaction: PersistenceTransaction): PersistencePromise<void>;
    /** Helper to assert this.changes is not null  */
    protected assertNotApplied(): void;
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
 * Represents cached documents received from the remote backend.
 *
 * The cache is keyed by DocumentKey and entries in the cache are
 * MutableDocuments, meaning we can cache both actual documents as well as
 * documents that are known to not exist.
 */
interface RemoteDocumentCache {
    /** Sets the index manager to use for managing the collectionGroup index. */
    setIndexManager(indexManager: IndexManager): void;
    /**
     * Looks up an entry in the cache.
     *
     * @param documentKey - The key of the entry to look up.*
     * @returns The cached document entry. Returns an invalid document if the
     * document is not cached.
     */
    getEntry(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<MutableDocument>;
    /**
     * Looks up a set of entries in the cache.
     *
     * @param documentKeys - The keys of the entries to look up.
     * @returns The cached document entries indexed by key. If an entry is not
     * cached, the corresponding key will be mapped to an invalid document.
     */
    getEntries(transaction: PersistenceTransaction, documentKeys: DocumentKeySet): PersistencePromise<MutableDocumentMap>;
    /**
     * Returns the documents matching the given query
     *
     * @param query - The query to match documents against.
     * @param offset - The offset to start the scan at (exclusive).
     * @param context - A optional tracker to keep a record of important details
     *   during database local query execution.
     * @returns The set of matching documents.
     */
    getDocumentsMatchingQuery(transaction: PersistenceTransaction, query: Query$1, offset: IndexOffset, mutatedDocs: OverlayMap, context?: QueryContext): PersistencePromise<MutableDocumentMap>;
    /**
     * Looks up the next `limit` documents for a collection group based on the
     * provided offset. The ordering is based on the document's read time and key.
     *
     * @param collectionGroup - The collection group to scan.
     * @param offset - The offset to start the scan at (exclusive).
     * @param limit - The maximum number of results to return.
     * @returns The set of matching documents.
     */
    getAllFromCollectionGroup(transaction: PersistenceTransaction, collectionGroup: string, offset: IndexOffset, limit: number): PersistencePromise<MutableDocumentMap>;
    /**
     * Provides access to add or update the contents of the cache. The buffer
     * handles proper size accounting for the change.
     *
     * Multi-Tab Note: This should only be called by the primary client.
     *
     * @param options - Specify `trackRemovals` to create sentinel entries for
     * removed documents, which allows removals to be tracked by
     * `getNewDocumentChanges()`.
     */
    newChangeBuffer(options?: {
        trackRemovals: boolean;
    }): RemoteDocumentChangeBuffer;
    /**
     * Get an estimate of the size of the document cache. Note that for eager
     * garbage collection, we don't track sizes so this will return 0.
     */
    getSize(transaction: PersistenceTransaction): PersistencePromise<number>;
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
 * Represents cached targets received from the remote backend.
 *
 * The cache is keyed by `Target` and entries in the cache are `TargetData`
 * instances.
 */
interface TargetCache {
    /**
     * A global snapshot version representing the last consistent snapshot we
     * received from the backend. This is monotonically increasing and any
     * snapshots received from the backend prior to this version (e.g. for targets
     * resumed with a resume_token) should be suppressed (buffered) until the
     * backend has caught up to this snapshot version again. This prevents our
     * cache from ever going backwards in time.
     *
     * This is updated whenever our we get a TargetChange with a read_time and
     * empty target_ids.
     */
    getLastRemoteSnapshotVersion(transaction: PersistenceTransaction): PersistencePromise<SnapshotVersion>;
    /**
     * @returns The highest sequence number observed, including any that might be
     *         persisted on-disk.
     */
    getHighestSequenceNumber(transaction: PersistenceTransaction): PersistencePromise<ListenSequenceNumber>;
    /**
     * Call provided function with each `TargetData` that we have cached.
     */
    forEachTarget(txn: PersistenceTransaction, f: (q: TargetData) => void): PersistencePromise<void>;
    /**
     * Set the highest listen sequence number and optionally updates the
     * snapshot version of the last consistent snapshot received from the backend
     * (see getLastRemoteSnapshotVersion() for more details).
     *
     * @param highestListenSequenceNumber - The new maximum listen sequence number.
     * @param lastRemoteSnapshotVersion - The new snapshot version. Optional.
     */
    setTargetsMetadata(transaction: PersistenceTransaction, highestListenSequenceNumber: number, lastRemoteSnapshotVersion?: SnapshotVersion): PersistencePromise<void>;
    /**
     * Adds an entry in the cache.
     *
     * The cache key is extracted from `targetData.target`. The key must not already
     * exist in the cache.
     *
     * @param targetData - A TargetData instance to put in the cache.
     */
    addTargetData(transaction: PersistenceTransaction, targetData: TargetData): PersistencePromise<void>;
    /**
     * Updates an entry in the cache.
     *
     * The cache key is extracted from `targetData.target`. The entry must already
     * exist in the cache, and it will be replaced.
     * @param targetData - The TargetData to be replaced into the cache.
     */
    updateTargetData(transaction: PersistenceTransaction, targetData: TargetData): PersistencePromise<void>;
    /**
     * Removes the cached entry for the given target data. It is an error to remove
     * a target data that does not exist.
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    removeTargetData(transaction: PersistenceTransaction, targetData: TargetData): PersistencePromise<void>;
    /**
     * The number of targets currently in the cache.
     */
    getTargetCount(transaction: PersistenceTransaction): PersistencePromise<number>;
    /**
     * Looks up a TargetData entry by target.
     *
     * @param target - The query target corresponding to the entry to look up.
     * @returns The cached TargetData entry, or null if the cache has no entry for
     * the target.
     */
    getTargetData(transaction: PersistenceTransaction, target: Target): PersistencePromise<TargetData | null>;
    /**
     * Adds the given document keys to cached query results of the given target
     * ID.
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    addMatchingKeys(transaction: PersistenceTransaction, keys: DocumentKeySet, targetId: TargetId): PersistencePromise<void>;
    /**
     * Removes the given document keys from the cached query results of the
     * given target ID.
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    removeMatchingKeys(transaction: PersistenceTransaction, keys: DocumentKeySet, targetId: TargetId): PersistencePromise<void>;
    /**
     * Removes all the keys in the query results of the given target ID.
     *
     * Multi-Tab Note: This operation should only be called by the primary client.
     */
    removeMatchingKeysForTargetId(transaction: PersistenceTransaction, targetId: TargetId): PersistencePromise<void>;
    /**
     * Returns the document keys that match the provided target ID.
     */
    getMatchingKeysForTargetId(transaction: PersistenceTransaction, targetId: TargetId): PersistencePromise<DocumentKeySet>;
    /**
     * Returns a new target ID that is higher than any query in the cache. If
     * there are no queries in the cache, returns the first valid target ID.
     * Allocated target IDs are persisted and `allocateTargetId()` will never
     * return the same ID twice.
     */
    allocateTargetId(transaction: PersistenceTransaction): PersistencePromise<TargetId>;
    containsKey(transaction: PersistenceTransaction, key: DocumentKey): PersistencePromise<boolean>;
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
 * A ReferenceDelegate instance handles all of the hooks into the document-reference lifecycle. This
 * includes being added to a target, being removed from a target, being subject to mutation, and
 * being mutated by the user.
 *
 * Different implementations may do different things with each of these events. Not every
 * implementation needs to do something with every lifecycle hook.
 *
 * PORTING NOTE: since sequence numbers are attached to transactions in this
 * client, the ReferenceDelegate does not need to deal in transactional
 * semantics (onTransactionStarted/Committed()), nor does it need to track and
 * generate sequence numbers (getCurrentSequenceNumber()).
 */
interface ReferenceDelegate {
    /** Notify the delegate that the given document was added to a target. */
    addReference(txn: PersistenceTransaction, targetId: TargetId, doc: DocumentKey): PersistencePromise<void>;
    /** Notify the delegate that the given document was removed from a target. */
    removeReference(txn: PersistenceTransaction, targetId: TargetId, doc: DocumentKey): PersistencePromise<void>;
    /**
     * Notify the delegate that a target was removed. The delegate may, but is not obligated to,
     * actually delete the target and associated data.
     */
    removeTarget(txn: PersistenceTransaction, targetData: TargetData): PersistencePromise<void>;
    /**
     * Notify the delegate that a document may no longer be part of any views or
     * have any mutations associated.
     */
    markPotentiallyOrphaned(txn: PersistenceTransaction, doc: DocumentKey): PersistencePromise<void>;
    /** Notify the delegate that a limbo document was updated. */
    updateLimboDocument(txn: PersistenceTransaction, doc: DocumentKey): PersistencePromise<void>;
}
/**
 * Persistence is the lowest-level shared interface to persistent storage in
 * Firestore.
 *
 * Persistence is used to create MutationQueue and RemoteDocumentCache
 * instances backed by persistence (which might be in-memory or LevelDB).
 *
 * Persistence also exposes an API to create and run PersistenceTransactions
 * against persistence. All read / write operations must be wrapped in a
 * transaction. Implementations of PersistenceTransaction / Persistence only
 * need to guarantee that writes made against the transaction are not made to
 * durable storage until the transaction resolves its PersistencePromise.
 * Since memory-only storage components do not alter durable storage, they are
 * free to ignore the transaction.
 *
 * This contract is enough to allow the LocalStore be be written
 * independently of whether or not the stored state actually is durably
 * persisted. If persistent storage is enabled, writes are grouped together to
 * avoid inconsistent state that could cause crashes.
 *
 * Concretely, when persistent storage is enabled, the persistent versions of
 * MutationQueue, RemoteDocumentCache, and others (the mutators) will
 * defer their writes into a transaction. Once the local store has completed
 * one logical operation, it commits the transaction.
 *
 * When persistent storage is disabled, the non-persistent versions of the
 * mutators ignore the transaction. This short-cut is allowed because
 * memory-only storage leaves no state so it cannot be inconsistent.
 *
 * This simplifies the implementations of the mutators and allows memory-only
 * implementations to supplement the persistent ones without requiring any
 * special dual-store implementation of Persistence. The cost is that the
 * LocalStore needs to be slightly careful about the order of its reads and
 * writes in order to avoid relying on being able to read back uncommitted
 * writes.
 */
interface Persistence {
    /**
     * Whether or not this persistence instance has been started.
     */
    readonly started: boolean;
    readonly referenceDelegate: ReferenceDelegate;
    /** Starts persistence. */
    start(): Promise<void>;
    /**
     * Releases any resources held during eager shutdown.
     */
    shutdown(): Promise<void>;
    /**
     * Registers a listener that gets called when the database receives a
     * version change event indicating that it has deleted.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */
    setDatabaseDeletedListener(databaseDeletedListener: () => Promise<void>): void;
    /**
     * Adjusts the current network state in the client's metadata, potentially
     * affecting the primary lease.
     *
     * PORTING NOTE: This is only used for Web multi-tab.
     */
    setNetworkEnabled(networkEnabled: boolean): void;
    /**
     * Returns GlobalCache representing a general purpose cache for global values.
     */
    getGlobalsCache(): GlobalsCache;
    /**
     * Returns a MutationQueue representing the persisted mutations for the
     * given user.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called for a given user. In particular, the memory-backed
     * implementation does this to emulate the persisted implementation to the
     * extent possible (e.g. in the case of uid switching from
     * sally=&gt;jack=&gt;sally, sally's mutation queue will be preserved).
     */
    getMutationQueue(user: User, indexManager: IndexManager): MutationQueue;
    /**
     * Returns a TargetCache representing the persisted cache of targets.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called. In particular, the memory-backed implementation does this
     * to emulate the persisted implementation to the extent possible.
     */
    getTargetCache(): TargetCache;
    /**
     * Returns a RemoteDocumentCache representing the persisted cache of remote
     * documents.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called. In particular, the memory-backed implementation does this
     * to emulate the persisted implementation to the extent possible.
     */
    getRemoteDocumentCache(): RemoteDocumentCache;
    /**
     * Returns a BundleCache representing the persisted cache of loaded bundles.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called. In particular, the memory-backed implementation does this
     * to emulate the persisted implementation to the extent possible.
     */
    getBundleCache(): BundleCache;
    /**
     * Returns an IndexManager instance that manages our persisted query indexes.
     *
     * Note: The implementation is free to return the same instance every time
     * this is called. In particular, the memory-backed implementation does this
     * to emulate the persisted implementation to the extent possible.
     */
    getIndexManager(user: User): IndexManager;
    /**
     * Returns a DocumentOverlayCache representing the documents that are mutated
     * locally.
     */
    getDocumentOverlayCache(user: User): DocumentOverlayCache;
    /**
     * Performs an operation inside a persistence transaction. Any reads or writes
     * against persistence must be performed within a transaction. Writes will be
     * committed atomically once the transaction completes.
     *
     * Persistence operations are asynchronous and therefore the provided
     * transactionOperation must return a PersistencePromise. When it is resolved,
     * the transaction will be committed and the Promise returned by this method
     * will resolve.
     *
     * @param action - A description of the action performed by this transaction,
     * used for logging.
     * @param mode - The underlying mode of the IndexedDb transaction. Can be
     * 'readonly', 'readwrite' or 'readwrite-primary'. Transactions marked
     * 'readwrite-primary' can only be executed by the primary client. In this
     * mode, the transactionOperation will not be run if the primary lease cannot
     * be acquired and the returned promise will be rejected with a
     * FAILED_PRECONDITION error.
     * @param transactionOperation - The operation to run inside a transaction.
     * @returns A `Promise` that is resolved once the transaction completes.
     */
    runTransaction<T>(action: string, mode: PersistenceTransactionMode, transactionOperation: (transaction: PersistenceTransaction) => PersistencePromise<T>): Promise<T>;
}
/**
 * Interface to schedule periodic tasks within SDK.
 */
interface Scheduler {
    readonly started: boolean;
    start(): void;
    stop(): void;
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

/** The different states of a watch target. */
type QueryTargetState = 'not-current' | 'current' | 'rejected';

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

/**
 * A randomly-generated key assigned to each Firestore instance at startup.
 */
type ClientId = string;
/**
 * A `SharedClientState` keeps track of the global state of the mutations
 * and query targets for all active clients with the same persistence key (i.e.
 * project ID and FirebaseApp name). It relays local changes to other clients
 * and updates its local state as new state is observed.
 *
 * `SharedClientState` is primarily used for synchronization in Multi-Tab
 * environments. Each tab is responsible for registering its active query
 * targets and mutations. `SharedClientState` will then notify the listener
 * assigned to `.syncEngine` for updates to mutations and queries that
 * originated in other clients.
 *
 * To receive notifications, `.syncEngine` and `.onlineStateHandler` has to be
 * assigned before calling `start()`.
 */
interface SharedClientState {
    onlineStateHandler: ((onlineState: OnlineState) => void) | null;
    sequenceNumberHandler: ((sequenceNumber: ListenSequenceNumber) => void) | null;
    /** Registers the Mutation Batch ID of a newly pending mutation. */
    addPendingMutation(batchId: BatchId): void;
    /**
     * Records that a pending mutation has been acknowledged or rejected.
     * Called by the primary client to notify secondary clients of mutation
     * results as they come back from the backend.
     */
    updateMutationState(batchId: BatchId, state: 'acknowledged' | 'rejected', error?: FirestoreError): void;
    /**
     * Associates a new Query Target ID with the local Firestore client. Returns
     * the new query state for the query (which can be 'current' if the query is
     * already associated with another tab).
     *
     * If the target id is already associated with local client, the method simply
     * returns its `QueryTargetState`.
     */
    addLocalQueryTarget(targetId: TargetId, addToActiveTargetIds?: boolean): QueryTargetState;
    /** Removes the Query Target ID association from the local client. */
    removeLocalQueryTarget(targetId: TargetId): void;
    /** Checks whether the target is associated with the local client. */
    isLocalQueryTarget(targetId: TargetId): boolean;
    /**
     * Processes an update to a query target.
     *
     * Called by the primary client to notify secondary clients of document
     * changes or state transitions that affect the provided query target.
     */
    updateQueryState(targetId: TargetId, state: QueryTargetState, error?: FirestoreError): void;
    /**
     * Removes the target's metadata entry.
     *
     * Called by the primary client when all clients stopped listening to a query
     * target.
     */
    clearQueryState(targetId: TargetId): void;
    /**
     * Gets the active Query Targets IDs for all active clients.
     *
     * The implementation for this may require O(n) runtime, where 'n' is the size
     * of the result set.
     */
    getAllActiveQueryTargets(): SortedSet<TargetId>;
    /**
     * Checks whether the provided target ID is currently being listened to by
     * any of the active clients.
     *
     * The implementation may require O(n*log m) runtime, where 'n' is the number
     * of clients and 'm' the number of targets.
     */
    isActiveQueryTarget(targetId: TargetId): boolean;
    /**
     * Starts the SharedClientState, reads existing client data and registers
     * listeners for updates to new and existing clients.
     */
    start(): Promise<void>;
    /** Shuts down the `SharedClientState` and its listeners. */
    shutdown(): void;
    /**
     * Changes the active user and removes all existing user-specific data. The
     * user change does not call back into SyncEngine (for example, no mutations
     * will be marked as removed).
     */
    handleUserChange(user: User, removedBatchIds: BatchId[], addedBatchIds: BatchId[]): void;
    /** Changes the shared online state of all clients. */
    setOnlineState(onlineState: OnlineState): void;
    writeSequenceNumber(sequenceNumber: ListenSequenceNumber): void;
    /**
     * Notifies other clients when remote documents have changed due to loading
     * a bundle.
     *
     * @param collectionGroups - The collection groups affected by this bundle.
     */
    notifyBundleLoaded(collectionGroups: Set<string>): void;
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

type DocumentComparator = (doc1: Document, doc2: Document) => number;

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
 * DocumentSet is an immutable (copy-on-write) collection that holds documents
 * in order specified by the provided comparator. We always add a document key
 * comparator on top of what is provided to guarantee document equality based on
 * the key.
 */
declare class DocumentSet {
    /**
     * Returns an empty copy of the existing DocumentSet, using the same
     * comparator.
     */
    static emptySet(oldSet: DocumentSet): DocumentSet;
    private comparator;
    private keyedMap;
    private sortedSet;
    /** The default ordering is by key if the comparator is omitted */
    constructor(comp?: DocumentComparator);
    has(key: DocumentKey): boolean;
    get(key: DocumentKey): Document | null;
    first(): Document | null;
    last(): Document | null;
    isEmpty(): boolean;
    /**
     * Returns the index of the provided key in the document set, or -1 if the
     * document key is not present in the set;
     */
    indexOf(key: DocumentKey): number;
    get size(): number;
    /** Iterates documents in order defined by "comparator" */
    forEach(cb: (doc: Document) => void): void;
    /** Inserts or updates a document with the same key */
    add(doc: Document): DocumentSet;
    /** Deletes a document with a given key */
    delete(key: DocumentKey): DocumentSet;
    isEqual(other: DocumentSet | null | undefined): boolean;
    toString(): string;
    private copy;
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

declare const enum ChangeType {
    Added = 0,
    Removed = 1,
    Modified = 2,
    Metadata = 3
}
interface DocumentViewChange {
    type: ChangeType;
    doc: Document;
}
declare class ViewSnapshot {
    readonly query: Query$1;
    readonly docs: DocumentSet;
    readonly oldDocs: DocumentSet;
    readonly docChanges: DocumentViewChange[];
    readonly mutatedKeys: DocumentKeySet;
    readonly fromCache: boolean;
    readonly syncStateChanged: boolean;
    readonly excludesMetadataChanges: boolean;
    readonly hasCachedResults: boolean;
    constructor(query: Query$1, docs: DocumentSet, oldDocs: DocumentSet, docChanges: DocumentViewChange[], mutatedKeys: DocumentKeySet, fromCache: boolean, syncStateChanged: boolean, excludesMetadataChanges: boolean, hasCachedResults: boolean);
    /** Returns a view snapshot as if all documents in the snapshot were added. */
    static fromInitialDocuments(query: Query$1, documents: DocumentSet, mutatedKeys: DocumentKeySet, fromCache: boolean, hasCachedResults: boolean): ViewSnapshot;
    get hasPendingWrites(): boolean;
    isEqual(other: ViewSnapshot): boolean;
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

/** The result of a write to the local store. */
interface LocalWriteResult {
    batchId: BatchId;
    changes: DocumentMap;
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
 * A readonly view of the local state of all documents we're tracking (i.e. we
 * have a cached version in remoteDocumentCache or local mutations for the
 * document). The view is computed by applying the mutations in the
 * MutationQueue to the RemoteDocumentCache.
 */
declare class LocalDocumentsView {
    readonly remoteDocumentCache: RemoteDocumentCache;
    readonly mutationQueue: MutationQueue;
    readonly documentOverlayCache: DocumentOverlayCache;
    readonly indexManager: IndexManager;
    constructor(remoteDocumentCache: RemoteDocumentCache, mutationQueue: MutationQueue, documentOverlayCache: DocumentOverlayCache, indexManager: IndexManager);
    /**
     * Get the local view of the document identified by `key`.
     *
     * @returns Local view of the document or null if we don't have any cached
     * state for it.
     */
    getDocument(transaction: PersistenceTransaction, key: DocumentKey): PersistencePromise<Document>;
    /**
     * Gets the local view of the documents identified by `keys`.
     *
     * If we don't have cached state for a document in `keys`, a NoDocument will
     * be stored for that key in the resulting set.
     */
    getDocuments(transaction: PersistenceTransaction, keys: DocumentKeySet): PersistencePromise<DocumentMap>;
    /**
     * Similar to `getDocuments`, but creates the local view from the given
     * `baseDocs` without retrieving documents from the local store.
     *
     * @param transaction - The transaction this operation is scoped to.
     * @param docs - The documents to apply local mutations to get the local views.
     * @param existenceStateChanged - The set of document keys whose existence state
     *   is changed. This is useful to determine if some documents overlay needs
     *   to be recalculated.
     */
    getLocalViewOfDocuments(transaction: PersistenceTransaction, docs: MutableDocumentMap, existenceStateChanged?: DocumentKeySet): PersistencePromise<DocumentMap>;
    /**
     * Gets the overlayed documents for the given document map, which will include
     * the local view of those documents and a `FieldMask` indicating which fields
     * are mutated locally, `null` if overlay is a Set or Delete mutation.
     */
    getOverlayedDocuments(transaction: PersistenceTransaction, docs: MutableDocumentMap): PersistencePromise<OverlayedDocumentMap>;
    /**
     * Fetches the overlays for {@code docs} and adds them to provided overlay map
     * if the map does not already contain an entry for the given document key.
     */
    private populateOverlays;
    /**
     * Computes the local view for the given documents.
     *
     * @param docs - The documents to compute views for. It also has the base
     *   version of the documents.
     * @param overlays - The overlays that need to be applied to the given base
     *   version of the documents.
     * @param existenceStateChanged - A set of documents whose existence states
     *   might have changed. This is used to determine if we need to re-calculate
     *   overlays from mutation queues.
     * @returns A map represents the local documents view.
     */
    computeViews(transaction: PersistenceTransaction, docs: MutableDocumentMap, overlays: OverlayMap, existenceStateChanged: DocumentKeySet): PersistencePromise<OverlayedDocumentMap>;
    private recalculateAndSaveOverlays;
    /**
     * Recalculates overlays by reading the documents from remote document cache
     * first, and saves them after they are calculated.
     */
    recalculateAndSaveOverlaysForDocumentKeys(transaction: PersistenceTransaction, documentKeys: DocumentKeySet): PersistencePromise<DocumentKeyMap<FieldMask | null>>;
    /**
     * Performs a query against the local view of all documents.
     *
     * @param transaction - The persistence transaction.
     * @param query - The query to match documents against.
     * @param offset - Read time and key to start scanning by (exclusive).
     * @param context - A optional tracker to keep a record of important details
     *   during database local query execution.
     */
    getDocumentsMatchingQuery(transaction: PersistenceTransaction, query: Query$1, offset: IndexOffset, context?: QueryContext): PersistencePromise<DocumentMap>;
    /**
     * Given a collection group, returns the next documents that follow the provided offset, along
     * with an updated batch ID.
     *
     * <p>The documents returned by this method are ordered by remote version from the provided
     * offset. If there are no more remote documents after the provided offset, documents with
     * mutations in order of batch id from the offset are returned. Since all documents in a batch are
     * returned together, the total number of documents returned can exceed {@code count}.
     *
     * @param transaction
     * @param collectionGroup - The collection group for the documents.
     * @param offset - The offset to index into.
     * @param count - The number of documents to return
     * @returns A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
     */
    getNextDocuments(transaction: PersistenceTransaction, collectionGroup: string, offset: IndexOffset, count: number): PersistencePromise<LocalWriteResult>;
    private getDocumentsMatchingDocumentQuery;
    private getDocumentsMatchingCollectionGroupQuery;
    private getDocumentsMatchingCollectionQuery;
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

interface LocalStore {
    collectGarbage(garbageCollector: LruGarbageCollector): Promise<LruResults>;
    /** Manages the list of active field and collection indices. */
    indexManager: IndexManager;
    /**
     * The "local" view of all documents (layering mutationQueue on top of
     * remoteDocumentCache).
     */
    localDocuments: LocalDocumentsView;
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
 * An interface that describes the actions the RemoteStore needs to perform on
 * a cooperating synchronization engine.
 */
interface RemoteSyncer {
    /**
     * Applies one remote event to the sync engine, notifying any views of the
     * changes, and releasing any pending mutation batches that would become
     * visible because of the snapshot version the remote event contains.
     */
    applyRemoteEvent?(remoteEvent: RemoteEvent): Promise<void>;
    /**
     * Rejects the listen for the given targetID. This can be triggered by the
     * backend for any active target.
     *
     * @param targetId - The targetID corresponds to one previously initiated by
     * the user as part of TargetData passed to listen() on RemoteStore.
     * @param error - A description of the condition that has forced the rejection.
     * Nearly always this will be an indication that the user is no longer
     * authorized to see the data matching the target.
     */
    rejectListen?(targetId: TargetId, error: FirestoreError): Promise<void>;
    /**
     * Applies the result of a successful write of a mutation batch to the sync
     * engine, emitting snapshots in any views that the mutation applies to, and
     * removing the batch from the mutation queue.
     */
    applySuccessfulWrite?(result: MutationBatchResult): Promise<void>;
    /**
     * Rejects the batch, removing the batch from the mutation queue, recomputing
     * the local view of any documents affected by the batch and then, emitting
     * snapshots with the reverted value.
     */
    rejectFailedWrite?(batchId: BatchId, error: FirestoreError): Promise<void>;
    /**
     * Returns the set of remote document keys for the given target ID. This list
     * includes the documents that were assigned to the target when we received
     * the last snapshot.
     */
    getRemoteKeysForTarget?(targetId: TargetId): DocumentKeySet;
    /**
     * Updates all local state to match the pending mutations for the given user.
     * May be called repeatedly for the same user.
     */
    handleCredentialChange?(user: User): Promise<void>;
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
 * RemoteStore - An interface to remotely stored data, basically providing a
 * wrapper around the Datastore that is more reliable for the rest of the
 * system.
 *
 * RemoteStore is responsible for maintaining the connection to the server.
 * - maintaining a list of active listens.
 * - reconnecting when the connection is dropped.
 * - resuming all the active listens on reconnect.
 *
 * RemoteStore handles all incoming events from the Datastore.
 * - listening to the watch stream and repackaging the events as RemoteEvents
 * - notifying SyncEngine of any changes to the active listens.
 *
 * RemoteStore takes writes from other components and handles them reliably.
 * - pulling pending mutations from LocalStore and sending them to Datastore.
 * - retrying mutations that failed because of network problems.
 * - acking mutations to the SyncEngine once they are accepted or rejected.
 */
interface RemoteStore {
    /**
     * SyncEngine to notify of watch and write events. This must be set
     * immediately after construction.
     */
    remoteSyncer: RemoteSyncer;
}

/**
 * A utility class for generating unique alphanumeric IDs of a specified length.
 *
 * @internal
 * Exported internally for testing purposes.
 */
declare class AutoId {
    static newId(): string;
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
 * EventManager is responsible for mapping queries to query event emitters.
 * It handles "fan-out". -- Identical queries will re-use the same watch on the
 * backend.
 *
 * PORTING NOTE: On Web, EventManager `onListen` and `onUnlisten` need to be
 * assigned to SyncEngine's `listen()` and `unlisten()` API before usage. This
 * allows users to tree-shake the Watch logic.
 */
interface EventManager {
    onListen?: (query: Query$1, enableRemoteListen: boolean) => Promise<ViewSnapshot>;
    onUnlisten?: (query: Query$1, disableRemoteListen: boolean) => Promise<void>;
    onFirstRemoteStoreListen?: (query: Query$1) => Promise<void>;
    onLastRemoteStoreUnlisten?: (query: Query$1) => Promise<void>;
    terminate(): void;
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
 * SyncEngine is the central controller in the client SDK architecture. It is
 * the glue code between the EventManager, LocalStore, and RemoteStore. Some of
 * SyncEngine's responsibilities include:
 * 1. Coordinating client requests and remote events between the EventManager
 *    and the local and remote data stores.
 * 2. Managing a View object for each query, providing the unified view between
 *    the local and remote data stores.
 * 3. Notifying the RemoteStore when the LocalStore has new mutations in its
 *    queue that need sending to the backend.
 *
 * The SyncEngine’s methods should only ever be called by methods running in the
 * global async queue.
 *
 * PORTING NOTE: On Web, SyncEngine does not have an explicit subscribe()
 * function. Instead, it directly depends on EventManager's tree-shakeable API
 * (via `ensureWatchStream()`).
 */
interface SyncEngine {
    isPrimaryClient: boolean;
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

type Kind = 'memory' | 'persistent';
interface ComponentConfiguration {
    asyncQueue: AsyncQueue;
    databaseInfo: DatabaseInfo;
    authCredentials: CredentialsProvider<User>;
    appCheckCredentials: CredentialsProvider<string>;
    clientId: ClientId;
    initialUser: User;
    maxConcurrentLimboResolutions: number;
}
interface OfflineComponentProviderFactory {
    build(onlineComponents: OnlineComponentProvider): OfflineComponentProvider;
}
/**
 * Initializes and wires components that are needed to interface with the local
 * cache. Implementations override `initialize()` to provide all components.
 */
interface OfflineComponentProvider {
    readonly kind: Kind;
    persistence: Persistence;
    sharedClientState: SharedClientState;
    localStore: LocalStore;
    gcScheduler: Scheduler | null;
    indexBackfillerScheduler: Scheduler | null;
    synchronizeTabs: boolean;
    initialize(cfg: ComponentConfiguration): Promise<void>;
    terminate(): Promise<void>;
}
interface OnlineComponentProviderFactory {
    build(): OnlineComponentProvider;
}
/**
 * Initializes and wires the components that are needed to interface with the
 * network.
 */
declare class OnlineComponentProvider {
    static readonly provider: OnlineComponentProviderFactory;
    protected localStore: LocalStore;
    protected sharedClientState: SharedClientState;
    datastore: Datastore;
    eventManager: EventManager;
    remoteStore: RemoteStore;
    syncEngine: SyncEngine;
    initialize(offlineComponentProvider: OfflineComponentProvider, cfg: ComponentConfiguration): Promise<void>;
    createEventManager(cfg: ComponentConfiguration): EventManager;
    createDatastore(cfg: ComponentConfiguration): Datastore;
    createRemoteStore(cfg: ComponentConfiguration): RemoteStore;
    createSyncEngine(cfg: ComponentConfiguration, startAsPrimary: boolean): SyncEngine;
    terminate(): Promise<void>;
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
 * Provides an in-memory cache to the SDK. This is the default cache unless explicitly
 * configured otherwise.
 *
 * To use, create an instance using the factory function {@link memoryLocalCache()}, then
 * set the instance to `FirestoreSettings.cache` and call `initializeFirestore` using
 * the settings object.
 */
type MemoryLocalCache = {
    kind: 'memory';
    /**
     * @internal
     */
    _onlineComponentProvider: OnlineComponentProviderFactory;
    /**
     * @internal
     */
    _offlineComponentProvider: OfflineComponentProviderFactory;
};
/**
 * Provides a persistent cache backed by IndexedDb to the SDK.
 *
 * To use, create an instance using the factory function {@link persistentLocalCache()}, then
 * set the instance to `FirestoreSettings.cache` and call `initializeFirestore` using
 * the settings object.
 */
type PersistentLocalCache = {
    kind: 'persistent';
    /**
     * @internal
     */
    _onlineComponentProvider: OnlineComponentProviderFactory;
    /**
     * @internal
     */
    _offlineComponentProvider: OfflineComponentProviderFactory;
};
/**
 * Union type from all supported SDK cache layer.
 */
type FirestoreLocalCache = MemoryLocalCache | PersistentLocalCache;
/**
 * Union type from all support garbage collectors for memory local cache.
 */
type MemoryGarbageCollector = MemoryEagerGarbageCollector | MemoryLruGarbageCollector;
/**
 * A garbage collector deletes documents whenever they are not part of any
 * active queries, and have no local mutations attached to them.
 *
 * This collector tries to ensure lowest memory footprints from the SDK,
 * at the risk of documents not being cached for offline queries or for
 * direct queries to the cache.
 *
 * Use factory function {@link memoryEagerGarbageCollector()} to create an
 * instance of this collector.
 */
type MemoryEagerGarbageCollector = {
    kind: 'memoryEager';
    /**
     * @internal
     */
    _offlineComponentProvider: OfflineComponentProviderFactory;
};
/**
 * A garbage collector deletes Least-Recently-Used documents in multiple
 * batches.
 *
 * This collector is configured with a target size, and will only perform
 * collection when the cached documents exceed the target size. It avoids
 * querying backend repeated for the same query or document, at the risk
 * of having a larger memory footprint.
 *
 * Use factory function {@link memoryLruGarbageCollector()} to create a
 * instance of this collector.
 */
type MemoryLruGarbageCollector = {
    kind: 'memoryLru';
    /**
     * @internal
     */
    _offlineComponentProvider: OfflineComponentProviderFactory;
};
/**
 * Creates an instance of `MemoryEagerGarbageCollector`. This is also the
 * default garbage collector unless it is explicitly specified otherwise.
 */
declare function memoryEagerGarbageCollector(): MemoryEagerGarbageCollector;
/**
 * Creates an instance of `MemoryLruGarbageCollector`.
 *
 * A target size can be specified as part of the setting parameter. The
 * collector will start deleting documents once the cache size exceeds
 * the given size. The default cache size is 40MB (40 * 1024 * 1024 bytes).
 */
declare function memoryLruGarbageCollector(settings?: {
    cacheSizeBytes?: number;
}): MemoryLruGarbageCollector;
/**
 * An settings object to configure an `MemoryLocalCache` instance.
 */
type MemoryCacheSettings = {
    /**
     * The garbage collector to use, for the memory cache layer.
     * A `MemoryEagerGarbageCollector` is used when this is undefined.
     */
    garbageCollector?: MemoryGarbageCollector;
};
/**
 * Creates an instance of `MemoryLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 */
declare function memoryLocalCache(settings?: MemoryCacheSettings): MemoryLocalCache;
/**
 * An settings object to configure an `PersistentLocalCache` instance.
 *
 * Persistent cache cannot be used in a Node.js environment.
 */
type PersistentCacheSettings = {
    /**
     * An approximate cache size threshold for the on-disk data. If the cache
     * grows beyond this size, Firestore will start removing data that hasn't been
     * recently used. The SDK does not guarantee that the cache will stay below
     * that size, only that if the cache exceeds the given size, cleanup will be
     * attempted.
     *
     * The default value is 40 MB. The threshold must be set to at least 1 MB, and
     * can be set to `CACHE_SIZE_UNLIMITED` to disable garbage collection.
     */
    cacheSizeBytes?: number;
    /**
     * Specifies how multiple tabs/windows will be managed by the SDK.
     */
    tabManager?: PersistentTabManager;
};
/**
 * Creates an instance of `PersistentLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 *
 * Persistent cache cannot be used in a Node.js environment.
 */
declare function persistentLocalCache(settings?: PersistentCacheSettings): PersistentLocalCache;
/**
 * A tab manager supporting only one tab, no synchronization will be
 * performed across tabs.
 */
type PersistentSingleTabManager = {
    kind: 'persistentSingleTab';
    /**
     * @internal
     */
    _initialize: (settings: Omit<PersistentCacheSettings, 'tabManager'> | undefined) => void;
    /**
     * @internal
     */
    _onlineComponentProvider?: OnlineComponentProviderFactory;
    /**
     * @internal
     */
    _offlineComponentProvider?: OfflineComponentProviderFactory;
};
/**
 * A tab manager supporting multiple tabs. SDK will synchronize queries and
 * mutations done across all tabs using the SDK.
 */
type PersistentMultipleTabManager = {
    kind: 'PersistentMultipleTab';
    /**
     * @internal
     */
    _initialize: (settings: Omit<PersistentCacheSettings, 'tabManager'>) => void;
    /**
     * @internal
     */
    _onlineComponentProvider?: OnlineComponentProviderFactory;
    /**
     * @internal
     */
    _offlineComponentProvider?: OfflineComponentProviderFactory;
};
/**
 * A union of all available tab managers.
 */
type PersistentTabManager = PersistentSingleTabManager | PersistentMultipleTabManager;
/**
 * Type to configure an `PersistentSingleTabManager` instance.
 */
type PersistentSingleTabManagerSettings = {
    /**
     * Whether to force-enable persistent (IndexedDB) cache for the client. This
     * cannot be used with multi-tab synchronization and is primarily intended for
     * use with Web Workers. Setting this to `true` will enable IndexedDB, but cause
     * other tabs using IndexedDB cache to fail.
     */
    forceOwnership?: boolean;
};
/**
 * Creates an instance of `PersistentSingleTabManager`.
 *
 * @param settings - Configures the created tab manager.
 */
declare function persistentSingleTabManager(settings: PersistentSingleTabManagerSettings | undefined): PersistentSingleTabManager;
/**
 * Creates an instance of `PersistentMultipleTabManager`.
 */
declare function persistentMultipleTabManager(): PersistentMultipleTabManager;

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
 * Specifies custom configurations for your Cloud Firestore instance.
 * You must set these before invoking any other methods.
 */
interface FirestoreSettings$1 {
    /** The hostname to connect to. */
    host?: string;
    /** Whether to use SSL when connecting. */
    ssl?: boolean;
    /**
     * Whether to skip nested properties that are set to `undefined` during
     * object serialization. If set to `true`, these properties are skipped
     * and not written to Firestore. If set to `false` or omitted, the SDK
     * throws an exception when it encounters properties of type `undefined`.
     */
    ignoreUndefinedProperties?: boolean;
}
/**
 * @internal
 * Undocumented, private additional settings not exposed in our public API.
 */
interface PrivateSettings extends FirestoreSettings$1 {
    credentials?: CredentialsSettings;
    cacheSizeBytes?: number;
    experimentalForceLongPolling?: boolean;
    experimentalAutoDetectLongPolling?: boolean;
    experimentalLongPollingOptions?: ExperimentalLongPollingOptions;
    useFetchStreams?: boolean;
    emulatorOptions?: {
        mockUserToken?: EmulatorMockTokenOptions | string;
    };
    localCache?: FirestoreLocalCache;
}
/**
 * A concrete type describing all the values that can be applied via a
 * user-supplied `FirestoreSettings` object. This is a separate type so that
 * defaults can be supplied and the value can be checked for equality.
 */
declare class FirestoreSettingsImpl {
    /** The hostname to connect to. */
    readonly host: string;
    /** Whether to use SSL when connecting. */
    readonly ssl: boolean;
    readonly cacheSizeBytes: number;
    readonly experimentalForceLongPolling: boolean;
    readonly experimentalAutoDetectLongPolling: boolean;
    readonly experimentalLongPollingOptions: ExperimentalLongPollingOptions;
    readonly ignoreUndefinedProperties: boolean;
    readonly useFetchStreams: boolean;
    readonly localCache?: FirestoreLocalCache;
    readonly isUsingEmulator: boolean;
    credentials?: any;
    constructor(settings: PrivateSettings);
    isEqual(other: FirestoreSettingsImpl): boolean;
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
 * An interface implemented by FirebaseFirestore that provides compatibility
 * with the usage in this file.
 *
 * This interface mainly exists to remove a cyclic dependency.
 */
interface FirestoreService extends _FirebaseService {
    _authCredentials: CredentialsProvider<User>;
    _appCheckCredentials: CredentialsProvider<string>;
    _persistenceKey: string;
    _databaseId: DatabaseId;
    _terminated: boolean;
    _freezeSettings(): FirestoreSettingsImpl;
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

declare module '@firebase/component' {
    interface NameServiceMapping {
        'firestore/lite': Firestore$1;
    }
}
/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */
declare class Firestore$1 implements FirestoreService {
    _authCredentials: CredentialsProvider<User>;
    _appCheckCredentials: CredentialsProvider<string>;
    readonly _databaseId: DatabaseId;
    readonly _app?: FirebaseApp | undefined;
    /**
     * Whether it's a Firestore or Firestore Lite instance.
     */
    type: 'firestore-lite' | 'firestore';
    readonly _persistenceKey: string;
    private _settings;
    private _settingsFrozen;
    private _emulatorOptions;
    private _terminateTask;
    /** @hideconstructor */
    constructor(_authCredentials: CredentialsProvider<User>, _appCheckCredentials: CredentialsProvider<string>, _databaseId: DatabaseId, _app?: FirebaseApp | undefined);
    /**
     * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
     * instance.
     */
    get app(): FirebaseApp;
    get _initialized(): boolean;
    get _terminated(): boolean;
    _setSettings(settings: PrivateSettings): void;
    _getSettings(): FirestoreSettingsImpl;
    _getEmulatorOptions(): {
        mockUserToken?: EmulatorMockTokenOptions | string;
    };
    _freezeSettings(): FirestoreSettingsImpl;
    _delete(): Promise<void>;
    _restart(): Promise<void>;
    /** Returns a JSON-serializable representation of this `Firestore` instance. */
    toJSON(): object;
    /**
     * Terminates all components used by this client. Subclasses can override
     * this method to clean up their own dependencies, but must also call this
     * method.
     *
     * Only ever called once.
     */
    protected _terminate(): Promise<void>;
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
declare function connectFirestoreEmulator(firestore: Firestore$1, host: string, port: number, options?: {
    mockUserToken?: EmulatorMockTokenOptions | string;
}): void;

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
declare abstract class FieldValue {
    _methodName: string;
    /**
     * @param _methodName - The public API endpoint that returns this class.
     * @hideconstructor
     */
    constructor(_methodName: string);
    /** Compares `FieldValue`s for equality. */
    abstract isEqual(other: FieldValue): boolean;
    abstract _toFieldTransform(context: ParseContext): FieldTransform | null;
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
 * A `FieldPath` refers to a field in a document. The path may consist of a
 * single field name (referring to a top-level field in the document), or a
 * list of field names (referring to a nested field in the document).
 *
 * Create a `FieldPath` by providing field names. If more than one field
 * name is provided, the path will point to a nested field in a document.
 */
declare class FieldPath {
    /** Internal representation of a Firestore field path. */
    readonly _internalPath: FieldPath$1;
    /**
     * Creates a `FieldPath` from the provided field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     * @param fieldNames - A list of field names.
     */
    constructor(...fieldNames: string[]);
    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other - The `FieldPath` to compare against.
     * @returns true if this `FieldPath` is equal to the provided one.
     */
    isEqual(other: FieldPath): boolean;
}
/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */
declare function documentId$1(): FieldPath;

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
declare class VectorValue {
    private readonly _values;
    /**
     * @private
     * @internal
     */
    constructor(values: number[] | undefined);
    /**
     * Returns a copy of the raw number array form of the vector.
     */
    toArray(): number[];
    /**
     * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
     */
    isEqual(other: VectorValue): boolean;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        vectorValues: Property<"object">;
    };
    /**
     * Returns a JSON-serializable representation of this `VectorValue` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON(): object;
    /**
     * Builds a `VectorValue` instance from a JSON object created by {@link VectorValue.toJSON}.
     *
     * @param json - a JSON object represention of a `VectorValue` instance.
     * @returns an instance of {@link VectorValue} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(json: object): VectorValue;
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

type ServerTimestampBehavior = 'estimate' | 'previous' | 'none';
/**
 * Converts Firestore's internal types to the JavaScript types that we expose
 * to the user.
 *
 * @internal
 */
declare abstract class AbstractUserDataWriter {
    convertValue(value: Value, serverTimestampBehavior?: ServerTimestampBehavior): unknown;
    private convertObject;
    /**
     * @internal
     */
    convertObjectMap(fields: ApiClientObjectMap<Value> | undefined, serverTimestampBehavior?: ServerTimestampBehavior): DocumentData$1;
    /**
     * @internal
     */
    convertVectorValue(mapValue: MapValue): VectorValue;
    private convertGeoPoint;
    private convertArray;
    private convertServerTimestamp;
    private convertTimestamp;
    protected convertDocumentKey(name: string, expectedDatabaseId: DatabaseId): DocumentKey;
    protected abstract convertReference(name: string): unknown;
    protected abstract convertBytes(bytes: ByteString): unknown;
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
 * Converter used by `withConverter()` to transform user objects of type
 * `AppModelType` into Firestore data of type `DbModelType`.
 *
 * Using the converter allows you to specify generic type arguments when
 * storing and retrieving objects from Firestore.
 *
 * In this context, an "AppModel" is a class that is used in an application to
 * package together related information and functionality. Such a class could,
 * for example, have properties with complex, nested data types, properties used
 * for memoization, properties of types not supported by Firestore (such as
 * `symbol` and `bigint`), and helper functions that perform compound
 * operations. Such classes are not suitable and/or possible to store into a
 * Firestore database. Instead, instances of such classes need to be converted
 * to "plain old JavaScript objects" (POJOs) with exclusively primitive
 * properties, potentially nested inside other POJOs or arrays of POJOs. In this
 * context, this type is referred to as the "DbModel" and would be an object
 * suitable for persisting into Firestore. For convenience, applications can
 * implement `FirestoreDataConverter` and register the converter with Firestore
 * objects, such as `DocumentReference` or `Query`, to automatically convert
 * `AppModel` to `DbModel` when storing into Firestore, and convert `DbModel`
 * to `AppModel` when retrieving from Firestore.
 *
 * @example
 *
 * Simple Example
 *
 * ```typescript
 * const numberConverter = {
 *     toFirestore(value: WithFieldValue<number>) {
 *         return { value };
 *     },
 *     fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
 *         return snapshot.data(options).value as number;
 *     }
 * };
 *
 * async function simpleDemo(db: Firestore): Promise<void> {
 *     const documentRef = doc(db, 'values/value123').withConverter(numberConverter);
 *
 *     // converters are used with `setDoc`, `addDoc`, and `getDoc`
 *     await setDoc(documentRef, 42);
 *     const snapshot1 = await getDoc(documentRef);
 *     assertEqual(snapshot1.data(), 42);
 *
 *     // converters are not used when writing data with `updateDoc`
 *     await updateDoc(documentRef, { value: 999 });
 *     const snapshot2 = await getDoc(documentRef);
 *     assertEqual(snapshot2.data(), 999);
 * }
 * ```
 *
 * Advanced Example
 *
 * ```typescript
 * // The Post class is a model that is used by our application.
 * // This class may have properties and methods that are specific
 * // to our application execution, which do not need to be persisted
 * // to Firestore.
 * class Post {
 *     constructor(
 *         readonly title: string,
 *         readonly author: string,
 *         readonly lastUpdatedMillis: number
 *     ) {}
 *     toString(): string {
 *         return `${this.title} by ${this.author}`;
 *     }
 * }
 *
 * // The PostDbModel represents how we want our posts to be stored
 * // in Firestore. This DbModel has different properties (`ttl`,
 * // `aut`, and `lut`) from the Post class we use in our application.
 * interface PostDbModel {
 *     ttl: string;
 *     aut: { firstName: string; lastName: string };
 *     lut: Timestamp;
 * }
 *
 * // The `PostConverter` implements `FirestoreDataConverter` and specifies
 * // how the Firestore SDK can convert `Post` objects to `PostDbModel`
 * // objects and vice versa.
 * class PostConverter implements FirestoreDataConverter<Post, PostDbModel> {
 *     toFirestore(post: WithFieldValue<Post>): WithFieldValue<PostDbModel> {
 *         return {
 *             ttl: post.title,
 *             aut: this._autFromAuthor(post.author),
 *             lut: this._lutFromLastUpdatedMillis(post.lastUpdatedMillis)
 *         };
 *     }
 *
 *     fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Post {
 *         const data = snapshot.data(options) as PostDbModel;
 *         const author = `${data.aut.firstName} ${data.aut.lastName}`;
 *         return new Post(data.ttl, author, data.lut.toMillis());
 *     }
 *
 *     _autFromAuthor(
 *         author: string | FieldValue
 *     ): { firstName: string; lastName: string } | FieldValue {
 *         if (typeof author !== 'string') {
 *             // `author` is a FieldValue, so just return it.
 *             return author;
 *         }
 *         const [firstName, lastName] = author.split(' ');
 *         return {firstName, lastName};
 *     }
 *
 *     _lutFromLastUpdatedMillis(
 *         lastUpdatedMillis: number | FieldValue
 *     ): Timestamp | FieldValue {
 *         if (typeof lastUpdatedMillis !== 'number') {
 *             // `lastUpdatedMillis` must be a FieldValue, so just return it.
 *             return lastUpdatedMillis;
 *         }
 *         return Timestamp.fromMillis(lastUpdatedMillis);
 *     }
 * }
 *
 * async function advancedDemo(db: Firestore): Promise<void> {
 *     // Create a `DocumentReference` with a `FirestoreDataConverter`.
 *     const documentRef = doc(db, 'posts/post123').withConverter(new PostConverter());
 *
 *     // The `data` argument specified to `setDoc()` is type checked by the
 *     // TypeScript compiler to be compatible with `Post`. Since the `data`
 *     // argument is typed as `WithFieldValue<Post>` rather than just `Post`,
 *     // this allows properties of the `data` argument to also be special
 *     // Firestore values that perform server-side mutations, such as
 *     // `arrayRemove()`, `deleteField()`, and `serverTimestamp()`.
 *     await setDoc(documentRef, {
 *         title: 'My Life',
 *         author: 'Foo Bar',
 *         lastUpdatedMillis: serverTimestamp()
 *     });
 *
 *     // The TypeScript compiler will fail to compile if the `data` argument to
 *     // `setDoc()` is _not_ compatible with `WithFieldValue<Post>`. This
 *     // type checking prevents the caller from specifying objects with incorrect
 *     // properties or property values.
 *     // @ts-expect-error "Argument of type { ttl: string; } is not assignable
 *     // to parameter of type WithFieldValue<Post>"
 *     await setDoc(documentRef, { ttl: 'The Title' });
 *
 *     // When retrieving a document with `getDoc()` the `DocumentSnapshot`
 *     // object's `data()` method returns a `Post`, rather than a generic object,
 *     // which would have been returned if the `DocumentReference` did _not_ have a
 *     // `FirestoreDataConverter` attached to it.
 *     const snapshot1: DocumentSnapshot<Post> = await getDoc(documentRef);
 *     const post1: Post = snapshot1.data()!;
 *     if (post1) {
 *         assertEqual(post1.title, 'My Life');
 *         assertEqual(post1.author, 'Foo Bar');
 *     }
 *
 *     // The `data` argument specified to `updateDoc()` is type checked by the
 *     // TypeScript compiler to be compatible with `PostDbModel`. Note that
 *     // unlike `setDoc()`, whose `data` argument must be compatible with `Post`,
 *     // the `data` argument to `updateDoc()` must be compatible with
 *     // `PostDbModel`. Similar to `setDoc()`, since the `data` argument is typed
 *     // as `WithFieldValue<PostDbModel>` rather than just `PostDbModel`, this
 *     // allows properties of the `data` argument to also be those special
 *     // Firestore values, like `arrayRemove()`, `deleteField()`, and
 *     // `serverTimestamp()`.
 *     await updateDoc(documentRef, {
 *         'aut.firstName': 'NewFirstName',
 *         lut: serverTimestamp()
 *     });
 *
 *     // The TypeScript compiler will fail to compile if the `data` argument to
 *     // `updateDoc()` is _not_ compatible with `WithFieldValue<PostDbModel>`.
 *     // This type checking prevents the caller from specifying objects with
 *     // incorrect properties or property values.
 *     // @ts-expect-error "Argument of type { title: string; } is not assignable
 *     // to parameter of type WithFieldValue<PostDbModel>"
 *     await updateDoc(documentRef, { title: 'New Title' });
 *     const snapshot2: DocumentSnapshot<Post> = await getDoc(documentRef);
 *     const post2: Post = snapshot2.data()!;
 *     if (post2) {
 *         assertEqual(post2.title, 'My Life');
 *         assertEqual(post2.author, 'NewFirstName Bar');
 *     }
 * }
 * ```
 */
interface FirestoreDataConverter$1<AppModelType, DbModelType extends DocumentData = DocumentData> {
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. Used with
     * {@link @firebase/firestore/lite#(setDoc:1)},
     * {@link @firebase/firestore/lite#(WriteBatch.set:1)} and
     * {@link @firebase/firestore/lite#(Transaction.set:1)}.
     *
     * The `WithFieldValue<T>` type extends `T` to also allow FieldValues such as
     * {@link (deleteField:1)} to be used as property values.
     */
    toFirestore(modelObject: WithFieldValue<AppModelType>): WithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. Used with
     * {@link @firebase/firestore/lite#(setDoc:1)},
     * {@link @firebase/firestore/lite#(WriteBatch.set:1)} and
     * {@link @firebase/firestore/lite#(Transaction.set:1)} with `merge:true`
     * or `mergeFields`.
     *
     * The `PartialWithFieldValue<T>` type extends `Partial<T>` to allow
     * FieldValues such as {@link (arrayUnion:1)} to be used as property values.
     * It also supports nested `Partial` by allowing nested fields to be
     * omitted.
     */
    toFirestore(modelObject: PartialWithFieldValue<AppModelType>, options: SetOptions): PartialWithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert Firestore data into an object of
     * type `AppModelType`. You can access your data by calling:
     * `snapshot.data()`.
     *
     *
     * Generally, the data returned from `snapshot.data()` can be cast to
     * `DbModelType`; however, this is not guaranteed because Firestore does not
     * enforce a schema on the database. For example, writes from a previous
     * version of the application or writes from another client that did not use a
     * type converter could have written data with different properties and/or
     * property types. The implementation will need to choose whether to
     * gracefully recover from non-conforming data or throw an error.
     *
     * @param snapshot - A `QueryDocumentSnapshot` containing your data and
     * metadata.
     */
    fromFirestore(snapshot: QueryDocumentSnapshot$1<DocumentData, DocumentData>): AppModelType;
}
/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */
declare class DocumentSnapshot$1<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    _firestore: Firestore$1;
    _userDataWriter: AbstractUserDataWriter;
    _key: DocumentKey;
    _document: Document | null;
    _converter: UntypedFirestoreDataConverter<AppModelType, DbModelType> | null;
    /** @hideconstructor protected */
    constructor(_firestore: Firestore$1, _userDataWriter: AbstractUserDataWriter, _key: DocumentKey, _document: Document | null, _converter: UntypedFirestoreDataConverter<AppModelType, DbModelType> | null);
    /** Property of the `DocumentSnapshot` that provides the document's ID. */
    get id(): string;
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */
    get ref(): DocumentReference<AppModelType, DbModelType>;
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */
    exists(): this is QueryDocumentSnapshot$1<AppModelType, DbModelType>;
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */
    data(): AppModelType | undefined;
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
    _fieldsProto(): {
        [key: string]: firestoreV1ApiClientInterfaces.Value;
    } | undefined;
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    get(fieldPath: string | FieldPath): any;
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
declare class QueryDocumentSnapshot$1<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> extends DocumentSnapshot$1<AppModelType, DbModelType> {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * @override
     * @returns An `Object` containing all fields in the document.
     */
    data(): AppModelType;
}

/**
 * @license
 * Copyright 2021 Google LLC
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
 * These types primarily exist to support the `UpdateData`,
 * `WithFieldValue`, and `PartialWithFieldValue` types and are not consumed
 * directly by the end developer.
 */
/** Primitive types. */
type Primitive = string | number | boolean | undefined | null;
/**
 * For each field (e.g. 'bar'), find all nested keys (e.g. {'bar.baz': T1,
 * 'bar.qux': T2}). Intersect them together to make a single map containing
 * all possible keys that are all marked as optional
 */
type NestedUpdateFields<T extends Record<string, unknown>> = UnionToIntersection<{
    [K in keyof T & string]: ChildUpdateFields<K, T[K]>;
}[keyof T & string]>;
/**
 * Helper for calculating the nested fields for a given type T1. This is needed
 * to distribute union types such as `undefined | {...}` (happens for optional
 * props) or `{a: A} | {b: B}`.
 *
 * In this use case, `V` is used to distribute the union types of `T[K]` on
 * `Record`, since `T[K]` is evaluated as an expression and not distributed.
 *
 * See https://www.typescriptlang.org/docs/handbook/advanced-types.html#distributive-conditional-types
 */
type ChildUpdateFields<K extends string, V> = V extends Record<string, unknown> ? AddPrefixToKeys<K, UpdateData<V>> : never;
/**
 * Returns a new map where every key is prefixed with the outer key appended
 * to a dot.
 */
type AddPrefixToKeys<Prefix extends string, T extends Record<string, unknown>> = {
    [K in keyof T & string as `${Prefix}.${K}`]+?: string extends K ? any : T[K];
};
/**
 * Given a union type `U = T1 | T2 | ...`, returns an intersected type
 * `(T1 & T2 & ...)`.
 *
 * Uses distributive conditional types and inference from conditional types.
 * This works because multiple candidates for the same type variable in
 * contra-variant positions causes an intersection type to be inferred.
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types
 * https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
 */
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

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
 * Document data (for use with {@link @firebase/firestore/lite#(setDoc:1)}) consists of fields mapped to
 * values.
 */
interface DocumentData {
    /** A mapping between a field and its value. */
    [field: string]: any;
}
/**
 * Similar to TypeScript's `Partial<T>`, but allows nested fields to be
 * omitted and FieldValues to be passed in as property values.
 */
type PartialWithFieldValue<T> = Partial<T> | (T extends Primitive ? T : T extends {} ? {
    [K in keyof T]?: PartialWithFieldValue<T[K]> | FieldValue;
} : never);
/**
 * Allows FieldValues to be passed in as a property value while maintaining
 * type safety.
 */
type WithFieldValue<T> = T | (T extends Primitive ? T : T extends {} ? {
    [K in keyof T]: WithFieldValue<T[K]> | FieldValue;
} : never);
/**
 * Update data (for use with {@link (updateDoc:1)}) that consists of field paths
 * (e.g. 'foo' or 'foo.baz') mapped to values. Fields that contain dots
 * reference nested fields within the document. FieldValues can be passed in
 * as property values.
 */
type UpdateData<T> = T extends Primitive ? T : T extends {} ? {
    [K in keyof T]?: UpdateData<T[K]> | FieldValue;
} & NestedUpdateFields<T> : Partial<T>;
/**
 * An options object that configures the behavior of {@link @firebase/firestore/lite#(setDoc:1)}, {@link
 * @firebase/firestore/lite#(WriteBatch.set:1)} and {@link @firebase/firestore/lite#(Transaction.set:1)} calls. These calls can be
 * configured to perform granular merges instead of overwriting the target
 * documents in their entirety by providing a `SetOptions` with `merge: true`.
 *
 * @param merge - Changes the behavior of a `setDoc()` call to only replace the
 * values specified in its data argument. Fields omitted from the `setDoc()`
 * call remain untouched. If your input sets any field to an empty map, all
 * nested fields are overwritten.
 * @param mergeFields - Changes the behavior of `setDoc()` calls to only replace
 * the specified field paths. Any field path that is not specified is ignored
 * and remains untouched. If your input sets any field to an empty map, all
 * nested fields are overwritten.
 */
type SetOptions = {
    readonly merge?: boolean;
} | {
    readonly mergeFields?: Array<string | FieldPath>;
};
/**
 * A `Query` refers to a query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */
declare class Query<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    readonly converter: FirestoreDataConverter$1<AppModelType, DbModelType> | null;
    readonly _query: Query$1;
    /** The type of this Firestore reference. */
    readonly type: 'query' | 'collection';
    /**
     * The `Firestore` instance for the Firestore database (useful for performing
     * transactions, etc.).
     */
    readonly firestore: Firestore$1;
    /** @hideconstructor protected */
    constructor(firestore: Firestore$1, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    converter: FirestoreDataConverter$1<AppModelType, DbModelType> | null, _query: Query$1);
    /**
     * Removes the current converter.
     *
     * @param converter - `null` removes the current converter.
     * @returns A `Query<DocumentData, DocumentData>` that does not use a
     * converter.
     */
    withConverter(converter: null): Query<DocumentData, DocumentData>;
    /**
     * Applies a custom data converter to this query, allowing you to use your own
     * custom model objects with Firestore. When you call {@link getDocs} with
     * the returned query, the provided converter will convert between Firestore
     * data of type `NewDbModelType` and your custom type `NewAppModelType`.
     *
     * @param converter - Converts objects to and from Firestore.
     * @returns A `Query` that uses the provided converter.
     */
    withConverter<NewAppModelType, NewDbModelType extends DocumentData = DocumentData>(converter: FirestoreDataConverter$1<NewAppModelType, NewDbModelType>): Query<NewAppModelType, NewDbModelType>;
}
/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */
declare class DocumentReference<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    readonly converter: FirestoreDataConverter$1<AppModelType, DbModelType> | null;
    readonly _key: DocumentKey;
    /** The type of this Firestore reference. */
    readonly type = "document";
    /**
     * The {@link Firestore} instance the document is in.
     * This is useful for performing transactions, for example.
     */
    readonly firestore: Firestore$1;
    /** @hideconstructor */
    constructor(firestore: Firestore$1, 
    /**
     * If provided, the `FirestoreDataConverter` associated with this instance.
     */
    converter: FirestoreDataConverter$1<AppModelType, DbModelType> | null, _key: DocumentKey);
    get _path(): ResourcePath;
    /**
     * The document's identifier within its collection.
     */
    get id(): string;
    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */
    get path(): string;
    /**
     * The collection this `DocumentReference` belongs to.
     */
    get parent(): CollectionReference<AppModelType, DbModelType>;
    /**
     * Applies a custom data converter to this `DocumentReference`, allowing you
     * to use your own custom model objects with Firestore. When you call {@link
     * @firebase/firestore/lite#(setDoc:1)}, {@link @firebase/firestore/lite#getDoc}, etc. with the returned `DocumentReference`
     * instance, the provided converter will convert between Firestore data of
     * type `NewDbModelType` and your custom type `NewAppModelType`.
     *
     * @param converter - Converts objects to and from Firestore.
     * @returns A `DocumentReference` that uses the provided converter.
     */
    withConverter<NewAppModelType, NewDbModelType extends DocumentData = DocumentData>(converter: FirestoreDataConverter$1<NewAppModelType, NewDbModelType>): DocumentReference<NewAppModelType, NewDbModelType>;
    /**
     * Removes the current converter.
     *
     * @param converter - `null` removes the current converter.
     * @returns A `DocumentReference<DocumentData, DocumentData>` that does not
     * use a converter.
     */
    withConverter(converter: null): DocumentReference<DocumentData, DocumentData>;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        referencePath: Property<"string">;
    };
    /**
     * Returns a JSON-serializable representation of this `DocumentReference` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON(): object;
    /**
     * Builds a `DocumentReference` instance from a JSON object created by
     * {@link DocumentReference.toJSON}.
     *
     * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
     * @param json - a JSON object represention of a `DocumentReference` instance
     * @returns an instance of {@link DocumentReference} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(firestore: Firestore$1, json: object): DocumentReference;
    /**
     * Builds a `DocumentReference` instance from a JSON object created by
     * {@link DocumentReference.toJSON}.
     *
     * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
     * @param json - a JSON object represention of a `DocumentReference` instance
     * @param converter - Converts objects to and from Firestore.
     * @returns an instance of {@link DocumentReference} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON<NewAppModelType = DocumentData, NewDbModelType extends DocumentData = DocumentData>(firestore: Firestore$1, json: object, converter: FirestoreDataConverter$1<NewAppModelType, NewDbModelType>): DocumentReference<NewAppModelType, NewDbModelType>;
}
/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using {@link (query:1)}).
 */
declare class CollectionReference<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> extends Query<AppModelType, DbModelType> {
    readonly _path: ResourcePath;
    /** The type of this Firestore reference. */
    readonly type = "collection";
    /** @hideconstructor */
    constructor(firestore: Firestore$1, converter: FirestoreDataConverter$1<AppModelType, DbModelType> | null, _path: ResourcePath);
    /** The collection's identifier. */
    get id(): string;
    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */
    get path(): string;
    /**
     * A reference to the containing `DocumentReference` if this is a
     * subcollection. If this isn't a subcollection, the reference is null.
     */
    get parent(): DocumentReference<DocumentData, DocumentData> | null;
    /**
     * Applies a custom data converter to this `CollectionReference`, allowing you
     * to use your own custom model objects with Firestore. When you call {@link
     * addDoc} with the returned `CollectionReference` instance, the provided
     * converter will convert between Firestore data of type `NewDbModelType` and
     * your custom type `NewAppModelType`.
     *
     * @param converter - Converts objects to and from Firestore.
     * @returns A `CollectionReference` that uses the provided converter.
     */
    withConverter<NewAppModelType, NewDbModelType extends DocumentData = DocumentData>(converter: FirestoreDataConverter$1<NewAppModelType, NewDbModelType>): CollectionReference<NewAppModelType, NewDbModelType>;
    /**
     * Removes the current converter.
     *
     * @param converter - `null` removes the current converter.
     * @returns A `CollectionReference<DocumentData, DocumentData>` that does not
     * use a converter.
     */
    withConverter(converter: null): CollectionReference<DocumentData, DocumentData>;
}
/**
 * Gets a `CollectionReference` instance that refers to the collection at
 * the specified absolute path.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments to apply relative to the first
 * argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
declare function collection(firestore: Firestore$1, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Gets a `CollectionReference` instance that refers to a subcollection of
 * `reference` at the specified relative path.
 *
 * @param reference - A reference to a collection.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments to apply relative to the first
 * argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
declare function collection<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
/**
 * Gets a `CollectionReference` instance that refers to a subcollection of
 * `reference` at the specified relative path.
 *
 * @param reference - A reference to a Firestore document.
 * @param path - A slash-separated path to a collection.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
declare function collection<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>;
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
declare function collectionGroup(firestore: Firestore$1, collectionId: string): Query<DocumentData, DocumentData>;
/**
 * Gets a `DocumentReference` instance that refers to the document at the
 * specified absolute path.
 *
 * @param firestore - A reference to the root `Firestore` instance.
 * @param path - A slash-separated path to a document.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
declare function doc(firestore: Firestore$1, path: string, ...pathSegments: string[]): DocumentReference<DocumentData, DocumentData>;
/**
 * Gets a `DocumentReference` instance that refers to a document within
 * `reference` at the specified relative path. If no path is specified, an
 * automatically-generated unique ID will be used for the returned
 * `DocumentReference`.
 *
 * @param reference - A reference to a collection.
 * @param path - A slash-separated path to a document. Has to be omitted to use
 * auto-generated IDs.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
declare function doc<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, path?: string, ...pathSegments: string[]): DocumentReference<AppModelType, DbModelType>;
/**
 * Gets a `DocumentReference` instance that refers to a document within
 * `reference` at the specified relative path.
 *
 * @param reference - A reference to a Firestore document.
 * @param path - A slash-separated path to a document.
 * @param pathSegments - Additional path segments that will be applied relative
 * to the first argument.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @returns The `DocumentReference` instance.
 */
declare function doc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, path: string, ...pathSegments: string[]): DocumentReference<DocumentData, DocumentData>;
/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
declare function refEqual<AppModelType, DbModelType extends DocumentData>(left: DocumentReference<AppModelType, DbModelType> | CollectionReference<AppModelType, DbModelType>, right: DocumentReference<AppModelType, DbModelType> | CollectionReference<AppModelType, DbModelType>): boolean;
/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
declare function queryEqual<AppModelType, DbModelType extends DocumentData>(left: Query<AppModelType, DbModelType>, right: Query<AppModelType, DbModelType>): boolean;

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
 * An untyped Firestore Data Converter interface that is shared between the
 * lite, firestore-exp and classic SDK.
 */
interface UntypedFirestoreDataConverter<AppModelType, DbModelType extends DocumentData$1 = DocumentData$1> {
    toFirestore(modelObject: WithFieldValue<AppModelType>): WithFieldValue<DbModelType>;
    toFirestore(modelObject: PartialWithFieldValue<AppModelType>, options: SetOptions$1): PartialWithFieldValue<DbModelType>;
    fromFirestore(snapshot: unknown, options?: unknown): AppModelType;
}
/** The result of parsing document data (e.g. for a setData call). */
declare class ParsedSetData {
    readonly data: ObjectValue;
    readonly fieldMask: FieldMask | null;
    readonly fieldTransforms: FieldTransform[];
    constructor(data: ObjectValue, fieldMask: FieldMask | null, fieldTransforms: FieldTransform[]);
    toMutation(key: DocumentKey, precondition: Precondition): Mutation;
}
/** The result of parsing "update" data (i.e. for an updateData call). */
declare class ParsedUpdateData {
    readonly data: ObjectValue;
    readonly fieldMask: FieldMask;
    readonly fieldTransforms: FieldTransform[];
    constructor(data: ObjectValue, fieldMask: FieldMask, fieldTransforms: FieldTransform[]);
    toMutation(key: DocumentKey, precondition: Precondition): Mutation;
}
declare const enum UserDataSource {
    Set = 0,
    Update = 1,
    MergeSet = 2,
    /**
     * Indicates the source is a where clause, cursor bound, arrayUnion()
     * element, etc. Of note, isWrite(source) will return false.
     */
    Argument = 3,
    /**
     * Indicates that the source is an Argument that may directly contain nested
     * arrays (e.g. the operand of an `in` query).
     */
    ArrayArgument = 4
}
interface UserData {
    _readUserData(context: ParseContext): void;
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

/** Contains the settings that are mutated as we parse user data. */
interface ContextSettings {
    /** Indicates what kind of API method this data came from. */
    readonly dataSource: UserDataSource;
    /** The name of the method the user called to create the ParseContext. */
    readonly methodName: string;
    /** The document the user is attempting to modify, if that applies. */
    readonly targetDoc?: DocumentKey;
    /**
     * A path within the object being parsed. This could be an empty path (in
     * which case the context represents the root of the data being parsed), or a
     * nonempty path (indicating the context represents a nested location within
     * the data).
     */
    readonly path?: FieldPath$1;
    /**
     * Whether or not this context corresponds to an element of an array.
     * If not set, elements are treated as if they were outside of arrays.
     */
    readonly arrayElement?: boolean;
    /**
     * Whether or not a converter was specified in this context. If true, error
     * messages will reference the converter when invalid data is provided.
     */
    readonly hasConverter?: boolean;
}
interface ParseContext {
    readonly settings: ContextSettings;
    readonly databaseId: DatabaseId;
    readonly serializer: JsonProtoSerializer;
    readonly ignoreUndefinedProperties: boolean;
    fieldTransforms: FieldTransform[];
    fieldMask: FieldPath$1[];
    get path(): FieldPath$1 | undefined;
    get dataSource(): UserDataSource;
    contextWith(configuration: Partial<ContextSettings>): ParseContext;
    childContextForField(field: string): ParseContext;
    childContextForFieldPath(field: FieldPath$1): ParseContext;
    childContextForArray(index: number): ParseContext;
    createError(reason: string): FirestoreError;
    contains(fieldPath: FieldPath$1): boolean;
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
 * @beta
 *
 * An enumeration of the different types of expressions.
 */
type ExpressionType = 'Field' | 'Constant' | 'Function' | 'AggregateFunction' | 'ListOfExpressions' | 'AliasedExpression';
/**
 * @beta
 *
 * An enumeration of the different types generated by the Firestore backend.
 *
 * <ul>
 *  <li>Numerics evaluate directly to backend representation (`int64` or `float64`), not JS `number`.</li>
 *  <li>JavaScript `Date` and firestore `Timestamp` objects strictly evaluate to `'timestamp'`.</li>
 *  <li>Advanced configurations parsing backend types (such as `decimal128`, `max_key` or `min_key` from BSON) are also incorporated in this union string type. Note that `decimal128` is a backend-only numeric type that the JavaScript SDK cannot create natively, but can be evaluated in pipelines.</li>
 * </ul>
 */
type Type = 'null' | 'array' | 'boolean' | 'bytes' | 'timestamp' | 'geo_point' | 'number' | 'int32' | 'int64' | 'float64' | 'decimal128' | 'map' | 'reference' | 'string' | 'vector' | 'max_key' | 'min_key' | 'object_id' | 'regex' | 'request_timestamp';
/**
 * @beta
 *
 * Represents an expression that can be evaluated to a value within the execution of a {@link
 * @firebase/firestore/pipelines#Pipeline}.
 *
 * Expressions are the building blocks for creating complex queries and transformations in
 * Firestore pipelines. They can represent:
 *
 * - **Field references:** Access values from document fields.
 * - **Literals:** Represent constant values (strings, numbers, booleans).
 * - **Function calls:** Apply functions to one or more expressions.
 *
 * The `Expression` class provides a fluent API for building expressions. You can chain together
 * method calls to create complex expressions.
 */
declare abstract class Expression implements ProtoValueSerializable, UserData {
    abstract readonly expressionType: ExpressionType;
    abstract readonly _methodName?: string;
    /**
     * @private
     * @internal
     */
    abstract _toProto(serializer: JsonProtoSerializer): Value;
    _protoValueType: "ProtoValue";
    /**
     * @private
     * @internal
     */
    abstract _readUserData(context: ParseContext): void;
    /**
     * Creates an expression that adds this expression to another expression.
     *
     * @example
     * ```typescript
     * // Add the value of the 'quantity' field and the 'reserve' field.
     * field("quantity").add(field("reserve"));
     * ```
     *
     * @param second - The expression or literal to add to this expression.
     * @param others - Optional additional expressions or literals to add to this expression.
     * @returns A new `Expression` representing the addition operation.
     */
    add(second: Expression | unknown): FunctionExpression;
    /**
     * @beta
     * Wraps the expression in a [BooleanExpression].
     *
     * @returns A [BooleanExpression] representing the same expression.
     */
    asBoolean(): BooleanExpression;
    /**
     * @beta
     * Creates an expression that subtracts another expression from this expression.
     *
     * @example
     * ```typescript
     * // Subtract the 'discount' field from the 'price' field
     * field("price").subtract(field("discount"));
     * ```
     *
     * @param subtrahend - The expression to subtract from this expression.
     * @returns A new `Expression` representing the subtraction operation.
     */
    subtract(subtrahend: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that subtracts a constant value from this expression.
     *
     * @example
     * ```typescript
     * // Subtract 20 from the value of the 'total' field
     * field("total").subtract(20);
     * ```
     *
     * @param subtrahend - The constant value to subtract.
     * @returns A new `Expression` representing the subtraction operation.
     */
    subtract(subtrahend: number): FunctionExpression;
    /**
     * @beta
     * Creates an expression that multiplies this expression by another expression.
     *
     * @example
     * ```typescript
     * // Multiply the 'quantity' field by the 'price' field
     * field("quantity").multiply(field("price"));
     * ```
     *
     * @param second - The second expression or literal to multiply by.
     * @param others - Optional additional expressions or literals to multiply by.
     * @returns A new `Expression` representing the multiplication operation.
     */
    multiply(second: Expression | number): FunctionExpression;
    /**
     * @beta
     * Creates an expression that divides this expression by another expression.
     *
     * @example
     * ```typescript
     * // Divide the 'total' field by the 'count' field
     * field("total").divide(field("count"));
     * ```
     *
     * @param divisor - The expression to divide by.
     * @returns A new `Expression` representing the division operation.
     */
    divide(divisor: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that divides this expression by a constant value.
     *
     * @example
     * ```typescript
     * // Divide the 'value' field by 10
     * field("value").divide(10);
     * ```
     *
     * @param divisor - The constant value to divide by.
     * @returns A new `Expression` representing the division operation.
     */
    divide(divisor: number): FunctionExpression;
    /**
     * @beta
     * Creates an expression that calculates the modulo (remainder) of dividing this expression by another expression.
     *
     * @example
     * ```typescript
     * // Calculate the remainder of dividing the 'value' field by the 'divisor' field
     * field("value").mod(field("divisor"));
     * ```
     *
     * @param expression - The expression to divide by.
     * @returns A new `Expression` representing the modulo operation.
     */
    mod(expression: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that calculates the modulo (remainder) of dividing this expression by a constant value.
     *
     * @example
     * ```typescript
     * // Calculate the remainder of dividing the 'value' field by 10
     * field("value").mod(10);
     * ```
     *
     * @param value - The constant value to divide by.
     * @returns A new `Expression` representing the modulo operation.
     */
    mod(value: number): FunctionExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is equal to another expression.
     *
     * @example
     * ```typescript
     * // Check if the 'age' field is equal to 21
     * field("age").equal(21);
     * ```
     *
     * @param expression - The expression to compare for equality.
     * @returns A new `Expression` representing the equality comparison.
     */
    equal(expression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is equal to a constant value.
     *
     * @example
     * ```typescript
     * // Check if the 'city' field is equal to "London"
     * field("city").equal("London");
     * ```
     *
     * @param value - The constant value to compare for equality.
     * @returns A new `Expression` representing the equality comparison.
     */
    equal(value: unknown): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is not equal to another expression.
     *
     * @example
     * ```typescript
     * // Check if the 'status' field is not equal to "completed"
     * field("status").notEqual("completed");
     * ```
     *
     * @param expression - The expression to compare for inequality.
     * @returns A new `Expression` representing the inequality comparison.
     */
    notEqual(expression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is not equal to a constant value.
     *
     * @example
     * ```typescript
     * // Check if the 'country' field is not equal to "USA"
     * field("country").notEqual("USA");
     * ```
     *
     * @param value - The constant value to compare for inequality.
     * @returns A new `Expression` representing the inequality comparison.
     */
    notEqual(value: unknown): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is less than another expression.
     *
     * @example
     * ```typescript
     * // Check if the 'age' field is less than 'limit'
     * field("age").lessThan(field('limit'));
     * ```
     *
     * @param experession - The expression to compare for less than.
     * @returns A new `Expression` representing the less than comparison.
     */
    lessThan(experession: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is less than a constant value.
     *
     * @example
     * ```typescript
     * // Check if the 'price' field is less than 50
     * field("price").lessThan(50);
     * ```
     *
     * @param value - The constant value to compare for less than.
     * @returns A new `Expression` representing the less than comparison.
     */
    lessThan(value: unknown): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is less than or equal to another
     * expression.
     *
     * @example
     * ```typescript
     * // Check if the 'quantity' field is less than or equal to 20
     * field("quantity").lessThan(constant(20));
     * ```
     *
     * @param expression - The expression to compare for less than or equal to.
     * @returns A new `Expression` representing the less than or equal to comparison.
     */
    lessThanOrEqual(expression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is less than or equal to a constant value.
     *
     * @example
     * ```typescript
     * // Check if the 'score' field is less than or equal to 70
     * field("score").lessThan(70);
     * ```
     *
     * @param value - The constant value to compare for less than or equal to.
     * @returns A new `Expression` representing the less than or equal to comparison.
     */
    lessThanOrEqual(value: unknown): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is greater than another expression.
     *
     * @example
     * ```typescript
     * // Check if the 'age' field is greater than the 'limit' field
     * field("age").greaterThan(field("limit"));
     * ```
     *
     * @param expression - The expression to compare for greater than.
     * @returns A new `Expression` representing the greater than comparison.
     */
    greaterThan(expression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is greater than a constant value.
     *
     * @example
     * ```typescript
     * // Check if the 'price' field is greater than 100
     * field("price").greaterThan(100);
     * ```
     *
     * @param value - The constant value to compare for greater than.
     * @returns A new `Expression` representing the greater than comparison.
     */
    greaterThan(value: unknown): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is greater than or equal to another
     * expression.
     *
     * @example
     * ```typescript
     * // Check if the 'quantity' field is greater than or equal to field 'requirement' plus 1
     * field("quantity").greaterThanOrEqual(field('requirement').add(1));
     * ```
     *
     * @param expression - The expression to compare for greater than or equal to.
     * @returns A new `Expression` representing the greater than or equal to comparison.
     */
    greaterThanOrEqual(expression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is greater than or equal to a constant
     * value.
     *
     * @example
     * ```typescript
     * // Check if the 'score' field is greater than or equal to 80
     * field("score").greaterThanOrEqual(80);
     * ```
     *
     * @param value - The constant value to compare for greater than or equal to.
     * @returns A new `Expression` representing the greater than or equal to comparison.
     */
    greaterThanOrEqual(value: unknown): BooleanExpression;
    /**
     * @beta
     * Creates an expression that concatenates an array expression with one or more other arrays.
     *
     * @example
     * ```typescript
     * // Combine the 'items' array with another array field.
     * field("items").arrayConcat(field("otherItems"));
     * ```
     * @param secondArray - Second array expression or array literal to concatenate.
     * @param otherArrays - Optional additional array expressions or array literals to concatenate.
     * @returns A new `Expression` representing the concatenated array.
     */
    arrayConcat(secondArray: Expression | unknown[], ...otherArrays: Array<Expression | unknown[]>): FunctionExpression;
    /**
     * @beta
     * Creates an expression that checks if an array contains a specific element.
     *
     * @example
     * ```typescript
     * // Check if the 'sizes' array contains the value from the 'selectedSize' field
     * field("sizes").arrayContains(field("selectedSize"));
     * ```
     *
     * @param expression - The element to search for in the array.
     * @returns A new `Expression` representing the 'array_contains' comparison.
     */
    arrayContains(expression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if an array contains a specific value.
     *
     * @example
     * ```typescript
     * // Check if the 'colors' array contains "red"
     * field("colors").arrayContains("red");
     * ```
     *
     * @param value - The element to search for in the array.
     * @returns A new `Expression` representing the 'array_contains' comparison.
     */
    arrayContains(value: unknown): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if an array contains all the specified elements.
     *
     * @example
     * ```typescript
     * // Check if the 'tags' array contains both the value in field "tag1" and the literal value "tag2"
     * field("tags").arrayContainsAll([field("tag1"), "tag2"]);
     * ```
     *
     * @param values - The elements to check for in the array.
     * @returns A new `Expression` representing the 'array_contains_all' comparison.
     */
    arrayContainsAll(values: Array<Expression | unknown>): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if an array contains all the specified elements.
     *
     * @example
     * ```typescript
     * // Check if the 'tags' array contains both of the values from field "tag1" and the literal value "tag2"
     * field("tags").arrayContainsAll(array([field("tag1"), "tag2"]));
     * ```
     *
     * @param arrayExpression - The elements to check for in the array.
     * @returns A new `Expression` representing the 'array_contains_all' comparison.
     */
    arrayContainsAll(arrayExpression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if an array contains any of the specified elements.
     *
     * @example
     * ```typescript
     * // Check if the 'categories' array contains either values from field "cate1" or "cate2"
     * field("categories").arrayContainsAny([field("cate1"), field("cate2")]);
     * ```
     *
     * @param values - The elements to check for in the array.
     * @returns A new `Expression` representing the 'array_contains_any' comparison.
     */
    arrayContainsAny(values: Array<Expression | unknown>): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if an array contains any of the specified elements.
     *
     * @example
     * ```typescript
     * // Check if the 'groups' array contains either the value from the 'userGroup' field
     * // or the value "guest"
     * field("groups").arrayContainsAny(array([field("userGroup"), "guest"]));
     * ```
     *
     * @param arrayExpression - The elements to check for in the array.
     * @returns A new `Expression` representing the 'array_contains_any' comparison.
     */
    arrayContainsAny(arrayExpression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that reverses an array.
     *
     * @example
     * ```typescript
     * // Reverse the value of the 'myArray' field.
     * field("myArray").arrayReverse();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed array.
     */
    arrayReverse(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that calculates the length of an array.
     *
     * @example
     * ```typescript
     * // Get the number of items in the 'cart' array
     * field("cart").arrayLength();
     * ```
     *
     * @returns A new `Expression` representing the length of the array.
     */
    arrayLength(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is equal to any of the provided values or
     * expressions.
     *
     * @example
     * ```typescript
     * // Check if the 'category' field is either "Electronics" or value of field 'primaryType'
     * field("category").equalAny(["Electronics", field("primaryType")]);
     * ```
     *
     * @param values - The values or expressions to check against.
     * @returns A new `Expression` representing the 'IN' comparison.
     */
    equalAny(values: Array<Expression | unknown>): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is equal to any of the provided values or
     * expressions.
     *
     * @example
     * ```typescript
     * // Check if the 'category' field is either "Electronics" or value of field 'primaryType'
     * field("category").equalAny(array(["Electronics", field("primaryType")]));
     * ```
     *
     * @param arrayExpression - An expression that evaluates to an array of values to check against.
     * @returns A new `Expression` representing the 'IN' comparison.
     */
    equalAny(arrayExpression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is not equal to any of the provided values or
     * expressions.
     *
     * @example
     * ```typescript
     * // Check if the 'status' field is neither "pending" nor the value of 'rejectedStatus'
     * field("status").notEqualAny(["pending", field("rejectedStatus")]);
     * ```
     *
     * @param values - The values or expressions to check against.
     * @returns A new `Expression` representing the 'notEqualAny' comparison.
     */
    notEqualAny(values: Array<Expression | unknown>): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if this expression is not equal to any of the values in the evaluated expression.
     *
     * @example
     * ```typescript
     * // Check if the 'status' field is not equal to any value in the field 'rejectedStatuses'
     * field("status").notEqualAny(field('rejectedStatuses'));
     * ```
     *
     * @param arrayExpression - The values or expressions to check against.
     * @returns A new `Expression` representing the 'notEqualAny' comparison.
     */
    notEqualAny(arrayExpression: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a field exists in the document.
     *
     * @example
     * ```typescript
     * // Check if the document has a field named "phoneNumber"
     * field("phoneNumber").exists();
     * ```
     *
     * @returns A new `Expression` representing the 'exists' check.
     */
    exists(): BooleanExpression;
    /**
     * @beta
     * Creates an expression that calculates the character length of a string in UTF-8.
     *
     * @example
     * ```typescript
     * // Get the character length of the 'name' field in its UTF-8 form.
     * field("name").charLength();
     * ```
     *
     * @returns A new `Expression` representing the length of the string.
     */
    charLength(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that performs a case-sensitive string comparison.
     *
     * @example
     * ```typescript
     * // Check if the 'title' field contains the word "guide" (case-sensitive)
     * field("title").like("%guide%");
     * ```
     *
     * @param pattern - The pattern to search for. You can use "%" as a wildcard character.
     * @returns A new `Expression` representing the 'like' comparison.
     */
    like(pattern: string): BooleanExpression;
    /**
     * @beta
     * Creates an expression that performs a case-sensitive string comparison.
     *
     * @example
     * ```typescript
     * // Check if the 'title' field contains the word "guide" (case-sensitive)
     * field("title").like("%guide%");
     * ```
     *
     * @param pattern - The pattern to search for. You can use "%" as a wildcard character.
     * @returns A new `Expression` representing the 'like' comparison.
     */
    like(pattern: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a string contains a specified regular expression as a
     * substring.
     *
     * @example
     * ```typescript
     * // Check if the 'description' field contains "example" (case-insensitive)
     * field("description").regexContains("(?i)example");
     * ```
     *
     * @param pattern - The regular expression to use for the search.
     * @returns A new `Expression` representing the 'contains' comparison.
     */
    regexContains(pattern: string): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a string contains a specified regular expression as a
     * substring.
     *
     * @example
     * ```typescript
     * // Check if the 'description' field contains the regular expression stored in field 'regex'
     * field("description").regexContains(field("regex"));
     * ```
     *
     * @param pattern - The regular expression to use for the search.
     * @returns A new `Expression` representing the 'contains' comparison.
     */
    regexContains(pattern: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that returns the first substring of a string expression that matches
     * a specified regular expression.
     *
     * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
     *
     * @example
     * ```typescript
     * // Extract the domain from an email address
     * field("email").regexFind("@.+")
     * ```
     *
     * @param pattern - The regular expression to search for.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression find function.
     */
    regexFind(pattern: string): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the first substring of a string expression that matches
     * a specified regular expression.
     *
     * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
     *
     * @example
     * ```typescript
     * // Extract the domain from an email address
     * field("email").regexFind(field("domain"))
     * ```
     *
     * @param pattern - The regular expression to search for.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression find function.
     */
    regexFind(pattern: Expression): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that evaluates to a list of all substrings in this string expression that
     * match a specified regular expression.
     *
     * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
     *
     * @example
     * ```typescript
     * // Extract all hashtags from a post content field
     * field("content").regexFindAll("#[A-Za-z0-9_]+")
     * ```
     *
     * @param pattern - The regular expression to search for.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} that evaluates to an array of matched substrings.
     */
    regexFindAll(pattern: string): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that evaluates to a list of all substrings in this string expression that
     * match a specified regular expression.
     *
     * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
     *
     * @example
     * ```typescript
     * // Extract all names from a post content field
     * field("content").regexFindAll(field("names"))
     * ```
     *
     * @param pattern - The regular expression to search for.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} that evaluates to an array of matched substrings.
     */
    regexFindAll(pattern: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that checks if a string matches a specified regular expression.
     *
     * @example
     * ```typescript
     * // Check if the 'email' field matches a valid email pattern
     * field("email").regexMatch("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
     * ```
     *
     * @param pattern - The regular expression to use for the match.
     * @returns A new `Expression` representing the regular expression match.
     */
    regexMatch(pattern: string): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a string matches a specified regular expression.
     *
     * @example
     * ```typescript
     * // Check if the 'email' field matches a regular expression stored in field 'regex'
     * field("email").regexMatch(field("regex"));
     * ```
     *
     * @param pattern - The regular expression to use for the match.
     * @returns A new `Expression` representing the regular expression match.
     */
    regexMatch(pattern: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a string contains a specified substring.
     *
     * @example
     * ```typescript
     * // Check if the 'description' field contains "example".
     * field("description").stringContains("example");
     * ```
     *
     * @param substring - The substring to search for.
     * @returns A new `Expression` representing the 'contains' comparison.
     */
    stringContains(substring: string): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a string contains the string represented by another expression.
     *
     * @example
     * ```typescript
     * // Check if the 'description' field contains the value of the 'keyword' field.
     * field("description").stringContains(field("keyword"));
     * ```
     *
     * @param expr - The expression representing the substring to search for.
     * @returns A new `Expression` representing the 'contains' comparison.
     */
    stringContains(expr: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a string starts with a given prefix.
     *
     * @example
     * ```typescript
     * // Check if the 'name' field starts with "Mr."
     * field("name").startsWith("Mr.");
     * ```
     *
     * @param prefix - The prefix to check for.
     * @returns A new `Expression` representing the 'starts with' comparison.
     */
    startsWith(prefix: string): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a string starts with a given prefix (represented as an
     * expression).
     *
     * @example
     * ```typescript
     * // Check if the 'fullName' field starts with the value of the 'firstName' field
     * field("fullName").startsWith(field("firstName"));
     * ```
     *
     * @param prefix - The prefix expression to check for.
     * @returns A new `Expression` representing the 'starts with' comparison.
     */
    startsWith(prefix: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a string ends with a given postfix.
     *
     * @example
     * ```typescript
     * // Check if the 'filename' field ends with ".txt"
     * field("filename").endsWith(".txt");
     * ```
     *
     * @param suffix - The postfix to check for.
     * @returns A new `Expression` representing the 'ends with' comparison.
     */
    endsWith(suffix: string): BooleanExpression;
    /**
     * @beta
     * Creates an expression that checks if a string ends with a given postfix (represented as an
     * expression).
     *
     * @example
     * ```typescript
     * // Check if the 'url' field ends with the value of the 'extension' field
     * field("url").endsWith(field("extension"));
     * ```
     *
     * @param suffix - The postfix expression to check for.
     * @returns A new `Expression` representing the 'ends with' comparison.
     */
    endsWith(suffix: Expression): BooleanExpression;
    /**
     * @beta
     * Creates an expression that converts a string to lowercase.
     *
     * @example
     * ```typescript
     * // Convert the 'name' field to lowercase
     * field("name").toLower();
     * ```
     *
     * @returns A new `Expression` representing the lowercase string.
     */
    toLower(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that converts a string to uppercase.
     *
     * @example
     * ```typescript
     * // Convert the 'title' field to uppercase
     * field("title").toUpper();
     * ```
     *
     * @returns A new `Expression` representing the uppercase string.
     */
    toUpper(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that removes leading and trailing characters from a string or byte array.
     *
     * @example
     * ```typescript
     * // Trim whitespace from the 'userInput' field
     * field("userInput").trim();
     *
     * // Trim quotes from the 'userInput' field
     * field("userInput").trim('"');
     * ```
     * @param valueToTrim - Optional This parameter is treated as a set of characters or bytes that will be
     * trimmed from the input. If not specified, then whitespace will be trimmed.
     * @returns A new `Expression` representing the trimmed string or byte array.
     */
    trim(valueToTrim?: string | Expression | Bytes): FunctionExpression;
    /**
     * @beta
     * Trims whitespace or a specified set of characters/bytes from the beginning of a string or byte array.
     *
     * @example
     * ```typescript
     * // Trim whitespace from the beginning of the 'userInput' field
     * field("userInput").ltrim();
     *
     * // Trim quotes from the beginning of the 'userInput' field
     * field("userInput").ltrim('"');
     * ```
     *
     * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
     * If not specified, whitespace will be trimmed.
     * @returns A new `Expression` representing the trimmed string.
     */
    ltrim(valueToTrim?: string | Expression | Bytes): FunctionExpression;
    /**
     * @beta
     * Trims whitespace or a specified set of characters/bytes from the end of a string or byte array.
     *
     * @example
     * ```typescript
     * // Trim whitespace from the end of the 'userInput' field
     * field("userInput").rtrim();
     *
     * // Trim quotes from the end of the 'userInput' field
     * field("userInput").rtrim('"');
     * ```
     *
     * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
     * If not specified, whitespace will be trimmed.
     * @returns A new `Expression` representing the trimmed string or byte array.
     */
    rtrim(valueToTrim?: string | Expression | Bytes): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the data type of this expression's result, as a string.
     *
     * @remarks
     * This is evaluated on the backend. This means:
     * 1. Generic typed elements (like `array<string>`) evaluate strictly to the primitive `'array'`.
     * 2. Any custom `FirestoreDataConverter` mappings are ignored.
     * 3. For numeric values, the backend does not yield the JavaScript `"number"` type; it evaluates
     *    precisely as `"int64"` or `"float64"`.
     * 4. For date or timestamp objects, the backend evaluates to `"timestamp"`.
     *
     * @example
     * ```typescript
     * // Get the data type of the value in field 'title'
     * field('title').type()
     * ```
     *
     * @returns A new `Expression` representing the data type.
     */
    type(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that checks if the result of this expression is of the given type.
     *
     * @remarks Null or undefined fields evaluate to skip/error. Use `ifAbsent()` / `isAbsent()` to evaluate missing data.
     *
     * @example
     * ```typescript
     * // Check if the 'price' field is specifically an integer (not just 'number')
     * field('price').isType('int64');
     * ```
     *
     * @param type - The type to check for.
     * @returns A new `BooleanExpression` that evaluates to true if the expression's result is of the given type, false otherwise.
     */
    isType(type: Type): BooleanExpression;
    /**
     * @beta
     * Creates an expression that concatenates string expressions together.
     *
     * @example
     * ```typescript
     * // Combine the 'firstName', " ", and 'lastName' fields into a single string
     * field("firstName").stringConcat(constant(" "), field("lastName"));
     * ```
     *
     * @param secondString - The additional expression or string literal to concatenate.
     * @param otherStrings - Optional additional expressions or string literals to concatenate.
     * @returns A new `Expression` representing the concatenated string.
     */
    stringConcat(secondString: Expression | string, ...otherStrings: Array<Expression | string>): FunctionExpression;
    /**
     * @beta
     * Creates an expression that finds the index of the first occurrence of a substring or byte sequence.
     *
     * @example
     * ```typescript
     * // Find the index of "foo" in the 'text' field
     * field("text").stringIndexOf("foo");
     * ```
     *
     * @param search - The substring or byte sequence to search for.
     * @returns A new `Expression` representing the index of the first occurrence.
     */
    stringIndexOf(search: string | Expression | Bytes): FunctionExpression;
    /**
     * @beta
     * Creates an expression that repeats a string or byte array a specified number of times.
     *
     * @example
     * ```typescript
     * // Repeat the 'label' field 3 times
     * field("label").stringRepeat(3);
     * ```
     *
     * @param repetitions - The number of times to repeat the string or byte array.
     * @returns A new `Expression` representing the repeated string or byte array.
     */
    stringRepeat(repetitions: number | Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that replaces all occurrences of a substring or byte sequence with a replacement.
     *
     * @example
     * ```typescript
     * // Replace all occurrences of "foo" with "bar" in the 'text' field
     * field("text").stringReplaceAll("foo", "bar");
     * ```
     *
     * @param find - The substring or byte sequence to search for.
     * @param replacement - The replacement string or byte sequence.
     * @returns A new `Expression` representing the string or byte array with replacements.
     */
    stringReplaceAll(find: string | Expression | Bytes, replacement: string | Expression | Bytes): FunctionExpression;
    /**
     * @beta
     * Creates an expression that replaces the first occurrence of a substring or byte sequence with a replacement.
     *
     * @example
     * ```typescript
     * // Replace the first occurrence of "foo" with "bar" in the 'text' field
     * field("text").stringReplaceOne("foo", "bar");
     * ```
     *
     * @param find - The substring or byte sequence to search for.
     * @param replacement - The replacement string or byte sequence.
     * @returns A new `Expression` representing the string or byte array with the replacement.
     */
    stringReplaceOne(find: string | Expression | Bytes, replacement: string | Expression | Bytes): FunctionExpression;
    /**
     * @beta
     * Creates an expression that concatenates expression results together.
     *
     * @example
     * ```typescript
     * // Combine the 'firstName', ' ', and 'lastName' fields into a single value.
     * field("firstName").concat(constant(" "), field("lastName"));
     * ```
     *
     * @param second - The additional expression or literal to concatenate.
     * @param others - Optional additional expressions or literals to concatenate.
     * @returns A new `Expression` representing the concatenated value.
     */
    concat(second: Expression | unknown, ...others: Array<Expression | unknown>): FunctionExpression;
    /**
     * @beta
     * Creates an expression that reverses this string expression.
     *
     * @example
     * ```typescript
     * // Reverse the value of the 'myString' field.
     * field("myString").reverse();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
     */
    reverse(): FunctionExpression;
    /**
     * @beta
     * Returns the first element of the array.
     *
     * @example
     * ```typescript
     * // Get the first element of the 'myArray' field.
     * field("myArray").arrayFirst();
     * ```
     *
     * @returns A new `Expression` representing the first element.
     */
    arrayFirst(): FunctionExpression;
    /**
     * @beta
     * Returns the first `n` elements of the array.
     *
     * @example
     * ```typescript
     * // Get the first 3 elements of the 'myArray' field.
     * field("myArray").arrayFirstN(3);
     * ```
     *
     * @param n - The number of elements to return.
     * @returns A new `Expression` representing the first `n` elements.
     */
    arrayFirstN(n: number): FunctionExpression;
    /**
     * @beta
     * Returns the first `n` elements of the array.
     *
     * @example
     * ```typescript
     * // Get the first n elements of the 'myArray' field.
     * field("myArray").arrayFirstN(field("count"));
     * ```
     *
     * @param n - An expression evaluating to the number of elements to return.
     * @returns A new `Expression` representing the first `n` elements.
     */
    arrayFirstN(n: Expression): FunctionExpression;
    /**
     * @beta
     * Returns the last element of the array.
     *
     * @example
     * ```typescript
     * // Get the last element of the 'myArray' field.
     * field("myArray").arrayLast();
     * ```
     *
     * @returns A new `Expression` representing the last element.
     */
    arrayLast(): FunctionExpression;
    /**
     * @beta
     * Returns the last `n` elements of the array.
     *
     * @example
     * ```typescript
     * // Get the last 3 elements of the 'myArray' field.
     * field("myArray").arrayLastN(3);
     * ```
     *
     * @param n - The number of elements to return.
     * @returns A new `Expression` representing the last `n` elements.
     */
    arrayLastN(n: number): FunctionExpression;
    /**
     * @beta
     * Returns the last `n` elements of the array.
     *
     * @example
     * ```typescript
     * // Get the last n elements of the 'myArray' field.
     * field("myArray").arrayLastN(field("count"));
     * ```
     *
     * @param n - An expression evaluating to the number of elements to return.
     * @returns A new `Expression` representing the last `n` elements.
     */
    arrayLastN(n: Expression): FunctionExpression;
    /**
     * @beta
     * Returns the maximum value in the array.
     *
     * @example
     * ```typescript
     * // Get the maximum value of the 'myArray' field.
     * field("myArray").arrayMaximum();
     * ```
     *
     * @returns A new `Expression` representing the maximum value.
     */
    arrayMaximum(): FunctionExpression;
    /**
     * @beta
     * Returns the largest `n` elements of the array.
     *
     * Note: Returns the n largest non-null elements in the array, in descending
     * order. This does not use a stable sort, meaning the order of equivalent
     * elements is undefined.
     *
     * @example
     * ```typescript
     * // Get the largest 3 elements of the 'myArray' field.
     * field("myArray").arrayMaximumN(3);
     * ```
     *
     * @param n - The number of elements to return.
     * @returns A new `Expression` representing the largest `n` elements.
     */
    arrayMaximumN(n: number): FunctionExpression;
    /**
     * @beta
     * Returns the largest `n` elements of the array.
     *
     * Note: Returns the n largest non-null elements in the array, in descending
     * order. This does not use a stable sort, meaning the order of equivalent
     * elements is undefined.
     *
     * @example
     * ```typescript
     * // Get the largest n elements of the 'myArray' field.
     * field("myArray").arrayMaximumN(field("count"));
     * ```
     *
     * @param n - An expression evaluating to the number of elements to return.
     * @returns A new `Expression` representing the largest `n` elements.
     */
    arrayMaximumN(n: Expression): FunctionExpression;
    /**
     * @beta
     * Returns the minimum value in the array.
     *
     * @example
     * ```typescript
     * // Get the minimum value of the 'myArray' field.
     * field("myArray").arrayMinimum();
     * ```
     *
     * @returns A new `Expression` representing the minimum value.
     */
    arrayMinimum(): FunctionExpression;
    /**
     * @beta
     * Returns the smallest `n` elements of the array.
     *
     * Note: Returns the n smallest non-null elements in the array, in ascending
     * order. This does not use a stable sort, meaning the order of equivalent
     * elements is undefined.
     *
     * @example
     * ```typescript
     * // Get the smallest 3 elements of the 'myArray' field.
     * field("myArray").arrayMinimumN(3);
     * ```
     *
     * @param n - The number of elements to return.
     * @returns A new `Expression` representing the smallest `n` elements.
     */
    arrayMinimumN(n: number): FunctionExpression;
    /**
     * @beta
     * Returns the smallest `n` elements of the array.
     *
     * Note: Returns the n smallest non-null elements in the array, in ascending
     * order. This does not use a stable sort, meaning the order of equivalent
     * elements is undefined.
     *
     * @example
     * ```typescript
     * // Get the smallest n elements of the 'myArray' field.
     * field("myArray").arrayMinimumN(field("count"));
     * ```
     *
     * @param n - An expression evaluating to the number of elements to return.
     * @returns A new `Expression` representing the smallest `n` elements.
     */
    arrayMinimumN(n: Expression): FunctionExpression;
    /**
     * @beta
     * Returns the first index of the search value in the array, or -1 if not found.
     *
     * @example
     * ```typescript
     * // Get the first index of the value 3 in the 'myArray' field.
     * field("myArray").arrayIndexOf(3);
     * ```
     *
     * @param search - The value to search for.
     * @returns A new `Expression` representing the index.
     */
    arrayIndexOf(search: unknown): FunctionExpression;
    /**
     * @beta
     * Returns the first index of the search value in the array, or -1 if not found.
     *
     * @example
     * ```typescript
     * // Get the first index of the value in 'searchVal' field in the 'myArray' field.
     * field("myArray").arrayIndexOf(field("searchVal"));
     * ```
     *
     * @param search - An expression evaluating to the value to search for.
     * @returns A new `Expression` representing the index.
     */
    arrayIndexOf(search: Expression): FunctionExpression;
    /**
     * @beta
     * Returns the last index of the search value in the array, or -1 if not found.
     *
     * @example
     * ```typescript
     * // Get the last index of the value 3 in the 'myArray' field.
     * field("myArray").arrayLastIndexOf(3);
     * ```
     *
     * @param search - The value to search for.
     * @returns A new `Expression` representing the index.
     */
    arrayLastIndexOf(search: unknown): FunctionExpression;
    /**
     * @beta
     * Returns the last index of the search value in the array, or -1 if not found.
     *
     * @example
     * ```typescript
     * // Get the last index of the value in 'searchVal' field in the 'myArray' field.
     * field("myArray").arrayLastIndexOf(field("searchVal"));
     * ```
     *
     * @param search - An expression evaluating to the value to search for.
     * @returns A new `Expression` representing the index.
     */
    arrayLastIndexOf(search: Expression): FunctionExpression;
    /**
     * @beta
     * Returns all indices of the search value in the array.
     *
     * @example
     * ```typescript
     * // Get all indices of the value 3 in the 'myArray' field.
     * field("myArray").arrayIndexOfAll(3);
     * ```
     *
     * @param search - The value to search for.
     * @returns A new `Expression` representing the indices.
     */
    arrayIndexOfAll(search: unknown): FunctionExpression;
    /**
     * @beta
     * Returns all indices of the search value in the array.
     *
     * @example
     * ```typescript
     * // Get all indices of the value in 'searchVal' field in the 'myArray' field.
     * field("myArray").arrayIndexOfAll(field("searchVal"));
     * ```
     *
     * @param search - An expression evaluating to the value to search for.
     * @returns A new `Expression` representing the indices.
     */
    arrayIndexOfAll(search: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that calculates the length of this string expression in bytes.
     *
     * @example
     * ```typescript
     * // Calculate the length of the 'myString' field in bytes.
     * field("myString").byteLength();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the string in bytes.
     */
    byteLength(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that computes the ceiling of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the ceiling of the 'price' field.
     * field("price").ceil();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the ceiling of the numeric value.
     */
    ceil(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that computes the floor of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the floor of the 'price' field.
     * field("price").floor();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the floor of the numeric value.
     */
    floor(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that computes the absolute value of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the absolute value of the 'price' field.
     * field("price").abs();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the absolute value of the numeric value.
     */
    abs(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that computes e to the power of this expression.
     *
     * @example
     * ```typescript
     * // Compute e to the power of the 'value' field.
     * field("value").exp();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the exp of the numeric value.
     */
    exp(): FunctionExpression;
    /**
     * @beta
     * Accesses a value from a map (object) field using the provided key.
     *
     * @example
     * ```typescript
     * // Get the 'city' value from the 'address' map field
     * field("address").mapGet("city");
     * ```
     *
     * @param subfield - The key to access in the map.
     * @returns A new `Expression` representing the value associated with the given key in the map.
     */
    mapGet(subfield: string): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns a new map with the specified entries added or updated.
     *
     * @remarks
     * Note that `mapSet` only performs shallow updates to the map. Setting a value to `null`
     * will retain the key with a `null` value. To remove a key entirely, use `mapRemove`.
     *
     * @example
     * ```typescript
     * // Set the 'city' to "San Francisco" in the 'address' map
     * field("address").mapSet("city", "San Francisco");
     * ```
     *
     * @param key - The key to set. Must be a string or a constant string expression.
     * @param value - The value to set.
     * @param moreKeyValues - Additional key-value pairs to set.
     * @returns A new `Expression` representing the map with the entries set.
     */
    mapSet(key: string | Expression, value: unknown, ...moreKeyValues: unknown[]): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the keys of a map.
     *
     * @remarks
     * While the backend generally preserves insertion order, relying on the
     * order of the output array is not guaranteed and should be avoided.
     *
     * @example
     * ```typescript
     * // Get the keys of the 'address' map
     * field("address").mapKeys();
     * ```
     *
     * @returns A new `Expression` representing the keys of the map.
     */
    mapKeys(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the values of a map.
     *
     * @remarks
     * While the backend generally preserves insertion order, relying on the
     * order of the output array is not guaranteed and should be avoided.
     *
     * @example
     * ```typescript
     * // Get the values of the 'address' map
     * field("address").mapValues();
     * ```
     *
     * @returns A new `Expression` representing the values of the map.
     */
    mapValues(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the entries of a map as an array of maps,
     * where each map contains a `"k"` property for the key and a `"v"` property for the value.
     * For example: `[{ k: "key1", v: "value1" }, ...]`.
     *
     * @example
     * ```typescript
     * // Get the entries of the 'address' map
     * field("address").mapEntries();
     * ```
     *
     * @returns A new `Expression` representing the entries of the map.
     */
    mapEntries(): FunctionExpression;
    /**
     * @beta
     * Creates an aggregation that counts the number of stage inputs with valid evaluations of the
     * expression or field.
     *
     * @example
     * ```typescript
     * // Count the total number of products
     * field("productId").count().as("totalProducts");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'count' aggregation.
     */
    count(): AggregateFunction;
    /**
     * @beta
     * Creates an aggregation that calculates the sum of a numeric field across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Calculate the total revenue from a set of orders
     * field("orderAmount").sum().as("totalRevenue");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'sum' aggregation.
     */
    sum(): AggregateFunction;
    /**
     * @beta
     * Creates an aggregation that calculates the average (mean) of a numeric field across multiple
     * stage inputs.
     *
     * @example
     * ```typescript
     * // Calculate the average age of users
     * field("age").average().as("averageAge");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'average' aggregation.
     */
    average(): AggregateFunction;
    /**
     * @beta
     * Creates an aggregation that finds the minimum value of a field across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Find the lowest price of all products
     * field("price").minimum().as("lowestPrice");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'minimum' aggregation.
     */
    minimum(): AggregateFunction;
    /**
     * @beta
     * Creates an aggregation that finds the maximum value of a field across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Find the highest score in a leaderboard
     * field("score").maximum().as("highestScore");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'maximum' aggregation.
     */
    maximum(): AggregateFunction;
    /**
     * @beta
     * Creates an aggregation that finds the first value of an expression across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Find the first value of the 'rating' field
     * field("rating").first().as("firstRating");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'first' aggregation.
     */
    first(): AggregateFunction;
    /**
     * @beta
     * Creates an aggregation that finds the last value of an expression across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Find the last value of the 'rating' field
     * field("rating").last().as("lastRating");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'last' aggregation.
     */
    last(): AggregateFunction;
    /**
     * @beta
     * Creates an aggregation that collects all values of an expression across multiple stage inputs
     * into an array.
     *
     * @remarks
     * If the expression resolves to an absent value, it is converted to `null`.
     * The order of elements in the output array is not stable and shouldn't be relied upon.
     *
     * @example
     * ```typescript
     * // Collect all tags from books into an array
     * field("tags").arrayAgg().as("allTags");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'array_agg' aggregation.
     */
    arrayAgg(): AggregateFunction;
    /**
     * @beta
     * Creates an aggregation that collects all distinct values of an expression across multiple stage
     * inputs into an array.
     *
     * @remarks
     * If the expression resolves to an absent value, it is converted to `null`.
     * The order of elements in the output array is not stable and shouldn't be relied upon.
     *
     * @example
     * ```typescript
     * // Collect all distinct tags from books into an array
     * field("tags").arrayAggDistinct().as("allDistinctTags");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'array_agg_distinct' aggregation.
     */
    arrayAggDistinct(): AggregateFunction;
    /**
     * @beta
     * Creates an aggregation that counts the number of distinct values of the expression or field.
     *
     * @example
     * ```typescript
     * // Count the distinct number of products
     * field("productId").countDistinct().as("distinctProducts");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'count_distinct' aggregation.
     */
    countDistinct(): AggregateFunction;
    /**
     * @beta
     * Creates an expression that returns the larger value between this expression and another expression, based on Firestore's value type ordering.
     *
     * @example
     * ```typescript
     * // Returns the larger value between the 'timestamp' field and the current timestamp.
     * field("timestamp").logicalMaximum(currentTimestamp());
     * ```
     *
     * @param second - The second expression or literal to compare with.
     * @param others - Optional additional expressions or literals to compare with.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical maximum operation.
     */
    logicalMaximum(second: Expression | unknown, ...others: Array<Expression | unknown>): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the smaller value between this expression and another expression, based on Firestore's value type ordering.
     *
     * @example
     * ```typescript
     * // Returns the smaller value between the 'timestamp' field and the current timestamp.
     * field("timestamp").logicalMinimum(currentTimestamp());
     * ```
     *
     * @param second - The second expression or literal to compare with.
     * @param others - Optional additional expressions or literals to compare with.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical minimum operation.
     */
    logicalMinimum(second: Expression | unknown, ...others: Array<Expression | unknown>): FunctionExpression;
    /**
     * @beta
     * Creates an expression that calculates the length (number of dimensions) of this Firestore Vector expression.
     *
     * @example
     * ```typescript
     * // Get the vector length (dimension) of the field 'embedding'.
     * field("embedding").vectorLength();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the vector.
     */
    vectorLength(): FunctionExpression;
    /**
     * @beta
     * Calculates the cosine distance between two vectors.
     *
     * @example
     * ```typescript
     * // Calculate the cosine distance between the 'userVector' field and the 'itemVector' field
     * field("userVector").cosineDistance(field("itemVector"));
     * ```
     *
     * @param vectorExpression - The other vector (represented as an Expression) to compare against.
     * @returns A new `Expression` representing the cosine distance between the two vectors.
     */
    cosineDistance(vectorExpression: Expression): FunctionExpression;
    /**
     * @beta
     * Calculates the Cosine distance between two vectors.
     *
     * @example
     * ```typescript
     * // Calculate the Cosine distance between the 'location' field and a target location
     * field("location").cosineDistance(new VectorValue([37.7749, -122.4194]));
     * ```
     *
     * @param vector - The other vector (as a VectorValue) to compare against.
     * @returns A new `Expression` representing the Cosine* distance between the two vectors.
     */
    cosineDistance(vector: VectorValue | number[]): FunctionExpression;
    /**
     * @beta
     * Calculates the dot product between two vectors.
     *
     * @example
     * ```typescript
     * // Calculate the dot product between a feature vector and a target vector
     * field("features").dotProduct([0.5, 0.8, 0.2]);
     * ```
     *
     * @param vectorExpression - The other vector (as an array of numbers) to calculate with.
     * @returns A new `Expression` representing the dot product between the two vectors.
     */
    dotProduct(vectorExpression: Expression): FunctionExpression;
    /**
     * @beta
     * Calculates the dot product between two vectors.
     *
     * @example
     * ```typescript
     * // Calculate the dot product between a feature vector and a target vector
     * field("features").dotProduct(new VectorValue([0.5, 0.8, 0.2]));
     * ```
     *
     * @param vector - The other vector (as an array of numbers) to calculate with.
     * @returns A new `Expression` representing the dot product between the two vectors.
     */
    dotProduct(vector: VectorValue | number[]): FunctionExpression;
    /**
     * @beta
     * Calculates the Euclidean distance between two vectors.
     *
     * @example
     * ```typescript
     * // Calculate the Euclidean distance between the 'location' field and a target location
     * field("location").euclideanDistance([37.7749, -122.4194]);
     * ```
     *
     * @param vectorExpression - The other vector (as an array of numbers) to calculate with.
     * @returns A new `Expression` representing the Euclidean distance between the two vectors.
     */
    euclideanDistance(vectorExpression: Expression): FunctionExpression;
    /**
     * @beta
     * Calculates the Euclidean distance between two vectors.
     *
     * @example
     * ```typescript
     * // Calculate the Euclidean distance between the 'location' field and a target location
     * field("location").euclideanDistance(new VectorValue([37.7749, -122.4194]));
     * ```
     *
     * @param vector - The other vector (as a VectorValue) to compare against.
     * @returns A new `Expression` representing the Euclidean distance between the two vectors.
     */
    euclideanDistance(vector: VectorValue | number[]): FunctionExpression;
    /**
     * @beta
     * Creates an expression that interprets this expression as the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
     * and returns a timestamp.
     *
     * @example
     * ```typescript
     * // Interpret the 'microseconds' field as microseconds since epoch.
     * field("microseconds").unixMicrosToTimestamp();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
     */
    unixMicrosToTimestamp(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that converts this timestamp expression to the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
     *
     * @example
     * ```typescript
     * // Convert the 'timestamp' field to microseconds since epoch.
     * field("timestamp").timestampToUnixMicros();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of microseconds since epoch.
     */
    timestampToUnixMicros(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that interprets this expression as the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
     * and returns a timestamp.
     *
     * @example
     * ```typescript
     * // Interpret the 'milliseconds' field as milliseconds since epoch.
     * field("milliseconds").unixMillisToTimestamp();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
     */
    unixMillisToTimestamp(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that converts this timestamp expression to the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
     *
     * @example
     * ```typescript
     * // Convert the 'timestamp' field to milliseconds since epoch.
     * field("timestamp").timestampToUnixMillis();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of milliseconds since epoch.
     */
    timestampToUnixMillis(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that interprets this expression as the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC)
     * and returns a timestamp.
     *
     * @example
     * ```typescript
     * // Interpret the 'seconds' field as seconds since epoch.
     * field("seconds").unixSecondsToTimestamp();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
     */
    unixSecondsToTimestamp(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that converts this timestamp expression to the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC).
     *
     * @example
     * ```typescript
     * // Convert the 'timestamp' field to seconds since epoch.
     * field("timestamp").timestampToUnixSeconds();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of seconds since epoch.
     */
    timestampToUnixSeconds(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that adds a specified amount of time to this timestamp expression.
     *
     * @example
     * ```typescript
     * // Add some duration determined by field 'unit' and 'amount' to the 'timestamp' field.
     * field("timestamp").timestampAdd(field("unit"), field("amount"));
     * ```
     *
     * @param unit - The expression evaluates to unit of time, must be one of 'microsecond', 'millisecond', 'second', 'minute', 'hour', 'day'.
     * @param amount - The expression evaluates to amount of the unit.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
     */
    timestampAdd(unit: Expression, amount: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that adds a specified amount of time to this timestamp expression.
     *
     * @example
     * ```typescript
     * // Add 1 day to the 'timestamp' field.
     * field("timestamp").timestampAdd("day", 1);
     * ```
     *
     * @param unit - The unit of time to add (e.g., "day", "hour").
     * @param amount - The amount of time to add.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
     */
    timestampAdd(unit: 'microsecond' | 'millisecond' | 'second' | 'minute' | 'hour' | 'day', amount: number): FunctionExpression;
    /**
     * @beta
     * Creates an expression that subtracts a specified amount of time from this timestamp expression.
     *
     * @example
     * ```typescript
     * // Subtract some duration determined by field 'unit' and 'amount' from the 'timestamp' field.
     * field("timestamp").timestampSubtract(field("unit"), field("amount"));
     * ```
     *
     * @param unit - The expression evaluates to unit of time, must be one of 'microsecond', 'millisecond', 'second', 'minute', 'hour', 'day'.
     * @param amount - The expression evaluates to amount of the unit.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
     */
    timestampSubtract(unit: Expression, amount: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that subtracts a specified amount of time from this timestamp expression.
     *
     * @example
     * ```typescript
     * // Subtract 1 day from the 'timestamp' field.
     * field("timestamp").timestampSubtract("day", 1);
     * ```
     *
     * @param unit - The unit of time to subtract (e.g., "day", "hour").
     * @param amount - The amount of time to subtract.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
     */
    timestampSubtract(unit: 'microsecond' | 'millisecond' | 'second' | 'minute' | 'hour' | 'day', amount: number): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that returns the document ID from a path.
     *
     * @example
     * ```typescript
     * // Get the document ID from a path.
     * field("__path__").documentId();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the documentId operation.
     */
    documentId(): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that returns a substring of the results of this expression.
     *
     * @param position - Index of the first character of the substring.
     * @param length - Length of the substring. If not provided, the substring will
     * end at the end of the input.
     */
    substring(position: number, length?: number): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that returns a substring of the results of this expression.
     *
     * @param position - An expression returning the index of the first character of the substring.
     * @param length - An expression returning the length of the substring. If not provided the
     * substring will end at the end of the input.
     */
    substring(position: Expression, length?: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that indexes into an array from the beginning or end
     * and returns the element. If the offset exceeds the array length, an error is
     * returned. A negative offset, starts from the end.
     *
     * @example
     * ```typescript
     * // Return the value in the 'tags' field array at index `1`.
     * field('tags').arrayGet(1);
     * ```
     *
     * @param offset - The index of the element to return.
     * @returns A new `Expression` representing the 'arrayGet' operation.
     */
    arrayGet(offset: number): FunctionExpression;
    /**
     * @beta
     * Creates an expression that indexes into an array from the beginning or end
     * and returns the element. If the offset exceeds the array length, an error is
     * returned. A negative offset, starts from the end.
     *
     * @example
     * ```typescript
     * // Return the value in the tags field array at index specified by field
     * // 'favoriteTag'.
     * field('tags').arrayGet(field('favoriteTag'));
     * ```
     *
     * @param offsetExpr - An `Expression` evaluating to the index of the element to return.
     * @returns A new `Expression` representing the 'arrayGet' operation.
     */
    arrayGet(offsetExpr: Expression): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that checks if a given expression produces an error.
     *
     * @example
     * ```typescript
     * // Check if the result of a calculation is an error
     * field("title").arrayContains(1).isError();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#BooleanExpression} representing the 'isError' check.
     */
    isError(): BooleanExpression;
    /**
     * @beta
     *
     * Creates an expression that returns the result of the `catchExpr` argument
     * if there is an error, else return the result of this expression.
     *
     * @example
     * ```typescript
     * // Returns the first item in the title field arrays, or returns
     * // the entire title field if the array is empty or the field is another type.
     * field("title").arrayGet(0).ifError(field("title"));
     * ```
     *
     * @param catchExpr - The catch expression that will be evaluated and
     * returned if this expression produces an error.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ifError' operation.
     */
    ifError(catchExpr: Expression): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that returns the `catch` argument if there is an
     * error, else return the result of this expression.
     *
     * @example
     * ```typescript
     * // Returns the first item in the title field arrays, or returns
     * // "Default Title"
     * field("title").arrayGet(0).ifError("Default Title");
     * ```
     *
     * @param catchValue - The value that will be returned if this expression
     * produces an error.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ifError' operation.
     */
    ifError(catchValue: unknown): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that returns `true` if the result of this expression
     * is absent. Otherwise, returns `false` even if the value is `null`.
     *
     * @example
     * ```typescript
     * // Check if the field `value` is absent.
     * field("value").isAbsent();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#BooleanExpression} representing the 'isAbsent' check.
     */
    isAbsent(): BooleanExpression;
    /**
     * @beta
     *
     * Creates an expression that removes a key from the map produced by evaluating this expression.
     *
     * @example
     * ```
     * // Removes the key 'baz' from the input map.
     * map({foo: 'bar', baz: true}).mapRemove('baz');
     * ```
     *
     * @param key - The name of the key to remove from the input map.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'mapRemove' operation.
     */
    mapRemove(key: string): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that removes a key from the map produced by evaluating this expression.
     *
     * @example
     * ```
     * // Removes the key 'baz' from the input map.
     * map({foo: 'bar', baz: true}).mapRemove(constant('baz'));
     * @example
     * ```
     *
     * @param keyExpr - An expression that produces the name of the key to remove from the input map.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'mapRemove' operation.
     */
    mapRemove(keyExpr: Expression): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that merges multiple map values.
     *
     * @example
     * ```
     * // Merges the map in the settings field with, a map literal, and a map in
     * // that is conditionally returned by another expression
     * field('settings').mapMerge({ enabled: true }, conditional(field('isAdmin'), { admin: true}, {})
     * ```
     *
     * @param secondMap - A required second map to merge. Represented as a literal or
     * an expression that returns a map.
     * @param otherMaps - Optional additional maps to merge. Each map is represented
     * as a literal or an expression that returns a map.
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'mapMerge' operation.
     */
    mapMerge(secondMap: Record<string, unknown> | Expression, ...otherMaps: Array<Record<string, unknown> | Expression>): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the value of this expression raised to the power of another expression.
     *
     * @example
     * ```typescript
     * // Raise the value of the 'base' field to the power of the 'exponent' field.
     * field("base").pow(field("exponent"));
     * ```
     *
     * @param exponent - The expression to raise this expression to the power of.
     * @returns A new `Expression` representing the power operation.
     */
    pow(exponent: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the value of this expression raised to the power of a constant value.
     *
     * @example
     * ```typescript
     * // Raise the value of the 'base' field to the power of 2.
     * field("base").pow(2);
     * ```
     *
     * @param exponent - The constant value to raise this expression to the power of.
     * @returns A new `Expression` representing the power operation.
     */
    pow(exponent: number): FunctionExpression;
    /**
     * @beta
     * Creates an expression that truncates the numeric value to an integer.
     *
     * @example
     * ```typescript
     * // Truncate the 'rating' field
     * field("rating").trunc();
     * ```
     *
     * @returns A new `Expression` representing the truncated value.
     */
    trunc(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that truncates a numeric value to the specified number of decimal places.
     *
     * @example
     * ```typescript
     * // Truncate the value of the 'rating' field to two decimal places.
     * field("rating").trunc(2);
     * ```
     *
     * @param decimalPlaces - A constant specifying the truncation precision in decimal places.
     * @returns A new `Expression` representing the truncated value.
     */
    trunc(decimalPlaces: number): FunctionExpression;
    /**
     * @beta
     * Creates an expression that truncates a numeric value to the specified number of decimal places.
     *
     * @example
     * ```typescript
     * // Truncate the value of the 'rating' field to two decimal places.
     * field("rating").trunc(constant(2));
     * ```
     *
     * @param decimalPlaces - An expression specifying the truncation precision in decimal places.
     * @returns A new `Expression` representing the truncated value.
     */
    trunc(decimalPlaces: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that rounds a numeric value to the nearest whole number.
     *
     * @example
     * ```typescript
     * // Round the value of the 'price' field.
     * field("price").round();
     * ```
     *
     * @returns A new `Expression` representing the rounded value.
     */
    round(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that rounds a numeric value to the specified number of decimal places.
     *
     * @example
     * ```typescript
     * // Round the value of the 'price' field to two decimal places.
     * field("price").round(2);
     * ```
     *
     * @param decimalPlaces - A constant specifying the rounding precision in decimal places.
     *
     * @returns A new `Expression` representing the rounded value.
     */
    round(decimalPlaces: number): FunctionExpression;
    /**
     * @beta
     * Creates an expression that rounds a numeric value to the specified number of decimal places.
     *
     * @example
     * ```typescript
     * // Round the value of the 'price' field to two decimal places.
     * field("price").round(constant(2));
     * ```
     *
     * @param decimalPlaces - An expression specifying the rounding precision in decimal places.
     *
     * @returns A new `Expression` representing the rounded value.
     */
    round(decimalPlaces: Expression): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the collection ID from a path.
     *
     * @example
     * ```typescript
     * // Get the collection ID from a path.
     * field("__path__").collectionId();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the collectionId operation.
     */
    collectionId(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that calculates the length of a string, array, map, vector, or bytes.
     *
     * @example
     * ```typescript
     * // Get the length of the 'name' field.
     * field("name").length();
     *
     * // Get the number of items in the 'cart' array.
     * field("cart").length();
     * ```
     *
     * @returns A new `Expression` representing the length of the string, array, map, vector, or bytes.
     */
    length(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that computes the natural logarithm of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the natural logarithm of the 'value' field.
     * field("value").ln();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the natural logarithm of the numeric value.
     */
    ln(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that computes the square root of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the square root of the 'value' field.
     * field("value").sqrt();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the square root of the numeric value.
     */
    sqrt(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that reverses a string.
     *
     * @example
     * ```typescript
     * // Reverse the value of the 'myString' field.
     * field("myString").stringReverse();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
     */
    stringReverse(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that returns the `elseValue` argument if this expression results in an absent value, else
     * return the result of this expression evaluation.
     *
     * @example
     * ```typescript
     * // Returns the value of the optional field 'optional_field', or returns 'default_value'
     * // if the field is absent.
     * field("optional_field").ifAbsent("default_value")
     * ```
     *
     * @param elseValue - The value that will be returned if this Expression evaluates to an absent value.
     * @returns A new [Expression] representing the ifAbsent operation.
     */
    ifAbsent(elseValue: unknown): Expression;
    /**
     * @beta
     * Creates an expression that returns the `elseValue` argument if this expression results in an absent value, else
     * return the result of this expression evaluation.
     *
     * @example
     * ```typescript
     * // Returns the value of the optional field 'optional_field', or if that is
     * // absent, then returns the value of the field `default_field`.
     * field("optional_field").ifAbsent(field('default_field'))
     * ```
     *
     * @param elseExpression - The Expression that will be evaluated if this Expression evaluates to an absent value.
     * @returns A new [Expression] representing the ifAbsent operation.
     */
    ifAbsent(elseExpression: unknown): Expression;
    /**
     * @beta
     * Creates an expression that joins the elements of an array into a string.
     *
     * @example
     * ```typescript
     * // Join the elements of the 'tags' field with the delimiter from the 'separator' field.
     * field("tags").join(field("separator"))
     * ```
     *
     * @param delimiterExpression - The expression that evaluates to the delimiter string.
     * @returns A new Expression representing the join operation.
     */
    join(delimiterExpression: Expression): Expression;
    /**
     * @beta
     * Creates an expression that joins the elements of an array field into a string.
     *
     * @example
     * ```typescript
     * // Join the elements of the 'tags' field with a comma and space.
     * field("tags").join(", ")
     * ```
     *
     * @param delimiter - The string to use as a delimiter.
     * @returns A new Expression representing the join operation.
     */
    join(delimiter: string): Expression;
    /**
     * @beta
     * Creates an expression that computes the base-10 logarithm of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the base-10 logarithm of the 'value' field.
     * field("value").log10();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the base-10 logarithm of the numeric value.
     */
    log10(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that computes the sum of the elements in an array.
     *
     * @example
     * ```typescript
     * // Compute the sum of the elements in the 'scores' field.
     * field("scores").arraySum();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the sum of the elements in the array.
     */
    arraySum(): FunctionExpression;
    /**
     * @beta
     * Creates an expression that splits the result of this expression into an
     * array of substrings based on the provided delimiter.
     *
     * @example
     * ```typescript
     * // Split the 'scoresCsv' field on delimiter ','
     * field('scoresCsv').split(',')
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the split function.
     */
    split(delimiter: string): FunctionExpression;
    /**
     * @beta
     * Creates an expression that splits the result of this expression into an
     * array of substrings based on the provided delimiter.
     *
     * @example
     * ```typescript
     * // Split the 'scores' field on delimiter ',' or ':' depending on the stored format
     * field('scores').split(conditional(field('format').equal('csv'), constant(','), constant(':')))
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the split function.
     */
    split(delimiter: Expression): FunctionExpression;
    /**
     * Creates an expression that truncates a timestamp to a specified granularity.
     *
     * @example
     * ```typescript
     * // Truncate the 'createdAt' timestamp to the beginning of the day.
     * field('createdAt').timestampTruncate('day')
     * ```
     *
     * @param granularity - The granularity to truncate to.
     * @param timezone - The timezone to use for truncation. Valid values are from
     * the TZ database (e.g., "America/Los_Angeles") or in the format "Etc/GMT-1".
     * @returns A new `Expression` representing the truncated timestamp.
     */
    timestampTruncate(granularity: TimeGranularity, timezone?: string | Expression): FunctionExpression;
    /**
     * Creates an expression that truncates a timestamp to a specified granularity.
     *
     * @example
     * ```typescript
     * // Truncate the 'createdAt' timestamp to the granularity specified in the field 'granularity'.
     * field('createdAt').timestampTruncate(field('granularity'))
     * ```
     *
     * @param granularity - The granularity to truncate to.
     * @param timezone - The timezone to use for truncation. Valid values are from
     * the TZ database (e.g., "America/Los_Angeles") or in the format "Etc/GMT-1".
     * @returns A new `Expression` representing the truncated timestamp.
     */
    timestampTruncate(granularity: Expression, timezone?: string | Expression): FunctionExpression;
    /**
     * @beta
     * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in ascending order based on this expression.
     *
     * @example
     * ```typescript
     * // Sort documents by the 'name' field in ascending order
     * firestore.pipeline().collection("users")
     *   .sort(field("name").ascending());
     * ```
     *
     * @returns A new `Ordering` for ascending sorting.
     */
    ascending(): Ordering;
    /**
     * @beta
     * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in descending order based on this expression.
     *
     * @example
     * ```typescript
     * // Sort documents by the 'createdAt' field in descending order
     * firestore.pipeline().collection("users")
     *   .sort(field("createdAt").descending());
     * ```
     *
     * @returns A new `Ordering` for descending sorting.
     */
    descending(): Ordering;
    /**
     * @beta
     * Assigns an alias to this expression.
     *
     * Aliases are useful for renaming fields in the output of a stage or for giving meaningful
     * names to calculated values.
     *
     * @example
     * ```typescript
     * // Calculate the total price and assign it the alias "totalPrice" and add it to the output.
     * firestore.pipeline().collection("items")
     *   .addFields(field("price").multiply(field("quantity")).as("totalPrice"));
     * ```
     *
     * @param name - The alias to assign to this expression.
     * @returns A new {@link @firebase/firestore/pipelines#AliasedExpression} that wraps this
     *     expression and associates it with the provided alias.
     */
    as(name: string): AliasedExpression;
}
/**
 * @beta
 * Specify time granularity for expressions.
 */
type TimeGranularity = 'microsecond' | 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'week(monday)' | 'week(tuesday)' | 'week(wednesday)' | 'week(thursday)' | 'week(friday)' | 'week(saturday)' | 'week(sunday)' | 'isoWeek' | 'month' | 'quarter' | 'year' | 'isoYear';
/**
 * @beta
 *
 * An interface that represents a selectable expression.
 */
interface Selectable {
    selectable: true;
    /**
     * @private
     * @internal
     */
    readonly alias: string;
    /**
     * @private
     * @internal
     */
    readonly expr: Expression;
}
/**
 * @beta
 *
 * A class that represents an aggregate function.
 */
declare class AggregateFunction implements ProtoValueSerializable, UserData {
    private name;
    private params;
    exprType: ExpressionType;
    /**
     * @internal
     */
    _methodName?: string;
    constructor(name: string, params: Expression[]);
    /**
     * @internal
     * @private
     */
    static _create(name: string, params: Expression[], methodName: string): AggregateFunction;
    /**
     * @beta
     * Assigns an alias to this AggregateFunction. The alias specifies the name that
     * the aggregated value will have in the output document.
     *
     * @example
     * ```typescript
     * // Calculate the average price of all items and assign it the alias "averagePrice".
     * firestore.pipeline().collection("items")
     *   .aggregate(field("price").average().as("averagePrice"));
     * ```
     *
     * @param name - The alias to assign to this AggregateFunction.
     * @returns A new {@link @firebase/firestore/pipelines#AliasedAggregate} that wraps this
     *     AggregateFunction and associates it with the provided alias.
     */
    as(name: string): AliasedAggregate;
    /**
     * @private
     * @internal
     */
    _toProto(serializer: JsonProtoSerializer): Value;
    _protoValueType: "ProtoValue";
    /**
     * @private
     * @internal
     */
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 *
 * An AggregateFunction with alias.
 */
declare class AliasedAggregate implements UserData {
    readonly aggregate: AggregateFunction;
    readonly alias: string;
    readonly _methodName: string | undefined;
    constructor(aggregate: AggregateFunction, alias: string, _methodName: string | undefined);
    /**
     * @private
     * @internal
     */
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
declare class AliasedExpression implements Selectable, UserData {
    readonly expr: Expression;
    readonly alias: string;
    readonly _methodName: string | undefined;
    exprType: ExpressionType;
    selectable: true;
    constructor(expr: Expression, alias: string, _methodName: string | undefined);
    /**
     * @private
     * @internal
     */
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 *
 * Represents a reference to a field in a Firestore document, or outputs of a {@link @firebase/firestore/pipelines#Pipeline} stage.
 *
 * <p>Field references are used to access document field values in expressions and to specify fields
 * for sorting, filtering, and projecting data in Firestore pipelines.
 *
 * <p>You can create a `Field` instance using the static {@link @firebase/firestore/pipelines#field} method:
 *
 * @example
 * ```typescript
 * // Create a Field instance for the 'name' field
 * const nameField = field("name");
 *
 * // Create a Field instance for a nested field 'address.city'
 * const cityField = field("address.city");
 * ```
 */
declare class Field extends Expression implements Selectable {
    private fieldPath;
    readonly _methodName: string | undefined;
    readonly expressionType: ExpressionType;
    selectable: true;
    /**
     * @internal
     * @private
     * @hideconstructor
     * @param fieldPath
     */
    constructor(fieldPath: FieldPath$1, _methodName: string | undefined);
    get fieldName(): string;
    get alias(): string;
    get expr(): Expression;
    /**
     * @private
     * @internal
     */
    _toProto(serializer: JsonProtoSerializer): Value;
    /**
     * @private
     * @internal
     */
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 * Creates a {@link @firebase/firestore/pipelines#Field} instance representing the field at the given path.
 *
 * The path can be a simple field name (e.g., "name") or a dot-separated path to a nested field
 * (e.g., "address.city").
 *
 * @example
 * ```typescript
 * // Create a Field instance for the 'title' field
 * const titleField = field("title");
 *
 * // Create a Field instance for a nested field 'author.firstName'
 * const authorFirstNameField = field("author.firstName");
 * ```
 *
 * @param name - The path to the field.
 * @returns A new {@link @firebase/firestore/pipelines#Field} instance representing the specified field.
 */
declare function field(name: string): Field;
/**
 * @beta
 * Creates a {@link @firebase/firestore/pipelines#Field} instance representing the field at the given path.
 *
 * @param path - A FieldPath specifying the field.
 * @returns A new {@link @firebase/firestore/pipelines#Field} instance representing the specified field.
 */
declare function field(path: FieldPath): Field;
/**
 * @beta
 * Creates a `Constant` instance for a number value.
 *
 * @param value - The number value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: number): Expression;
/**
 * @beta
 * Creates a `Constant` instance for a string value.
 *
 * @param value - The string value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: string): Expression;
/**
 * @beta
 * Creates a `BooleanExpression` instance for a boolean value.
 *
 * @param value - The boolean value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: boolean): BooleanExpression;
/**
 * @beta
 * Creates a `Constant` instance for a null value.
 *
 * @param value - The null value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: null): Expression;
/**
 * @beta
 * Creates a `Constant` instance for a GeoPoint value.
 *
 * @param value - The GeoPoint value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: GeoPoint): Expression;
/**
 * @beta
 * Creates a `Constant` instance for a Timestamp value.
 *
 * @param value - The Timestamp value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: Timestamp$1): Expression;
/**
 * @beta
 * Creates a `Constant` instance for a Date value.
 *
 * @param value - The Date value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: Date): Expression;
/**
 * @beta
 * Creates a `Constant` instance for a Bytes value.
 *
 * @param value - The Bytes value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: Bytes): Expression;
/**
 * @beta
 * Creates a `Constant` instance for a DocumentReference value.
 *
 * @param value - The DocumentReference value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: DocumentReference): Expression;
/**
 * Creates a `Constant` instance for a Firestore proto value.
 * For internal use only.
 * @private
 * @internal
 * @param value - The Firestore proto value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: Value): Expression;
/**
 * @beta
 * Creates a `Constant` instance for a VectorValue value.
 *
 * @param value - The VectorValue value.
 * @returns A new `Constant` instance.
 */
declare function constant(value: VectorValue): Expression;
/**
 * @beta
 *
 * This class defines the base class for Firestore {@link @firebase/firestore/pipelines#Pipeline} functions, which can be evaluated within pipeline
 * execution.
 *
 * Typically, you would not use this class or its children directly. Use either the functions like {@link @firebase/firestore/pipelines#and}, {@link @firebase/firestore/pipelines#(equal:1)},
 * or the methods on {@link @firebase/firestore/pipelines#Expression} ({@link @firebase/firestore/pipelines#Expression.(equal:1)}, {@link @firebase/firestore/pipelines#Expression.(lessThan:1)}, etc.) to construct new Function instances.
 */
declare class FunctionExpression extends Expression {
    private name;
    private params;
    readonly _methodName?: string | undefined;
    readonly expressionType: ExpressionType;
    constructor(name: string, params: Expression[]);
    constructor(name: string, params: Expression[], _methodName: string | undefined);
    /**
     * @private
     * @internal
     */
    _toProto(serializer: JsonProtoSerializer): Value;
    /**
     * @private
     * @internal
     */
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 *
 * An interface that represents a filter condition.
 */
declare abstract class BooleanExpression extends Expression {
    abstract get _expr(): Expression;
    get _methodName(): string | undefined;
    /**
     * @beta
     * Creates an aggregation that finds the count of input documents satisfying
     * this boolean expression.
     *
     * @example
     * ```typescript
     * // Find the count of documents with a score greater than 90
     * field("score").greaterThan(90).countIf().as("highestScore");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'countIf' aggregation.
     */
    countIf(): AggregateFunction;
    /**
     * @beta
     * Creates an expression that negates this boolean expression.
     *
     * @example
     * ```typescript
     * // Find documents where the 'tags' field does not contain 'completed'
     * field("tags").arrayContains("completed").not();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the negated filter condition.
     */
    not(): BooleanExpression;
    /**
     * @beta
     * Creates a conditional expression that evaluates to the 'then' expression
     * if `this` expression evaluates to `true`,
     * or evaluates to the 'else' expression if `this` expressions evaluates `false`.
     *
     * @example
     * ```typescript
     * // If 'age' is greater than 18, return "Adult"; otherwise, return "Minor".
     * field("age").greaterThanOrEqual(18).conditional(constant("Adult"), constant("Minor"));
     * ```
     *
     * @param thenExpr - The expression to evaluate if the condition is true.
     * @param elseExpr - The expression to evaluate if the condition is false.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the conditional expression.
     */
    conditional(thenExpr: Expression, elseExpr: Expression): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that returns the `catch` argument if there is an
     * error, else return the result of this expression.
     *
     * @example
     * ```typescript
     * // Create an expression that protects against a divide by zero error
     * // but always returns a boolean expression.
     * constant(50).divide(field('length')).greaterThan(1).ifError(constant(false));
     * ```
     *
     * @param catchValue - The value that will be returned if this expression
     * produces an error.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ifError' operation.
     */
    ifError(catchValue: BooleanExpression): BooleanExpression;
    /**
     * @beta
     *
     * Creates an expression that returns the `catch` argument if there is an
     * error, else return the result of this expression.
     *
     * @example
     * ```typescript
     * // Create an expression that protects against a divide by zero error
     * // but always returns a boolean expression.
     * constant(50).divide(field('length')).greaterThan(1).ifError(false);
     * ```
     *
     * @param catchValue - The value that will be returned if this expression
     * produces an error.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ifError' operation.
     */
    ifError(catchValue: boolean): BooleanExpression;
    /**
     * @beta
     *
     * Creates an expression that returns the `catch` argument if there is an
     * error, else return the result of this expression.
     *
     * @example
     * ```typescript
     * // Create an expression that protects against a divide by zero error.
     * constant(50).divide(field('length')).greaterThan(1).ifError(constant(0));
     * ```
     *
     * @param catchValue - The value that will be returned if this expression
     * produces an error.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ifError' operation.
     */
    ifError(catchValue: Expression): FunctionExpression;
    /**
     * @beta
     *
     * Creates an expression that returns the `catch` argument if there is an
     * error, else return the result of this expression.
     *
     * @example
     * ```typescript
     * // Create an expression that protects against a divide by zero error.
     * constant(50).divide(field('length')).greaterThan(1).ifError(0);
     * ```
     *
     * @param catchValue - The value that will be returned if this expression
     * produces an error.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ifError' operation.
     */
    ifError(catchValue: unknown): FunctionExpression;
    /**
     * @private
     * @internal
     */
    _toProto(serializer: JsonProtoSerializer): Value;
    /**
     * @private
     * @internal
     */
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 * Creates an aggregation that counts the number of stage inputs where the provided
 * boolean expression evaluates to true.
 *
 * @example
 * ```typescript
 * // Count the number of documents where 'is_active' field equals true
 * countIf(field("is_active").equal(true)).as("numActiveDocuments");
 * ```
 *
 * @param booleanExpr - The boolean expression to evaluate on each input.
 * @returns A new `AggregateFunction` representing the 'countIf' aggregation.
 */
declare function countIf(booleanExpr: BooleanExpression): AggregateFunction;
/**
 * @beta
 * Creates an expression that indexes into an array from the beginning or end
 * and return the element. If the offset exceeds the array length, an error is
 * returned. A negative offset, starts from the end.
 *
 * @example
 * ```typescript
 * // Return the value in the tags field array at index 1.
 * arrayGet('tags', 1);
 * ```
 *
 * @param arrayField - The name of the array field.
 * @param offset - The index of the element to return.
 * @returns A new `Expression` representing the 'arrayGet' operation.
 */
declare function arrayGet(arrayField: string, offset: number): FunctionExpression;
/**
 * @beta
 * Creates an expression that indexes into an array from the beginning or end
 * and return the element. If the offset exceeds the array length, an error is
 * returned. A negative offset, starts from the end.
 *
 * @example
 * ```typescript
 * // Return the value in the tags field array at index specified by field
 * // 'favoriteTag'.
 * arrayGet('tags', field('favoriteTag'));
 * ```
 *
 * @param arrayField - The name of the array field.
 * @param offsetExpr - An `Expression` evaluating to the index of the element to return.
 * @returns A new `Expression` representing the 'arrayGet' operation.
 */
declare function arrayGet(arrayField: string, offsetExpr: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that indexes into an array from the beginning or end
 * and return the element. If the offset exceeds the array length, an error is
 * returned. A negative offset, starts from the end.
 *
 * @example
 * ```typescript
 * // Return the value in the tags field array at index 1.
 * arrayGet(field('tags'), 1);
 * ```
 *
 * @param arrayExpression - An `Expression` evaluating to an array.
 * @param offset - The index of the element to return.
 * @returns A new `Expression` representing the 'arrayGet' operation.
 */
declare function arrayGet(arrayExpression: Expression, offset: number): FunctionExpression;
/**
 * @beta
 * Creates an expression that indexes into an array from the beginning or end
 * and return the element. If the offset exceeds the array length, an error is
 * returned. A negative offset, starts from the end.
 *
 * @example
 * ```typescript
 * // Return the value in the tags field array at index specified by field
 * // 'favoriteTag'.
 * arrayGet(field('tags'), field('favoriteTag'));
 * ```
 *
 * @param arrayExpression - An `Expression` evaluating to an array.
 * @param offsetExpr - An `Expression` evaluating to the index of the element to return.
 * @returns A new `Expression` representing the 'arrayGet' operation.
 */
declare function arrayGet(arrayExpression: Expression, offsetExpr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a given expression produces an error.
 *
 * @example
 * ```typescript
 * // Check if the result of a calculation is an error
 * isError(field("title").arrayContains(1));
 * ```
 *
 * @param value - The expression to check.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'isError' check.
 */
declare function isError(value: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that returns the `catch` argument if there is an
 * error, else return the result of the `try` argument evaluation.
 *
 * This overload is useful when a BooleanExpression is required.
 *
 * @example
 * ```typescript
 * // Create an expression that protects against a divide by zero error
 * // but always returns a boolean expression.
 * ifError(constant(50).divide(field('length')).greaterThan(1), constant(false));
 * ```
 *
 * @param tryExpr - The try expression.
 * @param catchExpr - The catch expression that will be evaluated and
 * returned if the tryExpr produces an error.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ifError' operation.
 */
declare function ifError(tryExpr: BooleanExpression, catchExpr: BooleanExpression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that returns the `catch` argument if there is an
 * error, else return the result of the `try` argument evaluation.
 *
 * @example
 * ```typescript
 * // Returns the first item in the title field arrays, or returns
 * // the entire title field if the array is empty or the field is another type.
 * ifError(field("title").arrayGet(0), field("title"));
 * ```
 *
 * @param tryExpr - The try expression.
 * @param catchExpr - The catch expression that will be evaluated and
 * returned if the tryExpr produces an error.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ifError' operation.
 */
declare function ifError(tryExpr: Expression, catchExpr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the `catch` argument if there is an
 * error, else return the result of the `try` argument evaluation.
 *
 * @example
 * ```typescript
 * // Returns the first item in the title field arrays, or returns
 * // "Default Title"
 * ifError(field("title").arrayGet(0), "Default Title");
 * ```
 *
 * @param tryExpr - The try expression.
 * @param catchValue - The value that will be returned if the tryExpr produces an
 * error.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ifError' operation.
 */
declare function ifError(tryExpr: Expression, catchValue: unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns `true` if a value is absent. Otherwise,
 * returns `false` even if the value is `null`.
 *
 * @example
 * ```typescript
 * // Check if the field `value` is absent.
 * isAbsent(field("value"));
 * ```
 *
 * @param value - The expression to check.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'isAbsent' check.
 */
declare function isAbsent(value: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that returns `true` if a field is absent. Otherwise,
 * returns `false` even if the field value is `null`.
 *
 * @example
 * ```typescript
 * // Check if the field `value` is absent.
 * isAbsent("value");
 * ```
 *
 * @param field - The field to check.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'isAbsent' check.
 */
declare function isAbsent(field: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that removes a key from the map at the specified field name.
 *
 * @example
 * ```
 * // Removes the key 'city' field from the map in the address field of the input document.
 * mapRemove('address', 'city');
 * ```
 *
 * @param mapField - The name of a field containing a map value.
 * @param key - The name of the key to remove from the input map.
 */
declare function mapRemove(mapField: string, key: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that removes a key from the map produced by evaluating an expression.
 *
 * @example
 * ```
 * // Removes the key 'baz' from the input map.
 * mapRemove(map({foo: 'bar', baz: true}), 'baz');
 * @example
 * ```
 *
 * @param mapExpr - An expression return a map value.
 * @param key - The name of the key to remove from the input map.
 */
declare function mapRemove(mapExpr: Expression, key: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that removes a key from the map at the specified field name.
 *
 * @example
 * ```
 * // Removes the key 'city' field from the map in the address field of the input document.
 * mapRemove('address', constant('city'));
 * ```
 *
 * @param mapField - The name of a field containing a map value.
 * @param keyExpr - An expression that produces the name of the key to remove from the input map.
 */
declare function mapRemove(mapField: string, keyExpr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that removes a key from the map produced by evaluating an expression.
 *
 * @example
 * ```
 * // Removes the key 'baz' from the input map.
 * mapRemove(map({foo: 'bar', baz: true}), constant('baz'));
 * @example
 * ```
 *
 * @param mapExpr - An expression return a map value.
 * @param keyExpr - An expression that produces the name of the key to remove from the input map.
 */
declare function mapRemove(mapExpr: Expression, keyExpr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that merges multiple map values.
 *
 * @example
 * ```
 * // Merges the map in the settings field with, a map literal, and a map in
 * // that is conditionally returned by another expression
 * mapMerge('settings', { enabled: true }, conditional(field('isAdmin'), { admin: true}, {})
 * ```
 *
 * @param mapField - Name of a field containing a map value that will be merged.
 * @param secondMap - A required second map to merge. Represented as a literal or
 * an expression that returns a map.
 * @param otherMaps - Optional additional maps to merge. Each map is represented
 * as a literal or an expression that returns a map.
 */
declare function mapMerge(mapField: string, secondMap: Record<string, unknown> | Expression, ...otherMaps: Array<Record<string, unknown> | Expression>): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that merges multiple map values.
 *
 * @example
 * ```
 * // Merges the map in the settings field with, a map literal, and a map in
 * // that is conditionally returned by another expression
 * mapMerge(field('settings'), { enabled: true }, conditional(field('isAdmin'), { admin: true}, {})
 * ```
 *
 * @param firstMap - An expression or literal map value that will be merged.
 * @param secondMap - A required second map to merge. Represented as a literal or
 * an expression that returns a map.
 * @param otherMaps - Optional additional maps to merge. Each map is represented
 * as a literal or an expression that returns a map.
 */
declare function mapMerge(firstMap: Record<string, unknown> | Expression, secondMap: Record<string, unknown> | Expression, ...otherMaps: Array<Record<string, unknown> | Expression>): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the document ID from a path.
 *
 * @example
 * ```typescript
 * // Get the document ID from a path.
 * documentId(myDocumentReference);
 * ```
 *
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the documentId operation.
 */
declare function documentId(documentPath: string | DocumentReference): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the document ID from a path.
 *
 * @example
 * ```typescript
 * // Get the document ID from a path.
 * documentId(field("__path__"));
 * ```
 *
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the documentId operation.
 */
declare function documentId(documentPathExpr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns a substring of a string or byte array.
 *
 * @param field - The name of a field containing a string or byte array to compute the substring from.
 * @param position - Index of the first character of the substring.
 * @param length - Length of the substring.
 */
declare function substring(field: string, position: number, length?: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns a substring of a string or byte array.
 *
 * @param input - An expression returning a string or byte array to compute the substring from.
 * @param position - Index of the first character of the substring.
 * @param length - Length of the substring.
 */
declare function substring(input: Expression, position: number, length?: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns a substring of a string or byte array.
 *
 * @param field - The name of a field containing a string or byte array to compute the substring from.
 * @param position - An expression that returns the index of the first character of the substring.
 * @param length - An expression that returns the length of the substring.
 */
declare function substring(field: string, position: Expression, length?: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns a substring of a string or byte array.
 *
 * @param input - An expression returning a string or byte array to compute the substring from.
 * @param position - An expression that returns the index of the first character of the substring.
 * @param length - An expression that returns the length of the substring.
 */
declare function substring(input: Expression, position: Expression, length?: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that adds two expressions together.
 *
 * @example
 * ```typescript
 * // Add the value of the 'quantity' field and the 'reserve' field.
 * add(field("quantity"), field("reserve"));
 * ```
 *
 * @param first - The first expression to add.
 * @param second - The second expression or literal to add.
 * @param others - Optional other expressions or literals to add.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the addition operation.
 */
declare function add(first: Expression, second: Expression | unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that adds a field's value to an expression.
 *
 * @example
 * ```typescript
 * // Add the value of the 'quantity' field and the 'reserve' field.
 * add("quantity", field("reserve"));
 * ```
 *
 * @param fieldName - The name of the field containing the value to add.
 * @param second - The second expression or literal to add.
 * @param others - Optional other expressions or literals to add.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the addition operation.
 */
declare function add(fieldName: string, second: Expression | unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that subtracts two expressions.
 *
 * @example
 * ```typescript
 * // Subtract the 'discount' field from the 'price' field
 * subtract(field("price"), field("discount"));
 * ```
 *
 * @param left - The expression to subtract from.
 * @param right - The expression to subtract.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the subtraction operation.
 */
declare function subtract(left: Expression, right: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that subtracts a constant value from an expression.
 *
 * @example
 * ```typescript
 * // Subtract the constant value 2 from the 'value' field
 * subtract(field("value"), 2);
 * ```
 *
 * @param expression - The expression to subtract from.
 * @param value - The constant value to subtract.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the subtraction operation.
 */
declare function subtract(expression: Expression, value: unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that subtracts an expression from a field's value.
 *
 * @example
 * ```typescript
 * // Subtract the 'discount' field from the 'price' field
 * subtract("price", field("discount"));
 * ```
 *
 * @param fieldName - The field name to subtract from.
 * @param expression - The expression to subtract.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the subtraction operation.
 */
declare function subtract(fieldName: string, expression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that subtracts a constant value from a field's value.
 *
 * @example
 * ```typescript
 * // Subtract 20 from the value of the 'total' field
 * subtract("total", 20);
 * ```
 *
 * @param fieldName - The field name to subtract from.
 * @param value - The constant value to subtract.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the subtraction operation.
 */
declare function subtract(fieldName: string, value: unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that multiplies two expressions together.
 *
 * @example
 * ```typescript
 * // Multiply the 'quantity' field by the 'price' field
 * multiply(field("quantity"), field("price"));
 * ```
 *
 * @param first - The first expression to multiply.
 * @param second - The second expression or literal to multiply.
 * @param others - Optional additional expressions or literals to multiply.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the multiplication operation.
 */
declare function multiply(first: Expression, second: Expression | unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that multiplies a field's value by an expression.
 *
 * @example
 * ```typescript
 * // Multiply the 'quantity' field by the 'price' field
 * multiply("quantity", field("price"));
 * ```
 *
 * @param fieldName - The name of the field containing the value to add.
 * @param second - The second expression or literal to add.
 * @param others - Optional other expressions or literals to add.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the multiplication operation.
 */
declare function multiply(fieldName: string, second: Expression | unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that divides two expressions.
 *
 * @example
 * ```typescript
 * // Divide the 'total' field by the 'count' field
 * divide(field("total"), field("count"));
 * ```
 *
 * @param left - The expression to be divided.
 * @param right - The expression to divide by.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the division operation.
 */
declare function divide(left: Expression, right: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that divides an expression by a constant value.
 *
 * @example
 * ```typescript
 * // Divide the 'value' field by 10
 * divide(field("value"), 10);
 * ```
 *
 * @param expression - The expression to be divided.
 * @param value - The constant value to divide by.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the division operation.
 */
declare function divide(expression: Expression, value: unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that divides a field's value by an expression.
 *
 * @example
 * ```typescript
 * // Divide the 'total' field by the 'count' field
 * divide("total", field("count"));
 * ```
 *
 * @param fieldName - The field name to be divided.
 * @param expressions - The expression to divide by.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the division operation.
 */
declare function divide(fieldName: string, expressions: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that divides a field's value by a constant value.
 *
 * @example
 * ```typescript
 * // Divide the 'value' field by 10
 * divide("value", 10);
 * ```
 *
 * @param fieldName - The field name to be divided.
 * @param value - The constant value to divide by.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the division operation.
 */
declare function divide(fieldName: string, value: unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the modulo (remainder) of dividing two expressions.
 *
 * @example
 * ```typescript
 * // Calculate the remainder of dividing 'field1' by 'field2'.
 * mod(field("field1"), field("field2"));
 * ```
 *
 * @param left - The dividend expression.
 * @param right - The divisor expression.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the modulo operation.
 */
declare function mod(left: Expression, right: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the modulo (remainder) of dividing an expression by a constant.
 *
 * @example
 * ```typescript
 * // Calculate the remainder of dividing 'field1' by 5.
 * mod(field("field1"), 5);
 * ```
 *
 * @param expression - The dividend expression.
 * @param value - The divisor constant.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the modulo operation.
 */
declare function mod(expression: Expression, value: unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the modulo (remainder) of dividing a field's value by an expression.
 *
 * @example
 * ```typescript
 * // Calculate the remainder of dividing 'field1' by 'field2'.
 * mod("field1", field("field2"));
 * ```
 *
 * @param fieldName - The dividend field name.
 * @param expression - The divisor expression.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the modulo operation.
 */
declare function mod(fieldName: string, expression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the modulo (remainder) of dividing a field's value by a constant.
 *
 * @example
 * ```typescript
 * // Calculate the remainder of dividing 'field1' by 5.
 * mod("field1", 5);
 * ```
 *
 * @param fieldName - The dividend field name.
 * @param value - The divisor constant.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the modulo operation.
 */
declare function mod(fieldName: string, value: unknown): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that creates a Firestore map value from an input object.
 *
 * @example
 * ```typescript
 * // Create a map from the input object and reference the 'baz' field value from the input document.
 * map({foo: 'bar', baz: field('baz')}).as('data');
 * ```
 *
 * @param elements - The input map to evaluate in the expression.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the map function.
 */
declare function map(elements: Record<string, unknown>): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that creates a Firestore array value from an input array.
 *
 * @example
 * ```typescript
 * // Create an array value from the input array and reference the 'baz' field value from the input document.
 * array(['bar', field('baz')]).as('foo');
 * ```
 *
 * @param elements - The input array to evaluate in the expression.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the array function.
 */
declare function array(elements: unknown[]): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that checks if two expressions are equal.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is equal to an expression
 * equal(field("age"), field("minAge").add(10));
 * ```
 *
 * @param left - The first expression to compare.
 * @param right - The second expression to compare.
 * @returns A new `Expression` representing the equality comparison.
 */
declare function equal(left: Expression, right: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression is equal to a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is equal to 21
 * equal(field("age"), 21);
 * ```
 *
 * @param expression - The expression to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the equality comparison.
 */
declare function equal(expression: Expression, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is equal to an expression.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is equal to the 'limit' field
 * equal("age", field("limit"));
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param expression - The expression to compare to.
 * @returns A new `Expression` representing the equality comparison.
 */
declare function equal(fieldName: string, expression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is equal to a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'city' field is equal to string constant "London"
 * equal("city", "London");
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the equality comparison.
 */
declare function equal(fieldName: string, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if two expressions are not equal.
 *
 * @example
 * ```typescript
 * // Check if the 'status' field is not equal to field 'finalState'
 * notEqual(field("status"), field("finalState"));
 * ```
 *
 * @param left - The first expression to compare.
 * @param right - The second expression to compare.
 * @returns A new `Expression` representing the inequality comparison.
 */
declare function notEqual(left: Expression, right: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression is not equal to a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'status' field is not equal to "completed"
 * notEqual(field("status"), "completed");
 * ```
 *
 * @param expression - The expression to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the inequality comparison.
 */
declare function notEqual(expression: Expression, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is not equal to an expression.
 *
 * @example
 * ```typescript
 * // Check if the 'status' field is not equal to the value of 'expectedStatus'
 * notEqual("status", field("expectedStatus"));
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param expression - The expression to compare to.
 * @returns A new `Expression` representing the inequality comparison.
 */
declare function notEqual(fieldName: string, expression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is not equal to a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'country' field is not equal to "USA"
 * notEqual("country", "USA");
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the inequality comparison.
 */
declare function notEqual(fieldName: string, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if the first expression is less than the second expression.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is less than 30
 * lessThan(field("age"), field("limit"));
 * ```
 *
 * @param left - The first expression to compare.
 * @param right - The second expression to compare.
 * @returns A new `Expression` representing the less than comparison.
 */
declare function lessThan(left: Expression, right: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression is less than a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is less than 30
 * lessThan(field("age"), 30);
 * ```
 *
 * @param expression - The expression to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the less than comparison.
 */
declare function lessThan(expression: Expression, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is less than an expression.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is less than the 'limit' field
 * lessThan("age", field("limit"));
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param expression - The expression to compare to.
 * @returns A new `Expression` representing the less than comparison.
 */
declare function lessThan(fieldName: string, expression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is less than a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'price' field is less than 50
 * lessThan("price", 50);
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the less than comparison.
 */
declare function lessThan(fieldName: string, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if the first expression is less than or equal to the second
 * expression.
 *
 * @example
 * ```typescript
 * // Check if the 'quantity' field is less than or equal to 20
 * lessThan(field("quantity"), field("limit"));
 * ```
 *
 * @param left - The first expression to compare.
 * @param right - The second expression to compare.
 * @returns A new `Expression` representing the less than or equal to comparison.
 */
declare function lessThanOrEqual(left: Expression, right: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression is less than or equal to a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'quantity' field is less than or equal to 20
 * lessThan(field("quantity"), 20);
 * ```
 *
 * @param expression - The expression to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the less than or equal to comparison.
 */
declare function lessThanOrEqual(expression: Expression, value: unknown): BooleanExpression;
/**
 * @beta
 * Creates an expression that checks if a field's value is less than or equal to an expression.
 *
 * @example
 * ```typescript
 * // Check if the 'quantity' field is less than or equal to the 'limit' field
 * lessThan("quantity", field("limit"));
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param expression - The expression to compare to.
 * @returns A new `Expression` representing the less than or equal to comparison.
 */
declare function lessThanOrEqual(fieldName: string, expression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is less than or equal to a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'score' field is less than or equal to 70
 * lessThan("score", 70);
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the less than or equal to comparison.
 */
declare function lessThanOrEqual(fieldName: string, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if the first expression is greater than the second
 * expression.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is greater than 18
 * greaterThan(field("age"), constant(9).add(9));
 * ```
 *
 * @param left - The first expression to compare.
 * @param right - The second expression to compare.
 * @returns A new `Expression` representing the greater than comparison.
 */
declare function greaterThan(left: Expression, right: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression is greater than a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is greater than 18
 * greaterThan(field("age"), 18);
 * ```
 *
 * @param expression - The expression to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the greater than comparison.
 */
declare function greaterThan(expression: Expression, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is greater than an expression.
 *
 * @example
 * ```typescript
 * // Check if the value of field 'age' is greater than the value of field 'limit'
 * greaterThan("age", field("limit"));
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param expression - The expression to compare to.
 * @returns A new `Expression` representing the greater than comparison.
 */
declare function greaterThan(fieldName: string, expression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is greater than a constant value.
 *
 * @example
 * ```typescript
 * // Check if the 'price' field is greater than 100
 * greaterThan("price", 100);
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the greater than comparison.
 */
declare function greaterThan(fieldName: string, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if the first expression is greater than or equal to the
 * second expression.
 *
 * @example
 * ```typescript
 * // Check if the 'quantity' field is greater than or equal to the field "threshold"
 * greaterThanOrEqual(field("quantity"), field("threshold"));
 * ```
 *
 * @param left - The first expression to compare.
 * @param right - The second expression to compare.
 * @returns A new `Expression` representing the greater than or equal to comparison.
 */
declare function greaterThanOrEqual(left: Expression, right: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression is greater than or equal to a constant
 * value.
 *
 * @example
 * ```typescript
 * // Check if the 'quantity' field is greater than or equal to 10
 * greaterThanOrEqual(field("quantity"), 10);
 * ```
 *
 * @param expression - The expression to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the greater than or equal to comparison.
 */
declare function greaterThanOrEqual(expression: Expression, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is greater than or equal to an expression.
 *
 * @example
 * ```typescript
 * // Check if the value of field 'age' is greater than or equal to the value of field 'limit'
 * greaterThanOrEqual("age", field("limit"));
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param value - The expression to compare to.
 * @returns A new `Expression` representing the greater than or equal to comparison.
 */
declare function greaterThanOrEqual(fieldName: string, value: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is greater than or equal to a constant
 * value.
 *
 * @example
 * ```typescript
 * // Check if the 'score' field is greater than or equal to 80
 * greaterThanOrEqual("score", 80);
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param value - The constant value to compare to.
 * @returns A new `Expression` representing the greater than or equal to comparison.
 */
declare function greaterThanOrEqual(fieldName: string, value: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that concatenates an array expression with other arrays.
 *
 * @example
 * ```typescript
 * // Combine the 'items' array with two new item arrays
 * arrayConcat(field("items"), [field("newItems"), field("otherItems")]);
 * ```
 *
 * @param firstArray - The first array expression to concatenate to.
 * @param secondArray - The second array expression or array literal to concatenate to.
 * @param otherArrays - Optional additional array expressions or array literals to concatenate.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the concatenated array.
 */
declare function arrayConcat(firstArray: Expression, secondArray: Expression | unknown[], ...otherArrays: Array<Expression | unknown[]>): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that concatenates a field's array value with other arrays.
 *
 * @example
 * ```typescript
 * // Combine the 'items' array with two new item arrays
 * arrayConcat("items", [field("newItems"), field("otherItems")]);
 * ```
 *
 * @param firstArrayField - The first array to concatenate to.
 * @param secondArray - The second array expression or array literal to concatenate to.
 * @param otherArrays - Optional additional array expressions or array literals to concatenate.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the concatenated array.
 */
declare function arrayConcat(firstArrayField: string, secondArray: Expression | unknown[], ...otherArrays: Array<Expression | unknown[]>): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an array expression contains a specific element.
 *
 * @example
 * ```typescript
 * // Check if the 'colors' array contains the value of field 'selectedColor'
 * arrayContains(field("colors"), field("selectedColor"));
 * ```
 *
 * @param array - The array expression to check.
 * @param element - The element to search for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains' comparison.
 */
declare function arrayContains(array: Expression, element: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an array expression contains a specific element.
 *
 * @example
 * ```typescript
 * // Check if the 'colors' array contains "red"
 * arrayContains(field("colors"), "red");
 * ```
 *
 * @param array - The array expression to check.
 * @param element - The element to search for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains' comparison.
 */
declare function arrayContains(array: Expression, element: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's array value contains a specific element.
 *
 * @example
 * ```typescript
 * // Check if the 'colors' array contains the value of field 'selectedColor'
 * arrayContains("colors", field("selectedColor"));
 * ```
 *
 * @param fieldName - The field name to check.
 * @param element - The element to search for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains' comparison.
 */
declare function arrayContains(fieldName: string, element: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's array value contains a specific value.
 *
 * @example
 * ```typescript
 * // Check if the 'colors' array contains "red"
 * arrayContains("colors", "red");
 * ```
 *
 * @param fieldName - The field name to check.
 * @param element - The element to search for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains' comparison.
 */
declare function arrayContains(fieldName: string, element: unknown): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an array expression contains any of the specified
 * elements.
 *
 * @example
 * ```typescript
 * // Check if the 'categories' array contains either values from field "cate1" or "Science"
 * arrayContainsAny(field("categories"), [field("cate1"), "Science"]);
 * ```
 *
 * @param array - The array expression to check.
 * @param values - The elements to check for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains_any' comparison.
 */
declare function arrayContainsAny(array: Expression, values: Array<Expression | unknown>): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's array value contains any of the specified
 * elements.
 *
 * @example
 * ```typescript
 * // Check if the 'groups' array contains either the value from the 'userGroup' field
 * // or the value "guest"
 * arrayContainsAny("categories", [field("cate1"), "Science"]);
 * ```
 *
 * @param fieldName - The field name to check.
 * @param values - The elements to check for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains_any' comparison.
 */
declare function arrayContainsAny(fieldName: string, values: Array<Expression | unknown>): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an array expression contains any of the specified
 * elements.
 *
 * @example
 * ```typescript
 * // Check if the 'categories' array contains either values from field "cate1" or "Science"
 * arrayContainsAny(field("categories"), array([field("cate1"), "Science"]));
 * ```
 *
 * @param array - The array expression to check.
 * @param values - An expression that evaluates to an array, whose elements to check for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains_any' comparison.
 */
declare function arrayContainsAny(array: Expression, values: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's array value contains any of the specified
 * elements.
 *
 * @example
 * ```typescript
 * // Check if the 'groups' array contains either the value from the 'userGroup' field
 * // or the value "guest"
 * arrayContainsAny("categories", array([field("cate1"), "Science"]));
 * ```
 *
 * @param fieldName - The field name to check.
 * @param values - An expression that evaluates to an array, whose elements to check for in the array field.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains_any' comparison.
 */
declare function arrayContainsAny(fieldName: string, values: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an array expression contains all the specified elements.
 *
 * @example
 * ```typescript
 * // Check if the "tags" array contains all of the values: "SciFi", "Adventure", and the value from field "tag1"
 * arrayContainsAll(field("tags"), [field("tag1"), constant("SciFi"), "Adventure"]);
 * ```
 *
 * @param array - The array expression to check.
 * @param values - The elements to check for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains_all' comparison.
 */
declare function arrayContainsAll(array: Expression, values: Array<Expression | unknown>): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's array value contains all the specified values or
 * expressions.
 *
 * @example
 * ```typescript
 * // Check if the 'tags' array contains both of the values from field 'tag1', the value "SciFi", and "Adventure"
 * arrayContainsAll("tags", [field("tag1"), "SciFi", "Adventure"]);
 * ```
 *
 * @param fieldName - The field name to check.
 * @param values - The elements to check for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains_all' comparison.
 */
declare function arrayContainsAll(fieldName: string, values: Array<Expression | unknown>): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an array expression contains all the specified elements.
 *
 * @example
 * ```typescript
 * // Check if the "tags" array contains all of the values: "SciFi", "Adventure", and the value from field "tag1"
 * arrayContainsAll(field("tags"), [field("tag1"), constant("SciFi"), "Adventure"]);
 * ```
 *
 * @param array - The array expression to check.
 * @param arrayExpression - The elements to check for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains_all' comparison.
 */
declare function arrayContainsAll(array: Expression, arrayExpression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's array value contains all the specified values or
 * expressions.
 *
 * @example
 * ```typescript
 * // Check if the 'tags' array contains both of the values from field 'tag1', the value "SciFi", and "Adventure"
 * arrayContainsAll("tags", [field("tag1"), "SciFi", "Adventure"]);
 * ```
 *
 * @param fieldName - The field name to check.
 * @param arrayExpression - The elements to check for in the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'array_contains_all' comparison.
 */
declare function arrayContainsAll(fieldName: string, arrayExpression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the length of an array in a specified field.
 *
 * @example
 * ```typescript
 * // Get the number of items in field 'cart'
 * arrayLength('cart');
 * ```
 *
 * @param fieldName - The name of the field containing an array to calculate the length of.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the array.
 */
declare function arrayLength(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the length of an array expression.
 *
 * @example
 * ```typescript
 * // Get the number of items in the 'cart' array
 * arrayLength(field("cart"));
 * ```
 *
 * @param array - The array expression to calculate the length of.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the array.
 */
declare function arrayLength(array: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression, when evaluated, is equal to any of the provided values or
 * expressions.
 *
 * @example
 * ```typescript
 * // Check if the 'category' field is either "Electronics" or value of field 'primaryType'
 * equalAny(field("category"), [constant("Electronics"), field("primaryType")]);
 * ```
 *
 * @param expression - The expression whose results to compare.
 * @param values - The values to check against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'IN' comparison.
 */
declare function equalAny(expression: Expression, values: Array<Expression | unknown>): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression is equal to any of the provided values.
 *
 * @example
 * ```typescript
 * // Check if the 'category' field is set to a value in the disabledCategories field
 * equalAny(field("category"), field('disabledCategories'));
 * ```
 *
 * @param expression - The expression whose results to compare.
 * @param arrayExpression - An expression that evaluates to an array, whose elements to check for equality to the input.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'IN' comparison.
 */
declare function equalAny(expression: Expression, arrayExpression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is equal to any of the provided values or
 * expressions.
 *
 * @example
 * ```typescript
 * // Check if the 'category' field is either "Electronics" or value of field 'primaryType'
 * equalAny("category", [constant("Electronics"), field("primaryType")]);
 * ```
 *
 * @param fieldName - The field to compare.
 * @param values - The values to check against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'IN' comparison.
 */
declare function equalAny(fieldName: string, values: Array<Expression | unknown>): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is equal to any of the provided values or
 * expressions.
 *
 * @example
 * ```typescript
 * // Check if the 'category' field is either "Electronics" or value of field 'primaryType'
 * equalAny("category", ["Electronics", field("primaryType")]);
 * ```
 *
 * @param fieldName - The field to compare.
 * @param arrayExpression - An expression that evaluates to an array, whose elements to check for equality to the input field.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'IN' comparison.
 */
declare function equalAny(fieldName: string, arrayExpression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression is not equal to any of the provided values
 * or expressions.
 *
 * @example
 * ```typescript
 * // Check if the 'status' field is neither "pending" nor the value of 'rejectedStatus'
 * notEqualAny(field("status"), ["pending", field("rejectedStatus")]);
 * ```
 *
 * @param element - The expression to compare.
 * @param values - The values to check against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'NOT IN' comparison.
 */
declare function notEqualAny(element: Expression, values: Array<Expression | unknown>): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is not equal to any of the provided values
 * or expressions.
 *
 * @example
 * ```typescript
 * // Check if the 'status' field is neither "pending" nor the value of 'rejectedStatus'
 * notEqualAny("status", [constant("pending"), field("rejectedStatus")]);
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param values - The values to check against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'NOT IN' comparison.
 */
declare function notEqualAny(fieldName: string, values: Array<Expression | unknown>): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if an expression is not equal to any of the provided values
 * or expressions.
 *
 * @example
 * ```typescript
 * // Check if the 'status' field is neither "pending" nor the value of the field 'rejectedStatus'
 * notEqualAny(field("status"), ["pending", field("rejectedStatus")]);
 * ```
 *
 * @param element - The expression to compare.
 * @param arrayExpression - The values to check against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'NOT IN' comparison.
 */
declare function notEqualAny(element: Expression, arrayExpression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value is not equal to any of the values in the evaluated expression.
 *
 * @example
 * ```typescript
 * // Check if the 'status' field is not equal to any value in the field 'rejectedStatuses'
 * notEqualAny("status", field("rejectedStatuses"));
 * ```
 *
 * @param fieldName - The field name to compare.
 * @param arrayExpression - The values to check against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'NOT IN' comparison.
 */
declare function notEqualAny(fieldName: string, arrayExpression: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that performs a logical 'XOR' (exclusive OR) operation on multiple BooleanExpressions.
 *
 * @example
 * ```typescript
 * // Check if only one of the conditions is true: 'age' greater than 18, 'city' is "London",
 * // or 'status' is "active".
 * const condition = xor(
 *     greaterThan("age", 18),
 *     equal("city", "London"),
 *     equal("status", "active"));
 * ```
 *
 * @param first - The first condition.
 * @param second - The second condition.
 * @param additionalConditions - Additional conditions to 'XOR' together.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical 'XOR' operation.
 */
declare function xor(first: BooleanExpression, second: BooleanExpression, ...additionalConditions: BooleanExpression[]): BooleanExpression;
/**
 * @beta
 *
 * Creates a conditional expression that evaluates to a 'then' expression if a condition is true
 * and an 'else' expression if the condition is false.
 *
 * @example
 * ```typescript
 * // If 'age' is greater than 18, return "Adult"; otherwise, return "Minor".
 * conditional(
 *     greaterThan("age", 18), constant("Adult"), constant("Minor"));
 * ```
 *
 * @param condition - The condition to evaluate.
 * @param thenExpr - The expression to evaluate if the condition is true.
 * @param elseExpr - The expression to evaluate if the condition is false.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the conditional expression.
 */
declare function conditional(condition: BooleanExpression, thenExpr: Expression, elseExpr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that negates a filter condition.
 *
 * @example
 * ```typescript
 * // Find documents where the 'completed' field is NOT true
 * not(equal("completed", true));
 * ```
 *
 * @param booleanExpr - The filter condition to negate.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the negated filter condition.
 */
declare function not(booleanExpr: BooleanExpression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that returns the largest value between multiple input
 * expressions or literal values. Based on Firestore's value type ordering.
 *
 * @example
 * ```typescript
 * // Returns the largest value between the 'field1' field, the 'field2' field,
 * // and 1000
 * logicalMaximum(field("field1"), field("field2"), 1000);
 * ```
 *
 * @param first - The first operand expression.
 * @param second - The second expression or literal.
 * @param others - Optional additional expressions or literals.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical maximum operation.
 */
declare function logicalMaximum(first: Expression, second: Expression | unknown, ...others: Array<Expression | unknown>): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the largest value between multiple input
 * expressions or literal values. Based on Firestore's value type ordering.
 *
 * @example
 * ```typescript
 * // Returns the largest value between the 'field1' field, the 'field2' field,
 * // and 1000.
 * logicalMaximum("field1", field("field2"), 1000);
 * ```
 *
 * @param fieldName - The first operand field name.
 * @param second - The second expression or literal.
 * @param others - Optional additional expressions or literals.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical maximum operation.
 */
declare function logicalMaximum(fieldName: string, second: Expression | unknown, ...others: Array<Expression | unknown>): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the smallest value between multiple input
 * expressions and literal values. Based on Firestore's value type ordering.
 *
 * @example
 * ```typescript
 * // Returns the smallest value between the 'field1' field, the 'field2' field,
 * // and 1000.
 * logicalMinimum(field("field1"), field("field2"), 1000);
 * ```
 *
 * @param first - The first operand expression.
 * @param second - The second expression or literal.
 * @param others - Optional additional expressions or literals.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical minimum operation.
 */
declare function logicalMinimum(first: Expression, second: Expression | unknown, ...others: Array<Expression | unknown>): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the smallest value between a field's value
 * and other input expressions or literal values.
 * Based on Firestore's value type ordering.
 *
 * @example
 * ```typescript
 * // Returns the smallest value between the 'field1' field, the 'field2' field,
 * // and 1000.
 * logicalMinimum("field1", field("field2"), 1000);
 * ```
 *
 * @param fieldName - The first operand field name.
 * @param second - The second expression or literal.
 * @param others - Optional additional expressions or literals.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical minimum operation.
 */
declare function logicalMinimum(fieldName: string, second: Expression | unknown, ...others: Array<Expression | unknown>): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field exists.
 *
 * @example
 * ```typescript
 * // Check if the document has a field named "phoneNumber"
 * exists(field("phoneNumber"));
 * ```
 *
 * @param value - An expression evaluates to the name of the field to check.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'exists' check.
 */
declare function exists(value: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field exists.
 *
 * @example
 * ```typescript
 * // Check if the document has a field named "phoneNumber"
 * exists("phoneNumber");
 * ```
 *
 * @param fieldName - The field name to check.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'exists' check.
 */
declare function exists(fieldName: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that reverses a string.
 *
 * @example
 * ```typescript
 * // Reverse the value of the 'myString' field.
 * reverse(field("myString"));
 * ```
 *
 * @param stringExpression - An expression evaluating to a string value, which will be reversed.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
 */
declare function reverse(stringExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that reverses a string value in the specified field.
 *
 * @example
 * ```typescript
 * // Reverse the value of the 'myString' field.
 * reverse("myString");
 * ```
 *
 * @param field - The name of the field representing the string to reverse.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
 */
declare function reverse(field: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the byte length of a string in UTF-8, or just the length of a Blob.
 *
 * @example
 * ```typescript
 * // Calculate the length of the 'myString' field in bytes.
 * byteLength(field("myString"));
 * ```
 *
 * @param expr - The expression representing the string.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the string in bytes.
 */
declare function byteLength(expr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the length of a string represented by a field in UTF-8 bytes, or just the length of a Blob.
 *
 * @example
 * ```typescript
 * // Calculate the length of the 'myString' field in bytes.
 * byteLength("myString");
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the string in bytes.
 */
declare function byteLength(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes e to the power of the expression's result.
 *
 * @example
 * ```typescript
 * // Compute e to the power of 2.
 * exp(constant(2));
 * ```
 *
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the exp of the numeric value.
 */
declare function exp(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes e to the power of the expression's result.
 *
 * @example
 * ```typescript
 * // Compute e to the power of the 'value' field.
 * exp('value');
 * ```
 *
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the exp of the numeric value.
 */
declare function exp(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the ceiling of a numeric value.
 *
 * @example
 * ```typescript
 * // Compute the ceiling of the 'price' field.
 * ceil("price");
 * ```
 *
 * @param fieldName - The name of the field to compute the ceiling of.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the ceiling of the numeric value.
 */
declare function ceil(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the ceiling of a numeric value.
 *
 * @example
 * ```typescript
 * // Compute the ceiling of the 'price' field.
 * ceil(field("price"));
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which the ceiling will be computed for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the ceiling of the numeric value.
 */
declare function ceil(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the floor of a numeric value.
 *
 * @param expr - The expression to compute the floor of.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the floor of the numeric value.
 */
declare function floor(expr: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the floor of a numeric value.
 *
 * @param fieldName - The name of the field to compute the floor of.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the floor of the numeric value.
 */
declare function floor(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an aggregation that counts the number of distinct values of a field.
 *
 * @param expr - The expression or field to count distinct values of.
 * @returns A new `AggregateFunction` representing the 'count_distinct' aggregation.
 */
declare function countDistinct(expr: Expression | string): AggregateFunction;
/**
 * @beta
 *
 * Creates an expression that calculates the character length of a string field in UTF8.
 *
 * @example
 * ```typescript
 * // Get the character length of the 'name' field in UTF-8.
 * charLength("name");
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the string.
 */
declare function charLength(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the character length of a string expression in UTF-8.
 *
 * @example
 * ```typescript
 * // Get the character length of the 'name' field in UTF-8.
 * charLength(field("name"));
 * ```
 *
 * @param stringExpression - The expression representing the string to calculate the length of.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the string.
 */
declare function charLength(stringExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that performs a case-sensitive wildcard string comparison against a
 * field.
 *
 * @example
 * ```typescript
 * // Check if the 'title' field contains the string "guide"
 * like("title", "%guide%");
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @param pattern - The pattern to search for. You can use "%" as a wildcard character.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'like' comparison.
 */
declare function like(fieldName: string, pattern: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that performs a case-sensitive wildcard string comparison against a
 * field.
 *
 * @example
 * ```typescript
 * // Check if the 'title' field contains the string "guide"
 * like("title", field("pattern"));
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @param pattern - The pattern to search for. You can use "%" as a wildcard character.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'like' comparison.
 */
declare function like(fieldName: string, pattern: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that performs a case-sensitive wildcard string comparison.
 *
 * @example
 * ```typescript
 * // Check if the 'title' field contains the string "guide"
 * like(field("title"), "%guide%");
 * ```
 *
 * @param stringExpression - The expression representing the string to perform the comparison on.
 * @param pattern - The pattern to search for. You can use "%" as a wildcard character.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'like' comparison.
 */
declare function like(stringExpression: Expression, pattern: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that performs a case-sensitive wildcard string comparison.
 *
 * @example
 * ```typescript
 * // Check if the 'title' field contains the string "guide"
 * like(field("title"), field("pattern"));
 * ```
 *
 * @param stringExpression - The expression representing the string to perform the comparison on.
 * @param pattern - The pattern to search for. You can use "%" as a wildcard character.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'like' comparison.
 */
declare function like(stringExpression: Expression, pattern: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string field contains a specified regular expression as
 * a substring.
 *
 * @example
 * ```typescript
 * // Check if the 'description' field contains "example" (case-insensitive)
 * regexContains("description", "(?i)example");
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @param pattern - The regular expression to use for the search.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'contains' comparison.
 */
declare function regexContains(fieldName: string, pattern: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string field contains a specified regular expression as
 * a substring.
 *
 * @example
 * ```typescript
 * // Check if the 'description' field contains "example" (case-insensitive)
 * regexContains("description", field("pattern"));
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @param pattern - The regular expression to use for the search.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'contains' comparison.
 */
declare function regexContains(fieldName: string, pattern: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression contains a specified regular
 * expression as a substring.
 *
 * @example
 * ```typescript
 * // Check if the 'description' field contains "example" (case-insensitive)
 * regexContains(field("description"), "(?i)example");
 * ```
 *
 * @param stringExpression - The expression representing the string to perform the comparison on.
 * @param pattern - The regular expression to use for the search.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'contains' comparison.
 */
declare function regexContains(stringExpression: Expression, pattern: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression contains a specified regular
 * expression as a substring.
 *
 * @example
 * ```typescript
 * // Check if the 'description' field contains "example" (case-insensitive)
 * regexContains(field("description"), field("pattern"));
 * ```
 *
 * @param stringExpression - The expression representing the string to perform the comparison on.
 * @param pattern - The regular expression to use for the search.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'contains' comparison.
 */
declare function regexContains(stringExpression: Expression, pattern: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first element of an array.
 *
 * @example
 * ```typescript
 * // Get the first tag from the 'tags' array field
 * arrayFirst("tags");
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the first element.
 */
declare function arrayFirst(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first element of an array.
 *
 * @example
 * ```typescript
 * // Get the first tag from the 'tags' array field
 * arrayFirst(field("tags"));
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the first element.
 */
declare function arrayFirst(arrayExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first `n` elements of an array.
 *
 * @example
 * ```typescript
 * // Get the first 3 tags from the 'tags' array field
 * arrayFirstN("tags", 3);
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @param n - The number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the first `n` elements.
 */
declare function arrayFirstN(fieldName: string, n: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first `n` elements of an array.
 *
 * @example
 * ```typescript
 * // Get the first n tags from the 'tags' array field
 * arrayFirstN("tags", field("count"));
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @param n - An expression evaluating to the number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the first `n` elements.
 */
declare function arrayFirstN(fieldName: string, n: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first `n` elements of an array.
 *
 * @example
 * ```typescript
 * // Get the first 3 elements from an array expression
 * arrayFirstN(field("tags"), 3);
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @param n - The number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the first `n` elements.
 */
declare function arrayFirstN(arrayExpression: Expression, n: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first `n` elements of an array.
 *
 * @example
 * ```typescript
 * // Get the first n elements from an array expression
 * arrayFirstN(field("tags"), field("count"));
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @param n - An expression evaluating to the number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the first `n` elements.
 */
declare function arrayFirstN(arrayExpression: Expression, n: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the last element of an array.
 *
 * @example
 * ```typescript
 * // Get the last tag from the 'tags' array field
 * arrayLast("tags");
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the last element.
 */
declare function arrayLast(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the last element of an array.
 *
 * @example
 * ```typescript
 * // Get the last tag from the 'tags' array field
 * arrayLast(field("tags"));
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the last element.
 */
declare function arrayLast(arrayExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the last `n` elements of an array.
 *
 * @example
 * ```typescript
 * // Get the last 3 tags from the 'tags' array field
 * arrayLastN("tags", 3);
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @param n - The number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the last `n` elements.
 */
declare function arrayLastN(fieldName: string, n: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the last `n` elements of an array.
 *
 * @example
 * ```typescript
 * // Get the last n tags from the 'tags' array field
 * arrayLastN("tags", field("count"));
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @param n - An expression evaluating to the number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the last `n` elements.
 */
declare function arrayLastN(fieldName: string, n: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the last `n` elements of an array.
 *
 * @example
 * ```typescript
 * // Get the last 3 elements from an array expression
 * arrayLastN(field("tags"), 3);
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @param n - The number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the last `n` elements.
 */
declare function arrayLastN(arrayExpression: Expression, n: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the last `n` elements of an array.
 *
 * @example
 * ```typescript
 * // Get the last n elements from an array expression
 * arrayLastN(field("tags"), field("count"));
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @param n - An expression evaluating to the number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the last `n` elements.
 */
declare function arrayLastN(arrayExpression: Expression, n: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the maximum value in an array.
 *
 * @example
 * ```typescript
 * // Get the maximum value from the 'scores' array field
 * arrayMaximum("scores");
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the maximum value.
 */
declare function arrayMaximum(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the maximum value in an array.
 *
 * @example
 * ```typescript
 * // Get the maximum value from the 'scores' array field
 * arrayMaximum(field("scores"));
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the maximum value.
 */
declare function arrayMaximum(arrayExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the largest `n` elements of an array.
 *
 * Note: Returns the n largest non-null elements in the array, in descending
 * order. This does not use a stable sort, meaning the order of equivalent
 * elements is undefined.
 *
 * @example
 * ```typescript
 * // Get the top 3 scores from the 'scores' array field
 * arrayMaximumN("scores", 3);
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @param n - The number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the largest `n` elements.
 */
declare function arrayMaximumN(fieldName: string, n: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the largest `n` elements of an array.
 *
 * Note: Returns the n largest non-null elements in the array, in descending
 * order. This does not use a stable sort, meaning the order of equivalent
 * elements is undefined.
 *
 * @example
 * ```typescript
 * // Get the top n scores from the 'scores' array field
 * arrayMaximumN("scores", field("count"));
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @param n - An expression evaluating to the number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the largest `n` elements.
 */
declare function arrayMaximumN(fieldName: string, n: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the largest `n` elements of an array.
 *
 * Note: Returns the n largest non-null elements in the array, in descending
 * order. This does not use a stable sort, meaning the order of equivalent
 * elements is undefined.
 *
 * @example
 * ```typescript
 * // Get the top 3 elements from an array expression
 * arrayMaximumN(field("scores"), 3);
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @param n - The number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the largest `n` elements.
 */
declare function arrayMaximumN(arrayExpression: Expression, n: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the largest `n` elements of an array.
 *
 * Note: Returns the n largest non-null elements in the array, in descending
 * order. This does not use a stable sort, meaning the order of equivalent
 * elements is undefined.
 *
 * @example
 * ```typescript
 * // Get the top n elements from an array expression
 * arrayMaximumN(field("scores"), field("count"));
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @param n - An expression evaluating to the number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the largest `n` elements.
 */
declare function arrayMaximumN(arrayExpression: Expression, n: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the minimum value in an array.
 *
 * @example
 * ```typescript
 * // Get the minimum value from the 'scores' array field
 * arrayMinimum("scores");
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the minimum value.
 */
declare function arrayMinimum(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the minimum value in an array.
 *
 * @example
 * ```typescript
 * // Get the minimum value from the 'scores' array field
 * arrayMinimum(field("scores"));
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the minimum value.
 */
declare function arrayMinimum(arrayExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the smallest `n` elements of an array.
 *
 * Note: Returns the n smallest non-null elements in the array, in ascending
 * order. This does not use a stable sort, meaning the order of equivalent
 * elements is undefined.
 *
 * @example
 * ```typescript
 * // Get the bottom 3 scores from the 'scores' array field
 * arrayMinimumN("scores", 3);
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @param n - The number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the smallest `n` elements.
 */
declare function arrayMinimumN(fieldName: string, n: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the smallest `n` elements of an array.
 *
 * Note: Returns the n smallest non-null elements in the array, in ascending
 * order. This does not use a stable sort, meaning the order of equivalent
 * elements is undefined.
 *
 * @example
 * ```typescript
 * // Get the bottom n scores from the 'scores' array field
 * arrayMinimumN(field("scores"), field("count"));
 * ```
 *
 * @param fieldName - The name of the field containing the array.
 * @param n - An expression evaluating to the number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the smallest `n` elements.
 */
declare function arrayMinimumN(fieldName: string, n: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the smallest `n` elements of an array.
 *
 * Note: Returns the n smallest non-null elements in the array, in ascending
 * order. This does not use a stable sort, meaning the order of equivalent
 * elements is undefined.
 *
 * @example
 * ```typescript
 * // Get the bottom 3 scores from the 'scores' array field
 * arrayMinimumN(field("scores"), 3);
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @param n - The number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the smallest `n` elements.
 */
declare function arrayMinimumN(arrayExpression: Expression, n: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the smallest `n` elements of an array.
 *
 * Note: Returns the n smallest non-null elements in the array, in ascending
 * order. This does not use a stable sort, meaning the order of equivalent
 * elements is undefined.
 *
 * @example
 * ```typescript
 * // Get the bottom n scores from the 'scores' array field
 * arrayMinimumN(field("scores"), field("count"));
 * ```
 *
 * @param arrayExpression - The expression representing the array.
 * @param n - An expression evaluating to the number of elements to return.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the smallest `n` elements.
 */
declare function arrayMinimumN(arrayExpression: Expression, n: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first index of the search value in an array.
 * Returns -1 if the value is not found.
 *
 * @example
 * ```typescript
 * // Get the index of "politics" in the 'tags' array field
 * arrayIndexOf("tags", "politics");
 * ```
 *
 * @param fieldName - The name of the field containing the array to search.
 * @param search - The value to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the index.
 */
declare function arrayIndexOf(fieldName: string, search: unknown | Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first index of the search value in an array.
 * Returns -1 if the value is not found.
 *
 * @example
 * ```typescript
 * // Get the index of "politics" in the 'tags' array field
 * arrayIndexOf(field("tags"), "politics");
 * ```
 *
 * @param arrayExpression - The expression representing the array to search.
 * @param search - The value to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the index.
 */
declare function arrayIndexOf(arrayExpression: Expression, search: unknown | Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the last index of the search value in an array.
 * Returns -1 if the value is not found.
 *
 * @example
 * ```typescript
 * // Get the last index of "politics" in the 'tags' array field
 * arrayLastIndexOf("tags", "politics");
 * ```
 *
 * @param fieldName - The name of the field containing the array to search.
 * @param search - The value to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the index.
 */
declare function arrayLastIndexOf(fieldName: string, search: unknown | Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the last index of the search value in an array.
 * Returns -1 if the value is not found.
 *
 * @example
 * ```typescript
 * // Get the last index of "politics" in the 'tags' array field
 * arrayLastIndexOf(field("tags"), "politics");
 * ```
 *
 * @param arrayExpression - The expression representing the array to search.
 * @param search - The value to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the index.
 */
declare function arrayLastIndexOf(arrayExpression: Expression, search: unknown | Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns all indices of the search value in an array.
 *
 * @example
 * ```typescript
 * // Get all indices of 5 in the 'scores' array field
 * arrayIndexOfAll("scores", 5);
 * ```
 *
 * @param fieldName - The name of the field containing the array to search.
 * @param search - The value to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the indices.
 */
declare function arrayIndexOfAll(fieldName: string, search: unknown | Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns all indices of the search value in an array.
 *
 * @example
 * ```typescript
 * // Get all indices of 5 in the 'scores' array field
 * arrayIndexOfAll(field("scores"), 5);
 * ```
 *
 * @param arrayExpression - The expression representing the array to search.
 * @param search - The value to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the indices.
 */
declare function arrayIndexOfAll(arrayExpression: Expression, search: unknown | Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first substring of a string field that matches a
 * specified regular expression.
 *
 * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
 *
 * @example
 * ```typescript
 * // Extract the domain name from an email field
 * regexFind("email", "@[A-Za-z0-9.-]+");
 * ```
 *
 * @param fieldName - The name of the field containing the string to search.
 * @param pattern - The regular expression to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression find function.
 */
declare function regexFind(fieldName: string, pattern: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first substring of a string field that matches a
 * specified regular expression.
 *
 * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
 *
 * @example
 * ```typescript
 * // Extract a substring from 'email' based on a pattern stored in another field
 * regexFind("email", field("pattern"));
 * ```
 *
 * @param fieldName - The name of the field containing the string to search.
 * @param pattern - The regular expression to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression find function.
 */
declare function regexFind(fieldName: string, pattern: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first substring of a string expression that matches
 * a specified regular expression.
 *
 * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
 *
 * @example
 * ```typescript
 * // Extract the domain from a lower-cased email address
 * regexFind(field("email"), "@[A-Za-z0-9.-]+");
 * ```
 *
 * @param stringExpression - The expression representing the string to search.
 * @param pattern - The regular expression to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression find function.
 */
declare function regexFind(stringExpression: Expression, pattern: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that returns the first substring of a string expression that matches
 * a specified regular expression.
 *
 * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
 *
 * @example
 * ```typescript
 * // Extract a substring based on a dynamic pattern field
 * regexFind(field("email"), field("pattern"));
 * ```
 *
 * @param stringExpression - The expression representing the string to search.
 * @param pattern - The regular expression to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression find function.
 */
declare function regexFind(stringExpression: Expression, pattern: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that evaluates to a list of all substrings in a string field that
 * match a specified regular expression.
 *
 * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
 *
 * @example
 * ```typescript
 * // Extract all hashtags from a post content field
 * regexFindAll("content", "#[A-Za-z0-9_]+");
 * ```
 *
 * @param fieldName - The name of the field containing the string to search.
 * @param pattern - The regular expression to search for.
 * @returns A new {@link @firebase/firestore/pipelines#FunctionExpression} that evaluates to an array of matched substrings.
 */
declare function regexFindAll(fieldName: string, pattern: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that evaluates to a list of all substrings in a string field that
 * match a specified regular expression.
 *
 * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
 *
 * @example
 * ```typescript
 * // Extract all matches from 'content' based on a pattern stored in another field
 * regexFindAll("content", field("pattern"));
 * ```
 *
 * @param fieldName - The name of the field containing the string to search.
 * @param pattern - The regular expression to search for.
 * @returns A new {@link @firebase/firestore/pipelines#FunctionExpression} that evaluates to an array of matched substrings.
 */
declare function regexFindAll(fieldName: string, pattern: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that evaluates to a list of all substrings in a string expression
 * that match a specified regular expression.
 *
 * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
 *
 * @example
 * ```typescript
 * // Extract all mentions from a lower-cased comment
 * regexFindAll(field("comment"), "@[A-Za-z0-9_]+");
 * ```
 *
 * @param stringExpression - The expression representing the string to search.
 * @param pattern - The regular expression to search for.
 * @returns A new {@link @firebase/firestore/pipelines#FunctionExpression} that evaluates to an array of matched substrings.
 */
declare function regexFindAll(stringExpression: Expression, pattern: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that evaluates to a list of all substrings in a string expression
 * that match a specified regular expression.
 *
 * This expression uses the {@link https://github.com/google/re2/wiki/Syntax | RE2} regular expression syntax.
 *
 * @example
 * ```typescript
 * // Extract all matches based on a dynamic pattern expression
 * regexFindAll(field("comment"), field("pattern"));
 * ```
 *
 * @param stringExpression - The expression representing the string to search.
 * @param pattern - The regular expression to search for.
 * @returns A new {@link @firebase/firestore/pipelines#FunctionExpression} that evaluates to an array of matched substrings.
 */
declare function regexFindAll(stringExpression: Expression, pattern: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string field matches a specified regular expression.
 *
 * @example
 * ```typescript
 * // Check if the 'email' field matches a valid email pattern
 * regexMatch("email", "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @param pattern - The regular expression to use for the match.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression match.
 */
declare function regexMatch(fieldName: string, pattern: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string field matches a specified regular expression.
 *
 * @example
 * ```typescript
 * // Check if the 'email' field matches a valid email pattern
 * regexMatch("email", field("pattern"));
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @param pattern - The regular expression to use for the match.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression match.
 */
declare function regexMatch(fieldName: string, pattern: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression matches a specified regular
 * expression.
 *
 * @example
 * ```typescript
 * // Check if the 'email' field matches a valid email pattern
 * regexMatch(field("email"), "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
 * ```
 *
 * @param stringExpression - The expression representing the string to match against.
 * @param pattern - The regular expression to use for the match.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression match.
 */
declare function regexMatch(stringExpression: Expression, pattern: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression matches a specified regular
 * expression.
 *
 * @example
 * ```typescript
 * // Check if the 'email' field matches a valid email pattern
 * regexMatch(field("email"), field("pattern"));
 * ```
 *
 * @param stringExpression - The expression representing the string to match against.
 * @param pattern - The regular expression to use for the match.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the regular expression match.
 */
declare function regexMatch(stringExpression: Expression, pattern: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string field contains a specified substring.
 *
 * @example
 * ```typescript
 * // Check if the 'description' field contains "example".
 * stringContains("description", "example");
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @param substring - The substring to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'contains' comparison.
 */
declare function stringContains(fieldName: string, substring: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string field contains a substring specified by an expression.
 *
 * @example
 * ```typescript
 * // Check if the 'description' field contains the value of the 'keyword' field.
 * stringContains("description", field("keyword"));
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @param substring - The expression representing the substring to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'contains' comparison.
 */
declare function stringContains(fieldName: string, substring: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression contains a specified substring.
 *
 * @example
 * ```typescript
 * // Check if the 'description' field contains "example".
 * stringContains(field("description"), "example");
 * ```
 *
 * @param stringExpression - The expression representing the string to perform the comparison on.
 * @param substring - The substring to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'contains' comparison.
 */
declare function stringContains(stringExpression: Expression, substring: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression contains a substring specified by another expression.
 *
 * @example
 * ```typescript
 * // Check if the 'description' field contains the value of the 'keyword' field.
 * stringContains(field("description"), field("keyword"));
 * ```
 *
 * @param stringExpression - The expression representing the string to perform the comparison on.
 * @param substring - The expression representing the substring to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'contains' comparison.
 */
declare function stringContains(stringExpression: Expression, substring: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value starts with a given prefix.
 *
 * @example
 * ```typescript
 * // Check if the 'name' field starts with "Mr."
 * startsWith("name", "Mr.");
 * ```
 *
 * @param fieldName - The field name to check.
 * @param prefix - The prefix to check for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'starts with' comparison.
 */
declare function startsWith(fieldName: string, prefix: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value starts with a given prefix.
 *
 * @example
 * ```typescript
 * // Check if the 'fullName' field starts with the value of the 'firstName' field
 * startsWith("fullName", field("firstName"));
 * ```
 *
 * @param fieldName - The field name to check.
 * @param prefix - The expression representing the prefix.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'starts with' comparison.
 */
declare function startsWith(fieldName: string, prefix: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression starts with a given prefix.
 *
 * @example
 * ```typescript
 * // Check if the result of concatenating 'firstName' and 'lastName' fields starts with "Mr."
 * startsWith(field("fullName"), "Mr.");
 * ```
 *
 * @param stringExpression - The expression to check.
 * @param prefix - The prefix to check for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'starts with' comparison.
 */
declare function startsWith(stringExpression: Expression, prefix: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression starts with a given prefix.
 *
 * @example
 * ```typescript
 * // Check if the result of concatenating 'firstName' and 'lastName' fields starts with "Mr."
 * startsWith(field("fullName"), field("prefix"));
 * ```
 *
 * @param stringExpression - The expression to check.
 * @param prefix - The prefix to check for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'starts with' comparison.
 */
declare function startsWith(stringExpression: Expression, prefix: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value ends with a given postfix.
 *
 * @example
 * ```typescript
 * // Check if the 'filename' field ends with ".txt"
 * endsWith("filename", ".txt");
 * ```
 *
 * @param fieldName - The field name to check.
 * @param suffix - The postfix to check for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ends with' comparison.
 */
declare function endsWith(fieldName: string, suffix: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a field's value ends with a given postfix.
 *
 * @example
 * ```typescript
 * // Check if the 'url' field ends with the value of the 'extension' field
 * endsWith("url", field("extension"));
 * ```
 *
 * @param fieldName - The field name to check.
 * @param suffix - The expression representing the postfix.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ends with' comparison.
 */
declare function endsWith(fieldName: string, suffix: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression ends with a given postfix.
 *
 * @example
 * ```typescript
 * // Check if the result of concatenating 'firstName' and 'lastName' fields ends with "Jr."
 * endsWith(field("fullName"), "Jr.");
 * ```
 *
 * @param stringExpression - The expression to check.
 * @param suffix - The postfix to check for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ends with' comparison.
 */
declare function endsWith(stringExpression: Expression, suffix: string): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that checks if a string expression ends with a given postfix.
 *
 * @example
 * ```typescript
 * // Check if the result of concatenating 'firstName' and 'lastName' fields ends with "Jr."
 * endsWith(field("fullName"), constant("Jr."));
 * ```
 *
 * @param stringExpression - The expression to check.
 * @param suffix - The postfix to check for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'ends with' comparison.
 */
declare function endsWith(stringExpression: Expression, suffix: Expression): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that converts a string field to lowercase.
 *
 * @example
 * ```typescript
 * // Convert the 'name' field to lowercase
 * toLower("name");
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the lowercase string.
 */
declare function toLower(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that converts a string expression to lowercase.
 *
 * @example
 * ```typescript
 * // Convert the 'name' field to lowercase
 * toLower(field("name"));
 * ```
 *
 * @param stringExpression - The expression representing the string to convert to lowercase.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the lowercase string.
 */
declare function toLower(stringExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that converts a string field to uppercase.
 *
 * @example
 * ```typescript
 * // Convert the 'title' field to uppercase
 * toUpper("title");
 * ```
 *
 * @param fieldName - The name of the field containing the string.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the uppercase string.
 */
declare function toUpper(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that converts a string expression to uppercase.
 *
 * @example
 * ```typescript
 * // Convert the 'title' field to uppercase
 * toUpper(field("title"));
 * ```
 *
 * @param stringExpression - The expression representing the string to convert to uppercase.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the uppercase string.
 */
declare function toUpper(stringExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that removes leading and trailing whitespace from a string or byte array.
 *
 * @example
 * ```typescript
 * // Trim whitespace from the 'userInput' field
 * trim("userInput");
 *
 * // Trim quotes from the 'userInput' field
 * trim("userInput", '"');
 * ```
 *
 * @param fieldName - The name of the field containing the string or byte array.
 * @param valueToTrim - Optional This parameter is treated as a set of characters or bytes that will be
 * trimmed from the input. If not specified, then whitespace will be trimmed.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the trimmed string.
 */
declare function trim(fieldName: string, valueToTrim?: string | Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that removes leading and trailing characters from a string or byte array expression.
 *
 * @example
 * ```typescript
 * // Trim whitespace from the 'userInput' field
 * trim(field("userInput"));
 *
 * // Trim quotes from the 'userInput' field
 * trim(field("userInput"), '"');
 * ```
 *
 * @param stringExpression - The expression representing the string or byte array to trim.
 * @param valueToTrim - Optional This parameter is treated as a set of characters or bytes that will be
 * trimmed from the input. If not specified, then whitespace will be trimmed.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the trimmed string or byte array.
 */
declare function trim(stringExpression: Expression, valueToTrim?: string | Expression): FunctionExpression;
/**
 * @beta
 * Trims whitespace or a specified set of characters/bytes from the beginning of a string or byte array.
 *
 * @example
 * ```typescript
 * // Trim whitespace from the beginning of the 'userInput' field
 * ltrim(field("userInput"));
 *
 * // Trim quotes from the beginning of the 'userInput' field
 * ltrim(field("userInput"), '"');
 * ```
 *
 * @param fieldName - The name of the field containing the string or byte array.
 * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
 * If not specified, whitespace will be trimmed.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the trimmed string or byte array.
 */
declare function ltrim(fieldName: string, valueToTrim?: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 * Trims whitespace or a specified set of characters/bytes from the beginning of a string or byte array.
 *
 * @example
 * ```typescript
 * // Trim whitespace from the beginning of the 'userInput' field
 * ltrim(field("userInput"));
 *
 * // Trim quotes from the beginning of the 'userInput' field
 * ltrim(field("userInput"), '"');
 * ```
 *
 * @param expression - The expression representing the string or byte array.
 * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
 * If not specified, whitespace will be trimmed.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the trimmed string or byte array.
 */
declare function ltrim(expression: Expression, valueToTrim?: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 * Trims whitespace or a specified set of characters/bytes from the end of a string or byte array.
 *
 * @example
 * ```typescript
 * // Trim whitespace from the end of the 'userInput' field
 * rtrim(field("userInput"));
 *
 * // Trim quotes from the end of the 'userInput' field
 * rtrim(field("userInput"), '"');
 * ```
 *
 * @param fieldName - The name of the field containing the string or byte array.
 * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
 * If not specified, whitespace will be trimmed.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the trimmed string or byte array.
 */
declare function rtrim(fieldName: string, valueToTrim?: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 * Trims whitespace or a specified set of characters/bytes from the end of a string or byte array.
 *
 * @example
 * ```typescript
 * // Trim whitespace from the end of the 'userInput' field
 * rtrim(field("userInput"));
 *
 * // Trim quotes from the end of the 'userInput' field
 * rtrim(field("userInput"), '"');
 * ```
 *
 * @param expression - The expression representing the string or byte array.
 * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
 * If not specified, whitespace will be trimmed.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the trimmed string or byte array.
 */
declare function rtrim(expression: Expression, valueToTrim?: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the data type of the data in the specified field.
 *
 * @remarks
 * String inputs passed iteratively to this global function act as `field()` path lookups.
 * If you wish to pass a string literal value, it must be wrapped: `type(constant("my_string"))`.
 *
 * @example
 * ```typescript
 * // Get the data type of the value in field 'title'
 * type('title')
 * ```
 *
 * @returns A new `Expression` representing the data type.
 */
declare function type(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the data type of an expression's result.
 *
 * @example
 * ```typescript
 * // Get the data type of a conditional expression
 * type(conditional(exists('foo'), constant(1), constant(true)))
 * ```
 *
 * @returns A new `Expression` representing the data type.
 */
declare function type(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that checks if the value in the specified field is of the given type.
 *
 * @remarks Null or undefined fields evaluate to skip/error. Use `ifAbsent()` / `isAbsent()` to evaluate missing data.
 *
 * @example
 * ```typescript
 * // Check if the 'price' field is a floating point number (evaluating to true inside pipeline conditionals)
 * isType('price', 'float64');
 * ```
 *
 * @param fieldName - The name of the field to check.
 * @param type - The type to check for.
 * @returns A new `BooleanExpression` that evaluates to true if the field's value is of the given type, false otherwise.
 */
declare function isType(fieldName: string, type: Type): BooleanExpression;
/**
 * @beta
 * Creates an expression that checks if the result of an expression is of the given type.
 *
 * @remarks Null or undefined fields evaluate to skip/error. Use `ifAbsent()` / `isAbsent()` to evaluate missing data.
 *
 * @example
 * ```typescript
 * // Check if the result of a calculation is a number
 * isType(add('count', 1), 'number')
 * ```
 *
 * @param expression - The expression to check.
 * @param type - The type to check for.
 * @returns A new `BooleanExpression` that evaluates to true if the expression's result is of the given type, false otherwise.
 */
declare function isType(expression: Expression, type: Type): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that concatenates string functions, fields or constants together.
 *
 * @example
 * ```typescript
 * // Combine the 'firstName', " ", and 'lastName' fields into a single string
 * stringConcat("firstName", " ", field("lastName"));
 * ```
 *
 * @param fieldName - The field name containing the initial string value.
 * @param secondString - An expression or string literal to concatenate.
 * @param otherStrings - Optional additional expressions or literals (typically strings) to concatenate.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the concatenated string.
 */
declare function stringConcat(fieldName: string, secondString: Expression | string, ...otherStrings: Array<Expression | string>): FunctionExpression;
/**
 * @beta
 * Creates an expression that concatenates string expressions together.
 *
 * @example
 * ```typescript
 * // Combine the 'firstName', " ", and 'lastName' fields into a single string
 * stringConcat(field("firstName"), " ", field("lastName"));
 * ```
 *
 * @param firstString - The initial string expression to concatenate to.
 * @param secondString - An expression or string literal to concatenate.
 * @param otherStrings - Optional additional expressions or literals (typically strings) to concatenate.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the concatenated string.
 */
declare function stringConcat(firstString: Expression, secondString: Expression | string, ...otherStrings: Array<Expression | string>): FunctionExpression;
/**
 * @beta
 * Creates an expression that finds the index of the first occurrence of a substring or byte sequence.
 *
 * @example
 * ```typescript
 * // Find the index of "foo" in the 'text' field
 * stringIndexOf("text", "foo");
 * ```
 *
 * @param fieldName - The name of the field containing the string or byte array.
 * @param search - The substring or byte sequence to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the index of the first occurrence.
 */
declare function stringIndexOf(fieldName: string, search: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 * Creates an expression that finds the index of the first occurrence of a substring or byte sequence.
 *
 * @example
 * ```typescript
 * // Find the index of "foo" in the 'text' field
 * stringIndexOf(field("text"), "foo");
 * ```
 *
 * @param expression - The expression representing the string or byte array.
 * @param search - The substring or byte sequence to search for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the index of the first occurrence.
 */
declare function stringIndexOf(expression: Expression, search: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 * Creates an expression that repeats a string or byte array a specified number of times.
 *
 * @example
 * ```typescript
 * // Repeat the 'label' field 3 times
 * stringRepeat("label", 3);
 * ```
 *
 * @param fieldName - The name of the field containing the string or byte array.
 * @param repetitions - The number of times to repeat the string or byte array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the repeated string or byte array.
 */
declare function stringRepeat(fieldName: string, repetitions: number | Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that repeats a string or byte array a specified number of times.
 *
 * @example
 * ```typescript
 * // Repeat the 'label' field 3 times
 * stringRepeat(field("label"), 3);
 * ```
 *
 * @param expression - The expression representing the string or byte array.
 * @param repetitions - The number of times to repeat the string or byte array.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the repeated string or byte array.
 */
declare function stringRepeat(expression: Expression, repetitions: number | Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that replaces all occurrences of a substring or byte sequence with a replacement.
 *
 * @example
 * ```typescript
 * // Replace all occurrences of "foo" with "bar" in the 'text' field
 * stringReplaceAll("text", "foo", "bar");
 * ```
 *
 * @param fieldName - The name of the field containing the string or byte array.
 * @param find - The substring or byte sequence to search for.
 * @param replacement - The replacement string or byte sequence.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the string or byte array with replacements.
 */
declare function stringReplaceAll(fieldName: string, find: string | Expression | Bytes, replacement: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 * Creates an expression that replaces all occurrences of a substring or byte sequence with a replacement.
 *
 * @example
 * ```typescript
 * // Replace all occurrences of "foo" with "bar" in the 'text' field
 * stringReplaceAll(field("text"), "foo", "bar");
 * ```
 *
 * @param expression - The expression representing the string or byte array.
 * @param find - The substring or byte sequence to search for.
 * @param replacement - The replacement string or byte sequence.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the string or byte array with replacements.
 */
declare function stringReplaceAll(expression: Expression, find: string | Expression | Bytes, replacement: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 * Creates an expression that replaces the first occurrence of a substring or byte sequence with a replacement.
 *
 * @example
 * ```typescript
 * // Replace the first occurrence of "foo" with "bar" in the 'text' field
 * stringReplaceOne("text", "foo", "bar");
 * ```
 *
 * @param fieldName - The name of the field containing the string or byte array.
 * @param find - The substring or byte sequence to search for.
 * @param replacement - The replacement string or byte sequence.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the string or byte array with the replacement.
 */
declare function stringReplaceOne(fieldName: string, find: string | Expression | Bytes, replacement: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 * Creates an expression that replaces the first occurrence of a substring or byte sequence with a replacement.
 *
 * @example
 * ```typescript
 * // Replace the first occurrence of "foo" with "bar" in the 'text' field
 * stringReplaceOne(field("text"), "foo", "bar");
 * ```
 *
 * @param expression - The expression representing the string or byte array.
 * @param find - The substring or byte sequence to search for.
 * @param replacement - The replacement string or byte sequence.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the string or byte array with the replacement.
 */
declare function stringReplaceOne(expression: Expression, find: string | Expression | Bytes, replacement: string | Expression | Bytes): FunctionExpression;
/**
 * @beta
 *
 * Accesses a value from a map (object) field using the provided key.
 *
 * @example
 * ```typescript
 * // Get the 'city' value from the 'address' map field
 * mapGet("address", "city");
 * ```
 *
 * @param fieldName - The field name of the map field.
 * @param subField - The key to access in the map.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the value associated with the given key in the map.
 */
declare function mapGet(fieldName: string, subField: string): FunctionExpression;
/**
 * @beta
 *
 * Accesses a value from a map (object) expression using the provided key.
 *
 * @example
 * ```typescript
 * // Get the 'city' value from the 'address' map field
 * mapGet(field("address"), "city");
 * ```
 *
 * @param mapExpression - The expression representing the map.
 * @param subField - The key to access in the map.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the value associated with the given key in the map.
 */
declare function mapGet(mapExpression: Expression, subField: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns a new map with the specified entries added or updated.
 *
 * @remarks
 * This only performs shallow updates to the map. Setting a value to `null`
 * will retain the key with a `null` value. To remove a key entirely, use `mapRemove`.
 *
 * @example
 * ```typescript
 * // Set the 'city' to 'San Francisco' in the 'address' map field
 * mapSet("address", "city", "San Francisco");
 * ```
 *
 * @param mapField - The map field to set entries in.
 * @param key - The key to set. Must be a string or a constant string expression.
 * @param value - The value to set.
 * @param moreKeyValues - Additional key-value pairs to set.
 * @returns A new `Expression` representing the map with the entries set.
 */
declare function mapSet(mapField: string, key: string | Expression, value: unknown, ...moreKeyValues: unknown[]): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns a new map with the specified entries added or updated.
 *
 * @remarks
 * This only performs shallow updates to the map. Setting a value to `null`
 * will retain the key with a `null` value. To remove a key entirely, use `mapRemove`.
 *
 * @example
 * ```typescript
 * // Set the 'city' to "San Francisco"
 * mapSet(map({"state": "California"}), "city", "San Francisco");
 * ```
 *
 * @param mapExpression - The expression representing the map.
 * @param key - The key to set. Must be a string or a constant string expression.
 * @param value - The value to set.
 * @param moreKeyValues - Additional key-value pairs to set.
 * @returns A new `Expression` representing the map with the entries set.
 */
declare function mapSet(mapExpression: Expression, key: string | Expression, value: unknown, ...moreKeyValues: unknown[]): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the keys of a map.
 *
 * @remarks
 * While the backend generally preserves insertion order, relying on the
 * order of the output array is not guaranteed and should be avoided.
 *
 * @example
 * ```typescript
 * // Get the keys of the 'address' map field
 * mapKeys("address");
 * ```
 *
 * @param mapField - The map field to get the keys of.
 * @returns A new `Expression` representing the keys of the map.
 */
declare function mapKeys(mapField: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the keys of a map.
 *
 * @remarks
 * While the backend generally preserves insertion order, relying on the
 * order of the output array is not guaranteed and should be avoided.
 *
 * @example
 * ```typescript
 * // Get the keys of the map expression
 * mapKeys(map({"city": "San Francisco"}));
 * ```
 *
 * @param mapExpression - The expression representing the map to get the keys of.
 * @returns A new `Expression` representing the keys of the map.
 */
declare function mapKeys(mapExpression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the values of a map.
 *
 * @remarks
 * While the backend generally preserves insertion order, relying on the
 * order of the output array is not guaranteed and should be avoided.
 *
 * @example
 * ```typescript
 * // Get the values of the 'address' map field
 * mapValues("address");
 * ```
 *
 * @param mapField - The map field to get the values of.
 * @returns A new `Expression` representing the values of the map.
 */
declare function mapValues(mapField: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the values of a map.
 *
 * @remarks
 * While the backend generally preserves insertion order, relying on the
 * order of the output array is not guaranteed and should be avoided.
 *
 * @example
 * ```typescript
 * // Get the values of the map expression
 * mapValues(map({"city": "San Francisco"}));
 * ```
 *
 * @param mapExpression - The expression representing the map to get the values of.
 * @returns A new `Expression` representing the values of the map.
 */
declare function mapValues(mapExpression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the entries of a map as an array of maps,
 * where each map contains a `"k"` property for the key and a `"v"` property for the value.
 * For example: `[{ k: "key1", v: "value1" }, ...]`.
 *
 * @remarks
 * While the backend generally preserves insertion order, relying on the
 * order of the output array is not guaranteed and should be avoided.
 *
 * @example
 * ```typescript
 * // Get the entries of the 'address' map field
 * mapEntries("address");
 * ```
 *
 * @param mapField - The map field to get the entries of.
 * @returns A new `Expression` representing the entries of the map.
 */
declare function mapEntries(mapField: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the entries of a map as an array of maps,
 * where each map contains a `"k"` property for the key and a `"v"` property for the value.
 * For example: `[{ k: "key1", v: "value1" }, ...]`.
 *
 * @remarks
 * While the backend generally preserves insertion order, relying on the
 * order of the output array is not guaranteed and should be avoided.
 *
 * @example
 * ```typescript
 * // Get the entries of the map expression
 * mapEntries(map({"city": "San Francisco"}));
 * ```
 *
 * @param mapExpression - The expression representing the map to get the entries of.
 * @returns A new `Expression` representing the entries of the map.
 */
declare function mapEntries(mapExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an aggregation that counts the total number of stage inputs.
 *
 * @example
 * ```typescript
 * // Count the total number of input documents
 * countAll().as("totalDocument");
 * ```
 *
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'countAll' aggregation.
 */
declare function countAll(): AggregateFunction;
/**
 * @beta
 *
 * Creates an aggregation that counts the number of stage inputs with valid evaluations of the
 * provided expression.
 *
 * @example
 * ```typescript
 * // Count the number of items where the price is greater than 10
 * count(field("price").greaterThan(10)).as("expensiveItemCount");
 * ```
 *
 * @param expression - The expression to count.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'count' aggregation.
 */
declare function count$1(expression: Expression): AggregateFunction;
/**
 * @beta
 * Creates an aggregation that counts the number of stage inputs where the input field exists.
 *
 * @example
 * ```typescript
 * // Count the total number of products
 * count("productId").as("totalProducts");
 * ```
 *
 * @param fieldName - The name of the field to count.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'count' aggregation.
 */
declare function count$1(fieldName: string): AggregateFunction;
/**
 * @beta
 *
 * Creates an aggregation that calculates the sum of values from an expression across multiple
 * stage inputs.
 *
 * @example
 * ```typescript
 * // Calculate the total revenue from a set of orders
 * sum(field("orderAmount")).as("totalRevenue");
 * ```
 *
 * @param expression - The expression to sum up.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'sum' aggregation.
 */
declare function sum$1(expression: Expression): AggregateFunction;
/**
 * @beta
 *
 * Creates an aggregation that calculates the sum of a field's values across multiple stage
 * inputs.
 *
 * @example
 * ```typescript
 * // Calculate the total revenue from a set of orders
 * sum("orderAmount").as("totalRevenue");
 * ```
 *
 * @param fieldName - The name of the field containing numeric values to sum up.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'sum' aggregation.
 */
declare function sum$1(fieldName: string): AggregateFunction;
/**
 * @beta
 *
 * Creates an aggregation that calculates the average (mean) of values from an expression across
 * multiple stage inputs.
 *
 * @example
 * ```typescript
 * // Calculate the average age of users
 * average(field("age")).as("averageAge");
 * ```
 *
 * @param expression - The expression representing the values to average.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'average' aggregation.
 */
declare function average$1(expression: Expression): AggregateFunction;
/**
 * @beta
 *
 * Creates an aggregation that calculates the average (mean) of a field's values across multiple
 * stage inputs.
 *
 * @example
 * ```typescript
 * // Calculate the average age of users
 * average("age").as("averageAge");
 * ```
 *
 * @param fieldName - The name of the field containing numeric values to average.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'average' aggregation.
 */
declare function average$1(fieldName: string): AggregateFunction;
/**
 * @beta
 *
 * Creates an aggregation that finds the minimum value of an expression across multiple stage
 * inputs.
 *
 * @example
 * ```typescript
 * // Find the lowest price of all products
 * minimum(field("price")).as("lowestPrice");
 * ```
 *
 * @param expression - The expression to find the minimum value of.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'minimum' aggregation.
 */
declare function minimum(expression: Expression): AggregateFunction;
/**
 * @beta
 *
 * Creates an aggregation that finds the minimum value of a field across multiple stage inputs.
 *
 * @example
 * ```typescript
 * // Find the lowest price of all products
 * minimum("price").as("lowestPrice");
 * ```
 *
 * @param fieldName - The name of the field to find the minimum value of.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'minimum' aggregation.
 */
declare function minimum(fieldName: string): AggregateFunction;
/**
 * @beta
 *
 * Creates an aggregation that finds the maximum value of an expression across multiple stage
 * inputs.
 *
 * @example
 * ```typescript
 * // Find the highest score in a leaderboard
 * maximum(field("score")).as("highestScore");
 * ```
 *
 * @param expression - The expression to find the maximum value of.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'maximum' aggregation.
 */
declare function maximum(expression: Expression): AggregateFunction;
/**
 * @beta
 *
 * Creates an aggregation that finds the maximum value of a field across multiple stage inputs.
 *
 * @example
 * ```typescript
 * // Find the highest score in a leaderboard
 * maximum("score").as("highestScore");
 * ```
 *
 * @param fieldName - The name of the field to find the maximum value of.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'maximum' aggregation.
 */
declare function maximum(fieldName: string): AggregateFunction;
/**
 * @beta
 * Creates an aggregation that finds the first value of an expression across multiple stage
 * inputs.
 *
 * @example
 * ```typescript
 * // Find the first value of the 'rating' field
 * first(field("rating")).as("firstRating");
 * ```
 *
 * @param expression - The expression to find the first value of.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'first' aggregation.
 */
declare function first(expression: Expression): AggregateFunction;
/**
 * @beta
 * Creates an aggregation that finds the first value of a field across multiple stage inputs.
 *
 * @example
 * ```typescript
 * // Find the first value of the 'rating' field
 * first("rating").as("firstRating");
 * ```
 *
 * @param fieldName - The name of the field to find the first value of.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'first' aggregation.
 */
declare function first(fieldName: string): AggregateFunction;
/**
 * @beta
 * Creates an aggregation that finds the last value of an expression across multiple stage
 * inputs.
 *
 * @example
 * ```typescript
 * // Find the last value of the 'rating' field
 * last(field("rating")).as("lastRating");
 * ```
 *
 * @param expression - The expression to find the last value of.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'last' aggregation.
 */
declare function last(expression: Expression): AggregateFunction;
/**
 * @beta
 * Creates an aggregation that finds the last value of a field across multiple stage inputs.
 *
 * @example
 * ```typescript
 * // Find the last value of the 'rating' field
 * last("rating").as("lastRating");
 * ```
 *
 * @param fieldName - The name of the field to find the last value of.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'last' aggregation.
 */
declare function last(fieldName: string): AggregateFunction;
/**
 * @beta
 * Creates an aggregation that collects all values of an expression across multiple stage
 * inputs into an array.
 *
 * @remarks
 * If the expression resolves to an absent value, it is converted to `null`.
 * The order of elements in the output array is not stable and shouldn't be relied upon.
 *
 * @example
 * ```typescript
 * // Collect all tags from books into an array
 * arrayAgg(field("tags")).as("allTags");
 * ```
 *
 * @param expression - The expression to collect values from.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'array_agg' aggregation.
 */
declare function arrayAgg(expression: Expression): AggregateFunction;
/**
 * @beta
 * Creates an aggregation that collects all values of a field across multiple stage inputs
 * into an array.
 *
 * @remarks
 * If the expression resolves to an absent value, it is converted to `null`.
 * The order of elements in the output array is not stable and shouldn't be relied upon.
 *
 * @example
 * ```typescript
 * // Collect all tags from books into an array
 * arrayAgg("tags").as("allTags");
 * ```
 *
 * @param fieldName - The name of the field to collect values from.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'array_agg' aggregation.
 */
declare function arrayAgg(fieldName: string): AggregateFunction;
/**
 * @beta
 * Creates an aggregation that collects all distinct values of an expression across multiple stage
 * inputs into an array.
 *
 * @remarks
 * If the expression resolves to an absent value, it is converted to `null`.
 * The order of elements in the output array is not stable and shouldn't be relied upon.
 *
 * @example
 * ```typescript
 * // Collect all distinct tags from books into an array
 * arrayAggDistinct(field("tags")).as("allDistinctTags");
 * ```
 *
 * @param expression - The expression to collect values from.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'array_agg_distinct' aggregation.
 */
declare function arrayAggDistinct(expression: Expression): AggregateFunction;
/**
 * @beta
 * Creates an aggregation that collects all distinct values of a field across multiple stage inputs
 * into an array.
 *
 * @remarks
 * If the expression resolves to an absent value, it is converted to `null`.
 * The order of elements in the output array is not stable and shouldn't be relied upon.
 *
 * @example
 * ```typescript
 * // Collect all distinct tags from books into an array
 * arrayAggDistinct("tags").as("allDistinctTags");
 * ```
 *
 * @param fieldName - The name of the field to collect values from.
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'array_agg_distinct' aggregation.
 */
declare function arrayAggDistinct(fieldName: string): AggregateFunction;
/**
 * @beta
 *
 * Calculates the Cosine distance between a field's vector value and a literal vector value.
 *
 * @example
 * ```typescript
 * // Calculate the Cosine distance between the 'location' field and a target location
 * cosineDistance("location", [37.7749, -122.4194]);
 * ```
 *
 * @param fieldName - The name of the field containing the first vector.
 * @param vector - The other vector (as an array of doubles) or {@link VectorValue} to compare against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the Cosine distance between the two vectors.
 */
declare function cosineDistance(fieldName: string, vector: number[] | VectorValue): FunctionExpression;
/**
 * @beta
 *
 * Calculates the Cosine distance between a field's vector value and a vector expression.
 *
 * @example
 * ```typescript
 * // Calculate the cosine distance between the 'userVector' field and the 'itemVector' field
 * cosineDistance("userVector", field("itemVector"));
 * ```
 *
 * @param fieldName - The name of the field containing the first vector.
 * @param vectorExpression - The other vector (represented as an `Expression`) to compare against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the cosine distance between the two vectors.
 */
declare function cosineDistance(fieldName: string, vectorExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Calculates the Cosine distance between a vector expression and a vector literal.
 *
 * @example
 * ```typescript
 * // Calculate the cosine distance between the 'location' field and a target location
 * cosineDistance(field("location"), [37.7749, -122.4194]);
 * ```
 *
 * @param vectorExpression - The first vector (represented as an `Expression`) to compare against.
 * @param vector - The other vector (as an array of doubles or VectorValue) to compare against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the cosine distance between the two vectors.
 */
declare function cosineDistance(vectorExpression: Expression, vector: number[] | VectorValue): FunctionExpression;
/**
 * @beta
 *
 * Calculates the Cosine distance between two vector expressions.
 *
 * @example
 * ```typescript
 * // Calculate the cosine distance between the 'userVector' field and the 'itemVector' field
 * cosineDistance(field("userVector"), field("itemVector"));
 * ```
 *
 * @param vectorExpression - The first vector (represented as an `Expression`) to compare against.
 * @param otherVectorExpression - The other vector (represented as an `Expression`) to compare against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the cosine distance between the two vectors.
 */
declare function cosineDistance(vectorExpression: Expression, otherVectorExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Calculates the dot product between a field's vector value and a double array.
 *
 * @example
 * ```typescript
 * // Calculate the dot product distance between a feature vector and a target vector
 * dotProduct("features", [0.5, 0.8, 0.2]);
 * ```
 *
 * @param fieldName - The name of the field containing the first vector.
 * @param vector - The other vector (as an array of doubles or VectorValue) to calculate with.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the dot product between the two vectors.
 */
declare function dotProduct(fieldName: string, vector: number[] | VectorValue): FunctionExpression;
/**
 * @beta
 *
 * Calculates the dot product between a field's vector value and a vector expression.
 *
 * @example
 * ```typescript
 * // Calculate the dot product distance between two document vectors: 'docVector1' and 'docVector2'
 * dotProduct("docVector1", field("docVector2"));
 * ```
 *
 * @param fieldName - The name of the field containing the first vector.
 * @param vectorExpression - The other vector (represented as an `Expression`) to calculate with.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the dot product between the two vectors.
 */
declare function dotProduct(fieldName: string, vectorExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Calculates the dot product between a vector expression and a double array.
 *
 * @example
 * ```typescript
 * // Calculate the dot product between a feature vector and a target vector
 * dotProduct(field("features"), [0.5, 0.8, 0.2]);
 * ```
 *
 * @param vectorExpression - The first vector (represented as an `Expression`) to calculate with.
 * @param vector - The other vector (as an array of doubles or VectorValue) to calculate with.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the dot product between the two vectors.
 */
declare function dotProduct(vectorExpression: Expression, vector: number[] | VectorValue): FunctionExpression;
/**
 * @beta
 *
 * Calculates the dot product between two vector expressions.
 *
 * @example
 * ```typescript
 * // Calculate the dot product between two document vectors: 'docVector1' and 'docVector2'
 * dotProduct(field("docVector1"), field("docVector2"));
 * ```
 *
 * @param vectorExpression - The first vector (represented as an `Expression`) to calculate with.
 * @param otherVectorExpression - The other vector (represented as an `Expression`) to calculate with.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the dot product between the two vectors.
 */
declare function dotProduct(vectorExpression: Expression, otherVectorExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Calculates the Euclidean distance between a field's vector value and a double array.
 *
 * @example
 * ```typescript
 * // Calculate the Euclidean distance between the 'location' field and a target location
 * euclideanDistance("location", [37.7749, -122.4194]);
 * ```
 *
 * @param fieldName - The name of the field containing the first vector.
 * @param vector - The other vector (as an array of doubles or VectorValue) to compare against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the Euclidean distance between the two vectors.
 */
declare function euclideanDistance(fieldName: string, vector: number[] | VectorValue): FunctionExpression;
/**
 * @beta
 *
 * Calculates the Euclidean distance between a field's vector value and a vector expression.
 *
 * @example
 * ```typescript
 * // Calculate the Euclidean distance between two vector fields: 'pointA' and 'pointB'
 * euclideanDistance("pointA", field("pointB"));
 * ```
 *
 * @param fieldName - The name of the field containing the first vector.
 * @param vectorExpression - The other vector (represented as an `Expression`) to compare against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the Euclidean distance between the two vectors.
 */
declare function euclideanDistance(fieldName: string, vectorExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Calculates the Euclidean distance between a vector expression and a double array.
 *
 * @example
 * ```typescript
 * // Calculate the Euclidean distance between the 'location' field and a target location
 *
 * euclideanDistance(field("location"), [37.7749, -122.4194]);
 * ```
 *
 * @param vectorExpression - The first vector (represented as an `Expression`) to compare against.
 * @param vector - The other vector (as an array of doubles or VectorValue) to compare against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the Euclidean distance between the two vectors.
 */
declare function euclideanDistance(vectorExpression: Expression, vector: number[] | VectorValue): FunctionExpression;
/**
 * @beta
 *
 * Calculates the Euclidean distance between two vector expressions.
 *
 * @example
 * ```typescript
 * // Calculate the Euclidean distance between two vector fields: 'pointA' and 'pointB'
 * euclideanDistance(field("pointA"), field("pointB"));
 * ```
 *
 * @param vectorExpression - The first vector (represented as an `Expression`) to compare against.
 * @param otherVectorExpression - The other vector (represented as an `Expression`) to compare against.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the Euclidean distance between the two vectors.
 */
declare function euclideanDistance(vectorExpression: Expression, otherVectorExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the length of a Firestore Vector.
 *
 * @example
 * ```typescript
 * // Get the vector length (dimension) of the field 'embedding'.
 * vectorLength(field("embedding"));
 * ```
 *
 * @param vectorExpression - The expression representing the Firestore Vector.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the array.
 */
declare function vectorLength(vectorExpression: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that calculates the length of a Firestore Vector represented by a field.
 *
 * @example
 * ```typescript
 * // Get the vector length (dimension) of the field 'embedding'.
 * vectorLength("embedding");
 * ```
 *
 * @param fieldName - The name of the field representing the Firestore Vector.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the array.
 */
declare function vectorLength(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that interprets an expression as the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
 * and returns a timestamp.
 *
 * @example
 * ```typescript
 * // Interpret the 'microseconds' field as microseconds since epoch.
 * unixMicrosToTimestamp(field("microseconds"));
 * ```
 *
 * @param expr - The expression representing the number of microseconds since epoch.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
 */
declare function unixMicrosToTimestamp(expr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that interprets a field's value as the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
 * and returns a timestamp.
 *
 * @example
 * ```typescript
 * // Interpret the 'microseconds' field as microseconds since epoch.
 * unixMicrosToTimestamp("microseconds");
 * ```
 *
 * @param fieldName - The name of the field representing the number of microseconds since epoch.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
 */
declare function unixMicrosToTimestamp(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that converts a timestamp expression to the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
 *
 * @example
 * ```typescript
 * // Convert the 'timestamp' field to microseconds since epoch.
 * timestampToUnixMicros(field("timestamp"));
 * ```
 *
 * @param expr - The expression representing the timestamp.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of microseconds since epoch.
 */
declare function timestampToUnixMicros(expr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that converts a timestamp field to the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
 *
 * @example
 * ```typescript
 * // Convert the 'timestamp' field to microseconds since epoch.
 * timestampToUnixMicros("timestamp");
 * ```
 *
 * @param fieldName - The name of the field representing the timestamp.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of microseconds since epoch.
 */
declare function timestampToUnixMicros(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that interprets an expression as the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
 * and returns a timestamp.
 *
 * @example
 * ```typescript
 * // Interpret the 'milliseconds' field as milliseconds since epoch.
 * unixMillisToTimestamp(field("milliseconds"));
 * ```
 *
 * @param expr - The expression representing the number of milliseconds since epoch.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
 */
declare function unixMillisToTimestamp(expr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that interprets a field's value as the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
 * and returns a timestamp.
 *
 * @example
 * ```typescript
 * // Interpret the 'milliseconds' field as milliseconds since epoch.
 * unixMillisToTimestamp("milliseconds");
 * ```
 *
 * @param fieldName - The name of the field representing the number of milliseconds since epoch.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
 */
declare function unixMillisToTimestamp(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that converts a timestamp expression to the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
 *
 * @example
 * ```typescript
 * // Convert the 'timestamp' field to milliseconds since epoch.
 * timestampToUnixMillis(field("timestamp"));
 * ```
 *
 * @param expr - The expression representing the timestamp.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of milliseconds since epoch.
 */
declare function timestampToUnixMillis(expr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that converts a timestamp field to the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
 *
 * @example
 * ```typescript
 * // Convert the 'timestamp' field to milliseconds since epoch.
 * timestampToUnixMillis("timestamp");
 * ```
 *
 * @param fieldName - The name of the field representing the timestamp.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of milliseconds since epoch.
 */
declare function timestampToUnixMillis(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that interprets an expression as the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC)
 * and returns a timestamp.
 *
 * @example
 * ```typescript
 * // Interpret the 'seconds' field as seconds since epoch.
 * unixSecondsToTimestamp(field("seconds"));
 * ```
 *
 * @param expr - The expression representing the number of seconds since epoch.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
 */
declare function unixSecondsToTimestamp(expr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that interprets a field's value as the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC)
 * and returns a timestamp.
 *
 * @example
 * ```typescript
 * // Interpret the 'seconds' field as seconds since epoch.
 * unixSecondsToTimestamp("seconds");
 * ```
 *
 * @param fieldName - The name of the field representing the number of seconds since epoch.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
 */
declare function unixSecondsToTimestamp(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that converts a timestamp expression to the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC).
 *
 * @example
 * ```typescript
 * // Convert the 'timestamp' field to seconds since epoch.
 * timestampToUnixSeconds(field("timestamp"));
 * ```
 *
 * @param expr - The expression representing the timestamp.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of seconds since epoch.
 */
declare function timestampToUnixSeconds(expr: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that converts a timestamp field to the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC).
 *
 * @example
 * ```typescript
 * // Convert the 'timestamp' field to seconds since epoch.
 * timestampToUnixSeconds("timestamp");
 * ```
 *
 * @param fieldName - The name of the field representing the timestamp.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of seconds since epoch.
 */
declare function timestampToUnixSeconds(fieldName: string): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that adds a specified amount of time to a timestamp.
 *
 * @example
 * ```typescript
 * // Add some duration determined by field 'unit' and 'amount' to the 'timestamp' field.
 * timestampAdd(field("timestamp"), field("unit"), field("amount"));
 * ```
 *
 * @param timestamp - The expression representing the timestamp.
 * @param unit - The expression evaluates to unit of time, must be one of 'microsecond', 'millisecond', 'second', 'minute', 'hour', 'day'.
 * @param amount - The expression evaluates to amount of the unit.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
 */
declare function timestampAdd(timestamp: Expression, unit: Expression, amount: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that adds a specified amount of time to a timestamp.
 *
 * @example
 * ```typescript
 * // Add 1 day to the 'timestamp' field.
 * timestampAdd(field("timestamp"), "day", 1);
 * ```
 *
 * @param timestamp - The expression representing the timestamp.
 * @param unit - The unit of time to add (e.g., "day", "hour").
 * @param amount - The amount of time to add.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
 */
declare function timestampAdd(timestamp: Expression, unit: 'microsecond' | 'millisecond' | 'second' | 'minute' | 'hour' | 'day', amount: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that adds a specified amount of time to a timestamp represented by a field.
 *
 * @example
 * ```typescript
 * // Add 1 day to the 'timestamp' field.
 * timestampAdd("timestamp", "day", 1);
 * ```
 *
 * @param fieldName - The name of the field representing the timestamp.
 * @param unit - The unit of time to add (e.g., "day", "hour").
 * @param amount - The amount of time to add.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
 */
declare function timestampAdd(fieldName: string, unit: 'microsecond' | 'millisecond' | 'second' | 'minute' | 'hour' | 'day', amount: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that subtracts a specified amount of time from a timestamp.
 *
 * @example
 * ```typescript
 * // Subtract some duration determined by field 'unit' and 'amount' from the 'timestamp' field.
 * timestampSubtract(field("timestamp"), field("unit"), field("amount"));
 * ```
 *
 * @param timestamp - The expression representing the timestamp.
 * @param unit - The expression evaluates to unit of time, must be one of 'microsecond', 'millisecond', 'second', 'minute', 'hour', 'day'.
 * @param amount - The expression evaluates to amount of the unit.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
 */
declare function timestampSubtract(timestamp: Expression, unit: Expression, amount: Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that subtracts a specified amount of time from a timestamp.
 *
 * @example
 * ```typescript
 * // Subtract 1 day from the 'timestamp' field.
 * timestampSubtract(field("timestamp"), "day", 1);
 * ```
 *
 * @param timestamp - The expression representing the timestamp.
 * @param unit - The unit of time to subtract (e.g., "day", "hour").
 * @param amount - The amount of time to subtract.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
 */
declare function timestampSubtract(timestamp: Expression, unit: 'microsecond' | 'millisecond' | 'second' | 'minute' | 'hour' | 'day', amount: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that subtracts a specified amount of time from a timestamp represented by a field.
 *
 * @example
 * ```typescript
 * // Subtract 1 day from the 'timestamp' field.
 * timestampSubtract("timestamp", "day", 1);
 * ```
 *
 * @param fieldName - The name of the field representing the timestamp.
 * @param unit - The unit of time to subtract (e.g., "day", "hour").
 * @param amount - The amount of time to subtract.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the resulting timestamp.
 */
declare function timestampSubtract(fieldName: string, unit: 'microsecond' | 'millisecond' | 'second' | 'minute' | 'hour' | 'day', amount: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that evaluates to the current server timestamp.
 *
 * @example
 * ```typescript
 * // Get the current server timestamp
 * currentTimestamp()
 * ```
 *
 * @returns A new Expression representing the current server timestamp.
 */
declare function currentTimestamp(): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that performs a logical 'AND' operation on multiple filter conditions.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is greater than 18 AND the 'city' field is "London" AND
 * // the 'status' field is "active"
 * const condition = and(greaterThan("age", 18), equal("city", "London"), equal("status", "active"));
 * ```
 *
 * @param first - The first filter condition.
 * @param second - The second filter condition.
 * @param more - Additional filter conditions to 'AND' together.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical 'AND' operation.
 */
declare function and$1(first: BooleanExpression, second: BooleanExpression, ...more: BooleanExpression[]): BooleanExpression;
/**
 * @beta
 *
 * Creates an expression that performs a logical 'OR' operation on multiple filter conditions.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is greater than 18 OR the 'city' field is "London" OR
 * // the 'status' field is "active"
 * const condition = or(greaterThan("age", 18), equal("city", "London"), equal("status", "active"));
 * ```
 *
 * @param first - The first filter condition.
 * @param second - The second filter condition.
 * @param more - Additional filter conditions to 'OR' together.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical 'OR' operation.
 */
declare function or$1(first: BooleanExpression, second: BooleanExpression, ...more: BooleanExpression[]): BooleanExpression;
/**
 * @beta
 * Creates an expression that returns the value of the base expression raised to the power of the exponent expression.
 *
 * @example
 * ```typescript
 * // Raise the value of the 'base' field to the power of the 'exponent' field.
 * pow(field("base"), field("exponent"));
 * ```
 *
 * @param base - The expression to raise to the power of the exponent.
 * @param exponent - The expression to raise the base to the power of.
 * @returns A new `Expression` representing the power operation.
 */
declare function pow(base: Expression, exponent: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the value of the base expression raised to the power of the exponent.
 *
 * @example
 * ```typescript
 * // Raise the value of the 'base' field to the power of 2.
 * pow(field("base"), 2);
 * ```
 *
 * @param base - The expression to raise to the power of the exponent.
 * @param exponent - The constant value to raise the base to the power of.
 * @returns A new `Expression` representing the power operation.
 */
declare function pow(base: Expression, exponent: number): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the value of the base field raised to the power of the exponent expression.
 *
 * @example
 * ```typescript
 * // Raise the value of the 'base' field to the power of the 'exponent' field.
 * pow("base", field("exponent"));
 * ```
 *
 * @param base - The name of the field to raise to the power of the exponent.
 * @param exponent - The expression to raise the base to the power of.
 * @returns A new `Expression` representing the power operation.
 */
declare function pow(base: string, exponent: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the value of the base field raised to the power of the exponent.
 *
 * @example
 * ```typescript
 * // Raise the value of the 'base' field to the power of 2.
 * pow("base", 2);
 * ```
 *
 * @param base - The name of the field to raise to the power of the exponent.
 * @param exponent - The constant value to raise the base to the power of.
 * @returns A new `Expression` representing the power operation.
 */
declare function pow(base: string, exponent: number): FunctionExpression;
/**
 * @beta
 *
 * Creates an expression that generates a random number between 0.0 and 1.0 but not including 1.0.
 *
 * @example
 * ```typescript
 * // Generate a random number between 0.0 and 1.0.
 * rand();
 * ```
 *
 * @returns A new `Expression` representing the rand operation.
 */
declare function rand(): FunctionExpression;
/**
 * @beta
 * Creates an expression that rounds a numeric value to the nearest whole number.
 *
 * @example
 * ```typescript
 * // Round the value of the 'price' field.
 * round("price");
 * ```
 *
 * @param fieldName - The name of the field to round.
 * @returns A new `Expression` representing the rounded value.
 */
declare function round(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that rounds a numeric value to the nearest whole number.
 *
 * @example
 * ```typescript
 * // Round the value of the 'price' field.
 * round(field("price"));
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which will be rounded.
 * @returns A new `Expression` representing the rounded value.
 */
declare function round(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that rounds a numeric value to the specified number of decimal places.
 *
 * @example
 * ```typescript
 * // Round the value of the 'price' field to two decimal places.
 * round("price", 2);
 * ```
 *
 * @param fieldName - The name of the field to round.
 * @param decimalPlaces - A constant or expression specifying the rounding precision in decimal places.
 * @returns A new `Expression` representing the rounded value.
 */
declare function round(fieldName: string, decimalPlaces: number | Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that rounds a numeric value to the specified number of decimal places.
 *
 * @example
 * ```typescript
 * // Round the value of the 'price' field to two decimal places.
 * round(field("price"), constant(2));
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which will be rounded.
 * @param decimalPlaces - A constant or expression specifying the rounding precision in decimal places.
 * @returns A new `Expression` representing the rounded value.
 */
declare function round(expression: Expression, decimalPlaces: number | Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that truncates the numeric value of a field to an integer.
 *
 * @example
 * ```typescript
 * // Truncate the value of the 'rating' field
 * trunc("rating");
 * ```
 *
 * @param fieldName - The name of the field containing the number to truncate.
 * @returns A new `Expression` representing the truncated value.
 */
declare function trunc(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that truncates the numeric value of an expression to an integer.
 *
 * @example
 * ```typescript
 * // Truncate the value of the 'rating' field.
 * trunc(field("rating"));
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which will be truncated.
 * @returns A new `Expression` representing the truncated value.
 */
declare function trunc(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that truncates a numeric expression to the specified number of decimal places.
 *
 * @example
 * ```typescript
 * // Truncate the value of the 'rating' field to two decimal places.
 * trunc("rating", 2);
 * ```
 *
 * @param fieldName - The name of the field to truncate.
 * @param decimalPlaces - A constant or expression specifying the truncation precision in decimal places.
 * @returns A new `Expression` representing the truncated value.
 */
declare function trunc(fieldName: string, decimalPlaces: number | Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that truncates a numeric value to the specified number of decimal places.
 *
 * @example
 * ```typescript
 * // Truncate the value of the 'rating' field to two decimal places.
 * trunc(field("rating"), constant(2));
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which will be truncated.
 * @param decimalPlaces - A constant or expression specifying the truncation precision in decimal places.
 * @returns A new `Expression` representing the truncated value.
 */
declare function trunc(expression: Expression, decimalPlaces: number | Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the collection ID from a path.
 *
 * @example
 * ```typescript
 * // Get the collection ID from a path.
 * collectionId("__name__");
 * ```
 *
 * @param fieldName - The name of the field to get the collection ID from.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the collectionId operation.
 */
declare function collectionId(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the collection ID from a path.
 *
 * @example
 * ```typescript
 * // Get the collection ID from a path.
 * collectionId(field("__name__"));
 * ```
 *
 * @param expression - An expression evaluating to a path, which the collection ID will be extracted from.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the collectionId operation.
 */
declare function collectionId(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that calculates the length of a string, array, map, vector, or bytes.
 *
 * @example
 * ```typescript
 * // Get the length of the 'name' field.
 * length("name");
 *
 * // Get the number of items in the 'cart' array.
 * length("cart");
 * ```
 *
 * @param fieldName - The name of the field to calculate the length of.
 * @returns A new `Expression` representing the length of the string, array, map, vector, or bytes.
 */
declare function length(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that calculates the length of a string, array, map, vector, or bytes.
 *
 * @example
 * ```typescript
 * // Get the length of the 'name' field.
 * length(field("name"));
 *
 * // Get the number of items in the 'cart' array.
 * length(field("cart"));
 * ```
 *
 * @param expression - An expression evaluating to a string, array, map, vector, or bytes, which the length will be calculated for.
 * @returns A new `Expression` representing the length of the string, array, map, vector, or bytes.
 */
declare function length(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the natural logarithm of a numeric value.
 *
 * @example
 * ```typescript
 * // Compute the natural logarithm of the 'value' field.
 * ln("value");
 * ```
 *
 * @param fieldName - The name of the field to compute the natural logarithm of.
 * @returns A new `Expression` representing the natural logarithm of the numeric value.
 */
declare function ln(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the natural logarithm of a numeric value.
 *
 * @example
 * ```typescript
 * // Compute the natural logarithm of the 'value' field.
 * ln(field("value"));
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which the natural logarithm will be computed for.
 * @returns A new `Expression` representing the natural logarithm of the numeric value.
 */
declare function ln(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the logarithm of an expression to a given base.
 *
 * @example
 * ```typescript
 * // Compute the logarithm of the 'value' field with base 10.
 * log(field("value"), 10);
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which the logarithm will be computed for.
 * @param base - The base of the logarithm.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logarithm of the numeric value.
 */
declare function log(expression: Expression, base: number): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the logarithm of an expression to a given base.
 *
 * @example
 * ```typescript
 * // Compute the logarithm of the 'value' field with the base in the 'base' field.
 * log(field("value"), field("base"));
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which the logarithm will be computed for.
 * @param base - The base of the logarithm.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logarithm of the numeric value.
 */
declare function log(expression: Expression, base: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the logarithm of a field to a given base.
 *
 * @example
 * ```typescript
 * // Compute the logarithm of the 'value' field with base 10.
 * log("value", 10);
 * ```
 *
 * @param fieldName - The name of the field to compute the logarithm of.
 * @param base - The base of the logarithm.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logarithm of the numeric value.
 */
declare function log(fieldName: string, base: number): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the logarithm of a field to a given base.
 *
 * @example
 * ```typescript
 * // Compute the logarithm of the 'value' field with the base in the 'base' field.
 * log("value", field("base"));
 * ```
 *
 * @param fieldName - The name of the field to compute the logarithm of.
 * @param base - The base of the logarithm.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logarithm of the numeric value.
 */
declare function log(fieldName: string, base: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the square root of a numeric value.
 *
 * @example
 * ```typescript
 * // Compute the square root of the 'value' field.
 * sqrt(field("value"));
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which the square root will be computed for.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the square root of the numeric value.
 */
declare function sqrt(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the square root of a numeric value.
 *
 * @example
 * ```typescript
 * // Compute the square root of the 'value' field.
 * sqrt("value");
 * ```
 *
 * @param fieldName - The name of the field to compute the square root of.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the square root of the numeric value.
 */
declare function sqrt(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that reverses a string.
 *
 * @example
 * ```typescript
 * // Reverse the value of the 'myString' field.
 * stringReverse(field("myString"));
 * ```
 *
 * @param stringExpression - An expression evaluating to a string value, which will be reversed.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
 */
declare function stringReverse(stringExpression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that reverses a string value in the specified field.
 *
 * @example
 * ```typescript
 * // Reverse the value of the 'myString' field.
 * stringReverse("myString");
 * ```
 *
 * @param field - The name of the field representing the string to reverse.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
 */
declare function stringReverse(field: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that concatenates strings, arrays, or blobs. Types cannot be mixed.
 *
 * @example
 * ```typescript
 * // Concatenate the 'firstName' and 'lastName' fields with a space in between.
 * concat(field("firstName"), " ", field("lastName"))
 * ```
 *
 * @param first - The first expressions to concatenate.
 * @param second - The second literal or expression to concatenate.
 * @param others - Additional literals or expressions to concatenate.
 * @returns A new `Expression` representing the concatenation.
 */
declare function concat(first: Expression, second: Expression | unknown, ...others: Array<Expression | unknown>): FunctionExpression;
/**
 * @beta
 * Creates an expression that concatenates strings, arrays, or blobs. Types cannot be mixed.
 *
 * @example
 * ```typescript
 * // Concatenate a field with a literal string.
 * concat(field("firstName"), "Doe")
 * ```
 *
 * @param fieldName - The name of a field to concatenate.
 * @param second - The second literal or expression to concatenate.
 * @param others - Additional literal or expressions to concatenate.
 * @returns A new `Expression` representing the concatenation.
 */
declare function concat(fieldName: string, second: Expression | unknown, ...others: Array<Expression | unknown>): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the absolute value of a numeric value.
 *
 * @param expr - The expression to compute the absolute value of.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the absolute value of the numeric value.
 */
declare function abs(expr: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the absolute value of a numeric value.
 *
 * @param fieldName - The field to compute the absolute value of.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the absolute value of the numeric value.
 */
declare function abs(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that returns the `elseExpr` argument if `ifExpr` is absent, else return
 * the result of the `ifExpr` argument evaluation.
 *
 * @example
 * ```typescript
 * // Returns the value of the optional field 'optional_field', or returns 'default_value'
 * // if the field is absent.
 * ifAbsent(field("optional_field"), constant("default_value"))
 * ```
 *
 * @param ifExpr - The expression to check for absence.
 * @param elseExpr - The expression that will be evaluated and returned if [ifExpr] is absent.
 * @returns A new Expression representing the ifAbsent operation.
 */
declare function ifAbsent(ifExpr: Expression, elseExpr: Expression): Expression;
/**
 * @beta
 * Creates an expression that returns the `elseValue` argument if `ifExpr` is absent, else
 * return the result of the `ifExpr` argument evaluation.
 *
 * @example
 * ```typescript
 * // Returns the value of the optional field 'optional_field', or returns 'default_value'
 * // if the field is absent.
 * ifAbsent(field("optional_field"), "default_value")
 * ```
 *
 * @param ifExpr - The expression to check for absence.
 * @param elseValue - The value that will be returned if `ifExpr` evaluates to an absent value.
 * @returns A new [Expression] representing the ifAbsent operation.
 */
declare function ifAbsent(ifExpr: Expression, elseValue: unknown): Expression;
/**
 * @beta
 * Creates an expression that returns the `elseExpr` argument if `ifFieldName` is absent, else
 * return the value of the field.
 *
 * @example
 * ```typescript
 * // Returns the value of the optional field 'optional_field', or returns the value of
 * // 'default_field' if 'optional_field' is absent.
 * ifAbsent("optional_field", field("default_field"))
 * ```
 *
 * @param ifFieldName - The field to check for absence.
 * @param elseExpr - The expression that will be evaluated and returned if `ifFieldName` is
 * absent.
 * @returns A new Expression representing the ifAbsent operation.
 */
declare function ifAbsent(ifFieldName: string, elseExpr: Expression): Expression;
/**
 * @beta
 * Creates an expression that returns the `elseValue` argument if `ifFieldName` is absent, else
 * return the value of the field.
 *
 * @example
 * ```typescript
 * // Returns the value of the optional field 'optional_field', or returns 'default_value'
 * // if the field is absent.
 * ifAbsent("optional_field", "default_value")
 * ```
 *
 * @param ifFieldName - The field to check for absence.
 * @param elseValue - The value that will be returned if [ifFieldName] is absent.
 * @returns A new Expression representing the ifAbsent operation.
 */
declare function ifAbsent(ifFieldName: string | Expression, elseValue: Expression | unknown): Expression;
/**
 * @beta
 * Creates an expression that joins the elements of an array into a string.
 *
 * @example
 * ```typescript
 * // Join the elements of the 'tags' field with a comma and space.
 * join("tags", ", ")
 * ```
 *
 * @param arrayFieldName - The name of the field containing the array.
 * @param delimiter - The string to use as a delimiter.
 * @returns A new Expression representing the join operation.
 */
declare function join(arrayFieldName: string, delimiter: string): Expression;
/**
 * @beta
 * Creates an expression that joins the elements of an array into a string.
 *
 * @example
 * ```typescript
 * // Join an array of string using the delimiter from the 'separator' field.
 * join(array(['foo', 'bar']), field("separator"))
 * ```
 *
 * @param arrayExpression - An expression that evaluates to an array.
 * @param delimiterExpression - The expression that evaluates to the delimiter string.
 * @returns A new Expression representing the join operation.
 */
declare function join(arrayExpression: Expression, delimiterExpression: Expression): Expression;
/**
 * @beta
 * Creates an expression that joins the elements of an array into a string.
 *
 * @example
 * ```typescript
 * // Join the elements of the 'tags' field with a comma and space.
 * join(field("tags"), ", ")
 * ```
 *
 * @param arrayExpression - An expression that evaluates to an array.
 * @param delimiter - The string to use as a delimiter.
 * @returns A new Expression representing the join operation.
 */
declare function join(arrayExpression: Expression, delimiter: string): Expression;
/**
 * @beta
 * Creates an expression that joins the elements of an array into a string.
 *
 * @example
 * ```typescript
 * // Join the elements of the 'tags' field with the delimiter from the 'separator' field.
 * join('tags', field("separator"))
 * ```
 *
 * @param arrayFieldName - The name of the field containing the array.
 * @param delimiterExpression - The expression that evaluates to the delimiter string.
 * @returns A new Expression representing the join operation.
 */
declare function join(arrayFieldName: string, delimiterExpression: Expression): Expression;
/**
 * @beta
 * Creates an expression that computes the base-10 logarithm of a numeric value.
 *
 * @example
 * ```typescript
 * // Compute the base-10 logarithm of the 'value' field.
 * log10("value");
 * ```
 *
 * @param fieldName - The name of the field to compute the base-10 logarithm of.
 * @returns A new `Expression` representing the base-10 logarithm of the numeric value.
 */
declare function log10(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the base-10 logarithm of a numeric value.
 *
 * @example
 * ```typescript
 * // Compute the base-10 logarithm of the 'value' field.
 * log10(field("value"));
 * ```
 *
 * @param expression - An expression evaluating to a numeric value, which the base-10 logarithm will be computed for.
 * @returns A new `Expression` representing the base-10 logarithm of the numeric value.
 */
declare function log10(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the sum of the elements in an array.
 *
 * @example
 * ```typescript
 * // Compute the sum of the elements in the 'scores' field.
 * arraySum("scores");
 * ```
 *
 * @param fieldName - The name of the field to compute the sum of.
 * @returns A new `Expression` representing the sum of the elements in the array.
 */
declare function arraySum(fieldName: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that computes the sum of the elements in an array.
 *
 * @example
 * ```typescript
 * // Compute the sum of the elements in the 'scores' field.
 * arraySum(field("scores"));
 * ```
 *
 * @param expression - An expression evaluating to a numeric array, which the sum will be computed for.
 * @returns A new `Expression` representing the sum of the elements in the array.
 */
declare function arraySum(expression: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that splits the value of a field on the provided delimiter.
 *
 * @example
 * ```typescript
 * // Split the 'scoresCsv' field on delimiter ','
 * split('scoresCsv', ',')
 * ```
 *
 * @param fieldName - Split the value in this field.
 * @param delimiter - Split on this delimiter.
 *
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the split function.
 */
declare function split(fieldName: string, delimiter: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that splits the value of a field on the provided delimiter.
 *
 * @example
 * ```typescript
 * // Split the 'scores' field on delimiter ',' or ':' depending on the stored format
 * split('scores', conditional(field('format').equal('csv'), constant(','), constant(':')))
 * ```
 *
 * @param fieldName - Split the value in this field.
 * @param delimiter - Split on this delimiter returned by evaluating this expression.
 *
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the split function.
 */
declare function split(fieldName: string, delimiter: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that splits a string into an array of substrings based on the provided delimiter.
 *
 * @example
 * ```typescript
 * // Split the 'scoresCsv' field on delimiter ','
 * split(field('scoresCsv'), ',')
 * ```
 *
 * @param expression - Split the result of this expression.
 * @param delimiter - Split on this delimiter.
 *
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the split function.
 */
declare function split(expression: Expression, delimiter: string): FunctionExpression;
/**
 * @beta
 * Creates an expression that splits a string into an array of substrings based on the provided delimiter.
 *
 * @example
 * ```typescript
 * // Split the 'scores' field on delimiter ',' or ':' depending on the stored format
 * split(field('scores'), conditional(field('format').equal('csv'), constant(','), constant(':')))
 * ```
 *
 * @param expression - Split the result of this expression.
 * @param delimiter - Split on this delimiter returned by evaluating this expression.
 *
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the split function.
 */
declare function split(expression: Expression, delimiter: Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that truncates a timestamp to a specified granularity.
 *
 * @example
 * ```typescript
 * // Truncate the 'createdAt' timestamp to the beginning of the day.
 * field('createdAt').timestampTruncate('day')
 * ```
 *
 * @param fieldName - Truncate the timestamp value contained in this field.
 * @param granularity - The granularity to truncate to.
 * @param timezone - The timezone to use for truncation. Valid values are from
 * the TZ database (e.g., "America/Los_Angeles") or in the format "Etc/GMT-1".
 * @returns A new `Expression` representing the truncated timestamp.
 */
declare function timestampTruncate(fieldName: string, granularity: TimeGranularity, timezone?: string | Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that truncates a timestamp to a specified granularity.
 *
 * @example
 * ```typescript
 * // Truncate the 'createdAt' timestamp to the granularity specified in the field 'granularity'.
 * field('createdAt').timestampTruncate(field('granularity'))
 * ```
 *
 * @param fieldName - Truncate the timestamp value contained in this field.
 * @param granularity - The granularity to truncate to.
 * @param timezone - The timezone to use for truncation. Valid values are from
 * the TZ database (e.g., "America/Los_Angeles") or in the format "Etc/GMT-1".
 * @returns A new `Expression` representing the truncated timestamp.
 */
declare function timestampTruncate(fieldName: string, granularity: Expression, timezone?: string | Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that truncates a timestamp to a specified granularity.
 *
 * @example
 * ```typescript
 * // Truncate the 'createdAt' timestamp to the beginning of the day.
 * field('createdAt').timestampTruncate('day')
 * ```
 *
 * @param timestampExpression - Truncate the timestamp value that is returned by this expression.
 * @param granularity - The granularity to truncate to.
 * @param timezone - The timezone to use for truncation. Valid values are from
 * the TZ database (e.g., "America/Los_Angeles") or in the format "Etc/GMT-1".
 * @returns A new `Expression` representing the truncated timestamp.
 */
declare function timestampTruncate(timestampExpression: Expression, granularity: TimeGranularity, timezone?: string | Expression): FunctionExpression;
/**
 * @beta
 * Creates an expression that truncates a timestamp to a specified granularity.
 *
 * @example
 * ```typescript
 * // Truncate the 'createdAt' timestamp to the granularity specified in the field 'granularity'.
 * field('createdAt').timestampTruncate(field('granularity'))
 * ```
 *
 * @param timestampExpression - Truncate the timestamp value that is returned by this expression.
 * @param granularity - The granularity to truncate to.
 * @param timezone - The timezone to use for truncation. Valid values are from
 * the TZ database (e.g., "America/Los_Angeles") or in the format "Etc/GMT-1".
 * @returns A new `Expression` representing the truncated timestamp.
 */
declare function timestampTruncate(timestampExpression: Expression, granularity: Expression, timezone?: string | Expression): FunctionExpression;
/**
 * @beta
 *
 * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in ascending order based on an expression.
 *
 * @example
 * ```typescript
 * // Sort documents by the 'name' field in lowercase in ascending order
 * firestore.pipeline().collection("users")
 *   .sort(ascending(field("name").toLower()));
 * ```
 *
 * @param expr - The expression to create an ascending ordering for.
 * @returns A new `Ordering` for ascending sorting.
 */
declare function ascending(expr: Expression): Ordering;
/**
 * @beta
 *
 * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in ascending order based on a field.
 *
 * @example
 * ```typescript
 * // Sort documents by the 'name' field in ascending order
 * firestore.pipeline().collection("users")
 *   .sort(ascending("name"));
 * ```
 *
 * @param fieldName - The field to create an ascending ordering for.
 * @returns A new `Ordering` for ascending sorting.
 */
declare function ascending(fieldName: string): Ordering;
/**
 * @beta
 *
 * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in descending order based on an expression.
 *
 * @example
 * ```typescript
 * // Sort documents by the 'name' field in lowercase in descending order
 * firestore.pipeline().collection("users")
 *   .sort(descending(field("name").toLower()));
 * ```
 *
 * @param expr - The expression to create a descending ordering for.
 * @returns A new `Ordering` for descending sorting.
 */
declare function descending(expr: Expression): Ordering;
/**
 * @beta
 *
 * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in descending order based on a field.
 *
 * @example
 * ```typescript
 * // Sort documents by the 'name' field in descending order
 * firestore.pipeline().collection("users")
 *   .sort(descending("name"));
 * ```
 *
 * @param fieldName - The field to create a descending ordering for.
 * @returns A new `Ordering` for descending sorting.
 */
declare function descending(fieldName: string): Ordering;
/**
 * @beta
 *
 * Represents an ordering criterion for sorting documents in a Firestore pipeline.
 *
 * You create `Ordering` instances using the `ascending` and `descending` helper functions.
 */
declare class Ordering implements ProtoValueSerializable, UserData {
    readonly expr: Expression;
    readonly direction: 'ascending' | 'descending';
    readonly _methodName: string | undefined;
    constructor(expr: Expression, direction: 'ascending' | 'descending', _methodName: string | undefined);
    /**
     * @private
     * @internal
     */
    _toProto(serializer: JsonProtoSerializer): Value;
    /**
     * @private
     * @internal
     */
    _readUserData(context: ParseContext): void;
    _protoValueType: 'ProtoValue';
}

/**
 * @beta
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
 * @beta
 * Options defining how a Stage is evaluated.
 */
interface StageOptions {
    /**
     * @beta
     * An escape hatch to set options not known at SDK build time. These values
     * will be passed directly to the Firestore backend and not used by the SDK.
     *
     * The option name will be used as provided. And must match the name
     * format used by the backend (hint: use a snake_case_name).
     *
     * Raw option values can be any type supported
     * by Firestore (for example: string, boolean, number, map, …). Value types
     * not known to the SDK will be rejected.
     *
     * Values specified in rawOptions will take precedence over any options
     * with the same name set by the SDK.
     *
     * `rawOptions` supports dot notation, if you want to override
     * a nested option.
     */
    rawOptions?: {
        [name: string]: unknown;
    };
}
/**
 * @beta
 * Options defining how a CollectionStage is evaluated. See {@link @firebase/firestore/pipelines#PipelineSource.(collection:1)}.
 */
type CollectionStageOptions = StageOptions & {
    /**
     * @beta
     * Name or reference to the collection that will be used as the Pipeline source.
     */
    collection: string | CollectionReference;
    /**
     * @beta
     * Specifies the name of an index to be used for a query, overriding the query optimizer's default choice.
     * This can be useful for performance tuning in specific scenarios where the default index selection
     * does not yield optimal performance.
     *
     * @remarks This property is optional. When provided, it should be the exact name of the index to force.
     */
    forceIndex?: string;
};
/**
 * @beta
 * Defines the configuration options for a CollectionGroupStage within a pipeline.
 * This type extends {@link @firebase/firestore/pipelines#StageOptions} and provides specific settings for how a collection group
 * is identified and processed during pipeline execution.
 *
 * See {@link @firebase/firestore/pipelines#PipelineSource.(collectionGroup:1)} to create a collection group stage.
 */
type CollectionGroupStageOptions = StageOptions & {
    /**
     * @beta
     * ID of the collection group to use as the Pipeline source.
     */
    collectionId: string;
    /**
     * @beta
     * Specifies the name of an index to be used for a query, overriding the query optimizer's default choice.
     * This can be useful for performance tuning in specific scenarios where the default index selection
     * does not yield optimal performance.
     *
     * @remarks This property is optional. When provided, it should be the exact name of the index to force.
     */
    forceIndex?: string;
};
/**
 * @beta
 * Options defining how a DatabaseStage is evaluated. See {@link @firebase/firestore/pipelines#PipelineSource.(database:1)}.
 */
type DatabaseStageOptions = StageOptions & {};
/**
 * @beta
 * Options defining how a DocumentsStage is evaluated. See {@link @firebase/firestore/pipelines#PipelineSource.(documents:1)}.
 */
type DocumentsStageOptions = StageOptions & {
    /**
     * @beta
     * An array of paths and DocumentReferences specifying the individual documents that will be the source of this pipeline.
     * The converters for these DocumentReferences will be ignored and not have an effect on this pipeline.
     * There must be at least one document specified in the array.
     */
    docs: Array<string | DocumentReference>;
};
/**
 * @beta
 * Options defining how an AddFieldsStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(addFields:1)}.
 */
type AddFieldsStageOptions = StageOptions & {
    /**
     * @beta
     *  The fields to add to each document, specified as a {@link @firebase/firestore/pipelines#Selectable}.
     *  At least one field is required.
     */
    fields: Selectable[];
};
/**
 * @beta
 * Options defining how a RemoveFieldsStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(removeFields:1)}.
 */
type RemoveFieldsStageOptions = StageOptions & {
    /**
     * @beta
     * The fields to remove from each document.
     */
    fields: Array<Field | string>;
};
/**
 * @beta
 * Options defining how a SelectStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(select:1)}.
 */
type SelectStageOptions = StageOptions & {
    /**
     * @beta
     * The fields to include in the output documents, specified as {@link @firebase/firestore/pipelines#Selectable} expression
     * or as a string value indicating the field name.
     */
    selections: Array<Selectable | string>;
};
/**
 * @beta
 * Options defining how a WhereStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(where:1)}.
 */
type WhereStageOptions = StageOptions & {
    /**
     * @beta
     * The {@link @firebase/firestore/pipelines#BooleanExpression} to apply as a filter for each input document to this stage.
     */
    condition: BooleanExpression;
};
/**
 * @beta
 * Options defining how an OffsetStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(offset:1)}.
 */
type OffsetStageOptions = StageOptions & {
    /**
     * @beta
     * The number of documents to skip.
     */
    offset: number;
};
/**
 * @beta
 * Options defining how a LimitStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(limit:1)}.
 */
type LimitStageOptions = StageOptions & {
    /**
     * @beta
     * The maximum number of documents to return.
     */
    limit: number;
};
/**
 * @beta
 * Options defining how a DistinctStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(distinct:1)}.
 */
type DistinctStageOptions = StageOptions & {
    /**
     * @beta
     * The {@link @firebase/firestore/pipelines#Selectable} expressions or field names to consider when determining
     * distinct value combinations (groups).
     */
    groups: Array<string | Selectable>;
};
/**
 * @beta
 * Options defining how an AggregateStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(aggregate:1)}.
 */
type AggregateStageOptions = StageOptions & {
    /**
     * @beta
     * The {@link @firebase/firestore/pipelines#AliasedAggregate} values specifying aggregate operations to
     * perform on the input documents.
     */
    accumulators: AliasedAggregate[];
    /**
     * @beta
     * The {@link @firebase/firestore/pipelines#Selectable} expressions or field names to consider when determining
     * distinct value combinations (groups), which will be aggregated over.
     */
    groups?: Array<string | Selectable>;
};
/**
 * @beta
 * Options defining how a FindNearestStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(findNearest:1)}.
 */
type FindNearestStageOptions = StageOptions & {
    /**
     * @beta
     * Specifies the field to be used. This can be a string representing the field path
     * (e.g., 'fieldName', 'nested.fieldName') or an object of type {@link @firebase/firestore/pipelines#Field}
     * representing a more complex field expression.
     */
    field: Field | string;
    /**
     * @beta
     * Specifies the query vector value, to which the vector distance will be computed.
     */
    vectorValue: VectorValue | number[];
    /**
     * @beta
     * Specifies the method used to compute the distance between vectors.
     *
     * Possible values are:
     * - `'euclidean'`: Euclidean distance.
     * - `'cosine'`: Cosine similarity.
     * - `'dot_product'`: Dot product.
     */
    distanceMeasure: 'euclidean' | 'cosine' | 'dot_product';
    /**
     * @beta
     * The maximum number of documents to return from the FindNearest stage.
     */
    limit?: number;
    /**
     * @beta
     * If set, specifies the field on the output documents that will contain
     * the computed vector distance for the document. If not set, the computed
     * vector distance will not be returned.
     */
    distanceField?: string;
};
/**
 * @beta
 * Options defining how a ReplaceWithStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(replaceWith:1)}.
 */
type ReplaceWithStageOptions = StageOptions & {
    /**
     * @beta
     * The name of a field that contains a map or an {@link @firebase/firestore/pipelines#Expression} that
     * evaluates to a map.
     */
    map: Expression | string;
};
/**
 * @beta
 * Defines the options for evaluating a sample stage within a pipeline.
 * This type combines common {@link @firebase/firestore/pipelines#StageOptions} with a specific configuration
 * where only one of the defined sampling methods can be applied.
 *
 * See {@link @firebase/firestore/pipelines#Pipeline.(sample:1)} to create a sample stage..
 */
type SampleStageOptions = StageOptions & OneOf<{
    /**
     * @beta
     * If set, specifies the sample rate as a percentage of the
     * input documents.
     *
     * Cannot be set when `documents: number` is set.
     */
    percentage: number;
    /**
     * @beta
     * If set, specifies the sample rate as a total number of
     * documents to sample from the input documents.
     *
     * Cannot be set when `percentage: number` is set.
     */
    documents: number;
}>;
/**
 * @beta
 * Options defining how a UnionStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(union:1)}.
 */
type UnionStageOptions = StageOptions & {
    /**
     * @beta
     * Specifies the other Pipeline to union with.
     */
    other: Pipeline$1;
};
/**
 * @beta
 * Represents the specific options available for configuring an `UnnestStage` within a pipeline.
 */
type UnnestStageOptions = StageOptions & {
    /**
     * @beta
     * A `Selectable` object that defines an array expression to be un-nested
     * and the alias for the un-nested field.
     */
    selectable: Selectable;
    /**
     * @beta
     * If set, specifies the field on the output documents that will contain the
     * offset (starting at zero) that the element is from the original array.
     */
    indexField?: string;
};
/**
 * @beta
 * @beta
 * Options defining how a SortStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(sort:1)}.
 */
type SortStageOptions = StageOptions & {
    /**
     * @beta
     * Orderings specify how the input documents are sorted.
     * One or more ordering are required.
     */
    orderings: Ordering[];
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
 * @beta
 */
declare abstract class Stage implements ProtoSerializable<Stage$1>, UserData {
    /**
     * Store optionsProto parsed by _readUserData.
     * @private
     * @internal
     * @protected
     */
    protected optionsProto: ApiClientObjectMap<firestoreV1ApiClientInterfaces.Value> | undefined;
    protected knownOptions: Record<string, unknown>;
    protected rawOptions?: Record<string, unknown>;
    constructor(options: StageOptions);
    _readUserData(context: ParseContext): void;
    _toProto(_: JsonProtoSerializer): Stage$1;
    abstract get _optionsUtil(): OptionsUtil;
    abstract get _name(): string;
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
 * @beta
 *
 * The Pipeline class provides a flexible and expressive framework for building complex data
 * transformation and query pipelines for Firestore.
 *
 * A pipeline takes data sources, such as Firestore collections or collection groups, and applies
 * a series of stages that are chained together. Each stage takes the output from the previous stage
 * (or the data source) and produces an output for the next stage (or as the final output of the
 * pipeline).
 *
 * Expressions can be used within each stage to filter and transform data through the stage.
 *
 * NOTE: The chained stages do not prescribe exactly how Firestore will execute the pipeline.
 * Instead, Firestore only guarantees that the result is the same as if the chained stages were
 * executed in order.
 *
 * Usage Examples:
 *
 * @example
 * ```typescript
 * const db: Firestore; // Assumes a valid firestore instance.
 *
 * // Example 1: Select specific fields and rename 'rating' to 'bookRating'
 * const results1 = await execute(db.pipeline()
 *     .collection("books")
 *     .select("title", "author", field("rating").as("bookRating")));
 *
 * // Example 2: Filter documents where 'genre' is "Science Fiction" and 'published' is after 1950
 * const results2 = await execute(db.pipeline()
 *     .collection("books")
 *     .where(and(field("genre").equal("Science Fiction"), field("published").greaterThan(1950))));
 *
 * // Example 3: Calculate the average rating of books published after 1980
 * const results3 = await execute(db.pipeline()
 *     .collection("books")
 *     .where(field("published").greaterThan(1980))
 *     .aggregate(average(field("rating")).as("averageRating")));
 * ```
 */
declare class Pipeline$1 implements ProtoSerializable<Pipeline$2>, UserData {
    /**
     * @internal
     * @private
     */
    _db: Firestore$1;
    /**
     * @internal
     * @private
     */
    private stages;
    /**
     * @internal
     * @private
     * @param _db
     * @param stages
     */
    constructor(
    /**
     * @internal
     * @private
     */
    _db: Firestore$1, 
    /**
     * @internal
     * @private
     */
    stages: Stage[]);
    _readUserData(context: ParseContext): void;
    /**
     * @beta
     * Adds new fields to outputs from previous stages.
     *
     * This stage allows you to compute values on-the-fly based on existing data from previous
     * stages or constants. You can use this to create new fields or overwrite existing ones (if there
     * is name overlaps).
     *
     * The added fields are defined using {@link @firebase/firestore/pipelines#Selectable}s, which can be:
     *
     * - {@link @firebase/firestore/pipelines#Field}: References an existing document field.
     * - {@link @firebase/firestore/pipelines#Expression}: Either a literal value (see {@link @firebase/firestore/pipelines#(constant:1)}) or a computed value
     *   with an assigned alias using {@link @firebase/firestore/pipelines#Expression.(as:1)}.
     *
     * Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection("books")
     *   .addFields(
     *     field("rating").as("bookRating"), // Rename 'rating' to 'bookRating'
     *     add(field("quantity"), 5).as("totalCost")  // Calculate 'totalCost'
     *   );
     * ```
     *
     * @param field - The first field to add to the documents, specified as a {@link @firebase/firestore/pipelines#Selectable}.
     * @param additionalFields - Optional additional fields to add to the documents, specified as {@link @firebase/firestore/pipelines#Selectable}s.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    addFields(field: Selectable, ...additionalFields: Selectable[]): Pipeline$1;
    /**
     * @beta
     * Adds new fields to outputs from previous stages.
     *
     * This stage allows you to compute values on-the-fly based on existing data from previous
     * stages or constants. You can use this to create new fields or overwrite existing ones (if there
     * is name overlaps).
     *
     * The added fields are defined using {@link @firebase/firestore/pipelines#Selectable}s, which can be:
     *
     * - {@link @firebase/firestore/pipelines#Field}: References an existing document field.
     * - {@link @firebase/firestore/pipelines#Expression}: Either a literal value (see {@link @firebase/firestore/pipelines#(constant:1)}) or a computed value
     *   with an assigned alias using {@link @firebase/firestore/pipelines#Expression.(as:1)}.
     *
     * Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection("books")
     *   .addFields(
     *     field("rating").as("bookRating"), // Rename 'rating' to 'bookRating'
     *     add(field("quantity"), 5).as("totalCost")  // Calculate 'totalCost'
     *   );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    addFields(options: AddFieldsStageOptions): Pipeline$1;
    /**
     * @beta
     * Remove fields from outputs of previous stages.
     *
     * Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection('books')
     *   // removes field 'rating' and 'cost' from the previous stage outputs.
     *   .removeFields(
     *     field('rating'),
     *     'cost'
     *   );
     * ```
     *
     * @param fieldValue - The first field to remove.
     * @param additionalFields - Optional additional fields to remove.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    removeFields(fieldValue: Field | string, ...additionalFields: Array<Field | string>): Pipeline$1;
    /**
     * @beta
     * Remove fields from outputs of previous stages.
     *
     * Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection('books')
     *   // removes field 'rating' and 'cost' from the previous stage outputs.
     *   .removeFields(
     *     field('rating'),
     *     'cost'
     *   );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    removeFields(options: RemoveFieldsStageOptions): Pipeline$1;
    /**
     * @beta
     * Selects or creates a set of fields from the outputs of previous stages.
     *
     * <p>The selected fields are defined using {@link @firebase/firestore/pipelines#Selectable} expressions, which can be:
     *
     * <ul>
     *   <li>`string` : Name of an existing field</li>
     *   <li>{@link @firebase/firestore/pipelines#Field}: References an existing field.</li>
     *   <li>{@link @firebase/firestore/pipelines#AliasedExpression}: Represents the result of a function with an assigned alias name using
     *       {@link @firebase/firestore/pipelines#Expression.(as:1)}</li>
     * </ul>
     *
     * <p>If no selections are provided, the output of this stage is empty. Use {@link
     * @firebase/firestore/pipelines#Pipeline.(addFields:1)} instead if only additions are
     * desired.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * db.pipeline().collection("books")
     *   .select(
     *     "firstName",
     *     field("lastName"),
     *     field("address").toUpper().as("upperAddress"),
     *   );
     * ```
     *
     * @param selection - The first field to include in the output documents, specified as {@link
     *     @firebase/firestore/pipelines#Selectable} expression or string value representing the field name.
     * @param additionalSelections - Optional additional fields to include in the output documents, specified as {@link
     *     @firebase/firestore/pipelines#Selectable} expressions or `string` values representing field names.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    select(selection: Selectable | string, ...additionalSelections: Array<Selectable | string>): Pipeline$1;
    /**
     * @beta
     * Selects or creates a set of fields from the outputs of previous stages.
     *
     * <p>The selected fields are defined using {@link @firebase/firestore/pipelines#Selectable} expressions, which can be:
     *
     * <ul>
     *   <li>`string`: Name of an existing field</li>
     *   <li>{@link @firebase/firestore/pipelines#Field}: References an existing field.</li>
     *   <li>{@link @firebase/firestore/pipelines#AliasedExpression}: Represents the result of a function with an assigned alias name using
     *       {@link @firebase/firestore/pipelines#Expression.(as:1)}</li>
     * </ul>
     *
     * <p>If no selections are provided, the output of this stage is empty. Use {@link
     * @firebase/firestore/pipelines#Pipeline.(addFields:1)} instead if only additions are
     * desired.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * db.pipeline().collection("books")
     *   .select(
     *     "firstName",
     *     field("lastName"),
     *     field("address").toUpper().as("upperAddress"),
     *   );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    select(options: SelectStageOptions): Pipeline$1;
    /**
     * @beta
     * Filters the documents from previous stages to only include those matching the specified {@link
     * @firebase/firestore/pipelines#BooleanExpression}.
     *
     * <p>This stage allows you to apply conditions to the data, similar to a "WHERE" clause in SQL.
     * You can filter documents based on their field values, using implementations of {@link
     * @firebase/firestore/pipelines#BooleanExpression}, typically including but not limited to:
     *
     * <ul>
     *   <li>field comparators: {@link @firebase/firestore/pipelines#Expression.(equal:1)}, {@link @firebase/firestore/pipelines#Expression.(lessThan:1)}, {@link
     *       @firebase/firestore/pipelines#Expression.(greaterThan:1)}, etc.</li>
     *   <li>logical operators: {@link @firebase/firestore/pipelines#Expression.(and:1)}, {@link @firebase/firestore/pipelines#Expression.(or:1)}, {@link @firebase/firestore/pipelines#Expression.(not:1)}, etc.</li>
     *   <li>advanced functions: {@link @firebase/firestore/pipelines#Expression.(regexMatch:1)}, {@link
     *       @firebase/firestore/pipelines#Expression.(arrayContains:1)}, etc.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection("books")
     *   .where(
     *     and(
     *         greaterThan(field("rating"), 4.0),   // Filter for ratings greater than 4.0
     *         field("genre").equal("Science Fiction") // Equivalent to equal("genre", "Science Fiction")
     *     )
     *   );
     * ```
     *
     * @param condition - The {@link @firebase/firestore/pipelines#BooleanExpression} to apply.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    where(condition: BooleanExpression): Pipeline$1;
    /**
     * @beta
     * Filters the documents from previous stages to only include those matching the specified {@link
     * @firebase/firestore/pipelines#BooleanExpression}.
     *
     * <p>This stage allows you to apply conditions to the data, similar to a "WHERE" clause in SQL.
     * You can filter documents based on their field values, using implementations of {@link
     * @firebase/firestore/pipelines#BooleanExpression}, typically including but not limited to:
     *
     * <ul>
     *   <li>field comparators: {@link @firebase/firestore/pipelines#Expression.(eq:1)}, {@link @firebase/firestore/pipelines#Expression.(lt:1)} (less than), {@link
     *       @firebase/firestore/pipelines#Expression.(greaterThan:1)}, etc.</li>
     *   <li>logical operators: {@link @firebase/firestore/pipelines#Expression.(and:1)}, {@link @firebase/firestore/pipelines#Expression.(or:1)}, {@link @firebase/firestore/pipelines#Expression.(not:1)}, etc.</li>
     *   <li>advanced functions: {@link @firebase/firestore/pipelines#Expression.(regexMatch:1)}, {@link
     *       @firebase/firestore/pipelines#Expression.(arrayContains:1)}, etc.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection("books")
     *   .where(
     *     and(
     *         greaterThan(field("rating"), 4.0),   // Filter for ratings greater than 4.0
     *         field("genre").equal("Science Fiction") // Equivalent to equal("genre", "Science Fiction")
     *     )
     *   );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    where(options: WhereStageOptions): Pipeline$1;
    /**
     * @beta
     * Skips the first `offset` number of documents from the results of previous stages.
     *
     * <p>This stage is useful for implementing pagination in your pipelines, allowing you to retrieve
     * results in chunks. It is typically used in conjunction with {@link @firebase/firestore/pipelines#Pipeline.limit} to control the
     * size of each page.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Retrieve the second page of 20 results
     * firestore.pipeline().collection('books')
     *     .sort(field('published').descending())
     *     .offset(20)  // Skip the first 20 results
     *     .limit(20);   // Take the next 20 results
     * ```
     *
     * @param offset - The number of documents to skip.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    offset(offset: number): Pipeline$1;
    /**
     * @beta
     * Skips the first `offset` number of documents from the results of previous stages.
     *
     * <p>This stage is useful for implementing pagination in your pipelines, allowing you to retrieve
     * results in chunks. It is typically used in conjunction with {@link @firebase/firestore/pipelines#Pipeline.limit} to control the
     * size of each page.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Retrieve the second page of 20 results
     * firestore.pipeline().collection('books')
     *     .sort(field('published').descending())
     *     .offset(20)  // Skip the first 20 results
     *     .limit(20);   // Take the next 20 results
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    offset(options: OffsetStageOptions): Pipeline$1;
    /**
     * @beta
     * Limits the maximum number of documents returned by previous stages to `limit`.
     *
     * <p>This stage is particularly useful when you want to retrieve a controlled subset of data from
     * a potentially large result set. It's often used for:
     *
     * <ul>
     *   <li>**Pagination:** In combination with {@link @firebase/firestore/pipelines#Pipeline.offset} to retrieve specific pages of
     *       results.</li>
     *   <li>**Limiting Data Retrieval:** To prevent excessive data transfer and improve performance,
     *       especially when dealing with large collections.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Limit the results to the top 10 highest-rated books
     * firestore.pipeline().collection('books')
     *     .sort(field('rating').descending())
     *     .limit(10);
     * ```
     *
     * @param limit - The maximum number of documents to return.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    limit(limit: number): Pipeline$1;
    /**
     * @beta
     * Limits the maximum number of documents returned by previous stages to `limit`.
     *
     * <p>This stage is particularly useful when you want to retrieve a controlled subset of data from
     * a potentially large result set. It's often used for:
     *
     * <ul>
     *   <li>**Pagination:** In combination with {@link @firebase/firestore/pipelines#Pipeline.offset} to retrieve specific pages of
     *       results.</li>
     *   <li>**Limiting Data Retrieval:** To prevent excessive data transfer and improve performance,
     *       especially when dealing with large collections.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Limit the results to the top 10 highest-rated books
     * firestore.pipeline().collection('books')
     *     .sort(field('rating').descending())
     *     .limit(10);
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    limit(options: LimitStageOptions): Pipeline$1;
    /**
     * @beta
     * Returns a set of distinct values from the inputs to this stage.
     *
     * This stage runs through the results from previous stages to include only results with
     * unique combinations of {@link @firebase/firestore/pipelines#Expression} values ({@link @firebase/firestore/pipelines#Field}, {@link @firebase/firestore/pipelines#AliasedExpression}, etc).
     *
     * The parameters to this stage are defined using {@link @firebase/firestore/pipelines#Selectable} expressions or strings:
     *
     * - `string`: Name of an existing field
     * - {@link @firebase/firestore/pipelines#Field}: References an existing document field.
     * - {@link @firebase/firestore/pipelines#AliasedExpression}: Represents the result of a function with an assigned alias name
     *   using {@link @firebase/firestore/pipelines#Expression.(as:1)}.
     *
     * Example:
     *
     * @example
     * ```typescript
     * // Get a list of unique author names in uppercase and genre combinations.
     * firestore.pipeline().collection("books")
     *     .distinct(toUpper(field("author")).as("authorName"), field("genre"), "publishedAt")
     *     .select("authorName");
     * ```
     *
     * @param group - The {@link @firebase/firestore/pipelines#Selectable} expression or field name to consider when determining
     *     distinct value combinations.
     * @param additionalGroups - Optional additional {@link @firebase/firestore/pipelines#Selectable} expressions to consider when determining distinct
     *     value combinations or strings representing field names.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    distinct(group: string | Selectable, ...additionalGroups: Array<string | Selectable>): Pipeline$1;
    /**
     * @beta
     * Returns a set of distinct values from the inputs to this stage.
     *
     * This stage runs through the results from previous stages to include only results with
     * unique combinations of {@link @firebase/firestore/pipelines#Expression} values ({@link @firebase/firestore/pipelines#Field}, {@link @firebase/firestore/pipelines#AliasedExpression}, etc).
     *
     * The parameters to this stage are defined using {@link @firebase/firestore/pipelines#Selectable} expressions or strings:
     *
     * - `string`: Name of an existing field
     * - {@link @firebase/firestore/pipelines#Field}: References an existing document field.
     * - {@link @firebase/firestore/pipelines#AliasedExpression}: Represents the result of a function with an assigned alias name
     *   using {@link @firebase/firestore/pipelines#Expression.(as:1)}.
     *
     * Example:
     *
     * @example
     * ```typescript
     * // Get a list of unique author names in uppercase and genre combinations.
     * firestore.pipeline().collection("books")
     *     .distinct(toUpper(field("author")).as("authorName"), field("genre"), "publishedAt")
     *     .select("authorName");
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    distinct(options: DistinctStageOptions): Pipeline$1;
    /**
     * @beta
     * Performs aggregation operations on the documents from previous stages.
     *
     * <p>This stage allows you to calculate aggregate values over a set of documents. You define the
     * aggregations to perform using {@link @firebase/firestore/pipelines#AliasedAggregate} expressions which are typically results of
     * calling {@link @firebase/firestore/pipelines#Expression.(as:1)} on {@link @firebase/firestore/pipelines#AggregateFunction} instances.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Calculate the average rating and the total number of books
     * firestore.pipeline().collection("books")
     *     .aggregate(
     *         field("rating").average().as("averageRating"),
     *         countAll().as("totalBooks")
     *     );
     * ```
     *
     * @param accumulator - The first {@link @firebase/firestore/pipelines#AliasedAggregate}, wrapping an {@link @firebase/firestore/pipelines#AggregateFunction}
     *     and providing a name for the accumulated results.
     * @param additionalAccumulators - Optional additional {@link @firebase/firestore/pipelines#AliasedAggregate}, each wrapping an {@link @firebase/firestore/pipelines#AggregateFunction}
     *     and providing a name for the accumulated results.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    aggregate(accumulator: AliasedAggregate, ...additionalAccumulators: AliasedAggregate[]): Pipeline$1;
    /**
     * @beta
     * Performs optionally grouped aggregation operations on the documents from previous stages.
     *
     * <p>This stage allows you to calculate aggregate values over a set of documents, optionally
     * grouped by one or more fields or functions. You can specify:
     *
     * <ul>
     *   <li>**Grouping Fields or Functions:** One or more fields or functions to group the documents
     *       by. For each distinct combination of values in these fields, a separate group is created.
     *       If no grouping fields are provided, a single group containing all documents is used. Not
     *       specifying groups is the same as putting the entire inputs into one group.</li>
     *   <li>**Accumulators:** One or more accumulation operations to perform within each group. These
     *       are defined using {@link @firebase/firestore/pipelines#AliasedAggregate} expressions, which are typically created by
     *       calling {@link @firebase/firestore/pipelines#Expression.(as:1)} on {@link @firebase/firestore/pipelines#AggregateFunction} instances. Each aggregation
     *       calculates a value (e.g., sum, average, count) based on the documents within its group.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Calculate the average rating for each genre.
     * firestore.pipeline().collection("books")
     *   .aggregate({
     *       accumulators: [average(field("rating")).as("avg_rating")],
     *       groups: ["genre"]
     *       });
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage
     * list.
     */
    aggregate(options: AggregateStageOptions): Pipeline$1;
    /**
     * @beta
     * Performs a vector proximity search on the documents from the previous stage, returning the
     * K-nearest documents based on the specified query `vectorValue` and `distanceMeasure`. The
     * returned documents will be sorted in order from nearest to furthest from the query `vectorValue`.
     *
     * <p>Example:
     *
     * ```typescript
     * // Find the 10 most similar books based on the book description.
     * const bookDescription = "Lorem ipsum...";
     * const queryVector: number[] = ...; // compute embedding of `bookDescription`
     *
     * firestore.pipeline().collection("books")
     *     .findNearest({
     *       field: 'embedding',
     *       vectorValue: queryVector,
     *       distanceMeasure: 'euclidean',
     *       limit: 10,                        // optional
     *       distanceField: 'computedDistance' // optional
     *     });
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    findNearest(options: FindNearestStageOptions): Pipeline$1;
    /**
     * @beta
     * Sorts the documents from previous stages based on one or more {@link @firebase/firestore/pipelines#Ordering} criteria.
     *
     * <p>This stage allows you to order the results of your pipeline. You can specify multiple {@link
     * @firebase/firestore/pipelines#Ordering} instances to sort by multiple fields in ascending or descending order. If documents
     * have the same value for a field used for sorting, the next specified ordering will be used. If
     * all orderings result in equal comparison, the documents are considered equal and the order is
     * unspecified.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Sort books by rating in descending order, and then by title in ascending order for books
     * // with the same rating
     * firestore.pipeline().collection("books")
     *     .sort(
     *         field("rating").descending(),
     *         field("title").ascending()
     *     );
     * ```
     *
     * @param ordering - The first {@link @firebase/firestore/pipelines#Ordering} instance specifying the sorting criteria.
     * @param additionalOrderings - Optional additional {@link @firebase/firestore/pipelines#Ordering} instances specifying the additional sorting criteria.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    sort(ordering: Ordering, ...additionalOrderings: Ordering[]): Pipeline$1;
    /**
     * @beta
     * Sorts the documents from previous stages based on one or more {@link @firebase/firestore/pipelines#Ordering} criteria.
     *
     * <p>This stage allows you to order the results of your pipeline. You can specify multiple {@link
     * @firebase/firestore/pipelines#Ordering} instances to sort by multiple fields in ascending or descending order. If documents
     * have the same value for a field used for sorting, the next specified ordering will be used. If
     * all orderings result in equal comparison, the documents are considered equal and the order is
     * unspecified.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Sort books by rating in descending order, and then by title in ascending order for books
     * // with the same rating
     * firestore.pipeline().collection("books")
     *     .sort(
     *         field("rating").descending(),
     *         field("title").ascending()
     *     );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    sort(options: SortStageOptions): Pipeline$1;
    /**
     * @beta
     * Fully overwrites all fields in a document with those coming from a nested map.
     *
     * <p>This stage allows you to emit a map value as a document. Each key of the map becomes a field
     * on the document that contains the corresponding value.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Input.
     * // {
     * //  'name': 'John Doe Jr.',
     * //  'parents': {
     * //    'father': 'John Doe Sr.',
     * //    'mother': 'Jane Doe'
     * //   }
     * // }
     *
     * // Emit parents as document.
     * firestore.pipeline().collection('people').replaceWith('parents');
     *
     * // Output
     * // {
     * //  'father': 'John Doe Sr.',
     * //  'mother': 'Jane Doe'
     * // }
     * ```
     *
     * @param fieldName - The {@link @firebase/firestore/pipelines#Field} field containing the nested map.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    replaceWith(fieldName: string): Pipeline$1;
    /**
     * @beta
     * Fully overwrites all fields in a document with those coming from a map.
     *
     * <p>This stage allows you to emit a map value as a document. Each key of the map becomes a field
     * on the document that contains the corresponding value.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Input.
     * // {
     * //  'name': 'John Doe Jr.',
     * //  'parents': {
     * //    'father': 'John Doe Sr.',
     * //    'mother': 'Jane Doe'
     * //   }
     * // }
     *
     * // Emit parents as document.
     * firestore.pipeline().collection('people').replaceWith(map({
     *   foo: 'bar',
     *   info: {
     *     name: field('name')
     *   }
     * }));
     *
     * // Output
     * // {
     * //  'father': 'John Doe Sr.',
     * //  'mother': 'Jane Doe'
     * // }
     * ```
     *
     * @param expr - An {@link @firebase/firestore/pipelines#Expression} that when returned evaluates to a map.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    replaceWith(expr: Expression): Pipeline$1;
    /**
     * @beta
     * Fully overwrites all fields in a document with those coming from a map.
     *
     * <p>This stage allows you to emit a map value as a document. Each key of the map becomes a field
     * on the document that contains the corresponding value.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Input.
     * // {
     * //  'name': 'John Doe Jr.',
     * //  'parents': {
     * //    'father': 'John Doe Sr.',
     * //    'mother': 'Jane Doe'
     * //   }
     * // }
     *
     * // Emit parents as document.
     * firestore.pipeline().collection('people').replaceWith(map({
     *   foo: 'bar',
     *   info: {
     *     name: field('name')
     *   }
     * }));
     *
     * // Output
     * // {
     * //  'father': 'John Doe Sr.',
     * //  'mother': 'Jane Doe'
     * // }
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    replaceWith(options: ReplaceWithStageOptions): Pipeline$1;
    /**
     * @beta
     * Performs a pseudo-random sampling of the documents from the previous stage.
     *
     * <p>This stage will filter documents pseudo-randomly. The parameter specifies how number of
     * documents to be returned.
     *
     * <p>Examples:
     *
     * @example
     * ```typescript
     * // Sample 25 books, if available.
     * firestore.pipeline().collection('books')
     *     .sample(25);
     * ```
     *
     * @param documents - The number of documents to sample.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    sample(documents: number): Pipeline$1;
    /**
     * @beta
     * Performs a pseudo-random sampling of the documents from the previous stage.
     *
     * <p>This stage will filter documents pseudo-randomly. The 'options' parameter specifies how
     * sampling will be performed. See {@link @firebase/firestore/pipelines#SampleStageOptions} for more information.
     *
     * @example
     * ```typescript
     * // Sample 10 books, if available.
     * firestore.pipeline().collection("books")
     *     .sample({ documents: 10 });
     *
     * // Sample 50% of books.
     * firestore.pipeline().collection("books")
     *     .sample({ percentage: 0.5 });
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    sample(options: SampleStageOptions): Pipeline$1;
    /**
     * @beta
     * Performs union of all documents from two pipelines, including duplicates.
     *
     * <p>This stage will pass through documents from previous stage, and also pass through documents
     * from previous stage of the `other` {@link @firebase/firestore/pipelines#Pipeline} given in parameter. The order of documents
     * emitted from this stage is undefined.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Emit documents from books collection and magazines collection.
     * firestore.pipeline().collection('books')
     *     .union(firestore.pipeline().collection('magazines'));
     * ```
     *
     * @param other - The other {@link @firebase/firestore/pipelines#Pipeline} that is part of union.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    union(other: Pipeline$1): Pipeline$1;
    /**
     * @beta
     * Performs union of all documents from two pipelines, including duplicates.
     *
     * <p>This stage will pass through documents from previous stage, and also pass through documents
     * from previous stage of the `other` {@link @firebase/firestore/pipelines#Pipeline} given in parameter. The order of documents
     * emitted from this stage is undefined.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Emit documents from books collection and magazines collection.
     * firestore.pipeline().collection('books')
     *     .union(firestore.pipeline().collection('magazines'));
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    union(options: UnionStageOptions): Pipeline$1;
    /**
     * @beta
     * Produces a document for each element in an input array.
     *
     * For each previous stage document, this stage will emit zero or more augmented documents. The
     * input array specified by the `selectable` parameter, will emit an augmented document for each input array element. The input array element will
     * augment the previous stage document by setting the `alias` field  with the array element value.
     *
     * When `selectable` evaluates to a non-array value (ex: number, null, absent), then the stage becomes a no-op for
     * the current input document, returning it as is with the `alias` field absent.
     *
     * No documents are emitted when `selectable` evaluates to an empty array.
     *
     * Example:
     *
     * @example
     * ```typescript
     * // Input:
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tags": [ "comedy", "space", "adventure" ], ... }
     *
     * // Emit a book document for each tag of the book.
     * firestore.pipeline().collection("books")
     *     .unnest(field("tags").as('tag'), 'tagIndex');
     *
     * // Output:
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "comedy", "tagIndex": 0, ... }
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "space", "tagIndex": 1, ... }
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "adventure", "tagIndex": 2, ... }
     * ```
     *
     * @param selectable - A selectable expression defining the field to unnest and the alias to use for each un-nested element in the output documents.
     * @param indexField - An optional string value specifying the field path to write the offset (starting at zero) into the array the un-nested element is from
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    unnest(selectable: Selectable, indexField?: string): Pipeline$1;
    /**
     * @beta
     * Produces a document for each element in an input array.
     *
     * For each previous stage document, this stage will emit zero or more augmented documents. The
     * input array specified by the `selectable` parameter, will emit an augmented document for each input array element. The input array element will
     * augment the previous stage document by setting the `alias` field  with the array element value.
     *
     * When `selectable` evaluates to a non-array value (ex: number, null, absent), then the stage becomes a no-op for
     * the current input document, returning it as is with the `alias` field absent.
     *
     * No documents are emitted when `selectable` evaluates to an empty array.
     *
     * Example:
     *
     * @example
     * ```typescript
     * // Input:
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tags": [ "comedy", "space", "adventure" ], ... }
     *
     * // Emit a book document for each tag of the book.
     * firestore.pipeline().collection("books")
     *     .unnest(field("tags").as('tag'), 'tagIndex');
     *
     * // Output:
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "comedy", "tagIndex": 0, ... }
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "space", "tagIndex": 1, ... }
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "adventure", "tagIndex": 2, ... }
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    unnest(options: UnnestStageOptions): Pipeline$1;
    /**
     * @beta
     * Adds a raw stage to the pipeline.
     *
     * <p>This method provides a flexible way to extend the pipeline's functionality by adding custom
     * stages. Each raw stage is defined by a unique `name` and a set of `params` that control its
     * behavior.
     *
     * <p>Example (Assuming there is no 'where' stage available in SDK):
     *
     * @example
     * ```typescript
     * // Assume we don't have a built-in 'where' stage
     * firestore.pipeline().collection('books')
     *     .rawStage('where', [field('published').lessThan(1900)]) // Custom 'where' stage
     *     .select('title', 'author');
     * ```
     *
     * @param name - The unique name of the raw stage to add.
     * @param params - A list of parameters to configure the raw stage's behavior.
     * @param options - An object of key value pairs that specifies optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    rawStage(name: string, params: unknown[], options?: {
        [key: string]: Expression | unknown;
    }): Pipeline$1;
    /**
     * @internal
     * @private
     */
    _toProto(jsonProtoSerializer: JsonProtoSerializer): Pipeline$2;
    private _addStage;
    /**
     * @internal
     * @private
     * @param db
     * @param userDataReader
     * @param userDataWriter
     * @param stages
     * @protected
     */
    protected newPipeline(db: Firestore$1, stages: Stage[]): Pipeline$1;
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
 * @beta
 * Provides the entry point for defining the data source of a Firestore {@link @firebase/firestore/pipelines#Pipeline}.
 *
 * Use the methods of this class (e.g., {@link @firebase/firestore/pipelines#PipelineSource.(collection:1)}, {@link @firebase/firestore/pipelines#PipelineSource.(collectionGroup:1)},
 * {@link @firebase/firestore/pipelines#PipelineSource.(database:1)}, or {@link @firebase/firestore/pipelines#PipelineSource.(documents:1)}) to specify the initial data
 * for your pipeline, such as a collection, a collection group, the entire database, or a set of specific documents.
 */
declare class PipelineSource<PipelineType> {
    private databaseId;
    /**
     * @internal
     * @private
     */
    _createPipeline: (stages: Stage[]) => PipelineType;
    /**
     * @internal
     * @private
     * @param databaseId
     * @param _createPipeline
     */
    constructor(databaseId: DatabaseId, 
    /**
     * @internal
     * @private
     */
    _createPipeline: (stages: Stage[]) => PipelineType);
    /**
     * @beta
     * Returns all documents from the entire collection. The collection can be nested.
     * @param collection - Name or reference to the collection that will be used as the Pipeline source.
     */
    collection(collection: string | CollectionReference): PipelineType;
    /**
     * @beta
     * Returns all documents from the entire collection. The collection can be nested.
     * @param options - Options defining how this CollectionStage is evaluated.
     */
    collection(options: CollectionStageOptions): PipelineType;
    /**
     * @beta
     * Returns all documents from a collection ID regardless of the parent.
     * @param collectionId - ID of the collection group to use as the Pipeline source.
     */
    collectionGroup(collectionId: string): PipelineType;
    /**
     * @beta
     * Returns all documents from a collection ID regardless of the parent.
     * @param options - Options defining how this CollectionGroupStage is evaluated.
     */
    collectionGroup(options: CollectionGroupStageOptions): PipelineType;
    /**
     * @beta
     * Returns all documents from the entire database.
     */
    database(): PipelineType;
    /**
     * @beta
     * Returns all documents from the entire database.
     * @param options - Options defining how a DatabaseStage is evaluated.
     */
    database(options: DatabaseStageOptions): PipelineType;
    /**
     * @beta
     * Set the pipeline's source to the documents specified by the given paths and DocumentReferences.
     *
     * @param docs - An array of paths and DocumentReferences specifying the individual documents that will be the source of this pipeline.
     * The converters for these DocumentReferences will be ignored and not have an effect on this pipeline.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */
    documents(docs: Array<string | DocumentReference>): PipelineType;
    /**
     * @beta
     * Set the pipeline's source to the documents specified by the given paths and DocumentReferences.
     *
     * @param options - Options defining how this DocumentsStage is evaluated.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */
    documents(options: DocumentsStageOptions): PipelineType;
    /**
     * @beta
     * Convert the given Query into an equivalent Pipeline.
     *
     * @param query - A Query to be converted into a Pipeline.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */
    createFrom(query: Query): Pipeline$1;
    _validateReference(reference: CollectionReference | DocumentReference): void;
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
 * @beta
 * Represents the results of a Firestore pipeline execution.
 *
 * A `PipelineSnapshot` contains zero or more {@link @firebase/firestore/pipelines#PipelineResult} objects
 * representing the documents returned by a pipeline query. It provides methods
 * to iterate over the documents and access metadata about the query results.
 *
 * @example
 * ```typescript
 * const snapshot: PipelineSnapshot = await firestore
 *   .pipeline()
 *   .collection('myCollection')
 *   .where(field('value').greaterThan(10))
 *   .execute();
 *
 * snapshot.results.forEach(doc => {
 *   console.log(doc.id, '=>', doc.data());
 * });
 * ```
 */
declare class PipelineSnapshot {
    private readonly _pipeline;
    private readonly _executionTime;
    private readonly _results;
    constructor(pipeline: Pipeline$1, results: PipelineResult[], executionTime?: Timestamp$1);
    /**
     * @beta An array of all the results in the `PipelineSnapshot`.
     */
    get results(): PipelineResult[];
    /**
     * @beta
     * The time at which the pipeline producing this result is executed.
     *
     * @readonly
     *
     */
    get executionTime(): Timestamp$1;
}
/**
 * @beta
 *
 * A PipelineResult contains data read from a Firestore Pipeline. The data can be extracted with the
 * {@link @firebase/firestore/pipelines#PipelineResult.data} or {@link @firebase/firestore/pipelines#PipelineResult.(get:1)} methods.
 *
 * <p>If the PipelineResult represents a non-document result, `ref` will return a undefined
 * value.
 */
declare class PipelineResult<AppModelType = DocumentData> {
    private readonly _userDataWriter;
    private readonly _createTime;
    private readonly _updateTime;
    /**
     * @internal
     * @private
     */
    readonly _ref: DocumentReference | undefined;
    /**
     * @internal
     * @private
     */
    readonly _fields: ObjectValue;
    /**
     * @private
     * @internal
     *
     * @param userDataWriter - The serializer used to encode/decode protobuf.
     * @param ref - The reference to the document.
     * @param fields - The fields of the Firestore `Document` Protobuf backing
     * this document.
     * @param createTime - The time when the document was created if the result is a document, undefined otherwise.
     * @param updateTime - The time when the document was last updated if the result is a document, undefined otherwise.
     */
    constructor(userDataWriter: AbstractUserDataWriter, fields: ObjectValue, ref?: DocumentReference, createTime?: Timestamp$1, updateTime?: Timestamp$1);
    /**
     * @beta
     * The reference of the document, if it is a document; otherwise `undefined`.
     */
    get ref(): DocumentReference | undefined;
    /**
     * @beta
     * The ID of the document for which this PipelineResult contains data, if it is a document; otherwise `undefined`.
     *
     * @readonly
     *
     */
    get id(): string | undefined;
    /**
     * @beta
     * The time the document was created. Undefined if this result is not a document.
     *
     * @readonly
     */
    get createTime(): Timestamp$1 | undefined;
    /**
     * @beta
     * The time the document was last updated (at the time the snapshot was
     * generated). Undefined if this result is not a document.
     *
     * @readonly
     */
    get updateTime(): Timestamp$1 | undefined;
    /**
     * @beta
     * Retrieves all fields in the result as an object.
     *
     * @returns An object containing all fields in the document or
     * 'undefined' if the document doesn't exist.
     *
     * @example
     * ```
     * let p = firestore.pipeline().collection('col');
     *
     * p.execute().then(results => {
     *   let data = results[0].data();
     *   console.log(`Retrieved data: ${JSON.stringify(data)}`);
     * });
     * ```
     */
    data(): AppModelType;
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the result as a proto value.
     *
     * @returns An `Object` containing all fields in the result.
     */
    _fieldsProto(): {
        [key: string]: firestoreV1ApiClientInterfaces.Value;
    };
    /**
     * @beta
     * Retrieves the field specified by `field`.
     *
     * @param field - The field path
     * (e.g. 'foo' or 'foo.bar') to a specific field.
     * @returns The data at the specified field location or `undefined` if no
     * such field exists.
     *
     * @example
     * ```
     * let p = firestore.pipeline().collection('col');
     *
     * p.execute().then(results => {
     *   let field = results[0].get('a.b');
     *   console.log(`Retrieved field value: ${field}`);
     * });
     * ```
     */
    get(fieldPath: string | FieldPath | Field): any;
}
/**
 * @beta
 * Test equality of two PipelineResults.
 * @param left - First PipelineResult to compare.
 * @param right - Second PipelineResult to compare.
 */
declare function pipelineResultEqual(left: PipelineResult, right: PipelineResult): boolean;

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
 * Represents the state of bundle loading tasks.
 *
 * Both 'Error' and 'Success' are sinking state: task will abort or complete and there will
 * be no more updates after they are reported.
 */
type TaskState = 'Error' | 'Running' | 'Success';
/**
 * Represents a progress update or a final state from loading bundles.
 */
interface LoadBundleTaskProgress {
    /** How many documents have been loaded. */
    documentsLoaded: number;
    /** How many documents are in the bundle being loaded. */
    totalDocuments: number;
    /** How many bytes have been loaded. */
    bytesLoaded: number;
    /** How many bytes are in the bundle being loaded. */
    totalBytes: number;
    /** Current task state. */
    taskState: TaskState;
}
/**
 * Represents the task of loading a Firestore bundle. It provides progress of bundle
 * loading, as well as task completion and error events.
 *
 * The API is compatible with `Promise<LoadBundleTaskProgress>`.
 */
declare class LoadBundleTask implements PromiseLike<LoadBundleTaskProgress> {
    private _progressObserver;
    private _taskCompletionResolver;
    private _lastProgress;
    /**
     * Registers functions to listen to bundle loading progress events.
     * @param next - Called when there is a progress update from bundle loading. Typically `next` calls occur
     *   each time a Firestore document is loaded from the bundle.
     * @param error - Called when an error occurs during bundle loading. The task aborts after reporting the
     *   error, and there should be no more updates after this.
     * @param complete - Called when the loading task is complete.
     */
    onProgress(next?: (progress: LoadBundleTaskProgress) => unknown, error?: (err: Error) => unknown, complete?: () => void): void;
    /**
     * Implements the `Promise<LoadBundleTaskProgress>.catch` interface.
     *
     * @param onRejected - Called when an error occurs during bundle loading.
     */
    catch<R>(onRejected: (a: Error) => R | PromiseLike<R>): Promise<R | LoadBundleTaskProgress>;
    /**
     * Implements the `Promise<LoadBundleTaskProgress>.then` interface.
     *
     * @param onFulfilled - Called on the completion of the loading task with a final `LoadBundleTaskProgress` update.
     *   The update will always have its `taskState` set to `"Success"`.
     * @param onRejected - Called when an error occurs during bundle loading.
     */
    then<T, R>(onFulfilled?: (a: LoadBundleTaskProgress) => T | PromiseLike<T>, onRejected?: (a: Error) => R | PromiseLike<R>): Promise<T | R>;
    /**
     * Notifies all observers that bundle loading has completed, with a provided
     * `LoadBundleTaskProgress` object.
     *
     * @private
     */
    _completeWith(progress: LoadBundleTaskProgress): void;
    /**
     * Notifies all observers that bundle loading has failed, with a provided
     * `Error` as the reason.
     *
     * @private
     */
    _failWith(error: FirestoreError): void;
    /**
     * Notifies a progress update of loading a bundle.
     * @param progress - The new progress.
     *
     * @private
     */
    _updateProgress(progress: LoadBundleTaskProgress): void;
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
 * Internal transaction object responsible for accumulating the mutations to
 * perform and the base versions for any documents read.
 */
declare class Transaction$2 {
    private datastore;
    private readVersions;
    private mutations;
    private committed;
    /**
     * A deferred usage error that occurred previously in this transaction that
     * will cause the transaction to fail once it actually commits.
     */
    private lastTransactionError;
    /**
     * Set of documents that have been written in the transaction.
     *
     * When there's more than one write to the same key in a transaction, any
     * writes after the first are handled differently.
     */
    private writtenDocs;
    constructor(datastore: Datastore);
    lookup(keys: DocumentKey[]): Promise<Document[]>;
    set(key: DocumentKey, data: ParsedSetData): void;
    update(key: DocumentKey, data: ParsedUpdateData): void;
    delete(key: DocumentKey): void;
    commit(): Promise<void>;
    private recordVersion;
    /**
     * Returns the version of this document when it was read in this transaction,
     * as a precondition, or no precondition if it was not read.
     */
    private precondition;
    /**
     * Returns the precondition for a document if the operation is an update.
     */
    private preconditionForUpdate;
    private write;
    private ensureCommitNotCalled;
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
 * FirestoreClient is a top-level class that constructs and owns all of the //
 * pieces of the client SDK architecture. It is responsible for creating the //
 * async queue that is shared by all of the other components in the system. //
 */
declare class FirestoreClient {
    private authCredentials;
    private appCheckCredentials;
    /**
     * Asynchronous queue responsible for all of our internal processing. When
     * we get incoming work from the user (via public API) or the network
     * (incoming GRPC messages), we should always schedule onto this queue.
     * This ensures all of our work is properly serialized (e.g. we don't
     * start processing a new operation while the previous one is waiting for
     * an async I/O to complete).
     */
    asyncQueue: AsyncQueue;
    /**
     * Exposed for testing
     */
    _databaseInfo: DatabaseInfo;
    private user;
    private readonly clientId;
    private authCredentialListener;
    private appCheckCredentialListener;
    _uninitializedComponentsProvider?: {
        _offline: OfflineComponentProvider;
        _online: OnlineComponentProvider;
    };
    _offlineComponents?: OfflineComponentProvider;
    _onlineComponents?: OnlineComponentProvider;
    constructor(authCredentials: CredentialsProvider<User>, appCheckCredentials: CredentialsProvider<string>, 
    /**
     * Asynchronous queue responsible for all of our internal processing. When
     * we get incoming work from the user (via public API) or the network
     * (incoming GRPC messages), we should always schedule onto this queue.
     * This ensures all of our work is properly serialized (e.g. we don't
     * start processing a new operation while the previous one is waiting for
     * an async I/O to complete).
     */
    asyncQueue: AsyncQueue, 
    /**
     * Exposed for testing
     */
    _databaseInfo: DatabaseInfo, componentProvider?: {
        _offline: OfflineComponentProvider;
        _online: OnlineComponentProvider;
    });
    get configuration(): ComponentConfiguration;
    setCredentialChangeListener(listener: (user: User) => Promise<void>): void;
    setAppCheckTokenChangeListener(listener: (appCheckToken: string, user: User) => Promise<void>): void;
    terminate(): Promise<void>;
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
 * Settings that can be passed to `enableIndexedDbPersistence()` to configure
 * Firestore persistence.
 *
 * Persistence cannot be used in a Node.js environment.
 */
interface PersistenceSettings {
    /**
     * Whether to force enable persistence for the client. This cannot be used
     * with multi-tab synchronization and is primarily intended for use with Web
     * Workers. Setting this to `true` will enable persistence, but cause other
     * tabs using persistence to fail.
     */
    forceOwnership?: boolean;
}
/**
 * Specifies custom configurations for your Cloud Firestore instance.
 * You must set these before invoking any other methods.
 */
interface FirestoreSettings extends FirestoreSettings$1 {
    /**
     * NOTE: This field will be deprecated in a future major release. Use `cache` field
     * instead to specify cache size, and other cache configurations.
     *
     * An approximate cache size threshold for the on-disk data. If the cache
     * grows beyond this size, Firestore will start removing data that hasn't been
     * recently used. The size is not a guarantee that the cache will stay below
     * that size, only that if the cache exceeds the given size, cleanup will be
     * attempted.
     *
     * The default value is 40 MB. The threshold must be set to at least 1 MB, and
     * can be set to `CACHE_SIZE_UNLIMITED` to disable garbage collection.
     */
    cacheSizeBytes?: number;
    /**
     * Specifies the cache used by the SDK. Available options are `MemoryLocalCache`
     * and `PersistentLocalCache`, each with different configuration options.
     *
     * When unspecified, `MemoryLocalCache` will be used by default.
     *
     * NOTE: setting this field and `cacheSizeBytes` at the same time will throw
     * exception during SDK initialization. Instead, using the configuration in
     * the `FirestoreLocalCache` object to specify the cache size.
     */
    localCache?: FirestoreLocalCache;
    /**
     * Forces the SDK’s underlying network transport (WebChannel) to use
     * long-polling. Each response from the backend will be closed immediately
     * after the backend sends data (by default responses are kept open in
     * case the backend has more data to send). This avoids incompatibility
     * issues with certain proxies, antivirus software, etc. that incorrectly
     * buffer traffic indefinitely. Use of this option will cause some
     * performance degradation though.
     *
     * This setting cannot be used with `experimentalAutoDetectLongPolling` and
     * may be removed in a future release. If you find yourself using it to
     * work around a specific network reliability issue, please tell us about
     * it in https://github.com/firebase/firebase-js-sdk/issues/1674.
     *
     * This setting cannot be used in a Node.js environment.
     */
    experimentalForceLongPolling?: boolean;
    /**
     * Configures the SDK's underlying transport (WebChannel) to automatically
     * detect if long-polling should be used. This is very similar to
     * `experimentalForceLongPolling`, but only uses long-polling if required.
     *
     * After having had a default value of `false` since its inception in 2019,
     * the default value of this setting was changed in May 2023 to `true` in
     * v9.22.0 of the Firebase JavaScript SDK. That is, auto-detection of long
     * polling is now enabled by default. To disable it, set this setting to
     * `false`, and please open a GitHub issue to share the problems that
     * motivated you disabling long-polling auto-detection.
     *
     * This setting cannot be used in a Node.js environment.
     */
    experimentalAutoDetectLongPolling?: boolean;
    /**
     * Options that configure the SDK’s underlying network transport (WebChannel)
     * when long-polling is used.
     *
     * These options are only used if `experimentalForceLongPolling` is true or if
     * `experimentalAutoDetectLongPolling` is true and the auto-detection
     * determined that long-polling was needed. Otherwise, these options have no
     * effect.
     */
    experimentalLongPollingOptions?: ExperimentalLongPollingOptions;
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

declare module '@firebase/component' {
    interface NameServiceMapping {
        'firestore': Firestore;
    }
}
/**
 * Constant used to indicate the LRU garbage collection should be disabled.
 * Set this value as the `cacheSizeBytes` on the settings passed to the
 * {@link Firestore} instance.
 */
declare const CACHE_SIZE_UNLIMITED = -1;
/**
 * The Cloud Firestore service interface.
 *
 * Do not call this constructor directly. Instead, use {@link (getFirestore:1)}.
 */
declare class Firestore extends Firestore$1 {
    /**
     * Whether it's a {@link Firestore} or Firestore Lite instance.
     */
    type: 'firestore-lite' | 'firestore';
    _queue: AsyncQueue;
    readonly _persistenceKey: string;
    _firestoreClient: FirestoreClient | undefined;
    _componentsProvider?: {
        _offline: OfflineComponentProviderFactory;
        _online: OnlineComponentProviderFactory;
    };
    /** @hideconstructor */
    constructor(authCredentialsProvider: CredentialsProvider<User>, appCheckCredentialsProvider: CredentialsProvider<string>, databaseId: DatabaseId, app?: FirebaseApp);
    protected _terminate(): Promise<void>;
}
/**
 * Initializes a new instance of {@link Firestore} with the provided settings.
 * Can only be called before any other function, including
 * {@link (getFirestore:1)}. If the custom settings are empty, this function is
 * equivalent to calling {@link (getFirestore:1)}.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} with which the {@link Firestore} instance will
 * be associated.
 * @param settings - A settings object to configure the {@link Firestore} instance.
 * @param databaseId - The name of the database.
 * @returns A newly initialized {@link Firestore} instance.
 */
declare function initializeFirestore(app: FirebaseApp, settings: FirestoreSettings, databaseId?: string): Firestore;
/**
 * Returns the existing default {@link Firestore} instance that is associated with the
 * default {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @returns The default {@link Firestore} instance of the default app.
 */
declare function getFirestore(): Firestore;
/**
 * Returns the existing default {@link Firestore} instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned {@link Firestore}
 * instance is associated with.
 * @returns The default {@link Firestore} instance of the provided app.
 */
declare function getFirestore(app: FirebaseApp): Firestore;
/**
 * Returns the existing named {@link Firestore} instance that is associated with the
 * default {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param databaseId - The name of the database.
 * @returns The named {@link Firestore} instance of the default app.
 * @beta
 */
declare function getFirestore(databaseId: string): Firestore;
/**
 * Returns the existing named {@link Firestore} instance that is associated with the
 * provided {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new
 * instance with default settings.
 *
 * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned {@link Firestore}
 * instance is associated with.
 * @param databaseId - The name of the database.
 * @returns The named {@link Firestore} instance of the provided app.
 * @beta
 */
declare function getFirestore(app: FirebaseApp, databaseId: string): Firestore;
/**
 * @internal
 */
declare function ensureFirestoreConfigured(firestore: Firestore): FirestoreClient;
/**
 * Attempts to enable persistent storage, if possible.
 *
 * On failure, `enableIndexedDbPersistence()` will reject the promise or
 * throw an exception. There are several reasons why this can fail, which can be
 * identified by the `code` on the error.
 *
 *   * failed-precondition: The app is already open in another browser tab.
 *   * unimplemented: The browser is incompatible with the offline persistence
 *     implementation.
 *
 * Note that even after a failure, the {@link Firestore} instance will remain
 * usable, however offline persistence will be disabled.
 *
 * Note: `enableIndexedDbPersistence()` must be called before any other functions
 * (other than {@link initializeFirestore}, {@link (getFirestore:1)} or
 * {@link clearIndexedDbPersistence}.
 *
 * Persistence cannot be used in a Node.js environment.
 *
 * @param firestore - The {@link Firestore} instance to enable persistence for.
 * @param persistenceSettings - Optional settings object to configure
 * persistence.
 * @returns A `Promise` that represents successfully enabling persistent storage.
 * @deprecated This function will be removed in a future major release. Instead, set
 * `FirestoreSettings.localCache` to an instance of `PersistentLocalCache` to
 * turn on IndexedDb cache. Calling this function when `FirestoreSettings.localCache`
 * is already specified will throw an exception.
 */
declare function enableIndexedDbPersistence(firestore: Firestore, persistenceSettings?: PersistenceSettings): Promise<void>;
/**
 * Attempts to enable multi-tab persistent storage, if possible. If enabled
 * across all tabs, all operations share access to local persistence, including
 * shared execution of queries and latency-compensated local document updates
 * across all connected instances.
 *
 * On failure, `enableMultiTabIndexedDbPersistence()` will reject the promise or
 * throw an exception. There are several reasons why this can fail, which can be
 * identified by the `code` on the error.
 *
 *   * failed-precondition: The app is already open in another browser tab and
 *     multi-tab is not enabled.
 *   * unimplemented: The browser is incompatible with the offline persistence
 *     implementation.
 *
 * Note that even after a failure, the {@link Firestore} instance will remain
 * usable, however offline persistence will be disabled.
 *
 * @param firestore - The {@link Firestore} instance to enable persistence for.
 * @returns A `Promise` that represents successfully enabling persistent
 * storage.
 * @deprecated This function will be removed in a future major release. Instead, set
 * `FirestoreSettings.localCache` to an instance of `PersistentLocalCache` to
 * turn on indexeddb cache. Calling this function when `FirestoreSettings.localCache`
 * is already specified will throw an exception.
 */
declare function enableMultiTabIndexedDbPersistence(firestore: Firestore): Promise<void>;
/**
 * Clears the persistent storage. This includes pending writes and cached
 * documents.
 *
 * Must be called while the {@link Firestore} instance is not started (after the app is
 * terminated or when the app is first initialized). On startup, this function
 * must be called before other functions (other than {@link
 * initializeFirestore} or {@link (getFirestore:1)})). If the {@link Firestore}
 * instance is still running, the promise will be rejected with the error code
 * of `failed-precondition`.
 *
 * Note: `clearIndexedDbPersistence()` is primarily intended to help write
 * reliable tests that use Cloud Firestore. It uses an efficient mechanism for
 * dropping existing data but does not attempt to securely overwrite or
 * otherwise make cached data unrecoverable. For applications that are sensitive
 * to the disclosure of cached data in between user sessions, we strongly
 * recommend not enabling persistence at all.
 *
 * @param firestore - The {@link Firestore} instance to clear persistence for.
 * @returns A `Promise` that is resolved when the persistent storage is
 * cleared. Otherwise, the promise is rejected with an error.
 */
declare function clearIndexedDbPersistence(firestore: Firestore): Promise<void>;
/**
 * Waits until all currently pending writes for the active user have been
 * acknowledged by the backend.
 *
 * The returned promise resolves immediately if there are no outstanding writes.
 * Otherwise, the promise waits for all previously issued writes (including
 * those written in a previous app session), but it does not wait for writes
 * that were added after the function is called. If you want to wait for
 * additional writes, call `waitForPendingWrites()` again.
 *
 * Any outstanding `waitForPendingWrites()` promises are rejected during user
 * changes.
 *
 * @returns A `Promise` which resolves when all currently pending writes have been
 * acknowledged by the backend.
 */
declare function waitForPendingWrites(firestore: Firestore): Promise<void>;
/**
 * Re-enables use of the network for this {@link Firestore} instance after a prior
 * call to {@link disableNetwork}.
 *
 * @returns A `Promise` that is resolved once the network has been enabled.
 */
declare function enableNetwork(firestore: Firestore): Promise<void>;
/**
 * Disables network usage for this instance. It can be re-enabled via {@link
 * enableNetwork}. While the network is disabled, any snapshot listeners,
 * `getDoc()` or `getDocs()` calls will return results from cache, and any write
 * operations will be queued until the network is restored.
 *
 * @returns A `Promise` that is resolved once the network has been disabled.
 */
declare function disableNetwork(firestore: Firestore): Promise<void>;
/**
 * Terminates the provided {@link Firestore} instance.
 *
 * After calling `terminate()` only the `clearIndexedDbPersistence()` function
 * may be used. Any other function will throw a `FirestoreError`.
 *
 * To restart after termination, create a new instance of FirebaseFirestore with
 * {@link (getFirestore:1)}.
 *
 * Termination does not cancel any pending writes, and any promises that are
 * awaiting a response from the server will not be resolved. If you have
 * persistence enabled, the next time you start this instance, it will resume
 * sending these writes to the server.
 *
 * Note: Under normal circumstances, calling `terminate()` is not required. This
 * function is useful only when you want to force this instance to release all
 * of its resources or in combination with `clearIndexedDbPersistence()` to
 * ensure that all local state is destroyed between test runs.
 *
 * @returns A `Promise` that is resolved when the instance has been successfully
 * terminated.
 */
declare function terminate(firestore: Firestore): Promise<void>;
/**
 * Loads a Firestore bundle into the local cache.
 *
 * @param firestore - The {@link Firestore} instance to load bundles for.
 * @param bundleData - An object representing the bundle to be loaded. Valid
 * objects are `ArrayBuffer`, `ReadableStream<Uint8Array>` or `string`.
 *
 * @returns A `LoadBundleTask` object, which notifies callers with progress
 * updates, and completion or error events. It can be used as a
 * `Promise<LoadBundleTaskProgress>`.
 */
declare function loadBundle(firestore: Firestore, bundleData: ReadableStream<Uint8Array> | ArrayBuffer | string): LoadBundleTask;
/**
 * Reads a Firestore {@link Query} from local cache, identified by the given
 * name.
 *
 * The named queries are packaged  into bundles on the server side (along
 * with resulting documents), and loaded to local cache using `loadBundle`. Once
 * in local cache, use this method to extract a {@link Query} by name.
 *
 * @param firestore - The {@link Firestore} instance to read the query from.
 * @param name - The name of the query.
 * @returns A `Promise` that is resolved with the Query or `null`.
 */
declare function namedQuery(firestore: Firestore, name: string): Promise<Query | null>;

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
 * @beta
 */
declare class Pipeline extends Pipeline$1 {
    /**
     * @internal
     * @private
     * @param db
     * @param userDataWriter
     * @param stages
     * @protected
     */
    protected newPipeline(db: Firestore, stages: Stage[]): Pipeline;
}

/**
 * @beta
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
 * @beta
 * Options defining Pipeline execution.
 */
interface PipelineExecuteOptions {
    /**
     * @beta
     * Pipeline to be evaluated.
     */
    pipeline: Pipeline$1;
    /**
     * @beta
     * Specify the index mode.
     */
    indexMode?: 'recommended';
    /**
     * @beta
     * An escape hatch to set options not known at SDK build time. These values
     * will be passed directly to the Firestore backend and not used by the SDK.
     *
     * The option name will be used as provided. And must match the name
     * format used by the backend (hint: use a snake_case_name).
     *
     * Custom option values can be any type supported
     * by Firestore (for example: string, boolean, number, map, …). Value types
     * not known to the SDK will be rejected.
     *
     * Values specified in rawOptions will take precedence over any options
     * with the same name set by the SDK.
     *
     * @example
     * Override the `example_option`:
     * ```
     *   execute({
     *     pipeline: myPipeline,
     *     rawOptions: {
     *       // Override `example_option`. This will not
     *       // merge with the existing `example_option` object.
     *       "example_option": {
     *         foo: "bar"
     *       }
     *     }
     *   }
     * ```
     *
     * `rawOptions` supports dot notation, if you want to override
     * a nested option.
     * ```
     *   execute({
     *     pipeline: myPipeline,
     *     rawOptions: {
     *       // Override `example_option.foo` and do not override
     *       // any other properties of `example_option`.
     *       "example_option.foo": "bar"
     *     }
     *   }
     * ```
     */
    rawOptions?: {
        [name: string]: unknown;
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


    /**
     * @beta
     * Creates and returns a new PipelineSource, which allows specifying the source stage of a {@link @firebase/firestore/pipelines#Pipeline}.
     *
     * @example
     * ```
     * let myPipeline: Pipeline = firestore.pipeline().collection('books');
     * ```
     */
    interface Firestore {
        pipeline(): PipelineSource<Pipeline>;
    }

/**
 * @beta
 * Executes a pipeline and returns a Promise to represent the asynchronous operation.
 *
 * The returned Promise can be used to track the progress of the pipeline execution
 * and retrieve the results (or handle any errors) asynchronously.
 *
 * The pipeline results are returned as a {@link @firebase/firestore/pipelines#PipelineSnapshot} that contains
 * a list of {@link @firebase/firestore/pipelines#PipelineResult} objects. Each {@link @firebase/firestore/pipelines#PipelineResult} typically
 * represents a single key/value map that has passed through all the
 * stages of the pipeline, however this might differ depending on the stages involved in the
 * pipeline. For example:
 *
 * <ul>
 *   <li>If there are no stages or only transformation stages, each {@link @firebase/firestore/pipelines#PipelineResult}
 *       represents a single document.</li>
 *   <li>If there is an aggregation, only a single {@link @firebase/firestore/pipelines#PipelineResult} is returned,
 *       representing the aggregated results over the entire dataset .</li>
 *   <li>If there is an aggregation stage with grouping, each {@link @firebase/firestore/pipelines#PipelineResult} represents a
 *       distinct group and its associated aggregated values.</li>
 * </ul>
 *
 * @example
 * ```typescript
 * const snapshot: PipelineSnapshot = await execute(firestore.pipeline().collection("books")
 *     .where(greaterThan(field("rating"), 4.5))
 *     .select("title", "author", "rating"));
 *
 * const results: PipelineResult[] = snapshot.results;
 * ```
 *
 * @param pipeline - The pipeline to execute.
 * @returns A Promise representing the asynchronous pipeline execution.
 */
declare function execute(pipeline: Pipeline$1): Promise<PipelineSnapshot>;
/**
 * @beta
 * Executes a pipeline and returns a Promise to represent the asynchronous operation.
 *
 * The returned Promise can be used to track the progress of the pipeline execution
 * and retrieve the results (or handle any errors) asynchronously.
 *
 * The pipeline results are returned as a {@link @firebase/firestore/pipelines#PipelineSnapshot} that contains
 * a list of {@link @firebase/firestore/pipelines#PipelineResult} objects. Each {@link @firebase/firestore/pipelines#PipelineResult} typically
 * represents a single key/value map that has passed through all the
 * stages of the pipeline, however this might differ depending on the stages involved in the
 * pipeline. For example:
 *
 * <ul>
 *   <li>If there are no stages or only transformation stages, each {@link @firebase/firestore/pipelines#PipelineResult}
 *       represents a single document.</li>
 *   <li>If there is an aggregation, only a single {@link @firebase/firestore/pipelines#PipelineResult} is returned,
 *       representing the aggregated results over the entire dataset .</li>
 *   <li>If there is an aggregation stage with grouping, each {@link @firebase/firestore/pipelines#PipelineResult} represents a
 *       distinct group and its associated aggregated values.</li>
 * </ul>
 *
 * @example
 * ```typescript
 * const snapshot: PipelineSnapshot = await execute(firestore.pipeline().collection("books")
 *     .where(greaterThan(field("rating"), 4.5))
 *     .select("title", "author", "rating"));
 *
 * const results: PipelineResult[] = snapshot.results;
 * ```
 *
 * @param options - Specifies the pipeline to execute and other options for execute.
 * @returns A Promise representing the asynchronous pipeline execution.
 */
declare function execute(options: PipelineExecuteOptions): Promise<PipelineSnapshot>;

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
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to sum across the result set.
 */
declare function sum(field: string | FieldPath): AggregateField<number>;
/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to average across the result set.
 */
declare function average(field: string | FieldPath): AggregateField<number | null>;
/**
 * Create an AggregateField object that can be used to compute the count of
 * documents in the result set of a query.
 */
declare function count(): AggregateField<number>;
/**
 * Compares two 'AggregateField` instances for equality.
 *
 * @param left - Compare this AggregateField to the `right`.
 * @param right - Compare this AggregateField to the `left`.
 */
declare function aggregateFieldEqual(left: AggregateField<unknown>, right: AggregateField<unknown>): boolean;
/**
 * Compares two `AggregateQuerySnapshot` instances for equality.
 *
 * Two `AggregateQuerySnapshot` instances are considered "equal" if they have
 * underlying queries that compare equal, and the same data.
 *
 * @param left - The first `AggregateQuerySnapshot` to compare.
 * @param right - The second `AggregateQuerySnapshot` to compare.
 *
 * @returns `true` if the objects are "equal", as defined above, or `false`
 * otherwise.
 */
declare function aggregateQuerySnapshotEqual<AggregateSpecType extends AggregateSpec, AppModelType, DbModelType extends DocumentData>(left: AggregateQuerySnapshot<AggregateSpecType, AppModelType, DbModelType>, right: AggregateQuerySnapshot<AggregateSpecType, AppModelType, DbModelType>): boolean;

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
 * Represents an aggregation that can be performed by Firestore.
 */
declare class AggregateField<T> {
    readonly _internalFieldPath?: FieldPath$1 | undefined;
    /** A type string to uniquely identify instances of this class. */
    readonly type = "AggregateField";
    /** Indicates the aggregation operation of this AggregateField. */
    readonly aggregateType: AggregateType;
    /**
     * Create a new AggregateField<T>
     * @param aggregateType - Specifies the type of aggregation operation to perform.
     * @param _internalFieldPath - Optionally specifies the field that is aggregated.
     * @internal
     */
    constructor(aggregateType?: AggregateType, _internalFieldPath?: FieldPath$1 | undefined);
}
/**
 * The union of all `AggregateField` types that are supported by Firestore.
 */
type AggregateFieldType = ReturnType<typeof sum> | ReturnType<typeof average> | ReturnType<typeof count>;
/**
 * Specifies a set of aggregations and their aliases.
 */
interface AggregateSpec {
    [field: string]: AggregateFieldType;
}
/**
 * A type whose keys are taken from an `AggregateSpec`, and whose values are the
 * result of the aggregation performed by the corresponding `AggregateField`
 * from the input `AggregateSpec`.
 */
type AggregateSpecData<T extends AggregateSpec> = {
    [P in keyof T]: T[P] extends AggregateField<infer U> ? U : never;
};
/**
 * The results of executing an aggregation query.
 */
declare class AggregateQuerySnapshot<AggregateSpecType extends AggregateSpec, AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    private readonly _userDataWriter;
    private readonly _data;
    /** A type string to uniquely identify instances of this class. */
    readonly type = "AggregateQuerySnapshot";
    /**
     * The underlying query over which the aggregations recorded in this
     * `AggregateQuerySnapshot` were performed.
     */
    readonly query: Query<AppModelType, DbModelType>;
    /** @hideconstructor */
    constructor(query: Query<AppModelType, DbModelType>, _userDataWriter: AbstractUserDataWriter, _data: ApiClientObjectMap<Value>);
    /**
     * Returns the results of the aggregations performed over the underlying
     * query.
     *
     * The keys of the returned object will be the same as those of the
     * `AggregateSpec` object specified to the aggregation method, and the values
     * will be the corresponding aggregation result.
     *
     * @returns The results of the aggregations performed over the underlying
     * query.
     */
    data(): AggregateSpecData<AggregateSpecType>;
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the snapshot as a proto value.
     *
     * @returns An `Object` containing all fields in the snapshot.
     */
    _fieldsProto(): {
        [key: string]: firestoreV1ApiClientInterfaces.Value;
    };
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
 * @private
 *
 * This function is for internal use only.
 *
 * Returns the `QueryTarget` representation of the given query. Returns `null`
 * if the Firestore client associated with the given query has not been
 * initialized or has been terminated.
 *
 * @param query - The Query to convert to proto representation.
 */
declare function _internalQueryToProtoQueryTarget(query: Query): any;
/**
 * @internal
 * @private
 *
 * This function is for internal use only.
 *
 * Returns `RunAggregationQueryRequest` which contains the proto representation
 * of the given aggregation query request. Returns null if the Firestore client
 * associated with the given query has not been initialized or has been
 * terminated.
 *
 * @param query - The Query to convert to proto representation.
 * @param aggregateSpec - The set of aggregations and their aliases.
 */
declare function _internalAggregationQueryToProtoRunAggregationQueryRequest<AggregateSpecType extends AggregateSpec>(query: Query, aggregateSpec: AggregateSpecType): any;
/**
 * @internal
 * @private
 *
 * This function is for internal use only.
 *
 * Returns the `ExecutePipelineRequest` representation of the given query.
 * Returns `null` if the Firestore client associated with the given query has
 * not been initialized or has been terminated.
 *
 * @param pipeline - The Pipeline to convert to proto representation.
 */
declare function _internalPipelineToExecutePipelineRequestProto(pipeline: Pipeline$1): any;

/**
 * @license
 * Copyright 2021 Google LLC
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

type api_pipelines_d_PipelineSource<PipelineType> = PipelineSource<PipelineType>;
declare const api_pipelines_d_PipelineSource: typeof PipelineSource;
type api_pipelines_d_OneOf<T> = OneOf<T>;
type api_pipelines_d_PipelineResult<AppModelType = DocumentData> = PipelineResult<AppModelType>;
declare const api_pipelines_d_PipelineResult: typeof PipelineResult;
type api_pipelines_d_PipelineSnapshot = PipelineSnapshot;
declare const api_pipelines_d_PipelineSnapshot: typeof PipelineSnapshot;
declare const api_pipelines_d_pipelineResultEqual: typeof pipelineResultEqual;
type api_pipelines_d_Pipeline = Pipeline;
declare const api_pipelines_d_Pipeline: typeof Pipeline;
declare const api_pipelines_d_execute: typeof execute;
type api_pipelines_d_PipelineExecuteOptions = PipelineExecuteOptions;
type api_pipelines_d_StageOptions = StageOptions;
type api_pipelines_d_CollectionStageOptions = CollectionStageOptions;
type api_pipelines_d_CollectionGroupStageOptions = CollectionGroupStageOptions;
type api_pipelines_d_DatabaseStageOptions = DatabaseStageOptions;
type api_pipelines_d_DocumentsStageOptions = DocumentsStageOptions;
type api_pipelines_d_AddFieldsStageOptions = AddFieldsStageOptions;
type api_pipelines_d_RemoveFieldsStageOptions = RemoveFieldsStageOptions;
type api_pipelines_d_SelectStageOptions = SelectStageOptions;
type api_pipelines_d_WhereStageOptions = WhereStageOptions;
type api_pipelines_d_OffsetStageOptions = OffsetStageOptions;
type api_pipelines_d_LimitStageOptions = LimitStageOptions;
type api_pipelines_d_DistinctStageOptions = DistinctStageOptions;
type api_pipelines_d_AggregateStageOptions = AggregateStageOptions;
type api_pipelines_d_FindNearestStageOptions = FindNearestStageOptions;
type api_pipelines_d_ReplaceWithStageOptions = ReplaceWithStageOptions;
type api_pipelines_d_SampleStageOptions = SampleStageOptions;
type api_pipelines_d_UnionStageOptions = UnionStageOptions;
type api_pipelines_d_UnnestStageOptions = UnnestStageOptions;
type api_pipelines_d_SortStageOptions = SortStageOptions;
declare const api_pipelines_d_field: typeof field;
declare const api_pipelines_d_constant: typeof constant;
declare const api_pipelines_d_add: typeof add;
declare const api_pipelines_d_subtract: typeof subtract;
declare const api_pipelines_d_multiply: typeof multiply;
declare const api_pipelines_d_divide: typeof divide;
declare const api_pipelines_d_mod: typeof mod;
declare const api_pipelines_d_equal: typeof equal;
declare const api_pipelines_d_notEqual: typeof notEqual;
declare const api_pipelines_d_lessThan: typeof lessThan;
declare const api_pipelines_d_lessThanOrEqual: typeof lessThanOrEqual;
declare const api_pipelines_d_greaterThan: typeof greaterThan;
declare const api_pipelines_d_greaterThanOrEqual: typeof greaterThanOrEqual;
declare const api_pipelines_d_array: typeof array;
declare const api_pipelines_d_arrayConcat: typeof arrayConcat;
declare const api_pipelines_d_arrayContains: typeof arrayContains;
declare const api_pipelines_d_arrayContainsAny: typeof arrayContainsAny;
declare const api_pipelines_d_arrayContainsAll: typeof arrayContainsAll;
declare const api_pipelines_d_arrayFirst: typeof arrayFirst;
declare const api_pipelines_d_arrayFirstN: typeof arrayFirstN;
declare const api_pipelines_d_arrayGet: typeof arrayGet;
declare const api_pipelines_d_arrayIndexOf: typeof arrayIndexOf;
declare const api_pipelines_d_arrayIndexOfAll: typeof arrayIndexOfAll;
declare const api_pipelines_d_arrayLast: typeof arrayLast;
declare const api_pipelines_d_arrayLastIndexOf: typeof arrayLastIndexOf;
declare const api_pipelines_d_arrayLastN: typeof arrayLastN;
declare const api_pipelines_d_arrayLength: typeof arrayLength;
declare const api_pipelines_d_arrayMaximum: typeof arrayMaximum;
declare const api_pipelines_d_arrayMaximumN: typeof arrayMaximumN;
declare const api_pipelines_d_arrayMinimum: typeof arrayMinimum;
declare const api_pipelines_d_arrayMinimumN: typeof arrayMinimumN;
declare const api_pipelines_d_equalAny: typeof equalAny;
declare const api_pipelines_d_notEqualAny: typeof notEqualAny;
declare const api_pipelines_d_xor: typeof xor;
declare const api_pipelines_d_conditional: typeof conditional;
declare const api_pipelines_d_not: typeof not;
declare const api_pipelines_d_logicalMaximum: typeof logicalMaximum;
declare const api_pipelines_d_logicalMinimum: typeof logicalMinimum;
declare const api_pipelines_d_exists: typeof exists;
declare const api_pipelines_d_reverse: typeof reverse;
declare const api_pipelines_d_byteLength: typeof byteLength;
declare const api_pipelines_d_charLength: typeof charLength;
declare const api_pipelines_d_like: typeof like;
declare const api_pipelines_d_regexContains: typeof regexContains;
declare const api_pipelines_d_regexFind: typeof regexFind;
declare const api_pipelines_d_regexFindAll: typeof regexFindAll;
declare const api_pipelines_d_regexMatch: typeof regexMatch;
declare const api_pipelines_d_stringContains: typeof stringContains;
declare const api_pipelines_d_startsWith: typeof startsWith;
declare const api_pipelines_d_endsWith: typeof endsWith;
declare const api_pipelines_d_toLower: typeof toLower;
declare const api_pipelines_d_toUpper: typeof toUpper;
declare const api_pipelines_d_trim: typeof trim;
declare const api_pipelines_d_ltrim: typeof ltrim;
declare const api_pipelines_d_rtrim: typeof rtrim;
declare const api_pipelines_d_type: typeof type;
declare const api_pipelines_d_isType: typeof isType;
declare const api_pipelines_d_stringConcat: typeof stringConcat;
declare const api_pipelines_d_stringIndexOf: typeof stringIndexOf;
declare const api_pipelines_d_stringRepeat: typeof stringRepeat;
declare const api_pipelines_d_stringReplaceAll: typeof stringReplaceAll;
declare const api_pipelines_d_stringReplaceOne: typeof stringReplaceOne;
declare const api_pipelines_d_mapGet: typeof mapGet;
declare const api_pipelines_d_mapSet: typeof mapSet;
declare const api_pipelines_d_mapKeys: typeof mapKeys;
declare const api_pipelines_d_mapValues: typeof mapValues;
declare const api_pipelines_d_mapEntries: typeof mapEntries;
declare const api_pipelines_d_countAll: typeof countAll;
declare const api_pipelines_d_minimum: typeof minimum;
declare const api_pipelines_d_maximum: typeof maximum;
declare const api_pipelines_d_first: typeof first;
declare const api_pipelines_d_last: typeof last;
declare const api_pipelines_d_arrayAgg: typeof arrayAgg;
declare const api_pipelines_d_arrayAggDistinct: typeof arrayAggDistinct;
declare const api_pipelines_d_cosineDistance: typeof cosineDistance;
declare const api_pipelines_d_dotProduct: typeof dotProduct;
declare const api_pipelines_d_euclideanDistance: typeof euclideanDistance;
declare const api_pipelines_d_vectorLength: typeof vectorLength;
declare const api_pipelines_d_unixMicrosToTimestamp: typeof unixMicrosToTimestamp;
declare const api_pipelines_d_timestampToUnixMicros: typeof timestampToUnixMicros;
declare const api_pipelines_d_unixMillisToTimestamp: typeof unixMillisToTimestamp;
declare const api_pipelines_d_timestampToUnixMillis: typeof timestampToUnixMillis;
declare const api_pipelines_d_unixSecondsToTimestamp: typeof unixSecondsToTimestamp;
declare const api_pipelines_d_timestampToUnixSeconds: typeof timestampToUnixSeconds;
declare const api_pipelines_d_timestampAdd: typeof timestampAdd;
declare const api_pipelines_d_timestampSubtract: typeof timestampSubtract;
declare const api_pipelines_d_ascending: typeof ascending;
declare const api_pipelines_d_descending: typeof descending;
declare const api_pipelines_d_countIf: typeof countIf;
declare const api_pipelines_d_isError: typeof isError;
declare const api_pipelines_d_ifError: typeof ifError;
declare const api_pipelines_d_isAbsent: typeof isAbsent;
declare const api_pipelines_d_map: typeof map;
declare const api_pipelines_d_mapRemove: typeof mapRemove;
declare const api_pipelines_d_mapMerge: typeof mapMerge;
declare const api_pipelines_d_documentId: typeof documentId;
declare const api_pipelines_d_substring: typeof substring;
declare const api_pipelines_d_countDistinct: typeof countDistinct;
declare const api_pipelines_d_ceil: typeof ceil;
declare const api_pipelines_d_floor: typeof floor;
declare const api_pipelines_d_exp: typeof exp;
declare const api_pipelines_d_pow: typeof pow;
declare const api_pipelines_d_rand: typeof rand;
declare const api_pipelines_d_round: typeof round;
declare const api_pipelines_d_collectionId: typeof collectionId;
declare const api_pipelines_d_ln: typeof ln;
declare const api_pipelines_d_log: typeof log;
declare const api_pipelines_d_sqrt: typeof sqrt;
declare const api_pipelines_d_trunc: typeof trunc;
declare const api_pipelines_d_stringReverse: typeof stringReverse;
declare const api_pipelines_d_length: typeof length;
declare const api_pipelines_d_abs: typeof abs;
declare const api_pipelines_d_concat: typeof concat;
declare const api_pipelines_d_currentTimestamp: typeof currentTimestamp;
declare const api_pipelines_d_ifAbsent: typeof ifAbsent;
declare const api_pipelines_d_join: typeof join;
declare const api_pipelines_d_log10: typeof log10;
declare const api_pipelines_d_arraySum: typeof arraySum;
declare const api_pipelines_d_timestampTruncate: typeof timestampTruncate;
declare const api_pipelines_d_split: typeof split;
type api_pipelines_d_Expression = Expression;
declare const api_pipelines_d_Expression: typeof Expression;
type api_pipelines_d_AliasedExpression = AliasedExpression;
declare const api_pipelines_d_AliasedExpression: typeof AliasedExpression;
type api_pipelines_d_Field = Field;
declare const api_pipelines_d_Field: typeof Field;
type api_pipelines_d_FunctionExpression = FunctionExpression;
declare const api_pipelines_d_FunctionExpression: typeof FunctionExpression;
type api_pipelines_d_Ordering = Ordering;
declare const api_pipelines_d_Ordering: typeof Ordering;
type api_pipelines_d_BooleanExpression = BooleanExpression;
declare const api_pipelines_d_BooleanExpression: typeof BooleanExpression;
type api_pipelines_d_AggregateFunction = AggregateFunction;
declare const api_pipelines_d_AggregateFunction: typeof AggregateFunction;
type api_pipelines_d_ExpressionType = ExpressionType;
type api_pipelines_d_AliasedAggregate = AliasedAggregate;
declare const api_pipelines_d_AliasedAggregate: typeof AliasedAggregate;
type api_pipelines_d_Selectable = Selectable;
type api_pipelines_d_TimeGranularity = TimeGranularity;
type api_pipelines_d_Type = Type;
declare const api_pipelines_d__internalPipelineToExecutePipelineRequestProto: typeof _internalPipelineToExecutePipelineRequestProto;
declare namespace api_pipelines_d {
  export {
    api_pipelines_d_PipelineSource as PipelineSource,
    api_pipelines_d_OneOf as OneOf,
    api_pipelines_d_PipelineResult as PipelineResult,
    api_pipelines_d_PipelineSnapshot as PipelineSnapshot,
    api_pipelines_d_pipelineResultEqual as pipelineResultEqual,
    api_pipelines_d_Pipeline as Pipeline,
    api_pipelines_d_execute as execute,
    api_pipelines_d_PipelineExecuteOptions as PipelineExecuteOptions,
    api_pipelines_d_StageOptions as StageOptions,
    api_pipelines_d_CollectionStageOptions as CollectionStageOptions,
    api_pipelines_d_CollectionGroupStageOptions as CollectionGroupStageOptions,
    api_pipelines_d_DatabaseStageOptions as DatabaseStageOptions,
    api_pipelines_d_DocumentsStageOptions as DocumentsStageOptions,
    api_pipelines_d_AddFieldsStageOptions as AddFieldsStageOptions,
    api_pipelines_d_RemoveFieldsStageOptions as RemoveFieldsStageOptions,
    api_pipelines_d_SelectStageOptions as SelectStageOptions,
    api_pipelines_d_WhereStageOptions as WhereStageOptions,
    api_pipelines_d_OffsetStageOptions as OffsetStageOptions,
    api_pipelines_d_LimitStageOptions as LimitStageOptions,
    api_pipelines_d_DistinctStageOptions as DistinctStageOptions,
    api_pipelines_d_AggregateStageOptions as AggregateStageOptions,
    api_pipelines_d_FindNearestStageOptions as FindNearestStageOptions,
    api_pipelines_d_ReplaceWithStageOptions as ReplaceWithStageOptions,
    api_pipelines_d_SampleStageOptions as SampleStageOptions,
    api_pipelines_d_UnionStageOptions as UnionStageOptions,
    api_pipelines_d_UnnestStageOptions as UnnestStageOptions,
    api_pipelines_d_SortStageOptions as SortStageOptions,
    api_pipelines_d_field as field,
    api_pipelines_d_constant as constant,
    api_pipelines_d_add as add,
    api_pipelines_d_subtract as subtract,
    api_pipelines_d_multiply as multiply,
    api_pipelines_d_divide as divide,
    api_pipelines_d_mod as mod,
    api_pipelines_d_equal as equal,
    api_pipelines_d_notEqual as notEqual,
    api_pipelines_d_lessThan as lessThan,
    api_pipelines_d_lessThanOrEqual as lessThanOrEqual,
    api_pipelines_d_greaterThan as greaterThan,
    api_pipelines_d_greaterThanOrEqual as greaterThanOrEqual,
    api_pipelines_d_array as array,
    api_pipelines_d_arrayConcat as arrayConcat,
    api_pipelines_d_arrayContains as arrayContains,
    api_pipelines_d_arrayContainsAny as arrayContainsAny,
    api_pipelines_d_arrayContainsAll as arrayContainsAll,
    api_pipelines_d_arrayFirst as arrayFirst,
    api_pipelines_d_arrayFirstN as arrayFirstN,
    api_pipelines_d_arrayGet as arrayGet,
    api_pipelines_d_arrayIndexOf as arrayIndexOf,
    api_pipelines_d_arrayIndexOfAll as arrayIndexOfAll,
    api_pipelines_d_arrayLast as arrayLast,
    api_pipelines_d_arrayLastIndexOf as arrayLastIndexOf,
    api_pipelines_d_arrayLastN as arrayLastN,
    api_pipelines_d_arrayLength as arrayLength,
    api_pipelines_d_arrayMaximum as arrayMaximum,
    api_pipelines_d_arrayMaximumN as arrayMaximumN,
    api_pipelines_d_arrayMinimum as arrayMinimum,
    api_pipelines_d_arrayMinimumN as arrayMinimumN,
    api_pipelines_d_equalAny as equalAny,
    api_pipelines_d_notEqualAny as notEqualAny,
    api_pipelines_d_xor as xor,
    api_pipelines_d_conditional as conditional,
    api_pipelines_d_not as not,
    api_pipelines_d_logicalMaximum as logicalMaximum,
    api_pipelines_d_logicalMinimum as logicalMinimum,
    api_pipelines_d_exists as exists,
    api_pipelines_d_reverse as reverse,
    api_pipelines_d_byteLength as byteLength,
    api_pipelines_d_charLength as charLength,
    api_pipelines_d_like as like,
    api_pipelines_d_regexContains as regexContains,
    api_pipelines_d_regexFind as regexFind,
    api_pipelines_d_regexFindAll as regexFindAll,
    api_pipelines_d_regexMatch as regexMatch,
    api_pipelines_d_stringContains as stringContains,
    api_pipelines_d_startsWith as startsWith,
    api_pipelines_d_endsWith as endsWith,
    api_pipelines_d_toLower as toLower,
    api_pipelines_d_toUpper as toUpper,
    api_pipelines_d_trim as trim,
    api_pipelines_d_ltrim as ltrim,
    api_pipelines_d_rtrim as rtrim,
    api_pipelines_d_type as type,
    api_pipelines_d_isType as isType,
    api_pipelines_d_stringConcat as stringConcat,
    api_pipelines_d_stringIndexOf as stringIndexOf,
    api_pipelines_d_stringRepeat as stringRepeat,
    api_pipelines_d_stringReplaceAll as stringReplaceAll,
    api_pipelines_d_stringReplaceOne as stringReplaceOne,
    api_pipelines_d_mapGet as mapGet,
    api_pipelines_d_mapSet as mapSet,
    api_pipelines_d_mapKeys as mapKeys,
    api_pipelines_d_mapValues as mapValues,
    api_pipelines_d_mapEntries as mapEntries,
    api_pipelines_d_countAll as countAll,
    count$1 as count,
    sum$1 as sum,
    average$1 as average,
    and$1 as and,
    or$1 as or,
    api_pipelines_d_minimum as minimum,
    api_pipelines_d_maximum as maximum,
    api_pipelines_d_first as first,
    api_pipelines_d_last as last,
    api_pipelines_d_arrayAgg as arrayAgg,
    api_pipelines_d_arrayAggDistinct as arrayAggDistinct,
    api_pipelines_d_cosineDistance as cosineDistance,
    api_pipelines_d_dotProduct as dotProduct,
    api_pipelines_d_euclideanDistance as euclideanDistance,
    api_pipelines_d_vectorLength as vectorLength,
    api_pipelines_d_unixMicrosToTimestamp as unixMicrosToTimestamp,
    api_pipelines_d_timestampToUnixMicros as timestampToUnixMicros,
    api_pipelines_d_unixMillisToTimestamp as unixMillisToTimestamp,
    api_pipelines_d_timestampToUnixMillis as timestampToUnixMillis,
    api_pipelines_d_unixSecondsToTimestamp as unixSecondsToTimestamp,
    api_pipelines_d_timestampToUnixSeconds as timestampToUnixSeconds,
    api_pipelines_d_timestampAdd as timestampAdd,
    api_pipelines_d_timestampSubtract as timestampSubtract,
    api_pipelines_d_ascending as ascending,
    api_pipelines_d_descending as descending,
    api_pipelines_d_countIf as countIf,
    api_pipelines_d_isError as isError,
    api_pipelines_d_ifError as ifError,
    api_pipelines_d_isAbsent as isAbsent,
    api_pipelines_d_map as map,
    api_pipelines_d_mapRemove as mapRemove,
    api_pipelines_d_mapMerge as mapMerge,
    api_pipelines_d_documentId as documentId,
    api_pipelines_d_substring as substring,
    api_pipelines_d_countDistinct as countDistinct,
    api_pipelines_d_ceil as ceil,
    api_pipelines_d_floor as floor,
    api_pipelines_d_exp as exp,
    api_pipelines_d_pow as pow,
    api_pipelines_d_rand as rand,
    api_pipelines_d_round as round,
    api_pipelines_d_collectionId as collectionId,
    api_pipelines_d_ln as ln,
    api_pipelines_d_log as log,
    api_pipelines_d_sqrt as sqrt,
    api_pipelines_d_trunc as trunc,
    api_pipelines_d_stringReverse as stringReverse,
    api_pipelines_d_length as length,
    api_pipelines_d_abs as abs,
    api_pipelines_d_concat as concat,
    api_pipelines_d_currentTimestamp as currentTimestamp,
    api_pipelines_d_ifAbsent as ifAbsent,
    api_pipelines_d_join as join,
    api_pipelines_d_log10 as log10,
    api_pipelines_d_arraySum as arraySum,
    api_pipelines_d_timestampTruncate as timestampTruncate,
    api_pipelines_d_split as split,
    api_pipelines_d_Expression as Expression,
    api_pipelines_d_AliasedExpression as AliasedExpression,
    api_pipelines_d_Field as Field,
    api_pipelines_d_FunctionExpression as FunctionExpression,
    api_pipelines_d_Ordering as Ordering,
    api_pipelines_d_BooleanExpression as BooleanExpression,
    api_pipelines_d_AggregateFunction as AggregateFunction,
    api_pipelines_d_ExpressionType as ExpressionType,
    api_pipelines_d_AliasedAggregate as AliasedAggregate,
    api_pipelines_d_Selectable as Selectable,
    api_pipelines_d_TimeGranularity as TimeGranularity,
    api_pipelines_d_Type as Type,
    api_pipelines_d__internalPipelineToExecutePipelineRequestProto as _internalPipelineToExecutePipelineRequestProto,
  };
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
 * Calculates the number of documents in the result set of the given query
 * without actually downloading the documents.
 *
 * Using this function to count the documents is efficient because only the
 * final count, not the documents' data, is downloaded. This function can
 * count the documents in cases where the result set is prohibitively large to
 * download entirely (thousands of documents).
 *
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used. Every invocation of this function necessarily involves a round trip to
 * the server.
 *
 * @param query - The query whose result set size is calculated.
 * @returns A Promise that will be resolved with the count; the count can be
 * retrieved from `snapshot.data().count`, where `snapshot` is the
 * `AggregateQuerySnapshot` to which the returned Promise resolves.
 */
declare function getCountFromServer<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<AggregateQuerySnapshot<{
    count: AggregateField<number>;
}, AppModelType, DbModelType>>;
/**
 * Calculates the specified aggregations over the documents in the result
 * set of the given query without actually downloading the documents.
 *
 * Using this function to perform aggregations is efficient because only the
 * final aggregation values, not the documents' data, are downloaded. This
 * function can perform aggregations of the documents in cases where the result
 * set is prohibitively large to download entirely (thousands of documents).
 *
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used. Every invocation of this function necessarily involves a round trip to
 * the server.
 *
 * @param query - The query whose result set is aggregated over.
 * @param aggregateSpec - An `AggregateSpec` object that specifies the aggregates
 * to perform over the result set. The AggregateSpec specifies aliases for each
 * aggregate, which can be used to retrieve the aggregate result.
 * @example
 * ```typescript
 * const aggregateSnapshot = await getAggregateFromServer(query, {
 *   countOfDocs: count(),
 *   totalHours: sum('hours'),
 *   averageScore: average('score')
 * });
 *
 * const countOfDocs: number = aggregateSnapshot.data().countOfDocs;
 * const totalHours: number = aggregateSnapshot.data().totalHours;
 * const averageScore: number | null = aggregateSnapshot.data().averageScore;
 * ```
 */
declare function getAggregateFromServer<AggregateSpecType extends AggregateSpec, AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, aggregateSpec: AggregateSpecType): Promise<AggregateQuerySnapshot<AggregateSpecType, AppModelType, DbModelType>>;

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
 * An options object that can be passed to {@link (onSnapshot:1)} and {@link
 * QuerySnapshot.docChanges} to control which types of changes to include in the
 * result set.
 */
interface SnapshotListenOptions {
    /**
     * Include a change even if only the metadata of the query or of a document
     * changed. Default is false.
     */
    readonly includeMetadataChanges?: boolean;
    /**
     * Set the source the query listens to. Default to "default", which
     * listens to both cache and server.
     */
    readonly source?: ListenSource;
}
/**
 * Describe the source a query listens to.
 *
 * Set to `default` to listen to both cache and server changes. Set to `cache`
 * to listen to changes in cache only.
 */
type ListenSource = 'default' | 'cache';
/**
 * Reads the document referred to by this `DocumentReference`.
 *
 * Note: `getDoc()` attempts to provide up-to-date data when possible by waiting
 * for data from the server, but it may return cached data or fail if you are
 * offline and the server cannot be reached. To specify this behavior, invoke
 * {@link getDocFromCache} or {@link getDocFromServer}.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A `Promise` that resolves with a `DocumentSnapshot` containing the
 * document contents.
 */
declare function getDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
/**
 * Reads the document referred to by this `DocumentReference` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` that resolves with a `DocumentSnapshot` containing the
 * document contents.
 */
declare function getDocFromCache<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
/**
 * Reads the document referred to by this `DocumentReference` from the server.
 * Returns an error if the network is not available.
 *
 * @returns A `Promise` that resolves with a `DocumentSnapshot` containing the
 * document contents.
 */
declare function getDocFromServer<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 *
 * Note: `getDocs()` attempts to provide up-to-date data when possible by
 * waiting for data from the server, but it may return cached data or fail if
 * you are offline and the server cannot be reached. To specify this behavior,
 * invoke {@link getDocsFromCache} or {@link getDocsFromServer}.
 *
 * @returns A `Promise` that resolves with the results of the query.
 */
declare function getDocs<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
/**
 * Executes the query and returns the results as a `QuerySnapshot` from cache.
 * Returns an empty result set if no documents matching the query are currently
 * cached.
 *
 * @returns A `Promise` that resolves with the results of the query.
 */
declare function getDocsFromCache<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
/**
 * Executes the query and returns the results as a `QuerySnapshot` from the
 * server. Returns an error if the network is not available.
 *
 * @returns A `Promise` that resolves with the results of the query.
 */
declare function getDocsFromServer<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
/**
 * Writes to the document referred to by this `DocumentReference`. If the
 * document does not yet exist, it will be created.
 *
 * Note that the returned `Promise` does _not_ resolve until the data is
 * successfully written to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error saving the given
 * data. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately saved to the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * written to the remote Firestore server, a feature of Firestore called
 * "latency compensation". The data will _eventually_ be written to the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @returns A `Promise` that resolves once the data has been successfully
 * written to the backend or rejects once the backend reports an error writing
 * the data.
 */
declare function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): Promise<void>;
/**
 * Writes to the document referred to by the specified `DocumentReference`. If
 * the document does not yet exist, it will be created. If you provide `merge`
 * or `mergeFields`, the provided data can be merged into an existing document.
 *
 * Note that the returned `Promise` does _not_ resolve until the data is
 * successfully written to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error saving the given
 * data. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately saved to the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * written to the remote Firestore server, a feature of Firestore called
 * "latency compensation". The data will _eventually_ be written to the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @param options - An object to configure the set behavior.
 * @returns A `Promise` that resolves once the data has been successfully
 * written to the backend or rejects once the backend reports an error writing
 * the data.
 */
declare function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): Promise<void>;
/**
 * Updates fields in the document referred to by the specified
 * `DocumentReference`. The update will fail if applied to a document that does
 * not exist.
 *
 * Note that the returned `Promise` does _not_ resolve until the data is
 * successfully written to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error saving the given
 * data. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately saved to the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * written to the remote Firestore server, a feature of Firestore called
 * "latency compensation". The data will _eventually_ be written to the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to update.
 * @param data - An object containing the fields and values with which to
 * update the document. Fields can contain dots to reference nested fields
 * within the document.
 * @returns A `Promise` that resolves once the data has been successfully
 * written to the backend or rejects once the backend reports an error writing
 * the data.
 */
declare function updateDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: UpdateData<DbModelType>): Promise<void>;
/**
 * Updates fields in the document referred to by the specified
 * `DocumentReference` The update will fail if applied to a document that does
 * not exist.
 *
 * Nested fields can be updated by providing dot-separated field path
 * strings or by providing `FieldPath` objects.
 *
 * Note that the returned `Promise` does _not_ resolve until the data is
 * successfully written to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error saving the given
 * data. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately saved to the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * written to the remote Firestore server, a feature of Firestore called
 * "latency compensation". The data will _eventually_ be written to the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to update.
 * @param field - The first field to update.
 * @param value - The first value.
 * @param moreFieldsAndValues - Additional key value pairs.
 * @returns A `Promise` that resolves once the data has been successfully
 * written to the backend or rejects once the backend reports an error writing
 * the data.
 */
declare function updateDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): Promise<void>;
/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * Note that the returned `Promise` does _not_ resolve until the document is
 * successfully deleted from the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error deleting the given
 * document. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately deleted from the local cache and will be
 * reflected in future "get" operations as if it had been successfully
 * deleted from the remote Firestore server, a feature of Firestore called
 * "latency compensation". The document will _eventually_ be deleted from the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to delete.
 * @returns A `Promise` that resolves once the document has been successfully
 * deleted from the backend or rejects once the backend reports an error
 * deleting the document.
 */
declare function deleteDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<void>;
/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * Note that the returned `Promise` does _not_ resolve until the document is
 * successfully created to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error creating the given
 * document. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given document _will_ be immediately created in the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * created in the remote Firestore server, a feature of Firestore called
 * "latency compensation". The document will _eventually_ be created in the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @returns A `Promise` that resolves once the docoument has been successfully
 * created in the backend or rejects once the backend reports an error creating
 * the document.
 */
declare function addDoc<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): Promise<DocumentReference<AppModelType, DbModelType>>;
/**
 * A function returned by `onSnapshot()` that removes the listener when invoked.
 */
interface Unsubscribe {
    /** Removes the listener when invoked. */
    (): void;
}
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, observer: {
    next?: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, options: SnapshotListenOptions, observer: {
    next?: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, options: SnapshotListenOptions, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, observer: {
    next?: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, options: SnapshotListenOptions, observer: {
    next?: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, options: SnapshotListenOptions, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events based on data generated by invoking
 * {@link QuerySnapshot.toJSON} You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link QuerySnapshot.toJSON}.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events based on data generated by invoking
 * {@link DocumentSnapshot.toJSON}. You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link DocumentSnapshot.toJSON}.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are
 * never ending.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events based on data generated by invoking
 * {@link QuerySnapshot.toJSON}. You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link QuerySnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, options: SnapshotListenOptions, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events based on data generated by invoking
 * {@link DocumentSnapshot.toJSON}. You may either pass individual `onNext` and `onError` callbacks
 * or pass a single observer object with `next` and `error` callbacks. The listener can be cancelled
 * by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link DocumentSnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, options: SnapshotListenOptions, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events based on QuerySnapshot data generated by invoking
 * {@link QuerySnapshot.toJSON}. You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link QuerySnapshot.toJSON}.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, observer: {
    next: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events based on data generated by invoking
 * {@link DocumentSnapshot.toJSON} You may either pass individual `onNext` and `onError` callbacks
 * or pass a single observer object with `next` and `error` callbacks. The listener can be cancelled
 * by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link DocumentSnapshot.toJSON}.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, observer: {
    next: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events based on QuerySnapshot data generated by invoking
 * {@link QuerySnapshot.toJSON} You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link QuerySnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, options: SnapshotListenOptions, observer: {
    next: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events based on QuerySnapshot data generated by
 * invoking {@link DocumentSnapshot.toJSON} You may either pass individual `onNext` and `onError`
 * callbacks or pass a single observer object with `next` and `error` callbacks. The listener can be
 * cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link DocumentSnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, options: SnapshotListenOptions, observer: {
    next: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for a snapshots-in-sync event. The snapshots-in-sync
 * event indicates that all listeners affected by a given change have fired,
 * even if a single server-generated change affects multiple listeners.
 *
 * NOTE: The snapshots-in-sync event only indicates that listeners are in sync
 * with each other, but does not relate to whether those snapshots are in sync
 * with the server. Use SnapshotMetadata in the individual listeners to
 * determine if a snapshot is from the cache or the server.
 *
 * @param firestore - The instance of Firestore for synchronizing snapshots.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 * listener.
 */
declare function onSnapshotsInSync(firestore: Firestore, observer: {
    next?: (value: void) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for a snapshots-in-sync event. The snapshots-in-sync
 * event indicates that all listeners affected by a given change have fired,
 * even if a single server-generated change affects multiple listeners.
 *
 * NOTE: The snapshots-in-sync event only indicates that listeners are in sync
 * with each other, but does not relate to whether those snapshots are in sync
 * with the server. Use `SnapshotMetadata` in the individual listeners to
 * determine if a snapshot is from the cache or the server.
 *
 * @param firestore - The `Firestore` instance for synchronizing snapshots.
 * @param onSync - A callback to be called every time all snapshot listeners are
 * in sync with each other.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 * listener.
 */
declare function onSnapshotsInSync(firestore: Firestore, onSync: () => void): Unsubscribe;
/**
 * Locally writes `mutations` on the async queue.
 * @internal
 */
declare function executeWrite(firestore: Firestore, mutations: Mutation[]): Promise<void>;

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
 * Converter used by `withConverter()` to transform user objects of type
 * `AppModelType` into Firestore data of type `DbModelType`.
 *
 * Using the converter allows you to specify generic type arguments when
 * storing and retrieving objects from Firestore.
 *
 * In this context, an "AppModel" is a class that is used in an application to
 * package together related information and functionality. Such a class could,
 * for example, have properties with complex, nested data types, properties used
 * for memoization, properties of types not supported by Firestore (such as
 * `symbol` and `bigint`), and helper functions that perform compound
 * operations. Such classes are not suitable and/or possible to store into a
 * Firestore database. Instead, instances of such classes need to be converted
 * to "plain old JavaScript objects" (POJOs) with exclusively primitive
 * properties, potentially nested inside other POJOs or arrays of POJOs. In this
 * context, this type is referred to as the "DbModel" and would be an object
 * suitable for persisting into Firestore. For convenience, applications can
 * implement `FirestoreDataConverter` and register the converter with Firestore
 * objects, such as `DocumentReference` or `Query`, to automatically convert
 * `AppModel` to `DbModel` when storing into Firestore, and convert `DbModel`
 * to `AppModel` when retrieving from Firestore.
 *
 * @example
 *
 * Simple Example
 *
 * ```typescript
 * const numberConverter = {
 *     toFirestore(value: WithFieldValue<number>) {
 *         return { value };
 *     },
 *     fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
 *         return snapshot.data(options).value as number;
 *     }
 * };
 *
 * async function simpleDemo(db: Firestore): Promise<void> {
 *     const documentRef = doc(db, 'values/value123').withConverter(numberConverter);
 *
 *     // converters are used with `setDoc`, `addDoc`, and `getDoc`
 *     await setDoc(documentRef, 42);
 *     const snapshot1 = await getDoc(documentRef);
 *     assertEqual(snapshot1.data(), 42);
 *
 *     // converters are not used when writing data with `updateDoc`
 *     await updateDoc(documentRef, { value: 999 });
 *     const snapshot2 = await getDoc(documentRef);
 *     assertEqual(snapshot2.data(), 999);
 * }
 * ```
 *
 * Advanced Example
 *
 * ```typescript
 * // The Post class is a model that is used by our application.
 * // This class may have properties and methods that are specific
 * // to our application execution, which do not need to be persisted
 * // to Firestore.
 * class Post {
 *     constructor(
 *         readonly title: string,
 *         readonly author: string,
 *         readonly lastUpdatedMillis: number
 *     ) {}
 *     toString(): string {
 *         return `${this.title} by ${this.author}`;
 *     }
 * }
 *
 * // The PostDbModel represents how we want our posts to be stored
 * // in Firestore. This DbModel has different properties (`ttl`,
 * // `aut`, and `lut`) from the Post class we use in our application.
 * interface PostDbModel {
 *     ttl: string;
 *     aut: { firstName: string; lastName: string };
 *     lut: Timestamp;
 * }
 *
 * // The `PostConverter` implements `FirestoreDataConverter` and specifies
 * // how the Firestore SDK can convert `Post` objects to `PostDbModel`
 * // objects and vice versa.
 * class PostConverter implements FirestoreDataConverter<Post, PostDbModel> {
 *     toFirestore(post: WithFieldValue<Post>): WithFieldValue<PostDbModel> {
 *         return {
 *             ttl: post.title,
 *             aut: this._autFromAuthor(post.author),
 *             lut: this._lutFromLastUpdatedMillis(post.lastUpdatedMillis)
 *         };
 *     }
 *
 *     fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Post {
 *         const data = snapshot.data(options) as PostDbModel;
 *         const author = `${data.aut.firstName} ${data.aut.lastName}`;
 *         return new Post(data.ttl, author, data.lut.toMillis());
 *     }
 *
 *     _autFromAuthor(
 *         author: string | FieldValue
 *     ): { firstName: string; lastName: string } | FieldValue {
 *         if (typeof author !== 'string') {
 *             // `author` is a FieldValue, so just return it.
 *             return author;
 *         }
 *         const [firstName, lastName] = author.split(' ');
 *         return {firstName, lastName};
 *     }
 *
 *     _lutFromLastUpdatedMillis(
 *         lastUpdatedMillis: number | FieldValue
 *     ): Timestamp | FieldValue {
 *         if (typeof lastUpdatedMillis !== 'number') {
 *             // `lastUpdatedMillis` must be a FieldValue, so just return it.
 *             return lastUpdatedMillis;
 *         }
 *         return Timestamp.fromMillis(lastUpdatedMillis);
 *     }
 * }
 *
 * async function advancedDemo(db: Firestore): Promise<void> {
 *     // Create a `DocumentReference` with a `FirestoreDataConverter`.
 *     const documentRef = doc(db, 'posts/post123').withConverter(new PostConverter());
 *
 *     // The `data` argument specified to `setDoc()` is type checked by the
 *     // TypeScript compiler to be compatible with `Post`. Since the `data`
 *     // argument is typed as `WithFieldValue<Post>` rather than just `Post`,
 *     // this allows properties of the `data` argument to also be special
 *     // Firestore values that perform server-side mutations, such as
 *     // `arrayRemove()`, `deleteField()`, and `serverTimestamp()`.
 *     await setDoc(documentRef, {
 *         title: 'My Life',
 *         author: 'Foo Bar',
 *         lastUpdatedMillis: serverTimestamp()
 *     });
 *
 *     // The TypeScript compiler will fail to compile if the `data` argument to
 *     // `setDoc()` is _not_ compatible with `WithFieldValue<Post>`. This
 *     // type checking prevents the caller from specifying objects with incorrect
 *     // properties or property values.
 *     // @ts-expect-error "Argument of type { ttl: string; } is not assignable
 *     // to parameter of type WithFieldValue<Post>"
 *     await setDoc(documentRef, { ttl: 'The Title' });
 *
 *     // When retrieving a document with `getDoc()` the `DocumentSnapshot`
 *     // object's `data()` method returns a `Post`, rather than a generic object,
 *     // which would have been returned if the `DocumentReference` did _not_ have a
 *     // `FirestoreDataConverter` attached to it.
 *     const snapshot1: DocumentSnapshot<Post> = await getDoc(documentRef);
 *     const post1: Post = snapshot1.data()!;
 *     if (post1) {
 *         assertEqual(post1.title, 'My Life');
 *         assertEqual(post1.author, 'Foo Bar');
 *     }
 *
 *     // The `data` argument specified to `updateDoc()` is type checked by the
 *     // TypeScript compiler to be compatible with `PostDbModel`. Note that
 *     // unlike `setDoc()`, whose `data` argument must be compatible with `Post`,
 *     // the `data` argument to `updateDoc()` must be compatible with
 *     // `PostDbModel`. Similar to `setDoc()`, since the `data` argument is typed
 *     // as `WithFieldValue<PostDbModel>` rather than just `PostDbModel`, this
 *     // allows properties of the `data` argument to also be those special
 *     // Firestore values, like `arrayRemove()`, `deleteField()`, and
 *     // `serverTimestamp()`.
 *     await updateDoc(documentRef, {
 *         'aut.firstName': 'NewFirstName',
 *         lut: serverTimestamp()
 *     });
 *
 *     // The TypeScript compiler will fail to compile if the `data` argument to
 *     // `updateDoc()` is _not_ compatible with `WithFieldValue<PostDbModel>`.
 *     // This type checking prevents the caller from specifying objects with
 *     // incorrect properties or property values.
 *     // @ts-expect-error "Argument of type { title: string; } is not assignable
 *     // to parameter of type WithFieldValue<PostDbModel>"
 *     await updateDoc(documentRef, { title: 'New Title' });
 *     const snapshot2: DocumentSnapshot<Post> = await getDoc(documentRef);
 *     const post2: Post = snapshot2.data()!;
 *     if (post2) {
 *         assertEqual(post2.title, 'My Life');
 *         assertEqual(post2.author, 'NewFirstName Bar');
 *     }
 * }
 * ```
 */
interface FirestoreDataConverter<AppModelType, DbModelType extends DocumentData = DocumentData> extends FirestoreDataConverter$1<AppModelType, DbModelType> {
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. To use `set()`
     * with `merge` and `mergeFields`, `toFirestore()` must be defined with
     * `PartialWithFieldValue<AppModelType>`.
     *
     * The `WithFieldValue<T>` type extends `T` to also allow FieldValues such as
     * {@link (deleteField:1)} to be used as property values.
     */
    toFirestore(modelObject: WithFieldValue<AppModelType>): WithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. Used with
     * {@link (setDoc:1)}, {@link (WriteBatch.set:1)} and
     * {@link (Transaction.set:1)} with `merge:true` or `mergeFields`.
     *
     * The `PartialWithFieldValue<T>` type extends `Partial<T>` to allow
     * FieldValues such as {@link (arrayUnion:1)} to be used as property values.
     * It also supports nested `Partial` by allowing nested fields to be
     * omitted.
     */
    toFirestore(modelObject: PartialWithFieldValue<AppModelType>, options: SetOptions): PartialWithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert Firestore data into an object of
     * type `AppModelType`. You can access your data by calling:
     * `snapshot.data(options)`.
     *
     * Generally, the data returned from `snapshot.data()` can be cast to
     * `DbModelType`; however, this is not guaranteed because Firestore does not
     * enforce a schema on the database. For example, writes from a previous
     * version of the application or writes from another client that did not use a
     * type converter could have written data with different properties and/or
     * property types. The implementation will need to choose whether to
     * gracefully recover from non-conforming data or throw an error.
     *
     * To override this method, see {@link (FirestoreDataConverter.fromFirestore:1)}.
     *
     * @param snapshot - A `QueryDocumentSnapshot` containing your data and metadata.
     * @param options - The `SnapshotOptions` from the initial call to `data()`.
     */
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions): AppModelType;
}
/**
 * Options that configure how data is retrieved from a `DocumentSnapshot` (for
 * example the desired behavior for server timestamps that have not yet been set
 * to their final value).
 */
interface SnapshotOptions {
    /**
     * If set, controls the return value for server timestamps that have not yet
     * been set to their final value.
     *
     * By specifying 'estimate', pending server timestamps return an estimate
     * based on the local clock. This estimate will differ from the final value
     * and cause these values to change once the server result becomes available.
     *
     * By specifying 'previous', pending timestamps will be ignored and return
     * their previous value instead.
     *
     * If omitted or set to 'none', `null` will be returned by default until the
     * server value becomes available.
     */
    readonly serverTimestamps?: 'estimate' | 'previous' | 'none';
}
/**
 * Metadata about a snapshot, describing the state of the snapshot.
 */
declare class SnapshotMetadata {
    /**
     * True if the snapshot contains the result of local writes (for example
     * `set()` or `update()` calls) that have not yet been committed to the
     * backend. If your listener has opted into metadata updates (via
     * `SnapshotListenOptions`) you will receive another snapshot with
     * `hasPendingWrites` equal to false once the writes have been committed to
     * the backend.
     */
    readonly hasPendingWrites: boolean;
    /**
     * True if the snapshot was created from cached data rather than guaranteed
     * up-to-date server data. If your listener has opted into metadata updates
     * (via `SnapshotListenOptions`) you will receive another snapshot with
     * `fromCache` set to false once the client has received up-to-date data from
     * the backend.
     */
    readonly fromCache: boolean;
    /** @hideconstructor */
    constructor(hasPendingWrites: boolean, fromCache: boolean);
    /**
     * Returns true if this `SnapshotMetadata` is equal to the provided one.
     *
     * @param other - The `SnapshotMetadata` to compare against.
     * @returns true if this `SnapshotMetadata` is equal to the provided one.
     */
    isEqual(other: SnapshotMetadata): boolean;
}
/**
 * The type of a `DocumentChange` may be 'added', 'removed', or 'modified'.
 */
type DocumentChangeType = 'added' | 'removed' | 'modified';
/**
 * A `DocumentChange` represents a change to the documents matching a query.
 * It contains the document affected and the type of change that occurred.
 */
interface DocumentChange<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /** The type of change ('added', 'modified', or 'removed'). */
    readonly type: DocumentChangeType;
    /** The document affected by this change. */
    readonly doc: QueryDocumentSnapshot<AppModelType, DbModelType>;
    /**
     * The index of the changed document in the result set immediately prior to
     * this `DocumentChange` (i.e. supposing that all prior `DocumentChange` objects
     * have been applied). Is `-1` for 'added' events.
     */
    readonly oldIndex: number;
    /**
     * The index of the changed document in the result set immediately after
     * this `DocumentChange` (i.e. supposing that all prior `DocumentChange`
     * objects and the current `DocumentChange` object have been applied).
     * Is -1 for 'removed' events.
     */
    readonly newIndex: number;
}
/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */
declare class DocumentSnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> extends DocumentSnapshot$1<AppModelType, DbModelType> {
    readonly _firestore: Firestore;
    private readonly _firestoreImpl;
    /**
     *  Metadata about the `DocumentSnapshot`, including information about its
     *  source and local modifications.
     */
    readonly metadata: SnapshotMetadata;
    /** @hideconstructor protected */
    constructor(_firestore: Firestore, userDataWriter: AbstractUserDataWriter, key: DocumentKey, document: Document | null, metadata: SnapshotMetadata, converter: UntypedFirestoreDataConverter<AppModelType, DbModelType> | null);
    /**
     * Returns whether or not the data exists. True if the document exists.
     */
    exists(): this is QueryDocumentSnapshot<AppModelType, DbModelType>;
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document or `undefined` if
     * the document doesn't exist.
     */
    data(options?: SnapshotOptions): AppModelType | undefined;
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * By default, a `serverTimestamp()` that has not yet been set to
     * its final value will be returned as `null`. You can override this by
     * passing an options object.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @param options - An options object to configure how the field is retrieved
     * from the snapshot (for example the desired behavior for server timestamps
     * that have not yet been set to their final value).
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    get(fieldPath: string | FieldPath, options?: SnapshotOptions): any;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        bundleSource: Property<"string">;
        bundleName: Property<"string">;
        bundle: Property<"string">;
    };
    /**
     * Returns a JSON-serializable representation of this `DocumentSnapshot` instance.
     *
     * @returns a JSON representation of this object.  Throws a {@link FirestoreError} if this
     * `DocumentSnapshot` has pending writes.
     */
    toJSON(): object;
}
/**
 * Builds a `DocumentSnapshot` instance from a JSON object created by
 * {@link DocumentSnapshot.toJSON}.
 *
 * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
 * @param json - a JSON object represention of a `DocumentSnapshot` instance.
 * @returns an instance of {@link DocumentSnapshot} if the JSON object could be
 * parsed. Throws a {@link FirestoreError} if an error occurs.
 */
declare function documentSnapshotFromJSON(db: Firestore, json: object): DocumentSnapshot;
/**
 * Builds a `DocumentSnapshot` instance from a JSON object created by
 * {@link DocumentSnapshot.toJSON}.
 *
 * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
 * @param json - a JSON object represention of a `DocumentSnapshot` instance.
 * @param converter - Converts objects to and from Firestore.
 * @returns an instance of {@link DocumentSnapshot} if the JSON object could be
 * parsed. Throws a {@link FirestoreError} if an error occurs.
 */
declare function documentSnapshotFromJSON<AppModelType, DbModelType extends DocumentData = DocumentData>(db: Firestore, json: object, converter: FirestoreDataConverter<AppModelType, DbModelType>): DocumentSnapshot<AppModelType, DbModelType>;
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
declare class QueryDocumentSnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> extends DocumentSnapshot<AppModelType, DbModelType> {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @override
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document.
     */
    data(options?: SnapshotOptions): AppModelType;
}
/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
declare class QuerySnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    readonly _firestore: Firestore;
    readonly _userDataWriter: AbstractUserDataWriter;
    readonly _snapshot: ViewSnapshot;
    /**
     * Metadata about this snapshot, concerning its source and if it has local
     * modifications.
     */
    readonly metadata: SnapshotMetadata;
    /**
     * The query on which you called `get` or `onSnapshot` in order to get this
     * `QuerySnapshot`.
     */
    readonly query: Query<AppModelType, DbModelType>;
    private _cachedChanges?;
    private _cachedChangesIncludeMetadataChanges?;
    /** @hideconstructor */
    constructor(_firestore: Firestore, _userDataWriter: AbstractUserDataWriter, query: Query<AppModelType, DbModelType>, _snapshot: ViewSnapshot);
    /** An array of all the documents in the `QuerySnapshot`. */
    get docs(): Array<QueryDocumentSnapshot<AppModelType, DbModelType>>;
    /** The number of documents in the `QuerySnapshot`. */
    get size(): number;
    /** True if there are no documents in the `QuerySnapshot`. */
    get empty(): boolean;
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */
    forEach(callback: (result: QueryDocumentSnapshot<AppModelType, DbModelType>) => void, thisArg?: unknown): void;
    /**
     * Returns an array of the documents changes since the last snapshot. If this
     * is the first snapshot, all documents will be in the list as 'added'
     * changes.
     *
     * @param options - `SnapshotListenOptions` that control whether metadata-only
     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
     * snapshot events.
     */
    docChanges(options?: SnapshotListenOptions): Array<DocumentChange<AppModelType, DbModelType>>;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        bundleSource: Property<"string">;
        bundleName: Property<"string">;
        bundle: Property<"string">;
    };
    /**
     * Returns a JSON-serializable representation of this `QuerySnapshot` instance.
     *
     * @returns a JSON representation of this object. Throws a {@link FirestoreError} if this
     * `QuerySnapshot` has pending writes.
     */
    toJSON(): object;
}
/**
 * Builds a `QuerySnapshot` instance from a JSON object created by
 * {@link QuerySnapshot.toJSON}.
 *
 * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
 * @param json - a JSON object represention of a `QuerySnapshot` instance.
 * @returns an instance of {@link QuerySnapshot} if the JSON object could be
 * parsed. Throws a {@link FirestoreError} if an error occurs.
 */
declare function querySnapshotFromJSON(db: Firestore, json: object): QuerySnapshot;
/**
 * Builds a `QuerySnapshot` instance from a JSON object created by
 * {@link QuerySnapshot.toJSON}.
 *
 * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
 * @param json - a JSON object represention of a `QuerySnapshot` instance.
 * @param converter - Converts objects to and from Firestore.
 * @returns an instance of {@link QuerySnapshot} if the JSON object could be
 * parsed. Throws a {@link FirestoreError} if an error occurs.
 */
declare function querySnapshotFromJSON<AppModelType, DbModelType extends DocumentData = DocumentData>(db: Firestore, json: object, converter: FirestoreDataConverter<AppModelType, DbModelType>): QuerySnapshot<AppModelType, DbModelType>;
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
declare function snapshotEqual<AppModelType, DbModelType extends DocumentData>(left: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>, right: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>): boolean;

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

/** Describes the different query constraints available in this SDK. */
type QueryConstraintType = 'where' | 'orderBy' | 'limit' | 'limitToLast' | 'startAt' | 'startAfter' | 'endAt' | 'endBefore';
/**
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */
declare abstract class AppliableConstraint {
    /**
     * Takes the provided {@link Query} and returns a copy of the {@link Query} with this
     * {@link AppliableConstraint} applied.
     */
    abstract _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */
declare abstract class QueryConstraint extends AppliableConstraint {
    /** The type of this query constraint */
    abstract readonly type: QueryConstraintType;
    /**
     * Takes the provided {@link Query} and returns a copy of the {@link Query} with this
     * {@link AppliableConstraint} applied.
     */
    abstract _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * Creates a new immutable instance of {@link Query} that is extended to also
 * include additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new
 * constraints.
 * @param compositeFilter - The {@link QueryCompositeFilterConstraint} to
 * apply. Create {@link QueryCompositeFilterConstraint} using {@link and} or
 * {@link or}.
 * @param queryConstraints - Additional {@link QueryNonFilterConstraint}s to
 * apply (e.g. {@link orderBy}, {@link limit}).
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
declare function query<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, compositeFilter: QueryCompositeFilterConstraint, ...queryConstraints: QueryNonFilterConstraint[]): Query<AppModelType, DbModelType>;
/**
 * Creates a new immutable instance of {@link Query} that is extended to also
 * include additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new
 * constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
declare function query<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, ...queryConstraints: QueryConstraint[]): Query<AppModelType, DbModelType>;
/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */
declare class QueryFieldFilterConstraint extends QueryConstraint {
    private readonly _field;
    private _op;
    private _value;
    /** The type of this query constraint */
    readonly type = "where";
    /**
     * @internal
     */
    protected constructor(_field: FieldPath$1, _op: Operator, _value: unknown);
    static _create(_field: FieldPath$1, _op: Operator, _value: unknown): QueryFieldFilterConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
    _parse<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): FieldFilter;
}
/**
 * Filter conditions in a {@link where} clause are specified using the
 * strings '&lt;', '&lt;=', '==', '!=', '&gt;=', '&gt;', 'array-contains', 'in',
 * 'array-contains-any', and 'not-in'.
 */
type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
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
declare function where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown): QueryFieldFilterConstraint;
/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */
declare class QueryCompositeFilterConstraint extends AppliableConstraint {
    /** The type of this query constraint */
    readonly type: 'or' | 'and';
    private readonly _queryConstraints;
    /**
     * @internal
     */
    protected constructor(
    /** The type of this query constraint */
    type: 'or' | 'and', _queryConstraints: QueryFilterConstraint[]);
    static _create(type: 'or' | 'and', _queryConstraints: QueryFilterConstraint[]): QueryCompositeFilterConstraint;
    _parse<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Filter;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
    _getQueryConstraints(): readonly AppliableConstraint[];
    _getOperator(): CompositeOperator;
}
/**
 * `QueryNonFilterConstraint` is a helper union type that represents
 * QueryConstraints which are used to narrow or order the set of documents,
 * but that do not explicitly filter on a document field.
 * `QueryNonFilterConstraint`s are created by invoking {@link orderBy},
 * {@link (startAt:1)}, {@link (startAfter:1)}, {@link (endBefore:1)}, {@link (endAt:1)},
 * {@link limit} or {@link limitToLast} and can then be passed to {@link (query:1)}
 * to create a new query instance that also contains the `QueryConstraint`.
 */
type QueryNonFilterConstraint = QueryOrderByConstraint | QueryLimitConstraint | QueryStartAtConstraint | QueryEndAtConstraint;
/**
 * `QueryFilterConstraint` is a helper union type that represents
 * {@link QueryFieldFilterConstraint} and {@link QueryCompositeFilterConstraint}.
 */
type QueryFilterConstraint = QueryFieldFilterConstraint | QueryCompositeFilterConstraint;
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
declare function or(...queryConstraints: QueryFilterConstraint[]): QueryCompositeFilterConstraint;
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
declare function and(...queryConstraints: QueryFilterConstraint[]): QueryCompositeFilterConstraint;
/**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */
declare class QueryOrderByConstraint extends QueryConstraint {
    private readonly _field;
    private _direction;
    /** The type of this query constraint */
    readonly type = "orderBy";
    /**
     * @internal
     */
    protected constructor(_field: FieldPath$1, _direction: Direction);
    static _create(_field: FieldPath$1, _direction: Direction): QueryOrderByConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * The direction of a {@link orderBy} clause is specified as 'desc' or 'asc'
 * (descending or ascending).
 */
type OrderByDirection = 'desc' | 'asc';
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
declare function orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): QueryOrderByConstraint;
/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */
declare class QueryLimitConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type: 'limit' | 'limitToLast';
    private readonly _limit;
    private readonly _limitType;
    /**
     * @internal
     */
    protected constructor(
    /** The type of this query constraint */
    type: 'limit' | 'limitToLast', _limit: number, _limitType: LimitType$1);
    static _create(type: 'limit' | 'limitToLast', _limit: number, _limitType: LimitType$1): QueryLimitConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */
declare function limit(limit: number): QueryLimitConstraint;
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
declare function limitToLast(limit: number): QueryLimitConstraint;
/**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */
declare class QueryStartAtConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type: 'startAt' | 'startAfter';
    private readonly _docOrFields;
    private readonly _inclusive;
    /**
     * @internal
     */
    protected constructor(
    /** The type of this query constraint */
    type: 'startAt' | 'startAfter', _docOrFields: Array<unknown | DocumentSnapshot$1<unknown>>, _inclusive: boolean);
    static _create(type: 'startAt' | 'startAfter', _docOrFields: Array<unknown | DocumentSnapshot$1<unknown>>, _inclusive: boolean): QueryStartAtConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start at the provided document (inclusive). The starting position is relative
 * to the order of the query. The document must contain all of the fields
 * provided in the `orderBy` of this query.
 *
 * @param snapshot - The snapshot of the document to start at.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`.
 */
declare function startAt<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot$1<AppModelType, DbModelType>): QueryStartAtConstraint;
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start at the provided fields relative to the order of the query. The order of
 * the field values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to start this query at, in order
 * of the query's order by.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`.
 */
declare function startAt(...fieldValues: unknown[]): QueryStartAtConstraint;
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start after the provided document (exclusive). The starting position is
 * relative to the order of the query. The document must contain all of the
 * fields provided in the orderBy of the query.
 *
 * @param snapshot - The snapshot of the document to start after.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`
 */
declare function startAfter<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot$1<AppModelType, DbModelType>): QueryStartAtConstraint;
/**
 * Creates a {@link QueryStartAtConstraint} that modifies the result set to
 * start after the provided fields relative to the order of the query. The order
 * of the field values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to start this query after, in order
 * of the query's order by.
 * @returns A {@link QueryStartAtConstraint} to pass to `query()`
 */
declare function startAfter(...fieldValues: unknown[]): QueryStartAtConstraint;
/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */
declare class QueryEndAtConstraint extends QueryConstraint {
    /** The type of this query constraint */
    readonly type: 'endBefore' | 'endAt';
    private readonly _docOrFields;
    private readonly _inclusive;
    /**
     * @internal
     */
    protected constructor(
    /** The type of this query constraint */
    type: 'endBefore' | 'endAt', _docOrFields: Array<unknown | DocumentSnapshot$1<unknown>>, _inclusive: boolean);
    static _create(type: 'endBefore' | 'endAt', _docOrFields: Array<unknown | DocumentSnapshot$1<unknown>>, _inclusive: boolean): QueryEndAtConstraint;
    _apply<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Query<AppModelType, DbModelType>;
}
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end
 * before the provided document (exclusive). The end position is relative to the
 * order of the query. The document must contain all of the fields provided in
 * the orderBy of the query.
 *
 * @param snapshot - The snapshot of the document to end before.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
declare function endBefore<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot$1<AppModelType, DbModelType>): QueryEndAtConstraint;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end
 * before the provided fields relative to the order of the query. The order of
 * the field values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to end this query before, in order
 * of the query's order by.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
declare function endBefore(...fieldValues: unknown[]): QueryEndAtConstraint;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end at
 * the provided document (inclusive). The end position is relative to the order
 * of the query. The document must contain all of the fields provided in the
 * orderBy of the query.
 *
 * @param snapshot - The snapshot of the document to end at.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
declare function endAt<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot$1<AppModelType, DbModelType>): QueryEndAtConstraint;
/**
 * Creates a {@link QueryEndAtConstraint} that modifies the result set to end at
 * the provided fields relative to the order of the query. The order of the field
 * values must match the order of the order by clauses of the query.
 *
 * @param fieldValues - The field values to end this query at, in order
 * of the query's order by.
 * @returns A {@link QueryEndAtConstraint} to pass to `query()`
 */
declare function endAt(...fieldValues: unknown[]): QueryEndAtConstraint;

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
 * Options to customize transaction behavior.
 */
declare interface TransactionOptions {
    /** Maximum number of attempts to commit, after which transaction fails. Default is 5. */
    readonly maxAttempts?: number;
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
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
declare class Transaction$1 {
    protected readonly _firestore: Firestore$1;
    private readonly _transaction;
    private readonly _dataReader;
    /** @hideconstructor */
    constructor(_firestore: Firestore$1, _transaction: Transaction$2);
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */
    get<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot$1<AppModelType, DbModelType>>;
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     *
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @throws Error - If the provided input is not a valid Firestore document.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): this;
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     * If you provide `merge` or `mergeFields`, the provided data can be merged
     * into an existing document.
     *
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @param options - An object to configure the set behavior.
     * @throws Error - If the provided input is not a valid Firestore document.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): this;
    /**
     * Updates fields in the document referred to by the provided {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     *
     * @param documentRef - A reference to the document to be updated.
     * @param data - An object containing the fields and values with which to
     * update the document. Fields can contain dots to reference nested fields
     * within the document.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: UpdateData<DbModelType>): this;
    /**
     * Updates fields in the document referred to by the provided {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     *
     * Nested fields can be updated by providing dot-separated field path
     * strings or by providing `FieldPath` objects.
     *
     * @param documentRef - A reference to the document to be updated.
     * @param field - The first field to update.
     * @param value - The first value.
     * @param moreFieldsAndValues - Additional key/value pairs.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): this;
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    delete<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>): this;
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
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
declare class Transaction extends Transaction$1 {
    protected readonly _firestore: Firestore;
    /** @hideconstructor */
    constructor(_firestore: Firestore, _transaction: Transaction$2);
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */
    get<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
}
/**
 * Executes the given `updateFunction` and then attempts to commit the changes
 * applied within the transaction. If any document read within the transaction
 * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
 * commit after 5 attempts, the transaction fails.
 *
 * The maximum number of writes allowed in a single transaction is 500.
 *
 * @param firestore - A reference to the Firestore database to run this
 * transaction against.
 * @param updateFunction - The function to execute within the transaction
 * context.
 * @param options - An options object to configure maximum number of attempts to
 * commit.
 * @returns If the transaction completed successfully or was explicitly aborted
 * (the `updateFunction` returned a failed promise), the promise returned by the
 * `updateFunction `is returned here. Otherwise, if the transaction failed, a
 * rejected promise with the corresponding failure error is returned.
 */
declare function runTransaction<T>(firestore: Firestore, updateFunction: (transaction: Transaction) => Promise<T>, options?: TransactionOptions): Promise<T>;

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
declare function deleteField(): FieldValue;
/**
 * Returns a sentinel used with {@link @firebase/firestore/lite#(setDoc:1)} or {@link @firebase/firestore/lite#(updateDoc:1)} to
 * include a server-generated timestamp in the written data.
 */
declare function serverTimestamp(): FieldValue;
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
declare function arrayUnion(...elements: unknown[]): FieldValue;
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
declare function arrayRemove(...elements: unknown[]): FieldValue;
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
declare function increment(n: number): FieldValue;
/**
 * Creates a new `VectorValue` constructed with a copy of the given array of numbers.
 *
 * @param values - Create a `VectorValue` instance with a copy of this array of numbers.
 *
 * @returns A new `VectorValue` constructed with a copy of the given array of numbers.
 */
declare function vector(values?: number[]): VectorValue;

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
declare function setLogLevel(logLevel: LogLevelString): void;
/**
 * @internal
 */
declare function logWarn(msg: string, ...obj: unknown[]): void;

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
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `WriteBatch` object can be acquired by calling {@link writeBatch}. It
 * provides methods for adding writes to the write batch. None of the writes
 * will be committed (or visible locally) until {@link WriteBatch.commit} is
 * called.
 */
declare class WriteBatch {
    private readonly _firestore;
    private readonly _commitHandler;
    private readonly _dataReader;
    private _mutations;
    private _committed;
    /** @hideconstructor */
    constructor(_firestore: Firestore$1, _commitHandler: (m: Mutation[]) => Promise<void>);
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     *
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): WriteBatch;
    /**
     * Writes to the document referred to by the provided {@link
     * DocumentReference}. If the document does not exist yet, it will be created.
     * If you provide `merge` or `mergeFields`, the provided data can be merged
     * into an existing document.
     *
     * @param documentRef - A reference to the document to be set.
     * @param data - An object of the fields and values for the document.
     * @param options - An object to configure the set behavior.
     * @throws Error - If the provided input is not a valid Firestore document.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    set<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): WriteBatch;
    /**
     * Updates fields in the document referred to by the provided {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     *
     * @param documentRef - A reference to the document to be updated.
     * @param data - An object containing the fields and values with which to
     * update the document. Fields can contain dots to reference nested fields
     * within the document.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, data: UpdateData<DbModelType>): WriteBatch;
    /**
     * Updates fields in the document referred to by this {@link
     * DocumentReference}. The update will fail if applied to a document that does
     * not exist.
     *
     * Nested fields can be update by providing dot-separated field path strings
     * or by providing `FieldPath` objects.
     *
     * @param documentRef - A reference to the document to be updated.
     * @param field - The first field to update.
     * @param value - The first value.
     * @param moreFieldsAndValues - Additional key value pairs.
     * @throws Error - If the provided input is not valid Firestore data.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    update<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): WriteBatch;
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    delete<AppModelType, DbModelType extends DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>): WriteBatch;
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * The result of these writes will only be reflected in document reads that
     * occur after the returned promise resolves. If the client is offline, the
     * write fails. If you would like to see local modifications or buffer writes
     * until the client is online, use the full Firestore SDK.
     *
     * @returns A `Promise` resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit (note that it won't
     * resolve while you're offline).
     */
    commit(): Promise<void>;
    private _verifyNotCommitted;
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
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single {@link WriteBatch}
 * is 500.
 *
 * Unlike transactions, write batches are persisted offline and therefore are
 * preferable when you don't need to condition your writes on read data.
 *
 * @returns A {@link WriteBatch} that can be used to atomically execute multiple
 * writes.
 */
declare function writeBatch(firestore: Firestore): WriteBatch;

/**
 * @license
 * Copyright 2021 Google LLC
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
 * A single field element in an index configuration.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
interface IndexField {
    /** The field path to index. */
    readonly fieldPath: string;
    /**
     * What type of array index to create. Set to `CONTAINS` for `array-contains`
     * and `array-contains-any` indexes.
     *
     * Only one of `arrayConfig` or `order` should be set;
     */
    readonly arrayConfig?: 'CONTAINS';
    /**
     * What type of array index to create. Set to `ASCENDING` or 'DESCENDING` for
     * `==`, `!=`, `<=`, `<=`, `in` and `not-in` filters.
     *
     * Only one of `arrayConfig` or `order` should be set.
     */
    readonly order?: 'ASCENDING' | 'DESCENDING';
    [key: string]: unknown;
}
/**
 * The SDK definition of a Firestore index.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
interface Index {
    /** The ID of the collection to index. */
    readonly collectionGroup: string;
    /** A list of fields to index. */
    readonly fields?: IndexField[];
    [key: string]: unknown;
}
/**
 * A list of Firestore indexes to speed up local query execution.
 *
 * See {@link https://firebase.google.com/docs/reference/firestore/indexes/#json_format | JSON Format}
 * for a description of the format of the index definition.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
interface IndexConfiguration {
    /** A list of all Firestore indexes. */
    readonly indexes?: Index[];
    [key: string]: unknown;
}
/**
 * Configures indexing for local query execution. Any previous index
 * configuration is overridden. The `Promise` resolves once the index
 * configuration has been persisted.
 *
 * The index entries themselves are created asynchronously. You can continue to
 * use queries that require indexing even if the indices are not yet available.
 * Query execution will automatically start using the index once the index
 * entries have been written.
 *
 * Indexes are only supported with IndexedDb persistence. If IndexedDb is not
 * enabled, any index configuration is ignored.
 *
 * @param firestore - The {@link Firestore} instance to configure indexes for.
 * @param configuration -The index definition.
 * @throws FirestoreError if the JSON format is invalid.
 * @returns A `Promise` that resolves once all indices are successfully
 * configured.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
declare function setIndexConfiguration(firestore: Firestore, configuration: IndexConfiguration): Promise<void>;
/**
 * Configures indexing for local query execution. Any previous index
 * configuration is overridden. The `Promise` resolves once the index
 * configuration has been persisted.
 *
 * The index entries themselves are created asynchronously. You can continue to
 * use queries that require indexing even if the indices are not yet available.
 * Query execution will automatically start using the index once the index
 * entries have been written.
 *
 * Indexes are only supported with IndexedDb persistence. Invoke either
 * `enableIndexedDbPersistence()` or `enableMultiTabIndexedDbPersistence()`
 * before setting an index configuration. If IndexedDb is not enabled, any
 * index configuration is ignored.
 *
 * The method accepts the JSON format exported by the Firebase CLI (`firebase
 * firestore:indexes`). If the JSON format is invalid, this method throws an
 * error.
 *
 * @param firestore - The {@link Firestore} instance to configure indexes for.
 * @param json -The JSON format exported by the Firebase CLI.
 * @throws FirestoreError if the JSON format is invalid.
 * @returns A `Promise` that resolves once all indices are successfully
 * configured.
 *
 * @deprecated Instead of creating cache indexes manually, consider using
 * `enablePersistentCacheIndexAutoCreation()` to let the SDK decide whether to
 * create cache indexes for queries running locally.
 *
 * @beta
 */
declare function setIndexConfiguration(firestore: Firestore, json: string): Promise<void>;

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
 * A `PersistentCacheIndexManager` for configuring persistent cache indexes used
 * for local query execution.
 *
 * To use, call `getPersistentCacheIndexManager()` to get an instance.
 */
declare class PersistentCacheIndexManager {
    readonly _firestore: Firestore;
    /** A type string to uniquely identify instances of this class. */
    readonly type: 'PersistentCacheIndexManager';
    /** @hideconstructor */
    constructor(_firestore: Firestore);
}
/**
 * Returns the PersistentCache Index Manager used by the given `Firestore`
 * object.
 *
 * @returns The `PersistentCacheIndexManager` instance, or `null` if local
 * persistent storage is not in use.
 */
declare function getPersistentCacheIndexManager(firestore: Firestore): PersistentCacheIndexManager | null;
/**
 * Enables the SDK to create persistent cache indexes automatically for local
 * query execution when the SDK believes cache indexes can help improve
 * performance.
 *
 * This feature is disabled by default.
 */
declare function enablePersistentCacheIndexAutoCreation(indexManager: PersistentCacheIndexManager): void;
/**
 * Stops creating persistent cache indexes automatically for local query
 * execution. The indexes which have been created by calling
 * `enablePersistentCacheIndexAutoCreation()` still take effect.
 */
declare function disablePersistentCacheIndexAutoCreation(indexManager: PersistentCacheIndexManager): void;
/**
 * Removes all persistent cache indexes.
 *
 * Please note this function will also deletes indexes generated by
 * `setIndexConfiguration()`, which is deprecated.
 */
declare function deleteAllPersistentCacheIndexes(indexManager: PersistentCacheIndexManager): void;

/**
 * True if and only if the Base64 conversion functions are available.
 * @internal
 */
declare function isBase64Available(): boolean;

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
 * Validates that two boolean options are not set at the same time.
 * @internal
 */
declare function validateIsNotUsedTogether(optionName1: string, argument1: boolean | undefined, optionName2: string, argument2: boolean | undefined): void;
/**
 * Casts `obj` to `T`, optionally unwrapping Compat types to expose the
 * underlying instance. Throws if  `obj` is not an instance of `T`.
 *
 * This cast is used in the Lite and Full SDK to verify instance types for
 * arguments passed to the public API.
 * @internal
 */
declare function cast<T>(obj: object, constructor: {
    new (...args: any[]): T;
}): T | never;

/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * The code of callsites invoking this function are stripped out in production
 * builds. Any side-effects of code within the debugAssert() invocation will not
 * happen in this case.
 *
 * @internal
 */
declare function debugAssert(assertion: boolean, message: string): asserts assertion;

/**
 * Information about an existence filter mismatch.
 * @internal
 */
interface ExistenceFilterMismatchInfo {
    /** The number of documents that matched the query in the local cache. */
    localCacheCount: number;
    /**
     * The number of documents that matched the query on the server, as specified
     * in the ExistenceFilter message's `count` field.
     */
    existenceFilterCount: number;
    /**
     * The projectId used when checking documents for membership in the bloom
     * filter.
     */
    projectId: string;
    /**
     * The databaseId used when checking documents for membership in the bloom
     * filter.
     */
    databaseId: string;
    /**
     * Information about the bloom filter provided by Watch in the ExistenceFilter
     * message's `unchangedNames` field. If this property is omitted or undefined
     * then that means that Watch did _not_ provide a bloom filter.
     */
    bloomFilter?: {
        /**
         * Whether a full requery was averted by using the bloom filter. If false,
         * then something happened, such as a false positive, to prevent using the
         * bloom filter to avoid a full requery.
         */
        applied: boolean;
        /** The number of hash functions used in the bloom filter. */
        hashCount: number;
        /** The number of bytes in the bloom filter's bitmask. */
        bitmapLength: number;
        /** The number of bits of padding in the last byte of the bloom filter. */
        padding: number;
        /**
         * Tests the given string for membership in the bloom filter created from
         * the existence filter; will be undefined if creating the bloom filter
         * failed.
         */
        mightContain?: (value: string) => boolean;
    };
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
 * Testing hooks for use by Firestore's integration test suite to reach into the
 * SDK internals to validate logic and behavior that is not visible from the
 * public API surface.
 *
 * @internal
 */
declare class TestingHooks {
    private constructor();
    /**
     * Registers a callback to be notified when an existence filter mismatch
     * occurs in the Watch listen stream.
     *
     * The relative order in which callbacks are notified is unspecified; do not
     * rely on any particular ordering. If a given callback is registered multiple
     * times then it will be notified multiple times, once per registration.
     *
     * @param callback - the callback to invoke upon existence filter mismatch.
     *
     * @returns a function that, when called, unregisters the given callback; only
     * the first invocation of the returned function does anything; all subsequent
     * invocations do nothing.
     */
    static onExistenceFilterMismatch(callback: ExistenceFilterMismatchCallback): Unsubscribe;
}
/**
 * The signature of callbacks registered with
 * `TestingUtils.onExistenceFilterMismatch()`.
 *
 * The return value, if any, is ignored.
 *
 * @internal
 */
type ExistenceFilterMismatchCallback = (info: ExistenceFilterMismatchInfo) => unknown;

export { AbstractUserDataWriter, AddPrefixToKeys, AggregateField, AggregateFieldType, AggregateQuerySnapshot, AggregateSpec, AggregateSpecData, AggregateType, AuthTokenFactory, Bytes, CACHE_SIZE_UNLIMITED, ChildUpdateFields, CollectionReference, DocumentChange, DocumentChangeType, DocumentData, DocumentReference, DocumentSnapshot, EmulatorMockTokenOptions, ExperimentalLongPollingOptions, FieldPath, FieldValue, Firestore, FirestoreDataConverter, FirestoreError, FirestoreErrorCode, FirestoreLocalCache, FirestoreSettings, FirstPartyCredentialsSettings, GeoPoint, Index, IndexConfiguration, IndexField, ListenSource, LoadBundleTask, LoadBundleTaskProgress, LogLevelString as LogLevel, MemoryCacheSettings, MemoryEagerGarbageCollector, MemoryGarbageCollector, MemoryLocalCache, MemoryLruGarbageCollector, NestedUpdateFields, OrderByDirection, PartialWithFieldValue, PersistenceSettings, PersistentCacheIndexManager, PersistentCacheSettings, PersistentLocalCache, PersistentMultipleTabManager, PersistentSingleTabManager, PersistentSingleTabManagerSettings, PersistentTabManager, Primitive, PrivateSettings, Timestamp as ProtoTimestamp, Query, QueryCompositeFilterConstraint, QueryConstraint, QueryConstraintType, QueryDocumentSnapshot, QueryEndAtConstraint, QueryFieldFilterConstraint, QueryFilterConstraint, QueryLimitConstraint, QueryNonFilterConstraint, QueryOrderByConstraint, QuerySnapshot, QueryStartAtConstraint, SetOptions, SnapshotListenOptions, SnapshotMetadata, SnapshotOptions, TaskState, Timestamp$1 as Timestamp, Transaction, TransactionOptions, UnionToIntersection, Unsubscribe, UpdateData, VectorValue, WhereFilterOp, WithFieldValue, WriteBatch, AutoId as _AutoId, ByteString as _ByteString, DatabaseId as _DatabaseId, DocumentKey as _DocumentKey, EmptyAppCheckTokenProvider as _EmptyAppCheckTokenProvider, EmptyAuthCredentialsProvider as _EmptyAuthCredentialsProvider, FieldPath$1 as _FieldPath, ResourcePath as _ResourcePath, TestingHooks as _TestingHooks, ExistenceFilterMismatchCallback as _TestingHooksExistenceFilterMismatchCallback, ExistenceFilterMismatchInfo as _TestingHooksExistenceFilterMismatchInfo, cast as _cast, debugAssert as _debugAssert, _internalAggregationQueryToProtoRunAggregationQueryRequest, _internalQueryToProtoQueryTarget, isBase64Available as _isBase64Available, logWarn as _logWarn, validateIsNotUsedTogether as _validateIsNotUsedTogether, addDoc, aggregateFieldEqual, aggregateQuerySnapshotEqual, and, arrayRemove, arrayUnion, average, clearIndexedDbPersistence, collection, collectionGroup, connectFirestoreEmulator, count, deleteAllPersistentCacheIndexes, deleteDoc, deleteField, disableNetwork, disablePersistentCacheIndexAutoCreation, doc, documentId$1 as documentId, documentSnapshotFromJSON, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, enableNetwork, enablePersistentCacheIndexAutoCreation, endAt, endBefore, ensureFirestoreConfigured, executeWrite, firestoreV1ApiClientInterfaces, getAggregateFromServer, getCountFromServer, getDoc, getDocFromCache, getDocFromServer, getDocs, getDocsFromCache, getDocsFromServer, getFirestore, getPersistentCacheIndexManager, increment, initializeFirestore, limit, limitToLast, loadBundle, memoryEagerGarbageCollector, memoryLocalCache, memoryLruGarbageCollector, namedQuery, onSnapshot, onSnapshotResume, onSnapshotsInSync, or, orderBy, persistentLocalCache, persistentMultipleTabManager, persistentSingleTabManager, api_pipelines_d as pipelines, query, queryEqual, querySnapshotFromJSON, refEqual, runTransaction, serverTimestamp, setDoc, setIndexConfiguration, setLogLevel, snapshotEqual, startAfter, startAt, sum, terminate, updateDoc, vector, waitForPendingWrites, where, writeBatch };
