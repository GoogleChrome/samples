/**
 * @typedef {keyof typeof SUPPORTED_TASKS} TaskType
 * @typedef {keyof typeof TASK_ALIASES} AliasType
 * @typedef {TaskType | AliasType} PipelineType All possible pipeline types.
 * @typedef {{[K in TaskType]: InstanceType<typeof SUPPORTED_TASKS[K]["pipeline"]>}} SupportedTasks A mapping of pipeline names to their corresponding pipeline classes.
 * @typedef {{[K in AliasType]: InstanceType<typeof SUPPORTED_TASKS[TASK_ALIASES[K]]["pipeline"]>}} AliasTasks A mapping from pipeline aliases to their corresponding pipeline classes.
 * @typedef {SupportedTasks & AliasTasks} AllTasks A mapping from all pipeline names and aliases to their corresponding pipeline classes.
 */
/**
 * Utility factory method to build a `Pipeline` object.
 *
 * @template {PipelineType} T The type of pipeline to return.
 * @param {T} task The task defining which pipeline will be returned. Currently accepted tasks are:
 *  - `"audio-classification"`: will return a `AudioClassificationPipeline`.
 *  - `"automatic-speech-recognition"`: will return a `AutomaticSpeechRecognitionPipeline`.
 *  - `"background-removal"`: will return a `BackgroundRemovalPipeline`.
 *  - `"depth-estimation"`: will return a `DepthEstimationPipeline`.
 *  - `"document-question-answering"`: will return a `DocumentQuestionAnsweringPipeline`.
 *  - `"feature-extraction"`: will return a `FeatureExtractionPipeline`.
 *  - `"fill-mask"`: will return a `FillMaskPipeline`.
 *  - `"image-classification"`: will return a `ImageClassificationPipeline`.
 *  - `"image-segmentation"`: will return a `ImageSegmentationPipeline`.
 *  - `"image-to-text"`: will return a `ImageToTextPipeline`.
 *  - `"object-detection"`: will return a `ObjectDetectionPipeline`.
 *  - `"question-answering"`: will return a `QuestionAnsweringPipeline`.
 *  - `"summarization"`: will return a `SummarizationPipeline`.
 *  - `"text2text-generation"`: will return a `Text2TextGenerationPipeline`.
 *  - `"text-classification"` (alias "sentiment-analysis" available): will return a `TextClassificationPipeline`.
 *  - `"text-generation"`: will return a `TextGenerationPipeline`.
 *  - `"token-classification"` (alias "ner" available): will return a `TokenClassificationPipeline`.
 *  - `"translation"`: will return a `TranslationPipeline`.
 *  - `"translation_xx_to_yy"`: will return a `TranslationPipeline`.
 *  - `"zero-shot-classification"`: will return a `ZeroShotClassificationPipeline`.
 *  - `"zero-shot-audio-classification"`: will return a `ZeroShotAudioClassificationPipeline`.
 *  - `"zero-shot-image-classification"`: will return a `ZeroShotImageClassificationPipeline`.
 *  - `"zero-shot-object-detection"`: will return a `ZeroShotObjectDetectionPipeline`.
 * @param {string} [model=null] The name of the pre-trained model to use. If not specified, the default model for the task will be used.
 * @param {import('./utils/hub.js').PretrainedModelOptions} [options] Optional parameters for the pipeline.
 * @returns {Promise<AllTasks[T]>} A Pipeline object for the specified task.
 * @throws {Error} If an unsupported pipeline is requested.
 */
export function pipeline<T extends PipelineType>(task: T, model?: string, { progress_callback, config, cache_dir, local_files_only, revision, device, dtype, subfolder, use_external_data_format, model_file_name, session_options, }?: import("./utils/hub.js").PretrainedModelOptions): Promise<AllTasks[T]>;
export type TaskType = keyof typeof SUPPORTED_TASKS;
export type AliasType = keyof typeof TASK_ALIASES;
/**
 * All possible pipeline types.
 */
export type PipelineType = TaskType | AliasType;
/**
 * A mapping of pipeline names to their corresponding pipeline classes.
 */
export type SupportedTasks = { [K in TaskType]: InstanceType<(typeof SUPPORTED_TASKS)[K]["pipeline"]>; };
/**
 * A mapping from pipeline aliases to their corresponding pipeline classes.
 */
export type AliasTasks = { [K in AliasType]: InstanceType<(typeof SUPPORTED_TASKS)[Readonly<{
    'sentiment-analysis': "text-classification";
    ner: "token-classification";
    asr: "automatic-speech-recognition";
    'text-to-speech': "text-to-audio";
    embeddings: "feature-extraction";
}>[K]]["pipeline"]>; };
/**
 * A mapping from all pipeline names and aliases to their corresponding pipeline classes.
 */
