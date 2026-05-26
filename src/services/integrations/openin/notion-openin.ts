import type { Conversation } from '@services/conversations/domain/models';
import type { DetailHeaderAction, DetailHeaderActionPort } from '@services/integrations/detail-header-action-types';
import { extractNotionWorkspaceSlugFromUrl } from '@services/sync/notion/notion-url-utils';

const NOTION_PAGE_ID_PATTERN = /^[0-9a-f]{32}$/i;

export function normalizeNotionPageId(pageId?: string | null): string {
  const compact = String(pageId || '')
    .trim()
    .replace(/-/g, '');
  return NOTION_PAGE_ID_PATTERN.test(compact) ? compact.toLowerCase() : '';
}

export function buildNotionPageUrl(
  pageId?: string | null,
  opts?: { workspaceSlug?: string | null; pageUrl?: string | null },
): string {
  const normalizedPageId = normalizeNotionPageId(pageId);
  if (!normalizedPageId) return '';

  const explicitSlug = String(opts?.workspaceSlug || '').trim();
  const urlSlug = extractNotionWorkspaceSlugFromUrl(opts?.pageUrl);
  const slug = explicitSlug || urlSlug;
  if (slug) return `https://app.notion.com/p/${slug}/${normalizedPageId}`;

  // Fallback: Notion's canonical web URL format works without a workspace segment.
  return `https://www.notion.so/${normalizedPageId}`;
}

export function buildNotionOpenInAction({
  conversation,
  port,
  labels,
}: {
  conversation: Conversation | null | undefined;
  port: DetailHeaderActionPort;
  labels: { openInNotion: string };
}): DetailHeaderAction | null {
  const notionUrl = buildNotionPageUrl(conversation?.notionPageId, {
    workspaceSlug: conversation?.notionWorkspaceSlug,
    pageUrl: conversation?.notionPageUrl,
  });
  if (!notionUrl) return null;

  return {
    id: 'open-in-notion',
    label: labels.openInNotion,
    kind: 'external-link',
    provider: 'notion',
    slot: 'open',
    href: notionUrl,
    onTrigger: async () => {
      const opened = await port.openExternalUrl(notionUrl);
      if (!opened) throw new Error('Failed to open Notion page');
    },
  };
}
