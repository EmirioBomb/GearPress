---
title: 个性签名卡片-ProfileCard
tags:
    - 组件
    - 个性签名
cover: https://cdn.jsdelivr.net/gh/EmirioBomb/media-collections@main/GearPress/profile/sticker.gif
createTime: 2026/05/15 15:42:52
permalink: /blog/profile-card/
---


::: tip `个性签名`
:::

<!-- more -->

## 💡 动机

::: info 为什么要做这个组件？

统一签名样式，增强氛围与视觉识别

:::

## 🎯 设计目标

::: info

* ✅ 优化布局结构与视觉表现
* ✅ 增强页面层次与氛围感

:::

## ✍️ 实现步骤

:::: steps

1. ==编写组件==

    ::: details 新建组件文件，路径为: `.vuepress/theme/components/about/ProfileCard.vue`，并实现如下内容

    @[code vue](../../.vuepress/theme/components/about/ProfileCard.vue)

    :::

2. ==注册组件==

    ::: note 修改如下文件: `.vuepress/theme/client.ts`
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

3. ==使用组件==

    ::: note 该组件可在任意位置使用，例如文章或博客中
    :::

    ```ts :collapsed-lines title="docs/README.md"
    <ProfileCard />
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

    <ProfileCard />

::::

## 📖 属性定义

:::: field-group

::: field name="boxMode" type="string" default="banner" optional
控制组件的外观样式

* `profile`：卡片样式，占满父容器宽度的卡片布局，具备完整块级展示结构
* `banner`：横幅样式，仅包裹内容的内联式布局，不占满整行
:::

::: field name="align" type="'left' | 'center' | 'right'" default="center" optional
对齐方式

* `left`: 左对齐
* `center`: 居中
* `right`: 右对齐
:::

::::

## 🚀 用法用例

::: table full-width title="外观样式" max-content

| 外观样式 | 说明 | 样例 |
| -- | -- | -- |
| 默认样式 | 默认为 `横幅样式` | `<ProfileCard />` |
| 卡片样式 | 占满父容器宽度的卡片布局 | `<ProfileCard boxMode="profile" />` |
| 横幅样式 | 仅包裹内容的内联式布局 | `<ProfileCard boxMode="banner" />` |
| 对齐方式 | <ul><li>`left`: 左对齐</li><li>`center`: 居中</li><li>`right`: 右对齐</li></ul> | `<ProfileCard align="left"/>` |

:::

## ✨ 效果预览

### 1️⃣ 默认模式

<ProfileCard />

### 2️⃣ 卡片样式

<ProfileCard boxMode="profile" />

### 3️⃣ 横幅样式

<ProfileCard boxMode="banner" />

### 4️⃣ 对齐方式

<ProfileCard align="left"/>
<ProfileCard align="center"/>
<ProfileCard align="right"/>

## 📚 引用

<CardGrid cols=2>
    <LinkCard icon="mdi:web" title="readme-typing-svg" href="https://readme-typing-svg.demolab.com/demo/" />
    <LinkCard icon="mdi:web" title="Mochi Stickers" href="https://getstickerpack.com/stickers?query=mochi" />
</CardGrid>