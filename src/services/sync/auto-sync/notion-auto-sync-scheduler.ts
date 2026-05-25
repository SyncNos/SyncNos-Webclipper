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

type QueueMap = Record<string, number>;

function normalizeQueue(value: unknown): QueueMap {
  if (!value || typeof value !== 'object') return {};
  const out: QueueMap = {};
  for (const [key, rawDueAt] of Object.entries(value as Record<string, unknown>)) {
    const conversationId = Number(key);
    if (!Number.isFinite(conversationId) || conversationId <= 0) continue;
    const dueAt = Number(rawDueAt);
    if (!Number.isFinite(dueAt) || dueAt <= 0) continue;
    out[String(conversationId)] = Math.floor(dueAt);
  }
  return out;
}

function trimQueue(queue: QueueMap, maxItems: number): QueueMap {
  const entries = Object.entries(queue);
  const max = Number.isFinite(Number(maxItems)) ? Math.max(1, Math.floor(Number(maxItems))) : 200;
  if (entries.length <= max) return queue;
  entries.sort((a, b) => a[1] - b[1]);
  const kept = entries.slice(0, max);
  const out: QueueMap = {};
  for (const [id, dueAt] of kept) out[id] = dueAt;
  return out;
}

function pickEarliestDueAt(queue: QueueMap): number | null {
  let earliest: number | null = null;
  for (const dueAt of Object.values(queue)) {
    const value = Number(dueAt);
    if (!Number.isFinite(value) || value <= 0) continue;
    if (earliest == null || value < earliest) earliest = value;
  }
  return earliest;
}

function normalizeIds(ids: string[]) {
  return Array.from(
    new Set(ids.map((x) => Number(x)).filter((x) => Number.isFinite(x) && x > 0).map((x) => Math.floor(x))),
  );
}

function isAlreadyRunningError(error: unknown): boolean {
  const code = String((error as any)?.code || '').trim();
  if (code === 'sync_already_running') return true;
  const message = error instanceof Error ? error.message : String(error || '').trim();
  return message.toLowerCase().includes('sync already in progress');
}

async function readQueue(): Promise<QueueMap> {
  const res = await storageGet([NOTION_AUTO_SYNC_QUEUE_STORAGE_KEY]).catch(() => ({}));
  return normalizeQueue((res as any)?.[NOTION_AUTO_SYNC_QUEUE_STORAGE_KEY]);
}

async function writeQueue(queue: QueueMap): Promise<void> {
  await storageSet({ [NOTION_AUTO_SYNC_QUEUE_STORAGE_KEY]: queue }).catch(() => {});
}

async function scheduleNextAlarm(queue: QueueMap): Promise<void> {
  const earliestDueAt = pickEarliestDueAt(queue);
  if (earliestDueAt == null) {
    if (isAlarmsAvailable()) await clear(NOTION_AUTO_SYNC_DEBOUNCE_ALARM_NAME);
    return;
  }
  if (!isAlarmsAvailable()) return;
  create(NOTION_AUTO_SYNC_DEBOUNCE_ALARM_NAME, { when: earliestDueAt });
}

async function writePreflightFailureJob(conversationIds: number[], instanceId: string, error: string) {
  const now = Date.now();
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

export type NotionAutoSyncScheduler = {
  enqueue: (conversationId: number, reason: string) => Promise<void>;
  flush: () => Promise<void>;
};

export function createNotionAutoSyncScheduler(deps: {
  getInstanceId: () => string;
  notionSyncOrchestrator: NotionSyncOrchestrator;
}): NotionAutoSyncScheduler {
  const { getInstanceId, notionSyncOrchestrator } = deps;

  const enqueue = async (conversationId: number, _reason: string) => {
    const id = Number(conversationId);
    if (!Number.isFinite(id) || id <= 0) return;

    const local = await storageGet([NOTION_AUTO_SYNC_ENABLED_STORAGE_KEY]).catch(() => ({}));
    const autoSyncEnabled = (local as any)?.[NOTION_AUTO_SYNC_ENABLED_STORAGE_KEY] === true;
    if (!autoSyncEnabled) return;
    const providerEnabled = await isSyncProviderEnabled('notion').catch(() => false);
    if (!providerEnabled) return;

    const now = Date.now();
    const nextDueAt = now + NOTION_AUTO_SYNC_DEBOUNCE_MS;

    const queue = await readQueue();
    const key = String(Math.floor(id));
    const prevDueAt = Number(queue[key]);
    if (Number.isFinite(prevDueAt) && prevDueAt >= nextDueAt) {
      await scheduleNextAlarm(queue);
      return;
    }

    const nextQueue = trimQueue({ ...queue, [key]: nextDueAt }, NOTION_AUTO_SYNC_QUEUE_MAX_ITEMS);
    await writeQueue(nextQueue);
    await scheduleNextAlarm(nextQueue);
  };

  const flush = async () => {
    const now = Date.now();
    const instanceId = getInstanceId();
    const queue = await readQueue();

    const dueKeys = Object.keys(queue).filter((key) => Number(queue[key]) <= now);
    const dueConversationIds = normalizeIds(dueKeys);
    if (!dueConversationIds.length) {
      await scheduleNextAlarm(queue);
      return;
    }

    const local = await storageGet([NOTION_AUTO_SYNC_ENABLED_STORAGE_KEY, 'notion_parent_page_id']).catch(() => ({}));
    const autoSyncEnabled = (local as any)?.[NOTION_AUTO_SYNC_ENABLED_STORAGE_KEY] === true;
    const providerEnabled = await isSyncProviderEnabled('notion').catch(() => false);
    const token = await getNotionOAuthToken().catch(() => null);
    const parentPageId = String((local as any)?.notion_parent_page_id || '').trim();

    const preflightError = !providerEnabled
      ? 'sync provider disabled'
      : !autoSyncEnabled
        ? 'notion auto sync disabled'
        : !token || !token.accessToken
          ? 'notion not connected'
          : !parentPageId
            ? 'missing parentPageId'
            : '';

    const restQueue: QueueMap = { ...queue };
    for (const key of dueKeys) delete restQueue[key];

    if (preflightError) {
      await writePreflightFailureJob(dueConversationIds, instanceId, preflightError);
      await writeQueue(restQueue);
      await scheduleNextAlarm(restQueue);
      return;
    }

    try {
      await notionSyncOrchestrator.syncConversations({ conversationIds: dueConversationIds, instanceId });
      await writeQueue(restQueue);
      await scheduleNextAlarm(restQueue);
    } catch (error) {
      if (isAlreadyRunningError(error)) {
        const delayedQueue: QueueMap = { ...queue };
        const delayedDueAt = now + NOTION_AUTO_SYNC_DEBOUNCE_MS;
        for (const conversationId of dueConversationIds) delayedQueue[String(conversationId)] = delayedDueAt;
        const trimmed = trimQueue(delayedQueue, NOTION_AUTO_SYNC_QUEUE_MAX_ITEMS);
        await writeQueue(trimmed);
        await scheduleNextAlarm(trimmed);
        return;
      }

      await writeQueue(restQueue);
      await scheduleNextAlarm(restQueue);
    }
  };

  return { enqueue, flush };
}
