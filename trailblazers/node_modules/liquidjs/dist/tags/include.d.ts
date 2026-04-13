import { Template, TopLevelToken, Liquid, Tag, Emitter, TagToken, Context } from '..';
import { Parser } from '../parser';
import { Arguments, PartialScope } from '../template';
export default class extends Tag {
    private withVar?;
    private hash;
    constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser);
    render(ctx: Context, emitter: Emitter): Generator<unknown, void, unknown>;
    children(partials: boolean, sync: boolean): Generator<unknown, Template[]>;
    partialScope(): PartialScope | undefined;
    arguments(): Arguments;
}
