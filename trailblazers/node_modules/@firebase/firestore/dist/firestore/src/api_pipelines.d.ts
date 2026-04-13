/**
 * @license
 * Copyright 2021 Google LLC
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
export { PipelineSource } from './lite-api/pipeline-source';
export { OneOf } from './util/types';
export { PipelineResult, PipelineSnapshot, pipelineResultEqual } from './lite-api/pipeline-result';
export { Pipeline } from './api/pipeline';
export { execute } from './api/pipeline_impl';
export { PipelineExecuteOptions } from './lite-api/pipeline_options';
export { StageOptions, CollectionStageOptions, CollectionGroupStageOptions, DatabaseStageOptions, DocumentsStageOptions, AddFieldsStageOptions, RemoveFieldsStageOptions, SelectStageOptions, WhereStageOptions, OffsetStageOptions, LimitStageOptions, DistinctStageOptions, AggregateStageOptions, FindNearestStageOptions, ReplaceWithStageOptions, SampleStageOptions, UnionStageOptions, UnnestStageOptions, SortStageOptions } from './lite-api/stage_options';
export { field, constant, add, subtract, multiply, divide, mod, equal, notEqual, lessThan, lessThanOrEqual, greaterThan, greaterThanOrEqual, array, arrayConcat, arrayContains, arrayContainsAny, arrayContainsAll, arrayFirst, arrayFirstN, arrayGet, arrayIndexOf, arrayIndexOfAll, arrayLast, arrayLastIndexOf, arrayLastN, arrayLength, arrayMaximum, arrayMaximumN, arrayMinimum, arrayMinimumN, equalAny, notEqualAny, xor, conditional, not, logicalMaximum, logicalMinimum, exists, reverse, byteLength, charLength, like, regexContains, regexFind, regexFindAll, regexMatch, stringContains, startsWith, endsWith, toLower, toUpper, trim, ltrim, rtrim, type, isType, stringConcat, stringIndexOf, stringRepeat, stringReplaceAll, stringReplaceOne, mapGet, mapSet, mapKeys, mapValues, mapEntries, countAll, count, sum, average, and, or, minimum, maximum, first, last, arrayAgg, arrayAggDistinct, cosineDistance, dotProduct, euclideanDistance, vectorLength, unixMicrosToTimestamp, timestampToUnixMicros, unixMillisToTimestamp, timestampToUnixMillis, unixSecondsToTimestamp, timestampToUnixSeconds, timestampAdd, timestampSubtract, ascending, descending, countIf, isError, ifError, isAbsent, map, mapRemove, mapMerge, documentId, substring, countDistinct, ceil, floor, exp, pow, rand, round, collectionId, ln, log, sqrt, trunc, stringReverse, length, abs, concat, currentTimestamp, ifAbsent, join, log10, arraySum, timestampTruncate, split, Expression, AliasedExpression, Field, FunctionExpression, Ordering, BooleanExpression, AggregateFunction, ExpressionType, AliasedAggregate, Selectable, TimeGranularity, Type } from './lite-api/expressions';
export { _internalPipelineToExecutePipelineRequestProto } from './remote/internal_serializer';
