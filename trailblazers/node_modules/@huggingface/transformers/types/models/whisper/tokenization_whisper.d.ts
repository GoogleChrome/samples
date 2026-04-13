export class WhisperTokenizer extends PreTrainedTokenizer {
    get timestamp_begin(): number;
    /**
     * Decodes automatic speech recognition (ASR) sequences.
     * @param {Array<{tokens: bigint[], token_timestamps?: number[], stride: number[]}>} sequences The sequences to decode.
     * @param {Object} options The options to use for decoding.
     * @returns {Array<string|{chunks?: undefined|Array<{language: string|null, timestamp: Array<number|null>, text: string}>}>} The decoded sequences.
     */
    _decode_asr(sequences: Array<{
        tokens: bigint[];
        token_timestamps?: number[];
        stride: number[];
    }>, { return_timestamps, return_language, time_precision, force_full_sequences }?: any): Array<string | {
        chunks?: undefined | Array<{
            language: string | null;
            timestamp: Array<number | null>;
            text: string;
        }>;
    }>;
    /**
     * Finds the longest common sequence among the provided sequences.
     * @param {number[][]} sequences An array of sequences of token ids to compare.
     * @returns {number[][]} The longest common sequence found.
     * @throws {Error} If there is a bug within the function.
     * @private
     */
    private findLongestCommonSequence;
    /** @private */
    private collateWordTimestamps;
    /**
     * Groups tokens by word. Returns a tuple containing a list of strings with the words,
     * and a list of `token_id` sequences with the tokens making up each word.
     * @param {number[]} tokens
     * @param {string} [language]
     * @param {string} prepend_punctionations
     * @param {string} append_punctuations
     *
     * @private
     */
    private combineTokensIntoWords;
    /**
     * @param {number[]|bigint[]} token_ids List of token IDs to decode.
     * @param {Object} decode_args Optional arguments for decoding
     * @private
     */
    private decodeWithTimestamps;
    /**
     * Combine tokens into words by splitting at any position where the tokens are decoded as valid unicode points.
     * @param {number[]} tokens
     * @returns {*}
     * @private
     */
    private splitTokensOnUnicode;
    /**
     * Combine tokens into words by splitting at whitespace and punctuation tokens.
     * @param {number[]} tokens
     * @private
     */
    private splitTokensOnSpaces;
    /**
     * Merges punctuation tokens with neighboring words.
     * @param {string[]} words
     * @param {number[][]} tokens
     * @param {number[][]} indices
     * @param {string} prepended
     * @param {string} appended
     * @private
     */
    private mergePunctuations;
}
import { PreTrainedTokenizer } from '../../tokenization_utils.js';
//# sourceMappingURL=tokenization_whisper.d.ts.map