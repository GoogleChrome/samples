import TokenizerModel from "../TokenizerModel";
import LRUCache from "../../utils/data-structures/LRUCache";
import type { TokenizerConfigBPEModel } from "@static/tokenizer";
declare class BPE extends TokenizerModel {
    config: TokenizerConfigBPEModel;
    /** An array of BPE merges as strings. */
    merges: [string, string][];
    bpe_ranks: Map<string, number>;
    /** The suffix to insert between words. */
    continuing_subword_suffix: string | null;
    /** Whether to use spm byte-fallback trick (defaults to False) */
    byte_fallback: boolean;
    text_encoder?: TextEncoder;
    /** Whether or not to match tokens with the vocab before using merges. */
    ignore_merges: boolean;
    /**
     * The maximum length we should cache in a model.
     * Strings that are too long have minimal chances to cache hit anyway
     */
    max_length_to_cache: number;
    /**
     * The default capacity for a `BPE`'s internal cache.
     */
    cache_capacity: number;
    cache: LRUCache<string, string[]>;
    /**
     * Create a BPE instance.
     * @param config The configuration object for BPE.
     */
    constructor(config: TokenizerConfigBPEModel);
    /**
     * Clears the cache.
     */
    clear_cache(): void;
    /**
     * Apply Byte-Pair-Encoding (BPE) to a given token. Efficient heap-based priority
     * queue implementation adapted from https://github.com/belladoreai/llama-tokenizer-js.
     * @param token The token to encode.
     * @returns The BPE encoded tokens.
     */
    bpe(token: string): string[];
    /**
     * Helper function to add a node to the priority queue.
     * @param queue
     * @param node
     */
    private add_node;
    /**
     * Encodes the input sequence of tokens using the BPE algorithm and returns the resulting subword tokens.
     * @param tokens The input sequence of tokens to encode.
     * @returns The resulting subword tokens after applying the BPE algorithm to the input sequence of tokens.
     */
    encode(tokens: string[]): string[];
}
export default BPE;
