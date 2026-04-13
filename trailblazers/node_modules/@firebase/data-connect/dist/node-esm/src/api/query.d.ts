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
import { ExecuteQueryOptions } from '../core/query/queryOptions';
import { DataConnectExtensionWithMaxAge } from '../network/transport';
import { DataConnect } from './DataConnect';
import { OperationRef, QUERY_STR, DataConnectResult, SerializedRef } from './Reference';
/**
 * QueryRef object
 */
export interface QueryRef<Data, Variables> extends OperationRef<Data, Variables> {
    refType: typeof QUERY_STR;
}
/** @internal */
export type InternalQueryResult<Data, Variables> = QueryResult<Data, Variables> & Omit<DataConnectResult<Data, Variables>, 'extensions'> & {
    extensions?: {
        dataConnect?: DataConnectExtensionWithMaxAge[];
    };
};
/**
 * Result of `executeQuery`
 */
export interface QueryResult<Data, Variables> extends DataConnectResult<Data, Variables> {
    ref: QueryRef<Data, Variables>;
    toJSON: () => SerializedRef<Data, Variables>;
}
/**
 * Promise returned from `executeQuery`
 */
export interface QueryPromise<Data, Variables> extends Promise<QueryResult<Data, Variables>> {
}
/**
 * Execute Query
 * @param queryRef query to execute.
 * @returns `QueryPromise`
 */
export declare function executeQuery<Data, Variables>(queryRef: QueryRef<Data, Variables>, options?: ExecuteQueryOptions): QueryPromise<Data, Variables>;
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
 * Converts serialized ref to query ref
 * @param serializedRef ref to convert to `QueryRef`
 * @returns `QueryRef`
 */
export declare function toQueryRef<Data, Variables>(serializedRef: SerializedRef<Data, Variables>): QueryRef<Data, Variables>;
