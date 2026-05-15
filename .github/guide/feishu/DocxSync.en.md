# Feishu DocX Sync Setup (WebClipper)

This guide explains how to sync **SyncNos WebClipper** content to **Feishu Docs (DocX)**.

You need to create a Feishu app in the Feishu Open Platform first, then connect it in WebClipper (Settings → Feishu).

## Choose ONE connection mode

### Mode A: Use a Cloudflare Worker (safer, but you must deploy your own)

Use this if you don’t want to store your Feishu App Secret in the browser locally.

You will:

1. Deploy your own Cloudflare Worker (worker source code is included in this repo)
2. Configure your Feishu `App ID / App Secret` in the Worker
3. Paste the Worker `exchange` URL back into WebClipper

Fill in WebClipper:

- `App ID (Client ID)`: your Feishu App ID (looks like `cli_***`)
- `Proxy URL (Worker)`: your Worker endpoint, for example:
  - `https://<your-worker-host>/feishu/oauth/exchange`

> Note: the default Worker URL in this repo may be maintained by an individual and is not guaranteed to work for everyone. If you choose Mode A, you will typically need to deploy your own Worker.

### Mode B: No Worker (easier, but the secret is stored locally)

Use this if you want the simplest setup and you accept storing the App Secret locally in your browser.

Fill in WebClipper:

- `App ID (Client ID)`: your Feishu App ID
- `App Secret (Client Secret)`: your Feishu App Secret
- `Proxy URL (Worker)`: leave empty

## Step 1: Create a Feishu app

In Feishu Open Platform (`open.feishu.cn/app`), create an app and obtain:

- App ID (Client ID)
- App Secret (Client Secret)

### Configure Redirect URL

Add this redirect URL:

```
https://chiimagnus.github.io/syncnos-oauth/callback
```

### Required Scopes

At minimum:

- `docx:document`
- `drive:drive`

## Step 2: Connect in WebClipper

1. Open WebClipper → `Settings`
2. Go to `Feishu`
3. Open `Advanced`
4. Fill settings based on Mode A or B, then click `Save`
5. Click `Connect` and finish authorization in the opened Feishu tab

## Troubleshooting

### Stuck on Waiting / token exchange failed

- Mode A: verify your Worker URL is correct and includes `/feishu/oauth/exchange`
- Mode B: verify `App Secret (Client Secret)` is filled

