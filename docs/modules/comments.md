# 模块：文章评论与精确锚点

## 职责

article conversation 可以在 App 和 Inpage surface 中保存本地 threaded comments。根评论可绑定正文选区，回复只属于线程，不保存 locator。评论随 article 同步到 Notion / Obsidian，并进入 Zip v2 备份。

## 数据与状态所有权

| 层 | 主要路径 | 所有内容 |
| --- | --- | --- |
| domain/data | `src/services/comments/domain/`, `src/services/comments/data/` | DTO、唯一 thread graph、归档格式、IndexedDB CRUD |
| sidebar service | `src/services/comments/sidebar/` | context identity、load/mutation generation、AbortSignal、host session |
| locator service | `src/services/comments/locator/` | V2 capture、V1/V2 exact resolve |
| ViewModel | `src/viewmodels/comments/` | active root、draft、menu、delete confirmation、focus intent |
| UI | `src/ui/comments/` | React 组件、surface roots、Range scroll 和 marker overlay |
| integration | `src/services/comments/background/`, `src/services/sync/` | messaging、同步派生和备份 |

`comment-thread-graph.ts` 是 roots/replies、orphan、cycle 和 duplicate 归一化的唯一实现；列表、指标、同步和归档不得自行重建父子图。

## 存储

- object store：`article_comments`。
- root：`parentId = null`；reply 必须指向同一 article identity 下的 root。
- identity：canonical URL + 可选 conversationId。
- locator：仅 root 可写；生产只写 V2，reader 兼容 V1/V2。
- canonical URL 变化通过显式 migrate handler 处理，不做 UI 侧双写。

## 精确定位契约

- DOM owner 由 App/Inpage 注入 `{sourceRoot, scrollRoot}` 或候选 roots；service 不读取全局 `document`。
- capture 保存 canonical quote/context、text position、boundary path 和 root evidence。
- 同 surface 优先验证 root evidence、boundary path 与 position；跨 App/Inpage surface 时不复用结构证据，只接受候选 roots 中全局唯一的 exact quote。
- resolver 只在所有候选 roots 中得到一个全局唯一 exact Range 时成功。
- 缺失、歧义、root evidence 不匹配、预算超限或取消都返回明确 reason。
- 禁止模糊文本匹配、按文本比例滚动、父元素高亮、first-success root 和固定 sleep/retry。

## marker 和生命周期

- passive marker 表示可恢复位置，active marker 与当前线程或显式定位同步。
- marker 基于 Range client rects，不修改宿主正文 DOM，也不拦截指针。
- context/root generation 变化会取消旧解析。
- panel close、reset、dispose 或评论删除必须清理 marker、listener 和嵌套 React root。
- iframe 与 closed shadow root 不承诺支持；失败显示 unavailable，不伪装命中。

## 交互规则

- 根 composer 常驻，同一时刻只挂载一个 reply composer。
- root/reply draft 在切换 active root 时由 reducer 保持。
- `selectionchange` 后只在 pointer/key commit 时附加正文选区。
- reply 输入框、评论 panel 内选区和空选区不得覆盖 root quote。
- save/reply/delete 必须防重入；晚到 completion 不得写回旧 context。
- 删除失败必须保留当前数据并显示 notice。

## 生产入口

- App：`src/ui/conversations/ArticleCommentsSection.tsx`
- Inpage：`src/ui/inpage/inpage-comments-panel-shadow.ts`
- content bridge：`src/services/bootstrap/inpage-comments-panel-content-handlers.ts`
- messaging：`COMMENTS_MESSAGE_TYPES` in `src/platform/messaging/message-contracts.ts`
- backup：`src/services/sync/backup/export.ts` / `import.ts`

## 测试与排障

重点覆盖：thread graph、archive V1/V2、context transition、generation/abort、session lease、reducer、selection attachment、exact resolver、marker teardown 和 App/Inpage smoke。

定位失败的调试开关、日志前缀与 IndexedDB 检查脚本见 [../troubleshooting.md](../troubleshooting.md#评论精确定位)。阶段验收和历史截图留在 `.github/features/comments-discussion-redesign/`，不在本页维护。
