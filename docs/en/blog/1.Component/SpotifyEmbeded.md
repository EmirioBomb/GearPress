---
title: Spotify Embeded Player-SpotifyEmbeded
tags:
    - Component
    - Spotify
    - Web Player
cover: https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/post-cover/spotify.png
createTime: 2026/05/14 09:35:00
permalink: /en/blog/spotify-embeded/
---

::: tip A web player component based on `Spotify Embed playlist`
:::

<!-- more -->

## 💡 Motivation

::: info Why I built this?

* Controls player layout style
* Supports multiple display modes to suit different page needs
* The native ==iframe== doesn’t support responsive switching between `normal` and `compact` modes

:::

## 🎯 Goals

::: info Configurable Props

* ✅ Supports playlist switching
* ✅ Supports display mode control (normal mode / compact mode)
* ✅ Supports responsive adaptation (automatic switching based on breakpoints)

:::

## 🎧 Get Embeded playlist

<LinkCard icon="mdi:web" title="Spotify Embed Player documentation" href="https://developer.spotify.com/documentation/embeds" />

::: details Click to show more

:::: steps

1. ==Entry==

    <ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/spotify-player1.png" />

2. ==Generate Code==

    <ImageCard image="https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/notes/spotify-player2.png" />

3. ==Copy Code==

    ::: tip ==Normal== and ==Compact== differ only in player height
    * Normal: 352px
    * Compact: 152px
    :::

    ::: tabs

    @tab 📥 Normal

    ```html:no-line-numbers
    <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/50zTqYDKkup6TbU3TFpdN3?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    ```

    @tab ⚡ Compact

    ```html:no-line-numbers
    <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/playlist/50zTqYDKkup6TbU3TFpdN3?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    ```

    :::

    ::: important `50zTqYDKkup6TbU3TFpdN3` is the `playlistId` used by the component.
    :::

::::

## ✍️ Implementation

:::: steps

1. ==How to create==

    ::: details Create `.vuepress/theme/components/about/SpotifyEmbeded.vue` and define the component as follows:

    @[code vue](../../../.vuepress/theme/components/about/SpotifyEmbeded.vue)

    :::

2. ==How to register==

    ::: note Update `.vuepress/theme/client.ts` as follows:
    :::

   ```ts :collapsed-lines title=".vuepress/theme/client.ts"
    import { defineClientConfig } from 'vuepress/client'
    import SpotifyEmbeded from './theme/components/about/SpotifyEmbeded.vue' // [!code ++] 

    export default defineClientConfig({
      enhance({ app }) {
          app.component('SpotifyEmbeded', SpotifyEmbeded) // [!code ++] 
      },
    })
   ```

3. ==How to use==

    ::: note  You can use this component anywhere, such as in posts or blogs.
    :::

    ```ts :collapsed-lines title="docs/README.md"
    <SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" />
    ```

    ::: warning Warning
    When using this component on the `homepage`, remember to set `type: custom` in the `Frontmatter`, otherwise it won’t render properly.

      ::: details Click to show more

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

4. ==Final Result==

    <SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" />

::::

## 📖 Props

:::: field-group

::: field name="playlistId" type="string"
Spotify playlist ID
:::

::: field name="mode" type="'compact' | 'normal'" default="normal" optional
Display mode (forced)

* `normal`: standard mode, default height `352px`
* `compact`: compact mode, default height `152px`
:::

::: field name="breakpoint" type="number" default="768" optional
Responsive breakpoint

* `normal mode`: > 768px
* `compact mode`: <= 768px
:::

::::

## 🚀 Usage

::: table full-width title="Display Mode(forced)" max-content

| Mode | Description | Examples |
| -- | -- | -- |
| default | Default: responsive mode <br> <ul><li>`compact`: <= 768px</li><li>`normal`: > 768px</li></ul> | `<SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" />` |
| normal | Height is fixed at `352px` and does not change with window size | `<SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="normal" />` |
| compact | Height is fixed at `152px` and does not change with window size. | `<SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="compact" />` |
| responsive | <ul><li>`compact`: <= breakpoint</li><li>`normal`: > breakpoint</li></ul> | `<SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" :breakpoint="900" />` |

:::

## ✨ Preview

### 1️⃣ default

<SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" />

### 2️⃣ normal

<SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="normal" />

### 3️⃣ compact

<SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="compact" />

### 4️⃣ responsive

<SpotifyEmbeded playlistId="50zTqYDKkup6TbU3TFpdN3" :breakpoint="900" />

## 💭 Inspiration

### 🎵 Apple Music Playlist

::: note `Apple Music` can be wrapped in the same way.
:::

<LinkCard icon="mdi:web" title="Apple Music Marketing Tools" href="https://toolbox.marketingtools.apple.com/en-us/apple-music/cn" />

```html:no-line-numbers
<iframe height="450" width="100%" title="Media player" src="https://embed.music.apple.com/cn/album/first-kiss/1443278696?itscg=30200&amp;itsct=music_box_player&amp;ls=1&amp;app=music&amp;mttnsubad=1443278696&amp;theme=auto" id="embedPlayer" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" allow="autoplay *; encrypted-media *; clipboard-write" style="border: 0px; border-radius: 12px; width: 100%; height: 450px; max-width: 660px;"></iframe>
```

<iframe height="450" width="100%" title="Media player" src="https://embed.music.apple.com/cn/album/first-kiss/1443278696?itscg=30200&amp;itsct=music_box_player&amp;ls=1&amp;app=music&amp;mttnsubad=1443278696&amp;theme=auto" id="embedPlayer" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" allow="autoplay *; encrypted-media *; clipboard-write" style="border: 0px; border-radius: 12px; width: 100%; height: 450px; max-width: 660px;"></iframe>

## 🔖 Summary

::: info

A lightweight wrapper around Spotify’s official iframe, standardizing the UI and providing simple mode and breakpoint controls for consistent display and responsive switching.

:::
