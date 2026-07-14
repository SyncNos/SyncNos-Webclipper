# Comments Discussion Redesign — Final Gate

- 执行日期：2026-07-14
- Feature：`.github/features/comments-discussion-redesign/`
- 范围：P1–P4 代码、测试、文档、构建与架构边界
- 自动化结论：**Go**
- 计划总 Gate：**No-Go / Blocked**（缺少计划明确要求的 Chrome 与 Edge 安装态真实几何验收）

## Phase 状态

| Phase | 任务状态 | 本轮独立复审 |
| --- | --- | --- |
| P1 | 14/14 completed | Go；测试夹具 finding 已由 `ddd2b01` 修复 |
| P2 | 22/22 completed | Go；旧定位双轨与 root generation findings 已由 `a68fd71`、`5d3bfbf` 修复 |
| P3 | 22/22 completed | Go；旧 controller、生命周期与删除错误处理 findings 已关闭 |
| P4 | 11/11 标记 completed | **No-Go**；自动化通过，但 `RA-P4-F01` 的 Chrome/Edge 人工证据仍为 Open |

## 自动化验证

### 完整 CI Gate

在不修改仓库脚本的前提下，以 4 核 CPU affinity 限制沙箱并发，执行原始 `npm run gate:ci`：

| 阶段 | 结果 |
| --- | --- |
| `npm run lint` | PASS（0 errors） |
| `npm run format:check` | PASS |
| `npm run compile` | PASS |
| `npm run test` | PASS（228/228 files；1022/1022 tests） |

CPU affinity 仅限制当前 56 核沙箱的 worker 数量，未跳过或筛选任何测试文件，也未修改 `package.json` 或 Vitest 配置。

### Production build

- `npm run build`：PASS
- 产物：`.output/chrome-mv3`
- WXT Chrome MV3 production build 成功

### 审计回归与扫描

- 评论关键回归：8 files / 38 tests PASS
- 阅读器渐进装饰回归：8 tests PASS
- `ui/viewmodels -> platform` 禁止依赖扫描：PASS
- `services -> ui/viewmodels` 反向依赖扫描：PASS
- 裸像素圆角扫描：PASS
- 旧 `src/ui/comments/locate.ts`、`selector-anchoring.ts`、imperative `chatwith.ts` 与相关符号扫描：PASS（零残留）

## 本轮发现与修复

1. 删除旧 locator/locate 双轨及无消费者 facade：`a68fd71`。
2. 删除 276 行无消费者 imperative Chat with controller：`58b34a4`。
3. 修复 React 父生命周期内同步卸载 nested root：`5041742`。
4. 保持 Inpage/直接宿主同步 teardown：`bee8ca6`。
5. 将 notice 更新移出 React lifecycle：`ca88359`。
6. 修复两个 JSDOM 输入事件夹具的假阳性：`ddd2b01`。
7. 捕获删除失败并向用户显示 notice：`89a894b`。
8. 通过显式 root identity subscription 刷新定位 generation，且不 remount panel：`5d3bfbf`。
9. 修复评论模块格式漂移：`de3a6e8`。
10. 修复高并发 Gate 暴露的阅读器渐进装饰统计竞态：`345887e`。

## Chrome / Edge 验收

当前环境仅提供 `/usr/bin/chromium`，没有 Microsoft Edge，也没有可交互的已安装扩展浏览器会话。因此不能伪造以下计划验收证据：

- Chrome 与 Edge 的 App 宽屏/窄屏真实几何；
- 多行 Range marker、滚动容器、缩放与系统字体表现；
- Inpage SPA、iframe、open/closed shadow 边界的安装态人工检查；
- 对应版本号、结果记录与截图。

发布前必须在真实 Chrome 与 Edge 中执行：

- `docs/qa/comments-discussion/app-manual.md`
- `docs/qa/comments-discussion/inpage-manual.md`

## 命令名称说明

仓库不存在 `gaet:ci` script；字面执行 `npm run gaet:ci` 会失败，并由 npm 提示应使用 `npm run gate:ci`。本轮执行并通过的是仓库真实、规范的 `gate:ci` script；没有新增拼写兼容 alias。

## Gate 判定

- 自动化 CI、production build、架构边界与旧代码清理：**Go**。
- P1、P2、P3：**Go**。
- P4 / 整体 plan：**No-Go / Blocked**，唯一阻断项为 Chrome 与 Edge 安装态人工验收证据缺失。
