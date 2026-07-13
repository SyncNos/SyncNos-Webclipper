# 模块：文章评论 / 注释线程

## 职责

- 为 WebClipper 的 article 会话提供本地优先的 threaded comments（React 实现）。
- 允许用户在 article detail 或 inpage comments panel 中添加、回复、删除评论；根评论可保存版本化 `locator`。生产写入使用 V2，历史数据继续读取 V1；Range marker 只在评论面板生命周期内存在，不做跨页面持久高亮。
- 当前定位是**local-first 注释层**：它是 article 会话的一部分，会在 article 同步时进入 Notion / Obsidian 的评论区段（含根评论数统计），并继续跟随 Zip v2 备份 / 导入保留。
- React surface 采用稳定单次 mount：`panel.ts` 负责宿主、dock/resize、marker 与 lease 生命周期；可变讨论状态由 ViewModel reducer 管理，外部 host 以原子 snapshot/actions 契约接入。

## 关键文件

| 路径 | 作用 | 为什么重要 |
| --- | --- | --- |
| `src/ui/comments/panel.ts` | React 桥接入口 | 组装 panel store、dock/resize、exact anchor controller、Range scroll 与 panel-scoped marker registry；DOM surface roots 由 UI/entrypoint 注入 |
| `src/ui/comments/react/ThreadedCommentsPanel.tsx` | React 编排层 | 组合 root/reply composer、thread/reply 展示、overflow、selection attachment、keyboard、notice 与 focus hooks；不直接拥有 host 数据加载状态 |
| `src/ui/comments/react/panel-store.ts` | host bridge store | 只合并 identity-aware host snapshot 与 panel-local notice/focus 字段；通过 `attachHost()` lease 原子切换宿主，旧 lease/dispose 幂等失效 |
| `src/services/comments/sidebar/article-comments-sidebar-controller.ts` | context/load/mutation state machine | 分类 same/attach-orphan/url-migrate/conversation-change；加载与迁移使用 generation + AbortSignal，失败进入 `stale_error` 并保留最后成功 comments |
| `src/viewmodels/comments/discussion-reducer.ts` / `useDiscussionPanel.ts` | 讨论 UI 状态真源 | 管理单 active root、root/reply drafts、menu/delete confirmation、focus intent 与 submit 状态；context key 变化时确定性 reset |
| `src/ui/comments/react/RootCommentComposer.tsx` / `ReplyComposer.tsx` | composer 边界 | 根评论 composer 常驻；任一时刻只挂载一个 active reply composer，切换 root 时 draft 保留 |
| `src/ui/comments/react/CommentThread.tsx` / `CommentReplyList.tsx` / `CommentReplyItem.tsx` | 只读展示边界 | 统一消费 canonical thread graph，不自行重建 parentId 图 |
| `src/ui/comments/react/CommentOverflowMenu.tsx` | React overflow | panel/root/reply 操作与可选 Chat with AI action 统一由 React 管理，不使用 imperative menu controller |
| `src/ui/comments/react/focus-rules.ts` / `use-comment-focus-intent.ts` | 聚焦规则与消费器 | 纯规则解析目标，hook 按 action epoch 一次性消费 composer/reply/menu focus intent |
| `src/services/comments/locator/capture-comment-anchor.ts` | V2 capture 用例 | 从经过边界校验的 Range 生成 canonical quote、position、boundary path、root evidence 与可选 document-relative root path |
| `src/services/comments/locator/resolve-comment-anchor.ts` | V1/V2 exact resolver | 在受限候选 roots 中执行历史 V1 或 V2 path/position/quote 策略；只有全局唯一 exact Range 才成功 |
| `src/ui/comments/comment-anchor-controller.ts` | 定位生命周期控制器 | 用 generation + AbortSignal 取消旧解析，协调 passive/active marker，并在 panel 关闭或销毁时清理 |
| `src/ui/comments/range-scroll-controller.ts` / `range-marker-registry.ts` | Range 几何适配 | 对精确 Range 做嵌套滚动与矩形 marker；不高亮父元素 |

