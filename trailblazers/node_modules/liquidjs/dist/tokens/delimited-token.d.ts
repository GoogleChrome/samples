import { Token } from './token';
import { TokenKind } from '../parser';
export declare abstract class DelimitedToken extends Token {
    trimLeft: boolean;
    trimRight: boolean;
    contentRange: [number, number];
    constructor(kind: TokenKind, [contentBegin, contentEnd]: [number, number], input: string, begin: number, end: number, trimLeft: boolean, trimRight: boolean, file?: string);
    get content(): string;
}
