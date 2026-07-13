# 模块：文章评论 / 注释线程

## 职责

- 为 WebClipper 的 article 会话提供本地优先的 threaded comments（React 实现）。
- 允许用户在 article detail 或 inpage comments panel 中添加、回复、删除评论；根评论可保存版本化 `locator`。生产写入使用 V2，历史数据继续读取 V1；Range marker 只在评论面板生命周期内存在，不做跨页面持久高亮。
- 当前定位是**local-first 注释层**：它是 article 会话的一部分，会在 article 同步时进入 Notion / Obsidian 的评论区段（含根评论数统计），并继续跟随 Zip v2 备份 / 导入保留。
- **2026-04 完成 React 迁移**：从 ~1,340 行 DOM 操作迁移到 ~950 行 React 组件，删除了 legacy `render.ts`（543 行），引入 `useSyncExternalStore` + panel store 架构。

## 关键文件

| 路径 | 作用 | 为什么重要 |
| --- | --- | --- |
| `src/ui/comments/panel.ts` | React 桥接入口 | 组装 panel store、dock/resize、exact anchor controller、Range scroll 与 panel-scoped marker registry；DOM surface roots 由 UI/entrypoint 注入 |
| `src/ui/comments/react/ThreadedCommentsPanel.tsx` | 评论主组件（~810 行） | 完整的 React 组件：composer、threads、replies、删除确认（内联实现，非独立组件）、Chat with AI 菜单（内联实现，非独立组件）、聚焦逻辑、防重入保护、Escape 信号处理 |
| `src/ui/comments/react/panel-store.ts` | 外部 store（~99 行） | 实现 `getSnapshot/subscribe` 模式，桥接 background handlers 与 React 渲染；提供 `setOpen`、`setBusy`、`setQuoteText`、`setComments`、`setHandlers`、`setFocusComposerSignal`、`setEscapeSignal`、`setNotice`、`setHasFocusWithinPanel`、`setPendingFocusRootId` 等完整 setter |
| `src/ui/comments/react/focus-rules.ts` | 聚焦规则（~34 行） | 保存后聚焦（返回 `createdRootId` 用于聚焦新评论）、回复后聚焦目标输入框、pending focus 解析 |
| `src/services/comments/locator/capture-comment-anchor.ts` | V2 capture 用例 | 从经过边界校验的 Range 生成 canonical quote、position、boundary path、root evidence 与可选 document-relative root path |
| `src/services/comments/locator/resolve-comment-anchor.ts` | V1/V2 exact resolver | 在受限候选 roots 中执行历史 V1 或 V2 path/position/quote 策略；只有全局唯一 exact Range 才成功 |
| `src/ui/comments/comment-anchor-controller.ts` | 定位生命周期控制器 | 用 generation + AbortSignal 取消旧解析，协调 passive/active marker，并在 panel 关闭或销毁时清理 |
| `src/ui/comments/range-scroll-controller.ts` / `range-marker-registry.ts` | Range 几何适配 | 对精确 Range 做嵌套滚动与矩形 marker；不高亮父元素 |
| `src/ui/comments/chatwith.ts` | 头部 Chat with AI 菜单控制器（~260 行） | 处理 article detail 头部的 Chat with AI 菜单，非评论级 |
| `src/ui/comments/comment-chatwith-config.ts` | 评论级 Chat with AI 配置（~95 行） | 创建评论级 Chat with AI 配置对象 |
| `src/services/comments/domain/comment-thread-graph.ts` | 唯一评论图归一化 | 统一 roots/replies 排序，并确定性分类 orphan、cycle、duplicate；指标、列表、归档和同步派生不得自行重建父子图 |
| `src/services/comments/domain/comment-dto.ts` | runtime DTO 真源 | 统一 background/client/App/Inpage 的评论字段与 locator 解析 |
| `src/services/comments/domain/comment-archive.ts` | Zip 评论归档契约 | 兼容读取 V1，严格校验/写出 V2，提供 roots-first 幂等导入序列与 warnings |
| `src/services/comments/data/storage-idb.ts` | 评论存储层（~340 行） | 负责 `article_comments` 的本地读写、查询、附着 orphan 评论、canonical URL 迁移；**不计算** `commentThreadCount`（该逻辑在 `comment-metrics.ts`） |
| `src/services/comments/background/handlers.ts` | 评论消息路由（~120 行） | 注册 5 个评论消息路由：LIST、ADD、DELETE、ATTACH_ORPHAN、**MIGRATE_CANONICAL_URL**；ADD 操作中 `locator` 仅在根评论时保存 |
| `src/services/comments/client/repo.ts` | UI 侧客户端仓库（~60 行） | 给 React 组件提供 add / list / delete API |
| `src/ui/conversations/ArticleCommentsSection.tsx` | article 详情评论区（~200 行） | 支持 sidebar 和 embedded 两种模式的评论区组件 |
| `src/ui/inpage/inpage-comments-panel-shadow.ts` | inpage comments 面板壳（~250 行） | 让页面内评论面板运行在独立 shadow root 中；新增 `resolveInpageCommentChatWithContext` 和 `createInpageChatWithOpenPort` |
| `src/services/comments/sidebar/comment-sidebar-session.ts` | 评论侧边栏共享会话（~220 行） | 统一 open / close / quote / focus / busy 语义；onSave 成功后自动清空 quoteText |
| `src/services/bootstrap/inpage-comments-panel-content-handlers.ts` | inpage comments content bridge（~130 行） | 负责打开 panel、解析选区、首次解析 article 后附着 orphan 评论 |
| `src/services/integrations/chatwith/chatwith-comment-actions.ts` | 评论级 Chat with AI 载荷（~100 行） | 构建评论+上下文的 Chat with AI payload，支持单平台简化标签 |
| `src/services/sync/notion/notion-sync-orchestrator.ts` | Notion 同步 | 同步时加载评论并计算 `commentThreadCount`，写入 Notion "Comment Threads" 属性 |
| `src/services/sync/obsidian/obsidian-markdown-writer.ts` | Obsidian 写入 | frontmatter 写入 `comments_root_count`，Markdown 包含 `## Comments` 章节 |
| `src/platform/messaging/message-contracts.ts` | 消息契约 | 定义 5 个 `COMMENTS_MESSAGE_TYPES`：LIST、ADD、DELETE、ATTACH_ORPHAN、**MIGRATE_CANONICAL_URL** |
| `src/platform/idb/schema.ts` | IndexedDB schema | `article_comments` store 在 v7 引入并通过当前 `DB_VERSION = 8` schema 持续保留；`ensureArticleCommentsStore` 负责补齐索引 |
| `src/services/sync/backup/export.ts` / `import.ts` | 备份导出 / 导入 | Zip v2 把 `article_comments` 归档到 `assets/article-comments/index.json` |

