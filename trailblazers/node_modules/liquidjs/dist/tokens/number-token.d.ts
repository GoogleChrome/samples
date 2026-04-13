import { Token } from './token';
export declare class NumberToken extends Token {
    input: string;
    begin: number;
    end: number;
    file?: string | undefined;
    content: number;
    constructor(input: string, begin: number, end: number, file?: string | undefined);
}
