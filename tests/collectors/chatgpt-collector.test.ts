import * as fs from 'node:fs';
import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import normalizeApi from '@services/shared/normalize.ts';
import { createCollectorEnv } from '../../src/collectors/collector-env.ts';
import {
  createChatgptCollectorDef,
  turnKeyOf,
  getTurnSkeleton,
  scrollTargetForTurn,
  turnIsHydrated,
  createHarvestCache,
  harvestMessagesInto,
  assembleFromCache,
} from '../../src/collectors/chatgpt/chatgpt-collector.ts';

function setupChatgptDom(html: string, url: string) {
  const dom = new JSDOM(`<body><main>${html}</main></body>`, { url });
  return dom;
}

describe('chatgpt-collector', () => {
  it('uses active conversation title in ChatGPT Projects pages (instead of project name h1)', async () => {
    const html = `
      <h1>Research</h1>
      <nav>
        <a href="/g/p_1/c/conv_project_1" aria-current="page"><span>GPR signal preprocessing</span></a>
      </nav>
      <div data-message-author-role="user"><div class="whitespace-pre-wrap">Q</div></div>
      <div data-message-author-role="assistant" data-message-id="m_ai_1">
        <div class="markdown prose"><p>A</p></div>
      </div>
    `;

    const dom = setupChatgptDom(html, 'https://chatgpt.com/g/p_1/c/conv_project_1');
    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    expect(snap.conversation.title).toBe('GPR signal preprocessing');
  });

  it('keeps fallback conversationKey in temporary chat and derives title from first user message', async () => {
    const html = `
      <div data-message-author-role="user"><div class="whitespace-pre-wrap">请帮我整理今天的发布检查清单</div></div>
      <div data-message-author-role="assistant" data-message-id="m_ai_tmp_1">
        <div class="markdown prose"><p>好的，我们先从回归范围开始。</p></div>
      </div>
    `;

    const dom = setupChatgptDom(html, 'https://chatgpt.com/?temporary-chat=true');
    dom.window.document.title = 'ChatGPT';
    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    expect(String(snap.conversation.conversationKey || '')).toMatch(/^fallback_/);
    expect(String(snap.conversation.title || '')).toBe('请帮我整理今天的发布检查清单');
    expect(String(snap.conversation.title || '')).not.toBe('ChatGPT');
  });

  it('extracts assistant contentMarkdown from semantic markdown DOM', async () => {
    const html = `
      <article data-testid="conversation-turn-1">
        <div data-message-author-role="user"><div class="whitespace-pre-wrap">你好</div></div>
      </article>
      <article data-testid="conversation-turn-2">
        <div data-message-author-role="assistant" data-message-id="m_ai_1">
          <div class="markdown prose">
            <h1>主标题</h1>
            <blockquote><p>这是引用</p></blockquote>
            <ul>
              <li>
                <p>父级条目</p>
                <ul>
                  <li><p>子级条目</p></li>
                </ul>
              </li>
            </ul>
            <ol start="3"><li><p>第三项</p></li></ol>
            <table>
              <thead><tr><th>类型</th><th>特征</th></tr></thead>
              <tbody><tr><td>深度工作</td><td>高专注</td></tr></tbody>
            </table>
            <pre>
              <div class="relative">
                <div class="sticky"><div>代码</div><button aria-label="复制">复制</button></div>
                <div id="code-block-viewer" class="cm-editor">
                  <div class="cm-scroller">
                    <div class="cm-content"><span>const a = 1;</span><br><span>console.log(a);</span></div>
                  </div>
                </div>
              </div>
            </pre>
            <p><strong>粗体</strong> <em>斜体</em> <code>sum(1,2)</code> <a href="https://example.com">链接</a></p>
            <hr />
          </div>
        </div>
      </article>
    `;

    const dom = setupChatgptDom(html, 'https://chatgpt.com/c/conv_md_1');
    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    expect(snap.messages.length).toBe(2);

    const assistant = snap.messages.find((m: { role: string }) => m.role === 'assistant');
    expect(assistant).toBeTruthy();
    expect(assistant.contentMarkdown).toContain('# 主标题');
    expect(assistant.contentMarkdown).toContain('> 这是引用');
    expect(assistant.contentMarkdown).toContain('- 父级条目');
    expect(assistant.contentMarkdown).toContain('  - 子级条目');
    expect(assistant.contentMarkdown).toContain('3. 第三项');
    expect(assistant.contentMarkdown).toContain('| 类型 | 特征 |');
    expect(assistant.contentMarkdown).toContain('```');
    expect(assistant.contentMarkdown).toContain('const a = 1;');
    expect(assistant.contentMarkdown).toContain('console.log(a);');
    expect(assistant.contentMarkdown).toContain('**粗体**');
    expect(assistant.contentMarkdown).toContain('*斜体*');
    expect(assistant.contentMarkdown).toContain('`sum(1,2)`');
    expect(assistant.contentMarkdown).toContain('[链接](https://example.com)');
    expect(assistant.contentMarkdown).toContain('---');
    expect(assistant.contentMarkdown).not.toContain('复制');

    expect(assistant.contentText).toContain('主标题');
    expect(assistant.contentText).toContain('console.log(a);');
    expect(assistant.contentText).not.toContain('复制');
  });

  it('extracts multiple assistant messages inside an agent-turn container', async () => {
    const html = `
      <div data-message-author-role="user"><div class="whitespace-pre-wrap">Q</div></div>
      <div class="group/turn-messages flex flex-col agent-turn">
        <div data-message-author-role="assistant" data-message-id="m_ai_1" class="text-message">
          <div class="markdown prose"><p>first</p></div>
        </div>
        <div class="flex items-center justify-between">
          <button type="button">Thought for 1s</button>
        </div>
        <div data-message-author-role="assistant" data-message-id="m_ai_2" class="text-message">
          <div class="markdown prose"><p>second</p></div>
        </div>
      </div>
    `;

    const dom = setupChatgptDom(html, 'https://chatgpt.com/c/conv_agent_turn_1');
    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    expect(snap.messages.map((m: any) => m.role)).toEqual(['user', 'assistant', 'assistant']);
    expect(snap.messages.map((m: any) => m.contentText)).toEqual(['Q', 'first', 'second']);
  });

  it('preserves hidden mermaid code blocks that are rendered as diagrams', async () => {
    const html = `
      <article data-testid="conversation-turn-1">
        <div data-message-author-role="assistant" data-message-id="m_ai_mermaid">
          <div class="markdown prose">
            <p>下面是一个 mermaid：</p>
            <div class="mermaid">
              <svg aria-hidden="true"><path d="M0 0" /></svg>
              <pre class="sr-only" aria-hidden="true"><code class="language-mermaid">graph TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[OK]\n  B -->|No| D[Retry]</code></pre>
            </div>
          </div>
        </div>
      </article>
    `;

    const dom = setupChatgptDom(html, 'https://chatgpt.com/c/conv_mermaid_1');
    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    expect(snap.messages.length).toBe(1);
    expect(snap.messages[0].role).toBe('assistant');
    expect(snap.messages[0].contentMarkdown).toContain('```mermaid');
    expect(snap.messages[0].contentMarkdown).toContain('graph TD');
    expect(snap.messages[0].contentText).toContain('graph TD');
  });

  it('captures deep-research iframe content via postMessage', async () => {
    const html = `
      <div data-message-author-role="assistant" data-message-id="m_ai_prev">
        <div class="markdown prose"><p>previous</p></div>
      </div>
      <article data-testid="conversation-turn-4" data-turn="assistant" data-turn-id="t1">
        <div class="agent-turn">
          <iframe title="internal://deep-research" src="https://connector_openai_deep_research.web-sandbox.oaiusercontent.com/?app=chatgpt"></iframe>
        </div>
      </article>
    `;

    const dom = setupChatgptDom(html, 'https://chatgpt.com/c/conv_deep_research_1');
    const iframe = dom.window.document.querySelector('iframe') as any;
    expect(iframe).toBeTruthy();

    const fakeFrameWindow = {
      postMessage: (msg: any) => {
        const requestId = msg?.requestId;
        dom.window.dispatchEvent(
          new (dom.window as any).MessageEvent('message', {
            data: {
              __syncnos: true,
              type: 'SYNCNOS_DEEP_RESEARCH_RESPONSE',
              requestId,
              title: 'Report',
              markdown: '# Title\n\nBody',
              text: 'Title\n\nBody',
            },
            origin: 'https://connector_openai_deep_research.web-sandbox.oaiusercontent.com',
            source: fakeFrameWindow as any,
          }),
        );
      },
    };
    Object.defineProperty(iframe, 'contentWindow', { configurable: true, value: fakeFrameWindow });

    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    expect(snap.messages.length).toBe(2);
    expect(snap.messages[0].contentText).toContain('previous');
    expect(snap.messages[1].role).toBe('assistant');
    expect(snap.messages[1].contentMarkdown).toContain('# Title');
    expect(snap.messages[1].contentText).toContain('Body');
  });

  it('captures deep-research iframe inside section conversation-turn wrappers', async () => {
    const html = `
      <section data-testid="conversation-turn-1" data-turn="user">
        <div data-message-author-role="user"><div class="whitespace-pre-wrap">Q</div></div>
      </section>
      <section data-testid="conversation-turn-2" data-turn="assistant" data-turn-id="t2">
        <h4 class="sr-only select-none">ChatGPT said:</h4>
        <div class="agent-turn">
          <iframe title="internal://deep-research" src="https://connector_openai_deep_research.web-sandbox.oaiusercontent.com?app=chatgpt&locale=en-US&deviceType=desktop"></iframe>
        </div>
      </section>
    `;

    const dom = setupChatgptDom(html, 'https://chatgpt.com/c/conv_deep_research_section_1');
    const iframe = dom.window.document.querySelector('iframe') as any;
    expect(iframe).toBeTruthy();

    const fakeFrameWindow = {
      postMessage: (msg: any) => {
        const requestId = msg?.requestId;
        dom.window.dispatchEvent(
          new (dom.window as any).MessageEvent('message', {
            data: {
              __syncnos: true,
              type: 'SYNCNOS_DEEP_RESEARCH_RESPONSE',
              requestId,
              title: 'Report',
              markdown: '# Title\n\nBody',
              text: 'Title\n\nBody',
            },
            origin: 'https://connector_openai_deep_research.web-sandbox.oaiusercontent.com',
            source: fakeFrameWindow as any,
          }),
        );
      },
    };
    Object.defineProperty(iframe, 'contentWindow', { configurable: true, value: fakeFrameWindow });

    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    expect(snap.messages.map((m: any) => m.role)).toEqual(['user', 'assistant']);
    expect(snap.messages[0].contentText).toBe('Q');
    expect(snap.messages[1].contentMarkdown).toContain('# Title');
    expect(snap.messages[1].contentText).toContain('Body');
  });

  it('captures multiple deep-research iframes with identical src as distinct reports', async () => {
    const html = `
      <section data-testid="conversation-turn-1" data-turn="user" data-turn-id="u1">
        <div data-message-author-role="user"><div class="whitespace-pre-wrap">Q</div></div>
      </section>
      <section data-testid="conversation-turn-2" data-turn="assistant" data-turn-id="a1">
        <div class="agent-turn">
          <iframe title="internal://deep-research" src="https://connector_openai_deep_research.web-sandbox.oaiusercontent.com?app=chatgpt&locale=en-US&deviceType=desktop"></iframe>
        </div>
      </section>
      <section data-testid="conversation-turn-3" data-turn="assistant" data-turn-id="a2">
        <div class="agent-turn">
          <iframe title="internal://deep-research" src="https://connector_openai_deep_research.web-sandbox.oaiusercontent.com?app=chatgpt&locale=en-US&deviceType=desktop"></iframe>
        </div>
      </section>
      <section data-testid="conversation-turn-4" data-turn="assistant" data-turn-id="a3">
        <div class="agent-turn">
          <iframe title="internal://deep-research" src="https://connector_openai_deep_research.web-sandbox.oaiusercontent.com?app=chatgpt&locale=en-US&deviceType=desktop"></iframe>
        </div>
      </section>
    `;

    const dom = setupChatgptDom(html, 'https://chatgpt.com/c/conv_deep_research_multi_1');
    const iframes = Array.from(dom.window.document.querySelectorAll('iframe')) as any[];
    expect(iframes.length).toBe(3);

    const mkFrame = (title: string, body: string) => {
      const win = {
        postMessage: (msg: any) => {
          const requestId = msg?.requestId;
          dom.window.dispatchEvent(
            new (dom.window as any).MessageEvent('message', {
              data: {
                __syncnos: true,
                type: 'SYNCNOS_DEEP_RESEARCH_RESPONSE',
                requestId,
                title,
                markdown: `# ${title}\n\n${body}`,
                text: `${title}\n\n${body}`,
              },
              origin: 'https://connector_openai_deep_research.web-sandbox.oaiusercontent.com',
              source: win as any,
            }),
          );
        },
      };
      return win;
    };

    const w1 = mkFrame('Report A', 'Body A');
    const w2 = mkFrame('Report A', 'Body A');
    const w3 = mkFrame('Report B', 'Body B');
    Object.defineProperty(iframes[0], 'contentWindow', { configurable: true, value: w1 });
    Object.defineProperty(iframes[1], 'contentWindow', { configurable: true, value: w2 });
    Object.defineProperty(iframes[2], 'contentWindow', { configurable: true, value: w3 });

    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    const assistant = snap.messages.filter((m: any) => m.role === 'assistant');
    expect(assistant.length).toBe(3);
    // When multiple deep-research iframes exist, we prefer stable placeholders and let the hydrator fill the body.
    expect(String(assistant[0].contentText)).toContain('Deep Research (iframe)');
    expect(String(assistant[1].contentText)).toContain('Deep Research (iframe)');
    expect(String(assistant[2].contentText)).toContain('Deep Research (iframe)');
    expect(String(assistant[0].messageKey || '')).not.toBe(String(assistant[1].messageKey || ''));
  });

  it('falls back to deep-research placeholder when iframe extraction returns empty, even with sr-only label', async () => {
    const html = `
      <article data-testid="conversation-turn-4" data-turn="assistant" data-turn-id="t1">
        <h6 class="sr-only select-none">ChatGPT说:</h6>
        <div class="agent-turn">
          <iframe title="internal://deep-research" src="https://connector_openai_deep_research.web-sandbox.oaiusercontent.com/?app=chatgpt&locale=zh-CN"></iframe>
        </div>
      </article>
    `;

    const dom = setupChatgptDom(html, 'https://chatgpt.com/c/conv_deep_research_fallback_1');
    const iframe = dom.window.document.querySelector('iframe') as any;
    expect(iframe).toBeTruthy();

    const fakeFrameWindow = {
      postMessage: (msg: any) => {
        const requestId = msg?.requestId;
        dom.window.dispatchEvent(
          new (dom.window as any).MessageEvent('message', {
            data: {
              __syncnos: true,
              type: 'SYNCNOS_DEEP_RESEARCH_RESPONSE',
              requestId,
              title: 'Deep Research',
              markdown: '',
              text: '',
            },
            origin: 'https://connector_openai_deep_research.web-sandbox.oaiusercontent.com',
            source: fakeFrameWindow as any,
          }),
        );
      },
    };
    Object.defineProperty(iframe, 'contentWindow', { configurable: true, value: fakeFrameWindow });

    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({}))) as any;
    expect(snap).toBeTruthy();
    expect(snap.messages.length).toBe(1);
    expect(snap.messages[0].role).toBe('assistant');
    expect(String(snap.messages[0].contentText)).toMatch(/^Deep Research \(iframe\):/);
    expect(String(snap.messages[0].contentText)).toContain(
      'connector_openai_deep_research.web-sandbox.oaiusercontent.com',
    );
    expect(String(snap.messages[0].contentText)).not.toContain('ChatGPT说');
  });

  it('falls back to plain text markdown when markdown helper is unavailable', async () => {
    const html = `
      <article data-testid="conversation-turn-1">
        <div data-message-author-role="assistant">
          <div class="markdown prose"><p>plain answer</p></div>
        </div>
      </article>
    `;

    vi.resetModules();
    vi.doMock('../../src/collectors/chatgpt/chatgpt-markdown.ts', () => ({ default: {} }));

    const dom = setupChatgptDom(html, 'https://chatgpt.com/c/conv_fallback_1');
    const { createChatgptCollectorDef: createDef } = await import('../../src/collectors/chatgpt/chatgpt-collector.ts');

    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });

    const snap = (await Promise.resolve(createDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    expect(snap.messages.length).toBe(1);
    expect(snap.messages[0].role).toBe('assistant');
    expect(snap.messages[0].contentText).toBe('plain answer');
    expect(snap.messages[0].contentMarkdown).toBe('plain answer');
  });
});

