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
import { ObjectValue } from '../model/object_value';
import { firestoreV1ApiClientInterfaces } from '../protos/firestore_proto_api';
import { Field } from './expressions';
import { FieldPath } from './field_path';
import { Pipeline } from './pipeline';
import { DocumentData, DocumentReference } from './reference';
import { Timestamp } from './timestamp';
import { AbstractUserDataWriter } from './user_data_writer';
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
export declare class PipelineSnapshot {
    private readonly _pipeline;
    private readonly _executionTime;
    private readonly _results;
    constructor(pipeline: Pipeline, results: PipelineResult[], executionTime?: Timestamp);
    /**
     * @beta An array of all the results in the `PipelineSnapshot`.
     */
    get results(): PipelineResult[];
    /**
     * @beta
     * The time at which the pipeline producing this result is executed.
     *
     * @readonly
     *
     */
    get executionTime(): Timestamp;
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
export declare class PipelineResult<AppModelType = DocumentData> {
    private readonly _userDataWriter;
    private readonly _createTime;
    private readonly _updateTime;
    /**
     * @internal
     * @private
     */
    readonly _ref: DocumentReference | undefined;
    /**
     * @internal
     * @private
     */
    readonly _fields: ObjectValue;
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
    constructor(userDataWriter: AbstractUserDataWriter, fields: ObjectValue, ref?: DocumentReference, createTime?: Timestamp, updateTime?: Timestamp);
    /**
     * @beta
     * The reference of the document, if it is a document; otherwise `undefined`.
     */
    get ref(): DocumentReference | undefined;
    /**
     * @beta
     * The ID of the document for which this PipelineResult contains data, if it is a document; otherwise `undefined`.
     *
     * @readonly
     *
     */
    get id(): string | undefined;
    /**
     * @beta
     * The time the document was created. Undefined if this result is not a document.
     *
     * @readonly
     */
    get createTime(): Timestamp | undefined;
    /**
     * @beta
     * The time the document was last updated (at the time the snapshot was
     * generated). Undefined if this result is not a document.
     *
     * @readonly
     */
    get updateTime(): Timestamp | undefined;
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
    data(): AppModelType;
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the result as a proto value.
     *
     * @returns An `Object` containing all fields in the result.
     */
    _fieldsProto(): {
        [key: string]: firestoreV1ApiClientInterfaces.Value;
    };
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
    get(fieldPath: string | FieldPath | Field): any;
}
/**
 * @beta
 * Test equality of two PipelineResults.
 * @param left - First PipelineResult to compare.
 * @param right - Second PipelineResult to compare.
 */
export declare function pipelineResultEqual(left: PipelineResult, right: PipelineResult): boolean;
