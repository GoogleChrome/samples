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
import { Firestore } from '../api/database';
import { Query } from '../core/query';
import { DocumentData } from '../lite-api/reference';
import { Timestamp } from '../lite-api/timestamp';
import { DocumentKey } from '../model/document_key';
/**
 * Builds a Firestore data bundle with results from the given document and query snapshots.
 */
export declare class BundleBuilder {
    private firestore;
    readonly bundleId: string;
    private documents;
    private namedQueries;
    private latestReadTime;
    private databaseId;
    private readonly serializer;
    private readonly userDataReader;
    constructor(firestore: Firestore, bundleId: string);
    /**
     * Adds data from a DocumentSnapshot to the bundle.
     * @internal
     * @param docBundleData - A DocumentSnapshotBundleData containing information from the
     * DocumentSnapshot. Note we cannot accept a DocumentSnapshot directly due to a circular
     * dependency error.
     * @param queryName - The name of the QuerySnapshot if this document is part of a Query.
     */
    addBundleDocument(docBundleData: DocumentSnapshotBundleData, queryName?: string): void;
    /**
     * Adds data from a QuerySnapshot to the bundle.
     * @internal
     * @param docBundleData - A QuerySnapshotBundleData containing information from the
     * QuerySnapshot. Note we cannot accept a QuerySnapshot directly due to a circular
     * dependency error.
     */
    addBundleQuery(queryBundleData: QuerySnapshotBundleData): void;
    /**
     * Convert data from a DocumentSnapshot into the serialized form within a bundle.
     * @private
     * @internal
     * @param docBundleData - a DocumentSnapshotBundleData containing the data required to
     * serialize a document.
     */
    private toBundleDocument;
    /**
     * Converts a IBundleElement to a Buffer whose content is the length prefixed JSON representation
     * of the element.
     * @private
     * @internal
     * @param bundleElement - A ProtoBundleElement that is expected to be Proto3 JSON compatible.
     */
    private lengthPrefixedString;
    /**
     * Construct a serialized string containing document and query information that has previously
     * been added to the BundleBuilder through the addBundleDocument and addBundleQuery methods.
     * @internal
     */
    build(): string;
}
/**
 * Interface for an object that contains data required to bundle a DocumentSnapshot.
 * @internal
 */
export interface DocumentSnapshotBundleData {
    documentData: DocumentData;
    documentKey: DocumentKey;
    documentPath: string;
    documentExists: boolean;
    createdTime: Timestamp;
    readTime?: Timestamp;
    versionTime: Timestamp;
}
/**
 * Interface for an object that contains data required to bundle a QuerySnapshot.
 * @internal
 */
export interface QuerySnapshotBundleData {
    name: string;
    query: Query;
    parent: string;
    docBundleDataArray: DocumentSnapshotBundleData[];
}
