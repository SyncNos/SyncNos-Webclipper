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

## 方案 B（用户自建应用）：不使用 Worker，直接在扩展内填写密钥

如果你的使用场景是“每个用户/每个企业自己创建飞书 **企业自建应用**”，并且希望省去部署 Cloudflare Worker 的步骤，可以使用 **方案 B**：

- 用户在 Settings → Feishu → Advanced 中填写：
  - `feishu_oauth_client_id`（App ID）
  - `feishu_oauth_client_secret`（App Secret，敏感信息，备份会排除）
- 扩展会优先走 **直连** token exchange/refresh（不再依赖 `feishu_oauth_token_exchange_proxy_url`）

> 取舍：方案 B 更易上手，但 `client_secret` 会保存在扩展的 `chrome.storage.local` 中（仍会被备份排除）。

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

> 以飞书开放平台控制台为准（`open.feishu.cn/app`）。找不到入口时，在应用详情页左侧菜单搜索：`凭证` / `安全设置` / `重定向 URL` / `网页应用` / `权限`。

### 1.1 选择应用类型

- **企业自建应用**：仅限单一企业/租户内部使用。
- **商店应用（公开应用）**：可面向多个企业/租户安装，适合面向公众的产品。

SyncNos WebClipper 要让任意飞书用户授权同步 → 选择 **商店应用** 路线，否则只有开发者/测试成员能授权。

### 1.2 创建应用

