import type { CollectorDefinition } from '@collectors/collector-contract.ts';
import type { CollectorEnv } from '@collectors/collector-env.ts';
import {
  appendImageMarkdown,
  conversationKeyFromLocation,
  extractImageUrlsFromElement,
  inEditMode as inEditModeUtil,
} from '@collectors/collector-utils.ts';
import geminiMarkdown from '@collectors/gemini/gemini-markdown.ts';
import { createScrollRootRestorer } from '@collectors/virtualized-chat/virtualized-chat-sweep.ts';

function sleep(ms: any): any {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
}

function normalizeRoleFromTurn(turn: Element): 'user' | 'assistant' | null {
  const container = turn.querySelector('.chat-turn-container');
  if (container && (container as any).classList) {
    const cls = (container as any).classList;
    if (cls.contains('user')) return 'user';
    if (cls.contains('model')) return 'assistant';
  }
  const marker = turn.querySelector('[data-turn-role]');
  const roleText =
    marker && (marker as any).getAttribute ? String((marker as any).getAttribute('data-turn-role') || '') : '';
  if (/user/i.test(roleText)) return 'user';
  if (/model|assistant/i.test(roleText)) return 'assistant';
  return null;
}

function pickTurnContent(turn: Element, role: 'user' | 'assistant'): Element | null {
  const roleSelector =
    role === 'user' ? '[data-turn-role="User"] .turn-content' : '[data-turn-role="Model"] .turn-content';
  const scoped = turn.querySelector(roleSelector);
  if (scoped) return scoped as any;
  const anyContent = turn.querySelector('.turn-content');
  return (anyContent as any) || null;
}

