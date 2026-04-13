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
import { EnhancedGenerateContentResponse, FunctionCall, GenerateContentResponse, ImagenGCSImage, ImagenInlineImage, InlineDataPart, Part, InferenceSource } from '../types';
/**
 * Creates an EnhancedGenerateContentResponse object that has helper functions and
 * other modifications that improve usability.
 */
export declare function createEnhancedContentResponse(response: GenerateContentResponse, inferenceSource?: InferenceSource): EnhancedGenerateContentResponse;
/**
 * Adds convenience helper methods to a response object, including stream
 * chunks (as long as each chunk is a complete GenerateContentResponse JSON).
 */
export declare function addHelpers(response: GenerateContentResponse): EnhancedGenerateContentResponse;
/**
 * Returns all text from the first candidate's parts, filtering by whether
 * `partFilter()` returns true.
 *
 * @param response - The `GenerateContentResponse` from which to extract text.
 * @param partFilter - Only return `Part`s for which this returns true
 */
export declare function getText(response: GenerateContentResponse, partFilter: (part: Part) => boolean): string;
/**
 * Returns every {@link FunctionCall} associated with first candidate.
 */
export declare function getFunctionCalls(response?: GenerateContentResponse): FunctionCall[] | undefined;
/**
 * Returns every {@link InlineDataPart} in the first candidate if present.
 *
 * @internal
 */
export declare function getInlineDataParts(response: GenerateContentResponse): InlineDataPart[] | undefined;
export declare function formatBlockErrorMessage(response: GenerateContentResponse): string;
/**
 * Convert a generic successful fetch response body to an Imagen response object
 * that can be returned to the user. This converts the REST APIs response format to our
 * APIs representation of a response.
 *
 * @internal
 */
export declare function handlePredictResponse<T extends ImagenInlineImage | ImagenGCSImage>(response: Response): Promise<{
    images: T[];
    filteredReason?: string;
}>;
