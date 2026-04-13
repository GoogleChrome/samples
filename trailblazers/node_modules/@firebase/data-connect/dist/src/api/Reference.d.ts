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
import { Extensions } from '../network';
import { DataConnect, DataConnectOptions } from './DataConnect';
export declare const QUERY_STR = "query";
export declare const MUTATION_STR = "mutation";
export type ReferenceType = typeof QUERY_STR | typeof MUTATION_STR;
export declare const SOURCE_SERVER = "SERVER";
export declare const SOURCE_CACHE = "CACHE";
export type DataSource = typeof SOURCE_CACHE | typeof SOURCE_SERVER;
export interface OpResult<Data> {
    data: Data;
    source: DataSource;
    fetchTime: string;
    extensions?: Extensions;
}
export interface OperationRef<_Data, Variables> {
    name: string;
    variables: Variables;
    refType: ReferenceType;
    dataConnect: DataConnect;
}
export interface DataConnectResult<Data, Variables> extends OpResult<Data> {
    ref: OperationRef<Data, Variables>;
}
/**
 * Serialized RefInfo as a result of `QueryResult.toJSON().refInfo`
 */
export interface RefInfo<Variables> {
    name: string;
    variables: Variables;
    connectorConfig: DataConnectOptions;
}
/**
 * Serialized Ref as a result of `QueryResult.toJSON()`
 */
export interface SerializedRef<Data, Variables> extends OpResult<Data> {
    refInfo: RefInfo<Variables>;
}
