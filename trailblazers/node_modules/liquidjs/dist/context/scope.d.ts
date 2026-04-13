import { Drop } from '../drop/drop';
interface ScopeObject extends Record<string | number | symbol, any> {
    toLiquid?: () => any;
}
export type Scope = ScopeObject | Drop;
export {};
