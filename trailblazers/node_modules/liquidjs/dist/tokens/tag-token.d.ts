import { DelimitedToken } from './delimited-token';
import { Tokenizer } from '../parser';
import type { NormalizedFullOptions } from '../liquid-options';
export declare class TagToken extends DelimitedToken {
    name: string;
    tokenizer: Tokenizer;
    readonly args: string;
    constructor(input: string, begin: number, end: number, options: NormalizedFullOptions, file?: string);
}
