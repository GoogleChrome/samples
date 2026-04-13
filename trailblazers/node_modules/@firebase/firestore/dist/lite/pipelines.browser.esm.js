import { F as Firestore, r as FirestoreError, av as __PRIVATE_isString, aw as R, a7 as documentId$1, i as __PRIVATE_fieldPathFromArgument, ax as __PRIVATE_hardAssert, ay as __PRIVATE_parseData, az as __PRIVATE_toStringValue, aA as __PRIVATE_isCollectionReference, G as DocumentReference, E, C as CollectionReference, aB as __PRIVATE_isNumber, X as VectorValue, at as vector, aC as __PRIVATE_isPlainObject, e as __PRIVATE_getDatastore, d as __PRIVATE_cast, j as __PRIVATE_newUserDataReader, h as __PRIVATE_LiteUserDataWriter, aD as __PRIVATE_invokeExecutePipeline, aE as __PRIVATE_toMapValue, aF as __PRIVATE_isCollectionGroupQuery, aG as __PRIVATE_isDocumentQuery, a6 as doc, aH as __PRIVATE_queryNormalizedOrderBy, aI as toNumber, aJ as __PRIVATE_toPipelineValue, aK as __PRIVATE_isUserData, t as fail, O as ObjectValue, aL as FieldPath$1, f as __PRIVATE_mapToArray, aM as FieldFilter, aN as CompositeFilter } from './common-0a3137f7.esm.js';
import '@firebase/util';
import '@firebase/logger';
import '@firebase/webchannel-wrapper/bloom-blob';
import '@firebase/app';

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
 */ class OptionsUtil {
    constructor(e) {
        this.optionDefinitions = e;
    }
    _getKnownOptions(e, t) {
        const r = ObjectValue.empty();
        // SERIALIZE KNOWN OPTIONS
                for (const i in this.optionDefinitions) if (this.optionDefinitions.hasOwnProperty(i)) {
            const o = this.optionDefinitions[i];
            if (i in e) {
                const a = e[i];
                let u;
                if (o.nestedOptions && __PRIVATE_isPlainObject(a)) {
                    u = {
                        mapValue: {
                            fields: new OptionsUtil(o.nestedOptions).getOptionsProto(t, a)
                        }
                    };
                } else a && (u = __PRIVATE_parseData(a, t) ?? void 0);
                u && r.set(FieldPath$1.fromServerFormat(o.serverName), u);
            }
        }
        return r;
    }
    getOptionsProto(e, n, t) {
        const r = this._getKnownOptions(n, e);
        // APPLY OPTIONS OVERRIDES
                if (t) {
            const n = new Map(__PRIVATE_mapToArray(t, ((n, t) => [ FieldPath$1.fromServerFormat(t), void 0 !== n ? __PRIVATE_parseData(n, e) : null ])));
            r.setAll(n);
        }
        // Return MapValue from `result` or empty map value
                return r.value.mapValue.fields ?? {};
    }
}

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
 */ class __PRIVATE_StructuredPipelineOptions {
    constructor(e = {}, n = {}) {
        this.Z = e, this.ee = n, this.ne = new OptionsUtil({
            indexMode: {
                serverName: "index_mode"
            }
        });
    }
    _readUserData(e) {
        this.proto = this.ne.getOptionsProto(e, this.Z, this.ee);
    }
}

class StructuredPipeline {
    constructor(e, n) {
        this.pipeline = e, this.options = n;
    }
    _toProto(e) {
        return {
            pipeline: this.pipeline._toProto(e),
            options: this.options.proto
        };
    }
}

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
/* eslint @typescript-eslint/no-explicit-any: 0 */ function __PRIVATE_isFirestoreValue(e) {
    return "object" == typeof e && null !== e && !!("nullValue" in e && (null === e.nullValue || "NULL_VALUE" === e.nullValue) || "booleanValue" in e && (null === e.booleanValue || "boolean" == typeof e.booleanValue) || "integerValue" in e && (null === e.integerValue || "number" == typeof e.integerValue || "string" == typeof e.integerValue) || "doubleValue" in e && (null === e.doubleValue || "number" == typeof e.doubleValue) || "timestampValue" in e && (null === e.timestampValue || function __PRIVATE_isITimestamp(e) {
        return "object" == typeof e && null !== e && "seconds" in e && (null === e.seconds || "number" == typeof e.seconds || "string" == typeof e.seconds) && "nanos" in e && (null === e.nanos || "number" == typeof e.nanos);
    }(e.timestampValue)) || "stringValue" in e && (null === e.stringValue || "string" == typeof e.stringValue) || "bytesValue" in e && (null === e.bytesValue || e.bytesValue instanceof Uint8Array) || "referenceValue" in e && (null === e.referenceValue || "string" == typeof e.referenceValue) || "geoPointValue" in e && (null === e.geoPointValue || function __PRIVATE_isILatLng(e) {
        return "object" == typeof e && null !== e && "latitude" in e && (null === e.latitude || "number" == typeof e.latitude) && "longitude" in e && (null === e.longitude || "number" == typeof e.longitude);
    }(e.geoPointValue)) || "arrayValue" in e && (null === e.arrayValue || function __PRIVATE_isIArrayValue(e) {
        return "object" == typeof e && null !== e && !(!("values" in e) || null !== e.values && !Array.isArray(e.values));
    }(e.arrayValue)) || "mapValue" in e && (null === e.mapValue || function __PRIVATE_isIMapValue(e) {
        return "object" == typeof e && null !== e && !(!("fields" in e) || null !== e.fields && !__PRIVATE_isPlainObject(e.fields));
    }(e.mapValue)) || "fieldReferenceValue" in e && (null === e.fieldReferenceValue || "string" == typeof e.fieldReferenceValue) || "functionValue" in e && (null === e.functionValue || function __PRIVATE_isIFunction(e) {
        return "object" == typeof e && null !== e && !(!("name" in e) || null !== e.name && "string" != typeof e.name || !("args" in e) || null !== e.args && !Array.isArray(e.args));
    }(e.functionValue)) || "pipelineValue" in e && (null === e.pipelineValue || function __PRIVATE_isIPipeline(e) {
        return "object" == typeof e && null !== e && !(!("stages" in e) || null !== e.stages && !Array.isArray(e.stages));
    }(e.pipelineValue)));
    // Check optional properties and their types
}

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
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */ function __PRIVATE_valueToDefaultExpr$1(e) {
    let t;
    return e instanceof Expression ? e : (t = __PRIVATE_isPlainObject(e) ? __PRIVATE__map(e) : e instanceof Array ? array(e) : __PRIVATE__constant(e, void 0), 
    t);
}

/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */ function __PRIVATE_vectorToExpr$1(e) {
    if (e instanceof Expression) return e;
    if (e instanceof VectorValue) return constant(e);
    if (Array.isArray(e)) return constant(vector(e));
    throw new Error("Unsupported value: " + typeof e);
}

/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 * If the input is a string, it is assumed to be a field name, and a
 * field(value) is returned.
 *
 * @private
 * @internal
 * @param value
 */ function __PRIVATE_fieldOrExpression$1(e) {
    if (__PRIVATE_isString(e)) {
        return field(e);
    }
    return __PRIVATE_valueToDefaultExpr$1(e);
}

