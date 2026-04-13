/**
 * Firestore Lite Pipelines
 *
 * @remarks Firestore Lite is a small online-only SDK that allows read
 * and write access to your Firestore database. All operations connect
 * directly to the backend, and `onSnapshot()` APIs are not supported.
 * @packageDocumentation
 */
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
export type { Timestamp, DocumentReference, VectorValue, GeoPoint, FieldPath, DocumentData, Query, Firestore, FirestoreDataConverter, WithFieldValue, PartialWithFieldValue, SetOptions, QueryDocumentSnapshot, Primitive, FieldValue, Bytes } from '../index';
export { PipelineSource } from '../../src/lite-api/pipeline-source';
export { OneOf } from '../../src/util/types';
export { PipelineResult, PipelineSnapshot } from '../../src/lite-api/pipeline-result';
export { Pipeline } from '../../src/lite-api/pipeline';
export { execute } from '../../src/lite-api/pipeline_impl';
export { StageOptions, CollectionStageOptions, CollectionGroupStageOptions, DatabaseStageOptions, DocumentsStageOptions, AddFieldsStageOptions, RemoveFieldsStageOptions, SelectStageOptions, WhereStageOptions, OffsetStageOptions, LimitStageOptions, DistinctStageOptions, AggregateStageOptions, FindNearestStageOptions, ReplaceWithStageOptions, SampleStageOptions, UnionStageOptions, UnnestStageOptions, SortStageOptions } from '../../src/lite-api/stage_options';
export { Expression, field, and, constant, add, subtract, multiply, average, substring, count, mapMerge, mapRemove, ifError, isAbsent, isError, or, divide, map, mod, documentId, equal, notEqual, lessThan, countIf, lessThanOrEqual, greaterThan, greaterThanOrEqual, array, arrayConcat, arrayContains, arrayContainsAny, arrayContainsAll, arrayFirst, arrayFirstN, arrayGet, arrayIndexOf, arrayIndexOfAll, arrayLast, arrayLastIndexOf, arrayLastN, arrayLength, arrayMaximum, arrayMaximumN, arrayMinimum, arrayMinimumN, equalAny, notEqualAny, xor, conditional, not, logicalMaximum, logicalMinimum, exists, reverse, byteLength, charLength, like, regexContains, regexFind, regexFindAll, regexMatch, stringContains, startsWith, endsWith, toLower, toUpper, trim, ltrim, rtrim, type, isType, stringConcat, stringIndexOf, stringRepeat, stringReplaceAll, stringReplaceOne, mapGet, mapSet, mapKeys, mapValues, mapEntries, countAll, minimum, maximum, first, last, arrayAgg, arrayAggDistinct, cosineDistance, dotProduct, euclideanDistance, vectorLength, unixMicrosToTimestamp, timestampToUnixMicros, unixMillisToTimestamp, timestampToUnixMillis, unixSecondsToTimestamp, timestampToUnixSeconds, timestampAdd, timestampSubtract, ascending, descending, abs, sum, countDistinct, ceil, floor, exp, pow, rand, round, collectionId, ln, log, sqrt, trunc, stringReverse, log10, concat, currentTimestamp, ifAbsent, join, length, arraySum, split, timestampTruncate, AliasedExpression, Field, Constant, FunctionExpression, Ordering, ExpressionType, AliasedAggregate, Selectable, BooleanExpression, AggregateFunction, TimeGranularity, Type } from '../../src/lite-api/expressions';
