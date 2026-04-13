import { Token } from '../tokens/token';
import { Template } from '../template/template';
export declare abstract class LiquidError extends Error {
    token: Token;
    context: string;
    originalError?: Error;
    constructor(err: Error | string, token: Token);
    protected update(): void;
    static is(obj: unknown): obj is LiquidError;
}
export declare class TokenizationError extends LiquidError {
    constructor(message: string, token: Token);
}
export declare class ParseError extends LiquidError {
    constructor(err: Error, token: Token);
}
export declare class RenderError extends LiquidError {
    constructor(err: Error, tpl: Template);
    static is(obj: any): obj is RenderError;
}
export declare class LiquidErrors extends LiquidError {
    errors: RenderError[];
    constructor(errors: RenderError[]);
    static is(obj: any): obj is LiquidErrors;
}
export declare class UndefinedVariableError extends LiquidError {
    constructor(err: Error, token: Token);
}
export declare class InternalUndefinedVariableError extends Error {
    variableName: string;
    constructor(variableName: string);
}
export declare class AssertionError extends Error {
    constructor(message: string);
}
