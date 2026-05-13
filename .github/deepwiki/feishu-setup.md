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

1) 登录飞书开放平台开发者后台，创建一个新应用（用于 SyncNos WebClipper）。

2) 记录应用凭据（后面会用到）

- `client_id`（通常形如 `cli_xxx`）
- `client_secret`

3) 配置 OAuth 重定向地址（redirect URI）

本仓库当前固定使用这个回调页（与 Notion OAuth 一致）：

- `https://chiimagnus.github.io/syncnos-oauth/callback`

你需要把它加入到飞书应用的 OAuth 配置里（飞书控制台 UI 的字段名可能略有差异，目标是让授权结束后能跳回这个地址）。

4) 配置权限（scopes / 权限点）

MVP 的 Feishu 同步会做三件事：

- 读根目录信息（用于拿到默认 folder token）：`GET /drive/explorer/v2/root_folder/meta`
- 创建 DocX 文档：`POST /docx/v1/documents`
- 清空并写入 DocX 文档内容（block API）

因此应用需要具备“Drive/DocX 相关的读写权限”。具体权限名称以飞书开放平台后台为准；配置完成后建议用测试账号先走通授权，再提交审核/发布。

5) 发布/可用性检查

- 如果应用仅处于“开发态/测试态”，通常只有开发者/测试成员可授权；要让所有用户可用，需要按飞书的发布流程完成上线。
- 一旦发布后，**client_id 不应该频繁变更**，否则扩展内置默认值会失效。

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
