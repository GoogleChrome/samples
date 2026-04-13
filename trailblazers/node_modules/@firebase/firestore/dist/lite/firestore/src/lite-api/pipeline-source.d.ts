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
import { DatabaseId } from '../core/database_info';
import { Pipeline } from './pipeline';
import { CollectionReference, DocumentReference, Query } from './reference';
import { Stage } from './stage';
import { CollectionGroupStageOptions, CollectionStageOptions, DatabaseStageOptions, DocumentsStageOptions } from './stage_options';
/**
 * @beta
 * Provides the entry point for defining the data source of a Firestore {@link @firebase/firestore/pipelines#Pipeline}.
 *
 * Use the methods of this class (e.g., {@link @firebase/firestore/pipelines#PipelineSource.(collection:1)}, {@link @firebase/firestore/pipelines#PipelineSource.(collectionGroup:1)},
 * {@link @firebase/firestore/pipelines#PipelineSource.(database:1)}, or {@link @firebase/firestore/pipelines#PipelineSource.(documents:1)}) to specify the initial data
 * for your pipeline, such as a collection, a collection group, the entire database, or a set of specific documents.
 */
export declare class PipelineSource<PipelineType> {
    private databaseId;
    /**
     * @internal
     * @private
     */
    _createPipeline: (stages: Stage[]) => PipelineType;
    /**
     * @internal
     * @private
     * @param databaseId
     * @param _createPipeline
     */
    constructor(databaseId: DatabaseId, 
    /**
     * @internal
     * @private
     */
    _createPipeline: (stages: Stage[]) => PipelineType);
    /**
     * @beta
     * Returns all documents from the entire collection. The collection can be nested.
     * @param collection - Name or reference to the collection that will be used as the Pipeline source.
     */
    collection(collection: string | CollectionReference): PipelineType;
    /**
     * @beta
     * Returns all documents from the entire collection. The collection can be nested.
     * @param options - Options defining how this CollectionStage is evaluated.
     */
    collection(options: CollectionStageOptions): PipelineType;
    /**
     * @beta
     * Returns all documents from a collection ID regardless of the parent.
     * @param collectionId - ID of the collection group to use as the Pipeline source.
     */
    collectionGroup(collectionId: string): PipelineType;
    /**
     * @beta
     * Returns all documents from a collection ID regardless of the parent.
     * @param options - Options defining how this CollectionGroupStage is evaluated.
     */
    collectionGroup(options: CollectionGroupStageOptions): PipelineType;
    /**
     * @beta
     * Returns all documents from the entire database.
     */
    database(): PipelineType;
    /**
     * @beta
     * Returns all documents from the entire database.
     * @param options - Options defining how a DatabaseStage is evaluated.
     */
    database(options: DatabaseStageOptions): PipelineType;
    /**
     * @beta
     * Set the pipeline's source to the documents specified by the given paths and DocumentReferences.
     *
     * @param docs - An array of paths and DocumentReferences specifying the individual documents that will be the source of this pipeline.
     * The converters for these DocumentReferences will be ignored and not have an effect on this pipeline.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */
    documents(docs: Array<string | DocumentReference>): PipelineType;
    /**
     * @beta
     * Set the pipeline's source to the documents specified by the given paths and DocumentReferences.
     *
     * @param options - Options defining how this DocumentsStage is evaluated.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */
    documents(options: DocumentsStageOptions): PipelineType;
    /**
     * @beta
     * Convert the given Query into an equivalent Pipeline.
     *
     * @param query - A Query to be converted into a Pipeline.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */
    createFrom(query: Query): Pipeline;
    _validateReference(reference: CollectionReference | DocumentReference): void;
}
