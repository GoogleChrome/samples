export class MultiModalityPreTrainedModel extends PreTrainedModel {
}
export class MultiModalityCausalLM extends MultiModalityPreTrainedModel {
    _generation_mode: string;
    forward(model_inputs: any): Promise<any>;
    prepare_inputs_for_generation(input_ids: any, model_inputs: any, generation_config: any): any;
    /**
     * @param {import('../../generation/parameters.js').GenerationFunctionParameters} options
     */
    generate_images(options: import("../../generation/parameters.js").GenerationFunctionParameters): Promise<RawImage[]>;
}
import { PreTrainedModel } from '../modeling_utils.js';
import { RawImage } from '../../utils/image.js';
//# sourceMappingURL=modeling_multi_modality.d.ts.map