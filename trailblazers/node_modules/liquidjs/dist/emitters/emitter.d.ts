export interface Emitter {
    /**
     * Write a html value into emitter
     * @param html string, Drop or other primitive value
     */
    write(html: any): void;
    /**
     * Buffered string
     */
    buffer: string;
}