export function createGoogleAiStudioCollectorDef(env: CollectorEnv): CollectorDefinition {
  function matches(loc: any): any {
    const hostname = loc && loc.hostname ? loc.hostname : env.location.hostname;
    return /(^|\.)aistudio\.google\.com$/.test(hostname) || /(^|\.)makersuite\.google\.com$/.test(hostname);
  }

  function isValidConversationUrl(): any {
    try {
      const p = env.location.pathname || '';
      if (!p || p === '/') return false;
      return true;
    } catch (_e) {
      return false;
    }
  }

  function findConversationKey(): any {
    return conversationKeyFromLocation(env.location);
  }

  function getConversationRoot(): any {
    return (
      env.document.querySelector('.chat-session-content') || env.document.querySelector('main') || env.document.body
    );
  }

  type LegacyPreparedCapture = {
    kind: 'syncnos.googleaistudio.prepared.v1';
    source: 'googleaistudio';
    conversationKey: string;
    identityGuard: { route: string; anchors: string[] };
    messages: any[];
    warningFlags: string[];
  };

  function stableTurnAnchors(root = getConversationRoot()): string[] {
    if (!root || typeof root.querySelectorAll !== 'function') return [];
    return Array.from(root.querySelectorAll('ms-chat-turn[id]'))
      .map((turn: any) => String(turn?.getAttribute?.('id') || '').trim())
      .filter(Boolean);
  }

  function sampleIdentityGuard() {
    return {
      route: String(env.location.pathname || ''),
      anchors: stableTurnAnchors(),
    };
  }

  function identityGuardsMatch(
    expected: { route: string; anchors: string[] },
    actual = sampleIdentityGuard(),
  ): boolean {
    if (!expected?.route || expected.route !== actual.route) return false;
    const current = new Set(actual.anchors);
    return expected.anchors.some((anchor) => current.has(anchor));
  }

  function sampleRestoreIdentity(): string | null {
    const route = String(env.location.pathname || '');
    const key = String(findConversationKey() || '').trim();
    return route && key ? `${route}|${key}` : null;
  }

  function inEditMode(root: any): any {
    return inEditModeUtil(root);
  }

  function messageKeyFromTurn(turn: Element, role: any, contentText: any, sequence: any): any {
    const id = (turn as any).getAttribute ? String((turn as any).getAttribute('id') || '').trim() : '';
    if (id) return `${id}:${role}`;
    return env.normalize.makeFallbackMessageKey({ role, contentText, sequence });
  }

  function normalizeTitle(value: any): any {
    const text = value == null ? '' : String(value);
    return env.normalize.normalizeText(text);
  }

  function extractConversationTitle(): any {
    const selectors = [
      "[data-test-id='conversation-title']",
      '.conversation-title-container .conversation-title-column [class*="gds-title"]',
      '.conversation-title-container .conversation-title-column',
    ];
    for (const selector of selectors) {
      const el = env.document.querySelector(selector);
      if (!el) continue;
      const title = normalizeTitle((el as any).textContent || (el as any).innerText || '');
      if (title) return title;
    }
    const pageTitle = normalizeTitle(env.document.title || '');
    return pageTitle || 'Google AI Studio';
  }

  function extractAssistantMarkdown(node: any, fallbackText: any): any {
    if (typeof geminiMarkdown.extractAssistantMarkdown === 'function') {
      const markdown = geminiMarkdown.extractAssistantMarkdown(node);
      if (markdown) return markdown;
    }
    return fallbackText || '';
  }

  function extractAssistantText(node: any): any {
    if (typeof geminiMarkdown.extractAssistantText === 'function') {
      const text = geminiMarkdown.extractAssistantText(node);
      if (text) return text;
    }
    const raw = node ? node.innerText || node.textContent || '' : '';
    return env.normalize.normalizeText(raw);
  }

  type InlineImageContext = {
    blobUrlCache: Map<string, { dataUrl: string; bytes: number }>;
    inlinedCount: number;
    inlinedBytes: number;
    warningFlags: Set<string>;
  };

  function createInlineImageContext(): InlineImageContext {
    return {
      blobUrlCache: new Map(),
      inlinedCount: 0,
      inlinedBytes: 0,
      warningFlags: new Set(),
    };
  }

  function isBlobUrl(url: unknown): boolean {
    const text = String(url || '').trim();
    return /^blob:/i.test(text);
  }

  function pickBlobUrlFromImg(img: any): string {
    if (!img) return '';
    const current = img.currentSrc ? String(img.currentSrc).trim() : '';
    if (isBlobUrl(current)) return current;
    const src = img.src ? String(img.src).trim() : img.getAttribute ? String(img.getAttribute('src') || '').trim() : '';
    if (isBlobUrl(src)) return src;
    const srcset = img.getAttribute ? String(img.getAttribute('srcset') || '').trim() : '';
    if (srcset) {
      const items = srcset
        .split(',')
        .map((s: any) => String(s || '').trim())
        .filter(Boolean);
      for (const item of items) {
        const url = item.split(/\s+/)[0] ? String(item.split(/\s+/)[0]).trim() : '';
        if (isBlobUrl(url)) return url;
      }
    }
    return '';
  }

  function extractBlobImageUrlsFromElement(element: ParentNode | null): string[] {
    if (!element || typeof (element as any).querySelectorAll !== 'function') return [];
    const images = Array.from((element as any).querySelectorAll('img'));
    const seen = new Set<string>();
    const output: string[] = [];
    for (const image of images) {
      const url = pickBlobUrlFromImg(image);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      output.push(url);
    }
    return output;
  }

  async function blobToDataUrl(blob: any): Promise<string> {
    const FileReaderCtor: any = (env.window as any)?.FileReader || (globalThis as any).FileReader;
    if (!FileReaderCtor) throw new Error('FileReader not available');
    return await new Promise((resolve, reject) => {
      try {
        const reader = new FileReaderCtor();
        reader.onerror = () => reject(reader.error || new Error('FileReader error'));
        reader.onload = () => resolve(String(reader.result || ''));
        reader.readAsDataURL(blob);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function inlineBlobImageUrl(blobUrl: string, ctx: InlineImageContext): Promise<string | null> {
    const cached = ctx.blobUrlCache.get(blobUrl);
    if (cached && cached.dataUrl) return cached.dataUrl;

    const fetchFn: any = (env.window as any)?.fetch || (globalThis as any).fetch;
    if (typeof fetchFn !== 'function') {
      ctx.warningFlags.add('inline_images_fetch_unavailable');
      return null;
    }

    try {
      const response = await fetchFn(blobUrl);
      if (!response || response.ok === false) {
        ctx.warningFlags.add('inline_images_fetch_failed');
        return null;
      }

      const blob = await response.blob();
      const size = Number(blob?.size || 0);
      const type = String(blob?.type || '');
      if (!type || !/^image\//i.test(type)) {
        ctx.warningFlags.add('inline_images_non_image_blob');
        return null;
      }
      if (size <= 0) {
        ctx.warningFlags.add('inline_images_empty_blob');
        return null;
      }

      const dataUrl = await blobToDataUrl(blob);
      if (!dataUrl || !/^data:image\//i.test(dataUrl)) {
        ctx.warningFlags.add('inline_images_encode_failed');
        return null;
      }

      ctx.blobUrlCache.set(blobUrl, { dataUrl, bytes: size });
      ctx.inlinedCount += 1;
      ctx.inlinedBytes += size;
      return dataUrl;
    } catch (_e) {
      ctx.warningFlags.add('inline_images_fetch_failed');
      return null;
    }
  }

  async function extractImageUrlsIncludingBlobImages(
    element: ParentNode | null,
    ctx: InlineImageContext,
  ): Promise<string[]> {
    const httpUrls = extractImageUrlsFromElement(element);
    const blobUrls = extractBlobImageUrlsFromElement(element);
    if (!blobUrls.length) return httpUrls;

    const dataUrls: string[] = [];
    for (const blobUrl of blobUrls) {
      const dataUrl = await inlineBlobImageUrl(blobUrl, ctx);
      if (dataUrl) dataUrls.push(dataUrl);
    }

    const merged = httpUrls.concat(dataUrls);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const url of merged) {
      const t = String(url || '').trim();
      if (!t || seen.has(t)) continue;
      seen.add(t);
      out.push(t);
    }
    return out;
  }

  function stripThinkingFromNode(node: Element | null): Element | null {
    if (!node || typeof (node as any).cloneNode !== 'function') return node;
    const cloned = (node as any).cloneNode(true) as Element;
    const selectors = ['ms-thought-chunk', '.thought-panel', 'img[alt="Thinking"]', '.thinking-progress-icon'];
    for (const selector of selectors) {
      try {
        const list = Array.from((cloned as any).querySelectorAll?.(selector) || []);
        for (const el of list) {
          try {
            (el as any).remove?.();
          } catch (_e) {
            // ignore
          }
        }
      } catch (_e) {
        // ignore
      }
    }
    return cloned;
  }

  function stripTurnChromeFromNode(node: Element | null): Element | null {
    if (!node || typeof (node as any).cloneNode !== 'function') return node;
    const cloned = (node as any).cloneNode(true) as Element;
    const selectors = ['.author-label', '.timestamp'];
    for (const selector of selectors) {
      try {
        const list = Array.from((cloned as any).querySelectorAll?.(selector) || []);
        for (const el of list) {
          try {
            (el as any).remove?.();
          } catch (_e) {
            // ignore
          }
        }
      } catch (_e) {
        // ignore
      }
    }
    return cloned;
  }

  function cleanTurnContentNode(node: Element | null): Element | null {
    const noThinking = stripThinkingFromNode(node);
    return stripTurnChromeFromNode(noThinking);
  }

  async function extractMessageFromTurn(turn: Element, sequence: number, ctx: InlineImageContext): Promise<any | null> {
    const role = normalizeRoleFromTurn(turn);
    if (!role) return null;

    const contentEl = pickTurnContent(turn, role);
    if (!contentEl) return null;
    const cleanedContent = cleanTurnContentNode(contentEl as any) || contentEl;

    const updatedAt = Date.now();
    if (role === 'user') {
      const text = env.normalize.normalizeText(
        (cleanedContent as any).innerText || (cleanedContent as any).textContent || '',
      );
      const imageUrls = await extractImageUrlsIncludingBlobImages(cleanedContent, ctx);
      if (!text && !imageUrls.length) return null;
      const contentText = text || '';
      const contentMarkdown = appendImageMarkdown(contentText, imageUrls, { allowDataImageUrls: true });
      return {
        messageKey: messageKeyFromTurn(turn, 'user', contentText, sequence),
        role: 'user',
        contentText,
        contentMarkdown,
        sequence,
        updatedAt,
      };
    }

    const text = extractAssistantText(cleanedContent);
    const imageUrls = await extractImageUrlsIncludingBlobImages(cleanedContent, ctx);
    if (!text && !imageUrls.length) return null;

    const contentText = text || '';
    const baseMarkdown = extractAssistantMarkdown(cleanedContent, contentText);
    const contentMarkdown = appendImageMarkdown(baseMarkdown || contentText, imageUrls, { allowDataImageUrls: true });
    return {
      messageKey: messageKeyFromTurn(turn, 'assistant', contentText, sequence),
      role: 'assistant',
      contentText,
      contentMarkdown,
      sequence,
      updatedAt,
    };
  }

  async function collectMessages(ctx: InlineImageContext): Promise<any[]> {
    const root = getConversationRoot();
    if (!root) return [];
    if (inEditMode(root)) return [];

    const turns: any[] = Array.from(root.querySelectorAll('ms-chat-turn')) as any[];
    if (!turns.length) return [];

    const out: any[] = [];
    let seq = 0;
    for (const turn of turns) {
      const msg = await extractMessageFromTurn(turn, seq, ctx);
      if (!msg) continue;
      out.push(msg);
      seq += 1;
    }
    return out;
  }

  async function prepareManualCapture(options: any = {}): Promise<LegacyPreparedCapture | null> {
    if (!matches({ hostname: env.location.hostname }) || !isValidConversationUrl()) return null;

    const root = getConversationRoot();
    if (!root) return null;
    const turns: Element[] = Array.from(root.querySelectorAll('ms-chat-turn')) as any;
    if (!turns.length) return null;

    const settleMs = Math.max(0, Number(options.settleMs) || 80);
    const perTurnTimeoutMs = Math.max(120, Number(options.perTurnTimeoutMs) || 900);
    const pollMs = Math.max(30, Number(options.pollMs) || 80);
    const conversationKey = String(findConversationKey() || '').trim();
    const identityGuard = sampleIdentityGuard();
    const ctx = createInlineImageContext();
    const messages: any[] = [];
    const restorer = createScrollRootRestorer({
      document: env.document,
      window: env.window,
      getSeed: getConversationRoot,
      sampleIdentity: sampleRestoreIdentity,
    });

    try {
      for (const turn of turns) {
        const role = normalizeRoleFromTurn(turn);
        if (!role) continue;
        try {
          (turn as any).scrollIntoView?.({ block: 'center' });
        } catch (_error) {
          // ignore
        }
        const startedAt = Date.now();
        while (Date.now() - startedAt <= perTurnTimeoutMs) {
          const content = pickTurnContent(turn, role);
          if (content) {
            const clean = cleanTurnContentNode(content) || content;
            const text = String((clean as any).textContent || '')
              .replace(/\s+/g, ' ')
              .trim();
            if (text || (clean as any).querySelector?.('img')) break;
          }
          await sleep(pollMs);
        }
        if (settleMs) await sleep(settleMs);
        const message = await extractMessageFromTurn(turn, messages.length, ctx);
        if (message) messages.push({ ...message, sequence: messages.length });
      }
    } finally {
      restorer.restore();
    }

    return {
      kind: 'syncnos.googleaistudio.prepared.v1',
      source: 'googleaistudio',
      conversationKey,
      identityGuard,
      messages,
      warningFlags: Array.from(ctx.warningFlags),
    };
  }

  async function capture(options: any = {}): Promise<any> {
    if (!matches({ hostname: env.location.hostname }) || !isValidConversationUrl()) return null;
    const manual = options && options.manual === true;
    const ctx = createInlineImageContext();
    const currentConversationKey = String(findConversationKey() || '').trim();
    const candidate = manual ? (options.preparedCapture as LegacyPreparedCapture | null) : null;
    const prepared =
      candidate?.kind === 'syncnos.googleaistudio.prepared.v1' &&
      candidate.source === 'googleaistudio' &&
      candidate.conversationKey === currentConversationKey &&
      identityGuardsMatch(candidate.identityGuard)
        ? candidate
        : null;

    let messages: any[] = [];
    let captureMeta: any = null;
    if (manual && prepared) {
      for (const flag of prepared.warningFlags) ctx.warningFlags.add(flag);
      const live = await collectMessages(ctx);
      const byKey = new Map(prepared.messages.map((message) => [String(message.messageKey || ''), message]));
      for (const message of live) byKey.set(String(message.messageKey || ''), message);
      messages = Array.from(byKey.values()).map((message, index) => ({ ...message, sequence: index }));
      captureMeta = { completeness: 'partial', identityVerified: true, reasons: ['legacy_fixed_traversal'] };
    } else if (manual) {
      messages = await collectMessages(ctx);
      captureMeta = {
        completeness: 'partial',
        identityVerified: false,
        reasons: [candidate ? 'identity_changed' : 'prepare_missing'],
      };
    } else {
      messages = await collectMessages(ctx);
    }

    if (!messages.length) return null;
    return {
      conversation: {
        sourceType: 'chat',
        source: 'googleaistudio',
        conversationKey: manual && !captureMeta?.identityVerified ? '' : findConversationKey(),
        title: extractConversationTitle(),
        url: env.location.href,
        warningFlags: Array.from(ctx.warningFlags),
        lastCapturedAt: Date.now(),
      },
      messages,
      ...(captureMeta ? { captureMeta } : null),
    };
  }

  const collector = {
    capture,
    getRoot: getConversationRoot,
    prepareManualCapture,
    __test: {
      collectMessages: async () => collectMessages(createInlineImageContext()),
      extractAssistantMarkdown,
      extractAssistantText,
    },
  };

  return { id: 'googleaistudio', matches, collector };
}
