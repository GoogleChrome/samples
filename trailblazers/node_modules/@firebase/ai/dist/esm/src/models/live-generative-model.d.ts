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
import { AIModel } from './ai-model';
import { LiveSession } from '../methods/live-session';
import { AI, Content, LiveGenerationConfig, LiveModelParams, Tool, ToolConfig } from '../public-types';
import { WebSocketHandler } from '../websocket';
/**
 * Class for Live generative model APIs. The Live API enables low-latency, two-way multimodal
 * interactions with Gemini.
 *
 * This class should only be instantiated with {@link getLiveGenerativeModel}.
 *
 * @beta
 */
export declare class LiveGenerativeModel extends AIModel {
    /**
     * @internal
     */
    private _webSocketHandler;
    generationConfig: LiveGenerationConfig;
    tools?: Tool[];
    toolConfig?: ToolConfig;
    systemInstruction?: Content;
    /**
     * @internal
     */
    constructor(ai: AI, modelParams: LiveModelParams, 
    /**
     * @internal
     */
    _webSocketHandler: WebSocketHandler);
    /**
     * Starts a {@link LiveSession}.
     *
     * @returns A {@link LiveSession}.
     * @throws If the connection failed to be established with the server.
     *
     * @beta
     */
    connect(): Promise<LiveSession>;
}
