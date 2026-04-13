/**
 * Firebase Data Connect
 *
 * @packageDocumentation
 */
import { FirebaseApp } from '@firebase/app';
import { AppCheckInternalComponentName } from '@firebase/app-check-interop-types';
import { FirebaseAuthInternalName } from '@firebase/auth-interop-types';
import { Provider } from '@firebase/component';
import { LogLevelString } from '@firebase/logger';
import { FirebaseError } from '@firebase/util';


export declare interface CacheProvider<T extends StorageType> {
    type: T;
}
export declare interface CacheSettings {
    cacheProvider: CacheProvider<StorageType>;
    maxAgeSeconds?: number;
}
/**
 * enum representing different flavors of the SDK used by developers
 * use the CallerSdkType for type-checking, and the CallerSdkTypeEnum for value-checking/assigning
 */
export declare type CallerSdkType = 'Base' | 'Generated' | 'TanstackReactCore' | 'GeneratedReact' | 'TanstackAngularCore' | 'GeneratedAngular';
export declare const CallerSdkTypeEnum: {
    readonly Base: "Base";
    readonly Generated: "Generated";
    readonly TanstackReactCore: "TanstackReactCore";
    readonly GeneratedReact: "GeneratedReact";
    readonly TanstackAngularCore: "TanstackAngularCore";
    readonly GeneratedAngular: "GeneratedAngular";
};
export declare type Code = DataConnectErrorCode;
export declare const Code: {
    OTHER: DataConnectErrorCode;
    ALREADY_INITIALIZED: DataConnectErrorCode;
    NOT_INITIALIZED: DataConnectErrorCode;
    NOT_SUPPORTED: DataConnectErrorCode;
    INVALID_ARGUMENT: DataConnectErrorCode;
    PARTIAL_ERROR: DataConnectErrorCode;
    UNAUTHORIZED: DataConnectErrorCode;
};
/**
 * Connect to the DataConnect Emulator
 * @param dc Data Connect instance
 * @param host host of emulator server
 * @param port port of emulator server
 * @param sslEnabled use https
 */
export declare function connectDataConnectEmulator(dc: DataConnect, host: string, port?: number, sslEnabled?: boolean): void;
/**
 * Connector Config for calling Data Connect backend.
 */
export declare interface ConnectorConfig {
    location: string;
    connector: string;
    service: string;
}
/**
 * Class representing Firebase Data Connect
 */
export declare class DataConnect {
    readonly app: FirebaseApp;
    private readonly dataConnectOptions;
    isEmulator: boolean;
    /* Excluded from this release type: cache */
    constructor(app: FirebaseApp, dataConnectOptions: DataConnectOptions, _authProvider: Provider<FirebaseAuthInternalName>, _appCheckProvider: Provider<AppCheckInternalComponentName>);
    getSettings(): ConnectorConfig;
    /* Excluded from this release type: setCacheSettings */
    setInitialized(): void;
    enableEmulator(transportOptions: TransportOptions): void;
}
export declare interface DataConnectEntityArray {
    entityIds: string[];
}
/** An error returned by a DataConnect operation. */
export declare class DataConnectError extends FirebaseError {
    /* Excluded from this release type: name */
    constructor(code: Code, message: string);
}
export declare type DataConnectErrorCode = 'other' | 'already-initialized' | 'not-initialized' | 'not-supported' | 'invalid-argument' | 'partial-error' | 'unauthorized';
export declare type DataConnectExtension = {
    path: Array<string | number>;
} & (DataConnectEntityArray | DataConnectSingleEntity);
/* Excluded from this release type: DataConnectExtensionWithMaxAge */
/* Excluded from this release type: DataConnectMaxAge */
/** An error returned by a DataConnect operation. */
export declare class DataConnectOperationError extends DataConnectError {
    /* Excluded from this release type: name */
    /** The response received from the backend. */
    readonly response: DataConnectOperationFailureResponse;
    private constructor();
}
export declare interface DataConnectOperationFailureResponse {
    readonly data?: Record<string, unknown> | null;
    readonly errors: DataConnectOperationFailureResponseErrorInfo[];
}
export declare interface DataConnectOperationFailureResponseErrorInfo {
    readonly message: string;
    readonly path: Array<string | number>;
}
/**
 * DataConnectOptions including project id
 */
