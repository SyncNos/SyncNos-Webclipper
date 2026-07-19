import type { CollectorDefinition } from '@collectors/collector-contract.ts';
import type { CollectorEnv } from '@collectors/collector-env.ts';
import { appendImageMarkdown, extractImageUrlsFromElement } from '@collectors/collector-utils.ts';
import chatgptMarkdown from '@collectors/chatgpt/chatgpt-markdown.ts';
import {
  addPreparedReason,
  createPreparedAccumulator,
  createScrollRootRestorer,
  finishPreparedCapture,
  mergePreparedRecords,
  readPreparedCapture,
  runVirtualizedPass,
  resolveScrollRoot,
  writeScrollPosition,
  type PreparedAccumulator,
  type PreparedIdentityGuard,
  type PreparedMessageRecord,
} from '@collectors/virtualized-chat/virtualized-chat-sweep.ts';

// ---- Pure turn primitives ----
// These are env-free and side-effect-free (they never scroll or mutate the DOM), so they can be
// unit-tested directly and reused by both the live collector and the manual scroll-sweep path.

// Stable per-turn key. Prefers the turn UUID (data-turn-id), which is identical between a
// virtualized empty shell and its hydrated form; falls back to message id, then testid, then id.
export function turnKeyOf(el: any): string {
  if (!el) return '';
  const turn = el.closest ? el.closest('[data-turn-id]') : null;
  const turnId = turn && turn.getAttribute ? turn.getAttribute('data-turn-id') : '';
  if (turnId) return String(turnId);
  if (el.getAttribute) {
    const messageId = el.getAttribute('data-message-id');
    if (messageId) return String(messageId);
    const testid = el.getAttribute('data-testid');
    if (testid) return String(testid);
  }
  return el.id ? String(el.id) : '';
}

