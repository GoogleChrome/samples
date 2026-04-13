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
import { ParseContext } from '../api/parse_context';
import { Pipeline as ProtoPipeline } from '../protos/firestore_proto_api';
import { JsonProtoSerializer, ProtoSerializable } from '../remote/serializer';
import { Firestore } from './database';
import { AliasedAggregate, BooleanExpression, Expression, Field, Ordering, Selectable } from './expressions';
import { Stage } from './stage';
import { AddFieldsStageOptions, AggregateStageOptions, DistinctStageOptions, FindNearestStageOptions, LimitStageOptions, OffsetStageOptions, RemoveFieldsStageOptions, ReplaceWithStageOptions, SampleStageOptions, SelectStageOptions, SortStageOptions, UnionStageOptions, UnnestStageOptions, WhereStageOptions } from './stage_options';
import { UserData } from './user_data_reader';
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
export declare class Pipeline implements ProtoSerializable<ProtoPipeline>, UserData {
    /**
     * @internal
     * @private
     */
    _db: Firestore;
    /**
     * @internal
     * @private
     */
    private stages;
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
    _db: Firestore, 
    /**
     * @internal
     * @private
     */
    stages: Stage[]);
    _readUserData(context: ParseContext): void;
    /**
     * @beta
     * Adds new fields to outputs from previous stages.
     *
     * This stage allows you to compute values on-the-fly based on existing data from previous
     * stages or constants. You can use this to create new fields or overwrite existing ones (if there
     * is name overlaps).
     *
     * The added fields are defined using {@link @firebase/firestore/pipelines#Selectable}s, which can be:
     *
     * - {@link @firebase/firestore/pipelines#Field}: References an existing document field.
     * - {@link @firebase/firestore/pipelines#Expression}: Either a literal value (see {@link @firebase/firestore/pipelines#(constant:1)}) or a computed value
     *   with an assigned alias using {@link @firebase/firestore/pipelines#Expression.(as:1)}.
     *
     * Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection("books")
     *   .addFields(
     *     field("rating").as("bookRating"), // Rename 'rating' to 'bookRating'
     *     add(field("quantity"), 5).as("totalCost")  // Calculate 'totalCost'
     *   );
     * ```
     *
     * @param field - The first field to add to the documents, specified as a {@link @firebase/firestore/pipelines#Selectable}.
     * @param additionalFields - Optional additional fields to add to the documents, specified as {@link @firebase/firestore/pipelines#Selectable}s.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    addFields(field: Selectable, ...additionalFields: Selectable[]): Pipeline;
    /**
     * @beta
     * Adds new fields to outputs from previous stages.
     *
     * This stage allows you to compute values on-the-fly based on existing data from previous
     * stages or constants. You can use this to create new fields or overwrite existing ones (if there
     * is name overlaps).
     *
     * The added fields are defined using {@link @firebase/firestore/pipelines#Selectable}s, which can be:
     *
     * - {@link @firebase/firestore/pipelines#Field}: References an existing document field.
     * - {@link @firebase/firestore/pipelines#Expression}: Either a literal value (see {@link @firebase/firestore/pipelines#(constant:1)}) or a computed value
     *   with an assigned alias using {@link @firebase/firestore/pipelines#Expression.(as:1)}.
     *
     * Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection("books")
     *   .addFields(
     *     field("rating").as("bookRating"), // Rename 'rating' to 'bookRating'
     *     add(field("quantity"), 5).as("totalCost")  // Calculate 'totalCost'
     *   );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    addFields(options: AddFieldsStageOptions): Pipeline;
    /**
     * @beta
     * Remove fields from outputs of previous stages.
     *
     * Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection('books')
     *   // removes field 'rating' and 'cost' from the previous stage outputs.
     *   .removeFields(
     *     field('rating'),
     *     'cost'
     *   );
     * ```
     *
     * @param fieldValue - The first field to remove.
     * @param additionalFields - Optional additional fields to remove.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    removeFields(fieldValue: Field | string, ...additionalFields: Array<Field | string>): Pipeline;
    /**
     * @beta
     * Remove fields from outputs of previous stages.
     *
     * Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection('books')
     *   // removes field 'rating' and 'cost' from the previous stage outputs.
     *   .removeFields(
     *     field('rating'),
     *     'cost'
     *   );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    removeFields(options: RemoveFieldsStageOptions): Pipeline;
    /**
     * @beta
     * Selects or creates a set of fields from the outputs of previous stages.
     *
     * <p>The selected fields are defined using {@link @firebase/firestore/pipelines#Selectable} expressions, which can be:
     *
     * <ul>
     *   <li>`string` : Name of an existing field</li>
     *   <li>{@link @firebase/firestore/pipelines#Field}: References an existing field.</li>
     *   <li>{@link @firebase/firestore/pipelines#AliasedExpression}: Represents the result of a function with an assigned alias name using
     *       {@link @firebase/firestore/pipelines#Expression.(as:1)}</li>
     * </ul>
     *
     * <p>If no selections are provided, the output of this stage is empty. Use {@link
     * @firebase/firestore/pipelines#Pipeline.(addFields:1)} instead if only additions are
     * desired.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * db.pipeline().collection("books")
     *   .select(
     *     "firstName",
     *     field("lastName"),
     *     field("address").toUpper().as("upperAddress"),
     *   );
     * ```
     *
     * @param selection - The first field to include in the output documents, specified as {@link
     *     @firebase/firestore/pipelines#Selectable} expression or string value representing the field name.
     * @param additionalSelections - Optional additional fields to include in the output documents, specified as {@link
     *     @firebase/firestore/pipelines#Selectable} expressions or `string` values representing field names.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    select(selection: Selectable | string, ...additionalSelections: Array<Selectable | string>): Pipeline;
    /**
     * @beta
     * Selects or creates a set of fields from the outputs of previous stages.
     *
     * <p>The selected fields are defined using {@link @firebase/firestore/pipelines#Selectable} expressions, which can be:
     *
     * <ul>
     *   <li>`string`: Name of an existing field</li>
     *   <li>{@link @firebase/firestore/pipelines#Field}: References an existing field.</li>
     *   <li>{@link @firebase/firestore/pipelines#AliasedExpression}: Represents the result of a function with an assigned alias name using
     *       {@link @firebase/firestore/pipelines#Expression.(as:1)}</li>
     * </ul>
     *
     * <p>If no selections are provided, the output of this stage is empty. Use {@link
     * @firebase/firestore/pipelines#Pipeline.(addFields:1)} instead if only additions are
     * desired.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * db.pipeline().collection("books")
     *   .select(
     *     "firstName",
     *     field("lastName"),
     *     field("address").toUpper().as("upperAddress"),
     *   );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    select(options: SelectStageOptions): Pipeline;
    /**
     * @beta
     * Filters the documents from previous stages to only include those matching the specified {@link
     * @firebase/firestore/pipelines#BooleanExpression}.
     *
     * <p>This stage allows you to apply conditions to the data, similar to a "WHERE" clause in SQL.
     * You can filter documents based on their field values, using implementations of {@link
     * @firebase/firestore/pipelines#BooleanExpression}, typically including but not limited to:
     *
     * <ul>
     *   <li>field comparators: {@link @firebase/firestore/pipelines#Expression.(equal:1)}, {@link @firebase/firestore/pipelines#Expression.(lessThan:1)}, {@link
     *       @firebase/firestore/pipelines#Expression.(greaterThan:1)}, etc.</li>
     *   <li>logical operators: {@link @firebase/firestore/pipelines#Expression.(and:1)}, {@link @firebase/firestore/pipelines#Expression.(or:1)}, {@link @firebase/firestore/pipelines#Expression.(not:1)}, etc.</li>
     *   <li>advanced functions: {@link @firebase/firestore/pipelines#Expression.(regexMatch:1)}, {@link
     *       @firebase/firestore/pipelines#Expression.(arrayContains:1)}, etc.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection("books")
     *   .where(
     *     and(
     *         greaterThan(field("rating"), 4.0),   // Filter for ratings greater than 4.0
     *         field("genre").equal("Science Fiction") // Equivalent to equal("genre", "Science Fiction")
     *     )
     *   );
     * ```
     *
     * @param condition - The {@link @firebase/firestore/pipelines#BooleanExpression} to apply.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    where(condition: BooleanExpression): Pipeline;
    /**
     * @beta
     * Filters the documents from previous stages to only include those matching the specified {@link
     * @firebase/firestore/pipelines#BooleanExpression}.
     *
     * <p>This stage allows you to apply conditions to the data, similar to a "WHERE" clause in SQL.
     * You can filter documents based on their field values, using implementations of {@link
     * @firebase/firestore/pipelines#BooleanExpression}, typically including but not limited to:
     *
     * <ul>
     *   <li>field comparators: {@link @firebase/firestore/pipelines#Expression.(eq:1)}, {@link @firebase/firestore/pipelines#Expression.(lt:1)} (less than), {@link
     *       @firebase/firestore/pipelines#Expression.(greaterThan:1)}, etc.</li>
     *   <li>logical operators: {@link @firebase/firestore/pipelines#Expression.(and:1)}, {@link @firebase/firestore/pipelines#Expression.(or:1)}, {@link @firebase/firestore/pipelines#Expression.(not:1)}, etc.</li>
     *   <li>advanced functions: {@link @firebase/firestore/pipelines#Expression.(regexMatch:1)}, {@link
     *       @firebase/firestore/pipelines#Expression.(arrayContains:1)}, etc.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * firestore.pipeline().collection("books")
     *   .where(
     *     and(
     *         greaterThan(field("rating"), 4.0),   // Filter for ratings greater than 4.0
     *         field("genre").equal("Science Fiction") // Equivalent to equal("genre", "Science Fiction")
     *     )
     *   );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    where(options: WhereStageOptions): Pipeline;
    /**
     * @beta
     * Skips the first `offset` number of documents from the results of previous stages.
     *
     * <p>This stage is useful for implementing pagination in your pipelines, allowing you to retrieve
     * results in chunks. It is typically used in conjunction with {@link @firebase/firestore/pipelines#Pipeline.limit} to control the
     * size of each page.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Retrieve the second page of 20 results
     * firestore.pipeline().collection('books')
     *     .sort(field('published').descending())
     *     .offset(20)  // Skip the first 20 results
     *     .limit(20);   // Take the next 20 results
     * ```
     *
     * @param offset - The number of documents to skip.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    offset(offset: number): Pipeline;
    /**
     * @beta
     * Skips the first `offset` number of documents from the results of previous stages.
     *
     * <p>This stage is useful for implementing pagination in your pipelines, allowing you to retrieve
     * results in chunks. It is typically used in conjunction with {@link @firebase/firestore/pipelines#Pipeline.limit} to control the
     * size of each page.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Retrieve the second page of 20 results
     * firestore.pipeline().collection('books')
     *     .sort(field('published').descending())
     *     .offset(20)  // Skip the first 20 results
     *     .limit(20);   // Take the next 20 results
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    offset(options: OffsetStageOptions): Pipeline;
    /**
     * @beta
     * Limits the maximum number of documents returned by previous stages to `limit`.
     *
     * <p>This stage is particularly useful when you want to retrieve a controlled subset of data from
     * a potentially large result set. It's often used for:
     *
     * <ul>
     *   <li>**Pagination:** In combination with {@link @firebase/firestore/pipelines#Pipeline.offset} to retrieve specific pages of
     *       results.</li>
     *   <li>**Limiting Data Retrieval:** To prevent excessive data transfer and improve performance,
     *       especially when dealing with large collections.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Limit the results to the top 10 highest-rated books
     * firestore.pipeline().collection('books')
     *     .sort(field('rating').descending())
     *     .limit(10);
     * ```
     *
     * @param limit - The maximum number of documents to return.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    limit(limit: number): Pipeline;
    /**
     * @beta
     * Limits the maximum number of documents returned by previous stages to `limit`.
     *
     * <p>This stage is particularly useful when you want to retrieve a controlled subset of data from
     * a potentially large result set. It's often used for:
     *
     * <ul>
     *   <li>**Pagination:** In combination with {@link @firebase/firestore/pipelines#Pipeline.offset} to retrieve specific pages of
     *       results.</li>
     *   <li>**Limiting Data Retrieval:** To prevent excessive data transfer and improve performance,
     *       especially when dealing with large collections.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Limit the results to the top 10 highest-rated books
     * firestore.pipeline().collection('books')
     *     .sort(field('rating').descending())
     *     .limit(10);
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    limit(options: LimitStageOptions): Pipeline;
    /**
     * @beta
     * Returns a set of distinct values from the inputs to this stage.
     *
     * This stage runs through the results from previous stages to include only results with
     * unique combinations of {@link @firebase/firestore/pipelines#Expression} values ({@link @firebase/firestore/pipelines#Field}, {@link @firebase/firestore/pipelines#AliasedExpression}, etc).
     *
     * The parameters to this stage are defined using {@link @firebase/firestore/pipelines#Selectable} expressions or strings:
     *
     * - `string`: Name of an existing field
     * - {@link @firebase/firestore/pipelines#Field}: References an existing document field.
     * - {@link @firebase/firestore/pipelines#AliasedExpression}: Represents the result of a function with an assigned alias name
     *   using {@link @firebase/firestore/pipelines#Expression.(as:1)}.
     *
     * Example:
     *
     * @example
     * ```typescript
     * // Get a list of unique author names in uppercase and genre combinations.
     * firestore.pipeline().collection("books")
     *     .distinct(toUpper(field("author")).as("authorName"), field("genre"), "publishedAt")
     *     .select("authorName");
     * ```
     *
     * @param group - The {@link @firebase/firestore/pipelines#Selectable} expression or field name to consider when determining
     *     distinct value combinations.
     * @param additionalGroups - Optional additional {@link @firebase/firestore/pipelines#Selectable} expressions to consider when determining distinct
     *     value combinations or strings representing field names.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    distinct(group: string | Selectable, ...additionalGroups: Array<string | Selectable>): Pipeline;
    /**
     * @beta
     * Returns a set of distinct values from the inputs to this stage.
     *
     * This stage runs through the results from previous stages to include only results with
     * unique combinations of {@link @firebase/firestore/pipelines#Expression} values ({@link @firebase/firestore/pipelines#Field}, {@link @firebase/firestore/pipelines#AliasedExpression}, etc).
     *
     * The parameters to this stage are defined using {@link @firebase/firestore/pipelines#Selectable} expressions or strings:
     *
     * - `string`: Name of an existing field
     * - {@link @firebase/firestore/pipelines#Field}: References an existing document field.
     * - {@link @firebase/firestore/pipelines#AliasedExpression}: Represents the result of a function with an assigned alias name
     *   using {@link @firebase/firestore/pipelines#Expression.(as:1)}.
     *
     * Example:
     *
     * @example
     * ```typescript
     * // Get a list of unique author names in uppercase and genre combinations.
     * firestore.pipeline().collection("books")
     *     .distinct(toUpper(field("author")).as("authorName"), field("genre"), "publishedAt")
     *     .select("authorName");
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    distinct(options: DistinctStageOptions): Pipeline;
    /**
     * @beta
     * Performs aggregation operations on the documents from previous stages.
     *
     * <p>This stage allows you to calculate aggregate values over a set of documents. You define the
     * aggregations to perform using {@link @firebase/firestore/pipelines#AliasedAggregate} expressions which are typically results of
     * calling {@link @firebase/firestore/pipelines#Expression.(as:1)} on {@link @firebase/firestore/pipelines#AggregateFunction} instances.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Calculate the average rating and the total number of books
     * firestore.pipeline().collection("books")
     *     .aggregate(
     *         field("rating").average().as("averageRating"),
     *         countAll().as("totalBooks")
     *     );
     * ```
     *
     * @param accumulator - The first {@link @firebase/firestore/pipelines#AliasedAggregate}, wrapping an {@link @firebase/firestore/pipelines#AggregateFunction}
     *     and providing a name for the accumulated results.
     * @param additionalAccumulators - Optional additional {@link @firebase/firestore/pipelines#AliasedAggregate}, each wrapping an {@link @firebase/firestore/pipelines#AggregateFunction}
     *     and providing a name for the accumulated results.
     * @returns A new Pipeline object with this stage appended to the stage list.
     */
    aggregate(accumulator: AliasedAggregate, ...additionalAccumulators: AliasedAggregate[]): Pipeline;
    /**
     * @beta
     * Performs optionally grouped aggregation operations on the documents from previous stages.
     *
     * <p>This stage allows you to calculate aggregate values over a set of documents, optionally
     * grouped by one or more fields or functions. You can specify:
     *
     * <ul>
     *   <li>**Grouping Fields or Functions:** One or more fields or functions to group the documents
     *       by. For each distinct combination of values in these fields, a separate group is created.
     *       If no grouping fields are provided, a single group containing all documents is used. Not
     *       specifying groups is the same as putting the entire inputs into one group.</li>
     *   <li>**Accumulators:** One or more accumulation operations to perform within each group. These
     *       are defined using {@link @firebase/firestore/pipelines#AliasedAggregate} expressions, which are typically created by
     *       calling {@link @firebase/firestore/pipelines#Expression.(as:1)} on {@link @firebase/firestore/pipelines#AggregateFunction} instances. Each aggregation
     *       calculates a value (e.g., sum, average, count) based on the documents within its group.</li>
     * </ul>
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Calculate the average rating for each genre.
     * firestore.pipeline().collection("books")
     *   .aggregate({
     *       accumulators: [average(field("rating")).as("avg_rating")],
     *       groups: ["genre"]
     *       });
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage
     * list.
     */
    aggregate(options: AggregateStageOptions): Pipeline;
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
    findNearest(options: FindNearestStageOptions): Pipeline;
    /**
     * @beta
     * Sorts the documents from previous stages based on one or more {@link @firebase/firestore/pipelines#Ordering} criteria.
     *
     * <p>This stage allows you to order the results of your pipeline. You can specify multiple {@link
     * @firebase/firestore/pipelines#Ordering} instances to sort by multiple fields in ascending or descending order. If documents
     * have the same value for a field used for sorting, the next specified ordering will be used. If
     * all orderings result in equal comparison, the documents are considered equal and the order is
     * unspecified.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Sort books by rating in descending order, and then by title in ascending order for books
     * // with the same rating
     * firestore.pipeline().collection("books")
     *     .sort(
     *         field("rating").descending(),
     *         field("title").ascending()
     *     );
     * ```
     *
     * @param ordering - The first {@link @firebase/firestore/pipelines#Ordering} instance specifying the sorting criteria.
     * @param additionalOrderings - Optional additional {@link @firebase/firestore/pipelines#Ordering} instances specifying the additional sorting criteria.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    sort(ordering: Ordering, ...additionalOrderings: Ordering[]): Pipeline;
    /**
     * @beta
     * Sorts the documents from previous stages based on one or more {@link @firebase/firestore/pipelines#Ordering} criteria.
     *
     * <p>This stage allows you to order the results of your pipeline. You can specify multiple {@link
     * @firebase/firestore/pipelines#Ordering} instances to sort by multiple fields in ascending or descending order. If documents
     * have the same value for a field used for sorting, the next specified ordering will be used. If
     * all orderings result in equal comparison, the documents are considered equal and the order is
     * unspecified.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Sort books by rating in descending order, and then by title in ascending order for books
     * // with the same rating
     * firestore.pipeline().collection("books")
     *     .sort(
     *         field("rating").descending(),
     *         field("title").ascending()
     *     );
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    sort(options: SortStageOptions): Pipeline;
    /**
     * @beta
     * Fully overwrites all fields in a document with those coming from a nested map.
     *
     * <p>This stage allows you to emit a map value as a document. Each key of the map becomes a field
     * on the document that contains the corresponding value.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Input.
     * // {
     * //  'name': 'John Doe Jr.',
     * //  'parents': {
     * //    'father': 'John Doe Sr.',
     * //    'mother': 'Jane Doe'
     * //   }
     * // }
     *
     * // Emit parents as document.
     * firestore.pipeline().collection('people').replaceWith('parents');
     *
     * // Output
     * // {
     * //  'father': 'John Doe Sr.',
     * //  'mother': 'Jane Doe'
     * // }
     * ```
     *
     * @param fieldName - The {@link @firebase/firestore/pipelines#Field} field containing the nested map.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    replaceWith(fieldName: string): Pipeline;
    /**
     * @beta
     * Fully overwrites all fields in a document with those coming from a map.
     *
     * <p>This stage allows you to emit a map value as a document. Each key of the map becomes a field
     * on the document that contains the corresponding value.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Input.
     * // {
     * //  'name': 'John Doe Jr.',
     * //  'parents': {
     * //    'father': 'John Doe Sr.',
     * //    'mother': 'Jane Doe'
     * //   }
     * // }
     *
     * // Emit parents as document.
     * firestore.pipeline().collection('people').replaceWith(map({
     *   foo: 'bar',
     *   info: {
     *     name: field('name')
     *   }
     * }));
     *
     * // Output
     * // {
     * //  'father': 'John Doe Sr.',
     * //  'mother': 'Jane Doe'
     * // }
     * ```
     *
     * @param expr - An {@link @firebase/firestore/pipelines#Expression} that when returned evaluates to a map.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    replaceWith(expr: Expression): Pipeline;
    /**
     * @beta
     * Fully overwrites all fields in a document with those coming from a map.
     *
     * <p>This stage allows you to emit a map value as a document. Each key of the map becomes a field
     * on the document that contains the corresponding value.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Input.
     * // {
     * //  'name': 'John Doe Jr.',
     * //  'parents': {
     * //    'father': 'John Doe Sr.',
     * //    'mother': 'Jane Doe'
     * //   }
     * // }
     *
     * // Emit parents as document.
     * firestore.pipeline().collection('people').replaceWith(map({
     *   foo: 'bar',
     *   info: {
     *     name: field('name')
     *   }
     * }));
     *
     * // Output
     * // {
     * //  'father': 'John Doe Sr.',
     * //  'mother': 'Jane Doe'
     * // }
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    replaceWith(options: ReplaceWithStageOptions): Pipeline;
    /**
     * @beta
     * Performs a pseudo-random sampling of the documents from the previous stage.
     *
     * <p>This stage will filter documents pseudo-randomly. The parameter specifies how number of
     * documents to be returned.
     *
     * <p>Examples:
     *
     * @example
     * ```typescript
     * // Sample 25 books, if available.
     * firestore.pipeline().collection('books')
     *     .sample(25);
     * ```
     *
     * @param documents - The number of documents to sample.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    sample(documents: number): Pipeline;
    /**
     * @beta
     * Performs a pseudo-random sampling of the documents from the previous stage.
     *
     * <p>This stage will filter documents pseudo-randomly. The 'options' parameter specifies how
     * sampling will be performed. See {@link @firebase/firestore/pipelines#SampleStageOptions} for more information.
     *
     * @example
     * ```typescript
     * // Sample 10 books, if available.
     * firestore.pipeline().collection("books")
     *     .sample({ documents: 10 });
     *
     * // Sample 50% of books.
     * firestore.pipeline().collection("books")
     *     .sample({ percentage: 0.5 });
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    sample(options: SampleStageOptions): Pipeline;
    /**
     * @beta
     * Performs union of all documents from two pipelines, including duplicates.
     *
     * <p>This stage will pass through documents from previous stage, and also pass through documents
     * from previous stage of the `other` {@link @firebase/firestore/pipelines#Pipeline} given in parameter. The order of documents
     * emitted from this stage is undefined.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Emit documents from books collection and magazines collection.
     * firestore.pipeline().collection('books')
     *     .union(firestore.pipeline().collection('magazines'));
     * ```
     *
     * @param other - The other {@link @firebase/firestore/pipelines#Pipeline} that is part of union.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    union(other: Pipeline): Pipeline;
    /**
     * @beta
     * Performs union of all documents from two pipelines, including duplicates.
     *
     * <p>This stage will pass through documents from previous stage, and also pass through documents
     * from previous stage of the `other` {@link @firebase/firestore/pipelines#Pipeline} given in parameter. The order of documents
     * emitted from this stage is undefined.
     *
     * <p>Example:
     *
     * @example
     * ```typescript
     * // Emit documents from books collection and magazines collection.
     * firestore.pipeline().collection('books')
     *     .union(firestore.pipeline().collection('magazines'));
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    union(options: UnionStageOptions): Pipeline;
    /**
     * @beta
     * Produces a document for each element in an input array.
     *
     * For each previous stage document, this stage will emit zero or more augmented documents. The
     * input array specified by the `selectable` parameter, will emit an augmented document for each input array element. The input array element will
     * augment the previous stage document by setting the `alias` field  with the array element value.
     *
     * When `selectable` evaluates to a non-array value (ex: number, null, absent), then the stage becomes a no-op for
     * the current input document, returning it as is with the `alias` field absent.
     *
     * No documents are emitted when `selectable` evaluates to an empty array.
     *
     * Example:
     *
     * @example
     * ```typescript
     * // Input:
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tags": [ "comedy", "space", "adventure" ], ... }
     *
     * // Emit a book document for each tag of the book.
     * firestore.pipeline().collection("books")
     *     .unnest(field("tags").as('tag'), 'tagIndex');
     *
     * // Output:
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "comedy", "tagIndex": 0, ... }
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "space", "tagIndex": 1, ... }
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "adventure", "tagIndex": 2, ... }
     * ```
     *
     * @param selectable - A selectable expression defining the field to unnest and the alias to use for each un-nested element in the output documents.
     * @param indexField - An optional string value specifying the field path to write the offset (starting at zero) into the array the un-nested element is from
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    unnest(selectable: Selectable, indexField?: string): Pipeline;
    /**
     * @beta
     * Produces a document for each element in an input array.
     *
     * For each previous stage document, this stage will emit zero or more augmented documents. The
     * input array specified by the `selectable` parameter, will emit an augmented document for each input array element. The input array element will
     * augment the previous stage document by setting the `alias` field  with the array element value.
     *
     * When `selectable` evaluates to a non-array value (ex: number, null, absent), then the stage becomes a no-op for
     * the current input document, returning it as is with the `alias` field absent.
     *
     * No documents are emitted when `selectable` evaluates to an empty array.
     *
     * Example:
     *
     * @example
     * ```typescript
     * // Input:
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tags": [ "comedy", "space", "adventure" ], ... }
     *
     * // Emit a book document for each tag of the book.
     * firestore.pipeline().collection("books")
     *     .unnest(field("tags").as('tag'), 'tagIndex');
     *
     * // Output:
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "comedy", "tagIndex": 0, ... }
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "space", "tagIndex": 1, ... }
     * // { "title": "The Hitchhiker's Guide to the Galaxy", "tag": "adventure", "tagIndex": 2, ... }
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    unnest(options: UnnestStageOptions): Pipeline;
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
    rawStage(name: string, params: unknown[], options?: {
        [key: string]: Expression | unknown;
    }): Pipeline;
    /**
     * @internal
     * @private
     */
    _toProto(jsonProtoSerializer: JsonProtoSerializer): ProtoPipeline;
    private _addStage;
    /**
     * @internal
     * @private
     * @param db
     * @param userDataReader
     * @param userDataWriter
     * @param stages
     * @protected
     */
    protected newPipeline(db: Firestore, stages: Stage[]): Pipeline;
}
export declare function isPipeline(val: unknown): val is Pipeline;
