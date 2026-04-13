/**
 * Gets file metadata (size, content-type, etc.) without downloading the full content.
 * Uses Range requests for remote files to be efficient.
 * Can also be used as a lightweight file existence check by checking the `.exists` property.
 *
 * @param {string} path_or_repo_id This can be either:
 * - a string, the *model id* of a model repo on huggingface.co.
 * - a path to a *directory* potentially containing the file.
 * @param {string} filename The name of the file to check.
 * @param {PretrainedOptions} [options] An object containing optional parameters.
 * @returns {Promise<{exists: boolean, size?: number, contentType?: string, fromCache?: boolean}>} A Promise that resolves to file metadata.
 */
export function get_file_metadata(path_or_repo_id: string, filename: string, options?: PretrainedOptions): Promise<{
    exists: boolean;
    size?: number;
    contentType?: string;
    fromCache?: boolean;
}>;
export type PretrainedOptions = import("../hub.js").PretrainedOptions;
//# sourceMappingURL=get_file_metadata.d.ts.map