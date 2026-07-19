export type ScrollMetrics = {
  top: number;
  left: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
};

export type ScrollRestoreResult = {
  restored: boolean;
  reason: 'restored' | 'missing_identity' | 'identity_changed' | 'root_detached' | 'root_replaced' | 'restore_failed';
};

type ScrollRuntime = {
  document: Document;
  window: Window & typeof globalThis;
  getSeed: () => Element | null;
  sampleIdentity: () => string | null;
};

type ScrollRootSnapshot = {
  root: Element;
  isDocumentRoot: boolean;
  identity: string;
  metrics: ScrollMetrics;
};

function finite(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function documentScrollRoot(document: Document): Element {
  return document.scrollingElement || document.documentElement;
}

function isDocumentScrollRoot(document: Document, root: Element): boolean {
  return root === document.scrollingElement || root === document.documentElement || root === document.body;
}

function permitsVerticalScroll(window: Window & typeof globalThis, element: Element): boolean {
  try {
    const style = window.getComputedStyle(element);
    const overflowY = String(style?.overflowY || style?.overflow || '').toLowerCase();
    return overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
  } catch (_error) {
    return false;
  }
}

export function resolveScrollRoot(runtime: Pick<ScrollRuntime, 'document' | 'window'>, seed: Element | null): Element {
  let current: Element | null = seed;
  while (current) {
    if (
      permitsVerticalScroll(runtime.window, current) &&
      finite((current as HTMLElement).scrollHeight) > finite((current as HTMLElement).clientHeight)
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return documentScrollRoot(runtime.document);
}

export function readScrollMetrics(runtime: Pick<ScrollRuntime, 'document' | 'window'>, root: Element): ScrollMetrics {
  const isDocument = isDocumentScrollRoot(runtime.document, root);
  const element = root as HTMLElement;
  return {
    top: isDocument ? finite(runtime.window.scrollY, finite(element.scrollTop)) : finite(element.scrollTop),
    left: isDocument ? finite(runtime.window.scrollX, finite(element.scrollLeft)) : finite(element.scrollLeft),
    scrollHeight: finite(element.scrollHeight),
    scrollWidth: finite(element.scrollWidth),
    clientHeight: finite(element.clientHeight),
    clientWidth: finite(element.clientWidth),
  };
}

export function writeScrollPosition(
  runtime: Pick<ScrollRuntime, 'document' | 'window'>,
  root: Element,
  left: number,
  top: number,
): void {
  const metrics = readScrollMetrics(runtime, root);
  const nextLeft = clamp(finite(left), 0, metrics.scrollWidth - metrics.clientWidth);
  const nextTop = clamp(finite(top), 0, metrics.scrollHeight - metrics.clientHeight);
  if (isDocumentScrollRoot(runtime.document, root)) {
    runtime.window.scrollTo(nextLeft, nextTop);
    return;
  }
  const element = root as HTMLElement;
  element.scrollLeft = nextLeft;
  element.scrollTop = nextTop;
}

export function isAtScrollTop(metrics: ScrollMetrics): boolean {
  return metrics.top <= 1;
}

export function isAtScrollBottom(metrics: ScrollMetrics): boolean {
  return metrics.top + metrics.clientHeight >= metrics.scrollHeight - 1;
}

export function createScrollRootRestorer(runtime: ScrollRuntime): { restore: () => ScrollRestoreResult } {
  const identity = String(runtime.sampleIdentity() || '').trim();
  const root = resolveScrollRoot(runtime, runtime.getSeed());
  const snapshot: ScrollRootSnapshot = {
    root,
    isDocumentRoot: isDocumentScrollRoot(runtime.document, root),
    identity,
    metrics: readScrollMetrics(runtime, root),
  };
  let restored = false;

  return {
    restore(): ScrollRestoreResult {
      if (restored) return { restored: false, reason: 'restore_failed' };
      restored = true;
      if (!snapshot.identity) return { restored: false, reason: 'missing_identity' };
      if (String(runtime.sampleIdentity() || '').trim() !== snapshot.identity) {
        return { restored: false, reason: 'identity_changed' };
      }
      if (!snapshot.isDocumentRoot && !snapshot.root.isConnected) {
        return { restored: false, reason: 'root_detached' };
      }
      const currentRoot = resolveScrollRoot(runtime, runtime.getSeed());
      if (currentRoot !== snapshot.root) return { restored: false, reason: 'root_replaced' };
      try {
        writeScrollPosition(runtime, snapshot.root, snapshot.metrics.left, snapshot.metrics.top);
        return { restored: true, reason: 'restored' };
      } catch (_error) {
        return { restored: false, reason: 'restore_failed' };
      }
    },
  };
}

export type PreparedMessageRecord<T> = {
  key: string;
  turnKey: string;
  withinTurn: number;
  fingerprint: string;
  payload: T;
  firstSeenIndex: number;
};

export type PreparedIdentityGuard = {
  route: string;
  durableId: string;
  anchors: string[];
  topAnchor: string;
};

export type PreparedAccumulator<T> = {
  source: string;
  conversationKey: string;
  identityVerified: boolean;
  identityGuard: PreparedIdentityGuard;
  records: PreparedMessageRecord<T>[];
  reasons: string[];
  samples: number;
};

export type VirtualizedPreparedCapture<T> = {
  kind: 'syncnos.virtualized-chat.prepared.v1';
  source: string;
  conversationKey: string;
  identityVerified: boolean;
  identityGuard: PreparedIdentityGuard;
  records: PreparedMessageRecord<T>[];
  reasons: string[];
  metrics: { samples: number; messages: number };
};

export function createPreparedAccumulator<T>(input: {
  source: string;
  conversationKey: string;
  identityVerified: boolean;
  identityGuard?: Partial<PreparedIdentityGuard>;
}): PreparedAccumulator<T> {
  return {
    source: String(input.source || '').trim(),
    conversationKey: String(input.conversationKey || '').trim(),
    identityVerified: input.identityVerified === true,
    identityGuard: {
      route: String(input.identityGuard?.route || ''),
      durableId: String(input.identityGuard?.durableId || ''),
      anchors: Array.isArray(input.identityGuard?.anchors)
        ? input.identityGuard.anchors.map((value) => String(value || '').trim()).filter(Boolean)
        : [],
      topAnchor: String(input.identityGuard?.topAnchor || ''),
    },
    records: [],
    reasons: [],
    samples: 0,
  };
}

export function addPreparedReason<T>(accumulator: PreparedAccumulator<T>, reason: string): void {
  const normalized = String(reason || '').trim();
  if (normalized && !accumulator.reasons.includes(normalized)) accumulator.reasons.push(normalized);
}

export function mergePreparedRecords<T>(
  accumulator: PreparedAccumulator<T>,
  records: Array<Omit<PreparedMessageRecord<T>, 'firstSeenIndex'>>,
): { added: number; updated: number } {
  accumulator.samples += 1;
  const incoming = records
    .map((record) => ({ ...record, key: String(record?.key || '').trim() }))
    .filter((record) => !!record.key);
  if (!incoming.length) return { added: 0, updated: 0 };

  const uniqueIncoming: typeof incoming = [];
  const incomingKeys = new Set<string>();
  for (const record of incoming) {
    if (incomingKeys.has(record.key)) continue;
    incomingKeys.add(record.key);
    uniqueIncoming.push(record);
  }

  let updated = 0;
  const existingByKey = new Map(accumulator.records.map((record) => [record.key, record]));
  for (const record of uniqueIncoming) {
    const existing = existingByKey.get(record.key);
    if (!existing || existing.fingerprint === record.fingerprint) continue;
    existing.turnKey = record.turnKey;
    existing.withinTurn = record.withinTurn;
    existing.fingerprint = record.fingerprint;
    existing.payload = record.payload;
    updated += 1;
  }

  if (!accumulator.records.length) {
    for (const record of uniqueIncoming) {
      accumulator.records.push({ ...record, firstSeenIndex: accumulator.records.length });
    }
    return { added: uniqueIncoming.length, updated };
  }

  const knownIncoming = uniqueIncoming.filter((record) => existingByKey.has(record.key));
  if (!knownIncoming.length) {
    addPreparedReason(accumulator, 'order_unanchored');
    let added = 0;
    for (const record of uniqueIncoming) {
      if (existingByKey.has(record.key)) continue;
      const prepared = { ...record, firstSeenIndex: accumulator.records.length };
      accumulator.records.push(prepared);
      existingByKey.set(record.key, prepared);
      added += 1;
    }
    return { added, updated };
  }

  const currentPositions = new Map(accumulator.records.map((record, index) => [record.key, index]));
  const knownPositions = knownIncoming.map((record) => currentPositions.get(record.key) as number);
  if (knownPositions.some((position, index) => index > 0 && position <= knownPositions[index - 1])) {
    addPreparedReason(accumulator, 'order_conflict');
    return { added: 0, updated };
  }

  let added = 0;
  let cursor = 0;
  while (cursor < uniqueIncoming.length) {
    if (existingByKey.has(uniqueIncoming[cursor].key)) {
      cursor += 1;
      continue;
    }
    const start = cursor;
    while (cursor < uniqueIncoming.length && !existingByKey.has(uniqueIncoming[cursor].key)) cursor += 1;
    const unknownRun = uniqueIncoming.slice(start, cursor);
    const previousKnown = start > 0 ? uniqueIncoming[start - 1].key : '';
    const nextKnown = cursor < uniqueIncoming.length ? uniqueIncoming[cursor].key : '';

    let insertionIndex = accumulator.records.length;
    if (nextKnown) {
      insertionIndex = accumulator.records.findIndex((record) => record.key === nextKnown);
    } else if (previousKnown) {
      const previousIndex = accumulator.records.findIndex((record) => record.key === previousKnown);
      insertionIndex = previousIndex < 0 ? accumulator.records.length : previousIndex + 1;
    }

    const preparedRun = unknownRun.map((record) => ({
      ...record,
      firstSeenIndex: accumulator.records.length + added,
    }));
    accumulator.records.splice(insertionIndex, 0, ...preparedRun);
    for (const prepared of preparedRun) existingByKey.set(prepared.key, prepared);
    added += preparedRun.length;
  }

  return { added, updated };
}

export function finishPreparedCapture<T>(accumulator: PreparedAccumulator<T>): VirtualizedPreparedCapture<T> {
  return {
    kind: 'syncnos.virtualized-chat.prepared.v1',
    source: accumulator.source,
    conversationKey: accumulator.conversationKey,
    identityVerified: accumulator.identityVerified,
    identityGuard: {
      ...accumulator.identityGuard,
      anchors: accumulator.identityGuard.anchors.slice(),
    },
    records: accumulator.records.map((record) => ({ ...record })),
    reasons: accumulator.reasons.slice(),
    metrics: { samples: accumulator.samples, messages: accumulator.records.length },
  };
}

export function readPreparedCapture<T>(value: unknown, source: string): VirtualizedPreparedCapture<T> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const token = value as Partial<VirtualizedPreparedCapture<T>>;
  if (token.kind !== 'syncnos.virtualized-chat.prepared.v1') return null;
  if (token.source !== source || !Array.isArray(token.records) || !token.identityGuard) return null;
  return token as VirtualizedPreparedCapture<T>;
}
