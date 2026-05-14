# 仓库指南

本仓库以 WebClipper（浏览器扩展）为活动主线；Apple 客户端与 CLI 已拆分至独立仓库：

- iOS: `SyncNos/SyncNos-Health`
- macOS: `SyncNos/SyncNos-booknotes`
- CLI: `SyncNos/SyncNos-CLI`

## 项目结构

```
SyncNos-Webclipper/
├── src/                         # WebClipper 逻辑与 UI
├── public/                      # 静态资源
├── tests/                       # 单测
├── cloudflare-workers/          # Notion OAuth worker
├── .github/                     # 开发指南、deepwiki 与 CI
└── README.md
```

## 构建与运行

```bash
npm install              # 安装 WebClipper 依赖
npm run dev              # 启动 WebClipper Chrome 开发模式
npm run build            # 构建 WebClipper Chrome 产物
npm run compile          # TypeScript 编译检查
npm run test             # 单元测试
npm run check            # 产物校验
```

## 核心规范

| 规范 | 路径 |
| --- | --- |
| 仓库总览 | `README.md` |
| deepwiki 总入口 | `.github/deepwiki/INDEX.md` |
| deepwiki 业务入口 | `.github/deepwiki/business-context.md` |
| 本文档（统一入口） | `AGENTS.md` |
| WebClipper UI 规范 | `src/ui/AGENTS.md` |

## 开发工作流

### 先判断产品线

- 开始任何仓库级理解、规划、评审或文档改动前，先读 `.github/deepwiki/business-context.md`；需要继续展开时，再从 `.github/deepwiki/INDEX.md` 进入对应专题页。
- 一般情况下不需要全量通读 `.github/deepwiki/`；按 `.github/deepwiki/INDEX.md` 导航到最小必要页面即可。
- 修改扩展代码时，优先查看 `.github/deepwiki/modules/webclipper.md` 与本文档（`AGENTS.md`），先确认变更属于 `background`、`content`、`popup` 还是 `app`。
- iOS/macOS 相关内容已迁移到独立仓库，本仓库不再承载 Apple 客户端代码更新。
- 若改动影响共享业务说明或仓库级入口文档，代码确认后同步更新相关 `AGENTS.md`、`.github/deepwiki/INDEX.md`、`.github/deepwiki/business-context.md` 与 `README.md`。

### WebClipper 工作流

1. 先确认职责边界：采集逻辑放 `collectors/content`，持久化与路由放 `background`，界面交互放 `popup` / `app`。
2. 权限、content scripts、消息协议、构建产物变更要同时检查 `wxt` 入口、manifest 结果与 CI 脚本是否一致。
3. Settings / Conversations UI 改动时，不要只改单个组件；同时核对这些真源：
   - `src/viewmodels/settings/types.ts`（section 分组与顺序）
   - `src/viewmodels/settings/useSettingsSceneController.ts`（`inpage_display_mode` / `ai_chat_auto_save_enabled` / `ai_chat_dollar_mention_enabled` / `ai_chat_cache_images_enabled` / `web_article_cache_images_enabled` / `chat_with_*`）
   - `src/ui/settings/sections/InpageSection.tsx`（`markdown_reading_profile_v1` / `anti_hotlink_rules_v1`）
   - `src/viewmodels/settings/insight-stats.ts`（Insight 统计口径）
   - `src/services/integrations/chatwith/chatwith-settings.ts`（Chat with AI 模板 / 平台 / 截断）
   - `src/services/integrations/item-mention/**`（`$ mention`：站点门控、候选搜索、插入载荷构建）
   - `src/ui/styles/tokens.css`（主题 token：仅跟随 `prefers-color-scheme`）
   - `src/ui/shared/SelectMenu.tsx`（source/site 筛选菜单的 `adaptiveMaxHeight` 与可视区域计算）
   - `src/ui/popup/PopupShell.tsx` / `src/ui/app/AppShell.tsx`（列表统计跳转 Insight 的路由入口）
   - `src/ui/conversations/ConversationListPane.tsx` / `pending-open.ts`（来源筛选持久化与窄屏 detail bridge）
   - `src/viewmodels/conversations/conversations-context.tsx` / `DetailHeaderActionBar.tsx` / `DetailNavigationHeader.tsx`（详情头 `open / tools` 槽位分发与窄屏一致性；`tools` 仅用于本地工具动作（例如 cache-images），不包含 Chat with）
   - `src/ui/comments/react/ThreadedCommentsPanel.tsx` / `src/services/integrations/chatwith/chatwith-comments-header-actions.ts`（Chat with 仅归属评论侧栏：sidebar header + comment-level）
4. 默认验证顺序使用：
   - `npm run compile`
   - `npm run test`
   - `npm run build`
5. 若改动涉及 Firefox、发布打包、manifest/content script 重写或产物完整性，再补：
   - `npm run build:firefox`
   - `npm run check`
