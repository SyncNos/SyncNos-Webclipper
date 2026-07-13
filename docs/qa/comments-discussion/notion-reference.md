# Notion 评论参考

## 参考范围

本页记录 `comments-discussion-redesign` 的视觉参考与边界，不是像素级复刻规范。

- **当前主参考**：`.github/features/comments-discussion-redesign/.audit/references/notion-comments-sidebar.png`
  - 右侧固定 sidebar。
  - 单列讨论线程。
  - 活跃线程使用弱背景强调。
  - 引用、正文、回复与回复输入区保持清晰层级。
- **未来方向**：`.github/features/comments-discussion-redesign/.audit/references/notion-comments-inline.png`
  - 页面内悬浮评论卡片。
  - 本 feature 不实现，也不作为 P4 验收条件。

## 从主参考提取的结构

1. sidebar shell 与正文区域明确分隔。
2. header 只保留真实存在的标题、折叠或关闭动作。
3. thread 使用紧凑单列布局，不堆叠独立大卡片。
4. avatar、author、time、quote、正文和 reply 形成稳定阅读顺序。
5. reply 使用细连接线表达层级。
6. 仅 active thread 展开 reply composer；非活跃线程保持轻量。
7. 次要动作在 hover、focus 或 active 时出现，并集中到 overflow。
8. 内容区采用 exact Range passive/active marker，与当前 active thread 同步。

## SyncNos 保留的产品语义

- root composer、reply、delete 与 Chat with AI 继续使用现有业务动作。
- quote 支持显式定位，定位失败显示现有 notice，不伪造近似命中。
- App 宽屏、App 窄屏与 Inpage 共用讨论组件树，只做布局压缩适配。
- marker 仅在 panel 打开期间存在；关闭、切换上下文、重新解析或 teardown 时清理。

## 明确不采用

- Notion 品牌、图标和像素级视觉复制。
- 页面内悬浮评论卡片。
- 没有现有业务语义的过滤、通知、附件、@mention 或协作状态按钮。
- 修改宿主正文 DOM 的 `<mark>` 节点。
- 跨页面、跨会话常驻的 marker registry。
- 用 Notion 搜索界面或其他无关截图替代评论参考。
