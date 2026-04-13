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
import { SingleRequestOptions } from '../types';
import { ApiSettings } from '../types/internal';
export declare const TIMEOUT_EXPIRED_MESSAGE = "Timeout has expired.";
export declare const ABORT_ERROR_NAME = "AbortError";
export declare const enum Task {
    GENERATE_CONTENT = "generateContent",
    STREAM_GENERATE_CONTENT = "streamGenerateContent",
    COUNT_TOKENS = "countTokens",
    PREDICT = "predict"
}
export declare const enum ServerPromptTemplateTask {
    TEMPLATE_GENERATE_CONTENT = "templateGenerateContent",
    TEMPLATE_STREAM_GENERATE_CONTENT = "templateStreamGenerateContent",
    TEMPLATE_PREDICT = "templatePredict"
}
interface BaseRequestURLParams {
    apiSettings: ApiSettings;
    stream: boolean;
    singleRequestOptions?: SingleRequestOptions;
}
/**
 * Parameters used to construct the URL of a request to use a model.
 */
interface ModelRequestURLParams extends BaseRequestURLParams {
    task: Task;
    model: string;
    templateId?: never;
}
/**
 * Parameters used to construct the URL of a request to use server side prompt templates.
 */
interface TemplateRequestURLParams extends BaseRequestURLParams {
    task: ServerPromptTemplateTask;
    templateId: string;
    model?: never;
}
export declare class RequestURL {
    readonly params: ModelRequestURLParams | TemplateRequestURLParams;
    constructor(params: ModelRequestURLParams | TemplateRequestURLParams);
    toString(): string;
    private get pathname();
    private get baseUrl();
    private get queryParams();
}
export declare class WebSocketUrl {
    apiSettings: ApiSettings;
    constructor(apiSettings: ApiSettings);
    toString(): string;
    private get pathname();
}
export declare function getHeaders(url: RequestURL): Promise<Headers>;
export declare function makeRequest(requestUrlParams: TemplateRequestURLParams | ModelRequestURLParams, body: string): Promise<Response>;
export {};
