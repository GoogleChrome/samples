/* Copyright 2024 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

// Source is at https://github.com/GoogleChrome/samples/blob/gh-pages/glitch-migration/url-parts/


// To improve display when the page is not in an iframe (in an article or blog post or whatever).
if (window.parent === window) {
  document.documentElement.classList.add('not-in-iframe');
}

// Public Suffix List: https://publicsuffix.org/list/
import pslEntries from './psl.js';
// https://data.iana.org/TLD/tlds-alpha-by-domain.txt
import tldEntries from './tld.js';

const urlInput = document.querySelector('input#url');
const urlPartsDiv = document.querySelector('div#url-parts');

urlInput.focus({preventScroll: true});

if (!isSecureContext) location.protocol = 'https:';

urlInput.oninput = handleUrl;
// const searchParams = new URLSearchParams(window.location.search);
// const urlParam = searchParams.get('url');
// Get the value 'manually' (not using the URL API) to allow for hash values.
const urlParam = location.href.split('?url=')[1];
if (urlParam) {
  urlInput.value = urlParam;
}

handleUrl();

function handleUrl() {
  const urlText = urlInput.value;
  // console.log('urlText:', urlText);

  // Begin by removing `?url= ...` search string.
  // This is added later if urlText is valid and can be handled here.
  window.history.replaceState({}, '', `${window.location.origin}${window.location.pathname}`);

  // URL API allows URLs such as `https://foo` or `https://f`.
  // Also want to avoid URLs like `//foo` or `foo.co.`, or `@` without a username.
  // URLs like `tv.tv` are valid.
  if (!urlText || !urlText.match(/\w{2,}\.\w{2,}/ ) || urlText.match(/$\./ ) ||
      urlText.match(/\/\/@/)) {
    urlPartsDiv.innerHTML = '';
    return;
  }

  // TODO: support username:password, 
  // and non-ASCII hostnames and pathnames.
  if (!urlText.match(/^[\w:\/\?#\.\@= %&;~ '\+-]+$/i)) {
    urlPartsDiv.innerHTML =
      '😿 Sorry! Only ASCII for the moment.<br><br>' +
      'We\'re working on supporting username:password, <br>' +
      'and providing <a href="https://github.com/mathiasbynens/punycode.js">' +
      'Punycode</a> support and non-ASCII in pathnames.';
    return;
  }

  if (urlText.match(/\s/)) {
    urlPartsDiv.innerHTML = 'URL should not include spaces.';
    return;
  }

  let url;

  try {
    // Hack to allow URLs without scheme.
    url = urlText.match(/^https?:\/\//) ? new URL(urlText) :
      new URL(`https://${urlText}`);
  } catch (error) {
    console.log(`${urlText} is not a valid URL`, error);
    urlPartsDiv.innerHTML = 'Not a valid URL.';
    return;
  }

  //console.log('url', url);

  const hash = url.hash;
  const hostname = url.hostname;
  const origin = url.origin;
  const password = url.password;
  let pathname = url.pathname;
  const port = url.port;
  const search = url.search;
  const username = url.username;

  if (!hostname) {
    urlPartsDiv.innerHTML = '';
    return;
  }

  // Adding support for username and password is more difficult than I thought :/.
  // Besides they are very bad practice
  if (username || password) {
    console.log('username:', username, 'password:', password);
    urlPartsDiv.innerHTML = 'Sorry! Can\'t handle URLs with username or password (yet).';
    return;
  }

  // urlText is a valid URL that can be handled here,
  // so update the `?url= ...` search string in the URL bar.
  window.history.replaceState({url: urlText}, '', `${window.location.origin}${window.location.pathname}?url=${urlText}`);

  // Get filename.
  // Need to handle `example.com/foo` as opposed to `example.com/foo.html`
  const endPart = urlText.split('#').shift().
    split('?').shift().split('/').pop();
  // Need to handle URLs like `web.dev`: URL must have a `/` to have a filename.
  const filename = urlText.match(/\w\/\w/) && endPart.match(/\w+\.\w+/) ?
    endPart : '';

  // The URL API returns / for URLs without a pathname specified.
  // Only highlight / if it's at the end of a URL.
  if (pathname === '/' && !urlText.match(/\/$/)) {
    pathname = '';
  }

  const scheme =
    urlText.match(/^https:\/\//) ? 'https' :
      urlText.match(/^http:\/\//) ? 'http' : '';
  // Avoid a few common mistakes, such as a single `/` or missing `:`.
  if (scheme === '' &&
      (urlText.match(/^https?:\/\w/) || urlText.match(/^https?:\w/) ||
      urlText.match(/^https?\/\w/) || urlText.match(/^https?\//) || urlText.match(/\:\//))) {
    urlPartsDiv.innerHTML = 'Scheme format not valid.';
    return;
  }

  // Get the eTLD: this is the longest entry in the PSL
  // Note that the PSL includes single-part entries (com, au, etc.)
  // as well as multi-part entries (currently up to five parts).
  // All assigned TLDs in the Root Zone Database are in the PSL.
  
  let etld = '';
  for (const pslEntry of pslEntries) {
    // Hostname is not valid if it matches a PSL entry.
    if (hostname === pslEntry) {
      urlPartsDiv.innerHTML = `Not a valid URL:hostname <span id="input-hostname">${hostname}</span> is an ` +
        `eTLD. <br><br>(See the <a href="https://publicsuffix.org/">Public Suffix List</a>.)`;
      return;
    }
  
    // Check for match at end of hostname only.
    // Need to add \\. to avoid accepting hostnames that end in a valid (e)TLD, such as 'web.xcom', but this is optional so we can check this case later
    // Wildcards replaced with a match for sequences of not-period characters
    const pslEntryRegExpBody = pslEntry.replaceAll('.', '\\.').replaceAll('*', '[^.]+');
    const pslEntryRegExp = new RegExp(`(?<dot>\\.)?(?<etld>${pslEntryRegExpBody})$`);
    // Find the longest eTLD in the PSL that matches the hostname (e.g. 'co.uk' rather than just 'co').
    const hostnameMatch = hostname.match(pslEntryRegExp);
    if (hostnameMatch && pslEntry.length > etld.length) {
      // If it's excluded, remove wildcard requirement
      const excluded = pslEntries.includes(`!${hostnameMatch.groups.etld}`);
      const underETld = hostnameMatch.groups.dot == '.';
      if (excluded) {
        etld = pslEntry.replace('*.', '');
      // If it's not excluded, hostname must be under the (e)TLD
      } else if (underETld) {
        etld = hostnameMatch.groups.etld;
      }
    }
  }
  
  console.log('etld', etld);

  if (!etld) {
    urlPartsDiv.innerHTML = `No eTLD from the <a href="https://publicsuffix.org/">Public Suffix List</a>` +
      ` found in <br>hostname <span id="input-hostname">${hostname}</span>.`;
    return;
  }

  const etld1 = hostname.match(`[^\/\\\.]+\\\.${etld}`)[0];
  
  if (!etld1) {
    replace(`eTLD ${etld} specified, but no eTLD+1.`)
  }

  urlPartsDiv.innerHTML = urlText.replaceAll('&','&amp;');

  // The spans need to wrap the URL from the outside in:
  // origin > originWithoutPort > hostname > site > eTLD+1 > eTLD > TLD.

  urlPartsDiv.innerHTML = urlPartsDiv.innerHTML.
    replace(origin, `<span id="origin">${origin}</span>`);

  // Although the URL standard now mandates that a site must include a scheme,
  // span#site only wraps the eTLD+1.
  // The scheme border is connected with the span#site border by a dotted border,
  // by wrapping the whole origin (except the port) in span#site-dotted.
  if (scheme) {
    const siteDottedRegExp = new RegExp(`${scheme}.+?${hostname}`);
    urlPartsDiv.innerHTML = urlPartsDiv.innerHTML.
      replace(siteDottedRegExp, '<span id="site-dotted">$&</span>');
  }

  urlPartsDiv.innerHTML =
    urlPartsDiv.innerHTML.replace(hostname, `<span id="hostname">${hostname}</span>`);

  replace(etld1,
    `<span id="etld1">${etld1}</span>`);

  // Site now requires scheme according to the URL standard,
  // so a dotted line is added between the scheme and the other parts of site (see above).
  if (scheme) {
    replace(`<span id="etld1">${etld1}</span>`,
      `<span id="etld1"><span id="site">${etld1}</span></span>`);
    const site = hostname.split('.').slice(-2).join('.');
    // replace(site, `<span id="site">${site}</span>`);
  }

  // Add the dot to avoid replacing common etds (e.g. "it" which is part of "site-dotted" otherwise)
  replace('.' + etld,
    `.<span id="etld">${etld}</span>`);

  // Wrap TLD in a span.
  // If the hostname includes an eTLD, urlPartsDiv.innerHTML will be wrapped in a span.
  // Otherwise, the whole hostname will be wrapped in a span.
  const tld = hostname.split('.').pop();

  // Double check that tld is in the list at js/tld.js from the Root Zone Database.
  // All TLDs should also be in the PSL (checked earlier) so at this point the tld should always be valid.
  if (tldEntries.includes(tld.toUpperCase())) {
    // The TLD is the last part of span#etld
    const tldRegExp = new RegExp(`(<span id="etld">[^<]*)(${tld})`);
    replace(tldRegExp, '$1<span id="tld">$2</span>');
  } else {
    urlPartsDiv.innerHTML = 'TLD not found in the ' +
      '<a href="https://www.iana.org/domains/root/db">Root Zone Database</a>.';
    return;
  }

  // Hack: if the pathname is / then highlight the / after the origin
  // (not a / after the scheme).
  if (pathname === '/') {
    replace(/\/$/,
      `<span id="pathname">/</span>`);
  } else if (pathname) {
    replace(pathname,
      `<span id="pathname">${pathname}</span>`);
  }

  if (filename) {
    replace(filename,
      `<span id="filename">${filename}</span>`);
  }
  if (hash) {
    replace(hash,
      `<span id="hash">#<span id="fragment">${hash.slice(1)}</span></span>`);
    // Special handling for escaped characters
    if (hash.includes('&')) {
      replace(hash.replaceAll('&','&amp;'),
        `<span id="hash">#<span id="fragment">${hash.replaceAll('&','&amp;').slice(1)}</span></span>`);
    }
    
    if (hash.includes(':~:text=')) {
      replace(':~:text=',
        `<span id="text-fragment">:~:text=`);
      replace(/$/, `</span>`);
    }
  }

  // TODO: surprisingly complex to get this to work with other URL parts!  
  //       For example: origin does not include username and password but includes scheme
  //       Possible need a dashed thing, similar to site
  //
  //   if (username) {
  //     replace(username,
  //       `<span id="username">${username}</span>`);
  //     // Special handling for escaped characters
  //     if (username.includes('%40') || username.includes('%3A')) {
  //       replace(username.replaceAll('%40','@').replaceAll('%3A',':'),
  //         `<span id="username">${username.replaceAll('%40','@').replaceAll('%3A',':')}</span>`);
  //     }
  //   }

  //   if (password) {
  //     replace(password,
  //       `<span id="password">${password}</span>`);
  //     // // Special handling for escaped characters
  //     if (password.includes('%40') || password.includes('%3A')) {
  //       replace(password.replaceAll('%40','@').replaceAll('%3A',':'),
  //         `<span id="password">${password.replaceAll('%40','@').replaceAll('%3A',':')}</span>`);
  //     }
  //   }

  if (port) {
    replace(`:${port}`,
      `:<span id="port">${port}</span>`);
  }
  if (scheme) {
    replace(scheme + ':',
      // `<span id="scheme">${scheme}</span>`);
      `<span id="protocol"><span id="scheme"><span id="origin-scheme"><span id="site-scheme">` +
          `${scheme}</span></span></span>:</span>`);
  }
  // If the URL has a hash value *and* a search string,
  // the URL API (for hash) returns the hash and the search string.
  if (search) {
    replace(search,
      `<span id="search">?<span id="query">${search.slice(1)}</span></span>`);
    // Special handling for escaped characters
    if (search.includes('&')) {
      replace(search.replaceAll('&','&amp;'),
        `<span id="search">?<span id="query">${search.slice(1).replaceAll('&','&amp;')}</span></span>`);
    }
  }
}


// Utility functions

function log(label) {
  console.log(label, urlPartsDiv.innerHTML);
}

function replace(pattern, replacement) {
  urlPartsDiv.innerHTML = urlPartsDiv.innerHTML.replace(pattern, replacement);
}

