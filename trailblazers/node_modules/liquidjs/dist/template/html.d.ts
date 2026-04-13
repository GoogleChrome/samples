import { TemplateImpl, Template } from '../template';
import { HTMLToken } from '../tokens';
import { Context } from '../context';
import { Emitter } from '../emitters';
export declare class HTML extends TemplateImpl<HTMLToken> implements Template {
    private str;
    constructor(token: HTMLToken);
    render(ctx: Context, emitter: Emitter): IterableIterator<void>;
}
