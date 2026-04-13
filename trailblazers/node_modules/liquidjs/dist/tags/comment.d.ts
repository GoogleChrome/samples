import { Liquid, TopLevelToken, TagToken, Tag } from '..';
export default class extends Tag {
    constructor(tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid);
    render(): void;
}