| `src/ui/comments/comment-chatwith-config.ts` | 评论级 Chat with AI 配置（~95 行） | 创建评论级 Chat with AI 配置对象 |
| `src/services/comments/domain/comment-thread-graph.ts` | 唯一评论图归一化 | 统一 roots/replies 排序，并确定性分类 orphan、cycle、duplicate；指标、列表、归档和同步派生不得自行重建父子图 |
| `src/services/comments/domain/comment-dto.ts` | runtime DTO 真源 | 统一 background/client/App/Inpage 的评论字段与 locator 解析 |
| `src/services/comments/domain/comment-archive.ts` | Zip 评论归档契约 | 兼容读取 V1，严格校验/写出 V2，提供 roots-first 幂等导入序列与 warnings |
| `src/services/comments/data/storage-idb.ts` | 评论存储层（~340 行） | 负责 `article_comments` 的本地读写、查询、附着 orphan 评论、canonical URL 迁移；**不计算** `commentThreadCount`（该逻辑在 `comment-metrics.ts`） |
| `src/services/comments/background/handlers.ts` | 评论消息路由（~120 行） | 注册 5 个评论消息路由：LIST、ADD、DELETE、ATTACH_ORPHAN、**MIGRATE_CANONICAL_URL**；ADD 操作中 `locator` 仅在根评论时保存 |
| `src/services/comments/client/repo.ts` | UI 侧客户端仓库（~60 行） | 给 React 组件提供 add / list / delete API |
| `src/ui/conversations/ArticleCommentsSection.tsx` | article detail sidebar 接入 | 只接入显式 sidebar surface roots 与共享 runtime，不保留 embedded 双轨 |
| `src/ui/inpage/inpage-comments-panel-shadow.ts` | inpage comments 面板壳（~250 行） | 让页面内评论面板运行在独立 shadow root 中；新增 `resolveInpageCommentChatWithContext` 和 `createInpageChatWithOpenPort` |
| `src/services/comments/sidebar/comment-sidebar-session.ts` | 原子 host session | 暴露 serializable snapshot、稳定 actions 与 identity-aware panel lease；open/close、attachment、focus 与 host 更新通过单一会话发布 |
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

## React 架构（P3）

### Context 与 host 状态机

- `AppShell` / Inpage bootstrap 各自只创建一个 sidebar controller；`ArticleCommentsSection` 不再拥有第二份评论 context。
- context identity 是 `[canonicalUrl, conversationId]`。`comment-context-transition.ts` 将变化分类为 `same`、`attach-orphan`、`url-migrate`、`conversation-change` 或 `invalid`。
- load/migrate 每次创建新的 generation 与 `AbortSignal`；新 context、refresh 或 dispose 会取消旧操作，旧 completion 不得覆盖新 identity。
- load snapshot 状态为 `idle | loading | ready | stale_error`。`stale_error` 保留最后成功的 comments，并单独暴露错误，不用空数组伪装失败。
- save/reply/delete 使用 mutation generation；context 切换和 dispose 后，晚到 mutation completion 不再清空 attachment、刷新旧 context 或写回 session。

### Atomic snapshot/actions 与 lease

```typescript
interface CommentSidebarHost {
  getSnapshot(): CommentSidebarHostSnapshot;
  subscribe(listener: () => void): () => void;
  actions: CommentSidebarHostActions;
}

interface CommentSidebarPanelApi {
  attachHost(host: CommentSidebarHost): { dispose(): void };
}
```

- host snapshot 一次性携带 `open`、`busy`、`composerAttachment`、`comments`、`focusComposerSignal` 与 `lastOpenSource`；React 不通过一组命令式 setter 拼装半成品状态。
- actions 是稳定对象，内部在调用时读取最新 callbacks，避免 stale closure。
- `attachHost()` 返回 identity-aware lease；重复 dispose 安全，旧 lease 无权释放后来挂载的 host。
- panel store 只拥有 notice/focus 等纯 panel-local 字段，并与 host snapshot 合成渲染快照。

### Discussion reducer 与组件边界

