---
title: 模块标题组件-SectionTitle
sticky: true
tags:
  - 组件
  - 自定义组件
  - SectionTitle
  - 图标
createTime: 2026/04/22 16:07:43
permalink: /blog/6e1h43ek/
---

::: important 首个自定义组件，支持图标与标题的 `模块标题组件` 实现记录
:::

<!-- more -->

## 💡 动机

::: info 为什么要做这个组件？

* 熟悉组件的用法
* 统一模块标题样式

:::

## 🎯 设计目标

::: info 用一个组件统一所有 “模块标题样式”

* ✅ 支持标题传参
* ✅ 支持图标（Iconify）

:::

## ✨ 效果预览

<CardGrid>
    <SectionTitle title="常用仓库" icon="codicon:repo" />
    <SectionTitle title="版本号" icon="codicon:versions" />
</CardGrid>

## ✍️ 实现步骤

:::: steps

1. ==编写组件==

   ```vue :collapsed-lines title=".vuepress/theme/components/SectionTitle.vue"
    <script setup lang="ts">
    import { Icon } from '@iconify/vue'

    defineProps(['title', 'icon'])
    </script>

    <template>
      <div class="section-title">
        <Icon v-if="icon" :icon="icon" />
        <span>{{ title }}</span>
      </div>
    </template>

    <style scoped>
    .section-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-align: center;

      background: linear-gradient(
        270deg,
        var(--vp-c-purple-1),
        var(--vp-c-brand-2),
        var(--vp-c-purple-1)
      );

      background-size: 200% 100%;
      animation: gradient-flow 2s linear infinite;

      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section-title::before,
    .section-title::after {
      content: "";
      flex: 1;
      height: 2px;

      background: linear-gradient(
        270deg,
        var(--vp-c-purple-1),
        var(--vp-c-brand-2),
        var(--vp-c-purple-1)
      );

      background-size: 200% 100%;
      animation: gradient-flow 2s linear infinite;

      border-radius: 2px;
    }

    @keyframes gradient-flow {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: 200% 50%;
      }
    }
    </style>  
   ```

2. ==注册组件==

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

## 🔖 总结

::: info

虽然只是一个很小的标题组件，但在不断调整与测试的过程中，也慢慢感受到：

🧩 前端不仅是“写页面”，更是在“设计结构”，感觉很“有意思”！！！

:::
