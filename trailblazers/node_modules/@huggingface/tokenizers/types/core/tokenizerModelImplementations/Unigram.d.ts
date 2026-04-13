import TokenizerModel from "../TokenizerModel";
import CharTrie from "../../utils/data-structures/CharTrie";
import TokenLattice from "../../utils/data-structures/TokenLattice";
import type { TokenizerConfigUnigramModel } from "@static/tokenizer";
/**
 * Class representing a Unigram tokenizer model.
 */
declare class Unigram extends TokenizerModel {
    scores: number[];
    bos_token: string;
    bos_token_id?: number;
    eos_token: string;
    eos_token_id?: number;
    min_score: number;
    unk_score: number;
    trie: CharTrie;
    /**
     * Create a new Unigram tokenizer model.
     * @param config The configuration object for the Unigram model.
     * @param eos_token
     */
    constructor(config: TokenizerConfigUnigramModel, eos_token: string);
    /**
     * Populates lattice nodes.
     * @param lattice The token lattice to populate with nodes.
     */
    populate_nodes(lattice: TokenLattice): void;
    /**
     * Encodes an array of tokens into an array of subtokens using the unigram model.
     *
     * @param normalized The normalized string.
     * @returns An array of subtokens obtained by encoding the input tokens using the unigram model.
     */
    tokenize(normalized: string): string[];
    /**
     * Encodes an array of tokens using Unigram encoding.
     * @param tokens The tokens to encode.
     * @returns An array of encoded tokens.
     */
    encode(tokens: string[]): string[];
}
export default Unigram;
