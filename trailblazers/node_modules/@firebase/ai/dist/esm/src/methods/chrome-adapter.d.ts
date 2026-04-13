/**
 * @license
 * Copyright 2025 Google LLC
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
import { CountTokensRequest, GenerateContentRequest, InferenceMode, OnDeviceParams } from '../types';
import { ChromeAdapter } from '../types/chrome-adapter';
import { LanguageModel } from '../types/language-model';
/**
 * Defines an inference "backend" that uses Chrome's on-device model,
 * and encapsulates logic for detecting when on-device inference is
 * possible.
 */
export declare class ChromeAdapterImpl implements ChromeAdapter {
    languageModelProvider: LanguageModel;
    mode: InferenceMode;
    static SUPPORTED_MIME_TYPES: string[];
    private isDownloading;
    private downloadPromise;
    private oldSession;
    onDeviceParams: OnDeviceParams;
    constructor(languageModelProvider: LanguageModel, mode: InferenceMode, onDeviceParams?: OnDeviceParams);
    /**
     * Checks if a given request can be made on-device.
     *
     * Encapsulates a few concerns:
     *   the mode
     *   API existence
     *   prompt formatting
     *   model availability, including triggering download if necessary
     *
     *
     * Pros: callers needn't be concerned with details of on-device availability.</p>
     * Cons: this method spans a few concerns and splits request validation from usage.
     * If instance variables weren't already part of the API, we could consider a better
     * separation of concerns.
     */
    isAvailable(request: GenerateContentRequest): Promise<boolean>;
    /**
     * Generates content on device.
     *
     * @remarks
     * This is comparable to {@link GenerativeModel.generateContent} for generating content in
     * Cloud.
     * @param request - a standard Firebase AI {@link GenerateContentRequest}
     * @returns {@link Response}, so we can reuse common response formatting.
     */
    generateContent(request: GenerateContentRequest): Promise<Response>;
    /**
     * Generates content stream on device.
     *
     * @remarks
     * This is comparable to {@link GenerativeModel.generateContentStream} for generating content in
     * Cloud.
     * @param request - a standard Firebase AI {@link GenerateContentRequest}
     * @returns {@link Response}, so we can reuse common response formatting.
     */
    generateContentStream(request: GenerateContentRequest): Promise<Response>;
    countTokens(_request: CountTokensRequest): Promise<Response>;
    /**
     * Asserts inference for the given request can be performed by an on-device model.
     */
    private static isOnDeviceRequest;
    /**
     * Encapsulates logic to get availability and download a model if one is downloadable.
     */
    private downloadIfAvailable;
    /**
     * Triggers out-of-band download of an on-device model.
     *
     * Chrome only downloads models as needed. Chrome knows a model is needed when code calls
     * LanguageModel.create.
     *
     * Since Chrome manages the download, the SDK can only avoid redundant download requests by
     * tracking if a download has previously been requested.
     */
    private download;
    /**
     * Converts Firebase AI {@link Content} object to a Chrome {@link LanguageModelMessage} object.
     */
    private static toLanguageModelMessage;
    /**
     * Converts a Firebase AI Part object to a Chrome LanguageModelMessageContent object.
     */
    private static toLanguageModelMessageContent;
    /**
     * Converts a Firebase AI {@link Role} string to a {@link LanguageModelMessageRole} string.
     */
    private static toLanguageModelMessageRole;
    /**
     * Abstracts Chrome session creation.
     *
     * Chrome uses a multi-turn session for all inference. Firebase AI uses single-turn for all
     * inference. To map the Firebase AI API to Chrome's API, the SDK creates a new session for all
     * inference.
     *
     * Chrome will remove a model from memory if it's no longer in use, so this method ensures a
     * new session is created before an old session is destroyed.
     */
    private createSession;
    /**
     * Formats string returned by Chrome as a {@link Response} returned by Firebase AI.
     */
    private static toResponse;
    /**
     * Formats string stream returned by Chrome as SSE returned by Firebase AI.
     */
    private static toStreamResponse;
}
/**
 * Creates a ChromeAdapterImpl on demand.
 */
export declare function chromeAdapterFactory(mode: InferenceMode, window?: Window, params?: OnDeviceParams): ChromeAdapterImpl | undefined;
