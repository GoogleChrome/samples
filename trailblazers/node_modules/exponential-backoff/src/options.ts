/**
 * Type of jitter to apply to the delay.
 * - `"none"`: no jitter is applied
 * - `"full"`: full jitter is applied (random value between `0` and `delay`)
 */
export type JitterType = "none" | "full";

export type BackoffOptions = Partial<IBackOffOptions>;

export interface IBackOffOptions {
  /**
   * Decides whether the `startingDelay` should be applied before the first call.
   * If `false`, the first call will occur without a delay.
   * @defaultValue `false`
   */
  delayFirstAttempt: boolean;
  /**
   * Decides whether a [jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
   * should be applied to the delay. Possible values are `"full"` and `"none"`.
   * @defaultValue `"none"`
   */
  jitter: JitterType;
  /**
   * The maximum delay, in milliseconds, between two consecutive attempts.
   * @defaultValue `Infinity`
   */
  maxDelay: number;
  /**
   * The maximum number of times to attempt the function.
   * Must be at least `1`.
   * @defaultValue `10`
   */
  numOfAttempts: number;
  /**
   * The `retry` function can be used to run logic after every failed attempt (e.g. logging a message,
   * assessing the last error, etc.).
   * It is called with the last error and the upcoming attempt number.
   * Returning `true` will retry the function as long as the `numOfAttempts` has not been exceeded.
   * Returning `false` will end the execution.
   * @defaultValue a function that always returns `true`.
   * @param e The last error thrown by the function.
   * @param attemptNumber The upcoming attempt number.
   * @returns `true` to retry the function, `false` to end the execution
   */
  retry: (e: any, attemptNumber: number) => boolean | Promise<boolean>;
  /**
   * The delay, in milliseconds, before executing the function for the first time.
   * @defaultValue `100`
   */
  startingDelay: number;
  /**
   * The `startingDelay` is multiplied by the `timeMultiple` to increase the delay between reattempts.
   * @defaultValue `2`
   */
  timeMultiple: number;
}

const defaultOptions: IBackOffOptions = {
  delayFirstAttempt: false,
  jitter: "none",
  maxDelay: Infinity,
  numOfAttempts: 10,
  retry: () => true,
  startingDelay: 100,
  timeMultiple: 2
};

export function getSanitizedOptions(options: BackoffOptions) {
  const sanitized: IBackOffOptions = { ...defaultOptions, ...options };

  if (sanitized.numOfAttempts < 1) {
    sanitized.numOfAttempts = 1;
  }

  return sanitized;
}
