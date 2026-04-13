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
import { BundleMetadata } from '../protos/firestore_bundle_proto';
import { JsonProtoSerializer } from '../remote/serializer';
import { BundleReaderSync, SizedBundleElement } from './bundle_reader';
/**
 * A class that can parse a bundle form the string serialization of a bundle.
 */
export declare class BundleReaderSyncImpl implements BundleReaderSync {
    private bundleData;
    readonly serializer: JsonProtoSerializer;
    private metadata;
    private elements;
    private cursor;
    constructor(bundleData: string, serializer: JsonProtoSerializer);
    getMetadata(): BundleMetadata;
    getElements(): SizedBundleElement[];
    /**
     * Parses the next element of the bundle.
     *
     * @returns a SizedBundleElement representation of the next element in the bundle, or null if
     * no more elements exist.
     */
    private nextElement;
    /**
     * Reads from a specified position from the bundleData string, for a specified
     * number of bytes.
     *
     * @param length - how many characters to read.
     * @returns a string parsed from the bundle.
     */
    private readJsonString;
    /**
     * Reads from the current cursor until the first '{'.
     *
     * @returns  A string to integer represention of the parsed value.
     * @throws An {@link Error} if the cursor has reached the end of the stream, since lengths
     * prefix bundle objects.
     */
    private readLength;
}
/**
 *  Creates an instance of BundleReader without exposing the BundleReaderSyncImpl class type.
 */
export declare function newBundleReaderSync(bundleData: string, serializer: JsonProtoSerializer): BundleReaderSync;
