/**
 * @typedef {import('../utils/tensor.js').Tensor} Tensor
 */
export class ModelOutput {
}
/**
 * Base class for model's outputs, with potential hidden states and attentions.
 */
export class BaseModelOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.last_hidden_state Sequence of hidden-states at the output of the last layer of the model.
     * @param {Tensor} [output.hidden_states] Hidden-states of the model at the output of each layer plus the optional initial embedding outputs.
     * @param {Tensor} [output.attentions] Attentions weights after the attention softmax, used to compute the weighted average in the self-attention heads.
     */
    constructor({ last_hidden_state, hidden_states, attentions }: {
        last_hidden_state: Tensor;
        hidden_states?: Tensor;
        attentions?: Tensor;
    });
    last_hidden_state: import("../transformers.js").Tensor;
    hidden_states: import("../transformers.js").Tensor;
    attentions: import("../transformers.js").Tensor;
}
/**
 * Base class for outputs of sentence classification models.
 */
export class SequenceClassifierOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.logits classification (or regression if config.num_labels==1) scores (before SoftMax).
     * @param {Record<string, Tensor>} [output.attentions] Object of `torch.FloatTensor` (one for each layer) of shape `(batch_size, num_heads, sequence_length, sequence_length)`.
     * Attentions weights after the attention softmax, used to compute the weighted average in the self-attention heads.
     */
    constructor({ logits, ...attentions }: {
        logits: Tensor;
        attentions?: Record<string, Tensor>;
    });
    logits: import("../transformers.js").Tensor;
    attentions: Record<string, import("../transformers.js").Tensor>[];
}
/**
 * Base class for outputs of token classification models.
 */
export class TokenClassifierOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.logits Classification scores (before SoftMax).
     */
    constructor({ logits }: {
        logits: Tensor;
    });
    logits: import("../transformers.js").Tensor;
}
/**
 * Base class for masked language models outputs.
 */
export class MaskedLMOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.logits Prediction scores of the language modeling head (scores for each vocabulary token before SoftMax).
     */
    constructor({ logits }: {
        logits: Tensor;
    });
    logits: import("../transformers.js").Tensor;
}
/**
 * Base class for outputs of question answering models.
 */
export class QuestionAnsweringModelOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.start_logits Span-start scores (before SoftMax).
     * @param {Tensor} output.end_logits Span-end scores (before SoftMax).
     */
    constructor({ start_logits, end_logits }: {
        start_logits: Tensor;
        end_logits: Tensor;
    });
    start_logits: import("../transformers.js").Tensor;
    end_logits: import("../transformers.js").Tensor;
}
/**
 * Base class for causal language model (or autoregressive) outputs.
 */
export class CausalLMOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.logits Prediction scores of the language modeling head (scores for each vocabulary token before softmax).
     */
    constructor({ logits }: {
        logits: Tensor;
    });
    logits: import("../transformers.js").Tensor;
}
/**
 * Base class for causal language model (or autoregressive) outputs.
 */
export class CausalLMOutputWithPast extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.logits Prediction scores of the language modeling head (scores for each vocabulary token before softmax).
     * @param {Tensor} output.past_key_values Contains pre-computed hidden-states (key and values in the self-attention blocks)
     * that can be used (see `past_key_values` input) to speed up sequential decoding.
     */
    constructor({ logits, past_key_values }: {
        logits: Tensor;
        past_key_values: Tensor;
    });
    logits: import("../transformers.js").Tensor;
    past_key_values: import("../transformers.js").Tensor;
}
export class Seq2SeqLMOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.logits The output logits of the model.
     * @param {Tensor} output.past_key_values An tensor of key/value pairs that represent the previous state of the model.
     * @param {Tensor} output.encoder_outputs The output of the encoder in a sequence-to-sequence model.
     * @param {Tensor} [output.decoder_attentions] Attentions weights of the decoder, after the attention softmax, used to compute the weighted average in the self-attention heads.
     * @param {Tensor} [output.cross_attentions] Attentions weights of the decoder's cross-attention layer, after the attention softmax, used to compute the weighted average in the cross-attention heads.
     */
    constructor({ logits, past_key_values, encoder_outputs, decoder_attentions, cross_attentions }: {
        logits: Tensor;
        past_key_values: Tensor;
        encoder_outputs: Tensor;
        decoder_attentions?: Tensor;
        cross_attentions?: Tensor;
    });
    logits: import("../transformers.js").Tensor;
    past_key_values: import("../transformers.js").Tensor;
    encoder_outputs: import("../transformers.js").Tensor;
    decoder_attentions: import("../transformers.js").Tensor;
    cross_attentions: import("../transformers.js").Tensor;
}
export class ImageMattingOutput extends ModelOutput {
    /**
     * @param {Object} output The output of the model.
     * @param {Tensor} output.alphas Estimated alpha values, of shape `(batch_size, num_channels, height, width)`.
     */
    constructor({ alphas }: {
        alphas: Tensor;
    });
    alphas: import("../transformers.js").Tensor;
}
export type Tensor = import("../utils/tensor.js").Tensor;
//# sourceMappingURL=modeling_outputs.d.ts.map