```
ThreadedCommentsPanel (orchestrator)
├── RootCommentComposer
│   └── CommentQuotePreview
├── CommentThread[]
│   ├── CommentReplyList
│   │   └── CommentReplyItem[]
│   └── ReplyComposer (only for activeRootId)
└── CommentOverflowMenu (panel/root/reply)
```

- `discussionReducer` 是 drafts、`activeRootId`、open menu、delete confirmation、focus intent 与 submit 状态的唯一可变真源；context key 变化执行 reset。
- `normalizeCommentThreadGraph()` 是 roots/replies 唯一归一化入口，orphan/cycle/duplicate 的确定性规则不会在 UI 重写。
- root draft 与各 root 的 reply draft 相互独立；切换 active root 不丢 draft，但同时只挂载一个 `ReplyComposer`。
- selection attachment、optional actions、keyboard、notice 和 focus 分别由独立 hook 管理；`ThreadedCommentsPanel` 只负责编排。
- Cmd/Ctrl+Enter 由当前 composer 唯一处理。Escape 由 React keyboard controller 按 menu → delete confirmation → active reply → panel 的顺序处理，不经过 panel/store relay。
- notice timer 与 focus intent 都在 React 生命周期内消费；action epoch 保证每个 focus intent 只执行一次。

### Stable mount 与 teardown

- `panel.ts` 对每个 panel 只创建一个 React root；host/context 更新通过 external store，不以 remount 代替状态迁移。
- dock、resize、anchor marker、host lease 和 React root teardown 都是幂等的；任一 cleanup 失败不会阻止其余资源释放。
- close/reset/dispose 会取消 active load、migration、selection resolution、optional action 与 anchor resolution，并清理 marker/listeners。

## 运行流程

### 文章详情页

1. `AppShell` 持有唯一 sidebar runtime/controller，并把当前 article identity 与显式 `{sourceRoot, scrollRoot}` 交给评论入口。
2. controller 分类 identity transition；必要时先 attach orphan 或迁移 canonical URL，再以可取消 operation 加载 comments。
3. session 原子发布 host snapshot；React external store 消费 snapshot/actions，discussion reducer 管理本地交互状态。
4. 新评论、回复和删除经 controller mutation generation 写入；只有仍属于当前 identity 的 completion 才触发 refresh 与 focus intent。
5. active root 同步 exact marker 状态；显式引用定位才执行 Range resolve/scroll。

### Inpage comments panel

1. content entrypoint 持有页面 DOM、selection、frame 与 URL 读取，并把纯数据/候选 roots 注入 service/controller。
2. 若 article 尚无 conversation，controller 先 ensure context，再 attach orphan；identity 变化遵循同一 transition state machine。
3. shadow panel 复用同一 host/session、discussion reducer 和 exact marker 生命周期，不维护 embedded 变体。
4. SPA context 变化、panel close 或 content teardown 会取消旧 generation 并幂等释放 lease、dock、resize、marker 与 React root。

### 评论级 Chat with AI

1. panel/root overflow 由 `CommentOverflowMenu` 渲染；可选 AI action 由 `useCommentOptionalActions` 延迟准备。
2. `chatwith-comment-actions.ts` 构建评论线程与可选 article context payload。
3. optional action hook 使用 generation 丢弃 unmount/context 切换后的晚到结果，错误通过既有 notice 展示。
4. payload 按 provider 配置复制并打开目标平台，评论事实与 draft 不受 action 失败影响。

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

## 聚焦与键盘规则

| 场景 | 行为 | 实现 |
| --- | --- | --- |
| 保存根评论后 | 若返回 `createdRootId`，切换 active root 并请求聚焦该 root 的 reply composer | `resolveTargetRootIdFromSaveResult` + reducer focus intent |
| 回复评论后 | 保留 active root，清空该 root draft，并请求重新聚焦其 reply composer | `resolveTargetRootIdForReply` + `useCommentFocusIntent` |
| 菜单打开 | 聚焦对应 panel/root/reply trigger 或 menu surface；关闭后回到触发点 | reducer `focus-menu` + trigger refs |
| Cmd/Ctrl+Enter | 只由当前 composer 提交一次 | `useDiscussionKeyboard` / composer keydown |
| Escape | 依次关闭 menu、delete confirmation、active reply、panel | `useDiscussionKeyboard`，无 store relay |
| notice | 可见期结束后只消费一次 expired callback | `useCommentNotice` |

