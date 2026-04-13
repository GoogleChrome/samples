import $protobuf from 'protobufjs/minimal.js';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** Programming language of the `code`. */
var Language;
(function (Language) {
    /**
     * Unspecified language. This value should not be used.
     */
    Language["LANGUAGE_UNSPECIFIED"] = "LANGUAGE_UNSPECIFIED";
    /**
     * Python >= 3.10, with numpy and simpy available.
     */
    Language["PYTHON"] = "PYTHON";
})(Language || (Language = {}));
/** Outcome of the code execution. */
var Outcome;
(function (Outcome) {
    /**
     * Unspecified status. This value should not be used.
     */
    Outcome["OUTCOME_UNSPECIFIED"] = "OUTCOME_UNSPECIFIED";
    /**
     * Code execution completed successfully.
     */
    Outcome["OUTCOME_OK"] = "OUTCOME_OK";
    /**
     * Code execution finished but with a failure. `stderr` should contain the reason.
     */
    Outcome["OUTCOME_FAILED"] = "OUTCOME_FAILED";
    /**
     * Code execution ran for too long, and was cancelled. There may or may not be a partial output present.
     */
    Outcome["OUTCOME_DEADLINE_EXCEEDED"] = "OUTCOME_DEADLINE_EXCEEDED";
})(Outcome || (Outcome = {}));
/** Specifies how the response should be scheduled in the conversation. */
var FunctionResponseScheduling;
(function (FunctionResponseScheduling) {
    /**
     * This value is unused.
     */
    FunctionResponseScheduling["SCHEDULING_UNSPECIFIED"] = "SCHEDULING_UNSPECIFIED";
    /**
     * Only add the result to the conversation context, do not interrupt or trigger generation.
     */
    FunctionResponseScheduling["SILENT"] = "SILENT";
    /**
     * Add the result to the conversation context, and prompt to generate output without interrupting ongoing generation.
     */
    FunctionResponseScheduling["WHEN_IDLE"] = "WHEN_IDLE";
    /**
     * Add the result to the conversation context, interrupt ongoing generation and prompt to generate output.
     */
    FunctionResponseScheduling["INTERRUPT"] = "INTERRUPT";
})(FunctionResponseScheduling || (FunctionResponseScheduling = {}));
/** Data type of the schema field. */
var Type;
(function (Type) {
    /**
     * Not specified, should not be used.
     */
    Type["TYPE_UNSPECIFIED"] = "TYPE_UNSPECIFIED";
    /**
     * OpenAPI string type
     */
    Type["STRING"] = "STRING";
    /**
     * OpenAPI number type
     */
    Type["NUMBER"] = "NUMBER";
    /**
     * OpenAPI integer type
     */
    Type["INTEGER"] = "INTEGER";
    /**
     * OpenAPI boolean type
     */
    Type["BOOLEAN"] = "BOOLEAN";
    /**
     * OpenAPI array type
     */
    Type["ARRAY"] = "ARRAY";
    /**
     * OpenAPI object type
     */
    Type["OBJECT"] = "OBJECT";
    /**
     * Null type
     */
    Type["NULL"] = "NULL";
})(Type || (Type = {}));
/** The environment being operated. */
var Environment;
(function (Environment) {
    /**
     * Defaults to browser.
     */
    Environment["ENVIRONMENT_UNSPECIFIED"] = "ENVIRONMENT_UNSPECIFIED";
    /**
     * Operates in a web browser.
     */
    Environment["ENVIRONMENT_BROWSER"] = "ENVIRONMENT_BROWSER";
})(Environment || (Environment = {}));
/** Type of auth scheme. This enum is not supported in Gemini API. */
var AuthType;
(function (AuthType) {
    AuthType["AUTH_TYPE_UNSPECIFIED"] = "AUTH_TYPE_UNSPECIFIED";
    /**
     * No Auth.
     */
    AuthType["NO_AUTH"] = "NO_AUTH";
    /**
     * API Key Auth.
     */
    AuthType["API_KEY_AUTH"] = "API_KEY_AUTH";
    /**
     * HTTP Basic Auth.
     */
    AuthType["HTTP_BASIC_AUTH"] = "HTTP_BASIC_AUTH";
    /**
     * Google Service Account Auth.
     */
    AuthType["GOOGLE_SERVICE_ACCOUNT_AUTH"] = "GOOGLE_SERVICE_ACCOUNT_AUTH";
    /**
     * OAuth auth.
     */
    AuthType["OAUTH"] = "OAUTH";
    /**
     * OpenID Connect (OIDC) Auth.
     */
    AuthType["OIDC_AUTH"] = "OIDC_AUTH";
})(AuthType || (AuthType = {}));
/** The location of the API key. This enum is not supported in Gemini API. */
var HttpElementLocation;
(function (HttpElementLocation) {
    HttpElementLocation["HTTP_IN_UNSPECIFIED"] = "HTTP_IN_UNSPECIFIED";
    /**
     * Element is in the HTTP request query.
     */
    HttpElementLocation["HTTP_IN_QUERY"] = "HTTP_IN_QUERY";
    /**
     * Element is in the HTTP request header.
     */
    HttpElementLocation["HTTP_IN_HEADER"] = "HTTP_IN_HEADER";
    /**
     * Element is in the HTTP request path.
     */
    HttpElementLocation["HTTP_IN_PATH"] = "HTTP_IN_PATH";
    /**
     * Element is in the HTTP request body.
     */
    HttpElementLocation["HTTP_IN_BODY"] = "HTTP_IN_BODY";
    /**
     * Element is in the HTTP request cookie.
     */
    HttpElementLocation["HTTP_IN_COOKIE"] = "HTTP_IN_COOKIE";
})(HttpElementLocation || (HttpElementLocation = {}));
/** The API spec that the external API implements. This enum is not supported in Gemini API. */
var ApiSpec;
(function (ApiSpec) {
    /**
     * Unspecified API spec. This value should not be used.
     */
    ApiSpec["API_SPEC_UNSPECIFIED"] = "API_SPEC_UNSPECIFIED";
    /**
     * Simple search API spec.
     */
    ApiSpec["SIMPLE_SEARCH"] = "SIMPLE_SEARCH";
    /**
     * Elastic search API spec.
     */
    ApiSpec["ELASTIC_SEARCH"] = "ELASTIC_SEARCH";
})(ApiSpec || (ApiSpec = {}));
/** Sites with confidence level chosen & above this value will be blocked from the search results. This enum is not supported in Gemini API. */
var PhishBlockThreshold;
(function (PhishBlockThreshold) {
    /**
     * Defaults to unspecified.
     */
    PhishBlockThreshold["PHISH_BLOCK_THRESHOLD_UNSPECIFIED"] = "PHISH_BLOCK_THRESHOLD_UNSPECIFIED";
    /**
     * Blocks Low and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    /**
     * Blocks Medium and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    /**
     * Blocks High and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_HIGH_AND_ABOVE"] = "BLOCK_HIGH_AND_ABOVE";
    /**
     * Blocks Higher and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_HIGHER_AND_ABOVE"] = "BLOCK_HIGHER_AND_ABOVE";
    /**
     * Blocks Very high and above confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_VERY_HIGH_AND_ABOVE"] = "BLOCK_VERY_HIGH_AND_ABOVE";
    /**
     * Blocks Extremely high confidence URL that is risky.
     */
    PhishBlockThreshold["BLOCK_ONLY_EXTREMELY_HIGH"] = "BLOCK_ONLY_EXTREMELY_HIGH";
})(PhishBlockThreshold || (PhishBlockThreshold = {}));
/** Specifies the function Behavior. Currently only supported by the BidiGenerateContent method. This enum is not supported in Vertex AI. */
var Behavior;
(function (Behavior) {
    /**
     * This value is unused.
     */
    Behavior["UNSPECIFIED"] = "UNSPECIFIED";
    /**
     * If set, the system will wait to receive the function response before continuing the conversation.
     */
    Behavior["BLOCKING"] = "BLOCKING";
    /**
     * If set, the system will not wait to receive the function response. Instead, it will attempt to handle function responses as they become available while maintaining the conversation between the user and the model.
     */
    Behavior["NON_BLOCKING"] = "NON_BLOCKING";
})(Behavior || (Behavior = {}));
/** The mode of the predictor to be used in dynamic retrieval. */
var DynamicRetrievalConfigMode;
(function (DynamicRetrievalConfigMode) {
    /**
     * Always trigger retrieval.
     */
    DynamicRetrievalConfigMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    /**
     * Run retrieval only when system decides it is necessary.
     */
    DynamicRetrievalConfigMode["MODE_DYNAMIC"] = "MODE_DYNAMIC";
})(DynamicRetrievalConfigMode || (DynamicRetrievalConfigMode = {}));
/** Function calling mode. */
var FunctionCallingConfigMode;
(function (FunctionCallingConfigMode) {
    /**
     * Unspecified function calling mode. This value should not be used.
     */
    FunctionCallingConfigMode["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    /**
     * Default model behavior, model decides to predict either function calls or natural language response.
     */
    FunctionCallingConfigMode["AUTO"] = "AUTO";
    /**
     * Model is constrained to always predicting function calls only. If "allowed_function_names" are set, the predicted function calls will be limited to any one of "allowed_function_names", else the predicted function calls will be any one of the provided "function_declarations".
     */
    FunctionCallingConfigMode["ANY"] = "ANY";
    /**
     * Model will not predict any function calls. Model behavior is same as when not passing any function declarations.
     */
    FunctionCallingConfigMode["NONE"] = "NONE";
    /**
     * Model is constrained to predict either function calls or natural language response. If "allowed_function_names" are set, the predicted function calls will be limited to any one of "allowed_function_names", else the predicted function calls will be any one of the provided "function_declarations".
     */
    FunctionCallingConfigMode["VALIDATED"] = "VALIDATED";
})(FunctionCallingConfigMode || (FunctionCallingConfigMode = {}));
/** The number of thoughts tokens that the model should generate. */
var ThinkingLevel;
(function (ThinkingLevel) {
    /**
     * Unspecified thinking level.
     */
    ThinkingLevel["THINKING_LEVEL_UNSPECIFIED"] = "THINKING_LEVEL_UNSPECIFIED";
    /**
     * MINIMAL thinking level.
     */
    ThinkingLevel["MINIMAL"] = "MINIMAL";
    /**
     * Low thinking level.
     */
    ThinkingLevel["LOW"] = "LOW";
    /**
     * Medium thinking level.
     */
    ThinkingLevel["MEDIUM"] = "MEDIUM";
    /**
     * High thinking level.
     */
    ThinkingLevel["HIGH"] = "HIGH";
})(ThinkingLevel || (ThinkingLevel = {}));
/** Enum that controls the generation of people. */
var PersonGeneration;
(function (PersonGeneration) {
    /**
     * Block generation of images of people.
     */
    PersonGeneration["DONT_ALLOW"] = "DONT_ALLOW";
    /**
     * Generate images of adults, but not children.
     */
    PersonGeneration["ALLOW_ADULT"] = "ALLOW_ADULT";
    /**
     * Generate images that include adults and children.
     */
    PersonGeneration["ALLOW_ALL"] = "ALLOW_ALL";
})(PersonGeneration || (PersonGeneration = {}));
/** Controls whether prominent people (celebrities) generation is allowed. If used with personGeneration, personGeneration enum would take precedence. For instance, if ALLOW_NONE is set, all person generation would be blocked. If this field is unspecified, the default behavior is to allow prominent people. This enum is not supported in Gemini API. */
var ProminentPeople;
(function (ProminentPeople) {
    /**
     * Unspecified value. The model will proceed with the default behavior, which is to allow generation of prominent people.
     */
    ProminentPeople["PROMINENT_PEOPLE_UNSPECIFIED"] = "PROMINENT_PEOPLE_UNSPECIFIED";
    /**
     * Allows the model to generate images of prominent people.
     */
    ProminentPeople["ALLOW_PROMINENT_PEOPLE"] = "ALLOW_PROMINENT_PEOPLE";
    /**
     * Prevents the model from generating images of prominent people.
     */
    ProminentPeople["BLOCK_PROMINENT_PEOPLE"] = "BLOCK_PROMINENT_PEOPLE";
})(ProminentPeople || (ProminentPeople = {}));
/** The harm category to be blocked. */
var HarmCategory;
(function (HarmCategory) {
    /**
     * Default value. This value is unused.
     */
    HarmCategory["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
    /**
     * Abusive, threatening, or content intended to bully, torment, or ridicule.
     */
    HarmCategory["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
    /**
     * Content that promotes violence or incites hatred against individuals or groups based on certain attributes.
     */
    HarmCategory["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
    /**
     * Content that contains sexually explicit material.
     */
    HarmCategory["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
    /**
     * Content that promotes, facilitates, or enables dangerous activities.
     */
    HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
    /**
     * Deprecated: Election filter is not longer supported. The harm category is civic integrity.
     */
    HarmCategory["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";
    /**
     * Images that contain hate speech. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_IMAGE_HATE"] = "HARM_CATEGORY_IMAGE_HATE";
    /**
     * Images that contain dangerous content. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT"] = "HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT";
    /**
     * Images that contain harassment. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_IMAGE_HARASSMENT"] = "HARM_CATEGORY_IMAGE_HARASSMENT";
    /**
     * Images that contain sexually explicit content. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT";
    /**
     * Prompts designed to bypass safety filters. This enum value is not supported in Gemini API.
     */
    HarmCategory["HARM_CATEGORY_JAILBREAK"] = "HARM_CATEGORY_JAILBREAK";
})(HarmCategory || (HarmCategory = {}));
/** The method for blocking content. If not specified, the default behavior is to use the probability score. This enum is not supported in Gemini API. */
var HarmBlockMethod;
(function (HarmBlockMethod) {
    /**
     * The harm block method is unspecified.
     */
    HarmBlockMethod["HARM_BLOCK_METHOD_UNSPECIFIED"] = "HARM_BLOCK_METHOD_UNSPECIFIED";
    /**
     * The harm block method uses both probability and severity scores.
     */
    HarmBlockMethod["SEVERITY"] = "SEVERITY";
    /**
     * The harm block method uses the probability score.
     */
    HarmBlockMethod["PROBABILITY"] = "PROBABILITY";
})(HarmBlockMethod || (HarmBlockMethod = {}));
/** The threshold for blocking content. If the harm probability exceeds this threshold, the content will be blocked. */
var HarmBlockThreshold;
(function (HarmBlockThreshold) {
    /**
     * The harm block threshold is unspecified.
     */
    HarmBlockThreshold["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
    /**
     * Block content with a low harm probability or higher.
     */
    HarmBlockThreshold["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    /**
     * Block content with a medium harm probability or higher.
     */
    HarmBlockThreshold["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    /**
     * Block content with a high harm probability.
     */
    HarmBlockThreshold["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
    /**
     * Do not block any content, regardless of its harm probability.
     */
    HarmBlockThreshold["BLOCK_NONE"] = "BLOCK_NONE";
    /**
     * Turn off the safety filter entirely.
     */
    HarmBlockThreshold["OFF"] = "OFF";
})(HarmBlockThreshold || (HarmBlockThreshold = {}));
/** Output only. The reason why the model stopped generating tokens.

If empty, the model has not stopped generating the tokens. */
var FinishReason;
(function (FinishReason) {
    /**
     * The finish reason is unspecified.
     */
    FinishReason["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
    /**
     * Token generation reached a natural stopping point or a configured stop sequence.
     */
    FinishReason["STOP"] = "STOP";
    /**
     * Token generation reached the configured maximum output tokens.
     */
    FinishReason["MAX_TOKENS"] = "MAX_TOKENS";
    /**
     * Token generation stopped because the content potentially contains safety violations. NOTE: When streaming, [content][] is empty if content filters blocks the output.
     */
    FinishReason["SAFETY"] = "SAFETY";
    /**
     * The token generation stopped because of potential recitation.
     */
    FinishReason["RECITATION"] = "RECITATION";
    /**
     * The token generation stopped because of using an unsupported language.
     */
    FinishReason["LANGUAGE"] = "LANGUAGE";
    /**
     * All other reasons that stopped the token generation.
     */
    FinishReason["OTHER"] = "OTHER";
    /**
     * Token generation stopped because the content contains forbidden terms.
     */
    FinishReason["BLOCKLIST"] = "BLOCKLIST";
    /**
     * Token generation stopped for potentially containing prohibited content.
     */
    FinishReason["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
    /**
     * Token generation stopped because the content potentially contains Sensitive Personally Identifiable Information (SPII).
     */
    FinishReason["SPII"] = "SPII";
    /**
     * The function call generated by the model is invalid.
     */
    FinishReason["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
    /**
     * Token generation stopped because generated images have safety violations.
     */
    FinishReason["IMAGE_SAFETY"] = "IMAGE_SAFETY";
    /**
     * The tool call generated by the model is invalid.
     */
    FinishReason["UNEXPECTED_TOOL_CALL"] = "UNEXPECTED_TOOL_CALL";
    /**
     * Image generation stopped because the generated images have prohibited content.
     */
    FinishReason["IMAGE_PROHIBITED_CONTENT"] = "IMAGE_PROHIBITED_CONTENT";
    /**
     * The model was expected to generate an image, but none was generated.
     */
    FinishReason["NO_IMAGE"] = "NO_IMAGE";
    /**
     * Image generation stopped because the generated image may be a recitation from a source.
     */
    FinishReason["IMAGE_RECITATION"] = "IMAGE_RECITATION";
    /**
     * Image generation stopped for a reason not otherwise specified.
     */
    FinishReason["IMAGE_OTHER"] = "IMAGE_OTHER";
})(FinishReason || (FinishReason = {}));
/** Output only. The probability of harm for this category. */
var HarmProbability;
(function (HarmProbability) {
    /**
     * The harm probability is unspecified.
     */
    HarmProbability["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
    /**
     * The harm probability is negligible.
     */
    HarmProbability["NEGLIGIBLE"] = "NEGLIGIBLE";
    /**
     * The harm probability is low.
     */
    HarmProbability["LOW"] = "LOW";
    /**
     * The harm probability is medium.
     */
    HarmProbability["MEDIUM"] = "MEDIUM";
    /**
     * The harm probability is high.
     */
    HarmProbability["HIGH"] = "HIGH";
})(HarmProbability || (HarmProbability = {}));
/** Output only. The severity of harm for this category. This enum is not supported in Gemini API. */
var HarmSeverity;
(function (HarmSeverity) {
    /**
     * The harm severity is unspecified.
     */
    HarmSeverity["HARM_SEVERITY_UNSPECIFIED"] = "HARM_SEVERITY_UNSPECIFIED";
    /**
     * The harm severity is negligible.
     */
    HarmSeverity["HARM_SEVERITY_NEGLIGIBLE"] = "HARM_SEVERITY_NEGLIGIBLE";
    /**
     * The harm severity is low.
     */
    HarmSeverity["HARM_SEVERITY_LOW"] = "HARM_SEVERITY_LOW";
    /**
     * The harm severity is medium.
     */
    HarmSeverity["HARM_SEVERITY_MEDIUM"] = "HARM_SEVERITY_MEDIUM";
    /**
     * The harm severity is high.
     */
    HarmSeverity["HARM_SEVERITY_HIGH"] = "HARM_SEVERITY_HIGH";
})(HarmSeverity || (HarmSeverity = {}));
/** The status of the URL retrieval. */
var UrlRetrievalStatus;
(function (UrlRetrievalStatus) {
    /**
     * Default value. This value is unused.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_UNSPECIFIED"] = "URL_RETRIEVAL_STATUS_UNSPECIFIED";
    /**
     * The URL was retrieved successfully.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_SUCCESS"] = "URL_RETRIEVAL_STATUS_SUCCESS";
    /**
     * The URL retrieval failed.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_ERROR"] = "URL_RETRIEVAL_STATUS_ERROR";
    /**
     * Url retrieval is failed because the content is behind paywall. This enum value is not supported in Vertex AI.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_PAYWALL"] = "URL_RETRIEVAL_STATUS_PAYWALL";
    /**
     * Url retrieval is failed because the content is unsafe. This enum value is not supported in Vertex AI.
     */
    UrlRetrievalStatus["URL_RETRIEVAL_STATUS_UNSAFE"] = "URL_RETRIEVAL_STATUS_UNSAFE";
})(UrlRetrievalStatus || (UrlRetrievalStatus = {}));
/** Output only. The reason why the prompt was blocked. */
var BlockedReason;
(function (BlockedReason) {
    /**
     * The blocked reason is unspecified.
     */
    BlockedReason["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
    /**
     * The prompt was blocked for safety reasons.
     */
    BlockedReason["SAFETY"] = "SAFETY";
    /**
     * The prompt was blocked for other reasons. For example, it may be due to the prompt's language, or because it contains other harmful content.
     */
    BlockedReason["OTHER"] = "OTHER";
    /**
     * The prompt was blocked because it contains a term from the terminology blocklist.
     */
    BlockedReason["BLOCKLIST"] = "BLOCKLIST";
    /**
     * The prompt was blocked because it contains prohibited content.
     */
    BlockedReason["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
    /**
     * The prompt was blocked because it contains content that is unsafe for image generation.
     */
    BlockedReason["IMAGE_SAFETY"] = "IMAGE_SAFETY";
    /**
     * The prompt was blocked by Model Armor. This enum value is not supported in Gemini API.
     */
    BlockedReason["MODEL_ARMOR"] = "MODEL_ARMOR";
    /**
     * The prompt was blocked as a jailbreak attempt. This enum value is not supported in Gemini API.
     */
    BlockedReason["JAILBREAK"] = "JAILBREAK";
})(BlockedReason || (BlockedReason = {}));
/** Output only. The traffic type for this request. This enum is not supported in Gemini API. */
var TrafficType;
(function (TrafficType) {
    /**
     * Unspecified request traffic type.
     */
    TrafficType["TRAFFIC_TYPE_UNSPECIFIED"] = "TRAFFIC_TYPE_UNSPECIFIED";
    /**
     * The request was processed using Pay-As-You-Go quota.
     */
    TrafficType["ON_DEMAND"] = "ON_DEMAND";
    /**
     * Type for Priority Pay-As-You-Go traffic.
     */
    TrafficType["ON_DEMAND_PRIORITY"] = "ON_DEMAND_PRIORITY";
    /**
     * Type for Flex traffic.
     */
    TrafficType["ON_DEMAND_FLEX"] = "ON_DEMAND_FLEX";
    /**
     * Type for Provisioned Throughput traffic.
     */
    TrafficType["PROVISIONED_THROUGHPUT"] = "PROVISIONED_THROUGHPUT";
})(TrafficType || (TrafficType = {}));
/** Server content modalities. */
var Modality;
(function (Modality) {
    /**
     * The modality is unspecified.
     */
    Modality["MODALITY_UNSPECIFIED"] = "MODALITY_UNSPECIFIED";
    /**
     * Indicates the model should return text
     */
    Modality["TEXT"] = "TEXT";
    /**
     * Indicates the model should return images.
     */
    Modality["IMAGE"] = "IMAGE";
    /**
     * Indicates the model should return audio.
     */
    Modality["AUDIO"] = "AUDIO";
})(Modality || (Modality = {}));
/** The stage of the underlying model. This enum is not supported in Vertex AI. */
var ModelStage;
(function (ModelStage) {
    /**
     * Unspecified model stage.
     */
    ModelStage["MODEL_STAGE_UNSPECIFIED"] = "MODEL_STAGE_UNSPECIFIED";
    /**
     * The underlying model is subject to lots of tunings.
     */
    ModelStage["UNSTABLE_EXPERIMENTAL"] = "UNSTABLE_EXPERIMENTAL";
    /**
     * Models in this stage are for experimental purposes only.
     */
    ModelStage["EXPERIMENTAL"] = "EXPERIMENTAL";
    /**
     * Models in this stage are more mature than experimental models.
     */
    ModelStage["PREVIEW"] = "PREVIEW";
    /**
     * Models in this stage are considered stable and ready for production use.
     */
    ModelStage["STABLE"] = "STABLE";
    /**
     * If the model is on this stage, it means that this model is on the path to deprecation in near future. Only existing customers can use this model.
     */
    ModelStage["LEGACY"] = "LEGACY";
    /**
     * Models in this stage are deprecated. These models cannot be used.
     */
    ModelStage["DEPRECATED"] = "DEPRECATED";
    /**
     * Models in this stage are retired. These models cannot be used.
     */
    ModelStage["RETIRED"] = "RETIRED";
})(ModelStage || (ModelStage = {}));
/** The media resolution to use. */
var MediaResolution;
(function (MediaResolution) {
    /**
     * Media resolution has not been set
     */
    MediaResolution["MEDIA_RESOLUTION_UNSPECIFIED"] = "MEDIA_RESOLUTION_UNSPECIFIED";
    /**
     * Media resolution set to low (64 tokens).
     */
    MediaResolution["MEDIA_RESOLUTION_LOW"] = "MEDIA_RESOLUTION_LOW";
    /**
     * Media resolution set to medium (256 tokens).
     */
    MediaResolution["MEDIA_RESOLUTION_MEDIUM"] = "MEDIA_RESOLUTION_MEDIUM";
    /**
     * Media resolution set to high (zoomed reframing with 256 tokens).
     */
    MediaResolution["MEDIA_RESOLUTION_HIGH"] = "MEDIA_RESOLUTION_HIGH";
})(MediaResolution || (MediaResolution = {}));
/** Tuning mode. This enum is not supported in Gemini API. */
var TuningMode;
(function (TuningMode) {
    /**
     * Tuning mode is unspecified.
     */
    TuningMode["TUNING_MODE_UNSPECIFIED"] = "TUNING_MODE_UNSPECIFIED";
    /**
     * Full fine-tuning mode.
     */
    TuningMode["TUNING_MODE_FULL"] = "TUNING_MODE_FULL";
    /**
     * PEFT adapter tuning mode.
     */
    TuningMode["TUNING_MODE_PEFT_ADAPTER"] = "TUNING_MODE_PEFT_ADAPTER";
})(TuningMode || (TuningMode = {}));
/** Adapter size for tuning. This enum is not supported in Gemini API. */
var AdapterSize;
(function (AdapterSize) {
    /**
     * Adapter size is unspecified.
     */
    AdapterSize["ADAPTER_SIZE_UNSPECIFIED"] = "ADAPTER_SIZE_UNSPECIFIED";
    /**
     * Adapter size 1.
     */
    AdapterSize["ADAPTER_SIZE_ONE"] = "ADAPTER_SIZE_ONE";
    /**
     * Adapter size 2.
     */
    AdapterSize["ADAPTER_SIZE_TWO"] = "ADAPTER_SIZE_TWO";
    /**
     * Adapter size 4.
     */
    AdapterSize["ADAPTER_SIZE_FOUR"] = "ADAPTER_SIZE_FOUR";
    /**
     * Adapter size 8.
     */
    AdapterSize["ADAPTER_SIZE_EIGHT"] = "ADAPTER_SIZE_EIGHT";
    /**
     * Adapter size 16.
     */
    AdapterSize["ADAPTER_SIZE_SIXTEEN"] = "ADAPTER_SIZE_SIXTEEN";
    /**
     * Adapter size 32.
     */
    AdapterSize["ADAPTER_SIZE_THIRTY_TWO"] = "ADAPTER_SIZE_THIRTY_TWO";
})(AdapterSize || (AdapterSize = {}));
/** Job state. */
var JobState;
(function (JobState) {
    /**
     * The job state is unspecified.
     */
    JobState["JOB_STATE_UNSPECIFIED"] = "JOB_STATE_UNSPECIFIED";
    /**
     * The job has been just created or resumed and processing has not yet begun.
     */
    JobState["JOB_STATE_QUEUED"] = "JOB_STATE_QUEUED";
    /**
     * The service is preparing to run the job.
     */
    JobState["JOB_STATE_PENDING"] = "JOB_STATE_PENDING";
    /**
     * The job is in progress.
     */
    JobState["JOB_STATE_RUNNING"] = "JOB_STATE_RUNNING";
    /**
     * The job completed successfully.
     */
    JobState["JOB_STATE_SUCCEEDED"] = "JOB_STATE_SUCCEEDED";
    /**
     * The job failed.
     */
    JobState["JOB_STATE_FAILED"] = "JOB_STATE_FAILED";
    /**
     * The job is being cancelled. From this state the job may only go to either `JOB_STATE_SUCCEEDED`, `JOB_STATE_FAILED` or `JOB_STATE_CANCELLED`.
     */
    JobState["JOB_STATE_CANCELLING"] = "JOB_STATE_CANCELLING";
    /**
     * The job has been cancelled.
     */
    JobState["JOB_STATE_CANCELLED"] = "JOB_STATE_CANCELLED";
    /**
     * The job has been stopped, and can be resumed.
     */
    JobState["JOB_STATE_PAUSED"] = "JOB_STATE_PAUSED";
    /**
     * The job has expired.
     */
    JobState["JOB_STATE_EXPIRED"] = "JOB_STATE_EXPIRED";
    /**
     * The job is being updated. Only jobs in the `JOB_STATE_RUNNING` state can be updated. After updating, the job goes back to the `JOB_STATE_RUNNING` state.
     */
    JobState["JOB_STATE_UPDATING"] = "JOB_STATE_UPDATING";
    /**
     * The job is partially succeeded, some results may be missing due to errors.
     */
    JobState["JOB_STATE_PARTIALLY_SUCCEEDED"] = "JOB_STATE_PARTIALLY_SUCCEEDED";
})(JobState || (JobState = {}));
/** Output only. The detail state of the tuning job (while the overall `JobState` is running). This enum is not supported in Gemini API. */
var TuningJobState;
(function (TuningJobState) {
    /**
     * Default tuning job state.
     */
    TuningJobState["TUNING_JOB_STATE_UNSPECIFIED"] = "TUNING_JOB_STATE_UNSPECIFIED";
    /**
     * Tuning job is waiting for job quota.
     */
    TuningJobState["TUNING_JOB_STATE_WAITING_FOR_QUOTA"] = "TUNING_JOB_STATE_WAITING_FOR_QUOTA";
    /**
     * Tuning job is validating the dataset.
     */
    TuningJobState["TUNING_JOB_STATE_PROCESSING_DATASET"] = "TUNING_JOB_STATE_PROCESSING_DATASET";
    /**
     * Tuning job is waiting for hardware capacity.
     */
    TuningJobState["TUNING_JOB_STATE_WAITING_FOR_CAPACITY"] = "TUNING_JOB_STATE_WAITING_FOR_CAPACITY";
    /**
     * Tuning job is running.
     */
    TuningJobState["TUNING_JOB_STATE_TUNING"] = "TUNING_JOB_STATE_TUNING";
    /**
     * Tuning job is doing some post processing steps.
     */
    TuningJobState["TUNING_JOB_STATE_POST_PROCESSING"] = "TUNING_JOB_STATE_POST_PROCESSING";
})(TuningJobState || (TuningJobState = {}));
/** Aggregation metric. This enum is not supported in Gemini API. */
var AggregationMetric;
(function (AggregationMetric) {
    /**
     * Unspecified aggregation metric.
     */
    AggregationMetric["AGGREGATION_METRIC_UNSPECIFIED"] = "AGGREGATION_METRIC_UNSPECIFIED";
    /**
     * Average aggregation metric. Not supported for Pairwise metric.
     */
    AggregationMetric["AVERAGE"] = "AVERAGE";
    /**
     * Mode aggregation metric.
     */
    AggregationMetric["MODE"] = "MODE";
    /**
     * Standard deviation aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["STANDARD_DEVIATION"] = "STANDARD_DEVIATION";
    /**
     * Variance aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["VARIANCE"] = "VARIANCE";
    /**
     * Minimum aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["MINIMUM"] = "MINIMUM";
    /**
     * Maximum aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["MAXIMUM"] = "MAXIMUM";
    /**
     * Median aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["MEDIAN"] = "MEDIAN";
    /**
     * 90th percentile aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["PERCENTILE_P90"] = "PERCENTILE_P90";
    /**
     * 95th percentile aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["PERCENTILE_P95"] = "PERCENTILE_P95";
    /**
     * 99th percentile aggregation metric. Not supported for pairwise metric.
     */
    AggregationMetric["PERCENTILE_P99"] = "PERCENTILE_P99";
})(AggregationMetric || (AggregationMetric = {}));
/** Output only. Pairwise metric choice. This enum is not supported in Gemini API. */
var PairwiseChoice;
(function (PairwiseChoice) {
    /**
     * Unspecified prediction choice.
     */
    PairwiseChoice["PAIRWISE_CHOICE_UNSPECIFIED"] = "PAIRWISE_CHOICE_UNSPECIFIED";
    /**
     * Baseline prediction wins
     */
    PairwiseChoice["BASELINE"] = "BASELINE";
    /**
     * Candidate prediction wins
     */
    PairwiseChoice["CANDIDATE"] = "CANDIDATE";
    /**
     * Winner cannot be determined
     */
    PairwiseChoice["TIE"] = "TIE";
})(PairwiseChoice || (PairwiseChoice = {}));
/** The tuning task. Either I2V or T2V. This enum is not supported in Gemini API. */
var TuningTask;
(function (TuningTask) {
    /**
     * Default value. This value is unused.
     */
    TuningTask["TUNING_TASK_UNSPECIFIED"] = "TUNING_TASK_UNSPECIFIED";
    /**
     * Tuning task for image to video.
     */
    TuningTask["TUNING_TASK_I2V"] = "TUNING_TASK_I2V";
    /**
     * Tuning task for text to video.
     */
    TuningTask["TUNING_TASK_T2V"] = "TUNING_TASK_T2V";
    /**
     * Tuning task for reference to video.
     */
    TuningTask["TUNING_TASK_R2V"] = "TUNING_TASK_R2V";
})(TuningTask || (TuningTask = {}));
/** Output only. Current state of the `Document`. This enum is not supported in Vertex AI. */
var DocumentState;
(function (DocumentState) {
    /**
     * The default value. This value is used if the state is omitted.
     */
    DocumentState["STATE_UNSPECIFIED"] = "STATE_UNSPECIFIED";
    /**
     * Some `Chunks` of the `Document` are being processed (embedding and vector storage).
     */
    DocumentState["STATE_PENDING"] = "STATE_PENDING";
    /**
     * All `Chunks` of the `Document` is processed and available for querying.
     */
    DocumentState["STATE_ACTIVE"] = "STATE_ACTIVE";
    /**
     * Some `Chunks` of the `Document` failed processing.
     */
    DocumentState["STATE_FAILED"] = "STATE_FAILED";
})(DocumentState || (DocumentState = {}));
/** The tokenization quality used for given media. */
var PartMediaResolutionLevel;
(function (PartMediaResolutionLevel) {
    /**
     * Media resolution has not been set.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_UNSPECIFIED"] = "MEDIA_RESOLUTION_UNSPECIFIED";
    /**
     * Media resolution set to low.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_LOW"] = "MEDIA_RESOLUTION_LOW";
    /**
     * Media resolution set to medium.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_MEDIUM"] = "MEDIA_RESOLUTION_MEDIUM";
    /**
     * Media resolution set to high.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_HIGH"] = "MEDIA_RESOLUTION_HIGH";
    /**
     * Media resolution set to ultra high.
     */
    PartMediaResolutionLevel["MEDIA_RESOLUTION_ULTRA_HIGH"] = "MEDIA_RESOLUTION_ULTRA_HIGH";
})(PartMediaResolutionLevel || (PartMediaResolutionLevel = {}));
/** The type of tool in the function call. */
var ToolType;
(function (ToolType) {
    /**
     * Unspecified tool type.
     */
    ToolType["TOOL_TYPE_UNSPECIFIED"] = "TOOL_TYPE_UNSPECIFIED";
    /**
     * Google search tool, maps to Tool.google_search.search_types.web_search.
     */
    ToolType["GOOGLE_SEARCH_WEB"] = "GOOGLE_SEARCH_WEB";
    /**
     * Image search tool, maps to Tool.google_search.search_types.image_search.
     */
    ToolType["GOOGLE_SEARCH_IMAGE"] = "GOOGLE_SEARCH_IMAGE";
    /**
     * URL context tool, maps to Tool.url_context.
     */
    ToolType["URL_CONTEXT"] = "URL_CONTEXT";
    /**
     * Google maps tool, maps to Tool.google_maps.
     */
    ToolType["GOOGLE_MAPS"] = "GOOGLE_MAPS";
    /**
     * File search tool, maps to Tool.file_search.
     */
    ToolType["FILE_SEARCH"] = "FILE_SEARCH";
})(ToolType || (ToolType = {}));
/** Resource scope. */
var ResourceScope;
(function (ResourceScope) {
    /**
     * When setting base_url, this value configures resource scope to be the collection.
        The resource name will not include api version, project, or location.
        For example, if base_url is set to "https://aiplatform.googleapis.com",
        then the resource name for a Model would be
        "https://aiplatform.googleapis.com/publishers/google/models/gemini-3-pro-preview
     */
    ResourceScope["COLLECTION"] = "COLLECTION";
})(ResourceScope || (ResourceScope = {}));
/** Pricing and performance service tier. */
var ServiceTier;
(function (ServiceTier) {
    /**
     * Default service tier, which is standard.
     */
    ServiceTier["UNSPECIFIED"] = "unspecified";
    /**
     * Flex service tier.
     */
    ServiceTier["FLEX"] = "flex";
    /**
     * Standard service tier.
     */
    ServiceTier["STANDARD"] = "standard";
    /**
     * Priority service tier.
     */
    ServiceTier["PRIORITY"] = "priority";
})(ServiceTier || (ServiceTier = {}));
/** Options for feature selection preference. */
var FeatureSelectionPreference;
(function (FeatureSelectionPreference) {
    FeatureSelectionPreference["FEATURE_SELECTION_PREFERENCE_UNSPECIFIED"] = "FEATURE_SELECTION_PREFERENCE_UNSPECIFIED";
    FeatureSelectionPreference["PRIORITIZE_QUALITY"] = "PRIORITIZE_QUALITY";
    FeatureSelectionPreference["BALANCED"] = "BALANCED";
    FeatureSelectionPreference["PRIORITIZE_COST"] = "PRIORITIZE_COST";
})(FeatureSelectionPreference || (FeatureSelectionPreference = {}));
/** Enum representing the Vertex embedding API to use. */
var EmbeddingApiType;
(function (EmbeddingApiType) {
    /**
     * predict API endpoint (default)
     */
    EmbeddingApiType["PREDICT"] = "PREDICT";
    /**
     * embedContent API Endpoint
     */
    EmbeddingApiType["EMBED_CONTENT"] = "EMBED_CONTENT";
})(EmbeddingApiType || (EmbeddingApiType = {}));
/** Enum that controls the safety filter level for objectionable content. */
var SafetyFilterLevel;
(function (SafetyFilterLevel) {
    SafetyFilterLevel["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    SafetyFilterLevel["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    SafetyFilterLevel["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
    SafetyFilterLevel["BLOCK_NONE"] = "BLOCK_NONE";
})(SafetyFilterLevel || (SafetyFilterLevel = {}));
/** Enum that specifies the language of the text in the prompt. */
var ImagePromptLanguage;
(function (ImagePromptLanguage) {
    /**
     * Auto-detect the language.
     */
    ImagePromptLanguage["auto"] = "auto";
    /**
     * English
     */
    ImagePromptLanguage["en"] = "en";
    /**
     * Japanese
     */
    ImagePromptLanguage["ja"] = "ja";
    /**
     * Korean
     */
    ImagePromptLanguage["ko"] = "ko";
    /**
     * Hindi
     */
    ImagePromptLanguage["hi"] = "hi";
    /**
     * Chinese
     */
    ImagePromptLanguage["zh"] = "zh";
    /**
     * Portuguese
     */
    ImagePromptLanguage["pt"] = "pt";
    /**
     * Spanish
     */
    ImagePromptLanguage["es"] = "es";
})(ImagePromptLanguage || (ImagePromptLanguage = {}));
/** Enum representing the mask mode of a mask reference image. */
var MaskReferenceMode;
(function (MaskReferenceMode) {
    MaskReferenceMode["MASK_MODE_DEFAULT"] = "MASK_MODE_DEFAULT";
    MaskReferenceMode["MASK_MODE_USER_PROVIDED"] = "MASK_MODE_USER_PROVIDED";
    MaskReferenceMode["MASK_MODE_BACKGROUND"] = "MASK_MODE_BACKGROUND";
    MaskReferenceMode["MASK_MODE_FOREGROUND"] = "MASK_MODE_FOREGROUND";
    MaskReferenceMode["MASK_MODE_SEMANTIC"] = "MASK_MODE_SEMANTIC";
})(MaskReferenceMode || (MaskReferenceMode = {}));
/** Enum representing the control type of a control reference image. */
var ControlReferenceType;
(function (ControlReferenceType) {
    ControlReferenceType["CONTROL_TYPE_DEFAULT"] = "CONTROL_TYPE_DEFAULT";
    ControlReferenceType["CONTROL_TYPE_CANNY"] = "CONTROL_TYPE_CANNY";
    ControlReferenceType["CONTROL_TYPE_SCRIBBLE"] = "CONTROL_TYPE_SCRIBBLE";
    ControlReferenceType["CONTROL_TYPE_FACE_MESH"] = "CONTROL_TYPE_FACE_MESH";
})(ControlReferenceType || (ControlReferenceType = {}));
/** Enum representing the subject type of a subject reference image. */
var SubjectReferenceType;
(function (SubjectReferenceType) {
    SubjectReferenceType["SUBJECT_TYPE_DEFAULT"] = "SUBJECT_TYPE_DEFAULT";
    SubjectReferenceType["SUBJECT_TYPE_PERSON"] = "SUBJECT_TYPE_PERSON";
    SubjectReferenceType["SUBJECT_TYPE_ANIMAL"] = "SUBJECT_TYPE_ANIMAL";
    SubjectReferenceType["SUBJECT_TYPE_PRODUCT"] = "SUBJECT_TYPE_PRODUCT";
})(SubjectReferenceType || (SubjectReferenceType = {}));
/** Enum representing the editing mode. */
var EditMode;
(function (EditMode) {
    EditMode["EDIT_MODE_DEFAULT"] = "EDIT_MODE_DEFAULT";
    EditMode["EDIT_MODE_INPAINT_REMOVAL"] = "EDIT_MODE_INPAINT_REMOVAL";
    EditMode["EDIT_MODE_INPAINT_INSERTION"] = "EDIT_MODE_INPAINT_INSERTION";
    EditMode["EDIT_MODE_OUTPAINT"] = "EDIT_MODE_OUTPAINT";
    EditMode["EDIT_MODE_CONTROLLED_EDITING"] = "EDIT_MODE_CONTROLLED_EDITING";
    EditMode["EDIT_MODE_STYLE"] = "EDIT_MODE_STYLE";
    EditMode["EDIT_MODE_BGSWAP"] = "EDIT_MODE_BGSWAP";
    EditMode["EDIT_MODE_PRODUCT_IMAGE"] = "EDIT_MODE_PRODUCT_IMAGE";
})(EditMode || (EditMode = {}));
/** Enum that represents the segmentation mode. */
var SegmentMode;
(function (SegmentMode) {
    SegmentMode["FOREGROUND"] = "FOREGROUND";
    SegmentMode["BACKGROUND"] = "BACKGROUND";
    SegmentMode["PROMPT"] = "PROMPT";
    SegmentMode["SEMANTIC"] = "SEMANTIC";
    SegmentMode["INTERACTIVE"] = "INTERACTIVE";
})(SegmentMode || (SegmentMode = {}));
/** Enum for the reference type of a video generation reference image. */
var VideoGenerationReferenceType;
(function (VideoGenerationReferenceType) {
    /**
     * A reference image that provides assets to the generated video,
        such as the scene, an object, a character, etc.
     */
    VideoGenerationReferenceType["ASSET"] = "ASSET";
    /**
     * A reference image that provides aesthetics including colors,
        lighting, texture, etc., to be used as the style of the generated video,
        such as 'anime', 'photography', 'origami', etc.
     */
    VideoGenerationReferenceType["STYLE"] = "STYLE";
})(VideoGenerationReferenceType || (VideoGenerationReferenceType = {}));
/** Enum for the mask mode of a video generation mask. */
var VideoGenerationMaskMode;
(function (VideoGenerationMaskMode) {
    /**
     * The image mask contains a masked rectangular region which is
        applied on the first frame of the input video. The object described in
        the prompt is inserted into this region and will appear in subsequent
        frames.
     */
    VideoGenerationMaskMode["INSERT"] = "INSERT";
    /**
     * The image mask is used to determine an object in the
        first video frame to track. This object is removed from the video.
     */
    VideoGenerationMaskMode["REMOVE"] = "REMOVE";
    /**
     * The image mask is used to determine a region in the
        video. Objects in this region will be removed.
     */
    VideoGenerationMaskMode["REMOVE_STATIC"] = "REMOVE_STATIC";
    /**
     * The image mask contains a masked rectangular region where
        the input video will go. The remaining area will be generated. Video
        masks are not supported.
     */
    VideoGenerationMaskMode["OUTPAINT"] = "OUTPAINT";
})(VideoGenerationMaskMode || (VideoGenerationMaskMode = {}));
/** Enum that controls the compression quality of the generated videos. */
var VideoCompressionQuality;
(function (VideoCompressionQuality) {
    /**
     * Optimized video compression quality. This will produce videos
        with a compressed, smaller file size.
     */
    VideoCompressionQuality["OPTIMIZED"] = "OPTIMIZED";
    /**
     * Lossless video compression quality. This will produce videos
        with a larger file size.
     */
    VideoCompressionQuality["LOSSLESS"] = "LOSSLESS";
})(VideoCompressionQuality || (VideoCompressionQuality = {}));
/** Enum representing the tuning method. */
var TuningMethod;
(function (TuningMethod) {
    /**
     * Supervised fine tuning.
     */
    TuningMethod["SUPERVISED_FINE_TUNING"] = "SUPERVISED_FINE_TUNING";
    /**
     * Preference optimization tuning.
     */
    TuningMethod["PREFERENCE_TUNING"] = "PREFERENCE_TUNING";
    /**
     * Distillation tuning.
     */
    TuningMethod["DISTILLATION"] = "DISTILLATION";
})(TuningMethod || (TuningMethod = {}));
/** State for the lifecycle of a File. */
var FileState;
(function (FileState) {
    FileState["STATE_UNSPECIFIED"] = "STATE_UNSPECIFIED";
    FileState["PROCESSING"] = "PROCESSING";
    FileState["ACTIVE"] = "ACTIVE";
    FileState["FAILED"] = "FAILED";
})(FileState || (FileState = {}));
/** Source of the File. */
var FileSource;
(function (FileSource) {
    FileSource["SOURCE_UNSPECIFIED"] = "SOURCE_UNSPECIFIED";
    FileSource["UPLOADED"] = "UPLOADED";
    FileSource["GENERATED"] = "GENERATED";
    FileSource["REGISTERED"] = "REGISTERED";
})(FileSource || (FileSource = {}));
/** The reason why the turn is complete. */
var TurnCompleteReason;
(function (TurnCompleteReason) {
    /**
     * Default value. Reason is unspecified.
     */
    TurnCompleteReason["TURN_COMPLETE_REASON_UNSPECIFIED"] = "TURN_COMPLETE_REASON_UNSPECIFIED";
    /**
     * The function call generated by the model is invalid.
     */
    TurnCompleteReason["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
    /**
     * The response is rejected by the model.
     */
    TurnCompleteReason["RESPONSE_REJECTED"] = "RESPONSE_REJECTED";
    /**
     * Needs more input from the user.
     */
    TurnCompleteReason["NEED_MORE_INPUT"] = "NEED_MORE_INPUT";
})(TurnCompleteReason || (TurnCompleteReason = {}));
/** Server content modalities. */
var MediaModality;
(function (MediaModality) {
    /**
     * The modality is unspecified.
     */
    MediaModality["MODALITY_UNSPECIFIED"] = "MODALITY_UNSPECIFIED";
    /**
     * Plain text.
     */
    MediaModality["TEXT"] = "TEXT";
    /**
     * Images.
     */
    MediaModality["IMAGE"] = "IMAGE";
    /**
     * Video.
     */
    MediaModality["VIDEO"] = "VIDEO";
    /**
     * Audio.
     */
    MediaModality["AUDIO"] = "AUDIO";
    /**
     * Document, e.g. PDF.
     */
    MediaModality["DOCUMENT"] = "DOCUMENT";
})(MediaModality || (MediaModality = {}));
/** The type of the VAD signal. */
var VadSignalType;
(function (VadSignalType) {
    /**
     * The default is VAD_SIGNAL_TYPE_UNSPECIFIED.
     */
    VadSignalType["VAD_SIGNAL_TYPE_UNSPECIFIED"] = "VAD_SIGNAL_TYPE_UNSPECIFIED";
    /**
     * Start of sentence signal.
     */
    VadSignalType["VAD_SIGNAL_TYPE_SOS"] = "VAD_SIGNAL_TYPE_SOS";
    /**
     * End of sentence signal.
     */
    VadSignalType["VAD_SIGNAL_TYPE_EOS"] = "VAD_SIGNAL_TYPE_EOS";
})(VadSignalType || (VadSignalType = {}));
/** The type of the voice activity signal. */
var VoiceActivityType;
(function (VoiceActivityType) {
    /**
     * The default is VOICE_ACTIVITY_TYPE_UNSPECIFIED.
     */
    VoiceActivityType["TYPE_UNSPECIFIED"] = "TYPE_UNSPECIFIED";
    /**
     * Start of sentence signal.
     */
    VoiceActivityType["ACTIVITY_START"] = "ACTIVITY_START";
    /**
     * End of sentence signal.
     */
    VoiceActivityType["ACTIVITY_END"] = "ACTIVITY_END";
})(VoiceActivityType || (VoiceActivityType = {}));
/** Start of speech sensitivity. */
var StartSensitivity;
(function (StartSensitivity) {
    /**
     * The default is START_SENSITIVITY_LOW.
     */
    StartSensitivity["START_SENSITIVITY_UNSPECIFIED"] = "START_SENSITIVITY_UNSPECIFIED";
    /**
     * Automatic detection will detect the start of speech more often.
     */
    StartSensitivity["START_SENSITIVITY_HIGH"] = "START_SENSITIVITY_HIGH";
    /**
     * Automatic detection will detect the start of speech less often.
     */
    StartSensitivity["START_SENSITIVITY_LOW"] = "START_SENSITIVITY_LOW";
})(StartSensitivity || (StartSensitivity = {}));
/** End of speech sensitivity. */
var EndSensitivity;
(function (EndSensitivity) {
    /**
     * The default is END_SENSITIVITY_LOW.
     */
    EndSensitivity["END_SENSITIVITY_UNSPECIFIED"] = "END_SENSITIVITY_UNSPECIFIED";
    /**
     * Automatic detection ends speech more often.
     */
    EndSensitivity["END_SENSITIVITY_HIGH"] = "END_SENSITIVITY_HIGH";
    /**
     * Automatic detection ends speech less often.
     */
    EndSensitivity["END_SENSITIVITY_LOW"] = "END_SENSITIVITY_LOW";
})(EndSensitivity || (EndSensitivity = {}));
/** The different ways of handling user activity. */
var ActivityHandling;
(function (ActivityHandling) {
    /**
     * If unspecified, the default behavior is `START_OF_ACTIVITY_INTERRUPTS`.
     */
    ActivityHandling["ACTIVITY_HANDLING_UNSPECIFIED"] = "ACTIVITY_HANDLING_UNSPECIFIED";
    /**
     * If true, start of activity will interrupt the model's response (also called "barge in"). The model's current response will be cut-off in the moment of the interruption. This is the default behavior.
     */
    ActivityHandling["START_OF_ACTIVITY_INTERRUPTS"] = "START_OF_ACTIVITY_INTERRUPTS";
    /**
     * The model's response will not be interrupted.
     */
    ActivityHandling["NO_INTERRUPTION"] = "NO_INTERRUPTION";
})(ActivityHandling || (ActivityHandling = {}));
/** Options about which input is included in the user's turn. */
var TurnCoverage;
(function (TurnCoverage) {
    /**
     * If unspecified, the default behavior is `TURN_INCLUDES_ONLY_ACTIVITY`.
     */
    TurnCoverage["TURN_COVERAGE_UNSPECIFIED"] = "TURN_COVERAGE_UNSPECIFIED";
    /**
     * The users turn only includes activity since the last turn, excluding inactivity (e.g. silence on the audio stream). This is the default behavior.
     */
    TurnCoverage["TURN_INCLUDES_ONLY_ACTIVITY"] = "TURN_INCLUDES_ONLY_ACTIVITY";
    /**
     * The users turn includes all realtime input since the last turn, including inactivity (e.g. silence on the audio stream).
     */
    TurnCoverage["TURN_INCLUDES_ALL_INPUT"] = "TURN_INCLUDES_ALL_INPUT";
    /**
     * Includes audio activity and all video since the last turn. With automatic activity detection, audio activity means speech and excludes silence.
     */
    TurnCoverage["TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO"] = "TURN_INCLUDES_AUDIO_ACTIVITY_AND_ALL_VIDEO";
})(TurnCoverage || (TurnCoverage = {}));
/** Scale of the generated music. */
var Scale;
(function (Scale) {
    /**
     * Default value. This value is unused.
     */
    Scale["SCALE_UNSPECIFIED"] = "SCALE_UNSPECIFIED";
    /**
     * C major or A minor.
     */
    Scale["C_MAJOR_A_MINOR"] = "C_MAJOR_A_MINOR";
    /**
     * Db major or Bb minor.
     */
    Scale["D_FLAT_MAJOR_B_FLAT_MINOR"] = "D_FLAT_MAJOR_B_FLAT_MINOR";
    /**
     * D major or B minor.
     */
    Scale["D_MAJOR_B_MINOR"] = "D_MAJOR_B_MINOR";
    /**
     * Eb major or C minor
     */
    Scale["E_FLAT_MAJOR_C_MINOR"] = "E_FLAT_MAJOR_C_MINOR";
    /**
     * E major or Db minor.
     */
    Scale["E_MAJOR_D_FLAT_MINOR"] = "E_MAJOR_D_FLAT_MINOR";
    /**
     * F major or D minor.
     */
    Scale["F_MAJOR_D_MINOR"] = "F_MAJOR_D_MINOR";
    /**
     * Gb major or Eb minor.
     */
    Scale["G_FLAT_MAJOR_E_FLAT_MINOR"] = "G_FLAT_MAJOR_E_FLAT_MINOR";
    /**
     * G major or E minor.
     */
    Scale["G_MAJOR_E_MINOR"] = "G_MAJOR_E_MINOR";
    /**
     * Ab major or F minor.
     */
    Scale["A_FLAT_MAJOR_F_MINOR"] = "A_FLAT_MAJOR_F_MINOR";
    /**
     * A major or Gb minor.
     */
    Scale["A_MAJOR_G_FLAT_MINOR"] = "A_MAJOR_G_FLAT_MINOR";
    /**
     * Bb major or G minor.
     */
    Scale["B_FLAT_MAJOR_G_MINOR"] = "B_FLAT_MAJOR_G_MINOR";
    /**
     * B major or Ab minor.
     */
    Scale["B_MAJOR_A_FLAT_MINOR"] = "B_MAJOR_A_FLAT_MINOR";
})(Scale || (Scale = {}));
/** The mode of music generation. */
var MusicGenerationMode;
(function (MusicGenerationMode) {
    /**
     * Rely on the server default generation mode.
     */
    MusicGenerationMode["MUSIC_GENERATION_MODE_UNSPECIFIED"] = "MUSIC_GENERATION_MODE_UNSPECIFIED";
    /**
     * Steer text prompts to regions of latent space with higher quality
        music.
     */
    MusicGenerationMode["QUALITY"] = "QUALITY";
    /**
     * Steer text prompts to regions of latent space with a larger
        diversity of music.
     */
    MusicGenerationMode["DIVERSITY"] = "DIVERSITY";
    /**
     * Steer text prompts to regions of latent space more likely to
        generate music with vocals.
     */
    MusicGenerationMode["VOCALIZATION"] = "VOCALIZATION";
})(MusicGenerationMode || (MusicGenerationMode = {}));
/** The playback control signal to apply to the music generation. */
var LiveMusicPlaybackControl;
(function (LiveMusicPlaybackControl) {
    /**
     * This value is unused.
     */
    LiveMusicPlaybackControl["PLAYBACK_CONTROL_UNSPECIFIED"] = "PLAYBACK_CONTROL_UNSPECIFIED";
    /**
     * Start generating the music.
     */
    LiveMusicPlaybackControl["PLAY"] = "PLAY";
    /**
     * Hold the music generation. Use PLAY to resume from the current position.
     */
    LiveMusicPlaybackControl["PAUSE"] = "PAUSE";
    /**
     * Stop the music generation and reset the context (prompts retained).
        Use PLAY to restart the music generation.
     */
    LiveMusicPlaybackControl["STOP"] = "STOP";
    /**
     * Reset the context of the music generation without stopping it.
        Retains the current prompts and config.
     */
    LiveMusicPlaybackControl["RESET_CONTEXT"] = "RESET_CONTEXT";
})(LiveMusicPlaybackControl || (LiveMusicPlaybackControl = {}));

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function tPart(origin) {
    if (origin === null || origin === undefined) {
        throw new Error('PartUnion is required');
    }
    if (typeof origin === 'object') {
        return origin;
    }
    if (typeof origin === 'string') {
        return { text: origin };
    }
    throw new Error(`Unsupported part type: ${typeof origin}`);
}
function tParts(origin) {
    if (origin === null ||
        origin === undefined ||
        (Array.isArray(origin) && origin.length === 0)) {
        throw new Error('PartListUnion is required');
    }
    if (Array.isArray(origin)) {
        return origin.map((item) => tPart(item));
    }
    return [tPart(origin)];
}
function _isContent(origin) {
    return (origin !== null &&
        origin !== undefined &&
        typeof origin === 'object' &&
        'parts' in origin &&
        Array.isArray(origin.parts));
}
function _isFunctionCallPart(origin) {
    return (origin !== null &&
        origin !== undefined &&
        typeof origin === 'object' &&
        'functionCall' in origin);
}
function _isFunctionResponsePart(origin) {
    return (origin !== null &&
        origin !== undefined &&
        typeof origin === 'object' &&
        'functionResponse' in origin);
}
function tContent(origin) {
    if (origin === null || origin === undefined) {
        throw new Error('ContentUnion is required');
    }
    if (_isContent(origin)) {
        // _isContent is a utility function that checks if the
        // origin is a Content.
        return origin;
    }
    return {
        role: 'user',
        parts: tParts(origin),
    };
}
function tContents(origin) {
    if (origin === null ||
        origin === undefined ||
        (Array.isArray(origin) && origin.length === 0)) {
        throw new Error('contents are required');
    }
    if (!Array.isArray(origin)) {
        // If it's not an array, it's a single content or a single PartUnion.
        if (_isFunctionCallPart(origin) || _isFunctionResponsePart(origin)) {
            throw new Error('To specify functionCall or functionResponse parts, please wrap them in a Content object, specifying the role for them');
        }
        return [tContent(origin)];
    }
    const result = [];
    const accumulatedParts = [];
    const isContentArray = _isContent(origin[0]);
    for (const item of origin) {
        const isContent = _isContent(item);
        if (isContent != isContentArray) {
            throw new Error('Mixing Content and Parts is not supported, please group the parts into a the appropriate Content objects and specify the roles for them');
        }
        if (isContent) {
            // `isContent` contains the result of _isContent, which is a utility
            // function that checks if the item is a Content.
            result.push(item);
        }
        else if (_isFunctionCallPart(item) || _isFunctionResponsePart(item)) {
            throw new Error('To specify functionCall or functionResponse parts, please wrap them, and any other parts, in Content objects as appropriate, specifying the role for them');
        }
        else {
            accumulatedParts.push(item);
        }
    }
    if (!isContentArray) {
        result.push({ role: 'user', parts: tParts(accumulatedParts) });
    }
    return result;
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * TypeScript representation of the SentencePiece model protobuf.
 * Translated from sentencepiece_model.proto
 */
var ModelType;
(function (ModelType) {
    ModelType[ModelType["UNIGRAM"] = 1] = "UNIGRAM";
    ModelType[ModelType["BPE"] = 2] = "BPE";
    ModelType[ModelType["WORD"] = 3] = "WORD";
    ModelType[ModelType["CHAR"] = 4] = "CHAR";
})(ModelType || (ModelType = {}));
var SentencePieceType;
(function (SentencePieceType) {
    SentencePieceType[SentencePieceType["NORMAL"] = 1] = "NORMAL";
    SentencePieceType[SentencePieceType["UNKNOWN"] = 2] = "UNKNOWN";
    SentencePieceType[SentencePieceType["CONTROL"] = 3] = "CONTROL";
    SentencePieceType[SentencePieceType["USER_DEFINED"] = 4] = "USER_DEFINED";
    SentencePieceType[SentencePieceType["BYTE"] = 6] = "BYTE";
    SentencePieceType[SentencePieceType["UNUSED"] = 5] = "UNUSED";
})(SentencePieceType || (SentencePieceType = {}));

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function newTrieNode() {
    return {
        children: new Map(),
        final: false,
    };
}
/**
 * PrefixMatcher finds the longest prefix of a string that matches
 * a vocabulary word using a trie data structure.
 */
class PrefixMatcher {
    /**
     * Creates a new PrefixMatcher from a set of vocabulary strings.
     */
    constructor(vocab) {
        this.root = newTrieNode();
        for (const word of vocab) {
            this.add(word);
        }
    }
    /**
     * Finds the longest prefix of text that matches a vocabulary word.
     * Returns the length of the prefix, or 0 if no prefix was found.
     */
    findPrefixLen(text) {
        let node = this.root;
        let maxLen = 0;
        let i = 0;
        for (const char of text) {
            const child = node.children.get(char);
            if (!child) {
                return maxLen;
            }
            if (child.final) {
                maxLen = i + 1;
            }
            node = child;
            i++;
        }
        return maxLen;
    }
    /**
     * Adds a word to the trie.
     */
    add(word) {
        let node = this.root;
        for (const char of word) {
            let child = node.children.get(char);
            if (!child) {
                child = newTrieNode();
                node.children.set(char, child);
            }
            node = child;
        }
        node.final = true;
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Generic priority queue with Insert, PopMax, and RemoveFunc operations.
 * Translated from go-sentencepiece/internal/priorityqueue
 *
 * Uses a binary heap data structure where items[0] is unused,
 * and elements are stored at indices 1...N.
 */
class PriorityQueue {
    /**
     * Creates a new PriorityQueue.
     *
     * @param sizeHint Initial capacity hint for the queue
     * @param cmp Comparison function that returns > 0 if a has higher priority than b,
     *            0 if equal priority, < 0 otherwise
     */
    constructor(sizeHint, cmp) {
        this.cmp = cmp;
        this.items = new Array(Math.max(1, sizeHint + 1));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.items[0] = null;
        this.items.length = 1;
    }
    /**
     * Returns the number of items in the queue.
     */
    len() {
        return this.items.length - 1;
    }
    /**
     * Inserts a new element into the priority queue.
     */
    insert(elem) {
        this.items.push(elem);
        this.siftUp(this.items.length - 1);
    }
    /**
     * Returns and removes the element with the maximal priority.
     * Throws if the queue is empty.
     */
    popMax() {
        if (this.items.length < 2) {
            throw new Error('popping from empty priority queue');
        }
        const maxItem = this.items[1];
        this.items[1] = this.items[this.items.length - 1];
        this.items.pop();
        if (this.items.length > 1) {
            this.siftDown(1);
        }
        return maxItem;
    }
    /**
     * Removes all elements for which the predicate returns true.
     */
    removeFunc(rm) {
        let i = 1;
        while (i < this.items.length && !rm(this.items[i])) {
            i++;
        }
        if (i === this.items.length) {
            return;
        }
        for (let j = i + 1; j < this.items.length; j++) {
            if (!rm(this.items[j])) {
                this.items[i] = this.items[j];
                i++;
            }
        }
        this.items.length = i;
        this.rebuildHeap();
    }
    /**
     * Rebuilds the entire heap from scratch.
     */
    rebuildHeap() {
        for (let i = Math.floor(this.items.length / 2); i >= 1; i--) {
            this.siftDown(i);
        }
    }
    /**
     * Moves an element up the heap until heap property is restored.
     */
    siftUp(n) {
        let i = n;
        while (i > 1) {
            const p = Math.floor(i / 2);
            if (this.cmp(this.items[p], this.items[i]) >= 0) {
                return;
            }
            [this.items[i], this.items[p]] = [this.items[p], this.items[i]];
            i = p;
        }
    }
    /**
     * Moves an element down the heap until heap property is restored.
     */
    siftDown(i) {
        // eslint-disable-next-line
        while (true) {
            const c = 2 * i;
            if (c >= this.items.length) {
                return;
            }
            let maxChild = c;
            if (c + 1 < this.items.length) {
                if (this.cmp(this.items[c + 1], this.items[c]) > 0) {
                    maxChild = c + 1;
                }
            }
            if (this.cmp(this.items[i], this.items[maxChild]) >= 0) {
                return;
            }
            [this.items[i], this.items[maxChild]] = [
                this.items[maxChild],
                this.items[i],
            ];
            i = maxChild;
        }
    }
}

/*eslint-disable block-scoped-var, id-length, no-control-regex,
 * no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var,
 * sort-vars*/


// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer,
      $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots['default'] || ($protobuf.roots['default'] = {});

const sentencepiece = $root.sentencepiece = (() => {
  /**
   * Namespace sentencepiece.
   * @exports sentencepiece
   * @namespace
   */
  const sentencepiece = {};

  sentencepiece.TrainerSpec = (function() {
    /**
     * Properties of a TrainerSpec.
     * @memberof sentencepiece
     * @interface ITrainerSpec
     * @property {Array.<string>|null} [input] TrainerSpec input
     * @property {string|null} [inputFormat] TrainerSpec inputFormat
     * @property {string|null} [modelPrefix] TrainerSpec modelPrefix
     * @property {sentencepiece.TrainerSpec.ModelType|null} [modelType]
     * TrainerSpec modelType
     * @property {number|null} [vocabSize] TrainerSpec vocabSize
     * @property {Array.<string>|null} [acceptLanguage] TrainerSpec
     * acceptLanguage
     * @property {number|null} [selfTestSampleSize] TrainerSpec
     * selfTestSampleSize
     * @property {boolean|null} [enableDifferentialPrivacy] TrainerSpec
     * enableDifferentialPrivacy
     * @property {number|null} [differentialPrivacyNoiseLevel] TrainerSpec
     * differentialPrivacyNoiseLevel
     * @property {number|Long|null} [differentialPrivacyClippingThreshold]
     * TrainerSpec differentialPrivacyClippingThreshold
     * @property {number|null} [characterCoverage] TrainerSpec characterCoverage
     * @property {number|Long|null} [inputSentenceSize] TrainerSpec
     * inputSentenceSize
     * @property {boolean|null} [shuffleInputSentence] TrainerSpec
     * shuffleInputSentence
     * @property {number|null} [miningSentenceSize] TrainerSpec
     * miningSentenceSize
     * @property {number|null} [trainingSentenceSize] TrainerSpec
     * trainingSentenceSize
     * @property {number|null} [seedSentencepieceSize] TrainerSpec
     * seedSentencepieceSize
     * @property {number|null} [shrinkingFactor] TrainerSpec shrinkingFactor
     * @property {number|null} [maxSentenceLength] TrainerSpec maxSentenceLength
     * @property {number|null} [numThreads] TrainerSpec numThreads
     * @property {number|null} [numSubIterations] TrainerSpec numSubIterations
     * @property {number|null} [maxSentencepieceLength] TrainerSpec
     * maxSentencepieceLength
     * @property {boolean|null} [splitByUnicodeScript] TrainerSpec
     * splitByUnicodeScript
     * @property {boolean|null} [splitByNumber] TrainerSpec splitByNumber
     * @property {boolean|null} [splitByWhitespace] TrainerSpec
     * splitByWhitespace
     * @property {boolean|null} [treatWhitespaceAsSuffix] TrainerSpec
     * treatWhitespaceAsSuffix
     * @property {boolean|null} [allowWhitespaceOnlyPieces] TrainerSpec
     * allowWhitespaceOnlyPieces
     * @property {boolean|null} [splitDigits] TrainerSpec splitDigits
     * @property {string|null} [pretokenizationDelimiter] TrainerSpec
     * pretokenizationDelimiter
     * @property {Array.<string>|null} [controlSymbols] TrainerSpec
     * controlSymbols
     * @property {Array.<string>|null} [userDefinedSymbols] TrainerSpec
     * userDefinedSymbols
     * @property {string|null} [requiredChars] TrainerSpec requiredChars
     * @property {boolean|null} [byteFallback] TrainerSpec byteFallback
     * @property {boolean|null} [vocabularyOutputPieceScore] TrainerSpec
     * vocabularyOutputPieceScore
     * @property {boolean|null} [hardVocabLimit] TrainerSpec hardVocabLimit
     * @property {boolean|null} [useAllVocab] TrainerSpec useAllVocab
     * @property {number|null} [unkId] TrainerSpec unkId
     * @property {number|null} [bosId] TrainerSpec bosId
     * @property {number|null} [eosId] TrainerSpec eosId
     * @property {number|null} [padId] TrainerSpec padId
     * @property {string|null} [unkPiece] TrainerSpec unkPiece
     * @property {string|null} [bosPiece] TrainerSpec bosPiece
     * @property {string|null} [eosPiece] TrainerSpec eosPiece
     * @property {string|null} [padPiece] TrainerSpec padPiece
     * @property {string|null} [unkSurface] TrainerSpec unkSurface
     * @property {boolean|null} [trainExtremelyLargeCorpus] TrainerSpec
     * trainExtremelyLargeCorpus
     * @property {string|null} [seedSentencepiecesFile] TrainerSpec
     * seedSentencepiecesFile
     */

    /**
     * Constructs a new TrainerSpec.
     * @memberof sentencepiece
     * @classdesc Represents a TrainerSpec.
     * @implements ITrainerSpec
     * @constructor
     * @param {sentencepiece.ITrainerSpec=} [properties] Properties to set
     */
    function TrainerSpec(properties) {
      this.input = [];
      this.acceptLanguage = [];
      this.controlSymbols = [];
      this.userDefinedSymbols = [];
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * TrainerSpec input.
     * @member {Array.<string>} input
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.input = $util.emptyArray;

    /**
     * TrainerSpec inputFormat.
     * @member {string} inputFormat
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.inputFormat = '';

    /**
     * TrainerSpec modelPrefix.
     * @member {string} modelPrefix
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.modelPrefix = '';

    /**
     * TrainerSpec modelType.
     * @member {sentencepiece.TrainerSpec.ModelType} modelType
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.modelType = 1;

    /**
     * TrainerSpec vocabSize.
     * @member {number} vocabSize
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.vocabSize = 8000;

    /**
     * TrainerSpec acceptLanguage.
     * @member {Array.<string>} acceptLanguage
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.acceptLanguage = $util.emptyArray;

    /**
     * TrainerSpec selfTestSampleSize.
     * @member {number} selfTestSampleSize
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.selfTestSampleSize = 0;

    /**
     * TrainerSpec enableDifferentialPrivacy.
     * @member {boolean} enableDifferentialPrivacy
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.enableDifferentialPrivacy = false;

    /**
     * TrainerSpec differentialPrivacyNoiseLevel.
     * @member {number} differentialPrivacyNoiseLevel
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.differentialPrivacyNoiseLevel = 0;

    /**
     * TrainerSpec differentialPrivacyClippingThreshold.
     * @member {number|Long} differentialPrivacyClippingThreshold
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.differentialPrivacyClippingThreshold =
        $util.Long ? $util.Long.fromBits(0, 0, true) : 0;

    /**
     * TrainerSpec characterCoverage.
     * @member {number} characterCoverage
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.characterCoverage = 0.9995;

    /**
     * TrainerSpec inputSentenceSize.
     * @member {number|Long} inputSentenceSize
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.inputSentenceSize =
        $util.Long ? $util.Long.fromBits(0, 0, true) : 0;

    /**
     * TrainerSpec shuffleInputSentence.
     * @member {boolean} shuffleInputSentence
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.shuffleInputSentence = true;

    /**
     * TrainerSpec miningSentenceSize.
     * @member {number} miningSentenceSize
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.miningSentenceSize = 0;

    /**
     * TrainerSpec trainingSentenceSize.
     * @member {number} trainingSentenceSize
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.trainingSentenceSize = 0;

    /**
     * TrainerSpec seedSentencepieceSize.
     * @member {number} seedSentencepieceSize
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.seedSentencepieceSize = 1000000;

    /**
     * TrainerSpec shrinkingFactor.
     * @member {number} shrinkingFactor
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.shrinkingFactor = 0.75;

    /**
     * TrainerSpec maxSentenceLength.
     * @member {number} maxSentenceLength
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.maxSentenceLength = 4192;

    /**
     * TrainerSpec numThreads.
     * @member {number} numThreads
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.numThreads = 16;

    /**
     * TrainerSpec numSubIterations.
     * @member {number} numSubIterations
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.numSubIterations = 2;

    /**
     * TrainerSpec maxSentencepieceLength.
     * @member {number} maxSentencepieceLength
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.maxSentencepieceLength = 16;

    /**
     * TrainerSpec splitByUnicodeScript.
     * @member {boolean} splitByUnicodeScript
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.splitByUnicodeScript = true;

    /**
     * TrainerSpec splitByNumber.
     * @member {boolean} splitByNumber
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.splitByNumber = true;

    /**
     * TrainerSpec splitByWhitespace.
     * @member {boolean} splitByWhitespace
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.splitByWhitespace = true;

    /**
     * TrainerSpec treatWhitespaceAsSuffix.
     * @member {boolean} treatWhitespaceAsSuffix
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.treatWhitespaceAsSuffix = false;

    /**
     * TrainerSpec allowWhitespaceOnlyPieces.
     * @member {boolean} allowWhitespaceOnlyPieces
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.allowWhitespaceOnlyPieces = false;

    /**
     * TrainerSpec splitDigits.
     * @member {boolean} splitDigits
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.splitDigits = false;

    /**
     * TrainerSpec pretokenizationDelimiter.
     * @member {string} pretokenizationDelimiter
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.pretokenizationDelimiter = '';

    /**
     * TrainerSpec controlSymbols.
     * @member {Array.<string>} controlSymbols
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.controlSymbols = $util.emptyArray;

    /**
     * TrainerSpec userDefinedSymbols.
     * @member {Array.<string>} userDefinedSymbols
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.userDefinedSymbols = $util.emptyArray;

    /**
     * TrainerSpec requiredChars.
     * @member {string} requiredChars
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.requiredChars = '';

    /**
     * TrainerSpec byteFallback.
     * @member {boolean} byteFallback
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.byteFallback = false;

    /**
     * TrainerSpec vocabularyOutputPieceScore.
     * @member {boolean} vocabularyOutputPieceScore
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.vocabularyOutputPieceScore = true;

    /**
     * TrainerSpec hardVocabLimit.
     * @member {boolean} hardVocabLimit
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.hardVocabLimit = true;

    /**
     * TrainerSpec useAllVocab.
     * @member {boolean} useAllVocab
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.useAllVocab = false;

    /**
     * TrainerSpec unkId.
     * @member {number} unkId
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.unkId = 0;

    /**
     * TrainerSpec bosId.
     * @member {number} bosId
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.bosId = 1;

    /**
     * TrainerSpec eosId.
     * @member {number} eosId
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.eosId = 2;

    /**
     * TrainerSpec padId.
     * @member {number} padId
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.padId = -1;

    /**
     * TrainerSpec unkPiece.
     * @member {string} unkPiece
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.unkPiece = '<unk>';

    /**
     * TrainerSpec bosPiece.
     * @member {string} bosPiece
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.bosPiece = '<s>';

    /**
     * TrainerSpec eosPiece.
     * @member {string} eosPiece
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.eosPiece = '</s>';

    /**
     * TrainerSpec padPiece.
     * @member {string} padPiece
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.padPiece = '<pad>';

    /**
     * TrainerSpec unkSurface.
     * @member {string} unkSurface
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.unkSurface = ' E28187 ';

    /**
     * TrainerSpec trainExtremelyLargeCorpus.
     * @member {boolean} trainExtremelyLargeCorpus
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.trainExtremelyLargeCorpus = false;

    /**
     * TrainerSpec seedSentencepiecesFile.
     * @member {string} seedSentencepiecesFile
     * @memberof sentencepiece.TrainerSpec
     * @instance
     */
    TrainerSpec.prototype.seedSentencepiecesFile = '';

    /**
     * Creates a new TrainerSpec instance using the specified properties.
     * @function create
     * @memberof sentencepiece.TrainerSpec
     * @static
     * @param {sentencepiece.ITrainerSpec=} [properties] Properties to set
     * @returns {sentencepiece.TrainerSpec} TrainerSpec instance
     */
    TrainerSpec.create = function create(properties) {
      return new TrainerSpec(properties);
    };

    /**
     * Encodes the specified TrainerSpec message. Does not implicitly {@link
     * sentencepiece.TrainerSpec.verify|verify} messages.
     * @function encode
     * @memberof sentencepiece.TrainerSpec
     * @static
     * @param {sentencepiece.ITrainerSpec} message TrainerSpec message or plain
     *     object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TrainerSpec.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.input != null && message.input.length)
        for (let i = 0; i < message.input.length; ++i)
          writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.input[i]);
      if (message.modelPrefix != null &&
          Object.hasOwnProperty.call(message, 'modelPrefix'))
        writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.modelPrefix);
      if (message.modelType != null &&
          Object.hasOwnProperty.call(message, 'modelType'))
        writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.modelType);
      if (message.vocabSize != null &&
          Object.hasOwnProperty.call(message, 'vocabSize'))
        writer.uint32(/* id 4, wireType 0 =*/ 32).int32(message.vocabSize);
      if (message.acceptLanguage != null && message.acceptLanguage.length)
        for (let i = 0; i < message.acceptLanguage.length; ++i)
          writer.uint32(/* id 5, wireType 2 =*/ 42)
              .string(message.acceptLanguage[i]);
      if (message.selfTestSampleSize != null &&
          Object.hasOwnProperty.call(message, 'selfTestSampleSize'))
        writer.uint32(/* id 6, wireType 0 =*/ 48)
            .int32(message.selfTestSampleSize);
      if (message.inputFormat != null &&
          Object.hasOwnProperty.call(message, 'inputFormat'))
        writer.uint32(/* id 7, wireType 2 =*/ 58).string(message.inputFormat);
      if (message.characterCoverage != null &&
          Object.hasOwnProperty.call(message, 'characterCoverage'))
        writer.uint32(/* id 10, wireType 5 =*/ 85)
            .float(message.characterCoverage);
      if (message.inputSentenceSize != null &&
          Object.hasOwnProperty.call(message, 'inputSentenceSize'))
        writer.uint32(/* id 11, wireType 0 =*/ 88)
            .uint64(message.inputSentenceSize);
      if (message.miningSentenceSize != null &&
          Object.hasOwnProperty.call(message, 'miningSentenceSize'))
        writer.uint32(/* id 12, wireType 0 =*/ 96)
            .int32(message.miningSentenceSize);
      if (message.trainingSentenceSize != null &&
          Object.hasOwnProperty.call(message, 'trainingSentenceSize'))
        writer.uint32(/* id 13, wireType 0 =*/ 104)
            .int32(message.trainingSentenceSize);
      if (message.seedSentencepieceSize != null &&
          Object.hasOwnProperty.call(message, 'seedSentencepieceSize'))
        writer.uint32(/* id 14, wireType 0 =*/ 112)
            .int32(message.seedSentencepieceSize);
      if (message.shrinkingFactor != null &&
          Object.hasOwnProperty.call(message, 'shrinkingFactor'))
        writer.uint32(/* id 15, wireType 5 =*/ 125)
            .float(message.shrinkingFactor);
      if (message.numThreads != null &&
          Object.hasOwnProperty.call(message, 'numThreads'))
        writer.uint32(/* id 16, wireType 0 =*/ 128).int32(message.numThreads);
      if (message.numSubIterations != null &&
          Object.hasOwnProperty.call(message, 'numSubIterations'))
        writer.uint32(/* id 17, wireType 0 =*/ 136)
            .int32(message.numSubIterations);
      if (message.maxSentenceLength != null &&
          Object.hasOwnProperty.call(message, 'maxSentenceLength'))
        writer.uint32(/* id 18, wireType 0 =*/ 144)
            .int32(message.maxSentenceLength);
      if (message.shuffleInputSentence != null &&
          Object.hasOwnProperty.call(message, 'shuffleInputSentence'))
        writer.uint32(/* id 19, wireType 0 =*/ 152)
            .bool(message.shuffleInputSentence);
      if (message.maxSentencepieceLength != null &&
          Object.hasOwnProperty.call(message, 'maxSentencepieceLength'))
        writer.uint32(/* id 20, wireType 0 =*/ 160)
            .int32(message.maxSentencepieceLength);
      if (message.splitByUnicodeScript != null &&
          Object.hasOwnProperty.call(message, 'splitByUnicodeScript'))
        writer.uint32(/* id 21, wireType 0 =*/ 168)
            .bool(message.splitByUnicodeScript);
      if (message.splitByWhitespace != null &&
          Object.hasOwnProperty.call(message, 'splitByWhitespace'))
        writer.uint32(/* id 22, wireType 0 =*/ 176)
            .bool(message.splitByWhitespace);
      if (message.splitByNumber != null &&
          Object.hasOwnProperty.call(message, 'splitByNumber'))
        writer.uint32(/* id 23, wireType 0 =*/ 184).bool(message.splitByNumber);
      if (message.treatWhitespaceAsSuffix != null &&
          Object.hasOwnProperty.call(message, 'treatWhitespaceAsSuffix'))
        writer.uint32(/* id 24, wireType 0 =*/ 192)
            .bool(message.treatWhitespaceAsSuffix);
      if (message.splitDigits != null &&
          Object.hasOwnProperty.call(message, 'splitDigits'))
        writer.uint32(/* id 25, wireType 0 =*/ 200).bool(message.splitDigits);
      if (message.allowWhitespaceOnlyPieces != null &&
          Object.hasOwnProperty.call(message, 'allowWhitespaceOnlyPieces'))
        writer.uint32(/* id 26, wireType 0 =*/ 208)
            .bool(message.allowWhitespaceOnlyPieces);
      if (message.controlSymbols != null && message.controlSymbols.length)
        for (let i = 0; i < message.controlSymbols.length; ++i)
          writer.uint32(/* id 30, wireType 2 =*/ 242)
              .string(message.controlSymbols[i]);
      if (message.userDefinedSymbols != null &&
          message.userDefinedSymbols.length)
        for (let i = 0; i < message.userDefinedSymbols.length; ++i)
          writer.uint32(/* id 31, wireType 2 =*/ 250)
              .string(message.userDefinedSymbols[i]);
      if (message.vocabularyOutputPieceScore != null &&
          Object.hasOwnProperty.call(message, 'vocabularyOutputPieceScore'))
        writer.uint32(/* id 32, wireType 0 =*/ 256)
            .bool(message.vocabularyOutputPieceScore);
      if (message.hardVocabLimit != null &&
          Object.hasOwnProperty.call(message, 'hardVocabLimit'))
        writer.uint32(/* id 33, wireType 0 =*/ 264)
            .bool(message.hardVocabLimit);
      if (message.useAllVocab != null &&
          Object.hasOwnProperty.call(message, 'useAllVocab'))
        writer.uint32(/* id 34, wireType 0 =*/ 272).bool(message.useAllVocab);
      if (message.byteFallback != null &&
          Object.hasOwnProperty.call(message, 'byteFallback'))
        writer.uint32(/* id 35, wireType 0 =*/ 280).bool(message.byteFallback);
      if (message.requiredChars != null &&
          Object.hasOwnProperty.call(message, 'requiredChars'))
        writer.uint32(/* id 36, wireType 2 =*/ 290)
            .string(message.requiredChars);
      if (message.unkId != null && Object.hasOwnProperty.call(message, 'unkId'))
        writer.uint32(/* id 40, wireType 0 =*/ 320).int32(message.unkId);
      if (message.bosId != null && Object.hasOwnProperty.call(message, 'bosId'))
        writer.uint32(/* id 41, wireType 0 =*/ 328).int32(message.bosId);
      if (message.eosId != null && Object.hasOwnProperty.call(message, 'eosId'))
        writer.uint32(/* id 42, wireType 0 =*/ 336).int32(message.eosId);
      if (message.padId != null && Object.hasOwnProperty.call(message, 'padId'))
        writer.uint32(/* id 43, wireType 0 =*/ 344).int32(message.padId);
      if (message.unkSurface != null &&
          Object.hasOwnProperty.call(message, 'unkSurface'))
        writer.uint32(/* id 44, wireType 2 =*/ 354).string(message.unkSurface);
      if (message.unkPiece != null &&
          Object.hasOwnProperty.call(message, 'unkPiece'))
        writer.uint32(/* id 45, wireType 2 =*/ 362).string(message.unkPiece);
      if (message.bosPiece != null &&
          Object.hasOwnProperty.call(message, 'bosPiece'))
        writer.uint32(/* id 46, wireType 2 =*/ 370).string(message.bosPiece);
      if (message.eosPiece != null &&
          Object.hasOwnProperty.call(message, 'eosPiece'))
        writer.uint32(/* id 47, wireType 2 =*/ 378).string(message.eosPiece);
      if (message.padPiece != null &&
          Object.hasOwnProperty.call(message, 'padPiece'))
        writer.uint32(/* id 48, wireType 2 =*/ 386).string(message.padPiece);
      if (message.trainExtremelyLargeCorpus != null &&
          Object.hasOwnProperty.call(message, 'trainExtremelyLargeCorpus'))
        writer.uint32(/* id 49, wireType 0 =*/ 392)
            .bool(message.trainExtremelyLargeCorpus);
      if (message.enableDifferentialPrivacy != null &&
          Object.hasOwnProperty.call(message, 'enableDifferentialPrivacy'))
        writer.uint32(/* id 50, wireType 0 =*/ 400)
            .bool(message.enableDifferentialPrivacy);
      if (message.differentialPrivacyNoiseLevel != null &&
          Object.hasOwnProperty.call(message, 'differentialPrivacyNoiseLevel'))
        writer.uint32(/* id 51, wireType 5 =*/ 413)
            .float(message.differentialPrivacyNoiseLevel);
      if (message.differentialPrivacyClippingThreshold != null &&
          Object.hasOwnProperty.call(
              message, 'differentialPrivacyClippingThreshold'))
        writer.uint32(/* id 52, wireType 0 =*/ 416)
            .uint64(message.differentialPrivacyClippingThreshold);
      if (message.pretokenizationDelimiter != null &&
          Object.hasOwnProperty.call(message, 'pretokenizationDelimiter'))
        writer.uint32(/* id 53, wireType 2 =*/ 426)
            .string(message.pretokenizationDelimiter);
      if (message.seedSentencepiecesFile != null &&
          Object.hasOwnProperty.call(message, 'seedSentencepiecesFile'))
        writer.uint32(/* id 54, wireType 2 =*/ 434)
            .string(message.seedSentencepiecesFile);
      return writer;
    };

    /**
     * Encodes the specified TrainerSpec message, length delimited. Does not
     * implicitly {@link sentencepiece.TrainerSpec.verify|verify} messages.
     * @function encodeDelimited
     * @memberof sentencepiece.TrainerSpec
     * @static
     * @param {sentencepiece.ITrainerSpec} message TrainerSpec message or plain
     *     object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TrainerSpec.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TrainerSpec message from the specified reader or buffer.
     * @function decode
     * @memberof sentencepiece.TrainerSpec
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
     *     from
     * @param {number} [length] Message length if known beforehand
     * @returns {sentencepiece.TrainerSpec} TrainerSpec
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TrainerSpec.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.sentencepiece.TrainerSpec();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            if (!(message.input && message.input.length)) message.input = [];
            message.input.push(reader.string());
            break;
          }
          case 7: {
            message.inputFormat = reader.string();
            break;
          }
          case 2: {
            message.modelPrefix = reader.string();
            break;
          }
          case 3: {
            message.modelType = reader.int32();
            break;
          }
          case 4: {
            message.vocabSize = reader.int32();
            break;
          }
          case 5: {
            if (!(message.acceptLanguage && message.acceptLanguage.length))
              message.acceptLanguage = [];
            message.acceptLanguage.push(reader.string());
            break;
          }
          case 6: {
            message.selfTestSampleSize = reader.int32();
            break;
          }
          case 50: {
            message.enableDifferentialPrivacy = reader.bool();
            break;
          }
          case 51: {
            message.differentialPrivacyNoiseLevel = reader.float();
            break;
          }
          case 52: {
            message.differentialPrivacyClippingThreshold = reader.uint64();
            break;
          }
          case 10: {
            message.characterCoverage = reader.float();
            break;
          }
          case 11: {
            message.inputSentenceSize = reader.uint64();
            break;
          }
          case 19: {
            message.shuffleInputSentence = reader.bool();
            break;
          }
          case 12: {
            message.miningSentenceSize = reader.int32();
            break;
          }
          case 13: {
            message.trainingSentenceSize = reader.int32();
            break;
          }
          case 14: {
            message.seedSentencepieceSize = reader.int32();
            break;
          }
          case 15: {
            message.shrinkingFactor = reader.float();
            break;
          }
          case 18: {
            message.maxSentenceLength = reader.int32();
            break;
          }
          case 16: {
            message.numThreads = reader.int32();
            break;
          }
          case 17: {
            message.numSubIterations = reader.int32();
            break;
          }
          case 20: {
            message.maxSentencepieceLength = reader.int32();
            break;
          }
          case 21: {
            message.splitByUnicodeScript = reader.bool();
            break;
          }
          case 23: {
            message.splitByNumber = reader.bool();
            break;
          }
          case 22: {
            message.splitByWhitespace = reader.bool();
            break;
          }
          case 24: {
            message.treatWhitespaceAsSuffix = reader.bool();
            break;
          }
          case 26: {
            message.allowWhitespaceOnlyPieces = reader.bool();
            break;
          }
          case 25: {
            message.splitDigits = reader.bool();
            break;
          }
          case 53: {
            message.pretokenizationDelimiter = reader.string();
            break;
          }
          case 30: {
            if (!(message.controlSymbols && message.controlSymbols.length))
              message.controlSymbols = [];
            message.controlSymbols.push(reader.string());
            break;
          }
          case 31: {
            if (!(message.userDefinedSymbols &&
                  message.userDefinedSymbols.length))
              message.userDefinedSymbols = [];
            message.userDefinedSymbols.push(reader.string());
            break;
          }
          case 36: {
            message.requiredChars = reader.string();
            break;
          }
          case 35: {
            message.byteFallback = reader.bool();
            break;
          }
          case 32: {
            message.vocabularyOutputPieceScore = reader.bool();
            break;
          }
          case 33: {
            message.hardVocabLimit = reader.bool();
            break;
          }
          case 34: {
            message.useAllVocab = reader.bool();
            break;
          }
          case 40: {
            message.unkId = reader.int32();
            break;
          }
          case 41: {
            message.bosId = reader.int32();
            break;
          }
          case 42: {
            message.eosId = reader.int32();
            break;
          }
          case 43: {
            message.padId = reader.int32();
            break;
          }
          case 45: {
            message.unkPiece = reader.string();
            break;
          }
          case 46: {
            message.bosPiece = reader.string();
            break;
          }
          case 47: {
            message.eosPiece = reader.string();
            break;
          }
          case 48: {
            message.padPiece = reader.string();
            break;
          }
          case 44: {
            message.unkSurface = reader.string();
            break;
          }
          case 49: {
            message.trainExtremelyLargeCorpus = reader.bool();
            break;
          }
          case 54: {
            message.seedSentencepiecesFile = reader.string();
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a TrainerSpec message from the specified reader or buffer, length
     * delimited.
     * @function decodeDelimited
     * @memberof sentencepiece.TrainerSpec
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
     *     from
     * @returns {sentencepiece.TrainerSpec} TrainerSpec
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TrainerSpec.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TrainerSpec message.
     * @function verify
     * @memberof sentencepiece.TrainerSpec
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is
     *     not
     */
    TrainerSpec.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (message.input != null && message.hasOwnProperty('input')) {
        if (!Array.isArray(message.input)) return 'input: array expected';
        for (let i = 0; i < message.input.length; ++i)
          if (!$util.isString(message.input[i]))
            return 'input: string[] expected';
      }
      if (message.inputFormat != null && message.hasOwnProperty('inputFormat'))
        if (!$util.isString(message.inputFormat))
          return 'inputFormat: string expected';
      if (message.modelPrefix != null && message.hasOwnProperty('modelPrefix'))
        if (!$util.isString(message.modelPrefix))
          return 'modelPrefix: string expected';
      if (message.modelType != null && message.hasOwnProperty('modelType'))
        switch (message.modelType) {
          default:
            return 'modelType: enum value expected';
          case 1:
          case 2:
          case 3:
          case 4:
            break;
        }
      if (message.vocabSize != null && message.hasOwnProperty('vocabSize'))
        if (!$util.isInteger(message.vocabSize))
          return 'vocabSize: integer expected';
      if (message.acceptLanguage != null &&
          message.hasOwnProperty('acceptLanguage')) {
        if (!Array.isArray(message.acceptLanguage))
          return 'acceptLanguage: array expected';
        for (let i = 0; i < message.acceptLanguage.length; ++i)
          if (!$util.isString(message.acceptLanguage[i]))
            return 'acceptLanguage: string[] expected';
      }
      if (message.selfTestSampleSize != null &&
          message.hasOwnProperty('selfTestSampleSize'))
        if (!$util.isInteger(message.selfTestSampleSize))
          return 'selfTestSampleSize: integer expected';
      if (message.enableDifferentialPrivacy != null &&
          message.hasOwnProperty('enableDifferentialPrivacy'))
        if (typeof message.enableDifferentialPrivacy !== 'boolean')
          return 'enableDifferentialPrivacy: boolean expected';
      if (message.differentialPrivacyNoiseLevel != null &&
          message.hasOwnProperty('differentialPrivacyNoiseLevel'))
        if (typeof message.differentialPrivacyNoiseLevel !== 'number')
          return 'differentialPrivacyNoiseLevel: number expected';
      if (message.differentialPrivacyClippingThreshold != null &&
          message.hasOwnProperty('differentialPrivacyClippingThreshold'))
        if (!$util.isInteger(message.differentialPrivacyClippingThreshold) &&
            !(message.differentialPrivacyClippingThreshold &&
              $util.isInteger(
                  message.differentialPrivacyClippingThreshold.low) &&
              $util.isInteger(
                  message.differentialPrivacyClippingThreshold.high)))
          return 'differentialPrivacyClippingThreshold: integer|Long expected';
      if (message.characterCoverage != null &&
          message.hasOwnProperty('characterCoverage'))
        if (typeof message.characterCoverage !== 'number')
          return 'characterCoverage: number expected';
      if (message.inputSentenceSize != null &&
          message.hasOwnProperty('inputSentenceSize'))
        if (!$util.isInteger(message.inputSentenceSize) &&
            !(message.inputSentenceSize &&
              $util.isInteger(message.inputSentenceSize.low) &&
              $util.isInteger(message.inputSentenceSize.high)))
          return 'inputSentenceSize: integer|Long expected';
      if (message.shuffleInputSentence != null &&
          message.hasOwnProperty('shuffleInputSentence'))
        if (typeof message.shuffleInputSentence !== 'boolean')
          return 'shuffleInputSentence: boolean expected';
      if (message.miningSentenceSize != null &&
          message.hasOwnProperty('miningSentenceSize'))
        if (!$util.isInteger(message.miningSentenceSize))
          return 'miningSentenceSize: integer expected';
      if (message.trainingSentenceSize != null &&
          message.hasOwnProperty('trainingSentenceSize'))
        if (!$util.isInteger(message.trainingSentenceSize))
          return 'trainingSentenceSize: integer expected';
      if (message.seedSentencepieceSize != null &&
          message.hasOwnProperty('seedSentencepieceSize'))
        if (!$util.isInteger(message.seedSentencepieceSize))
          return 'seedSentencepieceSize: integer expected';
      if (message.shrinkingFactor != null &&
          message.hasOwnProperty('shrinkingFactor'))
        if (typeof message.shrinkingFactor !== 'number')
          return 'shrinkingFactor: number expected';
      if (message.maxSentenceLength != null &&
          message.hasOwnProperty('maxSentenceLength'))
        if (!$util.isInteger(message.maxSentenceLength))
          return 'maxSentenceLength: integer expected';
      if (message.numThreads != null && message.hasOwnProperty('numThreads'))
        if (!$util.isInteger(message.numThreads))
          return 'numThreads: integer expected';
      if (message.numSubIterations != null &&
          message.hasOwnProperty('numSubIterations'))
        if (!$util.isInteger(message.numSubIterations))
          return 'numSubIterations: integer expected';
      if (message.maxSentencepieceLength != null &&
          message.hasOwnProperty('maxSentencepieceLength'))
        if (!$util.isInteger(message.maxSentencepieceLength))
          return 'maxSentencepieceLength: integer expected';
      if (message.splitByUnicodeScript != null &&
          message.hasOwnProperty('splitByUnicodeScript'))
        if (typeof message.splitByUnicodeScript !== 'boolean')
          return 'splitByUnicodeScript: boolean expected';
      if (message.splitByNumber != null &&
          message.hasOwnProperty('splitByNumber'))
        if (typeof message.splitByNumber !== 'boolean')
          return 'splitByNumber: boolean expected';
      if (message.splitByWhitespace != null &&
          message.hasOwnProperty('splitByWhitespace'))
        if (typeof message.splitByWhitespace !== 'boolean')
          return 'splitByWhitespace: boolean expected';
      if (message.treatWhitespaceAsSuffix != null &&
          message.hasOwnProperty('treatWhitespaceAsSuffix'))
        if (typeof message.treatWhitespaceAsSuffix !== 'boolean')
          return 'treatWhitespaceAsSuffix: boolean expected';
      if (message.allowWhitespaceOnlyPieces != null &&
          message.hasOwnProperty('allowWhitespaceOnlyPieces'))
        if (typeof message.allowWhitespaceOnlyPieces !== 'boolean')
          return 'allowWhitespaceOnlyPieces: boolean expected';
      if (message.splitDigits != null && message.hasOwnProperty('splitDigits'))
        if (typeof message.splitDigits !== 'boolean')
          return 'splitDigits: boolean expected';
      if (message.pretokenizationDelimiter != null &&
          message.hasOwnProperty('pretokenizationDelimiter'))
        if (!$util.isString(message.pretokenizationDelimiter))
          return 'pretokenizationDelimiter: string expected';
      if (message.controlSymbols != null &&
          message.hasOwnProperty('controlSymbols')) {
        if (!Array.isArray(message.controlSymbols))
          return 'controlSymbols: array expected';
        for (let i = 0; i < message.controlSymbols.length; ++i)
          if (!$util.isString(message.controlSymbols[i]))
            return 'controlSymbols: string[] expected';
      }
      if (message.userDefinedSymbols != null &&
          message.hasOwnProperty('userDefinedSymbols')) {
        if (!Array.isArray(message.userDefinedSymbols))
          return 'userDefinedSymbols: array expected';
        for (let i = 0; i < message.userDefinedSymbols.length; ++i)
          if (!$util.isString(message.userDefinedSymbols[i]))
            return 'userDefinedSymbols: string[] expected';
      }
      if (message.requiredChars != null &&
          message.hasOwnProperty('requiredChars'))
        if (!$util.isString(message.requiredChars))
          return 'requiredChars: string expected';
      if (message.byteFallback != null &&
          message.hasOwnProperty('byteFallback'))
        if (typeof message.byteFallback !== 'boolean')
          return 'byteFallback: boolean expected';
      if (message.vocabularyOutputPieceScore != null &&
          message.hasOwnProperty('vocabularyOutputPieceScore'))
        if (typeof message.vocabularyOutputPieceScore !== 'boolean')
          return 'vocabularyOutputPieceScore: boolean expected';
      if (message.hardVocabLimit != null &&
          message.hasOwnProperty('hardVocabLimit'))
        if (typeof message.hardVocabLimit !== 'boolean')
          return 'hardVocabLimit: boolean expected';
      if (message.useAllVocab != null && message.hasOwnProperty('useAllVocab'))
        if (typeof message.useAllVocab !== 'boolean')
          return 'useAllVocab: boolean expected';
      if (message.unkId != null && message.hasOwnProperty('unkId'))
        if (!$util.isInteger(message.unkId)) return 'unkId: integer expected';
      if (message.bosId != null && message.hasOwnProperty('bosId'))
        if (!$util.isInteger(message.bosId)) return 'bosId: integer expected';
      if (message.eosId != null && message.hasOwnProperty('eosId'))
        if (!$util.isInteger(message.eosId)) return 'eosId: integer expected';
      if (message.padId != null && message.hasOwnProperty('padId'))
        if (!$util.isInteger(message.padId)) return 'padId: integer expected';
      if (message.unkPiece != null && message.hasOwnProperty('unkPiece'))
        if (!$util.isString(message.unkPiece))
          return 'unkPiece: string expected';
      if (message.bosPiece != null && message.hasOwnProperty('bosPiece'))
        if (!$util.isString(message.bosPiece))
          return 'bosPiece: string expected';
      if (message.eosPiece != null && message.hasOwnProperty('eosPiece'))
        if (!$util.isString(message.eosPiece))
          return 'eosPiece: string expected';
      if (message.padPiece != null && message.hasOwnProperty('padPiece'))
        if (!$util.isString(message.padPiece))
          return 'padPiece: string expected';
      if (message.unkSurface != null && message.hasOwnProperty('unkSurface'))
        if (!$util.isString(message.unkSurface))
          return 'unkSurface: string expected';
      if (message.trainExtremelyLargeCorpus != null &&
          message.hasOwnProperty('trainExtremelyLargeCorpus'))
        if (typeof message.trainExtremelyLargeCorpus !== 'boolean')
          return 'trainExtremelyLargeCorpus: boolean expected';
      if (message.seedSentencepiecesFile != null &&
          message.hasOwnProperty('seedSentencepiecesFile'))
        if (!$util.isString(message.seedSentencepiecesFile))
          return 'seedSentencepiecesFile: string expected';
      return null;
    };

    /**
     * Creates a TrainerSpec message from a plain object. Also converts values
     * to their respective internal types.
     * @function fromObject
     * @memberof sentencepiece.TrainerSpec
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {sentencepiece.TrainerSpec} TrainerSpec
     */
    TrainerSpec.fromObject = function fromObject(object) {
      if (object instanceof $root.sentencepiece.TrainerSpec) return object;
      let message = new $root.sentencepiece.TrainerSpec();
      if (object.input) {
        if (!Array.isArray(object.input))
          throw TypeError('.sentencepiece.TrainerSpec.input: array expected');
        message.input = [];
        for (let i = 0; i < object.input.length; ++i)
          message.input[i] = String(object.input[i]);
      }
      if (object.inputFormat != null)
        message.inputFormat = String(object.inputFormat);
      if (object.modelPrefix != null)
        message.modelPrefix = String(object.modelPrefix);
      switch (object.modelType) {
        default:
          if (typeof object.modelType === 'number') {
            message.modelType = object.modelType;
            break;
          }
          break;
        case 'UNIGRAM':
        case 1:
          message.modelType = 1;
          break;
        case 'BPE':
        case 2:
          message.modelType = 2;
          break;
        case 'WORD':
        case 3:
          message.modelType = 3;
          break;
        case 'CHAR':
        case 4:
          message.modelType = 4;
          break;
      }
      if (object.vocabSize != null) message.vocabSize = object.vocabSize | 0;
      if (object.acceptLanguage) {
        if (!Array.isArray(object.acceptLanguage))
          throw TypeError(
              '.sentencepiece.TrainerSpec.acceptLanguage: array expected');
        message.acceptLanguage = [];
        for (let i = 0; i < object.acceptLanguage.length; ++i)
          message.acceptLanguage[i] = String(object.acceptLanguage[i]);
      }
      if (object.selfTestSampleSize != null)
        message.selfTestSampleSize = object.selfTestSampleSize | 0;
      if (object.enableDifferentialPrivacy != null)
        message.enableDifferentialPrivacy =
            Boolean(object.enableDifferentialPrivacy);
      if (object.differentialPrivacyNoiseLevel != null)
        message.differentialPrivacyNoiseLevel =
            Number(object.differentialPrivacyNoiseLevel);
      if (object.differentialPrivacyClippingThreshold != null)
        if ($util.Long)
          (message.differentialPrivacyClippingThreshold = $util.Long.fromValue(
               object.differentialPrivacyClippingThreshold))
              .unsigned = true;
        else if (
            typeof object.differentialPrivacyClippingThreshold === 'string')
          message.differentialPrivacyClippingThreshold =
              parseInt(object.differentialPrivacyClippingThreshold, 10);
        else if (
            typeof object.differentialPrivacyClippingThreshold === 'number')
          message.differentialPrivacyClippingThreshold =
              object.differentialPrivacyClippingThreshold;
        else if (
            typeof object.differentialPrivacyClippingThreshold === 'object')
          message.differentialPrivacyClippingThreshold =
              new $util
                  .LongBits(
                      object.differentialPrivacyClippingThreshold.low >>> 0,
                      object.differentialPrivacyClippingThreshold.high >>> 0)
                  .toNumber(true);
      if (object.characterCoverage != null)
        message.characterCoverage = Number(object.characterCoverage);
      if (object.inputSentenceSize != null)
        if ($util.Long)
          (message.inputSentenceSize =
               $util.Long.fromValue(object.inputSentenceSize))
              .unsigned = true;
        else if (typeof object.inputSentenceSize === 'string')
          message.inputSentenceSize = parseInt(object.inputSentenceSize, 10);
        else if (typeof object.inputSentenceSize === 'number')
          message.inputSentenceSize = object.inputSentenceSize;
        else if (typeof object.inputSentenceSize === 'object')
          message.inputSentenceSize =
              new $util
                  .LongBits(
                      object.inputSentenceSize.low >>> 0,
                      object.inputSentenceSize.high >>> 0)
                  .toNumber(true);
      if (object.shuffleInputSentence != null)
        message.shuffleInputSentence = Boolean(object.shuffleInputSentence);
      if (object.miningSentenceSize != null)
        message.miningSentenceSize = object.miningSentenceSize | 0;
      if (object.trainingSentenceSize != null)
        message.trainingSentenceSize = object.trainingSentenceSize | 0;
      if (object.seedSentencepieceSize != null)
        message.seedSentencepieceSize = object.seedSentencepieceSize | 0;
      if (object.shrinkingFactor != null)
        message.shrinkingFactor = Number(object.shrinkingFactor);
      if (object.maxSentenceLength != null)
        message.maxSentenceLength = object.maxSentenceLength | 0;
      if (object.numThreads != null) message.numThreads = object.numThreads | 0;
      if (object.numSubIterations != null)
        message.numSubIterations = object.numSubIterations | 0;
      if (object.maxSentencepieceLength != null)
        message.maxSentencepieceLength = object.maxSentencepieceLength | 0;
      if (object.splitByUnicodeScript != null)
        message.splitByUnicodeScript = Boolean(object.splitByUnicodeScript);
      if (object.splitByNumber != null)
        message.splitByNumber = Boolean(object.splitByNumber);
      if (object.splitByWhitespace != null)
        message.splitByWhitespace = Boolean(object.splitByWhitespace);
      if (object.treatWhitespaceAsSuffix != null)
        message.treatWhitespaceAsSuffix =
            Boolean(object.treatWhitespaceAsSuffix);
      if (object.allowWhitespaceOnlyPieces != null)
        message.allowWhitespaceOnlyPieces =
            Boolean(object.allowWhitespaceOnlyPieces);
      if (object.splitDigits != null)
        message.splitDigits = Boolean(object.splitDigits);
      if (object.pretokenizationDelimiter != null)
        message.pretokenizationDelimiter =
            String(object.pretokenizationDelimiter);
      if (object.controlSymbols) {
        if (!Array.isArray(object.controlSymbols))
          throw TypeError(
              '.sentencepiece.TrainerSpec.controlSymbols: array expected');
        message.controlSymbols = [];
        for (let i = 0; i < object.controlSymbols.length; ++i)
          message.controlSymbols[i] = String(object.controlSymbols[i]);
      }
      if (object.userDefinedSymbols) {
        if (!Array.isArray(object.userDefinedSymbols))
          throw TypeError(
              '.sentencepiece.TrainerSpec.userDefinedSymbols: array expected');
        message.userDefinedSymbols = [];
        for (let i = 0; i < object.userDefinedSymbols.length; ++i)
          message.userDefinedSymbols[i] = String(object.userDefinedSymbols[i]);
      }
      if (object.requiredChars != null)
        message.requiredChars = String(object.requiredChars);
      if (object.byteFallback != null)
        message.byteFallback = Boolean(object.byteFallback);
      if (object.vocabularyOutputPieceScore != null)
        message.vocabularyOutputPieceScore =
            Boolean(object.vocabularyOutputPieceScore);
      if (object.hardVocabLimit != null)
        message.hardVocabLimit = Boolean(object.hardVocabLimit);
      if (object.useAllVocab != null)
        message.useAllVocab = Boolean(object.useAllVocab);
      if (object.unkId != null) message.unkId = object.unkId | 0;
      if (object.bosId != null) message.bosId = object.bosId | 0;
      if (object.eosId != null) message.eosId = object.eosId | 0;
      if (object.padId != null) message.padId = object.padId | 0;
      if (object.unkPiece != null) message.unkPiece = String(object.unkPiece);
      if (object.bosPiece != null) message.bosPiece = String(object.bosPiece);
      if (object.eosPiece != null) message.eosPiece = String(object.eosPiece);
      if (object.padPiece != null) message.padPiece = String(object.padPiece);
      if (object.unkSurface != null)
        message.unkSurface = String(object.unkSurface);
      if (object.trainExtremelyLargeCorpus != null)
        message.trainExtremelyLargeCorpus =
            Boolean(object.trainExtremelyLargeCorpus);
      if (object.seedSentencepiecesFile != null)
        message.seedSentencepiecesFile = String(object.seedSentencepiecesFile);
      return message;
    };

    /**
     * Creates a plain object from a TrainerSpec message. Also converts values
     * to other types if specified.
     * @function toObject
     * @memberof sentencepiece.TrainerSpec
     * @static
     * @param {sentencepiece.TrainerSpec} message TrainerSpec
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TrainerSpec.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.arrays || options.defaults) {
        object.input = [];
        object.acceptLanguage = [];
        object.controlSymbols = [];
        object.userDefinedSymbols = [];
      }
      if (options.defaults) {
        object.modelPrefix = '';
        object.modelType = options.enums === String ? 'UNIGRAM' : 1;
        object.vocabSize = 8000;
        object.selfTestSampleSize = 0;
        object.inputFormat = '';
        object.characterCoverage = 0.9995;
        if ($util.Long) {
          let long = new $util.Long(0, 0, true);
          object.inputSentenceSize = options.longs === String ?
              long.toString() :
              options.longs === Number ? long.toNumber() :
                                         long;
        } else
          object.inputSentenceSize = options.longs === String ? '0' : 0;
        object.miningSentenceSize = 0;
        object.trainingSentenceSize = 0;
        object.seedSentencepieceSize = 1000000;
        object.shrinkingFactor = 0.75;
        object.numThreads = 16;
        object.numSubIterations = 2;
        object.maxSentenceLength = 4192;
        object.shuffleInputSentence = true;
        object.maxSentencepieceLength = 16;
        object.splitByUnicodeScript = true;
        object.splitByWhitespace = true;
        object.splitByNumber = true;
        object.treatWhitespaceAsSuffix = false;
        object.splitDigits = false;
        object.allowWhitespaceOnlyPieces = false;
        object.vocabularyOutputPieceScore = true;
        object.hardVocabLimit = true;
        object.useAllVocab = false;
        object.byteFallback = false;
        object.requiredChars = '';
        object.unkId = 0;
        object.bosId = 1;
        object.eosId = 2;
        object.padId = -1;
        object.unkSurface = ' E28187 ';
        object.unkPiece = '<unk>';
        object.bosPiece = '<s>';
        object.eosPiece = '</s>';
        object.padPiece = '<pad>';
        object.trainExtremelyLargeCorpus = false;
        object.enableDifferentialPrivacy = false;
        object.differentialPrivacyNoiseLevel = 0;
        if ($util.Long) {
          let long = new $util.Long(0, 0, true);
          object.differentialPrivacyClippingThreshold =
              options.longs === String ? long.toString() :
              options.longs === Number ? long.toNumber() :
                                         long;
        } else
          object.differentialPrivacyClippingThreshold =
              options.longs === String ? '0' : 0;
        object.pretokenizationDelimiter = '';
        object.seedSentencepiecesFile = '';
      }
      if (message.input && message.input.length) {
        object.input = [];
        for (let j = 0; j < message.input.length; ++j)
          object.input[j] = message.input[j];
      }
      if (message.modelPrefix != null && message.hasOwnProperty('modelPrefix'))
        object.modelPrefix = message.modelPrefix;
      if (message.modelType != null && message.hasOwnProperty('modelType'))
        object.modelType = options.enums === String ?
            $root.sentencepiece.TrainerSpec.ModelType[message.modelType] ===
                    undefined ?
            message.modelType :
            $root.sentencepiece.TrainerSpec.ModelType[message.modelType] :
            message.modelType;
      if (message.vocabSize != null && message.hasOwnProperty('vocabSize'))
        object.vocabSize = message.vocabSize;
      if (message.acceptLanguage && message.acceptLanguage.length) {
        object.acceptLanguage = [];
        for (let j = 0; j < message.acceptLanguage.length; ++j)
          object.acceptLanguage[j] = message.acceptLanguage[j];
      }
      if (message.selfTestSampleSize != null &&
          message.hasOwnProperty('selfTestSampleSize'))
        object.selfTestSampleSize = message.selfTestSampleSize;
      if (message.inputFormat != null && message.hasOwnProperty('inputFormat'))
        object.inputFormat = message.inputFormat;
      if (message.characterCoverage != null &&
          message.hasOwnProperty('characterCoverage'))
        object.characterCoverage =
            options.json && !isFinite(message.characterCoverage) ?
            String(message.characterCoverage) :
            message.characterCoverage;
      if (message.inputSentenceSize != null &&
          message.hasOwnProperty('inputSentenceSize'))
        if (typeof message.inputSentenceSize === 'number')
          object.inputSentenceSize = options.longs === String ?
              String(message.inputSentenceSize) :
              message.inputSentenceSize;
        else
          object.inputSentenceSize = options.longs === String ?
              $util.Long.prototype.toString.call(message.inputSentenceSize) :
              options.longs === Number ?
              new $util
                  .LongBits(
                      message.inputSentenceSize.low >>> 0,
                      message.inputSentenceSize.high >>> 0)
                  .toNumber(true) :
              message.inputSentenceSize;
      if (message.miningSentenceSize != null &&
          message.hasOwnProperty('miningSentenceSize'))
        object.miningSentenceSize = message.miningSentenceSize;
      if (message.trainingSentenceSize != null &&
          message.hasOwnProperty('trainingSentenceSize'))
        object.trainingSentenceSize = message.trainingSentenceSize;
      if (message.seedSentencepieceSize != null &&
          message.hasOwnProperty('seedSentencepieceSize'))
        object.seedSentencepieceSize = message.seedSentencepieceSize;
      if (message.shrinkingFactor != null &&
          message.hasOwnProperty('shrinkingFactor'))
        object.shrinkingFactor =
            options.json && !isFinite(message.shrinkingFactor) ?
            String(message.shrinkingFactor) :
            message.shrinkingFactor;
      if (message.numThreads != null && message.hasOwnProperty('numThreads'))
        object.numThreads = message.numThreads;
      if (message.numSubIterations != null &&
          message.hasOwnProperty('numSubIterations'))
        object.numSubIterations = message.numSubIterations;
      if (message.maxSentenceLength != null &&
          message.hasOwnProperty('maxSentenceLength'))
        object.maxSentenceLength = message.maxSentenceLength;
      if (message.shuffleInputSentence != null &&
          message.hasOwnProperty('shuffleInputSentence'))
        object.shuffleInputSentence = message.shuffleInputSentence;
      if (message.maxSentencepieceLength != null &&
          message.hasOwnProperty('maxSentencepieceLength'))
        object.maxSentencepieceLength = message.maxSentencepieceLength;
      if (message.splitByUnicodeScript != null &&
          message.hasOwnProperty('splitByUnicodeScript'))
        object.splitByUnicodeScript = message.splitByUnicodeScript;
      if (message.splitByWhitespace != null &&
          message.hasOwnProperty('splitByWhitespace'))
        object.splitByWhitespace = message.splitByWhitespace;
      if (message.splitByNumber != null &&
          message.hasOwnProperty('splitByNumber'))
        object.splitByNumber = message.splitByNumber;
      if (message.treatWhitespaceAsSuffix != null &&
          message.hasOwnProperty('treatWhitespaceAsSuffix'))
        object.treatWhitespaceAsSuffix = message.treatWhitespaceAsSuffix;
      if (message.splitDigits != null && message.hasOwnProperty('splitDigits'))
        object.splitDigits = message.splitDigits;
      if (message.allowWhitespaceOnlyPieces != null &&
          message.hasOwnProperty('allowWhitespaceOnlyPieces'))
        object.allowWhitespaceOnlyPieces = message.allowWhitespaceOnlyPieces;
      if (message.controlSymbols && message.controlSymbols.length) {
        object.controlSymbols = [];
        for (let j = 0; j < message.controlSymbols.length; ++j)
          object.controlSymbols[j] = message.controlSymbols[j];
      }
      if (message.userDefinedSymbols && message.userDefinedSymbols.length) {
        object.userDefinedSymbols = [];
        for (let j = 0; j < message.userDefinedSymbols.length; ++j)
          object.userDefinedSymbols[j] = message.userDefinedSymbols[j];
      }
      if (message.vocabularyOutputPieceScore != null &&
          message.hasOwnProperty('vocabularyOutputPieceScore'))
        object.vocabularyOutputPieceScore = message.vocabularyOutputPieceScore;
      if (message.hardVocabLimit != null &&
          message.hasOwnProperty('hardVocabLimit'))
        object.hardVocabLimit = message.hardVocabLimit;
      if (message.useAllVocab != null && message.hasOwnProperty('useAllVocab'))
        object.useAllVocab = message.useAllVocab;
      if (message.byteFallback != null &&
          message.hasOwnProperty('byteFallback'))
        object.byteFallback = message.byteFallback;
      if (message.requiredChars != null &&
          message.hasOwnProperty('requiredChars'))
        object.requiredChars = message.requiredChars;
      if (message.unkId != null && message.hasOwnProperty('unkId'))
        object.unkId = message.unkId;
      if (message.bosId != null && message.hasOwnProperty('bosId'))
        object.bosId = message.bosId;
      if (message.eosId != null && message.hasOwnProperty('eosId'))
        object.eosId = message.eosId;
      if (message.padId != null && message.hasOwnProperty('padId'))
        object.padId = message.padId;
      if (message.unkSurface != null && message.hasOwnProperty('unkSurface'))
        object.unkSurface = message.unkSurface;
      if (message.unkPiece != null && message.hasOwnProperty('unkPiece'))
        object.unkPiece = message.unkPiece;
      if (message.bosPiece != null && message.hasOwnProperty('bosPiece'))
        object.bosPiece = message.bosPiece;
      if (message.eosPiece != null && message.hasOwnProperty('eosPiece'))
        object.eosPiece = message.eosPiece;
      if (message.padPiece != null && message.hasOwnProperty('padPiece'))
        object.padPiece = message.padPiece;
      if (message.trainExtremelyLargeCorpus != null &&
          message.hasOwnProperty('trainExtremelyLargeCorpus'))
        object.trainExtremelyLargeCorpus = message.trainExtremelyLargeCorpus;
      if (message.enableDifferentialPrivacy != null &&
          message.hasOwnProperty('enableDifferentialPrivacy'))
        object.enableDifferentialPrivacy = message.enableDifferentialPrivacy;
      if (message.differentialPrivacyNoiseLevel != null &&
          message.hasOwnProperty('differentialPrivacyNoiseLevel'))
        object.differentialPrivacyNoiseLevel =
            options.json && !isFinite(message.differentialPrivacyNoiseLevel) ?
            String(message.differentialPrivacyNoiseLevel) :
            message.differentialPrivacyNoiseLevel;
      if (message.differentialPrivacyClippingThreshold != null &&
          message.hasOwnProperty('differentialPrivacyClippingThreshold'))
        if (typeof message.differentialPrivacyClippingThreshold === 'number')
          object.differentialPrivacyClippingThreshold =
              options.longs === String ?
              String(message.differentialPrivacyClippingThreshold) :
              message.differentialPrivacyClippingThreshold;
        else
          object.differentialPrivacyClippingThreshold =
              options.longs === String ?
              $util.Long.prototype.toString.call(
                  message.differentialPrivacyClippingThreshold) :
              options.longs === Number ?
              new $util
                  .LongBits(
                      message.differentialPrivacyClippingThreshold.low >>> 0,
                      message.differentialPrivacyClippingThreshold.high >>> 0)
                  .toNumber(true) :
              message.differentialPrivacyClippingThreshold;
      if (message.pretokenizationDelimiter != null &&
          message.hasOwnProperty('pretokenizationDelimiter'))
        object.pretokenizationDelimiter = message.pretokenizationDelimiter;
      if (message.seedSentencepiecesFile != null &&
          message.hasOwnProperty('seedSentencepiecesFile'))
        object.seedSentencepiecesFile = message.seedSentencepiecesFile;
      return object;
    };

    /**
     * Converts this TrainerSpec to JSON.
     * @function toJSON
     * @memberof sentencepiece.TrainerSpec
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TrainerSpec.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for TrainerSpec
     * @function getTypeUrl
     * @memberof sentencepiece.TrainerSpec
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default
     *     "type.googleapis.com")
     * @returns {string} The default type url
     */
    TrainerSpec.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/sentencepiece.TrainerSpec';
    };

    /**
     * ModelType enum.
     * @name sentencepiece.TrainerSpec.ModelType
     * @enum {number}
     * @property {number} UNIGRAM=1 UNIGRAM value
     * @property {number} BPE=2 BPE value
     * @property {number} WORD=3 WORD value
     * @property {number} CHAR=4 CHAR value
     */
    TrainerSpec.ModelType = (function() {
      const valuesById = {}, values = Object.create(valuesById);
      values[valuesById[1] = 'UNIGRAM'] = 1;
      values[valuesById[2] = 'BPE'] = 2;
      values[valuesById[3] = 'WORD'] = 3;
      values[valuesById[4] = 'CHAR'] = 4;
      return values;
    })();

    return TrainerSpec;
  })();

  sentencepiece.NormalizerSpec = (function() {
    /**
     * Properties of a NormalizerSpec.
     * @memberof sentencepiece
     * @interface INormalizerSpec
     * @property {string|null} [name] NormalizerSpec name
     * @property {Uint8Array|null} [precompiledCharsmap] NormalizerSpec
     * precompiledCharsmap
     * @property {boolean|null} [addDummyPrefix] NormalizerSpec addDummyPrefix
     * @property {boolean|null} [removeExtraWhitespaces] NormalizerSpec
     * removeExtraWhitespaces
     * @property {boolean|null} [escapeWhitespaces] NormalizerSpec
     * escapeWhitespaces
     * @property {string|null} [normalizationRuleTsv] NormalizerSpec
     * normalizationRuleTsv
     */

    /**
     * Constructs a new NormalizerSpec.
     * @memberof sentencepiece
     * @classdesc Represents a NormalizerSpec.
     * @implements INormalizerSpec
     * @constructor
     * @param {sentencepiece.INormalizerSpec=} [properties] Properties to set
     */
    function NormalizerSpec(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * NormalizerSpec name.
     * @member {string} name
     * @memberof sentencepiece.NormalizerSpec
     * @instance
     */
    NormalizerSpec.prototype.name = '';

    /**
     * NormalizerSpec precompiledCharsmap.
     * @member {Uint8Array} precompiledCharsmap
     * @memberof sentencepiece.NormalizerSpec
     * @instance
     */
    NormalizerSpec.prototype.precompiledCharsmap = $util.newBuffer([]);

    /**
     * NormalizerSpec addDummyPrefix.
     * @member {boolean} addDummyPrefix
     * @memberof sentencepiece.NormalizerSpec
     * @instance
     */
    NormalizerSpec.prototype.addDummyPrefix = true;

    /**
     * NormalizerSpec removeExtraWhitespaces.
     * @member {boolean} removeExtraWhitespaces
     * @memberof sentencepiece.NormalizerSpec
     * @instance
     */
    NormalizerSpec.prototype.removeExtraWhitespaces = true;

    /**
     * NormalizerSpec escapeWhitespaces.
     * @member {boolean} escapeWhitespaces
     * @memberof sentencepiece.NormalizerSpec
     * @instance
     */
    NormalizerSpec.prototype.escapeWhitespaces = true;

    /**
     * NormalizerSpec normalizationRuleTsv.
     * @member {string} normalizationRuleTsv
     * @memberof sentencepiece.NormalizerSpec
     * @instance
     */
    NormalizerSpec.prototype.normalizationRuleTsv = '';

    /**
     * Creates a new NormalizerSpec instance using the specified properties.
     * @function create
     * @memberof sentencepiece.NormalizerSpec
     * @static
     * @param {sentencepiece.INormalizerSpec=} [properties] Properties to set
     * @returns {sentencepiece.NormalizerSpec} NormalizerSpec instance
     */
    NormalizerSpec.create = function create(properties) {
      return new NormalizerSpec(properties);
    };

    /**
     * Encodes the specified NormalizerSpec message. Does not implicitly {@link
     * sentencepiece.NormalizerSpec.verify|verify} messages.
     * @function encode
     * @memberof sentencepiece.NormalizerSpec
     * @static
     * @param {sentencepiece.INormalizerSpec} message NormalizerSpec message or
     *     plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NormalizerSpec.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.name != null && Object.hasOwnProperty.call(message, 'name'))
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.name);
      if (message.precompiledCharsmap != null &&
          Object.hasOwnProperty.call(message, 'precompiledCharsmap'))
        writer.uint32(/* id 2, wireType 2 =*/ 18)
            .bytes(message.precompiledCharsmap);
      if (message.addDummyPrefix != null &&
          Object.hasOwnProperty.call(message, 'addDummyPrefix'))
        writer.uint32(/* id 3, wireType 0 =*/ 24).bool(message.addDummyPrefix);
      if (message.removeExtraWhitespaces != null &&
          Object.hasOwnProperty.call(message, 'removeExtraWhitespaces'))
        writer.uint32(/* id 4, wireType 0 =*/ 32)
            .bool(message.removeExtraWhitespaces);
      if (message.escapeWhitespaces != null &&
          Object.hasOwnProperty.call(message, 'escapeWhitespaces'))
        writer.uint32(/* id 5, wireType 0 =*/ 40)
            .bool(message.escapeWhitespaces);
      if (message.normalizationRuleTsv != null &&
          Object.hasOwnProperty.call(message, 'normalizationRuleTsv'))
        writer.uint32(/* id 6, wireType 2 =*/ 50)
            .string(message.normalizationRuleTsv);
      return writer;
    };

    /**
     * Encodes the specified NormalizerSpec message, length delimited. Does not
     * implicitly {@link sentencepiece.NormalizerSpec.verify|verify} messages.
     * @function encodeDelimited
     * @memberof sentencepiece.NormalizerSpec
     * @static
     * @param {sentencepiece.INormalizerSpec} message NormalizerSpec message or
     *     plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NormalizerSpec.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NormalizerSpec message from the specified reader or buffer.
     * @function decode
     * @memberof sentencepiece.NormalizerSpec
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
     *     from
     * @param {number} [length] Message length if known beforehand
     * @returns {sentencepiece.NormalizerSpec} NormalizerSpec
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NormalizerSpec.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.sentencepiece.NormalizerSpec();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            message.name = reader.string();
            break;
          }
          case 2: {
            message.precompiledCharsmap = reader.bytes();
            break;
          }
          case 3: {
            message.addDummyPrefix = reader.bool();
            break;
          }
          case 4: {
            message.removeExtraWhitespaces = reader.bool();
            break;
          }
          case 5: {
            message.escapeWhitespaces = reader.bool();
            break;
          }
          case 6: {
            message.normalizationRuleTsv = reader.string();
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a NormalizerSpec message from the specified reader or buffer,
     * length delimited.
     * @function decodeDelimited
     * @memberof sentencepiece.NormalizerSpec
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
     *     from
     * @returns {sentencepiece.NormalizerSpec} NormalizerSpec
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NormalizerSpec.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NormalizerSpec message.
     * @function verify
     * @memberof sentencepiece.NormalizerSpec
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is
     *     not
     */
    NormalizerSpec.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (message.name != null && message.hasOwnProperty('name'))
        if (!$util.isString(message.name)) return 'name: string expected';
      if (message.precompiledCharsmap != null &&
          message.hasOwnProperty('precompiledCharsmap'))
        if (!(message.precompiledCharsmap &&
                  typeof message.precompiledCharsmap.length === 'number' ||
              $util.isString(message.precompiledCharsmap)))
          return 'precompiledCharsmap: buffer expected';
      if (message.addDummyPrefix != null &&
          message.hasOwnProperty('addDummyPrefix'))
        if (typeof message.addDummyPrefix !== 'boolean')
          return 'addDummyPrefix: boolean expected';
      if (message.removeExtraWhitespaces != null &&
          message.hasOwnProperty('removeExtraWhitespaces'))
        if (typeof message.removeExtraWhitespaces !== 'boolean')
          return 'removeExtraWhitespaces: boolean expected';
      if (message.escapeWhitespaces != null &&
          message.hasOwnProperty('escapeWhitespaces'))
        if (typeof message.escapeWhitespaces !== 'boolean')
          return 'escapeWhitespaces: boolean expected';
      if (message.normalizationRuleTsv != null &&
          message.hasOwnProperty('normalizationRuleTsv'))
        if (!$util.isString(message.normalizationRuleTsv))
          return 'normalizationRuleTsv: string expected';
      return null;
    };

    /**
     * Creates a NormalizerSpec message from a plain object. Also converts
     * values to their respective internal types.
     * @function fromObject
     * @memberof sentencepiece.NormalizerSpec
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {sentencepiece.NormalizerSpec} NormalizerSpec
     */
    NormalizerSpec.fromObject = function fromObject(object) {
      if (object instanceof $root.sentencepiece.NormalizerSpec) return object;
      let message = new $root.sentencepiece.NormalizerSpec();
      if (object.name != null) message.name = String(object.name);
      if (object.precompiledCharsmap != null)
        if (typeof object.precompiledCharsmap === 'string')
          $util.base64.decode(
              object.precompiledCharsmap,
              message.precompiledCharsmap = $util.newBuffer(
                  $util.base64.length(object.precompiledCharsmap)),
              0);
        else if (object.precompiledCharsmap.length >= 0)
          message.precompiledCharsmap = object.precompiledCharsmap;
      if (object.addDummyPrefix != null)
        message.addDummyPrefix = Boolean(object.addDummyPrefix);
      if (object.removeExtraWhitespaces != null)
        message.removeExtraWhitespaces = Boolean(object.removeExtraWhitespaces);
      if (object.escapeWhitespaces != null)
        message.escapeWhitespaces = Boolean(object.escapeWhitespaces);
      if (object.normalizationRuleTsv != null)
        message.normalizationRuleTsv = String(object.normalizationRuleTsv);
      return message;
    };

    /**
     * Creates a plain object from a NormalizerSpec message. Also converts
     * values to other types if specified.
     * @function toObject
     * @memberof sentencepiece.NormalizerSpec
     * @static
     * @param {sentencepiece.NormalizerSpec} message NormalizerSpec
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NormalizerSpec.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.defaults) {
        object.name = '';
        if (options.bytes === String)
          object.precompiledCharsmap = '';
        else {
          object.precompiledCharsmap = [];
          if (options.bytes !== Array)
            object.precompiledCharsmap =
                $util.newBuffer(object.precompiledCharsmap);
        }
        object.addDummyPrefix = true;
        object.removeExtraWhitespaces = true;
        object.escapeWhitespaces = true;
        object.normalizationRuleTsv = '';
      }
      if (message.name != null && message.hasOwnProperty('name'))
        object.name = message.name;
      if (message.precompiledCharsmap != null &&
          message.hasOwnProperty('precompiledCharsmap'))
        object.precompiledCharsmap = options.bytes === String ?
            $util.base64.encode(
                message.precompiledCharsmap, 0,
                message.precompiledCharsmap.length) :
            options.bytes === Array ?
            Array.prototype.slice.call(message.precompiledCharsmap) :
            message.precompiledCharsmap;
      if (message.addDummyPrefix != null &&
          message.hasOwnProperty('addDummyPrefix'))
        object.addDummyPrefix = message.addDummyPrefix;
      if (message.removeExtraWhitespaces != null &&
          message.hasOwnProperty('removeExtraWhitespaces'))
        object.removeExtraWhitespaces = message.removeExtraWhitespaces;
      if (message.escapeWhitespaces != null &&
          message.hasOwnProperty('escapeWhitespaces'))
        object.escapeWhitespaces = message.escapeWhitespaces;
      if (message.normalizationRuleTsv != null &&
          message.hasOwnProperty('normalizationRuleTsv'))
        object.normalizationRuleTsv = message.normalizationRuleTsv;
      return object;
    };

    /**
     * Converts this NormalizerSpec to JSON.
     * @function toJSON
     * @memberof sentencepiece.NormalizerSpec
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NormalizerSpec.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for NormalizerSpec
     * @function getTypeUrl
     * @memberof sentencepiece.NormalizerSpec
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default
     *     "type.googleapis.com")
     * @returns {string} The default type url
     */
    NormalizerSpec.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/sentencepiece.NormalizerSpec';
    };

    return NormalizerSpec;
  })();

  sentencepiece.SelfTestData = (function() {
    /**
     * Properties of a SelfTestData.
     * @memberof sentencepiece
     * @interface ISelfTestData
     * @property {Array.<sentencepiece.SelfTestData.ISample>|null} [samples]
     * SelfTestData samples
     */

    /**
     * Constructs a new SelfTestData.
     * @memberof sentencepiece
     * @classdesc Represents a SelfTestData.
     * @implements ISelfTestData
     * @constructor
     * @param {sentencepiece.ISelfTestData=} [properties] Properties to set
     */
    function SelfTestData(properties) {
      this.samples = [];
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * SelfTestData samples.
     * @member {Array.<sentencepiece.SelfTestData.ISample>} samples
     * @memberof sentencepiece.SelfTestData
     * @instance
     */
    SelfTestData.prototype.samples = $util.emptyArray;

    /**
     * Creates a new SelfTestData instance using the specified properties.
     * @function create
     * @memberof sentencepiece.SelfTestData
     * @static
     * @param {sentencepiece.ISelfTestData=} [properties] Properties to set
     * @returns {sentencepiece.SelfTestData} SelfTestData instance
     */
    SelfTestData.create = function create(properties) {
      return new SelfTestData(properties);
    };

    /**
     * Encodes the specified SelfTestData message. Does not implicitly {@link
     * sentencepiece.SelfTestData.verify|verify} messages.
     * @function encode
     * @memberof sentencepiece.SelfTestData
     * @static
     * @param {sentencepiece.ISelfTestData} message SelfTestData message or
     *     plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SelfTestData.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.samples != null && message.samples.length)
        for (let i = 0; i < message.samples.length; ++i)
          $root.sentencepiece.SelfTestData.Sample
              .encode(
                  message.samples[i],
                  writer.uint32(/* id 1, wireType 2 =*/ 10).fork())
              .ldelim();
      return writer;
    };

    /**
     * Encodes the specified SelfTestData message, length delimited. Does not
     * implicitly {@link sentencepiece.SelfTestData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof sentencepiece.SelfTestData
     * @static
     * @param {sentencepiece.ISelfTestData} message SelfTestData message or
     *     plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SelfTestData.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SelfTestData message from the specified reader or buffer.
     * @function decode
     * @memberof sentencepiece.SelfTestData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
     *     from
     * @param {number} [length] Message length if known beforehand
     * @returns {sentencepiece.SelfTestData} SelfTestData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SelfTestData.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.sentencepiece.SelfTestData();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            if (!(message.samples && message.samples.length))
              message.samples = [];
            message.samples.push($root.sentencepiece.SelfTestData.Sample.decode(
                reader, reader.uint32()));
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a SelfTestData message from the specified reader or buffer,
     * length delimited.
     * @function decodeDelimited
     * @memberof sentencepiece.SelfTestData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
     *     from
     * @returns {sentencepiece.SelfTestData} SelfTestData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SelfTestData.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SelfTestData message.
     * @function verify
     * @memberof sentencepiece.SelfTestData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is
     *     not
     */
    SelfTestData.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (message.samples != null && message.hasOwnProperty('samples')) {
        if (!Array.isArray(message.samples)) return 'samples: array expected';
        for (let i = 0; i < message.samples.length; ++i) {
          let error = $root.sentencepiece.SelfTestData.Sample.verify(
              message.samples[i]);
          if (error) return 'samples.' + error;
        }
      }
      return null;
    };

    /**
     * Creates a SelfTestData message from a plain object. Also converts values
     * to their respective internal types.
     * @function fromObject
     * @memberof sentencepiece.SelfTestData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {sentencepiece.SelfTestData} SelfTestData
     */
    SelfTestData.fromObject = function fromObject(object) {
      if (object instanceof $root.sentencepiece.SelfTestData) return object;
      let message = new $root.sentencepiece.SelfTestData();
      if (object.samples) {
        if (!Array.isArray(object.samples))
          throw TypeError(
              '.sentencepiece.SelfTestData.samples: array expected');
        message.samples = [];
        for (let i = 0; i < object.samples.length; ++i) {
          if (typeof object.samples[i] !== 'object')
            throw TypeError(
                '.sentencepiece.SelfTestData.samples: object expected');
          message.samples[i] =
              $root.sentencepiece.SelfTestData.Sample.fromObject(
                  object.samples[i]);
        }
      }
      return message;
    };

    /**
     * Creates a plain object from a SelfTestData message. Also converts values
     * to other types if specified.
     * @function toObject
     * @memberof sentencepiece.SelfTestData
     * @static
     * @param {sentencepiece.SelfTestData} message SelfTestData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SelfTestData.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.arrays || options.defaults) object.samples = [];
      if (message.samples && message.samples.length) {
        object.samples = [];
        for (let j = 0; j < message.samples.length; ++j)
          object.samples[j] = $root.sentencepiece.SelfTestData.Sample.toObject(
              message.samples[j], options);
      }
      return object;
    };

    /**
     * Converts this SelfTestData to JSON.
     * @function toJSON
     * @memberof sentencepiece.SelfTestData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SelfTestData.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for SelfTestData
     * @function getTypeUrl
     * @memberof sentencepiece.SelfTestData
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default
     *     "type.googleapis.com")
     * @returns {string} The default type url
     */
    SelfTestData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/sentencepiece.SelfTestData';
    };

    SelfTestData.Sample = (function() {
      /**
       * Properties of a Sample.
       * @memberof sentencepiece.SelfTestData
       * @interface ISample
       * @property {string|null} [input] Sample input
       * @property {string|null} [expected] Sample expected
       */

      /**
       * Constructs a new Sample.
       * @memberof sentencepiece.SelfTestData
       * @classdesc Represents a Sample.
       * @implements ISample
       * @constructor
       * @param {sentencepiece.SelfTestData.ISample=} [properties] Properties to
       *     set
       */
      function Sample(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Sample input.
       * @member {string} input
       * @memberof sentencepiece.SelfTestData.Sample
       * @instance
       */
      Sample.prototype.input = '';

      /**
       * Sample expected.
       * @member {string} expected
       * @memberof sentencepiece.SelfTestData.Sample
       * @instance
       */
      Sample.prototype.expected = '';

      /**
       * Creates a new Sample instance using the specified properties.
       * @function create
       * @memberof sentencepiece.SelfTestData.Sample
       * @static
       * @param {sentencepiece.SelfTestData.ISample=} [properties] Properties to
       *     set
       * @returns {sentencepiece.SelfTestData.Sample} Sample instance
       */
      Sample.create = function create(properties) {
        return new Sample(properties);
      };

      /**
       * Encodes the specified Sample message. Does not implicitly {@link
       * sentencepiece.SelfTestData.Sample.verify|verify} messages.
       * @function encode
       * @memberof sentencepiece.SelfTestData.Sample
       * @static
       * @param {sentencepiece.SelfTestData.ISample} message Sample message or
       *     plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Sample.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (message.input != null &&
            Object.hasOwnProperty.call(message, 'input'))
          writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.input);
        if (message.expected != null &&
            Object.hasOwnProperty.call(message, 'expected'))
          writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.expected);
        return writer;
      };

      /**
       * Encodes the specified Sample message, length delimited. Does not
       * implicitly {@link sentencepiece.SelfTestData.Sample.verify|verify}
       * messages.
       * @function encodeDelimited
       * @memberof sentencepiece.SelfTestData.Sample
       * @static
       * @param {sentencepiece.SelfTestData.ISample} message Sample message or
       *     plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Sample.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a Sample message from the specified reader or buffer.
       * @function decode
       * @memberof sentencepiece.SelfTestData.Sample
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
       *     from
       * @param {number} [length] Message length if known beforehand
       * @returns {sentencepiece.SelfTestData.Sample} Sample
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Sample.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
            message = new $root.sentencepiece.SelfTestData.Sample();
        while (reader.pos < end) {
          let tag = reader.uint32();
          if (tag === error) break;
          switch (tag >>> 3) {
            case 1: {
              message.input = reader.string();
              break;
            }
            case 2: {
              message.expected = reader.string();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a Sample message from the specified reader or buffer, length
       * delimited.
       * @function decodeDelimited
       * @memberof sentencepiece.SelfTestData.Sample
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
       *     from
       * @returns {sentencepiece.SelfTestData.Sample} Sample
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Sample.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a Sample message.
       * @function verify
       * @memberof sentencepiece.SelfTestData.Sample
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is
       *     not
       */
      Sample.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.input != null && message.hasOwnProperty('input'))
          if (!$util.isString(message.input)) return 'input: string expected';
        if (message.expected != null && message.hasOwnProperty('expected'))
          if (!$util.isString(message.expected))
            return 'expected: string expected';
        return null;
      };

      /**
       * Creates a Sample message from a plain object. Also converts values to
       * their respective internal types.
       * @function fromObject
       * @memberof sentencepiece.SelfTestData.Sample
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {sentencepiece.SelfTestData.Sample} Sample
       */
      Sample.fromObject = function fromObject(object) {
        if (object instanceof $root.sentencepiece.SelfTestData.Sample)
          return object;
        let message = new $root.sentencepiece.SelfTestData.Sample();
        if (object.input != null) message.input = String(object.input);
        if (object.expected != null) message.expected = String(object.expected);
        return message;
      };

      /**
       * Creates a plain object from a Sample message. Also converts values to
       * other types if specified.
       * @function toObject
       * @memberof sentencepiece.SelfTestData.Sample
       * @static
       * @param {sentencepiece.SelfTestData.Sample} message Sample
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Sample.toObject = function toObject(message, options) {
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          object.input = '';
          object.expected = '';
        }
        if (message.input != null && message.hasOwnProperty('input'))
          object.input = message.input;
        if (message.expected != null && message.hasOwnProperty('expected'))
          object.expected = message.expected;
        return object;
      };

      /**
       * Converts this Sample to JSON.
       * @function toJSON
       * @memberof sentencepiece.SelfTestData.Sample
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Sample.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Sample
       * @function getTypeUrl
       * @memberof sentencepiece.SelfTestData.Sample
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default
       *     "type.googleapis.com")
       * @returns {string} The default type url
       */
      Sample.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return typeUrlPrefix + '/sentencepiece.SelfTestData.Sample';
      };

      return Sample;
    })();

    return SelfTestData;
  })();

  sentencepiece.ModelProto = (function() {
    /**
     * Properties of a ModelProto.
     * @memberof sentencepiece
     * @interface IModelProto
     * @property {Array.<sentencepiece.ModelProto.ISentencePiece>|null} [pieces]
     * ModelProto pieces
     * @property {sentencepiece.ITrainerSpec|null} [trainerSpec] ModelProto
     * trainerSpec
     * @property {sentencepiece.INormalizerSpec|null} [normalizerSpec]
     * ModelProto normalizerSpec
     * @property {sentencepiece.ISelfTestData|null} [selfTestData] ModelProto
     * selfTestData
     * @property {sentencepiece.INormalizerSpec|null} [denormalizerSpec]
     * ModelProto denormalizerSpec
     */

    /**
     * Constructs a new ModelProto.
     * @memberof sentencepiece
     * @classdesc Represents a ModelProto.
     * @implements IModelProto
     * @constructor
     * @param {sentencepiece.IModelProto=} [properties] Properties to set
     */
    function ModelProto(properties) {
      this.pieces = [];
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * ModelProto pieces.
     * @member {Array.<sentencepiece.ModelProto.ISentencePiece>} pieces
     * @memberof sentencepiece.ModelProto
     * @instance
     */
    ModelProto.prototype.pieces = $util.emptyArray;

    /**
     * ModelProto trainerSpec.
     * @member {sentencepiece.ITrainerSpec|null|undefined} trainerSpec
     * @memberof sentencepiece.ModelProto
     * @instance
     */
    ModelProto.prototype.trainerSpec = null;

    /**
     * ModelProto normalizerSpec.
     * @member {sentencepiece.INormalizerSpec|null|undefined} normalizerSpec
     * @memberof sentencepiece.ModelProto
     * @instance
     */
    ModelProto.prototype.normalizerSpec = null;

    /**
     * ModelProto selfTestData.
     * @member {sentencepiece.ISelfTestData|null|undefined} selfTestData
     * @memberof sentencepiece.ModelProto
     * @instance
     */
    ModelProto.prototype.selfTestData = null;

    /**
     * ModelProto denormalizerSpec.
     * @member {sentencepiece.INormalizerSpec|null|undefined} denormalizerSpec
     * @memberof sentencepiece.ModelProto
     * @instance
     */
    ModelProto.prototype.denormalizerSpec = null;

    /**
     * Creates a new ModelProto instance using the specified properties.
     * @function create
     * @memberof sentencepiece.ModelProto
     * @static
     * @param {sentencepiece.IModelProto=} [properties] Properties to set
     * @returns {sentencepiece.ModelProto} ModelProto instance
     */
    ModelProto.create = function create(properties) {
      return new ModelProto(properties);
    };

    /**
     * Encodes the specified ModelProto message. Does not implicitly {@link
     * sentencepiece.ModelProto.verify|verify} messages.
     * @function encode
     * @memberof sentencepiece.ModelProto
     * @static
     * @param {sentencepiece.IModelProto} message ModelProto message or plain
     *     object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ModelProto.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.pieces != null && message.pieces.length)
        for (let i = 0; i < message.pieces.length; ++i)
          $root.sentencepiece.ModelProto.SentencePiece
              .encode(
                  message.pieces[i],
                  writer.uint32(/* id 1, wireType 2 =*/ 10).fork())
              .ldelim();
      if (message.trainerSpec != null &&
          Object.hasOwnProperty.call(message, 'trainerSpec'))
        $root.sentencepiece.TrainerSpec
            .encode(
                message.trainerSpec,
                writer.uint32(/* id 2, wireType 2 =*/ 18).fork())
            .ldelim();
      if (message.normalizerSpec != null &&
          Object.hasOwnProperty.call(message, 'normalizerSpec'))
        $root.sentencepiece.NormalizerSpec
            .encode(
                message.normalizerSpec,
                writer.uint32(/* id 3, wireType 2 =*/ 26).fork())
            .ldelim();
      if (message.selfTestData != null &&
          Object.hasOwnProperty.call(message, 'selfTestData'))
        $root.sentencepiece.SelfTestData
            .encode(
                message.selfTestData,
                writer.uint32(/* id 4, wireType 2 =*/ 34).fork())
            .ldelim();
      if (message.denormalizerSpec != null &&
          Object.hasOwnProperty.call(message, 'denormalizerSpec'))
        $root.sentencepiece.NormalizerSpec
            .encode(
                message.denormalizerSpec,
                writer.uint32(/* id 5, wireType 2 =*/ 42).fork())
            .ldelim();
      return writer;
    };

    /**
     * Encodes the specified ModelProto message, length delimited. Does not
     * implicitly {@link sentencepiece.ModelProto.verify|verify} messages.
     * @function encodeDelimited
     * @memberof sentencepiece.ModelProto
     * @static
     * @param {sentencepiece.IModelProto} message ModelProto message or plain
     *     object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ModelProto.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ModelProto message from the specified reader or buffer.
     * @function decode
     * @memberof sentencepiece.ModelProto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
     *     from
     * @param {number} [length] Message length if known beforehand
     * @returns {sentencepiece.ModelProto} ModelProto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ModelProto.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.sentencepiece.ModelProto();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            if (!(message.pieces && message.pieces.length)) message.pieces = [];
            message.pieces.push(
                $root.sentencepiece.ModelProto.SentencePiece.decode(
                    reader, reader.uint32()));
            break;
          }
          case 2: {
            message.trainerSpec =
                $root.sentencepiece.TrainerSpec.decode(reader, reader.uint32());
            break;
          }
          case 3: {
            message.normalizerSpec = $root.sentencepiece.NormalizerSpec.decode(
                reader, reader.uint32());
            break;
          }
          case 4: {
            message.selfTestData = $root.sentencepiece.SelfTestData.decode(
                reader, reader.uint32());
            break;
          }
          case 5: {
            message.denormalizerSpec =
                $root.sentencepiece.NormalizerSpec.decode(
                    reader, reader.uint32());
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a ModelProto message from the specified reader or buffer, length
     * delimited.
     * @function decodeDelimited
     * @memberof sentencepiece.ModelProto
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
     *     from
     * @returns {sentencepiece.ModelProto} ModelProto
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ModelProto.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ModelProto message.
     * @function verify
     * @memberof sentencepiece.ModelProto
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is
     *     not
     */
    ModelProto.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (message.pieces != null && message.hasOwnProperty('pieces')) {
        if (!Array.isArray(message.pieces)) return 'pieces: array expected';
        for (let i = 0; i < message.pieces.length; ++i) {
          let error = $root.sentencepiece.ModelProto.SentencePiece.verify(
              message.pieces[i]);
          if (error) return 'pieces.' + error;
        }
      }
      if (message.trainerSpec != null &&
          message.hasOwnProperty('trainerSpec')) {
        let error = $root.sentencepiece.TrainerSpec.verify(message.trainerSpec);
        if (error) return 'trainerSpec.' + error;
      }
      if (message.normalizerSpec != null &&
          message.hasOwnProperty('normalizerSpec')) {
        let error =
            $root.sentencepiece.NormalizerSpec.verify(message.normalizerSpec);
        if (error) return 'normalizerSpec.' + error;
      }
      if (message.selfTestData != null &&
          message.hasOwnProperty('selfTestData')) {
        let error =
            $root.sentencepiece.SelfTestData.verify(message.selfTestData);
        if (error) return 'selfTestData.' + error;
      }
      if (message.denormalizerSpec != null &&
          message.hasOwnProperty('denormalizerSpec')) {
        let error =
            $root.sentencepiece.NormalizerSpec.verify(message.denormalizerSpec);
        if (error) return 'denormalizerSpec.' + error;
      }
      return null;
    };

    /**
     * Creates a ModelProto message from a plain object. Also converts values to
     * their respective internal types.
     * @function fromObject
     * @memberof sentencepiece.ModelProto
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {sentencepiece.ModelProto} ModelProto
     */
    ModelProto.fromObject = function fromObject(object) {
      if (object instanceof $root.sentencepiece.ModelProto) return object;
      let message = new $root.sentencepiece.ModelProto();
      if (object.pieces) {
        if (!Array.isArray(object.pieces))
          throw TypeError('.sentencepiece.ModelProto.pieces: array expected');
        message.pieces = [];
        for (let i = 0; i < object.pieces.length; ++i) {
          if (typeof object.pieces[i] !== 'object')
            throw TypeError(
                '.sentencepiece.ModelProto.pieces: object expected');
          message.pieces[i] =
              $root.sentencepiece.ModelProto.SentencePiece.fromObject(
                  object.pieces[i]);
        }
      }
      if (object.trainerSpec != null) {
        if (typeof object.trainerSpec !== 'object')
          throw TypeError(
              '.sentencepiece.ModelProto.trainerSpec: object expected');
        message.trainerSpec =
            $root.sentencepiece.TrainerSpec.fromObject(object.trainerSpec);
      }
      if (object.normalizerSpec != null) {
        if (typeof object.normalizerSpec !== 'object')
          throw TypeError(
              '.sentencepiece.ModelProto.normalizerSpec: object expected');
        message.normalizerSpec = $root.sentencepiece.NormalizerSpec.fromObject(
            object.normalizerSpec);
      }
      if (object.selfTestData != null) {
        if (typeof object.selfTestData !== 'object')
          throw TypeError(
              '.sentencepiece.ModelProto.selfTestData: object expected');
        message.selfTestData =
            $root.sentencepiece.SelfTestData.fromObject(object.selfTestData);
      }
      if (object.denormalizerSpec != null) {
        if (typeof object.denormalizerSpec !== 'object')
          throw TypeError(
              '.sentencepiece.ModelProto.denormalizerSpec: object expected');
        message.denormalizerSpec =
            $root.sentencepiece.NormalizerSpec.fromObject(
                object.denormalizerSpec);
      }
      return message;
    };

    /**
     * Creates a plain object from a ModelProto message. Also converts values to
     * other types if specified.
     * @function toObject
     * @memberof sentencepiece.ModelProto
     * @static
     * @param {sentencepiece.ModelProto} message ModelProto
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ModelProto.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.arrays || options.defaults) object.pieces = [];
      if (options.defaults) {
        object.trainerSpec = null;
        object.normalizerSpec = null;
        object.selfTestData = null;
        object.denormalizerSpec = null;
      }
      if (message.pieces && message.pieces.length) {
        object.pieces = [];
        for (let j = 0; j < message.pieces.length; ++j)
          object.pieces[j] =
              $root.sentencepiece.ModelProto.SentencePiece.toObject(
                  message.pieces[j], options);
      }
      if (message.trainerSpec != null && message.hasOwnProperty('trainerSpec'))
        object.trainerSpec = $root.sentencepiece.TrainerSpec.toObject(
            message.trainerSpec, options);
      if (message.normalizerSpec != null &&
          message.hasOwnProperty('normalizerSpec'))
        object.normalizerSpec = $root.sentencepiece.NormalizerSpec.toObject(
            message.normalizerSpec, options);
      if (message.selfTestData != null &&
          message.hasOwnProperty('selfTestData'))
        object.selfTestData = $root.sentencepiece.SelfTestData.toObject(
            message.selfTestData, options);
      if (message.denormalizerSpec != null &&
          message.hasOwnProperty('denormalizerSpec'))
        object.denormalizerSpec = $root.sentencepiece.NormalizerSpec.toObject(
            message.denormalizerSpec, options);
      return object;
    };

    /**
     * Converts this ModelProto to JSON.
     * @function toJSON
     * @memberof sentencepiece.ModelProto
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ModelProto.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ModelProto
     * @function getTypeUrl
     * @memberof sentencepiece.ModelProto
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default
     *     "type.googleapis.com")
     * @returns {string} The default type url
     */
    ModelProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/sentencepiece.ModelProto';
    };

    ModelProto.SentencePiece = (function() {
      /**
       * Properties of a SentencePiece.
       * @memberof sentencepiece.ModelProto
       * @interface ISentencePiece
       * @property {string|null} [piece] SentencePiece piece
       * @property {number|null} [score] SentencePiece score
       * @property {sentencepiece.ModelProto.SentencePiece.Type|null} [type]
       * SentencePiece type
       */

      /**
       * Constructs a new SentencePiece.
       * @memberof sentencepiece.ModelProto
       * @classdesc Represents a SentencePiece.
       * @implements ISentencePiece
       * @constructor
       * @param {sentencepiece.ModelProto.ISentencePiece=} [properties]
       *     Properties to set
       */
      function SentencePiece(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * SentencePiece piece.
       * @member {string} piece
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @instance
       */
      SentencePiece.prototype.piece = '';

      /**
       * SentencePiece score.
       * @member {number} score
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @instance
       */
      SentencePiece.prototype.score = 0;

      /**
       * SentencePiece type.
       * @member {sentencepiece.ModelProto.SentencePiece.Type} type
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @instance
       */
      SentencePiece.prototype.type = 1;

      /**
       * Creates a new SentencePiece instance using the specified properties.
       * @function create
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @static
       * @param {sentencepiece.ModelProto.ISentencePiece=} [properties]
       *     Properties to set
       * @returns {sentencepiece.ModelProto.SentencePiece} SentencePiece
       *     instance
       */
      SentencePiece.create = function create(properties) {
        return new SentencePiece(properties);
      };

      /**
       * Encodes the specified SentencePiece message. Does not implicitly {@link
       * sentencepiece.ModelProto.SentencePiece.verify|verify} messages.
       * @function encode
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @static
       * @param {sentencepiece.ModelProto.ISentencePiece} message SentencePiece
       *     message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      SentencePiece.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (message.piece != null &&
            Object.hasOwnProperty.call(message, 'piece'))
          writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.piece);
        if (message.score != null &&
            Object.hasOwnProperty.call(message, 'score'))
          writer.uint32(/* id 2, wireType 5 =*/ 21).float(message.score);
        if (message.type != null && Object.hasOwnProperty.call(message, 'type'))
          writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.type);
        return writer;
      };

      /**
       * Encodes the specified SentencePiece message, length delimited. Does not
       * implicitly {@link sentencepiece.ModelProto.SentencePiece.verify|verify}
       * messages.
       * @function encodeDelimited
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @static
       * @param {sentencepiece.ModelProto.ISentencePiece} message SentencePiece
       *     message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      SentencePiece.encodeDelimited = function encodeDelimited(
          message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a SentencePiece message from the specified reader or buffer.
       * @function decode
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
       *     from
       * @param {number} [length] Message length if known beforehand
       * @returns {sentencepiece.ModelProto.SentencePiece} SentencePiece
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      SentencePiece.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length,
            message = new $root.sentencepiece.ModelProto.SentencePiece();
        while (reader.pos < end) {
          let tag = reader.uint32();
          if (tag === error) break;
          switch (tag >>> 3) {
            case 1: {
              message.piece = reader.string();
              break;
            }
            case 2: {
              message.score = reader.float();
              break;
            }
            case 3: {
              message.type = reader.int32();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a SentencePiece message from the specified reader or buffer,
       * length delimited.
       * @function decodeDelimited
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode
       *     from
       * @returns {sentencepiece.ModelProto.SentencePiece} SentencePiece
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      SentencePiece.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a SentencePiece message.
       * @function verify
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is
       *     not
       */
      SentencePiece.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.piece != null && message.hasOwnProperty('piece'))
          if (!$util.isString(message.piece)) return 'piece: string expected';
        if (message.score != null && message.hasOwnProperty('score'))
          if (typeof message.score !== 'number')
            return 'score: number expected';
        if (message.type != null && message.hasOwnProperty('type'))
          switch (message.type) {
            default:
              return 'type: enum value expected';
            case 1:
            case 2:
            case 3:
            case 4:
            case 6:
            case 5:
              break;
          }
        return null;
      };

      /**
       * Creates a SentencePiece message from a plain object. Also converts
       * values to their respective internal types.
       * @function fromObject
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {sentencepiece.ModelProto.SentencePiece} SentencePiece
       */
      SentencePiece.fromObject = function fromObject(object) {
        if (object instanceof $root.sentencepiece.ModelProto.SentencePiece)
          return object;
        let message = new $root.sentencepiece.ModelProto.SentencePiece();
        if (object.piece != null) message.piece = String(object.piece);
        if (object.score != null) message.score = Number(object.score);
        switch (object.type) {
          default:
            if (typeof object.type === 'number') {
              message.type = object.type;
              break;
            }
            break;
          case 'NORMAL':
          case 1:
            message.type = 1;
            break;
          case 'UNKNOWN':
          case 2:
            message.type = 2;
            break;
          case 'CONTROL':
          case 3:
            message.type = 3;
            break;
          case 'USER_DEFINED':
          case 4:
            message.type = 4;
            break;
          case 'BYTE':
          case 6:
            message.type = 6;
            break;
          case 'UNUSED':
          case 5:
            message.type = 5;
            break;
        }
        return message;
      };

      /**
       * Creates a plain object from a SentencePiece message. Also converts
       * values to other types if specified.
       * @function toObject
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @static
       * @param {sentencepiece.ModelProto.SentencePiece} message SentencePiece
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      SentencePiece.toObject = function toObject(message, options) {
        if (!options) options = {};
        let object = {};
        if (options.defaults) {
          object.piece = '';
          object.score = 0;
          object.type = options.enums === String ? 'NORMAL' : 1;
        }
        if (message.piece != null && message.hasOwnProperty('piece'))
          object.piece = message.piece;
        if (message.score != null && message.hasOwnProperty('score'))
          object.score = options.json && !isFinite(message.score) ?
              String(message.score) :
              message.score;
        if (message.type != null && message.hasOwnProperty('type'))
          object.type = options.enums === String ?
              $root.sentencepiece.ModelProto.SentencePiece
                          .Type[message.type] === undefined ?
              message.type :
              $root.sentencepiece.ModelProto.SentencePiece.Type[message.type] :
              message.type;
        return object;
      };

      /**
       * Converts this SentencePiece to JSON.
       * @function toJSON
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      SentencePiece.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for SentencePiece
       * @function getTypeUrl
       * @memberof sentencepiece.ModelProto.SentencePiece
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default
       *     "type.googleapis.com")
       * @returns {string} The default type url
       */
      SentencePiece.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return typeUrlPrefix + '/sentencepiece.ModelProto.SentencePiece';
      };

      /**
       * Type enum.
       * @name sentencepiece.ModelProto.SentencePiece.Type
       * @enum {number}
       * @property {number} NORMAL=1 NORMAL value
       * @property {number} UNKNOWN=2 UNKNOWN value
       * @property {number} CONTROL=3 CONTROL value
       * @property {number} USER_DEFINED=4 USER_DEFINED value
       * @property {number} BYTE=6 BYTE value
       * @property {number} UNUSED=5 UNUSED value
       */
      SentencePiece.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[1] = 'NORMAL'] = 1;
        values[valuesById[2] = 'UNKNOWN'] = 2;
        values[valuesById[3] = 'CONTROL'] = 3;
        values[valuesById[4] = 'USER_DEFINED'] = 4;
        values[valuesById[6] = 'BYTE'] = 6;
        values[valuesById[5] = 'UNUSED'] = 5;
        return values;
      })();

      return SentencePiece;
    })();

    return ModelProto;
  })();

  return sentencepiece;
})();

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Pure TypeScript implementation of SentencePiece tokenizer.
 * Translated from github.com/eliben/go-sentencepiece
 */
