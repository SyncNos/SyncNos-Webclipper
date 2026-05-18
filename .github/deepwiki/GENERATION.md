# Generation Metadata

## Repository State

| Field | Value |
| --- | --- |
| Repository | `chiimagnus/SyncNos` |
| Commit hash | `f79c37a8be4965e25633e6923ff105ac5a5cb2cc` |
| Branch name | `crh` (HEAD), `origin/crh` |
| Generation timestamp | `2026-05-18 00:00:00 +0800` |
| Output language | 中文 |
| Generated directory | `.github/deepwiki/` |
| Update mode | Incremental sync — v1.7.1 Xiaohongshu image order fix + light mode token neutralization |

## Notes For Next Update

- 若 manifest、DB schema 或发布 workflow 再次变更，优先更新 `configuration.md`、`storage.md`、`release.md`，再回写索引与元数据。
- 如果后续继续演进 Inpage 规则或 markdown 阅读风格，优先同步 `src/ui/AGENTS.md` 与 `AGENTS.md`，再回写 deepwiki 相关页。
- Feishu 相关改动需同步更新 `feishu-setup.md`、`data-flow.md`（Convert API 流程）、`api.md`（消息契约与 API 端点）和 `testing.md`（12 个专项测试文件）。
- 商店描述已更新为包含飞书（`public/_locales/*/messages.json`）；下次发版时确认 CWS/Edge/AMO 审核通过。
