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
import { AggregateSpec } from '../lite-api/aggregate_types';
import { Pipeline } from '../lite-api/pipeline';
import { Query } from '../lite-api/reference';
/**
 * @internal
 * @private
 *
 * This function is for internal use only.
 *
 * Returns the `QueryTarget` representation of the given query. Returns `null`
 * if the Firestore client associated with the given query has not been
 * initialized or has been terminated.
 *
 * @param query - The Query to convert to proto representation.
 */
export declare function _internalQueryToProtoQueryTarget(query: Query): any;
/**
 * @internal
 * @private
 *
 * This function is for internal use only.
 *
 * Returns `RunAggregationQueryRequest` which contains the proto representation
 * of the given aggregation query request. Returns null if the Firestore client
 * associated with the given query has not been initialized or has been
 * terminated.
 *
 * @param query - The Query to convert to proto representation.
 * @param aggregateSpec - The set of aggregations and their aliases.
 */
export declare function _internalAggregationQueryToProtoRunAggregationQueryRequest<AggregateSpecType extends AggregateSpec>(query: Query, aggregateSpec: AggregateSpecType): any;
/**
 * @internal
 * @private
 *
 * This function is for internal use only.
 *
 * Returns the `ExecutePipelineRequest` representation of the given query.
 * Returns `null` if the Firestore client associated with the given query has
 * not been initialized or has been terminated.
 *
 * @param pipeline - The Pipeline to convert to proto representation.
 */
export declare function _internalPipelineToExecutePipelineRequestProto(pipeline: Pipeline): any;
