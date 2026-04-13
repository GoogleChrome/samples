import type { TagToken } from './tag-token';
import type { HTMLToken } from './html-token';
import type { OutputToken } from './output-token';
export type TopLevelToken = TagToken | OutputToken | HTMLToken;
