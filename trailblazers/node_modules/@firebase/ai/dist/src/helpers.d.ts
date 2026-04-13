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
import { Backend } from './backend';
/**
 * Encodes a {@link Backend} into a string that will be used to uniquely identify {@link AI}
 * instances by backend type.
 *
 * @internal
 */
export declare function encodeInstanceIdentifier(backend: Backend): string;
/**
 * Decodes an instance identifier string into a {@link Backend}.
 *
 * @internal
 */
export declare function decodeInstanceIdentifier(instanceIdentifier: string): Backend;
