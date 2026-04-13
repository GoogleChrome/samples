import { GoogleAuthOptions } from 'google-auth-library';

/** Marks the end of user activity.

 This can only be sent if automatic (i.e. server-side) activity detection is
 disabled. */
declare interface ActivityEnd {
}

/** The different ways of handling user activity. */
declare enum ActivityHandling {
    /**
     * If unspecified, the default behavior is `START_OF_ACTIVITY_INTERRUPTS`.
     */
    ACTIVITY_HANDLING_UNSPECIFIED = "ACTIVITY_HANDLING_UNSPECIFIED",
    /**
     * If true, start of activity will interrupt the model's response (also called "barge in"). The model's current response will be cut-off in the moment of the interruption. This is the default behavior.
     */
    START_OF_ACTIVITY_INTERRUPTS = "START_OF_ACTIVITY_INTERRUPTS",
    /**
     * The model's response will not be interrupted.
     */
    NO_INTERRUPTION = "NO_INTERRUPTION"
}

/** Marks the start of user activity.

 This can only be sent if automatic (i.e. server-side) activity detection is
 disabled. */
declare interface ActivityStart {
}

/** Adapter size for tuning. This enum is not supported in Gemini API. */
declare enum AdapterSize {
    /**
     * Adapter size is unspecified.
     */
    ADAPTER_SIZE_UNSPECIFIED = "ADAPTER_SIZE_UNSPECIFIED",
    /**
     * Adapter size 1.
     */
    ADAPTER_SIZE_ONE = "ADAPTER_SIZE_ONE",
    /**
     * Adapter size 2.
     */
    ADAPTER_SIZE_TWO = "ADAPTER_SIZE_TWO",
    /**
     * Adapter size 4.
     */
    ADAPTER_SIZE_FOUR = "ADAPTER_SIZE_FOUR",
    /**
     * Adapter size 8.
     */
    ADAPTER_SIZE_EIGHT = "ADAPTER_SIZE_EIGHT",
    /**
     * Adapter size 16.
     */
    ADAPTER_SIZE_SIXTEEN = "ADAPTER_SIZE_SIXTEEN",
    /**
     * Adapter size 32.
     */
    ADAPTER_SIZE_THIRTY_TWO = "ADAPTER_SIZE_THIRTY_TWO"
}

/** Aggregation metric. This enum is not supported in Gemini API. */
declare enum AggregationMetric {
    /**
     * Unspecified aggregation metric.
     */
    AGGREGATION_METRIC_UNSPECIFIED = "AGGREGATION_METRIC_UNSPECIFIED",
    /**
     * Average aggregation metric. Not supported for Pairwise metric.
     */
    AVERAGE = "AVERAGE",
    /**
     * Mode aggregation metric.
     */
    MODE = "MODE",
    /**
     * Standard deviation aggregation metric. Not supported for pairwise metric.
     */
    STANDARD_DEVIATION = "STANDARD_DEVIATION",
    /**
     * Variance aggregation metric. Not supported for pairwise metric.
     */
    VARIANCE = "VARIANCE",
    /**
     * Minimum aggregation metric. Not supported for pairwise metric.
     */
    MINIMUM = "MINIMUM",
    /**
     * Maximum aggregation metric. Not supported for pairwise metric.
     */
    MAXIMUM = "MAXIMUM",
    /**
     * Median aggregation metric. Not supported for pairwise metric.
     */
    MEDIAN = "MEDIAN",
    /**
     * 90th percentile aggregation metric. Not supported for pairwise metric.
     */
    PERCENTILE_P90 = "PERCENTILE_P90",
    /**
     * 95th percentile aggregation metric. Not supported for pairwise metric.
     */
    PERCENTILE_P95 = "PERCENTILE_P95",
    /**
     * 99th percentile aggregation metric. Not supported for pairwise metric.
     */
    PERCENTILE_P99 = "PERCENTILE_P99"
}

/** The aggregation result for the entire dataset and all metrics. This data type is not supported in Gemini API. */
declare interface AggregationOutput {
    /** One AggregationResult per metric. */
    aggregationResults?: AggregationResult[];
    /** The dataset used for evaluation & aggregation. */
    dataset?: EvaluationDataset;
}

/** The aggregation result for a single metric. This data type is not supported in Gemini API. */
declare interface AggregationResult {
    /** Aggregation metric. */
    aggregationMetric?: AggregationMetric;
    /** Results for bleu metric. */
    bleuMetricValue?: BleuMetricValue;
    /** Result for code execution metric. */
    customCodeExecutionResult?: CustomCodeExecutionResult;
    /** Results for exact match metric. */
    exactMatchMetricValue?: ExactMatchMetricValue;
    /** Result for pairwise metric. */
    pairwiseMetricResult?: PairwiseMetricResult;
    /** Result for pointwise metric. */
    pointwiseMetricResult?: PointwiseMetricResult;
    /** Results for rouge metric. */
    rougeMetricValue?: RougeMetricValue;
}

/** The generic reusable api auth config. Deprecated. Please use AuthConfig (google/cloud/aiplatform/master/auth.proto) instead. This data type is not supported in Gemini API. */
declare interface ApiAuth {
    /** The API secret. */
    apiKeyConfig?: ApiAuthApiKeyConfig;
}

/** The API secret. This data type is not supported in Gemini API. */
declare interface ApiAuthApiKeyConfig {
    /** Required. The SecretManager secret version resource name storing API key. e.g. projects/{project}/secrets/{secret}/versions/{version} */
    apiKeySecretVersion?: string;
    /** The API key string. Either this or `api_key_secret_version` must be set. */
    apiKeyString?: string;
}

/**
 * The ApiClient class is used to send requests to the Gemini API or Vertex AI
 * endpoints.
 *
 * WARNING: This is an internal API and may change without notice. Direct usage
 * is not supported and may break your application.
 */
export declare class ApiClient implements GeminiNextGenAPIClientAdapter {
    readonly clientOptions: ApiClientInitOptions;
    private readonly customBaseUrl?;
    constructor(opts: ApiClientInitOptions);
    isVertexAI(): boolean;
    getProject(): string | undefined;
    getLocation(): string | undefined;
    getCustomBaseUrl(): string | undefined;
    getAuthHeaders(): Promise<Headers>;
    getApiVersion(): string;
    getBaseUrl(): string;
    getRequestUrl(): string;
    getHeaders(): Record<string, string>;
    private getRequestUrlInternal;
    getBaseResourcePath(): string;
    getApiKey(): string | undefined;
    getWebsocketBaseUrl(): string;
    setBaseUrl(url: string): void;
    private constructUrl;
    private shouldPrependVertexProjectPath;
    request(request: HttpRequest): Promise<types.HttpResponse>;
    private patchHttpOptions;
    requestStream(request: HttpRequest): Promise<AsyncGenerator<types.HttpResponse>>;
    private includeExtraHttpOptionsToRequestInit;
    private unaryApiCall;
    private streamApiCall;
    processStreamResponse(response: Response): AsyncGenerator<types.HttpResponse>;
    private apiCall;
    getDefaultHeaders(): Record<string, string>;
    private getHeadersInternal;
    private getFileName;
    /**
     * Uploads a file asynchronously using Gemini API only, this is not supported
     * in Vertex AI.
     *
     * @param file The string path to the file to be uploaded or a Blob object.
     * @param config Optional parameters specified in the `UploadFileConfig`
     *     interface. @see {@link types.UploadFileConfig}
     * @return A promise that resolves to a `File` object.
     * @throws An error if called on a Vertex AI client.
     * @throws An error if the `mimeType` is not provided and can not be inferred,
     */
    uploadFile(file: string | Blob, config?: types.UploadFileConfig): Promise<types.File>;
    /**
     * Uploads a file to a given file search store asynchronously using Gemini API only, this is not supported
     * in Vertex AI.
     *
     * @param fileSearchStoreName The name of the file search store to upload the file to.
     * @param file The string path to the file to be uploaded or a Blob object.
     * @param config Optional parameters specified in the `UploadFileConfig`
     *     interface. @see {@link UploadFileConfig}
     * @return A promise that resolves to a `File` object.
     * @throws An error if called on a Vertex AI client.
     * @throws An error if the `mimeType` is not provided and can not be inferred,
     */
    uploadFileToFileSearchStore(fileSearchStoreName: string, file: string | Blob, config?: types.UploadToFileSearchStoreConfig): Promise<types.UploadToFileSearchStoreOperation>;
    /**
     * Downloads a file asynchronously to the specified path.
     *
     * @params params - The parameters for the download request, see {@link
     * types.DownloadFileParameters}
     */
    downloadFile(params: types.DownloadFileParameters): Promise<void>;
    private fetchUploadUrl;
}

/**
 * Options for initializing the ApiClient. The ApiClient uses the parameters
 * for authentication purposes as well as to infer if SDK should send the
 * request to Vertex AI or Gemini API.
 */
export declare interface ApiClientInitOptions {
    /**
     * The object used for adding authentication headers to API requests.
     */
    auth: Auth;
    /**
     * The uploader to use for uploading files. This field is required for
     * creating a client, will be set through the Node_client or Web_client.
     */
    uploader: Uploader;
    /**
     * Optional. The downloader to use for downloading files. This field is
     * required for creating a client, will be set through the Node_client or
     * Web_client.
     */
    downloader: Downloader;
    /**
     * Optional. The Google Cloud project ID for Vertex AI users.
     * It is not the numeric project name.
     * If not provided, SDK will try to resolve it from runtime environment.
     */
    project?: string;
    /**
     * Optional. The Google Cloud project location for Vertex AI users.
     * If not provided, SDK will try to resolve it from runtime environment.
     */
    location?: string;
    /**
     * The API Key. This is required for Gemini API users.
     */
    apiKey?: string;
    /**
     * Optional. Set to true if you intend to call Vertex AI endpoints.
     * If unset, default SDK behavior is to call Gemini API.
     */
    vertexai?: boolean;
    /**
     * Optional. The API version for the endpoint.
     * If unset, SDK will choose a default api version.
     */
    apiVersion?: string;
    /**
     * Optional. A set of customizable configuration for HTTP requests.
     */
    httpOptions?: types.HttpOptions;
    /**
     * Optional. An extra string to append at the end of the User-Agent header.
     *
     * This can be used to e.g specify the runtime and its version.
     */
    userAgentExtra?: string;
}

/** Config for authentication with API key. This data type is not supported in Gemini API. */
declare interface ApiKeyConfig {
    /** Optional. The name of the SecretManager secret version resource storing the API key. Format: `projects/{project}/secrets/{secrete}/versions/{version}` - If both `api_key_secret` and `api_key_string` are specified, this field takes precedence over `api_key_string`. - If specified, the `secretmanager.versions.access` permission should be granted to Vertex AI Extension Service Agent (https://cloud.google.com/vertex-ai/docs/general/access-control#service-agents) on the specified resource. */
    apiKeySecret?: string;
    /** Optional. The API key to be used in the request directly. */
    apiKeyString?: string;
    /** Optional. The location of the API key. */
    httpElementLocation?: HttpElementLocation;
    /** Optional. The parameter name of the API key. E.g. If the API request is "https://example.com/act?api_key=", "api_key" would be the parameter name. */
    name?: string;
}

/** The API spec that the external API implements. This enum is not supported in Gemini API. */
declare enum ApiSpec {
    /**
     * Unspecified API spec. This value should not be used.
     */
    API_SPEC_UNSPECIFIED = "API_SPEC_UNSPECIFIED",
    /**
     * Simple search API spec.
     */
    SIMPLE_SEARCH = "SIMPLE_SEARCH",
    /**
     * Elastic search API spec.
     */
    ELASTIC_SEARCH = "ELASTIC_SEARCH"
}

/** Representation of an audio chunk. */
declare interface AudioChunk {
    /** Raw bytes of audio data.
     * @remarks Encoded as base64 string. */
    data?: string;
    /** MIME type of the audio chunk. */
    mimeType?: string;
    /** Prompts and config used for generating this audio chunk. */
    sourceMetadata?: LiveMusicSourceMetadata;
}

/** The audio transcription configuration in Setup. */
declare interface AudioTranscriptionConfig {
    /** The language codes of the audio. BCP-47 language code. If not set, the transcription will be in the language detected by the model. If set, the server will use the language code specified in the model config as a hint for the language of the audio
     */
    languageCodes?: string[];
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The Auth interface is used to authenticate with the API service.
 */
export declare interface Auth {
    /**
     * Sets the headers needed to authenticate with the API service.
     *
     * @param headers - The Headers object that will be updated with the authentication headers.
     * @param url - The URL of the request.
     */
    addAuthHeaders(headers: Headers, url?: string): Promise<void>;
}

/** The authentication config to access the API. */
declare interface AuthConfig {
    /** The authentication config to access the API. Only API key is supported. This field is not supported in Gemini API. */
    apiKey?: string;
    /** Config for API key auth. */
    apiKeyConfig?: ApiKeyConfig;
    /** Type of auth scheme. */
    authType?: AuthType;
    /** Config for Google Service Account auth. */
    googleServiceAccountConfig?: AuthConfigGoogleServiceAccountConfig;
    /** Config for HTTP Basic auth. */
    httpBasicAuthConfig?: AuthConfigHttpBasicAuthConfig;
    /** Config for user oauth. */
    oauthConfig?: AuthConfigOauthConfig;
    /** Config for user OIDC auth. */
    oidcConfig?: AuthConfigOidcConfig;
}

/** Config for Google Service Account Authentication. This data type is not supported in Gemini API. */
declare interface AuthConfigGoogleServiceAccountConfig {
    /** Optional. The service account that the extension execution service runs as. - If the service account is specified, the `iam.serviceAccounts.getAccessToken` permission should be granted to Vertex AI Extension Service Agent (https://cloud.google.com/vertex-ai/docs/general/access-control#service-agents) on the specified service account. - If not specified, the Vertex AI Extension Service Agent will be used to execute the Extension. */
    serviceAccount?: string;
}

/** Config for HTTP Basic Authentication. This data type is not supported in Gemini API. */
declare interface AuthConfigHttpBasicAuthConfig {
    /** Required. The name of the SecretManager secret version resource storing the base64 encoded credentials. Format: `projects/{project}/secrets/{secrete}/versions/{version}` - If specified, the `secretmanager.versions.access` permission should be granted to Vertex AI Extension Service Agent (https://cloud.google.com/vertex-ai/docs/general/access-control#service-agents) on the specified resource. */
    credentialSecret?: string;
}

/** Config for user oauth. This data type is not supported in Gemini API. */
declare interface AuthConfigOauthConfig {
    /** Access token for extension endpoint. Only used to propagate token from [[ExecuteExtensionRequest.runtime_auth_config]] at request time. */
    accessToken?: string;
    /** The service account used to generate access tokens for executing the Extension. - If the service account is specified, the `iam.serviceAccounts.getAccessToken` permission should be granted to Vertex AI Extension Service Agent (https://cloud.google.com/vertex-ai/docs/general/access-control#service-agents) on the provided service account. */
    serviceAccount?: string;
}

/** Config for user OIDC auth. This data type is not supported in Gemini API. */
declare interface AuthConfigOidcConfig {
    /** OpenID Connect formatted ID token for extension endpoint. Only used to propagate token from [[ExecuteExtensionRequest.runtime_auth_config]] at request time. */
    idToken?: string;
    /** The service account used to generate an OpenID Connect (OIDC)-compatible JWT token signed by the Google OIDC Provider (accounts.google.com) for extension endpoint (https://cloud.google.com/iam/docs/create-short-lived-credentials-direct#sa-credentials-oidc). - The audience for the token will be set to the URL in the server url defined in the OpenApi spec. - If the service account is provided, the service account should grant `iam.serviceAccounts.getOpenIdToken` permission to Vertex AI Extension Service Agent (https://cloud.google.com/vertex-ai/docs/general/access-control#service-agents). */
    serviceAccount?: string;
}

/** Config for auth_tokens.create parameters. */
declare interface AuthToken {
    /** The name of the auth token. */
    name?: string;
}

/** Type of auth scheme. This enum is not supported in Gemini API. */
declare enum AuthType {
    AUTH_TYPE_UNSPECIFIED = "AUTH_TYPE_UNSPECIFIED",
    /**
     * No Auth.
     */
    NO_AUTH = "NO_AUTH",
    /**
     * API Key Auth.
     */
    API_KEY_AUTH = "API_KEY_AUTH",
    /**
     * HTTP Basic Auth.
     */
    HTTP_BASIC_AUTH = "HTTP_BASIC_AUTH",
    /**
     * Google Service Account Auth.
     */
    GOOGLE_SERVICE_ACCOUNT_AUTH = "GOOGLE_SERVICE_ACCOUNT_AUTH",
    /**
     * OAuth auth.
     */
    OAUTH = "OAUTH",
    /**
     * OpenID Connect (OIDC) Auth.
     */
    OIDC_AUTH = "OIDC_AUTH"
}

/** Configures automatic detection of activity. */
declare interface AutomaticActivityDetection {
    /** If enabled, detected voice and text input count as activity. If disabled, the client must send activity signals. */
    disabled?: boolean;
    /** Determines how likely speech is to be detected. */
    startOfSpeechSensitivity?: StartSensitivity;
    /** Determines how likely detected speech is ended. */
    endOfSpeechSensitivity?: EndSensitivity;
    /** The required duration of detected speech before start-of-speech is committed. The lower this value the more sensitive the start-of-speech detection is and the shorter speech can be recognized. However, this also increases the probability of false positives. */
    prefixPaddingMs?: number;
    /** The required duration of detected non-speech (e.g. silence) before end-of-speech is committed. The larger this value, the longer speech gaps can be without interrupting the user's activity but this will increase the model's latency. */
    silenceDurationMs?: number;
}

/** The configuration for automatic function calling. */
declare interface AutomaticFunctionCallingConfig {
    /** Whether to disable automatic function calling.
     If not set or set to False, will enable automatic function calling.
     If set to True, will disable automatic function calling.
     */
    disable?: boolean;
    /** If automatic function calling is enabled,
     maximum number of remote calls for automatic function calling.
     This number should be a positive integer.
     If not set, SDK will set maximum number of remote calls to 10.
     */
    maximumRemoteCalls?: number;
    /** If automatic function calling is enabled,
     whether to ignore call history to the response.
     If not set, SDK will set ignore_call_history to false,
     and will append the call history to
     GenerateContentResponse.automatic_function_calling_history.
     */
    ignoreCallHistory?: boolean;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export declare class BaseModule {
}

/** Config for batches.create return value. */
declare interface BatchJob {
    /** The resource name of the BatchJob. Output only.".
     */
    name?: string;
    /** The display name of the BatchJob.
     */
    displayName?: string;
    /** The state of the BatchJob.
     */
    state?: JobState;
    /** Output only. Only populated when the job's state is JOB_STATE_FAILED or JOB_STATE_CANCELLED. */
    error?: JobError;
    /** The time when the BatchJob was created.
     */
    createTime?: string;
    /** Output only. Time when the Job for the first time entered the `JOB_STATE_RUNNING` state. */
    startTime?: string;
    /** The time when the BatchJob was completed. This field is for Vertex AI only.
     */
    endTime?: string;
    /** The time when the BatchJob was last updated.
     */
    updateTime?: string;
    /** The name of the model that produces the predictions via the BatchJob.
     */
    model?: string;
    /** Configuration for the input data. This field is for Vertex AI only.
     */
    src?: BatchJobSource;
    /** Configuration for the output data.
     */
    dest?: BatchJobDestination;
    /** Statistics on completed and failed prediction instances. This field is for Vertex AI only.
     */
    completionStats?: CompletionStats;
}

/** Config for `des` parameter. */
declare interface BatchJobDestination {
    /** Storage format of the output files. Must be one of:
     'jsonl', 'bigquery'.
     */
    format?: string;
    /** The Google Cloud Storage URI to the output file.
     */
    gcsUri?: string;
    /** The BigQuery URI to the output table.
     */
    bigqueryUri?: string;
    /** The Gemini Developer API's file resource name of the output data
     (e.g. "files/12345"). The file will be a JSONL file with a single response
     per line. The responses will be GenerateContentResponse messages formatted
     as JSON. The responses will be written in the same order as the input
     requests.
     */
    fileName?: string;
    /** The responses to the requests in the batch. Returned when the batch was
     built using inlined requests. The responses will be in the same order as
     the input requests.
     */
    inlinedResponses?: InlinedResponse[];
    /** The responses to the requests in the batch. Returned when the batch was
     built using inlined requests. The responses will be in the same order as
     the input requests.
     */
    inlinedEmbedContentResponses?: InlinedEmbedContentResponse[];
}

declare type BatchJobDestinationUnion = BatchJobDestination | string;

/** Config for `src` parameter. */
declare interface BatchJobSource {
    /** Storage format of the input files. Must be one of:
     'jsonl', 'bigquery'.
     */
    format?: string;
    /** The Google Cloud Storage URIs to input files.
     */
    gcsUri?: string[];
    /** The BigQuery URI to input table.
     */
    bigqueryUri?: string;
    /** The Gemini Developer API's file resource name of the input data
     (e.g. "files/12345").
     */
    fileName?: string;
    /** The Gemini Developer API's inlined input data to run batch job.
     */
    inlinedRequests?: InlinedRequest[];
}

declare type BatchJobSourceUnion = BatchJobSource | InlinedRequest[] | string;

/** Specifies the function Behavior. Currently only supported by the BidiGenerateContent method. This enum is not supported in Vertex AI. */
declare enum Behavior {
    /**
     * This value is unused.
     */
    UNSPECIFIED = "UNSPECIFIED",
    /**
     * If set, the system will wait to receive the function response before continuing the conversation.
     */
    BLOCKING = "BLOCKING",
    /**
     * If set, the system will not wait to receive the function response. Instead, it will attempt to handle function responses as they become available while maintaining the conversation between the user and the model.
     */
    NON_BLOCKING = "NON_BLOCKING"
}

/** The BigQuery location for the input content. This data type is not supported in Gemini API. */
declare interface BigQuerySource {
    /** Required. BigQuery URI to a table, up to 2000 characters long. Accepted forms: * BigQuery path. For example: `bq://projectId.bqDatasetId.bqTableId`. */
    inputUri?: string;
}

/** Bleu metric value for an instance. This data type is not supported in Gemini API. */
declare interface BleuMetricValue {
    /** Output only. Bleu score. */
    score?: number;
}

/** A content blob. A Blob contains data of a specific media type. It is used to represent images, audio, and video. */
declare interface Blob_2 {
    /** Required. The raw bytes of the data.
     * @remarks Encoded as base64 string. */
    data?: string;
    /** Optional. The display name of the blob. Used to provide a label or filename to distinguish blobs. This field is only returned in `PromptMessage` for prompt management. It is used in the Gemini calls only when server-side tools (`code_execution`, `google_search`, and `url_context`) are enabled. This field is not supported in Gemini API. */
    displayName?: string;
    /** Required. The IANA standard MIME type of the source data. */
    mimeType?: string;
}

declare type BlobImageUnion = Blob_2;

/** Output only. The reason why the prompt was blocked. */
declare enum BlockedReason {
    /**
     * The blocked reason is unspecified.
     */
    BLOCKED_REASON_UNSPECIFIED = "BLOCKED_REASON_UNSPECIFIED",
    /**
     * The prompt was blocked for safety reasons.
     */
    SAFETY = "SAFETY",
    /**
     * The prompt was blocked for other reasons. For example, it may be due to the prompt's language, or because it contains other harmful content.
     */
    OTHER = "OTHER",
    /**
     * The prompt was blocked because it contains a term from the terminology blocklist.
     */
    BLOCKLIST = "BLOCKLIST",
    /**
     * The prompt was blocked because it contains prohibited content.
     */
    PROHIBITED_CONTENT = "PROHIBITED_CONTENT",
    /**
     * The prompt was blocked because it contains content that is unsafe for image generation.
     */
    IMAGE_SAFETY = "IMAGE_SAFETY",
    /**
     * The prompt was blocked by Model Armor. This enum value is not supported in Gemini API.
     */
    MODEL_ARMOR = "MODEL_ARMOR",
    /**
     * The prompt was blocked as a jailbreak attempt. This enum value is not supported in Gemini API.
     */
    JAILBREAK = "JAILBREAK"
}

/** A resource used in LLM queries for users to explicitly specify what to cache. */
declare interface CachedContent {
    /** The server-generated resource name of the cached content. */
    name?: string;
    /** The user-generated meaningful display name of the cached content. */
    displayName?: string;
    /** The name of the publisher model to use for cached content. */
    model?: string;
    /** Creation time of the cache entry. */
    createTime?: string;
    /** When the cache entry was last updated in UTC time. */
    updateTime?: string;
    /** Expiration time of the cached content. */
    expireTime?: string;
    /** Metadata on the usage of the cached content. */
    usageMetadata?: CachedContentUsageMetadata;
}

/** Metadata on the usage of the cached content. */
declare interface CachedContentUsageMetadata {
    /** Duration of audio in seconds. This field is not supported in Gemini API. */
    audioDurationSeconds?: number;
    /** Number of images. This field is not supported in Gemini API. */
    imageCount?: number;
    /** Number of text characters. This field is not supported in Gemini API. */
    textCount?: number;
    /** Total number of tokens that the cached content consumes. */
    totalTokenCount?: number;
    /** Duration of video in seconds. This field is not supported in Gemini API. */
    videoDurationSeconds?: number;
}

/**
 * CallableTool is an invokable tool that can be executed with external
 * application (e.g., via Model Context Protocol) or local functions with
 * function calling.
 */
declare interface CallableTool {
    /**
     * Returns tool that can be called by Gemini.
     */
    tool(): Promise<Tool>;
    /**
     * Executes the callable tool with the given function call arguments and
     * returns the response parts from the tool execution.
     */
    callTool(functionCalls: FunctionCall[]): Promise<Part[]>;
}

/**
 * CallableToolConfig is the configuration for a callable tool.
 */
declare interface CallableToolConfig {
    /**
     * Specifies the model's behavior after invoking this tool.
     */
    behavior?: Behavior;
    /**
     * Timeout for remote calls in milliseconds. Note this timeout applies only to
     * tool remote calls, and not making HTTP requests to the API. */
    timeout?: number;
}

/** Optional parameters. */
declare interface CancelBatchJobConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Config for batches.cancel parameters. */
declare interface CancelBatchJobParameters {
    /** A fully-qualified BatchJob resource name or ID.
     Example: "projects/.../locations/.../batchPredictionJobs/456"
     or "456" when project and location are initialized in the client.
     */
    name: string;
    /** Optional parameters for the request. */
    config?: CancelBatchJobConfig;
}

/** Optional parameters for tunings.cancel method. */
declare interface CancelTuningJobConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters for the cancel method. */
declare interface CancelTuningJobParameters {
    /** The resource name of the tuning job. */
    name: string;
    /** Optional parameters for the request. */
    config?: CancelTuningJobConfig;
}

/** Empty response for tunings.cancel method. */
declare class CancelTuningJobResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
}

/** A response candidate generated from the model. */
declare interface Candidate {
    /** Contains the multi-part content of the response.
     */
    content?: Content;
    /** Source attribution of the generated content.
     */
    citationMetadata?: CitationMetadata;
    /** Describes the reason the model stopped generating tokens.
     */
    finishMessage?: string;
    /** Number of tokens for this candidate.
     */
    tokenCount?: number;
    /** The reason why the model stopped generating tokens.
     If empty, the model has not stopped generating the tokens.
     */
    finishReason?: FinishReason;
    /** Output only. Metadata returned when grounding is enabled. It
     contains the sources used to ground the generated content.
     */
    groundingMetadata?: GroundingMetadata;
    /** Output only. The average log probability of the tokens in this candidate. This is a length-normalized score that can be used to compare the quality of candidates of different lengths. A higher average log probability suggests a more confident and coherent response. */
    avgLogprobs?: number;
    /** Output only. The 0-based index of this candidate in the list of generated responses. This is useful for distinguishing between multiple candidates when `candidate_count` > 1. */
    index?: number;
    /** Output only. The detailed log probability information for the tokens in this candidate. This is useful for debugging, understanding model uncertainty, and identifying potential "hallucinations". */
    logprobsResult?: LogprobsResult;
    /** Output only. A list of ratings for the safety of a response candidate. There is at most one rating per category. */
    safetyRatings?: SafetyRating[];
    /** Output only. Metadata returned when the model uses the `url_context` tool to get information from a user-provided URL. */
    urlContextMetadata?: UrlContextMetadata;
}

/** Describes the machine learning model version checkpoint. */
declare interface Checkpoint {
    /** The ID of the checkpoint.
     */
    checkpointId?: string;
    /** The epoch of the checkpoint.
     */
    epoch?: string;
    /** The step of the checkpoint.
     */
    step?: string;
}

/** Config for telling the service how to chunk the file. */
declare interface ChunkingConfig {
    /** White space chunking configuration. */
    whiteSpaceConfig?: WhiteSpaceConfig;
}

/** A citation for a piece of generatedcontent. This data type is not supported in Gemini API. */
declare interface Citation {
    /** Output only. The end index of the citation in the content. */
    endIndex?: number;
    /** Output only. The license of the source of the citation. */
    license?: string;
    /** Output only. The publication date of the source of the citation. */
    publicationDate?: GoogleTypeDate;
    /** Output only. The start index of the citation in the content. */
    startIndex?: number;
    /** Output only. The title of the source of the citation. */
    title?: string;
    /** Output only. The URI of the source of the citation. */
    uri?: string;
}

/** Citation information when the model quotes another source. */
declare interface CitationMetadata {
    /** Contains citation information when the model directly quotes, at
     length, from another source. Can include traditional websites and code
     repositories.
     */
    citations?: Citation[];
}

/** Result of executing the `ExecutableCode`.

 Generated only when the `CodeExecution` tool is used. */
declare interface CodeExecutionResult {
    /** Required. Outcome of the code execution. */
    outcome?: Outcome;
    /** Optional. Contains stdout when code execution is successful, stderr or other description otherwise. */
    output?: string;
    /** The identifier of the `ExecutableCode` part this result is for. Only populated if the corresponding `ExecutableCode` has an id. */
    id?: string;
}

/** Success and error statistics of processing multiple entities (for example, DataItems or structured data rows) in batch. This data type is not supported in Gemini API. */
declare interface CompletionStats {
    /** Output only. The number of entities for which any error was encountered. */
    failedCount?: string;
    /** Output only. In cases when enough errors are encountered a job, pipeline, or operation may be failed as a whole. Below is the number of entities for which the processing had not been finished (either in successful or failed state). Set to -1 if the number is unknown (for example, the operation failed before the total entity number could be collected). */
    incompleteCount?: string;
    /** Output only. The number of entities that had been processed successfully. */
    successfulCount?: string;
    /** Output only. The number of the successful forecast points that are generated by the forecasting model. This is ONLY used by the forecasting batch prediction. */
    successfulForecastPointCount?: string;
}

/** Tool to support computer use. */
declare interface ComputerUse {
    /** Required. The environment being operated. */
    environment?: Environment;
    /** By default, predefined functions are included in the final model call.
     Some of them can be explicitly excluded from being automatically included.
     This can serve two purposes:
     1. Using a more restricted / different action space.
     2. Improving the definitions / instructions of predefined functions. */
    excludedPredefinedFunctions?: string[];
}

/** Optional parameters for computing tokens. */
declare interface ComputeTokensConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters for computing tokens. */
declare interface ComputeTokensParameters {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** Input content. */
    contents: ContentListUnion;
    /** Optional parameters for the request.
     */
    config?: ComputeTokensConfig;
}

/** Response for computing tokens. */
declare class ComputeTokensResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** Lists of tokens info from the input. A ComputeTokensRequest could have multiple instances with a prompt in each instance. We also need to return lists of tokens info for the request with multiple instances. */
    tokensInfo?: TokensInfo[];
}

/** Local tokenizer compute tokens result. */
declare interface ComputeTokensResult {
    /** Lists of tokens info from the input. */
    tokensInfo?: TokensInfo[];
}

/** Contains the multi-part content of a message. */
declare interface Content {
    /** List of parts that constitute a single message. Each part may have
     a different IANA MIME type. */
    parts?: Part[];
    /** Optional. The producer of the content. Must be either 'user' or 'model'. If not set, the service will default to 'user'. */
    role?: string;
}

/** The embedding generated from an input content. */
declare interface ContentEmbedding {
    /** A list of floats representing an embedding.
     */
    values?: number[];
    /** Vertex API only. Statistics of the input text associated with this
     embedding.
     */
    statistics?: ContentEmbeddingStatistics;
}

/** Statistics of the input text associated with the result of content embedding. */
declare interface ContentEmbeddingStatistics {
    /** Vertex API only. If the input text was truncated due to having
     a length longer than the allowed maximum input.
     */
    truncated?: boolean;
    /** Vertex API only. Number of tokens of the input text.
     */
    tokenCount?: number;
}

declare type ContentListUnion = Content | Content[] | PartUnion | PartUnion[];

/** A content reference image.

 A content reference image represents a subject to reference (ex. person,
 product, animal) provided by the user. It can optionally be provided in
 addition to a style reference image (ex. background, style reference). */
declare class ContentReferenceImage {
    /** The reference image for the editing operation. */
    referenceImage?: Image_2;
    /** The id of the reference image. */
    referenceId?: number;
    /** The type of the reference image. Only set by the SDK. */
    referenceType?: string;
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI(): ReferenceImageAPIInternal;
}

declare type ContentUnion = Content | PartUnion[] | PartUnion;

/** Enables context window compression -- mechanism managing model context window so it does not exceed given length. */
declare interface ContextWindowCompressionConfig {
    /** Number of tokens (before running turn) that triggers context window compression mechanism. */
    triggerTokens?: string;
    /** Sliding window compression mechanism. */
    slidingWindow?: SlidingWindow;
}

/** Configuration for a Control reference image. */
declare interface ControlReferenceConfig {
    /** The type of control reference image to use. */
    controlType?: ControlReferenceType;
    /** Defaults to False. When set to True, the control image will be
     computed by the model based on the control type. When set to False,
     the control image must be provided by the user. */
    enableControlImageComputation?: boolean;
}

/** A control reference image.

 The image of the control reference image is either a control image provided
 by the user, or a regular image which the backend will use to generate a
 control image of. In the case of the latter, the
 enable_control_image_computation field in the config should be set to True.

 A control image is an image that represents a sketch image of areas for the
 model to fill in based on the prompt. */
declare class ControlReferenceImage {
    /** The reference image for the editing operation. */
    referenceImage?: Image_2;
    /** The id of the reference image. */
    referenceId?: number;
    /** The type of the reference image. Only set by the SDK. */
    referenceType?: string;
    /** Configuration for the control reference image. */
    config?: ControlReferenceConfig;
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI(): ReferenceImageAPIInternal;
}

/** Enum representing the control type of a control reference image. */
declare enum ControlReferenceType {
    CONTROL_TYPE_DEFAULT = "CONTROL_TYPE_DEFAULT",
    CONTROL_TYPE_CANNY = "CONTROL_TYPE_CANNY",
    CONTROL_TYPE_SCRIBBLE = "CONTROL_TYPE_SCRIBBLE",
    CONTROL_TYPE_FACE_MESH = "CONTROL_TYPE_FACE_MESH"
}

/** Config for the count_tokens method. */
declare interface CountTokensConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** Instructions for the model to steer it toward better performance.
     */
    systemInstruction?: ContentUnion;
    /** Code that enables the system to interact with external systems to
     perform an action outside of the knowledge and scope of the model.
     */
    tools?: Tool[];
    /** Configuration that the model uses to generate the response. Not
     supported by the Gemini Developer API.
     */
    generationConfig?: GenerationConfig;
}

