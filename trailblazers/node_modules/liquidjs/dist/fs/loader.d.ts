import { FS } from './fs';
export interface LoaderOptions {
    fs: FS;
    extname: string;
    root: string[];
    partials: string[];
    layouts: string[];
    relativeReference: boolean;
}
export declare enum LookupType {
    Partials = "partials",
    Layouts = "layouts",
    Root = "root"
}
export declare class Loader {
    shouldLoadRelative: (referencedFile: string) => boolean;
    private options;
    private contains;
    private exists;
    constructor(options: LoaderOptions);
    lookup(file: string, type: LookupType, sync?: boolean, currentFile?: string): Generator<unknown, string, string>;
    candidates(file: string, dirs: string[], currentFile?: string): Generator<string, void, unknown>;
    private dirname;
    private lookupError;
}
