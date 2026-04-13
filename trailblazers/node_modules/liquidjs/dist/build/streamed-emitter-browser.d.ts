/// <reference types="node" />
import { Emitter } from '../emitters';
export declare class StreamedEmitter implements Emitter {
    buffer: string;
    stream: NodeJS.ReadableStream;
    constructor();
    write: (html: any) => void;
    error: (err: Error) => void;
    end: () => void;
}
