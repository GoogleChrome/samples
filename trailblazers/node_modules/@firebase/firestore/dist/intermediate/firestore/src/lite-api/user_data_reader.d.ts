/**
 * @license
 * Copyright 2017 Google LLC
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
import { DocumentData, FieldPath as PublicFieldPath, SetOptions } from '@firebase/firestore-types';
import { Compat } from '@firebase/util';
import { ContextSettings, ParseContext } from '../api/parse_context';
import { DatabaseId } from '../core/database_info';
import { DocumentKey } from '../model/document_key';
import { FieldMask } from '../model/field_mask';
import { FieldTransform, Mutation, Precondition } from '../model/mutation';
import { ObjectValue } from '../model/object_value';
import { FieldPath as InternalFieldPath } from '../model/path';
import { MapValue as ProtoMapValue, Value as ProtoValue } from '../protos/firestore_proto_api';
import { JsonProtoSerializer } from '../remote/serializer';
import { FirestoreError } from '../util/error';
import { Dict } from '../util/obj';
import { Firestore } from './database';
import { FieldValue } from './field_value';
import { PartialWithFieldValue, WithFieldValue } from './reference';
import { VectorValue } from './vector_value';
/**
 * An untyped Firestore Data Converter interface that is shared between the
 * lite, firestore-exp and classic SDK.
 */
export interface UntypedFirestoreDataConverter<AppModelType, DbModelType extends DocumentData = DocumentData> {
    toFirestore(modelObject: WithFieldValue<AppModelType>): WithFieldValue<DbModelType>;
    toFirestore(modelObject: PartialWithFieldValue<AppModelType>, options: SetOptions): PartialWithFieldValue<DbModelType>;
    fromFirestore(snapshot: unknown, options?: unknown): AppModelType;
}
/** The result of parsing document data (e.g. for a setData call). */
export declare class ParsedSetData {
    readonly data: ObjectValue;
    readonly fieldMask: FieldMask | null;
    readonly fieldTransforms: FieldTransform[];
    constructor(data: ObjectValue, fieldMask: FieldMask | null, fieldTransforms: FieldTransform[]);
    toMutation(key: DocumentKey, precondition: Precondition): Mutation;
}
/** The result of parsing "update" data (i.e. for an updateData call). */
export declare class ParsedUpdateData {
    readonly data: ObjectValue;
    readonly fieldMask: FieldMask;
    readonly fieldTransforms: FieldTransform[];
    constructor(data: ObjectValue, fieldMask: FieldMask, fieldTransforms: FieldTransform[]);
    toMutation(key: DocumentKey, precondition: Precondition): Mutation;
}
export declare const enum UserDataSource {
    Set = 0,
    Update = 1,
    MergeSet = 2,
    /**
     * Indicates the source is a where clause, cursor bound, arrayUnion()
     * element, etc. Of note, isWrite(source) will return false.
     */
    Argument = 3,
    /**
     * Indicates that the source is an Argument that may directly contain nested
     * arrays (e.g. the operand of an `in` query).
     */
    ArrayArgument = 4
}
/** A "context" object passed around while parsing user data. */
declare class ParseContextImpl implements ParseContext {
    readonly settings: ContextSettings;
    readonly databaseId: DatabaseId;
    readonly serializer: JsonProtoSerializer;
    readonly ignoreUndefinedProperties: boolean;
    readonly fieldTransforms: FieldTransform[];
    readonly fieldMask: InternalFieldPath[];
    /**
     * Initializes a ParseContext with the given source and path.
     *
     * @param settings - The settings for the parser.
     * @param databaseId - The database ID of the Firestore instance.
     * @param serializer - The serializer to use to generate the Value proto.
     * @param ignoreUndefinedProperties - Whether to ignore undefined properties
     * rather than throw.
     * @param fieldTransforms - A mutable list of field transforms encountered
     * while parsing the data.
     * @param fieldMask - A mutable list of field paths encountered while parsing
     * the data.
     *
     * TODO(b/34871131): We don't support array paths right now, so path can be
     * null to indicate the context represents any location within an array (in
     * which case certain features will not work and errors will be somewhat
     * compromised).
     */
    constructor(settings: ContextSettings, databaseId: DatabaseId, serializer: JsonProtoSerializer, ignoreUndefinedProperties: boolean, fieldTransforms?: FieldTransform[], fieldMask?: InternalFieldPath[]);
    get path(): InternalFieldPath | undefined;
    get dataSource(): UserDataSource;
    /** Returns a new context with the specified settings overwritten. */
    contextWith(configuration: Partial<ContextSettings>): ParseContextImpl;
    childContextForField(field: string): ParseContextImpl;
    childContextForFieldPath(field: InternalFieldPath): ParseContextImpl;
    childContextForArray(index: number): ParseContextImpl;
    createError(reason: string): FirestoreError;
    /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
    contains(fieldPath: InternalFieldPath): boolean;
    private validatePath;
    private validatePathSegment;
}
/**
 * Helper for parsing raw user input (provided via the API) into internal model
 * classes.
 */
