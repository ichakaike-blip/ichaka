export default function wsrvLoader({ src, width, quality }) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_SITE_URL || "https://ichaka.com.ng";

  const url = new URL(src, baseUrl);

  return `https://wsrv.nl/?url=${encodeURIComponent(url.href)}&w=${width}&q=${quality || 75}&output=webp`;
}