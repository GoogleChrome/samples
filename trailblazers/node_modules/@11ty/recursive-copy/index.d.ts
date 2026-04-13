import { Stats } from 'fs';
import { Stream } from 'stream';

interface Options {
	/**
	 * Whether to overwrite destination files.
	 */
	overwrite?: boolean;
	/**
	 * Whether to expand symbolic links.
	 */
	expand?: boolean;
	/**
	 * Whether to copy files beginning with a `.`
	 */
	dot?: boolean;
	/**
	 * Whether to copy OS junk files (e.g. `.DS_Store`, `Thumbs.db`).
	 */
	junk?: boolean;
	/**
	 * Filter function / regular expression / glob that determines which files to copy (uses maximatch).
	 */
	filter?: string | string[] | RegExp | ((path: string) => boolean);
	/**
	 * Function that maps source paths to destination paths.
	 */
	rename?: (path: string) => string;
	/**
	 * Function that returns a transform stream used to modify file contents.
	 */
	transform?: (src: string, dest: string, stats: Stats) => Stream | null | undefined;
	/**
	 * Whether to return an array of copy results.
	 *
	 * Defaults to true.
	 */
	results?: boolean;
	/**
	 * Maximum number of simultaneous copy operations.
	 *
	 * Defaults to 255.
	 */
	concurrency?: number;
	/**
	 * Whether to log debug information.
	 */
	debug?: boolean;
}

interface CopyFn {
	(
		source: string,
		dest: string,
		options?: Options,
	): WithCopyEvents<Promise<Array<CopyOperation>>>;
	(
		source: string,
		dest: string,
		callback: (error: Error | null, results?: Array<CopyOperation>) => void,
	): WithCopyEvents<{}>;
	events: {
		ERROR: CopyEventType.ERROR;
		COMPLETE: CopyEventType.COMPLETE;
		CREATE_DIRECTORY_START: CopyEventType.CREATE_DIRECTORY_START;
		CREATE_DIRECTORY_ERROR: CopyEventType.CREATE_DIRECTORY_ERROR;
		CREATE_DIRECTORY_COMPLETE: CopyEventType.CREATE_DIRECTORY_COMPLETE;
		CREATE_SYMLINK_START: CopyEventType.CREATE_SYMLINK_START;
		CREATE_SYMLINK_ERROR: CopyEventType.CREATE_SYMLINK_ERROR;
		CREATE_SYMLINK_COMPLETE: CopyEventType.CREATE_SYMLINK_COMPLETE;
		COPY_FILE_START: CopyEventType.COPY_FILE_START;
		COPY_FILE_ERROR: CopyEventType.COPY_FILE_ERROR;
		COPY_FILE_COMPLETE: CopyEventType.COPY_FILE_COMPLETE;
	};
}

declare const copy: CopyFn;
export default copy;

export interface CopyErrorInfo {
	src: string;
	dest: string;
}

export interface CopyOperation {
	src: string;
	dest: string;
	stats: Stats;
}

type WithCopyEvents<T> = T & {
	on(event: CopyEventType.ERROR, callback: (error: Error, info: CopyErrorInfo) => void): WithCopyEvents<T>;
	on(event: CopyEventType.COMPLETE, callback: (info: Array<CopyOperation>) => void): WithCopyEvents<T>;
	on(event: CopyEventType.CREATE_DIRECTORY_START, callback: (info: CopyOperation) => void): WithCopyEvents<T>;
	on(event: CopyEventType.CREATE_DIRECTORY_ERROR, callback: (error: Error, info: CopyOperation) => void): WithCopyEvents<T>;
	on(event: CopyEventType.CREATE_DIRECTORY_COMPLETE, callback: (info: CopyOperation) => void): WithCopyEvents<T>;
	on(event: CopyEventType.CREATE_SYMLINK_START, callback: (info: CopyOperation) => void): WithCopyEvents<T>;
	on(event: CopyEventType.CREATE_SYMLINK_ERROR, callback: (error: Error, info: CopyOperation) => void): WithCopyEvents<T>;
	on(event: CopyEventType.CREATE_SYMLINK_COMPLETE, callback: (info: CopyOperation) => void): WithCopyEvents<T>;
	on(event: CopyEventType.COPY_FILE_START, callback: (info: CopyOperation) => void): WithCopyEvents<T>;
	on(event: CopyEventType.COPY_FILE_ERROR, callback: (error: Error, info: CopyOperation) => void): WithCopyEvents<T>;
	on(event: CopyEventType.COPY_FILE_COMPLETE, callback: (info: CopyOperation) => void): WithCopyEvents<T>;
}

export enum CopyEventType {
	ERROR = 'error',
	COMPLETE = 'complete',
	CREATE_DIRECTORY_START = 'createDirectoryStart',
	CREATE_DIRECTORY_ERROR = 'createDirectoryError',
	CREATE_DIRECTORY_COMPLETE = 'createDirectoryComplete',
	CREATE_SYMLINK_START = 'createSymlinkStart',
	CREATE_SYMLINK_ERROR = 'createSymlinkError',
	CREATE_SYMLINK_COMPLETE = 'createSymlinkComplete',
	COPY_FILE_START = 'copyFileStart',
	COPY_FILE_ERROR = 'copyFileError',
	COPY_FILE_COMPLETE = 'copyFileComplete',
}
