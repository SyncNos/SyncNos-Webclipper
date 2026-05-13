import type { Conversation } from '@services/conversations/domain/models';
import type { DetailHeaderAction, DetailHeaderActionPort } from '@services/integrations/detail-header-action-types';

function safeString(value: unknown): string {
  return String(value || '').trim();
}

export function normalizeFeishuDocId(docId?: string | null): string {
  return safeString(docId);
}

export function buildFeishuDocUrl(docId?: string | null): string {
  const token = normalizeFeishuDocId(docId);
  if (!token) return '';
  return `https://www.feishu.cn/docx/${encodeURIComponent(token)}`;
}

export function buildFeishuOpenInAction({
  conversation,
  port,
  labels,
}: {
  conversation: Conversation | null | undefined;
  port: DetailHeaderActionPort;
  labels: { openInFeishu: string };
}): DetailHeaderAction | null {
  const feishuUrl = buildFeishuDocUrl((conversation as any)?.feishuDocId);
  if (!feishuUrl) return null;

  return {
    id: 'open-in-feishu',
    label: labels.openInFeishu,
    kind: 'external-link',
    provider: 'feishu',
    slot: 'open',
    href: feishuUrl,
    onTrigger: async () => {
      const opened = await port.openExternalUrl(feishuUrl);
      if (!opened) throw new Error('Failed to open Feishu doc');
    },
  };
}