/** Parameters for counting tokens. */
declare interface CountTokensParameters {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** Input content. */
    contents: ContentListUnion;
    /** Configuration for counting tokens. */
    config?: CountTokensConfig;
}

/** Response for counting tokens. */
declare class CountTokensResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** Total number of tokens. */
    totalTokens?: number;
    /** Number of tokens in the cached part of the prompt (the cached content). */
    cachedContentTokenCount?: number;
}

/** Local tokenizer count tokens result. */
declare interface CountTokensResult {
    /** The total number of tokens. */
    totalTokens?: number;
}

/** Optional parameters. */
declare interface CreateAuthTokenConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** An optional time after which, when using the resulting token,
     messages in Live API sessions will be rejected. (Gemini may
     preemptively close the session after this time.)

     If not set then this defaults to 30 minutes in the future. If set, this
     value must be less than 20 hours in the future. */
    expireTime?: string;
    /** The time after which new Live API sessions using the token
     resulting from this request will be rejected.

     If not set this defaults to 60 seconds in the future. If set, this value
     must be less than 20 hours in the future. */
    newSessionExpireTime?: string;
    /** The number of times the token can be used. If this value is zero
     then no limit is applied. Default is 1. Resuming a Live API session does
     not count as a use. */
    uses?: number;
    /** Configuration specific to Live API connections created using this token. */
    liveConnectConstraints?: LiveConnectConstraints;
    /** Additional fields to lock in the effective LiveConnectParameters. */
    lockAdditionalFields?: string[];
}

/** Config for auth_tokens.create parameters. */
declare interface CreateAuthTokenParameters {
    /** Optional parameters for the request. */
    config?: CreateAuthTokenConfig;
}

/** Config for optional parameters. */
declare interface CreateBatchJobConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** The user-defined name of this BatchJob.
     */
    displayName?: string;
    /** GCS or BigQuery URI prefix for the output predictions. Example:
     "gs://path/to/output/data" or "bq://projectId.bqDatasetId.bqTableId".
     */
    dest?: BatchJobDestinationUnion;
}

/** Config for batches.create parameters. */
declare interface CreateBatchJobParameters {
    /** The name of the model to produces the predictions via the BatchJob.
     */
    model?: string;
    /** GCS URI(-s) or BigQuery URI to your input data to run batch job.
     Example: "gs://path/to/input/data" or "bq://projectId.bqDatasetId.bqTableId".
     */
    src: BatchJobSourceUnion;
    /** Optional parameters for creating a BatchJob.
     */
    config?: CreateBatchJobConfig;
}

/** Optional configuration for cached content creation. */
declare interface CreateCachedContentConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** The TTL for this resource. The expiration time is computed: now + TTL. It is a duration string, with up to nine fractional digits, terminated by 's'. Example: "3.5s". */
    ttl?: string;
    /** Timestamp of when this resource is considered expired. Uses RFC 3339 format, Example: 2014-10-02T15:01:23Z. */
    expireTime?: string;
    /** The user-generated meaningful display name of the cached content.
     */
    displayName?: string;
    /** The content to cache.
     */
    contents?: ContentListUnion;
    /** Developer set system instruction.
     */
    systemInstruction?: ContentUnion;
    /** A list of `Tools` the model may use to generate the next response.
     */
    tools?: Tool[];
    /** Configuration for the tools to use. This config is shared for all tools.
     */
    toolConfig?: ToolConfig;
    /** The Cloud KMS resource identifier of the customer managed
     encryption key used to protect a resource.
     The key needs to be in the same region as where the compute resource is
     created. See
     https://cloud.google.com/vertex-ai/docs/general/cmek for more
     details. If this is set, then all created CachedContent objects
     will be encrypted with the provided encryption key.
     Allowed formats: projects/{project}/locations/{location}/keyRings/{key_ring}/cryptoKeys/{crypto_key}
     */
    kmsKeyName?: string;
}

/** Parameters for caches.create method. */
declare interface CreateCachedContentParameters {
    /** ID of the model to use. Example: gemini-2.0-flash */
    model: string;
    /** Configuration that contains optional parameters.
     */
    config?: CreateCachedContentConfig;
}

/** Parameters for initializing a new chat session.

 These parameters are used when creating a chat session with the
 `chats.create()` method. */
declare interface CreateChatParameters {
    /** The name of the model to use for the chat session.

     For example: 'gemini-2.0-flash', 'gemini-2.0-flash-lite', etc. See Gemini API
     docs to find the available models.
     */
    model: string;
    /** Config for the entire chat session.

     This config applies to all requests within the session
     unless overridden by a per-request `config` in `SendMessageParameters`.
     */
    config?: GenerateContentConfig;
    /** The initial conversation history for the chat session.

     This allows you to start the chat with a pre-existing history. The history
     must be a list of `Content` alternating between 'user' and 'model' roles.
     It should start with a 'user' message.
     */
    history?: Content[];
}

/** Config for optional parameters. */
declare interface CreateEmbeddingsBatchJobConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** The user-defined name of this BatchJob.
     */
    displayName?: string;
}

/** Config for batches.create parameters. */
declare interface CreateEmbeddingsBatchJobParameters {
    /** The name of the model to produces the predictions via the BatchJob.
     */
    model?: string;
    /** input data to run batch job".
     */
    src: EmbeddingsBatchJobSource;
    /** Optional parameters for creating a BatchJob.
     */
    config?: CreateEmbeddingsBatchJobConfig;
}

/** Used to override the default configuration. */
declare interface CreateFileConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Generates the parameters for the private _create method. */
declare interface CreateFileParameters {
    /** The file to be uploaded.
     mime_type: (Required) The MIME type of the file. Must be provided.
     name: (Optional) The name of the file in the destination (e.g.
     'files/sample-image').
     display_name: (Optional) The display name of the file.
     */
    file: File_2;
    /** Used to override the default configuration. */
    config?: CreateFileConfig;
}

/** Response for the create file method. */
declare class CreateFileResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
}

/** Optional parameters for creating a file search store. */
declare interface CreateFileSearchStoreConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** The human-readable display name for the file search store.
     */
    displayName?: string;
}

/** Config for file_search_stores.create parameters. */
declare interface CreateFileSearchStoreParameters {
    /** Optional parameters for creating a file search store.
     */
    config?: CreateFileSearchStoreConfig;
}

/**
 * Creates a `FunctionResponsePart` object from a `base64` encoded `string`.
 */
declare function createFunctionResponsePartFromBase64(data: string, mimeType: string): FunctionResponsePart;

/**
 * Creates a `FunctionResponsePart` object from a `URI` string.
 */
declare function createFunctionResponsePartFromUri(uri: string, mimeType: string): FunctionResponsePart;

/**
 * Creates a `Content` object with a model role from a `PartListUnion` object or `string`.
 */
declare function createModelContent(partOrString: PartListUnion | string): Content;

/**
 * Creates a `Part` object from a `base64` encoded `string`.
 */
declare function createPartFromBase64(data: string, mimeType: string, mediaResolution?: PartMediaResolutionLevel): Part;

/**
 * Creates a `Part` object from the `outcome` and `output` of a `CodeExecutionResult` object.
 */
declare function createPartFromCodeExecutionResult(outcome: Outcome, output: string): Part;

/**
 * Creates a `Part` object from the `code` and `language` of an `ExecutableCode` object.
 */
declare function createPartFromExecutableCode(code: string, language: Language): Part;

/**
 * Creates a `Part` object from a `FunctionCall` object.
 */
declare function createPartFromFunctionCall(name: string, args: Record<string, unknown>): Part;

/**
 * Creates a `Part` object from a `FunctionResponse` object.
 */
declare function createPartFromFunctionResponse(id: string, name: string, response: Record<string, unknown>, parts?: FunctionResponsePart[]): Part;

/**
 * Creates a `Part` object from a `text` string.
 */
declare function createPartFromText(text: string): Part;

/**
 * Creates a `Part` object from a `URI` string.
 */
declare function createPartFromUri(uri: string, mimeType: string, mediaResolution?: PartMediaResolutionLevel): Part;

/** Fine-tuning job creation request - optional fields. */
declare interface CreateTuningJobConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** The method to use for tuning (SUPERVISED_FINE_TUNING or PREFERENCE_TUNING or DISTILLATION). If not set, the default method (SFT) will be used. */
    method?: TuningMethod;
    /** Validation dataset for tuning. The dataset must be formatted as a JSONL file. */
    validationDataset?: TuningValidationDataset;
    /** The display name of the tuned Model. The name can be up to 128 characters long and can consist of any UTF-8 characters. */
    tunedModelDisplayName?: string;
    /** The description of the TuningJob */
    description?: string;
    /** Number of complete passes the model makes over the entire training dataset during training. */
    epochCount?: number;
    /** Multiplier for adjusting the default learning rate. 1P models only. Mutually exclusive with learning_rate. */
    learningRateMultiplier?: number;
    /** If set to true, disable intermediate checkpoints and only the last checkpoint will be exported. Otherwise, enable intermediate checkpoints. */
    exportLastCheckpointOnly?: boolean;
    /** The optional checkpoint id of the pre-tuned model to use for tuning, if applicable. */
    preTunedModelCheckpointId?: string;
    /** Adapter size for tuning. */
    adapterSize?: AdapterSize;
    /** Tuning mode for tuning. */
    tuningMode?: TuningMode;
    /** Custom base model for tuning. This is only supported for OSS models in Vertex. */
    customBaseModel?: string;
    /** The batch size hyperparameter for tuning. This is only supported for OSS models in Vertex. */
    batchSize?: number;
    /** The learning rate for tuning. OSS models only. Mutually exclusive with learning_rate_multiplier. */
    learningRate?: number;
    /** Optional. The labels with user-defined metadata to organize TuningJob and generated resources such as Model and Endpoint. Label keys and values can be no longer than 64 characters (Unicode codepoints), can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. See https://goo.gl/xmQnxf for more information and examples of labels. */
    labels?: Record<string, string>;
    /** Weight for KL Divergence regularization, Preference Optimization tuning only. */
    beta?: number;
    /** The base teacher model that is being distilled. Distillation only. */
    baseTeacherModel?: string;
    /** The resource name of the Tuned teacher model. Distillation only. */
    tunedTeacherModelSource?: string;
    /** Multiplier for adjusting the weight of the SFT loss. Distillation only. */
    sftLossWeightMultiplier?: number;
    /** The Google Cloud Storage location where the tuning job outputs are written. */
    outputUri?: string;
    /** The encryption spec of the tuning job. Customer-managed encryption key options for a TuningJob. If this is set, then all resources created by the TuningJob will be encrypted with provided encryption key. */
    encryptionSpec?: EncryptionSpec;
}

/** Fine-tuning job creation parameters - optional fields. */
declare interface CreateTuningJobParameters {
    /** The base model that is being tuned, e.g., "gemini-2.5-flash". */
    baseModel: string;
    /** Cloud Storage path to file containing training dataset for tuning. The dataset must be formatted as a JSONL file. */
    trainingDataset: TuningDataset;
    /** Configuration for the tuning job. */
    config?: CreateTuningJobConfig;
}

/** Fine-tuning job creation parameters - optional fields. */
declare interface CreateTuningJobParametersPrivate {
    /** The base model that is being tuned, e.g., "gemini-2.5-flash". */
    baseModel?: string;
    /** The PreTunedModel that is being tuned. */
    preTunedModel?: PreTunedModel;
    /** Cloud Storage path to file containing training dataset for tuning. The dataset must be formatted as a JSONL file. */
    trainingDataset: TuningDataset;
    /** Configuration for the tuning job. */
    config?: CreateTuningJobConfig;
}

/**
 * Creates a `Content` object with a user role from a `PartListUnion` object or `string`.
 */
declare function createUserContent(partOrString: PartListUnion | string): Content;

/** Result for custom code execution metric. This data type is not supported in Gemini API. */
declare interface CustomCodeExecutionResult {
    /** Output only. Custom code execution score. */
    score?: number;
}

/** User provided metadata stored as key-value pairs. This data type is not supported in Vertex AI. */
declare interface CustomMetadata {
    /** Required. The key of the metadata to store. */
    key?: string;
    /** The numeric value of the metadata to store. */
    numericValue?: number;
    /** The StringList value of the metadata to store. */
    stringListValue?: StringList;
    /** The string value of the metadata to store. */
    stringValue?: string;
}

/** Spec for custom output. This data type is not supported in Gemini API. */
declare interface CustomOutput {
    /** Output only. List of raw output strings. */
    rawOutputs?: RawOutput;
}

/** Distribution computed over a tuning dataset. This data type is not supported in Gemini API. */
declare interface DatasetDistribution {
    /** Output only. Defines the histogram bucket. */
    buckets?: DatasetDistributionDistributionBucket[];
    /** Output only. The maximum of the population values. */
    max?: number;
    /** Output only. The arithmetic mean of the values in the population. */
    mean?: number;
    /** Output only. The median of the values in the population. */
    median?: number;
    /** Output only. The minimum of the population values. */
    min?: number;
    /** Output only. The 5th percentile of the values in the population. */
    p5?: number;
    /** Output only. The 95th percentile of the values in the population. */
    p95?: number;
    /** Output only. Sum of a given population of values. */
    sum?: number;
}

/** Dataset bucket used to create a histogram for the distribution given a population of values. This data type is not supported in Gemini API. */
declare interface DatasetDistributionDistributionBucket {
    /** Output only. Number of values in the bucket. */
    count?: string;
    /** Output only. Left bound of the bucket. */
    left?: number;
    /** Output only. Right bound of the bucket. */
    right?: number;
}

/** Statistics computed over a tuning dataset. This data type is not supported in Gemini API. */
declare interface DatasetStats {
    /** Output only. A partial sample of the indices (starting from 1) of the dropped examples. */
    droppedExampleIndices?: string[];
    /** Output only. For each index in `dropped_example_indices`, the user-facing reason why the example was dropped. */
    droppedExampleReasons?: string[];
    /** Output only. Number of billable characters in the tuning dataset. */
    totalBillableCharacterCount?: string;
    /** Output only. Number of tuning characters in the tuning dataset. */
    totalTuningCharacterCount?: string;
    /** Output only. Number of examples in the tuning dataset. */
    tuningDatasetExampleCount?: string;
    /** Output only. Number of tuning steps for this Tuning Job. */
    tuningStepCount?: string;
    /** Output only. Sample user messages in the training dataset uri. */
    userDatasetExamples?: Content[];
    /** Output only. Dataset distributions for the user input tokens. */
    userInputTokenDistribution?: DatasetDistribution;
    /** Output only. Dataset distributions for the messages per example. */
    userMessagePerExampleDistribution?: DatasetDistribution;
    /** Output only. Dataset distributions for the user output tokens. */
    userOutputTokenDistribution?: DatasetDistribution;
}

/** Optional parameters for models.get method. */
declare interface DeleteBatchJobConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Config for batches.delete parameters. */
declare interface DeleteBatchJobParameters {
    /** A fully-qualified BatchJob resource name or ID.
     Example: "projects/.../locations/.../batchPredictionJobs/456"
     or "456" when project and location are initialized in the client.
     */
    name: string;
    /** Optional parameters for the request. */
    config?: DeleteBatchJobConfig;
}

/** Optional parameters for caches.delete method. */
declare interface DeleteCachedContentConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters for caches.delete method. */
declare interface DeleteCachedContentParameters {
    /** The server-generated resource name of the cached content.
     */
    name: string;
    /** Optional parameters for the request.
     */
    config?: DeleteCachedContentConfig;
}

/** Empty response for caches.delete method. */
declare class DeleteCachedContentResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
}

/** Config for optional parameters. */
declare interface DeleteDocumentConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** If set to true, any `Chunk`s and objects related to this `Document` will
     also be deleted.
     */
    force?: boolean;
}

/** Config for documents.delete parameters. */
declare interface DeleteDocumentParameters {
    /** The resource name of the Document.
     Example: fileSearchStores/file-search-store-foo/documents/documents-bar */
    name: string;
    /** Optional parameters for the request. */
    config?: DeleteDocumentConfig;
}

/** Used to override the default configuration. */
declare interface DeleteFileConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Generates the parameters for the get method. */
declare interface DeleteFileParameters {
    /** The name identifier for the file to be deleted. */
    name: string;
    /** Used to override the default configuration. */
    config?: DeleteFileConfig;
}

/** Response for the delete file method. */
declare class DeleteFileResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
}

/** Optional parameters for deleting a FileSearchStore. */
declare interface DeleteFileSearchStoreConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** If set to true, any Documents and objects related to this FileSearchStore will also be deleted.
     If false (the default), a FAILED_PRECONDITION error will be returned if
     the FileSearchStore contains any Documents.
     */
    force?: boolean;
}

/** Config for file_search_stores.delete parameters. */
declare interface DeleteFileSearchStoreParameters {
    /** The resource name of the FileSearchStore. Example: `fileSearchStores/my-file-search-store-123` */
    name: string;
    /** Optional parameters for the request. */
    config?: DeleteFileSearchStoreConfig;
}

/** Configuration for deleting a tuned model. */
declare interface DeleteModelConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters for deleting a tuned model. */
declare interface DeleteModelParameters {
    model: string;
    /** Optional parameters for the request. */
    config?: DeleteModelConfig;
}

declare class DeleteModelResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
}

/** The return value of delete operation. */
declare interface DeleteResourceJob {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    name?: string;
    done?: boolean;
    error?: JobError;
}

/** Statistics for distillation prompt dataset. These statistics do not include the responses sampled from the teacher model. This data type is not supported in Gemini API. */
declare interface DistillationDataStats {
    /** Output only. Statistics computed for the training dataset. */
    trainingDatasetStats?: DatasetStats;
}

/** Hyperparameters for distillation. */
declare interface DistillationHyperParameters {
    /** Optional. Adapter size for distillation. */
    adapterSize?: AdapterSize;
    /** Optional. Number of complete passes the model makes over the entire training dataset during training. */
    epochCount?: string;
    /** Optional. Multiplier for adjusting the default learning rate. */
    learningRateMultiplier?: number;
    /** The batch size hyperparameter for tuning.
     This is only supported for OSS models in Vertex. */
    batchSize?: number;
    /** The learning rate for tuning. OSS models only. */
    learningRate?: number;
}

/** Spec for creating a distilled dataset in Vertex Dataset. This data type is not supported in Gemini API. */
declare interface DistillationSamplingSpec {
    /** Optional. The base teacher model that is being distilled. See [Supported models](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/tuning#supported_models). */
    baseTeacherModel?: string;
    /** Optional. The resource name of the Tuned teacher model. Format: `projects/{project}/locations/{location}/models/{model}`. */
    tunedTeacherModelSource?: string;
    /** Optional. Cloud Storage path to file containing validation dataset for distillation. The dataset must be formatted as a JSONL file. */
    validationDatasetUri?: string;
}

/** Distillation tuning spec for tuning. */
declare interface DistillationSpec {
    /** The GCS URI of the prompt dataset to use during distillation. */
    promptDatasetUri?: string;
    /** The base teacher model that is being distilled. See [Supported models](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/tuning#supported_models). */
    baseTeacherModel?: string;
    /** Optional. Hyperparameters for Distillation. */
    hyperParameters?: DistillationHyperParameters;
    /** Deprecated. A path in a Cloud Storage bucket, which will be treated as the root output directory of the distillation pipeline. It is used by the system to generate the paths of output artifacts. */
    pipelineRootDirectory?: string;
    /** The student model that is being tuned, e.g., "google/gemma-2b-1.1-it". Deprecated. Use base_model instead. */
    studentModel?: string;
    /** Deprecated. Cloud Storage path to file containing training dataset for tuning. The dataset must be formatted as a JSONL file. */
    trainingDatasetUri?: string;
    /** The resource name of the Tuned teacher model. Format: `projects/{project}/locations/{location}/models/{model}`. */
    tunedTeacherModelSource?: string;
    /** Optional. Cloud Storage path to file containing validation dataset for tuning. The dataset must be formatted as a JSONL file. */
    validationDatasetUri?: string;
    /** Tuning mode for tuning. */
    tuningMode?: TuningMode;
}

/** A Document is a collection of Chunks. */
declare interface Document_2 {
    /** Immutable. Identifier. The `Document` resource name. The ID (name excluding the "fileSearchStores/&#42;/documents/" prefix) can contain up to 40 characters that are lowercase alphanumeric or dashes (-). The ID cannot start or end with a dash. If the name is empty on create, a unique name will be derived from `display_name` along with a 12 character random suffix. Example: `fileSearchStores/{file_search_store_id}/documents/my-awesome-doc-123a456b789c` */
    name?: string;
    /** Optional. The human-readable display name for the `Document`. The display name must be no more than 512 characters in length, including spaces. Example: "Semantic Retriever Documentation". */
    displayName?: string;
    /** Output only. Current state of the `Document`. */
    state?: DocumentState;
    /** Output only. The size of raw bytes ingested into the Document. */
    sizeBytes?: string;
    /** Output only. The mime type of the Document. */
    mimeType?: string;
    /** Output only. The Timestamp of when the `Document` was created. */
    createTime?: string;
    /** Optional. User provided custom metadata stored as key-value pairs used for querying. A `Document` can have a maximum of 20 `CustomMetadata`. */
    customMetadata?: CustomMetadata[];
    /** Output only. The Timestamp of when the `Document` was last updated. */
    updateTime?: string;
}

/** Output only. Current state of the `Document`. This enum is not supported in Vertex AI. */
declare enum DocumentState {
    /**
     * The default value. This value is used if the state is omitted.
     */
    STATE_UNSPECIFIED = "STATE_UNSPECIFIED",
    /**
     * Some `Chunks` of the `Document` are being processed (embedding and vector storage).
     */
    STATE_PENDING = "STATE_PENDING",
    /**
     * All `Chunks` of the `Document` is processed and available for querying.
     */
    STATE_ACTIVE = "STATE_ACTIVE",
    /**
     * Some `Chunks` of the `Document` failed processing.
     */
    STATE_FAILED = "STATE_FAILED"
}

declare type DownloadableFileUnion = string | File_2 | GeneratedVideo | Video;

export declare interface Downloader {
    /**
     * Downloads a file to the given location.
     *
     * @param params The parameters for downloading the file.
     * @param apiClient The ApiClient to use for uploading.
     * @return A Promises that resolves when the download is complete.
     */
    download(params: DownloadFileParameters, apiClient: ApiClient): Promise<void>;
}

/** Used to override the default configuration. */
declare interface DownloadFileConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters used to download a file. */
declare interface DownloadFileParameters {
    /** The file to download. It can be a file name, a file object or a generated video. */
    file: DownloadableFileUnion;
    /** Location where the file should be downloaded to. */
    downloadPath: string;
    /** Configuration to for the download operation. */
    config?: DownloadFileConfig;
}

/** Describes the options to customize dynamic retrieval. */
declare interface DynamicRetrievalConfig {
    /** Optional. The threshold to be used in dynamic retrieval. If not set, a system default value is used. */
    dynamicThreshold?: number;
    /** The mode of the predictor to be used in dynamic retrieval. */
    mode?: DynamicRetrievalConfigMode;
}

/** The mode of the predictor to be used in dynamic retrieval. */
declare enum DynamicRetrievalConfigMode {
    /**
     * Always trigger retrieval.
     */
    MODE_UNSPECIFIED = "MODE_UNSPECIFIED",
    /**
     * Run retrieval only when system decides it is necessary.
     */
    MODE_DYNAMIC = "MODE_DYNAMIC"
}

/** Configuration for editing an image. */
declare interface EditImageConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** Cloud Storage URI used to store the generated images. */
    outputGcsUri?: string;
    /** Description of what to discourage in the generated images. */
    negativePrompt?: string;
    /** Number of images to generate. */
    numberOfImages?: number;
    /** Aspect ratio of the generated images. Supported values are
     "1:1", "3:4", "4:3", "9:16", and "16:9". */
    aspectRatio?: string;
    /** Controls how much the model adheres to the text prompt. Large
     values increase output and prompt alignment, but may compromise image
     quality. */
    guidanceScale?: number;
    /** Random seed for image generation. This is not available when
     ``add_watermark`` is set to true. */
    seed?: number;
    /** Filter level for safety filtering. */
    safetyFilterLevel?: SafetyFilterLevel;
    /** Allows generation of people by the model. */
    personGeneration?: PersonGeneration;
    /** Whether to report the safety scores of each generated image and
     the positive prompt in the response. */
    includeSafetyAttributes?: boolean;
    /** Whether to include the Responsible AI filter reason if the image
     is filtered out of the response. */
    includeRaiReason?: boolean;
    /** Language of the text in the prompt. */
    language?: ImagePromptLanguage;
    /** MIME type of the generated image. */
    outputMimeType?: string;
    /** Compression quality of the generated image (for ``image/jpeg``
     only). */
    outputCompressionQuality?: number;
    /** Whether to add a watermark to the generated images. */
    addWatermark?: boolean;
    /** User specified labels to track billing usage. */
    labels?: Record<string, string>;
    /** Describes the editing mode for the request. */
    editMode?: EditMode;
    /** The number of sampling steps. A higher value has better image
     quality, while a lower value has better latency. */
    baseSteps?: number;
}

/** Parameters for the request to edit an image. */
declare interface EditImageParameters {
    /** The model to use. */
    model: string;
    /** A text description of the edit to apply to the image. */
    prompt: string;
    /** The reference images for Imagen 3 editing. */
    referenceImages: ReferenceImage[];
    /** Configuration for editing. */
    config?: EditImageConfig;
}

/** Response for the request to edit an image. */
declare class EditImageResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** Generated images. */
    generatedImages?: GeneratedImage[];
}

/** Enum representing the editing mode. */
declare enum EditMode {
    EDIT_MODE_DEFAULT = "EDIT_MODE_DEFAULT",
    EDIT_MODE_INPAINT_REMOVAL = "EDIT_MODE_INPAINT_REMOVAL",
    EDIT_MODE_INPAINT_INSERTION = "EDIT_MODE_INPAINT_INSERTION",
    EDIT_MODE_OUTPAINT = "EDIT_MODE_OUTPAINT",
    EDIT_MODE_CONTROLLED_EDITING = "EDIT_MODE_CONTROLLED_EDITING",
    EDIT_MODE_STYLE = "EDIT_MODE_STYLE",
    EDIT_MODE_BGSWAP = "EDIT_MODE_BGSWAP",
    EDIT_MODE_PRODUCT_IMAGE = "EDIT_MODE_PRODUCT_IMAGE"
}

/** Parameters for the embed_content method. */
declare interface EmbedContentBatch {
    /** The content to embed. Only the `parts.text` fields will be counted.
     */
    contents?: ContentListUnion;
    /** Configuration that contains optional parameters.
     */
    config?: EmbedContentConfig;
}

/** Optional parameters for the embed_content method. */
declare interface EmbedContentConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** Type of task for which the embedding will be used.
     */
    taskType?: string;
    /** Title for the text. Only applicable when TaskType is
     `RETRIEVAL_DOCUMENT`.
     */
    title?: string;
    /** Reduced dimension for the output embedding. If set,
     excessive values in the output embedding are truncated from the end.
     Supported by newer models since 2024 only. You cannot set this value if
     using the earlier model (`models/embedding-001`).
     */
    outputDimensionality?: number;
    /** Vertex API only. The MIME type of the input.
     */
    mimeType?: string;
    /** Vertex API only. Whether to silently truncate inputs longer than
     the max sequence length. If this option is set to false, oversized inputs
     will lead to an INVALID_ARGUMENT error, similar to other text APIs.
     */
    autoTruncate?: boolean;
}

/** Request-level metadata for the Vertex Embed Content API. */
declare interface EmbedContentMetadata {
    /** Vertex API only. The total number of billable characters included
     in the request.
     */
    billableCharacterCount?: number;
}

/** Parameters for the embed_content method. */
declare interface EmbedContentParameters {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** The content to embed. Only the `parts.text` fields will be counted.
     */
    contents: ContentListUnion;
    /** Configuration that contains optional parameters.
     */
    config?: EmbedContentConfig;
}

/** Parameters for the _embed_content method. */
declare interface EmbedContentParametersPrivate {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** The content to embed. Only the `parts.text` fields will be counted.
     */
    contents?: ContentListUnion;
    /** The single content to embed. Only the `parts.text` fields will be counted.
     */
    content?: ContentUnion;
    /** The Vertex embedding API to use.
     */
    embeddingApiType?: EmbeddingApiType;
    /** Configuration that contains optional parameters.
     */
    config?: EmbedContentConfig;
}

/** Response for the embed_content method. */
declare class EmbedContentResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** The embeddings for each request, in the same order as provided in
     the batch request.
     */
    embeddings?: ContentEmbedding[];
    /** Vertex API only. Metadata about the request.
     */
    metadata?: EmbedContentMetadata;
}

/** Enum representing the Vertex embedding API to use. */
declare enum EmbeddingApiType {
    /**
     * predict API endpoint (default)
     */
    PREDICT = "PREDICT",
    /**
     * embedContent API Endpoint
     */
    EMBED_CONTENT = "EMBED_CONTENT"
}

declare interface EmbeddingsBatchJobSource {
    /** The Gemini Developer API's file resource name of the input data
     (e.g. "files/12345").
     */
    fileName?: string;
    /** The Gemini Developer API's inlined input data to run batch job.
     */
    inlinedRequests?: EmbedContentBatch;
}

/** Represents a customer-managed encryption key specification that can be applied to a Vertex AI resource. This data type is not supported in Gemini API. */
declare interface EncryptionSpec {
    /** Required. Resource name of the Cloud KMS key used to protect the resource. The Cloud KMS key must be in the same region as the resource. It must have the format `projects/{project}/locations/{location}/keyRings/{key_ring}/cryptoKeys/{crypto_key}`. */
    kmsKeyName?: string;
}

/** An endpoint where you deploy models. */
declare interface Endpoint {
    /** Resource name of the endpoint. */
    name?: string;
    /** ID of the model that's deployed to the endpoint. */
    deployedModelId?: string;
}

/** End of speech sensitivity. */
declare enum EndSensitivity {
    /**
     * The default is END_SENSITIVITY_LOW.
     */
    END_SENSITIVITY_UNSPECIFIED = "END_SENSITIVITY_UNSPECIFIED",
    /**
     * Automatic detection ends speech more often.
     */
    END_SENSITIVITY_HIGH = "END_SENSITIVITY_HIGH",
    /**
     * Automatic detection ends speech less often.
     */
    END_SENSITIVITY_LOW = "END_SENSITIVITY_LOW"
}

/** Tool to search public web data, powered by Vertex AI Search and Sec4 compliance. This data type is not supported in Gemini API. */
declare interface EnterpriseWebSearch {
    /** Optional. Sites with confidence level chosen & above this value will be blocked from the search results. */
    blockingConfidence?: PhishBlockThreshold;
    /** Optional. List of domains to be excluded from the search results. The default limit is 2000 domains. */
    excludeDomains?: string[];
}

/** An entity representing the segmented area. */
declare interface EntityLabel {
    /** The label of the segmented entity. */
    label?: string;
    /** The confidence score of the detected label. */
    score?: number;
}

/** The environment being operated. */
declare enum Environment {
    /**
     * Defaults to browser.
     */
    ENVIRONMENT_UNSPECIFIED = "ENVIRONMENT_UNSPECIFIED",
    /**
     * Operates in a web browser.
     */
    ENVIRONMENT_BROWSER = "ENVIRONMENT_BROWSER"
}

/** The results from an evaluation run performed by the EvaluationService. This data type is not supported in Gemini API. */
declare class EvaluateDatasetResponse {
    /** Output only. Aggregation statistics derived from results of EvaluationService. */
    aggregationOutput?: AggregationOutput;
    /** Output only. Output info for EvaluationService. */
    outputInfo?: OutputInfo;
}

/** Evaluate Dataset Run Result for Tuning Job. This data type is not supported in Gemini API. */
declare interface EvaluateDatasetRun {
    /** Output only. The checkpoint id used in the evaluation run. Only populated when evaluating checkpoints. */
    checkpointId?: string;
    /** Output only. The error of the evaluation run if any. */
    error?: GoogleRpcStatus;
    /** Output only. Results for EvaluationService. */
    evaluateDatasetResponse?: EvaluateDatasetResponse;
    /** Output only. The resource name of the evaluation run. Format: `projects/{project}/locations/{location}/evaluationRuns/{evaluation_run_id}`. */
    evaluationRun?: string;
    /** Output only. Deprecated: The updated architecture uses evaluation_run instead. */
    operationName?: string;
}

/** The dataset used for evaluation. This data type is not supported in Gemini API. */
declare interface EvaluationDataset {
    /** BigQuery source holds the dataset. */
    bigquerySource?: BigQuerySource;
    /** Cloud storage source holds the dataset. Currently only one Cloud Storage file path is supported. */
    gcsSource?: GcsSource;
}

/** Exact match metric value for an instance. This data type is not supported in Gemini API. */
declare interface ExactMatchMetricValue {
    /** Output only. Exact match score. */
    score?: number;
}

/** Model-generated code executed server-side, results returned to the model.

 Only generated when using the `CodeExecution` tool, in which the code will
 be automatically executed, and a corresponding `CodeExecutionResult` will
 also be generated. */
declare interface ExecutableCode {
    /** Required. The code to be executed. */
    code?: string;
    /** Required. Programming language of the `code`. */
    language?: Language;
    /** Unique identifier of the `ExecutableCode` part. The server returns the `CodeExecutionResult` with the matching `id`. */
    id?: string;
}

/** Retrieve from data source powered by external API for grounding. The external API is not owned by Google, but need to follow the pre-defined API spec. This data type is not supported in Gemini API. */
declare interface ExternalApi {
    /** The authentication config to access the API. Deprecated. Please use auth_config instead. */
    apiAuth?: ApiAuth;
    /** The API spec that the external API implements. */
    apiSpec?: ApiSpec;
    /** The authentication config to access the API. */
    authConfig?: AuthConfig;
    /** Parameters for the elastic search API. */
    elasticSearchParams?: ExternalApiElasticSearchParams;
    /** The endpoint of the external API. The system will call the API at this endpoint to retrieve the data for grounding. Example: https://acme.com:443/search */
    endpoint?: string;
    /** Parameters for the simple search API. */
    simpleSearchParams?: ExternalApiSimpleSearchParams;
}

/** The search parameters to use for the ELASTIC_SEARCH spec. This data type is not supported in Gemini API. */
declare interface ExternalApiElasticSearchParams {
    /** The ElasticSearch index to use. */
    index?: string;
    /** Optional. Number of hits (chunks) to request. When specified, it is passed to Elasticsearch as the `num_hits` param. */
    numHits?: number;
    /** The ElasticSearch search template to use. */
    searchTemplate?: string;
}

/** The search parameters to use for SIMPLE_SEARCH spec. This data type is not supported in Gemini API. */
declare interface ExternalApiSimpleSearchParams {
}

/** Options for feature selection preference. */
declare enum FeatureSelectionPreference {
    FEATURE_SELECTION_PREFERENCE_UNSPECIFIED = "FEATURE_SELECTION_PREFERENCE_UNSPECIFIED",
    PRIORITIZE_QUALITY = "PRIORITIZE_QUALITY",
    BALANCED = "BALANCED",
    PRIORITIZE_COST = "PRIORITIZE_COST"
}

declare interface FetchPredictOperationConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters for the fetchPredictOperation method. */
declare interface FetchPredictOperationParameters {
    /** The server-assigned name for the operation. */
    operationName: string;
    resourceName: string;
    /** Used to override the default configuration. */
    config?: FetchPredictOperationConfig;
}

