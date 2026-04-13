import { Filter } from './filter';
import { Expression } from '../render';
import type { FilteredValueToken } from '../tokens';
import type { Liquid } from '../liquid';
import type { Context } from '../context';
export declare class Value {
    readonly filters: Filter[];
    readonly initial: Expression;
    /**
     * @param str the value to be valuated, eg.: "foobar" | truncate: 3
     */
    constructor(input: string | FilteredValueToken, liquid: Liquid);
    value(ctx: Context, lenient?: boolean): Generator<unknown, unknown, unknown>;
    private getFilter;
}
