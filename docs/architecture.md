# 架构

## 运行时

| 运行时 | 入口 | 职责 |
| --- | --- | --- |
| background service worker | `src/entrypoints/background.ts` | 消息路由、IndexedDB、OAuth、同步 job、右键菜单和安装事件 |
| content script | `src/entrypoints/content.ts` | collector 装配、页面观察、inpage UI、手动/自动抓取 |
| MAIN-world 字幕脚本 | `src/entrypoints/video-transcript-*.content.ts` | 拦截页面已加载的字幕响应并桥接到 content script |
| popup | `src/entrypoints/popup/` | 当前页抓取、会话列表、轻量设置与同步入口 |
| app | `src/entrypoints/app/` | 完整会话详情、阅读器、评论、设置与 Insight |

运行时之间只通过平台 messaging、持久化数据或显式注入的接口协作，service 不直接读取 UI DOM。

## 代码分层

```text
src/entrypoints  装配运行时
src/ui           React / DOM surface
src/viewmodels   UI 状态编排
src/services     用例、协议、同步和领域逻辑
src/platform     browser/runtime/storage/idb/messaging 适配
src/collectors   站点 DOM 与字幕解析
```

主要依赖方向：

```text
ui -> viewmodels -> services -> platform/domain/shared
entrypoints -> ui/viewmodels/services/platform
```

边界真源在根 `AGENTS.md`；UI 视觉约束在 `src/ui/AGENTS.md`。

## 主要子系统

| 子系统 | 主要路径 | 状态所有者 |
| --- | --- | --- |
| conversation 采集与读取 | `src/collectors/`, `src/services/conversations/` | IndexedDB `conversations` / `messages` |
| article 抓取 | `src/collectors/web/` | conversation + `article_body` message |
| 评论 | `src/services/comments/`, `src/ui/comments/` | `article_comments` + sidebar session/reducer |
| 阅读器 | `src/services/protocols/reader-prefs.ts`, `src/services/reader/`, `src/ui/reader/`, `src/viewmodels/reader/` | `reader_prefs_v1` + React narration state |
| 视频字幕 | `src/collectors/video/`, `src/services/bootstrap/video-transcript-*` | video conversation + `video_transcript` |
| 同步与备份 | `src/services/sync/` | 本地 mapping/cursor/job stores |
| 设置 | `src/ui/settings/`, `src/viewmodels/settings/` | `chrome.storage.local` 与少量 UI-only localStorage |

## 平台和工具链

- WXT + Manifest V3 构建 Chrome、Edge、Firefox、Safari 目标。
- React 19 负责 popup/app UI；Vitest + jsdom/fake-indexeddb 负责测试。
- `package.json` 是命令和依赖版本真源，`wxt.config.ts` 是 manifest version、权限和 host permissions 真源。
- `.github/workflows/` 与 `.github/scripts/webclipper/` 负责 CI、商店发布和 release assets。
- CI 验证使用 `npm run gate:ci`；包含 production build 的完整验证使用 `npm run gate`。

不要在文档中复制依赖版本表。需要升级或安全审计时直接查看 `package.json`、`package-lock.json` 和 `npm audit` 输出。

## 修改热点

- 新站点：先扩展 `src/collectors/ai-chat-sites.ts` 与对应 collector，再补手动/自动采集测试。
- 新设置：协议与归一化下沉到 service，ViewModel 负责读写编排，UI 只渲染。
- 新消息：先改 `src/platform/messaging/message-contracts.ts`，再注册 handler 和客户端调用。
- 新同步目标：复用 conversation kind、job store、mapping/cursor 和错误反馈契约，不在 UI 中直连外部 API。