export type AllTasks = SupportedTasks & AliasTasks;
export type FillMaskOutput = import("./pipelines/fill-mask.js").FillMaskOutput;
export type TextClassificationOutput = import("./pipelines/text-classification.js").TextClassificationOutput;
export type TokenClassificationOutput = import("./pipelines/token-classification.js").TokenClassificationOutput;
export type QuestionAnsweringOutput = import("./pipelines/question-answering.js").QuestionAnsweringOutput;
export type SummarizationOutput = import("./pipelines/summarization.js").SummarizationOutput;
export type TranslationOutput = import("./pipelines/translation.js").TranslationOutput;
export type Text2TextGenerationOutput = import("./pipelines/text2text-generation.js").Text2TextGenerationOutput;
export type TextGenerationOutput = import("./pipelines/text-generation.js").TextGenerationOutput;
export type TextGenerationStringOutput = import("./pipelines/text-generation.js").TextGenerationStringOutput;
export type TextGenerationChatOutput = import("./pipelines/text-generation.js").TextGenerationChatOutput;
export type ZeroShotClassificationOutput = import("./pipelines/zero-shot-classification.js").ZeroShotClassificationOutput;
export type AudioClassificationOutput = import("./pipelines/audio-classification.js").AudioClassificationOutput;
export type ZeroShotAudioClassificationOutput = import("./pipelines/zero-shot-audio-classification.js").ZeroShotAudioClassificationOutput;
export type AutomaticSpeechRecognitionOutput = import("./pipelines/automatic-speech-recognition.js").AutomaticSpeechRecognitionOutput;
export type TextToAudioOutput = import("./pipelines/text-to-audio.js").TextToAudioOutput;
export type ImageClassificationOutput = import("./pipelines/image-classification.js").ImageClassificationOutput;
export type ImageSegmentationOutput = import("./pipelines/image-segmentation.js").ImageSegmentationOutput;
export type ImageToTextOutput = import("./pipelines/image-to-text.js").ImageToTextOutput;
export type ObjectDetectionOutput = import("./pipelines/object-detection.js").ObjectDetectionOutput;
export type ZeroShotObjectDetectionOutput = import("./pipelines/zero-shot-object-detection.js").ZeroShotObjectDetectionOutput;
export type ZeroShotImageClassificationOutput = import("./pipelines/zero-shot-image-classification.js").ZeroShotImageClassificationOutput;
export type DocumentQuestionAnsweringOutput = import("./pipelines/document-question-answering.js").DocumentQuestionAnsweringOutput;
export type DepthEstimationOutput = import("./pipelines/depth-estimation.js").DepthEstimationOutput;
import { TextClassificationPipeline } from './pipelines/index.js';
import { TokenClassificationPipeline } from './pipelines/index.js';
import { QuestionAnsweringPipeline } from './pipelines/index.js';
import { FillMaskPipeline } from './pipelines/index.js';
import { SummarizationPipeline } from './pipelines/index.js';
import { TranslationPipeline } from './pipelines/index.js';
import { Text2TextGenerationPipeline } from './pipelines/index.js';
import { TextGenerationPipeline } from './pipelines/index.js';
import { ZeroShotClassificationPipeline } from './pipelines/index.js';
import { AudioClassificationPipeline } from './pipelines/index.js';
import { ZeroShotAudioClassificationPipeline } from './pipelines/index.js';
import { AutomaticSpeechRecognitionPipeline } from './pipelines/index.js';
import { TextToAudioPipeline } from './pipelines/index.js';
import { ImageToTextPipeline } from './pipelines/index.js';
import { ImageClassificationPipeline } from './pipelines/index.js';
import { ImageSegmentationPipeline } from './pipelines/index.js';
import { BackgroundRemovalPipeline } from './pipelines/index.js';
import { ZeroShotImageClassificationPipeline } from './pipelines/index.js';
import { ObjectDetectionPipeline } from './pipelines/index.js';
import { ZeroShotObjectDetectionPipeline } from './pipelines/index.js';
import { DocumentQuestionAnsweringPipeline } from './pipelines/index.js';
import { ImageToImagePipeline } from './pipelines/index.js';
import { DepthEstimationPipeline } from './pipelines/index.js';
import { FeatureExtractionPipeline } from './pipelines/index.js';
import { ImageFeatureExtractionPipeline } from './pipelines/index.js';
import { SUPPORTED_TASKS } from './pipelines/index.js';
import { TASK_ALIASES } from './pipelines/index.js';
export { TextClassificationPipeline, TokenClassificationPipeline, QuestionAnsweringPipeline, FillMaskPipeline, SummarizationPipeline, TranslationPipeline, Text2TextGenerationPipeline, TextGenerationPipeline, ZeroShotClassificationPipeline, AudioClassificationPipeline, ZeroShotAudioClassificationPipeline, AutomaticSpeechRecognitionPipeline, TextToAudioPipeline, ImageToTextPipeline, ImageClassificationPipeline, ImageSegmentationPipeline, BackgroundRemovalPipeline, ZeroShotImageClassificationPipeline, ObjectDetectionPipeline, ZeroShotObjectDetectionPipeline, DocumentQuestionAnsweringPipeline, ImageToImagePipeline, DepthEstimationPipeline, FeatureExtractionPipeline, ImageFeatureExtractionPipeline };
//# sourceMappingURL=pipelines.d.ts.map