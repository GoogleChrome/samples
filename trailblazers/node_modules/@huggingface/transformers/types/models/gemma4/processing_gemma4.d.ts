export class Gemma4Processor extends Processor {
    static from_pretrained(pretrained_model_name_or_path: any, options?: {}): Promise<Gemma4Processor>;
    constructor(config: any, components: any, chat_template: any);
    audio_ms_per_token: any;
    audio_seq_length: any;
    image_seq_length: any;
    audio_token: any;
    boa_token: any;
    eoa_token: any;
    image_token: any;
    boi_token: any;
    eoi_token: any;
    /**
     * Compute the number of audio soft tokens for a single waveform.
     * Replicates the audio encoder's sequence-length arithmetic:
     * mel framing → two SSCP conv layers (kernel=3, stride=2) → cap.
     * @param {number} num_samples
     * @param {number} sampling_rate
     * @returns {number}
     */
    _compute_audio_num_tokens(num_samples: number, sampling_rate: number): number;
    _call(text: any, images?: any, audio?: any, options?: {}): Promise<any>;
}
import { Processor } from '../../processing_utils.js';
//# sourceMappingURL=processing_gemma4.d.ts.map