export function cloudinaryFetch(
  rawUrl: string,
  options: { width?: number; height?: number; quality?: number | "auto" } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!rawUrl || !cloudName) {
    return rawUrl;
  }

  const { width, height, quality = "auto" } = options;
  const transforms = [
    width && `w_${width}`,
    height && `h_${height}`,
    `q_${quality}`,
    "f_auto",
    "c_limit",
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transforms}/${encodeURIComponent(rawUrl)}`;
}

export function extractRawUrl(url: string): string {
  if (url.includes("wsrv.nl")) {
    const match = url.match(/[?&]url=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : url;
  }
  return url;
}