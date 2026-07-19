export type CaptureCompleteness = 'complete' | 'partial';

export type CaptureMeta = {
  completeness: CaptureCompleteness;
  identityVerified: boolean;
  reasons?: string[];
  metrics?: Record<string, number | boolean>;
};

export type CaptureMessageMergePolicy = 'replace' | 'preserve-existing-markdown' | 'preserve-existing-content';

export type CaptureMessageTransientFields = {
  captureSequencePolicy?: 'preserve-existing-tail';
  captureMergePolicy?: CaptureMessageMergePolicy;
};

export const VIRTUALIZED_MANUAL_CAPTURE_COLLECTOR_IDS = new Set<string>(['chatgpt', 'googleaistudio']);