/**
 * @beta
 *
 * Represents an expression that can be evaluated to a value within the execution of a {@link
 * @firebase/firestore/pipelines#Pipeline}.
 *
 * Expressions are the building blocks for creating complex queries and transformations in
 * Firestore pipelines. They can represent:
 *
 * - **Field references:** Access values from document fields.
 * - **Literals:** Represent constant values (strings, numbers, booleans).
 * - **Function calls:** Apply functions to one or more expressions.
 *
 * The `Expression` class provides a fluent API for building expressions. You can chain together
 * method calls to create complex expressions.
 */ class Expression {
    constructor() {
        this._protoValueType = "ProtoValue";
    }
    /**
     * Creates an expression that adds this expression to another expression.
     *
     * @example
     * ```typescript
     * // Add the value of the 'quantity' field and the 'reserve' field.
     * field("quantity").add(field("reserve"));
     * ```
     *
     * @param second - The expression or literal to add to this expression.
     * @param others - Optional additional expressions or literals to add to this expression.
     * @returns A new `Expression` representing the addition operation.
     */    add(e) {
        return new FunctionExpression("add", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "add");
    }
    /**
     * @beta
     * Wraps the expression in a [BooleanExpression].
     *
     * @returns A [BooleanExpression] representing the same expression.
     */    asBoolean() {
        if (this instanceof BooleanExpression) return this;
        if (this instanceof Constant) return new __PRIVATE_BooleanConstant(this);
        if (this instanceof Field) return new __PRIVATE_BooleanField(this);
        if (this instanceof FunctionExpression) return new __PRIVATE_BooleanFunctionExpression(this);
        throw new FirestoreError("invalid-argument", `Conversion of type ${typeof this} to BooleanExpression not supported.`);
    }
    subtract(e) {
        return new FunctionExpression("subtract", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "subtract");
    }
    /**
     * @beta
     * Creates an expression that multiplies this expression by another expression.
     *
     * @example
     * ```typescript
     * // Multiply the 'quantity' field by the 'price' field
     * field("quantity").multiply(field("price"));
     * ```
     *
     * @param second - The second expression or literal to multiply by.
     * @param others - Optional additional expressions or literals to multiply by.
     * @returns A new `Expression` representing the multiplication operation.
     */    multiply(e) {
        return new FunctionExpression("multiply", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "multiply");
    }
    divide(e) {
        return new FunctionExpression("divide", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "divide");
    }
    mod(e) {
        return new FunctionExpression("mod", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "mod");
    }
    equal(e) {
        return new FunctionExpression("equal", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "equal").asBoolean();
    }
    notEqual(e) {
        return new FunctionExpression("not_equal", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "notEqual").asBoolean();
    }
    lessThan(e) {
        return new FunctionExpression("less_than", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "lessThan").asBoolean();
    }
    lessThanOrEqual(e) {
        return new FunctionExpression("less_than_or_equal", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "lessThanOrEqual").asBoolean();
    }
    greaterThan(e) {
        return new FunctionExpression("greater_than", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "greaterThan").asBoolean();
    }
    greaterThanOrEqual(e) {
        return new FunctionExpression("greater_than_or_equal", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "greaterThanOrEqual").asBoolean();
    }
    /**
     * @beta
     * Creates an expression that concatenates an array expression with one or more other arrays.
     *
     * @example
     * ```typescript
     * // Combine the 'items' array with another array field.
     * field("items").arrayConcat(field("otherItems"));
     * ```
     * @param secondArray - Second array expression or array literal to concatenate.
     * @param otherArrays - Optional additional array expressions or array literals to concatenate.
     * @returns A new `Expression` representing the concatenated array.
     */    arrayConcat(e, ...n) {
        const t = [ e, ...n ].map((e => __PRIVATE_valueToDefaultExpr$1(e)));
        return new FunctionExpression("array_concat", [ this, ...t ], "arrayConcat");
    }
    arrayContains(e) {
        return new FunctionExpression("array_contains", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "arrayContains").asBoolean();
    }
    arrayContainsAll(e) {
        const n = Array.isArray(e) ? new __PRIVATE_ListOfExprs(e.map(__PRIVATE_valueToDefaultExpr$1), "arrayContainsAll") : e;
        return new FunctionExpression("array_contains_all", [ this, n ], "arrayContainsAll").asBoolean();
    }
    arrayContainsAny(e) {
        const n = Array.isArray(e) ? new __PRIVATE_ListOfExprs(e.map(__PRIVATE_valueToDefaultExpr$1), "arrayContainsAny") : e;
        return new FunctionExpression("array_contains_any", [ this, n ], "arrayContainsAny").asBoolean();
    }
    /**
     * @beta
     * Creates an expression that reverses an array.
     *
     * @example
     * ```typescript
     * // Reverse the value of the 'myArray' field.
     * field("myArray").arrayReverse();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed array.
     */    arrayReverse() {
        return new FunctionExpression("array_reverse", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that calculates the length of an array.
     *
     * @example
     * ```typescript
     * // Get the number of items in the 'cart' array
     * field("cart").arrayLength();
     * ```
     *
     * @returns A new `Expression` representing the length of the array.
     */    arrayLength() {
        return new FunctionExpression("array_length", [ this ], "arrayLength");
    }
    equalAny(e) {
        const n = Array.isArray(e) ? new __PRIVATE_ListOfExprs(e.map(__PRIVATE_valueToDefaultExpr$1), "equalAny") : e;
        return new FunctionExpression("equal_any", [ this, n ], "equalAny").asBoolean();
    }
    notEqualAny(e) {
        const n = Array.isArray(e) ? new __PRIVATE_ListOfExprs(e.map(__PRIVATE_valueToDefaultExpr$1), "notEqualAny") : e;
        return new FunctionExpression("not_equal_any", [ this, n ], "notEqualAny").asBoolean();
    }
    /**
     * @beta
     * Creates an expression that checks if a field exists in the document.
     *
     * @example
     * ```typescript
     * // Check if the document has a field named "phoneNumber"
     * field("phoneNumber").exists();
     * ```
     *
     * @returns A new `Expression` representing the 'exists' check.
     */    exists() {
        return new FunctionExpression("exists", [ this ], "exists").asBoolean();
    }
    /**
     * @beta
     * Creates an expression that calculates the character length of a string in UTF-8.
     *
     * @example
     * ```typescript
     * // Get the character length of the 'name' field in its UTF-8 form.
     * field("name").charLength();
     * ```
     *
     * @returns A new `Expression` representing the length of the string.
     */    charLength() {
        return new FunctionExpression("char_length", [ this ], "charLength");
    }
    like(e) {
        return new FunctionExpression("like", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "like").asBoolean();
    }
    regexContains(e) {
        return new FunctionExpression("regex_contains", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "regexContains").asBoolean();
    }
    regexFind(e) {
        return new FunctionExpression("regex_find", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "regexFind");
    }
    regexFindAll(e) {
        return new FunctionExpression("regex_find_all", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "regexFindAll");
    }
    regexMatch(e) {
        return new FunctionExpression("regex_match", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "regexMatch").asBoolean();
    }
    stringContains(e) {
        return new FunctionExpression("string_contains", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "stringContains").asBoolean();
    }
    startsWith(e) {
        return new FunctionExpression("starts_with", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "startsWith").asBoolean();
    }
    endsWith(e) {
        return new FunctionExpression("ends_with", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "endsWith").asBoolean();
    }
    /**
     * @beta
     * Creates an expression that converts a string to lowercase.
     *
     * @example
     * ```typescript
     * // Convert the 'name' field to lowercase
     * field("name").toLower();
     * ```
     *
     * @returns A new `Expression` representing the lowercase string.
     */    toLower() {
        return new FunctionExpression("to_lower", [ this ], "toLower");
    }
    /**
     * @beta
     * Creates an expression that converts a string to uppercase.
     *
     * @example
     * ```typescript
     * // Convert the 'title' field to uppercase
     * field("title").toUpper();
     * ```
     *
     * @returns A new `Expression` representing the uppercase string.
     */    toUpper() {
        return new FunctionExpression("to_upper", [ this ], "toUpper");
    }
    /**
     * @beta
     * Creates an expression that removes leading and trailing characters from a string or byte array.
     *
     * @example
     * ```typescript
     * // Trim whitespace from the 'userInput' field
     * field("userInput").trim();
     *
     * // Trim quotes from the 'userInput' field
     * field("userInput").trim('"');
     * ```
     * @param valueToTrim - Optional This parameter is treated as a set of characters or bytes that will be
     * trimmed from the input. If not specified, then whitespace will be trimmed.
     * @returns A new `Expression` representing the trimmed string or byte array.
     */    trim(e) {
        const n = [ this ];
        return e && n.push(__PRIVATE_valueToDefaultExpr$1(e)), new FunctionExpression("trim", n, "trim");
    }
    /**
     * @beta
     * Trims whitespace or a specified set of characters/bytes from the beginning of a string or byte array.
     *
     * @example
     * ```typescript
     * // Trim whitespace from the beginning of the 'userInput' field
     * field("userInput").ltrim();
     *
     * // Trim quotes from the beginning of the 'userInput' field
     * field("userInput").ltrim('"');
     * ```
     *
     * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
     * If not specified, whitespace will be trimmed.
     * @returns A new `Expression` representing the trimmed string.
     */    ltrim(e) {
        const n = [ this ];
        return e && n.push(__PRIVATE_valueToDefaultExpr$1(e)), new FunctionExpression("ltrim", n, "ltrim");
    }
    /**
     * @beta
     * Trims whitespace or a specified set of characters/bytes from the end of a string or byte array.
     *
     * @example
     * ```typescript
     * // Trim whitespace from the end of the 'userInput' field
     * field("userInput").rtrim();
     *
     * // Trim quotes from the end of the 'userInput' field
     * field("userInput").rtrim('"');
     * ```
     *
     * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
     * If not specified, whitespace will be trimmed.
     * @returns A new `Expression` representing the trimmed string or byte array.
     */    rtrim(e) {
        const n = [ this ];
        return e && n.push(__PRIVATE_valueToDefaultExpr$1(e)), new FunctionExpression("rtrim", n, "rtrim");
    }
    /**
     * @beta
     * Creates an expression that returns the data type of this expression's result, as a string.
     *
     * @remarks
     * This is evaluated on the backend. This means:
     * 1. Generic typed elements (like `array<string>`) evaluate strictly to the primitive `'array'`.
     * 2. Any custom `FirestoreDataConverter` mappings are ignored.
     * 3. For numeric values, the backend does not yield the JavaScript `"number"` type; it evaluates
     *    precisely as `"int64"` or `"float64"`.
     * 4. For date or timestamp objects, the backend evaluates to `"timestamp"`.
     *
     * @example
     * ```typescript
     * // Get the data type of the value in field 'title'
     * field('title').type()
     * ```
     *
     * @returns A new `Expression` representing the data type.
     */    type() {
        return new FunctionExpression("type", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that checks if the result of this expression is of the given type.
     *
     * @remarks Null or undefined fields evaluate to skip/error. Use `ifAbsent()` / `isAbsent()` to evaluate missing data.
     *
     * @example
     * ```typescript
     * // Check if the 'price' field is specifically an integer (not just 'number')
     * field('price').isType('int64');
     * ```
     *
     * @param type - The type to check for.
     * @returns A new `BooleanExpression` that evaluates to true if the expression's result is of the given type, false otherwise.
     */    isType(e) {
        return new FunctionExpression("is_type", [ this, constant(e) ], "isType").asBoolean();
    }
    /**
     * @beta
     * Creates an expression that concatenates string expressions together.
     *
     * @example
     * ```typescript
     * // Combine the 'firstName', " ", and 'lastName' fields into a single string
     * field("firstName").stringConcat(constant(" "), field("lastName"));
     * ```
     *
     * @param secondString - The additional expression or string literal to concatenate.
     * @param otherStrings - Optional additional expressions or string literals to concatenate.
     * @returns A new `Expression` representing the concatenated string.
     */    stringConcat(e, ...n) {
        const t = [ e, ...n ].map(__PRIVATE_valueToDefaultExpr$1);
        return new FunctionExpression("string_concat", [ this, ...t ], "stringConcat");
    }
    /**
     * @beta
     * Creates an expression that finds the index of the first occurrence of a substring or byte sequence.
     *
     * @example
     * ```typescript
     * // Find the index of "foo" in the 'text' field
     * field("text").stringIndexOf("foo");
     * ```
     *
     * @param search - The substring or byte sequence to search for.
     * @returns A new `Expression` representing the index of the first occurrence.
     */    stringIndexOf(e) {
        return new FunctionExpression("string_index_of", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "stringIndexOf");
    }
    /**
     * @beta
     * Creates an expression that repeats a string or byte array a specified number of times.
     *
     * @example
     * ```typescript
     * // Repeat the 'label' field 3 times
     * field("label").stringRepeat(3);
     * ```
     *
     * @param repetitions - The number of times to repeat the string or byte array.
     * @returns A new `Expression` representing the repeated string or byte array.
     */    stringRepeat(e) {
        return new FunctionExpression("string_repeat", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "stringRepeat");
    }
    /**
     * @beta
     * Creates an expression that replaces all occurrences of a substring or byte sequence with a replacement.
     *
     * @example
     * ```typescript
     * // Replace all occurrences of "foo" with "bar" in the 'text' field
     * field("text").stringReplaceAll("foo", "bar");
     * ```
     *
     * @param find - The substring or byte sequence to search for.
     * @param replacement - The replacement string or byte sequence.
     * @returns A new `Expression` representing the string or byte array with replacements.
     */    stringReplaceAll(e, n) {
        return new FunctionExpression("string_replace_all", [ this, __PRIVATE_valueToDefaultExpr$1(e), __PRIVATE_valueToDefaultExpr$1(n) ], "stringReplaceAll");
    }
    /**
     * @beta
     * Creates an expression that replaces the first occurrence of a substring or byte sequence with a replacement.
     *
     * @example
     * ```typescript
     * // Replace the first occurrence of "foo" with "bar" in the 'text' field
     * field("text").stringReplaceOne("foo", "bar");
     * ```
     *
     * @param find - The substring or byte sequence to search for.
     * @param replacement - The replacement string or byte sequence.
     * @returns A new `Expression` representing the string or byte array with the replacement.
     */    stringReplaceOne(e, n) {
        return new FunctionExpression("string_replace_one", [ this, __PRIVATE_valueToDefaultExpr$1(e), __PRIVATE_valueToDefaultExpr$1(n) ], "stringReplaceOne");
    }
    /**
     * @beta
     * Creates an expression that concatenates expression results together.
     *
     * @example
     * ```typescript
     * // Combine the 'firstName', ' ', and 'lastName' fields into a single value.
     * field("firstName").concat(constant(" "), field("lastName"));
     * ```
     *
     * @param second - The additional expression or literal to concatenate.
     * @param others - Optional additional expressions or literals to concatenate.
     * @returns A new `Expression` representing the concatenated value.
     */    concat(e, ...n) {
        const t = [ e, ...n ].map(__PRIVATE_valueToDefaultExpr$1);
        return new FunctionExpression("concat", [ this, ...t ], "concat");
    }
    /**
     * @beta
     * Creates an expression that reverses this string expression.
     *
     * @example
     * ```typescript
     * // Reverse the value of the 'myString' field.
     * field("myString").reverse();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
     */    reverse() {
        return new FunctionExpression("reverse", [ this ], "reverse");
    }
    /**
     * @beta
     * Returns the first element of the array.
     *
     * @example
     * ```typescript
     * // Get the first element of the 'myArray' field.
     * field("myArray").arrayFirst();
     * ```
     *
     * @returns A new `Expression` representing the first element.
     */    arrayFirst() {
        return new FunctionExpression("array_first", [ this ], "arrayFirst");
    }
    arrayFirstN(e) {
        return new FunctionExpression("array_first_n", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "arrayFirstN");
    }
    /**
     * @beta
     * Returns the last element of the array.
     *
     * @example
     * ```typescript
     * // Get the last element of the 'myArray' field.
     * field("myArray").arrayLast();
     * ```
     *
     * @returns A new `Expression` representing the last element.
     */    arrayLast() {
        return new FunctionExpression("array_last", [ this ], "arrayLast");
    }
    arrayLastN(e) {
        return new FunctionExpression("array_last_n", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "arrayLastN");
    }
    /**
     * @beta
     * Returns the maximum value in the array.
     *
     * @example
     * ```typescript
     * // Get the maximum value of the 'myArray' field.
     * field("myArray").arrayMaximum();
     * ```
     *
     * @returns A new `Expression` representing the maximum value.
     */    arrayMaximum() {
        return new FunctionExpression("maximum", [ this ], "arrayMaximum");
    }
    arrayMaximumN(e) {
        return new FunctionExpression("maximum_n", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "arrayMaximumN");
    }
    /**
     * @beta
     * Returns the minimum value in the array.
     *
     * @example
     * ```typescript
     * // Get the minimum value of the 'myArray' field.
     * field("myArray").arrayMinimum();
     * ```
     *
     * @returns A new `Expression` representing the minimum value.
     */    arrayMinimum() {
        return new FunctionExpression("minimum", [ this ], "arrayMinimum");
    }
    arrayMinimumN(e) {
        return new FunctionExpression("minimum_n", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "arrayMinimumN");
    }
    arrayIndexOf(e) {
        return new FunctionExpression("array_index_of", [ this, __PRIVATE_valueToDefaultExpr$1(e), __PRIVATE_valueToDefaultExpr$1("first") ], "arrayIndexOf");
    }
    arrayLastIndexOf(e) {
        return new FunctionExpression("array_index_of", [ this, __PRIVATE_valueToDefaultExpr$1(e), __PRIVATE_valueToDefaultExpr$1("last") ], "arrayLastIndexOf");
    }
    arrayIndexOfAll(e) {
        return new FunctionExpression("array_index_of_all", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "arrayIndexOfAll");
    }
    /**
     * @beta
     * Creates an expression that calculates the length of this string expression in bytes.
     *
     * @example
     * ```typescript
     * // Calculate the length of the 'myString' field in bytes.
     * field("myString").byteLength();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the string in bytes.
     */    byteLength() {
        return new FunctionExpression("byte_length", [ this ], "byteLength");
    }
    /**
     * @beta
     * Creates an expression that computes the ceiling of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the ceiling of the 'price' field.
     * field("price").ceil();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the ceiling of the numeric value.
     */    ceil() {
        return new FunctionExpression("ceil", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that computes the floor of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the floor of the 'price' field.
     * field("price").floor();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the floor of the numeric value.
     */    floor() {
        return new FunctionExpression("floor", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that computes the absolute value of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the absolute value of the 'price' field.
     * field("price").abs();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the absolute value of the numeric value.
     */    abs() {
        return new FunctionExpression("abs", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that computes e to the power of this expression.
     *
     * @example
     * ```typescript
     * // Compute e to the power of the 'value' field.
     * field("value").exp();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the exp of the numeric value.
     */    exp() {
        return new FunctionExpression("exp", [ this ]);
    }
    /**
     * @beta
     * Accesses a value from a map (object) field using the provided key.
     *
     * @example
     * ```typescript
     * // Get the 'city' value from the 'address' map field
     * field("address").mapGet("city");
     * ```
     *
     * @param subfield - The key to access in the map.
     * @returns A new `Expression` representing the value associated with the given key in the map.
     */    mapGet(e) {
        return new FunctionExpression("map_get", [ this, constant(e) ], "mapGet");
    }
    /**
     * @beta
     * Creates an expression that returns a new map with the specified entries added or updated.
     *
     * @remarks
     * Note that `mapSet` only performs shallow updates to the map. Setting a value to `null`
     * will retain the key with a `null` value. To remove a key entirely, use `mapRemove`.
     *
     * @example
     * ```typescript
     * // Set the 'city' to "San Francisco" in the 'address' map
     * field("address").mapSet("city", "San Francisco");
     * ```
     *
     * @param key - The key to set. Must be a string or a constant string expression.
     * @param value - The value to set.
     * @param moreKeyValues - Additional key-value pairs to set.
     * @returns A new `Expression` representing the map with the entries set.
     */    mapSet(e, n, ...t) {
        const r = [ this, __PRIVATE_valueToDefaultExpr$1(e), __PRIVATE_valueToDefaultExpr$1(n), ...t.map(__PRIVATE_valueToDefaultExpr$1) ];
        return new FunctionExpression("map_set", r, "mapSet");
    }
    /**
     * @beta
     * Creates an expression that returns the keys of a map.
     *
     * @remarks
     * While the backend generally preserves insertion order, relying on the
     * order of the output array is not guaranteed and should be avoided.
     *
     * @example
     * ```typescript
     * // Get the keys of the 'address' map
     * field("address").mapKeys();
     * ```
     *
     * @returns A new `Expression` representing the keys of the map.
     */    mapKeys() {
        return new FunctionExpression("map_keys", [ this ], "mapKeys");
    }
    /**
     * @beta
     * Creates an expression that returns the values of a map.
     *
     * @remarks
     * While the backend generally preserves insertion order, relying on the
     * order of the output array is not guaranteed and should be avoided.
     *
     * @example
     * ```typescript
     * // Get the values of the 'address' map
     * field("address").mapValues();
     * ```
     *
     * @returns A new `Expression` representing the values of the map.
     */    mapValues() {
        return new FunctionExpression("map_values", [ this ], "mapValues");
    }
    /**
     * @beta
     * Creates an expression that returns the entries of a map as an array of maps,
     * where each map contains a `"k"` property for the key and a `"v"` property for the value.
     * For example: `[{ k: "key1", v: "value1" }, ...]`.
     *
     * @example
     * ```typescript
     * // Get the entries of the 'address' map
     * field("address").mapEntries();
     * ```
     *
     * @returns A new `Expression` representing the entries of the map.
     */    mapEntries() {
        return new FunctionExpression("map_entries", [ this ], "mapEntries");
    }
    /**
     * @beta
     * Creates an aggregation that counts the number of stage inputs with valid evaluations of the
     * expression or field.
     *
     * @example
     * ```typescript
     * // Count the total number of products
     * field("productId").count().as("totalProducts");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'count' aggregation.
     */    count() {
        return AggregateFunction._create("count", [ this ], "count");
    }
    /**
     * @beta
     * Creates an aggregation that calculates the sum of a numeric field across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Calculate the total revenue from a set of orders
     * field("orderAmount").sum().as("totalRevenue");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'sum' aggregation.
     */    sum() {
        return AggregateFunction._create("sum", [ this ], "sum");
    }
    /**
     * @beta
     * Creates an aggregation that calculates the average (mean) of a numeric field across multiple
     * stage inputs.
     *
     * @example
     * ```typescript
     * // Calculate the average age of users
     * field("age").average().as("averageAge");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'average' aggregation.
     */    average() {
        return AggregateFunction._create("average", [ this ], "average");
    }
    /**
     * @beta
     * Creates an aggregation that finds the minimum value of a field across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Find the lowest price of all products
     * field("price").minimum().as("lowestPrice");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'minimum' aggregation.
     */    minimum() {
        return AggregateFunction._create("minimum", [ this ], "minimum");
    }
    /**
     * @beta
     * Creates an aggregation that finds the maximum value of a field across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Find the highest score in a leaderboard
     * field("score").maximum().as("highestScore");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'maximum' aggregation.
     */    maximum() {
        return AggregateFunction._create("maximum", [ this ], "maximum");
    }
    /**
     * @beta
     * Creates an aggregation that finds the first value of an expression across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Find the first value of the 'rating' field
     * field("rating").first().as("firstRating");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'first' aggregation.
     */    first() {
        return AggregateFunction._create("first", [ this ], "first");
    }
    /**
     * @beta
     * Creates an aggregation that finds the last value of an expression across multiple stage inputs.
     *
     * @example
     * ```typescript
     * // Find the last value of the 'rating' field
     * field("rating").last().as("lastRating");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'last' aggregation.
     */    last() {
        return AggregateFunction._create("last", [ this ], "last");
    }
    /**
     * @beta
     * Creates an aggregation that collects all values of an expression across multiple stage inputs
     * into an array.
     *
     * @remarks
     * If the expression resolves to an absent value, it is converted to `null`.
     * The order of elements in the output array is not stable and shouldn't be relied upon.
     *
     * @example
     * ```typescript
     * // Collect all tags from books into an array
     * field("tags").arrayAgg().as("allTags");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'array_agg' aggregation.
     */    arrayAgg() {
        return AggregateFunction._create("array_agg", [ this ], "arrayAgg");
    }
    /**
     * @beta
     * Creates an aggregation that collects all distinct values of an expression across multiple stage
     * inputs into an array.
     *
     * @remarks
     * If the expression resolves to an absent value, it is converted to `null`.
     * The order of elements in the output array is not stable and shouldn't be relied upon.
     *
     * @example
     * ```typescript
     * // Collect all distinct tags from books into an array
     * field("tags").arrayAggDistinct().as("allDistinctTags");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'array_agg_distinct' aggregation.
     */    arrayAggDistinct() {
        return AggregateFunction._create("array_agg_distinct", [ this ], "arrayAggDistinct");
    }
    /**
     * @beta
     * Creates an aggregation that counts the number of distinct values of the expression or field.
     *
     * @example
     * ```typescript
     * // Count the distinct number of products
     * field("productId").countDistinct().as("distinctProducts");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'count_distinct' aggregation.
     */    countDistinct() {
        return AggregateFunction._create("count_distinct", [ this ], "countDistinct");
    }
    /**
     * @beta
     * Creates an expression that returns the larger value between this expression and another expression, based on Firestore's value type ordering.
     *
     * @example
     * ```typescript
     * // Returns the larger value between the 'timestamp' field and the current timestamp.
     * field("timestamp").logicalMaximum(currentTimestamp());
     * ```
     *
     * @param second - The second expression or literal to compare with.
     * @param others - Optional additional expressions or literals to compare with.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical maximum operation.
     */    logicalMaximum(e, ...n) {
        const t = [ e, ...n ];
        return new FunctionExpression("maximum", [ this, ...t.map(__PRIVATE_valueToDefaultExpr$1) ], "logicalMaximum");
    }
    /**
     * @beta
     * Creates an expression that returns the smaller value between this expression and another expression, based on Firestore's value type ordering.
     *
     * @example
     * ```typescript
     * // Returns the smaller value between the 'timestamp' field and the current timestamp.
     * field("timestamp").logicalMinimum(currentTimestamp());
     * ```
     *
     * @param second - The second expression or literal to compare with.
     * @param others - Optional additional expressions or literals to compare with.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical minimum operation.
     */    logicalMinimum(e, ...n) {
        const t = [ e, ...n ];
        return new FunctionExpression("minimum", [ this, ...t.map(__PRIVATE_valueToDefaultExpr$1) ], "minimum");
    }
    /**
     * @beta
     * Creates an expression that calculates the length (number of dimensions) of this Firestore Vector expression.
     *
     * @example
     * ```typescript
     * // Get the vector length (dimension) of the field 'embedding'.
     * field("embedding").vectorLength();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the vector.
     */    vectorLength() {
        return new FunctionExpression("vector_length", [ this ], "vectorLength");
    }
    cosineDistance(e) {
        return new FunctionExpression("cosine_distance", [ this, __PRIVATE_vectorToExpr$1(e) ], "cosineDistance");
    }
    dotProduct(e) {
        return new FunctionExpression("dot_product", [ this, __PRIVATE_vectorToExpr$1(e) ], "dotProduct");
    }
    euclideanDistance(e) {
        return new FunctionExpression("euclidean_distance", [ this, __PRIVATE_vectorToExpr$1(e) ], "euclideanDistance");
    }
    /**
     * @beta
     * Creates an expression that interprets this expression as the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
     * and returns a timestamp.
     *
     * @example
     * ```typescript
     * // Interpret the 'microseconds' field as microseconds since epoch.
     * field("microseconds").unixMicrosToTimestamp();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
     */    unixMicrosToTimestamp() {
        return new FunctionExpression("unix_micros_to_timestamp", [ this ], "unixMicrosToTimestamp");
    }
    /**
     * @beta
     * Creates an expression that converts this timestamp expression to the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
     *
     * @example
     * ```typescript
     * // Convert the 'timestamp' field to microseconds since epoch.
     * field("timestamp").timestampToUnixMicros();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of microseconds since epoch.
     */    timestampToUnixMicros() {
        return new FunctionExpression("timestamp_to_unix_micros", [ this ], "timestampToUnixMicros");
    }
    /**
     * @beta
     * Creates an expression that interprets this expression as the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
     * and returns a timestamp.
     *
     * @example
     * ```typescript
     * // Interpret the 'milliseconds' field as milliseconds since epoch.
     * field("milliseconds").unixMillisToTimestamp();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
     */    unixMillisToTimestamp() {
        return new FunctionExpression("unix_millis_to_timestamp", [ this ], "unixMillisToTimestamp");
    }
    /**
     * @beta
     * Creates an expression that converts this timestamp expression to the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
     *
     * @example
     * ```typescript
     * // Convert the 'timestamp' field to milliseconds since epoch.
     * field("timestamp").timestampToUnixMillis();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of milliseconds since epoch.
     */    timestampToUnixMillis() {
        return new FunctionExpression("timestamp_to_unix_millis", [ this ], "timestampToUnixMillis");
    }
    /**
     * @beta
     * Creates an expression that interprets this expression as the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC)
     * and returns a timestamp.
     *
     * @example
     * ```typescript
     * // Interpret the 'seconds' field as seconds since epoch.
     * field("seconds").unixSecondsToTimestamp();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
     */    unixSecondsToTimestamp() {
        return new FunctionExpression("unix_seconds_to_timestamp", [ this ], "unixSecondsToTimestamp");
    }
    /**
     * @beta
     * Creates an expression that converts this timestamp expression to the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC).
     *
     * @example
     * ```typescript
     * // Convert the 'timestamp' field to seconds since epoch.
     * field("timestamp").timestampToUnixSeconds();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of seconds since epoch.
     */    timestampToUnixSeconds() {
        return new FunctionExpression("timestamp_to_unix_seconds", [ this ], "timestampToUnixSeconds");
    }
    timestampAdd(e, n) {
        return new FunctionExpression("timestamp_add", [ this, __PRIVATE_valueToDefaultExpr$1(e), __PRIVATE_valueToDefaultExpr$1(n) ], "timestampAdd");
    }
    timestampSubtract(e, n) {
        return new FunctionExpression("timestamp_subtract", [ this, __PRIVATE_valueToDefaultExpr$1(e), __PRIVATE_valueToDefaultExpr$1(n) ], "timestampSubtract");
    }
    /**
     * @beta
     *
     * Creates an expression that returns the document ID from a path.
     *
     * @example
     * ```typescript
     * // Get the document ID from a path.
     * field("__path__").documentId();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the documentId operation.
     */    documentId() {
        return new FunctionExpression("document_id", [ this ], "documentId");
    }
    substring(e, n) {
        const t = __PRIVATE_valueToDefaultExpr$1(e);
        return new FunctionExpression("substring", void 0 === n ? [ this, t ] : [ this, t, __PRIVATE_valueToDefaultExpr$1(n) ], "substring");
    }
    arrayGet(e) {
        return new FunctionExpression("array_get", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "arrayGet");
    }
    /**
     * @beta
     *
     * Creates an expression that checks if a given expression produces an error.
     *
     * @example
     * ```typescript
     * // Check if the result of a calculation is an error
     * field("title").arrayContains(1).isError();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#BooleanExpression} representing the 'isError' check.
     */    isError() {
        return new FunctionExpression("is_error", [ this ], "isError").asBoolean();
    }
    ifError(e) {
        const n = new FunctionExpression("if_error", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "ifError");
        return e instanceof BooleanExpression ? n.asBoolean() : n;
    }
    /**
     * @beta
     *
     * Creates an expression that returns `true` if the result of this expression
     * is absent. Otherwise, returns `false` even if the value is `null`.
     *
     * @example
     * ```typescript
     * // Check if the field `value` is absent.
     * field("value").isAbsent();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#BooleanExpression} representing the 'isAbsent' check.
     */    isAbsent() {
        return new FunctionExpression("is_absent", [ this ], "isAbsent").asBoolean();
    }
    mapRemove(e) {
        return new FunctionExpression("map_remove", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "mapRemove");
    }
    /**
     * @beta
     *
     * Creates an expression that merges multiple map values.
     *
     * @example
     * ```
     * // Merges the map in the settings field with, a map literal, and a map in
     * // that is conditionally returned by another expression
     * field('settings').mapMerge({ enabled: true }, conditional(field('isAdmin'), { admin: true}, {})
     * ```
     *
     * @param secondMap - A required second map to merge. Represented as a literal or
     * an expression that returns a map.
     * @param otherMaps - Optional additional maps to merge. Each map is represented
     * as a literal or an expression that returns a map.
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'mapMerge' operation.
     */    mapMerge(e, ...n) {
        const t = __PRIVATE_valueToDefaultExpr$1(e), r = n.map(__PRIVATE_valueToDefaultExpr$1);
        return new FunctionExpression("map_merge", [ this, t, ...r ], "mapMerge");
    }
    pow(e) {
        return new FunctionExpression("pow", [ this, __PRIVATE_valueToDefaultExpr$1(e) ]);
    }
    trunc(e) {
        return void 0 === e ? new FunctionExpression("trunc", [ this ]) : new FunctionExpression("trunc", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "trunc");
    }
    round(e) {
        return void 0 === e ? new FunctionExpression("round", [ this ]) : new FunctionExpression("round", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "round");
    }
    /**
     * @beta
     * Creates an expression that returns the collection ID from a path.
     *
     * @example
     * ```typescript
     * // Get the collection ID from a path.
     * field("__path__").collectionId();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the collectionId operation.
     */    collectionId() {
        return new FunctionExpression("collection_id", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that calculates the length of a string, array, map, vector, or bytes.
     *
     * @example
     * ```typescript
     * // Get the length of the 'name' field.
     * field("name").length();
     *
     * // Get the number of items in the 'cart' array.
     * field("cart").length();
     * ```
     *
     * @returns A new `Expression` representing the length of the string, array, map, vector, or bytes.
     */    length() {
        return new FunctionExpression("length", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that computes the natural logarithm of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the natural logarithm of the 'value' field.
     * field("value").ln();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the natural logarithm of the numeric value.
     */    ln() {
        return new FunctionExpression("ln", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that computes the square root of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the square root of the 'value' field.
     * field("value").sqrt();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the square root of the numeric value.
     */    sqrt() {
        return new FunctionExpression("sqrt", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that reverses a string.
     *
     * @example
     * ```typescript
     * // Reverse the value of the 'myString' field.
     * field("myString").stringReverse();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
     */    stringReverse() {
        return new FunctionExpression("string_reverse", [ this ]);
    }
    ifAbsent(e) {
        return new FunctionExpression("if_absent", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "ifAbsent");
    }
    join(e) {
        return new FunctionExpression("join", [ this, __PRIVATE_valueToDefaultExpr$1(e) ], "join");
    }
    /**
     * @beta
     * Creates an expression that computes the base-10 logarithm of a numeric value.
     *
     * @example
     * ```typescript
     * // Compute the base-10 logarithm of the 'value' field.
     * field("value").log10();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the base-10 logarithm of the numeric value.
     */    log10() {
        return new FunctionExpression("log10", [ this ]);
    }
    /**
     * @beta
     * Creates an expression that computes the sum of the elements in an array.
     *
     * @example
     * ```typescript
     * // Compute the sum of the elements in the 'scores' field.
     * field("scores").arraySum();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the sum of the elements in the array.
     */    arraySum() {
        return new FunctionExpression("sum", [ this ]);
    }
    split(e) {
        return new FunctionExpression("split", [ this, __PRIVATE_valueToDefaultExpr$1(e) ]);
    }
    timestampTruncate(e, n) {
        const t = [ this, __PRIVATE_valueToDefaultExpr$1(__PRIVATE_isString(e) ? e.toLowerCase() : e) ];
        return n && t.push(__PRIVATE_valueToDefaultExpr$1(n)), new FunctionExpression("timestamp_trunc", t);
    }
    // TODO(new-expression): Add new expression method definitions above this line
    /**
     * @beta
     * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in ascending order based on this expression.
     *
     * @example
     * ```typescript
     * // Sort documents by the 'name' field in ascending order
     * firestore.pipeline().collection("users")
     *   .sort(field("name").ascending());
     * ```
     *
     * @returns A new `Ordering` for ascending sorting.
     */
    ascending() {
        return ascending(this);
    }
    /**
     * @beta
     * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in descending order based on this expression.
     *
     * @example
     * ```typescript
     * // Sort documents by the 'createdAt' field in descending order
     * firestore.pipeline().collection("users")
     *   .sort(field("createdAt").descending());
     * ```
     *
     * @returns A new `Ordering` for descending sorting.
     */    descending() {
        return descending(this);
    }
    /**
     * @beta
     * Assigns an alias to this expression.
     *
     * Aliases are useful for renaming fields in the output of a stage or for giving meaningful
     * names to calculated values.
     *
     * @example
     * ```typescript
     * // Calculate the total price and assign it the alias "totalPrice" and add it to the output.
     * firestore.pipeline().collection("items")
     *   .addFields(field("price").multiply(field("quantity")).as("totalPrice"));
     * ```
     *
     * @param name - The alias to assign to this expression.
     * @returns A new {@link @firebase/firestore/pipelines#AliasedExpression} that wraps this
     *     expression and associates it with the provided alias.
     */    as(e) {
        return new AliasedExpression(this, e, "as");
    }
}

/**
 * @beta
 *
 * A class that represents an aggregate function.
 */ class AggregateFunction {
    constructor(e, n) {
        this.name = e, this.params = n, this.exprType = "AggregateFunction", this._protoValueType = "ProtoValue";
    }
    /**
     * @internal
     * @private
     */    static _create(e, n, t) {
        const r = new AggregateFunction(e, n);
        return r._methodName = t, r;
    }
    /**
     * @beta
     * Assigns an alias to this AggregateFunction. The alias specifies the name that
     * the aggregated value will have in the output document.
     *
     * @example
     * ```typescript
     * // Calculate the average price of all items and assign it the alias "averagePrice".
     * firestore.pipeline().collection("items")
     *   .aggregate(field("price").average().as("averagePrice"));
     * ```
     *
     * @param name - The alias to assign to this AggregateFunction.
     * @returns A new {@link @firebase/firestore/pipelines#AliasedAggregate} that wraps this
     *     AggregateFunction and associates it with the provided alias.
     */    as(e) {
        return new AliasedAggregate(this, e, "as");
    }
    /**
     * @private
     * @internal
     */    _toProto(e) {
        return {
            functionValue: {
                name: this.name,
                args: this.params.map((n => n._toProto(e)))
            }
        };
    }
    /**
     * @private
     * @internal
     */    _readUserData(e) {
        e = this._methodName ? e.te({
            methodName: this._methodName
        }) : e, this.params.forEach((n => n._readUserData(e)));
    }
}

/**
 * @beta
 *
 * An AggregateFunction with alias.
 */ class AliasedAggregate {
    constructor(e, n, t) {
        this.aggregate = e, this.alias = n, this._methodName = t;
    }
    /**
     * @private
     * @internal
     */    _readUserData(e) {
        this.aggregate._readUserData(e);
    }
}

/**
 * @beta
 */ class AliasedExpression {
    constructor(e, n, t) {
        this.expr = e, this.alias = n, this._methodName = t, this.exprType = "AliasedExpression", 
        this.selectable = !0;
    }
    /**
     * @private
     * @internal
     */    _readUserData(e) {
        this.expr._readUserData(e);
    }
}

/**
 * @internal
 */ class __PRIVATE_ListOfExprs extends Expression {
    constructor(e, n) {
        super(), this.re = e, this._methodName = n, this.expressionType = "ListOfExpressions";
    }
    /**
     * @private
     * @internal
     */    _toProto(e) {
        return {
            arrayValue: {
                values: this.re.map((n => n._toProto(e)))
            }
        };
    }
    /**
     * @private
     * @internal
     */    _readUserData(e) {
        this.re.forEach((n => n._readUserData(e)));
    }
}

/**
 * @beta
 *
 * Represents a reference to a field in a Firestore document, or outputs of a {@link @firebase/firestore/pipelines#Pipeline} stage.
 *
 * <p>Field references are used to access document field values in expressions and to specify fields
 * for sorting, filtering, and projecting data in Firestore pipelines.
 *
 * <p>You can create a `Field` instance using the static {@link @firebase/firestore/pipelines#field} method:
 *
 * @example
 * ```typescript
 * // Create a Field instance for the 'name' field
 * const nameField = field("name");
 *
 * // Create a Field instance for a nested field 'address.city'
 * const cityField = field("address.city");
 * ```
 */ class Field extends Expression {
    /**
     * @internal
     * @private
     * @hideconstructor
     * @param fieldPath
     */
    constructor(e, n) {
        super(), this.fieldPath = e, this._methodName = n, this.expressionType = "Field", 
        this.selectable = !0;
    }
    get fieldName() {
        return this.fieldPath.canonicalString();
    }
    get alias() {
        return this.fieldName;
    }
    get expr() {
        return this;
    }
    /**
     * @private
     * @internal
     */    _toProto(e) {
        return {
            fieldReferenceValue: this.fieldPath.canonicalString()
        };
    }
    /**
     * @private
     * @internal
     */    _readUserData(e) {}
}

function field(e) {
    return _field(e, "field");
}

function _field(e, n) {
    return new Field("string" == typeof e ? R === e ? documentId$1()._internalPath : __PRIVATE_fieldPathFromArgument("field", e) : e._internalPath, n);
}

/**
 * @internal
 *
 * Represents a constant value that can be used in a Firestore pipeline expression.
 *
 * You can create a `Constant` instance using the static {@link @firebase/firestore/pipelines#field} method:
 *
 * @example
 * ```typescript
 * // Create a Constant instance for the number 10
 * const ten = constant(10);
 *
 * // Create a Constant instance for the string "hello"
 * const hello = constant("hello");
 * ```
 */ class Constant extends Expression {
    /**
     * @private
     * @internal
     * @hideconstructor
     * @param value - The value of the constant.
     */
    constructor(e, n) {
        super(), this.value = e, this._methodName = n, this.expressionType = "Constant";
    }
    /**
     * @private
     * @internal
     */    static _fromProto(e) {
        const n = new Constant(e, void 0);
        return n._protoValue = e, n;
    }
    /**
     * @private
     * @internal
     */    _toProto(e) {
        return __PRIVATE_hardAssert(void 0 !== this._protoValue, 237), this._protoValue;
    }
    /**
     * @private
     * @internal
     */    _readUserData(e) {
        e = this._methodName ? e.te({
            methodName: this._methodName
        }) : e, __PRIVATE_isFirestoreValue(this._protoValue) || (this._protoValue = __PRIVATE_parseData(this.value, e));
    }
}

function constant(e) {
    return __PRIVATE__constant(e, "constant");
}

/**
 * @internal
 * @private
 * @param value
 * @param methodName
 */ function __PRIVATE__constant(e, n) {
    const t = new Constant(e, n);
    return "boolean" == typeof e ? new __PRIVATE_BooleanConstant(t) : t;
}

/**
 * Internal only
 * @internal
 * @private
 */ class MapValue extends Expression {
    constructor(e, n) {
        super(), this.ie = e, this._methodName = n, this.expressionType = "Constant";
    }
    _readUserData(e) {
        e = this._methodName ? e.te({
            methodName: this._methodName
        }) : e, this.ie.forEach((n => {
            n._readUserData(e);
        }));
    }
    _toProto(e) {
        return __PRIVATE_toMapValue(e, this.ie);
    }
}

/**
 * @beta
 *
 * This class defines the base class for Firestore {@link @firebase/firestore/pipelines#Pipeline} functions, which can be evaluated within pipeline
 * execution.
 *
 * Typically, you would not use this class or its children directly. Use either the functions like {@link @firebase/firestore/pipelines#and}, {@link @firebase/firestore/pipelines#(equal:1)},
 * or the methods on {@link @firebase/firestore/pipelines#Expression} ({@link @firebase/firestore/pipelines#Expression.(equal:1)}, {@link @firebase/firestore/pipelines#Expression.(lessThan:1)}, etc.) to construct new Function instances.
 */ class FunctionExpression extends Expression {
    constructor(e, n, t) {
        super(), this.name = e, this.params = n, this._methodName = t, this.expressionType = "Function";
    }
    /**
     * @private
     * @internal
     */    _toProto(e) {
        return {
            functionValue: {
                name: this.name,
                args: this.params.map((n => n._toProto(e)))
            }
        };
    }
    /**
     * @private
     * @internal
     */    _readUserData(e) {
        e = this._methodName ? e.te({
            methodName: this._methodName
        }) : e, this.params.forEach((n => n._readUserData(e)));
    }
}

/**
 * @beta
 *
 * An interface that represents a filter condition.
 */ class BooleanExpression extends Expression {
    get _methodName() {
        return this._expr._methodName;
    }
    /**
     * @beta
     * Creates an aggregation that finds the count of input documents satisfying
     * this boolean expression.
     *
     * @example
     * ```typescript
     * // Find the count of documents with a score greater than 90
     * field("score").greaterThan(90).countIf().as("highestScore");
     * ```
     *
     * @returns A new `AggregateFunction` representing the 'countIf' aggregation.
     */    countIf() {
        return AggregateFunction._create("count_if", [ this ], "countIf");
    }
    /**
     * @beta
     * Creates an expression that negates this boolean expression.
     *
     * @example
     * ```typescript
     * // Find documents where the 'tags' field does not contain 'completed'
     * field("tags").arrayContains("completed").not();
     * ```
     *
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the negated filter condition.
     */    not() {
        return new FunctionExpression("not", [ this ], "not").asBoolean();
    }
    /**
     * @beta
     * Creates a conditional expression that evaluates to the 'then' expression
     * if `this` expression evaluates to `true`,
     * or evaluates to the 'else' expression if `this` expressions evaluates `false`.
     *
     * @example
     * ```typescript
     * // If 'age' is greater than 18, return "Adult"; otherwise, return "Minor".
     * field("age").greaterThanOrEqual(18).conditional(constant("Adult"), constant("Minor"));
     * ```
     *
     * @param thenExpr - The expression to evaluate if the condition is true.
     * @param elseExpr - The expression to evaluate if the condition is false.
     * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the conditional expression.
     */    conditional(e, n) {
        return new FunctionExpression("conditional", [ this, e, n ], "conditional");
    }
    ifError(e) {
        const n = __PRIVATE_valueToDefaultExpr$1(e), t = new FunctionExpression("if_error", [ this, n ], "ifError");
        return n instanceof BooleanExpression ? t.asBoolean() : t;
    }
    /**
     * @private
     * @internal
     */    _toProto(e) {
        return this._expr._toProto(e);
    }
    /**
     * @private
     * @internal
     */    _readUserData(e) {
        this._expr._readUserData(e);
    }
}

class __PRIVATE_BooleanFunctionExpression extends BooleanExpression {
    constructor(e) {
        super(), this._expr = e, this.expressionType = "Function";
    }
}

class __PRIVATE_BooleanConstant extends BooleanExpression {
    constructor(e) {
        super(), this._expr = e, this.expressionType = "Constant";
    }
}

class __PRIVATE_BooleanField extends BooleanExpression {
    constructor(e) {
        super(), this._expr = e, this.expressionType = "Field";
    }
}

/**
 * @beta
 * Creates an aggregation that counts the number of stage inputs where the provided
 * boolean expression evaluates to true.
 *
 * @example
 * ```typescript
 * // Count the number of documents where 'is_active' field equals true
 * countIf(field("is_active").equal(true)).as("numActiveDocuments");
 * ```
 *
 * @param booleanExpr - The boolean expression to evaluate on each input.
 * @returns A new `AggregateFunction` representing the 'countIf' aggregation.
 */ function countIf(e) {
    return e.countIf();
}

function arrayGet(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).arrayGet(__PRIVATE_valueToDefaultExpr$1(n));
}

/**
 * @beta
 *
 * Creates an expression that checks if a given expression produces an error.
 *
 * @example
 * ```typescript
 * // Check if the result of a calculation is an error
 * isError(field("title").arrayContains(1));
 * ```
 *
 * @param value - The expression to check.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'isError' check.
 */ function isError(e) {
    return e.isError().asBoolean();
}

function ifError(e, n) {
    return e instanceof BooleanExpression && n instanceof BooleanExpression ? e.ifError(n).asBoolean() : e.ifError(__PRIVATE_valueToDefaultExpr$1(n));
}

function isAbsent(e) {
    return __PRIVATE_fieldOrExpression$1(e).isAbsent();
}

function mapRemove(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).mapRemove(__PRIVATE_valueToDefaultExpr$1(n));
}

function mapMerge(e, n, ...t) {
    const r = __PRIVATE_valueToDefaultExpr$1(n), i = t.map(__PRIVATE_valueToDefaultExpr$1);
    return __PRIVATE_fieldOrExpression$1(e).mapMerge(r, ...i);
}

function documentId(e) {
    return __PRIVATE_valueToDefaultExpr$1(e).documentId();
}

function substring(e, n, t) {
    const r = __PRIVATE_fieldOrExpression$1(e), i = __PRIVATE_valueToDefaultExpr$1(n), s = void 0 === t ? void 0 : __PRIVATE_valueToDefaultExpr$1(t);
    return r.substring(i, s);
}

function add(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).add(__PRIVATE_valueToDefaultExpr$1(n));
}

function subtract(e, n) {
    const t = "string" == typeof e ? field(e) : e, r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.subtract(r);
}

function multiply(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).multiply(__PRIVATE_valueToDefaultExpr$1(n));
}

function divide(e, n) {
    const t = "string" == typeof e ? field(e) : e, r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.divide(r);
}

function mod(e, n) {
    const t = "string" == typeof e ? field(e) : e, r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.mod(r);
}

/**
 * @beta
 *
 * Creates an expression that creates a Firestore map value from an input object.
 *
 * @example
 * ```typescript
 * // Create a map from the input object and reference the 'baz' field value from the input document.
 * map({foo: 'bar', baz: field('baz')}).as('data');
 * ```
 *
 * @param elements - The input map to evaluate in the expression.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the map function.
 */ function map(e) {
    return __PRIVATE__map(e);
}

function __PRIVATE__map(e, n) {
    const t = [];
    for (const n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
        const r = e[n];
        t.push(constant(n)), t.push(__PRIVATE_valueToDefaultExpr$1(r));
    }
    return new FunctionExpression("map", t, "map");
}

/**
 * Internal use only
 * Converts a plainObject to a mapValue in the proto representation,
 * rather than a functionValue+map that is the result of the map(...) function.
 * This behaves different from constant(plainObject) because it
 * traverses the input object, converts values in the object to expressions,
 * and calls _readUserData on each of these expressions.
 * @private
 * @internal
 * @param plainObject
 */
/**
 * @beta
 *
 * Creates an expression that creates a Firestore array value from an input array.
 *
 * @example
 * ```typescript
 * // Create an array value from the input array and reference the 'baz' field value from the input document.
 * array(['bar', field('baz')]).as('foo');
 * ```
 *
 * @param elements - The input array to evaluate in the expression.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the array function.
 */
function array(e) {
    return function __PRIVATE__array(e, n) {
        return new FunctionExpression("array", e.map((e => __PRIVATE_valueToDefaultExpr$1(e))), n);
    }(e, "array");
}

function equal(e, n) {
    const t = e instanceof Expression ? e : field(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.equal(r);
}

function notEqual(e, n) {
    const t = e instanceof Expression ? e : field(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.notEqual(r);
}

function lessThan(e, n) {
    const t = e instanceof Expression ? e : field(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.lessThan(r);
}

function lessThanOrEqual(e, n) {
    const t = e instanceof Expression ? e : field(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.lessThanOrEqual(r);
}

function greaterThan(e, n) {
    const t = e instanceof Expression ? e : field(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.greaterThan(r);
}

function greaterThanOrEqual(e, n) {
    const t = e instanceof Expression ? e : field(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.greaterThanOrEqual(r);
}

function arrayConcat(e, n, ...t) {
    const r = t.map((e => __PRIVATE_valueToDefaultExpr$1(e)));
    return __PRIVATE_fieldOrExpression$1(e).arrayConcat(__PRIVATE_fieldOrExpression$1(n), ...r);
}

function arrayContains(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.arrayContains(r);
}

function arrayContainsAny(e, n) {
    // @ts-ignore implementation accepts both types
    return __PRIVATE_fieldOrExpression$1(e).arrayContainsAny(n);
}

function arrayContainsAll(e, n) {
    // @ts-ignore implementation accepts both types
    return __PRIVATE_fieldOrExpression$1(e).arrayContainsAll(n);
}

function arrayLength(e) {
    return __PRIVATE_fieldOrExpression$1(e).arrayLength();
}

function equalAny(e, n) {
    // @ts-ignore implementation accepts both types
    return __PRIVATE_fieldOrExpression$1(e).equalAny(n);
}

function notEqualAny(e, n) {
    // @ts-ignore implementation accepts both types
    return __PRIVATE_fieldOrExpression$1(e).notEqualAny(n);
}

/**
 * @beta
 *
 * Creates an expression that performs a logical 'XOR' (exclusive OR) operation on multiple BooleanExpressions.
 *
 * @example
 * ```typescript
 * // Check if only one of the conditions is true: 'age' greater than 18, 'city' is "London",
 * // or 'status' is "active".
 * const condition = xor(
 *     greaterThan("age", 18),
 *     equal("city", "London"),
 *     equal("status", "active"));
 * ```
 *
 * @param first - The first condition.
 * @param second - The second condition.
 * @param additionalConditions - Additional conditions to 'XOR' together.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical 'XOR' operation.
 */ function xor(e, n, ...t) {
    return new FunctionExpression("xor", [ e, n, ...t ], "xor").asBoolean();
}

/**
 * @beta
 *
 * Creates a conditional expression that evaluates to a 'then' expression if a condition is true
 * and an 'else' expression if the condition is false.
 *
 * @example
 * ```typescript
 * // If 'age' is greater than 18, return "Adult"; otherwise, return "Minor".
 * conditional(
 *     greaterThan("age", 18), constant("Adult"), constant("Minor"));
 * ```
 *
 * @param condition - The condition to evaluate.
 * @param thenExpr - The expression to evaluate if the condition is true.
 * @param elseExpr - The expression to evaluate if the condition is false.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the conditional expression.
 */ function conditional(e, n, t) {
    return new FunctionExpression("conditional", [ e, n, t ], "conditional");
}

/**
 * @beta
 *
 * Creates an expression that negates a filter condition.
 *
 * @example
 * ```typescript
 * // Find documents where the 'completed' field is NOT true
 * not(equal("completed", true));
 * ```
 *
 * @param booleanExpr - The filter condition to negate.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the negated filter condition.
 */ function not(e) {
    return e.not();
}

function logicalMaximum(e, n, ...t) {
    return __PRIVATE_fieldOrExpression$1(e).logicalMaximum(__PRIVATE_valueToDefaultExpr$1(n), ...t.map((e => __PRIVATE_valueToDefaultExpr$1(e))));
}

function logicalMinimum(e, n, ...t) {
    return __PRIVATE_fieldOrExpression$1(e).logicalMinimum(__PRIVATE_valueToDefaultExpr$1(n), ...t.map((e => __PRIVATE_valueToDefaultExpr$1(e))));
}

function exists(e) {
    return __PRIVATE_fieldOrExpression$1(e).exists();
}

function reverse(e) {
    return __PRIVATE_fieldOrExpression$1(e).reverse();
}

function byteLength(e) {
    return __PRIVATE_fieldOrExpression$1(e).byteLength();
}

function exp(e) {
    return __PRIVATE_fieldOrExpression$1(e).exp();
}

function ceil(e) {
    return __PRIVATE_fieldOrExpression$1(e).ceil();
}

function floor(e) {
    return __PRIVATE_fieldOrExpression$1(e).floor();
}

/**
 * @beta
 * Creates an aggregation that counts the number of distinct values of a field.
 *
 * @param expr - The expression or field to count distinct values of.
 * @returns A new `AggregateFunction` representing the 'count_distinct' aggregation.
 */ function countDistinct(e) {
    return __PRIVATE_fieldOrExpression$1(e).countDistinct();
}

function charLength(e) {
    return __PRIVATE_fieldOrExpression$1(e).charLength();
}

function like(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.like(r);
}

function regexContains(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.regexContains(r);
}

function arrayFirst(e) {
    return __PRIVATE_fieldOrExpression$1(e).arrayFirst();
}

function arrayFirstN(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).arrayFirstN(__PRIVATE_valueToDefaultExpr$1(n));
}

function arrayLast(e) {
    return __PRIVATE_fieldOrExpression$1(e).arrayLast();
}

function arrayLastN(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).arrayLastN(__PRIVATE_valueToDefaultExpr$1(n));
}

function arrayMaximum(e) {
    return __PRIVATE_fieldOrExpression$1(e).arrayMaximum();
}

function arrayMaximumN(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).arrayMaximumN(__PRIVATE_valueToDefaultExpr$1(n));
}

function arrayMinimum(e) {
    return __PRIVATE_fieldOrExpression$1(e).arrayMinimum();
}

function arrayMinimumN(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).arrayMinimumN(__PRIVATE_valueToDefaultExpr$1(n));
}

function arrayIndexOf(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).arrayIndexOf(__PRIVATE_valueToDefaultExpr$1(n));
}

function arrayLastIndexOf(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).arrayLastIndexOf(__PRIVATE_valueToDefaultExpr$1(n));
}

function arrayIndexOfAll(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).arrayIndexOfAll(__PRIVATE_valueToDefaultExpr$1(n));
}

function regexFind(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.regexFind(r);
}

function regexFindAll(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.regexFindAll(r);
}

function regexMatch(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.regexMatch(r);
}

function stringContains(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_valueToDefaultExpr$1(n);
    return t.stringContains(r);
}

function startsWith(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).startsWith(__PRIVATE_valueToDefaultExpr$1(n));
}

function endsWith(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).endsWith(__PRIVATE_valueToDefaultExpr$1(n));
}

function toLower(e) {
    return __PRIVATE_fieldOrExpression$1(e).toLower();
}

function toUpper(e) {
    return __PRIVATE_fieldOrExpression$1(e).toUpper();
}

function trim(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).trim(n);
}

function ltrim(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).ltrim(n);
}

function rtrim(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).rtrim(n);
}

function type(e) {
    return __PRIVATE_fieldOrExpression$1(e).type();
}

function isType(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).isType(n);
}

function stringConcat(e, n, ...t) {
    return __PRIVATE_fieldOrExpression$1(e).stringConcat(__PRIVATE_valueToDefaultExpr$1(n), ...t.map(__PRIVATE_valueToDefaultExpr$1));
}

function stringIndexOf(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).stringIndexOf(n);
}

function stringRepeat(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).stringRepeat(n);
}

function stringReplaceAll(e, n, t) {
    return __PRIVATE_fieldOrExpression$1(e).stringReplaceAll(n, t);
}

function stringReplaceOne(e, n, t) {
    return __PRIVATE_fieldOrExpression$1(e).stringReplaceOne(n, t);
}

function mapGet(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).mapGet(n);
}

function mapSet(e, n, t, ...r) {
    return __PRIVATE_fieldOrExpression$1(e).mapSet(n, t, ...r);
}

function mapKeys(e) {
    return __PRIVATE_fieldOrExpression$1(e).mapKeys();
}

function mapValues(e) {
    return __PRIVATE_fieldOrExpression$1(e).mapValues();
}

function mapEntries(e) {
    return __PRIVATE_fieldOrExpression$1(e).mapEntries();
}

/**
 * @beta
 *
 * Creates an aggregation that counts the total number of stage inputs.
 *
 * @example
 * ```typescript
 * // Count the total number of input documents
 * countAll().as("totalDocument");
 * ```
 *
 * @returns A new {@link @firebase/firestore/pipelines#AggregateFunction} representing the 'countAll' aggregation.
 */ function countAll() {
    return AggregateFunction._create("count", [], "count");
}

function count(e) {
    return __PRIVATE_fieldOrExpression$1(e).count();
}

function sum(e) {
    return __PRIVATE_fieldOrExpression$1(e).sum();
}

function average(e) {
    return __PRIVATE_fieldOrExpression$1(e).average();
}

function minimum(e) {
    return __PRIVATE_fieldOrExpression$1(e).minimum();
}

function maximum(e) {
    return __PRIVATE_fieldOrExpression$1(e).maximum();
}

function first(e) {
    return __PRIVATE_fieldOrExpression$1(e).first();
}

function last(e) {
    return __PRIVATE_fieldOrExpression$1(e).last();
}

function arrayAgg(e) {
    return __PRIVATE_fieldOrExpression$1(e).arrayAgg();
}

function arrayAggDistinct(e) {
    return __PRIVATE_fieldOrExpression$1(e).arrayAggDistinct();
}

function cosineDistance(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_vectorToExpr$1(n);
    return t.cosineDistance(r);
}

function dotProduct(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_vectorToExpr$1(n);
    return t.dotProduct(r);
}

function euclideanDistance(e, n) {
    const t = __PRIVATE_fieldOrExpression$1(e), r = __PRIVATE_vectorToExpr$1(n);
    return t.euclideanDistance(r);
}

function vectorLength(e) {
    return __PRIVATE_fieldOrExpression$1(e).vectorLength();
}

function unixMicrosToTimestamp(e) {
    return __PRIVATE_fieldOrExpression$1(e).unixMicrosToTimestamp();
}

function timestampToUnixMicros(e) {
    return __PRIVATE_fieldOrExpression$1(e).timestampToUnixMicros();
}

function unixMillisToTimestamp(e) {
    return __PRIVATE_fieldOrExpression$1(e).unixMillisToTimestamp();
}

function timestampToUnixMillis(e) {
    return __PRIVATE_fieldOrExpression$1(e).timestampToUnixMillis();
}

function unixSecondsToTimestamp(e) {
    return __PRIVATE_fieldOrExpression$1(e).unixSecondsToTimestamp();
}

function timestampToUnixSeconds(e) {
    return __PRIVATE_fieldOrExpression$1(e).timestampToUnixSeconds();
}

function timestampAdd(e, n, t) {
    const r = __PRIVATE_fieldOrExpression$1(e), i = __PRIVATE_valueToDefaultExpr$1(n), s = __PRIVATE_valueToDefaultExpr$1(t);
    return r.timestampAdd(i, s);
}

function timestampSubtract(e, n, t) {
    const r = __PRIVATE_fieldOrExpression$1(e), i = __PRIVATE_valueToDefaultExpr$1(n), s = __PRIVATE_valueToDefaultExpr$1(t);
    return r.timestampSubtract(i, s);
}

/**
 * @beta
 *
 * Creates an expression that evaluates to the current server timestamp.
 *
 * @example
 * ```typescript
 * // Get the current server timestamp
 * currentTimestamp()
 * ```
 *
 * @returns A new Expression representing the current server timestamp.
 */ function currentTimestamp() {
    return new FunctionExpression("current_timestamp", [], "currentTimestamp");
}

/**
 * @beta
 *
 * Creates an expression that performs a logical 'AND' operation on multiple filter conditions.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is greater than 18 AND the 'city' field is "London" AND
 * // the 'status' field is "active"
 * const condition = and(greaterThan("age", 18), equal("city", "London"), equal("status", "active"));
 * ```
 *
 * @param first - The first filter condition.
 * @param second - The second filter condition.
 * @param more - Additional filter conditions to 'AND' together.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical 'AND' operation.
 */ function and(e, n, ...t) {
    return new FunctionExpression("and", [ e, n, ...t ], "and").asBoolean();
}

/**
 * @beta
 *
 * Creates an expression that performs a logical 'OR' operation on multiple filter conditions.
 *
 * @example
 * ```typescript
 * // Check if the 'age' field is greater than 18 OR the 'city' field is "London" OR
 * // the 'status' field is "active"
 * const condition = or(greaterThan("age", 18), equal("city", "London"), equal("status", "active"));
 * ```
 *
 * @param first - The first filter condition.
 * @param second - The second filter condition.
 * @param more - Additional filter conditions to 'OR' together.
 * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical 'OR' operation.
 */ function or(e, n, ...t) {
    return new FunctionExpression("or", [ e, n, ...t ], "xor").asBoolean();
}

function pow(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).pow(n);
}

/**
 * @beta
 *
 * Creates an expression that generates a random number between 0.0 and 1.0 but not including 1.0.
 *
 * @example
 * ```typescript
 * // Generate a random number between 0.0 and 1.0.
 * rand();
 * ```
 *
 * @returns A new `Expression` representing the rand operation.
 */ function rand() {
    return new FunctionExpression("rand", [], "rand");
}

function round(e, n) {
    return void 0 === n ? __PRIVATE_fieldOrExpression$1(e).round() : __PRIVATE_fieldOrExpression$1(e).round(__PRIVATE_valueToDefaultExpr$1(n));
}

function trunc(e, n) {
    return void 0 === n ? __PRIVATE_fieldOrExpression$1(e).trunc() : __PRIVATE_fieldOrExpression$1(e).trunc(__PRIVATE_valueToDefaultExpr$1(n));
}

function collectionId(e) {
    return __PRIVATE_fieldOrExpression$1(e).collectionId();
}

function length(e) {
    return __PRIVATE_fieldOrExpression$1(e).length();
}

function ln(e) {
    return __PRIVATE_fieldOrExpression$1(e).ln();
}

function log(e, n) {
    return new FunctionExpression("log", [ __PRIVATE_fieldOrExpression$1(e), __PRIVATE_valueToDefaultExpr$1(n) ]);
}

function sqrt(e) {
    return __PRIVATE_fieldOrExpression$1(e).sqrt();
}

function stringReverse(e) {
    return __PRIVATE_fieldOrExpression$1(e).stringReverse();
}

function concat(e, n, ...t) {
    return new FunctionExpression("concat", [ __PRIVATE_fieldOrExpression$1(e), __PRIVATE_valueToDefaultExpr$1(n), ...t.map(__PRIVATE_valueToDefaultExpr$1) ]);
}

function abs(e) {
    return __PRIVATE_fieldOrExpression$1(e).abs();
}

function ifAbsent(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).ifAbsent(__PRIVATE_valueToDefaultExpr$1(n));
}

function join(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).join(__PRIVATE_valueToDefaultExpr$1(n));
}

function log10(e) {
    return __PRIVATE_fieldOrExpression$1(e).log10();
}

function arraySum(e) {
    return __PRIVATE_fieldOrExpression$1(e).arraySum();
}

function split(e, n) {
    return __PRIVATE_fieldOrExpression$1(e).split(__PRIVATE_valueToDefaultExpr$1(n));
}

function timestampTruncate(e, n, t) {
    const r = __PRIVATE_isString(n) ? __PRIVATE_valueToDefaultExpr$1(n.toLowerCase()) : n;
    return __PRIVATE_fieldOrExpression$1(e).timestampTruncate(r, t);
}

function ascending(e) {
    return new Ordering(__PRIVATE_fieldOrExpression$1(e), "ascending", "ascending");
}

function descending(e) {
    return new Ordering(__PRIVATE_fieldOrExpression$1(e), "descending", "descending");
}

/**
 * @beta
 *
 * Represents an ordering criterion for sorting documents in a Firestore pipeline.
 *
 * You create `Ordering` instances using the `ascending` and `descending` helper functions.
 */ class Ordering {
    constructor(e, n, t) {
        this.expr = e, this.direction = n, this._methodName = t, this._protoValueType = "ProtoValue";
    }
    /**
     * @private
     * @internal
     */    _toProto(e) {
        return {
            mapValue: {
                fields: {
                    direction: __PRIVATE_toStringValue(this.direction),
                    expression: this.expr._toProto(e)
                }
            }
        };
    }
    /**
     * @private
     * @internal
     */    _readUserData(e) {
        this.expr._readUserData(e);
    }
}

function __PRIVATE_isSelectable(e) {
    const n = e;
    return n.selectable && __PRIVATE_isString(n.alias) && __PRIVATE_isExpr(n.expr);
}

function __PRIVATE_isOrdering(e) {
    const n = e;
    return __PRIVATE_isExpr(n.expr) && ("ascending" === n.direction || "descending" === n.direction);
}

function __PRIVATE_isAliasedAggregate(e) {
    const n = e;
    return __PRIVATE_isString(n.alias) && n.aggregate instanceof AggregateFunction;
}

function __PRIVATE_isExpr(e) {
    return e instanceof Expression;
}

function __PRIVATE_isBooleanExpr(e) {
    return e instanceof BooleanExpression;
}

function __PRIVATE_isField(e) {
    return e instanceof Field;
}

function __PRIVATE_toField(e) {
    if (__PRIVATE_isString(e)) {
        return field(e);
    }
    return e;
}

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
/* eslint @typescript-eslint/no-explicit-any: 0 */ function __PRIVATE_toPipelineBooleanExpr(e) {
    if (e instanceof FieldFilter) {
        const n = field(e.field.toString()), t = e.value;
        // Comparison filters
                switch (e.op) {
          case "<" /* Operator.LESS_THAN */ :
            return and(n.exists(), n.lessThan(Constant._fromProto(t)));

          case "<=" /* Operator.LESS_THAN_OR_EQUAL */ :
            return and(n.exists(), n.lessThanOrEqual(Constant._fromProto(t)));

          case ">" /* Operator.GREATER_THAN */ :
            return and(n.exists(), n.greaterThan(Constant._fromProto(t)));

          case ">=" /* Operator.GREATER_THAN_OR_EQUAL */ :
            return and(n.exists(), n.greaterThanOrEqual(Constant._fromProto(t)));

          case "==" /* Operator.EQUAL */ :
            return and(n.exists(), n.equal(Constant._fromProto(t)));

          case "!=" /* Operator.NOT_EQUAL */ :
            return n.notEqual(Constant._fromProto(t));

          case "array-contains" /* Operator.ARRAY_CONTAINS */ :
            return and(n.exists(), n.arrayContains(Constant._fromProto(t)));

          case "in" /* Operator.IN */ :
            {
                const e = t?.arrayValue?.values?.map((e => Constant._fromProto(e)));
                return e ? 1 === e.length ? and(n.exists(), n.equal(e[0])) : and(n.exists(), n.equalAny(e)) : and(n.exists(), n.equalAny([]));
            }

          case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */ :
            {
                const e = t?.arrayValue?.values?.map((e => Constant._fromProto(e)));
                return and(n.exists(), n.arrayContainsAny(e));
            }

          case "not-in" /* Operator.NOT_IN */ :
            {
                const e = t?.arrayValue?.values?.map((e => Constant._fromProto(e)));
                return e ? 1 === e.length ? n.notEqual(e[0]) : n.notEqualAny(e) : n.notEqualAny([]);
            }

          default:
            fail(36935);
        }
    } else if (e instanceof CompositeFilter) switch (e.op) {
      case "and" /* CompositeOperator.AND */ :
        {
            const n = e.getFilters().map((e => __PRIVATE_toPipelineBooleanExpr(e)));
            return and(n[0], n[1], ...n.slice(2));
        }

      case "or" /* CompositeOperator.OR */ :
        {
            const n = e.getFilters().map((e => __PRIVATE_toPipelineBooleanExpr(e)));
            return or(n[0], n[1], ...n.slice(2));
        }

      default:
        fail(35306);
    }
    throw new Error(`Failed to convert filter to pipeline conditions: ${e}`);
}

function __PRIVATE_toPipeline(e, n) {
    let t;
    t = __PRIVATE_isCollectionGroupQuery(e) ? n.pipeline().collectionGroup(e.collectionGroup) : __PRIVATE_isDocumentQuery(e) ? n.pipeline().documents([ doc(n, e.path.canonicalString()) ]) : n.pipeline().collection(e.path.canonicalString());
    // filters
        for (const n of e.filters) t = t.where(__PRIVATE_toPipelineBooleanExpr(n));
    // orders
        const r = __PRIVATE_queryNormalizedOrderBy(e), i = e.explicitOrderBy.map((e => field(e.field.canonicalString()).exists()));
    if (i.length > 0) {
        const e = 1 === i.length ? i[0] : and(i[0], i[1], ...i.slice(2));
        t = t.where(e);
    }
    const s = r.map((e => "asc" /* Direction.ASCENDING */ === e.dir ? field(e.field.canonicalString()).ascending() : field(e.field.canonicalString()).descending()));
    if (s.length > 0) if ("L" /* LimitType.Last */ === e.limitType) {
        const n = function __PRIVATE_reverseOrderings(e) {
            return e.map((e => new Ordering(e.expr, "ascending" === e.direction ? "descending" : "ascending", void 0)));
        }(s);
        t = t.sort(n[0], ...n.slice(1)), 
        // cursors
        null !== e.startAt && (t = t.where(__PRIVATE_whereConditionsFromCursor(e.startAt, s, "after"))), 
        null !== e.endAt && (t = t.where(__PRIVATE_whereConditionsFromCursor(e.endAt, s, "before"))), 
        t = t.limit(e.limit), t = t.sort(s[0], ...s.slice(1));
    } else t = t.sort(s[0], ...s.slice(1)), null !== e.startAt && (t = t.where(__PRIVATE_whereConditionsFromCursor(e.startAt, s, "after"))), 
    null !== e.endAt && (t = t.where(__PRIVATE_whereConditionsFromCursor(e.endAt, s, "before"))), 
    null !== e.limit && (t = t.limit(e.limit));
    return t;
}

function __PRIVATE_whereConditionsFromCursor(e, n, t) {
    // The filterFunc is either greater than or less than
    const r = "before" === t ? lessThan : greaterThan, i = e.position.map((e => Constant._fromProto(e))), s = i.length;
    let o = n[s - 1].expr, a = i[s - 1], u = r(o, a);
    e.inclusive && (
    // When the cursor bound is inclusive, then the last bound
    // can be equal to the value, otherwise it's not equal
    u = or(u, o.equal(a)));
    // Iterate backwards over the remaining bounds, adding
    // a condition for each one
        for (let e = s - 2; e >= 0; e--) o = n[e].expr, a = i[e], 
    // For each field in the orderings, the condition is either
    // a) lt|gt the cursor value,
    // b) or equal the cursor value and lt|gt the cursor values for other fields
    u = or(r(o, a), and(o.equal(a), u));
    return u;
}

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
/**
 * @beta
 */ class Stage {
    constructor(e) {
        /**
         * Store optionsProto parsed by _readUserData.
         * @private
         * @internal
         * @protected
         */
        this.optionsProto = void 0, ({rawOptions: this.rawOptions, ...this.knownOptions} = e);
    }
    _readUserData(e) {
        this.optionsProto = this._optionsUtil.getOptionsProto(e, this.knownOptions, this.rawOptions);
    }
    _toProto(e) {
        return {
            name: this._name,
            options: this.optionsProto
        };
    }
}

/**
 * @beta
 */ class __PRIVATE_AddFields extends Stage {
    get _name() {
        return "add_fields";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.fields = e;
    }
    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ __PRIVATE_toMapValue(e, this.fields) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.fields, e);
    }
}

