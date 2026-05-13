import { fetchFeishuJson } from '@services/sync/feishu/feishu-api';

function safeString(v: unknown) {
  return String(v == null ? '' : v).trim();
}

export function splitFeishuDriveFolderPathSegments(path: unknown): string[] {
  const raw = safeString(path);
  if (!raw) return [];

  const normalizedSlash = raw.replace(/\\/g, '/');
  return normalizedSlash
    .split('/')
    .map((segment) => safeString(segment))
    .filter((segment) => !!segment && segment !== '.' && segment !== '..');
}

function readDriveItemToken(item: any): string {
  return (
    safeString(item?.token) ||
    safeString(item?.folder_token) ||
    safeString(item?.file_token) ||
    safeString(item?.folderToken) ||
    safeString(item?.fileToken)
  );
}

function readDriveItemName(item: any): string {
  return safeString(item?.name) || safeString(item?.title);
}

function readDriveItemType(item: any): string {
  return safeString(item?.type);
}

async function listAllChildFoldersByName({
  accessToken,
  parentFolderToken,
  name,
  fetchJson,
}: {
  accessToken: string;
  parentFolderToken: string;
  name: string;
  fetchJson: typeof fetchFeishuJson;
}): Promise<{ tokens: string[]; hasAmbiguity: boolean }> {
  const target = safeString(name);
  if (!target) return { tokens: [], hasAmbiguity: false };

  const matches: string[] = [];
  let pageToken = '';

  for (let page = 0; page < 80; page += 1) {
    const qs = new URLSearchParams();
    qs.set('folder_token', parentFolderToken);
    qs.set('page_size', '200');
    if (pageToken) qs.set('page_token', pageToken);

    const data: any = await fetchJson(`/drive/v1/files?${qs.toString()}`, { method: 'GET' }, { accessToken });
    const files = Array.isArray(data?.files) ? data.files : Array.isArray(data?.items) ? data.items : [];

    for (const item of files) {
      if (readDriveItemType(item) !== 'folder') continue;
      if (readDriveItemName(item) !== target) continue;
      const token = readDriveItemToken(item);
      if (token) matches.push(token);
    }

    const hasMore = data?.has_more === true || data?.hasMore === true;
    pageToken = safeString(data?.page_token) || safeString(data?.pageToken);
    if (!hasMore || !pageToken) break;
  }

  const unique = Array.from(new Set(matches));
  return { tokens: unique, hasAmbiguity: unique.length > 1 };
}

async function createFolder({
  accessToken,
  parentFolderToken,
  name,
  fetchJson,
}: {
  accessToken: string;
  parentFolderToken: string;
  name: string;
  fetchJson: typeof fetchFeishuJson;
}): Promise<string> {
  const data: any = await fetchJson(
    '/drive/v1/files/create_folder',
    {
      method: 'POST',
      body: JSON.stringify({ folder_token: parentFolderToken, name }),
    },
    { accessToken },
  );

  const token = readDriveItemToken(data?.folder) || readDriveItemToken(data) || readDriveItemToken(data?.data);
  if (!token) throw new Error('Feishu create folder failed: missing folder_token');
  return token;
}

export type ResolveFolderByPathResult = {
  folderToken: string;
  warnings: string[];
};

export async function resolveFeishuDriveFolderTokenByPath({
  accessToken,
  rootFolderToken,
  pathSegments,
  fetchJson = fetchFeishuJson,
}: {
  accessToken: string;
  rootFolderToken: string;
  pathSegments: string[];
  fetchJson?: typeof fetchFeishuJson;
}): Promise<ResolveFolderByPathResult> {
  const segments = Array.isArray(pathSegments) ? pathSegments.map(safeString).filter(Boolean) : [];
  if (!segments.length) return { folderToken: '', warnings: [] };

  let parentToken = safeString(rootFolderToken);
  if (!parentToken) throw new Error('Feishu root folder token missing');

  const warnings: string[] = [];

  for (const name of segments) {
    const { tokens, hasAmbiguity } = await listAllChildFoldersByName({
      accessToken,
      parentFolderToken: parentToken,
      name,
      fetchJson,
    });

    if (tokens.length) {
      if (hasAmbiguity) warnings.push(`multiple folders named "${name}" under parent; using the first match`);
      parentToken = tokens[0];
      continue;
    }

    try {
      parentToken = await createFolder({ accessToken, parentFolderToken: parentToken, name, fetchJson });
    } catch (_e) {
      // Concurrent creation: re-list once (best-effort) before failing.
      const retry = await listAllChildFoldersByName({
        accessToken,
        parentFolderToken: parentToken,
        name,
        fetchJson,
      });
      if (retry.tokens.length) {
        if (retry.hasAmbiguity) warnings.push(`multiple folders named "${name}" under parent; using the first match`);
        parentToken = retry.tokens[0];
        continue;
      }
      throw _e;
    }
  }

  return { folderToken: parentToken, warnings };
}

