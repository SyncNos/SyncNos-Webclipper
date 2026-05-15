import { downloadImageSmart } from '@platform/webext/image-download-proxy';
import { fetchFeishuJson } from '@services/sync/feishu/feishu-api';

const FEISHU_OPEN_API_BASE = 'https://open.feishu.cn/open-apis';
export const FEISHU_DOCX_IMAGE_MAX_BYTES = 20 * 1024 * 1024; // 20MB (upload_all limit)

function safeString(v: unknown) {
  return String(v == null ? '' : v).trim();
}

export function guessFileNameFromUrl(url: string, fallbackExt = 'png') {
  try {
    const u = new URL(url);
    const name = u.pathname.split('/').pop() || '';
    const normalized = safeString(name);
    if (normalized && normalized.length <= 128) return normalized;
  } catch (_e) {
    // ignore
  }
  return `image.${fallbackExt}`;
}

export type MarkdownImageToken = {
  alt: string;
  url: string;
};

export function parseMarkdownImages(markdown: string): MarkdownImageToken[] {
  const text = String(markdown || '');
  if (!text) return [];

  const out: MarkdownImageToken[] = [];
  const re = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)/g;
  let m: RegExpExecArray | null = null;
  while ((m = re.exec(text))) {
    const alt = safeString(m[1]);
    const url = safeString(m[2]);
    if (!url) continue;
    out.push({ alt, url });
  }
  return out;
}

function splitMarkdownByImages(markdown: string) {
  const text = String(markdown || '');
  const parts: Array<{ type: 'text'; value: string } | { type: 'image'; alt: string; url: string }> = [];

  const re = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)/g;
  let cursor = 0;
  let m: RegExpExecArray | null = null;
  while ((m = re.exec(text))) {
    const idx = Number(m.index) || 0;
    const before = text.slice(cursor, idx);
    if (before) parts.push({ type: 'text', value: before });

    const alt = safeString(m[1]);
    const url = safeString(m[2]);
    if (url) parts.push({ type: 'image', alt, url });

    cursor = idx + m[0].length;
  }

  const tail = text.slice(cursor);
  if (tail) parts.push({ type: 'text', value: tail });
  return parts;
}

export async function uploadImageToFeishu({
  accessToken,
  imageBlockId,
  fileName,
  blob,
}: {
  accessToken: string;
  imageBlockId: string;
  fileName: string;
  blob: Blob;
}): Promise<string> {
  type UploadAllError = Error & { status?: number };

  const uploadOnce = async (parentType: 'docx_image' | 'doc_image'): Promise<string> => {
    const form = new FormData();
    form.append('file_name', fileName);
    form.append('parent_type', parentType);
    form.append('parent_node', imageBlockId);
    form.append('size', String(blob.size || 0));
    form.append('file', blob, fileName);

    const res = await fetch(`${FEISHU_OPEN_API_BASE}/drive/v1/medias/upload_all`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      body: form,
    });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      const err = new Error(
        `Feishu upload_all failed (parent_type=${parentType}): HTTP ${res.status} ${text}`,
      ) as UploadAllError;
      err.status = Number(res.status) || 0;
      throw err;
    }

    const json = text ? JSON.parse(text) : null;
    if (json && typeof json === 'object' && Number((json as any).code) === 0) {
      const token = safeString((json as any)?.data?.file_token);
      if (!token) throw new Error('Feishu upload_all failed: missing file_token');
      return token;
    }
    const token = safeString(json?.data?.file_token);
    if (!token) throw new Error('Feishu upload_all failed: invalid response');
    return token;
  };

  try {
    return await uploadOnce('docx_image');
  } catch (e) {
    const status = Number((e as UploadAllError)?.status || 0) || 0;
    const msg = String((e as any)?.message || '').toLowerCase();
    const shouldFallback =
      status === 400 ||
      status === 401 ||
      status === 403 ||
      msg.includes('parent_type') ||
      msg.includes('docx_image') ||
      msg.includes('doc_image');
    if (!shouldFallback) throw e;

    try {
      return await uploadOnce('doc_image');
    } catch (e2) {
      throw new Error(
        `${String((e as any)?.message || 'Feishu upload_all failed')}; fallback doc_image failed: ${String((e2 as any)?.message || '')}`,
      );
    }
  }
}

export async function bindImageBlockWithFileToken({
  accessToken,
  docId,
  imageBlockId,
  fileToken,
}: {
  accessToken: string;
  docId: string;
  imageBlockId: string;
  fileToken: string;
}): Promise<void> {
  await fetchFeishuJson<any>(
    `/docx/v1/documents/${encodeURIComponent(docId)}/blocks/${encodeURIComponent(imageBlockId)}`,
    { method: 'PATCH', body: JSON.stringify({ replace_image: { token: fileToken } }) },
    { accessToken },
  );
}

