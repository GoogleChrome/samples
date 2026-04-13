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
import { SnapshotVersion } from '../core/snapshot_version';
import { DocumentKey } from './document_key';
import { ObjectValue } from './object_value';
export interface PipelineStreamElement {
    transaction?: string;
    key?: DocumentKey;
    executionTime?: SnapshotVersion;
    createTime?: SnapshotVersion;
    updateTime?: SnapshotVersion;
    fields?: ObjectValue;
}
