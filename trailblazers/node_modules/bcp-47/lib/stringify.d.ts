/**
 * @typedef {Partial<import('./parse.js').Schema>} Schema
 * @typedef {Partial<import('./parse.js').Extension>} Extension
 */
/**
 * Compile a language schema to a BCP 47 language tag.
 *
 * @param {Schema} schema
 * @returns {string}
 */
export function stringify(schema?: Schema): string
export type Schema = Partial<import('./parse.js').Schema>
export type Extension = Partial<import('./parse.js').Extension>