/**
 * @beta
 */ class __PRIVATE_RemoveFields extends Stage {
    get _name() {
        return "remove_fields";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.fields = e;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: this.fields.map((n => n._toProto(e)))
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.fields, e);
    }
}

/**
 * @beta
 */ class __PRIVATE_Aggregate extends Stage {
    get _name() {
        return "aggregate";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n, t) {
        super(t), this.groups = e, this.accumulators = n;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ __PRIVATE_toMapValue(e, this.accumulators), __PRIVATE_toMapValue(e, this.groups) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.groups, e), __PRIVATE_readUserDataHelper(this.accumulators, e);
    }
}

/**
 * @beta
 */ class __PRIVATE_Distinct extends Stage {
    get _name() {
        return "distinct";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.groups = e;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ __PRIVATE_toMapValue(e, this.groups) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.groups, e);
    }
}

/**
 * @beta
 */ class __PRIVATE_CollectionSource extends Stage {
    get _name() {
        return "collection";
    }
    get _optionsUtil() {
        return new OptionsUtil({
            forceIndex: {
                serverName: "force_index"
            }
        });
    }
    constructor(e, n) {
        super(n), 
        // prepend slash to collection string
        this.se = e.startsWith("/") ? e : "/" + e;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ {
                referenceValue: this.se
            } ]
        };
    }
    _readUserData(e) {
        super._readUserData(e);
    }
}

