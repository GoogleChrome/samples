export type DynamicCache = _DynamicCache & Record<string, Tensor>;
/**
 * @typedef {_DynamicCache & Record<string, Tensor>} DynamicCache
 */
export const DynamicCache: new (entries?: Record<string, Tensor>) => DynamicCache;
/**
 * A cache class that stores past key values as named tensors.
 */
declare class _DynamicCache {
    /**
     * Create a DynamicCache, optionally pre-populated with entries.
     * @param {Record<string, Tensor>} [entries] Initial name→Tensor mappings.
     */
    constructor(entries?: Record<string, Tensor>);
    /**
     * Get the cached sequence length. This requires at least one attention cache entry to be present.
     * @returns {number} The past sequence length.
     */
    get_seq_length(): number;
    /**
     * Dispose all contained tensors whose data resides on the GPU.
     * Returns a promise that resolves when all disposals are complete.
     * @returns {Promise<void>} Promise that resolves when all GPU tensors are disposed.
     */
    dispose(): Promise<void>;
}
import { Tensor } from './utils/tensor.js';
export {};
//# sourceMappingURL=cache_utils.d.ts.map