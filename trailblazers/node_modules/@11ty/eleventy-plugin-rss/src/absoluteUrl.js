import debugUtil from "debug";
const debug = debugUtil("Eleventy:Rss");

// This is deprecated! Use the Eleventy HTML <base> plugin instead (2.0+)
export default function(url, base) {
  try {
    return (new URL(url, base)).toString()
  } catch(e) {
    debug("Trying to convert %o to be an absolute url with base %o and failed, returning: %o (invalid url)", url, base, url)
    // TODO add debug output!
    return url;
  }
};
