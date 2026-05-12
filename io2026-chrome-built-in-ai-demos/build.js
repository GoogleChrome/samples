import puppeteer from 'puppeteer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const DEMOS_TXT = path.join(__dirname, 'demos.txt');
const DEMOS_JSON = path.join(__dirname, 'demos.json');
const INDEX_HTML = path.join(__dirname, 'index.html');

// Map API class names to human-readable labels used in the page
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
  if (!apiKey) { console.error('GEMINI_API_KEY missing in .env'); process.exit(1); }

  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });

  const urls = (await fs.readFile(DEMOS_TXT, 'utf-8'))
    .split('\n').map(l => l.trim()).filter(Boolean);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Load existing results so we can skip already-processed URLs
  let existing = [];
  try { existing = JSON.parse(await fs.readFile(DEMOS_JSON, 'utf-8')); } catch {}
  const existingUrls = new Set(existing.map(d => d.url));

  const demos = [...existing];
  let geminiCallCount = 0;

  for (const url of urls) {
    if (existingUrls.has(url)) { console.log(`\n▸ ${url}\n  ↩ already processed, skipping`); continue; }
    console.log(`\n▸ ${url}`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30_000 });
      // Give SPAs extra time to render
      await new Promise(r => setTimeout(r, 2_500));

      const title = await page.title();
      const innerText = await page.evaluate(
        () => document.body.innerText.trim().slice(0, 4_000)
      );

      const slug = new URL(url).pathname.split('/').filter(Boolean).pop();
      const screenshotFile = `${slug}.png`;
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, screenshotFile),
        clip: { x: 0, y: 0, width: 1280, height: 720 },
      });
      console.log(`  ✓ screenshot → screenshots/${screenshotFile}`);

      const prompt = `You are analyzing a Chrome Built-in AI demo web app. Identify which APIs it uses and write a short description.

URL: ${url}
Page title: ${title}
Page text (truncated):
${innerText}

Available Chrome Built-in AI APIs — pick only the ones actually demonstrated:
- LanguageModel  → Prompt API (window.LanguageModel): text generation, Q&A, multimodal (image/audio) inference
- Translator     → Translation API (window.Translator): translate text between languages
- LanguageDetector → Language Detector (window.LanguageDetector): detect which language text is in
- Summarizer     → Summarizer API (window.Summarizer): condense long documents
- Writer         → Writer API (window.Writer): generate written content from scratch
- Rewriter       → Rewriter API (window.Rewriter): improve or rewrite existing text

Instructions:
1. Write a punchy single sentence (max 110 chars, no trailing period) describing what the demo does.
2. Return only the API class names actually used (from the list above).

Respond with ONLY a valid JSON object, no markdown fences:
{"description":"...","apis":["ClassName1","ClassName2"]}`;

      // Pace Gemini calls; retry with backoff on 429
      if (geminiCallCount++ > 0) await new Promise(r => setTimeout(r, 4_000));
      let result;
      for (let attempt = 0; attempt < 4; attempt++) {
        try { result = await model.generateContent(prompt); break; }
        catch (e) {
          if (!e.message.includes('429') || attempt === 3) throw e;
          const wait = 15_000 * (attempt + 1);
          console.log(`  ⏳ 429 — waiting ${wait / 1000}s before retry ${attempt + 1}…`);
          await new Promise(r => setTimeout(r, wait));
        }
      }
      const raw = result.response.text().trim();
      const jsonStr = raw.startsWith('{') ? raw : (raw.match(/\{[\s\S]*\}/) ?? ['{}'])[0];
      const { description, apis } = JSON.parse(jsonStr);

      console.log(`  ✓ description: ${description}`);
      console.log(`  ✓ apis: ${apis.join(', ')}`);

      // Clean up title — strip common suffixes like "- Chrome Web AI Demos"
      const cleanTitle = title.split(/\s*[-–|]\s*/)[0].trim();

      demos.push({ url, title: cleanTitle, description, apis, screenshot: `screenshots/${screenshotFile}` });

    } catch (err) {
      console.error(`  ✗ Error processing ${url}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Write demos.json
  const demosJson = JSON.stringify(demos, null, 2);
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

main().catch(err => { console.error(err); process.exit(1); });
