# Generation Metadata

## Repository State

| Field | Value |
| --- | --- |
| Repository | `chiimagnus/SyncNos` |
| Commit hash | `2d6a6804e71840541c7ba5bbbd7831c7f4a0cb74` |
| Branch name | `crh` (HEAD), `origin/crh` |
| Generation timestamp | `2026-05-16 00:00:00 +0800` |
| Output language | 中文 |
| Generated directory | `.github/deepwiki/` |
| Update mode | Major incremental sync — v1.7.0 Feishu Convert API + image binding |

## Page Inventory

### Core / Topic Pages

- [INDEX.md](INDEX.md)
- [business-context.md](business-context.md)
- [overview.md](overview.md)
- [architecture.md](architecture.md)
- [dependencies.md](dependencies.md)
- [data-flow.md](data-flow.md)
- [configuration.md](configuration.md)
- [testing.md](testing.md)
- [workflow.md](workflow.md)
- [api.md](api.md)
- [operations.md](operations.md)
- [security.md](security.md)
- [storage.md](storage.md)
- [release.md](release.md)
- [troubleshooting.md](troubleshooting.md)
- [glossary.md](glossary.md)

### Module Pages

- [modules/comments.md](modules/comments.md)
- [modules/webclipper.md](modules/webclipper.md)
- [modules/videos.md](modules/videos.md)

### Specialized Pages

- [feishu-setup.md](feishu-setup.md)

### Metadata

- [GENERATION.md](GENERATION.md)

## Asset Inventory

- `assets/repository-flow-01.svg`
- `assets/popup-screenshots.png`
- `assets/setting-screenshots.png`

## Audit Basis

| 类别 | 主要来源 |
| --- | --- |
| 仓库入口与规范 | `AGENTS.md`, `README.md`, `README.zh-CN.md` |
| Feishu DocX 同步 | `src/services/sync/feishu/feishu-sync-orchestrator.ts`, `src/services/sync/feishu/docx/convert-api.ts`, `src/services/sync/feishu/docx/feishu-docx-image-preprocess.ts`, `src/services/sync/feishu/docx/image-block-binder.ts`, `src/services/sync/feishu/docx/image-materializer.ts`, `src/services/sync/feishu/docx/feishu-docx-markdown.ts`, `src/services/sync/feishu/feishu-api.ts`, `src/services/sync/feishu/auth/oauth.ts`, `src/services/sync/feishu/auth/token-store.ts`, `src/services/sync/feishu/settings-store.ts`, `src/services/sync/feishu/drive-folder-path.ts` |
| Feishu 测试 | `tests/unit/feishu-api-error-normalization.test.ts`, `tests/unit/feishu-api-retry.test.ts`, `tests/unit/feishu-convert-block-tree-normalize.test.ts`, `tests/unit/feishu-convert-fallback.test.ts`, `tests/unit/feishu-docx-image-bind-flow.test.ts`, `tests/unit/feishu-docx-markdown-formatter.test.ts`, `tests/unit/feishu-drive-folder-path.test.ts`, `tests/unit/feishu-folder-layout.test.ts`, `tests/unit/feishu-image-bind-retry.test.ts`, `tests/unit/feishu-orchestrator-warnings-sanitize.test.ts`, `tests/unit/feishu-skip-unchanged.test.ts`, `tests/unit/feishu-skip-unchanged-missing-doc.test.ts`, `tests/unit/feishu-warnings-sanitize-limit.test.ts` |
| 评论 React 迁移 | `src/ui/comments/react/ThreadedCommentsPanel.tsx`, `panel-store.ts`, `focus-rules.ts`, `comment-chatwith-menu.tsx` |
| Settings 重构 | `src/ui/settings/SettingsScene.tsx`, `SettingsTopTabsNav.tsx`, `useSettingsSceneController.ts` |
| AppShell 重构 | `src/ui/app/AppShell.tsx`, `PopupShell.tsx`, `ConversationsScene.tsx`, `CapturedListPaneShell.tsx` |
| 评论数同步 | `src/services/comments/domain/comment-metrics.ts`, `notion-sync-orchestrator.ts`, `obsidian-markdown-writer.ts` |
| 文章提取 | `src/collectors/web/article-fetch-sites/bilibili-opus.ts`, `article-extract/markdown.ts` |
| 视频字幕采集 | `src/entrypoints/video-transcript-interceptor.content.ts`, `src/entrypoints/video-transcript-bridge.content.ts`, `src/services/bootstrap/video-transcript-capture.ts`, `src/services/bootstrap/video-transcript-capture-content-handlers.ts`, `src/collectors/video/video-transcript-extract.ts`, `src/collectors/video/video-transcript-parse.ts` |
| Chat with AI | `src/services/integrations/chatwith/chatwith-settings.ts`, `chatwith-comment-actions.ts` |
| 商店描述 | `public/_locales/en/messages.json`, `public/_locales/zh_CN/messages.json`, `public/_locales/zh_TW/messages.json` |
| Git 历史 | ~60 commits since v1.5.4（含 v1.7.0 Feishu Convert API 全链路） |

## Notes For Next Update

- 若 manifest、DB schema 或发布 workflow 再次变更，优先更新 `configuration.md`、`storage.md`、`release.md`，再回写索引与元数据。
- 如果后续继续演进 Inpage 规则或 markdown 阅读风格，优先同步 `src/ui/AGENTS.md` 与 `AGENTS.md`，再回写 deepwiki 相关页。
- Feishu 相关改动需同步更新 `feishu-setup.md`、`data-flow.md`（Convert API 流程）、`api.md`（消息契约与 API 端点）和 `testing.md`（12 个专项测试文件）。
- 商店描述已更新为包含飞书（`public/_locales/*/messages.json`）；下次发版时确认 CWS/Edge/AMO 审核通过。
