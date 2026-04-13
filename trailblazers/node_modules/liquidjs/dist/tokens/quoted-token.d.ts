import { Token } from './token';
export declare class QuotedToken extends Token {
    input: string;
    begin: number;
    end: number;
    file?: string | undefined;
    readonly content: string;
    constructor(input: string, begin: number, end: number, file?: string | undefined);
}
