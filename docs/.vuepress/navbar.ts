/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'
import { version } from '../../package.json'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', icon: 'codicon:home', link: '/' },
  { text: '博客', icon: 'codicon:book', link: '/blog/' },
  // { text: '开发笔记', icon: 'codicon:note', link: '/notes/' },
  // { text: '归档', link: '/blog/archives/' },
  { 
    text: `v${version}`, 
    icon: 'codicon:versions', 
    badge: '新', 
    items: [
      { 
        text: '更新日志',
        icon: 'codicon:versions', 
        link: 'CHANGELOG.md'
      }
    ]
  },
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', icon: 'codicon:home', link: '/en/' },
  { text: 'Blog', icon: 'codicon:book', link: '/en/blog/' },
  // { text: 'Tags', link: '/en/blog/tags/' },
  // { text: 'Archives', link: '/en/blog/archives/' },
  { 
    text: `v${version}`, 
    icon: 'codicon:versions', 
    badge: 'New', 
    items: [
      { 
        text: 'Changelog',
        icon: 'codicon:versions', 
        link: '/en/CHANGELOG.md'
      }
    ]
  },
])

