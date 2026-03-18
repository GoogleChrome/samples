/**
 * Creates a debounced function that delays invoking `fn` until after `delay`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @return {Function} The debounced function.
 */
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