export declare class UserDataReader {
    private readonly databaseId;
    private readonly ignoreUndefinedProperties;
    private readonly serializer;
    constructor(databaseId: DatabaseId, ignoreUndefinedProperties: boolean, serializer?: JsonProtoSerializer);
    /** Creates a new top-level parse context. */
    createContext(dataSource: UserDataSource, methodName: string, targetDoc?: DocumentKey, hasConverter?: boolean): ParseContextImpl;
}
export declare function newUserDataReader(firestore: Firestore): UserDataReader;
/** Parse document data from a set() call. */
export declare function parseSetData(userDataReader: UserDataReader, methodName: string, targetDoc: DocumentKey, input: unknown, hasConverter: boolean, options?: SetOptions): ParsedSetData;
export declare class DeleteFieldValueImpl extends FieldValue {
    _toFieldTransform(context: ParseContextImpl): null;
    isEqual(other: FieldValue): boolean;
}
export declare class ServerTimestampFieldValueImpl extends FieldValue {
    _toFieldTransform(context: ParseContextImpl): FieldTransform;
    isEqual(other: FieldValue): boolean;
}
export declare class ArrayUnionFieldValueImpl extends FieldValue {
    private readonly _elements;
    constructor(methodName: string, _elements: unknown[]);
    _toFieldTransform(context: ParseContextImpl): FieldTransform;
    isEqual(other: FieldValue): boolean;
}
export declare class ArrayRemoveFieldValueImpl extends FieldValue {
    private readonly _elements;
    constructor(methodName: string, _elements: unknown[]);
    _toFieldTransform(context: ParseContextImpl): FieldTransform;
    isEqual(other: FieldValue): boolean;
}
export declare class NumericIncrementFieldValueImpl extends FieldValue {
    private readonly _operand;
    constructor(methodName: string, _operand: number);
    _toFieldTransform(context: ParseContextImpl): FieldTransform;
    isEqual(other: FieldValue): boolean;
}
/** Parse update data from an update() call. */
export declare function parseUpdateData(userDataReader: UserDataReader, methodName: string, targetDoc: DocumentKey, input: unknown): ParsedUpdateData;
/** Parse update data from a list of field/value arguments. */
export declare function parseUpdateVarargs(userDataReader: UserDataReader, methodName: string, targetDoc: DocumentKey, field: string | PublicFieldPath | Compat<PublicFieldPath>, value: unknown, moreFieldsAndValues: unknown[]): ParsedUpdateData;
/**
 * Parse a "query value" (e.g. value in a where filter or a value in a cursor
 * bound).
 *
 * @param allowArrays - Whether the query value is an array that may directly
 * contain additional arrays (e.g. the operand of an `in` query).
 */
export declare function parseQueryValue(userDataReader: UserDataReader, methodName: string, input: unknown, allowArrays?: boolean): ProtoValue;
/**
 * Parses user data to Protobuf Values.
 *
 * @param input - Data to be parsed.
 * @param context - A context object representing the current path being parsed,
 * the source of the data being parsed, etc.
 * @returns The parsed value, or null if the value was a FieldValue sentinel
 * that should not be included in the resulting parsed data.
 */
export declare function parseData(input: unknown, context: ParseContext): ProtoValue | null;
export declare function parseObject(obj: Dict<unknown>, context: ParseContext): {
    mapValue: ProtoMapValue;
};
/**
 * Helper to parse a scalar value (i.e. not an Object, Array, or FieldValue)
 *
 * @returns The parsed value
 */
export declare function parseScalarValue(value: unknown, context: ParseContext): ProtoValue | null;
/**
 * Creates a new VectorValue proto value (using the internal format).
 */
export declare function parseVectorValue(value: VectorValue | number[], context: ParseContext): {
    mapValue: ProtoMapValue;
};
/**
 * Checks whether an object looks like a JSON object that should be converted
 * into a struct. Normal class/prototype instances are considered to look like
 * JSON objects since they should be converted to a struct value. Arrays, Dates,
 * GeoPoints, etc. are not considered to look like JSON objects since they map
 * to specific FieldValue types other than ObjectValue.
 */
export declare function looksLikeJsonObject(input: unknown): boolean;
/**
 * Helper that calls fromDotSeparatedString() but wraps any error thrown.
 */
export declare function fieldPathFromArgument(methodName: string, path: string | PublicFieldPath | Compat<PublicFieldPath>, targetDoc?: DocumentKey): InternalFieldPath;
/**
 * Wraps fromDotSeparatedString with an error message about the method that
 * was thrown.
 * @param methodName - The publicly visible method name
 * @param path - The dot-separated string form of a field path which will be
 * split on dots.
 * @param targetDoc - The document against which the field path will be
 * evaluated.
 */
export declare function fieldPathFromDotSeparatedString(methodName: string, path: string, targetDoc?: DocumentKey): InternalFieldPath;
export interface UserData {
    _readUserData(context: ParseContext): void;
}
export declare function isUserData(value: unknown): value is UserData;
export {};
