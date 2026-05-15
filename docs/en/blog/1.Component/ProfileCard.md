---
title: Profile Card
tags:
    - Component
    - ProfileCard
cover: https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/profile/sticker.gif
createTime: 2026/05/15 15:42:52
permalink: /en/blog/profile-card/
---


::: tip About `Profile Card`
:::

<!-- more -->

## 💡 Motivation

::: info Why I built this?

Consistent profile style with improved visual presence

:::

## 🎯 Goals

::: info

* ✅ Optimize layout and visual presentation
* ✅ Improve hierarchy and styles

:::

## ✍️ Implementation

:::: steps

1. ==How to create==

    ::: details Create `.vuepress/theme/components/about/ProfileCard.vue`

    @[code vue](../../../.vuepress/theme/components/about/ProfileCard.vue)

    :::

2. ==How to register==

    ::: note Update `.vuepress/theme/client.ts`
    :::

   ```ts :collapsed-lines title=".vuepress/theme/client.ts"
    import { defineClientConfig } from 'vuepress/client'
    import ProfileCard from './theme/components/about/ProfileCard.vue' // [!code ++] 

    export default defineClientConfig({
      enhance({ app }) {
          app.component('ProfileCard', ProfileCard) // [!code ++] 
      },
    })
   ```

3. ==How to use==

    ::: note You can use this component anywhere, such as in posts or blogs.
    :::

    ```ts :collapsed-lines title="docs/README.md"
    <ProfileCard />
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

    <ProfileCard />

::::

## 📖 Props

:::: field-group

::: field name="boxMode" type="string" default="banner" optional
Controls the component’s visual style

* `profile`: card style, full-width block layout with complete structural presentation
* `banner`: banner style, inline content-only layout that does not span the full width
:::

::: field name="align" type="'left' | 'center' | 'right'" default="center" optional
Alignment

* `left`: left-aligned
* `center`: center-aligned
* `right`: right-aligned
:::

::::

## 🚀 Usage

::: table full-width title="BoxMode" max-content

| BoxMode | Description | Examples |
| -- | -- | -- |
| default | Default: `banner` | `<ProfileCard />` |
| profile | full-width block layout | `<ProfileCard boxMode="profile" />` |
| banner | inline content-only layout | `<ProfileCard boxMode="banner" />` |
| alignment | <ul><li>`left`: left-aligned</li><li>`center`: center-aligned</li><li>`right`: right-aligned</li></ul> | `<ProfileCard align="left"/>` |

:::

## ✨ Preview

### 1️⃣ default

<ProfileCard />

### 2️⃣ profile

<ProfileCard boxMode="profile" />

### 3️⃣ banner

<ProfileCard boxMode="banner" />

### 4️⃣ alignment

<ProfileCard align="left"/>
<ProfileCard align="center"/>
<ProfileCard align="right"/>

## 📚 Reference

<CardGrid cols=2>
    <LinkCard icon="mdi:web" title="readme-typing-svg" href="https://readme-typing-svg.demolab.com/demo/" />
    <LinkCard icon="mdi:web" title="Mochi Stickers" href="https://getstickerpack.com/stickers?query=mochi" />
</CardGrid>
