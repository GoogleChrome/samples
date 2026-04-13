import { Token } from './token';
import { ValueToken } from './value-token';
import { IdentifierToken } from './identifier-token';
export declare class HashToken extends Token {
    input: string;
    begin: number;
    end: number;
    name: IdentifierToken;
    value?: ValueToken | undefined;
    file?: string | undefined;
    constructor(input: string, begin: number, end: number, name: IdentifierToken, value?: ValueToken | undefined, file?: string | undefined);
}
