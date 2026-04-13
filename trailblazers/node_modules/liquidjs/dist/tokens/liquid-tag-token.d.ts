import { DelimitedToken } from './delimited-token';
import { NormalizedFullOptions } from '../liquid-options';
import { Tokenizer } from '../parser';
/**
 * LiquidTagToken is different from TagToken by not having delimiters `{%` or `%}`
 */
export declare class LiquidTagToken extends DelimitedToken {
    name: string;
    tokenizer: Tokenizer;
    constructor(input: string, begin: number, end: number, options: NormalizedFullOptions, file?: string);
    get args(): string;
}
