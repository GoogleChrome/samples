export interface FS {
    /** check if a file exists asynchronously */
    exists: (filepath: string) => Promise<boolean>;
    /** check if a file exists synchronously */
    existsSync: (filepath: string) => boolean;
    /** read a file asynchronously */
    readFile: (filepath: string) => Promise<string>;
    /** read a file synchronously */
    readFileSync: (filepath: string) => string;
    /** resolve a file against directory, for given `ext` option */
    resolve: (dir: string, file: string, ext: string) => string;
    /** check if file is contained in `root`. Node default fs uses realpath; if omitted, loader assumes contained. */
    contains?: (root: string, file: string) => Promise<boolean>;
    /** sync check if file is contained in `root`, allows both renderSync and render. */
    containsSync?: (root: string, file: string) => boolean;
    /** defaults to "/" */
    sep?: string;
    /** required for relative path resolving */
    dirname?: (file: string) => string;
    /** fallback file for lookup failure */
    fallback?: (file: string) => string | undefined;
}
