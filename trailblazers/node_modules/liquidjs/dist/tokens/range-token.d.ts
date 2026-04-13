import { Token } from './token';
import { ValueToken } from './value-token';
export declare class RangeToken extends Token {
    input: string;
    begin: number;
    end: number;
    lhs: ValueToken;
    rhs: ValueToken;
    file?: string | undefined;
    constructor(input: string, begin: number, end: number, lhs: ValueToken, rhs: ValueToken, file?: string | undefined);
}