describe('chatgpt turn primitives', () => {
  function buildTurnsDom() {
    const html = `<!DOCTYPE html><html><body>
      <div data-turn-id-container style="--last-known-height:120px">
        <section data-testid="conversation-turn-1" data-turn-id="turn_a" data-turn="user">
          <div data-message-author-role="user"><div class="whitespace-pre-wrap">你好</div></div>
        </section>
      </div>
      <div data-turn-id-container style="--last-known-height:8000px">
        <section data-testid="conversation-turn-2" data-turn-id="turn_b" data-turn="assistant"></section>
      </div>
      <div data-turn-id-container style="--last-known-height:200px">
        <section data-testid="conversation-turn-3" data-turn-id="turn_c" data-turn="assistant">
          <div data-message-author-role="assistant" data-message-id="m_c"><div class="markdown prose"><p>答</p></div></div>
        </section>
      </div>
    </body></html>`;
    return new JSDOM(html, { url: 'https://chatgpt.com/share/share_primitives_1' });
  }

  it('getTurnSkeleton returns every turn shell including empty (virtualized) ones', () => {
    const skeleton = getTurnSkeleton(buildTurnsDom().window.document);
    expect(skeleton.length).toBe(3);
  });

  it('turnKeyOf resolves to the same turn UUID from a deep role node and from the shell', () => {
    const doc = buildTurnsDom().window.document;
    const roleNode = doc.querySelector('[data-message-author-role="user"]') as any;
    const shell1 = doc.querySelector('[data-testid="conversation-turn-1"]') as any;
    const emptyShell = doc.querySelector('[data-testid="conversation-turn-2"]') as any;
    expect(turnKeyOf(roleNode)).toBe('turn_a');
    expect(turnKeyOf(shell1)).toBe('turn_a');
    // An empty (virtualized) shell still yields its stable turn UUID.
    expect(turnKeyOf(emptyShell)).toBe('turn_b');
  });

  it('turnIsHydrated distinguishes empty shells from rendered turns', () => {
    const doc = buildTurnsDom().window.document;
    const t1 = doc.querySelector('[data-testid="conversation-turn-1"]') as any;
    const t2 = doc.querySelector('[data-testid="conversation-turn-2"]') as any;
    const t3 = doc.querySelector('[data-testid="conversation-turn-3"]') as any;
    expect(turnIsHydrated(t1)).toBe(true);
    expect(turnIsHydrated(t2)).toBe(false);
    expect(turnIsHydrated(t3)).toBe(true);
  });

  it('scrollTargetForTurn returns the outer container without scrolling', () => {
    const doc = buildTurnsDom().window.document;
    const shell = doc.querySelector('[data-testid="conversation-turn-1"]') as any;
    const target = scrollTargetForTurn(shell) as any;
    expect(target).toBeTruthy();
    expect(target.hasAttribute('data-turn-id-container')).toBe(true);
  });
});

