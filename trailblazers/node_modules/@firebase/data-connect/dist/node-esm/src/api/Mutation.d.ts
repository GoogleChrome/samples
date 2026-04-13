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
import { DataConnectTransport } from '../network/transport';
import { DataConnect } from './DataConnect';
import { DataConnectResult, MUTATION_STR, OperationRef } from './Reference';
export interface MutationRef<Data, Variables> extends OperationRef<Data, Variables> {
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
 * @internal
 */
export declare class MutationManager {
    private _transport;
    private _inflight;
    constructor(_transport: DataConnectTransport);
    executeMutation<Data, Variables>(mutationRef: MutationRef<Data, Variables>): MutationPromise<Data, Variables>;
}
/**
 * Mutation Result from `executeMutation`
 */
export interface MutationResult<Data, Variables> extends DataConnectResult<Data, Variables> {
    ref: MutationRef<Data, Variables>;
}
/**
 * Mutation return value from `executeMutation`
 */
export interface MutationPromise<Data, Variables> extends Promise<MutationResult<Data, Variables>> {
}
/**
 * Execute Mutation
 * @param mutationRef mutation to execute
 * @returns `MutationRef`
 */
export declare function executeMutation<Data, Variables>(mutationRef: MutationRef<Data, Variables>): MutationPromise<Data, Variables>;
