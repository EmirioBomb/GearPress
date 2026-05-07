---
title: jsDelivr
tags:
  - CDN
  - jsDelivr
createTime: 2026/04/29 10:35:06
permalink: /en/notes/network/cdn/js-delivr/
---

## 📌 What is jsDelivr

::: note

[`jsDelivr`](https://www.jsdelivr.com/) is ==`a free CDN (Content Delivery Network)`== for open source files. It is tightly integrated with ==GitHub== and ==NPM==, making it easy to use as a reliable CDN for almost any open source projects.

:::

## ✨ Features

::: note `jsDelivr`’s ==stability== may vary by network, but it’s been reliable enough for my use.
:::

* 🆓 Free to use
* ⚡  No registration required, simply include a single link to get started
* 🌍 Powered by a global CDN network
* 📦 Supports GitHub / npm

## 🚀 GitHub + jsDelivr

::: note Example repository: `EmirioBomb/media-collections`
:::

### 1️⃣ CDN link

::: info Root endpoint: `https://cdn.jsdelivr.net`
:::

::: details Click to see more about `CDN URL` Structure

```text:no-line-numbers

https://cdn.jsdelivr.net/gh/user/demo@1.0.0/app.js
         |          │    │   │     │     │     │
         |          │    │   │     │     │     └──── asset
         |          │    │   │     │     │
         |          │    │   │     │     └────────── version or branch, like v1.0.0 or main
         |          │    │   │     │ 
         |          │    │   │     └──────────────── repo
         |          │    │   │
         |          │    │   └────────────────────── user
         |          │    │   
         |          │    └────────────────────────── delivery type (gh: Github, npm: npm, etc.)
         |          │
         |          └─────────────────────────────── domain
         |
         └────────────────────────────────────────── API identifier (cdn: jsDelivr link, purge: purge cache)

```

:::

::: tabs

@tab 📥 Before

```text:no-line-numbers
https://github.com/EmirioBomb/media-collections/blob/main/GearPress/notes/jsdelivr-tool-github.png
```

@tab ⚡ After `(@branch)`

```text:no-line-numbers
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png
```

@tab ⚡ After `(@version)`

```text:no-line-numbers
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@1.0.3/GearPress/notes/jsdelivr-tool-github.png
```

:::

::: details Check the official `jsDelivr GitHub docs` for more details

<CardGrid cols=2>
    <LinkCard icon="mdi:web" title="Github Quick Start" href="https://www.jsdelivr.com/?docs=gh" />
    <LinkCard icon="mdi:web" title="GitHub Documentation " href="https://www.jsdelivr.com/documentation#id-github" />
</CardGrid>

:::

### 2️⃣ Official Tools

::: info Paste ==Github link==, and it will be easily converted to ==jsDelivr links==
:::

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png" />

::: tabs

@tab 📥 Before

```text:no-line-numbers
https://github.com/EmirioBomb/media-collections/blob/main/GearPress/notes/jsdelivr-tool-github.png
```

@tab ⚡ After

```text:no-line-numbers
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png
```

:::

## 💡 Why no immediate update

::: warning Why doesn’t my GitHub file update show up right away?
:::

### 💬 Why it happens

::: note

* 🌍 jsDelivr uses CDN caching instead of real-time GitHub access
* 📦 Same URLs usually serve cached files
* ⏳ Cache updates are not applied immediately

:::

<LinkCard title="👉 Official reference for Caching logic" href="https://www.jsdelivr.com/documentation#id-caching" />

### 🛠️ How to fix it

#### 1️⃣ @version

::: important

`@version` uses GitHub `releases/tags (e.g. v1.0.1)`

* `No Release` → use @branch, or `purge cache` if needed.
* `Same version after a push?` You may still hit cache → just `purge cache` if needed.

:::

```text:no-line-numbers title="👉 @version (@1.0.13)"
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@1.0.13/GearPress/notes/jsdelivr-tool-github.png
```

#### 2️⃣ Purge Cache Tool

::: warning

* Use `jsDelivr Link` (not the original GitHub Link) when purging cache
* Batch supported

:::

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-purge-github.png" />

#### 3️⃣ Purge Cache Link

::: info info Root endpoint: `https://purge.jsdelivr.net`
:::

::: tabs

@tab ⚡ jsDelivr Link

```text:no-line-numbers
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png
```

@tab 🔄 Purge cache link

```text:no-line-numbers
# @branch
https://purge.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png

# @version
https://purge.jsdelivr.net/gh/EmirioBomb/media-collections@1.0.3/GearPress/notes/jsdelivr-tool-github.png

```

::: details Click to view the `response`

```json{3}:no-line-numbers
{
  "id": "5n6hHPRbLiwAaGQP",
  "status": "finished", // final result
  "timestamp": "2026-04-30T02:03:41.355Z",
  "paths": {
    "/gh/EmirioBomb/media-collections@1.0.13/GearPress/notes/jsdelivr-tool-github.png": {
      "throttled": false,
      "providers": {
        "CF": true,
        "FY": true
      }
    }
  }
}
```

:::

::: warning

If the latest content is still not visible after running `purge`, try `clearing your browser cache` or reopening the page in `incognito/private mode`.

:::
