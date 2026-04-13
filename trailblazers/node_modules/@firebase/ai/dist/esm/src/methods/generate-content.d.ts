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
import { GenerateContentRequest, GenerateContentResponse, GenerateContentResult, GenerateContentStreamResult, SingleRequestOptions } from '../types';
import { ApiSettings } from '../types/internal';
import { ChromeAdapter } from '../types/chrome-adapter';
export declare function generateContentStream(apiSettings: ApiSettings, model: string, params: GenerateContentRequest, chromeAdapter?: ChromeAdapter, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentStreamResult & {
    firstValue?: GenerateContentResponse;
}>;
export declare function templateGenerateContent(apiSettings: ApiSettings, templateId: string, templateParams: object, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentResult>;
export declare function templateGenerateContentStream(apiSettings: ApiSettings, templateId: string, templateParams: object, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentStreamResult>;
export declare function generateContent(apiSettings: ApiSettings, model: string, params: GenerateContentRequest, chromeAdapter?: ChromeAdapter, singleRequestOptions?: SingleRequestOptions): Promise<GenerateContentResult>;
