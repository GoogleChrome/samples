import { Token } from './token';
export declare class HTMLToken extends Token {
    input: string;
    begin: number;
    end: number;
    file?: string | undefined;
    trimLeft: number;
    trimRight: number;
    constructor(input: string, begin: number, end: number, file?: string | undefined);
    getContent(): string;
}
