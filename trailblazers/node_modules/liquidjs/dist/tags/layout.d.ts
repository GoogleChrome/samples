import { Template, Liquid, Tag, Emitter, Hash, TagToken, TopLevelToken, Context } from '..';
import { ParsedFileName } from './render';
import { Parser } from '../parser';
import { Arguments, PartialScope } from '../template';
export default class extends Tag {
    args: Hash;
    templates: Template[];
    file?: ParsedFileName;
    constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser);
    render(ctx: Context, emitter: Emitter): Generator<unknown, unknown, unknown>;
    children(partials: boolean): Generator<unknown, Template[]>;
    arguments(): Arguments;
    partialScope(): PartialScope | undefined;
}
