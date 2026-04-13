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
import { Content, FunctionCall, FunctionResponsePart, GenerateContentRequest, GenerateContentResponse, GenerateContentResult, GenerateContentStreamResult, Part, RequestOptions, SingleRequestOptions, StartChatParams } from '../types';
import { ApiSettings } from '../types/internal';
import { ChromeAdapter } from '../types/chrome-adapter';
/**
 * ChatSession class that enables sending chat messages and stores
 * history of sent and received messages so far.
 *
 * @public
 */
export declare class ChatSession {
    model: string;
    private chromeAdapter?;
    params?: StartChatParams | undefined;
    requestOptions?: RequestOptions | undefined;
    private _apiSettings;
    private _history;
    /**
     * Ensures sequential execution of chat messages to maintain history order.
     * Each call waits for the previous one to settle before proceeding.
     */
    private _sendPromise;
    constructor(apiSettings: ApiSettings, model: string, chromeAdapter?: ChromeAdapter | undefined, params?: StartChatParams | undefined, requestOptions?: RequestOptions | undefined);
    /**
     * Gets the chat history so far. Blocked prompts are not added to history.
     * Neither blocked candidates nor the prompts that generated them are added
     * to history.
     */
    getHistory(): Promise<Content[]>;
    /**
     * Format Content into a request for generateContent or
     * generateContentStream.
     * @internal
     */
    _formatRequest(incomingContent: Content, tempHistory: Content[]): GenerateContentRequest;
    /**
     * Sends a chat message and receives a non-streaming
     * {@link GenerateContentResult}
     */
    sendMessage(request: string | Array<string | Part>, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentResult>;
    /**
     * Sends a chat message and receives the response as a
     * {@link GenerateContentStreamResult} containing an iterable stream
     * and a response promise.
     */
    sendMessageStream(request: string | Array<string | Part>, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentStreamResult>;
    /**
     * Get function calls that the SDK has references to actually call.
     * This is all-or-nothing. If the model is requesting multiple
     * function calls, all of them must have references in order for
     * automatic function calling to work.
     *
     * @internal
     */
    _getCallableFunctionCalls(response?: GenerateContentResponse): FunctionCall[] | undefined;
    /**
     * Call user-defined functions if requested by the model, and return
     * the response that should be sent to the model.
     * @internal
     */
    _callFunctionsAsNeeded(functionCalls: FunctionCall[]): Promise<FunctionResponsePart[]>;
}
