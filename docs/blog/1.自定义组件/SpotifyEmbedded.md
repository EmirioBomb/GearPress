---
title: Spotify网页播放器-SpotifyEmbedded
tags:
    - 组件
    - Spotify
    - 网页播放器
cover: https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/post-cover/spotify.png
createTime: 2026/05/14 09:35:00
permalink: /blog/spotify-embedded/
---

::: tip 基于 `Spotify Embed URL` 封装的 `网页播放器` 组件，支持样式与展示方式的可配置化扩展。
:::

<!-- more -->

## 💡 动机

::: info 为什么要做这个组件？

* 统一 Spotify Embed 的样式与布局控制
* 支持多展示模式以适配不同页面场景
* 原生 ==iframe== 不支持 `normal` 与 `compact` 模式的响应式自动切换。

:::

## 🎯 设计目标

::: info 可配置能力

* ✅ 支持切换播放列表
* ✅ 支持展示模式控制（常规模式 / 紧凑模式 / 自适应模式）

:::

## 🎧 获取 Embedded playlist

<LinkCard icon="mdi:web" title="参考 Spotify 嵌入式播放器相关文档" href="https://developer.spotify.com/documentation/embeds" />

::: details

:::: steps

1. ==入口==

    <ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/spotify-player1.png" />

2. ==生成代码==

    <ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/spotify-player2.png" />

3. ==获取代码==

    ::: tip ==常规模式== 与 ==紧凑模式==，差别仅为播放器高度而已常规模式与紧凑模式仅在高度上不同，其它展示行为一致。
    * 常规模式高度: 352px
    * 紧凑模式高度: 152px
    :::

    ::: tabs

    @tab 📥 常规模式

    ```html:no-line-numbers
    <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/50zTqYDKkup6TbU3TFpdN3?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    ```

    @tab ⚡ 紧凑模式

    ```html:no-line-numbers
    <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/50zTqYDKkup6TbU3TFpdN3?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    ```

    :::

    ::: important 上述代码中 `50zTqYDKkup6TbU3TFpdN3` 即为该组件的 `playlistId`
    :::

::::

## ✍️ 实现步骤

:::: steps

1. ==编写组件==

    ::: details 新建组件文件，路径为: `.vuepress/theme/components/about/SpotifyEmbedded.vue`，并实现如下内容

    @[code vue](../../.vuepress/theme/components/about/SpotifyEmbedded.vue)

    :::

2. ==注册组件==

    ::: note 修改如下文件: `.vuepress/theme/client.ts`
    :::

   ```ts :collapsed-lines title=".vuepress/theme/client.ts"
    import { defineClientConfig } from 'vuepress/client'
    import SpotifyEmbedded from './theme/components/about/SpotifyEmbedded.vue' // [!code ++] 

    export default defineClientConfig({
      enhance({ app }) {
          app.component('SpotifyEmbedded', SpotifyEmbedded) // [!code ++] 
      },
    })
   ```

3. ==使用组件==

    ::: note 该组件可在任意位置使用，例如文章或博客中
    :::

    ```ts :collapsed-lines title="docs/README.md"
    <SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" />
    ```

    ::: warning 注意
    若是在 `首页` 使用组件时，请确保在首页的 `Frontmatter` 中配置 `type: custom`，否则组件不生效

      ::: details 点击展开

      ```ts title="docs/README.md"
        ---
        home: true
        pageLayout: home
        externalLinkIcon: false
        config:
        - type: custom  // [!code ++] 
        ---
      ```

      :::

    :::

4. ==组件效果==

    <SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" :height=352 />

::::

## 📖 属性定义

:::: field-group

::: field name="playlistId" type="string"
Spotify 播放列表 ID
:::

::: field name="mode" type="'normal' | 'compact' | 'full'" default="normal" optional
强制显示模式

* `normal`: 常规模式，默认高度 `352px`
* `compact`: 紧凑模式，默认高度 `152px`
* `full`: 自适应布局模式，高度 `继承` 父级容器的尺寸
:::

::: field name="height" type="number" optional
组件高度，设置高度后，忽略 `mode`
:::

::::

## 🚀 用法用例

::: table full-width title="强制显示模式" max-content

| 模式 | 说明 | 样例 |
| -- | -- | -- |
| 默认 | 默认: `常规模式` | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" />` |
| 强制常规 | 高度始终为 352px | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="normal" />` |
| 强制紧凑 | 高度始终为 152px | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="compact" />` |
| 自适应模式 | 高度继承父级容器的尺寸 | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="full" />` |
| 自定义高度 | 设置为指定高度 | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" :height="152" />` |

:::

## ✨ 效果预览

### 1️⃣ 默认模式

<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" />

### 2️⃣ 强制常规模式

<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="normal" />

### 3️⃣ 强制紧凑模式

<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="compact" />

### 4️⃣ 自适应模式

::: warning 若`无父容器`，不建议使用该 `模式`，使用时需手动指定 `height: 152`

```vue:no-line-numbers
<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="full" :height=152 />
```

:::

<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="full" :height=152 />

### 5️⃣ 自定义高度

<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" :height=152 />

## 💭 启发

### 🎵 Apple Music Playlist

::: note 同理，也可以尝试封装 `Apple Music`
:::

<LinkCard icon="mdi:web" title="参考 Apple Music Marketing Tools" href="https://toolbox.marketingtools.apple.com/en-us/apple-music/cn?q=" />

```html:no-line-number
<iframe height="450" width="100%" title="Media player" src="https://embed.music.apple.com/cn/album/first-kiss/1443278696?itscg=30200&amp;itsct=music_box_player&amp;ls=1&amp;app=music&amp;mttnsubad=1443278696&amp;theme=auto" id="embedPlayer" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" allow="autoplay *; encrypted-media *; clipboard-write" style="border: 0px; border-radius: 12px; width: 100%; height: 450px; max-width: 660px;"></iframe>
```

<iframe height="450" width="100%" title="Media player" src="https://embed.music.apple.com/cn/album/first-kiss/1443278696?itscg=30200&amp;itsct=music_box_player&amp;ls=1&amp;app=music&amp;mttnsubad=1443278696&amp;theme=auto" id="embedPlayer" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" allow="autoplay *; encrypted-media *; clipboard-write" style="border: 0px; border-radius: 12px; width: 100%; height: 450px; max-width: 660px;"></iframe>

## 🔖 总结

::: info

本组件对 Spotify 官方 iframe 做了轻量封装，统一了展示样式，并通过 mode 和 breakpoint 提供简单的展示与响应式切换能力，让嵌入使用更便捷一致。

:::