export declare interface DataConnectOptions extends ConnectorConfig {
    projectId: string;
}
/* Excluded from this release type: DataConnectResponseWithMaxAge */
export declare interface DataConnectResult<Data, Variables> extends OpResult<Data> {
    ref: OperationRef<Data, Variables>;
}
export declare interface DataConnectSettings {
    cacheSettings?: CacheSettings;
}
export declare interface DataConnectSingleEntity {
    entityId: string;
}
/**
 * Representation of user provided subscription options.
 */
export declare interface DataConnectSubscription<Data, Variables> {
    userCallback: OnResultSubscription<Data, Variables>;
    errCallback?: (e?: DataConnectError) => void;
    unsubscribe: () => void;
}
/* Excluded from this release type: DataConnectTransport */
export declare type DataSource = typeof SOURCE_CACHE | typeof SOURCE_SERVER;
/**
 * Execute Mutation
 * @param mutationRef mutation to execute
 * @returns `MutationRef`
 */
export declare function executeMutation<Data, Variables>(mutationRef: MutationRef<Data, Variables>): MutationPromise<Data, Variables>;
/**
 * Execute Query
 * @param queryRef query to execute.
 * @returns `QueryPromise`
 */
export declare function executeQuery<Data, Variables>(queryRef: QueryRef<Data, Variables>, options?: ExecuteQueryOptions): QueryPromise<Data, Variables>;
/**
 * Options for executing a query.
 */
export declare interface ExecuteQueryOptions {
    fetchPolicy: QueryFetchPolicy;
}
export declare interface Extensions {
    dataConnect?: DataConnectExtension[];
}
/**
 * Initialize DataConnect instance
 * @param options ConnectorConfig
 */
export declare function getDataConnect(options: ConnectorConfig, settings?: DataConnectSettings): DataConnect;
export declare function getDataConnect(options: ConnectorConfig): DataConnect;
/**
 * Initialize DataConnect instance
 * @param app FirebaseApp to initialize to.
 * @param connectorConfig ConnectorConfig
 */
export declare function getDataConnect(app: FirebaseApp, connectorConfig: ConnectorConfig): DataConnect;
/**
 * Initialize DataConnect instance
 * @param app FirebaseApp to initialize to.
 * @param connectorConfig ConnectorConfig
 */
export declare function getDataConnect(app: FirebaseApp, connectorConfig: ConnectorConfig, settings: DataConnectSettings): DataConnect;
/* Excluded from this release type: InternalQueryResult */
export declare function makeMemoryCacheProvider(): CacheProvider<'MEMORY'>;
export declare const MUTATION_STR = "mutation";
/* Excluded from this release type: MutationManager */
/**
 * Mutation return value from `executeMutation`
 */
export declare interface MutationPromise<Data, Variables> extends Promise<MutationResult<Data, Variables>> {
}
export declare interface MutationRef<Data, Variables> extends OperationRef<Data, Variables> {
    refType: typeof MUTATION_STR;
}
/**
 * Creates a `MutationRef`
 * @param dcInstance Data Connect instance
 * @param mutationName name of mutation
 */
export declare function mutationRef<Data>(dcInstance: DataConnect, mutationName: string): MutationRef<Data, undefined>;
/**
 *
 * @param dcInstance Data Connect instance
 * @param mutationName name of mutation
 * @param variables variables to send with mutation
 */
export declare function mutationRef<Data, Variables>(dcInstance: DataConnect, mutationName: string, variables: Variables): MutationRef<Data, Variables>;
/**
 * Mutation Result from `executeMutation`
 */
export declare interface MutationResult<Data, Variables> extends DataConnectResult<Data, Variables> {
    ref: MutationRef<Data, Variables>;
}
/**
 * `OnCompleteSubscription`
 */
export declare type OnCompleteSubscription = () => void;
/**
 * Signature for `OnErrorSubscription` for `subscribe`
 */
export declare type OnErrorSubscription = (err?: DataConnectError) => void;
/**
 * Signature for `OnResultSubscription` for `subscribe`
 */
export declare type OnResultSubscription<Data, Variables> = (res: QueryResult<Data, Variables>) => void;
export declare interface OperationRef<_Data, Variables> {
    name: string;
    variables: Variables;
    refType: ReferenceType;
    dataConnect: DataConnect;
}
export declare interface OpResult<Data> {
    data: Data;
    source: DataSource;
    fetchTime: string;
    extensions?: Extensions;
}
/* Excluded from this release type: parseOptions */
export declare const QUERY_STR = "query";
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
export declare const QueryFetchPolicy: {
    readonly PREFER_CACHE: "PREFER_CACHE";
    readonly CACHE_ONLY: "CACHE_ONLY";
    readonly SERVER_ONLY: "SERVER_ONLY";
};
export declare type QueryFetchPolicy = (typeof QueryFetchPolicy)[keyof typeof QueryFetchPolicy];
/**
 * Promise returned from `executeQuery`
 */
