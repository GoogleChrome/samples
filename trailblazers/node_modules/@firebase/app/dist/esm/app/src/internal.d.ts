/**
 * @license
 * Copyright 2019 Google LLC
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
import { FirebaseApp, FirebaseAppSettings, FirebaseServerAppSettings, FirebaseOptions, FirebaseServerApp } from './public-types';
import { Component, Provider, Name } from '@firebase/component';
import { DEFAULT_ENTRY_NAME } from './constants';
/**
 * @internal
 */
export declare const _apps: Map<string, FirebaseApp>;
/**
 * @internal
 */
export declare const _serverApps: Map<string, FirebaseServerApp>;
/**
 * Registered components.
 *
 * @internal
 */
export declare const _components: Map<string, Component<any>>;
/**
 * @param component - the component being added to this app's container
 *
 * @internal
 */
export declare function _addComponent<T extends Name>(app: FirebaseApp, component: Component<T>): void;
/**
 *
 * @internal
 */
export declare function _addOrOverwriteComponent(app: FirebaseApp, component: Component): void;
/**
 *
 * @param component - the component to register
 * @returns whether or not the component is registered successfully
 *
 * @internal
 */
export declare function _registerComponent<T extends Name>(component: Component<T>): boolean;
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 *
 * @returns the provider for the service with the matching name
 *
 * @internal
 */
export declare function _getProvider<T extends Name>(app: FirebaseApp, name: T): Provider<T>;
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 * @param instanceIdentifier - service instance identifier in case the service supports multiple instances
 *
 * @internal
 */
export declare function _removeServiceInstance<T extends Name>(app: FirebaseApp, name: T, instanceIdentifier?: string): void;
/**
 *
 * @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
 *
 * @returns true if the provide object is of type FirebaseApp.
 *
 * @internal
 */
export declare function _isFirebaseApp(obj: FirebaseApp | FirebaseOptions | FirebaseAppSettings): obj is FirebaseApp;
/**
 *
 * @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
 *
 * @returns true if the provided object is of type FirebaseServerAppImpl.
 *
 * @internal
 */
export declare function _isFirebaseServerAppSettings(obj: FirebaseApp | FirebaseOptions | FirebaseAppSettings): obj is FirebaseServerAppSettings;
/**
 *
 * @param obj - an object of type FirebaseApp.
 *
 * @returns true if the provided object is of type FirebaseServerAppImpl.
 *
 * @internal
 */
export declare function _isFirebaseServerApp(obj: FirebaseApp | FirebaseServerApp | null | undefined): obj is FirebaseServerApp;
/**
 * Test only
 *
 * @internal
 */
export declare function _clearComponents(): void;
/**
 * Exported in order to be used in app-compat package
 */
export { DEFAULT_ENTRY_NAME as _DEFAULT_ENTRY_NAME };