/**
 * @beta
 */ class __PRIVATE_CollectionGroupSource extends Stage {
    get _name() {
        return "collection_group";
    }
    get _optionsUtil() {
        return new OptionsUtil({
            forceIndex: {
                serverName: "force_index"
            }
        });
    }
    constructor(e, n) {
        super(n), this.collectionId = e;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ {
                referenceValue: ""
            }, {
                stringValue: this.collectionId
            } ]
        };
    }
    _readUserData(e) {
        super._readUserData(e);
    }
}

/**
 * @beta
 */ class __PRIVATE_DatabaseSource extends Stage {
    get _name() {
        return "database";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e)
        };
    }
    _readUserData(e) {
        super._readUserData(e);
    }
}

/**
 * @beta
 */ class __PRIVATE_DocumentsSource extends Stage {
    get _name() {
        return "documents";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.oe = e.map((e => e.startsWith("/") ? e : "/" + e));
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: this.oe.map((e => ({
                referenceValue: e
            })))
        };
    }
    _readUserData(e) {
        super._readUserData(e);
    }
}

/**
 * @beta
 */ class __PRIVATE_Where extends Stage {
    get _name() {
        return "where";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.condition = e;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ this.condition._toProto(e) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.condition, e);
    }
}

/**
 * @beta
 */ class __PRIVATE_FindNearest extends Stage {
    get _name() {
        return "find_nearest";
    }
    get _optionsUtil() {
        return new OptionsUtil({
            limit: {
                serverName: "limit"
            },
            distanceField: {
                serverName: "distance_field"
            }
        });
    }
    constructor(e, n, t, r) {
        super(r), this.vectorValue = e, this.field = n, this.distanceMeasure = t;
    }
    /**
     * @private
     * @internal
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ this.field._toProto(e), this.vectorValue._toProto(e), __PRIVATE_toStringValue(this.distanceMeasure) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.vectorValue, e), __PRIVATE_readUserDataHelper(this.field, e);
    }
}

/**
 * @beta
 */ class __PRIVATE_Limit extends Stage {
    get _name() {
        return "limit";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        __PRIVATE_hardAssert(!isNaN(e) && e !== 1 / 0 && e !== -1 / 0, 34860), super(n), this.limit = e;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ toNumber(e, this.limit) ]
        };
    }
}

