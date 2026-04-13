import { Emitter } from './emitter';
export declare class SimpleEmitter implements Emitter {
    buffer: string;
    write(html: any): void;
}
