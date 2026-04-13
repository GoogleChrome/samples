import { Value } from './value';
import { Arguments, Template, TemplateImpl } from '../template';
import { Context } from '../context/context';
import { Emitter } from '../emitters/emitter';
import { OutputToken } from '../tokens/output-token';
import { Liquid } from '../liquid';
export declare class Output extends TemplateImpl<OutputToken> implements Template {
    value: Value;
    constructor(token: OutputToken, liquid: Liquid);
    render(ctx: Context, emitter: Emitter): IterableIterator<unknown>;
    arguments(): Arguments;
}
