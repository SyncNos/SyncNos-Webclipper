# 模块：WebClipper

## 职责

- 从支持 AI 站点采集对话、从普通网页抓正文、从视频页采集字幕，并把结果先写入本地浏览器数据库。
- 提供 popup / app / inpage / settings(videos) 四类用户入口，让用户进行保存、导出、备份、Notion 同步、Obsidian 同步、Feishu(DocX) 同步与设置管理。
- 通过 MV3 的 background + content + popup + app 分层，保持“采集、持久化、同步、展示”边界清晰。

## 关键文件

| 路径 | 作用 | 为什么重要 |
| --- | --- | --- |
| `src/entrypoints/background.ts` | 后台 service worker 入口 | 注册 router、handlers、OAuth listener、sync orchestrators |
| `src/entrypoints/content.ts` | 内容脚本入口 | 组装 collectors registry、inpage UI、runtime observer |
| `src/services/bootstrap/content.ts` | inpage runtime gating | 决定 `inpage_display_mode`（兼容旧 `inpage_supported_only`）与支持站点如何影响 UI 启动 |
| `src/services/bootstrap/current-page-capture.ts` | 当前页抓取服务 | 统一判断当前标签页可否抓取，并区分 chat / article 两条手动抓取路径 |
| `src/services/bootstrap/content-controller.ts` | 自动 / 手动保存控制器 | 单击保存、双击打开页面内评论侧边栏（inpage comments panel）、article fetch、Google AI Studio 手动保存都在这里 |
| `src/services/bootstrap/video-transcript-capture.ts` | 视频字幕采集服务 | 把 YouTube / Bilibili 已加载字幕格式化为 video conversation |
| `src/services/bootstrap/video-transcript-capture-content-handlers.ts` | 视频字幕消息处理器 | 连接右键菜单、空字幕提示与 capture service |
| `src/platform/webext/anti-hotlink-rules-store.ts` | 反防盗链规则真值与 referer 映射 | 维护 `anti_hotlink_rules_v1`，为图片下载代理和 article fetch 提供 domain → referer 规则 |
| `src/services/integrations/anti-hotlink/anti-hotlink-settings.ts` | 反防盗链设置读写与验证 | 把 Settings 面板里的规则编辑、校验、reset/restore 接到本地存储 |
| `src/services/protocols/markdown-reading-profiles.ts` | Markdown 阅读风格协议 | 定义 Medium / Notion / Book 三档阅读样式的规范与回退 |
| `src/ui/shared/markdown-reading-profile-presets.ts` | Markdown 阅读风格 preset | 为 popup / app 详情页提供 profile 预设与渲染入口 |
| `src/entrypoints/video-transcript-interceptor.content.ts` | 视频字幕拦截器 | 在 MAIN world 下拦截字幕请求并收集页面 meta |
| `src/entrypoints/video-transcript-bridge.content.ts` | 视频字幕桥接存储 | 暂存被拦截的字幕响应与 meta |
| `src/collectors/video/` | 视频字幕解析器 | 解析 YouTube / Bilibili 字幕格式并生成 cue 列表 |
| `src/services/integrations/chatwith/chatwith-settings.ts` | Chat with AI 配置与模板渲染 | 管理 prompt 模板、平台列表、最大字符数和复制载荷 |
| `src/services/integrations/chatwith/chatwith-detail-header-actions.ts` | Chat with AI 详情头动作解析 | 决定哪些平台按钮出现、复制什么 payload、何时跳转 |
| `src/services/integrations/item-mention/` | `$` mention 插入能力 | 在支持的 AI chat 输入框内通过 `$` 过滤本地 item 并插入同源 Markdown（站点门控真源：`src/collectors/ai-chat-sites.ts` 的 `features.dollarMention`） |
| `src/ui/inpage/inpage-item-mention-shadow.ts` | `$` mention 候选窗壳 | 候选窗运行在独立 shadow root 中，支持键盘高亮与点击选中 |
| `src/services/integrations/detail-header-action-types.ts` | 详情头动作槽位契约 | 定义 `open / tools` 两类槽位，约束 popup / app 的动作分发（Chat with AI 也复用 `tools`） |
| `src/ui/i18n/index.ts` | 扩展内 UI 文案入口 | 按 `navigator.language` 在英文 / 中文翻译表间切换 |
| `src/collectors/` | 站点采集适配器 | 新 AI 站点通常从这里扩展 |
| `src/services/conversations/data/storage-idb.ts` | 本地会话数据层 | 承载 IndexedDB 事实源 |
| `src/services/conversations/background/handlers.ts` | 会话消息与图片回填路由 | 控制 `SYNC_CONVERSATION_MESSAGES` 的图片内联与 `BACKFILL_CONVERSATION_IMAGES` 消息处理 |
| `src/services/conversations/background/image-backfill-job.ts` | 历史消息图片补全任务 | 复扫 conversation 消息并按 diff 增量回写 `contentMarkdown` |
| 评论相关文件 | 文章评论 / inpage panel / 侧边栏会话 | 详见 [modules/comments.md](comments.md) |
| `src/platform/idb/schema.ts` | DB schema 与迁移 | 处理 NotionAI stable key migration、`article_comments`（v7 引入）与 list pagination indexes（DB_VERSION = 8） |
| `src/services/sync/notion/notion-sync-orchestrator.ts` | Notion 同步编排 | 控制 DB / page / cursor / rebuild |
| `src/services/sync/notion/auth/oauth.ts` | Notion OAuth | 处理 code exchange、state 校验、timeout/retry，并维护 OAuth 连接中的本地状态 |
| `src/services/sync/notion/auth/token-store.ts` | Notion token store | 统一读写 / 清理 `notion_oauth_token_v1`，供 background handlers 与 orchestrator 使用 |
| `src/services/sync/notion/notion-parent-pages.ts` | Notion Parent Page 发现 | 通过 `/v1/search` 分页拉取可用 parent pages，并解析已保存 page id 的可用性 |
| `src/services/sync/notion/settings-background-handlers.ts` | Notion 设置路由 | 实现 `GET_AUTH_STATUS / LIST_PARENT_PAGES / DISCONNECT`，将 UI 请求转换为 Notion API 调用并输出稳定错误形态 |
| `src/services/sync/obsidian/obsidian-sync-orchestrator.ts` | Obsidian 同步编排 | 控制 append / rebuild / rename / fallback |
| `src/services/sync/feishu/feishu-sync-orchestrator.ts` | Feishu(DocX) 同步编排 | 控制 DocX 创建与写入、token refresh、sync mapping 持久化与 job snapshot |
| `src/services/sync/feishu/auth/oauth.ts` | Feishu OAuth | 处理授权页跳转、state 校验、code exchange/refresh（可直连或通过 worker proxy；未配置 `client_secret` 时走 proxy） |
| `src/services/sync/feishu/auth/token-store.ts` | Feishu token store | 统一读写 / 清理 `feishu_oauth_token_v1`，供 background handlers 与 orchestrator 使用 |
| `src/services/sync/feishu/settings-background-handlers.ts` | Feishu 设置路由 | 实现 `GET_AUTH_STATUS / DISCONNECT`，将 UI 请求转换为 token-store / sync orchestrator 读取 |
| `src/ui/settings/SettingsScene.tsx` | 设置页总入口 | 管理 Notion、Feishu、Notion AI、Obsidian、Backup、Chat with AI、Inpage、About You（含 Insight 统计）、About Me；Inpage 里包含阅读风格与 anti-hotlink 设置 |
| `src/viewmodels/settings/useSettingsSceneController.ts` | 设置页状态控制器 | 统一管理存储读写、连接状态、备份动作，并按需懒加载 About You（Insight 统计） |
| `src/viewmodels/settings/insight-stats.ts` | Insight 聚合引擎 | 从 IndexedDB 的 `conversations` + `messages` 现算本地 clip 统计 |
| `src/ui/settings/sections/InsightSection.tsx` | Insight 状态容器 | 管理 loading / error / empty / populated 四类状态 |
| `src/ui/settings/sections/InsightPanel.tsx` | Insight 统计视图 | 用 `recharts` 渲染来源分布、文章域名分布与 Top 3 conversation |
| `src/ui/styles/tokens.css` | 主题 tokens | 用 `prefers-color-scheme` 统一驱动亮/暗 token，popup / app / inpage 一致 |
| `src/ui/shared/SelectMenu.tsx` | 共享下拉菜单组件 | 统一选项菜单键盘行为，并在 `adaptiveMaxHeight` 打开时按可裁剪容器动态计算高度 |
| `src/ui/settings/sections/VideosSection.tsx` | 视频字幕设置页 | 解释支持范围、抓取步骤和失败提示 |
| `src/ui/conversations/ConversationListPane.tsx` | 列表筛选、批量动作与来源持久化 | 控制 `source filter`、列表底部统计（当日/总计）、导出/同步/删除菜单 |
| `src/ui/conversations/DetailNavigationHeader.tsx` | 窄屏详情头动作容器 | 让 popup / app 窄屏 detail header 与主详情页共用同一套动作槽位策略 |
| `src/ui/conversations/pending-open.ts` | 窄屏待打开会话桥接 | 让 Insight / 列表 / 路由在 narrow 模式下也能准确落到 detail |

