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
/**
 * A list of data types Firestore objects may serialize in their toJSON implemenetations.
 * @private
 * @internal
 */
export type JsonTypeDesc = 'object' | 'string' | 'number' | 'boolean' | 'null' | 'undefined';
/**
 * An association of JsonTypeDesc values to their native types.
 * @private
 * @internal
 */
export type TSType<T extends JsonTypeDesc> = T extends 'object' ? object : T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : T extends 'null' ? null : T extends 'undefined' ? undefined : never;
/**
 * The representation of a JSON object property name and its type value.
 * @private
 * @internal
 */
export interface Property<T extends JsonTypeDesc> {
    value?: TSType<T>;
    typeString: JsonTypeDesc;
}
/**
 * A type Firestore data types may use to define the fields used in their JSON serialization.
 * @private
 * @internal
 */
export interface JsonSchema {
    [key: string]: Property<JsonTypeDesc>;
}
/**
 * Associates the JSON property type to the native type and sets them to be Required.
 * @private
 * @internal
 */
export type Json<T extends JsonSchema> = {
    [K in keyof T]: Required<T[K]>['value'];
};
/**
 * Helper function to define a JSON schema {@link Property}.
 * @private
 * @internal
 */
export declare function property<T extends JsonTypeDesc>(typeString: T, optionalValue?: TSType<T>): Property<T>;
/**
 * Validates the JSON object based on the provided schema, and narrows the type to the provided
 * JSON schema.
 * @private
 * @internal
 *
 * @param json - A JSON object to validate.
 * @param scheme - a {@link JsonSchema} that defines the properties to validate.
 * @returns true if the JSON schema exists within the object. Throws a FirestoreError otherwise.
 */
export declare function validateJSON<S extends JsonSchema>(json: object, schema: S): json is Json<S>;
