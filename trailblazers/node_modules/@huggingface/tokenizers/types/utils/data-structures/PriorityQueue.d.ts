/**
 * Efficient Heap-based Implementation of a Priority Queue.
 * It uses an array-based binary heap, where the root is at index `0`, and the
 * children of node `i` are located at indices `2i + 1` and `2i + 2`, respectively.
 *
 * Adapted from the following sources:
 * - https://stackoverflow.com/a/42919752/13989043 (original)
 * - https://github.com/belladoreai/llama-tokenizer-js (minor improvements)
 */
declare class PriorityQueue<T> {
    private _heap;
    private _comparator;
    private _max_size;
    /**
     * Create a new PriorityQueue.
     * @param comparator Comparator function to determine priority. Defaults to a MaxHeap.
     * @param max_size Maximum size of the queue. Defaults to Infinity.
     */
    constructor(comparator?: (a: T, b: T) => boolean, max_size?: number);
    /**
     * The size of the queue
     */
    get size(): number;
    /**
     * Check if the queue is empty.
     * @returns `true` if the queue is empty, `false` otherwise.
     */
    is_empty(): boolean;
    /**
     * Return the element with the highest priority in the queue.
     * @returns The highest priority element in the queue.
     */
    peek(): T;
    /**
     * Add one or more elements to the queue.
     * @param values The values to push into the queue.
     * @returns The new size of the queue.
     */
    push(...values: T[]): number;
    /**
     * Add multiple elements to the queue.
     * @param values The values to push into the queue.
     * @returns The new size of the queue.
     */
    extend(values: T[]): number;
    /**
     * Remove and return the element with the highest priority in the queue.
     * @returns The element with the highest priority in the queue.
     */
    pop(): T;
    /**
     * Replace the element with the highest priority in the queue with a new value.
     * @param value The new value.
     * @returns The replaced value.
     */
    replace(value: T): T;
    /**
     * Compute the index for the parent of the node at index `i`.
     * @param i The index of the node to get the parent of.
     * @returns The index of the parent node.
     * @private
     */
    private _parent;
    /**
     * Compute the index for the left child of the node at index `i`.
     * @param i The index of the node to get the left child of.
     * @returns The index of the left child.
     * @private
     */
    private _left;
    /**
     * Compute the index for the right child of the node at index `i`.
     * @param i The index of the node to get the right child of.
     * @returns The index of the right child.
     * @private
     */
    private _right;
    /**
     * Check if the element at index `i` is greater than the element at index `j`.
     * @param i The index of the first element to compare.
     * @param j The index of the second element to compare.
     * @returns `true` if the element at index `i` is greater than the element at index `j`, `false` otherwise.
     * @private
     */
    private _greater;
    /**
     * Swap the elements at indices `i` and `j`.
     * @param i The index of the first element to swap.
     * @param j The index of the second element to swap.
     * @private
     */
    private _swap;
    /**
     * Maintain the heap property by updating positions in the heap,
     * starting at the last element and moving up the heap.
     * @private
     */
    private _sift_up;
    /**
     * Helper function to sift up from a given node.
     * @param node The index of the node to start sifting up from.
     */
    private _sift_up_from;
    /**
     * Maintain the heap property by updating positions in the heap,
     * starting at the first element and moving down the heap.
     * @private
     */
    private _sift_down;
    /**
     * Get the index of the smallest element in the heap. Since we use an array-based heap,
     * the index can be computed without needing to traverse the heap.
     * @private
     */
    private _smallest;
}
export default PriorityQueue;
