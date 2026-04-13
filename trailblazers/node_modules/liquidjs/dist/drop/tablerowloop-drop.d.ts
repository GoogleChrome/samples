import { ForloopDrop } from './forloop-drop';
export declare class TablerowloopDrop extends ForloopDrop {
    private cols;
    constructor(length: number, cols: number, collection: string, variable: string);
    row(): number;
    col0(): number;
    col(): number;
    col_first(): boolean;
    col_last(): boolean;
}
