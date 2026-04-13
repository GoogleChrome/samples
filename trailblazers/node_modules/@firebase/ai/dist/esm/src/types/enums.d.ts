/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Role is the producer of the content.
 * @public
 */
export type Role = (typeof POSSIBLE_ROLES)[number];
/**
 * Possible roles.
 * @public
 */
export declare const POSSIBLE_ROLES: readonly ["user", "model", "function", "system"];
/**
 * Harm categories that would cause prompts or candidates to be blocked.
 * @public
 */
export declare const HarmCategory: {
    readonly HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH";
    readonly HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT";
    readonly HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT";
    readonly HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT";
};
/**
 * Harm categories that would cause prompts or candidates to be blocked.
 * @public
 */
export type HarmCategory = (typeof HarmCategory)[keyof typeof HarmCategory];
/**
 * Threshold above which a prompt or candidate will be blocked.
 * @public
 */
export declare const HarmBlockThreshold: {
    /**
     * Content with `NEGLIGIBLE` will be allowed.
     */
    readonly BLOCK_LOW_AND_ABOVE: "BLOCK_LOW_AND_ABOVE";
    /**
     * Content with `NEGLIGIBLE` and `LOW` will be allowed.
     */
    readonly BLOCK_MEDIUM_AND_ABOVE: "BLOCK_MEDIUM_AND_ABOVE";
    /**
     * Content with `NEGLIGIBLE`, `LOW`, and `MEDIUM` will be allowed.
     */
    readonly BLOCK_ONLY_HIGH: "BLOCK_ONLY_HIGH";
    /**
     * All content will be allowed.
     */
    readonly BLOCK_NONE: "BLOCK_NONE";
    /**
     * All content will be allowed. This is the same as `BLOCK_NONE`, but the metadata corresponding
     * to the {@link (HarmCategory:type)} will not be present in the response.
     */
    readonly OFF: "OFF";
};
/**
 * Threshold above which a prompt or candidate will be blocked.
 * @public
 */
export type HarmBlockThreshold = (typeof HarmBlockThreshold)[keyof typeof HarmBlockThreshold];
/**
 * This property is not supported in the Gemini Developer API ({@link GoogleAIBackend}).
 *
 * @public
 */
export declare const HarmBlockMethod: {
    /**
     * The harm block method uses both probability and severity scores.
     */
    readonly SEVERITY: "SEVERITY";
    /**
     * The harm block method uses the probability score.
     */
    readonly PROBABILITY: "PROBABILITY";
};
/**
 * This property is not supported in the Gemini Developer API ({@link GoogleAIBackend}).
 *
 * @public
 */
export type HarmBlockMethod = (typeof HarmBlockMethod)[keyof typeof HarmBlockMethod];
/**
 * Probability that a prompt or candidate matches a harm category.
 * @public
 */
export declare const HarmProbability: {
    /**
     * Content has a negligible chance of being unsafe.
     */
    readonly NEGLIGIBLE: "NEGLIGIBLE";
    /**
     * Content has a low chance of being unsafe.
     */
    readonly LOW: "LOW";
    /**
     * Content has a medium chance of being unsafe.
     */
    readonly MEDIUM: "MEDIUM";
    /**
     * Content has a high chance of being unsafe.
     */
    readonly HIGH: "HIGH";
};
/**
 * Probability that a prompt or candidate matches a harm category.
 * @public
 */
export type HarmProbability = (typeof HarmProbability)[keyof typeof HarmProbability];
/**
 * Harm severity levels.
 * @public
 */