const WHITESPACE_SEPARATOR = '▁';
const SYMBOL_BOS = '<bos>';
const SYMBOL_EOS = '<eos>';
const SYMBOL_PAD = '<pad>';
/**
 * Processor represents a SentencePiece processor (tokenizer).
 * It converts input text into a sequence of tokens and back.
 */
class SentencePieceProcessor {
    /**
     * Creates a new Processor from model proto bytes.
     */
    constructor(modelProtoBytes) {
        var _a, _b;
        this.model = this.parseModelProto(modelProtoBytes);
        const tspec = this.model.trainerSpec;
        if (!tspec || tspec.modelType !== ModelType.BPE) {
            throw new Error(`Model type ${tspec === null || tspec === void 0 ? void 0 : tspec.modelType} not supported, only BPE is supported`);
        }
        const nspec = this.model.normalizerSpec;
        if ((nspec === null || nspec === void 0 ? void 0 : nspec.addDummyPrefix) || (nspec === null || nspec === void 0 ? void 0 : nspec.removeExtraWhitespaces)) {
            throw new Error(`Normalizer spec options not supported: ${JSON.stringify(nspec)}`);
        }
        const userDefined = new Set();
        this.pieces = new Map();
        this.reserved = new Map();
        this.byte2Token = new Map();
        this.idToByte = new Map();
        this.unknownID = -1;
        this.maxPieceLength = 0;
        if (!this.model.pieces) {
            throw new Error('Model has no pieces');
        }
        for (let i = 0; i < this.model.pieces.length; i++) {
            const piece = this.model.pieces[i];
            const pieceText = (_a = piece.piece) !== null && _a !== void 0 ? _a : '';
            const pieceType = (_b = piece.type) !== null && _b !== void 0 ? _b : SentencePieceType.NORMAL;
            const isNormalPiece = pieceType === SentencePieceType.NORMAL ||
                pieceType === SentencePieceType.USER_DEFINED ||
                pieceType === SentencePieceType.UNUSED;
            if (isNormalPiece) {
                this.pieces.set(pieceText, i);
                this.maxPieceLength = Math.max(this.maxPieceLength, pieceText.length);
            }
            else {
                this.reserved.set(pieceText, i);
            }
            if (pieceType === SentencePieceType.USER_DEFINED) {
                userDefined.add(pieceText);
            }
            else if (pieceType === SentencePieceType.UNKNOWN) {
                if (this.unknownID >= 0) {
                    throw new Error('unk redefined');
                }
                this.unknownID = i;
            }
            else if (pieceType === SentencePieceType.BYTE) {
                if (!tspec.byteFallback) {
                    throw new Error(`byte piece "${pieceText}" found although byte_fallback=false`);
                }
                const bv = convertHexValue(pieceText);
                if (bv >= 0 && bv < 256) {
                    this.byte2Token.set(bv, { id: i, text: pieceText });
                    this.idToByte.set(i, bv);
                }
            }
        }
        if (this.unknownID < 0) {
            throw new Error('unk symbol is not defined');
        }
        // If byte_fallback is specified, ensure all 256 byte values are present
        if (tspec.byteFallback) {
            for (let i = 0; i < 256; i++) {
                if (!this.byte2Token.has(i)) {
                    throw new Error(`byte value 0x${i.toString(16).padStart(2, '0')} not found`);
                }
            }
        }
        this.userDefinedMatcher = new PrefixMatcher(userDefined);
    }
    /**
     * Encodes text into a list of tokens.
     */
    encode(text) {
        var _a;
        text = this.normalize(text);
        const symList = [];
        while (text.length > 0) {
            const [slen, found] = this.symbolMatch(text);
            const sym = {
                noMerge: found,
                symbol: text.substring(0, slen),
                prev: symList.length - 1,
                next: symList.length + 1,
            };
            symList.push(sym);
            text = text.substring(slen);
        }
        if (symList.length === 0) {
            return [];
        }
        symList[symList.length - 1].next = -1;
        const mergeQueue = new PriorityQueue(symList.length, (a, b) => {
            if (a.score > b.score || (a.score === b.score && a.left < b.left)) {
                return 1;
            }
            return -1;
        });
        const findMerged = (x, y) => {
            var _a;
            const merged = x.symbol + y.symbol;
            const id = this.pieces.get(merged);
            if (id !== undefined && this.model.pieces) {
                return [(_a = this.model.pieces[id].piece) !== null && _a !== void 0 ? _a : '', id, true];
            }
            return ['', 0, false];
        };
        const suggestNewMergePair = (left, right) => {
            var _a;
            if (left === -1 ||
                right === -1 ||
                symList[left].noMerge ||
                symList[right].noMerge) {
                return;
            }
            const [mergedSymbol, id, ok] = findMerged(symList[left], symList[right]);
            if (ok && this.model.pieces) {
                mergeQueue.insert({
                    left,
                    right,
                    length: mergedSymbol.length,
                    score: (_a = this.model.pieces[id].score) !== null && _a !== void 0 ? _a : 0,
                });
            }
        };
        for (let i = 1; i < symList.length; i++) {
            suggestNewMergePair(i - 1, i);
        }
        const candidateIsDead = (candidate) => {
            const leftSymbol = symList[candidate.left].symbol;
            const rightSymbol = symList[candidate.right].symbol;
            return (leftSymbol === '' ||
                rightSymbol === '' ||
                leftSymbol.length + rightSymbol.length !== candidate.length);
        };
        let mergeQueueDead = 0;
        while (mergeQueue.len() > 0) {
            const candidate = mergeQueue.popMax();
            const leftSymbol = symList[candidate.left];
            const rightSymbol = symList[candidate.right];
            if (candidateIsDead(candidate)) {
                mergeQueueDead--;
                continue;
            }
            if (mergeQueueDead * 3 > mergeQueue.len()) {
                mergeQueue.removeFunc(candidateIsDead);
                mergeQueueDead = 0;
            }
            const [mergedSymbol, , ok] = findMerged(leftSymbol, rightSymbol);
            if (!ok) {
                throw new Error('failed to merge symbols');
            }
            symList[candidate.left].symbol = mergedSymbol;
            symList[candidate.left].next = rightSymbol.next;
            if (rightSymbol.next >= 0) {
                symList[rightSymbol.next].prev = candidate.left;
            }
            symList[candidate.right].symbol = '';
            mergeQueueDead++;
            suggestNewMergePair(leftSymbol.prev, candidate.left);
            suggestNewMergePair(candidate.left, rightSymbol.next);
        }
        const tokens = [];
        for (let i = 0; i >= 0; i = symList[i].next) {
            const symbol = symList[i].symbol;
            const id = this.symbolToID(symbol);
            if (id === this.unknownID && ((_a = this.model.trainerSpec) === null || _a === void 0 ? void 0 : _a.byteFallback)) {
                // Need to convert byte to token at UTF-8 bytes level
                const bytes = new TextEncoder().encode(symbol);
                for (let j = 0; j < bytes.length; j++) {
                    const byteToken = this.byte2Token.get(bytes[j]);
                    if (byteToken) {
                        tokens.push(byteToken);
                    }
                }
            }
            else {
                tokens.push({ id, text: symbol });
            }
        }
        return tokens;
    }
    /**
     * Decodes a list of token IDs back into text.
     */
    decode(ids) {
        var _a, _b, _c;
        const parts = [];
        let i = 0;
        while (i < ids.length) {
            let nextNonByte = i;
            while (nextNonByte < ids.length && this.isByteID(ids[nextNonByte])) {
                nextNonByte++;
            }
            const numBytes = nextNonByte - i;
            if (numBytes > 0) {
                const bytes = [];
                for (let bi = i; bi < nextNonByte; bi++) {
                    const byte = this.idToByte.get(ids[bi]);
                    if (byte !== undefined) {
                        bytes.push(byte);
                    }
                }
                const textDecoder = new TextDecoder('utf-8', { fatal: false });
                const text = textDecoder.decode(new Uint8Array(bytes));
                parts.push(text);
            }
            if (nextNonByte >= ids.length) {
                break;
            }
            const id = ids[nextNonByte];
            // eslint-disable-next-line no-empty
            if (this.isControlID(id)) ;
            else if (id === this.unknownID) {
                parts.push((_b = (_a = this.model.trainerSpec) === null || _a === void 0 ? void 0 : _a.unkSurface) !== null && _b !== void 0 ? _b : '');
            }
            else if (this.model.pieces && this.model.pieces[id]) {
                const piece = (_c = this.model.pieces[id].piece) !== null && _c !== void 0 ? _c : '';
                parts.push(this.replaceSeparatorsBySpace(piece));
            }
            i = nextNonByte + 1;
        }
        return parts.join('');
    }
    /**
     * Decodes a list of tokens back into text.
     */
    decodeTokens(tokens) {
        return this.decode(tokens.map((t) => t.id));
    }
    /**
     * Returns information about the loaded model.
     */
    modelInfo() {
        var _a, _b;
        const getControlID = (symbol) => {
            const id = this.symbolToID(symbol);
            return this.isControlID(id) ? id : -1;
        };
        return {
            vocabularySize: (_b = (_a = this.model.pieces) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
            beginningOfSentenceID: getControlID(SYMBOL_BOS),
            endOfSentenceID: getControlID(SYMBOL_EOS),
            padID: getControlID(SYMBOL_PAD),
            unknownID: this.unknownID,
        };
    }
    normalize(text) {
        return text.replace(/ /g, WHITESPACE_SEPARATOR);
    }
    replaceSeparatorsBySpace(text) {
        return text.replace(new RegExp(WHITESPACE_SEPARATOR, 'g'), ' ');
    }
    symbolMatch(text) {
        const prefixLen = this.userDefinedMatcher.findPrefixLen(text);
        if (prefixLen > 0) {
            return [prefixLen, true];
        }
        // Return character length (1), not byte length
        // This matches the Java implementation where i++ advances by 1 character
        return [1, false];
    }
    symbolToID(symbol) {
        const reservedID = this.reserved.get(symbol);
        if (reservedID !== undefined) {
            return reservedID;
        }
        const pieceID = this.pieces.get(symbol);
        if (pieceID !== undefined) {
            return pieceID;
        }
        return this.unknownID;
    }
    isByteID(id) {
        if (!this.model.pieces || id >= this.model.pieces.length) {
            return false;
        }
        return this.model.pieces[id].type === SentencePieceType.BYTE;
    }
    isControlID(id) {
        if (!this.model.pieces || id >= this.model.pieces.length) {
            return false;
        }
        return this.model.pieces[id].type === SentencePieceType.CONTROL;
    }
    parseModelProto(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const decoded = sentencepiece.ModelProto.decode(data);
        const model = {
            pieces: (_a = decoded.pieces) === null || _a === void 0 ? void 0 : _a.map((p) => {
                var _a, _b, _c;
                return ({
                    piece: (_a = p.piece) !== null && _a !== void 0 ? _a : undefined,
                    score: (_b = p.score) !== null && _b !== void 0 ? _b : undefined,
                    type: (_c = p.type) !== null && _c !== void 0 ? _c : undefined,
                });
            }),
            trainerSpec: decoded.trainerSpec
                ? {
                    modelType: (_b = decoded.trainerSpec.modelType) !== null && _b !== void 0 ? _b : undefined,
                    vocabSize: (_c = decoded.trainerSpec.vocabSize) !== null && _c !== void 0 ? _c : undefined,
                    characterCoverage: (_d = decoded.trainerSpec.characterCoverage) !== null && _d !== void 0 ? _d : undefined,
                    byteFallback: (_e = decoded.trainerSpec.byteFallback) !== null && _e !== void 0 ? _e : undefined,
                    unkSurface: (_f = decoded.trainerSpec.unkSurface) !== null && _f !== void 0 ? _f : undefined,
                }
                : undefined,
            normalizerSpec: decoded.normalizerSpec
                ? {
                    name: (_g = decoded.normalizerSpec.name) !== null && _g !== void 0 ? _g : undefined,
                    precompiledCharsmap: decoded.normalizerSpec.precompiledCharsmap
                        ? new Uint8Array(decoded.normalizerSpec.precompiledCharsmap)
                        : undefined,
                    addDummyPrefix: (_h = decoded.normalizerSpec.addDummyPrefix) !== null && _h !== void 0 ? _h : undefined,
                    removeExtraWhitespaces: (_j = decoded.normalizerSpec.removeExtraWhitespaces) !== null && _j !== void 0 ? _j : undefined,
                    escapeWhitespaces: (_k = decoded.normalizerSpec.escapeWhitespaces) !== null && _k !== void 0 ? _k : undefined,
                    normalizationRuleTsv: (_l = decoded.normalizerSpec.normalizationRuleTsv) !== null && _l !== void 0 ? _l : undefined,
                }
                : undefined,
        };
        return model;
    }
}
function convertHexValue(bv) {
    const match = bv.match(/^<0x([0-9A-Fa-f]{2})>$/);
    if (!match) {
        return -1;
    }
    return parseInt(match[1], 16);
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Source of truth: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models
 */
const GEMINI_MODELS_TO_TOKENIZER_NAMES = {
    'gemini-2.5-pro': 'gemma3',
    'gemini-2.5-flash': 'gemma3',
    'gemini-2.5-flash-lite': 'gemma3',
    'gemini-2.0-flash': 'gemma3',
    'gemini-2.0-flash-lite': 'gemma3',
};
const GEMINI_STABLE_MODELS_TO_TOKENIZER_NAMES = {
    'gemini-3-pro-preview': 'gemma3',
    'gemini-2.5-pro-preview-06-05': 'gemma3',
    'gemini-2.5-pro-preview-05-06': 'gemma3',
    'gemini-2.5-pro-exp-03-25': 'gemma3',
    'gemini-live-2.5-flash': 'gemma3',
    'gemini-2.5-flash-preview-05-20': 'gemma3',
    'gemini-2.5-flash-preview-04-17': 'gemma3',
    'gemini-2.5-flash-lite-preview-06-17': 'gemma3',
    'gemini-2.0-flash-001': 'gemma3',
    'gemini-2.0-flash-lite-001': 'gemma3',
};
const TOKENIZERS = {
    gemma2: {
        modelUrl: 'https://raw.githubusercontent.com/google/gemma_pytorch/33b652c465537c6158f9a472ea5700e5e770ad3f/tokenizer/tokenizer.model',
        modelHash: '61a7b147390c64585d6c3543dd6fc636906c9af3865a5548f27f31aee1d4c8e2',
    },
    gemma3: {
        modelUrl: 'https://raw.githubusercontent.com/google/gemma_pytorch/014acb7ac4563a5f77c76d7ff98f31b568c16508/tokenizer/gemma3_cleaned_262144_v2.spiece.model',
        modelHash: '1299c11d7cf632ef3b4e11937501358ada021bbdf7c47638d13c0ee982f2e79c',
    },
};
/**
 * Gets the tokenizer name for the given model name.
 *
 * @param modelName The Gemini model name
 * @return The tokenizer name to use
 * @throws Error if the model is not supported
 */
function getTokenizerName(modelName) {
    if (modelName in GEMINI_MODELS_TO_TOKENIZER_NAMES) {
        return GEMINI_MODELS_TO_TOKENIZER_NAMES[modelName];
    }
    if (modelName in GEMINI_STABLE_MODELS_TO_TOKENIZER_NAMES) {
        return GEMINI_STABLE_MODELS_TO_TOKENIZER_NAMES[modelName];
    }
    const supportedModels = [
        ...Object.keys(GEMINI_MODELS_TO_TOKENIZER_NAMES),
        ...Object.keys(GEMINI_STABLE_MODELS_TO_TOKENIZER_NAMES),
    ].join(', ');
    throw new Error(`Model ${modelName} is not supported for local tokenization. Supported models: ${supportedModels}.`);
}
/**
 * Gets the tokenizer configuration for the given tokenizer name.
 *
 * @param tokenizerName The tokenizer name
 * @return The tokenizer configuration
 * @throws Error if the tokenizer is not found
 */
function getTokenizerConfig(tokenizerName) {
    if (!(tokenizerName in TOKENIZERS)) {
        throw new Error(`Tokenizer ${tokenizerName} is not supported. Supported tokenizers: ${Object.keys(TOKENIZERS).join(', ')}`);
    }
    return TOKENIZERS[tokenizerName];
}
/**
 * Loads tokenizer model bytes from cache or URL.
 *
 * @param tokenizerName The tokenizer name
 * @param platform Platform-specific implementations
 * @return The model bytes
 */
async function loadModelProtoBytes(tokenizerName, platform) {
    const config = getTokenizerConfig(tokenizerName);
    const encoder = new TextEncoder();
    const cacheKey = await platform.fileSystem.computeSha1(encoder.encode(config.modelUrl));
    let modelData = await platform.cache.load(cacheKey, config.modelHash);
    if (!modelData) {
        modelData = await platform.fileSystem.fetchFromUrl(config.modelUrl);
        const isValid = await platform.fileSystem.validateHash(modelData, config.modelHash);
        if (!isValid) {
            const actualHash = await platform.fileSystem.computeSha1(modelData);
            throw new Error(`Downloaded model file is corrupted. Expected hash ${config.modelHash}. Got file hash ${actualHash}.`);
        }
        await platform.cache.save(cacheKey, modelData);
    }
    return modelData;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Accumulates countable texts from Content and Tool objects.
 */
class TextsAccumulator {
    constructor() {
        this.texts = [];
    }
    /**
     * Returns all accumulated texts.
     */
    getTexts() {
        return this.texts;
    }
    /**
     * Adds multiple Content objects.
     */
    addContents(contents) {
        for (const content of contents) {
            this.addContent(content);
        }
    }
    addContent(content) {
        const countedContent = {
            parts: [],
            role: content.role,
        };
        if (content.parts) {
            for (const part of content.parts) {
                const countedPart = {};
                if (part.fileData || part.inlineData) {
                    throw new Error('LocalTokenizers do not support non-text content types.');
                }
                if (part.videoMetadata) {
                    countedPart.videoMetadata = part.videoMetadata;
                }
                if (part.functionCall) {
                    this.addFunctionCall(part.functionCall);
                    countedPart.functionCall = part.functionCall;
                }
                if (part.functionResponse) {
                    this.addFunctionResponse(part.functionResponse);
                    countedPart.functionResponse = part.functionResponse;
                }
                if (part.text) {
                    countedPart.text = part.text;
                    this.texts.push(part.text);
                }
                if (countedContent.parts) {
                    countedContent.parts.push(countedPart);
                }
            }
        }
        if (!this.deepEqual(content, countedContent)) {
            console.warn(`Content contains unsupported types for token counting. ` +
                `Supported fields: ${JSON.stringify(countedContent)}. ` +
                `Got: ${JSON.stringify(content)}.`);
        }
    }
    addFunctionCall(functionCall) {
        if (functionCall.name) {
            this.texts.push(functionCall.name);
        }
        if (functionCall.args) {
            this.dictTraverse(functionCall.args);
        }
    }
    addTools(tools) {
        for (const tool of tools) {
            this.addTool(tool);
        }
    }
    addTool(tool) {
        if (tool.functionDeclarations) {
            for (const functionDeclaration of tool.functionDeclarations) {
                this.functionDeclarationTraverse(functionDeclaration);
            }
        }
    }
    addFunctionResponses(functionResponses) {
        for (const functionResponse of functionResponses) {
            this.addFunctionResponse(functionResponse);
        }
    }
    addFunctionResponse(functionResponse) {
        if (functionResponse.name) {
            this.texts.push(functionResponse.name);
        }
        if (functionResponse.response) {
            this.dictTraverse(functionResponse.response);
        }
    }
    functionDeclarationTraverse(functionDeclaration) {
        if (functionDeclaration.name) {
            this.texts.push(functionDeclaration.name);
        }
        if (functionDeclaration.description) {
            this.texts.push(functionDeclaration.description);
        }
        if (functionDeclaration.parameters) {
            this.addSchema(functionDeclaration.parameters);
        }
        if (functionDeclaration.response) {
            this.addSchema(functionDeclaration.response);
        }
    }
    addSchema(schema) {
        if (schema.format) {
            this.texts.push(schema.format);
        }
        if (schema.description) {
            this.texts.push(schema.description);
        }
        if (schema.enum) {
            this.texts.push(...schema.enum);
        }
        if (schema.required) {
            this.texts.push(...schema.required);
        }
        if (schema.items) {
            this.addSchema(schema.items);
        }
        if (schema.properties) {
            for (const [key, value] of Object.entries(schema.properties)) {
                this.texts.push(key);
                this.addSchema(value);
            }
        }
        if (schema.example !== undefined && schema.example !== null) {
            this.anyTraverse(schema.example);
        }
    }
    dictTraverse(obj) {
        this.texts.push(...Object.keys(obj));
        for (const value of Object.values(obj)) {
            this.anyTraverse(value);
        }
    }
    anyTraverse(value) {
        if (typeof value === 'string') {
            this.texts.push(value);
        }
        else if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    this.anyTraverse(item);
                }
            }
            else {
                this.dictTraverse(value);
            }
        }
    }
    deepEqual(obj1, obj2) {
        if (obj1 === obj2)
            return true;
        if (obj1 == null || obj2 == null)
            return obj1 === obj2;
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object')
            return false;
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length)
                return false;
            for (let i = 0; i < obj1.length; i++) {
                if (!this.deepEqual(obj1[i], obj2[i]))
                    return false;
            }
            return true;
        }
        const keys1 = Object.keys(obj1).filter((k) => obj1[k] !== undefined);
        const keys2 = Object.keys(obj2).filter((k) => obj2[k] !== undefined);
        if (keys1.length !== keys2.length)
            return false;
        for (const key of keys1) {
            if (!keys2.includes(key))
                return false;
            if (!this.deepEqual(obj1[key], obj2[key]))
                return false;
        }
        return true;
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * LocalTokenizer implementation that integrates SentencePiece with platform-specific
 * caching and file operations.
 *
 * This is the main implementation that brings together:
 * - SentencePiece BPE tokenizer
 * - Platform-specific model loading and caching
 * - Text extraction from Content/Tool/Schema objects
 */