## 运行时结构

| 运行时 | 主要职责 | 关键依赖 | 代表文件 |
| --- | --- | --- | --- |
| background | 消息路由、同步 job、设置处理、OAuth 监听 | router、sync orchestrators、settings handlers | `src/entrypoints/background.ts` |
| content | 页面观察、collector 识别、inpage UI、自动 / 手动保存 | collectors registry、runtime observer、incremental updater | `src/entrypoints/content.ts`, `src/services/bootstrap/content-controller.ts` |
| popup | 轻量会话 / 设置入口 | React 组件、ConversationsProvider | `src/entrypoints/popup/` |
| app | 扩展完整页面 UI | React Router、ConversationsScene、SettingsScene | `src/entrypoints/app/` |
| conversations | 本地事实源与 CRUD | IndexedDB、background handlers | `src/services/conversations/data/storage-idb.ts` |
| comments | article 详情评论线程与本地注释层 | IndexedDB、comments background handlers、inpage panel | `src/services/comments/`, `ArticleCommentsSection.tsx` |
| sync | Notion / Obsidian / Feishu / backup 编排层 | `src/services/protocols/conversation-kinds.ts`, settings stores | `src/services/sync/` |

## 支持的采集面

| 类型 | 当前覆盖 | 关键特点 |
| --- | --- | --- |
| AI 对话站点 | ChatGPT、Claude、Gemini、Google AI Studio、DeepSeek、Kimi、豆包、元宝、Poe、Notion AI、z.ai | 通过 collectors registry 统一注册 |
| 普通网页文章 | 任意 `http(s)` 页面 | content 抽取首次失败时按需注入 `readability.js` 并重试一次 |
| 视频字幕页 | YouTube / Bilibili 视频页 | 只采集页面已加载字幕，右键菜单触发保存 |
| inpage 交互 | 支持站点默认启用；非支持站点受 `inpage_display_mode` 控制（兼容旧键） | 单击保存、双击打开页面内评论侧边栏（inpage comments panel）、多击彩蛋提示 |
| Popup 当前页抓取 | `usePopupCurrentPageCapture.ts` + `current-page-capture.ts` | 先判断当前页可抓取，再用统一按钮触发 chat / article 抓取 |
| 文章评论 / 注释线程 | article detail + inpage comments panel | 本地 threaded comments，支持回复、删除；不属于新的抓取站点 |

