import { Liquid, TagToken, TopLevelToken, Tag } from '..';
export default class extends Tag {
    private tokens;
    constructor(tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid);
    render(): string;
}
