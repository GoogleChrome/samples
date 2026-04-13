/**
 * A base class for creating callable objects.
 * See [here](https://stackoverflow.com/q/76073890) for more information.
 */
interface Callable<TArgs extends any[] = any[], TReturn = any> {
    (...args: TArgs): TReturn;
}
declare abstract class Callable<TArgs extends any[] = any[], TReturn = any> {
    /**
     * Creates a new instance of the Callable class.
     */
    constructor();
    /**
     * This method should be implemented in subclasses to provide the
     * functionality of the callable object.
     *
     * @param args Arguments passed to the callable
     */
    abstract _call(...args: TArgs): TReturn;
}
export default Callable;
