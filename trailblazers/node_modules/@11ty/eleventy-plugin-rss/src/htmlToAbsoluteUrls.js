import posthtml from 'posthtml';
import urls from '@11ty/posthtml-urls';
import absoluteUrl from "./absoluteUrl.js";

// This is deprecated! Use the Eleventy HTML <base> plugin instead (2.0+)
export default async function(htmlContent, base, processOptions = {}) {
  if( !base ) {
    throw new Error( "eleventy-plugin-rss: htmlToAbsoluteUrls(absolutePostUrl) was missing the full URL base `absolutePostUrl` argument.")
  }

  let options = {
    eachURL: function(url) {
      return absoluteUrl(url.trim(), base);
    }
  };

  let modifier = posthtml().use(urls(options));

  let result =  await modifier.process(htmlContent, processOptions);
  return result.html;
};
