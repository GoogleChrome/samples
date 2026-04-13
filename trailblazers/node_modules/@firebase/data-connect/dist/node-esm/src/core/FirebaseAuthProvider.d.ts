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
import { FirebaseOptions } from '@firebase/app-types';
import { FirebaseAuthInternal, FirebaseAuthInternalName, FirebaseAuthTokenData } from '@firebase/auth-interop-types';
import { Provider } from '@firebase/component';
export interface AuthTokenProvider {
    getToken(forceRefresh: boolean): Promise<FirebaseAuthTokenData | null>;
    addTokenChangeListener(listener: AuthTokenListener): void;
    getAuth(): FirebaseAuthInternal;
}
export type AuthTokenListener = (token: string | null) => void;
export declare class FirebaseAuthProvider implements AuthTokenProvider {
    private _appName;
    private _options;
    private _authProvider;
    private _auth;
    constructor(_appName: string, _options: FirebaseOptions, _authProvider: Provider<FirebaseAuthInternalName>);
    getAuth(): FirebaseAuthInternal;
    getToken(forceRefresh: boolean): Promise<FirebaseAuthTokenData | null>;
    addTokenChangeListener(listener: AuthTokenListener): void;
    removeTokenChangeListener(listener: (token: string | null) => void): void;
}
