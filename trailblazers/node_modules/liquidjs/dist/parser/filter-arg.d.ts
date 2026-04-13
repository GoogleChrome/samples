import { ValueToken } from '../tokens/value-token';
type KeyValuePair = [string?, ValueToken?];
export type FilterArg = ValueToken | KeyValuePair;
export declare function isKeyValuePair(arr: FilterArg): arr is KeyValuePair;
export {};