export declare const HarmSeverity: {
    /**
     * Negligible level of harm severity.
     */
    readonly HARM_SEVERITY_NEGLIGIBLE: "HARM_SEVERITY_NEGLIGIBLE";
    /**
     * Low level of harm severity.
     */
    readonly HARM_SEVERITY_LOW: "HARM_SEVERITY_LOW";
    /**
     * Medium level of harm severity.
     */
    readonly HARM_SEVERITY_MEDIUM: "HARM_SEVERITY_MEDIUM";
    /**
     * High level of harm severity.
     */
    readonly HARM_SEVERITY_HIGH: "HARM_SEVERITY_HIGH";
    /**
     * Harm severity is not supported.
     *
     * @remarks
     * The GoogleAI backend does not support `HarmSeverity`, so this value is used as a fallback.
     */
    readonly HARM_SEVERITY_UNSUPPORTED: "HARM_SEVERITY_UNSUPPORTED";
};
/**
 * Harm severity levels.
 * @public
 */
export type HarmSeverity = (typeof HarmSeverity)[keyof typeof HarmSeverity];
/**
 * Reason that a prompt was blocked.
 * @public
 */
export declare const BlockReason: {
    /**
     * Content was blocked by safety settings.
     */
    readonly SAFETY: "SAFETY";
    /**
     * Content was blocked, but the reason is uncategorized.
     */
    readonly OTHER: "OTHER";
    /**
     * Content was blocked because it contained terms from the terminology blocklist.
     */
    readonly BLOCKLIST: "BLOCKLIST";
    /**
     * Content was blocked due to prohibited content.
     */
    readonly PROHIBITED_CONTENT: "PROHIBITED_CONTENT";
};
/**
 * Reason that a prompt was blocked.
 * @public
 */
export type BlockReason = (typeof BlockReason)[keyof typeof BlockReason];
/**
 * Reason that a candidate finished.
 * @public
 */
export declare const FinishReason: {
    /**
     * Natural stop point of the model or provided stop sequence.
     */
    readonly STOP: "STOP";
    /**
     * The maximum number of tokens as specified in the request was reached.
     */
    readonly MAX_TOKENS: "MAX_TOKENS";
    /**
     * The candidate content was flagged for safety reasons.
     */
    readonly SAFETY: "SAFETY";
    /**
     * The candidate content was flagged for recitation reasons.
     */
    readonly RECITATION: "RECITATION";
    /**
     * Unknown reason.
     */
    readonly OTHER: "OTHER";
    /**
     * The candidate content contained forbidden terms.
     */
    readonly BLOCKLIST: "BLOCKLIST";
    /**
     * The candidate content potentially contained prohibited content.
     */
    readonly PROHIBITED_CONTENT: "PROHIBITED_CONTENT";
    /**
     * The candidate content potentially contained Sensitive Personally Identifiable Information (SPII).
     */
    readonly SPII: "SPII";
    /**
     * The function call generated by the model was invalid.
     */
    readonly MALFORMED_FUNCTION_CALL: "MALFORMED_FUNCTION_CALL";
};
/**
 * Reason that a candidate finished.
 * @public
 */
export type FinishReason = (typeof FinishReason)[keyof typeof FinishReason];
/**
 * @public
 */
export declare const FunctionCallingMode: {
    /**
     * Default model behavior; model decides to predict either a function call
     * or a natural language response.
     */
    readonly AUTO: "AUTO";
    /**
     * Model is constrained to always predicting a function call only.
     * If `allowed_function_names` is set, the predicted function call will be
     * limited to any one of `allowed_function_names`, else the predicted
     * function call will be any one of the provided `function_declarations`.
     */
    readonly ANY: "ANY";
    /**
     * Model will not predict any function call. Model behavior is same as when
     * not passing any function declarations.
     */
    readonly NONE: "NONE";
};
/**
 * @public
 */
export type FunctionCallingMode = (typeof FunctionCallingMode)[keyof typeof FunctionCallingMode];
/**
 * Content part modality.
 * @public
 */
export declare const Modality: {
    /**
     * Unspecified modality.
     */
    readonly MODALITY_UNSPECIFIED: "MODALITY_UNSPECIFIED";
    /**
     * Plain text.
     */
    readonly TEXT: "TEXT";
    /**
     * Image.
     */
    readonly IMAGE: "IMAGE";
    /**
     * Video.
     */
    readonly VIDEO: "VIDEO";
    /**
     * Audio.
     */
    readonly AUDIO: "AUDIO";
    /**
     * Document (for example, PDF).
     */
    readonly DOCUMENT: "DOCUMENT";
};
/**
 * Content part modality.
 * @public
 */