/**
 * LocalTokenizer provides text-only local tokenization for Gemini models.
 *
 * LIMITATIONS:
 * - Only supports text-based tokenization (no multimodal)
 * - Forward compatibility depends on open-source tokenizer models
 * - For tools/schemas, only supports types.Tool and types.Schema objects
 *   (Python functions or Pydantic models cannot be passed directly)
 */
let LocalTokenizer$1 = class LocalTokenizer {
    /**
     * Creates a new LocalTokenizer.
     *
     * @param modelName Gemini model name (e.g., 'gemini-2.0-flash-001')
     * @param platform Platform-specific implementations for caching and file operations
     */
    constructor(modelName, platform, ProcessorClass = SentencePieceProcessor) {
        this.ProcessorClass = ProcessorClass;
        this.modelName = modelName;
        this.tokenizerName = getTokenizerName(modelName);
        this.platform = platform;
    }
    async ensureProcessor() {
        if (this.processor) {
            return;
        }
        const modelBytes = await loadModelProtoBytes(this.tokenizerName, this.platform);
        this.processor = new this.ProcessorClass(modelBytes);
    }
    /**
     * Counts the number of tokens in the given content.
     *
     * @param contents The contents to tokenize
     * @param config Optional configuration for counting tokens
     * @return A CountTokensResult containing the total number of tokens
     *
     * @example
     * ```typescript
     * const tokenizer = new LocalTokenizer('gemini-2.0-flash-001', platform);
     * const result = await tokenizer.countTokens("What is your name?");
     * console.log(result.totalTokens); // 5
     * ```
     */
    async countTokens(contents, config) {
        var _a;
        await this.ensureProcessor();
        const processedContents = tContents(contents);
        const textAccumulator = new TextsAccumulator();
        textAccumulator.addContents(processedContents);
        if (config === null || config === void 0 ? void 0 : config.systemInstruction) {
            const systemContent = tContent(config.systemInstruction);
            textAccumulator.addContents([systemContent]);
        }
        if (config === null || config === void 0 ? void 0 : config.tools) {
            textAccumulator.addTools(config.tools);
        }
        if ((_a = config === null || config === void 0 ? void 0 : config.generationConfig) === null || _a === void 0 ? void 0 : _a.responseSchema) {
            textAccumulator.addSchema(config.generationConfig.responseSchema);
        }
        const texts = textAccumulator.getTexts();
        let totalTokens = 0;
        for (const text of texts) {
            const tokens = this.processor.encode(text);
            totalTokens += tokens.length;
        }
        return {
            totalTokens,
        };
    }
    /**
     * Computes detailed token information for the given content.
     *
     * @param contents The contents to tokenize
     * @return A ComputeTokensResult containing token IDs, bytes, and roles
     *
     * @example
     * ```typescript
     * const tokenizer = new LocalTokenizer('gemini-2.0-flash-001', platform);
     * const result = await tokenizer.computeTokens("What is your name?");
     * console.log(result.tokensInfo);
     * // [{tokenIds: [279, 329, 1313, 2508, 13], tokens: [' What', ' is', ...], role: 'user'}]
     * ```
     */
    async computeTokens(contents) {
        await this.ensureProcessor();
        const processedContents = tContents(contents);
        const tokensInfo = [];
        for (const content of processedContents) {
            const textAccumulator = new TextsAccumulator();
            textAccumulator.addContent(content);
            const texts = textAccumulator.getTexts();
            const allTokenIds = [];
            const allTokens = [];
            for (const text of texts) {
                const tokens = this.processor.encode(text);
                allTokenIds.push(...tokens.map((t) => t.id));
                allTokens.push(...tokens.map((t) => this.tokenTextToBase64(t.text)));
            }
            if (allTokenIds.length > 0) {
                tokensInfo.push({
                    tokenIds: allTokenIds.map((id) => id.toString()),
                    tokens: allTokens,
                    role: content.role,
                });
            }
        }
        return {
            tokensInfo,
        };
    }
    tokenTextToBase64(text) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text.replace(/▁/g, ' '));
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
};

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Node.js implementation of tokenizer cache using the file system.
 */