async function createEmptyImageBlock({ accessToken, docId }: { accessToken: string; docId: string }): Promise<string> {
  const data = await fetchFeishuJson<any>(
    `/docx/v1/documents/${encodeURIComponent(docId)}/blocks/${encodeURIComponent(docId)}/children`,
    { method: 'POST', body: JSON.stringify({ children: [{ block_type: 27, image: {} }], index: -1 }) },
    { accessToken },
  );

  const created =
    (Array.isArray((data as any)?.children) ? (data as any).children : null) ||
    (Array.isArray((data as any)?.items) ? (data as any).items : null) ||
    [];
  const id =
    safeString(created?.[0]?.block_id) ||
    safeString(created?.[0]?.blockId) ||
    safeString(created?.[0]?.block?.block_id) ||
    safeString(created?.[0]?.block?.blockId);
  if (!id) throw new Error('Feishu create image block failed: missing block_id');
  return id;
}

async function appendTextAsBlock({
  accessToken,
  docId,
  text,
}: {
  accessToken: string;
  docId: string;
  text: string;
}): Promise<number> {
  const content = String(text || '');
  if (!content) return 0;
  const maxChunk = 8000;
  const chunks: string[] = [];
  for (let cursor = 0; cursor < content.length; cursor += maxChunk) {
    chunks.push(content.slice(cursor, Math.min(content.length, cursor + maxChunk)));
  }
  if (!chunks.length) return 0;

  const blocks = chunks.map((c) => ({ block_type: 2, text: { elements: [{ text_run: { content: c } }] } }));

  const batchSize = 20;
  for (let i = 0; i < blocks.length; i += batchSize) {
    const slice = blocks.slice(i, i + batchSize);
    await fetchFeishuJson<any>(
      `/docx/v1/documents/${encodeURIComponent(docId)}/blocks/${encodeURIComponent(docId)}/children`,
      {
        method: 'POST',
        body: JSON.stringify({ children: slice, index: -1 }),
      },
      { accessToken },
    );
    await new Promise((r) => setTimeout(r, 350));
  }

  return blocks.length;
}

export type MaterializeImagesResult = {
  appendedBlocks: number;
  imageCount: number;
  uploadedCount: number;
  fallbackUrlCount: number;
  warnings: string[];
};

export async function materializeMarkdownImagesIntoDocx({
  accessToken,
  docId,
  markdown,
}: {
  accessToken: string;
  docId: string;
  markdown: string;
}): Promise<MaterializeImagesResult> {
  const parts = splitMarkdownByImages(markdown);
  const warnings: string[] = [];

  let appendedBlocks = 0;
  let imageCount = 0;
  let uploadedCount = 0;
  let fallbackUrlCount = 0;

  for (const part of parts) {
    if (part.type === 'text') {
      appendedBlocks += await appendTextAsBlock({ accessToken, docId, text: part.value });
      continue;
    }

    imageCount += 1;
    const url = safeString(part.url);
    if (!url) continue;

    const dl = await downloadImageSmart({ url, maxBytes: FEISHU_DOCX_IMAGE_MAX_BYTES }).catch(() => ({
      ok: false as const,
      reason: 'fetch' as const,
    }));
    if (!dl.ok) {
      fallbackUrlCount += 1;
      warnings.push(`image download failed (${dl.reason}): ${url}`);
      appendedBlocks += await appendTextAsBlock({ accessToken, docId, text: url });
      continue;
    }

    if ((dl.blob.size || 0) > FEISHU_DOCX_IMAGE_MAX_BYTES) {
      fallbackUrlCount += 1;
      warnings.push(`image too large (>20MB): ${url}`);
      appendedBlocks += await appendTextAsBlock({ accessToken, docId, text: url });
      continue;
    }

    const fileName = guessFileNameFromUrl(url, (dl.contentType.split('/')[1] || 'png').replace(/[^a-z0-9]/gi, ''));

    try {
      const imageBlockId = await createEmptyImageBlock({ accessToken, docId });
      appendedBlocks += 1;
      await new Promise((r) => setTimeout(r, 350));

      const fileToken = await uploadImageToFeishu({ accessToken, imageBlockId, fileName, blob: dl.blob });
      await bindImageBlockWithFileToken({ accessToken, docId, imageBlockId, fileToken });
      uploadedCount += 1;
    } catch {
      fallbackUrlCount += 1;
      warnings.push(`image upload failed: ${url}`);
      appendedBlocks += await appendTextAsBlock({ accessToken, docId, text: url });
    }

    await new Promise((r) => setTimeout(r, 350));
  }

  return { appendedBlocks, imageCount, uploadedCount, fallbackUrlCount, warnings };
}
