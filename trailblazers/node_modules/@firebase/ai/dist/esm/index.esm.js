import { _isFirebaseServerApp, _getProvider, getApp, _registerComponent, registerVersion } from '@firebase/app';
import { Component } from '@firebase/component';
import { FirebaseError, Deferred, getModularInstance } from '@firebase/util';
import { Logger } from '@firebase/logger';

var name = "@firebase/ai";
var version = "2.10.0";

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
const AI_TYPE = 'AI';
const DEFAULT_LOCATION = 'us-central1';
const DEFAULT_DOMAIN = 'firebasevertexai.googleapis.com';
const DEFAULT_API_VERSION = 'v1beta';
const PACKAGE_VERSION = version;
const LANGUAGE_TAG = 'gl-js';
const HYBRID_TAG = 'hybrid';
const DEFAULT_FETCH_TIMEOUT_MS = 180 * 1000;
/**
 * Defines the name of the default in-cloud model to use for hybrid inference.
 */
const DEFAULT_HYBRID_IN_CLOUD_MODEL = 'gemini-2.5-flash-lite';

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
 * Error class for the Firebase AI SDK.
 *
 * @public
 */
class AIError extends FirebaseError {
    /**
     * Constructs a new instance of the `AIError` class.
     *
     * @param code - The error code from {@link (AIErrorCode:type)}.
     * @param message - A human-readable message describing the error.
     * @param customErrorData - Optional error data.
     */
    constructor(code, message, customErrorData) {
        // Match error format used by FirebaseError from ErrorFactory
        const service = AI_TYPE;
        const fullCode = `${service}/${code}`;
        const fullMessage = `${service}: ${message} (${fullCode})`;
        super(code, fullMessage);
        this.code = code;
        this.customErrorData = customErrorData;
        // FirebaseError initializes a stack trace, but it assumes the error is created from the error
        // factory. Since we break this assumption, we set the stack trace to be originating from this
        // constructor.
        // This is only supported in V8.
        if (Error.captureStackTrace) {
            // Allows us to initialize the stack trace without including the constructor itself at the
            // top level of the stack trace.
            Error.captureStackTrace(this, AIError);
        }
        // Allows instanceof AIError in ES5/ES6
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // TODO(dlarocque): Replace this with `new.target`: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
        //                   which we can now use since we no longer target ES5.
        Object.setPrototypeOf(this, AIError.prototype);
        // Since Error is an interface, we don't inherit toString and so we define it ourselves.
        this.toString = () => fullMessage;
    }
}

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
 * Possible roles.
 * @public
 */
const POSSIBLE_ROLES = ['user', 'model', 'function', 'system'];
/**
 * Harm categories that would cause prompts or candidates to be blocked.
 * @public
 */
const HarmCategory = {
    HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
    HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
    HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT'
};
/**
 * Threshold above which a prompt or candidate will be blocked.
 * @public
 */
const HarmBlockThreshold = {
    /**
     * Content with `NEGLIGIBLE` will be allowed.
     */
    BLOCK_LOW_AND_ABOVE: 'BLOCK_LOW_AND_ABOVE',
    /**
     * Content with `NEGLIGIBLE` and `LOW` will be allowed.
     */
    BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE',
    /**
     * Content with `NEGLIGIBLE`, `LOW`, and `MEDIUM` will be allowed.
     */
    BLOCK_ONLY_HIGH: 'BLOCK_ONLY_HIGH',
    /**
     * All content will be allowed.
     */
    BLOCK_NONE: 'BLOCK_NONE',
    /**
     * All content will be allowed. This is the same as `BLOCK_NONE`, but the metadata corresponding
     * to the {@link (HarmCategory:type)} will not be present in the response.
     */
    OFF: 'OFF'
};
/**
 * This property is not supported in the Gemini Developer API ({@link GoogleAIBackend}).
 *
 * @public
 */
const HarmBlockMethod = {
    /**
     * The harm block method uses both probability and severity scores.
     */
    SEVERITY: 'SEVERITY',
    /**
     * The harm block method uses the probability score.
     */
    PROBABILITY: 'PROBABILITY'
};
/**
 * Probability that a prompt or candidate matches a harm category.
 * @public
 */
const HarmProbability = {
    /**
     * Content has a negligible chance of being unsafe.
     */
    NEGLIGIBLE: 'NEGLIGIBLE',
    /**
     * Content has a low chance of being unsafe.
     */
    LOW: 'LOW',
    /**
     * Content has a medium chance of being unsafe.
     */
    MEDIUM: 'MEDIUM',
    /**
     * Content has a high chance of being unsafe.
     */
    HIGH: 'HIGH'
};
/**
 * Harm severity levels.
 * @public
 */
const HarmSeverity = {
    /**
     * Negligible level of harm severity.
     */
    HARM_SEVERITY_NEGLIGIBLE: 'HARM_SEVERITY_NEGLIGIBLE',
    /**
     * Low level of harm severity.
     */
    HARM_SEVERITY_LOW: 'HARM_SEVERITY_LOW',
    /**
     * Medium level of harm severity.
     */
    HARM_SEVERITY_MEDIUM: 'HARM_SEVERITY_MEDIUM',
    /**
     * High level of harm severity.
     */
    HARM_SEVERITY_HIGH: 'HARM_SEVERITY_HIGH',
    /**
     * Harm severity is not supported.
     *
     * @remarks
     * The GoogleAI backend does not support `HarmSeverity`, so this value is used as a fallback.
     */
    HARM_SEVERITY_UNSUPPORTED: 'HARM_SEVERITY_UNSUPPORTED'
};
/**
 * Reason that a prompt was blocked.
 * @public
 */
const BlockReason = {
    /**
     * Content was blocked by safety settings.
     */
    SAFETY: 'SAFETY',
    /**
     * Content was blocked, but the reason is uncategorized.
     */
    OTHER: 'OTHER',
    /**
     * Content was blocked because it contained terms from the terminology blocklist.
     */
    BLOCKLIST: 'BLOCKLIST',
    /**
     * Content was blocked due to prohibited content.
     */
    PROHIBITED_CONTENT: 'PROHIBITED_CONTENT'
};
/**
 * Reason that a candidate finished.
 * @public
 */
const FinishReason = {
    /**
     * Natural stop point of the model or provided stop sequence.
     */
    STOP: 'STOP',
    /**
     * The maximum number of tokens as specified in the request was reached.
     */
    MAX_TOKENS: 'MAX_TOKENS',
    /**
     * The candidate content was flagged for safety reasons.
     */
    SAFETY: 'SAFETY',
    /**
     * The candidate content was flagged for recitation reasons.
     */
    RECITATION: 'RECITATION',
    /**
     * Unknown reason.
     */
    OTHER: 'OTHER',
    /**
     * The candidate content contained forbidden terms.
     */
    BLOCKLIST: 'BLOCKLIST',
    /**
     * The candidate content potentially contained prohibited content.
     */
    PROHIBITED_CONTENT: 'PROHIBITED_CONTENT',
    /**
     * The candidate content potentially contained Sensitive Personally Identifiable Information (SPII).
     */
    SPII: 'SPII',
    /**
     * The function call generated by the model was invalid.
     */
    MALFORMED_FUNCTION_CALL: 'MALFORMED_FUNCTION_CALL'
};
/**
 * @public
 */
const FunctionCallingMode = {
    /**
     * Default model behavior; model decides to predict either a function call
     * or a natural language response.
     */
    AUTO: 'AUTO',
    /**
     * Model is constrained to always predicting a function call only.
     * If `allowed_function_names` is set, the predicted function call will be
     * limited to any one of `allowed_function_names`, else the predicted
     * function call will be any one of the provided `function_declarations`.
     */
    ANY: 'ANY',
    /**
     * Model will not predict any function call. Model behavior is same as when
     * not passing any function declarations.
     */
    NONE: 'NONE'
};
/**
 * Content part modality.
 * @public
 */
const Modality = {
    /**
     * Unspecified modality.
     */
    MODALITY_UNSPECIFIED: 'MODALITY_UNSPECIFIED',
    /**
     * Plain text.
     */
    TEXT: 'TEXT',
    /**
     * Image.
     */
    IMAGE: 'IMAGE',
    /**
     * Video.
     */
    VIDEO: 'VIDEO',
    /**
     * Audio.
     */
    AUDIO: 'AUDIO',
    /**
     * Document (for example, PDF).
     */
    DOCUMENT: 'DOCUMENT'
};
/**
 * Generation modalities to be returned in generation responses.
 *
 * @beta
 */
const ResponseModality = {
    /**
     * Text.
     * @beta
     */
    TEXT: 'TEXT',
    /**
     * Image.
     * @beta
     */
    IMAGE: 'IMAGE',
    /**
     * Audio.
     * @beta
     */
    AUDIO: 'AUDIO'
};
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
const InferenceMode = {
    'PREFER_ON_DEVICE': 'prefer_on_device',
    'ONLY_ON_DEVICE': 'only_on_device',
    'ONLY_IN_CLOUD': 'only_in_cloud',
    'PREFER_IN_CLOUD': 'prefer_in_cloud'
};
/**
 * Indicates whether inference happened on-device or in-cloud.
 *
 * @beta
 */
const InferenceSource = {
    'ON_DEVICE': 'on_device',
    'IN_CLOUD': 'in_cloud'
};
/**
 * Represents the result of the code execution.
 *
 * @public
 */
const Outcome = {
    UNSPECIFIED: 'OUTCOME_UNSPECIFIED',
    OK: 'OUTCOME_OK',
    FAILED: 'OUTCOME_FAILED',
    DEADLINE_EXCEEDED: 'OUTCOME_DEADLINE_EXCEEDED'
};
/**
 * The programming language of the code.
 *
 * @public
 */
const Language = {
    UNSPECIFIED: 'LANGUAGE_UNSPECIFIED',
    PYTHON: 'PYTHON'
};
/**
 * A preset that controls the model's "thinking" process. Use
 * `ThinkingLevel.LOW` for faster responses on less complex tasks, and
 * `ThinkingLevel.HIGH` for better reasoning on more complex tasks.
 *
 * @public
 */
const ThinkingLevel = {
    MINIMAL: 'MINIMAL',
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
};

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
 * The status of a URL retrieval.
 *
 * @remarks
 * <b>URL_RETRIEVAL_STATUS_UNSPECIFIED:</b> Unspecified retrieval status.
 * <br/>
 * <b>URL_RETRIEVAL_STATUS_SUCCESS:</b> The URL retrieval was successful.
 * <br/>
 * <b>URL_RETRIEVAL_STATUS_ERROR:</b> The URL retrieval failed.
 * <br/>
 * <b>URL_RETRIEVAL_STATUS_PAYWALL:</b> The URL retrieval failed because the content is behind a paywall.
 * <br/>
 * <b>URL_RETRIEVAL_STATUS_UNSAFE:</b> The URL retrieval failed because the content is unsafe.
 * <br/>
 *
 * @public
 */
const URLRetrievalStatus = {
    /**
     * Unspecified retrieval status.
     */
    URL_RETRIEVAL_STATUS_UNSPECIFIED: 'URL_RETRIEVAL_STATUS_UNSPECIFIED',
    /**
     * The URL retrieval was successful.
     */
    URL_RETRIEVAL_STATUS_SUCCESS: 'URL_RETRIEVAL_STATUS_SUCCESS',
    /**
     * The URL retrieval failed.
     */
    URL_RETRIEVAL_STATUS_ERROR: 'URL_RETRIEVAL_STATUS_ERROR',
    /**
     * The URL retrieval failed because the content is behind a paywall.
     */
    URL_RETRIEVAL_STATUS_PAYWALL: 'URL_RETRIEVAL_STATUS_PAYWALL',
    /**
     * The URL retrieval failed because the content is unsafe.
     */
    URL_RETRIEVAL_STATUS_UNSAFE: 'URL_RETRIEVAL_STATUS_UNSAFE'
};
/**
 * The types of responses that can be returned by {@link LiveSession.receive}.
 *
 * @beta
 */
const LiveResponseType = {
    SERVER_CONTENT: 'serverContent',
    TOOL_CALL: 'toolCall',
    TOOL_CALL_CANCELLATION: 'toolCallCancellation',
    GOING_AWAY_NOTICE: 'goingAwayNotice'
};

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
 * Standardized error codes that {@link AIError} can have.
 *
 * @public
 */
