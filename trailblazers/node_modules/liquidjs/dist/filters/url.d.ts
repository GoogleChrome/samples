export declare const url_decode: (x: string) => string;
export declare const url_encode: (x: string) => string;
export declare const cgi_escape: (x: string) => string;
export declare const uri_escape: (x: string) => string;
declare const rSlugifyReplacers: {
    raw: RegExp;
    default: RegExp;
    pretty: RegExp;
    ascii: RegExp;
    latin: RegExp;
    none: null;
};
export declare function slugify(str: string, mode?: keyof typeof rSlugifyReplacers, cased?: boolean): string;
export {};
