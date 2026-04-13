import rssPlugin from "./src/rssPlugin.js";
import dateRfc3339 from "./src/dateRfc3339.js";
import dateRfc822 from "./src/dateRfc822.js";
import getNewestCollectionItemDate from "./src/getNewestCollectionItemDate.js";
import virtualTemplate from "./src/virtualTemplate.js";

import absoluteUrl from "./src/absoluteUrl.js";
import convertHtmlToAbsoluteUrls from "./src/htmlToAbsoluteUrls.js";

export default rssPlugin;

export {
  rssPlugin,
  virtualTemplate as feedPlugin,
  dateRfc3339 as dateToRfc3339,
  dateRfc822 as dateToRfc822,
  getNewestCollectionItemDate as getNewestCollectionItemDate,
  absoluteUrl as absoluteUrl,
  convertHtmlToAbsoluteUrls as convertHtmlToAbsoluteUrls
};
