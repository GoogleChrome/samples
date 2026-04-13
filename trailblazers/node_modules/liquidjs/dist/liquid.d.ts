/// <reference types="node" />
import { Context } from './context';
import { TagClass, TagImplOptions, FilterImplOptions, Template, StaticAnalysisOptions, StaticAnalysis, SegmentArray } from './template';
import { LookupType } from './fs/loader';
import { Render } from './render';
import { Parser } from './parser';
import { LiquidOptions, NormalizedFullOptions, RenderOptions, RenderFileOptions } from './liquid-options';
export declare class Liquid {
    readonly options: NormalizedFullOptions;
    readonly renderer: Render;
    /**
     * @deprecated will be removed. In tags use `this.parser` instead
     */
    readonly parser: Parser;
    readonly filters: Record<string, FilterImplOptions>;
    readonly tags: Record<string, TagClass>;
    constructor(opts?: LiquidOptions);
    parse(html: string, filepath?: string): Template[];
    _render(tpl: Template[], scope: Context | object | undefined, renderOptions: RenderOptions): IterableIterator<any>;
    render(tpl: Template[], scope?: object, renderOptions?: RenderOptions): Promise<any>;
    renderSync(tpl: Template[], scope?: object, renderOptions?: RenderOptions): any;
    renderToNodeStream(tpl: Template[], scope?: object, renderOptions?: RenderOptions): NodeJS.ReadableStream;
    _parseAndRender(html: string, scope: Context | object | undefined, renderOptions: RenderOptions): IterableIterator<any>;
    parseAndRender(html: string, scope?: Context | object, renderOptions?: RenderOptions): Promise<any>;
    parseAndRenderSync(html: string, scope?: Context | object, renderOptions?: RenderOptions): any;
    _parsePartialFile(file: string, sync?: boolean, currentFile?: string): Generator<unknown, Template[], string | Template[]>;
    _parseLayoutFile(file: string, sync?: boolean, currentFile?: string): Generator<unknown, Template[], string | Template[]>;
    _parseFile(file: string, sync?: boolean, lookupType?: LookupType, currentFile?: string): Generator<unknown, Template[]>;
    parseFile(file: string, lookupType?: LookupType): Promise<Template[]>;
    parseFileSync(file: string, lookupType?: LookupType): Template[];
    _renderFile(file: string, ctx: Context | object | undefined, renderFileOptions: RenderFileOptions): Generator<any>;
    renderFile(file: string, ctx?: Context | object, renderFileOptions?: RenderFileOptions): Promise<any>;
    renderFileSync(file: string, ctx?: Context | object, renderFileOptions?: RenderFileOptions): any;
    renderFileToNodeStream(file: string, scope?: object, renderOptions?: RenderOptions): Promise<NodeJS.ReadableStream>;
    _evalValue(str: string, scope?: object | Context): IterableIterator<any>;
    evalValue(str: string, scope?: object | Context): Promise<any>;
    evalValueSync(str: string, scope?: object | Context): any;
    registerFilter(name: string, filter: FilterImplOptions): void;
    registerTag(name: string, tag: TagClass | TagImplOptions): void;
    plugin(plugin: (this: Liquid, L: typeof Liquid) => void): void;
    express(): (this: any, filePath: string, ctx: object, callback: (err: Error | null, rendered: string) => void) => void;
    analyze(template: Template[], options?: StaticAnalysisOptions): Promise<StaticAnalysis>;
    analyzeSync(template: Template[], options?: StaticAnalysisOptions): StaticAnalysis;
    parseAndAnalyze(html: string, filename?: string, options?: StaticAnalysisOptions): Promise<StaticAnalysis>;
    parseAndAnalyzeSync(html: string, filename?: string, options?: StaticAnalysisOptions): StaticAnalysis;
    /** Return an array of all variables without their properties. */
    variables(template: string | Template[], options?: StaticAnalysisOptions): Promise<string[]>;
    /** Return an array of all variables without their properties. */
    variablesSync(template: string | Template[], options?: StaticAnalysisOptions): string[];
    /** Return an array of all variables including their properties/paths. */
    fullVariables(template: string | Template[], options?: StaticAnalysisOptions): Promise<string[]>;
    /** Return an array of all variables including their properties/paths. */
    fullVariablesSync(template: string | Template[], options?: StaticAnalysisOptions): string[];
    /** Return an array of all variables, each as an array of properties/segments. */
    variableSegments(template: string | Template[], options?: StaticAnalysisOptions): Promise<Array<SegmentArray>>;
    /** Return an array of all variables, each as an array of properties/segments. */
    variableSegmentsSync(template: string | Template[], options?: StaticAnalysisOptions): Array<SegmentArray>;
    /** Return an array of all expected context variables without their properties. */
    globalVariables(template: string | Template[], options?: StaticAnalysisOptions): Promise<string[]>;
    /** Return an array of all expected context variables without their properties. */
    globalVariablesSync(template: string | Template[], options?: StaticAnalysisOptions): string[];
    /** Return an array of all expected context variables including their properties/paths. */
    globalFullVariables(template: string | Template[], options?: StaticAnalysisOptions): Promise<string[]>;
    /** Return an array of all expected context variables including their properties/paths. */
    globalFullVariablesSync(template: string | Template[], options?: StaticAnalysisOptions): string[];
    /** Return an array of all expected context variables, each as an array of properties/segments. */
    globalVariableSegments(template: string | Template[], options?: StaticAnalysisOptions): Promise<Array<SegmentArray>>;
    /** Return an array of all expected context variables, each as an array of properties/segments. */
    globalVariableSegmentsSync(template: string | Template[], options?: StaticAnalysisOptions): Array<SegmentArray>;
}
