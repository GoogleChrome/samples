import { F as Firestore, j as FirestoreError, bd as isString, be as DOCUMENT_KEY_NAME, b0 as documentId$1, f as fieldPathFromArgument, bf as hardAssert, bg as parseData, bh as toStringValue, bi as isCollectionReference, D as DocumentReference, k as Code, aF as CollectionReference, bj as isOptionalEqual, E as cast, G as ensureFirestoreConfigured, c as newUserDataReader, J as ExpUserDataWriter, bk as firestoreClientExecutePipeline, bl as isPlainObject, aJ as VectorValue, bb as vector, w as isCollectionGroupQuery, bm as isDocumentQuery$1, a7 as doc, o as queryNormalizedOrderBy, bn as OptionsUtil, b7 as refEqual, bo as isNumber$1, bp as StructuredPipelineOptions, m as FieldFilter, X as fail, C as CompositeFilter, bq as toMapValue, br as toNumber, bs as toPipelineValue, bt as isUserData, bu as StructuredPipeline } from './common-abbd8850.node.mjs';
export { bv as _internalPipelineToExecutePipelineRequestProto } from './common-abbd8850.node.mjs';
import '@firebase/app';
import '@firebase/util';
import '@firebase/webchannel-wrapper/bloom-blob';
import '@firebase/logger';
import 'util';
import 'crypto';
import '@grpc/grpc-js';
import '@grpc/proto-loader';

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
/* eslint @typescript-eslint/no-explicit-any: 0 */
function isITimestamp(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false; // Must be a non-null object
    }
    if ('seconds' in obj &&
        (obj.seconds === null ||
            typeof obj.seconds === 'number' ||
            typeof obj.seconds === 'string') &&
        'nanos' in obj &&
        (obj.nanos === null || typeof obj.nanos === 'number')) {
        return true;
    }
    return false;
}
function isILatLng(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false; // Must be a non-null object
    }
    if ('latitude' in obj &&
        (obj.latitude === null || typeof obj.latitude === 'number') &&
        'longitude' in obj &&
        (obj.longitude === null || typeof obj.longitude === 'number')) {
        return true;
    }
    return false;
}
function isIArrayValue(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false; // Must be a non-null object
    }
    if ('values' in obj && (obj.values === null || Array.isArray(obj.values))) {
        return true;
    }
    return false;
}
function isIMapValue(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false; // Must be a non-null object
    }
    if ('fields' in obj && (obj.fields === null || isPlainObject(obj.fields))) {
        return true;
    }
    return false;
}
function isIFunction(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false; // Must be a non-null object
    }
    if ('name' in obj &&
        (obj.name === null || typeof obj.name === 'string') &&
        'args' in obj &&
        (obj.args === null || Array.isArray(obj.args))) {
        return true;
    }
    return false;
}
function isIPipeline(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false; // Must be a non-null object
    }
    if ('stages' in obj && (obj.stages === null || Array.isArray(obj.stages))) {
        return true;
    }
    return false;
}
function isFirestoreValue(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return false; // Must be a non-null object
    }
    // Check optional properties and their types
    if (('nullValue' in obj &&
        (obj.nullValue === null || obj.nullValue === 'NULL_VALUE')) ||
        ('booleanValue' in obj &&
            (obj.booleanValue === null || typeof obj.booleanValue === 'boolean')) ||
        ('integerValue' in obj &&
            (obj.integerValue === null ||
                typeof obj.integerValue === 'number' ||
                typeof obj.integerValue === 'string')) ||
        ('doubleValue' in obj &&
            (obj.doubleValue === null || typeof obj.doubleValue === 'number')) ||
        ('timestampValue' in obj &&
            (obj.timestampValue === null || isITimestamp(obj.timestampValue))) ||
        ('stringValue' in obj &&
            (obj.stringValue === null || typeof obj.stringValue === 'string')) ||
        ('bytesValue' in obj &&
            (obj.bytesValue === null || obj.bytesValue instanceof Uint8Array)) ||
        ('referenceValue' in obj &&
            (obj.referenceValue === null ||
                typeof obj.referenceValue === 'string')) ||
        ('geoPointValue' in obj &&
            (obj.geoPointValue === null || isILatLng(obj.geoPointValue))) ||
        ('arrayValue' in obj &&
            (obj.arrayValue === null || isIArrayValue(obj.arrayValue))) ||
        ('mapValue' in obj &&
            (obj.mapValue === null || isIMapValue(obj.mapValue))) ||
        ('fieldReferenceValue' in obj &&
            (obj.fieldReferenceValue === null ||
                typeof obj.fieldReferenceValue === 'string')) ||
        ('functionValue' in obj &&
            (obj.functionValue === null || isIFunction(obj.functionValue))) ||
        ('pipelineValue' in obj &&
            (obj.pipelineValue === null || isIPipeline(obj.pipelineValue)))) {
        return true;
    }
    return false;
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
 */
