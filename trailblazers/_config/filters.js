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
    'popularPosts',
    function (collections, locale, count = 5) {
      const internalTags = ['all', 'posts', 'posts_en', 'posts_es', 'posts_ja'];
      const getLocale = (item) => {
        if (!item || !item.data) return '';
        return item.data.locale || (item.url ? item.url.split('/')[1] : '');
      };
      const localeFilter = (item) => getLocale(item) === locale;

      const tags = Object.keys(collections)
        .filter((tag) => !internalTags.includes(tag))
        .filter((tag) => (collections[tag] || []).some(localeFilter))
        .sort((a, b) => {
          const ca = (collections[a] || []).filter(localeFilter).length;
          const cb = (collections[b] || []).filter(localeFilter).length;
          return cb - ca;
        });

      const seen = new Set();
      const result = [];
      for (const tag of tags) {
        if (result.length >= count) break;
        const post = (collections[tag] || []).find(localeFilter);
        if (post && !seen.has(post.url)) {
          seen.add(post.url);
          result.push({ tag, post });
        }
      }
      return result;
    },
  );

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

  eleventyConfig.addFilter(
    'insertNewsletter',
    function (content, locale = 'en') {
      if (!content) return '';

      const i18n = eleventyConfig.getFilter('i18n');
      const t = (key) => i18n.call(this, key, { locale }, locale);

      const newsletterHtml = `
<div class="newsletter-breakup">
  <div class="newsletter-image-container">
    <img src="/img/newsletter.png" alt="" loading="lazy" decoding="async">
  </div>
  <div class="newsletter-content">
    <span class="newsletter-label">${t('newsletter_label')}</span>
    <h3 class="newsletter-title">${t('newsletter_title')}</h3>
    <p class="newsletter-description">${t('newsletter_description')}</p>
    <form class="newsletter-form">
      <div class="newsletter-input-group">
        <input type="email" placeholder="${t('newsletter_placeholder')}" required class="newsletter-input">
        <button type="submit" class="newsletter-button">${t('newsletter_button')}</button>
      </div>
    </form>
    <p class="newsletter-disclaimer">${t('newsletter_disclaimer')}</p>
  </div>
</div>
`;

      const paragraphs = content.split('</p>');
      if (paragraphs.length > 2) {
        paragraphs[1] += '</p>' + newsletterHtml;
        return paragraphs.join('</p>');
      }

      return content + newsletterHtml;
    },
  );

  eleventyConfig.addFilter('addNewsletter', function (posts) {
    if (!posts || posts.length === 0) return posts;

    const result = [...posts];

    let index;
    if (result.length > 3) {
      // Random between 2 (3rd position) and result.length (last position)
      index = Math.floor(Math.random() * (result.length - 1)) + 2;
    } else {
      index = result.length;
    }

    result.splice(index, 0, { isNewsletter: true });
    return result;
  });
}
