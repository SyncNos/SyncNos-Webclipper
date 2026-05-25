import { create, clear, isAlarmsAvailable } from '@platform/alarms/alarms';
import { storageGet, storageSet } from '@services/shared/storage';
import { isSyncProviderEnabled } from '@services/sync/sync-provider-gate';
import { getNotionOAuthToken } from '@services/sync/notion/auth/token-store';
import notionSyncJobStore from '@services/sync/notion/notion-sync-job-store';

import type { NotionSyncOrchestrator } from '@services/bootstrap/background-services';
import {
  NOTION_AUTO_SYNC_DEBOUNCE_ALARM_NAME,
  NOTION_AUTO_SYNC_DEBOUNCE_MS,
  NOTION_AUTO_SYNC_ENABLED_STORAGE_KEY,
  NOTION_AUTO_SYNC_QUEUE_MAX_ITEMS,
  NOTION_AUTO_SYNC_QUEUE_STORAGE_KEY,
} from '@services/sync/auto-sync/auto-sync-keys';
import {
  createAutoSyncSchedulerCore,
  type AutoSyncScheduler,
  type AutoSyncSchedulerInfra,
} from '@services/sync/auto-sync/auto-sync-scheduler-core';

async function writePreflightFailureJob(conversationIds: number[], instanceId: string, error: string, now: number) {
  await notionSyncJobStore
    .setJob({
      id: `${now}_autosync_preflight`,
      provider: 'notion',
      instanceId,
      status: 'done',
      startedAt: now,
      updatedAt: now,
      finishedAt: now,
      conversationIds,
      currentConversationId: conversationIds[0] || undefined,
      currentStage: 'preparing_sync',
      okCount: 0,
      failCount: conversationIds.length,
      perConversation: conversationIds.map((conversationId) => ({
        conversationId,
        conversationTitle: '',
        ok: false,
        mode: 'failed',
        appended: 0,
        error,
        warnings: [],
        at: now,
      })),
    })
    .catch(() => {});
}

export type NotionAutoSyncScheduler = AutoSyncScheduler;

export function createNotionAutoSyncScheduler(
  deps: {
    getInstanceId: () => string;
    notionSyncOrchestrator: NotionSyncOrchestrator;
  },
  infraOverrides?: Partial<AutoSyncSchedulerInfra>,
): NotionAutoSyncScheduler {
  const infra: AutoSyncSchedulerInfra = {
    now: () => Date.now(),
    storage: { get: storageGet as any, set: storageSet as any },
    alarms: {
      isAvailable: () => isAlarmsAvailable(),
      create: (name, info) => create(name, info),
      clear: (name) => clear(name),
    },
    ...infraOverrides,
  };

  return createAutoSyncSchedulerCore({
    queueStorageKey: NOTION_AUTO_SYNC_QUEUE_STORAGE_KEY,
    enabledStorageKey: NOTION_AUTO_SYNC_ENABLED_STORAGE_KEY,
    alarmName: NOTION_AUTO_SYNC_DEBOUNCE_ALARM_NAME,
    debounceMs: NOTION_AUTO_SYNC_DEBOUNCE_MS,
    maxItems: NOTION_AUTO_SYNC_QUEUE_MAX_ITEMS,
    infra,
    getInstanceId: deps.getInstanceId,
    isProviderEnabled: () => isSyncProviderEnabled('notion'),
    syncConversations: async (conversationIds, instanceId) => {
      const local = await infra.storage.get(['notion_parent_page_id']).catch(() => ({}) as any);
      const token = await getNotionOAuthToken().catch(() => null);
      const parentPageId = String((local as any)?.notion_parent_page_id || '').trim();
      if (!token || !(token as any).accessToken) throw new Error('notion not connected');
      if (!parentPageId) throw new Error('missing parentPageId');
      await deps.notionSyncOrchestrator.syncConversations({ conversationIds, instanceId } as any);
    },
    onPreflightFailed: async ({ conversationIds, instanceId, error }) => {
      await writePreflightFailureJob(conversationIds, instanceId, error, infra.now());
    },
  });
}