/** A file uploaded to the API. */
declare interface File_2 {
    /** The `File` resource name. The ID (name excluding the "files/" prefix) can contain up to 40 characters that are lowercase alphanumeric or dashes (-). The ID cannot start or end with a dash. If the name is empty on create, a unique name will be generated. Example: `files/123-456` */
    name?: string;
    /** Optional. The human-readable display name for the `File`. The display name must be no more than 512 characters in length, including spaces. Example: 'Welcome Image' */
    displayName?: string;
    /** Output only. MIME type of the file. */
    mimeType?: string;
    /** Output only. Size of the file in bytes. */
    sizeBytes?: string;
    /** Output only. The timestamp of when the `File` was created. */
    createTime?: string;
    /** Output only. The timestamp of when the `File` will be deleted. Only set if the `File` is scheduled to expire. */
    expirationTime?: string;
    /** Output only. The timestamp of when the `File` was last updated. */
    updateTime?: string;
    /** Output only. SHA-256 hash of the uploaded bytes. The hash value is encoded in base64 format. */
    sha256Hash?: string;
    /** Output only. The URI of the `File`. */
    uri?: string;
    /** Output only. The URI of the `File`, only set for downloadable (generated) files. */
    downloadUri?: string;
    /** Output only. Processing state of the File. */
    state?: FileState;
    /** Output only. The source of the `File`. */
    source?: FileSource;
    /** Output only. Metadata for a video. */
    videoMetadata?: Record<string, unknown>;
    /** Output only. Error status if File processing failed. */
    error?: FileStatus;
}

/** URI-based data. A FileData message contains a URI pointing to data of a specific media type. It is used to represent images, audio, and video stored in Google Cloud Storage. */
declare interface FileData {
    /** Optional. The display name of the file. Used to provide a label or filename to distinguish files. This field is only returned in `PromptMessage` for prompt management. It is used in the Gemini calls only when server side tools (`code_execution`, `google_search`, and `url_context`) are enabled. This field is not supported in Gemini API. */
    displayName?: string;
    /** Required. The URI of the file in Google Cloud Storage. */
    fileUri?: string;
    /** Required. The IANA standard MIME type of the source data. */
    mimeType?: string;
}

/** The FileSearch tool that retrieves knowledge from Semantic Retrieval corpora. Files are imported to Semantic Retrieval corpora using the ImportFile API. This data type is not supported in Vertex AI. */
declare interface FileSearch {
    /** Required. The names of the file_search_stores to retrieve from. Example: `fileSearchStores/my-file-search-store-123` */
    fileSearchStoreNames?: string[];
    /** Optional. The number of semantic retrieval chunks to retrieve. */
    topK?: number;
    /** Optional. Metadata filter to apply to the semantic retrieval documents and chunks. */
    metadataFilter?: string;
}

/** A collection of Documents. */
declare interface FileSearchStore {
    /** The resource name of the FileSearchStore. Example: `fileSearchStores/my-file-search-store-123` */
    name?: string;
    /** The human-readable display name for the FileSearchStore. */
    displayName?: string;
    /** The Timestamp of when the FileSearchStore was created. */
    createTime?: string;
    /** The Timestamp of when the FileSearchStore was last updated. */
    updateTime?: string;
    /** The number of documents in the FileSearchStore that are active and ready for retrieval. */
    activeDocumentsCount?: string;
    /** The number of documents in the FileSearchStore that are being processed. */
    pendingDocumentsCount?: string;
    /** The number of documents in the FileSearchStore that have failed processing. */
    failedDocumentsCount?: string;
    /** The size of raw bytes ingested into the FileSearchStore. This is the
     total size of all the documents in the FileSearchStore. */
    sizeBytes?: string;
}

/** Source of the File. */
declare enum FileSource {
    SOURCE_UNSPECIFIED = "SOURCE_UNSPECIFIED",
    UPLOADED = "UPLOADED",
    GENERATED = "GENERATED",
    REGISTERED = "REGISTERED"
}

/**
 * Represents the size and mimeType of a file. The information is used to
 * request the upload URL from the https://generativelanguage.googleapis.com/upload/v1beta/files endpoint.
 * This interface defines the structure for constructing and executing HTTP
 * requests.
 */
declare interface FileStat {
    /**
     * The size of the file in bytes.
     */
    size: number;
    /**
     * The MIME type of the file.
     */
    type: string | undefined;
}

/** State for the lifecycle of a File. */
declare enum FileState {
    STATE_UNSPECIFIED = "STATE_UNSPECIFIED",
    PROCESSING = "PROCESSING",
    ACTIVE = "ACTIVE",
    FAILED = "FAILED"
}

/** Status of a File that uses a common error model. */
declare interface FileStatus {
    /** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
    details?: Record<string, unknown>[];
    /** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
    message?: string;
    /** The status code. 0 for OK, 1 for CANCELLED */
    code?: number;
}

/** Output only. The reason why the model stopped generating tokens.

 If empty, the model has not stopped generating the tokens. */
declare enum FinishReason {
    /**
     * The finish reason is unspecified.
     */
    FINISH_REASON_UNSPECIFIED = "FINISH_REASON_UNSPECIFIED",
    /**
     * Token generation reached a natural stopping point or a configured stop sequence.
     */
    STOP = "STOP",
    /**
     * Token generation reached the configured maximum output tokens.
     */
    MAX_TOKENS = "MAX_TOKENS",
    /**
     * Token generation stopped because the content potentially contains safety violations. NOTE: When streaming, [content][] is empty if content filters blocks the output.
     */
    SAFETY = "SAFETY",
    /**
     * The token generation stopped because of potential recitation.
     */
    RECITATION = "RECITATION",
    /**
     * The token generation stopped because of using an unsupported language.
     */
    LANGUAGE = "LANGUAGE",
    /**
     * All other reasons that stopped the token generation.
     */
    OTHER = "OTHER",
    /**
     * Token generation stopped because the content contains forbidden terms.
     */
    BLOCKLIST = "BLOCKLIST",
    /**
     * Token generation stopped for potentially containing prohibited content.
     */
    PROHIBITED_CONTENT = "PROHIBITED_CONTENT",
    /**
     * Token generation stopped because the content potentially contains Sensitive Personally Identifiable Information (SPII).
     */
    SPII = "SPII",
    /**
     * The function call generated by the model is invalid.
     */
    MALFORMED_FUNCTION_CALL = "MALFORMED_FUNCTION_CALL",
    /**
     * Token generation stopped because generated images have safety violations.
     */
    IMAGE_SAFETY = "IMAGE_SAFETY",
    /**
     * The tool call generated by the model is invalid.
     */
    UNEXPECTED_TOOL_CALL = "UNEXPECTED_TOOL_CALL",
    /**
     * Image generation stopped because the generated images have prohibited content.
     */
    IMAGE_PROHIBITED_CONTENT = "IMAGE_PROHIBITED_CONTENT",
    /**
     * The model was expected to generate an image, but none was generated.
     */
    NO_IMAGE = "NO_IMAGE",
    /**
     * Image generation stopped because the generated image may be a recitation from a source.
     */
    IMAGE_RECITATION = "IMAGE_RECITATION",
    /**
     * Image generation stopped for a reason not otherwise specified.
     */
    IMAGE_OTHER = "IMAGE_OTHER"
}

export declare function formatMap(templateString: string, valueMap: Record<string, unknown>): string;

/** Tuning Spec for Full Fine Tuning. This data type is not supported in Gemini API. */
declare interface FullFineTuningSpec {
    /** Optional. Hyperparameters for Full Fine Tuning. */
    hyperParameters?: SupervisedHyperParameters;
    /** Required. Training dataset used for tuning. The dataset can be specified as either a Cloud Storage path to a JSONL file or as the resource name of a Vertex Multimodal Dataset. */
    trainingDatasetUri?: string;
    /** Optional. Validation dataset used for tuning. The dataset can be specified as either a Cloud Storage path to a JSONL file or as the resource name of a Vertex Multimodal Dataset. */
    validationDatasetUri?: string;
}

/** A function call. */
declare interface FunctionCall {
    /** The unique id of the function call. If populated, the client to execute the
     `function_call` and return the response with the matching `id`. */
    id?: string;
    /** Optional. The function parameters and values in JSON object format. See [FunctionDeclaration.parameters] for parameter details. */
    args?: Record<string, unknown>;
    /** Optional. The name of the function to call. Matches [FunctionDeclaration.name]. */
    name?: string;
    /** Optional. The partial argument value of the function call. If provided, represents the arguments/fields that are streamed incrementally. This field is not supported in Gemini API. */
    partialArgs?: PartialArg[];
    /** Optional. Whether this is the last part of the FunctionCall. If true, another partial message for the current FunctionCall is expected to follow. This field is not supported in Gemini API. */
    willContinue?: boolean;
}

/** Function calling config. */
declare interface FunctionCallingConfig {
    /** Optional. Function names to call. Only set when the Mode is ANY. Function names should match [FunctionDeclaration.name]. With mode set to ANY, model will predict a function call from the set of function names provided. */
    allowedFunctionNames?: string[];
    /** Optional. Function calling mode. */
    mode?: FunctionCallingConfigMode;
    /** Optional. When set to true, arguments of a single function call will be streamed out in multiple parts/contents/responses. Partial parameter results will be returned in the [FunctionCall.partial_args] field. This field is not supported in Gemini API. */
    streamFunctionCallArguments?: boolean;
}

/** Function calling mode. */
declare enum FunctionCallingConfigMode {
    /**
     * Unspecified function calling mode. This value should not be used.
     */
    MODE_UNSPECIFIED = "MODE_UNSPECIFIED",
    /**
     * Default model behavior, model decides to predict either function calls or natural language response.
     */
    AUTO = "AUTO",
    /**
     * Model is constrained to always predicting function calls only. If "allowed_function_names" are set, the predicted function calls will be limited to any one of "allowed_function_names", else the predicted function calls will be any one of the provided "function_declarations".
     */
    ANY = "ANY",
    /**
     * Model will not predict any function calls. Model behavior is same as when not passing any function declarations.
     */
    NONE = "NONE",
    /**
     * Model is constrained to predict either function calls or natural language response. If "allowed_function_names" are set, the predicted function calls will be limited to any one of "allowed_function_names", else the predicted function calls will be any one of the provided "function_declarations".
     */
    VALIDATED = "VALIDATED"
}

/** Structured representation of a function declaration as defined by the [OpenAPI 3.0 specification](https://spec.openapis.org/oas/v3.0.3). Included in this declaration are the function name, description, parameters and response type. This FunctionDeclaration is a representation of a block of code that can be used as a `Tool` by the model and executed by the client. */
declare interface FunctionDeclaration {
    /** Optional. Description and purpose of the function. Model uses it to decide how and whether to call the function. */
    description?: string;
    /** Required. The name of the function to call. Must start with a letter or an underscore. Must be a-z, A-Z, 0-9, or contain underscores, dots, colons and dashes, with a maximum length of 64. */
    name?: string;
    /** Optional. Describes the parameters to this function in JSON Schema Object format. Reflects the Open API 3.03 Parameter Object. string Key: the name of the parameter. Parameter names are case sensitive. Schema Value: the Schema defining the type used for the parameter. For function with no parameters, this can be left unset. Parameter names must start with a letter or an underscore and must only contain chars a-z, A-Z, 0-9, or underscores with a maximum length of 64. Example with 1 required and 1 optional parameter: type: OBJECT properties: param1: type: STRING param2: type: INTEGER required: - param1 */
    parameters?: Schema;
    /** Optional. Describes the parameters to the function in JSON Schema format. The schema must describe an object where the properties are the parameters to the function. For example: ``` { "type": "object", "properties": { "name": { "type": "string" }, "age": { "type": "integer" } }, "additionalProperties": false, "required": ["name", "age"], "propertyOrdering": ["name", "age"] } ``` This field is mutually exclusive with `parameters`. */
    parametersJsonSchema?: unknown;
    /** Optional. Describes the output from this function in JSON Schema format. Reflects the Open API 3.03 Response Object. The Schema defines the type used for the response value of the function. */
    response?: Schema;
    /** Optional. Describes the output from this function in JSON Schema format. The value specified by the schema is the response value of the function. This field is mutually exclusive with `response`. */
    responseJsonSchema?: unknown;
    /** Optional. Specifies the function Behavior. Currently only supported by the BidiGenerateContent method. This field is not supported in Vertex AI. */
    behavior?: Behavior;
}

/** A function response. */
declare class FunctionResponse {
    /** Signals that function call continues, and more responses will be returned, turning the function call into a generator. Is only applicable to NON_BLOCKING function calls (see FunctionDeclaration.behavior for details), ignored otherwise. If false, the default, future responses will not be considered. Is only applicable to NON_BLOCKING function calls, is ignored otherwise. If set to false, future responses will not be considered. It is allowed to return empty `response` with `will_continue=False` to signal that the function call is finished. */
    willContinue?: boolean;
    /** Specifies how the response should be scheduled in the conversation. Only applicable to NON_BLOCKING function calls, is ignored otherwise. Defaults to WHEN_IDLE. */
    scheduling?: FunctionResponseScheduling;
    /** List of parts that constitute a function response. Each part may
     have a different IANA MIME type. */
    parts?: FunctionResponsePart[];
    /** Optional. The id of the function call this response is for. Populated by the client to match the corresponding function call `id`. */
    id?: string;
    /** Required. The name of the function to call. Matches [FunctionDeclaration.name] and [FunctionCall.name]. */
    name?: string;
    /** Required. The function response in JSON object format. Use "output" key to specify function output and "error" key to specify error details (if any). If "output" and "error" keys are not specified, then whole "response" is treated as function output. */
    response?: Record<string, unknown>;
}

/** Raw media bytes for function response.

 Text should not be sent as raw bytes, use the FunctionResponse.response
 field. */
declare class FunctionResponseBlob {
    /** Required. The IANA standard MIME type of the source data. */
    mimeType?: string;
    /** Required. Inline media bytes.
     * @remarks Encoded as base64 string. */
    data?: string;
    /** Optional. Display name of the blob.
     Used to provide a label or filename to distinguish blobs. */
    displayName?: string;
}

/** URI based data for function response. */
declare class FunctionResponseFileData {
    /** Required. URI. */
    fileUri?: string;
    /** Required. The IANA standard MIME type of the source data. */
    mimeType?: string;
    /** Optional. Display name of the file.
     Used to provide a label or filename to distinguish files. */
    displayName?: string;
}

/** A datatype containing media that is part of a `FunctionResponse` message.

 A `FunctionResponsePart` consists of data which has an associated datatype. A
 `FunctionResponsePart` can only contain one of the accepted types in
 `FunctionResponsePart.data`.

 A `FunctionResponsePart` must have a fixed IANA MIME type identifying the
 type and subtype of the media if the `inline_data` field is filled with raw
 bytes. */
declare class FunctionResponsePart {
    /** Optional. Inline media bytes. */
    inlineData?: FunctionResponseBlob;
    /** Optional. URI based data. */
    fileData?: FunctionResponseFileData;
}

/** Specifies how the response should be scheduled in the conversation. */
declare enum FunctionResponseScheduling {
    /**
     * This value is unused.
     */
    SCHEDULING_UNSPECIFIED = "SCHEDULING_UNSPECIFIED",
    /**
     * Only add the result to the conversation context, do not interrupt or trigger generation.
     */
    SILENT = "SILENT",
    /**
     * Add the result to the conversation context, and prompt to generate output without interrupting ongoing generation.
     */
    WHEN_IDLE = "WHEN_IDLE",
    /**
     * Add the result to the conversation context, interrupt ongoing generation and prompt to generate output.
     */
    INTERRUPT = "INTERRUPT"
}

/** The Google Cloud Storage location for the input content. This data type is not supported in Gemini API. */
declare interface GcsSource {
    /** Required. Google Cloud Storage URI(-s) to the input file(s). May contain wildcards. For more information on wildcards, see https://cloud.google.com/storage/docs/wildcards. */
    uris?: string[];
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
declare interface GeminiNextGenAPIClientAdapter {
    isVertexAI: () => boolean;
    getProject: () => string | undefined;
    getLocation: () => string | undefined;
    getAuthHeaders: () => Headers | Promise<Headers>;
}

/** Input example for preference optimization. This data type is not supported in Gemini API. */
declare interface GeminiPreferenceExample {
    /** List of completions for a given prompt. */
    completions?: GeminiPreferenceExampleCompletion[];
    /** Multi-turn contents that represents the Prompt. */
    contents?: Content[];
}

/** Completion and its preference score. This data type is not supported in Gemini API. */
declare interface GeminiPreferenceExampleCompletion {
    /** Single turn completion for the given prompt. */
    completion?: Content;
    /** The score for the given completion. */
    score?: number;
}

/** Optional model configuration parameters.

 For more information, see `Content generation parameters
 <https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/content-generation-parameters>`_. */
declare interface GenerateContentConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** Instructions for the model to steer it toward better performance.
     For example, "Answer as concisely as possible" or "Don't use technical
     terms in your response".
     */
    systemInstruction?: ContentUnion;
    /** Value that controls the degree of randomness in token selection.
     Lower temperatures are good for prompts that require a less open-ended or
     creative response, while higher temperatures can lead to more diverse or
     creative results.
     */
    temperature?: number;
    /** Tokens are selected from the most to least probable until the sum
     of their probabilities equals this value. Use a lower value for less
     random responses and a higher value for more random responses.
     */
    topP?: number;
    /** For each token selection step, the ``top_k`` tokens with the
     highest probabilities are sampled. Then tokens are further filtered based
     on ``top_p`` with the final token selected using temperature sampling. Use
     a lower number for less random responses and a higher number for more
     random responses.
     */
    topK?: number;
    /** Number of response variations to return.
     */
    candidateCount?: number;
    /** Maximum number of tokens that can be generated in the response.
     */
    maxOutputTokens?: number;
    /** List of strings that tells the model to stop generating text if one
     of the strings is encountered in the response.
     */
    stopSequences?: string[];
    /** Whether to return the log probabilities of the tokens that were
     chosen by the model at each step.
     */
    responseLogprobs?: boolean;
    /** Number of top candidate tokens to return the log probabilities for
     at each generation step.
     */
    logprobs?: number;
    /** Positive values penalize tokens that already appear in the
     generated text, increasing the probability of generating more diverse
     content.
     */
    presencePenalty?: number;
    /** Positive values penalize tokens that repeatedly appear in the
     generated text, increasing the probability of generating more diverse
     content.
     */
    frequencyPenalty?: number;
    /** When ``seed`` is fixed to a specific number, the model makes a best
     effort to provide the same response for repeated requests. By default, a
     random number is used.
     */
    seed?: number;
    /** Output response mimetype of the generated candidate text.
     Supported mimetype:
     - `text/plain`: (default) Text output.
     - `application/json`: JSON response in the candidates.
     The model needs to be prompted to output the appropriate response type,
     otherwise the behavior is undefined.
     */
    responseMimeType?: string;
    /** The `Schema` object allows the definition of input and output data types.
     These types can be objects, but also primitives and arrays.
     Represents a select subset of an [OpenAPI 3.0 schema
     object](https://spec.openapis.org/oas/v3.0.3#schema).
     If set, a compatible response_mime_type must also be set.
     Compatible mimetypes: `application/json`: Schema for JSON response.

     If `response_schema` doesn't process your schema correctly, try using
     `response_json_schema` instead.
     */
    responseSchema?: SchemaUnion;
    /** Optional. Output schema of the generated response.
     This is an alternative to `response_schema` that accepts [JSON
     Schema](https://json-schema.org/). If set, `response_schema` must be
     omitted, but `response_mime_type` is required. While the full JSON Schema
     may be sent, not all features are supported. Specifically, only the
     following properties are supported: - `$id` - `$defs` - `$ref` - `$anchor`
     - `type` - `format` - `title` - `description` - `enum` (for strings and
     numbers) - `items` - `prefixItems` - `minItems` - `maxItems` - `minimum` -
     `maximum` - `anyOf` - `oneOf` (interpreted the same as `anyOf`) -
     `properties` - `additionalProperties` - `required` The non-standard
     `propertyOrdering` property may also be set. Cyclic references are
     unrolled to a limited degree and, as such, may only be used within
     non-required properties. (Nullable properties are not sufficient.) If
     `$ref` is set on a sub-schema, no other properties, except for than those
     starting as a `$`, may be set. */
    responseJsonSchema?: unknown;
    /** Configuration for model router requests.
     */
    routingConfig?: GenerationConfigRoutingConfig;
    /** Configuration for model selection.
     */
    modelSelectionConfig?: ModelSelectionConfig;
    /** Safety settings in the request to block unsafe content in the
     response.
     */
    safetySettings?: SafetySetting[];
    /** Code that enables the system to interact with external systems to
     perform an action outside of the knowledge and scope of the model.
     */
    tools?: ToolListUnion;
    /** Associates model output to a specific function call.
     */
    toolConfig?: ToolConfig;
    /** Labels with user-defined metadata to break down billed charges. */
    labels?: Record<string, string>;
    /** Resource name of a context cache that can be used in subsequent
     requests.
     */
    cachedContent?: string;
    /** The requested modalities of the response. Represents the set of
     modalities that the model can return.
     */
    responseModalities?: string[];
    /** If specified, the media resolution specified will be used.
     */
    mediaResolution?: MediaResolution;
    /** The speech generation configuration.
     */
    speechConfig?: SpeechConfigUnion;
    /** If enabled, audio timestamp will be included in the request to the
     model.
     */
    audioTimestamp?: boolean;
    /** The configuration for automatic function calling.
     */
    automaticFunctionCalling?: AutomaticFunctionCallingConfig;
    /** The thinking features configuration.
     */
    thinkingConfig?: ThinkingConfig;
    /** The image generation configuration.
     */
    imageConfig?: ImageConfig;
    /** Enables enhanced civic answers. It may not be available for all
     models. This field is not supported in Vertex AI.
     */
    enableEnhancedCivicAnswers?: boolean;
    /** Settings for prompt and response sanitization using the Model Armor
     service. If supplied, safety_settings must not be supplied.
     */
    modelArmorConfig?: ModelArmorConfig;
    /** The service tier to use for the request. For example, ServiceTier.FLEX. */
    serviceTier?: ServiceTier;
}

/** Config for models.generate_content parameters. */
declare interface GenerateContentParameters {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** Content of the request.
     */
    contents: ContentListUnion;
    /** Configuration that contains optional model parameters.
     */
    config?: GenerateContentConfig;
}

/** Response message for PredictionService.GenerateContent. */
declare class GenerateContentResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** Response variations returned by the model.
     */
    candidates?: Candidate[];
    /** Timestamp when the request is made to the server.
     */
    createTime?: string;
    /** The history of automatic function calling.
     */
    automaticFunctionCallingHistory?: Content[];
    /** Output only. The model version used to generate the response. */
    modelVersion?: string;
    /** Output only. Content filter results for a prompt sent in the request. Note: Sent only in the first stream chunk. Only happens when no candidates were generated due to content violations. */
    promptFeedback?: GenerateContentResponsePromptFeedback;
    /** Output only. response_id is used to identify each response. It is the encoding of the event_id. */
    responseId?: string;
    /** Usage metadata about the response(s). */
    usageMetadata?: GenerateContentResponseUsageMetadata;
    /** Output only. The current model status of this model. This field is not supported in Vertex AI. */
    modelStatus?: ModelStatus;
    /**
     * Returns the concatenation of all text parts from the first candidate in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the text from the first
     * one will be returned.
     * If there are non-text parts in the response, the concatenation of all text
     * parts will be returned, and a warning will be logged.
     * If there are thought parts in the response, the concatenation of all text
     * parts excluding the thought parts will be returned.
     *
     * @example
     * ```ts
     * const response = await ai.models.generateContent({
     *   model: 'gemini-2.0-flash',
     *   contents:
     *     'Why is the sky blue?',
     * });
     *
     * console.debug(response.text);
     * ```
     */
    get text(): string | undefined;
    /**
     * Returns the concatenation of all inline data parts from the first candidate
     * in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the inline data from the
     * first one will be returned. If there are non-inline data parts in the
     * response, the concatenation of all inline data parts will be returned, and
     * a warning will be logged.
     */
    get data(): string | undefined;
    /**
     * Returns the function calls from the first candidate in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the function calls from
     * the first one will be returned.
     * If there are no function calls in the response, undefined will be returned.
     *
     * @example
     * ```ts
     * const controlLightFunctionDeclaration: FunctionDeclaration = {
     *   name: 'controlLight',
     *   parameters: {
     *   type: Type.OBJECT,
     *   description: 'Set the brightness and color temperature of a room light.',
     *   properties: {
     *     brightness: {
     *       type: Type.NUMBER,
     *       description:
     *         'Light level from 0 to 100. Zero is off and 100 is full brightness.',
     *     },
     *     colorTemperature: {
     *       type: Type.STRING,
     *       description:
     *         'Color temperature of the light fixture which can be `daylight`, `cool` or `warm`.',
     *     },
     *   },
     *   required: ['brightness', 'colorTemperature'],
     *  };
     *  const response = await ai.models.generateContent({
     *     model: 'gemini-2.0-flash',
     *     contents: 'Dim the lights so the room feels cozy and warm.',
     *     config: {
     *       tools: [{functionDeclarations: [controlLightFunctionDeclaration]}],
     *       toolConfig: {
     *         functionCallingConfig: {
     *           mode: FunctionCallingConfigMode.ANY,
     *           allowedFunctionNames: ['controlLight'],
     *         },
     *       },
     *     },
     *   });
     *  console.debug(JSON.stringify(response.functionCalls));
     * ```
     */
    get functionCalls(): FunctionCall[] | undefined;
    /**
     * Returns the first executable code from the first candidate in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the executable code from
     * the first one will be returned.
     * If there are no executable code in the response, undefined will be
     * returned.
     *
     * @example
     * ```ts
     * const response = await ai.models.generateContent({
     *   model: 'gemini-2.0-flash',
     *   contents:
     *     'What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.'
     *   config: {
     *     tools: [{codeExecution: {}}],
     *   },
     * });
     *
     * console.debug(response.executableCode);
     * ```
     */
    get executableCode(): string | undefined;
    /**
     * Returns the first code execution result from the first candidate in the response.
     *
     * @remarks
     * If there are multiple candidates in the response, the code execution result from
     * the first one will be returned.
     * If there are no code execution result in the response, undefined will be returned.
     *
     * @example
     * ```ts
     * const response = await ai.models.generateContent({
     *   model: 'gemini-2.0-flash',
     *   contents:
     *     'What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.'
     *   config: {
     *     tools: [{codeExecution: {}}],
     *   },
     * });
     *
     * console.debug(response.codeExecutionResult);
     * ```
     */
    get codeExecutionResult(): string | undefined;
}

/** Content filter results for a prompt sent in the request. Note: This is sent only in the first stream chunk and only if no candidates were generated due to content violations. */
declare class GenerateContentResponsePromptFeedback {
    /** Output only. The reason why the prompt was blocked. */
    blockReason?: BlockedReason;
    /** Output only. A readable message that explains the reason why the prompt was blocked. This field is not supported in Gemini API. */
    blockReasonMessage?: string;
    /** Output only. A list of safety ratings for the prompt. There is one rating per category. */
    safetyRatings?: SafetyRating[];
}

/** Usage metadata about the content generation request and response. This message provides a detailed breakdown of token usage and other relevant metrics. This data type is not supported in Gemini API. */
declare class GenerateContentResponseUsageMetadata {
    /** Output only. A detailed breakdown of the token count for each modality in the cached content. */
    cacheTokensDetails?: ModalityTokenCount[];
    /** Output only. The number of tokens in the cached content that was used for this request. */
    cachedContentTokenCount?: number;
    /** The total number of tokens in the generated candidates. */
    candidatesTokenCount?: number;
    /** Output only. A detailed breakdown of the token count for each modality in the generated candidates. */
    candidatesTokensDetails?: ModalityTokenCount[];
    /** The total number of tokens in the prompt. This includes any text, images, or other media provided in the request. When `cached_content` is set, this also includes the number of tokens in the cached content. */
    promptTokenCount?: number;
    /** Output only. A detailed breakdown of the token count for each modality in the prompt. */
    promptTokensDetails?: ModalityTokenCount[];
    /** Output only. The number of tokens that were part of the model's generated "thoughts" output, if applicable. */
    thoughtsTokenCount?: number;
    /** Output only. The number of tokens in the results from tool executions, which are provided back to the model as input, if applicable. */
    toolUsePromptTokenCount?: number;
    /** Output only. A detailed breakdown by modality of the token counts from the results of tool executions, which are provided back to the model as input. */
    toolUsePromptTokensDetails?: ModalityTokenCount[];
    /** The total number of tokens for the entire request. This is the sum of `prompt_token_count`, `candidates_token_count`, `tool_use_prompt_token_count`, and `thoughts_token_count`. */
    totalTokenCount?: number;
    /** Output only. The traffic type for this request. */
    trafficType?: TrafficType;
}

/** An output image. */
declare interface GeneratedImage {
    /** The output image data. */
    image?: Image_2;
    /** Responsible AI filter reason if the image is filtered out of the
     response. */
    raiFilteredReason?: string;
    /** Safety attributes of the image. Lists of RAI categories and their
     scores of each content. */
    safetyAttributes?: SafetyAttributes;
    /** The rewritten prompt used for the image generation if the prompt
     enhancer is enabled. */
    enhancedPrompt?: string;
}

/** A generated image mask. */
declare interface GeneratedImageMask {
    /** The generated image mask. */
    mask?: Image_2;
    /** The detected entities on the segmented area. */
    labels?: EntityLabel[];
}

/** A generated video. */
declare interface GeneratedVideo {
    /** The output video */
    video?: Video;
}

/** The config for generating an images. */
declare interface GenerateImagesConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** Cloud Storage URI used to store the generated images. */
    outputGcsUri?: string;
    /** Description of what to discourage in the generated images. */
    negativePrompt?: string;
    /** Number of images to generate. */
    numberOfImages?: number;
    /** Aspect ratio of the generated images. Supported values are
     "1:1", "3:4", "4:3", "9:16", and "16:9". */
    aspectRatio?: string;
    /** Controls how much the model adheres to the text prompt. Large
     values increase output and prompt alignment, but may compromise image
     quality. */
    guidanceScale?: number;
    /** Random seed for image generation. This is not available when
     ``add_watermark`` is set to true. */
    seed?: number;
    /** Filter level for safety filtering. */
    safetyFilterLevel?: SafetyFilterLevel;
    /** Allows generation of people by the model. */
    personGeneration?: PersonGeneration;
    /** Whether to report the safety scores of each generated image and
     the positive prompt in the response. */
    includeSafetyAttributes?: boolean;
    /** Whether to include the Responsible AI filter reason if the image
     is filtered out of the response. */
    includeRaiReason?: boolean;
    /** Language of the text in the prompt. */
    language?: ImagePromptLanguage;
    /** MIME type of the generated image. */
    outputMimeType?: string;
    /** Compression quality of the generated image (for ``image/jpeg``
     only). */
    outputCompressionQuality?: number;
    /** Whether to add a watermark to the generated images. */
    addWatermark?: boolean;
    /** User specified labels to track billing usage. */
    labels?: Record<string, string>;
    /** The size of the largest dimension of the generated image.
     Supported sizes are 1K and 2K (not supported for Imagen 3 models). */
    imageSize?: string;
    /** Whether to use the prompt rewriting logic. */
    enhancePrompt?: boolean;
}

/** The parameters for generating images. */
declare interface GenerateImagesParameters {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** Text prompt that typically describes the images to output.
     */
    prompt: string;
    /** Configuration for generating images.
     */
    config?: GenerateImagesConfig;
}

/** The output images response. */
declare class GenerateImagesResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** List of generated images. */
    generatedImages?: GeneratedImage[];
    /** Safety attributes of the positive prompt. Only populated if
     ``include_safety_attributes`` is set to True. */
    positivePromptSafetyAttributes?: SafetyAttributes;
}

/** Configuration for generating videos. */
declare interface GenerateVideosConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** Number of output videos. */
    numberOfVideos?: number;
    /** The gcs bucket where to save the generated videos. */
    outputGcsUri?: string;
    /** Frames per second for video generation. */
    fps?: number;
    /** Duration of the clip for video generation in seconds. */
    durationSeconds?: number;
    /** The RNG seed. If RNG seed is exactly same for each request with
     unchanged inputs, the prediction results will be consistent. Otherwise,
     a random RNG seed will be used each time to produce a different
     result. */
    seed?: number;
    /** The aspect ratio for the generated video. 16:9 (landscape) and
     9:16 (portrait) are supported. */
    aspectRatio?: string;
    /** The resolution for the generated video. 720p and 1080p are
     supported. */
    resolution?: string;
    /** Whether allow to generate person videos, and restrict to specific
     ages. Supported values are: dont_allow, allow_adult. */
    personGeneration?: string;
    /** The pubsub topic where to publish the video generation
     progress. */
    pubsubTopic?: string;
    /** Explicitly state what should not be included in the generated
     videos. */
    negativePrompt?: string;
    /** Whether to use the prompt rewriting logic. */
    enhancePrompt?: boolean;
    /** Whether to generate audio along with the video. */
    generateAudio?: boolean;
    /** Image to use as the last frame of generated videos.
     Only supported for image to video use cases. */
    lastFrame?: Image_2;
    /** The images to use as the references to generate the videos.
     If this field is provided, the text prompt field must also be provided.
     The image, video, or last_frame field are not supported. Each image must
     be associated with a type. Veo 2 supports up to 3 asset images *or* 1
     style image. */
    referenceImages?: VideoGenerationReferenceImage[];
    /** The mask to use for generating videos. */
    mask?: VideoGenerationMask;
    /** Compression quality of the generated videos. */
    compressionQuality?: VideoCompressionQuality;
    /** User specified labels to track billing usage. */
    labels?: Record<string, string>;
}

/** A video generation operation. */
declare class GenerateVideosOperation implements Operation<GenerateVideosResponse> {
    /** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
    name?: string;
    /** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata.  Any method that returns a long-running operation should document the metadata type, if any. */
    metadata?: Record<string, unknown>;
    /** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
    done?: boolean;
    /** The error result of the operation in case of failure or cancellation. */
    error?: Record<string, unknown>;
    /** The generated videos. */
    response?: GenerateVideosResponse;
    /**
     * Instantiates an Operation of the same type as the one being called with the fields set from the API response.
     */
    _fromAPIResponse({ apiResponse, _isVertexAI, }: OperationFromAPIResponseParameters): Operation<GenerateVideosResponse>;
    /** The full HTTP response. */
    sdkHttpResponse?: HttpResponse;
}

/** Class that represents the parameters for generating videos. */
declare interface GenerateVideosParameters {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** The text prompt for generating the videos.
     Optional if image or video is provided. */
    prompt?: string;
    /** The input image for generating the videos.
     Optional if prompt is provided. Not allowed if video is provided. */
    image?: Image_2;
    /** The input video for video extension use cases.
     Optional if prompt is provided. Not allowed if image is provided. */
    video?: Video;
    /** A set of source input(s) for video generation. */
    source?: GenerateVideosSource;
    /** Configuration for generating videos. */
    config?: GenerateVideosConfig;
}

/** Response with generated videos. */
declare class GenerateVideosResponse {
    /** List of the generated videos */
    generatedVideos?: GeneratedVideo[];
    /** Returns if any videos were filtered due to RAI policies. */
    raiMediaFilteredCount?: number;
    /** Returns rai failure reasons if any. */
    raiMediaFilteredReasons?: string[];
}

