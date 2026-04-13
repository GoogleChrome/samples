/**
 * Represents a node in a token lattice.
 */
declare class TokenLatticeNode {
    token_id: number;
    node_id: number;
    pos: number;
    length: number;
    score: number;
    prev: TokenLatticeNode | null;
    backtrace_score: number;
    /**
     * Represents a node in a token lattice for a given sentence.
     * @param token_id The ID of the token associated with this node.
     * @param node_id The ID of this node.
     * @param pos The starting position of the token in the sentence.
     * @param length The length of the token.
     * @param score The score associated with the token.
     */
    constructor(token_id: number, node_id: number, pos: number, length: number, score: number);
    /**
     * Returns a clone of this node.
     * @returns A clone of this node.
     */
    clone(): TokenLatticeNode;
}
/**
 * A lattice data structure to be used for tokenization.
 */
declare class TokenLattice {
    chars: string[];
    len: number;
    bos_token_id?: number;
    eos_token_id?: number;
    nodes: TokenLatticeNode[];
    begin_nodes: TokenLatticeNode[][];
    end_nodes: TokenLatticeNode[][];
    /**
     * Creates a new TokenLattice instance.
     *
     * @param sentence The input sentence to be tokenized.
     * @param bos_token_id The beginning-of-sequence token ID.
     * @param eos_token_id The end-of-sequence token ID.
     */
    constructor(sentence: string, bos_token_id?: number, eos_token_id?: number);
    /**
     * Inserts a new token node into the token lattice.
     *
     * @param pos The starting position of the token.
     * @param length The length of the token.
     * @param score The score of the token.
     * @param token_id The token ID of the token.
     */
    insert(pos: number, length: number, score: number, token_id: number): void;
    /**
     * Implements the Viterbi algorithm to compute the most likely sequence of tokens.
     *
     * @returns The most likely sequence of tokens.
     */
    viterbi(): TokenLatticeNode[];
    /**
     * Get the text piece for a given node.
     * @param node The node to get the piece for.
     * @returns The array of nodes representing the most likely sequence of tokens.
     */
    piece(node: TokenLatticeNode): string;
    /**
     * @returns The most likely sequence of tokens.
     */
    tokens(): string[];
    /**
     * @returns The most likely sequence of token ids.
     */
    token_ids(): number[];
}
export default TokenLattice;
