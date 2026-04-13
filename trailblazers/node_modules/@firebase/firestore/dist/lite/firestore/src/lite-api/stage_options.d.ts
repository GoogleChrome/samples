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
import { OneOf } from '../util/types';
import { AliasedAggregate, BooleanExpression, Expression, Field, Ordering, Selectable } from './expressions';
import { Pipeline } from './pipeline';
import { CollectionReference, DocumentReference } from './reference';
import { VectorValue } from './vector_value';
/**
 * @beta
 * Options defining how a Stage is evaluated.
 */
export interface StageOptions {
    /**
     * @beta
     * An escape hatch to set options not known at SDK build time. These values
     * will be passed directly to the Firestore backend and not used by the SDK.
     *
     * The option name will be used as provided. And must match the name
     * format used by the backend (hint: use a snake_case_name).
     *
     * Raw option values can be any type supported
     * by Firestore (for example: string, boolean, number, map, …). Value types
     * not known to the SDK will be rejected.
     *
     * Values specified in rawOptions will take precedence over any options
     * with the same name set by the SDK.
     *
     * `rawOptions` supports dot notation, if you want to override
     * a nested option.
     */
    rawOptions?: {
        [name: string]: unknown;
    };
}
/**
 * @beta
 * Options defining how a CollectionStage is evaluated. See {@link @firebase/firestore/pipelines#PipelineSource.(collection:1)}.
 */
export type CollectionStageOptions = StageOptions & {
    /**
     * @beta
     * Name or reference to the collection that will be used as the Pipeline source.
     */
    collection: string | CollectionReference;
    /**
     * @beta
     * Specifies the name of an index to be used for a query, overriding the query optimizer's default choice.
     * This can be useful for performance tuning in specific scenarios where the default index selection
     * does not yield optimal performance.
     *
     * @remarks This property is optional. When provided, it should be the exact name of the index to force.
     */
    forceIndex?: string;
};
/**
 * @beta
 * Defines the configuration options for a CollectionGroupStage within a pipeline.
 * This type extends {@link @firebase/firestore/pipelines#StageOptions} and provides specific settings for how a collection group
 * is identified and processed during pipeline execution.
 *
 * See {@link @firebase/firestore/pipelines#PipelineSource.(collectionGroup:1)} to create a collection group stage.
 */
export type CollectionGroupStageOptions = StageOptions & {
    /**
     * @beta
     * ID of the collection group to use as the Pipeline source.
     */
    collectionId: string;
    /**
     * @beta
     * Specifies the name of an index to be used for a query, overriding the query optimizer's default choice.
     * This can be useful for performance tuning in specific scenarios where the default index selection
     * does not yield optimal performance.
     *
     * @remarks This property is optional. When provided, it should be the exact name of the index to force.
     */
    forceIndex?: string;
};
/**
 * @beta
 * Options defining how a DatabaseStage is evaluated. See {@link @firebase/firestore/pipelines#PipelineSource.(database:1)}.
 */
export type DatabaseStageOptions = StageOptions & {};
/**
 * @beta
 * Options defining how a DocumentsStage is evaluated. See {@link @firebase/firestore/pipelines#PipelineSource.(documents:1)}.
 */
export type DocumentsStageOptions = StageOptions & {
    /**
     * @beta
     * An array of paths and DocumentReferences specifying the individual documents that will be the source of this pipeline.
     * The converters for these DocumentReferences will be ignored and not have an effect on this pipeline.
     * There must be at least one document specified in the array.
     */
    docs: Array<string | DocumentReference>;
};
/**
 * @beta
 * Options defining how an AddFieldsStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(addFields:1)}.
 */
export type AddFieldsStageOptions = StageOptions & {
    /**
     * @beta
     *  The fields to add to each document, specified as a {@link @firebase/firestore/pipelines#Selectable}.
     *  At least one field is required.
     */
    fields: Selectable[];
};
/**
 * @beta
 * Options defining how a RemoveFieldsStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(removeFields:1)}.
 */
export type RemoveFieldsStageOptions = StageOptions & {
    /**
     * @beta
     * The fields to remove from each document.
     */
    fields: Array<Field | string>;
};
/**
 * @beta
 * Options defining how a SelectStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(select:1)}.
 */
export type SelectStageOptions = StageOptions & {
    /**
     * @beta
     * The fields to include in the output documents, specified as {@link @firebase/firestore/pipelines#Selectable} expression
     * or as a string value indicating the field name.
     */
    selections: Array<Selectable | string>;
};
/**
 * @beta
 * Options defining how a WhereStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(where:1)}.
 */
export type WhereStageOptions = StageOptions & {
    /**
     * @beta
     * The {@link @firebase/firestore/pipelines#BooleanExpression} to apply as a filter for each input document to this stage.
     */
    condition: BooleanExpression;
};
/**
 * @beta
 * Options defining how an OffsetStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(offset:1)}.
 */