/** A set of source input(s) for video generation. */
declare interface GenerateVideosSource {
    /** The text prompt for generating the videos.
     Optional if image or video is provided. */
    prompt?: string;
    /** The input image for generating the videos.
     Optional if prompt is provided. Not allowed if video is provided. */
    image?: Image_2;
    /** The input video for video extension use cases.
     Optional if prompt is provided. Not allowed if image is provided. */
    video?: Video;
}

/** Generation config. */
declare interface GenerationConfig {
    /** Optional. Config for model selection. */
    modelSelectionConfig?: ModelSelectionConfig;
    /** Output schema of the generated response. This is an alternative to
     `response_schema` that accepts [JSON Schema](https://json-schema.org/).
     */
    responseJsonSchema?: unknown;
    /** Optional. If enabled, audio timestamps will be included in the request to the model. This can be useful for synchronizing audio with other modalities in the response. This field is not supported in Gemini API. */
    audioTimestamp?: boolean;
    /** Optional. The number of candidate responses to generate. A higher `candidate_count` can provide more options to choose from, but it also consumes more resources. This can be useful for generating a variety of responses and selecting the best one. */
    candidateCount?: number;
    /** Optional. If enabled, the model will detect emotions and adapt its responses accordingly. For example, if the model detects that the user is frustrated, it may provide a more empathetic response. This field is not supported in Gemini API. */
    enableAffectiveDialog?: boolean;
    /** Optional. Penalizes tokens based on their frequency in the generated text. A positive value helps to reduce the repetition of words and phrases. Valid values can range from [-2.0, 2.0]. */
    frequencyPenalty?: number;
    /** Optional. The number of top log probabilities to return for each token. This can be used to see which other tokens were considered likely candidates for a given position. A higher value will return more options, but it will also increase the size of the response. */
    logprobs?: number;
    /** Optional. The maximum number of tokens to generate in the response. A token is approximately four characters. The default value varies by model. This parameter can be used to control the length of the generated text and prevent overly long responses. */
    maxOutputTokens?: number;
    /** Optional. The token resolution at which input media content is sampled. This is used to control the trade-off between the quality of the response and the number of tokens used to represent the media. A higher resolution allows the model to perceive more detail, which can lead to a more nuanced response, but it will also use more tokens. This does not affect the image dimensions sent to the model. */
    mediaResolution?: MediaResolution;
    /** Optional. Penalizes tokens that have already appeared in the generated text. A positive value encourages the model to generate more diverse and less repetitive text. Valid values can range from [-2.0, 2.0]. */
    presencePenalty?: number;
    /** Optional. If set to true, the log probabilities of the output tokens are returned. Log probabilities are the logarithm of the probability of a token appearing in the output. A higher log probability means the token is more likely to be generated. This can be useful for analyzing the model's confidence in its own output and for debugging. */
    responseLogprobs?: boolean;
    /** Optional. The IANA standard MIME type of the response. The model will generate output that conforms to this MIME type. Supported values include 'text/plain' (default) and 'application/json'. The model needs to be prompted to output the appropriate response type, otherwise the behavior is undefined. This is a preview feature. */
    responseMimeType?: string;
    /** Optional. The modalities of the response. The model will generate a response that includes all the specified modalities. For example, if this is set to `[TEXT, IMAGE]`, the response will include both text and an image. */
    responseModalities?: Modality[];
    /** Optional. Lets you to specify a schema for the model's response, ensuring that the output conforms to a particular structure. This is useful for generating structured data such as JSON. The schema is a subset of the [OpenAPI 3.0 schema object](https://spec.openapis.org/oas/v3.0.3#schema) object. When this field is set, you must also set the `response_mime_type` to `application/json`. */
    responseSchema?: Schema;
    /** Optional. Routing configuration. This field is not supported in Gemini API. */
    routingConfig?: GenerationConfigRoutingConfig;
    /** Optional. A seed for the random number generator. By setting a seed, you can make the model's output mostly deterministic. For a given prompt and parameters (like temperature, top_p, etc.), the model will produce the same response every time. However, it's not a guaranteed absolute deterministic behavior. This is different from parameters like `temperature`, which control the *level* of randomness. `seed` ensures that the "random" choices the model makes are the same on every run, making it essential for testing and ensuring reproducible results. */
    seed?: number;
    /** Optional. The speech generation config. */
    speechConfig?: SpeechConfig;
    /** Optional. A list of character sequences that will stop the model from generating further tokens. If a stop sequence is generated, the output will end at that point. This is useful for controlling the length and structure of the output. For example, you can use ["\n", "###"] to stop generation at a new line or a specific marker. */
    stopSequences?: string[];
    /** Optional. Controls the randomness of the output. A higher temperature results in more creative and diverse responses, while a lower temperature makes the output more predictable and focused. The valid range is (0.0, 2.0]. */
    temperature?: number;
    /** Optional. Configuration for thinking features. An error will be returned if this field is set for models that don't support thinking. */
    thinkingConfig?: ThinkingConfig;
    /** Optional. Specifies the top-k sampling threshold. The model considers only the top k most probable tokens for the next token. This can be useful for generating more coherent and less random text. For example, a `top_k` of 40 means the model will choose the next word from the 40 most likely words. */
    topK?: number;
    /** Optional. Specifies the nucleus sampling threshold. The model considers only the smallest set of tokens whose cumulative probability is at least `top_p`. This helps generate more diverse and less repetitive responses. For example, a `top_p` of 0.9 means the model considers tokens until the cumulative probability of the tokens to select from reaches 0.9. It's recommended to adjust either temperature or `top_p`, but not both. */
    topP?: number;
    /** Optional. Enables enhanced civic answers. It may not be available for all models. This field is not supported in Vertex AI. */
    enableEnhancedCivicAnswers?: boolean;
}

/** The configuration for routing the request to a specific model. This can be used to control which model is used for the generation, either automatically or by specifying a model name. This data type is not supported in Gemini API. */
declare interface GenerationConfigRoutingConfig {
    /** In this mode, the model is selected automatically based on the content of the request. */
    autoMode?: GenerationConfigRoutingConfigAutoRoutingMode;
    /** In this mode, the model is specified manually. */
    manualMode?: GenerationConfigRoutingConfigManualRoutingMode;
}

/** The configuration for automated routing. When automated routing is specified, the routing will be determined by the pretrained routing model and customer provided model routing preference. This data type is not supported in Gemini API. */
declare interface GenerationConfigRoutingConfigAutoRoutingMode {
    /** The model routing preference. */
    modelRoutingPreference?: 'UNKNOWN' | 'PRIORITIZE_QUALITY' | 'BALANCED' | 'PRIORITIZE_COST';
}

/** The configuration for manual routing. When manual routing is specified, the model will be selected based on the model name provided. This data type is not supported in Gemini API. */
declare interface GenerationConfigRoutingConfigManualRoutingMode {
    /** The name of the model to use. Only public LLM models are accepted. */
    modelName?: string;
}

/**
 * Config for thinking feature.
 *
 * @deprecated This interface will be deprecated. Please use `ThinkingConfig` instead.
 */
declare interface GenerationConfigThinkingConfig extends ThinkingConfig {
}

/** Optional parameters. */
declare interface GetBatchJobConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Config for batches.get parameters. */
declare interface GetBatchJobParameters {
    /** A fully-qualified BatchJob resource name or ID.
     Example: "projects/.../locations/.../batchPredictionJobs/456"
     or "456" when project and location are initialized in the client.
     */
    name: string;
    /** Optional parameters for the request. */
    config?: GetBatchJobConfig;
}

/** Optional parameters for caches.get method. */
declare interface GetCachedContentConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters for caches.get method. */
declare interface GetCachedContentParameters {
    /** The server-generated resource name of the cached content.
     */
    name: string;
    /** Optional parameters for the request.
     */
    config?: GetCachedContentConfig;
}

/** Optional Config. */
declare interface GetDocumentConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters for documents.get. */
declare interface GetDocumentParameters {
    /** The resource name of the Document.
     Example: fileSearchStores/file-search-store-foo/documents/documents-bar */
    name: string;
    /** Optional parameters for the request. */
    config?: GetDocumentConfig;
}

/** Used to override the default configuration. */
declare interface GetFileConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Generates the parameters for the get method. */
declare interface GetFileParameters {
    /** The name identifier for the file to retrieve. */
    name: string;
    /** Used to override the default configuration. */
    config?: GetFileConfig;
}

/** Optional parameters for getting a FileSearchStore. */
declare interface GetFileSearchStoreConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Config for file_search_stores.get parameters. */
declare interface GetFileSearchStoreParameters {
    /** The resource name of the FileSearchStore. Example: `fileSearchStores/my-file-search-store-123` */
    name: string;
    /** Optional parameters for the request. */
    config?: GetFileSearchStoreConfig;
}

/** Optional parameters for models.get method. */
declare interface GetModelConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

declare interface GetModelParameters {
    model: string;
    /** Optional parameters for the request. */
    config?: GetModelConfig;
}

declare interface GetOperationConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters for the GET method. */
declare interface GetOperationParameters {
    /** The server-assigned name for the operation. */
    operationName: string;
    /** Used to override the default configuration. */
    config?: GetOperationConfig;
}

/** Optional parameters for tunings.get method. */
declare interface GetTuningJobConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Parameters for the get method. */
declare interface GetTuningJobParameters {
    name: string;
    /** Optional parameters for the request. */
    config?: GetTuningJobConfig;
}

export declare function getValueByPath(data: unknown, keys: string[], defaultValue?: unknown): unknown;

/** Tool to retrieve knowledge from Google Maps. */
declare interface GoogleMaps {
    /** The authentication config to access the API. Only API key is supported. This field is not supported in Gemini API. */
    authConfig?: AuthConfig;
    /** Optional. Whether to return a widget context token in the GroundingMetadata of the response. Developers can use the widget context token to render a Google Maps widget with geospatial context related to the places that the model references in the response. */
    enableWidget?: boolean;
}

/** The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors). This data type is not supported in Gemini API. */
declare interface GoogleRpcStatus {
    /** The status code, which should be an enum value of google.rpc.Code. */
    code?: number;
    /** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
    details?: Record<string, unknown>[];
    /** A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client. */
    message?: string;
}

/** GoogleSearch tool type. Tool to support Google Search in Model. Powered by Google. */
declare interface GoogleSearch {
    /** Optional. The set of search types to enable. If not set, web search is enabled by default. */
    searchTypes?: SearchTypes;
    /** Optional. Sites with confidence level chosen & above this value will be blocked from the search results. This field is not supported in Gemini API. */
    blockingConfidence?: PhishBlockThreshold;
    /** Optional. List of domains to be excluded from the search results. The default limit is 2000 domains. Example: ["amazon.com", "facebook.com"]. This field is not supported in Gemini API. */
    excludeDomains?: string[];
    /** Optional. Filter search results to a specific time range. If customers set a start time, they must set an end time (and vice versa). This field is not supported in Vertex AI. */
    timeRangeFilter?: Interval;
}

/** Tool to retrieve public web data for grounding, powered by Google. */
declare interface GoogleSearchRetrieval {
    /** Specifies the dynamic retrieval configuration for the given source. */
    dynamicRetrievalConfig?: DynamicRetrievalConfig;
}

/** Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp. This data type is not supported in Gemini API. */
declare interface GoogleTypeDate {
    /** Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant. */
    day?: number;
    /** Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day. */
    month?: number;
    /** Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year. */
    year?: number;
}

/** A piece of evidence that supports a claim made by the model.

 This is used to show a citation for a claim made by the model. When grounding
 is enabled, the model returns a `GroundingChunk` that contains a reference to
 the source of the information. */
declare interface GroundingChunk {
    /** A grounding chunk from an image search result. See the `Image` message for details. */
    image?: GroundingChunkImage;
    /** A `Maps` chunk is a piece of evidence that comes from Google Maps.

     It contains information about a place, such as its name, address, and
     reviews. This is used to provide the user with rich, location-based
     information. */
    maps?: GroundingChunkMaps;
    /** A grounding chunk from a data source retrieved by a retrieval tool, such as Vertex AI Search. See the `RetrievedContext` message for details */
    retrievedContext?: GroundingChunkRetrievedContext;
    /** A grounding chunk from a web page, typically from Google Search. See the `Web` message for details. */
    web?: GroundingChunkWeb;
}

/** User provided metadata about the GroundingFact. This data type is not supported in Vertex AI. */
declare interface GroundingChunkCustomMetadata {
    /** The key of the metadata. */
    key?: string;
    /** Optional. The numeric value of the metadata. The expected range for this value depends on the specific `key` used. */
    numericValue?: number;
    /** Optional. A list of string values for the metadata. */
    stringListValue?: GroundingChunkStringList;
    /** Optional. The string value of the metadata. */
    stringValue?: string;
}

/** An `Image` chunk is a piece of evidence that comes from an image search result. It contains the URI of the image search result and the URI of the image. This is used to provide the user with a link to the source of the information. */
declare interface GroundingChunkImage {
    /** The URI of the image search result page. */
    sourceUri?: string;
    /** The URI of the image. */
    imageUri?: string;
    /** The title of the image search result page. */
    title?: string;
    /** The domain of the image search result page. */
    domain?: string;
}

/** A `Maps` chunk is a piece of evidence that comes from Google Maps.

 It contains information about a place, such as its name, address, and reviews.
 This is used to provide the user with rich, location-based information. */
declare interface GroundingChunkMaps {
    /** The sources that were used to generate the place answer.

     This includes review snippets and photos that were used to generate the
     answer, as well as URIs to flag content. */
    placeAnswerSources?: GroundingChunkMapsPlaceAnswerSources;
    /** This Place's resource name, in `places/{place_id}` format.

     This can be used to look up the place in the Google Maps API. */
    placeId?: string;
    /** The text of the place answer. */
    text?: string;
    /** The title of the place. */
    title?: string;
    /** The URI of the place. */
    uri?: string;
    /** Output only. Route information. */
    route?: GroundingChunkMapsRoute;
}

/** The sources that were used to generate the place answer.

 This includes review snippets and photos that were used to generate the
 answer, as well as URIs to flag content. */
declare interface GroundingChunkMapsPlaceAnswerSources {
    /** Snippets of reviews that were used to generate the answer. */
    reviewSnippet?: GroundingChunkMapsPlaceAnswerSourcesReviewSnippet[];
    /** A link where users can flag a problem with the generated answer. */
    flagContentUri?: string;
    /** Snippets of reviews that were used to generate the answer. */
    reviewSnippets?: GroundingChunkMapsPlaceAnswerSourcesReviewSnippet[];
}

/** Author attribution for a photo or review. */
declare interface GroundingChunkMapsPlaceAnswerSourcesAuthorAttribution {
    /** Name of the author of the Photo or Review. */
    displayName?: string;
    /** Profile photo URI of the author of the Photo or Review. */
    photoUri?: string;
    /** URI of the author of the Photo or Review. */
    uri?: string;
}

/** Encapsulates a review snippet. */
declare interface GroundingChunkMapsPlaceAnswerSourcesReviewSnippet {
    /** This review's author. */
    authorAttribution?: GroundingChunkMapsPlaceAnswerSourcesAuthorAttribution;
    /** A link where users can flag a problem with the review. */
    flagContentUri?: string;
    /** A link to show the review on Google Maps. */
    googleMapsUri?: string;
    /** A string of formatted recent time, expressing the review time relative to the current time in a form appropriate for the language and country. */
    relativePublishTimeDescription?: string;
    /** A reference representing this place review which may be used to look up this place review again. */
    review?: string;
    /** Id of the review referencing the place. */
    reviewId?: string;
    /** Title of the review. */
    title?: string;
}

/** Route information from Google Maps. This data type is not supported in Gemini API. */
declare interface GroundingChunkMapsRoute {
    /** The total distance of the route, in meters. */
    distanceMeters?: number;
    /** The total duration of the route. */
    duration?: string;
    /** An encoded polyline of the route. See https://developers.google.com/maps/documentation/utilities/polylinealgorithm */
    encodedPolyline?: string;
}

/** Context retrieved from a data source to ground the model's response. This is used when a retrieval tool fetches information from a user-provided corpus or a public dataset. */
declare interface GroundingChunkRetrievedContext {
    /** Output only. The full resource name of the referenced Vertex AI Search document. This is used to identify the specific document that was retrieved. The format is `projects/{project}/locations/{location}/collections/{collection}/dataStores/{data_store}/branches/{branch}/documents/{document}`. This field is not supported in Gemini API. */
    documentName?: string;
    /** Additional context for a Retrieval-Augmented Generation (RAG) retrieval result. This is populated only when the RAG retrieval tool is used. This field is not supported in Gemini API. */
    ragChunk?: RagChunk;
    /** The content of the retrieved data source. */
    text?: string;
    /** The title of the retrieved data source. */
    title?: string;
    /** The URI of the retrieved data source. */
    uri?: string;
    /** Optional. User-provided metadata about the retrieved context. This field is not supported in Vertex AI. */
    customMetadata?: GroundingChunkCustomMetadata[];
    /** Optional. Name of the `FileSearchStore` containing the document. Example: `fileSearchStores/123`. This field is not supported in Vertex AI. */
    fileSearchStore?: string;
}

/** A list of string values. This data type is not supported in Vertex AI. */
declare interface GroundingChunkStringList {
    /** The string values of the list. */
    values?: string[];
}

/** A `Web` chunk is a piece of evidence that comes from a web page. It contains the URI of the web page, the title of the page, and the domain of the page. This is used to provide the user with a link to the source of the information. */
declare interface GroundingChunkWeb {
    /** The domain of the web page that contains the evidence. This can be used to filter out low-quality sources. This field is not supported in Gemini API. */
    domain?: string;
    /** The title of the web page that contains the evidence. */
    title?: string;
    /** The URI of the web page that contains the evidence. */
    uri?: string;
}

/** Information for various kinds of grounding. */
declare interface GroundingMetadata {
    /** Optional. The image search queries that were used to generate the content. This field is populated only when the grounding source is Google Search with the Image Search search_type enabled. */
    imageSearchQueries?: string[];
    /** A list of supporting references retrieved from the grounding
     source. This field is populated when the grounding source is Google
     Search, Vertex AI Search, or Google Maps.
     */
    groundingChunks?: GroundingChunk[];
    /** List of grounding support. */
    groundingSupports?: GroundingSupport[];
    /** Metadata related to retrieval in the grounding flow. */
    retrievalMetadata?: RetrievalMetadata;
    /** Optional. Google search entry for the following-up web
     searches. */
    searchEntryPoint?: SearchEntryPoint;
    /** Web search queries for the following-up web search. */
    webSearchQueries?: string[];
    /** Optional. Output only. A token that can be used to render a Google Maps widget with the contextual data. This field is populated only when the grounding source is Google Maps. */
    googleMapsWidgetContextToken?: string;
    /** Optional. The queries that were executed by the retrieval tools. This field is populated only when the grounding source is a retrieval tool, such as Vertex AI Search. This field is not supported in Gemini API. */
    retrievalQueries?: string[];
    /** Optional. Output only. A list of URIs that can be used to flag a place or review for inappropriate content. This field is populated only when the grounding source is Google Maps. This field is not supported in Gemini API. */
    sourceFlaggingUris?: GroundingMetadataSourceFlaggingUri[];
}

/** A URI that can be used to flag a place or review for inappropriate content. This is populated only when the grounding source is Google Maps. This data type is not supported in Gemini API. */
declare interface GroundingMetadataSourceFlaggingUri {
    /** The URI that can be used to flag the content. */
    flagContentUri?: string;
    /** The ID of the place or review. */
    sourceId?: string;
}

/** Grounding support. */
declare interface GroundingSupport {
    /** Confidence score of the support references.

     Ranges from 0 to 1. 1 is the most confident. This list must have the
     same size as the grounding_chunk_indices. */
    confidenceScores?: number[];
    /** A list of indices (into 'grounding_chunk') specifying the
     citations associated with the claim. For instance [1,3,4] means that
     grounding_chunk[1], grounding_chunk[3], grounding_chunk[4] are the
     retrieved content attributed to the claim. */
    groundingChunkIndices?: number[];
    /** Segment of the content this support belongs to. */
    segment?: Segment;
    /** Indices into the `rendered_parts` field of the `GroundingMetadata` message. These indices specify which rendered parts are associated with this support message. */
    renderedParts?: number[];
}

/** The method for blocking content. If not specified, the default behavior is to use the probability score. This enum is not supported in Gemini API. */
declare enum HarmBlockMethod {
    /**
     * The harm block method is unspecified.
     */
    HARM_BLOCK_METHOD_UNSPECIFIED = "HARM_BLOCK_METHOD_UNSPECIFIED",
    /**
     * The harm block method uses both probability and severity scores.
     */
    SEVERITY = "SEVERITY",
    /**
     * The harm block method uses the probability score.
     */
    PROBABILITY = "PROBABILITY"
}

/** The threshold for blocking content. If the harm probability exceeds this threshold, the content will be blocked. */
declare enum HarmBlockThreshold {
    /**
     * The harm block threshold is unspecified.
     */
    HARM_BLOCK_THRESHOLD_UNSPECIFIED = "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
    /**
     * Block content with a low harm probability or higher.
     */
    BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
    /**
     * Block content with a medium harm probability or higher.
     */
    BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
    /**
     * Block content with a high harm probability.
     */
    BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
    /**
     * Do not block any content, regardless of its harm probability.
     */
    BLOCK_NONE = "BLOCK_NONE",
    /**
     * Turn off the safety filter entirely.
     */
    OFF = "OFF"
}

/** The harm category to be blocked. */
declare enum HarmCategory {
    /**
     * Default value. This value is unused.
     */
    HARM_CATEGORY_UNSPECIFIED = "HARM_CATEGORY_UNSPECIFIED",
    /**
     * Abusive, threatening, or content intended to bully, torment, or ridicule.
     */
    HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT",
    /**
     * Content that promotes violence or incites hatred against individuals or groups based on certain attributes.
     */
    HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH",
    /**
     * Content that contains sexually explicit material.
     */
    HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    /**
     * Content that promotes, facilitates, or enables dangerous activities.
     */
    HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT",
    /**
     * Deprecated: Election filter is not longer supported. The harm category is civic integrity.
     */
    HARM_CATEGORY_CIVIC_INTEGRITY = "HARM_CATEGORY_CIVIC_INTEGRITY",
    /**
     * Images that contain hate speech. This enum value is not supported in Gemini API.
     */
    HARM_CATEGORY_IMAGE_HATE = "HARM_CATEGORY_IMAGE_HATE",
    /**
     * Images that contain dangerous content. This enum value is not supported in Gemini API.
     */
    HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT = "HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT",
    /**
     * Images that contain harassment. This enum value is not supported in Gemini API.
     */
    HARM_CATEGORY_IMAGE_HARASSMENT = "HARM_CATEGORY_IMAGE_HARASSMENT",
    /**
     * Images that contain sexually explicit content. This enum value is not supported in Gemini API.
     */
    HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT = "HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT",
    /**
     * Prompts designed to bypass safety filters. This enum value is not supported in Gemini API.
     */
    HARM_CATEGORY_JAILBREAK = "HARM_CATEGORY_JAILBREAK"
}

/** Output only. The probability of harm for this category. */
declare enum HarmProbability {
    /**
     * The harm probability is unspecified.
     */
    HARM_PROBABILITY_UNSPECIFIED = "HARM_PROBABILITY_UNSPECIFIED",
    /**
     * The harm probability is negligible.
     */
    NEGLIGIBLE = "NEGLIGIBLE",
    /**
     * The harm probability is low.
     */
    LOW = "LOW",
    /**
     * The harm probability is medium.
     */
    MEDIUM = "MEDIUM",
    /**
     * The harm probability is high.
     */
    HIGH = "HIGH"
}

/** Output only. The severity of harm for this category. This enum is not supported in Gemini API. */
declare enum HarmSeverity {
    /**
     * The harm severity is unspecified.
     */
    HARM_SEVERITY_UNSPECIFIED = "HARM_SEVERITY_UNSPECIFIED",
    /**
     * The harm severity is negligible.
     */
    HARM_SEVERITY_NEGLIGIBLE = "HARM_SEVERITY_NEGLIGIBLE",
    /**
     * The harm severity is low.
     */
    HARM_SEVERITY_LOW = "HARM_SEVERITY_LOW",
    /**
     * The harm severity is medium.
     */
    HARM_SEVERITY_MEDIUM = "HARM_SEVERITY_MEDIUM",
    /**
     * The harm severity is high.
     */
    HARM_SEVERITY_HIGH = "HARM_SEVERITY_HIGH"
}

/** The location of the API key. This enum is not supported in Gemini API. */
declare enum HttpElementLocation {
    HTTP_IN_UNSPECIFIED = "HTTP_IN_UNSPECIFIED",
    /**
     * Element is in the HTTP request query.
     */
    HTTP_IN_QUERY = "HTTP_IN_QUERY",
    /**
     * Element is in the HTTP request header.
     */
    HTTP_IN_HEADER = "HTTP_IN_HEADER",
    /**
     * Element is in the HTTP request path.
     */
    HTTP_IN_PATH = "HTTP_IN_PATH",
    /**
     * Element is in the HTTP request body.
     */
    HTTP_IN_BODY = "HTTP_IN_BODY",
    /**
     * Element is in the HTTP request cookie.
     */
    HTTP_IN_COOKIE = "HTTP_IN_COOKIE"
}

/** HTTP options to be used in each of the requests. */
declare interface HttpOptions {
    /** The base URL for the AI platform service endpoint. */
    baseUrl?: string;
    /** The resource scope used to constructing the resource name when base_url is set */
    baseUrlResourceScope?: ResourceScope;
    /** Specifies the version of the API to use. */
    apiVersion?: string;
    /** Additional HTTP headers to be sent with the request. */
    headers?: Record<string, string>;
    /** Timeout for the request in milliseconds. */
    timeout?: number;
    /** Extra parameters to add to the request body.
     The structure must match the backend API's request structure.
     - VertexAI backend API docs: https://cloud.google.com/vertex-ai/docs/reference/rest
     - GeminiAPI backend API docs: https://ai.google.dev/api/rest */
    extraBody?: Record<string, unknown>;
    /** HTTP retry options for the request. */
    retryOptions?: HttpRetryOptions;
}

/**
 * Represents the necessary information to send a request to an API endpoint.
 * This interface defines the structure for constructing and executing HTTP
 * requests.
 */
export declare interface HttpRequest {
    /**
     * URL path from the modules, this path is appended to the base API URL to
     * form the complete request URL.
     *
     * If you wish to set full URL, use httpOptions.baseUrl instead. Example to
     * set full URL in the request:
     *
     * const request: HttpRequest = {
     *   path: '',
     *   httpOptions: {
     *     baseUrl: 'https://<custom-full-url>',
     *     apiVersion: '',
     *   },
     *   httpMethod: 'GET',
     * };
     *
     * The result URL will be: https://<custom-full-url>
     *
     */
    path: string;
    /**
     * Optional query parameters to be appended to the request URL.
     */
    queryParams?: Record<string, string>;
    /**
     * Optional request body in json string or Blob format, GET request doesn't
     * need a request body.
     */
    body?: string | Blob;
    /**
     * The HTTP method to be used for the request.
     */
    httpMethod: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    /**
     * Optional set of customizable configuration for HTTP requests.
     */
    httpOptions?: types.HttpOptions;
    /**
     * Optional abort signal which can be used to cancel the request.
     */
    abortSignal?: AbortSignal;
}

/** A wrapper class for the http response. */
declare class HttpResponse {
    /** Used to retain the processed HTTP headers in the response. */
    headers?: Record<string, string>;
    /**
     * The original http response.
     */
    responseInternal: Response;
    constructor(response: Response);
    json(): Promise<unknown>;
}

/** HTTP retry options to be used in each of the requests. */
declare interface HttpRetryOptions {
    /** Maximum number of attempts, including the original request.
     If 0 or 1, it means no retries. If not specified, default to 5. */
    attempts?: number;
}

/** An image. */
declare interface Image_2 {
    /** The Cloud Storage URI of the image. ``Image`` can contain a value
     for this field or the ``image_bytes`` field but not both. */
    gcsUri?: string;
    /** The image bytes data. ``Image`` can contain a value for this field
     or the ``gcs_uri`` field but not both.
     * @remarks Encoded as base64 string. */
    imageBytes?: string;
    /** The MIME type of the image. */
    mimeType?: string;
}

/** The image generation configuration to be used in GenerateContentConfig. */
declare interface ImageConfig {
    /** Aspect ratio of the generated images. Supported values are
     "1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", and "21:9". */
    aspectRatio?: string;
    /** Optional. Specifies the size of generated images. Supported
     values are `1K`, `2K`, `4K`. If not specified, the model will use default
     value `1K`. */
    imageSize?: string;
    /** Controls the generation of people. Supported values are:
     ALLOW_ALL, ALLOW_ADULT, ALLOW_NONE. */
    personGeneration?: string;
    /** Optional. Controls whether prominent people (celebrities) generation is allowed. If used with personGeneration, personGeneration enum would take precedence. For instance, if ALLOW_NONE is set, all person generation would be blocked. If this field is unspecified, the default behavior is to allow prominent people. This field is not supported in Gemini API. */
    prominentPeople?: ProminentPeople;
    /** MIME type of the generated image. This field is not
     supported in Gemini API. */
    outputMimeType?: string;
    /** Compression quality of the generated image (for
     ``image/jpeg`` only). This field is not supported in Gemini API. */
    outputCompressionQuality?: number;
    /** Optional. The image output format for generated images. This field is not supported in Gemini API. */
    imageOutputOptions?: ImageConfigImageOutputOptions;
}

/** The image output format for generated images. This data type is not supported in Gemini API. */
declare interface ImageConfigImageOutputOptions {
    /** Optional. The compression quality of the output image. */
    compressionQuality?: number;
    /** Optional. The image format that the output should be saved as. */
    mimeType?: string;
}

/** Enum that specifies the language of the text in the prompt. */
declare enum ImagePromptLanguage {
    /**
     * Auto-detect the language.
     */
    auto = "auto",
    /**
     * English
     */
    en = "en",
    /**
     * Japanese
     */
    ja = "ja",
    /**
     * Korean
     */
    ko = "ko",
    /**
     * Hindi
     */
    hi = "hi",
    /**
     * Chinese
     */
    zh = "zh",
    /**
     * Portuguese
     */
    pt = "pt",
    /**
     * Spanish
     */
    es = "es"
}

/** Image search for grounding and related configurations. */
declare interface ImageSearch {
}

/** Optional parameters for importing a file. */
declare interface ImportFileConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** User provided custom metadata stored as key-value pairs used for querying. */
    customMetadata?: CustomMetadata[];
    /** Config for telling the service how to chunk the file. */
    chunkingConfig?: ChunkingConfig;
}

/** Long-running operation for importing a file to a FileSearchStore. */
declare class ImportFileOperation implements Operation<ImportFileResponse> {
    /** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
    name?: string;
    /** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata.  Any method that returns a long-running operation should document the metadata type, if any. */
    metadata?: Record<string, unknown>;
    /** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
    done?: boolean;
    /** The error result of the operation in case of failure or cancellation. */
    error?: Record<string, unknown>;
    /** The result of the ImportFile operation, available when the operation is done. */
    response?: ImportFileResponse;
    /**
     * Instantiates an Operation of the same type as the one being called with the fields set from the API response.
     */
    _fromAPIResponse({ apiResponse, _isVertexAI, }: OperationFromAPIResponseParameters): Operation<ImportFileResponse>;
    /** The full HTTP response. */
    sdkHttpResponse?: HttpResponse;
}

/** Config for file_search_stores.import_file parameters. */
declare interface ImportFileParameters {
    /** The resource name of the FileSearchStore. Example: `fileSearchStores/my-file-search-store-123` */
    fileSearchStoreName: string;
    /** The name of the File API File to import. Example: `files/abc-123` */
    fileName: string;
    /** Optional parameters for the request. */
    config?: ImportFileConfig;
}

/** Response for ImportFile to import a File API file with a file search store. */
declare class ImportFileResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** The name of the FileSearchStore containing Documents. */
    parent?: string;
    /** The identifier for the Document imported. */
    documentName?: string;
}

/** Config for `inlined_embedding_responses` parameter. */
declare class InlinedEmbedContentResponse {
    /** Output only. The response to the request. */
    response?: SingleEmbedContentResponse;
    /** Output only. The error encountered while processing the request. */
    error?: JobError;
    /** Output only. The metadata associated with the request. */
    metadata?: Record<string, unknown>;
}

/** Config for inlined request. */
declare interface InlinedRequest {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model?: string;
    /** Content of the request.
     */
    contents?: ContentListUnion;
    /** The metadata to be associated with the request. */
    metadata?: Record<string, string>;
    /** Configuration that contains optional model parameters.
     */
    config?: GenerateContentConfig;
}

/** Config for `inlined_responses` parameter. */
declare class InlinedResponse {
    /** The response to the request.
     */
    response?: GenerateContentResponse;
    /** The metadata to be associated with the request. */
    metadata?: Record<string, string>;
    /** The error encountered while processing the request.
     */
    error?: JobError;
}

/** Parameters for the private _Register method. */
declare interface InternalRegisterFilesParameters {
    /** The Google Cloud Storage URIs to register. Example: `gs://bucket/object`. */
    uris: string[];
    /** Used to override the default configuration. */
    config?: RegisterFilesConfig;
}

/** Represents a time interval, encoded as a Timestamp start (inclusive) and a Timestamp end (exclusive). The start must be less than or equal to the end. When the start equals the end, the interval is empty (matches no time). When both start and end are unspecified, the interval matches any time. */
declare interface Interval {
    /** Optional. Exclusive end of the interval. If specified, a Timestamp matching this interval will have to be before the end. */
    endTime?: string;
    /** Optional. Inclusive start of the interval. If specified, a Timestamp matching this interval will have to be the same or after the start. */
    startTime?: string;
}

/** Job error. */
declare interface JobError {
    /** A list of messages that carry the error details. There is a common set of message types for APIs to use. */
    details?: string[];
    /** The status code. */
    code?: number;
    /** A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the `details` field. */
    message?: string;
}

/** Job state. */
declare enum JobState {
    /**
     * The job state is unspecified.
     */
    JOB_STATE_UNSPECIFIED = "JOB_STATE_UNSPECIFIED",
    /**
     * The job has been just created or resumed and processing has not yet begun.
     */
    JOB_STATE_QUEUED = "JOB_STATE_QUEUED",
    /**
     * The service is preparing to run the job.
     */
    JOB_STATE_PENDING = "JOB_STATE_PENDING",
    /**
     * The job is in progress.
     */
    JOB_STATE_RUNNING = "JOB_STATE_RUNNING",
    /**
     * The job completed successfully.
     */
    JOB_STATE_SUCCEEDED = "JOB_STATE_SUCCEEDED",
    /**
     * The job failed.
     */
    JOB_STATE_FAILED = "JOB_STATE_FAILED",
    /**
     * The job is being cancelled. From this state the job may only go to either `JOB_STATE_SUCCEEDED`, `JOB_STATE_FAILED` or `JOB_STATE_CANCELLED`.
     */
    JOB_STATE_CANCELLING = "JOB_STATE_CANCELLING",
    /**
     * The job has been cancelled.
     */
    JOB_STATE_CANCELLED = "JOB_STATE_CANCELLED",
    /**
     * The job has been stopped, and can be resumed.
     */
    JOB_STATE_PAUSED = "JOB_STATE_PAUSED",
    /**
     * The job has expired.
     */
    JOB_STATE_EXPIRED = "JOB_STATE_EXPIRED",
    /**
     * The job is being updated. Only jobs in the `JOB_STATE_RUNNING` state can be updated. After updating, the job goes back to the `JOB_STATE_RUNNING` state.
     */
    JOB_STATE_UPDATING = "JOB_STATE_UPDATING",
    /**
     * The job is partially succeeded, some results may be missing due to errors.
     */
    JOB_STATE_PARTIALLY_SUCCEEDED = "JOB_STATE_PARTIALLY_SUCCEEDED"
}

