import { ParseStream } from './parse-stream';
import { TopLevelToken } from '../tokens';
import { Template, Output, HTML } from '../template';
import { LookupType } from '../fs';
import type { Liquid } from '../liquid';
export declare class Parser {
    parseFile: (file: string, sync?: boolean, type?: LookupType, currentFile?: string) => Generator<unknown, Template[], Template[] | string>;
    private liquid;
    private fs;
    private cache?;
    private loader;
    private parseLimit;
    private readFile;
    constructor(liquid: Liquid);
    parse(html: string, filepath?: string): Template[];
    parseTokens(tokens: TopLevelToken[]): Template[];
    parseToken(token: TopLevelToken, remainTokens: TopLevelToken[]): import("../template").Tag | Output | HTML;
    parseStream(tokens: TopLevelToken[]): ParseStream<TopLevelToken>;
    private _parseFileCached;
    private _parseFile;
}