- `content.ts` 在所有 `http(s)` 页面注入，但 **支持站点始终优先启动 controller**；非支持站点则在读取 `inpage_display_mode`（以及兼容旧 `inpage_supported_only`）后决定是否启动。
- `content.ts` 还会注册视频字幕采集处理器；视频页右键菜单通过 `CAPTURE_VIDEO_TRANSCRIPT` 走独立采集链路，不会复用 article fetch。
- `anti_hotlink_rules_v1` 由 `AntiHotlinkDomainsEditor` 维护；文章抓取命中规则时会自动走图片缓存链路，即使 `web_article_cache_images_enabled` 关闭也不会把整页抓取变成失败。
- `inpage-button-shadow.ts` 的点击结算窗口是 `400ms`：单击触发保存，双击打开页面内评论侧边栏，多击只触发彩蛋动画与提示。
- 评论侧边栏打开后，页面 `selectionchange` 会自动附加当前选区；reply 输入框不触发附加，也不触发“空选区清空”。
- Google AI Studio 由于虚拟化渲染，自动保存常常不完整；collector 与 controller 已经显式把它改为“手动保存优先”。
- popup 里的 “Current Page / Fetch Current Page” 不是盲抓：`current-page-capture.ts` 会先解析当前 collector，支持页走 chat snapshot，普通网页走 article fetch，不支持页则返回显式不可抓取原因。
- article comments 是 local-first 的注释层：它依赖 article 的 canonical URL 作为主索引，并会在 article 同步时进入 Notion / Obsidian 的评论区段，同时进入 Zip v2 备份 / 恢复；如果你改 comments 流程，一定同时看 storage、background handler、shared session、inpage 面板和 backup 目录。

