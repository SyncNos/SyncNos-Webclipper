export type ReaderPerformanceStats = {
  updatedAt: number;
  sourceLength: number;
  sentenceCount: number;
  decoratePasses: number;
  decorateMode: 'idle' | 'sync' | 'progressive';
  decorateLastDurationMs: number;
  decorateTotalDurationMs: number;
  decorateBatches: number;
  decorateLastBatchDurationMs: number;
  decorateMaxBatchDurationMs: number;
  observerMutationCount: number;
  observerSyncCount: number;
  observerSourceChangeCount: number;
  observerRedecorateCount: number;
  outlineEntries: number;
  outlineRebuildCount: number;
  outlineActiveRecalcCount: number;
};

export const DEFAULT_READER_PERFORMANCE_STATS: ReaderPerformanceStats = {
  updatedAt: 0,
  sourceLength: 0,
  sentenceCount: 0,
  decoratePasses: 0,
  decorateMode: 'idle',
  decorateLastDurationMs: 0,
  decorateTotalDurationMs: 0,
  decorateBatches: 0,
  decorateLastBatchDurationMs: 0,
  decorateMaxBatchDurationMs: 0,
  observerMutationCount: 0,
  observerSyncCount: 0,
  observerSourceChangeCount: 0,
  observerRedecorateCount: 0,
  outlineEntries: 0,
  outlineRebuildCount: 0,
  outlineActiveRecalcCount: 0,
};

function now(): number {
  try {
    const value = globalThis.performance?.now?.();
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  } catch {
    // ignore
  }
  return Date.now();
}

/**
 * Privacy-safe reader performance snapshot for runtime diagnosis.
 *
 * Exposed as `globalThis.__syncnosReaderPerformance`; only aggregate counters
 * and durations are published. Never store article text, URLs, or API keys.
 */
export function publishReaderPerformanceStats(
  patch: Partial<ReaderPerformanceStats> | ((current: ReaderPerformanceStats) => ReaderPerformanceStats),
): ReaderPerformanceStats {
  const scope = globalThis as Record<string, unknown>;
  const current =
    ((scope.__syncnosReaderPerformance as ReaderPerformanceStats | undefined) ?? DEFAULT_READER_PERFORMANCE_STATS);
  const next = typeof patch === 'function' ? patch(current) : { ...current, ...patch };
  next.updatedAt = Date.now();
  scope.__syncnosReaderPerformance = next;
  return next;
}

export function readReaderPerformanceClock(): number {
  return now();
}
