export class JinaCLIPPreTrainedModel extends PreTrainedModel {
}
export class JinaCLIPModel extends JinaCLIPPreTrainedModel {
    forward(model_inputs: any): Promise<{
        text_embeddings: any;
        l2norm_text_embeddings: any;
        image_embeddings: any;
        l2norm_image_embeddings: any;
    }>;
}
export class JinaCLIPTextModel extends JinaCLIPPreTrainedModel {
}
export class JinaCLIPVisionModel extends JinaCLIPPreTrainedModel {
}
import { PreTrainedModel } from '../modeling_utils.js';
//# sourceMappingURL=modeling_jina_clip.d.ts.map