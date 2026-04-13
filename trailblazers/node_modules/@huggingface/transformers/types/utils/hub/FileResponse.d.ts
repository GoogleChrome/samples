export class FileResponse {
    /**
     * Creates a new `FileResponse` object.
     * @param {string} filePath
     */
    constructor(filePath: string);
    filePath: string;
    headers: Headers;
    exists: boolean;
    status: number;
    statusText: string;
    body: ReadableStream<any>;
    /**
     * Updates the 'content-type' header property of the response based on the extension of
     * the file specified by the filePath property of the current object.
     * @returns {void}
     */
    updateContentType(): void;
    /**
     * Clone the current FileResponse object.
     * @returns {FileResponse} A new FileResponse object with the same properties as the current object.
     */
    clone(): FileResponse;
    /**
     * Reads the contents of the file specified by the filePath property and returns a Promise that
     * resolves with an ArrayBuffer containing the file's contents.
     * @returns {Promise<ArrayBuffer>} A Promise that resolves with an ArrayBuffer containing the file's contents.
     * @throws {Error} If the file cannot be read.
     */
    arrayBuffer(): Promise<ArrayBuffer>;
    /**
     * Reads the contents of the file specified by the filePath property and returns a Promise that
     * resolves with a Blob containing the file's contents.
     * @returns {Promise<Blob>} A Promise that resolves with a Blob containing the file's contents.
     * @throws {Error} If the file cannot be read.
     */
    blob(): Promise<Blob>;
    /**
     * Reads the contents of the file specified by the filePath property and returns a Promise that
     * resolves with a string containing the file's contents.
     * @returns {Promise<string>} A Promise that resolves with a string containing the file's contents.
     * @throws {Error} If the file cannot be read.
     */
    text(): Promise<string>;
    /**
     * Reads the contents of the file specified by the filePath property and returns a Promise that
     * resolves with a parsed JavaScript object containing the file's contents.
     *
     * @returns {Promise<Object>} A Promise that resolves with a parsed JavaScript object containing the file's contents.
     * @throws {Error} If the file cannot be read.
     */
    json(): Promise<any>;
}
//# sourceMappingURL=FileResponse.d.ts.map