const AIErrorCode = {
    /** A generic error occurred. */
    ERROR: 'error',
    /** An error occurred in a request. */
    REQUEST_ERROR: 'request-error',
    /** An error occurred in a response. */
    RESPONSE_ERROR: 'response-error',
    /** An error occurred while performing a fetch. */
    FETCH_ERROR: 'fetch-error',
    /** An error occurred because an operation was attempted on a closed session. */
    SESSION_CLOSED: 'session-closed',
    /** An error associated with a Content object.  */
    INVALID_CONTENT: 'invalid-content',
    /** An error due to the Firebase API not being enabled in the Console. */
    API_NOT_ENABLED: 'api-not-enabled',
    /** An error due to invalid Schema input.  */
    INVALID_SCHEMA: 'invalid-schema',
    /** An error occurred due to a missing Firebase API key. */
    NO_API_KEY: 'no-api-key',
    /** An error occurred due to a missing Firebase app ID. */
    NO_APP_ID: 'no-app-id',
    /** An error occurred due to a model name not being specified during initialization. */
    NO_MODEL: 'no-model',
    /** An error occurred due to a missing project ID. */
    NO_PROJECT_ID: 'no-project-id',
    /** An error occurred while parsing. */
    PARSE_FAILED: 'parse-failed',
    /** An error occurred due an attempt to use an unsupported feature. */
    UNSUPPORTED: 'unsupported'
};

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
 * Contains the list of OpenAPI data types
 * as defined by the
 * {@link https://swagger.io/docs/specification/data-models/data-types/ | OpenAPI specification}
 * @public
 */
const SchemaType = {
    /** String type. */
    STRING: 'string',
    /** Number type. */
    NUMBER: 'number',
    /** Integer type. */
    INTEGER: 'integer',
    /** Boolean type. */
    BOOLEAN: 'boolean',
    /** Array type. */
    ARRAY: 'array',
    /** Object type. */
    OBJECT: 'object'
};

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
/**
 * A filter level controlling how aggressively to filter sensitive content.
 *
 * Text prompts provided as inputs and images (generated or uploaded) through Imagen on Vertex AI
 * are assessed against a list of safety filters, which include 'harmful categories' (for example,
 * `violence`, `sexual`, `derogatory`, and `toxic`). This filter level controls how aggressively to
 * filter out potentially harmful content from responses. See the {@link http://firebase.google.com/docs/vertex-ai/generate-images | documentation }
 * and the {@link https://cloud.google.com/vertex-ai/generative-ai/docs/image/responsible-ai-imagen#safety-filters | Responsible AI and usage guidelines}
 * for more details.
 *
 * @public
 */
const ImagenSafetyFilterLevel = {
    /**
     * The most aggressive filtering level; most strict blocking.
     */
    BLOCK_LOW_AND_ABOVE: 'block_low_and_above',
    /**
     * Blocks some sensitive prompts and responses.
     */
    BLOCK_MEDIUM_AND_ABOVE: 'block_medium_and_above',
    /**
     * Blocks few sensitive prompts and responses.
     */
    BLOCK_ONLY_HIGH: 'block_only_high',
    /**
     * The least aggressive filtering level; blocks very few sensitive prompts and responses.
     *
     * Access to this feature is restricted and may require your case to be reviewed and approved by
     * Cloud support.
     */
    BLOCK_NONE: 'block_none'
};
/**
 * A filter level controlling whether generation of images containing people or faces is allowed.
 *
 * See the <a href="http://firebase.google.com/docs/vertex-ai/generate-images">personGeneration</a>
 * documentation for more details.
 *
 * @public
 */
const ImagenPersonFilterLevel = {
    /**
     * Disallow generation of images containing people or faces; images of people are filtered out.
     */
    BLOCK_ALL: 'dont_allow',
    /**
     * Allow generation of images containing adults only; images of children are filtered out.
     *
     * Generation of images containing people or faces may require your use case to be
     * reviewed and approved by Cloud support; see the {@link https://cloud.google.com/vertex-ai/generative-ai/docs/image/responsible-ai-imagen#person-face-gen | Responsible AI and usage guidelines}
     * for more details.
     */
    ALLOW_ADULT: 'allow_adult',
    /**
     * Allow generation of images containing adults only; images of children are filtered out.
     *
     * Generation of images containing people or faces may require your use case to be
     * reviewed and approved by Cloud support; see the {@link https://cloud.google.com/vertex-ai/generative-ai/docs/image/responsible-ai-imagen#person-face-gen | Responsible AI and usage guidelines}
     * for more details.
     */
    ALLOW_ALL: 'allow_all'
};
/**
 * Aspect ratios for Imagen images.
 *
 * To specify an aspect ratio for generated images, set the `aspectRatio` property in your
 * {@link ImagenGenerationConfig}.
 *
 * See the {@link http://firebase.google.com/docs/vertex-ai/generate-images | documentation }
 * for more details and examples of the supported aspect ratios.
 *
 * @public
 */
const ImagenAspectRatio = {
    /**
     * Square (1:1) aspect ratio.
     */
    'SQUARE': '1:1',
    /**
     * Landscape (3:4) aspect ratio.
     */
    'LANDSCAPE_3x4': '3:4',
    /**
     * Portrait (4:3) aspect ratio.
     */
    'PORTRAIT_4x3': '4:3',
    /**
     * Landscape (16:9) aspect ratio.
     */
    'LANDSCAPE_16x9': '16:9',
    /**
     * Portrait (9:16) aspect ratio.
     */
    'PORTRAIT_9x16': '9:16'
};

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
 * An enum-like object containing constants that represent the supported backends
 * for the Firebase AI SDK.
 * This determines which backend service (Vertex AI Gemini API or Gemini Developer API)
 * the SDK will communicate with.
 *
 * These values are assigned to the `backendType` property within the specific backend
 * configuration objects ({@link GoogleAIBackend} or {@link VertexAIBackend}) to identify
 * which service to target.
 *
 * @public
 */
const BackendType = {
    /**
     * Identifies the backend service for the Vertex AI Gemini API provided through Google Cloud.
     * Use this constant when creating a {@link VertexAIBackend} configuration.
     */
    VERTEX_AI: 'VERTEX_AI',
    /**
     * Identifies the backend service for the Gemini Developer API ({@link https://ai.google/ | Google AI}).
     * Use this constant when creating a {@link GoogleAIBackend} configuration.
     */
    GOOGLE_AI: 'GOOGLE_AI'
}; // Using 'as const' makes the string values literal types

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
/**
 * Abstract base class representing the configuration for an AI service backend.
 * This class should not be instantiated directly. Use its subclasses; {@link GoogleAIBackend} for
 * the Gemini Developer API (via {@link https://ai.google/ | Google AI}), and
 * {@link VertexAIBackend} for the Vertex AI Gemini API.
 *
 * @public
 */
class Backend {
    /**
     * Protected constructor for use by subclasses.
     * @param type - The backend type.
     */
    constructor(type) {
        this.backendType = type;
    }
}
/**
 * Configuration class for the Gemini Developer API.
 *
 * Use this with {@link AIOptions} when initializing the AI service via
 * {@link getAI | getAI()} to specify the Gemini Developer API as the backend.
 *
 * @public
 */
class GoogleAIBackend extends Backend {
    /**
     * Creates a configuration object for the Gemini Developer API backend.
     */
    constructor() {
        super(BackendType.GOOGLE_AI);
    }
    /**
     * @internal
     */
    _getModelPath(project, model) {
        return `/${DEFAULT_API_VERSION}/projects/${project}/${model}`;
    }
    /**
     * @internal
     */
    _getTemplatePath(project, templateId) {
        return `/${DEFAULT_API_VERSION}/projects/${project}/templates/${templateId}`;
    }
}
/**
 * Configuration class for the Vertex AI Gemini API.
 *
 * Use this with {@link AIOptions} when initializing the AI service via
 * {@link getAI | getAI()} to specify the Vertex AI Gemini API as the backend.
 *
 * @public
 */
class VertexAIBackend extends Backend {
    /**
     * Creates a configuration object for the Vertex AI backend.
     *
     * @param location - The region identifier, defaulting to `us-central1`;
     * see {@link https://firebase.google.com/docs/vertex-ai/locations#available-locations | Vertex AI locations}
     * for a list of supported locations.
     */
    constructor(location = DEFAULT_LOCATION) {
        super(BackendType.VERTEX_AI);
        if (!location) {
            this.location = DEFAULT_LOCATION;
        }
        else {
            this.location = location;
        }
    }
    /**
     * @internal
     */
    _getModelPath(project, model) {
        return `/${DEFAULT_API_VERSION}/projects/${project}/locations/${this.location}/${model}`;
    }
    /**
     * @internal
     */
    _getTemplatePath(project, templateId) {
        return `/${DEFAULT_API_VERSION}/projects/${project}/locations/${this.location}/templates/${templateId}`;
    }
}

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
/**
 * Encodes a {@link Backend} into a string that will be used to uniquely identify {@link AI}
 * instances by backend type.
 *
 * @internal
 */
function encodeInstanceIdentifier(backend) {
    if (backend instanceof GoogleAIBackend) {
        return `${AI_TYPE}/googleai`;
    }
    else if (backend instanceof VertexAIBackend) {
        return `${AI_TYPE}/vertexai/${backend.location}`;
    }
    else {
        throw new AIError(AIErrorCode.ERROR, `Invalid backend: ${JSON.stringify(backend.backendType)}`);
    }
}
/**
 * Decodes an instance identifier string into a {@link Backend}.
 *
 * @internal
 */
function decodeInstanceIdentifier(instanceIdentifier) {
    const identifierParts = instanceIdentifier.split('/');
    if (identifierParts[0] !== AI_TYPE) {
        throw new AIError(AIErrorCode.ERROR, `Invalid instance identifier, unknown prefix '${identifierParts[0]}'`);
    }
    const backendType = identifierParts[1];
    switch (backendType) {
        case 'vertexai':
            const location = identifierParts[2];
            if (!location) {
                throw new AIError(AIErrorCode.ERROR, `Invalid instance identifier, unknown location '${instanceIdentifier}'`);
            }
            return new VertexAIBackend(location);
        case 'googleai':
            return new GoogleAIBackend();
        default:
            throw new AIError(AIErrorCode.ERROR, `Invalid instance identifier string: '${instanceIdentifier}'`);
    }
}

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
const logger = new Logger('@firebase/vertexai');

/**
 * @internal
 */
var Availability;
(function (Availability) {
    Availability["UNAVAILABLE"] = "unavailable";
    Availability["DOWNLOADABLE"] = "downloadable";
    Availability["DOWNLOADING"] = "downloading";
    Availability["AVAILABLE"] = "available";
})(Availability || (Availability = {}));

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
// Defaults to support image inputs for convenience.
const defaultExpectedInputs = [{ type: 'image' }];
/**
 * Defines an inference "backend" that uses Chrome's on-device model,
 * and encapsulates logic for detecting when on-device inference is
 * possible.
 */
class ChromeAdapterImpl {
    constructor(languageModelProvider, mode, onDeviceParams) {
        this.languageModelProvider = languageModelProvider;
        this.mode = mode;
        this.isDownloading = false;
        this.onDeviceParams = {
            createOptions: {
                expectedInputs: defaultExpectedInputs
            }
        };
        if (onDeviceParams) {
            this.onDeviceParams = onDeviceParams;
            if (!this.onDeviceParams.createOptions) {
                this.onDeviceParams.createOptions = {
                    expectedInputs: defaultExpectedInputs
                };
            }
            else if (!this.onDeviceParams.createOptions.expectedInputs) {
                this.onDeviceParams.createOptions.expectedInputs =
                    defaultExpectedInputs;
            }
        }
    }
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
    async isAvailable(request) {
        if (!this.mode) {
            logger.debug(`On-device inference unavailable because mode is undefined.`);
            return false;
        }
        if (this.mode === InferenceMode.ONLY_IN_CLOUD) {
            logger.debug(`On-device inference unavailable because mode is "only_in_cloud".`);
            return false;
        }
        // Triggers out-of-band download so model will eventually become available.
        const availability = await this.downloadIfAvailable();
        if (this.mode === InferenceMode.ONLY_ON_DEVICE) {
            // If it will never be available due to API inavailability, throw.
            if (availability === Availability.UNAVAILABLE) {
                throw new AIError(AIErrorCode.API_NOT_ENABLED, 'Local LanguageModel API not available in this environment.');
            }
            else if (availability === Availability.DOWNLOADABLE ||
                availability === Availability.DOWNLOADING) {
                // TODO(chholland): Better user experience during download - progress?
                logger.debug(`Waiting for download of LanguageModel to complete.`);
                await this.downloadPromise;
                return true;
            }
            return true;
        }
        // Applies prefer_on_device logic.
        if (availability !== Availability.AVAILABLE) {
            logger.debug(`On-device inference unavailable because availability is "${availability}".`);
            return false;
        }
        if (!ChromeAdapterImpl.isOnDeviceRequest(request)) {
            logger.debug(`On-device inference unavailable because request is incompatible.`);
            return false;
        }
        return true;
    }
    /**
     * Generates content on device.
     *
     * @remarks
     * This is comparable to {@link GenerativeModel.generateContent} for generating content in
     * Cloud.
     * @param request - a standard Firebase AI {@link GenerateContentRequest}
     * @returns {@link Response}, so we can reuse common response formatting.
     */
    async generateContent(request) {
        const session = await this.createSession();
        const contents = await Promise.all(request.contents.map(ChromeAdapterImpl.toLanguageModelMessage));
        const text = await session.prompt(contents, this.onDeviceParams.promptOptions);
        return ChromeAdapterImpl.toResponse(text);
    }
    /**
     * Generates content stream on device.
     *
     * @remarks
     * This is comparable to {@link GenerativeModel.generateContentStream} for generating content in
     * Cloud.
     * @param request - a standard Firebase AI {@link GenerateContentRequest}
     * @returns {@link Response}, so we can reuse common response formatting.
     */
    async generateContentStream(request) {
        const session = await this.createSession();
        const contents = await Promise.all(request.contents.map(ChromeAdapterImpl.toLanguageModelMessage));
        const stream = session.promptStreaming(contents, this.onDeviceParams.promptOptions);
        return ChromeAdapterImpl.toStreamResponse(stream);
    }
    async countTokens(_request) {
        throw new AIError(AIErrorCode.REQUEST_ERROR, 'Count Tokens is not yet available for on-device model.');
    }
    /**
     * Asserts inference for the given request can be performed by an on-device model.
     */
    static isOnDeviceRequest(request) {
        // Returns false if the prompt is empty.
        if (request.contents.length === 0) {
            logger.debug('Empty prompt rejected for on-device inference.');
            return false;
        }
        for (const content of request.contents) {
            if (content.role === 'function') {
                logger.debug(`"Function" role rejected for on-device inference.`);
                return false;
            }
            // Returns false if request contains an image with an unsupported mime type.
            for (const part of content.parts) {
                if (part.inlineData &&
                    ChromeAdapterImpl.SUPPORTED_MIME_TYPES.indexOf(part.inlineData.mimeType) === -1) {
                    logger.debug(`Unsupported mime type "${part.inlineData.mimeType}" rejected for on-device inference.`);
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Encapsulates logic to get availability and download a model if one is downloadable.
     */
    async downloadIfAvailable() {
        const availability = await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);
        if (availability === Availability.DOWNLOADABLE) {
            this.download();
        }
        return availability;
    }
    /**
     * Triggers out-of-band download of an on-device model.
     *
     * Chrome only downloads models as needed. Chrome knows a model is needed when code calls
     * LanguageModel.create.
     *
     * Since Chrome manages the download, the SDK can only avoid redundant download requests by
     * tracking if a download has previously been requested.
     */
    download() {
        if (this.isDownloading) {
            return;
        }
        this.isDownloading = true;
        this.downloadPromise = this.languageModelProvider
            ?.create(this.onDeviceParams.createOptions)
            .finally(() => {
            this.isDownloading = false;
        });
    }
    /**
     * Converts Firebase AI {@link Content} object to a Chrome {@link LanguageModelMessage} object.
     */
    static async toLanguageModelMessage(content) {
        const languageModelMessageContents = await Promise.all(content.parts.map(ChromeAdapterImpl.toLanguageModelMessageContent));
        return {
            role: ChromeAdapterImpl.toLanguageModelMessageRole(content.role),
            content: languageModelMessageContents
        };
    }
    /**
     * Converts a Firebase AI Part object to a Chrome LanguageModelMessageContent object.
     */
    static async toLanguageModelMessageContent(part) {
        if (part.text) {
            return {
                type: 'text',
                value: part.text
            };
        }
        else if (part.inlineData) {
            const formattedImageContent = await fetch(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            const imageBlob = await formattedImageContent.blob();
            const imageBitmap = await createImageBitmap(imageBlob);
            return {
                type: 'image',
                value: imageBitmap
            };
        }
        throw new AIError(AIErrorCode.REQUEST_ERROR, `Processing of this Part type is not currently supported.`);
    }
    /**
     * Converts a Firebase AI {@link Role} string to a {@link LanguageModelMessageRole} string.
     */
    static toLanguageModelMessageRole(role) {
        // Assumes 'function' rule has been filtered by isOnDeviceRequest
        return role === 'model' ? 'assistant' : 'user';
    }
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
    async createSession() {
        if (!this.languageModelProvider) {
            throw new AIError(AIErrorCode.UNSUPPORTED, 'Chrome AI requested for unsupported browser version.');
        }
        const newSession = await this.languageModelProvider.create(this.onDeviceParams.createOptions);
        if (this.oldSession) {
            this.oldSession.destroy();
        }
        // Holds session reference, so model isn't unloaded from memory.
        this.oldSession = newSession;
        return newSession;
    }
    /**
     * Formats string returned by Chrome as a {@link Response} returned by Firebase AI.
     */
    static toResponse(text) {
        return {
            json: async () => ({
                candidates: [
                    {
                        content: {
                            parts: [{ text }]
                        }
                    }
                ]
            })
        };
    }
    /**
     * Formats string stream returned by Chrome as SSE returned by Firebase AI.
     */
    static toStreamResponse(stream) {
        const encoder = new TextEncoder();
        return {
            body: stream.pipeThrough(new TransformStream({
                transform(chunk, controller) {
                    const json = JSON.stringify({
                        candidates: [
                            {
                                content: {
                                    role: 'model',
                                    parts: [{ text: chunk }]
                                }
                            }
                        ]
                    });
                    controller.enqueue(encoder.encode(`data: ${json}\n\n`));
                }
            }))
        };
    }
}
// Visible for testing
ChromeAdapterImpl.SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png'];
/**
 * Creates a ChromeAdapterImpl on demand.
 */
function chromeAdapterFactory(mode, window, params) {
    // Do not initialize a ChromeAdapter if we are not in hybrid mode.
    if (typeof window !== 'undefined' && mode) {
        return new ChromeAdapterImpl(window.LanguageModel, mode, params);
    }
}

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
class AIService {
    constructor(app, backend, authProvider, appCheckProvider, chromeAdapterFactory) {
        this.app = app;
        this.backend = backend;
        this.chromeAdapterFactory = chromeAdapterFactory;
        const appCheck = appCheckProvider?.getImmediate({ optional: true });
        const auth = authProvider?.getImmediate({ optional: true });
        this.auth = auth || null;
        this.appCheck = appCheck || null;
        if (backend instanceof VertexAIBackend) {
            this.location = backend.location;
        }
        else {
            this.location = '';
        }
    }
    _delete() {
        return Promise.resolve();
    }
    set options(optionsToSet) {
        this._options = optionsToSet;
    }
    get options() {
        return this._options;
    }
}

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
function factory(container, { instanceIdentifier }) {
    if (!instanceIdentifier) {
        throw new AIError(AIErrorCode.ERROR, 'AIService instance identifier is undefined.');
    }
    const backend = decodeInstanceIdentifier(instanceIdentifier);
    // getImmediate for FirebaseApp will always succeed
    const app = container.getProvider('app').getImmediate();
    const auth = container.getProvider('auth-internal');
    const appCheckProvider = container.getProvider('app-check-internal');
    return new AIService(app, backend, auth, appCheckProvider, chromeAdapterFactory);
}

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
/**
 * Initializes an {@link ApiSettings} object from an {@link AI} instance.
 *
 * If this is a Server App, the {@link ApiSettings} object's `getAppCheckToken()` will resolve
 * with the `FirebaseServerAppSettings.appCheckToken`, instead of requiring that an App Check
 * instance is initialized.
 */
function initApiSettings(ai) {
    if (!ai.app?.options?.apiKey) {
        throw new AIError(AIErrorCode.NO_API_KEY, `The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.`);
    }
    else if (!ai.app?.options?.projectId) {
        throw new AIError(AIErrorCode.NO_PROJECT_ID, `The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.`);
    }
    else if (!ai.app?.options?.appId) {
        throw new AIError(AIErrorCode.NO_APP_ID, `The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.`);
    }
    const apiSettings = {
        apiKey: ai.app.options.apiKey,
        project: ai.app.options.projectId,
        appId: ai.app.options.appId,
        automaticDataCollectionEnabled: ai.app.automaticDataCollectionEnabled,
        location: ai.location,
        backend: ai.backend
    };
    if (_isFirebaseServerApp(ai.app) && ai.app.settings.appCheckToken) {
        const token = ai.app.settings.appCheckToken;
        apiSettings.getAppCheckToken = () => {
            return Promise.resolve({ token });
        };
    }
    else if (ai.appCheck) {
        if (ai.options?.useLimitedUseAppCheckTokens) {
            apiSettings.getAppCheckToken = () => ai.appCheck.getLimitedUseToken();
        }
        else {
            apiSettings.getAppCheckToken = () => ai.appCheck.getToken();
        }
    }
    if (ai.auth) {
        apiSettings.getAuthToken = () => ai.auth.getToken();
    }
    return apiSettings;
}

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
/**
 * Base class for Firebase AI model APIs.
 *
 * Instances of this class are associated with a specific Firebase AI {@link Backend}
 * and provide methods for interacting with the configured generative model.
 *
 * @public
 */
class AIModel {
    /**
     * Constructs a new instance of the {@link AIModel} class.
     *
     * This constructor should only be called from subclasses that provide
     * a model API.
     *
     * @param ai - an {@link AI} instance.
     * @param modelName - The name of the model being used. It can be in one of the following formats:
     * - `my-model` (short name, will resolve to `publishers/google/models/my-model`)
     * - `models/my-model` (will resolve to `publishers/google/models/my-model`)
     * - `publishers/my-publisher/models/my-model` (fully qualified model name)
     *
     * @throws If the `apiKey` or `projectId` fields are missing in your
     * Firebase config.
     *
     * @internal
     */
    constructor(ai, modelName) {
        this._apiSettings = initApiSettings(ai);
        this.model = AIModel.normalizeModelName(modelName, this._apiSettings.backend.backendType);
    }
    /**
     * Normalizes the given model name to a fully qualified model resource name.
     *
     * @param modelName - The model name to normalize.
     * @returns The fully qualified model resource name.
     *
     * @internal
     */
    static normalizeModelName(modelName, backendType) {
        if (backendType === BackendType.GOOGLE_AI) {
            return AIModel.normalizeGoogleAIModelName(modelName);
        }
        else {
            return AIModel.normalizeVertexAIModelName(modelName);
        }
    }
    /**
     * @internal
     */
    static normalizeGoogleAIModelName(modelName) {
        return `models/${modelName}`;
    }
    /**
     * @internal
     */
    static normalizeVertexAIModelName(modelName) {
        let model;
        if (modelName.includes('/')) {
            if (modelName.startsWith('models/')) {
                // Add 'publishers/google' if the user is only passing in 'models/model-name'.
                model = `publishers/google/${modelName}`;
            }
            else {
                // Any other custom format (e.g. tuned models) must be passed in correctly.
                model = modelName;
            }
        }
        else {
            // If path is not included, assume it's a non-tuned model.
            model = `publishers/google/models/${modelName}`;
        }
        return model;
    }
}

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
const TIMEOUT_EXPIRED_MESSAGE = 'Timeout has expired.';
const ABORT_ERROR_NAME = 'AbortError';
class RequestURL {
    constructor(params) {
        this.params = params;
    }
    toString() {
        const url = new URL(this.baseUrl); // Throws if the URL is invalid
        url.pathname = this.pathname;
        url.search = this.queryParams.toString();
        return url.toString();
    }
    get pathname() {
        // We need to construct a different URL if the request is for server side prompt templates,
        // since the URL patterns are different. Server side prompt templates expect a templateId
        // instead of a model name.
        if (this.params.templateId) {
            return `${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project, this.params.templateId)}:${this.params.task}`;
        }
        else {
            return `${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project, this.params.model)}:${this.params.task}`;
        }
    }
    get baseUrl() {
        return (this.params.singleRequestOptions?.baseUrl ?? `https://${DEFAULT_DOMAIN}`);
    }
    get queryParams() {
        const params = new URLSearchParams();
        if (this.params.stream) {
            params.set('alt', 'sse');
        }
        return params;
    }
}
class WebSocketUrl {
    constructor(apiSettings) {
        this.apiSettings = apiSettings;
    }
    toString() {
        const url = new URL(`wss://${DEFAULT_DOMAIN}`);
        url.pathname = this.pathname;
        const queryParams = new URLSearchParams();
        queryParams.set('key', this.apiSettings.apiKey);
        url.search = queryParams.toString();
        return url.toString();
    }
    get pathname() {
        if (this.apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
            return 'ws/google.firebase.vertexai.v1beta.GenerativeService/BidiGenerateContent';
        }
        else {
            return `ws/google.firebase.vertexai.v1beta.LlmBidiService/BidiGenerateContent/locations/${this.apiSettings.location}`;
        }
    }
}
/**
 * Log language and "fire/version" to x-goog-api-client
 */
function getClientHeaders(url) {
    const loggingTags = [];
    loggingTags.push(`${LANGUAGE_TAG}/${PACKAGE_VERSION}`);
    loggingTags.push(`fire/${PACKAGE_VERSION}`);
    /**
     * No call would be made if ONLY_ON_DEVICE.
     * ONLY_IN_CLOUD does not indicate an intention to use hybrid.
     */
    if (url.params.apiSettings.inferenceMode === InferenceMode.PREFER_ON_DEVICE ||
        url.params.apiSettings.inferenceMode === InferenceMode.PREFER_IN_CLOUD) {
        // No version
        loggingTags.push(HYBRID_TAG);
    }
    return loggingTags.join(' ');
}
async function getHeaders(url) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-goog-api-client', getClientHeaders(url));
    headers.append('x-goog-api-key', url.params.apiSettings.apiKey);
    if (url.params.apiSettings.automaticDataCollectionEnabled) {
        headers.append('X-Firebase-Appid', url.params.apiSettings.appId);
    }
    if (url.params.apiSettings.getAppCheckToken) {
        const appCheckToken = await url.params.apiSettings.getAppCheckToken();
        if (appCheckToken) {
            headers.append('X-Firebase-AppCheck', appCheckToken.token);
            if (appCheckToken.error) {
                logger.warn(`Unable to obtain a valid App Check token: ${appCheckToken.error.message}`);
            }
        }
    }
    if (url.params.apiSettings.getAuthToken) {
        const authToken = await url.params.apiSettings.getAuthToken();
        if (authToken) {
            headers.append('Authorization', `Firebase ${authToken.accessToken}`);
        }
    }
    return headers;
}
async function makeRequest(requestUrlParams, body) {
    const url = new RequestURL(requestUrlParams);
    let response;
    const externalSignal = requestUrlParams.singleRequestOptions?.signal;
    const timeoutMillis = requestUrlParams.singleRequestOptions?.timeout != null &&
        requestUrlParams.singleRequestOptions.timeout >= 0
        ? requestUrlParams.singleRequestOptions.timeout
        : DEFAULT_FETCH_TIMEOUT_MS;
    const internalAbortController = new AbortController();
    const fetchTimeoutId = setTimeout(() => {
        internalAbortController.abort(new DOMException(TIMEOUT_EXPIRED_MESSAGE, ABORT_ERROR_NAME));
        logger.debug(`Aborting request to ${url} due to timeout (${timeoutMillis}ms)`);
    }, timeoutMillis);
    // Used to abort the fetch if either the user-defined `externalSignal` is aborted, or if the
    // internal signal (triggered by timeouts) is aborted.
    const combinedSignal = AbortSignal.any(externalSignal
        ? [externalSignal, internalAbortController.signal]
        : [internalAbortController.signal]);
    if (externalSignal && externalSignal.aborted) {
        clearTimeout(fetchTimeoutId);
        throw new DOMException(externalSignal.reason ?? 'Aborted externally before fetch', ABORT_ERROR_NAME);
    }
    try {
        const fetchOptions = {
            method: 'POST',
            headers: await getHeaders(url),
            signal: combinedSignal,
            body
        };
        response = await fetch(url.toString(), fetchOptions);
        if (!response.ok) {
            let message = '';
            let errorDetails;
            try {
                const json = await response.json();
                message = json.error.message;
                if (json.error.details) {
                    message += ` ${JSON.stringify(json.error.details)}`;
                    errorDetails = json.error.details;
                }
            }
            catch (e) {
                // ignored
            }
            if (response.status === 403 &&
                errorDetails &&
                errorDetails.some((detail) => detail.reason === 'SERVICE_DISABLED') &&
                errorDetails.some((detail) => detail.links?.[0]?.description.includes('Google developers console API activation'))) {
                throw new AIError(AIErrorCode.API_NOT_ENABLED, `The Firebase AI SDK requires the Firebase AI ` +
                    `API ('firebasevertexai.googleapis.com') to be enabled in your ` +
                    `Firebase project. Enable this API by visiting the Firebase Console ` +
                    `at https://console.firebase.google.com/project/${url.params.apiSettings.project}/ailogic/ ` +
                    `and clicking "Get started". If you enabled this API recently, ` +
                    `wait a few minutes for the action to propagate to our systems and ` +
                    `then retry.`, {
                    status: response.status,
                    statusText: response.statusText,
                    errorDetails
                });
            }
            throw new AIError(AIErrorCode.FETCH_ERROR, `Error fetching from ${url}: [${response.status} ${response.statusText}] ${message}`, {
                status: response.status,
                statusText: response.statusText,
                errorDetails
            });
        }
    }
    catch (e) {
        let err = e;
        if (e.code !== AIErrorCode.FETCH_ERROR &&
            e.code !== AIErrorCode.API_NOT_ENABLED &&
            e instanceof Error &&
            e.name !== ABORT_ERROR_NAME) {
            err = new AIError(AIErrorCode.ERROR, `Error fetching from ${url.toString()}: ${e.message}`);
            err.stack = e.stack;
        }
        throw err;
    }
    finally {
        // When doing streaming requests, this will clear the timeout once the stream begins.
        // If a timeout it 3000ms, and the stream starts after 300ms and ends after 5000ms, the
        // timeout will be cleared after 300ms, so it won't abort the request.
        clearTimeout(fetchTimeoutId);
    }
    return response;
}

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
 * Check that at least one candidate exists and does not have a bad
 * finish reason. Warns if multiple candidates exist.
 */
function hasValidCandidates(response) {
    if (response.candidates && response.candidates.length > 0) {
        if (response.candidates.length > 1) {
            logger.warn(`This response had ${response.candidates.length} ` +
                `candidates. Returning text from the first candidate only. ` +
                `Access response.candidates directly to use the other candidates.`);
        }
        if (hadBadFinishReason(response.candidates[0])) {
            throw new AIError(AIErrorCode.RESPONSE_ERROR, `Response error: ${formatBlockErrorMessage(response)}. Response body stored in error.response`, {
                response
            });
        }
        return true;
    }
    else {
        return false;
    }
}
/**
 * Creates an EnhancedGenerateContentResponse object that has helper functions and
 * other modifications that improve usability.
 */
function createEnhancedContentResponse(response, inferenceSource = InferenceSource.IN_CLOUD) {
    /**
     * The Vertex AI backend omits default values.
     * This causes the `index` property to be omitted from the first candidate in the
     * response, since it has index 0, and 0 is a default value.
     * See: https://github.com/firebase/firebase-js-sdk/issues/8566
     */
    if (response.candidates && !response.candidates[0].hasOwnProperty('index')) {
        response.candidates[0].index = 0;
    }
    const responseWithHelpers = addHelpers(response);
    responseWithHelpers.inferenceSource = inferenceSource;
    return responseWithHelpers;
}
/**
 * Adds convenience helper methods to a response object, including stream
 * chunks (as long as each chunk is a complete GenerateContentResponse JSON).
 */
function addHelpers(response) {
    response.text = () => {
        if (hasValidCandidates(response)) {
            return getText(response, part => !part.thought);
        }
        else if (response.promptFeedback) {
            throw new AIError(AIErrorCode.RESPONSE_ERROR, `Text not available. ${formatBlockErrorMessage(response)}`, {
                response
            });
        }
        return '';
    };
    response.thoughtSummary = () => {
        if (hasValidCandidates(response)) {
            const result = getText(response, part => !!part.thought);
            return result === '' ? undefined : result;
        }
        else if (response.promptFeedback) {
            throw new AIError(AIErrorCode.RESPONSE_ERROR, `Thought summary not available. ${formatBlockErrorMessage(response)}`, {
                response
            });
        }
        return undefined;
    };
    response.inlineDataParts = () => {
        if (hasValidCandidates(response)) {
            return getInlineDataParts(response);
        }
        else if (response.promptFeedback) {
            throw new AIError(AIErrorCode.RESPONSE_ERROR, `Data not available. ${formatBlockErrorMessage(response)}`, {
                response
            });
        }
        return undefined;
    };
    response.functionCalls = () => {
        if (hasValidCandidates(response)) {
            return getFunctionCalls(response);
        }
        else if (response.promptFeedback) {
            throw new AIError(AIErrorCode.RESPONSE_ERROR, `Function call not available. ${formatBlockErrorMessage(response)}`, {
                response
            });
        }
        return undefined;
    };
    return response;
}
/**
 * Returns all text from the first candidate's parts, filtering by whether
 * `partFilter()` returns true.
 *
 * @param response - The `GenerateContentResponse` from which to extract text.
 * @param partFilter - Only return `Part`s for which this returns true
 */
function getText(response, partFilter) {
    const textStrings = [];
    if (response.candidates?.[0].content?.parts) {
        for (const part of response.candidates?.[0].content?.parts) {
            if (part.text && partFilter(part)) {
                textStrings.push(part.text);
            }
        }
    }
    if (textStrings.length > 0) {
        return textStrings.join('');
    }
    else {
        return '';
    }
}
/**
 * Returns every {@link FunctionCall} associated with first candidate.
 */
function getFunctionCalls(response) {
    if (!response) {
        return undefined;
    }
    const functionCalls = [];
    if (response.candidates?.[0].content?.parts) {
        for (const part of response.candidates?.[0].content?.parts) {
            if (part.functionCall) {
                functionCalls.push(part.functionCall);
            }
        }
    }
    if (functionCalls.length > 0) {
        return functionCalls;
    }
    else {
        return undefined;
    }
}
/**
 * Returns every {@link InlineDataPart} in the first candidate if present.
 *
 * @internal
 */
function getInlineDataParts(response) {
    const data = [];
    if (response.candidates?.[0].content?.parts) {
        for (const part of response.candidates?.[0].content?.parts) {
            if (part.inlineData) {
                data.push(part);
            }
        }
    }
    if (data.length > 0) {
        return data;
    }
    else {
        return undefined;
    }
}
const badFinishReasons = [FinishReason.RECITATION, FinishReason.SAFETY];
function hadBadFinishReason(candidate) {
    return (!!candidate.finishReason &&
        badFinishReasons.some(reason => reason === candidate.finishReason));
}
function formatBlockErrorMessage(response) {
    let message = '';
    if ((!response.candidates || response.candidates.length === 0) &&
        response.promptFeedback) {
        message += 'Response was blocked';
        if (response.promptFeedback?.blockReason) {
            message += ` due to ${response.promptFeedback.blockReason}`;
        }
        if (response.promptFeedback?.blockReasonMessage) {
            message += `: ${response.promptFeedback.blockReasonMessage}`;
        }
    }
    else if (response.candidates?.[0]) {
        const firstCandidate = response.candidates[0];
        if (hadBadFinishReason(firstCandidate)) {
            message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
            if (firstCandidate.finishMessage) {
                message += `: ${firstCandidate.finishMessage}`;
            }
        }
    }
    return message;
}
/**
 * Convert a generic successful fetch response body to an Imagen response object
 * that can be returned to the user. This converts the REST APIs response format to our
 * APIs representation of a response.
 *
 * @internal
 */
async function handlePredictResponse(response) {
    const responseJson = await response.json();
    const images = [];
    let filteredReason = undefined;
    // The backend should always send a non-empty array of predictions if the response was successful.
    if (!responseJson.predictions || responseJson.predictions?.length === 0) {
        throw new AIError(AIErrorCode.RESPONSE_ERROR, 'No predictions or filtered reason received from Vertex AI. Please report this issue with the full error details at https://github.com/firebase/firebase-js-sdk/issues.');
    }
    for (const prediction of responseJson.predictions) {
        if (prediction.raiFilteredReason) {
            filteredReason = prediction.raiFilteredReason;
        }
        else if (prediction.mimeType && prediction.bytesBase64Encoded) {
            images.push({
                mimeType: prediction.mimeType,
                bytesBase64Encoded: prediction.bytesBase64Encoded
            });
        }
        else if (prediction.mimeType && prediction.gcsUri) {
            images.push({
                mimeType: prediction.mimeType,
                gcsURI: prediction.gcsUri
            });
        }
        else if (prediction.safetyAttributes) ;
        else {
            throw new AIError(AIErrorCode.RESPONSE_ERROR, `Unexpected element in 'predictions' array in response: '${JSON.stringify(prediction)}'`);
        }
    }
    return { images, filteredReason };
}

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
function mapGenerateContentRequest(generateContentRequest) {
    generateContentRequest.safetySettings?.forEach(safetySetting => {
        if (safetySetting.method) {
            throw new AIError(AIErrorCode.UNSUPPORTED, 'SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.');
        }
    });
    if (generateContentRequest.generationConfig?.topK) {
        const roundedTopK = Math.round(generateContentRequest.generationConfig.topK);
        if (roundedTopK !== generateContentRequest.generationConfig.topK) {
            logger.warn('topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API.');
            generateContentRequest.generationConfig.topK = roundedTopK;
        }
    }
    return generateContentRequest;
}
/**
 * Maps a {@link GenerateContentResponse} from Google AI to the format of the
 * {@link GenerateContentResponse} that we get from VertexAI that is exposed in the public API.
 *
 * @param googleAIResponse The {@link GenerateContentResponse} from Google AI.
 * @returns A {@link GenerateContentResponse} that conforms to the public API's format.
 *
 * @internal
 */
function mapGenerateContentResponse(googleAIResponse) {
    const generateContentResponse = {
        candidates: googleAIResponse.candidates
            ? mapGenerateContentCandidates(googleAIResponse.candidates)
            : undefined,
        prompt: googleAIResponse.promptFeedback
            ? mapPromptFeedback(googleAIResponse.promptFeedback)
            : undefined,
        usageMetadata: googleAIResponse.usageMetadata
    };
    return generateContentResponse;
}
/**
 * Maps a Vertex AI {@link CountTokensRequest} to a format that can be sent to Google AI.
 *
 * @param countTokensRequest The {@link CountTokensRequest} to map.
 * @param model The model to count tokens with.
 * @returns A {@link CountTokensRequest} that conforms to the Google AI format.
 *
 * @internal
 */
function mapCountTokensRequest(countTokensRequest, model) {
    const mappedCountTokensRequest = {
        generateContentRequest: {
            model,
            ...countTokensRequest
        }
    };
    return mappedCountTokensRequest;
}
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
function mapGenerateContentCandidates(candidates) {
    const mappedCandidates = [];
    let mappedSafetyRatings;
    if (mappedCandidates) {
        candidates.forEach(candidate => {
            // Map citationSources to citations.
            let citationMetadata;
            if (candidate.citationMetadata) {
                citationMetadata = {
                    citations: candidate.citationMetadata.citationSources
                };
            }
            // Assign missing candidate SafetyRatings properties to their defaults if undefined.
            if (candidate.safetyRatings) {
                mappedSafetyRatings = candidate.safetyRatings.map(safetyRating => {
                    return {
                        ...safetyRating,
                        severity: safetyRating.severity ?? HarmSeverity.HARM_SEVERITY_UNSUPPORTED,
                        probabilityScore: safetyRating.probabilityScore ?? 0,
                        severityScore: safetyRating.severityScore ?? 0
                    };
                });
            }
            // videoMetadata is not supported.
            // Throw early since developers may send a long video as input and only expect to pay
            // for inference on a small portion of the video.
            if (candidate.content?.parts?.some(part => part?.videoMetadata)) {
                throw new AIError(AIErrorCode.UNSUPPORTED, 'Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.');
            }
            const mappedCandidate = {
                index: candidate.index,
                content: candidate.content,
                finishReason: candidate.finishReason,
                finishMessage: candidate.finishMessage,
                safetyRatings: mappedSafetyRatings,
                citationMetadata,
                groundingMetadata: candidate.groundingMetadata,
                urlContextMetadata: candidate.urlContextMetadata
            };
            mappedCandidates.push(mappedCandidate);
        });
    }
    return mappedCandidates;
}
function mapPromptFeedback(promptFeedback) {
    // Assign missing SafetyRating properties to their defaults if undefined.
    const mappedSafetyRatings = [];
    promptFeedback.safetyRatings.forEach(safetyRating => {
        mappedSafetyRatings.push({
            category: safetyRating.category,
            probability: safetyRating.probability,
            severity: safetyRating.severity ?? HarmSeverity.HARM_SEVERITY_UNSUPPORTED,
            probabilityScore: safetyRating.probabilityScore ?? 0,
            severityScore: safetyRating.severityScore ?? 0,
            blocked: safetyRating.blocked
        });
    });
    const mappedPromptFeedback = {
        blockReason: promptFeedback.blockReason,
        safetyRatings: mappedSafetyRatings,
        blockReasonMessage: promptFeedback.blockReasonMessage
    };
    return mappedPromptFeedback;
}

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
const responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
/**
 * Process a response.body stream from the backend and return an
 * iterator that provides one complete GenerateContentResponse at a time
 * and a promise that resolves with a single aggregated
 * GenerateContentResponse.
 *
 * @param response - Response from a fetch call
 */
async function processStream(response, apiSettings, inferenceSource) {
    const inputStream = response.body.pipeThrough(new TextDecoderStream('utf8', { fatal: true }));
    const responseStream = getResponseStream(inputStream);
    // We split the stream so the user can iterate over partial results (stream1)
    // while we aggregate the full result for history/final response (stream2).
    const [stream1, stream2] = responseStream.tee();
    const { response: internalResponse, firstValue } = await processStreamInternal(stream2, apiSettings, inferenceSource);
    return {
        stream: generateResponseSequence(stream1, apiSettings, inferenceSource),
        response: internalResponse,
        firstValue
    };
}
/**
 * Consumes streams teed from the input stream for internal needs.
 * The streams need to be teed because each stream can only be consumed
 * by one reader.
 *
 * "streamForPeek"
 * This tee is used to peek at the first value for relevant information
 * that we need to evaluate before returning the stream handle to the
 * client. For example, we need to check if the response is a function
 * call that may need to be handled by automatic function calling before
 * returning a response to the client.
 *
 * "streamForAggregation"
 * We iterate through this tee independently from the user and aggregate
 * it into a single response when the stream is complete. We need this
 * aggregate object to add to chat history when using ChatSession. It's
 * also provided to the user if they want it.
 */
async function processStreamInternal(stream, apiSettings, inferenceSource) {
    const [streamForPeek, streamForAggregation] = stream.tee();
    const reader = streamForPeek.getReader();
    const { value } = await reader.read();
    return {
        firstValue: value,
        response: getResponsePromise(streamForAggregation, apiSettings, inferenceSource)
    };
}
async function getResponsePromise(stream, apiSettings, inferenceSource) {
    const allResponses = [];
    const reader = stream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            let generateContentResponse = aggregateResponses(allResponses);
            if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
                generateContentResponse = mapGenerateContentResponse(generateContentResponse);
            }
            return createEnhancedContentResponse(generateContentResponse, inferenceSource);
        }
        allResponses.push(value);
    }
}
async function* generateResponseSequence(stream, apiSettings, inferenceSource) {
    const reader = stream.getReader();
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        let enhancedResponse;
        if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
            enhancedResponse = createEnhancedContentResponse(mapGenerateContentResponse(value), inferenceSource);
        }
        else {
            enhancedResponse = createEnhancedContentResponse(value, inferenceSource);
        }
        const firstCandidate = enhancedResponse.candidates?.[0];
        if (!firstCandidate?.content?.parts &&
            !firstCandidate?.finishReason &&
            !firstCandidate?.citationMetadata &&
            !firstCandidate?.urlContextMetadata) {
            continue;
        }
        yield enhancedResponse;
    }
}
/**
 * Reads a raw string stream, buffers incomplete chunks, and yields parsed JSON objects.
 */
