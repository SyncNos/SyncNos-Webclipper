import {
  SYNC_JOB_STORAGE_KEYS,
  type ReconcileRunningSyncJobOptions,
  abortRunningSyncJobIfFromOtherInstance,
  getSyncJob,
  isRunningSyncJob,
  setSyncJob,
} from '@services/sync/sync-job-store.ts';

export const FEISHU_SYNC_JOB_KEY = SYNC_JOB_STORAGE_KEYS.feishu;

export async function getJob() {
  return getSyncJob('feishu');
}

export async function setJob(job: any) {
  return setSyncJob('feishu', job);
}

export function isRunningJob(job: any, staleMs?: number) {
  return isRunningSyncJob(job, staleMs);
}

export async function abortRunningJobIfFromOtherInstance(
  instanceId: string,
  options?: number | ReconcileRunningSyncJobOptions,
) {
  return abortRunningSyncJobIfFromOtherInstance('feishu', instanceId, options);
}

const api = {
  FEISHU_SYNC_JOB_KEY,
  getJob,
  setJob,
  isRunningJob,
  abortRunningJobIfFromOtherInstance,
};

export default api;
