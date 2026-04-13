/**
 * Mersenne Twister 19937 PRNG, matching Python's `random.Random` class exactly.
 *
 * Each instance has its own independent state, so seeding one instance does not
 * affect any other instance or the global helper functions.
 *
 * @example
 * const rng1 = new Random(42);
 * const rng2 = new Random(42);
 * rng1.random() === rng2.random(); // true (same seed, independent state)
 */
export class Random {
    constructor(seed: any);
    _mt: Uint32Array<ArrayBuffer>;
    _idx: number;
    _gauss_next: number;
    _random_fn: any;
    /**
     * Seeds this instance's PRNG.
     *
     * When called with a number, initializes the state deterministically from that value.
     * When called with no arguments (or `undefined`/`null`), seeds from OS entropy
     * via `crypto.getRandomValues`, matching Python's `random.seed()` behaviour.
     *
     * @param {number} [n] The seed value. Omit to seed from OS entropy.
     */
    seed(n?: number): void;
    /**
     * Generates a random unsigned 32-bit integer.
     *
     * Performs the "twist" step when the state buffer is exhausted,
     * then applies the standard MT19937 tempering transform.
     *
     * @returns {number} A random integer in the range [0, 2^32 - 1].
     */
    _int32(): number;
    /**
     * Generates a random floating-point number in the half-open interval [0, 1).
     *
     * Combines two 32-bit integers (using 53 bits of precision) to produce
     * a uniformly distributed double, matching Python's `random.random()`.
     *
     * @returns {number} A random float in [0, 1).
     */
    random(): number;
    /**
     * Generates a random number from a Gaussian (normal) distribution.
     *
     * Uses the Box-Muller transform with a cached spare value,
     * matching Python's `random.gauss()` output for the same seed.
     *
     * @param {number} [mu=0] The mean of the distribution.
     * @param {number} [sigma=1] The standard deviation of the distribution.
     * @returns {number} A normally distributed random value.
     */
    gauss(mu?: number, sigma?: number): number;
    /**
     * Shuffles an array in-place using the Fisher-Yates algorithm.
     *
     * Uses rejection sampling via `getrandbits`-style bit masking to ensure
     * a uniform distribution, matching Python's `random.shuffle()`.
     *
     * @param {any[]} arr The array to shuffle in-place.
     */
    shuffle(arr: any[]): void;
    /**
     * Selects a single element from a weighted population.
     *
     * Matches Python's `random.choices(population, weights=weights, k=1)[0]`
     *
     * @param {any[]} population The array of items to choose from.
     * @param {number[]} weights An array of non-negative weights, one per population element.
     * @returns {*} A single randomly selected element from the population.
     */
    choices(population: any[], weights: number[]): any;
}
export const random: Readonly<{
    Random: typeof Random;
    seed: any;
    random: any;
    gauss: any;
    shuffle: any;
    choices: any;
}>;
export function _weightedIndex(weights: any): number;
//# sourceMappingURL=random.d.ts.map