import { Token } from './token';
export declare class IdentifierToken extends Token {
    input: string;
    begin: number;
    end: number;
    file?: string | undefined;
    content: string;
    constructor(input: string, begin: number, end: number, file?: string | undefined);
}
