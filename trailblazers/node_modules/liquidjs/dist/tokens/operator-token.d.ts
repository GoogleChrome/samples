import { Token } from './token';
export declare const enum OperatorType {
    Binary = 0,
    Unary = 1
}
export declare const operatorPrecedences: {
    '==': number;
    '!=': number;
    '>': number;
    '<': number;
    '>=': number;
    '<=': number;
    contains: number;
    not: number;
    and: number;
    or: number;
};
export declare const operatorTypes: {
    '==': OperatorType;
    '!=': OperatorType;
    '>': OperatorType;
    '<': OperatorType;
    '>=': OperatorType;
    '<=': OperatorType;
    contains: OperatorType;
    not: OperatorType;
    and: OperatorType;
    or: OperatorType;
};
export declare class OperatorToken extends Token {
    input: string;
    begin: number;
    end: number;
    file?: string | undefined;
    operator: string;
    constructor(input: string, begin: number, end: number, file?: string | undefined);
    getPrecedence(): any;
}
