import type PreTokenizer from "../PreTokenizer";
import type { TokenizerConfigPreTokenizer } from "@static/tokenizer";
declare function create_pre_tokenizer(config: TokenizerConfigPreTokenizer): PreTokenizer | null;
export default create_pre_tokenizer;
