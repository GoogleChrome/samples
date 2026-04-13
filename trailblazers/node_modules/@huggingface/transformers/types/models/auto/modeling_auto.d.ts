/**
 * Helper class which is used to instantiate pretrained models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModel.from_pretrained('Xenova/bert-base-uncased');
 */
export class AutoModel extends PretrainedMixin {
}
/**
 * Helper class which is used to instantiate pretrained sequence classification models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForSequenceClassification.from_pretrained('Xenova/distilbert-base-uncased-finetuned-sst-2-english');
 */
export class AutoModelForSequenceClassification extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained token classification models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForTokenClassification.from_pretrained('Xenova/distilbert-base-multilingual-cased-ner-hrl');
 */
export class AutoModelForTokenClassification extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained sequence-to-sequence models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForSeq2SeqLM.from_pretrained('Xenova/t5-small');
 */
export class AutoModelForSeq2SeqLM extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained sequence-to-sequence speech-to-text models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForSpeechSeq2Seq.from_pretrained('openai/whisper-tiny.en');
 */
export class AutoModelForSpeechSeq2Seq extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained sequence-to-sequence text-to-spectrogram models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForTextToSpectrogram.from_pretrained('microsoft/speecht5_tts');
 */
export class AutoModelForTextToSpectrogram extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained text-to-waveform models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForTextToSpectrogram.from_pretrained('facebook/mms-tts-eng');
 */
export class AutoModelForTextToWaveform extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained causal language models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForCausalLM.from_pretrained('Xenova/gpt2');
 */
export class AutoModelForCausalLM extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained masked language models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForMaskedLM.from_pretrained('Xenova/bert-base-uncased');
 */
export class AutoModelForMaskedLM extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained question answering models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForQuestionAnswering.from_pretrained('Xenova/distilbert-base-cased-distilled-squad');
 */
export class AutoModelForQuestionAnswering extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained vision-to-sequence models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForVision2Seq.from_pretrained('Xenova/vit-gpt2-image-captioning');
 */
export class AutoModelForVision2Seq extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained image classification models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForImageClassification.from_pretrained('Xenova/vit-base-patch16-224');
 */
export class AutoModelForImageClassification extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained image segmentation models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForImageSegmentation.from_pretrained('Xenova/detr-resnet-50-panoptic');
 */
export class AutoModelForImageSegmentation extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained image segmentation models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForSemanticSegmentation.from_pretrained('nvidia/segformer-b3-finetuned-cityscapes-1024-1024');
 */
export class AutoModelForSemanticSegmentation extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained universal image segmentation models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForUniversalSegmentation.from_pretrained('hf-internal-testing/tiny-random-MaskFormerForInstanceSegmentation');
 */
export class AutoModelForUniversalSegmentation extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained object detection models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForObjectDetection.from_pretrained('Xenova/detr-resnet-50');
 */
export class AutoModelForObjectDetection extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForZeroShotObjectDetection extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Helper class which is used to instantiate pretrained mask generation models with the `from_pretrained` function.
 * The chosen model class is determined by the type specified in the model config.
 *
 * @example
 * const model = await AutoModelForMaskGeneration.from_pretrained('Xenova/sam-vit-base');
 */
export class AutoModelForMaskGeneration extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForCTC extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForAudioClassification extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForXVector extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForAudioFrameClassification extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForDocumentQuestionAnswering extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForImageMatting extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForImageToImage extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForDepthEstimation extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForNormalEstimation extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForPoseEstimation extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForImageFeatureExtraction extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForImageTextToText extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
export class AutoModelForAudioTextToText extends PretrainedMixin {
    static MODEL_CLASS_MAPPINGS: Map<string, string>[];
}
/**
 * Base class of all AutoModels. Contains the `from_pretrained` function
 * which is used to instantiate pretrained models.
 */
declare class PretrainedMixin {
    /**
     * Mapping from model type to model class.
     * @type {Map<string, Object>[]}
     */
    static MODEL_CLASS_MAPPINGS: Map<string, any>[];
    /**
     * Whether to attempt to instantiate the base class (`PretrainedModel`) if
     * the model type is not found in the mapping.
     */
    static BASE_IF_FAIL: boolean;
    /**
     * Check whether this AutoModel class supports a given model type.
     * @param {string} model_type The model type from config (e.g., 'bert', 'whisper').
     * @returns {boolean} Whether this class can handle the given model type.
     */
    static supports(model_type: string): boolean;
    static from_pretrained(pretrained_model_name_or_path: string, { progress_callback, config, cache_dir, local_files_only, revision, model_file_name, subfolder, device, dtype, use_external_data_format, session_options, }?: import("../../utils/hub.js").PretrainedModelOptions): Promise<PreTrainedModel>;
}
import { PreTrainedModel } from '../modeling_utils.js';
export {};
//# sourceMappingURL=modeling_auto.d.ts.map