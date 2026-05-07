---
title: jsDelivr
tags:
  - CDN
  - jsDelivr
  - 内容分发网络
createTime: 2026/04/28 15:22:17
permalink: /notes/network/cdn/js-delivr/
---

## 📌 什么是 jsDelivr

::: note

[`jsDelivr`](https://www.jsdelivr.com/) 是一个为开源项目提供的 ==免费 CDN（内容分发网络）==。它与 ==GitHub== 和 ==npm== 深度集成，能够为绝大多数开源项目自动提供稳定可靠的加速服务

:::

## ✨ 核心特点

::: note `jsDelivr` 的 ==稳定性== 受网络环境等因素影响，不同用户体验可能存在差异；就我个人使用来看，基本能够满足需求
:::

* 🆓 免费使用
* ⚡  无需注册，一行链接，开箱即用
* 🌍 全球 CDN 加速
* 📦 支持 GitHub / npm

## 🚀 如何加速GitHub静态资源

::: note 下面以我个人仓库 `EmirioBomb/media-collections` 为例
:::

### 1️⃣ 使用CDN链接

::: info 统一访问入口：`https://cdn.jsdelivr.net`
:::

::: details 点击展开 `jsDelivr 加速后的 URL` 结构说明

```text:no-line-numbers

https://cdn.jsdelivr.net/gh/user/demo@1.0.0/app.js
         |          │    │   │     │     │     │
         |          │    │   │     │     │     └──── 资源路径
         |          │    │   │     │     │
         |          │    │   │     │     └────────── 版本号 / 分支名（如 v1.0.0 / main）
         |          │    │   │     │ 
         |          │    │   │     └──────────────── 仓库名
         |          │    │   │
         |          │    │   └────────────────────── 用户名
         |          │    │   
         |          │    └────────────────────────── 分发类型（gh: Github, npm: npm）
         |          │
         |          └─────────────────────────────── jsDelivr 域名
         |
         └────────────────────────────────────────── API 标识 （cdn: jsDelivr 链接, purge: 清理缓存）

```

:::

::: tabs

@tab 📥 加速前

```text:no-line-numbers
https://github.com/EmirioBomb/media-collections/blob/main/GearPress/notes/jsdelivr-tool-github.png
```

@tab ⚡ 加速后 `（@分支）`

```text:no-line-numbers
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png
```

@tab ⚡ 加速后 `（@版本号）`

```text:no-line-numbers
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@1.0.3/GearPress/notes/jsdelivr-tool-github.png
```

:::

::: details 具体可参考 `jsDelivr` 官方提供的 `GitHub` 使用说明

<CardGrid cols=2>
    <LinkCard icon="mdi:web" title="Github简单说明" href="https://www.jsdelivr.com/?docs=gh" />
    <LinkCard icon="mdi:web" title="Github详细说明" href="https://www.jsdelivr.com/documentation#id-github" />
</CardGrid>

:::

### 2️⃣ 使用官方生成工具

::: info 将==原资源地址==粘贴到下方输入框中，页面会自动转换为对应的==jsDelivr 加速链接==
:::

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png" />

::: tabs

@tab 📥 加速前

```text:no-line-numbers
https://github.com/EmirioBomb/media-collections/blob/main/GearPress/notes/jsdelivr-tool-github.png
```

@tab ⚡ 加速后

```text:no-line-numbers
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png
```

:::

## 💡 为什么更新文件后没有立即生效？

::: warning 当你在 GitHub 中更新`相同路径`的文件时，为什么改动不会立即生效？
:::

### 💬 问题原因

::: note

* 🌍 jsDelivr 使用 CDN 缓存，不实时访问 GitHub
* 📦 同一 URL 会优先返回缓存内容
* ⏳ 缓存更新有延迟

:::

<LinkCard title="👉 参考官方缓存机制说明" href="https://www.jsdelivr.com/documentation#id-caching" />

### 🛠️ 解决方案

#### 1️⃣ 使用@版本号

::: important

`@版本号`引用方式，对应 GitHub 的 `Release / Tag（如 v1.0.1）`。

* 若`从未发布过版本`，则无法使用该方式，推荐使用 `@分支` 方式，若未生效，请尝试 `清除缓存`
* 若`已发布过版本`，当版本号不变（仅 push 未发版）时，仍会返回缓存的旧内容，推荐使用 `清除缓存`

:::

```text:no-line-numbers title="👉 @版本号（如 @1.0.13）"
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@1.0.13/GearPress/notes/jsdelivr-tool-github.png
```

#### 2️⃣ 清除缓存（官方工具）

::: warning

* 手动清理缓存应使用 `加速后的 CDN 地址`，而不是 `原地址`
* 可批量清理多个资源的缓存

:::

<ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-purge-github.png" />

#### 3️⃣ 清除缓存（地址调用）

::: info 统一访问入口：`https://purge.jsdelivr.net`
:::

::: tabs

@tab ⚡ 加速后的 CDN 地址

```text:no-line-numbers
https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png
```

@tab 🔄 清理缓存地址

```text:no-line-numbers
# @分支
https://purge.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/jsdelivr-tool-github.png

# @版本号
https://purge.jsdelivr.net/gh/EmirioBomb/media-collections@1.0.3/GearPress/notes/jsdelivr-tool-github.png

```

::: details 点击查看 `响应结果`

```json{3}:no-line-numbers
{
  "id": "5n6hHPRbLiwAaGQP",
  "status": "finished", // 清理缓存结果
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

如果执行 `purge` 后仍未看到最新内容，请尝试 `清除浏览器缓存`，或使用 `无痕模式` 重新访问。

:::