## fetch articles 架构（2026 Q2）

### 主干链路

1. `src/collectors/web/article-fetch.ts` 在 background 侧解析 active tab + canonical URL，向 content 发送 `EXTRACT_WEB_ARTICLE`。
2. content 侧 `src/collectors/web/article-extract/engine.ts` 先做 `waitForDomStabilized()` + site hydration wait（微信图集 / 小红书）。
3. 抽取顺序固定为：`site spec` → `Discourse OP(.cooked)` → `Defuddle` → `Readability` → `fallback`。
4. 统一转换主干：`contentHTML` → `cleanHtmlFragment()`（移除 script/style/style attr + href/src/srcset 绝对化）→ `htmlToMarkdownTurndown()`（含 GFM table 转换、headerless table 归一、代码块语言 fence 保留）。
5. 兜底：Turndown 返回空时回退 `textContent`。

### 站点适配边界

- `site spec` 只负责提取结构化 `contentHTML + textContent`，不再直接拼 markdown。
- `site spec` 现支持 `urlPattern`、`removeSelectors` 与 `useSanitizedRootHtml` 这类 declarative 边界描述，适合复杂 SPA 页内只保留部分 DOM 子树的场景。
- `article-fetch-sites/*` 只维护 declarative site specs；`article-extract/sites/*` 只维护运行时站点 helper，不承担 spec 转发。
- Discourse 保留首贴 `.cooked` 轻量适配（避免 onebox 截断）。
- 微信 share media 图集保留 HTML 追加能力，但 markdown 统一由 Turndown 生成（已移除 `buildWechatShareMediaGalleryMarkdown()` 旁路）。
- 小红书/Bilibili 继续由 `article-fetch-sites/*` 提供选择器策略，并在 engine 主干中统一转换。
- Dedao `knowledge/note/detail` 现在走专门的 note-detail site spec：保留正文、`source-card` 与讨论文本，移除推荐区、头像、输入框、空态与交互噪音。

### Readability 注入策略

- `article-fetch.ts` 不再无条件注入 `src/vendor/readability.js`。
- 现在只在首次 content 抽取失败时按需注入并重试一次，减少不必要注入噪音与页面策略报错。

### 手动验证清单（开发者）

| 场景 | 期望结果 |
| --- | --- |
| Discourse（`linux.do` topic） | 首贴正文完整可见，不被 onebox 截断；列表/引用/代码块/details 结构可读 |
| 普通网页（非 site spec） | Defuddle 或 Readability 路径可产出正文；链接和图片地址可用 |
| WeChat share media | 图集图片被正确提取并清洗参数；输出是图片 blocks（非表格） |
| 小红书 note | `#noteContainer` hydrated 后走 site spec；正文与图片都保留 |
| Bilibili opus | 图片 URL 去除 `@...` 后缀，正文段落保留 |
| Dedao note detail | `knowledge/note/detail` 走 site spec；正文、`source-card`、评论文本保留，推荐区/头像/空态被裁掉 |
| GitHub README（含 table） | 表格转换为 GFM markdown table；对齐信息可保留（例如右对齐列） |

### 与 obsidian-clipper 的对标差异

- 一致点：都采用 `Defuddle + Turndown` 作为通用抽取/转换基础。
- 差异点（SyncNos 特有）：
  - 保留 Discourse OP 专项路径与 `/1` 首层回退逻辑。
  - 保留 Readability 兜底分支，且 background 侧支持按需注入。
  - 保留站点 spec（微信图集 / 小红书 / Bilibili / Dedao note detail）并统一回到同一 Markdown 主干。
