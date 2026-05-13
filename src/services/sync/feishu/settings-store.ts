import { storageGet, storageSet } from '@services/shared/storage';
import { conversationKinds } from '@services/protocols/conversation-kinds.ts';

export const FEISHU_DEFAULT_SYNC_FOLDER_PATH_KEY = 'feishu_default_sync_folder_path';

export const FEISHU_DEFAULT_SYNC_FOLDER_PATH_DEFAULT = 'SyncNos/WebClipper';

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
  const raw = res?.[FEISHU_DEFAULT_SYNC_FOLDER_PATH_KEY];
  if (raw == null) return FEISHU_DEFAULT_SYNC_FOLDER_PATH_DEFAULT;
  return normalizeFeishuDefaultSyncFolderPath(raw);
}

export async function setFeishuDefaultSyncFolderPath(next: unknown): Promise<string> {
  const normalized = normalizeFeishuDefaultSyncFolderPath(next);
  await storageSet({ [FEISHU_DEFAULT_SYNC_FOLDER_PATH_KEY]: normalized });
  return normalized;
}

export function pickFeishuKindSubfolderName(conversation: any): string {
  try {
    const kind = conversationKinds && typeof conversationKinds.pick === 'function' ? conversationKinds.pick(conversation) : null;
    const folder = kind && (kind as any).obsidian && (kind as any).obsidian.folder ? String((kind as any).obsidian.folder || '').trim() : '';
    return folder;
  } catch (_e) {
    return '';
  }
}
