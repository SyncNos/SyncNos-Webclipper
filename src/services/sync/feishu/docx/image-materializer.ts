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