- 当前状态：旧 `htmlToMarkdown` 已从 web article fetch 链路移除，转换主干收敛为 Turndown + `textContent` 兜底。

## 本地数据与同步结构

详见 [storage.md](../storage.md)（IndexedDB schema、迁移、同步编排、备份排除策略）与 [data-flow.md](../data-flow.md)（来源 → 本地 → Notion/Obsidian/Feishu/导出全链路）。

## 设置与 UI 入口

| UI 区域 | 主要实现 | 说明 |
| --- | --- | --- |
| 会话列表 / 详情 | `src/ui/conversations/ConversationsScene.tsx`, `src/ui/conversations/ConversationDetailPane.tsx`, `src/ui/conversations/DetailNavigationHeader.tsx`, `src/viewmodels/conversations/conversations-context.tsx`, `src/services/integrations/detail-header-actions.ts` | popup 与 app 共享同一套会话读取、选择与 detail header 动作解析逻辑（含窄屏头部） |
| 文章评论区 | `src/ui/conversations/ConversationDetailPane.tsx`, `src/ui/conversations/ArticleCommentsSection.tsx`, `src/services/comments/threaded-comments-panel.ts`, `src/ui/inpage/inpage-comments-panel-shadow.ts` | article detail / inpage comments panel 共享本地 threaded comments 线程 |
| 设置页 | `src/ui/settings/SettingsScene.tsx`, `src/ui/settings/SettingsTopTabsNav.tsx`, `src/ui/settings/SettingsSidebarNav.tsx`, `src/viewmodels/settings/types.ts` | 真实设置中枢：窄屏走顶部标签导航、宽屏走侧边栏导航；分组覆盖 `General`、`Chat with AI`、`Backup`、`Notion`、`Feishu`、`Obsidian`、`About You`、`About Me`（section key：`aboutyou/aboutme`，兼容旧 `insight/about`） |
| Markdown 渲染 | `src/ui/shared/markdown.ts`, `src/ui/shared/ChatMessageBubble.tsx` | 统一消息气泡与导出文本显示 |
| Chat with AI | `src/ui/settings/sections/ChatWithAiSection.tsx`, `src/services/integrations/chatwith/chatwith-settings.ts`, `src/services/integrations/chatwith/chatwith-detail-header-actions.ts` | 管理 prompt 模板、平台列表、最大字符数，并把 article / conversation 渲染为可复制载荷，再从 detail header 触发复制 + 跳转 |
| 详情工具动作 | `src/viewmodels/conversations/conversations-context.tsx`, `src/ui/conversations/DetailHeaderActionBar.tsx`, `src/ui/conversations/DetailNavigationHeader.tsx`, `src/services/conversations/background/image-backfill-job.ts` | detail 可注入 `cache-images`；触发后回填图片并刷新详情 |
| Insight | `src/ui/settings/sections/InsightSection.tsx`, `src/ui/settings/sections/InsightPanel.tsx`, `src/viewmodels/settings/insight-stats.ts` | 只读统计本地会话库，展示总 clips、chat/article 概览、来源分布、Top 3 最长对话与文章域名分布 |
| i18n | `src/ui/i18n/index.ts`, `src/ui/i18n/locales/*.ts` | UI 文案自动根据浏览器语言在 `en` / `zh` 间切换 |
| 页面内评论侧边栏打开 | `src/platform/messaging/ui-background-handlers.ts` | 双击 inpage 按钮发送 `UI_MESSAGE_TYPES.OPEN_CURRENT_TAB_INPAGE_COMMENTS_PANEL`，background 转发 `CONTENT_MESSAGE_TYPES.OPEN_INPAGE_COMMENTS_PANEL` 打开 panel；失败会提示用户点击工具栏图标进行评论 |

- 各配置项的默认值、存储位置和行为边界见 [configuration.md](../configuration.md)。
- detail header 动作槽位（`open / tools`）由 `detail-header-action-types.ts` 统一定义；Chat with AI 和 `cache-images` 都落在 `tools`。
- `ConversationsProvider` 是 popup 与 app 的共享数据入口；大多数 UI bug 可沿 provider → storage → background handler 链排查。

## 修改热点与扩展点

