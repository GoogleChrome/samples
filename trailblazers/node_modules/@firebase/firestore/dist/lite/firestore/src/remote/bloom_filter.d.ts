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
export declare class BloomFilter {
    readonly bitmap: Uint8Array;
    readonly padding: number;
    readonly hashCount: number;
    readonly bitCount: number;
    private readonly bitCountInInteger;
    constructor(bitmap: Uint8Array, padding: number, hashCount: number);
    private getBitIndex;
    private isBitSet;
    mightContain(value: string): boolean;
    /** Create bloom filter for testing purposes only. */
    static create(bitCount: number, hashCount: number, contains: string[]): BloomFilter;
    private insert;
    private setBit;
}
export declare class BloomFilterError extends Error {
    readonly name = "BloomFilterError";
}
