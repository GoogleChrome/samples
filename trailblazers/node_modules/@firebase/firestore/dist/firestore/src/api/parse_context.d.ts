/**
 * @license
 * Copyright 2020 Google LLC
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
import { DatabaseId } from '../core/database_info';
import { UserDataSource } from '../lite-api/user_data_reader';
import { DocumentKey } from '../model/document_key';
import { FieldTransform } from '../model/mutation';
import { FieldPath as InternalFieldPath } from '../model/path';
import { JsonProtoSerializer } from '../remote/serializer';
import { FirestoreError } from '../util/error';
/** Contains the settings that are mutated as we parse user data. */
export interface ContextSettings {
    /** Indicates what kind of API method this data came from. */
    readonly dataSource: UserDataSource;
    /** The name of the method the user called to create the ParseContext. */
    readonly methodName: string;
    /** The document the user is attempting to modify, if that applies. */
    readonly targetDoc?: DocumentKey;
    /**
     * A path within the object being parsed. This could be an empty path (in
     * which case the context represents the root of the data being parsed), or a
     * nonempty path (indicating the context represents a nested location within
     * the data).
     */
    readonly path?: InternalFieldPath;
    /**
     * Whether or not this context corresponds to an element of an array.
     * If not set, elements are treated as if they were outside of arrays.
     */
    readonly arrayElement?: boolean;
    /**
     * Whether or not a converter was specified in this context. If true, error
     * messages will reference the converter when invalid data is provided.
     */
    readonly hasConverter?: boolean;
}
export interface ParseContext {
    readonly settings: ContextSettings;
    readonly databaseId: DatabaseId;
    readonly serializer: JsonProtoSerializer;
    readonly ignoreUndefinedProperties: boolean;
    fieldTransforms: FieldTransform[];
    fieldMask: InternalFieldPath[];
    get path(): InternalFieldPath | undefined;
    get dataSource(): UserDataSource;
    contextWith(configuration: Partial<ContextSettings>): ParseContext;
    childContextForField(field: string): ParseContext;
    childContextForFieldPath(field: InternalFieldPath): ParseContext;
    childContextForArray(index: number): ParseContext;
    createError(reason: string): FirestoreError;
    contains(fieldPath: InternalFieldPath): boolean;
}