export type OffsetStageOptions = StageOptions & {
    /**
     * @beta
     * The number of documents to skip.
     */
    offset: number;
};
/**
 * @beta
 * Options defining how a LimitStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(limit:1)}.
 */
export type LimitStageOptions = StageOptions & {
    /**
     * @beta
     * The maximum number of documents to return.
     */
    limit: number;
};
/**
 * @beta
 * Options defining how a DistinctStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(distinct:1)}.
 */
export type DistinctStageOptions = StageOptions & {
    /**
     * @beta
     * The {@link @firebase/firestore/pipelines#Selectable} expressions or field names to consider when determining
     * distinct value combinations (groups).
     */
    groups: Array<string | Selectable>;
};
/**
 * @beta
 * Options defining how an AggregateStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(aggregate:1)}.
 */
export type AggregateStageOptions = StageOptions & {
    /**
     * @beta
     * The {@link @firebase/firestore/pipelines#AliasedAggregate} values specifying aggregate operations to
     * perform on the input documents.
     */
    accumulators: AliasedAggregate[];
    /**
     * @beta
     * The {@link @firebase/firestore/pipelines#Selectable} expressions or field names to consider when determining
     * distinct value combinations (groups), which will be aggregated over.
     */
    groups?: Array<string | Selectable>;
};
/**
 * @beta
 * Options defining how a FindNearestStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(findNearest:1)}.
 */
export type FindNearestStageOptions = StageOptions & {
    /**
     * @beta
     * Specifies the field to be used. This can be a string representing the field path
     * (e.g., 'fieldName', 'nested.fieldName') or an object of type {@link @firebase/firestore/pipelines#Field}
     * representing a more complex field expression.
     */
    field: Field | string;
    /**
     * @beta
     * Specifies the query vector value, to which the vector distance will be computed.
     */
    vectorValue: VectorValue | number[];
    /**
     * @beta
     * Specifies the method used to compute the distance between vectors.
     *
     * Possible values are:
     * - `'euclidean'`: Euclidean distance.
     * - `'cosine'`: Cosine similarity.
     * - `'dot_product'`: Dot product.
     */
    distanceMeasure: 'euclidean' | 'cosine' | 'dot_product';
    /**
     * @beta
     * The maximum number of documents to return from the FindNearest stage.
     */
    limit?: number;
    /**
     * @beta
     * If set, specifies the field on the output documents that will contain
     * the computed vector distance for the document. If not set, the computed
     * vector distance will not be returned.
     */
    distanceField?: string;
};
/**
 * @beta
 * Options defining how a ReplaceWithStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(replaceWith:1)}.
 */
export type ReplaceWithStageOptions = StageOptions & {
    /**
     * @beta
     * The name of a field that contains a map or an {@link @firebase/firestore/pipelines#Expression} that
     * evaluates to a map.
     */
    map: Expression | string;
};
/**
 * @beta
 * Defines the options for evaluating a sample stage within a pipeline.
 * This type combines common {@link @firebase/firestore/pipelines#StageOptions} with a specific configuration
 * where only one of the defined sampling methods can be applied.
 *
 * See {@link @firebase/firestore/pipelines#Pipeline.(sample:1)} to create a sample stage..
 */
export type SampleStageOptions = StageOptions & OneOf<{
    /**
     * @beta
     * If set, specifies the sample rate as a percentage of the
     * input documents.
     *
     * Cannot be set when `documents: number` is set.
     */
    percentage: number;
    /**
     * @beta
     * If set, specifies the sample rate as a total number of
     * documents to sample from the input documents.
     *
     * Cannot be set when `percentage: number` is set.
     */
    documents: number;
}>;
/**
 * @beta
 * Options defining how a UnionStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(union:1)}.
 */
export type UnionStageOptions = StageOptions & {
    /**
     * @beta
     * Specifies the other Pipeline to union with.
     */
    other: Pipeline;
};
/**
 * @beta
 * Represents the specific options available for configuring an `UnnestStage` within a pipeline.
 */
export type UnnestStageOptions = StageOptions & {
    /**
     * @beta
     * A `Selectable` object that defines an array expression to be un-nested
     * and the alias for the un-nested field.
     */
    selectable: Selectable;
    /**
     * @beta
     * If set, specifies the field on the output documents that will contain the
     * offset (starting at zero) that the element is from the original array.
     */
    indexField?: string;
};
/**
 * @beta
 * @beta
 * Options defining how a SortStage is evaluated. See {@link @firebase/firestore/pipelines#Pipeline.(sort:1)}.
 */
export type SortStageOptions = StageOptions & {
    /**
     * @beta
     * Orderings specify how the input documents are sorted.
     * One or more ordering are required.
     */
    orderings: Ordering[];
};
