import fs from "node:fs";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <rect width="512" height="512" fill="#09090b" />
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#f59e0b" font-size="250" font-family="Inter, Arial, sans-serif" font-weight="700">TK</text>
</svg>`;

await fs.promises.mkdir("public", { recursive: true });
await sharp(Buffer.from(svg)).png({ quality: 100 }).resize(180, 180).toFile("public/apple-touch-icon.png");
await sharp(Buffer.from(svg)).png({ quality: 100 }).resize(32, 32).toFile("public/favicon-32x32.png");
await sharp(Buffer.from(svg)).png({ quality: 100 }).resize(16, 16).toFile("public/favicon-16x16.png");

const ico = await pngToIco(["public/favicon-32x32.png", "public/favicon-16x16.png"]);
await fs.promises.writeFile("public/favicon.ico", ico);