6. 发布包与 AMO Source 包由 GitHub Actions 和 `.github/scripts/webclipper/*.mjs` 负责，本地以开发验证为主。
7. 如果改动的是视频字幕采集，再额外核对 `src/services/bootstrap/video-transcript-capture.ts`、`src/services/bootstrap/video-transcript-capture-content-handlers.ts`、`src/entrypoints/video-transcript-*.content.ts`、`src/collectors/video/**`、`src/platform/context-menus/clipper-context-menu.ts`、`src/services/protocols/conversation-kinds.ts` 与 `src/ui/settings/sections/VideosSection.tsx`。

## WebClipper 分层与契约（必须遵守）

### 项目结构（分层）

- `src/ui/**`：UI（popup/app/inpage），只放组件/样式/DOM 面板；设置页由 `src/ui/settings/SettingsScene.tsx` 统筹；Inpage 相关设置集中在 `src/ui/settings/sections/InpageSection.tsx`；视频字幕采集入口集中在 `src/ui/settings/sections/VideosSection.tsx`
- `src/viewmodels/**`：ViewModel（hooks/context），只做 UI 状态编排与调用 service
- `src/services/**`：Service（用例/业务流程），承接平台交互与业务逻辑
- `src/platform/**`：平台适配（runtime/ports/storage/webext 等）
- `src/collectors/**`：站点采集规则（content-side DOM 解析）与视频字幕采集（YouTube / Bilibili subtitle bridge）

### 分层与依赖方向（强约束）

- 依赖方向：`ui -> viewmodels -> services -> (platform, domain, client, sync, shared, ...)`
- 禁止反向依赖：`services` 不得 import `ui/viewmodels`
- 禁止平台直连：`ui/**` 与 `viewmodels/**` 不得 import `platform/**`
- 业务与 UI 解耦：可复用业务算法/数据处理必须下沉到 `services/**`（或更底层的 domain/client 模块）

边界自检（手动）：

- `rg -n "src/platform|/platform/" src/ui`
- `rg -n "src/platform|/platform/" src/viewmodels`

### TypeScript 路径别名（约定）

- `@ui/*` -> `src/ui/*`
- `@viewmodels/*` -> `src/viewmodels/*`
- `@services/*` -> `src/services/*`
- `@platform/*` -> `src/platform/*`
- `@collectors/*` -> `src/collectors/*`
- `@entrypoints/*` -> `src/entrypoints/*`
- `@i18n/*` -> `src/ui/i18n/*`

自检（手动）：

- `rg -n "@platform/" src/ui src/viewmodels`

### UI 圆角规范（Concentric Radius）

- 圆角 token 真源：`src/ui/styles/tokens.css`（`--radius-outer/card/control/chip/inline/pill`）。
- UI 规范细则：`src/ui/AGENTS.md` 的 `B2.2 · 同心圆角分级`。
- 约束：新增样式禁止写裸 `border-radius: <px>`，默认使用 `--radius-*`；按钮禁止使用 `999px`/圆形语义，pill 仅用于非按钮元素。
- 白名单：`border-radius: 0`（reset）与 `src/ui/example.html`（示例页）可保留固定值，其余路径需收敛到 token。
- 扫描命令：
  - `rg -n "border-radius:\\s*[0-9]|tw-rounded-\\[" src/ui src/entrypoints`
  - `rg -n -- "--radius-" src/ui/styles/tokens.css`

### Markdown 阅读风格协议

- 协议真源：
  - `src/services/protocols/markdown-reading-profiles.ts`
  - `src/ui/shared/markdown-reading-profile-presets.ts`
  - `src/services/protocols/markdown-reading-profile-storage.ts`
- 存储键：`markdown_reading_profile_v1`
- 默认与回退：任何未知值都必须 `normalize -> medium`，禁止直接把脏值传入 UI。
- 扩展顺序：先改协议与测试，再加 preset，最后接 settings / 运行时消费链；不要直接在 `ChatMessageBubble` 写新分支。

### Anti-hotlink 规则协议

- 规则真源：
  - `src/platform/webext/anti-hotlink-rules-store.ts`
  - `src/services/integrations/anti-hotlink/anti-hotlink-settings.ts`
  - `src/ui/settings/sections/AntiHotlinkDomainsEditor.tsx`
- 存储键：`anti_hotlink_rules_v1`
- 默认规则（示例）：`cdnfile.sspai.com -> https://sspai.com/`、`sns-webpic-qc.xhscdn.com -> https://www.xiaohongshu.com/`
- 行为边界：当 article 图片命中规则时，抓取链路会自动补 referer 并缓存图片；即使 `web_article_cache_images_enabled` 关闭，也不能让主抓取失败。

### 会话分页与定位契约