/** Programming language of the `code`. */
declare enum Language {
    /**
     * Unspecified language. This value should not be used.
     */
    LANGUAGE_UNSPECIFIED = "LANGUAGE_UNSPECIFIED",
    /**
     * Python >= 3.10, with numpy and simpy available.
     */
    PYTHON = "PYTHON"
}

/** An object that represents a latitude/longitude pair.

 This is expressed as a pair of doubles to represent degrees latitude and
 degrees longitude. Unless specified otherwise, this object must conform to the
 <a href="https://en.wikipedia.org/wiki/World_Geodetic_System#1984_version">
 WGS84 standard</a>. Values must be within normalized ranges. */
declare interface LatLng {
    /** The latitude in degrees. It must be in the range [-90.0, +90.0]. */
    latitude?: number;
    /** The longitude in degrees. It must be in the range [-180.0, +180.0] */
    longitude?: number;
}

/** Config for optional parameters. */
declare interface ListBatchJobsConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    pageSize?: number;
    pageToken?: string;
    filter?: string;
}

/** Config for batches.list parameters. */
declare interface ListBatchJobsParameters {
    config?: ListBatchJobsConfig;
}

/** Config for batches.list return value. */
declare class ListBatchJobsResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    nextPageToken?: string;
    batchJobs?: BatchJob[];
}

/** Config for caches.list method. */
declare interface ListCachedContentsConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    pageSize?: number;
    pageToken?: string;
}

/** Parameters for caches.list method. */
declare interface ListCachedContentsParameters {
    /** Configuration that contains optional parameters.
     */
    config?: ListCachedContentsConfig;
}

declare class ListCachedContentsResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    nextPageToken?: string;
    /** List of cached contents.
     */
    cachedContents?: CachedContent[];
}

/** Config for optional parameters. */
declare interface ListDocumentsConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    pageSize?: number;
    pageToken?: string;
}

/** Config for documents.list parameters. */
declare interface ListDocumentsParameters {
    /** The resource name of the FileSearchStores. Example: `fileSearchStore/file-search-store-foo` */
    parent: string;
    config?: ListDocumentsConfig;
}

/** Config for documents.list return value. */
declare class ListDocumentsResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no more pages. */
    nextPageToken?: string;
    /** The returned `Document`s. */
    documents?: Document_2[];
}

declare interface ListFilesConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    pageSize?: number;
    pageToken?: string;
}

/** Optional parameters for listing FileSearchStore. */
declare interface ListFileSearchStoresConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    pageSize?: number;
    pageToken?: string;
}

/** Config for file_search_stores.list parameters. */
declare interface ListFileSearchStoresParameters {
    /** Optional parameters for the list request. */
    config?: ListFileSearchStoresConfig;
}

/** Config for file_search_stores.list return value. */
declare class ListFileSearchStoresResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no more pages. */
    nextPageToken?: string;
    /** The returned file search stores. */
    fileSearchStores?: FileSearchStore[];
}

/** Generates the parameters for the list method. */
declare interface ListFilesParameters {
    /** Used to override the default configuration. */
    config?: ListFilesConfig;
}

/** Response for the list files method. */
declare class ListFilesResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** A token that can be sent as a `page_token` into a subsequent `ListFiles` call. */
    nextPageToken?: string;
    /** The list of `File`s. */
    files?: File_2[];
}

declare interface ListModelsConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    pageSize?: number;
    pageToken?: string;
    filter?: string;
    /** Set true to list base models, false to list tuned models. */
    queryBase?: boolean;
}

declare interface ListModelsParameters {
    config?: ListModelsConfig;
}

declare class ListModelsResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    nextPageToken?: string;
    models?: Model[];
}

/** Configuration for the list tuning jobs method. */
declare interface ListTuningJobsConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    pageSize?: number;
    pageToken?: string;
    filter?: string;
}

/** Parameters for the list tuning jobs method. */
declare interface ListTuningJobsParameters {
    config?: ListTuningJobsConfig;
}

/** Response for the list tuning jobs method. */
declare class ListTuningJobsResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** A token to retrieve the next page of results. Pass this token in a subsequent [GenAiTuningService.ListTuningJobs] call to retrieve the next page of results. */
    nextPageToken?: string;
    /** The tuning jobs that match the request. */
    tuningJobs?: TuningJob[];
}

/** Callbacks for the live API. */
declare interface LiveCallbacks {
    /**
     * Called when the websocket connection is established.
     */
    onopen?: (() => void) | null;
    /**
     * Called when a message is received from the server.
     */
    onmessage: (e: LiveServerMessage) => void;
    /**
     * Called when an error occurs.
     */
    onerror?: ((e: ErrorEvent) => void) | null;
    /**
     * Called when the websocket connection is closed.
     */
    onclose?: ((e: CloseEvent) => void) | null;
}

/** Incremental update of the current conversation delivered from the client.

 All the content here will unconditionally be appended to the conversation
 history and used as part of the prompt to the model to generate content.

 A message here will interrupt any current model generation. */
declare interface LiveClientContent {
    /** The content appended to the current conversation with the model.

     For single-turn queries, this is a single instance. For multi-turn
     queries, this is a repeated field that contains conversation history and
     latest request.
     */
    turns?: Content[];
    /** If true, indicates that the server content generation should start with
     the currently accumulated prompt. Otherwise, the server will await
     additional messages before starting generation. */
    turnComplete?: boolean;
}

/** Messages sent by the client in the API call. */
declare interface LiveClientMessage {
    /** Message to be sent by the system when connecting to the API. SDK users should not send this message. */
    setup?: LiveClientSetup;
    /** Incremental update of the current conversation delivered from the client. */
    clientContent?: LiveClientContent;
    /** User input that is sent in real time. */
    realtimeInput?: LiveClientRealtimeInput;
    /** Response to a `ToolCallMessage` received from the server. */
    toolResponse?: LiveClientToolResponse;
}

/** User input that is sent in real time.

 This is different from `LiveClientContent` in a few ways:

 - Can be sent continuously without interruption to model generation.
 - If there is a need to mix data interleaved across the
 `LiveClientContent` and the `LiveClientRealtimeInput`, server attempts to
 optimize for best response, but there are no guarantees.
 - End of turn is not explicitly specified, but is rather derived from user
 activity (for example, end of speech).
 - Even before the end of turn, the data is processed incrementally
 to optimize for a fast start of the response from the model.
 - Is always assumed to be the user's input (cannot be used to populate
 conversation history). */
declare interface LiveClientRealtimeInput {
    /** Inlined bytes data for media input. */
    mediaChunks?: Blob_2[];
    /** The realtime audio input stream. */
    audio?: Blob_2;
    /**
     Indicates that the audio stream has ended, e.g. because the microphone was
     turned off.

     This should only be sent when automatic activity detection is enabled
     (which is the default).

     The client can reopen the stream by sending an audio message.
     */
    audioStreamEnd?: boolean;
    /** The realtime video input stream. */
    video?: Blob_2;
    /** The realtime text input stream. */
    text?: string;
    /** Marks the start of user activity. */
    activityStart?: ActivityStart;
    /** Marks the end of user activity. */
    activityEnd?: ActivityEnd;
}

/** Message contains configuration that will apply for the duration of the streaming session. */
declare interface LiveClientSetup {
    /**
     The fully qualified name of the publisher model or tuned model endpoint to
     use.
     */
    model?: string;
    /** The generation configuration for the session.
     Note: only a subset of fields are supported.
     */
    generationConfig?: GenerationConfig;
    /** The user provided system instructions for the model.
     Note: only text should be used in parts and content in each part will be
     in a separate paragraph. */
    systemInstruction?: ContentUnion;
    /**  A list of `Tools` the model may use to generate the next response.

     A `Tool` is a piece of code that enables the system to interact with
     external systems to perform an action, or set of actions, outside of
     knowledge and scope of the model. */
    tools?: ToolListUnion;
    /** Configures the realtime input behavior in BidiGenerateContent. */
    realtimeInputConfig?: RealtimeInputConfig;
    /** Configures session resumption mechanism.

     If included server will send SessionResumptionUpdate messages. */
    sessionResumption?: SessionResumptionConfig;
    /** Configures context window compression mechanism.

     If included, server will compress context window to fit into given length. */
    contextWindowCompression?: ContextWindowCompressionConfig;
    /** The transcription of the input aligns with the input audio language.
     */
    inputAudioTranscription?: AudioTranscriptionConfig;
    /** The transcription of the output aligns with the language code
     specified for the output audio.
     */
    outputAudioTranscription?: AudioTranscriptionConfig;
    /** Configures the proactivity of the model. This allows the model to respond proactively to
     the input and to ignore irrelevant input. */
    proactivity?: ProactivityConfig;
    /** Configures the explicit VAD signal. If enabled, the client will send
     vad_signal to indicate the start and end of speech. This allows the server
     to process the audio more efficiently. */
    explicitVadSignal?: boolean;
}

/** Client generated response to a `ToolCall` received from the server.

 Individual `FunctionResponse` objects are matched to the respective
 `FunctionCall` objects by the `id` field.

 Note that in the unary and server-streaming GenerateContent APIs function
 calling happens by exchanging the `Content` parts, while in the bidi
 GenerateContent APIs function calling happens over this dedicated set of
 messages. */
declare class LiveClientToolResponse {
    /** The response to the function calls. */
    functionResponses?: FunctionResponse[];
}

/** Session config for the API connection. */
declare interface LiveConnectConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** The generation configuration for the session. */
    generationConfig?: GenerationConfig;
    /** The requested modalities of the response. Represents the set of
     modalities that the model can return. Defaults to AUDIO if not specified.
     */
    responseModalities?: Modality[];
    /** Value that controls the degree of randomness in token selection.
     Lower temperatures are good for prompts that require a less open-ended or
     creative response, while higher temperatures can lead to more diverse or
     creative results.
     */
    temperature?: number;
    /** Tokens are selected from the most to least probable until the sum
     of their probabilities equals this value. Use a lower value for less
     random responses and a higher value for more random responses.
     */
    topP?: number;
    /** For each token selection step, the ``top_k`` tokens with the
     highest probabilities are sampled. Then tokens are further filtered based
     on ``top_p`` with the final token selected using temperature sampling. Use
     a lower number for less random responses and a higher number for more
     random responses.
     */
    topK?: number;
    /** Maximum number of tokens that can be generated in the response.
     */
    maxOutputTokens?: number;
    /** If specified, the media resolution specified will be used.
     */
    mediaResolution?: MediaResolution;
    /** When ``seed`` is fixed to a specific number, the model makes a best
     effort to provide the same response for repeated requests. By default, a
     random number is used.
     */
    seed?: number;
    /** The speech generation configuration.
     */
    speechConfig?: SpeechConfig;
    /** Config for thinking features.
     An error will be returned if this field is set for models that don't
     support thinking.
     */
    thinkingConfig?: ThinkingConfig;
    /** If enabled, the model will detect emotions and adapt its responses accordingly. */
    enableAffectiveDialog?: boolean;
    /** The user provided system instructions for the model.
     Note: only text should be used in parts and content in each part will be
     in a separate paragraph. */
    systemInstruction?: ContentUnion;
    /** A list of `Tools` the model may use to generate the next response.

     A `Tool` is a piece of code that enables the system to interact with
     external systems to perform an action, or set of actions, outside of
     knowledge and scope of the model. */
    tools?: ToolListUnion;
    /** Configures session resumption mechanism.

     If included the server will send SessionResumptionUpdate messages. */
    sessionResumption?: SessionResumptionConfig;
    /** The transcription of the input aligns with the input audio language.
     */
    inputAudioTranscription?: AudioTranscriptionConfig;
    /** The transcription of the output aligns with the language code
     specified for the output audio.
     */
    outputAudioTranscription?: AudioTranscriptionConfig;
    /** Configures the realtime input behavior in BidiGenerateContent. */
    realtimeInputConfig?: RealtimeInputConfig;
    /** Configures context window compression mechanism.

     If included, server will compress context window to fit into given length. */
    contextWindowCompression?: ContextWindowCompressionConfig;
    /** Configures the proactivity of the model. This allows the model to respond proactively to
     the input and to ignore irrelevant input. */
    proactivity?: ProactivityConfig;
    /** Configures the explicit VAD signal. If enabled, the client will send
     vad_signal to indicate the start and end of speech. This allows the server
     to process the audio more efficiently. */
    explicitVadSignal?: boolean;
}

/** Config for LiveConnectConstraints for Auth Token creation. */
declare interface LiveConnectConstraints {
    /** ID of the model to configure in the ephemeral token for Live API.
     For a list of models, see `Gemini models
     <https://ai.google.dev/gemini-api/docs/models>`. */
    model?: string;
    /** Configuration specific to Live API connections created using this token. */
    config?: LiveConnectConfig;
}

/** Parameters for connecting to the live API. */
declare interface LiveConnectParameters {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** callbacks */
    callbacks: LiveCallbacks;
    /** Optional configuration parameters for the request.
     */
    config?: LiveConnectConfig;
}

/** Callbacks for the realtime music API. */
declare interface LiveMusicCallbacks {
    /**
     * Called when a message is received from the server.
     */
    onmessage: (e: LiveMusicServerMessage) => void;
    /**
     * Called when an error occurs.
     */
    onerror?: ((e: ErrorEvent) => void) | null;
    /**
     * Called when the websocket connection is closed.
     */
    onclose?: ((e: CloseEvent) => void) | null;
}

/** User input to start or steer the music. */
declare interface LiveMusicClientContent {
    /** Weighted prompts as the model input. */
    weightedPrompts?: WeightedPrompt[];
}

/** Messages sent by the client in the LiveMusicClientMessage call. */
declare interface LiveMusicClientMessage {
    /** Message to be sent in the first (and only in the first) `LiveMusicClientMessage`.
     Clients should wait for a `LiveMusicSetupComplete` message before
     sending any additional messages. */
    setup?: LiveMusicClientSetup;
    /** User input to influence music generation. */
    clientContent?: LiveMusicClientContent;
    /** Configuration for music generation. */
    musicGenerationConfig?: LiveMusicGenerationConfig;
    /** Playback control signal for the music generation. */
    playbackControl?: LiveMusicPlaybackControl;
}

/** Message to be sent by the system when connecting to the API. */
declare interface LiveMusicClientSetup {
    /** The model's resource name. Format: `models/{model}`. */
    model?: string;
}

/** Parameters for connecting to the live API. */
declare interface LiveMusicConnectParameters {
    /** The model's resource name. */
    model: string;
    /** Callbacks invoked on server events. */
    callbacks: LiveMusicCallbacks;
}

/** A prompt that was filtered with the reason. */
declare interface LiveMusicFilteredPrompt {
    /** The text prompt that was filtered. */
    text?: string;
    /** The reason the prompt was filtered. */
    filteredReason?: string;
}

/** Configuration for music generation. */
declare interface LiveMusicGenerationConfig {
    /** Controls the variance in audio generation. Higher values produce
     higher variance. Range is [0.0, 3.0]. */
    temperature?: number;
    /** Controls how the model selects tokens for output. Samples the topK
     tokens with the highest probabilities. Range is [1, 1000]. */
    topK?: number;
    /** Seeds audio generation. If not set, the request uses a randomly
     generated seed. */
    seed?: number;
    /** Controls how closely the model follows prompts.
     Higher guidance follows more closely, but will make transitions more
     abrupt. Range is [0.0, 6.0]. */
    guidance?: number;
    /** Beats per minute. Range is [60, 200]. */
    bpm?: number;
    /** Density of sounds. Range is [0.0, 1.0]. */
    density?: number;
    /** Brightness of the music. Range is [0.0, 1.0]. */
    brightness?: number;
    /** Scale of the generated music. */
    scale?: Scale;
    /** Whether the audio output should contain bass. */
    muteBass?: boolean;
    /** Whether the audio output should contain drums. */
    muteDrums?: boolean;
    /** Whether the audio output should contain only bass and drums. */
    onlyBassAndDrums?: boolean;
    /** The mode of music generation. Default mode is QUALITY. */
    musicGenerationMode?: MusicGenerationMode;
}

/** The playback control signal to apply to the music generation. */
declare enum LiveMusicPlaybackControl {
    /**
     * This value is unused.
     */
    PLAYBACK_CONTROL_UNSPECIFIED = "PLAYBACK_CONTROL_UNSPECIFIED",
    /**
     * Start generating the music.
     */
    PLAY = "PLAY",
    /**
     * Hold the music generation. Use PLAY to resume from the current position.
     */
    PAUSE = "PAUSE",
    /**
     * Stop the music generation and reset the context (prompts retained).
     Use PLAY to restart the music generation.
     */
    STOP = "STOP",
    /**
     * Reset the context of the music generation without stopping it.
     Retains the current prompts and config.
     */
    RESET_CONTEXT = "RESET_CONTEXT"
}

/** Server update generated by the model in response to client messages.

 Content is generated as quickly as possible, and not in real time.
 Clients may choose to buffer and play it out in real time. */
declare interface LiveMusicServerContent {
    /** The audio chunks that the model has generated. */
    audioChunks?: AudioChunk[];
}

/** Response message for the LiveMusicClientMessage call. */
declare class LiveMusicServerMessage {
    /** Message sent in response to a `LiveMusicClientSetup` message from the client.
     Clients should wait for this message before sending any additional messages. */
    setupComplete?: LiveMusicServerSetupComplete;
    /** Content generated by the model in response to client messages. */
    serverContent?: LiveMusicServerContent;
    /** A prompt that was filtered with the reason. */
    filteredPrompt?: LiveMusicFilteredPrompt;
    /**
     * Returns the first audio chunk from the server content, if present.
     *
     * @remarks
     * If there are no audio chunks in the response, undefined will be returned.
     */
    get audioChunk(): AudioChunk | undefined;
}

/** Sent in response to a `LiveMusicClientSetup` message from the client. */
declare interface LiveMusicServerSetupComplete {
}

/** Parameters for setting config for the live music API. */
declare interface LiveMusicSetConfigParameters {
    /** Configuration for music generation. */
    musicGenerationConfig: LiveMusicGenerationConfig;
}

/** Parameters for setting weighted prompts for the live music API. */
declare interface LiveMusicSetWeightedPromptsParameters {
    /** A map of text prompts to weights to use for the generation request. */
    weightedPrompts: WeightedPrompt[];
}

/** Prompts and config used for generating this audio chunk. */
declare interface LiveMusicSourceMetadata {
    /** Weighted prompts for generating this audio chunk. */
    clientContent?: LiveMusicClientContent;
    /** Music generation config for generating this audio chunk. */
    musicGenerationConfig?: LiveMusicGenerationConfig;
}

/** Parameters for sending client content to the live API. */
declare interface LiveSendClientContentParameters {
    /** Client content to send to the session. */
    turns?: ContentListUnion;
    /** If true, indicates that the server content generation should start with
     the currently accumulated prompt. Otherwise, the server will await
     additional messages before starting generation. */
    turnComplete?: boolean;
}

/** Parameters for sending realtime input to the live API. */
declare interface LiveSendRealtimeInputParameters {
    /** Realtime input to send to the session. */
    media?: BlobImageUnion;
    /** The realtime audio input stream. */
    audio?: Blob_2;
    /**
     Indicates that the audio stream has ended, e.g. because the microphone was
     turned off.

     This should only be sent when automatic activity detection is enabled
     (which is the default).

     The client can reopen the stream by sending an audio message.
     */
    audioStreamEnd?: boolean;
    /** The realtime video input stream. */
    video?: BlobImageUnion;
    /** The realtime text input stream. */
    text?: string;
    /** Marks the start of user activity. */
    activityStart?: ActivityStart;
    /** Marks the end of user activity. */
    activityEnd?: ActivityEnd;
}

/** Parameters for sending tool responses to the live API. */
declare class LiveSendToolResponseParameters {
    /** Tool responses to send to the session. */
    functionResponses: FunctionResponse[] | FunctionResponse;
}

/** Incremental server update generated by the model in response to client messages.

 Content is generated as quickly as possible, and not in real time. Clients
 may choose to buffer and play it out in real time. */
declare interface LiveServerContent {
    /** The content that the model has generated as part of the current conversation with the user. */
    modelTurn?: Content;
    /** If true, indicates that the model is done generating. Generation will only start in response to additional client messages. Can be set alongside `content`, indicating that the `content` is the last in the turn. */
    turnComplete?: boolean;
    /** If true, indicates that a client message has interrupted current model generation. If the client is playing out the content in realtime, this is a good signal to stop and empty the current queue. */
    interrupted?: boolean;
    /** Metadata returned to client when grounding is enabled. */
    groundingMetadata?: GroundingMetadata;
    /** If true, indicates that the model is done generating. When model is
     interrupted while generating there will be no generation_complete message
     in interrupted turn, it will go through interrupted > turn_complete.
     When model assumes realtime playback there will be delay between
     generation_complete and turn_complete that is caused by model
     waiting for playback to finish. If true, indicates that the model
     has finished generating all content. This is a signal to the client
     that it can stop sending messages. */
    generationComplete?: boolean;
    /** Input transcription. The transcription is independent to the model
     turn which means it doesn’t imply any ordering between transcription and
     model turn. */
    inputTranscription?: Transcription;
    /** Output transcription. The transcription is independent to the model
     turn which means it doesn’t imply any ordering between transcription and
     model turn.
     */
    outputTranscription?: Transcription;
    /** Metadata related to url context retrieval tool. */
    urlContextMetadata?: UrlContextMetadata;
    /** Reason for the turn is complete. */
    turnCompleteReason?: TurnCompleteReason;
    /** If true, indicates that the model is not generating content because
     it is waiting for more input from the user, e.g. because it expects the
     user to continue talking. */
    waitingForInput?: boolean;
}

/** Server will not be able to service client soon. */
declare interface LiveServerGoAway {
    /** The remaining time before the connection will be terminated as ABORTED. The minimal time returned here is specified differently together with the rate limits for a given model. */
    timeLeft?: string;
}

/** Response message for API call. */
declare class LiveServerMessage {
    /** Sent in response to a `LiveClientSetup` message from the client. */
    setupComplete?: LiveServerSetupComplete;
    /** Content generated by the model in response to client messages. */
    serverContent?: LiveServerContent;
    /** Request for the client to execute the `function_calls` and return the responses with the matching `id`s. */
    toolCall?: LiveServerToolCall;
    /** Notification for the client that a previously issued `ToolCallMessage` with the specified `id`s should have been not executed and should be cancelled. */
    toolCallCancellation?: LiveServerToolCallCancellation;
    /** Usage metadata about model response(s). */
    usageMetadata?: UsageMetadata;
    /** Server will disconnect soon. */
    goAway?: LiveServerGoAway;
    /** Update of the session resumption state. */
    sessionResumptionUpdate?: LiveServerSessionResumptionUpdate;
    /** Voice activity detection signal. Allowlisted only. */
    voiceActivityDetectionSignal?: VoiceActivityDetectionSignal;
    /** Voice activity signal. */
    voiceActivity?: VoiceActivity;
    /**
     * Returns the concatenation of all text parts from the server content if present.
     *
     * @remarks
     * If there are non-text parts in the response, the concatenation of all text
     * parts will be returned, and a warning will be logged.
     */
    get text(): string | undefined;
    /**
     * Returns the concatenation of all inline data parts from the server content if present.
     *
     * @remarks
     * If there are non-inline data parts in the
     * response, the concatenation of all inline data parts will be returned, and
     * a warning will be logged.
     */
    get data(): string | undefined;
}

/** Update of the session resumption state.

 Only sent if `session_resumption` was set in the connection config. */
declare interface LiveServerSessionResumptionUpdate {
    /** New handle that represents state that can be resumed. Empty if `resumable`=false. */
    newHandle?: string;
    /** True if session can be resumed at this point. It might be not possible to resume session at some points. In that case we send update empty new_handle and resumable=false. Example of such case could be model executing function calls or just generating. Resuming session (using previous session token) in such state will result in some data loss. */
    resumable?: boolean;
    /** Index of last message sent by client that is included in state represented by this SessionResumptionToken. Only sent when `SessionResumptionConfig.transparent` is set.

     Presence of this index allows users to transparently reconnect and avoid issue of losing some part of realtime audio input/video. If client wishes to temporarily disconnect (for example as result of receiving GoAway) they can do it without losing state by buffering messages sent since last `SessionResmumptionTokenUpdate`. This field will enable them to limit buffering (avoid keeping all requests in RAM).

     Note: This should not be used for when resuming a session at some time later -- in those cases partial audio and video frames arelikely not needed. */
    lastConsumedClientMessageIndex?: string;
}

/** Sent in response to a `LiveGenerateContentSetup` message from the client. */
declare interface LiveServerSetupComplete {
    /** The session id of the live session. */
    sessionId?: string;
}

/** Request for the client to execute the `function_calls` and return the responses with the matching `id`s. */
declare interface LiveServerToolCall {
    /** The function call to be executed. */
    functionCalls?: FunctionCall[];
}

/** Notification for the client that a previously issued `ToolCallMessage` with the specified `id`s should have been not executed and should be cancelled.

 If there were side-effects to those tool calls, clients may attempt to undo
 the tool calls. This message occurs only in cases where the clients interrupt
 server turns. */
declare interface LiveServerToolCallCancellation {
    /** The ids of the tool calls to be cancelled. */
    ids?: string[];
}

/** The log probabilities of the tokens generated by the model. This is useful for understanding the model's confidence in its predictions and for debugging. For example, you can use log probabilities to identify when the model is making a less confident prediction or to explore alternative responses that the model considered. A low log probability can also indicate that the model is "hallucinating" or generating factually incorrect information. */
declare interface LogprobsResult {
    /** A list of the chosen candidate tokens at each decoding step. The length of this list is equal to the total number of decoding steps. Note that the chosen candidate might not be in `top_candidates`. */
    chosenCandidates?: LogprobsResultCandidate[];
    /** A list of the top candidate tokens at each decoding step. The length of this list is equal to the total number of decoding steps. */
    topCandidates?: LogprobsResultTopCandidates[];
    /** Sum of log probabilities for all tokens. This field is not supported in Vertex AI. */
    logProbabilitySum?: number;
}

/** A single token and its associated log probability. */
declare interface LogprobsResultCandidate {
    /** The log probability of this token. A higher value indicates that the model was more confident in this token. The log probability can be used to assess the relative likelihood of different tokens and to identify when the model is uncertain. */
    logProbability?: number;
    /** The token's string representation. */
    token?: string;
    /** The token's numerical ID. While the `token` field provides the string representation of the token, the `token_id` is the numerical representation that the model uses internally. This can be useful for developers who want to build custom logic based on the model's vocabulary. */
    tokenId?: number;
}

/** A list of the top candidate tokens and their log probabilities at each decoding step. This can be used to see what other tokens the model considered. */
declare interface LogprobsResultTopCandidates {
    /** The list of candidate tokens, sorted by log probability in descending order. */
    candidates?: LogprobsResultCandidate[];
}

/** Configuration for a Mask reference image. */
declare interface MaskReferenceConfig {
    /** Prompts the model to generate a mask instead of you needing to
     provide one (unless MASK_MODE_USER_PROVIDED is used). */
    maskMode?: MaskReferenceMode;
    /** A list of up to 5 class ids to use for semantic segmentation.
     Automatically creates an image mask based on specific objects. */
    segmentationClasses?: number[];
    /** Dilation percentage of the mask provided.
     Float between 0 and 1. */
    maskDilation?: number;
}

/** A mask reference image.

 This encapsulates either a mask image provided by the user and configs for
 the user provided mask, or only config parameters for the model to generate
 a mask.

 A mask image is an image whose non-zero values indicate where to edit the base
 image. If the user provides a mask image, the mask must be in the same
 dimensions as the raw image. */
declare class MaskReferenceImage {
    /** The reference image for the editing operation. */
    referenceImage?: Image_2;
    /** The id of the reference image. */
    referenceId?: number;
    /** The type of the reference image. Only set by the SDK. */
    referenceType?: string;
    /** Configuration for the mask reference image. */
    config?: MaskReferenceConfig;
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI(): ReferenceImageAPIInternal;
}

/** Enum representing the mask mode of a mask reference image. */
declare enum MaskReferenceMode {
    MASK_MODE_DEFAULT = "MASK_MODE_DEFAULT",
    MASK_MODE_USER_PROVIDED = "MASK_MODE_USER_PROVIDED",
    MASK_MODE_BACKGROUND = "MASK_MODE_BACKGROUND",
    MASK_MODE_FOREGROUND = "MASK_MODE_FOREGROUND",
    MASK_MODE_SEMANTIC = "MASK_MODE_SEMANTIC"
}

/** A MCPServer is a server that can be called by the model to perform actions. It is a server that implements the MCP protocol. Next ID: 5. This data type is not supported in Vertex AI. */
declare interface McpServer {
    /** The name of the MCPServer. */
    name?: string;
    /** A transport that can stream HTTP requests and responses. */
    streamableHttpTransport?: StreamableHttpTransport;
}

/** Server content modalities. */
declare enum MediaModality {
    /**
     * The modality is unspecified.
     */
    MODALITY_UNSPECIFIED = "MODALITY_UNSPECIFIED",
    /**
     * Plain text.
     */
    TEXT = "TEXT",
    /**
     * Images.
     */
    IMAGE = "IMAGE",
    /**
     * Video.
     */
    VIDEO = "VIDEO",
    /**
     * Audio.
     */
    AUDIO = "AUDIO",
    /**
     * Document, e.g. PDF.
     */
    DOCUMENT = "DOCUMENT"
}

/** The media resolution to use. */
declare enum MediaResolution {
    /**
     * Media resolution has not been set
     */
    MEDIA_RESOLUTION_UNSPECIFIED = "MEDIA_RESOLUTION_UNSPECIFIED",
    /**
     * Media resolution set to low (64 tokens).
     */
    MEDIA_RESOLUTION_LOW = "MEDIA_RESOLUTION_LOW",
    /**
     * Media resolution set to medium (256 tokens).
     */
    MEDIA_RESOLUTION_MEDIUM = "MEDIA_RESOLUTION_MEDIUM",
    /**
     * Media resolution set to high (zoomed reframing with 256 tokens).
     */
    MEDIA_RESOLUTION_HIGH = "MEDIA_RESOLUTION_HIGH"
}

/** Server content modalities. */
declare enum Modality {
    /**
     * The modality is unspecified.
     */
    MODALITY_UNSPECIFIED = "MODALITY_UNSPECIFIED",
    /**
     * Indicates the model should return text
     */
    TEXT = "TEXT",
    /**
     * Indicates the model should return images.
     */
    IMAGE = "IMAGE",
    /**
     * Indicates the model should return audio.
     */
    AUDIO = "AUDIO"
}

/** Represents token counting info for a single modality. */
declare interface ModalityTokenCount {
    /** The modality associated with this token count. */
    modality?: MediaModality;
    /** The number of tokens counted for this modality. */
    tokenCount?: number;
}

/** A trained machine learning model. */
declare interface Model {
    /** Resource name of the model. */
    name?: string;
    /** Display name of the model. */
    displayName?: string;
    /** Description of the model. */
    description?: string;
    /** Version ID of the model. A new version is committed when a new
     model version is uploaded or trained under an existing model ID. The
     version ID is an auto-incrementing decimal number in string
     representation. */
    version?: string;
    /** List of deployed models created from this base model. Note that a
     model could have been deployed to endpoints in different locations. */
    endpoints?: Endpoint[];
    /** Labels with user-defined metadata to organize your models. */
    labels?: Record<string, string>;
    /** Information about the tuned model from the base model. */
    tunedModelInfo?: TunedModelInfo;
    /** The maximum number of input tokens that the model can handle. */
    inputTokenLimit?: number;
    /** The maximum number of output tokens that the model can generate. */
    outputTokenLimit?: number;
    /** List of actions that are supported by the model. */
    supportedActions?: string[];
    /** The default checkpoint id of a model version.
     */
    defaultCheckpointId?: string;
    /** The checkpoints of the model. */
    checkpoints?: Checkpoint[];
    /** Temperature value used for sampling set when the dataset was saved.
     This value is used to tune the degree of randomness. */
    temperature?: number;
    /** The maximum temperature value used for sampling set when the
     dataset was saved. This value is used to tune the degree of randomness. */
    maxTemperature?: number;
    /** Optional. Specifies the nucleus sampling threshold. The model
     considers only the smallest set of tokens whose cumulative probability is
     at least `top_p`. This helps generate more diverse and less repetitive
     responses. For example, a `top_p` of 0.9 means the model considers tokens
     until the cumulative probability of the tokens to select from reaches 0.9.
     It's recommended to adjust either temperature or `top_p`, but not both. */
    topP?: number;
    /** Optional. Specifies the top-k sampling threshold. The model
     considers only the top k most probable tokens for the next token. This can
     be useful for generating more coherent and less random text. For example,
     a `top_k` of 40 means the model will choose the next word from the 40 most
     likely words. */
    topK?: number;
    /** Whether the model supports thinking features. If true, thoughts are
     returned only if the model supports thought and thoughts are available. */
    thinking?: boolean;
}

/** Configuration for Model Armor. Model Armor is a Google Cloud service that provides safety and security filtering for prompts and responses. It helps protect your AI applications from risks such as harmful content, sensitive data leakage, and prompt injection attacks. This data type is not supported in Gemini API. */
declare interface ModelArmorConfig {
    /** Optional. The resource name of the Model Armor template to use for prompt screening. A Model Armor template is a set of customized filters and thresholds that define how Model Armor screens content. If specified, Model Armor will use this template to check the user's prompt for safety and security risks before it is sent to the model. The name must be in the format `projects/{project}/locations/{location}/templates/{template}`. */
    promptTemplateName?: string;
    /** Optional. The resource name of the Model Armor template to use for response screening. A Model Armor template is a set of customized filters and thresholds that define how Model Armor screens content. If specified, Model Armor will use this template to check the model's response for safety and security risks before it is returned to the user. The name must be in the format `projects/{project}/locations/{location}/templates/{template}`. */
    responseTemplateName?: string;
}

/** Config for model selection. */
declare interface ModelSelectionConfig {
    /** Options for feature selection preference. */
    featureSelectionPreference?: FeatureSelectionPreference;
}

/** The stage of the underlying model. This enum is not supported in Vertex AI. */
declare enum ModelStage {
    /**
     * Unspecified model stage.
     */
    MODEL_STAGE_UNSPECIFIED = "MODEL_STAGE_UNSPECIFIED",
    /**
     * The underlying model is subject to lots of tunings.
     */
    UNSTABLE_EXPERIMENTAL = "UNSTABLE_EXPERIMENTAL",
    /**
     * Models in this stage are for experimental purposes only.
     */
    EXPERIMENTAL = "EXPERIMENTAL",
    /**
     * Models in this stage are more mature than experimental models.
     */
    PREVIEW = "PREVIEW",
    /**
     * Models in this stage are considered stable and ready for production use.
     */
    STABLE = "STABLE",
    /**
     * If the model is on this stage, it means that this model is on the path to deprecation in near future. Only existing customers can use this model.
     */
    LEGACY = "LEGACY",
    /**
     * Models in this stage are deprecated. These models cannot be used.
     */
    DEPRECATED = "DEPRECATED",
    /**
     * Models in this stage are retired. These models cannot be used.
     */
    RETIRED = "RETIRED"
}