/**
 * @beta
 */ class __PRIVATE_Offset extends Stage {
    get _name() {
        return "offset";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.offset = e;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ toNumber(e, this.offset) ]
        };
    }
}

/**
 * @beta
 */ class __PRIVATE_Select extends Stage {
    get _name() {
        return "select";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.selections = e;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ __PRIVATE_toMapValue(e, this.selections) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.selections, e);
    }
}

/**
 * @beta
 */ class __PRIVATE_Sort extends Stage {
    get _name() {
        return "sort";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.orderings = e;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            ...super._toProto(e),
            args: this.orderings.map((n => n._toProto(e)))
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.orderings, e);
    }
}

/**
 * @beta
 */ class __PRIVATE_Sample extends Stage {
    get _name() {
        return "sample";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n, t) {
        super(t), this.rate = e, this.mode = n;
    }
    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ toNumber(e, this.rate), __PRIVATE_toStringValue(this.mode) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e);
    }
}

/**
 * @beta
 */ class __PRIVATE_Union extends Stage {
    get _name() {
        return "union";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.other = e;
    }
    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ __PRIVATE_toPipelineValue(this.other._toProto(e)) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e);
    }
}

/**
 * @beta
 */ class __PRIVATE_Unnest extends Stage {
    get _name() {
        return "unnest";
    }
    get _optionsUtil() {
        return new OptionsUtil({
            indexField: {
                serverName: "index_field"
            }
        });
    }
    constructor(e, n, t) {
        super(t), this.alias = e, this.expr = n;
    }
    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ this.expr._toProto(e), field(this.alias)._toProto(e) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.expr, e);
    }
}