## 测试与回归

| 范围 | 代表性测试 |
| --- | --- |
| context transition / load / migration / stale completion | `tests/unit/comment-context-transition.test.ts`, `tests/unit/article-comments-sidebar-controller*.test.ts` |
| atomic snapshot/actions/lease | `tests/unit/comment-sidebar-session*.test.ts`, `tests/unit/threaded-comments-panel-store*.test.ts` |
| discussion reducer / draft / active reply | `tests/unit/discussion-reducer.test.ts`, `tests/unit/threaded-comments-panel-active-reply.test.ts` |
| selection / keyboard / focus / notice | `tests/unit/threaded-comments-panel-auto-attach-selection.test.ts`, `threaded-comments-panel-shortcuts.test.ts`, `threaded-comments-panel-focus-regression.test.ts` |
| overflow / optional AI action / delete confirmation | `tests/unit/threaded-comments-panel-comment-chatwith.test.ts`, `threaded-comments-panel-delete-confirm.test.ts` |
| stable mount / teardown | `tests/unit/comments-panel-resize-lifecycle.test.ts`, `tests/unit/comments-sidebar-responsive.test.ts`, `tests/smoke/inpage-comments-sidebar-toggle.test.ts` |

- UI 交互测试通过 `comment-sidebar-panel-driver.ts` 挂载真实 host snapshot/actions，不恢复旧的命令式 panel setter 契约。
- phase Gate 至少包含目标 comments 测试、`npm run compile`、`npm run build`、分层扫描和旧实现红线扫描。
- 全量测试应分片、低并发执行；任何 feature 外失败必须保留具体文件与错误证据，不能伪装为通过。

## 修改热点

| 要改什么 | 先看哪里 | 会影响谁 |
| --- | --- | --- |
| context / load / mutation 生命周期 | `article-comments-sidebar-controller.ts`, `comment-context-transition.ts` | App、Inpage、迁移、stale completion |
| host snapshot/actions/lease | `comment-sidebar-session.ts`, `comment-sidebar-state.ts`, `panel-store.ts` | React bridge、identity 切换、teardown |
| discussion state | `discussion-reducer.ts`, `useDiscussionPanel.ts` | active root、draft、menu/delete、submit/focus |
| composer / thread 展示 | `RootCommentComposer.tsx`, `ReplyComposer.tsx`, `CommentThread.tsx`, `CommentReply*.tsx` | 单 active reply、draft 保留、可访问性 |
| selection / keyboard / notice / focus | 对应 `use-comment-*` 与 `use-discussion-keyboard.ts` | DOM 事件所有权和一次性消费 |
| overflow / optional AI action | `CommentOverflowMenu.tsx`, `useCommentOptionalActions.ts` | panel/root/reply action 与错误提示 |
| exact anchor / marker | `comment-anchor-controller.ts`, `range-scroll-controller.ts`, `range-marker-registry.ts` | active/passive marker 与 teardown |
| article detail UI | `ArticleCommentsSection.tsx`, `AppShell.tsx` | 显式 surface roots、唯一 context owner |
| Inpage shell | `inpage-comments-panel-shadow.ts`, bootstrap content handlers | shadow root、SPA context、selection source |

## P1 数据契约硬性规则

- runtime 跨边界只使用 `comment-dto.ts` 的 parser/serializer，禁止 UI、handler、adapter 自定义字段映射。
- 删除 root 时递归删除全部后代；新 reply 必须指向同上下文 root。
- canonical URL migration 必须携带 `conversationId`，只迁移该 conversation 与明确 orphan，不得改写同 URL 下其他 conversation。
- 新归档导出只写规范图；导入错误必须显式失败或记录 warning，禁止 silent cycle skip。
- 生产 writer 只写 V2；reader 继续兼容历史 V1。定位必须返回全局唯一 exact Range，失败时保留评论数据并只显示 notice。
