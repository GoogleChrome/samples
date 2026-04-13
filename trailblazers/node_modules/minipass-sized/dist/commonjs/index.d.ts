import { Minipass } from 'minipass';
export declare class SizeError extends Error {
    expect: number;
    found: number;
    code: 'EBADSIZE';
    constructor(found: number, expect: number, from?: (...a: any[]) => any);
    get name(): string;
}
export type Options<T extends Minipass.BufferOrString> = Minipass.Options<T> & {
    objectMode?: false;
    size: number;
};
export declare class MinipassSized<RType extends Minipass.BufferOrString, WType extends Minipass.BufferOrString, Events extends Minipass.Events<RType> = Minipass.Events<RType>> extends Minipass<RType, WType, Events> {
    found: number;
    expect: number;
    constructor(options: Options<RType>);
    write(chunk: WType, cb?: () => void): boolean;
    write(chunk: WType, encoding?: Minipass.Encoding, cb?: () => void): boolean;
    emit<Event extends keyof Events>(ev: Event, ...args: Events[Event]): boolean;
}
//# sourceMappingURL=index.d.ts.map