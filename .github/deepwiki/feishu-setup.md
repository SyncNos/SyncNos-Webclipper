<!--
This page is for maintainers (方案 A：官方公共应用 + 官方公共 Worker).
It describes how to set up Feishu OAuth + DocX sync so end users don't need BYO config.
-->

# Feishu（DocX）方案 A：官方公共应用 + Cloudflare Worker 配置指南

本页说明如何把 Feishu（飞书）同步做成“开箱即用”的 **方案 A**：

- 我们维护一个 **官方 Feishu 应用**（提供 `client_id` + `client_secret`）
- 我们维护一个 **Cloudflare Worker**，负责 `code exchange / refresh`（扩展端不存 `client_secret`）
- WebClipper 扩展只内置 **public** 信息（`client_id` + Worker URL），用户无需填写 Advanced 配置

> 安全边界：扩展端只保存 OAuth token（`feishu_oauth_token_v1`，并且会被备份排除）；`client_secret` 只存在于 Worker 的 secret 中。

## 0. 你将改动/维护的东西

- Feishu 应用（飞书开放平台）
  - 你会得到：`client_id`（通常形如 `cli_***`）与 `client_secret`
  - 需要配置：OAuth 重定向地址（redirect URI）、必要权限（scopes）
- Cloudflare Worker（本仓库已提供）
  - 目录：`cloudflare-workers/syncnos-feishu-oauth/`
  - 接口：
    - `POST /feishu/oauth/exchange`（用 `code + redirectUri` 换 token）
    - `POST /feishu/oauth/refresh`（用 `refreshToken` 刷新 token）
- 扩展默认配置（需要在代码里填入）
  - `src/services/sync/feishu/auth/oauth.ts`
    - `DEFAULT_FEISHU_OAUTH_CLIENT_ID`
    - `DEFAULT_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL`

## 1. 创建官方 Feishu 应用（飞书开放平台）

> 下面步骤以飞书开放平台控制台为准。控制台 UI 可能会改版；如果你找不到某个入口，优先在应用详情页左侧菜单里搜索关键字：`凭证` / `安全设置` / `重定向 URL` / `网页应用` / `OAuth` / `权限`。

### 1.1 选择应用类型（非常重要）

要做“方案 A（所有用户开箱即用）”，应用必须满足“非仅限单一企业内部”的可用性。

飞书通常会区分（名称可能略有差异）：

- **企业自建应用**：只面向某一个企业/租户内部使用（适合内部工具、公司 IT）。
- **应用商店 / 第三方应用（公开应用）**：可以面向多个企业/租户安装（适合面向公众的产品）。

如果 SyncNos WebClipper 目标是让任意飞书用户都能授权并同步，优先选择“公开/第三方/应用商店”路线；否则你会遇到“只有开发者/测试成员能授权”的限制。

### 1.2 创建应用（控制台操作路径）

1) 打开飞书开放平台应用列表页（常见入口：`open.feishu.cn/app`）。
2) 点击“创建应用”（或类似按钮）。
3) 选择应用类型（见 1.1），填写：
   - 应用名称（例如：`SyncNos WebClipper`）
   - 应用描述（建议写清：用于把 WebClipper 的 conversation 同步到 Feishu DocX）
   - 应用图标（可后补）

创建完成后进入“应用详情页”。

### 1.3 获取 `client_id / client_secret`（也可能叫 `App ID / App Secret`）

在应用详情页找到“**凭证与基础信息**”（或类似页面），你会看到两类信息：

- `client_id`（常见形态：`cli_xxx`）
- `client_secret`

飞书文档/控制台里有时用 `App ID / App Secret` 命名；在我们代码里：

- `authorizationUrl` 用的是 `app_id=<client_id>`
- token endpoint 用的是 `client_id / client_secret`

所以你只要记住：**`cli_xxx` 就是我们要内置的 client id**。

### 1.4 开启“网页应用 / OAuth 授权码模式（Authorization Code）”

我们的授权 URL 是：

- `https://open.feishu.cn/open-apis/authen/v1/index`

这是“网页应用 OAuth”风格的授权入口（`response_type=code`）。因此你需要在飞书应用里开启或确保启用：

- 网页应用能力（或“网页授权 / OAuth”相关能力）
- 授权方式包含 `Authorization Code`（授权码模式）

如果控制台要求填写“应用首页 / 网站 URL / 回调域名”等信息，按你的产品页面填写即可；但 **redirect URL 白名单**必须按下一节准确配置。

### 1.5 配置 OAuth 重定向地址（Redirect URL 白名单）

本仓库当前固定使用这个回调页（与 Notion OAuth 一致）：

- `https://chiimagnus.github.io/syncnos-oauth/callback`

把它加入飞书应用的“重定向 URL / Redirect URL / 回调地址白名单”里（常见位置：**安全设置 → 重定向 URL**）。

注意：

- 必须是 `https://`。
- 必须和扩展里传的 `redirect_uri` **完全一致**（包括 path）。多一个 `/` 都可能导致 exchange 失败。
- 先保存，再去做授权测试。

### 1.6 配置权限（scopes / 权限点）

MVP 的 Feishu DocX 同步需要这些能力：

1) 读根目录信息（用于拿默认 folder token）

- `GET /drive/explorer/v2/root_folder/meta`

2) 创建 DocX 文档

- `POST /docx/v1/documents`

3) 清空并写入 DocX 文档 block 内容（覆盖写入）