## 存储模型

| 项目 | 说明 | 备注 |
| --- | --- | --- |
| store 名称 | `article_comments` | WebClipper 的独立 object store |
| 主键 | `id` 自增 | 便于回复树与删除操作 |
| 主要字段 | `canonicalUrl`, `conversationId`, `parentId`, `authorName?`, `quoteText`, `commentText`, `locator?`, `createdAt`, `updatedAt` | `canonicalUrl` 会去掉 hash 后再归一；`locator` 是可选的可恢复选区信息 |
| 索引 | `by_canonicalUrl_createdAt`, `by_conversationId_createdAt` | 支持按 article 和按会话两种读取路径 |
| 线程关系 | `parentId` | `null` 表示 root；新写入只允许 reply 指向同一 conversation/canonical URL 下的 root。历史 orphan/cycle/duplicate 由唯一 thread graph 确定性归一化 |
| orphan 处理 | `conversationId = null` | 页面未解析出会话时先落本地，随后 attach |

- `article_comments` 是 article 的本地注释层，会在 article 同步时参与 Notion / Obsidian 评论区段更新，并随 Zip v2 备份 / 导入一起保留。
- **Notion 同步**：conversation 对象携带 `commentThreadCount`，写入 Notion "Comment Threads" 属性（数字类型）。
- **Obsidian 写入**：frontmatter 包含 `comments_root_count`，Markdown 包含 `## Comments` 章节。
- Zip 评论索引读取兼容 schema V1（可缺少 `authorName`/`locator` 并产生 warning）；当前导出写 schema V2，保留 author 与 V1/V2 locator。导入先校验完整父子图，再按 root → reply 顺序幂等合并。缺少索引的旧备份仍不会恢复评论。


## 精确锚点与 marker 契约（P2）

### 读写版本

