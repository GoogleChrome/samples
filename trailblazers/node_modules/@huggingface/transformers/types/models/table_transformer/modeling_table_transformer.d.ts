export class TableTransformerPreTrainedModel extends PreTrainedModel {
}
/**
 * The bare Table Transformer Model (consisting of a backbone and encoder-decoder Transformer)
 * outputting raw hidden-states without any specific head on top.
 */
export class TableTransformerModel extends TableTransformerPreTrainedModel {
}
/**
 * Table Transformer Model (consisting of a backbone and encoder-decoder Transformer)
 * with object detection heads on top, for tasks such as COCO detection.
 */
export class TableTransformerForObjectDetection extends TableTransformerPreTrainedModel {
    /**
     * @param {any} model_inputs
     */
    _call(model_inputs: any): Promise<TableTransformerObjectDetectionOutput>;
}
export class TableTransformerObjectDetectionOutput extends DetrObjectDetectionOutput {
}
import { PreTrainedModel } from '../modeling_utils.js';
import { DetrObjectDetectionOutput } from '../detr/modeling_detr.js';
//# sourceMappingURL=modeling_table_transformer.d.ts.map