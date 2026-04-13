import { Template, Emitter, Liquid, TopLevelToken, TagToken, Context, Tag } from '..';
import { Parser } from '../parser';
export default class extends Tag {
    templates: Template[];
    constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser);
    render(ctx: Context, emitter: Emitter): Generator<unknown, void, unknown>;
    children(): Generator<unknown, Template[]>;
}
