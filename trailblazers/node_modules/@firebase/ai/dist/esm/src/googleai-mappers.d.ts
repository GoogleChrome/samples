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
import { CountTokensRequest, GenerateContentCandidate, GenerateContentRequest, GenerateContentResponse, PromptFeedback } from './types';
import { GoogleAIGenerateContentResponse, GoogleAIGenerateContentCandidate, GoogleAICountTokensRequest } from './types/googleai';
/**
 * This SDK supports both the Vertex AI Gemini API and the Gemini Developer API (using Google AI).
 * The public API prioritizes the format used by the Vertex AI Gemini API.
 * We avoid having two sets of types by translating requests and responses between the two API formats.
 * This translation allows developers to switch between the Vertex AI Gemini API and the Gemini Developer API
 * with minimal code changes.
 *
 * In here are functions that map requests and responses between the two API formats.
 * Requests in the Vertex AI format are mapped to the Google AI format before being sent.
 * Responses from the Google AI backend are mapped back to the Vertex AI format before being returned to the user.
 */
/**
 * Maps a Vertex AI {@link GenerateContentRequest} to a format that can be sent to Google AI.
 *
 * @param generateContentRequest The {@link GenerateContentRequest} to map.
 * @returns A {@link GenerateContentResponse} that conforms to the Google AI format.
 *
 * @throws If the request contains properties that are unsupported by Google AI.
 *
 * @internal
 */
export declare function mapGenerateContentRequest(generateContentRequest: GenerateContentRequest): GenerateContentRequest;
/**
 * Maps a {@link GenerateContentResponse} from Google AI to the format of the
 * {@link GenerateContentResponse} that we get from VertexAI that is exposed in the public API.
 *
 * @param googleAIResponse The {@link GenerateContentResponse} from Google AI.
 * @returns A {@link GenerateContentResponse} that conforms to the public API's format.
 *
 * @internal
 */
export declare function mapGenerateContentResponse(googleAIResponse: GoogleAIGenerateContentResponse): GenerateContentResponse;
/**
 * Maps a Vertex AI {@link CountTokensRequest} to a format that can be sent to Google AI.
 *
 * @param countTokensRequest The {@link CountTokensRequest} to map.
 * @param model The model to count tokens with.
 * @returns A {@link CountTokensRequest} that conforms to the Google AI format.
 *
 * @internal
 */
export declare function mapCountTokensRequest(countTokensRequest: CountTokensRequest, model: string): GoogleAICountTokensRequest;
/**
 * Maps a Google AI {@link GoogleAIGenerateContentCandidate} to a format that conforms
 * to the Vertex AI API format.
 *
 * @param candidates The {@link GoogleAIGenerateContentCandidate} to map.
 * @returns A {@link GenerateContentCandidate} that conforms to the Vertex AI format.
 *
 * @throws If any {@link Part} in the candidates has a `videoMetadata` property.
 *
 * @internal
 */
export declare function mapGenerateContentCandidates(candidates: GoogleAIGenerateContentCandidate[]): GenerateContentCandidate[];
export declare function mapPromptFeedback(promptFeedback: PromptFeedback): PromptFeedback;
