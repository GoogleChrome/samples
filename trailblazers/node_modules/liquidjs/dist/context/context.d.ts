import { Drop } from '../drop/drop';
import { NormalizedFullOptions, RenderOptions } from '../liquid-options';
import { Scope } from './scope';
import { Limiter } from '../util';
type PropertyKey = string | number;
export declare class Context {
    /**
     * insert a Context-level empty scope,
     * for tags like `{% capture %}` `{% assign %}` to operate
     */
    private scopes;
    private registers;
    /**
     * user passed in scope
     * `{% increment %}`, `{% decrement %}` changes this scope,
     * whereas `{% capture %}`, `{% assign %}` only hide this scope
     */
    environments: Scope;
    /**
     * global scope used as fallback for missing variables
     */
    globals: Scope;
    sync: boolean;
    breakCalled: boolean;
    continueCalled: boolean;
    /**
     * The normalized liquid options object
     */
    opts: NormalizedFullOptions;
    /**
     * Throw when accessing undefined variable?
     */
    strictVariables: boolean;
    ownPropertyOnly: boolean;
    memoryLimit: Limiter;
    renderLimit: Limiter;
    constructor(env?: object, opts?: NormalizedFullOptions, renderOptions?: RenderOptions, { memoryLimit, renderLimit }?: {
        [key: string]: Limiter;
    });
    getRegister(key: string): any;
    setRegister(key: string, value: any): any;
    saveRegister(...keys: string[]): [string, any][];
    restoreRegister(keyValues: [string, any][]): void;
    getAll(): Scope;
    /**
     * @deprecated use `_get()` or `getSync()` instead
     */
    get(paths: PropertyKey[]): unknown;
    getSync(paths: PropertyKey[]): unknown;
    _get(paths: (PropertyKey | Drop)[]): IterableIterator<unknown>;
    /**
     * @deprecated use `_get()` instead
     */
    getFromScope(scope: unknown, paths: PropertyKey[] | string): IterableIterator<unknown>;
    _getFromScope(scope: unknown, paths: (PropertyKey | Drop)[] | string, strictVariables?: boolean): IterableIterator<unknown>;
    push(ctx: object): number;
    pop(): Scope | undefined;
    bottom(): Scope;
    spawn(scope?: {}): Context;
    private findScope;
    readProperty(obj: Scope, key: (PropertyKey | Drop)): any;
}
export declare function readJSProperty(obj: Scope, key: PropertyKey, ownPropertyOnly: boolean): any;
export {};
