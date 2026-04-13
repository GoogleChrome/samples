/**
 * @typedef {'script'|'region'|'variants'} Field
 *
 * @typedef AddOrRemove
 * @property {Field} field
 * @property {string} value
 *
 * @typedef Change
 * @property {AddOrRemove} from
 * @property {AddOrRemove} to
 */
/**
 * @type {Array<Change>}
 */
export const fields: Array<Change>;
export type Field = 'script' | 'region' | 'variants';
export type AddOrRemove = {
    field: Field;
    value: string;
};
export type Change = {
    from: AddOrRemove;
    to: AddOrRemove;
};