export declare interface QueryPromise<Data, Variables> extends Promise<QueryResult<Data, Variables>> {
}
/**
 * QueryRef object
 */
export declare interface QueryRef<Data, Variables> extends OperationRef<Data, Variables> {
    refType: typeof QUERY_STR;
}
/**
 * Execute Query
 * @param dcInstance Data Connect instance to use.
 * @param queryName Query to execute
 * @returns `QueryRef`
 */
export declare function queryRef<Data>(dcInstance: DataConnect, queryName: string): QueryRef<Data, undefined>;
/**
 * Execute Query
 * @param dcInstance Data Connect instance to use.
 * @param queryName Query to execute
 * @param variables Variables to execute with
 * @returns `QueryRef`
 */
export declare function queryRef<Data, Variables>(dcInstance: DataConnect, queryName: string, variables: Variables): QueryRef<Data, Variables>;
/**
 * Result of `executeQuery`
 */
export declare interface QueryResult<Data, Variables> extends DataConnectResult<Data, Variables> {
    ref: QueryRef<Data, Variables>;
    toJSON: () => SerializedRef<Data, Variables>;
}
/**
 * Signature for unsubscribe from `subscribe`
 */
export declare type QueryUnsubscribe = () => void;
export declare type ReferenceType = typeof QUERY_STR | typeof MUTATION_STR;
/**
 * Serialized RefInfo as a result of `QueryResult.toJSON().refInfo`
 */
export declare interface RefInfo<Variables> {
    name: string;
    variables: Variables;
    connectorConfig: DataConnectOptions;
}
/**
 * Serialized Ref as a result of `QueryResult.toJSON()`
 */
export declare interface SerializedRef<Data, Variables> extends OpResult<Data> {
    refInfo: RefInfo<Variables>;
}
export declare function setLogLevel(logLevel: LogLevelString): void;
export declare const SOURCE_CACHE = "CACHE";
export declare const SOURCE_SERVER = "SERVER";
export declare const StorageType: {
    readonly MEMORY: "MEMORY";
};
export declare type StorageType = (typeof StorageType)[keyof typeof StorageType];
/**
 * Subscribe to a `QueryRef`
 * @param queryRefOrSerializedResult query ref or serialized result.
 * @param observer observer object to use for subscribing.
 * @returns `SubscriptionOptions`
 */
export declare function subscribe<Data, Variables>(queryRefOrSerializedResult: QueryRef<Data, Variables> | SerializedRef<Data, Variables>, observer: SubscriptionOptions<Data, Variables>): QueryUnsubscribe;
/**
 * Subscribe to a `QueryRef`
 * @param queryRefOrSerializedResult query ref or serialized result.
 * @param onNext Callback to call when result comes back.
 * @param onError Callback to call when error gets thrown.
 * @param onComplete Called when subscription completes.
 * @returns `SubscriptionOptions`
 */
export declare function subscribe<Data, Variables>(queryRefOrSerializedResult: QueryRef<Data, Variables> | SerializedRef<Data, Variables>, onNext: OnResultSubscription<Data, Variables>, onError?: OnErrorSubscription, onComplete?: OnCompleteSubscription): QueryUnsubscribe;
/**
 * Representation of full observer options in `subscribe`
 */
export declare interface SubscriptionOptions<Data, Variables> {
    onNext?: OnResultSubscription<Data, Variables>;
    onErr?: OnErrorSubscription;
    onComplete?: OnCompleteSubscription;
}
/**
 * Delete DataConnect instance
 * @param dataConnect DataConnect instance
 * @returns
 */
export declare function terminate(dataConnect: DataConnect): Promise<void>;
/**
 * Converts serialized ref to query ref
 * @param serializedRef ref to convert to `QueryRef`
 * @returns `QueryRef`
 */
export declare function toQueryRef<Data, Variables>(serializedRef: SerializedRef<Data, Variables>): QueryRef<Data, Variables>;
/* Excluded from this release type: TransportClass */
/**
 * Options to connect to emulator
 */
export declare interface TransportOptions {
    host: string;
    sslEnabled?: boolean;
    port?: number;
}
/* Excluded from this release type: validateArgs */
/* Excluded from this release type: validateArgsWithOptions */
/* Excluded from this release type: validateDCOptions */
export {};
