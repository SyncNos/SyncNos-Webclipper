# 仓库指南

本仓库以 WebClipper（浏览器扩展）为活动主线；Apple 客户端与 CLI 已拆分至独立仓库：

- iOS: `SyncNos/SyncNos-Health`
- macOS: `SyncNos/SyncNos-booknotes`
- CLI: `SyncNos/SyncNos-CLI`

## 项目结构

```
SyncNos-Webclipper/
├── src/                         # WebClipper 逻辑与 UI
├── public/                      # 静态资源
├── tests/                       # 单测
├── cloudflare-workers/          # Notion OAuth worker
├── .github/                     # 开发指南、deepwiki 与 CI
└── README.md
```

## 构建与运行

```bash
npm install              # 安装 WebClipper 依赖
npm run dev              # 启动 WebClipper Chrome 开发模式
npm run dev:firefox      # 启动 WebClipper Firefox 开发模式
npm run dev:safari       # 启动 WebClipper Safari 开发模式
npm run build            # 构建 WebClipper Chrome 产物
npm run build:firefox    # 构建 WebClipper Firefox 产物
npm run build:safari     # 构建 WebClipper Safari 产物（MV3）
npm run setup:safari:xcode  # 生成/更新 Safari Web Extension Xcode 项目
npm run compile          # TypeScript 编译检查
npm run test             # 单元测试
npm run check            # 产物校验（Chrome）
npm run check:safari     # 产物校验（Safari）
```

## WebClipper 分层与契约（必须遵守）

### 项目结构（分层）

- `src/ui/**`：UI（popup/app/inpage），只放组件/样式/DOM 面板；设置页由 `src/ui/settings/SettingsScene.tsx` 统筹；Inpage 相关设置集中在 `src/ui/settings/sections/InpageSection.tsx`；视频字幕采集入口集中在 `src/ui/settings/sections/VideosSection.tsx`
- `src/viewmodels/**`：ViewModel（hooks/context），只做 UI 状态编排与调用 service
- `src/services/**`：Service（用例/业务流程），承接平台交互与业务逻辑
- `src/platform/**`：平台适配（runtime/ports/storage/webext 等）
- `src/collectors/**`：站点采集规则（content-side DOM 解析）与视频字幕采集（YouTube / Bilibili subtitle bridge）

### 分层与依赖方向（强约束）

- 依赖方向：`ui -> viewmodels -> services -> (platform, domain, client, sync, shared, ...)`
- 禁止反向依赖：`services` 不得 import `ui/viewmodels`
- 禁止平台直连：`ui/**` 与 `viewmodels/**` 不得 import `platform/**`
- 业务与 UI 解耦：可复用业务算法/数据处理必须下沉到 `services/**`（或更底层的 domain/client 模块）

边界自检（手动）：

- `rg -n "src/platform|/platform/" src/ui`
- `rg -n "src/platform|/platform/" src/viewmodels`

### TypeScript 路径别名（约定）

- `@ui/*` -> `src/ui/*`
- `@viewmodels/*` -> `src/viewmodels/*`
- `@services/*` -> `src/services/*`
- `@platform/*` -> `src/platform/*`
- `@collectors/*` -> `src/collectors/*`
- `@entrypoints/*` -> `src/entrypoints/*`
- `@i18n/*` -> `src/ui/i18n/*`

自检（手动）：

- `rg -n "@platform/" src/ui src/viewmodels`

### 协议与契约（详细规范在 deepwiki）

以下协议的完整规范、真源文件和扫描命令已迁移至 deepwiki 对应页面：

- **圆角规范**：禁止裸 `border-radius: <px>`，使用 `--radius-*` token。细则见 `src/ui/AGENTS.md`。
- **Markdown 阅读风格**（`markdown_reading_profile_v1`）：未知值必须 `normalize -> medium`。真源与扩展顺序见 [configuration.md](docs/configuration.md)。
- **Anti-hotlink 规则**（`anti_hotlink_rules_v1`）：命中时自动补 referer 并缓存图片，不阻断主抓取。真源见 [configuration.md](docs/configuration.md)。
- **会话分页**：必须走 `bootstrap + loadMore`，禁止全量读取。契约见 [modules/webclipper.md](docs/modules/webclipper.md)。
- **评论侧栏选区附加**：`selectionchange` 自动触发，reply 输入框不触发。行为边界见 [modules/comments.md](docs/modules/comments.md)。
- **`$` mention**：`$` 触发候选窗，`Tab/Enter` 插入。支持站点与键盘行为见 [modules/webclipper.md](docs/modules/webclipper.md)。

## 贡献约定

- 默认不查看、不编辑 i18n 字段（除非明确要求）。
- Commit message 用 Conventional Commits（如 `refactor:`/`feat:`/`fix:`），一次改动尽量做到可编译、可回滚。
- 重构优先拆成可独立验证的小步：每步至少跑 `npm run compile`。

### 文档同步工作流

1. 先从代码和脚本确认实际行为，再更新文档，不根据旧文档互相抄写。
2. 涉及仓库级行为变化时，优先同步这些入口文档：
   - `AGENTS.md`
   - `docs/overview.md`
   - `docs/overview.md`
   - `README.md`
3. 若 WebClipper 改动涉及设置结构、视觉 tokens、主题模式或共享按钮/导航样式，再同步：
   - `src/ui/AGENTS.md`
   - `README.zh-CN.md`
4. 未被明确要求时，不要查看或编辑国际化字段。
5. 对版本号、DB 版本、权限、迁移等易过期事实，优先在 deepwiki 维护单一权威描述；其他入口文档只保留导航与原则，避免多处写死造成漂移。

## 常用命令

### WebClipper 开发与验证

- 安装依赖：`npm install`
- Chrome 开发模式：`npm run dev`
- Firefox 开发模式：`npm run dev:firefox`
- Safari 开发模式：`npm run dev:safari`
- TypeScript 编译检查：`npm run compile`
- 单元测试：`npm run test`
- Chrome 构建：`npm run build`
- Firefox 构建：`npm run build:firefox`
- Safari 构建：`npm run build:safari`
- Safari Xcode 项目生成：`npm run setup:safari:xcode`
- 产物校验：`npm run check`（Chrome）、`npm run check:safari`（Safari）

### WebClipper 发布相关脚本

- Chrome/Firefox 发布产物打包：`node .github/scripts/webclipper/package-release-assets.mjs`
- AMO Source 包：`node .github/scripts/webclipper/package-amo-source.mjs`
- AMO 发布：`node .github/scripts/webclipper/publish-amo.mjs`
- Edge 发布：`node .github/scripts/webclipper/publish-edge.mjs`

## 测试

当前仓库无强制自动化测试套件，但功能改动需要完成以下验证：

- 单元测试优先覆盖 WebClipper 的核心逻辑（数据转换、状态变化、边界条件），通过协议 + 依赖注入 + Mock 隔离外部依赖。至少覆盖三类场景：数据转换、状态变化、边界条件（空数据、重复数据、异常数据）
- 使用 React/Vitest 的组件或页面预览做 UI 人工验证，至少覆盖加载态、错误态、空态和主流程态。
- 每次改动后执行最小冒烟：扩展可启动、关键数据源可读取、至少一次采集或同步成功、失败路径提示正确。
- 构建校验命令：`npm run compile && npm run test && npm run build`。
