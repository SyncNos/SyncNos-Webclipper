import { fetchFeishuJson, type FeishuApiError } from '@services/sync/feishu/feishu-api';

function safeString(v: unknown) {
  return String(v == null ? '' : v).trim();
}

export type FeishuDocxConvertContentType = 'markdown' | 'html';

export type FeishuDocxConvertResult = {
  blocks: any[];
  firstLevelBlockIds: string[];
};

export function isFeishuConvertPermissionDenied(error: unknown): boolean {
  const e = error as FeishuApiError & { extra?: any };
  const status = Number((e as any)?.extra?.status || 0) || 0;
  return status === 401 || status === 403;
}

export async function convertContentToBlocks({
  accessToken,
  content,
  contentType,
}: {
  accessToken: string;
  content: string;
  contentType: FeishuDocxConvertContentType;
}): Promise<FeishuDocxConvertResult> {
  const payload = {
    content: String(content || ''),
    content_type: contentType,
  };

  const data: any = await fetchFeishuJson('/docx/v1/documents/blocks/convert', { method: 'POST', body: JSON.stringify(payload) }, { accessToken });

  const blocks = Array.isArray(data?.blocks)
    ? data.blocks
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data?.blocks)
        ? data.data.blocks
        : [];

  const firstLevelBlockIdsRaw: any[] =
    (Array.isArray(data?.first_level_block_ids) ? (data.first_level_block_ids as any[]) : null) ||
    (Array.isArray(data?.firstLevelBlockIds) ? (data.firstLevelBlockIds as any[]) : null) ||
    (Array.isArray(data?.data?.first_level_block_ids) ? (data.data.first_level_block_ids as any[]) : null) ||
    [];

  const firstLevelBlockIds = Array.from(
    new Set(firstLevelBlockIdsRaw.map((id: any) => safeString(id)).filter(Boolean)),
  );

  if (!blocks.length) throw new Error('Feishu Convert API: empty blocks response');
  return { blocks, firstLevelBlockIds };
}
