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
export function stringify(schema = {}) {
  /** @type {Array<string>} */
  let result = []

  if (schema.irregular) {
    return schema.irregular
  }

  if (schema.regular) {
    return schema.regular
  }

  if (schema.language) {
    result = result.concat(
      schema.language,
      schema.extendedLanguageSubtags || [],
      schema.script || [],
      schema.region || [],
      schema.variants || []
    )

    const values = schema.extensions || []
    let index = -1

    while (++index < values.length) {
      const value = values[index]

      if (value.singleton && value.extensions && value.extensions.length > 0) {
        result.push(value.singleton, ...value.extensions)
      }
    }
  }

  if (schema.privateuse && schema.privateuse.length > 0) {
    result.push('x', ...schema.privateuse)
  }

  return result.join('-')
}
