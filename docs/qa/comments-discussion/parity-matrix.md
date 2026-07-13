# 评论 sidebar parity matrix

| 区域 / 行为 | 决策 | SyncNos 落地边界 | 验收要点 |
| --- | --- | --- | --- |
| 右侧 sidebar 边界 | 采用 | 使用现有 App sidebar / Inpage dock，不复制 Notion chrome | 与正文有清晰分隔；宽窄 surface 均不遮蔽核心操作 |
| header | 调整 | 只展示标题与已有折叠、关闭、可选 Chat with AI 动作 | 不出现无行为按钮；动作有可访问名称 |
| 单列 thread | 采用 | root/replies 在一个连续列表中展示 | 不使用独立大圆角卡片堆叠 |
| active thread 背景 | 采用 | `activeRootId` 是唯一 active 来源 | 整行弱背景或边界强调；非活跃项保持轻量 |
| avatar / author / time | 采用 | 使用现有评论数据和 fallback | 阅读顺序稳定；信息密度紧凑 |
| quote 左侧强调线 | 采用 | 使用现有 display quote 与显式 locate | 与正文层级可辨；失效态可见；不改变 canonical quote |
| reply connector | 采用 | 细线连接 root 与 replies | 不干扰文本与键盘焦点 |
| active reply composer | 采用 | 同时仅一个 root 展开回复输入区 | 切换 active root 时保留各自 draft |
| overflow | 调整 | delete、Chat with AI 等次要动作集中管理 | hover/focus/active 才强化；键盘可达 |
| passive exact marker | 采用 | panel 打开时为可解析评论绘制低强度 Range overlay | 不拦截点击；不修改宿主 DOM |
| active exact marker | 采用 | 与 active thread / 最近显式定位结果同步 | 强度高于 passive；上下文变化时 teardown |
| marker 生命周期 | 调整 | panel-scoped registry；关闭、切换、解析失败、dispose 时清理 | 不跨页面常驻，不演化为全局 persistent registry |
| 页面内悬浮评论卡片 | 不采用 | 仅记录为未来形态 | 不进入当前代码和验收 |
| 过滤 / 通知 | 不采用 | 当前无对应业务语义 | 不创建装饰性按钮 |
| 附件 / @mention | 不采用 | 当前评论模型未提供相关能力 | 不创建不可用入口 |
| Notion 品牌与像素复刻 | 不采用 | 只借鉴信息层级和交互组织 | 保持 SyncNos tokens、组件和产品语义 |

## 状态与 surface 验收

P4 以相同组件树验收以下组合：

- 状态：`loading`、`error`、`empty`、`ready`、`stale_error`。
- surface：App 宽屏 sidebar、App 窄屏 route、Inpage overlay/dock。
- 交互：root comment、reply、delete、overflow、键盘、焦点、quote locate。
- marker：多行 exact Range 的 passive/active 两级显示与 teardown。

## 延后项

页面内悬浮卡片需要独立的布局、碰撞、滚动跟随和可访问性设计。该形态不由本 feature 的 sidebar parity 推导，也不得通过复用 marker overlay 偷渡实现。
