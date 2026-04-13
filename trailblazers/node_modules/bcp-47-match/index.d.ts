export function basicFilter(
  tags: string | Tags,
  ranges: string | Ranges | undefined
): Tags
export function extendedFilter(
  tags: string | Tags,
  ranges: string | Ranges | undefined
): Tags
export function lookup(
  tags: string | Tags,
  ranges: string | Ranges | undefined
): string | undefined
/**
 * BCP-47 tag.
 */
export type Tag = string
/**
 * List of BCP-47 tags.
 */
export type Tags = Array<Tag>
/**
 * RFC 4647 range.
 */
export type Range = string
/**
 * List of RFC 4647 range.
 */
export type Ranges = Array<Range>
/**
 * An internal check.
 */
export type Check = (tag: Tag, range: Range) => boolean
/**
 * Filter: yields all tags that match a range.
 */
export type Filter = FilterOrLookup<true>
/**
 * Lookup: yields the best tag that matches a range.
 */
export type Lookup = FilterOrLookup<false>
/**
 * A check.
 */
export type FilterOrLookup<IsFilter extends boolean> = (
  tags: Tag | Tags,
  ranges?: Range | Ranges | undefined
) => IsFilter extends true ? Tags : Tag | undefined
