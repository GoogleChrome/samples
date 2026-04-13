import type { Template } from '../template/template';
export interface Cache<T> {
    write(key: string, value: T): void | Promise<void>;
    read(key: string): T | undefined | Promise<T | undefined>;
    remove(key: string): void | Promise<void>;
}
export type LiquidCache = Cache<Template[] | Promise<Template[]>>;
