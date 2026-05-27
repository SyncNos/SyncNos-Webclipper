import { notionFetch } from '@services/sync/notion/notion-api';

type ToggleHeadingLevel = 1 | 2 | 3;

function safeString(value: unknown): string {
  return String(value == null ? '' : value).trim();
}

function isArchivedBlock(block: any): boolean {
  try {
    return (block as any)?.archived === true || (block as any)?.in_trash === true;
  } catch (_e) {
    return false;
  }
}

function readPlainTextFromRichText(items: unknown): string {
  const list = Array.isArray(items) ? items : [];
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return '';
      const plain = (item as any).plain_text;
      if (plain != null) return String(plain);
      const content = (item as any)?.text?.content;
      if (content != null) return String(content);
      return '';
    })
    .join('');
}

function headingTypeForLevel(level: ToggleHeadingLevel): 'heading_1' | 'heading_2' | 'heading_3' {
  if (level === 1) return 'heading_1';
  if (level === 2) return 'heading_2';
  return 'heading_3';
}

function isHeadingType(type: unknown): type is 'heading_1' | 'heading_2' | 'heading_3' {
  const t = safeString(type);
  return t === 'heading_1' || t === 'heading_2' || t === 'heading_3';
}

export function buildToggleHeadingBlock(title: string, level: ToggleHeadingLevel = 2) {
  const resolvedTitle = safeString(title);
  const type = headingTypeForLevel(level);
  const rich_text = [{ type: 'text', text: { content: resolvedTitle || 'Untitled' } }];
  return {
    object: 'block',
    type,
    [type]: {
      rich_text,
      is_toggleable: true,
    },
  } as any;
}

export async function listBlockChildren(accessToken: string, blockId: string): Promise<any[]> {
  const out: any[] = [];
  let cursor: string | null = null;
  for (;;) {
    const qs = cursor ? `?page_size=100&start_cursor=${encodeURIComponent(String(cursor))}` : '?page_size=100';

    const res = await notionFetch({ accessToken, method: 'GET', path: `/v1/blocks/${blockId}/children${qs}` } as any);
    const results = Array.isArray((res as any)?.results) ? (res as any).results : [];
    out.push(...results);
    if (!(res as any)?.has_more) break;
    cursor = (res as any)?.next_cursor ? String((res as any).next_cursor) : null;
    if (!cursor) break;
  }
  return out;
}

export async function retrieveBlock(accessToken: string, blockId: string): Promise<any> {
  const id = safeString(blockId);
  if (!id) throw new Error('missing blockId');
  return notionFetch({ accessToken, method: 'GET', path: `/v1/blocks/${encodeURIComponent(id)}` } as any);
}

export async function archiveBlock(accessToken: string, blockId: string): Promise<any> {
  const id = safeString(blockId);
  if (!id) throw new Error('missing blockId');
  // Notion uses DELETE to archive blocks.
  return notionFetch({ accessToken, method: 'DELETE', path: `/v1/blocks/${id}` } as any);
}

export function isToggleHeadingBlock(block: any): boolean {
  if (isArchivedBlock(block)) return false;
  const type = safeString(block?.type);
  if (!isHeadingType(type)) return false;
  const payload = (block as any)?.[type];
  if (!payload) return false;
  const isToggleable = (payload as any).is_toggleable;
  if (isToggleable === true) return true;
  // Some Notion API responses (or older API versions) may omit `is_toggleable` even for toggle headings.
  // When the block already has children, treat it as a toggle heading so we can re-discover anchors and
  // avoid appending duplicate section headings on subsequent sync runs.
  if (isToggleable == null && (block as any)?.has_children === true) return true;
  return false;
}

function toggleHeadingTitle(block: any): string {
  const type = safeString(block?.type);
  const payload = type ? (block as any)?.[type] : null;
  return readPlainTextFromRichText(payload?.rich_text);
}

export function isHeadingBlock(block: any): boolean {
  if (isArchivedBlock(block)) return false;
  const type = safeString(block?.type);
  if (!isHeadingType(type)) return false;
  const payload = (block as any)?.[type];
  return !!payload;
}

export function findToggleHeadingBlock(children: any[], title: string): any | null {
  const list = Array.isArray(children) ? children : [];
  const needle = safeString(title);
  if (!needle) return null;
  for (const block of list) {
    if (!block || typeof block !== 'object') continue;
    if (!isToggleHeadingBlock(block)) continue;
    if (toggleHeadingTitle(block) === needle) return block;
  }
  return null;
}

export function findHeadingBlocksByTitle(children: any[], title: string): any[] {
  const list = Array.isArray(children) ? children : [];
  const needle = safeString(title);
  if (!needle) return [];
  const out: any[] = [];
  for (const block of list) {
    if (!block || typeof block !== 'object') continue;
    if (!isHeadingBlock(block)) continue;
    if (toggleHeadingTitle(block) !== needle) continue;
    out.push(block);
  }
  return out;
}