function getResponseStream(inputStream) {
    const reader = inputStream.getReader();
    const stream = new ReadableStream({
        start(controller) {
            let currentText = '';
            return pump();
            function pump() {
                return reader.read().then(({ value, done }) => {
                    if (done) {
                        if (currentText.trim()) {
                            controller.error(new AIError(AIErrorCode.PARSE_FAILED, 'Failed to parse stream'));
                            return;
                        }
                        controller.close();
                        return;
                    }
                    currentText += value;
                    // SSE events may span chunk boundaries, so we buffer until we match
                    // the full "data: {json}\n\n" pattern.
                    let match = currentText.match(responseLineRE);
                    let parsedResponse;
                    while (match) {
                        try {
                            parsedResponse = JSON.parse(match[1]);
                        }
                        catch (e) {
                            controller.error(new AIError(AIErrorCode.PARSE_FAILED, `Error parsing JSON response: "${match[1]}`));
                            return;
                        }
                        controller.enqueue(parsedResponse);
                        currentText = currentText.substring(match[0].length);
                        match = currentText.match(responseLineRE);
                    }
                    return pump();
                });
            }
        }
    });
    return stream;
}
/**
 * Aggregates an array of `GenerateContentResponse`s into a single
 * GenerateContentResponse.
 */
function aggregateResponses(responses) {
    const lastResponse = responses[responses.length - 1];
    const aggregatedResponse = {
        promptFeedback: lastResponse?.promptFeedback
    };
    for (const response of responses) {
        if (response.candidates) {
            for (const candidate of response.candidates) {
                // Use 0 if index is undefined (protobuf default value omission).
                const i = candidate.index || 0;
                if (!aggregatedResponse.candidates) {
                    aggregatedResponse.candidates = [];
                }
                if (!aggregatedResponse.candidates[i]) {
                    aggregatedResponse.candidates[i] = {
                        index: candidate.index
                    };
                }
                // Overwrite with the latest metadata
                aggregatedResponse.candidates[i].citationMetadata =
                    candidate.citationMetadata;
                aggregatedResponse.candidates[i].finishReason = candidate.finishReason;
                aggregatedResponse.candidates[i].finishMessage =
                    candidate.finishMessage;
                aggregatedResponse.candidates[i].safetyRatings =
                    candidate.safetyRatings;
                aggregatedResponse.candidates[i].groundingMetadata =
                    candidate.groundingMetadata;
                // The urlContextMetadata object is defined in the first chunk of the response stream.
                // In all subsequent chunks, the urlContextMetadata object will be undefined. We need to
                // make sure that we don't overwrite the first value urlContextMetadata object with undefined.
                // FIXME: What happens if we receive a second, valid urlContextMetadata object?
                const urlContextMetadata = candidate.urlContextMetadata;
                if (typeof urlContextMetadata === 'object' &&
                    urlContextMetadata !== null &&
                    Object.keys(urlContextMetadata).length > 0) {
                    aggregatedResponse.candidates[i].urlContextMetadata =
                        urlContextMetadata;
                }
                if (candidate.content) {
                    if (!candidate.content.parts) {
                        continue;
                    }
                    if (!aggregatedResponse.candidates[i].content) {
                        aggregatedResponse.candidates[i].content = {
                            role: candidate.content.role || 'user',
                            parts: []
                        };
                    }
                    for (const part of candidate.content.parts) {
                        const newPart = { ...part };
                        // The backend can send empty text parts. If these are sent back
                        // (e.g. in chat history), the backend will respond with an error.
                        // To prevent this, ignore empty text parts.
                        if (part.text === '') {
                            continue;
                        }
                        if (Object.keys(newPart).length > 0) {
                            aggregatedResponse.candidates[i].content.parts.push(newPart);
                        }
                    }
                }
            }
        }
    }
    return aggregatedResponse;
}

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
const errorsCausingFallback = [
    // most network errors
    AIErrorCode.FETCH_ERROR,
    // fallback code for all other errors in makeRequest
    AIErrorCode.ERROR,
    // error due to API not being enabled in project
    AIErrorCode.API_NOT_ENABLED
];
/**
 * Dispatches a request to the appropriate backend (on-device or in-cloud)
 * based on the inference mode.
 *
 * @param request - The request to be sent.
 * @param chromeAdapter - The on-device model adapter.
 * @param onDeviceCall - The function to call for on-device inference.
 * @param inCloudCall - The function to call for in-cloud inference.
 * @returns The response from the backend.
 */
