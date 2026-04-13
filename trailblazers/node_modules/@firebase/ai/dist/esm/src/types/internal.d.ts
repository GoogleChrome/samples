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
import { AppCheckTokenResult } from '@firebase/app-check-interop-types';
import { FirebaseAuthTokenData } from '@firebase/auth-interop-types';
import { Backend } from '../backend';
import { InferenceMode } from './enums';
export * from './imagen/internal';
export interface ApiSettings {
    apiKey: string;
    project: string;
    appId: string;
    automaticDataCollectionEnabled?: boolean;
    /**
     * @deprecated Use `backend.location` instead.
     */
    location: string;
    backend: Backend;
    getAuthToken?: () => Promise<FirebaseAuthTokenData | null>;
    getAppCheckToken?: () => Promise<AppCheckTokenResult>;
    inferenceMode?: InferenceMode;
}