/**
 * @beta
 */ class __PRIVATE_Replace extends Stage {
    get _name() {
        return "replace_with";
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(e, n) {
        super(n), this.map = e;
    }
    _toProto(e) {
        return {
            ...super._toProto(e),
            args: [ this.map._toProto(e), __PRIVATE_toStringValue(__PRIVATE_Replace.ae) ]
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.map, e);
    }
}

__PRIVATE_Replace.ae = "full_replace";

/**
 * @beta
 */
class __PRIVATE_RawStage extends Stage {
    /**
     * @private
     * @internal
     */
    constructor(e, n, t) {
        super({
            rawOptions: t
        }), this.name = e, this.params = n;
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            name: this.name,
            args: this.params.map((n => n._toProto(e))),
            options: this.optionsProto
        };
    }
    _readUserData(e) {
        super._readUserData(e), __PRIVATE_readUserDataHelper(this.params, e);
    }
    get _name() {
        return this.name;
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
}

/**
 * Helper to read user data across a number of different formats.
 * @param name - Name of the calling function. Used for error messages when invalid user data is encountered.
 * @param expressionMap
 * @returns the expressionMap argument.
 * @private
 */ function __PRIVATE_readUserDataHelper(e, n) {
    return __PRIVATE_isUserData(e) ? e._readUserData(n) : Array.isArray(e) ? e.forEach((e => e._readUserData(n))) : e.forEach((e => e._readUserData(n))), 
    e;
}

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
/**
 * @beta
 * Provides the entry point for defining the data source of a Firestore {@link @firebase/firestore/pipelines#Pipeline}.
 *
 * Use the methods of this class (e.g., {@link @firebase/firestore/pipelines#PipelineSource.(collection:1)}, {@link @firebase/firestore/pipelines#PipelineSource.(collectionGroup:1)},
 * {@link @firebase/firestore/pipelines#PipelineSource.(database:1)}, or {@link @firebase/firestore/pipelines#PipelineSource.(documents:1)}) to specify the initial data
 * for your pipeline, such as a collection, a collection group, the entire database, or a set of specific documents.
 */ class PipelineSource {
    /**
     * @internal
     * @private
     * @param databaseId
     * @param _createPipeline
     */
    constructor(e, 
    /**
     * @internal
     * @private
     */
    n) {
        this.databaseId = e, this._createPipeline = n;
    }
    collection(e) {
        // Process argument union(s) from method overloads
        const n = __PRIVATE_isString(e) || __PRIVATE_isCollectionReference(e) ? {} : e, t = __PRIVATE_isString(e) || __PRIVATE_isCollectionReference(e) ? e : e.collection;
        // Validate that a user provided reference is for the same Firestore DB
        __PRIVATE_isCollectionReference(t) && this._validateReference(t);
        // Convert user land convenience types to internal types
                const r = __PRIVATE_isString(t) ? t : t.path, i = new __PRIVATE_CollectionSource(r, n);
        // Create stage object
                // Add stage to the pipeline
        return this._createPipeline([ i ]);
    }
    collectionGroup(e) {
        // Process argument union(s) from method overloads
        let n, t;
        __PRIVATE_isString(e) ? (n = e, t = {}) : ({collectionId: n, ...t} = e);
        // Create stage object
                const r = new __PRIVATE_CollectionGroupSource(n, t);
        // Add stage to the pipeline
                return this._createPipeline([ r ]);
    }
    database(e) {
        // Create stage object
        const n = new __PRIVATE_DatabaseSource(
        // Process argument union(s) from method overloads
        e = e ?? {});
        // Add stage to the pipeline
                return this._createPipeline([ n ]);
    }
    documents(e) {
        // Process argument union(s) from method overloads
        let n, t;
        Array.isArray(e) ? (t = e, n = {}) : ({docs: t, ...n} = e), 
        // Validate that all user provided references are for the same Firestore DB
        t.filter((e => e instanceof DocumentReference)).forEach((e => this._validateReference(e)));
        // Convert user land convenience types to internal types
        const r = t.map((e => __PRIVATE_isString(e) ? e : e.path)), i = new __PRIVATE_DocumentsSource(r, n);
        // Create stage object
                // Add stage to the pipeline
        return this._createPipeline([ i ]);
    }
    /**
     * @beta
     * Convert the given Query into an equivalent Pipeline.
     *
     * @param query - A Query to be converted into a Pipeline.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */    createFrom(e) {
        return __PRIVATE_toPipeline(e._query, e.firestore);
    }
    _validateReference(e) {
        const n = e.firestore._databaseId;
        if (!n.isEqual(this.databaseId)) throw new FirestoreError(E.INVALID_ARGUMENT, `Invalid ${e instanceof CollectionReference ? "CollectionReference" : "DocumentReference"}. The project ID ("${n.projectId}") or the database ("${n.database}") does not match the project ID ("${this.databaseId.projectId}") and database ("${this.databaseId.database}") of the target database of this Pipeline.`);
    }
}

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
/**
 * @beta
 * Represents the results of a Firestore pipeline execution.
 *
 * A `PipelineSnapshot` contains zero or more {@link @firebase/firestore/pipelines#PipelineResult} objects
 * representing the documents returned by a pipeline query. It provides methods
 * to iterate over the documents and access metadata about the query results.
 *
 * @example
 * ```typescript
 * const snapshot: PipelineSnapshot = await firestore
 *   .pipeline()
 *   .collection('myCollection')
 *   .where(field('value').greaterThan(10))
 *   .execute();
 *
 * snapshot.results.forEach(doc => {
 *   console.log(doc.id, '=>', doc.data());
 * });
 * ```
 */ class PipelineSnapshot {
    constructor(e, n, t) {
        this._pipeline = e, this._executionTime = t, this._results = n;
    }
    /**
     * @beta An array of all the results in the `PipelineSnapshot`.
     */    get results() {
        return this._results;
    }
    /**
     * @beta
     * The time at which the pipeline producing this result is executed.
     *
     * @readonly
     *
     */    get executionTime() {
        if (void 0 === this._executionTime) throw new Error("'executionTime' is expected to exist, but it is undefined");
        return this._executionTime;
    }
}

/**
 * @beta
 *
 * A PipelineResult contains data read from a Firestore Pipeline. The data can be extracted with the
 * {@link @firebase/firestore/pipelines#PipelineResult.data} or {@link @firebase/firestore/pipelines#PipelineResult.(get:1)} methods.
 *
 * <p>If the PipelineResult represents a non-document result, `ref` will return a undefined
 * value.
 */ class PipelineResult {
    /**
     * @private
     * @internal
     *
     * @param userDataWriter - The serializer used to encode/decode protobuf.
     * @param ref - The reference to the document.
     * @param fields - The fields of the Firestore `Document` Protobuf backing
     * this document.
     * @param createTime - The time when the document was created if the result is a document, undefined otherwise.
     * @param updateTime - The time when the document was last updated if the result is a document, undefined otherwise.
     */
    constructor(e, n, t, r, i) {
        this._ref = t, this._userDataWriter = e, this._createTime = r, this._updateTime = i, 
        this._fields = n;
    }
    /**
     * @beta
     * The reference of the document, if it is a document; otherwise `undefined`.
     */    get ref() {
        return this._ref;
    }
    /**
     * @beta
     * The ID of the document for which this PipelineResult contains data, if it is a document; otherwise `undefined`.
     *
     * @readonly
     *
     */    get id() {
        return this._ref?.id;
    }
    /**
     * @beta
     * The time the document was created. Undefined if this result is not a document.
     *
     * @readonly
     */    get createTime() {
        return this._createTime;
    }
    /**
     * @beta
     * The time the document was last updated (at the time the snapshot was
     * generated). Undefined if this result is not a document.
     *
     * @readonly
     */    get updateTime() {
        return this._updateTime;
    }
    /**
     * @beta
     * Retrieves all fields in the result as an object.
     *
     * @returns An object containing all fields in the document or
     * 'undefined' if the document doesn't exist.
     *
     * @example
     * ```
     * let p = firestore.pipeline().collection('col');
     *
     * p.execute().then(results => {
     *   let data = results[0].data();
     *   console.log(`Retrieved data: ${JSON.stringify(data)}`);
     * });
     * ```
     */    data() {
        return this._userDataWriter.convertValue(this._fields.value);
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the result as a proto value.
     *
     * @returns An `Object` containing all fields in the result.
     */    _fieldsProto() {
        // Return a cloned value to prevent manipulation of the Snapshot's data
        return this._fields.clone().value.mapValue.fields;
    }
    /**
     * @beta
     * Retrieves the field specified by `field`.
     *
     * @param field - The field path
     * (e.g. 'foo' or 'foo.bar') to a specific field.
     * @returns The data at the specified field location or `undefined` if no
     * such field exists.
     *
     * @example
     * ```
     * let p = firestore.pipeline().collection('col');
     *
     * p.execute().then(results => {
     *   let field = results[0].get('a.b');
     *   console.log(`Retrieved field value: ${field}`);
     * });
     * ```
     */
    // We deliberately use `any` in the external API to not impose type-checking
    // on end users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(e) {
        if (void 0 === this._fields) return;
        __PRIVATE_isField(e) && (e = e.fieldName);
        const n = this._fields.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
        return null !== n ? this._userDataWriter.convertValue(n) : void 0;
    }
}

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
 */ function __PRIVATE_selectablesToMap(e) {
    const n = new Map;
    for (const t of e) {
        let e, r;
        if ("string" == typeof t ? (e = t, r = field(t)) : t instanceof Field || t instanceof AliasedExpression ? (e = t.alias, 
        r = t.expr) : fail(21273, {
            selectable: t
        }), void 0 !== n.get(e)) throw new FirestoreError("invalid-argument", `Duplicate alias or field '${e}'`);
        n.set(e, r);
    }
    return n;
}

/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 * If the input is a string, it is assumed to be a field name, and a
 * field(value) is returned.
 *
 * @private
 * @internal
 * @param value
 */
function __PRIVATE_fieldOrExpression(e) {
    if (__PRIVATE_isString(e)) {
        return field(e);
    }
    /**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */
    return function __PRIVATE_valueToDefaultExpr(e) {
        let t;
        if (__PRIVATE_isFirestoreValue(e)) return constant(e);
        if (e instanceof Expression) return e;
        t = __PRIVATE_isPlainObject(e) ? map(e) : e instanceof Array ? array(e) : __PRIVATE__constant(e, void 0);
        return t;
    }
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
    /**
 * @beta
 *
 * The Pipeline class provides a flexible and expressive framework for building complex data
 * transformation and query pipelines for Firestore.
 *
 * A pipeline takes data sources, such as Firestore collections or collection groups, and applies
 * a series of stages that are chained together. Each stage takes the output from the previous stage
 * (or the data source) and produces an output for the next stage (or as the final output of the
 * pipeline).
 *
 * Expressions can be used within each stage to filter and transform data through the stage.
 *
 * NOTE: The chained stages do not prescribe exactly how Firestore will execute the pipeline.
 * Instead, Firestore only guarantees that the result is the same as if the chained stages were
 * executed in order.
 *
 * Usage Examples:
 *
 * @example
 * ```typescript
 * const db: Firestore; // Assumes a valid firestore instance.
 *
 * // Example 1: Select specific fields and rename 'rating' to 'bookRating'
 * const results1 = await execute(db.pipeline()
 *     .collection("books")
 *     .select("title", "author", field("rating").as("bookRating")));
 *
 * // Example 2: Filter documents where 'genre' is "Science Fiction" and 'published' is after 1950
 * const results2 = await execute(db.pipeline()
 *     .collection("books")
 *     .where(and(field("genre").equal("Science Fiction"), field("published").greaterThan(1950))));
 *
 * // Example 3: Calculate the average rating of books published after 1980
 * const results3 = await execute(db.pipeline()
 *     .collection("books")
 *     .where(field("published").greaterThan(1980))
 *     .aggregate(average(field("rating")).as("averageRating")));
 * ```
 */ (e);
}

class Pipeline {
    /**
     * @internal
     * @private
     * @param _db
     * @param stages
     */
    constructor(
    /**
     * @internal
     * @private
     */
    e, 
    /**
     * @internal
     * @private
     */
    n) {
        this._db = e, this.stages = n;
    }
    _readUserData(e) {
        this.stages.forEach((n => {
            const t = e.te({
                methodName: n._name
            });
            n._readUserData(t);
        }));
    }
    addFields(e, ...n) {
        // Process argument union(s) from method overloads
        let t, r;
        __PRIVATE_isSelectable(e) ? (t = [ e, ...n ], r = {}) : ({fields: t, ...r} = e);
        // Convert user land convenience types to internal types
                const i = __PRIVATE_selectablesToMap(t), s = new __PRIVATE_AddFields(i, r);
        // Create stage object
                // Add stage to the pipeline
        return this._addStage(s);
    }
    removeFields(e, ...n) {
        // Process argument union(s) from method overloads
        const t = __PRIVATE_isField(e) || __PRIVATE_isString(e) ? {} : e, r = (__PRIVATE_isField(e) || __PRIVATE_isString(e) ? [ e, ...n ] : e.fields).map((e => __PRIVATE_isString(e) ? field(e) : e)), i = new __PRIVATE_RemoveFields(r, t);
        // Add stage to the pipeline
        return this._addStage(i);
    }
    select(e, ...n) {
        // Process argument union(s) from method overloads
        const t = __PRIVATE_isSelectable(e) || __PRIVATE_isString(e) ? {} : e, r = __PRIVATE_selectablesToMap(__PRIVATE_isSelectable(e) || __PRIVATE_isString(e) ? [ e, ...n ] : e.selections), i = new __PRIVATE_Select(r, t);
        // Add stage to the pipeline
        return this._addStage(i);
    }
    where(e) {
        // Process argument union(s) from method overloads
        const n = __PRIVATE_isBooleanExpr(e) ? {} : e, t = __PRIVATE_isBooleanExpr(e) ? e : e.condition, r = new __PRIVATE_Where(t, n);
        // Add stage to the pipeline
        return this._addStage(r);
    }
    offset(e) {
        // Process argument union(s) from method overloads
        let n, t;
        __PRIVATE_isNumber(e) ? (n = {}, t = e) : (n = e, t = e.offset);
        // Create stage object
                const r = new __PRIVATE_Offset(t, n);
        // Add stage to the pipeline
                return this._addStage(r);
    }
    limit(e) {
        // Process argument union(s) from method overloads
        const n = __PRIVATE_isNumber(e) ? {} : e, t = __PRIVATE_isNumber(e) ? e : e.limit, r = new __PRIVATE_Limit(t, n);
        // Add stage to the pipeline
        return this._addStage(r);
    }
    distinct(e, ...n) {
        // Process argument union(s) from method overloads
        const t = __PRIVATE_isString(e) || __PRIVATE_isSelectable(e) ? {} : e, r = __PRIVATE_selectablesToMap(__PRIVATE_isString(e) || __PRIVATE_isSelectable(e) ? [ e, ...n ] : e.groups), i = new __PRIVATE_Distinct(r, t);
        // Add stage to the pipeline
        return this._addStage(i);
    }
    aggregate(e, ...n) {
        // Process argument union(s) from method overloads
        const t = __PRIVATE_isAliasedAggregate(e) ? {} : e, r = __PRIVATE_isAliasedAggregate(e) ? [ e, ...n ] : e.accumulators, i = __PRIVATE_isAliasedAggregate(e) ? [] : e.groups ?? [], s = function __PRIVATE_aliasedAggregateToMap(e) {
            return e.reduce(((e, n) => {
                if (void 0 !== e.get(n.alias)) throw new FirestoreError("invalid-argument", `Duplicate alias or field '${n.alias}'`);
                return e.set(n.alias, n.aggregate), e;
            }), new Map);
        }
        /**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */ (r), o = __PRIVATE_selectablesToMap(i), a = new __PRIVATE_Aggregate(o, s, t);
        // Add stage to the pipeline
        return this._addStage(a);
    }
    /**
     * @beta
     * Performs a vector proximity search on the documents from the previous stage, returning the
     * K-nearest documents based on the specified query `vectorValue` and `distanceMeasure`. The
     * returned documents will be sorted in order from nearest to furthest from the query `vectorValue`.
     *
     * <p>Example:
     *
     * ```typescript
     * // Find the 10 most similar books based on the book description.
     * const bookDescription = "Lorem ipsum...";
     * const queryVector: number[] = ...; // compute embedding of `bookDescription`
     *
     * firestore.pipeline().collection("books")
     *     .findNearest({
     *       field: 'embedding',
     *       vectorValue: queryVector,
     *       distanceMeasure: 'euclidean',
     *       limit: 10,                        // optional
     *       distanceField: 'computedDistance' // optional
     *     });
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */    findNearest(e) {
        // Convert user land convenience types to internal types
        const n = __PRIVATE_toField(e.field), t = function __PRIVATE_vectorToExpr(e) {
            if (e instanceof Expression) return e;
            if (e instanceof VectorValue) return constant(e);
            if (Array.isArray(e)) return constant(vector(e));
            throw new Error("Unsupported value: " + typeof e);
        }(e.vectorValue), r = {
            distanceField: e.distanceField ? __PRIVATE_toField(e.distanceField) : void 0,
            limit: e.limit,
            rawOptions: e.rawOptions
        }, i = new __PRIVATE_FindNearest(t, n, e.distanceMeasure, r);
        // Add stage to the pipeline
        return this._addStage(i);
    }
    sort(e, ...n) {
        // Process argument union(s) from method overloads
        const t = __PRIVATE_isOrdering(e) ? {} : e, r = __PRIVATE_isOrdering(e) ? [ e, ...n ] : e.orderings, i = new __PRIVATE_Sort(r, t);
        // Add stage to the pipeline
        return this._addStage(i);
    }
    replaceWith(e) {
        // Process argument union(s) from method overloads
        const n = __PRIVATE_isString(e) || __PRIVATE_isExpr(e) ? {} : e, t = __PRIVATE_fieldOrExpression(__PRIVATE_isString(e) || __PRIVATE_isExpr(e) ? e : e.map), r = new __PRIVATE_Replace(t, n);
        // Add stage to the pipeline
        return this._addStage(r);
    }
    sample(e) {
        // Process argument union(s) from method overloads
        const n = __PRIVATE_isNumber(e) ? {} : e;
        let t, r;
        __PRIVATE_isNumber(e) ? (t = e, r = "documents") : __PRIVATE_isNumber(e.documents) ? (t = e.documents, r = "documents") : (t = e.percentage, 
        r = "percent");
        // Create stage object
                const i = new __PRIVATE_Sample(t, r, n);
        // Add stage to the pipeline
                return this._addStage(i);
    }
    union(e) {
        // Process argument union(s) from method overloads
        let n, t;
        !function __PRIVATE_isPipeline(e) {
            return e instanceof Pipeline;
        }
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
        /**
 * @beta
 * Executes this pipeline and returns a Promise to represent the asynchronous operation.
 *
 * The returned Promise can be used to track the progress of the pipeline execution
 * and retrieve the results (or handle any errors) asynchronously.
 *
 * The pipeline results are returned as a {@link @firebase/firestore/pipelines#PipelineSnapshot} that contains
 * a list of {@link @firebase/firestore/pipelines#PipelineResult} objects. Each {@link @firebase/firestore/pipelines#PipelineResult} typically
 * represents a single key/value map that has passed through all the
 * stages of the pipeline, however this might differ depending on the stages involved in the
 * pipeline. For example:
 *
 * <ul>
 *   <li>If there are no stages or only transformation stages, each {@link @firebase/firestore/pipelines#PipelineResult}
 *       represents a single document.</li>
 *   <li>If there is an aggregation, only a single {@link @firebase/firestore/pipelines#PipelineResult} is returned,
 *       representing the aggregated results over the entire dataset .</li>
 *   <li>If there is an aggregation stage with grouping, each {@link @firebase/firestore/pipelines#PipelineResult} represents a
 *       distinct group and its associated aggregated values.</li>
 * </ul>
 *
 * @example
 * ```typescript
 * const snapshot: PipelineSnapshot = await execute(firestore.pipeline().collection("books")
 *     .where(gt(field("rating"), 4.5))
 *     .select("title", "author", "rating"));
 *
 * const results: PipelineResults = snapshot.results;
 * ```
 *
 * @param pipeline - The pipeline to execute.
 * @returns A Promise representing the asynchronous pipeline execution.
 */ (e) ? ({other: t, ...n} = e) : (n = {}, t = e);
        // Create stage object
                const r = new __PRIVATE_Union(t, n);
        // Add stage to the pipeline
                return this._addStage(r);
    }
    unnest(e, n) {
        // Process argument union(s) from method overloads
        let t, r, i;
        __PRIVATE_isSelectable(e) ? (t = {}, r = e, i = n) : ({selectable: r, indexField: i, ...t} = e);
        // Convert user land convenience types to internal types
                const s = r.alias, o = r.expr;
        __PRIVATE_isString(i) && (t.indexField = _field(i, "unnest"));
        // Create stage object
                const a = new __PRIVATE_Unnest(s, o, t);
        // Add stage to the pipeline
                return this._addStage(a);
    }
    /**
     * @beta
     * Adds a raw stage to the pipeline.
     *
     * <p>This method provides a flexible way to extend the pipeline's functionality by adding custom
     * stages. Each raw stage is defined by a unique `name` and a set of `params` that control its
     * behavior.
     *
     * <p>Example (Assuming there is no 'where' stage available in SDK):
     *
     * @example
     * ```typescript
     * // Assume we don't have a built-in 'where' stage
     * firestore.pipeline().collection('books')
     *     .rawStage('where', [field('published').lessThan(1900)]) // Custom 'where' stage
     *     .select('title', 'author');
     * ```
     *
     * @param name - The unique name of the raw stage to add.
     * @param params - A list of parameters to configure the raw stage's behavior.
     * @param options - An object of key value pairs that specifies optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */    rawStage(e, t, r) {
        // Convert user land convenience types to internal types
        const i = t.map((e => e instanceof Expression || e instanceof AggregateFunction ? e : __PRIVATE_isPlainObject(e) ? function __PRIVATE__mapValue(e) {
            const n = new Map;
            for (const t in e) if (Object.prototype.hasOwnProperty.call(e, t)) {
                const r = e[t];
                n.set(t, __PRIVATE_valueToDefaultExpr$1(r));
            }
            return new MapValue(n, void 0);
        }(e) : __PRIVATE__constant(e, "rawStage"))), s = new __PRIVATE_RawStage(e, i, r ?? {});
        // Create stage object
                // Add stage to the pipeline
        return this._addStage(s);
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            stages: this.stages.map((n => n._toProto(e)))
        };
    }
    _addStage(e) {
        const n = this.stages.map((e => e));
        return n.push(e), this.newPipeline(this._db, n);
    }
    /**
     * @internal
     * @private
     * @param db
     * @param userDataReader
     * @param userDataWriter
     * @param stages
     * @protected
     */    newPipeline(e, n) {
        return new Pipeline(e, n);
    }
}