async function callCloudOrDevice(request, chromeAdapter, onDeviceCall, inCloudCall) {
    if (!chromeAdapter) {
        return {
            response: await inCloudCall(),
            inferenceSource: InferenceSource.IN_CLOUD
        };
    }
    switch (chromeAdapter.mode) {
        case InferenceMode.ONLY_ON_DEVICE:
            if (await chromeAdapter.isAvailable(request)) {
                return {
                    response: await onDeviceCall(),
                    inferenceSource: InferenceSource.ON_DEVICE
                };
            }
            throw new AIError(AIErrorCode.UNSUPPORTED, 'Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.');
        case InferenceMode.ONLY_IN_CLOUD:
            return {
                response: await inCloudCall(),
                inferenceSource: InferenceSource.IN_CLOUD
            };
        case InferenceMode.PREFER_IN_CLOUD:
            try {
                return {
                    response: await inCloudCall(),
                    inferenceSource: InferenceSource.IN_CLOUD
                };
            }
            catch (e) {
                if (e instanceof AIError && errorsCausingFallback.includes(e.code)) {
                    return {
                        response: await onDeviceCall(),
                        inferenceSource: InferenceSource.ON_DEVICE
                    };
                }
                throw e;
            }
        case InferenceMode.PREFER_ON_DEVICE:
            if (await chromeAdapter.isAvailable(request)) {
                return {
                    response: await onDeviceCall(),
                    inferenceSource: InferenceSource.ON_DEVICE
                };
            }
            return {
                response: await inCloudCall(),
                inferenceSource: InferenceSource.IN_CLOUD
            };
        default:
            throw new AIError(AIErrorCode.ERROR, `Unexpected infererence mode: ${chromeAdapter.mode}`);
    }
}

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
async function generateContentStreamOnCloud(apiSettings, model, params, singleRequestOptions) {
    if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
        params = mapGenerateContentRequest(params);
    }
    return makeRequest({
        task: "streamGenerateContent" /* Task.STREAM_GENERATE_CONTENT */,
        model,
        apiSettings,
        stream: true,
        singleRequestOptions
    }, JSON.stringify(params));
}
async function generateContentStream(apiSettings, model, params, chromeAdapter, singleRequestOptions) {
    const callResult = await callCloudOrDevice(params, chromeAdapter, () => chromeAdapter.generateContentStream(params), () => generateContentStreamOnCloud(apiSettings, model, params, singleRequestOptions));
    return processStream(callResult.response, apiSettings, callResult.inferenceSource);
}
async function generateContentOnCloud(apiSettings, model, params, singleRequestOptions) {
    if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
        params = mapGenerateContentRequest(params);
    }
    return makeRequest({
        model,
        task: "generateContent" /* Task.GENERATE_CONTENT */,
        apiSettings,
        stream: false,
        singleRequestOptions
    }, JSON.stringify(params));
}
async function templateGenerateContent(apiSettings, templateId, templateParams, singleRequestOptions) {
    const response = await makeRequest({
        task: "templateGenerateContent" /* ServerPromptTemplateTask.TEMPLATE_GENERATE_CONTENT */,
        templateId,
        apiSettings,
        stream: false,
        singleRequestOptions
    }, JSON.stringify(templateParams));
    const generateContentResponse = await processGenerateContentResponse(response, apiSettings);
    const enhancedResponse = createEnhancedContentResponse(generateContentResponse);
    return {
        response: enhancedResponse
    };
}
async function templateGenerateContentStream(apiSettings, templateId, templateParams, singleRequestOptions) {
    const response = await makeRequest({
        task: "templateStreamGenerateContent" /* ServerPromptTemplateTask.TEMPLATE_STREAM_GENERATE_CONTENT */,
        templateId,
        apiSettings,
        stream: true,
        singleRequestOptions
    }, JSON.stringify(templateParams));
    return processStream(response, apiSettings);
}
async function generateContent(apiSettings, model, params, chromeAdapter, singleRequestOptions) {
    const callResult = await callCloudOrDevice(params, chromeAdapter, () => chromeAdapter.generateContent(params), () => generateContentOnCloud(apiSettings, model, params, singleRequestOptions));
    const generateContentResponse = await processGenerateContentResponse(callResult.response, apiSettings);
    const enhancedResponse = createEnhancedContentResponse(generateContentResponse, callResult.inferenceSource);
    return {
        response: enhancedResponse
    };
}
async function processGenerateContentResponse(response, apiSettings) {
    const responseJson = await response.json();
    if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
        return mapGenerateContentResponse(responseJson);
    }
    else {
        return responseJson;
    }
}

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
function formatSystemInstruction(input) {
    // null or undefined
    if (input == null) {
        return undefined;
    }
    else if (typeof input === 'string') {
        return { role: 'system', parts: [{ text: input }] };
    }
    else if (input.text) {
        return { role: 'system', parts: [input] };
    }
    else if (input.parts) {
        if (!input.role) {
            return { role: 'system', parts: input.parts };
        }
        else {
            return input;
        }
    }
}
function formatNewContent(request) {
    let newParts = [];
    if (typeof request === 'string') {
        newParts = [{ text: request }];
    }
    else {
        for (const partOrString of request) {
            if (typeof partOrString === 'string') {
                newParts.push({ text: partOrString });
            }
            else {
                newParts.push(partOrString);
            }
        }
    }
    return assignRoleToPartsAndValidateSendMessageRequest(newParts);
}
/**
 * When multiple Part types (i.e. FunctionResponsePart and TextPart) are
 * passed in a single Part array, we may need to assign different roles to each
 * part. Currently only FunctionResponsePart requires a role other than 'user'.
 * @private
 * @param parts Array of parts to pass to the model
 * @returns Array of content items
 */
