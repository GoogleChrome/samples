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
export type FDCScalarValue = string | number | boolean | undefined | null | Record<string, unknown> | FDCScalarValue[];
export interface EntityDataObjectJson {
    map: {
        [key: string]: FDCScalarValue;
    };
    referencedFrom: string[];
    globalID: string;
}
export declare class EntityDataObject {
    readonly globalID: string;
    getServerValue(key: string): unknown;
    private serverValues;
    private referencedFrom;
    constructor(globalID: string);
    getServerValues(): {
        [key: string]: FDCScalarValue;
    };
    toJSON(): EntityDataObjectJson;
    static fromJSON(json: EntityDataObjectJson): EntityDataObject;
    updateServerValue(key: string, value: FDCScalarValue, requestedFrom: string): string[];
}