export function createChatgptCollectorDef(env: CollectorEnv): CollectorDefinition {
  const DEEP_RESEARCH_MESSAGE_TYPES = Object.freeze({
    REQUEST: 'SYNCNOS_DEEP_RESEARCH_REQUEST',
    RESPONSE: 'SYNCNOS_DEEP_RESEARCH_RESPONSE',
  });

  const deepResearchCache = new Map<string, { markdown: string; text: string; title: string; updatedAt: number }>();
  const deepResearchInFlight = new Map<string, Promise<{ markdown: string; text: string; title: string } | null>>();
  const deepResearchPending = new Map<
    string,
    {
      resolve: (payload: { markdown: string; text: string; title: string } | null) => void;
      timeoutId: any;
      intervalId?: any;
    }
  >();
  let deepResearchListenerInstalled = false;

  function sleep(ms: any): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
  }

  function ensureDeepResearchListener() {
    if (deepResearchListenerInstalled) return;
    deepResearchListenerInstalled = true;
    env.window.addEventListener('message', (event: any) => {
      const data = event?.data;
      if (!data || data.__syncnos !== true) return;
      if (data.type !== DEEP_RESEARCH_MESSAGE_TYPES.RESPONSE) return;
      const requestId = String(data.requestId || '').trim();
      if (!requestId) return;

      const pending = deepResearchPending.get(requestId);
      if (!pending) return;
      deepResearchPending.delete(requestId);
      try {
        if (pending.timeoutId) clearTimeout(pending.timeoutId);
        if (pending.intervalId) clearInterval(pending.intervalId);
      } catch (_e) {
        // ignore
      }

      const markdown = String(data.markdown || '').trim();
      const text = String(data.text || '').trim();
      const title = String(data.title || '').trim() || 'Deep Research';
      if (!markdown && !text) {
        pending.resolve(null);
        return;
      }
      pending.resolve({ markdown, text, title });
    });
  }

  function findDeepResearchIframe(wrapper: any): any | null {
    if (!wrapper || !wrapper.querySelector) return null;
    const nodes = Array.from(wrapper.querySelectorAll("iframe[title='internal://deep-research']")) as any[];
    if (!nodes.length) return null;
    if (nodes.length === 1) return nodes[0];

    // Some turns keep multiple deep-research iframes in the DOM (stale duplicates). Prefer the most visible one.
    let best: any | null = null;
    let bestArea = -1;
    for (const node of nodes) {
      if (!node || typeof node.getBoundingClientRect !== 'function') continue;
      let rect: any = null;
      try {
        rect = node.getBoundingClientRect();
      } catch (_e) {
        rect = null;
      }
      const width = Number(rect?.width) || 0;
      const height = Number(rect?.height) || 0;
      const area = width * height;
      if (!area) continue;
      try {
        const style = env.window?.getComputedStyle ? env.window.getComputedStyle(node) : null;
        if (style && (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')) continue;
      } catch (_e) {
        // ignore
      }
      if (area > bestArea) {
        bestArea = area;
        best = node;
      }
    }

    return best || nodes[0] || null;
  }

  function requestDeepResearchContent(
    iframeEl: any,
    options?: { timeoutMs?: number; cacheKeyHint?: string },
  ): Promise<{ markdown: string; text: string; title: string } | null> {
    const iframeSrc = String(iframeEl?.getAttribute?.('src') || '').trim();
    // NOTE: The deep-research iframe src is often identical across multiple turns in the same conversation.
    // If we cache purely by src, later reports incorrectly reuse the first extracted snapshot.
    const cacheKeyHint = String(options?.cacheKeyHint || '').trim();
    const cacheKeyBase = iframeSrc || String(iframeEl?.getAttribute?.('title') || 'deep-research');
    const cacheKey = cacheKeyHint ? `${cacheKeyHint}|${cacheKeyBase}` : cacheKeyBase;
    const cached = deepResearchCache.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.updatedAt < 60_000)
      return Promise.resolve({ markdown: cached.markdown, text: cached.text, title: cached.title });

    const existing = deepResearchInFlight.get(cacheKey);
    if (existing) return existing;

    const timeoutMs = Number.isFinite(options?.timeoutMs as any) ? Math.max(400, Number(options?.timeoutMs)) : 2500;
    const p = new Promise<{ markdown: string; text: string; title: string } | null>((resolve) => {
      try {
        ensureDeepResearchListener();

        const requestId = `dr_${now}_${Math.random().toString(16).slice(2)}`;
        const timeoutId = env.window.setTimeout(() => {
          const pending = deepResearchPending.get(requestId);
          deepResearchPending.delete(requestId);
          try {
            if (pending?.intervalId) clearInterval(pending.intervalId);
          } catch (_e) {
            // ignore
          }
          resolve(null);
        }, timeoutMs);

        const sendRequest = () => {
          const targetWindow = iframeEl?.contentWindow;
          if (!targetWindow || typeof targetWindow.postMessage !== 'function') return;
          try {
            targetWindow.postMessage(
              {
                __syncnos: true,
                type: DEEP_RESEARCH_MESSAGE_TYPES.REQUEST,
                requestId,
              },
              // Use '*' to avoid origin-mismatch errors while the iframe is still navigating (often starts as about:blank inheriting parent origin).
              // The receiver validates parent origins and request ids, and we only post to the specific iframe window.
              '*',
            );
          } catch (_e) {
            // ignore
          }
        };

        // Race-proof: the iframe's content script may not be ready yet. Retry for a short window.
        const intervalId = env.window.setInterval(() => {
          if (!deepResearchPending.has(requestId)) return;
          sendRequest();
        }, 250);

        deepResearchPending.set(requestId, { resolve, timeoutId, intervalId });
        sendRequest();
      } catch (_e) {
        resolve(null);
      }
    })
      .then((payload) => {
        if (payload) deepResearchCache.set(cacheKey, { ...payload, updatedAt: Date.now() });
        return payload;
      })
      .finally(() => {
        deepResearchInFlight.delete(cacheKey);
      });

    deepResearchInFlight.set(cacheKey, p);
    return p;
  }

  function matches(loc: any): any {
    const hostname = loc && loc.hostname ? loc.hostname : env.location.hostname;
    return /(^|\.)chatgpt\.com$/.test(hostname) || /(^|\.)chat\.openai\.com$/.test(hostname);
  }

  function findConversationIdFromUrl(): any {
    const m =
      env.location.pathname.match(/^\/c\/([^/?#]+)/) || env.location.pathname.match(/^\/g\/[^/]+\/c\/([^/?#]+)/);
    return m && m[1] ? m[1] : '';
  }

  function findShareIdFromUrl(): string {
    const match = env.location.pathname.match(/^\/share\/([^/?#]+)/);
    return match?.[1] ? String(match[1]) : '';
  }

  function makeFallbackConversationKey(messages: any): any {
    const firstUser = Array.isArray(messages)
      ? messages.find((m: any) => m && m.role === 'user' && m.contentText)
      : null;
    const seed = `${env.location.hostname}|${env.location.pathname}|${firstUser ? firstUser.contentText : ''}`;
    const hash = env.normalize && env.normalize.fnv1a32 ? env.normalize.fnv1a32(seed) : String(Date.now());
    return `fallback_${hash}`;
  }

  function normalizedRoute(): string {
    const pathname = String(env.location.pathname || '/').replace(/\/+$/, '') || '/';
    const search = String(env.location.search || '');
    return `${String(env.location.hostname || '').toLowerCase()}${pathname}${search}`;
  }

  function hashStableIdentity(value: string): string {
    const hash = env.normalize?.fnv1a32 ? env.normalize.fnv1a32(value) : value;
    return String(hash);
  }

  function directMessageId(element: any): string {
    const direct = String(element?.getAttribute?.('data-message-id') || '').trim();
    if (direct) return direct;
    const nested = element?.querySelector?.('[data-message-id]');
    return String(nested?.getAttribute?.('data-message-id') || '').trim();
  }

  function stableManualMessageKey(element: any, role: string, turnKey: string, withinTurn: number): string {
    const messageId = directMessageId(element);
    if (messageId) return messageId;
    if (!turnKey || (role !== 'user' && role !== 'assistant')) return '';
    return `${turnKey}:${role}:${withinTurn}`;
  }

  function readTurnShells(root: any): any[] {
    if (!root?.querySelectorAll) return [];
    return Array.from(
      root.querySelectorAll("[data-testid^='conversation-turn-'], [data-testid='conversation-turn']"),
    ) as any[];
  }

  function sampleIdentityGuard(root: any): PreparedIdentityGuard {
    const durableId = findConversationIdFromUrl() || findShareIdFromUrl();
    const anchors: string[] = [];
    const seen = new Set<string>();
    const push = (value: unknown) => {
      const anchor = String(value || '').trim();
      if (!anchor || seen.has(anchor)) return;
      seen.add(anchor);
      anchors.push(anchor);
    };
    for (const turn of readTurnShells(root)) push(`turn:${turnKeyOf(turn)}`);
    const perTurn = new Map<string, number>();
    for (const wrapper of getTurnWrappers(root)) {
      const turnKey = turnKeyOf(wrapper);
      const withinTurn = perTurn.get(turnKey) || 0;
      perTurn.set(turnKey, withinTurn + 1);
      push(stableManualMessageKey(wrapper, roleFromWrapper(wrapper), turnKey, withinTurn));
    }
    const topAnchor = anchors[0] || '';
    return { route: normalizedRoute(), durableId, anchors, topAnchor };
  }

  function identityConversationKey(guard: PreparedIdentityGuard): string {
    if (guard.durableId) return guard.durableId;
    return guard.topAnchor ? `chatgpt_${hashStableIdentity(guard.topAnchor)}` : '';
  }

  function identityGuardsMatch(expected: PreparedIdentityGuard, actual: PreparedIdentityGuard): boolean {
    if (!expected || !actual || expected.route !== actual.route) return false;
    if (expected.durableId || actual.durableId) {
      return !!expected.durableId && expected.durableId === actual.durableId;
    }
    if (!expected.anchors.length || !actual.anchors.length) return false;
    const actualAnchors = new Set(actual.anchors);
    return expected.anchors.some((anchor) => actualAnchors.has(anchor));
  }

  function samplePageIdentity(): string | null {
    const guard = sampleIdentityGuard(getConversationRoot());
    const stable = guard.durableId || guard.topAnchor;
    return stable ? `${guard.route}|${stable}` : null;
  }

  function isTemporaryChatMode(): boolean {
    try {
      const params = new URLSearchParams(String(env.location.search || '').replace(/^\?/, ''));
      const value = String(params.get('temporary-chat') || '')
        .trim()
        .toLowerCase();
      return value === 'true' || value === '1' || value === 'yes' || value === 'on';
    } catch (_e) {
      return false;
    }
  }

  function normalizeTitleText(value: unknown): string {
    return String(value || '').trim();
  }

  function isGenericChatgptTitle(value: unknown): boolean {
    const normalized = normalizeTitleText(value).toLowerCase();
    return normalized === '' || normalized === 'chatgpt';
  }

  function deriveTemporaryChatAutoTitle(messages: any): string {
    const firstUser = Array.isArray(messages)
      ? messages.find((m: any) => m && m.role === 'user' && m.contentText)
      : null;
    const raw = firstUser ? String(firstUser.contentText || '') : '';
    const normalized = env.normalize && env.normalize.normalizeText ? env.normalize.normalizeText(raw) : raw;
    const text = String(normalized || '').trim();
    if (!text) return '';
    const maxLen = 56;
    if (text.length <= maxLen) return text;
    return `${text.slice(0, maxLen - 1).trimEnd()}…`;
  }

  function findTitle(messages?: any): any {
    const conversationId = findConversationIdFromUrl();

    if (conversationId) {
      const activeLinks = Array.from(env.document.querySelectorAll("a[aria-current='page'][href]")) as any[];
      const active = activeLinks.find((a: any) =>
        String(a?.getAttribute?.('href') || '').includes(`/c/${conversationId}`),
      );
      const activeText = active && active.textContent ? String(active.textContent).trim() : '';
      if (activeText) return activeText;

      const hrefLinks = Array.from(env.document.querySelectorAll('a[href]')) as any[];
      const byHref = hrefLinks.find((a: any) =>
        String(a?.getAttribute?.('href') || '').includes(`/c/${conversationId}`),
      );
      const hrefText = byHref && byHref.textContent ? String(byHref.textContent).trim() : '';
      if (hrefText) return hrefText;
    }

    const h = env.document.querySelector('h1');
    const t = h && h.textContent ? h.textContent.trim() : '';
    const fallbackTitle = t || env.document.title || 'ChatGPT';
    if (!conversationId && isTemporaryChatMode() && isGenericChatgptTitle(fallbackTitle)) {
      const temporaryTitle = deriveTemporaryChatAutoTitle(messages);
      if (temporaryTitle) return temporaryTitle;
    }
    return fallbackTitle;
  }

  function getConversationRoot(): any {
    return env.document.querySelector('main') || env.document.querySelector("[role='main']") || env.document.body;
  }

  function inEditMode(root: any): any {
    if (!root) return false;
    const ta = root.querySelector('textarea');
    if (!ta) return false;
    return env.document.activeElement === ta || ta.contains(env.document.activeElement);
  }

  function userContentNode(element: any): any {
    return element.querySelector('.whitespace-pre-wrap') || element;
  }

  function assistantContentNode(element: any): any {
    return element.querySelector('.markdown.prose') || element.querySelector('.markdown') || element;
  }

  type ChatgptDescriptor = {
    key: string;
    turnKey: string;
    withinTurn: number;
    role: 'user' | 'assistant';
    fingerprint: string;
    hasDeepResearch: boolean;
  };

  type ChatgptExtractionInput = ChatgptDescriptor & {
    outerHtml: string;
    imageUrls: string[];
    iframeUrl: string;
  };

  function getTurnWrappers(root: any): any {
    const scope = root || env.document;
    const DOCUMENT_POSITION_FOLLOWING = env.window?.Node?.DOCUMENT_POSITION_FOLLOWING ?? 4;

    function sortInDocumentOrder(nodes: any[]): any[] {
      const sorted = nodes.slice();
      sorted.sort((a: any, b: any) => {
        if (a === b) return 0;
        return a.compareDocumentPosition(b) & DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
      return sorted;
    }

    function dropAncestors(nodes: any[]): any[] {
      if (!nodes.length) return nodes;
      return nodes.filter((node: any) => !nodes.some((other: any) => other !== node && node.contains(other)));
    }

    const roleNodes = Array.from(scope.querySelectorAll('[data-message-author-role]')) as any[];
    // Modern ChatGPT wraps each turn with `data-testid="conversation-turn-N"` but the tag varies (`article`, `section`, etc).
    const turnNodes = Array.from(
      scope.querySelectorAll("[data-testid^='conversation-turn-'], [data-testid='conversation-turn']"),
    ) as any[];

    // Prefer message-level nodes if available. Some modern ChatGPT DOMs group multiple assistant
    // messages inside a single `.agent-turn` container; keeping `.agent-turn` as the wrapper would
    // only capture the first message.
    if (roleNodes.length) {
      const picked = dropAncestors(roleNodes);
      const extraTurns = turnNodes.filter((turn: any) => !picked.some((node: any) => turn.contains(node)));
      return sortInDocumentOrder(
        dropAncestors(Array.from(new Set(picked.concat(extraTurns).filter(Boolean))) as any[]),
      );
    }

    if (turnNodes.length) {
      return sortInDocumentOrder(dropAncestors(turnNodes));
    }

    const agentTurnNodes = Array.from(scope.querySelectorAll('.agent-turn')) as any[];
    return sortInDocumentOrder(dropAncestors(agentTurnNodes));
  }

  function roleFromWrapper(wrapper: any): any {
    const direct = wrapper && wrapper.getAttribute ? wrapper.getAttribute('data-message-author-role') : '';
    if (direct === 'user' || direct === 'assistant') return direct;

    const turnRole = wrapper && wrapper.getAttribute ? wrapper.getAttribute('data-turn') : '';
    if (turnRole === 'user' || turnRole === 'assistant') return turnRole;

    const inner = wrapper && wrapper.querySelector ? wrapper.querySelector('[data-message-author-role]') : null;
    const innerRole = inner && inner.getAttribute ? inner.getAttribute('data-message-author-role') : '';
    if (innerRole === 'user' || innerRole === 'assistant') return innerRole;

    if (wrapper && wrapper.classList && wrapper.classList.contains('agent-turn')) return 'assistant';
    if (wrapper && wrapper.querySelector && wrapper.querySelector("div[class*='user']")) return 'user';
    return 'assistant';
  }

  // If a conversation contains multiple deep-research iframes, we intentionally keep placeholders
  // and let the background hydrator fill them in bulk. Partial in-page extraction would make the
  // remaining placeholders ambiguous and can collapse reports.
  function computePreferDeepResearchPlaceholders(wrappers: any[]): boolean {
    try {
      let count = 0;
      for (const w of wrappers) {
        if (count >= 2) break;
        const role = roleFromWrapper(w);
        if (role !== 'assistant') continue;
        if (findDeepResearchIframe(w)) count += 1;
      }
      return count >= 2;
    } catch (_e) {
      // ignore
      return false;
    }
  }

  // Extract a single message from one turn wrapper. Returns null when the wrapper has no
  // textual content and no images (e.g. virtualized empty shells), so callers can skip it.
  // Kept async because Deep Research extraction may await the iframe hydrator.
  async function extractMessageFromWrapper(
    el: any,
    i: number,
    { allowEditing, preferDeepResearchPlaceholders, messageKeyOverride }: any = {},
  ): Promise<any | null> {
    const role = roleFromWrapper(el);
    const messageId =
      (el.getAttribute && (el.getAttribute('data-message-id') || el.getAttribute('data-turn-id') || el.id)) || '';
    const node = role === 'user' ? userContentNode(el) : assistantContentNode(el);
    const raw = node ? node.innerText || node.textContent || '' : '';
    const fallbackText = env.normalize.normalizeText(raw);
    let contentText =
      role === 'assistant' && typeof chatgptMarkdown.extractAssistantText === 'function'
        ? chatgptMarkdown.extractAssistantText(el) || fallbackText
        : fallbackText;
    const imageUrls = (() => {
      const primary = extractImageUrlsFromElement(node || el);
      if (!node || node === el) return primary;
      const secondary = extractImageUrlsFromElement(el);
      return Array.from(new Set(primary.concat(secondary)));
    })();

    let baseMarkdown =
      role === 'assistant' && typeof chatgptMarkdown.extractAssistantMarkdown === 'function'
        ? chatgptMarkdown.extractAssistantMarkdown(el) || contentText || ''
        : contentText || '';

    const deepResearchIframe = role === 'assistant' ? findDeepResearchIframe(el) : null;
    if (role === 'assistant' && deepResearchIframe) {
      // Prefer a fast placeholder and let the background hydrator fill the body reliably.
      // Best-effort request is kept short to avoid blocking capture for long-running reports.
      const iframeUrl = String(deepResearchIframe.getAttribute?.('src') || '').trim();
      const placeholder = iframeUrl ? `Deep Research (iframe): ${iframeUrl}` : 'Deep Research (iframe)';

      if (preferDeepResearchPlaceholders) {
        contentText = placeholder;
        baseMarkdown = placeholder;
      } else {
        const deepResearchCacheKeyHint = messageId || String(el.getAttribute?.('data-testid') || '') || String(i);
        const extracted = await requestDeepResearchContent(deepResearchIframe, {
          timeoutMs: allowEditing ? 600 : 200,
          cacheKeyHint: deepResearchCacheKeyHint,
        });
        if (extracted) {
          const markdown = String(extracted.markdown || '').trim();
          const text = String(extracted.text || '').trim();
          baseMarkdown = markdown || text || baseMarkdown || '';
          contentText = env.normalize.normalizeText(text || markdown || contentText || '');
        } else {
          // The parent page doesn't contain the report body; only the iframe does.
          // If extraction fails (timing/permissions), keep a stable placeholder so users can still recover the link.
          // Some locales expose an sr-only "ChatGPT said" label as the only text sibling of the iframe.
          // Always prefer a stable placeholder so the hydrator can reliably fill the final report.
          contentText = placeholder;
          baseMarkdown = placeholder;
        }
      }
    }

    if (!contentText && !imageUrls.length) return null;
    const contentMarkdown = appendImageMarkdown(baseMarkdown, imageUrls);
    const messageKey =
      String(messageKeyOverride || '').trim() ||
      messageId ||
      env.normalize.makeFallbackMessageKey({ role, contentText, sequence: i });
    return {
      messageKey,
      role,
      contentText,
      contentMarkdown,
      sequence: i,
      updatedAt: Date.now(),
    };
  }

  function descriptorFingerprint(input: {
    role: string;
    key: string;
    text: string;
    imageUrls: string[];
    iframeUrl: string;
  }): string {
    const source = `${input.role}|${input.key}|${input.text.length}|${input.text}|${input.imageUrls.join('|')}|${
      input.iframeUrl
    }`;
    return env.normalize?.fnv1a32 ? String(env.normalize.fnv1a32(source)) : source;
  }

  function readCurrentDescriptors(): ChatgptDescriptor[] {
    const root = getConversationRoot();
    if (!root) return [];
    const wrappers = getTurnWrappers(root);
    const perTurn = new Map<string, number>();
    const descriptors: ChatgptDescriptor[] = [];
    for (const wrapper of wrappers) {
      const role = roleFromWrapper(wrapper);
      const turnKey = turnKeyOf(wrapper);
      const withinTurn = perTurn.get(turnKey) || 0;
      perTurn.set(turnKey, withinTurn + 1);
      const key = stableManualMessageKey(wrapper, role, turnKey, withinTurn);
      if (!key) continue;
      const node = role === 'user' ? userContentNode(wrapper) : assistantContentNode(wrapper);
      const text = env.normalize.normalizeText(node?.innerText || node?.textContent || '');
      const imageUrls = extractImageUrlsFromElement(wrapper);
      const iframe = role === 'assistant' ? findDeepResearchIframe(wrapper) : null;
      const iframeUrl = String(iframe?.getAttribute?.('src') || '').trim();
      descriptors.push({
        key,
        turnKey,
        withinTurn,
        role,
        fingerprint: descriptorFingerprint({ role, key, text, imageUrls, iframeUrl }),
        hasDeepResearch: !!iframe,
      });
    }
    return descriptors;
  }

  function snapshotExtractionInput(key: string): ChatgptExtractionInput | null {
    const root = getConversationRoot();
    if (!root) return null;
    const wrappers = getTurnWrappers(root);
    const perTurn = new Map<string, number>();
    for (const wrapper of wrappers) {
      const role = roleFromWrapper(wrapper);
      const turnKey = turnKeyOf(wrapper);
      const withinTurn = perTurn.get(turnKey) || 0;
      perTurn.set(turnKey, withinTurn + 1);
      const stableKey = stableManualMessageKey(wrapper, role, turnKey, withinTurn);
      if (stableKey !== key) continue;
      const node = role === 'user' ? userContentNode(wrapper) : assistantContentNode(wrapper);
      const text = env.normalize.normalizeText(node?.innerText || node?.textContent || '');
      const imageUrls = extractImageUrlsFromElement(wrapper);
      const iframe = role === 'assistant' ? findDeepResearchIframe(wrapper) : null;
      const iframeUrl = String(iframe?.getAttribute?.('src') || '').trim();
      return {
        key: stableKey,
        turnKey,
        withinTurn,
        role,
        fingerprint: descriptorFingerprint({ role, key: stableKey, text, imageUrls, iframeUrl }),
        hasDeepResearch: !!iframe,
        outerHtml: String(wrapper?.outerHTML || ''),
        imageUrls,
        iframeUrl,
      };
    }
    return null;
  }

  function extractManualMessage(input: ChatgptExtractionInput, sequence: number): any | null {
    const holder = env.document.createElement('div');
    holder.innerHTML = input.outerHtml;
    const wrapper = holder.firstElementChild as any;
    if (!wrapper) return null;
    const node = input.role === 'user' ? userContentNode(wrapper) : assistantContentNode(wrapper);
    const raw = node?.innerText || node?.textContent || '';
    const fallbackText = env.normalize.normalizeText(raw);
    let contentText =
      input.role === 'assistant' && typeof chatgptMarkdown.extractAssistantText === 'function'
        ? chatgptMarkdown.extractAssistantText(wrapper) || fallbackText
        : fallbackText;
    let baseMarkdown =
      input.role === 'assistant' && typeof chatgptMarkdown.extractAssistantMarkdown === 'function'
        ? chatgptMarkdown.extractAssistantMarkdown(wrapper) || contentText || ''
        : contentText || '';
    if (input.hasDeepResearch) {
      const placeholder = input.iframeUrl ? `Deep Research (iframe): ${input.iframeUrl}` : 'Deep Research (iframe)';
      contentText = placeholder;
      baseMarkdown = placeholder;
    }
    if (!contentText && !input.imageUrls.length) return null;
    return {
      messageKey: input.key,
      role: input.role,
      contentText,
      contentMarkdown: appendImageMarkdown(baseMarkdown, input.imageUrls),
      sequence,
      updatedAt: Date.now(),
    };
  }

  const manualAdapter = {
    readRoot: () => getConversationRoot(),
    readIdentity: () => sampleIdentityGuard(getConversationRoot()),
    readScrollSeed: () => getConversationRoot(),
    readDescriptors: readCurrentDescriptors,
    readDescriptorKeys: () => readCurrentDescriptors().map((descriptor) => descriptor.key),
    snapshotExtractionInput,
  };

  async function collectMessages({ allowEditing }: any = {}): Promise<any[]> {
    const root = getConversationRoot();
    if (!root) return [];
    if (!allowEditing && inEditMode(root)) return [];

    const wrappers = getTurnWrappers(root);
    const preferDeepResearchPlaceholders = computePreferDeepResearchPlaceholders(wrappers);

    const out: any[] = [];
    for (let i = 0; i < wrappers.length; i += 1) {
      const msg = await extractMessageFromWrapper(wrappers[i], i, {
        allowEditing,
        preferDeepResearchPlaceholders,
      });
      if (msg) out.push(msg);
    }

    return out;
  }

  function messageFingerprint(message: any): string {
    const source = `${String(message?.role || '')}|${String(message?.contentText || '')}|${String(
      message?.contentMarkdown || '',
    )}`;
    return env.normalize?.fnv1a32 ? String(env.normalize.fnv1a32(source)) : source;
  }

  async function harvestRenderedInto(
    accumulator: PreparedAccumulator<any>,
    _root: any,
    _options: any = {},
  ): Promise<{ added: number; updated: number }> {
    const descriptors = manualAdapter.readDescriptors();
    const existingByKey = new Map(accumulator.records.map((record) => [record.key, record]));
    const records: Array<Omit<PreparedMessageRecord<any>, 'firstSeenIndex'>> = [];
    for (let i = 0; i < descriptors.length; i += 1) {
      const descriptor = descriptors[i];
      const existing = existingByKey.get(descriptor.key);
      const previousFingerprint = accumulator.descriptorFingerprints[descriptor.key];
      accumulator.descriptorFingerprints[descriptor.key] = descriptor.fingerprint;
      if (existing && existing.fingerprint === descriptor.fingerprint) {
        records.push({
          key: existing.key,
          turnKey: existing.turnKey,
          withinTurn: existing.withinTurn,
          fingerprint: existing.fingerprint,
          payload: existing.payload,
        });
        continue;
      }
      if (!existing && previousFingerprint === descriptor.fingerprint) continue;
      const input = manualAdapter.snapshotExtractionInput(descriptor.key);
      if (!input) continue;
      const message = extractManualMessage(input, i);
      if (!message) continue;
      records.push({
        key: descriptor.key,
        turnKey: descriptor.turnKey,
        withinTurn: descriptor.withinTurn,
        fingerprint: input.fingerprint,
        payload: message,
      });
    }
    const stableKeys = new Set(descriptors.map((descriptor) => descriptor.key));
    if (!stableKeys.size && getTurnWrappers(getConversationRoot()).length) {
      addPreparedReason(accumulator, 'unstable_identity');
    }
    return mergePreparedRecords(accumulator, records);
  }

  // Manual-only dynamic sweep. The provider re-queries after every wait; no turn/message node
  // survives across an await. The original scroll root is restored exactly once in finally.
  async function prepareManualCapture(options: any = {}): Promise<any | null> {
    if (!matches({ hostname: env.location.hostname })) return null;
    const root = manualAdapter.readRoot();
    if (!root) return null;

    const scrollRuntime = { document: env.document, window: env.window };
    const scrollRestorer = createScrollRootRestorer({
      ...scrollRuntime,
      getSeed: manualAdapter.readScrollSeed,
      sampleIdentity: samplePageIdentity,
    });

    try {
      const identityGuard = manualAdapter.readIdentity();
      const conversationKey = identityConversationKey(identityGuard);
      const accumulator = createPreparedAccumulator<any>({
        source: 'chatgpt',
        conversationKey,
        identityVerified: !!conversationKey,
        identityGuard,
      });
      addPreparedReason(accumulator, 'single_pass_unconfirmed');
      if (!conversationKey) addPreparedReason(accumulator, 'unstable_identity');

      const pass = await runVirtualizedPass(
        scrollRuntime,
        {
          getScrollSeed: manualAdapter.readScrollSeed,
          sampleIdentity: samplePageIdentity,
          readDescriptorKeys: manualAdapter.readDescriptorKeys,
          harvest: (target) => harvestRenderedInto(target, null, { allowEditing: true }),
        },
        accumulator,
        {
          maxSteps: options.maxSteps,
          stableSamples: options.stableSamples,
          pollMs: options.pollMs,
          stepTimeoutMs: options.stepTimeoutMs || options.perTurnTimeoutMs,
          overlapRatio: options.overlapRatio,
          maxOverlapRecoveries: options.maxOverlapRecoveries,
          sleep: options.sleep,
          now: options.now,
        },
      );
      if (!pass.reachedTop) addPreparedReason(accumulator, 'top_not_reached');
      if (!pass.reachedBottom) addPreparedReason(accumulator, 'bottom_not_reached');
      const finalGuard = manualAdapter.readIdentity();
      if (!identityGuardsMatch(accumulator.identityGuard, finalGuard)) {
        accumulator.identityVerified = false;
        accumulator.conversationKey = '';
        addPreparedReason(accumulator, 'identity_changed');
      }
      return finishPreparedCapture(accumulator);
    } finally {
      scrollRestorer.restore();
    }
  }

  async function capture(options: any): Promise<any | null> {
    if (!matches({ hostname: env.location.hostname })) return null;
    const manual = !!(options && options.manual);

    let messages: any[] = [];
    let manualConversationKey = '';
    let manualMeta: any = null;
    let prepared = manual ? readPreparedCapture<any>(options?.preparedCapture, 'chatgpt') : null;
    const currentGuard = manualAdapter.readIdentity();
    if (prepared && !identityGuardsMatch(prepared.identityGuard, currentGuard)) prepared = null;

    if (manual && prepared) {
      const accumulator = createPreparedAccumulator<any>({
        source: 'chatgpt',
        conversationKey: prepared.conversationKey,
        identityVerified: prepared.identityVerified === true,
        identityGuard: prepared.identityGuard,
      });
      addPreparedReason(accumulator, 'single_pass_unconfirmed');
      mergePreparedRecords(
        accumulator,
        prepared.records.map(({ firstSeenIndex: _firstSeenIndex, ...record }) => record),
      );
      Object.assign(accumulator.descriptorFingerprints, prepared.descriptorFingerprints || {});
      const root = getConversationRoot();
      if (root) await harvestRenderedInto(accumulator, root, { allowEditing: true });
      const finalGuard = manualAdapter.readIdentity();
      if (!identityGuardsMatch(accumulator.identityGuard, finalGuard)) {
        accumulator.identityVerified = false;
        accumulator.conversationKey = '';
        addPreparedReason(accumulator, 'identity_changed');
      }
      prepared = finishPreparedCapture(accumulator);
      messages = prepared.records.map((record, index) => ({ ...record.payload, sequence: index }));
      manualConversationKey = prepared.identityVerified ? prepared.conversationKey : '';
      manualMeta = {
        completeness: 'partial',
        identityVerified: prepared.identityVerified === true,
        reasons: prepared.reasons,
        metrics: prepared.metrics,
      };
    } else if (manual) {
      // A direct/manual capture without a prepared sweep keeps the normal live extraction behavior.
      // Persistence still fails closed through partial metadata and stable-key filtering in P1.
      messages = await collectMessages({ allowEditing: true });
      const guard = manualAdapter.readIdentity();
      manualConversationKey = identityConversationKey(guard);
      manualMeta = {
        completeness: 'partial',
        identityVerified: !!manualConversationKey,
        reasons: ['prepare_missing'],
        metrics: { samples: 1, messages: messages.length },
      };
    } else {
      messages = await collectMessages({ allowEditing: false });
    }
    if (!messages.length) return null;
    const conversationKey = manual
      ? manualConversationKey || makeFallbackConversationKey(messages)
      : findConversationIdFromUrl() || makeFallbackConversationKey(messages);
    return {
      conversation: {
        sourceType: 'chat',
        source: 'chatgpt',
        conversationKey,
        title: findTitle(messages),
        url: env.location.href,
        warningFlags: [],
        lastCapturedAt: Date.now(),
      },
      messages,
      ...(manual ? { captureMeta: manualMeta } : null),
    };
  }

  const collector = {
    capture,
    getRoot: getConversationRoot,
    prepareManualCapture,
    __test: {
      sampleIdentityGuard,
      identityConversationKey,
      manualAdapter,
      getRoot: getConversationRoot,
      collectMessages,
    },
  };

  return {
    id: 'chatgpt',
    matches,
    collector,
  };
}
