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
import { EntityNode, DehydratedStubDataObject } from './EntityNode';
export declare class ResultTree {
    private rootStub;
    private maxAge;
    readonly cachedAt: Date;
    private _lastAccessed;
    /**
     * Create a {@link ResultTree} from a dehydrated JSON object.
     * @param value The dehydrated JSON object.
     * @returns The {@link ResultTree}.
     */
    static fromJson(value: DehydratedResultTreeJson): ResultTree;
    constructor(rootStub: EntityNode, maxAge: number, cachedAt: Date, _lastAccessed: Date);
    isStale(): boolean;
    updateMaxAge(maxAgeInSeconds: number): void;
    updateAccessed(): void;
    get lastAccessed(): Date;
    getRootStub(): EntityNode;
}
interface DehydratedResultTreeJson {
    rootStub: DehydratedStubDataObject;
    maxAge: number;
    cachedAt: Date;
    lastAccessed: Date;
}
export {};
