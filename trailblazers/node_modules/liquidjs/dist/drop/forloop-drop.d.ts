import { Drop } from './drop';
export declare class ForloopDrop extends Drop {
    protected i: number;
    name: string;
    length: number;
    constructor(length: number, collection: string, variable: string);
    next(): void;
    index0(): number;
    index(): number;
    first(): boolean;
    last(): boolean;
    rindex(): number;
    rindex0(): number;
    valueOf(): string;
}
