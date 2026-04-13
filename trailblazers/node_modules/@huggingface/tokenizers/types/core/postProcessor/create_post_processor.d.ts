import type PostProcessor from "../PostProcessor";
import type { TokenizerConfigPostProcessor } from "@static/tokenizer";
declare function create_post_processor(config: TokenizerConfigPostProcessor): PostProcessor | null;
export default create_post_processor;
