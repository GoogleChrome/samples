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
import { InternalCacheProvider } from './CacheProvider';
import { EntityNode } from './EntityNode';
interface DehydratedResults {
    entityNode: EntityNode;
    impacted: string[];
}
export declare class ResultTreeProcessor {
    /**
     * Hydrate the EntityNode into a JSON object so that it can be returned to the user.
     * @param rootStubObject
     * @returns {string}
     */
    hydrateResults(rootStubObject: EntityNode): Record<string, unknown>;
    /**
     * Dehydrate results so that they can be stored in the cache.
     * @param json
     * @param entityIds
     * @param cacheProvider
     * @param queryId
     * @returns {Promise<DehydratedResults>}
     */
    dehydrateResults(json: Record<string, unknown>, entityIds: Record<string, unknown>, cacheProvider: InternalCacheProvider, queryId: string): Promise<DehydratedResults>;
}
export {};
