// Cuts the manager's logo (brand/logo-original.png, on a near-white background) into transparent PNGs:
//   brand/logo-full.png      — the whole stacked logo
//   assets/logo-mark.png     — the D symbol only
//   assets/logo-lockup.png   — D symbol + wordmark side by side (site header/footer)
//   assets/favicon.png       — square browser-tab icon (the D symbol)
// Usage: node brand/prepare-logo.mjs [path-to-puppeteer-core]   (needs Chrome)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const puppeteer = require(process.argv[2] || 'puppeteer-core');
const src = 'data:image/png;base64,' + readFileSync('brand/logo-original.png').toString('base64');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();

const out = await page.evaluate(async (src) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  const W = img.width, H = img.height;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, W, H); const p = d.data;
  // Colour-to-alpha against white (keeps soft anti-aliased edges); the faint background glow drops out.
  for (let i = 0; i < p.length; i += 4) {
    const a = Math.max(255 - p[i], 255 - p[i + 1], 255 - p[i + 2]) / 255;
    if (a < 0.14) { p[i + 3] = 0; continue; }
    for (let k = 0; k < 3; k++) p[i + k] = Math.round((p[i + k] - 255 * (1 - a)) / a);
    p[i + 3] = Math.round(a * 255);
  }
  // The source image has a thin frame line along its edges; drop a 4px margin.
  for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) if (y < 4 || xx < 4 || y >= H - 4 || xx >= W - 4) p[(y * W + xx) * 4 + 3] = 0;
  x.putImageData(d, 0, 0);

  // Bounding box of visible pixels within a band of rows.
  const bbox = (y0, y1) => {
    let minX = W, minY = H, maxX = -1, maxY = -1;
    for (let y = y0; y < y1; y++) for (let xx = 0; xx < W; xx++) if (p[(y * W + xx) * 4 + 3] > 90) {
      if (xx < minX) minX = xx; if (xx > maxX) maxX = xx; if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  };
  // The symbol ends above the wordmark: find the first fully empty row gap after the symbol starts.
  const rowEmpty = (y) => { for (let xx = 0; xx < W; xx++) if (p[(y * W + xx) * 4 + 3] > 90) return false; return true; };
  let top = 0; while (rowEmpty(top)) top++;
  let split = top; while (!rowEmpty(split)) split++;
  const mark = bbox(0, split), word = bbox(split, H), full = bbox(0, H);

  const cut = (b, pad = 4) => { const k = document.createElement('canvas'); k.width = b.w + pad * 2; k.height = b.h + pad * 2; k.getContext('2d').drawImage(c, b.x, b.y, b.w, b.h, pad, pad, b.w, b.h); return k; };
  const png = (k) => k.toDataURL('image/png');

  // Side-by-side lockup: symbol and wordmark at the same height.
  const m = cut(mark), w = cut(word);
  const LH = 240, gap = 24, mw = m.width * LH / m.height, ww = w.width * (LH * 0.62) / w.height;
  const lk = document.createElement('canvas'); lk.width = Math.ceil(mw + gap + ww); lk.height = LH;
  const lx = lk.getContext('2d'); lx.imageSmoothingQuality = 'high';
  lx.drawImage(m, 0, 0, mw, LH);
  lx.drawImage(w, mw + gap, LH * 0.19, ww, LH * 0.62);

  // Square favicon from the symbol.
  const S = 128, fv = document.createElement('canvas'); fv.width = fv.height = S;
  const fs = Math.min(S / m.width, S / m.height), fx = fv.getContext('2d'); fx.imageSmoothingQuality = 'high';
  fx.drawImage(m, (S - m.width * fs) / 2, (S - m.height * fs) / 2, m.width * fs, m.height * fs);

  return { full: png(cut(full)), mark: png(m), lockup: png(lk), favicon: png(fv), sizes: { W, H, split, mark, word, lockup: [lk.width, lk.height] } };
}, src);

const save = (file, dataUrl) => { writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64')); console.log('wrote', file); };
save('brand/logo-full.png', out.full);
save('assets/logo-mark.png', out.mark);
save('assets/logo-lockup.png', out.lockup);
save('assets/favicon.png', out.favicon);
console.log(JSON.stringify(out.sizes));
await browser.close();