function assignRoleToPartsAndValidateSendMessageRequest(parts) {
    const userContent = { role: 'user', parts: [] };
    const functionContent = { role: 'function', parts: [] };
    let hasUserContent = false;
    let hasFunctionContent = false;
    for (const part of parts) {
        if ('functionResponse' in part) {
            functionContent.parts.push(part);
            hasFunctionContent = true;
        }
        else {
            userContent.parts.push(part);
            hasUserContent = true;
        }
    }
    if (hasUserContent && hasFunctionContent) {
        throw new AIError(AIErrorCode.INVALID_CONTENT, 'Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.');
    }
    if (!hasUserContent && !hasFunctionContent) {
        throw new AIError(AIErrorCode.INVALID_CONTENT, 'No Content is provided for sending chat message.');
    }
    if (hasUserContent) {
        return userContent;
    }
    return functionContent;
}
function formatGenerateContentInput(params) {
    let formattedRequest;
    if (params.contents) {
        formattedRequest = params;
    }
    else {
        // Array or string
        const content = formatNewContent(params);
        formattedRequest = { contents: [content] };
    }
    if (params.systemInstruction) {
        formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
    }
    return formattedRequest;
}
/**
 * Convert the user-defined parameters in {@link ImagenGenerationParams} to the format
 * that is expected from the REST API.
 *
 * @internal
 */
function createPredictRequestBody(prompt, { gcsURI, imageFormat, addWatermark, numberOfImages = 1, negativePrompt, aspectRatio, safetyFilterLevel, personFilterLevel }) {
    // Properties that are undefined will be omitted from the JSON string that is sent in the request.
    const body = {
        instances: [
            {
                prompt
            }
        ],
        parameters: {
            storageUri: gcsURI,
            negativePrompt,
            sampleCount: numberOfImages,
            aspectRatio,
            outputOptions: imageFormat,
            addWatermark,
            safetyFilterLevel,
            personGeneration: personFilterLevel,
            includeRaiReason: true,
            includeSafetyAttributes: true
        }
    };
    return body;
}

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
// https://ai.google.dev/api/rest/v1beta/Content#part
const VALID_PART_FIELDS = [
    'text',
    'inlineData',
    'functionCall',
    'functionResponse',
    'thought',
    'thoughtSignature'
];
const VALID_PARTS_PER_ROLE = {
    user: ['text', 'inlineData'],
    function: ['functionResponse'],
    model: ['text', 'functionCall', 'thought', 'thoughtSignature'],
    // System instructions shouldn't be in history anyway.
    system: ['text']
};
const VALID_PREVIOUS_CONTENT_ROLES = {
    user: ['model'],
    function: ['model'],
    model: ['user', 'function'],
    // System instructions shouldn't be in history.
    system: []
};
function validateChatHistory(history) {
    let prevContent = null;
    for (const currContent of history) {
        const { role, parts } = currContent;
        if (!prevContent && role !== 'user') {
            throw new AIError(AIErrorCode.INVALID_CONTENT, `First Content should be with role 'user', got ${role}`);
        }
        if (!POSSIBLE_ROLES.includes(role)) {
            throw new AIError(AIErrorCode.INVALID_CONTENT, `Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
        }
        if (!Array.isArray(parts)) {
            throw new AIError(AIErrorCode.INVALID_CONTENT, `Content should have 'parts' property with an array of Parts`);
        }
        if (parts.length === 0) {
            throw new AIError(AIErrorCode.INVALID_CONTENT, `Each Content should have at least one part`);
        }
        const countFields = {
            text: 0,
            inlineData: 0,
            functionCall: 0,
            functionResponse: 0,
            thought: 0,
            thoughtSignature: 0,
            executableCode: 0,
            codeExecutionResult: 0
        };
        for (const part of parts) {
            for (const key of VALID_PART_FIELDS) {
                if (key in part) {
                    countFields[key] += 1;
                }
            }
        }
        const validParts = VALID_PARTS_PER_ROLE[role];
        for (const key of VALID_PART_FIELDS) {
            if (!validParts.includes(key) && countFields[key] > 0) {
                throw new AIError(AIErrorCode.INVALID_CONTENT, `Content with role '${role}' can't contain '${key}' part`);
            }
        }
        if (prevContent) {
            const validPreviousContentRoles = VALID_PREVIOUS_CONTENT_ROLES[role];
            if (!validPreviousContentRoles.includes(prevContent.role)) {
                throw new AIError(AIErrorCode.INVALID_CONTENT, `Content with role '${role}' can't follow '${prevContent.role}'. Valid previous roles: ${JSON.stringify(VALID_PREVIOUS_CONTENT_ROLES)}`);
            }
        }
        prevContent = currContent;
    }
}

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
 * Used to break the internal promise chain when an error is already handled
 * by the user, preventing duplicate console logs.
 */
const SILENT_ERROR = 'SILENT_ERROR';
/**
 * Prevent infinite loop if the model continues to request sequential
 * function calls during automatic function calling.
 */
const DEFAULT_MAX_SEQUENTIAL_FUNCTION_CALLS = 10;
/**
 * ChatSession class that enables sending chat messages and stores
 * history of sent and received messages so far.
 *
 * @public
 */
class ChatSession {
    constructor(apiSettings, model, chromeAdapter, params, requestOptions) {
        this.model = model;
        this.chromeAdapter = chromeAdapter;
        this.params = params;
        this.requestOptions = requestOptions;
        this._history = [];
        /**
         * Ensures sequential execution of chat messages to maintain history order.
         * Each call waits for the previous one to settle before proceeding.
         */
        this._sendPromise = Promise.resolve();
        this._apiSettings = apiSettings;
        if (params?.history) {
            validateChatHistory(params.history);
            this._history = params.history;
        }
    }
    /**
     * Gets the chat history so far. Blocked prompts are not added to history.
     * Neither blocked candidates nor the prompts that generated them are added
     * to history.
     */
    async getHistory() {
        await this._sendPromise;
        return this._history;
    }
    /**
     * Format Content into a request for generateContent or
     * generateContentStream.
     * @internal
     */
    _formatRequest(incomingContent, tempHistory) {
        return {
            safetySettings: this.params?.safetySettings,
            generationConfig: this.params?.generationConfig,
            tools: this.params?.tools,
            toolConfig: this.params?.toolConfig,
            systemInstruction: this.params?.systemInstruction,
            contents: [...this._history, ...tempHistory, incomingContent]
        };
    }
    /**
     * Sends a chat message and receives a non-streaming
     * {@link GenerateContentResult}
     */
    async sendMessage(request, singleRequestOptions) {
        let finalResult = {};
        await this._sendPromise;
        /**
         * Temporarily store multiple turns for cases like automatic function
         * calling, only writing them to official history when the entire
         * sequence has completed successfully.
         */
        const tempHistory = [];
        this._sendPromise = this._sendPromise.then(async () => {
            let functionCalls;
            let functionCallTurnCount = 0;
            const functionCallMaxTurns = this.requestOptions?.maxSequentalFunctionCalls ??
                DEFAULT_MAX_SEQUENTIAL_FUNCTION_CALLS;
            // Repeats until model returns a response with no function calls
            // or until `functionCallMaxTurns` is met or exceeded.
            do {
                let formattedContent;
                if (functionCalls) {
                    functionCallTurnCount++;
                    const functionResponseParts = await this._callFunctionsAsNeeded(functionCalls);
                    formattedContent = formatNewContent(functionResponseParts);
                }
                else {
                    formattedContent = formatNewContent(request);
                }
                const formattedRequest = this._formatRequest(formattedContent, tempHistory);
                tempHistory.push(formattedContent);
                const result = await generateContent(this._apiSettings, this.model, formattedRequest, this.chromeAdapter, {
                    ...this.requestOptions,
                    ...singleRequestOptions
                });
                if (result) {
                    finalResult = result;
                    functionCalls = this._getCallableFunctionCalls(result.response);
                    if (result.response.candidates &&
                        result.response.candidates.length > 0) {
                        // TODO: Make this update atomic. If creating `responseContent` throws,
                        // history will contain the user message but not the response, causing
                        // validation errors on the next request.
                        const responseContent = {
                            parts: result.response.candidates?.[0].content.parts || [],
                            // Response seems to come back without a role set.
                            role: result.response.candidates?.[0].content.role || 'model'
                        };
                        tempHistory.push(responseContent);
                    }
                    else {
                        const blockErrorMessage = formatBlockErrorMessage(result.response);
                        if (blockErrorMessage) {
                            logger.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
                        }
                    }
                }
                else {
                    functionCalls = undefined;
                }
            } while (functionCalls && functionCallTurnCount < functionCallMaxTurns);
            if (functionCalls && functionCallTurnCount >= functionCallMaxTurns) {
                logger.warn(`Automatic function calling exceeded the limit of` +
                    ` ${functionCallMaxTurns} function calls. Returning last model response.`);
            }
        });
        await this._sendPromise;
        this._history = this._history.concat(tempHistory);
        return finalResult;
    }
    /**
     * Sends a chat message and receives the response as a
     * {@link GenerateContentStreamResult} containing an iterable stream
     * and a response promise.
     */
    async sendMessageStream(request, singleRequestOptions) {
        await this._sendPromise;
        /**
         * Temporarily store multiple turns for cases like automatic function
         * calling, only writing them to official history when the entire
         * sequence has completed successfully.
         */
        const tempHistory = [];
        const callGenerateContentStream = async () => {
            let functionCalls;
            let functionCallTurnCount = 0;
            const functionCallMaxTurns = this.requestOptions?.maxSequentalFunctionCalls ??
                DEFAULT_MAX_SEQUENTIAL_FUNCTION_CALLS;
            let result;
            // Repeats until model returns a response with no function calls
            // or until `functionCallMaxTurns` is met or exceeded.
            do {
                let formattedContent;
                if (functionCalls) {
                    functionCallTurnCount++;
                    const functionResponseParts = await this._callFunctionsAsNeeded(functionCalls);
                    formattedContent = formatNewContent(functionResponseParts);
                }
                else {
                    formattedContent = formatNewContent(request);
                }
                tempHistory.push(formattedContent);
                const formattedRequest = this._formatRequest(formattedContent, tempHistory);
                result = await generateContentStream(this._apiSettings, this.model, formattedRequest, this.chromeAdapter, {
                    ...this.requestOptions,
                    ...singleRequestOptions
                });
                functionCalls = this._getCallableFunctionCalls(result.firstValue);
                if (functionCalls &&
                    result.firstValue &&
                    result.firstValue.candidates &&
                    result.firstValue.candidates.length > 0) {
                    const responseContent = {
                        ...result.firstValue.candidates[0].content
                    };
                    if (!responseContent.role) {
                        responseContent.role = 'model';
                    }
                    tempHistory.push(responseContent);
                }
            } while (functionCalls && functionCallTurnCount < functionCallMaxTurns);
            if (functionCalls && functionCallTurnCount >= functionCallMaxTurns) {
                logger.warn(`Automatic function calling exceeded the limit of` +
                    ` ${functionCallMaxTurns} function calls. Returning last model response.`);
            }
            return { stream: result.stream, response: result.response };
        };
        const streamPromise = callGenerateContentStream();
        // Add onto the chain.
        this._sendPromise = this._sendPromise
            .then(async () => streamPromise)
            // This must be handled to avoid unhandled rejection, but jump
            // to the final catch block with a label to not log this error.
            .catch(_ignored => {
            // If the initial fetch fails, the user's `streamPromise` rejects.
            // We swallow the error here to prevent double logging in the final catch.
            throw new Error(SILENT_ERROR);
        })
            .then(streamResult => streamResult.response)
            .then(response => {
            // This runs after the stream completes. Runtime errors here cannot be
            // caught by the user because their promise has likely already resolved.
            // TODO: Move response validation logic upstream to `stream-reader` so
            // errors propagate to the user's `result.response` promise.
            if (response.candidates && response.candidates.length > 0) {
                this._history = this._history.concat(tempHistory);
                // TODO: Validate that `response.candidates[0].content` is not null.
                const responseContent = { ...response.candidates[0].content };
                if (!responseContent.role) {
                    responseContent.role = 'model';
                }
                this._history.push(responseContent);
            }
            else {
                const blockErrorMessage = formatBlockErrorMessage(response);
                if (blockErrorMessage) {
                    logger.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
                }
            }
        })
            .catch(e => {
            // Filter out errors already handled by the user or initiated by them.
            if (e.message !== SILENT_ERROR && e.name !== 'AbortError') {
                logger.error(e);
            }
        });
        return streamPromise;
    }
    /**
     * Get function calls that the SDK has references to actually call.
     * This is all-or-nothing. If the model is requesting multiple
     * function calls, all of them must have references in order for
     * automatic function calling to work.
     *
     * @internal
     */
    _getCallableFunctionCalls(response) {
        const functionDeclarationsTool = this.params?.tools?.find(tool => tool.functionDeclarations);
        if (!functionDeclarationsTool?.functionDeclarations) {
            return;
        }
        const functionCalls = getFunctionCalls(response);
        if (!functionCalls) {
            return;
        }
        for (const functionCall of functionCalls) {
            const hasFunctionReference = functionDeclarationsTool.functionDeclarations?.some(declaration => declaration.name === functionCall.name &&
                typeof declaration.functionReference === 'function');
            if (!hasFunctionReference) {
                return;
            }
        }
        return functionCalls;
    }
    /**
     * Call user-defined functions if requested by the model, and return
     * the response that should be sent to the model.
     * @internal
     */
    async _callFunctionsAsNeeded(functionCalls) {
        const activeCallList = new Map();
        const promiseList = [];
        const functionDeclarationsTool = this.params?.tools?.find(tool => tool.functionDeclarations);
        if (functionDeclarationsTool &&
            functionDeclarationsTool.functionDeclarations) {
            for (const functionCall of functionCalls) {
                const functionDeclaration = functionDeclarationsTool.functionDeclarations.find(declaration => declaration.name === functionCall.name);
                if (functionDeclaration?.functionReference) {
                    const results = Promise.resolve(functionDeclaration.functionReference(functionCall.args)).catch(e => {
                        const wrappedError = new AIError(AIErrorCode.ERROR, `Error in user-defined function "${functionDeclaration.name}": ${e.message}`);
                        wrappedError.stack = e.stack;
                        throw wrappedError;
                    });
                    activeCallList.set(functionCall.name, {
                        id: functionCall.id,
                        results
                    });
                    promiseList.push(results);
                }
            }
            // Wait for promises to finish.
            await Promise.all(promiseList);
            const functionResponseParts = [];
            for (const [name, callData] of activeCallList) {
                functionResponseParts.push({
                    functionResponse: {
                        name,
                        response: await callData.results
                    }
                });
            }
            return functionResponseParts;
        }
        else {
            throw new AIError(AIErrorCode.REQUEST_ERROR, `No function declarations were provided in "tools".`);
        }
    }
}

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
async function countTokensOnCloud(apiSettings, model, params, singleRequestOptions) {
    let body = '';
    if (apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
        const mappedParams = mapCountTokensRequest(params, model);
        body = JSON.stringify(mappedParams);
    }
    else {
        body = JSON.stringify(params);
    }
    const response = await makeRequest({
        model,
        task: "countTokens" /* Task.COUNT_TOKENS */,
        apiSettings,
        stream: false,
        singleRequestOptions
    }, body);
    return response.json();
}
async function countTokens(apiSettings, model, params, chromeAdapter, requestOptions) {
    if (chromeAdapter?.mode === InferenceMode.ONLY_ON_DEVICE) {
        throw new AIError(AIErrorCode.UNSUPPORTED, 'countTokens() is not supported for on-device models.');
    }
    return countTokensOnCloud(apiSettings, model, params, requestOptions);
}

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
 * Class for generative model APIs.
 * @public
 */