/** The status of the underlying model. This is used to indicate the stage of the underlying model and the retirement time if applicable. This data type is not supported in Vertex AI. */
declare interface ModelStatus {
    /** A message explaining the model status. */
    message?: string;
    /** The stage of the underlying model. */
    modelStage?: ModelStage;
    /** The time at which the model will be retired. */
    retirementTime?: string;
}

/**
 * Moves values from source paths to destination paths.
 *
 * Examples:
 *   moveValueByPath(
 *     {'requests': [{'content': v1}, {'content': v2}]},
 *     {'requests[].*': 'requests[].request.*'}
 *   )
 *     -> {'requests': [{'request': {'content': v1}}, {'request': {'content': v2}}]}
 */
export declare function moveValueByPath(data: unknown, paths: Record<string, string>): void;

/** Configuration for a multi-speaker text-to-speech request. */
declare interface MultiSpeakerVoiceConfig {
    /** Required. A list of configurations for the voices of the speakers. Exactly two speaker voice configurations must be provided. */
    speakerVoiceConfigs?: SpeakerVoiceConfig[];
}

/** The mode of music generation. */
declare enum MusicGenerationMode {
    /**
     * Rely on the server default generation mode.
     */
    MUSIC_GENERATION_MODE_UNSPECIFIED = "MUSIC_GENERATION_MODE_UNSPECIFIED",
    /**
     * Steer text prompts to regions of latent space with higher quality
     music.
     */
    QUALITY = "QUALITY",
    /**
     * Steer text prompts to regions of latent space with a larger
     diversity of music.
     */
    DIVERSITY = "DIVERSITY",
    /**
     * Steer text prompts to regions of latent space more likely to
     generate music with vocals.
     */
    VOCALIZATION = "VOCALIZATION"
}

export declare class NodeAuth implements Auth {
    private readonly googleAuth?;
    private readonly apiKey?;
    constructor(opts: NodeAuthOptions);
    addAuthHeaders(headers: Headers, url?: string): Promise<void>;
    private addKeyHeader;
    private addGoogleAuthHeaders;
}

export declare interface NodeAuthOptions {
    /**
     * The API Key. This is required for Gemini API users.
     */
    apiKey?: string;
    /**
     * Optional. These are the authentication options provided by google-auth-library for Vertex AI users.
     * Complete list of authentication options are documented in the
     * GoogleAuthOptions interface:
     * https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts.
     */
    googleAuthOptions?: GoogleAuthOptions;
}

export declare class NodeDownloader implements Downloader {
    download(params: DownloadFileParameters, apiClient: ApiClient): Promise<void>;
}

export declare class NodeUploader implements Uploader {
    stat(file: string | Blob): Promise<FileStat>;
    upload(file: string | Blob, uploadUrl: string, apiClient: ApiClient, httpOptions?: HttpOptions): Promise<File_2>;
    uploadToFileSearchStore(file: string | Blob, uploadUrl: string, apiClient: ApiClient, httpOptions?: HttpOptions): Promise<UploadToFileSearchStoreOperation>;
    /**
     * Infers the MIME type of a file based on its extension.
     *
     * @param filePath The path to the file.
     * @returns The MIME type of the file, or undefined if it cannot be inferred.
     */
    private inferMimeType;
    private uploadFileFromPath;
    private uploadFileToFileSearchStoreFromPath;
    private uploadFileFromPathInternal;
}

/** A long-running operation. */
declare interface Operation<T> {
    /** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
    name?: string;
    /** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata.  Any method that returns a long-running operation should document the metadata type, if any. */
    metadata?: Record<string, unknown>;
    /** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
    done?: boolean;
    /** The error result of the operation in case of failure or cancellation. */
    error?: Record<string, unknown>;
    /** The response if the operation is successful. */
    response?: T;
    /**
     * Instantiates an Operation of the same type as the one being called with the fields set from the API response.
     */
    _fromAPIResponse({ apiResponse, _isVertexAI, }: OperationFromAPIResponseParameters): Operation<T>;
}

/** Parameters of the fromAPIResponse method of the Operation class. */
declare interface OperationFromAPIResponseParameters {
    /** The API response to be converted to an Operation. */
    apiResponse: Record<string, unknown>;
    /** Whether the API response is from Vertex AI. */
    _isVertexAI: boolean;
}

/** Parameters for the get method of the operations module. */
declare interface OperationGetParameters<T, U extends Operation<T>> {
    /** Used to override the default configuration. */
    config?: GetOperationConfig;
    /** The operation to be retrieved. */
    operation: U;
}

/** Outcome of the code execution. */
declare enum Outcome {
    /**
     * Unspecified status. This value should not be used.
     */
    OUTCOME_UNSPECIFIED = "OUTCOME_UNSPECIFIED",
    /**
     * Code execution completed successfully.
     */
    OUTCOME_OK = "OUTCOME_OK",
    /**
     * Code execution finished but with a failure. `stderr` should contain the reason.
     */
    OUTCOME_FAILED = "OUTCOME_FAILED",
    /**
     * Code execution ran for too long, and was cancelled. There may or may not be a partial output present.
     */
    OUTCOME_DEADLINE_EXCEEDED = "OUTCOME_DEADLINE_EXCEEDED"
}

/** Describes the info for output of EvaluationService. This data type is not supported in Gemini API. */
declare interface OutputInfo {
    /** Output only. The full path of the Cloud Storage directory created, into which the evaluation results and aggregation results are written. */
    gcsOutputDirectory?: string;
}

/** Output only. Pairwise metric choice. This enum is not supported in Gemini API. */
declare enum PairwiseChoice {
    /**
     * Unspecified prediction choice.
     */
    PAIRWISE_CHOICE_UNSPECIFIED = "PAIRWISE_CHOICE_UNSPECIFIED",
    /**
     * Baseline prediction wins
     */
    BASELINE = "BASELINE",
    /**
     * Candidate prediction wins
     */
    CANDIDATE = "CANDIDATE",
    /**
     * Winner cannot be determined
     */
    TIE = "TIE"
}

/** Spec for pairwise metric result. This data type is not supported in Gemini API. */
declare interface PairwiseMetricResult {
    /** Output only. Spec for custom output. */
    customOutput?: CustomOutput;
    /** Output only. Explanation for pairwise metric score. */
    explanation?: string;
    /** Output only. Pairwise metric choice. */
    pairwiseChoice?: PairwiseChoice;
}

/** A datatype containing media content.

 Exactly one field within a Part should be set, representing the specific type
 of content being conveyed. Using multiple fields within the same `Part`
 instance is considered invalid. */
declare interface Part {
    /** Media resolution for the input media.
     */
    mediaResolution?: PartMediaResolution;
    /** Optional. The result of executing the ExecutableCode. */
    codeExecutionResult?: CodeExecutionResult;
    /** Optional. Code generated by the model that is intended to be executed. */
    executableCode?: ExecutableCode;
    /** Optional. The URI-based data of the part. This can be used to include files from Google Cloud Storage. */
    fileData?: FileData;
    /** Optional. A predicted function call returned from the model. This contains the name of the function to call and the arguments to pass to the function. */
    functionCall?: FunctionCall;
    /** Optional. The result of a function call. This is used to provide the model with the result of a function call that it predicted. */
    functionResponse?: FunctionResponse;
    /** Optional. The inline data content of the part. This can be used to include images, audio, or video in a request. */
    inlineData?: Blob_2;
    /** Optional. The text content of the part. When sent from the VSCode Gemini Code Assist extension, references to @mentioned items will be converted to markdown boldface text. For example `@my-repo` will be converted to and sent as `**my-repo**` by the IDE agent. */
    text?: string;
    /** Optional. Indicates whether the `part` represents the model's thought process or reasoning. */
    thought?: boolean;
    /** Optional. An opaque signature for the thought so it can be reused in subsequent requests.
     * @remarks Encoded as base64 string. */
    thoughtSignature?: string;
    /** Optional. Video metadata. The metadata should only be specified while the video data is presented in inline_data or file_data. */
    videoMetadata?: VideoMetadata;
    /** Server-side tool call. This field is populated when the model predicts a tool invocation that should be executed on the server. The client is expected to echo this message back to the API. */
    toolCall?: ToolCall;
    /** The output from a server-side ToolCall execution. This field is populated by the client with the results of executing the corresponding ToolCall. */
    toolResponse?: ToolResponse;
    /** Custom metadata associated with the Part. Agents using genai.Part as content representation may need to keep track of the additional information. For example it can be name of a file/source from which the Part originates or a way to multiplex multiple Part streams. This field is not supported in Vertex AI. */
    partMetadata?: Record<string, unknown>;
}

/** Partial argument value of the function call. This data type is not supported in Gemini API. */
declare interface PartialArg {
    /** Optional. Represents a boolean value. */
    boolValue?: boolean;
    /** Required. A JSON Path (RFC 9535) to the argument being streamed. https://datatracker.ietf.org/doc/html/rfc9535. e.g. "$.foo.bar[0].data". */
    jsonPath?: string;
    /** Optional. Represents a null value. */
    nullValue?: 'NULL_VALUE';
    /** Optional. Represents a double value. */
    numberValue?: number;
    /** Optional. Represents a string value. */
    stringValue?: string;
    /** Optional. Whether this is not the last part of the same json_path. If true, another PartialArg message for the current json_path is expected to follow. */
    willContinue?: boolean;
}

declare type PartListUnion = PartUnion[] | PartUnion;

/** Media resolution for the input media. */
declare interface PartMediaResolution {
    /** The tokenization quality used for given media.
     */
    level?: PartMediaResolutionLevel;
    /** Specifies the required sequence length for media tokenization.
     */
    numTokens?: number;
}

/** The tokenization quality used for given media. */
declare enum PartMediaResolutionLevel {
    /**
     * Media resolution has not been set.
     */
    MEDIA_RESOLUTION_UNSPECIFIED = "MEDIA_RESOLUTION_UNSPECIFIED",
    /**
     * Media resolution set to low.
     */
    MEDIA_RESOLUTION_LOW = "MEDIA_RESOLUTION_LOW",
    /**
     * Media resolution set to medium.
     */
    MEDIA_RESOLUTION_MEDIUM = "MEDIA_RESOLUTION_MEDIUM",
    /**
     * Media resolution set to high.
     */
    MEDIA_RESOLUTION_HIGH = "MEDIA_RESOLUTION_HIGH",
    /**
     * Media resolution set to ultra high.
     */
    MEDIA_RESOLUTION_ULTRA_HIGH = "MEDIA_RESOLUTION_ULTRA_HIGH"
}

/** Tuning spec for Partner models. This data type is not supported in Gemini API. */
declare interface PartnerModelTuningSpec {
    /** Hyperparameters for tuning. The accepted hyper_parameters and their valid range of values will differ depending on the base model. */
    hyperParameters?: Record<string, unknown>;
    /** Required. Cloud Storage path to file containing training dataset for tuning. The dataset must be formatted as a JSONL file. */
    trainingDatasetUri?: string;
    /** Optional. Cloud Storage path to file containing validation dataset for tuning. The dataset must be formatted as a JSONL file. */
    validationDatasetUri?: string;
}

declare type PartUnion = Part | string;

/** Enum that controls the generation of people. */
declare enum PersonGeneration {
    /**
     * Block generation of images of people.
     */
    DONT_ALLOW = "DONT_ALLOW",
    /**
     * Generate images of adults, but not children.
     */
    ALLOW_ADULT = "ALLOW_ADULT",
    /**
     * Generate images that include adults and children.
     */
    ALLOW_ALL = "ALLOW_ALL"
}

/** Sites with confidence level chosen & above this value will be blocked from the search results. This enum is not supported in Gemini API. */
declare enum PhishBlockThreshold {
    /**
     * Defaults to unspecified.
     */
    PHISH_BLOCK_THRESHOLD_UNSPECIFIED = "PHISH_BLOCK_THRESHOLD_UNSPECIFIED",
    /**
     * Blocks Low and above confidence URL that is risky.
     */
    BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
    /**
     * Blocks Medium and above confidence URL that is risky.
     */
    BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
    /**
     * Blocks High and above confidence URL that is risky.
     */
    BLOCK_HIGH_AND_ABOVE = "BLOCK_HIGH_AND_ABOVE",
    /**
     * Blocks Higher and above confidence URL that is risky.
     */
    BLOCK_HIGHER_AND_ABOVE = "BLOCK_HIGHER_AND_ABOVE",
    /**
     * Blocks Very high and above confidence URL that is risky.
     */
    BLOCK_VERY_HIGH_AND_ABOVE = "BLOCK_VERY_HIGH_AND_ABOVE",
    /**
     * Blocks Extremely high confidence URL that is risky.
     */
    BLOCK_ONLY_EXTREMELY_HIGH = "BLOCK_ONLY_EXTREMELY_HIGH"
}

/** Spec for pointwise metric result. This data type is not supported in Gemini API. */
declare interface PointwiseMetricResult {
    /** Output only. Spec for custom output. */
    customOutput?: CustomOutput;
    /** Output only. Explanation for pointwise metric score. */
    explanation?: string;
    /** Output only. Pointwise metric score. */
    score?: number;
}

/** Configuration for a prebuilt voice. */
declare interface PrebuiltVoiceConfig {
    /** The name of the prebuilt voice to use. */
    voiceName?: string;
}

/** Statistics computed for datasets used for preference optimization. This data type is not supported in Gemini API. */
declare interface PreferenceOptimizationDataStats {
    /** Output only. A partial sample of the indices (starting from 1) of the dropped examples. */
    droppedExampleIndices?: string[];
    /** Output only. For each index in `dropped_example_indices`, the user-facing reason why the example was dropped. */
    droppedExampleReasons?: string[];
    /** Output only. Dataset distributions for scores variance per example. */
    scoreVariancePerExampleDistribution?: DatasetDistribution;
    /** Output only. Dataset distributions for scores. */
    scoresDistribution?: DatasetDistribution;
    /** Output only. Number of billable tokens in the tuning dataset. */
    totalBillableTokenCount?: string;
    /** Output only. Number of examples in the tuning dataset. */
    tuningDatasetExampleCount?: string;
    /** Output only. Number of tuning steps for this Tuning Job. */
    tuningStepCount?: string;
    /** Output only. Sample user examples in the training dataset. */
    userDatasetExamples?: GeminiPreferenceExample[];
    /** Output only. Dataset distributions for the user input tokens. */
    userInputTokenDistribution?: DatasetDistribution;
    /** Output only. Dataset distributions for the user output tokens. */
    userOutputTokenDistribution?: DatasetDistribution;
}

/** Hyperparameters for Preference Optimization. This data type is not supported in Gemini API. */
declare interface PreferenceOptimizationHyperParameters {
    /** Optional. Adapter size for preference optimization. */
    adapterSize?: AdapterSize;
    /** Optional. Weight for KL Divergence regularization. */
    beta?: number;
    /** Optional. Number of complete passes the model makes over the entire training dataset during training. */
    epochCount?: string;
    /** Optional. Multiplier for adjusting the default learning rate. */
    learningRateMultiplier?: number;
}

/** Preference optimization tuning spec for tuning. */
declare interface PreferenceOptimizationSpec {
    /** Optional. If set to true, disable intermediate checkpoints for Preference Optimization and only the last checkpoint will be exported. Otherwise, enable intermediate checkpoints for Preference Optimization. Default is false. */
    exportLastCheckpointOnly?: boolean;
    /** Optional. Hyperparameters for Preference Optimization. */
    hyperParameters?: PreferenceOptimizationHyperParameters;
    /** Required. Cloud Storage path to file containing training dataset for preference optimization tuning. The dataset must be formatted as a JSONL file. */
    trainingDatasetUri?: string;
    /** Optional. Cloud Storage path to file containing validation dataset for preference optimization tuning. The dataset must be formatted as a JSONL file. */
    validationDatasetUri?: string;
}

/** A pre-tuned model for continuous tuning. This data type is not supported in Gemini API. */
declare interface PreTunedModel {
    /** Output only. The name of the base model this PreTunedModel was tuned from. */
    baseModel?: string;
    /** Optional. The source checkpoint id. If not specified, the default checkpoint will be used. */
    checkpointId?: string;
    /** The resource name of the Model. E.g., a model resource name with a specified version id or alias: `projects/{project}/locations/{location}/models/{model}@{version_id}` `projects/{project}/locations/{location}/models/{model}@{alias}` Or, omit the version id to use the default version: `projects/{project}/locations/{location}/models/{model}` */
    tunedModelName?: string;
}

/** Config for proactivity features. */
declare interface ProactivityConfig {
    /** If enabled, the model can reject responding to the last prompt. For
     example, this allows the model to ignore out of context speech or to stay
     silent if the user did not make a request, yet. */
    proactiveAudio?: boolean;
}

/** An image of the product. */
declare interface ProductImage {
    /** An image of the product to be recontextualized. */
    productImage?: Image_2;
}

/** Controls whether prominent people (celebrities) generation is allowed. If used with personGeneration, personGeneration enum would take precedence. For instance, if ALLOW_NONE is set, all person generation would be blocked. If this field is unspecified, the default behavior is to allow prominent people. This enum is not supported in Gemini API. */
declare enum ProminentPeople {
    /**
     * Unspecified value. The model will proceed with the default behavior, which is to allow generation of prominent people.
     */
    PROMINENT_PEOPLE_UNSPECIFIED = "PROMINENT_PEOPLE_UNSPECIFIED",
    /**
     * Allows the model to generate images of prominent people.
     */
    ALLOW_PROMINENT_PEOPLE = "ALLOW_PROMINENT_PEOPLE",
    /**
     * Prevents the model from generating images of prominent people.
     */
    BLOCK_PROMINENT_PEOPLE = "BLOCK_PROMINENT_PEOPLE"
}

/** A RagChunk includes the content of a chunk of a RagFile, and associated metadata. This data type is not supported in Gemini API. */
declare interface RagChunk {
    /** If populated, represents where the chunk starts and ends in the document. */
    pageSpan?: RagChunkPageSpan;
    /** The content of the chunk. */
    text?: string;
}

/** Represents where the chunk starts and ends in the document. This data type is not supported in Gemini API. */
declare interface RagChunkPageSpan {
    /** Page where chunk starts in the document. Inclusive. 1-indexed. */
    firstPage?: number;
    /** Page where chunk ends in the document. Inclusive. 1-indexed. */
    lastPage?: number;
}

/** Specifies the context retrieval config. This data type is not supported in Gemini API. */
declare interface RagRetrievalConfig {
    /** Optional. Config for filters. */
    filter?: RagRetrievalConfigFilter;
    /** Optional. Config for Hybrid Search. */
    hybridSearch?: RagRetrievalConfigHybridSearch;
    /** Optional. Config for ranking and reranking. */
    ranking?: RagRetrievalConfigRanking;
    /** Optional. The number of contexts to retrieve. */
    topK?: number;
}

/** Config for filters. This data type is not supported in Gemini API. */
declare interface RagRetrievalConfigFilter {
    /** Optional. String for metadata filtering. */
    metadataFilter?: string;
    /** Optional. Only returns contexts with vector distance smaller than the threshold. */
    vectorDistanceThreshold?: number;
    /** Optional. Only returns contexts with vector similarity larger than the threshold. */
    vectorSimilarityThreshold?: number;
}

/** Config for Hybrid Search. This data type is not supported in Gemini API. */
declare interface RagRetrievalConfigHybridSearch {
    /** Optional. Alpha value controls the weight between dense and sparse vector search results. The range is [0, 1], while 0 means sparse vector search only and 1 means dense vector search only. The default value is 0.5 which balances sparse and dense vector search equally. */
    alpha?: number;
}

/** Config for ranking and reranking. This data type is not supported in Gemini API. */
declare interface RagRetrievalConfigRanking {
    /** Optional. Config for LlmRanker. */
    llmRanker?: RagRetrievalConfigRankingLlmRanker;
    /** Optional. Config for Rank Service. */
    rankService?: RagRetrievalConfigRankingRankService;
}

/** Config for LlmRanker. This data type is not supported in Gemini API. */
declare interface RagRetrievalConfigRankingLlmRanker {
    /** Optional. The model name used for ranking. See [Supported models](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#supported-models). */
    modelName?: string;
}

/** Config for Rank Service. This data type is not supported in Gemini API. */
declare interface RagRetrievalConfigRankingRankService {
    /** Optional. The model name of the rank service. Format: `semantic-ranker-512@latest` */
    modelName?: string;
}

/** Raw output. This data type is not supported in Gemini API. */
declare interface RawOutput {
    /** Output only. Raw output string. */
    rawOutput?: string[];
}

/** A raw reference image.

 A raw reference image represents the base image to edit, provided by the user.
 It can optionally be provided in addition to a mask reference image or
 a style reference image. */
declare class RawReferenceImage {
    /** The reference image for the editing operation. */
    referenceImage?: Image_2;
    /** The id of the reference image. */
    referenceId?: number;
    /** The type of the reference image. Only set by the SDK. */
    referenceType?: string;
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI(): ReferenceImageAPIInternal;
}

/** Marks the end of user activity.

 This can only be sent if automatic (i.e. server-side) activity detection is
 disabled. */
declare interface RealtimeInputConfig {
    /** If not set, automatic activity detection is enabled by default. If automatic voice detection is disabled, the client must send activity signals. */
    automaticActivityDetection?: AutomaticActivityDetection;
    /** Defines what effect activity has. */
    activityHandling?: ActivityHandling;
    /** Defines which input is included in the user's turn. */
    turnCoverage?: TurnCoverage;
}

/** Configuration for recontextualizing an image. */
declare interface RecontextImageConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** Number of images to generate. */
    numberOfImages?: number;
    /** The number of sampling steps. A higher value has better image
     quality, while a lower value has better latency. */
    baseSteps?: number;
    /** Cloud Storage URI used to store the generated images. */
    outputGcsUri?: string;
    /** Random seed for image generation. */
    seed?: number;
    /** Filter level for safety filtering. */
    safetyFilterLevel?: SafetyFilterLevel;
    /** Whether allow to generate person images, and restrict to specific
     ages. */
    personGeneration?: PersonGeneration;
    /** Whether to add a SynthID watermark to the generated images. */
    addWatermark?: boolean;
    /** MIME type of the generated image. */
    outputMimeType?: string;
    /** Compression quality of the generated image (for ``image/jpeg``
     only). */
    outputCompressionQuality?: number;
    /** Whether to use the prompt rewriting logic. */
    enhancePrompt?: boolean;
    /** User specified labels to track billing usage. */
    labels?: Record<string, string>;
}

/** The parameters for recontextualizing an image. */
declare interface RecontextImageParameters {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** A set of source input(s) for image recontextualization. */
    source: RecontextImageSource;
    /** Configuration for image recontextualization. */
    config?: RecontextImageConfig;
}

/** The output images response. */
declare class RecontextImageResponse {
    /** List of generated images. */
    generatedImages?: GeneratedImage[];
}

/** A set of source input(s) for image recontextualization. */
declare interface RecontextImageSource {
    /** A text prompt for guiding the model during image
     recontextualization. Not supported for Virtual Try-On. */
    prompt?: string;
    /** Image of the person or subject who will be wearing the
     product(s). */
    personImage?: Image_2;
    /** A list of product images. */
    productImages?: ProductImage[];
}

declare type ReferenceImage = RawReferenceImage | MaskReferenceImage | ControlReferenceImage | StyleReferenceImage | SubjectReferenceImage | ContentReferenceImage;

/** Private class that represents a Reference image that is sent to API. */
declare interface ReferenceImageAPIInternal {
    /** The reference image for the editing operation. */
    referenceImage?: types.Image;
    /** The id of the reference image. */
    referenceId?: number;
    /** The type of the reference image. Only set by the SDK. */
    referenceType?: string;
    /** Configuration for the mask reference image. */
    maskImageConfig?: types.MaskReferenceConfig;
    /** Configuration for the control reference image. */
    controlImageConfig?: types.ControlReferenceConfig;
    /** Configuration for the style reference image. */
    styleImageConfig?: types.StyleReferenceConfig;
    /** Configuration for the subject reference image. */
    subjectImageConfig?: types.SubjectReferenceConfig;
}

/** Used to override the default configuration. */
declare interface RegisterFilesConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
}

/** Generates the parameters for the private registerFiles method. */
declare interface RegisterFilesParameters {
    /**
     * The authentication object.
     */
    auth?: any;
    /**
     * The Google Cloud Storage URIs to register. Example: `gs://bucket/object`.
     */
    uris: string[];
    /** Used to override the default configuration. */
    config?: RegisterFilesConfig;
}

/** Response for the _register file method. */
declare class RegisterFilesResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** The registered files. */
    files?: File_2[];
}

/** Represents a recorded session. */
declare interface ReplayFile {
    replayId?: string;
    interactions?: ReplayInteraction[];
}

/** Represents a single interaction, request and response in a replay. */
declare interface ReplayInteraction {
    request?: ReplayRequest;
    response?: ReplayResponse;
}

/** Represents a single request in a replay. */
declare interface ReplayRequest {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    bodySegments?: Record<string, unknown>[];
}

/** Represents a single response in a replay. */
declare class ReplayResponse {
    statusCode?: number;
    headers?: Record<string, string>;
    bodySegments?: Record<string, unknown>[];
    sdkResponseSegments?: Record<string, unknown>[];
}

/** The configuration for the replicated voice to use. */
declare interface ReplicatedVoiceConfig {
    /** The mimetype of the voice sample. The only currently supported
     value is `audio/wav`. This represents 16-bit signed little-endian wav
     data, with a 24kHz sampling rate.
     */
    mimeType?: string;
    /** The sample of the custom voice.

     * @remarks Encoded as base64 string. */
    voiceSampleAudio?: string;
}

/** Resource scope. */
declare enum ResourceScope {
    /**
     * When setting base_url, this value configures resource scope to be the collection.
     The resource name will not include api version, project, or location.
     For example, if base_url is set to "https://aiplatform.googleapis.com",
     then the resource name for a Model would be
     "https://aiplatform.googleapis.com/publishers/google/models/gemini-3-pro-preview
     */
    COLLECTION = "COLLECTION"
}

/** Defines a retrieval tool that model can call to access external knowledge. This data type is not supported in Gemini API. */
declare interface Retrieval {
    /** Optional. Deprecated. This option is no longer supported. */
    disableAttribution?: boolean;
    /** Use data source powered by external API for grounding. */
    externalApi?: ExternalApi;
    /** Set to use data source powered by Vertex AI Search. */
    vertexAiSearch?: VertexAISearch;
    /** Set to use data source powered by Vertex RAG store. User data is uploaded via the VertexRagDataService. */
    vertexRagStore?: VertexRagStore;
}

/** Retrieval config.
 */
declare interface RetrievalConfig {
    /** Optional. The location of the user. */
    latLng?: LatLng;
    /** The language code of the user. */
    languageCode?: string;
}

/** Metadata returned to client when grounding is enabled. */
declare interface RetrievalMetadata {
    /** Optional. Score indicating how likely information from google
     search could help answer the prompt. The score is in the range [0, 1],
     where 0 is the least likely and 1 is the most likely. This score is only
     populated when google search grounding and dynamic retrieval is enabled.
     It will be compared to the threshold to determine whether to trigger
     Google search. */
    googleSearchDynamicRetrievalScore?: number;
}

/** Rouge metric value for an instance. This data type is not supported in Gemini API. */
declare interface RougeMetricValue {
    /** Output only. Rouge score. */
    score?: number;
}

/** Safety attributes of a GeneratedImage or the user-provided prompt. */
declare interface SafetyAttributes {
    /** List of RAI categories. */
    categories?: string[];
    /** List of scores of each categories. */
    scores?: number[];
    /** Internal use only. */
    contentType?: string;
}

/** Enum that controls the safety filter level for objectionable content. */
declare enum SafetyFilterLevel {
    BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
    BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
    BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
    BLOCK_NONE = "BLOCK_NONE"
}

/** A safety rating for a piece of content. The safety rating contains the harm category and the harm probability level. */
declare interface SafetyRating {
    /** Output only. Indicates whether the content was blocked because of this rating. */
    blocked?: boolean;
    /** Output only. The harm category of this rating. */
    category?: HarmCategory;
    /** Output only. The overwritten threshold for the safety category of Gemini 2.0 image out. If minors are detected in the output image, the threshold of each safety category will be overwritten if user sets a lower threshold. This field is not supported in Gemini API. */
    overwrittenThreshold?: HarmBlockThreshold;
    /** Output only. The probability of harm for this category. */
    probability?: HarmProbability;
    /** Output only. The probability score of harm for this category. This field is not supported in Gemini API. */
    probabilityScore?: number;
    /** Output only. The severity of harm for this category. This field is not supported in Gemini API. */
    severity?: HarmSeverity;
    /** Output only. The severity score of harm for this category. This field is not supported in Gemini API. */
    severityScore?: number;
}

/** A safety setting that affects the safety-blocking behavior. A SafetySetting consists of a harm category and a threshold for that category. */
declare interface SafetySetting {
    /** Required. The harm category to be blocked. */
    category?: HarmCategory;
    /** Optional. The method for blocking content. If not specified, the default behavior is to use the probability score. This field is not supported in Gemini API. */
    method?: HarmBlockMethod;
    /** Required. The threshold for blocking content. If the harm probability exceeds this threshold, the content will be blocked. */
    threshold?: HarmBlockThreshold;
}

/** Scale of the generated music. */
declare enum Scale {
    /**
     * Default value. This value is unused.
     */
    SCALE_UNSPECIFIED = "SCALE_UNSPECIFIED",
    /**
     * C major or A minor.
     */
    C_MAJOR_A_MINOR = "C_MAJOR_A_MINOR",
    /**
     * Db major or Bb minor.
     */
    D_FLAT_MAJOR_B_FLAT_MINOR = "D_FLAT_MAJOR_B_FLAT_MINOR",
    /**
     * D major or B minor.
     */
    D_MAJOR_B_MINOR = "D_MAJOR_B_MINOR",
    /**
     * Eb major or C minor
     */
    E_FLAT_MAJOR_C_MINOR = "E_FLAT_MAJOR_C_MINOR",
    /**
     * E major or Db minor.
     */
    E_MAJOR_D_FLAT_MINOR = "E_MAJOR_D_FLAT_MINOR",
    /**
     * F major or D minor.
     */
    F_MAJOR_D_MINOR = "F_MAJOR_D_MINOR",
    /**
     * Gb major or Eb minor.
     */
    G_FLAT_MAJOR_E_FLAT_MINOR = "G_FLAT_MAJOR_E_FLAT_MINOR",
    /**
     * G major or E minor.
     */
    G_MAJOR_E_MINOR = "G_MAJOR_E_MINOR",
    /**
     * Ab major or F minor.
     */
    A_FLAT_MAJOR_F_MINOR = "A_FLAT_MAJOR_F_MINOR",
    /**
     * A major or Gb minor.
     */
    A_MAJOR_G_FLAT_MINOR = "A_MAJOR_G_FLAT_MINOR",
    /**
     * Bb major or G minor.
     */
    B_FLAT_MAJOR_G_MINOR = "B_FLAT_MAJOR_G_MINOR",
    /**
     * B major or Ab minor.
     */
    B_MAJOR_A_FLAT_MINOR = "B_MAJOR_A_FLAT_MINOR"
}

/** Schema is used to define the format of input/output data.

 Represents a select subset of an [OpenAPI 3.0 schema
 object](https://spec.openapis.org/oas/v3.0.3#schema-object). More fields may
 be added in the future as needed. */
declare interface Schema {
    /** Optional. The instance must be valid against any (one or more) of the subschemas listed in `any_of`. */
    anyOf?: Schema[];
    /** Optional. Default value to use if the field is not specified. */
    default?: unknown;
    /** Optional. Describes the data. The model uses this field to understand the purpose of the schema and how to use it. It is a best practice to provide a clear and descriptive explanation for the schema and its properties here, rather than in the prompt. */
    description?: string;
    /** Optional. Possible values of the field. This field can be used to restrict a value to a fixed set of values. To mark a field as an enum, set `format` to `enum` and provide the list of possible values in `enum`. For example: 1. To define directions: `{type:STRING, format:enum, enum:["EAST", "NORTH", "SOUTH", "WEST"]}` 2. To define apartment numbers: `{type:INTEGER, format:enum, enum:["101", "201", "301"]}` */
    enum?: string[];
    /** Optional. Example of an instance of this schema. */
    example?: unknown;
    /** Optional. The format of the data. For `NUMBER` type, format can be `float` or `double`. For `INTEGER` type, format can be `int32` or `int64`. For `STRING` type, format can be `email`, `byte`, `date`, `date-time`, `password`, and other formats to further refine the data type. */
    format?: string;
    /** Optional. If type is `ARRAY`, `items` specifies the schema of elements in the array. */
    items?: Schema;
    /** Optional. If type is `ARRAY`, `max_items` specifies the maximum number of items in an array. */
    maxItems?: string;
    /** Optional. If type is `STRING`, `max_length` specifies the maximum length of the string. */
    maxLength?: string;
    /** Optional. If type is `OBJECT`, `max_properties` specifies the maximum number of properties that can be provided. */
    maxProperties?: string;
    /** Optional. If type is `INTEGER` or `NUMBER`, `maximum` specifies the maximum allowed value. */
    maximum?: number;
    /** Optional. If type is `ARRAY`, `min_items` specifies the minimum number of items in an array. */
    minItems?: string;
    /** Optional. If type is `STRING`, `min_length` specifies the minimum length of the string. */
    minLength?: string;
    /** Optional. If type is `OBJECT`, `min_properties` specifies the minimum number of properties that can be provided. */
    minProperties?: string;
    /** Optional. If type is `INTEGER` or `NUMBER`, `minimum` specifies the minimum allowed value. */
    minimum?: number;
    /** Optional. Indicates if the value of this field can be null. */
    nullable?: boolean;
    /** Optional. If type is `STRING`, `pattern` specifies a regular expression that the string must match. */
    pattern?: string;
    /** Optional. If type is `OBJECT`, `properties` is a map of property names to schema definitions for each property of the object. */
    properties?: Record<string, Schema>;
    /** Optional. Order of properties displayed or used where order matters. This is not a standard field in OpenAPI specification, but can be used to control the order of properties. */
    propertyOrdering?: string[];
    /** Optional. If type is `OBJECT`, `required` lists the names of properties that must be present. */
    required?: string[];
    /** Optional. Title for the schema. */
    title?: string;
    /** Optional. Data type of the schema field. */
    type?: Type;
}

declare type SchemaUnion = Schema | unknown;

/** An image mask representing a brush scribble. */
declare interface ScribbleImage {
    /** The brush scribble to guide segmentation. Valid for the interactive mode. */
    image?: Image_2;
}

/** The entry point used to search for grounding sources. */
declare interface SearchEntryPoint {
    /** Optional. Web content snippet that can be embedded in a web page
     or an app webview. */
    renderedContent?: string;
    /** Optional. JSON representing array of tuples.
     * @remarks Encoded as base64 string. */
    sdkBlob?: string;
}

/** Different types of search that can be enabled on the GoogleSearch tool. */
declare interface SearchTypes {
    /** Optional. Setting this field enables web search. Only text results are returned. */
    webSearch?: WebSearch;
    /** Optional. Setting this field enables image search. Image bytes are returned. */
    imageSearch?: ImageSearch;
}

