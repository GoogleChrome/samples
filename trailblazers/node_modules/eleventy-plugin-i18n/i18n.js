'use strict';

const chalk = require('chalk');
const get = require('lodash.get');
const templite = require('templite');

module.exports = function (
  key,
  data = {},
  localeOverride,
  pluginOptions = {},
  page
) {
  const { translations = {}, fallbackLocales: fallbackLocales = {} } =
    pluginOptions;

  // Use explicit `locale` argument if passed in, otherwise infer it from URL prefix segment
  const url = get(page, 'url', '');
  const contextLocale = url.split('/')[1];
  const locale = localeOverride || contextLocale;

  // Preferred translation
  const translation = get(translations, `[${key}][${locale}]`);

  if (translation !== undefined) {
    return templite(translation, data);
  }

  // Fallback translation
  const fallbackLocale =
    get(fallbackLocales, locale) || get(fallbackLocales, '*');
  const fallbackTranslation = get(translations, `[${key}][${fallbackLocale}]`);

  if (fallbackTranslation !== undefined) {
    console.warn(
      chalk.yellow(
        `[i18n] Could not find '${key}' in '${locale}'. Using '${fallbackLocale}' fallback.`
      )
    );
    return templite(fallbackTranslation, data);
  }

  // Not found
  console.warn(
    chalk.red(
      `[i18n] Translation for '${key}' in '${locale}' not found. No fallback locale specified.`
    )
  );
  return key;
};
