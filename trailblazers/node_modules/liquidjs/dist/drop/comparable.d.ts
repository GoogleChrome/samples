export interface Comparable {
    equals: (rhs: any) => boolean;
    gt: (rhs: any) => boolean;
    geq: (rhs: any) => boolean;
    lt: (rhs: any) => boolean;
    leq: (rhs: any) => boolean;
}
export declare function isComparable(arg: any): arg is Comparable;