class GenerativeModel extends AIModel {
    constructor(ai, modelParams, requestOptions, chromeAdapter) {
        super(ai, modelParams.model);
        this.chromeAdapter = chromeAdapter;
        this.generationConfig = modelParams.generationConfig || {};
        validateGenerationConfig(this.generationConfig);
        this.safetySettings = modelParams.safetySettings || [];
        this.tools = modelParams.tools;
        this.toolConfig = modelParams.toolConfig;
        this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
        this.requestOptions = requestOptions || {};
    }
    /**
     * Makes a single non-streaming call to the model
     * and returns an object containing a single {@link GenerateContentResponse}.
     */
    async generateContent(request, singleRequestOptions) {
        const formattedParams = formatGenerateContentInput(request);
        return generateContent(this._apiSettings, this.model, {
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
            tools: this.tools,
            toolConfig: this.toolConfig,
            systemInstruction: this.systemInstruction,
            ...formattedParams
        }, this.chromeAdapter, 
        // Merge request options
        {
            ...this.requestOptions,
            ...singleRequestOptions
        });
    }
    /**
     * Makes a single streaming call to the model
     * and returns an object containing an iterable stream that iterates
     * over all chunks in the streaming response as well as
     * a promise that returns the final aggregated response.
     */
    async generateContentStream(request, singleRequestOptions) {
        const formattedParams = formatGenerateContentInput(request);
        const { stream, response } = await generateContentStream(this._apiSettings, this.model, {
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
            tools: this.tools,
            toolConfig: this.toolConfig,
            systemInstruction: this.systemInstruction,
            ...formattedParams
        }, this.chromeAdapter, 
        // Merge request options
        {
            ...this.requestOptions,
            ...singleRequestOptions
        });
        return { stream, response };
    }
    /**
     * Gets a new {@link ChatSession} instance which can be used for
     * multi-turn chats.
     */
    startChat(startChatParams) {
        return new ChatSession(this._apiSettings, this.model, this.chromeAdapter, {
            tools: this.tools,
            toolConfig: this.toolConfig,
            systemInstruction: this.systemInstruction,
            generationConfig: this.generationConfig,
            safetySettings: this.safetySettings,
            /**
             * Overrides params inherited from GenerativeModel with those explicitly set in the
             * StartChatParams. For example, if startChatParams.generationConfig is set, it'll override
             * this.generationConfig.
             */
            ...startChatParams
        }, this.requestOptions);
    }
    /**
     * Counts the tokens in the provided request.
     */
    async countTokens(request, singleRequestOptions) {
        const formattedParams = formatGenerateContentInput(request);
        return countTokens(this._apiSettings, this.model, formattedParams, this.chromeAdapter, 
        // Merge request options
        {
            ...this.requestOptions,
            ...singleRequestOptions
        });
    }
}
/**
 * Client-side validation of some common `GenerationConfig` pitfalls, in order
 * to save the developer a wasted request.
 */
function validateGenerationConfig(generationConfig) {
    if (
    // != allows for null and undefined. 0 is considered "set" by the model
    generationConfig.thinkingConfig?.thinkingBudget != null &&
        generationConfig.thinkingConfig?.thinkingLevel) {
        throw new AIError(AIErrorCode.UNSUPPORTED, `Cannot set both thinkingBudget and thinkingLevel in a config.`);
    }
    if (
    // != allows for null and undefined.
    generationConfig.responseSchema != null &&
        generationConfig.responseJsonSchema != null) {
        throw new AIError(AIErrorCode.UNSUPPORTED, `Cannot set both responseSchema and responseJsonSchema in a config.`);
    }
    if ((generationConfig.responseSchema != null ||
        generationConfig.responseJsonSchema != null) &&
        generationConfig.responseMimeType) {
        throw new AIError(AIErrorCode.UNSUPPORTED, `responseMimeType must be set if responseSchema or responseJsonSchema are set.`);
    }
}

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
/**
 * Represents an active, real-time, bidirectional conversation with the model.
 *
 * This class should only be instantiated by calling {@link LiveGenerativeModel.connect}.
 *
 * @beta
 */
class LiveSession {
    /**
     * @internal
     */
    constructor(webSocketHandler, serverMessages) {
        this.webSocketHandler = webSocketHandler;
        this.serverMessages = serverMessages;
        /**
         * Indicates whether this Live session is closed.
         *
         * @beta
         */
        this.isClosed = false;
        /**
         * Indicates whether this Live session is being controlled by an `AudioConversationController`.
         *
         * @beta
         */
        this.inConversation = false;
    }
    /**
     * Sends content to the server.
     *
     * @param request - The message to send to the model.
     * @param turnComplete - Indicates if the turn is complete. Defaults to false.
     * @throws If this session has been closed.
     *
     * @beta
     */
    async send(request, turnComplete = true) {
        if (this.isClosed) {
            throw new AIError(AIErrorCode.REQUEST_ERROR, 'This LiveSession has been closed and cannot be used.');
        }
        const newContent = formatNewContent(request);
        const message = {
            clientContent: {
                turns: [newContent],
                turnComplete
            }
        };
        this.webSocketHandler.send(JSON.stringify(message));
    }
    /**
     * Sends text to the server in realtime.
     *
     * @example
     * ```javascript
     * liveSession.sendTextRealtime("Hello, how are you?");
     * ```
     *
     * @param text - The text data to send.
     * @throws If this session has been closed.
     *
     * @beta
     */
    async sendTextRealtime(text) {
        if (this.isClosed) {
            throw new AIError(AIErrorCode.REQUEST_ERROR, 'This LiveSession has been closed and cannot be used.');
        }
        const message = {
            realtimeInput: {
                text
            }
        };
        this.webSocketHandler.send(JSON.stringify(message));
    }
    /**
     * Sends audio data to the server in realtime.
     *
     * @remarks The server requires that the audio data is base64-encoded 16-bit PCM at 16kHz
     * little-endian.
     *
     * @example
     * ```javascript
     * // const pcmData = ... base64-encoded 16-bit PCM at 16kHz little-endian.
     * const blob = { mimeType: "audio/pcm", data: pcmData };
     * liveSession.sendAudioRealtime(blob);
     * ```
     *
     * @param blob - The base64-encoded PCM data to send to the server in realtime.
     * @throws If this session has been closed.
     *
     * @beta
     */
    async sendAudioRealtime(blob) {
        if (this.isClosed) {
            throw new AIError(AIErrorCode.REQUEST_ERROR, 'This LiveSession has been closed and cannot be used.');
        }
        const message = {
            realtimeInput: {
                audio: blob
            }
        };
        this.webSocketHandler.send(JSON.stringify(message));
    }
    /**
     * Sends video data to the server in realtime.
     *
     * @remarks The server requires that the video is sent as individual video frames at 1 FPS. It
     * is recommended to set `mimeType` to `image/jpeg`.
     *
     * @example
     * ```javascript
     * // const videoFrame = ... base64-encoded JPEG data
     * const blob = { mimeType: "image/jpeg", data: videoFrame };
     * liveSession.sendVideoRealtime(blob);
     * ```
     * @param blob - The base64-encoded video data to send to the server in realtime.
     * @throws If this session has been closed.
     *
     * @beta
     */
    async sendVideoRealtime(blob) {
        if (this.isClosed) {
            throw new AIError(AIErrorCode.REQUEST_ERROR, 'This LiveSession has been closed and cannot be used.');
        }
        const message = {
            realtimeInput: {
                video: blob
            }
        };
        this.webSocketHandler.send(JSON.stringify(message));
    }
    /**
     * Sends function responses to the server.
     *
     * @param functionResponses - The function responses to send.
     * @throws If this session has been closed.
     *
     * @beta
     */
    async sendFunctionResponses(functionResponses) {
        if (this.isClosed) {
            throw new AIError(AIErrorCode.REQUEST_ERROR, 'This LiveSession has been closed and cannot be used.');
        }
        const message = {
            toolResponse: {
                functionResponses
            }
        };
        this.webSocketHandler.send(JSON.stringify(message));
    }
    /**
     * Yields messages received from the server.
     * This can only be used by one consumer at a time.
     *
     * @returns An `AsyncGenerator` that yields server messages as they arrive.
     * @throws If the session is already closed, or if we receive a response that we don't support.
     *
     * @beta
     */
    async *receive() {
        if (this.isClosed) {
            throw new AIError(AIErrorCode.SESSION_CLOSED, 'Cannot read from a Live session that is closed. Try starting a new Live session.');
        }
        for await (const message of this.serverMessages) {
            if (message && typeof message === 'object') {
                if (LiveResponseType.SERVER_CONTENT in message) {
                    yield {
                        type: 'serverContent',
                        ...message
                            .serverContent
                    };
                }
                else if (LiveResponseType.TOOL_CALL in message) {
                    yield {
                        type: 'toolCall',
                        ...message
                            .toolCall
                    };
                }
                else if (LiveResponseType.TOOL_CALL_CANCELLATION in message) {
                    yield {
                        type: 'toolCallCancellation',
                        ...message.toolCallCancellation
                    };
                }
                else if ('goAway' in message) {
                    const notice = message.goAway;
                    yield {
                        type: LiveResponseType.GOING_AWAY_NOTICE,
                        timeLeft: parseDuration(notice.timeLeft)
                    };
                }
                else {
                    logger.warn(`Received an unknown message type from the server: ${JSON.stringify(message)}`);
                }
            }
            else {
                logger.warn(`Received an invalid message from the server: ${JSON.stringify(message)}`);
            }
        }
    }
    /**
     * Closes this session.
     * All methods on this session will throw an error once this resolves.
     *
     * @beta
     */
    async close() {
        if (!this.isClosed) {
            this.isClosed = true;
            await this.webSocketHandler.close(1000, 'Client closed session.');
        }
    }
    /**
     * Sends realtime input to the server.
     *
     * @deprecated Use `sendTextRealtime()`, `sendAudioRealtime()`, and `sendVideoRealtime()` instead.
     *
     * @param mediaChunks - The media chunks to send.
     * @throws If this session has been closed.
     *
     * @beta
     */
    async sendMediaChunks(mediaChunks) {
        if (this.isClosed) {
            throw new AIError(AIErrorCode.REQUEST_ERROR, 'This LiveSession has been closed and cannot be used.');
        }
        // The backend does not support sending more than one mediaChunk in one message.
        // Work around this limitation by sending mediaChunks in separate messages.
        mediaChunks.forEach(mediaChunk => {
            const message = {
                realtimeInput: { mediaChunks: [mediaChunk] }
            };
            this.webSocketHandler.send(JSON.stringify(message));
        });
    }
    /**
     * @deprecated Use `sendTextRealtime()`, `sendAudioRealtime()`, and `sendVideoRealtime()` instead.
     *
     * Sends a stream of {@link GenerativeContentBlob}.
     *
     * @param mediaChunkStream - The stream of {@link GenerativeContentBlob} to send.
     * @throws If this session has been closed.
     *
     * @beta
     */
    async sendMediaStream(mediaChunkStream) {
        if (this.isClosed) {
            throw new AIError(AIErrorCode.REQUEST_ERROR, 'This LiveSession has been closed and cannot be used.');
        }
        const reader = mediaChunkStream.getReader();
        while (true) {
            try {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                else if (!value) {
                    throw new Error('Missing chunk in reader, but reader is not done.');
                }
                await this.sendMediaChunks([value]);
            }
            catch (e) {
                // Re-throw any errors that occur during stream consumption or sending.
                const message = e instanceof Error ? e.message : 'Error processing media stream.';
                throw new AIError(AIErrorCode.REQUEST_ERROR, message);
            }
        }
    }
}
/**
 * Parses a duration string (e.g. "3.000000001s") into a number of seconds.
 *
 * @param duration - The duration string to parse.
 * @returns The duration in seconds.
 */
function parseDuration(duration) {
    if (!duration || !duration.endsWith('s')) {
        return 0;
    }
    return Number(duration.slice(0, -1)); // slice removes the trailing 's'.
}

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
/**
 * Class for Live generative model APIs. The Live API enables low-latency, two-way multimodal
 * interactions with Gemini.
 *
 * This class should only be instantiated with {@link getLiveGenerativeModel}.
 *
 * @beta
 */
class LiveGenerativeModel extends AIModel {
    /**
     * @internal
     */
    constructor(ai, modelParams, 
    /**
     * @internal
     */
    _webSocketHandler) {
        super(ai, modelParams.model);
        this._webSocketHandler = _webSocketHandler;
        this.generationConfig = modelParams.generationConfig || {};
        this.tools = modelParams.tools;
        this.toolConfig = modelParams.toolConfig;
        this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
    }
    /**
     * Starts a {@link LiveSession}.
     *
     * @returns A {@link LiveSession}.
     * @throws If the connection failed to be established with the server.
     *
     * @beta
     */
    async connect() {
        const url = new WebSocketUrl(this._apiSettings);
        await this._webSocketHandler.connect(url.toString());
        let fullModelPath;
        if (this._apiSettings.backend.backendType === BackendType.GOOGLE_AI) {
            fullModelPath = `projects/${this._apiSettings.project}/${this.model}`;
        }
        else {
            fullModelPath = `projects/${this._apiSettings.project}/locations/${this._apiSettings.location}/${this.model}`;
        }
        // inputAudioTranscription and outputAudioTranscription are on the generation config in the public API,
        // but the backend expects them to be in the `setup` message.
        const { inputAudioTranscription, outputAudioTranscription, ...generationConfig } = this.generationConfig;
        const setupMessage = {
            setup: {
                model: fullModelPath,
                generationConfig,
                tools: this.tools,
                toolConfig: this.toolConfig,
                systemInstruction: this.systemInstruction,
                inputAudioTranscription,
                outputAudioTranscription
            }
        };
        try {
            // Begin listening for server messages, and begin the handshake by sending the 'setupMessage'
            const serverMessages = this._webSocketHandler.listen();
            this._webSocketHandler.send(JSON.stringify(setupMessage));
            // Verify we received the handshake response 'setupComplete'
            const firstMessage = (await serverMessages.next()).value;
            if (!firstMessage ||
                !(typeof firstMessage === 'object') ||
                !('setupComplete' in firstMessage)) {
                await this._webSocketHandler.close(1011, 'Handshake failure');
                throw new AIError(AIErrorCode.RESPONSE_ERROR, 'Server connection handshake failed. The server did not respond with a setupComplete message.');
            }
            return new LiveSession(this._webSocketHandler, serverMessages);
        }
        catch (e) {
            // Ensure connection is closed on any setup error
            await this._webSocketHandler.close();
            throw e;
        }
    }
}

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
/**
 * Class for Imagen model APIs.
 *
 * This class provides methods for generating images using the Imagen model.
 *
 * @example
 * ```javascript
 * const imagen = new ImagenModel(
 *   ai,
 *   {
 *     model: 'imagen-3.0-generate-002'
 *   }
 * );
 *
 * const response = await imagen.generateImages('A photo of a cat');
 * if (response.images.length > 0) {
 *   console.log(response.images[0].bytesBase64Encoded);
 * }
 * ```
 *
 * @public
 */
class ImagenModel extends AIModel {
    /**
     * Constructs a new instance of the {@link ImagenModel} class.
     *
     * @param ai - an {@link AI} instance.
     * @param modelParams - Parameters to use when making requests to Imagen.
     * @param requestOptions - Additional options to use when making requests.
     *
     * @throws If the `apiKey` or `projectId` fields are missing in your
     * Firebase config.
     */
    constructor(ai, modelParams, requestOptions) {
        const { model, generationConfig, safetySettings } = modelParams;
        super(ai, model);
        this.requestOptions = requestOptions;
        this.generationConfig = generationConfig;
        this.safetySettings = safetySettings;
    }
    /**
     * Generates images using the Imagen model and returns them as
     * base64-encoded strings.
     *
     * @param prompt - A text prompt describing the image(s) to generate.
     * @returns A promise that resolves to an {@link ImagenGenerationResponse}
     * object containing the generated images.
     *
     * @throws If the request to generate images fails. This happens if the
     * prompt is blocked.
     *
     * @remarks
     * If the prompt was not blocked, but one or more of the generated images were filtered, the
     * returned object will have a `filteredReason` property.
     * If all images are filtered, the `images` array will be empty.
     *
     * @public
     */
    async generateImages(prompt, singleRequestOptions) {
        const body = createPredictRequestBody(prompt, {
            ...this.generationConfig,
            ...this.safetySettings
        });
        const response = await makeRequest({
            task: "predict" /* Task.PREDICT */,
            model: this.model,
            apiSettings: this._apiSettings,
            stream: false,
            // Merge request options. Single request options overwrite the model's request options.
            singleRequestOptions: {
                ...this.requestOptions,
                ...singleRequestOptions
            }
        }, JSON.stringify(body));
        return handlePredictResponse(response);
    }
    /**
     * Generates images to Cloud Storage for Firebase using the Imagen model.
     *
     * @internal This method is temporarily internal.
     *
     * @param prompt - A text prompt describing the image(s) to generate.
     * @param gcsURI - The URI of file stored in a Cloud Storage for Firebase bucket.
     * This should be a directory. For example, `gs://my-bucket/my-directory/`.
     * @returns A promise that resolves to an {@link ImagenGenerationResponse}
     * object containing the URLs of the generated images.
     *
     * @throws If the request fails to generate images fails. This happens if
     * the prompt is blocked.
     *
     * @remarks
     * If the prompt was not blocked, but one or more of the generated images were filtered, the
     * returned object will have a `filteredReason` property.
     * If all images are filtered, the `images` array will be empty.
     */
    async generateImagesGCS(prompt, gcsURI, singleRequestOptions) {
        const body = createPredictRequestBody(prompt, {
            gcsURI,
            ...this.generationConfig,
            ...this.safetySettings
        });
        const response = await makeRequest({
            task: "predict" /* Task.PREDICT */,
            model: this.model,
            apiSettings: this._apiSettings,
            stream: false,
            // Merge request options. Single request options overwrite the model's request options.
            singleRequestOptions: {
                ...this.requestOptions,
                ...singleRequestOptions
            }
        }, JSON.stringify(body));
        return handlePredictResponse(response);
    }
}

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
/**
 * A wrapper for the native `WebSocket` available in both Browsers and Node >= 22.
 *
 * @internal
 */
