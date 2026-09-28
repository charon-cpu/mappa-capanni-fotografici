// Script una-tantum: genera favicon raster (PNG + ICO) e l'immagine Open
// Graph di default a partire da public/favicon.svg e dal logo.
// Uso: node scripts/genera-immagini-identita.mjs
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faviconSvg = readFileSync(new URL('../public/favicon.svg', import.meta.url));

async function makeFaviconPng(size) {
  return sharp(faviconSvg, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

const sizes = [16, 32, 48];
const buffers = {};
for (const size of sizes) {
  buffers[size] = await makeFaviconPng(size);
  writeFileSync(new URL(`../public/favicon-${size}.png`, import.meta.url), buffers[size]);
}
// apple-touch-icon: sfondo pieno (iOS non gestisce bene la trasparenza)
const appleTouch = await sharp(faviconSvg, { density: 384 })
  .resize(180, 180, { fit: 'contain', background: '#ffffff' })
  .flatten({ background: '#ffffff' })
  .png()
  .toBuffer();
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), appleTouch);

const icoBuffer = await pngToIco([buffers[16], buffers[32], buffers[48]]);
writeFileSync(new URL('../public/favicon.ico', import.meta.url), icoBuffer);

console.log('Favicon PNG/ICO generati.');

// ---------- Immagine Open Graph di default (1200x630) ----------
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f6b5c" />
      <stop offset="100%" stop-color="#123f37" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <g transform="translate(150,90) scale(3.6)" color="#ffffff">
    <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M 6 50 L 58 50" opacity="0.55" />
    <path fill="currentColor" d="M 48 32 L 58 27 L 58 39 Z" />
    <ellipse cx="35" cy="35" rx="17" ry="14" fill="currentColor" />
    <circle cx="19" cy="23" r="14" fill="currentColor" />
    <path fill="currentColor" d="M 8 20 L 8 27 L 26 24 Z" />
    <circle cx="20.5" cy="21" r="1.6" fill="#0f6b5c" />
    <g stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
      <path d="M 29 48 L 29 50" />
      <path d="M 40 48 L 40 50" />
    </g>
  </g>
  <text x="150" y="430" font-family="Arial, sans-serif" font-size="58" font-weight="700" fill="#ffffff">Capanni Italia</text>
  <text x="150" y="480" font-family="Arial, sans-serif" font-size="30" fill="#d7ece7">Capanni fotografici e oasi naturalistiche in Italia</text>
</svg>
`;

mkdirSync(new URL('../public/og/', import.meta.url), { recursive: true });
await sharp(Buffer.from(ogSvg))
  .png()
  .toFile(fileURLToPath(new URL('../public/og/default.png', import.meta.url)));
console.log('Immagine Open Graph di default generata.');
