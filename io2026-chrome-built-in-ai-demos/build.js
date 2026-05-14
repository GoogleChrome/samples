import puppeteer from 'puppeteer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const DEMOS_MD = path.join(__dirname, 'demos.md');
const DEMOS_JSON = path.join(__dirname, 'demos.json');
const INDEX_HTML = path.join(__dirname, 'index.html');

// All top-level Built-in AI class names from the IDL
const BUILTIN_AI_APIS = [
  'LanguageModel',
  'Translator',
  'LanguageDetector',
  'Summarizer',
  'Writer',
  'Rewriter',
];

function detectApisInSource(js) {
  return BUILTIN_AI_APIS.filter((api) => new RegExp(`\\b${api}\\b`).test(js));
}

function parseDemosMd(content) {
  const sections = [];
  let current = null;
  for (const line of content.split('\n')) {
    const h = line.match(/^##\s+(.+)/);
    if (h) { current = { heading: h[1].trim(), eyebrow: '', urls: [] }; sections.push(current); continue; }
    if (!current) continue;
    const u = line.match(/^\s*-\s+(https?:\/\/\S+)/);
    if (u) { current.urls.push(u[1]); continue; }
    // Capture first paragraph (before any URLs) as eyebrow text
    if (!current.urls.length) {
      const text = line.trim();
      if (text) current.eyebrow += (current.eyebrow ? ' ' : '') + text;
    }
  }
  return sections;
}

function urlToSlug(url) {
  const { hostname, pathname } = new URL(url);
  const pathPart = pathname.split('/').filter(Boolean).join('-');
  const raw = pathPart ? `${hostname}--${pathPart}` : hostname;
  return raw.replace(/[^a-z0-9._-]/gi, '-').toLowerCase();
}

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// Common cookie banner selectors (OneTrust, Cookiebot, Osano, generic)
const COOKIE_SELECTORS = [
  '#onetrust-accept-btn-handler',
  '#accept-recommended-btn-handler',
  '.onetrust-accept-btn-handler',
  '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
  '#CybotCookiebotDialogBodyButtonAccept',
  '.cc-btn.cc-allow',
  '.cc-accept-all',
  '[data-cookiebanner="accept_button"]',
  '[data-testid="cookie-accept"]',
  '[data-testid="accept-cookies"]',
  '[aria-label="Accept cookies"]',
  '[aria-label="Accept all cookies"]',
  '.osano-cm-accept-all',
  '.osano-cm-button--type_accept',
  '#cookie-notice .button',
  '.js-accept-cookies',
  '.cookie-consent-accept',
  '#gdpr-consent-tool-wrapper button[mode="primary"]',
  '.gdpr-consent-btn',
  'button#acceptAllButton',
  'button.accept-all',
];

// Patterns to match accept/agree button text
const COOKIE_TEXT_RE = /^(accept all|accept|allow all|allow|agree|i agree|got it|ok|okay|continue)$/i;

async function dismissCookieBanner(page) {
  // Try known selectors first
  for (const sel of COOKIE_SELECTORS) {
    try {
      const el = await page.$(sel);
      if (el) {
        const visible = await el.isIntersectingViewport().catch(() => true);
        if (visible) {
          await el.click();
          await new Promise((r) => setTimeout(r, 800));
          return;
        }
      }
    } catch { /* ignore */ }
  }

  // Fall back to text-matching any button/role=button element
  try {
    const clicked = await page.evaluate((re) => {
      const candidates = [
        ...document.querySelectorAll('button, [role="button"]'),
      ];
      for (const el of candidates) {
        const text = el.innerText?.trim() ?? '';
        if (new RegExp(re).test(text)) {
          el.click();
          return true;
        }
      }
      return false;
    }, COOKIE_TEXT_RE.source);
    if (clicked) await new Promise((r) => setTimeout(r, 800));
  } catch { /* ignore */ }
}

const API_LABELS = {
  LanguageModel: 'Prompt API',
  Translator: 'Translator',
  LanguageDetector: 'Language Detector',
  Summarizer: 'Summarizer',
  Writer: 'Writer',
  Rewriter: 'Rewriter',
};

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY missing in .env');
    process.exit(1);
  }

  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });

  const sections = parseDemosMd(await fs.readFile(DEMOS_MD, 'utf-8'));
  const allEntries = sections.flatMap(({ heading, urls }) =>
    urls.map((url) => ({ url, section: heading }))
  );
  const urlToSection = new Map(allEntries.map(({ url, section }) => [url, section]));

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
    protocolTimeout: 120_000,
  });

  // Load existing results so we can skip already-processed URLs.
  // Support both old flat array and new section-grouped format.
  let existing = [];
  try {
    const saved = JSON.parse(await fs.readFile(DEMOS_JSON, 'utf-8'));
    existing = Array.isArray(saved) && saved[0]?.demos
      ? saved.flatMap((s) => s.demos.map((d) => ({ ...d, section: s.heading })))
      : saved;
  } catch {}
  const existingUrls = new Set(existing.map((d) => d.url));

  const demos = [...existing];
  let geminiCallCount = 0;

  for (const { url, section } of allEntries) {
    if (existingUrls.has(url)) {
      console.log(`\n▸ ${url}\n  ↩ already processed, skipping`);
      continue;
    }
    console.log(`\n▸ ${url}`);
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    await page.setViewport({ width: 1280, height: 720 });

    try {
      // Intercept JS responses to scan source for API usage
      const jsChunks = [];
      const onResponse = async (response) => {
        try {
          const ct = response.headers()['content-type'] || '';
          if (
            ct.includes('javascript') ||
            ct.includes('ecmascript') ||
            /\.m?js(\?|$)/.test(response.url())
          ) {
            jsChunks.push(await response.text());
          }
        } catch {
          /* ignore failed reads */
        }
      };
      page.on('response', onResponse);

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30_000 });
      await new Promise((r) => setTimeout(r, 2_500));
      page.off('response', onResponse);

      await dismissCookieBanner(page);

      // Also grab inline scripts
      const inlineJs = await page.evaluate(() =>
        [...document.querySelectorAll('script:not([src])')]
          .map((s) => s.textContent)
          .join('\n')
      );
      const allJs = [...jsChunks, inlineJs].join('\n');

      // Detect APIs from actual source — no guessing needed
      const apis = detectApisInSource(allJs);
      console.log(
        `  ✓ apis (from source): ${apis.length ? apis.join(', ') : '(none detected)'}`
      );

      const title = await page.title();
      const innerText = await page.evaluate(() =>
        document.body.innerText.trim().slice(0, 4_000)
      );

      const slug = urlToSlug(url);
      const screenshotFile = `${slug}.png`;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, screenshotFile),
        clip: { x: 0, y: 0, width: 1280, height: 720 },
        captureBeyondViewport: false,
      });
      console.log(`  ✓ screenshot → screenshots/${screenshotFile}`);

      const prompt = `You are writing a one-line description for a Chrome Built-in AI demo web app.

URL: ${url}
Page title: ${title}
Page text (truncated):
${innerText}

Write a punchy single sentence (max 110 chars, no trailing period) describing what the demo does.
Respond with ONLY a valid JSON object, no markdown fences:
{"description":"..."}`;

      // Pace Gemini calls; retry with backoff on 429
      if (geminiCallCount++ > 0) await new Promise((r) => setTimeout(r, 4_000));
      let result;
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          result = await model.generateContent(prompt);
          break;
        } catch (e) {
          if (!e.message.includes('429') || attempt === 3) throw e;
          const wait = 15_000 * (attempt + 1);
          console.log(
            `  ⏳ 429 — waiting ${wait / 1000}s before retry ${attempt + 1}…`
          );
          await new Promise((r) => setTimeout(r, wait));
        }
      }
      const raw = result.response.text().trim();
      const jsonStr = raw.startsWith('{')
        ? raw
        : (raw.match(/\{[\s\S]*\}/) ?? ['{}'])[0];
      const { description } = JSON.parse(jsonStr);

      console.log(`  ✓ description: ${description}`);

      // Clean up title — strip common suffixes like "- Chrome Web AI Demos"
      const cleanTitle = title.split(/\s*[-–|]\s*/)[0].trim();

      demos.push({
        url,
        title: cleanTitle,
        description,
        apis,
        screenshot: `screenshots/${screenshotFile}`,
        section,
      });
    } catch (err) {
      console.error(`  ✗ Error processing ${url}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Apply/update section for all entries and sort to match demos.md order
  const urlOrder = new Map(allEntries.map(({ url }, i) => [url, i]));
  for (const demo of demos) {
    const s = urlToSection.get(demo.url);
    if (s) demo.section = s;
  }
  demos.sort((a, b) => (urlOrder.get(a.url) ?? Infinity) - (urlOrder.get(b.url) ?? Infinity));

  // Output as section-grouped format
  const grouped = sections.map(({ heading, eyebrow }) => ({
    heading,
    eyebrow,
    demos: demos
      .filter((d) => d.section === heading)
      .map(({ section, ...rest }) => rest),
  }));

  // Write demos.json
  const demosJson = JSON.stringify(grouped, null, 2);
  await fs.writeFile(DEMOS_JSON, demosJson);
  console.log('\n✓ demos.json written');

  // Inject data into the <script id="demos-data"> block in index.html
  const html = await fs.readFile(INDEX_HTML, 'utf-8');
  const updated = html.replace(
    /<script id="demos-data" type="application\/json">[\s\S]*?<\/script>/,
    `<script id="demos-data" type="application/json">\n${demosJson}\n</script>`
  );
  await fs.writeFile(INDEX_HTML, updated);
  console.log('✓ index.html updated\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
