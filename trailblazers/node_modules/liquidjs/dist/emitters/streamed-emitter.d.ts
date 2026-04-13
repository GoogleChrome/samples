/// <reference types="node" />
import { Emitter } from './emitter';
export declare class StreamedEmitter implements Emitter {
    buffer: string;
    stream: NodeJS.ReadWriteStream;
    write(html: any): void;
    error(err: Error): void;
    end(): void;
}
