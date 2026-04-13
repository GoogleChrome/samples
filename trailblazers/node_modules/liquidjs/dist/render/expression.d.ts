import { QuotedToken, Token } from '../tokens';
import type { Context } from '../context';
export declare class Expression {
    readonly postfix: Token[];
    constructor(tokens: IterableIterator<Token>);
    evaluate(ctx: Context, lenient?: boolean): Generator<unknown, unknown, unknown>;
    valid(): boolean;
}
export declare function evalToken(token: Token | undefined, ctx: Context, lenient?: boolean): IterableIterator<unknown>;
export declare function evalQuotedToken(token: QuotedToken): string;
