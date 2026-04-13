import { TopLevelToken, Liquid, Token, Template, Tokenizer, Emitter, TagToken, Context, Tag } from '..';
import { Parser } from '../parser';
import { Arguments, PartialScope } from '../template';
export type ParsedFileName = Template[] | Token | string | undefined;
export default class extends Tag {
    private file;
    private currentFile?;
    private hash;
    constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser);
    render(ctx: Context, emitter: Emitter): Generator<unknown, void, unknown>;
    children(partials: boolean, sync: boolean): Generator<unknown, Template[]>;
    partialScope(): PartialScope | undefined;
    arguments(): Arguments;
}
/**
 * @return null for "none",
 * @return Template[] for quoted with tags and/or filters
 * @return Token for expression (not quoted)
 * @throws TypeError if cannot read next token
 */
export declare function parseFilePath(tokenizer: Tokenizer, liquid: Liquid, parser: Parser): ParsedFileName;
export declare function renderFilePath(file: ParsedFileName, ctx: Context, liquid: Liquid): IterableIterator<unknown>;
