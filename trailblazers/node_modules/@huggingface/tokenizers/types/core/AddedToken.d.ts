/**
 * Represent a token added by the user on top of the existing Model vocabulary.
 * AddedToken can be configured to specify the behavior they should have in various situations like:
 *   - Whether they should only match single words
 *   - Whether to include any whitespace on its left or right
 */
declare class AddedToken {
    /** The content of the added token. */
    content: string;
    /** The id of the added token. */
    id: number;
    /** Whether this token must be a single word or can break words. */
    single_word: boolean;
    /** Whether this token should strip whitespaces on its left. */
    lstrip: boolean;
    /** Whether this token should strip whitespaces on its right. */
    rstrip: boolean;
    /** Whether this token is special. */
    special: boolean;
    /** Whether this token should be normalized. */
    normalized: boolean;
    /**
     * Creates a new instance of AddedToken.
     * @param config Added token configuration object.
     */
    constructor(config: AddedTokenConfig);
}
export type AddedTokenConfig = Pick<AddedToken, "content" | "id"> & Partial<Omit<AddedToken, "content" | "id">>;
export default AddedToken;
