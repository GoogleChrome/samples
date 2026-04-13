import { Token } from './token';
import { LiteralValue } from '../util';
export declare class LiteralToken extends Token {
    input: string;
    begin: number;
    end: number;
    file?: string | undefined;
    content: LiteralValue;
    literal: string;
    constructor(input: string, begin: number, end: number, file?: string | undefined);
}
