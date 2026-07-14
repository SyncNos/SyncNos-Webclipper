# 模块：文章阅读器与朗读

## 范围

Reader 只用于 article 和 video detail。AI chat 不显示阅读器布局、主题或朗读控件。

| 层 | 主要路径 | 职责 |
| --- | --- | --- |
| protocol | `src/services/protocols/reader-prefs.ts` | `reader_prefs_v1`、默认值、枚举归一化和数值 clamp |
| TTS service | `src/services/reader/tts/` | 分句、Web Speech / AI endpoint 引擎与依赖注入 |
| ViewModel | `src/viewmodels/reader/` | 偏好持久化、朗读状态和生命周期 |
| UI | `src/ui/reader/` | header controls、outline minimap、sentence decoration |
| reader view | `src/ui/conversations/views/ArticleReaderView.tsx` | 将偏好、outline、TTS 和正文 DOM 组合起来 |

## 偏好契约

`reader_prefs_v1` 包含字体、字号、行高、内容宽度、字距、对齐和 TTS 设置。所有读取必须经过 `normalizeReaderPrefs()`：

- enum 使用协议默认值回退；
- 数值按 `READER_PREFS_LIMITS` clamp；
- typography preset 只覆盖排版字段，不覆盖 TTS；
- app 的全局主题由 `app_theme_mode_v1` 管理，不再从 reader prefs 驱动页面主题。

## UI 边界

- `ReaderHeaderToolbar` 负责排版、主题和朗读控制。
- `ReaderToolbar` 只负责文章 outline rail/minimap。
- narrow/wide surface 共用状态和组件，不维护第二套偏好。
- 排版只通过 `--reader-*` CSS variables 应用。
- AI chat 的 feature flags 全为 false，不能渲染 Reader 控件。

## 朗读

- Web Speech 与 AI endpoint 共用 `ReaderTtsEngine` 协议。
- Web API、Audio 和网络能力通过依赖注入进入 service，便于测试和释放资源。
- unmount、切换 conversation 或 stop 必须 dispose 当前引擎。
- active sentence 通过只读 decoration 标记，不改写文章文本。
- `globalThis.__syncnosReaderNarration` 只允许发布状态、计数、索引和错误，不得包含文章正文、API key 或 endpoint secret。

## 失败与降级

- Web Speech 不可用时 UI 明确禁用或提供可行回退。
- AI endpoint 错误保留可读错误并允许 stop/reset。
- progressive sentence decoration 必须保留已处理统计，异步批次不得互相覆盖。
- 无音频设备或真实 endpoint 的 CI 只验证协议和 mock；真实播放属于发布前人工 smoke。

## 验证

- `tests/reader-prefs.test.ts`
- `tests/reader-tts-engine.test.ts`
- `tests/unit/use-reader-narration.test.ts`
- `tests/unit/reader-toolbar.test.ts`
- `tests/unit/reader-header-toolbar.test.ts`
- article/video/chat detail smoke