function valueToDefaultExpr$1(value) {
    let result;
    if (value instanceof Expression) {
        return value;
    }
    else if (isPlainObject(value)) {
        result = _map(value);
    }
    else if (value instanceof Array) {
        result = array(value);
    }
    else {
        result = _constant(value, undefined);
    }
    return result;
}
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */
function vectorToExpr$1(value) {
    if (value instanceof Expression) {
        return value;
    }
    else if (value instanceof VectorValue) {
        return constant(value);
    }
    else if (Array.isArray(value)) {
        return constant(vector(value));
    }
    else {
        throw new Error('Unsupported value: ' + typeof value);
    }
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
function fieldOrExpression$1(value) {
    if (isString(value)) {
        const result = field(value);
        return result;
    }
    else {
        return valueToDefaultExpr$1(value);
    }
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
 */
class Expression {
    constructor() {
        this._protoValueType = 'ProtoValue';
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
     */
    add(second) {
        return new FunctionExpression('add', [this, valueToDefaultExpr$1(second)], 'add');
    }
    /**
     * @beta
     * Wraps the expression in a [BooleanExpression].
     *
     * @returns A [BooleanExpression] representing the same expression.
     */
    asBoolean() {
        if (this instanceof BooleanExpression) {
            return this;
        }
        else if (this instanceof Constant) {
            return new BooleanConstant(this);
        }
        else if (this instanceof Field) {
            return new BooleanField(this);
        }
        else if (this instanceof FunctionExpression) {
            return new BooleanFunctionExpression(this);
        }
        else {
            throw new FirestoreError('invalid-argument', `Conversion of type ${typeof this} to BooleanExpression not supported.`);
        }
    }
    subtract(subtrahend) {
        return new FunctionExpression('subtract', [this, valueToDefaultExpr$1(subtrahend)], 'subtract');
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
     */
    multiply(second) {
        return new FunctionExpression('multiply', [this, valueToDefaultExpr$1(second)], 'multiply');
    }
    divide(divisor) {
        return new FunctionExpression('divide', [this, valueToDefaultExpr$1(divisor)], 'divide');
    }
    mod(other) {
        return new FunctionExpression('mod', [this, valueToDefaultExpr$1(other)], 'mod');
    }
    equal(other) {
        return new FunctionExpression('equal', [this, valueToDefaultExpr$1(other)], 'equal').asBoolean();
    }
    notEqual(other) {
        return new FunctionExpression('not_equal', [this, valueToDefaultExpr$1(other)], 'notEqual').asBoolean();
    }
    lessThan(other) {
        return new FunctionExpression('less_than', [this, valueToDefaultExpr$1(other)], 'lessThan').asBoolean();
    }
    lessThanOrEqual(other) {
        return new FunctionExpression('less_than_or_equal', [this, valueToDefaultExpr$1(other)], 'lessThanOrEqual').asBoolean();
    }
    greaterThan(other) {
        return new FunctionExpression('greater_than', [this, valueToDefaultExpr$1(other)], 'greaterThan').asBoolean();
    }
    greaterThanOrEqual(other) {
        return new FunctionExpression('greater_than_or_equal', [this, valueToDefaultExpr$1(other)], 'greaterThanOrEqual').asBoolean();
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
     */
    arrayConcat(secondArray, ...otherArrays) {
        const elements = [secondArray, ...otherArrays];
        const exprValues = elements.map(value => valueToDefaultExpr$1(value));
        return new FunctionExpression('array_concat', [this, ...exprValues], 'arrayConcat');
    }
    arrayContains(element) {
        return new FunctionExpression('array_contains', [this, valueToDefaultExpr$1(element)], 'arrayContains').asBoolean();
    }
    arrayContainsAll(values) {
        const normalizedExpr = Array.isArray(values)
            ? new ListOfExprs(values.map(valueToDefaultExpr$1), 'arrayContainsAll')
            : values;
        return new FunctionExpression('array_contains_all', [this, normalizedExpr], 'arrayContainsAll').asBoolean();
    }
    arrayContainsAny(values) {
        const normalizedExpr = Array.isArray(values)
            ? new ListOfExprs(values.map(valueToDefaultExpr$1), 'arrayContainsAny')
            : values;
        return new FunctionExpression('array_contains_any', [this, normalizedExpr], 'arrayContainsAny').asBoolean();
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
     */
    arrayReverse() {
        return new FunctionExpression('array_reverse', [this]);
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
     */
    arrayLength() {
        return new FunctionExpression('array_length', [this], 'arrayLength');
    }
    equalAny(others) {
        const exprOthers = Array.isArray(others)
            ? new ListOfExprs(others.map(valueToDefaultExpr$1), 'equalAny')
            : others;
        return new FunctionExpression('equal_any', [this, exprOthers], 'equalAny').asBoolean();
    }
    notEqualAny(others) {
        const exprOthers = Array.isArray(others)
            ? new ListOfExprs(others.map(valueToDefaultExpr$1), 'notEqualAny')
            : others;
        return new FunctionExpression('not_equal_any', [this, exprOthers], 'notEqualAny').asBoolean();
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
     */
    exists() {
        return new FunctionExpression('exists', [this], 'exists').asBoolean();
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
     */
    charLength() {
        return new FunctionExpression('char_length', [this], 'charLength');
    }
    like(stringOrExpr) {
        return new FunctionExpression('like', [this, valueToDefaultExpr$1(stringOrExpr)], 'like').asBoolean();
    }
    regexContains(stringOrExpr) {
        return new FunctionExpression('regex_contains', [this, valueToDefaultExpr$1(stringOrExpr)], 'regexContains').asBoolean();
    }
    regexFind(stringOrExpr) {
        return new FunctionExpression('regex_find', [this, valueToDefaultExpr$1(stringOrExpr)], 'regexFind');
    }
    regexFindAll(stringOrExpr) {
        return new FunctionExpression('regex_find_all', [this, valueToDefaultExpr$1(stringOrExpr)], 'regexFindAll');
    }
    regexMatch(stringOrExpr) {
        return new FunctionExpression('regex_match', [this, valueToDefaultExpr$1(stringOrExpr)], 'regexMatch').asBoolean();
    }
    stringContains(stringOrExpr) {
        return new FunctionExpression('string_contains', [this, valueToDefaultExpr$1(stringOrExpr)], 'stringContains').asBoolean();
    }
    startsWith(stringOrExpr) {
        return new FunctionExpression('starts_with', [this, valueToDefaultExpr$1(stringOrExpr)], 'startsWith').asBoolean();
    }
    endsWith(stringOrExpr) {
        return new FunctionExpression('ends_with', [this, valueToDefaultExpr$1(stringOrExpr)], 'endsWith').asBoolean();
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
     */
    toLower() {
        return new FunctionExpression('to_lower', [this], 'toLower');
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
     */
    toUpper() {
        return new FunctionExpression('to_upper', [this], 'toUpper');
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
     */
    trim(valueToTrim) {
        const args = [this];
        if (valueToTrim) {
            args.push(valueToDefaultExpr$1(valueToTrim));
        }
        return new FunctionExpression('trim', args, 'trim');
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
     */
    ltrim(valueToTrim) {
        const args = [this];
        if (valueToTrim) {
            args.push(valueToDefaultExpr$1(valueToTrim));
        }
        return new FunctionExpression('ltrim', args, 'ltrim');
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
     */
    rtrim(valueToTrim) {
        const args = [this];
        if (valueToTrim) {
            args.push(valueToDefaultExpr$1(valueToTrim));
        }
        return new FunctionExpression('rtrim', args, 'rtrim');
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
     */
    type() {
        return new FunctionExpression('type', [this]);
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
     */
    isType(type) {
        return new FunctionExpression('is_type', [this, constant(type)], 'isType').asBoolean();
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
     */
    stringConcat(secondString, ...otherStrings) {
        const elements = [secondString, ...otherStrings];
        const exprs = elements.map(valueToDefaultExpr$1);
        return new FunctionExpression('string_concat', [this, ...exprs], 'stringConcat');
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
     */
    stringIndexOf(search) {
        return new FunctionExpression('string_index_of', [this, valueToDefaultExpr$1(search)], 'stringIndexOf');
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
     */
    stringRepeat(repetitions) {
        return new FunctionExpression('string_repeat', [this, valueToDefaultExpr$1(repetitions)], 'stringRepeat');
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
     */
    stringReplaceAll(find, replacement) {
        return new FunctionExpression('string_replace_all', [this, valueToDefaultExpr$1(find), valueToDefaultExpr$1(replacement)], 'stringReplaceAll');
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
     */
    stringReplaceOne(find, replacement) {
        return new FunctionExpression('string_replace_one', [this, valueToDefaultExpr$1(find), valueToDefaultExpr$1(replacement)], 'stringReplaceOne');
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
     */
    concat(second, ...others) {
        const elements = [second, ...others];
        const exprs = elements.map(valueToDefaultExpr$1);
        return new FunctionExpression('concat', [this, ...exprs], 'concat');
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
     */
    reverse() {
        return new FunctionExpression('reverse', [this], 'reverse');
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
     */
    arrayFirst() {
        return new FunctionExpression('array_first', [this], 'arrayFirst');
    }
    arrayFirstN(n) {
        return new FunctionExpression('array_first_n', [this, valueToDefaultExpr$1(n)], 'arrayFirstN');
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
     */
    arrayLast() {
        return new FunctionExpression('array_last', [this], 'arrayLast');
    }
    arrayLastN(n) {
        return new FunctionExpression('array_last_n', [this, valueToDefaultExpr$1(n)], 'arrayLastN');
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
     */
    arrayMaximum() {
        return new FunctionExpression('maximum', [this], 'arrayMaximum');
    }
    arrayMaximumN(n) {
        return new FunctionExpression('maximum_n', [this, valueToDefaultExpr$1(n)], 'arrayMaximumN');
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
     */
    arrayMinimum() {
        return new FunctionExpression('minimum', [this], 'arrayMinimum');
    }
    arrayMinimumN(n) {
        return new FunctionExpression('minimum_n', [this, valueToDefaultExpr$1(n)], 'arrayMinimumN');
    }
    arrayIndexOf(search) {
        return new FunctionExpression('array_index_of', [this, valueToDefaultExpr$1(search), valueToDefaultExpr$1('first')], 'arrayIndexOf');
    }
    arrayLastIndexOf(search) {
        return new FunctionExpression('array_index_of', [this, valueToDefaultExpr$1(search), valueToDefaultExpr$1('last')], 'arrayLastIndexOf');
    }
    arrayIndexOfAll(search) {
        return new FunctionExpression('array_index_of_all', [this, valueToDefaultExpr$1(search)], 'arrayIndexOfAll');
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
     */
    byteLength() {
        return new FunctionExpression('byte_length', [this], 'byteLength');
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
     */
    ceil() {
        return new FunctionExpression('ceil', [this]);
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
     */
    floor() {
        return new FunctionExpression('floor', [this]);
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
     */
    abs() {
        return new FunctionExpression('abs', [this]);
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
     */
    exp() {
        return new FunctionExpression('exp', [this]);
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
     */
    mapGet(subfield) {
        return new FunctionExpression('map_get', [this, constant(subfield)], 'mapGet');
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
     */
    mapSet(key, value, ...moreKeyValues) {
        const args = [
            this,
            valueToDefaultExpr$1(key),
            valueToDefaultExpr$1(value),
            ...moreKeyValues.map(valueToDefaultExpr$1)
        ];
        return new FunctionExpression('map_set', args, 'mapSet');
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
     */
    mapKeys() {
        return new FunctionExpression('map_keys', [this], 'mapKeys');
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
     */
    mapValues() {
        return new FunctionExpression('map_values', [this], 'mapValues');
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
     */
    mapEntries() {
        return new FunctionExpression('map_entries', [this], 'mapEntries');
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
     */
    count() {
        return AggregateFunction._create('count', [this], 'count');
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
     */
    sum() {
        return AggregateFunction._create('sum', [this], 'sum');
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
     */
    average() {
        return AggregateFunction._create('average', [this], 'average');
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
     */
    minimum() {
        return AggregateFunction._create('minimum', [this], 'minimum');
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
     */
    maximum() {
        return AggregateFunction._create('maximum', [this], 'maximum');
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
     */
    first() {
        return AggregateFunction._create('first', [this], 'first');
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
     */
    last() {
        return AggregateFunction._create('last', [this], 'last');
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
     */
    arrayAgg() {
        return AggregateFunction._create('array_agg', [this], 'arrayAgg');
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
     */
    arrayAggDistinct() {
        return AggregateFunction._create('array_agg_distinct', [this], 'arrayAggDistinct');
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
     */
    countDistinct() {
        return AggregateFunction._create('count_distinct', [this], 'countDistinct');
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
     */
    logicalMaximum(second, ...others) {
        const values = [second, ...others];
        return new FunctionExpression('maximum', [this, ...values.map(valueToDefaultExpr$1)], 'logicalMaximum');
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
     */
    logicalMinimum(second, ...others) {
        const values = [second, ...others];
        return new FunctionExpression('minimum', [this, ...values.map(valueToDefaultExpr$1)], 'minimum');
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
     */
    vectorLength() {
        return new FunctionExpression('vector_length', [this], 'vectorLength');
    }
    cosineDistance(other) {
        return new FunctionExpression('cosine_distance', [this, vectorToExpr$1(other)], 'cosineDistance');
    }
    dotProduct(other) {
        return new FunctionExpression('dot_product', [this, vectorToExpr$1(other)], 'dotProduct');
    }
    euclideanDistance(other) {
        return new FunctionExpression('euclidean_distance', [this, vectorToExpr$1(other)], 'euclideanDistance');
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
     */
    unixMicrosToTimestamp() {
        return new FunctionExpression('unix_micros_to_timestamp', [this], 'unixMicrosToTimestamp');
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
     */
    timestampToUnixMicros() {
        return new FunctionExpression('timestamp_to_unix_micros', [this], 'timestampToUnixMicros');
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
     */
    unixMillisToTimestamp() {
        return new FunctionExpression('unix_millis_to_timestamp', [this], 'unixMillisToTimestamp');
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
     */
    timestampToUnixMillis() {
        return new FunctionExpression('timestamp_to_unix_millis', [this], 'timestampToUnixMillis');
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
     */
    unixSecondsToTimestamp() {
        return new FunctionExpression('unix_seconds_to_timestamp', [this], 'unixSecondsToTimestamp');
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
     */
    timestampToUnixSeconds() {
        return new FunctionExpression('timestamp_to_unix_seconds', [this], 'timestampToUnixSeconds');
    }
    timestampAdd(unit, amount) {
        return new FunctionExpression('timestamp_add', [this, valueToDefaultExpr$1(unit), valueToDefaultExpr$1(amount)], 'timestampAdd');
    }
    timestampSubtract(unit, amount) {
        return new FunctionExpression('timestamp_subtract', [this, valueToDefaultExpr$1(unit), valueToDefaultExpr$1(amount)], 'timestampSubtract');
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
     */
    documentId() {
        return new FunctionExpression('document_id', [this], 'documentId');
    }
    substring(position, length) {
        const positionExpr = valueToDefaultExpr$1(position);
        if (length === undefined) {
            return new FunctionExpression('substring', [this, positionExpr], 'substring');
        }
        else {
            return new FunctionExpression('substring', [this, positionExpr, valueToDefaultExpr$1(length)], 'substring');
        }
    }
    arrayGet(offset) {
        return new FunctionExpression('array_get', [this, valueToDefaultExpr$1(offset)], 'arrayGet');
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
     */
    isError() {
        return new FunctionExpression('is_error', [this], 'isError').asBoolean();
    }
    ifError(catchValue) {
        const result = new FunctionExpression('if_error', [this, valueToDefaultExpr$1(catchValue)], 'ifError');
        return catchValue instanceof BooleanExpression
            ? result.asBoolean()
            : result;
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
     */
    isAbsent() {
        return new FunctionExpression('is_absent', [this], 'isAbsent').asBoolean();
    }
    mapRemove(stringExpr) {
        return new FunctionExpression('map_remove', [this, valueToDefaultExpr$1(stringExpr)], 'mapRemove');
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
     */
    mapMerge(secondMap, ...otherMaps) {
        const secondMapExpr = valueToDefaultExpr$1(secondMap);
        const otherMapExprs = otherMaps.map(valueToDefaultExpr$1);
        return new FunctionExpression('map_merge', [this, secondMapExpr, ...otherMapExprs], 'mapMerge');
    }
    pow(exponent) {
        return new FunctionExpression('pow', [this, valueToDefaultExpr$1(exponent)]);
    }
    trunc(decimalPlaces) {
        if (decimalPlaces === undefined) {
            return new FunctionExpression('trunc', [this]);
        }
        else {
            return new FunctionExpression('trunc', [this, valueToDefaultExpr$1(decimalPlaces)], 'trunc');
        }
    }
    round(decimalPlaces) {
        if (decimalPlaces === undefined) {
            return new FunctionExpression('round', [this]);
        }
        else {
            return new FunctionExpression('round', [this, valueToDefaultExpr$1(decimalPlaces)], 'round');
        }
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
     */
    collectionId() {
        return new FunctionExpression('collection_id', [this]);
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
     */
    length() {
        return new FunctionExpression('length', [this]);
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
     */
    ln() {
        return new FunctionExpression('ln', [this]);
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
     */
    sqrt() {
        return new FunctionExpression('sqrt', [this]);
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
     */
    stringReverse() {
        return new FunctionExpression('string_reverse', [this]);
    }
    ifAbsent(elseValueOrExpression) {
        return new FunctionExpression('if_absent', [this, valueToDefaultExpr$1(elseValueOrExpression)], 'ifAbsent');
    }
    join(delimeterValueOrExpression) {
        return new FunctionExpression('join', [this, valueToDefaultExpr$1(delimeterValueOrExpression)], 'join');
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
     */
    log10() {
        return new FunctionExpression('log10', [this]);
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
     */
    arraySum() {
        return new FunctionExpression('sum', [this]);
    }
    split(delimiter) {
        return new FunctionExpression('split', [
            this,
            valueToDefaultExpr$1(delimiter)
        ]);
    }
    timestampTruncate(granularity, timezone) {
        const internalGranularity = isString(granularity)
            ? granularity.toLowerCase()
            : granularity;
        const args = [this, valueToDefaultExpr$1(internalGranularity)];
        if (timezone) {
            args.push(valueToDefaultExpr$1(timezone));
        }
        return new FunctionExpression('timestamp_trunc', args);
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
     */
    descending() {
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
     */
    as(name) {
        return new AliasedExpression(this, name, 'as');
    }
}
/**
 * @beta
 *
 * A class that represents an aggregate function.
 */
class AggregateFunction {
    constructor(name, params) {
        this.name = name;
        this.params = params;
        this.exprType = 'AggregateFunction';
        this._protoValueType = 'ProtoValue';
    }
    /**
     * @internal
     * @private
     */
    static _create(name, params, methodName) {
        const af = new AggregateFunction(name, params);
        af._methodName = methodName;
        return af;
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
     */
    as(name) {
        return new AliasedAggregate(this, name, 'as');
    }
    /**
     * @private
     * @internal
     */
    _toProto(serializer) {
        return {
            functionValue: {
                name: this.name,
                args: this.params.map(p => p._toProto(serializer))
            }
        };
    }
    /**
     * @private
     * @internal
     */
    _readUserData(context) {
        context = this._methodName
            ? context.contextWith({ methodName: this._methodName })
            : context;
        this.params.forEach(expr => {
            return expr._readUserData(context);
        });
    }
}
/**
 * @beta
 *
 * An AggregateFunction with alias.
 */
class AliasedAggregate {
    constructor(aggregate, alias, _methodName) {
        this.aggregate = aggregate;
        this.alias = alias;
        this._methodName = _methodName;
    }
    /**
     * @private
     * @internal
     */
    _readUserData(context) {
        this.aggregate._readUserData(context);
    }
}
/**
 * @beta
 */
class AliasedExpression {
    constructor(expr, alias, _methodName) {
        this.expr = expr;
        this.alias = alias;
        this._methodName = _methodName;
        this.exprType = 'AliasedExpression';
        this.selectable = true;
    }
    /**
     * @private
     * @internal
     */
    _readUserData(context) {
        this.expr._readUserData(context);
    }
}
/**
 * @internal
 */
class ListOfExprs extends Expression {
    constructor(exprs, _methodName) {
        super();
        this.exprs = exprs;
        this._methodName = _methodName;
        this.expressionType = 'ListOfExpressions';
    }
    /**
     * @private
     * @internal
     */
    _toProto(serializer) {
        return {
            arrayValue: {
                values: this.exprs.map(p => p._toProto(serializer))
            }
        };
    }
    /**
     * @private
     * @internal
     */
    _readUserData(context) {
        this.exprs.forEach((expr) => expr._readUserData(context));
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
 */
class Field extends Expression {
    /**
     * @internal
     * @private
     * @hideconstructor
     * @param fieldPath
     */
    constructor(fieldPath, _methodName) {
        super();
        this.fieldPath = fieldPath;
        this._methodName = _methodName;
        this.expressionType = 'Field';
        this.selectable = true;
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
     */
    _toProto(serializer) {
        return {
            fieldReferenceValue: this.fieldPath.canonicalString()
        };
    }
    /**
     * @private
     * @internal
     */
    _readUserData(context) { }
}
function field(nameOrPath) {
    return _field(nameOrPath, 'field');
}
function _field(nameOrPath, methodName) {
    if (typeof nameOrPath === 'string') {
        if (DOCUMENT_KEY_NAME === nameOrPath) {
            return new Field(documentId$1()._internalPath, methodName);
        }
        return new Field(fieldPathFromArgument('field', nameOrPath), methodName);
    }
    else {
        return new Field(nameOrPath._internalPath, methodName);
    }
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
 */
class Constant extends Expression {
    /**
     * @private
     * @internal
     * @hideconstructor
     * @param value - The value of the constant.
     */
    constructor(value, _methodName) {
        super();
        this.value = value;
        this._methodName = _methodName;
        this.expressionType = 'Constant';
    }
    /**
     * @private
     * @internal
     */
    static _fromProto(value) {
        const result = new Constant(value, undefined);
        result._protoValue = value;
        return result;
    }
    /**
     * @private
     * @internal
     */
    _toProto(_) {
        hardAssert(this._protoValue !== undefined, 0x00ed);
        return this._protoValue;
    }
    /**
     * @private
     * @internal
     */
    _readUserData(context) {
        context = this._methodName
            ? context.contextWith({ methodName: this._methodName })
            : context;
        if (isFirestoreValue(this._protoValue)) {
            return;
        }
        else {
            this._protoValue = parseData(this.value, context);
        }
    }
}
function constant(value) {
    return _constant(value, 'constant');
}
/**
 * @internal
 * @private
 * @param value
 * @param methodName
 */
function _constant(value, methodName) {
    const c = new Constant(value, methodName);
    if (typeof value === 'boolean') {
        return new BooleanConstant(c);
    }
    else {
        return c;
    }
}
/**
 * Internal only
 * @internal
 * @private
 */
class MapValue extends Expression {
    constructor(plainObject, _methodName) {
        super();
        this.plainObject = plainObject;
        this._methodName = _methodName;
        this.expressionType = 'Constant';
    }
    _readUserData(context) {
        context = this._methodName
            ? context.contextWith({ methodName: this._methodName })
            : context;
        this.plainObject.forEach(expr => {
            expr._readUserData(context);
        });
    }
    _toProto(serializer) {
        return toMapValue(serializer, this.plainObject);
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
 */
class FunctionExpression extends Expression {
    constructor(name, params, _methodName) {
        super();
        this.name = name;
        this.params = params;
        this._methodName = _methodName;
        this.expressionType = 'Function';
    }
    /**
     * @private
     * @internal
     */
    _toProto(serializer) {
        return {
            functionValue: {
                name: this.name,
                args: this.params.map(p => p._toProto(serializer))
            }
        };
    }
    /**
     * @private
     * @internal
     */
    _readUserData(context) {
        context = this._methodName
            ? context.contextWith({ methodName: this._methodName })
            : context;
        this.params.forEach(expr => {
            return expr._readUserData(context);
        });
    }
}
/**
 * @beta
 *
 * An interface that represents a filter condition.
 */
class BooleanExpression extends Expression {
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
     */
    countIf() {
        return AggregateFunction._create('count_if', [this], 'countIf');
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
     */
    not() {
        return new FunctionExpression('not', [this], 'not').asBoolean();
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
     */
    conditional(thenExpr, elseExpr) {
        return new FunctionExpression('conditional', [this, thenExpr, elseExpr], 'conditional');
    }
    ifError(catchValue) {
        const normalizedCatchValue = valueToDefaultExpr$1(catchValue);
        const expr = new FunctionExpression('if_error', [this, normalizedCatchValue], 'ifError');
        return normalizedCatchValue instanceof BooleanExpression
            ? expr.asBoolean()
            : expr;
    }
    /**
     * @private
     * @internal
     */
    _toProto(serializer) {
        return this._expr._toProto(serializer);
    }
    /**
     * @private
     * @internal
     */
    _readUserData(context) {
        this._expr._readUserData(context);
    }
}
class BooleanFunctionExpression extends BooleanExpression {
    constructor(_expr) {
        super();
        this._expr = _expr;
        this.expressionType = 'Function';
    }
}
class BooleanConstant extends BooleanExpression {
    constructor(_expr) {
        super();
        this._expr = _expr;
        this.expressionType = 'Constant';
    }
}
class BooleanField extends BooleanExpression {
    constructor(_expr) {
        super();
        this._expr = _expr;
        this.expressionType = 'Field';
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
 */
function countIf(booleanExpr) {
    return booleanExpr.countIf();
}
function arrayGet(array, offset) {
    return fieldOrExpression$1(array).arrayGet(valueToDefaultExpr$1(offset));
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
 */
function isError(value) {
    return value.isError().asBoolean();
}
function ifError(tryExpr, catchValue) {
    if (tryExpr instanceof BooleanExpression &&
        catchValue instanceof BooleanExpression) {
        return tryExpr.ifError(catchValue).asBoolean();
    }
    else {
        return tryExpr.ifError(valueToDefaultExpr$1(catchValue));
    }
}
function isAbsent(value) {
    return fieldOrExpression$1(value).isAbsent();
}
function mapRemove(mapExpr, stringExpr) {
    return fieldOrExpression$1(mapExpr).mapRemove(valueToDefaultExpr$1(stringExpr));
}
function mapMerge(firstMap, secondMap, ...otherMaps) {
    const secondMapExpr = valueToDefaultExpr$1(secondMap);
    const otherMapExprs = otherMaps.map(valueToDefaultExpr$1);
    return fieldOrExpression$1(firstMap).mapMerge(secondMapExpr, ...otherMapExprs);
}
function documentId(documentPath) {
    // @ts-ignore
    const documentPathExpr = valueToDefaultExpr$1(documentPath);
    return documentPathExpr.documentId();
}
function substring(field, position, length) {
    const fieldExpr = fieldOrExpression$1(field);
    const positionExpr = valueToDefaultExpr$1(position);
    const lengthExpr = length === undefined ? undefined : valueToDefaultExpr$1(length);
    return fieldExpr.substring(positionExpr, lengthExpr);
}
function add(first, second) {
    return fieldOrExpression$1(first).add(valueToDefaultExpr$1(second));
}
function subtract(left, right) {
    const normalizedLeft = typeof left === 'string' ? field(left) : left;
    const normalizedRight = valueToDefaultExpr$1(right);
    return normalizedLeft.subtract(normalizedRight);
}
function multiply(first, second) {
    return fieldOrExpression$1(first).multiply(valueToDefaultExpr$1(second));
}
function divide(left, right) {
    const normalizedLeft = typeof left === 'string' ? field(left) : left;
    const normalizedRight = valueToDefaultExpr$1(right);
    return normalizedLeft.divide(normalizedRight);
}
function mod(left, right) {
    const normalizedLeft = typeof left === 'string' ? field(left) : left;
    const normalizedRight = valueToDefaultExpr$1(right);
    return normalizedLeft.mod(normalizedRight);
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
 */
function map(elements) {
    return _map(elements);
}
function _map(elements, methodName) {
    const result = [];
    for (const key in elements) {
        if (Object.prototype.hasOwnProperty.call(elements, key)) {
            const value = elements[key];
            result.push(constant(key));
            result.push(valueToDefaultExpr$1(value));
        }
    }
    return new FunctionExpression('map', result, 'map');
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
function _mapValue(plainObject) {
    const result = new Map();
    for (const key in plainObject) {
        if (Object.prototype.hasOwnProperty.call(plainObject, key)) {
            const value = plainObject[key];
            result.set(key, valueToDefaultExpr$1(value));
        }
    }
    return new MapValue(result, undefined);
}
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
function array(elements) {
    return _array(elements, 'array');
}
function _array(elements, methodName) {
    return new FunctionExpression('array', elements.map(element => valueToDefaultExpr$1(element)), methodName);
}
function equal(left, right) {
    const leftExpr = left instanceof Expression ? left : field(left);
    const rightExpr = valueToDefaultExpr$1(right);
    return leftExpr.equal(rightExpr);
}
function notEqual(left, right) {
    const leftExpr = left instanceof Expression ? left : field(left);
    const rightExpr = valueToDefaultExpr$1(right);
    return leftExpr.notEqual(rightExpr);
}
function lessThan(left, right) {
    const leftExpr = left instanceof Expression ? left : field(left);
    const rightExpr = valueToDefaultExpr$1(right);
    return leftExpr.lessThan(rightExpr);
}
function lessThanOrEqual(left, right) {
    const leftExpr = left instanceof Expression ? left : field(left);
    const rightExpr = valueToDefaultExpr$1(right);
    return leftExpr.lessThanOrEqual(rightExpr);
}
function greaterThan(left, right) {
    const leftExpr = left instanceof Expression ? left : field(left);
    const rightExpr = valueToDefaultExpr$1(right);
    return leftExpr.greaterThan(rightExpr);
}
function greaterThanOrEqual(left, right) {
    const leftExpr = left instanceof Expression ? left : field(left);
    const rightExpr = valueToDefaultExpr$1(right);
    return leftExpr.greaterThanOrEqual(rightExpr);
}
function arrayConcat(firstArray, secondArray, ...otherArrays) {
    const exprValues = otherArrays.map(element => valueToDefaultExpr$1(element));
    return fieldOrExpression$1(firstArray).arrayConcat(fieldOrExpression$1(secondArray), ...exprValues);
}
function arrayContains(array, element) {
    const arrayExpr = fieldOrExpression$1(array);
    const elementExpr = valueToDefaultExpr$1(element);
    return arrayExpr.arrayContains(elementExpr);
}
function arrayContainsAny(array, values) {
    // @ts-ignore implementation accepts both types
    return fieldOrExpression$1(array).arrayContainsAny(values);
}
function arrayContainsAll(array, values) {
    // @ts-ignore implementation accepts both types
    return fieldOrExpression$1(array).arrayContainsAll(values);
}
function arrayLength(array) {
    return fieldOrExpression$1(array).arrayLength();
}
function equalAny(element, values) {
    // @ts-ignore implementation accepts both types
    return fieldOrExpression$1(element).equalAny(values);
}
function notEqualAny(element, values) {
    // @ts-ignore implementation accepts both types
    return fieldOrExpression$1(element).notEqualAny(values);
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
 */
function xor(first, second, ...additionalConditions) {
    return new FunctionExpression('xor', [first, second, ...additionalConditions], 'xor').asBoolean();
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
 */
function conditional(condition, thenExpr, elseExpr) {
    return new FunctionExpression('conditional', [condition, thenExpr, elseExpr], 'conditional');
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
 */
function not(booleanExpr) {
    return booleanExpr.not();
}
function logicalMaximum(first, second, ...others) {
    return fieldOrExpression$1(first).logicalMaximum(valueToDefaultExpr$1(second), ...others.map(value => valueToDefaultExpr$1(value)));
}
function logicalMinimum(first, second, ...others) {
    return fieldOrExpression$1(first).logicalMinimum(valueToDefaultExpr$1(second), ...others.map(value => valueToDefaultExpr$1(value)));
}
function exists(valueOrField) {
    return fieldOrExpression$1(valueOrField).exists();
}
function reverse(expr) {
    return fieldOrExpression$1(expr).reverse();
}
function byteLength(expr) {
    const normalizedExpr = fieldOrExpression$1(expr);
    return normalizedExpr.byteLength();
}
function exp(expressionOrFieldName) {
    return fieldOrExpression$1(expressionOrFieldName).exp();
}
function ceil(expr) {
    return fieldOrExpression$1(expr).ceil();
}
function floor(expr) {
    return fieldOrExpression$1(expr).floor();
}
/**
 * @beta
 * Creates an aggregation that counts the number of distinct values of a field.
 *
 * @param expr - The expression or field to count distinct values of.
 * @returns A new `AggregateFunction` representing the 'count_distinct' aggregation.
 */
function countDistinct(expr) {
    return fieldOrExpression$1(expr).countDistinct();
}
function charLength(value) {
    const valueExpr = fieldOrExpression$1(value);
    return valueExpr.charLength();
}
function like(left, pattern) {
    const leftExpr = fieldOrExpression$1(left);
    const patternExpr = valueToDefaultExpr$1(pattern);
    return leftExpr.like(patternExpr);
}
function regexContains(left, pattern) {
    const leftExpr = fieldOrExpression$1(left);
    const patternExpr = valueToDefaultExpr$1(pattern);
    return leftExpr.regexContains(patternExpr);
}
function arrayFirst(array) {
    return fieldOrExpression$1(array).arrayFirst();
}
function arrayFirstN(array, n) {
    return fieldOrExpression$1(array).arrayFirstN(valueToDefaultExpr$1(n));
}
function arrayLast(array) {
    return fieldOrExpression$1(array).arrayLast();
}
function arrayLastN(array, n) {
    return fieldOrExpression$1(array).arrayLastN(valueToDefaultExpr$1(n));
}
function arrayMaximum(array) {
    return fieldOrExpression$1(array).arrayMaximum();
}
function arrayMaximumN(array, n) {
    return fieldOrExpression$1(array).arrayMaximumN(valueToDefaultExpr$1(n));
}
function arrayMinimum(array) {
    return fieldOrExpression$1(array).arrayMinimum();
}
function arrayMinimumN(array, n) {
    return fieldOrExpression$1(array).arrayMinimumN(valueToDefaultExpr$1(n));
}
function arrayIndexOf(array, search) {
    return fieldOrExpression$1(array).arrayIndexOf(valueToDefaultExpr$1(search));
}
function arrayLastIndexOf(array, search) {
    return fieldOrExpression$1(array).arrayLastIndexOf(valueToDefaultExpr$1(search));
}
function arrayIndexOfAll(array, search) {
    return fieldOrExpression$1(array).arrayIndexOfAll(valueToDefaultExpr$1(search));
}
function regexFind(left, pattern) {
    const leftExpr = fieldOrExpression$1(left);
    const patternExpr = valueToDefaultExpr$1(pattern);
    return leftExpr.regexFind(patternExpr);
}
function regexFindAll(left, pattern) {
    const leftExpr = fieldOrExpression$1(left);
    const patternExpr = valueToDefaultExpr$1(pattern);
    return leftExpr.regexFindAll(patternExpr);
}
function regexMatch(left, pattern) {
    const leftExpr = fieldOrExpression$1(left);
    const patternExpr = valueToDefaultExpr$1(pattern);
    return leftExpr.regexMatch(patternExpr);
}
function stringContains(left, substring) {
    const leftExpr = fieldOrExpression$1(left);
    const substringExpr = valueToDefaultExpr$1(substring);
    return leftExpr.stringContains(substringExpr);
}
function startsWith(expr, prefix) {
    return fieldOrExpression$1(expr).startsWith(valueToDefaultExpr$1(prefix));
}
function endsWith(expr, suffix) {
    return fieldOrExpression$1(expr).endsWith(valueToDefaultExpr$1(suffix));
}
function toLower(expr) {
    return fieldOrExpression$1(expr).toLower();
}
function toUpper(expr) {
    return fieldOrExpression$1(expr).toUpper();
}
function trim(expr, valueToTrim) {
    return fieldOrExpression$1(expr).trim(valueToTrim);
}
function ltrim(expr, valueToTrim) {
    return fieldOrExpression$1(expr).ltrim(valueToTrim);
}
function rtrim(expr, valueToTrim) {
    return fieldOrExpression$1(expr).rtrim(valueToTrim);
}
function type(fieldNameOrExpression) {
    return fieldOrExpression$1(fieldNameOrExpression).type();
}
function isType(fieldNameOrExpression, type) {
    return fieldOrExpression$1(fieldNameOrExpression).isType(type);
}
function stringConcat(first, second, ...elements) {
    return fieldOrExpression$1(first).stringConcat(valueToDefaultExpr$1(second), ...elements.map(valueToDefaultExpr$1));
}
function stringIndexOf(expr, search) {
    return fieldOrExpression$1(expr).stringIndexOf(search);
}
function stringRepeat(expr, repetitions) {
    return fieldOrExpression$1(expr).stringRepeat(repetitions);
}
function stringReplaceAll(expr, find, replacement) {
    return fieldOrExpression$1(expr).stringReplaceAll(find, replacement);
}
function stringReplaceOne(expr, find, replacement) {
    return fieldOrExpression$1(expr).stringReplaceOne(find, replacement);
}
function mapGet(fieldOrExpr, subField) {
    return fieldOrExpression$1(fieldOrExpr).mapGet(subField);
}
function mapSet(fieldOrExpr, key, value, ...moreKeyValues) {
    return fieldOrExpression$1(fieldOrExpr).mapSet(key, value, ...moreKeyValues);
}
function mapKeys(fieldOrExpr) {
    return fieldOrExpression$1(fieldOrExpr).mapKeys();
}
function mapValues(fieldOrExpr) {
    return fieldOrExpression$1(fieldOrExpr).mapValues();
}
function mapEntries(fieldOrExpr) {
    return fieldOrExpression$1(fieldOrExpr).mapEntries();
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
 */
function countAll() {
    return AggregateFunction._create('count', [], 'count');
}
function count(value) {
    return fieldOrExpression$1(value).count();
}
function sum(value) {
    return fieldOrExpression$1(value).sum();
}
function average(value) {
    return fieldOrExpression$1(value).average();
}
function minimum(value) {
    return fieldOrExpression$1(value).minimum();
}
function maximum(value) {
    return fieldOrExpression$1(value).maximum();
}
function first(value) {
    return fieldOrExpression$1(value).first();
}
function last(value) {
    return fieldOrExpression$1(value).last();
}
function arrayAgg(value) {
    return fieldOrExpression$1(value).arrayAgg();
}
function arrayAggDistinct(value) {
    return fieldOrExpression$1(value).arrayAggDistinct();
}
function cosineDistance(expr, other) {
    const expr1 = fieldOrExpression$1(expr);
    const expr2 = vectorToExpr$1(other);
    return expr1.cosineDistance(expr2);
}
function dotProduct(expr, other) {
    const expr1 = fieldOrExpression$1(expr);
    const expr2 = vectorToExpr$1(other);
    return expr1.dotProduct(expr2);
}
function euclideanDistance(expr, other) {
    const expr1 = fieldOrExpression$1(expr);
    const expr2 = vectorToExpr$1(other);
    return expr1.euclideanDistance(expr2);
}
function vectorLength(expr) {
    return fieldOrExpression$1(expr).vectorLength();
}
function unixMicrosToTimestamp(expr) {
    return fieldOrExpression$1(expr).unixMicrosToTimestamp();
}
function timestampToUnixMicros(expr) {
    return fieldOrExpression$1(expr).timestampToUnixMicros();
}
function unixMillisToTimestamp(expr) {
    const normalizedExpr = fieldOrExpression$1(expr);
    return normalizedExpr.unixMillisToTimestamp();
}
function timestampToUnixMillis(expr) {
    const normalizedExpr = fieldOrExpression$1(expr);
    return normalizedExpr.timestampToUnixMillis();
}
function unixSecondsToTimestamp(expr) {
    const normalizedExpr = fieldOrExpression$1(expr);
    return normalizedExpr.unixSecondsToTimestamp();
}
function timestampToUnixSeconds(expr) {
    const normalizedExpr = fieldOrExpression$1(expr);
    return normalizedExpr.timestampToUnixSeconds();
}
function timestampAdd(timestamp, unit, amount) {
    const normalizedTimestamp = fieldOrExpression$1(timestamp);
    const normalizedUnit = valueToDefaultExpr$1(unit);
    const normalizedAmount = valueToDefaultExpr$1(amount);
    return normalizedTimestamp.timestampAdd(normalizedUnit, normalizedAmount);
}
function timestampSubtract(timestamp, unit, amount) {
    const normalizedTimestamp = fieldOrExpression$1(timestamp);
    const normalizedUnit = valueToDefaultExpr$1(unit);
    const normalizedAmount = valueToDefaultExpr$1(amount);
    return normalizedTimestamp.timestampSubtract(normalizedUnit, normalizedAmount);
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
 */
function currentTimestamp() {
    return new FunctionExpression('current_timestamp', [], 'currentTimestamp');
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
 */
function and(first, second, ...more) {
    return new FunctionExpression('and', [first, second, ...more], 'and').asBoolean();
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
 */
function or(first, second, ...more) {
    return new FunctionExpression('or', [first, second, ...more], 'xor').asBoolean();
}
function pow(base, exponent) {
    return fieldOrExpression$1(base).pow(exponent);
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
 */
function rand() {
    return new FunctionExpression('rand', [], 'rand');
}
function round(expr, decimalPlaces) {
    if (decimalPlaces === undefined) {
        return fieldOrExpression$1(expr).round();
    }
    else {
        return fieldOrExpression$1(expr).round(valueToDefaultExpr$1(decimalPlaces));
    }
}
function trunc(expr, decimalPlaces) {
    if (decimalPlaces === undefined) {
        return fieldOrExpression$1(expr).trunc();
    }
    else {
        return fieldOrExpression$1(expr).trunc(valueToDefaultExpr$1(decimalPlaces));
    }
}
function collectionId(expr) {
    return fieldOrExpression$1(expr).collectionId();
}
function length(expr) {
    return fieldOrExpression$1(expr).length();
}
function ln(expr) {
    return fieldOrExpression$1(expr).ln();
}
function log(expr, base) {
    return new FunctionExpression('log', [
        fieldOrExpression$1(expr),
        valueToDefaultExpr$1(base)
    ]);
}
function sqrt(expr) {
    return fieldOrExpression$1(expr).sqrt();
}
function stringReverse(expr) {
    return fieldOrExpression$1(expr).stringReverse();
}
function concat(fieldNameOrExpression, second, ...others) {
    return new FunctionExpression('concat', [
        fieldOrExpression$1(fieldNameOrExpression),
        valueToDefaultExpr$1(second),
        ...others.map(valueToDefaultExpr$1)
    ]);
}
function abs(expr) {
    return fieldOrExpression$1(expr).abs();
}
function ifAbsent(fieldNameOrExpression, elseValue) {
    return fieldOrExpression$1(fieldNameOrExpression).ifAbsent(valueToDefaultExpr$1(elseValue));
}
function join(fieldNameOrExpression, delimiterValueOrExpression) {
    return fieldOrExpression$1(fieldNameOrExpression).join(valueToDefaultExpr$1(delimiterValueOrExpression));
}
function log10(expr) {
    return fieldOrExpression$1(expr).log10();
}
function arraySum(expr) {
    return fieldOrExpression$1(expr).arraySum();
}
function split(fieldNameOrExpression, delimiter) {
    return fieldOrExpression$1(fieldNameOrExpression).split(valueToDefaultExpr$1(delimiter));
}
function timestampTruncate(fieldNameOrExpression, granularity, timezone) {
    const internalGranularity = isString(granularity)
        ? valueToDefaultExpr$1(granularity.toLowerCase())
        : granularity;
    return fieldOrExpression$1(fieldNameOrExpression).timestampTruncate(internalGranularity, timezone);
}
function ascending(field) {
    return new Ordering(fieldOrExpression$1(field), 'ascending', 'ascending');
}
function descending(field) {
    return new Ordering(fieldOrExpression$1(field), 'descending', 'descending');
}
/**
 * @beta
 *
 * Represents an ordering criterion for sorting documents in a Firestore pipeline.
 *
 * You create `Ordering` instances using the `ascending` and `descending` helper functions.
 */
class Ordering {
    constructor(expr, direction, _methodName) {
        this.expr = expr;
        this.direction = direction;
        this._methodName = _methodName;
        this._protoValueType = 'ProtoValue';
    }
    /**
     * @private
     * @internal
     */
    _toProto(serializer) {
        return {
            mapValue: {
                fields: {
                    direction: toStringValue(this.direction),
                    expression: this.expr._toProto(serializer)
                }
            }
        };
    }
    /**
     * @private
     * @internal
     */
    _readUserData(context) {
        this.expr._readUserData(context);
    }
}
function isSelectable(val) {
    const candidate = val;
    return (candidate.selectable && isString(candidate.alias) && isExpr(candidate.expr));
}
function isOrdering(val) {
    const candidate = val;
    return (isExpr(candidate.expr) &&
        (candidate.direction === 'ascending' ||
            candidate.direction === 'descending'));
}
function isAliasedAggregate(val) {
    const candidate = val;
    return (isString(candidate.alias) &&
        candidate.aggregate instanceof AggregateFunction);
}
function isExpr(val) {
    return val instanceof Expression;
}
function isBooleanExpr(val) {
    return val instanceof BooleanExpression;
}
function isField(val) {
    return val instanceof Field;
}
function toField(value) {
    if (isString(value)) {
        const result = field(value);
        return result;
    }
    else {
        return value;
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
/* eslint @typescript-eslint/no-explicit-any: 0 */
function toPipelineBooleanExpr(f) {
    if (f instanceof FieldFilter) {
        const fieldValue = field(f.field.toString());
        // Comparison filters
        const value = f.value;
        switch (f.op) {
            case "<" /* Operator.LESS_THAN */:
                return and(fieldValue.exists(), fieldValue.lessThan(Constant._fromProto(value)));
            case "<=" /* Operator.LESS_THAN_OR_EQUAL */:
                return and(fieldValue.exists(), fieldValue.lessThanOrEqual(Constant._fromProto(value)));
            case ">" /* Operator.GREATER_THAN */:
                return and(fieldValue.exists(), fieldValue.greaterThan(Constant._fromProto(value)));
            case ">=" /* Operator.GREATER_THAN_OR_EQUAL */:
                return and(fieldValue.exists(), fieldValue.greaterThanOrEqual(Constant._fromProto(value)));
            case "==" /* Operator.EQUAL */:
                return and(fieldValue.exists(), fieldValue.equal(Constant._fromProto(value)));
            case "!=" /* Operator.NOT_EQUAL */:
                return fieldValue.notEqual(Constant._fromProto(value));
            case "array-contains" /* Operator.ARRAY_CONTAINS */:
                return and(fieldValue.exists(), fieldValue.arrayContains(Constant._fromProto(value)));
            case "in" /* Operator.IN */: {
                const values = value?.arrayValue?.values?.map((val) => Constant._fromProto(val));
                if (!values) {
                    return and(fieldValue.exists(), fieldValue.equalAny([]));
                }
                else if (values.length === 1) {
                    return and(fieldValue.exists(), fieldValue.equal(values[0]));
                }
                else {
                    return and(fieldValue.exists(), fieldValue.equalAny(values));
                }
            }
            case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */: {
                const values = value?.arrayValue?.values?.map((val) => Constant._fromProto(val));
                return and(fieldValue.exists(), fieldValue.arrayContainsAny(values));
            }
            case "not-in" /* Operator.NOT_IN */: {
                const values = value?.arrayValue?.values?.map((val) => Constant._fromProto(val));
                if (!values) {
                    return fieldValue.notEqualAny([]);
                }
                else if (values.length === 1) {
                    return fieldValue.notEqual(values[0]);
                }
                else {
                    return fieldValue.notEqualAny(values);
                }
            }
            default:
                fail(0x9047);
        }
    }
    else if (f instanceof CompositeFilter) {
        switch (f.op) {
            case "and" /* CompositeOperator.AND */: {
                const conditions = f.getFilters().map(f => toPipelineBooleanExpr(f));
                return and(conditions[0], conditions[1], ...conditions.slice(2));
            }
            case "or" /* CompositeOperator.OR */: {
                const conditions = f.getFilters().map(f => toPipelineBooleanExpr(f));
                return or(conditions[0], conditions[1], ...conditions.slice(2));
            }
            default:
                fail(0x89ea);
        }
    }
    throw new Error(`Failed to convert filter to pipeline conditions: ${f}`);
}
function reverseOrderings(orderings) {
    return orderings.map(o => new Ordering(o.expr, o.direction === 'ascending' ? 'descending' : 'ascending', undefined));
}
function toPipeline(query, db) {
    let pipeline;
    if (isCollectionGroupQuery(query)) {
        pipeline = db.pipeline().collectionGroup(query.collectionGroup);
    }
    else if (isDocumentQuery$1(query)) {
        pipeline = db.pipeline().documents([doc(db, query.path.canonicalString())]);
    }
    else {
        pipeline = db.pipeline().collection(query.path.canonicalString());
    }
    // filters
    for (const filter of query.filters) {
        pipeline = pipeline.where(toPipelineBooleanExpr(filter));
    }
    // orders
    const orders = queryNormalizedOrderBy(query);
    const existsConditions = query.explicitOrderBy.map(order => field(order.field.canonicalString()).exists());
    if (existsConditions.length > 0) {
        const condition = existsConditions.length === 1
            ? existsConditions[0]
            : and(existsConditions[0], existsConditions[1], ...existsConditions.slice(2));
        pipeline = pipeline.where(condition);
    }
    const orderings = orders.map(order => order.dir === "asc" /* Direction.ASCENDING */
        ? field(order.field.canonicalString()).ascending()
        : field(order.field.canonicalString()).descending());
    if (orderings.length > 0) {
        if (query.limitType === "L" /* LimitType.Last */) {
            const actualOrderings = reverseOrderings(orderings);
            pipeline = pipeline.sort(actualOrderings[0], ...actualOrderings.slice(1));
            // cursors
            if (query.startAt !== null) {
                pipeline = pipeline.where(whereConditionsFromCursor(query.startAt, orderings, 'after'));
            }
            if (query.endAt !== null) {
                pipeline = pipeline.where(whereConditionsFromCursor(query.endAt, orderings, 'before'));
            }
            pipeline = pipeline.limit(query.limit);
            pipeline = pipeline.sort(orderings[0], ...orderings.slice(1));
        }
        else {
            pipeline = pipeline.sort(orderings[0], ...orderings.slice(1));
            if (query.startAt !== null) {
                pipeline = pipeline.where(whereConditionsFromCursor(query.startAt, orderings, 'after'));
            }
            if (query.endAt !== null) {
                pipeline = pipeline.where(whereConditionsFromCursor(query.endAt, orderings, 'before'));
            }
            if (query.limit !== null) {
                pipeline = pipeline.limit(query.limit);
            }
        }
    }
    return pipeline;
}
function whereConditionsFromCursor(bound, orderings, position) {
    // The filterFunc is either greater than or less than
    const filterFunc = position === 'before' ? lessThan : greaterThan;
    const cursors = bound.position.map(value => Constant._fromProto(value));
    const size = cursors.length;
    let field = orderings[size - 1].expr;
    let value = cursors[size - 1];
    // Add condition for last bound
    let condition = filterFunc(field, value);
    if (bound.inclusive) {
        // When the cursor bound is inclusive, then the last bound
        // can be equal to the value, otherwise it's not equal
        condition = or(condition, field.equal(value));
    }
    // Iterate backwards over the remaining bounds, adding
    // a condition for each one
    for (let i = size - 2; i >= 0; i--) {
        field = orderings[i].expr;
        value = cursors[i];
        // For each field in the orderings, the condition is either
        // a) lt|gt the cursor value,
        // b) or equal the cursor value and lt|gt the cursor values for other fields
        condition = or(filterFunc(field, value), and(field.equal(value), condition));
    }
    return condition;
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
 */
class Stage {
    constructor(options) {
        /**
         * Store optionsProto parsed by _readUserData.
         * @private
         * @internal
         * @protected
         */
        this.optionsProto = undefined;
        ({ rawOptions: this.rawOptions, ...this.knownOptions } = options);
    }
    _readUserData(context) {
        this.optionsProto = this._optionsUtil.getOptionsProto(context, this.knownOptions, this.rawOptions);
    }
    _toProto(_) {
        return {
            name: this._name,
            options: this.optionsProto
        };
    }
}
/**
 * @beta
 */
class AddFields extends Stage {
    get _name() {
        return 'add_fields';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(fields, options) {
        super(options);
        this.fields = fields;
    }
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [toMapValue(serializer, this.fields)]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.fields, context);
    }
}
/**
 * @beta
 */
class RemoveFields extends Stage {
    get _name() {
        return 'remove_fields';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(fields, options) {
        super(options);
        this.fields = fields;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: this.fields.map(f => f._toProto(serializer))
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.fields, context);
    }
}
/**
 * @beta
 */
class Aggregate extends Stage {
    get _name() {
        return 'aggregate';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(groups, accumulators, options) {
        super(options);
        this.groups = groups;
        this.accumulators = accumulators;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [
                toMapValue(serializer, this.accumulators),
                toMapValue(serializer, this.groups)
            ]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.groups, context);
        readUserDataHelper(this.accumulators, context);
    }
}
/**
 * @beta
 */
class Distinct extends Stage {
    get _name() {
        return 'distinct';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(groups, options) {
        super(options);
        this.groups = groups;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [toMapValue(serializer, this.groups)]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.groups, context);
    }
}
/**
 * @beta
 */
class CollectionSource extends Stage {
    get _name() {
        return 'collection';
    }
    get _optionsUtil() {
        return new OptionsUtil({
            forceIndex: {
                serverName: 'force_index'
            }
        });
    }
    constructor(collection, options) {
        super(options);
        // prepend slash to collection string
        this.formattedCollectionPath = collection.startsWith('/')
            ? collection
            : '/' + collection;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [{ referenceValue: this.formattedCollectionPath }]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
    }
}
/**
 * @beta
 */
class CollectionGroupSource extends Stage {
    get _name() {
        return 'collection_group';
    }
    get _optionsUtil() {
        return new OptionsUtil({
            forceIndex: {
                serverName: 'force_index'
            }
        });
    }
    constructor(collectionId, options) {
        super(options);
        this.collectionId = collectionId;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [{ referenceValue: '' }, { stringValue: this.collectionId }]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
    }
}
/**
 * @beta
 */
class DatabaseSource extends Stage {
    get _name() {
        return 'database';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer)
        };
    }
    _readUserData(context) {
        super._readUserData(context);
    }
}
/**
 * @beta
 */
class DocumentsSource extends Stage {
    get _name() {
        return 'documents';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(docPaths, options) {
        super(options);
        this.formattedPaths = docPaths.map(path => path.startsWith('/') ? path : '/' + path);
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: this.formattedPaths.map(p => {
                return { referenceValue: p };
            })
        };
    }
    _readUserData(context) {
        super._readUserData(context);
    }
}
/**
 * @beta
 */
class Where extends Stage {
    get _name() {
        return 'where';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(condition, options) {
        super(options);
        this.condition = condition;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [this.condition._toProto(serializer)]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.condition, context);
    }
}
/**
 * @beta
 */
class FindNearest extends Stage {
    get _name() {
        return 'find_nearest';
    }
    get _optionsUtil() {
        return new OptionsUtil({
            limit: {
                serverName: 'limit'
            },
            distanceField: {
                serverName: 'distance_field'
            }
        });
    }
    constructor(vectorValue, field, distanceMeasure, options) {
        super(options);
        this.vectorValue = vectorValue;
        this.field = field;
        this.distanceMeasure = distanceMeasure;
    }
    /**
     * @private
     * @internal
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [
                this.field._toProto(serializer),
                this.vectorValue._toProto(serializer),
                toStringValue(this.distanceMeasure)
            ]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.vectorValue, context);
        readUserDataHelper(this.field, context);
    }
}
/**
 * @beta
 */
class Limit extends Stage {
    get _name() {
        return 'limit';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(limit, options) {
        hardAssert(!isNaN(limit) && limit !== Infinity && limit !== -Infinity, 0x882c);
        super(options);
        this.limit = limit;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [toNumber(serializer, this.limit)]
        };
    }
}
/**
 * @beta
 */
class Offset extends Stage {
    get _name() {
        return 'offset';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(offset, options) {
        super(options);
        this.offset = offset;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [toNumber(serializer, this.offset)]
        };
    }
}
/**
 * @beta
 */
class Select extends Stage {
    get _name() {
        return 'select';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(selections, options) {
        super(options);
        this.selections = selections;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [toMapValue(serializer, this.selections)]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.selections, context);
    }
}
/**
 * @beta
 */
class Sort extends Stage {
    get _name() {
        return 'sort';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(orderings, options) {
        super(options);
        this.orderings = orderings;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: this.orderings.map(o => o._toProto(serializer))
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.orderings, context);
    }
}
/**
 * @beta
 */
class Sample extends Stage {
    get _name() {
        return 'sample';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(rate, mode, options) {
        super(options);
        this.rate = rate;
        this.mode = mode;
    }
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [toNumber(serializer, this.rate), toStringValue(this.mode)]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
    }
}
/**
 * @beta
 */
class Union extends Stage {
    get _name() {
        return 'union';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(other, options) {
        super(options);
        this.other = other;
    }
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [toPipelineValue(this.other._toProto(serializer))]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
    }
}
/**
 * @beta
 */
class Unnest extends Stage {
    get _name() {
        return 'unnest';
    }
    get _optionsUtil() {
        return new OptionsUtil({
            indexField: {
                serverName: 'index_field'
            }
        });
    }
    constructor(alias, expr, options) {
        super(options);
        this.alias = alias;
        this.expr = expr;
    }
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [
                this.expr._toProto(serializer),
                field(this.alias)._toProto(serializer)
            ]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.expr, context);
    }
}
/**
 * @beta
 */
class Replace extends Stage {
    get _name() {
        return 'replace_with';
    }
    get _optionsUtil() {
        return new OptionsUtil({});
    }
    constructor(map, options) {
        super(options);
        this.map = map;
    }
    _toProto(serializer) {
        return {
            ...super._toProto(serializer),
            args: [this.map._toProto(serializer), toStringValue(Replace.MODE)]
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.map, context);
    }
}
Replace.MODE = 'full_replace';
/**
 * @beta
 */
class RawStage extends Stage {
    /**
     * @private
     * @internal
     */
    constructor(name, params, rawOptions) {
        super({ rawOptions });
        this.name = name;
        this.params = params;
    }
    /**
     * @internal
     * @private
     */
    _toProto(serializer) {
        return {
            name: this.name,
            args: this.params.map(o => o._toProto(serializer)),
            options: this.optionsProto
        };
    }
    _readUserData(context) {
        super._readUserData(context);
        readUserDataHelper(this.params, context);
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
 */
function readUserDataHelper(expressionMap, context) {
    if (isUserData(expressionMap)) {
        expressionMap._readUserData(context);
    }
    else if (Array.isArray(expressionMap)) {
        expressionMap.forEach(readableData => readableData._readUserData(context));
    }
    else {
        expressionMap.forEach(expr => expr._readUserData(context));
    }
    return expressionMap;
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
 */
class PipelineSource {
    /**
     * @internal
     * @private
     * @param databaseId
     * @param _createPipeline
     */
    constructor(databaseId, 
    /**
     * @internal
     * @private
     */
    _createPipeline) {
        this.databaseId = databaseId;
        this._createPipeline = _createPipeline;
    }
    collection(collectionOrOptions) {
        // Process argument union(s) from method overloads
        const options = isString(collectionOrOptions) ||
            isCollectionReference(collectionOrOptions)
            ? {}
            : collectionOrOptions;
        const collectionRefOrString = isString(collectionOrOptions) ||
            isCollectionReference(collectionOrOptions)
            ? collectionOrOptions
            : collectionOrOptions.collection;
        // Validate that a user provided reference is for the same Firestore DB
        if (isCollectionReference(collectionRefOrString)) {
            this._validateReference(collectionRefOrString);
        }
        // Convert user land convenience types to internal types
        const normalizedCollection = isString(collectionRefOrString)
            ? collectionRefOrString
            : collectionRefOrString.path;
        // Create stage object
        const stage = new CollectionSource(normalizedCollection, options);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    collectionGroup(collectionIdOrOptions) {
        // Process argument union(s) from method overloads
        let collectionId;
        let options;
        if (isString(collectionIdOrOptions)) {
            collectionId = collectionIdOrOptions;
            options = {};
        }
        else {
            ({ collectionId, ...options } = collectionIdOrOptions);
        }
        // Create stage object
        const stage = new CollectionGroupSource(collectionId, options);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    database(options) {
        // Process argument union(s) from method overloads
        options = options ?? {};
        // Create stage object
        const stage = new DatabaseSource(options);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    documents(docsOrOptions) {
        // Process argument union(s) from method overloads
        let options;
        let docs;
        if (Array.isArray(docsOrOptions)) {
            docs = docsOrOptions;
            options = {};
        }
        else {
            ({ docs, ...options } = docsOrOptions);
        }
        // Validate that all user provided references are for the same Firestore DB
        docs
            .filter(v => v instanceof DocumentReference)
            .forEach(dr => this._validateReference(dr));
        // Convert user land convenience types to internal types
        const normalizedDocs = docs.map(doc => isString(doc) ? doc : doc.path);
        // Create stage object
        const stage = new DocumentsSource(normalizedDocs, options);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    /**
     * @beta
     * Convert the given Query into an equivalent Pipeline.
     *
     * @param query - A Query to be converted into a Pipeline.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */
    createFrom(query) {
        return toPipeline(query._query, query.firestore);
    }
    _validateReference(reference) {
        const refDbId = reference.firestore._databaseId;
        if (!refDbId.isEqual(this.databaseId)) {
            throw new FirestoreError(Code.INVALID_ARGUMENT, `Invalid ${reference instanceof CollectionReference
                ? 'CollectionReference'
                : 'DocumentReference'}. ` +
                `The project ID ("${refDbId.projectId}") or the database ("${refDbId.database}") does not match ` +
                `the project ID ("${this.databaseId.projectId}") and database ("${this.databaseId.database}") of the target database of this Pipeline.`);
        }
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
 */
class PipelineSnapshot {
    constructor(pipeline, results, executionTime) {
        this._pipeline = pipeline;
        this._executionTime = executionTime;
        this._results = results;
    }
    /**
     * @beta An array of all the results in the `PipelineSnapshot`.
     */
    get results() {
        return this._results;
    }
    /**
     * @beta
     * The time at which the pipeline producing this result is executed.
     *
     * @readonly
     *
     */
    get executionTime() {
        if (this._executionTime === undefined) {
            throw new Error("'executionTime' is expected to exist, but it is undefined");
        }
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
 */
class PipelineResult {
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
    constructor(userDataWriter, fields, ref, createTime, updateTime) {
        this._ref = ref;
        this._userDataWriter = userDataWriter;
        this._createTime = createTime;
        this._updateTime = updateTime;
        this._fields = fields;
    }
    /**
     * @beta
     * The reference of the document, if it is a document; otherwise `undefined`.
     */
    get ref() {
        return this._ref;
    }
    /**
     * @beta
     * The ID of the document for which this PipelineResult contains data, if it is a document; otherwise `undefined`.
     *
     * @readonly
     *
     */
    get id() {
        return this._ref?.id;
    }
    /**
     * @beta
     * The time the document was created. Undefined if this result is not a document.
     *
     * @readonly
     */
    get createTime() {
        return this._createTime;
    }
    /**
     * @beta
     * The time the document was last updated (at the time the snapshot was
     * generated). Undefined if this result is not a document.
     *
     * @readonly
     */
    get updateTime() {
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
     */
    data() {
        return this._userDataWriter.convertValue(this._fields.value);
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the result as a proto value.
     *
     * @returns An `Object` containing all fields in the result.
     */
    _fieldsProto() {
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
    get(fieldPath) {
        if (this._fields === undefined) {
            return undefined;
        }
        if (isField(fieldPath)) {
            fieldPath = fieldPath.fieldName;
        }
        const value = this._fields.field(fieldPathFromArgument('DocumentSnapshot.get', fieldPath));
        if (value !== null) {
            return this._userDataWriter.convertValue(value);
        }
    }
}
/**
 * @beta
 * Test equality of two PipelineResults.
 * @param left - First PipelineResult to compare.
 * @param right - Second PipelineResult to compare.
 */
function pipelineResultEqual(left, right) {
    if (left === right) {
        return true;
    }
    return (isOptionalEqual(left._ref, right._ref, refEqual) &&
        isOptionalEqual(left._fields, right._fields, (l, r) => l.isEqual(r)));
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
 */
function selectablesToMap(selectables) {
    const result = new Map();
    for (const selectable of selectables) {
        let alias;
        let expression;
        if (typeof selectable === 'string') {
            alias = selectable;
            expression = field(selectable);
        }
        else if (selectable instanceof Field) {
            alias = selectable.alias;
            expression = selectable.expr;
        }
        else if (selectable instanceof AliasedExpression) {
            alias = selectable.alias;
            expression = selectable.expr;
        }
        else {
            fail(0x5319, { selectable });
        }
        if (result.get(alias) !== undefined) {
            throw new FirestoreError('invalid-argument', `Duplicate alias or field '${alias}'`);
        }
        result.set(alias, expression);
    }
    return result;
}
function aliasedAggregateToMap(aliasedAggregatees) {
    return aliasedAggregatees.reduce((map, selectable) => {
        if (map.get(selectable.alias) !== undefined) {
            throw new FirestoreError('invalid-argument', `Duplicate alias or field '${selectable.alias}'`);
        }
        map.set(selectable.alias, selectable.aggregate);
        return map;
    }, new Map());
}
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */
function vectorToExpr(value) {
    if (value instanceof Expression) {
        return value;
    }
    else if (value instanceof VectorValue) {
        const result = constant(value);
        return result;
    }
    else if (Array.isArray(value)) {
        const result = constant(vector(value));
        return result;
    }
    else {
        throw new Error('Unsupported value: ' + typeof value);
    }
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
function fieldOrExpression(value) {
    if (isString(value)) {
        const result = field(value);
        return result;
    }
    else {
        return valueToDefaultExpr(value);
    }
}
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */
function valueToDefaultExpr(value) {
    let result;
    if (isFirestoreValue(value)) {
        return constant(value);
    }
    if (value instanceof Expression) {
        return value;
    }
    else if (isPlainObject(value)) {
        result = map(value);
    }
    else if (value instanceof Array) {
        result = array(value);
    }
    else {
        result = _constant(value, undefined);
    }
    return result;
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
 */
class Pipeline$1 {
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
    _db, 
    /**
     * @internal
     * @private
     */
    stages) {
        this._db = _db;
        this.stages = stages;
    }
    _readUserData(context) {
        this.stages.forEach(stage => {
            const subContext = context.contextWith({
                methodName: stage._name
            });
            stage._readUserData(subContext);
        });
    }
    addFields(fieldOrOptions, ...additionalFields) {
        // Process argument union(s) from method overloads
        let fields;
        let options;
        if (isSelectable(fieldOrOptions)) {
            fields = [fieldOrOptions, ...additionalFields];
            options = {};
        }
        else {
            ({ fields, ...options } = fieldOrOptions);
        }
        // Convert user land convenience types to internal types
        const normalizedFields = selectablesToMap(fields);
        // Create stage object
        const stage = new AddFields(normalizedFields, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    removeFields(fieldValueOrOptions, ...additionalFields) {
        // Process argument union(s) from method overloads
        const options = isField(fieldValueOrOptions) || isString(fieldValueOrOptions)
            ? {}
            : fieldValueOrOptions;
        const fields = isField(fieldValueOrOptions) || isString(fieldValueOrOptions)
            ? [fieldValueOrOptions, ...additionalFields]
            : fieldValueOrOptions.fields;
        // Convert user land convenience types to internal types
        const convertedFields = fields.map(f => isString(f) ? field(f) : f);
        // Create stage object
        const stage = new RemoveFields(convertedFields, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    select(selectionOrOptions, ...additionalSelections) {
        // Process argument union(s) from method overloads
        const options = isSelectable(selectionOrOptions) || isString(selectionOrOptions)
            ? {}
            : selectionOrOptions;
        const selections = isSelectable(selectionOrOptions) || isString(selectionOrOptions)
            ? [selectionOrOptions, ...additionalSelections]
            : selectionOrOptions.selections;
        // Convert user land convenience types to internal types
        const normalizedSelections = selectablesToMap(selections);
        // Create stage object
        const stage = new Select(normalizedSelections, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    where(conditionOrOptions) {
        // Process argument union(s) from method overloads
        const options = isBooleanExpr(conditionOrOptions) ? {} : conditionOrOptions;
        const condition = isBooleanExpr(conditionOrOptions)
            ? conditionOrOptions
            : conditionOrOptions.condition;
        // Create stage object
        const stage = new Where(condition, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    offset(offsetOrOptions) {
        // Process argument union(s) from method overloads
        let options;
        let offset;
        if (isNumber$1(offsetOrOptions)) {
            options = {};
            offset = offsetOrOptions;
        }
        else {
            options = offsetOrOptions;
            offset = offsetOrOptions.offset;
        }
        // Create stage object
        const stage = new Offset(offset, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    limit(limitOrOptions) {
        // Process argument union(s) from method overloads
        const options = isNumber$1(limitOrOptions) ? {} : limitOrOptions;
        const limit = isNumber$1(limitOrOptions)
            ? limitOrOptions
            : limitOrOptions.limit;
        // Create stage object
        const stage = new Limit(limit, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    distinct(groupOrOptions, ...additionalGroups) {
        // Process argument union(s) from method overloads
        const options = isString(groupOrOptions) || isSelectable(groupOrOptions)
            ? {}
            : groupOrOptions;
        const groups = isString(groupOrOptions) || isSelectable(groupOrOptions)
            ? [groupOrOptions, ...additionalGroups]
            : groupOrOptions.groups;
        // Convert user land convenience types to internal types
        const convertedGroups = selectablesToMap(groups);
        // Create stage object
        const stage = new Distinct(convertedGroups, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    aggregate(targetOrOptions, ...rest) {
        // Process argument union(s) from method overloads
        const options = isAliasedAggregate(targetOrOptions) ? {} : targetOrOptions;
        const accumulators = isAliasedAggregate(targetOrOptions)
            ? [targetOrOptions, ...rest]
            : targetOrOptions.accumulators;
        const groups = isAliasedAggregate(targetOrOptions)
            ? []
            : targetOrOptions.groups ?? [];
        // Convert user land convenience types to internal types
        const convertedAccumulators = aliasedAggregateToMap(accumulators);
        const convertedGroups = selectablesToMap(groups);
        // Create stage object
        const stage = new Aggregate(convertedGroups, convertedAccumulators, options);
        // Add stage to the pipeline
        return this._addStage(stage);
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
     */
    findNearest(options) {
        // Convert user land convenience types to internal types
        const field = toField(options.field);
        const vectorValue = vectorToExpr(options.vectorValue);
        const distanceField = options.distanceField
            ? toField(options.distanceField)
            : undefined;
        const internalOptions = {
            distanceField,
            limit: options.limit,
            rawOptions: options.rawOptions
        };
        // Create stage object
        const stage = new FindNearest(vectorValue, field, options.distanceMeasure, internalOptions);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    sort(orderingOrOptions, ...additionalOrderings) {
        // Process argument union(s) from method overloads
        const options = isOrdering(orderingOrOptions) ? {} : orderingOrOptions;
        const orderings = isOrdering(orderingOrOptions)
            ? [orderingOrOptions, ...additionalOrderings]
            : orderingOrOptions.orderings;
        // Create stage object
        const stage = new Sort(orderings, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    replaceWith(valueOrOptions) {
        // Process argument union(s) from method overloads
        const options = isString(valueOrOptions) || isExpr(valueOrOptions) ? {} : valueOrOptions;
        const fieldNameOrExpr = isString(valueOrOptions) || isExpr(valueOrOptions)
            ? valueOrOptions
            : valueOrOptions.map;
        // Convert user land convenience types to internal types
        const mapExpr = fieldOrExpression(fieldNameOrExpr);
        // Create stage object
        const stage = new Replace(mapExpr, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    sample(documentsOrOptions) {
        // Process argument union(s) from method overloads
        const options = isNumber$1(documentsOrOptions) ? {} : documentsOrOptions;
        let rate;
        let mode;
        if (isNumber$1(documentsOrOptions)) {
            rate = documentsOrOptions;
            mode = 'documents';
        }
        else if (isNumber$1(documentsOrOptions.documents)) {
            rate = documentsOrOptions.documents;
            mode = 'documents';
        }
        else {
            rate = documentsOrOptions.percentage;
            mode = 'percent';
        }
        // Create stage object
        const stage = new Sample(rate, mode, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    union(otherOrOptions) {
        // Process argument union(s) from method overloads
        let options;
        let otherPipeline;
        if (isPipeline(otherOrOptions)) {
            options = {};
            otherPipeline = otherOrOptions;
        }
        else {
            ({ other: otherPipeline, ...options } = otherOrOptions);
        }
        // Create stage object
        const stage = new Union(otherPipeline, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    unnest(selectableOrOptions, indexField) {
        // Process argument union(s) from method overloads
        let options;
        let selectable;
        let indexFieldName;
        if (isSelectable(selectableOrOptions)) {
            options = {};
            selectable = selectableOrOptions;
            indexFieldName = indexField;
        }
        else {
            ({
                selectable,
                indexField: indexFieldName,
                ...options
            } = selectableOrOptions);
        }
        // Convert user land convenience types to internal types
        const alias = selectable.alias;
        const expr = selectable.expr;
        if (isString(indexFieldName)) {
            options.indexField = _field(indexFieldName, 'unnest');
        }
        // Create stage object
        const stage = new Unnest(alias, expr, options);
        // Add stage to the pipeline
        return this._addStage(stage);
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
     */
    rawStage(name, params, options) {
        // Convert user land convenience types to internal types
        const expressionParams = params.map((value) => {
            if (value instanceof Expression) {
                return value;
            }
            else if (value instanceof AggregateFunction) {
                return value;
            }
            else if (isPlainObject(value)) {
                return _mapValue(value);
            }
            else {
                return _constant(value, 'rawStage');
            }
        });
        // Create stage object
        const stage = new RawStage(name, expressionParams, options ?? {});
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    /**
     * @internal
     * @private
     */
    _toProto(jsonProtoSerializer) {
        const stages = this.stages.map(stage => stage._toProto(jsonProtoSerializer));
        return { stages };
    }
    _addStage(stage) {
        const copy = this.stages.map(s => s);
        copy.push(stage);
        return this.newPipeline(this._db, copy);
    }
    /**
     * @internal
     * @private
     * @param db
     * @param userDataReader
     * @param userDataWriter
     * @param stages
     * @protected
     */
    newPipeline(db, stages) {
        return new Pipeline$1(db, stages);
    }
}
function isPipeline(val) {
    return val instanceof Pipeline$1;
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
 */
class Pipeline extends Pipeline$1 {
    /**
     * @internal
     * @private
     * @param db
     * @param userDataWriter
     * @param stages
     * @protected
     */
    newPipeline(db, stages) {
        return new Pipeline(db, stages);
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
function execute(pipelineOrOptions) {
    const options = !(pipelineOrOptions instanceof Pipeline$1)
        ? pipelineOrOptions
        : {
            pipeline: pipelineOrOptions
        };
    const { pipeline, rawOptions, ...rest } = options;
    const firestore = cast(pipeline._db, Firestore);
    const client = ensureFirestoreConfigured(firestore);
    const userDataReader = newUserDataReader(firestore);
    const context = userDataReader.createContext(3 /* UserDataSource.Argument */, 'execute');
    pipeline._readUserData(context);
    const userDataWriter = new ExpUserDataWriter(firestore);
    const structuredPipelineOptions = new StructuredPipelineOptions(rest, rawOptions);
    structuredPipelineOptions._readUserData(context);
    const structuredPipeline = new StructuredPipeline(pipeline, structuredPipelineOptions);
    return firestoreClientExecutePipeline(client, structuredPipeline).then(result => {
        // Get the execution time from the first result.
        // firestoreClientExecutePipeline returns at least one PipelineStreamElement
        // even if the returned document set is empty.
        const executionTime = result.length > 0 ? result[0].executionTime?.toTimestamp() : undefined;
        const docs = result
            // Currently ignore any response from ExecutePipeline that does
            // not contain any document data in the `fields` property.
            .filter(element => !!element.fields)
            .map(element => new PipelineResult(userDataWriter, element.fields, element.key?.path
            ? new DocumentReference(firestore, null, element.key)
            : undefined, element.createTime?.toTimestamp(), element.updateTime?.toTimestamp()));
        return new PipelineSnapshot(pipeline, docs, executionTime);
    });
}
/**
 * @beta
 * Creates and returns a new PipelineSource, which allows specifying the source stage of a {@link @firebase/firestore/pipelines#Pipeline}.
 *
 * @example
 * ```
 * let myPipeline: Pipeline = firestore.pipeline().collection('books');
 * ```
 */
// Augment the Firestore class with the pipeline() factory method
Firestore.prototype.pipeline = function () {
    return new PipelineSource(this._databaseId, (stages) => {
        return new Pipeline(this, stages);
    });
};

export { AggregateFunction, AliasedAggregate, AliasedExpression, BooleanExpression, Expression, Field, FunctionExpression, Ordering, Pipeline, PipelineResult, PipelineSnapshot, PipelineSource, abs, add, and, array, arrayAgg, arrayAggDistinct, arrayConcat, arrayContains, arrayContainsAll, arrayContainsAny, arrayFirst, arrayFirstN, arrayGet, arrayIndexOf, arrayIndexOfAll, arrayLast, arrayLastIndexOf, arrayLastN, arrayLength, arrayMaximum, arrayMaximumN, arrayMinimum, arrayMinimumN, arraySum, ascending, average, byteLength, ceil, charLength, collectionId, concat, conditional, constant, cosineDistance, count, countAll, countDistinct, countIf, currentTimestamp, descending, divide, documentId, dotProduct, endsWith, equal, equalAny, euclideanDistance, execute, exists, exp, field, first, floor, greaterThan, greaterThanOrEqual, ifAbsent, ifError, isAbsent, isError, isType, join, last, length, lessThan, lessThanOrEqual, like, ln, log, log10, logicalMaximum, logicalMinimum, ltrim, map, mapEntries, mapGet, mapKeys, mapMerge, mapRemove, mapSet, mapValues, maximum, minimum, mod, multiply, not, notEqual, notEqualAny, or, pipelineResultEqual, pow, rand, regexContains, regexFind, regexFindAll, regexMatch, reverse, round, rtrim, split, sqrt, startsWith, stringConcat, stringContains, stringIndexOf, stringRepeat, stringReplaceAll, stringReplaceOne, stringReverse, substring, subtract, sum, timestampAdd, timestampSubtract, timestampToUnixMicros, timestampToUnixMillis, timestampToUnixSeconds, timestampTruncate, toLower, toUpper, trim, trunc, type, unixMicrosToTimestamp, unixMillisToTimestamp, unixSecondsToTimestamp, vectorLength, xor };
//# sourceMappingURL=pipelines.node.mjs.map
