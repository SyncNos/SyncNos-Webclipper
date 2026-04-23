import { canonicalizeArticleUrl, normalizeHttpUrl } from '@services/url-cleaning/http-url';
import { canonicalizeVideoUrl } from '@services/url-cleaning/video-url';

function normalizeHost(hostname: string): string {
  return String(hostname || '')
    .trim()
    .toLowerCase();
}

function isYoutubeHost(hostname: string): boolean {
  const h = normalizeHost(hostname);
  return h === 'www.youtube.com' || h.endsWith('.youtube.com') || h === 'youtu.be';
}

function isBilibiliHost(hostname: string): boolean {
  const h = normalizeHost(hostname);
  return h === 'www.bilibili.com' || h.endsWith('.bilibili.com') || h === 'bilibili.com';
}

export function canonicalizeCommentTargetUrl(raw: unknown): string {
  const normalized = normalizeHttpUrl(raw);
  if (!normalized) return '';

  try {
    const url = new URL(normalized);
    if (isYoutubeHost(url.hostname) || isBilibiliHost(url.hostname)) {
      return canonicalizeVideoUrl(normalized) || normalized;
    }
  } catch (_e) {
    // ignore: fall back to normalized
  }

  return canonicalizeArticleUrl(normalized) || normalized;
}

