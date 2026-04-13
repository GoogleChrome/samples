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
import { FunctionCall, FunctionResponse } from '../types';
import { LiveSession } from './live-session';
/**
 * A controller for managing an active audio conversation.
 *
 * @beta
 */
export interface AudioConversationController {
    /**
     * Stops the audio conversation, closes the microphone connection, and
     * cleans up resources. Returns a promise that resolves when cleanup is complete.
     */
    stop: () => Promise<void>;
}
/**
 * Options for {@link startAudioConversation}.
 *
 * @beta
 */
export interface StartAudioConversationOptions {
    /**
     * An async handler that is called when the model requests a function to be executed.
     * The handler should perform the function call and return the result as a `Part`,
     * which will then be sent back to the model.
     */
    functionCallingHandler?: (functionCalls: FunctionCall[]) => Promise<FunctionResponse>;
}
/**
 * Dependencies needed by the {@link AudioConversationRunner}.
 *
 * @internal
 */
interface RunnerDependencies {
    audioContext: AudioContext;
    mediaStream: MediaStream;
    sourceNode: MediaStreamAudioSourceNode;
    workletNode: AudioWorkletNode;
}
/**
 * Encapsulates the core logic of an audio conversation.
 *
 * @internal
 */
export declare class AudioConversationRunner {
    private readonly liveSession;
    private readonly options;
    private readonly deps;
    /** A flag to indicate if the conversation has been stopped. */
    private isStopped;
    /** A deferred that contains a promise that is resolved when stop() is called, to unblock the receive loop. */
    private readonly stopDeferred;
    /** A promise that tracks the lifecycle of the main `runReceiveLoop`. */
    private readonly receiveLoopPromise;
    /** A FIFO queue of 24kHz, 16-bit PCM audio chunks received from the server. */
    private readonly playbackQueue;
    /** Tracks scheduled audio sources. Used to cancel scheduled audio when the model is interrupted. */
    private scheduledSources;
    /** A high-precision timeline pointer for scheduling gapless audio playback. */
    private nextStartTime;
    /** A mutex to prevent the playback processing loop from running multiple times concurrently. */
    private isPlaybackLoopRunning;
    constructor(liveSession: LiveSession, options: StartAudioConversationOptions, deps: RunnerDependencies);
    /**
     * Stops the conversation and unblocks the main receive loop.
     */
    stop(): Promise<void>;
    /**
     * Cleans up all audio resources (nodes, stream tracks, context) and marks the
     * session as no longer in a conversation.
     */
    private cleanup;
    /**
     * Adds audio data to the queue and ensures the playback loop is running.
     */
    private enqueueAndPlay;
    /**
     * Stops all current and pending audio playback and clears the queue. This is
     * called when the server indicates the model's speech was interrupted with
     * `LiveServerContent.modelTurn.interrupted`.
     */
    private interruptPlayback;
    /**
     * Processes the playback queue in a loop, scheduling each chunk in a gapless sequence.
     */
    private processPlaybackQueue;
    /**
     * The main loop that listens for and processes messages from the server.
     */
    private runReceiveLoop;
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
export declare function startAudioConversation(liveSession: LiveSession, options?: StartAudioConversationOptions): Promise<AudioConversationController>;
export {};
