# Generation Metadata

## Repository State

| Field | Value |
| --- | --- |
| Repository | `chiimagnus/SyncNos` |
| Commit hash | `e8fa764809afdddaefca43a625a0d042065dc009` |
| Branch name | `crh` (HEAD), `origin/crh` |
| Generation timestamp | `2026-04-18 22:17:45 +0800` |
| Output language | 中文 |
| Generated directory | `.github/deepwiki/` |
| Update mode | Minor incremental docs sync |

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
- [modules/syncnos-app.md](modules/syncnos-app.md)
- [modules/webclipper.md](modules/webclipper.md)
- [modules/videos.md](modules/videos.md)

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
| 评论 React 迁移 | `src/ui/comments/react/ThreadedCommentsPanel.tsx`, `panel-store.ts`, `focus-rules.ts`, `comment-chatwith-menu.tsx` |
| Settings 重构 | `src/ui/settings/SettingsScene.tsx`, `SettingsTopTabsNav.tsx`, `useSettingsSceneController.ts` |
| AppShell 重构 | `src/ui/app/AppShell.tsx`, `PopupShell.tsx`, `ConversationsScene.tsx`, `CapturedListPaneShell.tsx` |
| 评论数同步 | `src/services/comments/domain/comment-metrics.ts`, `notion-sync-orchestrator.ts`, `obsidian-markdown-writer.ts` |
| 文章提取 | `src/collectors/web/article-fetch-sites/bilibili-opus.ts`, `article-extract/markdown.ts` |
| 视频字幕采集 | `src/entrypoints/video-transcript-interceptor.content.ts`, `src/entrypoints/video-transcript-bridge.content.ts`, `src/services/bootstrap/video-transcript-capture.ts`, `src/services/bootstrap/video-transcript-capture-content-handlers.ts`, `src/collectors/video/video-transcript-extract.ts`, `src/collectors/video/video-transcript-parse.ts` |
| Chat with AI | `src/services/integrations/chatwith/chatwith-settings.ts`, `chatwith-comment-actions.ts` |
| Git 历史 | 85 commits since 2026-04-02 |

## Notes For Next Update

- 若 manifest、DB schema 或发布 workflow 再次变更，优先更新 `configuration.md`、`storage.md`、`release.md`，再回写索引与元数据。
- 如果后续继续演进 Inpage 规则或 markdown 阅读风格，优先同步 `src/ui/AGENTS.md` 与 `AGENTS.md`，再回写 deepwiki 相关页。
