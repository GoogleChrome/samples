import { TopLevelToken, Liquid, Emitter, TagToken, Context, Tag } from '..';
import { Arguments } from '../template';
export default class extends Tag {
    private candidates;
    private group?;
    constructor(token: TagToken, remainTokens: TopLevelToken[], liquid: Liquid);
    render(ctx: Context, emitter: Emitter): Generator<unknown, unknown, unknown>;
    arguments(): Arguments;
}