- **生产 writer 只写 V2**：App 由 `createAppCommentSelectionSource()` 注入 `{sourceRoot, scrollRoot}`，Inpage 由 content entrypoint 注入 selection/document source；两者都调用 `captureCommentAnchor()`。
- **reader 兼容 V1/V2**：V1 仅保留历史 exact quote/position 语义；V1 的 `env` 是历史字段，不作为运行时硬拒绝条件。V2 使用 `dom-text-v2`、boundary path、position、quote/context、root evidence 与可选 document-relative root path。
- UI 展示 quote 可以截断；locator 中的 canonical exact/context 不得使用展示层截断值。

### Surface roots 与 exact-only 解析

- UI/entrypoint 是 DOM owner。service 只接收注入的 Range、selection 或候选 roots，不读取 `document`、`body` 或 panel DOM。
- App 只使用当前 detail surface 的显式 `{sourceRoot, scrollRoot}`。Inpage capture 从当前 selection 推导最小稳定 root；locate 在没有 selection 时按 document-relative path/root evidence 枚举最多 8 个受限候选 root。
- `resolveCommentAnchor()` 在全部候选 root 上收集结果；只有一个全局唯一 exact Range 时返回成功。不存在、root evidence 不匹配、quote 歧义、跨 root 歧义或预算超限都返回明确 reason，不做模糊文本、块级元素或正文根回退。
- 默认预算为最多 8 个 roots、累计 400,000 个 DOM text-model 字符；generation 或 AbortSignal 变化会中止旧解析。

### 滚动、markers 与 teardown

- 显式定位通过 `comment-anchor-controller` → `resolveCommentAnchor()` → `scrollExactCommentRange()`。滚动只基于精确 Range，并按内到外的嵌套滚动容器应用最小垂直位移；尊重 reduced-motion。
- 面板打开且 snapshot 中存在可定位 root comment 时建立 passive markers；显式定位/激活后对应 marker 切换为 active。marker 使用 Range client rects，不给父元素添加 outline、背景或属性。
- comments 更新会移除已不存在的 marker；panel close/reset、root generation 变化和 cleanup/dispose 都会取消旧解析并清空 marker layer/listeners。
- 失败 reason 映射到既有 notice；`aborted` 属于被新 generation 取代，不显示错误。

### 明确非目标

- 不实现 Notion 参考截图中页面正文旁的悬浮评论卡片。
- 不保存跨页面、跨刷新或脱离评论面板生命周期的永久 marker。
- 不使用固定 sleep/retry、按文本位置比例滚动、父元素高亮、环境字段硬拒绝或 first-success root 策略。

## React 架构

### 组件结构

```
ThreadedCommentsPanel (React Component, ~810 行)
├── Composer (根评论输入框)
│   ├── textarea (commentText)
│   ├── send button (带防重入保护)
│   └── loading state (actionInFlightRef)
├── CommentThread (根评论 + 回复列表)
│   ├── CommentItem
│   │   ├── 评论文本 / locator 引用
│   │   ├── 回复按钮 / 删除按钮（二次确认，内联实现）
│   │   └── Chat with AI 菜单（内联实现，非独立组件）
│   └── ReplyComposer (回复输入框)
│       ├── textarea (replyText)
│       └── send button (自动聚焦+滚动)
└── [内联删除确认 UI]
    ├── armedDeleteId 状态控制 CSS 类切换
    └── confirm / cancel 按钮

注意：删除确认和 Chat with AI 菜单都不是独立组件，而是内联在 ThreadedCommentsPanel 中通过状态控制。
```

### Panel Store 模式

```typescript
// panel-store.ts 提供外部 store，桥接到 React
interface CommentsPanelState {
  open: boolean;
  busy: boolean;
  quoteText: string;
  comments: ArticleComment[];
  handlers: CommentsHandlers | null;
  focusComposerSignal: number;
  escapeSignal: number; // Escape 键信号，用于关闭菜单/确认
  noticeMessage: string | null; // 提示消息
  noticeVisible: boolean; // 提示可见性
  hasFocusWithinPanel: boolean; // 面板内焦点跟踪
  pendingFocusRootId: string | null;
}

// 使用 useSyncExternalStore 连接
const snapshot = useSyncExternalStore(panelStore.subscribe, panelStore.getSnapshot);

// panel.ts (~470 行) 还负责：
// - dock 控制器集成
// - sidebar resize 处理
// - shadow DOM 事件桥接（快捷键提交、Escape 处理、focus tracking）
// - chatWithMenuController 集成
// - notice 自动消失计时器
```

