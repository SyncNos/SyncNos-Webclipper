import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';

let dom: JSDOM | null = null;

function markVisible(el: Element | null, rect?: Partial<DOMRect>) {
  if (!el) return;
  const base = { width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40 };
  const merged = { ...base, ...(rect || {}) };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (el as any).getBoundingClientRect = () => merged;
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();

  dom = new JSDOM(
    `<!doctype html>
     <html>
       <body>
         <div id="other" tabindex="0">other</div>
         <div role="button" data-testid="unified-chat-model-button" aria-expanded="true">自动</div>

         <div id="sidebar">
           <div role="menu" id="sidebar-menu">
             <div role="menuitem" id="sb-1">自动</div>
             <div role="menuitem" id="sb-2">GPT-5.4</div>
             <div role="menuitem" id="sb-3">Kimi K2.6</div>
           </div>
         </div>

         <div id="popup">
           <div role="dialog" aria-modal="true" id="popup-dialog">
             <div role="menu" id="popup-menu">
               <div role="menuitem" id="pm-1">自动</div>
               <div role="menuitem" id="pm-2">GPT-5.4</div>
               <div role="menuitem" id="pm-3">Kimi K2.6</div>
             </div>
           </div>
         </div>
       </body>
     </html>`,
    {
      url: 'https://www.notion.so/',
      pretendToBeVisual: true,
    },
  );

  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, 'location', { configurable: true, value: dom.window.location });
  Object.defineProperty(globalThis, 'HTMLElement', { configurable: true, value: dom.window.HTMLElement });
  Object.defineProperty(globalThis, 'Node', { configurable: true, value: dom.window.Node });
  Object.defineProperty(globalThis, 'MouseEvent', { configurable: true, value: dom.window.MouseEvent });
  Object.defineProperty(globalThis, 'Event', { configurable: true, value: dom.window.Event });
});

afterEach(() => {
  dom = null;
  // @ts-expect-error cleanup
  delete (globalThis as any).window;
  // @ts-expect-error cleanup
  delete (globalThis as any).document;
  // @ts-expect-error cleanup
  delete (globalThis as any).location;
});

describe('notionai model picker', () => {
  it('selects from the popup menu (aria-modal dialog), not other menus on the page', async () => {
    const clicked: string[] = [];

    const modelBtn = document.querySelector('div[role="button"][data-testid="unified-chat-model-button"]');
    const sidebarMenu = document.querySelector('#sidebar-menu');
    const popupDialog = document.querySelector('#popup-dialog');
    const popupMenu = document.querySelector('#popup-menu');
    const other = document.querySelector('#other') as HTMLElement | null;

    markVisible(modelBtn);
    markVisible(sidebarMenu, { top: 200, bottom: 260 });
    markVisible(popupDialog, { top: 10, bottom: 200 });
    markVisible(popupMenu, { top: 20, bottom: 180 });

    for (const el of Array.from(document.querySelectorAll('[role="menuitem"]'))) {
      el.addEventListener('click', () => clicked.push(String(el.id)));
    }

    other?.focus();

    vi.doMock('@platform/storage/local', () => ({
      storageGet: vi.fn(async () => ({ notion_ai_preferred_model_index: 3 })),
    }));

    const picker = await import('../../src/services/integrations/notionai-auto-picker/notionai-model-picker');
    await picker.maybeApply();

    expect(clicked).toContain('pm-3');
    expect(clicked).not.toContain('sb-3');
  });

  it('treats model index 1 as disabled (no clicks)', async () => {
    const clicked: string[] = [];

    const modelBtn = document.querySelector('div[role="button"][data-testid="unified-chat-model-button"]');
    const popupDialog = document.querySelector('#popup-dialog');
    const popupMenu = document.querySelector('#popup-menu');

    // Make it "collapsed" to ensure it would otherwise click to open.
    modelBtn?.setAttribute('aria-expanded', 'false');

    markVisible(modelBtn);
    markVisible(popupDialog, { top: 10, bottom: 200 });
    markVisible(popupMenu, { top: 20, bottom: 180 });

    modelBtn?.addEventListener('click', () => clicked.push('model-button'));
    for (const el of Array.from(document.querySelectorAll('[role="menuitem"]'))) {
      el.addEventListener('click', () => clicked.push(String(el.id)));
    }

    vi.doMock('@platform/storage/local', () => ({
      storageGet: vi.fn(async () => ({ notion_ai_preferred_model_index: 1 })),
    }));

    const picker = await import('../../src/services/integrations/notionai-auto-picker/notionai-model-picker');
    await picker.maybeApply();

    expect(clicked).toEqual([]);
  });
});