class WebSocketHandlerImpl {
    constructor() {
        if (typeof WebSocket === 'undefined') {
            throw new AIError(AIErrorCode.UNSUPPORTED, 'The WebSocket API is not available in this environment. ' +
                'The "Live" feature is not supported here. It is supported in ' +
                'modern browser windows, Web Workers with WebSocket support, and Node >= 22.');
        }
    }
    connect(url) {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(url);
            this.ws.binaryType = 'blob'; // Only important to set in Node
            this.ws.addEventListener('open', () => resolve(), { once: true });
            this.ws.addEventListener('error', () => reject(new AIError(AIErrorCode.FETCH_ERROR, `Error event raised on WebSocket`)), { once: true });
            this.ws.addEventListener('close', (closeEvent) => {
                if (closeEvent.reason) {
                    logger.warn(`WebSocket connection closed by server. Reason: '${closeEvent.reason}'`);
                }
            });
        });
    }
    send(data) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new AIError(AIErrorCode.REQUEST_ERROR, 'WebSocket is not open.');
        }
        this.ws.send(data);
    }
    async *listen() {
        if (!this.ws) {
            throw new AIError(AIErrorCode.REQUEST_ERROR, 'WebSocket is not connected.');
        }
        const messageQueue = [];
        const errorQueue = [];
        let resolvePromise = null;
        let isClosed = false;
        const messageListener = async (event) => {
            let data;
            if (event.data instanceof Blob) {
                data = await event.data.text();
            }
            else if (typeof event.data === 'string') {
                data = event.data;
            }
            else {
                errorQueue.push(new AIError(AIErrorCode.PARSE_FAILED, `Failed to parse WebSocket response. Expected data to be a Blob or string, but was ${typeof event.data}.`));
                if (resolvePromise) {
                    resolvePromise();
                    resolvePromise = null;
                }
                return;
            }
            try {
                const obj = JSON.parse(data);
                messageQueue.push(obj);
            }
            catch (e) {
                const err = e;
                errorQueue.push(new AIError(AIErrorCode.PARSE_FAILED, `Error parsing WebSocket message to JSON: ${err.message}`));
            }
            if (resolvePromise) {
                resolvePromise();
                resolvePromise = null;
            }
        };
        const errorListener = () => {
            errorQueue.push(new AIError(AIErrorCode.FETCH_ERROR, 'WebSocket connection error.'));
            if (resolvePromise) {
                resolvePromise();
                resolvePromise = null;
            }
        };
        const closeListener = (event) => {
            if (event.reason) {
                logger.warn(`WebSocket connection closed by the server with reason: ${event.reason}`);
            }
            isClosed = true;
            if (resolvePromise) {
                resolvePromise();
                resolvePromise = null;
            }
            // Clean up listeners to prevent memory leaks
            this.ws?.removeEventListener('message', messageListener);
            this.ws?.removeEventListener('close', closeListener);
            this.ws?.removeEventListener('error', errorListener);
        };
        this.ws.addEventListener('message', messageListener);
        this.ws.addEventListener('close', closeListener);
        this.ws.addEventListener('error', errorListener);
        while (!isClosed) {
            if (errorQueue.length > 0) {
                const error = errorQueue.shift();
                throw error;
            }
            if (messageQueue.length > 0) {
                yield messageQueue.shift();
            }
            else {
                await new Promise(resolve => {
                    resolvePromise = resolve;
                });
            }
        }
        // If the loop terminated because isClosed is true, check for any final errors
        if (errorQueue.length > 0) {
            const error = errorQueue.shift();
            throw error;
        }
    }
    close(code, reason) {
        return new Promise(resolve => {
            if (!this.ws) {
                return resolve();
            }
            this.ws.addEventListener('close', () => resolve(), { once: true });
            // Calling 'close' during these states results in an error.
            if (this.ws.readyState === WebSocket.CLOSED ||
                this.ws.readyState === WebSocket.CONNECTING) {
                return resolve();
            }
            if (this.ws.readyState !== WebSocket.CLOSING) {
                this.ws.close(code, reason);
            }
        });
    }
}

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
/**
 * {@link GenerativeModel} APIs that execute on a server-side template.
 *
 * This class should only be instantiated with {@link getTemplateGenerativeModel}.
 *
 * @beta
 */
class TemplateGenerativeModel {
    /**
     * @hideconstructor
     */
    constructor(ai, requestOptions) {
        this.requestOptions = requestOptions || {};
        this._apiSettings = initApiSettings(ai);
    }
    /**
     * Makes a single non-streaming call to the model and returns an object
     * containing a single {@link GenerateContentResponse}.
     *
     * @param templateId - The ID of the server-side template to execute.
     * @param templateVariables - A key-value map of variables to populate the
     * template with.
     *
     * @beta
     */
    async generateContent(templateId, templateVariables, singleRequestOptions) {
        return templateGenerateContent(this._apiSettings, templateId, { inputs: templateVariables }, {
            ...this.requestOptions,
            ...singleRequestOptions
        });
    }
    /**
     * Makes a single streaming call to the model and returns an object
     * containing an iterable stream that iterates over all chunks in the
     * streaming response as well as a promise that returns the final aggregated
     * response.
     *
     * @param templateId - The ID of the server-side template to execute.
     * @param templateVariables - A key-value map of variables to populate the
     * template with.
     *
     * @beta
     */
    async generateContentStream(templateId, templateVariables, singleRequestOptions) {
        return templateGenerateContentStream(this._apiSettings, templateId, { inputs: templateVariables }, {
            ...this.requestOptions,
            ...singleRequestOptions
        });
    }
}

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
/**
 * Class for Imagen model APIs that execute on a server-side template.
 *
 * This class should only be instantiated with {@link getTemplateImagenModel}.
 *
 * @beta
 */
class TemplateImagenModel {
    /**
     * @hideconstructor
     */
    constructor(ai, requestOptions) {
        this.requestOptions = requestOptions || {};
        this._apiSettings = initApiSettings(ai);
    }
    /**
     * Makes a single call to the model and returns an object containing a single
     * {@link ImagenGenerationResponse}.
     *
     * @param templateId - The ID of the server-side template to execute.
     * @param templateVariables - A key-value map of variables to populate the
     * template with.
     *
     * @beta
     */
    async generateImages(templateId, templateVariables, singleRequestOptions) {
        const response = await makeRequest({
            task: "templatePredict" /* ServerPromptTemplateTask.TEMPLATE_PREDICT */,
            templateId,
            apiSettings: this._apiSettings,
            stream: false,
            singleRequestOptions: {
                ...this.requestOptions,
                ...singleRequestOptions
            }
        }, JSON.stringify({ inputs: templateVariables }));
        return handlePredictResponse(response);
    }
}

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
 * Parent class encompassing all Schema types, with static methods that
 * allow building specific Schema types. This class can be converted with
 * `JSON.stringify()` into a JSON string accepted by Vertex AI REST endpoints.
 * (This string conversion is automatically done when calling SDK methods.)
 * @public
 */
class Schema {
    constructor(schemaParams) {
        // TODO(dlarocque): Enforce this with union types
        if (!schemaParams.type && !schemaParams.anyOf) {
            throw new AIError(AIErrorCode.INVALID_SCHEMA, "A schema must have either a 'type' or an 'anyOf' array of sub-schemas.");
        }
        // eslint-disable-next-line guard-for-in
        for (const paramKey in schemaParams) {
            this[paramKey] = schemaParams[paramKey];
        }
        // Ensure these are explicitly set to avoid TS errors.
        this.type = schemaParams.type;
        this.format = schemaParams.hasOwnProperty('format')
            ? schemaParams.format
            : undefined;
        this.nullable = schemaParams.hasOwnProperty('nullable')
            ? !!schemaParams.nullable
            : false;
    }
    /**
     * Defines how this Schema should be serialized as JSON.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
     * @internal
     */
    toJSON() {
        const obj = {
            type: this.type
        };
        for (const prop in this) {
            if (this.hasOwnProperty(prop) && this[prop] !== undefined) {
                if (prop !== 'required' || this.type === SchemaType.OBJECT) {
                    obj[prop] = this[prop];
                }
            }
        }
        return obj;
    }
    static array(arrayParams) {
        return new ArraySchema(arrayParams, arrayParams.items);
    }
    static object(objectParams) {
        return new ObjectSchema(objectParams, objectParams.properties, objectParams.optionalProperties);
    }
    // eslint-disable-next-line id-blacklist
    static string(stringParams) {
        return new StringSchema(stringParams);
    }
    static enumString(stringParams) {
        return new StringSchema(stringParams, stringParams.enum);
    }
    static integer(integerParams) {
        return new IntegerSchema(integerParams);
    }
    // eslint-disable-next-line id-blacklist
    static number(numberParams) {
        return new NumberSchema(numberParams);
    }
    // eslint-disable-next-line id-blacklist
    static boolean(booleanParams) {
        return new BooleanSchema(booleanParams);
    }
    static anyOf(anyOfParams) {
        return new AnyOfSchema(anyOfParams);
    }
}
/**
 * Schema class for "integer" types.
 * @public
 */
class IntegerSchema extends Schema {
    constructor(schemaParams) {
        super({
            type: SchemaType.INTEGER,
            ...schemaParams
        });
    }
}
/**
 * Schema class for "number" types.
 * @public
 */
class NumberSchema extends Schema {
    constructor(schemaParams) {
        super({
            type: SchemaType.NUMBER,
            ...schemaParams
        });
    }
}
/**
 * Schema class for "boolean" types.
 * @public
 */
class BooleanSchema extends Schema {
    constructor(schemaParams) {
        super({
            type: SchemaType.BOOLEAN,
            ...schemaParams
        });
    }
}
/**
 * Schema class for "string" types. Can be used with or without
 * enum values.
 * @public
 */
class StringSchema extends Schema {
    constructor(schemaParams, enumValues) {
        super({
            type: SchemaType.STRING,
            ...schemaParams
        });
        this.enum = enumValues;
    }
    /**
     * @internal
     */
    toJSON() {
        const obj = super.toJSON();
        if (this.enum) {
            obj['enum'] = this.enum;
        }
        return obj;
    }
}
/**
 * Schema class for "array" types.
 * The `items` param should refer to the type of item that can be a member
 * of the array.
 * @public
 */
class ArraySchema extends Schema {
    constructor(schemaParams, items) {
        super({
            type: SchemaType.ARRAY,
            ...schemaParams
        });
        this.items = items;
    }
    /**
     * @internal
     */
    toJSON() {
        const obj = super.toJSON();
        obj.items = this.items.toJSON();
        return obj;
    }
}
/**
 * Schema class for "object" types.
 * The `properties` param must be a map of `Schema` objects.
 * @public
 */
class ObjectSchema extends Schema {
    constructor(schemaParams, properties, optionalProperties = []) {
        super({
            type: SchemaType.OBJECT,
            ...schemaParams
        });
        this.properties = properties;
        this.optionalProperties = optionalProperties;
    }
    /**
     * @internal
     */
    toJSON() {
        const obj = super.toJSON();
        obj.properties = { ...this.properties };
        const required = [];
        if (this.optionalProperties) {
            for (const propertyKey of this.optionalProperties) {
                if (!this.properties.hasOwnProperty(propertyKey)) {
                    throw new AIError(AIErrorCode.INVALID_SCHEMA, `Property "${propertyKey}" specified in "optionalProperties" does not exist.`);
                }
            }
        }
        for (const propertyKey in this.properties) {
            if (this.properties.hasOwnProperty(propertyKey)) {
                obj.properties[propertyKey] = this.properties[propertyKey].toJSON();
                if (!this.optionalProperties.includes(propertyKey)) {
                    required.push(propertyKey);
                }
            }
        }
        if (required.length > 0) {
            obj.required = required;
        }
        delete obj.optionalProperties;
        return obj;
    }
}
/**
 * Schema class representing a value that can conform to any of the provided sub-schemas. This is
 * useful when a field can accept multiple distinct types or structures.
 * @public
 */
class AnyOfSchema extends Schema {
    constructor(schemaParams) {
        if (schemaParams.anyOf.length === 0) {
            throw new AIError(AIErrorCode.INVALID_SCHEMA, "The 'anyOf' array must not be empty.");
        }
        super({
            ...schemaParams,
            type: undefined // anyOf schemas do not have an explicit type
        });
        this.anyOf = schemaParams.anyOf;
    }
    /**
     * @internal
     */
    toJSON() {
        const obj = super.toJSON();
        // Ensure the 'anyOf' property contains serialized SchemaRequest objects.
        if (this.anyOf && Array.isArray(this.anyOf)) {
            obj.anyOf = this.anyOf.map(s => s.toJSON());
        }
        return obj;
    }
}

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
/**
 * Defines the image format for images generated by Imagen.
 *
 * Use this class to specify the desired format (JPEG or PNG) and compression quality
 * for images generated by Imagen. This is typically included as part of
 * {@link ImagenModelParams}.
 *
 * @example
 * ```javascript
 * const imagenModelParams = {
 *   // ... other ImagenModelParams
 *   imageFormat: ImagenImageFormat.jpeg(75) // JPEG with a compression level of 75.
 * }
 * ```
 *
 * @public
 */
class ImagenImageFormat {
    constructor() {
        this.mimeType = 'image/png';
    }
    /**
     * Creates an {@link ImagenImageFormat} for a JPEG image.
     *
     * @param compressionQuality - The level of compression (a number between 0 and 100).
     * @returns An {@link ImagenImageFormat} object for a JPEG image.
     *
     * @public
     */
    static jpeg(compressionQuality) {
        if (compressionQuality &&
            (compressionQuality < 0 || compressionQuality > 100)) {
            logger.warn(`Invalid JPEG compression quality of ${compressionQuality} specified; the supported range is [0, 100].`);
        }
        return { mimeType: 'image/jpeg', compressionQuality };
    }
    /**
     * Creates an {@link ImagenImageFormat} for a PNG image.
     *
     * @returns An {@link ImagenImageFormat} object for a PNG image.
     *
     * @public
     */
    static png() {
        return { mimeType: 'image/png' };
    }
}

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
const SERVER_INPUT_SAMPLE_RATE = 16000;
const SERVER_OUTPUT_SAMPLE_RATE = 24000;
const AUDIO_PROCESSOR_NAME = 'audio-processor';
/**
 * The JS for an `AudioWorkletProcessor`.
 * This processor is responsible for taking raw audio from the microphone,
 * converting it to the required 16-bit 16kHz PCM, and posting it back to the main thread.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
 *
 * It is defined as a string here so that it can be converted into a `Blob`
 * and loaded at runtime.
 */
