/**
 * @license
 * Copyright 2025 Google LLC
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
import { Persistence } from '../../model/public_types';
import { PersistenceInternal, PersistenceType, PersistenceValue, StorageEventListener } from '../../core/persistence';
export declare class CookiePersistence implements PersistenceInternal {
    static type: 'COOKIE';
    readonly type = PersistenceType.COOKIE;
    listenerUnsubscribes: Map<StorageEventListener, () => void>;
    _getFinalTarget(originalUrl: string): URL | string;
    _isAvailable(): Promise<boolean>;
    _set(_key: string, _value: PersistenceValue): Promise<void>;
    _get<T extends PersistenceValue>(key: string): Promise<T | null>;
    _remove(key: string): Promise<void>;
    _addListener(key: string, listener: StorageEventListener): void;
    _removeListener(_key: string, listener: StorageEventListener): void;
}
/**
 * An implementation of {@link Persistence} of type `COOKIE`, for use on the client side in
 * applications leveraging hybrid rendering and middleware.
 *
 * @remarks This persistence method requires companion middleware to function, such as that provided
 * by {@link https://firebaseopensource.com/projects/firebaseextended/reactfire/ | ReactFire} for
 * NextJS.
 * @beta
 */
export declare const browserCookiePersistence: Persistence;
