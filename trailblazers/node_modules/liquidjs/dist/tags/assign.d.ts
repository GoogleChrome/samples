import { Liquid, TopLevelToken, TagToken, Context, Tag } from '..';
import { Arguments } from '../template';
import { IdentifierToken } from '../tokens';
export default class extends Tag {
    private key;
    private value;
    private identifier;
    constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid);
    render(ctx: Context): Generator<unknown, void, unknown>;
    arguments(): Arguments;
    localScope(): Iterable<IdentifierToken>;
}
