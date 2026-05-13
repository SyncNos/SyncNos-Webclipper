import { storageGet, storageSet } from '@services/shared/storage';

export const FEISHU_DEFAULT_SYNC_FOLDER_PATH_KEY = 'feishu_default_sync_folder_path';

export function normalizeFeishuDefaultSyncFolderPath(input: unknown): string {
  const raw = String(input || '').trim();
  if (!raw) return '';

  const normalizedSlash = raw.replace(/\\/g, '/');
  const segments = normalizedSlash
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => !!segment && segment !== '.' && segment !== '..');

  return segments.length ? segments.join('/') : '';
}

export async function getFeishuDefaultSyncFolderPath(): Promise<string> {
  const res = await storageGet([FEISHU_DEFAULT_SYNC_FOLDER_PATH_KEY]);
  return normalizeFeishuDefaultSyncFolderPath(res?.[FEISHU_DEFAULT_SYNC_FOLDER_PATH_KEY]);
}

export async function setFeishuDefaultSyncFolderPath(next: unknown): Promise<string> {
  const normalized = normalizeFeishuDefaultSyncFolderPath(next);
  await storageSet({ [FEISHU_DEFAULT_SYNC_FOLDER_PATH_KEY]: normalized });
  return normalized;
}