/** Segment of the content this support belongs to. */
declare interface Segment {
    /** Output only. Start index in the given Part, measured in bytes.

     Offset from the start of the Part, inclusive, starting at zero. */
    startIndex?: number;
    /** Output only. End index in the given Part, measured in bytes.

     Offset from the start of the Part, exclusive, starting at zero. */
    endIndex?: number;
    /** Output only. The index of a Part object within its parent
     Content object. */
    partIndex?: number;
    /** Output only. The text corresponding to the segment from the
     response. */
    text?: string;
}

/** Configuration for segmenting an image. */
declare interface SegmentImageConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** The segmentation mode to use. */
    mode?: SegmentMode;
    /** The maximum number of predictions to return up to, by top
     confidence score. */
    maxPredictions?: number;
    /** The confidence score threshold for the detections as a decimal
     value. Only predictions with a confidence score higher than this
     threshold will be returned. */
    confidenceThreshold?: number;
    /** A decimal value representing how much dilation to apply to the
     masks. 0 for no dilation. 1.0 means the masked area covers the whole
     image. */
    maskDilation?: number;
    /** The binary color threshold to apply to the masks. The threshold
     can be set to a decimal value between 0 and 255 non-inclusive.
     Set to -1 for no binary color thresholding. */
    binaryColorThreshold?: number;
    /** User specified labels to track billing usage. */
    labels?: Record<string, string>;
}

/** The parameters for segmenting an image. */
declare interface SegmentImageParameters {
    /** ID of the model to use. For a list of models, see `Google models
     <https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models>`_. */
    model: string;
    /** A set of source input(s) for image segmentation. */
    source: SegmentImageSource;
    /** Configuration for image segmentation. */
    config?: SegmentImageConfig;
}

/** The output images response. */
declare class SegmentImageResponse {
    /** List of generated image masks.
     */
    generatedMasks?: GeneratedImageMask[];
}

/** A set of source input(s) for image segmentation. */
declare interface SegmentImageSource {
    /** A text prompt for guiding the model during image segmentation.
     Required for prompt mode and semantic mode, disallowed for other modes. */
    prompt?: string;
    /** The image to be segmented. */
    image?: Image_2;
    /** The brush scribble to guide segmentation.
     Required for the interactive mode, disallowed for other modes. */
    scribbleImage?: ScribbleImage;
}

/** Enum that represents the segmentation mode. */
declare enum SegmentMode {
    FOREGROUND = "FOREGROUND",
    BACKGROUND = "BACKGROUND",
    PROMPT = "PROMPT",
    SEMANTIC = "SEMANTIC",
    INTERACTIVE = "INTERACTIVE"
}

/** Parameters for sending a message within a chat session.

 These parameters are used with the `chat.sendMessage()` method. */
declare interface SendMessageParameters {
    /** The message to send to the model.

     The SDK will combine all parts into a single 'user' content to send to
     the model.
     */
    message: PartListUnion;
    /**  Config for this specific request.

     Please note that the per-request config does not change the chat level
     config, nor inherit from it. If you intend to use some values from the
     chat's default config, you must explicitly copy them into this per-request
     config.
     */
    config?: GenerateContentConfig;
}

/** Pricing and performance service tier. */
declare enum ServiceTier {
    /**
     * Default service tier, which is standard.
     */
    UNSPECIFIED = "unspecified",
    /**
     * Flex service tier.
     */
    FLEX = "flex",
    /**
     * Standard service tier.
     */
    STANDARD = "standard",
    /**
     * Priority service tier.
     */
    PRIORITY = "priority"
}

/** Configuration of session resumption mechanism.

 Included in `LiveConnectConfig.session_resumption`. If included server
 will send `LiveServerSessionResumptionUpdate` messages. */
declare interface SessionResumptionConfig {
    /** Session resumption handle of previous session (session to restore).

     If not present new session will be started. */
    handle?: string;
    /** If set the server will send `last_consumed_client_message_index` in the `session_resumption_update` messages to allow for transparent reconnections. */
    transparent?: boolean;
}

export declare function setValueByPath(data: Record<string, unknown>, keys: string[], value: unknown): void;

/** Config for `response` parameter. */
declare class SingleEmbedContentResponse {
    /** The response to the request.
     */
    embedding?: ContentEmbedding;
    /** The error encountered while processing the request.
     */
    tokenCount?: string;
}

/** Context window will be truncated by keeping only suffix of it.

 Context window will always be cut at start of USER role turn. System
 instructions and `BidiGenerateContentSetup.prefix_turns` will not be
 subject to the sliding window mechanism, they will always stay at the
 beginning of context window. */
declare interface SlidingWindow {
    /** Session reduction target -- how many tokens we should keep. Window shortening operation has some latency costs, so we should avoid running it on every turn. Should be < trigger_tokens. If not set, trigger_tokens/2 is assumed. */
    targetTokens?: string;
}

/** Configuration for a single speaker in a multi-speaker setup. */
declare interface SpeakerVoiceConfig {
    /** Required. The name of the speaker. This should be the same as the speaker name used in the prompt. */
    speaker?: string;
    /** Required. The configuration for the voice of this speaker. */
    voiceConfig?: VoiceConfig;
}

/** Config for speech generation and transcription. */
declare interface SpeechConfig {
    /** The configuration in case of single-voice output. */
    voiceConfig?: VoiceConfig;
    /** Optional. The language code (ISO 639-1) for the speech synthesis. */
    languageCode?: string;
    /** The configuration for a multi-speaker text-to-speech request. This field is mutually exclusive with `voice_config`. */
    multiSpeakerVoiceConfig?: MultiSpeakerVoiceConfig;
}

declare type SpeechConfigUnion = SpeechConfig | string;

/** Start of speech sensitivity. */
declare enum StartSensitivity {
    /**
     * The default is START_SENSITIVITY_LOW.
     */
    START_SENSITIVITY_UNSPECIFIED = "START_SENSITIVITY_UNSPECIFIED",
    /**
     * Automatic detection will detect the start of speech more often.
     */
    START_SENSITIVITY_HIGH = "START_SENSITIVITY_HIGH",
    /**
     * Automatic detection will detect the start of speech less often.
     */
    START_SENSITIVITY_LOW = "START_SENSITIVITY_LOW"
}

/** A transport that can stream HTTP requests and responses. Next ID: 6. This data type is not supported in Vertex AI. */
declare interface StreamableHttpTransport {
    /** Optional: Fields for authentication headers, timeouts, etc., if needed. */
    headers?: Record<string, string>;
    /** Timeout for SSE read operations. */
    sseReadTimeout?: string;
    /** Whether to close the client session when the transport closes. */
    terminateOnClose?: boolean;
    /** HTTP timeout for regular operations. */
    timeout?: string;
    /** The full URL for the MCPServer endpoint. Example: "https://api.example.com/mcp". */
    url?: string;
}

/** User provided string values assigned to a single metadata key. This data type is not supported in Vertex AI. */
declare interface StringList {
    /** The string values of the metadata to store. */
    values?: string[];
}

/** Configuration for a Style reference image. */
declare interface StyleReferenceConfig {
    /** A text description of the style to use for the generated image. */
    styleDescription?: string;
}

/** A style reference image.

 This encapsulates a style reference image provided by the user, and
 additionally optional config parameters for the style reference image.

 A raw reference image can also be provided as a destination for the style to
 be applied to. */
declare class StyleReferenceImage {
    /** The reference image for the editing operation. */
    referenceImage?: Image_2;
    /** The id of the reference image. */
    referenceId?: number;
    /** The type of the reference image. Only set by the SDK. */
    referenceType?: string;
    /** Configuration for the style reference image. */
    config?: StyleReferenceConfig;
    /** Internal method to convert to ReferenceImageAPIInternal. */
    toReferenceImageAPI(): ReferenceImageAPIInternal;
}

/** Configuration for a Subject reference image. */
declare interface SubjectReferenceConfig {
    /** The subject type of a subject reference image. */
    subjectType?: SubjectReferenceType;
    /** Subject description for the image. */
    subjectDescription?: string;
}

/** A subject reference image.

 This encapsulates a subject reference image provided by the user, and
 additionally optional config parameters for the subject reference image.

 A raw reference image can also be provided as a destination for the subject to
 be applied to. */
declare class SubjectReferenceImage {
    /** The reference image for the editing operation. */
    referenceImage?: Image_2;
    /** The id of the reference image. */
    referenceId?: number;
    /** The type of the reference image. Only set by the SDK. */
    referenceType?: string;
    /** Configuration for the subject reference image. */
    config?: SubjectReferenceConfig;
    toReferenceImageAPI(): ReferenceImageAPIInternal;
}

/** Enum representing the subject type of a subject reference image. */
declare enum SubjectReferenceType {
    SUBJECT_TYPE_DEFAULT = "SUBJECT_TYPE_DEFAULT",
    SUBJECT_TYPE_PERSON = "SUBJECT_TYPE_PERSON",
    SUBJECT_TYPE_ANIMAL = "SUBJECT_TYPE_ANIMAL",
    SUBJECT_TYPE_PRODUCT = "SUBJECT_TYPE_PRODUCT"
}

/** Hyperparameters for SFT. This data type is not supported in Gemini API. */
declare interface SupervisedHyperParameters {
    /** Optional. Adapter size for tuning. */
    adapterSize?: AdapterSize;
    /** Optional. Batch size for tuning. This feature is only available for open source models. */
    batchSize?: string;
    /** Optional. Number of complete passes the model makes over the entire training dataset during training. */
    epochCount?: string;
    /** Optional. Learning rate for tuning. Mutually exclusive with `learning_rate_multiplier`. This feature is only available for open source models. */
    learningRate?: number;
    /** Optional. Multiplier for adjusting the default learning rate. Mutually exclusive with `learning_rate`. This feature is only available for 1P models. */
    learningRateMultiplier?: number;
}

/** Dataset distribution for Supervised Tuning. This data type is not supported in Gemini API. */
declare interface SupervisedTuningDatasetDistribution {
    /** Output only. Sum of a given population of values that are billable. */
    billableSum?: string;
    /** Output only. Defines the histogram bucket. */
    buckets?: SupervisedTuningDatasetDistributionDatasetBucket[];
    /** Output only. The maximum of the population values. */
    max?: number;
    /** Output only. The arithmetic mean of the values in the population. */
    mean?: number;
    /** Output only. The median of the values in the population. */
    median?: number;
    /** Output only. The minimum of the population values. */
    min?: number;
    /** Output only. The 5th percentile of the values in the population. */
    p5?: number;
    /** Output only. The 95th percentile of the values in the population. */
    p95?: number;
    /** Output only. Sum of a given population of values. */
    sum?: string;
}

/** Dataset bucket used to create a histogram for the distribution given a population of values. This data type is not supported in Gemini API. */
declare interface SupervisedTuningDatasetDistributionDatasetBucket {
    /** Output only. Number of values in the bucket. */
    count?: number;
    /** Output only. Left bound of the bucket. */
    left?: number;
    /** Output only. Right bound of the bucket. */
    right?: number;
}

/** Tuning data statistics for Supervised Tuning. This data type is not supported in Gemini API. */
declare interface SupervisedTuningDataStats {
    /** Output only. For each index in `truncated_example_indices`, the user-facing reason why the example was dropped. */
    droppedExampleReasons?: string[];
    /** Output only. Number of billable characters in the tuning dataset. */
    totalBillableCharacterCount?: string;
    /** Output only. Number of billable tokens in the tuning dataset. */
    totalBillableTokenCount?: string;
    /** Output only. The number of examples in the dataset that have been dropped. An example can be dropped for reasons including: too many tokens, contains an invalid image, contains too many images, etc. */
    totalTruncatedExampleCount?: string;
    /** Output only. Number of tuning characters in the tuning dataset. */
    totalTuningCharacterCount?: string;
    /** Output only. A partial sample of the indices (starting from 1) of the dropped examples. */
    truncatedExampleIndices?: string[];
    /** Output only. Number of examples in the tuning dataset. */
    tuningDatasetExampleCount?: string;
    /** Output only. Number of tuning steps for this Tuning Job. */
    tuningStepCount?: string;
    /** Output only. Sample user messages in the training dataset uri. */
    userDatasetExamples?: Content[];
    /** Output only. Dataset distributions for the user input tokens. */
    userInputTokenDistribution?: SupervisedTuningDatasetDistribution;
    /** Output only. Dataset distributions for the messages per example. */
    userMessagePerExampleDistribution?: SupervisedTuningDatasetDistribution;
    /** Output only. Dataset distributions for the user output tokens. */
    userOutputTokenDistribution?: SupervisedTuningDatasetDistribution;
}

/** Supervised tuning spec for tuning. */
declare interface SupervisedTuningSpec {
    /** Optional. If set to true, disable intermediate checkpoints for SFT and only the last checkpoint will be exported. Otherwise, enable intermediate checkpoints for SFT. Default is false. */
    exportLastCheckpointOnly?: boolean;
    /** Optional. Hyperparameters for SFT. */
    hyperParameters?: SupervisedHyperParameters;
    /** Required. Training dataset used for tuning. The dataset can be specified as either a Cloud Storage path to a JSONL file or as the resource name of a Vertex Multimodal Dataset. */
    trainingDatasetUri?: string;
    /** Tuning mode. */
    tuningMode?: TuningMode;
    /** Optional. Validation dataset used for tuning. The dataset can be specified as either a Cloud Storage path to a JSONL file or as the resource name of a Vertex Multimodal Dataset. */
    validationDatasetUri?: string;
}

declare interface TestTableFile {
    comment?: string;
    testMethod?: string;
    parameterNames?: string[];
    testTable?: TestTableItem[];
}

declare interface TestTableItem {
    /** The name of the test. This is used to derive the replay id. */
    name?: string;
    /** The parameters to the test. Use pydantic models. */
    parameters?: Record<string, unknown>;
    /** Expects an exception for MLDev matching the string. */
    exceptionIfMldev?: string;
    /** Expects an exception for Vertex matching the string. */
    exceptionIfVertex?: string;
    /** Use if you don't want to use the default replay id which is derived from the test name. */
    overrideReplayId?: string;
    /** True if the parameters contain an unsupported union type. This test  will be skipped for languages that do not support the union type. */
    hasUnion?: boolean;
    /** When set to a reason string, this test will be skipped in the API mode. Use this flag for tests that can not be reproduced with the real API. E.g. a test that deletes a resource. */
    skipInApiMode?: string;
    /** Keys to ignore when comparing the request and response. This is useful for tests that are not deterministic. */
    ignoreKeys?: string[];
}

/** The thinking features configuration. */
declare interface ThinkingConfig {
    /** Indicates whether to include thoughts in the response. If true, thoughts are returned only if the model supports thought and thoughts are available.
     */
    includeThoughts?: boolean;
    /** Indicates the thinking budget in tokens. 0 is DISABLED. -1 is AUTOMATIC. The default values and allowed ranges are model dependent.
     */
    thinkingBudget?: number;
    /** Optional. The number of thoughts tokens that the model should generate. */
    thinkingLevel?: ThinkingLevel;
}

/** The number of thoughts tokens that the model should generate. */
declare enum ThinkingLevel {
    /**
     * Unspecified thinking level.
     */
    THINKING_LEVEL_UNSPECIFIED = "THINKING_LEVEL_UNSPECIFIED",
    /**
     * MINIMAL thinking level.
     */
    MINIMAL = "MINIMAL",
    /**
     * Low thinking level.
     */
    LOW = "LOW",
    /**
     * Medium thinking level.
     */
    MEDIUM = "MEDIUM",
    /**
     * High thinking level.
     */
    HIGH = "HIGH"
}

/** Tokens info with a list of tokens and the corresponding list of token ids. */
declare interface TokensInfo {
    /** Optional fields for the role from the corresponding Content. */
    role?: string;
    /** A list of token ids from the input. */
    tokenIds?: string[];
    /** A list of tokens from the input.
     * @remarks Encoded as base64 string. */
    tokens?: string[];
}

/** Tool details of a tool that the model may use to generate a response. */
declare interface Tool {
    /** Optional. Retrieval tool type. System will always execute the provided retrieval tool(s) to get external knowledge to answer the prompt. Retrieval results are presented to the model for generation. This field is not supported in Gemini API. */
    retrieval?: Retrieval;
    /** Optional. Tool to support the model interacting directly with the
     computer. If enabled, it automatically populates computer-use specific
     Function Declarations. */
    computerUse?: ComputerUse;
    /** Optional. FileSearch tool type. Tool to retrieve knowledge from Semantic Retrieval corpora. This field is not supported in Vertex AI. */
    fileSearch?: FileSearch;
    /** Optional. GoogleSearch tool type. Tool to support Google Search in Model. Powered by Google. */
    googleSearch?: GoogleSearch;
    /** Optional. Tool that allows grounding the model's response with
     geospatial context related to the user's query. */
    googleMaps?: GoogleMaps;
    /** Optional. CodeExecution tool type. Enables the model to execute code as part of generation. */
    codeExecution?: ToolCodeExecution;
    /** Optional. Tool to support searching public web data, powered by Vertex AI Search and Sec4 compliance. This field is not supported in Gemini API. */
    enterpriseWebSearch?: EnterpriseWebSearch;
    /** Optional. Function tool type. One or more function declarations to be passed to the model along with the current user query. Model may decide to call a subset of these functions by populating FunctionCall in the response. User should provide a FunctionResponse for each function call in the next turn. Based on the function responses, Model will generate the final response back to the user. Maximum 512 function declarations can be provided. */
    functionDeclarations?: FunctionDeclaration[];
    /** Optional. Specialized retrieval tool that is powered by Google Search. */
    googleSearchRetrieval?: GoogleSearchRetrieval;
    /** Optional. If specified, Vertex AI will use Parallel.ai to search for information to answer user queries. The search results will be grounded on Parallel.ai and presented to the model for response generation. This field is not supported in Gemini API. */
    parallelAiSearch?: ToolParallelAiSearch;
    /** Optional. Tool to support URL context retrieval. */
    urlContext?: UrlContext;
    /** Optional. MCP Servers to connect to. This field is not supported in Vertex AI. */
    mcpServers?: McpServer[];
}

/** A predicted server-side `ToolCall` returned from the model.

 This message contains information about a tool that the model wants to invoke.
 The client is NOT expected to execute this `ToolCall`. Instead, the
 client should pass this `ToolCall` back to the API in a subsequent turn
 within a `Content` message, along with the corresponding `ToolResponse`. */
declare interface ToolCall {
    /** Unique identifier of the tool call. The server returns the tool response with the matching `id`. */
    id?: string;
    /** The type of tool that was called. */
    toolType?: ToolType;
    /** The tool call arguments. Example: {"arg1": "value1", "arg2": "value2"}. */
    args?: Record<string, unknown>;
}

/** Tool that executes code generated by the model, and automatically returns the result to the model. See also [ExecutableCode]and [CodeExecutionResult] which are input and output to this tool. This data type is not supported in Gemini API. */
declare interface ToolCodeExecution {
}

/** Tool config.

 This config is shared for all tools provided in the request. */
declare interface ToolConfig {
    /** Optional. Retrieval config. */
    retrievalConfig?: RetrievalConfig;
    /** Optional. Function calling config. */
    functionCallingConfig?: FunctionCallingConfig;
    /** If true, the API response will include the server-side tool calls and responses within the `Content` message. This allows clients to observe the server's tool invocations. */
    includeServerSideToolInvocations?: boolean;
}

declare type ToolListUnion = ToolUnion[];

/** ParallelAiSearch tool type. A tool that uses the Parallel.ai search engine for grounding. This data type is not supported in Gemini API. */
declare interface ToolParallelAiSearch {
    /** Optional. The API key for ParallelAiSearch. If an API key is not provided, the system will attempt to verify access by checking for an active Parallel.ai subscription through the Google Cloud Marketplace. See https://docs.parallel.ai/search/search-quickstart for more details. */
    apiKey?: string;
    /** Optional. Custom configs for ParallelAiSearch. This field can be used to pass any parameter from the Parallel.ai Search API. See the Parallel.ai documentation for the full list of available parameters and their usage: https://docs.parallel.ai/api-reference/search-beta/search Currently only `source_policy`, `excerpts`, `max_results`, `mode`, `fetch_policy` can be set via this field. For example: { "source_policy": { "include_domains": ["google.com", "wikipedia.org"], "exclude_domains": ["example.com"] }, "fetch_policy": { "max_age_seconds": 3600 } } */
    customConfigs?: Record<string, unknown>;
}

/** The output from a server-side `ToolCall` execution.

 This message contains the results of a tool invocation that was initiated by a
 `ToolCall` from the model. The client should pass this `ToolResponse` back to
 the API in a subsequent turn within a `Content` message, along with the
 corresponding `ToolCall`. */
declare class ToolResponse {
    /** The identifier of the tool call this response is for. */
    id?: string;
    /** The type of tool that was called, matching the tool_type in the corresponding ToolCall. */
    toolType?: ToolType;
    /** The tool response. */
    response?: Record<string, unknown>;
}

/** The type of tool in the function call. */
declare enum ToolType {
    /**
     * Unspecified tool type.
     */
    TOOL_TYPE_UNSPECIFIED = "TOOL_TYPE_UNSPECIFIED",
    /**
     * Google search tool, maps to Tool.google_search.search_types.web_search.
     */
    GOOGLE_SEARCH_WEB = "GOOGLE_SEARCH_WEB",
    /**
     * Image search tool, maps to Tool.google_search.search_types.image_search.
     */
    GOOGLE_SEARCH_IMAGE = "GOOGLE_SEARCH_IMAGE",
    /**
     * URL context tool, maps to Tool.url_context.
     */
    URL_CONTEXT = "URL_CONTEXT",
    /**
     * Google maps tool, maps to Tool.google_maps.
     */
    GOOGLE_MAPS = "GOOGLE_MAPS",
    /**
     * File search tool, maps to Tool.file_search.
     */
    FILE_SEARCH = "FILE_SEARCH"
}

declare type ToolUnion = Tool | CallableTool;

/** Output only. The traffic type for this request. This enum is not supported in Gemini API. */
declare enum TrafficType {
    /**
     * Unspecified request traffic type.
     */
    TRAFFIC_TYPE_UNSPECIFIED = "TRAFFIC_TYPE_UNSPECIFIED",
    /**
     * The request was processed using Pay-As-You-Go quota.
     */
    ON_DEMAND = "ON_DEMAND",
    /**
     * Type for Priority Pay-As-You-Go traffic.
     */
    ON_DEMAND_PRIORITY = "ON_DEMAND_PRIORITY",
    /**
     * Type for Flex traffic.
     */
    ON_DEMAND_FLEX = "ON_DEMAND_FLEX",
    /**
     * Type for Provisioned Throughput traffic.
     */
    PROVISIONED_THROUGHPUT = "PROVISIONED_THROUGHPUT"
}

/** Audio transcription in Server Conent. */
declare interface Transcription {
    /** Optional. Transcription text. */
    text?: string;
    /** Optional. The bool indicates the end of the transcription. */
    finished?: boolean;
}

/** TunedModel for the Tuned Model of a Tuning Job. */
declare interface TunedModel {
    /** Output only. The resource name of the TunedModel.
     Format: `projects/{project}/locations/{location}/models/{model}@{version_id}`
     When tuning from a base model, the version_id will be 1.
     For continuous tuning, the version id will be incremented by 1 from the
     last version id in the parent model. E.g., `projects/{project}/locations/{location}/models/{model}@{last_version_id + 1}`
     */
    model?: string;
    /** Output only. A resource name of an Endpoint.
     Format: `projects/{project}/locations/{location}/endpoints/{endpoint}`.
     */
    endpoint?: string;
    /** The checkpoints associated with this TunedModel.
     This field is only populated for tuning jobs that enable intermediate
     checkpoints. */
    checkpoints?: TunedModelCheckpoint[];
}

/** TunedModelCheckpoint for the Tuned Model of a Tuning Job. */
declare interface TunedModelCheckpoint {
    /** The ID of the checkpoint.
     */
    checkpointId?: string;
    /** The epoch of the checkpoint.
     */
    epoch?: string;
    /** The step of the checkpoint.
     */
    step?: string;
    /** The Endpoint resource name that the checkpoint is deployed to.
     Format: `projects/{project}/locations/{location}/endpoints/{endpoint}`.
     */
    endpoint?: string;
}

/** A tuned machine learning model. */
declare interface TunedModelInfo {
    /** ID of the base model that you want to tune. */
    baseModel?: string;
    /** Date and time when the base model was created. */
    createTime?: string;
    /** Date and time when the base model was last updated. */
    updateTime?: string;
}

/** Supervised fine-tuning training dataset. */
declare interface TuningDataset {
    /** GCS URI of the file containing training dataset in JSONL format. */
    gcsUri?: string;
    /** The resource name of the Vertex Multimodal Dataset that is used as training dataset. Example: 'projects/my-project-id-or-number/locations/my-location/datasets/my-dataset-id'. */
    vertexDatasetResource?: string;
    /** Inline examples with simple input/output text. */
    examples?: TuningExample[];
}

/** The tuning data statistic values for TuningJob. This data type is not supported in Gemini API. */
declare interface TuningDataStats {
    /** Output only. Statistics for distillation prompt dataset. These statistics do not include the responses sampled from the teacher model. */
    distillationDataStats?: DistillationDataStats;
    /** Output only. Statistics for preference optimization. */
    preferenceOptimizationDataStats?: PreferenceOptimizationDataStats;
    /** The SFT Tuning data stats. */
    supervisedTuningDataStats?: SupervisedTuningDataStats;
}

/** A single example for tuning. This data type is not supported in Vertex AI. */
declare interface TuningExample {
    /** Required. The expected model output. */
    output?: string;
    /** Optional. Text model input. */
    textInput?: string;
}

/** A tuning job. */
declare interface TuningJob {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** Output only. Identifier. Resource name of a TuningJob. Format: `projects/{project}/locations/{location}/tuningJobs/{tuning_job}` */
    name?: string;
    /** Output only. The detailed state of the job. */
    state?: JobState;
    /** Output only. Time when the TuningJob was created. */
    createTime?: string;
    /** Output only. Time when the TuningJob for the first time entered the `JOB_STATE_RUNNING` state. */
    startTime?: string;
    /** Output only. Time when the TuningJob entered any of the following JobStates: `JOB_STATE_SUCCEEDED`, `JOB_STATE_FAILED`, `JOB_STATE_CANCELLED`, `JOB_STATE_EXPIRED`. */
    endTime?: string;
    /** Output only. Time when the TuningJob was most recently updated. */
    updateTime?: string;
    /** Output only. Only populated when job's state is `JOB_STATE_FAILED` or `JOB_STATE_CANCELLED`. */
    error?: GoogleRpcStatus;
    /** Optional. The description of the TuningJob. */
    description?: string;
    /** The base model that is being tuned. See [Supported models](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/tuning#supported_models). */
    baseModel?: string;
    /** Output only. The tuned model resources associated with this TuningJob. */
    tunedModel?: TunedModel;
    /** The pre-tuned model for continuous tuning. */
    preTunedModel?: PreTunedModel;
    /** Tuning Spec for Supervised Fine Tuning. */
    supervisedTuningSpec?: SupervisedTuningSpec;
    /** Tuning Spec for Preference Optimization. */
    preferenceOptimizationSpec?: PreferenceOptimizationSpec;
    /** Tuning Spec for Distillation. */
    distillationSpec?: DistillationSpec;
    /** Output only. The tuning data statistics associated with this TuningJob. */
    tuningDataStats?: TuningDataStats;
    /** Customer-managed encryption key options for a TuningJob. If this is set, then all resources created by the TuningJob will be encrypted with the provided encryption key. */
    encryptionSpec?: EncryptionSpec;
    /** Tuning Spec for open sourced and third party Partner models. */
    partnerModelTuningSpec?: PartnerModelTuningSpec;
    /** Optional. The user-provided path to custom model weights. Set this field to tune a custom model. The path must be a Cloud Storage directory that contains the model weights in .safetensors format along with associated model metadata files. If this field is set, the base_model field must still be set to indicate which base model the custom model is derived from. This feature is only available for open source models. */
    customBaseModel?: string;
    /** Output only. Evaluation runs for the Tuning Job. */
    evaluateDatasetRuns?: EvaluateDatasetRun[];
    /** Output only. The Experiment associated with this TuningJob. */
    experiment?: string;
    /** Tuning Spec for Full Fine Tuning. */
    fullFineTuningSpec?: FullFineTuningSpec;
    /** Optional. The labels with user-defined metadata to organize TuningJob and generated resources such as Model and Endpoint. Label keys and values can be no longer than 64 characters (Unicode codepoints), can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. See https://goo.gl/xmQnxf for more information and examples of labels. */
    labels?: Record<string, string>;
    /** Optional. Cloud Storage path to the directory where tuning job outputs are written to. This field is only available and required for open source models. */
    outputUri?: string;
    /** Output only. The resource name of the PipelineJob associated with the TuningJob. Format: `projects/{project}/locations/{location}/pipelineJobs/{pipeline_job}`. */
    pipelineJob?: string;
    /** The service account that the tuningJob workload runs as. If not specified, the Vertex AI Secure Fine-Tuned Service Agent in the project will be used. See https://cloud.google.com/iam/docs/service-agents#vertex-ai-secure-fine-tuning-service-agent Users starting the pipeline must have the `iam.serviceAccounts.actAs` permission on this service account. */
    serviceAccount?: string;
    /** Optional. The display name of the TunedModel. The name can be up to 128 characters long and can consist of any UTF-8 characters. For continuous tuning, tuned_model_display_name will by default use the same display name as the pre-tuned model. If a new display name is provided, the tuning job will create a new model instead of a new version. */
    tunedModelDisplayName?: string;
    /** Output only. The detail state of the tuning job (while the overall `JobState` is running). */
    tuningJobState?: TuningJobState;
    /** Tuning Spec for Veo Tuning. */
    veoTuningSpec?: VeoTuningSpec;
    /** Optional. Spec for creating a distillation dataset. */
    distillationSamplingSpec?: DistillationSamplingSpec;
    /** Output only. Tuning Job metadata. */
    tuningJobMetadata?: TuningJobMetadata;
}

/** Tuning job metadata. This data type is not supported in Gemini API. */
declare interface TuningJobMetadata {
    /** Output only. The number of epochs that have been completed. */
    completedEpochCount?: string;
    /** Output only. The number of steps that have been completed. Set for Multi-Step RL. */
    completedStepCount?: string;
}

/** Output only. The detail state of the tuning job (while the overall `JobState` is running). This enum is not supported in Gemini API. */
declare enum TuningJobState {
    /**
     * Default tuning job state.
     */
    TUNING_JOB_STATE_UNSPECIFIED = "TUNING_JOB_STATE_UNSPECIFIED",
    /**
     * Tuning job is waiting for job quota.
     */
    TUNING_JOB_STATE_WAITING_FOR_QUOTA = "TUNING_JOB_STATE_WAITING_FOR_QUOTA",
    /**
     * Tuning job is validating the dataset.
     */
    TUNING_JOB_STATE_PROCESSING_DATASET = "TUNING_JOB_STATE_PROCESSING_DATASET",
    /**
     * Tuning job is waiting for hardware capacity.
     */
    TUNING_JOB_STATE_WAITING_FOR_CAPACITY = "TUNING_JOB_STATE_WAITING_FOR_CAPACITY",
    /**
     * Tuning job is running.
     */
    TUNING_JOB_STATE_TUNING = "TUNING_JOB_STATE_TUNING",
    /**
     * Tuning job is doing some post processing steps.
     */
    TUNING_JOB_STATE_POST_PROCESSING = "TUNING_JOB_STATE_POST_PROCESSING"
}

/** Enum representing the tuning method. */
declare enum TuningMethod {
    /**
     * Supervised fine tuning.
     */
    SUPERVISED_FINE_TUNING = "SUPERVISED_FINE_TUNING",
    /**
     * Preference optimization tuning.
     */
    PREFERENCE_TUNING = "PREFERENCE_TUNING",
    /**
     * Distillation tuning.
     */
    DISTILLATION = "DISTILLATION"
}

/** Tuning mode. This enum is not supported in Gemini API. */
declare enum TuningMode {
    /**
     * Tuning mode is unspecified.
     */
    TUNING_MODE_UNSPECIFIED = "TUNING_MODE_UNSPECIFIED",
    /**
     * Full fine-tuning mode.
     */
    TUNING_MODE_FULL = "TUNING_MODE_FULL",
    /**
     * PEFT adapter tuning mode.
     */
    TUNING_MODE_PEFT_ADAPTER = "TUNING_MODE_PEFT_ADAPTER"
}

/** A long-running operation. */
declare interface TuningOperation {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
    name?: string;
    /** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata.  Any method that returns a long-running operation should document the metadata type, if any. */
    metadata?: Record<string, unknown>;
    /** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
    done?: boolean;
    /** The error result of the operation in case of failure or cancellation. */
    error?: Record<string, unknown>;
}

/** The tuning task. Either I2V or T2V. This enum is not supported in Gemini API. */
declare enum TuningTask {
    /**
     * Default value. This value is unused.
     */
    TUNING_TASK_UNSPECIFIED = "TUNING_TASK_UNSPECIFIED",
    /**
     * Tuning task for image to video.
     */
    TUNING_TASK_I2V = "TUNING_TASK_I2V",
    /**
     * Tuning task for text to video.
     */
    TUNING_TASK_T2V = "TUNING_TASK_T2V",
    /**
     * Tuning task for reference to video.
     */
    TUNING_TASK_R2V = "TUNING_TASK_R2V"
}

declare interface TuningValidationDataset {
    /** GCS URI of the file containing validation dataset in JSONL format. */
    gcsUri?: string;
    /** The resource name of the Vertex Multimodal Dataset that is used as validation dataset. Example: 'projects/my-project-id-or-number/locations/my-location/datasets/my-dataset-id'. */
    vertexDatasetResource?: string;
}

/** The reason why the turn is complete. */
declare enum TurnCompleteReason {
    /**
     * Default value. Reason is unspecified.
     */
    TURN_COMPLETE_REASON_UNSPECIFIED = "TURN_COMPLETE_REASON_UNSPECIFIED",
    /**
     * The function call generated by the model is invalid.
     */
    MALFORMED_FUNCTION_CALL = "MALFORMED_FUNCTION_CALL",
    /**
     * The response is rejected by the model.
     */
    RESPONSE_REJECTED = "RESPONSE_REJECTED",
    /**
     * Needs more input from the user.
     */
    NEED_MORE_INPUT = "NEED_MORE_INPUT"
}

/** Options about which input is included in the user's turn. */
declare enum TurnCoverage {
    /**
     * If unspecified, the default behavior is `TURN_INCLUDES_ONLY_ACTIVITY`.
     */
    TURN_COVERAGE_UNSPECIFIED = "TURN_COVERAGE_UNSPECIFIED",
    /**
     * The users turn only includes activity since the last turn, excluding inactivity (e.g. silence on the audio stream). This is the default behavior.
     */
    TURN_INCLUDES_ONLY_ACTIVITY = "TURN_INCLUDES_ONLY_ACTIVITY",
    /**
     * The users turn includes all realtime input since the last turn, including inactivity (e.g. silence on the audio stream).
     */
    TURN_INCLUDES_ALL_INPUT = "TURN_INCLUDES_ALL_INPUT",
    /**
     * Includes audio activity and all video since the last turn. With automatic activity detection, audio activity means speech and excludes silence.
     */
    TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO = "TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO"
}

/** Data type of the schema field. */
declare enum Type {
    /**
     * Not specified, should not be used.
     */
    TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
    /**
     * OpenAPI string type
     */
    STRING = "STRING",
    /**
     * OpenAPI number type
     */
    NUMBER = "NUMBER",
    /**
     * OpenAPI integer type
     */
    INTEGER = "INTEGER",
    /**
     * OpenAPI boolean type
     */
    BOOLEAN = "BOOLEAN",
    /**
     * OpenAPI array type
     */
    ARRAY = "ARRAY",
    /**
     * OpenAPI object type
     */
    OBJECT = "OBJECT",
    /**
     * Null type
     */
    NULL = "NULL"
}

