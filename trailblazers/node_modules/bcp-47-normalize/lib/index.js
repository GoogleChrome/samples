/**
 * @typedef {import('bcp-47').Warning} Warning
 * @typedef {import('bcp-47').Schema} Schema
 * @typedef {import('bcp-47').Extension} Extension
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean} [forgiving]
 *   Passed to `bcp-47` as `options.forgiving`.
 * @property {Warning} [warning]
 *   Passed to `bcp-47` as `options.warning`.
 *
 *   One additional warning is given:
 *
 *   | code | reason                                                     |
 *   | :--- | :--------------------------------------------------------- |
 *   | 7    | Deprecated region `CURRENT`, expected one of `SUGGESTIONS` |
 *
 *   This warning is only given if the region cannot be automatically fixed
 *   (when regions split into multiple regions).
 */

import {parse, stringify} from 'bcp-47'
import {extendedFilter} from 'bcp-47-match'
import {matches} from './matches.js'
import {fields} from './fields.js'
import {many} from './many.js'
import {likely} from './likely.js'

const own = {}.hasOwnProperty

/**
 * @param {Schema} base
 * @param {Partial<Schema>} changes
 * @returns {Schema}
 */
function merge(base, changes) {
  if (!base.language) base.language = changes.language
  if (!base.script) base.script = changes.script
  if (!base.region) base.region = changes.region
  if (changes.variants) base.variants.push(...changes.variants)

  return base
}

/**
 * Mostly like:
 * <https://github.com/formatjs/formatjs/blob/a15e757/packages/intl-locale/index.ts#L254>
 * But doesn’t crash.
 *
 * @param {Schema} schema
 * @returns {string}
 */
function addLikelySubtags(schema) {
  const {language, script, region} = schema
  /** @type {string|undefined} */
  let match

  if (
    script &&
    region &&
    (match = likely[stringify({language, script, region})])
  ) {
    schema.script = undefined
    schema.region = undefined
  } else if (script && (match = likely[stringify({language, script})])) {
    schema.script = undefined
  } else if (region && (match = likely[stringify({language, region})])) {
    schema.region = undefined
  } else if (language && (match = likely[language])) {
    // Empty.
  }

  if (match) {
    schema.language = undefined
    merge(schema, parse(match))
  }

  return stringify(schema)
}

/**
 * @param {Schema} schema
 */
function removeLikelySubtags(schema) {
  addLikelySubtags(schema)

  const {language, script, region} = schema

  if (!language) return schema

  const maxLocale = stringify({language, script, region})

  if (maxLocale === addLikelySubtags(parse(language))) {
    schema.script = undefined
    schema.region = undefined
  } else if (
    region &&
    maxLocale === addLikelySubtags(parse(language + '-' + region))
  ) {
    schema.script = undefined
  } else if (
    script &&
    maxLocale === addLikelySubtags(parse(language + '-' + script))
  ) {
    schema.region = undefined
  }

  return schema
}

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
export function bcp47Normalize(tag, options) {
  const settings = options || {}
  // 1. normalize and lowercase the tag (`sgn-be-fr` -> `sfb`).
  const schema = parse(String(tag || '').toLowerCase(), settings)
  const value = stringify(schema)

  if (!value) {
    return value
  }

  let index = -1

  // 2. Do fancy, expensive replaces (`ha-latn-gh` -> `ha-gh`).
  while (++index < matches.length) {
    let from = matches[index].from

    if (from.slice(0, 4) === 'und-' && schema.language) {
      from = schema.language + from.slice(3)
    }

    if (extendedFilter(value, from).length > 0) {
      replace(schema, from, matches[index].to)
    }
  }

  // 3. Do basic field replaces (`en-840` -> `en-us`).
  index = -1

  while (++index < fields.length) {
    if (remove(schema, fields[index].from.field, fields[index].from.value)) {
      add(schema, fields[index].to.field, fields[index].to.value)
    }
  }

  // 4. Minimize.
  removeLikelySubtags(schema)

  // 5. Sort variants, and sort extensions on singleton.
  schema.variants.sort()
  schema.extensions.sort(compareSingleton)

  // 6. Warn if fields (currently only regions) should be updated but have
  // multiple choices.
  if (settings.warning) {
    /** @type {keyof many} */
    let key

    for (key in many) {
      if (own.call(many, key)) {
        const map = many[key]
        const value = schema[key]
        if (value && own.call(map, value)) {
          const replacements = map[value]
          settings.warning(
            'Deprecated ' +
              key +
              ' `' +
              value +
              '`, expected one of `' +
              replacements.join('`, `') +
              '`',
            -1,
            7
          )
        }
      }
    }
  }

  // 7. Add proper casing back.
  // Format script (ISO 15924) as titlecase (example: `Latn`):
  if (schema.script) {
    schema.script =
      schema.script.charAt(0).toUpperCase() + schema.script.slice(1)
  }

  // Format region (ISO 3166) as uppercase (note: this doesn’t affect numeric
  // codes, which is fine):
  if (schema.region) {
    schema.region = schema.region.toUpperCase()
  }

  return stringify(schema)
}

