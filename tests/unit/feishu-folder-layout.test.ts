import { describe, expect, it } from 'vitest';

import { FEISHU_DEFAULT_SYNC_FOLDER_PATH_DEFAULT, pickFeishuKindSubfolderName } from '@services/sync/feishu/settings-store';

describe('Feishu folder layout', () => {
  it('uses SyncNos/WebClipper as the default base folder path', () => {
    expect(FEISHU_DEFAULT_SYNC_FOLDER_PATH_DEFAULT).toBe('SyncNos/WebClipper');
  });

  it('maps conversation sourceType to kind subfolder names (aligned with Obsidian)', () => {
    expect(pickFeishuKindSubfolderName({ sourceType: 'chat' })).toBe('SyncNos-AIChats');
    expect(pickFeishuKindSubfolderName({ sourceType: 'article' })).toBe('SyncNos-WebArticles');
    expect(pickFeishuKindSubfolderName({ sourceType: 'video' })).toBe('SyncNos-Videos');
  });
});

