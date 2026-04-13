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
import { FirebaseApp } from '@firebase/app';
import { AI_TYPE } from './constants';
import { AIService } from './service';
import { AI, AIOptions } from './public-types';
import { ImagenModelParams, HybridParams, ModelParams, RequestOptions, LiveModelParams } from './types';
import { AIError } from './errors';
import { AIModel, GenerativeModel, LiveGenerativeModel, ImagenModel } from './models';
import { TemplateGenerativeModel } from './models/template-generative-model';
import { TemplateImagenModel } from './models/template-imagen-model';
export { ChatSession } from './methods/chat-session';
export { LiveSession } from './methods/live-session';
export * from './requests/schema-builder';
export { ImagenImageFormat } from './requests/imagen-image-format';
export { AIModel, GenerativeModel, LiveGenerativeModel, ImagenModel, TemplateGenerativeModel, TemplateImagenModel, AIError };
export { Backend, VertexAIBackend, GoogleAIBackend } from './backend';
export { startAudioConversation, AudioConversationController, StartAudioConversationOptions } from './methods/live-session-helpers';
declare module '@firebase/component' {
    interface NameServiceMapping {
        [AI_TYPE]: AIService;
    }
}
/**
 * Returns the default {@link AI} instance that is associated with the provided
 * {@link @firebase/app#FirebaseApp}. If no instance exists, initializes a new instance with the
 * default settings.
 *
 * @example
 * ```javascript
 * const ai = getAI(app);
 * ```
 *
 * @example
 * ```javascript
 * // Get an AI instance configured to use the Gemini Developer API (via Google AI).
 * const ai = getAI(app, { backend: new GoogleAIBackend() });
 * ```
 *
 * @example
 * ```javascript
 * // Get an AI instance configured to use the Vertex AI Gemini API.
 * const ai = getAI(app, { backend: new VertexAIBackend() });
 * ```
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 * @param options - {@link AIOptions} that configure the AI instance.
 * @returns The default {@link AI} instance for the given {@link @firebase/app#FirebaseApp}.
 *
 * @public
 */
export declare function getAI(app?: FirebaseApp, options?: AIOptions): AI;
/**
 * Returns a {@link GenerativeModel} class with methods for inference
 * and other functionality.
 *
 * @public
 */
export declare function getGenerativeModel(ai: AI, modelParams: ModelParams | HybridParams, requestOptions?: RequestOptions): GenerativeModel;
/**
 * Returns an {@link ImagenModel} class with methods for using Imagen.
 *
 * Only Imagen 3 models (named `imagen-3.0-*`) are supported.
 *
 * @param ai - An {@link AI} instance.
 * @param modelParams - Parameters to use when making Imagen requests.
 * @param requestOptions - Additional options to use when making requests.
 *
 * @throws If the `apiKey` or `projectId` fields are missing in your
 * Firebase config.
 *
 * @public
 */
export declare function getImagenModel(ai: AI, modelParams: ImagenModelParams, requestOptions?: RequestOptions): ImagenModel;
/**
 * Returns a {@link LiveGenerativeModel} class for real-time, bidirectional communication.
 *
 * The Live API is only supported in modern browser windows and Node >= 22.
 *
 * @param ai - An {@link AI} instance.
 * @param modelParams - Parameters to use when setting up a {@link LiveSession}.
 * @throws If the `apiKey` or `projectId` fields are missing in your
 * Firebase config.
 *
 * @beta
 */
export declare function getLiveGenerativeModel(ai: AI, modelParams: LiveModelParams): LiveGenerativeModel;
/**
 * Returns a {@link TemplateGenerativeModel} class for executing server-side
 * templates.
 *
 * @param ai - An {@link AI} instance.
 * @param requestOptions - Additional options to use when making requests.
 *
 * @beta
 */
export declare function getTemplateGenerativeModel(ai: AI, requestOptions?: RequestOptions): TemplateGenerativeModel;
/**
 * Returns a {@link TemplateImagenModel} class for executing server-side
 * Imagen templates.
 *
 * @param ai - An {@link AI} instance.
 * @param requestOptions - Additional options to use when making requests.
 *
 * @beta
 */
export declare function getTemplateImagenModel(ai: AI, requestOptions?: RequestOptions): TemplateImagenModel;