const audioProcessorWorkletString = `
  class AudioProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      this.targetSampleRate = options.processorOptions.targetSampleRate;
      // 'sampleRate' is a global variable available inside the AudioWorkletGlobalScope,
      // representing the native sample rate of the AudioContext.
      this.inputSampleRate = sampleRate;
    }

    /**
     * This method is called by the browser's audio engine for each block of audio data.
     * Input is a single input, with a single channel (input[0][0]).
     */
    process(inputs) {
      const input = inputs[0];
      if (input && input.length > 0 && input[0].length > 0) {
        const pcmData = input[0]; // Float32Array of raw audio samples.
        
        // Simple linear interpolation for resampling.
        const resampled = new Float32Array(Math.round(pcmData.length * this.targetSampleRate / this.inputSampleRate));
        const ratio = pcmData.length / resampled.length;
        for (let i = 0; i < resampled.length; i++) {
          resampled[i] = pcmData[Math.floor(i * ratio)];
        }

        // Convert Float32 (-1, 1) samples to Int16 (-32768, 32767)
        const resampledInt16 = new Int16Array(resampled.length);
        for (let i = 0; i < resampled.length; i++) {
          const sample = Math.max(-1, Math.min(1, resampled[i]));
          if (sample < 0) {
            resampledInt16[i] = sample * 32768;
          } else {
            resampledInt16[i] = sample * 32767;
          }
        }
        
        this.port.postMessage(resampledInt16);
      }
      // Return true to keep the processor alive and processing the next audio block.
      return true;
    }
  }

  // Register the processor with a name that can be used to instantiate it from the main thread.
  registerProcessor('${AUDIO_PROCESSOR_NAME}', AudioProcessor);
`;
/**
 * Encapsulates the core logic of an audio conversation.
 *
 * @internal
 */
class AudioConversationRunner {
    constructor(liveSession, options, deps) {
        this.liveSession = liveSession;
        this.options = options;
        this.deps = deps;
        /** A flag to indicate if the conversation has been stopped. */
        this.isStopped = false;
        /** A deferred that contains a promise that is resolved when stop() is called, to unblock the receive loop. */
        this.stopDeferred = new Deferred();
        /** A FIFO queue of 24kHz, 16-bit PCM audio chunks received from the server. */
        this.playbackQueue = [];
        /** Tracks scheduled audio sources. Used to cancel scheduled audio when the model is interrupted. */
        this.scheduledSources = [];
        /** A high-precision timeline pointer for scheduling gapless audio playback. */
        this.nextStartTime = 0;
        /** A mutex to prevent the playback processing loop from running multiple times concurrently. */
        this.isPlaybackLoopRunning = false;
        this.liveSession.inConversation = true;
        // Start listening for messages from the server.
        this.receiveLoopPromise = this.runReceiveLoop().finally(() => this.cleanup());
        // Set up the handler for receiving processed audio data from the worklet.
        // Message data has been resampled to 16kHz 16-bit PCM.
        this.deps.workletNode.port.onmessage = event => {
            if (this.isStopped) {
                return;
            }
            const pcm16 = event.data;
            const base64 = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(pcm16.buffer))));
            const chunk = {
                mimeType: 'audio/pcm',
                data: base64
            };
            void this.liveSession.sendAudioRealtime(chunk);
        };
    }
    /**
     * Stops the conversation and unblocks the main receive loop.
     */
    async stop() {
        if (this.isStopped) {
            return;
        }
        this.isStopped = true;
        this.stopDeferred.resolve(); // Unblock the receive loop
        await this.receiveLoopPromise; // Wait for the loop and cleanup to finish
    }
    /**
     * Cleans up all audio resources (nodes, stream tracks, context) and marks the
     * session as no longer in a conversation.
     */
    cleanup() {
        this.interruptPlayback(); // Ensure all audio is stopped on final cleanup.
        this.deps.workletNode.port.onmessage = null;
        this.deps.workletNode.disconnect();
        this.deps.sourceNode.disconnect();
        this.deps.mediaStream.getTracks().forEach(track => track.stop());
        if (this.deps.audioContext.state !== 'closed') {
            void this.deps.audioContext.close();
        }
        this.liveSession.inConversation = false;
    }
    /**
     * Adds audio data to the queue and ensures the playback loop is running.
     */
    enqueueAndPlay(audioData) {
        this.playbackQueue.push(audioData);
        // Will no-op if it's already running.
        void this.processPlaybackQueue();
    }
    /**
     * Stops all current and pending audio playback and clears the queue. This is
     * called when the server indicates the model's speech was interrupted with
     * `LiveServerContent.modelTurn.interrupted`.
     */
    interruptPlayback() {
        // Stop all sources that have been scheduled. The onended event will fire for each,
        // which will clean up the scheduledSources array.
        [...this.scheduledSources].forEach(source => source.stop(0));
        // Clear the internal buffer of unprocessed audio chunks.
        this.playbackQueue.length = 0;
        // Reset the playback clock to start fresh.
        this.nextStartTime = this.deps.audioContext.currentTime;
    }
    /**
     * Processes the playback queue in a loop, scheduling each chunk in a gapless sequence.
     */
    async processPlaybackQueue() {
        if (this.isPlaybackLoopRunning) {
            return;
        }
        this.isPlaybackLoopRunning = true;
        while (this.playbackQueue.length > 0 && !this.isStopped) {
            const pcmRawBuffer = this.playbackQueue.shift();
            try {
                const pcm16 = new Int16Array(pcmRawBuffer);
                const frameCount = pcm16.length;
                const audioBuffer = this.deps.audioContext.createBuffer(1, frameCount, SERVER_OUTPUT_SAMPLE_RATE);
                // Convert 16-bit PCM to 32-bit PCM, required by the Web Audio API.
                const channelData = audioBuffer.getChannelData(0);
                for (let i = 0; i < frameCount; i++) {
                    channelData[i] = pcm16[i] / 32768; // Normalize to Float32 range [-1.0, 1.0]
                }
                const source = this.deps.audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(this.deps.audioContext.destination);
                // Track the source and set up a handler to remove it from tracking when it finishes.
                this.scheduledSources.push(source);
                source.onended = () => {
                    this.scheduledSources = this.scheduledSources.filter(s => s !== source);
                };
                // To prevent gaps, schedule the next chunk to start either now (if we're catching up)
                // or exactly when the previous chunk is scheduled to end.
                this.nextStartTime = Math.max(this.deps.audioContext.currentTime, this.nextStartTime);
                source.start(this.nextStartTime);
                // Update the schedule for the *next* chunk.
                this.nextStartTime += audioBuffer.duration;
            }
            catch (e) {
                logger.error('Error playing audio:', e);
            }
        }
        this.isPlaybackLoopRunning = false;
    }
    /**
     * The main loop that listens for and processes messages from the server.
     */
    async runReceiveLoop() {
        const messageGenerator = this.liveSession.receive();
        while (!this.isStopped) {
            const result = await Promise.race([
                messageGenerator.next(),
                this.stopDeferred.promise
            ]);
            if (this.isStopped || !result || result.done) {
                break;
            }
            const message = result.value;
            if (message.type === 'serverContent') {
                const serverContent = message;
                if (serverContent.interrupted) {
                    this.interruptPlayback();
                }
                const audioPart = serverContent.modelTurn?.parts.find(part => part.inlineData?.mimeType.startsWith('audio/'));
                if (audioPart?.inlineData) {
                    const audioData = Uint8Array.from(atob(audioPart.inlineData.data), c => c.charCodeAt(0)).buffer;
                    this.enqueueAndPlay(audioData);
                }
            }
            else if (message.type === 'toolCall') {
                if (!this.options.functionCallingHandler) {
                    logger.warn('Received tool call message, but StartAudioConversationOptions.functionCallingHandler is undefined. Ignoring tool call.');
                }
                else {
                    try {
                        const functionResponse = await this.options.functionCallingHandler(message.functionCalls);
                        if (!this.isStopped) {
                            void this.liveSession.sendFunctionResponses([functionResponse]);
                        }
                    }
                    catch (e) {
                        throw new AIError(AIErrorCode.ERROR, `Function calling handler failed: ${e.message}`);
                    }
                }
            }
        }
    }
}
/**
 * Starts a real-time, bidirectional audio conversation with the model. This helper function manages
 * the complexities of microphone access, audio recording, playback, and interruptions.
 *
 * @remarks Important: This function must be called in response to a user gesture
 * (for example, a button click) to comply with {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices#autoplay_policy | browser autoplay policies}.
 *
 * @example
 * ```javascript
 * const liveSession = await model.connect();
 * let conversationController;
 *
 * // This function must be called from within a click handler.
 * async function startConversation() {
 *   try {
 *     conversationController = await startAudioConversation(liveSession);
 *   } catch (e) {
 *     // Handle AI-specific errors
 *     if (e instanceof AIError) {
 *       console.error("AI Error:", e.message);
 *     }
 *     // Handle microphone permission and hardware errors
 *     else if (e instanceof DOMException) {
 *       console.error("Microphone Error:", e.message);
 *     }
 *     // Handle other unexpected errors
 *     else {
 *       console.error("An unexpected error occurred:", e);
 *     }
 *   }
 * }
 *
 * // Later, to stop the conversation:
 * // if (conversationController) {
 * //   await conversationController.stop();
 * // }
 * ```
 *
 * @param liveSession - An active {@link LiveSession} instance.
 * @param options - Configuration options for the audio conversation.
 * @returns A `Promise` that resolves with an {@link AudioConversationController}.
 * @throws `AIError` if the environment does not support required Web APIs (`UNSUPPORTED`), if a conversation is already active (`REQUEST_ERROR`), the session is closed (`SESSION_CLOSED`), or if an unexpected initialization error occurs (`ERROR`).
 * @throws `DOMException` Thrown by `navigator.mediaDevices.getUserMedia()` if issues occur with microphone access, such as permissions being denied (`NotAllowedError`) or no compatible hardware being found (`NotFoundError`). See the {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#exceptions | MDN documentation} for a full list of exceptions.
 *
 * @beta
 */
async function startAudioConversation(liveSession, options = {}) {
    if (liveSession.isClosed) {
        throw new AIError(AIErrorCode.SESSION_CLOSED, 'Cannot start audio conversation on a closed LiveSession.');
    }
    if (liveSession.inConversation) {
        throw new AIError(AIErrorCode.REQUEST_ERROR, 'An audio conversation is already in progress for this session.');
    }
    // Check for necessary Web API support.
    if (typeof AudioWorkletNode === 'undefined' ||
        typeof AudioContext === 'undefined' ||
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices) {
        throw new AIError(AIErrorCode.UNSUPPORTED, 'Audio conversation is not supported in this environment. It requires the Web Audio API and AudioWorklet support.');
    }
    let audioContext;
    try {
        // 1. Set up the audio context. This must be in response to a user gesture.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices#autoplay_policy
        audioContext = new AudioContext();
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        // 2. Prompt for microphone access and get the media stream.
        // This can throw a variety of permission or hardware-related errors.
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        // 3. Load the AudioWorklet processor.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet
        const workletBlob = new Blob([audioProcessorWorkletString], {
            type: 'application/javascript'
        });
        const workletURL = URL.createObjectURL(workletBlob);
        await audioContext.audioWorklet.addModule(workletURL);
        // 4. Create the audio graph: Microphone -> Source Node -> Worklet Node
        const sourceNode = audioContext.createMediaStreamSource(mediaStream);
        const workletNode = new AudioWorkletNode(audioContext, AUDIO_PROCESSOR_NAME, {
            processorOptions: { targetSampleRate: SERVER_INPUT_SAMPLE_RATE }
        });
        sourceNode.connect(workletNode);
        // 5. Instantiate and return the runner which manages the conversation.
        const runner = new AudioConversationRunner(liveSession, options, {
            audioContext,
            mediaStream,
            sourceNode,
            workletNode
        });
        return { stop: () => runner.stop() };
    }
    catch (e) {
        // Ensure the audio context is closed on any setup error.
        if (audioContext && audioContext.state !== 'closed') {
            void audioContext.close();
        }
        // Re-throw specific, known error types directly. The user may want to handle `DOMException`
        // errors differently (for example, if permission to access audio device was denied).
        if (e instanceof AIError || e instanceof DOMException) {
            throw e;
        }
        // Wrap any other unexpected errors in a standard AIError.
        throw new AIError(AIErrorCode.ERROR, `Failed to initialize audio recording: ${e.message}`);
    }
}

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
function getAI(app = getApp(), options) {
    app = getModularInstance(app);
    // Dependencies
    const AIProvider = _getProvider(app, AI_TYPE);
    const backend = options?.backend ?? new GoogleAIBackend();
    const finalOptions = {
        useLimitedUseAppCheckTokens: options?.useLimitedUseAppCheckTokens ?? false
    };
    const identifier = encodeInstanceIdentifier(backend);
    const aiInstance = AIProvider.getImmediate({
        identifier
    });
    aiInstance.options = finalOptions;
    return aiInstance;
}
const hybridParamKeys = [
    'mode',
    'onDeviceParams',
    'inCloudParams'
];
/**
 * Returns a {@link GenerativeModel} class with methods for inference
 * and other functionality.
 *
 * @public
 */
function getGenerativeModel(ai, modelParams, requestOptions) {
    // Uses the existence of HybridParams.mode to clarify the type of the modelParams input.
    const hybridParams = modelParams;
    let inCloudParams;
    if (hybridParams.mode) {
        for (const param of Object.keys(modelParams)) {
            if (!hybridParamKeys.includes(param)) {
                logger.warn(`When a hybrid inference mode is specified (mode is currently set` +
                    ` to ${hybridParams.mode}), "${param}" cannot be ` +
                    `configured at the top level. Configuration for in-cloud and ` +
                    `on-device must be done separately in inCloudParams and onDeviceParams. ` +
                    `Configuration values set outside of inCloudParams and onDeviceParams will` +
                    ` be ignored.`);
            }
        }
        inCloudParams = hybridParams.inCloudParams || {
            model: DEFAULT_HYBRID_IN_CLOUD_MODEL
        };
    }
    else {
        inCloudParams = modelParams;
    }
    if (!inCloudParams.model) {
        throw new AIError(AIErrorCode.NO_MODEL, `Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })`);
    }
    /**
     * An AIService registered by index.node.ts will not have a
     * chromeAdapterFactory() method.
     */
    const chromeAdapter = ai.chromeAdapterFactory?.(hybridParams.mode, typeof window === 'undefined' ? undefined : window, hybridParams.onDeviceParams);
    const generativeModel = new GenerativeModel(ai, inCloudParams, requestOptions, chromeAdapter);
    generativeModel._apiSettings.inferenceMode = hybridParams.mode;
    return generativeModel;
}
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
function getImagenModel(ai, modelParams, requestOptions) {
    if (!modelParams.model) {
        throw new AIError(AIErrorCode.NO_MODEL, `Must provide a model name. Example: getImagenModel({ model: 'my-model-name' })`);
    }
    return new ImagenModel(ai, modelParams, requestOptions);
}
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
function getLiveGenerativeModel(ai, modelParams) {
    if (!modelParams.model) {
        throw new AIError(AIErrorCode.NO_MODEL, `Must provide a model name for getLiveGenerativeModel. Example: getLiveGenerativeModel(ai, { model: 'my-model-name' })`);
    }
    const webSocketHandler = new WebSocketHandlerImpl();
    return new LiveGenerativeModel(ai, modelParams, webSocketHandler);
}
/**
 * Returns a {@link TemplateGenerativeModel} class for executing server-side
 * templates.
 *
 * @param ai - An {@link AI} instance.
 * @param requestOptions - Additional options to use when making requests.
 *
 * @beta
 */
function getTemplateGenerativeModel(ai, requestOptions) {
    return new TemplateGenerativeModel(ai, requestOptions);
}
/**
 * Returns a {@link TemplateImagenModel} class for executing server-side
 * Imagen templates.
 *
 * @param ai - An {@link AI} instance.
 * @param requestOptions - Additional options to use when making requests.
 *
 * @beta
 */
function getTemplateImagenModel(ai, requestOptions) {
    return new TemplateImagenModel(ai, requestOptions);
}

/**
 * The Firebase AI Web SDK.
 *
 * @packageDocumentation
 */
function registerAI() {
    _registerComponent(new Component(AI_TYPE, factory, "PUBLIC" /* ComponentType.PUBLIC */).setMultipleInstances(true));
    registerVersion(name, version);
    // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
    registerVersion(name, version, 'esm2020');
}
registerAI();

export { AIError, AIErrorCode, AIModel, AnyOfSchema, ArraySchema, Backend, BackendType, BlockReason, BooleanSchema, ChatSession, FinishReason, FunctionCallingMode, GenerativeModel, GoogleAIBackend, HarmBlockMethod, HarmBlockThreshold, HarmCategory, HarmProbability, HarmSeverity, ImagenAspectRatio, ImagenImageFormat, ImagenModel, ImagenPersonFilterLevel, ImagenSafetyFilterLevel, InferenceMode, InferenceSource, IntegerSchema, Language, LiveGenerativeModel, LiveResponseType, LiveSession, Modality, NumberSchema, ObjectSchema, Outcome, POSSIBLE_ROLES, ResponseModality, Schema, SchemaType, StringSchema, TemplateGenerativeModel, TemplateImagenModel, ThinkingLevel, URLRetrievalStatus, VertexAIBackend, getAI, getGenerativeModel, getImagenModel, getLiveGenerativeModel, getTemplateGenerativeModel, getTemplateImagenModel, startAudioConversation };
//# sourceMappingURL=index.esm.js.map
