/**
 * String related filters
 *
 * * prefer stringify() to String() since `undefined`, `null` should eval ''
 */
import { FilterImpl } from '../template';
export declare function append(this: FilterImpl, v: string, arg: string): string;
export declare function prepend(this: FilterImpl, v: string, arg: string): string;
export declare function lstrip(this: FilterImpl, v: string, chars?: string): string;
export declare function downcase(this: FilterImpl, v: string): string;
export declare function upcase(this: FilterImpl, v: string): string;
export declare function remove(this: FilterImpl, v: string, arg: string): string;
export declare function remove_first(this: FilterImpl, v: string, l: string): string;
export declare function remove_last(this: FilterImpl, v: string, l: string): string;
export declare function rstrip(this: FilterImpl, str: string, chars?: string): string;
export declare function split(this: FilterImpl, v: string, arg: string): string[];
export declare function strip(this: FilterImpl, v: string, chars?: string): string;
export declare function strip_newlines(this: FilterImpl, v: string): string;
export declare function capitalize(this: FilterImpl, str: string): string;
export declare function replace(this: FilterImpl, v: string, pattern: string, replacement: string): string;
export declare function replace_first(this: FilterImpl, v: string, arg1: string, arg2: string): string;
export declare function replace_last(this: FilterImpl, v: string, arg1: string, arg2: string): string;
export declare function truncate(this: FilterImpl, v: string, l?: number, o?: string): string;
export declare function truncatewords(this: FilterImpl, v: string, words?: number, o?: string): string;
export declare function normalize_whitespace(this: FilterImpl, v: string): string;
export declare function number_of_words(this: FilterImpl, input: string, mode?: 'cjk' | 'auto'): number;
export declare function array_to_sentence_string(this: FilterImpl, array: unknown[], connector?: string): unknown;
