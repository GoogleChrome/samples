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
import { SchemaInterface, SchemaType, SchemaParams, SchemaRequest } from '../types/schema';
/**
 * Parent class encompassing all Schema types, with static methods that
 * allow building specific Schema types. This class can be converted with
 * `JSON.stringify()` into a JSON string accepted by Vertex AI REST endpoints.
 * (This string conversion is automatically done when calling SDK methods.)
 * @public
 */
export declare abstract class Schema implements SchemaInterface {
    /**
     * Optional. The type of the property.
     * This can only be undefined when using `anyOf` schemas, which do not have an
     * explicit type in the {@link https://swagger.io/docs/specification/v3_0/data-models/data-types/#any-type | OpenAPI specification}.
     */
    type?: SchemaType;
    /** Optional. The format of the property.
     * Supported formats:<br/>
     * <ul>
     *  <li>for NUMBER type: "float", "double"</li>
     *  <li>for INTEGER type: "int32", "int64"</li>
     *  <li>for STRING type: "email", "byte", etc</li>
     * </ul>
     */
    format?: string;
    /** Optional. The description of the property. */
    description?: string;
    /** Optional. The items of the property. */
    items?: SchemaInterface;
    /** The minimum number of items (elements) in a schema of {@link (SchemaType:type)} `array`. */
    minItems?: number;
    /** The maximum number of items (elements) in a schema of {@link (SchemaType:type)} `array`. */
    maxItems?: number;
    /** Optional. Whether the property is nullable. Defaults to false. */
    nullable: boolean;
    /** Optional. The example of the property. */
    example?: unknown;
    /**
     * Allows user to add other schema properties that have not yet
     * been officially added to the SDK.
     */
    [key: string]: unknown;
    constructor(schemaParams: SchemaInterface);
    /**
     * Defines how this Schema should be serialized as JSON.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
     * @internal
     */
    toJSON(): SchemaRequest;
    static array(arrayParams: SchemaParams & {
        items: Schema;
    }): ArraySchema;
    static object(objectParams: SchemaParams & {
        properties: {
            [k: string]: Schema;
        };
        optionalProperties?: string[];
    }): ObjectSchema;
    static string(stringParams?: SchemaParams): StringSchema;
    static enumString(stringParams: SchemaParams & {
        enum: string[];
    }): StringSchema;
    static integer(integerParams?: SchemaParams): IntegerSchema;
    static number(numberParams?: SchemaParams): NumberSchema;
    static boolean(booleanParams?: SchemaParams): BooleanSchema;
    static anyOf(anyOfParams: SchemaParams & {
        anyOf: TypedSchema[];
    }): AnyOfSchema;
}
/**
 * A type that includes all specific Schema types.
 * @public
 */
export type TypedSchema = IntegerSchema | NumberSchema | StringSchema | BooleanSchema | ObjectSchema | ArraySchema | AnyOfSchema;
/**
 * Schema class for "integer" types.
 * @public
 */
export declare class IntegerSchema extends Schema {
    constructor(schemaParams?: SchemaParams);
}
/**
 * Schema class for "number" types.
 * @public
 */
export declare class NumberSchema extends Schema {
    constructor(schemaParams?: SchemaParams);
}
/**
 * Schema class for "boolean" types.
 * @public
 */
export declare class BooleanSchema extends Schema {
    constructor(schemaParams?: SchemaParams);
}
/**
 * Schema class for "string" types. Can be used with or without
 * enum values.
 * @public
 */
export declare class StringSchema extends Schema {
    enum?: string[];
    constructor(schemaParams?: SchemaParams, enumValues?: string[]);
    /**
     * @internal
     */
    toJSON(): SchemaRequest;
}
/**
 * Schema class for "array" types.
 * The `items` param should refer to the type of item that can be a member
 * of the array.
 * @public
 */
export declare class ArraySchema extends Schema {
    items: TypedSchema;
    constructor(schemaParams: SchemaParams, items: TypedSchema);
    /**
     * @internal
     */
    toJSON(): SchemaRequest;
}
/**
 * Schema class for "object" types.
 * The `properties` param must be a map of `Schema` objects.
 * @public
 */
export declare class ObjectSchema extends Schema {
    properties: {
        [k: string]: TypedSchema;
    };
    optionalProperties: string[];
    constructor(schemaParams: SchemaParams, properties: {
        [k: string]: TypedSchema;
    }, optionalProperties?: string[]);
    /**
     * @internal
     */
    toJSON(): SchemaRequest;
}
/**
 * Schema class representing a value that can conform to any of the provided sub-schemas. This is
 * useful when a field can accept multiple distinct types or structures.
 * @public
 */
export declare class AnyOfSchema extends Schema {
    anyOf: TypedSchema[];
    constructor(schemaParams: SchemaParams & {
        anyOf: TypedSchema[];
    });
    /**
     * @internal
     */
    toJSON(): SchemaRequest;
}
