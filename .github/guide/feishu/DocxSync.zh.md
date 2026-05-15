# 飞书 DocX 同步配置指南（WebClipper）

本指南说明如何把 **SyncNos WebClipper** 的内容同步到 **飞书云文档（DocX）**。

你需要先在飞书开放平台创建一个应用，然后在 WebClipper 的 Settings → Feishu 里完成连接。

## 先选一种连接方式（二选一）

### 方式 A：使用 Cloudflare Worker（更安全，但需要你自己部署）

适合你不想把 App Secret 保存到浏览器本机的情况。

你需要：

1. 自己部署一个 Cloudflare Worker（本仓库已提供 worker 源码）
2. 在 Worker 里配置你的飞书 `App ID / App Secret`
3. 把 Worker 的 `exchange` 地址填回 WebClipper

在 WebClipper 里填写：

- `App ID (Client ID)`：你的飞书 App ID（形如 `cli_***`）
- `代理 URL（Worker）`：你的 Worker 地址，格式类似：
  - `https://<your-worker-host>/feishu/oauth/exchange`

> 注意：仓库里默认的 Worker URL 可能是维护者个人的地址，不保证对所有用户可用。你如果选择方式 A，通常需要部署你自己的 Worker。

### 方式 B：不使用 Worker（更省事，但会把密钥保存在本机）

适合你想最快跑通同步，且可以接受密钥保存在本机浏览器的情况。

在 WebClipper 里填写：

- `App ID (Client ID)`：你的飞书 App ID
- `App Secret (Client Secret)`：你的飞书 App Secret
- `代理 URL（Worker）`：留空

## 第 1 步：创建飞书应用

在飞书开放平台（`open.feishu.cn/app`）创建应用并获取：

- App ID（Client ID，形如 `cli_***`）
- App Secret（Client Secret）

### 配置重定向 URL

在应用的安全设置中添加重定向 URL：

```
https://chiimagnus.github.io/syncnos-oauth/callback
```

> 必须完全一致（多一个 `/` 都会失败）。

### 配置权限（Scopes）

至少需要：

- `docx:document`
- `drive:drive`

## 第 2 步：在 WebClipper 里连接飞书

1. 打开 WebClipper → `Settings`
2. 进入 `Feishu`
3. 展开 `Advanced`
4. 按你选择的方式（A 或 B）填写配置并 `Save`
5. 点击 `Connect`，在新打开的飞书页面里完成授权

连接成功后：

- 扩展会保存 OAuth token（`feishu_oauth_token_v1`，会被备份排除）
- 你可以对任意会话执行 “Sync to Feishu”，在云盘根目录下默认会创建/使用：
  - `SyncNos-AIChats`
  - `SyncNos-WebArticles`
  - `SyncNos-Videos`

## 常见问题

### 一直显示 Waiting / token exchange 失败

优先检查你选的是哪种方式：

- 方式 A：确认你部署的 Worker URL 正确，且包含 `/feishu/oauth/exchange`
- 方式 B：确认已填写 App Secret（Client Secret）

