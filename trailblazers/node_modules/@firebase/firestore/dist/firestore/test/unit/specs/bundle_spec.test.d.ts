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
import { Query } from '../../../src/core/query';
import { DocumentKey } from '../../../src/model/document_key';
import { JsonObject } from '../../../src/model/object_value';
import { LimitType } from '../../../src/protos/firestore_bundle_proto';
import { TestSnapshotVersion } from '../../util/helpers';
interface TestBundleDocument {
    key: DocumentKey;
    readTime: TestSnapshotVersion;
    createTime?: TestSnapshotVersion;
    updateTime?: TestSnapshotVersion;
    content?: JsonObject<unknown>;
}
interface TestBundledQuery {
    name: string;
    readTime: TestSnapshotVersion;
    query: Query;
    limitType?: LimitType;
}
export declare function bundleWithDocumentAndQuery(testDoc: TestBundleDocument, testQuery?: TestBundledQuery): string;
export {};