function execute(e) {
    const n = __PRIVATE_getDatastore(e._db), t = __PRIVATE_cast(e._db, Firestore), r = __PRIVATE_newUserDataReader(t).ue(3 /* UserDataSource.Argument */ , "execute");
    e._readUserData(r);
    const i = new __PRIVATE_LiteUserDataWriter(t), s = new __PRIVATE_StructuredPipelineOptions({}, {});
    s._readUserData(r);
    const o = new StructuredPipeline(e, s);
    return __PRIVATE_invokeExecutePipeline(n, o).then((n => {
        // Get the execution time from the first result.
        // firestoreClientExecutePipeline returns at least one PipelineStreamElement
        // even if the returned document set is empty.
        const t = n.length > 0 ? n[0].executionTime?.toTimestamp() : void 0, r = n.filter((e => !!e.fields)).map((n => new PipelineResult(i, n.fields, n.key?.path ? new DocumentReference(e._db, null, n.key) : void 0, n.createTime?.toTimestamp(), n.updateTime?.toTimestamp())));
        return new PipelineSnapshot(e, r, t);
    }));
}

/**
 * @beta
 * Creates and returns a new PipelineSource, which allows specifying the source stage of a {@link @firebase/firestore/pipelines#Pipeline}.
 *
 * @example
 * ```
 * let myPipeline: Pipeline = firestore.pipeline().collection('books');
 * ```
 */ Firestore.prototype.pipeline = function() {
    return new PipelineSource(this._databaseId, (e => new Pipeline(this, e)));
};

