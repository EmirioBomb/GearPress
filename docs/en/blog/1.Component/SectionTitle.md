---
title: Custom Component-SectionTitle
sticky: true
tags:
  - component
  - custom-component
  - SectionTitle
  - icon
createTime: 2026/04/22 15:59:30
permalink: /en/blog/6e1h43ek/
---

::: important My First Custom Component: Building a `SectionTitle` with Icon Support
:::

<!-- more -->

## 💡 Motivation

::: info Why I built this?

* Get familiar with how components work
* Keep section titles visually consistent

:::

## 🎯 Goals

::: info Consistent section titles with one component

* ✅ Accept dynamic title via props  
* ✅ Support icons (Iconify)

:::

## ✨ Preview

<CardGrid>
    <SectionTitle title="Repository" icon="codicon:repo" />
    <SectionTitle title="Version" icon="codicon:versions" />
</CardGrid>

## ✍️ Implementation

:::: steps

1. ==How to create==

  ::: info Add a `SectionTitle.vue` component under `.vuepress/theme/components`
  :::

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

1. ==How to register==

    ::: info Update `.vuepress/theme/client.ts` as follows:
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

2. ==How to use==

    ::: info You can use this component anywhere, such as in posts or blogs.
    :::

    ```ts :collapsed-lines title="docs/README.md"
    <SectionTitle title="Repository" icon="codicon:repo" />
    ```

    ::: warning
    When using this component on the `homepage`, remember to set `type: custom` in the `Frontmatter`, otherwise it won’t render properly.

    ```ts title="docs/README.md"
    ---
    home: true
    pageLayout: home
    externalLinkIcon: false
    config:
      - type: custom  // [!code ++] 
    ---

    <SectionTitle title="Repository" icon="codicon:repo" />
    ```

    :::

3. ==Final Result==

    <SectionTitle title="Repository" icon="codicon:repo" />

::::

## 🔖 Summary

::: info

It’s a small and basic component, but while working on it, I noticed something:

🧩 Front-end isn’t just about how things look — it’s also about how everything fits together.

And honestly, that’s the part I enjoy the most.

:::