declare namespace types {
    export {
        createFunctionResponsePartFromBase64,
        createFunctionResponsePartFromUri,
        createPartFromUri,
        createPartFromText,
        createPartFromFunctionCall,
        createPartFromFunctionResponse,
        createPartFromBase64,
        createPartFromCodeExecutionResult,
        createPartFromExecutableCode,
        createUserContent,
        createModelContent,
        Language,
        Outcome,
        FunctionResponseScheduling,
        Type,
        Environment,
        AuthType,
        HttpElementLocation,
        ApiSpec,
        PhishBlockThreshold,
        Behavior,
        DynamicRetrievalConfigMode,
        FunctionCallingConfigMode,
        ThinkingLevel,
        PersonGeneration,
        ProminentPeople,
        HarmCategory,
        HarmBlockMethod,
        HarmBlockThreshold,
        FinishReason,
        HarmProbability,
        HarmSeverity,
        UrlRetrievalStatus,
        BlockedReason,
        TrafficType,
        Modality,
        ModelStage,
        MediaResolution,
        TuningMode,
        AdapterSize,
        JobState,
        TuningJobState,
        AggregationMetric,
        PairwiseChoice,
        TuningTask,
        DocumentState,
        PartMediaResolutionLevel,
        ToolType,
        ResourceScope,
        ServiceTier,
        FeatureSelectionPreference,
        EmbeddingApiType,
        SafetyFilterLevel,
        ImagePromptLanguage,
        MaskReferenceMode,
        ControlReferenceType,
        SubjectReferenceType,
        EditMode,
        SegmentMode,
        VideoGenerationReferenceType,
        VideoGenerationMaskMode,
        VideoCompressionQuality,
        TuningMethod,
        FileState,
        FileSource,
        TurnCompleteReason,
        MediaModality,
        VadSignalType,
        VoiceActivityType,
        StartSensitivity,
        EndSensitivity,
        ActivityHandling,
        TurnCoverage,
        Scale,
        MusicGenerationMode,
        LiveMusicPlaybackControl,
        ExecutableCode,
        CodeExecutionResult,
        PartMediaResolution,
        ToolCall,
        ToolResponse,
        FileData,
        PartialArg,
        FunctionCall,
        FunctionResponseBlob,
        FunctionResponseFileData,
        FunctionResponsePart,
        FunctionResponse,
        Blob_2 as Blob,
        VideoMetadata,
        Part,
        Content,
        HttpRetryOptions,
        HttpOptions,
        Schema,
        ModelSelectionConfig,
        ComputerUse,
        ApiKeyConfig,
        AuthConfigGoogleServiceAccountConfig,
        AuthConfigHttpBasicAuthConfig,
        AuthConfigOauthConfig,
        AuthConfigOidcConfig,
        AuthConfig,
        GoogleMaps,
        ApiAuthApiKeyConfig,
        ApiAuth,
        ExternalApiElasticSearchParams,
        ExternalApiSimpleSearchParams,
        ExternalApi,
        VertexAISearchDataStoreSpec,
        VertexAISearch,
        VertexRagStoreRagResource,
        RagRetrievalConfigFilter,
        RagRetrievalConfigHybridSearch,
        RagRetrievalConfigRankingLlmRanker,
        RagRetrievalConfigRankingRankService,
        RagRetrievalConfigRanking,
        RagRetrievalConfig,
        VertexRagStore,
        Retrieval,
        FileSearch,
        WebSearch,
        ImageSearch,
        SearchTypes,
        Interval,
        GoogleSearch,
        ToolCodeExecution,
        EnterpriseWebSearch,
        FunctionDeclaration,
        DynamicRetrievalConfig,
        GoogleSearchRetrieval,
        ToolParallelAiSearch,
        UrlContext,
        StreamableHttpTransport,
        McpServer,
        Tool,
        LatLng,
        RetrievalConfig,
        FunctionCallingConfig,
        ToolConfig,
        ReplicatedVoiceConfig,
        PrebuiltVoiceConfig,
        VoiceConfig,
        SpeakerVoiceConfig,
        MultiSpeakerVoiceConfig,
        SpeechConfig,
        AutomaticFunctionCallingConfig,
        ThinkingConfig,
        ImageConfigImageOutputOptions,
        ImageConfig,
        GenerationConfigRoutingConfigAutoRoutingMode,
        GenerationConfigRoutingConfigManualRoutingMode,
        GenerationConfigRoutingConfig,
        SafetySetting,
        ModelArmorConfig,
        GenerateContentConfig,
        GenerateContentParameters,
        HttpResponse,
        LiveCallbacks,
        GoogleTypeDate,
        Citation,
        CitationMetadata,
        GroundingChunkMapsPlaceAnswerSourcesAuthorAttribution,
        GroundingChunkMapsPlaceAnswerSourcesReviewSnippet,
        GroundingChunkMapsPlaceAnswerSources,
        GroundingChunkMapsRoute,
        GroundingChunkMaps,
        GroundingChunkImage,
        RagChunkPageSpan,
        RagChunk,
        GroundingChunkStringList,
        GroundingChunkCustomMetadata,
        GroundingChunkRetrievedContext,
        GroundingChunkWeb,
        GroundingChunk,
        Segment,
        GroundingSupport,
        RetrievalMetadata,
        SearchEntryPoint,
        GroundingMetadataSourceFlaggingUri,
        GroundingMetadata,
        LogprobsResultCandidate,
        LogprobsResultTopCandidates,
        LogprobsResult,
        SafetyRating,
        UrlMetadata,
        UrlContextMetadata,
        Candidate,
        GenerateContentResponsePromptFeedback,
        ModalityTokenCount,
        GenerateContentResponseUsageMetadata,
        ModelStatus,
        GenerateContentResponse,
        ReferenceImage,
        EditImageParameters,
        EmbedContentConfig,
        EmbedContentParametersPrivate,
        ContentEmbeddingStatistics,
        ContentEmbedding,
        EmbedContentMetadata,
        EmbedContentResponse,
        GenerateImagesConfig,
        GenerateImagesParameters,
        Image_2 as Image,
        SafetyAttributes,
        GeneratedImage,
        GenerateImagesResponse,
        MaskReferenceConfig,
        ControlReferenceConfig,
        StyleReferenceConfig,
        SubjectReferenceConfig,
        EditImageConfig,
        EditImageResponse,
        UpscaleImageResponse,
        ProductImage,
        RecontextImageSource,
        RecontextImageConfig,
        RecontextImageParameters,
        RecontextImageResponse,
        ScribbleImage,
        SegmentImageSource,
        SegmentImageConfig,
        SegmentImageParameters,
        EntityLabel,
        GeneratedImageMask,
        SegmentImageResponse,
        GetModelConfig,
        GetModelParameters,
        Endpoint,
        TunedModelInfo,
        Checkpoint,
        Model,
        ListModelsConfig,
        ListModelsParameters,
        ListModelsResponse,
        UpdateModelConfig,
        UpdateModelParameters,
        DeleteModelConfig,
        DeleteModelParameters,
        DeleteModelResponse,
        GenerationConfig,
        CountTokensConfig,
        CountTokensParameters,
        CountTokensResponse,
        ComputeTokensConfig,
        ComputeTokensParameters,
        TokensInfo,
        ComputeTokensResponse,
        Video,
        GenerateVideosSource,
        VideoGenerationReferenceImage,
        VideoGenerationMask,
        GenerateVideosConfig,
        GenerateVideosParameters,
        GeneratedVideo,
        GenerateVideosResponse,
        Operation,
        GenerateVideosOperation,
        GetTuningJobConfig,
        GetTuningJobParameters,
        TunedModelCheckpoint,
        TunedModel,
        SupervisedHyperParameters,
        SupervisedTuningSpec,
        PreferenceOptimizationHyperParameters,
        PreferenceOptimizationSpec,
        DistillationHyperParameters,
        DistillationSpec,
        GoogleRpcStatus,
        PreTunedModel,
        DatasetDistributionDistributionBucket,
        DatasetDistribution,
        DatasetStats,
        DistillationDataStats,
        GeminiPreferenceExampleCompletion,
        GeminiPreferenceExample,
        PreferenceOptimizationDataStats,
        SupervisedTuningDatasetDistributionDatasetBucket,
        SupervisedTuningDatasetDistribution,
        SupervisedTuningDataStats,
        TuningDataStats,
        EncryptionSpec,
        PartnerModelTuningSpec,
        BleuMetricValue,
        CustomCodeExecutionResult,
        ExactMatchMetricValue,
        RawOutput,
        CustomOutput,
        PairwiseMetricResult,
        PointwiseMetricResult,
        RougeMetricValue,
        AggregationResult,
        BigQuerySource,
        GcsSource,
        EvaluationDataset,
        AggregationOutput,
        OutputInfo,
        EvaluateDatasetResponse,
        EvaluateDatasetRun,
        FullFineTuningSpec,
        VeoHyperParameters,
        VeoTuningSpec,
        DistillationSamplingSpec,
        TuningJobMetadata,
        TuningJob,
        ListTuningJobsConfig,
        ListTuningJobsParameters,
        ListTuningJobsResponse,
        CancelTuningJobConfig,
        CancelTuningJobParameters,
        CancelTuningJobResponse,
        TuningExample,
        TuningDataset,
        TuningValidationDataset,
        CreateTuningJobConfig,
        CreateTuningJobParametersPrivate,
        TuningOperation,
        CreateCachedContentConfig,
        CreateCachedContentParameters,
        CachedContentUsageMetadata,
        CachedContent,
        GetCachedContentConfig,
        GetCachedContentParameters,
        DeleteCachedContentConfig,
        DeleteCachedContentParameters,
        DeleteCachedContentResponse,
        UpdateCachedContentConfig,
        UpdateCachedContentParameters,
        ListCachedContentsConfig,
        ListCachedContentsParameters,
        ListCachedContentsResponse,
        GetDocumentConfig,
        GetDocumentParameters,
        StringList,
        CustomMetadata,
        Document_2 as Document,
        DeleteDocumentConfig,
        DeleteDocumentParameters,
        ListDocumentsConfig,
        ListDocumentsParameters,
        ListDocumentsResponse,
        CreateFileSearchStoreConfig,
        CreateFileSearchStoreParameters,
        FileSearchStore,
        GetFileSearchStoreConfig,
        GetFileSearchStoreParameters,
        DeleteFileSearchStoreConfig,
        DeleteFileSearchStoreParameters,
        ListFileSearchStoresConfig,
        ListFileSearchStoresParameters,
        ListFileSearchStoresResponse,
        WhiteSpaceConfig,
        ChunkingConfig,
        UploadToFileSearchStoreConfig,
        UploadToFileSearchStoreParameters,
        UploadToFileSearchStoreResumableResponse,
        ImportFileConfig,
        ImportFileParameters,
        ImportFileResponse,
        ImportFileOperation,
        ListFilesConfig,
        ListFilesParameters,
        FileStatus,
        File_2 as File,
        ListFilesResponse,
        CreateFileConfig,
        CreateFileParameters,
        CreateFileResponse,
        GetFileConfig,
        GetFileParameters,
        DeleteFileConfig,
        DeleteFileParameters,
        DeleteFileResponse,
        RegisterFilesConfig,
        InternalRegisterFilesParameters,
        RegisterFilesResponse,
        InlinedRequest,
        BatchJobSource,
        JobError,
        InlinedResponse,
        SingleEmbedContentResponse,
        InlinedEmbedContentResponse,
        BatchJobDestination,
        CreateBatchJobConfig,
        CreateBatchJobParameters,
        CompletionStats,
        BatchJob,
        EmbedContentBatch,
        EmbeddingsBatchJobSource,
        CreateEmbeddingsBatchJobConfig,
        CreateEmbeddingsBatchJobParameters,
        GetBatchJobConfig,
        GetBatchJobParameters,
        CancelBatchJobConfig,
        CancelBatchJobParameters,
        ListBatchJobsConfig,
        ListBatchJobsParameters,
        ListBatchJobsResponse,
        DeleteBatchJobConfig,
        DeleteBatchJobParameters,
        DeleteResourceJob,
        GetOperationConfig,
        GetOperationParameters,
        FetchPredictOperationConfig,
        FetchPredictOperationParameters,
        TestTableItem,
        TestTableFile,
        ReplayRequest,
        ReplayResponse,
        ReplayInteraction,
        ReplayFile,
        UploadFileConfig,
        DownloadFileConfig,
        DownloadFileParameters,
        UpscaleImageConfig,
        UpscaleImageParameters,
        RawReferenceImage,
        MaskReferenceImage,
        ControlReferenceImage,
        StyleReferenceImage,
        SubjectReferenceImage,
        ContentReferenceImage,
        LiveServerSetupComplete,
        Transcription,
        LiveServerContent,
        LiveServerToolCall,
        LiveServerToolCallCancellation,
        UsageMetadata,
        LiveServerGoAway,
        LiveServerSessionResumptionUpdate,
        VoiceActivityDetectionSignal,
        VoiceActivity,
        LiveServerMessage,
        OperationFromAPIResponseParameters,
        GenerationConfigThinkingConfig,
        RegisterFilesParameters,
        AutomaticActivityDetection,
        RealtimeInputConfig,
        SessionResumptionConfig,
        SlidingWindow,
        ContextWindowCompressionConfig,
        AudioTranscriptionConfig,
        ProactivityConfig,
        LiveClientSetup,
        LiveClientContent,
        ActivityStart,
        ActivityEnd,
        LiveClientRealtimeInput,
        LiveClientToolResponse,
        LiveSendRealtimeInputParameters,
        LiveClientMessage,
        LiveConnectConfig,
        LiveConnectParameters,
        CreateChatParameters,
        SendMessageParameters,
        LiveSendClientContentParameters,
        LiveSendToolResponseParameters,
        LiveMusicClientSetup,
        WeightedPrompt,
        LiveMusicClientContent,
        LiveMusicGenerationConfig,
        LiveMusicClientMessage,
        LiveMusicServerSetupComplete,
        LiveMusicSourceMetadata,
        AudioChunk,
        LiveMusicServerContent,
        LiveMusicFilteredPrompt,
        LiveMusicServerMessage,
        LiveMusicCallbacks,
        UploadFileParameters,
        CallableTool,
        CallableToolConfig,
        LiveMusicConnectParameters,
        LiveMusicSetConfigParameters,
        LiveMusicSetWeightedPromptsParameters,
        AuthToken,
        LiveConnectConstraints,
        CreateAuthTokenConfig,
        CreateAuthTokenParameters,
        OperationGetParameters,
        CountTokensResult,
        ComputeTokensResult,
        CreateTuningJobParameters,
        EmbedContentParameters,
        UploadToFileSearchStoreResponse,
        UploadToFileSearchStoreOperation,
        BlobImageUnion,
        PartUnion,
        PartListUnion,
        ContentUnion,
        ContentListUnion,
        SchemaUnion,
        SpeechConfigUnion,
        ToolUnion,
        ToolListUnion,
        DownloadableFileUnion,
        BatchJobSourceUnion,
        BatchJobDestinationUnion
    }
}

/** Optional parameters for caches.update method. */
declare interface UpdateCachedContentConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** The TTL for this resource. The expiration time is computed: now + TTL. It is a duration string, with up to nine fractional digits, terminated by 's'. Example: "3.5s". */
    ttl?: string;
    /** Timestamp of when this resource is considered expired. Uses RFC 3339 format, Example: 2014-10-02T15:01:23Z. */
    expireTime?: string;
}

declare interface UpdateCachedContentParameters {
    /** The server-generated resource name of the cached content.
     */
    name: string;
    /** Configuration that contains optional parameters.
     */
    config?: UpdateCachedContentConfig;
}

/** Configuration for updating a tuned model. */
declare interface UpdateModelConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    displayName?: string;
    description?: string;
    defaultCheckpointId?: string;
}

/** Configuration for updating a tuned model. */
declare interface UpdateModelParameters {
    model: string;
    config?: UpdateModelConfig;
}

export declare interface Uploader {
    /**
     * Uploads a file to the given upload url.
     *
     * @param file The file to upload. file is in string type or a Blob.
     * @param uploadUrl The upload URL as a string is where the file will be
     *     uploaded to. The uploadUrl must be a url that was returned by the
     * https://generativelanguage.googleapis.com/upload/v1beta/files endpoint
     * @param apiClient The ApiClient to use for uploading.
     * @return A Promise that resolves to types.File.
     */
    upload(file: string | Blob, uploadUrl: string, apiClient: ApiClient, httpOptions?: HttpOptions): Promise<File_2>;
    /**
     * Uploads a file to file search store via the given upload url.
     *
     * @param file The file to upload. file is in string type or a Blob.
     * @param uploadUrl The upload URL as a string is where the file will be
     *     uploaded to. The uploadUrl must be a url that was returned by the
     * https://generativelanguage.googleapis.com/upload/v1beta/{file_search_store_name}:uploadToFileSearchStore endpoint
     * @param apiClient The ApiClient to use for uploading.
     * @param httpOptions Optional HTTP options to merge.
     * @return A Promise that resolves to types.UploadToFileSearchStoreOperation.
     */
    uploadToFileSearchStore(file: string | Blob, uploadUrl: string, apiClient: ApiClient, httpOptions?: HttpOptions): Promise<UploadToFileSearchStoreOperation>;
    /**
     * Returns the file's mimeType and the size of a given file. If the file is a
     * string path, the file type is determined by the file extension. If the
     * file's type cannot be determined, the type will be set to undefined.
     *
     * @param file The file to get the stat for. Can be a string path or a Blob.
     * @return A Promise that resolves to the file stat of the given file.
     */
    stat(file: string | Blob): Promise<FileStat>;
}

/** Used to override the default configuration. */
declare interface UploadFileConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** The name of the file in the destination (e.g., 'files/sample-image'. If not provided one will be generated. */
    name?: string;
    /** mime_type: The MIME type of the file. If not provided, it will be inferred from the file extension. */
    mimeType?: string;
    /** Optional display name of the file. */
    displayName?: string;
}

/** Parameters for the upload file method. */
declare interface UploadFileParameters {
    /** The string path to the file to be uploaded or a Blob object. */
    file: string | globalThis.Blob;
    /** Configuration that contains optional parameters. */
    config?: UploadFileConfig;
}

/** Optional parameters for uploading a file to a FileSearchStore. */
declare interface UploadToFileSearchStoreConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** MIME type of the file to be uploaded. If not provided, it will be inferred from the file extension. */
    mimeType?: string;
    /** Display name of the created document. */
    displayName?: string;
    /** User provided custom metadata stored as key-value pairs used for querying. */
    customMetadata?: CustomMetadata[];
    /** Config for telling the service how to chunk the file. */
    chunkingConfig?: ChunkingConfig;
}

/** Long-running operation for uploading a file to a FileSearchStore. */
declare class UploadToFileSearchStoreOperation implements Operation<UploadToFileSearchStoreResponse> {
    /** The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`. */
    name?: string;
    /** Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata.  Any method that returns a long-running operation should document the metadata type, if any. */
    metadata?: Record<string, unknown>;
    /** If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available. */
    done?: boolean;
    /** The error result of the operation in case of failure or cancellation. */
    error?: Record<string, unknown>;
    /** The result of the UploadToFileSearchStore operation, available when the operation is done. */
    response?: UploadToFileSearchStoreResponse;
    /**
     * Instantiates an Operation of the same type as the one being called with the fields set from the API response.
     */
    _fromAPIResponse({ apiResponse, _isVertexAI, }: OperationFromAPIResponseParameters): Operation<UploadToFileSearchStoreResponse>;
    /** The full HTTP response. */
    sdkHttpResponse?: HttpResponse;
}

/** Generates the parameters for the private _upload_to_file_search_store method. */
declare interface UploadToFileSearchStoreParameters {
    /** The resource name of the FileSearchStore. Example: `fileSearchStores/my-file-search-store-123` */
    fileSearchStoreName: string;
    /** Used to override the default configuration. */
    config?: UploadToFileSearchStoreConfig;
}

/** Parameters for the upload file to file search store method. */
declare interface UploadToFileSearchStoreParameters {
    /** The name of the file search store to upload. */
    fileSearchStoreName: string;
    /** The string path to the file to be uploaded or a Blob object. */
    file: string | globalThis.Blob;
    /** Configuration that contains optional parameters. */
    config?: UploadToFileSearchStoreConfig;
}

/** The response when long-running operation for uploading a file to a FileSearchStore complete. */
declare class UploadToFileSearchStoreResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** The name of the FileSearchStore containing Documents. */
    parent?: string;
    /** The identifier for the Document imported. */
    documentName?: string;
}

/** Response for the resumable upload method. */
declare class UploadToFileSearchStoreResumableResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
}

/** Configuration for upscaling an image.

 For more information on this configuration, refer to
 the `Imagen API reference documentation
 <https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api>`_. */
declare interface UpscaleImageConfig {
    /** Used to override HTTP request options. */
    httpOptions?: HttpOptions;
    /** Abort signal which can be used to cancel the request.

     NOTE: AbortSignal is a client-only operation. Using it to cancel an
     operation will not cancel the request in the service. You will still
     be charged usage for any applicable operations.
     */
    abortSignal?: AbortSignal;
    /** Cloud Storage URI used to store the generated images. */
    outputGcsUri?: string;
    /** Filter level for safety filtering. */
    safetyFilterLevel?: SafetyFilterLevel;
    /** Allows generation of people by the model. */
    personGeneration?: PersonGeneration;
    /** Whether to include a reason for filtered-out images in the
     response. */
    includeRaiReason?: boolean;
    /** The image format that the output should be saved as. */
    outputMimeType?: string;
    /** The level of compression. Only applicable if the
     ``output_mime_type`` is ``image/jpeg``. */
    outputCompressionQuality?: number;
    /** Whether to add an image enhancing step before upscaling.
     It is expected to suppress the noise and JPEG compression artifacts
     from the input image. */
    enhanceInputImage?: boolean;
    /** With a higher image preservation factor, the original image
     pixels are more respected. With a lower image preservation factor, the
     output image will have be more different from the input image, but
     with finer details and less noise. */
    imagePreservationFactor?: number;
    /** User specified labels to track billing usage. */
    labels?: Record<string, string>;
}

/** User-facing config UpscaleImageParameters. */
declare interface UpscaleImageParameters {
    /** The model to use. */
    model: string;
    /** The input image to upscale. */
    image: Image_2;
    /** The factor to upscale the image (x2 or x4). */
    upscaleFactor: string;
    /** Configuration for upscaling. */
    config?: UpscaleImageConfig;
}

declare class UpscaleImageResponse {
    /** Used to retain the full HTTP response. */
    sdkHttpResponse?: HttpResponse;
    /** Generated images. */
    generatedImages?: GeneratedImage[];
}

/** Tool to support URL context. */
declare interface UrlContext {
}

/** Metadata returned when the model uses the `url_context` tool to get information from a user-provided URL. */
declare interface UrlContextMetadata {
    /** Output only. A list of URL metadata, with one entry for each URL retrieved by the tool. */
    urlMetadata?: UrlMetadata[];
}

/** The metadata for a single URL retrieval. */
declare interface UrlMetadata {
    /** The URL retrieved by the tool. */
    retrievedUrl?: string;
    /** The status of the URL retrieval. */
    urlRetrievalStatus?: UrlRetrievalStatus;
}

/** The status of the URL retrieval. */
declare enum UrlRetrievalStatus {
    /**
     * Default value. This value is unused.
     */
    URL_RETRIEVAL_STATUS_UNSPECIFIED = "URL_RETRIEVAL_STATUS_UNSPECIFIED",
    /**
     * The URL was retrieved successfully.
     */
    URL_RETRIEVAL_STATUS_SUCCESS = "URL_RETRIEVAL_STATUS_SUCCESS",
    /**
     * The URL retrieval failed.
     */
    URL_RETRIEVAL_STATUS_ERROR = "URL_RETRIEVAL_STATUS_ERROR",
    /**
     * Url retrieval is failed because the content is behind paywall. This enum value is not supported in Vertex AI.
     */
    URL_RETRIEVAL_STATUS_PAYWALL = "URL_RETRIEVAL_STATUS_PAYWALL",
    /**
     * Url retrieval is failed because the content is unsafe. This enum value is not supported in Vertex AI.
     */
    URL_RETRIEVAL_STATUS_UNSAFE = "URL_RETRIEVAL_STATUS_UNSAFE"
}

/** Usage metadata about response(s). */
declare interface UsageMetadata {
    /** Number of tokens in the prompt. When `cached_content` is set, this is still the total effective prompt size meaning this includes the number of tokens in the cached content. */
    promptTokenCount?: number;
    /** Number of tokens in the cached part of the prompt (the cached content). */
    cachedContentTokenCount?: number;
    /** Total number of tokens across all the generated response candidates. */
    responseTokenCount?: number;
    /** Number of tokens present in tool-use prompt(s). */
    toolUsePromptTokenCount?: number;
    /** Number of tokens of thoughts for thinking models. */
    thoughtsTokenCount?: number;
    /** Total token count for prompt, response candidates, and tool-use prompts(if present). */
    totalTokenCount?: number;
    /** List of modalities that were processed in the request input. */
    promptTokensDetails?: ModalityTokenCount[];
    /** List of modalities that were processed in the cache input. */
    cacheTokensDetails?: ModalityTokenCount[];
    /** List of modalities that were returned in the response. */
    responseTokensDetails?: ModalityTokenCount[];
    /** List of modalities that were processed in the tool-use prompt. */
    toolUsePromptTokensDetails?: ModalityTokenCount[];
    /** Traffic type. This shows whether a request consumes Pay-As-You-Go
     or Provisioned Throughput quota. */
    trafficType?: TrafficType;
}

/** The type of the VAD signal. */
declare enum VadSignalType {
    /**
     * The default is VAD_SIGNAL_TYPE_UNSPECIFIED.
     */
    VAD_SIGNAL_TYPE_UNSPECIFIED = "VAD_SIGNAL_TYPE_UNSPECIFIED",
    /**
     * Start of sentence signal.
     */
    VAD_SIGNAL_TYPE_SOS = "VAD_SIGNAL_TYPE_SOS",
    /**
     * End of sentence signal.
     */
    VAD_SIGNAL_TYPE_EOS = "VAD_SIGNAL_TYPE_EOS"
}

/** Hyperparameters for Veo. This data type is not supported in Gemini API. */
declare interface VeoHyperParameters {
    /** Optional. Number of complete passes the model makes over the entire training dataset during training. */
    epochCount?: string;
    /** Optional. Multiplier for adjusting the default learning rate. */
    learningRateMultiplier?: number;
    /** Optional. The tuning task. Either I2V or T2V. */
    tuningTask?: TuningTask;
    /** Optional. The ratio of Google internal dataset to use in the training mixture, in range of `[0, 1)`. If `0.2`, it means 20% of Google internal dataset and 80% of user dataset will be used for training. If not set, the default value is 0.1. */
    veoDataMixtureRatio?: number;
}

/** Tuning Spec for Veo Model Tuning. This data type is not supported in Gemini API. */
declare interface VeoTuningSpec {
    /** Optional. Hyperparameters for Veo. */
    hyperParameters?: VeoHyperParameters;
    /** Required. Training dataset used for tuning. The dataset can be specified as either a Cloud Storage path to a JSONL file or as the resource name of a Vertex Multimodal Dataset. */
    trainingDatasetUri?: string;
    /** Optional. Validation dataset used for tuning. The dataset can be specified as either a Cloud Storage path to a JSONL file or as the resource name of a Vertex Multimodal Dataset. */
    validationDatasetUri?: string;
}

/** Retrieve from Vertex AI Search datastore or engine for grounding. datastore and engine are mutually exclusive. See https://cloud.google.com/products/agent-builder. This data type is not supported in Gemini API. */
declare interface VertexAISearch {
    /** Specifications that define the specific DataStores to be searched, along with configurations for those data stores. This is only considered for Engines with multiple data stores. It should only be set if engine is used. */
    dataStoreSpecs?: VertexAISearchDataStoreSpec[];
    /** Optional. Fully-qualified Vertex AI Search data store resource ID. Format: `projects/{project}/locations/{location}/collections/{collection}/dataStores/{dataStore}` */
    datastore?: string;
    /** Optional. Fully-qualified Vertex AI Search engine resource ID. Format: `projects/{project}/locations/{location}/collections/{collection}/engines/{engine}` */
    engine?: string;
    /** Optional. Filter strings to be passed to the search API. */
    filter?: string;
    /** Optional. Number of search results to return per query. The default value is 10. The maximumm allowed value is 10. */
    maxResults?: number;
}

/** Define data stores within engine to filter on in a search call and configurations for those data stores. For more information, see https://cloud.google.com/generative-ai-app-builder/docs/reference/rpc/google.cloud.discoveryengine.v1#datastorespec. This data type is not supported in Gemini API. */
declare interface VertexAISearchDataStoreSpec {
    /** Full resource name of DataStore, such as Format: `projects/{project}/locations/{location}/collections/{collection}/dataStores/{dataStore}` */
    dataStore?: string;
    /** Optional. Filter specification to filter documents in the data store specified by data_store field. For more information on filtering, see [Filtering](https://cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata) */
    filter?: string;
}

/** Retrieve from Vertex RAG Store for grounding. This data type is not supported in Gemini API. */
declare interface VertexRagStore {
    /** Optional. Deprecated. Please use rag_resources instead. */
    ragCorpora?: string[];
    /** Optional. The representation of the rag source. It can be used to specify corpus only or ragfiles. Currently only support one corpus or multiple files from one corpus. In the future we may open up multiple corpora support. */
    ragResources?: VertexRagStoreRagResource[];
    /** Optional. The retrieval config for the Rag query. */
    ragRetrievalConfig?: RagRetrievalConfig;
    /** Optional. Number of top k results to return from the selected corpora. */
    similarityTopK?: number;
    /** Optional. Currently only supported for Gemini Multimodal Live API. In Gemini Multimodal Live API, if `store_context` bool is specified, Gemini will leverage it to automatically memorize the interactions between the client and Gemini, and retrieve context when needed to augment the response generation for users' ongoing and future interactions. */
    storeContext?: boolean;
    /** Optional. Only return results with vector distance smaller than the threshold. */
    vectorDistanceThreshold?: number;
}

/** The definition of the Rag resource. This data type is not supported in Gemini API. */
declare interface VertexRagStoreRagResource {
    /** Optional. RagCorpora resource name. Format: `projects/{project}/locations/{location}/ragCorpora/{rag_corpus}` */
    ragCorpus?: string;
    /** Optional. rag_file_id. The files should be in the same rag_corpus set in rag_corpus field. */
    ragFileIds?: string[];
}

/** A generated video. */
declare interface Video {
    /** Path to another storage. */
    uri?: string;
    /** Video bytes.
     * @remarks Encoded as base64 string. */
    videoBytes?: string;
    /** Video encoding, for example ``video/mp4``. */
    mimeType?: string;
}

/** Enum that controls the compression quality of the generated videos. */
declare enum VideoCompressionQuality {
    /**
     * Optimized video compression quality. This will produce videos
     with a compressed, smaller file size.
     */
    OPTIMIZED = "OPTIMIZED",
    /**
     * Lossless video compression quality. This will produce videos
     with a larger file size.
     */
    LOSSLESS = "LOSSLESS"
}

/** A mask for video generation. */
declare interface VideoGenerationMask {
    /** The image mask to use for generating videos. */
    image?: Image_2;
    /** Describes how the mask will be used. Inpainting masks must
     match the aspect ratio of the input video. Outpainting masks can be
     either 9:16 or 16:9. */
    maskMode?: VideoGenerationMaskMode;
}

/** Enum for the mask mode of a video generation mask. */
declare enum VideoGenerationMaskMode {
    /**
     * The image mask contains a masked rectangular region which is
     applied on the first frame of the input video. The object described in
     the prompt is inserted into this region and will appear in subsequent
     frames.
     */
    INSERT = "INSERT",
    /**
     * The image mask is used to determine an object in the
     first video frame to track. This object is removed from the video.
     */
    REMOVE = "REMOVE",
    /**
     * The image mask is used to determine a region in the
     video. Objects in this region will be removed.
     */
    REMOVE_STATIC = "REMOVE_STATIC",
    /**
     * The image mask contains a masked rectangular region where
     the input video will go. The remaining area will be generated. Video
     masks are not supported.
     */
    OUTPAINT = "OUTPAINT"
}

/** A reference image for video generation. */
declare interface VideoGenerationReferenceImage {
    /** The reference image. */
    image?: Image_2;
    /** The type of the reference image, which defines how the reference
     image will be used to generate the video. */
    referenceType?: VideoGenerationReferenceType;
}

/** Enum for the reference type of a video generation reference image. */
declare enum VideoGenerationReferenceType {
    /**
     * A reference image that provides assets to the generated video,
     such as the scene, an object, a character, etc.
     */
    ASSET = "ASSET",
    /**
     * A reference image that provides aesthetics including colors,
     lighting, texture, etc., to be used as the style of the generated video,
     such as 'anime', 'photography', 'origami', etc.
     */
    STYLE = "STYLE"
}

/** Provides metadata for a video, including the start and end offsets for clipping and the frame rate. */
declare interface VideoMetadata {
    /** Optional. The end offset of the video. */
    endOffset?: string;
    /** Optional. The frame rate of the video sent to the model. If not specified, the default value is 1.0. The valid range is (0.0, 24.0]. */
    fps?: number;
    /** Optional. The start offset of the video. */
    startOffset?: string;
}

/** Voice activity signal. */
declare interface VoiceActivity {
    /** The type of the voice activity signal. */
    voiceActivityType?: VoiceActivityType;
}

declare interface VoiceActivityDetectionSignal {
    /** The type of the VAD signal. */
    vadSignalType?: VadSignalType;
}

/** The type of the voice activity signal. */
declare enum VoiceActivityType {
    /**
     * The default is VOICE_ACTIVITY_TYPE_UNSPECIFIED.
     */
    TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
    /**
     * Start of sentence signal.
     */
    ACTIVITY_START = "ACTIVITY_START",
    /**
     * End of sentence signal.
     */
    ACTIVITY_END = "ACTIVITY_END"
}

/** The configuration for the voice to use. */
declare interface VoiceConfig {
    /** The configuration for a replicated voice, which is a clone of a
     user's voice that can be used for speech synthesis. If this is unset, a
     default voice is used. */
    replicatedVoiceConfig?: ReplicatedVoiceConfig;
    /** The configuration for a prebuilt voice. */
    prebuiltVoiceConfig?: PrebuiltVoiceConfig;
}

/** Standard web search for grounding and related configurations. Only text results are returned. */
declare interface WebSearch {
}

/** Maps a prompt to a relative weight to steer music generation. */
declare interface WeightedPrompt {
    /** Text prompt. */
    text?: string;
    /** Weight of the prompt. The weight is used to control the relative
     importance of the prompt. Higher weights are more important than lower
     weights.

     Weight must not be 0. Weights of all weighted_prompts in this
     LiveMusicClientContent message will be normalized. */
    weight?: number;
}

/** Configuration for a white space chunking algorithm. */
declare interface WhiteSpaceConfig {
    /** Maximum number of tokens per chunk. */
    maxTokensPerChunk?: number;
    /** Maximum number of overlapping tokens between two adjacent chunks. */
    maxOverlapTokens?: number;
}

export { }
