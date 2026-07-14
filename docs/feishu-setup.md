# Feishu DocX 配置

本页面向维护官方 Feishu OAuth 应用和用户自建应用的开发者。运行时行为与存储键以 `src/services/sync/feishu/` 为准。

## 两种模式

| 模式 | client secret 存放位置 | 适用场景 |
| --- | --- | --- |
| 官方应用 + Cloudflare Worker | Worker secret | 公共发行；用户无需填写密钥 |
| 用户自建应用直连 | 扩展 `chrome.storage.local` | 单租户或内部部署；secret 会被备份排除 |

扩展始终只把 OAuth token 保存在本地，并通过备份 denylist 排除 token 和 secret。

## Feishu 应用

1. 在飞书开放平台创建应用。
2. 配置 redirect URI：

```text
https://chiimagnus.github.io/syncnos-oauth/callback
```

3. 开通当前同步链路需要的权限：
   - `docx:document`
   - `docx:document.block:convert`
   - `drive:drive`
4. 权限变更后，测试账号必须 Disconnect 再 Connect，确保新 token 获得新增 scope。
5. 公共应用需要完成发布；开发态只允许测试成员授权。

代码中的授权 URL、redirect URI 和默认 scope 位于 `src/services/sync/feishu/auth/oauth.ts`。不要在文档中复制完整授权链接。

## 官方 Worker

目录：`cloudflare-workers/syncnos-feishu-oauth/`。

```bash
cd cloudflare-workers/syncnos-feishu-oauth
npx wrangler secret put FEISHU_CLIENT_SECRET
npx wrangler deploy
```

公共 `FEISHU_CLIENT_ID` 可配置在 `wrangler.toml`；`FEISHU_CLIENT_SECRET` 必须使用 Worker secret。部署后确认 exchange 和 refresh endpoint 可访问，具体 path 以 Worker router 和 `oauth.ts` 为准。

扩展默认值可通过构建环境变量注入：

```bash
SYNCNOS_FEISHU_OAUTH_CLIENT_ID="cli_xxx" \
SYNCNOS_FEISHU_OAUTH_TOKEN_EXCHANGE_PROXY_URL="https://<worker-host>/feishu/oauth/exchange" \
  npm run build
```

首次启动只在用户没有自定义值时写入默认值。

## 用户自建应用

在 Settings → Feishu → Advanced 填写 App ID 和 App Secret。存在 `feishu_oauth_client_secret` 时，扩展优先直连 Feishu token endpoint，不依赖 Worker。

该模式更简单，但 secret 会保存在本机扩展存储中；不得记录到日志、截图或备份。

## 文档写入流程

1. 根据 conversation kind 选择 chat/article/video 目标文件夹。
2. 解析或创建 Drive 路径。
3. 创建或复用 DocX mapping。
4. 优先调用 Convert API 把 Markdown 转为 blocks。
5. 图片通过 Drive upload + image block replace 做 best-effort 绑定。
6. Convert 或图片失败时按 orchestrator 规则降级，不能把一次图片失败伪装成整篇同步失败。
7. 内容 hash 未变且目标仍存在时可以 `skipped_unchanged`；目标文档被删除时必须重建 mapping。

## 发布前 smoke

- Connect 后能读到有效 token，state 被清理。
- chat/article/video 各同步一条，目标文件夹和 DocX 正确。
- 带图片 Markdown 能写入，单张图片失败只产生 warning。
- 人工让 token 接近过期，确认 refresh 后继续同步。
- 删除目标 DocX，再次同步会创建新文档并更新 mapping。
- Disconnect 会清理 token、pending state、last error 和 job 状态。

## 常见错误

| 错误 | 优先检查 |
| --- | --- |
| client id 未配置 | 官方默认值或 Advanced App ID |
| state mismatch | pending state、重复回调、redirect URI |
| exchange/refresh 失败 | Worker URL、secret、应用发布状态、redirect URI |
| 401/403 Convert | `docx:document.block:convert` scope 与重新授权 |
| 无法创建文件夹 | `drive:drive` scope 与 token 是否为旧权限 |
| 同步显示未变化但文档已删除 | gone-error 判断与 mapping 重建路径 |
