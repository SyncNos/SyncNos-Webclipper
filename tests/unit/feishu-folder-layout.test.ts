import { describe, expect, it } from 'vitest';

import {
  FEISHU_DEFAULTS,
  pickFeishuFolderPathForConversation,
  type FeishuPathConfig,
} from '@services/sync/feishu/settings-store';

describe('Feishu folder layout', () => {
  it('defaults to root-level SyncNos-* folders (aligned with Obsidian)', () => {
    expect(FEISHU_DEFAULTS.chatFolder).toBe('SyncNos-AIChats');
    expect(FEISHU_DEFAULTS.articleFolder).toBe('SyncNos-WebArticles');
    expect(FEISHU_DEFAULTS.videoFolder).toBe('SyncNos-Videos');
  });

  it('picks folder path by conversation kind', () => {
    const config: FeishuPathConfig = {
      chatFolder: FEISHU_DEFAULTS.chatFolder,
      articleFolder: FEISHU_DEFAULTS.articleFolder,
      videoFolder: FEISHU_DEFAULTS.videoFolder,
      defaults: { ...FEISHU_DEFAULTS },
    };

    expect(pickFeishuFolderPathForConversation({ sourceType: 'chat' }, config)).toBe('SyncNos-AIChats');
    expect(pickFeishuFolderPathForConversation({ sourceType: 'article' }, config)).toBe('SyncNos-WebArticles');
    expect(pickFeishuFolderPathForConversation({ sourceType: 'video' }, config)).toBe('SyncNos-Videos');
  });
});
