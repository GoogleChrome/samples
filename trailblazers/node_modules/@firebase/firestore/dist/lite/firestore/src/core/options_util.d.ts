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
import { ParseContext } from '../api/parse_context';
import { ApiClientObjectMap, Value } from '../protos/firestore_proto_api';
export type OptionsDefinitions = Record<string, OptionDefinition>;
export interface OptionDefinition {
    serverName: string;
    nestedOptions?: OptionsDefinitions;
}
export declare class OptionsUtil {
    private optionDefinitions;
    constructor(optionDefinitions: OptionsDefinitions);
    private _getKnownOptions;
    getOptionsProto(context: ParseContext, knownOptions: Record<string, unknown>, optionsOverride?: Record<string, unknown>): ApiClientObjectMap<Value> | undefined;
}