describe('chatgpt harvest cache', () => {
  function skeletonDoc() {
    const html = `<!DOCTYPE html><html><body>
      <div data-turn-id-container><section data-testid="conversation-turn-1" data-turn-id="turn_a"></section></div>
      <div data-turn-id-container><section data-testid="conversation-turn-2" data-turn-id="turn_b"></section></div>
      <div data-turn-id-container><section data-testid="conversation-turn-3" data-turn-id="turn_c"></section></div>
    </body></html>`;
    return new JSDOM(html, { url: 'https://chatgpt.com/share/x' }).window.document;
  }
  function msg(messageKey: string, role: string, text: string) {
    return { messageKey, role, contentText: text, contentMarkdown: text, sequence: 0, updatedAt: 1 };
  }

  it('reassembles a middle turn hydrated on a later pass into its correct position', () => {
    const doc = skeletonDoc();
    const cache = createHarvestCache('conv_test');
    // Pass 1: middle turn (turn_b) is an empty shell, only turn_a and turn_c are present.
    expect(
      harvestMessagesInto(cache, [
        { turnKey: 'turn_a', withinTurn: 0, message: msg('m_a', 'user', 'Q1') },
        { turnKey: 'turn_c', withinTurn: 0, message: msg('m_c', 'assistant', 'A2') },
      ]),
    ).toBe(2);
    expect((assembleFromCache(cache, doc) || []).map((m: any) => m.messageKey)).toEqual(['m_a', 'm_c']);
    // Pass 2: the middle turn hydrates; re-harvesting turn_a/turn_c must not duplicate.
    expect(
      harvestMessagesInto(cache, [
        { turnKey: 'turn_a', withinTurn: 0, message: msg('m_a', 'user', 'Q1') },
        { turnKey: 'turn_b', withinTurn: 0, message: msg('m_b', 'user', 'Q-mid') },
        { turnKey: 'turn_c', withinTurn: 0, message: msg('m_c', 'assistant', 'A2') },
      ]),
    ).toBe(1);
    const full = assembleFromCache(cache, doc) || [];
    expect(full.map((m: any) => m.messageKey)).toEqual(['m_a', 'm_b', 'm_c']);
    expect(full.map((m: any) => m.sequence)).toEqual([0, 1, 2]);
  });

  it('keeps multiple messages within one turn in insertion order (F3)', () => {
    const doc = skeletonDoc();
    const cache = createHarvestCache('conv_multi');
    harvestMessagesInto(cache, [
      { turnKey: 'turn_a', withinTurn: 0, message: msg('m_a', 'user', 'Q') },
      { turnKey: 'turn_b', withinTurn: 0, message: msg('m_b1', 'assistant', 'part1') },
      { turnKey: 'turn_b', withinTurn: 1, message: msg('m_b2', 'assistant', 'part2') },
    ]);
    expect((assembleFromCache(cache, doc) || []).map((m: any) => m.messageKey)).toEqual(['m_a', 'm_b1', 'm_b2']);
  });

  it('returns null when nothing has been harvested', () => {
    expect(assembleFromCache(createHarvestCache('empty'), skeletonDoc())).toBeNull();
  });
});

