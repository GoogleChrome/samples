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
import { FirebaseError } from '@firebase/util';
export type DataConnectErrorCode = 'other' | 'already-initialized' | 'not-initialized' | 'not-supported' | 'invalid-argument' | 'partial-error' | 'unauthorized';
export type Code = DataConnectErrorCode;
export declare const Code: {
    OTHER: DataConnectErrorCode;
    ALREADY_INITIALIZED: DataConnectErrorCode;
    NOT_INITIALIZED: DataConnectErrorCode;
    NOT_SUPPORTED: DataConnectErrorCode;
    INVALID_ARGUMENT: DataConnectErrorCode;
    PARTIAL_ERROR: DataConnectErrorCode;
    UNAUTHORIZED: DataConnectErrorCode;
};
/** An error returned by a DataConnect operation. */
export declare class DataConnectError extends FirebaseError {
    /** @internal */
    readonly name: string;
    constructor(code: Code, message: string);
    /** @internal */
    toString(): string;
}
/** An error returned by a DataConnect operation. */
export declare class DataConnectOperationError extends DataConnectError {
    /** @internal */
    readonly name: string;
    /** The response received from the backend. */
    readonly response: DataConnectOperationFailureResponse;
    /** @hideconstructor */
    constructor(message: string, response: DataConnectOperationFailureResponse);
}
export interface DataConnectOperationFailureResponse {
    readonly data?: Record<string, unknown> | null;
    readonly errors: DataConnectOperationFailureResponseErrorInfo[];
}
export interface DataConnectOperationFailureResponseErrorInfo {
    readonly message: string;
    readonly path: Array<string | number>;
}
