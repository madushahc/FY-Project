/**
 * Utility to safely resolve media URLs (videos, documents, thumbnails, avatars).
 * Handles relative upload paths, raw external URLs, YouTube/Vimeo URLs, and empty/invalid values.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";

  const trimmed = url.trim();

  // Filter out literal "undefined" or "null" strings
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return "";

  // Return full external URLs, blob URLs, or data URLs as-is
  if (/^(https?:|blob:|data:)/i.test(trimmed)) {
    return trimmed;
  }

  // Determine backend base origin (derived from NEXT_PUBLIC_API_URL or localhost default)
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const origin = apiBase.replace(/\/api\/?$/, "");

  // Prepend backend origin to relative upload paths
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${origin}${cleanPath}`;
}

/**
 * Returns embed URL for YouTube video link if applicable, else null.
 */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // Match youtube.com/watch?v=ID or youtube.com/embed/ID or youtu.be/ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=0&enablejsapi=1`;
  }

  return null;
}

/**
 * Returns embed URL for Vimeo video link if applicable, else null.
 */
export function getVimeoEmbedUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // Match vimeo.com/ID or player.vimeo.com/video/ID
  const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const match = trimmed.match(regExp);

  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }

  return null;
}
