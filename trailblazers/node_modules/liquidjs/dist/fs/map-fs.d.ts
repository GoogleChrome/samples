export declare class MapFS {
    private mapping;
    constructor(mapping: {
        [key: string]: string;
    });
    sep: string;
    exists(filepath: string): Promise<boolean>;
    existsSync(filepath: string): boolean;
    readFile(filepath: string): Promise<string>;
    readFileSync(filepath: string): string;
    dirname(filepath: string): string;
    resolve(dir: string, file: string, ext: string): string;
}