export type Modality = (typeof Modality)[keyof typeof Modality];
/**
 * Generation modalities to be returned in generation responses.
 *
 * @beta
 */
export declare const ResponseModality: {
    /**
     * Text.
     * @beta
     */
    readonly TEXT: "TEXT";
    /**
     * Image.
     * @beta
     */
    readonly IMAGE: "IMAGE";
    /**
     * Audio.
     * @beta
     */
    readonly AUDIO: "AUDIO";
};
/**
 * Generation modalities to be returned in generation responses.
 *
 * @beta
 */
export type ResponseModality = (typeof ResponseModality)[keyof typeof ResponseModality];
/**
 * Determines whether inference happens on-device or in-cloud.
 *
 * @remarks
 * <b>PREFER_ON_DEVICE:</b> Attempt to make inference calls using an
 * on-device model. If on-device inference is not available, the SDK
 * will fall back to using a cloud-hosted model.
 * <br/>
 * <b>ONLY_ON_DEVICE:</b> Only attempt to make inference calls using an
 * on-device model. The SDK will not fall back to a cloud-hosted model.
 * If on-device inference is not available, inference methods will throw.
 * <br/>
 * <b>ONLY_IN_CLOUD:</b> Only attempt to make inference calls using a
 * cloud-hosted model. The SDK will not fall back to an on-device model.
 * <br/>
 * <b>PREFER_IN_CLOUD:</b> Attempt to make inference calls to a
 * cloud-hosted model. If not available, the SDK will fall back to an
 * on-device model.
 *
 * @beta
 */
export declare const InferenceMode: {
    readonly PREFER_ON_DEVICE: "prefer_on_device";
    readonly ONLY_ON_DEVICE: "only_on_device";
    readonly ONLY_IN_CLOUD: "only_in_cloud";
    readonly PREFER_IN_CLOUD: "prefer_in_cloud";
};
/**
 * Determines whether inference happens on-device or in-cloud.
 *
 * @beta
 */
export type InferenceMode = (typeof InferenceMode)[keyof typeof InferenceMode];
/**
 * Indicates whether inference happened on-device or in-cloud.
 *
 * @beta
 */
export declare const InferenceSource: {
    readonly ON_DEVICE: "on_device";
    readonly IN_CLOUD: "in_cloud";
};
/**
 * Indicates whether inference happened on-device or in-cloud.
 *
 * @beta
 */
export type InferenceSource = (typeof InferenceSource)[keyof typeof InferenceSource];
/**
 * Represents the result of the code execution.
 *
 * @public
 */
export declare const Outcome: {
    UNSPECIFIED: string;
    OK: string;
    FAILED: string;
    DEADLINE_EXCEEDED: string;
};
/**
 * Represents the result of the code execution.
 *
 * @public
 */
export type Outcome = (typeof Outcome)[keyof typeof Outcome];
/**
 * The programming language of the code.
 *
 * @public
 */
export declare const Language: {
    UNSPECIFIED: string;
    PYTHON: string;
};
/**
 * The programming language of the code.
 *
 * @public
 */
export type Language = (typeof Language)[keyof typeof Language];
/**
 * A preset that controls the model's "thinking" process. Use
 * `ThinkingLevel.LOW` for faster responses on less complex tasks, and
 * `ThinkingLevel.HIGH` for better reasoning on more complex tasks.
 *
 * @public
 */
export declare const ThinkingLevel: {
    MINIMAL: string;
    LOW: string;
    MEDIUM: string;
    HIGH: string;
};
/**
 * A preset that controls the model's "thinking" process. Use
 * `ThinkingLevel.LOW` for faster responses on less complex tasks, and
 * `ThinkingLevel.HIGH` for better reasoning on more complex tasks.
 *
 * @public
 */
export type ThinkingLevel = (typeof ThinkingLevel)[keyof typeof ThinkingLevel];
