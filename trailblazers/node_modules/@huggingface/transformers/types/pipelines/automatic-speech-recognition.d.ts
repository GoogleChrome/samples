declare const AutomaticSpeechRecognitionPipeline_base: new (options: TextAudioPipelineConstructorArgs) => AutomaticSpeechRecognitionPipelineType;
/**
 * @typedef {import('./_base.js').TextAudioPipelineConstructorArgs} TextAudioPipelineConstructorArgs
 * @typedef {import('./_base.js').Disposable} Disposable
 * @typedef {import('./_base.js').AudioInput} AudioInput
 */
/**
 * @typedef {Object} Chunk
 * @property {[number, number]} timestamp The start and end timestamp of the chunk in seconds.
 * @property {string} text The recognized text.
 */
/**
 * @typedef {Object} AutomaticSpeechRecognitionOutput
 * @property {string} text The recognized text.
 * @property {Chunk[]} [chunks] When using `return_timestamps`, the `chunks` will become a list
 * containing all the various text chunks identified by the model.
 *
 * @typedef {Object} AutomaticSpeechRecognitionSpecificParams Parameters specific to automatic-speech-recognition pipelines.
 * @property {boolean|'word'} [return_timestamps] Whether to return timestamps or not. Default is `false`.
 * @property {number} [chunk_length_s] The length of audio chunks to process in seconds. Default is 0 (no chunking).
 * @property {number} [stride_length_s] The length of overlap between consecutive audio chunks in seconds. If not provided, defaults to `chunk_length_s / 6`.
 * @property {boolean} [force_full_sequences] Whether to force outputting full sequences or not. Default is `false`.
 * @property {string} [language] The source language. Default is `null`, meaning it should be auto-detected. Use this to potentially improve performance if the source language is known.
 * @property {string} [task] The task to perform. Default is `null`, meaning it should be auto-detected.
 * @property {number} [num_frames] The number of frames in the input audio.
 * @typedef {import('../generation/parameters.js').GenerationFunctionParameters & AutomaticSpeechRecognitionSpecificParams} AutomaticSpeechRecognitionConfig
 *
 * @callback AutomaticSpeechRecognitionPipelineCallbackSingle Transcribe the audio sequence given as inputs to text.
 * @param {AudioInput} audio The input audio file(s) to be transcribed. The input is either:
 * - `string` or `URL` that is the filename/URL of the audio file, the file will be read at the processor's sampling rate
 * to get the waveform using the [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) API.
 * If `AudioContext` is not available, you should pass the raw waveform in as a Float32Array of shape `(n, )`.
 * - `Float32Array` or `Float64Array` of shape `(n, )`, representing the raw audio at the correct sampling rate (no further check will be done).
 * @param {Partial<AutomaticSpeechRecognitionConfig>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<AutomaticSpeechRecognitionOutput>} An object containing the transcription text and optionally timestamps if `return_timestamps` is `true`.
 *
 * @callback AutomaticSpeechRecognitionPipelineCallbackBatch Transcribe the audio sequences given as inputs to text.
 * @param {AudioInput[]} audio The input audio file(s) to be transcribed. Each entry is either:
 * - `string` or `URL` that is the filename/URL of the audio file, the file will be read at the processor's sampling rate
 * to get the waveform using the [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) API.
 * If `AudioContext` is not available, you should pass the raw waveform in as a Float32Array of shape `(n, )`.
 * - `Float32Array` or `Float64Array` of shape `(n, )`, representing the raw audio at the correct sampling rate (no further check will be done).
 * @param {Partial<AutomaticSpeechRecognitionConfig>} [options] Additional keyword arguments to pass along to the generate method of the model.
 * @returns {Promise<AutomaticSpeechRecognitionOutput[]>} An object containing the transcription text and optionally timestamps if `return_timestamps` is `true`.
 *
 * @typedef {AutomaticSpeechRecognitionPipelineCallbackSingle & AutomaticSpeechRecognitionPipelineCallbackBatch} AutomaticSpeechRecognitionPipelineCallback
 *
 * @typedef {TextAudioPipelineConstructorArgs & AutomaticSpeechRecognitionPipelineCallback & Disposable} AutomaticSpeechRecognitionPipelineType
 */
