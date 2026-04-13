import { Context } from '../context/context';
import { Token } from '../tokens/token';
import { Emitter } from '../emitters/emitter';
import { IdentifierToken, QuotedToken, ValueToken } from '../tokens';
import { Value } from './value';
export type Argument = Value | ValueToken;
export type Arguments = Iterable<Argument>;
/** Scope information used when analyzing partial templates. */
export interface PartialScope {
    /**
     * The name of the partial template. We need this to make sure we only analyze
     * each template once.
     * */
    name: string;
    /**
     * If `true`, names in `scope` will be added to a new, isolated scope before
     * analyzing any child templates, without access to the parent template's scope.
     */
    isolated: boolean;
    /**
     * A list of names that will be in scope for the child template.
     *
     * If an item is a [string, Argument] tuple, the string is considered an alias
     * for the argument.
     */
    scope: Iterable<string | [string, Argument]>;
}
export interface Template {
    token: Token;
    render(ctx: Context, emitter: Emitter): any;
    children?(partials: boolean, sync: boolean): Generator<unknown, Template[]>;
    arguments?(): Arguments;
    blockScope?(): Iterable<string>;
    localScope?(): Iterable<IdentifierToken | QuotedToken>;
    partialScope?(): PartialScope | undefined;
}