1. 打开 [开发者后台](https://open.feishu.cn/app)，点击「创建应用」。
2. 选择应用类型（见 1.1），填写：
   - 应用名称：`SyncNos WebClipper`
   - 应用描述：用于把 WebClipper 的 conversation 同步到 Feishu DocX
   - 应用图标（可后补）
3. 创建完成后进入「应用详情页」。

### 1.3 获取 App ID / App Secret

在应用详情页 → **凭证与基础信息**：

- **App ID**（格式 `cli_xxx`）= 代码中的 `client_id`
- **App Secret** = 代码中的 `client_secret`

### 1.4 配置重定向 URL

**开发配置 → 安全设置** → **重定向 URL**，添加：

```
https://chiimagnus.github.io/syncnos-oauth/callback
```

注意：

- 必须是 `https://`。
- 必须和扩展传的 `redirect_uri` **完全一致**（包括 path，多一个 `/` 都会失败）。
- 一个应用最多 300 个重定向 URL。

### 1.5 配置权限（Scopes）

**开发配置** → **权限管理** → **API 权限**，搜索并开通以下 scope：

| 能力 | API 路径 | Scope Key |
| --- | --- | --- |
| 读取云盘根目录（拿 folder token） | `GET /open-apis/drive/explorer/v2/root_folder/meta` | `drive:drive` 或 `drive:drive:readonly` |
| 列出目录内容（按路径查找 folder） | `GET /open-apis/drive/v1/files` | `drive:drive`（建议） |
| 创建目录（路径不存在时自动创建） | `POST /open-apis/drive/v1/files/create_folder` | `drive:drive` |
| 创建 DocX 文档 | `POST /open-apis/docx/v1/documents` | `docx:document` 或 `docx:document:create` |
| **Markdown/HTML 转 blocks（Convert）** | `POST /open-apis/docx/v1/documents/blocks/convert` | `docx:document.block:convert` |
| 获取文档子块列表 | `GET /open-apis/docx/v1/documents/{id}/blocks/{id}/children` | `docx:document` |
| 批量删除子块 | `DELETE /open-apis/docx/v1/documents/{id}/blocks/{id}/children/batch_delete` | `docx:document` |
| 创建子块（写入内容） | `POST /open-apis/docx/v1/documents/{id}/blocks/{id}/children` | `docx:document` |

**当前默认配置**：`docx:document` + `docx:document.block:convert` + `drive:drive`（默认会在云盘根目录创建/使用三类文件夹：`SyncNos-AIChats` / `SyncNos-WebArticles` / `SyncNos-Videos`；也可在 Settings → Feishu → Feishu Paths 中分别自定义，目录不存在会自动创建）。

注意：
- `docx:document.block:convert` 是高级权限：即使你已经开通了 `docx:document`，Convert 仍可能返回 401/403。
- scope 升级后必须让用户 **Disconnect → Connect** 重新授权（刷新 token 不保证自动获得新增 scope）。
- 如果你之前用的是 `drive:drive:readonly`，升级后同样需要 **Disconnect → Connect** 重新授权，否则旧 token 可能无创建目录权限。

---

### 1.6 OAuth 授权流程（代码实现参考）

#### 构造授权链接

**授权端点**：`https://accounts.feishu.cn/open-apis/authen/v1/authorize`

完整示例：

```jsx
https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=cli_xxxxx&redirect_uri=https%3A%2F%2Fchiimagnus.github.io%2Fsyncnos-oauth%2Fcallback&response_type=code&scope=docx%3Adocument%20docx%3Adocument.block%3Aconvert%20drive%3Adrive&state=RANDOM_STATE
```

**参数说明：**

| 参数 | 必须 | 说明 |
| --- | --- | --- |
| `client_id` | ✅ | App ID（`cli_xxx`），在【凭证与基础信息】获取 |
| `redirect_uri` | ✅ | 重定向地址，须在白名单内，需 URL 编码 |
| `response_type` | ✅ | 固定为 `code` |
| `scope` | 推荐 | 空格分隔的权限（如 `docx:document docx:document.block:convert drive:drive`），须已在控制台开通，否则报错 20027 |
| `state` | 可选 | 防 CSRF 随机字符串，回调时原样返回 |

同步写入策略（以代码为准）：
- Markdown 渲染优先走 Convert（尽量保留标题/列表/代码块/表格等结构）
- 图片会在 Convert 写入后通过 `drive/v1/medias/upload_all` + `replace_image` 做 best-effort 绑定；单张失败会记录 warnings，不应阻断整篇同步

#### 用授权码换取 user_access_token

用户授权后浏览器重定向到 `redirect_uri?code=xxx&state=xxx`。后端用 code 换 token：

- **请求**：`POST https://open.feishu.cn/open-apis/authen/v2/oauth/token`
- **请求体**：

```json
{
  "grant_type": "authorization_code",
  "client_id": "cli_xxxxx",
  "client_secret": "你的 App Secret",
  "code": "用户授权返回的 code",
  "redirect_uri": "https://chiimagnus.github.io/syncnos-oauth/callback"
}
```

- **返回**：`user_access_token`、`refresh_token`、`expires_in` 等。
- **刷新 token**：同一端点，`grant_type` 改为 `refresh_token`，传 `refresh_token` 即可续期。
- code 有效期 5 分钟，只能用一次。
- `user_access_token` 的权限是累积的——用户历史授予的所有 scope 都会包含在最新 token 中。

---

### 1.7 发布与冒烟测试

- 应用处于「开发态/测试态」时，只有开发者/测试成员可授权。要让所有用户可用，须完成发布上线流程。
- 发布后 **App ID 不应频繁变更**，否则扩展内置默认值失效。

发布前做一次最小端到端冒烟：

1. 用开发者账号完成 OAuth 授权，确认拿到 token（扩展 `feishu_oauth_token_v1` 有值）。
2. 触发一次同步，确认能创建 DocX 并写入内容。

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

当前仓库已内置官方 `client_id`（以 `cloudflare-workers/syncnos-feishu-oauth/wrangler.toml` 的 `FEISHU_CLIENT_ID` 为准），你可以选择两种方式把“官方值”喂给扩展：

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

1. 连接验证

- Settings → Feishu → Connect
- 授权后回到扩展，状态变为 Connected
- `chrome.storage.local` 里出现 `feishu_oauth_token_v1`

2. 同步验证（DocX）

- 会话列表选择 1 条 conversation，触发 “Sync to Feishu”
- 如在 popup 触发同步：会先弹出“建议打开标签页版进行同步”的提示（可勾选不再提示），确认后会打开 tab view 进行同步
- 飞书侧出现 DocX 文档：
  - 默认写入到云盘根目录下的三类文件夹之一（`SyncNos-AIChats` / `SyncNos-WebArticles` / `SyncNos-Videos`，也可在 Settings → Feishu Paths 自定义路径；不存在会自动创建）
  - 优先尝试 Convert API（markdown→DocX blocks）；权限不足或转换失败时会回退为纯文本 blocks 写入
  - markdown 内包含图片时会尝试上传并插入；失败时仍会回退为纯文本 blocks（以确保文档至少可生成）
- 回到扩展 detail header，右上角 `Open in...` 菜单应出现 `Open in Feishu` 并可打开对应 DocX

3. 刷新验证（token refresh）

- 等待 token 接近过期或手动缩短 `expiresAt`（仅开发时），再次触发同步
- 确认 worker `POST /feishu/oauth/refresh` 被调用且同步成功

4. 删除文档回归（建议）

- 在飞书端把刚创建的 DocX 移到回收站 / 删除
- 回到扩展再次触发同步：应自动创建新 DocX 并更新 mapping（不会因为 `skipped_unchanged` 而无动作）

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
