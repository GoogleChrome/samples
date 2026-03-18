/**
 * Error class representing an aborted operation.
 */
export class AbortError extends Error {
  /**
   * Creates an AbortError.
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'AbortError';
  }
}

/**
 * Minimal p-retry implementation for ESM.
 * @param {Function} fn - The function to retry.
 * @return {Promise<any>} The result of the function call.
 */
const pRetry = async (fn) => {
  return await fn(1);
};

export default pRetry;
