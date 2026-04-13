import { Template } from '.';
/**
 * Row, column and file name where a variable was found.
 */
export interface VariableLocation {
    row: number;
    col: number;
    file?: string;
}
/**
 * A variable's segments as an array, possibly with nested arrays of segments.
 */
export type SegmentArray = Array<string | number | SegmentArray>;
/**
 * A variable's segments and location, which can be coerced to a string.
 */
export declare class Variable {
    readonly segments: Array<string | number | Variable>;
    readonly location: VariableLocation;
    constructor(segments: Array<string | number | Variable>, location: VariableLocation);
    toString(): string;
    /** Return this variable's segments as an array, possibly with nested arrays for nested paths. */
    toArray(): SegmentArray;
}
/**
 * Property names and array indexes that make up a path to a variable.
 */
export type VariableSegments = Array<string | number | Variable>;
/**
 * A mapping of variable names to an array of locations at which the variable was found.
 */
export type Variables = {
    [key: string]: Variable[];
};
/**
 * Group variables by the string representation of their root segment.
 */
export declare class VariableMap {
    private map;
    constructor();
    get(key: Variable): Variable[];
    has(key: Variable): boolean;
    push(variable: Variable): void;
    asObject(): Variables;
}
/**
 * The result of calling `analyze()` or `analyzeSync()`.
 */
export interface StaticAnalysis {
    /**
     * All variables, whether they are in scope or not. Including references to names
     * such as `forloop` from the `for` tag.
     */
    variables: Variables;
    /**
     * Variables that are not in scope. These could be a "global" variables that are
     * expected to be provided by the application developer, or possible mistakes
     * from the template author.
     *
     * If a variable is referenced before and after assignment, you should expect
     * that variable to be included in `globals`, `variables` and `locals`, each with
     * a different location.
     */
    globals: Variables;
    /**
     * Template variables that are added to the template local scope using tags like
     * `assign`, `capture` or `increment`.
     */
    locals: Variables;
}
export interface StaticAnalysisOptions {
    /**
     * When `true` (the default), try to load partial templates and analyze them too.
     */
    partials?: boolean;
}
export declare const defaultStaticAnalysisOptions: StaticAnalysisOptions;
/**
 * Statically analyze a template and report variable usage.
 */
export declare function analyze(template: Template[], options?: StaticAnalysisOptions): Promise<StaticAnalysis>;
/**
 * Statically analyze a template and report variable usage.
 */
export declare function analyzeSync(template: Template[], options?: StaticAnalysisOptions): StaticAnalysis;
