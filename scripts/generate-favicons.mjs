import fs from "node:fs";
import sharp from "sharp";

const sourcePath = "public/logo.png";

if (!fs.existsSync(sourcePath)) {
  throw new Error(`Missing ${sourcePath}. Add your logo image first.`);
}

async function makeIcon(size, outPath, paddingPx) {
  const trimmed = sharp(sourcePath).trim();
  const metadata = await trimmed.metadata();
  const innerSize = Math.max(size - paddingPx * 2, 1);

  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read image dimensions from ${sourcePath}`);
  }

  const left = Math.floor((size - innerSize) / 2);
  const top = Math.floor((size - innerSize) / 2);
  const right = size - innerSize - left;
  const bottom = size - innerSize - top;

  await trimmed
    .resize(innerSize, innerSize, { fit: "contain" })
    .extend({
      top,
      right,
      bottom,
      left,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ quality: 100 })
    .toFile(outPath);
}

await fs.promises.mkdir("public", { recursive: true });
await makeIcon(180, "public/apple-touch-icon.png", 18);
await makeIcon(32, "public/favicon-32x32.png", 2);
await makeIcon(16, "public/favicon-16x16.png", 1);