describe('chatgpt virtualized share fixture (5 rounds)', () => {
  function loadFixture() {
    const html = fs.readFileSync(new URL('../fixtures/chatgpt-share-virtualized.html', import.meta.url), 'utf8');
    // F2: the real share DOM has no <main>; load it as a FULL document (no main wrapper).
    return new JSDOM(html, { url: 'https://chatgpt.com/share/6a422ac4-0fac-83ee-8050-90dec7c22b89' });
  }

  it('captures the virtualized fixture as a full document without regression (9 messages, 3 rounds)', async () => {
    const dom = loadFixture();
    expect(dom.window.document.querySelectorAll('main').length).toBe(0);
    const env = createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });
    const snap = (await Promise.resolve(createChatgptCollectorDef(env).collector.capture({ manual: true }))) as any;
    expect(snap).toBeTruthy();
    expect(snap.messages.length).toBe(9);
    expect(snap.messages.filter((m: any) => m.role === 'user').length).toBe(3);
  });

  it('fills the middle gap via cross-pass harvest once the empty shells hydrate (5 rounds)', async () => {
    const dom = loadFixture();
    const doc = dom.window.document;
    const env = createCollectorEnv({
      window: dom.window as any,
      document: doc as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });
    const def = createChatgptCollectorDef(env) as any;
    const t = def.collector.__test;
    const root = t.getRoot();
    const cache = createHarvestCache(t.resolveConversationCacheKey());

    // Pass 1: t3/t4/t5 are empty virtualized shells, so only 3 rounds are visible (the bug).
    expect(await t.harvestInto(cache, root, { allowEditing: true })).toBe(9);
    expect((assembleFromCache(cache, root) || []).filter((m: any) => m.role === 'user').length).toBe(3);

    // Simulate scroll hydration: the 3 empty shells render their content.
    const shells = getTurnSkeleton(doc).filter((s: any) => !turnIsHydrated(s));
    expect(shells.length).toBe(3);
    const injRoles = ['user', 'assistant', 'user'];
    shells.forEach((s: any, idx: number) => {
      const role = injRoles[idx];
      const wrap = doc.createElement('div');
      wrap.setAttribute('data-message-author-role', role);
      wrap.setAttribute('data-message-id', `inj_${idx}`);
      const inner = doc.createElement('div');
      inner.className = role === 'user' ? 'whitespace-pre-wrap' : 'markdown prose';
      inner.textContent = `注入-${role}-${idx}`;
      wrap.appendChild(inner);
      s.appendChild(wrap);
    });

    // Pass 2: the previously-empty shells are harvested; already-seen messages are not duplicated.
    expect(await t.harvestInto(cache, root, { allowEditing: true })).toBe(3);
    const full = assembleFromCache(cache, root) || [];
    expect(full.length).toBe(12);
    expect(full.filter((m: any) => m.role === 'user').length).toBe(5);
    expect(full.every((m: any, i: number) => m.sequence === i)).toBe(true);
    // The recovered messages land in the MIDDLE (positions 3,4,5), not appended at the end.
    const injPositions = full
      .map((m: any, i: number) => (String(m.contentText || '').startsWith('注入-') ? i : -1))
      .filter((i: number) => i >= 0);
    expect(injPositions).toEqual([3, 4, 5]);
  });
});

