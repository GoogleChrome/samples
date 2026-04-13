import { ReplacePattern } from "@static/tokenizer";
/**
 * Clean up a list of simple English tokenization artifacts like spaces before punctuations and abbreviated forms.
 * @param text The text to clean up.
 * @returns The cleaned up text.
 */
export declare const clean_up_tokenization: (text: string) => string;
/**
 * Helper method to construct a pattern from a config object.
 * @param pattern The pattern object.
 * @param invert Whether to invert the pattern.
 * @returns The compiled pattern.
 */
export declare const create_pattern: (pattern: ReplacePattern, invert?: boolean) => RegExp | null;
export declare const escape_reg_exp: (string: string) => string;
/**
 * Helper function to fuse consecutive unknown tokens.
 */
export declare const fuse_unk: (arr: Array<string>, tokens_to_ids: Map<string, any>, unk_token_id: number) => string[];
export declare const is_chinese_char: (cp: number) => boolean;
/**
 * Check if a value is an integer.
 * @param {*} x The value to check.
 * @returns {boolean} True if the value is a string, false otherwise.
 */
export declare const is_integral_number: (x: number | bigint) => boolean;
/**
 * Calculate the length of a string, taking multi-byte characters into account.
 * This mimics the behavior of Python's `len` function.
 */
export declare const len: (s: string) => number;
export declare const lowercase_and_remove_accents: (text: string) => string;
/**
 * Efficiently merge arrays, creating a new copy.
 * Adapted from https://stackoverflow.com/a/6768642/13989043
 */
export declare const merge_arrays: (...arrs: Array<Array<any>>) => any[];
export declare const object_to_map: (obj: Object) => Map<string, any>;
/**
 * Helper function to split a string on a regex, but keep the delimiters.
 * This is required, because the JavaScript `.split()` method does not keep the delimiters,
 * and wrapping in a capturing group causes issues with existing capturing groups (due to nesting).
 * @param text The text to split.
 * @param regex The regex to split on.
 * @returns The split string.
 */
export declare const regex_split: (text: string, regex: RegExp) => string[];
export declare const remove_accents: (text: string) => string;
export declare const validate_object: (obj: Object, name: string, required_keys?: string[]) => string;
/**
 * Split a string on whitespace.
 * @param {string} text The text to split.
 * @returns {string[]} The split string.
 */
export declare const whitespace_split: (text: string) => Array<string>;
