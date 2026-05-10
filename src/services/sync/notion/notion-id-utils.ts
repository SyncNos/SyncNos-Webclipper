function normalizeNotionIdCandidate(value: string): string {
  const raw = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/-/g, '');
  if (!raw) return '';
  if (!/^[0-9a-f]{32}$/.test(raw)) return '';
  return raw;
}

function pickLastNotionIdFromText(text: string): string {
  const input = String(text || '').trim();
  if (!input) return '';

  const matches: string[] = [];
  const uuidLike = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;
  const compact = /\b[0-9a-fA-F]{32}\b/g;

  for (const m of input.matchAll(uuidLike)) matches.push(String(m[0] || ''));
  for (const m of input.matchAll(compact)) matches.push(String(m[0] || ''));

  const last = matches.length ? matches[matches.length - 1] : '';
  return normalizeNotionIdCandidate(last);
}

/**
 * Accepts a Notion database ID (with or without hyphens) or a full Notion URL
 * and returns a normalized 32-hex database id (lowercase, without hyphens).
 *
 * Prefer the id in the URL path (e.g. `/.../<dbId>?v=<viewId>`), falling back
 * to scanning the whole string.
 */
export function normalizeNotionDatabaseIdInput(input: string): string {
  const raw = String(input || '').trim();
  if (!raw) return '';

  // Already an ID.
  const direct = normalizeNotionIdCandidate(raw);
  if (direct) return direct;

  // URL paste.
  try {
    const url = new URL(raw);
    const fromPath = pickLastNotionIdFromText(url.pathname);
    if (fromPath) return fromPath;
    const fromUrlText = pickLastNotionIdFromText(url.toString());
    if (fromUrlText) return fromUrlText;
  } catch (_e) {
    // ignore and fall back to raw scan
  }

  return pickLastNotionIdFromText(raw);
}

