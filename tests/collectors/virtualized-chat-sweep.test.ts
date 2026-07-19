import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import {
  createPreparedAccumulator,
  createScrollRootRestorer,
  finishPreparedCapture,
  mergePreparedRecords,
  isAtScrollBottom,
  isAtScrollTop,
  readScrollMetrics,
  resolveScrollRoot,
  writeScrollPosition,
} from '../../src/collectors/virtualized-chat/virtualized-chat-sweep.ts';

function setMetric(element: Element, name: string, value: number) {
  Object.defineProperty(element, name, { configurable: true, value, writable: true });
}

function makeNestedRoot() {
  const dom = new JSDOM('<body><div id="scroll"><main id="seed"></main></div></body>');
  const root = dom.window.document.querySelector('#scroll') as HTMLElement;
  const seed = dom.window.document.querySelector('#seed') as HTMLElement;
  root.style.overflowY = 'auto';
  setMetric(root, 'clientHeight', 100);
  setMetric(root, 'scrollHeight', 500);
  setMetric(root, 'clientWidth', 80);
  setMetric(root, 'scrollWidth', 300);
  root.scrollTop = 120;
  root.scrollLeft = 40;
  return { dom, root, seed };
}

describe('virtualized chat scroll root', () => {
  it('resolves and restores a nested overflow root on both axes', () => {
    const { dom, root, seed } = makeNestedRoot();
    const runtime = { document: dom.window.document, window: dom.window as any };
    expect(resolveScrollRoot(runtime, seed)).toBe(root);
    const restorer = createScrollRootRestorer({ ...runtime, getSeed: () => seed, sampleIdentity: () => 'chat-a' });
    root.scrollTop = 350;
    root.scrollLeft = 200;
    expect(restorer.restore()).toEqual({ restored: true, reason: 'restored' });
    expect(root.scrollTop).toBe(120);
    expect(root.scrollLeft).toBe(40);
  });

  it('clamps restore after the scroll extent shrinks', () => {
    const { dom, root, seed } = makeNestedRoot();
    const runtime = { document: dom.window.document, window: dom.window as any };
    root.scrollTop = 380;
    const restorer = createScrollRootRestorer({ ...runtime, getSeed: () => seed, sampleIdentity: () => 'chat-a' });
    setMetric(root, 'scrollHeight', 180);
    root.scrollTop = 0;
    expect(restorer.restore().restored).toBe(true);
    expect(root.scrollTop).toBe(80);
  });

  it('skips restore for detached, replaced, or identity-changed roots', () => {
    const first = makeNestedRoot();
    const runtime = { document: first.dom.window.document, window: first.dom.window as any };
    let identity = 'chat-a';
    const restorer = createScrollRootRestorer({
      ...runtime,
      getSeed: () => first.seed,
      sampleIdentity: () => identity,
    });
    identity = 'chat-b';
    expect(restorer.restore()).toEqual({ restored: false, reason: 'identity_changed' });

    const second = makeNestedRoot();
    const detached = createScrollRootRestorer({
      document: second.dom.window.document,
      window: second.dom.window as any,
      getSeed: () => second.seed,
      sampleIdentity: () => 'chat-a',
    });
    second.root.remove();
    expect(detached.restore()).toEqual({ restored: false, reason: 'root_detached' });
  });

  it('uses the document scroller fallback without moving an inner element', () => {
    const dom = new JSDOM('<body><main id="seed"></main></body>');
    const root = dom.window.document.documentElement;
    const seed = dom.window.document.querySelector('#seed') as HTMLElement;
    setMetric(root, 'clientHeight', 100);
    setMetric(root, 'scrollHeight', 500);
    setMetric(root, 'clientWidth', 100);
    setMetric(root, 'scrollWidth', 100);
    const scrollTo = vi.fn();
    (dom.window as any).scrollTo = scrollTo;
    const runtime = { document: dom.window.document, window: dom.window as any };
    writeScrollPosition(runtime, root, 0, 999);
    expect(scrollTo).toHaveBeenCalledWith(0, 400);
  });

  it('reports top and bottom from normalized metrics', () => {
    const { dom, root } = makeNestedRoot();
    const metrics = readScrollMetrics({ document: dom.window.document, window: dom.window as any }, root);
    expect(isAtScrollTop({ ...metrics, top: 0 })).toBe(true);
    expect(isAtScrollBottom({ ...metrics, top: 400 })).toBe(true);
  });

  it('turns restore exceptions into a content-free result', () => {
    const dom = new JSDOM('<body><main id="seed"></main></body>');
    const seed = dom.window.document.querySelector('#seed') as HTMLElement;
    const root = dom.window.document.documentElement;
    setMetric(root, 'clientHeight', 100);
    setMetric(root, 'scrollHeight', 500);
    setMetric(root, 'clientWidth', 100);
    setMetric(root, 'scrollWidth', 100);
    (dom.window as any).scrollTo = () => {
      throw new Error('sentinel secret');
    };
    const restorer = createScrollRootRestorer({
      document: dom.window.document,
      window: dom.window as any,
      getSeed: () => seed,
      sampleIdentity: () => 'chat-a',
    });
    expect(restorer.restore()).toEqual({ restored: false, reason: 'restore_failed' });
  });
});

describe('virtualized chat prepared accumulator', () => {
  it('returns a plain prepared token and updates changed records in place', () => {
    const accumulator = createPreparedAccumulator<{ text: string }>({
      source: 'chatgpt',
      conversationKey: 'conversation-a',
      identityVerified: true,
    });
    expect(
      mergePreparedRecords(accumulator, [
        { key: 'm1', turnKey: 't1', withinTurn: 0, fingerprint: 'a', payload: { text: 'first' } },
      ]),
    ).toEqual({ added: 1, updated: 0 });
    expect(
      mergePreparedRecords(accumulator, [
        { key: 'm1', turnKey: 't1', withinTurn: 0, fingerprint: 'b', payload: { text: 'final' } },
      ]),
    ).toEqual({ added: 0, updated: 1 });
    const prepared = finishPreparedCapture(accumulator);
    expect(JSON.parse(JSON.stringify(prepared))).toEqual(prepared);
    expect(prepared.records[0]).toMatchObject({ firstSeenIndex: 0, payload: { text: 'final' } });
  });

  it('keeps concurrent prepared accumulators isolated', () => {
    const first = createPreparedAccumulator<{ text: string }>({
      source: 'chatgpt',
      conversationKey: 'conversation-a',
      identityVerified: true,
    });
    const second = createPreparedAccumulator<{ text: string }>({
      source: 'chatgpt',
      conversationKey: 'conversation-b',
      identityVerified: true,
    });
    mergePreparedRecords(first, [{ key: 'a', turnKey: 'ta', withinTurn: 0, fingerprint: 'a', payload: { text: 'A' } }]);
    mergePreparedRecords(second, [
      { key: 'b', turnKey: 'tb', withinTurn: 0, fingerprint: 'b', payload: { text: 'B' } },
    ]);
    expect(finishPreparedCapture(first).records.map((record) => record.key)).toEqual(['a']);
    expect(finishPreparedCapture(second).records.map((record) => record.key)).toEqual(['b']);
  });
});
