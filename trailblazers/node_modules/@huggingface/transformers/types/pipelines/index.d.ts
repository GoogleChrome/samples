export const SUPPORTED_TASKS: Readonly<{
    'text-classification': {
        pipeline: typeof TextClassificationPipeline;
        model: typeof AutoModelForSequenceClassification;
        default: {
            model: string;
        };
        type: string;
    };
    'token-classification': {
        pipeline: typeof TokenClassificationPipeline;
        model: typeof AutoModelForTokenClassification;
        default: {
            model: string;
        };
        type: string;
    };
    'question-answering': {
        pipeline: typeof QuestionAnsweringPipeline;
        model: typeof AutoModelForQuestionAnswering;
        default: {
            model: string;
        };
        type: string;
    };
    'fill-mask': {
        pipeline: typeof FillMaskPipeline;
        model: typeof AutoModelForMaskedLM;
        default: {
            model: string;
            dtype: string;
        };
        type: string;
    };
    summarization: {
        pipeline: typeof SummarizationPipeline;
        model: typeof AutoModelForSeq2SeqLM;
        default: {
            model: string;
        };
        type: string;
    };
    translation: {
        pipeline: typeof TranslationPipeline;
        model: typeof AutoModelForSeq2SeqLM;
        default: {
            model: string;
        };
        type: string;
    };
    'text2text-generation': {
        pipeline: typeof Text2TextGenerationPipeline;
        model: typeof AutoModelForSeq2SeqLM;
        default: {
            model: string;
        };
        type: string;
    };
    'text-generation': {
        pipeline: typeof TextGenerationPipeline;
        model: typeof AutoModelForCausalLM;
        default: {
            model: string;
            dtype: string;
        };
        type: string;
    };
    'zero-shot-classification': {
        pipeline: typeof ZeroShotClassificationPipeline;
        model: typeof AutoModelForSequenceClassification;
        default: {
            model: string;
        };
        type: string;
    };
    'audio-classification': {
        pipeline: typeof AudioClassificationPipeline;
        model: typeof AutoModelForAudioClassification;
        default: {
            model: string;
        };
        type: string;
    };
    'zero-shot-audio-classification': {
        pipeline: typeof ZeroShotAudioClassificationPipeline;
        model: typeof AutoModel;
        default: {
            model: string;
        };
        type: string;
    };
    'automatic-speech-recognition': {
        pipeline: typeof AutomaticSpeechRecognitionPipeline;
        model: (typeof AutoModelForSpeechSeq2Seq)[];
        default: {
            model: string;
        };
        type: string;
    };
    'text-to-audio': {
        pipeline: typeof TextToAudioPipeline;
        model: (typeof AutoModelForTextToSpectrogram)[];
        default: {
            model: string;
            dtype: string;
        };
        type: string;
    };
    'image-to-text': {
        pipeline: typeof ImageToTextPipeline;
        model: typeof AutoModelForVision2Seq;
        default: {
            model: string;
        };
        type: string;
    };
    'image-classification': {
        pipeline: typeof ImageClassificationPipeline;
        model: typeof AutoModelForImageClassification;
        default: {
            model: string;
        };
        type: string;
    };
    'image-segmentation': {
        pipeline: typeof ImageSegmentationPipeline;
        model: (typeof AutoModelForImageSegmentation)[];
        default: {
            model: string;
        };
        type: string;
    };
    'background-removal': {
        pipeline: typeof BackgroundRemovalPipeline;
        model: (typeof AutoModelForImageSegmentation)[];
        default: {
            model: string;
        };
        type: string;
    };
    'zero-shot-image-classification': {
        pipeline: typeof ZeroShotImageClassificationPipeline;
        model: typeof AutoModel;
        default: {
            model: string;
        };
        type: string;
    };
    'object-detection': {
        pipeline: typeof ObjectDetectionPipeline;
        model: typeof AutoModelForObjectDetection;
        default: {
            model: string;
        };
        type: string;
    };
    'zero-shot-object-detection': {
        pipeline: typeof ZeroShotObjectDetectionPipeline;
        model: typeof AutoModelForZeroShotObjectDetection;
        default: {
            model: string;
        };
        type: string;
    };
    'document-question-answering': {
        pipeline: typeof DocumentQuestionAnsweringPipeline;
        model: typeof AutoModelForDocumentQuestionAnswering;
        default: {
            model: string;
        };
        type: string;
    };
    'image-to-image': {
        pipeline: typeof ImageToImagePipeline;
        model: typeof AutoModelForImageToImage;
        default: {
            model: string;
        };
        type: string;
    };
    'depth-estimation': {
        pipeline: typeof DepthEstimationPipeline;
        model: typeof AutoModelForDepthEstimation;
        default: {
            model: string;
        };
        type: string;
    };
    'feature-extraction': {
        pipeline: typeof FeatureExtractionPipeline;
        model: typeof AutoModel;
        default: {
            model: string;
            dtype: string;
        };
        type: string;
    };
    'image-feature-extraction': {
        pipeline: typeof ImageFeatureExtractionPipeline;
        model: (typeof AutoModel)[];
        default: {
            model: string;
            dtype: string;
        };
        type: string;
    };
}>;
export const TASK_ALIASES: Readonly<{
    'sentiment-analysis': "text-classification";
    ner: "token-classification";
    asr: "automatic-speech-recognition";
    'text-to-speech': "text-to-audio";
    embeddings: "feature-extraction";
}>;
export type TaskType = keyof typeof SUPPORTED_TASKS;
export type AliasType = keyof typeof TASK_ALIASES;
/**
 * All possible pipeline types.
 */
