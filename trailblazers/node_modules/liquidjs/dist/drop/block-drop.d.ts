import { Emitter } from '../emitters';
import { Drop } from './drop';
export declare class BlockDrop extends Drop {
    private superBlockRender;
    constructor(superBlockRender?: (emitter: Emitter) => IterableIterator<unknown> | string);
    /**
     * Provide parent access in child block by
     * {{ block.super }}
     */
    super(): IterableIterator<unknown>;
}
