import type { AttrMatcher, StringMatcher } from "posthtml";

interface Matcher {
  tag?: StringMatcher;
  attrs: AttrMatcher;
}

declare function createMatcher(matcher: string | string[]): Matcher | Matcher[];

export default createMatcher;
