---
title: 区块标题组件-SectionTitle
sticky: true
tags:
  - 组件
  - 自定义组件
  - SectionTitle
  - 图标
createTime: 2026/04/22 16:07:43
permalink: /blog/section-title/
---

::: important 首个自定义组件，支持图标与标题的 `区块标题组件` 实现记录
:::

<!-- more -->

## 💡 动机

::: info 为什么要做这个组件？

* 熟悉组件的用法
* 统一区块标题样式

:::

## 🎯 设计目标

::: info 用一个组件统一所有 “区块标题样式”

* ✅ 支持标题传参
* ✅ 支持图标（Iconify）

:::

## ✍️ 实现步骤

:::: steps

1. ==编写组件==

    ::: details 新建组件文件，路径为: `.vuepress/theme/components/SectionTitle.vue`，并实现如下内容

    @[code vue](../../.vuepress/theme/components/SectionTitle.vue)

    :::

2. ==注册组件==

    ::: note 修改如下文件: `.vuepress/theme/client.ts`
    :::

   ```ts :collapsed-lines title=".vuepress/theme/client.ts"
    import { defineClientConfig } from 'vuepress/client'
    import SectionTitle from './theme/components/SectionTitle.vue'  // [!code ++] 

    export default defineClientConfig({
      enhance({ app }) {
          app.component('SectionTitle', SectionTitle) // [!code ++] 
      },
    })
   ```

3. ==使用组件==

    ::: note 该组件可在任意位置使用，例如文章或博客中
    :::

    ```ts :collapsed-lines title="docs/README.md"
    <SectionTitle title="常用仓库" icon="codicon:repo" />
    ```

    ::: warning 注意
    若是在 `首页` 使用组件时，请确保在首页的 `Frontmatter` 中配置 `type: custom`，否则组件不生效

    ```ts title="docs/README.md"
    ---
    home: true
    pageLayout: home
    externalLinkIcon: false
    config:
      - type: custom  // [!code ++] 
    ---

    <SectionTitle title="常用仓库" icon="codicon:repo" />
    ```

    :::

4. ==组件效果==

    <SectionTitle title="常用仓库" icon="codicon:repo" />

::::

## 📖 属性定义

:::: field-group

::: field name="title" type="string" optional
区块标题名称
:::

::: field name="icon" type="string" optional
Iconify 图标名称，例如 `mdi:home`、`codicon:repo`
:::

::::

## 🚀 用法用例

| 标题 | 图标 | 状态说明 | 样例 |
| -- | -- | -- | -- |
| ✔ | ✔ | 图标 + 标题 | `<SectionTitle title="常用仓库" icon="codicon:repo" />`|
| ✔ | ✖ | 仅标题 | `<SectionTitle title="常用仓库" />` |
| ✖ | ✔ | 仅图标 | `<SectionTitle icon="codicon:repo" />` |
| ✖ | ✖ | 仅分割线 | `<SectionTitle />` |

## ✨ 效果预览

<CardGrid cols=4>
  <SectionTitle title="常用仓库" icon="codicon:repo" />
  <SectionTitle title="常用仓库" />
  <SectionTitle icon="codicon:repo" />
  <SectionTitle />
</CardGrid>

## 🔖 总结

::: info

虽然只是一个很小的标题组件，但在不断调整与测试的过程中，也慢慢感受到：

🧩 前端不仅是“写页面”，更是在“设计结构”，感觉很“有意思”！！！

:::
