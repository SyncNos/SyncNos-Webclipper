import { describe, expect, it, vi } from 'vitest';

import { resolveFeishuDriveFolderTokenByPath } from '@services/sync/feishu/drive-folder-path';
import { normalizeFeishuFolderPath } from '@services/sync/feishu/settings-store';

describe('Feishu folder path normalize', () => {
  it('normalizes slashes and segments', () => {
    expect(normalizeFeishuFolderPath('')).toBe('');
    expect(normalizeFeishuFolderPath('  SyncNos / WebClipper  ')).toBe('SyncNos/WebClipper');
    expect(normalizeFeishuFolderPath('\\SyncNos\\WebClipper\\')).toBe('SyncNos/WebClipper');
    expect(normalizeFeishuFolderPath('/./SyncNos//WebClipper/../X')).toBe('SyncNos/WebClipper/X');
  });
});

describe('Feishu drive folder resolve by path', () => {
  it('returns existing folder token when found', async () => {
    const fetchJson = vi.fn(async (path: string) => {
      if (path.startsWith('/drive/v1/files?')) {
        return { files: [{ type: 'folder', name: 'SyncNos', token: 'fld_syncnos' }], has_more: false };
      }
      throw new Error(`unexpected call: ${path}`);
    });

    const res = await resolveFeishuDriveFolderTokenByPath({
      accessToken: 't',
      rootFolderToken: 'root',
      pathSegments: ['SyncNos'],
      fetchJson: fetchJson as any,
    });

    expect(res.folderToken).toBe('fld_syncnos');
    expect(res.warnings).toEqual([]);
    expect(fetchJson).toHaveBeenCalledTimes(1);
  });

  it('creates missing folders and returns the leaf token', async () => {
    const fetchJson = vi.fn(async (path: string, init?: RequestInit) => {
      if (path.startsWith('/drive/v1/files?')) {
        const qs = new URLSearchParams(path.split('?')[1] || '');
        const folderToken = qs.get('folder_token') || '';
        if (folderToken === 'root') {
          return { files: [], has_more: false };
        }
        if (folderToken === 'fld_syncnos') {
          return { files: [], has_more: false };
        }
        return { files: [], has_more: false };
      }

      if (path === '/drive/v1/files/create_folder') {
        const body = init?.body ? JSON.parse(String(init.body)) : {};
        if (body.folder_token === 'root' && body.name === 'SyncNos') return { folder: { folder_token: 'fld_syncnos' } };
        if (body.folder_token === 'fld_syncnos' && body.name === 'WebClipper')
          return { folder: { token: 'fld_webclipper' } };
        throw new Error('unexpected create payload');
      }

      throw new Error(`unexpected call: ${path}`);
    });

    const res = await resolveFeishuDriveFolderTokenByPath({
      accessToken: 't',
      rootFolderToken: 'root',
      pathSegments: ['SyncNos', 'WebClipper'],
      fetchJson: fetchJson as any,
    });

    expect(res.folderToken).toBe('fld_webclipper');
    expect(res.warnings).toEqual([]);
  });

  it('warns on ambiguous folder name and uses first match', async () => {
    const fetchJson = vi.fn(async (path: string) => {
      if (path.startsWith('/drive/v1/files?')) {
        return {
          files: [
            { type: 'folder', name: 'SyncNos', token: 'a' },
            { type: 'folder', name: 'SyncNos', token: 'b' },
          ],
          has_more: false,
        };
      }
      throw new Error(`unexpected call: ${path}`);
    });

    const res = await resolveFeishuDriveFolderTokenByPath({
      accessToken: 't',
      rootFolderToken: 'root',
      pathSegments: ['SyncNos'],
      fetchJson: fetchJson as any,
    });

    expect(res.folderToken).toBe('a');
    expect(res.warnings.join(' ')).toContain('multiple folders named "SyncNos"');
  });

  it('re-lists once when create folder fails (concurrent creation)', async () => {
    let listCount = 0;
    const fetchJson = vi.fn(async (path: string) => {
      if (path.startsWith('/drive/v1/files?')) {
        listCount += 1;
        if (listCount === 1) return { files: [], has_more: false };
        return { files: [{ type: 'folder', name: 'SyncNos', token: 'fld_syncnos' }], has_more: false };
      }
      if (path === '/drive/v1/files/create_folder') {
        throw new Error('already exists');
      }
      throw new Error(`unexpected call: ${path}`);
    });

    const res = await resolveFeishuDriveFolderTokenByPath({
      accessToken: 't',
      rootFolderToken: 'root',
      pathSegments: ['SyncNos'],
      fetchJson: fetchJson as any,
    });

    expect(res.folderToken).toBe('fld_syncnos');
    expect(fetchJson).toHaveBeenCalled();
  });
});
