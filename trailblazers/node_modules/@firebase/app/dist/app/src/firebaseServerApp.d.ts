/**
 * @license
 * Copyright 2023 Google LLC
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
import { FirebaseServerApp, FirebaseServerAppSettings, FirebaseOptions } from './public-types';
import { ComponentContainer } from '@firebase/component';
import { FirebaseAppImpl } from './firebaseApp';
export declare class FirebaseServerAppImpl extends FirebaseAppImpl implements FirebaseServerApp {
    private readonly _serverConfig;
    private _finalizationRegistry;
    private _refCount;
    constructor(options: FirebaseOptions | FirebaseAppImpl, serverConfig: FirebaseServerAppSettings, name: string, container: ComponentContainer);
    toJSON(): undefined;
    get refCount(): number;
    incRefCount(obj: object | undefined): void;
    decRefCount(): number;
    private automaticCleanup;
    get settings(): FirebaseServerAppSettings;
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    protected checkDestroyed(): void;
}
