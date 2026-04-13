/**
 * Normalize the given BCP 47 tag according to Unicode CLDR suggestions.
 *
 * @param {string} tag
 *   BCP 47 tag.
 * @param {Options} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Normal, canonical, and pretty BCP 47 tag.
 */
export function bcp47Normalize(tag: string, options?: Options | undefined): string;
export type Warning = import('bcp-47').Warning;
export type Schema = import('bcp-47').Schema;
export type Extension = import('bcp-47').Extension;
/**
 * Configuration (optional).
 */
export type Options = {
    /**
     * Passed to `bcp-47` as `options.forgiving`.
     */
    forgiving?: boolean;
    /**
     * Passed to `bcp-47` as `options.warning`.
     *
     * One additional warning is given:
     *
     * | code | reason                                                     |
     * | :--- | :--------------------------------------------------------- |
     * | 7    | Deprecated region `CURRENT`, expected one of `SUGGESTIONS` |
     *
     * This warning is only given if the region cannot be automatically fixed
     * (when regions split into multiple regions).
     */
    warning?: Warning;
};
