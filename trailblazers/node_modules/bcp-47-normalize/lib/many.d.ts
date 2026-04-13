/**
 * @typedef {'script'|'region'|'variants'} Field
 */
/**
 * @type {{region: Record<string, Array<string>>}}
 */
export const many: {
    region: Record<string, Array<string>>;
};
export type Field = 'script' | 'region' | 'variants';
