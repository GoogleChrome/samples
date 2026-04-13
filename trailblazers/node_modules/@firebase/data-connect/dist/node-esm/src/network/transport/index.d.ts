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
import { DataConnectOptions, TransportOptions } from '../../api/DataConnect';
import { AppCheckTokenProvider } from '../../core/AppCheckTokenProvider';
import { AuthTokenProvider } from '../../core/FirebaseAuthProvider';
/**
 * enum representing different flavors of the SDK used by developers
 * use the CallerSdkType for type-checking, and the CallerSdkTypeEnum for value-checking/assigning
 */
export type CallerSdkType = 'Base' | 'Generated' | 'TanstackReactCore' | 'GeneratedReact' | 'TanstackAngularCore' | 'GeneratedAngular';
export declare const CallerSdkTypeEnum: {
    readonly Base: "Base";
    readonly Generated: "Generated";
    readonly TanstackReactCore: "TanstackReactCore";
    readonly GeneratedReact: "GeneratedReact";
    readonly TanstackAngularCore: "TanstackAngularCore";
    readonly GeneratedAngular: "GeneratedAngular";
};
export interface DataConnectEntityArray {
    entityIds: string[];
}
export interface DataConnectSingleEntity {
    entityId: string;
}
export type DataConnectExtension = {
    path: Array<string | number>;
} & (DataConnectEntityArray | DataConnectSingleEntity);
/** @internal */
export interface DataConnectMaxAge {
    maxAge: string;
}
/** @internal */
export type DataConnectExtensionWithMaxAge = {
    path: Array<string | number>;
} & (DataConnectEntityArray | DataConnectSingleEntity | DataConnectMaxAge);
export interface Extensions {
    dataConnect?: DataConnectExtension[];
}
/** @internal */
export interface ExtensionsWithMaxAge {
    dataConnect?: DataConnectExtensionWithMaxAge[];
}
export interface DataConnectResponse<T> {
    data: T;
    errors: Error[];
    extensions: Extensions;
}
/** @internal */
export interface DataConnectResponseWithMaxAge<T> {
    data: T;
    errors: Error[];
    extensions: ExtensionsWithMaxAge;
}
/**
 * @internal
 */
export interface DataConnectTransport {
    invokeQuery<T, U>(queryName: string, body?: U): Promise<DataConnectResponseWithMaxAge<T>>;
    invokeMutation<T, U>(queryName: string, body?: U): Promise<DataConnectResponse<T>>;
    useEmulator(host: string, port?: number, sslEnabled?: boolean): void;
    onTokenChanged: (token: string | null) => void;
    _setCallerSdkType(callerSdkType: CallerSdkType): void;
}
/**
 * @internal
 */
export type TransportClass = new (options: DataConnectOptions, apiKey?: string, appId?: string, authProvider?: AuthTokenProvider, appCheckProvider?: AppCheckTokenProvider, transportOptions?: TransportOptions, _isUsingGen?: boolean, _callerSdkType?: CallerSdkType) => DataConnectTransport;