### 防重入保护

```typescript
// 所有异步操作都通过 runBusyTask 包装
const runBusyTask = async <T>(task: () => Promise<T>): Promise<T> => {
  if (actionInFlightRef.current) return; // 防止并发
  actionInFlightRef.current = true;
  try {
    return await task();
  } finally {
    actionInFlightRef.current = false;
  }
};

// 删除操作使用 armedDeleteId 模式
const handleDelete = (commentId: string) => {
  if (armedDeleteId === commentId) {
    // 第二次点击，执行删除
    runBusyTask(() => handlers.deleteComment(commentId));
    setArmedDeleteId(null);
  } else {
    // 第一次点击，进入确认状态
    setArmedDeleteId(commentId);
  }
};
```

## 运行流程

### 文章详情页

1. `ArticleCommentsSection.tsx` 根据 `canonicalUrl` 读取评论列表，传递给 `ThreadedCommentsPanel`。
2. React 组件使用 panel store 管理状态，监听 `UI_EVENT_TYPES.CONVERSATIONS_CHANGED` 刷新。
3. 新评论和回复通过 `runBusyTask` 写入 IndexedDB，防止并发竞态。
4. 删除操作使用二次确认模式（`armedDeleteId`），防止误操作。
5. 发送后自动聚焦并滚动到目标 reply 输入框（`pendingReplyFocusRootIdRef`）。

### Inpage comments panel

1. 用户从页面内入口打开评论面板（例如双击 inpage 保存按钮打开评论侧边栏）。
2. content entrypoint 注入 selection/document source；UI 从选区推导 capture root，生成 display quote 与 V2 locator，service bootstrap 不直接读取 DOM。
3. 若 article 还没建立 conversation，系统先捕获/解析 article，再附着 orphan 评论。
4. 面板的 open / close / quote / focus / busy 状态由 `comment-sidebar-session.ts` 统一调度。
5. React 组件通过 shadow root 渲染，与页面样式隔离。

### 评论级 Chat with AI

1. 用户点击评论项的 Chat with AI 菜单，选择目标平台。
2. `chatwith-comment-actions.ts` 构建 payload：该评论 + 所有回复 + 可选 article 上下文。
3. 内容渲染为 Markdown，按 `maxChars` 截断后复制到剪贴板。
4. 打开目标 AI 平台网站，用户手动粘贴提交。

## 消息契约

| 契约 | 作用 | 依赖方 |
| --- | --- | --- |
| `COMMENTS_MESSAGE_TYPES.ADD_ARTICLE_COMMENT` | 新增评论 / 回复 | `ThreadedCommentsPanel`, inpage comments panel |
| `COMMENTS_MESSAGE_TYPES.LIST_ARTICLE_COMMENTS` | 读取评论列表 | article detail, inpage comments panel |
| `COMMENTS_MESSAGE_TYPES.DELETE_ARTICLE_COMMENT` | 删除评论 | article detail, inpage comments panel |
| `COMMENTS_MESSAGE_TYPES.ATTACH_ORPHAN_ARTICLE_COMMENTS` | 把先前无 conversation 的评论附着到 article | inpage comments panel |
| `COMMENTS_MESSAGE_TYPES.MIGRATE_ARTICLE_COMMENTS_CANONICAL_URL` | 迁移评论的 canonical URL | background handlers，用于 URL 归一化 |
| `CONTENT_MESSAGE_TYPES.OPEN_INPAGE_COMMENTS_PANEL` | 打开页面内评论面板 | content controller（双击 inpage 按钮）/ context menu / content bridge |

- 评论相关消息通过 background handlers 统一落库，而不是直接在 UI 中操作 IndexedDB。
- `COMMENTS_MESSAGE_TYPES.LIST_ARTICLE_COMMENTS` 支持按 `canonicalUrl` 或 `conversationId` 读取。
- `UI_EVENT_TYPES.CONVERSATIONS_CHANGED` 会在新增 / 附着评论后广播，用来刷新 article detail。

## 聚焦规则

| 场景 | 行为 | 实现 |
| --- | --- | --- |
| 保存根评论后 | 返回 `createdRootId`（如果 onSave 结果中包含），用于聚焦新创建的评论 | `resolveTargetRootIdFromSaveResult` 返回 `createdRootId` 或 null |
| 回复评论后 | 自动聚焦并滚动到被回复的评论输入框 | `resolveTargetRootIdForReply` 返回目标 rootId |
| 删除评论后 | 聚焦到相邻评论或输入框 | `resolvePendingFocusTarget` 查找就近的可用目标 |
| Escape 键 | 关闭删除确认/菜单，保留输入框文本 | `escapeSignal` + `useLayoutEffect` 监听，使用 `lastHandledEscapeSignalRef` 去重 |

