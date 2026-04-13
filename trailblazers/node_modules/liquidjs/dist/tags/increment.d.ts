import { Tag, Liquid, TopLevelToken, Emitter, TagToken, Context } from '..';
import { IdentifierToken } from '../tokens';
export default class extends Tag {
    private identifier;
    private variable;
    constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid);
    render(context: Context, emitter: Emitter): void;
    localScope(): Iterable<string | IdentifierToken>;
}
