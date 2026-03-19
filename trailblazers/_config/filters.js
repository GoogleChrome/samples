import { DateTime } from 'luxon';

export default function (eleventyConfig) {
  eleventyConfig.addFilter(
    'readableDate',
    (dateObj, locale = 'en', options = {}) => {
      // Default options if none provided
      const defaultOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
        ...options,
      };

      return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
    },
  );

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter('min', (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Return the keys used in an object
  eleventyConfig.addFilter('getKeys', (target) => {
    return Object.keys(target);
  });

  eleventyConfig.addFilter('filterTagList', function filterTagList(tags) {
    return (tags || []).filter(
      (tag) =>
        ['all', 'posts', 'posts_en', 'posts_es', 'posts_ja'].indexOf(tag) ===
        -1,
    );
  });

  eleventyConfig.addFilter(
    'filterTagsByLocale',
    function (collections, locale) {
      const tags = Object.keys(collections);
      return tags.filter((tag) => {
        // Filter out internal tags
        if (
          ['all', 'posts', 'posts_en', 'posts_es', 'posts_ja'].indexOf(tag) !==
          -1
        ) {
          return false;
        }
        // Check if this tag has any posts in the target locale
        const postsForTag = collections[tag] || [];
        return postsForTag.some((item) => {
          if (!item || !item.data) return false;
          const itemLocale =
            item.data.locale || (item.url ? item.url.split('/')[1] : '');
          return itemLocale === locale;
        });
      });
    },
  );

  eleventyConfig.addFilter('sortAlphabetically', (strings) =>
    (strings || []).sort((b, a) => b.localeCompare(a)),
  );

  eleventyConfig.addFilter('filterByLocale', function (collection, locale) {
    return (collection || []).filter((item) => {
      // Use the locale from the item's data if available, or infer from URL
      const itemLocale =
        item.data.locale || (item.url ? item.url.split('/')[1] : '');
      return itemLocale === locale;
    });
  });

  eleventyConfig.addFilter('slugifyTag', function (tag) {
    if (!tag) return '';
    const slugified = eleventyConfig.getFilter('slugify')(tag);
    if (slugified) return slugified;
    // Fallback for non-latin tags: use raw characters (lowercased)
    return tag.toLowerCase();
  });

  eleventyConfig.addFilter('translateUrl', (url, newLocale) => {
    const parts = (url || '').split('/');
    if (parts.length > 1) {
      parts[1] = newLocale;
    }
    return parts.join('/');
  });

  eleventyConfig.addFilter('plural', function (key, count, locale = 'en') {
    const pluralRules = new Intl.PluralRules(locale);
    const rule = pluralRules.select(count);
    const pluralKey = `${key}_${rule}`;
    return eleventyConfig
      .getFilter('i18n')
      .call(this, pluralKey, { count, locale }, locale);
  });
  eleventyConfig.addFilter('filterAuthor', (collection, author) => {
    return (collection || []).filter((item) => item.data.author === author);
  });

  eleventyConfig.addFilter(
    'sortByPostCount',
    function (tags, collections, locale) {
      return (tags || []).sort((a, b) => {
        const countA = (collections[a] || []).filter((item) => {
          const itemLocale =
            item.data.locale || (item.url ? item.url.split('/')[1] : '');
          return itemLocale === locale;
        }).length;
        const countB = (collections[b] || []).filter((item) => {
          const itemLocale =
            item.data.locale || (item.url ? item.url.split('/')[1] : '');
          return itemLocale === locale;
        }).length;
        return countB - countA;
      });
    },
  );

  eleventyConfig.addFilter('getTagCount', function (tag, collections, locale) {
    return (collections[tag] || []).filter((item) => {
      const itemLocale =
        item.data.locale || (item.url ? item.url.split('/')[1] : '');
      return itemLocale === locale;
    }).length;
  });
}