/**
 * @param {Schema} schema
 * @param {string} from
 * @param {string} to
 * @returns {void}
 */
function replace(schema, from, to) {
  const left = parse(from)
  const right = parse(to)
  /** @type {Array<string>} */
  const removed = []
  /** @type {string|null|undefined} */
  const lang = left.language
  /** @type {keyof schema} */
  let key

  // Remove values from `from`:
  for (key in left) {
    if (own.call(left, key)) {
      const value = left[key]
      if (value && remove(schema, key, value)) {
        removed.push(key)
      }
    }
  }

  // Add values from `to`:
  for (key in right) {
    if (own.call(right, key)) {
      const value = right[key]
      // Only add values that are defined on `to`, and that were either removed by
      // `from` or are currently empty.
      if (lang && value && (removed.includes(key) || !schema[key])) {
        add(schema, key, key === 'language' && value === 'und' ? lang : value)
      }
    }
  }
}

/**
 * @param {Schema} object
 * @param {keyof Schema} key
 * @param {string|Array<string>|Array<Extension>} value
 * @returns {boolean}
 */
function remove(object, key, value) {
  let removed = false
  /** @type {string|Array<string>|Array<Extension>|null|undefined} */
  let result

  if (value) {
    const current = object[key]
    result = current

    if (Array.isArray(current)) {
      result = []
      let index = -1

      while (++index < current.length) {
        const item = current[index]

        // @ts-expect-error: TS can’t handle the two lists.
        if (value.includes(item)) {
          removed = true
        } else {
          // @ts-expect-error: TS can’t handle the two lists.
          result.push(item)
        }
      }
    } else if (current === value) {
      result = null
      removed = true
    }

    // @ts-expect-error: Assume the value matches.
    object[key] = result
  }

  return removed
}

/**
 * @param {Schema} object
 * @param {keyof Schema} key
 * @param {string|Array<string>|Array<Extension>} value
 * @returns {void}
 */
function add(object, key, value) {
  /** @type {string|Array<string>|Array<Extension>|null|undefined} */
  const current = object[key]

  if (Array.isArray(current)) {
    const list = Array.isArray(value) ? value : [value]
    /** @type {number} */
    let index = -1

    while (++index < list.length) {
      const item = list[index]

      // @ts-expect-error: TS can’t handle the two lists.
      if (!current.includes(item)) {
        // @ts-expect-error: TS can’t handle the two lists.
        current.push(item)
      }
    }
  } else {
    // @ts-expect-error: Assume the value matches.
    object[key] = value
  }
}

/**
 * @param {Extension} left
 * @param {Extension} right
 * @returns {number}
 */
function compareSingleton(left, right) {
  if (left.singleton > right.singleton) {
    return 1
  }

  if (left.singleton < right.singleton) {
    return -1
  }

  // It is invalid to have more than one extension with the same singleton so
  // we should never reach this code.
  return 0
}
