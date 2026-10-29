---
title: Spotify Embedded Player-SpotifyEmbedded
tags:
    - Component
    - Spotify
    - Web Player
cover: https://image.emiriobaan.top/GearPress/post-cover/spotify.png
createTime: 2026/05/14 09:35:00
permalink: /en/blog/spotify-embedded/
---

::: tip A web player component based on `Spotify Embed playlist`
:::

<!-- more -->

## 💡 Motivation

::: info Why I built this?

* Controls player layout style
* Supports multiple display modes to suit different page needs
* Configures player height consistently through `mode` or `height`

:::

## 🎯 Goals

::: info Configurable Props

* ✅ Supports playlist switching
* ✅ Supports display mode control (normal mode / compact mode / full mode)

:::

## 🎧 Get Embedded playlist

<LinkCard icon="mdi:web" title="Spotify Embed Player documentation" href="https://developer.spotify.com/documentation/embeds" />

::: details Click to show more

:::: steps

1. ==Entry==

    <ImageCard image="https://image.emiriobaan.top/GearPress/notes/spotify-player1.png" />

2. ==Generate Code==

    <ImageCard image="https://image.emiriobaan.top/GearPress/notes/spotify-player2.png" />

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

    ::: details Create `.vuepress/theme/components/about/SpotifyEmbedded.vue` and define the component as follows:

    @[code vue](../../../.vuepress/theme/components/about/SpotifyEmbedded.vue)

    :::

2. ==How to register==

    ::: note Update `docs/.vuepress/client.ts` as follows:
    :::

   ```ts :collapsed-lines title="docs/.vuepress/client.ts"
    import { defineClientConfig } from 'vuepress/client'
    import SpotifyEmbedded from './theme/components/about/SpotifyEmbedded.vue' // [!code ++] 

    export default defineClientConfig({
      enhance({ app }) {
          app.component('SpotifyEmbedded', SpotifyEmbedded) // [!code ++] 
      },
    })
   ```

3. ==How to use==

    ::: note  You can use this component anywhere, such as in posts or blogs.
    :::

    ```vue :collapsed-lines title="docs/README.md"
    <SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" />
    ```

    ::: warning Warning
    When using this component on the `homepage`, remember to set `type: custom` in the `Frontmatter`, otherwise it won’t render properly.

      ::: details Click to show more

      ```yaml title="docs/README.md"
        ---
        home: true
        pageLayout: home
        externalLinkIcon: false
        config:
        - type: custom  # [!code ++]
        ---
      ```

      :::

    :::

4. ==Final Result==

    <SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" />

::::

## 📖 Props

:::: field-group

::: field name="playlistId" type="string"
Spotify playlist ID
:::

::: field name="mode" type="'normal' | 'compact' | 'full'" default="normal" optional
Display mode; does not switch automatically with screen width

* `normal`: standard mode, default height `352px`
* `compact`: compact mode, default height `152px`
* `full`: Uses `100%` height to fill the parent container, which must have an explicit height
:::

::: field name="height" type="number" optional
Component height in `px`; overrides the height determined by `mode` when set
:::

::::

## 🚀 Usage

::: table full-width title="Display Mode" max-content

| Mode | Description | Examples |
| -- | -- | -- |
| default | Default: `normal mode` | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" />` |
| normal | Height is `352px` when height is not set | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="normal" />` |
| compact | Height is `152px` when height is not set | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="compact" />` |
| full | Fills the parent container, which must have an explicit height | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="full" />` |
| custom height | Set custom height | `<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" :height="152" />` |

:::

## ✨ Preview

### 1️⃣ default

<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" />

### 2️⃣ normal

<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="normal" />

### 3️⃣ compact

<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="compact" />

### 4️⃣ full

::: warning The parent container must have an explicit height. Do not also set the component's `height`, as it overrides the height determined by `full` mode.

```vue:no-line-numbers
<div style="height: 352px;">
  <SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="full" />
</div>
```

:::

<div style="height: 352px;">
  <SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" mode="full" />
</div>

### 5️⃣ custom height

<SpotifyEmbedded playlistId="50zTqYDKkup6TbU3TFpdN3" :height="152" />

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

A lightweight wrapper around Spotify’s official iframe, standardizing display styles and using `mode` and `height` to control player height for consistent embedding.

:::
