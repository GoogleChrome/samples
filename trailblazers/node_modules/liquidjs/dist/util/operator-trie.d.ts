interface TrieInput<T> {
    [key: string]: T;
}
interface TrieLeafNode<T> {
    data: T;
    end: true;
    needBoundary?: true;
}
export interface Trie<T> {
    [key: string]: Trie<T> | TrieLeafNode<T>;
}
export type TrieNode<T> = Trie<T> | TrieLeafNode<T>;
export declare function createTrie<T = any>(input: TrieInput<T>): Trie<T>;
export {};
