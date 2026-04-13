import { TagToken, Liquid, TopLevelToken, Tag } from '..';
export default class extends Tag {
    constructor(tagToken: TagToken, remainTokens: TopLevelToken[], liquid: Liquid);
    render(): void;
}
