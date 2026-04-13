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
import { CallerSdkType, DataConnectResponse, DataConnectTransport } from '.';
export declare class RESTTransport implements DataConnectTransport {
    private apiKey?;
    private appId?;
    private authProvider?;
    private appCheckProvider?;
    private _isUsingGen;
    private _callerSdkType;
    private _host;
    private _port;
    private _location;
    private _connectorName;
    private _secure;
    private _project;
    private _serviceName;
    private _accessToken;
    private _appCheckToken;
    private _lastToken;
    private _isUsingEmulator;
    constructor(options: DataConnectOptions, apiKey?: string | undefined, appId?: (string | null) | undefined, authProvider?: AuthTokenProvider | undefined, appCheckProvider?: AppCheckTokenProvider | undefined, transportOptions?: TransportOptions | undefined, _isUsingGen?: boolean, _callerSdkType?: CallerSdkType);
    get endpointUrl(): string;
    useEmulator(host: string, port?: number, isSecure?: boolean): void;
    onTokenChanged(newToken: string | null): void;
    getWithAuth(forceToken?: boolean): Promise<string | null>;
    _setLastToken(lastToken: string | null): void;
    withRetry<T>(promiseFactory: () => Promise<DataConnectResponse<T>>, retry?: boolean): Promise<DataConnectResponse<T>>;
    invokeQuery: <T, U>(queryName: string, body?: U) => Promise<DataConnectResponse<T>>;
    invokeMutation: <T, U>(queryName: string, body?: U) => Promise<DataConnectResponse<T>>;
    _setCallerSdkType(callerSdkType: CallerSdkType): void;
}
