import { Token } from './token';
import { FilterArg } from '../parser/filter-arg';
export declare class FilterToken extends Token {
    name: string;
    args: FilterArg[];
    constructor(name: string, args: FilterArg[], input: string, begin: number, end: number, file?: string);
}