class NodeTokenizerCache {
    constructor() {
        this.cacheDir = path.join(os.tmpdir(), 'vertexai_tokenizer_model');
    }
    async load(cacheKey, expectedHash) {
        const filePath = path.join(this.cacheDir, cacheKey);
        try {
            const data = await fs.readFile(filePath);
            const hash = crypto.createHash('sha256').update(data).digest('hex');
            if (hash === expectedHash) {
                return new Uint8Array(data);
            }
            await this.removeFile(filePath);
            return null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            return null;
        }
    }
    async save(cacheKey, data) {
        const filePath = path.join(this.cacheDir, cacheKey);
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
            const tmpPath = `${this.cacheDir}.${crypto.randomUUID()}.tmp`;
            await fs.writeFile(tmpPath, data);
            await fs.rename(tmpPath, filePath);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            // Cache is optional, so errors are silently ignored
        }
    }
    async removeFile(filePath) {
        try {
            await fs.unlink(filePath);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            // Cache is optional, so errors are silently ignored
        }
    }
}
/**
 * Node.js implementation of tokenizer file system operations.
 */
class NodeTokenizerFileSystem {
    async fetchFromUrl(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch tokenizer model from ${url}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    }
    async validateHash(data, expectedHash) {
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        return hash === expectedHash;
    }
    async computeSha1(text) {
        const hash = crypto.createHash('sha1').update(text).digest('hex');
        return hash;
    }
}
/**
 * Node.js platform implementation for tokenizer.
 */
