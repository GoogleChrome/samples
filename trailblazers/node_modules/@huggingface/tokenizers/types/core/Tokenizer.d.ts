import AddedToken from "./AddedToken";
import type { Encoding } from "../static/types";
import type Normalizer from "./Normalizer";
import type PreTokenizer from "./PreTokenizer";
import type TokenizerModel from "./TokenizerModel";
import type PostProcessor from "./PostProcessor";
import type Decoder from "./Decoder";
interface EncodeOptions {
    text_pair?: string | null;
    add_special_tokens?: boolean;
    return_token_type_ids?: boolean | null;
}
interface DecodeOptions {
    skip_special_tokens?: boolean;
    clean_up_tokenization_spaces?: boolean | null;
}
interface TokenizeOptions {
    text_pair?: string | null;
    add_special_tokens?: boolean;
}
declare class Tokenizer {
    private tokenizer;
    private config;
    normalizer: Normalizer | null;
    pre_tokenizer: PreTokenizer | null;
    model: TokenizerModel | null;
    post_processor: PostProcessor | null;
    decoder: Decoder | null;
    private splitter_unnormalized;
    private splitter_normalized;
    private added_tokens;
    private added_tokens_map;
    private special_tokens;
    private all_special_ids;
    private remove_space;
    private clean_up_tokenization_spaces;
    private do_lowercase_and_remove_accent;
    constructor(tokenizer: Object, config: Object);
    /**
     * Encodes a single text or a pair of texts using the model's tokenizer.
     *
     * @param text The text to encode.
     * @param options An optional object containing the following properties:
     * @returns An object containing the encoded text.
     */
    encode(text: string, options: EncodeOptions & {
        return_token_type_ids: true;
    }): Encoding & {
        token_type_ids: number[];
    };
    encode(text: string, options?: EncodeOptions): Encoding;
    decode(token_ids: Array<number> | Array<bigint>, options?: DecodeOptions): string;
    /**
     * Converts a string into a sequence of tokens.
     * @param text The sequence to be encoded.
     * @param options An optional object containing the following properties:
     * @returns The list of tokens.
     */
    tokenize(text: string, { text_pair, add_special_tokens }?: TokenizeOptions): string[];
    private encode_text;
    private tokenize_helper;
    /**
     * Converts a token string to its corresponding token ID.
     * @param token The token string to convert.
     * @returns The token ID, or undefined if the token is not in the vocabulary.
     */
    token_to_id(token: string): number | undefined;
    /**
     * Converts a token ID to its corresponding token string.
     * @param id The token ID to convert.
     * @returns The token string, or undefined if the ID is not in the vocabulary.
     */
    id_to_token(id: number): string | undefined;
    /**
     * Returns a mapping of token IDs to AddedToken objects for all added tokens.
     * @returns A Map where keys are token IDs and values are AddedToken objects.
     */
    get_added_tokens_decoder(): Map<number, AddedToken>;
    /**
     * Get the underlying vocabulary
     * @param with_added_tokens Whether to include the added tokens
     * @returns The vocabulary
     */
    get_vocab(with_added_tokens?: boolean): Map<string, number>;
}
export default Tokenizer;
