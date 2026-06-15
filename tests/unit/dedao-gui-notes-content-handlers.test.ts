import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

let dom: JSDOM | null = null;

function installDom(url: string) {
  dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url,
    pretendToBeVisual: true,
  });

  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'location', { configurable: true, value: dom.window.location });
  Object.defineProperty(globalThis, 'MessageEvent', { configurable: true, value: dom.window.MessageEvent });
}

type RuntimeListener = (msg: any, sender: any, sendResponse: (value: any) => void) => unknown;

describe('dedao gui notes content handlers', () => {
  let listener: RuntimeListener | null = null;

  beforeEach(() => {
    vi.resetModules();
    listener = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error cleanup
    delete globalThis.window;
    // @ts-expect-error cleanup
    delete globalThis.document;
    // @ts-expect-error cleanup
    delete globalThis.location;
    // @ts-expect-error cleanup
    delete globalThis.chrome;
    dom = null;
  });

  async function register(url: string) {
    installDom(url);
    // @ts-expect-error test global
    globalThis.chrome = {
      runtime: {
        onMessage: {
          addListener(fn: RuntimeListener) {
            listener = fn;
          },
          removeListener() {},
        },
      },
    };

    const mod = await import('../../src/services/bootstrap/dedao-gui-notes-content-handlers');
    mod.registerDedaoGuiNotesContentHandlers();
    expect(listener).toBeTruthy();
  }

  it('forwards malformed and timeout responses from main-world bridge', async () => {
    await register('https://www.dedao.cn/course/article?id=1');

    const postMessage = vi.spyOn(window, 'postMessage').mockImplementation((message: any) => {
      const req = message as any;
      if (req?.type === 'SYNCNOS_DEDAO_GUI_NOTES_REQUEST' && req?.requestId) {
        setTimeout(() => {
          window.dispatchEvent(
            new window.MessageEvent('message', {
              source: window,
              data: {
                __syncnos: true,
                type: 'SYNCNOS_DEDAO_GUI_NOTES_RESPONSE',
                requestId: req.requestId,
                ok: false,
                status: 'malformed_payload',
                notes: [],
                error: {
                  code: 'malformed_payload',
                  message: 'bad payload',
                  recoverable: true,
                },
              },
            }),
          );
        }, 0);
      }
    });

    const malformed = await new Promise<any>((resolve) => {
      listener!(
        { type: 'extractDedaoGuiNotes', payload: { timeoutMs: 300 } },
        {},
        (response) => resolve(response),
      );
    });

    expect(malformed).toMatchObject({
      ok: true,
      data: {
        status: 'malformed_payload',
        ok: false,
      },
    });

    postMessage.mockImplementation(() => {});
    const timeout = await new Promise<any>((resolve) => {
      listener!(
        { type: 'extractDedaoGuiNotes', payload: { timeoutMs: 200 } },
        {},
        (response) => resolve(response),
      );
    });

    expect(timeout).toMatchObject({
      ok: true,
      data: {
        status: 'timeout',
        ok: false,
      },
    });
  });

  it('returns a non-dedao envelope without touching main-world bridge', async () => {
    await register('https://example.com/post');
    const postMessage = vi.spyOn(window, 'postMessage');

    const response = await new Promise<any>((resolve) => {
      listener!(
        { type: 'extractDedaoGuiNotes', payload: { timeoutMs: 300 } },
        {},
        (value) => resolve(value),
      );
    });

    expect(postMessage).not.toHaveBeenCalled();
    expect(response).toMatchObject({
      ok: true,
      data: {
        status: 'error',
        ok: false,
        error: { message: 'not a dedao article page' },
      },
    });
  });
});
