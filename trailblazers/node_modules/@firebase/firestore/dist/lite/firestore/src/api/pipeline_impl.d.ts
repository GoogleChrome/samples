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
import { Pipeline } from '../api/pipeline';
import { Pipeline as LitePipeline } from '../lite-api/pipeline';
import { PipelineSnapshot } from '../lite-api/pipeline-result';
import { PipelineSource } from '../lite-api/pipeline-source';
import { PipelineExecuteOptions } from '../lite-api/pipeline_options';
declare module './database' {
    /**
     * @beta
     * Creates and returns a new PipelineSource, which allows specifying the source stage of a {@link @firebase/firestore/pipelines#Pipeline}.
     *
     * @example
     * ```
     * let myPipeline: Pipeline = firestore.pipeline().collection('books');
     * ```
     */
    interface Firestore {
        pipeline(): PipelineSource<Pipeline>;
    }
}
/**
 * @beta
 * Executes a pipeline and returns a Promise to represent the asynchronous operation.
 *
 * The returned Promise can be used to track the progress of the pipeline execution
 * and retrieve the results (or handle any errors) asynchronously.
 *
 * The pipeline results are returned as a {@link @firebase/firestore/pipelines#PipelineSnapshot} that contains
 * a list of {@link @firebase/firestore/pipelines#PipelineResult} objects. Each {@link @firebase/firestore/pipelines#PipelineResult} typically
 * represents a single key/value map that has passed through all the
 * stages of the pipeline, however this might differ depending on the stages involved in the
 * pipeline. For example:
 *
 * <ul>
 *   <li>If there are no stages or only transformation stages, each {@link @firebase/firestore/pipelines#PipelineResult}
 *       represents a single document.</li>
 *   <li>If there is an aggregation, only a single {@link @firebase/firestore/pipelines#PipelineResult} is returned,
 *       representing the aggregated results over the entire dataset .</li>
 *   <li>If there is an aggregation stage with grouping, each {@link @firebase/firestore/pipelines#PipelineResult} represents a
 *       distinct group and its associated aggregated values.</li>
 * </ul>
 *
 * @example
 * ```typescript
 * const snapshot: PipelineSnapshot = await execute(firestore.pipeline().collection("books")
 *     .where(greaterThan(field("rating"), 4.5))
 *     .select("title", "author", "rating"));
 *
 * const results: PipelineResult[] = snapshot.results;
 * ```
 *
 * @param pipeline - The pipeline to execute.
 * @returns A Promise representing the asynchronous pipeline execution.
 */
export declare function execute(pipeline: LitePipeline): Promise<PipelineSnapshot>;
/**
 * @beta
 * Executes a pipeline and returns a Promise to represent the asynchronous operation.
 *
 * The returned Promise can be used to track the progress of the pipeline execution
 * and retrieve the results (or handle any errors) asynchronously.
 *
 * The pipeline results are returned as a {@link @firebase/firestore/pipelines#PipelineSnapshot} that contains
 * a list of {@link @firebase/firestore/pipelines#PipelineResult} objects. Each {@link @firebase/firestore/pipelines#PipelineResult} typically
 * represents a single key/value map that has passed through all the
 * stages of the pipeline, however this might differ depending on the stages involved in the
 * pipeline. For example:
 *
 * <ul>
 *   <li>If there are no stages or only transformation stages, each {@link @firebase/firestore/pipelines#PipelineResult}
 *       represents a single document.</li>
 *   <li>If there is an aggregation, only a single {@link @firebase/firestore/pipelines#PipelineResult} is returned,
 *       representing the aggregated results over the entire dataset .</li>
 *   <li>If there is an aggregation stage with grouping, each {@link @firebase/firestore/pipelines#PipelineResult} represents a
 *       distinct group and its associated aggregated values.</li>
 * </ul>
 *
 * @example
 * ```typescript
 * const snapshot: PipelineSnapshot = await execute(firestore.pipeline().collection("books")
 *     .where(greaterThan(field("rating"), 4.5))
 *     .select("title", "author", "rating"));
 *
 * const results: PipelineResult[] = snapshot.results;
 * ```
 *
 * @param options - Specifies the pipeline to execute and other options for execute.
 * @returns A Promise representing the asynchronous pipeline execution.
 */
export declare function execute(options: PipelineExecuteOptions): Promise<PipelineSnapshot>;
