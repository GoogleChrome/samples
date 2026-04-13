import { Cache } from './cache';
export declare class LRU<T> implements Cache<T> {
    limit: number;
    size: number;
    private cache;
    private head;
    private tail;
    constructor(limit: number, size?: number);
    write(key: string, value: T): void;
    read(key: string): T | undefined;
    remove(key: string): void;
    clear(): void;
    private ensureLimit;
}
