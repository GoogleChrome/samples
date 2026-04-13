import { Token } from './token';
import { LiteralToken } from './literal-token';
import { ValueToken } from './value-token';
import { IdentifierToken } from './identifier-token';
import { NumberToken } from './number-token';
import { RangeToken } from './range-token';
import { QuotedToken } from './quoted-token';
export declare class PropertyAccessToken extends Token {
    variable: QuotedToken | RangeToken | LiteralToken | NumberToken | undefined;
    props: (ValueToken | IdentifierToken)[];
    constructor(variable: QuotedToken | RangeToken | LiteralToken | NumberToken | undefined, props: (ValueToken | IdentifierToken)[], input: string, begin: number, end: number, file?: string);
}
