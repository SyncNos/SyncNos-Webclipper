import { FEISHU_MESSAGE_TYPES } from '@platform/messaging/message-contracts';
import { storageRemove } from '@platform/storage/local';
import feishuSyncJobStore from '@services/sync/feishu/feishu-sync-job-store.ts';
import { clearFeishuOAuthToken, getFeishuOAuthToken } from '@services/sync/feishu/auth/token-store';

type AnyRouter = {
  ok: (data: unknown) => any;
  err: (message: string, extra?: unknown) => any;
  register: (type: string, handler: (msg: any) => Promise<any> | any) => void;
};

function getFeishuDisconnectStorageKeys(): string[] {
  const base = ['feishu_oauth_pending_state', 'feishu_oauth_last_error'];
  const syncJobKey = feishuSyncJobStore.FEISHU_SYNC_JOB_KEY ? String(feishuSyncJobStore.FEISHU_SYNC_JOB_KEY) : '';
  return Array.from(new Set([...base, ...(syncJobKey ? [syncJobKey] : [])]));
}

export function registerFeishuSettingsHandlers(router: AnyRouter) {
  router.register(FEISHU_MESSAGE_TYPES.GET_AUTH_STATUS, async () => {
    const token = await getFeishuOAuthToken();
    return router.ok({
      connected: !!(token && token.accessToken),
      token: token || null,
    });
  });

  router.register(FEISHU_MESSAGE_TYPES.DISCONNECT, async () => {
    await clearFeishuOAuthToken();
    const clearedKeys = getFeishuDisconnectStorageKeys();
    await storageRemove(clearedKeys);
    await feishuSyncJobStore.setJob(null).catch(() => {});
    return router.ok({ disconnected: true, clearedKeys });
  });
}
