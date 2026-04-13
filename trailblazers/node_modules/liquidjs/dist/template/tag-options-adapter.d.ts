import { Tag, TagClass, TagRenderReturn } from './tag';
import { TagToken, TopLevelToken } from '../tokens';
import { Emitter } from '../emitters';
import { Context } from '../context';
export interface TagImplOptions {
    [key: string]: any;
    parse?: (this: Tag & TagImplOptions, token: TagToken, remainingTokens: TopLevelToken[]) => void;
    render: (this: Tag & TagImplOptions, ctx: Context, emitter: Emitter, hash: Record<string, any>) => TagRenderReturn;
}
export declare function createTagClass(options: TagImplOptions): TagClass;
