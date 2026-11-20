// Renders brand/banner.html to PNGs: the link-preview image (assets/og-image.png, used by the site),
// a LinkedIn company cover (brand/linkedin-cover.png) and a square logo (brand/logo-400.png).
// Needs Chrome and puppeteer-core: `node brand/render.mjs [path-to-puppeteer-core]`.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const puppeteer = require(process.argv[2] || 'puppeteer-core');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve('brand/banner.html')).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
for (const [id, file] of [['og', 'assets/og-image.png'], ['linkedin', 'brand/linkedin-cover.png'], ['logo', 'brand/logo-400.png']]) {
  await (await page.$('#' + id)).screenshot({ path: file });
  console.log('wrote', file);
}
await browser.close();
