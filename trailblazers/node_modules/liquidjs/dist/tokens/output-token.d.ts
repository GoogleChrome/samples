import { DelimitedToken } from './delimited-token';
import { NormalizedFullOptions } from '../liquid-options';
export declare class OutputToken extends DelimitedToken {
    constructor(input: string, begin: number, end: number, options: NormalizedFullOptions, file?: string);
}
