// Requests to the backend.

/**
 * The raw object passed to the backend binary
 */
export interface InternalServiceRequest {
    message_id?: number,
    payload: InternalRequestPayload
}

/**
 * The payload describing an action to the backend binary
 */
export type InternalRequestPayload =
  | InternalNewIndexRequest
  | InternalAddFileRequest
  | InternalAddRecordRequest
  | InternalAddDirRequest
  | InternalWriteFilesRequest
  | InternalGetFilesRequest
  | InternalDeleteIndexRequest;

export interface InternalNewIndexRequest {
    type: 'NewIndex',
    config?: InternalPagefindServiceConfig
}

export interface InternalPagefindServiceConfig {
    root_selector?: string,
    exclude_selectors?: string[],
    force_language?: string,
    verbose?: boolean,
    logfile?: string,
    keep_index_url?: boolean,
    write_playground?: boolean,
    include_characters?: string,
}

export interface InternalAddFileRequest {
    type: 'AddFile',
    index_id: number,
    file_path?: string,
    url?: string,
    file_contents: string
}

export interface InternalAddRecordRequest {
    type: 'AddRecord',
    index_id: number,
    url: string,
    content: string,
    language: string,
    meta?: Record<string, string>,
    filters?: Record<string, string[]>,
    sort?: Record<string, string>
}

export interface InternalAddDirRequest {
    type: 'AddDir',
    index_id: number,
    path: string,
    glob?: string
}

export interface InternalWriteFilesRequest {
    type: 'WriteFiles',
    index_id: number,
    output_path?: string
}

export interface InternalGetFilesRequest {
    type: 'GetFiles',
    index_id: number
}

export interface InternalDeleteIndexRequest {
    type: 'DeleteIndex',
    index_id: number
}

// Responses from the backend.

/**
 * The raw object returned from the backend binary
 */
export interface InternalServiceResponse {
    message_id: number,
    payload: InternalResponsePayload | InternalResponseError
}

/**
 * The response payload in the case of an error
 */
export interface InternalResponseError {
    type: 'Error',
    original_message?: string,
    message: string
}

/**
 * The response payload in the case of a success
 */
export type InternalResponsePayload = 
  | InternalNewIndexResponse
  | InternalIndexedFileResponse
  | InternalIndexedDirResponse
  | InternalWriteFilesResponse
  | InternalGetFilesResponse
  | InternalDeleteIndexResponse;

export interface InternalNewIndexResponse {
    type: 'NewIndex',
    index_id: number
}

export interface InternalIndexedFileResponse {
    type: 'IndexedFile',
    page_word_count: number,
    page_url: string,
    page_meta: Record<string, string>
}

export interface InternalIndexedDirResponse {
    type: 'IndexedDir',
    page_count: number
}

export interface InternalWriteFilesResponse {
    type: 'WriteFiles',
    output_path: string,
}

export interface InternalGetFilesResponse {
    type: 'GetFiles',
    files: InternalSyntheticFile[],
}

export interface InternalSyntheticFile {
    path: string,
    content: string
}

export interface InternalDeleteIndexResponse {
    type: 'DeleteIndex'
}

/**
 * What the service returns to the wrapping javascript detailing a response
 */
export interface InternalResponseCallback {
    exception: Error | null,
    err: InternalResponseError | null,
    result: InternalResponsePayload | null
}