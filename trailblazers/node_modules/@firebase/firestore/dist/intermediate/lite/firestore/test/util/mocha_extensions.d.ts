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
type tOrSkipT<T> = T | (T extends {
    skip: unknown;
} ? T['skip'] : T);
interface ExtendMochaTypeWithHelpers<T> {
    skipEmulator: tOrSkipT<T>;
    skipEnterprise: tOrSkipT<T>;
    skipClassic: tOrSkipT<T>;
}
declare module 'mocha' {
    interface TestFunction extends ExtendMochaTypeWithHelpers<TestFunction> {
    }
    interface PendingTestFunction extends ExtendMochaTypeWithHelpers<PendingTestFunction> {
    }
    interface SuiteFunction extends ExtendMochaTypeWithHelpers<SuiteFunction> {
    }
    interface PendingSuiteFunction extends ExtendMochaTypeWithHelpers<PendingTestFunction> {
    }
}
export declare function mixinSkipImplementations(obj: unknown): void;
declare const it: import("mocha").TestFunction;
declare const describe: import("mocha").SuiteFunction;
export { it, describe };
