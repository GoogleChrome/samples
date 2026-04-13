/**
 * @beta
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
import type { Pipeline } from './pipeline';
/**
 * @beta
 * Options defining Pipeline execution.
 */
export interface PipelineExecuteOptions {
    /**
     * @beta
     * Pipeline to be evaluated.
     */
    pipeline: Pipeline;
    /**
     * @beta
     * Specify the index mode.
     */
    indexMode?: 'recommended';
    /**
     * @beta
     * An escape hatch to set options not known at SDK build time. These values
     * will be passed directly to the Firestore backend and not used by the SDK.
     *
     * The option name will be used as provided. And must match the name
     * format used by the backend (hint: use a snake_case_name).
     *
     * Custom option values can be any type supported
     * by Firestore (for example: string, boolean, number, map, …). Value types
     * not known to the SDK will be rejected.
     *
     * Values specified in rawOptions will take precedence over any options
     * with the same name set by the SDK.
     *
     * @example
     * Override the `example_option`:
     * ```
     *   execute({
     *     pipeline: myPipeline,
     *     rawOptions: {
     *       // Override `example_option`. This will not
     *       // merge with the existing `example_option` object.
     *       "example_option": {
     *         foo: "bar"
     *       }
     *     }
     *   }
     * ```
     *
     * `rawOptions` supports dot notation, if you want to override
     * a nested option.
     * ```
     *   execute({
     *     pipeline: myPipeline,
     *     rawOptions: {
     *       // Override `example_option.foo` and do not override
     *       // any other properties of `example_option`.
     *       "example_option.foo": "bar"
     *     }
     *   }
     * ```
     */
    rawOptions?: {
        [name: string]: unknown;
    };
}
