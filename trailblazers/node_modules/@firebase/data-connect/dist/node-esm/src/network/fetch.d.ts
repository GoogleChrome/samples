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
import { CallerSdkType, DataConnectResponse } from './transport';
export declare function initializeFetch(fetchImpl: typeof fetch): void;
export interface DataConnectFetchBody<T> {
    name: string;
    operationName: string;
    variables: T;
}
export declare function dcFetch<T, U>(url: string, body: DataConnectFetchBody<U>, { signal }: AbortController, appId: string | null | undefined, accessToken: string | null, appCheckToken: string | null | undefined, _isUsingGen: boolean, _callerSdkType: CallerSdkType, _isUsingEmulator: boolean): Promise<DataConnectResponse<T>>;