class NodeTokenizerPlatform {
    constructor() {
        this.cache = new NodeTokenizerCache();
        this.fileSystem = new NodeTokenizerFileSystem();
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Node.js-specific LocalTokenizer implementation.
 *
 * This wrapper automatically uses the Node.js platform (filesystem caching, crypto hashing)
 * without requiring users to manually create a platform instance.
 */
/**
 * LocalTokenizer for Node.js environment.
 *
 * Provides local tokenization for Gemini models without requiring API calls.
 * Automatically uses Node.js platform (filesystem caching in temp directory).
 *
 * @example
 * ```typescript
 * import {LocalTokenizer} from '@google/genai/node';
 *
 * const tokenizer = new LocalTokenizer('gemini-2.0-flash-001');
 * const result = await tokenizer.countTokens("What is your name?");
 * console.log(result.totalTokens); // 5
 * ```
 *
 * @experimental This API is experimental and may change in future versions.
 */
class LocalTokenizer {
    /**
     * Creates a new LocalTokenizer for Node.js.
     *
     * @param modelName Gemini model name (e.g., 'gemini-2.0-flash-001')
     */
    constructor(modelName) {
        const platform = new NodeTokenizerPlatform();
        this.baseTokenizer = new LocalTokenizer$1(modelName, platform);
    }
    /**
     * Counts the number of tokens in the given content.
     *
     * @param contents The contents to tokenize
     * @param config Optional configuration for counting tokens
     * @return A CountTokensResult containing the total number of tokens
     */
    async countTokens(contents, config) {
        return this.baseTokenizer.countTokens(contents, config);
    }
    /**
     * Computes detailed token information for the given content.
     *
     * @param contents The contents to tokenize
     * @return A ComputeTokensResult containing token IDs, bytes, and roles
     */
    async computeTokens(contents) {
        return this.baseTokenizer.computeTokens(contents);
    }
}

export { LocalTokenizer };
//# sourceMappingURL=node.mjs.map