export type PipelineType = TaskType | AliasType;
import { TextClassificationPipeline } from './text-classification.js';
import { AutoModelForSequenceClassification } from '../models/auto/modeling_auto.js';
import { TokenClassificationPipeline } from './token-classification.js';
import { AutoModelForTokenClassification } from '../models/auto/modeling_auto.js';
import { QuestionAnsweringPipeline } from './question-answering.js';
import { AutoModelForQuestionAnswering } from '../models/auto/modeling_auto.js';
import { FillMaskPipeline } from './fill-mask.js';
import { AutoModelForMaskedLM } from '../models/auto/modeling_auto.js';
import { SummarizationPipeline } from './summarization.js';
import { AutoModelForSeq2SeqLM } from '../models/auto/modeling_auto.js';
import { TranslationPipeline } from './translation.js';
import { Text2TextGenerationPipeline } from './text2text-generation.js';
import { TextGenerationPipeline } from './text-generation.js';
import { AutoModelForCausalLM } from '../models/auto/modeling_auto.js';
import { ZeroShotClassificationPipeline } from './zero-shot-classification.js';
import { AudioClassificationPipeline } from './audio-classification.js';
import { AutoModelForAudioClassification } from '../models/auto/modeling_auto.js';
import { ZeroShotAudioClassificationPipeline } from './zero-shot-audio-classification.js';
import { AutoModel } from '../models/auto/modeling_auto.js';
import { AutomaticSpeechRecognitionPipeline } from './automatic-speech-recognition.js';
import { AutoModelForSpeechSeq2Seq } from '../models/auto/modeling_auto.js';
import { TextToAudioPipeline } from './text-to-audio.js';
import { AutoModelForTextToSpectrogram } from '../models/auto/modeling_auto.js';
import { ImageToTextPipeline } from './image-to-text.js';
import { AutoModelForVision2Seq } from '../models/auto/modeling_auto.js';
import { ImageClassificationPipeline } from './image-classification.js';
import { AutoModelForImageClassification } from '../models/auto/modeling_auto.js';
import { ImageSegmentationPipeline } from './image-segmentation.js';
import { AutoModelForImageSegmentation } from '../models/auto/modeling_auto.js';
import { BackgroundRemovalPipeline } from './background-removal.js';
import { ZeroShotImageClassificationPipeline } from './zero-shot-image-classification.js';
import { ObjectDetectionPipeline } from './object-detection.js';
import { AutoModelForObjectDetection } from '../models/auto/modeling_auto.js';
import { ZeroShotObjectDetectionPipeline } from './zero-shot-object-detection.js';
import { AutoModelForZeroShotObjectDetection } from '../models/auto/modeling_auto.js';
import { DocumentQuestionAnsweringPipeline } from './document-question-answering.js';
import { AutoModelForDocumentQuestionAnswering } from '../models/auto/modeling_auto.js';
import { ImageToImagePipeline } from './image-to-image.js';
import { AutoModelForImageToImage } from '../models/auto/modeling_auto.js';
import { DepthEstimationPipeline } from './depth-estimation.js';
import { AutoModelForDepthEstimation } from '../models/auto/modeling_auto.js';
import { FeatureExtractionPipeline } from './feature-extraction.js';
import { ImageFeatureExtractionPipeline } from './image-feature-extraction.js';
export { TextClassificationPipeline, TokenClassificationPipeline, QuestionAnsweringPipeline, FillMaskPipeline, SummarizationPipeline, TranslationPipeline, Text2TextGenerationPipeline, TextGenerationPipeline, ZeroShotClassificationPipeline, AudioClassificationPipeline, ZeroShotAudioClassificationPipeline, AutomaticSpeechRecognitionPipeline, TextToAudioPipeline, ImageToTextPipeline, ImageClassificationPipeline, ImageSegmentationPipeline, BackgroundRemovalPipeline, ZeroShotImageClassificationPipeline, ObjectDetectionPipeline, ZeroShotObjectDetectionPipeline, DocumentQuestionAnsweringPipeline, ImageToImagePipeline, DepthEstimationPipeline, FeatureExtractionPipeline, ImageFeatureExtractionPipeline };
//# sourceMappingURL=index.d.ts.map