/**
 * Pipeline that aims at extracting spoken text contained within some audio.
 *
 * **Example:** Transcribe English.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * const output = await transcriber(url);
 * // { text: " And so my fellow Americans ask not what your country can do for you, ask what you can do for your country." }
 * ```
 *
 * **Example:** Transcribe English w/ timestamps.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * const output = await transcriber(url, { return_timestamps: true });
 * // {
 * //   text: " And so my fellow Americans ask not what your country can do for you, ask what you can do for your country."
 * //   chunks: [
 * //     { timestamp: [0, 8],  text: " And so my fellow Americans ask not what your country can do for you" }
 * //     { timestamp: [8, 11], text: " ask what you can do for your country." }
 * //   ]
 * // }
 * ```
 *
 * **Example:** Transcribe English w/ word-level timestamps.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
 * const output = await transcriber(url, { return_timestamps: 'word' });
 * // {
 * //   "text": " And so my fellow Americans ask not what your country can do for you ask what you can do for your country.",
 * //   "chunks": [
 * //     { "text": " And", "timestamp": [0, 0.78] },
 * //     { "text": " so", "timestamp": [0.78, 1.06] },
 * //     { "text": " my", "timestamp": [1.06, 1.46] },
 * //     ...
 * //     { "text": " for", "timestamp": [9.72, 9.92] },
 * //     { "text": " your", "timestamp": [9.92, 10.22] },
 * //     { "text": " country.", "timestamp": [10.22, 13.5] }
 * //   ]
 * // }
 * ```
 *
 * **Example:** Transcribe French.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/french-audio.mp3';
 * const output = await transcriber(url, { language: 'french', task: 'transcribe' });
 * // { text: " J'adore, j'aime, je n'aime pas, je déteste." }
 * ```
 *
 * **Example:** Translate French to English.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/french-audio.mp3';
 * const output = await transcriber(url, { language: 'french', task: 'translate' });
 * // { text: " I love, I like, I don't like, I hate." }
 * ```
 *
 * **Example:** Transcribe/translate audio longer than 30 seconds.
 * ```javascript
 * import { pipeline } from '@huggingface/transformers';
 *
 * const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
 * const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/ted_60.wav';
 * const output = await transcriber(url, { chunk_length_s: 30, stride_length_s: 5 });
 * // { text: " So in college, I was a government major, which means [...] So I'd start off light and I'd bump it up" }
 * ```
 */
export class AutomaticSpeechRecognitionPipeline extends AutomaticSpeechRecognitionPipeline_base {
    _call(audio: any, kwargs?: {}): Promise<any>;
    _call_wav2vec2(audio: any, kwargs: any): Promise<{
        text: string;
    } | {
        text: string;
    }[]>;
    _call_whisper(audio: any, kwargs: any): Promise<any>;
    _call_moonshine(audio: any, kwargs: any): Promise<{
        text: string;
    } | {
        text: string;
    }[]>;
    _call_cohere_asr(audio: any, kwargs: any): Promise<{
        text: any;
    } | {
        text: any;
    }[]>;
}
export type TextAudioPipelineConstructorArgs = import("./_base.js").TextAudioPipelineConstructorArgs;
export type Disposable = import("./_base.js").Disposable;
export type AudioInput = import("./_base.js").AudioInput;
export type Chunk = {
    /**
     * The start and end timestamp of the chunk in seconds.
     */
    timestamp: [number, number];
    /**
     * The recognized text.
     */
    text: string;
};
export type AutomaticSpeechRecognitionOutput = {
    /**
     * The recognized text.
     */
    text: string;
    /**
     * When using `return_timestamps`, the `chunks` will become a list
     * containing all the various text chunks identified by the model.
     */
    chunks?: Chunk[];
};
/**
 * Parameters specific to automatic-speech-recognition pipelines.
 */
export type AutomaticSpeechRecognitionSpecificParams = {
    /**
     * Whether to return timestamps or not. Default is `false`.
     */
    return_timestamps?: boolean | "word";
    /**
     * The length of audio chunks to process in seconds. Default is 0 (no chunking).
     */
    chunk_length_s?: number;
    /**
     * The length of overlap between consecutive audio chunks in seconds. If not provided, defaults to `chunk_length_s / 6`.
     */
    stride_length_s?: number;
    /**
     * Whether to force outputting full sequences or not. Default is `false`.
     */
    force_full_sequences?: boolean;
    /**
     * The source language. Default is `null`, meaning it should be auto-detected. Use this to potentially improve performance if the source language is known.
     */
    language?: string;
    /**
     * The task to perform. Default is `null`, meaning it should be auto-detected.
     */
    task?: string;
    /**
     * The number of frames in the input audio.
     */
    num_frames?: number;
};
export type AutomaticSpeechRecognitionConfig = import("../generation/parameters.js").GenerationFunctionParameters & AutomaticSpeechRecognitionSpecificParams;
/**
 * Transcribe the audio sequence given as inputs to text.
 */
export type AutomaticSpeechRecognitionPipelineCallbackSingle = (audio: AudioInput, options?: Partial<AutomaticSpeechRecognitionConfig>) => Promise<AutomaticSpeechRecognitionOutput>;
/**
 * Transcribe the audio sequences given as inputs to text.
 */
export type AutomaticSpeechRecognitionPipelineCallbackBatch = (audio: AudioInput[], options?: Partial<AutomaticSpeechRecognitionConfig>) => Promise<AutomaticSpeechRecognitionOutput[]>;
export type AutomaticSpeechRecognitionPipelineCallback = AutomaticSpeechRecognitionPipelineCallbackSingle & AutomaticSpeechRecognitionPipelineCallbackBatch;
export type AutomaticSpeechRecognitionPipelineType = TextAudioPipelineConstructorArgs & AutomaticSpeechRecognitionPipelineCallback & Disposable;
export {};
//# sourceMappingURL=automatic-speech-recognition.d.ts.map