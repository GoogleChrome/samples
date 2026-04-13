type OperationOptions = {
    /**
     * The exponential factor to use.
     * @default 2
     */
    factor?: number | undefined;
    /**
     * The number of milliseconds before starting the first retry.
     * @default 1000
     */
    minTimeout?: number | undefined;
    /**
     * The maximum number of milliseconds between two retries.
     * @default Infinity
     */
    maxTimeout?: number | undefined;
    /**
     * Randomizes the timeouts by multiplying a factor between 1-2.
     * @default false
     */
    randomize?: boolean | undefined;
    /**
     * The maximum amount of times to retry the operation.
     * @default 10
     */
    retries?: number | undefined;
    /**
     * Whether to retry forever.
     * @default false
     */
    forever?: boolean | undefined;
    /**
     * Whether to [unref](https://nodejs.org/api/timers.html#timers_unref) the setTimeout's.
     * @default false
     */
    unref?: boolean | undefined;
    /**
     * The maximum time (in milliseconds) that the retried operation is allowed to run.
     * @default Infinity
     */
    maxRetryTime?: number | undefined;
} | number[];

type AttemptTimeoutOptions = {
    /**
     * A timeout in milliseconds.
     */
    timeout?: number | undefined;
    /**
     * Callback to execute when the operation takes longer than the timeout.
     */
    callback?(): void;
}

type RetryOperation = {
    /**
     * Returns an array of all errors that have been passed to `retryOperation.retry()` so far.
     * The returning array has the errors ordered chronologically based on when they were passed to
     * `retryOperation.retry()`, which means the first passed error is at index zero and the last is at the last index.
     */
    errors(): Error[];

    /**
     * A reference to the error object that occured most frequently.
     * Errors are compared using the `error.message` property.
     * If multiple error messages occured the same amount of time, the last error object with that message is returned.
     *
     * @return If no errors occured so far the value will be `null`.
     */
    mainError(): Error | null;

    /**
     * Defines the function that is to be retried and executes it for the first time right away.
     *
     * @param fn The function that is to be retried. `currentAttempt` represents the number of attempts
     * callback has been executed so far.
     * @param [timeoutOps.timeout] A timeout in milliseconds.
     * @param [timeoutOps.callback] Callback to execute when the operation takes longer than the timeout.
     */
    attempt(fn: (currentAttempt: number) => void, timeoutOps?: AttemptTimeoutOptions): void;

    /**
     * Returns `false` when no `error` value is given, or the maximum amount of retries has been reached.
     * Otherwise it returns `true`, and retries the operation after the timeout for the current attempt number.
     */
    retry(err?: Error): boolean;

    /**
     * Stops the operation being retried. Useful for aborting the operation on a fatal error etc.
     */
    stop(): void;

    /**
     * Resets the internal state of the operation object, so that you can call `attempt()` again as if
     * this was a new operation object.
     */
    reset(): void;

    /**
     * Returns an int representing the number of attempts it took to call `fn` before it was successful.
     */
    attempts(): number;
}

/**
 * A function that is retryable, by having implicitly-bound params for both an error handler and an attempt number.
 *
 * @param retry The retry callback upon any rejection. Essentially throws the error on in the form of a { retried: err }
 * wrapper, and tags it with a 'code' field of value "EPROMISERETRY" so that it is recognised as needing retrying. Call
 * this from the catch() block when you want to retry a rejected attempt.
 * @param attempt The number of the attempt.
 * @param operation The operation object from the underlying retry module.
 * @returns A Promise for anything (eg. a HTTP response).
 */
type RetryableFn<ResolutionType> = (retry: (error: any) => never, attempt: number, operation: RetryOperation) => Promise<ResolutionType>;
/**
 * Wrap all functions of the object with retry. The params can be entered in either order, just like in the original library.
 *
 * @param retryableFn The function to retry.
 * @param options The options for how long/often to retry the function for.
 * @returns The Promise resolved by the input retryableFn, or rejected (if not retried) from its catch block.
 */
declare function promiseRetry<ResolutionType>(
    retryableFn: RetryableFn<ResolutionType>,
    options?: OperationOptions,
): Promise<ResolutionType>;

export { promiseRetry };