- `GET /docx/v1/documents/{document_id}/blocks/{block_id}/children`
- `DELETE /docx/v1/documents/{document_id}/blocks/{block_id}/children/batch_delete`
- `POST /docx/v1/documents/{document_id}/blocks/{block_id}/children`

在飞书控制台里通常需要你在“权限管理 / API 权限 / 权限点”里勾选与 **云文档（DocX）** 和 **云盘（Drive）** 相关的读写权限（名称会随平台调整）。

建议做法：

- 先只开通“创建/编辑 DocX 文档 + 访问云盘文件夹元信息”这类最小集合。
- 如果你同步时报错（例如 403 / 权限不足 / 特定错误码），再按报错补充权限点，避免一次性开太大。

### 1.7 发布/可用性检查（决定用户能不能用）

- 如果应用仅处于“开发态/测试态”，通常只有开发者/测试成员可授权；要让所有用户可用，需要按飞书的发布流程完成上线。
- 一旦发布后，**client_id 不应该频繁变更**，否则扩展内置默认值会失效。

建议在发布前做一次“最小端到端冒烟”：

- 先用开发者账号完成一次 OAuth 授权，确认能拿到 token（扩展 `feishu_oauth_token_v1` 有值）
- 再触发一次同步，确认能创建 DocX 并写入内容

## 2. 部署官方 Cloudflare Worker（token exchange / refresh）

Worker 目录：`cloudflare-workers/syncnos-feishu-oauth/`

### 2.1 Wrangler 配置

文件：`cloudflare-workers/syncnos-feishu-oauth/wrangler.toml`

- `FEISHU_CLIENT_ID`：可以写入并提交（public 信息）
- `FEISHU_CLIENT_SECRET`：必须用 wrangler secret 注入（不要提交到 git）

### 2.2 发布步骤（示例）

在仓库根目录执行：

```bash
rtk cd cloudflare-workers/syncnos-feishu-oauth
rtk npx wrangler deploy
```

设置 secret（第一次部署前或部署后都可以）：

```bash
rtk cd cloudflare-workers/syncnos-feishu-oauth
rtk npx wrangler secret put FEISHU_CLIENT_SECRET
```

### 2.3 Worker 域名/URL 是什么？

Worker 的 `name` 来自 `wrangler.toml`：

- `name = "syncnos-feishu-oauth"`

Cloudflare 会给出一个 `*.workers.dev` 的默认域名（也可以绑定自定义域名）。

你需要记下最终可访问的 URL，并确保以下两个 endpoint 可用：

- `https://<worker-host>/feishu/oauth/exchange`
- `https://<worker-host>/feishu/oauth/refresh`

> 这里的 `<worker-host>` 由 Cloudflare 决定（或你绑定的自定义域名决定）；扩展侧只需要知道最终的 `exchange` URL。

## 3. 让扩展“开箱即用”（写入默认值）

扩展的 Feishu OAuth 默认值在：

- `src/services/sync/feishu/auth/oauth.ts`

你可以选择两种方式把“官方值”喂给扩展：

### 方式 A：直接在代码里填默认值（最直观）

把下面两个常量改成“官方值”：

- `DEFAULT_FEISHU_OAUTH_CLIENT_ID = "<cli_xxx>"`
- `DEFAULT_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL = "https://<worker-host>/feishu/oauth/exchange"`

### 方式 B：用构建时环境变量注入（推荐先用，后续再决定是否写死）

本仓库已支持在构建时通过环境变量注入默认值（不会写进源代码）：

- `SYNCNOS_FEISHU_OAUTH_CLIENT_ID`
- `SYNCNOS_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL`

示例（本地构建/开发）：

```bash
rtk SYNCNOS_FEISHU_OAUTH_CLIENT_ID="cli_xxx" \
  SYNCNOS_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL="https://<worker-host>/feishu/oauth/exchange" \
  npm run dev
```

当这两个默认值存在时：

- 首次安装/启动 background 会 best-effort 写入默认值（如果用户没有自定义覆盖）
- Settings → Feishu 会自动展示出默认 client id / proxy URL（用户无需手动填写）
- 用户点击 “Connect” 会直接打开飞书授权页并完成连接

## 4. 冒烟验证清单（建议）

1) 连接验证

- Settings → Feishu → Connect
- 授权后回到扩展，状态变为 Connected
- `chrome.storage.local` 里出现 `feishu_oauth_token_v1`

2) 同步验证（MVP）

- 会话列表选择 1 条 conversation，触发 “Sync to Feishu”
- 飞书侧出现 DocX 文档，内容为纯文本（markdown 原样写入分段）

3) 刷新验证（token refresh）

- 等待 token 接近过期或手动缩短 `expiresAt`（仅开发时），再次触发同步
- 确认 worker `POST /feishu/oauth/refresh` 被调用且同步成功

## 5. 常见问题

### 5.1 点击 Connect 没反应

优先检查 Settings 顶部是否出现错误提示（error banner）。

- 如果提示 `Feishu OAuth client id not configured`，说明扩展默认 client id 仍为空、且用户也没填 Advanced。

### 5.2 授权后一直 Waiting / 报 token exchange 失败

通常是以下几类问题：

- Worker 未部署或 URL 配错（`/exchange` 路径不对）
- Worker secret 未设置（`FEISHU_CLIENT_SECRET` 为空）
- 飞书应用的 redirect URI 未包含 `https://chiimagnus.github.io/syncnos-oauth/callback`
- 飞书应用尚未发布，当前账号不在可授权范围内
