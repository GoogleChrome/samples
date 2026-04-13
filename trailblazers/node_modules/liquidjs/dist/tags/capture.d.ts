import { Liquid, Tag, Template, Context, TagToken, TopLevelToken } from '..';
import { Parser } from '../parser';
import { IdentifierToken, QuotedToken } from '../tokens';
export default class extends Tag {
    identifier: IdentifierToken | QuotedToken;
    variable: string;
    templates: Template[];
    constructor(tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid, parser: Parser);
    private readVariable;
    render(ctx: Context): Generator<unknown, void, string>;
    children(): Generator<unknown, Template[]>;
    localScope(): Iterable<string | IdentifierToken | QuotedToken>;
}
