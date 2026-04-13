import { Liquid, TagToken, TopLevelToken, Template, Context, Emitter, Tag } from '..';
import { Parser } from '../parser';
export default class extends Tag {
    block: string;
    templates: Template[];
    constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser);
    render(ctx: Context, emitter: Emitter): Generator<any, void, unknown>;
    private getBlockRender;
    children(): Generator<unknown, Template[]>;
    blockScope(): Iterable<string>;
}
