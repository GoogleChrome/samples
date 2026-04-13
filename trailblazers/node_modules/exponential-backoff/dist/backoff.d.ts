import { IBackOffOptions, BackoffOptions } from "./options";
export { BackoffOptions, IBackOffOptions };
/**
 * Executes a function with exponential backoff.
 * @param request the function to be executed
 * @param options options to customize the backoff behavior
 * @returns Promise that resolves to the result of the `request` function
 */
export declare function backOff<T>(request: () => Promise<T>, options?: BackoffOptions): Promise<T>;