export { AggregateFunction, AliasedAggregate, AliasedExpression, BooleanExpression, Constant, Expression, Field, FunctionExpression, Ordering, Pipeline, PipelineResult, PipelineSnapshot, PipelineSource, abs, add, and, array, arrayAgg, arrayAggDistinct, arrayConcat, arrayContains, arrayContainsAll, arrayContainsAny, arrayFirst, arrayFirstN, arrayGet, arrayIndexOf, arrayIndexOfAll, arrayLast, arrayLastIndexOf, arrayLastN, arrayLength, arrayMaximum, arrayMaximumN, arrayMinimum, arrayMinimumN, arraySum, ascending, average, byteLength, ceil, charLength, collectionId, concat, conditional, constant, cosineDistance, count, countAll, countDistinct, countIf, currentTimestamp, descending, divide, documentId, dotProduct, endsWith, equal, equalAny, euclideanDistance, execute, exists, exp, field, first, floor, greaterThan, greaterThanOrEqual, ifAbsent, ifError, isAbsent, isError, isType, join, last, length, lessThan, lessThanOrEqual, like, ln, log, log10, logicalMaximum, logicalMinimum, ltrim, map, mapEntries, mapGet, mapKeys, mapMerge, mapRemove, mapSet, mapValues, maximum, minimum, mod, multiply, not, notEqual, notEqualAny, or, pow, rand, regexContains, regexFind, regexFindAll, regexMatch, reverse, round, rtrim, split, sqrt, startsWith, stringConcat, stringContains, stringIndexOf, stringRepeat, stringReplaceAll, stringReplaceOne, stringReverse, substring, subtract, sum, timestampAdd, timestampSubtract, timestampToUnixMicros, timestampToUnixMillis, timestampToUnixSeconds, timestampTruncate, toLower, toUpper, trim, trunc, type, unixMicrosToTimestamp, unixMillisToTimestamp, unixSecondsToTimestamp, vectorLength, xor };
//# sourceMappingURL=pipelines.browser.esm.js.map
