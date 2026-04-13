export declare function resolve(root: string, filepath: string, ext: string): string;
export declare function readFile(url: string): Promise<string>;
export declare function readFileSync(url: string): string;
export declare function exists(filepath: string): Promise<boolean>;
export declare function existsSync(filepath: string): boolean;
export declare function dirname(filepath: string): string;
export declare const sep = "/";
