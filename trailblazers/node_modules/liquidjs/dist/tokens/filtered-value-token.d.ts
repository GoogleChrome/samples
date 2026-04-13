import { Token } from './token';
import { FilterToken } from './filter-token';
import { Expression } from '../render';
/**
 * value expression with optional filters
 * e.g.
 * {% assign foo="bar" | append: "coo" %}
 */
export declare class FilteredValueToken extends Token {
    initial: Expression;
    filters: FilterToken[];
    input: string;
    begin: number;
    end: number;
    file?: string | undefined;
    constructor(initial: Expression, filters: FilterToken[], input: string, begin: number, end: number, file?: string | undefined);
}
