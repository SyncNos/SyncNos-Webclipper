const NOTION_WORKSPACE_SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]*$/i;
const NOTION_PAGE_ID_PATTERN = /^[0-9a-f]{32}$/i;

function safeString(value: unknown): string {
  return String(value ?? '').trim();
}

function isNotionHost(hostname: string): boolean {
  const host = safeString(hostname).toLowerCase();
  if (!host) return false;
  if (host === 'notion.so' || host.endsWith('.notion.so')) return true;
  if (host === 'www.notion.so' || host.endsWith('.www.notion.so')) return true;
  if (host === 'app.notion.com' || host.endsWith('.app.notion.com')) return true;
  return false;
}

function looksLikePageId(segment: string): boolean {
  const compact = safeString(segment).replace(/-/g, '');
  return NOTION_PAGE_ID_PATTERN.test(compact);
}

/**
 * Best-effort extraction of a workspace slug from a Notion URL.
 *
 * Examples we want to handle:
 * - https://www.notion.so/<workspace>/<title>-<pageId>
 * - https://app.notion.com/<workspace>/<title>-<pageId>
 * - https://app.notion.com/p/<workspace>/<pageId>
 *
 * If the URL does not include a workspace segment, returns empty string.
 */
export function extractNotionWorkspaceSlugFromUrl(input: unknown): string {
  const raw = safeString(input);
  if (!raw) return '';

  try {
    const url = new URL(raw);
    if (!isNotionHost(url.hostname)) return '';

    const segments = String(url.pathname || '')
      .split('/')
      .map((s) => safeString(s))
      .filter(Boolean);
    if (!segments.length) return '';

    // app.notion.com/p/<workspace>/<pageId>
    if (segments[0] === 'p' && segments.length >= 3) {
      const slug = segments[1] || '';
      if (slug && NOTION_WORKSPACE_SLUG_PATTERN.test(slug) && !looksLikePageId(slug)) return slug;
      return '';
    }

    // /chat, /image, or /<pageId>
    const first = segments[0] || '';
    if (!first) return '';
    if (first === 'chat' || first === 'image') return '';
    if (looksLikePageId(first)) return '';

    // /<workspace>/<title>-<pageId>
    if (NOTION_WORKSPACE_SLUG_PATTERN.test(first)) return first;
    return '';
  } catch (_e) {
    return '';
  }
}
