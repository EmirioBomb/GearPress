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

## ✍️ Implementation

:::: steps

1. ==How to create==

    ::: details Create `.vuepress/theme/components/SectionTitle.vue` and define the component as follows:

      @[code vue](../../../.vuepress/theme/components/SectionTitle.vue)

    :::

2. ==How to register==

    ::: note Update `.vuepress/theme/client.ts` as follows:
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

3. ==How to use==

    ::: note You can use this component anywhere, such as in posts or blogs.
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

4. ==Final Result==

    <SectionTitle title="Repository" icon="codicon:repo" />

::::

## 📖 Props

:::: field-group

::: field name="title" type="string" optional
Section title
:::

::: field name="icon" type="string" optional
Iconify icon name, like `mdi:home` or `codicon:repo`
:::

::::

## 🚀 Usage

| title| icon | status | sample |
| -- | -- | -- | -- |
| ✔ | ✔ | icon + title | `<SectionTitle title="Repository" icon="codicon:repo" />`|
| ✔ | ✖ | title only | `<SectionTitle title="Repository" />` |
| ✖ | ✔ | icon only | `<SectionTitle icon="codicon:repo" />` |
| ✖ | ✖ | divider | `<SectionTitle />` |

## ✨ Preview

<CardGrid cols=4>
  <SectionTitle title="Repository" icon="codicon:repo" />
  <SectionTitle title="Repository" />
  <SectionTitle icon="codicon:repo" />
  <SectionTitle />
</CardGrid>

## 🔖 Summary

::: info

It’s a small and basic component, but while working on it, I noticed something:

🧩 Front-end isn’t just about how things look — it’s also about how everything fits together.

And honestly, that’s the part I enjoy the most.

:::