- **新增支持站点**：先改 `src/collectors/` 和 `src/collectors/register-all.ts`，不要把站点判断散落到 popup 或 background。
- **改 inpage 体验**：先看 `src/services/bootstrap/content-controller.ts`, `src/services/bootstrap/content.ts`, `src/ui/inpage/inpage-button-shadow.ts`, `src/ui/inpage/inpage-tip-shadow.ts`。
- **改会话结构 / 本地持久化**：先看 `src/services/conversations/data/storage-idb.ts`, `src/platform/idb/schema.ts`, `tests/storage/*`。
- **改 Insight 统计 / 排行 / 图表**：先看 `insight-stats.ts`, `InsightSection.tsx`, `InsightPanel.tsx`, `src/viewmodels/settings/useSettingsSceneController.ts`；这里决定 Top N、Other 分桶、空态 / 错误态和图表布局。
- **改列表筛选下拉 / 菜单裁切**：先看 `ConversationListPane.tsx`, `SelectMenu.tsx`, `MenuPopover.tsx`；不要再回退固定 `maxHeight`，否则容易在底部条或窄窗口出现无谓滚动条。
- **改主题 tokens / Settings 分组**：先看 `types.ts`, `SettingsScene.tsx`, `src/viewmodels/settings/useSettingsSceneController.ts`, `src/ui/styles/tokens.css`；不要只改某个按钮样式而忽略 token 真源。
- **改 detail header 动作分发**：先看 `src/services/integrations/detail-header-action-types.ts`, `src/services/integrations/detail-header-actions.ts`, `src/viewmodels/conversations/conversations-context.tsx`, `DetailHeaderActionBar.tsx`, `DetailNavigationHeader.tsx`, `ConversationDetailPane.tsx`；不要在 popup / app JSX 里各自拼动作规则。
- **改 AI chat 目录面板（outline）**：先看 `src/ui/conversations/chat-outline/outline-entries.ts`, `src/ui/conversations/chat-outline/useChatOutlineActiveIndex.ts`, `src/ui/conversations/chat-outline/ChatOutlinePanel.tsx`, `ConversationDetailPane.tsx`；不要把滚动根、DOM 锚点和高亮逻辑散落到多个组件。
- **改图片缓存补全流程（cache-images）**：先看 `src/viewmodels/conversations/conversations-context.tsx`, `src/services/conversations/client/repo.ts`, `src/services/conversations/background/handlers.ts`, `src/services/conversations/background/image-backfill-job.ts`；核对动作注入条件、回填后 detail 刷新与计数反馈。
- **改 Notion / Obsidian 行为**：先看各 orchestrator，再看 `conversation-kinds.ts` 和 settings store。
- **改 article 抓取**：先看 `article-fetch.ts`（background 侧注入/重试策略）+ `article-extract/engine.ts`（抽取顺序）+ `article-extract/markdown-turndown.ts`（统一转换），再确认保存后的 `sourceType` 和 message 结构没有变。
- **改视频字幕采集**：先看 `modules/videos.md`、`video-transcript-interceptor.content.ts`、`video-transcript-bridge.content.ts`、`video-transcript-extract.ts`、`video-transcript-capture.ts`、`clipper-context-menu.ts`，再确认 `sourceType='video'`、`SyncNos-Videos` 以及空字幕提示都没有回退。

## 自动同步（Auto Sync）

自动同步是 **事件驱动** 的：当会话内容写入（包括增量 auto-save）或 article comments 发生变更时，background 会在一个 debounce 窗口后，自动触发对应 provider 的“同步当前会话”。

- **设置位置**：Settings → Notion / Obsidian / Feishu 的同步区域内。
- **显示规则**：只有当「同步到 XXX」被开启时，才会显示「自动同步」开关。
- **默认值**：所有 provider 的自动同步都默认关闭。
- **触发源**：会话 upsert / 写入消息 / 图片回填（backfill）/ comments add-delete-migrate。
- **同步范围**：仅同步发生变更的 `conversationId`（不会自动全量同步全部会话）。
- **调度策略**：debounce（当前实现为 60s），并使用 MV3 `alarms` 做一次性唤醒调度（不是定时任务；实际触发时间可能有延迟）。
- **反馈方式**：复用现有 sync job store，最终在会话列表页的 `ConversationSyncFeedbackNotice` 展示 running / failed / success。