- 会话列表主链路必须走分页接口：`bootstrap + loadMore`，禁止回退全量 `listConversations` 读取。
- `ConversationListPane` 的 near-bottom 自动加载由 sentinel + `IntersectionObserver` 触发；需要用 `loadingInitialList/loadingMoreList/listHasMore` 闸门防重入。
- 列表筛选与统计口径必须来自 provider 的 `listFacets/listSummary`，不要从当前已加载子集反推统计。
- `Select All` 仅作用“当前已加载且可见项”；批量 `Delete/Export/Sync` 提示文案必须明确同一范围语义。
- deep-link `loc`、Insight 跳转与外部打开必须走 provider 精确打开链路（`openConversationExternalByLoc/openConversationExternalBySourceKey/openConversationExternalById`），不能再依赖 `items.find()`。
- 窄屏 list/detail 桥接使用 `pending-open.ts` 的一次性 `sessionStorage` payload（`conversationId` 必填，可附带 `source + conversationKey`）；消费后立即删除，避免重复复用旧目标。

### 评论侧栏选区附加契约

- 行为边界（真源）：`src/ui/comments/react/ThreadedCommentsPanel.tsx` + `src/services/comments/sidebar/article-comments-sidebar-controller.ts`。
- 右侧评论侧边栏打开后，页面 `selectionchange` 会自动触发一次选区附加（`trigger: auto`），无需点击/聚焦输入框。
- reply 输入框不得触发附加或清空。
- 空选区语义：允许由 `selectionchange` 自动触发“清空引用（quote + locator）”；reply 交互不能污染引用区。
- 调整此行为时必须同时回归：
  - `tests/unit/threaded-comments-panel-auto-attach-selection.test.ts`
  - `tests/unit/article-comments-sidebar-controller.test.ts`
  - `tests/smoke/app-shell-comments-sidebar.test.ts`
  - `tests/smoke/inpage-comments-sidebar-toggle.test.ts`

### `$` mention（在其他 AI chats 输入框插入本地 item）

- 开关：`ai_chat_dollar_mention_enabled`（默认 `true`）。
- 支持站点真源：`src/collectors/ai-chat-sites.ts` 的 `SUPPORTED_AI_CHAT_SITES[].features.dollarMention === true`。
- 触发：输入框出现 `$` 即弹出候选窗；继续输入实时过滤。
- 候选：范围为本地 conversations（chat + article）；过滤字段固定为标题/来源/URL 域名；仅 `$` 时按最近保存时间倒序。
- 键盘：`↑/↓` 移动高亮，`Tab/Enter` 选中并插入，`Esc` 仅关闭候选窗且保留输入文本。
- 插入：替换本次触发片段（`$query`），并在光标位置插入；插入文本与“Copy full markdown”同源，且不做截断。

## 贡献约定

- 默认不查看、不编辑 i18n 字段（除非明确要求）。
- Commit message 用 Conventional Commits（如 `refactor:`/`feat:`/`fix:`），一次改动尽量做到可编译、可回滚。
- 重构优先拆成可独立验证的小步：每步至少跑 `npm run compile`。

### 文档同步工作流

1. 先从代码和脚本确认实际行为，再更新文档，不根据旧文档互相抄写。
2. 涉及仓库级行为变化时，优先同步这些入口文档：
   - `AGENTS.md`
   - `.github/deepwiki/INDEX.md`
   - `.github/deepwiki/business-context.md`
   - `README.md`
3. 若 WebClipper 改动涉及设置结构、视觉 tokens、主题模式或共享按钮/导航样式，再同步：
   - `src/ui/AGENTS.md`
   - `README.zh-CN.md`
4. 未被明确要求时，不要查看或编辑国际化字段。
5. 对版本号、DB 版本、权限、迁移等易过期事实，优先在 deepwiki 维护单一权威描述；其他入口文档只保留导航与原则，避免多处写死造成漂移。

## 常用命令

### WebClipper 开发与验证

- 安装依赖：`npm install`
- Chrome 开发模式：`npm run dev`
- Firefox 开发模式：`npm run dev:firefox`
- TypeScript 编译检查：`npm run compile`
- 单元测试：`npm run test`
- Chrome 构建：`npm run build`
- Firefox 构建：`npm run build:firefox`
- 产物校验：`npm run check`

### WebClipper 发布相关脚本

- Chrome/Firefox 发布产物打包：`node .github/scripts/webclipper/package-release-assets.mjs`
- AMO Source 包：`node .github/scripts/webclipper/package-amo-source.mjs`
- AMO 发布：`node .github/scripts/webclipper/publish-amo.mjs`
- Edge 发布：`node .github/scripts/webclipper/publish-edge.mjs`

## 测试

当前仓库无强制自动化测试套件，但功能改动需要完成以下验证：

- 单元测试优先覆盖 WebClipper 的核心逻辑（数据转换、状态变化、边界条件），通过协议 + 依赖注入 + Mock 隔离外部依赖。至少覆盖三类场景：数据转换、状态变化、边界条件（空数据、重复数据、异常数据）
- 使用 React/Vitest 的组件或页面预览做 UI 人工验证，至少覆盖加载态、错误态、空态和主流程态。
- 每次改动后执行最小冒烟：扩展可启动、关键数据源可读取、至少一次采集或同步成功、失败路径提示正确。
- 构建校验命令：`npm run compile && npm run test && npm run build`。
