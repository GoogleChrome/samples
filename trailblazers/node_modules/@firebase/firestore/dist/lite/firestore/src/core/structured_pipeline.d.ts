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
import { UserData } from '../lite-api/user_data_reader';
import { ApiClientObjectMap, firestoreV1ApiClientInterfaces, Pipeline as PipelineProto, StructuredPipeline as StructuredPipelineProto } from '../protos/firestore_proto_api';
import { JsonProtoSerializer, ProtoSerializable } from '../remote/serializer';
import { OptionsUtil } from './options_util';
export declare class StructuredPipelineOptions implements UserData {
    private _userOptions;
    private _optionsOverride;
    proto: ApiClientObjectMap<firestoreV1ApiClientInterfaces.Value> | undefined;
    readonly optionsUtil: OptionsUtil;
    constructor(_userOptions?: Record<string, unknown>, _optionsOverride?: Record<string, unknown>);
    _readUserData(context: ParseContext): void;
}
export declare class StructuredPipeline implements ProtoSerializable<StructuredPipelineProto> {
    private pipeline;
    private options;
    constructor(pipeline: ProtoSerializable<PipelineProto>, options: StructuredPipelineOptions);
    _toProto(serializer: JsonProtoSerializer): StructuredPipelineProto;
}
