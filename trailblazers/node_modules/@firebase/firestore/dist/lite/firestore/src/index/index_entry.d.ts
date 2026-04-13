/**
 * @license
 * Copyright 2022 Google LLC
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
import { DbIndexEntry } from '../local/indexeddb_schema';
import { DbIndexEntryKey, KeySafeBytes } from '../local/indexeddb_sentinels';
import { DocumentKey } from '../model/document_key';
/** Represents an index entry saved by the SDK in persisted storage. */
export declare class IndexEntry {
    readonly _indexId: number;
    readonly _documentKey: DocumentKey;
    readonly _arrayValue: Uint8Array;
    readonly _directionalValue: Uint8Array;
    constructor(_indexId: number, _documentKey: DocumentKey, _arrayValue: Uint8Array, _directionalValue: Uint8Array);
    /**
     * Returns an IndexEntry entry that sorts immediately after the current
     * directional value.
     */
    successor(): IndexEntry;
    dbIndexEntry(uid: string, orderedDocumentKey: Uint8Array, documentKey: DocumentKey): DbIndexEntry;
    dbIndexEntryKey(uid: string, orderedDocumentKey: Uint8Array, documentKey: DocumentKey): DbIndexEntryKey;
}
export declare function indexEntryComparator(left: IndexEntry, right: IndexEntry): number;
export declare function compareByteArrays(left: Uint8Array, right: Uint8Array): number;
/**
 * Workaround for WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=292721
 * Create a key safe representation of Uint8Array values.
 * If the browser is detected as Safari or WebKit, then
 * the input array will be converted to "sortable byte string".
 * Otherwise, the input array will be returned in its original type.
 */
export declare function encodeKeySafeBytes(array: Uint8Array): KeySafeBytes;
/**
 * Reverts the key safe representation of Uint8Array (created by
 * encodeKeySafeBytes) to a normal Uint8Array.
 */
export declare function decodeKeySafeBytes(input: KeySafeBytes): Uint8Array;
