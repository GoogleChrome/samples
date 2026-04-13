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
export type HmacImpl = (obj: Record<string, unknown>) => string;
export declare let encoderImpl: HmacImpl;
export type DecodeHmacImpl = (s: string) => Record<string, unknown>;
export declare let decoderImpl: DecodeHmacImpl;
export declare function setEncoder(encoder: HmacImpl): void;
export declare function setDecoder(decoder: DecodeHmacImpl): void;
