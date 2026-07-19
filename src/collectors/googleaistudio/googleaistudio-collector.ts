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
    identityGuard: { route: string; durableId: string; anchors: string[]; topAnchor: string };
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
    const anchors = stableTurnAnchors();
    return {
      route: String(env.location.pathname || ''),
      durableId: String(findConversationKey() || '').trim(),
      anchors,
      topAnchor: anchors[0] || '',
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

  type ManualTurnEntry = {
    turnId: string;
    role: 'user' | 'assistant';
    content: Element;
    withinTurn: number;
    messageKey: string;
  };

  function roleFromMarker(marker: Element): 'user' | 'assistant' | null {
    const value = String(marker.getAttribute?.('data-turn-role') || '').trim();
    if (/^user$/i.test(value)) return 'user';
    if (/model|assistant/i.test(value)) return 'assistant';
    return null;
  }

  function readManualTurnEntries(turn: Element): ManualTurnEntry[] {
    const turnId = String(turn.getAttribute?.('id') || '').trim();
    if (!turnId) return [];
    const entries: ManualTurnEntry[] = [];
    for (const marker of Array.from(turn.querySelectorAll('[data-turn-role]'))) {
      const role = roleFromMarker(marker);
      if (!role) continue;
      const content = marker.matches?.('.turn-content') ? marker : marker.querySelector('.turn-content');
      if (!content) continue;
      const withinTurn = entries.length;
      entries.push({ turnId, role, content, withinTurn, messageKey: `${turnId}:${role}:${withinTurn}` });
    }
    if (entries.length) return entries;
    const role = normalizeRoleFromTurn(turn);
    const content = role ? pickTurnContent(turn, role) : null;
    if (!role || !content) return [];
    return [{ turnId, role, content, withinTurn: 0, messageKey: `${turnId}:${role}:0` }];
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

  type PlainImageReferences = {
    httpUrls: string[];
    blobUrls: string[];
  };

  type PlainExtractionInput = {
    messageKey: string;
    turnKey: string;
    withinTurn: number;
    role: 'user' | 'assistant';
    sequence: number;
    contentText: string;
    baseMarkdown: string;
    imageReferences: PlainImageReferences;
    updatedAt: number;
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
        .map((value: any) => String(value || '').trim())
        .filter(Boolean);
      for (const item of items) {
        const url = String(item.split(/\s+/)[0] || '').trim();
        if (isBlobUrl(url)) return url;
      }
    }
    return '';
  }

  function extractBlobImageUrlsFromElement(element: ParentNode | null): string[] {
    if (!element || typeof (element as any).querySelectorAll !== 'function') return [];
    const seen = new Set<string>();
    const output: string[] = [];
    for (const image of Array.from((element as any).querySelectorAll('img'))) {
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
    } catch (_error) {
      ctx.warningFlags.add('inline_images_fetch_failed');
      return null;
    }
  }

  function stripThinkingFromNode(node: Element | null): Element | null {
    if (!node || typeof (node as any).cloneNode !== 'function') return node;
    const cloned = (node as any).cloneNode(true) as Element;
    const selectors = ['ms-thought-chunk', '.thought-panel', 'img[alt="Thinking"]', '.thinking-progress-icon'];
    for (const selector of selectors) {
      for (const element of Array.from((cloned as any).querySelectorAll?.(selector) || [])) {
        try {
          (element as any).remove?.();
        } catch (_error) {
          // ignore
        }
      }
    }
    return cloned;
  }

  function stripTurnChromeFromNode(node: Element | null): Element | null {
    if (!node || typeof (node as any).cloneNode !== 'function') return node;
    const cloned = (node as any).cloneNode(true) as Element;
    for (const selector of ['.author-label', '.timestamp']) {
      for (const element of Array.from((cloned as any).querySelectorAll?.(selector) || [])) {
        try {
          (element as any).remove?.();
        } catch (_error) {
          // ignore
        }
      }
    }
    return cloned;
  }

  function cleanTurnContentNode(node: Element | null): Element | null {
    return stripTurnChromeFromNode(stripThinkingFromNode(node));
  }

  function uniqueStrings(values: string[]): string[] {
    const seen = new Set<string>();
    return values.filter((value) => {
      const normalized = String(value || '').trim();
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  }

  function snapshotPlainInput(
    turn: Element,
    role: 'user' | 'assistant',
    content: Element,
    sequence: number,
    manualEntry?: ManualTurnEntry,
  ): PlainExtractionInput | null {
    const cleaned = cleanTurnContentNode(content) || content;
    const contentText =
      role === 'assistant'
        ? extractAssistantText(cleaned)
        : env.normalize.normalizeText((cleaned as any).innerText || (cleaned as any).textContent || '');
    const baseMarkdown = role === 'assistant' ? extractAssistantMarkdown(cleaned, contentText) : contentText;
    const httpUrls = uniqueStrings(extractImageUrlsFromElement(cleaned));
    const blobUrls = uniqueStrings(extractBlobImageUrlsFromElement(cleaned));
    if (!contentText && !httpUrls.length && !blobUrls.length) return null;
    return {
      messageKey: manualEntry?.messageKey || messageKeyFromTurn(turn, role, contentText, sequence),
      turnKey: manualEntry?.turnId || String(turn.getAttribute?.('id') || '').trim(),
      withinTurn: manualEntry?.withinTurn || 0,
      role,
      sequence,
      contentText,
      baseMarkdown: baseMarkdown || contentText,
      imageReferences: { httpUrls, blobUrls },
      updatedAt: Date.now(),
    };
  }

  function snapshotNormalInputs(): PlainExtractionInput[] {
    const root = getConversationRoot();
    if (!root || inEditMode(root)) return [];
    const output: PlainExtractionInput[] = [];
    for (const turn of Array.from(root.querySelectorAll('ms-chat-turn')) as Element[]) {
      const role = normalizeRoleFromTurn(turn);
      const content = role ? pickTurnContent(turn, role) : null;
      if (!role || !content) continue;
      const input = snapshotPlainInput(turn, role, content, output.length);
      if (input) output.push(input);
    }
    return output;
  }

  function readCurrentManualKeys(): string[] {
    const root = getConversationRoot();
    if (!root) return [];
    const output: string[] = [];
    for (const turn of Array.from(root.querySelectorAll('ms-chat-turn')) as Element[]) {
      for (const entry of readManualTurnEntries(turn)) output.push(entry.messageKey);
    }
    return output;
  }

  function snapshotManualInput(key: string, sequence: number): PlainExtractionInput | null {
    const root = getConversationRoot();
    if (!root) return null;
    for (const turn of Array.from(root.querySelectorAll('ms-chat-turn')) as Element[]) {
      for (const entry of readManualTurnEntries(turn)) {
        if (entry.messageKey !== key) continue;
        return snapshotPlainInput(turn, entry.role, entry.content, sequence, entry);
      }
    }
    return null;
  }

  function snapshotCurrentManualInputs(): PlainExtractionInput[] {
    const output: PlainExtractionInput[] = [];
    for (const key of readCurrentManualKeys()) {
      const input = snapshotManualInput(key, output.length);
      if (input) output.push(input);
    }
    return output;
  }

  async function resolveImageReferences(references: PlainImageReferences, ctx: InlineImageContext): Promise<string[]> {
    const output = references.httpUrls.slice();
    for (const blobUrl of references.blobUrls) {
      const dataUrl = await inlineBlobImageUrl(blobUrl, ctx);
      if (dataUrl) output.push(dataUrl);
    }
    return uniqueStrings(output);
  }

  async function extractMessageFromInput(input: PlainExtractionInput, ctx: InlineImageContext): Promise<any | null> {
    const imageUrls = await resolveImageReferences(input.imageReferences, ctx);
    if (!input.contentText && !imageUrls.length) return null;
    return {
      messageKey: input.messageKey,
      role: input.role,
      contentText: input.contentText,
      contentMarkdown: appendImageMarkdown(input.baseMarkdown || input.contentText, imageUrls, {
        allowDataImageUrls: true,
      }),
      sequence: input.sequence,
      updatedAt: input.updatedAt,
    };
  }

  async function extractMessagesFromInputs(inputs: PlainExtractionInput[], ctx: InlineImageContext): Promise<any[]> {
    const output: any[] = [];
    for (const input of inputs) {
      const message = await extractMessageFromInput({ ...input, sequence: output.length }, ctx);
      if (message) output.push(message);
    }
    return output;
  }

  async function collectMessages(ctx: InlineImageContext): Promise<any[]> {
    return extractMessagesFromInputs(snapshotNormalInputs(), ctx);
  }

  async function prepareManualCapture(options: any = {}): Promise<LegacyPreparedCapture | null> {
    if (!matches({ hostname: env.location.hostname }) || !isValidConversationUrl()) return null;
    const root = getConversationRoot();
    if (!root) return null;
    const keys = readCurrentManualKeys();
    if (!keys.length) return null;

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
      for (const key of keys) {
        const startedAt = Date.now();
        let input: PlainExtractionInput | null = null;
        while (Date.now() - startedAt <= perTurnTimeoutMs) {
          input = snapshotManualInput(key, messages.length);
          if (input) break;
          await sleep(pollMs);
        }
        if (!input) continue;
        if (settleMs) await sleep(settleMs);
        input = snapshotManualInput(key, messages.length);
        if (!input) continue;
        const message = await extractMessageFromInput(input, ctx);
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
      const live = await extractMessagesFromInputs(snapshotCurrentManualInputs(), ctx);
      const byKey = new Map(prepared.messages.map((message) => [String(message.messageKey || ''), message]));
      for (const message of live) byKey.set(String(message.messageKey || ''), message);
      messages = Array.from(byKey.values()).map((message, index) => ({ ...message, sequence: index }));
      captureMeta = { completeness: 'partial', identityVerified: true, reasons: ['legacy_fixed_traversal'] };
    } else if (manual) {
      messages = await extractMessagesFromInputs(snapshotCurrentManualInputs(), ctx);
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
