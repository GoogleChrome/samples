export class MgpstrModelOutput extends ModelOutput {
    constructor({ char_logits, bpe_logits, wp_logits }: {
        char_logits: any;
        bpe_logits: any;
        wp_logits: any;
    });
    char_logits: any;
    bpe_logits: any;
    wp_logits: any;
    get logits(): any[];
}
export class MgpstrPreTrainedModel extends PreTrainedModel {
}
/**
 * MGP-STR Model transformer with three classification heads on top
 * (three A^3 modules and three linear layer on top of the transformer encoder output) for scene text recognition (STR).
 */
export class MgpstrForSceneTextRecognition extends MgpstrPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<MgpstrModelOutput>;
}
import { ModelOutput } from '../modeling_outputs.js';
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_mgp_str.d.ts.map