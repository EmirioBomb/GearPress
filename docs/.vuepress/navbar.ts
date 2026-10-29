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
  { text: '导航', icon: 'lucide:compass', link: '/navigation/' },
  { text: '随记', icon: 'codicon:notebook', link: '/notes/macos/homebrew/' },
  {
    text: '关于我',
    icon: 'lucide:user-round',
    link: '/notes/about-me/'
  },
  {
    text: `v${version}`,
    icon: 'codicon:versions',
    badge: '新',
    link: 'CHANGELOG.md'
  }
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', icon: 'codicon:home', link: '/en/' },
  { text: 'Blog', icon: 'codicon:book', link: '/en/blog/' },
  { text: 'Navigation', icon: 'lucide:compass', link: '/en/navigation/' },
  { text: 'Notes', icon: 'codicon:notebook', link: '/en/notes/macos/homebrew/' },
  {
    text: 'About Me',
    icon: 'lucide:user-round',
    link: '/en/notes/about-me/'
  },
  {
    text: `v${version}`,
    icon: 'codicon:versions',
    badge: 'New',
    link: '/en/CHANGELOG.md'
  },
])