**Escape 信号处理**：`ThreadedCommentsPanel` 同时监听 Escape 键关闭删除确认和 Chat with AI 菜单，通过 `lastFocusedComposerSignalRef` 和 `lastHandledEscapeSignalRef` 防止重复处理。

## 测试与回归

| 文件 | 覆盖点 | 说明 |
| --- | --- | --- |
| `tests/storage/article-comments-idb.test.ts` | add / list / delete / replies / orphan attachment | 存储回归入口 |
| `tests/comments/panel-focus-rules.test.ts` | 聚焦规则解析 | 覆盖保存后聚焦、回复后聚焦、pending focus |
| `tests/smoke/comments-panel-react.test.ts` | React 组件冒烟 | 验证 mount/unmount、防重入、删除确认 |

- 评论线程改动至少要跑 `tests/storage/article-comments-idb.test.ts`。
- 若涉及 article comments 或 inpage 面板，建议再做一次 article detail + 页面内面板的人工冒烟。
- 备份 / 导入现在覆盖 `article_comments`；如果你在做恢复链路改动，要验证 `assets/article-comments/index.json` 与 `counts.article_comments` 都能正确往返。
- **React 迁移后**：legacy DOM 渲染已删除，不要再调用 `threaded-comments-panel.ts` 的旧 render 函数。

## 修改热点

| 要改什么 | 先看哪里 | 会影响谁 |
| --- | --- | --- |
| 评论数据结构 | `storage-idb.ts`, `schema.ts`, `article-comments-idb.test.ts` | 存储层、备份、同步 |
| 评论 UI 交互 | `ThreadedCommentsPanel.tsx`, `panel-store.ts`, `focus-rules.ts` | React 组件、聚焦规则 |
| 删除确认逻辑 | `ThreadedCommentsPanel.tsx` 的 `armedDeleteId` 状态（内联实现） | 删除按钮、Escape 键处理 |
| 评论级 Chat with AI | `comment-chatwith-config.ts`, `chatwith-comment-actions.ts` | 平台选择、payload 构建 |
| 头部 Chat with AI 菜单 | `chatwith.ts` | article detail 头部菜单（非评论级） |
| 防重入保护 | `runBusyTask` + `actionInFlightRef` | 所有异步操作（保存/删除/回复） |
| 评论图同步到 Notion | `notion-comments-renderer.ts`, `comment-thread-graph.ts` | 根线程数、author、quote、locator/version digest 与评论区块 |
| 评论图同步到 Obsidian | `obsidian-markdown-writer.ts`, `comment-thread-graph.ts` | frontmatter + Markdown 章节使用同一 roots/replies 排序 |
| 备份 / 恢复评论线程 | `export.ts`, `import.ts`, `backup-utils.ts` | Zip v2 归档 |
| article detail UI | `ArticleCommentsSection.tsx`（支持 sidebar/embedded 两种模式） | 评论列表刷新 |
| 页面内评论面板 | `inpage-comments-panel-shadow.ts`, `comment-sidebar-session.ts` | shadow root、侧边栏状态、评论级 Chat with AI 上下文 |
| 消息契约 | `message-contracts.ts`, background handlers | UI / background / content 三端（含 MIGRATE_CANONICAL_URL） |
| panel.ts 桥接层 | `panel.ts`（~470 行） | dock 控制器、resize、shadow DOM 事件、notice 计时器 |

## P1 数据契约硬性规则

- runtime 跨边界只使用 `comment-dto.ts` 的 parser/serializer，禁止 UI、handler、adapter 自定义字段映射。
- 删除 root 时递归删除全部后代；新 reply 必须指向同上下文 root。
- canonical URL migration 必须携带 `conversationId`，只迁移该 conversation 与明确 orphan，不得改写同 URL 下其他 conversation。
- 新归档导出只写规范图；导入错误必须显式失败或记录 warning，禁止 silent cycle skip。
- 生产 writer 只写 V2；reader 继续兼容历史 V1。定位必须返回全局唯一 exact Range，失败时保留评论数据并只显示 notice。
