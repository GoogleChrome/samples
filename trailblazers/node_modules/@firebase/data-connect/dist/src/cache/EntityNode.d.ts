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
import { EntityDataObject, EntityDataObjectJson, FDCScalarValue } from './EntityDataObject';
import { ImpactedQueryRefsAccumulator } from './ImpactedQueryRefsAccumulator';
export declare const GLOBAL_ID_KEY = "_id";
export declare const OBJECT_LISTS_KEY = "_objectLists";
export declare const REFERENCES_KEY = "_references";
export declare const SCALARS_KEY = "_scalars";
export declare const ENTITY_DATA_KEYS_KEY = "_entity_data_keys";
export declare class EntityNode {
    entityData?: EntityDataObject;
    scalars: Record<string, FDCScalarValue>;
    references: {
        [key: string]: EntityNode;
    };
    objectLists: {
        [key: string]: EntityNode[];
    };
    globalId?: string;
    entityDataKeys: Set<string>;
    loadData(queryId: string, values: FDCScalarValue, entityIds: Record<string, unknown> | undefined, acc: ImpactedQueryRefsAccumulator, cacheProvider: InternalCacheProvider): Promise<void>;
    toJSON(mode: EncodingMode): Record<string, unknown>;
    static fromJson(obj: DehydratedStubDataObject): EntityNode;
}
export interface DehydratedStubDataObject {
    backingData?: EntityDataObjectJson;
    globalID?: string;
    scalars: {
        [key: string]: FDCScalarValue;
    };
    references: {
        [key: string]: DehydratedStubDataObject;
    };
    objectLists: {
        [key: string]: DehydratedStubDataObject[];
    };
}
export declare enum EncodingMode {
    hydrated = 0,
    dehydrated = 1
}
