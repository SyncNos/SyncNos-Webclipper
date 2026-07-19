import { describe, expect, it } from 'vitest';

import {
  VIRTUALIZED_MANUAL_CAPTURE_COLLECTOR_IDS,
  type CaptureMessageMergePolicy,
  type CaptureMeta,
} from '@services/shared/capture-integrity';
import { AI_CHAT_AUTO_SAVE_COLLECTOR_IDS, SUPPORTED_AI_CHAT_SITES } from '@collectors/ai-chat-sites';

describe('capture integrity contract', () => {
  it('keeps virtualized providers manual-only from one source', () => {
    expect(Array.from(VIRTUALIZED_MANUAL_CAPTURE_COLLECTOR_IDS)).toEqual(['chatgpt', 'googleaistudio']);

    const supportedIds = new Set(SUPPORTED_AI_CHAT_SITES.map((site) => site.id));
    for (const id of VIRTUALIZED_MANUAL_CAPTURE_COLLECTOR_IDS) {
      expect(supportedIds.has(id)).toBe(true);
      expect(AI_CHAT_AUTO_SAVE_COLLECTOR_IDS.has(id)).toBe(false);
    }

    expect(AI_CHAT_AUTO_SAVE_COLLECTOR_IDS.has('gemini')).toBe(true);
    expect(AI_CHAT_AUTO_SAVE_COLLECTOR_IDS.has('claude')).toBe(true);
  });

  it('keeps capture metadata and merge policies content-free and transient', () => {
    const meta: CaptureMeta = {
      completeness: 'partial',
      identityVerified: true,
      reasons: ['virtual_sweep_incomplete'],
      metrics: { passes: 2, reachedTop: true },
    };
    const mergePolicy: CaptureMessageMergePolicy = 'preserve-existing-markdown';

    expect(meta.metrics).toEqual({ passes: 2, reachedTop: true });
    expect(mergePolicy).toBe('preserve-existing-markdown');
  });
});
