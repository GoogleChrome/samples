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
import { Content, CountTokensRequest, CountTokensResponse, GenerateContentRequest, GenerateContentResult, GenerateContentStreamResult, GenerationConfig, ModelParams, Part, SafetySetting, RequestOptions, StartChatParams, Tool, ToolConfig, SingleRequestOptions } from '../types';
import { ChatSession } from '../methods/chat-session';
import { AI } from '../public-types';
import { AIModel } from './ai-model';
import { ChromeAdapter } from '../types/chrome-adapter';
/**
 * Class for generative model APIs.
 * @public
 */
export declare class GenerativeModel extends AIModel {
    private chromeAdapter?;
    generationConfig: GenerationConfig;
    safetySettings: SafetySetting[];
    requestOptions?: RequestOptions;
    tools?: Tool[];
    toolConfig?: ToolConfig;
    systemInstruction?: Content;
    constructor(ai: AI, modelParams: ModelParams, requestOptions?: RequestOptions, chromeAdapter?: ChromeAdapter | undefined);
    /**
     * Makes a single non-streaming call to the model
     * and returns an object containing a single {@link GenerateContentResponse}.
     */
    generateContent(request: GenerateContentRequest | string | Array<string | Part>, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentResult>;
    /**
     * Makes a single streaming call to the model
     * and returns an object containing an iterable stream that iterates
     * over all chunks in the streaming response as well as
     * a promise that returns the final aggregated response.
     */
    generateContentStream(request: GenerateContentRequest | string | Array<string | Part>, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentStreamResult>;
    /**
     * Gets a new {@link ChatSession} instance which can be used for
     * multi-turn chats.
     */
    startChat(startChatParams?: StartChatParams): ChatSession;
    /**
     * Counts the tokens in the provided request.
     */
    countTokens(request: CountTokensRequest | string | Array<string | Part>, singleRequestOptions?: SingleRequestOptions): Promise<CountTokensResponse>;
}
