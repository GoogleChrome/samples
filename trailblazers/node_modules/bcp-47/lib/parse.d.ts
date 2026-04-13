/**
 * Parse a BCP 47 language tag.
 *
 * @param {string} tag
 * @param {Options} [options]
 * @returns {Schema}
 */
export function parse(tag: string, options?: Options | undefined): Schema
export type Warning = (reason: string, code: number, offset: number) => void
export type Options = {
  normalize?: boolean | undefined
  forgiving?: boolean | undefined
  warning?: Warning | undefined
}
export type Extension = {
  singleton: string
  extensions: Array<string>
}
export type Schema = {
  language: string | null | undefined
  extendedLanguageSubtags: Array<string>
  script: string | null | undefined
  region: string | null | undefined
  variants: Array<string>
  extensions: Array<Extension>
  privateuse: Array<string>
  irregular: string | null | undefined
  regular: string | null | undefined
}
