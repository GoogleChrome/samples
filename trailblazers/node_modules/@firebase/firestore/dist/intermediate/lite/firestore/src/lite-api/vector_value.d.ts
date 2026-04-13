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
import { Property } from '../util/json_validation';
/**
 * Represents a vector type in Firestore documents.
 * Create an instance with <code>{@link vector}</code>.
 */
export declare class VectorValue {
    private readonly _values;
    /**
     * @private
     * @internal
     */
    constructor(values: number[] | undefined);
    /**
     * Returns a copy of the raw number array form of the vector.
     */
    toArray(): number[];
    /**
     * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
     */
    isEqual(other: VectorValue): boolean;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        vectorValues: Property<"object">;
    };
    /**
     * Returns a JSON-serializable representation of this `VectorValue` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON(): object;
    /**
     * Builds a `VectorValue` instance from a JSON object created by {@link VectorValue.toJSON}.
     *
     * @param json - a JSON object represention of a `VectorValue` instance.
     * @returns an instance of {@link VectorValue} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(json: object): VectorValue;
}
