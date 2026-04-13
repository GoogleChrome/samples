import { Context } from '../context';
import { FilterImplOptions } from './filter-impl-options';
import { FilterArg } from '../parser/filter-arg';
import { Liquid } from '../liquid';
import { FilterToken } from '../tokens';
export declare class Filter {
    name: string;
    args: FilterArg[];
    readonly raw: boolean;
    private handler;
    private liquid;
    private token;
    constructor(token: FilterToken, options: FilterImplOptions | undefined, liquid: Liquid);
    render(value: any, context: Context): IterableIterator<unknown>;
}
