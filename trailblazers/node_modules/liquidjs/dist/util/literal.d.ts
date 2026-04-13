import { BlankDrop, EmptyDrop, NullDrop } from '../drop';
export declare const literalValues: {
    true: boolean;
    false: boolean;
    nil: NullDrop;
    null: NullDrop;
    empty: EmptyDrop;
    blank: BlankDrop;
};
export type LiteralKey = keyof typeof literalValues;
export type LiteralValue = typeof literalValues[LiteralKey];
