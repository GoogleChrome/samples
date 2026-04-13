export type LiquidAsync<F extends (...args: any[]) => any> = (sync: boolean, ...args: Parameters<F>) => ReturnType<F> | Promise<ReturnType<F>>;
export declare function toLiquidAsync<F extends (...args: any[]) => any>(asyncFn: (...args: Parameters<F>) => Promise<ReturnType<F>>, syncFn?: F): LiquidAsync<F>;
export declare function toPromise<T>(val: Generator<unknown, T, unknown> | Promise<T> | T): Promise<T>;
export declare function toValueSync<T>(val: Generator<unknown, T, unknown> | T): T;
