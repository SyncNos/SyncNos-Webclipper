import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createElement } from 'react';
import ReactDOM from 'react-dom/client';
import { JSDOM } from 'jsdom';

import {
  DEFAULT_READER_PREFS,
  LEGACY_READING_PROFILE_STORAGE_KEY,
  READER_PREFS_STORAGE_KEY,
} from '../../src/services/protocols/reader-prefs';

const storageState = vi.hoisted(() => ({
  items: {} as Record<string, unknown>,
  storageSetMock: vi.fn(async () => undefined),
  listeners: [] as Array<(changes: any, areaName: string) => void>,
}));

vi.mock('../../src/services/shared/storage', () => ({
  storageGet: vi.fn(async (keys: string[]) => {
    const out: Record<string, unknown> = {};
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(storageState.items, key)) out[key] = storageState.items[key];
    }
    return out;
  }),
  storageSet: (...args: unknown[]) => storageState.storageSetMock(...args),
  storageOnChanged: (listener: (changes: any, areaName: string) => void) => {
    storageState.listeners.push(listener);
    return () => {
      storageState.listeners = storageState.listeners.filter((item) => item !== listener);
    };
  },
}));

import { useReaderPrefs } from '../../src/viewmodels/reader/useReaderPrefs';

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  });

  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: dom.window.localStorage });
  Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
    configurable: true,
    value: true,
  });
}

function cleanupDom() {
  delete (globalThis as any).window;
  delete (globalThis as any).document;
  delete (globalThis as any).navigator;
  delete (globalThis as any).HTMLElement;
  delete (globalThis as any).Node;
  delete (globalThis as any).localStorage;
  delete (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
}

describe('useReaderPrefs', () => {
  let root: ReactDOM.Root | null = null;
  let snapshot: ReturnType<typeof useReaderPrefs> | null = null;

  function Harness() {
    snapshot = useReaderPrefs();
    return createElement('div', null, 'reader-prefs');
  }

  beforeEach(() => {
    setupDom();
    storageState.items = {};
    storageState.storageSetMock.mockClear();
    storageState.listeners = [];
    snapshot = null;
    root = ReactDOM.createRoot(document.getElementById('root')!);
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = null;
    cleanupDom();
  });

  it('hydrates migrated prefs from the legacy reading profile when reader_prefs_v1 is absent', async () => {
    storageState.items = {
      [LEGACY_READING_PROFILE_STORAGE_KEY]: 'book',
    };

    act(() => {
      root!.render(createElement(Harness));
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(snapshot?.prefs).toEqual(DEFAULT_READER_PREFS);
  });

  it('persists updates only to reader_prefs_v1', async () => {
    act(() => {
      root!.render(createElement(Harness));
    });

    await act(async () => {
      await snapshot?.update({ fontSize: 23 });
    });

    expect(storageState.storageSetMock).toHaveBeenCalledTimes(1);
    const patch = storageState.storageSetMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(Object.keys(patch)).toEqual([READER_PREFS_STORAGE_KEY]);
    expect((patch[READER_PREFS_STORAGE_KEY] as { fontSize: number }).fontSize).toBe(23);
    expect(Object.prototype.hasOwnProperty.call(patch, LEGACY_READING_PROFILE_STORAGE_KEY)).toBe(false);
  });
});
