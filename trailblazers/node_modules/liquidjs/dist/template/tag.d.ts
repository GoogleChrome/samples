import { TemplateImpl } from './template-impl';
import type { Emitter } from '../emitters/emitter';
import type { Parser, Tokenizer } from '../parser';
import type { Context } from '../context/context';
import type { TopLevelToken, TagToken } from '../tokens';
import type { Template } from './template';
import type { Liquid } from '../liquid';
export type TagRenderReturn = Generator<unknown, unknown, unknown> | Promise<unknown> | unknown;
export declare abstract class Tag extends TemplateImpl<TagToken> implements Template {
    name: string;
    liquid: Liquid;
    protected tokenizer: Tokenizer;
    constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid);
    abstract render(ctx: Context, emitter: Emitter): TagRenderReturn;
}
export interface TagClass {
    new (token: TagToken, tokens: TopLevelToken[], liquid: Liquid, parser: Parser): Tag;
}
