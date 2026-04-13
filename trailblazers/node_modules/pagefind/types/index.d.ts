/**
 * Create a new Pagefind index that files can be added to
 */
export function createIndex(config?: PagefindServiceConfig): Promise<NewIndexResponse>;

/**
 * Close the Pagefind service and clean up, stopping the binary altogether.
 * 
 * Service _will_ be restarted if any new calls are made to any other function.
 * 
 * Calling functions on an existing index after calling close() is undefined behavior,
 * as that index may map to a new index after the service has restarted.
 */
export function close(): Promise<null>;

export interface PagefindServiceConfig {
    /** 
     * The element Pagefind should treat as the root of the document, defaults to `html`.
     * Usually you will want to use the data-pagefind-body attribute instead.
     * @example ".my-html-outer"
     */
    rootSelector?: string,
    /** 
     * Custom selectors that Pagefind should ignore when indexing.
     * Usually you will want to use the data-pagefind-ignore attribute instead.
     * @example ["svg", ".my-code-blocks"]
     */
    excludeSelectors?: string[],
    /**
     * Ignore any detected languages and index the whole site as a single language.
     * Expects an ISO 639-1 code.
     */
    forceLanguage?: string,
    /**
     * Print verbose logging while indexing the site. Does not impact the web-facing search.
     * When running as a service, only impacts the logfile (if present).
     */
    verbose?: boolean,
    /**
     * Path to a logfile to write to. Will replace the file on each run.
     */
    logfile?: string,
    /**
     * Keep `index.html` at the end of search result paths.
     * Defaults to false, stripping `index.html`.
     */
    keepIndexUrl?: boolean,
    /**
     * When writing or outputting files, also write the Pagefind playground to /pagefind/playground/.
     * Defaults to false, ensuring the playground isn't available on a live site.
     */
    writePlayground?: boolean,
    /**
     * Include these characters when indexing and searching words.
     * Useful for sites documenting technical topics such as programming languages.
     * @example "<>$"
     */
    includeCharacters?: string,
}


export interface NewIndexResponse {
    errors: string[],
    index?: PagefindIndex
}

/**
 * A Pagefind index that exists in the backend service before being built
 */
export interface PagefindIndex {
    addHTMLFile: typeof addHTMLFile,
    addCustomRecord: typeof addCustomRecord,
    addDirectory: typeof addDirectory,
    writeFiles: typeof writeFiles,
    getFiles: typeof getFiles,
    deleteIndex: typeof deleteIndex,
}

/**
 * Index an HTML file that isn't on disk
 */
declare function addHTMLFile(file: HTMLFile): Promise<NewFileResponse>;
/**
 * Index a custom record that isn't backed by an HTML file
 */
declare function addCustomRecord(record: CustomRecord): Promise<NewFileResponse>;
/**
 * Index a directory of HTML files from disk
 */
declare function addDirectory(path: SiteDirectory): Promise<IndexingResponse>;

/**
 * The data required for Pagefind to index an HTML file that isn't on disk
 * @example
 * {
 *   sourcePath: "about/index.html",
 *   content: "<html lang='en'><body><h1>Meet the team</h1></body></html>"
 * }
 */
export interface HTMLFile {
    /** 
     * The source path of the HTML file if it were to exist on disk.
     * Must be a relative path, or an absolute path within the current working directory.
     * Pagefind will compute the result URL from this path.
     * 
     * If not supplied, url must be supplied.
     * 
     * @example "about/index.html"
     * @example "/Users/user/Documents/site/about/index.html"
     */
    sourcePath?: string,
    /** 
     * An explicit URL to use, instead of having Pagefind
     * compute the URL based on the sourcePath.
     * 
     * If not supplied, sourcePath must be supplied.
     * 
     * @example "/about/"
     */
    url?: string,
    /** The source HTML content of the file to be parsed */
    content: string
}

/**
 * The data required for Pagefind to index a custom record that isn't backed by an HTML file
 * @example
 * {
 *   url: "/about/",
 *   content: "Meet the team",
 *   language: "en"
 * }
 */
export interface CustomRecord {
    /** The output URL of this record. Pagefind will not alter this */
    url: string,
    /** The raw content of this record */
    content: string,
    /** What language is this record written in. Multiple languages will be split into separate indexes. Expects an ISO 639-1 code. */
    language: string,
    /** The metadata to attach to this record. Supplying a `title` is highly recommended */
    meta?: Record<string, string>,
    /** The filters to attach to this record */
    filters?: Record<string, string[]>,
    /** The sort keys to attach to this record */
    sort?: Record<string, string>
}

/**
 * The data required for Pagefind to index the files in a directory
 * @example
 * {
 *   path: "public",
 *   glob: "**\/*.{html}"
 * }
 */
export interface SiteDirectory {
    /**
     * The path to the directory to index.
     * If relative, is relative to the cwd.
     */
    path: string,
    /** Optionally, a custom glob to evaluate for finding files. Default to all HTML files. */
    glob?: string
}

export interface IndexingResponse {
    errors: string[],
    page_count: number
}

export interface NewFileResponse {
    errors: string[],
    file: NewFile
}

/**
 * Details about a new file that has been successfully added to the Pagefind index
 */
export interface NewFile {
    uniqueWords: number,
    url: string,
    meta: Record<string, string>
}

/**
 * Write the index files to disk
 */
declare function writeFiles(options?: WriteOptions): Promise<WriteFilesResponse>;

/**
 * Options for writing a Pagefind index to disk
 */
export interface WriteOptions {
    /** 
     * The path of the pagefind bundle directory to write to disk.
     * If relative, is relative to the cwd.
     * @example "./public/pagefind"
     */
    outputPath: string
}


export interface WriteFilesResponse {
    errors: string[],
    outputPath: string
}

/**
 * Get an in-memory copy of the built index files
 */
declare function getFiles(): Promise<GetFilesResponse>;

export interface GetFilesResponse {
    errors: string[],
    files: IndexFile[]
}

export interface IndexFile {
    path: string,
    content: Uint8Array
}

/**
 * Delete this index and clear it from memory
 */
declare function deleteIndex(): Promise<null>;