describe('chatgpt manual scroll-sweep capture (P2)', () => {
  function loadFixtureDom() {
    const html = fs.readFileSync(new URL('../fixtures/chatgpt-share-virtualized.html', import.meta.url), 'utf8');
    return new JSDOM(html, { url: 'https://chatgpt.com/share/6a422ac4-0fac-83ee-8050-90dec7c22b89' });
  }
  // Wire scrollIntoView on each empty shell's container so that scrolling it into view 'hydrates'
  // the shell, mimicking ChatGPT's virtualized rendering. Returns a counter of scroll calls.
  function mockHydrationOnScroll(doc: Document) {
    const shells = getTurnSkeleton(doc).filter((s: any) => !turnIsHydrated(s));
    const injRoles = ['user', 'assistant', 'user'];
    const counter = { calls: 0 };
    shells.forEach((s: any, idx: number) => {
      const container = (s.closest && s.closest('[data-turn-id-container]')) || s;
      const role = injRoles[idx] || 'assistant';
      (container as any).scrollIntoView = () => {
        counter.calls += 1;
        if (s.querySelector('[data-message-author-role]')) return;
        const wrap = doc.createElement('div');
        wrap.setAttribute('data-message-author-role', role);
        wrap.setAttribute('data-message-id', `inj_${idx}`);
        const inner = doc.createElement('div');
        inner.className = role === 'user' ? 'whitespace-pre-wrap' : 'markdown prose';
        inner.textContent = `注入-${role}-${idx}`;
        wrap.appendChild(inner);
        s.appendChild(wrap);
      };
    });
    return { shells, counter };
  }
  function buildEnv(dom: JSDOM) {
    return createCollectorEnv({
      window: dom.window as any,
      document: dom.window.document as any,
      location: dom.window.location as any,
      normalize: normalizeApi,
    });
  }

  it('prepareManualCapture + manual capture recovers all 5 rounds across virtualized shells', async () => {
    const dom = loadFixtureDom();
    (dom.window as any).scrollTo = vi.fn();
    const { shells, counter } = mockHydrationOnScroll(dom.window.document);
    expect(shells.length).toBe(3);
    const def = createChatgptCollectorDef(buildEnv(dom)) as any;

    const prepared = await def.collector.prepareManualCapture({ perTurnTimeoutMs: 300, pollMs: 10, settleMs: 5 });
    expect(prepared).toBe(true);
    expect(counter.calls).toBe(3);

    const snap = (await Promise.resolve(def.collector.capture({ manual: true }))) as any;
    expect(snap.messages.length).toBe(12);
    expect(snap.messages.filter((m: any) => m.role === 'user').length).toBe(5);
    expect(snap.messages.every((m: any, i: number) => m.sequence === i)).toBe(true);
    const injPositions = snap.messages
      .map((m: any, i: number) => (String(m.contentText || '').startsWith('注入-') ? i : -1))
      .filter((i: number) => i >= 0);
    expect(injPositions).toEqual([3, 4, 5]);
  });

  it('manual capture without prepareManualCapture falls back to a live single pass (3 rounds)', async () => {
    const dom = loadFixtureDom();
    const def = createChatgptCollectorDef(buildEnv(dom)) as any;
    const snap = (await Promise.resolve(def.collector.capture({ manual: true }))) as any;
    expect(snap.messages.length).toBe(9);
    expect(snap.messages.filter((m: any) => m.role === 'user').length).toBe(3);
  });

  it('restores the scroll position after the sweep', async () => {
    const dom = loadFixtureDom();
    const scrollTo = vi.fn();
    (dom.window as any).scrollTo = scrollTo;
    mockHydrationOnScroll(dom.window.document);
    const def = createChatgptCollectorDef(buildEnv(dom)) as any;
    await def.collector.prepareManualCapture({ perTurnTimeoutMs: 200, pollMs: 10, settleMs: 0 });
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
