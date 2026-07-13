# Comments Discussion Redesign — Final Gate

- 执行日期：2026-07-13
- Feature：`.github/features/comments-discussion-redesign/`
- 范围：P1–P4 代码、测试、文档、构建与架构边界
- 结论：**Go（自动化 Gate）**

## Phase 状态

| Phase | 任务状态 | 审计状态 |
| --- | --- | --- |
| P1 | 14/14 completed | Go / Resolved；F-01 已由 `7ee6832d` 修复 |
| P2 | 22/22 completed | Go / Resolved |
| P3 | 22/22 completed | Go / Resolved；F-01 已由 `d56ce27` 修复 |
| P4 | 11/11 completed | Go / Resolved；F-01 已由 `007bcfe` 修复 |

## 自动化验证

### 静态质量

| 命令 | 结果 | 备注 |
| --- | --- | --- |
| `npm run lint` | PASS | 最终复核为 0 errors，0 warnings |
| `npm run format:check` | PASS | 初次发现 49 个格式漂移文件；由纯格式提交 `a8f0fdf` 修复后通过 |
| `npm run compile` | PASS | `tsc -p tsconfig.compile.json --noEmit` 无类型错误 |
| `npm run build` | PASS | Chrome MV3 production bundle，WXT 构建成功 |

P4 phase audit 曾记录 3 条 exhaustive-deps warning；`007bcfe` 通过显式解构 focus hook 输入并移除无必要的 context `useMemo` 完成修复。修复后 lint 为 0 errors / 0 warnings，47 个 comments 测试文件、200 项断言、compile 与 build 均再次通过。

### 完整测试集

为避免仓库全量 Vitest 单进程的 open-handle/资源峰值问题，227 个测试文件按固定清单拆为 12 个单线程分片执行；没有跳过测试文件：

- Test files：**227 passed / 227**
- Assertions：**999 passed / 999**
- `testTimeout` / `hookTimeout`：15 秒
- 每个分片：`minThreads=1`、`maxThreads=1`

分片结果：

| 分片 | 文件 | 断言 | 结果 |
| --- | ---: | ---: | --- |
| 01 | 19 | 101 | PASS |
| 02 | 19 | 97 | PASS |
| 03 | 19 | 61 | PASS |
| 04 | 19 | 89 | PASS |
| 05 | 19 | 87 | PASS |
| 06 | 19 | 75 | PASS |
| 07 | 19 | 80 | PASS |
| 08 | 19 | 75 | PASS |
| 09 | 19 | 84 | PASS |
| 10 | 19 | 96 | PASS |
| 11 | 19 | 64 | PASS |
| 12 | 18 | 90 | PASS |

Gate 期间发现并独立修复的测试基础设施问题：

- `56b174a`：更新删除确认测试的旧 DOM selector。
- `78405ec`：等待 marker RAF，并更新 reply DOM selector。
- `e1532bc`：恢复 whitespace-sensitive DOM fixture，并加入 `.prettierignore`，防止格式化改变文本 offset 语义。

现存非失败日志：

- React/JSDOM 输入 polyfill 会输出 `attachEvent` / `detachEvent` warning。
- 部分测试会输出预期的 mock 缺失、storage 不可用、图片占位降级等错误日志；对应断言均通过。

## 架构与视觉协议扫描

| 扫描 | 结果 |
| --- | --- |
| `ui/viewmodels` 禁止直连 `platform` | PASS |
| `services` 禁止反向依赖 `ui/viewmodels` | PASS |
| 禁止裸像素圆角 / 非 token 任意圆角 | PASS |
| 旧 `selector-anchoring`、`ui/comments/locate`、embedded/shortcut relay 契约 | PASS（无匹配） |

## Chrome / Edge 结果

- `npm run build` 已生成 Chrome MV3 production bundle；Chrome 与当前 Edge 共用 Chromium MV3 扩展代码路径。
- App 宽/窄屏主流程由 `app-manual.md` 对应的自动化 smoke 覆盖。
- Inpage SPA、iframe、open/closed shadow 边界由 `inpage-manual.md` 对应的自动化测试和限制记录覆盖。
- 当前执行环境无法启动并人工操作“已安装扩展”的 Chrome 与 Edge 会话，因此**未声称交互式浏览器人工验收通过**。
- 发布前人工复核入口：
  - `docs/qa/comments-discussion/app-manual.md`
  - `docs/qa/comments-discussion/inpage-manual.md`

## 已知限制与剩余风险

1. Closed shadow root 内部内容不可由扩展侧恢复；不会用 `body` fallback 或猜测定位绕过。
2. 跨 iframe 定位严格受 top-frame / frame identity 边界约束。
3. 真实 Chrome/Edge 安装态的视觉、缩放、系统字体和站点 CSS 干扰仍需发布前按人工清单抽查。

## Gate 判定

- lint / format / compile / full test / build：全部通过。
- 分层、旧实现与圆角扫描：全部通过。
- P4-T11 不包含生产行为变更；Gate 期间的格式和测试修复均为独立原子提交。
- **结论：Go；P4 phase audit 已关闭。**
