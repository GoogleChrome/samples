import { ValueToken, Liquid, Tag, Emitter, Hash, TagToken, TopLevelToken, Context, Template } from '..';
import { Parser } from '../parser';
import { Arguments } from '../template';
export default class extends Tag {
    variable: string;
    args: Hash;
    templates: Template[];
    collection: ValueToken;
    constructor(tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser);
    render(ctx: Context, emitter: Emitter): Generator<unknown, void, unknown>;
    children(): Generator<unknown, Template[]>;
    arguments(): Arguments;
    blockScope(): string[];
}
