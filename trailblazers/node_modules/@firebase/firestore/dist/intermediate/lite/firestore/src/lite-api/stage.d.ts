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
import { ParseContext } from '../api/parse_context';
import { OptionsUtil } from '../core/options_util';
import { ApiClientObjectMap, firestoreV1ApiClientInterfaces, Stage as ProtoStage } from '../protos/firestore_proto_api';
import { JsonProtoSerializer, ProtoSerializable } from '../remote/serializer';
import { AggregateFunction, BooleanExpression, Expression, Field, Ordering } from './expressions';
import { Pipeline } from './pipeline';
import { StageOptions } from './stage_options';
import { UserData } from './user_data_reader';
/**
 * @beta
 */
export declare abstract class Stage implements ProtoSerializable<ProtoStage>, UserData {
    /**
     * Store optionsProto parsed by _readUserData.
     * @private
     * @internal
     * @protected
     */
    protected optionsProto: ApiClientObjectMap<firestoreV1ApiClientInterfaces.Value> | undefined;
    protected knownOptions: Record<string, unknown>;
    protected rawOptions?: Record<string, unknown>;
    constructor(options: StageOptions);
    _readUserData(context: ParseContext): void;
    _toProto(_: JsonProtoSerializer): ProtoStage;
    abstract get _optionsUtil(): OptionsUtil;
    abstract get _name(): string;
}
/**
 * @beta
 */
export declare class AddFields extends Stage {
    private fields;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(fields: Map<string, Expression>, options: StageOptions);
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class RemoveFields extends Stage {
    private fields;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(fields: Field[], options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class Aggregate extends Stage {
    private groups;
    private accumulators;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(groups: Map<string, Expression>, accumulators: Map<string, AggregateFunction>, options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class Distinct extends Stage {
    private groups;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(groups: Map<string, Expression>, options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class CollectionSource extends Stage {
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    private formattedCollectionPath;
    constructor(collection: string, options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class CollectionGroupSource extends Stage {
    private collectionId;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(collectionId: string, options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class DatabaseSource extends Stage {
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class DocumentsSource extends Stage {
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    private formattedPaths;
    constructor(docPaths: string[], options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class Where extends Stage {
    private condition;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(condition: BooleanExpression, options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class FindNearest extends Stage {
    private vectorValue;
    private field;
    private distanceMeasure;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(vectorValue: Expression, field: Field, distanceMeasure: 'euclidean' | 'cosine' | 'dot_product', options: StageOptions);
    /**
     * @private
     * @internal
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class Limit extends Stage {
    private limit;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(limit: number, options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
}
/**
 * @beta
 */
export declare class Offset extends Stage {
    private offset;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(offset: number, options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
}
/**
 * @beta
 */
export declare class Select extends Stage {
    private selections;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(selections: Map<string, Expression>, options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class Sort extends Stage {
    private orderings;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(orderings: Ordering[], options: StageOptions);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class Sample extends Stage {
    private rate;
    private mode;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(rate: number, mode: 'percent' | 'documents', options: StageOptions);
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class Union extends Stage {
    private other;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(other: Pipeline, options: StageOptions);
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class Unnest extends Stage {
    private alias;
    private expr;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(alias: string, expr: Expression, options: StageOptions);
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class Replace extends Stage {
    private map;
    static readonly MODE = "full_replace";
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
    constructor(map: Expression, options: StageOptions);
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
}
/**
 * @beta
 */
export declare class RawStage extends Stage {
    private name;
    private params;
    /**
     * @private
     * @internal
     */
    constructor(name: string, params: Array<AggregateFunction | Expression>, rawOptions: Record<string, unknown>);
    /**
     * @internal
     * @private
     */
    _toProto(serializer: JsonProtoSerializer): ProtoStage;
    _readUserData(context: ParseContext): void;
    get _name(): string;
    get _optionsUtil(): OptionsUtil;
}
