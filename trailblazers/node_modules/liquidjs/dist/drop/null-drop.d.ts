import { Drop } from './drop';
import { Comparable } from './comparable';
export declare class NullDrop extends Drop implements Comparable {
    equals(value: any): boolean;
    gt(): boolean;
    geq(): boolean;
    lt(): boolean;
    leq(): boolean;
    valueOf(): null;
}
