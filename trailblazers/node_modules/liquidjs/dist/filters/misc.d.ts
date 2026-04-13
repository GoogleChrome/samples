import { identify } from '../util/underscore';
import { FilterImpl } from '../template';
declare function defaultFilter<T1 extends boolean, T2>(this: FilterImpl, value: T1, defaultValue: T2, ...args: Array<[string, any]>): T1 | T2;
declare function json(value: any, space?: number): string;
declare function inspect(value: any, space?: number): string;
declare function to_integer(value: any): number;
declare const _default: {
    default: typeof defaultFilter;
    raw: {
        raw: boolean;
        handler: typeof identify;
    };
    jsonify: typeof json;
    to_integer: typeof to_integer;
    json: typeof json;
    inspect: typeof inspect;
};
export default _default;
