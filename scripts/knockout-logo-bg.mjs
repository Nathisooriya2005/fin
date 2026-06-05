/**
 * Makes outer background transparent via edge flood-fill (keeps white inside letters, e.g. shuttlecock).
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { renameSync, unlinkSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputPath = join(root, "src", "assets", "logo-brand.png");
const outputPath = join(root, "src", "assets", "logo-brand-transparent.tmp.png");

function isBackgroundLike(r, g, b) {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const maxc = Math.max(r, g, b);
  const minc = Math.min(r, g, b);
  const sat = maxc === 0 ? 0 : (maxc - minc) / maxc;
  // Light neutrals (white / light grey) — not saturated greens
  return lum > 218 && sat < 0.35;
}

const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const buf = new Uint8ClampedArray(data);
const w = width;
const h = height;
const idx = (x, y) => (y * w + x) * 4;

const visited = new Uint8Array(w * h);
const queue = [];

function tryPush(x, y) {
  if (x < 0 || x >= w || y < 0 || y >= h) return;
  const i = y * w + x;
  if (visited[i]) return;
  const p = idx(x, y);
  const r = buf[p],
    g = buf[p + 1],
    b = buf[p + 2];
  if (!isBackgroundLike(r, g, b)) return;
  visited[i] = 1;
  queue.push([x, y]);
}

for (let x = 0; x < w; x++) {
  tryPush(x, 0);
  tryPush(x, h - 1);
}
for (let y = 0; y < h; y++) {
  tryPush(0, y);
  tryPush(w - 1, y);
}

while (queue.length) {
  const [x, y] = queue.pop();
  const p = idx(x, y);
  buf[p + 3] = 0;
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nx = x + dx,
      ny = y + dy;
    if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
    const ni = ny * w + nx;
    if (visited[ni]) continue;
    const np = idx(nx, ny);
    const r = buf[np],
      g = buf[np + 1],
      b = buf[np + 2];
    if (!isBackgroundLike(r, g, b)) continue;
    visited[ni] = 1;
    queue.push([nx, ny]);
  }
}

await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

const finalPath = join(root, "src", "assets", "logo-brand.png");
try {
  unlinkSync(finalPath);
} catch {
  /* ignore */
}
renameSync(outputPath, finalPath);

console.log("Wrote transparent PNG:", finalPath);
