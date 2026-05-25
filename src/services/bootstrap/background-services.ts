import articleFetchService from '@collectors/web/article-fetch-service.ts';

import notionSyncJobStore from '@services/sync/notion/notion-sync-job-store.ts';
import { createNotionSyncOrchestrator } from '@services/sync/notion/notion-sync-orchestrator.ts';
import { getNotionOAuthToken } from '@services/sync/notion/auth/token-store';
import { backgroundStorage as notionBackgroundStorage } from '@services/conversations/background/storage';
import notionDbManager from '@services/sync/notion/notion-db-manager.ts';
import notionSyncService from '@services/sync/notion/notion-sync-service.ts';
import notionApi from '@services/sync/notion/notion-api.ts';
import notionFilesApi from '@services/sync/notion/notion-files-api.ts';

import {
  clearSyncStatus as clearObsidianSyncStatus,
  getSyncStatus as getObsidianSyncStatus,
  syncConversations as obsidianSyncConversations,
  testConnection as testObsidianConnection,
} from '@services/sync/obsidian/obsidian-sync-orchestrator.ts';

import {
  clearSyncStatus as clearFeishuSyncStatus,
  getSyncStatus as getFeishuSyncStatus,
  syncConversations as feishuSyncConversations,
} from '@services/sync/feishu/feishu-sync-orchestrator.ts';

import { conversationKinds } from '@services/protocols/conversation-kinds.ts';
import { createNotionAutoSyncScheduler, type NotionAutoSyncScheduler } from '@services/sync/auto-sync/notion-auto-sync-scheduler';
import { NOTION_AUTO_SYNC_DEBOUNCE_ALARM_NAME } from '@services/sync/auto-sync/auto-sync-keys';

export type NotionSyncOrchestrator = {
  syncConversations: (input: { conversationIds?: unknown[]; instanceId: string }) => Promise<unknown>;
  getSyncJobStatus: (input: { instanceId: string }) => Promise<unknown>;
  clearSyncJobStatus: (input: { instanceId: string }) => Promise<unknown>;
};

export type ObsidianSyncOrchestrator = {
  syncConversations: (input: {
    conversationIds?: unknown[];
    forceFullConversationIds?: unknown[];
    instanceId: string;
  }) => Promise<unknown>;
  getSyncStatus: (input: { instanceId: string }) => Promise<unknown>;
  clearSyncStatus: (input: { instanceId: string }) => Promise<unknown>;
  testConnection: (input: { instanceId: string }) => Promise<unknown>;
};

export type FeishuSyncOrchestrator = {
  syncConversations: (input: { conversationIds?: unknown[]; instanceId: string }) => Promise<unknown>;
  getSyncStatus: (input: { instanceId: string }) => Promise<unknown>;
  clearSyncStatus: (input: { instanceId: string }) => Promise<unknown>;
};

export type BackgroundServices = {
  articleFetchService: typeof articleFetchService;
  conversationKinds: typeof conversationKinds;
  notionSyncJobStore: typeof notionSyncJobStore;
  notionSyncOrchestrator: NotionSyncOrchestrator;
  obsidianSyncOrchestrator: ObsidianSyncOrchestrator;
  feishuSyncOrchestrator: FeishuSyncOrchestrator;
  autoSync: {
    notionScheduler: NotionAutoSyncScheduler;
    onConversationChanged: (conversationId: number, reason: string) => Promise<void>;
    handleAlarm: (name: string) => Promise<void>;
  };
};

export function createBackgroundServices(deps: { getInstanceId: () => string }): BackgroundServices {
  const notionSyncOrchestrator = createNotionSyncOrchestrator({
    tokenStore: { getToken: getNotionOAuthToken },
    storage: notionBackgroundStorage,
    conversationKinds,
    notionApi,
    notionFilesApi,
    dbManager: notionDbManager,
    syncService: notionSyncService,
    jobStore: notionSyncJobStore,
  });

  const notionScheduler = createNotionAutoSyncScheduler({
    getInstanceId: deps.getInstanceId,
    notionSyncOrchestrator,
  });

  return {
    articleFetchService,
    conversationKinds,
    notionSyncJobStore,
    notionSyncOrchestrator,
    autoSync: {
      notionScheduler,
      onConversationChanged: async (conversationId: number, reason: string) => {
        await notionScheduler.enqueue(conversationId, reason);
      },
      handleAlarm: async (name: string) => {
        if (String(name || '').trim() !== NOTION_AUTO_SYNC_DEBOUNCE_ALARM_NAME) return;
        await notionScheduler.flush();
      },
    },
    obsidianSyncOrchestrator: {
      syncConversations: obsidianSyncConversations,
      getSyncStatus: async (input: { instanceId: string }) => getObsidianSyncStatus(input as any),
      clearSyncStatus: async (input: { instanceId: string }) => clearObsidianSyncStatus(input as any),
      testConnection: testObsidianConnection,
    },
    feishuSyncOrchestrator: {
      syncConversations: feishuSyncConversations,
      getSyncStatus: async (input: { instanceId: string }) => getFeishuSyncStatus(input as any),
      clearSyncStatus: async (input: { instanceId: string }) => clearFeishuSyncStatus(input as any),
    },
  };
}
